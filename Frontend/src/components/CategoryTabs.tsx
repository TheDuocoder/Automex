import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface CategoryTab {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface CategoryTabsProps {
  categories: CategoryTab[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    // Check scrollability on mount and when categories change
    setTimeout(checkScrollability, 100);
  }, [categories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    checkScrollability();
  };

  return (
    <div className="relative bg-white py-3 px-4">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button 
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-sm transition-all"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
      )}
      
      {/* Categories Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-8"
        onScroll={handleScroll}
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategory;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex flex-col items-center min-w-[120px] max-w-[140px] py-4 px-3 rounded-xl transition-all duration-200 snap-center relative ${
                isActive 
                  ? 'bg-red-50' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {/* Icon Container */}
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <div className={`transition-colors ${isActive ? 'text-red-600' : 'text-gray-600 hover:text-gray-700'}`}>
                  {category.icon}
                </div>
              </div>
              
              {/* Category Name */}
              <span className={`text-sm text-center leading-tight transition-colors font-inter ${
                isActive ? 'text-gray-900 font-bold' : 'text-gray-700 font-medium hover:text-gray-900'
              }`}>
                {category.name}
              </span>
              
              {/* Active Underline */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-600 rounded-t-full"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-sm transition-all"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default CategoryTabs;