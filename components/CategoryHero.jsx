"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CategoryHero({ title, description, images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!images || images.length < 2) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 400); // smooth fade out length
    }, 4000); // 4 seconds Amazon-style interval
    return () => clearInterval(interval);
  }, [images]);

  const img1 = images && images.length > 0 ? images[currentIndex] : null;

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #edeade 0%, #e5e0d4 50%, #ece8de 100%)",
        height: 280,
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center px-8 sm:px-14 lg:px-20 z-10 w-full md:w-2/3">
        <Link 
          href="/products" 
          className="flex items-center gap-2 text-[14px] font-bold text-[#6b6440] hover:text-[#1f1d12] transition-colors mb-4 group w-fit"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1f1d12] leading-none tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
          {title}
        </h1>
        <p className="mt-3 text-[15px] sm:text-[16px] text-[#6b6440] font-bold">
          {description}
        </p>
      </div>
  
      <div 
        className="absolute right-0 bottom-0 top-0 flex items-end pr-8 sm:pr-24 z-20 transition-opacity duration-500 ease-in-out"
        style={{ opacity: isTransitioning ? 0 : 1 }}
      >
        {img1 && (
          <div
            className="relative flex-shrink-0 rounded-t-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02]"
            style={{ width: 240, height: 280 }}
          >
            <img
              src={img1}
              alt={`Category Image ${currentIndex + 1}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#e8e3d7]/80 to-transparent" />
          </div>
        )}
      </div>
  
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to right, transparent 60%, rgba(232,227,215,0.2) 80%, rgba(232,227,215,0.4) 100%)",
        }}
      />
    </div>
  );
}
