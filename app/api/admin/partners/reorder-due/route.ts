import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Reorder-due report for partner clinics.
 * Lists CLINIC/VIP accounts with days since their last order so the team can
 * nudge clinics before they run out. Admin-only.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    const daysParam = parseInt(request.nextUrl.searchParams.get('days') || '30', 10)
    const thresholdDays = Number.isNaN(daysParam) || daysParam <= 0 ? 30 : daysParam

    const partners = await prisma.user.findMany({
      where: { discountType: { in: ['CLINIC', 'VIP'] } },
      select: {
        id: true,
        name: true,
        email: true,
        contactEmail: true,
        phone: true,
        discountType: true,
        discountPercentage: true,
      },
      orderBy: { name: 'asc' },
    })

    const now = Date.now()

    const clinics = await Promise.all(
      partners.map(async p => {
        const emails = [p.email, p.contactEmail].filter(Boolean) as string[]
        const lastOrder = await prisma.order.findFirst({
          where: {
            customerEmail: { in: emails },
            status: { notIn: ['CANCELLED', 'DELETED', 'cancelled', 'deleted'] },
          },
          orderBy: { createdAt: 'desc' },
          select: { orderNumber: true, createdAt: true, total: true },
        })

        const daysSince = lastOrder ? Math.floor((now - new Date(lastOrder.createdAt).getTime()) / DAY_MS) : null
        const state: 'overdue' | 'ok' | 'never' =
          daysSince === null ? 'never' : daysSince >= thresholdDays ? 'overdue' : 'ok'

        const phoneDigits = String(p.phone || '').replace(/\D/g, '')
        const reminderText = `Hi ${p.name || ''}, it's time to restock your GENOSYS products. Reply and I'll prepare your order at your partner price. — GENOSYS`
        const whatsappUrl = phoneDigits
          ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(reminderText)}`
          : null

        return {
          id: p.id,
          name: p.name || p.email,
          phone: p.phone || null,
          discountType: p.discountType,
          discountPercentage: p.discountPercentage || 0,
          lastOrderNumber: lastOrder?.orderNumber || null,
          lastOrderDate: lastOrder?.createdAt || null,
          lastOrderTotal: lastOrder?.total ?? null,
          daysSince,
          state,
          whatsappUrl,
        }
      })
    )

    // Sort: overdue first (most overdue on top), then never-ordered, then ok.
    const rank = { overdue: 0, never: 1, ok: 2 }
    clinics.sort((a, b) => {
      if (rank[a.state] !== rank[b.state]) return rank[a.state] - rank[b.state]
      return (b.daysSince ?? 0) - (a.daysSince ?? 0)
    })

    const counts = {
      total: clinics.length,
      overdue: clinics.filter(c => c.state === 'overdue').length,
      never: clinics.filter(c => c.state === 'never').length,
      ok: clinics.filter(c => c.state === 'ok').length,
    }

    return NextResponse.json({ thresholdDays, counts, clinics })
  } catch (error) {
    errorLog('❌ reorder-due report failed:', error)
    return NextResponse.json({ error: 'Failed to build reorder report' }, { status: 500 })
  }
}
