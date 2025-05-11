import Link from "next/link";

export default function Navbar(){ 
    return(
    <nav className="text-white p-4 sticky top-0 z-50 bg-green-600/60 rounded-b-sm ">
            <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition">
                RT Drones
            </Link>
            <ul className="flex space-x-6">
                <li><Link href="/" className="hover:text-gray-300 transition">Home</Link></li>
                <li><Link href="/shop" className="hover:text-gray-300 transition">Shop</Link></li>
                <li><Link href="/sell" className="hover:text-gray-300 transition">Sell</Link></li>
                <li><Link href="/contact" className="hover:text-gray-300 transition">Contact</Link></li>
                <li><Link href="/auth" className="hover:text-gray-300 transition">Sign In</Link></li>
            </ul>
            </div>
    </nav>
    )
}