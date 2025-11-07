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
    <div className="relative bg-white py-4 px-4">
      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        disabled={!canGoPrev}
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 ${
          canGoPrev ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-100/60 cursor-not-allowed shadow-none"
        }`}
        aria-label="Previous category"
      >
        <ChevronLeft className={`h-4 w-4 ${canGoPrev ? "text-gray-700" : "text-gray-400"}`} />
      </button>
      
      {/* Categories Container */}
      <div 
        className="px-12 overflow-x-auto overflow-y-visible" 
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style>{`
          .px-12::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div 
          className="flex transition-transform duration-300 ease-out" 
          style={{ 
            transform: `translateX(0)`,
            gap: '20px',
            minWidth: 'fit-content',
            paddingBottom: '8px'
          }}
        >
          {visibleCategories.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex flex-col items-center justify-between py-3 px-3 rounded-xl transition-all duration-300 relative min-h-[120px] ${
                  isActive 
                    ? 'bg-red-50' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                style={{ 
                  minWidth: 'fit-content',
                  width: 'auto',
                  maxWidth: '180px',
                  ...(isActive ? { backgroundColor: '#FFF5F5' } : {})
                }}
              >
                {/* Icon Container */}
                <div className={`w-10 h-10 flex items-center justify-center mb-2 transition-all duration-300 ${
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
                <span 
                  className={`text-center leading-tight transition-all duration-300 font-inter whitespace-nowrap ${
                    isActive ? 'text-black font-bold' : 'text-gray-700 font-medium hover:text-gray-900'
                  }`}
                  style={{
                    fontSize: '14px',
                    fontWeight: isActive ? 'bold' : '500',
                    color: isActive ? '#000000' : '#2C2C2C',
                    textAlign: 'center',
                    lineHeight: '1.2',
                    width: 'max-content',
                    minHeight: '20px',
                    display: 'block',
                    padding: '0 4px'
                  }}
                >
                  {category.name}
                </span>
                
                {/* Active Underline */}
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-t-full transition-all duration-300 animate-in slide-in-from-bottom-2"
                    style={{
                      width: '64px',
                      height: '4px',
                      backgroundColor: '#E74A3B'
                    }}
                  ></div>
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
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 ${
          canGoNext ? "bg-gray-100 hover:bg-gray-200" : "bg-gray-100/60 cursor-not-allowed shadow-none"
        }`}
        aria-label="Next category"
      >
        <ChevronRight className={`h-4 w-4 ${canGoNext ? "text-gray-700" : "text-gray-400"}`} />
      </button>
      
      {/* Page Indicators */}
      <div className="mt-4 h-2" aria-hidden="true"></div>
    </div>
  );
};

export default CategoryTabs;