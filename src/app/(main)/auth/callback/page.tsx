'use client';

   import { useEffect } from 'react';
   import { useRouter } from 'next/navigation';
   import { createClient } from '@supabase/supabase-js';

   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );

   export default function AuthCallback() {
     const router = useRouter();

     useEffect(() => {
       const handleAuthCallback = async () => {
         const { data, error } = await supabase.auth.getSession();
         if (error) {
           console.error('Auth callback error:', error);
           router.push('/auth?error=auth_failed');
           return;
         }
         if (data.session) {
           router.push('/');
         } else {
           router.push('/auth');
         }
       };

       handleAuthCallback();
     }, [router]);

     return (
       <div className="flex justify-center items-center min-h-screen">
         <p>Loading...</p>
       </div>
     );
   }