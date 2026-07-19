import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { adjustClinicPoints, getClinicPointBalances } from '@/lib/homecare'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const { id } = await params
  const [balances, transactions] = await Promise.all([
    getClinicPointBalances(id),
    prisma.clinicPointTransaction.findMany({
      where: { clinicUserId: id },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        points: true,
        eligibleAmount: true,
        type: true,
        status: true,
        description: true,
        availableAt: true,
        createdAt: true,
        order: { select: { orderNumber: true } },
      },
    }),
  ])
  return NextResponse.json({ success: true, balances, transactions })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response
  const csrf = await requireCsrfToken(request)
  if (!csrf.valid) return csrf.response!

  try {
    const { id } = await params
    const body = await request.json()
    const transaction = await adjustClinicPoints({
      clinicUserId: id,
      points: Number(body?.points),
      description: String(body?.description || ''),
      adminId: auth.user.id,
    })
    return NextResponse.json({
      success: true,
      transaction,
      balances: await getClinicPointBalances(id),
    })
  } catch (error) {
    errorLog('Clinic Points admin adjustment failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not adjust Clinic Points.' },
      { status: 400 },
    )
  }
}
