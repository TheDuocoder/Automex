import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { History, Plus, CheckCircle, ChevronRight, Loader2, Car as CarIcon } from "lucide-react";
import { serviceHistoryService, carService, Car, ServiceHistory as ServiceHistoryType, ServiceHistoryCreate } from "@/services/api";
import { toast } from "sonner";

interface ServiceHistoryWithCar extends ServiceHistoryType {
    car?: Car;
}

const ServiceHistory = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState<Car[]>([]);
    const [selectedCarId, setSelectedCarId] = useState<string>("");
    const [allHistory, setAllHistory] = useState<ServiceHistoryWithCar[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            // Fetch all cars
            const carsResponse = await carService.getAll();
            if (carsResponse.data) {
                setCars(carsResponse.data);

                if (carsResponse.data.length > 0) {
                    // Fetch service history for all cars
                    const historyPromises = carsResponse.data.map(async (car) => {
                        const historyResponse = await serviceHistoryService.getAll(car.id);
                        if (historyResponse.data) {
                            return historyResponse.data.map(record => ({
                                ...record,
                                car: car
                            }));
                        }
                        return [];
                    });

                    const allHistoryArrays = await Promise.all(historyPromises);
                    const combinedHistory = allHistoryArrays.flat();

                    // Sort by date (most recent first)
                    combinedHistory.sort((a, b) =>
                        new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
                    );

                    setAllHistory(combinedHistory);
                } else {
                    // No cars, clear history
                    setAllHistory([]);
                }
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

        const response = await serviceHistoryService.create(dataToSend);
        if (response.data) {
            toast.success("Service record added successfully");
            setIsAddOpen(false);
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
            toast.error(response.error || "Failed to add service record");
        }
        setIsSubmitting(false);
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
                        <Button size="sm" className="gap-1" disabled={cars.length === 0}>
                            <Plus className="h-4 w-4" /> Add Record
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Service Record</DialogTitle>
                            <DialogDescription>
                                Record a past service for your vehicle.
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
                                <Button type="submit" disabled={isSubmitting || !selectedCarId}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Record
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
                        <div key={record.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{record.service_name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                        <CarIcon className="h-3.5 w-3.5" />
                                        <span>{record.car?.make} {record.car?.model} - {record.car?.registration_number}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{new Date(record.service_date).toLocaleDateString()}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                            {record.description && (
                                <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">{record.description}</p>
                            )}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <span className="text-xs font-medium text-green-600">{record.status}</span>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default ServiceHistory;
