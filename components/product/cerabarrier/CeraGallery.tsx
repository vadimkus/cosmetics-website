'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

export interface CeraGalleryImage {
  src: string
  alt: string
  /**
   * Multiply this slide into the stage tint. For shots on a pure white
   * background, which the stage contains rather than crops: untouched, a white
   * shot fills the square stage completely and turns the whole card into a stark
   * white block against a tinted page. Multiplying turns its white surround into
   * the stage tint so only the product reads.
   *
   * Leave it off for shots on a studio sweep. Multiplying those darkens the
   * sweep instead of dissolving it, which is the grey-block problem in reverse.
   * A gallery can mix the two: product 5 pairs a lifestyle shot on lilac-grey
   * with two packshots on white.
   */
  blend?: boolean
}

/**
 * Hero gallery for the CERABARRIER page (product 66): a soft cream stage for
 * the packshot, a thumbnail rail (vertical on desktop, horizontal on mobile)
 * and a keyboard-navigable lightbox.
 */
export default function CeraGallery({
  images,
  isRtl = false,
  badge,
}: {
  images: CeraGalleryImage[]
  isRtl?: boolean
  badge?: string
}) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  // The lightbox is portalled to <body>: the gallery sits inside stacking
  // contexts (sticky column, reveal transforms) that would otherwise trap it
  // beneath the site header and the size selector.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const count = images.length
  const go = useCallback((delta: number) => {
    setLightbox(prev => (prev === null ? prev : (prev + delta + count) % count))
  }, [count])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowLeft') go(isRtl ? 1 : -1)
      if (e.key === 'ArrowRight') go(isRtl ? -1 : 1)
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [lightbox, go, isRtl])

  const current = images[active] ?? images[0]
  if (!current) return null

  return (
    <div className="lg:flex lg:items-start lg:gap-5">
      {/* Thumbnail rail */}
      {count > 1 && (
        <div className="order-2 mt-3 flex gap-2.5 overflow-x-auto pb-1 lg:order-1 lg:mt-0 lg:w-[80px] lg:flex-none lg:flex-col lg:overflow-visible lg:pb-0">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${count}`}
              aria-pressed={active === i}
              className={`relative h-[72px] w-[72px] flex-none overflow-hidden rounded-2xl border bg-white transition-all duration-300 lg:h-[80px] lg:w-[80px] ${
                active === i
                  ? 'border-[var(--cera-rose)] shadow-[0_10px_24px_-16px_rgba(143,90,90,0.6)]'
                  : 'border-[var(--cera-line)] opacity-70 hover:opacity-100'
              }`}
            >
              {/* Matches the stage, so the thumbnail previews the framing the
                  shopper actually gets when they click it. Thumbnails sit on
                  white rather than the stage tint, so a blended slide has
                  nothing to multiply into and is left alone. */}
              <Image
                src={img.src}
                alt=""
                fill
                sizes="80px"
                className="object-contain"
                quality={70}
              />
            </button>
          ))}
        </div>
      )}

      {/* Stage */}
      <div className="order-1 min-w-0 flex-1 lg:order-2">
        {/* The packshots are square studio shots on a near-white sweep, so the
            image fills the stage edge to edge: no inner padding and no border,
            which would otherwise read as two competing rectangles. */}
        {/* The stage stays square even where a product's slides are not, because
            a stage that resized per slide would make the whole page jump as you
            click through the thumbnails. */}
        <div className="cera-stage relative aspect-square w-full overflow-hidden rounded-[28px] sm:rounded-[34px]">
          {/* Only over the main packshot: the other slides are infographics with
              their own headline in the top-left corner. */}
          {badge && active === 0 ? (
            <span
              className={`absolute top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--cera-rose-ink)] shadow-sm backdrop-blur ${
                isRtl ? 'right-4' : 'left-4'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {badge}
            </span>
          ) : null}

          <button
            type="button"
            onClick={() => setLightbox(active)}
            className="group absolute inset-0 cursor-zoom-in"
            aria-label="Open full-size image"
          >
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              priority={active === 0}
              quality={90}
              sizes="(max-width: 1024px) 92vw, 46vw"
              /* contain, not cover: most slides are square and render the same
                 either way, but product 60's infographics are 4:3 and cover was
                 slicing their headline off. The stage tint fills the gap. */
              className={`object-contain transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] ${
                current.blend ? 'mix-blend-multiply' : ''
              }`}
            />
            <span
              className={`pointer-events-none absolute bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[var(--cera-ink)] opacity-0 shadow-sm backdrop-blur transition-opacity duration-300 group-hover:opacity-100 ${
                isRtl ? 'left-4' : 'right-4'
              }`}
            >
              <ZoomIn className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {mounted && lightbox !== null && images[lightbox] ? createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#141110]/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#141110]/70 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-[#141110]/90"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="absolute left-5 top-6 z-10 text-sm tabular-nums text-white/60">
            {lightbox + 1} / {count}
          </span>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); go(-1) }}
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#141110]/70 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-[#141110]/90 sm:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); go(1) }}
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#141110]/70 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-[#141110]/90 sm:right-6"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-[78vh] w-full max-w-4xl"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={images[lightbox].src}
              alt={images[lightbox].alt}
              fill
              quality={95}
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  )
}
