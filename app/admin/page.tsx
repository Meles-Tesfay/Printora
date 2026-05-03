"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag, CheckCircle, Clock, XCircle, BarChart3, Users,
  User, Box, Truck, ArrowRight, ShieldCheck, AlertCircle,
  Package, Palette, Loader2, LogOut, Eye, Download, Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [adminTags, setAdminTags] = useState<string[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "processing" | "receipts" | "products" | "suppliers" | "customers">("orders");
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setActiveImageUrl(null);
  }, [selectedProduct]);

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
    const [ordersRes, productsRes, profilesRes, allOrdersRes] = await Promise.all([
      // Active customer orders
      supabase
        .from("custom_orders")
        .select("*, customer:profiles(*), supplier_product:supplier_products(*, supplier:profiles(*))")
        .in("status", ["PENDING_ADMIN", "ASSIGNED_TO_SUPPLIER", "SAMPLE_AWAITING_APPROVAL", "SAMPLE_REJECTED", "FINAL_PAYMENT_PENDING", "PRODUCTION_APPROVED_AND_PAID", "COMPLETED_BY_SUPPLIER"])
        .order("created_at", { ascending: false }),

      // Products submitted by suppliers awaiting approval
      supabase
        .from("supplier_products")
        .select("*, supplier:profiles(full_name, email)")
        .eq("status", "PENDING")
        .order("created_at", { ascending: false }),

      // ALL profiles to categorize locally (more robust)
      supabase.from("profiles").select("*"),

      // History orders overview
      supabase
        .from("custom_orders")
        .select("id, status, created_at, product_type, customer_id")
        .in("status", ["DELIVERED", "REJECTED"])
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (profilesRes.data) {
      console.log("Total profiles fetched:", profilesRes.data.length);
      const allProfs = profilesRes.data;
      
      const supplierList = allProfs.filter(p => p.role?.toUpperCase() === "SUPPLIER");
      const customerList = allProfs.filter(p => p.role?.toUpperCase() === "CUSTOMER");
      
      console.log("Categorized Suppliers:", supplierList.length);
      console.log("Categorized Customers:", customerList.length);
      
      setSuppliers(supplierList);
      setCustomers(customerList);
    }

    let enrichedOrders = ordersRes.data || [];

    // Enrich orders with customer info manually
    if (enrichedOrders.length > 0) {
      const customerIds = [...new Set(enrichedOrders.map((o: any) => o.customer_id).filter(Boolean))];
      if (customerIds.length > 0) {
        const { data: customerProfiles } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, location")
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
    if (!allOrdersRes.error) setAllOrders(allOrdersRes.data || []);

    // Log errors to console for debugging
    if (ordersRes.error) console.error("Orders fetch error:", ordersRes.error);
    if (profilesRes.error) console.error("Profiles fetch error:", profilesRes.error);
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

  const handleApproveFinalPayment = async (orderId: string) => {
    if (!confirm("Confirm that final payment receipt is valid? This will move the order to PRODUCTION.")) return;
    const { error } = await supabase
      .from("custom_orders")
      .update({ status: "PRODUCTION_APPROVED_AND_PAID" })
      .eq("id", orderId);

    if (error) alert("Error: " + error.message);
    else {
      setSelectedOrder(null);
      fetchAll();
    }
  };

  const handleRejectFinalPayment = async (orderId: string, currentVariants: any) => {
    const reason = prompt("Why are you rejecting this receipt? (Customer will see this)");
    if (!reason) return;

    const newVariants = { 
      ...currentVariants, 
      finalReceiptRejected: true,
      finalReceiptRejectionReason: reason,
      finalReceiptUrl: null // Clear the invalid receipt
    };

    const { error } = await supabase
      .from("custom_orders")
      .update({ 
        status: "SAMPLE_AWAITING_APPROVAL", // Move back to awaiting approval so they can re-upload
        variants: newVariants 
      })
      .eq("id", orderId);

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

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this order? This cannot be undone.")) return;
    const { error } = await supabase.from("custom_orders").delete().eq("id", id);
    if (error) {
      alert("Error deleting order: " + error.message);
    } else {
      setAllOrders(prev => prev.filter(o => o.id !== id));
      setPendingOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const handleMarkAsDelivered = async (id: string) => {
    if (!confirm("Mark this order as delivered? This will allow the customer to provide feedback.")) return;
    const { error } = await supabase
      .from("custom_orders")
      .update({ status: "DELIVERED" })
      .eq("id", id);
    if (error) alert("Error: " + error.message);
    else fetchAll();
  };

  // Approve a supplier product → it appears on landing page
  const handleApproveProduct = async (id: string) => {
    const product = pendingProducts.find(p => p.id === id);
    const existingTags = Array.isArray(product?.tags) ? product.tags : [];
    const finalTags = [...new Set([...existingTags, ...adminTags])];

    const { error } = await supabase
      .from("supplier_products")
      .update({ 
        status: "APPROVED",
        tags: finalTags
      })
      .eq("id", id);
      
    if (error) alert("Error: " + error.message);
    else { 
      setSelectedProduct(null); 
      setAdminTags([]);
      fetchAll(); 
    }
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
    DELIVERED: "bg-teal-100 text-teal-700",
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
      <aside className="w-64 bg-white text-gray-800 border-r border-gray-100 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2 block">Admin Panel</span>
        </div>

        {/* Admin Profile */}
        {adminProfile && (
          <div className="p-4 mx-4 my-4 bg-[#A1FF4D]/10 rounded-2xl border border-[#A1FF4D]/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[#1B2412] font-black text-sm">
                {adminProfile.full_name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="text-[12px] font-black text-[#2B3220] leading-none">{adminProfile.full_name || 'Admin'}</p>
                <p className="text-[9px] font-bold text-[#567a28] mt-0.5 tracking-widest uppercase">Administrator</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center justify-between px-4 py-3 w-full rounded-xl transition-all text-sm font-bold ${activeTab === "orders" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <span className="flex items-center gap-3"><ShoppingBag size={16} /> New Orders</span>
            {pendingOrders.filter(o => o.status === "PENDING_ADMIN").length > 0 && (
              <span className="bg-[#A1FF4D] text-[#1B2412] text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {pendingOrders.filter(o => o.status === "PENDING_ADMIN").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("processing")}
            className={`flex items-center justify-between px-4 py-3 w-full rounded-xl transition-all text-sm font-bold ${activeTab === "processing" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <span className="flex items-center gap-3"><Truck size={16} /> In Production</span>
            {pendingOrders.filter(o => ["ASSIGNED_TO_SUPPLIER", "SAMPLE_AWAITING_APPROVAL", "SAMPLE_REJECTED", "PRODUCTION_APPROVED_AND_PAID", "COMPLETED_BY_SUPPLIER"].includes(o.status)).length > 0 && (
              <span className="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {pendingOrders.filter(o => ["ASSIGNED_TO_SUPPLIER", "SAMPLE_AWAITING_APPROVAL", "SAMPLE_REJECTED", "PRODUCTION_APPROVED_AND_PAID", "COMPLETED_BY_SUPPLIER"].includes(o.status)).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("receipts")}
            className={`flex items-center justify-between px-4 py-3 w-full rounded-xl transition-all text-sm font-bold ${activeTab === "receipts" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <span className="flex items-center gap-3"><ShieldCheck size={16} /> Final Payment</span>
            {pendingOrders.filter(o => o.status === "FINAL_PAYMENT_PENDING").length > 0 && (
              <span className="bg-amber-400 text-[#1B2412] text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {pendingOrders.filter(o => o.status === "FINAL_PAYMENT_PENDING").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center justify-between px-4 py-3 w-full rounded-xl transition-all text-sm font-bold ${activeTab === "products" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <span className="flex items-center gap-3"><Package size={16} /> Product Reviews</span>
            {pendingProducts.length > 0 && (
              <span className="bg-[#A1FF4D] text-[#1B2412] text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingProducts.length}</span>
            )}
          </button>
          <div className="pt-2">
            <p className="px-4 text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Users</p>
            <button
              onClick={() => setActiveTab("suppliers")}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold transition-all ${activeTab === "suppliers" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <Users size={16} /> Suppliers ({suppliers.length})
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold transition-all ${activeTab === "customers" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <User size={16} /> Customers ({customers.length})
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 rounded-xl text-sm font-bold">
            <ArrowRight size={16} /> View Site
          </Link>
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 w-full rounded-xl text-sm font-bold transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
          <div className="flex items-start justify-between w-full">
            <div>
              <h1 className="text-4xl font-black text-[#111] leading-none uppercase tracking-normal" style={{ fontFamily: 'Impact, sans-serif', wordSpacing: '0.15em' }}>
                System Control
              </h1>
              <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-1">Platform Overview & Administrative Actions</p>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <button 
                onClick={() => setShowOrderHistory(true)}
                className="flex items-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
              >
                <Clock size={16} /> History
              </button>
              
              {totalPending > 0 && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 animate-pulse shadow-sm">
                  <AlertCircle size={14} className="text-orange-500" />
                  <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                    {totalPending} Pending
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* === NEW ORDERS TAB === */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-black text-[#111] uppercase tracking-tight">Orders Awaiting Review</h2>
                <ShoppingBag size={18} className="text-[#A1FF4D]" />
              </div>
              <div className="p-4 space-y-3">
                {pendingOrders.filter(o => o.status === "PENDING_ADMIN").map((order) => (
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
                          <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            <User size={9} /> {order.customer?.full_name || order.customer?.email || 'Unknown'}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500">
                            {order.variants?.color || 'Default'} • {order.variants?.view || 'Front'}
                          </span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#111] transition-all" title="View Order Details">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="p-2.5 bg-white border-2 border-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                        title="Reject Order"
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
                {pendingOrders.filter(o => o.status === "PENDING_ADMIN").length === 0 && (
                  <div className="p-16 text-center text-gray-400 italic font-medium">
                    <CheckCircle size={40} className="mx-auto text-gray-200 mb-4" />
                    No new orders awaiting review.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === PAYMENT APPROVALS TAB === */}
        {activeTab === "receipts" && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-amber-50/30">
                <h2 className="text-lg font-black text-[#111] uppercase tracking-tight">Final Payment</h2>
                <ShieldCheck size={18} className="text-amber-500" />
              </div>
              <div className="p-4 space-y-3">
                {pendingOrders.filter(o => o.status === "FINAL_PAYMENT_PENDING").map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-amber-50/20 rounded-2xl border border-amber-100 hover:bg-white hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
                        {order.variants?.finalReceiptUrl
                          ? <img src={order.variants.finalReceiptUrl} className="w-full h-full object-contain p-1" alt="Receipt" />
                          : <Box size={24} className="text-gray-300" />
                        }
                      </div>
                      <div>
                        <p className="font-extrabold text-[#111] text-sm">{order.product_type}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">
                            <User size={9} /> {order.customer?.full_name || order.customer?.email}
                          </span>
                          <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-white px-2 py-0.5 rounded-md shadow-sm border border-amber-100">
                             Wait Receipt Approval
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#111] transition-all" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleRejectFinalPayment(order.id, order.variants)}
                        className="bg-white border-2 border-red-100 text-red-500 px-4 py-2.5 rounded-xl font-black hover:bg-red-500 hover:text-white transition-all text-xs"
                      >
                        REJECT RECEIPT
                      </button>
                      <button
                        onClick={() => handleApproveFinalPayment(order.id)}
                        className="bg-amber-400 text-[#1B2412] px-4 py-2.5 rounded-xl font-black shadow-md hover:scale-105 active:scale-95 transition-all text-xs"
                      >
                        APPROVE PAYMENT
                      </button>
                    </div>
                  </div>
                ))}
                {pendingOrders.filter(o => o.status === "FINAL_PAYMENT_PENDING").length === 0 && (
                  <div className="p-16 text-center text-gray-400 italic font-medium">
                    <CheckCircle size={40} className="mx-auto text-gray-200 mb-4" />
                    All receipts verified!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === IN PRODUCTION TAB === */}
        {activeTab === "processing" && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/30">
                <h2 className="text-lg font-black text-[#111] uppercase tracking-tight">Active Production Pipeline</h2>
                <Truck size={18} className="text-blue-500" />
              </div>
              <div className="p-4 space-y-3">
                {pendingOrders.filter(o => ["ASSIGNED_TO_SUPPLIER", "SAMPLE_AWAITING_APPROVAL", "SAMPLE_REJECTED", "PRODUCTION_APPROVED_AND_PAID", "COMPLETED_BY_SUPPLIER"].includes(o.status)).map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                        {order.mockup_image_url
                          ? <img src={order.mockup_image_url} className="w-full h-full object-contain p-1" alt="Design" />
                          : <Box size={24} className="text-gray-300" />
                        }
                      </div>
                      <div>
                        <p className="font-extrabold text-[#111] text-sm">{order.product_type}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            <User size={9} /> {order.customer?.full_name || order.customer?.email}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm border uppercase tracking-tighter ${
                            order.status === "COMPLETED_BY_SUPPLIER" ? "bg-green-50 text-green-600 border-green-100" :
                            order.status === "PRODUCTION_APPROVED_AND_PAID" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            order.status === "SAMPLE_REJECTED" ? "bg-red-50 text-red-600 border-red-100" :
                            "bg-blue-50 text-blue-600 border-blue-100"
                          }`}>
                             {order.status?.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => setSelectedOrder(order)} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#111] transition-all" title="View Details">
                        <Eye size={16} />
                      </button>
                      
                      {order.status === "COMPLETED_BY_SUPPLIER" && (
                        <button
                          onClick={() => handleMarkAsDelivered(order.id)}
                          className="bg-teal-500 text-white px-4 py-2.5 rounded-xl font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-sm uppercase tracking-widest"
                        >
                          <Truck size={14} /> Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {pendingOrders.filter(o => ["ASSIGNED_TO_SUPPLIER", "SAMPLE_AWAITING_APPROVAL", "SAMPLE_REJECTED", "PRODUCTION_APPROVED_AND_PAID", "COMPLETED_BY_SUPPLIER"].includes(o.status)).length === 0 && (
                  <div className="p-16 text-center text-gray-400 italic font-medium">
                    <Box size={40} className="mx-auto text-gray-200 mb-4" />
                    No orders currently in production.
                  </div>
                )}
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
                      {/* View Eye Button */}
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
                      >
                        <Eye size={16} />
                      </button>
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

        {/* === SUPPLIERS TAB === */}
        {activeTab === "suppliers" && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-6">
            <h3 className="text-xl font-black text-[#111] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users size={20} className="text-blue-500" /> Suppliers Directory ({suppliers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map(s => (
                <div key={s.id} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md hover:bg-white transition-all cursor-pointer" onClick={() => setSelectedUser(s)}>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-lg flex-shrink-0 mt-1">
                    {s.full_name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-[#111] truncate">{s.full_name}</p>
                    <p className="text-xs text-gray-500 font-bold truncate mb-2">{s.email}</p>
                    {s.phone && <p className="text-[11px] text-gray-400 font-medium">📞 {s.phone}</p>}
                    {s.location && <p className="text-[11px] text-gray-400 font-medium mt-0.5">📍 {s.location}</p>}
                  </div>
                </div>
              ))}
              {suppliers.length === 0 && <div className="col-span-full text-center text-gray-400 py-10">No suppliers registered.</div>}
            </div>
          </div>
        )}

        {/* === CUSTOMERS TAB === */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden p-6">
            <h3 className="text-xl font-black text-[#111] uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={20} className="text-teal-500" /> Customers Directory ({customers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map(c => (
                <div key={c.id} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md hover:bg-white transition-all cursor-pointer" onClick={() => setSelectedUser(c)}>
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-black text-lg flex-shrink-0 mt-1">
                    {c.full_name?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-[#111] truncate">{c.full_name || 'Customer'}</p>
                    <p className="text-xs text-gray-500 font-bold truncate mb-2">{c.email}</p>
                    {c.phone && <p className="text-[11px] text-gray-400 font-medium">📞 {c.phone}</p>}
                    {c.location && <p className="text-[11px] text-gray-400 font-medium mt-0.5">📍 {c.location}</p>}
                  </div>
                </div>
              ))}
              {customers.length === 0 && <div className="col-span-full text-center text-gray-400 py-10">No customers registered.</div>}
            </div>
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#111] uppercase" style={{ fontFamily: 'Impact, sans-serif', wordSpacing: '0.15em' }}>
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
                  <div className="flex flex-col gap-4">
                    {/* Initial Receipt (Deposit) */}
                    {selectedOrder.variants?.receiptDataUrl && (
                      <div className="w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group min-h-[160px] flex items-center justify-center">
                          <p className="absolute top-2 left-3 text-[10px] font-black text-gray-400 uppercase tracking-widest z-10 bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">1st Receipt: Deposit (50%)</p>
                          <img src={selectedOrder.variants.receiptDataUrl} className="max-w-full max-h-full object-contain p-4" alt="Deposit Receipt" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a 
                                 href={selectedOrder.variants.receiptDataUrl} 
                                 target="_blank"
                                 className="bg-white text-[#111] px-4 py-2 rounded-xl font-black flex items-center gap-2 text-xs uppercase tracking-wider shadow-xl transition-all"
                              >
                                 <Eye size={14} /> Full View
                              </a>
                          </div>
                      </div>
                    )}

                    {/* Final Receipt (Remaining Balance) */}
                    {selectedOrder.variants?.finalReceiptUrl && (
                      <div className="w-full bg-amber-50 rounded-2xl overflow-hidden border border-amber-100 relative group min-h-[160px] flex items-center justify-center">
                          <p className="absolute top-2 left-3 text-[10px] font-black text-amber-600 uppercase tracking-widest z-10 bg-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">Final Receipt: Balance (50%)</p>
                          <img src={selectedOrder.variants.finalReceiptUrl} className="max-w-full max-h-full object-contain p-4" alt="Final Receipt" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a 
                                 href={selectedOrder.variants.finalReceiptUrl} 
                                 target="_blank"
                                 className="bg-white text-[#111] px-4 py-2 rounded-xl font-black flex items-center gap-2 text-xs uppercase tracking-wider shadow-xl transition-all"
                              >
                                 <Eye size={14} /> Full View
                              </a>
                          </div>
                      </div>
                    )}
                  </div>
              </div>

              {/* Right Column: Details */}
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer</p>
                      <p className="font-black text-[#111] text-sm">{selectedOrder.customer?.full_name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{selectedOrder.customer?.email}</p>
                      {selectedOrder.customer?.phone && <p className="text-[10px] text-gray-400 font-bold mt-1">📞 {selectedOrder.customer.phone}</p>}
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount & Status</p>
                      <p className="font-black text-emerald-600 text-sm">
                        {((selectedOrder.supplier_product?.price || (selectedOrder.variants?.quality === "Premium" ? 30 : 25)) * (selectedOrder.variants?.quantity || 1)).toLocaleString()} ETB Total
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">Paid: {(((selectedOrder.supplier_product?.price || (selectedOrder.variants?.quality === "Premium" ? 30 : 25)) * (selectedOrder.variants?.quantity || 1)) / 2).toLocaleString()} ETB (Advance)</p>
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
                    {selectedOrder.status === "PENDING_ADMIN" ? (
                      <>
                        <button onClick={() => handleRejectOrder(selectedOrder.id)} className="flex-1 bg-red-50 text-red-500 py-3 rounded-xl font-black border-2 border-red-100 hover:bg-red-500 hover:text-white transition-all">
                          Reject
                        </button>
                        <button onClick={() => handleApproveOrder(selectedOrder)} className="flex-[2] bg-[#ccff00] text-[#111] py-3 rounded-xl font-black hover:scale-105 active:scale-95 transition-all shadow-lg uppercase text-xs tracking-widest">
                          Approve & Assign
                        </button>
                      </>
                    ) : selectedOrder.status === "FINAL_PAYMENT_PENDING" ? (
                      <div className="flex gap-3 w-full">
                        <button 
                          onClick={() => handleRejectFinalPayment(selectedOrder.id, selectedOrder.variants)} 
                          className="flex-1 bg-white border-2 border-red-100 text-red-500 py-4 rounded-xl font-black hover:bg-red-500 hover:text-white transition-all uppercase text-xs tracking-widest"
                        >
                          Reject Receipt
                        </button>
                        <button 
                          onClick={() => handleApproveFinalPayment(selectedOrder.id)} 
                          className="flex-[2] bg-amber-400 text-[#1B2412] py-4 rounded-xl font-black hover:bg-amber-500 transition-all shadow-xl flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                        >
                          <ShieldCheck size={18} /> Approve Payment
                        </button>
                      </div>
                    ) : (
                      <div className="w-full py-3 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center border-2 bg-gray-100 text-gray-600 border-gray-200">
                        Status: {selectedOrder.status?.replace(/_/g, ' ')}
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-2xl font-black text-[#111] uppercase tracking-normal" style={{ fontFamily: 'Impact, sans-serif', wordSpacing: '0.15em' }}>Review Submission</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <XCircle size={32} />
              </button>
            </div>
            
            <div className="p-10 overflow-y-auto max-h-[85vh]">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Left Column: Image Gallery */}
                <div className="w-full lg:w-[45%] flex flex-col gap-6">
                  <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center relative shadow-inner">
                     <img src={activeImageUrl || selectedProduct.image_url} className="w-full h-full object-contain p-6 transition-all duration-300" alt="Primary" />
                     <div className="absolute top-6 left-6 bg-[#ccff00] text-[#111] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                       {(() => {
                         if (!activeImageUrl || activeImageUrl === selectedProduct.image_url) return "Primary View";
                         if (activeImageUrl === selectedProduct.hover_image_url) return "Hover View";
                         const imgs = Array.isArray(selectedProduct.detail_images) ? selectedProduct.detail_images : (selectedProduct.detail_images?.split(',').filter(Boolean) || []);
                         const idx = imgs.findIndex((img: string) => img.trim() === activeImageUrl);
                         if (idx !== -1) return `Extra ${idx + 1} View`;
                         return "Primary View";
                       })()}
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div onClick={() => setActiveImageUrl(selectedProduct.image_url)} className={`aspect-square rounded-2xl overflow-hidden bg-gray-50 border flex items-center justify-center relative group cursor-pointer ${(!activeImageUrl || activeImageUrl === selectedProduct.image_url) ? 'border-[#ccff00] border-2' : 'border-gray-100'}`}>
                      <img src={selectedProduct.image_url} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" alt="Primary Thumb" />
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Primary</div>
                    </div>
                    {selectedProduct.hover_image_url && (
                      <div onClick={() => setActiveImageUrl(selectedProduct.hover_image_url)} className={`aspect-square rounded-2xl overflow-hidden bg-gray-50 border flex items-center justify-center relative group cursor-pointer ${activeImageUrl === selectedProduct.hover_image_url ? 'border-[#ccff00] border-2' : 'border-gray-100'}`}>
                        <img src={selectedProduct.hover_image_url} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" alt="Hover" />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Hover</div>
                      </div>
                    )}
                    {(() => {
                      const imgs = Array.isArray(selectedProduct.detail_images) 
                        ? selectedProduct.detail_images 
                        : (selectedProduct.detail_images?.split(',').filter(Boolean) || []);
                      
                      return imgs.map((img: string, i: number) => (
                        <div key={i} onClick={() => setActiveImageUrl(img.trim())} className={`aspect-square rounded-2xl overflow-hidden bg-gray-50 border flex items-center justify-center relative group cursor-pointer ${activeImageUrl === img.trim() ? 'border-[#ccff00] border-2' : 'border-gray-100'}`}>
                          <img src={img.trim()} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" alt={`Extra ${i}`} />
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Extra {i+1}</div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
                
                {/* Right Column: Detailed Info */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg uppercase border border-blue-100">
                        {selectedProduct.product_type}
                      </span>
                      {selectedProduct.quality && (
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg uppercase border border-emerald-100">
                          {selectedProduct.quality}
                        </span>
                      )}
                    </div>
                    <h4 className="text-3xl font-black text-[#111] leading-tight mb-1">{selectedProduct.name}</h4>
                    <p className="text-2xl font-black text-[#3da85b]">{selectedProduct.price} ETB</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Turnaround</p>
                      <p className="text-sm font-black text-gray-700">{selectedProduct.turnaround_time || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bulk Pricing</p>
                      <p className="text-sm font-black text-gray-700">{selectedProduct.bulk_pricing || 'None'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Short Description</p>
                    <p className="text-sm text-gray-600 font-bold">{selectedProduct.description}</p>
                  </div>

                  {selectedProduct.long_description && (
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Description</p>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium whitespace-pre-line">{selectedProduct.long_description}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProduct.available_colors || []).map((c: any) => (
                        <div key={c.hex} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                          <div className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: c.hex }} />
                          <span className="text-[10px] font-black text-gray-700">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProduct.available_sizes || []).map((s: string) => (
                        <span key={s} className="bg-white text-gray-800 px-4 py-1.5 rounded-xl text-[10px] font-black border-2 border-gray-100 shadow-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Admin Promotion Tags */}
                  <div className="bg-[#ccff00]/10 border border-[#ccff00]/20 p-5 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Sparkles size={12} className="text-gray-600" /> Promotion Tags (Admin Only)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Bestseller", "New Arrival", "Featured", "Limited Edition"].map(tag => {
                        const active = adminTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => setAdminTags(prev => active ? prev.filter(t => t !== tag) : [...prev, tag])}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all ${
                              active 
                                ? 'bg-[#111] text-[#ccff00] border-[#111]' 
                                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="flex gap-4 mt-12 pt-8 border-t border-gray-100">
                <button
                  onClick={() => handleRejectProduct(selectedProduct.id)}
                  className="flex-1 bg-white border-2 border-red-100 text-red-500 py-4 rounded-[1.5rem] font-black text-xs hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-md uppercase tracking-widest"
                >
                  Reject Submission
                </button>
                <button
                  onClick={() => handleApproveProduct(selectedProduct.id)}
                  className="flex-1 bg-[#ccff00] text-[#111] py-4 rounded-[1.5rem] font-black text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl uppercase tracking-widest"
                >
                  Approve & Go Live
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden flex flex-col items-center p-8 text-center relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900">
              <XCircle size={24} />
            </button>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mb-4 ${selectedUser.role === 'SUPPLIER' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'}`}>
              {selectedUser.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h3 className="text-xl font-black text-[#111]">{selectedUser.full_name || 'User'}</h3>
            <p className="text-sm text-gray-500 font-bold mb-6">{selectedUser.email}</p>
            
            <div className="w-full space-y-3 text-left bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                <p className="text-sm font-bold text-gray-800">{selectedUser.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Location</p>
                <p className="text-sm font-bold text-gray-800">{selectedUser.location || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Joined</p>
                <p className="text-sm font-bold text-gray-800">{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-[#111] rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-black text-[#ccff00] uppercase tracking-widest" style={{ fontFamily: 'Impact, sans-serif', wordSpacing: '0.2em' }}>
                All Order History
              </h3>
              <button onClick={() => setShowOrderHistory(false)} className="text-gray-500 hover:text-white transition-colors">
                <XCircle size={28} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {allOrders.length === 0 ? (
                <div className="text-center text-gray-500 py-10 italic">No order history available.</div>
              ) : (
                <div className="space-y-4">
                  {allOrders.map(o => (
                    <div key={o.id} className="flex flex-col sm:flex-row justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-sm font-bold text-white">{o.product_type}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${STATUS_COLOR[o.status] || 'bg-gray-700 text-gray-300'}`}>
                            {o.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium">Order ID: {o.id}</p>
                        <p className="text-[11px] text-gray-500 mt-1">{new Date(o.created_at).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteOrder(o.id)}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-500/20 hover:border-red-500"
                      >
                        Delete Order
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
  DELIVERED: "bg-teal-100 text-teal-700",
};
