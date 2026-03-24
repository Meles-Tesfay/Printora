import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  Library,
  Shirt, 
  Heart, 
  Coffee, 
  Smartphone, 
  CheckCircle2,
  Brush
} from 'lucide-react';

import imgHat1 from '../Images/hats/Beige ralph lauren cap.jpg';
import imgTshirt1 from '../Images/t shirts/Basic Bae Round Neck Dropped Shoulder Short Sleeve….jpg';
import imgLongSleeve1 from '../Images/long sleeves/Product information_ Color_ Black, camel, light….jpg';
import imgHoodie1 from '../Images/hoodies/Introducing our premium hoodie, featuring a….jpg';
import imgPhoneCase1 from '../Images/phone cases/Our signature Tough Phone Case delivers unmatched….jpg';
import imgPhoneCase2 from '../Images/phone cases/Protective and Stylish Phone Cases_ KaseMe Impact….jpg';
import imgMug1 from '../Images/mugs/Good Morning Mug.jpg';

import imgNewTee from '../Images/t shirts/Effortlessly stylish, consciously crafted — your….jpg';
import imgNewHoodie from '../Images/hoodies/Introducing our premium fleece hoodie, crafted for….jpg';
import imgNewSweatshirt from '../Images/long sleeves/Discover the essence of elegance and authenticity….jpg';
import imgNewCap from '../Images/hats/La Casquette Avec Filet, une casquette respirante….jpg';

import imgStarterMug from '../Images/mugs/_i_Friends__i_ Central Perk Mug.jpg';
import imgStarterTee from '../Images/t shirts/Dieses Herren-T-Shirt verleiht Ihrem Outfit eine….jpg';
import imgStarterHat from '../Images/hats/Vintage Horse Art Casual Print Hat.jpg';

import imgBanner from '../Images/hoodies/How To Start A Capsule Wardrobe_ 5 Step Visual….jpg';

const resolveImg = (img) => img?.src || img?.default?.src || img?.default || img;

const productCategories = [
  { name: 'T-Shirts', path: '/products/t-shirts', icon: Shirt },
  { name: 'Hoodies', path: '/products/hoodies', icon: CheckCircle2 },
  { name: 'Long Sleeves', path: '/products/long-sleeves', icon: Shirt },
  { name: 'Mugs', path: '/products/mugs', icon: Coffee },
  { name: 'Bags', path: '/products/bags', icon: ShoppingBag },
  { name: 'Hats', path: '/products/hats', icon: Heart },
  { name: 'Phone Cases', path: '/products/phone-cases', icon: Smartphone }
];

const categories = [
  { name: 'Embroidery', path: '/products/hats', image: resolveImg(imgHat1) },
  { name: 'T-shirts', path: '/products/t-shirts', image: resolveImg(imgTshirt1) },
  { name: 'Sweatshirts', path: '/products/long-sleeves', image: resolveImg(imgLongSleeve1) },
  { name: 'Hoodies', path: '/products/hoodies', image: resolveImg(imgHoodie1) },
  { name: 'Accessories', path: '/products/bags', image: resolveImg(imgPhoneCase1) },
  { name: 'Phone Cases', path: '/products/phone-cases', image: resolveImg(imgPhoneCase2) },
  { name: 'Mugs', path: '/products/mugs', image: resolveImg(imgMug1) }
];

const starterEssentials = [
    { title: "White Ceramic Mug", price: "450 ETB", image: resolveImg(imgStarterMug) },
    { title: "Unisex Jersey Tee", price: "1,100 ETB", image: resolveImg(imgStarterTee) },
    { title: "Eco Tote Bag", price: "950 ETB", image: resolveImg(imgStarterHat) }
];

const newCollectionItems = [
  { title: "Classic Blank Tee", price: "$25.00", image: resolveImg(imgNewTee), colors: ['#f8f8f8', '#1a1a1a', '#e5e7eb'], sizes: ['S', 'M', 'L'], favorite: false },
  { title: "Premium Hoodie", price: "$45.00", image: resolveImg(imgNewHoodie), colors: ['#8c8c8c', '#1a1a1a', '#1e3a8a'], sizes: ['S', 'M', 'L'], favorite: true },
  { title: "Crewneck Sweatshirt", price: "$35.00", image: resolveImg(imgNewSweatshirt), colors: ['#f8f8f8', '#8c8c8c', '#1ae3a8'], sizes: ['S', 'M', 'L'], favorite: false },
  { title: "Panel Cap", price: "$15.00", image: resolveImg(imgNewCap), colors: ['#1a1a1a', '#f8f8f8', '#e84424'], sizes: ['O/S'], favorite: false }
];

