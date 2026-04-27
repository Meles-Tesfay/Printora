"use client";

import React, { useState, useEffect, use } from 'react';
import { ChevronRight, ChevronLeft, Check, Loader2, AlertCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('supplier_products')
          .select('*, supplier:profiles(full_name)')
          .eq('id', productId)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-10 h-10 text-[#A1FF4D] animate-spin mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-gray-400 animate-pulse">Loading Product Details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-[#111] mb-2 uppercase tracking-tight">Product Not Found</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">The product you're looking for might have been removed or the link is invalid.</p>
          <Link href="/products" className="inline-block px-8 py-3 bg-[#111] text-white rounded-xl text-xs font-black uppercase hover:bg-[#A1FF4D] hover:text-[#1B2412] transition-all">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  // Use product image or fallback
  const displayImages = product.image_url ? [product.image_url] : ['https://placehold.co/800x800/f3f4f6/4b5563?text=No+Image+Available'];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navigation / Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Catalog</Link>
          <ChevronRight size={12} className="text-gray-300" />
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Images (5 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full aspect-square bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm group">
              <img 
                src={displayImages[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                 <span className="bg-[#A1FF4D] text-[#1B2412] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                   {product.product_type}
                 </span>
              </div>
            </div>
          </div>

          {/* Right Side: Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[10px] font-black text-[#1B2412]">
                  {product.supplier?.full_name?.[0]?.toUpperCase() || 'S'}
                </div>
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                  {product.supplier?.full_name || 'Verified Supplier'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-[#111] uppercase tracking-tighter leading-[0.9] mb-4">
                {product.name}
              </h1>
              
              <p className="text-3xl font-black text-[#111] mb-6 tracking-tight">
                ${product.price.toLocaleString()}
              </p>
              
              <div className="h-[1px] w-full bg-gray-100 mb-8" />
              
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Description</h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-10 text-[15px]">
                {product.description || 'No description provided for this premium blank product.'}
              </p>

              {/* Design Box */}
              <div className="bg-[#111] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-black/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#A1FF4D]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-xl font-black uppercase tracking-tight mb-2 flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#A1FF4D]" />
                  Ready to Create?
                </h3>
                <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                  Start your design process now with our professional-grade editor. Add your logos, text, and graphics instantly.
                </p>
                
                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#A1FF4D]/20 flex items-center justify-center">
                      <Check size={12} className="text-[#A1FF4D]" strokeWidth={4} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-300">High-Res Templates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#A1FF4D]/20 flex items-center justify-center">
                      <Check size={12} className="text-[#A1FF4D]" strokeWidth={4} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-300">Live 3D Preview</span>
                  </div>
                </div>

                <Link 
                  href={`/editor?supplier_product_id=${encodeURIComponent(product.id)}`}
                  className="group relative block w-full bg-[#A1FF4D] text-[#1B2412] py-5 rounded-2xl font-black uppercase text-sm text-center shadow-lg hover:shadow-[#A1FF4D]/30 transition-all active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Designing
                    <ChevronRight size={18} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
