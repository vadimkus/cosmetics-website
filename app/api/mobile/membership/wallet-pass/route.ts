import { NextResponse } from 'next/server'

/**
 * Retired Apple-only placeholder. Current clients POST to
 * /api/mobile/membership/wallet with an explicit provider.
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'ENDPOINT_RETIRED',
      replacement: '/api/mobile/membership/wallet',
    },
    { status: 410 },
  )
}
