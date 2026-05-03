import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartLineIdentity, CartState, Product } from '@/types'
import { getCartTotalPrice } from '@/lib/cartPricing'
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

const isBundleLine = (item: CartState['items'][number]) => item.fromBundle === true

const lineIdentityMatches = (
  item: CartState['items'][number],
  bundleInfo?: CartLineIdentity
) => {
  const expectedBundle = bundleInfo?.fromBundle === true
  return isBundleLine(item) === expectedBundle
}

export function getBuildSetDiscountForCount(count: number): number {
  if (count >= 5) return 20
  if (count >= 4) return 15
  if (count >= 3) return 10
  if (count >= 2) return 5
  return 0
}

export function reconcileBuildSetBundleDiscounts(items: CartState['items']): CartState['items'] {
  const bundleLineCount = items.filter(isBundleLine).length
  const activePct = getBuildSetDiscountForCount(bundleLineCount)

  return items.map((item) => {
    if (!isBundleLine(item)) return item

    if (activePct <= 0) {
      const nextItem = { ...item }
      delete nextItem.fromBundle
      delete nextItem.bundleDiscountPercent
      return nextItem
    }

    return {
      ...item,
      fromBundle: true,
      bundleDiscountPercent: activePct,
    }
  })
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
      
      addItem: (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string, bundleInfo?: CartLineIdentity) => {
        const items = get().items
        const normalizedColor = selectedColor || ''
        const normalizedSize = selectedSize || ''
        
        // For bundle items, we need to check both product ID and bundle status
        // Bundle items should NOT merge with individually added items (different discounts)
        const existingItem = items.find(item => 
          item.product.id === product.id && 
          item.selectedColor === normalizedColor && 
          item.selectedSize === normalizedSize &&
          lineIdentityMatches(item, bundleInfo)
        )
        
        if (existingItem) {
          const newItems = reconcileBuildSetBundleDiscounts(items.map(item =>
            item.product.id === product.id && 
            item.selectedColor === normalizedColor && 
            item.selectedSize === normalizedSize &&
            lineIdentityMatches(item, bundleInfo)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ))
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
          const newItems = reconcileBuildSetBundleDiscounts([...items, newItem])
          set({ items: newItems })
          updateCartBadge(newItems)
        }
      },
      
      removeItem: (productId: string, selectedColor?: string, selectedSize?: string, bundleInfo?: CartLineIdentity) => {
        const normalizedColor = selectedColor || ''
        const normalizedSize = selectedSize || ''
        const newItems = reconcileBuildSetBundleDiscounts(get().items.filter(item => 
          !(item.product.id === productId && 
            item.selectedColor === normalizedColor && 
            item.selectedSize === normalizedSize &&
            lineIdentityMatches(item, bundleInfo))
        ))
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
        const newItems = reconcileBuildSetBundleDiscounts(
          nextQty <= 0
            ? items.filter((_, i) => i !== targetIdx)
            : items.map((it, i) => (i === targetIdx ? { ...it, quantity: nextQty } : it))
        )
        set({ items: newItems })
        updateCartBadge(newItems)
      },
      
      updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string, bundleInfo?: CartLineIdentity) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor, selectedSize, bundleInfo)
          return
        }
        
        const normalizedColor = selectedColor || ''
        const normalizedSize = selectedSize || ''
        const newItems = reconcileBuildSetBundleDiscounts(get().items.map(item =>
          item.product.id === productId && 
          item.selectedColor === normalizedColor && 
          item.selectedSize === normalizedSize &&
          lineIdentityMatches(item, bundleInfo)
            ? { ...item, quantity }
            : item
        ))
        set({ items: newItems })
        updateCartBadge(newItems)
      },
      
      updateColor: (productId: string, newColor: string, oldColor?: string, selectedSize?: string, bundleInfo?: CartLineIdentity) => {
        const normalizedOldColor = oldColor || ''
        const normalizedSize = selectedSize || ''
        const normalizedNewColor = newColor || ''
        
        // Find the item to update
        const items = get().items
        const itemToUpdate = items.find(item =>
          item.product.id === productId && 
          (item.selectedColor || '') === normalizedOldColor && 
          (item.selectedSize || '') === normalizedSize &&
          lineIdentityMatches(item, bundleInfo)
        )
        
        if (itemToUpdate) {
          // Check if an item with the new color already exists
          const existingItemWithNewColor = items.find(item =>
            item.product.id === productId && 
            (item.selectedColor || '') === normalizedNewColor && 
            (item.selectedSize || '') === normalizedSize &&
            item !== itemToUpdate &&
            lineIdentityMatches(item, bundleInfo)
          )
          
          if (existingItemWithNewColor) {
            // Merge quantities and remove the old item
            const updatedItems = reconcileBuildSetBundleDiscounts(items
              .map(item =>
                item.product.id === productId && 
                (item.selectedColor || '') === normalizedNewColor && 
                (item.selectedSize || '') === normalizedSize &&
                item !== itemToUpdate &&
                lineIdentityMatches(item, bundleInfo)
                  ? { ...item, quantity: item.quantity + itemToUpdate.quantity }
                  : item
              )
              .filter(item => item !== itemToUpdate))
            
            set({ items: updatedItems })
            updateCartBadge(updatedItems)
          } else {
            // Just update the color
            const updatedItems = reconcileBuildSetBundleDiscounts(items.map(item =>
              item === itemToUpdate
                ? { ...item, selectedColor: normalizedNewColor }
                : item
            ))
            set({ items: updatedItems })
            updateCartBadge(updatedItems)
          }
        }
      },
      
      updateSize: (productId: string, newSize: string, oldSize?: string, selectedColor?: string, bundleInfo?: CartLineIdentity) => {
        const normalizedOldSize = oldSize || ''
        const normalizedColor = selectedColor || ''
        const normalizedNewSize = newSize || ''
        
        const items = get().items
        const itemToUpdate = items.find(item =>
          item.product.id === productId && 
          (item.selectedSize || '') === normalizedOldSize && 
          (item.selectedColor || '') === normalizedColor &&
          lineIdentityMatches(item, bundleInfo)
        )
        
        if (itemToUpdate) {
          const existingItemWithNewSize = items.find(item =>
            item.product.id === productId && 
            (item.selectedSize || '') === normalizedNewSize && 
            (item.selectedColor || '') === normalizedColor &&
            item !== itemToUpdate &&
            lineIdentityMatches(item, bundleInfo)
          )
          
          if (existingItemWithNewSize) {
            const updatedItems = reconcileBuildSetBundleDiscounts(items
              .map(item =>
                item.product.id === productId && 
                (item.selectedSize || '') === normalizedNewSize && 
                (item.selectedColor || '') === normalizedColor &&
                item !== itemToUpdate &&
                lineIdentityMatches(item, bundleInfo)
                  ? { ...item, quantity: item.quantity + itemToUpdate.quantity }
                  : item
              )
              .filter(item => item !== itemToUpdate))
            
            set({ items: updatedItems })
            updateCartBadge(updatedItems)
          } else {
            const newPrice = getPriceForSize(itemToUpdate.product, newSize)
            const updatedItems = reconcileBuildSetBundleDiscounts(items.map(item =>
              item === itemToUpdate
                ? { 
                    ...item, 
                    selectedSize: normalizedNewSize,
                    product: { ...item.product, price: newPrice }
                  }
                : item
            ))
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
        return getCartTotalPrice(get().items, user || null)
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
