import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import InteractiveBackground from "./components/InteractiveBackground";
import "./globals.css";

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
        className="antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative font-sans"
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
