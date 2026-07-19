import { NextRequest, NextResponse } from 'next/server'
import { releaseMatureClinicPoints } from '@/lib/homecare'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const released = await releaseMatureClinicPoints()
  return NextResponse.json({ success: true, released: released.count })
}
