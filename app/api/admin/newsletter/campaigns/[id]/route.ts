import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { errorLog } from '@/lib/logger'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * GET /api/admin/newsletter/campaigns/[id]
 * Returns a single campaign for status polling while a production send is running.
 */
export async function GET(request: NextRequest, ctx: RouteParams) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    const { id } = await ctx.params
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })

    const campaign = await prisma.newsletterCampaign.findUnique({ where: { id } })
    if (!campaign) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, campaign })
  } catch (err) {
    errorLog('[admin/newsletter/campaigns/[id] GET] error:', err)
    return NextResponse.json({ success: false, error: 'Failed to load campaign' }, { status: 500 })
  }
}
