import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartState, Product } from '@/types'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { User } from '@/types/user'

// Import app badge functionality
let updateAppBadge: ((count: number) => void) | null = null

// Dynamically import app badge hook (client-side only)
if (typeof window !== 'undefined') {
  import('@/hooks/useAppBadge').then(({ useAppBadge }) => {
    const { setBadge } = useAppBadge()
    updateAppBadge = setBadge
  }).catch(() => {
    // App badge not supported, ignore
  })
}

// Helper function to update app badge with cart count
const updateCartBadge = (items: CartState['items']) => {
  if (updateAppBadge) {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0)
    updateAppBadge(totalItems)
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedEmirate: 'Dubai',
      _hasHydrated: false,
      
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state })
      },
      
      addItem: (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string, bundleInfo?: { fromBundle: boolean; bundleDiscountPercent: number }) => {
        const items = get().items
        const normalizedColor = selectedColor || ''
        const normalizedSize = selectedSize || ''
        
        // For bundle items, we need to check both product ID and bundle status
        // Bundle items should NOT merge with individually added items (different discounts)
        const existingItem = items.find(item => 
          item.product.id === product.id && 
          item.selectedColor === normalizedColor && 
          item.selectedSize === normalizedSize &&
          // Only match if both are bundle items with same discount, or both are non-bundle
          (item.fromBundle === bundleInfo?.fromBundle) &&
          (item.bundleDiscountPercent === bundleInfo?.bundleDiscountPercent)
        )
        
        if (existingItem) {
          const newItems = items.map(item =>
            item.product.id === product.id && 
            item.selectedColor === normalizedColor && 
            item.selectedSize === normalizedSize &&
            item.fromBundle === bundleInfo?.fromBundle &&
            item.bundleDiscountPercent === bundleInfo?.bundleDiscountPercent
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
          set({ items: newItems })
          updateCartBadge(newItems)
        } else {
          const newItem = { 
            product, 
            quantity, 
            selectedColor: normalizedColor, 
            selectedSize: normalizedSize,
            ...(bundleInfo && { fromBundle: bundleInfo.fromBundle, bundleDiscountPercent: bundleInfo.bundleDiscountPercent })
          }
          const newItems = [...items, newItem]
          set({ items: newItems })
          updateCartBadge(newItems)
        }
      },
      
      removeItem: (productId: string, selectedColor?: string, selectedSize?: string) => {
        const normalizedColor = selectedColor || ''
        const normalizedSize = selectedSize || ''
        const newItems = get().items.filter(item => 
          !(item.product.id === productId && 
            item.selectedColor === normalizedColor && 
            item.selectedSize === normalizedSize)
        )
        set({ items: newItems })
        updateCartBadge(newItems)
      },
      
      updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor, selectedSize)
          return
        }
        
        const normalizedColor = selectedColor || ''
        const normalizedSize = selectedSize || ''
        const newItems = get().items.map(item =>
          item.product.id === productId && 
          item.selectedColor === normalizedColor && 
          item.selectedSize === normalizedSize
            ? { ...item, quantity }
            : item
        )
        set({ items: newItems })
        updateCartBadge(newItems)
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
            updateCartBadge(updatedItems)
          } else {
            // Just update the color
            const updatedItems = items.map(item =>
              item === itemToUpdate
                ? { ...item, selectedColor: normalizedNewColor }
                : item
            )
            set({ items: updatedItems })
            updateCartBadge(updatedItems)
          }
        }
      },
      
      clearCart: () => {
        set({ items: [] })
        updateCartBadge([])
      },
      
      getTotalPrice: (user?: User | null) => {
        return get().items.reduce((total, item) => {
          // For bundle items, use the stored bundle discount instead of recalculating
          if (item.fromBundle && item.bundleDiscountPercent && item.bundleDiscountPercent > 0) {
            const originalPrice = item.product.price
            const bundleDiscountAmount = (originalPrice * item.bundleDiscountPercent) / 100
            const discountedPrice = originalPrice - bundleDiscountAmount
            return total + (discountedPrice * item.quantity)
          }
          // For non-bundle items, use the standard discount calculation
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
      onRehydrateStorage: () => (state) => {
        // Called when hydration from localStorage is complete
        state?.setHasHydrated(true)
      },
    }
  )
)
