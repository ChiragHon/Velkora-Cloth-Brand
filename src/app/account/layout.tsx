'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { 
  User, 
  Package, 
  LogOut,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/components/ui/Button';

const sidebarLinks = [
  { href: '/account/profile', label: 'My Profile', icon: User },
  // { href: '/account/orders', label: 'My Orders', icon: Package },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-16">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-16">
        {/* Sidebar */}
        <aside className="w-full md:w-72 flex-shrink-0 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-display uppercase tracking-tight">My Account</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
              Welcome back, {session?.user?.name || 'Guest'}
            </p>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between p-4 text-xs uppercase tracking-widest font-bold transition-all group",
                    isActive ? "bg-primary text-white" : "text-gray-500 hover:bg-secondary/50 hover:text-primary"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-400 group-hover:text-primary")} />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className={cn("h-3 w-3 transition-transform", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1")} />
                </Link>
              );
            })}
            
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center space-x-3 p-4 text-xs uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 transition-all mt-4 border-t border-gray-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-white border border-gray-50 p-8 md:p-12 shadow-sm min-h-[600px]">
          {children}
        </main>
      </div>
    </div>
  );
}
