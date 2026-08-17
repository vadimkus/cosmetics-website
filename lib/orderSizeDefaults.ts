/**
 * Get default size for a product based on its name/type
 * This ensures products without size selectors still get appropriate sizes
 */
export function getDefaultSizeForProduct(productName: string): string | undefined {
  const name = productName.toUpperCase()
  
  // Serums - typically 30ml
  if (name.includes('SERUM')) {
    if (name.includes('ALL FOR SENSITIVE')) return '30ml'
    if (name.includes('MOISTURE REPLENISHING HYALURON')) return '30ml'
    if (name.includes('MULTI FUNCTIONAL ANTI-WRINKLE')) return '30ml'
    if (name.includes('PROBLEM CONTROL')) return '30ml'
    if (name.includes('EYECELL EYE CONTOUR')) return '10ml'
    return '30ml' // Default for serums
  }
  
  // Creams - typically 50g (homecare) or 250g (professional)
  if (name.includes('CREAM')) {
    if (name.includes('MOISTURE REPLENISHING HYALURON')) return '50g'
    if (name.includes('MULTI FUNCTIONAL ANTI-WRINKLE')) return '50g'
    // Discontinued Jul 2026, and its page was retired in Aug 2026. This line stays:
    // past orders and invoices still carry the name and need a size to render.
    if (name.includes('EGF REPAIR OXYMASK')) return '50g'
    if (name.includes('SKIN BARRIER PROTECTING')) return '100g'
    if (name.includes('EYECELL EYE CONTOUR')) return '20g'
    return '50g' // Default for creams
  }
  
  // Mists/Toners
  if (name.includes('MIST') || name.includes('TONER')) {
    if (name.includes('MICROBIOME ENERGY INFUSING')) return '80ml'
    if (name.includes('SNOW BOOSTER')) return '200ml'
    if (name.includes('INTENSIVE PROBLEM CONTROL')) return '200ml'
    return '200ml' // Default for mists/toners
  }
  
  // Cleansers
  if (name.includes('CLEANSER')) {
    if (name.includes('SNOW O₂') || name.includes('SNOW O2')) return '180ml'
    return '180ml' // Default for cleansers
  }
  
  // Masks
  if (name.includes('MASK')) {
    if (name.includes('SOOTHING BOMB SEA ALGAE')) return '25g'
    if (name.includes('PEPTIDE GEL')) return '38g'
    if (name.includes('COLLAGEN')) return '25g'
    return '25g' // Default for masks
  }
  
  // Eye products
  if (name.includes('EYE')) {
    if (name.includes('SERUM')) return '10ml'
    if (name.includes('CREAM')) return '20g'
    if (name.includes('PATCH')) return '101g'
  }
  
  // Beauty Boxes - all beauty boxes are "1 kit"
  if (name.includes('BEAUTY BOX') || name.includes('BEAUTYBOX')) {
    return '1 kit'
  }
  
  // No default size found
  return undefined
}

/**
 * Enhance order item with default size if missing
 */
export function enhanceOrderItemWithDefaultSize(item: {
  productName: string
  size?: string | null
  color?: string | null
}): {
  size?: string | null
  color?: string | null
} {
  // If size is missing or empty, try to get default
  if (!item.size || item.size.trim() === '') {
    const defaultSize = getDefaultSizeForProduct(item.productName)
    return {
      size: defaultSize || null,
      color: item.color || null
    }
  }
  
  return {
    size: item.size,
    color: item.color || null
  }
}

