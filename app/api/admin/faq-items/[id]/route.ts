import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const { id } = await context.params
    const body = await request.json()

    const data: Record<string, unknown> = {}
    if (body?.questionEn !== undefined) data.questionEn = String(body.questionEn).trim()
    if (body?.answerEn !== undefined) data.answerEn = String(body.answerEn).trim()
    if (body?.questionAr !== undefined) data.questionAr = body.questionAr ? String(body.questionAr).trim() : null
    if (body?.answerAr !== undefined) data.answerAr = body.answerAr ? String(body.answerAr).trim() : null
    if (body?.questionRu !== undefined) data.questionRu = body.questionRu ? String(body.questionRu).trim() : null
    if (body?.answerRu !== undefined) data.answerRu = body.answerRu ? String(body.answerRu).trim() : null
    if (body?.category !== undefined) data.category = body.category ? String(body.category).trim() : null
    if (body?.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder)
    if (body?.isActive !== undefined) data.isActive = !!body.isActive

    if (data.questionEn !== undefined && !data.questionEn) {
      return NextResponse.json({ success: false, error: 'questionEn cannot be empty' }, { status: 400 })
    }

    const updated = await prisma.faqItem.update({
      where: { id },
      data,
    })

    revalidateTag('faq', 'max')

    return NextResponse.json({ success: true, item: updated })
  } catch (error: unknown) {
    errorLog('[ADMIN_FAQ] PUT error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: 'Failed to update FAQ item', details: process.env.NODE_ENV === 'development' ? msg : undefined }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const { id } = await context.params
    await prisma.faqItem.delete({ where: { id } })
    revalidateTag('faq', 'max')
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    errorLog('[ADMIN_FAQ] DELETE error:', error)
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ item', details: process.env.NODE_ENV === 'development' ? msg : undefined }, { status: 500 })
  }
}
