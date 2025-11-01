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

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test the connection
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error)
})

// Set max listeners to prevent memory leak warning
process.setMaxListeners(15)
