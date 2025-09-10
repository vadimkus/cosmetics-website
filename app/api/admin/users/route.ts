import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/userStorage'

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers()
    
    // Remove password field for security
    const safeUsers = users.map(user => ({
      ...user,
      password: undefined
    }))
    
    return NextResponse.json({
      success: true,
      users: safeUsers
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}