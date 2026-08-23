import React from 'react';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Package, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/components/ui/Button';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <h2 className="text-2xl font-display uppercase tracking-tight">Order History</h2>
        
        {/* Search/Filter Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search all orders" 
            className="w-full h-10 pl-10 pr-4 bg-secondary/30 border-none text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Package className="h-12 w-12 text-gray-200" />
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">You haven't placed any orders yet.</p>
          <Link href="/shop" className="border-primary uppercase tracking-widest text-[10px] h-10 px-6 inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] border text-primary hover:bg-primary hover:text-white">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-100 p-6 md:p-8 space-y-6 hover:border-gray-300 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-50 pb-6">
                <div className="flex items-center space-x-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Order Number</p>
                    <p className="text-xs font-bold font-sans">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Date Placed</p>
                    <p className="text-xs font-bold font-sans">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Total Amount</p>
                    <p className="text-xs font-bold font-sans text-accent">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={cn(
                    "text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 border",
                    order.status === 'DELIVERED' ? "bg-green-50 text-green-600 border-green-100" :
                    order.status === 'CANCELLED' ? "bg-red-50 text-red-600 border-red-100" :
                    "bg-blue-50 text-blue-600 border-blue-100"
                  )}>
                    {order.status}
                  </span>
                  <Link href={`/account/orders/${order.id}`} className="h-8 p-1 inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] text-primary hover:bg-secondary">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-4">
                  {order.items.map((item, i) => (
                    <div key={item.id} className="h-16 w-12 border-2 border-white relative bg-secondary overflow-hidden shadow-sm" style={{ zIndex: 10 - i }}>
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="h-16 w-12 bg-gray-100 flex items-center justify-center text-[10px] font-bold z-0 border-2 border-white">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Link href={`/account/orders/${order.id}`} className="h-10 text-[10px] uppercase tracking-widest font-bold px-6 border-gray-200 inline-flex items-center justify-center transition-all duration-200 active:scale-[0.98] border text-primary hover:bg-primary hover:text-white">
                    View Details
                  </Link>
                  {order.status === 'DELIVERED' && (
                    <Button className="h-10 text-[10px] uppercase tracking-widest font-bold px-6">Buy Again</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
