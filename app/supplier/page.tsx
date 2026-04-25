"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag, Plus, LogOut, CheckCircle, Clock, XCircle,
  BarChart3, Box, Image as ImageIcon, User, Palette, Tag,
  Package, Upload, Loader2, ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PRODUCT_TYPES = ["T-Shirt", "Hoodie", "Mug", "Hat", "Phone Case", "Sweater", "Tote Bag", "Poster"];
const PRESET_COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Red", hex: "#dc2626" },
  { name: "Forest Green", hex: "#166534" },
  { name: "Sky Blue", hex: "#0ea5e9" },
  { name: "Maroon", hex: "#7f1d1d" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Lime", hex: "#A1FF4D" },
  { name: "Orange", hex: "#f97316" },
  { name: "Purple", hex: "#7c3aed" },
  { name: "Pink", hex: "#ec4899" },
];

export default function SupplierDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    product_type: "T-Shirt",
    price: "",
    image_url: "",
    tags: [] as string[],
    available_colors: [] as { name: string; hex: string }[],
  });

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }

    // Fetch profile
    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // 🔒 SUPPLIER / ADMIN ONLY
    if (!prof || !["SUPPLIER", "ADMIN"].includes(prof.role)) {
      window.location.href = "/";
      return;
    }

    setProfile(prof);
    await Promise.all([fetchProducts(user.id), fetchOrders(user.id)]);
    setLoading(false);
  };

  const fetchProducts = async (uid: string) => {
    const { data } = await supabase
      .from("supplier_products")
      .select("*")
      .eq("supplier_id", uid)
      .order("created_at", { ascending: false });
    setProducts(data || []);
  };

  const fetchOrders = async (uid: string) => {
    const { data, error } = await supabase
      .from("custom_orders")
      .select("*")
      .eq("supplier_id", uid)
      .eq("status", "ASSIGNED_TO_SUPPLIER")
      .order("created_at", { ascending: false });

    if (error) { console.error("Fetch orders error:", error); setOrders([]); return; }

    // Enrich with customer profile separately (avoids FK join issues)
    const rows = data || [];
    const customerIds = [...new Set(rows.map((o: any) => o.customer_id).filter(Boolean))];
    if (customerIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles").select("id, full_name, email").in("id", customerIds);
      const map = Object.fromEntries((profiles || []).map((p: any) => [p.id, p]));
      setOrders(rows.map((o: any) => ({ ...o, customer: map[o.customer_id] || null })));
    } else {
      setOrders(rows);
    }
  };

  const handleColorToggle = (color: { name: string; hex: string }) => {
    setForm(f => {
      const exists = f.available_colors.find(c => c.hex === color.hex);
      return {
        ...f,
        available_colors: exists
          ? f.available_colors.filter(c => c.hex !== color.hex)
          : [...f.available_colors, color]
      };
    });
  };

  const handleTagToggle = (tag: string) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag]
    }));
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setFormLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("supplier_products")
      .insert({
        supplier_id: user.id,
        name: form.name,
        description: form.description,
        product_type: form.product_type,
        price: parseFloat(form.price) || 0,
        image_url: form.image_url,
        tags: form.tags,
        available_colors: form.available_colors,
        status: "PENDING",
      });

    if (error) {
      alert("Error submitting product: " + error.message);
    } else {
      setShowForm(false);
      setForm({ name: "", description: "", product_type: "T-Shirt", price: "", image_url: "", tags: [], available_colors: [] });
      fetchProducts(user.id);
    }
    setFormLoading(false);
  };

  const handleFulfill = async (orderId: string) => {
    const proofUrl = prompt("Enter the URL of a photo showing the completed product:");
    if (!proofUrl) return;
    const { error } = await supabase
      .from("custom_orders")
      .update({ status: "COMPLETED_BY_SUPPLIER", supplier_proof_image_url: proofUrl })
      .eq("id", orderId);
    if (error) alert("Error: " + error.message);
    else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) fetchOrders(user.id);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const stats = [
    { label: "Total Products", value: products.length, icon: Box, color: "bg-blue-500" },
    { label: "Approved", value: products.filter(p => p.status === "APPROVED").length, icon: CheckCircle, color: "bg-green-500" },
    { label: "Pending", value: products.filter(p => p.status === "PENDING").length, icon: Clock, color: "bg-yellow-500" },
    { label: "Assigned Orders", value: orders.length, icon: ShoppingBag, color: "bg-purple-500" },
  ];

  const STATUS_STYLE: Record<string, string> = {
    APPROVED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="animate-spin text-[#A1FF4D]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        </div>

        {/* User Info */}
        {profile && (
          <div className="p-4 mx-4 my-4 bg-[#A1FF4D]/10 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[#1B2412] font-black text-sm">
                {profile.full_name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div>
                <p className="text-[13px] font-black text-[#1B2412] leading-none">{profile.full_name || 'Supplier'}</p>
                <p className="text-[10px] font-bold text-gray-500 mt-0.5 tracking-widest uppercase">Supplier</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1">
          <span className="flex items-center gap-3 px-4 py-3 bg-[#A1FF4D]/10 text-[#2B3220] rounded-xl font-bold">
            <BarChart3 size={18} /> Dashboard
          </span>
          <div className="pt-2">
            <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Products</p>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl w-full transition-all text-sm font-bold">
              <Plus size={16} /> Add New Product
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-all font-bold text-sm">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2B3220] uppercase tracking-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
              Supplier Dashboard
            </h1>
            <p className="text-gray-500 font-medium text-sm">Manage your products and fulfill orders.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#A1FF4D] text-[#1B2412] px-6 py-3 rounded-xl font-black shadow-lg hover:shadow-[#A1FF4D]/40 transition-all hover:scale-105 text-sm"
          >
            <Plus size={18} /> ADD NEW PRODUCT
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-xl text-white flex-shrink-0`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-[#2B3220]">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Products */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-black text-[#2B3220] uppercase tracking-tight">My Products</h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{products.length} total</span>
          </div>

          {products.length === 0 ? (
            <div className="p-16 text-center">
              <Box size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-sm font-bold text-gray-400">No products yet. Add your first product!</p>
              <button onClick={() => setShowForm(true)} className="mt-4 bg-[#2B3220] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all">
                Add Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Colors</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            {p.image_url
                              ? <img src={p.image_url} className="w-full h-full object-cover" alt={p.name} />
                              : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={18} /></div>
                            }
                          </div>
                          <div>
                            <p className="font-black text-[#2B3220] text-sm">{p.name}</p>
                            <p className="text-xs text-gray-400 font-medium line-clamp-1 max-w-[180px]">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black text-gray-700 bg-gray-100 px-2 py-1 rounded-lg">{p.product_type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-[#2B3220]">${p.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {(p.available_colors || []).slice(0, 6).map((c: any) => (
                            <div key={c.hex} title={c.name} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c.hex }} />
                          ))}
                          {(p.available_colors || []).length > 6 && (
                            <span className="text-[10px] font-bold text-gray-500">+{(p.available_colors || []).length - 6}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_STYLE[p.status] || 'bg-gray-100 text-gray-600'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Assigned Orders */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#1B2412] text-white p-2 rounded-xl">
              <ShoppingBag size={18} />
            </div>
            <h2 className="text-xl font-black text-[#2B3220] uppercase tracking-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
              Pending Custom Fulfillments
            </h2>
            {orders.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{orders.length}</span>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-white/50">
              <Clock size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No assigned orders at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="border-none shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden bg-white group">
                  <CardContent className="p-0 flex h-44">
                    <div className="w-1/3 bg-gray-50 flex items-center justify-center border-r border-gray-100 overflow-hidden">
                      {order.mockup_image_url
                        ? <img src={order.mockup_image_url} alt="Design" className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                        : <Box size={36} className="text-gray-200" />
                      }
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-black text-[#2B3220] text-sm uppercase">{order.product_type}</p>
                          <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">NEW</span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-bold mb-2">{order.variants?.color || 'Default'} • {order.variants?.view || 'Front'}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                            <User size={10} className="text-gray-400" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-600">{order.customer?.full_name || order.customer?.email || 'Customer'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFulfill(order.id)}
                        className="w-full bg-[#1B2412] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-black transition-all active:scale-95"
                      >
                        Mark as Fulfilled
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl my-4">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-[2.5rem] z-10">
              <div>
                <h2 className="text-2xl font-black text-[#2B3220] uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
                  Add New Product
                </h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Fill in all details for your product listing</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-900 transition-colors p-2">
                <XCircle size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-8 space-y-6">
              {/* Product Name */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2">
                  <Package size={12} className="inline mr-1" /> Product Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Premium Black Mug"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm font-bold transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your product — materials, print quality, special features..."
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm resize-none transition-all"
                />
              </div>

              {/* Type & Price row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2">
                    Product Type *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={form.product_type}
                      onChange={e => setForm(f => ({ ...f, product_type: e.target.value }))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm font-bold appearance-none cursor-pointer transition-all"
                    >
                      {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2">
                    Price (USD) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="24.99"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm font-bold transition-all"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2">
                  <Upload size={12} className="inline mr-1" /> Product Showcase Image URL *
                </label>
                <input
                  required
                  type="url"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://... (paste a direct image link)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm transition-all"
                />
                {form.image_url && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.image_url} className="w-full h-full object-cover" alt="Preview" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              {/* Available Colors */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-3">
                  <Palette size={12} className="inline mr-1" /> Available Colors * (select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(color => {
                    const selected = form.available_colors.some(c => c.hex === color.hex);
                    return (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => handleColorToggle(color)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-[11px] font-bold transition-all ${selected ? 'border-[#A1FF4C] bg-[#A1FF4C]/10 text-[#1B2412]' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                          }`}
                      >
                        <div className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: color.hex }} />
                        {color.name}
                      </button>
                    );
                  })}
                </div>
                {form.available_colors.length === 0 && (
                  <p className="text-[10px] text-red-400 font-bold mt-2 uppercase tracking-widest">Please select at least one color</p>
                )}
              </div>

              {/* Product Tags */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-3">
                  <Tag size={12} className="inline mr-1" /> Tags (optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Bestseller", "Trending", "New", "Premium", "Eco-Friendly", "Limited"].map(tag => {
                    const selected = form.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${selected ? 'bg-[#2B3220] text-white border-[#2B3220]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                          }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || form.available_colors.length === 0}
                  className="flex-1 bg-[#A1FF4D] text-[#1B2412] py-4 rounded-xl font-black shadow-lg hover:shadow-[#A1FF4D]/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {formLoading ? "Submitting..." : "Submit for Approval"}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">
                ⚠️ Admin must approve your product before it appears in the catalog
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
