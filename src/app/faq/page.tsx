'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/components/ui/Button';

const faqs = [
  {
    category: 'Orders',
    questions: [
      { q: 'How do I track my order?', a: 'You can track your order in the "My Orders" section of your account or by using the tracking link sent to your email.' },
      { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 1 hour of placement. After that, we may have already started processing it.' },
      { q: 'Do you offer gift wrapping?', a: 'Yes, we offer premium editorial gift wrapping for a small additional fee at checkout.' }
    ]
  },
  {
    category: 'Shipping',
    questions: [
      { q: 'What is the delivery timeline?', a: 'Standard delivery takes 5-7 business days, while Express delivery takes 2-3 business days.' },
      { q: 'Do you ship internationally?', a: 'Currently, we only ship within India. We are working on expanding our reach soon.' }
    ]
  },
  {
    category: 'Returns',
    questions: [
      { q: 'What is your return policy?', a: 'We offer a 14-day hassle-free return policy for unworn items with tags attached.' },
      { q: 'How long does a refund take?', a: 'Once we receive the returned item, refunds are processed within 5-7 business days.' }
    ]
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (q: string) => {
    setOpenItems(prev => prev.includes(q) ? prev.filter(i => i !== q) : [...prev, q]);
  };

  return (
    <div className="bg-background min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-display uppercase tracking-tight">HELP & FAQ</h1>
          <p className="text-gray-500 font-sans tracking-[0.3em] uppercase text-xs">Everything you need to know about VELKORA</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="SEARCH QUESTIONS..." 
            className="w-full h-16 pl-16 pr-8 bg-white border border-gray-100 text-sm font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary shadow-sm"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-12">
          {faqs.map((cat) => (
            <div key={cat.category} className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-accent border-b border-gray-100 pb-4">{cat.category}</h2>
              <div className="space-y-2">
                {cat.questions.map((item) => {
                  const isOpen = openItems.includes(item.q);
                  return (
                    <div key={item.q} className="border border-gray-50 bg-white">
                      <button 
                        onClick={() => toggle(item.q)}
                        className="w-full flex items-center justify-between p-6 text-left group"
                      >
                        <span className="text-sm font-bold uppercase tracking-widest text-primary group-hover:text-accent transition-colors">{item.q}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                          <p className="text-xs text-gray-500 font-sans leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
          <div className="p-8 bg-secondary/30 text-center space-y-4">
            <MessageSquare className="h-6 w-6 mx-auto text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Live Chat</p>
            <p className="text-[10px] text-gray-500">Available 10AM - 7PM</p>
          </div>
          <div className="p-8 bg-secondary/30 text-center space-y-4">
            <Phone className="h-6 w-6 mx-auto text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Phone Support</p>
            <p className="text-[10px] text-gray-500">+91 1800-VELKORA-LUX</p>
          </div>
          <div className="p-8 bg-secondary/30 text-center space-y-4">
            <Mail className="h-6 w-6 mx-auto text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Email Us</p>
            <p className="text-[10px] text-gray-500">support@velkora.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
