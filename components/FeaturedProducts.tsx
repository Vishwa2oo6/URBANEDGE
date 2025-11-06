import React from 'react';
import { PRODUCTS } from '../constants';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  onProductClick: (id: number) => void;
  onToggleWishlist: (id: number) => void;
  wishlist: number[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onProductClick, onToggleWishlist, wishlist }) => {
  const featured = PRODUCTS.filter(p => p.price < 1500).slice(0, 4);
  return (
    <section className="py-16 sm:py-24 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-white uppercase tracking-wider mb-12">
          Bestsellers Under ₹1499
        </h2>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {featured.map((product) => (
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
    </section>
  );
};

export default FeaturedProducts;
