import { errorLog, debugLog } from '@/lib/logger'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is set
const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL or PRISMA_DATABASE_URL environment variable is required. ' +
    'Please set it in your .env.local file.'
  )
}

// Initialize Prisma client with lazy connection
// In serverless, ensure we always get a fresh instance if needed
let prismaInstance: PrismaClient

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma
  debugLog('✅ Using existing Prisma client from globalThis')
} else {
  // Only initialize server-side
  if (typeof window === 'undefined') {
    try {
      // Check if using Prisma Accelerate (prisma+postgres://) - use accelerateUrl
      const isAccelerate = databaseUrl.startsWith('prisma+')
      
      if (isAccelerate) {
        // Prisma Accelerate - pass accelerateUrl explicitly
        prismaInstance = new PrismaClient({
          accelerateUrl: databaseUrl,
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
        })
        debugLog('✅ Created new Prisma client instance with Prisma Accelerate')
      } else {
        // Regular PostgreSQL connection - use adapter
        const { PrismaPg } = require('@prisma/adapter-pg')
        const { Pool } = require('pg')
        const pool = new Pool({ connectionString: databaseUrl })
        const adapter = new PrismaPg(pool)
        prismaInstance = new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
        })
        debugLog('✅ Created new Prisma client instance with adapter')
      }
    } catch {
      errorLog('❌ Failed to initialize Prisma client:', error)
      errorLog('❌ Error details:', error instanceof Error ? error.message : String(error))
      throw error
    }
  } else {
    // Fallback for client-side (should never happen, but TypeScript needs this)
    throw new Error('PrismaClient cannot be initialized on the client side')
  }
  globalForPrisma.prisma = prismaInstance
}

export const prisma = prismaInstance

// Verify PasswordResetToken model is available at initialization
// This helps catch issues early in serverless environments
try {
  if (!('passwordResetToken' in prisma)) {
    errorLog('❌ CRITICAL: PasswordResetToken model not found in Prisma client at initialization')
    errorLog('❌ This WILL cause password reset feature to fail')
    const availableModels = Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_'))
    errorLog('❌ Available Prisma models:', availableModels.join(', '))
    errorLog('❌ Prisma client type:', typeof prisma)
    errorLog('❌ Prisma client constructor:', (prisma as any).constructor?.name)
  } else {
    debugLog('✅ PasswordResetToken model verified in Prisma client at initialization')
    // Try to access it to ensure it's actually callable
    if (typeof (prisma as any).passwordResetToken !== 'object') {
      errorLog('❌ CRITICAL: passwordResetToken exists but is not an object')
    } else {
      debugLog('✅ PasswordResetToken model is properly initialized and callable')
    }
  }
} catch (initError) {
  errorLog('❌ CRITICAL: Could not verify Prisma client models at initialization:', initError)
  if (initError instanceof Error) {
    errorLog('❌ Error stack:', initError.stack)
  }
}

// Test the connection (lazy - don't block initialization)
prisma.$connect().catch((error: unknown) => {
  errorLog('Failed to connect to database:', error)
})

// Set max listeners to prevent memory leak warning
process.setMaxListeners(15)
