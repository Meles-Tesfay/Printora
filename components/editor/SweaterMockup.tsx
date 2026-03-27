import React from 'react';
import { ProductView, PrintArea } from '@/types/editor';

interface SweaterMockupProps {
    selectedView: ProductView;
    selectedColor: string;
    printArea: PrintArea;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const INK = '#222222';
const SW = '1.2';

// --- FRONT (from Figma SVG: sweate front.svg) ---
function FrontSweater({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 272 335" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ display: 'block' }}>
            <path d={`
                M100.5,0.5 C98.5,1 96.5,1 86.5,9
                C39.517,27 26.017,55 26.017,66
                C26.017,67.5 -18.483,296 10.017,305.5
                L10.017,330.5 L10,332.5
                C51,335.5 47.517,331.5 52.017,332.5
                L56.017,321 C54.517,330 52.017,330.864 52.017,332.5
                L218.5,332.627
                C223.107,331.859 219.524,334.931 261.5,332.627
                L261.5,330.5
                C261.5,339.694 261.81,317.49 261.81,305.331
                C290.83,295.838 245.518,67.499 244.5,65.5
                C245.5,55.404 231.557,27.161 182.5,8.5
                C180,3.5 174,4 171.5,0.5
                C167.5,0.5 140,8.5 100.5,0.5
                Z
            `} fill={color} stroke="none" />

            <g fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
                <path d="M182.5 8.5C231.557 27.1609 245.5 55.4043 245.5 66.5" />
                <path d="M244.5 65.5C245.518 67.4986 290.83 295.838 261.81 305.331C261.81 317.49 261.5 339.694 261.5 330.5" />
                <path d="M100 1C100 25 159.5 37 171.5 1" />
                <path d="M87.5 8.5C97 49 176.5 45 183 8.5" />
                <path d="M100.5 0.5C140 8.5 167.5 0.5 171.5 0.5" />
                <path d="M183.5 9C180 3.5 174 4 171.5 0.5" />
                <path d="M86.5 8.99999C96.5 0.999998 98.5 0.999997 100.5 0.999992" />
                <path d="M261.5 332.627C219.524 334.931 223.107 331.859 218.5 332.627" />
                <path d="M214.5 321.5C216 330.109 218.5 330.935 218.5 332.5" />
                <path d="M262.5 305.771C252.287 305.771 236.457 310.686 217.053 305.771M214.5 321.5C217.053 303.314 219.096 299.873 217.053 292.5" />
                <path d="M216.5 292.5C221.562 288.371 224.375 281.145 225.5 276.5" />
                <path d="M222.5 63.5C222.5 110 227.187 277.5 224.844 277.5" />
                <path d="M223.5 119.5C226.573 107 239.89 72.5 244.5 65.5" />
                <path d="M55.5 318.5C94 329 197.5 324.5 212 318.5" />
                <path d="M54.5 293.5C69 304 209 297 218.5 297" />
                <path d="M87.0166 8.5C39.5165 27 26.0166 55 26.0166 66" />
                <path d="M27.0166 65.5C26.0166 67.5 -18.4834 296 10.0166 305.5C10.0166 317.667 10.0166 339.7 10.0166 330.5" />
                <path d="M10 332.5C51 335.5 47.5166 331.5 52.0166 332.5" />
                <path d="M56.0166 321C54.5166 330 52.0166 330.864 52.0166 332.5" />
                <path d="M9.0166 305.5C19.0166 305.5 34.5166 310.5 53.5166 305.5M56.0166 321.5C53.5166 303 51.5166 299.5 53.5166 292" />
                <path d="M53.5166 292C49.0166 288 46.5166 281 45.5166 276.5" />
                <path d="M48.0166 63.5C48.0166 110 43.0166 277.5 45.5166 277.5" />
                <path d="M47.0166 119.5C44.0166 107 31.0166 72.5 26.5166 65.5" />
                <path d="M116.5 20H154.5" />
                <line x1="105.5" y1="14" x2="163.5" y2="14" />
            </g>
        </svg>
    );
}

// --- BACK (from Figma SVG: sweaterr back.svg) ---
function BackSweater({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 273 335" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ display: 'block' }}>
            <path d={`
                M99,0.908 C124.5,8.908 169.5,2.908 171.5,0.908
                L183.248,8.34 L182.5,7.908
                C231.557,26.569 245.5,54.812 245.5,65.908
                C246.518,67.407 290.83,292.246 261.81,301.739
                L261.81,330.408 L261.5,332.035
                C219.524,334.339 223.107,331.267 218.5,332.035
                L214.5,320.908 C216,329.517 218.5,330.343 218.5,331.908
                L52.017,332.908
                C47.517,331.908 51.017,335.908 10.017,332.908
                L10,330.908 C10,340.108 10.017,318.075 10.017,305.908
                C-18.483,296.408 26.017,67.908 27.017,65.908
                C26.017,55.408 39.517,27.408 87.017,8.908
                L87,8.408 C100.5,27.908 180.5,19.908 183,8.408
                L98.5,0.908
                Z
            `} fill={color} stroke="none" />

            <g fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
                <path d="M87.0166 8.90801C39.5165 27.408 26.0166 55.408 26.0166 66.408" />
                <path d="M27.0166 65.908C26.0166 67.908 -18.4834 296.408 10.0166 305.908C10.0166 318.075 10 340.108 10 330.908" />
                <path d="M10.0166 332.908C51.0166 335.908 47.5166 331.908 52.0166 332.908" />
                <path d="M56.0166 321.408C54.5166 330.408 52.0166 331.272 52.0166 332.908" />
                <path d="M9.0166 305.908C19.0166 305.908 34.5166 310.908 53.5166 305.908M56.0166 321.908C53.5166 303.408 51.5166 299.908 53.5166 292.408" />
                <path d="M53.5166 292.408C49.0166 288.408 46.5166 281.408 45.5166 276.908" />
                <path d="M48.0166 63.908C48.0166 110.408 43.0166 277.908 45.5166 277.908" />
                <path d="M47.0166 119.908C44.0166 107.408 31.0166 72.908 26.5166 65.908" />
                <path d="M182.5 7.90801C231.557 26.5689 245.5 54.8124 245.5 65.908" />
                <path d="M245.5 65.408C246.518 67.4066 290.83 292.246 261.81 301.739C261.81 313.898 261.81 339.602 261.81 330.408" />
                <path d="M261.5 332.035C219.524 334.339 223.107 331.267 218.5 332.035" />
                <path d="M214.5 320.908C216 329.517 218.5 330.343 218.5 331.908" />
                <path d="M261.5 305.179C251.287 305.179 236.457 310.094 217.053 305.179M214.5 320.908C217.053 302.722 219.096 299.281 217.053 291.908" />
                <path d="M216.5 291.908C221.562 287.779 224.375 280.553 225.5 275.908" />
                <path d="M222.5 62.908C222.5 109.408 227.187 276.908 224.844 276.908" />
                <path d="M224.5 118.908C227.573 106.408 240.89 71.908 245.5 64.908" />
                <path d="M56 322.207C94.869 333.876 199.361 328.875 214 322.207" />
                <path d="M54.5 296.908C69 307.408 209 300.408 218.5 300.408" />
                {/* Back collar */}
                <path d="M87 8.40801C100.5 27.908 180.5 19.908 183 8.40801" />
                <path d="M87 8.90801L99 0.408013" />
                <line x1="183.248" y1="8.3399" x2="171.248" y2="1.3399" />
                <path d="M98.5 0.908012C124.5 8.90801 169.5 2.90801 171.5 0.908012" />
            </g>
        </svg>
    );
}

// --- LEFT SIDE (from Figma SVG: sweater left side.svg) ---
function LeftSideSweater({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 145 372" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ display: 'block' }}>
            <path d={`
                M106.5,0.49 C74.283,7.025 54.558,33.818 35.49,28.59
                C7.875,120.731 -2.645,43.62 1.3,347.49
                C27.469,367.722 120.217,360.559 143.24,352.095
                C112.982,77.322 184.68,137.225 106.404,0.49 Z
            `} fill={color} stroke="none" />

            <g fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
                <path d="M1.30053 347.49C-2.64455 43.62 7.87543 120.731 35.4904 28.5898C54.5579 33.8177 74.2827 7.02486 106.5 0.490021" />
                <path d="M0.50012 346.886C27.4694 367.722 120.217 360.559 143.24 352.095C112.982 77.3222 184.68 137.225 106.404 0.490021M32.0739 38.255C68.2521 41.5106 85.2499 6.3501 112.219 9.6057" />
                <path d="M45.6057 161.49C4.38465 37.9786 134.032 -31.2922 129.378 161.49" />
                <path d="M0.50012 340.49C41.2594 359.273 135.926 349.255 142.5 344.873" />
                <path d="M45.5001 161.49L60.4023 356.99M129.5 161.49L107.16 356.99M107.16 356.99L105.503 371.49H61.5075L60.4023 356.99M107.16 356.99C92.7816 353.99 62.7295 354.99 60.4023 356.99" />
            </g>
        </svg>
    );
}

// --- RIGHT SIDE (from Figma SVG: sweater right side.svg) ---
function RightSideSweater({ color }: { color: string }) {
    return (
        <svg viewBox="0 0 145 372" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" style={{ display: 'block' }}>
            <path d={`
                M38.5,0.49 C70.717,7.025 90.442,33.818 109.51,28.59
                C137.125,120.731 147.645,43.62 143.7,347.49
                C117.531,367.722 24.783,360.559 1.76,352.095
                C32.019,77.322 -39.68,137.225 38.596,0.49 Z
            `} fill={color} stroke="none" />

            <g fill="none" stroke={INK} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
                <path d="M143.7 347.49C147.645 43.62 137.125 120.731 109.51 28.5898C90.4422 33.8177 70.7174 7.02486 38.5 0.490021" />
                <path d="M144.5 346.886C117.531 367.722 24.7829 360.559 1.76035 352.095C32.0185 77.3222 -39.6802 137.225 38.5964 0.490021M112.926 38.255C76.748 41.5106 59.7503 6.3501 32.781 9.6057" />
                <path d="M99.3944 161.49C140.615 37.9786 10.9686 -31.2922 15.6226 161.49" />
                <path d="M144.5 340.49C103.741 359.273 9.07408 349.255 2.50001 344.873" />
                <path d="M99.1086 161.267L84.2952 356.767M15.6086 161.267L37.8161 356.767M37.8161 356.767L39.4632 371.267H83.1965L84.2952 356.767M37.8161 356.767C52.1086 353.767 81.9818 354.767 84.2952 356.767" />
            </g>
        </svg>
    );
}

export default function SweaterMockup({ selectedView, selectedColor, printArea, canvasRef }: SweaterMockupProps) {
    const getViewComponent = () => {
        switch (selectedView.id) {
            case 'back': return <BackSweater color={selectedColor} />;
            case 'left-side': return <LeftSideSweater color={selectedColor} />;
            case 'right-side': return <RightSideSweater color={selectedColor} />;
            default: return <FrontSweater color={selectedColor} />;
        }
    };

    return (
        <div className="relative flex-shrink-0" style={{ width: 500, height: 540 }}>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 0 }}>
                <div className="w-[85%] h-[85%]">
                    {getViewComponent()}
                </div>
            </div>

            <div className="absolute inset-0 z-20 outline-none focus:outline-none">
                <canvas ref={canvasRef} className="outline-none" />
            </div>

            <div 
                className="absolute border border-dashed border-gray-400/40 pointer-events-none z-30 flex items-center justify-center text-[10px] text-black/15 uppercase tracking-widest font-medium"
                style={{
                    left: printArea?.left ?? 170,
                    top: printArea?.top ?? 150,
                    width: printArea?.width ?? 160,
                    height: printArea?.height ?? 200
                }}
            >
                PRINT AREA
            </div>
        </div>
    );
}
