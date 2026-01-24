import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import InteractiveBackground from "./components/InteractiveBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BusSure - Reliable Refund System",
  description: "Transparency and accountability for intercity bus refunds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative`}
      >
        <InteractiveBackground />
        <div className="relative z-10">
          <Navbar />
          <div className="mt-16">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
