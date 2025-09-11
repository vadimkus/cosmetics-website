import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Test the connection
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error)
})

// Set max listeners to prevent memory leak warning
process.setMaxListeners(15)
