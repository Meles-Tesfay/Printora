"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  XCircle,
  BarChart3,
  Users,
  User,
  Box,
  Truck,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder data for product approval
const pendingProducts = [
  { id: 1, name: "Cat Mug", supplier: "Abebe M.", type: "Mugs", date: "2 mins ago" },
  { id: 2, name: "Yellow Hoodie", supplier: "Tigist S.", type: "Apparel", date: "1 hour ago" },
  { id: 3, name: "Neon Phone Case", supplier: "Samuel L.", type: "Tech", date: "3 hours ago" },
];

export default function AdminDashboard() {
  const [approvals, setApprovals] = useState(pendingProducts);

  const stats = [
    { label: "Active Suppliers", value: "12", icon: Users, color: "bg-blue-600" },
    { label: "Pending Approvals", value: approvals.length, icon: ShieldCheck, color: "bg-orange-500" },
    { label: "System Uptime", value: "99.9%", icon: ShieldCheck, color: "bg-green-600" },
    { label: "Open Orders", value: "48", icon: Truck, color: "bg-indigo-600" },
  ];

  const handleAction = (id: number, approved: boolean) => {
    // In real app, update Supabase
    setApprovals(approvals.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] text-white border-r border-gray-800 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-800">
          <img src="/logo.png" alt="Printora" className="h-10 w-auto invert brightness-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-2 block">Admin Panel</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl font-bold transition-all">
            <BarChart3 size={20} /> Overview
          </Link>
          <Link href="/admin/approvals" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <ShieldCheck size={20} /> Product Approvals
          </Link>
          <Link href="/admin/suppliers" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Users size={20} /> Suppliers
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <ShoppingBag size={20} /> All Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 w-full rounded-xl transition-all">
            <Box size={20} /> Switch to Customer
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 lg:p-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#111] leading-none uppercase tracking-tighter mb-2" style={{ fontFamily: 'Impact, sans-serif' }}>
              System Control
            </h1>
            <p className="text-gray-500 font-medium tracking-tight uppercase text-xs">Platform overview & Administrative actions</p>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center animate-pulse">
              <AlertCircle size={24} />
            </div>
            <span className="text-sm font-black text-orange-600 uppercase tracking-widest leading-none">
              {approvals.length} Requests pending
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-5">
                <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-[#111] leading-none tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Approval Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-black text-[#111] uppercase tracking-tight">Recent Product Requests</h2>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock size={16} className="text-orange-600" />
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {approvals.map((req) => (
                  <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-5 mb-4 sm:mb-0">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-300 overflow-hidden relative">
                         <Box size={32} />
                         {/* Optional thumbnail image */}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#111] text-lg leading-tight mb-1">{req.name}</h3>
                        <div className="flex items-center gap-4">
                           <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{req.type}</span>
                           <span className="text-[11px] font-bold text-gray-500">•</span>
                           <span className="text-[11px] font-bold text-[#111] uppercase tracking-widest flex items-center gap-1.5 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">
                             <User size={10} className="text-blue-500" /> {req.supplier}
                           </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold mt-2 flex items-center gap-1">
                          <Clock size={10} /> RECIEVED {req.date}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleAction(req.id, false)}
                        className="bg-white border-2 border-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <XCircle size={22} />
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, true)}
                        className="bg-[#ccff00] text-[#111] p-4 rounded-2xl font-black shadow-lg shadow-[#ccff00]/20 hover:scale-110 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <CheckCircle size={22} />
                        <span className="text-sm font-black pr-1 tracking-tighter">APPROVE</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {approvals.length === 0 && (
                  <div className="p-20 text-center text-gray-400 italic font-medium">
                    All clear! No pending approval requests.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Recent Activity / Meta */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-gradient-to-br from-[#ccff00] to-[#9df542] p-8 text-[#111] relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform">
                 <ShoppingBag size={200} />
               </div>
               <h3 className="text-2xl font-black uppercase mb-4 leading-none tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
                 Sales Overview
               </h3>
               <p className="text-sm font-bold opacity-80 mb-8 leading-relaxed">
                 The platform has seen a <span className="underline decoration-2 underline-offset-4">24% increase</span> in custom mug orders this week. 
               </p>
               <button className="bg-[#111] text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group-hover:gap-3 transition-all active:scale-95">
                 VIEW REPORTS <ArrowRight size={16} />
               </button>
            </Card>

            <div className="bg-[#111] rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-gray-800">
               <h4 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.2em] mb-6">Security & Logs</h4>
               <ul className="space-y-4">
                 {[
                   { msg: 'Supplier "Desta Print" logged in', time: '12m ago' },
                   { msg: 'New category "Canvas" added', time: '45m ago' },
                   { msg: 'Suspicious login attempt blocked', time: '2h ago' },
                 ].map((log, i) => (
                   <li key={i} className="flex justify-between items-start gap-4">
                     <p className="text-xs font-bold text-gray-300 leading-tight">{log.msg}</p>
                     <span className="text-[9px] font-black text-gray-600 uppercase whitespace-nowrap">{log.time}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
