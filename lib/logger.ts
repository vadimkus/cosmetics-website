/**
 * Conditional logging utility
 * Only logs in development mode or when explicitly enabled
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const DEBUG_LOG_ENABLED = process.env.DEBUG_LOG === 'true' || isDevelopment

/**
 * Debug logger - only logs in development or when DEBUG_LOG=true
 */
export const debugLog = (...args: unknown[]): void => {
  if (DEBUG_LOG_ENABLED) {
    console.log(...args)
  }
}

/**
 * Error logger - always logs errors
 */
export const errorLog = (...args: unknown[]): void => {
  console.error(...args)
}

/**
 * Warning logger - always logs warnings
 */
export const warnLog = (...args: unknown[]): void => {
  console.warn(...args)
}

/**
 * Info logger - logs in development or when DEBUG_LOG=true
 */
export const infoLog = (...args: unknown[]): void => {
  if (DEBUG_LOG_ENABLED) {
    console.info(...args)
  }
}

