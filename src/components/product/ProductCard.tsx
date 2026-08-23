import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button, cn } from '@/components/ui/Button';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    basePrice: number;
    salePrice?: number | null;
    images: { url: string; alt?: string | null }[];
    variants: { size?: string | null; color?: string | null; stock: number }[];
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = product.salePrice 
    ? Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100)
    : 0;

  const mainImage = product.images[0]?.url || '/placeholder.png';
  const hoverImage = product.images[1]?.url || mainImage;

  return (
    <div className="group relative bg-white overflow-hidden">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
            -{discount}%
          </span>
        )}
        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
          New
        </span>
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white text-primary">
        <Heart className="h-4 w-4" />
      </button>

      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block aspect-[3/4] relative overflow-hidden bg-secondary">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <Image
          src={hoverImage}
          alt={product.name}
          fill
          className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />
        
        {/* Quick Add / Quick View Overlays */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
          <Button variant="primary" size="sm" className="flex-1 text-[10px] uppercase tracking-widest py-2">
            <ShoppingBag className="h-3 w-3 mr-2" />
            Add to Cart
          </Button>
          <Button variant="secondary" size="sm" className="p-2">
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 space-y-1">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
          {product.brand}
        </p>
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="text-sm font-sans font-bold text-primary truncate group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-sm font-bold text-accent">
                ₹{product.salePrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.basePrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-primary">
              ₹{product.basePrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Variants Info */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex gap-1">
            {/* Color variants placeholders */}
            <div className="h-2 w-2 rounded-full bg-black border border-gray-200" />
            <div className="h-2 w-2 rounded-full bg-white border border-gray-200" />
            <div className="h-2 w-2 rounded-full bg-gray-400 border border-gray-200" />
          </div>
          <span className="text-[9px] text-gray-400 uppercase tracking-tighter">
            {product.variants.length} Sizes Available
          </span>
        </div>
      </div>
    </div>
  );
};
