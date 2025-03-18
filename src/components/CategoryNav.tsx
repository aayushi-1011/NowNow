import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/foodItems';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  currentCategoryId?: string;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({ currentCategoryId }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 100);
    }
  };

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-3 py-2 px-1 -mx-1 scroll-smooth"
        onScroll={checkScroll}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full border transition-all whitespace-nowrap font-medium
              ${category.id === currentCategoryId
                ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-200 hover:text-primary-600 hover:shadow-sm'
              }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
      
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center 
                   bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                   hover:bg-gray-50"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}
      
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center 
                   bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                   hover:bg-gray-50"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}
    </div>
  );
};