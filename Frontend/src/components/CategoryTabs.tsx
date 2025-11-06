import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [currentPage, setCurrentPage] = useState(0);
  const CATEGORIES_PER_PAGE = 6;
  const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);

  // Auto-navigate to page containing active category
  useEffect(() => {
    const activeIndex = categories.findIndex(cat => cat.id === activeCategory);
    if (activeIndex !== -1) {
      const activePage = Math.floor(activeIndex / CATEGORIES_PER_PAGE);
      setCurrentPage(activePage);
    }
  }, [activeCategory, categories]);

  const getCurrentPageCategories = () => {
    const startIndex = currentPage * CATEGORIES_PER_PAGE;
    return categories.slice(startIndex, startIndex + CATEGORIES_PER_PAGE);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const showLeftArrow = currentPage > 0;
  const showRightArrow = currentPage < totalPages - 1;

  return (
    <div className="relative bg-white py-4 px-4">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button 
          onClick={goToPreviousPage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-gray-100 hover:bg-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" />
        </button>
      )}
      
      {/* Categories Container */}
      <div className="px-12">
        <div className="grid grid-cols-6 gap-4 transition-all duration-500 ease-in-out">
          {getCurrentPageCategories().map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex flex-col items-center py-5 px-3 rounded-xl transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-red-50' 
                    : 'bg-white hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: '#FFF5F5' } : {}}
              >
                {/* Icon Container */}
                <div className={`w-20 h-20 flex items-center justify-center mb-3 transition-all duration-300 ${
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
          {getCurrentPageCategories().length < CATEGORIES_PER_PAGE && 
            Array.from({ length: CATEGORIES_PER_PAGE - getCurrentPageCategories().length }).map((_, index) => (
              <div key={`empty-${index}`} className="invisible"></div>
            ))
          }
        </div>
      </div>
      
      {/* Right Arrow */}
      {showRightArrow && (
        <button 
          onClick={goToNextPage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-gray-100 hover:bg-gray-200 rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" />
        </button>
      )}
      
      {/* Page Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentPage ? 'bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;