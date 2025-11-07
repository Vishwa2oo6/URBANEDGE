import React, { useState } from 'react';
import { CartItem, ShippingInfo } from '../types';
import { CreditCardIcon, UpiIcon, CodIcon } from './icons';

interface CheckoutProps {
  cartItems: CartItem[];
  onPlaceOrder: (shippingInfo: ShippingInfo) => void;
  onBack: () => void;
}

type PaymentMethod = 'card' | 'upi' | 'cod';

// Helper components moved outside the main Checkout component to prevent re-rendering issues.
const FormInput: React.FC<{
    label: string;
    name: keyof ShippingInfo;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    error?: string;
    required?: boolean;
}> = ({ label, name, value, onChange, placeholder, error, required = true }) => (
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
          className={`mt-1 block w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-white focus:border-white p-3 ${error ? 'border-red-500' : 'border-gray-700'}`}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);

const PaymentMethodButton: React.FC<{
  method: PaymentMethod;
  icon: React.ReactNode;
  text: string;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}> = ({ method, icon, text, paymentMethod, setPaymentMethod }) => (
  <button
      type="button"
      onClick={() => setPaymentMethod(method)}
      className={`flex-1 p-4 flex flex-col items-center justify-center gap-2 border transition-colors duration-200 ${
          paymentMethod === method ? 'bg-white text-black border-white' : 'bg-transparent text-gray-300 border-gray-600 hover:bg-gray-800'
      }`}
  >
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider">{text}</span>
  </button>
);

const Checkout: React.FC<CheckoutProps> = ({ cartItems, onPlaceOrder, onBack }) => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const validate = () => {
      const newErrors: Partial<Record<keyof ShippingInfo, string>> = {};
      if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
      if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
      if (!shippingInfo.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
      if (!/^\d{6}$/.test(shippingInfo.postalCode)) newErrors.postalCode = 'Please enter a valid 6-digit postal code';
      if (!shippingInfo.country.trim()) newErrors.country = 'Country is required';
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingInfo]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onPlaceOrder(shippingInfo);
    }
  };
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = subtotal > 999 ? 0 : 50;
  const total = subtotal + shippingCost;

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
                            <FormInput label="Full Name" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} placeholder="Alex Mercer" error={errors.fullName} />
                        </div>
                        <div className="sm:col-span-2">
                            <FormInput label="Address" name="address" value={shippingInfo.address} onChange={handleInputChange} placeholder="123 Urban St, Apt 4B" error={errors.address} />
                        </div>
                        <FormInput label="City" name="city" value={shippingInfo.city} onChange={handleInputChange} placeholder="Mumbai" error={errors.city} />
                        <FormInput label="Postal Code" name="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} placeholder="400001" error={errors.postalCode} />
                        <div className="sm:col-span-2">
                           <FormInput label="Country" name="country" value={shippingInfo.country} onChange={handleInputChange} placeholder="India" error={errors.country} />
                        </div>
                    </div>
                </div>
                 <div className="bg-gray-900 border border-gray-800 p-6">
                    <h2 className="text-lg font-medium text-white">Payment Details</h2>
                    <div className="mt-4 flex gap-2">
                       <PaymentMethodButton method="card" icon={<CreditCardIcon />} text="Card" paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                       <PaymentMethodButton method="upi" icon={<UpiIcon />} text="UPI" paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                       <PaymentMethodButton method="cod" icon={<CodIcon />} text="COD" paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                    </div>
                    
                    <div className="mt-6">
                        {paymentMethod === 'card' && (
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-down">
                                <div className="sm:col-span-2"><input placeholder="Card Number" className="w-full bg-gray-800 border-gray-700 text-white p-3" /></div>
                                <input placeholder="MM / YY" className="w-full bg-gray-800 border-gray-700 text-white p-3" />
                                <input placeholder="CVC" className="w-full bg-gray-800 border-gray-700 text-white p-3" />
                            </div>
                        )}
                         {paymentMethod === 'upi' && (
                             <div className="animate-fade-in-down">
                                <input placeholder="Enter UPI ID (e.g., username@okhdfcbank)" className="w-full bg-gray-800 border-gray-700 text-white p-3" />
                                <p className="text-xs text-gray-400 mt-2">We will send a payment request to this UPI ID.</p>
                            </div>
                        )}
                         {paymentMethod === 'cod' && (
                             <div className="text-center p-4 bg-gray-800 animate-fade-in-down">
                                <p className="text-sm text-gray-300">You can pay in cash to the delivery agent upon receiving your order.</p>
                            </div>
                        )}
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
                            <img src={item.imageUrls[0]} alt={item.name} className="h-16 w-16 rounded-md object-cover"/>
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