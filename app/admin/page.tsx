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
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

// Placeholder data for product approval
const pendingProducts = [
  { id: 1, name: "Cat Mug", supplier: "Abebe M.", type: "Mugs", date: "2 mins ago" },
  { id: 2, name: "Yellow Hoodie", supplier: "Tigist S.", type: "Apparel", date: "1 hour ago" },
  { id: 3, name: "Neon Phone Case", supplier: "Samuel L.", type: "Tech", date: "3 hours ago" },
];

export default function AdminDashboard() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // 1. Fetch Pending Orders
    const { data: orders, error: ordersError } = await supabase
      .from('custom_orders')
      .select('*, customer:profiles(full_name, email)')
      .eq('status', 'PENDING_ADMIN')
      .order('created_at', { ascending: false });

    // 2. Fetch Suppliers
    const { data: supplierProfiles, error: suppliersError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('role', 'SUPPLIER');

    if (!ordersError) setApprovals(orders || []);
    if (!suppliersError) setSuppliers(supplierProfiles || []);

    setLoading(false);
  };

  const handleApproveClick = (order: any) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
  };

  const handleFinalAssignment = async (supplierId: string) => {
    if (!selectedOrder) return;

    const { error } = await supabase
      .from('custom_orders')
      .update({
        status: 'ASSIGNED_TO_SUPPLIER',
        supplier_id: supplierId
      })
      .eq('id', selectedOrder.id);

    if (error) {
      alert("Error assigning supplier: " + error.message);
    } else {
      setShowAssignModal(false);
      setSelectedOrder(null);
      fetchData(); // Refresh list
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject this design?")) return;

    const { error } = await supabase
      .from('custom_orders')
      .update({ status: 'REJECTED' })
      .eq('id', id);

    if (error) alert("Error: " + error.message);
    else fetchData();
  };

  const stats = [
    { label: "Active Suppliers", value: suppliers.length, icon: Users, color: "bg-blue-600" },
    { label: "Pending Approvals", value: approvals.length, icon: ShieldCheck, color: "bg-orange-500" },
    { label: "System Uptime", value: "99.9%", icon: ShieldCheck, color: "bg-green-600" },
    { label: "Open Orders", value: "0", icon: Truck, color: "bg-indigo-600" },
  ];

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
                        {req.mockup_image_url ? (
                          <img src={req.mockup_image_url} alt="Mockup" className="w-full h-full object-contain p-1" />
                        ) : (
                          <Box size={32} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-[#111] text-lg leading-tight mb-1">{req.product_type}</h3>
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                            {req.variants?.color || 'Default'} • {req.variants?.view || 'Front'}
                          </span>
                          <span className="text-[11px] font-bold text-gray-500">•</span>
                          <span className="text-[11px] font-bold text-[#111] uppercase tracking-widest flex items-center gap-1.5 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">
                            <User size={10} className="text-blue-500" /> {req.customer?.full_name || 'Anonymous'}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold mt-2 flex items-center gap-1">
                          <Clock size={10} /> RECIEVED {new Date(req.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-white border-2 border-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                      >
                        <XCircle size={22} />
                      </button>
                      <button
                        onClick={() => handleApproveClick(req)}
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

      {/* Supplier Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-[#111] uppercase tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
                  Assign Supplier
                </h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Order #{selectedOrder?.id?.slice(0, 8)}</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <XCircle size={32} />
              </button>
            </div>

            <div className="p-8 space-y-4">
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Choose which supplier should fulfill this <span className="text-[#111] font-black">{selectedOrder?.product_type}</span> design.
              </p>

              <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {suppliers.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleFinalAssignment(s.id)}
                    className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-[#ccff00] hover:bg-white hover:shadow-xl transition-all group text-left"
                  >
                    <div>
                      <p className="font-black text-[#111] uppercase text-sm tracking-tight group-hover:text-blue-600 transition-colors">{s.full_name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{s.email}</p>
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-[#ccff00] transform group-hover:translate-x-1 transition-all" />
                  </button>
                ))}

                {suppliers.length === 0 && (
                  <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                    <Users className="mx-auto text-gray-200 mb-3" size={40} />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">No suppliers found.<br />Check supplier registrations.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors p-2"
              >
                Cancel Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
