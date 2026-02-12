import { ImageResponse } from 'next/og'
import { getProductById } from '@/lib/productsDb'

// Image metadata
export const alt = 'GENOSYS Product'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    // Fallback OG image for missing products
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
    ? `https://genosys.ae${product.image}`
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
            width: '45%',
            height: '100%',
            backgroundColor: '#f8f9fa',
            padding: '40px',
          }}
        >
          {productImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={productImageUrl}
              alt={product.name}
              width={400}
              height={400}
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

        {/* Right side - Product Info */}
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
          {/* Category badge */}
          {category && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
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

          {/* Product name */}
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

          {/* Price */}
          {price && (
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: '#1a1a2e',
                }}
              >
                {price}
              </span>
            </div>
          )}

          {/* Availability */}
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
                backgroundColor: product.inStock ? '#22c55e' : '#ef4444',
              }}
            />
            <span
              style={{
                fontSize: 18,
                color: product.inStock ? '#16a34a' : '#dc2626',
                fontWeight: 500,
              }}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Brand footer */}
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
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#6b7280',
              }}
            >
              GENOSYS Middle East | Professional Korean Dermacosmetics
            </span>
          </div>
        </div>

        {/* Top right badge - Free shipping */}
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
          Free Shipping UAE
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
