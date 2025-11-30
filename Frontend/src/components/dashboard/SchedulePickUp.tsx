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
} from "@/components/ui/dialog";
import { Calendar, MapPin, Clock, Loader2, MessageSquare, Navigation, Car as CarIcon, Car, XCircle } from "lucide-react";
import { pickupRequestService, carService, Car as CarType, PickUpRequest, PickUpRequestCreate, PickUpRequestUpdate } from "@/services/api";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

const SchedulePickUp = () => {
    const navigate = useNavigate();
    const { role, user } = useAuthStore();
    const [cars, setCars] = useState<CarType[]>([]);
    const [requests, setRequests] = useState<PickUpRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<PickUpRequest | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateData, setUpdateData] = useState<PickUpRequestUpdate>({
        status: "",
        admin_comment: "",
        address: "",
        scheduled_date: "",
        car_id: 0,
        location: "",
        latitude: undefined,
        longitude: undefined,
    });
    const [formData, setFormData] = useState<PickUpRequestCreate>({
        car_id: 0,
        location: "",
        address: "",
        latitude: undefined,
        longitude: undefined,
        scheduled_date: "",
    });

    // Check if user is admin or super admin
    const isAdmin = role?.name === "admin" || role?.name === "super";
    const isCreator = selectedRequest?.user_id === user?.id;

    const fetchData = async () => {
        setIsLoading(true);
        const [carsRes, requestsRes] = await Promise.all([
            carService.getAll(),
            pickupRequestService.getAll(),
        ]);

        if (carsRes.data) setCars(carsRes.data);
        if (requestsRes.data) setRequests(requestsRes.data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Use reverse geocoding to get address
                try {
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
                    );
                    const data = await response.json();

                    if (data.results && data.results[0]) {
                        setFormData({
                            ...formData,
                            location: data.results[0].formatted_address,
                            latitude,
                            longitude,
                        });
                        toast.success("Location detected successfully");
                    } else {
                        // Fallback: just set coordinates
                        setFormData({
                            ...formData,
                            location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
                            latitude,
                            longitude,
                        });
                        toast.success("Location coordinates captured");
                    }
                } catch (error) {
                    // Fallback: just set coordinates without address
                    setFormData({
                        ...formData,
                        location: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`,
                        latitude,
                        longitude,
                    });
                    toast.success("Location coordinates captured");
                }
                setIsGettingLocation(false);
            },
            (error) => {
                setIsGettingLocation(false);
                toast.error("Unable to get your location. Please enter manually.");
                console.error("Geolocation error:", error);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.car_id) {
            toast.error("Please select a car");
            return;
        }

        if (!formData.address.trim()) {
            toast.error("Please enter your address");
            return;
        }

        setIsSubmitting(true);
        // Ensure date is in ISO format for backend
        const dateObj = new Date(formData.scheduled_date);
        const isoDate = dateObj.toISOString();

        const response = await pickupRequestService.create({
            ...formData,
            scheduled_date: isoDate,
        });

        if (response.data) {
            toast.success("Pick up scheduled successfully");
            setFormData({
                car_id: 0,
                location: "",
                address: "",
                latitude: undefined,
                longitude: undefined,
                scheduled_date: "",
            });
            fetchData();
        } else {
            toast.error(response.error || "Failed to schedule pick up");
        }
        setIsSubmitting(false);
    };

    const getCarName = (carId: number) => {
        const car = cars.find(c => c.id === carId);
        return car ? `${car.make} ${car.model}` : "Unknown Car";
    };

    const openInGoogleMaps = (lat: number, lng: number) => {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    };

    const handleCardClick = async (requestId: number) => {
        setIsDetailsOpen(true);
        setIsLoading(true);
        const response = await pickupRequestService.getById(requestId);
        if (response.data) {
            setSelectedRequest(response.data);
            setUpdateData({
                status: response.data.status,
                admin_comment: response.data.admin_comment || "",
                address: response.data.address,
                scheduled_date: response.data.scheduled_date,
                car_id: response.data.car_id,
                location: response.data.location,
                latitude: response.data.latitude,
                longitude: response.data.longitude,
            });
        } else {
            toast.error(response.error || "Failed to load pickup request details");
        }
        setIsLoading(false);
    };

    const handleUpdateRequest = async () => {
        if (!selectedRequest) return;

        setIsUpdating(true);

        // Prepare data to send
        const dataToSend = { ...updateData };

        // Ensure date is in ISO format if it was changed by creator
        if (dataToSend.scheduled_date && isCreator) {
            try {
                const dateObj = new Date(dataToSend.scheduled_date);
                if (!isNaN(dateObj.getTime())) {
                    dataToSend.scheduled_date = dateObj.toISOString();
                }
            } catch (e) {
                console.error("Date parsing error", e);
            }
        }

        const response = await pickupRequestService.update(selectedRequest.id, dataToSend);

        if (response.data) {
            toast.success("Pickup request updated successfully");
            setIsDetailsOpen(false);
            setSelectedRequest(null);
            fetchData(); // Refresh the list
        } else {
            toast.error(response.error || "Failed to update pickup request");
        }
        setIsUpdating(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Pick Up Details & Status */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-none rounded-[20px] h-full">
                    <CardHeader className="border-b bg-gray-50/50 pb-5 px-7 pt-6">
                        <CardTitle className="flex items-center gap-2.5 text-xl font-bold">
                            <Clock className="h-5 w-5 text-primary" />
                            Pick Up Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-7 space-y-5">
                        {isLoading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="text-center py-6">
                                <Car className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-sm font-semibold text-gray-700 mb-2">No Vehicles Added</p>
                                <p className="text-xs text-gray-500 mb-4">
                                    Please add your vehicles in the <span className="font-semibold text-primary">My Cars</span> section to schedule a pickup.
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => navigate('/profile', { state: { view: 'my-cars' } })}
                                    className="gap-1 text-xs"
                                >
                                    <Car className="h-3 w-3" />
                                    Go to My Cars
                                </Button>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                                No active pick up requests.
                            </div>
                        ) : (
                            requests.map((req) => (
                                <div
                                    key={req.id}
                                    className="bg-white border border-gray-100 rounded-[18px] p-6 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200"
                                    onClick={() => handleCardClick(req.id)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${req.status?.toLowerCase() === 'pending' ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200' :
                                                req.status?.toLowerCase() === 'approved' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
                                                    req.status?.toLowerCase() === 'completed' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
                                                        req.status?.toLowerCase() === 'cancelled' ? 'bg-[#FDE8E8] text-[#D93737] ring-1 ring-red-200' :
                                                            'bg-gray-50 text-gray-700 ring-1 ring-gray-200'
                                            }`}>
                                            {req.status?.toLowerCase() === 'cancelled' && <XCircle className="h-3.5 w-3.5" />}
                                            {req.status || 'Pending'}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {new Date(req.scheduled_date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">{getCarName(req.car_id)}</h4>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        {req.address && (
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                                <span className="flex-1 leading-relaxed line-clamp-2">{req.address}</span>
                                            </div>
                                        )}
                                        {req.latitude && req.longitude && (
                                            <div className="flex items-start gap-2">
                                                <Navigation className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#0056FF]" />
                                                <button
                                                    className="text-xs text-[#0056FF] hover:underline font-medium transition-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openInGoogleMaps(req.latitude!, req.longitude!);
                                                    }}
                                                >
                                                    View on Google Maps
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {req.admin_comment && (
                                        <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-200 mt-4">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <MessageSquare className="h-3.5 w-3.5 text-primary" />
                                                <span className="text-xs font-semibold text-gray-700">Admin Comment</span>
                                            </div>
                                            <p className="text-xs text-gray-600 italic leading-relaxed">"{req.admin_comment}"</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Right Side: Schedule Form */}
            <div className="lg:col-span-2">
                <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.06)] border-none rounded-[22px]">
                    <CardHeader className="border-b bg-gray-50/50 pb-5 px-8 pt-7">
                        <CardTitle className="flex items-center gap-2.5 text-xl font-bold">
                            <Calendar className="h-5 w-5 text-primary" />
                            Schedule Your Pickup
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {cars.length === 0 ? (
                            <div className="text-center py-12">
                                <Car className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                <p className="text-lg font-semibold text-gray-700 mb-2">No Vehicles Added</p>
                                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                                    Please add your vehicles in the <span className="font-semibold text-primary">My Cars</span> section to schedule a pickup and avail our services.
                                </p>
                                <Button
                                    onClick={() => navigate('/profile', { state: { view: 'my-cars' } })}
                                    className="gap-2"
                                >
                                    <Car className="h-4 w-4" />
                                    Go to My Cars
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-7">
                                <div className="grid gap-7">
                                    {/* Select Vehicle */}
                                    <div className="space-y-3">
                                        <Label htmlFor="car" className="text-sm font-semibold text-gray-700">Select Vehicle</Label>
                                        <Select
                                            value={formData.car_id.toString()}
                                            onValueChange={(val) => setFormData({ ...formData, car_id: parseInt(val) })}
                                        >
                                            <SelectTrigger className="h-12 bg-[#F8F8F8] border-gray-300 rounded-[14px] px-4 text-sm font-medium hover:border-gray-400 transition-colors">
                                                <SelectValue placeholder="Select a car" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cars.map((car) => (
                                                    <SelectItem key={car.id} value={car.id.toString()}>
                                                        {car.make} {car.model} ({car.registration_number})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Pick Up Location (Google) */}
                                    <div className="space-y-3">
                                        <Label htmlFor="location" className="text-sm font-semibold text-gray-700">
                                            Pick Up Location <span className="text-gray-400 font-normal">(Optional)</span>
                                        </Label>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                                                <Input
                                                    id="location"
                                                    className="h-12 pl-12 pr-4 bg-[#F8F8F8] border-gray-300 rounded-[14px] text-sm placeholder:text-gray-400 hover:border-gray-400 focus:bg-white transition-all"
                                                    placeholder="Google Maps Location"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleGetCurrentLocation}
                                                disabled={isGettingLocation}
                                                className="h-12 w-12 flex-shrink-0 rounded-[14px] border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all"
                                            >
                                                {isGettingLocation ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <Navigation className="h-5 w-5 text-gray-600" />
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-gray-500 ml-1">
                                            Click the location icon to use your current location
                                        </p>
                                        {formData.latitude && formData.longitude && (
                                            <p className="text-xs text-green-600 flex items-center gap-1.5 ml-1 font-medium">
                                                <MapPin className="h-3.5 w-3.5" />
                                                Location coordinates captured
                                            </p>
                                        )}
                                    </div>

                                    {/* Manual Address */}
                                    <div className="space-y-3">
                                        <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                                            Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="address"
                                            className="min-h-[100px] bg-[#F8F8F8] border-gray-300 rounded-[14px] text-sm placeholder:text-gray-400 hover:border-gray-400 focus:bg-white transition-all p-4"
                                            placeholder="Enter your full address manually..."
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* Preferred Date & Time */}
                                    <div className="space-y-3">
                                        <Label htmlFor="datetime" className="text-sm font-semibold text-gray-700">Preferred Date & Time</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" strokeWidth={1.5} />
                                            <Input
                                                id="datetime"
                                                type="datetime-local"
                                                className="h-12 pl-12 pr-4 bg-[#F8F8F8] border-gray-300 rounded-[14px] text-sm hover:border-gray-400 focus:bg-white transition-all"
                                                value={formData.scheduled_date}
                                                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                                                min={new Date().toISOString().slice(0, 16)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-[#CD0000] hover:bg-[#A30000] text-white font-bold text-base rounded-[14px] shadow-sm hover:shadow-md transition-all duration-200"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                        Schedule Pick Up
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Pickup Request Details</DialogTitle>
                        <DialogDescription>
                            View and manage pickup request information
                        </DialogDescription>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : selectedRequest ? (
                        <div className="space-y-4">
                            {/* Request Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-500 text-xs">Status</Label>
                                    <div className="mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedRequest.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                                                selectedRequest.status?.toLowerCase() === 'approved' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                                                    selectedRequest.status?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-700 border border-green-300' :
                                                        selectedRequest.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-300' :
                                                            'bg-gray-100 text-gray-700 border border-gray-300'
                                            }`}>
                                            {selectedRequest.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-gray-500 text-xs">Scheduled Date</Label>
                                    {isCreator ? (
                                        <Input
                                            type="datetime-local"
                                            className="mt-1 h-9 text-sm"
                                            value={updateData.scheduled_date ? new Date(updateData.scheduled_date).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => setUpdateData({ ...updateData, scheduled_date: e.target.value })}
                                            min={new Date().toISOString().slice(0, 16)}
                                        />
                                    ) : (
                                        <p className="text-sm font-medium mt-1">
                                            {new Date(selectedRequest.scheduled_date).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-gray-500 text-xs flex items-center gap-1">
                                    <CarIcon className="h-3 w-3" />
                                    Vehicle
                                </Label>
                                {isCreator ? (
                                    <Select
                                        value={updateData.car_id?.toString()}
                                        onValueChange={(val) => setUpdateData({ ...updateData, car_id: parseInt(val) })}
                                    >
                                        <SelectTrigger className="mt-1 h-9 text-sm">
                                            <SelectValue placeholder="Select a car" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cars.map((car) => (
                                                <SelectItem key={car.id} value={car.id.toString()}>
                                                    {car.make} {car.model} ({car.registration_number})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-sm font-medium mt-1">{getCarName(selectedRequest.car_id)}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-gray-500 text-xs flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    Address
                                </Label>
                                {isCreator ? (
                                    <Textarea
                                        className="mt-1 text-sm min-h-[80px]"
                                        value={updateData.address || ''}
                                        onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
                                        placeholder="Enter address"
                                    />
                                ) : (
                                    <p className="text-sm mt-1 font-medium">{selectedRequest.address}</p>
                                )}

                                {selectedRequest.location && (
                                    <p className="text-xs text-gray-500 mt-1">Google Location: {selectedRequest.location}</p>
                                )}
                                {selectedRequest.latitude && selectedRequest.longitude && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0 text-xs text-blue-600 mt-1"
                                        onClick={() => openInGoogleMaps(selectedRequest.latitude!, selectedRequest.longitude!)}
                                    >
                                        <Navigation className="h-3 w-3 mr-1" />
                                        View on Google Maps
                                    </Button>
                                )}
                            </div>

                            {/* Admin Controls */}
                            {isAdmin && (
                                <div className="border-t pt-4 space-y-4">
                                    <div>
                                        <Label htmlFor="status" className="text-sm font-medium">
                                            Update Status
                                        </Label>
                                        <Select
                                            value={updateData.status}
                                            onValueChange={(value) => setUpdateData({ ...updateData, status: value })}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Approved">Approved</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="comment" className="text-sm font-medium">
                                            Admin Comment
                                        </Label>
                                        <Textarea
                                            id="comment"
                                            className="mt-2"
                                            placeholder="Add a comment or note..."
                                            value={updateData.admin_comment || ''}
                                            onChange={(e) => setUpdateData({ ...updateData, admin_comment: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Existing Admin Comment (read-only for non-admins) */}
                            {selectedRequest.admin_comment && !isAdmin && (
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MessageSquare className="h-4 w-4 text-primary" />
                                        <span className="text-xs font-semibold text-gray-700">Admin Comment</span>
                                    </div>
                                    <p className="text-sm text-gray-600 italic">"{selectedRequest.admin_comment}"</p>
                                </div>
                            )}
                        </div>
                    ) : null}

                    <DialogFooter>
                        {(isAdmin || isCreator) && (
                            <Button
                                onClick={handleUpdateRequest}
                                disabled={isUpdating}
                            >
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Request
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SchedulePickUp;
