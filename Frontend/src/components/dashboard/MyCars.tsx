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
import { Car as CarIcon, Plus, Trash2, Loader2, Upload, X, Pencil } from "lucide-react";
import { carService, Car, CarCreate } from "@/services/api";
import { toast } from "sonner";

// Component to handle image loading with fallback
const CarImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return (
            <div className="w-full h-48 flex flex-col items-center justify-center text-gray-400">
                <CarIcon className="h-12 w-12 mb-2" />
                <p className="text-sm">No image available</p>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
        />
    );
};

const MyCars = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCarId, setEditingCarId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setSelectedImage(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImagePreview(base64String);
                setFormData({ ...formData, image_url: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setFormData({ ...formData, image_url: "" });
    };

    const handleAddCar = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const response = await carService.create(formData);
        if (response.data) {
            toast.success("Car added successfully");
            setIsAddOpen(false);
            resetForm();
            fetchCars();
        } else {
            toast.error(response.error || "Failed to add car");
        }
        setIsSubmitting(false);
    };

    const handleEditCar = (car: Car) => {
        setEditingCarId(car.id);
        setFormData({
            make: car.make,
            model: car.model,
            year: car.year,
            registration_number: car.registration_number,
            image_url: car.image_url || "",
        });
        setImagePreview(car.image_url || null);
        setSelectedImage(null);
        setIsEditOpen(true);
    };

    const handleUpdateCar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCarId) return;
        
        setIsSubmitting(true);
        const response = await carService.update(editingCarId, formData);
        if (response.data) {
            toast.success("Car updated successfully");
            setIsEditOpen(false);
            setEditingCarId(null);
            resetForm();
            fetchCars();
        } else {
            toast.error(response.error || "Failed to update car");
        }
        setIsSubmitting(false);
    };

    const resetForm = () => {
        setFormData({
            make: "",
            model: "",
            year: new Date().getFullYear(),
            registration_number: "",
            image_url: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
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
                <Dialog 
                    open={isAddOpen} 
                    onOpenChange={(open) => {
                        setIsAddOpen(open);
                        if (!open) {
                            resetForm();
                        }
                    }}
                >
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
                                    <Label htmlFor="make" className="text-right">Manufacture</Label>
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
                                    <Label htmlFor="reg" className="text-right">Vehicle No.</Label>
                                    <Input
                                        id="reg"
                                        value={formData.registration_number}
                                        onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. XYZ 123"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label htmlFor="image" className="text-right pt-2">Car Image</Label>
                                    <div className="col-span-3 space-y-2">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                                <input
                                                    type="file"
                                                    id="image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="image"
                                                    className="cursor-pointer flex flex-col items-center gap-2"
                                                >
                                                    <Upload className="h-8 w-8 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        Click to upload or drag and drop
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        PNG, JPG, GIF up to 5MB (Optional)
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
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
                <Dialog 
                    open={isEditOpen} 
                    onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (!open) {
                            setEditingCarId(null);
                            resetForm();
                        }
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Vehicle</DialogTitle>
                            <DialogDescription>
                                Update your vehicle details below.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateCar}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-make" className="text-right">Manufacture</Label>
                                    <Input
                                        id="edit-make"
                                        value={formData.make}
                                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Toyota"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-model" className="text-right">Model</Label>
                                    <Input
                                        id="edit-model"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. Camry"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-year" className="text-right">Year</Label>
                                    <Input
                                        id="edit-year"
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-reg" className="text-right">Vehicle No.</Label>
                                    <Input
                                        id="edit-reg"
                                        value={formData.registration_number}
                                        onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. XYZ 123"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-start gap-4">
                                    <Label htmlFor="edit-image" className="text-right pt-2">Car Image</Label>
                                    <div className="col-span-3 space-y-2">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                                                <input
                                                    type="file"
                                                    id="edit-image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="edit-image"
                                                    className="cursor-pointer flex flex-col items-center gap-2"
                                                >
                                                    <Upload className="h-8 w-8 text-gray-400" />
                                                    <span className="text-sm text-gray-600">
                                                        Click to upload or drag and drop
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        PNG, JPG, GIF up to 5MB (Optional)
                                                    </span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Vehicle
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
                        <div key={car.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all relative">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900">{car.make} {car.model}</h3>
                                    <p className="text-sm text-gray-500">{car.year}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 px-3 py-1 rounded-full">
                                        <p className="text-sm font-medium text-primary">{car.registration_number}</p>
                                    </div>
                                    <button
                                        onClick={() => handleEditCar(car)}
                                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md"
                                        title="Edit vehicle"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCar(car.id)}
                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
                                        title="Delete vehicle"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                                {car.image_url ? (
                                    <CarImageWithFallback 
                                        src={car.image_url}
                                        alt={`${car.make} ${car.model}`}
                                    />
                                ) : (
                                    <div className="w-full h-48 flex flex-col items-center justify-center text-gray-400">
                                        <CarIcon className="h-12 w-12 mb-2" />
                                        <p className="text-sm">No image added</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-green-500 hover:from-blue-600 hover:via-yellow-600 hover:to-green-600 text-white font-semibold shadow-md"
                                    onClick={() => navigate('/profile', { state: { view: 'schedule-pickup' } })}
                                >
                                    Schedule Pick Up
                                </Button>
                                <Button
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    onClick={() => navigate('/profile', { state: { view: 'schedule-pickup' } })}
                                >
                                    Book Service
                                </Button>
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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
