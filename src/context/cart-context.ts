import { createContext } from "react"
import type { CartItem, CartItemKey, PaymentDetails, PaymentResult } from "@/types/cart"

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  currency: string
  addItem: (item: Omit<CartItem, "key" | "quantity">, quantity?: number) => void
  updateQuantity: (key: CartItemKey, quantity: number) => void
  removeItem: (key: CartItemKey) => void
  clearCart: () => void
  processPayment: (details: PaymentDetails) => Promise<PaymentResult>
  isProcessingPayment: boolean
}

export const CartContext = createContext<CartContextValue | null>(null)
