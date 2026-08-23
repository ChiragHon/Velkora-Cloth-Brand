'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Star, 
  Ticket, 
  Settings,
  Menu,
  Bell,
  Search
} from 'lucide-react';
import { cn } from '@/components/ui/Button';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="p-8">
          <h2 className="text-2xl font-display uppercase tracking-widest text-accent">VELKORA ADMIN</h2>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 p-4 text-[10px] uppercase tracking-widest font-bold transition-all rounded-lg group",
                  isActive ? "bg-accent text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/10">
          <Link href="/account/profile" className="flex items-center space-x-3 group">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center font-bold text-[10px]">AV</div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest">Admin User</p>
              <p className="text-[8px] text-gray-500 uppercase tracking-tighter">System Administrator</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-full h-10 pl-10 pr-4 bg-gray-50 border-none rounded-lg text-xs font-medium focus:ring-1 focus:ring-accent transition-all"
            />
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-gray-100" />
            <Link href="/" className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-primary transition-colors">
              View Storefront
            </Link>
          </div>
        </header>

        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
