import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { CreditCard, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  formatCardNumber,
  formatExpiryDate
} from '../utils/paymentValidation';

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const { addOrder } = useUser();
  const [processing, setProcessing] = useState(false);
  const deliveryCharge = 10;
  const paymentMethod = sessionStorage.getItem('paymentMethod') || 'card';
  const deliveryAddress = sessionStorage.getItem('deliveryAddress') || '';

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const [touched, setTouched] = useState({
    cardNumber: false,
    expiry: false,
    cvc: false
  });

  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/');
    }
  }, [state.items, navigate]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'cardNumber':
        return validateCardNumber(value) ? '' : 'Invalid card number';
      case 'expiry':
        return validateExpiryDate(value) ? '' : 'Invalid expiry date';
      case 'cvc':
        return validateCVC(value) ? '' : 'Invalid CVC';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiryDate(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (touched[name as keyof typeof touched]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, formattedValue)
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return (
        !errors.cardNumber &&
        !errors.expiry &&
        !errors.cvc &&
        formData.cardNumber &&
        formData.expiry &&
        formData.cvc
      );
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      const newErrors = {
        cardNumber: validateField('cardNumber', formData.cardNumber),
        expiry: validateField('expiry', formData.expiry),
        cvc: validateField('cvc', formData.cvc)
      };

      setErrors(newErrors);
      setTouched({
        cardNumber: true,
        expiry: true,
        cvc: true
      });

      if (!isFormValid()) {
        return;
      }
    }

    setProcessing(true);
    
    const newOrder = {
      id: Date.now().toString(),
      items: state.items,
      total: state.total + deliveryCharge,
      date: new Date().toISOString(),
      deliveryCharge,
      deliveryAddress
    };
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addOrder(newOrder);
    dispatch({ type: 'CLEAR_CART' });
    sessionStorage.removeItem('paymentMethod');
    sessionStorage.removeItem('airtelPhoneNumber');
    sessionStorage.removeItem('deliveryAddress');
    navigate('/orders');
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={19}
                  placeholder="4242 4242 4242 4242"
                  className={`block w-full pl-12 pr-4 py-3 border ${
                    errors.cardNumber && touched.cardNumber ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <CreditCard className={`h-6 w-6 ${
                    errors.cardNumber && touched.cardNumber ? 'text-red-400' : 'text-gray-400'
                  }`} />
                </div>
              </div>
              {errors.cardNumber && touched.cardNumber && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cardNumber}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`block w-full px-4 py-3 border ${
                    errors.expiry && touched.expiry ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.expiry && touched.expiry && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.expiry}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  name="cvc"
                  value={formData.cvc}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="123"
                  maxLength={4}
                  className={`block w-full px-4 py-3 border ${
                    errors.cvc && touched.cvc ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                />
                {errors.cvc && touched.cvc && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.cvc}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      case 'airtel':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-green-800 font-medium">Payment Request Sent</h4>
                <p className="text-green-700 text-sm mt-1">
                  Please check your Airtel Money phone ({sessionStorage.getItem('airtelPhoneNumber')}) 
                  for the payment prompt and complete the transaction.
                </p>
              </div>
            </div>
          </div>
        );
      case 'screenshot':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-green-800 font-medium">Screenshot Received</h4>
                <p className="text-green-700 text-sm mt-1">
                  Your payment screenshot has been uploaded successfully. Click "Complete Order" to finish your purchase.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Lock className="h-7 w-7 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderPaymentForm()}
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>K{state.total}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span>K{deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-lg font-medium border-t pt-2">
                <span>Total Amount</span>
                <span>K{state.total + deliveryCharge}</span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={processing || !isFormValid()}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                processing || !isFormValid()
                  
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              }`}
            >
              {processing ? 'Processing...' : 'Complete Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};