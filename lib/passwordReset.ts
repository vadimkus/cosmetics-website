/**
 * Password Reset Utility Functions
 * Handles secure token generation, verification, and management
 */

import * as crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { debugLog, errorLog } from './logger'

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
    // Find all non-expired, unused tokens
    const tokens = await prisma.passwordResetToken.findMany({
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
    
    debugLog(`🔍 Checking ${tokens.length} valid tokens`)
    
    // Check each token (since we stored hashed tokens, we need to compare)
    for (const tokenRecord of tokens) {
      try {
        const isValid = await bcrypt.compare(plainToken, tokenRecord.token)
        if (isValid) {
          debugLog('✅ Token verified successfully for user:', tokenRecord.user.email)
          return {
            valid: true,
            userId: tokenRecord.userId,
            tokenId: tokenRecord.id
          }
        }
      } catch (compareError) {
        // Continue checking other tokens if comparison fails
        debugLog('⚠️ Token comparison error:', compareError)
      }
    }
    
    debugLog('❌ Token not found or invalid')
    return {
      valid: false,
      error: 'Invalid or expired token'
    }
  } catch (error) {
    errorLog('Error verifying password reset token:', error)
    return {
      valid: false,
      error: 'Error verifying token'
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    errorLog('Error creating password reset token:', error)
    throw error
  }
}

