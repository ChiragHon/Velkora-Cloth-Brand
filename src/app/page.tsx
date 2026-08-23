import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  Copy, 
  CheckCircle2, 
  Star,
  ChevronRight,
  Smartphone,
  Download,
  Gift
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-black overflow-x-hidden">
      {/* Hero Section (Preserved) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image unoptimized
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070"
            alt="Hero Fashion"
            fill
            className="object-cover brightness-90"
            priority
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 mt-[-100px]">
          <h1 className="text-white text-6xl md:text-9xl font-display font-bold tracking-tighter mb-8 leading-tight">
            Wear Your <br className="hidden md:block" /> Story.
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link 
              href="/shop" 
              className="px-12 py-4 bg-white text-black text-xs tracking-[0.3em] uppercase font-mono hover:bg-[#C8A97E] hover:text-white transition-all duration-500 w-full md:w-auto"
            >
              Shop Collection
            </Link>
            <Link 
              href="/shop/new-arrivals" 
              className="px-12 py-4 bg-black/20 backdrop-blur-md text-white border border-white/30 text-xs tracking-[0.3em] uppercase font-mono hover:bg-white hover:text-black transition-all duration-500 w-full md:w-auto"
            >
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/60">
          <span className="text-[10px] tracking-[0.5em] uppercase font-mono">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
        </div>
      </section>

      {/* 3. ANNOUNCEMENT / PROMO TICKER BANNER */}
      <div className="bg-[#f0ede8] py-2 relative z-40 border-b border-black/5">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block text-xs font-bold tracking-widest uppercase">
            <span className="mx-10">✨ FREE SHIPPING ON ORDERS ABOVE ₹499 ✨</span>
            <span className="mx-10">🎉 NEW ARRIVALS EVERY FRIDAY 🎉</span>
            <span className="mx-10">🏷️ USE CODE SAVE20 FOR 20% OFF 🏷️</span>
            <span className="mx-10">✨ FREE SHIPPING ON ORDERS ABOVE ₹499 ✨</span>
            <span className="mx-10">🎉 NEW ARRIVALS EVERY FRIDAY 🎉</span>
            <span className="mx-10">🏷️ USE CODE SAVE20 FOR 20% OFF 🏷️</span>
          </div>
        </div>
      </div>

      {/* 4. CATEGORY ICON STRIP */}
      <section className="py-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <h2 className="text-xl font-bold uppercase tracking-widest text-center mb-10 flex flex-col items-center gap-4">
          Shop By Category
          <div className="w-16 h-0.5 bg-accent"></div>
        </h2>
        
        <div className="flex overflow-x-auto justify-start xl:justify-center gap-8 pb-4 hide-scrollbar snap-x">
          {[
            { name: "Tops", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=200" },
            { name: "Dresses", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=200" },
            { name: "Jeans", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=200" },
            { name: "Kurtas", img: "/images/upload3.jpg" },
            { name: "T-Shirts", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200" },
            { name: "Ethnic", img: "/images/upload1.jpg" },
            { name: "Footwear", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=200" },
            { name: "Accessories", img: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=200" },
          ].map((cat, i) => (
            <Link href={`/shop?category=${cat.name.toLowerCase()}`} key={i} className="flex flex-col items-center gap-4 snap-start group min-w-[100px]">
              <div className="w-24 h-24 rounded-full overflow-hidden relative border-2 border-transparent group-hover:border-accent transition-all duration-300 p-1">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. DEALS / OFFERS BANNER STRIP */}
      <section className="py-12 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
          {/* Main Large Banner */}
          <Link href="/shop" className="relative group overflow-hidden bg-gray-100 rounded-lg">
            <Image src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=1000" alt="Sale" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <h3 className="text-white text-5xl font-display font-bold mb-2">END OF SEASON SALE</h3>
              <p className="text-white/90 text-lg font-bold mb-6">UP TO 50% OFF</p>
              <button className="px-8 py-3 border-2 border-white text-white font-bold text-xs uppercase tracking-widest w-fit hover:bg-white hover:text-black transition-colors">
                Shop Now
              </button>
            </div>
          </Link>
          
          {/* Stacked Small Banners */}
          <div className="grid grid-rows-2 gap-6 h-[600px]">
            <Link href="/shop" className="relative group overflow-hidden bg-gray-100 rounded-lg">
              <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800" alt="New" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center">
                <h3 className="text-white text-3xl font-display font-bold mb-2">NEW ARRIVALS</h3>
                <p className="text-white/90 text-sm font-bold mb-4">Starting at ₹999</p>
                <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Explore <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
            <Link href="/shop?category=accessories" className="relative group overflow-hidden bg-gray-100 rounded-lg">
              <Image src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800" alt="Accessories" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-center items-end text-right">
                <h3 className="text-white text-3xl font-display font-bold mb-2">LUXE ACCESSORIES</h3>
                <p className="text-white/90 text-sm font-bold mb-4">Complete Your Look</p>
                <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                  Shop Now <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TRENDING / NEW ARRIVALS PRODUCT CAROUSEL */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl font-bold uppercase tracking-widest flex flex-col gap-4">
              Trending Now
              <div className="w-16 h-0.5 bg-accent"></div>
            </h2>
            <Link href="/shop" className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-accent transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x">
            {[
              { img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=400", brand: "Allen Solly", name: "Classic Cotton Midi Dress", price: "₹1,399", original: "₹1,999", discount: "-30%" },
              { img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=400", brand: "Manyavar", name: "Printed Ethnic Kurta", price: "₹1,199", original: "₹1,799", discount: "-33%" },
              { img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400", brand: "Levis", name: "Slim Fit Denim Jeans", price: "₹2,499", original: "₹3,499", discount: "-28%" },
              { img: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=400", brand: "W for Women", name: "Floral Wrap Maxi Dress", price: "₹1,799", original: "₹2,499", discount: "-28%" },
              { img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400", brand: "H&M", name: "Oversized Graphic Tee", price: "₹699", original: "₹999", discount: "-30%" },
              { img: "/images/upload2.jpg", brand: "Libas", name: "Embroidered Lehenga Choli", price: "₹4,999", original: "₹7,499", discount: "-33%" },
            ].map((item, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] group snap-start bg-white rounded-lg p-3 hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-gray-100">
                <div className="relative h-[400px] bg-gray-100 rounded-md overflow-hidden mb-4">
                  <Image src={item.img} alt={item.name} fill className="object-cover" />
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest">{item.discount}</div>
                  {/* Wishlist Icon */}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm">
                    <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                  {/* Hover Actions */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-2 justify-center mb-3 text-white text-xs font-mono font-bold">
                      <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black cursor-pointer">S</span>
                      <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black cursor-pointer">M</span>
                      <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black cursor-pointer">L</span>
                    </div>
                    <button className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-3 hover:bg-gray-200 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="px-2">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{item.brand}</p>
                  <h3 className="font-bold mb-2 line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-accent font-bold">{item.price}</span>
                    <span className="text-sm text-gray-400 line-through">{item.original}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BRAND LOGOS HORIZONTAL SCROLL STRIP */}
      <section className="py-16 border-y border-gray-100 bg-[#FAFAF8]">
        <div className="max-w-screen-2xl mx-auto px-6">
          <h2 className="text-center text-sm font-bold uppercase tracking-[0.3em] text-gray-400 mb-10">Shop Top Brands</h2>
          <div className="overflow-hidden relative">
            <div className="flex gap-16 animate-marquee whitespace-nowrap items-center hover:[animation-play-state:paused]">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="inline-block px-8 text-2xl font-display font-bold text-gray-300 hover:text-black transition-colors cursor-pointer">
                  BRAND {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. SHOP BY OCCASION GRID */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-center mb-12 flex flex-col items-center gap-4">
            Shop The Look
            <div className="w-16 h-0.5 bg-accent"></div>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { name: "Work Wear", img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600" },
              { name: "Festive", img: "/images/upload2.jpg" },
              { name: "Party Wear", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600" },
              { name: "Casual Outing", img: "https://images.unsplash.com/photo-1522228115018-d838bcce5c3a?q=80&w=600" },
              { name: "Activewear", img: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?q=80&w=600" },
              { name: "Vacation", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600" },
            ].map((occasion, i) => (
              <Link href={`/shop?occasion=${occasion.name.toLowerCase()}`} key={i} className="group relative h-[300px] md:h-[450px] overflow-hidden rounded-lg">
                <Image src={occasion.img} alt={occasion.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300"></div>
                
                {/* Default Label */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white text-xl md:text-2xl font-display font-bold">{occasion.name}</h3>
                </div>
                
                {/* Hover Reveal Text */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. OFFERS / COUPONS SECTION */}
      <section className="py-20 px-6 md:px-12 bg-[#F8F9FA]">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-10 flex flex-col gap-4">
            Best Deals For You
            <div className="w-16 h-0.5 bg-accent"></div>
          </h2>

          <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar">
            {[
              { code: "FESTIVE25", title: "Flat 25% Off", desc: "On festive wear, min order ₹2499", color: "from-purple-500 to-indigo-600" },
              { code: "NEW15", title: "Extra 15% Off", desc: "For new users on first purchase", color: "from-emerald-400 to-teal-500" },
              { code: "FREESHIP", title: "Free Shipping", desc: "On all orders above ₹999", color: "from-amber-400 to-orange-500" },
            ].map((coupon, i) => (
              <div key={i} className={`min-w-[300px] md:min-w-[350px] p-6 rounded-2xl text-white bg-gradient-to-br ${coupon.color} relative overflow-hidden shadow-lg`}>
                <div className="absolute -right-6 -top-6 opacity-20"><Gift className="w-32 h-32" /></div>
                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-80">Limited Time Offer</p>
                  <h3 className="text-3xl font-display font-bold mb-2">{coupon.title}</h3>
                  <p className="text-sm opacity-90 mb-6">{coupon.desc}</p>
                  
                  <div className="flex items-center gap-2 bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/30">
                    <span className="flex-1 font-mono font-bold text-center tracking-widest">{coupon.code}</span>
                    <button className="bg-white text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center gap-2">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. RECENTLY VIEWED (Placeholder Demo) */}
      <section className="py-20 px-6 md:px-12 bg-white border-t border-gray-100">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-10 flex flex-col gap-4">
            Recently Viewed
            <div className="w-16 h-0.5 bg-gray-300"></div>
          </h2>
          
          <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar">
            {[
              { img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=300", name: "Printed Ethnic Kurta", price: "₹1,199" },
              { img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=300", name: "Slim Fit Denim Jeans", price: "₹2,499" },
              { img: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=300", name: "Floral Maxi Dress", price: "₹1,799" },
              { img: "/images/upload1.jpg", name: "Ethnic Salwar Suit", price: "₹2,299" },
            ].map((item, i) => (
              <div key={i} className="min-w-[200px] group cursor-pointer">
                <div className="relative h-[250px] bg-gray-100 rounded-md overflow-hidden mb-3">
                  <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-sm mb-1 line-clamp-1">{item.name}</h3>
                <span className="text-sm font-bold">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. LOYALTY / MEMBERSHIP PROGRAM BANNER */}
      <section className="py-0">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          <div className="md:w-1/2 bg-[#0A0A0A] text-white p-12 md:p-24 flex flex-col justify-center">
            <h4 className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4">Velkora Exclusive</h4>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">JOIN OUR REWARDS CLUB</h2>
            <p className="text-white/70 mb-10 text-sm leading-relaxed max-w-md">
              Earn points on every purchase, get early access to sales, and enjoy exclusive birthday gifts.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-accent" /> 1 Point for every ₹100 spent</li>
              <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-accent" /> Free shipping on all orders</li>
              <li className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5 text-accent" /> VIP Support</li>
            </ul>
            <Link href="/account/profile" className="bg-accent text-white font-bold uppercase tracking-widest text-xs py-4 px-10 hover:bg-accent/80 transition-colors w-fit inline-block text-center">
              Join Now For Free
            </Link>
          </div>
          <div className="md:w-1/2 relative min-h-[300px]">
            <Image src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1000" alt="Loyalty" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* 12. TESTIMONIALS / REVIEWS SECTION */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-center mb-16 flex flex-col items-center gap-4">
            What Our Customers Say
            <div className="w-16 h-0.5 bg-accent"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Priya S.", loc: "Mumbai", quote: "The quality is absolutely phenomenal. I wore the linen dress to a brunch and got so many compliments!" },
              { name: "Rahul M.", loc: "Delhi", quote: "Super fast shipping and the packaging felt so premium. Will definitely be shopping here again." },
              { name: "Anita K.", loc: "Bangalore", quote: "Finally a brand that understands modern ethnic wear. The fit was perfect right out of the box." },
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <div className="flex gap-1 mb-6 text-[#F59E0B]">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-600 font-sans italic mb-8 leading-relaxed">"{review.quote}"</p>
                <div className="mt-auto">
                  <p className="font-bold uppercase tracking-widest text-sm">{review.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{review.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. APP DOWNLOAD BANNER */}
      <section className="bg-[#1e293b] text-white">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-display font-bold">SHOP ON THE GO</h2>
            <p className="text-white/70 max-w-md mx-auto md:mx-0">
              Download the VELKORA app for a faster checkout, app-only discounts, and real-time order tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <button className="flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold">Get it on</p>
                  <p className="text-sm font-bold -mt-1">Google Play</p>
                </div>
              </button>
              <button className="flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                <Smartphone className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-bold">Download on the</p>
                  <p className="text-sm font-bold -mt-1">App Store</p>
                </div>
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center relative">
            <div className="w-64 h-96 bg-gray-800 rounded-3xl border-8 border-black shadow-2xl overflow-hidden relative rotate-3 transform">
              {/* Mock App Screen */}
              <div className="absolute inset-0 bg-[#FAFAF8] flex flex-col">
                <div className="bg-white p-4 shadow-sm text-center">
                  <span className="font-display font-bold text-black text-xl">VELKORA</span>
                </div>
                <Image src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=300" alt="App UI" width={300} height={300} className="w-full h-48 object-cover" />
                <div className="p-4 bg-white flex-1">
                  <p className="font-bold text-black mb-1">New Arrivals</p>
                  <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                  <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
