import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from './database'
import { User, Prisma } from '@prisma/client'

export interface UserData {
  id?: string
  name: string
  email: string
  appleSub?: string | null
  contactEmail?: string | null
  password?: string | null
  phone?: string | null
  address?: string | null
  profilePicture?: string | null
  gender?: string | null
  billingAddress?: string | null
  vatNumber?: string | null
  expoPushToken?: string | null
  isAdmin?: boolean
  canSeePrices?: boolean
  discountType?: string | null
  discountPercentage?: number | null
  birthday?: string | null
  lastLoginAt?: string | null
  createdAt?: string
}

const normalizeEmail = (email: string): string => String(email || '').trim().toLowerCase()

// Get all users with pagination and limited fields
export const getAllUsers = async (limit: number = 100, offset: number = 0) => {
  try {
    return await prisma.user.findMany({
      // NOTE: Prisma client types in CI/Vercel may lag schema changes until prisma generate runs.
      // Cast to any to avoid build-time type failures when new optional columns are introduced.
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        profilePicture: true,
        gender: true,
        billingAddress: true,
        vatNumber: true,
        expoPushToken: true,
        isAdmin: true,
        canSeePrices: true,
        discountType: true,
        discountPercentage: true,
        birthday: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      } as any,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
  } catch {
    errorLog('Error fetching users:', error)
    return []
  }
}

// Add a new user
export const addUser = async (userData: UserData): Promise<User> => {
  try {
    const baseData = {
      name: userData.name,
      email: userData.email,
      appleSub: userData.appleSub || null,
      phone: userData.phone || null,
      address: userData.address || null,
      profilePicture: userData.profilePicture || null,
      isAdmin: userData.isAdmin || false,
      canSeePrices: userData.canSeePrices !== undefined ? userData.canSeePrices : true,
      discountType: userData.discountType || null,
      discountPercentage: userData.discountPercentage || null,
      birthday: userData.birthday || null,
      gender: userData.gender || null,
      billingAddress: userData.billingAddress || null,
      vatNumber: userData.vatNumber || null,
      expoPushToken: userData.expoPushToken || null,
    }
    
    const createData = {
      ...baseData,
      ...(userData.password !== undefined && userData.password !== null && { password: userData.password }),
    } as Prisma.UserCreateInput
    
    return await prisma.user.create({
      data: createData
    })
  } catch {
    errorLog('Error creating user:', error)
    throw error
  }
}

// Find user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const normalizedEmail = normalizeEmail(email)
    if (!normalizedEmail) return null

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<User | null>((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 10000) // 10 second timeout
    })

    const queryPromise = (async () => {
      // 1) Fast path: exact match on normalized email (works if DB stores normalized emails)
      const exact = await prisma.user.findUnique({ where: { email: normalizedEmail } })
      if (exact) return exact

      // 2) Case-insensitive match (best for existing mixed-case emails)
      try {
        const insensitive = await prisma.user.findFirst({
          where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
          orderBy: { createdAt: 'desc' },
        })
        if (insensitive) return insensitive
      } catch {
        // Some Prisma providers/versions might not support mode: 'insensitive' — fall through.
      }

      // 3) Raw SQL fallback (Postgres)
      try {
        const rows = await prisma.$queryRaw<User[]>`
          SELECT * FROM "users"
          WHERE LOWER(TRIM("email")) = LOWER(TRIM(${normalizedEmail}))
          ORDER BY "createdAt" DESC
          LIMIT 1
        `
        return rows?.[0] || null
      } catch {
        return null
      }
    })()

    return await Promise.race([queryPromise, timeoutPromise])
  } catch {
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
  } catch {
    errorLog('Error finding user by ID:', error)
    return null
  }
}

