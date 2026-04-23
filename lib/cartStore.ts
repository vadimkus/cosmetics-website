import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartState, Product } from '@/types'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { getPriceForSize } from '@/utils/productPricing'
import { User } from '@/types/user'

// App badge functionality (direct API call, no hook needed in a store)
let updateAppBadge: ((count: number) => void) | null = null

if (typeof window !== 'undefined' && 'setAppBadge' in navigator) {
  updateAppBadge = (count: number) => {
    try {
      if (count <= 0) {
        (navigator as Navigator & { clearAppBadge: () => Promise<void> }).clearAppBadge()
      } else {
        (navigator as Navigator & { setAppBadge: (n: number) => Promise<void> }).setAppBadge(count)
      }
    } catch {
      // App badge not supported or failed, ignore
    }
  }
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

      // Decrement a single unit from the cart for a product, regardless of
      // which size/colour variant was added. Used by the "-" button in the
      // products grid stepper so users can roll back a tap without having
      // to open the bag. Picks the *last* non-bundle line for the product
      // (most recent add) and reduces its quantity by 1; removes the line
      // entirely when quantity drops to zero.
      decrementProductById: (productId: string) => {
        const items = get().items
        let targetIdx = -1
        for (let i = items.length - 1; i >= 0; i -= 1) {
          const it = items[i]
          if (it?.product?.id === productId && !it.fromBundle) {
            targetIdx = i
            break
          }
        }
        if (targetIdx < 0) return
        const target = items[targetIdx]
        if (!target) return
        const nextQty = (target.quantity || 0) - 1
        const newItems =
          nextQty <= 0
            ? items.filter((_, i) => i !== targetIdx)
            : items.map((it, i) => (i === targetIdx ? { ...it, quantity: nextQty } : it))
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
      
      updateSize: (productId: string, newSize: string, oldSize?: string, selectedColor?: string) => {
        const normalizedOldSize = oldSize || ''
        const normalizedColor = selectedColor || ''
        const normalizedNewSize = newSize || ''
        
        const items = get().items
        const itemToUpdate = items.find(item =>
          item.product.id === productId && 
          (item.selectedSize || '') === normalizedOldSize && 
          (item.selectedColor || '') === normalizedColor
        )
        
        if (itemToUpdate) {
          const existingItemWithNewSize = items.find(item =>
            item.product.id === productId && 
            (item.selectedSize || '') === normalizedNewSize && 
            (item.selectedColor || '') === normalizedColor &&
            item !== itemToUpdate
          )
          
          if (existingItemWithNewSize) {
            const updatedItems = items
              .map(item =>
                item.product.id === productId && 
                (item.selectedSize || '') === normalizedNewSize && 
                (item.selectedColor || '') === normalizedColor &&
                item !== itemToUpdate
                  ? { ...item, quantity: item.quantity + itemToUpdate.quantity }
                  : item
              )
              .filter(item => item !== itemToUpdate)
            
            set({ items: updatedItems })
            updateCartBadge(updatedItems)
          } else {
            const newPrice = getPriceForSize(itemToUpdate.product, newSize)
            const updatedItems = items.map(item =>
              item === itemToUpdate
                ? { 
                    ...item, 
                    selectedSize: normalizedNewSize,
                    product: { ...item.product, price: newPrice }
                  }
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
          let finalPrice: number
          
          if (item.fromBundle && item.bundleDiscountPercent && item.bundleDiscountPercent > 0) {
            // Bundle items: bundle discount ONLY on retail price — NO VIP/user discount
            const retailPrice = item.product.price
            finalPrice = retailPrice * (1 - item.bundleDiscountPercent / 100)
          } else {
            // Regular items: apply user discount as usual
            const pricing = calculateDiscountedPrice(item.product, user || null)
            finalPrice = pricing.discountedPrice
          }
          
          return total + (finalPrice * item.quantity)
        }, 0)
      },
      
      getTotalItems: () => {
        // Website cart never contains promotion items (those are native-app-only),
        // so a simple sum of quantities is correct and aligned with native app behavior.
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
