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
 * No authentication required — this must be reachable even from
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

const VERSION_CONFIG = {
  minimumVersion: '1.10.0',
  latestVersion: '1.10.0',
  forceUpdate: true,
  message: {
    en: 'A new version of Genosys UAE is available with important checkout and payment improvements. Please update to continue.',
    ar: 'يتوفر إصدار جديد من Genosys UAE مع تحسينات مهمة في الدفع وإتمام الطلب. يرجى التحديث للمتابعة.',
    ru: 'Доступна новая версия Genosys UAE с важными улучшениями оформления заказа и оплаты. Пожалуйста, обновите приложение.',
  },
}

export async function GET(request: NextRequest) {
  const platform = request.nextUrl.searchParams.get('platform') as 'ios' | 'android' | null
  const updateUrl = STORE_URLS[platform ?? 'ios'] ?? STORE_URLS.ios

  return NextResponse.json(
    { ...VERSION_CONFIG, updateUrl },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    },
  )
}
