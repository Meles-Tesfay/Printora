import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryHero from '@/components/CategoryHero';

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
    image: (require("../../Images/bags/New photo of me wearing my Scandinavian Bird Tote….jpg").default?.src || require("../../Images/bags/New photo of me wearing my Scandinavian Bird Tote….jpg").default || require("../../Images/bags/New photo of me wearing my Scandinavian Bird Tote….jpg")),
  }
];


const BagsPage = () => {
  return (
    <>
      <CategoryHero title="Bags" description="Customized tote bags, backpacks, and travel accessories for the local Stenvio market." images={bagsData.map(d => d.image)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {bagsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BagsPage;
