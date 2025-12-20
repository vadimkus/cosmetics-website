import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

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
  try {
    const locale = request.nextUrl.searchParams.get('locale') || 'en'
    const promo = await prisma.promotion.findFirst({
      where: { isActive: true },
      orderBy: { date: 'desc' },
    })

    if (!promo) {
      return NextResponse.json({ success: true, data: null }, {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: promo.id,
        date: promo.date,
        text: pickLocalizedText(promo, locale),
      },
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    })
  } catch (error: unknown) {
    errorLog('[PROMO_PUBLIC] GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch promotion' }, { status: 500 })
  }
}


