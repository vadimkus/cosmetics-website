import { debugLog, errorLog } from '@/lib/logger'
import { prisma } from './database'
import { User, Prisma } from '@prisma/client'
import { isMemberNumberCollision, newMemberFields } from '@/lib/membership'

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
  consignmentActive?: boolean
  creditActive?: boolean
  creditDays?: number | null
  partnerPortalAccess?: boolean
  moyskladCounterpartyId?: string | null
  moyskladContractId?: string | null
  birthday?: string | null
  lastLoginAt?: string | null
  lastLoginSource?: string | null // desktop_web, mobile_web, mobile_app
  createdAt?: string
  // Optional on the way in; addUser fills them when a caller leaves them out.
  memberNumber?: string | null
  memberSince?: string | Date | null
  memberTier?: string | null
}

const normalizeEmail = (email: string): string => String(email || '').trim().toLowerCase()

export const normalizeUserDiscountFields = (
  discountType?: string | null,
  discountPercentage?: number | null
) => {
  const type = typeof discountType === 'string' ? discountType.trim() : null
  const pct = Number(discountPercentage)

  if (!type || !Number.isFinite(pct) || pct <= 0 || pct >= 100) {
    return {
      discountType: null,
      discountPercentage: null,
    }
  }

  return {
    discountType: type,
    discountPercentage: pct,
  }
}

const sanitizeUserDiscount = <T extends { discountType?: string | null; discountPercentage?: number | null } | null>(user: T): T => {
  if (!user) return user
  return {
    ...user,
    ...normalizeUserDiscountFields(user.discountType ?? null, user.discountPercentage ?? null),
  }
}

// Get all users with pagination and limited fields
export const getAllUsers = async (limit: number = 100, offset: number = 0) => {
  try {
    const users = await prisma.user.findMany({
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })
    return users.map(user => sanitizeUserDiscount(user))
  } catch (error) {
    errorLog('Error fetching users:', error)
    return []
  }
}

// Add a new user
export const addUser = async (userData: UserData): Promise<User> => {
  // Every account gets a member number here, whichever route asked. The
  // number is read-then-write, so two sign-ups in the same instant can pick the
  // same value and the unique index rejects one; that is retried with a fresh
  // number rather than surfaced, since nothing about the account was wrong.
  const attempts = 3
  for (let attempt = 1; ; attempt++) {
    try {
      return await insertUser(userData)
    } catch (error) {
      if (isMemberNumberCollision(error) && !userData.memberNumber && attempt < attempts) {
        debugLog(`Member number collision on attempt ${attempt}, retrying`)
        continue
      }
      errorLog('Error creating user:', error)
      throw error
    }
  }
}

const insertUser = async (userData: UserData): Promise<User> => {
  const discountFields = normalizeUserDiscountFields(userData.discountType ?? null, userData.discountPercentage ?? null)
  const membership = userData.memberNumber
    ? {
        memberNumber: userData.memberNumber,
        memberSince: userData.memberSince ? new Date(userData.memberSince) : new Date(),
        memberTier: userData.memberTier || 'MEMBER',
      }
    : await newMemberFields(prisma)
  const baseData = {
    name: userData.name,
    email: userData.email,
    appleSub: userData.appleSub || null,
    phone: userData.phone || null,
    address: userData.address || null,
    profilePicture: userData.profilePicture || null,
    isAdmin: userData.isAdmin || false,
    canSeePrices: userData.canSeePrices !== undefined ? userData.canSeePrices : true,
    discountType: discountFields.discountType,
    discountPercentage: discountFields.discountPercentage,
    birthday: userData.birthday || null,
    gender: userData.gender || null,
    billingAddress: userData.billingAddress || null,
    vatNumber: userData.vatNumber || null,
    expoPushToken: userData.expoPushToken || null,
    lastLoginSource: userData.lastLoginSource || null,
    lastLoginAt: userData.lastLoginAt ? new Date(userData.lastLoginAt) : null,
    ...membership,
  }
  
  const createData = {
    ...baseData,
    ...(userData.password !== undefined && userData.password !== null && { password: userData.password }),
  } as Prisma.UserCreateInput
  
  return await prisma.user.create({
    data: createData
  })
}

