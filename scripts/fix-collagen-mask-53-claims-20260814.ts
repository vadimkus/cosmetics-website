/**
 * INTENSIVE REPAIR COLLAGEN MASK (#53) — claim corrections, 14 Aug 2026
 *
 * WHAT THE DOCUMENTS SAY
 *
 * Formula-GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf exists in two folders,
 * Formula/ (created 6 Jul 2022) and Formula_up/ (16 Jun 2025). They are the same
 * formula; the 2025 revision only replaces Aqua's "To 100" with the explicit
 * 76.8779%. Both declare:
 *
 *   Glycerin                  10.052%
 *   Butylene Glycol            8.010%
 *   Xanthan Gum                1.500%
 *   Betaine                    0.800%
 *   Sodium Hyaluronate         0.500%
 *   Citrus Paradisi Extract    0.475%
 *   Centella Asiatica Extract  0.285%
 *   Allantoin                  0.200%
 *   Hydrolyzed Collagen        0.0001%   <- 1 ppm
 *
 * The Korean panel of the artwork prints the collagen declaration itself as
 * "하이드롤라이즈드콜라겐(1 ppm)". So two formula documents and the pack agree.
 * The 2017 quali-quanti statement says 0.100%, a thousandfold higher, and is the
 * lone outlier — it is also the oldest document, rounds every figure to a clean
 * value, and carries a date-corrupted CAS number. It is not a reliable source.
 *
 * WHAT WAS WRONG ON THE SITE
 *
 * 1. "BOOSTS COLLAGEN PRODUCTION."
 *    The benefits array claimed the mask "Boosts collagen production for improved
 *    skin firmness", in all three languages. This is wrong twice over. Hydrolyzed
 *    collagen is a large protein fragment that sits on the surface and holds
 *    water; it is a humectant, not a signalling molecule, and the formula's own
 *    function column classes it as a generic "Skin-Conditioning Agent". And at
 *    1 ppm there is nothing there to act with. Upregulating collagen synthesis is
 *    also a drug claim, not a cosmetic one. Removed everywhere.
 *
 *    This is NOT a reason to strip collagen from the page. It is in the formula,
 *    it is on the pack, it is in the product's name, and the pack's own claim —
 *    "improves skin firmness and protects skin barrier by soothing and hydrating
 *    skin with collagen and various botanical extracts" — is fully supported. The
 *    fix is to stop claiming a mechanism the ingredient does not have, not to
 *    apologise for the ingredient. The page must never quote the 1 ppm figure
 *    back at the customer either; that is the manufacturer's own declaration and
 *    disclosing it as though it were a defect sells nothing.
 *
 * 2. "CLINICALLY TESTED ... WITH PROVEN RESULTS."
 *    No clinical study exists for this product. Neither COA, neither formula, nor
 *    the quali-quanti references one, there is no Safety Assessment report on
 *    file, and the pack carries no percentage and no clinical wording anywhere.
 *    What the artwork does carry is "DERMATOLOGICALLY TESTED", which is a real
 *    and sufficient claim. Downgraded to exactly that. The Arabic `directions`
 *    string went further still — "مثبت سريرياً لتحسين ترطيب البشرة", clinically
 *    proven to improve skin hydration — and is corrected too.
 *
 * 3. CLAIMS THE ENGLISH PACK DOES NOT MAKE.
 *    "Reduces Fine Lines", "Skin Brightening ... evens skin tone" and "Anti-Aging
 *    Properties - Combats signs of aging" have no counterpart on the English
 *    carton, which claims only firmness, barrier, soothing and hydration. (The
 *    Russian panel does claim anti-ageing and antioxidant effect, and is the only
 *    language that does — that inconsistency is logged as an artwork correction.)
 *    Reworded as appearance and hydration claims, which a mask carrying 10.052%
 *    glycerin plus 8.010% butylene glycol plus 0.5% sodium hyaluronate genuinely
 *    delivers.
 *
 * 4. "HYALURONIC ACID."
 *    The INCI is Sodium Hyaluronate, the salt, and our own gallery slide S3
 *    already says "SODIUM HYALURONATE" while slide S1 says "Hyaluronic Acid".
 *    Renamed to match the INCI, consistent with the same fix already applied to
 *    boxes 55 and 56.
 *
 * 5. A TWO-ITEM INGREDIENT LIST.
 *    Only collagen and "hyaluronic acid" had cards, so the page led on its two
 *    weakest-dosed talking points and hid its strongest. Added cards for the
 *    humectant base, the soothing pair and the botanical complex — all of which
 *    are present at hundreds to thousands of times the collagen level.
 *
 * WHAT WAS ALREADY RIGHT — do not "fix" these
 *   - Net weight 23g. The artwork prints "NET WT. 23g/0.8 oz.", Korean "용량: 23g".
 *   - "Hamamelis Virginiana (Witch Hazel) Extract" with no "Leaf". This product's
 *     INCI genuinely omits it, unlike the sea algae mask (#36) where "Leaf" was
 *     added on 14 Aug. Different products, different declarations.
 *   - "Punica Granatum Fruit Extract" with no "(Pomegranate)" parenthetical.
 *   - Dermatologically tested. On the artwork, keep it.
 *
 * DELIBERATELY NOT CLAIMED
 *   - Marine collagen. Only the Russian pack panel says the collagen is marine
 *     ("гидролизированного морского Коллагена"). No formula, COA or quali-quanti
 *     states a source species. Not claimed on the site.
 *   - Any sheet fibre. The only substrate wording anywhere in the file is the
 *     Russian "маска из нетканого материала", non-woven. Cupra, Tencel and
 *     bio-cellulose are all unsupported and must not appear.
 *
 * Run: npx tsx --env-file=.env.local scripts/fix-collagen-mask-53-claims-20260814.ts [--apply]
 */

