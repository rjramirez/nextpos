import { useState } from 'react'
import { Product } from '../types'
import { useProduct } from './useProduct'
import { toast } from 'react-toastify'

export const useProductModal = (products: Product[], setProducts: (products: Product[]) => void) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { updateProduct, handleImageUpload, fetchProduct } = useProduct()

  const handleEdit = async (product: Product) => {
    setIsLoading(true)
    try {
      const freshProduct = await fetchProduct(product.product_id)
      if (freshProduct) {
        setSelectedProduct(freshProduct)
        setIsEditModalOpen(true)
      }
    } catch (error) {
      toast.error('Failed to load product details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (product: Product) => {
    setIsLoading(true)
    try {
      const updatedProduct = await updateProduct(product)
      if (updatedProduct) {
        // Update the products list with the new data
        setProducts(products.map(p => 
          p.product_id === updatedProduct.product_id ? updatedProduct : p
        ))
        setIsEditModalOpen(false)
        setSelectedProduct(null)
        toast.success('Product updated successfully')
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = async (file: File) => {
    try {
      const image_url = await handleImageUpload(file)
      return image_url
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to upload image')
      return null
    }
  }

  return {
    isEditModalOpen,
    selectedProduct,
    isLoading,
    handleEdit,
    handleUpdate,
    handleImageChange,
    setIsEditModalOpen,
    setSelectedProduct
  }
}