import { ChevronLeft, ChevronRight, Star, Shield, Clock, CheckCircle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import batteryIcon from "@/assets/service-battery.png";
import tyreIcon from "@/assets/service-tyres.png";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

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
    image: "/images/Services/Premium car service.png",
    description: "Specialized maintenance for luxury vehicles including BMW, Mercedes-Benz, and Audi. Our certified technicians use advanced diagnostic tools and genuine parts to ensure premium performance. Services include engine diagnostics, transmission service, brake systems, and electronic systems calibration."
  },
  {
    title: "AC Service & Repair",
    image: "/images/Landing_page_images/Ac repair.png",
    description: "Expert AC system diagnosis, repair, and maintenance. We handle gas refilling, component replacement, and ensure optimal cooling performance for your comfort."
  },
  {
    title: "Batteries",
    image: "/images/Services/Battery service.png",
    isIcon: false,
    description: "Complete battery solutions including health check, charging system diagnosis, replacement with genuine batteries, and warranty support for all car models."
  },
  {
    title: "Tyres & Wheel Care",
    image: "/images/Services/Tyre service.png",
    isIcon: false,
    description: "Professional wheel alignment, balancing, rotation, and tyre replacement services. We ensure optimal tyre pressure and tread life for safe driving."
  },
  {
    title: "Denting & Painting",
    image: "/images/Services/denting and painting service.png",
    description: "Expert dent removal, scratch repair, and premium paint jobs. Our skilled technicians use advanced techniques and quality materials for a factory-like finish."
  },
  {
    title: "Detailing Services",
    image: "/images/Services/detailing service.png",
    description: "Premium car detailing including paint correction, ceramic coating, interior deep cleaning, and exterior protection for that showroom-like appearance."
  },
  {
    title: "Car Spa & Cleaning",
    image: "/images/Services/Car spa.png",
    description: "Thorough interior and exterior cleaning, steam wash, upholstery care, and protective coating. We restore your car's shine and freshness."
  },
  {
    title: "Car Inspections",
    image: "/images/Services/inspection service.png",
    description: "Detailed 50-point inspection covering safety, performance, and compliance checks. Get a comprehensive report of your vehicle's condition.",
    isNew: true
  }
];

type SummerService = {
  title: string;
  description: string;
  image: string;
  features: string[];
};

const summerServices: SummerService[] = [
  {
    title: "Front Bumper Paint",
    description: "Restore your bumper to a factory-fresh look with precision prep, priming, and multi‑stage paint matching. We remove scuffs and micro-dents for a seamless finish that blends perfectly with the body color.",
    image: "/images/Services/front bomper paint service.png",
    features: [
      "Computerized color matching",
      "Premium base + clear coat system",
      "Panel prep and priming",
      "UV-resistant ceramic-friendly finish",
    ]
  },
  {
    title: "Rubbing & Polishing",
    description: "Two-stage cut and refine process that removes oxidation, swirl marks, and light scratches to reveal a deep, glossy finish with added protection.",
    image: "/images/Services/rubbing and polish service.png",
    features: [
      "Dual-action machine polishing",
      "Swirl and haze reduction",
      "Paint sealant application",
      "Mirror-gloss enhancement",
    ]
  },
  {
    title: "Deep All Round Spa",
    description: "Thorough interior and exterior spa that sanitizes the cabin, rejuvenates upholstery, and restores the exterior sheen for a showroom-ready appearance.",
    image: "/images/Services/deep all round spa service.png",
    features: [
      "Steam sanitization of touchpoints",
      "Upholstery shampoo and vacuum",
      "Exterior foam wash and wax",
      "Tyre and trim revival",
    ]
  },
  {
    title: "Periodic Service",
    description: "Seasonal maintenance package covering fluids, filters, and safety systems to keep your car reliable through the heat.",
    image: "/images/Services/Premium car service.png",
    features: [
      "AC performance check",
      "Coolant top-up",
      "Battery health check",
      "Tire pressure optimization"
    ]
  }
];

const curatedServices = [
  {
    title: "Comprehensive Inspection Pack",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=1600",
    description: "A 50+ point inspection with digital report, prioritised repairs and a tailored service plan to keep your vehicle safe and performing.",
    bullets: ["Engine & transmission health check", "Brake & suspension assessment", "Electrical systems scan"]
  },
  {
    title: "Priority Warranty & Parts",
    image: "https://images.unsplash.com/photo-1511910429153-6f6d7a0b7f54?auto=format&fit=crop&q=80&w=1600",
    description: "Get priority sourcing of OEM parts, extended warranty options and fast-track repairs for premium vehicles.",
    bullets: ["Genuine OEM parts", "Fast-tracked fulfillment", "Extended warranty packages"]
  },
  {
    title: "Concierge & On-site Service",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600",
    description: "Doorstep inspections and repairs at your convenience with certified technicians and full transparency via our app.",
    bullets: ["Home pick-up & drop-off", "Real-time technician updates", "Secure payments & records"]
  },
  {
    title: "Paint Protection & Coating",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&q=80&w=1600",
    description: "Protect your paint with advanced sealants and ceramic coatings that resist UV and environmental damage.",
    bullets: ["Ceramic coatings", "UV protection", "Long-lasting gloss"]
  },
  {
    title: "Mobile Repair & Support",
    image: "https://images.unsplash.com/photo-1519148246706-6f2d8b1e1a3a?auto=format&fit=crop&q=80&w=1600",
    description: "On-demand mechanical support for minor repairs and troubleshooting at your location.",
    bullets: ["Minor repairs on-site", "Battery & tyre support", "Quick diagnostics"]
  }
];

