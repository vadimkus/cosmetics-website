/**
 * Product 59 (DEEP MOISTURIZING BEAUTY BOX): rewrite the kit description so
 * every claim traces to a manufacturer document, and drop the four that do not.
 *
 * The box holds five products that each have their own paperwork. Everything
 * kept below is quoted from, or paraphrased from, one of these:
 *
 *   Snow O₂ 180ml     label artwork + INCI
 *                     "SOC is a gentle cleanser which gives an excellent
 *                      treatment sensation. Naturally generated oxygen bubbles
 *                      clean make-up dirts and skin impurities without
 *                      irritation to skin."
 *                     "Apply the product on dry face, avoiding eyes. When oxygen
 *                      bubbles occur, give a circular massage and rinse off with
 *                      tepid water."   pH 5.86 (COA WIE048)
 *   Snow Booster 200ml label artwork + INCI
 *                     "SBT is a daily toner for all skin types. It moisturizes
 *                      and soothes skin with various botanical extracts, and it
 *                      refines skin with pH balancing after cleansing."
 *                     "It can be used even on the make up."   pH 6.08 (COA WID041)
 *   Hyaluron Serum    DTS MG 15-slide deck + formula (22 Jun 2024)
 *                     PENTAVITIN™ = Saccharide Isomerate, "moisture magnet";
 *                     Glyceryl Glucoside, "aquaporin stimulator";
 *                     clinical: 21 adult women 20-59, deep skin hydration
 *                     "significantly improved immediately after use"
 *                     (50.81 -> 52.238).   pH 5.08 (COA)
 *   Hyaluron Cream    DTS MG 22-slide deck + 250g artwork INCI
 *                     "skin hydration value increased by 82%" immediately after
 *                     use, "significantly improved immediately after use and 72
 *                     hours after use", "72-hour hydration persistence effect
 *                     after single application", 21 adult women 20-59;
 *                     Xylitol + Erythritol as natural-origin cooling agents;
 *                     Sodium Hyaluronate 1,000.9 ppm.   pH 6.00 (COA)
 *   Sea Algae Mask    label artwork + ingredient report
 *                     "Eucalace® sheet: excellent air permeability, highly
 *                      adhesive, high transmission of essence to skin";
 *                     Jania Rubens 10 ppm, Undaria Pinnatifida 10 ppm,
 *                     Centella Asiatica.   pH 5.69 (COA LE001), 15-20 minutes
 *
 * Removed, with the reason:
 *
 *   "Coconut Water Complex (78%)"    The serum deck claims 78%. The formula
 *                                    signed by DTS MG's own R&D manager puts
 *                                    Cocos Nucifera Water at 0.79595%. A
 *                                    manufacturer sales slide does not outrank
 *                                    the registered ingredient declaration, so
 *                                    the number goes and the ingredient stays.
 *   "oxygen therapy mechanism"       Not a phrase in any Snow O₂ document. The
 *                                    label says "naturally generated oxygen
 *                                    bubbles", which is what we say now.
 *   "Phytolex SC" (as Snow O₂)       Appears in no Snow O₂ formula, label or
 *                                    COA. It is a marketing name, and the only
 *                                    label that carries it is the Russian Snow
 *                                    Booster one, for a different product.
 *   "MultiEx Phytrogen"              Same: appears in no document for either
 *                                    product. The soy isoflavones and botanical
 *                                    extracts it stood for are real and named.
 *   "Hyaluronan 11 Multi-Complex"    Kept as the manufacturer's complex name is
 *                                    defensible, but the literal "11 types" is
 *                                    not: both decks list 8 hyaluronate INCI
 *                                    names. Described by what it does instead.
 *   "72-Hour Hydration" on serum     The 72-hour test is the cream's. The serum
 *                                    deck only measures immediately after use.
 *
 * The prices in the copy were re-verified against the live records on
 * 13 Aug 2026: 330 + 260 + 330 + 290 + (3 x 36) = 1,318.00, and the box at
 * 1,120.30 is exactly 85% of that, a 197.70 saving.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/fix-product-59-deep-moisturizing-box-claims-20260813.ts
 *   npx tsx --env-file=.env.local scripts/fix-product-59-deep-moisturizing-box-claims-20260813.ts --commit
 */

import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

const databaseUrl = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL or PRISMA_DATABASE_URL is required')

const prisma = new PrismaClient(
  databaseUrl.includes('prisma.io') || databaseUrl.includes('accelerate')
    ? { accelerateUrl: databaseUrl, log: ['error'] }
    : ({ datasourceUrl: databaseUrl, log: ['error'] } as never)
)

const COMMIT = process.argv.includes('--commit')

