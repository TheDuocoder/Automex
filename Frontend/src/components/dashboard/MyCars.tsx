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
import { Car as CarIcon, Plus, Trash2, Loader2, Upload, X, Pencil, Calendar, Wrench, FileText } from "lucide-react";
import { carService, Car, CarCreate } from "@/services/api";
import { toast } from "sonner";

// Component to handle image loading with fallback
const CarImageWithFallback = ({ src, alt }: { src: string; alt: string }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8F8F8] rounded-2xl border-2 border-dashed border-gray-300">
                <CarIcon className="h-16 w-16 text-gray-400 mb-3" />
                <p className="text-sm text-gray-500 font-medium">No image added</p>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-2xl"
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
                        <div 
                            key={car.id} 
                            className="bg-white rounded-[22px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.1)] transition-all duration-300 border border-gray-100"
                        >
                            {/* Top Header Section - Car Name & Action Buttons */}
                            <div className="flex items-start justify-between mb-6">
                                {/* Car Name and Year - Left */}
                                <div>
                                    <h3 className="font-bold text-2xl text-gray-900 tracking-tight">{car.make} {car.model}</h3>
                                    <p className="text-base text-gray-500 font-medium mt-1">{car.year}</p>
                                </div>
                                
                                {/* Edit & Delete Buttons - Right */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleEditCar(car)}
                                        className="p-3 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-[14px] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                                        title="Edit vehicle"
                                    >
                                        <Pencil className="h-4 w-4" strokeWidth={2.5} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCar(car.id)}
                                        className="p-3 bg-[#CD0000] hover:bg-[#A30000] text-white rounded-[14px] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                                        title="Delete vehicle"
                                    >
                                        <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>

                            {/* Main Content Section - Image & Details */}
                            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10">
                                {/* LEFT SIDE - Car Image */}
                                <div className="flex items-start justify-center">
                                    <div className="w-[380px] h-[280px] shadow-[0_12px_48px_rgba(0,0,0,0.15)] hover:shadow-[0_16px_56px_rgba(0,0,0,0.2)] transition-all duration-500 rounded-[20px]">
                                        {car.image_url ? (
                                            <div className="w-full h-full rounded-[20px] overflow-hidden">
                                                <CarImageWithFallback 
                                                    src={car.image_url}
                                                    alt={`${car.make} ${car.model}`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#fafafa] rounded-[20px] border-2 border-dashed border-[#d3d3d3] p-6">
                                                <CarIcon className="h-[90px] w-[90px] text-gray-400 opacity-60 mb-4" strokeWidth={1.5} />
                                                <p className="text-sm text-gray-500 font-semibold">No image added</p>
                                                <p className="text-xs text-gray-400 mt-1">Please add your car image.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT SIDE - Number Plate & Buttons */}
                                <div className="flex flex-col justify-start">
                                    {/* Number Plate Badge - Aligned with image top */}
                                    <div className="flex justify-center mb-10">
                                        <div className="bg-white border-2 border-[#CD0000] rounded-[10px] px-6 py-3 shadow-[0_4px_12px_rgba(205,0,0,0.12)]">
                                            <p className="text-lg font-black text-gray-900 uppercase tracking-widest">{car.registration_number}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons - Stacked Vertically */}
                                    <div className="flex flex-col gap-4">
                                        <button
                                            className="group flex items-center justify-center gap-3 h-14 bg-transparent border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 font-bold rounded-[16px] shadow-sm hover:shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-[1.02] w-full"
                                            onClick={() => navigate('/profile', { state: { view: 'schedule-pickup' } })}
                                        >
                                            <Calendar className="h-5 w-5" strokeWidth={2.5} />
                                            <span className="text-base">Schedule Pick Up</span>
                                        </button>
                                        <button
                                            className="group flex items-center justify-center gap-3 h-14 bg-transparent border-2 border-[#F4C542] text-[#F4C542] hover:bg-[#F4C542] hover:text-white hover:border-[#F4C542] font-bold rounded-[16px] shadow-sm hover:shadow-[0_6px_20px_rgba(244,197,66,0.3)] transition-all duration-300 hover:scale-[1.02] w-full"
                                            onClick={() => navigate('/services')}
                                        >
                                            <Wrench className="h-5 w-5" strokeWidth={2.5} />
                                            <span className="text-base">Book Service</span>
                                        </button>
                                        <button
                                            className="group flex items-center justify-center gap-3 h-14 bg-transparent border-2 border-[#FF4F93] text-[#FF4F93] hover:bg-[#FF4F93] hover:text-white hover:border-[#FF4F93] font-bold rounded-[16px] shadow-sm hover:shadow-[0_6px_20px_rgba(255,79,147,0.3)] transition-all duration-300 hover:scale-[1.02] w-full"
                                            onClick={() => navigate(`/vehicle/${car.id}`)}
                                        >
                                            <FileText className="h-5 w-5" strokeWidth={2.5} />
                                            <span className="text-base">Vehicle Details</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default MyCars;
