export type ProductExperienceStatus = 'asset-pending' | 'ready'

export interface NumberedFrameSetOptions {
  basePath: string
  filePrefix: string
  extension: 'jpg' | 'jpeg' | 'png' | 'webp'
  count: number
  pad?: number
}

export interface Product360Experience {
  frameCount: number
  frames: string[]
  poster: string
  alt: string
}

export interface ProductModelExperience {
  glbUrl?: string
  usdzUrl?: string
  poster: string
  alt: string
}

export interface ProductExperienceConfig {
  productNumber: string
  status: ProductExperienceStatus
  title: string
  spin360?: Product360Experience
  model3d?: ProductModelExperience
  notes?: string
}

const buildNumberedFrames = ({
  basePath,
  filePrefix,
  extension,
  count,
  pad = 3,
}: NumberedFrameSetOptions): string[] => {
  return Array.from({ length: count }, (_, index) => {
    const frameNumber = String(index + 1).padStart(pad, '0')
    return `${basePath}/${filePrefix}-${frameNumber}.${extension}`
  })
}

const skinBarrierFrames = buildNumberedFrames({
  basePath: '/products/27/360',
  filePrefix: 'skin-barrier',
  extension: 'webp',
  count: 36,
})

export const PRODUCT_EXPERIENCE_CONFIG: Record<string, ProductExperienceConfig> = {
  '27': {
    productNumber: '27',
    status: 'asset-pending',
    title: 'Skin Barrier Protecting Cream 360 view',
    spin360: {
      frameCount: skinBarrierFrames.length,
      frames: skinBarrierFrames,
      poster: skinBarrierFrames[0] || '/images/BRR.jpg',
      alt: '360 degree product view of GENOSYS Skin Barrier Protecting Cream',
    },
    model3d: {
      poster: '/images/BRR.jpg',
      alt: '3D model of GENOSYS Skin Barrier Protecting Cream',
    },
    notes: 'Prepared for the first 36-frame turntable capture. Keep inactive until optimized assets are uploaded.',
  },
}

export const getProductExperience = (
  productId?: string | null,
  productNumber?: string | null
): ProductExperienceConfig | undefined => {
  const configKey = productNumber || productId
  return configKey ? PRODUCT_EXPERIENCE_CONFIG[configKey] : undefined
}

export const getReadyProductExperience = (
  productId?: string | null,
  productNumber?: string | null
): ProductExperienceConfig | undefined => {
  const experience = getProductExperience(productId, productNumber)
  return experience?.status === 'ready' ? experience : undefined
}
