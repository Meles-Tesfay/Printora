"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

// Dynamically import the editor because Fabric.js relies on the browser `window` object
const EditorUI = dynamic(() => import('@/components/editor/EditorUI'), {
    ssr: false,
    loading: () => (
        <div className="flex-1 flex items-center justify-center min-h-[500px] bg-[#0e0e10]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[12px] text-gray-500 font-medium tracking-wide">Loading Studio...</span>
            </div>
        </div>
    )
});

function EditorContent() {
    return (
        <div className="h-screen bg-[#0e0e10] flex flex-col overflow-hidden">
            {/* Editor Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#141416]/95 backdrop-blur-xl">
                <div className="px-5 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/products" className="text-gray-500 hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-[12px] font-medium">
                            <ArrowLeft className="w-3.5 h-3.5" /> Products
                        </Link>
                        <div className="h-5 w-px bg-white/[0.08]" />
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <Sparkles className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="font-bold text-white text-[14px] tracking-tight">Printora <span className="text-emerald-400 font-medium text-[12px]">Studio</span></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium">
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Step 1: Design
                            </span>
                            <span className="text-gray-600">→</span>
                            <span className="text-gray-600">Step 2: Checkout</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <EditorUI />
            </main>
        </div>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0e0e10]">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <EditorContent />
        </Suspense>
    );
}
