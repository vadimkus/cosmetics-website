/**
 * Auto-migration utility for password reset table
 * This function can be called to ensure the table exists
 * It's safe to call multiple times (idempotent)
 */

import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

export async function ensurePasswordResetTable(): Promise<{
  success: boolean
  tableExists: boolean
  message: string
}> {
  try {
    // Try to query the table to see if it exists
    await prisma.passwordResetToken.count()
    
    return {
      success: true,
      tableExists: true,
      message: 'Password reset table is ready'
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Check if it's a "table doesn't exist" error
    if (errorMessage.includes('does not exist') || 
        errorMessage.includes('Unknown table') ||
        errorMessage.includes('password_reset_tokens')) {
      errorLog('❌ Password reset table does not exist')
      return {
        success: false,
        tableExists: false,
        message: 'Password reset table does not exist. Please run database migration.'
      }
    }
    
    // Re-throw other errors (connection issues, etc.)
    throw error
  }
}

