"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, ArrowRight, ShoppingBag, LogOut, 
  Sparkles, PenTool, Image as ImageIcon, Type, Contrast, Lightbulb, Hexagon, Quote, Shapes, Briefcase,
  User, Gift, Users
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import PHOTOS from "./photos";
import MobileNav from "@/components/MobileNav";

export default function InspirationPage() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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


  const quickIdeas = [
    { title: "Personal Style", desc: "Express yourself with unique 1-of-1 pieces tailored to you.", icon: User, accent: "#9DF542", bg: "#f4fbe8" },
    { title: "Gifts", desc: "Meaningful, custom presents that leave a lasting impression.", icon: Gift, accent: "#FF8A65", bg: "#fff2ec" },
    { title: "Business", desc: "Professional uniforms and high-end promotional branding.", icon: Briefcase, accent: "#5C6BC0", bg: "#f0f2fa" },
    { title: "Events", desc: "Cohesive apparel for reunions, marathons, or major causes.", icon: Users, accent: "#26A69A", bg: "#e9f6f5" }
  ];

  const designDirections = [
    { name: "Minimal Text", desc: "Clean, simple typography that speaks volumes.", img: PHOTOS.card1_minimal_text, accent: "#9DF542" },
    { name: "Bold Graphic", desc: "Vibrant illustrations and eye-catching art.", img: PHOTOS.card2_bold_graphic, accent: "#FF8A65" },
    { name: "Quote-based", desc: "Your favorite sayings and daily mantras.", img: PHOTOS.card3_quote_based, accent: "#5C6BC0" },
    { name: "Logo Branding", desc: "Sleek placement of your company's identity.", img: PHOTOS.card4_logo_branding, accent: "#26A69A" }
  ];

  const styleCollections = [
    { 
      title: "Minimal", 
      desc: "Subtle elegance, small placements, and neutral tones.", 
      tags: ["Line Art", "Small Logos", "Neutral Colors"],
      colors: { bg: "#E6F3FA", tagBg: "#CBE6F6", hoverText: "#0284c7" } // Pale Blue
    },
    { 
      title: "Streetwear", 
      desc: "Oversized prints, edgy graphics, and bold colors.", 
      tags: ["Oversized", "Edgy Graphics", "Heavy Cotton"],
      colors: { bg: "#FCE6D5", tagBg: "#F9D4B5", hoverText: "#ea580c" } // Pale Orange
    },
    { 
      title: "Elegant", 
      desc: "Refined designs, often using delicate embroidery or fine lines.", 
      tags: ["Embroidery", "Fine Lines", "Script Fonts"],
      colors: { bg: "#E9E0F8", tagBg: "#D7C6F1", hoverText: "#7c3aed" } // Pale Purple
    },
    { 
      title: "Bold & Colorful", 
      desc: "High contrast, full-coverage prints, and vibrant aesthetics.", 
      tags: ["Full Print", "High Contrast", "Vibrant"],
      colors: { bg: "#DCF5E8", tagBg: "#BDF0D3", hoverText: "#059669" } // Pale Green
    }
  ];

  // Helper component to replace imported Palette as it was missing from lucide-react import
  function Palette(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
  }

  const tips = [
    { title: "Keep designs simple", desc: "Sometimes less is more. Let the message breathe.", icon: PenTool, accent: "#9DF542", bg: "#f4fbe8" },
    { title: "Use high-quality images", desc: "Avoid blurriness by using crisp, high-res files.", icon: ImageIcon, accent: "#FF8A65", bg: "#fff2ec" },
    { title: "Choose readable fonts", desc: "Ensure your text is legible from a distance.", icon: Type, accent: "#5C6BC0", bg: "#f0f2fa" },
    { title: "Consider contrast", desc: "Make sure your design pops against the product color.", icon: Contrast, accent: "#26A69A", bg: "#e9f6f5" }
  ];

  const pairs = [
    { idea: "Minimal quote", product: "T-shirt", icon: Quote, accent: "#9DF542" },
    { idea: "Company Logo", product: "Hoodie", icon: Briefcase, accent: "#5C6BC0" },
    { idea: "Custom name", product: "Mug", icon: Type, accent: "#FF8A65" },
    { idea: "Artistic Illustration", product: "Tote Bag", icon: ImageIcon, accent: "#26A69A" }
  ];

  const colorPalettes = [
    { name: "Earthy Neutrals", colors: ["#5C5046", "#8F8073", "#CBBAB0", "#F4EFEA"], desc: "Warm, grounded tones perfect for organic cotton and minimalist streetwear." },
    { name: "Electric Neon", colors: ["#0F172A", "#3B82F6", "#8B5CF6", "#F43F5E"], desc: "High-contrast, energetic vibes that make your graphics pop off the fabric." },
    { name: "Vintage Wash", colors: ["#2E3E3D", "#4C5F5B", "#D19C76", "#E8D3C3"], desc: "Faded, nostalgic hues that pair beautifully with retro typography." },
    { name: "Soft Pastels", colors: ["#FFD6D6", "#FFE9D6", "#D6F0FF", "#E6D6FF"], desc: "Dreamy, light shades ideal for gentle aesthetics and delicate illustrations." }
  ];

  const faqs = [
    { q: "What designs work best?", a: "High-contrast designs with clear lines work beautifully. If you're printing on a dark product, ensure your design has light elements to stand out." },
    { q: "Can I upload my own design?", a: "Absolutely! You can upload your own artwork directly in our design studio and place it exactly where you want." },
    { q: "What formats are supported?", a: "We recommend PNG files with transparent backgrounds for the best results, but we also support JPG and JPEG formats." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f6] font-sans selection:bg-[#9DF542] selection:text-[#111]">
      {/* Navigation */}
      <div className="w-full flex justify-center sticky top-1 lg:top-2 z-50 px-4 lg:px-6">
        <header className="w-full max-w-7xl bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200/50 rounded-[2rem] h-[76px] lg:h-[84px] flex items-center px-6 lg:px-10 relative">
          <div className="flex-1 flex items-center">
            <Link href="/">
              <img src="/logo.png" alt="Stenvo Logo" className="h-[56px] md:h-[68px] w-auto cursor-pointer object-contain relative z-10 -ml-1 transition-transform hover:scale-105" />
            </Link>
          </div>
          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <Link href="/before-you-start" className="text-[17px] font-normal text-[#2d3227] hover:text-[#525f48] transition-colors">Before You Start</Link>
            <Link href="/inspiration" className="text-[17px] font-medium text-[#525f48] transition-colors relative">
              Inspiration
              <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-1 bg-[#9DF542] rounded-full" />
            </Link>
            <Link href="/how-it-works" className="text-[17px] font-normal text-[#2d3227] hover:text-[#525f48] transition-colors">How it works</Link>
          </nav>
          <div className="flex-1 flex items-center justify-end gap-2">
            <MobileNav activePage="inspiration" />
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

      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#9DF542]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-[#525f48]/5 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

        <div className="container mx-auto max-w-7xl relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="flex-[1.2] text-center lg:text-left w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/40 backdrop-blur-md border border-white/50 text-[#525f48] rounded-full text-[11px] md:text-[13px] font-bold uppercase tracking-[0.2em] mb-6 md:mb-10 shadow-sm">
                <Sparkles size={14} className="text-[#9DF542]" /> 
                Curated Creativity
              </div>
              <h1 
                className="text-5xl sm:text-6xl md:text-8xl lg:text-[100px] font-medium text-[#111] mb-6 md:mb-10 tracking-[-0.04em] leading-[0.95]" 
                style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)' }}
              >
                Get <span className="italic font-light text-gray-400">Inspired</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8 md:mb-12 font-light">
                Discover the intersection of art and apparel. A curated guide to finding your signature style through custom creation.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/products" className="bg-[#111] text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-black transition-all shadow-xl hover:shadow-black/20 hover:-translate-y-1 text-center">
                  Explore Catalog
                </Link>
                <Link href="/products" className="bg-[#9DF542] text-[#111] px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-base md:text-lg hover:opacity-90 transition-all shadow-xl hover:shadow-[#9DF542]/20 hover:-translate-y-1 text-center">
                  Start Creating
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Mobile: single hero image. Desktop: full collage */}
          <div className="flex-1 relative w-full">
            {/* Mobile single image */}
            <div className="lg:hidden w-full h-[320px] rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-white">
              <img src={PHOTOS.hero_main} className="w-full h-full object-cover" alt="Fashion" />
            </div>

            {/* Desktop collage */}
            <div className="hidden lg:block relative w-full h-[700px]">
            {/* Artistic Layered Collage */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full"
            >
              {/* Main Image - Center */}
              <motion.div 
                whileHover={{ y: -10 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border-[12px] border-white"
              >
                <img 
                  src={PHOTOS.hero_main}
                  className="w-full h-full object-cover" 
                  alt="Fashion Model" 
                />
              </motion.div>

              {/* Secondary Image - Top Left */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[5%] left-0 w-[45%] h-[40%] rounded-[2rem] overflow-hidden shadow-2xl z-40 border-[8px] border-white"
              >
                <img 
                  src={PHOTOS.hero_top_left}
                  className="w-full h-full object-cover" 
                  alt="Streetwear Detail" 
                />
              </motion.div>

              {/* Tertiary Image - Bottom Right */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-[5%] right-0 w-[50%] h-[45%] rounded-[2.5rem] overflow-hidden shadow-2xl z-30 border-[10px] border-white"
              >
                <img 
                  src={PHOTOS.hero_bottom}
                  className="w-full h-full object-cover" 
                  alt="Custom Apparel" 
                />
              </motion.div>

              {/* Decorative Glass Card */}
              <div className="absolute top-[60%] -left-10 bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-2xl z-40 max-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-[#9DF542] rounded-full flex items-center justify-center">
                    <Sparkles size={14} className="text-[#111]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-tighter">Premium</span>
                </div>
                <p className="text-sm font-medium text-gray-800 leading-snug">"Art is not what you see, but what you make others see."</p>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUICK IDEA CATEGORIES */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white border-y border-gray-100">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111] text-center md:text-left" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Start with an Idea
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {quickIdeas.map((idea, idx) => (
              <div 
                key={idx} 
                className="group relative border border-transparent p-10 rounded-[2.5rem] transition-all duration-700 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden min-h-[320px] flex flex-col justify-start"
                style={{ backgroundColor: idea.bg }}
              >
                {/* Dynamic Accent Background */}
                <div 
                  className={`absolute -right-4 -top-4 w-32 h-32 rounded-full transition-all duration-700 group-hover:scale-[8] opacity-0 group-hover:opacity-100 -z-0`}
                  style={{ backgroundColor: `${idea.accent}15` }}
                />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 transition-all duration-500 group-hover:bg-white group-hover:shadow-md border border-white group-hover:border-transparent shadow-sm">
                    <idea.icon size={28} className="text-[#111]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#111] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-serif, serif)' }}>{idea.title}</h3>
                  <p className="text-[16px] text-gray-600 leading-relaxed mb-8 group-hover:text-gray-800 transition-colors">{idea.desc}</p>
                  
                  <div 
                    className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-[0.1em] transition-all duration-500 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ color: idea.accent }}
                  >
                    View Inspiration
                    <ArrowRight size={18} className="-translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>

                {/* Bottom Border Accent */}
                <div 
                  className="absolute bottom-0 left-0 h-1.5 transition-all duration-700 w-0 group-hover:w-full"
                  style={{ backgroundColor: idea.accent }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DESIGN IDEAS */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4" style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)' }}>
              Popular Design Directions
            </h2>
            <p className="text-gray-500 text-lg">Trending concepts to guide your creativity and spark new ideas.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {designDirections.map((dir, idx) => (
              <div 
                key={idx} 
                className="group relative rounded-[2.5rem] bg-white overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-100"
                style={{ '--dir-accent': dir.accent } as React.CSSProperties}
              >
                {/* Image Section - Framed inside the card */}
                <div className="h-72 w-full relative overflow-hidden bg-white p-3">
                  <div className="w-full h-full relative rounded-[2rem] overflow-hidden bg-gray-50">
                    <img src={dir.img} alt={dir.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    {/* Unique Hover Overlay Wash */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 mix-blend-multiply" style={{ backgroundColor: dir.accent }} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="px-8 pb-10 pt-4 relative bg-white z-10 flex flex-col h-full">
                  <div className="absolute top-0 left-8 w-12 h-0.5 bg-gray-200 transition-all duration-500 group-hover:w-full group-hover:left-0 group-hover:h-1" style={{ backgroundColor: 'var(--dir-accent)' }} />
                  
                  <h3 className="text-2xl font-bold text-[#111] mb-4 mt-4 tracking-tight transition-colors duration-500 group-hover:text-[var(--dir-accent)]" style={{ fontFamily: 'var(--font-serif, serif)' }}>
                    {dir.name}
                  </h3>
                  <p className="text-[16px] text-gray-500 leading-relaxed mb-8 flex-grow">
                    {dir.desc}
                  </p>
                  
                  <div className="flex items-center gap-3 text-[14px] font-bold uppercase tracking-[0.15em] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-75" style={{ color: 'var(--dir-accent)' }}>
                    See Examples <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STYLE COLLECTIONS */}
      <section className="py-24 px-6 bg-[#f8f9fa]">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)' }}>
              Explore Styles
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl">
              Find the aesthetic that matches your vision. Every style represents a unique approach to custom creation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {styleCollections.map((style, idx) => (
              <div 
                key={idx} 
                className="group bg-white p-2 md:p-3 rounded-[2rem] shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer"
                style={{ 
                  '--card-hover-color': style.colors.hoverText,
                  '--card-bg': style.colors.bg,
                  '--card-tag': style.colors.tagBg
                } as React.CSSProperties}
              >
                {/* Colored Top Block */}
                <div 
                  className="rounded-[1.5rem] p-8 md:p-10 transition-colors duration-500 min-h-[240px] flex flex-col"
                  style={{ backgroundColor: 'var(--card-bg)' }}
                >
                  <h3 className="text-[26px] font-semibold text-gray-900 mb-3 tracking-tight">{style.title}</h3>
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-6 flex-grow">{style.desc}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2.5 mt-auto">
                    {style.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-gray-800 transition-colors duration-300"
                        style={{ backgroundColor: 'var(--card-tag)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="flex items-center justify-end px-6 py-5">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--card-hover-color)] group-hover:shadow-md">
                    <ArrowRight size={18} className="text-gray-500 group-hover:text-white transition-colors duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TRENDING COLOR PALETTES */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-serif, "Cormorant Garamond", serif)' }}>
              Trending Color Palettes
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Discover the perfect color combinations to set the mood for your next collection.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {colorPalettes.map((palette, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 rounded-[2.5rem] bg-[#faf9f6] border border-gray-100 transition-all duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 flex flex-col"
              >
                {/* Color Swatches */}
                <div className="flex w-full h-32 rounded-2xl overflow-hidden mb-8 shadow-inner">
                  {palette.colors.map((color, cIdx) => (
                    <div 
                      key={cIdx} 
                      className="flex-1 h-full transition-all duration-500 group-hover:flex-[1.5]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                <h3 className="text-2xl font-bold text-[#111] mb-3 font-serif">{palette.name}</h3>
                <p className="text-[15px] text-gray-500 leading-relaxed mb-6 flex-grow">{palette.desc}</p>
                
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex -space-x-3">
                    {palette.colors.map((color, cIdx) => (
                      <div key={cIdx} className="w-8 h-8 rounded-full border-2 border-[#faf9f6] shadow-sm transition-transform duration-300 hover:scale-110 hover:z-10" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-all duration-300 group-hover:bg-[#111] group-hover:border-[#111]">
                    <ArrowRight size={16} className="text-[#111] group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. QUICK DESIGN TIPS & 7. PRODUCT + IDEA COMBINATIONS */}
      <section className="py-24 px-6 bg-[#faf9f6]">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20">
            
            {/* Design Tips */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold text-[#111] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-serif, serif)' }}>
                  Design Tips
                </h2>
                <p className="text-gray-500 text-lg">Pro-tips to ensure your custom apparel looks professional and polished.</p>
              </div>
              <div className="grid gap-6">
                {tips.map((tip, idx) => (
                  <div key={idx} className="group flex items-center gap-6 p-6 bg-white rounded-[2rem] border border-gray-100 transition-all duration-500 hover:shadow-xl hover:-translate-x-2">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-500 group-hover:text-white" style={{ backgroundColor: tip.bg, color: tip.accent }} >
                      <tip.icon size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#111] mb-1">{tip.title}</h4>
                      <p className="text-[15px] text-gray-500 leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Pairs */}
            <div className="space-y-12">
              <div>
                <h2 className="text-4xl font-bold text-[#111] mb-4 tracking-tight" style={{ fontFamily: 'var(--font-serif, serif)' }}>
                  Perfect Pairings
                </h2>
                <p className="text-gray-500 text-lg">Inspiration for combining the right idea with the perfect product.</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {pairs.map((pair, idx) => (
                  <div 
                    key={idx} 
                    className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl hover:scale-105"
                  >
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: `${pair.accent}15`, color: pair.accent }}>
                      <pair.icon size={32} />
                    </div>
                    <div className="space-y-2">
                      <span className="block font-bold text-gray-400 text-xs uppercase tracking-widest">Try a</span>
                      <span className="block font-bold text-[#111] text-xl font-serif">{pair.idea}</span>
                      <span className="block text-gray-400 text-xs uppercase tracking-widest">on a</span>
                      <span className="block font-bold text-[#111] text-lg">{pair.product}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. CREATOR MINDSET SECTION */}
      <section className="py-20 px-6 bg-[#e2e8df] border-y border-gray-200">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Think Like a Creator
          </h2>
          <p className="text-[#2d3227] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-serif italic">
            "Don't overthink it. The best designs often start as a simple thought or a rough sketch. Allow yourself to experiment, combine unexpected elements, and most importantly, let your personal expression lead the way. There are no rules—only a blank canvas waiting for your voice."
          </p>
        </div>
      </section>

      {/* 9. FAQ PREVIEW */}
      <section className="py-24 px-6 bg-[#faf9f6]">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Need Help Getting Started?
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                className="group bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:border-[#9DF542]/50 hover:shadow-sm"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-bold text-[#111]">{faq.q}</span>
                  <div className={`p-2 rounded-full transition-all duration-300 ${openFaq === idx ? "bg-[#111] text-white rotate-180" : "bg-gray-50 text-gray-400 group-hover:bg-[#9DF542] group-hover:text-[#111]"}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-500 leading-relaxed pl-6 border-t border-gray-50 mt-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-[#111] text-white overflow-hidden mt-0 border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-20 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-4">
              <div className="mb-8">
                <img src="/logo-white.png" alt="Stenvo" className="h-[44px] md:h-[52px] w-auto mb-2 object-contain" />
              </div>
              <h4 className="text-[#9DF542] font-bold text-[20px] mb-4">About Us</h4>
              <p className="text-white text-[16px] leading-[1.8] mb-8 font-medium">
                We want to help bring talented students and unique startups together.
              </p>
              <h4 className="text-[#9DF542] font-bold text-[20px] mb-4">Contact Us</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-white text-[16px] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9DF542" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.74a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                  +91 9999 999 999
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 lg:ml-10">
              <h4 className="text-[#9DF542] font-bold text-[20px] mb-6">Information</h4>
              <ul className="flex flex-col gap-5">
                {['About Us', 'More Search', 'Blog', 'Testimonials', 'Events'].map(link => (
                  <li key={link}><Link href="#" className="text-white text-[17px] font-medium hover:text-[#9DF542] transition-colors">{link}</Link></li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h4 className="text-[#9DF542] font-bold text-[20px] mb-6">Helpful Links</h4>
              <ul className="flex flex-col gap-5">
                {['Services', 'Supports', 'Terms & Conditions', 'Privacy Policy'].map(link => (
                  <li key={link}><Link href="#" className="text-white text-[17px] font-medium hover:text-[#9DF542] transition-colors">{link}</Link></li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-4">
              <h4 className="text-white font-bold text-[20px] mb-6">Subscribe More Info</h4>
              <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <input type="email" placeholder="Enter your Email" className="bg-transparent text-[16px] text-[#111] placeholder-gray-500 outline-none flex-1 font-medium" />
              </div>
              <button className="bg-[#9DF542] text-[#111] font-bold text-[17px] py-3 px-8 rounded-lg hover:bg-[#b8e600] transition-colors w-max">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-1/3"></div>
            <div className="md:w-1/3 flex items-center justify-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#9DF542] flex items-center justify-center hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="#111"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#9DF542] flex items-center justify-center hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="#111"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg></a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#9DF542] flex items-center justify-center hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
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
