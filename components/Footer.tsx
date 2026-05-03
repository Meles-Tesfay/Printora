"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Send, Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white overflow-hidden border-t border-gray-800/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="mb-8 block transform hover:scale-105 transition-transform">
              <img src="/logo-white.png" alt="Stenvo" className="h-12 md:h-14 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-sm">
              Empowering creators and brands to bring their unique visions to life through premium custom apparel and merchandise.
            </p>
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-4 text-gray-300 hover:text-[#9DF542] transition-colors group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#9DF542]/20 transition-colors">
                  <Phone size={18} className="text-[#9DF542]" />
                </div>
                <span className="font-medium">+251 900 000 000</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-4 text-gray-300 hover:text-[#9DF542] transition-colors group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#9DF542]/20 transition-colors">
                  <Mail size={18} className="text-[#9DF542]" />
                </div>
                <span className="font-medium">hello@stenvo.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8 lg:ml-8">
            <div className="text-center sm:text-left">
              <h4 className="text-[#9DF542] font-bold text-lg mb-6 uppercase tracking-wider">Explore</h4>
              <ul className="space-y-4">
                {['Home', 'Products', 'Inspiration', 'How it works', 'Pricing'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-[#9DF542] font-bold text-lg mb-6 uppercase tracking-wider">Support</h4>
              <ul className="space-y-4">
                {['FAQ', 'Contact', 'Shipping', 'Terms', 'Privacy'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-white font-bold text-xl mb-6">Stay in the Loop</h4>
            <p className="text-gray-400 mb-8 text-base">Get the latest design trends and exclusive offers delivered to your inbox.</p>
            <div className="relative w-full group">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-[#9DF542] focus:ring-1 focus:ring-[#9DF542] transition-all text-white placeholder-gray-500"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-[#9DF542] text-[#111] px-6 rounded-xl font-bold hover:bg-[#88e029] transition-colors flex items-center gap-2">
                <span className="hidden sm:inline">Join</span>
                <Send size={16} />
              </button>
            </div>
            
            {/* Trust Badge */}
            <div className="mt-10 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 w-full">
              <div className="w-12 h-12 rounded-full bg-[#9DF542]/20 flex items-center justify-center shrink-0">
                <Star size={24} className="text-[#9DF542]" fill="currentColor" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Top Rated Platform</p>
                <p className="text-xs text-gray-500">Trusted by 10k+ creators</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Social Links */}
          <div className="flex items-center gap-4 order-2 md:order-1">
            {[
              { icon: Facebook, href: "#" },
              { icon: Twitter, href: "#" },
              { icon: Instagram, href: "#" }
            ].map((social, i) => (
              <Link 
                key={i} 
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#9DF542] hover:text-[#111] transition-all transform hover:-translate-y-1"
              >
                <social.icon size={20} />
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-gray-500 text-sm font-medium order-3 md:order-2">
            © {new Date().getFullYear()} Stenvo. All Rights Reserved.
          </p>

          {/* Extras */}
          <div className="flex items-center gap-6 order-1 md:order-3 text-sm font-medium text-gray-500">
            <Link href="#" className="hover:text-[#9DF542] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#9DF542] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[#9DF542] transition-colors">Cookies</Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
