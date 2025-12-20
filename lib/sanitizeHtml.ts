import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content for safe storage and display
 * Allows common formatting tags but removes dangerous scripts and attributes
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ''
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'span', 'div',
      'blockquote', 'pre', 'code',
    ],
    ALLOWED_ATTR: [
      'style', // Allow inline styles for colors
      'href', 'target', 'rel', // For links
      'dir', // For RTL support
      'class', // For styling
    ],
    KEEP_CONTENT: true,
    // Allow styles but DOMPurify will sanitize them automatically
    // For more control, we can add a custom hook if needed
  })
}

/**
 * Strip HTML tags and return plain text
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
}

