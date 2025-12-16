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
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Extra Services</h1>
            </div>
            <Dialog open={isAddOpen} onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6 shadow-lg hover:shadow-xl transition-all">
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
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
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
            <Card className="p-8 md:p-16 text-center border-dashed border-2 bg-white/50">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">No Extra Services Yet</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm md:text-base">
                Start by adding your first extra service using the button above.
              </p>
            </Card>
          ) : (
            <div className="space-y-8">
              {sortedDates.map((date) => (
                <div key={date} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <h2 className="text-xl font-bold text-gray-900">
                      {format(new Date(date), "EEEE, MMMM d, yyyy")}
                    </h2>
                    <span className="text-sm text-gray-500">
                      ({groupedServices[date].length} {groupedServices[date].length === 1 ? 'service' : 'services'})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedServices[date].map((service) => (
                      <Card key={service.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg font-bold">{service.service_name}</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(service)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(service.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {service.vehicle_name && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Vehicle</p>
                              <p className="text-sm font-semibold">{service.vehicle_name}</p>
                            </div>
                          )}
                          {service.assigned_employee_name && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Assigned To</p>
                              <p className="text-sm font-semibold flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {service.assigned_employee_name}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Price</p>
                            <p className="text-lg font-bold text-green-600">₹{service.price.toLocaleString()}</p>
                          </div>
                          {service.owner_details && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Owner Details</p>
                              <p className="text-sm text-gray-700">{service.owner_details}</p>
                            </div>
                          )}
                          {service.service_description && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Description</p>
                              <p className="text-sm text-gray-700 line-clamp-3">{service.service_description}</p>
                            </div>
                          )}
                          <div className="pt-2 border-t">
                            <p className="text-xs text-gray-400">
                              Created by {service.created_by_name || "Admin"} • {format(new Date(service.created_at), "h:mm a")}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
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

