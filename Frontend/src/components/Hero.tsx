import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-white">
      {/* Background Image - Full width */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80")',
          filter: 'brightness(0.5)'
        }}
      ></div>
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10 h-full flex items-center py-8 md:py-12">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center w-full">
          {/* Left side - Text content */}
          <div className="relative text-white animate-fade-in max-w-2xl">
            <div className="mb-3">
              <span className="inline-block bg-orange-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                AutoMex - Your Trusted Car Care Partner
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Professional Car Service & Maintenance Excellence
            </h2>
            <p className="text-xl opacity-90 mb-4 leading-relaxed">
              Expert mechanics working with premium tools and genuine parts for your luxury vehicle. 
              We bring the service center to your doorstep with free pick-up and drop facility.
            </p>
            <div className="space-y-2 text-base opacity-90">
              <p className="flex items-center gap-2">
                <span className="text-orange-400">✓</span>
                <span>Certified Technicians with 10+ Years Experience</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-400">✓</span>
                <span>100% Genuine Parts & Transparent Pricing</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-orange-400">✓</span>
                <span>Real-Time Service Tracking & 24/7 Support</span>
              </p>
            </div>
            <p className="mt-6 text-2xl font-semibold text-orange-400 italic">
              "Your Car's Health, Our Priority"
            </p>
          </div>

          {/* Right side - Form with falling animation */}
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-2xl animate-slide-in-right w-full md:w-80 lg:w-96">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Experience The Best Car Services In Bhubaneswar
            </h1>
            <p className="text-gray-600 text-sm mb-6">
              Get instant quotes for your car service
            </p>

            <div className="space-y-5">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="BHUBANESWAR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bhubaneswar">Bhubaneswar</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="SELECT YOUR CAR" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maruti">Maruti Suzuki</SelectItem>
                  <SelectItem value="hyundai">Hyundai</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="tata">Tata</SelectItem>
                </SelectContent>
              </Select>

              <Input 
                type="tel" 
                placeholder="ENTER MOBILE NUMBER" 
                className="w-full"
              />

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 text-sm">
                CHECK PRICES FOR FREE
              </Button>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div>
                  <p className="font-bold text-base text-gray-900">4.0/5</p>
                  <p className="text-[10px] text-gray-600">Based on 150000+ Reviews</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-base text-gray-900">2 Million+</p>
                <p className="text-[10px] text-gray-600">Happy Customers</p>
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
