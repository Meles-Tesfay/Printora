import { ProductTemplate } from '@/types/editor';

// This acts as a mock database of products available in Printora Studio
export const PRODUCT_TEMPLATES: ProductTemplate[] = [
    {
        id: 'classic-tshirt',
        name: 'Classic Unisex T-Shirt',
        description: 'A comfortable, classic fit t-shirt.',
        category: 't-shirts',
        defaultViewId: 'front-side',
        defaultColorHex: '#ffffff',
        variants: [
            { id: 'white', colorHex: '#ffffff', colorName: 'White' },
            { id: 'black', colorHex: '#0f172a', colorName: 'Black' },
            { id: 'green', colorHex: '#16a34a', colorName: 'AMU Green' },
            { id: 'red', colorHex: '#ef4444', colorName: 'Red' },
            { id: 'yellow', colorHex: '#fcd34d', colorName: 'Yellow' }
        ],
        views: [
            {
                id: 'front-side',
                name: 'Front side',
                mockupUrl: '/images/products/tshirt/front.png',
                printAreas: [
                    {
                        // Centered in shirt body: body x=118–382 (w=264), body y=182–518
                        // Print area: 210 wide → left=(500-210)/2=145, top=200, height=248
                        id: 'front-center',
                        width: 210,
                        height: 248,
                        left: 145,
                        top: 200
                    }
                ]
            },
            {
                id: 'back-side',
                name: 'Back side',
                mockupUrl: '/images/products/tshirt/back.png',
                printAreas: [
                    {
                        // Back: same body but print area starts higher (no collar), y=148
                        id: 'back-center',
                        width: 210,
                        height: 255,
                        left: 145,
                        top: 148
                    }
                ]
            },
            {
                id: 'neck-label',
                name: 'Neck label inner',
                mockupUrl: '/images/products/tshirt/neck-label.png',
                printAreas: [
                    {
                        // Centered below the collar band arc (which ends at ~y=152)
                        id: 'neck-label-area',
                        width: 168,
                        height: 148,
                        left: 166,
                        top: 186
                    }
                ]
            }
        ]
    },
    {
        id: 'premium-hoodie',
        name: 'Premium Pullover Hoodie',
        description: 'Cozy and warm pullover hoodie.',
        category: 'hoodies',
        defaultViewId: 'front',
        defaultColorHex: '#0f172a',
        variants: [
            { id: 'white', colorHex: '#ffffff', colorName: 'White' },
            { id: 'black', colorHex: '#0f172a', colorName: 'Black' },
            { id: 'grey', colorHex: '#94a3b8', colorName: 'Athletic Heather' }
        ],
        views: [
            {
                id: 'front',
                name: 'Front',
                mockupUrl: '/images/products/hoodie/front.png',
                printAreas: [
                    {
                        id: 'front-center',
                        width: 220,
                        height: 250, // Shorter than tshirt because of pocket
                        left: 140,
                        top: 160
                    }
                ]
            },
            {
                id: 'back',
                name: 'Back',
                mockupUrl: '/images/products/hoodie/back.png',
                printAreas: [
                    {
                        id: 'back-center',
                        width: 240,
                        height: 340,
                        left: 130,
                        top: 150
                    }
                ]
            }
        ]
    },
    {
        id: 'ceramic-mug',
        name: '11oz Ceramic Mug',
        description: 'Standard coffee mug.',
        category: 'accessories',
        defaultViewId: 'wrap',
        defaultColorHex: '#ffffff',
        variants: [
            { id: 'white', colorHex: '#ffffff', colorName: 'White' }
        ],
        views: [
            {
                id: 'wrap',
                name: 'Full Wrap',
                mockupUrl: '/images/products/mug/wrap.png',
                printAreas: [
                    {
                        id: 'mug-wrap',
                        width: 400,
                        height: 180,
                        left: 50,
                        top: 200
                    }
                ]
            },
            {
                id: 'left',
                name: 'Left Side',
                mockupUrl: '/images/products/mug/left.png',
                printAreas: [
                    {
                        id: 'mug-left',
                        width: 150,
                        height: 180,
                        left: 180,
                        top: 200
                    }
                ]
            },
            {
                id: 'right',
                name: 'Right Side',
                mockupUrl: '/images/products/mug/right.png',
                printAreas: [
                    {
                        id: 'mug-right',
                        width: 150,
                        height: 180,
                        left: 180,
                        top: 200
                    }
                ]
            }
        ]
    }
];
