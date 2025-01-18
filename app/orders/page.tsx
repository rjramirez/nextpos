import { Metadata } from 'next'
import OrderList from './components/OrderList'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'View all orders'
}

export default function OrdersPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <OrderList />
    </div>
  )
}
