import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserDetails, Order, OrderStatus } from '../types';
import { addMinutes } from 'date-fns';
import { RESTAURANT_ADDRESS, calculateDistance, calculateDeliveryTime, getStatusDurations } from '../utils/deliveryCalculations';

interface UserContextType {
  userDetails: UserDetails | null;
  orders: Order[];
  deliveryAddress: string;
  updateUserDetails: (details: UserDetails) => void;
  clearUserDetails: () => void;
  addOrder: (order: Omit<Order, 'status' | 'estimatedDelivery'>) => void;
  updateOrderRating: (orderId: string, rating: number) => void;
  setDeliveryAddress: (address: string) => void;
}

const UserContext = createContext<UserContextType | null>(null);

const updateOrderInStorage = (orders: Order[]) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(() => {
    const savedDetails = localStorage.getItem('userDetails');
    return savedDetails ? JSON.parse(savedDetails) : null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Initialize delivery address from user details
  const [deliveryAddress, setDeliveryAddress] = useState<string>(() => {
    return userDetails?.address || '';
  });

  // Update delivery address when user details change
  useEffect(() => {
    if (userDetails?.address) {
      setDeliveryAddress(userDetails.address);
    }
  }, [userDetails?.address]);

  useEffect(() => {
    const handleUserDetailsUpdate = () => {
      const savedDetails = localStorage.getItem('userDetails');
      if (savedDetails) {
        const details = JSON.parse(savedDetails);
        setUserDetails(details);
        setDeliveryAddress(details.address);
      }
    };

    window.addEventListener('userDetailsUpdated', handleUserDetailsUpdate);
    return () => window.removeEventListener('userDetailsUpdated', handleUserDetailsUpdate);
  }, []);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(currentOrders => {
      const updatedOrders = currentOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      updateOrderInStorage(updatedOrders);
      return updatedOrders;
    });
  };

  const addOrder = async (orderDetails: Omit<Order, 'status' | 'estimatedDelivery'>) => {
    const now = new Date();
    
    const distance = await calculateDistance(
      RESTAURANT_ADDRESS,
      deliveryAddress
    );
    
    const totalMinutes = calculateDeliveryTime(distance);
    const durations = getStatusDurations(totalMinutes);
    
    const newOrder: Order = {
      ...orderDetails,
      status: 'pending',
      estimatedDelivery: addMinutes(now, totalMinutes).toISOString(),
      date: now.toISOString(),
      deliveryAddress
    };
    
    setOrders(currentOrders => {
      const updatedOrders = [newOrder, ...currentOrders];
      updateOrderInStorage(updatedOrders);
      return updatedOrders;
    });

    const pendingDuration = durations.pending * 60 * 1000;
    const preparingDuration = durations.preparing * 60 * 1000;
    const outForDeliveryDuration = durations.outForDelivery * 60 * 1000;

    const preparingTimeout = setTimeout(() => {
      updateOrderStatus(newOrder.id, 'preparing');
    }, pendingDuration);

    const outForDeliveryTimeout = setTimeout(() => {
      updateOrderStatus(newOrder.id, 'out-for-delivery');
    }, pendingDuration + preparingDuration);

    const deliveredTimeout = setTimeout(() => {
      updateOrderStatus(newOrder.id, 'delivered');
    }, pendingDuration + preparingDuration + outForDeliveryDuration);

    return () => {
      clearTimeout(preparingTimeout);
      clearTimeout(outForDeliveryTimeout);
      clearTimeout(deliveredTimeout);
    };
  };

  const updateOrderRating = (orderId: string, rating: number) => {
    setOrders(currentOrders => {
      const updatedOrders = currentOrders.map(order =>
        order.id === orderId ? { ...order, rating } : order
      );
      updateOrderInStorage(updatedOrders);
      return updatedOrders;
    });
  };

  const updateUserDetails = (details: UserDetails) => {
    setUserDetails(details);
    setDeliveryAddress(details.address);
    localStorage.setItem('userDetails', JSON.stringify(details));
  };

  const clearUserDetails = () => {
    setUserDetails(null);
    setOrders([]);
    setDeliveryAddress('');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('orders');
  };

  return (
    <UserContext.Provider value={{ 
      userDetails, 
      orders, 
      deliveryAddress,
      updateUserDetails, 
      clearUserDetails, 
      addOrder,
      updateOrderRating,
      setDeliveryAddress
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};