import { ProductTemplate } from '@/types/editor';

// This acts as a mock database of products available in Printora Studio
export const PRODUCT_TEMPLATES: ProductTemplate[] = [
    {
        id: 'classic-tshirt',
        name: 'Classic Unisex T-Shirt',
        description: 'A comfortable, classic fit t-shirt.',
        category: 't-shirts',
        defaultViewId: 'front',
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
                id: 'front',
                name: 'Front',
                // In a real app, this would point to a high-res transparent PNG with shading
                mockupUrl: '/images/products/tshirt/front.png',
                printAreas: [
                    {
                        id: 'front-center',
                        width: 200,   // px relative to 500x600 mockup
                        height: 300,
                        left: 150,    // (500-200)/2
                        top: 150
                    }
                ]
            },
            {
                id: 'back',
                name: 'Back',
                mockupUrl: '/images/products/tshirt/back.png',
                printAreas: [
                    {
                        id: 'back-center',
                        width: 200,
                        height: 300,
                        left: 150,
                        top: 150
                    }
                ]
            },
            {
                id: 'left-sleeve',
                name: 'Left Sleeve',
                mockupUrl: '/images/products/tshirt/left-sleeve.png',
                printAreas: [
                    {
                        id: 'left-sleeve-area',
                        width: 80,
                        height: 100,
                        left: 360,
                        top: 180
                    }
                ]
            },
            {
                id: 'right-sleeve',
                name: 'Right Sleeve',
                mockupUrl: '/images/products/tshirt/right-sleeve.png',
                printAreas: [
                    {
                        id: 'right-sleeve-area',
                        width: 80,
                        height: 100,
                        left: 60,
                        top: 180
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
