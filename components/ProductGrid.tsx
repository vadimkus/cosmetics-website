'use client'

import { products } from '@/lib/products'
import ProductCard from './ProductCard'
import { memo, useMemo } from 'react'

interface ProductGridProps {
  category?: string
}

const ProductGrid = memo(function ProductGrid({ category }: ProductGridProps) {
  const filteredProducts = useMemo(() => {
    return category 
      ? products.filter(product => product.category === category)
      : products
  }, [category])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
})

export default ProductGrid
