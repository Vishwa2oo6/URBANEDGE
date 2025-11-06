import React from 'react';
import { User, Order } from '../types';

interface AccountProps {
  user: User;
  orders: Order[];
}

const Account: React.FC<AccountProps> = ({ user, orders }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center mb-12">
          <h1 className="text-4xl font-bold uppercase tracking-wider text-white">My Account</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
            Welcome to your style space, {user.name.split(' ')[0]}. Track your orders, manage your profile, and keep your wishlist updated for your next wardrobe refresh.
          </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
            <div className="bg-gray-900 border border-gray-800 p-6">
                <h2 className="text-lg font-medium text-white">Profile</h2>
                <div className="mt-4 space-y-2 text-gray-300">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Member Since:</strong> {user.memberSince}</p>
                </div>
                <button className="mt-6 w-full text-sm py-2 border border-gray-600 hover:border-white transition-colors duration-200">
                    Edit Profile
                </button>
            </div>
        </div>

        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.id} className="bg-gray-900 border border-gray-800 p-6">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                <div>
                                    <h3 className="font-bold text-white">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-400">Date: {new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">₹{order.total.toFixed(2)}</p>
                                    <p className="text-sm text-gray-400">{order.items.length} item(s)</p>
                                </div>
                            </div>
                             <ul className="text-sm text-gray-300 border-t border-gray-800 pt-4">
                                {order.items.map(item => (
                                    <li key={item.id} className="flex justify-between py-1">
                                       <span>{item.name} (x{item.quantity})</span>
                                       <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">You haven't placed any orders yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
