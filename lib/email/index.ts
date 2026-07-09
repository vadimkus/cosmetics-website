/**
 * Email Module - Main Entry Point
 *
 * This module provides all email functionality for the application.
 * It is split into focused submodules for maintainability:
 *
 * - types.ts: TypeScript interfaces and type definitions
 * - utils.ts: Translation, locale, and formatting helpers
 * - transporter.ts: SMTP configuration and core sendEmail function
 * - templates.ts: Email template definitions (HTML generation)
 * - senders.ts: Wrapper functions for sending specific email types
 * - htmlGenerators.ts: Order HTML generators (COD, Stripe)
 * - statusUpdate.ts: Order status update email sender
 *
 * All exports are re-exported here for backward compatibility.
 * Import from '@/lib/email' as before - no changes needed.
 */

export * from './types'
export * from './utils'
export * from './transporter'
export * from './templates'
export * from './senders'
export * from './htmlGenerators'
export * from './statusUpdate'
export * from './loyalty'
export * from './reviewRequest'
