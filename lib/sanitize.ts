/**
 * Input sanitization utilities
 * Provides functions to sanitize user input before storage and rendering
 */
import { sanitizeHtml as sanitizeHtmlCore } from '@/lib/sanitizeHtml'

/**
 * Sanitize HTML content for safe rendering
 * Removes dangerous scripts, event handlers, and other XSS vectors
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  return sanitizeHtmlCore(dirty)
}

/**
 * Sanitize plain text by escaping HTML characters
 * Use for fields that should only contain plain text
 */
export function sanitizeText(text: string | null | undefined): string {
  if (!text) {
    return ''
  }
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Sanitize for database storage
 * Removes potentially dangerous content while preserving structure
 */
export function sanitizeForStorage(input: string | null | undefined): string {
  if (!input) {
    return ''
  }
  
  // First sanitize HTML
  const sanitized = sanitizeHtml(input)
  
  // Remove any remaining script-like patterns
  return sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

/**
 * Sanitize product description for safe rendering
 * Allows basic formatting but removes scripts and dangerous attributes
 */
export function sanitizeProductDescription(description: string | null | undefined): string {
  // Same sanitizer as other rich text fields; keep it server-safe.
  return sanitizeHtmlCore(description)
}

