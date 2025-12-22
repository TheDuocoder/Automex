import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User, Calendar as CalendarIcon, MapPin, Phone, FileText, ChevronLeft,
  CheckCircle2, AlertCircle, Clock, ShieldCheck, Download, FolderOpen, Plus, Trash2, X,
  Loader2, XCircle, Wrench, Car, Mail, UploadCloud, Image as ImageIcon, Video
} from "lucide-react";
import { getBooking, cancelBooking, getUserBookings, type Booking, BookingStatus } from "@/services/bookingService";
import { getBookingCosts, type Cost } from "@/services/costService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { employeeService, type Employee } from "@/services/api";
import { assignEmployeeToBooking, updateBookingStatus, createDailyWorkLog, uploadDailyWorkMedia } from "@/services/bookingService";
import { createCost } from "@/services/costService";

// Helper for status colors/icons
const getStatusConfig = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.COMPLETED:
      return { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2, label: "Completed" };
    case BookingStatus.CANCELLED:
      return { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "Cancelled" };
    case BookingStatus.IN_PROGRESS:
      return { color: "bg-purple-100 text-purple-700 border-purple-200", icon: Loader2, label: "In Progress" };
    case BookingStatus.ANALYSE:
      return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: FileText, label: "Analyzing" };
    default:
      return { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock, label: "Pending" };
  }
};

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

const BookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [groupedBookings, setGroupedBookings] = useState<Booking[]>([]); // All bookings in the same group
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  // RBAC State
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Assignment Dialog State
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Status Dialog State
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "">("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Payment Dialog State
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [newCostItem, setNewCostItem] = useState("");
  const [newCostAmount, setNewCostAmount] = useState("");
  const [isAddingCost, setIsAddingCost] = useState(false);

  // Daily Work Log Dialog State
  const [isWorkLogDialogOpen, setIsWorkLogDialogOpen] = useState(false);
  const [logDate, setLogDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [logDescription, setLogDescription] = useState("");
  const [logPhotos, setLogPhotos] = useState<File[]>([]);
  const [logVideos, setLogVideos] = useState<File[]>([]);
  const [isAddingLog, setIsAddingLog] = useState(false);

  const isAdmin = user?.role?.name?.toLowerCase() === "admin" || user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;
  const isSuperAdmin = user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (bookingId) { loadBooking(); }
  }, [isAuthenticated, bookingId]);

  useEffect(() => {
    if (booking?.id) { loadCosts(); }
  }, [booking?.id]);

  useEffect(() => {
    if (isSuperAdmin && isAuthenticated) {
      loadEmployees();
    }
  }, [isSuperAdmin, isAuthenticated]);

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      if (response.data) {
        setEmployees(response.data.filter(e => e.is_active));
      }
    } catch (error) {
      console.error("Failed to load employees", error);
    }
  };

  const handleAssignEmployee = async () => {
    if (!booking) return;
    try {
      setIsAssigning(true);
      const empId = selectedEmployeeId ? parseInt(selectedEmployeeId) : undefined;

      await assignEmployeeToBooking(booking.id, {
        employee_id: empId,
        notes: assignmentNotes
      });

      toast({ title: "Success", description: "Employee assigned successfully" });
      setIsAssignDialogOpen(false);
      setAssignmentNotes("");
      loadBooking(); // Reload to show updated assignment
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign employee",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleStatusChange = async () => {
    if (!booking || !selectedStatus) return;
    try {
      setIsUpdatingStatus(true);
      await updateBookingStatus(booking.id, selectedStatus as BookingStatus);
      toast({ title: "Success", description: "Status updated successfully" });
      setIsStatusDialogOpen(false);
      loadBooking();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddCost = async () => {
    if (!booking || !newCostItem || !newCostAmount) return;
    try {
      setIsAddingCost(true);
      await createCost({
        booking_id: booking.id,
        item_name: newCostItem,
        amount: parseFloat(newCostAmount)
      });

      toast({ title: "Success", description: "Cost added successfully" });
      setIsPaymentDialogOpen(false);
      setNewCostItem("");
      setNewCostAmount("");
      loadCosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add cost",
        variant: "destructive"
      });
    } finally {
      setIsAddingCost(false);
    }
  };

  const handleAddWorkLog = async () => {
    if (!booking || !logDate) return;
    try {
      setIsAddingLog(true);

      // 1. Create the log entry
      const log = await createDailyWorkLog(booking.id, logDate, logDescription);

      // 2. Upload media if any
      const allFiles = [...logPhotos, ...logVideos];
      if (allFiles.length > 0) {
        await uploadDailyWorkMedia(booking.id, logDate, allFiles);
      }

      toast({ title: "Success", description: "Daily work log added successfully" });
      setIsWorkLogDialogOpen(false);
      setLogDescription("");
      setLogPhotos([]);
      setLogVideos([]);
      setLogDate(format(new Date(), "yyyy-MM-dd"));
      loadBooking(); // Reload to show new log
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add work log",
        variant: "destructive"
      });
    } finally {
      setIsAddingLog(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'videos') => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      if (type === 'photos') {
        setLogPhotos(prev => [...prev, ...filesArray]);
      } else {
        setLogVideos(prev => [...prev, ...filesArray]);
      }
    }
  };

  const removeFile = (index: number, type: 'photos' | 'videos') => {
    if (type === 'photos') {
      setLogPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setLogVideos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const loadBooking = async () => {
    try {
      setIsLoading(true);
      if (!bookingId) return;
      const data = await getBooking(parseInt(bookingId));
      if (data) {
        setBooking(data);

        // If this booking has a group_id, fetch all bookings in the same group
        if (data.booking_group_id) {
          try {
            const allBookings = await getUserBookings();
            const grouped = allBookings.filter(b => b.booking_group_id === data.booking_group_id);
            setGroupedBookings(grouped);
          } catch (error) {
            console.error('Failed to load grouped bookings:', error);
            setGroupedBookings([data]); // Fallback to just the current booking
          }
        } else {
          setGroupedBookings([data]); // Single booking, not part of a group
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load booking", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCosts = async () => {
    if (!booking) return;
    try {
      const response = await getBookingCosts(booking.id);
      setCosts(response.costs);
      setTotalCost(response.total);
    } catch {
      setCosts([]);
      setTotalCost(0);
    }
  };

  const handleCancel = async () => {
    if (!booking || !confirm("Are you sure you want to permanently delete this booking?")) return;
    try {
      setCancellingId(booking.id);
      await cancelBooking(booking.id);
      toast({ title: "Cancelled", description: "Booking cancelled successfully" });
      await loadBooking();
    } catch {
      toast({ title: "Failed", description: "Could not cancel booking", variant: "destructive" });
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!booking) return <div className="min-h-screen flex items-center justify-center">Booking Not Found</div>;

  const StatusIcon = getStatusConfig(booking.status).icon;
  const statusConfig = getStatusConfig(booking.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header />

      {/* Top Navigation Bar */}
      <div className="bg-white border-b sticky top-16 z-10 px-4 py-3 sm:py-4 shadow-sm">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg sm:text-xl font-bold flex flex-wrap items-center gap-2">
                Booking #{booking.id}
                <Badge className={cn("ml-0 sm:ml-2", statusConfig.color)}>
                  {statusConfig.label}
                </Badge>
              </h1>
              <p className="text-xs text-gray-500 mt-1 sm:mt-0">Created on {format(new Date(booking.created_at.endsWith("Z") ? booking.created_at : booking.created_at + "Z"), "MMM d, yyyy 'at' h:mm a")}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-services')} className="shrink-0">
            <ChevronLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </div>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Service Card */}
            <Card className="border-none shadow-md overflow-hidden">
              <div className="bg-red-50 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center shadow-sm text-red-600">
                  <Wrench className="h-8 w-8" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  {groupedBookings.length > 1 ? (
                    <>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">Multiple Services Booking</h2>
                      <div className="space-y-1 mb-2">
                        {groupedBookings.map((b, idx) => (
                          <div key={b.id} className="text-gray-800 font-medium">
                            • {b.service_name}
                          </div>
                        ))}
                      </div>
                      <Badge variant="outline" className="mb-2">
                        {groupedBookings.length} Services
                      </Badge>
                    </>
                  ) : (
                    <h2 className="text-xl font-bold text-gray-900">{booking.service_name}</h2>
                  )}
                  <p className="text-gray-600 mt-1">
                    Scheduled for <span className="font-medium">{formatDbDate(booking.booking_date, "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
                  </p>
                  {booking.technician_notes && (
                    <p className="text-sm text-gray-500 mt-2 bg-white/50 p-2 rounded">
                      Note: {booking.technician_notes}
                    </p>
                  )}
                </div>
              </div>

              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b">
                  {/* Vehicle Details */}
                  <div className="p-4 sm:p-6 space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle Details</h3>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                        <Car className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{booking.car_brand} {booking.car_model}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {booking.fuel_type && <Badge variant="outline" className="text-xs">{booking.fuel_type}</Badge>}
                          {booking.vehicle_registration && <Badge variant="secondary" className="text-xs">{booking.vehicle_registration}</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="p-4 sm:p-6 space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Person</h3>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{booking.contact_name || user?.full_name || "N/A"}</p>
                        {booking.contact_phone && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                            <Phone className="h-3 w-3" /> {booking.contact_phone}
                          </div>
                        )}
                        {(booking.user_email || user?.email) && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                            <Mail className="h-3 w-3" /> {booking.user_email || user?.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 border-b">
                  <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Employee</h3>
                    {isSuperAdmin && (
                      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            {booking.assigned_employee_id ? "Change" : "Assign"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Employee</DialogTitle>
                            <DialogDescription>
                              Select an employee to assign to this booking.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="employee">Employee</Label>
                              <Select
                                onValueChange={setSelectedEmployeeId}
                                defaultValue={booking.assigned_employee_id?.toString()}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an employee" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unassigned">Unassigned (None)</SelectItem>
                                  {employees.map((emp) => (
                                    <SelectItem key={emp.id} value={emp.id.toString()}>
                                      {emp.full_name} ({emp.position || "Staff"})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="notes">Notes (Optional)</Label>
                              <Textarea
                                id="notes"
                                value={assignmentNotes}
                                onChange={(e) => setAssignmentNotes(e.target.value)}
                                placeholder="Instructions for employee..."
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAssignEmployee} disabled={isAssigning}>
                              {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Save Assignment
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  {booking.assigned_employee_name ? (
                    <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                        {booking.assigned_employee_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">{booking.assigned_employee_name}</p>
                        <p className="text-xs text-blue-600">Technician</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Not assigned yet
                    </div>
                  )}


                </div>

                {/* Pickup & Address */}
                {booking.pickup_address && (
                  <div className="p-4 sm:p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Pickup Location</h3>
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin className="h-5 w-5 text-red-500 shrink-0" />
                      <p>{booking.pickup_address}</p>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Daily Work Logs - Simplified for User View */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-gray-50/50 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Daily Work Logs
                  </CardTitle>
                  {isAdmin && (
                    <Dialog open={isWorkLogDialogOpen} onOpenChange={setIsWorkLogDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Plus className="mr-1 h-3 w-3" /> Add Log
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg w-full sm:rounded-2xl p-0 overflow-hidden">
                        <DialogHeader className="p-6 pb-2">
                          <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <div className="bg-red-50 p-2 rounded-lg">
                              <FileText className="h-5 w-5 text-red-600" />
                            </div>
                            Add Work Log
                          </DialogTitle>
                          <DialogDescription className="text-gray-500">
                            Log progress with photos or videos for the customer.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="px-6 py-2 space-y-5">
                          {/* Date & Description Group */}
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="logDate" className="text-sm font-semibold text-gray-700">Date</Label>
                              <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="logDate"
                                  type="date"
                                  value={logDate}
                                  onChange={(e) => setLogDate(e.target.value)}
                                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="logDesc" className="text-sm font-semibold text-gray-700">Description</Label>
                              <Textarea
                                id="logDesc"
                                value={logDescription}
                                onChange={(e) => setLogDescription(e.target.value)}
                                placeholder="Describe the work done today..."
                                className="min-h-[100px] bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none"
                              />
                            </div>
                          </div>

                          {/* Media Upload Section */}
                          <div className="space-y-4">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                              <span>Media Attachments</span>
                              <span className="text-xs font-normal text-gray-400">Optional</span>
                            </Label>

                            <div className="grid grid-cols-2 gap-3">
                              {/* Photo Upload */}
                              <div className="relative group">
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, 'photos')}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border border-dashed border-gray-300 bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 group-hover:bg-red-50 group-hover:border-red-200 transition-colors h-full">
                                  <div className="bg-white p-2 rounded-full shadow-sm">
                                    <ImageIcon className="h-5 w-5 text-gray-500 group-hover:text-red-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700">Add Photos</p>
                                    <p className="text-[10px] text-gray-400">JPG, PNG</p>
                                  </div>
                                </div>
                              </div>

                              {/* Video Upload */}
                              <div className="relative group">
                                <input
                                  type="file"
                                  multiple
                                  accept="video/*"
                                  onChange={(e) => handleFileChange(e, 'videos')}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="border border-dashed border-gray-300 bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 group-hover:bg-red-50 group-hover:border-red-200 transition-colors h-full">
                                  <div className="bg-white p-2 rounded-full shadow-sm">
                                    <Video className="h-5 w-5 text-gray-500 group-hover:text-red-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700">Add Videos</p>
                                    <p className="text-[10px] text-gray-400">MP4, MOV</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Selected Files List */}
                            {(logPhotos.length > 0 || logVideos.length > 0) && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                {logPhotos.map((file, i) => (
                                  <div key={`p-${i}`} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 pl-2 pr-1 py-1 rounded-md flex items-center gap-1">
                                    <ImageIcon className="h-3 w-3" />
                                    <span className="max-w-[100px] truncate">{file.name}</span>
                                    <button onClick={() => removeFile(i, 'photos')} className="hover:bg-blue-100 rounded text-blue-500 p-0.5">
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                                {logVideos.map((file, i) => (
                                  <div key={`v-${i}`} className="text-xs bg-purple-50 text-purple-700 border border-purple-100 pl-2 pr-1 py-1 rounded-md flex items-center gap-1">
                                    <Video className="h-3 w-3" />
                                    <span className="max-w-[100px] truncate">{file.name}</span>
                                    <button onClick={() => removeFile(i, 'videos')} className="hover:bg-purple-100 rounded text-purple-500 p-0.5">
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <DialogFooter className="p-6 bg-gray-50/50 gap-2 sm:gap-0">
                          <Button variant="ghost" onClick={() => setIsWorkLogDialogOpen(false)} className="bg-white/50 border border-transparent hover:bg-white hover:border-gray-200">
                            Cancel
                          </Button>
                          <Button onClick={handleAddWorkLog} disabled={isAddingLog} className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100">
                            {isAddingLog && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Work Log
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {booking.daily_work_logs && booking.daily_work_logs.length > 0 ? (
                  <div className="space-y-6">
                    {booking.daily_work_logs.map((log) => (
                      <div key={log.id} className="relative pl-6 border-l-2 border-gray-200 pb-6 last:pb-0">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-red-500 ring-4 ring-white" />
                        <div className="mb-2">
                          <span className="text-sm font-bold text-gray-900">{format(new Date(log.log_date), "MMMM d, yyyy")}</span>
                        </div>
                        {log.description && <p className="text-gray-600 text-sm mb-3 bg-gray-50 p-3 rounded-lg">{log.description}</p>}

                        {((log.photos && log.photos.length > 0) || (log.videos && log.videos.length > 0)) && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                            {(log.photos || []).map((item, idx) => {
                              const url = typeof item === 'string' ? item : item.url;
                              return (
                                <div key={`photo-${idx}`} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border relative group">
                                  <img src={url} alt="Work log" className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" onClick={() => window.open(url, '_blank')} />
                                </div>
                              );
                            })}
                            {(log.videos || []).map((item, idx) => {
                              const url = typeof item === 'string' ? item : item.url;
                              return (
                                <div key={`video-${idx}`} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border relative group">
                                  <video src={url} className="w-full h-full object-cover" controls />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <FolderOpen className="h-6 w-6 text-gray-300" />
                    </div>
                    <p>No work logs uploaded yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Summaries & Actions */}
          <div className="space-y-6">

            {/* Payment Summary */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-gray-50/50 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    ₹ Payment Summary
                  </CardTitle>
                  {isAdmin && (
                    <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full">
                          <span className="text-xl leading-none">+</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Cost Item</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="item">Item Name</Label>
                            <Input
                              id="item"
                              value={newCostItem}
                              onChange={(e) => setNewCostItem(e.target.value)}
                              placeholder="e.g., Oil Filter"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="amount">Amount (₹)</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={newCostAmount}
                              onChange={(e) => setNewCostAmount(e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddCost} disabled={isAddingCost}>
                            {isAddingCost && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Cost
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {costs.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed text-gray-400 text-sm">
                    No cost items added yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {costs.map((cost) => (
                      <div key={cost.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{cost.item_name}</span>
                        <span className="font-medium">₹ {cost.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <span className="font-bold text-gray-700">Total Amount</span>
                  <span className="text-2xl font-bold text-red-600">₹ {totalCost.toLocaleString()}</span>
                </div>
              </CardContent>
              {/* Admin "Add Cost Item" hidden for User */}
            </Card>

            {/* Timeline / Status */}
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-gray-50/50 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Timeline
                  </CardTitle>
                  {isAdmin && booking.assigned_employee_id && (
                    <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Update Status
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Booking Status</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                              onValueChange={(val) => setSelectedStatus(val as BookingStatus)}
                              defaultValue={booking.status}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={BookingStatus.PENDING}>Pending</SelectItem>
                                <SelectItem value={BookingStatus.ANALYSE}>Analyzing</SelectItem>
                                <SelectItem value={BookingStatus.IN_PROGRESS}>In Progress</SelectItem>
                                <SelectItem value={BookingStatus.COMPLETED}>Completed</SelectItem>
                                <SelectItem value={BookingStatus.CANCELLED}>Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
                          <Button onClick={handleStatusChange} disabled={isUpdatingStatus}>
                            {isUpdatingStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Status
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                    <p className="text-sm font-medium text-gray-900">Current Status: {statusConfig.label}</p>
                    <p className="text-xs text-gray-500 mt-1">Updated recently</p>
                  </div>
                  <div className="relative opacity-50">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-300 ring-2 ring-white" />
                    <p className="text-sm font-medium text-gray-900">Booking Created</p>
                    <p className="text-xs text-gray-500 mt-1">{format(new Date(booking.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment History - Super Admin Only */}
            {isSuperAdmin && booking.employee_assignment_history && booking.employee_assignment_history.length > 0 && (
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-gray-50/50 pb-4">
                  <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Assignment History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {booking.employee_assignment_history.map((history) => (
                      <div key={history.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                          {history.employee_name ? history.employee_name.charAt(0) : "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {history.employee_name ? `Assigned to ${history.employee_name}` : "Unassigned"}
                          </p>
                          <p className="text-xs text-gray-500">
                            by {history.assigned_by_name || "Admin"} • {format(new Date(history.created_at.endsWith("Z") ? history.created_at : history.created_at + "Z"), "MMM d, h:mm a")}
                          </p>
                          {history.notes && (
                            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-1 italic">
                              "{history.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {booking.status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.COMPLETED && isSuperAdmin && (
              <Card className="border-none shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 flex items-center gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">Actions</h4>
                    <p className="text-xs text-gray-500">Manage booking status</p>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-gray-200" />
                </div>
                <div className="p-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleCancel}
                    disabled={cancellingId === booking.id}
                  >
                    {cancellingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Delete Booking
                  </Button>
                </div>
              </Card>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetails;
