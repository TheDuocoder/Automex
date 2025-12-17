import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wrench, Plus, Loader2, Edit, Trash2, User, Calendar } from "lucide-react";
import { extraServiceService, employeeService, type ExtraService, type ExtraServiceCreate, type Employee } from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";

const ExtraServices = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [extraServices, setExtraServices] = useState<ExtraService[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<ExtraService | null>(null);
  
  const [formData, setFormData] = useState<ExtraServiceCreate>({
    service_name: "",
    vehicle_name: "",
    assigned_employee_id: undefined,
    price: 0,
    owner_details: "",
    service_description: "",
  });

  // Check if user is Admin or Super Admin
  const isAdmin = user?.role?.name?.toLowerCase() === "admin" || user?.role?.name?.toLowerCase() === "super" || user?.is_superuser;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (!isAdmin) {
      toast.error("Access Denied", {
        description: "Only Admin and Super Admin can access this page.",
      });
      navigate('/');
      return;
    }

    loadExtraServices();
    loadEmployees();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadExtraServices = async () => {
    try {
      setIsLoading(true);
      const response = await extraServiceService.getAll();
      if (response.data) {
        setExtraServices(response.data);
      }
    } catch (error) {
      console.error("Failed to load extra services:", error);
      toast.error("Failed to load extra services");
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeeService.getAll();
      if (response.data) {
        const activeEmployees = response.data.filter(emp => emp.is_active);
        setEmployees(activeEmployees);
      }
    } catch (error) {
      console.error("Failed to load employees:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: "",
      vehicle_name: "",
      assigned_employee_id: undefined,
      price: 0,
      owner_details: "",
      service_description: "",
    });
    setEditingService(null);
  };

  const handleSubmit = async () => {
    if (!formData.service_name || !formData.price || formData.price <= 0) {
      toast.error("Validation Error", {
        description: "Please fill in service name and price.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const cleanData: ExtraServiceCreate = {
        service_name: formData.service_name,
        vehicle_name: formData.vehicle_name || undefined,
        assigned_employee_id: formData.assigned_employee_id || undefined,
        price: formData.price,
        owner_details: formData.owner_details || undefined,
        service_description: formData.service_description || undefined,
      };

      if (editingService) {
        await extraServiceService.update(editingService.id, cleanData);
        toast.success("Extra Service Updated", {
          description: "Service has been updated successfully.",
        });
      } else {
        await extraServiceService.create(cleanData);
        toast.success("Extra Service Created", {
          description: "Service has been created successfully.",
        });
      }

      setIsAddOpen(false);
      resetForm();
      await loadExtraServices();
    } catch (error) {
      console.error("Failed to save extra service:", error);
      toast.error("Failed to save service", {
        description: error instanceof Error ? error.message : "An error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: ExtraService) => {
    setEditingService(service);
    setFormData({
      service_name: service.service_name,
      vehicle_name: service.vehicle_name || "",
      assigned_employee_id: service.assigned_employee_id,
      price: service.price,
      owner_details: service.owner_details || "",
      service_description: service.service_description || "",
    });
    setIsAddOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this extra service?")) {
      return;
    }

    try {
      await extraServiceService.delete(id);
      toast.success("Service Deleted", {
        description: "Service has been deleted successfully.",
      });
      await loadExtraServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error("Failed to delete service");
    }
  };

  // Group services by date
  const groupedServices = extraServices.reduce((acc, service) => {
    const date = format(new Date(service.created_at), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(service);
    return acc;
  }, {} as Record<string, ExtraService[]>);

  const sortedDates = Object.keys(groupedServices).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2">Extra Services</h1>
              <p className="text-gray-500 text-sm md:text-base">Manage and create additional service options for your customers.</p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Extra Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingService ? "Edit Extra Service" : "Add New Extra Service"}</DialogTitle>
                  <DialogDescription>
                    Fill in the details to {editingService ? "update" : "create"} an extra service.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="service_name">
                        Service Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="service_name"
                        value={formData.service_name}
                        onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                        placeholder="e.g., AC Repair, Battery Replacement"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vehicle_name">Vehicle Name (Optional)</Label>
                      <Input
                        id="vehicle_name"
                        value={formData.vehicle_name}
                        onChange={(e) => setFormData({ ...formData, vehicle_name: e.target.value })}
                        placeholder="e.g., Honda City, Maruti Swift"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assigned_employee">Assign To</Label>
                      <Select
                        value={formData.assigned_employee_id?.toString() || "unassigned"}
                        onValueChange={(value) => setFormData({ ...formData, assigned_employee_id: value === "unassigned" ? undefined : parseInt(value) })}
                      >
                        <SelectTrigger id="assigned_employee">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                          {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                              {emp.full_name} {emp.position ? `(${emp.position})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Price (₹) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price || ""}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner_details">Owner Details (Optional)</Label>
                    <Textarea
                      id="owner_details"
                      value={formData.owner_details}
                      onChange={(e) => setFormData({ ...formData, owner_details: e.target.value })}
                      placeholder="Owner name, phone number, address, etc."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service_description">Service Description</Label>
                    <Textarea
                      id="service_description"
                      value={formData.service_description}
                      onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
                      placeholder="Describe the service details..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingService ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editingService ? "Update Service" : "Create Service"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-gray-500 animate-pulse">Loading extra services...</p>
            </div>
          ) : extraServices.length === 0 ? (
            <div className="relative overflow-hidden rounded-[32px] p-12 md:p-20 text-center transition-all duration-300 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              }}
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full blur-3xl"></div>
              </div>

              {/* Glass-morphism icon container with animation */}
              <div className="relative inline-block mb-8 group">
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"
                  style={{ transform: 'scale(1.2)' }}
                ></div>
                <div 
                  className="relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 0 rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                  }}
                >
                  <Wrench 
                    className="h-12 w-12 md:h-14 md:w-14 transition-all duration-500 group-hover:rotate-[-12deg]" 
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))',
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h2 
                  className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 bg-clip-text"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  No Extra Services Added Yet
                </h2>
                <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                  Start by adding your first extra service to enhance your service offerings.
                  <br />
                  <span className="text-sm text-gray-400 mt-2 inline-block">
                    Click the <span className="font-semibold text-gray-600">Add Extra Service</span> button above to begin.
                  </span>
                </p>
              </div>

              {/* Bottom decorative wave */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedDates.map((date) => (
                <div key={date} className="space-y-5">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {format(new Date(date), "EEEE, MMMM d, yyyy")}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      {groupedServices[date].length} {groupedServices[date].length === 1 ? 'service' : 'services'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedServices[date].map((service) => (
                      <div 
                        key={service.id} 
                        className="group relative overflow-hidden rounded-[20px] bg-white transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
                        style={{
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {/* Header Section with Background Strip */}
                        <div 
                          className="px-6 pt-6 pb-4 relative"
                          style={{
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight">
                                {service.service_name}
                              </h3>
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                Extra Service
                              </span>
                            </div>
                            
                            {/* Floating Action Badges */}
                            <div className="flex gap-2 ml-3">
                              <button
                                onClick={() => handleEdit(service)}
                                className="group/edit flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-900 transition-all duration-300 hover:scale-110"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4 text-gray-700 group-hover/edit:text-white transition-colors" />
                              </button>
                              <button
                                onClick={() => handleDelete(service.id)}
                                className="group/delete flex items-center justify-center w-9 h-9 rounded-full bg-red-50 hover:bg-red-500 transition-all duration-300 hover:scale-110"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-red-500 group-hover/delete:text-white transition-colors" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="px-6 py-4 space-y-4">
                          {/* Vehicle and Price in same row */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Vehicle */}
                            {service.vehicle_name && (
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  🚗 Vehicle
                                </p>
                                <p className="text-base font-bold text-gray-900">
                                  {service.vehicle_name}
                                </p>
                              </div>
                            )}

                            {/* Price with Green Gradient */}
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                💰 Price
                              </p>
                              <p 
                                className="text-2xl font-black tracking-tight"
                                style={{
                                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                ₹{service.price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Assigned Employee */}
                          {service.assigned_employee_name && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                👤 Assigned To
                              </p>
                              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                {service.assigned_employee_name}
                              </p>
                            </div>
                          )}

                          {/* Owner Details */}
                          {service.owner_details && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                👤 Owner Details
                              </p>
                              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                {service.owner_details}
                              </p>
                            </div>
                          )}

                          {/* Description */}
                          {service.service_description && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                📝 Description
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                {service.service_description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Footer with Elegant Border */}
                        <div 
                          className="px-6 py-3 mt-2"
                          style={{
                            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                            background: 'linear-gradient(to bottom, transparent, rgba(248, 250, 252, 0.5))',
                          }}
                        >
                          <p className="text-xs text-gray-400 flex items-center gap-1.5">
                            <span className="font-medium">Created by {service.created_by_name || "Admin"}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{format(new Date(service.created_at), "h:mm a")}</span>
                          </p>
                        </div>

                        {/* Hover Border Glow Effect */}
                        <div 
                          className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                          }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExtraServices;

