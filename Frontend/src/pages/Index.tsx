import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import CuratedServices from "@/components/CuratedServices";
import HowItWorks from "@/components/HowItWorks";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Our Services");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Our Services":
        return <ServicesGrid />;
      case "Curated Custom Service":
        return <CuratedServices />;
      case "Summer Services":
        return <CuratedServices />;
      case "How AutoMex Works":
        return <HowItWorks />;
      case "Rating & Reviews":
        return <Reviews />;
      case "FAQ":
        return <FAQ />;
      default:
        return <ServicesGrid />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </div>
  );
};

export default Index;
