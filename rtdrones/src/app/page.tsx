'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  availableFor: string[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products`, {
          cache: 'no-store', // Ensure fresh data
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">RT Drones</h1>
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link href="/buy" className="hover:text-gray-300">Buy</Link></li>
            <li><Link href="/sell" className="hover:text-gray-300">Sell</Link></li>
            <li><Link href="/rent" className="hover:text-gray-300">Rent</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to RT Drones</h2>
          <p className="text-lg md:text-xl mb-8">Your one-stop shop for drones, parts, and equipment</p>
          <Link
            href="/buy"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Product Listing */}
      <section className="py-12">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Featured Products</h3>
          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 shadow-md hover:shadow-lg transition bg-white"
                >
                  <h4 className="text-lg font-semibold">{product.name}</h4>
                  <p className="text-gray-600">Type: {product.type}</p>
                  <p className="text-gray-600">Price: ${product.price}</p>
                  <p className="text-gray-600">Available for: {product.availableFor.join(', ')}</p>
                  <button
                    className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    onClick={() => alert('Purchase functionality coming soon!')}
                  >
                    {product.availableFor.includes('Rent') ? 'Rent/Buy' : 'Buy'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}