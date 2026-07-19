import { NextRequest, NextResponse } from 'next/server'
import { getPublicHomecareScript } from '@/lib/homecare'
import { getClientIdentifierFromNextRequest, rateLimitSimple } from '@/lib/rateLimitSimple'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const publicLimiter = rateLimitSimple({ windowMs: 60 * 1000, max: 60 })

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const rl = await publicLimiter(`homecare-public:${getClientIdentifierFromNextRequest(request)}`)
  if (!rl.success) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 })
  }

  const { token } = await params
  if (!/^[A-Za-z0-9_-]{24,64}$/.test(token)) {
    return NextResponse.json({ success: false, error: 'Recommendation not found' }, { status: 404 })
  }

  const script = await getPublicHomecareScript(token)
  if (!script) {
    return NextResponse.json({ success: false, error: 'Recommendation not found' }, { status: 404 })
  }

  return NextResponse.json(
    { success: true, script },
    {
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
        'Referrer-Policy': 'no-referrer',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    },
  )
}
