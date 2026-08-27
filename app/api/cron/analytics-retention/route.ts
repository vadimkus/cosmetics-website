import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Analytics data-retention cron (GDPR/PDPL storage limitation).
 *
 * Deletes anonymous visitor analytics older than RETENTION_DAYS:
 *   - page_views   (IP, geo, UA, device)
 *   - user_sessions (IP, geo, UA, device)
 *
 * Orders / PDF downloads are business records and are NOT touched.
 *
 * Runs daily via Vercel Cron (see vercel.json). Deletes in bounded batches so
 * a large backlog can never lock the table or blow the function timeout -
 * whatever doesn't fit in one run is picked up the next day.
 */
const RETENTION_DAYS = 365
const BATCH_SIZE = 5000
const MAX_BATCHES_PER_RUN = 10

export async function GET(request: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000)

  try {
    let pageViewsDeleted = 0
    let sessionsDeleted = 0

    for (let i = 0; i < MAX_BATCHES_PER_RUN; i++) {
      const deleted: number = await prisma.$executeRaw`
        DELETE FROM "page_views"
        WHERE "id" IN (
          SELECT "id" FROM "page_views"
          WHERE "timestamp" < ${cutoff}
          LIMIT ${BATCH_SIZE}
        )`
      pageViewsDeleted += deleted
      if (deleted < BATCH_SIZE) break
    }

    for (let i = 0; i < MAX_BATCHES_PER_RUN; i++) {
      const deleted: number = await prisma.$executeRaw`
        DELETE FROM "user_sessions"
        WHERE "id" IN (
          SELECT "id" FROM "user_sessions"
          WHERE "startTime" < ${cutoff}
          LIMIT ${BATCH_SIZE}
        )`
      sessionsDeleted += deleted
      if (deleted < BATCH_SIZE) break
    }

    debugLog('Analytics retention cron done', { cutoff, pageViewsDeleted, sessionsDeleted })
    return NextResponse.json({
      success: true,
      cutoff: cutoff.toISOString(),
      pageViewsDeleted,
      sessionsDeleted,
    })
  } catch (error) {
    errorLog('Analytics retention cron failed:', error)
    return NextResponse.json({ success: false, error: 'Retention job failed' }, { status: 500 })
  }
}
