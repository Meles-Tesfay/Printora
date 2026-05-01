"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag, CheckCircle, Clock, XCircle, BarChart3, Users,
  User, Box, Truck, ArrowRight, ShieldCheck, AlertCircle,
  Package, Palette, Loader2, LogOut, Eye, Download
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  useEffect(() => {
    initDashboard();
  }, []);

  const initDashboard = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    // 🔒 ADMIN ONLY — redirect anyone else to home
    if (!prof || prof.role !== "ADMIN") {
      window.location.href = "/";
      return;
    }

    setAdminProfile(prof);
    await fetchAll();
    setLoading(false);
  };

  const fetchAll = async () => {
    const [ordersRes, productsRes, suppliersRes, customersRes, allOrdersRes] = await Promise.all([
      // Pending customer orders — simple select, no FK join
      supabase
        .from("custom_orders")
        .select("*")
        .eq("status", "PENDING_ADMIN")
        .order("created_at", { ascending: false }),

      // Products submitted by suppliers awaiting approval
      supabase
        .from("supplier_products")
        .select("*, supplier:profiles(full_name, email)")
        .eq("status", "PENDING")
        .order("created_at", { ascending: false }),

      // All suppliers
      supabase.from("profiles").select("id, full_name, email").eq("role", "SUPPLIER"),

      // All customers
      supabase.from("profiles").select("id, full_name, email, created_at").eq("role", "CUSTOMER"),

      // All orders overview
      supabase
        .from("custom_orders")
        .select("id, status, created_at, product_type, customer_id")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    let enrichedOrders = ordersRes.data || [];

    // Enrich orders with customer info manually
    if (enrichedOrders.length > 0) {
      const customerIds = [...new Set(enrichedOrders.map((o: any) => o.customer_id).filter(Boolean))];
      if (customerIds.length > 0) {
        const { data: customerProfiles } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", customerIds);

        const profileMap = Object.fromEntries((customerProfiles || []).map((p: any) => [p.id, p]));
        enrichedOrders = enrichedOrders.map((o: any) => ({
          ...o,
          customer: profileMap[o.customer_id] || null,
        }));
      }
    }

    if (!ordersRes.error) setPendingOrders(enrichedOrders);
    if (!productsRes.error) setPendingProducts(productsRes.data || []);
    if (!suppliersRes.error) setSuppliers(suppliersRes.data || []);
    if (!customersRes.error) setCustomers(customersRes.data || []);
    if (!allOrdersRes.error) setAllOrders(allOrdersRes.data || []);

    // Log errors to console for debugging
    if (ordersRes.error) console.error("Orders fetch error:", ordersRes.error);
  };

  // Approve a customer order: auto-assign to the supplier of the chosen product
  const handleApproveOrder = async (order: any) => {
    // If order has a linked supplier_product, auto-assign its supplier
    let supplierId = order.supplier_product?.supplier_id || order.supplier_id || null;

    // If no supplier is linked, let admin pick one from the list
    if (!supplierId) {
      if (suppliers.length === 0) {
        alert("No suppliers registered yet. Please add a supplier first.");
        return;
      }
      const options = suppliers.map((s: any, i: number) => `${i + 1}. ${s.full_name} (${s.email})`).join("\n");
      const choice = prompt(`Assign to which supplier? Enter number:\n\n${options}`);
      if (!choice) return;
      const idx = parseInt(choice) - 1;
      if (idx < 0 || idx >= suppliers.length) { alert("Invalid selection."); return; }
      supplierId = suppliers[idx].id;
    }

    const { error } = await supabase
      .from("custom_orders")
      .update({
        status: "ASSIGNED_TO_SUPPLIER",
        supplier_id: supplierId,
      })
      .eq("id", order.id);

    if (error) alert("Error: " + error.message);
    else {
      setSelectedOrder(null);
      fetchAll();
    }
  };

  // Reject order
  const handleRejectOrder = async (id: string) => {
    if (!confirm("Reject this order?")) return;
    const { error } = await supabase
      .from("custom_orders")
      .update({ status: "REJECTED" })
      .eq("id", id);
    if (error) alert("Error: " + error.message);
    else fetchAll();
  };

  // Approve a supplier product → it appears on landing page
  const handleApproveProduct = async (id: string) => {
    const { error } = await supabase
      .from("supplier_products")
      .update({ status: "APPROVED" })
      .eq("id", id);
    if (error) alert("Error: " + error.message);
    else { setSelectedProduct(null); fetchAll(); }
  };

  // Reject supplier product
  const handleRejectProduct = async (id: string) => {
    if (!confirm("Reject this product?")) return;
    const { error } = await supabase
      .from("supplier_products")
      .update({ status: "REJECTED" })
      .eq("id", id);
    if (error) alert("Error: " + error.message);
    else fetchAll();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const totalPending = pendingOrders.length + pendingProducts.length;

  const stats = [
    { label: "Active Suppliers", value: suppliers.length, icon: Users, color: "bg-blue-600" },
    { label: "Customers", value: customers.length, icon: User, color: "bg-teal-500" },
    { label: "Pending Approvals", value: totalPending, icon: ShieldCheck, color: "bg-orange-500" },
    { label: "Total Orders", value: allOrders.length, icon: Truck, color: "bg-indigo-600" },
  ];

  const STATUS_COLOR: Record<string, string> = {
    PENDING_ADMIN: "bg-yellow-100 text-yellow-700",
    ASSIGNED_TO_SUPPLIER: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    COMPLETED_BY_SUPPLIER: "bg-green-100 text-green-700",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111]">
        <Loader2 className="animate-spin text-[#ccff00]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] text-white hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-800">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto invert brightness-0" />
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-2 block">Admin Panel</span>
        </div>

        {/* Admin Profile */}
        {adminProfile && (
          <div className="p-4 mx-4 my-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-black text-sm">
                {adminProfile.full_name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-[12px] font-black text-white leading-none">{adminProfile.full_name || 'Admin'}</p>
                <p className="text-[9px] font-bold text-orange-500 mt-0.5 tracking-widest uppercase">Administrator</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1">
          <span className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl font-bold text-sm">
            <BarChart3 size={16} /> Overview
          </span>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center justify-between px-4 py-3 w-full rounded-xl transition-all text-sm font-bold ${activeTab === "orders" ? "bg-orange-500/20 text-orange-400" : "text-gray-400 hover:bg-white/5"}`}
          >
            <span className="flex items-center gap-3"><ShoppingBag size={16} /> Custom Orders</span>
            {pendingOrders.length > 0 && (
              <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingOrders.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center justify-between px-4 py-3 w-full rounded-xl transition-all text-sm font-bold ${activeTab === "products" ? "bg-orange-500/20 text-orange-400" : "text-gray-400 hover:bg-white/5"}`}
          >
            <span className="flex items-center gap-3"><Package size={16} /> Product Reviews</span>
            {pendingProducts.length > 0 && (
              <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingProducts.length}</span>
            )}
          </button>
          <div className="pt-2">
            <p className="px-4 text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Reports</p>
            <span className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl text-sm font-bold cursor-pointer">
              <Users size={16} /> Suppliers ({suppliers.length})
            </span>
            <span className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl text-sm font-bold cursor-pointer">
              <User size={16} /> Customers ({customers.length})
            </span>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl text-sm font-bold">
            <ArrowRight size={16} /> View Site
          </Link>
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 w-full rounded-xl text-sm font-bold transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#111] leading-none uppercase tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
              System Control
            </h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-1">Platform Overview & Administrative Actions</p>
          </div>
          {totalPending > 0 && (
            <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-5 py-3 animate-pulse">
              <AlertCircle size={20} className="text-orange-500" />
              <span className="text-sm font-black text-orange-600 uppercase tracking-widest">
                {totalPending} Requests Pending
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-[8px_8px_24px_#e8e8e8,-8px_-8px_24px_#ffffff] rounded-[2rem] overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg flex-shrink-0`}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-[#111] leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab Header */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${activeTab === "orders" ? "bg-[#111] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"}`}
          >
            Custom Orders {pendingOrders.length > 0 && `(${pendingOrders.length})`}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${activeTab === "products" ? "bg-[#111] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"}`}
          >
            Supplier Products {pendingProducts.length > 0 && `(${pendingProducts.length})`}
          </button>
        </div>

        {/* === ORDERS TAB === */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-black text-[#111] uppercase tracking-tight">Pending Customer Orders</h2>
                  <Clock size={18} className="text-orange-500" />
                </div>
                <div className="p-4 space-y-3">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50/60 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all">
                      <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
                          {order.mockup_image_url
                            ? <img src={order.mockup_image_url} className="w-full h-full object-contain p-1" alt="Design" />
                            : <Box size={24} className="text-gray-300" />
                          }
                        </div>
                        <div>
                          <p className="font-extrabold text-[#111] text-sm">{order.product_type}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {/* Customer */}
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                              <User size={9} /> {order.customer?.full_name || order.customer?.email || 'Unknown'}
                            </span>
                            {/* Color/Variant */}
                            <span className="text-[10px] font-bold text-gray-500">
                              {order.variants?.color || 'Default'} • {order.variants?.view || 'Front'}
                            </span>
                          </div>
                          {/* Supplier product info */}
                          {order.supplier_product && (
                            <p className="text-[10px] font-bold text-green-600 mt-1 flex items-center gap-1">
                              <ShieldCheck size={9} /> Will auto-assign to: {order.supplier_product.supplier?.full_name}
                            </p>
                          )}
                          <p className="text-[9px] text-gray-400 font-bold mt-1">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#111] transition-all">
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="p-2.5 bg-white border-2 border-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                        >
                          <XCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleApproveOrder(order)}
                          className="bg-[#ccff00] text-[#111] px-4 py-2.5 rounded-xl font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-sm"
                        >
                          <CheckCircle size={16} /> APPROVE
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingOrders.length === 0 && (
                    <div className="p-16 text-center text-gray-400 italic font-medium">
                      <CheckCircle size={40} className="mx-auto text-gray-200 mb-4" />
                      All clear! No pending orders.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Supplier & Customer Registry */}
            <div className="space-y-5">
              {/* Suppliers */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-black text-[#111] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Users size={14} className="text-blue-500" /> Suppliers ({suppliers.length})
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {suppliers.map(s => (
                    <div key={s.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs flex-shrink-0">
                        {s.full_name?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-[#111] truncate">{s.full_name}</p>
                        <p className="text-[9px] text-gray-400 font-bold truncate">{s.email}</p>
                      </div>
                    </div>
                  ))}
                  {suppliers.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No suppliers yet</p>}
                </div>
              </div>

              {/* Customers */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-black text-[#111] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User size={14} className="text-teal-500" /> Customers ({customers.length})
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {customers.map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-black text-xs flex-shrink-0">
                        {c.full_name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-[#111] truncate">{c.full_name || 'Customer'}</p>
                        <p className="text-[9px] text-gray-400 font-bold truncate">{c.email}</p>
                      </div>
                    </div>
                  ))}
                  {customers.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No customers yet</p>}
                </div>
              </div>

              {/* Recent All Orders */}
              <div className="bg-[#111] rounded-[2rem] p-6 text-white">
                <h3 className="text-sm font-black text-[#ccff00] uppercase tracking-widest mb-4">All Order History</h3>
                <div className="space-y-3">
                  {allOrders.slice(0, 6).map(o => (
                    <div key={o.id} className="flex justify-between items-center">
                      <p className="text-[11px] font-bold text-gray-300 truncate max-w-[130px]">{o.product_type}</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${STATUS_COLOR[o.status] || 'bg-gray-700 text-gray-300'}`}>
                        {o.status?.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                  {allOrders.length === 0 && <p className="text-xs text-gray-600 text-center py-4">No orders yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === PRODUCTS TAB === */}
        {activeTab === "products" && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <h2 className="text-lg font-black text-[#111] uppercase tracking-tight">Supplier Product Submissions</h2>
              <span className="text-xs font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{pendingProducts.length} pending</span>
            </div>

            {pendingProducts.length === 0 ? (
              <div className="p-16 text-center text-gray-400">
                <CheckCircle size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="italic font-medium">No products waiting for approval.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {pendingProducts.map((product) => (
                  <div key={product.id} className="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                    {/* Product Image */}
                    <div className="h-48 bg-gray-100 overflow-hidden relative">
                      {product.image_url
                        ? <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.name} />
                        : <div className="w-full h-full flex items-center justify-center text-gray-200"><Box size={48} /></div>
                      }
                      <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                        {(product.tags || []).slice(0, 2).map((tag: string) => (
                          <span key={tag} className="bg-white/90 backdrop-blur text-[#111] text-[9px] font-black px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="p-5">
                      {/* Supplier */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
                          {product.supplier?.full_name?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{product.supplier?.full_name}</span>
                      </div>

                      <h3 className="font-black text-[#111] text-base mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black bg-gray-200 text-gray-700 px-2 py-1 rounded-lg">{product.product_type}</span>
                        <span className="text-sm font-black text-[#111]">${product.price}</span>
                      </div>

                      {/* Colors */}
                      <div className="flex gap-1 mb-4">
                        {(product.available_colors || []).slice(0, 8).map((c: any) => (
                          <div key={c.hex} title={c.name} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c.hex }} />
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRejectProduct(product.id)}
                          className="flex-1 bg-white border-2 border-red-100 text-red-500 py-2.5 rounded-xl font-black text-xs hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveProduct(product.id)}
                          className="flex-1 bg-[#ccff00] text-[#111] py-2.5 rounded-xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-md"
                        >
                          ✓ Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#111] uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
                Order Details
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-900">
                <XCircle size={28} />
              </button>
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6 max-h-[80vh] overflow-y-auto">
              {/* Left Column: Images */}
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                 {selectedOrder.mockup_image_url && (
                   <div className="w-full h-64 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group">
                     <p className="absolute top-2 left-3 text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">Design Mockup</p>
                     <img src={selectedOrder.mockup_image_url} className="w-full h-full object-contain p-2" alt="Design" />
                   </div>
                 )}
                 {selectedOrder.variants?.receiptDataUrl && (
                   <div className="w-full h-40 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative flex items-center justify-center group">
                      <p className="absolute top-2 left-3 text-[10px] font-black text-gray-400 uppercase tracking-widest z-10 bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">Payment Receipt</p>
                      <img src={selectedOrder.variants.receiptDataUrl} className="max-w-full max-h-full object-contain p-4" alt="Receipt" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a 
                             href={selectedOrder.variants.receiptDataUrl} 
                             download={`Receipt_${selectedOrder.id}.png`}
                             className="bg-[#ccff00] text-[#111] px-4 py-2 rounded-xl font-black flex items-center gap-2 text-xs uppercase tracking-wider shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-[#b3e600]"
                          >
                             <Download size={14} /> Download
                          </a>
                      </div>
                   </div>
                 )}
              </div>

              {/* Right Column: Details */}
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="bg-gray-50 rounded-2xl p-4">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                     <p className="font-black text-[#111] text-sm">{selectedOrder.customer?.full_name || 'N/A'}</p>
                     <p className="text-xs text-gray-500">{selectedOrder.customer?.email}</p>
                   </div>
                   <div className="bg-gray-50 rounded-2xl p-4">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount & Status</p>
                     <p className="font-black text-emerald-600 text-sm">
                       ${((selectedOrder.variants?.quality === "Premium" ? 30 : 25) * (selectedOrder.variants?.quantity || 1)).toFixed(2)} Total
                     </p>
                     <p className="text-xs text-gray-500 font-medium mt-0.5">Paid: ${(((selectedOrder.variants?.quality === "Premium" ? 30 : 25) * (selectedOrder.variants?.quantity || 1)) / 2).toFixed(2)} (Advance)</p>
                   </div>
                 </div>

                 <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Product Details</p>
                    <div className="grid grid-cols-2 gap-y-3 mt-3">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Type</p>
                            <p className="font-black text-[#111] text-xs">{selectedOrder.product_type}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Variant</p>
                            <p className="font-black text-[#111] text-xs">{selectedOrder.variants?.color} • {selectedOrder.variants?.view}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Size</p>
                            <p className="font-black text-[#111] text-xs">{selectedOrder.variants?.size || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Quantity</p>
                            <p className="font-black text-[#111] text-xs">{selectedOrder.variants?.quantity || 1}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Quality</p>
                            <p className="font-black text-[#111] text-xs">{selectedOrder.variants?.quality || 'Standard'}</p>
                        </div>
                    </div>
                 </div>

                 <div className="bg-green-50 rounded-2xl p-4">
                   <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">Auto-Assign To</p>
                   <p className="font-black text-[#111] text-sm">
                     {selectedOrder.supplier_product?.supplier?.full_name || '⚠️ No linked supplier product — will need manual routing'}
                   </p>
                 </div>

                 <div className="flex gap-3 mt-auto pt-2">
                   <button onClick={() => handleRejectOrder(selectedOrder.id)} className="flex-1 bg-red-50 text-red-500 py-3 rounded-xl font-black border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all">
                     Reject
                   </button>
                   <button onClick={() => handleApproveOrder(selectedOrder)} className="flex-[2] bg-[#ccff00] text-[#111] py-3 rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-lg">
                     ✓ Approve & Assign
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  PENDING_ADMIN: "bg-yellow-100 text-yellow-700",
  ASSIGNED_TO_SUPPLIER: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED_BY_SUPPLIER: "bg-green-100 text-green-700",
};
