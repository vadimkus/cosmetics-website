/**
 * Batch-1 Intertek audit fixes — SERUMS + BIO-MESO ampoules.
 *
 * Evidence: docs/audit/2026-07-29_INTERTEK_AUDIT_REPORT.md (batch 1).
 * Key fixes: invented "Coconut Water 78%" + "Hyaluronan 11" (formula = 8 HA forms,
 * water is the solvent); MultiEx BSASM® Plus + Phytolex SC absent from AFS formula;
 * Bio-Meso 60000 ppm misattribution (Sodium DNA = 1,120 ppm; 60,000 = whole complex);
 * phytosome + 1.0mm needle claims undocumented; usage field mismatches.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-intertek-audit-batch1-serums.ts
 */
import { prisma } from '../lib/prisma'

async function main() {
  // ── 18 · MOISTURE REPLENISHING HYALURON SERUM ───────────────────────────
  const hyal = await prisma.product.findFirst({ where: { name: { contains: 'MOISTURE REPLENISHING HYALURON SERUM' } } })
  if (hyal) {
    await prisma.product.update({
      where: { id: hyal.id },
      data: {
        description:
          'MOISTURE REPLENISHING HYALURON SERUM is a coconut water-based hydrating serum that delivers multi-depth hydration through a multi-level moisture system. This advanced formula combines a multi-molecular hyaluronic acid complex (8 HA forms) with mushroom extracts to provide deep moisture replenishment and long-lasting hydration.',
        ingredients: JSON.stringify([
          { name: 'Coconut Water', description: 'Natural coconut water provides electrolytes and skin hydration for optimal moisture balance.' },
          { name: 'Multi-Molecular Hyaluronic Acid Complex (8 forms)', description: 'Eight hyaluronic acid and hyaluronate forms of different molecular weights for comprehensive hydration at all skin levels.' },
          { name: 'Glyceryl Glucoside', description: 'Aquaporin-3 stimulating ingredient that enhances moisture transport within the skin and improves natural hydration mechanisms.' },
          { name: 'Mushroom Extracts', description: 'Tremella Fuciformis and other mushroom extracts provide anti-inflammatory and antioxidant protection while retaining moisture.' },
          { name: 'Sodium Hyaluronate Crosspolymer', description: 'Forms a protective moisture film on skin surface to prevent water loss and maintain hydration.' },
        ]),
        keyFeatures: JSON.stringify([
          { title: 'Multi-Level Hydration', description: 'Advanced hydration technology that works in layers for comprehensive moisture delivery and retention.' },
          { title: 'Coconut Water Base', description: 'Natural coconut water provides electrolytes and natural hydration for optimal skin balance.' },
          { title: '8-Form Hyaluronic Acid Complex', description: 'Multi-molecular weight hyaluronic acids for layer-by-layer moisture replenishment and barrier formation.' },
          { title: 'Mushroom Extracts', description: 'Powerful mushroom extracts provide anti-inflammatory and antioxidant protection for healthy skin.' },
        ]),
      },
    })
    console.log('✓ 18 HYALURON SERUM fixed (78% removed, 11→8 HA forms, 4-step→multi-level)')
  }

  // ── 19 · ALL FOR SENSITIVE SERUM ────────────────────────────────────────
  // Formula: Ingredient lists_old/GENOSYS ALL FOR SENSITIVE SERUM.pdf (Winnova)
  // MultiEx BSASM® Plus + Phytolex SC NOT in formula — real soothers are
  // Centella, Chamomilla, Allantoin, Beta-Glucan, Pumpkin ferment
  const afs = await prisma.product.findFirst({ where: { name: { contains: 'ALL FOR SENSITIVE' } } })
  if (afs) {
    await prisma.product.update({
      where: { id: afs.id },
      data: {
        ingredients: JSON.stringify([
          { name: 'Centella Asiatica Extract', description: 'Proven soothing active (Cica) that calms reactive skin, reduces visible redness and supports skin repair.' },
          { name: 'Chamomilla Recutita (Chamomile) Flower Extract', description: 'Classic anti-inflammatory botanical that comforts sensitized, easily irritated skin.' },
          { name: 'Beta-Glucan', description: 'A natural immune-boosting ingredient that helps strengthen the skin\'s defense mechanisms, reduce inflammation, and promote healing in sensitive skin.' },
          { name: 'Allantoin', description: 'Skin-protecting soothing agent that calms irritation and supports skin regeneration.' },
          { name: 'Hyaluronic Acid', description: 'A powerful humectant that attracts and retains moisture, providing deep hydration without causing irritation or clogging pores.' },
          { name: 'Phytosphingosine', description: 'A natural lipid that helps restore the skin\'s barrier function and provides gentle antimicrobial protection while being suitable for sensitive skin.' },
          { name: 'Aloe Barbadensis Leaf Extract', description: 'Known for its soothing and healing properties, aloe vera helps calm irritated skin, reduce inflammation, and provide natural moisture to sensitive skin.' },
          { name: 'Hamamelis Virginiana (Witch Hazel) Water', description: 'Distilled witch hazel water that helps reduce visible redness and soothe irritated skin — gentle enough for reactive skin.' },
          { name: 'Lactobacillus/Pumpkin Ferment Extract', description: 'Fermented microbiome-supporting ingredient that helps calm and condition sensitive skin.' },
        ]),
      },
    })
    console.log('✓ 19 ALL FOR SENSITIVE fixed (BSASM + Phytolex SC removed; Centella/Chamomile lead)')
  }

  // ── 21 · MULTI VITA RADIANCE SERUM — usage field only ───────────────────
  const mvr = await prisma.product.findFirst({ where: { name: { contains: 'MULTI VITA RADIANCE SERUM' } } })
  if (mvr) {
    await prisma.product.update({ where: { id: mvr.id }, data: { usage: 'morning-evening' } })
    console.log('✓ 21 MULTI VITA SERUM usage → morning-evening')
  }

  // ── 22 · MULTI FUNCTIONAL ANTI-WRINKLE SERUM — usage field only ─────────
  const mfs = await prisma.product.findFirst({ where: { name: { contains: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM' } } })
  if (mfs) {
    await prisma.product.update({ where: { id: mfs.id }, data: { usage: 'morning-evening' } })
    console.log('✓ 22 MFS SERUM usage → morning-evening (bakuchiol photostable per brand PPTX)')
  }

  // ── 60 · Bio Meso PDRN Ampoule 60000 ────────────────────────────────────
  // Formula + artwork: Sodium DNA = 0.112% = 1,120 ppm; "BIO-MESO PDRN 60,000ppm"
  // = spicules (5.72%) + Sodium DNA (0.112%) complex total. No phytosome, no 1.0mm.
  const meso = await prisma.product.findFirst({ where: { productNumber: '60' } })
  if (meso) {
    const ingredients = JSON.parse(meso.ingredients ?? '[]') as Array<{ name: string; description: string }>
    ingredients[0] = {
      name: 'BIO-MESO™ PDRN Complex (60,000 ppm)',
      description:
        'Spicule + Sodium DNA complex at 60,000 ppm total. Sodium DNA (salmon-derived PDRN): 1,120 ppm, delivered via a lecithin-based matrix coated onto the spicules for optimal stability and skin penetration.',
    }
    await prisma.product.update({
      where: { id: meso.id },
      data: {
        ingredients: JSON.stringify(ingredients),
        howToUse: `Professional Treatment (Expert 60000): High-density spicule bio-peeling that penetrates the epidermis to deliver actives; recommended once a month. Start with professional sessions for deep stimulation, then transition to home care.

Home Care (Homecare 5000): Use for frequent, gentle reinforcement to maintain results. Apply after professional treatment to support barrier repair and collagen remodeling. Follow with INTENSIVE HYDRO SOOTHING CREAM to calm and hydrate.

General Approach: Apply topically to create microchannels. High-dose spicules (60,000 ppm complex) for periodic intensive therapy; moderate-dose for daily/weekly reinforcement.

Frequency: Professional – monthly; Home – as needed between visits.`,
      },
    })
    console.log('✓ 60 BIO-MESO 60000 fixed (Sodium DNA 1,120ppm vs complex 60,000ppm; phytosome + 1.0mm removed)')
  }

  // ── 65 · Bio-Meso PDRN Homecare Ampoule 5000 — wording match to artwork ──
  const home = await prisma.product.findFirst({ where: { productNumber: '65' } })
  if (home && home.description?.includes('anti-aging complex')) {
    await prisma.product.update({
      where: { id: home.id },
      data: { description: home.description.replace('anti-aging complex', 'peptide complex') },
    })
    console.log('✓ 65 HOMECARE 5000 fixed (anti-aging complex → peptide complex per artwork)')
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
