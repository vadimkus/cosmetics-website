/**
 * Batch-5 Intertek audit fixes — MASKS.
 *
 * Evidence: docs/audit/2026-07-29_INTERTEK_AUDIT_REPORT.md (batch 5).
 * Key fixes: Collagen Mask — Vitamin E/Seaweed/Argan/Shea all fabricated;
 * Bio-Ferment — "Fermented Green Tea" absent, "Fermented Rice" is plain rice bran;
 * PDRN Mask — Hyaluronic Acid absent from 39-ingredient formula;
 * Hydro Cool — CRITICAL missing powder:water 10:8 mixing step (users would apply
 * dry powder); EZ CO₂ — 15-20min → official 10min (CO₂ reaction is time-limited);
 * Peptide Gel — 15-20min → official 20-40min; Overnight — GF complex at 0.000000%.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-intertek-audit-batch5-masks.ts
 */
import { prisma } from '../lib/prisma'

const j = (v: unknown) => JSON.stringify(v)

async function main() {
  // ── INTENSIVE REPAIR COLLAGEN MASK (HIGH) ────────────────────────────────
  const col = await prisma.product.findFirst({ where: { name: { contains: 'REPAIR COLLAGEN MASK' } } })
  if (col) {
    await prisma.product.update({
      where: { id: col.id },
      data: {
        ingredients: j([
          { name: 'Hydrolyzed Collagen', description: 'Protein that supports skin structure and improves firmness.' },
          { name: 'Hyaluronic Acid', description: 'Powerful humectant that attracts and retains moisture.' },
        ]),
      },
    })
    console.log('✓ COLLAGEN MASK fixed (Vitamin E/Seaweed/Argan/Shea removed — not in INCI)')
  }

  // ── BIO-FERMENT AGE DEFYING POWDER MASK (HIGH) ───────────────────────────
  const bf = await prisma.product.findFirst({ where: { name: { contains: 'BIO-FERMENT' } } })
  if (bf) {
    const ing = JSON.parse(bf.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const out = ing
      .filter((i) => !i.name.includes('Fermented Green Tea'))
      .map((i) => {
        if (i.name.includes('Fermented Rice')) {
          return { name: 'Rice Bran Extract', description: 'Rich in vitamins, minerals, and antioxidants, rice bran provides gentle brightening effects while nourishing the skin with essential nutrients.' }
        }
        return i
      })
    await prisma.product.update({
      where: { id: bf.id },
      data: { ingredients: j(out) },
    })
    console.log('✓ BIO-FERMENT fixed (Fermented Green Tea removed; Fermented Rice → Rice Bran Extract)')
  }

  // ── SKIN REBOOT PDRN MASK PACK (HIGH) ────────────────────────────────────
  const pdrn = await prisma.product.findFirst({ where: { name: { contains: 'PDRN MASK' } } })
  if (pdrn) {
    const ing = JSON.parse(pdrn.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const out = ing.filter((i) => i.name !== 'Hyaluronic Acid')
    await prisma.product.update({
      where: { id: pdrn.id },
      data: { ingredients: j(out) },
    })
    console.log('✓ PDRN MASK fixed (Hyaluronic Acid removed — absent from formula)')
  }

  // ── HYDRO COOL MODELING MASK (CRITICAL — missing mixing step) ────────────
  const hc = await prisma.product.findFirst({ where: { name: { contains: 'HYDRO COOL' } } })
  if (hc) {
    await prisma.product.update({
      where: { id: hc.id },
      data: {
        howToUse: j([
          { step: 'Cleanse', instruction: 'Begin with thoroughly cleansed facial skin' },
          { step: 'Mix', instruction: 'Mix the powder with cool water at a 10:8 ratio (powder:water) in a rubber bowl. Stir quickly and evenly until a smooth paste forms.' },
          { step: 'Apply', instruction: 'Apply the mixed mask evenly to the face promptly, before it begins to set.' },
          { step: 'Processing Time', instruction: 'Leave the mask on for 15-20 minutes while it sets and works.' },
          { step: 'Removal', instruction: 'Gently peel off the set mask from the edges.' },
          { step: 'Rinse', instruction: 'Rinse off any remaining residue with lukewarm water.' },
          { step: 'Follow-up', instruction: 'Continue with your regular skincare routine' },
        ]),
      },
    })
    console.log('✓ HYDRO COOL fixed (10:8 powder:water mixing step added)')
  }

  // ── EZ CO₂ MASK KIT (HIGH) — 15-20min → 10min ───────────────────────────
  const co2 = await prisma.product.findFirst({ where: { name: { contains: 'CO₂ MASK KIT' } } })
  if (co2?.howToUse) {
    await prisma.product.update({
      where: { id: co2.id },
      data: {
        howToUse: co2.howToUse.replace(
          'Leave on for 15-20 minutes',
          'Leave on for 10 minutes'
        ),
      },
    })
    console.log('✓ EZ CO₂ fixed (15-20min → 10min per official artwork)')
  }

  // ── PEPTIDE GEL MASK (HIGH) — 15-20min → 20-40min ───────────────────────
  const pgm = await prisma.product.findFirst({ where: { name: { equals: 'PEPTIDE GEL MASK' } } })
  if (pgm?.howToUse) {
    const updated = pgm.howToUse.replace('Leave on for 15-20 minutes', 'Leave on for 20-40 minutes')
    if (updated !== pgm.howToUse) {
      await prisma.product.update({ where: { id: pgm.id }, data: { howToUse: updated } })
      console.log('✓ PEPTIDE GEL MASK fixed (15-20min → 20-40min per official artwork)')
    } else {
      console.log('· PEPTIDE GEL MASK time string not found — check manually')
    }
  }

  // ── SKIN RESCUE OVERNIGHT CREAM MASK (HIGH) — honest GF complex ──────────
  const on = await prisma.product.findFirst({ where: { name: { contains: 'OVERNIGHT CREAM MASK' } } })
  if (on) {
    const ing = JSON.parse(on.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const gfIdx = ing.findIndex((i) => i.name.includes('Growth Factor'))
    if (gfIdx >= 0) {
      const gf = ing.splice(gfIdx, 1)[0]
      gf.name = 'Growth-Factor Peptide Blend'
      gf.description = 'A supporting blend of growth-factor peptides (EGF, aFGF, bFGF, PlGF, IGF) within the overnight renewal complex.'
      ing.push(gf) // move from headline position to end
      await prisma.product.update({ where: { id: on.id }, data: { ingredients: j(ing) } })
      console.log('✓ OVERNIGHT MASK fixed (GF complex demoted from headline + honest wording)')
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
