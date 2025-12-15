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
import { useAuth } from "@/contexts/AuthContext";

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

interface MyCarsProps {
    userId?: number;
}

const MyCars = ({ userId }: MyCarsProps = {}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role?.name === 'admin' || user?.role?.name === 'super' || user?.is_superuser;

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
        vin_number: "",
        image_url: "",
    });

    const fetchCars = async () => {
        setIsLoading(true);
        // Pass userId if provided
        const response = await carService.getAll(userId);
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
        const response = await carService.create(formData, selectedImage || undefined);
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
            vin_number: car.vin_number || "",
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
        const response = await carService.update(editingCarId, formData, selectedImage || undefined);
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
            <CardHeader
                className="border-b pb-4 flex flex-row items-center justify-between relative overflow-hidden"
                style={{
                    background: `
                        radial-gradient(circle at 100% 0%, rgba(253, 253, 245, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 0% 0%, rgba(253, 253, 245, 0.3) 0%, transparent 50%),
                        linear-gradient(135deg, #7C2558 0%, #F96161 40%, #FA887E 70%, #FDFDF5 100%)
                    `,
                    boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.1)'
                }}
            >
                <CardTitle className="flex items-center gap-2 text-xl text-white drop-shadow-md">
                    <CarIcon className="h-5 w-5 text-white" />
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
                    {!userId && (
                        <DialogTrigger asChild>
                            <button className="add-car-animated">
                                <span className="button__text">Add Car</span>
                                <span className="button__icon">
                                    <Plus className="svg" />
                                </span>
                            </button>
                        </DialogTrigger>
                    )}
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
                                    <Label htmlFor="reg" className="text-right">Reg No.</Label>
                                    <Input
                                        id="reg"
                                        value={formData.registration_number}
                                        onChange={(e) => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })}
                                        className="col-span-3 uppercase"
                                        placeholder="e.g. XYZ 123"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="vin" className="text-right">VIN No.</Label>
                                    <Input
                                        id="vin"
                                        value={formData.vin_number || ""}
                                        onChange={(e) => setFormData({ ...formData, vin_number: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. 1HGBH41JXMN109186"
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
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="add-car-animated"
                                >
                                    <span className="button__text">
                                        {isSubmitting ? 'Adding...' : 'Add Car'}
                                    </span>
                                    <span className="button__icon">
                                        {isSubmitting ? (
                                            <Loader2 className="svg animate-spin" />
                                        ) : (
                                            <Plus className="svg" />
                                        )}
                                    </span>
                                </button>
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
                                    <Label htmlFor="edit-reg" className="text-right">Reg No.</Label>
                                    <Input
                                        id="edit-reg"
                                        value={formData.registration_number}
                                        onChange={(e) => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })}
                                        className="col-span-3 uppercase"
                                        placeholder="e.g. XYZ 123"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-vin" className="text-right">VIN No.</Label>
                                    <Input
                                        id="edit-vin"
                                        value={formData.vin_number || ""}
                                        onChange={(e) => setFormData({ ...formData, vin_number: e.target.value })}
                                        className="col-span-3"
                                        placeholder="e.g. 1HGBH41JXMN109186"
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
                                <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
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
                            className="bg-gradient-to-br from-gray-50 to-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 border border-gray-200 relative"
                        >
                            {/* Edit & Delete Buttons - Top Right Corner - Circular */}
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <button
                                    onClick={() => handleEditCar(car)}
                                    className="edit-btn-animated"
                                    title="Edit vehicle"
                                >
                                    Edit
                                    <Pencil className="svg" strokeWidth={2.5} />
                                </button>
                                <button
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="delete-btn-animated"
                                    title="Delete vehicle"
                                >
                                    Delete
                                    <Trash2 className="svg" strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Main Content Section - Image on Left, Info on Right */}
                            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-center">
                                {/* LEFT SIDE - Car Image in Soft Container */}
                                <div className="flex items-center justify-center">
                                    <div className="w-full h-[300px] bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_50px_rgba(0,0,0,0.15)] transition-all duration-500 p-4">
                                        {car.image_url ? (
                                            <div className="w-full h-full rounded-[16px] overflow-hidden flex items-center justify-center">
                                                <CarImageWithFallback
                                                    src={car.image_url}
                                                    alt={`${car.make} ${car.model}`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center bg-[#fafafa] rounded-[16px] border-2 border-dashed border-[#d3d3d3]">
                                                <CarIcon className="h-[60px] w-[60px] text-gray-400 opacity-60 mb-2" strokeWidth={1.5} />
                                                <p className="text-xs text-gray-500 font-semibold">No image added</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Please add your car image.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* RIGHT SIDE - Vehicle Info & Action Buttons */}
                                <div className="flex flex-col justify-center space-y-5 pr-24">
                                    {/* Vehicle Name and Manufacturing Year */}
                                    <div>
                                        <h3 className="font-bold text-4xl text-gray-900 tracking-tight mb-2">{car.make} {car.model}</h3>
                                        <p className="text-lg text-gray-500 font-medium">Manufacturing Year: {car.year}</p>
                                    </div>

                                    {/* Info Pills - Reg No. and VIN No. */}
                                    <div className="flex flex-col gap-3">
                                        {/* Registration Number Pill */}
                                        <div className="bg-white border-3 border-[#CD0000] rounded-full px-6 py-3 shadow-[0_4px_15px_rgba(205,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(205,0,0,0.25)] transition-all duration-300 inline-flex items-center gap-2 w-fit">
                                            <span className="text-base font-bold text-gray-700">Reg No:</span>
                                            <span className="text-base font-black text-gray-900 uppercase tracking-wider">{car.registration_number}</span>
                                        </div>

                                        {/* VIN Number Pill */}
                                        {car.vin_number && (
                                            <div className="bg-white border-3 border-[#7C2558] rounded-full px-6 py-3 shadow-[0_4px_15px_rgba(124,37,88,0.15)] hover:shadow-[0_6px_20px_rgba(124,37,88,0.25)] transition-all duration-300 inline-flex items-center gap-2 w-fit">
                                                <span className="text-base font-bold text-gray-700">VIN No:</span>
                                                <span className="text-base font-bold text-gray-900 tracking-wide">{car.vin_number}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Admin Owner Badge */}
                                    {isAdmin && car.user && (
                                        <div className="flex items-center gap-2 p-2 px-3 bg-blue-50 rounded-full border border-blue-200 inline-block w-fit shadow-sm">
                                            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Owner</span>
                                            <span className="text-sm text-blue-800 font-medium">{car.user.full_name || car.user.email}</span>
                                        </div>
                                    )}

                                    {/* Action Buttons - Horizontal Row with Equal Width */}
                                    <div className="grid grid-cols-3 gap-3 pt-2">
                                        <button
                                            className="group flex items-center justify-center gap-2 h-14 bg-white border-2 font-bold rounded-[14px] shadow-[0_4px_15px_rgba(95,75,139,0.12)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_25px_rgba(95,75,139,0.3)]"
                                            style={{
                                                borderColor: '#5F4B8B',
                                                color: '#5F4B8B',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#5F4B8B';
                                                e.currentTarget.style.borderColor = '#5F4B8B';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'white';
                                                e.currentTarget.style.borderColor = '#5F4B8B';
                                                e.currentTarget.style.color = '#5F4B8B';
                                            }}
                                            onClick={() => navigate('/profile', { state: { view: 'schedule-pickup' } })}
                                        >
                                            <Calendar className="h-5 w-5" strokeWidth={2.5} />
                                            <span className="text-sm font-bold">Schedule Pick Up</span>
                                        </button>
                                        <button
                                            className="group flex items-center justify-center gap-2 h-14 bg-white border-2 font-bold rounded-[14px] shadow-[0_4px_15px_rgba(188,38,73,0.12)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_25px_rgba(188,38,73,0.3)]"
                                            style={{
                                                borderColor: '#BC2649',
                                                color: '#BC2649',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#BC2649';
                                                e.currentTarget.style.borderColor = '#BC2649';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'white';
                                                e.currentTarget.style.borderColor = '#BC2649';
                                                e.currentTarget.style.color = '#BC2649';
                                            }}
                                            onClick={() => navigate('/services')}
                                        >
                                            <Wrench className="h-5 w-5" strokeWidth={2.5} />
                                            <span className="text-sm font-bold">Book Service</span>
                                        </button>
                                        <button
                                            className="group flex items-center justify-center gap-2 h-14 bg-white border-2 font-bold rounded-[14px] shadow-[0_4px_15px_rgba(255,123,4,0.12)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_25px_rgba(255,123,4,0.3)]"
                                            style={{
                                                borderColor: '#FF7B04',
                                                color: '#FF7B04',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#FF7B04';
                                                e.currentTarget.style.borderColor = '#FF7B04';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'white';
                                                e.currentTarget.style.borderColor = '#FF7B04';
                                                e.currentTarget.style.color = '#FF7B04';
                                            }}
                                            onClick={() => navigate(`/vehicle/${car.id}`)}
                                        >
                                            <FileText className="h-5 w-5" strokeWidth={2.5} />
                                            <span className="text-sm font-bold">Vehicle Details</span>
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
