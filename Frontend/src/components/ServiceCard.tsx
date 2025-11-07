import React from 'react';
import { CheckCircle, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceFeature {
  name: string;
  included: boolean;
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
  offer?: ServiceOffer;
  thumbnail?: string;
  onAddToCart: (id: string, name: string) => void;
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
  offer,
  thumbnail,
  onAddToCart
}) => {
  return (
    <Card className="relative overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      {isRecommended && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-green-500 text-white font-medium px-2.5 py-0.5 text-[10px] tracking-wide">
            RECOMMENDED
          </Badge>
        </div>
      )}

      <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <img 
              src="/images/service_icons/car_service.png" 
              alt="Car Service Icon" 
              className="h-16 w-16 object-contain opacity-80"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 font-inter leading-tight">{name}</h3>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                <Clock className="h-3.5 w-3.5" />
                <span>{duration}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-600 mb-3 space-y-1">
              <div className="flex items-start gap-1">
                <span className="text-gray-400">•</span>
                <span>{warranty}</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-gray-400">•</span>
                <span>{recommended}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                  <span className="text-xs text-gray-700 font-medium leading-tight">{feature.name}</span>
                </div>
              ))}
            </div>
            
            {moreServicesCount && (
              <button className="text-green-500 text-xs font-semibold flex items-center gap-1 mb-3 hover:text-green-600 transition-colors">
                <Plus className="h-3 w-3" />
                + {moreServicesCount} more View All
              </button>
            )}
          </div>
          
          <div className="w-full lg:w-56 flex flex-col justify-between">
            <div className="text-right mb-3">
              <div className="text-xs text-gray-500 line-through font-medium">
                ₹ {originalPrice.toLocaleString()}
              </div>
              <div className="text-xl font-bold text-gray-900 font-inter">
                ₹ {discountedPrice.toLocaleString()}
              </div>
            </div>
            
            <Button 
              className="w-full bg-white border border-[#D32F2F] text-[#D32F2F] hover:bg-red-50 font-semibold h-10 transition-all duration-200 rounded-lg text-sm"
              onClick={() => onAddToCart(id, name)}
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              ADD TO CART
            </Button>
            
            {offer && (
              <div className="mt-3 p-2.5 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">🏷️</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    Get at ₹{offer.price.toLocaleString()}
                  </span>
                </div>
                <Badge className={`${offer.badgeColor || 'bg-green-500'} text-white text-[10px] font-semibold px-2 py-0.5`}>
                  {offer.discount}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
