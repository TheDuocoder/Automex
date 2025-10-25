import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-4 md:py-6 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80")',
          filter: 'brightness(0.5)'
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Text content */}
          <div className="relative text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Professional Car Service</h2>
            <p className="text-xl opacity-90">Expert mechanics working with premium tools and genuine parts for your luxury vehicle.</p>
          </div>

          {/* Right side - Form */}
          <div className="bg-transparent backdrop-blur-none rounded-lg p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Experience The Best Car Services In Bhubaneswar
            </h1>
            <p className="text-white/80 mb-6">
              Get instant quotes for your car service
            </p>

            <div className="space-y-4">
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

              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base">
                CHECK PRICES FOR FREE
              </Button>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <div>
                  <p className="font-bold text-lg text-white">4.0/5</p>
                  <p className="text-xs text-white/70">Based on 150000+ Reviews</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-white">2 Million+</p>
                <p className="text-xs text-white/70">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
