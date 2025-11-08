import React from 'react';
import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  descriptions = []
}) => {
  const DEFAULT_VISIBLE = 4;
  const [showMore, setShowMore] = React.useState(false);
  const hasMoreFeatures = features.length > DEFAULT_VISIBLE;
  const visibleFeatures = showMore ? features : features.slice(0, DEFAULT_VISIBLE);
  const remainingCount = Math.max(features.length - DEFAULT_VISIBLE, 0);
  const shouldShowButton = hasMoreFeatures || descriptions.length > 0;

  const displayImage = (
    <div className="h-36 w-full rounded-xl overflow-hidden bg-white flex items-center justify-center border border-gray-200" style={{ backgroundColor: '#ffffff' }}>
      {thumbnail ? (
        <img src={thumbnail} alt={name} className="w-full h-full object-contain bg-white" style={{ backgroundColor: '#ffffff' }} />
      ) : (
        <img
          src="/images/service_icons/car_service.png"
          alt="Service"
          className="h-20 w-20 object-contain opacity-90 bg-white"
          style={{ backgroundColor: '#ffffff' }}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden border border-gray-200 bg-white rounded-xl">
        {isRecommended && (
          <div className="absolute -top-4 left-0">
            <div className="bg-[#3BAA2A] text-white text-xs font-semibold px-4 py-1 rounded-t-md rounded-br-md shadow-sm">
              RECOMMENDED
            </div>
          </div>
        )}

        {specialLabel && !isRecommended && (
          <div className="absolute -top-4 left-0">
            <div className="bg-[#3BAA2A] text-white text-xs font-semibold px-4 py-1 rounded-t-md rounded-br-md shadow-sm">
              {specialLabel}
            </div>
          </div>
        )}

        <div className="absolute top-4 right-6 text-xs text-gray-700 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span className="tracking-wide">{duration}</span>
        </div>

        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="w-full md:w-[200px] flex-shrink-0 h-full">
              <div className="h-32">{displayImage}</div>
            </div>

            <div className="flex-1 space-y-3">
              <h3 className="text-[20px] font-bold text-gray-900 leading-tight">{name}</h3>

              <div className="flex flex-wrap items-center gap-4 text-[14px] text-gray-700">
                <span className="whitespace-nowrap">• {warranty}</span>
                <span className="whitespace-nowrap">• {recommended}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[14px] text-gray-700">
                {visibleFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="w-4 h-4 bg-[#CBF2CB] rounded-full flex items-center justify-center text-green-600 text-xs">
                      ✓
                    </div>
                    {feature.name}
                  </div>
                ))}
              </div>

              {shouldShowButton && (
                <button
                  className="text-green-600 text-sm font-semibold flex items-center gap-1 underline underline-offset-2 hover:text-green-700 transition-colors"
                  onClick={() => setShowMore((prev) => !prev)}
                >
                  {!showMore && <Plus className="h-4 w-4" />}
                  {showMore
                    ? "Show Less"
                    : remainingCount > 0
                      ? `+ ${remainingCount} more View All`
                      : "View More"}
                </button>
              )}

              {showMore && descriptions.length > 0 && (
                <div className="space-y-2 text-sm text-gray-700 border border-gray-200 rounded-lg p-3 bg-gray-50/70">
                  {descriptions.map((text, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {text}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 pt-1">
                <div className="text-gray-700 space-y-1 md:space-y-2">
                  <div className="text-sm text-gray-400 line-through whitespace-nowrap">
                    Rs. {originalPrice.toLocaleString()}
                  </div>
                  <div className="text-[24px] font-bold text-gray-900 whitespace-nowrap">
                    ₹ {discountedPrice.toLocaleString()}
                  </div>
                </div>

                <Button
                  className="uppercase tracking-wider text-sm font-semibold border-2 border-red-500 text-red-500 bg-white hover:bg-red-50 hover:text-red-600 px-5 py-2 rounded-md"
                  onClick={() => onAddToCart(id, name)}
                >
                  Select Car
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {offer && (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm font-semibold text-gray-800">
            <div className="flex items-center justify-center w-14 h-10 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-md text-[10px] leading-tight text-center shadow-sm uppercase tracking-wide">
              Summer<br />Sale
            </div>
            <span>Get at ₹{offer.price.toLocaleString()}</span>
          </div>
          <Badge className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {offer.discount}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
