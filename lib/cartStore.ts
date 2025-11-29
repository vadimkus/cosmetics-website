import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartState, Product } from '@/types'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { User } from '@/types/user'

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedEmirate: 'Dubai',
      
      addItem: (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
        const items = get().items
        const normalizedColor = selectedColor || ''
        const normalizedSize = selectedSize || ''
        const existingItem = items.find(item => 
          item.product.id === product.id && 
          item.selectedColor === normalizedColor && 
          item.selectedSize === normalizedSize
        )
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id && 
              item.selectedColor === normalizedColor && 
              item.selectedSize === normalizedSize
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          set({
            items: [...items, { product, quantity, selectedColor: normalizedColor, selectedSize: normalizedSize }]
          })
        }
      },
      
      removeItem: (productId: string, selectedColor?: string, selectedSize?: string) => {
        const normalizedColor = selectedColor || ''
        const normalizedSize = selectedSize || ''
        set({
          items: get().items.filter(item => 
            !(item.product.id === productId && 
              item.selectedColor === normalizedColor && 
              item.selectedSize === normalizedSize)
          )
        })
      },
      
      updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor, selectedSize)
          return
        }
        
        const normalizedColor = selectedColor || ''
        const normalizedSize = selectedSize || ''
        set({
          items: get().items.map(item =>
            item.product.id === productId && 
            item.selectedColor === normalizedColor && 
            item.selectedSize === normalizedSize
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      updateColor: (productId: string, newColor: string, oldColor?: string, selectedSize?: string) => {
        const normalizedOldColor = oldColor || ''
        const normalizedSize = selectedSize || ''
        const normalizedNewColor = newColor || ''
        
        // Find the item to update
        const items = get().items
        const itemToUpdate = items.find(item =>
          item.product.id === productId && 
          (item.selectedColor || '') === normalizedOldColor && 
          (item.selectedSize || '') === normalizedSize
        )
        
        if (itemToUpdate) {
          // Check if an item with the new color already exists
          const existingItemWithNewColor = items.find(item =>
            item.product.id === productId && 
            (item.selectedColor || '') === normalizedNewColor && 
            (item.selectedSize || '') === normalizedSize &&
            item !== itemToUpdate
          )
          
          if (existingItemWithNewColor) {
            // Merge quantities and remove the old item
            const updatedItems = items
              .map(item =>
                item.product.id === productId && 
                (item.selectedColor || '') === normalizedNewColor && 
                (item.selectedSize || '') === normalizedSize &&
                item !== itemToUpdate
                  ? { ...item, quantity: item.quantity + itemToUpdate.quantity }
                  : item
              )
              .filter(item => item !== itemToUpdate)
            
            set({ items: updatedItems })
          } else {
            // Just update the color
            set({
              items: items.map(item =>
                item === itemToUpdate
                  ? { ...item, selectedColor: normalizedNewColor }
                  : item
              )
            })
          }
        }
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalPrice: (user?: User | null) => {
        return get().items.reduce((total, item) => {
          const pricing = calculateDiscountedPrice(item.product, user || null)
          return total + (pricing.discountedPrice * item.quantity)
        }, 0)
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
