'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import LoadingSpinner from '@/components/LoadingSpinner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  type: string;
  price: number;
  availableFor: string[];
  imageUrl?: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  action: 'buy' | 'rent';
};

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductAndUser = async () => {
      try {
        // Fetch user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) console.error('User fetch error:', userError);
        setUser(user);

        // Fetch products
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: any[] = await res.json();
        const parsedData: Product[] = data.map((p) => ({
          ...p,
          price: parseFloat(p.price) || 0,
        }));
        const foundProduct = parsedData.find((p) => p.id === id);
        if (!foundProduct) throw new Error('Product not found');

        setProduct(foundProduct);

        // Recommend products
        const recommendations = parsedData
          .filter(
            (p) =>
              p.id !== id &&
              (p.type === foundProduct.type ||
                p.availableFor.some((af) => foundProduct.availableFor.includes(af)))
          )
          .slice(0, 3);
        setRecommendedProducts(recommendations);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndUser();
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    if (!user) {
      router.push('/auth');
      return;
    }

    // Get current cart from localStorage
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item) => item.id === product.id && item.action === 'buy');

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        action: 'buy',
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setCartMessage(`${product.name} added to cart!`);
    setTimeout(() => setCartMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-100 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-800 mb-4">{error || 'Product not found.'}</p>
          <Link
            href="/shop"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <section className="bg-white/40 backdrop-blur-md rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="bg-gray-100 h-96 rounded-md overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold text-green-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-2">Type: {product.type}</p>
              <p className="text-gray-800 font-bold text-2xl mb-4">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex gap-4 flex-wrap mb-4">
                <button
                  onClick={addToCart}
                  className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900 transition"
                >
                  Add to Cart
                </button>
              </div>
              {cartMessage && (
                <p className="text-green-600 font-semibold">{cartMessage}</p>
              )}
              <p className="text-gray-600">
                Explore the {product.name}, designed for {product.type.toLowerCase()} enthusiasts.
                {product.availableFor.includes('Buy') && ' Available for purchase.'}
                {product.availableFor.includes('Rent') && ' Also available for rent.'}
              </p>
            </div>
          </div>
        </section>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section className="bg-white/40 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-2xl font-bold text-green-900 mb-6">
              People who bought {product.name} also bought
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedProducts.map((rec) => (
                <div
                  key={rec.id}
                  className="border rounded-lg p-4 shadow-md hover:shadow-lg transition bg-white group"
                >
                  <div className="bg-gray-100 h-48 mb-4 rounded-md overflow-hidden">
                    {rec.imageUrl ? (
                      <img
                        src={rec.imageUrl}
                        alt={rec.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{rec.name}</h3>
                  <p className="text-gray-600 mb-1">Type: {rec.type}</p>
                  <p className="text-gray-800 font-bold mb-3">${rec.price.toFixed(2)}</p>
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href={`/shop/details/${rec.id}`}
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back to Shop */}
        <section className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Back to Shop
          </Link>
        </section>
      </div>
    </div>
  );
}