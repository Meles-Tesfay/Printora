import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryHero from '@/components/CategoryHero';

const hatsData = [
  {
    id: 1,
    slug: 'product-hats-1',
    editorTemplateId: 'classic-cap',
    title: 'Custom hats 1',
    brand: 'Local Craft • 2000',
    price: 800,
    premiumPrice: 600,
    sizes: 4,
    colors: 10,
    providers: 5,
    isBestseller: true,
    image: (require("../../Images/hats/Beige ralph lauren cap.jpg").default?.src || require("../../Images/hats/Beige ralph lauren cap.jpg").default || require("../../Images/hats/Beige ralph lauren cap.jpg")),
  },
  {
    id: 2,
    slug: 'product-hats-2',
    editorTemplateId: 'classic-cap',
    title: 'Custom hats 2',
    brand: 'Local Craft • 2001',
    price: 950,
    premiumPrice: 700,
    sizes: 5,
    colors: 15,
    providers: 6,
    isBestseller: false,
    image: (require("../../Images/hats/Display your Masonic pride with our Master Mason….jpg").default?.src || require("../../Images/hats/Display your Masonic pride with our Master Mason….jpg").default || require("../../Images/hats/Display your Masonic pride with our Master Mason….jpg")),
  },
  {
    id: 3,
    slug: 'product-hats-3',
    editorTemplateId: 'classic-cap',
    title: 'Custom hats 3',
    brand: 'Local Craft • 2002',
    price: 1100,
    premiumPrice: 800,
    sizes: 6,
    colors: 20,
    providers: 7,
    isBestseller: false,
    image: (require("../../Images/hats/Get Paid 2 Travel_ Love to travel_ Tag a….jpg").default?.src || require("../../Images/hats/Get Paid 2 Travel_ Love to travel_ Tag a….jpg").default || require("../../Images/hats/Get Paid 2 Travel_ Love to travel_ Tag a….jpg")),
  },
  {
    id: 4,
    slug: 'product-hats-4',
    editorTemplateId: 'classic-cap',
    title: 'Custom hats 4',
    brand: 'Local Craft • 2003',
    price: 1250,
    premiumPrice: 900,
    sizes: 4,
    colors: 25,
    providers: 8,
    isBestseller: true,
    image: (require("../../Images/hats/La Casquette Avec Filet, une casquette respirante….jpg").default?.src || require("../../Images/hats/La Casquette Avec Filet, une casquette respirante….jpg").default || require("../../Images/hats/La Casquette Avec Filet, une casquette respirante….jpg")),
  },
  {
    id: 5,
    slug: 'product-hats-5',
    editorTemplateId: 'classic-cap',
    title: 'Custom hats 5',
    brand: 'Local Craft • 2004',
    price: 1400,
    premiumPrice: 1000,
    sizes: 5,
    colors: 30,
    providers: 9,
    isBestseller: false,
    image: (require("../../Images/hats/La Casquette Homme Trucker, une casquette….jpg").default?.src || require("../../Images/hats/La Casquette Homme Trucker, une casquette….jpg").default || require("../../Images/hats/La Casquette Homme Trucker, une casquette….jpg")),
  },
  {
    id: 6,
    slug: 'product-hats-6',
    editorTemplateId: 'classic-cap',
    title: 'Custom hats 6',
    brand: 'Local Craft • 2005',
    price: 1550,
    premiumPrice: 1100,
    sizes: 6,
    colors: 35,
    providers: 10,
    isBestseller: false,
    image: (require("../../Images/hats/Macho Moda_ Blog de Moda Masculina - Dicas de….jpg").default?.src || require("../../Images/hats/Macho Moda_ Blog de Moda Masculina - Dicas de….jpg").default || require("../../Images/hats/Macho Moda_ Blog de Moda Masculina - Dicas de….jpg")),
  },
  {
    id: 7,
    slug: 'product-hats-7',
    editorTemplateId: 'classic-cap',
    title: 'Custom hats 7',
    brand: 'Local Craft • 2006',
    price: 1700,
    premiumPrice: 1200,
    sizes: 4,
    colors: 40,
    providers: 11,
    isBestseller: true,
    image: (require("../../Images/hats/Preto e Branco  Collar  Tecido   Embellished….jpg").default?.src || require("../../Images/hats/Preto e Branco  Collar  Tecido   Embellished….jpg").default || require("../../Images/hats/Preto e Branco  Collar  Tecido   Embellished….jpg")),
  },
  {
    id: 8,
    slug: 'product-hats-8',
    editorTemplateId: 'classic-cap',
    title: 'Custom hats 8',
    brand: 'Local Craft • 2007',
    price: 1850,
    premiumPrice: 1300,
    sizes: 5,
    colors: 45,
    providers: 12,
    isBestseller: false,
    image: (require("../../Images/hats/Vintage Horse Art Casual Print Hat.jpg").default?.src || require("../../Images/hats/Vintage Horse Art Casual Print Hat.jpg").default || require("../../Images/hats/Vintage Horse Art Casual Print Hat.jpg")),
  }
];



const HatsPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <CategoryHero title="Hats" description="Custom embroidered and printed headwear for our local community." images={hatsData.map(d => d.image)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {hatsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HatsPage;
