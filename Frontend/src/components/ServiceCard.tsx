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
  thumbnail: string;
  warranty: string;
  recommended: string;
  features: ServiceFeature[];
  moreServicesCount?: number;
  originalPrice: number;
  discountedPrice: number;
  duration: string;
  offer?: ServiceOffer;
  isRecommended?: boolean;
  onAddToCart: (serviceId: string, serviceName: string) => void;
}

const ServiceCard = ({ 
  id,
  name, 
  thumbnail, 
  warranty, 
  recommended, 
  features, 
  moreServicesCount,
  originalPrice, 
  discountedPrice, 
  duration, 
  offer,
  isRecommended = false,
  onAddToCart 
}: ServiceCardProps) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white">
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-green-500 text-white font-medium px-3 py-1">
            RECOMMENDED
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Service Thumbnail */}
          <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center bg-red-50 w-full h-full">
                <div className="text-red-500 text-lg font-bold">
                  🔧
                </div>
              </div>
            )}
          </div>
          
          {/* Service Details */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 font-inter">{name}</h3>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{duration}</span>
              </div>
            </div>
            
            {/* Warranty & Recommendation Info */}
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
            
            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">{feature.name}</span>
                </div>
              ))}
            </div>
            
            {/* More Services Link */}
            {moreServicesCount && (
              <button className="text-green-500 text-sm font-medium flex items-center gap-1 mb-4 hover:text-green-600 transition-colors">
                <Plus className="h-4 w-4" />
                + {moreServicesCount} more View All
              </button>
            )}
          </div>
          
          {/* Pricing and Actions */}
          <div className="w-full lg:w-64 flex flex-col justify-between">
            <div className="text-right mb-4">
              <div className="text-sm text-gray-500 line-through font-medium">
                Rs. {originalPrice.toLocaleString()}
              </div>
              <div className="text-2xl font-bold text-gray-900 font-inter">
                ₹ {discountedPrice.toLocaleString()}
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              className="w-full bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 font-medium h-12 transition-all duration-200"
              onClick={() => onAddToCart(id, name)}
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD TO CART
            </Button>
            
            {/* Special Offer */}
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
