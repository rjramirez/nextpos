import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add new state variables
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products from Supabase with pagination and search
  const fetchProducts = async (page: number = 1, searchTerm: string = '') => {
    setLoading(true);
    setPage(page);
    setSearchTerm(searchTerm);
    
    // Construct the query with pagination and optional search
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data, count, error } = await query
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } else {
      setProducts(data || []);
      setTotalProducts(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on mount and when search/page changes
  }, [page, searchTerm]);

  // Update a product
  const updateProduct = async (productId: number, updatedData: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(updatedData)
      .eq('product_id', productId)
      .select('*');

    if (error) {
      throw error;
    }

    // Update the local state with the updated product
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId ? { ...product, ...data[0] } : product
      )
    );

    return data;
  };

  return {
    products,
    loading,
    error,
    page,
    totalProducts,
    pageSize,
    searchTerm,
    fetchProducts,
    setPage,
    setSearchTerm,
    updateProduct
  };
};
