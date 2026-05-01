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
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeViewIdx, setActiveViewIdx] = useState(0);
  const [proofUrl, setProofUrl] = useState('');
  const [proofPreview, setProofPreview] = useState('');
  const [fulfillLoading, setFulfillLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("my-products");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

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

  const handleEditProduct = (p: any) => {
    setEditingProductId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      product_type: p.product_type,
      price: p.price?.toString() || "",
      image_url: p.image_url,
      tags: p.tags || [],
      available_colors: p.available_colors || [],
    });
    setActiveTab("add-product");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const { error } = await supabase.from("supplier_products").delete().eq("id", id);
    if (error) alert("Error deleting product: " + error.message);
    else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) fetchProducts(user.id);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setFormLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      supplier_id: user.id,
      name: form.name,
      description: form.description,
      product_type: form.product_type,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url,
      tags: form.tags,
      available_colors: form.available_colors,
      status: "PENDING",
    };

    let error;
    if (editingProductId) {
      const res = await supabase.from("supplier_products").update(payload).eq("id", editingProductId);
      error = res.error;
    } else {
      const res = await supabase.from("supplier_products").insert(payload);
      error = res.error;
    }

    if (error) {
      alert("Error submitting product: " + error.message);
    } else {
      setEditingProductId(null);
      setActiveTab('my-products');
      setForm({ name: "", description: "", product_type: "T-Shirt", price: "", image_url: "", tags: [], available_colors: [] });
      fetchProducts(user.id);
    }
    setFormLoading(false);
  };

  const handleFulfill = async () => {
    if (!selectedOrder || !proofUrl.trim()) return;
    setFulfillLoading(true);

    const qty = selectedOrder.variants?.quantity || 1;
    let nextStatus = "COMPLETED_BY_SUPPLIER";

    if (qty > 1 && ["ASSIGNED_TO_SUPPLIER", "SAMPLE_REJECTED"].includes(selectedOrder.status)) {
      nextStatus = "SAMPLE_AWAITING_APPROVAL";
    }

    const { error } = await supabase
      .from("custom_orders")
      .update({ status: nextStatus, supplier_proof_image_url: proofUrl.trim() })
      .eq("id", selectedOrder.id);
    setFulfillLoading(false);
    if (error) alert("Error: " + error.message);
    else {
      setSelectedOrder(null);
      setProofUrl('');
      setProofPreview('');
      const { data: { user } } = await supabase.auth.getUser();
      if (user) fetchOrders(user.id);
    }
  };

  // Extract design layers from Fabric.js design_data JSON (like Printify)
  const extractLayers = (designData: any) => {
    if (!designData?.objects) return [];
    return designData.objects.map((obj: any, i: number) => {
      if (obj.type === 'i-text' || obj.type === 'text' || obj.type === 'textbox') {
        return { kind: 'text', index: i, text: obj.text, font: obj.fontFamily || 'sans-serif', size: Math.round(obj.fontSize || 16), color: obj.fill || '#000', bold: obj.fontWeight === 'bold', italic: obj.fontStyle === 'italic' };
      }
      if (obj.type === 'image') {
        return { kind: 'image', index: i, src: obj.src, w: Math.round(obj.width * (obj.scaleX||1)), h: Math.round(obj.height * (obj.scaleY||1)) };
      }
      return { kind: 'shape', index: i, type: obj.type, color: obj.fill || obj.stroke || '#000', w: Math.round((obj.width||0) * (obj.scaleX||1)), h: Math.round((obj.height||0) * (obj.scaleY||1)) };
    });
  };

  // Trigger a browser download from a data URL
  const downloadFile = (dataUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download the embedded high-res print file
  const downloadPrintFile = (order: any) => {
    // Prefer the active view's print_file if design_views exists
    const views: any[] = order.design_views || [];
    const activeView = views[activeViewIdx];
    const pf = activeView?.print_file || order.design_data?._printFile;
    if (pf) {
      const suffix = activeView ? `-${activeView.viewName.replace(/\s+/g, '-').toLowerCase()}` : '';
      downloadFile(pf, `print-file${suffix}-${order.id.slice(0, 8)}.png`);
    } else {
      alert('No print file found for this order. Ask the customer to re-save.');
    }
  };

  // Download an individual layer as a PNG
  const downloadLayer = (layer: any, orderDesignData: any, index: number) => {
    if (layer.kind === 'image') {
      // The image src is the raw base64 data URL from Fabric
      const src = orderDesignData?.objects?.[layer.index]?.src || layer.src;
      if (src) downloadFile(src, `image-layer-${index + 1}.png`);
      else alert('Image source not found.');
      return;
    }

    // For text and shapes: render to a high-DPI canvas
    const SCALE = 4; // 4x = ~300 DPI equivalent
    const offscreen = document.createElement('canvas');
    const ctx = offscreen.getContext('2d')!;

    if (layer.kind === 'text') {
      const weight  = layer.bold   ? 'bold '   : '';
      const style   = layer.italic ? 'italic ' : '';
      const fs      = (layer.size || 16) * SCALE;
      ctx.font = `${style}${weight}${fs}px ${layer.font}`;
      const metrics = ctx.measureText(layer.text);
      const tw = Math.ceil(metrics.width) + 20 * SCALE;
      const th = Math.ceil(fs * 1.6) + 10 * SCALE;
      offscreen.width  = tw;
      offscreen.height = th;
      ctx.clearRect(0, 0, tw, th);
      ctx.font = `${style}${weight}${fs}px ${layer.font}`;
      ctx.fillStyle = layer.color || '#000000';
      ctx.fillText(layer.text, 10 * SCALE, fs + 5 * SCALE);
    } else {
      // Shape: just export a colour swatch at correct proportions
      const W = Math.max(layer.w * SCALE, 10);
      const H = Math.max(layer.h * SCALE, 10);
      offscreen.width  = W;
      offscreen.height = H;
      ctx.fillStyle = layer.color || '#000000';
      ctx.fillRect(0, 0, W, H);
    }

    downloadFile(offscreen.toDataURL('image/png'), `${layer.kind}-layer-${index + 1}.png`);
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
          <button 
            onClick={() => setActiveTab("my-products")}
            className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold transition-all ${activeTab === "my-products" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <BarChart3 size={18} /> My Products
          </button>
          
          <div className="pt-2">
            <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Products</p>
            <button 
              onClick={() => setActiveTab("add-product")}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold transition-all ${activeTab === "add-product" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          <div className="pt-2">
            <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Orders</p>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold transition-all ${activeTab === "orders" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <ShoppingBag size={16} /> Fulfillments
            </button>
            <button 
              onClick={() => setActiveTab("pending-approvals")}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold transition-all ${activeTab === "pending-approvals" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <Clock size={16} /> Pending Approvals
            </button>
            <button 
              onClick={() => setActiveTab("completed")}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold transition-all ${activeTab === "completed" ? "bg-[#A1FF4D]/10 text-[#2B3220]" : "text-gray-400 hover:bg-gray-50"}`}
            >
              <CheckCircle size={16} /> Completed
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
        </div>

        {/* === MY PRODUCTS TAB === */}
        {activeTab === "my-products" && (
          <>
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
              <button onClick={() => setActiveTab("add-product")} className="mt-4 bg-[#2B3220] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all">
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

        {/* End of My Products Tab */}
        {activeTab === "my-products" && <></>}
        </>
        )}

        {/* === ADD PRODUCT TAB === */}
        {activeTab === "add-product" && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 max-w-4xl">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#2B3220] uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
                Add New Product
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Fill in all details for your product listing</p>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2">
                  <Package size={12} className="inline mr-1" /> Product Name *
                </label>
                <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Premium Black Mug" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm font-bold transition-all" />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your product..." rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm resize-none transition-all" />
              </div>

              {/* Type & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2">Product Type *</label>
                  <div className="relative">
                    <select required value={form.product_type} onChange={e => setForm(f => ({ ...f, product_type: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm font-bold appearance-none cursor-pointer transition-all">
                      {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2">Price (USD) *</label>
                  <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="24.99" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm font-bold transition-all" />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-2"><Upload size={12} className="inline mr-1" /> Product Showcase Image URL *</label>
                <input required type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm transition-all" />
                {form.image_url && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img src={form.image_url} className="w-full h-full object-cover" alt="Preview" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              {/* Available Colors */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-3"><Palette size={12} className="inline mr-1" /> Available Colors * (select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(color => {
                    const selected = form.available_colors.some(c => c.hex === color.hex);
                    return (
                      <button key={color.hex} type="button" onClick={() => handleColorToggle(color)} className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-[11px] font-bold transition-all ${selected ? 'border-[#A1FF4C] bg-[#A1FF4C]/10 text-[#1B2412]' : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'}`}>
                        <div className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: color.hex }} />
                        {color.name}
                      </button>
                    );
                  })}
                </div>
                {form.available_colors.length === 0 && <p className="text-[10px] text-red-400 font-bold mt-2 uppercase tracking-widest">Please select at least one color</p>}
              </div>

              {/* Product Tags */}
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase tracking-widest block mb-3"><Tag size={12} className="inline mr-1" /> Tags (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {["Bestseller", "Trending", "New", "Premium", "Eco-Friendly", "Limited"].map(tag => {
                    const selected = form.tags.includes(tag);
                    return (
                      <button key={tag} type="button" onClick={() => handleTagToggle(tag)} className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${selected ? 'bg-[#2B3220] text-white border-[#2B3220]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={formLoading || form.available_colors.length === 0} className="w-full bg-[#A1FF4D] text-[#1B2412] py-4 rounded-xl font-black shadow-lg hover:shadow-[#A1FF4D]/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                  {formLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                  {formLoading ? "Submitting..." : "Submit for Approval"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* === ORDERS TAB === */}
        {activeTab === "orders" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#1B2412] text-white p-2 rounded-xl"><ShoppingBag size={18} /></div>
              <h2 className="text-xl font-black text-[#2B3220] uppercase tracking-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                Pending Fulfillments
              </h2>
            </div>
            {(() => {
              const filtered = orders.filter(o => o.status === "ASSIGNED_TO_SUPPLIER" || o.status === "SAMPLE_REJECTED");
              return filtered.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-white/50">
                  <Clock size={40} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No assigned orders at the moment</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filtered.map((order) => (
                    <Card key={order.id} className="border-none shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden bg-white group">
                      <CardContent className="p-0 flex h-44">
                        <div className="w-1/3 bg-gray-50 flex items-center justify-center border-r border-gray-100 overflow-hidden">
                          {order.mockup_image_url ? <img src={order.mockup_image_url} alt="Design" className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" /> : <Box size={36} className="text-gray-200" />}
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-black text-[#2B3220] text-sm uppercase">{order.product_type}</p>
                              <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-0.5 rounded-full">{order.status.replace(/_/g, ' ')}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold mb-2">{order.variants?.color || 'Default'} • {order.variants?.view || 'Front'}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center"><User size={10} className="text-gray-400" /></div>
                              <span className="text-[10px] font-bold text-gray-600">{order.customer?.full_name || order.customer?.email || 'Customer'}</span>
                            </div>
                          </div>
                          <button onClick={() => { setSelectedOrder(order); setProofUrl(''); setProofPreview(''); setActiveViewIdx(0); }} className="w-full bg-[#1B2412] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-black transition-all active:scale-95">
                            View &amp; Fulfill
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* === PENDING APPROVALS TAB === */}
        {activeTab === "pending-approvals" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#1B2412] text-white p-2 rounded-xl"><Clock size={18} /></div>
              <h2 className="text-xl font-black text-[#2B3220] uppercase tracking-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                Pending Approvals
              </h2>
            </div>
            {(() => {
              const filtered = orders.filter(o => o.status === "SAMPLE_AWAITING_APPROVAL" || o.status === "PRODUCTION_APPROVED_AND_PAID");
              return filtered.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-white/50">
                  <Clock size={40} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No pending approvals at the moment</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filtered.map((order) => (
                    <Card key={order.id} className="border-none shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden bg-white group">
                      <CardContent className="p-0 flex h-44">
                        <div className="w-1/3 bg-gray-50 flex items-center justify-center border-r border-gray-100 overflow-hidden">
                          {order.mockup_image_url ? <img src={order.mockup_image_url} alt="Design" className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" /> : <Box size={36} className="text-gray-200" />}
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-black text-[#2B3220] text-sm uppercase">{order.product_type}</p>
                              <span className="bg-yellow-50 text-yellow-600 text-[9px] font-black px-2 py-0.5 rounded-full text-center leading-tight max-w-[100px]">{order.status.replace(/_/g, ' ')}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold mb-2">{order.variants?.color || 'Default'} • {order.variants?.view || 'Front'}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center"><User size={10} className="text-gray-400" /></div>
                              <span className="text-[10px] font-bold text-gray-600">{order.customer?.full_name || order.customer?.email || 'Customer'}</span>
                            </div>
                          </div>
                          <button onClick={() => { setSelectedOrder(order); setProofUrl(''); setProofPreview(''); setActiveViewIdx(0); }} className="w-full bg-[#1B2412] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-black transition-all active:scale-95">
                            {order.status === "PRODUCTION_APPROVED_AND_PAID" ? "Complete Order" : "View"}
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* === COMPLETED TAB === */}
        {activeTab === "completed" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#1B2412] text-white p-2 rounded-xl"><CheckCircle size={18} /></div>
              <h2 className="text-xl font-black text-[#2B3220] uppercase tracking-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
                Completed Productions
              </h2>
            </div>
            {(() => {
              const filtered = orders.filter(o => o.status === "COMPLETED_BY_SUPPLIER");
              return filtered.length === 0 ? (
                <div className="p-16 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-white/50">
                  <CheckCircle size={40} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No completed orders yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filtered.map((order) => (
                    <Card key={order.id} className="border-none shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden bg-white group opacity-70 hover:opacity-100">
                      <CardContent className="p-0 flex h-44">
                        <div className="w-1/3 bg-gray-50 flex items-center justify-center border-r border-gray-100 overflow-hidden">
                          {order.mockup_image_url ? <img src={order.mockup_image_url} alt="Design" className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" /> : <Box size={36} className="text-gray-200" />}
                        </div>
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <p className="font-black text-[#2B3220] text-sm uppercase">{order.product_type}</p>
                              <span className="bg-green-50 text-green-600 text-[9px] font-black px-2 py-0.5 rounded-full">{order.status.replace(/_/g, ' ')}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 font-bold mb-2">{order.variants?.color || 'Default'} • {order.variants?.view || 'Front'}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center"><User size={10} className="text-gray-400" /></div>
                              <span className="text-[10px] font-bold text-gray-600">{order.customer?.full_name || order.customer?.email || 'Customer'}</span>
                            </div>
                          </div>
                          <div className="w-full bg-green-500/10 text-green-600 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-center">
                            Delivered
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              );
            })()}
          </div>
        )}
      </main>

      {/* ===== ORDER DETAIL + DESIGN EXTRACTION MODAL ===== */}
      {selectedOrder && (() => {
        const views: any[] = selectedOrder.design_views || [];
        const hasViews = views.length > 0;
        // For the layer extractor: use the active view's design if available, else fall back to design_data
        const activeViewData = hasViews ? views[Math.min(activeViewIdx, views.length - 1)] : null;
        const activeDesign  = activeViewData?.design || selectedOrder.design_data;
        const activeMockup  = activeViewData?.mockup_url || selectedOrder.mockup_image_url;
        const layers = extractLayers(activeDesign);
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl my-4 overflow-hidden">
              {/* Header */}
              <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between bg-[#1B2412]">
                <div>
                  <h2 className="text-lg font-black text-[#A1FF4D] uppercase tracking-tight">Print Order</h2>
                  <p className="text-[11px] text-gray-400 font-bold mt-0.5">{selectedOrder.product_type} · {selectedOrder.variants?.color} · {selectedOrder.variants?.view}</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Download the full high-res design (3× PNG) */}
                  <button
                    onClick={() => downloadPrintFile(selectedOrder)}
                    title="Download high-res print file (PNG)"
                    className="flex items-center gap-1.5 bg-[#A1FF4D] text-[#1B2412] px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Print File
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white transition-colors">
                    <XCircle size={26} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                {/* View tabs (shown only when multiple views were designed) */}
                {hasViews && views.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {views.map((v: any, i: number) => (
                      <button
                        key={v.viewId}
                        onClick={() => setActiveViewIdx(i)}
                        className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                          activeViewIdx === i
                            ? 'bg-[#1B2412] text-[#A1FF4D]'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {v.viewName}
                      </button>
                    ))}
                  </div>
                )}

                {/* Mockup preview + download */}
                {activeMockup && (
                  <div className="relative w-full h-52 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group">
                    <img src={activeMockup} alt="Mockup" className="w-full h-full object-contain" />
                    <button
                      onClick={() => downloadFile(activeMockup, `mockup-${activeViewData?.viewName || 'front'}-${selectedOrder.id.slice(0,8)}.jpg`)}
                      title="Download mockup image"
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#1B2412]/80 hover:bg-[#1B2412] text-white text-[10px] font-black px-3 py-1.5 rounded-xl backdrop-blur-sm transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Download Mockup
                    </button>
                  </div>
                )}

                {/* Customer info */}
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[#1B2412] font-black text-sm flex-shrink-0">
                    {(selectedOrder.customer?.full_name || selectedOrder.customer?.email || 'C')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-gray-800">{selectedOrder.customer?.full_name || 'Customer'}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{selectedOrder.customer?.email}</p>
                  </div>
                </div>

                {/* Design layers for the active view */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Design Layers — {activeViewData?.viewName || 'Front'} ({layers.length})
                  </p>
                  {layers.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No design elements found.</p>
                  ) : (
                    <div className="space-y-2">
                      {layers.map((layer: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          {/* Icon */}
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-black ${
                            layer.kind === 'text'  ? 'bg-blue-500'   :
                            layer.kind === 'image' ? 'bg-purple-500' : 'bg-orange-400'
                          }`}>
                            {layer.kind === 'text' ? 'T' : layer.kind === 'image' ? '🖼' : '◼'}
                          </div>
                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            {layer.kind === 'text' && (
                              <>
                                <p className="text-sm font-black text-gray-800 truncate">&ldquo;{layer.text}&rdquo;</p>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                  {layer.font} · {layer.size}px
                                  {layer.bold ? ' · Bold' : ''}
                                  {layer.italic ? ' · Italic' : ''}
                                </p>
                              </>
                            )}
                            {layer.kind === 'image' && (
                              <>
                                <p className="text-sm font-black text-gray-800">Image</p>
                                <p className="text-[10px] text-gray-400 font-bold">{layer.w} × {layer.h}px</p>
                              </>
                            )}
                            {layer.kind === 'shape' && (
                              <>
                                <p className="text-sm font-black text-gray-800 capitalize">{layer.type}</p>
                                <p className="text-[10px] text-gray-400 font-bold">{layer.w} × {layer.h}px</p>
                              </>
                            )}
                          </div>
                          {/* Color swatch + Download button */}
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            {layer.color && (
                              <div title={layer.color} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: layer.color }} />
                            )}
                            <button
                              onClick={() => downloadLayer(layer, activeDesign, i)}
                              title="Download this layer as PNG"
                              className="flex items-center gap-1 text-[9px] font-black text-gray-500 hover:text-[#1B2412] bg-white border border-gray-200 hover:border-gray-400 px-2 py-1 rounded-lg transition-all active:scale-95"
                            >
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              PNG
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Proof upload */}
                <div className="pt-2 space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Proof Photo (after printing)</label>

                  {/* File upload drop zone */}
                  <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl cursor-pointer transition-all p-4 ${
                    proofPreview ? 'border-[#A1FF4D] bg-[#A1FF4D]/5' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}>
                    {proofPreview ? (
                      <div className="relative w-full">
                        <img src={proofPreview} alt="Proof preview" className="w-full max-h-40 object-contain rounded-xl" />
                        <button
                          type="button"
                          onClick={e => { e.preventDefault(); setProofUrl(''); setProofPreview(''); }}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black"
                        >✕</button>
                      </div>
                    ) : (
                      <>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span className="text-[11px] font-bold text-gray-400">Click to upload a photo</span>
                        <span className="text-[10px] text-gray-300">JPG, PNG or WEBP</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => {
                          const base64 = ev.target?.result as string;
                          setProofUrl(base64);      // base64 stored in DB
                          setProofPreview(base64);   // shown as preview
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>

                  {/* URL fallback */}
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-[10px] font-bold text-gray-300">or paste URL</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                  <input
                    type="url"
                    value={proofPreview ? '' : proofUrl}
                    onChange={e => { setProofUrl(e.target.value); setProofPreview(''); }}
                    placeholder="https://..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-[#A1FF4C] outline-none transition-all"
                  />
                </div>

                {/* Actions */}
                {selectedOrder.status === 'SAMPLE_AWAITING_APPROVAL' ? (
                  <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm font-bold text-center">
                    Sample uploaded. Waiting for customer approval.
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setSelectedOrder(null)} className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-all">
                      Cancel
                    </button>
                    <button
                      onClick={handleFulfill}
                      disabled={fulfillLoading || !proofUrl.trim()}
                      className="flex-1 bg-[#A1FF4D] text-[#1B2412] py-3.5 rounded-xl font-black shadow-lg hover:shadow-[#A1FF4D]/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {fulfillLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      {fulfillLoading ? 'Saving...' : ((selectedOrder.variants?.quantity || 1) > 1 && ["ASSIGNED_TO_SUPPLIER", "SAMPLE_REJECTED"].includes(selectedOrder.status)) ? 'Upload Sample Proof' : 'Upload Final Proof'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
