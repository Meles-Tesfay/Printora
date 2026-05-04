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
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-[13px] font-black tracking-widest text-gray-500 hover:text-gray-900 transition-colors uppercase"
            >
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-[13px] font-black tracking-widest text-gray-900 uppercase">
              Products
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-[12px] font-black tracking-widest uppercase border transition-colors ${
                !typeFilter
                  ? "bg-[#111] text-white border-[#111]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
              }`}
            >
              All
            </Link>
            {types.map(([slug, label]) => (
              <Link
                key={slug}
                href={`/products?type=${encodeURIComponent(slug)}`}
                className={`px-4 py-2 rounded-full text-[12px] font-black tracking-widest uppercase border transition-colors ${
                  typeFilter === slug
                    ? "bg-[#111] text-white border-[#111]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-gray-500 font-medium">Loading products…</div>
        ) : error ? (
          <div className="text-red-600 font-medium">Failed to load: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500 font-medium">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-52 bg-gray-50 overflow-hidden relative">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {(product.tags || []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/90 backdrop-blur-sm text-[#111] text-[9px] font-black px-2 py-1 rounded-full shadow-sm uppercase tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[9px] font-black text-[#1B2412]">
                      {product.supplier?.full_name?.[0]?.toUpperCase() || "S"}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">
                      {product.supplier?.full_name}
                    </span>
                  </div>

                  <h3 className="font-black text-[#111] text-base mb-1 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2 font-medium">
                    {product.description}
                  </p>

                  {product.available_colors?.length ? (
                    <div className="flex gap-1.5 mb-4 flex-wrap">
                      {product.available_colors.slice(0, 8).map((c, idx) => (
                        <div
                          key={`${c.hex || "x"}-${idx}`}
                          title={c.name}
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: c.hex || "#e5e7eb" }}
                        />
                      ))}
                      {product.available_colors.length > 8 ? (
                        <span className="text-[9px] font-bold text-gray-400">
                          +{product.available_colors.length - 8}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {product.product_type}
                      </span>
                      <p className="text-lg font-black text-[#111]">
                        ${product.price}
                      </p>
                    </div>
                    <Link
                      href={`/editor?supplier_product_id=${encodeURIComponent(
                        product.id
                      )}`}
                      className="bg-[#111] text-white px-4 py-2.5 rounded-xl font-black text-xs hover:bg-[#A1FF4D] hover:text-[#1B2412] transition-all active:scale-95"
                    >
                      Design →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

