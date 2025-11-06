import React, { useState } from 'react';
import { Product } from '../types';
import { MinusIcon, PlusIcon, HeartIcon } from './icons';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (id: number) => void;
  isInWishlist: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onAddToCart, onToggleWishlist, isInWishlist }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl text-white">Product not found.</h1>
        <button onClick={onBack} className="mt-4 text-sm text-gray-300 hover:text-white">
            &larr; Back
        </button>
      </div>
    );
  }
  
  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
  };

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
        <button onClick={onBack} className="mb-8 text-sm text-gray-400 hover:text-white transition-colors duration-200">
            &larr; Back
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div>
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-auto object-cover"
                />
            </div>
            <div>
                <p className="text-sm uppercase tracking-widest text-gray-400">{product.category}</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">{product.name}</h1>
                <p className="text-3xl text-gray-300 mt-4">₹{product.price.toFixed(2)}</p>
                <p className="mt-6 text-gray-300 leading-relaxed">{product.description}</p>
                
                <div className="mt-8">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="quantity" className="font-medium text-white">Quantity</label>
                        <div className="flex items-center border border-gray-600">
                            <button onClick={decrement} className="p-2 text-gray-400 hover:text-white transition-colors"><MinusIcon /></button>
                            <input
                                id="quantity"
                                type="text"
                                value={quantity}
                                readOnly
                                className="w-12 text-center bg-transparent text-white focus:outline-none"
                            />
                            <button onClick={increment} className="p-2 text-gray-400 hover:text-white transition-colors"><PlusIcon /></button>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-4">
                        <button 
                          onClick={handleAddToCartClick}
                          className="flex-grow px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300"
                        >
                            Add to Cart
                        </button>
                        <button 
                          onClick={() => onToggleWishlist(product.id)}
                          className="px-4 py-4 border border-gray-600 text-white hover:border-white transition-colors duration-300"
                          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <HeartIcon filled={isInWishlist} />
                        </button>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-800 pt-6 space-y-2 text-sm text-gray-300">
                    <p>✓ Free Shipping on orders over ₹999</p>
                    <p>✓ Cash on Delivery Available</p>
                    <p>✓ 7-Day Easy Returns</p>
                </div>

                <div className="mt-10 border-t border-gray-800 pt-8 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Fabric & Fit</h3>
                        <p className="mt-2 text-gray-300"><strong>Fabric:</strong> {product.fabric}</p>
                        <p className="mt-1 text-gray-300"><strong>Fit:</strong> {product.fit}</p>
                    </div>
                     <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Care</h3>
                        <ul className="mt-2 list-disc list-inside text-gray-300 space-y-1">
                            {product.care.map((instruction, index) => <li key={index}>{instruction}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProductDetails;
