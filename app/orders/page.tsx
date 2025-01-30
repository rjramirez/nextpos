'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Order } from './types'
import { ImageModal } from './components/ImageModal'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 shadow-md"
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Order #{index + 1}
                </h2>
                <span 
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'pending' 
                      ? 'bg-yellow-200 text-yellow-800' 
                      : order.status === 'completed' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">
                Placed on: {formatDate(order.created_at)}
              </p>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Order Items:</h3>
                {order.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className="flex justify-between border-b py-2"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <p className="text-sm text-gray-600">
                        Category: {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <span>
                        {item.number_of_items} x ₱{item.price.toFixed(2)}
                      </span>
                      <p className="text-sm text-gray-600">
                        Total: ₱{(item.number_of_items * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  Total: ₱{order.total_amount.toFixed(2)}
                </h3>
                
                {order.transaction_image && (
                  <div>
                    <h4 className="mb-2">Transaction Proof:</h4>
                    <Image 
                      src={order.transaction_image} 
                      alt="Transaction Proof" 
                      width={200} 
                      height={200} 
                      className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity" 
                      onClick={() => order.transaction_image && setSelectedImage(order.transaction_image)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <ImageModal 
          src={selectedImage} 
          alt="Maximized Transaction Proof" 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  )
}