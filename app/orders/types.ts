export interface Order {
  order_id?: string;
  total_amount: number;
  items: {
    product_id: string;
    quantity: number;
    price: number;
    name: string;
    category: string;
    number_of_items: number;
  }[];
  transaction_image?: string;
  created_at: Date;
  status: 'pending' | 'completed' | 'cancelled';
}