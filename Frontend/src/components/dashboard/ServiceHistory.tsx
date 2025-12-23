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
import { History, Plus, CheckCircle, ChevronRight, Loader2, Car as CarIcon, Check, Pencil, Trash2, Calendar, ArrowRight, Hash, Settings, X } from "lucide-react";
import { serviceHistoryService, carService, Car, ServiceHistory as ServiceHistoryType, ServiceHistoryCreate } from "@/services/api";
import { toast } from "sonner";

interface ServiceHistoryWithCar extends ServiceHistoryType {
    car?: Car;
}

interface ServiceHistoryProps {
    userId?: number;
}

const ServiceHistory = ({ userId }: ServiceHistoryProps = {}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role?.name?.toLowerCase() === 'admin' || user?.role?.name?.toLowerCase() === 'super' || user?.is_superuser;
    const isSuperAdmin = user?.role?.name?.toLowerCase() === 'super' || (user?.is_superuser && user?.role?.name?.toLowerCase() !== 'admin');

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
    }, [userId]); // Add userId dependency

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            // Fetch all cars (for dropdown) - filtered by userId if provided
            const carsResponse = await carService.getAll(userId);
            if (carsResponse.data) {
                setCars(carsResponse.data);
            }

            // Fetch service history (Admin sees all, User sees theirs) - filtered by userId if provided
            const historyResponse = await serviceHistoryService.getAll(undefined, userId);

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
            <CardHeader
                className="border-b pb-4 flex flex-row items-center justify-between relative overflow-hidden"
                style={{
                    background: 'linear-gradient(90deg, #a67ba9 0%, #c8a2c8 50%, #e6b8c0 100%)',
                }}
            >
                <CardTitle className="flex items-center gap-2 text-xl text-white drop-shadow-md">
                    <History className="h-5 w-5" />
                    Service History
                </CardTitle>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    {!userId && (
                        <DialogTrigger asChild>
                            <button
                                className="add-record-animated"
                                disabled={cars.length === 0}
                                onClick={openAddModal}
                            >
                                <ArrowRight className="arr-2" />
                                <span className="text">Add Record</span>
                                <span className="circle"></span>
                                <ArrowRight className="arr-1" />
                            </button>
                        </DialogTrigger>
                    )}
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
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !selectedCarId}
                                    className="add-record-submit"
                                >
                                    <span className="button-content">
                                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {editingId ? "Update Record" : "Add Record"}
                                    </span>
                                </button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-4 sm:p-8 space-y-4">
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
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr style={{
                                    background: 'linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)',
                                    borderBottom: '2px solid #e5e7eb'
                                }}>
                                    <th className="px-6 py-4 text-center font-bold text-gray-700 text-sm">
                                        Sl No
                                    </th>
                                    <th className="px-6 py-4 text-center font-bold text-gray-700 text-sm">
                                        Service Name
                                    </th>
                                    <th className="px-6 py-4 text-center font-bold text-gray-700 text-sm">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-center font-bold text-gray-700 text-sm">
                                        Vehicle Name
                                    </th>
                                    {isSuperAdmin && (
                                        <th className="px-6 py-4 text-center font-bold text-gray-700 text-sm">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {allHistory.map((record, index) => (
                                    <tr
                                        key={record.id}
                                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Sl No */}
                                        <td className="px-6 py-4 text-center text-gray-700 font-medium">
                                            {index + 1}
                                        </td>

                                        {/* Service Name - Clickable */}
                                        <td className="px-6 py-4 text-center">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors">
                                                        {record.service_name}
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0">
                                                    {/* Sticky Header with Badge */}
                                                    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <h2 className="text-[26px] font-semibold text-gray-900 mb-2">
                                                                    {record.service_name}
                                                                </h2>
                                                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 rounded-full">
                                                                    <span className="text-sm text-gray-700 font-medium">Service Type:</span>
                                                                    <span className="text-sm text-gray-900 font-semibold uppercase tracking-wide">Standard</span>
                                                                </div>
                                                            </div>
                                                            <DialogTrigger asChild>
                                                                <button
                                                                    className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                                    aria-label="Close"
                                                                >
                                                                    <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                                                                </button>
                                                            </DialogTrigger>
                                                        </div>
                                                    </div>

                                                    {/* Content Container */}
                                                    <div className="px-8 py-6 space-y-6">
                                                        {/* Vehicle Details Card */}
                                                        <div
                                                            className="bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                                                            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                                        >
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <CarIcon className="h-5 w-5 text-gray-700" />
                                                                <h3 className="text-lg font-semibold text-gray-900">Vehicle Details</h3>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                                                <div>
                                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Make & Model</p>
                                                                    <p className="text-base font-semibold text-gray-900">{record.car?.make} {record.car?.model}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Registration No</p>
                                                                    <p className="text-base font-semibold text-gray-900 uppercase">{record.car?.registration_number}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Year</p>
                                                                    <p className="text-base font-semibold text-gray-900">{record.car?.year}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">VIN Number</p>
                                                                    <p className="text-base font-semibold text-gray-900 font-mono tracking-wider">{record.car?.vin_number || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Service Date Card */}
                                                        <div
                                                            className="bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                                                            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                                        >
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Calendar className="h-5 w-5 text-gray-700" />
                                                                <h3 className="text-lg font-semibold text-gray-900">Service Date</h3>
                                                            </div>
                                                            <p className="text-gray-600 text-sm mb-1">Completed on</p>
                                                            <p className="text-lg font-semibold text-gray-900">
                                                                {new Date(record.service_date).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>

                                                        {/* Service Details Card */}
                                                        <div
                                                            className="bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                                                            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                                                        >
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Settings className="h-5 w-5 text-gray-700" />
                                                                <h3 className="text-lg font-semibold text-gray-900">Service Details</h3>
                                                            </div>
                                                            {record.description ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {record.description.split(',').map((service, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-full"
                                                                        >
                                                                            {service.trim()}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                                                                    {record.service_name}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Owner Info Card (Admin only) */}
                                                        {isAdmin && record.car?.user && (
                                                            <div
                                                                className="bg-blue-50 rounded-2xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                                                                style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)' }}
                                                            >
                                                                <h3 className="text-lg font-semibold text-blue-900 mb-2">Vehicle Owner</h3>
                                                                <p className="text-blue-700 font-medium">{record.car.user.full_name || record.car.user.email}</p>
                                                            </div>
                                                        )}

                                                        {/* Status Banner - Sticky at Bottom */}
                                                        <div className="sticky bottom-0 left-0 right-0 mt-6">
                                                            <div
                                                                className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 flex items-center justify-center gap-3"
                                                                style={{ boxShadow: '0 -2px 10px rgba(16, 185, 129, 0.1)' }}
                                                            >
                                                                <CheckCircle className="h-6 w-6 text-emerald-600" />
                                                                <span className="text-emerald-800 font-semibold text-lg">Service Completed Successfully</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4 text-center text-gray-700">
                                            {new Date(record.service_date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>

                                        {/* Vehicle Name */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="font-semibold text-gray-800">
                                                {record.car?.make} {record.car?.model}
                                            </div>
                                        </td>

                                        {/* Actions (Super Admin only) */}
                                        {isSuperAdmin && (
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(record)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(record.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ServiceHistory;
