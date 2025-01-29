import { Metadata } from 'next';
import ProductDetailsClient from './ProductDetailsClient';

type PageProps = {
  params: Promise<{
    productid: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { productid } = await params;
  return {
    title: `Product ${productid}`,
    description: `Details for product ${productid}`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { productid } = await params;
  return <ProductDetailsClient productId={productid} />;
}
