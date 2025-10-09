'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ProductContextType {
  selectedImage: number
  selectedSize: string
  selectedColor: string
  setSelectedImage: (index: number) => void
  setSelectedSize: (size: string) => void
  setSelectedColor: (color: string) => void
  resetSelections: () => void
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

interface ProductProviderProps {
  children: ReactNode
}

export function ProductProvider({ children }: ProductProviderProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('default')
  const [selectedColor, setSelectedColor] = useState('default')

  const resetSelections = useCallback(() => {
    setSelectedImage(0)
    setSelectedSize('default')
    setSelectedColor('default')
  }, [])

  const value: ProductContextType = {
    selectedImage,
    selectedSize,
    selectedColor,
    setSelectedImage,
    setSelectedSize,
    setSelectedColor,
    resetSelections
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProductContext() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider')
  }
  return context
}
