/**
 * Batch-6 Intertek audit fixes — HAIR / EYE / DEVICES / PRO AMPOULES.
 *
 * Evidence: docs/audit/2026-07-29_INTERTEK_AUDIT_REPORT.md (batch 6).
 * Key fixes:
 * - All 6 Power Solutions: sh-Polypeptide-7 misdescribed as "human growth
 *   hormone-like peptide" (it's an IGF-1-analog, classified anti-acne agent in
 *   COTDE docs) — corrected on every ampoule.
 * - Hair Tonic α: sh-Polypeptide-71 + Pentapeptide-20 + 5 botanicals absent from
 *   formula (panel was copy-pasted from Hair Solution + invented peptide).
 * - Hair Solution α: Pentapeptide-20 + 5 botanicals absent (real: sh-P71, Cu-TP1,
 *   EGF sh-Oligo-1, sh-P9, Saw Palmetto, Niacinamide).
 * - Scalp Peeling α: Grapefruit Seed Oil + Sophora absent from α formula.
 * - Eye Peptide Gel Patch: peptide panel copy-pasted from Eye Contour Cream —
 *   rewritten from current DTS MG formula (Niacinamide 2%, Madecassoside, etc).
 * - Microneedle Roller: "FDA-approved" undocumented → CE/ISO 13485 wording.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-intertek-audit-batch6-hair-eye-pro.ts
 */
import { prisma } from '../lib/prisma'

const j = (v: unknown) => JSON.stringify(v)

const SH_P7_NAME = 'sh-Polypeptide-7'
const SH_P7_DESC =
  'IGF-1-analog peptide that supports skin regeneration and healing processes.'

