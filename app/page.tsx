'use client'

import { ProductHeader } from './products/components/ProductHeader'
import { ProductSearch } from './products/components/ProductSearch'
import { ProductGrid } from './products/components/ProductGrid'
import ProductModal from './products/components/ProductModal'
import { useProducts } from './products/hooks/useProducts'
import { useProductSearch } from './products/hooks/useProductSearch'
import { useProductModal } from './products/hooks/useProductModal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '@/app/loading'
import { useCategories } from './products/hooks/useCategories'

export default function ProductsPage() {
  const { products, loading, fetchProducts } = useProducts()
  const { searchTerm, setSearchTerm, filteredProducts } = useProductSearch(products)
  const { categories } = useCategories()

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.category_id] = category.name;
    return acc;
  }, {} as Record<string, string>)

  const {
    isEditModalOpen,
    selectedProduct,
    handleEdit,
    handleUpdate,
    handleImageChange,
    setIsEditModalOpen,
  } = useProductModal(products, fetchProducts)

  const csvData = products.map(product => ({
    ID: product.product_id,
    Name: product.name,
    Description: product.description,
    Price: product.price,
    Stock: product.stock_quantity ?? 0,
    Status: product.active ? 'Active' : 'Inactive',
    Created_By: product.created_by ?? '',
    Updated_By: product.updated_by ?? '',
    Created_At: product.created_at ?? '',
    Updated_At: product.updated_at ?? '',
    Active: product.active === true
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
        categoryMap={categoryMap}
      />

      {isEditModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
          onImageChange={handleImageChange}
        />
      )}

      <ToastContainer position="top-right" />
    </div>
  )
}