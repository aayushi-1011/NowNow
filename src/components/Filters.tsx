import React, { useRef, useState, useEffect } from 'react';
import { FilterDropdown } from './FilterDropdown';
import { Flame, Leaf, SortDesc, ChevronLeft, ChevronRight } from 'lucide-react';
import { Filters as FiltersType, FilterType, SpiceLevel, SortOption } from '../types';

interface FiltersProps {
  currentFilters: FiltersType;
  onChange: (filters: Partial<FiltersType>) => void;
}

export const Filters: React.FC<FiltersProps> = ({ currentFilters, onChange }) => {
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

  const handleChange = (key: keyof FiltersType, value: FilterType | SpiceLevel | SortOption) => {
    onChange({ [key]: value });
  };

  return (
    <div className="relative group">
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-1 -mx-1"
        onScroll={checkScroll}
      >
        <FilterDropdown
          label="Type"
          icon={<Leaf className="h-4 w-4" />}
          options={[
            { value: 'all', label: 'All' },
            { value: 'veg', label: 'Vegetarian' },
            { value: 'non-veg', label: 'Non-Vegetarian' }
          ]}
          selectedValue={currentFilters.type}
          onChange={(value) => handleChange('type', value as FilterType)}
        />

        <FilterDropdown
          label="Spice Level"
          icon={<Flame className="h-4 w-4" />}
          options={[
            { value: 'all', label: 'All' },
            { value: 'mild', label: 'Mild' },
            { value: 'medium', label: 'Medium' },
            { value: 'hot', label: 'Hot' }
          ]}
          selectedValue={currentFilters.spiceLevel}
          onChange={(value) => handleChange('spiceLevel', value as SpiceLevel)}
        />

        <FilterDropdown
          label="Sort By"
          icon={<SortDesc className="h-4 w-4" />}
          options={[
            { value: 'recommended', label: 'Recommended' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' }
          ]}
          selectedValue={currentFilters.sort}
          onChange={(value) => handleChange('sort', value as SortOption)}
        />
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