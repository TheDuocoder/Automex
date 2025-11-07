import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

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
  const VISIBLE_COUNT = 6;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const activeIndex = categories.findIndex((cat) => cat.id === activeCategory);
    if (activeIndex === -1) return;

    setStartIndex((prev) => {
      if (activeIndex < prev) {
        return activeIndex;
      }
      if (activeIndex >= prev + VISIBLE_COUNT) {
        return Math.min(activeIndex - VISIBLE_COUNT + 1, Math.max(categories.length - VISIBLE_COUNT, 0));
      }
      return prev;
    });
  }, [activeCategory, categories]);

  const visibleCategories = useMemo(() => {
    return categories.slice(startIndex, startIndex + VISIBLE_COUNT);
  }, [categories, startIndex]);

  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + VISIBLE_COUNT < categories.length;

  const goToPrevious = () => {
    if (!canGoPrev) return;
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    if (!canGoNext) return;
    setStartIndex((prev) => Math.min(prev + 1, categories.length - VISIBLE_COUNT));
  };

  return (
    <div className="relative bg-white py-6 px-6">
      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        disabled={!canGoPrev}
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 ${
          canGoPrev ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-100/60 cursor-not-allowed shadow-none"
        }`}
        aria-label="Previous category"
      >
        <ChevronLeft className={`h-4 w-4 ${canGoPrev ? "text-gray-700" : "text-gray-400"}`} />
      </button>
      
      {/* Categories Container */}
      <div className="px-14 overflow-hidden">
        <div className="grid grid-cols-6 gap-6 transition-transform duration-300 ease-out" style={{ transform: `translateX(0)` }}>
          {visibleCategories.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex flex-col items-center py-6 px-4 rounded-xl transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-red-50' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: '#FFF5F5' } : {}}
              >
                {/* Icon Container */}
                <div className={`w-28 h-28 flex items-center justify-center mb-3 transition-all duration-300 ${
                  isActive ? 'transform scale-110' : 'transform scale-100 hover:scale-105'
                }`}>
                  <div 
                    className={`transition-all duration-300 ${
                      isActive ? 'text-red-600' : 'text-gray-600 hover:text-gray-700'
                    }`}
                    style={isActive ? {
                      filter: 'hue-rotate(0deg) saturate(1.5) brightness(1.1) drop-shadow(0 2px 4px rgba(220, 38, 38, 0.25))',
                      transform: 'scale(1)'
                    } : {}}
                  >
                    {category.icon}
                  </div>
                </div>
                
                {/* Category Name */}
                <span className={`text-sm text-center leading-tight transition-all duration-300 font-inter whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${
                  isActive ? 'text-black font-bold' : 'text-gray-700 font-medium hover:text-gray-900'
                }`}>
                  {category.name}
                </span>
                
                {/* Active Underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-red-600 rounded-t-full transition-all duration-300 animate-in slide-in-from-bottom-2"></div>
                )}
              </button>
            );
          })}
          
          {/* Fill empty slots if less than 6 categories on current page */}
          {visibleCategories.length < VISIBLE_COUNT &&
            Array.from({ length: VISIBLE_COUNT - visibleCategories.length }).map((_, index) => (
              <div key={`empty-${index}`} className="invisible"></div>
            ))
          }
        </div>
      </div>
      
      {/* Right Arrow */}
      <button
        onClick={goToNext}
        disabled={!canGoNext}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 ${
          canGoNext ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-100/60 cursor-not-allowed shadow-none"
        }`}
        aria-label="Next category"
      >
        <ChevronRight className={`h-4 w-4 ${canGoNext ? "text-gray-700" : "text-gray-400"}`} />
      </button>
      
      {/* Page Indicators */}
      <div className="mt-5 h-2" aria-hidden="true"></div>
    </div>
  );
};

export default CategoryTabs;