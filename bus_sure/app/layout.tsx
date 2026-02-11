import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Navbar from "./components/Navbar";
import InteractiveBackground from "./components/InteractiveBackground";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
       <body
        className="antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative font-poppins"
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
