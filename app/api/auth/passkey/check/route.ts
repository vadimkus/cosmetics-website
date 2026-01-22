import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { debugLog } from '@/lib/logger'

/**
 * POST /api/auth/passkey/check
 * Checks if a user has passkeys registered (for showing passkey login option)
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ hasPasskeys: false })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        _count: {
          select: { passkeys: true }
        }
      }
    })

    const hasPasskeys = user ? user._count.passkeys > 0 : false
    
    debugLog('[PASSKEY] Check for', email, '- has passkeys:', hasPasskeys)

    return NextResponse.json({ hasPasskeys })
  } catch {
    return NextResponse.json({ hasPasskeys: false })
  }
}
