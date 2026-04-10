'use client';

import React from 'react';
import { Ruler, FileText, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';

const SupplierInfoSection = ({ category, specs }) => {
  return (
    <section className="mt-20 border-t border-[#f0f0eb] pt-16 pb-24 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#bc9368] mb-4 block">Supplier Transparency</span>
            <h2 className="text-4xl font-black text-[#1c211f] tracking-tight uppercase leading-none">
              Production <span className="text-[#bc9368]">Standards</span>
            </h2>
            <p className="text-[#8a8670] mt-4 max-w-xl text-lg">
              Essential technical specifications for {category} production. These details ensure consistent quality across our local supplier network.
            </p>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-white border border-[#e5e3d7] rounded-full shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-[#2ecc71]" />
            <span className="text-sm font-bold text-[#1c211f]">Verified Local Supplier Standards</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Print Area */}
          <div className="bg-white p-8 rounded-3xl border border-[#e5e3d7] hover:shadow-xl transition-all duration-500 group">
            <div className="w-12 h-12 bg-[#f0f0eb] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#bc9368] group-hover:text-white transition-colors">
              <Ruler className="w-6 h-6" />
            </div>
            <h3 className="font-black text-[#1c211f] text-lg uppercase tracking-tight mb-2">Print Area</h3>
            <p className="text-[#8a8670] text-sm leading-relaxed mb-4">{specs.printAreaDescription}</p>
            <div className="text-2xl font-black text-[#1c211f]">{specs.printArea}</div>
          </div>

          {/* File Requirements */}
          <div className="bg-white p-8 rounded-3xl border border-[#e5e3d7] hover:shadow-xl transition-all duration-500 group">
            <div className="w-12 h-12 bg-[#f0f0eb] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#bc9368] group-hover:text-white transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-black text-[#1c211f] text-lg uppercase tracking-tight mb-2">File Specs</h3>
            <ul className="space-y-2">
              {specs.fileRequirements.map((req, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[#8a8670]">
                   <div className="w-1 h-1 rounded-full bg-[#bc9368]" />
                   {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Material & Tech */}
          <div className="bg-white p-8 rounded-3xl border border-[#e5e3d7] hover:shadow-xl transition-all duration-500 group">
            <div className="w-12 h-12 bg-[#f0f0eb] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#bc9368] group-hover:text-white transition-colors">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="font-black text-[#1c211f] text-lg uppercase tracking-tight mb-2">Materials</h3>
            <p className="text-[#8a8670] text-sm leading-relaxed mb-4">{specs.materialDescription}</p>
            <div className="flex flex-wrap gap-2">
              {specs.techniques.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-[#f0f0eb] text-[#1c211f] text-[10px] font-black uppercase rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-[#1c211f] p-8 rounded-3xl text-white hover:shadow-xl transition-all duration-500">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <AlertCircle className="w-6 h-6 text-[#bc9368]" />
            </div>
            <h3 className="font-black text-lg uppercase tracking-tight mb-2">Supplier Note</h3>
            <p className="text-white/60 text-sm leading-relaxed italic">
              "All products must undergo a quality check before fulfillment. Suppliers are required to use eco-friendly inks where possible."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplierInfoSection;
