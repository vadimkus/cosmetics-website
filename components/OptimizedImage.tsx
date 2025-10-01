import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
  fill?: boolean
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  loading?: 'lazy' | 'eager'
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy'
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Generate blur data URL if not provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='

  // Fallback image for errors - use a simple data URL
  const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzE2NS40NjQgMTAwIDE3Ny4yNzMgMTExLjgwOSAxNzcuMjczIDEyNy4yNzNDMTc3LjI3MyAxNDIuNzM3IDE2NS40NjQgMTU0LjU0NiAxNTAgMTU0LjU0NkMxMzQuNTM2IDE1NC41NDYgMTIyLjcyNyAxNDIuNzM3IDEyMi43MjcgMTI3LjI3M0MxMjIuNzI3IDExMS44MDkgMTM0LjUzNiAxMDAgMTUwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwMCAyMDBIMjAwVjI1MEgxMDBWMjAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'

  const handleError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleLoad = () => {
    setImageLoading(false)
  }

  if (imageError) {
    return (
      <div className={cn('bg-gray-200 flex items-center justify-center', className)}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📷</div>
          <div className="text-sm">Image not available</div>
        </div>
      </div>
    )
  }

  const imageProps = {
    src: imageError ? fallbackSrc : src,
    alt,
    className: cn(className, imageLoading && 'opacity-0'),
    priority,
    quality,
    placeholder,
    blurDataURL: blurDataURL || defaultBlurDataURL,
    sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    loading: priority ? 'eager' : loading,
    onError: handleError,
    onLoad: handleLoad,
    ...(fill ? { fill: true } : { width: width || 0, height: height || 0 })
  }

  return (
    <Image
      {...imageProps}
      alt={imageProps.alt || 'Image'}
      style={{
        objectFit,
        objectPosition,
        ...(fill && { position: 'relative' })
      }}
    />
  )
}
