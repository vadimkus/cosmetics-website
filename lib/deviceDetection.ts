// Device and browser detection utility

export interface DeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop'
  browser: string
  os: string
  screenWidth?: number
  screenHeight?: number
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
  
  return {
    deviceType,
    browser,
    os
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
