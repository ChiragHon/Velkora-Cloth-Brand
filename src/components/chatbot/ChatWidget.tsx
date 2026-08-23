'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minus, Sparkles, User } from 'lucide-react';
import { Button, cn } from '@/components/ui/Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm VERA, your VELKORA personal shopping assistant. How can I help you find your perfect style today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate API call to Claude
      await new Promise(resolve => setTimeout(resolve, 1500));
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: "I'd be happy to help with that! Based on our latest editorial collections, I recommend looking at our Classic Linen Shirts which are trending this season. Would you like to see more details?" 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = ["Track my order", "Size guide", "New arrivals", "Return policy"];

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] h-[520px] bg-white border border-gray-100 shadow-2xl flex flex-col mb-4 animate-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="p-4 bg-primary text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest">VERA</p>
                <p className="text-[8px] uppercase tracking-widest opacity-60">Shopping Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-accent transition-colors">
              <Minus className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
            {messages.map((msg, i) => (
              <div key={i} className={cn(
                "flex flex-col max-w-[80%]",
                msg.role === 'user' ? "ml-auto items-end" : "items-start"
              )}>
                <div className={cn(
                  "p-3 text-xs font-sans leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-primary text-white" 
                    : "bg-white border border-gray-100 text-gray-700 shadow-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex space-x-1 p-2 bg-white border border-gray-100 w-fit rounded-full shadow-sm">
                <div className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce" />
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className="p-3 bg-white flex flex-wrap gap-2 border-t border-gray-50">
            {quickReplies.map(reply => (
              <button 
                key={reply}
                onClick={() => setInput(reply)}
                className="px-3 py-1.5 bg-secondary/50 text-[10px] uppercase tracking-widest font-bold text-primary hover:bg-accent hover:text-white transition-all"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask VERA something..."
              className="flex-1 h-10 bg-gray-50 border-none px-4 text-xs font-sans focus:ring-1 focus:ring-accent transition-all outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          
          <div className="p-2 text-center border-t border-gray-50 bg-gray-50/50">
            <p className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Powered by Claude AI • VELKORA Luxury</p>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 w-16 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all group relative"
      >
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
          1
        </div>
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
};
