'use client'

import Image from 'next/image'
import { ImageIcon, Package, PlayCircle, Rotate3D } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ProductExperienceConfig } from '@/lib/productExperience'
import { cn } from '@/lib/utils'
import Product360Spin from './Product360Spin'

type ProductMediaTab = 'spin360' | 'photos' | 'video' | 'model3d'

interface ProductImmersiveMediaProps {
  productName: string
  galleryImages: string[]
  videoUrl?: string | null
  experience?: ProductExperienceConfig
  className?: string
}

const tabLabels: Record<ProductMediaTab, string> = {
  spin360: '360 View',
  photos: 'Photos',
  video: 'Video',
  model3d: '3D / AR',
}

const tabIcons: Record<ProductMediaTab, typeof Rotate3D> = {
  spin360: Rotate3D,
  photos: ImageIcon,
  video: PlayCircle,
  model3d: Package,
}

export default function ProductImmersiveMedia({
  productName,
  galleryImages,
  videoUrl,
  experience,
  className,
}: ProductImmersiveMediaProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  const tabs = useMemo<ProductMediaTab[]>(() => {
    const availableTabs: ProductMediaTab[] = []
    if (experience?.status === 'ready' && experience.spin360?.frames.length) {
      availableTabs.push('spin360')
    }
    if (galleryImages.length > 0) {
      availableTabs.push('photos')
    }
    if (videoUrl) {
      availableTabs.push('video')
    }
    if (experience?.status === 'ready' && experience.model3d?.glbUrl) {
      availableTabs.push('model3d')
    }
    return availableTabs
  }, [experience, galleryImages.length, videoUrl])

  const [activeTab, setActiveTab] = useState<ProductMediaTab>(() => tabs[0] || 'photos')

  useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab(tabs[0] || 'photos')
    }
  }, [activeTab, tabs])

  if (tabs.length === 0) {
    return null
  }

  const selectedImage = galleryImages[selectedPhotoIndex] || galleryImages[0] || ''
  const activeSpin = experience?.status === 'ready' ? experience.spin360 : undefined

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab]
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
                activeTab === tab
                  ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                  : 'border-[var(--color-border-primary)] bg-white text-[var(--color-text-secondary)] hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700'
              )}
            >
              <Icon className="h-4 w-4" />
              {tabLabels[tab]}
            </button>
          )
        })}
      </div>

      {activeTab === 'spin360' && activeSpin && (
        <Product360Spin
          frames={activeSpin.frames}
          alt={activeSpin.alt}
          priority
        />
      )}

      {activeTab === 'photos' && selectedImage && (
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--color-bg-secondary)] shadow-sm">
            <Image
              src={selectedImage}
              alt={`${productName} product photo ${selectedPhotoIndex + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
              className="object-contain p-6 md:p-8"
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={cn(
                    'relative h-14 w-14 overflow-hidden rounded-lg border-2 bg-[var(--color-bg-secondary)] transition',
                    selectedPhotoIndex === index ? 'border-primary-600' : 'border-[var(--color-border-primary)] hover:border-[var(--color-border-secondary)]'
                  )}
                  aria-label={`Show ${productName} photo ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'video' && videoUrl && (
        <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
          <video
            className="aspect-video w-full object-contain"
            controls
            playsInline
            preload="metadata"
            poster="/Logo/BlackG.png"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {activeTab === 'model3d' && (
        <div className="aspect-square rounded-2xl border border-dashed border-[var(--color-border-secondary)] bg-[var(--color-bg-primary)] p-8 text-center text-sm text-[var(--color-text-tertiary)]">
          3D model slot is ready. Add GLB/USDZ assets and register the model viewer runtime during activation.
        </div>
      )}
    </div>
  )
}
