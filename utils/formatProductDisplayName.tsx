import type { ReactNode } from 'react'

const BEAUTY_BOX_SUFFIX = /^(.*?)\s+(Beauty\s+Box)$/i

/**
 * Force "Beauty Box" onto its own second line in product titles.
 * Example: "PROBLEM SKIN CARE BEAUTY BOX" →
 *   PROBLEM SKIN CARE
 *   BEAUTY BOX
 */
export function formatProductDisplayName(name: string): ReactNode {
  const match = name.match(BEAUTY_BOX_SUFFIX)
  if (!match) return name

  const prefix = (match[1] ?? '').trim()
  const suffix = (match[2] ?? '').replace(/\s+/, '\u00A0')

  if (!prefix) return suffix

  return (
    <>
      <span className="block">{prefix}</span>
      <span className="block">{suffix}</span>
    </>
  )
}

/** Plain-text two-line form (emails, aria, share text). */
export function formatProductDisplayNamePlain(name: string): string {
  const match = name.match(BEAUTY_BOX_SUFFIX)
  if (!match) return name
  const prefix = (match[1] ?? '').trim()
  const suffix = match[2] ?? ''
  return prefix ? `${prefix}\n${suffix}` : suffix
}
