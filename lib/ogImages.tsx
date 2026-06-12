import { ImageResponse } from 'next/og'
import { buildUrl } from '@/lib/siteConfig'

/**
 * Shared Open Graph / Twitter card renderers.
 *
 * File-based opengraph-image.tsx / twitter-image.tsx routes import these so
 * every locale and content type shares one branded design instead of falling
 * back to the generic site logo. Pure render helpers — no runtime side effects.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const TWITTER_SIZE = { width: 1200, height: 600 }
export const OG_CONTENT_TYPE = 'image/png'

type OgLocale = 'en' | 'ar' | 'ru'

// NOTE: ImageResponse's default bundled font (Noto Sans) only covers Latin
// glyphs — Arabic/Cyrillic text renders as tofu boxes. Product names are
// stored in English, so all locale cards use English labels until we bundle
// Noto Sans Arabic/Cyrillic subsets and pass them via the `fonts` option.
const FREE_SHIPPING_LABEL: Record<OgLocale, string> = {
  en: 'Free Shipping UAE',
  ar: 'Free Shipping UAE',
  ru: 'Free Shipping UAE',
}

const FOOTER_LABEL: Record<OgLocale, string> = {
  en: 'GENOSYS Middle East | Professional Korean Dermacosmetics',
  ar: 'GENOSYS Middle East | Professional Korean Dermacosmetics',
  ru: 'GENOSYS Middle East | Professional Korean Dermacosmetics',
}

const IN_STOCK_LABEL: Record<OgLocale, string> = {
  en: 'In Stock',
  ar: 'In Stock',
  ru: 'In Stock',
}

const OUT_OF_STOCK_LABEL: Record<OgLocale, string> = {
  en: 'Out of Stock',
  ar: 'Out of Stock',
  ru: 'Out of Stock',
}

interface OgProduct {
  name: string
  price?: number | null
  category?: string | null
  image?: string | null
  inStock?: boolean
}

/** Branded fallback card (missing product, errors). */
export function renderFallbackOgImage(size: { width: number; height: number }) {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a2e',
          color: 'white',
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        GENOSYS Middle East
      </div>
    ),
    { ...size }
  )
}

/** Product share card: image left, name/price/availability right. */
export function renderProductOgImage(
  product: OgProduct,
  opts: { size: { width: number; height: number }; locale?: OgLocale } = { size: OG_SIZE }
) {
  const locale = opts.locale ?? 'en'
  const price = product.price ? `${product.price} AED` : ''
  const category = product.category || ''
  const productImageUrl = product.image ? buildUrl(product.image) : null
  const inStock = product.inStock !== false

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Product image */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '45%',
            height: '100%',
            backgroundColor: '#f8f9fa',
            padding: '40px',
          }}
        >
          {productImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- ImageResponse (satori) only supports raw <img>
            <img
              src={productImageUrl}
              alt={product.name}
              width={400}
              height={400}
              style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 300,
                height: 300,
                backgroundColor: '#e9ecef',
                borderRadius: 16,
                color: '#868e96',
                fontSize: 24,
              }}
            >
              GENOSYS
            </div>
          )}
        </div>

        {/* Product info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '55%',
            height: '100%',
            padding: '48px',
            gap: '16px',
          }}
        >
          {category && (
            <div
              style={{
                display: 'flex',
                fontSize: 16,
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {category}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              fontSize: product.name.length > 60 ? 28 : 36,
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.2,
              maxHeight: '180px',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </div>

          {price && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: '#1a1a2e' }}>{price}</span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: inStock ? '#22c55e' : '#ef4444',
              }}
            />
            <span style={{ fontSize: 18, color: inStock ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
              {inStock ? IN_STOCK_LABEL[locale] : OUT_OF_STOCK_LABEL[locale]}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: 'auto',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: '#6b7280' }}>
              {FOOTER_LABEL[locale]}
            </span>
          </div>
        </div>

        {/* Free shipping badge */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: '#1a1a2e',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {FREE_SHIPPING_LABEL[locale]}
        </div>
      </div>
    ),
    { ...opts.size }
  )
}

/** Editorial title card for guides / articles. */
export function renderTitleOgImage(
  opts: {
    title: string
    subtitle?: string | undefined
    size: { width: number; height: number }
    locale?: OgLocale
  }
) {
  const { title, subtitle } = opts
  const locale = opts.locale ?? 'en'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#1a1a2e',
          padding: '72px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            fontWeight: 600,
            color: '#a5b4fc',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            marginBottom: '24px',
          }}
        >
          GENOSYS
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 70 ? 48 : 60,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            maxHeight: '320px',
            overflow: 'hidden',
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: '#cbd5e1',
              lineHeight: 1.3,
              marginTop: '24px',
              maxHeight: '110px',
              overflow: 'hidden',
            }}
          >
            {subtitle}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 56,
            left: 72,
            fontSize: 18,
            fontWeight: 600,
            color: '#94a3b8',
          }}
        >
          {FOOTER_LABEL[locale]}
        </div>
      </div>
    ),
    { ...opts.size }
  )
}
