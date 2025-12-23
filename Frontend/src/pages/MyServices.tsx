import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, Car, Clock, CheckCircle2, XCircle, Loader2, AlertCircle, MapPin, Wrench, Search, Mail, User, ChevronRight, LayoutGrid, ArrowRight, Trash2 } from "lucide-react";
import { getUserBookings, cancelBooking, updateBookingStatus, type Booking, BookingStatus } from "@/services/bookingService";
import { getBookingCosts } from "@/services/costService";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Helper to format DB date strings exactly as they appear, ignoring timezone
const formatDbDate = (dateStr: string, formatStr: string) => {
  if (!dateStr) return "";
  try {
    // Attempt to parse ISO string parts directly to avoid timezone conversion
    // Expected format: YYYY-MM-DDTHH:mm:ss...
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(dateStr);
    if (match) {
      // Construct local date with exact components
      const date = new Date(
        parseInt(match[1]),
        parseInt(match[2]) - 1,
        parseInt(match[3]),
        parseInt(match[4]),
        parseInt(match[5])
      );
      return format(date, formatStr);
    }
    // Fallback to standard parsing if regex fails
    return format(new Date(dateStr), formatStr);
  } catch (e) {
    return dateStr;
  }
};

const MyServices = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [bookingCosts, setBookingCosts] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const isAdmin = user?.role?.name?.toLowerCase() === "admin" || user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;
  const isSuperAdmin = user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;

  const getNextStatus = (currentStatus: BookingStatus): BookingStatus | null => {
    switch (currentStatus) {
      case BookingStatus.PENDING: return BookingStatus.ANALYSE;
      case BookingStatus.ANALYSE: return BookingStatus.IN_PROGRESS;
      case BookingStatus.IN_PROGRESS: return BookingStatus.COMPLETED;
      default: return null;
    }
  };

  const handleMoveToNextStage = async (e: React.MouseEvent, booking: Booking) => {
    e.stopPropagation();
    const nextStatus = getNextStatus(booking.status);
    if (!nextStatus) return;

    try {
      setUpdatingId(booking.id);
      await updateBookingStatus(booking.id, nextStatus);
      toast({
        title: "Status Updated",
        description: `Booking moved to ${nextStatus.replace('_', ' ')}`,
      });
      await loadBookings();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        await logout();
        navigate('/');
        return;
      }

      const data = await getUserBookings();
      const sortedData = data.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());
      setBookings(sortedData);

      const costsMap: Record<number, number> = {};
      await Promise.all(
        sortedData.map(async (booking) => {
          try {
            const costsResponse = await getBookingCosts(booking.id);
            costsMap[booking.id] = costsResponse.total;
          } catch {
            costsMap[booking.id] = 0;
          }
        })
      );
      setBookingCosts(costsMap);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    const state = location.state as { bookingSuccess?: boolean; serviceName?: string } | null;
    if (state?.bookingSuccess) {
      toast({
        title: "Booking Successful!",
        description: state.serviceName ? `${state.serviceName} booked successfully.` : "Service booked successfully.",
        duration: 5000,
      });
      window.history.replaceState({}, document.title);
    }

    loadBookings();
  }, [isAuthenticated, navigate, location.state]);

  const confirmDelete = (e: React.MouseEvent, bookingId: number) => {
    e.stopPropagation();
    setBookingToDelete(bookingId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      setCancellingId(bookingToDelete);
      await cancelBooking(bookingToDelete);
      toast({
        title: "Booking Deleted",
        description: "The booking has been deleted successfully.",
      });
      await loadBookings();
    } catch (error) {
      if (error instanceof Error && (error.message.includes('404') || error.message.toLowerCase().includes('not found'))) {
        toast({
          title: "Booking Already Deleted",
          description: "The booking was already deleted.",
        });
        await loadBookings();
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete booking",
          variant: "destructive",
        });
      }
    } finally {
      setCancellingId(null);
      setBookingToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    const colors: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: "bg-white text-yellow-800 border-yellow-200",
      [BookingStatus.ANALYSE]: "bg-white text-blue-800 border-blue-200",
      [BookingStatus.IN_PROGRESS]: "bg-white text-purple-800 border-purple-200",
      [BookingStatus.COMPLETED]: "bg-white text-green-800 border-green-200",
      [BookingStatus.CANCELLED]: "bg-white text-red-800 border-red-200",
    };

    return colors[status] || colors[BookingStatus.PENDING];
  };

  const getSubtleBgColor = (status: BookingStatus) => {
    const colors: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: "bg-[#F5E6D3]",
      [BookingStatus.ANALYSE]: "bg-[#DBEAFE]",
      [BookingStatus.IN_PROGRESS]: "bg-[#F3E8FF]",
      [BookingStatus.COMPLETED]: "bg-[#DCFCE7]",
      [BookingStatus.CANCELLED]: "bg-[#FEE2E2]",
    };
    return colors[status] || "bg-white";
  };

  const getTabActiveColor = (status: string) => {
    if (status === "all") return "data-[state=active]:bg-gray-800";
    const colors: Record<string, string> = {
      [BookingStatus.PENDING]: "data-[state=active]:bg-yellow-500",
      [BookingStatus.ANALYSE]: "data-[state=active]:bg-blue-600",
      [BookingStatus.IN_PROGRESS]: "data-[state=active]:bg-purple-600",
      [BookingStatus.COMPLETED]: "data-[state=active]:bg-green-600",
      [BookingStatus.CANCELLED]: "data-[state=active]:bg-red-600",
    };
    return colors[status] || "data-[state=active]:bg-gray-800";
  };

  const filterBookings = (status: string) => {
    let filtered = status === "all" ? bookings : bookings.filter((b) => b.status === status);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        (b.service_name?.toLowerCase() || "").includes(query) ||
        (b.car_brand?.toLowerCase() || "").includes(query)
      );
    }
    return filtered;
  };

  // Group bookings by booking_group_id
  const groupBookingsByGroupId = (bookingsList: Booking[]) => {
    const groups: { [key: string]: Booking[] } = {};
    const ungrouped: Booking[] = [];

    bookingsList.forEach(booking => {
      if (booking.booking_group_id) {
        if (!groups[booking.booking_group_id]) {
          groups[booking.booking_group_id] = [];
        }
        groups[booking.booking_group_id].push(booking);
      } else {
        ungrouped.push(booking);
      }
    });

    // Return array of groups (each containing one or more bookings)
    return [
      ...Object.values(groups),
      ...ungrouped.map(b => [b])
    ];
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Services</h1>
              <p className="text-gray-500">Track and manage your vehicle service history</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:w-[280px] bg-white"
                />
              </div>
              <Button 
                onClick={() => navigate("/services")}
                className="bg-black hover:bg-gray-800 text-white whitespace-nowrap"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Book New Service
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 w-full justify-start overflow-x-auto h-auto p-1 bg-white border rounded-xl">
              {["all", BookingStatus.PENDING, BookingStatus.ANALYSE, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.CANCELLED].map(status => (
                <TabsTrigger
                  key={status}
                  value={status}
                  className={cn(
                    "capitalize px-4 py-2 min-w-[100px] data-[state=active]:text-white data-[state=active]:shadow-md transition-all",
                    getTabActiveColor(status)
                  )}
                >
                  {status === "all" ? "All" : status.replace('_', ' ')}
                </TabsTrigger>
              ))}
            </TabsList>

            {["all", BookingStatus.PENDING, BookingStatus.ANALYSE, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.CANCELLED].map(status => {
              const filteredBookings = filterBookings(status);
              const groupedBookings = groupBookingsByGroupId(filteredBookings);

              return (
                <TabsContent key={status} value={status}>
                  {groupedBookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border-dashed border-2">
                      <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No bookings found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedBookings.map((bookingGroup, groupIndex) => {
                        // Use the first booking in group for common metadata
                        const primaryBooking = bookingGroup[0];
                        const isGroup = bookingGroup.length > 1;
                        const totalCost = bookingGroup.reduce((sum, b) => sum + (bookingCosts[b.id] || b.estimated_cost || 0), 0);

                        return (
                          <motion.div
                            key={isGroup ? `group-${groupIndex}` : `single-${primaryBooking.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => navigate(`/booking/${primaryBooking.id}`)}
                            className="cursor-pointer"
                          >
                            <Card className={cn("h-full hover:shadow-lg transition-shadow border-l-4 overflow-hidden relative flex flex-col", getSubtleBgColor(primaryBooking.status))}
                              style={{
                                borderLeftColor: primaryBooking.status === BookingStatus.COMPLETED ? '#22c55e' :
                                  primaryBooking.status === BookingStatus.CANCELLED ? '#ef4444' :
                                    primaryBooking.status === BookingStatus.IN_PROGRESS ? '#a855f7' :
                                      primaryBooking.status === BookingStatus.ANALYSE ? '#3b82f6' : '#eab308'
                              }}>
                              <CardHeader className="bg-transparent pb-3">
                                <div className="flex justify-between items-start">
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className={cn("mb-2", getStatusColor(primaryBooking.status))}>
                                      {primaryBooking.status.replace('_', ' ')}
                                    </Badge>
                                    {isGroup && (
                                      <Badge variant="outline" className="mb-2">
                                        {bookingGroup.length} Services
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                                    {formatDbDate(primaryBooking.booking_date, "MMM d, yyyy")}
                                  </span>
                                </div>
                                <CardTitle className="text-lg font-bold flex flex-col gap-1">
                                  <span className="flex items-center gap-2">
                                    <Car className="h-5 w-5 text-gray-500" />
                                    {primaryBooking.car_brand || primaryBooking.vehicle_make} {primaryBooking.car_model || primaryBooking.vehicle_model}
                                  </span>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-4 flex-grow">
                                <div className="space-y-3">
                                  <div className="flex items-start gap-2 text-sm">
                                    <Wrench className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                    <div className="flex-1">
                                      {isGroup ? (
                                        <div className="space-y-1">
                                          {bookingGroup.map((booking, idx) => (
                                            <div key={booking.id} className="text-gray-800 font-medium line-clamp-1">
                                              • {booking.service_name || "Service Booking"}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-gray-800 font-medium line-clamp-1">
                                          {primaryBooking.service_name || "Service Booking"}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDbDate(primaryBooking.booking_date, "h:mm a")}</span>
                                  </div>
                                  {totalCost > 0 && (
                                    <div className="font-bold text-lg text-gray-900 pt-2">
                                      ₹ {totalCost.toLocaleString()}
                                    </div>
                                  )}
                                </div>

                              </CardContent>
                              <CardFooter className="pt-0 flex justify-between items-center border-t border-gray-200/60 bg-white/40 p-4 mt-auto">
                                {primaryBooking.status !== BookingStatus.COMPLETED && primaryBooking.status !== BookingStatus.CANCELLED ? (
                                  <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100/50 text-gray-500">
                                    {primaryBooking.status === BookingStatus.ANALYSE ? "Being Analyzed" :
                                      primaryBooking.status === BookingStatus.IN_PROGRESS ? "Work in Progress" : "Waiting for action"}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400 italic">
                                    {primaryBooking.status === BookingStatus.COMPLETED ? "Completed" : "Cancelled"}
                                  </span>
                                )}

                                {/* Admin Actions */}
                                <div className="flex items-center gap-2 ml-auto">
                                  {/* Next Stage Button */}
                                  {(isAdmin || isSuperAdmin) && primaryBooking.assigned_employee_id && getNextStatus(primaryBooking.status) && (
                                    <Button
                                      size="sm"
                                      className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1"
                                      onClick={(e) => handleMoveToNextStage(e, primaryBooking)}
                                      disabled={updatingId === primaryBooking.id}
                                    >
                                      {updatingId === primaryBooking.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <>
                                          Move to {getNextStatus(primaryBooking.status)?.replace('_', ' ')}
                                          <ArrowRight className="h-3 w-3" />
                                        </>
                                      )}
                                    </Button>
                                  )}

                                  {/* Delete Button - Super Admin Only */}
                                  {isSuperAdmin && (
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={(e) => confirmDelete(e, primaryBooking.id)}
                                      disabled={cancellingId === primaryBooking.id}
                                      className="h-8 w-8 p-0"
                                      title="Delete Booking"
                                    >
                                      {cancellingId === primaryBooking.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Trash2 className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                  )}

                                  <div className="flex items-center text-sm font-medium text-gray-500 hover:text-red-500 transition-colors">
                                    <span className="sr-only">Details</span>
                                    <ChevronRight className="h-5 w-5" />
                                  </div>
                                </div>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )
                  }
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </main>
      <Footer />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the booking and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBooking} className="bg-red-600 hover:bg-red-700">
              Delete Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyServices;
