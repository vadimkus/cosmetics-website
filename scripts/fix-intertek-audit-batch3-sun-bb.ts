/**
 * Batch-3 Intertek audit fixes — SUN + BB products.
 *
 * Evidence: docs/audit/2026-07-29_INTERTEK_AUDIT_REPORT.md (batch 3).
 * Fixes fabricated complex names, invented percentages, wrong SPF label,
 * puff cross-contamination, and an ingredient absent from the formula.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-intertek-audit-batch3-sun-bb.ts
 */
import { prisma } from '../lib/prisma'

async function main() {
  // ── id 39 · ULTRA SHIELD SUN CREAM [SPF 50+ PA++++] ─────────────────────
  // Formula: UAE - GENOSYS ULTRA SHIELD SUN CREAM (RENEWED)/Formula-*.pdf
  const ultra = await prisma.product.findFirst({ where: { name: { contains: 'ULTRA SHIELD' } } })
  if (ultra) {
    await prisma.product.update({
      where: { id: ultra.id },
      data: {
        description:
          'ULTRA SHIELD SUN CREAM [SPF 50+ PA++++] is a non-greasy, silky sunscreen with powerful broad-spectrum UV protection. A 7-filter UV system shields skin against UVA and UVB rays, while Niacinamide 2%, Ceramide NP, hydrolyzed hyaluronic acid and probiotic ferment lysate hydrate, brighten and support the skin barrier. Free from oxybenzone and octinoxate. Dermatologically tested.',
        keyFeatures: JSON.stringify([
          { title: 'Ultra-High Protection', description: 'SPF 50+ PA++++ provides maximum protection against both UVA and UVB rays.' },
          { title: '7-Filter UV Defense', description: 'A broad-spectrum system of seven UV filters (including Homosalate, Ethylhexyl Salicylate, Terephthalylidene Dicamphor Sulfonic Acid, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ethylhexyl Triazone and Titanium Dioxide) for high, photostable protection.' },
          { title: 'Non-Greasy Formula', description: 'Silky, lightweight texture that absorbs quickly without leaving a greasy residue.' },
          { title: 'Oxybenzone & Octinoxate Free', description: 'Formulated without the two UV filters most associated with coral-reef concerns.' },
        ]),
        ingredients: JSON.stringify([
          { name: '7-Filter UV System', description: 'Homosalate, Ethylhexyl Salicylate, Terephthalylidene Dicamphor Sulfonic Acid, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ethylhexyl Triazone and Titanium Dioxide — broad-spectrum UVA/UVB defense.' },
          { name: 'Niacinamide 2%', description: 'Vitamin B3 at a meaningful 2% — brightening, tone-balancing and barrier-supporting.' },
          { name: 'Ceramide NP', description: 'Skin-identical barrier lipid that helps lock in moisture and protect against environmental stress.' },
          { name: 'Hydrolyzed Sodium Hyaluronate', description: 'Ultra-low molecular weight hyaluronic acid for deep hydration and skin recovery.' },
          { name: 'Lactobacillus Ferment Lysate', description: 'Probiotic ferment that helps strengthen the skin barrier.' },
          { name: 'Tropical Fruit Extracts', description: 'Pineapple, Papaya, Litchi and Guava extracts — a gentle botanical antioxidant blend.' },
        ]),
        directions:
          'This product is dermatologically tested and safe for all skin types. Free from oxybenzone and octinoxate. For maximum protection, apply generously and reapply frequently. Store in a cool, dry place.',
      },
    })
    console.log('✓ 39 ULTRA SHIELD fixed')
  }

  // ── MULTI SUN CREAM [SPF 40 PA++] (id 40) ───────────────────────────────
  // Formula: Ingredient lists_old/GENOSYS MULTI SUN CREAM.pdf — NO hyaluronate in formula
  const multiSun = await prisma.product.findFirst({ where: { name: { contains: 'MULTI SUN' } } })
  if (multiSun) {
    await prisma.product.update({
      where: { id: multiSun.id },
      data: {
        ingredients: JSON.stringify([
          { name: 'Palmitoyl Pentapeptide-4', description: 'Advanced peptide that helps repair and protect skin from environmental damage while promoting healing.' },
          { name: 'Mannan + Glycerin', description: 'Film-forming humectant duo that attracts and locks in moisture for soft, hydrated skin.' },
          { name: 'Botanical Callus Culture Extracts', description: 'Rosa Damascena and Vitis Vinifera extracts provide antioxidant protection and skin nourishment.' },
          { name: 'Centella Asiatica Extract', description: 'Soothing and healing ingredient that calms irritated skin and promotes skin repair.' },
          { name: 'Scutellaria Baicalensis Root Extract', description: 'Powerful antioxidant that protects skin from free radical damage and environmental stress.' },
          { name: 'Lactobacillus/Soymilk Ferment Filtrate', description: 'Probiotic ingredient that helps strengthen skin barrier and maintain healthy skin microbiome.' },
        ]),
      },
    })
    console.log('✓ 40 MULTI SUN fixed (Sodium Hyaluronate removed — absent from formula)')
  }

  // ── SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] (id 41) ───────────
  // Artwork: SPF50+ PA++++ (4 languages); formula: 9 peptides at trace % (NO 40%);
  // artwork: 15g + 15g refill; shades Ivory/Beige/Camel; Niacinamide 2%
  const cushion = await prisma.product.findFirst({ where: { name: { contains: 'BLEMISH BALM CUSHION' } } })
  if (cushion) {
    await prisma.product.update({
      where: { id: cushion.id },
      data: {
        size: '15g + 15g Refill',
        description:
          'GENOSYS SKIN CARING BLEMISH BALM CUSHION is a BB cushion that can be used after professional treatment. More than 60% of the product is composed of moisture essence, which enables a natural and healthy glow. The 9-Peptide Complex (Pep9) helps calm and condition the skin, with Glutathione, Volufiline™ and Niacinamide 2%. Includes a 15g refill (15g × 2 total). Available in three shades: #01 Ivory, #02 Beige, #03 Camel. (SPF 50+ / PA++++)',
        ingredients: JSON.stringify([
          {
            name: 'Repairing Pep9 Complex',
            description:
              'Nine skin-conditioning peptides — Hexapeptide-9, Copper Tripeptide-1, Palmitoyl Pentapeptide-4, Palmitoyl Tripeptide-1, Hexapeptide-11, Tripeptide-1, Alanine/Histidine/Lysine Polypeptide Copper HCl, Acetyl Hexapeptide-8 and Nonapeptide-1 — supporting collagen induction, firming and brightening.',
            subList: ['Hexapeptide-9', 'Copper Tripeptide-1', 'Palmitoyl Pentapeptide-4', 'Palmitoyl Tripeptide-1', 'Hexapeptide-11', 'Tripeptide-1', 'Alanine/Histidine/Lysine Polypeptide Copper HCl', 'Acetyl Hexapeptide-8', 'Nonapeptide-1'],
          },
          { name: 'Niacinamide 2%', description: 'Vitamin B3 at 2% — brightening and barrier-supporting, helps even out skin tone.' },
          { name: 'Volufiline™', description: 'Sarsasapogenin from Anemarrhena Asphodeloides root. It provides a volume-enhancing benefit by a cosmetic lipofilling-like effect. And as rich in saponin, it has anti-inflammatory and antioxidant features.' },
          { name: 'Glutathione', description: 'As a powerful antioxidant, it helps brighten and even skin by blocking the tyrosinase activity. And it also has a beneficial effect for cystic acne or even the occasional breakout.' },
        ]),
      },
    })
    console.log('✓ 41 CUSHION fixed (SPF 50+, 40% removed, refill + shades added)')
  }

  // ── INTENSIVE BLEMISH BALM CREAM [SPF 30 PA++] (id 42) ──────────────────
  // Formula: no Phytolex SC; Arbutin 2% present; UV filters TiO2 7.7% + EHMC 7% + Octocrylene 5%
  const ibb = await prisma.product.findFirst({ where: { name: { contains: 'INTENSIVE BLEMISH BALM' } } })
  if (ibb) {
    await prisma.product.update({
      where: { id: ibb.id },
      data: {
        ingredients: JSON.stringify([
          { name: 'Arbutin 2%', description: 'High-concentration brightening active that helps reduce the look of pigmentation and even out skin tone.' },
          { name: 'Adenosine', description: 'Anti-aging ingredient that helps reduce fine lines and wrinkles while promoting skin renewal.' },
          { name: 'Allantoin', description: 'Soothing and healing ingredient that calms irritated skin and promotes skin regeneration.' },
          { name: 'Botanical Soothing Complex', description: 'Eucalyptus Globulus Leaf Oil, Perilla Ocymoides Seed Oil, Betula Platyphylla Japonica Bark Extract and Rumex Crispus Root Extract — plant actives that calm and protect.' },
          { name: 'UV Filter System', description: 'Titanium Dioxide with Ethylhexyl Methoxycinnamate and Octocrylene — mineral and organic filters behind the SPF 30 PA++ protection.' },
        ]),
      },
    })
    console.log('✓ 42 INTENSIVE BB fixed (Phytolex SC removed, Arbutin 2% + real filters added)')
  }

  // ── REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++] (id 63) ───────────────
  // Artwork: tube BB cream — NO puff; "Film Gel Network" unsupported; 8 herbs in formula
  const revita = await prisma.product.findFirst({ where: { name: { contains: 'REVITA GLOW' } } })
  if (revita) {
    await prisma.product.update({
      where: { id: revita.id },
      data: {
        description:
          "Genosys REVITA GLOW BLEMISH BALM CREAM [SPF 38 PA+++]. 50g. An instantly revitalizing complexion formula that enhances the skin's natural luminosity for a clear, glass-like glow. A regenerative BB cream infused with a complex of 10 vitamins and 8 herbal extracts, instantly energizing the skin while naturally covering skin imperfections. Available in two shades: #01 Bright for an illuminating glow with a clear, radiant complexion, and #02 Natural for a refined glow with a natural, healthy-looking complexion. UV protection (SPF 38 PA+++). Niacinamide 2% for brightening and barrier support. Key ingredients: 10 Vitamin Complex (Vitamins A, B1, B2, B3, B4, B5, B7, B9, C, E), Herb Complex (Camellia Sinensis Leaf Extract, Rosmarinus Officinalis Leaf Extract, Centella Asiatica Extract, Tremella Fuciformis Extract, Chamomilla Recutita Flower Extract, Polygonum Cuspidatum Root Extract, Scutellaria Baicalensis Root Extract, Glycyrrhiza Uralensis Root Extract), Adenosine, Erythritol. Effects: Revitalizing, Hydrating, Soothing & Barrier Protecting, Coverage. Dermatologically tested.",
        ingredients: JSON.stringify([
          { name: '10 Vitamin Complex', description: 'Vitamin A Derivative (antioxidant, anti-aging), Vitamins B1, B2, B3, B4, B5, B7, B9 (oil-moisture balance, soothing, barrier support), Vitamin C (anti-aging, brightening, pigmentation care), Vitamin E (antioxidant, hydration, firming)' },
          { name: 'Herb Complex (8 botanicals)', description: 'Camellia Sinensis Leaf Extract, Rosmarinus Officinalis (Rosemary) Leaf Extract, Centella Asiatica Extract, Tremella Fuciformis (Mushroom) Extract, Chamomilla Recutita (Matricaria) Flower Extract, Polygonum Cuspidatum Root Extract, Scutellaria Baicalensis Root Extract, Glycyrrhiza Uralensis (Licorice) Root Extract — provides anti-inflammatory, soothing, antioxidant, barrier protection, and hydration benefits' },
          { name: 'Niacinamide 2%', description: 'The highest-concentration active in the formula — brightening, tone-evening and barrier-supporting Vitamin B3.' },
          { name: 'Adenosine', description: 'Improves wrinkles and firms skin by increasing collagen synthesis and stimulating fibroblasts. Anti-inflammatory effect.' },
          { name: 'Erythritol', description: 'Skin cooling and moisture attraction for a refreshed feel.' },
          { name: 'Tremella Fuciformis (Mushroom) Extract', description: 'Plant-derived hyaluronic acid alternative for long-lasting hydration.' },
        ]),
        howToUse:
          'Step 1 - Skin Smoothing & Fitting: The smoothing texture reduces the look of skin surface irregularities, creating a smooth, uniform base that adheres evenly and seamlessly.\n\nStep 2 - Skin Revitalizing: A powerful blend of 10 vitamins, herbal complexes, and naturally derived moisturizing ingredients energizes the skin to create a naturally radiant, glass-like glow.\n\nStep 3 - Long-Lasting Radiant Finish: The formula sets to a comfortable, transfer-resistant finish that protects moisture and active ingredients, maintaining a smooth, radiant complexion all day without dryness.',
        directions:
          'After your skincare routine, apply an appropriate amount to the face and blend evenly with fingertips, a sponge, or a brush. Build coverage as desired. Use daily as the final step of your skincare routine before sun exposure.\n\nAvailable Shades:\n• #01 Bright: Illuminating glow for a clear, radiant complexion\n• #02 Natural: Refined glow for a natural, healthy-looking complexion',
      },
    })
    console.log('✓ 63 REVITA GLOW fixed (puff + Film Gel Network removed, 8 herbs, Niacinamide 2%)')
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
