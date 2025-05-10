'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import VideoBackground from '@/components/VideoBackground';

type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  availableFor: string[];
  imageUrl?: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFeaturedOpen, setIsFeaturedOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleProductAction = (productId: string, action: 'buy' | 'rent') => {
    router.push(`/${action}/${productId}`);
  };

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <VideoBackground />

      {/* Content Container */}
      <div className="relative z-10">

        {/* Hero Section */}
        <section className="relative text-white py-32">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Premium Drones for Every Need</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Explore our collection of high-quality drones for photography, racing, and commercial use.
              Buy, sell, or rent with confidence.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/buy"
                className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition shadow-lg"
              >
                Shop Drones
              </Link>
              <Link
                href="/rent"
                className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition"
              >
                Rent Equipment
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content with semi-transparent background */}
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white/25 backdrop-blur-sm rounded-xl p-4 shadow-xl">
            {/* Featured Products */}
            <section className="py-12 text-center">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-green-900">Featured Drones</h2>
              </div>
                <div className="transition-all duration-300">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <LoadingSpinner />
                    </div>
                  ) : error ? (
                    <div className="text-center py-10">
                      <p className="text-red-800 mb-4">{error}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="border rounded-lg p-4 shadow-md hover:shadow-lg transition bg-white group"
                        >
                          <div className="bg-gray-100 h-48 mb-4 rounded-md overflow-hidden">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                          <p className="text-gray-600 mb-1">Type: {product.type}</p>
                          <p className="text-gray-800 font-bold mb-3">${product.price.toLocaleString()}</p>
                          <div className="flex gap-2">
                            {product.availableFor.includes('Buy') && (
                              <button
                                onClick={() => handleProductAction(product.id, 'buy')}
                                className="flex-1 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                              >
                                Buy
                              </button>
                            )}
                            {product.availableFor.includes('Rent') && (
                              <button
                                onClick={() => handleProductAction(product.id, 'rent')}
                                className="flex-1 bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                              >
                                Rent
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-green-600/60 rounded-xl p-6 my-8 text-center">
              <h2 className="text-xl font-bold mb-3">Ready to elevate your drone experience?</h2>
              <p className="mb-4 max-w-xl mx-auto text-sm">
                Whether you're a professional photographer, a hobbyist, or a commercial operator,
                we have the perfect drone solution for you.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
              >
                Contact Our Experts
              </Link>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}