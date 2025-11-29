import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { carService, serviceHistoryService, Car, ServiceHistory } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Car as CarIcon, Calendar, Hash, History, Loader2 } from "lucide-react";
import { toast } from "sonner";

const VehicleDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [car, setCar] = useState<Car | null>(null);
    const [history, setHistory] = useState<ServiceHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const carId = parseInt(id);
                const [carRes, historyRes] = await Promise.all([
                    carService.get(carId),
                    serviceHistoryService.getAll(carId)
                ]);

                if (carRes.data) {
                    setCar(carRes.data);
                } else {
                    toast.error("Failed to load vehicle details");
                    navigate('/profile'); // Redirect back on error
                }

                if (historyRes.data) {
                    setHistory(historyRes.data);
                }
            } catch (error) {
                console.error("Error fetching vehicle details:", error);
                toast.error("An error occurred while loading details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <p className="text-gray-500">Vehicle not found</p>
                <Button onClick={() => navigate('/profile')}>Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">Vehicle Details</h1>
                </div>

                {/* Vehicle Info Card */}
                <Card className="shadow-lg border-none overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/3 bg-gray-100 h-64 md:h-auto relative">
                            <img
                                src={car.image_url || "/images/Car_images/default-car.jpg"}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/Car_images/default-car.jpg";
                                }}
                            />
                        </div>
                        <div className="md:w-2/3 p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{car.make} {car.model}</h2>
                                    <p className="text-lg text-gray-500">{car.year}</p>
                                </div>
                                <div className="bg-primary/10 px-4 py-2 rounded-full">
                                    <p className="font-mono font-bold text-primary">{car.registration_number}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <CarIcon className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Make</p>
                                        <p className="font-medium">{car.make}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Hash className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Model</p>
                                        <p className="font-medium">{car.model}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Year</p>
                                        <p className="font-medium">{car.year}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <Hash className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-xs text-gray-500">Reg. Number</p>
                                        <p className="font-medium">{car.registration_number}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/profile', { state: { view: 'schedule-pickup' } })}>
                                    Book Service
                                </Button>
                                {/* Add more actions if needed */}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Service History Section */}
                <Card className="shadow-lg border-none">
                    <CardHeader className="border-b bg-gray-50/50 pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <History className="h-5 w-5 text-primary" />
                            Service History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        {history.length > 0 ? (
                            <div className="space-y-6">
                                {history.map((item) => (
                                    <div key={item.id} className="flex items-start gap-4 pb-6 border-b last:border-0 last:pb-0">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <History className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg">{item.service_name}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2">{new Date(item.service_date).toLocaleDateString()}</p>
                                            {item.description && (
                                                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg text-sm">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No service history available for this vehicle.</p>
                                <Button variant="link" onClick={() => navigate('/profile', { state: { view: 'schedule-pickup' } })}>
                                    Schedule your first service
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VehicleDetails;
