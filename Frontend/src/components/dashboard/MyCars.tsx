import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Car as CarIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { carService, Car, CarCreate } from "@/services/api";
import { toast } from "sonner";

const MyCars = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<CarCreate>({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        registration_number: "",
        image_url: "",
    });

    const fetchCars = async () => {
        setIsLoading(true);
        const response = await carService.getAll();
        if (response.data) {
            setCars(response.data);
        } else {
            toast.error("Failed to fetch cars");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleAddCar = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const response = await carService.create(formData);
        if (response.data) {
            toast.success("Car added successfully");
            setIsAddOpen(false);
            setFormData({
                make: "",
                model: "",
                year: new Date().getFullYear(),
                registration_number: "",
                image_url: "",
            });
            fetchCars();
        } else {
            toast.error(response.error || "Failed to add car");
        }
        setIsSubmitting(false);
    };

    const handleDeleteCar = async (id: number) => {
        if (confirm("Are you sure you want to delete this car?")) {
            const response = await carService.delete(id);
            if (response.status === 204) {
                toast.success("Car deleted successfully");
                fetchCars();
            } else {
                toast.error(response.error || "Failed to delete car");
            }
        }
    };

    return (
        <Card className="shadow-lg border-none">
            <CardHeader className="border-b bg-gray-50/50 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <CarIcon className="h-5 w-5 text-primary" />
                    My Vehicles
                </CardTitle>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-1">
                            <Plus className="h-4 w-4" /> Add Car
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Vehicle</DialogTitle>
                            <DialogDescription>
                                Enter your vehicle details below.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddCar}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="make" className="text-right">Make</Label>
                                    <Input
                                        id="make"
                                        value={formData.make}
                                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Toyota"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="model" className="text-right">Model</Label>
                                    <Input
                                        id="model"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Camry"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="year" className="text-right">Year</Label>
                                    <Input
                                        id="year"
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="reg" className="text-right">Reg. Number</Label>
                                    <Input
                                        id="reg"
                                        value={formData.registration_number}
                                        onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. XYZ 123"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="image" className="text-right">Image URL</Label>
                                    <Input
                                        id="image"
                                        value={formData.image_url || ""}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="col-span-3"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Vehicle
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                        No vehicles added yet. Click "Add Car" to get started.
                    </div>
                ) : (
                    cars.map((car) => (
                        <div key={car.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all relative group">
                            <button
                                onClick={() => handleDeleteCar(car.id)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900">{car.make} {car.model}</h3>
                                    <p className="text-sm text-gray-500">{car.year}</p>
                                </div>
                                <div className="bg-primary/10 px-3 py-1 rounded-full">
                                    <p className="text-sm font-medium text-primary">{car.registration_number}</p>
                                </div>
                            </div>

                            <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                                <img
                                    src={car.image_url || "/images/Car_images/default-car.jpg"}
                                    alt={`${car.make} ${car.model}`}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "/images/Car_images/default-car.jpg";
                                    }}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={() => navigate('/profile', { state: { view: 'schedule-pickup' } })}
                                >
                                    Book Service
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => navigate(`/vehicle/${car.id}`)}
                                >
                                    Vehicle Details
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default MyCars;
