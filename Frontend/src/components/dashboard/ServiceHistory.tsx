import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { History, Plus, CheckCircle, ChevronRight, Loader2, Car as CarIcon, Check, Pencil, Trash2, Calendar } from "lucide-react";
import { serviceHistoryService, carService, Car, ServiceHistory as ServiceHistoryType, ServiceHistoryCreate } from "@/services/api";
import { toast } from "sonner";

interface ServiceHistoryWithCar extends ServiceHistoryType {
    car?: Car;
}

const ServiceHistory = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role?.name === 'admin' || user?.role?.name === 'super' || user?.is_superuser;

    const [cars, setCars] = useState<Car[]>([]);
    const [selectedCarId, setSelectedCarId] = useState<string>("");
    const [allHistory, setAllHistory] = useState<ServiceHistoryWithCar[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<ServiceHistoryCreate>({
        car_id: 0,
        service_name: "",
        service_date: new Date().toISOString().split('T')[0],
        description: "",
        status: "Completed",
    });

    // Fetch all cars and their service history on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            // Fetch all cars (for dropdown)
            const carsResponse = await carService.getAll();
            if (carsResponse.data) {
                setCars(carsResponse.data);
            }

            // Fetch service history (Admin sees all, User sees theirs)
            const historyResponse = await serviceHistoryService.getAll();

            if (historyResponse.data) {
                const combinedHistory = historyResponse.data;
                // Sort by date (most recent first)
                combinedHistory.sort((a, b) =>
                    new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
                );
                setAllHistory(combinedHistory);
            } else {
                setAllHistory([]);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to fetch service history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCarId) {
            toast.error("Please select a car");
            return;
        }

        setIsSubmitting(true);
        const dataToSend = {
            ...formData,
            car_id: parseInt(selectedCarId),
        };

        let response;
        if (editingId) {
            response = await serviceHistoryService.update(editingId, dataToSend);
        } else {
            response = await serviceHistoryService.create(dataToSend);
        }

        if (response.data) {
            toast.success(editingId ? "Service record updated" : "Service record added successfully");
            setIsAddOpen(false);
            setEditingId(null);
            setFormData({
                car_id: 0,
                service_name: "",
                service_date: new Date().toISOString().split('T')[0],
                description: "",
                status: "Completed",
            });
            setSelectedCarId("");
            fetchAllData(); // Refresh all data
        } else {
            toast.error(response.error || "Failed to save service record");
        }
        setIsSubmitting(false);
    };

    const handleEdit = (record: ServiceHistoryWithCar) => {
        setEditingId(record.id);
        setFormData({
            car_id: record.car_id,
            service_name: record.service_name,
            service_date: record.service_date,
            description: record.description || "",
            status: record.status,
        });
        setSelectedCarId(record.car_id.toString());
        setIsAddOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this record?")) {
            const response = await serviceHistoryService.delete(id);
            if (!response.error) {
                toast.success("Service record deleted");
                fetchAllData();
            } else {
                toast.error(response.error || "Failed to delete record");
            }
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({
            car_id: 0,
            service_name: "",
            service_date: new Date().toISOString().split('T')[0],
            description: "",
            status: "Completed",
        });
        setSelectedCarId("");
        setIsAddOpen(true);
    };

    return (
        <Card className="shadow-lg border-none">
            <CardHeader className="border-b bg-gray-50/50 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <History className="h-5 w-5 text-primary" />
                    Service History
                </CardTitle>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button 
                            size="sm" 
                            className="gap-1 bg-green-600 hover:bg-green-700 text-white" 
                            disabled={cars.length === 0} 
                            onClick={openAddModal}
                        >
                            <Plus className="h-4 w-4" /> Add Record
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Service Record" : "Add Service Record"}</DialogTitle>
                            <DialogDescription>
                                {editingId ? "Update the details of your service record." : "Record a past service for your vehicle."}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddService}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="car" className="text-right">Vehicle</Label>
                                    <Select value={selectedCarId} onValueChange={setSelectedCarId} required>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select Car" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cars.map((car) => (
                                                <SelectItem key={car.id} value={car.id.toString()}>
                                                    {car.make} {car.model} - {car.registration_number}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="service" className="text-right">Service</Label>
                                    <Input
                                        id="service"
                                        value={formData.service_name}
                                        onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Oil Change"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="date" className="text-right">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.service_date}
                                        onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="desc" className="text-right">Description</Label>
                                    <Textarea
                                        id="desc"
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="col-span-3"
                                        placeholder="Details about the service..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting || !selectedCarId}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {editingId ? "Update Record" : "Add Record"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-center p-8">
                        <div className="mb-4">
                            <CarIcon className="h-16 w-16 mx-auto text-gray-300 mb-3" />
                        </div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">No Vehicles Added</p>
                        <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                            Please add your vehicles in the <span className="font-semibold text-primary">My Cars</span> section to avail our services and track your service history.
                        </p>
                        <Button
                            onClick={() => navigate('/profile', { state: { view: 'my-cars' } })}
                            className="gap-2"
                        >
                            <CarIcon className="h-4 w-4" />
                            Go to My Cars
                        </Button>
                    </div>
                ) : allHistory.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                        <p className="mb-2">No service history found.</p>
                        <p className="text-sm">Add your first service record to get started.</p>
                    </div>
                ) : (
                    allHistory.map((record) => (
                        <div
                            key={record.id}
                            className="bg-white rounded-[28px] p-8 transition-all duration-300 border border-gray-100/80 relative group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                            style={{
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 12px 24px rgba(0, 0, 0, 0.06)',
                            }}
                        >
                            {/* Title Section with Service Type Tag */}
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1 space-y-2">
                                    <h3 
                                        className="text-[19px] text-gray-900 leading-snug"
                                        style={{ 
                                            fontWeight: 700, 
                                            letterSpacing: '-0.02em' 
                                        }}
                                    >
                                        {record.service_name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-gray-500 font-medium">Service Type</span>
                                        <span className="text-gray-300">·</span>
                                        <span className="text-gray-700 font-semibold">Standard</span>
                                    </div>
                                </div>

                                {/* Action Buttons - Top Right */}
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handleEdit(record)}
                                        className="p-2.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                                        title="Edit"
                                    >
                                        <Pencil className="h-4 w-4" strokeWidth={2} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="p-2.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                                    </button>
                                </div>
                            </div>

                            {/* Vehicle Info Row - Enhanced */}
                            <div className="flex items-center gap-3.5 mb-4">
                                <div className="flex items-center gap-2.5">
                                    <CarIcon className="h-5 w-5 text-gray-500" strokeWidth={2} />
                                    <span className="text-[15px] font-semibold text-gray-800">
                                        {record.car?.make} {record.car?.model}
                                    </span>
                                </div>
                                <span className="text-gray-300 font-light">|</span>
                                <div 
                                    className="px-3 py-1.5 rounded-lg font-bold text-[13px] tracking-wider uppercase"
                                    style={{
                                        background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                                        border: '1.5px solid #D1D5DB',
                                        color: '#374151',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {record.car?.registration_number}
                                </div>
                                {isAdmin && record.car?.user && (
                                    <>
                                        <span className="text-gray-300 font-light">|</span>
                                        <span className="text-blue-600 font-medium text-xs bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                                            {record.car.user.full_name || record.car.user.email}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Date with Calendar Icon */}
                            <div className="flex items-center gap-2 mb-5">
                                <Calendar className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                                <p className="text-[13px] font-medium" style={{ color: '#6B7280' }}>
                                    {new Date(record.service_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            {/* Service Details Box - Enhanced */}
                            {record.description && (
                                <div 
                                    className="relative rounded-[16px] p-5 mb-5"
                                    style={{
                                        backgroundColor: '#F7F7F8',
                                        border: '1px solid #EFEFEF',
                                    }}
                                >
                                    {/* Left Red Indicator Bar */}
                                    <div 
                                        className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
                                        style={{
                                            background: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)',
                                        }}
                                    />
                                    <p 
                                        className="text-[14px] leading-relaxed pl-4"
                                        style={{ 
                                            color: '#4B5563',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {record.description}
                                    </p>
                                </div>
                            )}

                            {/* Bottom Row - Status & Action */}
                            <div className="flex items-center justify-between pt-4">
                                {/* Enhanced Status Badge with Gradient & Shadow */}
                                <div 
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold border"
                                    style={{
                                        background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                                        color: '#065F46',
                                        borderColor: '#6EE7B7',
                                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15), 0 0 0 3px rgba(16, 185, 129, 0.05)',
                                    }}
                                >
                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute inset-0 bg-green-500/30 rounded-full blur-sm" />
                                        <CheckCircle className="relative h-4 w-4" strokeWidth={2.5} />
                                    </div>
                                    {record.status}
                                </div>

                                {/* Enhanced Arrow Button with Gradient & Shadow */}
                                <button
                                    className="relative h-11 w-11 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group-hover:translate-x-1"
                                    style={{
                                        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
                                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    aria-label="View details"
                                >
                                    <ChevronRight className="h-5 w-5" strokeWidth={3} />
                                    {/* Shine effect on hover */}
                                    <div 
                                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)',
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default ServiceHistory;
