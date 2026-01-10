/**
 * Email Module - Main Entry Point
 * 
 * This module provides email functionality for the application.
 * Re-exports everything from legacy.ts for backward compatibility.
 * 
 * The module is structured as follows:
 * - types.ts: TypeScript interfaces (for new code)
 * - utils.ts: Helper functions (for new code)
 * - transporter.ts: SMTP configuration (for new code)
 * - legacy.ts: All original email functionality (maintained for compatibility)
 * 
 * Existing code should continue using imports from '@/lib/email' unchanged.
 * New code can import from specific submodules for better tree-shaking.
 */

// Re-export everything from legacy for complete backward compatibility
export * from './legacy'

// Note: types.ts, utils.ts, and transporter.ts are available for new code
// They can be imported directly:
//   import { LOGO_URL } from '@/lib/email/utils'
//   import { sendEmail } from '@/lib/email/transporter'
//   import type { OrderEmailItem } from '@/lib/email/types'
