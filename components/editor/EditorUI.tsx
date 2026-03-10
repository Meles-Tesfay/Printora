"use client";

import React, { useState, useEffect } from 'react';
import { PRODUCT_TEMPLATES } from '@/lib/editor-constants';
import { useEditorCanvas } from '@/hooks/useEditorCanvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Image as ImageIcon,
    Type,
    Trash2,
    ShoppingCart,
    BringToFront,
    SendToBack,
    Download,
    Layers
} from 'lucide-react';
import { ProductTemplate, ProductView, CanvasDesignState } from '@/types/editor';

export default function EditorUI() {
    const [selectedProduct, setSelectedProduct] = useState<ProductTemplate>(PRODUCT_TEMPLATES[0]);
    const [selectedColor, setSelectedColor] = useState<string>(PRODUCT_TEMPLATES[0].defaultColorHex);
    const [selectedView, setSelectedView] = useState<ProductView>(PRODUCT_TEMPLATES[0].views.find(v => v.id === PRODUCT_TEMPLATES[0].defaultViewId) || PRODUCT_TEMPLATES[0].views[0]);

    // Store canvas state per view internally if needed, normally would be complex. 
    // For MVP we just keep the active canvas, switching views clears/loads from a state map.
    const [viewStates, setViewStates] = useState<Record<string, CanvasDesignState>>({});
    const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

    const printArea = selectedView.printAreas[0]; // Assuming 1 print area per view for simplicity

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
        onSelectionChange: setActiveObject,
        initialState: viewStates[selectedView.id]
    });

    // Handle View Change
    const handleViewChange = (viewId: string) => {
        // Save current canvas state before switching
        if (canvas) {
            setViewStates(prev => ({
                ...prev,
                [selectedView.id]: { objects: canvas.toJSON().objects }
            }));
        }

        const newView = selectedProduct.views.find(v => v.id === viewId);
        if (newView) setSelectedView(newView);
    };

    // Handle Product Change
    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prodId = e.target.value;
        const newProd = PRODUCT_TEMPLATES.find(p => p.id === prodId);
        if (newProd) {
            setSelectedProduct(newProd);
            setSelectedColor(newProd.defaultColorHex);
            setSelectedView(newView => newProd.views.find(v => v.id === newProd.defaultViewId) || newProd.views[0]);
            setViewStates({}); // Reset states on new product
        }
    };

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
            multiplier: 3 // High-res export
        });

        // Trigger download
        const link = document.createElement('a');
        link.download = `printora-design-${selectedView.id}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-8rem)] max-w-screen-2xl mx-auto">

            {/* LEFT PANEL: Elements & Products */}
            <Card className="w-full xl:w-72 flex-shrink-0 flex flex-col h-full border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50 border-b pb-4 shrink-0">
                    <CardTitle className="text-lg">Design Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 flex-1 overflow-y-auto">

                    {/* Product Selection */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background"
                            value={selectedProduct.id}
                            onChange={handleProductChange}
                        >
                            {PRODUCT_TEMPLATES.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full h-px bg-gray-100" />

                    {/* Add Elements */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add Elements</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={() => addText()} className="flex flex-col gap-2 items-center h-20 bg-white hover:bg-green-50 hover:text-primary hover:border-green-200 transition-colors">
                                <Type className="w-6 h-6" />
                                <span className="text-xs">Text</span>
                            </Button>
                            <div className="relative">
                                <Button variant="outline" className="flex flex-col gap-2 items-center h-20 w-full bg-white hover:bg-green-50 hover:text-primary hover:border-green-200 transition-colors">
                                    <ImageIcon className="w-6 h-6" />
                                    <span className="text-xs">Upload</span>
                                </Button>
                                <input
                                    type="file"
                                    accept="image/svg+xml, image/png, image/jpeg"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    </div>

                </CardContent>
            </Card>

            {/* CENTER PANEL: Canvas Area */}
            <div className="flex-1 bg-gray-100 rounded-xl shadow-inner border border-gray-200 flex flex-col items-center relative overflow-hidden h-full">

                {/* View Tabs */}
                <div className="absolute top-4 z-20">
                    <Tabs value={selectedView.id} onValueChange={handleViewChange} className="w-auto bg-white rounded-lg shadow-sm p-1">
                        <TabsList className="h-10">
                            {selectedProduct.views.map(view => (
                                <TabsTrigger key={view.id} value={view.id} className="min-w-[80px]">
                                    {view.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Editor Surface */}
                <div className="relative w-full h-full flex items-center justify-center p-8 transition-all">

                    {/* The physical product dimensions (mocked to 500x600 for typical apparel, or scaled dynamically based on mockupUrl in reality) */}
                    <div className="relative w-[500px] h-[600px] shadow-sm rounded-md overflow-hidden bg-white/50 backdrop-blur"
                        style={{
                            // If product is a t-shirt/hoodie, we can tint the background. 
                            // If it's a mug, it might be white. We use selectedColor.
                            backgroundColor: selectedProduct.category === 'accessories' ? '#f8fafc' : selectedColor
                        }}
                    >

                        {/* 1. Mockup Layer (Shading & Overlays) */}
                        {/* We use an img tag pointing to a generic transparent product mockup here */}
                        <div
                            className="absolute inset-0 z-0 pointer-events-none opacity-90 mix-blend-multiply flex items-center justify-center"
                        >
                            {/* Temporary SVG placeholder taking the place of mockupUrl since we don't have images yet */}
                            <svg viewBox="0 0 500 600" fill="currentColor" stroke="rgba(0,0,0,0.1)" strokeWidth="2" className="w-[80%] h-[80%] text-white">
                                <path d="M 150 40 Q 250 100 350 40 L 480 120 L 440 240 L 400 220 L 400 580 L 100 580 L 100 220 L 60 240 L 20 120 Z" />
                            </svg>
                        </div>

                        {/* 2. Print Area Boundary Box (Visual) */}
                        <div
                            className="absolute z-10 border-2 border-dashed border-gray-300 pointer-events-none"
                            style={{
                                width: printArea?.width || 200,
                                height: printArea?.height || 300,
                                left: printArea?.left || 150,
                                top: printArea?.top || 150,
                            }}
                        />

                        {/* 3. The Fabric Canvas Layer */}
                        <div
                            className="absolute z-20 outline-none focus:outline-none"
                            style={{
                                width: printArea?.width || 200,
                                height: printArea?.height || 300,
                                left: printArea?.left || 150,
                                top: printArea?.top || 150,
                            }}
                        >
                            <canvas ref={canvasRef} className="outline-none" />
                        </div>

                    </div>

                </div>

                {/* Bottom Zoom/Undo Bar (Placeholder) */}
                <div className="absolute bottom-4 z-20 bg-white/90 backdrop-blur rounded-full shadow-sm px-4 py-2 flex items-center gap-2 border">
                    <span className="text-xs font-semibold text-gray-500">Note: Keep designs within dashed box.</span>
                </div>

            </div>

            {/* RIGHT PANEL: Object Controls & Layers */}
            <Card className="w-full xl:w-80 flex-shrink-0 flex flex-col h-full border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50 border-b pb-4 shrink-0">
                    <CardTitle className="text-lg">Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 flex-1 overflow-y-auto">

                    {/* Garment Color Selection */}
                    <div className="space-y-3">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Garment Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {selectedProduct.variants.map(c => (
                                <button
                                    key={c.id}
                                    title={c.colorName}
                                    className={`w-8 h-8 rounded-full border shadow-sm transition-all hover:scale-110 ${selectedColor === c.colorHex ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-gray-200'}`}
                                    style={{ backgroundColor: c.colorHex }}
                                    onClick={() => setSelectedColor(c.colorHex)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-100" />

                    {/* Active Object Controls */}
                    <div className="space-y-4">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Layer Controls
                        </Label>

                        {!activeObject ? (
                            <div className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                Select an object on the canvas to view properties.
                            </div>
                        ) : (
                            <div className="space-y-4">

                                {/* Object Type Specific Controls: Text */}
                                {activeObject.type === 'i-text' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Font Family</Label>
                                            <select
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
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

                                        <div className="space-y-2">
                                            <Label className="text-xs">Text Color</Label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={(activeObject as any).fill || '#000000'}
                                                    onChange={(e) => updateActiveObject({ fill: e.target.value })}
                                                    className="h-8 w-12 cursor-pointer border-none bg-transparent"
                                                />
                                                <span className="text-xs text-gray-500 uppercase">{(activeObject as any).fill}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={`flex-1 ${(activeObject as any).fontWeight === 'bold' ? 'bg-gray-100 border-gray-400' : ''}`}
                                                onClick={() => {
                                                    const current = (activeObject as any).fontWeight;
                                                    updateActiveObject({ fontWeight: current === 'bold' ? 'normal' : 'bold' });
                                                }}
                                            >
                                                <b>B</b>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={`flex-1 ${(activeObject as any).fontStyle === 'italic' ? 'bg-gray-100 border-gray-400' : ''}`}
                                                onClick={() => {
                                                    const current = (activeObject as any).fontStyle;
                                                    updateActiveObject({ fontStyle: current === 'italic' ? 'normal' : 'italic' });
                                                }}
                                            >
                                                <i>I</i>
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Opacity Control (All objects) */}
                                <div className="space-y-2">
                                    <Label className="text-xs flex justify-between">
                                        <span>Opacity</span>
                                        <span>{Math.round((activeObject.opacity || 1) * 100)}%</span>
                                    </Label>
                                    <input
                                        type="range"
                                        min="0" max="1" step="0.05"
                                        value={activeObject.opacity || 1}
                                        onChange={(e) => updateActiveObject({ opacity: parseFloat(e.target.value) })}
                                        className="w-full accent-primary"
                                    />
                                </div>

                                <div className="w-full h-px bg-gray-100" />

                                {/* Stack Order & Delete */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" size="sm" onClick={bringForward} className="flex gap-1 text-xs h-9">
                                        <BringToFront className="w-3 h-3" /> Forward
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={sendBackward} className="flex gap-1 text-xs h-9">
                                        <SendToBack className="w-3 h-3" /> Back
                                    </Button>
                                </div>
                                <Button variant="destructive" size="sm" onClick={deleteSelected} className="w-full flex gap-2 h-9 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
                                    <Trash2 className="w-4 h-4" /> Delete Item
                                </Button>
                            </div>
                        )}
                    </div>

                </CardContent>

                {/* Checkout & Export fixed to bottom */}
                <div className="p-4 border-t bg-gray-50 mt-auto flex flex-col gap-3">
                    <Button variant="outline" onClick={handleExport} className="w-full flex gap-2 h-10 bg-white shadow-sm border-gray-300 text-gray-700 hover:bg-gray-50">
                        <Download className="w-4 h-4" /> Download Mockup
                    </Button>
                    <Button className="w-full flex gap-2 items-center h-12 bg-primary hover:bg-primary/90 text-white shadow-md text-md font-bold">
                        <ShoppingCart className="w-5 h-5" /> Save & Continue
                    </Button>
                </div>
            </Card>

        </div>
    );
}
