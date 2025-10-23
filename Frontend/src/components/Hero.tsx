import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-700 to-gray-900 py-12 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Car illustration */}
          <div className="relative">
            <div className="text-center">
              <img 
                src="https://gomechprod.blob.core.windows.net/websiteasset/New%20Website/components/Homepage/car-top-view.png" 
                alt="Car Service" 
                className="w-full max-w-lg mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-card rounded-lg shadow-2xl p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Experience The Best Car Services In Mumbai
            </h1>
            <p className="text-muted-foreground mb-6">
              Get instant quotes for your car service
            </p>

            <div className="space-y-4">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="MUMBAI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
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

            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-green-500 text-green-500" />
                <div>
                  <p className="font-bold text-lg">4.0/5</p>
                  <p className="text-xs text-muted-foreground">Based on 150000+ Reviews</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">2 Million+</p>
                <p className="text-xs text-muted-foreground">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
