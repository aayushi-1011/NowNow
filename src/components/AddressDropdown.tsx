import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { AddressModal } from './AddressModal';
import { RESTAURANT_ADDRESS, calculateDistance, calculateDeliveryTime } from '../utils/deliveryCalculations';

export const AddressDropdown: React.FC = () => {
  const { userDetails, deliveryAddress, setDeliveryAddress, updateUserDetails } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    let mounted = true;

    const updateDeliveryTime = async () => {
      if (deliveryAddress) {
        setIsCalculating(true);
        try {
          const distance = await calculateDistance(RESTAURANT_ADDRESS, deliveryAddress);
          const time = calculateDeliveryTime(distance);
          if (mounted) {
            setDeliveryTime(time);
          }
        } catch (error) {
          console.error('Error updating delivery time:', error);
          if (mounted) {
            setDeliveryTime(null);
          }
        } finally {
          if (mounted) {
            setIsCalculating(false);
          }
        }
      } else {
        setDeliveryTime(null);
        setIsCalculating(false);
      }
    };

    updateDeliveryTime();

    return () => {
      mounted = false;
    };
  }, [deliveryAddress]);

  const handleAddressUpdate = (newAddress: string) => {
    setDeliveryAddress(newAddress);
    // Also update the user's default address
    if (userDetails) {
      updateUserDetails({
        ...userDetails,
        address: newAddress
      });
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-3 hover:bg-gray-50 py-1 px-2 rounded-lg transition-colors group"
      >
        <div className="flex flex-col items-center">
          <span className="text-emerald-500 text-lg font-bold leading-none">
            {isCalculating ? '...' : deliveryTime ?? '...'}
          </span>
          <span className="text-xs text-gray-500 mt-0.5 font-bold">mins</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500">delivery to</span>
          {deliveryAddress ? (
            <div className="flex items-center gap-1">
              <span className="text-sm text-left line-clamp-1 max-w-[150px] border-b border-gray-300 group-hover:border-primary-300 transition-colors">
                {deliveryAddress}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-sm text-primary-600">Add address</span>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          )}
        </div>
      </button>

      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddressUpdate={handleAddressUpdate}
        currentAddress={deliveryAddress}
      />
    </>
  );
};