import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * The order notifications are the brand speaking to a customer on their Lock Screen, and
 * nothing here is covered by a type. These pin the decisions rather than the wording:
 * the placeholder actually substitutes, all three languages stay in step, and the house
 * style holds.
 */
const source = readFileSync(join(__dirname, '..', '..', 'lib', 'expoPush.ts'), 'utf8')

/** The message table, pulled out of the module without importing the Expo SDK. */
function messages(): Record<string, Record<string, Record<string, string>>> {
  const start = source.indexOf('const ORDER_STATUS_MESSAGES')
  const open = source.indexOf('{', start)
  let depth = 0
  let i = open
  for (; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}') {
      depth--
      if (depth === 0) break
    }
  }
  const literal = source.slice(open, i + 1)
  // eslint-disable-next-line no-new-func
  return new Function(`return (${literal})`)() as ReturnType<typeof messages>
}

const TABLE = messages()
const STATUSES = Object.keys(TABLE)
const LOCALES = ['en', 'ar', 'ru'] as const

type Copy = { title: string; subtitle: string; body: string }

/**
 * The table is parsed out of a source file, so every lookup is `undefined` as far as the
 * type system is concerned. A missing entry is a failure whichever way it surfaces, so it
 * fails here with the name of what is missing rather than as a null dereference further
 * down each loop.
 */
function copy(status: string, locale: string): Copy {
  const entry = TABLE[status]?.[locale]
  if (!entry) throw new Error(`no notification copy for ${status} in ${locale}`)
  return entry as unknown as Copy
}

describe('order notification copy', () => {
  it('covers every status in every language', () => {
    expect(STATUSES).toEqual(
      expect.arrayContaining(['PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    )
    for (const status of STATUSES) {
      for (const locale of LOCALES) {
        const entry = copy(status, locale)
        expect(entry.title.length).toBeGreaterThan(0)
        expect(entry.subtitle.length).toBeGreaterThan(0)
        expect(entry.body.length).toBeGreaterThan(0)
      }
    }
  })

  /**
   * The bug this replaces: the placeholder was `#{orderNumber}` and the substitution
   * consumed the `#` along with it, so every message read "your order 46125502" while the
   * source looked like it said "#46125502". Nobody noticed because it still made sense.
   */
  it('substitutes the order number, leaving no placeholder behind', () => {
    for (const status of STATUSES) {
      for (const locale of LOCALES) {
        const { subtitle, body } = copy(status, locale)
        const filled = [subtitle, body]
          .map(line => line.split('{orderNumber}').join('46125502'))
          .join(' ')
        expect(filled).not.toContain('{orderNumber}')
        expect(filled).toContain('46125502')
      }
    }
  })

  it('puts the order number where each language expects it', () => {
    for (const status of STATUSES) {
      // English takes a hash, Russian takes № , Arabic takes neither: a leading # in
      // right-to-left text lands on the wrong end of the digits.
      expect(copy(status, 'en').subtitle).toContain('#{orderNumber}')
      expect(copy(status, 'ru').subtitle).toContain('№')
      expect(copy(status, 'ar').subtitle).not.toContain('#')
    }
  })

  it('does not shout', () => {
    for (const status of STATUSES) {
      for (const locale of LOCALES) {
        const { title, subtitle, body } = copy(status, locale)
        const all = `${title} ${subtitle} ${body}`
        // No exclamation marks: the app icon carries the brand and the word "confirmed"
        // does not need help.
        expect({ status, locale, shouty: all.includes('!') }).toEqual({
          status,
          locale,
          shouty: false,
        })
        // No emoji, in any plane.
        expect({ status, locale, emoji: /\p{Extended_Pictographic}/u.test(all) }).toEqual({
          status,
          locale,
          emoji: false,
        })
      }
    }
  })

  it('keeps titles short enough for the Lock Screen', () => {
    for (const status of STATUSES) {
      for (const locale of LOCALES) {
        // iOS truncates a notification title around the mid twenties at common widths.
        expect({ status, locale, length: copy(status, locale).title.length <= 26 }).toEqual({
          status,
          locale,
          length: true,
        })
      }
    }
  })

  it('sends the subtitle, not just title and body', () => {
    expect(source).toContain('subtitle: content.subtitle')
  })
})
