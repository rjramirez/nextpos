// /components/ProductCard.tsx
import type { Product } from '../models/Product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="p-1.5 border border-gray-300 rounded-md shadow-sm bg-white text-xs">
      <div className="w-full h-24 overflow-hidden">
        <img
          src="/images/item-default.jpg"
          alt={product.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <h3 className="text-black font-semibold truncate mt-0.5">{product.name}</h3>
      <p className="text-gray-800 text-[10px] line-clamp-2">{product.description}</p>
      <p className="text-gray-800 text-[10px]">Stock: {product.stockQuantity}</p>
      <p className="font-semibold text-black">₱{product.price}</p>
      <p className={`text-[10px] ${product.active ? 'text-green-600' : 'text-red-600'}`}>
        {product.active ? 'Available' : 'Out of Stock'}
      </p>
    </div>
  );
} 