/**
 * Product 43 (HR³ MATRIX HAIR TONIC α) carried the pre-α ingredient declaration.
 *
 * The stored Full INCI matched Intertek/NATUZEN "HR³ MATRIX HAIR TONIC" (Ingredient
 * lists_old/HR3 MATRIX HAIR TONIC.pdf) — the older formula. It listed Methylparaben,
 * Propylene Glycol, PEG-40 Hydrogenated Castor Oil, PEG-12 Dimethicone, Tetrasodium
 * EDTA, Bergamot Fruit Oil, Punica Granatum, Coix and Artemisia, none of which are in
 * the α formula, and omitted Copper Tripeptide-1, Caffeine, Centella Asiatica,
 * Scutellaria Baicalensis, Polygonum Cuspidatum, Licorice Root and Tocopherol, all of
 * which are. The key-ingredient rows were already written against the α formula, so the
 * declaration contradicted them.
 *
 * Source of truth: Registration DOC/Formula_up/Formula-GENOSYS HR³ MATRIX HAIR TONIC α.pdf
 * (DTS MG Co., Ltd., signed Narae Han, R&D manager). Order and wording follow that filing.
 *
 * Usage: npx tsx --env-file=.env.local scripts/fix-product-43-alpha-inci.ts [--apply]
 */
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')

const ALPHA_INCI =
  'Aqua (Water), Alcohol Denat., Dipropylene Glycol, Ethoxydiglycol, Copper Tripeptide-1, ' +
  'Sophora Japonica Extract, Acorus Calamus Root Extract, Panthenol, Centella Asiatica Extract, ' +
  'Scutellaria Baicalensis Root Extract, Polygonum Cuspidatum Root Extract, ' +
  'Glycyrrhiza Glabra (Licorice) Root Extract, Camellia Sinensis Leaf Extract, Menthol, ' +
  'Salicylic Acid, Caffeine, Ascorbic Acid, Tocopherol, Allantoin, 1,2-Hexanediol, Sodium Citrate, ' +
  'PEG-60 Hydrogenated Castor Oil, Citric Acid, Butylene Glycol, Methyl Diisopropyl Propionamide, ' +
  'Menthyl Lactate, Ethylhexylglycerin, Disodium EDTA, Glycerin, ' +
  'Rosmarinus Officinalis (Rosemary) Leaf Extract, Chamomilla Recutita (Matricaria) Flower Extract.'

async function main() {
  const p = await prisma.product.findFirst({ where: { OR: [{ productNumber: '43' }, { id: '43' }] } })
  if (!p) throw new Error('Product 43 not found')

  const row = p as unknown as Record<string, unknown>
  const raw = row.ingredients as string | null
  if (!raw) throw new Error('Product 43 has no ingredients')

  const list = JSON.parse(raw) as Array<{ name?: string; description?: string }>
  const inci = list.find((i) => /inci/i.test(i.name ?? ''))
  if (!inci) throw new Error('Product 43 has no Full INCI row')

  const dir = join(process.cwd(), 'docs', 'backups')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, 'product-43-ingredients-before-2026-08-12.json')
  writeFileSync(file, JSON.stringify({ id: p.id, ingredients: raw }, null, 2))

  console.log('BEFORE:\n', inci.description, '\n')
  console.log('AFTER:\n', ALPHA_INCI, '\n')

  if (inci.description === ALPHA_INCI) {
    console.log('already correct, nothing to do')
    return
  }

  inci.description = ALPHA_INCI

  if (APPLY) {
    await prisma.product.update({ where: { id: p.id }, data: { ingredients: JSON.stringify(list) } })
    console.log('applied')
  } else {
    console.log('DRY RUN — pass --apply to write')
  }
  console.log(`backup written to ${file}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
