const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'me.com',
  'yahoo.com',
  'yahoo.co.uk',
  'ymail.com',
  'mail.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'mail.ru',
  'yandex.ru',
] as const

const COMMON_DOMAIN_SET = new Set<string>(COMMON_EMAIL_DOMAINS)

export const normalizeEmailAddress = (value: unknown): string =>
  String(value || '').trim().toLowerCase()

export const isEmailAddressSyntaxValid = (value: unknown): boolean => {
  const email = normalizeEmailAddress(value)
  if (!email || email.length > 254 || /\s/.test(email)) return false

  const atIndex = email.lastIndexOf('@')
  if (atIndex <= 0 || atIndex !== email.indexOf('@')) return false

  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex + 1)
  if (!local || local.length > 64 || !domain || domain.length > 253) return false
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false

  const labels = domain.split('.')
  if (labels.length < 2 || labels.some((label) => !label || label.length > 63)) return false
  if (labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label))) return false

  const tld = labels.at(-1) || ''
  return /^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i.test(tld)
}

const damerauLevenshtein = (left: string, right: string): number => {
  const matrix = Array.from({ length: left.length + 1 }, () =>
    Array<number>(right.length + 1).fill(0)
  )

  for (let i = 0; i <= left.length; i += 1) matrix[i]![0] = i
  for (let j = 0; j <= right.length; j += 1) matrix[0]![j] = j

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost
      )

      if (
        i > 1 &&
        j > 1 &&
        left[i - 1] === right[j - 2] &&
        left[i - 2] === right[j - 1]
      ) {
        matrix[i]![j] = Math.min(matrix[i]![j]!, matrix[i - 2]![j - 2]! + 1)
      }
    }
  }

  return matrix[left.length]![right.length]!
}

export const suggestEmailAddressCorrection = (value: unknown): string | null => {
  const email = normalizeEmailAddress(value)
  const atIndex = email.lastIndexOf('@')
  if (atIndex <= 0 || atIndex !== email.indexOf('@')) return null

  const local = email.slice(0, atIndex)
  const domain = email.slice(atIndex + 1)
  if (!local || !domain || COMMON_DOMAIN_SET.has(domain)) return null

  let closestDomain: string | null = null
  let closestDistance = Number.POSITIVE_INFINITY

  for (const knownDomain of COMMON_EMAIL_DOMAINS) {
    const distance = damerauLevenshtein(domain, knownDomain)
    if (distance < closestDistance) {
      closestDistance = distance
      closestDomain = knownDomain
    }
  }

  const threshold = domain.length <= 6 ? 1 : 2
  return closestDomain && closestDistance <= threshold
    ? `${local}@${closestDomain}`
    : null
}

export const getEmailDomain = (value: unknown): string | null => {
  const email = normalizeEmailAddress(value)
  const atIndex = email.lastIndexOf('@')
  return atIndex > 0 && atIndex < email.length - 1 ? email.slice(atIndex + 1) : null
}
