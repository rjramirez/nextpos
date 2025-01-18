import { useState, useEffect, useCallback } from 'react'
import type { Product } from '../types'
import { useProduct } from './useProduct'
import { toast } from 'react-toastify'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const { fetchProducts } = useProduct()

  const loadProducts = useCallback(async (mounted = true) => {
    if (!mounted) return;
    
    try {
      const data = await fetchProducts();
      
      if (mounted) {
        setProducts(data);
        setError(null);
      }
    } catch (err) {
      if (mounted) {
        const error = err instanceof Error ? err : new Error('Failed to fetch products');
        setError(error);
        toast.error(error.message);
      }
    } finally {
      if (mounted) {
        setLoading(false);
        setIsInitialized(true);
      }
    }
  }, [fetchProducts]);

  useEffect(() => {
    let mounted = true;
    
    if (!isInitialized) {
      loadProducts(mounted);
    }

    return () => {
      mounted = false;
    };
  }, [loadProducts, isInitialized]);

  const refreshProducts = useCallback(() => {
    setLoading(true);
    return loadProducts(true);
  }, [loadProducts]);

  return { 
    products, 
    loading, 
    error, 
    setProducts,
    refreshProducts,
    isInitialized: isInitialized || products.length > 0 || error !== null
  }
}
