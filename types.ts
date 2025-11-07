
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrls: string[];
  description: string;
  fabric: string;
  fit: string;
  care: string[];
  stock: number;
  colors?: string[];
  sizes?: string[];
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Recommendation {
    itemName: string;
    category: string;
    reasoning: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  memberSince: string;
  role?: 'customer' | 'seller';
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  userId: number;
  date: string;
  items: CartItem[];
  total: number;
  shippingInfo: ShippingInfo;
  status: OrderStatus;
}

export interface FAQItem {
  question: string;
  answer: string;
}
