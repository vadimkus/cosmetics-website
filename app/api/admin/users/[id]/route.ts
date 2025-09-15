import { NextRequest, NextResponse } from 'next/server'
import { updateUser, deleteUser } from '@/lib/userStorageDb'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    const { canSeePrices, discountType, discountPercentage, name, email, phone, address, birthday, profilePicture } = updates

    if (canSeePrices !== undefined && typeof canSeePrices !== 'boolean') {
      return NextResponse.json(
        { error: 'canSeePrices must be a boolean' },
        { status: 400 }
      )
    }

    if (discountType !== undefined && !['CLINIC', 'VIP', null].includes(discountType)) {
      return NextResponse.json(
        { error: 'discountType must be CLINIC, VIP, or null' },
        { status: 400 }
      )
    }

    if (discountPercentage !== undefined && discountPercentage !== null && (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 100)) {
      return NextResponse.json(
        { error: 'discountPercentage must be a number between 0 and 100' },
        { status: 400 }
      )
    }

    // Update user in database
    const success = updateUser(id, updates)
    
    if (!success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete user from database
    const success = deleteUser(id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}