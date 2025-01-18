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

  const updateProduct = async (product: Product): Promise<Product | null> => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          stock_quantity: product.stock_quantity,
          active: product.active,
          image_url: product.image_url,
          updated_at: new Date().toISOString(),
          updated_by: session.data.session.user.id
        })
        .eq('product_id', product.product_id)
        .select()
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
          created_by: session.data.session.user.id,
          updated_by: session.data.session.user.id
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
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      return null
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

