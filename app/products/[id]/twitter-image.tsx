import { ImageResponse } from 'next/og'
import { getProductByIdCached } from '@/lib/productsDb'
import { buildUrl } from '@/lib/siteConfig'

// Twitter card image metadata
export const alt = 'GENOSYS Product'
export const size = {
  width: 1200,
  height: 600,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductByIdCached(id)

  if (!product) {
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

  const price = product.price ? `${product.price} AED` : ''
  const category = product.category || ''
  const productImageUrl = product.image
    ? buildUrl(product.image)
    : null

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
        {/* Left side - Product Image */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40%',
            height: '100%',
            backgroundColor: '#f8f9fa',
            padding: '32px',
          }}
        >
          {productImageUrl ? (
            <img
              src={productImageUrl}
              alt={product.name}
              width={360}
              height={360}
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 250,
                height: 250,
                backgroundColor: '#e9ecef',
                borderRadius: 16,
                color: '#868e96',
                fontSize: 22,
              }}
            >
              GENOSYS
            </div>
          )}
        </div>

        {/* Right side - Product Info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '60%',
            height: '100%',
            padding: '40px',
            gap: '12px',
          }}
        >
          {category && (
            <div
              style={{
                display: 'flex',
                fontSize: 15,
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
              fontSize: product.name.length > 60 ? 26 : 32,
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.2,
              maxHeight: '160px',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </div>

          {price && (
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                marginTop: '4px',
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 800, color: '#1a1a2e' }}>
                {price}
              </span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: 'auto',
              paddingTop: '12px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: '#6b7280' }}>
              genosys.ae | Professional Korean Dermacosmetics UAE
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: '#1a1a2e',
            color: 'white',
            padding: '6px 14px',
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Free Shipping UAE
        </div>
      </div>
    ),
    { ...size }
  )
}
