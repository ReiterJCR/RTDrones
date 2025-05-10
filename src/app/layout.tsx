import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RT Drones | Buy, Sell & Rent Drones",
  description: "Premium drone marketplace for buying, selling, and renting drones and accessories",
  keywords: ["drones", "drone rental", "buy drones", "sell drones", "drone parts"],
  authors: [{ name: "RT Drones Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        {/* Transparent Navbar */}
        <nav className="text-white p-4 sticky top-0 z-50 bg-green-600/60 rounded-b-sm ">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition">
              RT Drones
            </Link>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-gray-300 transition">Home</Link></li>
              <li><Link href="/buy" className="hover:text-gray-300 transition">Buy</Link></li>
              <li><Link href="/sell" className="hover:text-gray-300 transition">Sell</Link></li>
              <li><Link href="/rent" className="hover:text-gray-300 transition">Rent</Link></li>
              <li><Link href="/contact" className="hover:text-gray-300 transition">Contact</Link></li>
            </ul>
          </div>
        </nav>
        {children}
        {/* Footer */}
        <footer className="bg-green-950/80 text-white py-8 backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">RT Drones</h3>
                <p>Your trusted partner for all drone needs since 2025.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="hover:text-gray-300 transition">About Us</Link></li>
                  <li><Link href="/blog" className="hover:text-gray-300 transition">Blog</Link></li>
                  <li><Link href="/faq" className="hover:text-gray-300 transition">FAQ</Link></li>
                  <li><Link href="/terms" className="hover:text-gray-300 transition">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact Us</h4>
                <p>Email: info@rtdrones.com</p>
                <p>Phone: (123) 456-7890</p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
              <p>© {new Date().getFullYear()} RT Drones. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}