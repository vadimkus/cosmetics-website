import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartState, CartItem, Product } from '@/types'

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedEmirate: 'Dubai',
      
      addItem: (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
        const items = get().items
        const existingItem = items.find(item => 
          item.product.id === product.id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
        )
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id && 
              item.selectedColor === selectedColor && 
              item.selectedSize === selectedSize
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({
            items: [...items, { product, quantity, selectedColor, selectedSize }]
          })
        }
      },
      
      removeItem: (productId: string, selectedColor?: string, selectedSize?: string) => {
        set({
          items: get().items.filter(item => 
            !(item.product.id === productId && 
              item.selectedColor === selectedColor && 
              item.selectedSize === selectedSize)
          )
        })
      },
      
      updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor, selectedSize)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.product.id === productId && 
            item.selectedColor === selectedColor && 
            item.selectedSize === selectedSize
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0
        )
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      setSelectedEmirate: (emirate: string) => {
        set({ selectedEmirate: emirate })
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
