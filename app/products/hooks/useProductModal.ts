// app/products/hooks/useProductModal.ts
import { useState } from 'react';
import { Product } from '../types';
import { useProduct } from './useProduct';
import { toast } from 'react-toastify';

export const useProductModal = (products: Product[], fetchProducts: () => void) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { updateProduct, createProduct, handleImageUpload } = useProduct();

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    const newProduct: Product = {
      product_id: 0, // Temporary ID for new product
      name: '',
      description: '',
      price: 0,
      stock_quantity: 0,
      active: true,
      image_url: '',
      created_at: new Date().toISOString(),
      updated_at: '',
      created_by: '',
      updated_by: '',
      product_category_id: '',
    };

    setSelectedProduct(newProduct);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (updatedProduct: Product) => {
    if (updatedProduct.product_id === 0) {
      // Adding a new product
      try {
        const createdProduct = await createProduct({
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          stock_quantity: updatedProduct.stock_quantity,
          active: updatedProduct.active,
          image_url: updatedProduct.image_url,
          product_category_id: updatedProduct.product_category_id,
        });
        if (createdProduct) {
          toast.success('Product added successfully!');
          await fetchProducts();
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }
      } catch {
        toast.error('Failed to add product.');
      }
    } else {
      // Editing an existing product
      try {
        await updateProduct(updatedProduct.product_id, {
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description,
          stock_quantity: updatedProduct.stock_quantity,
          active: updatedProduct.active,
          image_url: updatedProduct.image_url,
          product_category_id: updatedProduct.product_category_id,
        });
        toast.success('Product updated successfully!');
        await fetchProducts();
        setIsEditModalOpen(false);
        setSelectedProduct(null);
      } catch {
        toast.error('Failed to update product.');
      }
    }
  };

  const handleImageChange = async (file: File) => {
    try {
      const imageUrl = await handleImageUpload(file);
      return imageUrl;
    } catch {
      toast.error('Image upload failed.');
      return null;
    }
  };

  return {
    isEditModalOpen,
    setIsEditModalOpen,
    selectedProduct,
    handleEdit,
    handleAdd,
    handleUpdate,
    handleImageChange,
    setSelectedProduct,
  };
};