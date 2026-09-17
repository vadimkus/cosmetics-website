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

/**
 * Google serves a generic blue silhouette (a few hundred bytes) when an
 * account has no photo or its photo visibility is restricted. The userinfo
 * payload does not flag this, so the only reliable tell is the image itself.
 * Anything under this size is a placeholder, not a portrait.
 */
export const GOOGLE_DEFAULT_AVATAR_MAX_BYTES = 900

export function isGoogleDefaultAvatarSize(bytes: number | null | undefined): boolean {
  return typeof bytes === 'number' && bytes >= 0 && bytes < GOOGLE_DEFAULT_AVATAR_MAX_BYTES
}

/**
 * Fetches the picture and reports whether Google is serving its default
 * silhouette. Errors are treated as "not a default" so a network hiccup never
 * blocks a legitimate refresh.
 */
export async function isGoogleDefaultAvatar(
  pictureUrl: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const res = await fetchImpl(pictureUrl, { method: 'GET', signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return false
    const lengthHeader = res.headers.get('content-length')
    if (lengthHeader) return isGoogleDefaultAvatarSize(Number(lengthHeader))
    const bytes = (await res.arrayBuffer()).byteLength
    return isGoogleDefaultAvatarSize(bytes)
  } catch {
    return false
  }
}