async function main() {
  // ── All 6 POWER SOLUTIONS — fix sh-Polypeptide-7 description ─────────────
  const codes = ['HES', 'CVS', 'SWS', 'CTS', 'PCS', 'AWS']
  for (const code of codes) {
    const p = await prisma.product.findFirst({ where: { name: { contains: `POWER SOLUTION ${code}` } } })
    if (!p) continue
    let changed = false
    let ingredients = p.ingredients
    if (ingredients?.includes('growth hormone')) {
      ingredients = ingredients.replace(/Human growth hormone-like peptide that stimulates skin regeneration and healing( processes)?\./g, SH_P7_DESC)
      changed = true
    }
    let keyFeatures = p.keyFeatures
    if (keyFeatures?.includes('growth hormone')) {
      keyFeatures = keyFeatures.replace(/a human growth hormone-like peptide for enhanced skin regeneration/g, 'an IGF-1-analog peptide for enhanced skin regeneration')
      changed = true
    }
    const data: Record<string, string> = {}
    if (changed) {
      if (ingredients !== p.ingredients) data.ingredients = ingredients!
      if (keyFeatures !== p.keyFeatures) data.keyFeatures = keyFeatures!
      await prisma.product.update({ where: { id: p.id }, data })
    }
    console.log(`✓ POWER SOLUTION ${code} sh-P7 wording ${changed ? 'fixed' : 'checked'}`)
  }

  // ── CVS — Lactobacillus Ferment Lysate → Soymilk Ferment Filtrate ────────
  const cvs = await prisma.product.findFirst({ where: { name: { contains: 'POWER SOLUTION CVS' } } })
  if (cvs?.ingredients?.includes('Lactobacillus Ferment Lysate')) {
    await prisma.product.update({
      where: { id: cvs.id },
      data: {
        ingredients: cvs.ingredients
          .replace('"Lactobacillus Ferment Lysate"', '"Lactobacillus/Soymilk Ferment Filtrate"')
          .replace('Probiotic ingredient that supports skin\'s natural barrier and overall health.', 'Probiotic ferment filtrate (2.5%) that supports skin\'s natural barrier and overall health.'),
      },
    })
    console.log('✓ CVS Lactobacillus INCI corrected')
  }

  // ── AWS — add Arbutin 2% + Ceramide 3 naming ─────────────────────────────
  const aws = await prisma.product.findFirst({ where: { name: { contains: 'POWER SOLUTION AWS' } } })
  if (aws) {
    const ing = JSON.parse(aws.ingredients ?? '[]') as Array<{ name: string; description: string }>
    if (!ing.some((i) => i.name.includes('Arbutin'))) {
      ing.splice(1, 0, { name: 'Arbutin 2%', description: 'Major brightening active (2%) that helps inhibit melanin formation and even skin tone.' })
    }
    const cer = ing.find((i) => i.name === 'Ceramide')
    if (cer) cer.name = 'Ceramide 3 (Ceramide NP)'
    await prisma.product.update({ where: { id: aws.id }, data: { ingredients: j(ing) } })
    console.log('✓ AWS Arbutin 2% added + Ceramide 3 named')
  }

  // ── HR³ HAIR TONIC α — rebuild from real formula ─────────────────────────
  const tonic = await prisma.product.findFirst({ where: { name: { contains: 'HAIR TONIC' } } })
  if (tonic) {
    await prisma.product.update({
      where: { id: tonic.id },
      data: {
        keyFeatures: j([
          { title: 'Copper Tripeptide-1', description: 'Scalp peptide that supports follicle health and hair strength.' },
          { title: 'Scalp-Clearing Complex', description: 'Salicylic Acid (0.25%) with Menthol keeps follicles clear and the scalp refreshed.' },
          { title: 'Botanical Soothing Blend', description: 'Sophora Japonica, Centella Asiatica, Scutellaria Baicalensis and Licorice root extracts nourish and calm the scalp.' },
        ]),
        ingredients: j([
          { name: 'Copper Tripeptide-1', description: 'Promotes collagen synthesis and supports hair strength and follicle health.' },
          { name: 'Sophora Japonica Extract', description: 'Antioxidant botanical that helps protect the scalp environment.' },
          { name: 'Salicylic Acid', description: 'Scalp keratolytic (0.25%) that helps keep follicles clear of buildup.' },
          { name: 'Menthol', description: 'Refreshing cooling agent (0.30%) that soothes the scalp.' },
          { name: 'Caffeine', description: 'Well-known scalp stimulant that supports the hair-anchoring environment.' },
          { name: 'Centella Asiatica + Scutellaria Baicalensis + Licorice Root', description: 'Soothing botanical trio that calms and conditions the scalp.' },
          { name: 'Allantoin', description: 'Skin-comforting agent that keeps the scalp calm during daily use.' },
        ]),
      },
    })
    console.log('✓ HAIR TONIC α fixed (sh-P71/Pentapeptide-20/5 invented botanicals removed)')
  }

  // ── HR³ HAIR SOLUTION α — rebuild from real formula ──────────────────────
  const sol = await prisma.product.findFirst({ where: { name: { contains: 'HAIR SOLUTION' } } })
  if (sol) {
    await prisma.product.update({
      where: { id: sol.id },
      data: {
        keyFeatures: j([
          { title: 'Advanced Peptide Technology', description: 'sh-Polypeptide-71, Copper Tripeptide-1, sh-Oligopeptide-1 (EGF) and sh-Polypeptide-9 for targeted hair follicle support.' },
          { title: 'Saw Palmetto (Serenoa Serrulata)', description: 'Botanical DHT-pathway support for thinning hair — the formula\'s key anti-hair-loss botanical.' },
          { title: 'Scalp Circulation Enhancement', description: 'Niacinamide and Menthol work together to refresh the scalp and support nutrient delivery to hair follicles.' },
        ]),
        ingredients: j([
          { name: 'Peptide Complex', description: 'sh-Polypeptide-71 and sh-Polypeptide-9 support hair follicle health; Copper Tripeptide-1 promotes collagen synthesis and hair strength; sh-Oligopeptide-1 (EGF) supports scalp skin renewal.' },
          { name: 'Saw Palmetto (Serenoa Serrulata) Fruit Extract', description: 'Documented botanical for DHT-related hair thinning — supports a healthy follicle environment.' },
          { name: 'Niacinamide', description: 'Vitamin B3 that supports scalp barrier function and circulation.' },
          { name: 'Menthol', description: 'Provides a refreshing, cooling sensation that comforts the scalp.' },
          { name: 'Broccoli (Brassica Oleracea Italica) Extract', description: 'Antioxidant botanical that helps protect the scalp.' },
        ]),
      },
    })
    console.log('✓ HAIR SOLUTION α fixed (Pentapeptide-20/5 invented botanicals removed; Saw Palmetto + EGF added)')
  }

  // ── HR³ SCALP PEELING α — remove old-formula leftovers ───────────────────
  const peeling = await prisma.product.findFirst({ where: { name: { contains: 'SCALP PEELING' } } })
  if (peeling) {
    const ing = JSON.parse(peeling.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const out = ing.filter((i) => !i.name.includes('Grapefruit') && !i.name.includes('Sophora'))
    out.push({ name: 'Copper Tripeptide-1', description: 'Scalp peptide that supports follicle health during the peeling prep step.' })
    await prisma.product.update({ where: { id: peeling.id }, data: { ingredients: j(out) } })
    console.log('✓ SCALP PEELING α fixed (Grapefruit Seed Oil + Sophora removed; Copper Tripeptide-1 added)')
  }

  // ── EyeCell EYE PEPTIDE GEL PATCH — rebuild from DTS MG formula ──────────
  const patch = await prisma.product.findFirst({ where: { name: { contains: 'EYE PEPTIDE GEL PATCH' } } })
  if (patch) {
    await prisma.product.update({
      where: { id: patch.id },
      data: {
        ingredients: j([
          { name: 'Niacinamide 2%', description: 'Vitamin B3 that brightens the look of dark circles and supports the delicate eye-area barrier.' },
          { name: 'Acetyl Hexapeptide-8', description: 'Expression-care peptide that helps smooth the look of fine lines around the eyes.' },
          { name: 'Madecassoside + Centella Asiatica', description: 'Calming repair duo that soothes the delicate eye area.' },
          { name: 'Hydrolyzed Collagen', description: 'Plumping protein that supports skin firmness and hydration.' },
          { name: 'Adenosine', description: 'Anti-wrinkle functional ingredient that smooths and energizes the eye area.' },
          { name: 'Botanical Extracts', description: 'Chamomile, Rosemary, Scutellaria Baicalensis and Panthenol soothe, condition and revitalize the delicate eye area.' },
        ]),
      },
    })
    console.log('✓ EYE GEL PATCH fixed (Contour-Cream panel removed → real patch formula: Niacinamide 2%/Madecassoside/Collagen)')
  }

  // ── Microneedle Roller — FDA-approved → CE/ISO wording ───────────────────
  const roller = await prisma.product.findFirst({ where: { name: { contains: 'Microneedle Roller' } } })
  if (roller) {
    const kf = JSON.parse(roller.keyFeatures ?? '[]') as Array<{ title: string; description: string }>
    const med = kf.find((k) => k.description.includes('FDA'))
    if (med) med.description = 'CE-certified microneedling device designed for professional use, manufactured under ISO 13485 quality standards.'
    await prisma.product.update({ where: { id: roller.id }, data: { keyFeatures: j(kf) } })
    console.log('✓ MICRONEEDLE ROLLER fixed (FDA-approved → CE-certified / ISO 13485)')
  }

  // ── HR³ MEDI SCALP SHAMPOO α — registered name in body ───────────────────
  const shampoo = await prisma.product.findFirst({ where: { name: { contains: 'MEDI SCALP SHAMPOO' } } })
  if (shampoo?.description?.includes('HR³ MATRIX SCALP SHAMPOO α is')) {
    await prisma.product.update({
      where: { id: shampoo.id },
      data: { description: shampoo.description.replace('HR³ MATRIX SCALP SHAMPOO α is', 'HR³ MATRIX MEDI SCALP SHAMPOO α is') },
    })
    console.log('✓ MEDI SHAMPOO name corrected in description body')
  }

  // ── EyeCell EYE CONTOUR CREAM — add Arbutin 2% (supports dark-circle claim)
  const ecc = await prisma.product.findFirst({ where: { name: { contains: 'EYE CONTOUR CREAM' } } })
  if (ecc?.ingredients && !ecc.ingredients.includes('Arbutin')) {
    const ing = JSON.parse(ecc.ingredients) as Array<{ name: string; description: string }>
    ing.splice(0, 0, { name: 'Arbutin 2%', description: 'High-concentration brightening active that directly targets the look of dark circles and pigmentation.' })
    await prisma.product.update({ where: { id: ecc.id }, data: { ingredients: j(ing) } })
    console.log('✓ EYE CONTOUR CREAM Arbutin 2% added')
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
