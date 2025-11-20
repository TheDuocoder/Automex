import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  MessageSquare,
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { getBooking, cancelBooking, updateBookingStatus, type Booking, BookingStatus } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
      [BookingStatus.ANALYSE]: "Analyzing",
      [BookingStatus.IN_PROGRESS]: "In Progress",
      [BookingStatus.COMPLETED]: "Completed",
      [BookingStatus.CANCELLED]: "Cancelled",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: BookingStatus): string => {
    const colors: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: "bg-amber-100 text-amber-700 border-amber-200",
      [BookingStatus.ANALYSE]: "bg-blue-100 text-blue-700 border-blue-200",
      [BookingStatus.IN_PROGRESS]: "bg-purple-100 text-purple-700 border-purple-200",
      [BookingStatus.COMPLETED]: "bg-emerald-100 text-emerald-700 border-emerald-200",
      [BookingStatus.CANCELLED]: "bg-red-100 text-red-700 border-red-200",
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
        return <FileText className="h-4 w-4" />;
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
        return null;
      default:
        return null;
    }
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
      opacity: 1
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Header />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="text-gray-500 font-medium">Loading booking details...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Header />
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <Card className="max-w-lg mx-auto text-center p-12 border-dashed">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
            <p className="text-gray-500 mb-8">The booking you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/my-services')} size="lg">
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
    <div className="min-h-screen bg-gray-50/50">
      <Header />
      
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => navigate('/my-services')}
                className="pl-0 text-gray-500 hover:text-gray-900 hover:bg-transparent -ml-2 mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Services
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Booking #{booking.id}
                </h1>
                <Badge className={cn("px-3 py-1 rounded-full border", getStatusColor(booking.status))}>
                  <span className="flex items-center gap-1.5">
                    {getStatusIcon(booking.status)}
                    {getStatusLabel(booking.status)}
                  </span>
                </Badge>
              </div>
              <p className="text-gray-500">
                Created on {format(new Date(booking.created_at), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>

            {booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.COMPLETED && (
               <div className="flex gap-3">
                 {!isAdmin && (
                   <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    onClick={handleCancel}
                    disabled={cancellingId === booking.id}
                   >
                     {cancellingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                     Cancel Booking
                   </Button>
                 )}
               </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Service Details Card */}
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden border-none shadow-md">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-primary/10">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          <Wrench className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.service_name || "Service Booking"}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            Scheduled for {format(new Date(booking.booking_date), "EEEE, MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-sm text-gray-500">Time Slot</div>
                        <div className="font-medium text-gray-900 bg-white px-3 py-1 rounded-md border shadow-sm mt-1 inline-flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {format(new Date(booking.booking_date), "h:mm a")}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 grid gap-6">
                    {/* Mobile Time Slot */}
                    <div className="sm:hidden flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-500">Time Slot</span>
                      <span className="font-medium text-gray-900 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {format(new Date(booking.booking_date), "h:mm a")}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Vehicle Details</h4>
                        <div className="flex gap-3 items-start">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Car className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {booking.car_brand || booking.vehicle_make} {booking.car_model || booking.vehicle_model}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {booking.vehicle_registration && (
                                <Badge variant="secondary" className="font-mono text-xs">
                                  {booking.vehicle_registration}
                                </Badge>
                              )}
                              {booking.fuel_type && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                  {booking.fuel_type}
                                </Badge>
                              )}
                              {booking.vehicle_year && (
                                <Badge variant="outline" className="text-xs text-gray-500">
                                  {booking.vehicle_year}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {(booking.contact_name || booking.contact_phone) && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact Person</h4>
                          <div className="flex gap-3 items-start">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {booking.contact_name || "N/A"}
                              </p>
                              {booking.contact_phone && (
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                                  <Phone className="h-3 w-3" />
                                  {booking.contact_phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {booking.pickup_address && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Location</h4>
                          <div className="flex gap-3 items-start">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <MapPin className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Pickup Address</p>
                              <p className="text-gray-900 leading-relaxed">{booking.pickup_address}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Additional Info Card */}
              {(booking.special_instructions || booking.technician_notes) && (
                <motion.div variants={itemVariants}>
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-gray-500" />
                        Notes & Instructions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {booking.special_instructions && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                          <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Special Instructions
                          </h4>
                          <p className="text-sm text-yellow-900/80 whitespace-pre-wrap">
                            {booking.special_instructions}
                          </p>
                        </div>
                      )}

                      {booking.technician_notes && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-gray-500" />
                            Technician Notes
                          </h4>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {booking.technician_notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Cost Summary Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-md border-primary/10 overflow-hidden">
                  <div className="bg-gray-50/50 p-4 border-b border-gray-100">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Payment Summary
                    </CardTitle>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Estimated Cost</span>
                      <span className="font-medium text-gray-900">
                        {booking.estimated_cost ? `₹${booking.estimated_cost.toLocaleString()}` : "Pending"}
                      </span>
                    </div>
                    
                    {booking.actual_cost && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900 font-medium">Final Amount</span>
                          <span className="text-2xl font-bold text-primary">
                            ₹{booking.actual_cost.toLocaleString()}
                          </span>
                        </div>
                        <div className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded-md flex items-center justify-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified Price
                        </div>
                      </>
                    )}

                    {!booking.actual_cost && !booking.estimated_cost && (
                      <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500">Cost will be calculated after inspection</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Admin Actions Card */}
              {isAdmin && nextStatus && (
                <motion.div variants={itemVariants}>
                  <Card className="shadow-sm border-primary/20 ring-1 ring-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-medium">Admin Actions</CardTitle>
                      <CardDescription>Manage booking status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => handleStatusChange(nextStatus)}
                        disabled={updatingStatusId === booking.id}
                      >
                        {updatingStatusId === booking.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <span className="flex items-center gap-2">
                            Move to {getStatusLabel(nextStatus)}
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Timeline Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-6 my-2">
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white" />
                        <p className="text-sm font-medium text-gray-900">Booking Created</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {format(new Date(booking.created_at), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>

                      {booking.updated_at && booking.updated_at !== booking.created_at && (
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-300 ring-4 ring-white" />
                          <p className="text-sm font-medium text-gray-900">Last Updated</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {format(new Date(booking.updated_at), "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                      )}

                      {booking.completed_at && (
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white" />
                          <p className="text-sm font-medium text-gray-900">Completed</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {format(new Date(booking.completed_at), "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetails;
