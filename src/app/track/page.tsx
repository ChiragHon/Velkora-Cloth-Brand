"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";

export default function TrackPage() {
  const [orderId, setOrderId] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      router.push(`/account/orders/${orderId.trim()}`);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="pt-40 pb-24 px-6 md:px-12 max-w-screen-md mx-auto">
        <h4 className="text-xs tracking-[0.3em] uppercase font-mono text-[#C8A97E] mb-4">Logistics</h4>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">Track Your Order</h1>
        <p className="text-black/60 mb-10 text-lg leading-relaxed">Enter your order ID below to get real-time updates on your shipment.</p>
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Order ID (e.g. ORD-12345)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border border-black/20 px-6 py-4 bg-transparent focus:outline-none focus:border-black text-sm font-mono"
            required
          />
          <button type="submit" className="px-10 py-4 bg-black text-white text-xs tracking-[0.3em] uppercase font-mono hover:bg-[#C8A97E] transition-colors">
            Track
          </button>
        </form>
        <p className="mt-6 text-xs text-black/40 font-mono">You can find your order ID in your confirmation email or account orders page.</p>
      </div>
      <Footer />
    </main>
  );
}
