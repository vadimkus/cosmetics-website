export interface ProductConfig {
  id: string
  pricing: {
    basePrice: number
    sizeVariants?: Record<string, number>
    colorVariants?: Record<string, number>
  }
  sizes?: Array<{ value: string; label: string; available: boolean }>
  colors?: Array<{ value: string; label: string; available: boolean }>
  images?: string[]
  videoUrl?: string
  documentation?: Array<{
    title: string
    url: string
    type: 'pdf' | 'video' | 'link'
  }>
}

export const PRODUCT_CONFIG: Record<string, ProductConfig> = {
  '1': {
    id: '1',
    pricing: {
      basePrice: 420,
      sizeVariants: {
        '30ml': 420,
        '50ml': 580
      }
    },
    sizes: [
      { value: '30ml', label: '30ml', available: true },
      { value: '50ml', label: '50ml', available: true }
    ],
    images: [
      '/images/products/intensive-hydro-soothing-cream-1.jpg',
      '/images/products/intensive-hydro-soothing-cream-2.jpg'
    ],
    documentation: [
      {
        title: 'Product Manual',
        url: '/documents/intensive-hydro-soothing-cream-manual.pdf',
        type: 'pdf'
      }
    ]
  },
  '2': {
    id: '2',
    pricing: {
      basePrice: 290,
      sizeVariants: {
        '30ml': 290,
        '50ml': 420
      }
    },
    sizes: [
      { value: '30ml', label: '30ml', available: true },
      { value: '50ml', label: '50ml', available: true }
    ],
    images: [
      '/images/products/moisture-replenishing-hyaluron-cream-1.jpg',
      '/images/products/moisture-replenishing-hyaluron-cream-2.jpg'
    ],
    documentation: [
      {
        title: 'Usage Guide',
        url: '/documents/moisture-replenishing-hyaluron-cream-guide.pdf',
        type: 'pdf'
      }
    ]
  },
  '3': {
    id: '3',
    pricing: {
      basePrice: 330,
      sizeVariants: {
        '30ml': 330,
        '50ml': 480
      }
    },
    sizes: [
      { value: '30ml', label: '30ml', available: true },
      { value: '50ml', label: '50ml', available: true }
    ],
    images: [
      '/images/products/multi-functional-anti-wrinkle-serum-1.jpg',
      '/images/products/multi-functional-anti-wrinkle-serum-2.jpg'
    ],
    videoUrl: '/videos/multi-functional-anti-wrinkle-serum-demo.mp4',
    documentation: [
      {
        title: 'Application Video',
        url: '/videos/multi-functional-anti-wrinkle-serum-demo.mp4',
        type: 'video'
      },
      {
        title: 'Product Brochure',
        url: '/documents/multi-functional-anti-wrinkle-serum-brochure.pdf',
        type: 'pdf'
      }
    ]
  }
}

export const getProductConfig = (productId: string): ProductConfig | null => {
  return PRODUCT_CONFIG[productId] || null
}

export const getProductPrice = (productId: string, size?: string, _color?: string): number => {
  const config = getProductConfig(productId)
  if (!config) return 0

  if (size && config.pricing.sizeVariants) {
    return config.pricing.sizeVariants[size] || config.pricing.basePrice
  }
  return config?.pricing.basePrice || 0
}

export const getProductSizes = (productId: string): Array<{ value: string; label: string; available: boolean }> => {
  const config = getProductConfig(productId)
  return config?.sizes || []
}

export const getProductColors = (productId: string): Array<{ value: string; label: string; available: boolean }> => {
  const config = getProductConfig(productId)
  return config?.colors || []
}

export const getProductImages = (productId: string): string[] => {
  const config = getProductConfig(productId)
  return config?.images || []
}

export const hasProductVariants = (productId: string): boolean => {
  const config = getProductConfig(productId)
  return !!(config?.sizes?.length || config?.colors?.length)
}

export const getProductVideoUrl = (productId: string): string | undefined => {
  const config = getProductConfig(productId)
  return config?.videoUrl
}

export const getProductDocumentation = (productId: string): Array<{
  title: string
  url: string
  type: 'pdf' | 'video' | 'link'
}> => {
  const config = getProductConfig(productId)
  return config?.documentation || []
}