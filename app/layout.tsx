// /app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import '../styles/globals.css';

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
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/products" 
                    className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium"
                  >
                    Products
                  </Link>
                  <Link 
                    href="/dashboard/orders" 
                    className="text-black hover:text-gray-700 px-3 py-2 text-sm font-medium"
                  >
                    Orders
                  </Link>
                </div>
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
