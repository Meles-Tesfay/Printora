'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ShoppingBag, 
  Library,
  Shirt, 
  Heart, 
  Coffee, 
  Smartphone, 
  CheckCircle2,
  Brush,
  Grid
} from 'lucide-react';

function slugifyType(type) {
  return (type || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ICON_MAP = {
  't-shirt': Shirt,
  't-shirts': Shirt,
  'hoodie': CheckCircle2,
  'hoodies': CheckCircle2,
  'long-sleeve': Shirt,
  'long-sleeves': Shirt,
  'mug': Coffee,
  'mugs': Coffee,
  'bag': ShoppingBag,
  'bags': ShoppingBag,
  'hat': Heart,
  'hats': Heart,
  'phone-case': Smartphone,
  'phone-cases': Smartphone,
};

export default function ProductsSidebar() {
  const searchParams = useSearchParams();
  const currentType = (searchParams.get('type') || '').trim();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTypes() {
      const { data } = await supabase
        .from('supplier_products')
        .select('product_type')
        .eq('status', 'APPROVED');
      
      if (data) {
        const unique = new Map();
        data.forEach(p => {
          const slug = slugifyType(p.product_type);
          unique.set(slug, p.product_type);
        });
        setTypes(Array.from(unique.entries()).sort((a, b) => a[1].localeCompare(b[1])));
      }
      setLoading(false);
    }
    fetchTypes();
  }, []);

  return (
    <aside className="w-64 border-r border-[#e5e3d7] flex flex-col sticky top-0 h-screen overflow-y-auto no-scrollbar bg-[#fbfaf6] pb-10 flex-shrink-0">
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
        <h3 className="px-3 text-[11px] font-bold text-[#8a8670] uppercase tracking-widest mb-4">Catalog</h3>
        <div className="space-y-1">
          {/* All Products */}
          <Link href="/products">
            <div 
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                !currentType 
                  ? "bg-[#2d2b1f] text-white shadow-md shadow-black/10" 
                  : "text-[#6b6850] hover:bg-[#e5e3d7]/50 hover:text-[#1c211f]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Grid className={`w-4 h-4 ${!currentType ? "text-[#A1FF4D]" : "opacity-70"}`} />
                <span className="text-[13px] font-bold uppercase tracking-tight">All Products</span>
              </div>
            </div>
          </Link>

          {/* Dynamic Categories */}
          {types.map(([slug, label]) => {
            const Icon = ICON_MAP[slug] || Library;
            const isActive = currentType === slug;
            return (
              <Link key={slug} href={`/products?type=${encodeURIComponent(slug)}`}>
                <div 
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? "bg-[#2d2b1f] text-white shadow-md shadow-black/10" 
                      : "text-[#6b6850] hover:bg-[#e5e3d7]/50 hover:text-[#1c211f]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#A1FF4D]" : "opacity-70"}`} />
                    <span className="text-[13px] font-bold uppercase tracking-tight">{label}</span>
                  </div>
                </div>
              </Link>
            );
          })}

          {loading && (
            <div className="px-3 py-4 space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className="px-6 py-6 mt-auto border-t border-[#e5e3d7]/50">
        <div className="bg-[#2d2b1f] rounded-2xl p-5 text-white overflow-hidden relative">
           <div className="absolute top-0 right-0 w-16 h-16 bg-[#A1FF4D]/10 rounded-full blur-xl" />
           <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">New Drops</h4>
           <p className="text-[12px] font-bold mb-3">Fresh styles added daily.</p>
           <button className="text-[9px] font-black uppercase text-[#A1FF4D] hover:underline">View New Arrivals →</button>
        </div>
      </div>
    </aside>
  );
}
