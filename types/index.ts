import { User } from '@/types/user'

export interface Product {
  id: string
  productNumber?: string | null
  name: string
  price: number
  description: string
  image: string
  images: string | null // JSON array of all images
  category: string
  inStock: boolean
  size?: string | null
  noDiscount?: boolean
  // Detailed product content
  productDetails?: string | null // JSON object with key-value pairs
  keyFeatures?: string | null // JSON array of features
  benefits?: string | null // JSON array of benefits
  ingredients?: string | null // JSON array of ingredients
  howToUse?: string | null // Usage instructions
  directions?: string | null // Detailed directions
  rating?: number | null // Product rating out of 5
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export interface CartState {
  items: CartItem[]
  selectedEmirate: string
  addItem: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void
  removeItem: (productId: string, selectedColor?: string, selectedSize?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void
  clearCart: () => void
  getTotalPrice: (user?: User | null) => number
  getTotalItems: () => number
  setSelectedEmirate: (emirate: string) => void
}

