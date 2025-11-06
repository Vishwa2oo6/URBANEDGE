import React, { useState, useEffect } from 'react';
import { SearchIcon, ShoppingCartIcon, UserIcon, HeartIcon, XIcon } from './icons';

interface HeaderProps {
  onNavigate: (path: string) => void;
  cartItemCount: number;
  wishlistCount: number;
  onSearchSubmit: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, cartItemCount, wishlistCount, onSearchSubmit }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItemClasses = "text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium uppercase tracking-wider";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled || isSearchOpen ? 'bg-black/80 backdrop-blur-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button onClick={() => onNavigate('home')} className="text-2xl font-bold tracking-wider uppercase text-white">
              URBANEDGE
            </button>
          </div>
          
          {isSearchOpen ? (
             <form onSubmit={handleSearchFormSubmit} className="flex-grow flex items-center justify-center px-4">
               <div className="w-full max-w-lg relative">
                 <input 
                   type="text"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search for products..."
                   className="w-full bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-white focus:border-white focus:outline-none p-2 pl-4 pr-10"
                   autoFocus
                 />
                 <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white">
                   <SearchIcon className="w-5 h-5" />
                 </button>
               </div>
             </form>
          ) : (
            <nav className="hidden md:flex md:space-x-8">
              <button onClick={() => onNavigate('home#products')} className={navItemClasses}>New Arrivals</button>
              <button onClick={() => onNavigate('shop')} className={navItemClasses}>Clothing</button>
              <button onClick={() => onNavigate('shop')} className={navItemClasses}>Shoes</button>
              <button onClick={() => onNavigate('shop')} className={navItemClasses}>Accessories</button>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-300 hover:text-white transition-colors duration-200">
              {isSearchOpen ? <XIcon /> : <SearchIcon />}
            </button>
            <button onClick={() => onNavigate('wishlist')} className="relative text-gray-300 hover:text-white transition-colors duration-200">
              <HeartIcon />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-white text-black text-xs font-bold rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button onClick={() => onNavigate('cart')} className="relative text-gray-300 hover:text-white transition-colors duration-200">
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-white text-black text-xs font-bold rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button onClick={() => onNavigate('account')} className="hidden sm:block text-gray-300 hover:text-white transition-colors duration-200">
              <UserIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;