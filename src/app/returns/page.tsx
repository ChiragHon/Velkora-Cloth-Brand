import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Returns & Exchange | VELKORA" };

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="pt-40 pb-24 px-6 md:px-12 max-w-screen-lg mx-auto">
        <h4 className="text-xs tracking-[0.3em] uppercase font-mono text-[#C8A97E] mb-4">Policy</h4>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-12 leading-tight">Returns &amp; Exchange</h1>
        <div className="grid md:grid-cols-2 gap-12">
          {[
            { title: "Easy Returns", body: "We offer hassle-free returns within 30 days of delivery. Items must be unused, unwashed, and in original packaging with all tags attached." },
            { title: "Exchange Policy", body: "Exchanges for size or color are free on your first request per order. Simply initiate from your account orders page." },
            { title: "Refund Timeline", body: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. Original payment method will be credited." },
            { title: "Non-Returnable Items", body: "Sale items, intimates, and customized products are final sale and cannot be returned or exchanged." },
          ].map(item => (
            <div key={item.title} className="border-t border-black/10 pt-8">
              <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
              <p className="text-black/60 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
