import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import SummerServices from "@/components/SummerServices";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Our Services");
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for header and tabs

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const section = sectionRefs.current[tab];
    if (section) {
      const offset = section.offsetTop - 100; // Adjust for fixed header and tabs
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
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
      <Footer />
    </div>
  );
};

export default Index;
