"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
    Clock, CheckCircle, Truck, XCircle, PenTool,
    Package, ArrowRight, Loader2, LogOut, Home,
    Sparkles, ShieldCheck, User
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
        label: "In Production",
        icon: Package,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        description: "Your order has been approved and assigned to a supplier for production.",
        step: 2,
    },
    COMPLETED_BY_SUPPLIER: {
        label: "Ready / Shipped",
        icon: Truck,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        description: "Your order has been completed by the supplier and is on its way!",
        step: 3,
    },
    REJECTED: {
        label: "Rejected",
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        description: "Unfortunately, this design could not be approved. Please redesign and resubmit.",
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
            .select("*")
            .eq("customer_id", user.id)
            .order("created_at", { ascending: false });

        setOrders(ordersData || []);
        setLoading(false);

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
                        <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
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
                    <h1 className="text-4xl font-black text-[#111] uppercase tracking-tighter" style={{ fontFamily: "Impact, sans-serif" }}>
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
                            href="/editor"
                            className="bg-[#A1FF4D] text-[#1B2412] px-8 py-4 rounded-2xl font-black text-base hover:bg-[#8ee53f] hover:shadow-xl hover:shadow-[#A1FF4D]/20 transition-all flex items-center gap-2"
                        >
                            <PenTool size={18} /> Start Designing
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
                                <OrderDetail order={selectedOrder} />
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

function OrderDetail({ order }: { order: any }) {
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
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Status Header */}
            <div className={`p-6 ${cfg.bg} border-b ${cfg.border}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                        <Icon size={22} className={cfg.color} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Status</p>
                        <h3 className={`text-xl font-black ${cfg.color}`}>{cfg.label}</h3>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                        <p className="text-[11px] font-black text-gray-600 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-3">{cfg.description}</p>
            </div>

            {/* Progress Stepper */}
            {order.status !== "REJECTED" && (
                <div className="px-6 py-5 border-b border-gray-50">
                    <div className="flex items-center">
                        {STEPS.map((step, idx) => {
                            const done = currentStep >= step.id;
                            const active = currentStep + 1 === step.id;
                            const StepIcon = step.icon;
                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${done
                                                ? "bg-[#A1FF4D] text-[#1B2412] shadow-md shadow-[#A1FF4D]/30"
                                                : active
                                                    ? "bg-white border-2 border-[#A1FF4D] text-[#A1FF4D]"
                                                    : "bg-gray-100 text-gray-300"
                                            }`}>
                                            {done ? <CheckCircle size={16} /> : <StepIcon size={14} />}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-wider text-center leading-tight max-w-[60px] ${done ? "text-[#2B3220]" : active ? "text-gray-500" : "text-gray-300"
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                    {idx < STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-1 mb-5 transition-all ${currentStep > step.id ? "bg-[#A1FF4D]" : "bg-gray-100"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Design Preview */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mockup */}
                <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-4 border border-gray-100">
                    {order.mockup_image_url ? (
                        <img src={order.mockup_image_url} className="w-full h-full object-contain" alt="Your design" />
                    ) : (
                        <div className="text-gray-200 flex flex-col items-center gap-2">
                            <Package size={40} />
                            <p className="text-xs font-bold text-gray-300">No preview</p>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-3">
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Product</p>
                        <p className="font-black text-[#111] text-base">{order.product_type}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-2xl p-3">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Color</p>
                            <p className="font-black text-[#111] text-sm">{order.variants?.color || "Default"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-3">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">View</p>
                            <p className="font-black text-[#111] text-sm">{order.variants?.view || "Front"}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Submitted</p>
                        <p className="font-bold text-[#111] text-sm">{new Date(order.created_at).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>

                    {/* Supplier proof (if completed) */}
                    {order.supplier_proof_image_url && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Completion Proof</p>
                                <a
                                    href={order.supplier_proof_image_url}
                                    download={`proof-${order.id.slice(0,8)}.jpg`}
                                    className="flex items-center gap-1 bg-green-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-green-700 active:scale-95 transition-all"
                                >
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    Download
                                </a>
                            </div>
                            <img src={order.supplier_proof_image_url} className="w-full rounded-xl" alt="Proof" />
                        </div>
                    )}

                    {/* Edit action — available while still pending */}
                    {order.status === "PENDING_ADMIN" && (
                        <Link
                            href={editUrl}
                            className="flex items-center justify-center gap-2 w-full bg-[#1B2412] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#A1FF4D] hover:text-[#1B2412] transition-all"
                        >
                            <PenTool size={14} /> Edit Design
                        </Link>
                    )}

                    {/* Rejected action */}
                    {order.status === "REJECTED" && (
                        <Link
                            href={editUrl}
                            className="flex items-center justify-center gap-2 w-full bg-[#111] text-white py-3 rounded-2xl font-bold text-sm hover:bg-[#A1FF4D] hover:text-[#1B2412] transition-all"
                        >
                            <PenTool size={14} /> Redesign &amp; Resubmit
                        </Link>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <div className="px-6 pb-6">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Activity Timeline</p>
                <div className="space-y-2">
                    {[
                        { date: order.created_at, label: "Design submitted for review", active: true },
                        { date: order.status !== "PENDING_ADMIN" ? order.updated_at : null, label: "Admin reviewed & approved", active: ["ASSIGNED_TO_SUPPLIER", "COMPLETED_BY_SUPPLIER"].includes(order.status) },
                        { date: order.status === "COMPLETED_BY_SUPPLIER" ? order.updated_at : null, label: "Production complete", active: order.status === "COMPLETED_BY_SUPPLIER" },
                    ].map((item, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${item.active ? "bg-[#A1FF4D]/10" : "opacity-30"}`}>
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.active ? "bg-[#A1FF4D]" : "bg-gray-300"}`} />
                            <div>
                                <p className={`text-[11px] font-bold ${item.active ? "text-[#2B3220]" : "text-gray-400"}`}>{item.label}</p>
                                {item.date && <p className="text-[10px] text-gray-400">{new Date(item.date).toLocaleString()}</p>}
                            </div>
                        </div>
                    ))}
                </div>
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
