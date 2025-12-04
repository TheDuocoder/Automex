import { useEffect, useState, useRef } from "react";
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
  Wrench,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { getBooking, cancelBooking, updateBookingStatus, createDailyWorkLog, updateDailyWorkLogDescription, uploadDailyWorkMedia, deleteDailyWorkMedia, deleteDailyWorkByDate, type Booking, BookingStatus, type DailyWorkLog } from "@/services/bookingService";
import { getBookingCosts, createCost, updateCost, deleteCost, type Cost } from "@/services/costService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit2, Save, X, Image as ImageIcon, Video, Upload } from "lucide-react";

// Helper function to format UTC date as IST (UTC+5:30)
// IST is UTC+5:30, so we add 5 hours and 30 minutes
const formatIST = (utcDateString: string, formatString: string): string => {
  const utcDate = new Date(utcDateString);
  // Get UTC time in milliseconds
  const utcTime = utcDate.getTime();
  // IST offset: +5 hours 30 minutes = +5.5 hours = 19800000 milliseconds
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  // Create a Date object with IST time added
  const istTime = utcTime + istOffsetMs;
  const istDateObj = new Date(istTime);
  
  // Extract UTC components (which now represent IST time after offset)
  const year = istDateObj.getUTCFullYear();
  const month = istDateObj.getUTCMonth();
  const day = istDateObj.getUTCDate();
  const hours = istDateObj.getUTCHours();
  const minutes = istDateObj.getUTCMinutes();
  const seconds = istDateObj.getUTCSeconds();
  
  // Create a local Date object with IST components
  // This ensures format() displays the correct IST time regardless of browser timezone
  const localISTDate = new Date(year, month, day, hours, minutes, seconds);
  return format(localISTDate, formatString);
};
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const BookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isLoadingCosts, setIsLoadingCosts] = useState(false);
  const [editingCostId, setEditingCostId] = useState<number | null>(null);
  const [newCostItem, setNewCostItem] = useState({ item_name: "", amount: "", description: "" });
  const [editingCost, setEditingCost] = useState<Partial<Cost>>({});
  
  // Daily work states
  const [editingDescriptionDate, setEditingDescriptionDate] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [uploadingDate, setUploadingDate] = useState<string | null>(null);
  const [isDeletingMedia, setIsDeletingMedia] = useState<string | null>(null);
  const [isDeletingDate, setIsDeletingDate] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Create new log dialog states
  const [showCreateLogDialog, setShowCreateLogDialog] = useState(false);
  const [newLogDate, setNewLogDate] = useState<string>(getCurrentDate());
  const [newLogDescription, setNewLogDescription] = useState("");
  const [isCreatingLog, setIsCreatingLog] = useState(false);

  // Check if user is Admin or Super Admin
  const isAdmin = user?.role?.name === "admin" || user?.role?.name === "super" || user?.is_superuser;
  
  // Check if booking is completed or cancelled (cost editing should be disabled)
  const isBookingLocked = booking?.status === BookingStatus.COMPLETED || booking?.status === BookingStatus.CANCELLED;

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

  useEffect(() => {
    if (booking?.id) {
      loadCosts();
    }
  }, [booking?.id]);

  // Removed - daily work description is now date-wise in daily_work_logs

  const loadBooking = async () => {
    if (!bookingId) return;
    
    try {
      setIsLoading(true);
      const data = await getBooking(parseInt(bookingId));
      // Ensure daily_work_logs is initialized as an array
      if (data) {
        if (!data.daily_work_logs) {
          data.daily_work_logs = [];
        }
        setBooking(data);
      }
    } catch (error) {
      console.error("Error loading booking:", error);
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

  const loadCosts = async () => {
    if (!booking?.id) return;
    
    try {
      setIsLoadingCosts(true);
      const response = await getBookingCosts(booking.id);
      setCosts(response.costs);
      setTotalCost(response.total);
    } catch (error) {
      // Silently fail - costs might not exist yet
      setCosts([]);
      setTotalCost(0);
    } finally {
      setIsLoadingCosts(false);
    }
  };

  const handleAddCost = async () => {
    if (!booking?.id || !newCostItem.item_name || !newCostItem.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in item name and amount",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCost({
        booking_id: booking.id,
        item_name: newCostItem.item_name,
        amount: parseFloat(newCostItem.amount),
        description: newCostItem.description || undefined,
      });
      toast({
        title: "Success",
        description: "Cost item added successfully",
      });
      setNewCostItem({ item_name: "", amount: "", description: "" });
      await loadCosts();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add cost item",
        variant: "destructive",
      });
    }
  };

  const handleEditCost = (cost: Cost) => {
    setEditingCostId(cost.id);
    setEditingCost({ item_name: cost.item_name, amount: cost.amount, description: cost.description });
  };

  const handleSaveCost = async (costId: number) => {
    if (!editingCost.item_name || !editingCost.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in item name and amount",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateCost(costId, {
        item_name: editingCost.item_name,
        amount: typeof editingCost.amount === 'string' ? parseFloat(editingCost.amount) : editingCost.amount,
        description: editingCost.description,
      });
      toast({
        title: "Success",
        description: "Cost item updated successfully",
      });
      setEditingCostId(null);
      setEditingCost({});
      await loadCosts();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update cost item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCost = async (costId: number) => {
    if (!confirm("Are you sure you want to delete this cost item?")) {
      return;
    }

    try {
      await deleteCost(costId);
      toast({
        title: "Success",
        description: "Cost item deleted successfully",
      });
      await loadCosts();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete cost item",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCostId(null);
    setEditingCost({});
  };

  const handleCreateLog = async () => {
    if (!booking || !newLogDate) return;
    
    try {
      setIsCreatingLog(true);
      await createDailyWorkLog(booking.id, newLogDate, newLogDescription.trim() || undefined);
      await loadBooking(); // Reload to get updated data
      setShowCreateLogDialog(false);
      setNewLogDate(getCurrentDate());
      setNewLogDescription("");
      toast({
        title: "Success",
        description: "Daily work log created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create daily work log",
        variant: "destructive",
      });
    } finally {
      setIsCreatingLog(false);
    }
  };

  const handleSaveDescription = async (logId: number, date: string) => {
    if (!booking) return;
    
    try {
      await updateDailyWorkLogDescription(booking.id, logId, editingDescription);
      await loadBooking(); // Reload to get updated data
      setEditingDescriptionDate(null);
      setEditingDescription("");
      toast({
        title: "Success",
        description: "Daily work description updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update description",
        variant: "destructive",
      });
    }
  };

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>, date: string) => {
    if (!booking || !e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter(file => {
      return file.type.startsWith('image/') || file.type.startsWith('video/');
    });
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid File Type",
        description: "Only images and videos are allowed",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploadingMedia(true);
      setUploadingDate(date);
      await uploadDailyWorkMedia(booking.id, date, validFiles);
      await loadBooking(); // Reload to get updated data
      toast({
        title: "Success",
        description: `${validFiles.length} file(s) uploaded successfully`,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setIsUploadingMedia(false);
      setUploadingDate(null);
    }
  };

  const handleDeleteMedia = async (logId: number, mediaUrl: string | { url: string }) => {
    if (!booking) return;
    
    // Extract URL if mediaUrl is an object
    const urlToDelete = typeof mediaUrl === 'string' ? mediaUrl : (mediaUrl.url || mediaUrl);
    
    if (!confirm("Are you sure you want to delete this media?")) {
      return;
    }
    
    try {
      setIsDeletingMedia(urlToDelete);
      await deleteDailyWorkMedia(booking.id, logId, urlToDelete);
      await loadBooking(); // Reload to get updated data
      toast({
        title: "Success",
        description: "Media deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete media",
        variant: "destructive",
      });
    } finally {
      setIsDeletingMedia(null);
    }
  };

  const handleDeleteDate = async (date: string) => {
    if (!booking) return;
    
    const dateObj = new Date(date);
    const formattedDate = format(dateObj, "EEEE, MMMM d, yyyy");
    
    if (!confirm(`Are you sure you want to delete all content for ${formattedDate}? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setIsDeletingDate(date);
      await deleteDailyWorkByDate(booking.id, date);
      await loadBooking(); // Reload to get updated data
      toast({
        title: "Success",
        description: `All content for ${formattedDate} deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete content for date",
        variant: "destructive",
      });
    } finally {
      setIsDeletingDate(null);
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
                Created on {formatIST(booking.created_at, "MMMM d, yyyy 'at' h:mm a")}
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
                    </div>
                  </div>
                  
                  <CardContent className="p-6 grid gap-6">
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

              {/* Daily Work Logs Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        Daily Work Logs
                      </CardTitle>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNewLogDate(getCurrentDate());
                            setNewLogDescription("");
                            setShowCreateLogDialog(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Log
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {booking?.daily_work_logs && booking.daily_work_logs.length > 0 ? (
                      <div className="space-y-6">
                        {booking.daily_work_logs
                          .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime())
                          .map((log) => {
                            const dateObj = new Date(log.log_date);
                            const formattedDate = format(dateObj, "EEEE, MMMM d, yyyy");
                            
                            // Handle both old format (strings) and new format (objects with {date, url})
                            const photos = (log.photos || []).map((photo: any) => 
                              typeof photo === 'string' ? photo : photo.url || photo
                            );
                            const videos = (log.videos || []).map((video: any) => 
                              typeof video === 'string' ? video : video.url || video
                            );
                            
                            const isEditingThisDate = editingDescriptionDate === log.log_date;
                            
                            return (
                              <div key={log.id} className="space-y-4 border-l-2 border-primary/20 pl-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <h4 className="text-base font-semibold text-gray-900">
                                      {formattedDate}
                                    </h4>
                                    <Badge variant="secondary" className="text-xs">
                                      {photos.length} photo{photos.length !== 1 ? 's' : ''}, {videos.length} video{videos.length !== 1 ? 's' : ''}
                                    </Badge>
                                  </div>
                                  {isAdmin && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeleteDate(log.log_date)}
                                      disabled={isDeletingDate === log.log_date}
                                      className="flex items-center gap-2"
                                    >
                                      {isDeletingDate === log.log_date ? (
                                        <>
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                          Deleting...
                                        </>
                                      ) : (
                                        <>
                                          <Trash2 className="h-3.5 w-3.5" />
                                          Delete Date
                                        </>
                                      )}
                                    </Button>
                                  )}
                                </div>
                                
                                {/* Description Section */}
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-medium text-gray-700">Description</h5>
                                    {isAdmin && (
                                      <div className="flex gap-2">
                                        {isEditingThisDate ? (
                                          <>
                                            <Button
                                              size="sm"
                                              onClick={() => handleSaveDescription(log.id, log.log_date)}
                                              disabled={!editingDescription.trim()}
                                            >
                                              <Save className="h-3.5 w-3.5 mr-2" />
                                              Save
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                setEditingDescriptionDate(null);
                                                setEditingDescription("");
                                              }}
                                            >
                                              <X className="h-3.5 w-3.5" />
                                            </Button>
                                          </>
                                        ) : (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              setEditingDescriptionDate(log.log_date);
                                              setEditingDescription(log.description || "");
                                            }}
                                          >
                                            <Edit2 className="h-3.5 w-3.5 mr-2" />
                                            Edit
                                          </Button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {isEditingThisDate && isAdmin ? (
                                    <Textarea
                                      value={editingDescription}
                                      onChange={(e) => setEditingDescription(e.target.value)}
                                      placeholder="Enter daily work description..."
                                      className="min-h-[120px]"
                                    />
                                  ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                        {log.description || "No description added yet."}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Photos for this date */}
                                {photos.length > 0 && (
                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                      <ImageIcon className="h-3.5 w-3.5" />
                                      Photos
                                    </h5>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      {photos.map((photoUrl: string, index: number) => {
                                        const photoUrlStr = typeof photoUrl === 'string' ? photoUrl : (photoUrl as any).url || photoUrl;
                                        return (
                                          <div key={index} className="relative group">
                                            <img
                                              src={photoUrlStr}
                                              alt={`Daily work photo ${index + 1} - ${log.log_date}`}
                                              className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                              onError={(e) => {
                                                console.error(`Failed to load image: ${photoUrlStr}`);
                                                (e.target as HTMLImageElement).style.display = 'none';
                                              }}
                                            />
                                            {isAdmin && (
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDeleteMedia(log.id, photoUrlStr)}
                                                disabled={isDeletingMedia === photoUrlStr}
                                              >
                                                {isDeletingMedia === photoUrlStr ? (
                                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                )}
                                              </Button>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Videos for this date */}
                                {videos.length > 0 && (
                                  <div className="space-y-2">
                                    <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                      <Video className="h-3.5 w-3.5" />
                                      Videos
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {videos.map((videoUrl: string, index: number) => {
                                        const videoUrlStr = typeof videoUrl === 'string' ? videoUrl : (videoUrl as any).url || videoUrl;
                                        return (
                                          <div key={index} className="relative group">
                                            <video
                                              src={videoUrlStr}
                                              controls
                                              className="w-full h-auto rounded-lg border border-gray-200"
                                              onError={(e) => {
                                                console.error(`Failed to load video: ${videoUrlStr}`);
                                              }}
                                            >
                                              Your browser does not support the video tag.
                                            </video>
                                            {isAdmin && (
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDeleteMedia(log.id, videoUrlStr)}
                                                disabled={isDeletingMedia === videoUrlStr}
                                              >
                                                {isDeletingMedia === videoUrlStr ? (
                                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                )}
                                              </Button>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Upload button for this date */}
                                {isAdmin && (
                                  <div className="flex items-center gap-2">
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      accept="image/*,video/*"
                                      multiple
                                      className="hidden"
                                      data-date={log.log_date}
                                      onChange={(e) => {
                                        const date = e.currentTarget.getAttribute('data-date');
                                        if (date) handleUploadMedia(e, date);
                                      }}
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedDate(log.log_date);
                                        if (fileInputRef.current) {
                                          fileInputRef.current.setAttribute('data-date', log.log_date);
                                          fileInputRef.current.click();
                                        }
                                      }}
                                      disabled={isUploadingMedia && uploadingDate === log.log_date}
                                    >
                                      {isUploadingMedia && uploadingDate === log.log_date ? (
                                        <>
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                          Uploading...
                                        </>
                                      ) : (
                                        <>
                                          <Upload className="h-4 w-4 mr-2" />
                                          Upload More Media
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">
                          {isAdmin 
                            ? "No daily work logs added yet. Upload photos/videos to create a log entry for today's date."
                            : "No daily work logs available yet."}
                        </p>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                              const today = getCurrentDate();
                              setSelectedDate(today);
                              setUploadingDate(today);
                              if (fileInputRef.current) {
                                fileInputRef.current.setAttribute('data-date', today);
                                // Reset the input value to allow selecting the same file again
                                fileInputRef.current.value = '';
                                fileInputRef.current.click();
                              }
                            }}
                            disabled={isUploadingMedia && uploadingDate === getCurrentDate()}
                          >
                            {isUploadingMedia && uploadingDate === getCurrentDate() ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Media for Today
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {/* Hidden file input for uploads */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const date = e.currentTarget.getAttribute('data-date') || getCurrentDate();
                        handleUploadMedia(e, date);
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Payment Summary Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-md border-primary/10 overflow-hidden">
                  <div className="bg-gray-50/50 p-4 border-b border-gray-100">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <span className="text-gray-500 text-lg">₹</span>
                      Payment Summary
                    </CardTitle>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    {isLoadingCosts ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        {/* Cost Items List */}
                        {costs.length > 0 ? (
                          <div className="space-y-3">
                            {costs.map((cost) => (
                              <div key={cost.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                {editingCostId === cost.id && isAdmin && !isBookingLocked ? (
                                  // Edit Mode (Admin/Super Admin only)
                                  <div className="flex-1 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                      <Input
                                        value={editingCost.item_name || ""}
                                        onChange={(e) => setEditingCost({ ...editingCost, item_name: e.target.value })}
                                        placeholder="Item name"
                                        className="h-9 text-sm"
                                      />
                                      <Input
                                        type="number"
                                        value={editingCost.amount || ""}
                                        onChange={(e) => setEditingCost({ ...editingCost, amount: e.target.value })}
                                        placeholder="Amount"
                                        className="h-9 text-sm"
                                      />
                                    </div>
                                    <Input
                                      value={editingCost.description || ""}
                                      onChange={(e) => setEditingCost({ ...editingCost, description: e.target.value })}
                                      placeholder="Description (optional)"
                                      className="h-9 text-sm"
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => handleSaveCost(cost.id)}
                                        className="h-9 flex-1"
                                      >
                                        <Save className="h-3.5 w-3.5 mr-2" />
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        className="h-9"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  // View Mode
                                  <>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900">{cost.item_name}</p>
                                      {cost.description && (
                                        <p className="text-xs text-gray-500 mt-0.5">{cost.description}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm font-semibold text-gray-900">
                                        ₹{cost.amount.toLocaleString()}
                                      </span>
                                      {isAdmin && !isBookingLocked && (
                                        <div className="flex gap-1">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEditCost(cost)}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Edit2 className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDeleteCost(cost.id)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500">
                              {isAdmin ? "No cost items added yet" : "Cost will be calculated after inspection"}
                            </p>
                          </div>
                        )}

                        {/* Add New Cost Item (Admin/Super Admin only) */}
                        {isAdmin && !isBookingLocked && (
                          <>
                            <Separator />
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-gray-700">Add Cost Item</p>
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  value={newCostItem.item_name}
                                  onChange={(e) => setNewCostItem({ ...newCostItem, item_name: e.target.value })}
                                  placeholder="Item name"
                                  className="h-9 text-sm"
                                />
                                <Input
                                  type="number"
                                  value={newCostItem.amount}
                                  onChange={(e) => setNewCostItem({ ...newCostItem, amount: e.target.value })}
                                  placeholder="Amount (₹)"
                                  className="h-9 text-sm"
                                />
                              </div>
                              <Input
                                value={newCostItem.description}
                                onChange={(e) => setNewCostItem({ ...newCostItem, description: e.target.value })}
                                placeholder="Description (optional)"
                                className="h-9 text-sm"
                              />
                              <Button
                                onClick={handleAddCost}
                                className="w-full h-9"
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Cost Item
                              </Button>
                            </div>
                          </>
                        )}
                        {/* Show message when booking is locked */}
                        {isAdmin && isBookingLocked && (
                          <>
                            <Separator />
                            <div className="text-center py-3 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-500">
                                Cost management is disabled for {booking?.status === BookingStatus.COMPLETED ? "completed" : "cancelled"} bookings.
                              </p>
                            </div>
                          </>
                        )}

                        {/* Total */}
                        {costs.length > 0 && (
                          <>
                            <Separator />
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-lg font-semibold text-gray-900">Total</span>
                              <span className="text-2xl font-bold text-primary">
                                ₹{totalCost.toLocaleString()}
                              </span>
                            </div>
                          </>
                        )}
                      </>
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
                            {formatIST(booking.updated_at, "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                      )}

                      {booking.completed_at && (
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white" />
                          <p className="text-sm font-medium text-gray-900">Completed</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatIST(booking.completed_at, "MMM d, yyyy h:mm a")}
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

      {/* Create New Log Dialog */}
      <Dialog open={showCreateLogDialog} onOpenChange={setShowCreateLogDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Daily Work Log</DialogTitle>
            <DialogDescription>
              Create a new daily work log entry with description. You can add photos and videos after creating the log.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="log-date">Date</Label>
              <Input
                id="log-date"
                type="date"
                value={newLogDate}
                onChange={(e) => setNewLogDate(e.target.value)}
                max={getCurrentDate()}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="log-description">Description (Optional)</Label>
              <Textarea
                id="log-description"
                value={newLogDescription}
                onChange={(e) => setNewLogDescription(e.target.value)}
                placeholder="Enter a description of the work performed on this date..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateLogDialog(false);
                setNewLogDate(getCurrentDate());
                setNewLogDescription("");
              }}
              disabled={isCreatingLog}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateLog}
              disabled={isCreatingLog || !newLogDate}
            >
              {isCreatingLog ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Log
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default BookingDetails;
