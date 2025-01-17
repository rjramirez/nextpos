'use client';

import { useState, useEffect } from 'react';
import { Product } from '../../models/Product';
import ProductCard from '../../components/ProductCard';
import { supabase } from '../../lib/supabaseClient';

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!product.active) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.productId === product.productId);
      
      if (existingItem) {
        return prevCart.map(item =>
            item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (loading) {
    return <div className="p-2">Loading products...</div>;
  }

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-3">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <span>Cart</span>
          <span className="bg-blue-500 px-2 py-1 rounded-full text-sm">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-1.5">
        {products.map((product) => (
          <div 
            key={`product-${product.productId}`}
            className="cursor-pointer hover:opacity-75 transition-opacity"
            onClick={() => handleAddToCart(product)}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Shopping Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <>
                <ul className="space-y-2 mb-4">
                  {cart.map((item) => (
                    <li 
                      key={`cart-${item.product.productId}`} 
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="text-black font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">₱{item.product.price} x {item.quantity}</p>
                      </div>
                      <p className="text-black font-medium">₱{item.product.price * item.quantity}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-black">Total:</span>
                    <span className="text-lg font-bold text-black">₱{totalAmount}</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      // Add checkout logic here
                      console.log('Proceeding to checkout...');
                    }}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 