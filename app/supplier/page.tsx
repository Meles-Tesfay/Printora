"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag, Plus, LogOut, CheckCircle, Clock, XCircle,
  BarChart3, Box, Image as ImageIcon, User, Palette, Tag,
  Package, Upload, Loader2, ChevronDown, UploadCloud, X, Trash2
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
    long_description: "",
    product_type: "T-Shirt",
    price: "",
    bulk_pricing: "",
    image_url: "",
    hover_image_url: "",
    detail_images: "",
    turnaround_time: "2-4 Business Days",
    quality: "Premium",
    tags: [] as string[],
    available_colors: [] as { name: string; hex: string }[],
    available_sizes: [] as string[],
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
      .select("*, supplier_product:supplier_products(price)")
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

  const handleSizeToggle = (size: string) => {
    setForm(f => ({
      ...f,
      available_sizes: f.available_sizes.includes(size) ? f.available_sizes.filter(s => s !== size) : [...f.available_sizes, size]
    }));
  };

  const handleFileUpload = async (file: File, field: 'image_url' | 'hover_image_url' | 'detail_images') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${Date.now()}_${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('user_assets')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      alert('Error uploading image. Please try again.');
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('user_assets')
      .getPublicUrl(filePath);

    if (field === 'detail_images') {
      setForm(f => {
        const current = f.detail_images ? f.detail_images.split(',').map(s => s.trim()).filter(Boolean) : [];
        return { ...f, detail_images: [...current, publicUrl].join(', ') };
      });
    } else {
      setForm(f => ({ ...f, [field]: publicUrl }));
    }
    
    return publicUrl;
  };

  const removeImage = (field: 'image_url' | 'hover_image_url' | 'detail_images', urlToRemove?: string) => {
    if (field === 'detail_images' && urlToRemove) {
      setForm(f => ({
        ...f,
        detail_images: f.detail_images.split(',')
          .map(s => s.trim())
          .filter(s => s !== urlToRemove)
          .join(', ')
      }));
    } else {
      setForm(f => ({ ...f, [field]: "" }));
    }
  };

  const FileDropzone = ({ label, field, value, multiple = false }: any) => {
    const [dragging, setDragging] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    const onDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        setLocalLoading(true);
        for (const file of files) {
          await handleFileUpload(file, field);
          if (!multiple) break;
        }
        setLocalLoading(false);
      }
    };

    const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        setLocalLoading(true);
        for (const file of files) {
          await handleFileUpload(file, field);
          if (!multiple) break;
        }
        setLocalLoading(false);
      }
    };

    const images = multiple 
      ? (value ? value.split(',').map((s: string) => s.trim()).filter(Boolean) : [])
      : (value ? [value] : []);

    return (
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest block">{label}</label>
        
        <div 
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer ${
            dragging ? 'border-[#A1FF4D] bg-[#A1FF4D]/5' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
          onClick={() => document.getElementById(`file-input-${field}`)?.click()}
        >
          <input 
            id={`file-input-${field}`}
            type="file" 
            multiple={multiple} 
            accept="image/*" 
            className="hidden" 
            onChange={onFileSelect}
          />
          
          {localLoading ? (
            <Loader2 className="animate-spin text-gray-400" size={24} />
          ) : (
            <UploadCloud className={`transition-transform group-hover:-translate-y-1 ${dragging ? 'text-[#A1FF4D]' : 'text-gray-400'}`} size={28} />
          )}
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {localLoading ? "Uploading..." : dragging ? "Drop files here" : "Click or drag images"}
          </p>
        </div>

        {/* Previews */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((img: string, i: number) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-white group">
                <img src={img} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(field, img); }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleEditProduct = (p: any) => {
    if (p.status === "APPROVED") {
      alert("⚠️ This product is already APPROVED and Live. \n\nTo ensure consistency for active customer orders, approved products cannot be edited directly. \n\nIf you need to update information or images, please contact the admin team.");
      return;
    }
    setEditingProductId(p.id);
    setForm({
      name: p.name,
      description: p.description || "",
      long_description: p.long_description || "",
      product_type: p.product_type,
      price: p.price?.toString() || "",
      bulk_pricing: p.bulk_pricing || "",
      image_url: p.image_url || "",
      hover_image_url: p.hover_image_url || "",
      detail_images: (p.detail_images || []).join(', '),
      turnaround_time: p.turnaround_time || "2-4 Business Days",
      quality: p.quality || "Premium",
      tags: p.tags || [],
      available_colors: p.available_colors || [],
      available_sizes: p.available_sizes || [],
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
      long_description: form.long_description,
      product_type: form.product_type,
      price: parseFloat(form.price) || 0,
      bulk_pricing: form.bulk_pricing,
      image_url: form.image_url,
      hover_image_url: form.hover_image_url,
      detail_images: form.detail_images ? form.detail_images.split(',').map(s => s.trim()).filter(Boolean) : [],
      turnaround_time: form.turnaround_time,
      quality: form.quality,
      tags: form.tags,
      available_colors: form.available_colors,
      available_sizes: form.available_sizes,
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
      setForm({ name: "", description: "", long_description: "", product_type: "T-Shirt", price: "", bulk_pricing: "", image_url: "", hover_image_url: "", detail_images: "", turnaround_time: "2-4 Business Days", quality: "Premium", tags: [], available_colors: [], available_sizes: [] });
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
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto cursor-pointer hover:opacity-80 transition-opacity" />
          </Link>
        </div>

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

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2B3220] uppercase tracking-normal" style={{ fontFamily: 'Impact, sans-serif', wordSpacing: '0.15em' }}>
              Supplier Dashboard
            </h1>
            <p className="text-gray-500 font-medium text-sm">Manage your products and fulfill orders.</p>
          </div>
        </div>

        {activeTab === "my-products" && (
          <>
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

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#1B2412] text-white p-2 rounded-xl"><Package size={18} /></div>
              <h2 className="text-xl font-black text-[#2B3220] uppercase tracking-normal" style={{ fontFamily: 'Impact, sans-serif', wordSpacing: '0.15em' }}>
                Your Product Catalog
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="p-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem] bg-white">
                <Box size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No products listed yet</p>
                <button onClick={() => setActiveTab("add-product")} className="mt-6 bg-[#A1FF4D] text-[#1B2412] px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95">
                  Create First Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="border-none shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden bg-white group">
                    <div className="relative aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button onClick={() => handleEditProduct(product)} className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-600 hover:bg-[#1B2412] hover:text-[#A1FF4D] transition-all">
                          <Plus size={16} className="rotate-45" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          product.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 
                          product.status === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{product.product_type}</p>
                      <h3 className="font-black text-[#1B2412] text-lg leading-tight mb-2">{product.name}</h3>
                      <div className="flex items-end justify-between mt-4">
                        <div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Base Price</p>
                          <p className="text-xl font-black text-[#2B3220]">{product.price} <span className="text-[10px]">ETB</span></p>
                        </div>
                        <div className="flex -space-x-2">
                          {product.available_colors?.slice(0, 3).map((c: any, i: number) => (
                            <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c.hex }} />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "add-product" && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 max-w-4xl">
            <h2 className="text-2xl font-black text-[#2B3220] uppercase mb-8" style={{ fontFamily: 'Impact, sans-serif' }}>
              {editingProductId ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmitProduct} className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-[#2B3220] uppercase block mb-2">Product Name *</label>
                <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none text-sm font-bold transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                <textarea value={form.long_description} onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))} placeholder="Long description..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <select value={form.product_type} onChange={e => setForm(f => ({ ...f, product_type: e.target.value }))} className="bg-gray-50 border rounded-xl p-3 text-sm font-bold">
                  {PRODUCT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Price" className="bg-gray-50 border rounded-xl p-3 text-sm font-bold" />
                <input type="text" value={form.bulk_pricing} onChange={e => setForm(f => ({ ...f, bulk_pricing: e.target.value }))} placeholder="Bulk pricing" className="bg-gray-50 border rounded-xl p-3 text-sm font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FileDropzone label="Primary Image *" field="image_url" value={form.image_url} />
                <FileDropzone label="Hover Image" field="hover_image_url" value={form.hover_image_url} />
              </div>
              <button type="submit" disabled={formLoading} className="w-full bg-[#A1FF4D] text-[#1B2412] py-4 rounded-xl font-black">
                {formLoading ? "Submitting..." : "Submit Product"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-black text-[#2B3220] uppercase mb-6" style={{ fontFamily: 'Impact, sans-serif' }}>Pending Fulfillments</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {orders.filter(o => ["ASSIGNED_TO_SUPPLIER", "SAMPLE_REJECTED"].includes(o.status)).map(order => (
                <Card key={order.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white flex h-44">
                  <div className="w-1/3 bg-gray-50 flex items-center justify-center border-r border-gray-100">
                    <img src={order.mockup_image_url} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <p className="font-black text-[#2B3220] text-sm uppercase">{order.product_type}</p>
                      <p className="text-[11px] text-gray-400 font-bold">{order.variants?.color} • {order.variants?.size}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(order)} className="w-full bg-[#1B2412] text-white py-2 rounded-xl text-xs font-bold uppercase">View & Fulfill</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "pending-approvals" && (
          <div>
            <h2 className="text-xl font-black text-[#2B3220] uppercase mb-6" style={{ fontFamily: 'Impact, sans-serif' }}>Pending Approvals</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {orders.filter(o => ["SAMPLE_AWAITING_APPROVAL", "PRODUCTION_APPROVED_AND_PAID"].includes(o.status)).map(order => (
                <Card key={order.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white flex h-44 opacity-80">
                  <div className="w-1/3 bg-gray-50 flex items-center justify-center border-r border-gray-100">
                    <img src={order.mockup_image_url} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <p className="font-black text-[#2B3220] text-sm uppercase">{order.product_type}</p>
                      <span className="bg-yellow-50 text-yellow-600 text-[9px] font-black px-2 py-0.5 rounded-full">{order.status}</span>
                    </div>
                    <button onClick={() => setSelectedOrder(order)} className="w-full bg-[#1B2412] text-white py-2 rounded-xl text-xs font-bold uppercase">View Status</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "completed" && (
          <div>
            <h2 className="text-xl font-black text-[#2B3220] uppercase mb-6" style={{ fontFamily: 'Impact, sans-serif' }}>Completed</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {orders.filter(o => o.status === "COMPLETED_BY_SUPPLIER").map(order => (
                <Card key={order.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white flex h-44 opacity-60">
                   <div className="w-1/3 bg-gray-50 flex items-center justify-center border-r border-gray-100">
                    <img src={order.mockup_image_url} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <p className="font-black text-[#2B3220] text-sm uppercase">{order.product_type}</p>
                    <div className="w-full bg-green-50 text-green-600 py-2 rounded-xl font-black text-xs text-center">DELIVERED</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ===== ORDER DETAIL + DESIGN EXTRACTION MODAL ===== */}
      {selectedOrder && (() => {
        const views: any[] = selectedOrder.design_views || [];
        const hasViews = views.length > 0;
        const activeViewData = hasViews ? views[Math.min(activeViewIdx, views.length - 1)] : null;
        const activeDesign  = activeViewData?.design || selectedOrder.design_data;
        const activeMockup  = activeViewData?.mockup_url || selectedOrder.mockup_image_url;
        const layers = extractLayers(activeDesign);

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-6xl rounded-[2rem] shadow-2xl my-4 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between bg-[#1B2412]">
                <div>
                  <h2 className="text-lg font-black text-[#A1FF4D] uppercase tracking-tight">Print Order Details</h2>
                  <p className="text-[11px] text-gray-400 font-bold mt-0.5">{selectedOrder.product_type} · {selectedOrder.variants?.color} · {selectedOrder.variants?.view}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => downloadPrintFile(selectedOrder)}
                    title="Download high-res print file (PNG)"
                    className="flex items-center gap-1.5 bg-[#A1FF4D] text-[#1B2412] px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Upload size={13} />
                    Download Print File
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white transition-colors">
                    <XCircle size={26} />
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto max-h-[85vh]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  
                  {/* Left Column: Design & Layers (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* View tabs */}
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

                    {/* Large Mockup Preview */}
                    {activeMockup && (
                      <div className="relative w-full aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 group shadow-inner">
                        <img src={activeMockup} alt="Mockup" className="w-full h-full object-contain p-4" />
                        <button
                          onClick={() => downloadFile(activeMockup, `mockup-${activeViewData?.viewName || 'front'}-${selectedOrder.id.slice(0,8)}.jpg`)}
                          title="Download mockup image"
                          className="absolute bottom-6 right-6 flex items-center gap-1.5 bg-[#1B2412]/90 hover:bg-[#1B2412] text-white text-[11px] font-black px-4 py-2 rounded-xl backdrop-blur-sm transition-all active:scale-95 opacity-0 group-hover:opacity-100 shadow-xl"
                        >
                          <ImageIcon size={12} />
                          Download Mockup
                        </button>
                      </div>
                    )}

                    {/* Design layers list */}
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Component Breakdown — {activeViewData?.viewName || 'Front'} ({layers.length})
                      </p>
                      {layers.length === 0 ? (
                        <p className="text-xs text-gray-400 italic bg-gray-50 p-4 rounded-xl">No specific design layers found in this view.</p>
                      ) : (
                        <div className="grid grid-cols-1 gap-3">
                          {layers.map((layer: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100 transition-colors group/layer">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-black shadow-sm ${
                                layer.kind === 'text'  ? 'bg-blue-500'   :
                                layer.kind === 'image' ? 'bg-purple-500' : 'bg-orange-400'
                              }`}>
                                {layer.kind === 'text' ? 'T' : layer.kind === 'image' ? '🖼' : '◼'}
                              </div>
                              <div className="flex-1 min-w-0">
                                {layer.kind === 'text' && (
                                  <>
                                    <p className="text-[13px] font-black text-gray-800 truncate">&ldquo;{layer.text}&rdquo;</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                      {layer.font} · {layer.size}px
                                      {layer.bold ? ' · Bold' : ''}
                                    </p>
                                  </>
                                )}
                                {layer.kind === 'image' && (
                                  <>
                                    <p className="text-[13px] font-black text-gray-800">Uploaded Asset</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{layer.w} × {layer.h}px</p>
                                  </>
                                )}
                                {layer.kind === 'shape' && (
                                  <>
                                    <p className="text-[13px] font-black text-gray-800 capitalize">{layer.type} Shape</p>
                                    <p className="text-[10px] text-gray-400 font-bold">{layer.w} × {layer.h}px</p>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {layer.color && (
                                  <div title={layer.color} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: layer.color }} />
                                )}
                                <button
                                  onClick={() => downloadLayer(layer, activeDesign, i)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all opacity-0 group-hover/layer:opacity-100"
                                >
                                  <Upload size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Order Details & Fulfillment (5 cols) */}
                  <div className="lg:col-span-5 space-y-8">
                    
                    {/* Primary Order Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#1B2412] rounded-[2rem] p-6 text-[#A1FF4D]">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Quantity</p>
                        <p className="text-3xl font-black">{selectedOrder.variants?.quantity || 1}</p>
                        <p className="text-[10px] font-bold mt-1 opacity-80">Total Items</p>
                      </div>
                      <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Size</p>
                        <p className="text-3xl font-black text-[#1B2412]">{selectedOrder.variants?.size || 'M'}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1">International</p>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-gray-50 rounded-[2.5rem] p-7 border border-gray-100 space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Financial Summary</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500">Unit Price</span>
                          <span className="text-sm font-black text-gray-800">{(selectedOrder.supplier_product?.price || 600).toLocaleString()} ብር</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500">Total Value</span>
                          <span className="text-sm font-black text-gray-800">{((selectedOrder.supplier_product?.price || 600) * (selectedOrder.variants?.quantity || 1)).toLocaleString()} ብር</span>
                        </div>
                        <div className="h-px bg-gray-200 my-1" />
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-xs font-black text-emerald-600 uppercase">Your Payout (100%)</span>
                          <span className="text-xl font-black text-emerald-600">
                            {((selectedOrder.supplier_product?.price || 600) * (selectedOrder.variants?.quantity || 1)).toLocaleString()} ብር
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Shipping */}
                    <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Customer Contact</p>
                       <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#A1FF4D] flex items-center justify-center text-[#1B2412] font-black text-lg shadow-sm">
                          {(selectedOrder.customer?.full_name || selectedOrder.customer?.email || 'C')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-gray-900 truncate">{selectedOrder.customer?.full_name || 'Anonymous'}</p>
                          <p className="text-[11px] text-gray-400 font-bold truncate">{selectedOrder.customer?.email}</p>
                        </div>
                       </div>
                    </div>

                    {/* Fulfillment Section */}
                    <div className="bg-white rounded-[2.5rem] border-2 border-gray-100 p-6 space-y-5 shadow-xl shadow-gray-100/50">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submit Progress</p>
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-wider">Required</span>
                      </div>

                      {/* Drop Zone */}
                      <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all p-6 ${
                        proofPreview ? 'border-[#A1FF4D] bg-[#A1FF4D]/5 shadow-inner' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}>
                        {proofPreview ? (
                          <div className="relative w-full group">
                            <img src={proofPreview} alt="Proof preview" className="w-full max-h-52 object-contain rounded-2xl" />
                            <button
                              type="button"
                              onClick={e => { e.preventDefault(); setProofUrl(''); setProofPreview(''); }}
                              className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-black transition-colors backdrop-blur-sm"
                            >✕</button>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <UploadCloud className="text-gray-400" size={24} />
                            </div>
                            <div className="text-center">
                              <p className="text-[13px] font-black text-gray-800">Upload Final Proof</p>
                              <p className="text-[10px] text-gray-400 font-bold mt-1">Drag and drop or click to browse</p>
                            </div>
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
                              setProofUrl(base64);
                              setProofPreview(base64);
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>

                      {/* Actions */}
                      {selectedOrder.status === 'SAMPLE_AWAITING_APPROVAL' ? (
                        <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 p-5 rounded-[2rem] text-xs font-black text-center leading-relaxed">
                          ⚠️ Sample Proof Submitted.<br/>Waiting for customer approval before continuing.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={handleFulfill}
                            disabled={fulfillLoading || !proofUrl.trim()}
                            className="w-full bg-[#A1FF4D] text-[#1B2412] py-4 rounded-[2rem] font-black shadow-lg shadow-[#A1FF4D]/30 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                          >
                            {fulfillLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                            {fulfillLoading ? 'Processing...' : ((selectedOrder.variants?.quantity || 1) > 1 && ["ASSIGNED_TO_SUPPLIER", "SAMPLE_REJECTED"].includes(selectedOrder.status)) ? 'Submit Sample Proof' : 'Confirm Completion'}
                          </button>
                          <button onClick={() => setSelectedOrder(null)} className="w-full py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">
                            Close Preview
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
