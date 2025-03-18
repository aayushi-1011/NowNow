import React from 'react';
import { Category } from '../types';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onSelect: (categoryId: string) => void;
  isSelected?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  onSelect,
  isSelected = false 
}) => {
  return (
    <button
      onClick={() => onSelect(isSelected ? '' : category.id)}
      className={`flex items-center gap-4 p-4 w-full text-left transition-all duration-300 hover:bg-gray-50 group mb-4
        ${isSelected ? 'bg-primary-50' : 'bg-white'}`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className={`text-lg font-medium transition-colors
          ${isSelected ? 'text-primary-600' : 'text-gray-900 group-hover:text-primary-600'}`}>
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
      </div>
      <ChevronRight className={`h-5 w-5 transition-all text-gray-400
        ${isSelected ? 'rotate-90' : 'group-hover:translate-x-1'}`} 
      />
    </button>
  );
};