
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { HeartIcon, CheckCircleIcon, TruckIcon, XIcon } from './icons';
import ProductCard from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (id: number) => void;
  isInWishlist: boolean;
  allProducts: Product[];
  onProductClick: (id: number) => void;
  wishlist: number[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, onBack, onAddToCart, onToggleWishlist, isInWishlist, allProducts, onProductClick, wishlist }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  
  const [pincode, setPincode] = useState('');
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<{ message: string; cod: boolean } | null>(null);

  const [isZooming, setIsZooming] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [activeImageUrl, setActiveImageUrl] = useState(product?.imageUrls[0] || '');


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
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size.');
      return;
    }
    onAddToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handlePincodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setPincode(value);
    if (pincodeError) setPincodeError(null);
    if (deliveryInfo) setDeliveryInfo(null);
  };

  const handlePincodeCheck = () => {
    if (pincode.length !== 6) {
      setPincodeError('Please enter a valid 6-digit number.');
      return;
    }
    setIsCheckingPincode(true);
    setDeliveryInfo(null);
    setPincodeError(null);
    setTimeout(() => {
      const firstThreeDigits = pincode.substring(0, 3);
      const isMetro = ['400', '110', '560', '700', '600', '500'].includes(firstThreeDigits);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + (isMetro ? 3 : 5));
      const dateString = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
      setDeliveryInfo({
        message: `Estimated delivery by ${dateString}`,
        cod: isMetro,
      });
      setIsCheckingPincode(false);
    }, 1000);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        setMousePosition({ x: xPercent, y: yPercent });
    }
  };
  
  const recommendedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
        <button onClick={onBack} className="mb-8 text-sm text-gray-400 hover:text-white transition-colors duration-200">
            &larr; Back
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div>
                 <div
                    ref={imageContainerRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
                    className="relative overflow-hidden rounded-lg cursor-zoom-in aspect-[3/4]"
                >
                    <img
                        src={activeImageUrl}
                        alt={product.name}
                        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${isZooming ? 'opacity-0' : 'opacity-100'}`}
                    />
                    <div
                        style={{
                            backgroundImage: `url(${activeImageUrl})`,
                            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                            backgroundSize: '200%',
                        }}
                        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${isZooming ? 'opacity-100' : 'opacity-0'}`}
                    />
                </div>
                {product.imageUrls.length > 1 && (
                    <div className="grid grid-cols-5 gap-2 mt-4">
                        {product.imageUrls.map((url, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveImageUrl(url)}
                                className={`aspect-square overflow-hidden rounded-md border-2 transition-colors duration-200 ${activeImageUrl === url ? 'border-white' : 'border-transparent hover:border-gray-500'}`}
                            >
                                <img src={url} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <h2 className="text-xl font-bold text-white">URBANEDGE</h2>
                <h1 className="text-2xl text-gray-300 mt-1">{product.name}</h1>
                
                <div className="mt-4 border-t border-b border-gray-800 py-4">
                    <p className="text-3xl font-bold text-white">₹{product.price.toFixed(2)}</p>
                    <p className="text-sm text-green-400 font-semibold">Special price</p>
                    <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>
                </div>
                
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-6">
                      <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white uppercase tracking-wider">Select Size</h3>
                          <button className="text-sm font-medium text-pink-400">Size Chart &rarr;</button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                          {product.sizes.map(size => (
                              <button 
                                  key={size}
                                  onClick={() => setSelectedSize(size)}
                                  className={`min-w-[56px] h-14 px-4 rounded-full border flex items-center justify-center font-bold text-sm transition-colors duration-200 ${
                                      selectedSize === size 
                                      ? 'bg-white text-black border-white' 
                                      : 'border-gray-600 text-white hover:border-white'
                                  }`}
                              >
                                  {size}
                              </button>
                          ))}
                      </div>
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                    <button 
                      onClick={handleAddToCartClick}
                      disabled={isAdded}
                      className={`flex-grow px-8 py-4 text-white font-bold uppercase tracking-wider transition-colors duration-300 rounded-md flex items-center justify-center gap-2 ${
                          isAdded 
                          ? 'bg-green-600 cursor-not-allowed' 
                          : 'bg-pink-600 hover:bg-pink-700'
                      }`}
                    >
                      {isAdded ? (
                          <>
                              <CheckCircleIcon className="w-6 h-6" />
                              <span>Added!</span>
                          </>
                      ) : (
                          <span>Add to Cart</span>
                      )}
                    </button>
                    <button
                      onClick={() => onToggleWishlist(product.id)}
                      className={`flex items-center justify-center gap-2 px-6 py-4 border rounded-md transition-colors duration-300 font-bold uppercase tracking-wider text-sm ${
                        isInWishlist 
                        ? 'border-pink-500 text-pink-500 bg-pink-500/10' 
                        : 'border-gray-600 text-white hover:border-white'
                      }`}
                      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <HeartIcon filled={isInWishlist} className="w-5 h-5" />
                        <span>{isInWishlist ? 'Wishlisted' : 'Wishlist'}</span>
                    </button>
                </div>

                <div className="mt-8 border-t border-gray-800 pt-6">
                    <h3 className="font-bold text-white uppercase tracking-wider">Delivery Options</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handlePincodeCheck(); }} className="mt-3">
                        <div className="flex border border-gray-600 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-white focus-within:border-white transition-all">
                            <input
                                type="text"
                                value={pincode}
                                onChange={handlePincodeInputChange}
                                placeholder="Enter 6-digit pincode"
                                maxLength={6}
                                className="flex-grow bg-transparent p-3 text-white placeholder-gray-500 focus:outline-none"
                                aria-label="Pincode"
                            />
                            <button
                                type="submit"
                                disabled={isCheckingPincode || pincode.length !== 6}
                                className="text-pink-400 font-bold px-4 hover:bg-gray-800 transition-colors disabled:cursor-not-allowed disabled:text-gray-500"
                            >
                                {isCheckingPincode ? 'Checking...' : 'CHECK'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-3 text-sm min-h-[44px]">
                        {pincodeError && (
                            <p className="text-red-400 animate-fade-in-down">{pincodeError}</p>
                        )}
                        {deliveryInfo && !pincodeError && (
                            <div className="space-y-1 animate-fade-in-down">
                                <p className="flex items-center gap-2 text-gray-200">
                                    <TruckIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    <span>{deliveryInfo.message}</span>
                                </p>
                                <p className={`flex items-center gap-2 ${deliveryInfo.cod ? 'text-green-400' : 'text-yellow-500'}`}>
                                    {deliveryInfo.cod ? <CheckCircleIcon className="w-5 h-5 flex-shrink-0" /> : <XIcon className="w-5 h-5 flex-shrink-0" />}
                                    <span>{deliveryInfo.cod ? 'Pay on Delivery Available' : 'Pay on Delivery Not Available'}</span>
                                </p>
                            </div>
                        )}
                        {!deliveryInfo && !pincodeError && !isCheckingPincode && (
                            <p className="text-xs text-gray-400 pt-1">
                                Please enter pincode to check delivery time & Pay on Delivery Availability
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="mt-8 border-t border-gray-800 pt-6">
                     <h3 className="font-bold text-white uppercase tracking-wider">Product Details</h3>
                     <p className="mt-3 text-gray-300">{product.description}</p>
                     <div className="mt-4 space-y-2 text-sm">
                        <p className="text-gray-300"><strong>Fabric:</strong> {product.fabric}</p>
                        <p className="text-gray-300"><strong>Fit:</strong> {product.fit}</p>
                        <div>
                            <p className="text-gray-300"><strong>Care:</strong></p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 mt-1">
                                {product.care.map((instruction, index) => <li key={index}>{instruction}</li>)}
                            </ul>
                        </div>
                     </div>
                </div>
            </div>
        </div>
        
        {recommendedProducts.length > 0 && (
            <div className="mt-16 sm:mt-24 border-t border-gray-800 pt-16">
                <h2 className="text-2xl font-bold text-center text-white uppercase tracking-wider mb-12">
                    You Might Also Like
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    {recommendedProducts.map(recommendedProduct => (
                        <ProductCard
                            key={recommendedProduct.id}
                            product={recommendedProduct}
                            onProductClick={onProductClick}
                            onToggleWishlist={onToggleWishlist}
                            isInWishlist={wishlist.includes(recommendedProduct.id)}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default ProductDetails;
