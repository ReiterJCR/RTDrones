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
             <li>
               <Link href="/sell" className={`hover:text-gray-300 transition ${pathname === '/sell' ? 'text-gray-400 font-semibold' : ''}`}>Sell</Link>
             </li>
             {user ? (
               <li className="flex items-center space-x-4">
                 <span className="text-sm">{user.email}</span>
                 <button
                   onClick={handleSignOut}
                   className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                 >
                   Sign Out
                 </button>
               </li>
             ) : (
               <li>
                 <Link href="/auth" className={`hover:text-gray-300 transition ${pathname === '/auth' ? 'text-gray-400 font-semibold' : ''}`}>Sign In</Link>
               </li>
             )}
           </ul>
         </div>
       </nav>
     );
   }