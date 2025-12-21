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
  Calendar, Car, Clock, CheckCircle2, XCircle, Loader2, ArrowLeft, MapPin,
  User, Wrench, AlertCircle, FileText, Phone, Mail, ShieldCheck, ChevronRight, FolderOpen
} from "lucide-react";
import { getBooking, cancelBooking, getUserBookings, type Booking, BookingStatus } from "@/services/bookingService";
import { getBookingCosts, type Cost } from "@/services/costService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

  const isAdmin = user?.role?.name?.toLowerCase() === "admin" || user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;
  const isSuperAdmin = user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    if (bookingId) { loadBooking(); }
  }, [isAuthenticated, bookingId]);

  useEffect(() => {
    if (booking?.id) { loadCosts(); }
  }, [booking?.id]);

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
      <div className="bg-white border-b sticky top-16 z-10 px-4 py-4 shadow-sm">
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/my-services')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                Booking #{booking.id}
                <Badge className={cn("ml-2", statusConfig.color)}>
                  {statusConfig.label}
                </Badge>
              </h1>
              <p className="text-xs text-gray-500">Created on {format(new Date(booking.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
            </div>
          </div>
          {/* Admin Actions could go here, for now empty for User */}
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
                    Scheduled for <span className="font-medium">{format(new Date(booking.booking_date), "EEEE, MMMM d, yyyy")}</span>
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
                  <div className="p-6 space-y-4">
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
                  <div className="p-6 space-y-4">
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

                <div className="p-6 border-b">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Assigned Employee</h3>
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
                  <div className="p-6">
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Daily Work Logs
                  </CardTitle>
                  {/* Admin "Create New Log" button would go here */}
                </div>
              </CardHeader>
              <CardContent className="p-6">
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
                            {(log.photos || []).map((url, idx) => (
                              <div key={`photo-${idx}`} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border relative group">
                                <img src={url} alt="Work log" className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" onClick={() => window.open(url, '_blank')} />
                              </div>
                            ))}
                            {(log.videos || []).map((url, idx) => (
                              <div key={`video-${idx}`} className="aspect-square rounded-lg overflow-hidden bg-gray-100 border relative group">
                                <video src={url} className="w-full h-full object-cover" controls />
                              </div>
                            ))}
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
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  ₹ Payment Summary
                </CardTitle>
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
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
