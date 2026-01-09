export interface User {
  id: string
  name: string
  email: string
  contactEmail?: string | null
  appleSub?: string | null
  phone?: string | null
  address?: string | null
  profilePicture?: string | null
  gender?: string | null
  billingAddress?: string | null
  vatNumber?: string | null
  expoPushToken?: string | null
  isAdmin?: boolean
  canSeePrices?: boolean
  discountType?: string | null
  discountPercentage?: number | null
  birthday?: string | null
  lastLoginAt?: string | null
  createdAt: string
  updatedAt?: string | null
  password?: string | null // Only included in DB operations, never exposed to client
}

// Minimal user type for API pricing calculations
export interface ApiUser {
  id: string
  email: string
  name: string
  discountType?: string | null
  discountPercentage?: number | null
  canSeePrices?: boolean
}

// User type with order statistics (for admin)
export interface UserWithStats extends User {
  orderCount?: number
  totalSpent?: number
  lastOrderDate?: string | null
}

// Stripe error type for better error handling
export interface StripeError extends Error {
  code?: string
  statusCode?: number
  requestId?: string
  param?: string
  type?: string
}
