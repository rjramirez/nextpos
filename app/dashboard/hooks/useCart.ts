import { useReducer, useCallback, useRef } from 'react'
import { Product } from '@/app/products/types'
import { toast } from 'react-toastify'

interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  cart: CartItem[]
  isCartOpen: boolean
}

type CartAction = 
  | { type: 'ADD_TO_CART', payload: Product }
  | { type: 'TOGGLE_CART', payload: boolean }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = action.payload
      
      // Prevent adding inactive products
      if (!product.active) return state

      const existingItemIndex = state.cart.findIndex(item => 
        item.product.product_id === product.product_id
      )
      
      if (existingItemIndex !== -1) {
        // Existing item: increment quantity
        const updatedCart = state.cart.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
        
        return { 
          ...state, 
          cart: updatedCart
        }
      }
      
      // New item: add to cart
      return { 
        ...state, 
        cart: [...state.cart, { product, quantity: 1 }]
      }
    }
    case 'TOGGLE_CART':
      return { ...state, isCartOpen: action.payload }
    default:
      return state
  }
}

export const useCart = () => {
  const [state, dispatch] = useReducer(cartReducer, { 
    cart: [], 
    isCartOpen: false 
  })

  // Use a ref to track the last added product to prevent duplicate toasts
  const lastToastRef = useRef<{ productId: number | null, timestamp: number }>({
    productId: null,
    timestamp: 0
  })

  const handleAddToCart = useCallback((product: Product) => {
    const currentTime = Date.now()
    
    // Prevent duplicate toasts within 500ms for the same product
    if (
      lastToastRef.current.productId === product.product_id && 
      currentTime - lastToastRef.current.timestamp < 500
    ) {
      console.warn('Preventing duplicate toast for product:', product.name)
      return
    }

    // Dispatch cart update
    dispatch({ type: 'ADD_TO_CART', payload: product })

    // Show appropriate toast
    const existingItemIndex = state.cart.findIndex(item => 
      item.product.product_id === product.product_id
    )

    if (existingItemIndex !== -1) {
      toast.info(`Added another ${product.name} to cart`, {
        position: "bottom-right",
        autoClose: 2000,
      })
    } else {
      toast.success(`Added ${product.name} to cart`, {
        position: "bottom-right",
        autoClose: 2000,
      })
    }

    // Update last toast reference
    lastToastRef.current = {
      productId: product.product_id,
      timestamp: currentTime
    }
  }, [state.cart])

  const setIsCartOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'TOGGLE_CART', payload: isOpen })
  }, [])

  const totalAmount = state.cart.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 
    0
  )

  return {
    cart: state.cart,
    isCartOpen: state.isCartOpen,
    setIsCartOpen,
    handleAddToCart,
    totalAmount
  }
}