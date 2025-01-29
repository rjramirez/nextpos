// app/orders/[orderid]/page.tsx
'use client';

import { useRouter } from 'next/router';
import { FC } from 'react';

const OrderPage: FC = () => {
  const router = useRouter();
  const { orderid } = router.query; // Access the orderid from the query parameters

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <p>Order ID: {orderid}</p>
    </div>
  );
};

export default OrderPage;