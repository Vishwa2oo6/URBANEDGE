export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  fabric: string;
  fit: string;
  care: string[];
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
  name: string;
  email: string;
  memberSince: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
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
