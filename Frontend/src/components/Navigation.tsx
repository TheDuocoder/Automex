import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    "Our Services",
    "Curated Custom Service",
    "Summer Services",
    "How AutoMex Works",
    "Rating & Reviews",
    "FAQ",
  ];

  return (
    <nav className="border-b bg-card sticky top-[52px] z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`py-4 px-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="icon" className="shrink-0">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
