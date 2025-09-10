import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/databaseService'

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would verify admin authentication here
    // For now, we'll allow access to this endpoint
    
    const users = await UserService.getAllUsers()
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json({
      success: true,
      users: usersWithoutPasswords
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
