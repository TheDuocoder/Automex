import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Car, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowLeft,
  MapPin,
  Phone,
  User,
  FileText,
  DollarSign,
  Wrench,
  MessageSquare
} from "lucide-react";
import { getBooking, cancelBooking, updateBookingStatus, type Booking, BookingStatus } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const BookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  // Check if user is Admin or Super Admin
  const isAdmin = user?.role?.name === "admin" || user?.role?.name === "super" || user?.is_superuser;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!bookingId) {
      toast({
        title: "Error",
        description: "Invalid booking ID",
        variant: "destructive",
      });
      navigate('/my-services');
      return;
    }

    loadBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, bookingId, navigate]);

  const loadBooking = async () => {
    if (!bookingId) return;
    
    try {
      setIsLoading(true);
      const data = await getBooking(parseInt(bookingId));
      setBooking(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load booking details",
        variant: "destructive",
      });
      navigate('/my-services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingId(booking.id);
      await cancelBooking(booking.id);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
      await loadBooking();
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

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (!booking || !isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only Admin and Super Admin can change booking status",
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdatingStatusId(booking.id);
      await updateBookingStatus(booking.id, newStatus);
      toast({
        title: "Status Updated Successfully",
        description: `Booking moved to ${getStatusLabel(newStatus)}`,
        duration: 3000,
      });
      await loadBooking();
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
        return <CheckCircle2 className="h-5 w-5" />;
      case BookingStatus.CANCELLED:
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
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
        return null;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-gray-600">Loading booking details...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/my-services')} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
              Back to My Services
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const nextStatus = getNextStatus(booking.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/my-services')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Services
          </Button>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600">Booking ID: #{booking.id}</p>
            </div>
            
            <Badge className={cn("text-lg px-4 py-2", getStatusColor(booking.status))}>
              {getStatusIcon(booking.status)}
              <span className="ml-2">{getStatusLabel(booking.status)}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Service Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Service Name</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.service_name || "Service Booking"}
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Booking Date & Time</p>
                    <p className="text-base font-medium text-gray-900">
                      {format(new Date(booking.booking_date), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(booking.booking_date), "h:mm a")}
                    </p>
                  </div>
                </div>

                {booking.created_at && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Created On</p>
                    <p className="text-sm text-gray-700">
                      {format(new Date(booking.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                )}

                {booking.completed_at && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-500 mb-1">Completed On</p>
                    <p className="text-sm text-gray-700">
                      {format(new Date(booking.completed_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Vehicle</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.car_brand || booking.vehicle_make} {booking.car_model || booking.vehicle_model}
                  </p>
                </div>

                {booking.fuel_type && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fuel Type</p>
                    <p className="text-base text-gray-900">{booking.fuel_type}</p>
                  </div>
                )}

                {booking.vehicle_year && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Year</p>
                    <p className="text-base text-gray-900">{booking.vehicle_year}</p>
                  </div>
                )}

                {booking.vehicle_registration && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                    <p className="text-base font-mono text-gray-900">{booking.vehicle_registration}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact & Location */}
            {(booking.contact_name || booking.contact_phone || booking.pickup_address) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {booking.contact_name && (
                    <div className="flex items-start gap-2">
                      <User className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Contact Name</p>
                        <p className="text-base text-gray-900">{booking.contact_name}</p>
                      </div>
                    </div>
                  )}

                  {booking.contact_phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                        <p className="text-base text-gray-900">{booking.contact_phone}</p>
                      </div>
                    </div>
                  )}

                  {booking.pickup_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Pickup Address</p>
                        <p className="text-base text-gray-900 whitespace-pre-wrap">{booking.pickup_address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            {(booking.special_instructions || booking.technician_notes) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {booking.special_instructions && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Special Instructions</p>
                      <p className="text-base text-gray-900 whitespace-pre-wrap">{booking.special_instructions}</p>
                    </div>
                  )}

                  {booking.technician_notes && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Technician Notes</p>
                      <p className="text-base text-gray-900 whitespace-pre-wrap">{booking.technician_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.estimated_cost && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estimated Cost</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{booking.estimated_cost.toLocaleString()}
                    </p>
                  </div>
                )}

                {booking.actual_cost && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Actual Cost</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{booking.actual_cost.toLocaleString()}
                    </p>
                  </div>
                )}

                {!booking.estimated_cost && !booking.actual_cost && (
                  <p className="text-sm text-gray-500">Cost information not available</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isAdmin && nextStatus && (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => handleStatusChange(nextStatus)}
                    disabled={updatingStatusId === booking.id}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                  >
                    {updatingStatusId === booking.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      `Move to ${getStatusLabel(nextStatus)}`
                    )}
                  </Button>
                )}
                
                {booking.status !== BookingStatus.COMPLETED && 
                 booking.status !== BookingStatus.CANCELLED && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCancel}
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
                )}
              </CardContent>
            </Card>

            {/* Booking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(booking.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                {booking.updated_at && booking.updated_at !== booking.created_at && (
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(booking.updated_at), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
                {booking.completed_at && (
                  <div>
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-sm font-medium text-green-600">
                      {format(new Date(booking.completed_at), "MMM d, yyyy")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetails;

