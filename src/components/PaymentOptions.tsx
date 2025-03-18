import React from 'react';
import { CreditCard, Smartphone, Image } from 'lucide-react';

interface PaymentOptionProps {
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

export const PaymentOptions: React.FC<PaymentOptionProps> = ({ selectedOption, onOptionChange }) => {
  const options = [
    {
      id: 'card',
      label: 'Credit/Debit Card',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Pay securely with your card'
    },
    {
      id: 'airtel',
      label: 'Airtel Money',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Pay using Airtel Money wallet'
    },
    {
      id: 'screenshot',
      label: 'Upload Screenshot',
      icon: <Image className="h-6 w-6" />,
      description: 'Upload payment screenshot'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Payment Method</h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex items-start p-4 cursor-pointer rounded-lg border-2 transition-all ${
              selectedOption === option.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            }`}
          >
            <input
              type="radio"
              name="paymentOption"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => onOptionChange(option.id)}
              className="sr-only"
            />
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${
                selectedOption === option.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {option.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900">{option.label}</p>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};