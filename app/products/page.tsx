"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type SupplierProduct = {
  id: string;
  name: string;
  description: string | null;
  product_type: string;
  price: number;
  image_url: string | null;
  tags: string[] | null;
  available_colors: Array<{ name?: string; hex?: string }> | null;
  supplier?: { full_name?: string | null } | null;
};

function slugifyType(type: string) {
  return (type || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center text-gray-500 font-medium">
          Loading…
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const typeFilter = (searchParams.get("type") || "").trim();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("supplier_products")
        .select("*, supplier:profiles(full_name)")
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error) setError(error.message);
      setProducts((data as SupplierProduct[]) || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!typeFilter) return products;
    const wanted = typeFilter.toLowerCase();
    return products.filter((p) => slugifyType(p.product_type) === wanted);
  }, [products, typeFilter]);

  const types = useMemo(() => {
    const unique = new Map<string, string>();
    for (const p of products) {
      unique.set(slugifyType(p.product_type), p.product_type);
    }
    return Array.from(unique.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [products]);

  return (
    <div className="p-4 md:p-8">
      {/* Page Header Area */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-[#A1FF4D]" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              Stenvio Catalog
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#111] uppercase tracking-tighter">
            {typeFilter ? typeFilter.replace(/-/g, ' ') : 'All Products'}
          </h1>
        </div>

        {!loading && (
          <div className="bg-white border border-gray-100 px-6 py-3 rounded-2xl shadow-sm">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mr-2">Results:</span>
            <span className="text-sm font-black text-[#111]">{filtered.length}</span>
          </div>
        )}
      </div>

      {/* Grid Area */}
      <div className="min-w-0">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-white border border-gray-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-10 rounded-[2rem] text-center">
            <p className="text-red-600 font-bold mb-2 tracking-tight text-lg">Catalog unavailable</p>
            <p className="text-red-400 text-sm max-w-md mx-auto">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center bg-white border border-gray-100 rounded-[2rem]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-200">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 14l6-6M9 8l6 6" />
               </svg>
            </div>
            <h3 className="text-2xl font-black text-[#111] mb-2">No matching products</h3>
            <p className="text-gray-400 text-sm font-medium">We couldn't find anything in the "{typeFilter}" category.</p>
            <Link href="/products" className="inline-block mt-8 px-8 py-3 bg-[#111] text-white rounded-xl text-xs font-black uppercase hover:bg-[#A1FF4D] hover:text-[#1B2412] transition-all">
              Explore All Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="h-64 bg-gray-50 overflow-hidden relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-100">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                    {(product.tags || []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/95 backdrop-blur-sm text-[#111] text-[9px] font-black px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[10px] font-black text-[#1B2412]">
                      {product.supplier?.full_name?.[0]?.toUpperCase() || "S"}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                      {product.supplier?.full_name}
                    </span>
                  </div>

                  <h3 className="font-black text-[#111] text-base mb-2 leading-tight group-hover:text-[#A1FF4D] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-6 line-clamp-2 font-medium leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">
                        {product.product_type}
                      </span>
                      <p className="text-lg font-black text-[#111]">
                        ${product.price.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={`/product/${product.id}`}
                      className="bg-[#111] text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-[#A1FF4D] hover:text-[#1B2412] transition-all shadow-lg hover:shadow-[#A1FF4D]/20 group/btn"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover/btn:translate-x-0.5 transition-transform">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

