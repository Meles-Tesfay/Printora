"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Loader2, ArrowLeft, Shirt, Star } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch Product
        const { data: prodData, error: prodError } = await supabase
          .from("supplier_products")
          .select("*, supplier:profiles(full_name)")
          .eq("id", id)
          .single();

        if (prodError) throw prodError;
        setProduct(prodData);
        setActiveImage(prodData?.image_url);

        // Fetch Reviews from custom_orders linked to this product
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("custom_orders")
          .select("id, variants, created_at, customer_id")
          .eq("supplier_product_id", id)
          .not("variants", "is", null)
          .order("created_at", { ascending: false });

        if (!reviewsError && reviewsData) {
          // Enrich with customer names
          const customerIds = [...new Set(reviewsData.map(r => r.customer_id))];
          if (customerIds.length > 0) {
            const { data: customerProfiles } = await supabase
              .from("profiles")
              .select("id, full_name")
              .in("id", customerIds);
            
            const profileMap = Object.fromEntries((customerProfiles || []).map(p => [p.id, p]));
            setReviews((reviewsData || [])
              .filter(r => r.variants?.customer_rating)
              .map(r => ({
                ...r,
                customer_rating: r.variants.customer_rating,
                customer_feedback: r.variants.customer_feedback,
                customer_name: profileMap[r.customer_id]?.full_name || "Verified Customer"
              })));
          } else {
            setReviews(reviewsData);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfa]">
        <Loader2 className="animate-spin text-[#3da85b]" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafbfa] space-y-4">
        <h1 className="text-2xl font-black text-[#1c211f]">Product Not Found</h1>
        <button onClick={() => router.back()} className="text-[#3da85b] font-bold hover:underline">
          Go back to catalog
        </button>
      </div>
    );
  }

  // Gather all available images into an array for the gallery
  const galleryImages = [product.image_url, product.hover_image_url].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#fafbfa] text-[#1c211f] font-sans pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-400 hover:text-[#1c211f] transition-colors font-bold text-sm"
          >
            <ArrowLeft size={16} />
            Back to products
          </button>

          <Link 
            href="/orders" 
            className="px-5 py-2 flex items-center justify-center bg-white border border-gray-200 text-[#1c211f] rounded-full hover:bg-gray-50 transition-all shadow-sm font-black text-xs uppercase tracking-widest"
          >
            <Star size={14} className="mr-2 text-[#3da85b] fill-[#3da85b]" />
            My Orders
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Images */}
          <div className="w-full lg:w-[45%] space-y-4">
            {/* Main Image View */}
            <div className="relative aspect-square bg-[#f2f2f2] rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
              {activeImage ? (
                 <img src={activeImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply p-4" />
              ) : (
                 <div className="flex items-center justify-center text-gray-300">
                    <Shirt size={100} strokeWidth={0.5} />
                 </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {galleryImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-[#f2f2f2] transition-all ${activeImage === img ? 'border-[#3da85b]' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain mix-blend-multiply p-1" />
                  </button>
                ))}
                {/* Placeholder for future detailed images */}
                <div className="w-20 h-20 flex-shrink-0 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-[#f9f9f9] text-[10px] text-center p-1 font-bold cursor-default hover:bg-gray-100 transition-colors">
                  More<br/>Images
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full lg:w-[55%] flex flex-col">
            
            <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 self-start">
               {product.supplier?.full_name ? `By ${product.supplier.full_name}` : "Premium Catalog"}
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-[#1c211f] leading-tight mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-[#ffc107]">
                {(() => {
                  const avg = reviews.length > 0 
                    ? reviews.reduce((acc, r) => acc + (r.customer_rating || 0), 0) / reviews.length 
                    : 4.5; // default fallback if no reviews
                  return [1, 2, 3, 4, 5].map(i => (
                    <Star key={i} size={16} className={i <= Math.round(avg) ? "fill-current" : "fill-current text-gray-200"} />
                  ));
                })()}
                <span className="text-gray-500 text-sm font-bold ml-1 text-black">
                  {reviews.length > 0 ? `${reviews.length} reviews` : "No reviews yet"}
                </span>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 font-medium leading-relaxed mb-8">
              <p>
                {product.description || "No detailed description provided by the supplier yet. This premium product is fully customizable. Add your own designs, logos, and artwork to create something truly unique."}
              </p>
              <ul className="mt-4 space-y-1 list-disc pl-5">
                <li>100% Premium Material</li>
                <li>Retail fit, tear-away label</li>
                <li>Eco-friendly and ethically manufactured</li>
              </ul>
            </div>

            <hr className="border-gray-200 mb-8" />

            {/* Colors */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-[#1c211f] uppercase tracking-wider">Available Colors</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="w-8 h-8 rounded-full bg-[#1c211f] border-2 border-white shadow-sm ring-2 ring-transparent hover:ring-gray-300 transition-all"></button>
                <button className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-sm ring-2 ring-transparent hover:ring-gray-300 transition-all"></button>
                <button className="w-8 h-8 rounded-full bg-[#c0392b] border-2 border-white shadow-sm ring-2 ring-transparent hover:ring-gray-300 transition-all"></button>
                <button className="w-8 h-8 rounded-full bg-[#2980b9] border-2 border-white shadow-sm ring-2 ring-transparent hover:ring-gray-300 transition-all"></button>
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-[#1c211f] uppercase tracking-wider">Sizes</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                  <button key={size} className="w-12 h-10 rounded-lg border border-gray-200 font-bold text-sm text-gray-600 hover:border-[#3da85b] hover:text-[#3da85b] transition-all bg-white">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Printora Choice Block */}
            <div className="bg-[#eafaea] rounded-2xl p-6 border border-[#ccebcc]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h3 className="font-black text-xl text-[#1c211f] flex items-center gap-2">
                  Printora <span className="text-[11px] font-black bg-[#3da85b] text-white px-2 py-1 rounded-md uppercase tracking-wider">Choice</span>
                </h3>
              </div>
              
              <p className="text-[13px] text-gray-700 font-medium mb-6 leading-relaxed">
                Get the best price and quality on every order. We automatically select a top-rated print provider from our trusted network for you.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-4 border-t border-[#ccebcc]/50">
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Best Quality</div>
                  <div className="font-black text-[13px] flex items-center gap-1"><Star size={12} className="fill-current text-yellow-500"/> Top Rated</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Lowest Price</div>
                  <div className="font-black text-[13px]">From ብር {product.price}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Fastest Delivery</div>
                  <div className="font-black text-[13px]">2-4 Days*</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Print Areas</div>
                  <div className="font-black text-[13px]">Front, Back</div>
                </div>
              </div>

              <Link 
                href={`/editor?template=${product.product_type?.toLowerCase() || 'classic-tshirt'}&supplier_product_id=${product.id}`}
                className="block w-full bg-[#1c211f] text-white py-4 rounded-xl text-[15px] font-black text-center hover:bg-black transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
              >
                Customize Product
              </Link>
            </div>
            
            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="mt-16 border-t border-gray-100 pt-10">
                <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Customer Reviews</h2>
                <div className="space-y-8">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-gray-50 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#eafaea] flex items-center justify-center text-[#3da85b] font-black text-xs">
                            {rev.customer_name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-sm">{rev.customer_name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified Purchase</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} size={12} className={i <= rev.customer_rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed italic">
                        "{rev.customer_feedback || "No comment provided."}"
                      </p>
                      <p className="text-[10px] text-gray-300 font-bold mt-2 uppercase">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
