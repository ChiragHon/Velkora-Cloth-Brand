'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Camera, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <h2 className="text-2xl font-display uppercase tracking-tight">Personal Profile</h2>
        <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-green-600 bg-green-50 px-3 py-1 border border-green-100">
          <ShieldCheck className="h-4 w-4" />
          <span>Account Verified</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative h-32 w-32 group cursor-pointer">
            <div className="h-full w-full rounded-full bg-secondary border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
              <span className="text-2xl font-display text-gray-400">CT</span>
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Update Photo</p>
        </div>

        {/* Basic Info Form */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name" defaultValue={session?.user?.name || ''} />
            <Input label="Email Address" defaultValue={session?.user?.email || ''} disabled />
            <Input label="Phone Number" defaultValue="+91 98765 43210" />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-primary uppercase tracking-wider">Gender</label>
              <select className="flex h-12 w-full border border-gray-200 bg-white px-4 py-2 text-base transition-colors focus:outline-none focus:ring-1 focus:ring-primary uppercase text-xs font-bold tracking-widest">
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>
          <Button className="h-14 px-12 uppercase tracking-widest text-xs font-bold" isLoading={isLoading} onClick={() => setIsLoading(true)}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Security Section */}
      <div className="pt-12 border-t border-gray-100 space-y-8">
        <h3 className="text-xl font-display uppercase tracking-tight">Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Current Password" type="password" placeholder="••••••••" />
          <div className="hidden md:block" />
          <Input label="New Password" type="password" placeholder="••••••••" />
          <Input label="Confirm New Password" type="password" placeholder="••••••••" />
        </div>
        <Button variant="outline" className="h-14 px-12 uppercase tracking-widest text-xs font-bold border-primary">
          Change Password
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="pt-12 border-t border-gray-100 space-y-6">
        <div className="bg-red-50 p-8 border border-red-100 space-y-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Danger Zone</h4>
          </div>
          <p className="text-xs text-red-700/70 font-sans leading-relaxed max-w-xl">
            Deleting your account is permanent. This will remove all your order history, saved addresses, and reward points. This action cannot be undone.
          </p>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest text-[10px] font-bold">
            Delete My Account
          </Button>
        </div>
      </div>
    </div>
  );
}
