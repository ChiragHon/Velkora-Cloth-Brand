import React from 'react';
import prisma from '@/lib/prisma';
import { updateOrderStatus } from './actions';
import { Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      address: true,
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-display uppercase tracking-tight">Order Management</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Manage and fulfill customer orders</p>
        </div>
      </div>

      <div className="bg-white p-4 border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
              <th className="px-6 py-4 font-bold">Order ID</th>
              <th className="px-6 py-4 font-bold">Customer</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Total</th>
              <th className="px-6 py-4 font-bold text-center">Status</th>
              <th className="px-6 py-4 font-bold text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-xs font-bold font-mono">{order.id.slice(-8).toUpperCase()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold">{order.address.name}</p>
                  <p className="text-[10px] text-gray-500">{order.user?.email || order.guestEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold">₹{order.total.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-full border ${
                    order.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-100' :
                    order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    'bg-yellow-50 text-yellow-600 border-yellow-100'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={async (formData) => {
                    'use server';
                    const newStatus = formData.get('status') as string;
                    await updateOrderStatus(order.id, newStatus);
                  }} className="flex items-center justify-end space-x-2">
                    <select name="status" defaultValue={order.status} className="text-xs border border-gray-200 rounded px-2 py-1 uppercase font-bold tracking-wider">
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <Button type="submit" size="sm" className="h-8 text-[10px]">Update</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