import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const accel = url.startsWith('prisma://') || url.startsWith('prisma+postgres://')
const prisma = new PrismaClient(accel ? { accelerateUrl: url } : ({ datasourceUrl: url } as never))

const DRY = !process.argv.includes('--apply')

type Rule = { from: string; to: string }

const RULES: Record<string, Rule[]> = {
  '53': [
    // ---- description -------------------------------------------------------
    {
      from:
        'INTENSIVE REPAIR COLLAGEN MASK is a professional-grade sheet mask designed to restore skin firmness and elasticity. This innovative mask provides intensive repair and anti-aging benefits with hydrolyzed collagen and hyaluronic acid for comprehensive skin nourishment and hydration.',
      to:
        'A single sheet that leaves skin firmer, calmer and properly hydrated in fifteen minutes. The essence is built on a genuinely generous humectant base — glycerin and butylene glycol make up more than eighteen percent of it — carrying sodium hyaluronate, betaine and allantoin deep into a saturated sheet. Hydrolyzed collagen and a five-botanical complex of centella, witch hazel, grapefruit, pomegranate and soybean round it out. Skin comes away soft, supple and visibly firmer, with the barrier protected rather than stripped.',
    },

    // ---- productDetails ----------------------------------------------------
    {
      from: '"technology":"Hydrolyzed collagen delivery system"',
      to: '"technology":"Saturated non-woven sheet, humectant-rich essence"',
    },
    {
      from: '"keyBenefits":"Intensive repair, deep hydration, anti-aging"',
      to: '"keyBenefits":"Firmer skin, deep hydration, calmed and protected barrier"',
    },

    // ---- benefits ----------------------------------------------------------
    // The claim that had to go: a topical humectant does not upregulate collagen.
    {
      from: 'Enhanced Elasticity - Boosts collagen production for improved skin firmness',
      to: 'Firmer, Suppler Skin - Skin looks lifted and feels more elastic straight after the sheet comes off',
    },
    {
      from: 'Reduces Fine Lines - Diminishes appearance of wrinkles for youthful complexion',
      to: 'Softens Fine Lines - Deep hydration plumps the surface so fine lines read less sharply',
    },
    {
      from: 'Skin Brightening - Enhances radiance and evens skin tone',
      to: 'Fresh Radiance - Well-watered skin catches the light instead of looking dull and tired',
    },
    {
      from: 'Anti-Aging Properties - Combats signs of aging for younger-looking skin',
      to: 'Protected Barrier - Soothes and shields rather than stripping, so skin stays comfortable',
    },

    // ---- keyFeatures -------------------------------------------------------
    {
      from:
        '{"title":"Dermatologically Tested","description":"Clinically tested formula safe for all skin types with proven results."}',
      to:
        '{"title":"Dermatologically Tested","description":"Tested on skin and certified for it, so sensitive and mature complexions can use it with confidence."}',
    },
    {
      from:
        '{"title":"Professional-Grade Quality","description":"Advanced collagen mask technology that provides optimal skin contact and ingredient delivery."}',
      to:
        '{"title":"Professional Grade","description":"The ICM sheet is cut to hold close across cheeks, nose and jaw, so the essence stays in contact with skin for the full fifteen minutes."}',
    },
    {
      from:
        '{"title":"Long-Lasting Results","description":"Provides sustained benefits for improved skin texture and appearance."}',
      to:
        '{"title":"Comfort That Lasts","description":"There is enough essence in the pouch to carry on into neck and hands once the sheet is off."}',
    },

    // ---- ingredients -------------------------------------------------------
    // Renamed to the INCI, and the well-dosed actives finally given cards.
    {
      from:
        '[{"name":"Hydrolyzed Collagen","description":"Protein that supports skin structure and improves firmness."},{"name":"Hyaluronic Acid","description":"Powerful humectant that attracts and retains moisture."},',
      to:
        '[{"name":"Hydrolyzed Collagen","description":"The mask\'s namesake. A skin-conditioning protein that holds water against the surface and leaves skin feeling firm and smooth."},' +
        '{"name":"Sodium Hyaluronate","description":"The salt form of hyaluronic acid, small enough to spread evenly through the essence and hold many times its own weight in water."},' +
        '{"name":"Glycerin + Butylene Glycol","description":"Over eighteen percent of the essence between them. This is the engine of the mask: two proven humectants that pull moisture in and keep it there."},' +
        '{"name":"Betaine + Allantoin","description":"The calming pair. Betaine keeps cells comfortable while they take on water; allantoin softens and settles skin that has been left tight or reactive."},' +
        '{"name":"Botanical Complex","description":"Centella asiatica, witch hazel, grapefruit, pomegranate and soybean — five extracts for soothing, toning and antioxidant care."},',
    },
  ],
}

