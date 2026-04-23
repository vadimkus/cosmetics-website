import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'
import { generateUnsubscribeToken } from '@/lib/newsletter'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * DELETE /api/admin/newsletter/subscribers/[id]
 * Soft-deletes: sets isActive=false, unsubscribedAt=now.
 * We keep the row so we have a record and so re-adding issues a fresh token.
 */
export async function DELETE(request: NextRequest, ctx: RouteParams) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const { id } = await ctx.params
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })

    const updated = await prisma.newsletterSubscriber.updateMany({
      where: { id, isActive: true },
      data: { isActive: false, unsubscribedAt: new Date() },
    })

    if (updated.count === 0) {
      return NextResponse.json({ success: true, alreadyInactive: true })
    }
    return NextResponse.json({ success: true, alreadyInactive: false })
  } catch (err) {
    errorLog('[admin/newsletter/subscribers DELETE] error:', err)
    return NextResponse.json({ success: false, error: 'Failed to deactivate subscriber' }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/newsletter/subscribers/[id]
 * Body: { isActive?: boolean, locale?: 'en'|'ar'|'ru' }
 * Flip active state or change locale. Rotating token on re-activation so any old
 * unsubscribe link becomes useless.
 */
export async function PATCH(request: NextRequest, ctx: RouteParams) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const { id } = await ctx.params
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })

    const body = (await request.json().catch(() => ({}))) as {
      isActive?: boolean
      locale?: string
    }

    const data: Record<string, unknown> = {}
    if (typeof body.isActive === 'boolean') {
      data.isActive = body.isActive
      if (body.isActive) {
        data.unsubscribedAt = null
        data.subscribedAt = new Date()
        data.unsubscribeToken = generateUnsubscribeToken()
      } else {
        data.unsubscribedAt = new Date()
      }
    }
    if (body.locale === 'en' || body.locale === 'ar' || body.locale === 'ru') {
      data.locale = body.locale
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ success: false, error: 'Nothing to update' }, { status: 400 })
    }

    const updated = await prisma.newsletterSubscriber.update({ where: { id }, data })
    return NextResponse.json({ success: true, subscriber: updated })
  } catch (err) {
    errorLog('[admin/newsletter/subscribers PATCH] error:', err)
    return NextResponse.json({ success: false, error: 'Failed to update subscriber' }, { status: 500 })
  }
}
