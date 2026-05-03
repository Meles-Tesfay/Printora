"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, Send, Star, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white overflow-hidden border-t border-gray-800/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="mb-8 block transform hover:scale-105 transition-transform">
              <img src="/logo-white.png" alt="Stenvo" className="h-10 md:h-12 w-auto object-contain" />
            </Link>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
              Empowering creators and brands to bring their unique visions to life through premium custom apparel.
            </p>
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center sm:justify-start gap-4 text-gray-400 hover:text-[#9DF542] transition-colors group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#9DF542]/20 transition-colors">
                  <Phone size={14} className="text-[#9DF542]" />
                </div>
                <span className="text-sm font-medium">+251 900 000 000</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-4 text-gray-400 hover:text-[#9DF542] transition-colors group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#9DF542]/20 transition-colors">
                  <Mail size={14} className="text-[#9DF542]" />
                </div>
                <span className="text-sm font-medium">hello@stenvo.com</span>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <h4 className="text-[#9DF542] font-bold text-sm mb-6 uppercase tracking-[0.2em]">Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Before You Start', href: '/before-you-start' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm md:text-base font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <h4 className="text-[#9DF542] font-bold text-sm mb-6 uppercase tracking-[0.2em]">Support</h4>
            <ul className="space-y-4">
              {[
                { label: 'Contact', href: '/contact' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Help', href: '/help' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm md:text-base font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-2 text-center sm:text-left">
            <h4 className="text-[#9DF542] font-bold text-sm mb-6 uppercase tracking-[0.2em]">Legal</h4>
            <ul className="space-y-4">
              {[
                { label: 'Terms', href: '/terms' },
                { label: 'Privacy', href: '/privacy' }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm md:text-base font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Section */}
          <div className="lg:col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-white font-bold text-lg mb-4 tracking-tight">Start Creating</h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Join thousands of creators who are already bringing their ideas to life with our premium printing platform.
            </p>
            <Link 
              href="/products" 
              className="w-full bg-[#9DF542] text-[#111] py-4 px-8 rounded-2xl font-black text-lg transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-[0_20px_40px_rgba(157,245,66,0.2)] flex items-center justify-center gap-3 mb-6 active:scale-[0.98] group"
            >
              Start Designing
              <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 w-full">
              <div className="w-8 h-8 rounded-full bg-[#9DF542]/20 flex items-center justify-center shrink-0">
                <Star size={16} className="text-[#9DF542]" fill="currentColor" />
              </div>
              <p className="text-[11px] font-bold text-white leading-tight">
                Top Rated Platform <br />
                <span className="text-gray-500 font-medium">Trusted by 10k+</span>
              </p>
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


        </div>
      </div>
    </footer>
  );
}
