"use client";

import React from "react";
import Link from "next/link";
import { 
  Camera,
  Share2,
  Send,
  Video,
  ArrowRight,
  Truck,
  RefreshCcw,
  ShieldCheck,
  Gift,
  HeadphonesIcon
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 px-6 md:px-12 font-sans">
      <div className="max-w-screen-2xl mx-auto space-y-16">
        
        {/* Row 1: Info Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Socials */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-3xl font-display font-bold">VELKORA</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Curating premium, sustainable fashion for the modern individual. Wear Your Story.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Camera className="w-4 h-4" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Share2 className="w-4 h-4" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Send className="w-4 h-4" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Video className="w-4 h-4" /></Link>
            </div>
          </div>

          {/* Col 2: Customer Service */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-bold mb-6 text-white/50">Customer Service</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/track" className="text-white/80 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link href="/returns" className="text-white/80 hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="text-white/80 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/size-guide" className="text-white/80 hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-bold mb-6 text-white/50">Company</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-bold mb-6 text-white/50">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/shop" className="text-white/80 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop" className="text-white/80 hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link href="/shop" className="text-accent hover:text-white transition-colors">Sale</Link></li>
              <li><Link href="/account/profile" className="text-white/80 hover:text-white transition-colors">Gift Cards</Link></li>
              <li><Link href="/account/profile" className="text-white/80 hover:text-white transition-colors">Refer a Friend</Link></li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-bold mb-6 text-white/50">Newsletter</h4>
            <p className="text-sm text-white/80 mb-4">Subscribe for exclusive deals, new collection previews, and style tips.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                required
              />
              <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-3 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
          
        </div>

        {/* Row 2: Trust Badges Strip */}
        <div className="py-8 border-y border-white/10 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><Truck className="w-5 h-5 text-white" /></div>
            <span className="text-[10px] uppercase tracking-widest font-bold">Free Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><RefreshCcw className="w-5 h-5 text-white" /></div>
            <span className="text-[10px] uppercase tracking-widest font-bold">Easy Returns</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-white" /></div>
            <span className="text-[10px] uppercase tracking-widest font-bold">Secure Payment</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><Gift className="w-5 h-5 text-white" /></div>
            <span className="text-[10px] uppercase tracking-widest font-bold">Gift Wrapping</span>
          </div>
          <div className="flex flex-col items-center gap-3 col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><HeadphonesIcon className="w-5 h-5 text-white" /></div>
            <span className="text-[10px] uppercase tracking-widest font-bold">24/7 Support</span>
          </div>
        </div>

        {/* Row 3 & 4: Payment Icons & Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
          
          <div className="flex items-center gap-4 opacity-50">
            {/* Mock Payment Logos using text for simplicity, in a real app these would be SVGs */}
            <span className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded">VISA</span>
            <span className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded">MASTERCARD</span>
            <span className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded">UPI</span>
            <span className="text-[10px] font-bold border border-white/20 px-2 py-1 rounded">PAYTM</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] tracking-widest text-white/50">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          </div>

          <div className="flex flex-col items-end text-[11px] text-white/50 gap-1">
            <span className="tracking-widest">© 2025 VELKORA. All Rights Reserved.</span>
            <span className="flex items-center gap-1">Made with <span className="text-red-500">❤️</span> in India</span>
          </div>

        </div>
      </div>
    </footer>
  );
};
