'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Order } from '../orders/types'

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [transactionImage, setTransactionImage] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart items to localStorage whenever they change
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTransactionImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const checkout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    const newOrder: Order = {
      total_amount: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      transaction_image: transactionImage || undefined,
      created_at: new Date(),
      status: 'pending'
    }

    // Save order to localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    savedOrders.push(newOrder)
    localStorage.setItem('orders', JSON.stringify(savedOrders))

    // Clear cart
    localStorage.removeItem('cart')
    setCartItems([])
    setTransactionImage(null)

    // Navigate to orders page
    router.push('/orders')
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, newQuantity) } 
          : item
      )
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-4">
              {item.image && (
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  width={100} 
                  height={100} 
                  className="mr-4" 
                />
              )}
              <div className="flex-grow">
                <h2 className="text-xl">{item.name}</h2>
                <p>Price: ${item.price}</p>
                <div className="flex items-center">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 bg-gray-200"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          
          <div className="mt-6">
            <h2 className="text-2xl font-bold">
              Total: ${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </h2>
          </div>

          <div className="mt-6">
            <h3 className="text-xl mb-4">Upload Transaction Proof</h3>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="mb-4"
            />
            {transactionImage && (
              <Image 
                src={transactionImage} 
                alt="Transaction Proof" 
                width={200} 
                height={200} 
                className="rounded-lg mb-4" 
              />
            )}
          </div>

          <button 
            onClick={checkout}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  )
}