const DESCRIPTION = `A five-step hydration routine for dry and dehydrated skin, boxed together for 15% less than the same five products cost separately.

Every item is the full retail size, not a sample.

1. SNOW O₂ CLEANSER 180ml (1 pc) = 330 AED
Gentle cleanser applied to a dry face, where naturally generated oxygen bubbles lift make-up and impurities without scrubbing. Massage in circles as the bubbles appear, then rinse with tepid water. pH 5.86.

2. SNOW BOOSTER 200ml (1 pc) = 260 AED
Daily toner for all skin types. Moisturises and soothes with botanical extracts, and refines the skin by rebalancing pH after cleansing. Can be used over make-up. Key ingredients: Betaine, Lactobacillus/Pumpkin Ferment Extract, Nelumbo Nucifera Flower Extract, Beta-Glucan.

3. MOISTURE REPLENISHING HYALURON SERUM 30ml (1 pc) = 330 AED
Hydrating serum built on a hyaluronic acid complex spanning low, medium and high molecular weights, so moisture is replenished layer by layer and then held at the surface. Glyceryl Glucoside supports the skin's own water-transport channels, PENTAVITIN™ (Saccharide Isomerate) binds moisture to the skin, and a mushroom complex nourishes alongside. In the manufacturer's clinical test on 21 women aged 20 to 59, deep skin hydration improved significantly immediately after a single use. Key ingredients: Hyaluronic acid complex, Glyceryl Glucoside, PENTAVITIN™, Cocos Nucifera (Coconut) Water, Tremella Fuciformis and mushroom complex, Solanum Melongena (Eggplant) Fruit Extract.

4. MOISTURE REPLENISHING HYALURON CREAM 50g (1 pc) = 290 AED
Refreshing moisturiser that seals the routine in and strengthens the moisture barrier, with the same hyaluronic acid complex plus xylitol and erythritol for an instant cooling effect on contact. In the manufacturer's clinical test on 21 women aged 20 to 59, skin hydration rose 82% immediately after a single application and was still measurably higher 72 hours later. Key ingredients: Hyaluronic acid complex (Sodium Hyaluronate 1,000 ppm), Glyceryl Glucoside, PENTAVITIN™, Xylitol, Erythritol, Tremella Fuciformis and mushroom complex, Aloe Barbadensis Flower Extract.

5. SOOTHING BOMB SEA ALGAE MASK (3 pcs) x 36 AED = 108 AED
Eucalace® sheet mask with a sea algae complex (Jania Rubens, Undaria Pinnatifida) and Centella Asiatica extract. Leave on for 15 to 20 minutes, then pat in what is left of the essence.

Bought separately: 1,318 AED. In this box: 1,120.30 AED. You save 197.70 AED.

Order of use: cleanse, tone, serum, cream. On the nights you use a sheet mask, apply it after toning and carry on with the serum and cream afterwards. Three sheets come in the box, so treat them as a boost for tight, stressed skin rather than a weekly fixture.

Made in Korea by DTS MG. Every item is dermatologically tested. The cleanser and the cream are fragranced, so if fragrance is a problem for your skin, the Sensitive Skin Beauty Box is the better match.`

async function main() {
  const before = await prisma.product.findFirst({
    where: { productNumber: '59' },
    select: { id: true, name: true, description: true, descriptionRu: true, descriptionAr: true },
  })
  if (!before) throw new Error('Product 59 not found')

  const stamp = new Date().toISOString().slice(0, 10)
  const backup = `/tmp/product-59-description-backup-${stamp}.json`
  writeFileSync(backup, JSON.stringify(before, null, 2))

  const dropped = ['78%', 'oxygen therapy', 'Phytolex', 'MultiEx Phytrogen', 'Hyaluronan 11']
  console.log(`Product 59: ${before.name}`)
  console.log(`Backup written to ${backup}`)
  console.log(`\nDescription: ${before.description?.length ?? 0} chars -> ${DESCRIPTION.length} chars`)
  console.log('\nUnsourced claims in the current text:')
  for (const claim of dropped) {
    const was = before.description?.includes(claim) ?? false
    const is = DESCRIPTION.includes(claim)
    console.log(`  ${claim.padEnd(20)} before=${was ? 'PRESENT' : 'absent '} after=${is ? 'PRESENT' : 'absent'}`)
  }

  if (!COMMIT) {
    console.log('\nDry run. Re-run with --commit to write.')
    await prisma.$disconnect()
    return
  }

  await prisma.product.update({
    where: { id: before.id },
    data: { description: DESCRIPTION },
  })
  const after = await prisma.product.findUnique({
    where: { id: before.id },
    select: { description: true },
  })
  const leftovers = dropped.filter(c => after?.description?.includes(c))
  console.log(`\nWritten. Remaining unsourced claims: ${leftovers.length ? leftovers.join(', ') : 'none'}`)
  await prisma.$disconnect()
}

main()
