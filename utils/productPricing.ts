import { Product } from '@/types'

/**
 * Get the price for a specific size variant
 * This handles all the product-specific pricing logic
 */
export function getPriceForSize(product: Product, size: string): number {
  const pid = product.productNumber || product.id
  
  // Product 1 - Microneedle Roller (all sizes same price)
  if (pid === '1') {
    return 230
  }
  
  // Product 10 - Two size options
  if (pid === '10') {
    return size === '180ml' ? 330 : 510
  }
  
  // Products 30, 29, 32, 28, 31 - Two size options
  if (pid === '30' || pid === '29' || pid === '32' || pid === '28' || pid === '31') {
    return size === '50g' ? 290 : 420
  }
  
  // Product 15 - Two size options
  if (pid === '15') {
    return size === '200ml' ? 260 : 490
  }
  
  // Product 16 - Two size options
  if (pid === '16') {
    return size === '200ml' ? 260 : 490
  }
  
  // Product 25 - Two size options
  if (pid === '25') {
    return size === '20g' ? 204 : 440
  }
  
  // Default: return product's base price
  return product.price
}

/**
 * Check if a product has size variants
 */
export function hasProductSizeVariants(productId: string): boolean {
  return ['1', '10', '15', '16', '25', '28', '29', '30', '31', '32'].includes(productId)
}

/**
 * Check if a product has color variants
 */
export function hasProductColorVariants(productId: string): boolean {
  return productId === '41' || productId === '63'
}

/**
 * Get available size options for a product
 */
export function getProductSizeOptions(productId: string): Array<{ value: string; label: string }> {
  if (productId === '1') {
    return [
      { value: '0.25mm', label: '0.25mm' },
      { value: '0.5mm', label: '0.5mm' },
      { value: '1.0mm', label: '1.0mm' },
      { value: '1.5mm', label: '1.5mm' },
      { value: '2.0mm', label: '2.0mm' }
    ]
  }
  
  if (productId === '10') {
    return [
      { value: '180ml', label: '180ml' },
      { value: '500ml', label: '500ml' }
    ]
  }
  
  if (productId === '31') {
    return [
      { value: '50g', label: '50g' },
      { value: '230g', label: '230g' }
    ]
  }
  
  if (['30', '29', '32', '28'].includes(productId)) {
    return [
      { value: '50g', label: '50g' },
      { value: '250g', label: '250g' }
    ]
  }
  
  if (productId === '15') {
    return [
      { value: '200ml', label: '200ml' },
      { value: '500ml', label: '500ml' }
    ]
  }
  
  if (productId === '16') {
    return [
      { value: '200ml', label: '200ml' },
      { value: '1000ml', label: '1000ml' }
    ]
  }
  
  if (productId === '25') {
    return [
      { value: '20g', label: '20g' },
      { value: '100g', label: '100g' }
    ]
  }
  
  return []
}

/**
 * Get available color options for a product
 */
export function getProductColorOptions(productId: string): Array<{ value: string; label: string; hex?: string }> {
  if (productId === '41') {
    return [
      { value: 'Beige', label: 'Beige', hex: '#E6D5B8' }, // Beige color - more visible tan
      { value: 'Ivory', label: 'Ivory', hex: '#F5E6D3' }, // Ivory color - light cream with slight warmth
      { value: 'Camel', label: 'Camel', hex: '#A67C52' }  // Camel color - darker brownish tan for visibility
    ]
  }
  
  if (productId === '63') {
    return [
      { value: 'Bright', label: '#01 Bright', hex: '#FFF5E6' },  // Bright - luminous light tone
      { value: 'Natural', label: '#02 Natural', hex: '#E8D5B7' }  // Natural - warm healthy tone
    ]
  }
  
  return []
}









