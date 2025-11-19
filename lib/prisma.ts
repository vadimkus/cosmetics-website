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
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

// Store on globalThis in all environments to prevent multiple instances
// This is especially important in serverless environments
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
  
  // Verify PasswordResetToken model is available at initialization
  // This helps catch issues early in serverless environments
  try {
    if (!('passwordResetToken' in prisma)) {
      errorLog('⚠️ WARNING: PasswordResetToken model not found in Prisma client at initialization')
      errorLog('⚠️ This may cause password reset feature to fail')
      errorLog('⚠️ Available models:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')).join(', '))
    } else {
      debugLog('✅ PasswordResetToken model verified in Prisma client at initialization')
    }
  } catch (initError) {
    errorLog('⚠️ Could not verify Prisma client models at initialization:', initError)
  }
}

// Test the connection (lazy - don't block initialization)
prisma.$connect().catch((error) => {
  errorLog('Failed to connect to database:', error)
})

// Set max listeners to prevent memory leak warning
process.setMaxListeners(15)
