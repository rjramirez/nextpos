import { useState, useMemo } from 'react'
import type { Product } from '../types'

export const useProductSearch = (products: Product[]) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo(() => 
    products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_id.toString().includes(searchTerm)
    ),
    [products, searchTerm]
  )

  return { searchTerm, setSearchTerm, filteredProducts }
}
