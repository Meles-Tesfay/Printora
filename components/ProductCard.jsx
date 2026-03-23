'use client';

import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Zap } from 'lucide-react';
import Link from 'next/link';

/* ── Stenvio-style tiled "CUSTOMIZE ME" overlay ── */
const DesignOverlay = () => {
  const COLS = 4;
  const ROWS = 5;
  const tiles = Array.from({ length: COLS * ROWS });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#1c211f]/30 backdrop-blur-[2px]" />

      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {tiles.map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-center border border-white/10"
          >
            <div className="flex flex-col items-center leading-none rotate-[-12deg] select-none opacity-40">
              <span className="font-black text-white text-[6px] tracking-widest">STENVIO</span>
              <span className="font-black text-white text-[6px] tracking-widest mt-0.5">ART</span>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex flex-col items-center justify-center bg-white rounded-xl px-5 py-4 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-500"
          style={{ minWidth: 120 }}
        >
          <Zap className="w-5 h-5 text-[#f1c40f] mb-1.5 animate-pulse" fill="#f1c40f" />
          <span className="font-black text-[#1c211f] text-[11px] leading-tight tracking-[0.2em]">CUSTOMIZE</span>
          <span className="font-bold text-[#8a8670] text-[13px] leading-tight tracking-wide">YOUR OWN</span>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const templateId = product.editorTemplateId || 'classic-tshirt';
  const productSlug = encodeURIComponent(product.slug || String(product.id));

  const safeImage = hasImageError
    ? (product.fallbackImage || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&auto=format&fit=crop&q=80')
    : product.image;

  return (
    <Link href={`/editor?template=${templateId}&product=${productSlug}`} className="block group">
      <div
        className="relative flex flex-col bg-white rounded-2xl transition-all duration-300 hover:shadow-[0_20px_50px_rgba(28,33,31,0.12)] border border-transparent hover:border-[#e5e3d7]/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ── Image Container ── */}
        <div className="relative aspect-[1/1] sm:aspect-[4/5] w-full overflow-hidden bg-[#f0f0eb] rounded-t-2xl">
          <img
            src={safeImage}
            alt={product.title}
            className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-110"
            onError={() => setHasImageError(true)}
          />

          {/* Design overlay */}
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <DesignOverlay />
          </div>

          {/* Heart Icon */}
          <button className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex items-center justify-center hover:bg-white hover:scale-110 active:scale-90">
            <Heart size={18} className="text-[#1c211f] hover:text-red-500 transition-colors" strokeWidth={2} />
          </button>

          {/* Bestseller Badge */}
          {product.isBestseller && (
            <div className="absolute bottom-4 left-4 bg-[#ffbe76] text-[#1c211f] text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg z-20 shadow-sm flex items-center gap-1.5 border border-[#e67e22]/20">
              <Star size={10} fill="#1c211f" />
              Bestseller
            </div>
          )}

          {/* New Badge */}
          {product.isNew && !product.isBestseller && (
            <div className="absolute bottom-4 left-4 bg-[#7ed6df] text-[#1c211f] text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg z-20 shadow-sm border border-[#22a6b3]/20">
              New Arrival
            </div>
          )}
        </div>

        {/* ── Product Details ── */}
        <div className="flex flex-col p-5">
          <div className="flex items-center gap-2 mb-1.5">
             <span className="px-2 py-0.5 bg-[#f0f0eb] text-[#8a8670] text-[10px] font-bold rounded uppercase tracking-wider">
               {product.brand.split('•')[0].trim()}
             </span>
             {product.providers && (
               <span className="text-[10px] text-[#8a8670] font-medium italic">
                 {product.providers} providers
               </span>
             )}
          </div>
          
          <h3 className="font-black text-[#1c211f] text-[16px] leading-tight mb-2 min-h-[2.5rem] line-clamp-2 group-hover:text-[#2d2b1f] transition-colors tracking-tight">
            {product.title}
          </h3>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-[12px] font-bold text-[#8a8670]">FROM</span>
              <span className="font-black text-[#1c211f] text-[18px]">{product.price.toLocaleString()} ETB</span>
            </div>

            {product.premiumPrice && (
              <div className="flex items-center gap-1.5 py-2 px-3 bg-[#f1fcf7] rounded-xl border border-[#00b894]/10">
                <div className="p-1 bg-[#00b894] rounded-full">
                   <Zap size={10} className="text-white" fill="white" />
                </div>
                <p className="text-[13px] font-bold text-[#00b894] tracking-tight">
                  <span className="opacity-70 text-[11px] font-semibold text-gray-500 mr-1 uppercase">OR</span>
                  {product.premiumPrice.toLocaleString()} ETB
                  <span className="text-[10px] font-medium text-gray-500 ml-1.5 italic">with Stenvio Premium</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#f0f0eb]">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-[#8a8670] uppercase">Sizes</span>
                <span className="text-[12px] font-bold text-[#1c211f]">{product.sizes}+</span>
              </div>
              <div className="flex flex-col border-l border-[#f0f0eb] pl-4">
                <span className="text-[10px] font-black text-[#8a8670] uppercase">Colors</span>
                <span className="text-[12px] font-bold text-[#1c211f]">{product.colors}+</span>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-[#1c211f] flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
              <ShoppingBag size={14} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
