import { NextResponse } from 'next/server'

/**
 * Mobile App Version Check Endpoint
 * GET /api/mobile/app-version
 *
 * Returns the minimum required app version and latest version info.
 * The mobile app calls this on every cold start to decide whether
 * to show a "Force Update" screen.
 *
 * No authentication required — this must be reachable even from
 * very old app versions that may not have valid API keys.
 *
 * To force users to update after a new App Store release:
 *   1. Submit the new build to App Store
 *   2. Once approved and live, bump `minimumVersion` below
 *   3. All users on older versions will see the update screen
 */

const APP_STORE_URL = 'https://apps.apple.com/ae/app/genosys-uae/id6756648064'

const VERSION_CONFIG = {
  // Bump this to force users off older versions
  minimumVersion: '1.5.0',

  // Informational — the latest version available on the store
  latestVersion: '1.5.0',

  // true = blocking screen, false = dismissible suggestion (future use)
  forceUpdate: false,

  // Where to send the user to update
  updateUrl: APP_STORE_URL,

  // Shown to the user on the update screen
  message: {
    en: 'A new version of Genosys UAE is available with important improvements. Please update to continue.',
    ar: 'يتوفر إصدار جديد من Genosys UAE مع تحسينات مهمة. يرجى التحديث للمتابعة.',
    ru: 'Доступна новая версия Genosys UAE с важными улучшениями. Пожалуйста, обновите приложение.',
  },
}

export async function GET() {
  return NextResponse.json(VERSION_CONFIG, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
