import 'server-only'

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { cache } from 'react'
import sharp from 'sharp'

export type BlogImageDimensions = {
  width: number
  height: number
}

const FALLBACK: BlogImageDimensions = { width: 1522, height: 922 }

/**
 * Reads a local blog image's real dimensions so hero layout never relies on a
 * hardcoded landscape ratio. Cached per request/render by React.
 */
export const getBlogImageDimensions = cache(
  async (src: string | null): Promise<BlogImageDimensions> => {
    if (!src?.startsWith('/') || src.startsWith('/_next/')) return FALLBACK

    const cleanSrc = src.split('?')[0] || src
    const path = join(process.cwd(), 'public', cleanSrc)
    if (!existsSync(path)) return FALLBACK

    try {
      const metadata = await sharp(path).metadata()
      if (metadata.width && metadata.height) {
        return { width: metadata.width, height: metadata.height }
      }
    } catch {
      // The audit script reports unreadable images; rendering keeps a safe fallback.
    }

    return FALLBACK
  }
)
