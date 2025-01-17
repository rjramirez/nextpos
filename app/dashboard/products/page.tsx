'use client';

import { useState, useEffect } from 'react';
import { Product } from '../../../models/Product';
import ProductCard from '../../../components/ProductCard';
import { supabase } from '../../../lib/supabaseClient';
import { CSVLink } from 'react-csv';
import { toast, ToastContainer } from 'react-toastify';
import { ShoppingCartIcon, PlusIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productId.toString().includes(searchTerm)
  );

  // CSV Export Data
  const csvData = products.map(product => ({
    ID: product.productId,
    Name: product.name,
    Description: product.description,
    Price: product.price,
    Stock: product.stockQuantity,
    Status: product.active ? 'Active' : 'Inactive'
  }));

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (updatedProduct: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          stockQuantity: updatedProduct.stockQuantity,
          active: updatedProduct.active,
          imageUrl: updatedProduct.imageUrl
        })
        .eq('productId', updatedProduct.productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.productId === updatedProduct.productId ? updatedProduct : p
      ));
      toast.success('Product updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct || !e.target.files?.[0]) return;

    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedProduct.productId}-${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      // Update selected product with new image URL
      setSelectedProduct({
        ...selectedProduct,
        imageUrl: publicUrl
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Product Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Product
          </button>
          <CSVLink
            data={csvData}
            filename="products.csv"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-md w-full"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-1.5">
        {filteredProducts.map((product) => (
          <div 
            key={`product-${product.productId}`}
            className="relative group cursor-pointer"
            onClick={() => handleEdit(product)}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(selectedProduct);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedProduct.imageUrl || '/images/item-default.jpg'}
                      alt={selectedProduct.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Recommended: 500x500px, max 2MB
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      name: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      price: parseFloat(e.target.value)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input
                    type="number"
                    value={selectedProduct.stockQuantity}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      stockQuantity: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProduct.active}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      active: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Active</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}