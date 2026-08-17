/**
 * Append EN Full INCI card(s) into AR/RU static translation ingredient JSON.
 * INCI nomenclature stays English.
 *
 *   npx tsx --env-file=.env.local scripts/sync-full-inci-locale-files.ts
 *   npx tsx --env-file=.env.local scripts/sync-full-inci-locale-files.ts --apply
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { prisma } from '../lib/prisma'
import { productTranslations, type ProductTranslation } from '../data/productTranslations'
import { productTranslationsRu } from '../data/productTranslationsRu'

type Card = { name?: string; description?: string; subList?: string[] }

function mergeFullInci(existingJson: string | null | undefined, fullCards: Card[]): string | null {
  if (existingJson == null) return null
  let cards: Card[] = []
  try {
    const parsed = JSON.parse(existingJson)
    if (Array.isArray(parsed)) cards = parsed
    else return existingJson
  } catch {
    return existingJson
  }
  // Skip string-only arrays (legacy shape without name/description objects)
  if (cards.length && typeof cards[0] === 'string') return existingJson
  const without = cards.filter((c) => !String(c?.name || '').toLowerCase().includes('inci'))
  return JSON.stringify([...without, ...fullCards])
}

function serializeTs(
  exportName: string,
  map: Record<string, ProductTranslation>,
  header: string,
  footer: string,
): string {
  const parts: string[] = [header, `export const ${exportName}: Record<string, ProductTranslation> = {\n`]
  for (const id of Object.keys(map)) {
    const t = map[id]
    parts.push(`  '${id}': {\n`)
    for (const key of Object.keys(t) as (keyof ProductTranslation)[]) {
      const val = t[key]
      if (val === undefined) continue
      if (val === null) parts.push(`    ${key}: null,\n`)
      else parts.push(`    ${key}: ${JSON.stringify(val)},\n`)
    }
    parts.push(`  },\n`)
  }
  parts.push(`}\n\n`, footer)
  return parts.join('')
}

async function main() {
  const apply = process.argv.includes('--apply')
  const products = await prisma.product.findMany({
    where: { ingredients: { not: null } },
    select: { id: true, productNumber: true, ingredients: true },
  })

  const byId = new Map<string, Card[]>()
  for (const p of products) {
    // Many catalog SKUs use numeric id with null productNumber
    const key = p.productNumber || p.id
    if (!key) continue
    let cards: Card[] = []
    try {
      const parsed = JSON.parse(p.ingredients || '[]')
      if (Array.isArray(parsed)) cards = parsed
    } catch {
      continue
    }
    const full = cards.filter((c) => String(c.name || '').toLowerCase().includes('inci'))
    if (full.length) byId.set(key, full)
  }

  let arN = 0
  let ruN = 0
  const arNext: Record<string, ProductTranslation> = { ...productTranslations }
  const ruNext: Record<string, ProductTranslation> = { ...productTranslationsRu }

  for (const [id, full] of byId) {
    if (arNext[id] && arNext[id].ingredients != null) {
      const merged = mergeFullInci(arNext[id].ingredients, full)
      if (merged && merged !== arNext[id].ingredients) {
        arNext[id] = { ...arNext[id], ingredients: merged }
        arN++
        console.log('AR', id, '→', full.length, 'Full INCI card(s)')
      }
    }
    if (ruNext[id] && ruNext[id].ingredients != null) {
      const merged = mergeFullInci(ruNext[id].ingredients, full)
      if (merged && merged !== ruNext[id].ingredients) {
        ruNext[id] = { ...ruNext[id], ingredients: merged }
        ruN++
        console.log('RU', id, '→', full.length, 'Full INCI card(s)')
      }
    }
  }

  console.log(`Would update AR=${arN} RU=${ruN}`)
  if (!apply) {
    console.log('DRY RUN — pass --apply to write data/productTranslations*.ts')
    return
  }

  const arHeader = `/**
 * Product translations mapping
 * Maps product IDs to their Arabic translations
 *
 * Structure:
 * - description: Arabic description
 * - productDetails: Arabic product details (JSON string)
 * - keyFeatures: Arabic key features (JSON array string)
 * - benefits: Arabic benefits (JSON array string)
 * - ingredients: Arabic ingredients (JSON array string)
 * - howToUse: Arabic usage instructions
 * - directions: Arabic directions
 *
 * Full INCI cards are copied from EN Intertek lists (INCI names stay English).
 */

export interface ProductTranslation {
  description?: string
  productDetails?: string
  keyFeatures?: string | null
  benefits?: string
  ingredients?: string | null
  howToUse?: string
  directions?: string
}

`
  const arFooter = `/**
 * Get a specific Arabic translation field for a product
 * @param productId - Product ID
 * @param field - Field name to translate
 * @returns Arabic translation or null if not available
 */
export function getProductTranslation(
  productId: string,
  field: keyof ProductTranslation
): string | null {
  const translation = productTranslations[productId]
  return translation?.[field] || null
}

/**
 * Get all Arabic translations for a product
 * @param productId - Product ID
 * @returns ProductTranslation object or null
 */
export function getProductTranslations(productId: string): ProductTranslation | null {
  return productTranslations[productId] || null
}
`

  const ruHeader = `/**
 * Product translations mapping (Russian)
 * Full INCI cards are copied from EN Intertek lists (INCI names stay English).
 */

import type { ProductTranslation } from './productTranslations'

`
  // Check if Ru file defines its own interface
  const ruFooter = `export function getProductTranslationRu(
  productId: string,
  field: keyof ProductTranslation
): string | null {
  const translation = productTranslationsRu[productId]
  return translation?.[field] || null
}

export function getProductTranslationsRu(productId: string): ProductTranslation | null {
  return productTranslationsRu[productId] || null
}
`

  const root = join(process.cwd(), 'data')
  writeFileSync(
    join(root, 'productTranslations.ts'),
    serializeTs('productTranslations', arNext, arHeader, arFooter),
    'utf8',
  )
  // Ru file may export interface locally — keep import style matching current file
  const ruTop = `/**
 * Russian product translations
 * Full INCI cards are copied from EN Intertek lists (INCI names stay English).
 */

export interface ProductTranslation {
  description?: string
  productDetails?: string
  keyFeatures?: string | null
  benefits?: string
  ingredients?: string | null
  howToUse?: string
  directions?: string
}

`
  writeFileSync(
    join(root, 'productTranslationsRu.ts'),
    serializeTs('productTranslationsRu', ruNext, ruTop, ruFooter),
    'utf8',
  )
  console.log('Wrote data/productTranslations.ts and data/productTranslationsRu.ts')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
