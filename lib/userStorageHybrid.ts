import { addUser as addUserDb, findUserByEmail as findUserByEmailDb } from './userStorageDb'
import { addUser as addUserFile, findUserByEmail as findUserByEmailFile } from './userStorage'

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
    console.log('🔄 Attempting to add user to database...')
    const user = await addUserDb(userData)
    console.log('✅ User added to database successfully')
    return user
  } catch (dbError) {
    console.error('❌ Database error, falling back to file storage:', dbError)
    try {
      // Fallback to file storage
      console.log('🔄 Adding user to file storage...')
      const user = addUserFile(userData)
      console.log('✅ User added to file storage successfully')
      return user
    } catch (fileError) {
      console.error('❌ File storage error:', fileError)
      throw new Error('Failed to create user in both database and file storage')
    }
  }
}

// Try database first, fallback to file storage
export const findUserByEmail = async (email: string) => {
  try {
    // Try database first
    console.log('🔄 Searching for user in database...')
    const user = await findUserByEmailDb(email)
    if (user) {
      console.log('✅ User found in database')
      return user
    }
  } catch (dbError) {
    console.error('❌ Database error, falling back to file storage:', dbError)
  }
  
  try {
    // Fallback to file storage
    console.log('🔄 Searching for user in file storage...')
    const user = findUserByEmailFile(email)
    if (user) {
      console.log('✅ User found in file storage')
      return user
    }
  } catch (fileError) {
    console.error('❌ File storage error:', fileError)
  }
  
  console.log('❌ User not found in either storage')
  return null
}
