import Link from "next/link";

export default function Footer() {
    return(
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
    )
}