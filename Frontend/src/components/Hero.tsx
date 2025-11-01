import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  
  // Array of car service background images
  const backgroundImages = [
    "/images/frontpage1.jpg", // Professional luxury car service center
    "/images/frontpage2.jpg", // Professional luxury car service center
    "/images/automexfrontpage3.jpg" // Professional luxury car service center
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

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Background Images - Full width with fade transition */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: `url("${image}")`,
            filter: 'brightness(0.5)',
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
          <div className="relative text-white animate-fade-in max-w-3xl pt-4 md:pt-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-5 md:mb-7 leading-tight tracking-tight">
              Professional Car Service & Maintenance Excellence
            </h2>
            <p className="text-base md:text-lg lg:text-xl opacity-95 mb-8 md:mb-10 leading-relaxed max-w-2xl">
              Expert mechanics working with premium tools and genuine parts for your luxury vehicle. 
              We bring the service center to your doorstep with free pick-up and drop facility.
            </p>
            <div className="space-y-4 md:space-y-5 text-sm md:text-base lg:text-lg opacity-95 mb-10 md:mb-12">
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-primary text-xl md:text-2xl flex-shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">Certified Technicians with 10+ Years Experience</span>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-primary text-xl md:text-2xl flex-shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">100% Genuine Parts & Transparent Pricing</span>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <span className="text-primary text-xl md:text-2xl flex-shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">Real-Time Service Tracking</span>
              </div>
            </div>
            <div>
              <span className="inline-block bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-bold shadow-xl hover:bg-primary/90 transition-all">
                Crafted for Quality. Built on Trust
              </span>
            </div>
          </div>

          {/* Right side - Login/Register Form */}
          <div className="w-full md:w-auto animate-fade-in">
            {!showRegisterForm ? (
              <Login 
                onSwitchToRegister={() => setShowRegisterForm(true)} 
              />
            ) : (
              <Register 
                onSwitchToLogin={() => setShowRegisterForm(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
