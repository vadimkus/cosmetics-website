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
        // Prisma Accelerate - includes built-in connection pooling and caching
        // No manual pool configuration needed - Accelerate handles this
        prismaInstance = new PrismaClient({
          accelerateUrl: databaseUrl,
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
        })
        debugLog('✅ Created new Prisma client instance with Prisma Accelerate')
        debugLog('   Connection pooling: Managed by Prisma Accelerate')
      } else {
        // Regular PostgreSQL connection - use adapter with proper pooling
        const { PrismaPg } = require('@prisma/adapter-pg')
        const { Pool } = require('pg')
        
        // Pool configuration optimized for serverless environments (Vercel)
        // These settings help prevent connection exhaustion and timeouts
        const pool = new Pool({ 
          connectionString: databaseUrl,
          // Connection pool settings for serverless
          max: 5, // Maximum connections in the pool (serverless needs fewer)
          min: 0, // Minimum connections (0 allows full scale-down)
          idleTimeoutMillis: 10000, // Close idle connections after 10s (serverless functions have short lifespans)
          connectionTimeoutMillis: 5000, // Fail fast if can't connect in 5s
          maxUses: 7500, // Recycle connections after 7500 uses (prevents stale connections)
          // SSL configuration for Vercel Postgres
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        })
        
        // Handle pool errors gracefully
        pool.on('error', (err: Error) => {
          errorLog('❌ Unexpected error on idle PostgreSQL client:', err.message)
        })
        
        const adapter = new PrismaPg(pool)
        prismaInstance = new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
        })
        
        debugLog('✅ Created new Prisma client instance with connection pooling')
        debugLog(`   Pool config: max=${5}, min=${0}, idleTimeout=${10000}ms`)
      }
    } catch (error) {
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

// Graceful shutdown handlers for serverless environments
// These ensure connections are properly closed when the process terminates
if (typeof process !== 'undefined') {
  const gracefulShutdown = async () => {
    debugLog('🔄 Gracefully disconnecting Prisma client...')
    await prisma.$disconnect()
    debugLog('✅ Prisma client disconnected')
  }

  // Handle various termination signals
  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
  process.on('beforeExit', gracefulShutdown)
}

/**
 * Get connection pool statistics (for monitoring)
 * Only available for non-Accelerate connections
 */
export async function getPoolStats(): Promise<{
  totalCount: number
  idleCount: number
  waitingCount: number
} | null> {
  try {
    const pool = (globalForPrisma as any).pgPool
    if (pool) {
      return {
        totalCount: pool.totalCount || 0,
        idleCount: pool.idleCount || 0,
        waitingCount: pool.waitingCount || 0
      }
    }
    return null
  } catch {
    return null
  }
}
