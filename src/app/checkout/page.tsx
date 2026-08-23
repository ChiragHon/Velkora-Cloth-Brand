'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/useCart';
import { validateCoupon } from './actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronRight, MapPin, Truck, CreditCard, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { cn } from '@/components/ui/Button';

type CheckoutStep = 'address' | 'delivery' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, appliedCoupon } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  React.useEffect(() => {
    setIsMounted(true);
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Form State
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pin: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const total = subtotal();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const discountedTotal = Math.max(0, total - discount);
  const shipping = deliveryMethod === 'express' ? 99 : (discountedTotal > 999 ? 0 : 49);
  const tax = discountedTotal * 0.18;
  const grandTotal = discountedTotal + shipping + tax;

  const steps: { id: CheckoutStep; label: string; icon: any }[] = [
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: ShoppingBag },
  ];

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoLoading(true);
    setPromoError('');
    
    try {
      const res = await validateCoupon(promoCode, total);
      if (res.error) {
        setPromoError(res.error);
      } else if (res.success && res.discount !== undefined && res.code) {
        useCart.getState().applyCoupon({ code: res.code, discount: res.discount });
        setPromoCode('');
      }
    } catch (err) {
      setPromoError('Failed to apply coupon');
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      const isRazorpay = paymentMethod === 'upi' || paymentMethod === 'netbanking' || paymentMethod === 'cod'; // For Indian methods we can use razorpay, or just default anything not "card" to razorpay
      const endpoint = isRazorpay ? '/api/checkout/razorpay' : '/api/checkout';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          address,
          deliveryMethod,
          paymentMethod,
          couponCode: appliedCoupon?.code,
          discountAmount: appliedCoupon?.discount || 0
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Stripe flow
        if (data.url.includes('/SIM-')) {
          clearCart(); // Clear cart immediately for simulated flow
        }
        window.location.href = data.url;
      } else if (data.orderId) {
        // Razorpay Flow
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_123',
          amount: data.amount,
          currency: 'INR',
          name: 'Velkora',
          description: 'Test Transaction',
          order_id: data.orderId,
          handler: async function (response: any) {
            const verifyRes = await fetch('/api/checkout/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.dbOrderId
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              window.location.href = `/order/confirmation/${data.dbOrderId}`;
            } else {
              alert('Payment Verification Failed');
            }
          },
          prefill: {
            name: address.name,
            contact: address.phone,
          },
          theme: {
            color: '#000000'
          }
        };

        // If it's a simulated dev order
        if (data.orderId.startsWith('order_sim_')) {
            options.handler({ razorpay_order_id: data.orderId, razorpay_payment_id: 'sim_pay_123', razorpay_signature: 'sim_sig_123' });
        } else {
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any){
                alert(response.error.description);
            });
            rzp.open();
        }
        setIsLoading(false);
      } else {
        throw new Error(data.error || 'Checkout failed');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initialize checkout. Please try again.');
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-12">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isPast = steps.findIndex(s => s.id === currentStep) > i;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center border transition-all duration-300",
                isActive ? "border-primary bg-primary text-white scale-110" : 
                isPast ? "border-green-500 bg-green-50 text-green-500" : "border-gray-200 text-gray-300"
              )}>
                {isPast ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={cn(
                "text-[9px] uppercase tracking-widest font-bold",
                isActive ? "text-primary" : "text-gray-400"
              )}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-12 h-[1px]",
                isPast ? "bg-green-500" : "bg-gray-200"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display text-center mb-8 uppercase tracking-tight">Checkout</h1>
        
        {renderStepIndicator()}

        {!isMounted ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            {currentStep === 'address' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-display uppercase tracking-tight border-b border-gray-100 pb-4">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Full Name" value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
                  <Input label="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                  <div className="col-span-2">
                    <Input label="Street Address" value={address.line1} onChange={e => setAddress({...address, line1: e.target.value})} />
                  </div>
                  <Input label="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                  <Input label="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                  <Input label="PIN Code" value={address.pin} onChange={e => setAddress({...address, pin: e.target.value})} />
                </div>
                <Button 
                  className="w-full h-14 uppercase tracking-widest text-xs font-bold" 
                  onClick={() => setCurrentStep('delivery')}
                >
                  Continue to Delivery
                </Button>
              </div>
            )}

            {currentStep === 'delivery' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-display uppercase tracking-tight border-b border-gray-100 pb-4">Delivery Method</h2>
                <div className="space-y-4">
                  {[
                    { id: 'standard', name: 'Standard Delivery', time: '5-7 business days', price: discountedTotal > 999 ? 'FREE' : '₹49' },
                    { id: 'express', name: 'Express Delivery', time: '2-3 business days', price: '₹99' },
                  ].map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setDeliveryMethod(method.id)}
                      className={cn(
                        "p-6 border cursor-pointer transition-all flex justify-between items-center group",
                        deliveryMethod === method.id ? "border-primary bg-secondary/30" : "border-gray-100 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "h-5 w-5 rounded-full border flex items-center justify-center transition-colors",
                          deliveryMethod === method.id ? "border-primary" : "border-gray-300"
                        )}>
                          {deliveryMethod === method.id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest">{method.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{method.time}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold">{method.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-14 uppercase tracking-widest text-xs font-bold" onClick={() => setCurrentStep('address')}>Back</Button>
                  <Button className="flex-[2] h-14 uppercase tracking-widest text-xs font-bold" onClick={() => setCurrentStep('payment')}>Continue to Payment</Button>
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-display uppercase tracking-tight border-b border-gray-100 pb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Payment Options */}
                  {[
                    { id: 'upi', name: 'UPI / QR (GPay, PhonePe, Paytm)', desc: 'Pay instantly via UPI app' },
                    { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Amex' },
                    { id: 'netbanking', name: 'Net Banking', desc: 'All major Indian banks supported' },
                    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  ].map((method) => (
                    <div 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "p-6 border cursor-pointer transition-all flex flex-col group",
                        paymentMethod === method.id ? "border-primary bg-secondary/30" : "border-gray-100 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "h-5 w-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
                          paymentMethod === method.id ? "border-primary" : "border-gray-300"
                        )}>
                          {paymentMethod === method.id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest">{method.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-tighter mt-1">{method.desc}</p>
                        </div>
                      </div>

                      {/* Expandable Forms */}
                      {paymentMethod === 'card' && method.id === 'card' && (
                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                          <Input label="Cardholder Name" placeholder="John Doe" />
                          <Input label="Card Number" placeholder="0000 0000 0000 0000" />
                          <div className="grid grid-cols-2 gap-4">
                            <Input label="Expiry Date" placeholder="MM/YY" />
                            <Input label="CVV" placeholder="•••" type="password" />
                          </div>
                        </div>
                      )}
                      
                      {paymentMethod === 'upi' && method.id === 'upi' && (
                        <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                          <Input label="UPI ID" placeholder="username@bank" />
                          <p className="text-[10px] text-gray-500 mt-2 italic">Or scan QR code on the next page.</p>
                        </div>
                      )}
                      
                      {paymentMethod === 'netbanking' && method.id === 'netbanking' && (
                        <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                          <select className="w-full h-12 px-4 border border-gray-200 text-xs uppercase tracking-widest outline-none focus:border-primary">
                            <option>Select Bank</option>
                            <option>HDFC Bank</option>
                            <option>ICICI Bank</option>
                            <option>State Bank of India</option>
                            <option>Axis Bank</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-14 uppercase tracking-widest text-xs font-bold" onClick={() => setCurrentStep('delivery')}>Back</Button>
                  <Button className="flex-[2] h-14 uppercase tracking-widest text-xs font-bold" onClick={() => setCurrentStep('review')}>Review Order</Button>
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-display uppercase tracking-tight border-b border-gray-100 pb-4">Review Your Order</h2>
                <div className="bg-secondary/20 p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Shipping Address</h4>
                      <p className="text-xs font-bold">{address.name}</p>
                      <p className="text-xs text-gray-600">{address.line1}, {address.city}</p>
                      <p className="text-xs text-gray-600">{address.state}, {address.pin}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Delivery</h4>
                      <p className="text-xs font-bold">{deliveryMethod === 'express' ? 'Express' : 'Standard'} Delivery</p>
                      <p className="text-xs text-gray-600">{deliveryMethod === 'express' ? '2-3 Business Days' : '5-7 Business Days'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 h-14 uppercase tracking-widest text-xs font-bold" onClick={() => setCurrentStep('payment')}>Back</Button>
                  <Button 
                    className="flex-[2] h-14 uppercase tracking-widest text-xs font-bold" 
                    onClick={handlePlaceOrder}
                    isLoading={isLoading}
                  >
                    Place Order • ₹{grandTotal.toLocaleString()}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-secondary p-6 space-y-6 sticky top-24">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] border-b border-gray-200 pb-4">Your Bag</h3>
              <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="h-16 w-12 relative bg-white flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-tight truncate w-32">{item.name}</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest">{item.size} • Qty: {item.quantity}</p>
                      <p className="text-[10px] font-bold">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Promo code" 
                    value={promoCode} 
                    onChange={(e) => setPromoCode(e.target.value)} 
                    disabled={!!appliedCoupon}
                    className="h-10 text-xs"
                  />
                  <Button 
                    className="h-10 px-4 text-xs font-bold" 
                    onClick={appliedCoupon ? useCart.getState().removeCoupon : handleApplyPromo}
                    isLoading={promoLoading}
                    variant={appliedCoupon ? "outline" : "primary"}
                  >
                    {appliedCoupon ? "Remove" : "Apply"}
                  </Button>
                </div>
                {promoError && <p className="text-red-500 text-[10px] mt-1">{promoError}</p>}
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-2">
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
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest pt-2 border-t border-gray-100 mt-2">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