// Find user by Apple sub
export const findUserByAppleSub = async (appleSub: string): Promise<User | null> => {
  try {
    if (!appleSub) return null
    return await prisma.user.findUnique({
      where: { appleSub }
    })
  } catch {
    errorLog('Error finding user by Apple sub:', error)
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
    if (updates.appleSub !== undefined) {
      updateData.appleSub = updates.appleSub === '' ? null : updates.appleSub
    }
    if (updates.contactEmail !== undefined) {
      updateData.contactEmail = updates.contactEmail === '' ? null : updates.contactEmail
    }
    if (updates.phone !== undefined) {
      updateData.phone = updates.phone === '' ? null : updates.phone
    }
    if (updates.address !== undefined) {
      updateData.address = updates.address === '' ? null : updates.address
    }
    if (updates.billingAddress !== undefined) {
      ;(updateData as any).billingAddress = updates.billingAddress === '' ? null : updates.billingAddress
    }
    if (updates.vatNumber !== undefined) {
      ;(updateData as any).vatNumber = updates.vatNumber === '' ? null : updates.vatNumber
    }
    if (updates.expoPushToken !== undefined) {
      ;(updateData as any).expoPushToken = updates.expoPushToken === '' ? null : updates.expoPushToken
    }
    if (updates.gender !== undefined) {
      updateData.gender = updates.gender === '' ? null : updates.gender
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
    
    // Allow password updates (needed for password reset and password upgrades)
    if (updates.password !== undefined && updates.password !== null) {
      updateData.password = updates.password
    }
    
    // Update user
    const result = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })
    
    // If address is being updated, also update all existing orders for this user
    if (updates.address !== undefined && updates.address !== user.address) {
      debugLog('Address updated, updating existing orders for user:', user.email)
      const newAddress = updates.address === '' || updates.address === null ? '' : updates.address
      await prisma.order.updateMany({
        where: { customerEmail: user.email },
        data: { customerAddress: newAddress || '' }
      })
      debugLog('Updated existing orders with new address')
    }
    
    debugLog('User update result:', result)
    return true
  } catch {
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
  } catch {
    errorLog('Error deleting user:', error)
    return false
  }
}

// Anonymize user (account deletion that preserves orders and referential integrity)
export const anonymizeUser = async (userId: string): Promise<boolean> => {
  try {
    const deletedEmail = `deleted+${userId}@genosys.local`
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: deletedEmail,
        appleSub: null,
        name: 'Deleted User',
        password: null,
        phone: null,
        address: null,
        profilePicture: null,
        gender: null,
        billingAddress: null,
        vatNumber: null,
        expoPushToken: null,
        birthday: null,
        discountType: null,
        discountPercentage: null,
        lastLoginAt: null,
        isAdmin: false,
        canSeePrices: true,
      } as any
    })
    return true
  } catch {
    errorLog('Error anonymizing user:', error)
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
  } catch {
    errorLog('Error cleaning up duplicate users:', error)
  }
}

// Find or create user by email (for cross-device consistency)
export const findOrCreateUser = async (email: string, userData: Partial<UserData>): Promise<User> => {
  try {
    let user = await findUserByEmail(email)
    
    if (!user) {
      // Create new user
      const createUserData: UserData = {
        email,
        name: userData.name || '',
        ...userData
      }
      // Only set password if provided, otherwise leave it undefined (will be null in DB)
      if (userData.password !== undefined) {
        createUserData.password = userData.password
      }
      user = await addUser(createUserData)
    } else {
      // Update existing user with new data (but keep original creation date)
      const updateData: Prisma.UserUpdateInput = {
        updatedAt: new Date()
      }
      if (userData.name) updateData.name = userData.name
      if (userData.phone !== undefined) updateData.phone = userData.phone
      if (userData.address !== undefined) updateData.address = userData.address
      if (userData.profilePicture !== undefined) updateData.profilePicture = userData.profilePicture
      if (userData.gender !== undefined) updateData.gender = userData.gender
      if (userData.canSeePrices !== undefined) updateData.canSeePrices = userData.canSeePrices
      if (userData.discountType !== undefined) updateData.discountType = userData.discountType
      if (userData.discountPercentage !== undefined) updateData.discountPercentage = userData.discountPercentage
      if (userData.birthday !== undefined) updateData.birthday = userData.birthday
      
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData
      })
    }
    
    return user
  } catch {
    errorLog('Error finding or creating user:', error)
    throw error
  }
}
