'use client'

import { ProductHeader } from './components/ProductHeader'
import { ProductSearch } from './components/ProductSearch'
import { ProductGrid } from './components/ProductGrid'
import ProductModal from './components/ProductModal'
import { useProducts } from './products/hooks/useProducts'
import { useProductSearch } from './products/hooks/useProductSearch'
import { useProductModal } from './products/hooks/useProductModal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '@/app/loading'
import { useCategories } from './products/hooks/useCategories'
import { Pagination } from './components/Pagination'

export default function ProductsPage() {
  const { 
    products, 
    loading, 
    hasMore,
    page,
    pageSize,
    totalProducts,
    searchTerm,
    setSearchTerm,
    setPage,
    loadMoreProducts
  } = useProducts()

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
  } = useProductModal(products, () => {})  

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

  if (loading && products.length === 0) {
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
        onSearch={(term) => {
          console.log('Search term changed:', term);
          setSearchTerm(term);
          setPage(1);  
        }}
        currentPage={page}
        totalPages={Math.ceil(totalProducts / pageSize)}
        onPageChange={(newPage: number) => {
          console.log('Page change triggered:', newPage);
          setPage(newPage);
        }}
      />
      
      <ProductGrid 
        products={products}
        onProductClick={handleEdit}
        categoryMap={categoryMap}
      />
      
      <Pagination 
        currentPage={page}
        totalPages={Math.ceil(totalProducts / pageSize)}
        onPageChange={(newPage: number) => {
          console.log('Page change triggered:', newPage);
          setPage(newPage);
        }}
      />

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={loadMoreProducts}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

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