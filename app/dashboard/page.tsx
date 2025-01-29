'use client'

import Loading from '@/app/loading'
import { useProducts } from '../products/hooks/useProducts'
import { useCart } from './hooks/useCart'
import CartModal from './components/CartModal'
import { useCategories } from '../products/hooks/useCategories'
import { ProductSearch, ProductSearchWithPaginationProps } from '../components/ProductSearch'
import { ProductGrid } from '../components/ProductGrid'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '@/hooks/useAuth'
import { LoginModal } from '@/app/components/LoginModal'
import { Pagination } from '../components/Pagination'

export default function DashboardPage() {
  const { user } = useAuth();
  const { 
    products, 
    loading, 
    error,
    setPage,
    page,
    totalProducts,
    pageSize,
    searchTerm,
    fetchProducts,
    setSearchTerm
  } = useProducts()
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen,
    handleAddToCart,
    totalAmount 
  } = useCart()
  const { categories } = useCategories()
  
  const totalPages = Math.ceil(totalProducts / pageSize);

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.category_id] = category.name;
    return acc;
  }, {} as Record<string, string>)

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, searchTerm);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchProducts(1, term);
  };

  // Show loading state
  if (loading) {
    return <Loading />
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!user) {
    return <LoginModal isModal={false} />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="w-full md:w-1/2 mr-4">
          <ProductSearch {...({
            searchTerm, 
            onSearch: handleSearch,
            currentPage: page,
            totalPages,
            onPageChange: handlePageChange
          } as ProductSearchWithPaginationProps)} />
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <span>🛒Cart RJ</span>
          <span className="bg-blue-500 px-2 py-1 rounded-full text-sm">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </button>
      </div>

      <ProductGrid 
        products={products} 
        onProductClick={handleAddToCart} 
        categoryMap={categoryMap}
      />
      
      <Pagination 
        currentPage={page}
        totalPages={Math.ceil(totalProducts / pageSize)}
        onPageChange={(newPage: number) => {
          setPage(newPage)
          fetchProducts(newPage, searchTerm)
        }}
      />

      {isCartOpen && (
        <CartModal 
          isOpen={isCartOpen}
          cart={cart}
          totalAmount={totalAmount}
          onClose={() => setIsCartOpen(false)}
          categoryMap={categoryMap}
        />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  )
}