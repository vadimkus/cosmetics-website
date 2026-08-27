import { NextResponse } from 'next/server'

/**
 * DEPRECATED - This route previously accepted userId from the request body
 * with no authentication. Account deletion is handled by /api/profile/delete
 * which verifies the session cookie.
 */
export async function DELETE() {
  return NextResponse.json(
    { error: 'This endpoint has been removed. Use /api/profile/delete instead.' },
    { status: 410 }
  )
}
