/**
 * Custom CDN loader for Next.js Image component
 * Supports multiple CDN providers with optimization parameters
 */

export default function cdnLoader({ src, width, quality }) {
  const cdnUrl = process.env.CDN_URL || process.env.NEXT_PUBLIC_CDN_URL
  
  if (!cdnUrl) {
    // Fallback to default Next.js image optimization
    return src
  }

  // Parse the CDN URL
  const cdnBase = cdnUrl.replace(/\/$/, '') // Remove trailing slash
  const imagePath = src.startsWith('/') ? src : `/${src}`

  // CDN Provider Detection and Configuration
  const cdnHostname = new URL(cdnUrl).hostname

  // Cloudflare Image Resizing
  if (cdnHostname.includes('cloudflare') || process.env.CDN_PROVIDER === 'cloudflare') {
    return `${cdnBase}${imagePath}?width=${width}&quality=${quality || 75}&format=auto`
  }

  // AWS CloudFront with Image Optimization
  if (cdnHostname.includes('cloudfront') || process.env.CDN_PROVIDER === 'cloudfront') {
    return `${cdnBase}${imagePath}?w=${width}&q=${quality || 75}&f=webp`
  }

  // Vercel Image Optimization
  if (cdnHostname.includes('vercel') || process.env.CDN_PROVIDER === 'vercel') {
    return `${cdnBase}${imagePath}?w=${width}&q=${quality || 75}`
  }

  // Generic CDN with basic parameters
  return `${cdnBase}${imagePath}?w=${width}&q=${quality || 75}&f=webp`
}
