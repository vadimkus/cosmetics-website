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
  getTotalPrice: () => number
  getTotalItems: () => number
  setSelectedEmirate: (emirate: string) => void
}

