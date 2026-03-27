import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryHero from '@/components/CategoryHero';

const longSleevesData = [
  {
    id: 1,
    slug: 'product-long-sleeves-1',
    editorTemplateId: 'crewneck-sweater',
    title: 'Custom long sleeves 1',
    brand: 'Local Craft • 2000',
    price: 800,
    premiumPrice: 600,
    sizes: 4,
    colors: 10,
    providers: 5,
    isBestseller: true,
    image: (require("../../Images/long sleeves/Discover the essence of elegance and authenticity….jpg").default?.src || require("../../Images/long sleeves/Discover the essence of elegance and authenticity….jpg").default || require("../../Images/long sleeves/Discover the essence of elegance and authenticity….jpg")),
  },
  {
    id: 2,
    slug: 'product-long-sleeves-2',
    editorTemplateId: 'crewneck-sweater',
    title: 'Custom long sleeves 2',
    brand: 'Local Craft • 2001',
    price: 950,
    premiumPrice: 700,
    sizes: 5,
    colors: 15,
    providers: 6,
    isBestseller: false,
    image: (require("../../Images/long sleeves/Product information_ Color_ Black, camel, light….jpg").default?.src || require("../../Images/long sleeves/Product information_ Color_ Black, camel, light….jpg").default || require("../../Images/long sleeves/Product information_ Color_ Black, camel, light….jpg")),
  },
  {
    id: 3,
    slug: 'product-long-sleeves-3',
    editorTemplateId: 'crewneck-sweater',
    title: 'Custom long sleeves 3',
    brand: 'Local Craft • 2002',
    price: 1100,
    premiumPrice: 800,
    sizes: 6,
    colors: 20,
    providers: 7,
    isBestseller: false,
    image: (require("../../Images/long sleeves/Produktbeschreibung Entdecken Sie den perfekten….jpg").default?.src || require("../../Images/long sleeves/Produktbeschreibung Entdecken Sie den perfekten….jpg").default || require("../../Images/long sleeves/Produktbeschreibung Entdecken Sie den perfekten….jpg")),
  },
  {
    id: 4,
    slug: 'product-long-sleeves-4',
    editorTemplateId: 'crewneck-sweater',
    title: 'Custom long sleeves 4',
    brand: 'Local Craft • 2003',
    price: 1250,
    premiumPrice: 900,
    sizes: 4,
    colors: 25,
    providers: 8,
    isBestseller: true,
    image: (require("../../Images/long sleeves/Pull Surdimensionné pour homme   Ce pull oversize….jpg").default?.src || require("../../Images/long sleeves/Pull Surdimensionné pour homme   Ce pull oversize….jpg").default || require("../../Images/long sleeves/Pull Surdimensionné pour homme   Ce pull oversize….jpg")),
  },
  {
    id: 5,
    slug: 'product-long-sleeves-5',
    editorTemplateId: 'crewneck-sweater',
    title: 'Custom long sleeves 5',
    brand: 'Local Craft • 2004',
    price: 1400,
    premiumPrice: 1000,
    sizes: 5,
    colors: 30,
    providers: 9,
    isBestseller: false,
    image: (require("../../Images/long sleeves/Returns_ Fast refund,100% Money Back Guarantee_.jpg").default?.src || require("../../Images/long sleeves/Returns_ Fast refund,100% Money Back Guarantee_.jpg").default || require("../../Images/long sleeves/Returns_ Fast refund,100% Money Back Guarantee_.jpg")),
  },
  {
    id: 6,
    slug: 'product-long-sleeves-6',
    editorTemplateId: 'crewneck-sweater',
    title: 'Custom long sleeves 6',
    brand: 'Local Craft • 2005',
    price: 1550,
    premiumPrice: 1100,
    sizes: 6,
    colors: 35,
    providers: 10,
    isBestseller: false,
    image: (require("../../Images/long sleeves/Rămâi caldă chiar și când temperatura scade până….jpg").default?.src || require("../../Images/long sleeves/Rămâi caldă chiar și când temperatura scade până….jpg").default || require("../../Images/long sleeves/Rămâi caldă chiar și când temperatura scade până….jpg")),
  },
  {
    id: 7,
    slug: 'product-long-sleeves-7',
    editorTemplateId: 'crewneck-sweater',
    title: 'Custom long sleeves 7',
    brand: 'Local Craft • 2006',
    price: 1700,
    premiumPrice: 1200,
    sizes: 4,
    colors: 40,
    providers: 11,
    isBestseller: true,
    image: (require("../../Images/long sleeves/This breathable women’s ribbed long sleeve t-shirt….jpg").default?.src || require("../../Images/long sleeves/This breathable women’s ribbed long sleeve t-shirt….jpg").default || require("../../Images/long sleeves/This breathable women’s ribbed long sleeve t-shirt….jpg")),
  },
  {
    id: 8,
    slug: 'product-long-sleeves-8',
    editorTemplateId: 'crewneck-sweater',
    title: 'Custom long sleeves 8',
    brand: 'Local Craft • 2007',
    price: 1850,
    premiumPrice: 1300,
    sizes: 5,
    colors: 45,
    providers: 12,
    isBestseller: false,
    image: (require("../../Images/long sleeves/….jpg").default?.src || require("../../Images/long sleeves/….jpg").default || require("../../Images/long sleeves/….jpg")),
  }
];

const LongSleevesPage = () => {
  return (
    <>
      <CategoryHero title="Long Sleeves" description="Premium long sleeve shirts for year-round comfort." images={longSleevesData.map(d => d.image)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {longSleevesData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default LongSleevesPage;
