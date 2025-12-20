import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function pickLocalizedText(promo: any, locale: string): string {
  const l = String(locale || 'en').toLowerCase()
  const en = String(promo?.textEn || '').trim()
  const ru = String(promo?.textRu || '').trim()
  const ar = String(promo?.textAr || '').trim()
  if (l.startsWith('ar')) return ar || en
  if (l.startsWith('ru')) return ru || en
  return en
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  try {
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.MOBILE_APP_KEY
    if (!expectedKey) {
      errorLog('[MOBILE_PROMO] MOBILE_APP_KEY not configured')
      return NextResponse.json({ success: false, error: 'API service unavailable' }, { status: 503 })
    }
    if (!apiKey || apiKey !== expectedKey) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Invalid or missing API key' }, { status: 401 })
    }

    const locale = request.nextUrl.searchParams.get('locale') || 'en'
    const promo = await prisma.promotion.findFirst({
      where: { isActive: true },
      orderBy: { date: 'desc' },
    })

    const duration = Date.now() - startTime
    debugLog('[MOBILE_PROMO] GET completed', { hasPromo: !!promo, duration: `${duration}ms` })

    if (!promo) {
      return NextResponse.json({ success: true, data: null })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: promo.id,
        date: promo.date,
        text: pickLocalizedText(promo, locale),
      },
    })
  } catch (error: unknown) {
    errorLog('[MOBILE_PROMO] GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch promotion' }, { status: 500 })
  }
}


