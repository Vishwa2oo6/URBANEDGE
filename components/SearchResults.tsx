import React from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface SearchResultsProps {
  query: string;
  results: Product[];
  onProductClick: (id: number) => void;
  onToggleWishlist: (id: number) => void;
  wishlist: number[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, results, onProductClick, onToggleWishlist, wishlist }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-white">
            Search Results for "{query}"
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
          {results.length > 0
            ? `Here’s what we found for you — the perfect match for your search.`
            : `We couldn't find any matches for your search.`
          }
        </p>
         <p className="mt-2 text-sm text-gray-500">
            {results.length === 0 && "Don’t see it yet? Try exploring new categories or filters."}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {results.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={wishlist.includes(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-gray-400">Try another search term or browse our categories to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;