// Find user by email (with retry for Neon cold starts)
export const findUserByEmail = async (email: string, maxRetries = 2): Promise<User | null> => {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<User | null>((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 10000) // 10 second timeout
      })

      const queryPromise = (async () => {
        // 1) Fast path: exact match on normalized email (works if DB stores normalized emails)
        const exact = await prisma.user.findUnique({ where: { email: normalizedEmail } })
        if (exact) return sanitizeUserDiscount(exact)

        // 2) Case-insensitive match (best for existing mixed-case emails)
        try {
          const insensitive = await prisma.user.findFirst({
            where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
            orderBy: { createdAt: 'desc' },
          })
          if (insensitive) return sanitizeUserDiscount(insensitive)
        } catch {
          // Some Prisma providers/versions might not support mode: 'insensitive' - fall through.
        }

        // 3) Raw SQL fallback (Postgres)
        try {
          const rows = await prisma.$queryRaw<User[]>`
            SELECT * FROM "users"
            WHERE LOWER(TRIM("email")) = LOWER(TRIM(${normalizedEmail}))
            ORDER BY "createdAt" DESC
            LIMIT 1
          `
          return sanitizeUserDiscount(rows?.[0] || null)
        } catch {
          return null
        }
      })()

      return await Promise.race([queryPromise, timeoutPromise])
    } catch (error) {
      const isTimeout = error instanceof Error && error.message === 'Database query timeout'
      if (isTimeout && attempt < maxRetries) {
        // Neon cold start - wait briefly and retry
        debugLog(`⏳ Database query timed out for ${email}, retrying (attempt ${attempt + 1}/${maxRetries})...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
        continue
      }
      errorLog('Error finding user by email:', error)
      if (isTimeout) {
        errorLog('⚠️ Database query timed out for email:', email)
      }
      return null
    }
  }
  return null
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

// Find user by Apple sub
export const findUserByAppleSub = async (appleSub: string): Promise<User | null> => {
  try {
    if (!appleSub) return null
    return await prisma.user.findUnique({
      where: { appleSub }
    })
  } catch (error) {
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
      updateData.billingAddress = updates.billingAddress === '' ? null : updates.billingAddress
    }
    if (updates.vatNumber !== undefined) {
      updateData.vatNumber = updates.vatNumber === '' ? null : updates.vatNumber
    }
    if (updates.expoPushToken !== undefined) {
      updateData.expoPushToken = updates.expoPushToken === '' ? null : updates.expoPushToken
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
    if (updates.consignmentActive !== undefined) updateData.consignmentActive = updates.consignmentActive
    if (updates.creditActive !== undefined) updateData.creditActive = updates.creditActive
    if (updates.creditDays !== undefined) updateData.creditDays = updates.creditDays
    if (updates.partnerPortalAccess !== undefined) updateData.partnerPortalAccess = updates.partnerPortalAccess
    if (updates.moyskladCounterpartyId !== undefined) {
      updateData.moyskladCounterpartyId = updates.moyskladCounterpartyId === '' ? null : updates.moyskladCounterpartyId
    }
    if (updates.moyskladContractId !== undefined) {
      updateData.moyskladContractId = updates.moyskladContractId === '' ? null : updates.moyskladContractId
    }
    if (updates.discountType !== undefined || updates.discountPercentage !== undefined) {
      const discountFields = normalizeUserDiscountFields(
        updates.discountType !== undefined ? updates.discountType : user.discountType,
        updates.discountPercentage !== undefined ? updates.discountPercentage : user.discountPercentage
      )
      updateData.discountType = discountFields.discountType
      updateData.discountPercentage = discountFields.discountPercentage
    }
    if (updates.lastLoginAt !== undefined) {
      updateData.lastLoginAt = updates.lastLoginAt ? new Date(updates.lastLoginAt) : null
    }
    if (updates.lastLoginSource !== undefined) {
      updateData.lastLoginSource = updates.lastLoginSource === '' ? null : updates.lastLoginSource
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
  } catch (error) {
    errorLog('Error updating user:', error)
    errorLog('Update data:', updates)
    errorLog('User ID:', userId)
    return false
  }
}

/**
 * Revoke all sessions/tokens for a user by bumping tokenVersion.
 * Every JWT (web session cookie + mobile token) embeds `tv`; validation
 * rejects tokens whose tv no longer matches. Call after password change,
 * password reset, or an explicit "log out everywhere".
 */
export const bumpTokenVersion = async (userId: string): Promise<boolean> => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    })
    debugLog('Token version bumped (all sessions revoked) for user:', userId)
    return true
  } catch (error) {
    errorLog('Error bumping token version:', error)
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

// Anonymize user (account deletion that preserves orders and referential integrity)
export const anonymizeUser = async (userId: string): Promise<boolean> => {
  try {
    const deletedEmail = `deleted+${userId}@genosys.local`
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: deletedEmail,
        contactEmail: null,
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
        // Revoke every live session/token for the deleted account
        tokenVersion: { increment: 1 },
      }
    })
    // Erasure must cover related PII too - saved addresses (name, phone,
    // street address) and PWA push subscriptions belong to the person.
    await prisma.address.deleteMany({ where: { userId } })
    await prisma.pushSubscription.deleteMany({ where: { userId } })
    return true
  } catch (error) {
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
  } catch (error) {
    errorLog('Error finding or creating user:', error)
    throw error
  }
}
