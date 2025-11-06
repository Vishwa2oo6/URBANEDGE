import React, { useState } from 'react';
import { CartItem, ShippingInfo } from '../types';

interface CheckoutProps {
  cartItems: CartItem[];
  onPlaceOrder: (shippingInfo: ShippingInfo) => void;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder, onBack }) => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    // FIX: Add type check for `field` before calling `trim`, as `Object.values` returns `unknown[]`.
    if (Object.values(shippingInfo).some(field => typeof field === 'string' && field.trim() === '')) {
        alert('Please fill out all shipping details.');
        return;
    }
    onPlaceOrder(shippingInfo);
  };
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 999 ? 0 : 50;
  const total = subtotal + shippingCost;
  
  const FormInput = ({ label, name, value, onChange, placeholder, required = true }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="mt-1 block w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-white focus:border-white p-3"
        />
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center mb-12">
          <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Checkout</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
            You’re just one step away from upgrading your wardrobe. Confirm your details, choose your payment method, and we’ll take care of the rest.
          </p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <button type="button" onClick={onBack} className="mb-8 text-sm text-gray-400 hover:text-white transition-colors duration-200">
                &larr; Back to cart
            </button>
            <div className="space-y-8">
                <div className="bg-gray-900 border border-gray-800 p-6">
                    <h2 className="text-lg font-medium text-white">Shipping Information</h2>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                            <FormInput label="Full Name" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} placeholder="Alex Mercer" />
                        </div>
                        <div className="sm:col-span-2">
                            <FormInput label="Address" name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="123 Urban St." />
                        </div>
                        <FormInput label="City" name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="Mumbai" />
                        <FormInput label="Postal Code" name="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} placeholder="400001" />
                        <div className="sm:col-span-2">
                           <FormInput label="Country" name="country" value={shippingInfo.country} onChange={handleInputChange} placeholder="India" />
                        </div>
                    </div>
                </div>
                 <div className="bg-gray-900 border border-gray-800 p-6">
                    <h2 className="text-lg font-medium text-white">Payment Details</h2>
                    <p className="text-sm text-gray-400 mt-2">We accept UPI, Credit/Debit Cards, and Cash on Delivery (COD).</p>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                           <FormInput label="Card Number" name="cardNumber" placeholder="**** **** **** 1234" />
                        </div>
                        <FormInput label="Expiration Date" name="expiryDate" placeholder="MM / YY" />
                        <FormInput label="CVC" name="cvc" placeholder="123" />
                    </div>
                </div>
            </div>
        </div>
        
        <div className="lg:col-span-1">
            <div className="sticky top-28 bg-gray-900 border border-gray-800 p-6">
                <h2 className="text-lg font-medium text-white">Order summary</h2>
                <ul className="mt-6 divide-y divide-gray-800">
                    {cartItems.map(item => (
                        <li key={item.id} className="flex py-4">
                            <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover"/>
                            <div className="ml-4 flex-1 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-white">{item.name}</h3>
                                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                 <div className="mt-6 space-y-4 border-t border-gray-800 pt-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">Subtotal</p>
                        <p className="text-sm font-medium text-white">₹{subtotal.toFixed(2)}</p>
                    </div>
                     <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">Shipping</p>
                        <p className="text-sm font-medium text-white">{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'Free'}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                        <p className="text-base font-medium text-white">Total</p>
                        <p className="text-base font-medium text-white">₹{total.toFixed(2)}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <button type="submit" className="w-full px-8 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300">
                        Place Order
                    </button>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
