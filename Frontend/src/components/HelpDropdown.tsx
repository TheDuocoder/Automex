import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HelpCircle,
  ChevronDown,
  Home,
  Users,
  Wrench,
  History,
  MessageSquare,
} from "lucide-react";

interface HelpDropdownProps {
  variant?: "light" | "dark";
}

const HelpDropdown = ({ variant = "light" }: HelpDropdownProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
      onClick: () => navigate("/"),
    },
    {
      label: "About Us",
      icon: Users,
      path: "/about",
      onClick: () => {
        navigate("/");
        setTimeout(() => {
          const aboutSection = document.querySelector('[data-section="about"]');
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      },
    },
    {
      label: "Services",
      icon: Wrench,
      path: "/services",
      onClick: () => navigate("/services"),
    },
    {
      label: "My Services",
      icon: History,
      path: "/my-services",
      onClick: () => navigate("/my-services"),
    },
    {
      label: "Contact Us",
      icon: MessageSquare,
      path: "/contact-us",
      onClick: () => navigate("/contact-us"),
    },
  ];

  // Button styling with smooth animations and hover effects
  const buttonClasses =
    variant === "dark"
      ? "group flex items-center gap-3 px-5 py-2.5 rounded-full bg-transparent border border-white text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out active:scale-95"
      : "group flex items-center gap-3 px-5 py-2.5 rounded-full bg-transparent border border-white text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 ease-out active:scale-95";

  const iconCircleClasses =
    variant === "dark"
      ? "h-6 w-6 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 text-white transition-transform duration-300 group-hover:rotate-12"
      : "h-6 w-6 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0 text-white transition-transform duration-300 group-hover:rotate-12";

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className={buttonClasses}>
          <div className={iconCircleClasses}>
            <HelpCircle className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          </div>
          <span className="text-base font-medium text-white">Help</span>
          <ChevronDown 
            className={`h-4 w-4 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            strokeWidth={2} 
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 p-4 bg-white rounded-xl shadow-2xl border border-gray-100 animate-in fade-in-0 slide-in-from-top-2 duration-300"
        style={{
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        }}
      >
        {menuItems
          .filter((item) => {
            // Hide the current page item from the dropdown
            // Don't filter out "About Us" since it's a scroll section, not a real route
            if (item.path === "/about") return true;
            return location.pathname !== item.path;
          })
          .map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={item.path}>
                <DropdownMenuItem
                  onClick={item.onClick}
                  className="px-5 py-3.5 rounded-xl cursor-pointer font-semibold transition-all duration-200 text-gray-800 hover:bg-gray-100 hover:translate-x-1"
                >
                  <Icon className="h-5 w-5 mr-3 text-gray-700" />
                  <span className="text-base">{item.label}</span>
                </DropdownMenuItem>
                {index === 0 && <div className="h-px bg-gray-200 my-2" />}
              </div>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HelpDropdown;