const ProductsPage = () => {
  return (
    <div className="flex min-h-screen bg-white font-sans text-[#1c211f]">
      {/* ── Sidebar ── */}
      <aside className="w-64 border-r border-[#e5e3d7] flex flex-col sticky top-0 h-screen overflow-y-auto no-scrollbar bg-[#f0f0eb]/20 pb-10">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-1 group">
             <span className="text-3xl font-black text-[#1c211f] tracking-tighter" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
               Stenvio
             </span>
             <div className="relative ml-0.5 mt-1">
               <Brush className="w-6 h-6 text-[#1c211f] transform -rotate-12 group-hover:rotate-0 transition-transform" />
               <div className="absolute -bottom-1 -left-1 w-3 h-1.5 bg-sky-400 rounded-full blur-[2px] opacity-60" />
             </div>
          </Link>
        </div>

        {/* Product categories */}
        <div className="px-3 mb-6">
          <h3 className="px-3 text-[11px] font-bold text-[#8a8670] uppercase tracking-widest mb-2">Categories</h3>
          <div className="space-y-0.5">
            {productCategories.map((cat, i) => (
              <Link key={i} href={cat.path}>
                <div 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-[#6b6850] hover:bg-[#e5e3d7]/50 hover:text-[#1c211f]"
                >
                  <cat.icon className="w-4.5 h-4.5 opacity-70" />
                  <span className="text-[14px] font-semibold">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Floating Chat Icon */}
        <div className="p-4 mt-auto">
           <div className="w-10 h-10 rounded-full bg-[#2d2b1f] flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
             <Library className="w-5 h-5" />
           </div>
        </div>
      </aside>

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 px-8 lg:px-12 py-8 bg-[#fbfaf6] overflow-y-auto">
        


        {/* New Collection Section */}
        <div className="mb-20">
          {/* Top Banner Carousel Wrapper */}
          <div className="relative h-[250px] sm:h-[300px] md:h-[350px] mb-12 -mx-8 lg:-mx-12 overflow-hidden flex items-center justify-center -mt-4">
            <img 
              src={resolveImg(imgBanner)} 
              alt="New Collection Banner"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-[#8c6239]/40 mix-blend-multiply" />
            <h2 className="relative text-white text-4xl sm:text-5xl md:text-6xl italic text-center px-4 tracking-wider drop-shadow-md z-10" style={{ fontFamily: 'Georgia, serif' }}>
              New collection is live now!
            </h2>
          </div>

          {/* Product Grid based on the screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2 xl:px-8">
            {newCollectionItems.map((item, i) => (
              <div key={i} className="flex flex-col bg-transparent">
                <div className="relative aspect-[4/5] rounded-[1.25rem] overflow-hidden bg-[#e0ccae] mb-4">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} />
                  {item.favorite && (
                    <div className="absolute top-4 right-4 z-10">
                      <Heart fill="white" className="w-6 h-6 text-white border-0 stroke-none shadow-sm" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.2))' }} />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-[#a69688] font-semibold text-[15px]" style={{ fontFamily: 'Georgia, serif' }}>{item.title}</h3>
                  <span className="text-[#a69688] font-semibold text-[15px]" style={{ fontFamily: 'Georgia, serif' }}>{item.price}</span>
                </div>
                
                <hr className="border-[#e5e0d8] mb-3 mt-1" />
                
                <div className="flex justify-between items-center mb-5">
                  <div className="flex gap-[5px]">
                    {item.colors.map((color, idx) => (
                      <div key={idx} className="w-[16px] h-[16px] rounded-full" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {item.sizes.map((size, idx) => (
                      <span key={idx} className="text-[#a69688] text-[12px] uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>{size}</span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full py-3 bg-[#bc9368] hover:bg-[#a37e56] text-white text-[11px] tracking-[0.2em] uppercase font-bold transition-colors">
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1f1d12] mb-1 tracking-tight">Explore Stenvio's best</h1>
          <p className="text-[#6b6850] text-[15px] font-medium">Discover the most popular custom products in our curated catalog.</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-16">
          {categories.map((category) => (
            <Link key={category.name} href={category.path}>
              <div className="group cursor-pointer bg-white border border-[#e5e3d7] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/5] overflow-hidden bg-[#f0f0eb] flex items-center justify-center p-6">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="py-5 text-center border-t border-[#f0f0eb] bg-white">
                  <h3 className="text-[14px] font-bold text-[#1f1d12] group-hover:text-[#2d2b1f] tracking-wide">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Starter Essentials Section */}
        <div className="mb-8 border-t border-[#e5e3d7] pt-12">
          <h2 className="text-2xl font-bold text-[#1f1d12] mb-1 tracking-tight">Starter essentials</h2>
          <p className="text-[#6b6850] text-[15px] font-medium">Kickstart your brand with high-quality basics loved by our community.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-9">
            {starterEssentials.map((item, i) => (
              <div key={i} className="bg-white border border-[#e5e3d7] rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-square bg-[#f8f8f4] flex items-center justify-center p-8 relative group">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-[#e5e3d7] active:scale-95 transition-transform">
                      <svg className="w-5 h-5 text-[#6b6850]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    </div>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-[14.5px] font-black text-[#1f1d12] mb-1.5 line-clamp-1">{item.title}</h3>
                  <p className="text-[14px] text-emerald-700 font-bold">From {item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
};

export default ProductsPage;
