'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Library,
  Shirt, 
  Heart, 
  Coffee, 
  Smartphone, 
  CheckCircle2,
  Brush
} from 'lucide-react';

const productCategories = [
  { name: 'T-Shirts', path: '/products/t-shirts', icon: Shirt },
  { name: 'Hoodies', path: '/products/hoodies', icon: CheckCircle2 },
  { name: 'Long Sleeves', path: '/products/long-sleeves', icon: Shirt },
  { name: 'Mugs', path: '/products/mugs', icon: Coffee },
  { name: 'Bags', path: '/products/bags', icon: ShoppingBag },
  { name: 'Hats', path: '/products/hats', icon: Heart },
  { name: 'Phone Cases', path: '/products/phone-cases', icon: Smartphone }
];

export default function ProductsSidebar() {
  return (
    <aside className="w-64 border-r border-[#e5e3d7] flex flex-col sticky top-0 h-screen overflow-y-auto no-scrollbar bg-[#f0f0eb]/20 pb-10">
      <div className="p-8">
        <Link href="/" className="inline-block group">
           <img 
             src="/logo.png" 
             alt="Stenvio Logo" 
             className="h-14 w-auto object-contain transition-transform group-hover:scale-105" 
           />
        </Link>
      </div>

      {/* Product categories */}
      <div className="px-3 mb-6">
        <h3 className="px-3 text-[11px] font-bold text-[#8a8670] uppercase tracking-widest mb-2">Categories</h3>
        <div className="space-y-0.5">
          {productCategories.map((cat, i) => (
            <Link key={i} href={cat.path}>
              <div 
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-[#6b6850] hover:bg-[#e5e3d7]/50 hover:text-[#1c211f]"
              >
                <cat.icon className="w-4.5 h-4.5 opacity-70" />
                <span className="text-[14px] font-semibold">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Chat Icon */}
      <div className="p-4 mt-auto">
         <div className="w-10 h-10 rounded-full bg-[#2d2b1f] flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
           <Library className="w-5 h-5" />
         </div>
      </div>
    </aside>
  );
}
