'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function ActiveFilters({
  searchParams,
}: {
  searchParams: {
    category?: string;
    sort?: string;
    sizes?: string;
    colors?: string;
    maxPrice?: string;
    inStock?: string;
  };
}) {
  const router = useRouter();
  const currentParams = useSearchParams();

  const getParamArray = (key: string) => {
    const val = currentParams.get(key);
    return val ? val.split(',').filter(Boolean) : [];
  };

  const activeCategories = getParamArray('category');
  const activeSizes = getParamArray('sizes');
  const activeColors = getParamArray('colors');
  const maxPrice = currentParams.get('maxPrice');
  const inStock = currentParams.get('inStock') === 'true';

  const removeValue = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams.toString());
    const val = params.get(key);
    if (val) {
      const remaining = val.split(',').filter((v) => v !== value);
      if (remaining.length > 0) {
        params.set(key, remaining.join(','));
      } else {
        params.delete(key);
      }
    }
    router.push(`/shop?${params.toString()}`);
  };

  const removeKey = (key: string) => {
    const params = new URLSearchParams(currentParams.toString());
    params.delete(key);
    router.push(`/shop?${params.toString()}`);
  };

  const hasAnyFilter =
    activeCategories.length > 0 ||
    activeSizes.length > 0 ||
    activeColors.length > 0 ||
    (maxPrice && maxPrice !== '15000') ||
    inStock;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mr-2">
        Active Filters:
      </span>

      {activeCategories.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center px-3 py-1 bg-secondary text-[10px] uppercase tracking-widest font-bold text-primary border border-gray-200"
        >
          Category: {cat}
          <button
            onClick={() => removeValue('category', cat)}
            className="ml-2 text-gray-400 hover:text-primary transition-colors text-xs"
          >
            ×
          </button>
        </span>
      ))}

      {activeSizes.map((size) => (
        <span
          key={size}
          className="inline-flex items-center px-3 py-1 bg-secondary text-[10px] uppercase tracking-widest font-bold text-primary border border-gray-200"
        >
          Size: {size}
          <button
            onClick={() => removeValue('sizes', size)}
            className="ml-2 text-gray-400 hover:text-primary transition-colors text-xs"
          >
            ×
          </button>
        </span>
      ))}

      {activeColors.map((color) => (
        <span
          key={color}
          className="inline-flex items-center px-3 py-1 bg-secondary text-[10px] uppercase tracking-widest font-bold text-primary border border-gray-200"
        >
          Color: {color}
          <button
            onClick={() => removeValue('colors', color)}
            className="ml-2 text-gray-400 hover:text-primary transition-colors text-xs"
          >
            ×
          </button>
        </span>
      ))}

      {maxPrice && maxPrice !== '15000' && (
        <span className="inline-flex items-center px-3 py-1 bg-secondary text-[10px] uppercase tracking-widest font-bold text-primary border border-gray-200">
          Max Price: ₹{parseInt(maxPrice).toLocaleString('en-IN')}
          <button
            onClick={() => removeKey('maxPrice')}
            className="ml-2 text-gray-400 hover:text-primary transition-colors text-xs"
          >
            ×
          </button>
        </span>
      )}

      {inStock && (
        <span className="inline-flex items-center px-3 py-1 bg-secondary text-[10px] uppercase tracking-widest font-bold text-primary border border-gray-200">
          In Stock Only
          <button
            onClick={() => removeKey('inStock')}
            className="ml-2 text-gray-400 hover:text-primary transition-colors text-xs"
          >
            ×
          </button>
        </span>
      )}
    </div>
  );
}

