import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Car, Clock, CheckCircle2, XCircle, Loader2, Search, Filter } from "lucide-react";
import { getUserBookings, cancelBooking, updateBookingStatus, type Booking, BookingStatus } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const MyServices = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  
  // Filter state - all statuses selected by default
  const [selectedStatuses, setSelectedStatuses] = useState<Set<BookingStatus>>(
    new Set([
      BookingStatus.PENDING,
      BookingStatus.ANALYSE,
      BookingStatus.IN_PROGRESS,
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
    ])
  );

  // Check if user is Admin or Super Admin
  const isAdmin = user?.role?.name === "admin" || user?.role?.name === "super" || user?.is_superuser;

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getUserBookings();
      setBookings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Check if redirected from successful booking
    const state = location.state as { bookingSuccess?: boolean; serviceName?: string } | null;
    if (state?.bookingSuccess) {
      toast({
        title: "Booking Successful!",
        description: `${state.serviceName || 'Service'} has been booked successfully.`,
        duration: 5000,
      });
      window.history.replaceState({}, document.title);
    }

    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate, location.state]);

  const handleCancel = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      await loadBookings();
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only Admin and Super Admin can change booking status",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingStatusId(bookingId);
      const updatedBooking = await updateBookingStatus(bookingId, newStatus);
      toast({
        title: "Status Updated Successfully",
        description: `Booking #${bookingId} moved to ${getStatusLabel(newStatus)}`,
        duration: 3000,
      });
      // Reload bookings to reflect the change
      await loadBookings();
    } catch (error) {
      console.error("Failed to update booking status:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update booking status. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const getStatusLabel = (status: BookingStatus): string => {
    const labels: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: "Pending",
      [BookingStatus.ANALYSE]: "Analyse",
      [BookingStatus.IN_PROGRESS]: "In Progress",
      [BookingStatus.COMPLETED]: "Done",
      [BookingStatus.CANCELLED]: "Cancelled",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: BookingStatus): string => {
    const colors: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-300",
      [BookingStatus.ANALYSE]: "bg-blue-100 text-blue-800 border-blue-300",
      [BookingStatus.IN_PROGRESS]: "bg-purple-100 text-purple-800 border-purple-300",
      [BookingStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-300",
      [BookingStatus.CANCELLED]: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || colors[BookingStatus.PENDING];
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.COMPLETED:
        return <CheckCircle2 className="h-4 w-4" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getNextStatus = (currentStatus: BookingStatus): BookingStatus | null => {
    switch (currentStatus) {
      case BookingStatus.PENDING:
        return BookingStatus.ANALYSE;
      case BookingStatus.ANALYSE:
        return BookingStatus.IN_PROGRESS;
      case BookingStatus.IN_PROGRESS:
        return BookingStatus.COMPLETED;
      case BookingStatus.COMPLETED:
      case BookingStatus.CANCELLED:
        return null; // No next state
      default:
        return null;
    }
  };

  // Filter bookings based on selected statuses
  const filteredBookings = bookings.filter(b => selectedStatuses.has(b.status));
  
  // Group filtered bookings by status
  const groupedBookings = {
    [BookingStatus.PENDING]: filteredBookings.filter(b => b.status === BookingStatus.PENDING),
    [BookingStatus.ANALYSE]: filteredBookings.filter(b => b.status === BookingStatus.ANALYSE),
    [BookingStatus.IN_PROGRESS]: filteredBookings.filter(b => b.status === BookingStatus.IN_PROGRESS),
    [BookingStatus.COMPLETED]: filteredBookings.filter(b => b.status === BookingStatus.COMPLETED),
    [BookingStatus.CANCELLED]: filteredBookings.filter(b => b.status === BookingStatus.CANCELLED),
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status: BookingStatus, checked: boolean) => {
    setSelectedStatuses(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(status);
      } else {
        newSet.delete(status);
      }
      return newSet;
    });
  };
  
  // Handle "All" checkbox
  const handleAllFilterChange = (checked: boolean) => {
    if (checked) {
      setSelectedStatuses(new Set([
        BookingStatus.PENDING,
        BookingStatus.ANALYSE,
        BookingStatus.IN_PROGRESS,
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED,
      ]));
    } else {
      setSelectedStatuses(new Set());
    }
  };
  
  // Check if all statuses are selected
  const allStatusesSelected = selectedStatuses.size === 5;

  const columns = [
    { status: BookingStatus.PENDING, title: "Pending", color: "border-yellow-300 bg-yellow-50/50" },
    { status: BookingStatus.ANALYSE, title: "Analyse", color: "border-blue-300 bg-blue-50/50" },
    { status: BookingStatus.IN_PROGRESS, title: "In Progress", color: "border-purple-300 bg-purple-50/50" },
    { status: BookingStatus.COMPLETED, title: "Done", color: "border-green-300 bg-green-50/50" },
    { status: BookingStatus.CANCELLED, title: "Cancelled", color: "border-red-300 bg-red-50/50" },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Services</h1>
              <p className="text-gray-600">View and manage your service bookings</p>
            </div>
            
            {/* Filter Checkboxes */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="filter-all"
                  checked={allStatusesSelected}
                  onCheckedChange={handleAllFilterChange}
                />
                <label
                  htmlFor="filter-all"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  All
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="filter-pending"
                  checked={selectedStatuses.has(BookingStatus.PENDING)}
                  onCheckedChange={(checked) => handleStatusFilterChange(BookingStatus.PENDING, checked as boolean)}
                />
                <label
                  htmlFor="filter-pending"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Pending
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="filter-analyse"
                  checked={selectedStatuses.has(BookingStatus.ANALYSE)}
                  onCheckedChange={(checked) => handleStatusFilterChange(BookingStatus.ANALYSE, checked as boolean)}
                />
                <label
                  htmlFor="filter-analyse"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Analyse
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="filter-in-progress"
                  checked={selectedStatuses.has(BookingStatus.IN_PROGRESS)}
                  onCheckedChange={(checked) => handleStatusFilterChange(BookingStatus.IN_PROGRESS, checked as boolean)}
                />
                <label
                  htmlFor="filter-in-progress"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  In Progress
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="filter-done"
                  checked={selectedStatuses.has(BookingStatus.COMPLETED)}
                  onCheckedChange={(checked) => handleStatusFilterChange(BookingStatus.COMPLETED, checked as boolean)}
                />
                <label
                  htmlFor="filter-done"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Done
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="filter-cancelled"
                  checked={selectedStatuses.has(BookingStatus.CANCELLED)}
                  onCheckedChange={(checked) => handleStatusFilterChange(BookingStatus.CANCELLED, checked as boolean)}
                />
                <label
                  htmlFor="filter-cancelled"
                  className="text-sm font-medium text-gray-700 cursor-pointer select-none"
                >
                  Cancelled
                </label>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-gray-600">Loading your bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">You haven't booked any services yet.</p>
            <Button onClick={() => navigate('/services')} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
              Browse Services
            </Button>
          </Card>
        ) : selectedStatuses.size === 0 ? (
          <Card className="p-12 text-center">
            <Filter className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Filters Selected</h2>
            <p className="text-gray-600 mb-6">Please select at least one status filter to view bookings.</p>
            <Button 
              onClick={() => handleAllFilterChange(true)} 
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              Show All Bookings
            </Button>
          </Card>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {columns.map((column) => {
                const columnBookings = groupedBookings[column.status];
                return (
                  <div
                    key={column.status}
                    className={cn(
                      "flex-shrink-0 w-80 border-2 rounded-lg p-4",
                      column.color
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {column.title}
                      </h3>
                      <Badge className={cn("font-semibold", getStatusColor(column.status))}>
                        {columnBookings.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                      {columnBookings.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                          No bookings
                        </div>
                      ) : (
                        columnBookings.map((booking) => (
                          <Card
                            key={booking.id}
                            className="bg-white hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/booking/${booking.id}`)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <CardTitle className="text-base font-semibold">
                                  {booking.service_name || "Service Booking"}
                                </CardTitle>
                                <Badge className={cn("text-xs", getStatusColor(booking.status))}>
                                  {getStatusIcon(booking.status)}
                                </Badge>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-3">
                              {/* Vehicle Info */}
                              <div className="flex items-start gap-2">
                                <Car className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500">Vehicle</p>
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {booking.car_brand || booking.vehicle_make} {booking.car_model || booking.vehicle_model}
                                  </p>
                                  {booking.fuel_type && (
                                    <p className="text-xs text-gray-500 mt-0.5">Fuel: {booking.fuel_type}</p>
                                  )}
                                </div>
                              </div>

                              {/* Booking Date */}
                              <div className="flex items-start gap-2">
                                <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500">Date</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {format(new Date(booking.booking_date), "MMM d, yyyy")}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {format(new Date(booking.booking_date), "h:mm a")}
                                  </p>
                                </div>
                              </div>

                              {/* Booking ID */}
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-500">
                                  Booking ID: <span className="font-mono font-semibold">#{booking.id}</span>
                                </p>
                                {booking.estimated_cost && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Est. Cost: <span className="font-semibold">₹{booking.estimated_cost.toLocaleString()}</span>
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="pt-2 border-t border-gray-200 space-y-2" onClick={(e) => e.stopPropagation()}>
                                {isAdmin && (() => {
                                  const nextStatus = getNextStatus(booking.status);
                                  if (nextStatus) {
                                    return (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleStatusChange(booking.id, nextStatus)}
                                        disabled={updatingStatusId === booking.id}
                                        className="w-full text-xs h-8 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                                      >
                                        {updatingStatusId === booking.id ? (
                                          <>
                                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                            Updating...
                                          </>
                                        ) : (
                                          `Move to ${getStatusLabel(nextStatus)}`
                                        )}
                                      </Button>
                                    );
                                  }
                                  return null;
                                })()}
                                
                                {booking.status !== BookingStatus.COMPLETED && 
                                 booking.status !== BookingStatus.CANCELLED && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancel(booking.id)}
                                    disabled={cancellingId === booking.id}
                                    className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs h-7"
                                  >
                                    {cancellingId === booking.id ? (
                                      <>
                                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                        Cancelling...
                                      </>
                                    ) : (
                                      "Cancel Booking"
                                    )}
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyServices;
