// app/products/components/ProductHeader.tsx
import { CSVLink } from 'react-csv';
import { ShoppingCartIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ProductHeaderProps {
  onAddProduct: () => void;
  csvData: Array<{
    ID: number | string;
    Name: string;
    Description: string;
    Price: number;
    Stock: number;
    Status: string;
    Created_By: string;
    Updated_By: string;
    Created_At: string;
    Updated_At: string;
    Active: boolean;    
  }>;
}

export const ProductHeader = ({ onAddProduct, csvData }: ProductHeaderProps) => (
  <div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold text-black">Product Management</h1>
    <div className="flex gap-2">
      <button
        onClick={onAddProduct}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
      >
        <PlusIcon className="h-5 w-5" />
        Add Product
      </button>
      <CSVLink
        data={csvData}
        filename="products.csv"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
      >
        <ShoppingCartIcon className="h-5 w-5" />
        Export CSV
      </CSVLink>
    </div>
  </div>
);