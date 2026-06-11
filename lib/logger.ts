/**
 * Conditional logging utility
 * Only logs in development mode or when explicitly enabled
 */

const isDevelopment = process.env.NODE_ENV === 'development'
const DEBUG_LOG_ENABLED = process.env.DEBUG_LOG === 'true' || isDevelopment

/**
 * Write log to file (server-side only)
 * Uses dynamic import to avoid bundling fs in client code
 */
async function writeToFile(level: string, ...args: unknown[]): Promise<void> {
  if (typeof window !== 'undefined') return // Skip in browser
  
  // Use dynamic import to avoid bundling fs in client code
  try {
    const fs = await import('fs')
    const path = await import('path')
    
    const LOG_DIR = path.join(process.cwd(), 'logs')
    const LOG_FILE = path.join(LOG_DIR, 'google-oauth.log')
    
    // Ensure logs directory exists
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true })
    }
    
    const timestamp = new Date().toISOString()
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ')
    const logLine = `[${timestamp}] [${level}] ${message}\n`
    
    fs.appendFileSync(LOG_FILE, logLine, { encoding: 'utf8' })
  } catch {
    // Silently fail if file writing fails (e.g., in client-side rendering)
  }
}

/**
 * Debug logger - only logs in development or when DEBUG_LOG=true
 */
export const debugLog = (...args: unknown[]): void => {
  if (DEBUG_LOG_ENABLED) {
    console.log(...args)
    writeToFile('DEBUG', ...args)
  }
}

/**
 * Error logger - always logs errors
 */
export const errorLog = (...args: unknown[]): void => {
  console.error(...args)
  writeToFile('ERROR', ...args)
}

/**
 * Warning logger - always logs warnings
 */
export const warnLog = (...args: unknown[]): void => {
  console.warn(...args)
  writeToFile('WARN', ...args)
}

/**
 * Info logger - logs in development or when DEBUG_LOG=true
 */
export const infoLog = (...args: unknown[]): void => {
  if (DEBUG_LOG_ENABLED) {
    console.info(...args)
    writeToFile('INFO', ...args)
  }
}

