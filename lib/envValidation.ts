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
  // OAuth configuration
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  APPLE_CLIENT_ID?: string
  APPLE_TEAM_ID?: string
  APPLE_KEY_ID?: string
  APPLE_PRIVATE_KEY?: string
  // Site configuration
  NEXT_PUBLIC_SITE_URL?: string
  NEXT_PUBLIC_BASE_URL?: string
  // Email configuration
  EMAIL_HOST?: string
  EMAIL_PORT?: string
  EMAIL_SECURE?: string
  EMAIL_USER?: string
  EMAIL_PASSWORD?: string
  EMAIL_FROM?: string
  GMAIL_USER?: string
  GMAIL_APP_PASSWORD?: string
  // Push notifications
  NEXT_PUBLIC_VAPID_PUBLIC_KEY?: string
  VAPID_PRIVATE_KEY?: string
  VAPID_EMAIL?: string
  // AI
  OPENAI_API_KEY?: string
  // Admin auth
  ADMIN_SESSION_SECRET?: string
}

// Module-level dedup flag. `validateEnvironment()` is called once when this
// module is first evaluated in a given process. On Vercel serverless each
// cold start is a new process with its own flag, so warnings still surface
// once per container, just not on every request within that container.
//
// Must be declared BEFORE validateEnvironment() so it's initialized by the
// time `export const env = validateEnvironment()` executes below.
let hasEmittedWarnings = false

function validateEnvironment(): EnvConfig {
  // On the client side, server-only env vars (without NEXT_PUBLIC_ prefix) are
  // undefined by design. Skip strict validation when running in the browser so
  // that client components importing public vars (e.g. NEXT_PUBLIC_SITE_URL)
  // don't crash on missing DATABASE_URL etc.
  const isClient = typeof window !== 'undefined'

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
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    // OAuth configuration
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
    APPLE_KEY_ID: process.env.APPLE_KEY_ID,
    APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY,
    // Site configuration
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    // Email configuration
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_SECURE: process.env.EMAIL_SECURE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
    // Push notifications
    NEXT_PUBLIC_VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
    VAPID_EMAIL: process.env.VAPID_EMAIL,
    // AI
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    // Admin auth
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  }

  // Only validate server-only required vars on the server.
  // Client bundles never have access to non-NEXT_PUBLIC_ vars.
  if (!isClient) {
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
  }

  // All remaining server-only validations: skip on client
  if (!isClient) {
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
  }

  // Production config warnings.
  //
  // Skip during Next.js build phase (env vars aren't available during static
  // generation) and when running on the client.
  //
  // Module-level dedup (`hasEmittedWarnings`) below: `validateEnvironment()`
  // runs once per container cold start on Vercel, but a single cold start can
  // serve many requests. We still only emit each missing-config warning once
  // per process lifetime — no per-request spam.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
  if (!isClient && requiredVars.NODE_ENV === 'production' && !isBuildPhase && !hasEmittedWarnings) {
    hasEmittedWarnings = true

    // Admin notification email: we need ONE of ADMIN_EMAIL, GMAIL_USER,
    // EMAIL_USER to send order + new-user emails. Auth does NOT use these
    // (admin login goes through the DB user table); the old "admin user will
    // be created with default credentials" warning was from a one-off seed
    // script and does not apply at runtime.
    if (
      !optionalVars.ADMIN_EMAIL &&
      !optionalVars.GMAIL_USER &&
      !optionalVars.EMAIL_USER
    ) {
      warnLog(
        '⚠️  WARNING: No admin notification email configured.\n' +
        'Set one of ADMIN_EMAIL, GMAIL_USER, or EMAIL_USER so order + new-user notifications can be delivered.'
      )
    }

    if (!optionalVars.MOBILE_APP_KEY) {
      warnLog(
        '⚠️  WARNING: MOBILE_APP_KEY not set in production.\n' +
        'Mobile API will reject all requests until this is configured.'
      )
    }

    // JWT_SECRET is critical — lib/jwt.ts hard-fails if missing, but we still
    // surface a length warning here so it's visible in prod logs on first boot.
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

    if (!optionalVars.STRIPE_SECRET_KEY || !optionalVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      warnLog(
        '⚠️  WARNING: Stripe configuration incomplete in production.\n' +
        'STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY are required for payment processing.\n' +
        'Stripe payments will be disabled until these are configured.'
      )
    }

    if (!optionalVars.GOOGLE_CLIENT_ID || !optionalVars.GOOGLE_CLIENT_SECRET) {
      warnLog(
        '⚠️  WARNING: Google OAuth configuration incomplete in production.\n' +
        'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required for Google Sign-In.\n' +
        'Google authentication will be disabled until these are configured.'
      )
    }

    if (!optionalVars.APPLE_CLIENT_ID || !optionalVars.APPLE_TEAM_ID ||
        !optionalVars.APPLE_KEY_ID || !optionalVars.APPLE_PRIVATE_KEY) {
      warnLog(
        '⚠️  WARNING: Apple OAuth configuration incomplete in production.\n' +
        'APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY are required for Apple Sign-In.\n' +
        'Apple authentication will be disabled until these are configured.'
      )
    }

    // NEXT_PUBLIC_SITE_URL warning removed: the fallback to 'https://genosys.ae'
    // is stable and correct (set in lib/urls or wherever the read happens), so
    // the missing-var warning was pure log noise with no real risk to flag.
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
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  APPLE_CLIENT_ID,
  APPLE_TEAM_ID,
  APPLE_KEY_ID,
  APPLE_PRIVATE_KEY,
  NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_BASE_URL,
  // Email
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_FROM,
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
  // Push notifications
  NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_EMAIL,
  // AI
  OPENAI_API_KEY,
  // Admin auth
  ADMIN_SESSION_SECRET,
} = env

// Helper to check if OAuth providers are configured
export function isGoogleOAuthConfigured(): boolean {
  return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET)
}

export function isAppleOAuthConfigured(): boolean {
  return !!(APPLE_CLIENT_ID && APPLE_TEAM_ID && APPLE_KEY_ID && APPLE_PRIVATE_KEY)
}

// Export validation function for testing
export { validateEnvironment }

