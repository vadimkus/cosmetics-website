export function isGoogleHostedProfilePicture(value: unknown): boolean {
  if (typeof value !== 'string' || !value.trim()) return false
  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      (url.hostname === 'googleusercontent.com' ||
        url.hostname.endsWith('.googleusercontent.com'))
    )
  } catch {
    return false
  }
}

/**
 * Google picture URLs are provider-owned profile data and may change after the
 * first login. Refresh those URLs, but never overwrite a photo uploaded by the
 * customer through GENOSYS.
 */
export function shouldRefreshGoogleProfilePicture(
  currentPicture: unknown,
  googlePicture: unknown,
): boolean {
  if (typeof googlePicture !== 'string' || !googlePicture.trim()) return false
  if (typeof currentPicture !== 'string' || !currentPicture.trim()) return true
  return (
    currentPicture.trim() !== googlePicture.trim() &&
    isGoogleHostedProfilePicture(currentPicture)
  )
}
