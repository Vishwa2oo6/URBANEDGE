import React from 'react';
import { TwitterIcon, InstagramIcon } from './icons';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const NavButton: React.FC<{ children: React.ReactNode, path: string }> = ({ children, path }) => (
     <button onClick={() => onNavigate(path)} className="text-base text-gray-300 hover:text-white text-left">{children}</button>
  );

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-4">
              <li><NavButton path="home#products">New Arrivals</NavButton></li>
              <li><NavButton path="shop">Clothing</NavButton></li>
              <li><NavButton path="shop">Shoes</NavButton></li>
              <li><NavButton path="shop">Accessories</NavButton></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><NavButton path="contact">Contact Us</NavButton></li>
              <li><NavButton path="faq">FAQ</NavButton></li>
              <li><NavButton path="order-tracking">Order Tracking</NavButton></li>
              <li><NavButton path="#">Returns</NavButton></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><NavButton path="about">About Us</NavButton></li>
              <li><NavButton path="#">Careers</NavButton></li>
              <li><NavButton path="#">Press</NavButton></li>
            </ul>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">URBANEDGE</h3>
             <p className="mt-4 text-base text-gray-300">Redefining Men’s Style</p>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-base text-gray-400 order-2 sm:order-1 mt-4 sm:mt-0">&copy; {new Date().getFullYear()} UrbanEdge. All rights reserved.</p>
          <div className="flex space-x-6 order-1 sm:order-2">
            <a href="#" className="text-gray-400 hover:text-white">
              <TwitterIcon />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;