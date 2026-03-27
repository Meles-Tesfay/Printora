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
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [loading, setLoading] = useState(false);

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
    { label: "Revenue", value: "ETB 24,500", icon: BarChart3, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <img src="/logo.png" alt="Printora" className="h-10 w-auto" />
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

        {/* Products Table/List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#2B3220]">Your Products</h2>
            <Link href="/supplier/products" className="text-sm font-bold text-[#2B3118] hover:underline">View all</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {/* Placeholder image icon */}
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                          </div>
                        </div>
                        <span className="font-bold text-[#2B3220]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{product.category}</td>
                    <td className="px-6 py-4 text-[#2B3220] font-black">ETB {product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-black uppercase tracking-wider ${
                        product.status === "APPROVED" ? "bg-green-100 text-green-700" :
                        product.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-sm font-bold text-gray-500 hover:text-[#2B3220] transition-colors">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-20 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Box size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#2B3220]">No products yet</h3>
              <p className="text-gray-500 mb-6">Start by adding your first product to the catalog.</p>
              <button 
                onClick={() => setIsAddingProduct(true)}
                className="bg-[#2B3220] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3b442b] transition-all"
              >
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal (Simple placeholder for now) */}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#2B3220] uppercase tracking-wider">Price (ETB)</label>
                    <input type="number" placeholder="800" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#A1FF4C] outline-none transition-all" />
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
