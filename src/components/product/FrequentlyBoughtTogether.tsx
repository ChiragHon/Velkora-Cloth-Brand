'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { cn } from '@/lib/utils';

interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  basePrice: number;
  salePrice: number | null;
  images: { id: string; url: string }[];
  variants: Variant[];
}

interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  recommendations: Product[];
}

export function FrequentlyBoughtTogether({
  mainProduct,
  recommendations,
}: FrequentlyBoughtTogetherProps) {
  const { addItem: addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({
    [mainProduct.id]: true,
    ...recommendations.reduce((acc, p) => ({ ...acc, [p.id]: true }), {}),
  });

  // Track size/color for each product in state
  const getInitialProductConfig = (p: Product) => {
    const sizes = Array.from(new Set(p.variants.map((v) => v.size).filter(Boolean))) as string[];
    const colors = Array.from(new Set(p.variants.map((v) => v.color).filter(Boolean))) as string[];
    return {
      size: sizes[0] || '',
      color: colors[0] || '',
    };
  };

  const [configs, setConfigs] = useState<Record<string, { size: string; color: string }>>({
    [mainProduct.id]: getInitialProductConfig(mainProduct),
    ...recommendations.reduce(
      (acc, p) => ({ ...acc, [p.id]: getInitialProductConfig(p) }),
      {}
    ),
  });

  const toggleItem = (id: string) => {
    if (id === mainProduct.id) return; // Cannot toggle main product
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfigChange = (productId: string, field: 'size' | 'color', value: string) => {
    setConfigs((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleAddBundleToCart = () => {
    const productsToAdd = [mainProduct, ...recommendations].filter(
      (p) => selectedItems[p.id]
    );

    productsToAdd.forEach((p) => {
      const config = configs[p.id];
      const price = p.salePrice || p.basePrice;
      addToCart({
        id: `${p.id}-${config.color}-${config.size}-${Date.now()}`,
        productId: p.id,
        variantId: `${p.id}-${config.color}-${config.size}`,
        name: p.name,
        price: price,
        image: p.images[0]?.url || '',
        quantity: 1,
        color: config.color,
        size: config.size,
      });
    });

    alert('Bundle items added to your cart successfully!');
  };

  // Calculate prices
  const allProducts = [mainProduct, ...recommendations];
  let subtotal = 0;
  let totalDiscount = 0;

  allProducts.forEach((p) => {
    if (selectedItems[p.id]) {
      subtotal += p.basePrice;
      if (p.salePrice) {
        totalDiscount += p.basePrice - p.salePrice;
      }
    }
  });

  const bundleTotal = subtotal - totalDiscount;

  return (
    <div className="border border-gray-100 p-8 space-y-8 bg-secondary/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">Style the look</span>
          <h3 className="text-xl font-display uppercase tracking-tight">Frequently Bought Together</h3>
        </div>
        <p className="text-xs text-gray-400 font-sans">
          Select items to complete your outfit and enjoy savings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images with "+" icons */}
        <div className="lg:col-span-7 flex flex-wrap items-center gap-4 md:gap-6 justify-center lg:justify-start">
          {allProducts.map((p, i) => {
            const isSelected = selectedItems[p.id];
            const isMain = p.id === mainProduct.id;
            return (
              <React.Fragment key={p.id}>
                {i > 0 && <Plus className="h-5 w-5 text-gray-300 shrink-0" />}
                <div
                  onClick={() => toggleItem(p.id)}
                  className={cn(
                    "relative w-28 md:w-36 aspect-[3/4] bg-secondary border cursor-pointer overflow-hidden transition-all duration-300 group shadow-sm",
                    isSelected ? "border-primary opacity-100" : "border-gray-200 opacity-40 hover:opacity-75"
                  )}
                >
                  <Image
                    src={p.images[0]?.url || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070'}
                    alt={p.name}
                    fill
                    sizes="144px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Select Checkmark Badge */}
                  <div
                    className={cn(
                      "absolute top-2 left-2 h-5 w-5 border flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-primary border-primary text-white"
                        : "bg-white/80 border-gray-300"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  {/* Item Type Badge */}
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-[2px] px-2 py-0.5 text-[8px] uppercase tracking-widest text-white font-bold">
                    {isMain ? 'This Item' : 'Add Item'}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Selectors & Summary info */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {allProducts.map((p) => {
              const isSelected = selectedItems[p.id];
              const isMain = p.id === mainProduct.id;
              const config = configs[p.id];
              
              const sizes = Array.from(new Set(p.variants.map((v) => v.size).filter(Boolean))) as string[];
              const colors = Array.from(new Set(p.variants.map((v) => v.color).filter(Boolean))) as string[];

              return (
                <div
                  key={p.id}
                  className={cn(
                    "flex flex-col space-y-2 border-b border-gray-100 pb-3 last:border-0 last:pb-0 transition-opacity duration-300",
                    isSelected ? "opacity-100" : "opacity-40"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isMain}
                        onChange={() => toggleItem(p.id)}
                        className="h-4 w-4 rounded-none border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-primary leading-tight truncate max-w-[200px] md:max-w-xs">{p.name}</p>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{p.brand}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {p.salePrice ? (
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-primary">₹{p.salePrice.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-gray-400 line-through">₹{p.basePrice.toLocaleString('en-IN')}</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-primary">₹{p.basePrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>

                  {/* Size & Color Selectors (only visible/enabled when checked) */}
                  {isSelected && (sizes.length > 0 || colors.length > 0) && (
                    <div className="flex gap-3 pl-7">
                      {sizes.length > 0 && (
                        <div className="flex-1">
                          <select
                            value={config.size}
                            onChange={(e) => handleConfigChange(p.id, 'size', e.target.value)}
                            className="w-full h-8 border border-gray-200 bg-white px-2 text-[10px] uppercase tracking-widest font-bold text-primary focus:border-primary focus:outline-none cursor-pointer"
                          >
                            {sizes.map((s) => (
                              <option key={s} value={s}>
                                Size: {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {colors.length > 0 && (
                        <div className="flex-1">
                          <select
                            value={config.color}
                            onChange={(e) => handleConfigChange(p.id, 'color', e.target.value)}
                            className="w-full h-8 border border-gray-200 bg-white px-2 text-[10px] uppercase tracking-widest font-bold text-primary focus:border-primary focus:outline-none cursor-pointer"
                          >
                            {colors.map((c) => (
                              <option key={c} value={c}>
                                Color: {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pricing & Add to Cart */}
          <div className="bg-secondary/40 border border-gray-200/50 p-4 space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Total Price</p>
                <p className="text-lg font-display text-primary">₹{bundleTotal.toLocaleString('en-IN')}</p>
              </div>
              {totalDiscount > 0 && (
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-widest text-green-600 font-bold">You Save</p>
                  <p className="text-xs font-bold text-green-600">₹{totalDiscount.toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleAddBundleToCart}
              className="w-full h-11 bg-primary hover:bg-black/90 text-white text-[10px] uppercase tracking-widest font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              Add Bundle to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
