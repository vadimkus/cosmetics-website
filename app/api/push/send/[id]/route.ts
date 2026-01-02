import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'

/**
 * DELETE /api/push/send/[id]
 * 
 * Delete a push notification (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notification ID required' },
        { status: 400 }
      )
    }

    // Check if notification exists
    const notification = await prisma.pWANotification.findUnique({
      where: { id }
    })

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }

    // Delete notification and related reads (cascade should handle this)
    await prisma.pWANotification.delete({
      where: { id }
    })

    debugLog('[PUSH_DELETE] Notification deleted:', id)

    return NextResponse.json({
      success: true,
      message: 'Notification deleted'
    })

  } catch (error) {
    errorLog('[PUSH_DELETE] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}

