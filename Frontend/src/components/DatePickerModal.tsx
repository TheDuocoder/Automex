import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { X, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCarSelectionStore } from "@/stores/carSelectionStore";
import { format } from "date-fns";
import { createServiceBooking } from "@/services/bookingService";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
}

const DatePickerModal = ({ isOpen, onClose, serviceName }: DatePickerModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { selectDate, selectedBrandId, selectedModelId, selectedFuelType, selectedPart, catalog } = useCarSelectionStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modal = modalRef.current;
      
      // Set initial state
      gsap.set(modal, {
        y: -100,
        opacity: 0,
        scale: 0.9,
      });

      // Animate in from top
      gsap.to(modal, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
      });
    }
  }, [isOpen]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Normalize the date to avoid timezone issues
      // Create a new date at midnight UTC for the selected date
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      // Create date at midnight UTC to preserve the selected date
      const normalizedDate = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
      setSelectedDate(normalizedDate);
    }
  };

  const handleConfirm = async () => {
    if (!selectedDate) return;

    // Validate that all car selection data is available
    if (!selectedBrandId || !selectedModelId || !selectedFuelType || !selectedPart) {
      toast({
        title: "Missing Information",
        description: "Please ensure car brand, model, fuel type, and service are selected.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a service.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get brand and model names from catalog
      const brand = catalog.find(b => b.id === selectedBrandId);
      const model = brand?.models.find(m => m.id === selectedModelId);

      if (!brand || !model) {
        throw new Error("Invalid car selection data");
      }

      // Create booking data
      // The selectedDate is already normalized to UTC at noon, so we can use it directly
      // Extract the date components to ensure we're using the correct date
      const year = selectedDate.getUTCFullYear();
      const month = selectedDate.getUTCMonth();
      const day = selectedDate.getUTCDate();
      
      // Create date at noon UTC to avoid timezone shifts
      const bookingDate = new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
      
      const bookingData = {
        booking_date: bookingDate.toISOString(),
        car_brand: brand.name,
        car_model: model.name,
        fuel_type: selectedFuelType,
        service_name: selectedPart,
      };

      // Log for debugging - show what date will be sent
      const displayDate = new Date(Date.UTC(year, month, day));
      console.log('[Booking] Selected date (UI):', format(displayDate, "EEEE, MMMM d, yyyy"));
      console.log('[Booking] Booking date (payload):', bookingData.booking_date);
      console.log('[Booking] Date components - Year:', year, 'Month:', month + 1, 'Day:', day);
      console.log('[Booking] Creating booking with data:', bookingData);

      // Call API to create booking
      await createServiceBooking(bookingData);

      // Reset Zustand store after successful booking
      const { resetSelection } = useCarSelectionStore.getState();
      resetSelection();

      // Close modal immediately
      handleClose();

      // Redirect to My Services page with success flag
      navigate('/my-services', { state: { bookingSuccess: true, serviceName: selectedPart } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create booking. Please try again.";
      
      // Check if it's an authentication error
      if (errorMessage.includes("Unauthorized") || errorMessage.includes("401")) {
        toast({
          title: "Authentication Required",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
          duration: 5000,
        });
        // Redirect to home page after a delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast({
          title: "Booking Failed",
          description: errorMessage,
          variant: "destructive",
          duration: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        y: -100,
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          onClose();
          setSelectedDate(undefined);
        },
      });
    } else {
      onClose();
      setSelectedDate(undefined);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        ref={modalRef}
        className="sm:max-w-[425px] p-0 gap-0 overflow-hidden border-0 shadow-2xl"
        style={{
          background: "transparent",
        }}
      >
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CalendarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Select Date</h2>
                {serviceName && (
                  <p className="text-sm text-white/90">{serviceName}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar */}
          <div className="p-6 bg-white">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md border-0"
            />
            
            {selectedDate && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Selected Date:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(() => {
                    // Display using UTC methods to match what will be sent in payload
                    const year = selectedDate.getUTCFullYear();
                    const month = selectedDate.getUTCMonth();
                    const day = selectedDate.getUTCDate();
                    const displayDate = new Date(Date.UTC(year, month, day));
                    return format(displayDate, "EEEE, MMMM d, yyyy");
                  })()}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || isSubmitting}
              className="px-6 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DatePickerModal;

