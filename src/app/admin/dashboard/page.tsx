import React from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package
} from 'lucide-react';
import { cn } from '@/components/ui/Button';

export default function AdminDashboard() {
  const stats = [
    { label: "Today's Revenue", value: "₹45,290", change: "+12.5%", isPositive: true, icon: DollarSign },
    { label: "Total Orders", value: "128", change: "+8.2%", isPositive: true, icon: ShoppingBag },
    { label: "New Customers", value: "24", change: "-2.4%", isPositive: false, icon: Users },
    { label: "Avg. Order Value", value: "₹3,538", change: "+4.1%", isPositive: true, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display uppercase tracking-tight">Overview</h1>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-white border border-gray-100 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-50">Last 7 Days</button>
          <button className="px-4 py-2 bg-primary text-white text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-black/10">Download Report</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className={cn(
                  "flex items-center text-[10px] font-bold px-2 py-1 rounded-full",
                  stat.isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                )}>
                  {stat.isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold font-sans mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest border-b border-gray-50 pb-4 mb-8">Revenue Analytics</h3>
          <div className="flex-1 bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Chart Visualization Placeholder</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-widest border-b border-gray-50 pb-4 mb-6">Recent Orders</h3>
          <div className="space-y-6 flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-secondary flex items-center justify-center rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-tight">Order #ORD-829{i}</p>
                    <p className="text-[9px] text-gray-400 uppercase tracking-widest">2 items • 5 mins ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">₹2,999</p>
                  <p className="text-[8px] text-blue-500 uppercase font-bold tracking-widest">Pending</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-3 mt-6 border-t border-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-primary transition-colors">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
}