const Navigation = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const navigate = useNavigate();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [summerCarouselApi, setSummerCarouselApi] = useState<CarouselApi>();
  const [curatedCarouselApi, setCuratedCarouselApi] = useState<CarouselApi>();
  const [apiActiveTab, setApiActiveTab] = useState("Our Services");

  // Refs for GSAP animations
  const premiumSectionRef = useRef<HTMLElement>(null);
  const premiumHeaderRef = useRef<HTMLHeadingElement>(null);
  const premiumDescRef = useRef<HTMLParagraphElement>(null);
  const premiumCarouselRef = useRef<HTMLDivElement>(null);
  const navigationRootRef = useRef<HTMLDivElement | null>(null);

  // Autoplay for luxury brands carousel
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

  // Autoplay for summer services carousel
  useEffect(() => {
    if (!summerCarouselApi) return;

    let intervalId: NodeJS.Timeout | null = null;

    const startAutoplay = () => {
      intervalId = setInterval(() => {
        summerCarouselApi.scrollNext();
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

    const element = summerCarouselApi.rootNode();
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    startAutoplay();

    return () => {
      stopAutoplay();
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [summerCarouselApi]);

  // Autoplay for curated services carousel
  useEffect(() => {
    if (!curatedCarouselApi) return;

    let intervalId: NodeJS.Timeout | null = null;

    const startAutoplay = () => {
      intervalId = setInterval(() => {
        curatedCarouselApi.scrollNext();
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

    const element = curatedCarouselApi.rootNode();
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    startAutoplay();

    return () => {
      stopAutoplay();
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [curatedCarouselApi]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (premiumHeaderRef.current && premiumDescRef.current && premiumCarouselRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: premiumSectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        });

        tl.from(premiumHeaderRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        })
          .from(premiumDescRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
          }, '-=0.4')
          .from(premiumCarouselRef.current.querySelectorAll('.carousel-item'), {
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
          }, '-=0.3');
      }

      // Animate service cards with sophisticated stagger
      const serviceCards = gsap.utils.toArray<HTMLElement>(".service-card");

      serviceCards.forEach((card, index) => {
        // Calculate row and column for grid-based stagger
        const row = Math.floor(index / 4);
        const col = index % 4;

        gsap.from(card, {
          y: 80,
          opacity: 0,
          scale: 0.9,
          rotationX: 15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
            once: true,
          },
          delay: (row * 0.1) + (col * 0.08),
        });

        // Image zoom effect
        const image = card.querySelector(".service-card__image");
        if (image) {
          gsap.from(image, {
            scale: 1.15,
            opacity: 0,
            ease: "power2.out",
            duration: 1.2,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
            delay: (row * 0.1) + (col * 0.08) + 0.2,
          });
        }

        // Text content fade-in
        const textContent = card.querySelector("h3, p");
        if (textContent) {
          gsap.from(textContent.parentElement, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            },
            delay: (row * 0.1) + (col * 0.08) + 0.4,
          });
        }
      });

      // Animate value proposition cards
      const valueCards = gsap.utils.toArray<HTMLElement>(".value-card");
      valueCards.forEach((card, index) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
          delay: index * 0.15,
        });

        // Icon animation
        const icon = card.querySelector("svg, .w-12");
        if (icon) {
          gsap.from(icon, {
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
            delay: index * 0.15 + 0.2,
          });
        }
      });
    }, navigationRootRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

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
    <div ref={navigationRootRef}>
      {/* Navigation Bar - hidden to remove white space below header */}      {/* Content Sections */}
      <div>
        {/* Our Services Section */}
        <section
          id="our-services"
          ref={(el) => {
            if (el) {
              sectionRefs.current["Our Services"] = el;
              premiumSectionRef.current = el;
            }
          }}
          className="py-8 bg-gradient-to-b from-gray-50 to-white min-h-screen"
        >
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-6">
              <div className="text-center mb-10 mt-6">
                <h2 ref={premiumHeaderRef} className="text-4xl font-bold mb-4">Premium Car Services in Bhubaneswar</h2>
                <p ref={premiumDescRef} className="text-gray-600 max-w-3xl mx-auto">
                  Specialized service center for luxury vehicles including BMW, Mercedes-Benz, and Audi. Our certified technicians provide comprehensive maintenance,
                  repairs, and premium care services using state-of-the-art equipment and genuine parts.
                </p>
                <div ref={premiumCarouselRef} className="mt-6 max-w-4xl mx-auto">
                  <Carousel
                    className="w-full max-w-4xl mx-auto"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    setApi={setCarouselApi}>
                    <CarouselContent>
                      <CarouselItem className="carousel-item md:basis-1/2 lg:basis-1/3">
                        <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                          <img
                            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80"
                            alt="BMW"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-white text-xl font-semibold">BMW</h3>
                              <p className="text-white/80 text-sm">Ultimate Driving Machine</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="carousel-item md:basis-1/2 lg:basis-1/3">
                        <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                          <img
                            src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80"
                            alt="Audi"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-white text-xl font-semibold">Audi</h3>
                              <p className="text-white/80 text-sm">Vorsprung durch Technik</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="carousel-item md:basis-1/2 lg:basis-1/3">
                        <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                          <img
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80"
                            alt="Porsche"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-white text-xl font-semibold">Porsche</h3>
                              <p className="text-white/80 text-sm">Timeless Machine</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="carousel-item md:basis-1/2 lg:basis-1/3">
                        <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                          <img
                            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80"
                            alt="Mercedes"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-white text-xl font-semibold">Mercedes</h3>
                              <p className="text-white/80 text-sm">Extraordinary Journey</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="carousel-item md:basis-1/2 lg:basis-1/3">
                        <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                          <img
                            src="https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80"
                            alt="Jaguar"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-white text-xl font-semibold">Jaguar</h3>
                              <p className="text-white/80 text-sm">Grace, Space, Pace</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="carousel-item md:basis-1/2 lg:basis-1/3">
                        <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                          <img
                            src="/images/Landing_page_images/Volve car.png"
                            alt="Volvo"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-white text-xl font-semibold">Volvo</h3>
                              <p className="text-white/80 text-sm">For Life</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="carousel-item md:basis-1/2 lg:basis-1/3">
                        <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                          <img
                            src="/images/Landing_page_images/Skoda car.png"
                            alt="Skoda Octavia"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              // Fallback to a known Skoda brand image if local file is missing
                              img.onerror = null;
                              img.src = "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=1200";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-white text-xl font-semibold">Skoda</h3>
                              <p className="text-white/80 text-sm">Simply Clever</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem className="carousel-item md:basis-1/2 lg:basis-1/3">
                        <div className="relative group aspect-[16/9] overflow-hidden rounded-xl">
                          <img
                            src="/images/Landing_page_images/Vw car.png"
                            alt="Volkswagen"
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.onerror = null;
                              img.src = "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                            <div className="absolute bottom-4 left-4">
                              <h3 className="text-white text-xl font-semibold">Volkswagen</h3>
                              <p className="text-white/80 text-sm">Drive Bigger</p>
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
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {carServices.map((service, index) => (
                <Card
                  key={index}
                  className="service-card group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 bg-white relative overflow-hidden cursor-pointer w-full rounded-2xl"
                  onClick={() => {
                    const sectionMap: Record<string, string> = {
                      "Premium Car Services": "premium",
                      "AC Service & Repair": "ac-repair",
                      "Batteries": "batteries",
                      "Tyres & Wheel Care": "tyres-wheel-care",
                      "Denting & Painting": "denting",
                      "Detailing Services": "detailing",
                      "Car Spa & Cleaning": "cleaning",
                      "Car Inspections": "inspections"
                    };
                    const sectionId = sectionMap[service.title];
                    navigate('/services', { state: { scrollTo: sectionId } });
                  }}
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
                        className={`service-card__image w-full h-full ${service.isIcon ? "object-contain p-6 bg-gray-50" : "object-cover"} transform group-hover:scale-105 transition-transform duration-500`}
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
            <div className="value-props mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="value-card text-center p-6 bg-blue-50 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 transition-colors duration-300 hover:text-blue-600">Quality Assurance</h3>
                <p className="text-gray-600 text-sm">Certified mechanics and genuine spare parts</p>
              </div>
              <div className="value-card text-center p-6 bg-green-50 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 transition-colors duration-300 hover:text-green-600">Timely Service</h3>
                <p className="text-gray-600 text-sm">On-time service delivery with live updates</p>
              </div>
              <div className="value-card text-center p-6 bg-purple-50 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110 hover:rotate-12">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 transition-colors duration-300 hover:text-purple-600">Best Pricing</h3>
                <p className="text-gray-600 text-sm">Competitive prices with no hidden charges</p>
              </div>
            </div>
          </div>
        </section>

        {/* Add remaining sections */}
      </div>
    </div>
  );
};

export default Navigation;
