'use client';

import React, { useState, useEffect } from 'react';
import { Check, Star, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Map URL param / slug → product_type string stored in DB
const PRODUCT_TYPE_MAP = {
  'classic-tshirt':     'Classic T-Shirt',
  'premium-hoodie':     'Premium Hoodie',
  'crewneck-sweater':   'Crewneck Sweater',
  'classic-cap':        'Classic Cap',
};

export default function ProductDetailPage({ params }) {
  const id = params?.id ?? 'classic-tshirt';
  const productType = PRODUCT_TYPE_MAP[id] ?? 'Classic T-Shirt';

  const product = {
    id,
    title: productType,
    brand: 'Gildan 5000',
    price: 16.73,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
      'https://placehold.co/800x800/f3f4f6/4b5563?text=Back+View',
      'https://placehold.co/800x800/f3f4f6/4b5563?text=Side+View',
      'https://placehold.co/800x800/f3f4f6/4b5563?text=Detail+View',
    ],
  };

  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews]         = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    const { data } = await supabase
      .from('custom_orders')
      .select('id, variants, created_at, profiles:customer_id(full_name)')
      .eq('status', 'DELIVERED')
      .eq('product_type', productType)
      .gt('variants->>customer_rating', '0');

    setReviews(data || []);
    setLoadingReviews(false);
  };

  /* ── Aggregate stats ── */
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? reviews.reduce((sum, r) => sum + Number(r.variants?.customer_rating || 0), 0) / totalReviews
    : 0;

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => Number(r.variants?.customer_rating) === s).length,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Images */}
        <div className="flex flex-col">
          <div className="relative w-full aspect-square bg-[#e5e5e5] rounded-md overflow-hidden mb-4 group cursor-zoom-in">
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-sm opacity-80 hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 hover:text-red-500 transition-colors">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImage === i ? 'border-green-600 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex flex-col pt-2">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">{product.title}</h1>

          {/* Inline aggregate rating badge */}
          {totalReviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">{avgRating.toFixed(1)}</span>
              <a href="#reviews" className="text-sm text-green-700 underline font-medium">
                {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </a>
            </div>
          )}

          <div className="flex items-center text-gray-600 text-lg mb-8">
            <span className="font-medium mr-2">{product.brand}</span>
            <a href="#" className="underline font-semibold hover:text-gray-900">Product details</a>
          </div>

          <ul className="list-disc list-inside space-y-2 text-gray-800 font-medium mb-12 ml-1">
            <li>100% Preshrunk cotton</li>
            <li>Medium fabric (5.3 oz/yd² (180 g/m²))</li>
            <li>Classic Fit</li>
            <li>Runs true to size</li>
            <li>Slight color variations may occur due to the dyeing process</li>
          </ul>

          {/* Stenvio Studio box */}
          <div className="bg-[#e2fccc] rounded-lg p-6 border border-[#c4eab0]">
            <div className="flex items-center mb-4">
              <span className="font-extrabold text-2xl tracking-tighter text-gray-900 italic mr-1">Stenvio</span>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Studio</span>
            </div>
            <p className="text-gray-900 font-medium mb-6 text-[15px]">
              Premium blanks, ready for your creative vision. High-quality materials for local craft.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-900">
                <Check className="text-green-700 mr-3" size={20} strokeWidth={3} />
                <span className="text-base font-bold text-gray-900 uppercase tracking-widest">In Stock &amp; Ready</span>
              </div>
              <div className="flex items-center text-gray-900">
                <Check className="text-green-700 mr-3" size={20} strokeWidth={3} />
                <span className="text-base"><strong>Local Fulfillment</strong> network</span>
              </div>
            </div>

            <Link href={`/editor`} className="block w-full group">
              <button
                className="relative w-full overflow-hidden rounded-xl py-4 px-6 font-extrabold text-lg text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-95"
                style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 40%, #14532d 100%)' }}
              >
                <span className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                <span className="relative flex items-center justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                    <circle cx="12" cy="8" r="6" />
                  </svg>
                  Customize
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-1">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Ratings & Reviews Section ── */}
      <section id="reviews" className="mt-20 border-t border-gray-100 pt-14">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare size={22} className="text-green-700" />
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Customer Reviews</h2>
        </div>

        {loadingReviews ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-green-600" />
          </div>
        ) : totalReviews === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Star size={36} className="text-gray-200 mb-3" />
            <p className="text-gray-500 font-bold text-sm">No reviews yet for this product.</p>
            <p className="text-gray-400 text-xs mt-1">Be the first to customize and review it!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
                <p className="text-5xl font-black text-gray-900 mb-1">{avgRating.toFixed(1)}</p>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} className={s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-medium mb-6">{totalReviews} verified review{totalReviews !== 1 ? 's' : ''}</p>

                {/* Bar breakdown */}
                <div className="space-y-2">
                  {starCounts.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-500 w-3">{star}</span>
                      <Star size={11} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                          style={{ width: totalReviews ? `${(count / totalReviews) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium w-4 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Review cards */}
            <div className="lg:col-span-3 space-y-5">
              {reviews.map((review) => {
                const name = review.profiles?.full_name || 'Anonymous';
                const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                const r = Number(review.variants?.customer_rating || 0);
                const fb = review.variants?.customer_feedback;
                const date = new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                return (
                  <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[#1B2412] font-black text-xs flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="font-bold text-gray-900 text-sm">{name}</p>
                          <span className="text-[11px] text-gray-400 font-medium">{date}</span>
                        </div>
                        <div className="flex gap-0.5 mt-1 mb-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={14} className={s <= r ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                          ))}
                        </div>
                        {fb ? (
                          <p className="text-sm text-gray-700 font-medium leading-relaxed">{fb}</p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No written review.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
