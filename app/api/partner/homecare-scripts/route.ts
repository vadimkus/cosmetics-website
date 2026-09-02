import { NextRequest, NextResponse } from 'next/server'
import { requireCsrfToken } from '@/lib/csrf'
import {
  createHomecareScript,
  listHomecareScripts,
  type HomecareScriptInput,
} from '@/lib/homecare'
import { HOMECARE_CORS_HEADERS, requireHomecarePartner } from '@/lib/homecareAuth'
import { getClientIdentifierFromNextRequest, rateLimitSimple } from '@/lib/rateLimitSimple'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const createLimiter = rateLimitSimple({ name: 'homecare-create', windowMs: 10 * 60 * 1000, max: 20 })

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: HOMECARE_CORS_HEADERS })
}

export async function GET(request: NextRequest) {
  const result = await requireHomecarePartner(request)
  if (!result.auth) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: result.status || 401, headers: HOMECARE_CORS_HEADERS },
    )
  }
  const data = await listHomecareScripts(result.auth.user.id)
  return NextResponse.json({ success: true, ...data }, { headers: HOMECARE_CORS_HEADERS })
}

export async function POST(request: NextRequest) {
  const result = await requireHomecarePartner(request)
  if (!result.auth) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: result.status || 401, headers: HOMECARE_CORS_HEADERS },
    )
  }
  if (!result.auth.mobile) {
    const csrf = await requireCsrfToken(request)
    if (!csrf.valid) return csrf.response!
  }

  const rl = await createLimiter(
    `${result.auth.user.id}:${getClientIdentifierFromNextRequest(request)}`,
  )
  if (!rl.success) {
    return NextResponse.json(
      { success: false, error: rl.message || 'Too many scripts created' },
      { status: 429, headers: HOMECARE_CORS_HEADERS },
    )
  }

  try {
    const input = (await request.json()) as HomecareScriptInput
    const script = await createHomecareScript(result.auth.user.id, input)
    return NextResponse.json({ success: true, script }, { status: 201, headers: HOMECARE_CORS_HEADERS })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to create script' },
      { status: 400, headers: HOMECARE_CORS_HEADERS },
    )
  }
}
