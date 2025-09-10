import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { canSeePrices, discountType, discountPercentage } = await request.json()

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

    // Since we're not using database, just return success
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

    // Since we're not using database, just return success
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