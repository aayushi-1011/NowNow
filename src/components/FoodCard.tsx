import React from 'react';
import { FoodItem } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, Minus } from 'lucide-react';

interface FoodCardProps {
  food: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const { state, dispatch } = useCart();
  const cartItem = state.items.find(item => item.id === food.id);

  return (
    <div className="bg-white rounded-lg p-3 relative">
      <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold">K{food.price}</span>
          <span className="text-xs text-gray-500">each</span>
        </div>
        <h3 className="text-base font-medium text-gray-900 line-clamp-1">
          {food.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">
          {food.description}
        </p>
      </div>

      {!cartItem ? (
        <button
          onClick={() => dispatch({ type: 'ADD_ITEM', payload: food })}
          className="absolute -bottom-3 -right-3 w-8 h-8 bg-emerald-500 text-white rounded-full 
                   flex items-center justify-center shadow-lg hover:bg-emerald-600 
                   transition-all duration-200 z-10"
          aria-label="Add to cart"
        >
          <Plus className="h-5 w-5" />
        </button>
      ) : (
        <div className="absolute -bottom-3 -right-3 flex items-center gap-1 bg-white rounded-full shadow-lg p-1 z-10">
          <button
            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: food.id })}
            className="w-6 h-6 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors"
            aria-label="Remove item"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="font-medium text-sm text-gray-900 w-5 text-center">{cartItem.quantity}</span>
          <button
            onClick={() => dispatch({ type: 'ADD_ITEM', payload: food })}
            className="w-6 h-6 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors"
            aria-label="Add item"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};