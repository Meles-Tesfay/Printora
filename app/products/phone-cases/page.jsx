import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryHero from '@/components/CategoryHero';

const phoneCasesData = [
  {
    id: 1,
    slug: 'product-phone-cases-1',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom phone cases 1',
    brand: 'Local Craft • 2000',
    price: 800,
    premiumPrice: 600,
    sizes: 4,
    colors: 10,
    providers: 5,
    isBestseller: true,
    image: (require("../../Images/phone cases/Limited edition, hand-designed abstract nature eco….jpg").default?.src || require("../../Images/phone cases/Limited edition, hand-designed abstract nature eco….jpg").default || require("../../Images/phone cases/Limited edition, hand-designed abstract nature eco….jpg")),
  },
  {
    id: 2,
    slug: 'product-phone-cases-2',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom phone cases 2',
    brand: 'Local Craft • 2001',
    price: 950,
    premiumPrice: 700,
    sizes: 5,
    colors: 15,
    providers: 6,
    isBestseller: false,
    image: (require("../../Images/phone cases/Limited edition, hand-designed cat phone case….jpg").default?.src || require("../../Images/phone cases/Limited edition, hand-designed cat phone case….jpg").default || require("../../Images/phone cases/Limited edition, hand-designed cat phone case….jpg")),
  },
  {
    id: 3,
    slug: 'product-phone-cases-3',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom phone cases 3',
    brand: 'Local Craft • 2002',
    price: 1100,
    premiumPrice: 800,
    sizes: 6,
    colors: 20,
    providers: 7,
    isBestseller: false,
    image: (require("../../Images/phone cases/Limited edition, met de hand ontworpen boho flower….jpg").default?.src || require("../../Images/phone cases/Limited edition, met de hand ontworpen boho flower….jpg").default || require("../../Images/phone cases/Limited edition, met de hand ontworpen boho flower….jpg")),
  },
  {
    id: 4,
    slug: 'product-phone-cases-4',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom phone cases 4',
    brand: 'Local Craft • 2003',
    price: 1250,
    premiumPrice: 900,
    sizes: 4,
    colors: 25,
    providers: 8,
    isBestseller: true,
    image: (require("../../Images/phone cases/Limited edition, met de hand ontworpen….jpg").default?.src || require("../../Images/phone cases/Limited edition, met de hand ontworpen….jpg").default || require("../../Images/phone cases/Limited edition, met de hand ontworpen….jpg")),
  },
  {
    id: 5,
    slug: 'product-phone-cases-5',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom phone cases 5',
    brand: 'Local Craft • 2004',
    price: 1400,
    premiumPrice: 1000,
    sizes: 5,
    colors: 30,
    providers: 9,
    isBestseller: false,
    image: (require("../../Images/phone cases/Our signature Tough Phone Case delivers unmatched….jpg").default?.src || require("../../Images/phone cases/Our signature Tough Phone Case delivers unmatched….jpg").default || require("../../Images/phone cases/Our signature Tough Phone Case delivers unmatched….jpg")),
  },
  {
    id: 6,
    slug: 'product-phone-cases-6',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom phone cases 6',
    brand: 'Local Craft • 2005',
    price: 1550,
    premiumPrice: 1100,
    sizes: 6,
    colors: 35,
    providers: 10,
    isBestseller: false,
    image: (require("../../Images/phone cases/Protective and Stylish Phone Cases_ KaseMe Impact… (1).jpg").default?.src || require("../../Images/phone cases/Protective and Stylish Phone Cases_ KaseMe Impact… (1).jpg").default || require("../../Images/phone cases/Protective and Stylish Phone Cases_ KaseMe Impact… (1).jpg")),
  },
  {
    id: 7,
    slug: 'product-phone-cases-7',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom phone cases 7',
    brand: 'Local Craft • 2006',
    price: 1700,
    premiumPrice: 1200,
    sizes: 4,
    colors: 40,
    providers: 11,
    isBestseller: true,
    image: (require("../../Images/phone cases/Protective and Stylish Phone Cases_ KaseMe Impact….jpg").default?.src || require("../../Images/phone cases/Protective and Stylish Phone Cases_ KaseMe Impact….jpg").default || require("../../Images/phone cases/Protective and Stylish Phone Cases_ KaseMe Impact….jpg")),
  },
  {
    id: 8,
    slug: 'product-phone-cases-8',
    editorTemplateId: 'classic-tshirt',
    title: 'Custom phone cases 8',
    brand: 'Local Craft • 2007',
    price: 1850,
    premiumPrice: 1300,
    sizes: 5,
    colors: 45,
    providers: 12,
    isBestseller: false,
    image: (require("../../Images/phone cases/Un design floral_ C’est toujours une bonne idée….jpg").default?.src || require("../../Images/phone cases/Un design floral_ C’est toujours une bonne idée….jpg").default || require("../../Images/phone cases/Un design floral_ C’est toujours une bonne idée….jpg")),
  }
];



const PhoneCasesPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <CategoryHero title="Phone Cases" description="Durable and stylish cases for the local Stenvio tech community." images={phoneCasesData.map(d => d.image)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {phoneCasesData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhoneCasesPage;
