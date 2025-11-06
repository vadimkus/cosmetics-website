import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from './database'
import { User, Prisma } from '@prisma/client'

export interface UserData {
  id?: string
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  profilePicture?: string
  isAdmin?: boolean
  canSeePrices?: boolean
  discountType?: string | null
  discountPercentage?: number | null
  birthday?: string
  lastLoginAt?: string
  createdAt?: string
}

// Get all users with pagination and limited fields
export const getAllUsers = async (limit: number = 100, offset: number = 0) => {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        profilePicture: true,
        isAdmin: true,
        canSeePrices: true,
        discountType: true,
        discountPercentage: true,
        birthday: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  } catch (error) {
    errorLog('Error fetching users:', error)
    return []
  }
}

// Add a new user
export const addUser = async (userData: UserData): Promise<User> => {
  try {
    return await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || null,
        address: userData.address || null,
        profilePicture: userData.profilePicture || null,
        isAdmin: userData.isAdmin || false,
        canSeePrices: userData.canSeePrices !== undefined ? userData.canSeePrices : true,
        discountType: userData.discountType || null,
        discountPercentage: userData.discountPercentage || null,
        birthday: userData.birthday || null,
      }
    })
  } catch (error) {
    errorLog('Error creating user:', error)
    throw error
  }
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<User | null>((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 10000) // 10 second timeout
    })
    
    const queryPromise = prisma.user.findUnique({
      where: { email }
    })
    
    return await Promise.race([queryPromise, timeoutPromise])
  } catch (error) {
    errorLog('Error finding user by email:', error)
    if (error instanceof Error && error.message === 'Database query timeout') {
      errorLog('⚠️ Database query timed out for email:', email)
    }
    return null
  }
}

// Find user by ID
export const findUserById = async (id: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({
      where: { id }
    })
  } catch (error) {
    errorLog('Error finding user by ID:', error)
    return null
  }
}

// Update user
export const updateUser = async (userId: string, updates: Partial<UserData>): Promise<boolean> => {
  try {
    debugLog('Updating user in database:', { userId, updates })
    
    // Validate userId format (should be a non-empty string)
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      errorLog('Invalid userId provided:', userId)
      return false
    }
    
    // First, get the user to check if address is being updated
    const user = await prisma.user.findUnique({
      where: { id: userId.trim() }
    })
    
    if (!user) {
      errorLog('User not found for userId:', userId)
      // Try to find by email if provided in updates (for debugging)
      if (updates.email) {
        const userByEmail = await prisma.user.findUnique({
          where: { email: updates.email }
        })
        if (userByEmail) {
          errorLog('User found by email but ID mismatch:', {
            providedId: userId,
            actualId: userByEmail.id,
            email: updates.email
          })
        }
      }
      return false
    }
    
    debugLog('User found:', { id: user.id, email: user.email, name: user.name })
    
    // Build update data object, only including fields that are actually being updated
    // Convert empty strings to null for optional fields (Prisma accepts null for optional fields)
    const updateData: Prisma.UserUpdateInput = {
      updatedAt: new Date()
    }
    
    // Only include fields that are explicitly provided and not undefined
    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.email !== undefined) updateData.email = updates.email
    if (updates.phone !== undefined) {
      updateData.phone = updates.phone === '' ? null : updates.phone
    }
    if (updates.address !== undefined) {
      updateData.address = updates.address === '' ? null : updates.address
    }
    if (updates.birthday !== undefined) {
      updateData.birthday = updates.birthday === '' ? null : updates.birthday
    }
    if (updates.profilePicture !== undefined) {
      updateData.profilePicture = updates.profilePicture === '' ? null : updates.profilePicture
    }
    if (updates.isAdmin !== undefined) updateData.isAdmin = updates.isAdmin
    if (updates.canSeePrices !== undefined) updateData.canSeePrices = updates.canSeePrices
    if (updates.discountType !== undefined) {
      updateData.discountType = updates.discountType === '' ? null : updates.discountType
    }
    if (updates.discountPercentage !== undefined) {
      updateData.discountPercentage = (updates.discountPercentage === 0 || updates.discountPercentage === null) ? null : updates.discountPercentage
    }
    if (updates.lastLoginAt !== undefined) {
      updateData.lastLoginAt = updates.lastLoginAt ? new Date(updates.lastLoginAt) : null
    }
    
    // Don't allow password updates through this function (use separate function if needed)
    // if (updates.password !== undefined) updateData.password = updates.password
    
    // Update user
    const result = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })
    
    // If address is being updated, also update all existing orders for this user
    if (updates.address !== undefined && updates.address !== user.address) {
      debugLog('Address updated, updating existing orders for user:', user.email)
      const newAddress = updates.address === '' ? '' : updates.address
      await prisma.order.updateMany({
        where: { customerEmail: user.email },
        data: { customerAddress: newAddress }
      })
      debugLog('Updated existing orders with new address')
    }
    
    debugLog('User update result:', result)
    return true
  } catch (error) {
    errorLog('Error updating user:', error)
    errorLog('Update data:', updates)
    errorLog('User ID:', userId)
    return false
  }
}

// Delete user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await prisma.user.delete({
      where: { id: userId }
    })
    return true
  } catch (error) {
    errorLog('Error deleting user:', error)
    return false
  }
}

// Clean up duplicate users by email (keep the most recent one)
export const cleanupDuplicateUsers = async (): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    const uniqueUsers = new Map<string, User>()
    
    // Process users and keep the most recent one for each email
    users.forEach(user => {
      const existingUser = uniqueUsers.get(user.email)
      if (!existingUser || user.createdAt > existingUser.createdAt) {
        uniqueUsers.set(user.email, user)
      }
    })
    
    // Delete duplicates
    const usersToDelete = users.filter(user => 
      uniqueUsers.get(user.email)?.id !== user.id
    )
    
    for (const user of usersToDelete) {
      await prisma.user.delete({
        where: { id: user.id }
      })
    }
    
    debugLog(`Cleaned up ${usersToDelete.length} duplicate users`)
  } catch (error) {
    errorLog('Error cleaning up duplicate users:', error)
  }
}

// Find or create user by email (for cross-device consistency)
export const findOrCreateUser = async (email: string, userData: Partial<UserData>): Promise<User> => {
  try {
    let user = await findUserByEmail(email)
    
    if (!user) {
      // Create new user
      user = await addUser({
        email,
        name: userData.name || '',
        password: userData.password || '',
        ...userData
      })
    } else {
      // Update existing user with new data (but keep original creation date)
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          ...userData,
          updatedAt: new Date()
        }
      })
    }
    
    return user
  } catch (error) {
    errorLog('Error finding or creating user:', error)
    throw error
  }
}
