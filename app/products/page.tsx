// app/products/page.tsx
'use client';

import { ProductHeader } from '../components/ProductHeader';
import { ProductSearch, ProductSearchWithPaginationProps } from '../components/ProductSearch';
import { ProductGrid } from '../components/ProductGrid';
import ProductModal from '../components/ProductModal';
import { useProducts } from './hooks/useProducts';
import { useProductModal } from './hooks/useProductModal';
import Loading from '@/app/loading';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/app/components/LoginModal';
import { useCategories } from './hooks/useCategories';

export default function ProductsPage() {
  const { user } = useAuth();
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    page, 
    totalProducts, 
    pageSize, 
    searchTerm, 
    setSearchTerm 
  } = useProducts();
  const { categories } = useCategories();
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    selectedProduct,
    handleEdit,
    handleAdd,
    handleUpdate,
    handleImageChange,
    setSelectedProduct
  } = useProductModal(products, fetchProducts);

  const totalPages = Math.ceil(totalProducts / pageSize);

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, searchTerm);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchProducts(1, term);
  };

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
  }));

  // Show loading state only during initial load
  if (loading) {
    return <Loading />;
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

  if (!user) {
    return <LoginModal isModal={false} />;
  }

  const categoryMap = categories.reduce((acc, category) => {
    acc[category.category_id] = category.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="p-4">
      <ProductHeader 
        onAddProduct={handleAdd} 
        csvData={csvData} 
      />
      
      <ProductSearch {...({
        searchTerm, 
        onSearch: handleSearch,
        currentPage: page,
        totalPages,
        onPageChange: handlePageChange
      } as ProductSearchWithPaginationProps)} />

      <ProductGrid 
        products={products} 
        onProductClick={handleEdit} 
        categoryMap={categoryMap}
      />

      {isEditModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          onUpdate={handleUpdate}
          onImageChange={handleImageChange}
        />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}