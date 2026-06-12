import { SEO_LANDING_PAGES, getSeoLandingPage } from '@/lib/seoLandingPages'
import { renderTitleOgImage, renderFallbackOgImage, TWITTER_SIZE, OG_CONTENT_TYPE } from '@/lib/ogImages'

export const alt = 'GENOSYS Guide'
export const size = TWITTER_SIZE
export const contentType = OG_CONTENT_TYPE

export const dynamicParams = false
export function generateStaticParams() {
  return SEO_LANDING_PAGES.map(page => ({ slug: page.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getSeoLandingPage(slug)
  if (!page) return renderFallbackOgImage(size)
  return renderTitleOgImage({ title: page.h1, subtitle: page.eyebrow, size, locale: 'en' })
}
