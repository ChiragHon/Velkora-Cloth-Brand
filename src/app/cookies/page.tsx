import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Cookie Policy | VELKORA" };

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="pt-40 pb-24 px-6 md:px-12 max-w-screen-md mx-auto">
        <h4 className="text-xs tracking-[0.3em] uppercase font-mono text-[#C8A97E] mb-4">Legal</h4>
        <h1 className="text-5xl font-display font-bold mb-4 leading-tight">Cookie Policy</h1>
        <p className="text-xs font-mono text-black/40 mb-12">Last updated: January 2025</p>
        <div className="space-y-8 text-black/70 leading-relaxed">
          {[
            { title: "What Are Cookies", body: "Cookies are small text files stored on your device when you visit our website. They help us provide a better browsing experience and understand how our site is used." },
            { title: "Cookies We Use", body: "We use essential cookies to make our website function, analytics cookies to understand visitor behaviour, and preference cookies to remember your settings like cart contents and wishlist." },
            { title: "Third-Party Cookies", body: "We use trusted third-party services like Stripe for payments and Google Analytics for traffic analysis, which may set their own cookies subject to their privacy policies." },
            { title: "Managing Cookies", body: "You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our website, including keeping items in your cart." },
            { title: "Contact", body: "If you have questions about our cookie usage, contact us at privacy@velkora.com." },
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
