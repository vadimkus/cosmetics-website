import { NextRequest, NextResponse } from 'next/server'
import { deleteUser } from '@/lib/userStorageDb'
import { handleApiError, handleValidationError, handleNotFoundError } from '@/lib/apiErrorHandler'

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return handleValidationError({ userId: ['User ID is required'] })
    }

    // Delete user from database
    const success = await deleteUser(userId)
    
    if (!success) {
      return handleNotFoundError('User')
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    return handleApiError(error, 'PROFILE_DELETE')
  }
}
