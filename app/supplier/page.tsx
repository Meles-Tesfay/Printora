"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag,
  Plus,
  Settings,
  User,
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Box,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Placeholder data - in a real app, this would come from Supabase
const initialProducts = [
  { id: 1, name: "Ceramic Mug", status: "APPROVED", price: 800, category: "Mugs", image: "/placeholder-mug.jpg" },
  { id: 2, name: "Custom T-Shirt", status: "PENDING", price: 1200, category: "Apparel", image: "/placeholder-shirt.jpg" },
  { id: 3, name: "Phone Case", status: "REJECTED", price: 500, category: "Tech", image: "/placeholder-case.jpg" },
];

export default function SupplierDashboard() {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('custom_orders')
      .select('*, customer:profiles(full_name)')
      .eq('supplier_id', user.id)
      .eq('status', 'ASSIGNED_TO_SUPPLIER');

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  const handleFulfill = async (orderId: string) => {
    const proofUrl = prompt("Enter the URL of the photo of the finished product (Supplier Proof):");
    if (!proofUrl) return;

    const { error } = await supabase
      .from('custom_orders')
      .update({
        status: 'COMPLETED_BY_SUPPLIER',
        supplier_proof_image_url: proofUrl
      })
      .eq('id', orderId);

    if (error) alert("Error: " + error.message);
    else fetchOrders();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // ... actual submission logic
    setIsAddingProduct(false);
    setLoading(false);
  };

  // Mock stats
  const stats = [
    { label: "Total Products", value: products.length, icon: Box, color: "bg-blue-500" },
    { label: "Approved", value: products.filter(p => p.status === "APPROVED").length, icon: CheckCircle, color: "bg-green-500" },
    { label: "Pending", value: products.filter(p => p.status === "PENDING").length, icon: Clock, color: "bg-yellow-500" },
    { label: "Assigned Orders", value: orders.length, icon: ShoppingBag, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <img src="/logo.png" alt="Stenvio Logo" className="h-12 w-auto" />
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/supplier" className="flex items-center gap-3 px-4 py-3 bg-[#A1FF4D]/10 text-[#2B3220] rounded-xl font-bold transition-all">
            <BarChart3 size={20} /> Dashboard
          </Link>
          <Link href="/supplier/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
            <Box size={20} /> Products
          </Link>
          <Link href="/supplier/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
            <ShoppingBag size={20} /> Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-all">
            <LogOut size={20} /> Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 lg:p-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#2B3220] uppercase tracking-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
              Supplier Dashboard
            </h1>
            <p className="text-gray-500 font-medium">Manage your products and track your earnings.</p>
          </div>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="flex items-center justify-center gap-2 bg-[#A1FF4D] text-[#1B2412] px-6 py-3 rounded-xl font-black shadow-lg hover:shadow-[#A1FF4D]/30 transition-all hover:scale-105"
          >
            <Plus size={20} /> ADD NEW PRODUCT
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-[#2B3220]">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- Assigned Custom Orders Section --- */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#1B2412] text-white p-2 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-2xl font-black text-[#2B3220] uppercase tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
              Pending Custom Fulfillments
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="border-none shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden bg-white group">
                <CardContent className="p-0 flex h-48">
                  <div className="w-1/3 bg-gray-50 flex items-center justify-center border-r border-gray-100 overflow-hidden">
                    {order.mockup_image_url ? (
                      <img src={order.mockup_image_url} alt="Design" className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                    ) : (
                      <Box size={40} className="text-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-[#2B3220] text-lg uppercase leading-none mb-1">{order.product_type}</h3>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">New Order</span>
                      </div>
                      <p className="text-xs font-bold text-gray-400 mb-4">{order.variants?.color || 'N/A'} • {order.variants?.view || 'N/A'}</p>

                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <User size={12} className="text-gray-400" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">{order.customer?.full_name || 'Customer'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFulfill(order.id)}
                      className="w-full bg-[#1B2412] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all transform active:scale-95"
                    >
                      Fulfill & Upload Proof
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {orders.length === 0 && (
              <div className="lg:col-span-2 p-16 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-white/50">
                <Clock size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">No assigned orders at the moment</h3>
              </div>
            )}
          </div>
        </div>
      </main>

      {isAddingProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <Card className="w-full max-w-lg rounded-[2.5rem] shadow-2xl border-none">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black text-[#2B3220] uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
                  Add New Product
                </CardTitle>
                <button onClick={() => setIsAddingProduct(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={28} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#2B3220] uppercase tracking-wider">Product Name</label>
                  <input type="text" placeholder="e.g. Classic White Mug" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#2B3220] uppercase tracking-wider">Category</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none transition-all appearance-none cursor-pointer">
                    <option>Mugs</option>
                    <option>Apparel</option>
                    <option>Hats</option>
                    <option>Tech</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#2B3220] uppercase tracking-wider">Product Image</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 gap-2 hover:border-[#A1FF4C] transition-colors cursor-pointer bg-gray-50/50">
                    <ImageIcon size={40} />
                    <span className="font-bold text-sm">Click to upload or drag & drop</span>
                  </div>
                </div>
                <Button className="w-full bg-[#A1FF4D] hover:bg-[#8ee53f] text-[#1B2412] font-black h-14 rounded-xl mt-4 shadow-lg active:scale-95 transition-all">
                  SUBMIT FOR APPROVAL
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
