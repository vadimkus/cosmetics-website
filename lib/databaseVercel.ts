import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a singleton instance of PrismaClient
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgres://bba1d642802ecf0af6b89802617217c7ee4bd9e45a9df009f7fcc332176072e7:sk_-vf4T6G2TVhfLC4FwIJsi@db.prisma.io:5432/postgres?sslmode=require'
    }
  }
})

// In development, store the client on globalThis to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma
