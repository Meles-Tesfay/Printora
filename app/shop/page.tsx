"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, ArrowRight, ShoppingBag, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

// --- MOCK DATA BASED ON USER IMAGES ---
const CATEGORIES = ["All", "Apparel", "Accessories", "Home", "Stationery", "Tech"];

const TYPOGRAPHIC_PRODUCTS = [
  { 
    id: 1, 
    bg: "#CEFF00", 
    tags: ["Apparel", "Bestseller"], 
    iconBg: "#111", 
    iconColor: "#CEFF00", 
    title: "T-Shirts &\nHoodies", 
    desc: "For fashion brands and personal styles.\nPremium fabric, vivid prints.", 
    textColor: "#111" 
  },
  { 
    id: 2, 
    bg: "#F5EFE5", 
    tags: ["Accessories", "Trending"], 
    iconBg: "#E8E1D5", 
    iconColor: "#fff", 
    title: "Bags &\nTote Bags", 
    desc: "Stylish carry-alls printed with your\nunique design. Perfect for gifting and\nreselling.", 
    textColor: "#111" 
  },
  { 
    id: 3, 
    bg: "#F5EFE5", 
    tags: ["Home", "All levels"], 
    iconBg: "#E8E1D5", 
    iconColor: "#fff", 
    title: "Mugs &\nDrinkware", 
    desc: "Custom mugs that start every morning\nwith your brand — from beginner to\nadvanced sellers.", 
    textColor: "#111" 
  },
  { 
    id: 4, 
    bg: "#5BC2E7", 
    tags: ["Stationery"], 
    iconBg: "#4BAAD0", 
    iconColor: "#fff", 
    title: "Posters &\nID badges", 
    desc: "Museum-quality prints of your artwork\nshipped directly to your customers\nworldwide.", 
    textColor: "#111" 
  },
  { 
    id: 5, 
    bg: "#E4DDF9", 
    tags: ["Accessories", "Tech"], 
    iconBg: "#D4CCED", 
    iconColor: "#4B3B6E", 
    title: "Hats &\nPhone Cases", 
    desc: "Premium headwear and durable cases\nto protect and style your everyday\nessentials.", 
    textColor: "#111" 
  },
];

export default function ShopPage() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile) setUserRole(profile.role);
      }
    };
    fetchUser();
  }, []);

  // Filter Logic
  let filteredProducts = TYPOGRAPHIC_PRODUCTS.filter(p => {
    if (activeCategory !== "All" && !p.tags.includes(activeCategory)) return false;
    if (searchQuery && !p.title.toLowerCase().replace(/\n/g, ' ').includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-[#9DF542] selection:text-[#111]">
      {/* Navigation */}
      <div className="w-full flex justify-center sticky top-1 lg:top-2 z-50 px-4 lg:px-6">
        <header className="w-full max-w-7xl bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200/50 rounded-[2rem] h-[76px] lg:h-[84px] flex items-center px-6 lg:px-10 relative">
          <div className="flex-1 flex items-center">
            <Link href="/">
              <img src="/logo.png" alt="Stenvo Logo" className="h-[56px] md:h-[68px] w-auto cursor-pointer object-contain relative z-10 -ml-1 transition-transform hover:scale-105" />
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <Link href="/shop" className="text-[17px] font-medium text-[#525f48] transition-colors relative">
              Shop
              <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-1 bg-[#9DF542] rounded-full" />
            </Link>
            <Link href="/#pricing" className="text-[17px] font-normal text-[#2d3227] hover:text-[#525f48] transition-colors">Pricing</Link>
            <Link href="/how-it-works" className="text-[17px] font-normal text-[#2d3227] hover:text-[#525f48] transition-colors">How it works</Link>
          </nav>
          <div className="flex-1 flex items-center justify-end gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-full px-3 pr-4 py-1.5 hover:shadow-md transition-all group">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#A1FF4D]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[#1B2412] font-black text-sm">
                      {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-[14px] font-bold text-[#1B2412] max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold text-[#1B2412] truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="p-2">
                      {userRole === "ADMIN" && <Link href="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"><ShoppingBag size={15} /> Admin Panel</Link>}
                      {userRole === "SUPPLIER" && <Link href="/supplier" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"><ShoppingBag size={15} /> Supplier Panel</Link>}
                      {userRole === "CUSTOMER" && <Link href="/orders" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-700 hover:bg-gray-100 transition-colors"><ShoppingBag size={15} /> Orders</Link>}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button onClick={async () => { await supabase.auth.signOut(); setShowUserMenu(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold text-red-500 hover:bg-red-50 transition-colors w-full">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hidden sm:flex items-center justify-center rounded-full px-6 h-11 text-[16px] font-bold text-[#1B2412] hover:bg-gray-100 transition-colors">Log in</Link>
                <Link href="/signup" className="flex items-center justify-center rounded-full px-6 h-11 text-[16px] font-bold bg-[#111] text-white hover:bg-black transition-colors shadow-md">Sign up</Link>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#9DF542]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#9DF542]/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold text-[#111] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Explore Categories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Find the perfect premium canvas for your designs, ranging from apparel to home accessories.
          </motion.p>
        </div>
      </section>

      {/* Sticky Filter & Search Bar */}
      <section className="sticky top-[88px] lg:top-[100px] z-40 px-6 py-4 transition-all">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-[2rem] p-2 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto px-2 pb-2 md:pb-0 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    activeCategory === cat 
                      ? "bg-[#111] text-[#fff] shadow-md scale-105" 
                      : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-[#111] hover:scale-105"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 w-full md:w-auto px-2">
              <div className="relative flex-1 md:w-64 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400 group-focus-within:text-[#111] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#fafafa] border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#111]/10 focus:border-[#111] hover:shadow-[0_0_15px_rgba(0,0,0,0.05)] transition-all duration-300"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Typographic Product Cards Grid */}
      <section className="py-12 px-6 flex-1">
        <div className="container mx-auto max-w-7xl">
          
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Search size={40} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#111] mb-3">No categories found</h3>
              <button 
                onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                className="px-8 py-3 bg-[#111] text-white font-bold rounded-full hover:bg-black transition-colors shadow-lg mt-4"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            /* CSS Grid for the typographic cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col justify-between p-8 pt-10 rounded-[2rem] min-h-[420px] cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-xl"
                  style={{ backgroundColor: product.bg }}
                >
                  {/* Top: Tags & Icon */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, i) => (
                        <span key={i} className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[13px] font-medium text-gray-800 shadow-sm transition-transform group-hover:scale-105">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div 
                      className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:rotate-45"
                      style={{ backgroundColor: product.iconBg }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={product.iconColor}>
                        <polygon points="12 2 22 22 2 22" />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom: Typography Info */}
                  <div className="mt-16">
                    <h3 
                      className="text-[32px] sm:text-[36px] font-normal leading-[1.05] mb-5 tracking-tight transition-all group-hover:opacity-90" 
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: product.textColor, whiteSpace: 'pre-line' }}
                    >
                      {product.title}
                    </h3>
                    <p 
                      className="text-[15px] leading-[1.6] opacity-90 transition-all group-hover:opacity-100" 
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: product.textColor, whiteSpace: 'pre-line' }}
                    >
                      {product.desc}
                    </p>
                  </div>

                  {/* Interactive Hover Overlay Border */}
                  <div className="absolute inset-0 border-2 border-black/0 rounded-[2rem] transition-colors duration-500 group-hover:border-black/5 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Strip */}
      <section className="py-24 relative overflow-hidden bg-[#111] rounded-t-[3rem] mt-12 mx-4 lg:mx-8 shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-[#CEFF00]/10 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Ready to create your <br className="hidden md:block"/> <span className="text-[#CEFF00]">custom product?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md">Join thousands of creators using our studio to bring ideas to life instantly.</p>
            </div>
            <Link href="/shop" className="shrink-0 flex items-center gap-3 bg-[#CEFF00] text-[#111] font-bold text-lg py-5 px-10 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(206,255,0,0.2)] group">
              Start Designing <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-white overflow-hidden mt-0">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-20 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-4">
              <div className="mb-8">
                <img src="/logo-white.png" alt="Stenvo" className="h-[44px] md:h-[52px] w-auto mb-2 object-contain" />
              </div>
              <h4 className="text-[#CEFF00] font-bold text-[20px] mb-4">About Us</h4>
              <p className="text-white text-[16px] leading-[1.8] mb-8 font-medium">
                We want to help bring talented students and unique startups together.
              </p>
              <h4 className="text-[#CEFF00] font-bold text-[20px] mb-4">Contact Us</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-white text-[16px] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CEFF00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.74a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                  +91 9999 999 999
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 lg:ml-10">
              <h4 className="text-[#CEFF00] font-bold text-[20px] mb-6">Information</h4>
              <ul className="flex flex-col gap-5">
                {['About Us', 'More Search', 'Blog', 'Testimonials', 'Events'].map(link => (
                  <li key={link}><Link href="#" className="text-white text-[17px] font-medium hover:text-[#CEFF00] transition-colors">{link}</Link></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[#CEFF00] font-bold text-[20px] mb-6">Helpful Links</h4>
              <ul className="flex flex-col gap-5">
                {['Services', 'Supports', 'Terms & Conditions', 'Privacy Policy'].map(link => (
                  <li key={link}><Link href="#" className="text-white text-[17px] font-medium hover:text-[#CEFF00] transition-colors">{link}</Link></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-4">
              <h4 className="text-white font-bold text-[20px] mb-6">Subscribe More Info</h4>
              <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <input type="email" placeholder="Enter your Email" className="bg-transparent text-[16px] text-[#111] placeholder-gray-500 outline-none flex-1 font-medium" />
              </div>
              <button className="bg-[#CEFF00] text-[#111] font-bold text-[17px] py-3 px-8 rounded-lg hover:bg-[#b8e600] transition-colors w-max">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-1/3 flex items-center justify-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#CEFF00] flex items-center justify-center hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="#111"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#CEFF00] flex items-center justify-center hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="#111"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#CEFF00] flex items-center justify-center hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
            </div>
            <div className="md:w-1/3 flex justify-end">
              <p className="text-white/70 text-[15px] font-medium">2024 © company Ltd. All Right reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
