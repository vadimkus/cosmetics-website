/**
 * CDN Configuration and Utilities
 * Handles static asset URLs and CDN optimization
 */

export interface CDNConfig {
  baseUrl: string
  provider: 'cloudflare' | 'cloudfront' | 'vercel' | 'custom'
  enableImageOptimization: boolean
  enableWebP: boolean
  enableAVIF: boolean
}

export function getCDNConfig(): CDNConfig {
  const cdnUrl = process.env.CDN_URL || process.env.NEXT_PUBLIC_CDN_URL || ''
  const provider = (process.env.CDN_PROVIDER as CDNConfig['provider']) || 'custom'
  
  return {
    baseUrl: cdnUrl,
    provider,
    enableImageOptimization: true,
    enableWebP: true,
    enableAVIF: true,
  }
}

export function getCDNAssetUrl(path: string): string {
  const config = getCDNConfig()
  
  if (!config.baseUrl) {
    return path
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${config.baseUrl.replace(/\/$/, '')}${cleanPath}`
}

export function getCDNImageUrl(
  path: string, 
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'auto'
  } = {}
): string {
  const config = getCDNConfig()
  
  if (!config.baseUrl) {
    return path
  }

  const { width, height, quality = 75, format = 'auto' } = options
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  if (quality) params.set('q', quality.toString())
  if (format && format !== 'auto') params.set('f', format)
  
  const queryString = params.toString()
  const baseUrl = `${config.baseUrl.replace(/\/$/, '')}${cleanPath}`
  
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

export function getCDNVideoUrl(path: string): string {
  return getCDNAssetUrl(path)
}

export function getCDNDocumentUrl(path: string): string {
  return getCDNAssetUrl(path)
}

// Preload critical assets
export function preloadCDNAssets(assets: string[]): void {
  if (typeof window === 'undefined') return

  assets.forEach(asset => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = getCDNAssetUrl(asset)
    
    // Determine as attribute based on file extension
    const extension = asset.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'css':
        link.as = 'style'
        break
      case 'js':
        link.as = 'script'
        break
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'otf':
        link.as = 'font'
        link.crossOrigin = 'anonymous'
        break
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'webp':
      case 'avif':
        link.as = 'image'
        break
      case 'mp4':
      case 'webm':
        link.as = 'video'
        break
      default:
        link.as = 'fetch'
    }
    
    document.head.appendChild(link)
  })
}
