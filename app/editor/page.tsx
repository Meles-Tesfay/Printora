"use client";

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

// Dynamically import the editor because Fabric.js relies on the browser `window` object
const EditorUI = dynamic(() => import('@/components/editor/EditorUI'), {
    ssr: false,
    loading: () => (
        <div className="flex-1 flex items-center justify-center min-h-[500px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )
});

export default function EditorPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Editor specific mini-navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Link>
                        <div className="h-6 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-1 rounded-md">
                                <ShoppingBag className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-gray-900 tracking-tight">Printora Studio</span>
                        </div>
                    </div>

                    <div className="text-sm font-medium text-gray-600 hidden sm:block">
                        Step 1: <span className="text-primary font-bold">Design</span> &rarr; Step 2: Checkout
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                <EditorUI />
            </main>
        </div>
    );
}
