import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, User, LogOut, Settings, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
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
  
  const headerPadding = isTransparent ? "py-0 md:py-1 lg:py-2" : "py-2 md:py-3 lg:py-4";
  const logoHeights = isTransparent ? "h-24 md:h-32 lg:h-40" : "h-20 md:h-24 lg:h-28";

  return (
    <header
      className={cn(
        "text-white z-50",
        headerPadding,
        isTransparent
          ? "bg-transparent absolute top-0 left-0 right-0"
          : "bg-black shadow-md relative"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-6">
            <div className={cn("flex items-center cursor-pointer", isTransparent && "-mt-2 md:-mt-3 lg:-mt-4")} onClick={() => navigate('/')}>
              <img 
                src="/images/Red_Automex.png" 
                alt="AutoMex Logo" 
                className={cn("w-auto object-contain", logoHeights)}
                onError={(e) => {
                  e.currentTarget.src = "/images/AUTOMEX.png";
                }}
              />
            </div>
          </div>

          <div className={cn("flex items-center gap-3 md:gap-4 lg:gap-6", isTransparent && "-mt-4 md:-mt-6 lg:-mt-8 md:mr-8 lg:mr-16")}>
            {/* Conditional Navigation - Individual links on landing page, Help dropdown on other pages */}
            {isTransparent ? (
              // Landing Page - Individual Navigation Links
              <>
                <a 
                  href="/services" 
                  className="text-sm text-white hover:text-red-500 hover:font-bold transition-all duration-200 hidden lg:block cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/services');
                  }}
                >
                  Services
                </a>
                
                <a 
                  href="#about-us" 
                  className="text-sm text-white hover:text-red-500 hover:font-bold transition-all duration-200 hidden lg:block"
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
                  className="text-sm text-white hover:text-red-500 hover:font-bold transition-all duration-200 hidden lg:block cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact-us');
                  }}
                >
                  Contact Us
                </a>
              </>
            ) : (
              // Other Pages - Help Dropdown
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm text-white hover-automex hidden lg:flex items-center gap-1">
                  Help
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuItem className="cursor-pointer">
                  <a 
                    href="#about-us" 
                    className="w-full text-gray-700 hover:text-gray-900"
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
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <a 
                    href="/contact-us" 
                    className="w-full text-gray-700 hover:text-gray-900"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/contact-us');
                    }}
                  >
                    Contact Us
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <a 
                    href="#faq" 
                    className="w-full text-gray-700 hover:text-gray-900"
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
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <a 
                    href="#offers" 
                    className="w-full text-gray-700 hover:text-gray-900"
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
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <a 
                    href="#reviews" 
                    className="w-full text-gray-700 hover:text-gray-900"
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
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <a 
                    href="#terms" 
                    className="w-full text-gray-700 hover:text-gray-900"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('terms');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    Terms
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <a 
                    href="#privacy" 
                    className="w-full text-gray-700 hover:text-gray-900"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('privacy');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    Privacy
                  </a>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <a 
                        href="/services" 
                        className="w-full text-gray-700 hover:text-gray-900"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/services');
                        }}
                      >
                        Services
                      </a>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <a 
                    href="#how-it-works" 
                    className="w-full text-gray-700 hover:text-gray-900"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('how-it-works');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    How It Works
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}

            {/* Profile Menu (if authenticated) */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden lg:flex items-center gap-2 text-white hover:bg-white/10 h-9 px-3"
                    title={`Logged in as: ${user?.full_name || user?.email?.split('@')[0] || 'User'}`}
                  >
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center" title={`${user?.full_name || user?.email?.split('@')[0] || 'User'}`}>
                      <User className="h-5 w-5 text-white" />
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
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              title={isAuthenticated ? `Menu - ${user?.full_name || user?.email?.split('@')[0] || 'User'}` : 'Toggle menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-white/20 bg-black/80 backdrop-blur-md rounded-lg">
            <nav className="flex flex-col space-y-3 pt-3">
              {/* Main Navigation */}
              <div className="text-xs text-white/70 mb-2 px-0">Navigation</div>
              <a 
                href="#about-us" 
                className="text-sm text-white hover-automex py-2"
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
                className="text-sm text-white hover-automex py-2 cursor-pointer"
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
                className="text-sm text-white hover-automex py-2"
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
                className="text-sm text-white hover-automex py-2"
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
                className="text-sm text-white hover-automex py-2"
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
              <a 
                href="#how-it-works" 
                className="text-sm text-white hover-automex py-2"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('how-it-works');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  setMobileMenuOpen(false);
                }}
              >
                How It Works
              </a>
              
              {/* Legal & Policies */}
              <div className="border-t border-white/20 mt-2 pt-2">
                <div className="text-xs text-white/70 mb-2 px-0">Legal & Policies</div>
                <a 
                  href="#terms" 
                  className="text-sm text-white hover-automex py-2" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('terms');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    setMobileMenuOpen(false);
                  }}
                >
                  Terms
                </a>
                <a 
                  href="#privacy" 
                  className="text-sm text-white hover-automex py-2" 
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('privacy');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    setMobileMenuOpen(false);
                  }}
                >
                  Privacy
                </a>
              </div>
              {isAuthenticated && (
                <>
                  <a 
                    href="/services" 
                    className="text-sm text-white hover-automex py-2 cursor-pointer"
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
                      className="text-sm text-white hover-automex py-2 text-red-400 w-full text-left"
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
