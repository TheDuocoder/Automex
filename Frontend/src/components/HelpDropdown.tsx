import { useNavigate, useLocation } from "react-router-dom";
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

  const isActive = (path: string) => {
    if (path === "/about") return false; // About is not a real route, it's a scroll section
    
    // Check for exact match
    if (location.pathname === path) return true;
    
    // For home page, also consider root paths
    if (path === "/" && (location.pathname === "/" || location.pathname === "/home")) return true;
    
    return false;
  };

  // Button styling based on variant - High contrast visibility
  const buttonClasses =
    variant === "dark"
      ? "flex items-center gap-2.5 px-4 py-2 rounded-full bg-transparent border border-white text-white hover:border-white/80 transition-all"
      : "flex items-center gap-2.5 px-4 py-2 rounded-full bg-transparent border border-gray-800 text-gray-900 hover:border-gray-600 transition-all";

  const iconCircleClasses =
    variant === "dark"
      ? "h-5 w-5 rounded-full border border-white flex items-center justify-center flex-shrink-0 text-white"
      : "h-5 w-5 rounded-full border border-gray-900 flex items-center justify-center flex-shrink-0 text-gray-900";

  const iconClasses = variant === "dark" ? "text-white" : "text-gray-900";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={buttonClasses}>
          <div className={iconCircleClasses}>
            <HelpCircle className={`h-3 w-3 ${iconClasses}`} strokeWidth={2} />
          </div>
          <span className="text-sm font-medium">Help</span>
          <ChevronDown className={`h-3.5 w-3.5 ${iconClasses}`} strokeWidth={2} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 p-4 bg-white rounded-xl shadow-xl border border-gray-200"
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <div key={item.path}>
              <DropdownMenuItem
                onClick={item.onClick}
                className={`px-5 py-3.5 rounded-lg cursor-pointer font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                <Icon className={`h-4 w-4 mr-3 ${active ? "text-white" : "text-gray-800"}`} />
                {item.label}
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
