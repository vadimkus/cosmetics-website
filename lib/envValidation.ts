import { warnLog } from '@/lib/logger'
/**
 * Environment variable validation
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  DATABASE_URL: string
  PRISMA_DATABASE_URL?: string
  ADMIN_EMAIL?: string
  ADMIN_PASSWORD?: string
  NODE_ENV: string
  // Mobile API configuration
  MOBILE_APP_KEY?: string
  JWT_SECRET?: string
  // Stripe configuration
  STRIPE_SECRET_KEY?: string
  STRIPE_PUBLISHABLE_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
}

function validateEnvironment(): EnvConfig {
  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || 'development'
  }

  const optionalVars = {
    PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    // Mobile API configuration
    MOBILE_APP_KEY: process.env.MOBILE_APP_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    // Stripe configuration
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  }

  // Check required variables
  const missingVars: string[] = []
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(key)
    }
  })

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
  }

  // Validate DATABASE_URL format
  const databaseUrl = requiredVars.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }
  try {
    new URL(databaseUrl)
  } catch (error) {
    throw new Error('Invalid DATABASE_URL format. Must be a valid URL.')
  }

  // Validate PRISMA_DATABASE_URL if provided
  if (optionalVars.PRISMA_DATABASE_URL) {
    try {
      new URL(optionalVars.PRISMA_DATABASE_URL)
    } catch (error) {
      throw new Error('Invalid PRISMA_DATABASE_URL format. Must be a valid URL.')
    }
  }

  // Warn about missing admin credentials in production
  if (requiredVars.NODE_ENV === 'production') {
    if (!optionalVars.ADMIN_EMAIL || !optionalVars.ADMIN_PASSWORD) {
      warnLog(
        '⚠️  WARNING: ADMIN_EMAIL and ADMIN_PASSWORD not set in production.\n' +
        'Admin user will be created with default credentials. Please change them immediately!'
      )
    }
    
    // Warn about missing Mobile API configuration in production
    if (!optionalVars.MOBILE_APP_KEY) {
      warnLog(
        '⚠️  WARNING: MOBILE_APP_KEY not set in production.\n' +
        'Mobile API will reject all requests until this is configured.'
      )
    }
    
    // JWT_SECRET is critical in production - handled in lib/jwt.ts with hard fail
    if (!optionalVars.JWT_SECRET) {
      warnLog(
        '⚠️  WARNING: JWT_SECRET not set in production.\n' +
        'This is CRITICAL for security. Mobile authentication will fail.'
      )
    } else if (optionalVars.JWT_SECRET.length < 32) {
      warnLog(
        '⚠️  WARNING: JWT_SECRET should be at least 32 characters for security.\n' +
        'Current length: ' + optionalVars.JWT_SECRET.length
      )
    }
    
    // Warn about missing Stripe configuration in production
    if (!optionalVars.STRIPE_SECRET_KEY || !optionalVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      warnLog(
        '⚠️  WARNING: Stripe configuration incomplete in production.\n' +
        'STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY are required for payment processing.\n' +
        'Stripe payments will be disabled until these are configured.'
      )
    }
  }

  return {
    ...requiredVars,
    ...optionalVars
  } as EnvConfig
}

// Export validated environment configuration
export const env = validateEnvironment()

// Export individual environment variables for convenience
export const {
  DATABASE_URL,
  PRISMA_DATABASE_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  NODE_ENV,
  MOBILE_APP_KEY,
  JWT_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
} = env

// Export validation function for testing
export { validateEnvironment }

