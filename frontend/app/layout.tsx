import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "CryptoTrade Pro - Advanced Trading Platform",
  description: "Professional cryptocurrency trading platform with real-time market data, advanced charts, and portfolio management",
  keywords: ["crypto", "trading", "bitcoin", "ethereum", "cryptocurrency", "portfolio"],
  authors: [{ name: "CryptoTrade Pro" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable} selection:bg-blue-500/30`}>
      <body className="bg-brand-bg font-sans overflow-x-hidden">
        {/* Background Decor */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-brand-bg">
          <div className="orb orb-blue" />
          <div className="orb orb-purple" />
        </div>
        {children}
      </body>
    </html>
  );
}
