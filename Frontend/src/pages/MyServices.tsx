import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Car, Clock, CheckCircle2, XCircle, Loader2, AlertCircle, MapPin, Wrench, Search, Mail, User, ChevronRight, LayoutGrid } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<string>("all");
  const [bookingCosts, setBookingCosts] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isAdmin = user?.role?.name?.toLowerCase() === "admin" || user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;
  const isSuperAdmin = user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;

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

  const handleCancel = async (e: React.MouseEvent, bookingId: number) => {
    e.stopPropagation(); // Prevent card navigation
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      toast({
        title: "Booking Deleted",
        description: "Your booking has been deleted successfully.",
      });
      await loadBookings();
    } catch (error) {
      if (error instanceof Error && (error.message.includes('404') || error.message.toLowerCase().includes('not found'))) {
        // Booking already deleted
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
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    const colors: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-200",
      [BookingStatus.ANALYSE]: "bg-blue-100 text-blue-800 border-blue-200",
      [BookingStatus.IN_PROGRESS]: "bg-purple-100 text-purple-800 border-purple-200",
      [BookingStatus.COMPLETED]: "bg-green-100 text-green-800 border-green-200",
      [BookingStatus.CANCELLED]: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || colors[BookingStatus.PENDING];
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
              <p className="text-gray-500">Manage your active and past service bookings</p>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 w-full justify-start overflow-x-auto h-auto p-1 bg-white border rounded-xl">
              {["all", BookingStatus.PENDING, BookingStatus.ANALYSE, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.CANCELLED].map(status => (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="capitalize px-4 py-2 min-w-[100px] data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
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
                            <Card className="h-full hover:shadow-lg transition-shadow border-t-4 overflow-hidden relative flex flex-col"
                              style={{
                                borderTopColor: primaryBooking.status === BookingStatus.COMPLETED ? '#22c55e' :
                                  primaryBooking.status === BookingStatus.CANCELLED ? '#ef4444' :
                                    primaryBooking.status === BookingStatus.IN_PROGRESS ? '#a855f7' :
                                      primaryBooking.status === BookingStatus.ANALYSE ? '#3b82f6' : '#eab308'
                              }}>
                              <CardHeader className="bg-gray-50/50 pb-3">
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
                                    {format(new Date(primaryBooking.booking_date), "MMM d, yyyy")}
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
                                    <span>{format(new Date(primaryBooking.booking_date), "h:mm a")}</span>
                                  </div>
                                  {totalCost > 0 && (
                                    <div className="font-bold text-lg text-gray-900 pt-2">
                                      ₹ {totalCost.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter className="pt-0 flex justify-between items-center border-t bg-gray-50/30 p-4 mt-auto">
                                {primaryBooking.status !== BookingStatus.COMPLETED && primaryBooking.status !== BookingStatus.CANCELLED ? (
                                  isSuperAdmin ? (
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={(e) => handleCancel(e, primaryBooking.id)}
                                      disabled={cancellingId === primaryBooking.id}
                                      className="h-8 px-3 text-xs"
                                    >
                                      {cancellingId === primaryBooking.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Delete"}
                                    </Button>
                                  ) : <div />
                                ) : (
                                  <span className="text-xs text-gray-400 italic">
                                    {primaryBooking.status === BookingStatus.COMPLETED ? "Completed" : "Cancelled"}
                                  </span>
                                )}

                                <div className="flex items-center text-sm font-medium text-gray-500 ml-auto">
                                  View Details <ChevronRight className="h-4 w-4 ml-1" />
                                </div>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyServices;
