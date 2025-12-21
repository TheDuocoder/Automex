import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore, CartItem } from "@/stores/cartStore";
import { createServiceBooking } from "@/services/bookingService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trash2, Calendar as CalendarIcon, Loader2, ShoppingCart, Car } from "lucide-react";
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

                const year = selectedDate.getUTCFullYear();
                const month = selectedDate.getUTCMonth();
                const day = selectedDate.getUTCDate();
                const bookingDate = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));

                const bookingData = {
                    booking_date: bookingDate.toISOString(),
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
        if (date) {
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const normalizedDate = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
            setSelectedDate(normalizedDate);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
                <h1 className="text-3xl font-bold mb-6">My Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
                        <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Add services to your cart to book them.</p>
                        <Button onClick={() => navigate("/services")}>Browse Services</Button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedItems).map(([carInfo, groupItems]) => (
                            <Card key={carInfo} className="overflow-hidden border-2 border-gray-100">
                                <CardHeader className="bg-gray-50 border-b border-gray-100 py-4">
                                    <div className="flex items-center gap-2">
                                        <Car className="h-5 w-5 text-gray-600" />
                                        <CardTitle className="text-lg">{carInfo}</CardTitle>
                                        <Badge variant="secondary" className="ml-2">{groupItems.length} Services</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {groupItems.map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4 border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                                            {item.image && (
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-grow text-center sm:text-left">
                                                <h3 className="font-bold text-base sm:text-lg">{item.name}</h3>

                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0">
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                                <CardFooter className="bg-gray-50/50 p-4 sm:px-6 flex flex-col sm:flex-row justify-end items-center gap-4">

                                    <Button
                                        onClick={() => handleCheckoutClick(groupItems)}
                                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Book These Services
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
                                    className="bg-red-600 hover:bg-red-700 text-white"
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
