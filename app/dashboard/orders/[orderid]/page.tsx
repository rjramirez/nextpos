'use client';

type PageProps = {
  params: {
    orderid: string
  }
}

export default function OrderPage({ params }: PageProps) {
  const { orderid } = params;

  // Example: If you need to convert the ID to a number for database queries
  const numericOrderId = parseInt(orderid, 10);

  // Add your order fetching logic here
  // const [order, setOrder] = useState(null);
  // useEffect(() => {
  //   // Fetch order details using numericOrderId
  // }, [numericOrderId]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <p>Order ID: {orderid}</p>
      {/* Add your order details rendering here */}
    </div>
  );
}