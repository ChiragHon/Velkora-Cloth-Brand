'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [isMounted, setIsMounted] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const [isApplying, setIsApplying] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = subtotal();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const discountedTotal = Math.max(0, total - discount);
  const shipping = discountedTotal > 999 ? 0 : 49;
  const tax = discountedTotal * 0.18;
  const grandTotal = discountedTotal + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: total })
      });
      const data = await res.json();
      if (data.error) {
        setCouponError(data.error);
        removeCoupon();
      } else if (data.success) {
        applyCoupon({ code: data.coupon.code, discount: data.coupon.discountAmount });
        setCouponCode('');
      }
    } catch (err) {
      setCouponError('Failed to apply coupon. Try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  if (!isMounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-6">
        <div className="h-24 w-24 bg-secondary rounded-full flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-gray-400" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display">YOUR CART IS EMPTY</h1>
          <p className="text-gray-500 font-sans">Looks like you haven't added anything yet.</p>
        </div>
        <Link href="/shop" className="uppercase tracking-widest px-8 py-4 h-auto inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] bg-primary text-white hover:bg-black/90 text-sm font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-16">
      <h1 className="text-5xl font-display mb-12 uppercase tracking-tight">Shopping Bag <span className="text-gray-300 ml-4">({items.length})</span></h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="hidden md:grid grid-cols-12 pb-4 border-b border-gray-100 text-[10px] uppercase tracking-widest font-bold text-gray-400">
            <div className="col-span-6">Product Details</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b border-gray-50 group">
              {/* Product Info */}
              <div className="col-span-1 md:col-span-6 flex space-x-6">
                <div className="h-32 w-24 relative bg-secondary flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-tight hover:text-accent transition-colors">
                      <Link href={`/product/${item.productId}`}>{item.name}</Link>
                    </h3>
                    <div className="flex space-x-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                      {item.color && <span>Color: <span className="text-primary">{item.color}</span></span>}
                      {item.size && <span>Size: <span className="text-primary">{item.size}</span></span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Remove Item</span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="col-span-1 md:col-span-2 flex justify-center">
                <div className="flex items-center border border-gray-200">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="col-span-1 md:col-span-2 text-right hidden md:block text-xs font-medium text-gray-400">
                ₹{item.price.toLocaleString()}
              </div>

              {/* Total */}
              <div className="col-span-1 md:col-span-2 text-right font-bold text-sm">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}

          {/* Cart Footer Actions */}
          <div className="pt-8 flex justify-between items-center">
            <Link href="/shop" className="text-xs uppercase tracking-widest font-bold border-b border-primary pb-1 flex items-center group">
              <ArrowRight className="h-3 w-3 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-secondary p-8 space-y-8 sticky top-24">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-200 pb-4">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500 uppercase tracking-widest">Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-xs font-medium text-green-600">
                  <span className="uppercase tracking-widest">Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500 uppercase tracking-widest">Estimated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500 uppercase tracking-widest">GST (18%)</span>
                <span>₹{tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest">Total Amount</span>
                  <span className="text-2xl font-display">₹{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Promo Code</p>
              
              {appliedCoupon ? (
                <div className="flex justify-between items-center bg-green-50 p-3 border border-green-200">
                  <div className="flex items-center space-x-2 text-green-700">
                    <span className="text-xs font-bold uppercase tracking-widest">{appliedCoupon.code}</span>
                    <span className="text-[10px]">Applied</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-[10px] text-red-500 hover:underline uppercase tracking-widest font-bold">Remove</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter code (e.g. WELCOME10)" 
                      className="h-10 bg-white" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      className="text-[10px] uppercase px-4 h-10 border-primary"
                      onClick={handleApplyCoupon}
                      disabled={isApplying || !couponCode.trim()}
                    >
                      {isApplying ? '...' : 'Apply'}
                    </Button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500">{couponError}</p>}
                </div>
              )}
            </div>

            <Link href="/checkout" className="w-full uppercase tracking-[0.2em] py-5 h-auto group text-xs font-bold inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] bg-primary text-white hover:bg-black/90">
              Proceed to Checkout
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center justify-center space-x-2 text-[9px] uppercase tracking-widest font-bold text-gray-400">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Secure Checkout Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
