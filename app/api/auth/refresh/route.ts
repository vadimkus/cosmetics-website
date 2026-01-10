import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { handleApiError, handleValidationError, handleNotFoundError } from '@/lib/apiErrorHandler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body
    
    if (!email || typeof email !== 'string') {
      return handleValidationError({ email: ['Email is required'] })
    }

    const user = await findUserByEmail(email)
    
    if (!user) {
      // User not found - return 404 but don't log as error (can happen during development)
      return handleNotFoundError('User')
    }

    // Return user data without password
    const { password: __, ...userWithoutPassword } = user
    
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword 
    })
  } catch (error) {
    // Handle JSON parse errors specifically
    if (error instanceof SyntaxError) {
      return handleValidationError({ body: ['Invalid request body'] })
    }
    return handleApiError(error, 'AUTH_REFRESH')
  }
}
