export type CartItemKey = string

export interface CartItem {
  key: CartItemKey
  productId: string
  name: string
  price: number
  currency: string
  image: string
  size?: number
  color?: string
  quantity: number
  stock: number
}

export interface PaymentDetails {
  fullName: string
  email: string
  address: string
  city: string
  country: string
  cardNumber: string
  expiration: string
  cvv: string
}

export interface PaymentResult {
  success: boolean
  orderId?: string
  message?: string
}
