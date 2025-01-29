// app/products/components/ProductModal.tsx
import { Product } from '../products/types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (product: Product) => Promise<void>;
  onImageChange: (file: File) => Promise<string | null>;
}

const ProductModal = ({ product, onClose, onUpdate, onImageChange }: ProductModalProps) => {
  const [productName, setProductName] = useState(product.name);
  const [productPrice, setProductPrice] = useState(product.price);
  const [productDescription, setProductDescription] = useState(product.description || '');
  const [productStock, setProductStock] = useState(product.stock_quantity || 0);
  const [productActive, setProductActive] = useState<boolean>(product.active || true);
  const [productImageUrl, setProductImageUrl] = useState(product.image_url || '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = await onImageChange(file);
      if (imageUrl) {
        setProductImageUrl(imageUrl);
      } else {
        toast.error('Failed to upload image.');
      }
    } else {
      toast.error('No file selected.');
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedProduct: Product = {
        ...product,
        name: productName,
        price: productPrice,
        description: productDescription,
        stock_quantity: productStock,
        active: productActive,
        image_url: productImageUrl,
      };

      await onUpdate(updatedProduct);
      toast.success('Product updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update product: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <div className="flex justify-center mt-1">
            <Image
              src={`/images/${productImageUrl}` || '/images/pos_default.webp'}
              alt={product.name}
              width={200}
              height={200}
              className="object-cover rounded-md"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 mt-2
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <div className="space-y-4 mt-4">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product Name"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(Number(e.target.value))}
            placeholder="Product Price"
            className="w-full px-3 py-2 border rounded-md"
          />
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Product Description"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="number"
            value={productStock}
            onChange={(e) => setProductStock(Number(e.target.value))}
            placeholder="Stock Quantity"
            className="w-full px-3 py-2 border rounded-md"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={productActive}
              onChange={(e) => setProductActive(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Active</label>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;