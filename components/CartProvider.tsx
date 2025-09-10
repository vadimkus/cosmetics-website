'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useCartStore } from '@/lib/cartStore'
import { CartState } from '@/types'

const CartContext = createContext<CartState | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const cartStore = useCartStore()
  
  return (
    <CartContext.Provider value={cartStore}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartState {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
