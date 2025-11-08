
import React from 'react';
import { Product } from '../types';
import { HeartIcon, ShoppingCartIcon } from './icons';

interface ProductCardProps {
  product: Product;
  onProductClick: (id: number) => void;
  onToggleWishlist: (id: number) => void;
  isInWishlist: boolean;
  onAddToCart?: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, onToggleWishlist, isInWishlist, onAddToCart }) => {
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };
  
  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product, 1);
  };
  
  const isOutOfStock = product.stock === 0;
  const isOnSale = product.price < 1000;

  return (
    <div 
      className={`group relative text-left w-full transition-all duration-300 ease-in-out ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`} 
      onClick={() => !isOutOfStock && onProductClick(product.id)}
    >
      <div className="relative">
        <div className="w-full aspect-[3/4] bg-gray-800 overflow-hidden rounded-lg">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:opacity-80 transition-opacity duration-300"
            loading="lazy"
          />
           {isOnSale && !isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md z-10">
              Sale
            </div>
          )}
           {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold uppercase tracking-wider border-2 border-white px-4 py-2">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 w-full">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 flex items-center justify-end gap-2">
                {!isOutOfStock && (
                  <>
                    {onAddToCart && (
                      <button 
                          onClick={handleAddToCartClick} 
                          className="flex items-center gap-2 p-2 bg-white text-black backdrop-blur-sm rounded-md hover:bg-gray-200"
                          aria-label="Add to cart"
                      >
                          <ShoppingCartIcon className="w-5 h-5" />
                          <span className="text-xs font-semibold">ADD TO CART</span>
                      </button>
                    )}
                    <button 
                        onClick={handleWishlistClick} 
                        className="flex items-center gap-2 p-2 bg-black/60 backdrop-blur-sm rounded-md text-white hover:text-red-500"
                        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <HeartIcon filled={isInWishlist} className="w-5 h-5" />
                        {!onAddToCart && <span className="text-xs font-semibold">WISHLIST</span>}
                    </button>
                  </>
                )}
            </div>
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className="text-sm font-bold text-white truncate">
          URBANEDGE
        </h3>
        <p className="mt-1 text-sm text-gray-400 truncate">{product.name}</p>
        <p className="mt-1 text-sm font-semibold text-white">₹{product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;