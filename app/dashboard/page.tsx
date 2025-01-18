'use client'

import { ProductCard } from '../products/components/ProductCard'
import Loading from './loading'
import { useProducts } from '../products/hooks/useProducts'
import { useCart } from './hooks/useCart'
import CartModal from './components/CartModal'
import { useCategories } from '../products/hooks/useCategories'

export default function DashboardPage() {
  const { products, loading: loadingProducts } = useProducts()
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen,
    handleAddToCart,
    totalAmount 
  } = useCart()
  const { categories, loading: loadingCategories } = useCategories()
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.product_category_id] = category.name;
    return acc;
  }, {} as Record<string, string>)

  if (loadingProducts || loadingCategories) {
    return <Loading />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products Overview</h2>
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

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <div 
                key={`product-${product.product_id}`}
                className="cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => handleAddToCart(product)}
              >
                <ProductCard 
                  product={product} 
                  categoryName={categoryMap[product.product_category_id] || 'Unknown'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cart Modal */}
        <CartModal 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          totalAmount={totalAmount}
        />
      </div>
    </div>
  )
} 