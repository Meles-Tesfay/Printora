"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircle, Phone, Mail, Clock, Send, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#9DF542] selection:text-[#111] pb-20">
      <Navbar />

      <main className="max-w-[1100px] mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-24">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16 md:mb-24 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-flex items-center justify-center px-5 py-1.5 rounded-full border border-orange-100 bg-orange-50/50 text-orange-600 text-xs font-bold tracking-widest uppercase mb-8">
            / GET IN TOUCH
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-medium text-[#111] tracking-tight mb-6 leading-[1.1]">
            We're here to help
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Reach out through any of our dedicated support channels. We usually respond within a few minutes to ensure your projects never miss a beat.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Telegram Card */}
          <a 
            href="https://t.me/StenvoSupport" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative bg-[#f8f9fa] rounded-[2rem] p-10 border border-gray-100 hover:border-[#0088cc]/30 hover:bg-[#f0f8fc] hover:shadow-[0_8px_30px_rgb(0,136,204,0.08)] transition-all duration-500 ease-out flex flex-col items-center md:items-start text-center md:text-left overflow-hidden"
          >
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] transform group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700 ease-out pointer-events-none text-[#0088cc]">
              <Send size={180} />
            </div>
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-8 group-hover:-translate-y-1 transition-transform duration-300">
              <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#0088cc]">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#111] mb-3">Telegram</h3>
            <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">The fastest way to reach our team for immediate assistance and quick questions.</p>
            <div className="mt-auto inline-flex items-center gap-2 text-[#0088cc] font-medium text-[15px] group-hover:translate-x-1 transition-transform duration-300">
              @StenvoSupport
              <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">&rarr;</span>
            </div>
          </a>

          {/* WhatsApp Card */}
          <a 
            href="https://wa.me/251900000000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative bg-[#f8f9fa] rounded-[2rem] p-10 border border-gray-100 hover:border-[#25D366]/30 hover:bg-[#f2fcf5] hover:shadow-[0_8px_30px_rgb(37,211,102,0.08)] transition-all duration-500 ease-out flex flex-col items-center md:items-start text-center md:text-left overflow-hidden"
          >
            <div className="absolute -bottom-6 -right-6 opacity-[0.03] transform group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700 ease-out pointer-events-none text-[#25D366]">
              <MessageCircle size={180} />
            </div>
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-8 group-hover:-translate-y-1 transition-transform duration-300">
              <MessageCircle size={22} className="text-[#25D366]" />
            </div>
            <h3 className="text-xl font-medium text-[#111] mb-3">WhatsApp</h3>
            <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">Perfect for sending order details, payment proofs, and getting direct support.</p>
            <div className="mt-auto inline-flex items-center gap-2 text-[#25D366] font-medium text-[15px] group-hover:translate-x-1 transition-transform duration-300">
              +251 900 000 000
              <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">&rarr;</span>
            </div>
          </a>

          {/* Email Card */}
          <a 
            href="mailto:support@stenvo.com" 
            className="group relative bg-[#f8f9fa] rounded-[2rem] p-10 border border-gray-100 hover:border-[#111]/10 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 ease-out flex flex-col items-center md:items-start text-center md:text-left overflow-hidden"
          >
            <div className="absolute -bottom-6 -right-6 opacity-[0.02] transform group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700 ease-out pointer-events-none text-[#111]">
              <Mail size={180} />
            </div>
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm mb-8 group-hover:-translate-y-1 transition-transform duration-300">
              <Mail size={22} className="text-[#111]" />
            </div>
            <h3 className="text-xl font-medium text-[#111] mb-3">Email</h3>
            <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">Best for formal communication, partnerships, and detailed inquiries.</p>
            <div className="mt-auto inline-flex items-center gap-2 text-[#111] font-medium text-[15px] group-hover:translate-x-1 transition-transform duration-300">
              support@stenvo.com
              <span className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">&rarr;</span>
            </div>
          </a>
        </div>


      </main>

      <Footer />
    </div>
  );
}
