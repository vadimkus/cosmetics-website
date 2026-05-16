import { errorLog, debugLog } from '@/lib/logger'
import { PrismaClient } from '@prisma/client'
import type { Pool } from 'pg'

// Extended global type for Prisma singleton and pg pool reference
interface GlobalWithPrisma {
  prisma: PrismaClient | undefined
  directPrisma?: PrismaClient
  pgPool?: Pool
  directPgPool?: Pool
  prismaShutdownRegistered?: boolean
  prismaShutdownPromise?: Promise<void>
}

const globalForPrisma = globalThis as unknown as GlobalWithPrisma

// Ensure DATABASE_URL is set
const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL or PRISMA_DATABASE_URL environment variable is required. ' +
    'Please set it in your .env.local file.'
  )
}
const runtimeDatabaseUrl = databaseUrl

function isDirectPostgresUrl(url: string | undefined): url is string {
  return Boolean(url && /^(postgres|postgresql):\/\//.test(url))
}

function createPooledPrismaClient(connectionString: string, maxConnections: number): {
  client: PrismaClient
  pool: Pool
} {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')

  const pool: Pool = new Pool({
    connectionString,
    max: maxConnections,
    min: 0,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    maxUses: 7500,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  })

  pool.on('error', (err: Error) => {
    errorLog('❌ Unexpected error on idle PostgreSQL client:', err.message)
  })

  return {
    client: new PrismaClient({
      adapter: new PrismaPg(pool),
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    }),
    pool,
  }
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
      const isAccelerate = runtimeDatabaseUrl.startsWith('prisma+')
      
      if (isAccelerate) {
        // Prisma Accelerate - includes built-in connection pooling and caching
        // No manual pool configuration needed - Accelerate handles this
        prismaInstance = new PrismaClient({
          accelerateUrl: runtimeDatabaseUrl,
          log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
        })
        debugLog('✅ Created new Prisma client instance with Prisma Accelerate')
        debugLog('   Connection pooling: Managed by Prisma Accelerate')
      } else {
        // Regular PostgreSQL connection - use adapter with proper pooling
        const { client, pool } = createPooledPrismaClient(runtimeDatabaseUrl, 5)
        prismaInstance = client
        globalForPrisma.pgPool = pool
        
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

/**
 * Direct Postgres fallback for read-only hot paths when Prisma Accelerate is
 * unavailable or returns platform-level Cloudflare/worker failures.
 */
export function getDirectPrismaClient(): PrismaClient | null {
  if (!runtimeDatabaseUrl.startsWith('prisma+')) return prisma
  if (globalForPrisma.directPrisma) return globalForPrisma.directPrisma

  const directDatabaseUrl = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL_NON_POOLING,
  ].find(isDirectPostgresUrl)

  if (!directDatabaseUrl) {
    errorLog('❌ Direct Prisma fallback unavailable: no direct Postgres URL configured')
    return null
  }

  const { client, pool } = createPooledPrismaClient(directDatabaseUrl, 2)
  globalForPrisma.directPrisma = client
  globalForPrisma.directPgPool = pool
  debugLog('✅ Created direct Prisma fallback client')
  return client
}

// Verify PasswordResetToken model is available at initialization
// This helps catch issues early in serverless environments
try {
  // Runtime check for passwordResetToken model
  const hasPasswordResetToken = 'passwordResetToken' in prisma
  // Cast through unknown for runtime inspection
  const prismaObj = prisma as unknown as Record<string, unknown>
  
  if (!hasPasswordResetToken) {
    errorLog('❌ CRITICAL: PasswordResetToken model not found in Prisma client at initialization')
    errorLog('❌ This WILL cause password reset feature to fail')
    const availableModels = Object.keys(prismaObj).filter(k => !k.startsWith('$') && !k.startsWith('_'))
    errorLog('❌ Available Prisma models:', availableModels.join(', '))
    errorLog('❌ Prisma client type:', typeof prisma)
    errorLog('❌ Prisma client constructor:', prisma.constructor?.name)
  } else {
    debugLog('✅ PasswordResetToken model verified in Prisma client at initialization')
    // Try to access it to ensure it's actually callable
    if (typeof prismaObj.passwordResetToken !== 'object') {
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

// NOTE: we deliberately do NOT call `prisma.$connect()` here.
//
// Why:
// 1. On Prisma Accelerate (prisma+postgres://, HTTP transport) there is no
//    persistent connection to pre-warm — every query is its own HTTP round
//    trip. `$connect()` is a no-op in practical terms.
// 2. When the Accelerate endpoint's initial fetch hiccups (cold start, DNS
//    blip, upstream 5xx), the reject splits into two: one through the normal
//    promise chain (handled), and one leaked out of undici's internal stream
//    pipeline that Node then emits as `unhandledRejection`. Sentry captured
//    that secondary rejection as JAVASCRIPT-NEXTJS-7 on 2026-04-22 —
//    a boot-time fetch that had zero functional value and cannot be caught
//    by our own `.catch()` handler.
// 3. On the pg adapter path, the pool lazy-connects on first query anyway.
//
// `lib/prismaRetry.ts` already retries `fetch failed` at the query site, which
// is where a transient failure actually matters. Dropping this boot-time ping
// removes a class of unhandled rejections on cold start without changing
// runtime behaviour.

// Set max listeners to prevent memory leak warning
process.setMaxListeners(15)

// Graceful shutdown handlers for serverless environments
// These ensure connections are properly closed when the process terminates
if (typeof process !== 'undefined') {
  const gracefulShutdown = async () => {
    if (globalForPrisma.prismaShutdownPromise) {
      return globalForPrisma.prismaShutdownPromise
    }

    globalForPrisma.prismaShutdownPromise = (async () => {
      debugLog('🔄 Gracefully disconnecting Prisma client...')
      await prisma.$disconnect()
      await globalForPrisma.directPrisma?.$disconnect()
      if (globalForPrisma.directPgPool && !globalForPrisma.directPgPool.ended) {
        await globalForPrisma.directPgPool.end()
      }
      debugLog('✅ Prisma client disconnected')
    })()

    return globalForPrisma.prismaShutdownPromise
  }

  if (!globalForPrisma.prismaShutdownRegistered) {
    globalForPrisma.prismaShutdownRegistered = true
    process.once('SIGINT', gracefulShutdown)
    process.once('SIGTERM', gracefulShutdown)
  }
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
    const pool = globalForPrisma.pgPool
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
