import React from 'react';
import { CartItem } from '../types';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingCartIcon } from './icons';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onNavigate: (path: string) => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 999 ? 0 : 50; // Example shipping logic
  const total = subtotal + shippingCost;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center animate-fade-in flex flex-col items-center">
        <ShoppingCartIcon className="w-24 h-24 text-gray-700 mb-6" />
        <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Your Cart is Empty</h1>
        <p className="mt-4 max-w-xl mx-auto text-lg text-gray-300">
            Looks like you haven't added anything yet. Your next favorite outfit is just a click away. Explore our collections and find the styles that speak to you.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-8 px-8 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center mb-12">
          <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Shopping Cart</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
              Ready to own your look? Review your selections below and make sure everything’s just right before you checkout.
          </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <ul role="list" className="divide-y divide-gray-800">
            {cartItems.map((item) => (
              <li key={item.id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-700">
                  <img src={item.imageUrls[0]} alt={item.name} className="h-full w-full object-cover object-center" />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-white">
                      <h3>{item.name}</h3>
                      <p className="ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{item.category}</p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center border border-gray-600">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 text-gray-400 hover:text-white transition-colors"><MinusIcon className="w-4 h-4" /></button>
                        <input type="text" value={item.quantity} readOnly className="w-8 text-center bg-transparent text-white focus:outline-none" />
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 text-gray-400 hover:text-white transition-colors"><PlusIcon className="w-4 h-4" /></button>
                    </div>
                    <div className="flex">
                      <button onClick={() => onRemoveItem(item.id)} type="button" className="font-medium text-red-500 hover:text-red-400 flex items-center gap-1">
                        <TrashIcon className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
            <div className="sticky top-28 bg-gray-900 border border-gray-800 p-6">
                <h2 className="text-lg font-medium text-white">Order summary</h2>
                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">Subtotal</p>
                        <p className="text-sm font-medium text-white">₹{subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                        <p className="text-sm text-gray-400">Shipping</p>
                        <p className="text-sm font-medium text-white">{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'Free'}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                        <p className="text-base font-medium text-white">Order total</p>
                        <p className="text-base font-medium text-white">₹{total.toFixed(2)}</p>
                    </div>
                </div>
                <p className="mt-4 text-xs text-center text-green-400">
                    Free shipping on orders above ₹999
                </p>
                <div className="mt-6">
                    <button 
                        onClick={() => onNavigate('checkout')}
                        className="w-full px-8 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;