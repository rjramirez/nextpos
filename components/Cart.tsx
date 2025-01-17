import { useState } from 'react';
import { Product } from '../models/Product';

const Cart = () => {
  const [cart, setCart] = useState<Product[]>([]);

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((product, index) => (
          <li key={index}>{product.name}</li>
        ))}
      </ul>
      <button>Checkout</button>
    </div>
  );
};

export default Cart;