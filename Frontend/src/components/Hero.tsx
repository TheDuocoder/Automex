import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Login from "./Login";
import Register from "./Register";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Calendar, Settings, ArrowRight, CheckCircle2, Sparkles, LogOut } from "lucide-react";

interface HeroProps {
  showLoginForm?: boolean;
  onCloseLogin?: () => void;
}

const Hero = ({ showLoginForm = false, onCloseLogin }: HeroProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [localShowLoginForm, setLocalShowLoginForm] = useState(showLoginForm);
  const heroRef = useRef<HTMLElement | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Sync with prop changes
  useEffect(() => {
    setLocalShowLoginForm(showLoginForm);
  }, [showLoginForm]);
  
  // Array of car service background images
  const backgroundImages = [
    "/images/Landing_page_images/frontpage1.jpg", // Professional luxury car service center
    "/images/Landing_page_images/frontpage2.jpg", // Professional luxury car service center
    "/images/Landing_page_images/automexfrontpage3.jpg" // Professional luxury car service center
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

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(
        [
          ".hero-title",
          ".hero-description",
          ".hero-bullets-item",
          ".hero-cta",
          ".hero-auth-card"
        ],
        { autoAlpha: 0, y: 36 }
      );

      gsap.timeline({ defaults: { duration: 0.9, ease: "power3.out" } })
        .to(".hero-title", { autoAlpha: 1, y: 0 })
        .to(".hero-description", { autoAlpha: 1, y: 0 }, "-=0.6")
        .to(".hero-bullets-item", { autoAlpha: 1, y: 0, stagger: 0.15 }, "-=0.55")
        .to(".hero-cta", { autoAlpha: 1, y: 0 }, "-=0.35")
        .to(".hero-auth-card", { autoAlpha: 1, y: 0 }, "-=0.6");
      
      // Animate welcome section elements if authenticated
      if (isAuthenticated) {
        gsap.set(".welcome-section > *", { autoAlpha: 0, y: 20 });
        gsap.to(".welcome-section > *", {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.3
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!heroRef.current) return;

    const activeBackground = heroRef.current.querySelector<HTMLDivElement>(
      `.hero-bg[data-bg-index="${currentImageIndex}"]`
    );

    if (!activeBackground) return;

    const animation = gsap.fromTo(
      activeBackground,
      { scale: 1.05 },
      { scale: 1, duration: 1.2, ease: "power3.out" }
    );

    return () => {
      animation.kill();
    };
  }, [currentImageIndex]);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-white">
      {/* Background Images - Full width with fade transition */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className="hero-bg absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          data-bg-index={index}
          style={{
            backgroundImage: `url("${image}")`,
            filter: 'brightness(0.5)',
            opacity: currentImageIndex === index ? 1 : 0,
            zIndex: currentImageIndex === index ? 1 : 0
          }}
        ></div>
      ))}
      
      {/* Enhanced Overlay - Vertical gradient + Deep vignette */}
      <div 
        className="absolute inset-0 z-[2]"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%),
            linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 100%),
            linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)
          `
        }}
      ></div>
      
      {/* Image Indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-[3] flex gap-2">
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
      
      {/* Minimal Premium Scroll Indicator - Lower Right - Only visible when not authenticated and login form not open */}
      {!isAuthenticated && !localShowLoginForm && (
        <div className="absolute bottom-20 md:bottom-24 right-8 md:right-16 lg:right-20 z-[5] flex flex-col items-center gap-2 cursor-pointer group">
          {/* Arrow with Glow */}
          <div className="relative animate-bounce">
            {/* Neon Red Glow */}
            <div className="absolute inset-0 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300" 
                 style={{
                   background: 'radial-gradient(circle, rgba(239, 68, 68, 0.7) 0%, transparent 70%)',
                 }}>
            </div>
            
            {/* Arrow Icon */}
            <svg 
              className="w-7 h-7 md:w-9 md:h-9 text-white relative z-10 transition-all duration-300 group-hover:translate-y-1 group-hover:scale-110" 
              fill="none" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </div>
          
          {/* Text */}
          <span className="text-white text-[9px] md:text-[10px] font-bold tracking-[0.25em] uppercase transition-all duration-300 group-hover:tracking-[0.3em]"
                style={{ 
                  fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                }}>
            Scroll to Explore
          </span>
        </div>
      )}
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-[4] h-full flex items-center pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 lg:gap-16 items-start w-full">
          {/* Left side - Text content */}
          <div 
            className="relative text-white max-w-3xl pt-4 md:pt-8 px-6 md:px-8 py-8 md:py-10 rounded-lg -ml-4 md:-ml-8 lg:-ml-12"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.15), transparent)',
              textShadow: '0 2px 6px rgba(0,0,0,0.45)'
            }}
          >
            <h2 className="hero-title text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-5 md:mb-7 leading-tight tracking-tight">
              Premium Car Service & Trusted Maintenance Excellence
            </h2>
            <p className="hero-description text-base md:text-lg lg:text-xl opacity-95 mb-8 md:mb-10 leading-relaxed max-w-2xl">
              Expert mechanics working with premium tools and genuine parts for your luxury vehicle. 
              We bring the service center to your doorstep with free pick-up and drop facility.
            </p>
            <div className="space-y-4 md:space-y-5 text-sm md:text-base lg:text-lg opacity-95 mb-10 md:mb-12">
              <div className="hero-bullets-item flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 mt-0.5 text-2xl md:text-3xl font-black" style={{color: '#22C55E'}}>✓</span>
                <span className="leading-relaxed">Certified Technicians with 10+ Years Experience</span>
              </div>
              <div className="hero-bullets-item flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 mt-0.5 text-2xl md:text-3xl font-black" style={{color: '#22C55E'}}>✓</span>
                <span className="leading-relaxed">100% Genuine Parts & Transparent Pricing</span>
              </div>
              <div className="hero-bullets-item flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 mt-0.5 text-2xl md:text-3xl font-black" style={{color: '#22C55E'}}>✓</span>
                <span className="leading-relaxed">Real-Time Service Tracking</span>
              </div>
            </div>
            <div>
              <span 
                className="hero-cta inline-block text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-bold shadow-xl transition-all cursor-pointer" 
                style={{background: 'linear-gradient(90deg, #ff3d3d, #ff6a45)'}}
                onMouseEnter={(e) => (e.target as HTMLElement).style.background = 'linear-gradient(90deg, #e63535, #e65a3d)'} 
                onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'linear-gradient(90deg, #ff3d3d, #ff6a45)'}
              >
                Crafted for Quality. Built on Trust
              </span>
            </div>
          </div>

          {/* Right side - Welcome Section when authenticated, Login/Register when not authenticated */}
          {isAuthenticated ? (
            <div className="w-full md:w-[480px]">
              <div className="hero-auth-card w-full">
                {/* Welcome Section for Logged-in Users */}
                <div className="welcome-section w-full bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_60px_rgba(255,81,47,0.2),0_0_100px_rgba(221,36,118,0.15)] rounded-3xl p-5 relative scale-90 origin-top">
                  {/* Welcome Header */}
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-3 -mt-2">
                    <div className="relative">
                      {/* White glow background */}
                      <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-110"></div>
                      
                      {/* Logo */}
                      <img 
                        src="/images/Automex_icon/AUTOMEX_logo.png" 
                        alt="AutoMex"
                        className="relative h-40 w-auto object-contain drop-shadow-[0_8px_32px_rgba(255,255,255,0.3)]"
                        style={{
                          filter: 'drop-shadow(0 8px 32px rgba(255,255,255,0.3))',
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "/images/Landing_page_images/Red_Automex.png";
                        }}
                      />
                      
                      {/* Subtle reflection/bottom fade */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05))',
                          transform: 'scaleY(-1)',
                          opacity: 0.4,
                        }}
                      ></div>
                    </div>
                  </div>
                  <h2 
                    className="text-3xl mb-2"
                    style={{
                      fontWeight: 900,
                      letterSpacing: '-0.5px',
                      background: 'linear-gradient(90deg, #fff, #d9d9d9)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Welcome back, {user?.full_name?.split(' ')[0]?.charAt(0).toUpperCase() + user?.full_name?.split(' ')[0]?.slice(1).toLowerCase() || 'User'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    Ready to take care of your vehicle?
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={() => navigate('/my-services')}
                    className="w-full h-16 text-white text-lg font-bold transition-all duration-300 group relative overflow-hidden"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
                      borderRadius: '20px',
                      boxShadow: '0 6px 18px rgba(255, 79, 87, 0.35)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 79, 87, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(255, 79, 87, 0.35)';
                    }}
                  >
                    {/* Ripple effect on hover */}
                    <span 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1s_ease-in-out] pointer-events-none"
                      style={{
                        transform: 'translateX(-100%)',
                      }}
                    ></span>
                    <ShoppingBag className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">My Services</span>
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform relative z-10" />
                  </Button>

                  <Button
                    onClick={() => navigate('/services')}
                    className="w-full h-16 text-white text-lg font-bold transition-all duration-300 group relative overflow-hidden"
                    style={{
                      border: '1px solid rgba(255,122,0,0.4)',
                      background: 'linear-gradient(45deg, #FF7A00 0%, #FF3B30 100%)',
                      borderRadius: '20px',
                      boxShadow: '0 0 25px rgba(255,122,0,0.4), 0 6px 18px rgba(255,59,48,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(45deg, #FF8800 0%, #FF2020 100%)';
                      e.currentTarget.style.boxShadow = '0 0 35px rgba(255,122,0,0.6), 0 10px 30px rgba(255,59,48,0.5), inset 0 1px 0 rgba(255,255,255,0.3)';
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(45deg, #FF7A00 0%, #FF3B30 100%)';
                      e.currentTarget.style.boxShadow = '0 0 25px rgba(255,122,0,0.4), 0 6px 18px rgba(255,59,48,0.35), inset 0 1px 0 rgba(255,255,255,0.2)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                  >
                    {/* Glossy overlay effect */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
                        borderRadius: '20px 20px 0 0',
                      }}
                    />
                    <Calendar className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Schedule Service</span>
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform relative z-10" />
                  </Button>
                </div>

                {/* Features Highlight */}
                <div className="pt-3">
                  {/* Divider with title */}
                  <div className="flex items-center mb-3">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <p className="text-white/70 text-xs font-medium uppercase tracking-wider px-4">Quick Access</p>
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Track your service in real time</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Manage & View service history</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Free drop step pick up</span>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate('/profile')}
                      className="flex-1 text-white h-12 font-semibold transition-all duration-250"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '14px',
                        padding: '14px 26px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.35)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      onClick={async () => {
                        await logout();
                        navigate('/');
                      }}
                      className="flex-1 text-white h-12 font-semibold transition-all duration-250"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '14px',
                        padding: '14px 26px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.35)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
                </div>
              </div>
            </div>
          ) : (
            // Login/Register Form for Non-authenticated Users - Show when login button is clicked
            <div className="w-full md:w-[480px]">
              <div className="hero-auth-card w-full">
                {localShowLoginForm && !showRegisterForm ? (
                  <Login 
                    onClose={onCloseLogin}
                    onSwitchToRegister={() => setShowRegisterForm(true)} 
                  />
                ) : showRegisterForm ? (
                  <Register 
                    onClose={() => setShowRegisterForm(false)}
                    onSwitchToLogin={() => {
                      setShowRegisterForm(false);
                      setLocalShowLoginForm(true);
                    }}
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
