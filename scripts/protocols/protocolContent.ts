/**
 * Content for the seven concern protocols other than hair loss.
 *
 * ★ WHY THESE WERE REWRITTEN. Every "Key Active Ingredients" table in the previous
 * generation was checked against the products' full INCI lists on 18 Aug 2026.
 * TWENTY-TWO attributions were wrong — ingredients named in products that do not
 * contain them. All twenty-two are listed in
 * docs/SESSION_CHANGES_2026-08-18_CONCERN_PROTOCOLS_REWRITE.md and each is retracted by
 * name in the `correction` field of the protocol it appeared in.
 *
 * The pattern was the same one found across the product range: the ingredient a customer
 * would recognise gets named, and the ingredient actually present at a working dose —
 * zinc PCA, betaine, ceramide NP, MultiEx BSASM Plus — goes unmentioned.
 *
 * Every figure below comes from the audited product records. Do not add an ingredient to
 * a dose table without checking the product's full INCI first.
 */

import type { Protocol } from './protocolTemplate'

const SHIPPING = 'Orders over AED 1,000 ship free within the UAE.'

export const PROTOCOLS: Protocol[] = [
  // ─────────────────────────────── ACNE ───────────────────────────────
  {
    slug: 'acne',
    out: 'public/documents/PPT/Protocol_acne.pdf',
    title: 'Oily & Breakout-Prone Skin — Home Protocol',
    standfirst: 'The Intensive Problem Control range, what is actually in it, and how to use it in this climate.',
    scope: [
      '<b>Who this is for:</b> oily, combination or breakout-prone skin, and anyone dealing with congestion and visible pores in UAE heat.',
      '<b>What these products are:</b> registered cosmetics for oily and blemish-prone skin. They clean, they reduce the look of oil, and they hydrate without adding any.',
      '<b>What they are not:</b> acne medication. Persistent, painful, cystic or scarring acne is a medical condition, and a dermatologist has options — topical retinoids, antibiotics, hormonal treatment — that no cosmetic can substitute for. Use this alongside that, not instead of it.',
    ],
    sections: [
      {
        heading: 'Why UAE skin gets oilier',
        intro: 'Not a claim about the products — just the conditions they have to work in.',
        bullets: [
          '<b>Heat and humidity.</b> Sebum output rises with skin temperature. Nothing you apply changes the weather.',
          '<b>Air conditioning.</b> Dry indoor air dehydrates the surface, and dehydrated skin behaves oilier, not drier.',
          '<b>Sunscreen and sweat together.</b> A necessary layer plus a full day of heat is a lot to remove properly at night.',
          '<b>Dust.</b> Fine particulate settles and mixes with sebum between cleanses.',
        ],
      },
      {
        heading: 'Morning',
        steps: [
          {
            title: '1. Cleanse without rubbing',
            meta: '<b>SNOW O₂ CLEANSER</b> · 130 ml · AED 330',
            body: [
              'Apply to dry skin and let it foam. The foam comes from <span class="dose">methyl perfluoroisobutyl ether at 8%</span> with a sugar surfactant — that is the mechanism, and it is why the product works without scrubbing. On skin with active lesions, not rubbing is the point.',
              'Rinse with lukewarm water. Hot water strips the barrier and the skin compensates with more oil.',
            ],
          },
          {
            title: '2. Toner, where the real active is',
            meta: '<b>INTENSIVE PROBLEM CONTROL TONER</b> · 150 ml or 200 ml · AED 260',
            body: [
              'Sweep across the T-zone, chin and jawline, or spray. The working ingredient is <span class="dose">zinc PCA at 0.5%</span> — ten times the concentration in the serum that follows, and the highest in the range.',
              'The salicylic acid on the label is <span class="dose">0.001%</span>. That is not an exfoliating dose and we are not going to describe it as one.',
            ],
          },
          {
            title: '3. Serum',
            meta: '<b>PROBLEM CONTROL SERUM</b> · 30 ml · AED 330',
            body: [
              'Two or three drops, patted rather than rubbed. <span class="dose">Zinc PCA 0.05%</span>, neat, in a bottle that is around 90% water, with <span class="dose">panthenol 0.2%</span> and <span class="dose">allantoin 0.1%</span> for comfort.',
              'It is not an acid step. There is no salicylic acid in it; the willow bark extract sits at <span class="dose">0.001%</span>.',
            ],
          },
          {
            title: '4. Moisturise — do not skip it',
            meta: '<b>INTENSIVE PROBLEM CONTROL CREAM</b> · 50 g or 250 g · AED 290',
            body: [
              'The distinctive thing about this cream is what is absent: no plant oil, no butter, no wax, no emulsifier. It is 86.6% water held together by 1.3% of polymer, with the same <span class="dose">zinc PCA 0.05%</span> as the serum.',
              'Massage it in. Skipping moisturiser on oily skin is the most common mistake there is — dehydrated skin produces more oil, not less.',
            ],
          },
          {
            title: '5. Sun protection',
            meta: '<b>ULTRA SHIELD SUN CREAM SPF 50+ PA++++</b> · 50 ml · AED 250',
            body: [
              'Every mark left by a blemish darkens with UV, and that is the difference between a spot that fades in weeks and one that lingers for months. This is the higher-rated of the two sun creams and it is fragrance-free.',
            ],
          },
        ],
      },
      {
        heading: 'Evening',
        steps: [
          {
            title: 'Double cleanse',
            meta: '<b>SKIN DEFENDER LIP & EYE MAKEUP REMOVER</b> AED 290 · then <b>SNOW O₂ CLEANSER</b> AED 330',
            body: [
              'The remover is biphasic and nearly half oil phase — shake it, hold it in place a few seconds, then wipe. It takes sunscreen off properly, which water-based cleansing on its own does not.',
            ],
          },
          {
            title: 'Exfoliate, two or three times a week',
            meta: '<b>EPI TURNOVER BOOSTING PEELING GEL</b> · 120 ml · AED 250',
            body: [
              'Onto dry skin, massaged in circles. The rolling is <span class="dose">cellulose at 3%</span>, with an enzyme; <b>there is no AHA or BHA in this product</b>, whatever it may have been called before. It is a gentle mechanical clean-up, not a chemical peel.',
              'Skip it on nights when skin is irritated or there are open lesions.',
            ],
          },
          {
            title: 'Then toner, serum and cream as in the morning',
            body: [
              'Actives get an uninterrupted run overnight. If skin feels tight, mix a drop of MOISTURE REPLENISHING HYALURON SERUM (AED 330) into the cream — it adds water, not oil.',
            ],
          },
        ],
      },
    ],
    doseIntro:
      'Carton ingredient lists run in the manufacturer\u2019s order, not by quantity, so an ingredient can head a list and still be present in parts per million. These are the measured concentrations from the signed formulas.',
    doses: [
      { ingredient: 'Zinc PCA', where: 'Toner <span class="dose">0.5%</span> · Serum <span class="dose">0.05%</span> · Cream <span class="dose">0.05%</span>', note: 'The actual working active across all three, and it was named in none of them before' },
      { ingredient: 'Salicylic acid', where: 'Toner <span class="dose">0.001%</span> · none in the serum or cream', note: 'On the label, nowhere near an exfoliating dose' },
      { ingredient: 'Willow bark extract', where: 'Serum <span class="dose">0.001%</span>', note: 'The natural salicylate everyone assumes is doing the work. It is not' },
      { ingredient: 'Panthenol, allantoin', where: 'Serum <span class="dose">0.2%</span> and <span class="dose">0.1%</span> · Cream <span class="dose">0.1%</span> each', note: 'Comfort ingredients, at real concentrations' },
      { ingredient: 'Trehalose, xylitol', where: 'Serum <span class="dose">1%</span> and <span class="dose">0.5%</span> · Cream <span class="dose">1.5%</span> and <span class="dose">0.5%</span>', note: 'The humectants doing the hydrating in an oil-free base' },
      { ingredient: 'Beta-glucan', where: 'Serum <span class="dose">0.08%</span> · Cream <span class="dose">0.1%</span>', note: 'Soothing, present at a sensible level' },
      { ingredient: 'Cellulose', where: 'Peeling gel <span class="dose">3%</span>', note: 'What rolls off. The gel contains no AHA and no BHA' },
      { ingredient: 'Methyl perfluoroisobutyl ether', where: 'Snow O₂ Cleanser <span class="dose">8%</span>', note: 'The foam. Second ingredient after water' },
    ],
    correction:
      'An earlier version of this protocol said the serum contained <b>salicylic acid</b> and <b>tea tree extract</b>, that the toner, serum and cream all contained <b>niacinamide</b>, that the cream contained <b>centella asiatica</b>, and that the cleanser and cream contained <b>hyaluronic acid</b>. <b>None of those is in the product it was attributed to</b> — each was checked against the full ingredient list. Meanwhile <b>zinc PCA</b>, the one active present at a working dose in all three Problem Control products, was not mentioned anywhere. The table above is taken from the signed formulas.',
    sets: [
      {
        heading: 'Daily essentials',
        rows: [
          { label: 'SNOW O₂ CLEANSER · 130 ml', price: '330' },
          { label: 'INTENSIVE PROBLEM CONTROL TONER', price: '260' },
          { label: 'INTENSIVE PROBLEM CONTROL CREAM · 50 g', price: '290' },
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+', price: '250' },
          { label: 'Total', price: 'AED 1,130', total: true },
        ],
      },
      {
        heading: 'Full routine — adds the serum',
        rows: [
          { label: 'The four above', price: '1,130' },
          { label: 'PROBLEM CONTROL SERUM · 30 ml', price: '330' },
          { label: 'Total', price: 'AED 1,460', total: true },
        ],
      },
      {
        heading: 'With cleansing and weekly exfoliation',
        rows: [
          { label: 'The five above', price: '1,460' },
          { label: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', price: '290' },
          { label: 'EPI TURNOVER BOOSTING PEELING GEL', price: '250' },
          { label: 'Total', price: 'AED 2,000', total: true },
        ],
      },
    ],
    warnings: [
      {
        title: 'Things that reliably go wrong',
        body: 'Most of what undoes an oily-skin routine is behavioural rather than a product problem.',
        items: [
          '<b>Over-cleansing.</b> More than twice a day strips the barrier and the skin answers with more oil.',
          '<b>Skipping moisturiser.</b> The single most common mistake on oily skin.',
          '<b>Hot water.</b> Lukewarm, always.',
          '<b>Picking.</b> It spreads bacteria and turns a spot that would have faded into a mark that will not.',
          '<b>Scrubs.</b> Micro-tears are entry points. Use the peeling gel instead, and not more than three times a week.',
          '<b>Changing products weekly.</b> Give a routine four to six weeks before judging it.',
        ],
      },
    ],
    closing:
      'What to expect, honestly: less surface oil, a more comfortable skin surface, and fewer of the small congested bumps that come from heat and sunscreen. What we will not give you is a week-by-week clearing schedule — an earlier version of this document did. If your breakouts are painful, cystic, scarring or not responding, that is a dermatologist\u2019s appointment, not a skincare decision. ' + SHIPPING,
  },

  // ─────────────────────────── PIGMENTATION ───────────────────────────
  {
    slug: 'pigmentation',
    out: 'public/documents/PPT/Protocol_Pigmentation.pdf',
    title: 'Dark Marks & Uneven Tone — Home Protocol',
    standfirst: 'The Multi Vita Radiance range, the vitamin doses printed on the carton, and the one step that matters most.',
    scope: [
      '<b>Who this is for:</b> uneven tone, sun-related patchiness, and the dark marks left behind by spots or irritation.',
      '<b>What these products are:</b> the Multi Vita Radiance serum and cream are registered in Korea as functional whitening cosmetics, and <b>niacinamide is the active that registration rests on</b>. That is a real, licensed claim and we are happy to make it.',
      '<b>What they are not:</b> a treatment for melasma or any diagnosed pigmentary disorder. Melasma in particular is stubborn, hormone-driven and prone to rebound — a dermatologist has options a cosmetic does not.',
    ],
    sections: [
      {
        heading: 'The step that decides everything',
        intro:
          'Pigment is a UV problem before it is a skincare problem. In a country with a UV index over 11 for much of the year, <b>daily sun protection is not one step among six — it is the step</b>. Everything below works, and none of it out-runs an unprotected afternoon.',
        bullets: [
          '<b>ULTRA SHIELD SPF 50+ PA++++ · AED 250</b> — the higher rating, fragrance-free, with <span class="dose">niacinamide 2%</span> in the base.',
          '<b>MULTI SUN SPF 40 PA++ · AED 210</b> — lighter finish, fragranced, and it contains <span class="dose">octinoxate 7.5%</span> if that is something you avoid.',
        ],
      },
      {
        heading: 'Morning',
        steps: [
          { title: '1. Cleanse', meta: '<b>SNOW O₂ CLEANSER</b> · AED 330', body: ['Foaming, no rubbing, lukewarm rinse.'] },
          {
            title: '2. Hydrating toner',
            meta: '<b>SNOW BOOSTER</b> · 150 ml or 200 ml · AED 260',
            body: ['<span class="dose">Betaine at 3%</span> is the figure on this card — a humectant, not a brightener. It preps the skin; it does not act on pigment, and we are not going to imply it does.'],
          },
          {
            title: '3. The brightening step',
            meta: '<b>MULTI VITA RADIANCE SERUM</b> · 30 ml · AED 330',
            body: [
              'The carton prints the dose of every vitamin in it, which is unusual and worth using: <span class="dose">niacinamide 20,000 ppm</span> (2%), <span class="dose">panthenol 10,000 ppm</span>, <span class="dose">3-O-ethyl ascorbic acid 1,000 ppm</span>, tocopherol 300 ppm, then eleven more vitamins at a part per billion and below.',
              'Note the vitamin C form: it is <b>ethyl ascorbic acid</b>, a stable derivative, not L-ascorbic acid. It does not oxidise the way pure vitamin C does, which is why the serum is not sold in an opaque airless pump.',
            ],
          },
          { title: '4. Sunscreen', meta: 'See above', body: ['Reapply if you are outdoors for any length of time.'] },
        ],
      },
      {
        heading: 'Evening',
        steps: [
          {
            title: 'Cleanse, treat, seal',
            meta: '<b>MULTI VITA RADIANCE CREAM</b> · 50 g · AED 290',
            body: [
              'Same <span class="dose">niacinamide at 2%</span> as the serum — and this is the one certificate in the range that assays its active rather than declaring it, finding <span class="dose">2.04%</span> on the batch tested.',
              'Carried in <span class="dose">13% macadamia oil</span>, so it is a richer finish than the serum. The orange tint is astaxanthin at <span class="dose">10 ppm</span> — that is the colour, not the engine.',
            ],
          },
          {
            title: 'Weekly, if your skin tolerates it',
            meta: '<b>EPI TURNOVER BOOSTING PEELING GEL</b> · AED 250',
            body: ['<span class="dose">Cellulose 3%</span> with an enzyme. It lifts dulling surface debris. It contains no AHA and no BHA, so it will not accelerate turnover the way an acid would.'],
          },
        ],
      },
    ],
    doseIntro:
      'The Multi Vita cartons print their own vitamin doses, which almost no cosmetic does. Here they are, alongside the ingredients customers most often assume are present.',
    doses: [
      { ingredient: 'Niacinamide', where: 'MV Serum <span class="dose">2%</span> · MV Cream <span class="dose">2%</span>, assayed at 2.04%', note: 'The functional active behind the Korean whitening registration' },
      { ingredient: 'Ethyl ascorbic acid', where: 'MV Serum <span class="dose">1,000 ppm</span>', note: 'A stable vitamin C derivative — not L-ascorbic acid' },
      { ingredient: 'Ascorbic acid', where: 'MV Cream <span class="dose">0.01%</span>', note: 'Present, at trace' },
      { ingredient: 'Panthenol', where: 'MV Serum <span class="dose">1%</span>', note: 'A genuine dose, and rarely mentioned' },
      { ingredient: 'MELAZERO', where: 'MV Serum — loquat <span class="dose">0.04%</span>, spearmint <span class="dose">0.01%</span>', note: 'A real branded complex, at trace' },
      { ingredient: 'Astaxanthin', where: 'MV Cream <span class="dose">10 ppm</span>', note: 'The orange colour of the cream' },
      { ingredient: 'Betaine', where: 'Snow Booster <span class="dose">3%</span>', note: 'A humectant. Snow Booster is a hydrating step, not a brightening one' },
      { ingredient: 'Arbutin', where: '<b>Not in any product in this routine.</b> It is in the EyeCell Eye Contour Cream and the Blemish Balm, at <span class="dose">2%</span>', note: 'Named here before, in two products that do not contain it' },
    ],
    correction:
      'An earlier version of this protocol credited the serum with <b>L-ascorbic acid</b> (it is ethyl ascorbic acid), and listed <b>arbutin</b> in the serum and in Snow Booster, <b>niacinamide</b> and <b>hyaluronic acid</b> in Snow Booster, and <b>AHA/BHA</b> in the peeling gel. <b>None of those is in the product it was attributed to.</b> Arbutin is a real GENOSYS active at 2% — in two other products.',
    sets: [
      {
        heading: 'Essentials',
        rows: [
          { label: 'MULTI VITA RADIANCE SERUM · 30 ml', price: '330' },
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+', price: '250' },
          { label: 'Total', price: 'AED 580', total: true },
        ],
      },
      {
        heading: 'Full routine',
        rows: [
          { label: 'SNOW O₂ CLEANSER', price: '330' },
          { label: 'SNOW BOOSTER', price: '260' },
          { label: 'MULTI VITA RADIANCE SERUM · 30 ml', price: '330' },
          { label: 'MULTI VITA RADIANCE CREAM · 50 g', price: '290' },
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+', price: '250' },
          { label: 'Total', price: 'AED 1,460', total: true },
        ],
      },
    ],
    closing:
      'What to expect, honestly: a more even surface tone and gradually softer marks, provided the sunscreen is genuinely daily. Existing pigment fades slowly and unevenly, and it returns with sun exposure. If you have been told you have melasma, treat this as supportive care around what your dermatologist prescribes. ' + SHIPPING,
  },

  // ────────────────────────────── SCARS ───────────────────────────────
  {
    slug: 'scar',
    out: 'public/documents/PPT/Protocol_scar.pdf',
    title: 'After Procedures & Marked Skin — Home Protocol',
    standfirst: 'The post-procedure shelf, what is really in it, and where the honest limits are.',
    scope: [
      '<b>Who this is for:</b> skin recovering from microneedling, peels or laser, and skin left marked or textured after breakouts.',
      '<b>What these products are:</b> soothing, barrier-supporting cosmetics for compromised skin. The Soothing Repair Postcream in particular is built for the days after a procedure.',
      '<b>What they are not:</b> scar treatments. A raised, keloid or contracted scar is a medical matter, and established scars generally need procedural work — needling, laser, subcision — rather than a cream. What a good post-procedure routine does is protect the result you paid for.',
    ],
    sections: [
      {
        heading: 'The first 48 hours',
        intro: 'Whatever the procedure, the same three rules apply and they matter more than any product choice.',
        numbered: [
          '<b>Nothing active.</b> No acids, no retinoids, no vitamin C, no exfoliation, no fragrance if you can avoid it.',
          '<b>Nothing hot.</b> No sauna, no hot shower on the face, no exercise that flushes the skin.',
          '<b>No sun at all,</b> then daily SPF once the skin will tolerate it. Fresh marks darken faster than old ones.',
        ],
      },
      {
        heading: 'The routine',
        steps: [
          {
            title: 'Cleanse, minimally',
            meta: '<b>SNOW O₂ CLEANSER</b> · AED 330',
            body: ['It foams rather than needing to be rubbed, which is the only reason it belongs in a post-procedure routine. Lukewarm water, pat dry, no towel friction.'],
          },
          {
            title: 'Soothe',
            meta: '<b>SOOTHING REPAIR POSTCREAM</b> · 50 g · AED 204',
            body: [
              'What actually carries the soothing here is the licorice derivative <span class="dose">dipotassium glycyrrhizate 0.200%</span>, <span class="dose">scutellaria root 0.200%</span>, <span class="dose">allantoin 0.200%</span> and <span class="dose">bisabolol 0.050%</span> — four calming ingredients at real concentrations.',
              'Around <span class="dose">8.3%</span> lipids and <span class="dose">12%</span> butylene glycol with <span class="dose">6.39%</span> glycerin make up the rest of the comfort.',
              'Its growth-factor peptide is present at <span class="dose">1 part per billion</span>. We mention it because the label does, not because it is doing the work.',
            ],
          },
          {
            title: 'Protect the barrier',
            meta: '<b>SKIN BARRIER PROTECTING CREAM</b> · 50 g · AED 450',
            body: [
              'The richest of the face creams and the one with a licensed barrier active: <span class="dose">ceramide NP at 0.5%</span>, which the Korean panel prints as 5,000 ppm, with <span class="dose">glycerin 17.49%</span> and <span class="dose">shea butter 3%</span>.',
              'Use it as the occlusive lid over the postcream when skin is tight or flaking.',
            ],
          },
          {
            title: 'Rehydrate, once the skin is calm',
            meta: '<b>MOISTURE REPLENISHING HYALURON SERUM</b> · AED 330',
            body: ['<span class="dose">Hydrolyzed hyaluronic acid at 2,000 ppm</span> — small enough to sit in the surface rather than on it. Water, not oil, so it layers under anything.'],
          },
          {
            title: 'Then sun protection, without exception',
            meta: '<b>ULTRA SHIELD SPF 50+</b> · AED 250',
            body: ['Fragrance-free and the higher rating of the two. This is the step that decides whether a healing mark fades or sets.'],
          },
        ],
      },
    ],
    doseIntro: 'Measured concentrations from the signed formulas, for the products above.',
    doses: [
      { ingredient: 'Dipotassium glycyrrhizate', where: 'Postcream <span class="dose">0.200%</span>', note: 'The licorice derivative that carries most of the soothing' },
      { ingredient: 'Allantoin', where: 'Postcream <span class="dose">0.200%</span>', note: 'Not in the Barrier Cream, contrary to what we published before' },
      { ingredient: 'Scutellaria root, bisabolol', where: 'Postcream <span class="dose">0.200%</span> and <span class="dose">0.050%</span>', note: 'Two more calming ingredients at real doses' },
      { ingredient: 'Centella triterpenes', where: 'Postcream <span class="dose">0.020%</span> combined', note: 'Present, and smaller than the licorice above it' },
      { ingredient: 'Ceramide NP', where: 'Barrier Cream <span class="dose">0.5%</span>', note: 'The licensed barrier active in this routine' },
      { ingredient: 'Hydrolyzed hyaluronic acid', where: 'Hyaluron Serum <span class="dose">2,000 ppm</span>', note: 'The hydrating step, once skin is calm' },
      { ingredient: 'sh-Oligopeptide-1 (EGF)', where: 'EGF Repair Oxymask Cream <span class="dose">0.1 ppm</span> — and <b>nowhere else</b>', note: 'A dose the manufacturer prints on its own carton, to their credit' },
      { ingredient: 'sh-Polypeptide-7', where: 'Postcream <span class="dose">1 ppb</span>', note: 'The postcream contains no EGF at all' },
    ],
    correction:
      'An earlier version of this protocol listed <b>EGF</b> in the Soothing Repair Postcream and <b>allantoin</b> in the Skin Barrier Protecting Cream. <b>Neither is in the product named.</b> It also credited EGF with "collagen remodelling" and "wound healing" — those are drug claims, and they were attached to an ingredient present at a tenth of a part per million in the one product that does contain it.',
    sets: [
      {
        heading: 'Post-procedure essentials',
        rows: [
          { label: 'SOOTHING REPAIR POSTCREAM · 50 g', price: '204' },
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+', price: '250' },
          { label: 'Total', price: 'AED 454', total: true },
        ],
      },
      {
        heading: 'Full recovery routine',
        rows: [
          { label: 'SNOW O₂ CLEANSER', price: '330' },
          { label: 'SOOTHING REPAIR POSTCREAM · 50 g', price: '204' },
          { label: 'MOISTURE REPLENISHING HYALURON SERUM', price: '330' },
          { label: 'SKIN BARRIER PROTECTING CREAM · 50 g', price: '450' },
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+', price: '250' },
          { label: 'Total', price: 'AED 1,564', total: true },
        ],
      },
    ],
    closing:
      'What to expect, honestly: a calmer, more comfortable recovery and less risk of a fresh mark darkening. What a cream cannot do is remodel an established scar. If a scar is raised, tethered or spreading, that is a dermatologist\u2019s conversation, and the right answer is usually a procedure. ' + SHIPPING,
  },

  // ──────────────────────────── ANTI-AGEING ───────────────────────────
  {
    slug: 'anti-aging',
    out: 'public/documents/PPT/Protocol_Anti-Aging.pdf',
    title: 'Lines & Firmness — Home Protocol',
    standfirst: 'Two licensed anti-wrinkle actives, the doses behind them, and the peptide numbers nobody prints.',
    scope: [
      '<b>Who this is for:</b> fine lines, loss of firmness, and skin that has had years of sun.',
      '<b>What these products are:</b> the Anti-Wrinkle serum and cream carry a Korean anti-wrinkle functional registration, and <b>adenosine at 0.04%</b> is the active it rests on. That is a licensed claim, and it is the same active in the EyeCell cream and the sun creams.',
      '<b>What they are not:</b> an alternative to a procedure. Injectables, energy devices and prescription retinoids operate in a different register. What a routine like this does is protect and maintain.',
    ],
    sections: [
      {
        heading: 'Morning',
        steps: [
          {
            title: 'Serum',
            meta: '<b>MULTI FUNCTIONAL ANTI-WRINKLE SERUM</b> · 30 ml · AED 330',
            body: [
              'The headline number is not a peptide: it is <span class="dose">glycerin at 25.45%</span> — a quarter of the bottle. That is what makes it feel the way it does, and it is the honest description of the product.',
              'On top of that, <span class="dose">niacinamide 2.00%</span>, <span class="dose">adenosine 0.04%</span> (the registered anti-wrinkle active) and <span class="dose">bakuchiol 0.100%</span>.',
              'The six peptides come to about <span class="dose">1.4 ppm</span> combined. Named on the box; too little to build a claim on.',
            ],
          },
          {
            title: 'Sunscreen — the actual anti-ageing step',
            meta: '<b>ULTRA SHIELD SPF 50+ PA++++</b> · AED 250',
            body: ['Photoageing accounts for the majority of visible facial ageing. Nothing else in this document competes with daily sun protection, and this one carries <span class="dose">niacinamide 2%</span> and <span class="dose">adenosine 0.04%</span> in its own base.'],
          },
        ],
      },
      {
        heading: 'Evening',
        steps: [
          {
            title: 'Cream',
            meta: '<b>MULTI FUNCTIONAL ANTI-WRINKLE CREAM</b> · 50 g · AED 290',
            body: [
              'The same two actives as the serum — <span class="dose">niacinamide 2.00%</span>, <span class="dose">adenosine 0.040%</span>, <span class="dose">bakuchiol 0.100%</span> — in the opposite base: around <span class="dose">13%</span> emollients and structure against the serum\u2019s water-and-glycerin.',
              'That is the real reason to own both rather than either: same actives, different vehicles, one of which sits above water and one below it.',
              'Note it is fragranced — lavender oil <span class="dose">0.0413%</span> with linalool and limonene declared.',
            ],
          },
          {
            title: 'Or, for drier or more mature skin',
            meta: '<b>ND Cell ANTI-WRINKLE CREAM</b> · 50 g · AED 370',
            body: [
              'Richer: <span class="dose">squalane 5.000%</span>, silicones at <span class="dose">4%</span>, <span class="dose">vitamin E 1.000%</span>, <span class="dose">panthenol 0.300%</span> and <span class="dose">allantoin 0.200%</span>, with the same <span class="dose">adenosine 0.040%</span>. Five peptides total about <span class="dose">51.5 ppm</span> — more than the serum, still trace.',
              '<b>It contains peanut oil</b> at <span class="dose">0.0087%</span>. Small, but if there is a peanut allergy in the house it is the first thing to know. It is fragranced too.',
            ],
          },
          {
            title: 'Weekly',
            meta: '<b>SKIN RESCUE OVERNIGHT CREAM MASK</b> · AED 340',
            body: ['A leave-on mask with <span class="dose">niacinamide 2%</span> and <span class="dose">adenosine 0.04%</span> again. Apply as the last step and sleep in it.'],
          },
        ],
      },
    ],
    doseIntro: 'The measured concentrations, including for the ingredients that get named far more often than they are dosed.',
    doses: [
      { ingredient: 'Adenosine', where: 'Anti-Wrinkle Serum, Cream, ND Cell, Ultra Shield, EyeCell cream — all <span class="dose">0.04%</span>', note: 'The registered anti-wrinkle active. It is not a muscle relaxant' },
      { ingredient: 'Niacinamide', where: 'Anti-Wrinkle Serum and Cream <span class="dose">2.00%</span>', note: 'A second functional active in the same products' },
      { ingredient: 'Glycerin', where: 'Anti-Wrinkle Serum <span class="dose">25.45%</span> · Cream <span class="dose">8.00%</span>', note: 'The largest single figure in the serum, by a distance' },
      { ingredient: 'Bakuchiol', where: 'Serum and Cream <span class="dose">0.100%</span>', note: 'Present at a level worth naming' },
      { ingredient: 'Peptides', where: 'Anti-Wrinkle Serum <span class="dose">~1.4 ppm</span> for six · ND Cell <span class="dose">~51.5 ppm</span> for five', note: 'Stated as totals, because a customer cannot add them up from a label' },
      { ingredient: 'Ceramide NP', where: 'Barrier Cream <span class="dose">0.5%</span> · ND Cell <span class="dose">0.020%</span>', note: 'Not in the Anti-Wrinkle creams' },
      { ingredient: 'Peanut oil', where: 'ND Cell <span class="dose">0.0087%</span> · EyeCell Eye Contour Cream', note: 'An allergen disclosure, not a benefit' },
    ],
    correction:
      'An earlier version of this protocol listed <b>"Stem Cell Technology"</b> in the ND Cell cream. <b>There is no stem cell ingredient in it</b> — the name is a brand name. It also said adenosine <b>"relaxes facial muscles"</b>, which is the mechanism of an injectable and not of adenosine, credited peptides with <b>"stimulating collagen production"</b> at 1.4 ppm, and listed <b>hyaluronic acid</b> in Snow Booster, which does not contain it.',
    sets: [
      {
        heading: 'Essentials',
        rows: [
          { label: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM · 30 ml', price: '330' },
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+', price: '250' },
          { label: 'Total', price: 'AED 580', total: true },
        ],
      },
      {
        heading: 'The pair, plus daily care',
        rows: [
          { label: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM · 30 ml', price: '330' },
          { label: 'MULTI FUNCTIONAL ANTI-WRINKLE CREAM · 50 g', price: '290' },
          { label: 'SNOW BOOSTER', price: '260' },
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+', price: '250' },
          { label: 'Total', price: 'AED 1,130', total: true },
        ],
      },
    ],
    closing:
      'What to expect, honestly: better hydration and surface smoothness within weeks, and a slower rate of change over years — most of which comes from the sunscreen rather than the serum. Established folds and volume loss are not a cream\u2019s job. ' + SHIPPING,
  },

  // ───────────────────────────── HYDRATION ────────────────────────────
  {
    slug: 'hydration',
    out: 'public/documents/PPT/Protocol_Hydration_Treatment.pdf',
    title: 'Dehydrated Skin — Home Protocol',
    standfirst: 'Hyaluronan 11, ceramide NP at 0.5%, and why air conditioning is the real opponent.',
    scope: [
      '<b>Who this is for:</b> skin that feels tight, looks dull, drinks moisturiser, or has turned reactive under constant air conditioning.',
      '<b>What these products are:</b> humectant and barrier cosmetics. Dehydration is a water problem and a barrier problem, and this range addresses both — one product fills, another seals.',
      '<b>Worth knowing:</b> dehydrated is not the same as dry. Dry skin lacks oil; dehydrated skin lacks water, and oily skin is very often dehydrated too.',
    ],
    sections: [
      {
        heading: 'Fill, then seal',
        intro:
          'This is the whole logic of the routine, and it is why two products that look similar are not interchangeable.',
        steps: [
          {
            title: 'Fill — the serum',
            meta: '<b>MOISTURE REPLENISHING HYALURON SERUM</b> · 30 ml · AED 330',
            body: [
              '<span class="dose">Hydrolyzed hyaluronic acid at 2,000 ppm</span>, cut small enough to sit within the surface rather than on top of it, plus <span class="dose">PENTAVITIN 0.615%</span> and coconut water.',
              'Apply and pat, morning and evening, onto skin that is still slightly damp.',
            ],
          },
          {
            title: 'Seal — the cream',
            meta: '<b>MOISTURE REPLENISHING HYALURON CREAM</b> · 50 g · AED 290',
            body: [
              'The carton prints the dose of every hyaluronate in it: <span class="dose">1,000.9 ppm</span> for the first and <span class="dose">30 ppb</span> for the other seven. That first figure is the high-molecular-weight grade — the one that sits on the surface and holds water in.',
              'So the serum fills and the cream seals. Hyaluronan 11 is the manufacturer\u2019s real name for the complex; the deck maps its eleven molecular-weight grades onto eight INCI names, which is why the counts differ.',
            ],
          },
        ],
      },
      {
        heading: 'When the barrier is the problem',
        steps: [
          {
            title: 'The richest option',
            meta: '<b>SKIN BARRIER PROTECTING CREAM</b> · 50 g · AED 450',
            body: ['<span class="dose">Ceramide NP 0.5%</span> — 5,000 ppm on the Korean panel — with <span class="dose">glycerin 17.49%</span> and <span class="dose">shea butter 3%</span>. If your skin is flaking or stinging with products it used to tolerate, start here.'],
          },
          {
            title: 'The cooling option',
            meta: '<b>INTENSIVE HYDRO SOOTHING CREAM</b> · 50 g · AED 290',
            body: [
              'Built on <span class="dose">betaine at 5.000%</span> with <span class="dose">10.5%</span> butylene glycol and <span class="dose">6.175%</span> glycerin — <span class="dose">21.7%</span> humectants in total, and no heavy occlusives. A gel-cream for heat rather than a barrier repair cream.',
              'Its manufacturer study records +12% hydration at four weeks and a 1 °C drop in skin temperature at twenty minutes.',
            ],
          },
          {
            title: 'Through the day',
            meta: '<b>MICROBIOME ENERGY INFUSING MIST</b> · AED 160',
            body: ['<span class="dose">Shea butter at 1.2%</span> in a sprayable emulsion, which is what makes it a mist that leaves something behind rather than water that evaporates. Shake it, 10–20 cm, over makeup if you like.'],
          },
        ],
      },
    ],
    doseIntro: 'What is actually doing the hydrating, at measured concentrations.',
    doses: [
      { ingredient: 'Hydrolyzed hyaluronic acid', where: 'Hyaluron Serum <span class="dose">2,000 ppm</span>', note: 'The fill step' },
      { ingredient: 'Sodium hyaluronate', where: 'Hyaluron Cream <span class="dose">1,000.9 ppm</span>, plus seven grades at 30 ppb', note: 'The seal step. Doses printed on the carton' },
      { ingredient: 'Ceramide NP', where: 'Barrier Cream <span class="dose">0.5%</span>', note: 'The barrier active. Not in the Hydro Soothing Cream' },
      { ingredient: 'Glycerin', where: 'Barrier Cream <span class="dose">17.49%</span> · Hyaluron Cream <span class="dose">9%</span> · Hydro Soothing <span class="dose">6.175%</span>', note: 'The unglamorous ingredient doing most of the work everywhere' },
      { ingredient: 'Betaine', where: 'Hydro Soothing Cream <span class="dose">5.000%</span> · Snow Booster <span class="dose">3%</span>', note: 'The humectant these two are actually built on' },
      { ingredient: 'PENTAVITIN', where: 'Hyaluron Serum and Cream <span class="dose">0.615%</span>', note: 'A saccharide complex, at a real dose' },
      { ingredient: 'Shea butter', where: 'Microbiome Mist <span class="dose">1.2%</span> · Barrier Cream <span class="dose">3%</span>', note: 'What makes a mist worth spraying' },
      { ingredient: 'Panthenol, allantoin', where: '<b>Neither is in the Barrier Cream.</b> Panthenol is in the Problem Control serum <span class="dose">0.2%</span> and the Multi Vita serum <span class="dose">1%</span>', note: 'Both were attributed to the wrong products here before' },
    ],
    correction:
      'An earlier version of this protocol listed <b>panthenol</b> and <b>allantoin</b> in the Skin Barrier Protecting Cream and <b>panthenol</b> in the Intensive Hydro Soothing Cream. <b>None of those is in the product named.</b> It also described a <b>"triple-weight hyaluronic acid"</b>, which is not the manufacturer\u2019s complex — Hyaluronan 11 is eleven molecular-weight grades mapped onto eight INCI names, and the cream\u2019s carton prints the dose of each.',
    sets: [
      {
        heading: 'The pair',
        rows: [
          { label: 'MOISTURE REPLENISHING HYALURON SERUM · 30 ml', price: '330' },
          { label: 'MOISTURE REPLENISHING HYALURON CREAM · 50 g', price: '290' },
          { label: 'Total', price: 'AED 620', total: true },
        ],
      },
      {
        heading: 'With barrier repair',
        rows: [
          { label: 'The pair above', price: '620' },
          { label: 'SKIN BARRIER PROTECTING CREAM · 50 g', price: '450' },
          { label: 'MICROBIOME ENERGY INFUSING MIST', price: '160' },
          { label: 'Total', price: 'AED 1,230', total: true },
        ],
      },
    ],
    closing:
      'What to expect, honestly: skin that feels comfortable rather than tight, and a surface that reflects light better within a couple of weeks. Dehydration returns the moment the routine stops, because the air conditioning does not. Fit a humidifier if you can — it will do more than another cream. ' + SHIPPING,
  },

  // ──────────────────────────── SENSITIVITY ───────────────────────────
  {
    slug: 'sensitive',
    out: 'public/documents/PPT/Protocol_Sensitive.pdf',
    title: 'Sensitive & Reactive Skin — Home Protocol',
    standfirst: 'A short routine, the fragrance disclosures, and the one product built for this.',
    scope: [
      '<b>Who this is for:</b> skin that stings, flushes or reacts to products it used to tolerate.',
      '<b>What these products are:</b> soothing and barrier cosmetics. The shortest routine that works is the right one — every additional product is another chance to react.',
      '<b>What they are not:</b> a treatment for rosacea, eczema or contact dermatitis. Persistent redness with papules, or itching and scaling, is a diagnosis worth having.',
    ],
    sections: [
      {
        heading: 'Read the fragrance list first',
        intro:
          'This is the single most useful thing on this page for reactive skin. Several GENOSYS products are fragranced, and fragrance is one of the most common causes of a reaction. Fragranced, with declared allergens: the <b>Anti-Wrinkle serum and cream</b>, <b>ND Cell</b>, <b>Soothing Repair Postcream</b>, <b>Skin Barrier Protecting Cream</b> (mild, 0.0107%), <b>Snow O₂ Cleanser</b>, <b>Epi peeling gel</b>, <b>Multi Sun</b> and the <b>Microbiome Mist</b>. If you are avoiding fragrance entirely, <b>ULTRA SHIELD SPF 50+</b> and the <b>Intensive Blemish Balm</b> are the fragrance-free sun options.',
      },
      {
        heading: 'The routine',
        steps: [
          {
            title: '1. Wash gently, or not at all in the morning',
            meta: '<b>SNOW O₂ CLEANSER</b> · AED 330',
            body: ['It foams rather than needing rubbing. If mornings sting, water alone is a legitimate choice — the argument for cleansing twice a day is weaker than the industry suggests.'],
          },
          {
            title: '2. The serum built for this',
            meta: '<b>ALL FOR SENSITIVE SERUM</b> · 30 ml · AED 330',
            body: [
              'The one product in the range designed around reactive skin, and its lead ingredient is present at a real dose: <span class="dose">MultiEx BSASM Plus at 1%</span>, a botanical anti-irritant complex. With <span class="dose">betaine 0.5%</span>, <span class="dose">allantoin 0.1%</span> and <span class="dose">centella asiatica 0.05%</span>.',
              'For scale, the same MultiEx complex is in the Skin Barrier Protecting Cream at <span class="dose">0.0001%</span> — ten thousand times less. This is the product to buy it in.',
            ],
          },
          {
            title: '3. Seal',
            meta: '<b>SKIN BARRIER PROTECTING CREAM</b> · 50 g · AED 450',
            body: ['<span class="dose">Ceramide NP 0.5%</span>, <span class="dose">glycerin 17.49%</span>, <span class="dose">shea 3%</span>. Mildly fragranced at 0.0107%, which is worth knowing on this page of all pages.'],
          },
          {
            title: '4. Sunscreen, fragrance-free',
            meta: '<b>ULTRA SHIELD SPF 50+ PA++++</b> · AED 250',
            body: ['Fragrance-free, and the higher of the two ratings. UV is a trigger for most reactive skin.'],
          },
          {
            title: 'When skin is flaring',
            meta: '<b>SOOTHING BOMB SEA ALGAE MASK</b> · AED 36 each',
            body: ['A sheet mask carrying <span class="dose">15%</span> humectants with <span class="dose">allantoin 0.1%</span> and <span class="dose">panthenol 0.1%</span>. Cheap enough to use whenever skin is unhappy. The sea algae it is named for is at 10 ppm.'],
          },
        ],
      },
      {
        heading: 'How to introduce anything new',
        numbered: [
          'One product at a time, with at least a week between introductions.',
          'Patch test on the inner forearm or behind the ear for three days first.',
          'Apply to comfortable skin, never to skin that is already flaring.',
          'If it stings for more than a minute, wash it off and do not persist.',
        ],
      },
    ],
    doseIntro: 'Measured concentrations, and where the calming ingredients genuinely are.',
    doses: [
      { ingredient: 'MultiEx BSASM Plus', where: 'All For Sensitive Serum <span class="dose">1%</span> · Barrier Cream <span class="dose">0.0001%</span>', note: 'A ten-thousandfold difference between two products that both name it' },
      { ingredient: 'Centella asiatica', where: 'All For Sensitive Serum <span class="dose">0.05%</span> · Postcream <span class="dose">0.020%</span> triterpenes', note: 'Not in Snow Booster, which was where we listed it before' },
      { ingredient: 'Allantoin', where: 'All For Sensitive Serum <span class="dose">0.1%</span> · Postcream <span class="dose">0.200%</span>', note: 'At real, useful concentrations in both' },
      { ingredient: 'Betaine', where: 'All For Sensitive Serum <span class="dose">0.5%</span> · Snow Booster <span class="dose">3%</span> · Hydro Soothing <span class="dose">5%</span>', note: 'The humectant Snow Booster is actually built on' },
      { ingredient: 'Ceramide NP', where: 'Barrier Cream <span class="dose">0.5%</span>', note: 'Not in the Postcream' },
      { ingredient: 'Dipotassium glycyrrhizate', where: 'Postcream <span class="dose">0.200%</span>', note: 'The licorice derivative that does most of the calming there' },
      { ingredient: 'Madecassoside', where: 'EGF Repair Oxymask Cream <span class="dose">1 ppm</span> — and nowhere else', note: 'Named here before, in a product that does not contain it' },
      { ingredient: 'Sodium hyaluronate', where: 'All For Sensitive Serum <span class="dose">0.01%</span>', note: 'Neither the cleanser nor Snow Booster contains hyaluronic acid' },
    ],
    correction:
      'An earlier version of this protocol listed <b>centella</b>, <b>panthenol</b> and <b>hyaluronic acid</b> in Snow Booster, <b>panthenol</b> and <b>madecassoside</b> in the All For Sensitive Serum, <b>ceramides</b> in the Soothing Repair Postcream, and <b>hyaluronic acid</b> in the Snow O₂ Cleanser. <b>None of those is in the product named</b> — every one was checked against the full ingredient list. It also failed to mention that several of the products it recommended are fragranced, which on a page for reactive skin is the omission that matters most.',
    sets: [
      {
        heading: 'The short routine',
        rows: [
          { label: 'ALL FOR SENSITIVE SERUM · 30 ml', price: '330' },
          { label: 'SKIN BARRIER PROTECTING CREAM · 50 g', price: '450' },
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+', price: '250' },
          { label: 'Total', price: 'AED 1,030', total: true },
        ],
      },
      {
        heading: 'With flare-day support',
        rows: [
          { label: 'The three above', price: '1,030' },
          { label: 'SOOTHING BOMB SEA ALGAE MASK × 5', price: '180' },
          { label: 'Total', price: 'AED 1,210', total: true },
        ],
      },
    ],
    closing:
      'What to expect, honestly: fewer reactions, largely because the routine is short and you know what is in it. If redness is persistent and comes with visible vessels or papules, or if there is itching and scaling, see a dermatologist — rosacea and eczema both respond to treatment that a cosmetic cannot provide. ' + SHIPPING,
  },

  // ─────────────────────────── SUN PROTECTION ─────────────────────────
  {
    slug: 'sun',
    out: 'public/documents/PPT/Protocol_sun.pdf',
    title: 'Sun Protection — Home Protocol',
    standfirst: 'Three sun products, their measured SPF and UVA figures, and the filter differences that decide which one you want.',
    scope: [
      '<b>Who this is for:</b> everyone, in a country where the UV index sits above 11 for much of the year.',
      '<b>What these products are:</b> registered sunscreens with measured SPF and PA ratings. The numbers below are from the manufacturer\u2019s test reports, not from the marketing.',
      '<b>Worth knowing:</b> the highest number is not automatically the right choice. Filter load, fragrance and finish differ, and one of the three contains an ingredient some people specifically avoid.',
    ],
    sections: [
      {
        heading: 'The three options, and the counter-intuitive part',
        intro:
          'The product with <b>more</b> total filter rates <b>lower</b>. That is not an error — it is a different filter system, and it is the clearest illustration of why filter choice matters more than filter quantity.',
        steps: [
          {
            title: 'ULTRA SHIELD SUN CREAM · SPF 50+ PA++++ · AED 250',
            meta: '<b>Six UV filters, 17.10% total</b> · fragrance-free',
            body: [
              'The highest rating in the range and the default recommendation. Six filters at a combined <span class="dose">17.10%</span>, plus <span class="dose">butyloctyl salicylate 5.00%</span> which spreads them evenly.',
              'It also carries <span class="dose">niacinamide 2.00%</span> and <span class="dose">adenosine 0.04%</span> in its base — the same two functional actives as the anti-wrinkle range.',
              '<b>Fragrance-free</b>, which makes it the right choice for reactive skin.',
            ],
          },
          {
            title: 'MULTI SUN CREAM · SPF 40 PA++ · AED 210',
            meta: '<b>Four UV filters, 18.50% total</b> · fragranced',
            body: [
              'More filter by weight than Ultra Shield, and a lower rating — because <span class="dose">octinoxate at 7.50%</span> makes up most of it, and octinoxate is a weaker UVA filter. Hence PA++ rather than PA++++.',
              'If you avoid octinoxate, for reef or personal reasons, this is the one to skip.',
              'Fragranced at <span class="dose">0.25%</span> with five declared allergens.',
            ],
          },
          {
            title: 'INTENSIVE BLEMISH BALM CREAM · SPF 30 PA++ · AED 250',
            meta: '<b>Three UV filters, 19.70% total</b> · tinted',
            body: [
              'The highest filter load of the three and the lowest rating, from only three filters. It is a tinted balm first and a sunscreen second.',
              'It carries <span class="dose">arbutin at 2.00%</span> and <span class="dose">adenosine 0.04%</span>, so it holds both a whitening and an anti-wrinkle registration alongside the SPF.',
              'Because it is arbutin-based it carries the mandatory Korean precaution for that ingredient — check the carton.',
            ],
          },
        ],
      },
      {
        heading: 'Using it properly',
        numbered: [
          '<b>Enough is more than you think.</b> Roughly two fingers\u2019 length for face and neck. Under-application is the reason most people get less protection than the label promises.',
          '<b>Reapply every two hours outdoors</b>, and after swimming or heavy sweating. No sunscreen lasts a UAE afternoon.',
          '<b>Do not forget the edges.</b> Ears, hairline, the part in your hair, the back of the neck, the tops of the feet.',
          '<b>Layering does not add up.</b> SPF 30 over SPF 50 gives you roughly SPF 50 in the places you covered well, not 80.',
          '<b>Shade and clothing outrank product.</b> Between 10 am and 4 pm, a hat does more than a reapplication.',
        ],
      },
      {
        heading: 'After sun',
        steps: [
          {
            title: 'If skin is hot and tight',
            meta: '<b>INTENSIVE HYDRO SOOTHING CREAM</b> AED 290 · <b>SOOTHING BOMB SEA ALGAE MASK</b> AED 36',
            body: ['The Hydro Soothing Cream is <span class="dose">21.7%</span> humectants with no heavy occlusives, and its manufacturer study records a 1 °C drop in skin temperature at twenty minutes. The sheet mask is the cheap version of the same idea.'],
          },
          {
            title: 'If skin is actually burned',
            body: ['A burn is an injury. Cool it, keep it covered, and if it blisters or covers a large area, see a doctor. No cosmetic is the right answer to a blistering burn.'],
          },
        ],
      },
    ],
    doseIntro: 'Filter systems and functional actives, from the manufacturer\u2019s formulas and test reports.',
    doses: [
      { ingredient: 'Ultra Shield filters', where: 'Six filters, <span class="dose">17.10%</span> · SPF 50+ PA++++', note: 'The best UVA rating of the three, on the least filter' },
      { ingredient: 'Multi Sun filters', where: 'Four filters, <span class="dose">18.50%</span> · SPF 40 PA++', note: 'More filter, lower rating' },
      { ingredient: 'Octinoxate', where: 'Multi Sun <span class="dose">7.50%</span> · none in Ultra Shield', note: 'The reason for the PA++ rating, and the reason some people avoid it' },
      { ingredient: 'Blemish Balm filters', where: 'Three filters, <span class="dose">19.70%</span> · SPF 30 PA++', note: 'Highest load, lowest rating. A tinted balm first' },
      { ingredient: 'Niacinamide', where: 'Ultra Shield <span class="dose">2.00%</span>', note: 'A functional active inside a sunscreen' },
      { ingredient: 'Adenosine', where: 'Ultra Shield and Blemish Balm <span class="dose">0.04%</span>', note: 'The registered anti-wrinkle active' },
      { ingredient: 'Arbutin', where: 'Blemish Balm <span class="dose">2.00%</span>', note: 'Carries the mandatory Korean arbutin precaution' },
      { ingredient: 'Fragrance', where: 'Multi Sun <span class="dose">0.25%</span>, five declared allergens · Ultra Shield none', note: 'Ultra Shield is the fragrance-free option' },
    ],
    sets: [
      {
        heading: 'Daily protection',
        rows: [
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+ PA++++', price: '250' },
          { label: 'Total', price: 'AED 250', total: true },
        ],
      },
      {
        heading: 'Protection and repair',
        rows: [
          { label: 'ULTRA SHIELD SUN CREAM SPF 50+ PA++++', price: '250' },
          { label: 'INTENSIVE HYDRO SOOTHING CREAM · 50 g', price: '290' },
          { label: 'MULTI VITA RADIANCE SERUM · 30 ml', price: '330' },
          { label: 'Total', price: 'AED 870', total: true },
        ],
      },
    ],
    closing:
      'What to expect, honestly: sunscreen is the single highest-value thing in any routine in this climate, and it is the one step where the evidence is not in dispute. Applied properly and often enough, it does more for tone, marks and long-term ageing than everything else on our shelves combined. ' + SHIPPING,
  },
]
