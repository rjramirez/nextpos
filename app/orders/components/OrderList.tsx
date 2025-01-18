'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function OrderList() {
  // Example orders - replace with your data fetching logic
  const [orders] = useState([
    { id: '1', status: 'Pending' },
    { id: '2', status: 'Completed' },
  ])

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <Link 
          key={order.id}
          href={`/orders/${order.id}`}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold">Order #{order.id}</h3>
          <p className="text-gray-600">{order.status}</p>
        </Link>
      ))}
    </div>
  )
} 