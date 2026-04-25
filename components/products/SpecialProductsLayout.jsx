import React from 'react';

const SpecialProductsLayout = ({ title, description, children }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,#86efac40,transparent_70%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="mb-10 rounded-3xl border border-emerald-100/80 bg-white/80 backdrop-blur-sm shadow-sm p-6 sm:p-8">
          <p className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 tracking-wide">
            Special Design
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-3xl">
            {description}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default SpecialProductsLayout;
