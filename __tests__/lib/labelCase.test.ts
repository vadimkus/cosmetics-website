import en from '@/messages/en.json'

/**
 * Interface chrome is sentence case. This matches the 92 bespoke product pages,
 * which have always used it for every control they own, and it is the
 * convention Apple, Material and Shopify's own design system all specify.
 *
 * The catalogue also holds product names, company names and marketing copy,
 * which are not chrome and keep their capitals. Those live under the key
 * patterns in NOT_CHROME below, and the protected vocabulary covers proper
 * nouns that appear inside chrome strings - "Contact support via WhatsApp" is
 * a chrome label with a brand name in it.
 *
 * Kept in step with scripts/label-case-sentence.py, which performed the pass.
 */

const NOT_CHROME = [
  /^product\.routine.*Title$/,
  /^product\.pc.*Benefit.*Title$/,
  /^product\.pcDefault.*Title$/,
  /^orderEmail\./,
  /^about\./,
  /^training\./,
  /^terms\./,
  /^privacy\./,
  /^legal\./,
]

const PROTECTED_PHRASES = [
  'Apple Pay', 'Google Pay', 'Samsung Pay', 'Black Friday', 'Cyber Monday',
  'United Arab Emirates', 'Abu Dhabi', 'Ras Al Khaimah', 'Umm Al Quwain',
  'Eid Al Etihad', 'Middle East', 'Beauty Genie', 'Glass Skin',
  'Gene Re-Birth System', 'Gene Re-Birth', 'Google Play', 'App Store',
  'Play Store', 'Marina Mall', 'Dubai Marina', 'Mall of the Emirates',
  'Dubai Mall',
]

const PROTECTED_WORDS = new Set([
  'Genosys', 'GENOSYS', 'Montaji', 'DTS', 'MG', 'FZ-LLC', 'LLC', 'Genie',
  'Apple', 'Google', 'Samsung', 'WhatsApp', 'Instagram', 'Facebook', 'TikTok',
  'Stripe', 'PayPal', 'Tabby', 'Tamara', 'Visa', 'Mastercard', 'Amex',
  'Carrefour', 'Quiqup', 'Aramex', 'Talabat', 'Careem', 'Noon',
  'UAE', 'Dubai', 'Abu', 'Dhabi', 'Sharjah', 'Ajman', 'Fujairah',
  'Ras', 'Khaimah', 'Umm', 'Quwain', 'United', 'Arab', 'Emirates',
  'Korea', 'Korean', 'Saudi', 'Arabia', 'Etihad', 'Eid',
  'AED', 'USD', 'EUR', 'VAT', 'TRN', 'ID', 'OTP', 'PIN', 'SMS', 'COD',
  'SPF', 'PA', 'INCI', 'PDRN', 'EGF', 'MTS', 'DNA', 'RNA', 'UV', 'UVA',
  'UVB', 'LED', 'RF', 'AHA', 'BHA', 'PHA', 'AI', '3D', '2D',
  'Silver', 'Gold', 'Platinum', 'Bronze', 'VIP',
  'iOS', 'Android', 'PWA', 'FAQ', 'FAQs', 'CEO', 'PDF', 'QR',
  'Mon', 'Tue', 'Tues', 'Wed', 'Thu', 'Thur', 'Thurs', 'Fri', 'Sat', 'Sun',
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Sept', 'Oct',
  'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
])

const NOISE = /\{[^}]*\}|<[^>]*>|https?:\/\/\S+/g
const CLAUSE_BREAK = /^[\u2022|\u00b7\u2013\-/:]$|[\u2600-\u27bf\u{1f300}-\u{1faff}]/u

function flatten(node: unknown, prefix = ''): Array<[string, string]> {
  if (typeof node === 'string') return [[prefix, node]]
  if (!node || typeof node !== 'object') return []
  return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
    flatten(v, prefix ? `${prefix}.${k}` : k)
  )
}

/** Words that would need a capital removed for the string to be sentence case. */
function offendingWords(raw: string): string[] {
  let guarded = raw
  for (const phrase of [...PROTECTED_PHRASES].sort((a, b) => b.length - a.length)) {
    guarded = guarded.split(phrase).join(' ')
  }

  const offenders: string[] = []
  let newClause = true
  for (const word of guarded.split(' ')) {
    if (!word) continue
    // An opening bracket or quote begins a new clause, so "Birthday (Optional)"
    // and "Review title (Optional)" keep that capital and are already correct.
    const opensClause = /^[("'\u2018\u201c[]/.test(word)
    if (!newClause && !opensClause) {
      const bare = word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')
      const capitalised = /^\p{Lu}/u.test(bare)
      const allCaps = bare === bare.toUpperCase() && bare.length > 1
      const pluralAcronym =
        bare.length > 2 && bare.endsWith('s') && bare.slice(0, -1) === bare.slice(0, -1).toUpperCase()
      if (
        capitalised &&
        bare.length > 1 &&
        !allCaps &&
        !pluralAcronym &&
        !PROTECTED_WORDS.has(bare)
      ) {
        offenders.push(bare)
      }
    }
    newClause = CLAUSE_BREAK.test(word)
  }
  return offenders
}

describe('label capitalisation', () => {
  const chrome = flatten(en).filter(([key, value]) => {
    if (NOT_CHROME.some((p) => p.test(key))) return false
    const text = value.replace(NOISE, ' ').trim()
    const words = text.split(/\s+/)
    if (words.length < 2 || words.length > 8) return false
    // A full stop means a sentence, where capitals are grammar not style.
    return !/[.!?](\s|$)/.test(text)
  })

  it('has chrome labels to check', () => {
    expect(chrome.length).toBeGreaterThan(400)
  })

  it('keeps interface chrome in sentence case', () => {
    const offenders = chrome
      .map(([key, value]) => [key, value, offendingWords(value)] as const)
      .filter(([, , words]) => words.length > 0)
      .map(([key, value, words]) => `${key} = "${value}"  (${words.join(', ')})`)

    expect(offenders).toEqual([])
  })

  it('leaves product names and marketing copy alone', () => {
    // A canary: if someone points the pass at these, this fails loudly.
    const names = flatten(en).filter(([key]) => /^product\.routine.*Title$/.test(key))
    expect(names.length).toBeGreaterThan(10)
    expect(names.some(([, value]) => /[a-z] [A-Z]/.test(value))).toBe(true)
  })
})
