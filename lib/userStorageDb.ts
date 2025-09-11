import { prisma } from './database'
import { User } from '../lib/generated/prisma'

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
  createdAt?: string
}

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
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
        canSeePrices: userData.canSeePrices || false,
        discountType: userData.discountType || null,
        discountPercentage: userData.discountPercentage || null,
        birthday: userData.birthday || null,
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({
      where: { email }
    })
  } catch (error) {
    console.error('Error finding user by email:', error)
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
    console.error('Error finding user by ID:', error)
    return null
  }
}

// Update user
export const updateUser = async (userId: string, updates: Partial<UserData>): Promise<boolean> => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...updates,
        updatedAt: new Date()
      }
    })
    return true
  } catch (error) {
    console.error('Error updating user:', error)
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
    console.error('Error deleting user:', error)
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
    
    console.log(`Cleaned up ${usersToDelete.length} duplicate users`)
  } catch (error) {
    console.error('Error cleaning up duplicate users:', error)
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
    console.error('Error finding or creating user:', error)
    throw error
  }
}
