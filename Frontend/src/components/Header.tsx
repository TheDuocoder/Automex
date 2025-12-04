import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, User, LogOut, ShoppingBag } from "lucide-react";
import { useState, useLayoutEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import HelpDropdown from "@/components/HelpDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, isAuthenticated, logout } = useAuth();
  const navLinksRef = useRef<HTMLDivElement | null>(null);

  // Helper function to capitalize name properly
  const capitalizeName = (name: string | undefined) => {
    if (!name) return 'User';
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Determine if header should be transparent (home page and contact page) or solid (other pages)
  const isTransparent = location.pathname === '/' || location.pathname === '/contact-us';

  const headerPadding = isTransparent ? "py-0 md:py-1 lg:py-2" : "py-2 md:py-3 lg:py-4";

  // Same logo size for landing page and contact us page
  const logoHeights = isTransparent
    ? "h-20 md:h-24 lg:h-28" // Same size for landing page and contact us page
    : "h-20 md:h-24 lg:h-28"; // Standard size for other pages

  const navigationLinks: Array<
    | { label: string; type: "route"; href: string }
    | { label: string; type: "section"; target: string }
  > = [
      ...(location.pathname !== '/services' && location.pathname !== '/my-services' && location.pathname !== '/profile' && !location.pathname.startsWith('/booking') ? [{ label: "About Us", type: "section", target: "about-us" } as const] : []),
      ...(location.pathname !== '/services' && location.pathname !== '/my-services' && location.pathname !== '/profile' && !location.pathname.startsWith('/booking') ? [{ label: "Services", type: "route", href: "/services" } as const] : []),
      ...(location.pathname !== '/services' && location.pathname !== '/my-services' && location.pathname !== '/profile' && !location.pathname.startsWith('/booking') ? [{ label: "Contact Us", type: "route", href: "/contact-us" } as const] : []),
    ];

  useLayoutEffect(() => {
    // Hover effects disabled
    return () => {};
  }, [isTransparent]);

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
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo - Left Side */}
          <div
            className={cn(
              "flex items-center cursor-pointer flex-shrink-0 group",
              isTransparent && "mt-2 md:mt-3 lg:mt-4"
            )}
            onClick={() => navigate('/')}
          >
            <img
              src="/images/Automex_icon/AUTOMEX_logo.png"
              alt="AutoMex Logo"
              className={cn(
                "w-auto object-contain transition-all duration-300 ease-in-out",
                "group-hover:scale-105 group-hover:drop-shadow-[0_0_12px_rgba(205,0,0,0.4)]",
                "group-hover:rotate-1",
                logoHeights
              )}
              style={{
                filter: 'drop-shadow(0 0 0 transparent)',
                transition: 'all 0.3s ease-in-out'
              }}
              onError={(e) => {
                e.currentTarget.src = "/images/Landing_page_images/AUTOMEX.png";
              }}
            />
          </div>

          {/* Navigation Links - Center (hidden when authenticated on mobile, and hidden on contact-us and my-services pages) */}
          {location.pathname !== '/contact-us' && location.pathname !== '/my-services' && (
            <motion.div
              ref={navLinksRef}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cn(
                "hidden lg:flex items-center gap-4 flex-shrink-0",
                isTransparent && "-mt-2"
              )}
              style={{
                position: 'absolute',
                right: isAuthenticated ? '7rem' : '2rem',
                top: isAuthenticated ? '35%' : '40%',
                transform: 'translateY(-50%)',
              }}
            >
              {navigationLinks.map((item) => (
                <motion.a
                  key={item.label}
                  href={
                    item.type === "route"
                      ? item.href
                      : `/#${item.target}`
                  }
                  initial={false}
                  className="nav-button-rainbow nav-link relative lg:flex items-center justify-center overflow-hidden rounded-full px-6 py-2.5 text-sm xl:text-base font-bold tracking-wide text-white transition-all duration-300"
                  style={{
                    background: 'rgba(20, 20, 20, 0.65)',
                    backdropFilter: 'blur(10px)',
                    minWidth: '120px',
                  }}
                  onClick={(e) => {
                    if (item.type === "route") {
                      e.preventDefault();
                      navigate(item.href);
                      return;
                    }

                    if (location.pathname === '/') {
                      e.preventDefault();
                      const element = document.getElementById(item.target);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }
                  }}
                >
                  <span className="nav-link-label relative z-20 select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    {item.label}
                  </span>
                  <span 
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.15), transparent 70%)',
                    }}
                  ></span>
                  <span
                    className="nav-link-light pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300"
                    style={{
                      background: 'conic-gradient(from var(--angle, 0deg), rgba(239,68,68,0) 0deg, rgba(239,68,68,0.7) 90deg, rgba(59,130,246,0.6) 180deg, rgba(168,85,247,0.6) 270deg, rgba(239,68,68,0) 360deg)',
                      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 1px))',
                      mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 1px))',
                      filter: 'blur(4px)',
                    }}
                  ></span>
                </motion.a>
              ))}
              {/* Login Button - Show when not authenticated on landing page */}
              {!isAuthenticated && isHomePage && (
                <motion.button
                  initial={false}
                  onClick={() => onLoginClick?.()}
                  className="nav-button-rainbow nav-link relative lg:flex items-center justify-center overflow-hidden rounded-full px-6 py-2.5 text-sm xl:text-base font-bold tracking-wide text-white transition-all duration-300"
                  style={{
                    background: 'rgba(20, 20, 20, 0.65)',
                    backdropFilter: 'blur(10px)',
                    minWidth: '120px',
                  }}
                >
                  <span className="nav-link-label relative z-20 select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    Login
                  </span>
                  <span 
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.15), transparent 70%)',
                    }}
                  ></span>
                  <span
                    className="nav-link-light pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300"
                    style={{
                      background: 'conic-gradient(from var(--angle, 0deg), rgba(239,68,68,0) 0deg, rgba(239,68,68,0.7) 90deg, rgba(59,130,246,0.6) 180deg, rgba(168,85,247,0.6) 270deg, rgba(239,68,68,0) 360deg)',
                      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 1px))',
                      mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 1px))',
                      filter: 'blur(4px)',
                    }}
                  ></span>
                </motion.button>
              )}
            </motion.div>
          )}

          {/* User Info - Right Side */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn("flex items-center gap-3 md:gap-4 lg:gap-6 flex-shrink-0", isTransparent && "-mt-2 md:-mt-4 lg:-mt-6")}
          >
            {/* Login Button - Show when not authenticated on services page */}
            {!isAuthenticated && location.pathname === '/services' && (
              <div className="nav-rainbow p-1 rounded-full">
                <Button
                  onClick={() => navigate('/', { state: { showAuth: true } })}
                  className="hidden lg:flex items-center gap-2 h-10 px-6 font-bold text-white transition-all duration-300 rounded-full"
                  style={{
                    background: 'rgba(20, 20, 20, 0.65)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                  }}
                >
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </div>
            )}
            {/* Help Dropdown - Show when authenticated on all pages except home */}
            {isAuthenticated && !isHomePage && (
              <div className="hidden lg:block">
                <HelpDropdown variant="light" />
              </div>
            )}
            {/* Profile Menu (if authenticated) - Hide on landing page */}
            {isAuthenticated && !isHomePage && (
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="nav-button-rainbow flex items-center gap-2 text-white hover:opacity-90 h-auto px-4 py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden group"
                      title={`Logged in as: ${capitalizeName(user?.full_name) || user?.email?.split('@')[0] || 'User'}`}
                      style={{
                        background: 'transparent',
                        backdropFilter: 'blur(10px)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Glossy Highlight */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[40%] pointer-events-none"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)',
                          borderRadius: '12px 12px 0 0',
                        }}
                      />

                      {user?.profile_picture_url ? (
                        <img
                          src={`${user.profile_picture_url}?v=${user.id || Date.now()}`}
                          alt={user?.full_name || 'User'}
                          className="h-8 w-8 rounded-full object-cover border-2 border-white/30 flex-shrink-0 relative z-10"
                          style={{
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                          }}
                          title={`${capitalizeName(user?.full_name) || user?.email?.split('@')[0] || 'User'}`}
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0 relative ${user?.profile_picture_url ? 'hidden' : ''}`}
                        style={{
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        }}
                        title={`${capitalizeName(user?.full_name) || user?.email?.split('@')[0] || 'User'}`}
                      >
                        <User className="h-5 w-5 text-white relative z-10" />
                      </div>
                      <span className="text-sm font-medium whitespace-nowrap relative z-10">
                        {capitalizeName(user?.full_name) || user?.email?.split('@')[0] || 'User'}
                      </span>
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3">
                        {user?.profile_picture_url ? (
                          <img
                            src={`${user.profile_picture_url}?v=${user.id || Date.now()}`}
                            alt={user?.full_name || 'User'}
                            className="h-10 w-10 rounded-full object-cover border border-primary/30"
                            onError={(e) => {
                              // Fallback to initial if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold ${user?.profile_picture_url ? 'hidden' : ''}`}
                        >
                          {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {capitalizeName(user?.full_name)}
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
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate('/my-services')}
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
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              title={isAuthenticated ? `Menu - ${capitalizeName(user?.full_name) || user?.email?.split('@')[0] || 'User'}` : 'Toggle menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-white/20 bg-black/80 backdrop-blur-md rounded-lg">
            <nav className="flex flex-col space-y-3 pt-3">
              {/* Main Navigation - Hidden on My Services page */}
              {location.pathname !== '/my-services' && (
                <>
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
                </>
              )}
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
                  <a
                    href="/my-services"
                    className="text-sm text-white hover-automex py-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/my-services');
                      setMobileMenuOpen(false);
                    }}
                  >
                    My Services
                  </a>
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="px-2 py-1 text-xs text-white/70">
                      {capitalizeName(user?.full_name) || user?.email}
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
