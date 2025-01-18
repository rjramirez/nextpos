'use client'

import { ProductHeader } from './components/ProductHeader'
import { ProductSearch } from './components/ProductSearch'
import { ProductGrid } from './components/ProductGrid'
import { ProductModal } from './components/ProductModal'
import { useProducts } from './hooks/useProducts'
import { useProductSearch } from './hooks/useProductSearch'
import { useProductModal } from './hooks/useProductModal'
import Loading from '@/app/loading'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Product } from './types'
import { useAuth } from '@/hooks/useAuth'
import { LoginModal } from '@/app/components/LoginModal'

export default function ProductsPage() {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth()
  const { products, loading, error, setProducts, refreshProducts, isInitialized } = useProducts()
  const { searchTerm, setSearchTerm, filteredProducts } = useProductSearch(products)
  const {
    isEditModalOpen,
    selectedProduct,
    isLoading: modalLoading,
    handleEdit,
    handleUpdate,
    handleImageChange,
    setIsEditModalOpen,
    setSelectedProduct
  } = useProductModal(products, setProducts)
  
  const csvData = products.map(product => ({
    ID: product.product_id,
    Name: product.name,
    Description: product.description,
    Price: product.price,
    Stock: product.stock_quantity,
    Status: product.active ? 'Active' : 'Inactive',
    Created_By: product.created_by,
    Updated_By: product.updated_by,
    Created_At: product.created_at,
    Updated_At: product.updated_at,
    Active: product.active
  }))

  const handleProductUpdate = async (product: Product) => {
    try {
      await handleUpdate(product)
      // Only refresh products if the update was successful
      await refreshProducts()
    } catch (error) {
      console.error('Error in handleProductUpdate:', error)
    }
  }

  console.log('ProductsPage render:', { 
    productsCount: products.length, 
    loading, 
    error 
  });

  // Show loading state only during initial load
  if (!isInitialized && loading) {
    return <Loading />
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => {
              console.log('Retrying product fetch...');
              refreshProducts();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loading />
  }

  if (!user) {
    return <LoginModal isModal={false} />
  }

  return (
    <div className="p-4">
      <ProductHeader 
        onAddProduct={() => {
          setSelectedProduct({
            product_id: '',
            name: '',
            description: '',
            price: 0,
            stock_quantity: 0,
            active: true,
            image_url: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: '',
            updated_by: ''
          })
          setIsEditModalOpen(true)
        }} 
        csvData={csvData} 
      />
      
      <ProductSearch 
        searchTerm={searchTerm} 
        onSearch={setSearchTerm} 
      />
      
      <ProductGrid 
        products={filteredProducts} 
        onProductClick={handleEdit} 
      />

      {isEditModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedProduct(null)
          }}
          onUpdate={handleProductUpdate}
          onImageChange={handleImageChange}
          setProduct={setSelectedProduct}
        />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  )
}