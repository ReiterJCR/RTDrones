'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id);
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, action, status, created_at, products(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setUser(user);
      setProfile(profileData);
      console.log('Profile:', profileData);
      setOrders(ordersData || []);
      console.log('Orders:', ordersData);   

    };
    fetchUserAndProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (!user) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-green-900">Your Account</h1>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Account Details</h2>
              <div className="mt-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Name</label>
                  <p className="mt-1 text-gray-900">
                    {profile?.full_name || user.user_metadata.name || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Order History</h2>
              {orders.length > 0 ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 text-sm font-semibold text-gray-700">Product ID</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Action</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Date</th>
                        <th className="p-3 text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-3 text-gray-900">{order.products?.name || 'Unknown'}</td>
                          <td className="p-3 text-gray-900 capitalize">{order.action}</td>
                          <td className="p-3 text-gray-900">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-gray-900 capitalize">{order.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-2 text-gray-600">No orders found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}