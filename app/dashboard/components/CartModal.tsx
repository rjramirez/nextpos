import { Product } from "@/app/products/types";

interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  cart: { product: Product; quantity: number }[]
  totalAmount: number,
  categoryMap: Record<string, string>
}

const categoryEmojis: Record<string, string> = {
  Beverages: '☕',
  Food: '🥪',
  Merchandise: '🛍️',
  Seasonal: '🎃',
  'Coffee Beans': '🌱',
  Teas: '🍵',
  Unknown: '❓',
};

export default function CartModal({ isOpen, onClose, cart, totalAmount, categoryMap }: CartModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Shopping Cart</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Your cart is empty</p>
        ) : (
          <>
            <ul className="space-y-2 mb-4">
              {cart.map((item) => (
                <li 
                  key={`cart-${item.product.product_id}`} 
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="text-black font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">{categoryEmojis[categoryMap[item.product.product_category_id]]}{categoryMap[item.product.product_category_id]}</p>
                    <p className="text-sm text-gray-600">₱{item.product.price} x {item.quantity}</p>
                  </div>
                  <p className="text-black font-medium">₱{item.product.price * item.quantity}</p>
                </li>
              ))}
            </ul>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-black">Total:</span>
                <span className="text-lg font-bold text-black">₱{totalAmount}</span>
              </div>
              
              <button 
                onClick={() => {
                  // Add checkout logic here
                  console.log('Proceeding to checkout...');
                }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 