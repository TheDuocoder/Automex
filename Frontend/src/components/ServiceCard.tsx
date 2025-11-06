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
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-white border border-gray-100">
      {isRecommended && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-green-500 text-white font-medium px-3 py-1 text-xs">
            RECOMMENDED
          </Badge>
        </div>
      )}

      <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
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
              className="h-24 w-24 object-contain opacity-80"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-5"></div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 font-inter">{name}</h3>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{duration}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <div className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{warranty}</span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span>{recommended}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">{feature.name}</span>
                </div>
              ))}
            </div>
            
            {moreServicesCount && (
              <button className="text-green-500 text-sm font-medium flex items-center gap-1 mb-4 hover:text-green-600 transition-colors">
                <Plus className="h-4 w-4" />
                + {moreServicesCount} more View All
              </button>
            )}
          </div>
          
          <div className="w-full lg:w-64 flex flex-col justify-between">
            <div className="text-right mb-4">
              <div className="text-sm text-gray-500 line-through font-medium">
                Rs. {originalPrice.toLocaleString()}
              </div>
              <div className="text-2xl font-bold text-gray-900 font-inter">
                ₹ {discountedPrice.toLocaleString()}
              </div>
            </div>
            
            <Button 
              className="w-full bg-white border-2 border-[#D32F2F] text-[#D32F2F] hover:bg-red-50 font-medium h-12 transition-all duration-200 rounded-lg"
              onClick={() => onAddToCart(id, name)}
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD TO CART
            </Button>
            
            {offer && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🏷️</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    Get at ₹{offer.price.toLocaleString()}
                  </span>
                </div>
                <Badge className={`${offer.badgeColor || 'bg-green-500'} text-white text-xs font-medium`}>
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
