'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Order } from './types'
import { OrderStatus, OrderStatuses } from '@/constants/orderStatuses'
import { ImageModal } from './components/ImageModal'
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-toastify'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          toast.error('Please log in to view orders')
          return
        }

        // Fetch orders with their items and transaction proofs
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            order_id,
            total_price,
            status,
            created_at,
            transaction_proof_id (
              transaction_proof_id,
              image_name
            ),
            order_items (
              product_id,
              quantity,
              item_price,
              products (
                name,
                product_category_id,
                product_categories (name)
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (ordersError) {
          throw ordersError
        }

        // Transform the data to match the Order type
        const transformedOrders: Order[] = ordersData.map(order => ({
          order_id: order.order_id,
          total_amount: order.total_price,
          status: order.status,
          created_at: new Date(order.created_at),
          transaction_proof_id: order.transaction_proof_id?.[0]?.transaction_proof_id,
          transaction_proof: order.transaction_proof_id?.[0] ? {
            transaction_proof_id: order.transaction_proof_id[0].transaction_proof_id,
            image_name: order.transaction_proof_id[0].image_name
          } : undefined,
          items: order.order_items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.item_price,
            name: item.products.name,
            category: item.products.product_categories?.name || 'Uncategorized',
            number_of_items: item.quantity
          }))
        }))

        setOrders(transformedOrders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
      }
    }

    fetchOrders()
  }, [])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString()
  }

  const updateOrderStatus = async (order: Order, newStatus: OrderStatus) => {
    try {
      console.log('Updating order status:', order, newStatus)
      // Update order status in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('order_id', order.order_id)

      if (error) {
        console.error('Error updating order status:', error);
        throw error
      }

      // Update local state
      const updatedOrders = orders.map(o => 
        o.order_id === order.order_id ? { ...o, status: newStatus as OrderStatus } : o
      )
      setOrders(updatedOrders)

      // Update localStorage
      localStorage.setItem('orders', JSON.stringify(updatedOrders))

      toast.success(`Order status updated to ${newStatus} successfully!`)
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case OrderStatuses.PENDING:
        return 'bg-yellow-200 text-yellow-800'
      case OrderStatuses.COMPLETED:
        return 'bg-green-200 text-green-800'
      case OrderStatuses.DECLINED:
        return 'bg-red-200 text-red-800'
      default:
        return 'bg-gray-200 text-gray-800'
    }
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
                  Order #{order.order_id}
                </h2>
                <span 
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColorClass(order.status)}`}
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
                        Category: {item.category || 'Uncategorized'}
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
                
                {order.transaction_proof && order.transaction_proof.image_name && (
                  <div>
                    <h4 className="mb-2">Transaction Proof:</h4>
                    <Image 
                      src={`/transaction_proofs/${order.transaction_proof.image_name}`} 
                      alt="Transaction Proof" 
                      width={200} 
                      height={200} 
                      className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity" 
                      onClick={() => order.transaction_proof && order.transaction_proof.image_name && setSelectedImage(`/transaction_proofs/${order.transaction_proof.image_name}`)}
                    />
                  </div>
                )}
              </div>

              {/* Status Update Buttons */}
              <div className="flex space-x-2 mt-4">
                {Object.values(OrderStatuses).map((status) => (
                  status !== order.status && (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(order, status)}
                      className={`px-4 py-2 rounded text-white transition ${
                        status === OrderStatuses.COMPLETED 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : status === OrderStatuses.PENDING 
                          ? 'bg-yellow-500 hover:bg-yellow-600' 
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                    >
                      Set to {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                ))}
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