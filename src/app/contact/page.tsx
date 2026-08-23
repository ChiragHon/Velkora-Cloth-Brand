'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Contact Info & Map */}
        <div className="bg-primary text-white p-12 md:p-24 space-y-16">
          <div className="space-y-6">
            <h1 className="text-6xl font-display uppercase tracking-tight">GET IN TOUCH</h1>
            <p className="text-gray-400 font-sans tracking-widest uppercase text-xs">We value your feedback and inquiries.</p>
          </div>

          <div className="space-y-12">
            <div className="flex items-start space-x-6">
              <MapPin className="h-6 w-6 text-accent flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent">Our Flagship Store</h4>
                <p className="text-sm font-sans">456 Fashion Avenue, Kala Ghoda, Mumbai, Maharashtra 400001</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <Phone className="h-6 w-6 text-accent flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent">Call Us</h4>
                <p className="text-sm font-sans">+91 22 4567 8900</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Mon-Sat: 10AM - 8PM</p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <Mail className="h-6 w-6 text-accent flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent">Email Support</h4>
                <p className="text-sm font-sans">concierge@velkora.com</p>
                <p className="text-sm font-sans">press@velkora.com</p>
              </div>
            </div>
          </div>

          <div className="pt-12 space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent">Follow Our Story</h4>
            <div className="flex space-x-6 text-sm font-bold tracking-widest uppercase">
              <a href="#" className="hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors">Facebook</a>
              <a href="#" className="hover:text-accent transition-colors">Twitter</a>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="p-12 md:p-24 bg-white flex items-center justify-center">
          <div className="w-full max-w-md space-y-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-display uppercase tracking-tight">Send a Message</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Expect a response within 24 hours.</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input label="Full Name" placeholder="John Doe" />
                <Input label="Email Address" placeholder="john@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary uppercase tracking-wider">Subject</label>
                <select className="flex h-12 w-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary outline-none">
                  <option>Order Issue</option>
                  <option>Return/Refund</option>
                  <option>Product Inquiry</option>
                  <option>Press & Partnerships</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-primary uppercase tracking-wider">Message</label>
                <textarea 
                  className="w-full min-h-[150px] border border-gray-200 p-4 text-sm font-sans focus:ring-1 focus:ring-primary outline-none resize-none"
                  placeholder="How can we help you today?"
                />
              </div>
              <Button 
                type="button" 
                className="w-full h-16 uppercase tracking-[0.2em] text-xs font-bold"
                onClick={() => {
                  setIsSubmitting(true);
                  setTimeout(() => setIsSubmitting(false), 2000);
                }}
                isLoading={isSubmitting}
              >
                Send Message
                <Send className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
