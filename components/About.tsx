import React from 'react';

const About: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="relative h-[50vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/about/1920/1080')" }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase tracking-widest">
                Designed in India.
            </h1>
             <h2 className="text-2xl md:text-4xl font-bold text-gray-200 uppercase tracking-wider mt-2">
                Styled for the world.
            </h2>
        </div>
      </div>
      
      <div className="bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-3xl mx-auto text-center">
                 <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Our Philosophy</h2>
                 <p className="mt-6 text-lg text-gray-300 leading-relaxed">
                    We’re redefining men’s fashion with a purpose — simplicity, style, and self-expression. Every product is crafted to empower confidence, elevate comfort, and reflect your personality. At UrbanEdge, we believe that style is more than what you wear; it's a statement about who you are.
                 </p>
                 <p className="mt-4 text-lg text-gray-300 leading-relaxed">
                    We are proud to blend local craftsmanship with global trends to create high-quality, affordable fashion for the modern Indian man. Our collections are designed to be versatile, effortlessly cool, and built to last.
                 </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default About;
