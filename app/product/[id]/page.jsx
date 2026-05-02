'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage(props) {
  // Use `use` for params since Next.js 15+ sometimes requires async params unrolling
  // but for a pure markup demo we'll just mock statically.
  const product = {
    id: "demo",
    title: 'Tie-Dye Tee, Spiral',
    brand: 'Gildan 5000',
    price: 16.73,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
      'https://placehold.co/800x800/f3f4f6/4b5563?text=Back+View',
      'https://placehold.co/800x800/f3f4f6/4b5563?text=Side+View',
      'https://placehold.co/800x800/f3f4f6/4b5563?text=Detail+View'
    ]
  };

  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Images */}
        <div className="flex flex-col">
          {/* Main Image */}
          <div className="relative w-full aspect-square bg-[#e5e5e5] rounded-md overflow-hidden mb-4 group cursor-zoom-in">
            <img 
              src={product.images[activeImage]} 
              alt={product.title} 
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {/* Heart Icon from the mockup picture */}
            <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-sm opacity-80 hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 hover:text-red-500 transition-colors">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
               </svg>
            </div>
          </div>
          
        </div>

        {/* Right Side: Details */}
        <div className="flex flex-col pt-2">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{product.title}</h1>
          <div className="flex items-center text-gray-600 text-lg mb-8">
            <span className="font-medium mr-2">{product.brand}</span>
            <a href="#" className="underline font-semibold hover:text-gray-900">Product details</a>
          </div>

          {/* Features Bullets */}
          <ul className="list-disc list-inside space-y-2 text-gray-800 font-medium mb-12 ml-1">
            <li>100% Preshrunk cotton</li>
            <li>Medium fabric (5.3 oz/yd² (180 g/m²))</li>
            <li>Classic Fit</li>
            <li>Runs true to size</li>
            <li>Slight color variations may occur due to the dyeing process</li>
          </ul>

          {/* Printify Choice Box (Start Designing Box) */}
          {/* Stenvio Studio Box (Start Designing Box) */}
          <div className="bg-[#e2fccc] rounded-lg p-6 border border-[#c4eab0]">
            <div className="flex items-center mb-4">
              <span className="font-extrabold text-2xl tracking-tighter text-gray-900 italic mr-1">Stenvio</span>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest bg-transparent">Studio</span>
            </div>
            <p className="text-gray-900 font-medium mb-6 text-[15px]">
              Premium blanks, ready for your creative vision. High-quality materials for local craft.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-900">
                <Check className="text-green-700 mr-3" size={20} strokeWidth={3} />
                <span className="text-base font-bold text-gray-900 uppercase tracking-widest">In Stock & Ready</span>
              </div>
              <div className="flex items-center text-gray-900">
                <Check className="text-green-700 mr-3" size={20} strokeWidth={3} />
                <span className="text-base"><strong>Local Fulfillment</strong> network</span>
              </div>
            </div>

            <Link href={`/editor`} className="block w-full group">
               <button className="relative w-full overflow-hidden rounded-xl py-4 px-6 font-extrabold text-lg text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                 style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 40%, #14532d 100%)' }}>
                 {/* Shimmer overlay */}
                 <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                 <span className="relative flex items-center justify-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/>
                     <circle cx="12" cy="8" r="6"/>
                   </svg>
                   Customize
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-1">
                     <path d="M5 12h14"/>
                     <path d="m12 5 7 7-7 7"/>
                   </svg>
                 </span>
               </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
