import { resolve4, resolve6, resolveMx } from 'node:dns/promises'
import {
  getEmailDomain,
  isEmailAddressSyntaxValid,
  normalizeEmailAddress,
  suggestEmailAddressCorrection,
} from '@/lib/emailAddressValidation'

type DomainStatus = 'deliverable' | 'undeliverable' | 'unknown'

export type RegistrationEmailValidation = {
  valid: boolean
  email: string
  code?: 'EMAIL_INVALID' | 'EMAIL_DOMAIN_SUGGESTION' | 'EMAIL_DOMAIN_INVALID'
  error?: string
  suggestedEmail?: string
}

const DNS_TIMEOUT_MS = 2500
const CACHE_TTL_MS = 60 * 60 * 1000

const domainCache = new Map<string, { status: DomainStatus; expiresAt: number }>()

const withTimeout = async <T>(promise: Promise<T>): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('DNS_TIMEOUT')), DNS_TIMEOUT_MS)
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

const resolveMailDomain = async (domain: string): Promise<DomainStatus> => {
  const cached = domainCache.get(domain)
  if (cached && cached.expiresAt > Date.now()) return cached.status

  let status: DomainStatus = 'unknown'

  try {
    const mxRecords = await withTimeout(resolveMx(domain))
    // RFC 7505 null MX: a single "." exchange explicitly means no email.
    status = mxRecords.some((record) => record.exchange && record.exchange !== '.')
      ? 'deliverable'
      : 'undeliverable'
  } catch (mxError) {
    const code =
      typeof mxError === 'object' && mxError && 'code' in mxError
        ? String((mxError as { code?: unknown }).code || '')
        : ''

    if (code === 'ENODATA') {
      // RFC 5321 permits delivery to the domain's address record when MX is absent.
      const addressResults = await Promise.allSettled([
        withTimeout(resolve4(domain)),
        withTimeout(resolve6(domain)),
      ])
      status = addressResults.some(
        (result) => result.status === 'fulfilled' && result.value.length > 0
      )
        ? 'deliverable'
        : 'undeliverable'
    } else if (code === 'ENOTFOUND' || code === 'ENODOMAIN') {
      status = 'undeliverable'
    }
    // Timeouts/SERVFAIL remain "unknown" and fail open so a transient DNS
    // incident cannot lock legitimate customers out of registration.
  }

  domainCache.set(domain, { status, expiresAt: Date.now() + CACHE_TTL_MS })
  return status
}

export const validateRegistrationEmail = async (
  value: unknown,
  suggestionConfirmed = false
): Promise<RegistrationEmailValidation> => {
  const email = normalizeEmailAddress(value)
  if (!isEmailAddressSyntaxValid(email)) {
    return {
      valid: false,
      email,
      code: 'EMAIL_INVALID',
      error: 'Please enter a valid email address.',
    }
  }

  const suggestedEmail = suggestEmailAddressCorrection(email)
  if (suggestedEmail && !suggestionConfirmed) {
    return {
      valid: false,
      email,
      code: 'EMAIL_DOMAIN_SUGGESTION',
      error: `Please check your email address. Did you mean ${suggestedEmail}?`,
      suggestedEmail,
    }
  }

  const domain = getEmailDomain(email)
  if (!domain || (await resolveMailDomain(domain)) === 'undeliverable') {
    return {
      valid: false,
      email,
      code: 'EMAIL_DOMAIN_INVALID',
      error: 'This email domain cannot receive mail. Please check the address.',
      ...(suggestedEmail ? { suggestedEmail } : {}),
    }
  }

  return { valid: true, email }
}
