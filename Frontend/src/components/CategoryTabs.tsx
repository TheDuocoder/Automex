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
    <div className="relative py-4 w-full overflow-hidden">
      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        disabled={!canGoPrev}
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-2 transition-all duration-200 ${
          canGoPrev ? "bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800" : "invisible"
        }`}
        aria-label="Previous category"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      {/* Categories Container */}
      <div className="px-6">
        <div className="grid grid-cols-6 gap-4">
          {visibleCategories.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex flex-col items-center py-2 px-2 transition-all duration-200 relative w-full min-w-0 ${
                  isActive ? 'transform scale-105' : 'hover:scale-102'
                }`}
                style={{ minWidth: '140px' }}
              >
                {/* Icon Container */}
                <div className="w-16 h-16 flex items-center justify-center mb-2">
                  <div className={`w-12 h-12 ${isActive ? 'text-red-500' : 'text-gray-500'}`}>
                    {category.icon}
                  </div>
                </div>
                
                {/* Category Name */}
                <div className="w-full flex justify-center px-1">
                  <span className={`text-xs font-medium text-center leading-tight transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${
                    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-800'
                  }`} style={{fontSize: '11px', textAlign: 'center', display: 'block', maxWidth: '120px'}}>
                    {category.name}
                  </span>
                </div>
                
                {/* Active Underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-red-500 rounded-t"></div>
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
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-2 transition-all duration-200 ${
          canGoNext ? "bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800" : "invisible"
        }`}
        aria-label="Next category"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default CategoryTabs;