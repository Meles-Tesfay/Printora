import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryHero from '@/components/CategoryHero';

const tShirtsData = [
  {
    id: 1,
    slug: 'product-t-shirts-1',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom t shirts 1',
    brand: 'Local Craft • 2000',
    price: 800,
    premiumPrice: 600,
    sizes: 4,
    colors: 10,
    providers: 5,
    isBestseller: true,
    image: (require("../../Images/t shirts/Basic Bae Round Neck Dropped Shoulder Short Sleeve….jpg").default?.src || require("../../Images/t shirts/Basic Bae Round Neck Dropped Shoulder Short Sleeve….jpg").default || require("../../Images/t shirts/Basic Bae Round Neck Dropped Shoulder Short Sleeve….jpg")),
  },
  {
    id: 2,
    slug: 'product-t-shirts-2',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom t shirts 2',
    brand: 'Local Craft • 2001',
    price: 950,
    premiumPrice: 700,
    sizes: 5,
    colors: 15,
    providers: 6,
    isBestseller: false,
    image: (require("../../Images/t shirts/Bequem, vielseitig und stilvoll – die ideale….jpg").default?.src || require("../../Images/t shirts/Bequem, vielseitig und stilvoll – die ideale….jpg").default || require("../../Images/t shirts/Bequem, vielseitig und stilvoll – die ideale….jpg")),
  },
  {
    id: 3,
    slug: 'product-t-shirts-3',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom t shirts 3',
    brand: 'Local Craft • 2002',
    price: 1100,
    premiumPrice: 800,
    sizes: 6,
    colors: 20,
    providers: 7,
    isBestseller: false,
    image: (require("../../Images/t shirts/Dieses Herren-T-Shirt verleiht Ihrem Outfit eine….jpg").default?.src || require("../../Images/t shirts/Dieses Herren-T-Shirt verleiht Ihrem Outfit eine….jpg").default || require("../../Images/t shirts/Dieses Herren-T-Shirt verleiht Ihrem Outfit eine….jpg")),
  },
  {
    id: 4,
    slug: 'product-t-shirts-4',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom t shirts 4',
    brand: 'Local Craft • 2003',
    price: 1250,
    premiumPrice: 900,
    sizes: 4,
    colors: 25,
    providers: 8,
    isBestseller: true,
    image: (require("../../Images/t shirts/Effortlessly stylish, consciously crafted — your….jpg").default?.src || require("../../Images/t shirts/Effortlessly stylish, consciously crafted — your….jpg").default || require("../../Images/t shirts/Effortlessly stylish, consciously crafted — your….jpg")),
  },
  {
    id: 5,
    slug: 'product-t-shirts-5',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom t shirts 5',
    brand: 'Local Craft • 2004',
    price: 1400,
    premiumPrice: 1000,
    sizes: 5,
    colors: 30,
    providers: 9,
    isBestseller: false,
    image: (require("../../Images/t shirts/Get this vintage t-shirt in Simple Retro_ 2022….jpg").default?.src || require("../../Images/t shirts/Get this vintage t-shirt in Simple Retro_ 2022….jpg").default || require("../../Images/t shirts/Get this vintage t-shirt in Simple Retro_ 2022….jpg")),
  },
  {
    id: 6,
    slug: 'product-t-shirts-6',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom t shirts 6',
    brand: 'Local Craft • 2005',
    price: 1550,
    premiumPrice: 1100,
    sizes: 6,
    colors: 35,
    providers: 10,
    isBestseller: false,
    image: (require("../../Images/t shirts/Mit unserem Klara-T-Shirt verleihen Sie Ihrem….jpg").default?.src || require("../../Images/t shirts/Mit unserem Klara-T-Shirt verleihen Sie Ihrem….jpg").default || require("../../Images/t shirts/Mit unserem Klara-T-Shirt verleihen Sie Ihrem….jpg")),
  },
  {
    id: 7,
    slug: 'product-t-shirts-7',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom t shirts 7',
    brand: 'Local Craft • 2006',
    price: 1700,
    premiumPrice: 1200,
    sizes: 4,
    colors: 40,
    providers: 11,
    isBestseller: true,
    image: (require("../../Images/t shirts/Returns_ Fast refund,100% Money Back Guarantee_.jpg").default?.src || require("../../Images/t shirts/Returns_ Fast refund,100% Money Back Guarantee_.jpg").default || require("../../Images/t shirts/Returns_ Fast refund,100% Money Back Guarantee_.jpg")),
  },
  {
    id: 8,
    slug: 'product-t-shirts-8',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom t shirts 8',
    brand: 'Local Craft • 2007',
    price: 1850,
    premiumPrice: 1300,
    sizes: 5,
    colors: 45,
    providers: 12,
    isBestseller: false,
    image: (require("../../Images/t shirts/Stylisch im Sommer_ Ihr luxuriöses Update Das….jpg").default?.src || require("../../Images/t shirts/Stylisch im Sommer_ Ihr luxuriöses Update Das….jpg").default || require("../../Images/t shirts/Stylisch im Sommer_ Ihr luxuriöses Update Das….jpg")),
  }
];



const TShirtsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <CategoryHero title="T-Shirts" description="High-quality customizable t-shirts for the Printora local market." images={tShirtsData.map(d => d.image)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {tShirtsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TShirtsPage;
