'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  action: 'buy' | 'rent'; // Added action field
};

export default function Checkout() {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Load user and cart
  useEffect(() => {
    const fetchUserAndCart = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User fetch error:', userError);
        router.push('/auth');
        return;
      }
      setUser(user);

      // Load cart from localStorage and parse price to number
      const cartData: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
      const parsedCart: CartItem[] = cartData.map((item) => ({
        ...item,
        price: parseFloat(item.price) || 0,
        action: item.action || 'buy', // Default to 'buy' if action is missing
      })).filter((item) => item.price > 0);
      setCart(parsedCart);
      setLoading(false);
    };
    fetchUserAndCart();
  }, [router]);

  // Update cart item quantity
  const updateQuantity = (id: string, delta: number) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Update cart item action
  const updateAction = (id: string, action: 'buy' | 'rent') => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, action } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!user || cart.length === 0) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create an order for each cart item
      for (const item of cart) {
        const { error } = await supabase.from('orders').insert({
          id: crypto.randomUUID(),
          user_id: user.id,
          product_id: item.id,
          action: item.action, // Use selected action
          status: 'pending',
          created_at: new Date().toISOString(),
        });
        if (error) throw new Error(`Failed to create order for ${item.name}: ${error.message}`);
      }

      // Clear cart
      setCart([]);
      localStorage.setItem('cart', '[]');
      setSuccess('Order placed successfully! Redirecting to account...');
      setTimeout(() => router.push('/account'), 2000);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-100 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-green-900 mb-8">Checkout</h1>
        <section className="bg-white/40 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto">
          {error && <p className="text-red-800 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-800 mb-4 text-center">{success}</p>}

          {cart.length > 0 ? (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-sm font-semibold text-gray-700">Product</th>
                      <th className="p-3 text-sm font-semibold text-gray-700">Price</th>
                      <th className="p-3 text-sm font-semibold text-gray-700">Quantity</th>
                      <th className="p-3 text-sm font-semibold text-gray-700">Total</th>
                      <th className="p-3 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-3 text-gray-900">
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                            <select
                              value={item.action}
                              onChange={(e) => updateAction(item.id, e.target.value as 'buy' | 'rent')}
                              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                              <option value="buy">Buy</option>
                              <option value="rent">Rent</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-3 text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="p-3 text-gray-900">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Total: ${calculateTotal()}
                </h2>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  Place Order
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <Link
                href="/shop"
                className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}