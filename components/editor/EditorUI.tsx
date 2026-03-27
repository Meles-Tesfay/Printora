"use client";

import React, { useState, useEffect } from 'react';
import { PRODUCT_TEMPLATES } from '@/lib/editor-constants';
import { useEditorCanvas } from '@/hooks/useEditorCanvas';
import { useSearchParams } from 'next/navigation';
import TshirtMockup from './TshirtMockup';
import HoodieMockup from './HoodieMockup';
import SweaterMockup from './SweaterMockup';
import HatMockup from './HatMockup';
import {
    Image as ImageIcon,
    Type,
    Trash2,
    BringToFront,
    SendToBack,
    Download,
    Layers,
    Palette,
    ChevronLeft,
    ChevronRight,
    Bold,
    Italic,
    ShoppingCart,
    Sparkles,
    Move,
    ZoomIn,
    RotateCcw
} from 'lucide-react';
import { ProductTemplate, ProductView, CanvasDesignState } from '@/types/editor';

export default function EditorUI() {
    const searchParams = useSearchParams();
    const requestedTemplate = searchParams.get('template');
    const initialTemplate = PRODUCT_TEMPLATES.find((p) => p.id === requestedTemplate) || PRODUCT_TEMPLATES[0];

    const [selectedProduct, setSelectedProduct] = useState<ProductTemplate>(initialTemplate);
    const [selectedColor, setSelectedColor] = useState<string>(initialTemplate.defaultColorHex);
    const [selectedView, setSelectedView] = useState<ProductView>(initialTemplate.views.find(v => v.id === initialTemplate.defaultViewId) || initialTemplate.views[0]);

    const [viewStates, setViewStates] = useState<Record<string, CanvasDesignState>>({});
    const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
    const [activeTab, setActiveTab] = useState<'design' | 'colors'>('design');

    const printArea = selectedView.printAreas[0];

    const {
        canvasRef,
        canvas,
        addText,
        addImage,
        deleteSelected,
        bringForward,
        sendBackward,
        updateActiveObject
    } = useEditorCanvas({
        printArea,
        canvasSize: { width: 500, height: 540 },
        onSelectionChange: setActiveObject,
        initialState: viewStates[selectedView.id]
    });

    // Handle View Change
    const handleViewChange = (viewId: string) => {
        if (canvas) {
            setViewStates(prev => ({
                ...prev,
                [selectedView.id]: { objects: canvas.toJSON().objects }
            }));
        }
        const newView = selectedProduct.views.find(v => v.id === viewId);
        if (newView) setSelectedView(newView);
    };

    // Navigate views with arrows
    const navigateView = (direction: 'prev' | 'next') => {
        const currentIdx = selectedProduct.views.findIndex(v => v.id === selectedView.id);
        let newIdx;
        if (direction === 'next') {
            newIdx = (currentIdx + 1) % selectedProduct.views.length;
        } else {
            newIdx = (currentIdx - 1 + selectedProduct.views.length) % selectedProduct.views.length;
        }
        handleViewChange(selectedProduct.views[newIdx].id);
    };

    // Sync selected product when template query changes
    useEffect(() => {
        const fromQuery = PRODUCT_TEMPLATES.find((p) => p.id === requestedTemplate);
        if (!fromQuery || fromQuery.id === selectedProduct.id) return;

        setSelectedProduct(fromQuery);
        setSelectedColor(fromQuery.defaultColorHex);
        setSelectedView(fromQuery.views.find(v => v.id === fromQuery.defaultViewId) || fromQuery.views[0]);
        setViewStates({});
    }, [requestedTemplate, selectedProduct.id]);

    // Handle Image Upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result as string;
            if (data) addImage(data);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // Handle Export
    const handleExport = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 3
        });
        const link = document.createElement('a');
        link.download = `printora-design-${selectedView.id}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Get the right mockup component
    const renderMockup = () => {
        const props = {
            selectedView,
            selectedColor,
            printArea,
            canvasRef,
        };
        switch (selectedProduct.id) {
            case 'premium-hoodie': return <HoodieMockup {...props} />;
            case 'crewneck-sweater': return <SweaterMockup {...props} />;
            case 'classic-cap': return <HatMockup {...props} />;
            default: return <TshirtMockup {...props} />;
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-[#0e0e10] text-gray-100 overflow-hidden">

            {/* ═══════════ LEFT PANEL: Tools ═══════════ */}
            <div className="w-[280px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#141416]">
                
                {/* Product name header */}
                <div className="px-5 py-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-0.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">Designing</span>
                    </div>
                    <h2 className="text-[15px] font-bold text-white truncate">{selectedProduct.name}</h2>
                    <p className="text-[11px] text-gray-500 mt-0.5">{selectedProduct.description}</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b border-white/[0.06]">
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors relative ${
                            activeTab === 'design' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        Design
                        {activeTab === 'design' && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-400 rounded-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('colors')}
                        className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors relative ${
                            activeTab === 'colors' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        Colors
                        {activeTab === 'colors' && <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-400 rounded-full" />}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {activeTab === 'design' ? (
                        <>
                            {/* Add Elements */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-3 block">Add Elements</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => addText()}
                                        className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
                                    >
                                        <Type className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                                        <span className="text-[11px] font-medium text-gray-400 group-hover:text-emerald-400 transition-colors">Add Text</span>
                                    </button>
                                    <div className="relative">
                                        <button className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group w-full">
                                            <ImageIcon className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                                            <span className="text-[11px] font-medium text-gray-400 group-hover:text-emerald-400 transition-colors">Upload</span>
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/svg+xml, image/png, image/jpeg"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Layer Controls — appears when an object is selected */}
                            {activeObject && (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5" /> Selected Item
                                    </label>

                                    <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-3 space-y-3">
                                        {/* Text-specific controls */}
                                        {activeObject.type === 'i-text' && (
                                            <>
                                                <div>
                                                    <label className="text-[10px] font-medium text-gray-500 mb-1 block">Font</label>
                                                    <select
                                                        className="w-full h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] px-2.5 text-[12px] text-gray-200 focus:outline-none focus:border-emerald-500/40"
                                                        value={(activeObject as any).fontFamily || 'sans-serif'}
                                                        onChange={(e) => updateActiveObject({ fontFamily: e.target.value })}
                                                    >
                                                        <option value="sans-serif">Sans Serif</option>
                                                        <option value="serif">Serif</option>
                                                        <option value="monospace">Monospace</option>
                                                        <option value="Arial">Arial</option>
                                                        <option value="Impact">Impact</option>
                                                        <option value="Georgia">Georgia</option>
                                                    </select>
                                                </div>

                                                <div className="flex gap-2">
                                                    <div className="flex-1">
                                                        <label className="text-[10px] font-medium text-gray-500 mb-1 block">Color</label>
                                                        <div className="flex items-center gap-2 h-8">
                                                            <input
                                                                type="color"
                                                                value={(activeObject as any).fill || '#000000'}
                                                                onChange={(e) => updateActiveObject({ fill: e.target.value })}
                                                                className="h-7 w-10 cursor-pointer border-none bg-transparent rounded"
                                                            />
                                                            <span className="text-[10px] text-gray-500 uppercase font-mono">{(activeObject as any).fill}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button
                                                            className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-all text-xs font-bold ${
                                                                (activeObject as any).fontWeight === 'bold'
                                                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                                                    : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white'
                                                            }`}
                                                            onClick={() => {
                                                                const current = (activeObject as any).fontWeight;
                                                                updateActiveObject({ fontWeight: current === 'bold' ? 'normal' : 'bold' });
                                                            }}
                                                        >
                                                            B
                                                        </button>
                                                        <button
                                                            className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-all text-xs italic ${
                                                                (activeObject as any).fontStyle === 'italic'
                                                                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                                                    : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white'
                                                            }`}
                                                            onClick={() => {
                                                                const current = (activeObject as any).fontStyle;
                                                                updateActiveObject({ fontStyle: current === 'italic' ? 'normal' : 'italic' });
                                                            }}
                                                        >
                                                            I
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Opacity */}
                                        <div>
                                            <label className="text-[10px] font-medium text-gray-500 mb-1 flex justify-between">
                                                <span>Opacity</span>
                                                <span className="text-gray-400">{Math.round((activeObject.opacity || 1) * 100)}%</span>
                                            </label>
                                            <input
                                                type="range"
                                                min="0" max="1" step="0.05"
                                                value={activeObject.opacity || 1}
                                                onChange={(e) => updateActiveObject({ opacity: parseFloat(e.target.value) })}
                                                className="w-full h-1 rounded-full appearance-none bg-white/10 accent-emerald-400
                                                    [&::-webkit-slider-thumb]:appearance-none
                                                    [&::-webkit-slider-thumb]:w-3
                                                    [&::-webkit-slider-thumb]:h-3
                                                    [&::-webkit-slider-thumb]:rounded-full
                                                    [&::-webkit-slider-thumb]:bg-emerald-400
                                                    [&::-webkit-slider-thumb]:shadow-lg
                                                "
                                            />
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-1.5 pt-1">
                                            <button onClick={bringForward} className="flex-1 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-1">
                                                <BringToFront className="w-3 h-3" /> Forward
                                            </button>
                                            <button onClick={sendBackward} className="flex-1 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-1">
                                                <SendToBack className="w-3 h-3" /> Back
                                            </button>
                                            <button onClick={deleteSelected} className="h-8 w-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center justify-center">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!activeObject && (
                                <div className="text-[11px] text-gray-600 text-center py-6 bg-white/[0.02] rounded-xl border border-dashed border-white/[0.06]">
                                    <Move className="w-5 h-5 mx-auto mb-2 text-gray-600" />
                                    Select an element to edit its properties
                                </div>
                            )}
                        </>
                    ) : (
                        /* Colors Tab */
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-3 block">
                                <Palette className="w-3.5 h-3.5 inline mr-1.5" />
                                Garment Color
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {selectedProduct.variants.map(c => (
                                    <button
                                        key={c.id}
                                        title={c.colorName}
                                        className={`group relative aspect-square rounded-xl border-2 transition-all hover:scale-105 ${
                                            selectedColor === c.colorHex 
                                                ? 'border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.25)] scale-105' 
                                                : 'border-white/[0.08] hover:border-white/20'
                                        }`}
                                        style={{ backgroundColor: c.colorHex }}
                                        onClick={() => setSelectedColor(c.colorHex)}
                                    >
                                        {selectedColor === c.colorHex && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-lg" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3 text-center">
                                <span className="text-[11px] text-gray-500">
                                    {selectedProduct.variants.find(v => v.colorHex === selectedColor)?.colorName || 'Custom'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-white/[0.06] space-y-2">
                    <button 
                        onClick={handleExport}
                        className="w-full h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] font-medium text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2"
                    >
                        <Download className="w-3.5 h-3.5" /> Export Design
                    </button>
                    <button className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white text-[12px] font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                        <ShoppingCart className="w-4 h-4" /> Save & Continue
                    </button>
                </div>
            </div>

            {/* ═══════════ CENTER: Canvas ═══════════ */}
            <div className="flex-1 flex flex-col relative overflow-hidden">

                {/* Canvas Area */}
                <div className="flex-1 flex items-center justify-center relative">
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }} />

                    {/* Glow behind mockup */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[280px] h-[280px] rounded-full blur-[80px] opacity-20"
                            style={{ backgroundColor: selectedColor === '#ffffff' || selectedColor === '#fff' ? '#555' : selectedColor }}
                        />
                    </div>

                    {/* Navigation arrows */}
                    <button 
                        onClick={() => navigateView('prev')}
                        className="absolute left-4 z-40 w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => navigateView('next')}
                        className="absolute right-4 z-40 w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Mockup */}
                    <div className="relative z-10">
                        {renderMockup()}
                    </div>
                </div>

                {/* Bottom: View Pills */}
                <div className="flex-shrink-0 pb-4 pt-2 flex items-center justify-center gap-2 z-30">
                    {selectedProduct.views.map(view => (
                        <button
                            key={view.id}
                            onClick={() => handleViewChange(view.id)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                                selectedView.id === view.id
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-white/[0.04] text-gray-500 border border-white/[0.06] hover:text-gray-300 hover:bg-white/[0.08]'
                            }`}
                        >
                            {view.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
