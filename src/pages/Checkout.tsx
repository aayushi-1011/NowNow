import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { UserCircle, MapPin, Mail, Phone, AlertTriangle } from 'lucide-react';
import { PaymentOptions } from '../components/PaymentOptions';
import { AirtelMoneyForm } from '../components/AirtelMoneyForm';
import { ScreenshotUpload } from '../components/ScreenshotUpload';
import { initGoogleMaps, initAutocomplete } from '../utils/googleMaps';
import { calculateDistance, isDeliveryPossible, RESTAURANT_ADDRESS, MAX_DELIVERY_TIME } from '../utils/deliveryCalculations';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useCart();
  const { userDetails, updateUserDetails, deliveryAddress, setDeliveryAddress } = useUser();
  const [paymentOption, setPaymentOption] = useState('card');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [formData, setFormData] = useState(userDetails || {
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(!userDetails);
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(true);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  useEffect(() => {
    if (isEditing) {
      initGoogleMaps().then(() => {
        const input = document.getElementById('address') as HTMLInputElement;
        if (input) {
          initAutocomplete(input, (place) => {
            if (place.formatted_address) {
              const newAddress = place.formatted_address;
              setFormData(prev => ({ ...prev, address: newAddress }));
              setDeliveryAddress(newAddress);
              checkDeliveryAvailability(newAddress);
            }
          });
        }
      });
    }
  }, [isEditing, setDeliveryAddress]);

  const checkDeliveryAvailability = async (address: string) => {
    if (!address) return;
    
    setIsCheckingDelivery(true);
    try {
      const distance = await calculateDistance(RESTAURANT_ADDRESS, address);
      setIsDeliveryAvailable(isDeliveryPossible(distance));
    } catch (error) {
      console.error('Error checking delivery availability:', error);
      setIsDeliveryAvailable(false);
    }
    setIsCheckingDelivery(false);
  };

  useEffect(() => {
    if (deliveryAddress) {
      checkDeliveryAvailability(deliveryAddress);
    }
  }, [deliveryAddress]);

  if (state.items.length === 0) {
    navigate('/');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserDetails(formData);
    sessionStorage.setItem('paymentMethod', paymentOption);
    if (paymentOption === 'airtel') {
      sessionStorage.setItem('airtelPhoneNumber', phoneNumber);
    }
    navigate('/payment');
  };

  return (
    <div className="min-h-screen pt-10 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <UserCircle className="h-8 w-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Delivery Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {!isEditing && userDetails ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Delivery Information</h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-primary-600 text-sm font-medium hover:text-primary-700"
                  >
                    Edit Details
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <UserCircle className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Name</p>
                      <p className="text-sm text-gray-600">{formData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{formData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{formData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                      <p className="text-sm text-gray-600">{formData.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-primary"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-primary"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-primary"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-primary"
                    placeholder="Enter your delivery address"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <PaymentOptions
              selectedOption={paymentOption}
              onOptionChange={setPaymentOption}
            />

            {paymentOption === 'airtel' && (
              <div className="mt-6">
                <AirtelMoneyForm
                  phoneNumber={phoneNumber}
                  onPhoneNumberChange={setPhoneNumber}
                />
              </div>
            )}

            {paymentOption === 'screenshot' && (
              <div className="mt-6">
                <ScreenshotUpload onFileSelect={setScreenshot} />
              </div>
            )}
          </div>

          {!isDeliveryAvailable && !isCheckingDelivery && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Delivery Not Available</p>
                <p className="text-sm mt-1">
                  We apologize, but we cannot deliver to this location as it exceeds our maximum delivery time of {MAX_DELIVERY_TIME} minutes. Please try a different address closer to our restaurant.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary py-3"
            disabled={
              (!formData.name || !formData.email || !formData.phone || !formData.address) ||
              (paymentOption === 'airtel' && !phoneNumber) ||
              (paymentOption === 'screenshot' && !screenshot) ||
              !isDeliveryAvailable ||
              isCheckingDelivery
            }
          >
            {isCheckingDelivery ? 'Checking delivery availability...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};