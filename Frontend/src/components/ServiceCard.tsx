import React from 'react';
import { Clock, Plus } from "lucide-react";
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
  specialLabel?: string;
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
  specialLabel,
  offer,
  thumbnail,
  onAddToCart
}) => {
  return (
    <div className="space-y-4">
      {/* Main Service Card */}
      <Card className="relative overflow-hidden bg-white border border-[#EDEDED] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300">
        {/* Top Labels */}
        {isRecommended && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-green-500 text-white font-medium px-3 py-1 text-xs rounded-full">
              RECOMMENDED
            </Badge>
          </div>
        )}
        
        {/* Special Label (e.g., FREE AC UNIT INSPECTION) */}
        {specialLabel && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-green-500 text-white font-medium px-3 py-1 text-xs rounded-lg">
              {specialLabel}
            </Badge>
          </div>
        )}

        {/* Duration Tag in top-right */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs">
            {duration.includes("Expert Rating") ? (
              <>
                <div className="flex items-center gap-1">
                  <span className="text-orange-500 text-sm">★</span>
                  <span className="font-bold text-orange-500">{duration.replace("Expert Rating: ", "")}</span>
                </div>
                <span className="text-blue-500 font-medium">Expert Rating</span>
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                <span className="font-medium">{duration}</span>
              </>
            )}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex gap-4">
            {/* Left Side - Image (30-35% width) */}
            <div className="w-[35%] flex-shrink-0">
              <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {thumbnail ? (
                  <img 
                    src={thumbnail} 
                    alt={name} 
                    className="w-full h-full object-cover"
                  />
                ) : name.toLowerCase().includes("battery") || name.toLowerCase().includes("amaron") ? (
                  /* Battery Icon Display */
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-20 h-24 bg-green-500 rounded-lg shadow-md flex items-center justify-center relative">
                      <div className="w-16 h-20 bg-green-600 rounded border-2 border-green-700 flex flex-col items-center justify-center">
                        <div className="text-white text-xs font-bold mb-1">AMARON</div>
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                          <div className="w-6 h-6 bg-green-500 rounded"></div>
                        </div>
                        <div className="text-white text-[8px] mt-1">35 AH</div>
                      </div>
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-gray-400 rounded-sm"></div>
                      <div className="absolute -top-1 right-3 w-3 h-2 bg-gray-400 rounded-sm"></div>
                    </div>
                  </div>
                ) : name.toLowerCase().includes("tyre") || name.toLowerCase().includes("michelin") || name.toLowerCase().includes("ceat") || name.toLowerCase().includes("apollo") ? (
                  /* Tyre Icon Display */
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-24 h-24 relative">
                      {/* Tyre Outer Ring */}
                      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                        {/* Tyre Inner Ring */}
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          {/* Rim */}
                          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                              <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        {/* Tyre Treads */}
                        <div className="absolute inset-2 border-2 border-gray-600 rounded-full"></div>
                        <div className="absolute inset-4 border border-gray-500 rounded-full"></div>
                      </div>
                      {/* Brand Label */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[8px] px-2 py-0.5 rounded font-bold">
                        {name.includes("Michelin") ? "MICHELIN" : name.includes("CEAT") ? "CEAT" : "APOLLO"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src="/images/service_icons/car_service.png" 
                    alt="Car Service Icon" 
                    className="h-20 w-20 object-contain opacity-80"
                  />
                )}
              </div>
            </div>
            
            {/* Right Side - Content (65-70% width) */}
            <div className="w-[65%] flex flex-col">
              {/* Header with title only */}
              <div className="mb-3">
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              </div>
              
              {/* Service details on same line */}
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                <span>• {warranty}</span>
                <span>• {recommended}</span>
              </div>
              
              {/* Features in two columns */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{feature.name}</span>
                  </div>
                ))}
              </div>
              
              {/* View more link */}
              {moreServicesCount && (
                <button className="text-green-600 text-sm font-medium flex items-center gap-1 mb-4 underline hover:text-green-700 transition-colors self-start">
                  <Plus className="h-3 w-3" />
                  + {moreServicesCount} more View All
                </button>
              )}
              
              {/* Pricing and CTA at bottom-right */}
              <div className="flex items-end justify-between mt-auto">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500 line-through">
                    Rs. {originalPrice.toLocaleString()}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹ {discountedPrice.toLocaleString()}
                  </div>
                </div>
                
                <Button 
                  className="bg-white border border-red-500 text-red-500 hover:bg-red-50 font-semibold px-6 py-2.5 rounded-lg text-sm transition-all duration-200"
                  onClick={() => onAddToCart(id, name)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  ADD TO CART
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Discount Banner Below */}
      {offer && (
        <div className="bg-white border border-[#EDEDED] rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Summer Sale Badge */}
              <div className="flex items-center justify-center w-12 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-500 opacity-80"></div>
                <div className="relative z-10">
                  <div className="text-white text-[8px] font-bold leading-tight text-center">
                    <div>SUMMER</div>
                    <div>SALE</div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3">
                  <div className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-[6px] text-red-600 font-bold">🔥</span>
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-800">
                Get at ₹{offer.price.toLocaleString()}
              </span>
            </div>
            <Badge className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {offer.discount}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
