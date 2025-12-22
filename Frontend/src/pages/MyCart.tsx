import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { createServiceBooking } from "@/services/bookingService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trash2, Calendar as CalendarIcon, Loader2, ShoppingCart, Car, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const MyCart = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { items, removeFromCart, clearCart } = useCartStore();
    const { toast } = useToast();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingItems, setBookingItems] = useState<CartItem[]>([]);

    // Group items by car model
    const groupedItems = items.reduce((acc, item) => {
        const key = `${item.brand} ${item.model} • ${item.fuelType || ''}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {} as Record<string, CartItem[]>);

    const handleCheckoutClick = (groupItems: CartItem[]) => {
        setBookingItems(groupItems);
        setIsCheckoutOpen(true);
    };

    const handleConfirmBooking = async () => {
        if (!selectedDate || bookingItems.length === 0) return;
        setIsSubmitting(true);

        // Generate a unique booking_group_id for this batch of services
        const bookingGroupId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        try {
            for (const item of bookingItems) {
                if (!item.brand || !item.model || !item.fuelType) {
                    console.warn(`Skipping item ${item.name} due to missing car info`);
                    continue;
                }

                // Combine selected date with CURRENT time to capture exact booking moment
                const now = new Date();
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth();
                const day = selectedDate.getDate();
                const hours = now.getHours();
                const minutes = now.getMinutes();

                // Construct local date object
                const combinedDate = new Date(year, month, day, hours, minutes);

                // Format manually to YYYY-MM-DDTHH:mm:ss to preserve local time values exactly
                // This avoids timezone shifting when sent to backend
                const pad = (n: number) => n.toString().padStart(2, '0');
                const bookingDateString = `${year}-${pad(month + 1)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`;

                const bookingData = {
                    booking_date: bookingDateString,
                    car_brand: item.brand,
                    car_model: item.model,
                    fuel_type: item.fuelType,
                    service_name: item.name,
                    booking_group_id: bookingGroupId,
                };

                await createServiceBooking(bookingData);
                // Remove booked item from cart
                removeFromCart(item.id);
            }

            toast({
                title: "Booking Successful!",
                description: `Successfully booked ${bookingItems.length} services.`,
                duration: 5000,
            });

            setIsCheckoutOpen(false);
            setBookingItems([]);
            // Navigate to My Services
            navigate("/my-services", {
                state: {
                    bookingSuccess: true,
                    serviceName: `${bookingItems.length} service${bookingItems.length > 1 ? 's' : ''}`
                }
            });

        } catch (error) {
            console.error("Booking error:", error);
            toast({
                title: "Booking Failed",
                description: "There was an error processing your booking. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl" style={{ fontFamily: 'Super Roman, sans-serif', fontWeight: 900 }}>Booking Cart</h1>
                        <img 
                            src="/images/Services/shopping-cart.png" 
                            alt="Shopping Cart" 
                            className="w-8 h-8 object-contain"
                        />
                    </div>
                    <Button 
                        onClick={() => {
                            if (items.length > 0) {
                                const firstItem = items[0];
                                navigate("/services", { 
                                    state: { 
                                        preselectedCar: {
                                            brand: firstItem.brand,
                                            model: firstItem.model,
                                            fuelType: firstItem.fuelType
                                        }
                                    }
                                });
                            } else {
                                navigate("/services");
                            }
                        }}
                        variant="ghost"
                        className="text-gray-700 hover:text-gray-900 hover:bg-transparent font-medium px-0 flex items-center gap-1"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Back
                    </Button>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                        <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Add services to your cart to book them.</p>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate("/services")}>Browse Services</Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedItems).map(([carInfo, groupItems]) => (
                            <Card key={carInfo} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader 
                                    className="border-b border-gray-200 py-3.5 px-5"
                                    style={{
                                        background: 'linear-gradient(90deg, #631683 0.000%, #7f237e 14.286%, #9e3980 28.571%, #bc5588 42.857%, #d57496 57.143%, #e494a8 71.429%, #e7b1be 85.714%, #dec8d6 100.000%)'
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm p-2 overflow-hidden transition-transform duration-300 hover:scale-110 cursor-pointer">
                                                <img 
                                                    src={`/images/Car_brands/${groupItems[0].brand}.png`}
                                                    alt={groupItems[0].brand}
                                                    className="w-full h-full object-contain"
                                                    style={{ objectFit: 'contain' }}
                                                    onError={(e) => {
                                                        const brand = groupItems[0].brand || '';
                                                        const firstWord = brand.split(/[\s\-]/)[0];
                                                        const capitalizedBrand = firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
                                                        
                                                        // Special handling for specific brands
                                                        if (brand.toLowerCase().includes('volkswagen')) {
                                                            e.currentTarget.src = `/images/Car_brands/Volkswagancarlogo.png`;
                                                        } else if (brand.toLowerCase().includes('maruti') && brand.toLowerCase().includes('suzuki')) {
                                                            e.currentTarget.src = `/images/Car_brands/Marutisuzukicarlogo.png`;
                                                        } else if (brand.toLowerCase().includes('toyota')) {
                                                            e.currentTarget.src = `/images/Car_brands/Toyotacarlogo.png`;
                                                        } else if (brand.toLowerCase().includes('hyundai')) {
                                                            e.currentTarget.src = `/images/Car_brands/Hyundaicarlogo.png`;
                                                        } else if (brand.toLowerCase() === 'mg' || brand.toLowerCase().includes('mg ')) {
                                                            e.currentTarget.src = `/images/Car_brands/Mgcarlogo.png`;
                                                        } else {
                                                            e.currentTarget.src = `/images/Car_brands/${capitalizedBrand}carlogo.png`;
                                                        }
                                                        
                                                        e.currentTarget.onerror = () => {
                                                            // Final fallback - hide image and show car icon
                                                            e.currentTarget.style.display = 'none';
                                                            const carIcon = e.currentTarget.nextElementSibling;
                                                            if (carIcon) carIcon.classList.remove('hidden');
                                                        };
                                                    }}
                                                />
                                                <Car className="h-5 w-5 text-purple-600 hidden" />
                                            </div>
                                            <CardTitle className="text-base text-white" style={{ fontFamily: 'Moranga, sans-serif', fontWeight: 700 }}>{carInfo}</CardTitle>
                                        </div>
                                        <Badge variant="secondary" className="text-white hover:opacity-90 px-3 py-1 text-xs font-medium" style={{ backgroundColor: '#631683' }}>{groupItems.length} Service{groupItems.length > 1 ? 's' : ''}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {groupItems.map((item, index) => (
                                        <div key={item.id} className={`flex items-center px-5 py-4 gap-4 ${index !== groupItems.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50/70 transition-colors group`}>
                                            {item.image && (
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 ring-1 ring-gray-200">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-semibold text-base text-gray-900 truncate">{item.name}</h3>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => removeFromCart(item.id)} 
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity w-11 h-11"
                                            >
                                                <Trash2 className="h-5.5 w-5.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                                <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-5 py-4 flex justify-between items-center">
                                    <Button
                                        onClick={() => navigate("/services")}
                                        variant="ghost"
                                        className="text-gray-700 hover:text-gray-900 hover:bg-transparent font-medium px-0 flex items-center gap-1"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                        Continue adding
                                    </Button>
                                    <Button
                                        onClick={() => handleCheckoutClick(groupItems)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-sm hover:shadow transition-all"
                                    >
                                        Click to Book
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Checkout Dialog */}
                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white">
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5" /> Select Date
                            </h2>
                            <p className="text-white/80 text-sm mt-1">
                                for {bookingItems.length} services
                            </p>
                        </div>
                        <div className="p-6">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                className="rounded-md border shadow-sm mx-auto"
                            />
                            <div className="mt-6 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
                                <Button
                                    onClick={handleConfirmBooking}
                                    disabled={!selectedDate || isSubmitting}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {isSubmitting ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...</>
                                    ) : "Confirm Booking"}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer />
        </div>
    );
};

export default MyCart;
