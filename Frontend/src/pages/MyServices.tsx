import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, Wrench, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { getUserBookings, cancelBooking, type Booking, BookingStatus } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const MyServices = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

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
      // Clear the state to prevent showing toast on refresh
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
      // Reload bookings
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

  const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = {
      [BookingStatus.PENDING]: { label: "Pending", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
      [BookingStatus.CONFIRMED]: { label: "Confirmed", className: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
      [BookingStatus.IN_PROGRESS]: { label: "In Progress", className: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
      [BookingStatus.COMPLETED]: { label: "Completed", className: "bg-green-100 text-green-800 hover:bg-green-200" },
      [BookingStatus.CANCELLED]: { label: "Cancelled", className: "bg-red-100 text-red-800 hover:bg-red-200" },
      [BookingStatus.RESCHEDULED]: { label: "Rescheduled", className: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
    };

    const config = statusConfig[status] || statusConfig[BookingStatus.PENDING];
    return (
      <Badge className={cn("font-semibold", config.className)}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.COMPLETED:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-blue-600" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Services</h1>
          <p className="text-gray-600">View and manage your service bookings</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-gray-600">Loading your bookings...</span>
          </div>
        ) : bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">You haven't booked any services yet.</p>
            <Button onClick={() => navigate('/services')} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
              Browse Services
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold mb-1">
                        {booking.service_name || "Service Booking"}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusIcon(booking.status)}
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  {/* Car Information */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Car className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Vehicle</p>
                        <p className="font-semibold text-gray-900">
                          {booking.car_brand || booking.vehicle_make} {booking.car_model || booking.vehicle_model}
                        </p>
                        {booking.fuel_type && (
                          <p className="text-xs text-gray-500 mt-1">Fuel: {booking.fuel_type}</p>
                        )}
                      </div>
                    </div>

                    {/* Booking Date */}
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Booking Date</p>
                        <p className="font-semibold text-gray-900">
                          {format(new Date(booking.booking_date), "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(booking.booking_date), "h:mm a")}
                        </p>
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Booking ID:</span>
                        <span className="font-mono font-semibold text-gray-900">#{booking.id}</span>
                      </div>
                      {booking.estimated_cost && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Estimated Cost:</span>
                          <span className="font-semibold text-gray-900">₹{booking.estimated_cost.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Booked on:</span>
                        <span className="text-gray-900">
                          {format(new Date(booking.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    {booking.status !== BookingStatus.COMPLETED && 
                     booking.status !== BookingStatus.CANCELLED && (
                      <div className="pt-4 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                        >
                          {cancellingId === booking.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            "Cancel Booking"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyServices;

