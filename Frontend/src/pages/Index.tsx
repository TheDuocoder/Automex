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

const Index = () => {
  const [activeTab, setActiveTab] = useState("Our Services");
  const [showLoginForm, setShowLoginForm] = useState(false);
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

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      lenisRafRef.current = requestAnimationFrame(raf);
    };

    lenisRafRef.current = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      if (lenisRafRef.current) {
        cancelAnimationFrame(lenisRafRef.current);
      }
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
      <Header onLoginClick={() => setShowLoginForm(true)} />
      <Hero showLoginForm={showLoginForm} onCloseLogin={() => setShowLoginForm(false)} />
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="pt-4">
        <div ref={el => sectionRefs.current["Our Services"] = el}>
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div ref={el => sectionRefs.current["Summer Services"] = el}>
          <SummerServices />
        </div>
        <div ref={el => sectionRefs.current["How AutoMex Works"] = el}>
          <HowItWorks />
        </div>
        <div ref={el => sectionRefs.current["Rating & Reviews"] = el}>
          <Reviews />
        </div>
        <div ref={el => sectionRefs.current["FAQ"] = el}>
          <FAQ />
        </div>
      </div>
      <div ref={aboutUsRef}>
        <AboutUs />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
