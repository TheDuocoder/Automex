import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white py-2 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center">
              <img 
                src="/images/AUTOMEX.png" 
                alt="AutoMex Logo" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </div>
            
            <button className="hidden sm:flex items-center gap-1 text-sm md:text-base hover:text-primary transition-colors">
              Bhubaneswar <ChevronDown className="w-4 md:w-5 h-4 md:h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <a 
              href="#about-us" 
              className="text-base hover:text-primary transition-colors hidden md:block"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('about-us');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              About Us
            </a>
            
            {/* More Dropdown */}
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-1 text-base hover:text-primary transition-colors">
                More <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                {/* Arrow pointer */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
                
                <div className="relative bg-white rounded-lg overflow-hidden">
                  <a href="#faq" className="block px-5 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 text-sm font-medium">
                    FAQ
                  </a>
                  <a href="#contact" className="block px-5 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 text-sm font-medium">
                    Contact Us
                  </a>
                  <a href="#terms" className="block px-5 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 text-sm font-medium">
                    Terms
                  </a>
                  <a href="#privacy" className="block px-5 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 text-sm font-medium">
                    Privacy
                  </a>
                  <a href="#offers" className="block px-5 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 text-sm font-medium">
                    Offers
                  </a>
                  <a href="#reviews" className="block px-5 py-3 hover:bg-gray-100 transition-colors text-sm font-medium">
                    Reviews
                  </a>
                </div>
              </div>
            </div>
            
            <Button variant="destructive" size="default" className="bg-primary hover:bg-primary/90 text-sm md:text-base px-4 md:px-6">
              Login
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-gray-700">
            <nav className="flex flex-col space-y-3 pt-3">
              <a 
                href="#about-us" 
                className="text-sm hover:text-primary transition-colors py-2"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('about-us');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  setMobileMenuOpen(false);
                }}
              >
                About Us
              </a>
              <a href="#faq" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <a href="#contact" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Contact Us
              </a>
              <a href="#terms" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Terms
              </a>
              <a href="#privacy" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Privacy
              </a>
              <a href="#offers" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Offers
              </a>
              <a href="#reviews" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Reviews
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
