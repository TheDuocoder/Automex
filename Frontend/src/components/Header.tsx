import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, User, LogOut, Settings, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Determine if header should be transparent (home page) or solid (other pages)
  const isTransparent = location.pathname === '/';
  
  return (
    <header className={`${isTransparent ? 'bg-transparent absolute' : 'bg-white shadow-md relative'} text-${isTransparent ? 'white' : 'gray-900'} py-3 md:py-4 lg:py-5 ${isTransparent ? 'top-0 left-0 right-0' : ''} z-50`}>
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
              className={`text-sm hover:text-primary transition-colors hidden lg:block ${!isTransparent ? 'text-gray-700' : ''}`}
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
              className={`text-sm hover:text-primary transition-colors hidden lg:block cursor-pointer ${!isTransparent ? 'text-gray-700' : ''}`}
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

            {/* Services Link (if authenticated) */}
            {isAuthenticated && (
              <a 
                href="/services" 
                className="text-sm hover:text-primary transition-colors hidden lg:block cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/services');
                }}
              >
                Services
              </a>
            )}

            {/* Profile Menu (if authenticated) */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`hidden lg:flex items-center gap-2 ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'} h-9 px-3`}
                  >
                    <div className={`h-8 w-8 rounded-full ${isTransparent ? 'bg-white/20' : 'bg-primary/10'} flex items-center justify-center`}>
                      <User className={`h-5 w-5 ${isTransparent ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <span className="text-sm font-medium">
                      {user?.full_name || user?.email?.split('@')[0] || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      {user?.role && (
                        <p className="text-xs leading-none text-primary mt-1">
                          Role: {user.role.name}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/services')}
                    className="cursor-pointer"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>My Services</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Login Button (if not authenticated)
              <Button
                onClick={() => navigate('/')}
                className={`hidden lg:flex bg-primary hover:bg-primary/90 ${isTransparent ? 'text-white' : 'text-white'} h-9 px-4`}
              >
                Login
              </Button>
            )}

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
              {isAuthenticated && (
                <>
                  <a 
                    href="/services" 
                    className="text-sm hover:text-primary transition-colors py-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/services');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Services
                  </a>
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="px-2 py-1 text-xs text-white/70">
                      {user?.full_name || user?.email}
                    </div>
                    <button
                      onClick={async () => {
                        await handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-sm hover:text-primary transition-colors py-2 text-red-400 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
