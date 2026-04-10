import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/PromoBanner';
import SupplierInfoSection from '@/components/SupplierInfoSection';

const bagsData = [
  {
    id: 1,
    slug: 'cotton-canvas-tote',
    title: 'Heavyweight Cotton Canvas Tote',
    brand: 'Monday Collection',
    price: 1200,
    premiumPrice: 850,
    sizes: 1,
    colors: 2,
    providers: 3,
    isBestseller: true,
    supplierSpecs: { material: "Heavy Canvas", printArea: '10" x 12"', technique: "Screen Print" },
    image: (require("../../Images/bags/A heavyweight cotton canvas tote created in Monday….jpg").default?.src || require("../../Images/bags/A heavyweight cotton canvas tote created in Monday….jpg").default || require("../../Images/bags/A heavyweight cotton canvas tote created in Monday….jpg")),
  },
  {
    id: 2,
    slug: 'scandinavian-bird-tote',
    title: 'Scandinavian Bird Print Tote',
    brand: 'Bird Design',
    price: 950,
    premiumPrice: 700,
    sizes: 2,
    colors: 1,
    providers: 4,
    isBestseller: false,
    supplierSpecs: { material: "100% Cotton", printArea: '8" x 8"', technique: "DTG" },
    image: (require("../../Images/bags/New photo of me wearing my Scandinavian Bird Tote….jpg").default?.src || require("../../Images/bags/New photo of me wearing my Scandinavian Bird Tote….jpg").default || require("../../Images/bags/New photo of me wearing my Scandinavian Bird Tote….jpg")),
  },
  {
    id: 3,
    slug: 'city-market-bag',
    title: 'City Market Bag',
    brand: 'Oleander + Palm',
    price: 1100,
    premiumPrice: 800,
    sizes: 1,
    colors: 3,
    providers: 5,
    isBestseller: true,
    supplierSpecs: { material: "Jute / Canvas", printArea: '12" x 10"', technique: "Screen Print" },
    image: (require("../../Images/bags/DIY City Market Bag _ Oleander + Palm.jpg").default?.src || require("../../Images/bags/DIY City Market Bag _ Oleander + Palm.jpg").default || require("../../Images/bags/DIY City Market Bag _ Oleander + Palm.jpg")),
  },
  {
    id: 4,
    slug: 'cream-tote-bag',
    title: 'Premium Cream Tote Bag',
    brand: 'Essential Carry',
    price: 850,
    premiumPrice: 600,
    sizes: 1,
    colors: 1,
    providers: 4,
    isBestseller: false,
    supplierSpecs: { material: "Cream Canvas", printArea: '10" x 12"', technique: "DTG" },
    image: (require("../../Images/bags/Perfect Condition, Brand New Tags Attached Cream….jpg").default?.src || require("../../Images/bags/Perfect Condition, Brand New Tags Attached Cream….jpg").default || require("../../Images/bags/Perfect Condition, Brand New Tags Attached Cream….jpg")),
  },
  {
    id: 5,
    slug: 'polyester-lining-bag',
    title: 'Lined Canvas Carrier',
    brand: 'Stenvio Accessories',
    price: 1400,
    premiumPrice: 1000,
    sizes: 2,
    colors: 5,
    providers: 6,
    isBestseller: false,
    supplierSpecs: { material: "Polyester-lined", printArea: '9" x 9"', technique: "Heat Transfer" },
    image: (require("../../Images/bags/Product information_ Lining texture_ Polyester….jpg").default?.src || require("../../Images/bags/Product information_ Lining texture_ Polyester….jpg").default || require("../../Images/bags/Product information_ Lining texture_ Polyester….jpg")),
  },
  {
    id: 6,
    slug: 'spring-collection-tote',
    title: 'Spring Collection Fashion Tote',
    brand: '2022 Look',
    price: 1550,
    premiumPrice: 1100,
    sizes: 1,
    colors: 4,
    providers: 3,
    isBestseller: false,
    supplierSpecs: { material: "Refined Canvas", printArea: '10" x 10"', technique: "Embroidery" },
    image: (require("../../Images/bags/2022春夏コレクションから直送！….jpg").default?.src || require("../../Images/bags/2022春夏コレクションから直送！….jpg").default || require("../../Images/bags/2022春夏コレクションから直送！….jpg")),
  },
  {
    id: 7,
    slug: 'classic-cotton-tote',
    title: 'Classic Monday Tote',
    brand: 'Monday Collection',
    price: 1200,
    premiumPrice: 850,
    sizes: 1,
    colors: 2,
    providers: 3,
    isBestseller: false,
    supplierSpecs: { material: "Heavy Canvas", printArea: '10" x 12"', technique: "Screen Print" },
    image: (require("../../Images/bags/A heavyweight cotton canvas tote created in Monday….jpg").default?.src || require("../../Images/bags/A heavyweight cotton canvas tote created in Monday….jpg").default || require("../../Images/bags/A heavyweight cotton canvas tote created in Monday….jpg")),
  },
  {
    id: 8,
    slug: 'bird-design-tote',
    title: 'Bird Style Tote',
    brand: 'Bird Design',
    price: 950,
    premiumPrice: 700,
    sizes: 2,
    colors: 1,
    providers: 4,
    isBestseller: true,
    supplierSpecs: { material: "100% Cotton", printArea: '8" x 8"', technique: "DTG" },
    image: (require("../../Images/bags/New photo of me wearing my Scandinavian Bird Tote….jpg").default?.src || require("../../Images/bags/New photo of me wearing my Scandinavian Bird Tote….jpg").default || require("../../Images/bags/New photo of me wearing my Scandinavian Bird Tote….jpg")),
  }
];

const bagSupplierSpecs = {
  printAreaDescription: "Ideal for centered flat designs. Handles are not printable.",
  printArea: '10" x 12"',
  fileRequirements: [
    "300 DPI High Resolution",
    "PNG / AI / EPS",
    "Maximum 4 colors for Screen Print",
    "Vector strongly recommended"
  ],
  materialDescription: "Heavyweight 12oz Canvas. Eco-friendly natural fibers.",
  techniques: ["Screen Printing", "Direct to Garment", "Embroidery", "Dye Sublimation"]
};

const BagsPage = () => {
  return (
    <>
      <PromoBanner 
        title="Custom Bags & Accessories" 
        subtitle="Stenvio Durables"
        buttonText="DESIGN YOUR BAG"
        image={bagsData[0].image} 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {bagsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <SupplierInfoSection category="Bags" specs={bagSupplierSpecs} />
    </>
  );
};

export default BagsPage;
