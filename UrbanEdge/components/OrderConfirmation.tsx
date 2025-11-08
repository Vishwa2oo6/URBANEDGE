
import React from 'react';
import { CheckCircleIcon } from './icons';

interface OrderConfirmationProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ orderId, onNavigate }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center animate-fade-in">
      <div className="max-w-md mx-auto">
        <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
        <h1 className="mt-6 text-4xl font-bold uppercase tracking-wider text-white">Thank You For Your Order!</h1>
        <p className="mt-4 text-lg text-gray-300">
            Your order has been placed successfully. Your style upgrade is on its way.
        </p>
        <div className="mt-8 bg-gray-800 border border-gray-700 p-4 text-center">
            <p className="text-sm text-gray-400">Your Order ID is:</p>
            <p className="text-lg font-mono text-white mt-1">{orderId}</p>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-10 px-8 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;