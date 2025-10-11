"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"
import { CartContext } from "./cart-context"
import type { CartItem, CartItemKey, PaymentDetails, PaymentResult } from "@/types/cart"

const CART_STORAGE_KEY = "zapateria-cart-items"

function buildCartKey(productId: string, size?: number, color?: string): CartItemKey {
  const sizeKey = size !== undefined ? String(size) : "_"
  const colorKey = color ? color.toLowerCase().replace(/\s+/g, "-") : "_"
  return `${productId}::${sizeKey}::${colorKey}`
}

function loadStoredCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => typeof item?.key === "string")
  } catch (error) {
    console.error("Failed to parse stored cart", error)
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadStoredCart())
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const itemCount = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items])
  const currency = useMemo(() => items[0]?.currency ?? "USD", [items])

  const addItem = useCallback(
    (payload: Omit<CartItem, "key" | "quantity">, quantity = 1) => {
      const key = buildCartKey(payload.productId, payload.size, payload.color)

      setItems((prev) => {
        const existing = prev.find((item) => item.key === key)
        if (existing) {
          const updatedQuantity = Math.min(existing.quantity + quantity, existing.stock)
          return prev.map((item) =>
            item.key === key ? { ...item, quantity: updatedQuantity } : item,
          )
        }

        const safeQuantity = Math.min(Math.max(quantity, 1), payload.stock)
        const newItem: CartItem = {
          key,
          quantity: safeQuantity,
          ...payload,
        }
        return [...prev, newItem]
      })

      toast.success("Added to cart", {
        description: `${payload.name} ${payload.size ? `(size ${payload.size})` : ""}`.trim(),
      })
    },
    [],
  )

  const updateQuantity = useCallback((key: CartItemKey, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.max(1, Math.min(quantity, item.stock)),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const removeItem = useCallback((key: CartItemKey) => {
    setItems((prev) => prev.filter((item) => item.key !== key))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const processPayment = useCallback(
    async (details: PaymentDetails): Promise<PaymentResult> => {
      if (items.length === 0) {
        return { success: false, message: "Your cart is empty." }
      }

      setIsProcessingPayment(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1800))

        const orderId = `RD-${Date.now().toString(36).toUpperCase()}`
        clearCart()

        toast.success("Payment confirmed", {
          description: `Order ${orderId} is on its way to ${details.city}, ${details.country}.`,
        })

        return { success: true, orderId }
      } catch (error) {
        console.error("Mock payment failed", error)
        toast.error("We couldn't process the payment. Please try again.")
        return { success: false, message: "Payment simulation failed." }
      } finally {
        setIsProcessingPayment(false)
      }
    },
    [items, clearCart],
  )

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      currency,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      processPayment,
      isProcessingPayment,
    }),
    [items, itemCount, subtotal, currency, addItem, updateQuantity, removeItem, clearCart, processPayment, isProcessingPayment],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
