'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Truck, Package, IndianRupee, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/store/useCart';
import { useWishlist } from '@/store/useWishlist';

export function ProductActions({ product, colors, sizes, colorMap }: any) {
  const [selectedColor, setSelectedColor] = useState(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? sizes[1] || sizes[0] : '');
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist } = useWishlist();

  const totalStock = product.variants.reduce((acc: number, v: any) => acc + v.stock, 0);

  const [pincode, setPincode] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{
    serviceable: boolean;
    express?: boolean;
    estimatedDate?: string;
    expressDate?: string;
    cod: boolean;
  } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const formatDeliveryDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handlePincodeCheck = () => {
    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setDeliveryResult({
        serviceable: false,
        cod: false,
      });
      return;
    }

    setIsChecking(true);
    setDeliveryResult(null);

    // Simulate API delay
    setTimeout(() => {
      const firstDigit = parseInt(pincode[0]);

      if (firstDigit >= 1 && firstDigit <= 4) {
        setDeliveryResult({
          serviceable: true,
          express: false,
          estimatedDate: formatDeliveryDate(5) + ' – ' + formatDeliveryDate(7),
          cod: true,
        });
      } else if (firstDigit >= 5 && firstDigit <= 8) {
        setDeliveryResult({
          serviceable: true,
          express: true,
          estimatedDate: formatDeliveryDate(5) + ' – ' + formatDeliveryDate(7),
          expressDate: formatDeliveryDate(2) + ' – ' + formatDeliveryDate(3),
          cod: true,
        });
      } else {
        setDeliveryResult({
          serviceable: false,
          cod: false,
        });
      }

      setIsChecking(false);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Color: <span className="text-gray-400 font-normal normal-case tracking-normal">{selectedColor}</span>
          </h4>
          <div className="flex space-x-3">
            {colors.map((color: string) => (
              <button
                key={color}
                title={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "h-8 w-8 rounded-full border-2 shadow-sm transition-transform hover:scale-110",
                  selectedColor === color ? "border-primary scale-110" : "border-transparent"
                )}
                style={{ backgroundColor: colorMap[color] || '#999' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">Select Size</h4>
            <Link href="/size-guide" target="_blank" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-primary transition-colors underline underline-offset-4">
              Size Guide
            </Link>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={cn(
                  "h-12 border text-xs font-bold uppercase tracking-widest transition-all duration-200",
                  selectedSize === size
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-primary hover:border-primary hover:bg-secondary/30"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div className={cn("h-2 w-2 rounded-full", totalStock > 10 ? "bg-green-500" : totalStock > 0 ? "bg-yellow-500" : "bg-red-500")} />
        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
          {totalStock > 10 ? "In Stock" : totalStock > 0 ? `Only ${totalStock} left` : "Out of Stock"}
        </span>
      </div>

      {/* Add to Cart CTA */}
      <div className="flex gap-3 pt-2">
        <button 
          onClick={() => {
            addToCart({
              id: `${product.id}-${selectedColor}-${selectedSize}-${Date.now()}`,
              productId: product.id,
              variantId: `${product.id}-${selectedColor}-${selectedSize}`,
              name: product.name,
              price: product.salePrice || product.basePrice,
              image: product.images[0]?.url || '',
              quantity: 1,
              color: selectedColor,
              size: selectedSize
            });
            alert('Item added to your cart successfully!');
          }}
          className="flex-1 h-14 bg-secondary text-primary border border-gray-200 uppercase tracking-[0.2em] text-xs font-bold hover:bg-secondary/70 transition-colors active:scale-[0.98]">
          Add to Cart
        </button>
        <button 
          onClick={() => {
            addToCart({
              id: `${product.id}-${selectedColor}-${selectedSize}-${Date.now()}`,
              productId: product.id,
              variantId: `${product.id}-${selectedColor}-${selectedSize}`,
              name: product.name,
              price: product.salePrice || product.basePrice,
              image: product.images[0]?.url || '',
              quantity: 1,
              color: selectedColor,
              size: selectedSize
            });
            window.location.href = '/checkout';
          }}
          className="flex-1 h-14 bg-primary text-white uppercase tracking-[0.2em] text-xs font-bold hover:bg-black/80 transition-colors active:scale-[0.98]">
          Order Now
        </button>
        <button 
          onClick={() => addToWishlist({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.salePrice || product.basePrice,
            image: product.images[0]?.url || '',
            category: product.category?.name
          })}
          className="h-14 w-14 border border-gray-200 flex items-center justify-center hover:border-primary hover:bg-secondary/30 transition-all group shrink-0">
          <Heart className="h-5 w-5 group-hover:fill-red-400 group-hover:stroke-red-400 transition-all" />
        </button>
      </div>

      {/* Delivery & Services */}
      <div className="space-y-5 border-t border-gray-200 pt-8">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5" />
          Delivery & Services
        </h4>

        {/* Pincode Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPincode(val);
                if (deliveryResult) setDeliveryResult(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handlePincodeCheck();
              }}
              placeholder="Enter pincode"
              className="h-11 w-full border border-gray-200 bg-white px-4 text-xs tracking-wider text-primary placeholder:text-gray-400 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={handlePincodeCheck}
            disabled={isChecking || pincode.length === 0}
            className={cn(
              "h-11 px-6 text-[10px] font-bold uppercase tracking-widest transition-all duration-200",
              isChecking || pincode.length === 0
                ? "border border-gray-200 text-gray-300 cursor-not-allowed"
                : "border border-primary bg-primary text-white hover:bg-black/80 active:scale-[0.97]"
            )}
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Check'
            )}
          </button>
        </div>

        {/* Delivery Result */}
        {deliveryResult && (
          <div
            ref={resultRef}
            className="space-y-3"
            style={{
              animation: 'deliveryFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <style>{`
              @keyframes deliveryFadeIn {
                from {
                  opacity: 0;
                  transform: translateY(8px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>

            {deliveryResult.serviceable ? (
              <>
                {/* Serviceable Confirmation */}
                <div className="flex items-start gap-3 rounded-sm border border-green-200 bg-green-50/50 p-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-700">
                      Delivery available to {pincode}
                    </p>
                    <p className="text-[11px] text-green-600">
                      Estimated delivery by <span className="font-semibold">{deliveryResult.estimatedDate}</span>
                    </p>
                  </div>
                </div>

                {/* Express Delivery */}
                {deliveryResult.express && (
                  <div className="flex items-start gap-3 rounded-sm border border-primary/20 bg-secondary/40 p-3">
                    <Truck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        Express Delivery Available
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Get it by <span className="font-semibold text-primary">{deliveryResult.expressDate}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Service Features */}
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {deliveryResult.cod && (
                    <div className="flex items-center gap-2.5 py-1.5">
                      <IndianRupee className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-[11px] text-gray-500">
                        Cash on Delivery available
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 py-1.5">
                    <Package className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[11px] text-gray-500">
                      Free shipping on orders above <span className="font-semibold text-primary">₹2,499</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 py-1.5">
                    <Truck className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[11px] text-gray-500">
                      Easy 15-day returns & exchanges
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* Not Serviceable */
              <div className="flex items-start gap-3 rounded-sm border border-red-200 bg-red-50/50 p-3">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                    Not serviceable
                  </p>
                  <p className="text-[11px] text-red-500">
                    {pincode.length !== 6
                      ? 'Please enter a valid 6-digit pincode'
                      : `Delivery is not available to pincode ${pincode}. Please try a different pincode.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
