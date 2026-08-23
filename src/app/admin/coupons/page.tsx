import React from 'react';
import prisma from '@/lib/prisma';
import { createCoupon, toggleCouponStatus } from './actions';
import { Ticket, Plus } from 'lucide-react';
import { Button, cn } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { code: 'asc' },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display uppercase tracking-tight">Promo Codes</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Manage discount codes and promotions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 border border-gray-100 space-y-6">
            <h2 className="text-lg font-display uppercase tracking-tight border-b border-gray-100 pb-4">Add New Code</h2>
            <form action={createCoupon} className="space-y-4">
              <Input label="Coupon Code" name="code" placeholder="e.g. SUMMER50" required />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary uppercase tracking-wider">Discount Type</label>
                <select name="type" className="flex h-12 w-full border border-gray-200 bg-white px-4 py-2 text-base transition-colors focus:outline-none focus:ring-1 focus:ring-primary uppercase text-xs font-bold tracking-widest">
                  <option value="FIXED">Fixed Amount (₹)</option>
                  <option value="PERCENTAGE">Percentage (%)</option>
                </select>
              </div>

              <Input label="Discount Value" name="value" type="number" step="0.01" required />
              <Input label="Minimum Order Amount (₹)" name="minOrder" type="number" step="0.01" defaultValue="0" />

              <Button type="submit" className="w-full h-12 mt-4 uppercase tracking-widest text-[10px] font-bold">
                <Plus className="h-4 w-4 mr-2" />
                Create Code
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <th className="px-6 py-4 font-bold">Code</th>
                  <th className="px-6 py-4 font-bold">Discount</th>
                  <th className="px-6 py-4 font-bold text-center">Uses</th>
                  <th className="px-6 py-4 font-bold text-center">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Ticket className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-bold font-mono text-primary">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold">
                        {coupon.type === 'PERCENTAGE' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                      </p>
                      {coupon.minOrder > 0 && <p className="text-[9px] text-gray-500 uppercase">Min ₹{coupon.minOrder}</p>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs font-bold">{coupon.usedCount}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-full border",
                        coupon.isActive ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                      )}>
                        {coupon.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <form action={async () => {
                        'use server';
                        await toggleCouponStatus(coupon.id, !coupon.isActive);
                      }}>
                        <Button type="submit" variant="outline" size="sm" className="h-8 text-[10px]">
                          {coupon.isActive ? 'Disable' : 'Enable'}
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
