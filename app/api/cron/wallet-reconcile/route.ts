import { NextRequest, NextResponse } from 'next/server'
import { reconcileWalletPasses } from '@/lib/wallet/sync'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }
  const result = await reconcileWalletPasses(50)
  return NextResponse.json({ success: true, ...result })
}
