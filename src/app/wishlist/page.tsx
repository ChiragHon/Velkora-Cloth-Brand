'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/store/useWishlist';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/Button';

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-6">
        <div className="h-24 w-24 bg-secondary rounded-full flex items-center justify-center">
          <Heart className="h-10 w-10 text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display">YOUR WISHLIST IS EMPTY</h1>
          <p className="text-gray-500 font-sans">Save your favorite items here.</p>
        </div>
        <Link href="/shop" className="uppercase tracking-widest px-8 py-4 h-auto inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] bg-primary text-white hover:bg-black/90 text-sm font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-16">
      <h1 className="text-5xl font-display mb-12 uppercase tracking-tight">Wishlist <span className="text-gray-300 ml-4">({items.length})</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.id} className="group relative flex flex-col space-y-4">
            <div className="aspect-[3/4] relative bg-secondary overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md hover:bg-white text-gray-900 transition-colors z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  {item.category && (
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">
                      {item.category}
                    </p>
                  )}
                  <h3 className="text-sm font-bold uppercase tracking-tight">
                    <Link href={`/product/${item.productId}`} className="hover:text-accent transition-colors">
                      {item.name}
                    </Link>
                  </h3>
                </div>
                <span className="text-sm font-medium">₹{item.price.toLocaleString()}</span>
              </div>
              
              <Button 
                onClick={() => {
                  addToCart({
                    id: `${item.productId}-${Date.now()}`,
                    productId: item.productId,
                    variantId: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: 1
                  });
                  removeItem(item.id);
                }}
                className="w-full mt-4 uppercase tracking-widest text-xs py-3 rounded-none group-hover:bg-accent group-hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Move to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-16 flex justify-center">
        <Link href="/shop" className="text-xs uppercase tracking-widest font-bold border-b border-primary pb-1 flex items-center group">
          <ArrowRight className="h-3 w-3 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
