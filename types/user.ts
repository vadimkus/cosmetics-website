export interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  address?: string | null
  profilePicture?: string | null
  isAdmin?: boolean
  canSeePrices?: boolean
  discountType?: string | null
  discountPercentage?: number | null
  birthday?: string | null
  createdAt: string
  updatedAt?: string | null
}
