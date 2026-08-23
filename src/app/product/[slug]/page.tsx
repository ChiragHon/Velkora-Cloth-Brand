import React from 'react';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, RefreshCcw, Truck, Heart, Ruler, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductActions } from '@/components/product/ProductActions';
import { FrequentlyBoughtTogether } from '@/components/product/FrequentlyBoughtTogether';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
      category: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
    include: { images: true, variants: true },
  });

  const crossCategoryProducts = await prisma.product.findMany({
    where: {
      categoryId: { not: product.categoryId },
      isActive: true,
    },
    take: 2,
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
      category: true,
    },
  });

  const sizes = Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))) as string[];
  const colors = Array.from(new Set(product.variants.map(v => v.color).filter(Boolean))) as string[];
  const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  const avgRating = product.reviews.length
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 5;

  const colorMap: Record<string, string> = {
    White: '#F5F5F5',
    Black: '#0A0A0A',
    Gold: '#C8A97E',
    Navy: '#001F5B',
    Red: '#C8001E',
    Beige: '#E8DCC8',
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-12">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/shop?category=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] relative bg-secondary overflow-hidden group">
              <Image
                src={product.images[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070'}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {product.salePrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                  {Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)}% OFF
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <div key={img.id} className={cn(
                  "aspect-[3/4] relative bg-secondary cursor-pointer overflow-hidden border-2 transition-all",
                  i === 0 ? "border-primary" : "border-transparent hover:border-gray-300"
                )}>
                  <Image
                    src={img.url}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            {/* Brand & Title */}
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">{product.brand}</p>
              <h1 className="text-4xl xl:text-5xl font-display leading-tight">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn("h-4 w-4", i < Math.round(avgRating) ? "fill-current" : "stroke-current fill-none opacity-40")}
                    />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  ({product.reviews.length} Reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-4 py-4 border-y border-gray-100">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-display text-primary">₹{product.salePrice.toLocaleString('en-IN')}</span>
                  <span className="text-lg text-gray-400 line-through">₹{product.basePrice.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-red-500 font-bold uppercase tracking-wider">
                    Save ₹{(product.basePrice - product.salePrice).toLocaleString('en-IN')}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-display text-primary">₹{product.basePrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="text-gray-600 font-sans leading-relaxed text-sm max-w-md">
              {product.description}
            </p>

            <ProductActions 
              product={product} 
              colors={colors} 
              sizes={sizes} 
              colorMap={colorMap} 
            />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: Truck, text: "Free Shipping", sub: "Over ₹999" },
                { icon: RefreshCcw, text: "14-Day Return", sub: "Easy Policy" },
                { icon: ShieldCheck, text: "Secure Pay", sub: "SSL Encrypted" },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex flex-col items-center text-center p-3 bg-secondary/30 space-y-1">
                  <Icon className="h-4 w-4 text-primary" />
                  <p className="text-[9px] font-bold uppercase tracking-widest">{text}</p>
                  <p className="text-[8px] text-gray-400 uppercase tracking-tighter">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description & Reviews Tabs */}
        <div className="mt-24 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-12 border-t border-gray-100">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-display uppercase tracking-tight">Product Details</h2>
              <p className="text-sm text-gray-600 font-sans leading-loose">{product.description}</p>
              <ul className="space-y-3">
                {[
                  "Premium high-quality fabric construction",
                  "Sustainably sourced and ethically manufactured",
                  "Designed for lasting comfort and style",
                  "Versatile piece suitable for any occasion",
                  "Available in multiple colorways and sizes",
                ].map(item => (
                  <li key={item} className="flex items-center space-x-3 text-sm text-gray-600 font-sans">
                    <div className="h-1.5 w-1.5 bg-accent rounded-full flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-100 pb-4">Specifications</h3>
              <div className="space-y-4">
                {[
                  { label: "Material", value: "100% Organic Cotton" },
                  { label: "Fit", value: "Regular Fit" },
                  { label: "Care", value: "Machine Wash 30°C" },
                  { label: "Origin", value: "Made in India" },
                  { label: "Category", value: product.category.name },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{label}</span>
                    <span className="text-xs font-bold text-primary">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {product.reviews.length > 0 && (
            <div className="space-y-8 pt-12 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display uppercase tracking-tight">Customer Reviews</h2>
                <div className="flex items-center space-x-3">
                  <div className="flex text-accent">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <span className="text-sm font-bold">{avgRating.toFixed(1)} / 5.0</span>
                  <span className="text-xs text-gray-400">({product.reviews.length} reviews)</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.reviews.map(review => (
                  <div key={review.id} className="p-6 bg-secondary/20 border border-gray-50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest">{review.user.name}</p>
                        <div className="flex text-accent">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-current" : "opacity-30")} />
                          ))}
                        </div>
                      </div>
                      {review.isVerified && (
                        <span className="text-[8px] uppercase tracking-widest font-bold text-green-600 bg-green-50 px-2 py-1 border border-green-100">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold">{review.title}</p>
                    <p className="text-xs text-gray-500 font-sans leading-relaxed">{review.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Frequently Bought Together (Cross-Selling) */}
        {crossCategoryProducts.length > 0 && (
          <div className="mt-24">
            <FrequentlyBoughtTogether mainProduct={product as any} recommendations={crossCategoryProducts as any} />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-10">
            <div className="flex items-end justify-between border-b border-gray-100 pb-6">
              <h2 className="text-3xl font-display uppercase">You Might Also Like</h2>
              <Link href="/shop" className="text-xs uppercase tracking-widest font-bold border-b border-primary pb-1 hover:text-accent transition-colors">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

