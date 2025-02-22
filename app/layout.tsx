// /app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import '../styles/globals.css';
import UserProfile from '@/app/components/UserProfile';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Store Dashboard',
  description: 'Manage your store inventory and orders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-900`}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex space-x-8 items-center">
                  <Link 
                    href="/dashboard" 
                    className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link 
                    href="/products" 
                    className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium"
                  >
                    Products
                  </Link>
                  <Link 
                    href="/orders" 
                    className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium"
                  >
                    Orders
                  </Link>
                </div>
                <div className="flex items-center space-x-4"><UserProfile /></div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
