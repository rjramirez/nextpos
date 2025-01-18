'use client'

import { ProductHeader } from './products/components/ProductHeader'
import { ProductSearch } from './products/components/ProductSearch'
import { ProductGrid } from './products/components/ProductGrid'
import { ProductModal } from './products/components/ProductModal'
import { useProducts } from './products/hooks/useProducts'
import { useProductSearch } from './products/hooks/useProductSearch'
import { useProductModal } from './products/hooks/useProductModal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '@/app/loading'

export default function ProductsPage() {
  const { products, loading, setProducts } = useProducts()
  const { searchTerm, setSearchTerm, filteredProducts } = useProductSearch(products)
  const {
    isEditModalOpen,
    selectedProduct,
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
    Status: product.active ? 'Active' : 'Inactive'
  }))

  if (loading) {
    return <Loading size="large" color="primary" />
  }

  return (
    <div className="p-4">
      <ProductHeader 
        onAddProduct={() => setIsEditModalOpen(true)} 
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
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
          onImageChange={handleImageChange}
          setProduct={setSelectedProduct}
        />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  )
}