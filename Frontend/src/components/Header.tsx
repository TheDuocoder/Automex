import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-transparent text-white py-3 md:py-4 lg:py-5 absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="/images/automex_circle_img.png" 
                alt="AutoMex Logo" 
                className="h-16 md:h-20 lg:h-24 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/AUTOMEX.png";
                }}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 md:gap-4 lg:gap-6 pt-2">
            <a 
              href="#about-us" 
              className="text-sm hover:text-primary transition-colors hidden lg:block"
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
            
            <a 
              href="/contact-us" 
              className="text-sm hover:text-primary transition-colors hidden lg:block cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                navigate('/contact-us');
              }}
            >
              Contact Us
            </a>
            
            <a 
              href="#faq" 
              className="text-sm hover:text-primary transition-colors hidden lg:block"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('faq');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              FAQ
            </a>
            
            <a 
              href="#offers" 
              className="text-sm hover:text-primary transition-colors hidden lg:block"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('offers');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Offers
            </a>
            
            <a 
              href="#reviews" 
              className="text-sm hover:text-primary transition-colors hidden lg:block"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('reviews');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Reviews
            </a>
            
            <a href="#terms" className="text-sm hover:text-primary transition-colors hidden lg:block">
              Terms
            </a>
            
            <a href="#privacy" className="text-sm hover:text-primary transition-colors hidden lg:block">
              Privacy
            </a>

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
          <div className="md:hidden mt-3 pb-3 border-t border-white/20 bg-black/80 backdrop-blur-md rounded-lg">
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
              <a 
                href="/contact-us" 
                className="text-sm hover:text-primary transition-colors py-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/contact-us');
                  setMobileMenuOpen(false);
                }}
              >
                Contact Us
              </a>
              <a 
                href="#faq" 
                className="text-sm hover:text-primary transition-colors py-2"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('faq');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  setMobileMenuOpen(false);
                }}
              >
                FAQ
              </a>
              <a 
                href="#offers" 
                className="text-sm hover:text-primary transition-colors py-2"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('offers');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  setMobileMenuOpen(false);
                }}
              >
                Offers
              </a>
              <a 
                href="#reviews" 
                className="text-sm hover:text-primary transition-colors py-2"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('reviews');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  setMobileMenuOpen(false);
                }}
              >
                Reviews
              </a>
              <a href="#terms" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Terms
              </a>
              <a href="#privacy" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Privacy
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
