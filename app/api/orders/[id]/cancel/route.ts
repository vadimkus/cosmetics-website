import { NextRequest, NextResponse } from 'next/server'
import { updateOrderStatus } from '@/lib/orderStorageDb'
import { errorLog } from '@/lib/logger'
import { requireCsrfToken } from '@/lib/csrf'
import { reverseRedemptionForOrder } from '@/lib/loyalty'
import { restoreClinicPointsRedemptionForOrder } from '@/lib/homecare'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { id } = await params

    // Update order status to cancelled
    const success = await updateOrderStatus(id, 'CANCELLED')

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Return any redeemed loyalty points (idempotent, no-op if none)
    try {
      await reverseRedemptionForOrder(id)
    } catch (loyaltyError) {
      errorLog('❌ Loyalty redemption reversal failed on cancel:', loyaltyError)
    }
    try {
      await restoreClinicPointsRedemptionForOrder(id)
    } catch (clinicPointsError) {
      errorLog('❌ Clinic Points redemption restore failed on cancel:', clinicPointsError)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order cancelled successfully'
    })
  } catch (error) {
    errorLog('Error cancelling order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}