"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle, ChevronDown, Package, PenTool, ShoppingCart, Truck, Zap, ShieldCheck, Globe, Star, ArrowRight, ShoppingBag, LogOut, Printer } from "lucide-react";
import { supabase } from "@/lib/supabase";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";

export default function HowItWorks() {
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        supabase.from("profiles").select("role").eq("id", user.id).single().then(({ data }) => {
          if (data) setUserRole(data.role);
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        supabase.from("profiles").select("role").eq("id", currentUser.id).single().then(({ data }) => {
          if (data) setUserRole(data.role);
        });
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const steps = [
    { icon: <Package size={24} />, title: "Choose Product", desc: "Select from 1300+ premium blanks." },
    { icon: <PenTool size={24} />, title: "Customize Design", desc: "Use our studio to add your art." },
    { icon: <ShoppingCart size={24} />, title: "Place Order", desc: "Order a sample or start selling." },
    { icon: <Printer size={24} />, title: "Production", desc: "We print with unmatched quality." },
    { icon: <Truck size={24} />, title: "Delivery", desc: "Fast global shipping to your door." },
  ];

  const features = [
    { icon: <Zap size={28} />, title: "Fast Production", desc: "Orders are printed and shipped within 2-3 business days." },
    { icon: <Star size={28} />, title: "Premium Quality", desc: "We use only top-tier materials and cutting-edge print tech." },
    { icon: <PenTool size={28} />, title: "Easy Customization", desc: "Our 3D design studio makes bringing ideas to life effortless." },
    { icon: <ShieldCheck size={28} />, title: "Secure Payment", desc: "Enterprise-grade security for all your transactions." },
    { icon: <Truck size={28} />, title: "Real-Time Tracking", desc: "Know exactly where your order is from print to delivery." },
    { icon: <Globe size={28} />, title: "Reliable Shipping", desc: "We ensure safe and timely delivery across our supported regions." },
  ];

  const faqs = [
    { q: "How long does production take?", a: "Most orders are produced within 2-3 business days. Delivery times depend on your location and chosen shipping method." },
    { q: "How much does it cost to start?", a: "It's completely free to start! You only pay when an order is placed. There are no monthly fees or hidden costs." },
    { q: "What print methods do you use?", a: "We use state-of-the-art Direct-to-Garment (DTG), sublimation, and UV printing depending on the product material." },
    { q: "Can I order a sample first?", a: "Yes, we highly recommend ordering a sample to see the quality for yourself. You can order any product with your design at the base cost." },
  ];

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
            <Link href="/before-you-start" className="text-[17px] font-medium text-[#2d3227] hover:text-[#525f48] transition-colors">
              Before You Start
            </Link>
            <Link href="/inspiration" className="text-[17px] font-normal text-[#2d3227] hover:text-[#525f48] transition-colors">Inspiration</Link>
            <Link href="/how-it-works" className="text-[17px] font-medium text-[#525f48] transition-colors relative">
              How it works
              <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-1 bg-[#9DF542] rounded-full" />
            </Link>
          </nav>
          <div className="flex-1 flex items-center justify-end gap-2">
            <MobileNav activePage="how-it-works" />
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
                <Link href="/login" className="flex items-center justify-center rounded-md px-6 h-11 text-[16px] font-extrabold tracking-wide text-[#1B2412] bg-white border border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-gray-50 transition-colors">Log in</Link>
                <Link href="/signup" className="flex items-center justify-center rounded-md px-6 h-11 text-[16px] font-extrabold tracking-wide transition-opacity hover:opacity-80" style={{ backgroundColor: '#A1FF4D', color: '#1B2412' }}>Sign up</Link>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-20 md:pb-24 overflow-hidden px-4 md:px-0">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[10%] w-64 h-64 bg-[#ccff00]/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-[#a1ff4d]/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#9DF542] animate-pulse"></span>
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Simple & Transparent</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-7xl font-medium text-[#111] mb-6 tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              From idea to reality in <br className="hidden md:block" />
              <span className="italic text-[#495439]">just a few clicks.</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-base md:text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto px-2 md:px-0">
              Creating custom merchandise shouldn't be complicated. We've streamlined the entire process so you can focus on what matters: your designs.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="w-full sm:w-auto px-8 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg" style={{ backgroundColor: '#9DF542', color: '#111' }}>
                Start Creating
              </Link>
              <Link href="/products" className="w-full sm:w-auto px-8 h-14 rounded-full flex items-center justify-center text-lg font-bold bg-white text-[#111] border-2 border-gray-200 transition-colors hover:border-gray-300 hover:bg-gray-50">
                Browse Catalog
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video Player Card */}
      <section className="px-6 pb-24 relative z-20">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative rounded-[2.5rem] bg-white p-2 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 group"
          >
            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-gray-900 group-hover:shadow-2xl transition-all duration-500">
              <img 
                src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&fit=crop" 
                alt="Video Thumbnail" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-[#9DF542] hover:text-[#111] hover:border-[#9DF542] hover:scale-110 transition-all duration-300 shadow-xl">
                <Play size={40} className="ml-2" fill="currentColor" />
              </button>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full border border-gray-100 shadow-lg text-sm font-semibold text-gray-600 whitespace-nowrap">
              Watch how Stenvo works in 60 seconds
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#111] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              How It Works
            </h2>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              From selecting your blank canvas to unboxing your custom creation, we've made every step seamless.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line Desktop */}
            <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-gray-100 z-0">
              <motion.div 
                className="h-full bg-[#9DF542]" 
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
              {steps.map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 rounded-3xl bg-[#fafafa] border border-gray-100 shadow-sm flex items-center justify-center mb-6 text-gray-400 group-hover:bg-[#9DF542] group-hover:text-[#111] group-hover:border-[#9DF542] group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                    <div className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#111] mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed px-2">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 md:py-24 bg-[#f0eae1]">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#111] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Why choose Stenvo?
            </h2>
            <p className="text-base md:text-lg text-[#444] max-w-2xl mx-auto">
              We provide everything you need to build your brand and delight your customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(157,245,66,0.3)] overflow-hidden cursor-pointer flex flex-col h-full"
              >
                {/* Colorful Expanding Background */}
                <div className="absolute top-12 left-12 w-2 h-2 bg-[#9DF542] rounded-full opacity-0 scale-0 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-[150] pointer-events-none origin-center z-0" />

                <div className="relative z-10 flex-1">
                  {/* Icon Container */}
                  <div className="relative overflow-hidden w-16 h-16 rounded-[1.25rem] bg-[#f4f4f5] flex items-center justify-center mb-8 text-[#9DF542] transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-white group-hover:text-[#111] group-hover:rounded-full group-hover:shadow-2xl group-hover:rotate-[360deg] z-10">
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[150%]">
                      {feature.icon}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-[150%] transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <h3 className="text-2xl font-bold text-[#111] mb-4 tracking-tight transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed font-medium transition-colors duration-300 group-hover:text-[#222]">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#111] mb-6" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Your design, <br /> flawless execution.
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We handle the heavy lifting behind the scenes. Once you place an order, our automated system routes it to the optimal print facility for speed and quality.
              </p>
              <ul className="space-y-4">
                {["Automated order routing", "Rigorous quality control", "Eco-friendly printing options", "White-label shipping"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[#111] font-medium">
                    <CheckCircle className="text-[#9DF542]" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="relative pl-8 md:pl-12 py-10">
              {/* Vertical Line */}
              <div className="absolute top-0 bottom-0 left-[23px] w-[2px] bg-gray-100">
                <motion.div 
                  className="w-full bg-[#9DF542]"
                  initial={{ height: "0%" }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>

              {[
                { time: "0h", title: "Order Placed", desc: "Your design is instantly sent to our system." },
                { time: "2h", title: "Print Preparation", desc: "Artwork is verified and prepped for print." },
                { time: "24h", title: "Production", desc: "Item is printed and cured for durability." },
                { time: "48h", title: "Quality Check", desc: "Manual inspection before packaging." },
                { time: "72h", title: "Shipped", desc: "Handed to courier with tracking." },
              ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  className="relative mb-10 last:mb-0 group"
                >
                  <div className="absolute -left-[45px] top-1 w-6 h-6 rounded-full border-4 border-white bg-[#fafafa] shadow-md group-hover:bg-[#9DF542] group-hover:scale-125 transition-all duration-300 z-10" />
                  <div className="bg-[#fafafa] p-6 rounded-2xl border border-gray-100 group-hover:border-gray-200 group-hover:shadow-md transition-all duration-300">
                    <span className="text-xs font-bold text-[#9DF542] bg-[#111] px-2 py-1 rounded-md mb-2 inline-block uppercase tracking-wider">{step.time}</span>
                    <h4 className="text-lg font-bold text-[#111] mb-1">{step.title}</h4>
                    <p className="text-gray-500 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-medium text-[#111] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">Everything you need to know about how Stenvo works.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#9DF542]/50 hover:shadow-[0_20px_40px_-15px_rgba(157,245,66,0.15)] hover:bg-gradient-to-r hover:from-white hover:to-[#9DF542]/5"
              >
                {/* Left Indicator Pill */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#9DF542] scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
                
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none relative z-10 transition-transform duration-500 group-hover:translate-x-2"
                >
                  <span className="text-lg font-bold text-[#111] transition-colors duration-300 group-hover:text-[#000]">{faq.q}</span>
                  <div className={`p-2 rounded-full transition-all duration-500 ${openFaq === idx ? "bg-[#111] text-white rotate-180" : "bg-gray-50 text-gray-400 group-hover:bg-[#9DF542] group-hover:text-[#111]"}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-600 leading-relaxed pt-2 border-t border-gray-100">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      
      {/* Footer */}
      <Footer />
    </div>
  );
}
