import { useState } from 'react'
import { Product } from '@/app/products/types'

interface CartItem {
  product: Product
  quantity: number
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleAddToCart = (product: Product) => {
    if (!product.active) return

    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.product.product_id === product.product_id
      )
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  )

  return {
    cart,
    isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    totalAmount
  }
} 