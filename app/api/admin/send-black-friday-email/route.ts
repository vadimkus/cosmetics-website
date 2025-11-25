import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { sendBlackFridayEmail } from '@/lib/email'
import { debugLog, errorLog } from '@/lib/logger'

const EXCLUDED_EMAILS = ['jeongmi.kim.korea@gmail.com']
const PREVIEW_EMAIL = 'f.this.that@gmail.com'
const BLOG_LINK = 'https://genosys.ae/blog/black-friday-sale-20-off'

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { action, previewEmail } = await request.json()

    // Preview mode - send to preview email only
    if (action === 'preview') {
      debugLog('📧 Sending Black Friday email preview to:', previewEmail || PREVIEW_EMAIL)
      
      const result = await sendBlackFridayEmail(
        previewEmail || PREVIEW_EMAIL,
        'Valued Customer',
        BLOG_LINK
      )

      if (!result.success) {
        errorLog('❌ Failed to send preview email:', result.error)
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Preview email sent successfully to ${previewEmail || PREVIEW_EMAIL}`,
        messageId: result.messageId
      })
    }

    // Send to all customers
    if (action === 'send') {
      debugLog('📧 Starting Black Friday email campaign...')

      // Get all users except excluded emails
      const users = await prisma.user.findMany({
        where: {
          email: {
            notIn: EXCLUDED_EMAILS
          }
        },
        select: {
          id: true,
          email: true,
          name: true
        }
      })

      debugLog(`📧 Found ${users.length} customers to email`)

      const results = {
        total: users.length,
        sent: 0,
        failed: 0,
        errors: [] as Array<{ email: string; error: string }>
      }

      // Send emails one by one (not in parallel to avoid rate limiting)
      for (const user of users) {
        try {
          const result = await sendBlackFridayEmail(
            user.email,
            user.name || 'Valued Customer',
            BLOG_LINK
          )

          if (result.success) {
            results.sent++
            debugLog(`✅ Sent to ${user.email}`)
          } else {
            results.failed++
            results.errors.push({ email: user.email, error: result.error || 'Unknown error' })
            errorLog(`❌ Failed to send to ${user.email}:`, result.error)
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          results.failed++
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          results.errors.push({ email: user.email, error: errorMessage })
          errorLog(`❌ Exception sending to ${user.email}:`, error)
        }
      }

      return NextResponse.json({
        success: true,
        message: `Campaign completed: ${results.sent} sent, ${results.failed} failed`,
        results
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "preview" or "send"' },
      { status: 400 }
    )

  } catch (error) {
    errorLog('❌ Error in Black Friday email campaign:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

