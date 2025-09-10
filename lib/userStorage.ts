import fs from 'fs'
import path from 'path'

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(USERS_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read users from file
export const readUsers = (): any[] => {
  try {
    ensureDataDirectory()
    if (!fs.existsSync(USERS_FILE)) {
      // Create initial users file with demo user and admin
      const initialUsers = [
        {
          id: 'demo-user-1',
          name: 'Demo User',
          email: 'demo@genosys.ae',
          password: 'demo123',
          phone: '+971 50 123 4567',
          address: 'Dubai, UAE',
          createdAt: new Date().toISOString(),
          isAdmin: false,
          canSeePrices: true
        },
        {
          id: 'admin-user-1',
          name: 'Admin User',
          email: 'admin@genosys.ae',
          password: 'admin5',
          phone: '+971 50 000 0000',
          address: 'Dubai, UAE',
          createdAt: new Date().toISOString(),
          isAdmin: true,
          canSeePrices: true
        }
      ]
      writeUsers(initialUsers)
      return initialUsers
    }
    
    const data = fs.readFileSync(USERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading users:', error)
    return []
  }
}

// Write users to file
export const writeUsers = (users: any[]): void => {
  try {
    ensureDataDirectory()
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error writing users:', error)
  }
}

// Add a new user
export const addUser = (user: any): void => {
  const users = readUsers()
  users.push(user)
  writeUsers(users)
}

// Find user by email
export const findUserByEmail = (email: string): any | null => {
  const users = readUsers()
  return users.find(u => u.email === email) || null
}

// Find user by ID
export const findUserById = (id: string): any | null => {
  const users = readUsers()
  return users.find(u => u.id === id) || null
}

// Update user
export const updateUser = (userId: string, updates: any): boolean => {
  const users = readUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    return false
  }
  
  users[userIndex] = { ...users[userIndex], ...updates }
  writeUsers(users)
  return true
}

// Delete user
export const deleteUser = (userId: string): boolean => {
  const users = readUsers()
  const userIndex = users.findIndex(u => u.id === userId)
  
  if (userIndex === -1) {
    return false
  }
  
  // Remove the user from the array
  users.splice(userIndex, 1)
  writeUsers(users)
  return true
}

// Clean up duplicate users by email (keep the most recent one)
export const cleanupDuplicateUsers = (): void => {
  const users = readUsers()
  const uniqueUsers = new Map()
  
  // Process users and keep the most recent one for each email
  users.forEach(user => {
    const existingUser = uniqueUsers.get(user.email)
    if (!existingUser || new Date(user.createdAt) > new Date(existingUser.createdAt)) {
      uniqueUsers.set(user.email, user)
    }
  })
  
  const cleanedUsers = Array.from(uniqueUsers.values())
  writeUsers(cleanedUsers)
}

// Find or create user by email (for cross-device consistency)
export const findOrCreateUser = (email: string, userData: any): any => {
  const users = readUsers()
  let user = users.find(u => u.email === email)
  
  if (!user) {
    // Create new user
    user = {
      id: Date.now().toString(),
      email,
      ...userData,
      createdAt: new Date().toISOString()
    }
    addUser(user)
  } else {
    // Update existing user with new data (but keep original creation date)
    const updatedUser = {
      ...user,
      ...userData,
      createdAt: user.createdAt // Keep original creation date
    }
    updateUser(user.id, userData)
    user = updatedUser
  }
  
  return user
}
