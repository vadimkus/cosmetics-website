import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { errorLog } from '@/lib/logger'

/**
 * GET /api/admin/newsletter/subscribers/export
 * Query: locale?, isActive? (default true)
 * Streams a CSV of subscribers. Always respects the active/locale filters so
 * the admin can export a targeted segment, not the full graveyard.
 */
function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    const url = new URL(request.url)
    const qLocale = url.searchParams.get('locale')
    const qActive = url.searchParams.get('isActive') ?? 'true'

    const where: Record<string, unknown> = {}
    if (qLocale === 'en' || qLocale === 'ar' || qLocale === 'ru') where.locale = qLocale
    if (qActive === 'true') where.isActive = true
    else if (qActive === 'false') where.isActive = false
    // `all` → no filter on isActive

    const rows = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { subscribedAt: 'desc' },
      select: {
        email: true,
        locale: true,
        source: true,
        isActive: true,
        subscribedAt: true,
        unsubscribedAt: true,
        lastSentAt: true,
      },
    })

    const header = ['email', 'locale', 'source', 'isActive', 'subscribedAt', 'unsubscribedAt', 'lastSentAt']
    const lines = [header.join(',')]
    for (const r of rows) {
      lines.push(
        [
          csvEscape(r.email),
          csvEscape(r.locale),
          csvEscape(r.source),
          csvEscape(r.isActive ? 'yes' : 'no'),
          csvEscape(r.subscribedAt?.toISOString() || ''),
          csvEscape(r.unsubscribedAt?.toISOString() || ''),
          csvEscape(r.lastSentAt?.toISOString() || ''),
        ].join(',')
      )
    }
    // Prepend BOM so Excel opens UTF-8 cleanly
    const body = '\uFEFF' + lines.join('\r\n')
    const filename = `genosys-subscribers-${new Date().toISOString().slice(0, 10)}.csv`

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    errorLog('[admin/newsletter/subscribers/export] error:', err)
    return NextResponse.json({ success: false, error: 'Export failed' }, { status: 500 })
  }
}
