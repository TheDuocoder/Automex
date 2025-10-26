import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const SummerServices = () => {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  const services = [
    {
      title: "Front Bumper Paint",
      description: "Restore your bumper to a factory-fresh look with precision prep, priming, and multi‑stage paint matching.",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600",
      features: ["Color matching", "Premium coating", "UV protection"]
    },
    {
      title: "Rubbing & Polishing",
      description: "Remove oxidation, swirl marks, and light scratches to reveal a deep, glossy finish.",
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600",
      features: ["Machine polishing", "Swirl reduction", "Mirror finish"]
    },
    {
      title: "Deep All Round Spa",
      description: "Thorough interior and exterior spa that sanitizes the cabin and restores the exterior sheen.",
      image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600",
      features: ["Steam sanitization", "Deep cleaning", "Wax protection"]
    },
    {
      title: "Periodic Service",
      description: "Seasonal maintenance package covering fluids, filters, and safety systems for summer reliability.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600",
      features: ["AC check", "Coolant top-up", "Battery health"]
    }
  ];

  const promotionalOffers = [
    {
      badge: "⚡ FLASH SALE",
      title: "Premium Detailing Package",
      description: "Professional interior & exterior detailing with ceramic coating, steam wash, paint correction, and premium wax protection for ultimate shine",
      features: [
        { icon: "✓", text: "Ceramic Coating" },
        { icon: "✓", text: "Paint Correction" },
        { icon: "✓", text: "Steam Sanitization" },
        { icon: "✓", text: "Interior Deep Clean" }
      ],
      price: "₹3,499",
      originalPrice: "₹5,999",
      discount: "42%",
      buttonText: "Save 42% - Book Now",
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=800",
      gradient: "from-blue-900 via-blue-800 to-slate-900"
    },
    {
      badge: "🌟 BEST VALUE",
      title: "Complete Tyre Care Package",
      description: "Comprehensive tyre service including wheel alignment, balancing, rotation, nitrogen filling, and complete tread inspection",
      features: [
        { icon: "✓", text: "4-Wheel Alignment" },
        { icon: "✓", text: "Wheel Balancing" },
        { icon: "✓", text: "Nitrogen Filling" },
        { icon: "✓", text: "Tread Inspection" }
      ],
      price: "₹1,799",
      originalPrice: "₹2,999",
      discount: "40%",
      buttonText: "Save 40% - Book Now",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
      gradient: "from-purple-900 via-purple-800 to-slate-900"
    },
    {
      badge: "🎯 TRENDING NOW",
      title: "Engine Care Specialist",
      description: "Complete engine diagnostics, oil change, filter replacement, fuel system cleaning, and performance optimization for peak efficiency",
      features: [
        { icon: "✓", text: "Engine Diagnostics" },
        { icon: "✓", text: "Oil & Filter Change" },
        { icon: "✓", text: "Fuel System Clean" },
        { icon: "✓", text: "Performance Check" }
      ],
      price: "₹2,199",
      originalPrice: "₹3,499",
      discount: "37%",
      buttonText: "Save 37% - Book Now",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800",
      gradient: "from-orange-900 via-red-800 to-slate-900"
    }
  ];

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Get Summer Ready With AutoMex
          </h2>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-4">
            Beat the heat with our specialized summer car care packages designed to keep your vehicle performing at its best
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group relative hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-white animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10 transition-all duration-500 z-10 pointer-events-none"></div>
              
              <div className="relative h-44 md:h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="text-white font-bold text-lg md:text-xl mb-1 transform group-hover:translate-y-[-4px] transition-transform duration-300">{service.title}</h3>
                  <div className="h-1 w-10 md:w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                </div>
              </div>
              <div className="p-4 md:p-6 relative z-20">
                <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed group-hover:text-gray-700 transition-colors">{service.description}</p>
                <div className="space-y-2.5">
                  {service.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      <div className="relative">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      </div>
                      <span className="text-xs text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            </Card>
          ))}
        </div>

        {/* Special Offer Carousel - Smaller Size */}
        <Carousel
          plugins={[autoplayPlugin.current]}
          className="w-full animate-fade-in"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {promotionalOffers.map((offer, index) => (
              <CarouselItem key={index}>
                <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${offer.gradient} shadow-xl border border-orange-500/20`}>
                  {/* Animated background */}
                  <div className="absolute inset-0 overflow-hidden opacity-10">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  
                  <div className="relative px-6 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left side - Content */}
                    <div className="flex-1 text-white space-y-4">
                      <div>
                        <div className="inline-block bg-orange-500/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3 animate-bounce">
                          <span className="text-orange-400 font-semibold text-xs">{offer.badge}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-orange-300 to-red-500 bg-clip-text text-transparent">
                          {offer.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                          {offer.description}
                        </p>
                      </div>
                      
                      {/* Features list */}
                      <div className="grid grid-cols-2 gap-2">
                        {offer.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                            <span className="text-xs text-gray-300">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-lg px-4 py-3 border border-orange-500/30">
                          <div className="text-2xl font-bold text-orange-400">{offer.price}</div>
                          <div className="text-xs line-through text-gray-400">{offer.originalPrice}</div>
                        </div>
                        <Button size="default" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg shadow-orange-500/50 transform hover:scale-105 transition-all text-sm">
                          {offer.buttonText}
                        </Button>
                      </div>
                    </div>

                    {/* Right side - Image */}
                    <div className="flex-shrink-0 w-full md:w-2/5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-red-500/20 rounded-lg blur-lg"></div>
                        <img
                          src={offer.image}
                          alt={offer.title}
                          className="relative w-full h-auto rounded-lg shadow-xl border-2 border-orange-500/30 transform hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800";
                          }}
                        />
                        {/* Overlay badge */}
                        <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-xl border-2 border-slate-900 animate-pulse">
                          <span className="text-lg font-bold">{offer.discount}</span>
                          <span className="text-[10px] font-semibold">OFF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default SummerServices;

