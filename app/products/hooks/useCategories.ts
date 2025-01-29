import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Category = {
  category_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('product_categories')
          .select('*');

        if (error) throw error;

        setCategories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}; 