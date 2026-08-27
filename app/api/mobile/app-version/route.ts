import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Mobile App Version Check Endpoint
 * GET /api/mobile/app-version?platform=ios|android
 *
 * Returns the minimum required app version and latest version info.
 * The mobile app calls this on every cold start to decide whether
 * to show a "Force Update" screen.
 *
 * No authentication required - this must be reachable even from
 * very old app versions that may not have valid API keys.
 *
 * To force users to update after a new release:
 *   1. Submit the new build to App Store / Google Play
 *   2. Once approved and live, bump `minimumVersion` below
 *   3. All users on older versions will see the update screen
 */

const STORE_URLS = {
  ios: 'https://apps.apple.com/ae/app/genosys-uae/id6756648064',
  android: 'https://play.google.com/store/apps/details?id=ae.genosys.app',
}

const UPDATE_MESSAGE = {
  en: 'A new version of Genosys UAE is available with important checkout and payment improvements. Please update to continue.',
  ar: 'يتوفر إصدار جديد من Genosys UAE مع تحسينات مهمة في الدفع وإتمام الطلب. يرجى التحديث للمتابعة.',
  ru: 'Доступна новая версия Genosys UAE с важными улучшениями оформления заказа и оплаты. Пожалуйста, обновите приложение.',
}

/**
 * Per-platform version gates.
 *
 * CRITICAL: `minimumVersion` must NEVER exceed the newest build that is
 * actually live on that platform's store. If it does, users get hard-locked
 * out - the force-update screen opens the store, but there is nothing newer
 * to install, so the "Update" button does nothing and the user can never
 * get back into the app.
 *
 * iOS:     latest live App Store build is 1.10.x → safe to force 1.10.0.
 * Android: latest live Google Play build is 1.9.0 (versionCode 81, Apr 2026).
 *          No 1.10.x Android binary has been submitted to Google Play yet,
 *          so we MUST NOT force 1.10.0 on Android. Server-side checkout/pricing
 *          guards already protect 1.9.0 clients, so a soft (non-blocking)
 *          update prompt is sufficient until a 1.10.x AAB ships to Play.
 */
const PLATFORM_CONFIG = {
  ios: {
    minimumVersion: '1.10.0',
    latestVersion: '1.10.0',
    forceUpdate: true,
  },
  android: {
    minimumVersion: '1.9.0',
    latestVersion: '1.9.0',
    forceUpdate: false,
  },
}

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get('platform')
  const platform: 'ios' | 'android' = requested === 'android' ? 'android' : 'ios'

  const config = PLATFORM_CONFIG[platform]
  const updateUrl = STORE_URLS[platform]

  return NextResponse.json(
    { ...config, message: UPDATE_MESSAGE, updateUrl },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    },
  )
}
