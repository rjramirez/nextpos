import { useState } from 'react'
import { Product } from "@/app/products/types";
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';

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
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [transactionImage, setTransactionImage] = useState<string | null>(null)
  const [transactionProof, setTransactionProof] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setTransactionProof(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setTransactionImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const proceedToCheckout = () => {
    setIsCheckoutModalOpen(true)
  }

  const saveOrder = async () => {
    if (!transactionProof) {
      toast.error('Please upload a transaction proof')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload transaction proof
      const formData = new FormData()
      formData.append('file', transactionProof)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || 'Failed to upload transaction proof')
      }

      const { filename: transactionProofPath } = await uploadResponse.json()

      // Get current user's email
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('No authenticated user found')
      }

      // Insert transaction proof
      const { data: transactionProofData, error: transactionProofError } = await supabase
        .from('transaction_proofs')
        .insert({
          image_name: transactionProofPath,
          created_at: new Date().toUTCString(),
          created_by: user.email
        })
        .select()

      if (transactionProofError) {
        throw transactionProofError
      }

      // Insert order items
      const orderItemsInserts = cart.map(item => ({
        product_id: item.product.product_id.toString(),
        quantity: item.quantity,
        status: 'pending' as const,
        order_date: new Date().toUTCString(),
        created_by: user.email,
        transaction_proof_id: transactionProofData[0].id
      }))

      const { error: orderError, data: orderData } = await supabase
        .from('orders')
        .insert(orderItemsInserts)

      if (orderError) {
        console.error('Supabase Order Insertion Error:', {
          error: orderError,
          orderItemsInserts: JSON.stringify(orderItemsInserts)
        });
        throw new Error(`Failed to save order: ${orderError.message}`);
      }

      console.log('Order saved successfully:', orderData);

      toast.success('Order saved successfully!')
      onClose()
    } catch (error) {
      console.error('Error saving order:', error)
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
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
                  onClick={proceedToCheckout}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transaction Upload Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Upload Transaction Proof</h2>
              <button 
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label 
                htmlFor="transaction-upload" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Transaction Proof
              </label>
              <input 
                type="file" 
                id="transaction-upload"
                accept="image/*" 
                onChange={handleImageUpload} 
                className="w-full border rounded-lg p-2"
                disabled={isSubmitting}
              />
            </div>

            {transactionImage && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Preview:</h3>
                <Image 
                  src={transactionImage} 
                  alt="Transaction Proof" 
                  width={400} 
                  height={300} 
                  className="rounded-lg object-cover" 
                />
              </div>
            )}

            <button 
              onClick={saveOrder}
              disabled={!transactionImage || isSubmitting}
              className={`w-full py-2 px-4 rounded-lg transition-colors ${
                transactionImage && !isSubmitting
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}