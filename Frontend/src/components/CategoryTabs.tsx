import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

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
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

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

  // Handle click with ripple and highlight effects
  const handleCategoryClick = (categoryId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'category-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.appendChild(ripple);

    // Animate ripple with GSAP
    gsap.fromTo(
      ripple,
      {
        scale: 0,
        opacity: 0.6,
      },
      {
        scale: 4,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove();
        },
      }
    );

    // Background flash effect
    gsap.fromTo(
      button,
      {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
      },
      {
        backgroundColor: 'rgba(239, 68, 68, 0)',
        duration: 0.5,
        ease: 'power2.out',
      }
    );

    // Scale pulse effect
    gsap.fromTo(
      button,
      {
        scale: 0.95,
      },
      {
        scale: 1.05,
        duration: 0.15,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      }
    );

    // Call the original handler
    onCategoryChange(categoryId);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-white via-white to-rose-50 shadow-[0_16px_40px_rgba(231,74,59,0.12)] px-4 py-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(231,74,59,0.12),transparent_55%)]" />
      <div className="relative z-10">
        {/* Left Arrow */}
        <button
        onClick={goToPrevious}
        disabled={!canGoPrev}
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-2.5 transition-all duration-200 border border-white/70 backdrop-blur-sm shadow-sm ${
          canGoPrev ? "bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800" : "opacity-0 pointer-events-none"
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
                ref={(el) => {
                  if (el) buttonRefs.current.set(category.id, el);
                }}
                onClick={(e) => handleCategoryClick(category.id, e)}
                className={`flex flex-col items-center py-2 px-2 transition-all duration-200 relative w-full min-w-0 rounded-xl overflow-hidden ${
                  isActive ? 'transform scale-105 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg' : 'hover:scale-102 hover:bg-gray-50'
                }`}
                style={{ minWidth: '140px' }}
              >
                {/* Highlight overlay for active state */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-100/40 via-orange-100/30 to-transparent pointer-events-none animate-pulse" />
                )}
                
                {/* Icon Container */}
                <div className="w-16 h-16 flex items-center justify-center mb-2 relative z-10">
                  <div className={`w-12 h-12 transition-all duration-300 ${isActive ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-gray-500'}`}>
                    {category.icon}
                  </div>
                </div>
                
                {/* Category Name */}
                <div className="w-full flex justify-center px-1 relative z-10">
                  <span className={`text-xs font-medium text-center leading-tight transition-colors duration-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${
                    isActive ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-800'
                  }`} style={{fontSize: '11px', textAlign: 'center', display: 'block', maxWidth: '120px'}}>
                    {category.name}
                  </span>
                </div>
                
                {/* Active Underline with glow */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-t shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
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
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 rounded-full p-2.5 transition-all duration-200 border border-white/70 backdrop-blur-sm shadow-sm ${
          canGoNext ? "bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Next category"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      </div>
    </div>
  );
};

export default CategoryTabs;