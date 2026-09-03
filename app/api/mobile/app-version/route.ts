import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Mobile App Version Check Endpoint
 * GET /api/mobile/app-version?platform=ios|android
 *
 * Two gates, read by the app on every cold start:
 *
 * - `minimumVersion` + `forceUpdate`: the hard gate. Below it the app shows a
 *   blocking screen. Set by hand, below, and with care (see the warning).
 * - `latestVersion`: the soft gate. Below it the app shows a badge and a
 *   dismissible prompt to update from the store. Read live from the stores,
 *   so it cannot go stale the way the hand-kept value did (it said 1.10.0 for
 *   a week after 1.12.0 was live on both stores).
 *
 * No authentication required - this must be reachable even from very old app
 * versions that may not have valid API keys.
 */

const APP_STORE_ID = '6756648064'
const PLAY_PACKAGE = 'ae.genosys.app'

const STORE_URLS = {
  ios: `https://apps.apple.com/ae/app/genosys-uae/id${APP_STORE_ID}`,
  android: `https://play.google.com/store/apps/details?id=${PLAY_PACKAGE}`,
}

const UPDATE_MESSAGE = {
  en: 'A new version of GENOSYS is available with important checkout and payment improvements. Please update to continue.',
  ar: 'يتوفر إصدار جديد من GENOSYS مع تحسينات مهمة في الدفع وإتمام الطلب. يرجى التحديث للمتابعة.',
  ru: 'Доступна новая версия GENOSYS с важными улучшениями оформления заказа и оплаты. Пожалуйста, обновите приложение.',
}

/**
 * Per-platform hard gates.
 *
 * CRITICAL: `minimumVersion` must NEVER exceed the newest build that is
 * actually live on that platform's store. If it does, users get hard-locked
 * out - the force-update screen opens the store, but there is nothing newer
 * to install, so the "Update" button does nothing and the user can never
 * get back into the app.
 *
 * `fallbackLatest` is used only when the store lookup fails; keep it at the
 * version you know is live.
 */
const PLATFORM_CONFIG = {
  ios: { minimumVersion: '1.10.0', forceUpdate: true, fallbackLatest: '1.12.0' },
  android: { minimumVersion: '1.9.0', forceUpdate: false, fallbackLatest: '1.12.0' },
}

type Platform = keyof typeof PLATFORM_CONFIG

const SEMVER = /^\d+\.\d+(\.\d+)?$/
const LOOKUP_TTL_MS = 60 * 60 * 1000

// Per-instance memo. Serverless instances are short-lived, and the response
// itself is cached at the edge for five minutes, so this is a courtesy to the
// stores more than a performance need.
const memo: Partial<Record<Platform, { version: string; at: number }>> = {}

async function fetchStoreVersion(platform: Platform): Promise<string | null> {
  const cached = memo[platform]
  if (cached && Date.now() - cached.at < LOOKUP_TTL_MS) return cached.version

  try {
    let version: string | null = null
    if (platform === 'ios') {
      const res = await fetch(`https://itunes.apple.com/lookup?id=${APP_STORE_ID}&country=ae`, {
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 },
      })
      const json = (await res.json()) as { results?: Array<{ version?: string }> }
      version = json.results?.[0]?.version ?? null
    } else {
      // Play has no public API. The listing embeds the current version as a
      // nested array literal; this is the same string a browser renders under
      // "About this app". If the markup changes we fall back, we do not break.
      const res = await fetch(`https://play.google.com/store/apps/details?id=${PLAY_PACKAGE}&hl=en`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 3600 },
      })
      const html = await res.text()
      const match = html.match(/\[\[\["(\d+\.\d+(?:\.\d+)?)"\]\]/)
      version = match?.[1] ?? null
    }
    if (version && SEMVER.test(version)) {
      memo[platform] = { version, at: Date.now() }
      return version
    }
  } catch {
    // fall through to the fallback
  }
  return null
}

export async function GET(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get('platform')
  const platform: Platform = requested === 'android' ? 'android' : 'ios'

  const { minimumVersion, forceUpdate, fallbackLatest } = PLATFORM_CONFIG[platform]
  const live = await fetchStoreVersion(platform)
  const latestVersion = live ?? fallbackLatest

  return NextResponse.json(
    {
      minimumVersion,
      forceUpdate,
      latestVersion,
      latestSource: live ? 'store' : 'fallback',
      message: UPDATE_MESSAGE,
      updateUrl: STORE_URLS[platform],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    },
  )
}
