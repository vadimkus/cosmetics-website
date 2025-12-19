/**
 * API endpoint to ensure password reset table exists in production
 * POST /api/admin/migrate-password-reset-table
 * Requires admin authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  // Require admin authentication
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    debugLog('[MIGRATE-PASSWORD-RESET] Starting migration check...')

    // Check if table exists
    try {
      const testQuery = await prisma.$queryRaw<Array<{ exists: boolean }>>`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'password_reset_tokens'
        ) as exists;
      `
      const tableExists = testQuery[0]?.exists || false

      if (tableExists) {
        debugLog('[MIGRATE-PASSWORD-RESET] Table already exists')
        
        // Verify structure
        const tokenCount = await prisma.passwordResetToken.count()
        
        return NextResponse.json({
          success: true,
          message: 'Password reset table already exists',
          tokenCount
        })
      } else {
        debugLog('[MIGRATE-PASSWORD-RESET] Table does not exist, attempting to create...')
        
        // Table doesn't exist - this means Prisma db push needs to be run
        // In production, this should be done via deployment process
        return NextResponse.json({
          success: false,
          message: 'Table does not exist. Please run: npx prisma db push',
          action: 'Run database migration manually or redeploy'
        }, { status: 400 })
      }
    } catch {
      errorLog('[MIGRATE-PASSWORD-RESET] Error checking table:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return NextResponse.json({
        success: false,
        error: `Database error: ${errorMessage}`,
        message: 'Please check database connection and run: npx prisma db push'
      }, { status: 500 })
    }
  } catch {
    errorLog('[MIGRATE-PASSWORD-RESET] Fatal error:', error)
    return NextResponse.json(
      { error: 'Migration check failed' },
      { status: 500 }
    )
  }
}

