import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      address: true,
    }
  });

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link href="/shop" className="text-primary hover:underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-8 md:p-12 text-center rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-display uppercase tracking-tight mb-4">Thank you for your order!</h1>
          <p className="text-gray-500 font-sans mb-8">
            We've received your order and will contact you as soon as your package is shipped. You can find your purchase information below.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/account/orders/${order.id}`} className="w-full sm:w-auto px-8 py-4 bg-primary text-white uppercase tracking-widest text-xs font-bold hover:bg-black/90 transition-colors">
              View Order Status
            </Link>
            <Link href="/shop" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 uppercase tracking-widest text-xs font-bold hover:bg-gray-50 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-display uppercase tracking-tight border-b border-gray-100 pb-4 mb-6">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Order Number</p>
              <p className="text-sm font-bold font-sans">#{order.id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Date</p>
              <p className="text-sm font-bold font-sans">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Payment Method</p>
              <p className="text-sm font-bold font-sans">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {order.status}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Items Summary</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-12 relative bg-secondary rounded overflow-hidden">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-4">Shipping Address</h3>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-black">{order.address.name}</span><br/>
                {order.address.line1}<br/>
                {order.address.city}, {order.address.state} {order.address.pin}<br/>
                {order.address.country}<br/>
                {order.address.phone}
              </p>
            </div>
            
            <div className="space-y-3 bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>₹{order.tax.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
