import { getProductByIdCached } from '@/lib/productsDb'
import { renderProductOgImage, renderFallbackOgImage, TWITTER_SIZE, OG_CONTENT_TYPE } from '@/lib/ogImages'

export const alt = 'GENOSYS Product'
export const size = TWITTER_SIZE
export const contentType = OG_CONTENT_TYPE

// ISR: CDN-cache the rendered card (see opengraph-image.tsx for rationale)
export const revalidate = 3600

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductByIdCached(id)
  if (!product) return renderFallbackOgImage(size)
  return renderProductOgImage(product, { size, locale: 'en' })
}
