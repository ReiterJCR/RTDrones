import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RT Drones - Admin Panel',
  description: 'Manage drones, inventory, and orders for RT Drones.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <main className="container mx-auto p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}