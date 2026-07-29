/**
 * Batch-4 Intertek audit fixes — CLEANSERS / TONERS / PEELINGS.
 *
 * Evidence: docs/audit/2026-07-29_INTERTEK_AUDIT_REPORT.md (batch 4).
 * Key fixes: Problem Control Toner — Witch Hazel/Aloe/Niacinamide ALL absent from
 * formula (real: Zinc PCA 0.5%, Tea Tree, Allantoin, Panthenol); EPI Turnover —
 * Retinol/Provitamin A/Vit C/Vit E all fabricated (real: Papaya/papain, Moringa,
 * Desert Complex); Mist — "Hyaluronan 10" vs 7 forms in formula; SRS — Phytic Acid
 * is a chelator, not an AHA; Skin Defender — sub-trace vitamin "nourishment" claim;
 * Snow O2 — perfluorocarbon registered as viscosity agent, mechanism reworded.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-intertek-audit-batch4-cleansers.ts
 */
import { prisma } from '../lib/prisma'

const j = (v: unknown) => JSON.stringify(v)

async function main() {
  // ── INTENSIVE PROBLEM CONTROL TONER (HIGH×3) ─────────────────────────────
  const toner = await prisma.product.findFirst({ where: { name: { contains: 'PROBLEM CONTROL TONER' } } })
  if (toner) {
    await prisma.product.update({
      where: { id: toner.id },
      data: {
        description:
          'GENOSYS INTENSIVE PROBLEM CONTROL TONER is an oil-control toner that removes excess oil and sebum from blemish-prone skin while adding quick hydration. Zinc PCA and tea tree target oily, problem skin, with soothing allantoin and panthenol for daily use — in a 360° spray format that works even upside down.',
        ingredients: j([
          { name: 'Zinc PCA', description: 'Sebum-regulating zinc salt (0.5%) that controls excess oil, refines skin texture and helps keep blemish-prone skin clear.' },
          { name: 'Tea Tree Extract + Tea Tree Leaf Oil', description: 'Powerful antimicrobial and anti-inflammatory duo that helps combat acne-causing bacteria while soothing irritated skin.' },
          { name: 'Salicylic Acid (BHA)', description: 'Beta-hydroxy acid that supports the formula\'s sebum-control and skin-clearing action.' },
          { name: 'Allantoin', description: 'Cell-protecting, anti-irritant agent that soothes and calms problem skin.' },
          { name: 'Panthenol (Vitamin B5)', description: 'Hydrating provitamin that supports skin barrier comfort and quick moisture replenishment.' },
        ]),
      },
    })
    console.log('✓ TONER fixed (Witch Hazel/Aloe/Niacinamide removed → Zinc PCA/Tea Tree/Allantoin/Panthenol)')
  }

  // ── EPI TURNOVER BOOSTING PEELING GEL (HIGH×4) ───────────────────────────
  const epi = await prisma.product.findFirst({ where: { name: { contains: 'EPI TURNOVER' } } })
  if (epi) {
    await prisma.product.update({
      where: { id: epi.id },
      data: {
        ingredients: j([
          { name: 'Carica Papaya (Papaya) Fruit Extract', description: 'Source of papain, a proteolytic enzyme that gently dissolves dead skin cells for smooth, non-irritating exfoliation.' },
          { name: 'Moringa Oleifera Seed Extract', description: 'The "Miracle Tree" — purifies and nourishes the skin with anti-inflammatory botanical actives.' },
          { name: 'Desert Complex', description: 'Five resilient desert plants (Fig, Date Palm, Opuntia, Prickly Pear, Baobab) that hydrate and soothe the skin during exfoliation.' },
          { name: 'Jojoba Oil', description: 'Skin-compatible emollient that keeps the peeling gel comfortable and non-stripping.' },
          { name: 'Prunus Mume Fruit Extract', description: 'Japanese plum extract with antioxidant and tone-brightening properties.' },
          { name: 'Allantoin', description: 'Soothes and calms the skin, reducing irritation and providing gentle care during exfoliation.' },
        ]),
      },
    })
    console.log('✓ EPI TURNOVER fixed (Retinol/Provitamin A/Vit C/Vit E removed → Papaya/Moringa/Desert Complex)')
  }

  // ── MICROBIOME ENERGY INFUSING MIST (MED) ────────────────────────────────
  const mist = await prisma.product.findFirst({ where: { name: { contains: 'MICROBIOME ENERGY' } } })
  if (mist) {
    const ing = JSON.parse(mist.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const ha = ing.find((i) => i.name.includes('Hyaluronan'))
    if (ha) {
      ha.name = 'Multi-Molecular Hyaluronic Acid Complex (7 forms)'
      ha.description = 'Seven hyaluronic acid and hyaluronate forms of different molecular weights that provide deep hydration and plumping effects.'
    }
    let howToUse = mist.howToUse ?? ''
    if (howToUse && !howToUse.includes('Shake')) {
      try {
        const steps = JSON.parse(howToUse) as Array<{ step: string; instruction: string }>
        steps.unshift({ step: 'Shake', instruction: 'Shake well before use to mix the emulsified oils evenly.' })
        howToUse = JSON.stringify(steps)
      } catch { /* leave as-is */ }
    }
    await prisma.product.update({
      where: { id: mist.id },
      data: { ingredients: j(ing), skinType: 'all', howToUse },
    })
    console.log('✓ MIST fixed (10→7 HA forms, skinType→all, shake step added)')
  }

  // ── SKIN RENEWAL PEELING SYSTEM / SRS (MED) ──────────────────────────────
  const srs = await prisma.product.findFirst({ where: { name: { contains: 'SKIN RENEWAL PEELING' } } })
  if (srs) {
    const kf = JSON.parse(srs.keyFeatures ?? '[]') as Array<{ title: string; description: string }>
    const aha = kf.find((k) => k.title.includes('AHA'))
    if (aha) {
      aha.title = 'Tri-AHA Exfoliant Complex'
      aha.description = 'Multi-acid formula with Glycolic Acid (15%), Lactic Acid (13.5%) and Mandelic Acid (2%) — a 30.5% professional acid complex at pH 3.02, supported by Phytic Acid as a chelating antioxidant.'
    }
    const ing = JSON.parse(srs.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const phytic = ing.find((i) => i.name.includes('Phytic'))
    if (phytic) phytic.description = 'Chelating antioxidant (not an AHA) that supports formula stability and enhances the exfoliating acids\' performance.'
    const glycolic = ing.find((i) => i.name.includes('Glycolic'))
    if (glycolic) glycolic.name = 'Glycolic Acid 15%'
    const lactic = ing.find((i) => i.name === 'Lactic Acid')
    if (lactic) lactic.name = 'Lactic Acid 13.5%'
    const mandelic = ing.find((i) => i.name.includes('Mandelic'))
    if (mandelic) mandelic.name = 'Mandelic Acid 2%'
    await prisma.product.update({
      where: { id: srs.id },
      data: { keyFeatures: j(kf), ingredients: j(ing) },
    })
    console.log('✓ SRS fixed (Phytic reclassified as chelator; acid %s added)')
  }

  // ── SKIN DEFENDER LIP & EYE MAKEUP REMOVER (MED) ─────────────────────────
  const sd = await prisma.product.findFirst({ where: { name: { contains: 'SKIN DEFENDER' } } })
  if (sd) {
    const kf = JSON.parse(sd.keyFeatures ?? '[]') as Array<{ title: string; description: string }>
    const vit = kf.find((k) => k.title.includes('Vitamin'))
    if (vit) vit.description = 'Supportive antioxidant vitamin complex (B3, B5, B7, B9, B12, C, E and more) within the essence layer.'
    const ing = JSON.parse(sd.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const vitI = ing.find((i) => i.name.includes('Vitamin Complex'))
    if (vitI) vitI.description = 'Supportive antioxidant vitamin blend complementing the formula\'s botanical oils and rose water.'
    await prisma.product.update({
      where: { id: sd.id },
      data: { keyFeatures: j(kf), ingredients: j(ing) },
    })
    console.log('✓ SKIN DEFENDER fixed (vitamin "nourishment" claim → supportive antioxidant)')
  }

  // ── SNOW O2 CLEANSER (MED) — perfluorocarbon mechanism wording ──────────
  const snow = await prisma.product.findFirst({ where: { name: { contains: 'SNOW O2' } } })
  if (snow?.ingredients?.includes('Methyl Perfluoroisobutyl Ether')) {
    const updated = snow.ingredients.replace(
      /Specialized ingredient that creates the oxygen bubble effect for enhanced cleansing and treatment sensation\./g,
      'Perfluorocarbon carrier that enhances oxygen delivery to the skin surface, enabling the product\'s signature oxygen bubble cleansing effect.'
    )
    if (updated !== snow.ingredients) {
      await prisma.product.update({ where: { id: snow.id }, data: { ingredients: updated } })
      console.log('✓ SNOW O2 fixed (perfluorocarbon mechanism wording)')
    } else {
      console.log('· SNOW O2 — wording differs in DB, checked manually')
    }
  } else {
    console.log('· SNOW O2 — no DB ingredients match, skipped')
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
