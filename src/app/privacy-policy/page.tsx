import { Footer } from "@/components/layout/Footer";

export const metadata = { title: "Privacy Policy | VELKORA" };

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="pt-40 pb-24 px-6 md:px-12 max-w-screen-md mx-auto">
        <h4 className="text-xs tracking-[0.3em] uppercase font-mono text-[#C8A97E] mb-4">Legal</h4>
        <h1 className="text-5xl font-display font-bold mb-4 leading-tight">Privacy Policy</h1>
        <p className="text-xs font-mono text-black/40 mb-12">Last updated: January 2025</p>
        <div className="prose prose-sm max-w-none space-y-8 text-black/70 leading-relaxed">
          {[
            { title: "Information We Collect", body: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, shipping address, and payment information." },
            { title: "How We Use Your Information", body: "We use your information to process orders, send order confirmations and shipping updates, respond to your requests, and improve our services. We do not sell your personal data to third parties." },
            { title: "Cookies", body: "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences." },
            { title: "Data Security", body: "We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted using SSL technology." },
            { title: "Your Rights", body: "You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@velkora.com to exercise these rights." },
            { title: "Contact", body: "For privacy-related questions, contact our Data Protection Officer at privacy@velkora.com." },
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
