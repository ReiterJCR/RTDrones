'use client';

   import { createClient } from '@supabase/supabase-js';
   import { Auth } from '@supabase/auth-ui-react';
   import { ThemeSupa } from '@supabase/auth-ui-shared';
   import Navbar from '@/components/Navbar';

   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );

   export default function AuthPage() {
     return (
       <div className="relative min-h-screen bg-gray-100">
         <Navbar />
         <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
           <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
             <h1 className="text-2xl font-bold mb-6 text-center text-green-900">Sign Up or Log In</h1>
             <Auth
               supabaseClient={supabase}
               providers={['google']}
               redirectTo={`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`}
               appearance={{ theme: ThemeSupa }}
               theme="light"
             />
           </div>
         </div>
       </div>
     );
   }