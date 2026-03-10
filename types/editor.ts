export interface PrintArea {
    id: string; // e.g., 'front-center', 'left-pocket'
    width: number; // Width of the printable area in pixels (relative to the mockup image size or a standard coordinate system)
    height: number;
    top: number; // Offset from the top of the mockup image
    left: number; // Offset from the left of the mockup image
    radius?: number; // Optional border radius for areas like mugs or specific pockets
}

export interface ProductView {
    id: string; // e.g., 'front', 'back', 'left-sleeve'
    name: string; // e.g., 'Front', 'Back'
    mockupUrl: string; // URL to the transparent PNG mockup (with shading/highlights) for this view
    printAreas: PrintArea[];
}

export interface ProductVariant {
    id: string;
    colorHex: string;
    colorName: string;
}

export interface ProductTemplate {
    id: string; // e.g., 'classic-tshirt', 'hoodie'
    name: string;
    description: string;
    category: string;
    views: ProductView[];
    variants: ProductVariant[];
    defaultViewId: string;
    defaultColorHex: string;
}

export interface CanvasDesignState {
    objects: any[]; // Fabric.js objects
    background?: string;
}

export interface ProductDesignState {
    productId: string;
    colorHex: string;
    viewStates: Record<string, CanvasDesignState>; // Keyed by view.id (e.g., 'front': { objects: [] })
}
