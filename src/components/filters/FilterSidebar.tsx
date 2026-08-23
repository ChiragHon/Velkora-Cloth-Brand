'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export const FilterSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = [
    { name: 'Men', slug: 'men' },
    { name: 'Women', slug: 'women' },
    { name: 'Kids', slug: 'kids' },
    { name: 'Accessories', slug: 'accessories' },
    { name: 'New Arrivals', slug: 'new-arrivals' },
    { name: 'Sale', slug: 'sale' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gold', hex: '#C8A97E' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Red', hex: '#FF0000' },
  ];

  // Helper to parse comma-separated search params
  const getParamArray = (key: string) => {
    const val = searchParams.get(key);
    return val ? val.split(',').filter(Boolean) : [];
  };

  const activeCategories = getParamArray('category');
  const activeSizes = getParamArray('sizes');
  const activeColors = getParamArray('colors');
  const maxPriceParam = searchParams.get('maxPrice') || '15000';
  const inStockParam = searchParams.get('inStock') === 'true';

  // Local state for price slider to support smooth dragging
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPriceParam);

  useEffect(() => {
    setLocalMaxPrice(maxPriceParam);
  }, [maxPriceParam]);

  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/shop?${params.toString()}`);
  };

  const handleCategoryToggle = (slug: string) => {
    let nextCategories;
    if (activeCategories.includes(slug)) {
      nextCategories = activeCategories.filter((c) => c !== slug);
    } else {
      nextCategories = [...activeCategories, slug];
    }
    updateUrl({ category: nextCategories.join(',') });
  };

  const handleSizeToggle = (size: string) => {
    let nextSizes;
    if (activeSizes.includes(size)) {
      nextSizes = activeSizes.filter((s) => s !== size);
    } else {
      nextSizes = [...activeSizes, size];
    }
    updateUrl({ sizes: nextSizes.join(',') });
  };

  const handleColorToggle = (colorName: string) => {
    let nextColors;
    if (activeColors.includes(colorName)) {
      nextColors = activeColors.filter((c) => c !== colorName);
    } else {
      nextColors = [...activeColors, colorName];
    }
    updateUrl({ colors: nextColors.join(',') });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalMaxPrice(e.target.value);
  };

  const handlePriceChangeComplete = () => {
    updateUrl({ maxPrice: localMaxPrice });
  };

  const handleInStockToggle = () => {
    updateUrl({ inStock: !inStockParam ? 'true' : null });
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    const sort = searchParams.get('sort');
    if (sort) {
      params.set('sort', sort);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <aside className="w-64 flex-shrink-0 space-y-8 h-fit sticky top-24">
      {/* Categories */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map((cat) => {
            const isChecked = activeCategories.includes(cat.slug);
            return (
              <label key={cat.slug} className="flex items-center space-x-3 group cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleCategoryToggle(cat.slug)}
                  className="h-4 w-4 rounded-none border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <span className={`text-sm transition-colors ${isChecked ? 'text-primary font-semibold' : 'text-gray-600 group-hover:text-primary'}`}>
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2">
          Price Range
        </h4>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="15000"
            step="500"
            value={localMaxPrice}
            onChange={handlePriceChange}
            onMouseUp={handlePriceChangeComplete}
            onTouchEnd={handlePriceChangeComplete}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            <span>₹0</span>
            <span>Max: ₹{parseInt(localMaxPrice).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2">
          Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => {
            const isActive = activeSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`h-10 border text-xs transition-all uppercase tracking-widest font-bold ${
                  isActive
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 text-primary hover:border-primary hover:bg-secondary/30'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary border-b border-gray-100 pb-2">
          Color
        </h4>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => {
            const isActive = activeColors.includes(color.name);
            return (
              <button
                key={color.name}
                title={color.name}
                onClick={() => handleColorToggle(color.name)}
                className={`h-7 w-7 rounded-full border-2 transition-all relative flex items-center justify-center hover:scale-110 ${
                  isActive ? 'border-primary scale-110 shadow-sm' : 'border-gray-200'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isActive && (
                  <span className={`h-1.5 w-1.5 rounded-full ${color.name === 'White' ? 'bg-black' : 'bg-white'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">In Stock Only</span>
          <div
            onClick={handleInStockToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              inStockParam ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                inStockParam ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </div>
        </label>
      </div>

      <Button variant="outline" onClick={handleClearAll} className="w-full text-[10px] uppercase tracking-widest py-3">
        Clear All Filters
      </Button>
    </aside>
  );
};

