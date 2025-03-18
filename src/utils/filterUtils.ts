import { FoodItem, Filters } from '../types';

export const filterItems = (items: FoodItem[], filters: Filters): FoodItem[] => {
  return items.filter(item => {
    // Type filter
    if (filters.type !== 'all') {
      if (filters.type === 'veg' && !item.isVeg) return false;
      if (filters.type === 'non-veg' && item.isVeg) return false;
    }

    // Spice level filter
    if (filters.spiceLevel !== 'all' && item.spiceLevel !== filters.spiceLevel) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });
};