import { NextResponse, type NextRequest } from 'next/server'
import { getProductByIdCached } from '@/lib/productsDb'
import { renderProductLinkPreview } from '@/lib/linkPreview'
import type { Locale } from '@/i18n'

// Meta-only HTML for link-preview crawlers. proxy.ts rewrites
// /products/:id (and /ar, /ru) here when the User-Agent is a preview bot.
// The real product page renders dynamically (root layout reads headers()),
// so it is 460 KB and 1-4 s; WhatsApp's fetcher gives up before that and
// shows a bare "genosys.ae" card. This shell is ~2 KB and CDN-cached.

const LOCALES = new Set<Locale>(['en', 'ar', 'ru'])

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const rawLocale = request.nextUrl.searchParams.get('locale') ?? 'en'
  const locale = (LOCALES.has(rawLocale as Locale) ? rawLocale : 'en') as Locale

  const product = await getProductByIdCached(id)
  if (!product) return new NextResponse('Not found', { status: 404 })

  const html = renderProductLinkPreview(product, locale, 'https://genosys.ae')
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Cache at the CDN for an hour; a product edit propagates within that.
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
    },
  })
}
