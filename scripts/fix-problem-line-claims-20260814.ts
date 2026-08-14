/**
 * Problem line (#15 toner, #20 serum, #30 cream) — claim corrections, 14 Aug 2026
 *
 * Follow-up to the #55 box work. Verifying the box surfaced three problems that
 * live on the member products themselves, not on the box.
 *
 * 1. ANTIMICROBIAL AS A HEADLINE CLAIM.
 *    The cream's description and benefits were rewritten on 14 Aug to drop
 *    "anti-microbial" and "kills acne-causing bacteria" — that is drug register on
 *    a cosmetic. Two places were missed: productDetails and two ingredient cards.
 *    The toner carries the same phrasing on its tea tree card. The manufacturer's
 *    own deck does say "antimicrobial and anti-inflammatory" (Professional 2025,
 *    slide 26), so the claim has a source; it is the register that is wrong for a
 *    consumer page in this market, and it should read the same way across the line.
 *
 * 2. WILLOW BARK SOLD AS AN EXFOLIANT.
 *    The serum card called Salix Nigra a "natural salicylic acid source that gently
 *    exfoliates". The serum INCI declares it at 0.001% — 10 ppm. It is a genuine
 *    ingredient and stays named, accurately, as a clarifying botanical. It is not
 *    the exfoliating step and should not be sold as one. (The serum contains no
 *    salicylic acid of its own; that is the toner, at 0.001%.)
 *
 * 3. "CLINICALLY PROVEN" ON THE SERUM.
 *    The four-week figures come from the DTS MG deck with no named testing house
 *    and no volunteer count. "Dermatologically tested" is supported by the QACS
 *    patch test. "Clinically proven" is a step beyond what is on file.
 *
 * Verified against:
 *   Formula-GENOSYS INTENSIVE PROBLEM CONTROL TONER.pdf (31 ingredients, exact %)
 *   Ingredient lists_old/GENOSYS PROBLEM CONTROL SERUM.pdf
 *   Ingredient lists_old/GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf
 *   GENOSYS FACIAL TREATMENT_Professional_2025.pptx slides 26, 27, 29, 32
 *
 * NOT changed on purpose: the site's Full INCI strings mirror the printed cartons,
 * including the Zinc PCA ordering error on the cream and the serum. The pack is
 * what the customer holds, so the site should agree with it. The reorder is logged
 * as an artwork correction instead.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const accel = url.startsWith('prisma://') || url.startsWith('prisma+postgres://')
const prisma = new PrismaClient(accel ? { accelerateUrl: url } : ({ datasourceUrl: url } as never))

const DRY = !process.argv.includes('--apply')

type Rule = { from: string; to: string }

const RULES: Record<string, Rule[]> = {
  // ---- #15 INTENSIVE PROBLEM CONTROL TONER ----------------------------------
  '15': [
    {
      from: 'Powerful antimicrobial and anti-inflammatory duo that helps combat acne-causing bacteria while soothing irritated skin.',
      to: 'The classic blemish botanical, here as both extract and leaf oil. It calms the look of angry spots and leaves problem areas feeling clean and fresh.',
    },
    {
      from: 'Skin Soothing - Calms irritated and sensitive skin with anti-inflammatory properties',
      to: 'Skin Soothing - Calms the look of redness on irritated, sensitive skin',
    },
  ],

  // ---- #20 PROBLEM CONTROL SERUM -------------------------------------------
  '20': [
    {
      from: '"name":"Willow Bark Extract"',
      to: '"name":"Salix Nigra (Willow) Bark Extract"',
    },
    {
      from: 'Natural salicylic acid source that gently exfoliates and helps clear clogged pores.',
      to: 'The traditional clarifying botanical, working alongside zinc PCA to keep pores looking clear and skin texture refined.',
    },
    {
      from: '"testing":"Dermatologically tested and clinically proven"',
      to: '"testing":"Dermatologically tested"',
    },
  ],

  // ---- #30 INTENSIVE PROBLEM CONTROL CREAM ---------------------------------
  '30': [
    {
      from: '"technology":"Advanced anti-microbial and anti-inflammatory formula"',
      to: '"technology":"Sebum-regulating cream formula"',
    },
    {
      from: '"keyBenefits":"Sebum control, anti-microbial, anti-inflammatory, soothing relief"',
      to: '"keyBenefits":"Sebum control, breakout prevention, soothing comfort, lasting hydration"',
    },
    {
      from: 'A powerful sebum-regulating ingredient that helps control oil production and has antimicrobial properties to prevent breakouts and maintain clear skin.',
      to: 'The oil-control ingredient at the centre of this cream. It keeps sebum in check, which is what keeps pores clear and breakouts less frequent.',
    },
    {
      from: "A probiotic ingredient that helps balance the skin's microbiome, providing natural antimicrobial benefits and supporting healthy skin flora.",
      to: "A pumpkin ferment that helps keep the skin's own microbiome in balance, so oily skin stays comfortable rather than reactive.",
    },
    {
      from: 'Provides deep hydration and has anti-inflammatory properties that help soothe irritated skin while promoting healing and skin barrier function.',
      to: 'Deep hydration plus real comfort. It settles skin that has been irritated by other blemish products and helps the barrier hold together.',
    },
    {
      from: "A natural immune-boosting ingredient that helps strengthen the skin's defense mechanisms, reduce inflammation, and promote healing.",
      to: "A natural soother that strengthens the skin's own defences and takes the heat out of angry areas.",
    },
  ],
}

const FIELDS = ['description', 'ingredients', 'keyFeatures', 'benefits', 'productDetails'] as const

async function main() {
  const all = await prisma.product.findMany({
    select: { id: true, productNumber: true, name: true, description: true, ingredients: true, keyFeatures: true, benefits: true, productDetails: true },
  })

  let totalHits = 0
  const misses: string[] = []

  for (const [key, rules] of Object.entries(RULES)) {
    const p = all.find((x) => (x.productNumber ?? x.id) === key)
    if (!p) {
      misses.push(`product ${key} not found`)
      continue
    }

    const patch: Record<string, string> = {}
    for (const rule of rules) {
      let landed = false
      for (const f of FIELDS) {
        const current = patch[f] ?? (p[f] as string | null)
        if (!current || !current.includes(rule.from)) continue
        const next = current.split(rule.from).join(rule.to)
        patch[f] = next
        landed = true
        totalHits += 1
        console.log(`#${key} ${f}: ${rule.from.slice(0, 62)}...`)
      }
      if (!landed) misses.push(`#${key} MISS: ${rule.from.slice(0, 62)}`)
    }

    if (Object.keys(patch).length && !DRY) {
      await prisma.product.update({ where: { id: p.id }, data: patch })
      console.log(`  -> wrote ${Object.keys(patch).join(', ')} on #${key}\n`)
    }
  }

  if (misses.length) {
    console.log('\nMISSES:')
    misses.forEach((m) => console.log(' ', m))
  }
  console.log(`\n${DRY ? 'DRY RUN' : 'APPLIED'} — ${totalHits} replacements, ${misses.length} misses`)
  await prisma.$disconnect()
  if (misses.length) process.exitCode = 1
}

main().catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
