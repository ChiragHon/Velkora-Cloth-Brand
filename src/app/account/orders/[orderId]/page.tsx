import React from 'react';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Package, Truck, CheckCircle2, Clock, MapPin, CreditCard, ChevronLeft, Phone, Mail, ShieldCheck, RefreshCcw } from 'lucide-react';
import { cn } from '@/components/ui/Button';

const ORDER_STAGES = [
  { key: 'PLACED', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2, description: 'Payment verified & order confirmed' },
  { key: 'PROCESSING', label: 'Processing', icon: Clock, description: 'Your items are being prepared' },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck, description: 'On its way to the courier partner' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck, description: 'Your order is nearby!' },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2, description: 'Successfully delivered' },
];

function getStageIndex(status: string): number {
  const map: Record<string, number> = {
    PENDING: 0,
    PLACED: 0,
    CONFIRMED: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    OUT_FOR_DELIVERY: 4,
    DELIVERED: 5,
    CANCELLED: -1,
  };
  return map[status] ?? 1;
}

function simulateDate(baseDate: Date, daysToAdd: number): string {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + daysToAdd);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      address: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!order) notFound();

  const currentStageIndex = getStageIndex(order.status);
  const isCancelled = order.status === 'CANCELLED';

  // Build timestamps from history or simulate them
  const historyMap = new Map<string, Date>();
  for (const h of order.statusHistory) {
    historyMap.set(h.status, h.createdAt);
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Back Link & Header */}
      <div className="space-y-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Orders</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-display uppercase tracking-tight">
              Order #{order.id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={cn(
              "text-[9px] uppercase tracking-widest font-bold px-4 py-2 border",
              isCancelled ? "bg-red-50 text-red-600 border-red-100" :
              order.status === 'DELIVERED' ? "bg-green-50 text-green-600 border-green-100" :
              "bg-blue-50 text-blue-600 border-blue-100"
            )}>
              {order.status.replace(/_/g, ' ')}
            </span>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Total</p>
              <p className="text-lg font-display">₹{order.total.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Timeline + Items */}
        <div className="lg:col-span-8 space-y-12">
          {/* Visual Timeline */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-100 pb-4">
              Order Tracking
            </h3>

            {isCancelled ? (
              <div className="p-8 bg-red-50 border border-red-100 text-center space-y-2">
                <p className="text-sm font-bold text-red-600 uppercase tracking-widest">Order Cancelled</p>
                <p className="text-xs text-red-500">This order has been cancelled. Refund will be processed within 5-7 business days.</p>
              </div>
            ) : (
              <div className="relative pl-8 space-y-0">
                {ORDER_STAGES.map((stage, i) => {
                  const isCompleted = i < currentStageIndex;
                  const isCurrent = i === currentStageIndex;
                  const isFuture = i > currentStageIndex;
                  const Icon = stage.icon;

                  const timestamp = historyMap.get(stage.key)
                    ? new Date(historyMap.get(stage.key)!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                    : isCompleted || isCurrent
                      ? simulateDate(order.createdAt, i)
                      : null;

                  return (
                    <div key={stage.key} className="relative flex items-start pb-10 last:pb-0">
                      {/* Vertical Line */}
                      {i < ORDER_STAGES.length - 1 && (
                        <div
                          className={cn(
                            "absolute left-[11px] top-[28px] w-[2px] h-[calc(100%-8px)]",
                            isCompleted ? "bg-green-500" : isCurrent ? "bg-gradient-to-b from-green-500 to-gray-200" : "bg-gray-200"
                          )}
                        />
                      )}

                      {/* Dot */}
                      <div className={cn(
                        "relative z-10 flex items-center justify-center h-6 w-6 rounded-full border-2 shrink-0 -ml-3",
                        isCompleted ? "border-green-500 bg-green-500 text-white" :
                        isCurrent ? "border-primary bg-primary text-white animate-pulse" :
                        "border-gray-200 bg-white text-gray-300"
                      )}>
                        {isCompleted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Icon className="h-3 w-3" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <p className={cn(
                            "text-xs font-bold uppercase tracking-widest",
                            isCompleted ? "text-green-600" : isCurrent ? "text-primary" : "text-gray-300"
                          )}>
                            {stage.label}
                          </p>
                          {timestamp && (
                            <span className="text-[10px] text-gray-400 font-sans">{timestamp}</span>
                          )}
                        </div>
                        <p className={cn(
                          "text-[10px] mt-1",
                          isFuture ? "text-gray-300" : "text-gray-500"
                        )}>
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-100 pb-4">
              Items Ordered ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-6 p-4 border border-gray-50 hover:border-gray-200 transition-colors">
                  <div className="h-20 w-16 relative bg-secondary flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold uppercase tracking-tight">{item.name}</p>
                    <div className="flex space-x-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                      {item.color && <span>Color: <span className="text-primary">{item.color}</span></span>}
                      {item.size && <span>Size: <span className="text-primary">{item.size}</span></span>}
                      <span>Qty: <span className="text-primary">{item.quantity}</span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-gray-400">₹{item.price.toLocaleString()} each</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summary + Address */}
        <div className="lg:col-span-4 space-y-8">
          {/* Order Summary */}
          <div className="bg-secondary p-6 space-y-4 sticky top-24">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] border-b border-gray-200 pb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500 uppercase tracking-widest">Subtotal</span>
                <span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs font-medium text-green-600">
                  <span className="uppercase tracking-widest">Discount</span>
                  <span>-₹{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500 uppercase tracking-widest">Shipping</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500 uppercase tracking-widest">GST</span>
                <span>₹{order.tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest">Total</span>
                  <span className="text-xl font-display">₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                  {order.paymentMethod.replace(/_/g, ' ')}
                </span>
              </div>
              <span className={cn(
                "inline-block text-[9px] uppercase tracking-widest font-bold px-2 py-1 border",
                order.paymentStatus === 'PAID' ? "bg-green-50 text-green-600 border-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"
              )}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border border-gray-100 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] border-b border-gray-100 pb-3 flex items-center space-x-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>Delivery Address</span>
            </h3>
            <div className="space-y-1">
              <p className="text-sm font-bold">{order.address.name}</p>
              <p className="text-xs text-gray-600 font-sans">{order.address.line1}</p>
              <p className="text-xs text-gray-600 font-sans">{order.address.city}, {order.address.state} - {order.address.pin}</p>
              <p className="text-xs text-gray-600 font-sans">{order.address.country}</p>
              <div className="flex items-center space-x-2 pt-2">
                <Phone className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{order.address.phone}</span>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="border border-gray-100 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] border-b border-gray-100 pb-3">
              Need Help?
            </h3>
            <div className="space-y-3">
              <Link href="/contact" className="flex items-center space-x-3 text-xs text-gray-600 hover:text-primary transition-colors group">
                <Mail className="h-4 w-4 group-hover:text-primary" />
                <span>Contact Support</span>
              </Link>
              <Link href="/faq" className="flex items-center space-x-3 text-xs text-gray-600 hover:text-primary transition-colors group">
                <ShieldCheck className="h-4 w-4 group-hover:text-primary" />
                <span>Return & Exchange Policy</span>
              </Link>
              <Link href="/faq" className="flex items-center space-x-3 text-xs text-gray-600 hover:text-primary transition-colors group">
                <RefreshCcw className="h-4 w-4 group-hover:text-primary" />
                <span>Track Another Order</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
