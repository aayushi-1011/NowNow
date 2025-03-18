import React from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { Clock, ShoppingBag } from 'lucide-react';

export const PreviousOrders: React.FC = () => {
  const { orders } = useUser();
  const { dispatch } = useCart();

  const handleReorder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.items.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        dispatch({ type: 'ADD_ITEM', payload: item });
      }
    });
  };

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="mb-16 animate-slide-up">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Clock className="h-7 w-7 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900">Previous Orders</h2>
        </div>
        <p className="text-gray-600 mt-2">Quick reorder from your order history</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div key={order.id} className="card p-6 hover:border-primary-200 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="font-medium text-gray-900 mt-1">₹{order.total}</p>
              </div>
              <button
                onClick={() => handleReorder(order.id)}
                className="btn-secondary text-sm py-1.5"
              >
                <ShoppingBag className="h-4 w-4" />
                Reorder
              </button>
            </div>
            <ul className="space-y-2 border-t pt-4">
              {order.items.map((item) => (
                <li key={item.id} className="text-sm text-gray-600 flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-gray-500">×{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};