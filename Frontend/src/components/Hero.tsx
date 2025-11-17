import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Login from "./Login";
import Register from "./Register";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Calendar, Settings, ArrowRight, CheckCircle2, Sparkles, LogOut } from "lucide-react";

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
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
            filter: 'brightness(0.5) drop-shadow(0px 0px 20px rgba(255, 0, 0, 0.2))',
            opacity: currentImageIndex === index ? 1 : 0,
            zIndex: currentImageIndex === index ? 1 : 0
          }}
        ></div>
      ))}
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-transparent z-[2]"></div>
      
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
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-[4] h-full flex items-center pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 lg:gap-16 items-start w-full">
          {/* Left side - Text content */}
          <div 
            className="relative text-white max-w-3xl pt-4 md:pt-8 px-6 md:px-8 py-8 md:py-10 rounded-lg"
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

          {/* Right side - Login/Register Form or Welcome Section */}
          <div className="w-full md:w-[540px]">
            <div className="hero-auth-card w-full">
              {isAuthenticated ? (
                // Welcome Section for Logged-in Users
                <div className="welcome-section w-full bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_60px_rgba(255,81,47,0.2),0_0_100px_rgba(221,36,118,0.15)] rounded-3xl p-8 relative">
                {/* Welcome Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/50 to-red-500/50 rounded-full blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full p-3 border-2 border-white/20">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                    Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
                  </h2>
                  <p className="text-white/80 text-sm">
                    Ready to take care of your vehicle?
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={() => navigate('/my-services')}
                    className="w-full h-14 text-white text-base font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #FF512F 0%, #DD2476 51%, #FF512F 100%)',
                      backgroundSize: '200% auto',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundPosition = 'right center';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundPosition = 'left center';
                    }}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    My Services
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button
                    onClick={() => navigate('/services')}
                    variant="outline"
                    className="w-full h-12 text-white border-white/30 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Service
                  </Button>
                </div>

                {/* Features Highlight */}
                <div className="border-t border-white/10 pt-6">
                  <p className="text-white/70 text-xs font-medium mb-3 uppercase tracking-wider">Quick Access</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Track your service requests</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>View service history</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Manage your vehicles</span>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate('/profile')}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-white border-white/30 bg-white/5 hover:bg-white/10 rounded-lg"
                    >
                      <Settings className="w-4 h-4 mr-1.5" />
                      Edit Profile
                    </Button>
                    <Button
                      onClick={async () => {
                        await logout();
                        navigate('/');
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-white border-white/30 bg-white/5 hover:bg-white/10 rounded-lg"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Login/Register Form for Non-authenticated Users
              <>
                {!showRegisterForm ? (
                  <Login 
                    onSwitchToRegister={() => setShowRegisterForm(true)} 
                  />
                ) : (
                  <Register 
                    onSwitchToLogin={() => setShowRegisterForm(false)}
                  />
                )}
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
