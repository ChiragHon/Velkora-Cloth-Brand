import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "VELKORA | Modern Clothing Brand",
  description: "Wear Your Story. Premium, sustainable fashion for the modern individual.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable} font-sans min-h-full flex flex-col antialiased bg-[#FAFAF8] text-[#0A0A0A]`}
      >
        <SmoothScroll>
          <Providers>
            <Navbar />
            {children}
            <ChatWidget />
          </Providers>
        </SmoothScroll>
      </body>
    </html>
  );
}

