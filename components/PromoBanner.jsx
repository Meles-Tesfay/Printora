"use client";

import React from 'react';

/**
 * PromoBanner - A reusable styled banner with hover zoom, 
 * glassmorphism text container, and custom content.
 */
export default function PromoBanner({ title, subtitle = "New Collection", buttonText = "Explore Now", image, link = "#" }) {
  return (
    <div className="relative h-[300px] sm:h-[350px] md:h-[400px] mb-12 -mx-8 lg:-mx-12 overflow-hidden flex items-center justify-center -mt-4 group rounded-b-[3rem] sm:rounded-b-[4rem] group shadow-2xl">
      {/* Background Image with Slow Zoom on Hover */}
      <img 
        src={image} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[4s] ease-out group-hover:scale-110"
      />
      
      {/* Dark Overlay and Color Tint */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 backdrop-blur-[0.5px]" />
      
      {/* Styled Glassmorphism Text Container */}
      <div className="relative z-10 text-center px-8 py-10 sm:py-12 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2.5rem] max-w-2x shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform transition-transform duration-700 group-hover:scale-[1.02]">
        <div className="flex flex-col items-center">
            <span className="text-[#A1FF4D] text-[12px] sm:text-[13px] font-black tracking-[0.4em] uppercase mb-4 drop-shadow-md">
                {subtitle}
            </span>
            <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tight mb-8 drop-shadow-lg leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                {title}
            </h2>
            <button className="px-10 py-4 bg-[#A1FF4D] text-[#1B2412] font-black uppercase text-[15px] tracking-widest hover:bg-white hover:scale-110 transition-all duration-300 rounded-full shadow-lg h-14 flex items-center justify-center">
                {buttonText}
            </button>
        </div>
      </div>
      
      {/* Subtle Bottom Light Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  );
}
