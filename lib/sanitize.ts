/**
 * Input sanitization utilities
 * Provides functions to sanitize user input before storage and rendering
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content for safe rendering
 * Removes dangerous scripts, event handlers, and other XSS vectors
 */
export function sanitizeHtml(dirty: string | null | undefined): string {
  if (!dirty) {
    return ''
  }
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'title', 'class', 'target'],
    ALLOW_DATA_ATTR: false,
  })
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
  if (!description) {
    return ''
  }
  
  // First, sanitize HTML content
  let sanitized = DOMPurify.sanitize(description, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'b', 'i',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'a', 'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'title', 'class'],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
    // Prevent javascript: and data: URLs
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
  })
  
  // Additional check: remove any remaining javascript: or data: protocol references
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/data:text\/html/gi, '')
  
  return sanitized
}

