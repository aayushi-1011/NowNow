import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FoodCard } from '../components/FoodCard';
import { CategoryNav } from '../components/CategoryNav';
import { Filters } from '../components/Filters';
import { foodItems, categories } from '../data/foodItems';
import { filterItems } from '../utils/filterUtils';
import { Filters as FiltersType } from '../types';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FiltersType>({
    type: 'all',
    spiceLevel: 'all',
    sort: 'recommended'
  });

  const category = categories.find(c => c.id === categoryId);
  const categoryItems = foodItems.filter(item => item.category === categoryId);
  const filteredItems = filterItems(categoryItems, filters);

  if (!category) {
    navigate('/');
    return null;
  }

  const handleFilterChange = (newFilters: Partial<FiltersType>) => {
    setFilters(currentFilters => ({
      ...currentFilters,
      ...newFilters
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="pb-20">
        {/* All Categories Navigation */}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 sticky top-16 bg-white/95 backdrop-blur-sm py-4 z-10 border-b shadow-sm">
          <CategoryNav currentCategoryId={categoryId} />
        </div>

        {/* Category Header */}
        <div className="pt-6 mb-4">
          <div className="rounded-xl overflow-hidden shadow-sm">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            <p className="mt-2 text-gray-600">{category.description}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <Filters 
            currentFilters={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* Food Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} food={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found with the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};