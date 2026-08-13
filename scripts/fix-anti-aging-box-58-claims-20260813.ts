/**
 * Product 58 (ANTI-AGING BEAUTY BOX) — align the kit copy with the cartons.
 *
 * Verified against Intertek:
 *  - MFC carton reads NET WT. 50g, not 50ml.
 *  - MFC quali-quanti has no peptide of any kind and its brand deck never
 *    mentions one; the carton credits "propolis and collagen". "Anti-aging
 *    Peptide 6" is the serum's six-peptide complex (MFS deck names all six).
 *  - The mask sachet says "COLLAGEN AND VARIOUS BOTANICAL EXTRACTS" and its
 *    quali-quanti has no peptide either.
 *
 * Run with --commit to write. English lives in the database; Russian and
 * Arabic live in the locale bundles and are patched by scripts/tmp/locales58.mjs.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL required')
const prisma = new PrismaClient(
  url.includes('prisma.io') || url.includes('accelerate')
    ? { accelerateUrl: url, log: ['error'] }
    : ({ datasourceUrl: url, log: ['error'] } as never)
)

const COMMIT = process.argv.includes('--commit')

const RULES: [RegExp, string][] = [
  // Item 3 — name casing only, the serum's peptide claims are correct.
  [
    /3\. Multi Functional Anti-wrinkle serum 30ml \(1pcs\) = 330 AED/,
    '3. Multi Functional Anti-Wrinkle Serum 30ml (1 pcs) = 330 AED',
  ],
  [/nourishing ingredient – bakuchiol/g, 'nourishing ingredient - bakuchiol'],
  // Item 4 — carton weight, and the cream's own actives instead of the serum's.
  [
    /4\. Multifunctional Anti-Wrinkle cream 50ml \(1 pcs\) = 290 AED/,
    '4. Multi Functional Anti-Wrinkle Cream 50g (1 pcs) = 290 AED',
  ],
  [
    /Anti-aging cream with bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex\. It is an anti-aging cream that helps visibly smooth the signs of wrinkles and reinforces skin firmness with a nourishing ingredient - bakuchiol, a natural alternative to retinol and anti-wrinkle peptide complex\./,
    'Anti-aging cream with bakuchiol, a natural alternative to retinol. It helps visibly smooth the signs of wrinkles and reinforce skin firmness with a nourishing ingredient - bakuchiol, a natural alternative to retinol - and the skin-firming pair propolis and collagen.',
  ],
  [
    /Key ingredients: Bakuchiol, Anti-aging Peptide 6, Lipid Barrier Liposome \(Ceramide NP, Cholesterol, Phytosphingosine\), Collagen, Elastin, Propolis Extract, Adenosine, Niacinamide\.\n\n5\./,
    'Key ingredients: Bakuchiol, Propolis Extract, Hydrolyzed Collagen & Elastin, Adenosine, Niacinamide, Mango Seed Butter, Lipid Barrier Liposome (Ceramide NP, Cholesterol, Phytosphingosine).\n\n5.',
  ],
  // Item 5 — real product name, and the sachet's own claim.
  [
    /5\. Collagen mask \(5 pcs\) x 36 AED = 180 AED/,
    '5. Intensive Repair Collagen Mask (5 pcs) x 36 AED = 180 AED',
  ],
  [
    /Revitalizing sheet mask that provides intensive hydration and collagen support for youthful, lifted skin\. It helps improve skin elasticity and firmness while providing deep moisturization\. The mask delivers collagen and anti-aging peptides directly to the skin for enhanced anti-aging benefits\. Key ingredients: Hydrolyzed Collagen, Hyaluronic Acid, Peptides, Botanical Extracts\./,
    'Revitalizing sheet mask that improves skin firmness and protects the skin barrier by soothing and hydrating the skin with collagen and various botanical extracts. It helps improve skin elasticity and firmness while providing deep moisturization. Key ingredients: Hydrolyzed Collagen, Sodium Hyaluronate, Witch Hazel, Grapefruit, Centella Asiatica, Pomegranate and Soybean Extracts.',
  ],
]

async function main() {
  const row = (await prisma.product.findFirst({ where: { productNumber: '58' } })) as any
  if (!row) throw new Error('product 58 not found')

  let text: string = row.description
  for (const [re, to] of RULES) {
    if (!re.test(text)) throw new Error(`rule did not match: ${re.source.slice(0, 70)}`)
    text = text.replace(re, to)
  }

  for (const bad of ['Peptides, Botanical Extracts', '50ml (1 pcs) = 290']) {
    if (text.includes(bad)) throw new Error(`still present after fix: ${bad}`)
  }
  // Peptide 6 belongs to the serum and only the serum.
  const peptideMentions = text.split('Anti-aging Peptide 6').length - 1
  if (peptideMentions !== 1) throw new Error(`expected 1 Peptide 6 mention, found ${peptideMentions}`)
  const creamBlock = text.slice(text.indexOf('\n4. '), text.indexOf('\n5. '))
  if (/peptide/i.test(creamBlock)) throw new Error('cream block still claims a peptide')

  console.log(text.split(/\n(?=[345]\. )/).slice(1).join('\n\n----------\n'))

  if (!COMMIT) return console.log('\n(dry run — pass --commit to write)')
  await prisma.product.update({ where: { id: row.id }, data: { description: text } })
  console.log('\nwritten to database')
}

main().finally(() => prisma.$disconnect())
