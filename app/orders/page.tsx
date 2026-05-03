"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    Clock, CheckCircle, Truck, XCircle, PenTool,
    Package, ArrowRight, Loader2, LogOut, Home,
    Sparkles, ShieldCheck, User, Star, ShoppingBag
} from "lucide-react";

const STATUS_CONFIG: Record<string, {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    description: string;
    step: number;
}> = {
    PENDING_ADMIN: {
        label: "Awaiting Review",
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        description: "Your design has been submitted and is waiting for admin review.",
        step: 1,
    },
    ASSIGNED_TO_SUPPLIER: {
        label: "Admin Approved",
        icon: ShieldCheck,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        description: "Admin has approved your design. A supplier is now preparing your order.",
        step: 2,
    },
    SAMPLE_AWAITING_APPROVAL: {
        label: "Sample Ready",
        icon: Package,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        description: "The supplier has finished the sample. Please review it below.",
        step: 2,
    },
    SAMPLE_REJECTED: {
        label: "Sample Rejected",
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        description: "You've requested changes to the sample. The supplier is updating it.",
        step: 2,
    },
    FINAL_PAYMENT_PENDING: {
        label: "Verifying Payment",
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        description: "Your receipt has been submitted. Waiting for admin to verify the final payment.",
        step: 3,
    },
    PRODUCTION_APPROVED_AND_PAID: {
        label: "In Production",
        icon: Package,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        description: "Payment verified! The supplier has been notified to start full-scale production.",
        step: 3,
    },
    COMPLETED_BY_SUPPLIER: {
        label: "Production Done",
        icon: Truck,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        description: "The batch is ready and being prepared for delivery.",
        step: 3,
    },
    DELIVERED: {
        label: "Delivered",
        icon: Truck,
        color: "text-teal-600",
        bg: "bg-teal-50",
        border: "border-teal-200",
        description: "Your order has been delivered! Please share your feedback.",
        step: 4,
    },
    REJECTED: {
        label: "Rejected",
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        description: "Unfortunately, this design could not be approved. Please redesign.",
        step: 0,
    },
};

const STEPS = [
    { id: 1, label: "Design Submitted", icon: PenTool },
    { id: 2, label: "Admin Review", icon: ShieldCheck },
    { id: 3, label: "In Production", icon: Package },
    { id: 4, label: "Delivered", icon: Truck },
];

function OrdersContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const justSubmitted = searchParams.get("submitted") === "true";

    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showSuccess, setShowSuccess] = useState(justSubmitted);

    useEffect(() => {
        initPage();
        // Hide the success banner after 5 seconds
        if (justSubmitted) {
            const t = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(t);
        }
    }, []);

    const initPage = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        const { data: prof } = await supabase
            .from("profiles").select("*").eq("id", user.id).single();

        // Suppliers have their own panel — redirect them away
        if (prof?.role === "SUPPLIER") { router.push("/supplier"); return; }

        setProfile(prof);

        const { data: ordersData } = await supabase
            .from("custom_orders")
            .select("*, supplier_product:supplier_products(price)")
            .eq("customer_id", user.id)
            .order("created_at", { ascending: false });

        setOrders(ordersData || []);
        setLoading(false);

        // Update selectedOrder if it exists to reflect latest changes
        if (selectedOrder) {
            const updated = (ordersData || []).find(o => o.id === selectedOrder.id);
            console.log("Updated selected order found:", updated);
            if (updated) setSelectedOrder(updated);
        }

        // Auto-select the most recent order if just submitted
        if (justSubmitted && ordersData && ordersData.length > 0) {
            setSelectedOrder(ordersData[0]);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
                <Loader2 size={44} className="animate-spin text-[#A1FF4D]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans">
            {/* Top Nav */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity" />
                        </Link>
                        <div className="hidden sm:block w-px h-5 bg-gray-200" />
                        <span className="hidden sm:block text-[11px] font-black text-gray-400 uppercase tracking-widest">My Orders</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {profile && (
                            <div className="flex items-center gap-2.5 bg-gray-50 rounded-full px-3 py-1.5">
                                <div className="w-7 h-7 rounded-full bg-[#A1FF4D] flex items-center justify-center text-[#1B2412] font-black text-xs">
                                    {profile.full_name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <span className="text-[12px] font-bold text-[#1B2412] hidden sm:block max-w-[100px] truncate">
                                    {profile.full_name}
                                </span>
                            </div>
                        )}
                        <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors p-2">
                            <Home size={18} />
                        </Link>
                        <Link href="/editor" className="bg-[#A1FF4D] text-[#1B2412] px-4 py-2 rounded-xl font-black text-xs hover:bg-[#8ee53f] transition-all flex items-center gap-1.5">
                            <PenTool size={13} /> New Design
                        </Link>
                        <button onClick={handleSignOut} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Success Banner */}
                {showSuccess && (
                    <div className="mb-8 bg-[#A1FF4D] rounded-3xl p-6 flex items-center gap-5 shadow-lg shadow-[#A1FF4D]/20 animate-in slide-in-from-top-4 fade-in duration-500">
                        <div className="w-14 h-14 bg-white/40 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Sparkles size={28} className="text-[#1B2412]" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-[#1B2412] font-black text-xl">Design Submitted Successfully! 🎉</h2>
                            <p className="text-[#2B3220]/80 font-medium text-sm mt-0.5">
                                Your order is now in the review queue. We'll notify you once it's approved and sent to production.
                            </p>
                        </div>
                        <button onClick={() => setShowSuccess(false)} className="text-[#1B2412]/50 hover:text-[#1B2412] transition-colors flex-shrink-0">
                            <XCircle size={20} />
                        </button>
                    </div>
                )}

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-[#111] uppercase tracking-widest" style={{ fontFamily: "Impact, sans-serif" }}>
                        My Orders
                    </h1>
                    <p className="text-gray-500 font-medium text-sm mt-1">
                        Track all your custom designs from submission to delivery.
                    </p>
                </div>

                {orders.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                            <Package size={44} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-black text-[#111] mb-2">No orders yet</h2>
                        <p className="text-gray-500 font-medium max-w-sm mb-8">
                            Design your first custom product and it will appear here for you to track.
                        </p>
                        <Link
                            href="/products"
                            className="bg-[#A1FF4D] text-[#1B2412] px-8 py-4 rounded-2xl font-black text-base hover:bg-[#8ee53f] hover:shadow-xl hover:shadow-[#A1FF4D]/20 transition-all flex items-center gap-2"
                        >
                            <ShoppingBag size={18} /> Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Order List (left) */}
                        <div className="lg:col-span-2 space-y-3">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">{orders.length} Order{orders.length !== 1 ? 's' : ''}</p>
                            {orders.map((order) => {
                                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING_ADMIN;
                                const Icon = cfg.icon;
                                const isSelected = selectedOrder?.id === order.id;
                                return (
                                    <button
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${isSelected
                                                ? "border-[#A1FF4D] bg-white shadow-xl"
                                                : "border-gray-100 bg-white hover:border-gray-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Mockup thumb */}
                                            <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                                {order.mockup_image_url ? (
                                                    <img src={order.mockup_image_url} className="w-full h-full object-contain p-0.5" alt="Design" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-[#111] text-sm truncate">{order.product_type}</p>
                                                <p className="text-[10px] text-gray-400 font-bold">{order.variants?.color} • {order.variants?.view}</p>
                                                <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                                                    <Icon size={9} />
                                                    {cfg.label}
                                                </div>
                                            </div>
                                            <ArrowRight size={14} className={`flex-shrink-0 transition-colors ${isSelected ? "text-[#A1FF4D]" : "text-gray-200"}`} />
                                        </div>
                                    </button>
                                );
                            })}

                            <Link
                                href="/editor"
                                className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#A1FF4D] hover:text-[#2B3220] hover:bg-[#A1FF4D]/5 transition-all font-bold text-sm"
                            >
                                <PenTool size={14} /> New Design
                            </Link>
                        </div>

                        {/* Order Detail (right) */}
                        <div className="lg:col-span-3">
                            {selectedOrder ? (
                                <OrderDetail order={selectedOrder} onRefresh={initPage} />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-24 text-center bg-white rounded-3xl border border-gray-100">
                                    <Package size={36} className="text-gray-200 mb-3" />
                                    <p className="text-gray-400 font-bold text-sm">Select an order to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function OrderDetail({ order, onRefresh }: { order: any, onRefresh: () => void }) {
    const [finalReceipt, setFinalReceipt] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [declineMessage, setDeclineMessage] = useState("");
    const [rating, setRating] = useState(order.variants?.customer_rating || 0);
    const [feedback, setFeedback] = useState(order.variants?.customer_feedback || "");
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [activeAction, setActiveAction] = useState<'none' | 'approve' | 'decline'>('none');

    // Sync local state when the order prop changes (e.g. after refresh)
    useEffect(() => {
        setRating(order.variants?.customer_rating || 0);
        setFeedback(order.variants?.customer_feedback || "");
        setActiveAction('none');
    }, [order.id, order.variants]);

    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING_ADMIN;
    const Icon = cfg.icon;
    const currentStep = cfg.step;

    // Build the edit link: map product_type → template ID
    const PRODUCT_TYPE_MAP: Record<string, string> = {
        'Classic T-Shirt': 'classic-tshirt',
        'Premium Hoodie': 'premium-hoodie',
        'Crewneck Sweater': 'crewneck-sweater',
        'Classic Cap': 'classic-cap',
    };
    const templateId = PRODUCT_TYPE_MAP[order.product_type] || 'classic-tshirt';
    const editUrl = `/editor?edit_order=${order.id}&template=${templateId}`;

    return (
        <div className="bg-white rounded-[3.5rem] border border-gray-100/50 overflow-hidden shadow-2xl shadow-black/5 ring-1 ring-black/[0.02]">
            {/* Status Header */}
            <div className={`p-8 ${cfg.bg} border-b ${cfg.border}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shadow-inner`}>
                        <Icon size={26} className={cfg.color} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Status</p>
                        <h3 className={`text-2xl font-black ${cfg.color} uppercase`} style={{ fontFamily: 'Impact, sans-serif' }}>{cfg.label}</h3>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                        <p className="text-xs font-black text-gray-600 font-mono bg-white px-3 py-1 rounded-full border border-gray-100">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-500 font-bold mt-4 leading-relaxed max-w-2xl">{cfg.description}</p>
            </div>

            {/* Progress Stepper */}
            {order.status !== "REJECTED" && (
                <div className="px-8 py-6 border-b border-gray-50 bg-[#fafafa]/50">
                    <div className="flex items-center justify-between gap-4">
                        {STEPS.map((step, idx) => {
                            const done = currentStep >= step.id;
                            const active = currentStep + 1 === step.id;
                            const StepIcon = step.icon;
                            return (
                                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${done
                                                ? "bg-[#A1FF4D] text-[#1B2412] shadow-lg shadow-[#A1FF4D]/20"
                                                : active
                                                    ? "bg-white border-2 border-[#A1FF4D] text-[#A1FF4D] scale-110"
                                                    : "bg-gray-100 text-gray-300"
                                            }`}>
                                            {done ? <CheckCircle size={18} /> : <StepIcon size={16} />}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-center whitespace-nowrap ${done ? "text-[#2B3220]" : active ? "text-[#A1FF4D]" : "text-gray-300"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-4 -mt-6 transition-all ${currentStep > step.id ? "bg-[#A1FF4D]" : "bg-gray-100"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="p-10 space-y-12">
                {/* 3-Column Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* 1. Mockup Column (4/12) */}
                    <div className="lg:col-span-4 bg-gray-50 rounded-[2.5rem] aspect-square flex items-center justify-center p-8 border border-gray-100 shadow-inner group">
                        {order.mockup_image_url ? (
                            <img src={order.mockup_image_url} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" alt="Your design" />
                        ) : (
                            <div className="text-gray-200 flex flex-col items-center gap-4">
                                <Package size={60} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">No Preview</p>
                            </div>
                        )}
                    </div>

                    {/* 2. Specs Column (4/12) */}
                    <div className="lg:col-span-4 flex flex-col justify-between py-2">
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2">Product Identity</p>
                                <p className="font-black text-[#1B2412] text-2xl uppercase leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>{order.product_type}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Configuration</p>
                                        <p className="font-black text-[#111] text-sm">{order.variants?.color} • {order.variants?.size}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: order.variants?.color?.toLowerCase() }} />
                                </div>
                                <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Batch Volume</p>
                                    <p className="font-black text-[#111] text-sm">{order.variants?.quantity || 1} Custom Units</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3 border border-emerald-100">
                            <ShieldCheck className="text-emerald-500" size={18} />
                            <p className="text-[10px] font-bold text-emerald-700">Quality Assured by Printora Studio</p>
                        </div>
                    </div>

                    {/* 3. Financial Column (4/12) */}
                    <div className="lg:col-span-4 bg-[#1B2412] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-[#1B2412]/20 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#A1FF4D]/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Order Valuation</p>
                            <p className="font-black text-4xl tracking-tighter flex items-baseline gap-1">
                                {(() => {
                                    const basePrice = order.supplier_product?.price || 600;
                                    return (basePrice * (order.variants?.quantity || 1)).toLocaleString();
                                })()}
                                <span className="text-sm font-bold text-gray-600">ብር</span>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="h-px bg-white/5" />
                            <div className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-[#A1FF4D] uppercase tracking-widest flex items-center gap-1">✓ 50% Deposit Paid</span>
                                <span className="text-emerald-400">
                                    {(() => {
                                        const basePrice = order.supplier_product?.price || 600;
                                        return (basePrice * (order.variants?.quantity || 1) / 2).toLocaleString();
                                    })()} ብር
                                </span>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Balance Due</span>
                                    <Sparkles size={10} className="text-amber-400 animate-pulse" />
                                </div>
                                <span className="font-black text-xl text-amber-400">
                                    {(() => {
                                        const basePrice = order.supplier_product?.price || 600;
                                        return (basePrice * (order.variants?.quantity || 1) / 2).toLocaleString();
                                    })()} <span className="text-[10px] ml-0.5">ብር</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Full-Width Action Section */}
                <div className="pt-8">
                    {/* Supplier proof & Approval Logic */}
                    {order.supplier_proof_image_url && (
                        <div className="bg-emerald-50/40 border border-emerald-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -mr-32 -mt-32" />
                            
                            <div className="flex flex-col xl:flex-row gap-12 relative z-10">
                                {/* Proof Image Container */}
                                <div className="w-full xl:w-1/2 group">
                                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                                        <img src={order.supplier_proof_image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Proof" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a
                                                href={order.supplier_proof_image_url}
                                                download={`proof-${order.id.slice(0,8)}.jpg`}
                                                className="bg-white text-[#1B2412] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-110 transition-all flex items-center gap-2"
                                            >
                                                Download Proof
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Content and Actions */}
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                                            Sample Review
                                        </div>
                                        <div className="h-px flex-1 bg-emerald-100" />
                                    </div>

                                    <h4 className="text-4xl font-black text-[#1B2412] uppercase leading-[0.9] mb-4" style={{ fontFamily: 'Impact, sans-serif' }}>
                                        Verify Your <br/> <span className="text-emerald-600 underline decoration-emerald-200">Production</span> Sample
                                    </h4>
                                    
                                    <p className="text-base text-emerald-800/70 font-bold leading-relaxed mb-10 max-w-lg">
                                        The first physical sample is ready. Inspect the colors, placement, and finish carefully before we start the full batch.
                                    </p>

                                    {!order.variants?.finalReceiptUrl ? (
                                        <div className="space-y-6">
                                            {order.variants?.finalReceiptRejected && (
                                                <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-6 mb-4 animate-in fade-in slide-in-from-top-4">
                                                    <div className="flex items-center gap-3 mb-2 text-red-600">
                                                        <AlertCircle size={20} />
                                                        <p className="text-sm font-black uppercase tracking-widest">Payment Receipt Rejected</p>
                                                    </div>
                                                    <p className="text-xs font-bold text-red-500 leading-relaxed italic">
                                                        "{order.variants.finalReceiptRejectionReason}"
                                                    </p>
                                                    <p className="text-[10px] font-black text-red-400 mt-3 uppercase tracking-tighter">Please re-upload a valid receipt below to proceed.</p>
                                                </div>
                                            )}
                                            {order.status === 'SAMPLE_AWAITING_APPROVAL' && (
                                                <div className="flex flex-col gap-6">
                                                    {activeAction === 'none' && (
                                                        <div className="flex flex-col sm:flex-row gap-4">
                                                            <button 
                                                                onClick={() => setActiveAction('approve')}
                                                                className="flex-1 bg-[#1B2412] text-white py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:shadow-2xl hover:shadow-[#A1FF4D]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                                            >
                                                                <CheckCircle size={18} className="text-[#A1FF4D]" /> Approve & Pay Balance
                                                            </button>
                                                            <button 
                                                                onClick={() => setActiveAction('decline')}
                                                                className="bg-white border-2 border-red-50 text-red-500 py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-50 hover:border-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                                            >
                                                                <XCircle size={18} /> Request Correction
                                                            </button>
                                                        </div>
                                                    )}

                                                    {activeAction === 'decline' && (
                                                        <div className="bg-white/80 p-6 rounded-3xl border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <label className="text-[11px] font-black text-red-600 uppercase tracking-widest">Rejection Feedback</label>
                                                                <button onClick={() => setActiveAction('none')} className="text-[10px] font-black text-gray-400 hover:text-gray-600">Cancel</button>
                                                            </div>
                                                            <textarea 
                                                                value={declineMessage}
                                                                onChange={e => setDeclineMessage(e.target.value)}
                                                                placeholder="What specific changes are needed? (e.g. Logo size, color shade, etc.)"
                                                                className="w-full text-sm p-4 rounded-2xl border border-red-50 outline-none focus:ring-2 focus:ring-red-400 mb-4 resize-none min-h-[100px]"
                                                            />
                                                            <button 
                                                                onClick={async () => {
                                                                    if (!declineMessage.trim()) return alert('Please provide a reason');
                                                                    setIsDeclining(true);
                                                                    const newVariants = { ...order.variants, sample_rejection_message: declineMessage };
                                                                    await supabase.from('custom_orders').update({ variants: newVariants, status: 'SAMPLE_REJECTED' }).eq('id', order.id);
                                                                    setIsDeclining(false);
                                                                    onRefresh();
                                                                }}
                                                                disabled={isDeclining || !declineMessage.trim()}
                                                                className="w-full bg-red-500 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all disabled:opacity-50"
                                                            >
                                                                {isDeclining ? 'Submitting...' : 'Confirm Rejection'}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {activeAction === 'approve' && (
                                                        <div className="bg-white/80 p-8 rounded-[3rem] border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                                                            <div className="flex justify-between items-center mb-6">
                                                                <label className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Final Batch Payment Receipt</label>
                                                                <button onClick={() => setActiveAction('none')} className="text-[10px] font-black text-gray-400 hover:text-gray-600">Cancel</button>
                                                            </div>
                                                            <div className="relative border-4 border-dashed border-emerald-100 rounded-[2rem] p-10 bg-emerald-50/30 flex flex-col items-center group/upload">
                                                                <input 
                                                                    type="file" 
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            const reader = new FileReader();
                                                                            reader.onload = (event) => setFinalReceipt(event.target?.result as string);
                                                                            reader.readAsDataURL(file);
                                                                        }
                                                                    }}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                                                />
                                                                {finalReceipt ? (
                                                                    <div className="flex flex-col items-center gap-4">
                                                                        <img src={finalReceipt} className="h-40 rounded-2xl object-contain shadow-2xl" alt="Receipt Preview" />
                                                                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">Receipt Captured ✓</p>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-4 shadow-lg group-hover/upload:scale-110 transition-transform">
                                                                            <ShieldCheck className="text-emerald-500" size={32} />
                                                                        </div>
                                                                        <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Drop receipt or click to upload</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                            {finalReceipt && (
                                                                <button 
                                                                    onClick={async () => {
                                                                        setIsSubmitting(true);
                                                                        const newVariants = { ...order.variants, finalReceiptUrl: finalReceipt };
                                                                        await supabase.from('custom_orders').update({ variants: newVariants, status: 'FINAL_PAYMENT_PENDING' }).eq('id', order.id);
                                                                        setIsSubmitting(false);
                                                                        onRefresh();
                                                                    }}
                                                                    disabled={isSubmitting}
                                                                    className="w-full mt-8 bg-[#A1FF4D] text-[#1B2412] py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-[#A1FF4D]/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                                                >
                                                                    {isSubmitting ? 'Verifying...' : 'Approve & Start Production'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {order.status === 'SAMPLE_REJECTED' && (
                                                <div className="bg-red-50 rounded-3xl p-8 border border-red-100 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                                            <XCircle className="text-red-500" size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-black text-red-600 uppercase tracking-widest leading-none mb-1">Correction Requested</p>
                                                            <p className="text-sm font-black text-red-900 uppercase">Supplier is reviewing your feedback</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white/60 p-5 rounded-2xl border border-red-50">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Your Feedback:</p>
                                                        <p className="text-sm font-bold text-red-800 leading-relaxed italic">&ldquo;{order.variants?.sample_rejection_message}&rdquo;</p>
                                                    </div>
                                                </div>
                                            )}

                                            {order.status === 'FINAL_PAYMENT_PENDING' && (
                                                <div className="bg-amber-500/10 rounded-3xl p-8 border border-amber-500/20 animate-in fade-in slide-in-from-bottom-4">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
                                                            <Clock className="text-[#1B2412]" size={24} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-lg font-black text-amber-900 uppercase leading-tight">Verifying Payment</h5>
                                                            <p className="text-[11px] text-amber-700 font-bold uppercase tracking-widest">Admin Review in Progress</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-amber-800/80 font-medium leading-relaxed mb-6">
                                                        Your final payment receipt has been received. Our team is verifying the transaction. 
                                                        Full-scale production will commence immediately after approval.
                                                    </p>
                                                    <a 
                                                        href={order.variants?.finalReceiptUrl} 
                                                        target="_blank"
                                                        className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-700 border border-amber-200 hover:bg-amber-50 transition-all"
                                                    >
                                                        <ImageIcon size={14} /> View Submitted Receipt
                                                    </a>
                                                </div>
                                            )}

                                            {['PRODUCTION_APPROVED_AND_PAID', 'COMPLETED_BY_SUPPLIER', 'DELIVERED'].includes(order.status) && (
                                                <div className="bg-emerald-500/10 rounded-3xl p-8 border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-4">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-[#A1FF4D] flex items-center justify-center shadow-lg shadow-[#A1FF4D]/20">
                                                            <CheckCircle className="text-[#1B2412]" size={24} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-lg font-black text-emerald-900 uppercase leading-tight">Sample Approved! ✅</h5>
                                                            <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-widest">Production Batch Initiated</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-emerald-800/80 font-medium leading-relaxed">
                                                        The supplier is now processing the full production batch of {order.variants?.quantity || 1} units. 
                                                        You will be notified once the batch is ready for shipment.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-white/80 p-5 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <ShieldCheck size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-[#1B2412] uppercase tracking-wider">Order in Production</p>
                                                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Final payment verified ✓</p>
                                                </div>
                                            </div>
                                            <a
                                                href={order.variants.finalReceiptUrl}
                                                download={`final-receipt-${order.id.slice(0,8)}.jpg`}
                                                className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all"
                                            >
                                                Receipt
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 mt-6 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100 flex items-center gap-3">
                            <Clock size={14} className="text-gray-400" />
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        {order.status === "DELIVERED" && (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <CheckCircle size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">Completed</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {["DELIVERED", "PRODUCTION_APPROVED_AND_PAID", "COMPLETED_BY_SUPPLIER"].includes(order.status) && (
                            <button className="flex-1 sm:flex-none bg-[#1B2412] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#1B2412]/10">
                                <ShoppingBag size={14} /> Reorder Batch
                            </button>
                        )}
                        
                        {["PENDING_ADMIN", "REJECTED"].includes(order.status) && (
                            <Link 
                                href={editUrl}
                                className="flex-1 sm:flex-none bg-white border-2 border-gray-100 text-[#1B2412] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <PenTool size={14} /> {order.status === "REJECTED" ? "Fix Design" : "Edit Design"}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Feedback Section for Delivered Orders */}
                {order.status === "DELIVERED" && (
                        Number(order.variants?.customer_rating) > 0 ? (
                            /* Already submitted — show compact thank-you card only */
                            <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mt-4 flex items-center gap-3">
                                <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Star size={16} className="fill-white text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Review Submitted</p>
                                    <div className="flex gap-0.5 mt-1">
                                        {[1,2,3,4,5].map(s => (
                                            <Star key={s} size={12} className={s <= (order.variants?.customer_rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                        ))}
                                    </div>
                                    {order.variants?.customer_feedback && (
                                        <p className="text-xs text-teal-600 font-medium mt-1 italic">"{order.variants.customer_feedback}"</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Not yet submitted — show the feedback form */
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 mt-4 shadow-sm">
                                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-3">Rate your Experience</p>
                                
                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            onClick={() => setRating(star)}
                                            className="transition-transform active:scale-90 hover:scale-110"
                                        >
                                            <Star 
                                                size={28} 
                                                className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 hover:text-yellow-300"} 
                                            />
                                        </button>
                                    ))}
                                </div>

                                <textarea 
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Write your feedback here..."
                                    className="w-full text-sm p-3 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-teal-400 min-h-[100px] resize-none mb-3"
                                />

                                <button 
                                    onClick={async () => {
                                        if (rating === 0) return alert("Please select a rating");
                                        setSubmittingFeedback(true);
                                        const newVariants = { ...order.variants, customer_rating: rating, customer_feedback: feedback };
                                        const { error, count } = await supabase
                                            .from("custom_orders")
                                            .update({ variants: newVariants })
                                            .eq("id", order.id)
                                            .select();
                                        setSubmittingFeedback(false);
                                        if (error) {
                                            console.error("Feedback error:", error);
                                            alert("Error saving feedback: " + error.message);
                                        } else {
                                            console.log("Feedback update result — rows affected:", count);
                                            onRefresh();
                                        }
                                    }}
                                    disabled={submittingFeedback || rating === 0}
                                    className="w-full bg-teal-500 text-white py-3 rounded-xl font-black text-sm hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
                                >
                                    {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                                </button>
                            </div>
                        )
                    )}
                {/* Removed Timeline as requested */}
                </div>
            </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 size={44} className="animate-spin text-[#A1FF4D]" />
            </div>
        }>
            <OrdersContent />
        </Suspense>
    );
}
