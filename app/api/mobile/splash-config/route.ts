import { NextResponse } from 'next/server'

/**
 * GET /api/mobile/splash-config
 *
 * Returns the current splash screen configuration for the native app.
 * Change the values below to swap the video/image without rebuilding the app.
 *
 * Fields:
 *   type        - "video" | "image"  (image = static branded screen, no download)
 *   videoUrl    - absolute URL to an mp4 (only used when type = "video")
 *   posterUrl   - optional still image shown while video buffers
 *   duration    - max playback time in ms (video auto-advances on finish or on timeout)
 *   cacheTTL    - how long (seconds) the client should cache the video file locally
 *   enabled     - master kill-switch; false = skip video entirely
 */

const SPLASH_CONFIG = {
  enabled: true,
  type: 'video' as const,
  videoUrl: 'https://genosys.ae/videos/Splash-v2.mp4',
  posterUrl: null as string | null,
  duration: 5000,
  cacheTTL: 86400,
}

export async function GET() {
  return NextResponse.json(SPLASH_CONFIG, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
