import Image from 'next/image'
import type { BlogImageDimensions } from '@/lib/blogImageDimensions.server'

type BlogFeaturedImageProps = {
  src: string
  alt: string
  dimensions: BlogImageDimensions
}

/**
 * Natural-aspect blog hero:
 * - landscape images use the article width
 * - square-ish images use a balanced 42rem width
 * - portrait images stay centered and are height-capped
 */
export default function BlogFeaturedImage({
  src,
  alt,
  dimensions,
}: BlogFeaturedImageProps) {
  const ratio = dimensions.width / dimensions.height
  const portrait = ratio < 0.85
  const squareish = ratio >= 0.85 && ratio <= 1.25

  const wrapperWidth = portrait
    ? 'fit-content'
    : squareish
      ? 'min(100%, 42rem)'
      : '100%'

  return (
    <div
      className="mx-auto mb-10 max-w-full overflow-hidden rounded-xl bg-gray-50 shadow-lg"
      style={{ width: wrapperWidth }}
    >
      <Image
        src={src}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        className={
          portrait
            ? 'block h-auto max-h-[72vh] w-auto max-w-full object-contain'
            : 'block h-auto w-full object-contain'
        }
        priority
        sizes={
          portrait
            ? '(max-width: 768px) 100vw, 50vw'
            : squareish
              ? '(max-width: 768px) 100vw, 42rem'
              : '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px'
        }
      />
    </div>
  )
}
