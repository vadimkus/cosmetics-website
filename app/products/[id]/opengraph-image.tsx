import { getProductByIdCached } from '@/lib/productsDb'
import { renderProductOgImage, renderFallbackOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/ogImages'

export const alt = 'GENOSYS Product'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// ISR: cache the rendered PNG at the CDN. Without this the card re-renders
// on every request (1-4s: DB + photo fetch + satori) and WhatsApp's short
// preview timeout intermittently drops the image. Deploys bust the URL hash.
export const revalidate = 3600

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductByIdCached(id)
  if (!product) return renderFallbackOgImage(size)
  return renderProductOgImage(product, { size, locale: 'en' })
}
