import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    const items = await prisma.faqItem.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ success: true, items })
  } catch (error: unknown) {
    errorLog('[ADMIN_FAQ] GET error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQ items', details: process.env.NODE_ENV === 'development' ? msg : undefined }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const body = await request.json()
    const questionEn = String(body?.questionEn || '').trim()
    const answerEn = String(body?.answerEn || '').trim()

    if (!questionEn || !answerEn) {
      return NextResponse.json({ success: false, error: 'questionEn and answerEn are required' }, { status: 400 })
    }

    // Get next sort order
    const maxSort = await prisma.faqItem.aggregate({ _max: { sortOrder: true } })
    const nextSort = (maxSort._max.sortOrder || 0) + 10

    const created = await prisma.faqItem.create({
      data: {
        sortOrder: body?.sortOrder ?? nextSort,
        isActive: body?.isActive !== false,
        category: body?.category?.trim() || null,
        questionEn,
        answerEn,
        questionAr: body?.questionAr?.trim() || null,
        answerAr: body?.answerAr?.trim() || null,
        questionRu: body?.questionRu?.trim() || null,
        answerRu: body?.answerRu?.trim() || null,
      },
    })

    // Expire ISR cache for all three FAQ locale pages.
    revalidateTag('faq', 'max')

    return NextResponse.json({ success: true, item: created }, { status: 201 })
  } catch (error: unknown) {
    errorLog('[ADMIN_FAQ] POST error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: 'Failed to create FAQ item', details: process.env.NODE_ENV === 'development' ? msg : undefined }, { status: 500 })
  }
}
