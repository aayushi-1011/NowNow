import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartOverlay: React.FC = () => {
  const { state } = useCart();
  const location = useLocation();
  
  // Only show on home and category pages
  const shouldShow = location.pathname === '/' || location.pathname.startsWith('/category/');
  
  if (!shouldShow || state.items.length === 0) return null;

  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link 
      to="/cart"
      className="fixed bottom-24 right-4 z-30 animate-fade-in"
      aria-label="View cart and checkout"
    >
      <div className="flex items-center gap-3 bg-emerald-500 text-white rounded-full shadow-lg px-4 py-2.5 hover:bg-emerald-600 transition-colors">
        <ShoppingCart className="h-5 w-5" />
        <div className="flex flex-col items-start">
          <span className="font-medium">{itemCount} items</span>
          <span className="text-sm">Checkout</span>
        </div>
      </div>
    </Link>
  );
};