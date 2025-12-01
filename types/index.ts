import { User } from '@/types/user'

/**
 * Comprehensive Product interface - Single source of truth for Product type
 * This type matches the Prisma Product model and includes all product fields
 */
export interface Product {
  id: string
  productNumber?: string | null
  name: string
  price: number
  description: string
  image: string
  images?: string | null // JSON array of all images
  category: string
  inStock: boolean
  size?: string | null
  noDiscount?: boolean
  isHidden?: boolean
  // Detailed product content
  productDetails?: string | null // JSON object with key-value pairs
  keyFeatures?: string | null // JSON array of features
  benefits?: string | null // JSON array of benefits
  ingredients?: string | null // JSON array of ingredients
  howToUse?: string | null // Usage instructions
  directions?: string | null // Detailed directions
  // Skin recommendation fields
  skinType?: string | null // dry, oily, combination, normal, sensitive
  targetConcerns?: string | null // JSON array of concerns like ["anti-aging", "acne", "hydration"]
  usage?: string | null // morning, evening, all-day, morning-evening
  ageGroup?: string | null // teen, young-adult, adult, mature
  // Rating fields
  rating?: number | null // Product rating out of 5
  // Timestamps (optional, may not be present in all contexts)
  createdAt?: Date | string
  updatedAt?: Date | string
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
  updateColor: (productId: string, newColor: string, oldColor?: string, selectedSize?: string) => void
  clearCart: () => void
  getTotalPrice: (user?: User | null) => number
  getTotalItems: () => number
  setSelectedEmirate: (emirate: string) => void
}

