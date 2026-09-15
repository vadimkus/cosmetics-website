import { NextRequest, NextResponse } from 'next/server'
import { warnLog } from '@/lib/logger'
import {
  getClientIdentifierFromNextRequest,
  rateLimitSimple,
} from '@/lib/rateLimitSimple'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const limiter = rateLimitSimple({
  name: 'apple-wallet-log',
  windowMs: 60 * 1000,
  max: 20,
  memoryOnly: true,
})

export async function POST(request: NextRequest) {
  const limited = await limiter(getClientIdentifierFromNextRequest(request))
  if (!limited.success) return new NextResponse(null, { status: 429 })
  const body = await request.json().catch(() => null)
  const count = Array.isArray(body?.logs) ? Math.min(body.logs.length, 20) : 0
  if (count > 0) {
    // Apple messages can contain pass URLs and tokens. Record only the count.
    warnLog(`[AppleWallet] device reported ${count} pass processing message(s)`)
  }
  return new NextResponse(null, { status: 200 })
}
