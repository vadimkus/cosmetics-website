import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: [{ isActive: 'desc' }, { date: 'desc' }],
    })
    return NextResponse.json({ success: true, promotions })
  } catch (error: unknown) {
    errorLog('[ADMIN_PROMOTIONS] GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch promotions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const body = await request.json()
    const textEn = String(body?.textEn || '').trim()
    const textRu = body?.textRu != null ? String(body.textRu).trim() : null
    const textAr = body?.textAr != null ? String(body.textAr).trim() : null
    const isActive = body?.isActive === false ? false : true

    if (!textEn) {
      return NextResponse.json({ success: false, error: 'textEn is required' }, { status: 400 })
    }

    const dateRaw = body?.date
    const date = dateRaw ? new Date(String(dateRaw)) : new Date()
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid date' }, { status: 400 })
    }

    const created = await prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.promotion.updateMany({ data: { isActive: false }, where: { isActive: true } })
      }
      return await tx.promotion.create({
        data: {
          date,
          textEn,
          textRu: textRu || null,
          textAr: textAr || null,
          isActive,
        },
      })
    })

    return NextResponse.json({ success: true, promotion: created }, { status: 201 })
  } catch (error: unknown) {
    errorLog('[ADMIN_PROMOTIONS] POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create promotion' }, { status: 500 })
  }
}


