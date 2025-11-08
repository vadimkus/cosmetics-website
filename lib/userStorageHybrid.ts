import { debugLog, errorLog } from '@/lib/logger'
import { addUser as addUserDb, findUserByEmail as findUserByEmailDb } from './userStorageDb'
import { addUser as addUserFile, findUserByEmail as findUserByEmailFile } from './userStorage'
import { User } from '@/types/user'

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

// Try database first, fallback to file storage
export const addUser = async (userData: UserData) => {
  try {
    // Try database first
    debugLog('🔄 Attempting to add user to database...')
    const user = await addUserDb(userData)
    debugLog('✅ User added to database successfully')
    return user
  } catch (dbError) {
    errorLog('❌ Database error, falling back to file storage:', dbError)
    try {
      // Fallback to file storage
      debugLog('🔄 Adding user to file storage...')
      const userToAdd: User = {
        id: userData.id || Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || null,
        address: userData.address || null,
        profilePicture: userData.profilePicture || null,
        isAdmin: userData.isAdmin || false,
        canSeePrices: userData.canSeePrices ?? true,
        discountType: userData.discountType || null,
        discountPercentage: userData.discountPercentage || null,
        birthday: userData.birthday || null,
        createdAt: userData.createdAt || new Date().toISOString()
      }
      addUserFile(userToAdd)
      debugLog('✅ User added to file storage successfully')
      return userToAdd
    } catch (fileError) {
      errorLog('❌ File storage error:', fileError)
      throw new Error('Failed to create user in both database and file storage')
    }
  }
}

// Try database first, fallback to file storage
export const findUserByEmail = async (email: string) => {
  try {
    // Try database first
    debugLog('🔄 Searching for user in database...')
    const user = await findUserByEmailDb(email)
    if (user) {
      debugLog('✅ User found in database')
      return user
    }
  } catch (dbError) {
    errorLog('❌ Database error, falling back to file storage:', dbError)
  }
  
  try {
    // Fallback to file storage
    debugLog('🔄 Searching for user in file storage...')
    const user = findUserByEmailFile(email)
    if (user) {
      debugLog('✅ User found in file storage')
      return user
    }
  } catch (fileError) {
    errorLog('❌ File storage error:', fileError)
  }
  
  debugLog('❌ User not found in either storage')
  return null
}
