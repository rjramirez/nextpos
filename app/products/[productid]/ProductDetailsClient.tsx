'use client';

import React from 'react';

interface ProductDetailsClientProps {
  productId: string;
}

export default function ProductDetailsClient({ productId }: ProductDetailsClientProps) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
      <p>Product ID: {productId}</p>
    </div>
  );
}
