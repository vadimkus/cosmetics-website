function isIOSWebKitUserAgent(userAgent: string): boolean {
  return /iP(?:hone|ad|od)/i.test(userAgent) && /WebKit/i.test(userAgent)
}

export function isIgnorableBrowserNavigationError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  if (typeof navigator === 'undefined') return false
  if (!isIOSWebKitUserAgent(navigator.userAgent)) return false

  const name = error.name || ''
  const message = error.message || ''

  return (
    (name === 'TypeError' && message === 'Load failed') ||
    name === 'AbortError' ||
    /AbortError: The operation was aborted\.?/i.test(message)
  )
}
