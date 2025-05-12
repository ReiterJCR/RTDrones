'use client';

   import { useEffect, useState } from 'react';
   import Link from 'next/link';
   import { usePathname } from 'next/navigation';
   import { createClient } from '@supabase/supabase-js';

   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );

   export default function Navbar() {
     const pathname = usePathname();
     const [user, setUser] = useState<any>(null);

     useEffect(() => {
       const getUser = async () => {
         const { data: { user } } = await supabase.auth.getUser();
         setUser(user);
       };

       getUser();

       const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
         setUser(session?.user ?? null);
       });

       return () => {
         authListener.subscription.unsubscribe();
       };
     }, []);

     const handleSignOut = async () => {
       await supabase.auth.signOut();
       setUser(null);
     };

     return (
       <nav className="text-white p-4 sticky top-0 z-50 bg-green-600/50 backdrop-blur-md">
         <div className="container mx-auto flex justify-between items-center">
           <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition">
             RT Drones
           </Link>
           <ul className="flex space-x-6 items-center">
             <li>
               <Link href="/" className={`hover:text-gray-300 transition ${pathname === '/' ? 'text-gray-400 font-semibold' : ''}`}>Home</Link>
             </li>
             <li>
               <Link href="/shop" className={`hover:text-gray-300 transition ${pathname === '/shop' ? 'text-gray-400 font-semibold' : ''}`}>Shop</Link>
             </li>
                    {user ? (
                        <li className="flex items-center space-x-4">
                        <Link
                            href="/account"
                            className="text-sm hover:text-gray-300 transition underline"
                            title="View Account"
                        >
                            {user.email}
                        </Link>
                        <Link
                            href="/account/checkout"
                            className="text-white hover:text-gray-300 transition"
                            title="View Cart"
                        >
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                            </svg>
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                            Sign Out
                        </button>
                        </li>
                    ) : (
                        <li>
                        <Link
                            href="/auth"
                            className={`hover:text-gray-300 transition ${
                            pathname === '/auth' ? 'text-green-900 font-semibold' : ''
                            }`}
                        >
                            Sign In
                        </Link>
                        </li>
                    )}
           </ul>
         </div>
       </nav>
     );
   }