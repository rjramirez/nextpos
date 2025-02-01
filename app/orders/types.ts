import { OrderStatus } from '@/constants/orderStatuses'

export interface ProductCategory {
  name: string;
  category_id?: number;
  description?: string;
}

export interface Product {
  product_id: string;
  name: string;
  product_categories?: ProductCategory;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  item_price: number;
  products: Product;
}

export interface TransactionProof {
  transaction_proof_id?: number;
  image_name: string;
}

export interface Order {
  order_id?: string;
  total_amount: number;
  order_items: OrderItem[];
  items: {
    product_id: string;
    quantity: number;
    price: number;
    name: string;
    category: string;
    number_of_items: number;
    products: {
      product_categories?: ProductCategory;
    };
  }[];
  transaction_proof_id?: number;
  transaction_proof?: TransactionProof;
  created_at: Date;
  status: OrderStatus;
}