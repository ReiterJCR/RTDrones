'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  availableFor: string[];
  imageUrl?: string;
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [droneTypes, setDroneTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products', {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        const types = ['All', ...Array.from(new Set(data?.map((product: Product) => product.type)) as Set<string>)];
        setDroneTypes(types);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter((product) => product.type === selectedType);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedType, products]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Shop Our Drones</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover the perfect drone for photography, racing, or commercial use. Buy or rent today.
          </p>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-white/40 backdrop-blur-md rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search drones by name..."
                value={searchTerm}
                onChange={handleSearch}
                className="placeholder-gray-400 w-full px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div className="flex-shrink-0">
              <select
                value={selectedType}
                onChange={(e) => handleTypeFilter(e.target.value)}
                className="text-gray-400 w-full sm:w-48 px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                {droneTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="bg-white/40 backdrop-blur-md rounded-xl p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-800 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
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
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 mb-1">Type: {product.type}</p>
                    <p className="text-gray-800 font-bold mb-3">${product.price.toLocaleString()}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Link
                        href={`/shop/details/${product.id}`}
                        className="flex-1 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-center"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-full">No products found.</p>
              )}
            </div>
          )}
        </section>

        <section className="bg-green-600/60 rounded-xl p-6 mt-8 text-center">
          <h2 className="text-xl font-bold mb-3 text-white">Need Help Choosing?</h2>
          <p className="mb-4 max-w-xl mx-auto text-white text-sm">
            Our experts are here to guide you to the perfect drone for your needs.
          </p>
          <Link
            href="/"
            className="inline-block bg-gray-800 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </div>
  );
}