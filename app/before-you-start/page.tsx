"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, ArrowRight, ShoppingBag, LogOut, 
  ShieldCheck, AlertCircle, Clock, CreditCard, 
  Package, RefreshCcw, Image as ImageIcon, CheckCircle2,
  Banknote, Upload, Smartphone
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BeforeYouStartPage() {
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

  const faqs = [
    { q: "How do I verify my payment?", a: "After transferring the funds via CBE, Telebirr, or BOA, take a screenshot of the receipt and upload it in the payment section of your order." },
    { q: "Can I cancel my order after payment?", a: "Orders can only be canceled before production begins. Once production starts, we cannot accept cancellations as the item is custom-made for you." },
    { q: "What if my design quality is low?", a: "If your uploaded design is low resolution, it may appear blurry on the final product. We recommend using high-resolution images (at least 300 DPI)." },
    { q: "How long does shipping take?", a: "Shipping typically takes 2-5 business days after the 2-5 day production period. Delivery times may vary depending on your specific location." },
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
            <Link href="/before-you-start" className="text-[17px] font-medium text-[#525f48] transition-colors relative">
              Before You Start
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
      <section className="pt-24 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#9DF542]/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 border border-gray-100"
          >
            <ShieldCheck size={40} className="text-[#9DF542]" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold text-[#111] mb-6 tracking-tight" 
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Before You Start
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to know before placing your order. We keep it simple, transparent, and completely straightforward.
          </motion.p>
        </div>
      </section>

      {/* Quick Summary Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, title: "No hidden costs", desc: "Pay only for what you print. Transparent pricing always." },
              { icon: RefreshCcw, title: "Non-refundable", desc: "Custom items are uniquely yours and cannot be returned." },
              { icon: Clock, title: "2–5 Days Production", desc: "We take time to ensure premium quality on every order." },
              { icon: CheckCircle2, title: "Verification Required", desc: "Orders process only after payment proof is verified." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-[#9DF542]/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-default"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#9DF542]/20 group-hover:scale-110 transition-all duration-500">
                  <item.icon size={26} className="text-[#111]" />
                </div>
                <h3 className="text-[19px] font-bold text-[#111] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Process Overview */}
      <section className="py-20 px-6 bg-white border-y border-gray-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              The Order Process
            </h2>
            <p className="text-gray-500">A smooth, 5-step journey from idea to delivery.</p>
          </div>

          <div className="relative">
            {/* Horizontal Line Desktop */}
            <div className="hidden md:block absolute top-[45px] left-10 right-10 h-[2px] bg-gray-100">
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-[#9DF542] origin-left"
              />
            </div>
            {/* Vertical Line Mobile */}
            <div className="block md:hidden absolute top-10 bottom-10 left-[45px] w-[2px] bg-gray-100">
              <motion.div 
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full bg-[#9DF542] origin-top"
              />
            </div>

            <div className="flex flex-col md:flex-row justify-between relative z-10 gap-10 md:gap-4">
              {[
                { step: "1", title: "Choose Product", icon: Package },
                { step: "2", title: "Customize", icon: ImageIcon },
                { step: "3", title: "Submit Order", icon: CheckCircle2 },
                { step: "4", title: "Verify Payment", icon: CreditCard },
                { step: "5", title: "Production & Delivery", icon: Clock },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="flex md:flex-col items-center md:text-center gap-6 md:gap-4 flex-1"
                >
                  <div className="w-[90px] h-[90px] shrink-0 bg-white border-[3px] border-gray-100 rounded-full flex items-center justify-center relative shadow-sm group-hover:border-[#9DF542] transition-colors">
                    <item.icon size={32} className="text-[#111]" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#111] text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#111]">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Rules (Crucial) */}
      <section className="py-24 px-6 bg-[#fafafa]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
                <CreditCard size={16} /> Payment & Verification
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-6 leading-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                How to pay for your <br /> custom orders.
              </h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                To ensure a smooth and secure transaction, we process orders exclusively through trusted local payment methods. All orders require manual payment verification.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#9DF542]/20 flex items-center justify-center shrink-0">
                    <Banknote size={24} className="text-[#111]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#111] mb-2">Supported Methods</h4>
                    <p className="text-gray-500">We accept direct transfers via CBE (Commercial Bank of Ethiopia), Telebirr, and BOA (Bank of Abyssinia).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#9DF542]/20 flex items-center justify-center shrink-0">
                    <Upload size={24} className="text-[#111]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#111] mb-2">Upload Proof</h4>
                    <p className="text-gray-500">After transferring, you must upload a screenshot or photo of your receipt (coupon image) within your dashboard.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#9DF542]/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} className="text-[#111]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-[#111] mb-2">Verification</h4>
                    <p className="text-gray-500">Your order will only enter the production queue once our team has successfully verified your payment proof.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { 
                  name: "CBE", 
                  border: "hover:border-purple-300", 
                  glow: "bg-purple-400",
                  image: "/cbe-logo.png", 
                  anim: "group-hover:[transform:rotateY(360deg)]",
                  desc: "Direct Bank Transfer",
                  action: "Fast & Secure"
                },
                { 
                  name: "Telebirr", 
                  border: "hover:border-blue-300", 
                  glow: "bg-blue-400",
                  image: "/telebirr-logo.png", 
                  anim: "group-hover:-translate-y-2 group-hover:scale-125 group-hover:-rotate-12",
                  desc: "Mobile Money",
                  action: "Instant Verification"
                },
                { 
                  name: "BOA", 
                  border: "hover:border-yellow-300", 
                  glow: "bg-yellow-400",
                  image: "/boa-logo.png", 
                  anim: "group-hover:rotate-[360deg] group-hover:scale-110",
                  desc: "Bank of Abyssinia",
                  action: "Trusted Partner"
                },
                { 
                  name: "Upload Receipt", 
                  border: "hover:border-[#9DF542]/50", 
                  glow: "bg-[#9DF542]",
                  icon: Upload, 
                  anim: "group-hover:-translate-y-3 group-hover:scale-125",
                  desc: "Payment Proof",
                  action: "Required Step"
                },
              ].map((method, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`relative bg-white p-6 rounded-[2rem] border border-gray-100 ${method.border} hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center justify-center text-center aspect-square group overflow-hidden`}
                >
                  {/* Subtle Colored Background Glow on Hover */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none ${method.glow}`} />

                  {/* Logo Container */}
                  <div className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden transition-all duration-500 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-hover:-translate-y-2 ${method.image ? 'p-2' : 'p-0'} [perspective:1000px]`}>
                    {method.image ? (
                      <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${method.anim}`}>
                        <img src={method.image} alt={method.name} className="w-full h-full object-contain" />
                      </div>
                    ) : method.icon ? (
                      <div className={`w-full h-full bg-gray-50 flex items-center justify-center rounded-full transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${method.anim}`}>
                        <method.icon size={32} className="text-[#111]" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-full">
                        <Smartphone size={32} className="text-[#111]" />
                      </div>
                    )}
                  </div>
                  
                  {/* Text Content */}
                  <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                    <h4 className="text-xl font-bold text-[#111]">{method.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{method.desc}</p>
                  </div>

                  {/* Hidden Action Pill that slides up on hover */}
                  <div className="absolute bottom-5 left-0 right-0 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 flex justify-center z-10">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#111] shadow-sm border border-gray-100">
                      {method.action}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Production & Rules (Split Layout) */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Production & Delivery */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#fafafa] p-10 rounded-[3rem] border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-shadow"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Package size={120} />
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 relative z-10">
                <Clock size={28} className="text-[#111]" />
              </div>
              <h3 className="text-3xl font-bold text-[#111] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Production & Delivery</h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#9DF542] shrink-0" />
                  <strong>Production Time:</strong> Typically 2-5 business days after payment verification.
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#9DF542] shrink-0" />
                  <strong>Delivery Time:</strong> Varies completely based on your location and the selected courier.
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#9DF542] shrink-0" />
                  <strong>High Demand:</strong> Delays may occasionally occur during peak seasons or high demand periods.
                </li>
              </ul>
            </motion.div>

            {/* Rules & Limitations */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-red-50/50 p-10 rounded-[3rem] border border-red-100 relative overflow-hidden group hover:shadow-xl transition-shadow"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 text-red-500 group-hover:scale-110 transition-transform duration-500">
                <AlertCircle size={120} />
              </div>
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 relative z-10">
                <AlertCircle size={28} className="text-red-500" />
              </div>
              <h3 className="text-3xl font-bold text-[#111] mb-4" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Important Rules</h3>
              <ul className="space-y-4 relative z-10">
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <strong>No Copyrighted Content:</strong> You must own the rights to the designs you upload.
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <strong>Content Guidelines:</strong> Strictly no offensive, hateful, or illegal designs.
                </li>
                <li className="flex items-start gap-3 text-gray-600">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <strong>Color Variance:</strong> Final printed colors may slightly vary from your digital screen due to CMYK printing processes.
                </li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trust & FAQ */}
      <section className="py-24 px-6 bg-[#fafafa]">
        <div className="container mx-auto max-w-3xl text-center">
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {["Transparent process", "Secure handling of orders", "Premium quality guaranteed"].map((trust, idx) => (
              <span key={idx} className="bg-white border border-gray-200 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm text-gray-700">
                <ShieldCheck size={16} className="text-[#9DF542]" /> {trust}
              </span>
            ))}
          </div>

          <h2 className="text-4xl font-bold text-[#111] mb-10" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 text-left">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-500 hover:border-[#9DF542]/50 hover:shadow-[0_20px_40px_-15px_rgba(157,245,66,0.15)]"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#9DF542] scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none relative z-10 transition-transform duration-500 group-hover:translate-x-2"
                >
                  <span className="text-lg font-bold text-[#111]">{faq.q}</span>
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
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-gray-500 leading-relaxed pl-8 border-t border-gray-50 mt-2">
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

      {/* Final CTA Strip */}
      <section className="py-24 relative overflow-hidden bg-[#111] rounded-t-[3rem] mt-12 mx-4 lg:mx-8 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-[0.05] mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-[#9DF542]/20 blur-[100px] rounded-full pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Ready to create your <br className="hidden md:block"/> <span className="text-[#9DF542]">custom product?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md">You're all caught up on the rules. Now it's time to bring your ideas to life instantly.</p>
            </div>
            <Link href="/shop" className="shrink-0 flex items-center gap-3 bg-[#9DF542] text-[#111] font-bold text-lg py-5 px-10 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(157,245,66,0.3)] group">
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
