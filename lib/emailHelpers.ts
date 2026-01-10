/**
 * Get the preferred email address for a user
 * 
 * For Apple Private Relay users who have provided a contact email,
 * this returns their real email address. Otherwise, returns their
 * regular email (including relay emails).
 * 
 * @param user - User object with email and optional contactEmail
 * @returns The email address to use for communications
 */
export function getPreferredEmail(user: { email: string; contactEmail?: string | null }): string {
  // If user has provided a contact email, use that
  if (user.contactEmail && user.contactEmail.trim() !== '') {
    return user.contactEmail
  }
  
  // Otherwise use their regular email (could be relay email)
  return user.email
}

/**
 * Check if an email is an Apple Private Relay or anonymized Apple email
 * These emails cannot reliably receive mail and should be skipped
 */
export function isApplePrivateRelayEmail(email: string): boolean {
  if (!email) return false
  const lower = email.toLowerCase()
  return (
    lower.includes('@privaterelay.appleid.com') ||
    lower.includes('@genosys.local') ||
    lower.startsWith('apple+') ||
    lower.startsWith('deleted+')
  )
}

/**
 * Check if we should skip sending email to this address
 * Returns true for Apple Private Relay emails that don't have a contact email alternative
 */
export function shouldSkipEmail(user: { email: string; contactEmail?: string | null }): boolean {
  const emailToUse = getPreferredEmail(user)
  return isApplePrivateRelayEmail(emailToUse)
}


