import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const { id } = await context.params
    const body = await request.json()

    const updates: any = {}
    if (body?.textEn !== undefined) updates.textEn = String(body.textEn || '').trim()
    if (body?.textRu !== undefined) updates.textRu = body.textRu == null ? null : String(body.textRu).trim()
    if (body?.textAr !== undefined) updates.textAr = body.textAr == null ? null : String(body.textAr).trim()
    if (body?.date !== undefined) {
      const d = new Date(String(body.date))
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ success: false, error: 'Invalid date' }, { status: 400 })
      }
      updates.date = d
    }
    if (body?.isActive !== undefined) updates.isActive = !!body.isActive

    if (updates.textEn !== undefined && !updates.textEn) {
      return NextResponse.json({ success: false, error: 'textEn is required' }, { status: 400 })
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (updates.isActive === true) {
        await tx.promotion.updateMany({
          data: { isActive: false },
          where: { isActive: true, NOT: { id } },
        })
      }
      return await tx.promotion.update({
        where: { id },
        data: updates,
      })
    })

    return NextResponse.json({ success: true, promotion: updated })
  } catch (error: unknown) {
    errorLog('[ADMIN_PROMOTIONS] PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update promotion' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const { id } = await context.params
    await prisma.promotion.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    errorLog('[ADMIN_PROMOTIONS] DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete promotion' }, { status: 500 })
  }
}


