
import React, { useState, useEffect } from 'react';
import { SearchIcon, ShoppingCartIcon, UserIcon, HeartIcon, XIcon, MenuIcon } from './icons';
import { User } from '../types';

interface HeaderProps {
  onNavigate: (path: string) => void;
  cartItemCount: number;
  wishlistCount: number;
  onSearchSubmit: (query: string) => void;
  currentUser: User | null;
}

const MobileNavLink: React.FC<{ path: string; children: React.ReactNode; onClick: (path: string) => void }> = ({ path, children, onClick }) => (
    <button
        onClick={() => onClick(path)}
        className="block w-full text-left py-4 text-2xl font-bold uppercase tracking-wider text-gray-300 hover:text-white"
    >
        {children}
    </button>
);

// Custom Vector Logo Component
const InvisibleManLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Black Background Circle */}
    <circle cx="256" cy="256" r="250" fill="currentColor" className="text-black" />
    <circle cx="256" cy="256" r="245" fill="none" stroke="currentColor" strokeWidth="10" className="text-white/10" />
    
    <g fill="currentColor" className="text-white">
      {/* Hat Crown */}
      <path d="M166 130 C166 80 346 80 346 130 L346 150 L166 150 Z" />
      {/* Hat Brim */}
      <path d="M86 150 Q 256 210 426 150 Q 440 150 426 165 Q 256 225 86 165 Q 72 150 86 150 Z" />
      
      {/* Shirt Collar */}
      <path d="M256 220 L210 220 L240 260 Z" />
      <path d="M256 220 L302 220 L272 260 Z" />
      
      {/* Tie */}
      <path d="M256 225 L230 250 L256 275 L282 250 Z" />
      <path d="M256 275 L235 420 L256 440 L277 420 Z" />
      
      {/* Suit Lapels */}
      <path d="M150 240 L225 410 L255 410 L195 260 L150 240 Z" />
      <path d="M362 240 L287 410 L257 410 L317 260 L362 240 Z" />
      
      {/* Buttons */}
      <circle cx="256" cy="460" r="5" />
      <circle cx="256" cy="480" r="5" />
    </g>
  </svg>
);

const Header: React.FC<HeaderProps> = ({ onNavigate, cartItemCount, wishlistCount, onSearchSubmit, currentUser }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
        document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  
  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleMobileNavClick = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const navItemClasses = "text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium uppercase tracking-wider";

  return (
    <>
      <header className={'fixed top-0 z-40 w-full transition-all duration-300 bg-black/80 backdrop-blur-lg border-b border-gray-800'}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Toggle (Left) */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-300 hover:text-white">
                <MenuIcon />
              </button>
            </div>

            {/* Logo (Center on Mobile, Left on Desktop) */}
            <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:flex-shrink-0">
              <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
                <InvisibleManLogo className="h-12 w-12" />
                <span className="text-2xl font-extrabold tracking-wider uppercase text-white hidden md:block">
                  URBANEDGE
                </span>
                {/* Mobile text */}
                <span className="text-2xl font-extrabold tracking-wider uppercase text-white md:hidden">
                  URBANEDGE
                </span>
              </button>
            </div>
            
            {/* Desktop Nav (Center) */}
            <nav className="hidden md:flex md:space-x-8">
              <button onClick={() => onNavigate('home#products')} className={navItemClasses}>New Arrivals</button>
              <button onClick={() => onNavigate('shop')} className={navItemClasses}>Shop</button>
              {currentUser && (
                <button onClick={() => onNavigate('order-tracking')} className={navItemClasses}>My Orders</button>
              )}
            </nav>

            {/* Icons (Right) */}
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-300 hover:text-white transition-colors duration-200">
                {isSearchOpen ? <XIcon /> : <SearchIcon />}
              </button>
              <button onClick={() => onNavigate('wishlist')} className="relative text-gray-300 hover:text-white transition-colors duration-200 hidden md:block">
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
               <button onClick={() => onNavigate(currentUser ? 'account' : 'login')} className="hidden sm:block text-gray-300 hover:text-white transition-colors duration-200">
                <UserIcon />
              </button>
            </div>
          </div>
        </div>
        {/* Search Bar */}
        {isSearchOpen && (
             <div className="absolute top-full left-0 w-full bg-black/80 backdrop-blur-lg border-t border-gray-800 animate-fade-in-down">
                <form onSubmit={handleSearchFormSubmit} className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="w-full relative">
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
             </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 animate-fade-in">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                 <InvisibleManLogo className="h-12 w-12" />
                 <span className="text-2xl font-extrabold tracking-wider uppercase text-white">URBANEDGE</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white">
                <XIcon />
              </button>
            </div>
            <nav className="flex-1 flex flex-col justify-center divide-y divide-gray-800">
              <MobileNavLink path="home#products" onClick={handleMobileNavClick}>New Arrivals</MobileNavLink>
              <MobileNavLink path="shop" onClick={handleMobileNavClick}>Shop</MobileNavLink>
              {currentUser && (
                 <MobileNavLink path="order-tracking" onClick={handleMobileNavClick}>My Orders</MobileNavLink>
              )}
              <MobileNavLink path="account" onClick={handleMobileNavClick}>My Account</MobileNavLink>
              <MobileNavLink path="wishlist" onClick={handleMobileNavClick}>Wishlist</MobileNavLink>
              <MobileNavLink path="about" onClick={handleMobileNavClick}>About Us</MobileNavLink>
              <MobileNavLink path="contact" onClick={handleMobileNavClick}>Contact</MobileNavLink>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
