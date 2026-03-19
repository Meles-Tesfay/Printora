import React from 'react';
import { ProductView, PrintArea } from '@/types/editor';

interface TshirtMockupProps {
    selectedView: ProductView;
    selectedColor: string;
    printArea: PrintArea;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const INK = '#111111';
const MAIN_W = 2.0;
const SEAM_W = 1.0;
const DASH_W = 0.8;

function FrontShirt({ color }: { color: string }) {
    // Exact oversized flat silhouette matching the new reference image
    const silhouette = `
      M 190,75
      Q 250,60 310,75
      L 420,130
      L 475,260
      L 405,290
      L 405,500
      L 95,500
      L 95,290
      L 25,260
      L 80,130
      Z
    `;

    return (
        <svg viewBox="0 0 500 540" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ display: 'block' }}>
            {/* Base blocky shape */}
            <path d={silhouette} fill={color} stroke={INK} strokeWidth={MAIN_W} strokeLinejoin="round" strokeLinecap="round" />

            {/* Back collar inner lower seam (visible through front opening) */}
            <path d="M 190,75 Q 250,85 310,75" fill="none" stroke={INK} strokeWidth={SEAM_W} strokeLinecap="round" />

            {/* Front collar upper opening edge -> draws over the base to create the hole effect */}
            <path d="M 190,75 C 190,105 220,123 250,125 C 280,123 310,105 310,75" fill={color} stroke={INK} strokeWidth={SEAM_W} strokeLinejoin="round" />

            {/* Front collar lower seam */}
            <path d="M 183,82 C 183,115 215,138 250,140 C 285,138 317,115 317,82" fill="none" stroke={INK} strokeWidth={SEAM_W} strokeLinecap="round" />

            {/* Left armhole seam */}
            <path d="M 80,130 C 110,170 120,240 95,290" fill="none" stroke={INK} strokeWidth={SEAM_W} strokeLinecap="round" />
            
            {/* Right armhole seam */}
            <path d="M 420,130 C 390,170 380,240 405,290" fill="none" stroke={INK} strokeWidth={SEAM_W} strokeLinecap="round" />

            {/* Bottom hem dashed stitch */}
            <line x1="95" y1="488" x2="405" y2="488" stroke={INK} strokeWidth={DASH_W} strokeDasharray="5,4" strokeLinecap="round" />
            
            {/* Left cuff dashed stitch */}
            <line x1="33" y1="255" x2="98" y2="282" stroke={INK} strokeWidth={DASH_W} strokeDasharray="4,3" strokeLinecap="round" />
            
            {/* Right cuff dashed stitch */}
            <line x1="467" y1="255" x2="402" y2="282" stroke={INK} strokeWidth={DASH_W} strokeDasharray="4,3" strokeLinecap="round" />
            
            {/* Creases / wrinkles - delicate detail lines */}
            {/* Left body armpit crease */}
            <path d="M 97,295 C 105,305 105,320 98,335" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
            {/* Right body armpit crease */}
            <path d="M 403,295 C 395,305 395,320 402,335" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
            
            {/* Left sleeve crease */}
            <path d="M 70,165 C 68,185 60,225 50,240" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
            <path d="M 83,180 C 80,195 72,220 65,230" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
            
            {/* Right sleeve crease */}
            <path d="M 430,165 C 432,185 440,225 450,240" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
            <path d="M 417,180 C 420,195 428,220 435,230" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
        </svg>
    );
}

function BackShirt({ color }: { color: string }) {
    // Back view silhouette has the collar top curving downwards.
    const silhouette = `
      M 190,75
      Q 250,90 310,75
      L 420,130
      L 475,260
      L 405,290
      L 405,500
      L 95,500
      L 95,290
      L 25,260
      L 80,130
      Z
    `;

    return (
        <svg viewBox="0 0 500 540" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ display: 'block' }}>
            <path d={silhouette} fill={color} stroke={INK} strokeWidth={MAIN_W} strokeLinejoin="round" strokeLinecap="round" />

            {/* Back collar inner seam */}
            <path d="M 188,78 Q 250,105 312,78" fill="none" stroke={INK} strokeWidth={SEAM_W} strokeLinecap="round" />

            {/* Left armhole seam */}
            <path d="M 80,130 C 110,170 120,240 95,290" fill="none" stroke={INK} strokeWidth={SEAM_W} strokeLinecap="round" />
            
            {/* Right armhole seam */}
            <path d="M 420,130 C 390,170 380,240 405,290" fill="none" stroke={INK} strokeWidth={SEAM_W} strokeLinecap="round" />

            {/* Bottom hem dashed stitch */}
            <line x1="95" y1="488" x2="405" y2="488" stroke={INK} strokeWidth={DASH_W} strokeDasharray="5,4" strokeLinecap="round" />
            
            {/* Left cuff dashed stitch */}
            <line x1="33" y1="255" x2="98" y2="282" stroke={INK} strokeWidth={DASH_W} strokeDasharray="4,3" strokeLinecap="round" />
            
            {/* Right cuff dashed stitch */}
            <line x1="467" y1="255" x2="402" y2="282" stroke={INK} strokeWidth={DASH_W} strokeDasharray="4,3" strokeLinecap="round" />
            
            {/* Creases / wrinkles - delicate detail lines */}
            <path d="M 97,295 C 105,305 105,320 98,335" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
            <path d="M 403,295 C 395,305 395,320 402,335" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
            <path d="M 70,165 C 68,185 60,225 50,240" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
            <path d="M 430,165 C 432,185 440,225 450,240" fill="none" stroke={INK} strokeWidth={DASH_W} strokeLinecap="round" />
        </svg>
    );
}

function NeckLabelView({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 500 540" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ display: 'block' }}>
            <rect x="8" y="126" width="484" height="406" rx="4" fill={color} stroke={INK} strokeWidth={MAIN_W} />
            <path d="M 8,126 Q 250,26 492,126" fill="#111111" stroke={INK} strokeWidth={MAIN_W} strokeLinecap="round" />
            <path d="M 44,142 Q 250,54 456,142" fill="none" stroke="#555" strokeWidth={SEAM_W} strokeLinecap="round" />
        </svg>
    );
}

export default function TshirtMockup({
    selectedView,
    selectedColor,
    printArea,
    canvasRef,
}: TshirtMockupProps) {
    return (
        <div className="relative flex-shrink-0" style={{ width: 500, height: 540 }}>
            {/* Shirt SVG background */}
            <div className="absolute inset-0" style={{ zIndex: 0 }}>
                {selectedView.id === 'neck-label' ? (
                    <NeckLabelView color={selectedColor} />
                ) : selectedView.id === 'back-side' ? (
                    <BackShirt color={selectedColor} />
                ) : (
                    <FrontShirt color={selectedColor} />
                )}
            </div>

            {/* Fabric.js canvas – positioned over print area */}
            <div
                className="absolute outline-none focus:outline-none"
                style={{
                    left:   printArea?.left   ?? 145,
                    top:    printArea?.top    ?? 200,
                    width:  printArea?.width  ?? 210,
                    height: printArea?.height ?? 248,
                    zIndex: 20,
                }}
            >
                <canvas ref={canvasRef} className="outline-none" />
            </div>
        </div>
    );
}
