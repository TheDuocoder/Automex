import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

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
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}
      
      {/* Categories Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-1 overflow-x-auto pb-2 bg-gray-50 rounded-lg p-2 mx-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onScroll={handleScroll}
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategory;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex flex-col items-center min-w-[140px] p-4 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-white shadow-sm border-b-2 border-red-500' 
                  : 'hover:bg-white/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                isActive ? 'bg-red-50' : 'bg-gray-100'
              }`}>
                <div className={`${isActive ? 'text-red-500' : 'text-gray-600'}`}>
                  {category.icon}
                </div>
              </div>
              <span className={`text-sm font-medium text-center leading-tight ${
                isActive ? 'text-red-600' : 'text-gray-700'
              }`}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default CategoryTabs;