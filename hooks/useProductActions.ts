import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartProvider'
import { useFavorites } from '@/components/FavoritesProvider'
import { useAuth } from '@/components/AuthProvider'
import { Product } from '@/types'

export interface UseProductActionsReturn {
  quantity: number
  isAdding: boolean
  setQuantity: (quantity: number) => void
  incrementQuantity: () => void
  decrementQuantity: () => void
  handleAddToCart: (product: Product, selectedSize?: string, selectedColor?: string) => Promise<void>
  handleToggleFavorite: (product: Product) => void
}

export const useProductActions = (): UseProductActionsReturn => {
  const router = useRouter()
  const { addItem } = useCart()
  const { toggleFavorite } = useFavorites()
  const { user } = useAuth()
  
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const incrementQuantity = useCallback(() => {
    setQuantity(prev => Math.min(prev + 1, 99))
  }, [])

  const decrementQuantity = useCallback(() => {
    setQuantity(prev => Math.max(prev - 1, 1))
  }, [])

  const handleAddToCart = useCallback(async (
    product: Product, 
    selectedSize?: string, 
    selectedColor?: string
  ) => {
    if (!user) {
      router.push('/login')
      return
    }

    setIsAdding(true)
    try {
      // Determine if product has variants that affect pricing
      const hasSizeVariants = selectedSize && selectedSize !== 'default'
      const hasColorVariants = selectedColor && selectedColor !== 'default'
      
      const productToAdd = (hasSizeVariants || hasColorVariants)
        ? { ...product, price: product.price } // Price should be calculated by pricing hook
        : product
      
      await addItem(productToAdd, quantity, selectedColor, selectedSize)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }, [user, router, addItem, quantity])

  const handleToggleFavorite = useCallback((product: Product) => {
    if (!user) {
      router.push('/login')
      return
    }
    toggleFavorite(product)
  }, [user, router, toggleFavorite])

  return {
    quantity,
    isAdding,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart,
    handleToggleFavorite
  }
}
