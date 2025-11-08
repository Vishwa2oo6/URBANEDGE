

import React from 'react';
import { HomeIcon, StoreIcon, HeartIcon, UserIcon } from './icons';

interface BottomNavBarProps {
  onNavigate: (path: string) => void;
  activePage: string;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-500 hover:text-white'}`}
    >
        {isActive && <div className="absolute top-0 w-8 h-0.5 bg-white rounded-full"></div>}
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onNavigate, activePage }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-lg border-t border-gray-800 flex items-center justify-around z-[100]">
      <NavItem
        icon={<HomeIcon className="w-6 h-6" />}
        label="Home"
        isActive={activePage === 'home'}
        onClick={() => onNavigate('home')}
      />
      <NavItem
        icon={<StoreIcon className="w-6 h-6" />}
        label="Shop"
        isActive={activePage === 'shop'}
        onClick={() => onNavigate('shop')}
      />
      <NavItem
        icon={<HeartIcon className="w-6 h-6" />}
        label="Wishlist"
        isActive={activePage === 'wishlist'}
        onClick={() => onNavigate('wishlist')}
      />
      <NavItem
        icon={<UserIcon className="w-6 h-6" />}
        label="Account"
        isActive={activePage === 'account'}
        onClick={() => onNavigate('account')}
      />
    </nav>
  );
};

export default BottomNavBar;