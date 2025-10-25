import { ChevronLeft, ChevronRight, Star, Shield, Clock, CheckCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import batteryIcon from "@/assets/service-battery.png";
import tyreIcon from "@/assets/service-tyres.png";
import { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

// Service-specific image fallbacks to guarantee a valid photo renders
const imageFallbacks: Record<string, string[]> = {
  Batteries: [
    // Prefer local vector as immediate fallback if provided photo is missing
    "/images/car-battery.svg",
    // Multiple brand-neutral car battery photos (try in order)
    "https://images.pexels.com/photos/6873329/pexels-photo-6873329.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/6873330/pexels-photo-6873330.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/6873328/pexels-photo-6873328.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ],
};

const tabs = [
  "Our Services",
  "Curated Custom Service",
  "Summer Services",
  "How AutoMex Works",
  "Rating & Reviews",
  "FAQ",
];

const carServices = [
  {
    title: "Premium Car Services",
    image: "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Specialized maintenance for luxury vehicles including BMW, Mercedes-Benz, and Audi. Our certified technicians use advanced diagnostic tools and genuine parts to ensure premium performance. Services include engine diagnostics, transmission service, brake systems, and electronic systems calibration."
  },
  {
    title: "AC Service & Repair",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80",
    description: "Expert AC system diagnosis, repair, and maintenance. We handle gas refilling, component replacement, and ensure optimal cooling performance for your comfort."
  },
  {
    title: "Batteries",
    // Use the provided local photo placed in public/images
    image: "/images/battery-hero.jpg",
    isIcon: false,
    description: "Complete battery solutions including health check, charging system diagnosis, replacement with genuine batteries, and warranty support for all car models."
  },
  {
    title: "Tyres & Wheel Care",
    // Local icon to guarantee visibility
    image: tyreIcon as unknown as string,
    isIcon: true,
    description: "Professional wheel alignment, balancing, rotation, and tyre replacement services. We ensure optimal tyre pressure and tread life for safe driving."
  },
  {
    title: "Denting & Painting",
    image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80",
    description: "Expert dent removal, scratch repair, and premium paint jobs. Our skilled technicians use advanced techniques and quality materials for a factory-like finish."
  },
  {
    title: "Detailing Services",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80",
    description: "Premium car detailing including paint correction, ceramic coating, interior deep cleaning, and exterior protection for that showroom-like appearance."
  },
  {
    title: "Car Spa & Cleaning",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80",
    description: "Thorough interior and exterior cleaning, steam wash, upholstery care, and protective coating. We restore your car's shine and freshness."
  },
  {
    title: "Car Inspections",
    image: "https://images.unsplash.com/photo-1493134799591-2c9eed26201a?auto=format&fit=crop&q=80",
    description: "Detailed 50-point inspection covering safety, performance, and compliance checks. Get a comprehensive report of your vehicle's condition.",
    isNew: true
  }
];

const summerServices = [
  {
    title: "Front Bumper Paint",
    description: "Professional paint service for your front bumper with premium quality materials",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80",
    price: "₹4,999",
    features: [
      "High-quality paint materials",
      "Color matching technology",
      "UV protection coating",
      "3-layer paint process"
    ]
  },
  {
    title: "Rubbing & Polishing",
    description: "Complete exterior polishing to restore your car's shine and protect the paint",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80",
    price: "₹2,499",
    features: [
      "Machine polishing",
      "Scratch removal",
      "Paint protection",
      "Mirror finish"
    ]
  },
  {
    title: "Deep All Round Spa",
    description: "Comprehensive car spa treatment for interior and exterior",
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80",
    price: "₹3,999",
    features: [
      "Deep interior cleaning",
      "Exterior detailing",
      "Engine bay cleaning",
      "Ceramic coating"
    ]
  },
  {
    title: "Periodic Service",
    description: "Complete summer checkup and maintenance service",
    image: "https://images.unsplash.com/photo-1632823551592-e161a42973e9?auto=format&fit=crop&q=80",
    price: "₹5,999",
    features: [
      "AC performance check",
      "Coolant top-up",
      "Battery health check",
      "Tire pressure optimization"
    ]
  }
];

const Navigation = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [apiActiveTab, setApiActiveTab] = useState("Our Services");

  useEffect(() => {
    if (!carouselApi) return;

    let intervalId: NodeJS.Timeout | null = null;

    const startAutoplay = () => {
      intervalId = setInterval(() => {
        carouselApi.scrollNext();
      }, 3000);
    };

    const stopAutoplay = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleMouseEnter = () => stopAutoplay();
    const handleMouseLeave = () => startAutoplay();

    const element = carouselApi.rootNode();
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    startAutoplay();

    return () => {
      stopAutoplay();
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [carouselApi]);
  
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for the sticky header

      // Find the section that is currently in view
      Object.entries(sectionRefs.current).forEach(([tabName, ref]) => {
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            onTabChange(tabName);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onTabChange]);

  const scrollToSection = (tabName: string) => {
    const section = sectionRefs.current[tabName];
    if (section) {
      const offset = section.offsetTop - 100; // Adjust for sticky header
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
      onTabChange(tabName);
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-sm sticky top-[28px] z-40 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-1 md:gap-4 overflow-x-auto scrollbar-hide py-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => scrollToSection(tab)}
                  className={`py-2 px-4 text-sm font-medium rounded-full transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-primary text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 text-gray-600 hover:text-gray-900"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <div>
        {/* Our Services Section */}
        <div 
          ref={el => sectionRefs.current["Our Services"] = el} 
          className="py-8 bg-gradient-to-b from-gray-50 to-white min-h-screen"
        >
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4">Premium Car Services in Bhubaneswar</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Specialized service center for luxury vehicles including BMW, Mercedes-Benz, and Audi. Our certified technicians provide comprehensive maintenance, 
                repairs, and premium care services using state-of-the-art equipment and genuine parts.
              </p>
              <div className="mt-6 max-w-4xl mx-auto">
                <Carousel 
                  className="w-full max-w-4xl mx-auto"
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  setApi={setCarouselApi}>
                  <CarouselContent>
                    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                      <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                        <img 
                          src="https://images.unsplash.com/photo-1633509817627-5a29634475af?auto=format&fit=crop&q=80" 
                          alt="Mercedes AMG"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-white text-xl font-semibold">Mercedes AMG</h3>
                            <p className="text-white/80 text-sm">Luxury Performance</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                      <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                        <img 
                          src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80" 
                          alt="BMW M4"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-white text-xl font-semibold">BMW M4</h3>
                            <p className="text-white/80 text-sm">Ultimate Driving Machine</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                      <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                        <img 
                          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80" 
                          alt="Audi RS"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-white text-xl font-semibold">Audi RS</h3>
                            <p className="text-white/80 text-sm">Vorsprung durch Technik</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                      <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                        <img 
                          src="https://images.unsplash.com/photo-1635944095210-23114a1fb7c0?auto=format&fit=crop&q=80" 
                          alt="Porsche 911"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-white text-xl font-semibold">Porsche 911</h3>
                            <p className="text-white/80 text-sm">Timeless Machine</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                    <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                      <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                        <img 
                          src="https://images.unsplash.com/photo-1632548260498-b7246fa466ea?auto=format&fit=crop&q=80" 
                          alt="Bentley"
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-white text-xl font-semibold">Bentley</h3>
                            <p className="text-white/80 text-sm">Extraordinary Journey</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious className="bg-white/80 hover:bg-white" />
                  <CarouselNext className="bg-white/80 hover:bg-white" />
                </Carousel>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {carServices.map((service, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-lg transition-all duration-300 bg-white relative overflow-hidden cursor-pointer w-full"
                >
                  {service.isNew && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                      New
                    </div>
                  )}
                  <div className="relative">
                    <div className="aspect-[16/12] overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className={`w-full h-full ${service.isIcon ? "object-contain p-6 bg-gray-50" : "object-cover"} transform group-hover:scale-105 transition-transform duration-300`}
                        data-fallback-index="0"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          const name = service.title;
                          const list = imageFallbacks[name] || [];
                          const current = Number(target.getAttribute("data-fallback-index") || 0);
                          if (current < list.length) {
                            target.setAttribute("data-fallback-index", String(current + 1));
                            target.src = list[current];
                          } else {
                            target.src = "/placeholder.svg";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-2">
                      <h3 className="font-semibold text-sm mb-1">{service.title}</h3>
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 hover:line-clamp-none transition-all duration-300">{service.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Value Propositions */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Quality Assurance</h3>
                <p className="text-gray-600 text-sm">Certified mechanics and genuine spare parts</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Timely Service</h3>
                <p className="text-gray-600 text-sm">On-time service delivery with live updates</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Best Pricing</h3>
                <p className="text-gray-600 text-sm">Competitive prices with no hidden charges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summer Services Section */}
        <div 
          ref={el => sectionRefs.current["Summer Services"] = el}
          className="py-8 bg-gradient-to-b from-sky-50 to-white min-h-screen"
        >
          <div className="container mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Get Summer Ready With AutoMex</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Keep your car in perfect condition this summer with our specialized services
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {summerServices.map((service, index) => (
                <Card 
                  key={index} 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-white font-semibold text-xl">
                      {service.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 text-sm">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500">Starting from</p>
                        <p className="text-2xl font-bold text-primary">{service.price}</p>
                      </div>
                      <Button 
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summer Special Banner */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl overflow-hidden">
              <div className="px-8 py-12 flex flex-col md:flex-row items-center justify-between">
                <div className="text-white mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold mb-2">Summer Special Offer!</h3>
                  <p className="opacity-90">Get 20% off on all summer services package bookings</p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Claim Offer
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div 
          ref={el => sectionRefs.current["Curated Custom Service"] = el} 
          className="min-h-screen bg-gray-50"
        >
          {/* Curated Custom Service content */}
        </div>

        {/* Add remaining sections */}
      </div>
    </div>
  );
};

export default Navigation;
