import React from 'react';
import ProductsSidebar from '@/components/ProductsSidebar';

export default function ProductsLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white font-sans text-[#1c211f]">
      {/* Shared Sidebar across all product pages */}
      <ProductsSidebar />

      {/* Main Dashboard Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#fbfaf6]">
        {children}
      </main>
    </div>
  );
}
