import { User } from '@/types/user'

// Re-export user types for convenience
export type { User, ApiUser, UserWithStats, StripeError } from '@/types/user'

/**
 * Order item from cart for checkout
 */
export interface CheckoutCartItem {
  productId: string
  productName?: string
  quantity: number
  price?: number
  selectedSize?: string
  selectedColor?: string
  size?: string
  color?: string
  isPromotionItem?: boolean
}

/**
 * Order with all fields from Prisma schema
 */
export interface OrderWithDetails {
  id: string
  orderNumber: string
  customerEmail: string
  customerName: string
  customerPhone: string
  customerEmirate: string
  customerAddress: string
  orderNotes?: string | null
  subtotal: number
  discountAmount: number
  shipping: number
  vat: number
  total: number
  status: string
  locale: string
  sessionId?: string | null
  paymentMethod: string
  paymentStatus: string
  stripeSessionId?: string | null
  stripePaymentIntentId?: string | null
  stripeCustomerId?: string | null
  paidAt?: Date | null
  refundedAt?: Date | null
  refundAmount?: number | null
  paymentMetadata?: string | null
  createdAt: Date | string
  updatedAt: Date | string
  items?: OrderItemDetails[]
}

export interface OrderItemDetails {
  id: string
  orderId: string
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
  color?: string | null
  size?: string | null
}

/**
 * Comprehensive Product interface - Single source of truth for Product type
 * This type matches the Prisma Product model and includes all product fields
 */
export interface ProductVariant {
  id: string
  productId?: string
  size: string | null
  color: string | null
  price: number
  available: boolean
  isDefault: boolean
  stockQuantity?: number | null
}

export interface Product {
  id: string
  productNumber?: string | null
  name: string
  nameRu?: string | null
  nameAr?: string | null
  price: number
  description: string
  descriptionRu?: string | null
  descriptionAr?: string | null
  image: string
  images?: string | null // JSON array of all images
  videoUrl?: string | null // Video URL path (e.g., /videos/egf.mp4)
  category: string
  inStock: boolean
  size?: string | null
  noDiscount?: boolean
  isHidden?: boolean
  isPriceOnRequest?: boolean // Professional products with price on request
  disclaimer?: string | null // Product disclaimer
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
  // Product variants (optional, loaded from database)
  variants?: ProductVariant[]
  // Timestamps (optional, may not be present in all contexts)
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
  // Bundle tracking - items added from Bundle Builder
  fromBundle?: boolean
  bundleDiscountPercent?: number
}

export interface CartState {
  items: CartItem[]
  selectedEmirate: string
  _hasHydrated: boolean
  addItem: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string, bundleInfo?: { fromBundle: boolean; bundleDiscountPercent: number }) => void
  removeItem: (productId: string, selectedColor?: string, selectedSize?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void
  updateColor: (productId: string, newColor: string, oldColor?: string, selectedSize?: string) => void
  updateSize: (productId: string, newSize: string, oldSize?: string, selectedColor?: string) => void
  clearCart: () => void
  getTotalPrice: (user?: User | null) => number
  getTotalItems: () => number
  setSelectedEmirate: (emirate: string) => void
  setHasHydrated: (state: boolean) => void
}

