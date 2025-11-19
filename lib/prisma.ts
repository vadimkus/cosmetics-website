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
  prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  })
  globalForPrisma.prisma = prismaInstance
  debugLog('✅ Created new Prisma client instance')
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
    errorLog('❌ Prisma client constructor:', prisma.constructor?.name)
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
prisma.$connect().catch((error) => {
  errorLog('Failed to connect to database:', error)
})

// Set max listeners to prevent memory leak warning
process.setMaxListeners(15)
