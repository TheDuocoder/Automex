import { Button } from "@/components/ui/button";
import { Car, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-black text-white py-2 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <img 
                src="/Images/AUTOMEX.png" 
                alt="AutoMex Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            
            <button className="flex items-center gap-1 text-sm hover:text-primary transition-colors">
              Bhubaneswar <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-sm hover:text-primary transition-colors hidden md:block">
              Blog
            </a>
            <button className="text-sm hover:text-primary transition-colors hidden md:block">
              More
            </button>
            <Button variant="destructive" size="sm" className="bg-primary hover:bg-primary/90">
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
