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
                        id: 'back-center',
                        width: 210,
                        height: 255,
                        left: 145,
                        top: 148
                    }
                ]
            },
            {
                id: 'left-side',
                name: 'Left sleeve',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'left-sleeve',
                        width: 60,
                        height: 140,
                        left: 220,
                        top: 160
                    }
                ]
            },
            {
                id: 'right-side',
                name: 'Right sleeve',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'right-sleeve',
                        width: 60,
                        height: 140,
                        left: 220,
                        top: 160
                    }
                ]
            },
            {
                id: 'neck-label',
                name: 'Neck label inner',
                mockupUrl: '/images/products/tshirt/neck-label.png',
                printAreas: [
                    {
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
            { id: 'grey', colorHex: '#94a3b8', colorName: 'Athletic Heather' },
            { id: 'green', colorHex: '#16a34a', colorName: 'Forest Green' },
            { id: 'navy', colorHex: '#1e3a5f', colorName: 'Navy' }
        ],
        views: [
            {
                id: 'front',
                name: 'Front',
                mockupUrl: '/images/products/hoodie/front.png',
                printAreas: [
                    {
                        id: 'front-center',
                        width: 250,
                        height: 285,
                        left: 125,
                        top: 144
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
                        width: 276,
                        height: 391,
                        left: 112,
                        top: 132
                    }
                ]
            },
            {
                id: 'left-hand',
                name: 'Left sleeve',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'left-sleeve',
                        width: 80,
                        height: 200,
                        left: 210,
                        top: 200
                    }
                ]
            },
            {
                id: 'right-hand',
                name: 'Right sleeve',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'right-sleeve',
                        width: 80,
                        height: 200,
                        left: 210,
                        top: 200
                    }
                ]
            }
        ]
    },
    {
        id: 'crewneck-sweater',
        name: 'Crewneck Sweater',
        description: 'Classic crewneck sweatshirt for all seasons.',
        category: 'long-sleeves',
        defaultViewId: 'front',
        defaultColorHex: '#ffffff',
        variants: [
            { id: 'white', colorHex: '#ffffff', colorName: 'White' },
            { id: 'black', colorHex: '#0f172a', colorName: 'Black' },
            { id: 'grey', colorHex: '#94a3b8', colorName: 'Grey Heather' },
            { id: 'green', colorHex: '#16a34a', colorName: 'Forest Green' },
            { id: 'burgundy', colorHex: '#7f1d1d', colorName: 'Burgundy' }
        ],
        views: [
            {
                id: 'front',
                name: 'Front',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'front-center',
                        width: 160,
                        height: 200,
                        left: 170,
                        top: 150
                    }
                ]
            },
            {
                id: 'back',
                name: 'Back',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'back-center',
                        width: 160,
                        height: 200,
                        left: 170,
                        top: 120
                    }
                ]
            },
            {
                id: 'left-side',
                name: 'Left sleeve',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'left-sleeve',
                        width: 60,
                        height: 150,
                        left: 220,
                        top: 130
                    }
                ]
            },
            {
                id: 'right-side',
                name: 'Right sleeve',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'right-sleeve',
                        width: 60,
                        height: 150,
                        left: 220,
                        top: 130
                    }
                ]
            }
        ]
    },
    {
        id: 'classic-cap',
        name: 'Classic Baseball Cap',
        description: 'Structured 6-panel cap with embroidery.',
        category: 'hats',
        defaultViewId: 'front',
        defaultColorHex: '#0f172a',
        variants: [
            { id: 'white', colorHex: '#ffffff', colorName: 'White' },
            { id: 'black', colorHex: '#0f172a', colorName: 'Black' },
            { id: 'green', colorHex: '#16a34a', colorName: 'Forest Green' },
            { id: 'red', colorHex: '#dc2626', colorName: 'Red' },
            { id: 'navy', colorHex: '#1e3a5f', colorName: 'Navy' },
            { id: 'beige', colorHex: '#d4b896', colorName: 'Beige' }
        ],
        views: [
            {
                id: 'front',
                name: 'Front',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'front-center',
                        width: 200,
                        height: 180,
                        left: 150,
                        top: 140
                    }
                ]
            },
            {
                id: 'back',
                name: 'Back',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'back-center',
                        width: 200,
                        height: 200,
                        left: 150,
                        top: 150
                    }
                ]
            },
            {
                id: 'left-side',
                name: 'Left side',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'left-side-area',
                        width: 100,
                        height: 100,
                        left: 210,
                        top: 160
                    }
                ]
            },
            {
                id: 'right-side',
                name: 'Right side',
                mockupUrl: '',
                printAreas: [
                    {
                        id: 'right-side-area',
                        width: 100,
                        height: 100,
                        left: 210,
                        top: 160
                    }
                ]
            }
        ]
    }
];
