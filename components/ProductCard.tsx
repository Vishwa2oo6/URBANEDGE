import React from 'react';
import { Product } from '../types';
import { HeartIcon } from './icons';

interface ProductCardProps {
  product: Product;
  onProductClick: (id: number) => void;
  onToggleWishlist: (id: number) => void;
  isInWishlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onToggleWishlist, isInWishlist }) => {
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <div className="group relative text-left w-full">
      <button 
        onClick={handleWishlistClick} 
        className="absolute top-2 right-2 z-10 p-2 bg-black/50 rounded-full text-white hover:text-red-500 hover:bg-black/75 transition-colors duration-200"
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <HeartIcon filled={isInWishlist} className="w-5 h-5" />
      </button>
      <button onClick={() => onProductClick(product.id)} className="w-full">
        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-800 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-white">
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-gray-400">{product.category}</p>
          </div>
          <p className="text-sm font-medium text-white">₹{product.price.toFixed(2)}</p>
        </div>
      </button>
    </div>
  );
};

export default ProductCard;
