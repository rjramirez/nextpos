import { Product } from '../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export const ProductGrid = ({ products, onProductClick }: ProductGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-1.5">
    {products.map((product) => (
      <div 
        key={`product-${product.product_id}`}
        className="relative group cursor-pointer"
        onClick={() => onProductClick(product)}
      >
        <ProductCard product={product} />
      </div>
    ))}
  </div>
)
