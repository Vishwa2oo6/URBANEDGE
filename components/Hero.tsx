
import React from 'react';

interface HeroProps {
  onShopNowClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNowClick }) => {
  return (
    <div className="relative h-screen flex items-center justify-center text-center -mt-20">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://picsum.photos/seed/hero/1920/1080')" }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>
      <div className="relative z-10 p-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white uppercase tracking-widest leading-tight">
          Style That Speaks
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
          Affordable fashion for the modern Indian man — stylish, confident, and effortlessly cool. Explore new arrivals starting at just ₹799.
        </p>
        <button
          onClick={onShopNowClick}
          className="mt-8 px-8 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300"
        >
          Explore The Collection
        </button>
      </div>
    </div>
  );
};

export default Hero;
