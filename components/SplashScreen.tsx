
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const InvisibleManLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Black Background Circle */}
    <circle cx="256" cy="256" r="250" fill="#000000" />
    
    <g fill="#FFFFFF">
      {/* Hat Crown */}
      <path d="M166 130 C166 80 346 80 346 130 L346 150 L166 150 Z" />
      {/* Hat Brim - Sharp and Clean */}
      <path d="M86 150 Q 256 210 426 150 Q 440 150 426 165 Q 256 225 86 165 Q 72 150 86 150 Z" />
      
      {/* Shirt Collar */}
      <path d="M256 220 L210 220 L240 260 Z" />
      <path d="M256 220 L302 220 L272 260 Z" />
      
      {/* Tie */}
      <path d="M256 225 L230 250 L256 275 L282 250 Z" /> {/* Knot */}
      <path d="M256 275 L235 420 L256 440 L277 420 Z" /> {/* Body */}
      
      {/* Suit Lapels - Elegant V Shape */}
      <path d="M150 240 L225 410 L255 410 L195 260 L150 240 Z" /> {/* Left */}
      <path d="M362 240 L287 410 L257 410 L317 260 L362 240 Z" /> {/* Right */}
      
      {/* Buttons */}
      <circle cx="256" cy="460" r="5" />
      <circle cx="256" cy="480" r="5" />
    </g>
  </svg>
);

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start fading out/exiting after 3 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3000);

    // Unmount callback after animation finishes (approx 3.8s total)
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0 scale-105 filter blur-md' : 'opacity-100 scale-100'
      }`}
    >
      <style>{`
        @keyframes logoReveal {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); filter: blur(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes textReveal {
          0% { opacity: 0; transform: translateY(20px); letter-spacing: 0.05em; filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0); letter-spacing: 0.15em; filter: blur(0); }
        }
        @keyframes lineGrow {
          0% { width: 0; opacity: 0; }
          100% { width: 100px; opacity: 1; }
        }
        @keyframes taglineFade {
          0% { opacity: 0; transform: translateY(5px); letter-spacing: 0.2em; }
          100% { opacity: 1; transform: translateY(0); letter-spacing: 0.3em; }
        }
        
        .anim-logo { animation: logoReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .anim-title { animation: textReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards; opacity: 0; }
        .anim-line { animation: lineGrow 1s cubic-bezier(0.22, 1, 0.36, 1) 0.8s forwards; opacity: 0; }
        .anim-tagline { animation: taglineFade 1s ease-out 1.2s forwards; opacity: 0; }
      `}</style>
      
      {/* Logo Container */}
      <div className="relative w-64 h-64 mb-8 anim-logo">
         <InvisibleManLogo className="w-full h-full drop-shadow-2xl" />
      </div>
      
      {/* Brand Name */}
      <h1 className="text-5xl md:text-7xl font-extrabold text-black uppercase tracking-[0.15em] text-center anim-title">
        URBANEDGE
      </h1>
      
      {/* Divider Line */}
      <div className="h-1.5 bg-black rounded-full my-6 mx-auto anim-line"></div>
      
      {/* Tagline */}
      <p className="text-sm md:text-lg font-bold text-gray-500 uppercase tracking-[0.3em] text-center anim-tagline">
        Redefine Your Style
      </p>
    </div>
  );
};

export default SplashScreen;
