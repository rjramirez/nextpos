import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lazy loading state
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Memoized fetch products function with lazy loading
  const fetchProducts = useCallback(async (
    currentPage: number = 1, 
    currentSearchTerm: string = '', 
    isLoadMore: boolean = false
  ) => {
    console.log('Fetching Products - Input:', { 
      page: currentPage, 
      searchTerm: currentSearchTerm, 
      isLoadMore 
    });
    
    setLoading(true);
    
    try {
      // Construct the query with pagination and optional search
      let query = supabase.from('products').select('*', { count: 'exact' });
      
      // Apply search filter if searchTerm exists
      if (currentSearchTerm) {
        query = query.or(
          `name.ilike.%${currentSearchTerm}%,` +
          `description.ilike.%${currentSearchTerm}%,` +
          `product_id.eq.${currentSearchTerm}`
        );
      }
      
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = currentPage * pageSize - 1;
      
      const { data, count, error } = await query
        .range(startIndex, endIndex)
        .order('product_id', { ascending: true });

      if (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        setHasMore(false);
        return;
      }

      // Determine if there are more products
      const totalCount = count || 0;
      setTotalProducts(totalCount);
      setHasMore(startIndex + (data?.length || 0) < totalCount);

      // Update products based on load more or initial/search load
      setProducts(prevProducts => 
        isLoadMore ? [...prevProducts, ...(data || [])] : (data || [])
      );

      setPage(currentPage);
      setSearchTerm(currentSearchTerm);
    } catch (err) {
      console.error('Unexpected error in fetchProducts:', err);
      setError(String(err));
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Periodic update every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Performing periodic product update');
      fetchProducts(page, searchTerm);
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [page, searchTerm, fetchProducts]);

  // Initial and subsequent fetches
  useEffect(() => {
    fetchProducts(page, searchTerm);
  }, [page, searchTerm, fetchProducts]);

  // Load more products function
  const loadMoreProducts = useCallback(() => {
    if (hasMore && !loading) {
      fetchProducts(page + 1, searchTerm, true);
    }
  }, [page, searchTerm, hasMore, loading, fetchProducts]);

  return {
    products,
    loading,
    error,
    page,
    totalProducts,
    pageSize,
    searchTerm,
    hasMore,
    fetchProducts,
    setPage,
    setSearchTerm,
    loadMoreProducts,
  };
};
