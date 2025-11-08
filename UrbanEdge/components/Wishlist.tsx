
import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface WishlistProps {
  items: Product[];
  onProductClick: (id: number) => void;
  onToggleWishlist: (id: number) => void;
  wishlist: number[];
  onNavigate: (path: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ items, onProductClick, onToggleWishlist, wishlist, onNavigate }) => {
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center animate-fade-in">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Your Wishlist</h1>
        <p className="mt-4 text-lg text-gray-300">Keep your favorites close. Add the styles you love here and grab them when you’re ready to buy.</p>
        <p className="mt-8 text-gray-400">You haven't added any items to your wishlist yet.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-8 px-8 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300"
        >
          Explore Styles
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Your Wishlist</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
          Keep your favorites close. Add the styles you love here and grab them when you’re ready to buy.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {items.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={wishlist.includes(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;