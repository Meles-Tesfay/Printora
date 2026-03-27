import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryHero from '@/components/CategoryHero';

const bagsData = [
  {
    id: 1,
    slug: 'product-bags-1',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom bags 1',
    brand: 'Local Craft • 2000',
    price: 800,
    premiumPrice: 600,
    sizes: 4,
    colors: 10,
    providers: 5,
    isBestseller: true,
    image: (require("../../Images/mugs/1 x 325 ml gepersonaliseerde koffiemok met naam en….jpg").default?.src || require("../../Images/mugs/1 x 325 ml gepersonaliseerde koffiemok met naam en….jpg").default || require("../../Images/mugs/1 x 325 ml gepersonaliseerde koffiemok met naam en….jpg")),
  },
  {
    id: 2,
    slug: 'product-bags-2',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom bags 2',
    brand: 'Local Craft • 2001',
    price: 950,
    premiumPrice: 700,
    sizes: 5,
    colors: 15,
    providers: 6,
    isBestseller: false,
    image: (require("../../Images/mugs/24 Gifts For The Person Who's Obsessed With Their….jpg").default?.src || require("../../Images/mugs/24 Gifts For The Person Who's Obsessed With Their….jpg").default || require("../../Images/mugs/24 Gifts For The Person Who's Obsessed With Their….jpg")),
  },
  {
    id: 3,
    slug: 'product-bags-3',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom bags 3',
    brand: 'Local Craft • 2002',
    price: 1100,
    premiumPrice: 800,
    sizes: 6,
    colors: 20,
    providers: 7,
    isBestseller: false,
    image: (require("../../Images/mugs/Good Morning Mug.jpg").default?.src || require("../../Images/mugs/Good Morning Mug.jpg").default || require("../../Images/mugs/Good Morning Mug.jpg")),
  },
  {
    id: 4,
    slug: 'product-bags-4',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom bags 4',
    brand: 'Local Craft • 2003',
    price: 1250,
    premiumPrice: 900,
    sizes: 4,
    colors: 25,
    providers: 8,
    isBestseller: true,
    image: (require("../../Images/mugs/Graphic Designer Mug by CafePress CafePress….jpg").default?.src || require("../../Images/mugs/Graphic Designer Mug by CafePress CafePress….jpg").default || require("../../Images/mugs/Graphic Designer Mug by CafePress CafePress….jpg")),
  },
  {
    id: 5,
    slug: 'product-bags-5',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom bags 5',
    brand: 'Local Craft • 2004',
    price: 1400,
    premiumPrice: 1000,
    sizes: 5,
    colors: 30,
    providers: 9,
    isBestseller: false,
    image: (require("../../Images/mugs/Item Type_ Mugs Material_ Ceramic Features….jpg").default?.src || require("../../Images/mugs/Item Type_ Mugs Material_ Ceramic Features….jpg").default || require("../../Images/mugs/Item Type_ Mugs Material_ Ceramic Features….jpg")),
  },
  {
    id: 6,
    slug: 'product-bags-6',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom bags 6',
    brand: 'Local Craft • 2005',
    price: 1550,
    premiumPrice: 1100,
    sizes: 6,
    colors: 35,
    providers: 10,
    isBestseller: false,
    image: (require("../../Images/mugs/Motivational mug for slow mornings___.jpg").default?.src || require("../../Images/mugs/Motivational mug for slow mornings___.jpg").default || require("../../Images/mugs/Motivational mug for slow mornings___.jpg")),
  },
  {
    id: 7,
    slug: 'product-bags-7',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom bags 7',
    brand: 'Local Craft • 2006',
    price: 1700,
    premiumPrice: 1200,
    sizes: 4,
    colors: 40,
    providers: 11,
    isBestseller: true,
    image: (require("../../Images/mugs/_Finally, a mug that gets it! 😂    This sleek….jpg").default?.src || require("../../Images/mugs/_Finally, a mug that gets it! 😂    This sleek….jpg").default || require("../../Images/mugs/_Finally, a mug that gets it! 😂    This sleek….jpg")),
  },
  {
    id: 8,
    slug: 'product-bags-8',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom bags 8',
    brand: 'Local Craft • 2007',
    price: 1850,
    premiumPrice: 1300,
    sizes: 5,
    colors: 45,
    providers: 12,
    isBestseller: false,
    image: (require("../../Images/mugs/_i_Friends__i_ Central Perk Mug.jpg").default?.src || require("../../Images/mugs/_i_Friends__i_ Central Perk Mug.jpg").default || require("../../Images/mugs/_i_Friends__i_ Central Perk Mug.jpg")),
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
