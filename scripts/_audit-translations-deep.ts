/**
 * Deep, element-by-element audit of Arabic and Russian product localisation.
 *
 * Covers both surfaces:
 *   A. data/productTranslations.ts + data/productTranslationsRu.ts -> PDP body copy
 *   B. Product.nameAr/nameRu/descriptionAr/descriptionRu -> mobile API, search, SEO, feeds
 *
 * Checks: presence, script (is it actually translated), JSON validity, type parity
 * with English, and productDetails key parity. Read-only.
 */
import { prisma } from '../lib/prisma'
import { productTranslations } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

const JSON_FIELDS = ['productDetails', 'keyFeatures', 'benefits', 'ingredients'] as const
const TEXT_FIELDS = ['description', 'howToUse', 'directions'] as const
const ALL_FIELDS = [...TEXT_FIELDS, ...JSON_FIELDS] as const
type Field = (typeof ALL_FIELDS)[number]

const filled = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const hasArabic = (s: string) => /[\u0600-\u06FF]/.test(s)
const hasCyrillic = (s: string) => /[\u0400-\u04FF]/.test(s)

function tryParse(s: string): unknown {
  try {
    return JSON.parse(s)
  } catch {
    return undefined
  }
}

function shapeOf(v: unknown): string {
  if (Array.isArray(v)) return 'array'
  if (v && typeof v === 'object') return 'object'
  return typeof v
}

/** Latin-letter share, ignoring digits/punct. High share in AR/RU = likely untranslated. */
function latinShare(s: string): number {
  const letters = s.replace(/[^A-Za-z\u0600-\u06FF\u0400-\u04FF]/g, '')
  if (!letters.length) return 0
  const latin = (letters.match(/[A-Za-z]/g) || []).length
  return latin / letters.length
}

type Issue = { num: string; name: string; locale: 'AR' | 'RU'; field: string; kind: string; detail: string }

async function main() {
  const products = await prisma.product.findMany({
    orderBy: { productNumber: 'asc' },
  })

  const issues: Issue[] = []
  const push = (p: { productNumber: string | null; id: string; name: string }, locale: 'AR' | 'RU', field: string, kind: string, detail: string) =>
    issues.push({ num: p.productNumber || p.id, name: p.name, locale, field, kind, detail })

  for (const p of products) {
    const key = p.productNumber || p.id
    const maps: Array<{ locale: 'AR' | 'RU'; entry: Record<string, unknown> | null; script: (s: string) => boolean }> = [
      { locale: 'AR', entry: (productTranslations[key] as Record<string, unknown>) ?? null, script: hasArabic },
      { locale: 'RU', entry: (productTranslationsRu[key] as Record<string, unknown>) ?? null, script: hasCyrillic },
    ]

    for (const { locale, entry, script } of maps) {
      for (const f of ALL_FIELDS) {
        const en = (p as unknown as Record<string, unknown>)[f]
        const loc = entry?.[f]

        if (!filled(en)) continue // nothing to translate

        if (!filled(loc)) {
          push(p, locale, f, 'MISSING', entry ? 'entry exists, field absent/empty' : 'no entry for product')
          continue
        }

        // Script check on human-readable text (JSON fields checked after parse).
        if (!script(loc)) {
          push(p, locale, f, 'NOT_TRANSLATED', `no ${locale === 'AR' ? 'Arabic' : 'Cyrillic'} characters present`)
        } else if (latinShare(loc) > 0.6) {
          push(p, locale, f, 'MOSTLY_LATIN', `${Math.round(latinShare(loc) * 100)}% Latin letters`)
        }

        // JSON validity + parity with English.
        if ((JSON_FIELDS as readonly string[]).includes(f)) {
          const enParsed = tryParse(en)
          const locParsed = tryParse(loc)

          if (enParsed !== undefined && locParsed === undefined) {
            push(p, locale, f, 'BAD_JSON', 'English parses as JSON, localised value does not')
            continue
          }
          if (enParsed === undefined || locParsed === undefined) continue

          if (shapeOf(enParsed) !== shapeOf(locParsed)) {
            push(p, locale, f, 'SHAPE_MISMATCH', `EN ${shapeOf(enParsed)} vs ${locale} ${shapeOf(locParsed)}`)
            continue
          }
          if (Array.isArray(enParsed) && Array.isArray(locParsed) && enParsed.length !== locParsed.length) {
            push(p, locale, f, 'LENGTH_DIFF', `EN ${enParsed.length} items vs ${locale} ${locParsed.length}`)
          }
          if (f === 'productDetails' && !Array.isArray(enParsed) && typeof enParsed === 'object' && typeof locParsed === 'object') {
            const ek = Object.keys(enParsed as object).sort()
            const lk = Object.keys(locParsed as object).sort()
            const missing = ek.filter((k) => !lk.includes(k))
            const extra = lk.filter((k) => !ek.includes(k))
            if (missing.length || extra.length) {
              push(p, locale, f, 'KEY_DIFF', `missing:[${missing.join(',')}] extra:[${extra.join(',')}]`)
            }
          }
          // Nested-string sanity: an array of objects whose strings are all Latin.
          if (Array.isArray(locParsed)) {
            const flat = JSON.stringify(locParsed)
            if (!script(flat)) push(p, locale, f, 'NOT_TRANSLATED_JSON', 'parsed JSON contains no target-script text')
          }
        }
      }

      // Surface B: DB localised columns.
      const col = locale === 'AR' ? 'Ar' : 'Ru'
      for (const base of ['name', 'description'] as const) {
        const dbVal = (p as unknown as Record<string, unknown>)[`${base}${col}`]
        const enVal = (p as unknown as Record<string, unknown>)[base]
        if (!filled(enVal)) continue
        if (!filled(dbVal)) {
          push(p, locale, `DB.${base}${col}`, 'MISSING', 'column is null/empty')
        } else if (base === 'description' && !script(dbVal)) {
          push(p, locale, `DB.${base}${col}`, 'NOT_TRANSLATED', 'no target-script characters')
        }
      }
    }
  }

  const numeric = (s: string) => (/^\d+$/.test(s) ? parseInt(s, 10) : Number.MAX_SAFE_INTEGER)
  issues.sort((a, b) => numeric(a.num) - numeric(b.num) || a.locale.localeCompare(b.locale) || a.field.localeCompare(b.field))

  console.log(`Live products: ${products.length}`)
  console.log(`Total issues: ${issues.length}\n`)

  console.log('=== ISSUES BY KIND ===')
  const byKind = new Map<string, number>()
  for (const i of issues) byKind.set(`${i.kind} (${i.locale})`, (byKind.get(`${i.kind} (${i.locale})`) || 0) + 1)
  for (const [k, v] of [...byKind.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(28)} ${v}`)

  console.log('\n=== ISSUE DETAIL ===')
  for (const i of issues) {
    console.log(`${i.num.padStart(3)} ${i.locale} ${i.field.padEnd(18)} ${i.kind.padEnd(20)} ${i.detail}  | ${i.name.slice(0, 34)}`)
  }

  console.log('\n=== PRODUCTS AFFECTED ===')
  const byProduct = new Map<string, string[]>()
  for (const i of issues) {
    const k = `${i.num} ${i.name}`
    byProduct.set(k, [...(byProduct.get(k) || []), `${i.locale}:${i.field}:${i.kind}`])
  }
  console.log(`${byProduct.size} of ${products.length} products have at least one issue`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
