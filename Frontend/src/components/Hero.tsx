import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of car service background images
  const backgroundImages = [
    "https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80", // Car engine maintenance
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80", // Mechanic working on car
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80", // Car interior detailing
    "https://images.unsplash.com/photo-1632823469850-1b5f8cd49d4d?auto=format&fit=crop&q=80", // Car tire service
    "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&q=80", // Professional car wash
    "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80"  // Luxury car service
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[calc(100vh-3.5rem)] overflow-hidden bg-white">
      {/* Background Images - Full width with fade transition */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url("${image}")`,
            filter: 'brightness(0.5)',
            opacity: currentImageIndex === index ? 1 : 0,
            zIndex: currentImageIndex === index ? 1 : 0
          }}
        ></div>
      ))}
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-transparent z-[2]"></div>
      
      {/* Image Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[3] flex gap-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImageIndex === index 
                ? 'bg-primary w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-[4] h-full flex items-center py-6 md:py-8 lg:py-12">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center w-full">
          {/* Left side - Text content */}
          <div className="relative text-white animate-fade-in max-w-2xl hidden md:block">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
              Professional Car Service & Maintenance Excellence
            </h2>
            <p className="text-base md:text-xl opacity-90 mb-3 md:mb-4 leading-relaxed">
              Expert mechanics working with premium tools and genuine parts for your luxury vehicle. 
              We bring the service center to your doorstep with free pick-up and drop facility.
            </p>
            <div className="space-y-2 text-sm md:text-base opacity-90">
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Certified Technicians with 10+ Years Experience</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>100% Genuine Parts & Transparent Pricing</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span>Real-Time Service Tracking</span>
              </p>
            </div>
            <div className="mt-4 md:mt-6">
              <span className="inline-block bg-primary/90 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg">
                Crafted for Quality. Built on Trust
              </span>
            </div>
          </div>

          {/* Right side - Form with falling animation */}
          <div className="bg-white rounded-lg p-5 md:p-6 lg:p-8 shadow-2xl animate-slide-in-right w-full md:w-80 lg:w-96 mx-auto md:mx-0">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
              Experience The Best Car Services In Bhubaneswar
            </h1>
            <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6">
              Get instant quotes for your car service
            </p>

            <div className="space-y-5">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="SELECT YOUR CAR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                  <SelectItem value="audi">Audi</SelectItem>
                  <SelectItem value="porsche">Porsche</SelectItem>
                  <SelectItem value="jaguar">Jaguar</SelectItem>
                  <SelectItem value="volvo">Volvo</SelectItem>
                  <SelectItem value="volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="skoda">Skoda</SelectItem>
                </SelectContent>
              </Select>

              <Input 
                type="email" 
                placeholder="ENTER YOUR EMAIL ID" 
                className="w-full"
              />

              <Input 
                type="tel" 
                placeholder="ENTER MOBILE NUMBER" 
                className="w-full"
              />

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 md:py-5 text-xs md:text-sm">
                CHECK PRICES FOR FREE
              </Button>
            </div>

            <div className="flex items-center justify-between mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200 gap-2">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Star className="w-3 md:w-4 h-3 md:h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm md:text-base text-gray-900">4.0/5</p>
                  <p className="text-[9px] md:text-[10px] text-gray-600">Based on 150000+ Reviews</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm md:text-base text-gray-900">2 Million+</p>
                <p className="text-[9px] md:text-[10px] text-gray-600">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS Animation Styles */}
      <style>{`
        @keyframes slideInRight {
          0% {
            transform: translateX(100%) translateY(-100%) rotate(10deg);
            opacity: 0;
          }
          60% {
            transform: translateX(-10px) translateY(0) rotate(-2deg);
            opacity: 1;
          }
          80% {
            transform: translateX(5px) translateY(0) rotate(1deg);
          }
          100% {
            transform: translateX(0) translateY(0) rotate(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
