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
 * Google serves a placeholder when an account has no photo or restricts who
 * can see it: a blue silhouette, a grey "no photo" icon, or a blank tile. It
 * also serves a coloured letter avatar for most photo-less accounts; that one
 * is fine to show, it already reads as initials.
 *
 * Measured on 310 stored Google avatars (25 Sep 2026): every placeholder is
 * under 1.5 KB and has either no pure-white pixels (silhouette, grey icon,
 * grey tile) or is all white (blank tile). Letter avatars always carry white
 * glyph pixels, between 1.4% and 6.7% of the image. Real photos are larger
 * and are never decoded.
 */
export const GOOGLE_PLACEHOLDER_MAX_BYTES = 1500

export function isPlaceholderWhiteShare(whiteShare: number): boolean {
  return whiteShare < 0.005 || whiteShare > 0.9
}

async function whiteShareOf(bytes: Buffer): Promise<number | null> {
  try {
    const sharp = (await import('sharp')).default
    const { data, info } = await sharp(bytes).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    let white = 0
    for (let i = 0; i < data.length; i += info.channels) {
      if ((data[i] ?? 0) > 245 && (data[i + 1] ?? 0) > 245 && (data[i + 2] ?? 0) > 245) white++
    }
    return white / (info.width * info.height)
  } catch {
    return null
  }
}

/**
 * Fetches the picture and reports whether Google is serving a placeholder.
 * Errors and undecodable images count as "not a placeholder" so a network
 * hiccup never blocks a legitimate refresh.
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
    const declared = Number(res.headers.get('content-length'))
    if (Number.isFinite(declared) && declared > GOOGLE_PLACEHOLDER_MAX_BYTES) return false
    const bytes = Buffer.from(await res.arrayBuffer())
    if (bytes.length > GOOGLE_PLACEHOLDER_MAX_BYTES) return false
    const share = await whiteShareOf(bytes)
    return share !== null && isPlaceholderWhiteShare(share)
  } catch {
    return false
  }
}

/** The Google picture to store for a brand-new account: never the placeholder. */
export async function googlePictureForNewUser(
  googlePicture: unknown,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  if (typeof googlePicture !== 'string' || !googlePicture.trim()) return null
  const url = googlePicture.trim()
  return (await isGoogleDefaultAvatar(url, fetchImpl)) ? null : url
}

/**
 * What to write to `profilePicture` when an existing user signs in with Google.
 *   undefined -> leave it as it is
 *   null      -> clear it (the stored value is Google's placeholder)
 *   string    -> store this Google URL
 *
 * A photo uploaded through GENOSYS is never touched. Google's blue silhouette
 * is never stored, so the app falls back to the customer's initials.
 */
export async function googlePictureUpdate(
  currentPicture: unknown,
  googlePicture: unknown,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null | undefined> {
  const current = typeof currentPicture === 'string' ? currentPicture.trim() : ''
  if (current && !isGoogleHostedProfilePicture(current)) return undefined

  const next = typeof googlePicture === 'string' ? googlePicture.trim() : ''
  const nextIsDefault = next ? await isGoogleDefaultAvatar(next, fetchImpl) : false

  if (next && !nextIsDefault) return next === current ? undefined : next
  if (current && (current === next || (await isGoogleDefaultAvatar(current, fetchImpl)))) return null
  return undefined
}
