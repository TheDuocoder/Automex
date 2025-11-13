import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import SummerServices from "@/components/SummerServices";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Our Services");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const aboutUsRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const lenisRafRef = useRef<number>();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for header and tabs

      // Check if we're in the About Us section - if so, clear active tab
      if (aboutUsRef.current) {
        const aboutUsTop = aboutUsRef.current.offsetTop;
        if (scrollPosition >= aboutUsTop) {
          setActiveTab("");
          return;
        }
      }

      // Find the section that is currently in view
      const sections = Object.entries(sectionRefs.current);
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const [tabName, ref] = sections[i];
        if (ref) {
          const { offsetTop } = ref;
          if (scrollPosition >= offsetTop) {
            setActiveTab(tabName);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      lenisRafRef.current = requestAnimationFrame(raf);
    };

    lenisRafRef.current = requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.from(".hero-animation", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.15,
      });

      gsap.utils
        .toArray<HTMLElement>(".landing-section")
        .forEach((section) => {
          gsap.from(section, {
            autoAlpha: 0,
            y: 60,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
            },
          });
        });
    }, rootRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      if (lenisRafRef.current) {
        cancelAnimationFrame(lenisRafRef.current);
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const section = sectionRefs.current[tab];
    if (section) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(section, { offset: -100 });
      } else {
      const offset = section.offsetTop - 100; // Adjust for fixed header and tabs
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
      }
    }
  };

  return (
    <div ref={rootRef} className="min-h-screen bg-background">
      <Header />
      <div className="hero-animation">
      <Hero />
      </div>
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="pt-4">
        <div
          className="landing-section"
          ref={el => sectionRefs.current["Our Services"] = el}
        >
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div
          className="landing-section"
          ref={el => sectionRefs.current["Summer Services"] = el}
        >
          <SummerServices />
        </div>
        <div
          className="landing-section"
          ref={el => sectionRefs.current["How AutoMex Works"] = el}
        >
          <HowItWorks />
        </div>
        <div
          className="landing-section"
          ref={el => sectionRefs.current["Rating & Reviews"] = el}
        >
          <Reviews />
        </div>
        <div
          className="landing-section"
          ref={el => sectionRefs.current["FAQ"] = el}
        >
          <FAQ />
        </div>
      </div>
      <div className="landing-section" ref={aboutUsRef}>
        <AboutUs />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
