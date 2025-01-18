import { useState } from 'react';
import { Product } from '../interfaces/Product';

interface CartProps {
  cart: Product[];
  onCheckout: () => void;
  categoryMap: Record<string, string>;
}

const categoryEmojis: Record<string, string> = {
  Beverages: '☕',
  Food: '🥪',
  Merchandise: '🛍️',
  Seasonal: '🎃',
  'Coffee Beans': '🌱',
  Teas: '🍵',
  Unknown: '❓',
};

const Cart = ({ cart, onCheckout, categoryMap }: CartProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold">Shopping Cart</h2>
      <ul>
        {cart.map((product) => {
          const categoryName = categoryMap[product.product_category_id] || 'Unknown';
          const emoji = categoryEmojis[categoryName] || categoryEmojis['Unknown'];
          return (
            <li key={product.product_id} className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="mr-2">{emoji}</span> {/* Display emoji */}
                <span>{categoryName}</span>
                <span>{product.name}</span>
              </div>
              <span>${product.price.toFixed(2)}</span>
            </li>
          );
        })}
      </ul>
      <button onClick={onCheckout} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Checkout
      </button>
    </div>
  );
};

export default Cart; 