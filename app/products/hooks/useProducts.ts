import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add new state variables with explicit types
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch products from Supabase with pagination and search
  const fetchProducts = async (page: number = 1, searchTerm: string = '') => {
    console.log('Fetching Products - Input:', { page, searchTerm });
    
    // Use functional state updates to ensure consistency
    setLoading(true);
    setPage(prevPage => page);
    setSearchTerm(prevTerm => searchTerm);
    
    try {
      // Construct the query with pagination and optional search
      let query = supabase.from('products').select('*', { count: 'exact' });
      
      // Apply search filter if searchTerm exists
      if (searchTerm) {
        console.log('Applying search filter:', searchTerm);
        query = query
          .or(
            `name.ilike.%${searchTerm}%,` +
            `description.ilike.%${searchTerm}%,` +
            `product_id.eq.${searchTerm}`
          );
      }
      
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize - 1;
      console.log('Pagination Range:', { startIndex, endIndex });
      
      const { data, count, error } = await query
        .range(startIndex, endIndex)
        .order('product_id', { ascending: true });

      console.log('Query Result:', { 
        dataLength: data?.length, 
        totalCount: count, 
        error 
      });

      if (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setProducts([]);
        setTotalProducts(0);
      } else {
        // Use functional state updates
        setProducts(prevProducts => data || []);
        setTotalProducts(prevTotal => count || 0);
      }
    } catch (err) {
      console.error('Unexpected error in fetchProducts:', err);
      setError(String(err));
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial fetch on mount
  useEffect(() => {
    console.log('Initial fetch triggered');
    fetchProducts(page, searchTerm);
  }, []); // Empty dependency array for initial mount

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
  };
};
