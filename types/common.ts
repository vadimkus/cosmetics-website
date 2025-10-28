/**
 * Common TypeScript types and interfaces
 */

// Base types
export type ID = string
export type Timestamp = string | Date
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'failed'

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// User types
export interface User {
  id: ID
  email: string
  name: string
  phone?: string
  address?: string
  role: 'user' | 'admin' | 'professional'
  discountType?: 'CLINIC' | 'PROFESSIONAL'
  discountPercentage?: number
  canSeePrices: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Product types
export interface Product {
  id: ID
  productNumber?: string
  name: string
  description: string
  price: number
  category: string
  image: string
  images?: string
  inStock: boolean
  noDiscount?: boolean
  // Detailed product content
  productDetails?: string | null // JSON object with key-value pairs
  keyFeatures?: string | null // JSON array of features
  benefits?: string | null // JSON array of benefits
  ingredients?: string | null // JSON array of ingredients
  howToUse?: string | null // Usage instructions
  directions?: string | null // Detailed directions
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Cart types
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// Order types
export interface Order {
  id: ID
  userId: ID
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Address {
  fullName: string
  email: string
  phone: string
  emirate: string
  address: string
}

// Analytics types
export interface PageView {
  id: ID
  url: string
  userId?: ID
  userAgent: string
  ipAddress: string
  country?: string
  city?: string
  deviceType: string
  browser: string
  os: string
  referrer?: string
  timestamp: Timestamp
}

export interface PDFDownload {
  id: ID
  filename: string
  userId?: ID
  userEmail?: string
  ipAddress: string
  userAgent: string
  country?: string
  city?: string
  deviceType: string
  browser: string
  os: string
  referrer?: string
  timestamp: Timestamp
}

// Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingProps {
  loading?: boolean
  loadingText?: string
}

export interface ErrorProps {
  error?: string | Error
  onRetry?: () => void
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: any) => string | null
  }
}

export interface FormData {
  [key: string]: any
}

export interface FormErrors {
  [key: string]: string
}

// Navigation types
export interface BreadcrumbItem {
  name: string
  url: string
  current?: boolean
}

export interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
  children?: NavigationItem[]
}

// SEO types
export interface SEOData {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  twitterCard?: 'summary' | 'summary_large_image'
  noIndex?: boolean
  noFollow?: boolean
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// Event types
export interface CustomEvent<T = any> {
  type: string
  payload: T
  timestamp: Timestamp
}

// Hook types
export interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

// Configuration types
export interface AppConfig {
  apiUrl: string
  environment: 'development' | 'staging' | 'production'
  features: {
    analytics: boolean
    pwa: boolean
    offline: boolean
  }
  limits: {
    maxFileSize: number
    maxItemsPerPage: number
  }
}
