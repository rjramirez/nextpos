'use client'

import { useState, useEffect } from 'react'

type OrderClientProps = {
  order_id: string
}

type Order = {
  id: string
  status: string
  // Add more order fields as needed
}

export default function OrderClient({ order_id }: OrderClientProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Replace with your actual data fetching logic
    const fetchOrder = async () => {
      try {
        // Simulate API call
        const mockOrder = {
          id: order_id,
          status: 'Pending'
        }
        setOrder(mockOrder)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [order_id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Status</h2>
          <p>{order.status}</p>
        </div>
        {/* Add more order details here */}
      </div>
    </div>
  )
} 