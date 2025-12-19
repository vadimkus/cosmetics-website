/**
 * Password Reset Utility Functions
 * Handles secure token generation, verification, and management
 */

import * as crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { debugLog, errorLog } from './logger'
import { ensurePasswordResetTable } from './ensurePasswordResetTable'

/**
 * Generate a secure password reset token
 * @returns Object containing plain token (for email) and hashed token (for storage)
 */
export async function generatePasswordResetToken(): Promise<{
  plainToken: string
  hashedToken: string
  expiresAt: Date
}> {
  // Generate secure random token (64 character hex string)
  const plainToken = crypto.randomBytes(32).toString('hex')
  
  // Hash token for storage (using bcrypt with 10 rounds)
  const hashedToken = await bcrypt.hash(plainToken, 10)
  
  // Set expiration (30 minutes from now)
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 30)
  
  debugLog('🔐 Generated password reset token, expires at:', expiresAt.toISOString())
  
  return {
    plainToken,    // Send this in email
    hashedToken,   // Store this in database
    expiresAt
  }
}

/**
 * Verify a password reset token
 * @param plainToken - The plain token from the reset link
 * @returns Object with validation result and userId if valid
 */
export async function verifyPasswordResetToken(
  plainToken: string
): Promise<{
  valid: boolean
  userId?: string
  tokenId?: string
  error?: string
}> {
  try {
    debugLog('🔍 Starting token verification for token:', plainToken.substring(0, 10) + '...')
    
    // First, verify Prisma client has the passwordResetToken model
    // In serverless environments, we need to check more carefully
    debugLog('🔍 Checking Prisma client for passwordResetToken model...')
    debugLog('🔍 Prisma client type:', typeof prisma)
    debugLog('🔍 Prisma client keys:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')).slice(0, 10).join(', '))
    
    // Check if passwordResetToken exists before trying to use it
    if (!prisma || typeof prisma !== 'object') {
      errorLog('❌ Prisma client is not properly initialized')
      return {
        valid: false,
        error: 'Password reset feature not configured. Please regenerate Prisma client.'
      }
    }

    // Check if the model exists
    if (!('passwordResetToken' in prisma)) {
      errorLog('❌ passwordResetToken model NOT FOUND in Prisma client at runtime')
      const availableModels = Object.keys(prisma).filter(
        k => !k.startsWith('$') && !k.startsWith('_') && typeof prisma[k as keyof typeof prisma] === 'object'
      )
      errorLog('❌ Available Prisma models:', availableModels.join(', '))
      return {
        valid: false,
        error: 'Password reset feature not configured. Please regenerate Prisma client.'
      }
    }

    debugLog('✅ passwordResetToken model found in Prisma client')
    
    // Now try to use it
    let tokens
    try {
      // Directly try to query - if model doesn't exist, this will throw
      tokens = await prisma.passwordResetToken.findMany({
        where: {
          used: false,
          expiresAt: {
            gt: new Date() // Not expired
          }
        },
        include: {
          user: true
        }
      })
    } catch (dbError) {
      // Check if it's a table doesn't exist error or model not found error
      const errorMsg = dbError instanceof Error ? dbError.message : String(dbError)
      const errorStack = dbError instanceof Error ? dbError.stack : ''
      const errorName = dbError instanceof Error ? dbError.name : ''
      
      errorLog('❌ Database error during token verification:', errorMsg)
      errorLog('❌ Error name:', errorName)
      errorLog('❌ Error stack:', errorStack)
      
      // Check for Prisma client model errors (model doesn't exist in generated client)
      if (
        errorName === 'TypeError' ||
        errorMsg.includes('Cannot read') ||
        errorMsg.includes('undefined') ||
        errorMsg.includes('passwordResetToken') ||
        errorMsg.includes('password_reset_tokens') ||
        errorMsg.includes('Unknown arg') ||
        errorMsg.includes('prisma.passwordResetToken') ||
        errorMsg.includes('is not a function') ||
        (errorStack && errorStack.includes('passwordResetToken'))
      ) {
        errorLog('❌ Prisma client error - passwordResetToken model not available')
        // Log available models for debugging
        try {
          const availableModels = Object.keys(prisma).filter(
            k => !k.startsWith('$') && !k.startsWith('_') && typeof prisma[k as keyof typeof prisma] === 'object'
          )
          errorLog('❌ Available Prisma models:', availableModels.join(', '))
        } catch {
          errorLog('❌ Could not list available models')
        }
        return {
          valid: false,
          error: 'Password reset feature not configured. Please regenerate Prisma client.'
        }
      }
      
      // Check if it's a table doesn't exist error
      if (errorMsg.includes('does not exist') || errorMsg.includes('Unknown table')) {
        errorLog('❌ Password reset tokens table does not exist in database')
        return {
          valid: false,
          error: 'Password reset feature not configured. Please run database migration.'
        }
      }
      
      // Re-throw other database errors
      throw dbError
    }
    
    debugLog(`🔍 Found ${tokens.length} valid tokens in database`)
    
    if (tokens.length === 0) {
      debugLog('❌ No valid tokens found in database')
      return {
        valid: false,
        error: 'Invalid or expired token'
      }
    }
    
    // Check each token (since we stored hashed tokens, we need to compare)
    for (const tokenRecord of tokens) {
      try {
        debugLog(`🔍 Comparing token for user: ${tokenRecord.user.email}`)
        const isValid = await bcrypt.compare(plainToken, tokenRecord.token)
        if (isValid) {
          debugLog('✅ Token verified successfully for user:', tokenRecord.user.email)
          return {
            valid: true,
            userId: tokenRecord.userId,
            tokenId: tokenRecord.id
          }
        } else {
          debugLog('❌ Token comparison failed for user:', tokenRecord.user.email)
        }
      } catch (compareError) {
        // Continue checking other tokens if comparison fails
        errorLog('⚠️ Token comparison error:', compareError)
        debugLog('⚠️ Token comparison error for user:', tokenRecord.user.email, compareError)
      }
    }
    
    debugLog('❌ Token not found or invalid after checking all tokens')
    return {
      valid: false,
      error: 'Invalid or expired token'
    }
  } catch {
    errorLog('Error verifying password reset token:', error)
    // Provide more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    debugLog('❌ Token verification error details:', { errorMessage, errorStack })
    
    // Check for Prisma client errors (model not found)
    if (errorMessage.includes('passwordResetToken') || 
        errorMessage.includes('password_reset_tokens') ||
        errorMessage.includes('Unknown arg') ||
        errorMessage.includes('does not exist') ||
        (errorStack && errorStack.includes('passwordResetToken'))) {
      errorLog('❌ Prisma client error - passwordResetToken model not available')
      return {
        valid: false,
        error: 'Password reset feature not configured. Please regenerate Prisma client.'
      }
    }
    
    // Check for table doesn't exist errors
    if (errorMessage.includes('does not exist') || errorMessage.includes('Unknown table')) {
      return {
        valid: false,
        error: 'Password reset feature not configured. Please run database migration.'
      }
    }
    
    return {
      valid: false,
      error: `Error verifying token: ${errorMessage}`
    }
  }
}

