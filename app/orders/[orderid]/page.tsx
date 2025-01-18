'use client';

interface OrderPageParams {
  orderid: string;
}

interface OrderPageProps {
  params: OrderPageParams;
}

export default function OrderPage({ params }: OrderPageProps) {
  const { orderid } = params;
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <p>Order ID: {orderid}</p>
    </div>
  );
}