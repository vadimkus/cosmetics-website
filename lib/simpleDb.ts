/**
 * Simple Database Connection for Migration
 * Uses a more reliable connection approach
 */

import { PrismaClient } from '@prisma/client'

// Create a single instance
let prisma: PrismaClient | null = null

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'minimal',
    })
  }
  return prisma
}

export async function testConnection(): Promise<boolean> {
  try {
    const client = getPrismaClient()
    await client.$connect()
    await client.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

export async function closeConnection(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect()
    prisma = null
  }
}

// Simple migration functions
export async function createUser(userData: {
  id: string
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
  createdAt: Date
}): Promise<boolean> {
  try {
    const client = getPrismaClient()
    await client.user.create({ data: userData })
    return true
  } catch (error) {
    console.error('Failed to create user:', error)
    return false
  }
}

export async function createProduct(productData: {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  inStock: boolean
  size?: string
}): Promise<boolean> {
  try {
    const client = getPrismaClient()
    await client.product.create({ data: productData })
    return true
  } catch (error) {
    console.error('Failed to create product:', error)
    return false
  }
}

export async function getUserCount(): Promise<number> {
  try {
    const client = getPrismaClient()
    return await client.user.count()
  } catch (error) {
    console.error('Failed to get user count:', error)
    return 0
  }
}

export async function getProductCount(): Promise<number> {
  try {
    const client = getPrismaClient()
    return await client.product.count()
  } catch (error) {
    console.error('Failed to get product count:', error)
    return 0
  }
}
