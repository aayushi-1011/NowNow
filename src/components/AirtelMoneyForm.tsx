import React from 'react';
import { Phone } from 'lucide-react';

interface AirtelMoneyFormProps {
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
}

export const AirtelMoneyForm: React.FC<AirtelMoneyFormProps> = ({
  phoneNumber,
  onPhoneNumberChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Airtel Money Phone Number
        </label>
        <div className="relative">
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="Enter your Airtel Money number"
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Phone className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-800">
          After clicking on "Pay Now" button, you will receive a prompt on your Airtel Money registered phone number to complete the payment.
        </p>
      </div>
    </div>
  );
};