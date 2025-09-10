import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/databaseService'

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if user exists and delete using Prisma
    try {
      await UserService.delete(userId)
      return NextResponse.json({
        success: true,
        message: 'Account deleted successfully'
      })
    } catch (error) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
