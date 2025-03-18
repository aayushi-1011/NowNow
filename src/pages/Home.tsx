import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryCard } from '../components/CategoryCard';
import { categories } from '../data/foodItems';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="pt-10 pb-20">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onSelect={handleCategorySelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};