import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, []);

  // Update a product
  const updateProduct = async (productId: number, updatedData: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(updatedData)
      .eq('product_id', productId)
      .select('*'); // Ensure you are selecting the updated data

    if (error) {
      throw error; // Handle error appropriately
    }

    // Update the local state with the updated product
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId ? { ...product, ...data[0] } : product
      )
    );

    return data; // Return the updated product data
  };

  return {
    products,
    loading,
    error,
    fetchProducts, // Expose fetchProducts for manual re-fetching
    updateProduct,
  };
};
