import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, AlertTriangle } from 'lucide-react';

interface DeliveryErrorProps {
  address: string;
}

export const DeliveryError: React.FC<DeliveryErrorProps> = ({ address }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Delivery Not Available
        </h2>
        
        <p className="text-gray-600 mb-6">
          We apologize, but we cannot deliver to this location as it exceeds our maximum delivery range of 90 minutes.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="text-sm">{address}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full btn-primary py-3"
          >
            Return to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full btn-secondary py-3"
          >
            Try Another Address
          </button>
        </div>
      </div>
    </div>
  );
};