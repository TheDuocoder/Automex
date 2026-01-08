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
  const heroRef = useRef<HTMLElement | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Do not show login form by default - only show when explicitly triggered
  const [localShowLoginForm, setLocalShowLoginForm] = useState(showLoginForm);

  // Sync with prop changes
  useEffect(() => {
    setLocalShowLoginForm(showLoginForm);
  }, [showLoginForm]);

  // Array of car service background images
  const backgroundImages = [
    "https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Landing_page_images/frontpage1.jpg", // Professional luxury car service center
    "https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Landing_page_images/frontpage2.jpg", // Professional luxury car service center
    "https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Landing_page_images/automexfrontpage3.jpg" // Professional luxury car service center
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
      // Set initial states for all elements
      gsap.set(".hero-title", { autoAlpha: 0, y: 30 });
      gsap.set(".hero-description", { autoAlpha: 0, y: 25 });
      gsap.set(".hero-bullets-item", { autoAlpha: 0, x: -20 });
      gsap.set(".hero-cta", { autoAlpha: 0, scale: 1.1 });
      gsap.set(".hero-auth-card", { autoAlpha: 0, y: 20 });
      gsap.set(".nav-button", { autoAlpha: 0, y: -10 });

      // Create premium entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "cubic-bezier(0.22, 1, 0.36, 1)" } });

      // Navigation buttons fade + slide down
      tl.to(".nav-button", {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1
      }, 0.2);

      // Hero heading with soft fade-in + upward motion
      tl.to(".hero-title", {
        autoAlpha: 1,
        y: 0,
        duration: 1.2
      }, 0.3);

      // Subtitle with delayed fade-in for staggered effect
      tl.to(".hero-description", {
        autoAlpha: 1,
        y: 0,
        duration: 1.0
      }, 0.6);

      // Bullet points one-by-one with left slide-in and fade
      tl.to(".hero-bullets-item", {
        autoAlpha: 1,
        x: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power2.out"
      }, 0.9);

      // CTA button with spring scale effect
      tl.to(".hero-cta", {
        autoAlpha: 1,
        scale: 1,
        duration: 1.0,
        ease: "elastic.out(1, 0.5)"
      }, 1.3);

      // Auth card fade in
      tl.to(".hero-auth-card", {
        autoAlpha: 1,
        y: 0,
        duration: 0.9
      }, 1.1);

      // Animate welcome section elements if authenticated
      if (isAuthenticated) {
        gsap.set(".welcome-section > *", { autoAlpha: 0, y: 20 });
        gsap.to(".welcome-section > *", {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.5
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

    // Slow, smooth zoom-in for premium feel (2.5 seconds)
    const animation = gsap.fromTo(
      activeBackground,
      { scale: 1.08 },
      {
        scale: 1,
        duration: 2.5,
        ease: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
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

      {/* 3D Glass Social Media Icons - Bottom Left */}
      <div className="absolute bottom-8 md:bottom-12 left-16 md:left-24 lg:left-32 z-[100] flex items-center gap-8">
        {/* Instagram Icon */}
        <a
          href="https://www.instagram.com/automex__/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative cursor-pointer z-[100]"
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="w-7 h-7 rounded-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, rgba(64, 93, 230, 0.15), rgba(88, 81, 219, 0.15), rgba(131, 58, 180, 0.15), rgba(193, 53, 132, 0.15), rgba(225, 48, 108, 0.15), rgba(253, 29, 29, 0.15), rgba(245, 96, 64, 0.15), rgba(252, 175, 69, 0.15))',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(131, 58, 180, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
              perspective: '1000px',
              transform: 'rotateX(5deg) rotateY(-5deg)',
            }}
          >
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #FCAF45)',
                }}
              />
            </div>
            <svg className="w-full h-full p-1.5 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#405DE6" />
                  <stop offset="20%" stopColor="#833AB4" />
                  <stop offset="50%" stopColor="#C13584" />
                  <stop offset="70%" stopColor="#E1306C" />
                  <stop offset="100%" stopColor="#FD1D1D" />
                </linearGradient>
              </defs>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                fill="url(#instagram-gradient)"
                className="group-hover:fill-white transition-all duration-300"
              />
            </svg>
          </div>
        </a>

        {/* Facebook Icon */}
        <a
          href="https://www.facebook.com/profile.php?id=61584491903750"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative cursor-pointer z-[100]"
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="w-7 h-7 rounded-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, rgba(8, 102, 255, 0.15), rgba(10, 124, 255, 0.15), rgba(24, 119, 242, 0.15))',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(24, 119, 242, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
              perspective: '1000px',
              transform: 'rotateX(5deg) rotateY(-5deg)',
            }}
          >
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(45deg, #0866FF, #0A7CFF, #1877F2)',
                }}
              />
            </div>
            <svg className="w-full h-full p-1.5 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                fill="#1877F2"
                className="group-hover:fill-white transition-all duration-300"
              />
            </svg>
          </div>
        </a>

        {/* X (Twitter) Icon */}
        <a
          href="https://x.com/Automex__"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative cursor-pointer z-[100]"
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="w-7 h-7 rounded-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 pointer-events-none"
            style={{
              background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.15), rgba(20, 23, 26, 0.15), rgba(28, 28, 28, 0.15))',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
              perspective: '1000px',
              transform: 'rotateX(5deg) rotateY(-5deg)',
            }}
          >
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(45deg, #000000, #14171A, #1C1C1C)',
                }}
              />
            </div>
            <svg className="w-full h-full p-1.5 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                fill="#FFFFFF"
                className="group-hover:fill-white transition-all duration-300"
              />
            </svg>
          </div>
        </a>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-[3] hidden md:flex gap-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index
              ? 'bg-primary w-8'
              : 'bg-white/50 hover:bg-white/75'
              }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Minimal Premium Scroll Indicator - Lower Right - Only visible when not authenticated and login form not open */}
      {!isAuthenticated && !localShowLoginForm && !showRegisterForm && (
        <div className="absolute bottom-8 md:bottom-12 right-8 md:right-16 lg:right-20 z-[5] hidden md:flex flex-col items-center gap-2 cursor-pointer group">
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
            className="relative text-white max-w-3xl pt-4 md:pt-8 px-6 md:px-8 py-8 md:py-10 rounded-lg -ml-4 md:-ml-8 lg:-ml-12 order-2 md:order-1"
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
                <span className="flex-shrink-0 mt-0.5 text-2xl md:text-3xl font-black" style={{ color: '#22C55E' }}>✓</span>
                <span className="leading-relaxed">Certified Technicians with 10+ Years Experience</span>
              </div>
              <div className="hero-bullets-item flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 mt-0.5 text-2xl md:text-3xl font-black" style={{ color: '#22C55E' }}>✓</span>
                <span className="leading-relaxed">100% Genuine Parts & Transparent Pricing</span>
              </div>
              <div className="hero-bullets-item flex items-start gap-3 md:gap-4">
                <span className="flex-shrink-0 mt-0.5 text-2xl md:text-3xl font-black" style={{ color: '#22C55E' }}>✓</span>
                <span className="leading-relaxed">Real-Time Service Tracking</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="hero-cta inline-block text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-bold shadow-xl transition-all cursor-pointer"
                onClick={() => navigate('/services')}
                style={{ background: 'linear-gradient(90deg, #ff3d3d, #ff6a45)' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #e63535, #e65a3d)'}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #ff3d3d, #ff6a45)'}
              >
                <span className="md:hidden">Our Services</span>
                <span className="hidden md:inline">Crafted for Quality. Built on Trust</span>
              </span>

              {!isAuthenticated && (
                <div className="flex items-center gap-2">
                  <span
                    className="hero-cta md:hidden inline-block text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl transition-all cursor-pointer"
                    onClick={() => setLocalShowLoginForm(true)}
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    Login
                  </span>


                </div>
              )}
            </div>
          </div>

          {/* Right side - Welcome Section when authenticated, Login/Register when not authenticated */}
          {isAuthenticated ? (
            <div className="hidden md:block w-full md:w-[480px] order-1 md:order-2">
              <div className="hero-auth-card w-full">
                {/* Welcome Section for Logged-in Users */}
                <div className="welcome-section w-full bg-black/60 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_60px_rgba(255,81,47,0.2),0_0_100px_rgba(221,36,118,0.15)] rounded-3xl p-5 relative scale-90 origin-top">
                  {/* Welcome Header */}
                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-3 -mt-2">
                      {user?.profile_picture_url ? (
                        // Show user profile picture if available
                        <div className="relative">
                          {/* White glow background */}
                          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-110"></div>

                          {/* Profile Picture */}
                          <img
                            src={`${user.profile_picture_url}?v=${user.id || Date.now()}`}
                            alt={user?.full_name || 'User'}
                            className="relative h-32 w-32 rounded-full object-cover border-4 border-white/30 drop-shadow-[0_8px_32px_rgba(255,255,255,0.3)]"
                            style={{
                              filter: 'drop-shadow(0 8px 32px rgba(255,255,255,0.3))',
                            }}
                            onError={(e) => {
                              // Fallback to logo if image fails
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />

                          {/* Fallback to logo if profile picture fails */}
                          <div className="hidden relative">
                            <img
                              src="https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Automex_icon/AUTOMEX_logo.png"
                              alt="AutoMex"
                              className="relative h-40 w-auto object-contain drop-shadow-[0_8px_32px_rgba(255,255,255,0.3)]"
                              style={{
                                filter: 'drop-shadow(0 8px 32px rgba(255,255,255,0.3))',
                              }}
                              onError={(e) => {
                                e.currentTarget.src = "https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Landing_page_images/Red_Automex.png";
                              }}
                            />
                          </div>

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
                      ) : (
                        // Show logo if no profile picture
                        <div className="relative">
                          {/* White glow background */}
                          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-110"></div>

                          {/* Logo */}
                          <img
                            src="https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Automex_icon/AUTOMEX_logo.png"
                            alt="AutoMex"
                            className="relative h-40 w-auto object-contain drop-shadow-[0_8px_32px_rgba(255,255,255,0.3)]"
                            style={{
                              filter: 'drop-shadow(0 8px 32px rgba(255,255,255,0.3))',
                            }}
                            onError={(e) => {
                              e.currentTarget.src = "https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Landing_page_images/Red_Automex.png";
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
                      )}
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
            // Login/Register Form for Non-authenticated Users - Only show when triggered
            localShowLoginForm || showRegisterForm ? (
              <div className="w-full md:w-[480px] order-1 md:order-2">
                <div className="hero-auth-card w-full">
                  {showRegisterForm ? (
                    <Register
                      onClose={() => {
                        setShowRegisterForm(false);
                        setLocalShowLoginForm(false);
                      }}
                      onSwitchToLogin={() => {
                        setShowRegisterForm(false);
                        setLocalShowLoginForm(true);
                      }}
                    />
                  ) : (
                    <Login
                      onClose={() => {
                        setLocalShowLoginForm(false);
                        setShowRegisterForm(false);
                        if (onCloseLogin) onCloseLogin();
                      }}
                      onSwitchToRegister={() => {
                        setShowRegisterForm(true);
                        setLocalShowLoginForm(false);
                      }}
                    />
                  )}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
