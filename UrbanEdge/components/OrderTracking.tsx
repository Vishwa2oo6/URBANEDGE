
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircleIcon, PackageIcon, TruckIcon } from './icons';

interface OrderTrackingProps {
  orders: Order[];
}

const statusSteps: OrderStatus[] = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrderTracking: React.FC<OrderTrackingProps> = ({ orders }) => {
  const [orderId, setOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTrackedOrder(null);
    const foundOrder = orders.find(o => o.id.toLowerCase() === orderId.toLowerCase().trim());
    if (foundOrder) {
      setTrackedOrder(foundOrder);
    } else {
      setError('Order not found. Please check the ID and try again.');
    }
  };
  
  const currentStatusIndex = trackedOrder ? statusSteps.indexOf(trackedOrder.status) : -1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Track Your Order</h1>
        <p className="mt-4 text-lg text-gray-300">
          Your style is on its way! Track your order below and stay updated on every step until delivery.
        </p>
      </div>

      <form onSubmit={handleTrackOrder} className="mt-10 max-w-lg mx-auto">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your Order ID (e.g., UE-1234567890)"
            className="flex-grow p-4 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300"
          >
            Track
          </button>
        </div>
      </form>

      <div className="mt-12 max-w-4xl mx-auto">
        {error && <p className="text-center text-red-500">{error}</p>}
        {trackedOrder && (
          <div className="bg-gray-900 border border-gray-800 p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Order Status for #{trackedOrder.id}</h2>
            
            <div className="flex justify-between items-center relative mb-12">
                <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-700 -translate-y-1/2"></div>
                <div 
                    className="absolute left-0 top-1/2 h-1 bg-green-500 -translate-y-1/2 transition-all duration-500" 
                    style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                ></div>
                {statusSteps.map((step, index) => (
                    <div key={step} className="z-10 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 border-2 ${index <= currentStatusIndex ? 'bg-green-500 border-green-500' : 'bg-gray-800 border-gray-600'}`}>
                            {index <= currentStatusIndex && <CheckCircleIcon className="w-5 h-5 text-black" />}
                        </div>
                        <p className={`text-xs uppercase tracking-wider ${index <= currentStatusIndex ? 'text-white' : 'text-gray-500'}`}>{step}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-8 text-lg text-gray-300">
                Current Status: <span className="font-bold text-green-400">{trackedOrder.status}</span>
            </div>

            <div className="mt-8 border-t border-gray-800 pt-6">
                <h3 className="font-bold text-white text-lg mb-4">Order Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-400">Order Date</p>
                        <p className="text-white">{new Date(trackedOrder.date).toLocaleDateString()}</p>
                    </div>
                     <div>
                        <p className="text-gray-400">Shipping To</p>
                        <p className="text-white">{trackedOrder.shippingInfo.fullName}</p>
                        <p className="text-white">{trackedOrder.shippingInfo.address}, {trackedOrder.shippingInfo.city}</p>
                    </div>
                    <div className="sm:col-span-2">
                        <p className="text-gray-400">Expected Delivery</p>
                        <p className="text-white">Average delivery: 3–5 days within India.</p>
                    </div>
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;