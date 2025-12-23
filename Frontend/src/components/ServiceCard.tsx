import React from 'react';
import { Clock, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCarSelectionStore } from "@/stores/carSelectionStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import DatePickerModal from "./DatePickerModal";

interface ServiceFeature {
  name: string;
  included: boolean;
  details?: string;
}

interface ServiceOffer {
  price: number;
  discount: string;
  badgeColor?: string;
}

interface ServiceCardProps {
  id: string;
  name: string;
  duration: string;
  warranty: string;
  recommended: string;
  features: ServiceFeature[];
  originalPrice: number;
  discountedPrice: number;
  moreServicesCount?: number;
  isRecommended?: boolean;
  specialLabel?: string;
  offer?: ServiceOffer;
  thumbnail?: string;
  onAddToCart: (id: string, name: string) => void;
  descriptions?: string[];
  // Visual variant to match external reference exactly for Car Services section
  variant?: "default" | "gom" | "reference";
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  duration,
  warranty,
  recommended,
  features,
  originalPrice,
  discountedPrice,
  moreServicesCount,
  isRecommended = false,
  specialLabel,
  offer,
  thumbnail,
  onAddToCart,
  descriptions = [],
  variant = "default",
}) => {
  const { isCarSelected, selectPart, triggerHighlight, selectedBrandId, selectedModelId, selectedFuelType, catalog } = useCarSelectionStore();
  const brand = catalog.find(b => b.id === selectedBrandId);
  const modelObj = brand?.models.find(m => m.id === selectedModelId);
  const { addToCart, isInCart } = useCartStore();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const DEFAULT_VISIBLE = 4;
  const [showMore, setShowMore] = React.useState(false);
  const hasMoreFeatures = features.length > DEFAULT_VISIBLE;
  const visibleFeatures = showMore ? features : features.slice(0, DEFAULT_VISIBLE);
  const remainingCount = Math.max(features.length - DEFAULT_VISIBLE, 0);
  const shouldShowButton = hasMoreFeatures;
  const showPrice = discountedPrice > 0;
  // Check if added SPECIFICALLY for the current model
  const isAdded = isCarSelected() ? isInCart(id || name, modelObj?.name) : false;

  const handleBookClick = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show info message using sonner toast
      sonnerToast.info("Login Required", {
        description: "Please login to book a service. You will be redirected to the login page.",
        duration: 3000,
      });

      // Redirect to landing page after a short delay to show the message
      setTimeout(() => {
        navigate('/');
      }, 1000);
      return;
    }

    if (!isCarSelected()) {
      // Show notification
      toast({
        title: "Car Selection Required",
        description: "Please select manufacturer, model, and fuel type before booking.",
        variant: "destructive",
        duration: 4000,
      });

      // Trigger highlight animation
      triggerHighlight();

      // Clear highlight after animation
      setTimeout(() => {
        const { clearHighlight } = useCarSelectionStore.getState();
        clearHighlight();
      }, 2000);

      return;
    }



    if (isInCart(id || name, modelObj?.name)) {
      return;
    }

    // If validation passes, add to cart
    addToCart({
      id: id || name, // Use Name as ID fallback? Ideally ID.
      name: name,
      price: discountedPrice > 0 ? discountedPrice : originalPrice, // Fallback logic? Or just price.
      image: thumbnail,
      brand: brand?.name,
      model: modelObj?.name,
      fuelType: selectedFuelType || undefined
    });

    sonnerToast.success("Added to Cart", {
      description: `${name} has been added to your cart.`,
      duration: 3000,
    });
  };

  const handleDatePickerClose = () => {
    setIsDatePickerOpen(false);
    // Booking is handled inside DatePickerModal, no need to call onAddToCart
    // The DatePickerModal will redirect to /my-services after successful booking
  };


  const displayImage = (
    <div
      className={`${variant === "gom"
        ? "w-[150px] h-[150px] rounded-[6px]"
        : variant === "reference"
          ? "w-[180px] h-[120px] rounded-lg"
          : "h-full w-full rounded-[12px]"
        } relative overflow-hidden bg-white flex items-center justify-center`}
      style={{ backgroundColor: '#ffffff' }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={name}
          className={`w-full h-full ${variant === "default" ? "object-cover" : "object-contain"} bg-white`}
          style={{ backgroundColor: '#ffffff' }}
        />
      ) : (
        <img
          src="https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/service_icons/car_service.png"
          alt="Service"
          className={`${variant === "gom"
            ? "h-[60px] w-[60px]"
            : variant === "reference"
              ? "h-16 w-16"
              : "h-24 w-24"
            } object-contain opacity-90 bg-white`}
          style={{ backgroundColor: '#ffffff' }}
        />
      )}
      {variant === "default" && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      )}
    </div>
  );

  return (
    <>
      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={handleDatePickerClose}
        serviceName={name}
      />
      <div className="space-y-4">
        <Card className={`relative overflow-hidden border border-gray-200 bg-white ${variant === "gom"
          ? "rounded-[6px] shadow-sm"
          : variant === "reference"
            ? "rounded-xl shadow-sm"
            : "rounded-xl"
          }`}>
          {variant === "reference" ? (
            <div className="absolute top-4 right-4 flex items-center gap-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Takes {duration}</span>
            </div>
          ) : (
            <div className="absolute top-4 right-6 text-xs text-gray-700 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="tracking-wide">{duration}</span>
            </div>
          )}

          <CardContent className={`${variant === "gom"
            ? "p-4"
            : variant === "reference"
              ? "p-6"
              : "p-4 md:p-5"
            }`}>
            {variant === "reference" ? (
              // Reference layout matching the first image exactly
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:block">
                  {displayImage}
                </div>

                <div className="flex-1 space-y-3 md:space-y-4">
                  <h3 className="text-lg md:text-xl font-semibold text-[#212121] leading-tight">{name}</h3>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs md:text-sm text-[#757575]">
                    {warranty && <span>• {warranty}</span>}
                    {recommended && <span>• {recommended}</span>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs md:text-sm text-[#212121]">
                    {visibleFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-4 h-4 bg-[#4CAF50] rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          ✓
                        </div>
                        <span className="leading-snug">{feature.name}</span>
                      </div>
                    ))}
                  </div>

                  {shouldShowButton && (
                    <button
                      className="text-[#4CAF50] text-sm font-bold flex items-center gap-1 hover:text-[#45A049] hover:underline transition-all mt-2"
                      onClick={() => setShowMore((prev) => !prev)}
                    >
                      {!showMore && remainingCount === 0 && <Plus className="h-4 w-4" />}
                      {showMore
                        ? "Show Less"
                        : remainingCount > 0
                          ? <span className="flex items-center gap-1">+ {remainingCount} more services <ArrowRight className="h-3 w-3" /> View All</span>
                          : "View More"}
                    </button>
                  )}



                  <div className="flex items-center justify-end gap-4 pt-2">
                    {discountedPrice > 0 && (
                      <div className="flex flex-col items-end">
                        {originalPrice > discountedPrice && (
                          <span className="text-xs text-gray-500 line-through">₹ {originalPrice.toLocaleString()}</span>
                        )}
                        <span className="text-xl font-bold text-gray-900">₹ {discountedPrice.toLocaleString()}</span>
                      </div>
                    )}
                    <Button
                      className="w-full sm:w-auto bg-white border-[3px] border-[#E53935] text-[#E53935] hover:bg-[#E53935] hover:text-white px-6 md:px-8 h-[44px] md:h-[48px] rounded-[12px] font-bold uppercase text-sm tracking-wider transition-all duration-300 min-w-[140px] hover:scale-105 hover:shadow-lg ml-auto"
                      onClick={handleBookClick}
                      disabled={isAdded}
                    >
                      {isAdded ? "ADDED" : "ADD"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Original layout for other variants
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className={`w-full ${variant === "gom" ? "md:w-[170px]" : "md:w-[220px]"} flex-shrink-0 h-full`}>
                  <div className={`${variant === "gom" ? "h-auto" : "h-full"}`}>{displayImage}</div>
                </div>

                <div className="flex-1 space-y-3">
                  <h3 className={`${variant === "gom" ? "text-[17px]" : "text-[20px]"} font-bold text-gray-900 leading-tight`}>{name}</h3>

                  <div className={`flex flex-wrap items-center gap-4 ${variant === "gom" ? "text-[13px]" : "text-[14px]"} text-gray-700`}>
                    {warranty && <span>• {warranty}</span>}
                    {recommended && <span>• {recommended}</span>}
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${variant === "gom" ? "text-[13px]" : "text-[14px]"} text-gray-700`}>
                    {visibleFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-1.5">
                        <div className="w-4 h-4 bg-[#4CAF50] rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          ✓
                        </div>
                        <span className="leading-snug">{feature.name}</span>
                      </div>
                    ))}
                  </div>

                  {shouldShowButton && (
                    <button
                      className="text-green-600 text-sm font-bold flex items-center gap-1 hover:text-green-700 hover:underline transition-all mt-2"
                      onClick={() => setShowMore((prev) => !prev)}
                    >
                      {!showMore && remainingCount === 0 && <Plus className="h-4 w-4" />}
                      {showMore
                        ? "Show Less"
                        : remainingCount > 0
                          ? <span className="flex items-center gap-1">+ {remainingCount} more services <ArrowRight className="h-3 w-3" /> View All</span>
                          : "View More"}
                    </button>
                  )}



                  <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-1">
                    {discountedPrice > 0 && (
                      <div className="flex flex-col items-end justify-center">
                        {originalPrice > discountedPrice && (
                          <span className="text-xs text-gray-500 line-through">₹ {originalPrice.toLocaleString()}</span>
                        )}
                        <span className="text-xl font-bold text-gray-900">₹ {discountedPrice.toLocaleString()}</span>
                      </div>
                    )}
                    <Button
                      className="uppercase tracking-wider text-sm font-bold border-[3px] border-red-500 text-red-500 bg-white hover:bg-red-500 hover:text-white px-8 h-[48px] rounded-[12px] min-w-[140px] transition-all duration-300 hover:scale-105 hover:shadow-lg ml-auto"
                      onClick={handleBookClick}
                      disabled={isAdded}
                    >
                      {isAdded ? "ADDED" : "ADD"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ServiceCard;
