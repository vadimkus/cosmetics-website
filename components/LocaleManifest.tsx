'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * LocaleManifest Component
 * 
 * Dynamically updates the manifest link based on the current locale.
 * This ensures PWA installation uses the correct localized manifest.
 * 
 * Manifests:
 * - /manifest.json (English - default)
 * - /ar/manifest.json (Arabic - RTL)
 * - /ru/manifest.json (Russian)
 */
export default function LocaleManifest() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Determine locale from pathname
    let manifestPath = '/manifest.json'
    
    if (pathname.startsWith('/ar')) {
      manifestPath = '/ar/manifest.json'
    } else if (pathname.startsWith('/ru')) {
      manifestPath = '/ru/manifest.json'
    }
    
    // Find or create the manifest link
    let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement
    
    if (manifestLink) {
      // Update existing manifest link if different
      if (manifestLink.href !== window.location.origin + manifestPath) {
        manifestLink.href = manifestPath
      }
    } else {
      // Create manifest link if it doesn't exist
      manifestLink = document.createElement('link')
      manifestLink.rel = 'manifest'
      manifestLink.href = manifestPath
      document.head.appendChild(manifestLink)
    }
  }, [pathname])
  
  // This component doesn't render anything visible
  return null
}


