"use client";

import Link from "next/link";

export default function ProductsByTypePage({
  params,
}: {
  params: { type: string };
}) {
  const type = (params.type || "").trim();
  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white border border-gray-100 rounded-[2rem] p-8 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
        <p className="text-[12px] font-black uppercase tracking-[0.15em] text-[#A1FF4D] mb-2">
          Category
        </p>
        <h1 className="text-[28px] font-black text-[#111] leading-tight">
          {type.replace(/-/g, " ")}
        </h1>
        <p className="text-gray-500 font-medium text-sm mt-2">
          Showing products for this category.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/products?type=${encodeURIComponent(type)}`}
            className="bg-[#111] text-white px-5 py-3 rounded-xl font-black text-xs hover:bg-[#A1FF4D] hover:text-[#1B2412] transition-all active:scale-95"
          >
            Browse products →
          </Link>
          <Link
            href="/"
            className="px-5 py-3 rounded-xl font-black text-xs border border-gray-200 text-gray-700 hover:border-gray-400 transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

