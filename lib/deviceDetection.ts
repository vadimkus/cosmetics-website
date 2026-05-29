// Device and browser detection utility

export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop'
  browser: string
  os: string
  deviceModel?: string
  screenWidth?: number
  screenHeight?: number
}

// Extract device model from user agent
export function extractDeviceModel(userAgent: string): string | undefined {
  const ua = userAgent
  
  // iPhone models
  if (/iPhone/.test(ua)) {
    const match = ua.match(/iPhone\s?(\d+,\d+|\w+)/)
    if (match) return `iPhone ${match[1]}`
    return 'iPhone'
  }
  
  // iPad models
  if (/iPad/.test(ua)) {
    const match = ua.match(/iPad\s?(\d+,\d+|\w+)/)
    if (match) return `iPad ${match[1]}`
    return 'iPad'
  }
  
  // Samsung devices
  if (/SM-/.test(ua)) {
    const match = ua.match(/SM-([A-Z0-9]+)/)
    if (match) return `Samsung ${match[1]}`
  }
  
  // Google Pixel
  if (/Pixel/.test(ua)) {
    const match = ua.match(/Pixel\s?(\d+\s?\w*)/)
    if (match) return `Google Pixel ${match[1]}`
    return 'Google Pixel'
  }
  
  // Huawei
  if (/Huawei|HUAWEI/.test(ua)) {
    const match = ua.match(/(?:Huawei|HUAWEI)\s?([A-Z0-9-]+)/)
    if (match) return `Huawei ${match[1]}`
    return 'Huawei'
  }
  
  // Xiaomi
  if (/Mi\s|Redmi/.test(ua)) {
    const match = ua.match(/(Mi|Redmi)\s?([A-Z0-9\s]+)/)
    if (match) return `Xiaomi ${match[1]} ${match[2]}`
  }
  
  // OnePlus
  if (/OnePlus/.test(ua)) {
    const match = ua.match(/OnePlus\s?([A-Z0-9]+)/)
    if (match) return `OnePlus ${match[1]}`
    return 'OnePlus'
  }
  
  // Generic Android
  if (/Android/.test(ua)) {
    const match = ua.match(/;\s?([^;)]+)\s?Build/)
    if (match?.[1]) return match[1].trim()
  }
  
  return undefined
}

// Parse user agent to detect device type, browser, and OS
export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase()
  
  // Detect device type
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
  
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = 'mobile'
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'tablet'
  }
  
  // Detect browser
  let browser = 'Unknown'
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browser = 'Chrome'
  } else if (ua.includes('firefox')) {
    browser = 'Firefox'
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari'
  } else if (ua.includes('edg')) {
    browser = 'Edge'
  } else if (ua.includes('opera') || ua.includes('opr')) {
    browser = 'Opera'
  } else if (ua.includes('msie') || ua.includes('trident')) {
    browser = 'Internet Explorer'
  }
  
  // Detect OS
  let os = 'Unknown'
  if (ua.includes('windows')) {
    os = 'Windows'
  } else if (ua.includes('mac os x') || ua.includes('macos')) {
    os = 'macOS'
  } else if (ua.includes('linux')) {
    os = 'Linux'
  } else if (ua.includes('android')) {
    os = 'Android'
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS'
  }
  
  // Extract device model
  const deviceModel = extractDeviceModel(userAgent)
  
  return {
    deviceType,
    browser,
    os,
    ...(deviceModel ? { deviceModel } : {})
  }
}

// Minimal header accessor (works with Next.js Headers and plain objects)
interface HeaderReader {
  get(name: string): string | null
}

/**
 * Resolve device info for a request, preferring explicit device headers sent by
 * the native mobile app over user-agent sniffing.
 *
 * The native app's HTTP client sends a CFNetwork/okhttp user-agent that does NOT
 * contain "mobile"/"iphone"/"android", so parseUserAgent() would wrongly fall back
 * to "desktop". The mobile app now sends x-device-* headers; this function trusts
 * them, and as a final safety net applies `fallbackDeviceType` (e.g. "mobile" for
 * /api/mobile/* endpoints, which are only ever called by the app).
 */
export function resolveDeviceInfo(
  headers: HeaderReader,
  options: { fallbackDeviceType?: 'mobile' | 'tablet' | 'desktop' } = {}
): DeviceInfo {
  const userAgent = headers.get('user-agent') || 'Unknown'
  const parsed = parseUserAgent(userAgent)

  const clientPlatform = headers.get('x-app-platform')?.trim().toLowerCase()
  const clientType = headers.get('x-device-type')?.trim().toLowerCase()
  const clientOs = headers.get('x-device-os')?.trim() || undefined
  const clientOsVersion = headers.get('x-device-os-version')?.trim() || undefined
  const clientModel = headers.get('x-device-model')?.trim() || undefined

  const isNativeApp = clientPlatform === 'ios' || clientPlatform === 'android'

  // Device type: explicit client value wins; otherwise UA parse; otherwise fallback
  let deviceType = parsed.deviceType
  if (clientType === 'mobile' || clientType === 'tablet' || clientType === 'desktop') {
    deviceType = clientType
  } else if (options.fallbackDeviceType && deviceType === 'desktop') {
    deviceType = options.fallbackDeviceType
  }

  // OS: combine client OS + version when provided
  const os = clientOs
    ? (clientOsVersion ? `${clientOs} ${clientOsVersion}` : clientOs)
    : parsed.os

  const deviceModel = clientModel || parsed.deviceModel

  // Native app requests have no browser; avoid showing a misleading value
  const browser = isNativeApp ? 'Mobile App' : parsed.browser

  return {
    deviceType,
    browser,
    os,
    ...(deviceModel ? { deviceModel } : {}),
  }
}

// Generate a simple session ID
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Check if user agent indicates accessibility tools
export function detectAccessibilityTools(userAgent: string): string[] {
  const ua = userAgent.toLowerCase()
  const tools: string[] = []
  
  if (ua.includes('screen reader') || ua.includes('nvda') || ua.includes('jaws')) {
    tools.push('Screen Reader')
  }
  if (ua.includes('voiceover') || ua.includes('talkback')) {
    tools.push('Voice Assistant')
  }
  if (ua.includes('high contrast') || ua.includes('inverted')) {
    tools.push('High Contrast')
  }
  if (ua.includes('zoom') || ua.includes('magnifier')) {
    tools.push('Zoom/Magnifier')
  }
  
  return tools
}
