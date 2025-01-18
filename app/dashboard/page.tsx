'use client'

import { ProductCard } from '../products/components/ProductCard'
import Loading from './loading'
import { useProducts } from '../products/hooks/useProducts'
import { useCart } from './hooks/useCart'
import CartModal from './components/CartModal'

export default function DashboardPage() {
  const { products, loading } = useProducts()
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen,
    handleAddToCart,
    totalAmount 
  } = useCart()

  if (loading) {
    return <Loading />
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        {/* Logo/Brand */}
        <div className="mb-8 flex items-center space-x-2">
          {/* <img 
            src="/images/site-logo.webp" 
            alt="Geekstamatic POS" 
            className="w-8 h-8 object-contain"
          /> */}
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Products
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Orders
          </button>
          <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100">
            Customers
          </button>
        </nav>
      </div>

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

        {/* Stats/Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Products</h3>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Active Products</h3>
            <p className="text-2xl font-bold">
              {products.filter(p => p.active).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Cart Items</h3>
            <p className="text-2xl font-bold">
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Cart Total</h3>
            <p className="text-2xl font-bold">₱{totalAmount}</p>
          </div>
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
                <ProductCard product={product} />
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