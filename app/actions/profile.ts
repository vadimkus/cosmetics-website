'use server'

/**
 * Server Actions for Profile Management
 * 
 * Server Actions provide a simpler, more type-safe way to handle
 * form submissions without creating separate API routes.
 * 
 * Benefits over API routes:
 * - Automatic CSRF protection
 * - Progressive enhancement (works without JS)
 * - Type-safe from form to server
 * - Less boilerplate
 * 
 * MIGRATION NOTE: These actions complement existing API routes.
 * The /api/profile/* routes are kept for the mobile app.
 * Web forms can gradually migrate to use these Server Actions.
 */

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { verifySessionToken } from '@/lib/jwt'
import { addressSchema, type AddressInput } from '@/lib/validation/schemas'

/**
 * Get the current authenticated user from session cookie
 */
async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('genosys_session')
  if (!sessionCookie?.value) return null
  return verifySessionToken(sessionCookie.value)
}

/**
 * Update user profile
 * Can be called from a form action or useActionState
 */
export async function updateProfileAction(
  _prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Not authenticated. Please log in.' }
    }

    const name = formData.get('name') as string
    const phone = formData.get('phone') as string

    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Name is required' }
    }

    // Import Prisma dynamically to keep this module lightweight
    const { prisma } = await import('@/lib/prisma')
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
      },
    })

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update profile'
    return { success: false, error: message }
  }
}

/**
 * Add a new address
 */
export async function addAddressAction(
  _prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Not authenticated. Please log in.' }
    }

    const rawData: Record<string, unknown> = {}
    formData.forEach((value, key) => {
      rawData[key] = value
    })
    
    // Handle boolean
    rawData.isDefault = formData.get('isDefault') === 'true'

    const validation = addressSchema.safeParse(rawData)
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || 'Invalid address' }
    }

    const data = validation.data

    const { prisma } = await import('@/lib/prisma')

    // If setting as default, unset other defaults first
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      })
    }

    await prisma.address.create({
      data: {
        userId: user.id,
        type: data.type,
        label: data.label,
        name: data.name,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || '',
        city: data.city,
        emirate: data.emirate,
        country: data.country,
        isDefault: data.isDefault,
      },
    })

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to add address'
    return { success: false, error: message }
  }
}

/**
 * Delete an address
 */
export async function deleteAddressAction(addressId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { prisma } = await import('@/lib/prisma')
    
    // Verify the address belongs to the user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id },
    })

    if (!address) {
      return { success: false, error: 'Address not found' }
    }

    await prisma.address.delete({ where: { id: addressId } })

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete address'
    return { success: false, error: message }
  }
}
