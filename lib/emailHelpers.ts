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
 * Check if a user is using Apple Private Relay
 */
export function isApplePrivateRelayEmail(email: string): boolean {
  return email.includes('@privaterelay.appleid.com')
}

