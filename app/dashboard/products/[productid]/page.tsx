'use client';

type PageProps = {
  params: {
    productid: string
  }
}

export default function ProductPage({ params }: PageProps) {
  const { productid } = params;
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
      <p>Product ID: {productid}</p>
    </div>
  );
}
