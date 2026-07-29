/**
 * Batch-2 Intertek audit fixes — CREAMS.
 *
 * Evidence: docs/audit/2026-07-29_INTERTEK_AUDIT_REPORT.md (batch 2).
 * Key fixes: Postcream size 20g→100g (2 COAs + artwork); Hyaluron Cream invented
 * "Hyaluronan 11" + undocumented "72-hour clinical" claim; Skin Barrier "Enriched
 * Ceramide" (trace 0.0001%) + unverified MultiEx BSASM® Plus; Oxymask EGF/Madecassoside
 * at sub-ppb → lead with real 5% oxygen carrier; ND Cell "Botox-like" at 0.25ppm.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-intertek-audit-batch2-creams.ts
 */
import { prisma } from '../lib/prisma'

const j = (v: unknown) => JSON.stringify(v)

async function main() {
  // ── 25 · SOOTHING REPAIR POSTCREAM — size 20g → 100g ────────────────────
  const post = await prisma.product.findFirst({ where: { name: { contains: 'SOOTHING REPAIR POSTCREAM' } } })
  if (post) {
    await prisma.product.update({
      where: { id: post.id },
      data: {
        size: '100g',
        description: post.description?.replace(
          'SOOTHING REPAIR POSTCREAM is a specialized regenerating cream',
          'SOOTHING REPAIR POSTCREAM (100g) is a specialized regenerating cream'
        ),
      },
    })
    console.log('✓ 25 POSTCREAM size 20g → 100g (artwork + 2 COAs)')
  }

  // ── 26 · EGF REPAIR OXYMASK CREAM — lead with oxygen tech, honest EGF ────
  const oxy = await prisma.product.findFirst({ where: { name: { contains: 'EGF REPAIR OXYMASK' } } })
  if (oxy) {
    await prisma.product.update({
      where: { id: oxy.id },
      data: {
        usage: 'morning-evening',
        description:
          'GENOSYS EGF REPAIR OXYMASK CREAM is a unique oxygen bubbling mask cream designed to rejuvenate dull and stressed skin. Perfluorocarbon oxygen-carrier technology releases oxygen on the skin, creating the signature bubbling action that revitalizes the complexion. This innovative "S.O.S" cream effectively addresses skin damage from various causes, providing immediate relief through advanced oxygen therapy and a soothing repair complex.',
        ingredients: j([
          { name: 'Oxygen Carrier Technology (Methyl Perfluoroisobutyl Ether)', description: 'Perfluorocarbon that dissolves and releases oxygen on the skin, powering the bubbling oxygen-therapy action of this mask cream.' },
          { name: 'Copper Tripeptide-1', description: 'Promotes collagen synthesis and has wound-healing properties, helping to improve skin texture and reduce signs of aging.' },
          { name: 'SEPITONIC M3 (Mineral Complex)', description: 'Enhances cellular metabolism and revitalizes the skin, providing essential minerals for optimal skin function and health.' },
          { name: 'Salmon Oil', description: 'Rich in unsaturated fatty acids, it offers anti-inflammatory and wound-healing effects while providing deep nourishment to the skin.' },
          { name: 'Adenosine', description: 'Provides anti-aging benefits by reducing the appearance of wrinkles and fine lines, promoting smoother, more youthful-looking skin.' },
          { name: 'sh-Oligopeptide-1 (EGF) + Madecassoside', description: 'Supporting EGF peptide and centella-derived madecassoside in the skin-repair complex.' },
          { name: 'Eucalyptus Globulus Leaf Oil', description: 'Provides the refreshing cooling sensation of the formula.' },
        ]),
      },
    })
    console.log('✓ 26 OXYMASK fixed (oxygen tech leads; EGF/Madecassoside honest; usage morning-evening)')
  }

  // ── 27 · SKIN BARRIER PROTECTING CREAM ───────────────────────────────────
  const sb = await prisma.product.findFirst({ where: { name: { contains: 'SKIN BARRIER PROTECTING' } } })
  if (sb) {
    await prisma.product.update({
      where: { id: sb.id },
      data: {
        description:
          'SKIN BARRIER PROTECTING CREAM is an advanced skin barrier strengthening cream with a skin-identical amino acid (NMF) complex, ceramide NP and shea butter. This innovative formula encourages healthy and soft skin by promoting water retention and protecting the skin barrier.',
        keyFeatures: j([
          { title: 'NMF Amino Acid Complex', description: 'Skin-identical blend of 17 amino acids mirroring the Natural Moisturizing Factor for optimal water retention.' },
          { title: 'Ceramide NP', description: 'Skin-identical lipid supporting barrier integrity and moisture balance.' },
          { title: 'Shea Butter + Macadamia Oil', description: 'Rich emollients that deeply nourish and protect skin from environmental stress.' },
          { title: 'Water Retention', description: 'Promotes optimal water retention for healthy, hydrated, and soft skin.' },
        ]),
        ingredients: j([
          { name: 'NMF Amino Acid Complex', description: 'Blend of 17 skin-identical amino acids (Glycine, Serine, Glutamic Acid, Leucine, Lysine, Arginine and more) that supports barrier integrity and natural repair processes.' },
          { name: 'Ceramide NP', description: 'Skin-identical ceramide that helps maintain skin barrier function and integrity.' },
          { name: 'Shea Butter', description: 'Rich emollient that provides deep hydration and helps protect skin from environmental stress.' },
          { name: 'Macadamia Oil', description: 'Nourishing oil that helps restore skin barrier function and provides antioxidant protection.' },
          { name: 'Glycerin + Hydrogenated Polydecene', description: 'The emollient backbone that delivers the cream\'s long-lasting moisturizing feel.' },
        ]),
        directions: sb.directions?.includes('clinically proven')
          ? sb.directions.replace(/clinically proven to improve skin restorative force/gi, 'dermatologically tested')
          : sb.directions ?? undefined,
      },
    })
    console.log('✓ 27 SKIN BARRIER fixed (Enriched Ceramide + BSASM removed → NMF/Ceramide NP)')
  }

  // ── 28 · INTENSIVE HYDRO SOOTHING CREAM — honest snail (0.001%) ─────────
  const hydro = await prisma.product.findFirst({ where: { name: { contains: 'INTENSIVE HYDRO SOOTHING' } } })
  if (hydro) {
    const ing = JSON.parse(hydro.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const snail = ing.find((i) => i.name.includes('Snail'))
    if (snail) snail.description = 'Soothing ferment filtrate that supports skin comfort and hydration.'
    await prisma.product.update({
      where: { id: hydro.id },
      data: { ingredients: j(ing) },
    })
    console.log('✓ 28 HYDRO SOOTHING fixed (snail premium-growth-factor claim toned down)')
  }

  // ── 29 · MOISTURE REPLENISHING HYALURON CREAM ────────────────────────────
  const mhc = await prisma.product.findFirst({ where: { name: { contains: 'MOISTURE REPLENISHING HYALURON CREAM' } } })
  if (mhc) {
    await prisma.product.update({
      where: { id: mhc.id },
      data: {
        description:
          'MOISTURE REPLENISHING HYALURON CREAM is an advanced moisturizing cream that provides long-lasting, multi-level hydration. This innovative formula combines multiple molecular weights of hyaluronic acid (8 HA forms) with mushroom extracts to deliver deep, sustained moisture.',
        keyFeatures: j([
          { title: 'Multi-Level Hydration', description: 'Advanced multi-layered hydration that cools, attracts, replenishes, and locks in moisture for comprehensive skin hydration.' },
          { title: 'Multi-Molecular Hyaluronic Acid Complex', description: 'Advanced hyaluronic acid complex with 8 molecular forms for deep penetration and surface protection.' },
          { title: 'Mushroom Extract Complex', description: 'Powerful anti-inflammatory and antioxidant properties from various mushroom extracts for skin nourishment and protection.' },
          { title: 'Saccharide Isomerate', description: 'Skin-identical moisture magnet that binds to the skin for sustained hydration.' },
        ]),
        ingredients: j([
          { name: 'Multi-Molecular Hyaluronic Acid Complex (8 forms)', description: 'Advanced hyaluronic acid complex with low, middle, and high molecular weights for comprehensive skin hydration and protection.' },
          { name: 'Saccharide Isomerate', description: 'Skin-identical carbohydrate complex that binds moisture to the skin, creating a moisture reservoir for sustained hydration.' },
          { name: 'Mushroom Extracts', description: 'Various mushroom extracts provide powerful anti-inflammatory and antioxidant properties for skin nourishment and protection.' },
          { name: 'Natural Cooling Agents', description: 'Natural-origin cooling agents provide instant skin refreshment and help lower skin temperature for a refreshing sensation.' },
        ]),
        directions: mhc.directions?.includes('72-hour')
          ? mhc.directions.replace(/clinically proven for 72-hour hydration persistence/gi, 'dermatologically tested')
          : mhc.directions ?? undefined,
      },
    })
    console.log('✓ 29 HYALURON CREAM fixed (11→8 forms, 72h clinical claim removed)')
  }

  // ── 30 · INTENSIVE PROBLEM CONTROL CREAM — gel-cream texture note ────────
  const pcc = await prisma.product.findFirst({ where: { name: { contains: 'INTENSIVE PROBLEM CONTROL CREAM' } } })
  if (pcc && pcc.description && !pcc.description.includes('gel-cream')) {
    await prisma.product.update({
      where: { id: pcc.id },
      data: {
        description: pcc.description.replace(
          'is a specialized cream designed',
          'is a specialized lightweight gel-cream designed'
        ),
      },
    })
    console.log('✓ 30 PROBLEM CONTROL CREAM — gel-cream texture clarified')
  }

  // ── 23 · ND Cell ANTI-WRINKLE CREAM — remove "Botox-like" ────────────────
  const nd = await prisma.product.findFirst({ where: { name: { contains: 'ND Cell' } } })
  if (nd) {
    const ing = JSON.parse(nd.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const ahp = ing.find((i) => i.name.includes('Acetyl Hexapeptide-8'))
    if (ahp) ahp.description = 'Expression-care peptide within the multi-peptide complex that complements the collagen-stimulating action of Copper Tripeptide-1.'
    const cer = ing.find((i) => i.name === 'Ceramide')
    if (cer) cer.name = 'Ceramide NP'
    await prisma.product.update({
      where: { id: nd.id },
      data: { ingredients: j(ing) },
    })
    console.log('✓ 23 ND CELL fixed ("Botox-like" removed; Ceramide → Ceramide NP)')
  }

  // ── 32 · MULTI FUNCTIONAL ANTI-WRINKLE CREAM — hydrolyzed ECM honesty ────
  const mfc = await prisma.product.findFirst({ where: { name: { contains: 'MULTI FUNCTIONAL ANTI-WRINKLE CREAM' } } })
  if (mfc) {
    const ing = JSON.parse(mfc.ingredients ?? '[]') as Array<{ name: string; description: string }>
    const col = ing.find((i) => i.name.includes('Collagen'))
    if (col) {
      col.name = 'Hydrolyzed Collagen & Elastin'
      col.description = 'ECM support complex that complements the formula\'s peptide and barrier actives.'
    }
    await prisma.product.update({
      where: { id: mfc.id },
      data: { ingredients: j(ing) },
    })
    console.log('✓ 32 MFS CREAM fixed (Collagen & Elastin → Hydrolyzed ECM support)')
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
