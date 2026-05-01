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