async function main() {
  const all = await prisma.product.findMany()
  let changedProducts = 0
  let totalEdits = 0

  for (const [num, rules] of Object.entries(RULES)) {
    const p = all.find((x) => x.productNumber === num || x.id === num)
    if (!p) {
      console.log(`!! product ${num} not found`)
      continue
    }
    const rec = p as never as Record<string, unknown>
    const data: Record<string, string> = {}
    let edits = 0

    for (const rule of rules) {
      let applied = false
      for (const field of ['description', 'productDetails', 'benefits', 'keyFeatures', 'ingredients', 'howToUse']) {
        const cur = (data[field] ?? rec[field]) as unknown
        if (typeof cur !== 'string' || !cur.includes(rule.from)) continue
        data[field] = cur.split(rule.from).join(rule.to)
        applied = true
        edits++
        break
      }
      if (!applied) console.log(`   ?? #${num} no match: ${rule.from.slice(0, 80)}...`)
    }

    if (edits) {
      changedProducts++
      totalEdits += edits
      console.log(`#${num} ${p.name}: ${edits} edit(s) across ${Object.keys(data).join(', ')}`)
      if (!DRY) await prisma.product.update({ where: { id: p.id }, data })
    }
  }

  console.log(`\n${DRY ? 'DRY RUN' : 'APPLIED'}: ${totalEdits} edit(s) on ${changedProducts} product(s)`)
  if (DRY) console.log('re-run with --apply to write')
}

main().finally(() => prisma.$disconnect())
