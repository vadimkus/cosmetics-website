/**
 * One-time migration API endpoint
 * POST /api/migrate/password-reset-table
 * This endpoint can be called once to ensure the password reset table exists
 * It's safe to call multiple times (idempotent)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import { execSync } from 'child_process'

export async function POST(request: NextRequest) {
  try {
    // Check for a simple secret token to prevent unauthorized access
    // In production, you can set MIGRATION_SECRET in environment variables
    const authHeader = request.headers.get('authorization')
    const migrationSecret = process.env.MIGRATION_SECRET || 'migration-secret-change-in-production'
    
    if (authHeader !== `Bearer ${migrationSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized. Provide Authorization: Bearer <MIGRATION_SECRET>' },
        { status: 401 }
      )
    }

    errorLog('[MIGRATION] Starting password reset table migration...')

    // Check if table exists
    try {
      const tokenCount = await prisma.passwordResetToken.count()
      errorLog(`[MIGRATION] Table already exists with ${tokenCount} tokens`)
      
      return NextResponse.json({
        success: true,
        message: 'Password reset table already exists',
        tokenCount,
        action: 'none'
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      // If table doesn't exist, try to create it
      if (errorMessage.includes('does not exist') || 
          errorMessage.includes('Unknown table') ||
          errorMessage.includes('password_reset_tokens')) {
        
        errorLog('[MIGRATION] Table does not exist, attempting to create...')
        
        try {
          // Run prisma db push
          execSync('npx prisma db push --skip-generate --accept-data-loss', {
            stdio: 'pipe',
            timeout: 30000,
            env: process.env
          })
          
          errorLog('[MIGRATION] Table created successfully')
          
          // Verify it was created
          const tokenCount = await prisma.passwordResetToken.count()
          
          return NextResponse.json({
            success: true,
            message: 'Password reset table created successfully',
            tokenCount,
            action: 'created'
          })
        } catch (pushError) {
          const pushErrorMsg = pushError instanceof Error ? pushError.message : String(pushError)
          errorLog('[MIGRATION] Failed to create table:', pushErrorMsg)
          
          return NextResponse.json({
            success: false,
            error: `Failed to create table: ${pushErrorMsg}`,
            message: 'Please run migration manually: npm run db:migrate-password-reset',
            action: 'failed'
          }, { status: 500 })
        }
      }
      
      // Other database errors
      throw error
    }
  } catch (error) {
    errorLog('[MIGRATION] Migration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: 'Migration failed. Please check logs and run manually if needed.'
    }, { status: 500 })
  }
}

