import React from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, CheckCircle2, Truck, ChefHat, RefreshCw, Package, MapPin } from 'lucide-react';
import { RatingStars } from '../components/RatingStars';
import { OrderTracking } from '../components/OrderTracking';

const RESTAURANT_ADDRESS = "Parirenyetwa Rd, Lusaka 10101, Zambia";

export const Orders: React.FC = () => {
  const { orders, updateOrderRating } = useUser();
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <ChefHat className="h-5 w-5 text-blue-500" />;
      case 'out-for-delivery':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const handleReorder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.items.forEach(item => {
      dispatch({ type: 'ADD_ITEM', payload: item });
    });
    navigate('/cart');
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by ordering some delicious food.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.date), 'PPP')}
                    </p>
                    <p className="font-medium text-gray-900">K{order.total}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleReorder(order.id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reorder
                </button>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Delivery Address</p>
                    <p className="text-sm text-gray-600 mt-0.5">{order.deliveryAddress}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="text-gray-500">×{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {order.status !== 'delivered' && order.deliveryAddress && (
                <div className="mt-6">
                  <OrderTracking
                    orderId={order.id}
                    status={order.status}
                    estimatedDelivery={order.estimatedDelivery}
                    restaurantAddress={RESTAURANT_ADDRESS}
                    deliveryAddress={order.deliveryAddress}
                  />
                </div>
              )}

              {order.status === 'delivered' && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rate your order:</span>
                    <RatingStars
                      rating={order.rating}
                      onRate={(rating) => updateOrderRating(order.id, rating)}
                      readonly={order.rating !== undefined}
                      size="sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};