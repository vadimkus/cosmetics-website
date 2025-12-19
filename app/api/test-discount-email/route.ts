import { NextRequest, NextResponse } from 'next/server'
import { sendDiscountAssignmentEmail } from '@/lib/email'
import { errorLog, debugLog } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

/**
 * Simple test endpoint to send discount assignment email
 * POST /api/test-discount-email
 * Body: { email: string, name?: string, discountType?: 'CLINIC' | 'VIP', discountPercentage?: number }
 * If discountType/discountPercentage are not provided, fetches from user's database record
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name, discountType, discountPercentage } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    // Fetch user from database to get actual discount info
    let userDiscountType: 'CLINIC' | 'VIP' | null = null
    let userDiscountPercentage: number | null = null
    let userName: string | null = null

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: {
          name: true,
          discountType: true,
          discountPercentage: true
        }
      })

      if (user) {
        userName = user.name || null
        userDiscountType = user.discountType as 'CLINIC' | 'VIP' | null
        userDiscountPercentage = user.discountPercentage
        debugLog(`✅ Found user in database: ${email}`, {
          name: userName,
          discountType: userDiscountType,
          discountPercentage: userDiscountPercentage
        })
      } else {
        debugLog(`⚠️ User not found in database: ${email}`)
      }
    } catch (dbError) {
      errorLog('Error fetching user from database:', dbError)
      // Continue with provided/default values
    }

    // Use provided values, or fall back to user's database values, or defaults
    const finalName = name || userName || 'Valued Customer'
    const finalDiscountType = (discountType || userDiscountType || 'CLINIC') as 'CLINIC' | 'VIP'
    const finalDiscountPercentage = discountPercentage ?? userDiscountPercentage ?? 15

    if (!finalDiscountType || !finalDiscountPercentage || finalDiscountPercentage <= 0) {
      return NextResponse.json(
        { error: 'User does not have a discount assigned. Please provide discountType and discountPercentage.' },
        { status: 400 }
      )
    }

    debugLog(`📧 Sending discount assignment email to: ${email}`)
    debugLog(`👤 Name: ${finalName}`)
    debugLog(`🎁 Discount Type: ${finalDiscountType}`)
    debugLog(`💰 Discount Percentage: ${finalDiscountPercentage}%`)
    if (userDiscountPercentage !== null && discountPercentage === undefined) {
      debugLog(`ℹ️  Using user's actual discount from database: ${userDiscountPercentage}%`)
    }

    const result = await sendDiscountAssignmentEmail({
      customerName: finalName,
      customerEmail: email,
      discountType: finalDiscountType,
      discountPercentage: finalDiscountPercentage
    })

    if (result.success && 'messageId' in result) {
      return NextResponse.json({
        success: true,
        message: `Discount assignment email sent successfully to ${email}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send discount assignment email: ${result.error}` },
        { status: 500 }
      )
    }

  } catch {
    errorLog('Send discount test email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

