export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  images?: string // JSON array of all images
  category: string
  inStock: boolean
  size?: string | null
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

