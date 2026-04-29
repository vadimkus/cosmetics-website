import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'
import { generateProfitabilityReport } from '@/lib/moyskladReports'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function isDateOnly(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function parseDateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`)
}

function daysBetweenInclusive(from: string, to: string): number {
  const fromDate = parseDateOnly(from)
  const toDate = parseDateOnly(to)
  const diffMs = toDate.getTime() - fromDate.getTime()
  return Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const body = await request.json()
    const from = body?.from
    const to = body?.to

    if (!isDateOnly(from) || !isDateOnly(to)) {
      return NextResponse.json(
        { success: false, error: 'from and to must be YYYY-MM-DD dates' },
        { status: 400 }
      )
    }

    const fromDate = parseDateOnly(from)
    const toDate = parseDateOnly(to)

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()) || fromDate > toDate) {
      return NextResponse.json(
        { success: false, error: 'Invalid date range' },
        { status: 400 }
      )
    }

    const days = daysBetweenInclusive(from, to)
    if (days > 366) {
      return NextResponse.json(
        { success: false, error: 'Maximum report period is 366 days' },
        { status: 400 }
      )
    }

    const report = await generateProfitabilityReport(from, to)
    return NextResponse.json({ success: true, report })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    errorLog('[ADMIN_PROFITABILITY_REPORT] Failed to generate report:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate profitability report',
        details: process.env.NODE_ENV === 'development' ? message : undefined,
      },
      { status: 500 }
    )
  }
}
