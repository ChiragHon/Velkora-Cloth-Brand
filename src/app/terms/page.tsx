import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Terms of Service | VELKORA" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="pt-40 pb-24 px-6 md:px-12 max-w-screen-md mx-auto">
        <h4 className="text-xs tracking-[0.3em] uppercase font-mono text-[#C8A97E] mb-4">Legal</h4>
        <h1 className="text-5xl font-display font-bold mb-4 leading-tight">Terms of Service</h1>
        <p className="text-xs font-mono text-black/40 mb-12">Last updated: January 2025</p>
        <div className="space-y-8 text-black/70 leading-relaxed">
          {[
            { title: "Acceptance of Terms", body: "By accessing and using the VELKORA website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services." },
            { title: "Products & Pricing", body: "All product descriptions, images, and prices are subject to change without notice. We reserve the right to limit quantities and refuse service to anyone for any reason." },
            { title: "Orders & Payment", body: "When you place an order, you agree that the information you provide is accurate and complete. We reserve the right to cancel orders at our discretion." },
            { title: "Intellectual Property", body: "All content on this website, including text, images, and logos, is the property of VELKORA and is protected by applicable copyright and trademark laws." },
            { title: "Limitation of Liability", body: "VELKORA shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services." },
            { title: "Governing Law", body: "These terms are governed by the laws of India. Any disputes shall be resolved through binding arbitration in accordance with applicable law." },
          ].map(section => (
            <div key={section.title}>
              <h2 className="text-xl font-display font-bold text-black mb-3">{section.title}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
