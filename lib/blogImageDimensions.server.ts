import 'server-only'

import { cache } from 'react'

export type BlogImageDimensions = {
  width: number
  height: number
}

const FALLBACK: BlogImageDimensions = { width: 1522, height: 922 }

/**
 * Build-time audited dimensions for published blog heroes.
 *
 * Do not import `sharp` from a route dependency: Vercel traces its native
 * binaries into every localized blog function, pushing each function far over
 * the 250 MB uncompressed limit. `scripts/audit-blog-images.ts` is the
 * maintenance tool for verifying these source files and dimensions.
 */
const BLOG_IMAGE_DIMENSIONS: Readonly<Record<string, BlogImageDimensions>> = {
  '/images/overnight/main.jpeg': { width: 1024, height: 1024 },
  '/images/overnight/main-v2.jpeg': { width: 1254, height: 1254 },
  '/images/revita/main.jpg': { width: 1024, height: 1024 },
  '/images/cera/cera.jpeg': { width: 1220, height: 1252 },
  '/images/6000/S1.jpeg': { width: 1200, height: 896 },
  '/images/6000/main.jpg': { width: 1024, height: 1024 },
  '/blog/summer-splash.jpg': { width: 1800, height: 1200 },
  '/blog/post_android/google-play-listing.png': { width: 1328, height: 1783 },
  '/blog/bb.jpeg': { width: 768, height: 1376 },
  '/blog/post_app/app2.png': { width: 1014, height: 464 },
  '/blog/bb.png': { width: 2430, height: 938 },
  '/images/pwa/pwa-device-selection.png': { width: 864, height: 1774 },
  '/images/ios.png': { width: 1486, height: 788 },
  '/images/stripe.png': { width: 1026, height: 566 },
  '/images/genosys-products.jpg': { width: 1516, height: 720 },
  '/blog/biomeso3.png': { width: 476, height: 434 },
  '/blog/bioo.jpeg': { width: 1280, height: 854 },
  '/blog/biof3.jpeg': { width: 1280, height: 1600 },
  '/blog/pd.jpg': { width: 1800, height: 2511 },
}

/**
 * Returns audited dimensions without pulling native image tooling into the
 * serverless route bundle. Unknown/future paths retain a safe landscape
 * fallback until the audit manifest is refreshed.
 */
export const getBlogImageDimensions = cache(
  async (src: string | null): Promise<BlogImageDimensions> => {
    if (!src?.startsWith('/') || src.startsWith('/_next/')) return FALLBACK

    const cleanSrc = src.split('?')[0] || src
    return BLOG_IMAGE_DIMENSIONS[cleanSrc] || FALLBACK
  }
)
