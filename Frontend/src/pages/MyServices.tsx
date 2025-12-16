import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, Clock, CheckCircle2, XCircle, Loader2, AlertCircle, MapPin, Wrench, Search, Mail, User } from "lucide-react";
import { getUserBookings, cancelBooking, updateBookingStatus, type Booking, BookingStatus } from "@/services/bookingService";
import { getBookingCosts } from "@/services/costService";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const MyServices = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [bookingCosts, setBookingCosts] = useState<Record<number, number>>({}); // booking_id -> total cost
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Check if user is Admin or Super Admin
  const isAdmin = user?.role?.name?.toLowerCase() === "admin" || user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;

  const loadBookings = async () => {
    try {
      setIsLoading(true);

      // Check if token exists before making API call
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('[MyServices] No auth token found, redirecting to home');
        // Clear auth state silently and redirect to show welcome card
        await logout();
        navigate('/');
        return;
      }

      const data = await getUserBookings();
      // Sort bookings by date (newest first)
      const sortedData = data.sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());
      // Debug: Log assigned employee data
      console.log('[MyServices] Bookings with assigned employees:', sortedData.filter(b => b.assigned_employee_name));
      setBookings(sortedData);

      // Load costs for all bookings
      const costsMap: Record<number, number> = {};
      await Promise.all(
        sortedData.map(async (booking) => {
          try {
            const costsResponse = await getBookingCosts(booking.id);
            costsMap[booking.id] = costsResponse.total;
          } catch (error) {
            // If costs don't exist yet, set to 0
            costsMap[booking.id] = 0;
          }
        })
      );
      setBookingCosts(costsMap);
    } catch (error) {
      console.error('[MyServices] Error loading bookings:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load bookings";

      // If unauthorized or session expired, silently clear auth and redirect to welcome card
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401') || errorMessage.includes('Session')) {
        console.log('[MyServices] Session expired, redirecting to home');
        // Clear auth state silently and redirect to show welcome card
        await logout();
        navigate('/');
        return;
      }

      toast({
        title: "Error",
        description: errorMessage,
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

      // Show success notification
      if (updatedBooking.user_email && updatedBooking.email_sent) {
        sonnerToast.success("Status Updated Successfully", {
          description: `Notification sent to ${updatedBooking.user_email}`,
          duration: 5000,
          icon: <Mail className="h-4 w-4" />,
          position: "top-right",
          className: "bg-green-50 border-green-200",
        });
      } else {
        toast({
          title: "Status Updated Successfully",
          description: `Booking #${bookingId} moved to ${getStatusLabel(newStatus)}`,
          duration: 3000,
        });
      }

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
      [BookingStatus.PENDING]: "bg-white text-yellow-800 border-yellow-200",
      [BookingStatus.ANALYSE]: "bg-white text-blue-800 border-blue-200",
      [BookingStatus.IN_PROGRESS]: "bg-white text-purple-800 border-purple-200",
      [BookingStatus.COMPLETED]: "bg-white text-green-800 border-green-200",
      [BookingStatus.CANCELLED]: "bg-white text-red-800 border-red-200",
    };
    return colors[status] || colors[BookingStatus.PENDING];
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.COMPLETED:
        return <CheckCircle2 className="h-4 w-4" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      case BookingStatus.IN_PROGRESS:
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case BookingStatus.ANALYSE:
        return <Search className="h-4 w-4" />; // Using Search icon locally defined or imported
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Helper for Search icon since it wasn't imported in the original file but used in my switch
  const Search = ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );

  const getNextStatus = (currentStatus: BookingStatus): BookingStatus | null => {
    switch (currentStatus) {
      case BookingStatus.PENDING:
        return BookingStatus.ANALYSE;
      case BookingStatus.ANALYSE:
        return BookingStatus.IN_PROGRESS;
      case BookingStatus.IN_PROGRESS:
        return BookingStatus.COMPLETED;
      default:
        return null;
    }
  };

  const filterBookings = (status: string) => {
    let filtered = status === "all" ? bookings : bookings.filter((b) => b.status === status);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((booking) => {
        const serviceName = booking.service_name?.toLowerCase() || "";
        const carBrand = booking.car_brand?.toLowerCase() || "";
        const carModel = booking.car_model?.toLowerCase() || "";
        const status = booking.status?.toLowerCase() || "";
        const bookingId = booking.id.toString();

        return (
          serviceName.includes(query) ||
          carBrand.includes(query) ||
          carModel.includes(query) ||
          status.includes(query) ||
          bookingId.includes(query)
        );
      });
    }

    return filtered;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <motion.div
      variants={itemVariants}
      layout
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card
        className="h-full hover:shadow-xl transition-all duration-300 border-l-4 overflow-hidden group cursor-pointer relative"
        style={{
          borderLeftColor:
            booking.status === BookingStatus.COMPLETED ? '#22c55e' :
              booking.status === BookingStatus.CANCELLED ? '#ef4444' :
                booking.status === BookingStatus.IN_PROGRESS ? '#a855f7' :
                  booking.status === BookingStatus.ANALYSE ? '#3b82f6' :
                    '#eab308',
          backgroundColor:
            booking.status === BookingStatus.PENDING ? '#EFDFBB' :
              booking.status === BookingStatus.IN_PROGRESS ? '#F0FF00' :
                booking.status === BookingStatus.ANALYSE ? '#FFB5E1' :
                  booking.status === BookingStatus.CANCELLED ? '#FF4D4D' :
                    booking.status === BookingStatus.COMPLETED ? '#B6F37A' : undefined
        }}
        onClick={() => navigate(`/booking/${booking.id}`)}
      >
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors" style={{ color: '#000000' }}>
                {booking.service_name || "Service Booking"}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className={cn("font-bold flex items-center gap-1.5", getStatusColor(booking.status))}>
                  {getStatusIcon(booking.status)}
                  {getStatusLabel(booking.status)}
                </Badge>
                <span className="text-xs font-mono" style={{ color: '#000000' }}>#{booking.id}</span>
              </div>
            </div>
            {booking.created_at && (
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-medium" style={{ color: '#000000' }}>Created:</div>
                <div className="text-xs mt-0.5" style={{ color: '#000000' }}>
                  {(() => {
                    let dateStr = booking.created_at;
                    if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
                      dateStr = dateStr + 'Z';
                    }
                    const date = new Date(dateStr);
                    return format(date, "MMM d, yyyy");
                  })()}
                </div>
                <div className="text-xs font-bold mt-0.5" style={{ color: '#000000' }}>
                  {(() => {
                    let dateStr = booking.created_at;
                    if (typeof dateStr === 'string' && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
                      dateStr = dateStr + 'Z';
                    }
                    const date = new Date(dateStr);
                    const hours = date.getHours();
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const displayHours = hours % 12 || 12;
                    return `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
                  })()}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4 pb-2 space-y-4">
          {/* Vehicle Info */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex-1 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#000000' }}>Vehicle</p>
                <p className="text-sm font-semibold" style={{ color: '#000000' }}>
                  {booking.car_brand || booking.vehicle_make} {booking.car_model || booking.vehicle_model}
                </p>
                {booking.fuel_type && (
                  <p className="text-xs" style={{ color: '#000000' }}>{booking.fuel_type}</p>
                )}
              </div>
              {/* Assigned Employee aligned with Vehicle on the right */}
              {booking.assigned_employee_name && (
                <div className="text-right">
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#000000' }}>Assigned To</p>
                  <p className="text-sm font-semibold" style={{ color: '#000000' }}>
                    {booking.assigned_employee_name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Date Info */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#000000' }}>Scheduled For</p>
              <p className="text-sm font-semibold" style={{ color: '#000000' }}>
                {format(new Date(booking.booking_date), "EEE, MMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Cost Info (show total cost from Payment Summary if available, otherwise estimated cost) */}
          {(bookingCosts[booking.id] > 0 || booking.estimated_cost) && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                <span className="h-5 w-5 flex items-center justify-center font-bold text-sm">₹</span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#000000' }}>
                  {bookingCosts[booking.id] > 0 ? "Total Cost" : "Est. Cost"}
                </p>
                <p className="text-sm font-semibold" style={{ color: '#000000' }}>
                  ₹{(bookingCosts[booking.id] > 0 ? bookingCosts[booking.id] : booking.estimated_cost || 0).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 pb-4 px-4 md:px-6 border-t border-gray-100 mt-2">
          <div className="w-full flex flex-col sm:flex-row gap-2" onClick={(e) => e.stopPropagation()}>
            {isAdmin && (() => {
              const nextStatus = getNextStatus(booking.status);
              if (nextStatus) {
                // Only enable button if employee is assigned
                if (booking.assigned_employee_id) {
                  return (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(booking.id, nextStatus)}
                      disabled={updatingStatusId === booking.id}
                      className="flex-1 text-white hover:bg-purple-700 w-full sm:w-auto"
                      style={{ backgroundColor: '#a855f7' }}
                    >
                      {updatingStatusId === booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        `Move to ${getStatusLabel(nextStatus)}`
                      )}
                    </Button>
                  );
                } else {
                  // Show disabled button with message
                  return (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: "Employee Assignment Required",
                          description: "Please assign an employee to this booking before changing status.",
                          variant: "destructive",
                        });
                      }}
                      disabled={true}
                      className="flex-1 text-white w-full sm:w-auto cursor-not-allowed"
                      style={{ backgroundColor: '#9ca3af' }}
                    >
                      Assign Employee First
                    </Button>
                  );
                }
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
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 w-full sm:w-auto"
                >
                  {cancellingId === booking.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cancel"
                  )}
                </Button>
              )}

            {(booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/booking/${booking.id}`)}
                className="w-full hover:bg-white/50"
                style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
              >
                View Details
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">My Services</h1>
              <p className="text-gray-500 mt-2 text-sm md:text-lg">Track and manage your vehicle service history</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative flex items-center flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <Button
                  variant="outline"
                  className="absolute right-0 top-0 rounded-full px-4 text-white border-[#FF0000] shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)] active:scale-95 active:shadow-[0_0_30px_rgba(255,0,0,0.7)]"
                  style={{
                    background: '#FF0000',
                    animation: 'none'
                  }}
                  disabled
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => navigate('/services')}
                className="bg-black text-white hover:bg-gray-800 rounded-full px-6 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              >
                <Wrench className="mr-2 h-4 w-4" />
                Book New Service
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-gray-500 animate-pulse">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <Card className="p-8 md:p-16 text-center border-dashed border-2 bg-white/50">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">No Bookings Yet</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm md:text-base">
                You haven't booked any services with us yet. Schedule your first service today to keep your vehicle in top condition.
              </p>
              <Button
                onClick={() => navigate('/services')}
                size="lg"
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full px-8 w-full sm:w-auto"
              >
                Explore Services
              </Button>
            </Card>
          ) : (
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto bg-white p-1 border border-gray-200 rounded-xl mb-8 h-auto flex-nowrap gap-1 scrollbar-hide">
                <TabsTrigger value="all" className="rounded-lg px-4 py-2 whitespace-nowrap flex-shrink-0 data-[state=active]:bg-black data-[state=active]:text-white">
                  All <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">{bookings.length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value={BookingStatus.PENDING}
                  className="rounded-lg px-4 py-2 whitespace-nowrap flex-shrink-0 data-[state=active]:text-black"
                  style={{
                    backgroundColor: activeTab === BookingStatus.PENDING ? '#EFDFBB' : undefined
                  }}
                >
                  Pending <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">{bookings.filter(b => b.status === BookingStatus.PENDING).length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value={BookingStatus.ANALYSE}
                  className="rounded-lg px-4 py-2 whitespace-nowrap flex-shrink-0 data-[state=active]:text-black"
                  style={{
                    backgroundColor: activeTab === BookingStatus.ANALYSE ? '#FFB5E1' : undefined
                  }}
                >
                  Analyse <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">{bookings.filter(b => b.status === BookingStatus.ANALYSE).length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value={BookingStatus.IN_PROGRESS}
                  className="rounded-lg px-4 py-2 whitespace-nowrap flex-shrink-0 data-[state=active]:text-black"
                  style={{
                    backgroundColor: activeTab === BookingStatus.IN_PROGRESS ? '#F0FF00' : undefined
                  }}
                >
                  In Progress <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">{bookings.filter(b => b.status === BookingStatus.IN_PROGRESS).length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value={BookingStatus.COMPLETED}
                  className="rounded-lg px-4 py-2 whitespace-nowrap flex-shrink-0 data-[state=active]:text-black"
                  style={{
                    backgroundColor: activeTab === BookingStatus.COMPLETED ? '#B6F37A' : undefined
                  }}
                >
                  Done <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">{bookings.filter(b => b.status === BookingStatus.COMPLETED).length}</Badge>
                </TabsTrigger>
                <TabsTrigger
                  value={BookingStatus.CANCELLED}
                  className="rounded-lg px-4 py-2 whitespace-nowrap flex-shrink-0 data-[state=active]:text-black"
                  style={{
                    backgroundColor: activeTab === BookingStatus.CANCELLED ? '#FF4D4D' : undefined
                  }}
                >
                  Cancelled <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-600">{bookings.filter(b => b.status === BookingStatus.CANCELLED).length}</Badge>
                </TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                {["all", BookingStatus.PENDING, BookingStatus.ANALYSE, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.CANCELLED].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-0 focus-visible:outline-none">
                    {filterBookings(tabValue).length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200"
                      >
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <AlertCircle className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                        <p className="text-gray-500 mt-1">There are no bookings in this category.</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {filterBookings(tabValue).map((booking) => (
                          <BookingCard key={booking.id} booking={booking} />
                        ))}
                      </motion.div>
                    )}
                  </TabsContent>
                ))}
              </AnimatePresence>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyServices;
