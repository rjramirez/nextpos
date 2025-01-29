import { toast } from 'react-toastify'
import { Product } from '../types'
import { supabase } from '@/lib/supabaseClient'

export const useProduct = () => {
  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      toast.error(message);
      throw error;
    }
  }

  const fetchProduct = async (product_id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', product_id)
        .single()
        
      if (error) {
        console.error('Error fetching product:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in fetchProduct:', error)
      toast.error('Failed to fetch product')
      throw error
    }
  }

  const updateProduct = async (productId: number, updatedData: Partial<Product>): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updatedData)
        .eq('product_id', productId)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Failed to update product');
      throw error;
    }
  }

  const createProduct = async (product: Omit<Product, 'product_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<Product | null> => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          ...product,
          created_by: session.data.session.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Failed to create product');
      throw error;
    }
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    // Check if we are in a local or development environment
    const isLocal = process.env.NODE_ENV === 'development' || !supabase.storage;

    if (isLocal) {
      // Use local storage logic
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result as string); // Return the base64 string
        };
      });
    } else {
      // Use Supabase storage
      const filePath = `images/${file.name}`; // Adjust the path as needed
      const { error } = await supabase.storage
        .from('images') // Ensure this matches your Supabase bucket name
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

        if (publicUrl) {
          console.error('Error getting public URL:', publicUrl);
          return null;
        }

      return publicUrl; // Return the public URL of the uploaded image
    }
  }

  return {
    fetchProducts,
    fetchProduct,
    updateProduct,
    createProduct,
    handleImageUpload
  }
}

