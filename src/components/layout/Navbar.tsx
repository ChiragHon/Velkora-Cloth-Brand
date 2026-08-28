"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Heart, Menu, X, ChevronDown, MapPin, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/useCart";
import { useWishlist } from "@/store/useWishlist";

type MegaSection = { title: string; items: { name: string; href: string }[] };
type NavCategory = {
  name: string;
  href: string;
  sections?: MegaSection[];
  promo?: { title: string; subtitle: string; image: string; href: string };
};

const navCategories: NavCategory[] = [
  {
    name: "WOMEN",
    href: "/shop?category=women",
    sections: [
      {
        title: "Western Wear",
        items: [
          { name: "Tops & Tees", href: "/shop?category=women-tops" },
          { name: "Dresses", href: "/shop?category=women-dresses" },
          { name: "Jeans", href: "/shop?category=women-jeans" },
          { name: "Trousers", href: "/shop?category=women-trousers" },
        ],
      },
      {
        title: "Ethnic Wear",
        items: [
          { name: "Kurtas & Suits", href: "/shop?category=women-kurtas" },
          { name: "Sarees", href: "/shop?category=women-sarees" },
        ],
      },
      {
        title: "By Occasion",
        items: [
          { name: "Party Wear", href: "/shop?occasion=party" },
          { name: "Work Wear", href: "/shop?occasion=work" },
          { name: "Festive", href: "/shop?occasion=festive" },
        ],
      },
    ],
    promo: {
      title: "New Season",
      subtitle: "Spring / Summer Collection",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400",
      href: "/shop?category=women",
    },
  },
  {
    name: "MEN",
    href: "/shop?category=men",
    sections: [
      {
        title: "Topwear",
        items: [
          { name: "T-Shirts", href: "/shop?category=men-tshirts" },
          { name: "Casual Shirts", href: "/shop?category=men-casual-shirts" },
          { name: "Formal Shirts", href: "/shop?category=men-formal-shirts" },
          { name: "Jackets", href: "/shop?category=men-jackets" },
        ],
      },
      {
        title: "Bottomwear",
        items: [
          { name: "Jeans", href: "/shop?category=men-jeans" },
          { name: "Trousers", href: "/shop?category=men-trousers" },
          { name: "Shorts", href: "/shop?category=men-shorts" },
        ],
      },
      {
        title: "By Occasion",
        items: [
          { name: "Smart Casuals", href: "/shop?occasion=smart-casual" },
          { name: "Office Wear", href: "/shop?occasion=office" },
          { name: "Activewear", href: "/shop?occasion=active" },
        ],
      },
    ],
    promo: {
      title: "Denim Studio",
      subtitle: "Premium Denim Collection",
      image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=400",
      href: "/shop?category=men",
    },
  },
  {
    name: "KIDS",
    href: "/shop?category=kids",
    sections: [
      {
        title: "Boys",
        items: [
          { name: "T-Shirts", href: "/shop?category=boys-tshirts" },
          { name: "Jeans", href: "/shop?category=boys-jeans" },
        ],
      },
      {
        title: "Girls",
        items: [
          { name: "Dresses", href: "/shop?category=girls-dresses" },
          { name: "Tops", href: "/shop?category=girls-tops" },
        ],
      },
    ],
    promo: {
      title: "Playful Prints",
      subtitle: "New Kids Collection",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=400",
      href: "/shop?category=kids",
    },
  },
  {
    name: "ACCESSORIES",
    href: "/shop?category=accessories",
    sections: [
      {
        title: "Jewelry",
        items: [
          { name: "Necklaces", href: "/shop?category=necklaces" },
          { name: "Earrings", href: "/shop?category=earrings" },
        ],
      },
      {
        title: "Bags & Belts",
        items: [
          { name: "Handbags", href: "/shop?category=handbags" },
          { name: "Belts", href: "/shop?category=belts" },
        ],
      },
    ],
    promo: {
      title: "Luxe Extras",
      subtitle: "Elevate Your Look",
      image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400",
      href: "/shop?category=accessories",
    },
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { items: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const megaTimeout = useRef<NodeJS.Timeout | null>(null);

  const isHomepage = pathname === "/";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // True transparent on homepage before scrolling; always white on other pages
  const isTransparent = isHomepage && !isScrolled;

  const handleMegaEnter = (name: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setActiveMega(name);
  };
  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 120);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* MAIN NAVBAR */}
      <nav
        className={cn(
          "transition-all duration-500 px-6 md:px-12",
          isTransparent
            ? "bg-transparent py-6"
            : "bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-black/5"
        )}
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between relative">
          {/* LEFT SIDE: Mobile Hamburger & Desktop Nav Links */}
          <div className="flex-1 flex items-center justify-start">
            <button className="md:hidden p-1" onClick={() => setIsOpen(true)}>
              <Menu className={cn("w-6 h-6", isTransparent ? "text-white" : "text-black")} />
            </button>

            {/* DESKTOP NAV LINKS */}
            <div className="hidden md:flex items-center gap-10">
            {navCategories.map((cat) => (
              <div
                key={cat.name}
                className="flex items-center"
                onMouseEnter={() => cat.sections ? handleMegaEnter(cat.name) : undefined}
                onMouseLeave={handleMegaLeave}
              >
                <Link
                  href={cat.href}
                  className={cn(
                    "text-[11px] font-bold tracking-[0.25em] uppercase flex items-center gap-1 py-1 border-b-2 transition-all duration-200",
                    isTransparent
                      ? "text-white/90 hover:text-white border-transparent hover:border-white"
                      : "text-black hover:text-black border-transparent hover:border-black"
                  )}
                >
                  {cat.name}
                  {cat.sections && <ChevronDown className={cn("w-3 h-3 transition-transform", activeMega === cat.name && "rotate-180")} />}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* FULL-WIDTH MEGA DROPDOWN — rendered outside the nav item so it never overflows */}
        <AnimatePresence>
          {navCategories.map((cat) =>
            cat.sections && activeMega === cat.name ? (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 right-0 top-full bg-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] border-t-2 border-[#C8A97E] z-50"
                onMouseEnter={() => handleMegaEnter(cat.name)}
                onMouseLeave={handleMegaLeave}
              >
                <div className="max-w-screen-2xl mx-auto px-12 py-10 flex gap-12">
                  <div className="flex-1 grid grid-cols-3 gap-10">
                    {cat.sections.map((sec) => (
                      <div key={sec.title}>
                        <h4 className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] font-bold text-black mb-5">
                          {sec.title}
                          <span className="flex-1 h-px bg-gradient-to-r from-[#C8A97E] to-transparent" />
                        </h4>
                        <ul className="space-y-3">
                          {sec.items.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                onClick={() => setActiveMega(null)}
                                className="group/item flex items-center text-sm text-gray-500 hover:text-black font-sans transition-colors duration-200"
                              >
                                <span className="w-0 h-px bg-[#C8A97E] transition-all duration-300 group-hover/item:w-4 group-hover/item:mr-2 shrink-0" />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {cat.promo && (
                    <Link
                      href={cat.promo.href}
                      onClick={() => setActiveMega(null)}
                      className="group relative w-64 shrink-0 overflow-hidden"
                    >
                      <div className="relative h-full min-h-[220px]">
                        <img
                          src={cat.promo.image}
                          alt={cat.promo.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
                        <div className="absolute bottom-5 left-5 right-5 text-white">
                          <p className="text-[10px] uppercase tracking-[0.25em] font-bold">{cat.promo.title}</p>
                          <p className="text-xl font-display mt-2 leading-tight">{cat.promo.subtitle}</p>
                          <span className="inline-flex items-center gap-2 mt-3 text-[10px] uppercase tracking-widest font-bold text-[#C8A97E]">
                            Explore
                            <span className="w-5 h-px bg-[#C8A97E] transition-all duration-300 group-hover:w-8" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

          {/* CENTER LOGO */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-display font-bold text-3xl tracking-tighter shrink-0 text-black">
            VELKORA
          </Link>

          {/* RIGHT ICONS */}
          <div className={cn("flex items-center justify-end gap-1 flex-1 shrink-0", isTransparent ? "text-white" : "text-black")}>
            <button className="p-2 hover:opacity-60 transition-opacity" aria-label="Search">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <Link href="/account/profile" className="hidden md:flex p-2 hover:opacity-60 transition-opacity" aria-label="Account">
              <User className="w-[18px] h-[18px]" />
            </Link>
            <Link href="/wishlist" className="hidden md:flex p-2 hover:opacity-60 transition-opacity relative" aria-label="Wishlist">
              <Heart className="w-[18px] h-[18px]" />
              {mounted && wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#C8A97E] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono leading-none">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="p-2 hover:opacity-60 transition-opacity relative" aria-label="Cart">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {mounted && cartItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#C8A97E] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono leading-none">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-[80vw] max-w-xs bg-white z-[70] flex flex-col p-8 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-display font-bold text-2xl">VELKORA</span>
                <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex flex-col gap-6">
                {navCategories.map((cat) => (
                  <div key={cat.name}>
                    <Link
                      href={cat.href}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-bold tracking-widest uppercase"
                    >
                      {cat.name}
                    </Link>
                    {cat.sections && (
                      <div className="mt-3 ml-4 flex flex-col gap-2 border-l border-gray-100 pl-4">
                        {cat.sections.map((sec) => sec.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-xs text-gray-500 hover:text-black transition-colors"
                          >
                            {item.name}
                          </Link>
                        )))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-4">
                <Link href="/account/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                  <User className="w-4 h-4" /> Account
                </Link>
                <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                  <Heart className="w-4 h-4" /> Wishlist
                </Link>
                <Link href="/track" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                  Track Order
                </Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest">
                  Contact Us
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
