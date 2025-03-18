import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

export const Cart: React.FC = () => {
  const { state, dispatch } = useCart();
  const deliveryCharge = 10;

  if (state.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-8rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 flex flex-col items-center justify-center">
        <ShoppingBag className="h-12 w-12 text-gray-400" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-500">
          Add some delicious items to your cart and they will appear here
        </p>
        <Link
          to="/"
          className="mt-6 btn-primary"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="max-h-[60vh] overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {state.items.map((item) => (
              <li key={item.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">K{item.price * item.quantity} ({item.quantity} × K{item.price})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                    className="p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-gray-600 font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}
                    className="p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>K{state.total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              <span>K{deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-lg font-medium border-t pt-2">
              <span>Total</span>
              <span>K{state.total + deliveryCharge}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-4 btn-primary w-full py-3"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};