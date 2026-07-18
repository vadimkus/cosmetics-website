/**
 * Rewrites local <img> tags inside blog post HTML so they are served through
 * the Next.js image optimizer (resized + AVIF/WebP) instead of the raw,
 * multi-megabyte originals in /public.
 *
 * Run this AFTER sanitizeHtml() — the sanitizer strips srcset/sizes/decoding
 * attributes, so the transform must be the last step before rendering.
 */

// Must stay in sync with images.deviceSizes in next.config.js
const SRCSET_WIDTHS = [640, 1080, 1920]
const DEFAULT_WIDTH = 1080
const QUALITY = 75

// Only rewrite paths covered by images.localPatterns in next.config.js
const OPTIMIZABLE_PREFIXES = ['/blog/', '/images/']

function optimizerUrl(src: string, width: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${QUALITY}`
}

/**
 * Removes only a leading duplicate of the featured image from CMS HTML.
 * Later uses of the same image are intentional content and must remain.
 */
export function stripOpeningFeaturedImage(
  html: string,
  featuredImage: string | null | undefined
): string {
  if (!featuredImage) return html

  const escapedPath = featuredImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const candidates = [
    new RegExp(
      `<div[^>]*>\\s*<img[^>]*src=["']${escapedPath}["'][^>]*>\\s*</div>`,
      'i'
    ),
    new RegExp(`<img[^>]*src=["']${escapedPath}["'][^>]*>`, 'i'),
  ]

  const match = candidates
    .map((pattern) => {
      const result = pattern.exec(html)
      return result ? { index: result.index, value: result[0] } : null
    })
    .filter((result): result is { index: number; value: string } => result !== null)
    .sort((a, b) => a.index - b.index)[0]

  if (!match) return html

  const textBeforeImage = html
    .slice(0, match.index)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim()

  if (textBeforeImage) return html

  return html.slice(0, match.index) + html.slice(match.index + match.value.length)
}

export function optimizeBlogContentImages(html: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (tag, attrs: string) => {
    const srcMatch = attrs.match(/\ssrc\s*=\s*("([^"]+)"|'([^']+)')/i)
    const src = srcMatch?.[2] || srcMatch?.[3]
    if (!srcMatch || !src) return tag
    if (!OPTIMIZABLE_PREFIXES.some((p) => src.startsWith(p))) return tag
    // Skip anything already optimized and formats the optimizer can't resize
    if (src.startsWith('/_next/') || /\.(svg|gif)(\?|$)/i.test(src)) return tag

    const srcset = SRCSET_WIDTHS.map((w) => `${optimizerUrl(src, w)} ${w}w`).join(', ')

    let newAttrs = attrs.replace(srcMatch[0], ` src="${optimizerUrl(src, DEFAULT_WIDTH)}"`)
    if (!/\sloading\s*=/i.test(newAttrs)) newAttrs += ' loading="lazy"'
    newAttrs += ` srcset="${srcset}" sizes="(max-width: 768px) 100vw, 896px" decoding="async"`

    return `<img${newAttrs}>`
  })
}
