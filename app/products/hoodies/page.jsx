import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import CategoryHero from "@/components/CategoryHero";
import SupplierInfoSection from "@/components/SupplierInfoSection";

const hoodiesData = [
  {
    id: 1,
    slug: 'product-hoodies-1',
    editorTemplateId: 'premium-hoodie',
    title: 'Custom hoodies 1',
    brand: 'Local Craft • 2000',
    price: 800,
    premiumPrice: 600,
    sizes: 4,
    colors: 10,
    providers: 5,
    isBestseller: true,
    supplierSpecs: { material: "80/20 Cotton-Poly", printArea: '12" x 12"', technique: "DTG / Embroidery" },
    image: (require("../../Images/hoodies/Comodidad casual con estilo relajado__Esta….jpg").default?.src || require("../../Images/hoodies/Comodidad casual con estilo relajado__Esta….jpg").default || require("../../Images/hoodies/Comodidad casual con estilo relajado__Esta….jpg")),
  },
  {
    id: 2,
    slug: 'product-hoodies-2',
    editorTemplateId: 'premium-hoodie',
    title: 'Custom hoodies 2',
    brand: 'Local Craft • 2001',
    price: 950,
    premiumPrice: 700,
    sizes: 5,
    colors: 15,
    providers: 6,
    isBestseller: false,
    supplierSpecs: { material: "Heavyweight Fleece", printArea: '12" x 12"', technique: "DTG" },
    image: (require("../../Images/hoodies/EFAN Mens Oversized Hoodies Fall Sweatshirt Winter….jpg").default?.src || require("../../Images/hoodies/EFAN Mens Oversized Hoodies Fall Sweatshirt Winter….jpg").default || require("../../Images/hoodies/EFAN Mens Oversized Hoodies Fall Sweatshirt Winter….jpg")),
  },
  {
    id: 3,
    slug: 'product-hoodies-3',
    editorTemplateId: 'premium-hoodie',
    title: 'Custom hoodies 3',
    brand: 'Local Craft • 2002',
    price: 1100,
    premiumPrice: 800,
    sizes: 6,
    colors: 20,
    providers: 7,
    isBestseller: false,
    supplierSpecs: { material: "Organic Cotton", printArea: '11" x 11"', technique: "Embroidery" },
    image: (require("../../Images/hoodies/Hilfe! Ich bin gestorben und in den….jpg").default?.src || require("../../Images/hoodies/Hilfe! Ich bin gestorben und in den….jpg").default || require("../../Images/hoodies/Hilfe! Ich bin gestorben und in den….jpg")),
  },
  {
    id: 4,
    slug: 'product-hoodies-4',
    editorTemplateId: 'premium-hoodie',
    title: 'Custom hoodies 4',
    brand: 'Local Craft • 2003',
    price: 1250,
    premiumPrice: 900,
    sizes: 4,
    colors: 25,
    providers: 8,
    isBestseller: true,
    supplierSpecs: { material: "Soft-touch Poly", printArea: '12" x 12"', technique: "DTG" },
    image: (require("../../Images/hoodies/How To Start A Capsule Wardrobe_ 5 Step Visual….jpg").default?.src || require("../../Images/hoodies/How To Start A Capsule Wardrobe_ 5 Step Visual….jpg").default || require("../../Images/hoodies/How To Start A Capsule Wardrobe_ 5 Step Visual….jpg")),
  },
  {
    id: 5,
    slug: 'product-hoodies-5',
    editorTemplateId: 'premium-hoodie',
    title: 'Custom hoodies 5',
    brand: 'Local Craft • 2004',
    price: 1400,
    premiumPrice: 1000,
    sizes: 5,
    colors: 30,
    providers: 9,
    isBestseller: false,
    supplierSpecs: { material: "Fleece Lining", printArea: '12" x 12"', technique: "Heat Press" },
    image: (require("../../Images/hoodies/Introducing our Men's Oversized Organic Hoodie….jpg").default?.src || require("../../Images/hoodies/Introducing our Men's Oversized Organic Hoodie….jpg").default || require("../../Images/hoodies/Introducing our Men's Oversized Organic Hoodie….jpg")),
  },
  {
    id: 6,
    slug: 'product-hoodies-6',
    editorTemplateId: 'premium-hoodie',
    title: 'Custom hoodies 6',
    brand: 'Local Craft • 2005',
    price: 1550,
    premiumPrice: 1100,
    sizes: 6,
    colors: 35,
    providers: 10,
    isBestseller: false,
    supplierSpecs: { material: "Premium Fleece", printArea: '12" x 12"', technique: "DTG" },
    image: (require("../../Images/hoodies/Introducing our premium fleece hoodie, crafted for….jpg").default?.src || require("../../Images/hoodies/Introducing our premium fleece hoodie, crafted for….jpg").default || require("../../Images/hoodies/Introducing our premium fleece hoodie, crafted for….jpg")),
  },
  {
    id: 7,
    slug: 'product-hoodies-7',
    editorTemplateId: 'premium-hoodie',
    title: 'Custom hoodies 7',
    brand: 'Local Craft • 2006',
    price: 1700,
    premiumPrice: 1200,
    sizes: 4,
    colors: 40,
    providers: 11,
    isBestseller: true,
    supplierSpecs: { material: "Ring-spun Cotton", printArea: '12" x 12"', technique: "DTG" },
    image: (require("../../Images/hoodies/Introducing our premium fleece hoodie, crafted….jpg").default?.src || require("../../Images/hoodies/Introducing our premium fleece hoodie, crafted….jpg").default || require("../../Images/hoodies/Introducing our premium fleece hoodie, crafted….jpg")),
  },
  {
    id: 8,
    slug: 'product-hoodies-8',
    editorTemplateId: 'premium-hoodie',
    title: 'Custom hoodies 8',
    brand: 'Local Craft • 2007',
    price: 1850,
    premiumPrice: 1300,
    sizes: 5,
    colors: 45,
    providers: 12,
    isBestseller: false,
    supplierSpecs: { material: "Eco-Friendly Blend", printArea: '10" x 10"', technique: "DTG" },
    image: (require("../../Images/hoodies/Introducing our premium hoodie, featuring a….jpg").default?.src || require("../../Images/hoodies/Introducing our premium hoodie, featuring a….jpg").default || require("../../Images/hoodies/Introducing our premium hoodie, featuring a….jpg")),
  }
];

const hoodieSupplierSpecs = {
  printAreaDescription: "Large chest area and back area. Sleeves and hood embroidery available.",
  printArea: '12" x 12"',
  fileRequirements: [
    "300 DPI Transparent PNG",
    "Max 15MB file size",
    "Vector for embroidery",
    "High contrast designs perform best"
  ],
  materialDescription: "Heavyweight Fleece and Cotton blends. Double-lined hoods.",
  techniques: ["DTG", "Screen Printing", "Puff Print", "Embroidery"]
};

const HoodiesPage = () => {
  return (
    <>
      <CategoryHero title="Hoodies & Sweatshirts" description="Premium custom apparel for the local Stenvio community." images={hoodiesData.map(d => d.image)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {hoodiesData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <SupplierInfoSection category="Hoodies" specs={hoodieSupplierSpecs} />
    </>
  );
};

export default HoodiesPage;
