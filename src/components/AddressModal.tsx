import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin } from 'lucide-react';
import { initGoogleMaps, initAutocomplete } from '../utils/googleMaps';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressUpdate: (address: string) => void;
  currentAddress: string;
}

export const AddressModal: React.FC<AddressModalProps> = ({ 
  isOpen, 
  onClose,
  onAddressUpdate,
  currentAddress
}) => {
  const [address, setAddress] = useState(currentAddress || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAddress(currentAddress || '');
  }, [currentAddress]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      initGoogleMaps().then(() => {
        if (inputRef.current) {
          initAutocomplete(inputRef.current, (place) => {
            if (place.formatted_address) {
              setAddress(place.formatted_address);
            }
          });
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddressUpdate(address);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="address-input" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your delivery address
              </label>
              <input
                ref={inputRef}
                id="address-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Start typing your address..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};