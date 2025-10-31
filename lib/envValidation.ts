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
}

function validateEnvironment(): EnvConfig {
  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV || 'development'
  }

  const optionalVars = {
    PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
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
      console.warn(
        '⚠️  WARNING: ADMIN_EMAIL and ADMIN_PASSWORD not set in production.\n' +
        'Admin user will be created with default credentials. Please change them immediately!'
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
  NODE_ENV
} = env

// Export validation function for testing
export { validateEnvironment }

