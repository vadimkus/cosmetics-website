import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'
import {
  normalizeEmail,
  normalizeLocale,
  normalizeSource,
  isValidEmail,
  generateUnsubscribeToken,
} from '@/lib/newsletter'

type FilterQuery = {
  locale?: 'en' | 'ar' | 'ru'
  isActive?: boolean
  source?: string
  search?: string
}

function parseFilters(url: URL): { filters: FilterQuery; limit: number; offset: number } {
  const qLocale = url.searchParams.get('locale')
  const qActive = url.searchParams.get('isActive')
  const qSource = url.searchParams.get('source')
  const qSearch = url.searchParams.get('search')?.trim() || undefined
  const limit = Math.min(500, Math.max(1, parseInt(url.searchParams.get('limit') || '100', 10) || 100))
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') || '0', 10) || 0)

  const filters: FilterQuery = {}
  if (qLocale === 'en' || qLocale === 'ar' || qLocale === 'ru') filters.locale = qLocale
  if (qActive === 'true') filters.isActive = true
  if (qActive === 'false') filters.isActive = false
  if (qSource) filters.source = qSource
  if (qSearch) filters.search = qSearch

  return { filters, limit, offset }
}

/**
 * GET /api/admin/newsletter/subscribers
 * Query params: locale, isActive (true|false), source, search, limit, offset
 *
 * Returns paginated list + aggregate stats.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    const url = new URL(request.url)
    const { filters, limit, offset } = parseFilters(url)

    const where: Record<string, unknown> = {}
    if (filters.locale) where.locale = filters.locale
    if (filters.isActive !== undefined) where.isActive = filters.isActive
    if (filters.source) where.source = filters.source
    if (filters.search) {
      // email contains - Prisma supports `contains` with mode: insensitive on Postgres
      where.email = { contains: filters.search.toLowerCase(), mode: 'insensitive' }
    }

    const [rows, total, stats] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          email: true,
          locale: true,
          source: true,
          isActive: true,
          userId: true,
          subscribedAt: true,
          unsubscribedAt: true,
          lastSentAt: true,
          createdAt: true,
        },
      }),
      prisma.newsletterSubscriber.count({ where }),
      prisma.newsletterSubscriber.groupBy({
        by: ['locale', 'isActive'],
        _count: { _all: true },
      }),
    ])

    // Flatten stats into { totalActive, totalInactive, byLocale: { en: {active, inactive}, ... } }
    const byLocale: Record<string, { active: number; inactive: number }> = {
      en: { active: 0, inactive: 0 },
      ar: { active: 0, inactive: 0 },
      ru: { active: 0, inactive: 0 },
    }
    let totalActive = 0
    let totalInactive = 0
    for (const s of stats) {
      const bucket = byLocale[s.locale] || (byLocale[s.locale] = { active: 0, inactive: 0 })
      if (s.isActive) {
        bucket.active += s._count._all
        totalActive += s._count._all
      } else {
        bucket.inactive += s._count._all
        totalInactive += s._count._all
      }
    }

    return NextResponse.json({
      success: true,
      rows,
      total,
      stats: { totalActive, totalInactive, byLocale },
    })
  } catch (err) {
    errorLog('[admin/newsletter/subscribers GET] error:', err)
    return NextResponse.json({ success: false, error: 'Failed to load subscribers' }, { status: 500 })
  }
}

/**
 * POST /api/admin/newsletter/subscribers
 * Body: { email, locale?, source? } - admin manually adds a subscriber.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string
      locale?: string
      source?: string
    }

    const email = normalizeEmail(body.email || '')
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
    }

    const locale = normalizeLocale(body.locale)
    const source = normalizeSource(body.source || 'admin')

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })
    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ success: true, alreadySubscribed: true, subscriber: existing })
      }
      // Reactivate with fresh token
      const updated = await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          isActive: true,
          unsubscribedAt: null,
          subscribedAt: new Date(),
          unsubscribeToken: generateUnsubscribeToken(),
          locale,
          source,
        },
      })
      return NextResponse.json({ success: true, alreadySubscribed: false, subscriber: updated })
    }

    const matchedUser = await prisma.user
      .findUnique({ where: { email }, select: { id: true } })
      .catch(() => null)

    const created = await prisma.newsletterSubscriber.create({
      data: {
        email,
        locale,
        source,
        unsubscribeToken: generateUnsubscribeToken(),
        userId: matchedUser?.id ?? null,
      },
    })
    return NextResponse.json({ success: true, alreadySubscribed: false, subscriber: created })
  } catch (err) {
    errorLog('[admin/newsletter/subscribers POST] error:', err)
    return NextResponse.json({ success: false, error: 'Failed to add subscriber' }, { status: 500 })
  }
}
