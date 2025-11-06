import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../constants';
import ProductCard from './ProductCard';
import { ChevronDownIcon } from './icons';
import { Product } from '../types';

const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
];

interface ShopProps {
    onProductClick: (id: number) => void;
    onToggleWishlist: (id: number) => void;
    wishlist: number[];
}

const Shop: React.FC<ShopProps> = ({ onProductClick, onToggleWishlist, wishlist }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('featured');

    const allCategories = useMemo(() => [{ id: 0, name: 'All', imageUrl: '' }, ...CATEGORIES], []);

    const filteredAndSortedProducts = useMemo(() => {
        let products: Product[] = [...PRODUCTS];

        if (activeCategory !== 'All') {
            products = products.filter(p => p.category === activeCategory);
        }

        switch (sortBy) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'featured':
            default:
                // Default order is by ID
                products.sort((a, b) => a.id - b.id);
                break;
        }

        return products;
    }, [activeCategory, sortBy]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Our Collection</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                    Discover our curated selection of men’s fashion essentials — from bold streetwear to refined formals. Find your fit, your color, and your vibe, all in one place.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    Sort and filter effortlessly to find the look that defines you.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 sticky top-20 z-40 bg-black/80 backdrop-blur-lg py-4 -mx-4 px-4">
                <div className="flex flex-wrap justify-center gap-2">
                    {allCategories.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => setActiveCategory(cat.name)} 
                            className={`px-4 py-2 text-xs sm:text-sm font-medium uppercase tracking-wider border rounded-full transition-colors duration-200 ${activeCategory === cat.name ? 'bg-white text-black border-white' : 'bg-transparent text-gray-300 border-gray-600 hover:border-white hover:text-white'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-gray-800 border border-gray-700 text-white py-2 pl-4 pr-10 focus:ring-2 focus:ring-white focus:border-white focus:outline-none rounded-md text-sm"
                        aria-label="Sort products"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <ChevronDownIcon />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {filteredAndSortedProducts.length > 0 ? (
                    filteredAndSortedProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onProductClick={onProductClick}
                            onToggleWishlist={onToggleWishlist}
                            isInWishlist={wishlist.includes(product.id)}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-400 col-span-full">No products found for this category.</p>
                )}
            </div>
        </div>
    );
};

export default Shop;