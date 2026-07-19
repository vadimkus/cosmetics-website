import { NextRequest, NextResponse } from 'next/server'
import { requireCsrfToken } from '@/lib/csrf'
import {
  revokeHomecareScript,
  updateHomecareScript,
  type HomecareScriptInput,
} from '@/lib/homecare'
import { HOMECARE_CORS_HEADERS, requireHomecarePartner } from '@/lib/homecareAuth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: HOMECARE_CORS_HEADERS })
}

async function authorizeMutation(request: NextRequest) {
  const result = await requireHomecarePartner(request)
  if (!result.auth) return { result, response: NextResponse.json(
    { success: false, error: result.error },
    { status: result.status || 401, headers: HOMECARE_CORS_HEADERS },
  ) }
  if (!result.auth.mobile) {
    const csrf = await requireCsrfToken(request)
    if (!csrf.valid) return { result, response: csrf.response! }
  }
  return { result }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorized = await authorizeMutation(request)
  if (authorized.response || !authorized.result.auth) return authorized.response!

  try {
    const { id } = await params
    const input = (await request.json()) as HomecareScriptInput
    const version = await updateHomecareScript(authorized.result.auth.user.id, id, input)
    return NextResponse.json({ success: true, version }, { headers: HOMECARE_CORS_HEADERS })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to update script' },
      { status: 400, headers: HOMECARE_CORS_HEADERS },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorized = await authorizeMutation(request)
  if (authorized.response || !authorized.result.auth) return authorized.response!
  const { id } = await params
  const revoked = await revokeHomecareScript(authorized.result.auth.user.id, id)
  if (!revoked) {
    return NextResponse.json(
      { success: false, error: 'Homecare Script not found' },
      { status: 404, headers: HOMECARE_CORS_HEADERS },
    )
  }
  return NextResponse.json({ success: true }, { headers: HOMECARE_CORS_HEADERS })
}