/**
 * Mark a password reset token as used
 * @param tokenId - The ID of the token to mark as used
 */
export async function markTokenAsUsed(tokenId: string): Promise<void> {
  try {
    await prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { used: true }
    })
    debugLog('✅ Token marked as used:', tokenId)
  } catch {
    errorLog('Error marking token as used:', error)
    throw error
  }
}

/**
 * Invalidate all password reset tokens for a user
 * @param userId - The user ID whose tokens should be invalidated
 */
export async function invalidateUserTokens(userId: string): Promise<void> {
  try {
    const result = await prisma.passwordResetToken.updateMany({
      where: {
        userId,
        used: false
      },
      data: {
        used: true
      }
    })
    debugLog(`✅ Invalidated ${result.count} tokens for user:`, userId)
  } catch {
    errorLog('Error invalidating user tokens:', error)
    throw error
  }
}

/**
 * Clean up expired password reset tokens (maintenance function)
 * @returns Number of tokens deleted
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } }, // Expired tokens
          { used: true } // Already used tokens
        ]
      }
    })
    debugLog(`🧹 Cleaned up ${result.count} expired/used tokens`)
    return result.count
  } catch {
    errorLog('Error cleaning up expired tokens:', error)
    return 0
  }
}

/**
 * Create a password reset token for a user
 * @param userId - The user ID
 * @returns The plain token (to be sent in email)
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  try {
    // Ensure table exists before creating token
    const tableCheck = await ensurePasswordResetTable()
    if (!tableCheck.tableExists) {
      errorLog('❌ Cannot create password reset token - table does not exist')
      throw new Error('Password reset feature not configured. Please run database migration.')
    }
    
    // Generate token
    const { plainToken, hashedToken, expiresAt } = await generatePasswordResetToken()
    
    // Store token in database
    await prisma.passwordResetToken.create({
      data: {
        userId,
        token: hashedToken,
        expiresAt
      }
    })
    
    debugLog('✅ Password reset token created for user:', userId)
    return plainToken
  } catch {
    errorLog('Error creating password reset token:', error)
    throw error
  }
}

