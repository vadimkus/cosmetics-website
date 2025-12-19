/**
 * Health check endpoint for password reset table
 * GET /api/health/password-reset-table
 * Public endpoint to check if password reset table exists
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

export async function GET(_request: NextRequest) {
  try {
    // Try to query the table
    const tokenCount = await prisma.passwordResetToken.count()
    
    return NextResponse.json({
      status: 'ok',
      tableExists: true,
      tokenCount,
      message: 'Password reset table is ready'
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Check if it's a "table doesn't exist" error
    if (errorMessage.includes('does not exist') || 
        errorMessage.includes('Unknown table') ||
        errorMessage.includes('password_reset_tokens')) {
      errorLog('[HEALTH-CHECK] Password reset table does not exist')
      return NextResponse.json({
        status: 'error',
        tableExists: false,
        message: 'Password reset table does not exist. Run migration: npm run db:migrate-password-reset',
        action: 'migration_required'
      }, { status: 503 })
    }
    
    // Other database errors
    errorLog('[HEALTH-CHECK] Database error:', error)
    return NextResponse.json({
      status: 'error',
      tableExists: false,
      message: `Database error: ${errorMessage}`,
      action: 'check_database_connection'
    }, { status: 503 })
  }
}

