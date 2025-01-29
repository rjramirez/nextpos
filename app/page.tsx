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
    fetchProducts, 
    page, 
    setPage, 
    pageSize,
    totalProducts,
    searchTerm,
    setSearchTerm
  } = useProducts()

  const { filteredProducts } = useProductSearch(products)
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
        onSearch={(term) => {
          setSearchTerm(term)
          setPage(1)  // Reset to first page when searching
        }}
        currentPage={page}
        totalPages={Math.ceil(totalProducts / pageSize)}
        onPageChange={(newPage: number) => {
          console.log('Page change triggered:', newPage);
          setPage(newPage)
          console.log('Fetching products for page:', newPage, 'with search term:', searchTerm);
          fetchProducts(newPage, searchTerm)
        }}
      />
      
      <ProductGrid 
        products={filteredProducts} 
        onProductClick={handleEdit}
        categoryMap={categoryMap}
      />
      <Pagination 
        currentPage={page}
        totalPages={Math.ceil(totalProducts / pageSize)}
        onPageChange={(newPage: number) => {
          console.log('Page change triggered:', newPage);
          setPage(newPage)
          console.log('Fetching products for page:', newPage, 'with search term:', searchTerm);
          fetchProducts(newPage, searchTerm)
        }}
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