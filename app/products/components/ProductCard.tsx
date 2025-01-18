import { Product } from '../types'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="relative aspect-square">
      {/* <Image
        src={product.image_url || '/images/item-default.jpg'}
        alt={product.name}
        fill
        className="object-cover rounded-t-lg"
      /> */}
    </div>
    <div className="p-2">
      <h3 className="font-semibold text-sm truncate">{product.name}</h3>
      <p className="text-gray-600 text-xs truncate">{product.description}</p>
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          product.stock_quantity > 0 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  </div>
)
