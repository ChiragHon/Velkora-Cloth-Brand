'use client';

import React from 'react';
import { cn } from '@/components/ui/Button';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  stockMap: Record<string, number>;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ sizes, selectedSize, onSizeSelect, stockMap }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Select Size: <span className="text-gray-400 ml-1">{selectedSize}</span>
        </h4>
        <button className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-primary transition-colors underline underline-offset-4">
          Size Guide
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => {
          const isOutOfStock = stockMap[size] === 0;
          return (
            <button
              key={size}
              disabled={isOutOfStock}
              onClick={() => onSizeSelect(size)}
              className={cn(
                "h-12 border transition-all duration-200 text-xs font-bold uppercase tracking-widest relative overflow-hidden",
                selectedSize === size 
                  ? "border-primary bg-primary text-white" 
                  : "border-gray-200 text-primary hover:border-primary",
                isOutOfStock && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              {size}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-gray-400 rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
