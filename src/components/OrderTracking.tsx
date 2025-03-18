import React from 'react';
import { DeliveryMap } from './DeliveryMap';
import { Clock, CheckCircle2, Truck, ChefHat } from 'lucide-react';
import { OrderStatus } from '../types';
import { format } from 'date-fns';

interface OrderTrackingProps {
  orderId: string;
  status: OrderStatus;
  estimatedDelivery: string;
  restaurantAddress: string;
  deliveryAddress: string;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  status,
  estimatedDelivery,
  restaurantAddress,
  deliveryAddress
}) => {
  const steps = [
    { id: 'pending', label: 'Order Confirmed', icon: CheckCircle2 },
    { id: 'preparing', label: 'Preparing', icon: ChefHat },
    { id: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Clock },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
        
        <div className="relative">
          <div className="absolute left-[17px] top-0 h-full w-0.5 bg-gray-200" />
          
          <div className="space-y-6 relative">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center gap-4">
                  <div className={`relative z-10 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                    isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                  } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}>
                    <StepIcon className={`h-5 w-5 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </p>
                    {isCurrent && status !== 'delivered' && (
                      <p className="text-sm text-gray-500 mt-1">
                        Estimated delivery by {format(new Date(estimatedDelivery), 'h:mm a')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Route</h3>
        <DeliveryMap
          orderId={orderId}
          restaurantAddress={restaurantAddress}
          deliveryAddress={deliveryAddress}
          isDeliveryStarted={status === 'out-for-delivery'}
        />
      </div>
    </div>
  );
};