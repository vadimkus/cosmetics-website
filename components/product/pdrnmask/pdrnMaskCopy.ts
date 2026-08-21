/**
 * Bespoke copy for the SKIN REBOOT PDRN MASK PACK page (product 52).
 *
 * Same self-contained per-locale pattern as collagenMaskCopy.ts and
 * cerabarrierCopy.ts, so the dedicated layout ships EN/AR/RU without adding
 * ~120 keys to the shared messages bundles.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Everything is in one folder, and unusually for this range it is complete:
 *
 *   ~/Desktop/Drive/Genosys/Registration/Intertek/SKIN REBOOT PDRN MASK PACK /
 *     Formula-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf   full quali-quanti, all
 *                                                      33 lines, signed by
 *                                                      Narae Han, R&D manager
 *     Artwork-GENOSYS SKIN REBOOT PDRN MASK PACK.pdf   pack text, 7 languages
 *     COA-...(256EE).pdf                               lot 256EE, pH 6.37
 *     CFS-...pdf                                       KCA cert 2025-12072
 *     GENOSYS SKIN REBOOT PDRN MASK PACK .pptx         13-slide DTS MG deck
 *
 * Because the formula is fully quantified, every percentage on this page is a
 * measured figure rather than an inference from INCI position. Use it. The
 * numbers this page is built on:
 *
 *   Glycerin                    5.094%
 *   Dipropylene Glycol          3.000%
 *   Propanediol                 3.000%
 *   Butylene Glycol             2.000%
 *   Niacinamide                 2.000%   <- licensed brightening active
 *   1,2-Hexanediol              1.504%
 *   Glycereth-26                1.000%
 *   Panthenol                   1.000%
 *   Xylitol                     1.000%
 *   Sodium DNA                  0.100%   = 1000 ppm, printed on the carton
 *   Allantoin                   0.100%
 *   Polyglyceryl-10 Laurate     0.100%
 *   Arginine                    0.060%
 *   Carbomer                    0.060%
 *   Adenosine                   0.040%   <- licensed wrinkle active
 *
 * THE KOREAN LICENCE - this is the lead, and it took reading the Korean panel
 * of the artwork to find it.
 *
 * The pack is registered as a "미백·주름개선 2중 기능성 화장품": a DUAL-function
 * cosmetic, licensed for BOTH brightening AND wrinkle improvement. The Korean
 * panel prints the granted claims - "피부의 미백에 도움을 준다. 피부의 주름개선에
 * 도움을 준다." - and then names the two actives the licence rests on:
 * "효능성분 나이아신아마이드, 아데노신", niacinamide and adenosine.
 *
 * Both are in the formula at the notified functional doses for those exact
 * claims: niacinamide 2.00% and adenosine 0.04%. Not near them. At them.
 *
 * None of this appeared anywhere on the site. Neither ingredient was even
 * mentioned. It is the strongest verifiable thing this product has, because a
 * regulator granted it against the formula rather than a marketing team writing
 * it, so it leads the page.
 *
 * THE CLINICAL STUDY - real, and specific.
 *
 * P&K Skin Research Center, 2 May 2025, 20 women aged 20-60. Skin was
 * deliberately irritated, then treated, and trans-epidermal water loss measured
 * at three points against an untreated control on the same panel:
 *
 *                            untreated   treated
 *   Before                       7.065     6.965
 *   After physical stimuli      13.090    13.445
 *   After using the product     10.205     8.735
 *
 * The manufacturer's headline is 34.969% and is intended as the treated side's
 * fall from its own irritated peak. It is not a relative comparison with the
 * untreated control. The displayed rounded means produce 35.032%, not 34.969%,
 * so retail copy says "about 35%" and preserves the raw readings. The small
 * discrepancy may come from unrounded source data, but the deck does not show
 * that calculation. The untreated side also fell, ending at 10.205 versus
 * 8.735 on the treated side.
 *
 * The deck's satisfaction survey is deliberately unused. All seven measures
 * come back at exactly 100% on n=20, including "Fragrance". A row of perfect
 * scores reads as a formality, not evidence, and putting it next to real TEWL
 * data would cheapen the real data.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Brightening, wrinkle improvement       Korean panel, functional licence
 *   About 35% lower TEWL after irritation  deck slides 5-6, P&K May 2025
 *   Salmon DNA 1000 ppm                    carton, "Sodium DNA (1000ppm)"
 *   Ultra-thin lyocell, even impregnation  deck slide 3, uniformity test
 *   350 g / 30 sheets, built-in tweezers   carton, "NET WT. 350g (30ea)"
 *   10 to 20 minutes                       carton directions in all 7 languages
 *   Dermatologically tested                carton front panel
 *   pH 6.37                                COA lot 256EE, spec 6.00 +/- 1.00
 *   Made in Korea, DTS MG                  carton and CFS 2025-12072
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - PEPTIDES. There is no peptide in this formula. The site used to carry a
 *     "Peptide Complex - stimulates collagen production" ingredient card for an
 *     ingredient that does not exist in the product. Removed 14 Aug 2026 in all
 *     three languages. Do not let it back.
 *   - CERAMIDES AS A SELLING POINT. Ceramide NP is 0.000004%, which is 0.04 ppm,
 *     and phytosphingosine is 0.015 ppm. The carton's "Enriched with Panthenol &
 *     Ceramide" and the deck's "naturally derived ceramides" both overstate what
 *     is in the tub. Panthenol at 1% is real and is sold hard; the ceramides are
 *     named in the INCI and nowhere else. Logged as a pack correction.
 *   - COLLAGEN AND ELASTIN AS ACTIVES. Hydrolyzed collagen is 9.7 ppm and
 *     hydrolyzed elastin is 0.01 ppm. The carton's "Anti-Aging: enriched with
 *     PDRN, Collagen, Elastin" leans on two traces. The anti-ageing claim on
 *     this page rests on adenosine, which is licensed, not on those two.
 *   - "GREEN LEAF COMPLEX". The deck's name for the mint, green tea and thyme
 *     extracts. Together they come to 0.0000150%. A branded name on a combined
 *     0.15 ppm is not something to print.
 *   - CELL REGENERATION, CELL TURNOVER, COLLAGEN SYNTHESIS, WOUND HEALING,
 *     ANTI-INFLAMMATORY. All are in the deck's PDRN mechanism slide and all are
 *     drug-register for a cosmetic sold in the UAE.
 *   - THE 44.8% FIGURE. Our own gallery slide S2 printed "up to 44.8% TEWL
 *     improvement". That number is a single subject's barrier-image reading, not
 *     the TEWL result, which was 34.969%. The slide was pulled for a different
 *     reason (see below) but the misattribution is logged separately.
 *
 * IMAGE NOTE - READ BEFORE ADDING ANY PICTURE TO THIS PRODUCT.
 *
 * Four of the seven images on file for the PDRN mask are AI renders with
 * mangled pack text, and two of them render "PDRN" as "PORN":
 *
 *   pdrn_mask/s1.jpeg      inset tub reads "SKIN REDOOT PORN IWASK PACK"
 *   pdrn_mask/s2.jpeg      anti-ageing icon reads "PORN / Collagen / Elastin",
 *                          and it misattributes the study: 44.8% is a single
 *                          subject's barrier reading, the TEWL result is 34.969%
 *   pdrn_mask/main.jpeg    "DERMATOLOGIGAELY TESTED" on the body,
 *                          "DERMATOLODICALLY TESTED" on the lid, "Ultrs-Slim",
 *                          "Planthenol"
 *   Second/pdrn_big2.jpg   "Ultra-Slim Fit Skteet", "optimal absorptic",
 *                          "SKIN REBOCT PDRN MASK PACK", and a melted rim
 *
 * The last one survived the first pass on 14 Aug because it reads as a
 * photograph at thumbnail size. It is only legible as a render when opened at
 * 2000px. Check every candidate at full resolution, not at gallery size.
 *
 * The three that pass, all verified at full resolution:
 *
 *   Second/pdrnnn.jpg   main. Single tub straight on, 2000px, every line right
 *   PDRN.png            two tubs at an angle, 998px, every line right
 *   Second/pdrn22.jpg   the sheet in the hands, no pack text on it at all
 *
 * All three are on pure white, which is what lets the multiply rule in
 * pdrnmask.css drop the white surround into the page tint.
 */

export type PdrnMaskLocale = 'en' | 'ar' | 'ru'

/** The three TEWL measurement points, shared across locales because they are
 *  data. Only the labels are translated. Values are the raw readings from deck
 *  slide 5; `control` is the untreated side of the same panel. */
export const TEWL_READINGS = [
  { control: 7.065, treated: 6.965 },
  { control: 13.09, treated: 13.445 },
  { control: 10.205, treated: 8.735 },
] as const

export interface PdrnMaskCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  /** The DB `size` field reads badly outside English, so the pack is stated
   *  from here instead. */
  packSize: string
  usageNote: string
  addToBag: string
  adding: string
  added: string
  inBag: string
  viewBag: string
  loginToShop: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string
  stats: Array<{ value: string; label: string }>
  /** The Korean dual-function licence. Leads the body of the page. */
  licence: {
    eyebrow: string
    title: string
    body: string
    points: Array<{ title: string; body: string }>
    figureAlt: string
  }
  /** The P&K barrier study. */
  proof: {
    eyebrow: string
    title: string
    intro: string
    chartTitle: string
    /** Labels for the three measurement points, in order. */
    stages: string[]
    controlLabel: string
    treatedLabel: string
    headline: { value: string; label: string }
    versusControl: { value: string; label: string }
    attribution: string
    note: string
  }
  /** The lyocell sheet. */
  sheet: {
    eyebrow: string
    title: string
    body: string
    points: Array<{ title: string; body: string }>
    figureAlt: string
  }
  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }
  /** Held in the copy module rather than read from the product record, because
   *  the bespoke layouts get the untranslated row and the DB carries only the
   *  English cards. Keeping them here is what makes the Arabic and Russian
   *  pages read in Arabic and Russian. */
  actives: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ name: string; body: string }>
    inciTitle: string
    inciNote: string
  }
  suited: {
    eyebrow: string
    title: string
    forTitle: string
    forList: string[]
    notTitle: string
    notList: string[]
    note: string
  }
  routine: {
    eyebrow: string
    title: string
    intro: string
    thisProduct: string
    viewProduct: string
    chooseOptions: string
    fromPrice: string
  }
  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string }>
  }
  details: {
    eyebrow: string
    title: string
    rows: Array<{ label: string; value: string }>
  }
  closing: {
    title: string
    body: string
  }
  backToProducts: string
}

/** Shared across locales: the INCI list is a regulatory string and is not
 *  translated, exactly as it is printed on the carton. */
export const FULL_INCI =
  'Aqua (Water), Glycerin, Dipropylene Glycol, Propanediol, Butylene Glycol, Niacinamide, ' +
  '1,2-Hexanediol, Glycereth-26, Panthenol, Xylitol, Sodium DNA (1000ppm), Ceramide NP, ' +
  'Phytosphingosine, Hydrolyzed Collagen, Hydrolyzed Elastin, Adenosine, Butyrospermum Parkii ' +
  '(Shea) Butter, Mentha Rotundifolia Leaf Extract, Camellia Sinensis Leaf Extract, Thymus ' +
  'Vulgaris (Thyme) Leaf Extract, Allantoin, Hydroxyethylcellulose, Arginine, Lavandula ' +
  'Angustifolia (Lavender) Oil, Ethylhexylglycerin, Pullulan, Xanthan Gum, Carbomer, Disodium ' +
  'EDTA, Methyl Diisopropyl Propionamide, PVM/MA Copolymer, Glyceryl Acrylate/Acrylic Acid ' +
  'Copolymer, Polyglyceryl-10 Laurate.'

const EN: PdrnMaskCopy = {
  eyebrow: 'Sheet mask · Tub of thirty',
  headline: 'A stressed barrier, back inside twenty minutes.',
  subheadline:
    'Korea licenses this mask for two things at once, brightening and wrinkle improvement, and names the actives it granted them on: niacinamide at a full 2% and adenosine at 0.04%. Salmon DNA rides along at 1,000 ppm, printed as a figure on the carton. Thirty sheets to a tub, lifted out one at a time, so the mask is there on the evening your skin actually needs it.',
  heroBullets: [
    'Water loss through the barrier fell about 35% in a clinical study on irritated skin',
    'Licensed in Korea for brightening and wrinkle improvement at the same time',
    'Salmon DNA at 1,000 ppm, declared as a number on the pack',
    'Thirty sheets, around three months of twice-weekly use',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '350 g / 30 sheets', 'Ultra-thin lyocell'],
  packSize: '30 sheets · 350 g',
  usageNote: 'Two to three times a week',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added',
  inBag: 'In your bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery across the UAE',
  stats: [
    { value: '30', label: 'Sheets to a tub, lifted out with the built-in tweezers' },
    { value: '1,000 ppm', label: 'Salmon DNA, printed as a figure on the carton' },
    { value: '2% + 0.04%', label: 'Niacinamide and adenosine, the two licensed actives' },
    { value: '35%', label: 'Less water loss through the barrier after use' },
  ],
  licence: {
    eyebrow: 'The licence',
    title: 'Korea signed off on two claims, and named the actives.',
    body:
      'Most masks describe themselves. This one is registered in Korea as a dual-function cosmetic, which means a regulator read the formula and granted two specific claims against it: helps brighten the skin, and helps improve wrinkles. The registration then prints the two ingredients that licence rests on. Both are in the tub at the concentrations those claims are granted at.',
    points: [
      {
        title: 'Niacinamide, 2%',
        body:
          'The brightening half of the licence, at a full dose. Niacinamide is the rare active that works on tone and on the barrier at the same time, which is why it turns up in almost everything worth buying, and why it belongs in a mask meant for skin that has just been through something.',
      },
      {
        title: 'Adenosine, 0.04%',
        body:
          'The wrinkle half, at precisely the concentration Korea grants that claim for. Not rounded up to it, not approaching it. At it. This is the ingredient the anti-ageing side of the page rests on.',
      },
      {
        title: 'Why that is worth more than a slogan',
        body:
          'Anyone can print "anti-ageing" on a carton. A functional registration is granted by a regulator against a submitted formula, and it can be checked. Ours is Korea Cosmetic Association certificate 2025-12072, issued for export to the UAE.',
      },
    ],
    figureAlt: 'SKIN REBOOT PDRN MASK PACK tub, showing the pack claims and the 350 g / 30 sheet count',
  },
  proof: {
    eyebrow: 'The study',
    title: 'They irritated the skin first, then measured.',
    intro:
      'Twenty women aged 20 to 60 at an independent Korean research centre. Rather than measure a mask on comfortable skin, the panel deliberately stressed the barrier first, then tracked trans-epidermal water loss against an untreated control on the same skin. Lower is better: it means less water escaping through a barrier that is holding together.',
    chartTitle: 'Trans-epidermal water loss',
    stages: ['Before', 'After irritation', 'After the mask'],
    controlLabel: 'Untreated',
    treatedLabel: 'With the mask',
    headline: { value: '34.969%', label: 'Fall in water loss from the irritated peak' },
    versusControl: { value: '14%', label: 'Below the untreated side at the same point' },
    attribution: 'P&K Skin Research Center, 2 May 2025. 20 women aged 20 to 60.',
    note:
      'Twenty minutes took the treated side from 13.445 back down to 8.735, most of the way to where it started the session. The untreated side, left to itself over the same twenty minutes, only reached 10.205.',
  },
  sheet: {
    eyebrow: 'The sheet',
    title: 'Thin enough to read through.',
    body:
      'The carrier matters more than people expect. A sheet that holds essence unevenly delivers unevenly, and a sheet that will not sit down around the nose and jaw simply stops working there. This one is lyocell, spun fine and laid down evenly, and against a standard sheet in the same impregnation test it takes up essence right across its face instead of pooling in patches.',
    points: [
      {
        title: 'Even all the way across',
        body: 'Uniform fibre means the cheek and the jaw get the same dose as the forehead, which is not true of every sheet mask you have used.',
      },
      {
        title: 'It actually stays put',
        body: 'Enough contact area to hold to the sides of the nose and under the jaw for the full twenty minutes, rather than peeling away as it dries.',
      },
      {
        title: 'Translucent and breathable',
        body: 'Close to invisible on the skin and light enough to forget you are wearing it. The essence is watery rather than tacky, so nothing runs.',
      },
    ],
    figureAlt: 'The ultra-thin lyocell sheet being smoothed between the hands, showing its translucency',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Twenty minutes, then pat, do not rinse.',
    frequency: 'Two to three times a week',
    steps: [
      { title: 'Cleanse', body: 'Wash and pat dry. Toner first if that is your habit, but skip anything acidic on the night you mask.' },
      { title: 'Lift one out', body: 'Use the tweezers built into the lid. Fingers in the tub shorten the life of the thirty sheets underneath.' },
      { title: 'Smooth it on', body: 'Line up the eyes first, then work outwards, pressing the air pockets out from the middle so the sheet sits flat around the nose and jaw.' },
      { title: 'Leave it 10 to 20 minutes', body: 'Do not go past twenty. Once a sheet starts to dry it takes moisture back out of the skin instead of giving it.' },
      { title: 'Pat, do not rinse', body: 'Take the sheet off and press the essence left on your face into the skin. Rinsing here throws away the part you paid for.' },
      { title: 'Seal the tub', body: 'Close the inner film and the lid firmly. Left open, the top sheets dry out and the rest of the tub follows.' },
    ],
    note:
      'Good on the night of a facial, a peel or a long flight, and good the night before anything you want to look well for. If you have just had a clinical procedure, follow whatever your practitioner told you first.',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The formula, with the figures.',
    intro:
      'Every percentage below is the real one, measured, not a guess at where an ingredient sits in the list.',
    cards: [
      {
        name: 'Sodium DNA (PDRN), 1,000 ppm',
        body: 'Salmon-derived DNA fragments, printed on the carton as a figure rather than left as an acronym. Salmon DNA is close enough to human DNA that skin treats it as familiar, which is why it became a fixture in post-procedure care.',
      },
      {
        name: 'Niacinamide, 2%',
        body: 'A full dose, and the active Korea grants the brightening claim on. Works on uneven tone and on barrier strength at once.',
      },
      {
        name: 'Adenosine, 0.04%',
        body: 'The active behind the wrinkle-improvement claim, at exactly the licensed concentration.',
      },
      {
        name: 'Panthenol, 1%',
        body: 'Provitamin B5. Holds water in the skin and takes the edge off the tightness and redness that follow a treatment or too much sun.',
      },
      {
        name: 'Allantoin, 0.1%',
        body: 'A quiet soother, sitting at the top of its usual range here rather than the bottom of it.',
      },
      {
        name: 'The essence itself',
        body: 'Glycerin at 5.1%, then dipropylene glycol and propanediol at 3% each, butylene glycol at 2% and xylitol at 1%. The tub holds 350 g across thirty sheets, so each one comes out heavy and the skin stays damp for the full twenty minutes.',
      },
    ],
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'Every ingredient, in the same order as the box in your hand. Every batch is tested for pH, and the latest came back at 6.37, near neutral, so it does not sting skin that has just been through something.',
  },
  suited: {
    eyebrow: 'Honestly',
    title: 'Who this is for.',
    forTitle: 'Buy it if',
    forList: [
      'Your barrier takes a beating - retinoids, acids, treatments, air conditioning, long flights',
      'You mask often enough that thirty sheets is an economy rather than a commitment',
      'You want brightening and wrinkle work in the same step, both of them licensed rather than asserted',
      'You are recovering from a facial or a peel and need something near-neutral that will not sting',
      'You share a household and go through masks faster than a single-sheet sachet allows',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You mask once a month - thirty sheets is six months open, and the tub is best finished inside six',
      'You are allergic to sticking plasters or compresses, which the pack itself flags as a caution',
      'You want a mask that treats acne or breakouts, which this is not built for',
      'You are looking for a peptide mask - there is not a single peptide in this formula',
      'You need a strong immediate cooling or tingling hit, because this one is deliberately quiet',
    ],
    note:
      'For external use only, and keep it away from the eye area. Stop and speak to a doctor if you get redness, swelling or irritation.',
  },
  routine: {
    eyebrow: 'The routine',
    title: 'Where the mask sits.',
    intro: 'Cleanse, mask, seal. The mask goes on bare skin and the cream goes on over whatever essence you patted in.',
    thisProduct: 'This one',
    viewProduct: 'View',
    chooseOptions: 'Choose size',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy.',
    items: [
      {
        q: 'What does PDRN actually do here?',
        a: 'It is a DNA fraction taken from salmon, at 1,000 ppm, and it works as a conditioning and hydrating agent on the surface of the skin. It became popular in Korean post-procedure care because salmon DNA is structurally close to our own. We are not going to tell you it regenerates cells or builds collagen, because those are drug claims and no cosmetic can make them honestly.',
      },
      {
        q: 'Is the clinical study on this product or on the ingredient?',
        a: 'On this product. Twenty women aged 20 to 60, at P&K Skin Research Center in Korea, in May 2025. The barrier was deliberately irritated and then measured, treated side against untreated side.',
      },
      {
        q: 'How long does a tub last?',
        a: 'Thirty sheets. At twice a week that is around three and a half months, at three times a week around ten weeks. The tub is marked six months after opening, so twice a week is the pace it is designed around.',
      },
      {
        q: 'Can I use it straight after a peel or microneedling?',
        a: 'It is built for exactly that: pH 6.37, panthenol and allantoin to settle the skin, and no acids anywhere in it. But your practitioner set the aftercare, so follow their timing rather than ours.',
      },
      {
        q: 'Ten minutes or twenty?',
        a: 'Anywhere in between. Do not go past twenty: a sheet that has started to dry will pull moisture back out of the skin. If you want longer contact, use a second sheet rather than leaving the first one on.',
      },
      {
        q: 'Is it safe in pregnancy?',
        a: 'Nothing in the formula is restricted in pregnancy, but we are not your doctor. Take the ingredient list to whoever is looking after you and ask them.',
      },
    ],
  },
  details: {
    eyebrow: 'The detail',
    title: 'Specification.',
    rows: [
      { label: 'Format', value: 'Sheet mask, tub of 30 with built-in tweezers' },
      { label: 'Net weight', value: '350 g / 30 sheets' },
      { label: 'Sheet', value: 'Ultra-thin lyocell' },
      { label: 'Function', value: 'Brightening and wrinkle improvement, licensed in Korea' },
      { label: 'Key actives', value: 'Niacinamide 2%, adenosine 0.04%, salmon DNA 1,000 ppm, panthenol 1%' },
      { label: 'pH', value: '6.37, near neutral' },
      { label: 'Use', value: '2 to 3 times a week, 10 to 20 minutes' },
      { label: 'After opening', value: 'Six months' },
      { label: 'Tested', value: 'Dermatologically tested; barrier study, P&K Skin Research Center, May 2025' },
      { label: 'Made by', value: 'DTS MG Co., Ltd., Seoul, South Korea' },
    ],
  },
  closing: {
    title: 'Thirty resets, in one tub.',
    body: 'Licensed for brightening and wrinkle improvement, measured for barrier recovery, and priced so you can use it twice a week without thinking about it.',
  },
  backToProducts: 'Products',
}

const AR: PdrnMaskCopy = {
  eyebrow: 'قناع ورقي · علبة من ثلاثين',
  headline: 'حاجز مجهد، يعود خلال عشرين دقيقة.',
  subheadline:
    'ترخّص كوريا هذا القناع لغرضين في آن واحد، التفتيح وتحسين التجاعيد، وتسمّي المادتين الفعالتين اللتين مُنح الترخيص عليهما: نياسيناميد بنسبة 2% كاملة وأدينوزين بنسبة 0.04%. ومعهما الحمض النووي المستخلص من السلمون بتركيز 1000 جزء في المليون، مطبوعاً كرقم على العبوة. ثلاثون قناعاً في علبة واحدة، يُسحب كل واحد على حدة، ليكون القناع حاضراً في المساء الذي تحتاجه بشرتك فيه فعلاً.',
  heroBullets: [
    'انخفض فقدان الماء عبر الحاجز بنحو 35% في دراسة سريرية على بشرة مهيّجة',
    'مرخّص في كوريا للتفتيح وتحسين التجاعيد في الوقت نفسه',
    'الحمض النووي من السلمون بتركيز 1000 جزء في المليون، معلن كرقم على العبوة',
    'ثلاثون قناعاً، أي نحو ثلاثة أشهر باستخدام مرتين أسبوعياً',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', '350 غ / 30 قناعاً', 'ليوسيل فائق الرقة'],
  packSize: '30 قناعاً · 350 غ',
  usageNote: 'مرتان إلى ثلاث مرات أسبوعياً',
  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّل الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني داخل الإمارات',
  stats: [
    { value: '30', label: 'قناعاً في العلبة، تُسحب بالملقط المدمج' },
    { value: '1000 ppm', label: 'حمض نووي من السلمون، مطبوع كرقم على العبوة' },
    { value: '2% + 0.04%', label: 'نياسيناميد وأدينوزين، المادتان المرخّصتان' },
    { value: '35%', label: 'انخفاض في فقدان الماء عبر الحاجز بعد الاستخدام' },
  ],
  licence: {
    eyebrow: 'الترخيص',
    title: 'كوريا وافقت على ادعاءين، وسمّت المادتين.',
    body:
      'معظم الأقنعة تصف نفسها بنفسها. أما هذا فمسجّل في كوريا كمستحضر تجميل ثنائي الوظيفة، أي أن جهة تنظيمية قرأت التركيبة ومنحت على أساسها ادعاءين محدّدين: يساعد على تفتيح البشرة، ويساعد على تحسين التجاعيد. ثم يطبع التسجيل اسمي المادتين اللتين يقوم عليهما هذا الترخيص. وكلتاهما موجودة في العلبة بالتركيز الذي يُمنح عليه الادعاء.',
    points: [
      {
        title: 'نياسيناميد، 2%',
        body:
          'الشق الخاص بالتفتيح من الترخيص، بجرعة كاملة. النياسيناميد من المواد النادرة التي تعمل على اللون وعلى الحاجز في الوقت نفسه، ولهذا يوجد في كل ما يستحق الشراء تقريباً، ولهذا مكانه في قناع مخصص لبشرة مرّت للتو بشيء ما.',
      },
      {
        title: 'أدينوزين، 0.04%',
        body:
          'الشق الخاص بالتجاعيد، بالتركيز الذي تمنح كوريا عليه هذا الادعاء بالضبط. ليس مقرّباً إليه ولا قريباً منه. عنده تماماً. وعليه يقوم الجانب المضاد للشيخوخة في هذه الصفحة.',
      },
      {
        title: 'ولماذا يساوي هذا أكثر من شعار',
        body:
          'بإمكان أي أحد أن يطبع «مضاد للشيخوخة» على عبوة. أما التسجيل الوظيفي فتمنحه جهة تنظيمية مقابل تركيبة مقدَّمة، ويمكن التحقق منه. تسجيلنا هو شهادة جمعية مستحضرات التجميل الكورية رقم 2025-12072، الصادرة للتصدير إلى الإمارات.',
      },
    ],
    figureAlt: 'علبة SKIN REBOOT PDRN MASK PACK، وعليها بيانات العبوة و350 غ / 30 قناعاً',
  },
  proof: {
    eyebrow: 'الدراسة',
    title: 'هيّجوا البشرة أولاً، ثم قاسوا.',
    intro:
      'عشرون امرأة بين 20 و60 عاماً في مركز أبحاث كوري مستقل. وبدلاً من قياس القناع على بشرة مرتاحة، أجهد الفريق الحاجز عمداً أولاً، ثم تتبّع فقدان الماء عبر البشرة مقارنة بجانب غير معالج من البشرة نفسها. الأقل أفضل: يعني ماءً أقل يتسرّب عبر حاجز متماسك.',
    chartTitle: 'فقدان الماء عبر البشرة',
    stages: ['قبل', 'بعد التهيّج', 'بعد القناع'],
    controlLabel: 'دون معالجة',
    treatedLabel: 'مع القناع',
    headline: { value: '34.969%', label: 'انخفاض فقدان الماء عن ذروة التهيّج' },
    versusControl: { value: '14%', label: 'دون الجانب غير المعالج عند النقطة نفسها' },
    attribution: 'مركز P&K لأبحاث البشرة، 2 مايو 2025. عشرون امرأة بين 20 و60 عاماً.',
    note:
      'عشرون دقيقة أعادت الجانب المعالج من 13.445 إلى 8.735، أي معظم الطريق إلى ما كان عليه قبل الجلسة. أما الجانب غير المعالج، المتروك لنفسه خلال العشرين دقيقة نفسها، فلم يتجاوز 10.205.',
  },
  sheet: {
    eyebrow: 'القماش',
    title: 'رقيق إلى حد أنك تقرأ من خلاله.',
    body:
      'الحامل أهم مما يتوقع الناس. القماش الذي يحمل الإسنس بشكل غير متساوٍ يوصله بشكل غير متساوٍ، والقماش الذي لا يلتصق حول الأنف وخط الفك يتوقف عن العمل هناك ببساطة. هذا القماش من الليوسيل، مغزول رفيعاً وموزّع بانتظام، وفي اختبار التشرّب نفسه أمام قماش عادي يمتصّ الإسنس على كامل سطحه بدل أن يتجمع في بقع.',
    points: [
      {
        title: 'متساوٍ على كامل المساحة',
        body: 'انتظام الألياف يعني أن الخد وخط الفك يأخذان الجرعة نفسها التي تأخذها الجبهة، وهذا ليس صحيحاً في كل قناع ورقي استخدمته.',
      },
      {
        title: 'يثبت فعلاً في مكانه',
        body: 'مساحة تلامس كافية للثبات على جانبي الأنف وتحت الفك طوال العشرين دقيقة، بدل أن ينفصل مع الجفاف.',
      },
      {
        title: 'شفاف ويسمح بالتنفس',
        body: 'يكاد يكون غير مرئي على البشرة وخفيف إلى حد نسيان وجوده. والإسنس مائي لا لزج، فلا شيء يسيل.',
      },
    ],
    figureAlt: 'قماش الليوسيل فائق الرقة بين اليدين، ويظهر مدى شفافيته',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'عشرون دقيقة، ثم ربّتي ولا تغسلي.',
    frequency: 'مرتان إلى ثلاث مرات أسبوعياً',
    steps: [
      { title: 'التنظيف', body: 'اغسلي وجفّفي بالتربيت. التونر أولاً إن كانت تلك عادتك، لكن تجنّبي أي حمض في ليلة القناع.' },
      { title: 'اسحبي قناعاً', body: 'استخدمي الملقط المدمج في الغطاء. إدخال الأصابع في العلبة يقصّر عمر الأقنعة الثلاثين تحته.' },
      { title: 'ألصقيه', body: 'حاذي فتحتي العينين أولاً ثم اعملي نحو الخارج، وادفعي فقاعات الهواء من المنتصف ليستقر القماش مستوياً حول الأنف والفك.' },
      { title: 'اتركيه 10 إلى 20 دقيقة', body: 'لا تتجاوزي العشرين. حين يبدأ القناع بالجفاف يسحب الرطوبة من البشرة بدل أن يمنحها.' },
      { title: 'ربّتي ولا تغسلي', body: 'انزعي القناع واضغطي الإسنس المتبقي على وجهك داخل البشرة. الغسل هنا يرمي الجزء الذي دفعت ثمنه.' },
      { title: 'أغلقي العلبة', body: 'أغلقي الغشاء الداخلي والغطاء بإحكام. إن بقيت مفتوحة جفّت الأقنعة العليا وتبعتها البقية.' },
    ],
    note:
      'مناسب في ليلة جلسة العناية أو التقشير أو رحلة طويلة، ومناسب في الليلة السابقة لأي مناسبة تريدين أن تبدي فيها بأفضل حال. وإن كنت قد خضعت للتو لإجراء عيادي، فاتّبعي تعليمات المختص أولاً.',
  },
  actives: {
    eyebrow: 'المكوّنات',
    title: 'التركيبة، بالأرقام.',
    intro: 'كل نسبة أدناه حقيقية ومقيسة، لا تخميناً لموقع المكوّن في القائمة.',
    cards: [
      {
        name: 'صوديوم دي إن إيه (PDRN)، 1000 جزء في المليون',
        body: 'أجزاء من الحمض النووي مصدرها السلمون، مطبوعة على العبوة كرقم لا كاختصار فقط. الحمض النووي للسلمون قريب بما يكفي من الحمض النووي البشري لتتعامل معه البشرة كمألوف، ولهذا صار ثابتاً في العناية الكورية بعد الإجراءات.',
      },
      {
        name: 'نياسيناميد، 2%',
        body: 'جرعة كاملة، وهي المادة التي تمنح كوريا عليها ادعاء التفتيح. يعمل على تفاوت اللون وعلى قوة الحاجز معاً.',
      },
      {
        name: 'أدينوزين، 0.04%',
        body: 'المادة التي يقوم عليها ادعاء تحسين التجاعيد، بالتركيز المرخّص تماماً.',
      },
      {
        name: 'بانثينول، 1%',
        body: 'بروفيتامين B5. يحبس الماء في البشرة ويخفّف الشد والاحمرار بعد جلسة عناية أو تعرّض زائد للشمس.',
      },
      {
        name: 'ألانتوين، 0.1%',
        body: 'مهدّئ هادئ، وهو هنا في أعلى نطاقه المعتاد لا في أدناه.',
      },
      {
        name: 'الإسنس نفسه',
        body: 'غليسرين 5.1%، ثم دايبروبيلين غلايكول وبروبانديول بنسبة 3% لكل منهما، وبيوتيلين غلايكول 2% وزيليتول 1%. تحوي العلبة 350 غ موزّعة على ثلاثين قناعاً، فيخرج كل قناع مثقلاً وتبقى البشرة رطبة طوال العشرين دقيقة.',
      },
    ],
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك. تُختبر درجة الحموضة في كل دفعة، وسجّلت الأخيرة 6.37، أي قريبة من المحايدة، فلا تلسع بشرة مرّت للتو بشيء ما.',
  },
  suited: {
    eyebrow: 'بصراحة',
    title: 'لمن هذا القناع.',
    forTitle: 'اشتريه إذا',
    forList: [
      'كان حاجزك يتعرّض للإجهاد باستمرار: ريتينويدات، أحماض، جلسات عناية، تكييف، رحلات طويلة',
      'كنت تستخدمين الأقنعة بما يكفي ليصبح الثلاثون قناعاً توفيراً لا التزاماً',
      'أردت التفتيح والعمل على التجاعيد في خطوة واحدة، وكلاهما مرخّص لا مجرّد ادعاء',
      'كنت تتعافين من جلسة عناية أو تقشير وتحتاجين شيئاً قريباً من المحايد لا يلسع',
      'كنتم أكثر من شخص في المنزل وتستهلكون الأقنعة أسرع مما يسمح به الكيس المفرد',
    ],
    notTitle: 'ابحثي عن غيره إذا',
    notList: [
      'كنت تستخدمين قناعاً مرة في الشهر، فثلاثون قناعاً تعني ستة أشهر بعد الفتح، والأفضل إنهاء العلبة خلالها',
      'كان لديك حساسية من اللاصقات الطبية أو الضمادات، وهو تحذير تذكره العبوة نفسها',
      'أردت قناعاً يعالج حب الشباب أو البثور، فهذا ليس غرضه',
      'كنت تبحثين عن قناع ببتيدات، فلا يوجد ببتيد واحد في هذه التركيبة',
      'أردت إحساساً قوياً فورياً بالبرودة أو الوخز، فهذا القناع هادئ عن قصد',
    ],
    note:
      'للاستخدام الخارجي فقط، وتجنّبي منطقة العينين. أوقفي الاستخدام واستشيري طبيباً عند حدوث احمرار أو تورّم أو تهيّج.',
  },
  routine: {
    eyebrow: 'الروتين',
    title: 'أين يقع القناع.',
    intro: 'تنظيف، ثم قناع، ثم إغلاق. القناع على بشرة نظيفة، والكريم فوق ما ربّتّه من إسنس.',
    thisProduct: 'هذا المنتج',
    viewProduct: 'عرض',
    chooseOptions: 'اختاري الحجم',
    fromPrice: 'من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء.',
    items: [
      {
        q: 'ما الذي يفعله PDRN هنا فعلاً؟',
        a: 'هو جزء من الحمض النووي مأخوذ من السلمون، بتركيز 1000 جزء في المليون، ويعمل كعامل ترطيب وتحسين لحالة سطح البشرة. انتشر في العناية الكورية بعد الإجراءات لأن الحمض النووي للسلمون قريب بنيوياً من حمضنا النووي. ولن نقول لك إنه يجدّد الخلايا أو يبني الكولاجين، فتلك ادعاءات دوائية لا يستطيع أي مستحضر تجميل أن يقولها بصدق.',
      },
      {
        q: 'هل الدراسة السريرية على هذا المنتج أم على المكوّن؟',
        a: 'على هذا المنتج. عشرون امرأة بين 20 و60 عاماً، في مركز P&K لأبحاث البشرة في كوريا، في مايو 2025. هُيّج الحاجز عمداً ثم قيس، الجانب المعالج مقابل غير المعالج.',
      },
      {
        q: 'كم تكفي العلبة؟',
        a: 'ثلاثون قناعاً. مرتان أسبوعياً تعني نحو ثلاثة أشهر ونصف، وثلاث مرات أسبوعياً نحو عشرة أسابيع. والعلبة معلَّمة بستة أشهر بعد الفتح، فالمرتان أسبوعياً هما الإيقاع المصممة حوله.',
      },
      {
        q: 'هل أستخدمه مباشرة بعد التقشير أو الميكرونيدلنغ؟',
        a: 'صُمّم لهذا تحديداً: حموضة 6.37، وبانثينول وألانتوين لتهدئة البشرة، ودون أي أحماض. لكن المختص هو من وضع خطة ما بعد الإجراء، فاتّبعي توقيته لا توقيتنا.',
      },
      {
        q: 'عشر دقائق أم عشرون؟',
        a: 'أي مدة بينهما. لا تتجاوزي العشرين: القناع الذي بدأ يجف يسحب الرطوبة من البشرة. وإن أردت تلامساً أطول فاستخدمي قناعاً ثانياً بدل ترك الأول.',
      },
      {
        q: 'هل هو آمن أثناء الحمل؟',
        a: 'لا يوجد في التركيبة ما هو مقيّد أثناء الحمل، لكننا لسنا طبيبك. خذي قائمة المكوّنات إلى من يتابع حالتك واسأليه.',
      },
    ],
  },
  details: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات.',
    rows: [
      { label: 'الشكل', value: 'قناع ورقي، علبة من 30 مع ملقط مدمج' },
      { label: 'الوزن الصافي', value: '350 غ / 30 قناعاً' },
      { label: 'القماش', value: 'ليوسيل فائق الرقة' },
      { label: 'الوظيفة', value: 'تفتيح وتحسين تجاعيد، مرخّص في كوريا' },
      { label: 'المواد الفعالة', value: 'نياسيناميد 2%، أدينوزين 0.04%، حمض نووي من السلمون 1000 جزء في المليون، بانثينول 1%' },
      { label: 'الحموضة', value: '6.37، قريبة من المحايدة' },
      { label: 'الاستخدام', value: 'مرتان إلى ثلاث مرات أسبوعياً، من 10 إلى 20 دقيقة' },
      { label: 'بعد الفتح', value: 'ستة أشهر' },
      { label: 'الاختبارات', value: 'مختبر جلدياً؛ دراسة حاجز في مركز P&K لأبحاث البشرة، مايو 2025' },
      { label: 'الصانع', value: 'DTS MG Co., Ltd.، سيول، كوريا الجنوبية' },
    ],
  },
  closing: {
    title: 'ثلاثون إعادة ضبط، في علبة واحدة.',
    body: 'مرخّص للتفتيح وتحسين التجاعيد، ومقيس لاستعادة الحاجز، وبسعر يتيح استخدامه مرتين أسبوعياً دون تفكير.',
  },
  backToProducts: 'المنتجات',
}

const RU: PdrnMaskCopy = {
  eyebrow: 'Тканевая маска · Банка на тридцать',
  headline: 'Измотанный барьер возвращается за двадцать минут.',
  subheadline:
    'Корея лицензирует эту маску сразу на две вещи, осветление и коррекцию морщин, и называет активные вещества, на которых выдала лицензию: ниацинамид в полных 2% и аденозин 0,04%. Рядом с ними ДНК лосося в концентрации 1000 ppm, указанная на упаковке цифрой. Тридцать масок в банке, каждая достаётся отдельно, чтобы маска была под рукой именно в тот вечер, когда коже это нужно.',
  heroBullets: [
    'Потеря влаги через барьер снизилась примерно на 35% в клиническом исследовании на раздражённой коже',
    'Лицензировано в Корее одновременно на осветление и коррекцию морщин',
    'ДНК лосося 1000 ppm, заявленная на упаковке цифрой',
    'Тридцать масок, около трёх месяцев при использовании дважды в неделю',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', '350 г / 30 масок', 'Ультратонкий лиоцелл'],
  packSize: '30 масок · 350 г',
  usageNote: 'Два-три раза в неделю',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы купить',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка по ОАЭ',
  stats: [
    { value: '30', label: 'Масок в банке, достаются вложенным пинцетом' },
    { value: '1000 ppm', label: 'ДНК лосося, указана на упаковке цифрой' },
    { value: '2% + 0,04%', label: 'Ниацинамид и аденозин, два лицензированных вещества' },
    { value: '35%', label: 'Меньше потеря влаги через барьер после применения' },
  ],
  licence: {
    eyebrow: 'Лицензия',
    title: 'Корея согласовала два заявления и назвала вещества.',
    body:
      'Большинство масок описывают себя сами. Эта зарегистрирована в Корее как двойное функциональное косметическое средство: регулятор прочитал состав и выдал под него два конкретных заявления, помогает осветлять кожу и помогает корректировать морщины. Затем регистрация печатает названия двух веществ, на которых эта лицензия держится. Оба есть в банке в тех концентрациях, под которые заявления и выдаются.',
    points: [
      {
        title: 'Ниацинамид, 2%',
        body:
          'Осветляющая половина лицензии, в полной дозировке. Ниацинамид из редких активов, которые работают одновременно с тоном и с барьером, поэтому он есть почти во всём, что стоит покупать, и поэтому ему место в маске для кожи, которая только что через что-то прошла.',
      },
      {
        title: 'Аденозин, 0,04%',
        body:
          'Половина про морщины, ровно в той концентрации, под которую Корея выдаёт это заявление. Не округлено до неё, не близко к ней. Ровно в ней. Именно на этом веществе держится антивозрастная часть страницы.',
      },
      {
        title: 'Почему это дороже лозунга',
        body:
          'Написать «антивозрастной» на упаковке может кто угодно. Функциональную регистрацию выдаёт регулятор под поданный состав, и её можно проверить. Наша это сертификат Корейской косметической ассоциации 2025-12072, выданный на экспорт в ОАЭ.',
      },
    ],
    figureAlt: 'Банка SKIN REBOOT PDRN MASK PACK с заявлениями на упаковке и объёмом 350 г / 30 масок',
  },
  proof: {
    eyebrow: 'Исследование',
    title: 'Сначала кожу раздражали, потом измеряли.',
    intro:
      'Двадцать женщин от 20 до 60 лет в независимом корейском исследовательском центре. Вместо того чтобы измерять маску на спокойной коже, барьер намеренно нагрузили, а затем отслеживали потерю влаги через кожу в сравнении с необработанным участком той же кожи. Меньше значит лучше: меньше воды уходит через барьер, который держится.',
    chartTitle: 'Потеря влаги через кожу',
    stages: ['До', 'После раздражения', 'После маски'],
    controlLabel: 'Без обработки',
    treatedLabel: 'С маской',
    headline: { value: '34,969%', label: 'Снижение потери влаги от пика раздражения' },
    versusControl: { value: '14%', label: 'Ниже необработанной стороны в той же точке' },
    attribution: 'P&K Skin Research Center, 2 мая 2025 года. Двадцать женщин от 20 до 60 лет.',
    note:
      'Двадцать минут вернули обработанную сторону с 13,445 до 8,735 - почти туда, откуда она начинала сессию. Необработанная сторона за те же двадцать минут дошла только до 10,205.',
  },
  sheet: {
    eyebrow: 'Полотно',
    title: 'Настолько тонкое, что сквозь него видно.',
    body:
      'Основа значит больше, чем принято думать. Полотно, которое держит эссенцию неравномерно, и отдаёт её неравномерно, а полотно, которое не ложится вокруг носа и по линии челюсти, там просто перестаёт работать. Здесь лиоцелл, тонкого прядения и с равномерной укладкой волокна, и в одном и том же тесте на пропитку против обычного полотна он вбирает эссенцию по всей площади, а не пятнами.',
    points: [
      {
        title: 'Равномерно по всей площади',
        body: 'Равномерное волокно значит, что щека и челюсть получают ту же дозу, что и лоб, а это верно далеко не для каждой тканевой маски.',
      },
      {
        title: 'Действительно держится',
        body: 'Достаточная площадь контакта, чтобы держаться на крыльях носа и под челюстью все двадцать минут, а не отходить по мере подсыхания.',
      },
      {
        title: 'Прозрачное и дышащее',
        body: 'Почти незаметно на коже и достаточно лёгкое, чтобы о нём забыть. Эссенция водянистая, а не липкая, поэтому ничего не течёт.',
      },
    ],
    figureAlt: 'Ультратонкое лиоцелловое полотно между ладонями, видна его прозрачность',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Двадцать минут, потом вбить, а не смывать.',
    frequency: 'Два-три раза в неделю',
    steps: [
      { title: 'Очищение', body: 'Умойтесь и промокните насухо. Тоник, если это ваша привычка, но в вечер маски пропустите всё кислотное.' },
      { title: 'Достаньте одну', body: 'Пинцетом, встроенным в крышку. Пальцы в банке сокращают жизнь тридцати маскам под ними.' },
      { title: 'Разгладьте', body: 'Сначала совместите вырезы для глаз, дальше от центра к краям, выгоняя пузыри воздуха, чтобы полотно легло ровно вокруг носа и челюсти.' },
      { title: 'Оставьте на 10-20 минут', body: 'Не дольше двадцати. Как только маска начинает подсыхать, она забирает влагу из кожи, а не отдаёт её.' },
      { title: 'Вбейте, не смывайте', body: 'Снимите маску и вбейте оставшуюся на лице эссенцию в кожу. Смыть здесь значит выбросить то, за что вы заплатили.' },
      { title: 'Закройте банку', body: 'Плотно закройте внутреннюю плёнку и крышку. Оставите открытой, пересохнут верхние маски, а за ними и остальные.' },
    ],
    note:
      'Хорошо в вечер после чистки, пилинга или длинного перелёта, и хорошо накануне события, к которому нужно выглядеть свежо. Если процедура была клинической, сначала следуйте указаниям своего специалиста.',
  },
  actives: {
    eyebrow: 'Что внутри',
    title: 'Состав, с цифрами.',
    intro: 'Каждый процент ниже настоящий и измеренный, а не угаданный по месту ингредиента в списке.',
    cards: [
      {
        name: 'ДНК натрия (PDRN), 1000 ppm',
        body: 'Фрагменты ДНК лосося, напечатанные на упаковке цифрой, а не оставленные аббревиатурой. ДНК лосося достаточно близка к человеческой, чтобы кожа воспринимала её как знакомую, поэтому она и закрепилась в уходе после процедур.',
      },
      {
        name: 'Ниацинамид, 2%',
        body: 'Полная дозировка и то самое вещество, под которое Корея выдаёт заявление об осветлении. Работает и с неровным тоном, и с прочностью барьера.',
      },
      {
        name: 'Аденозин, 0,04%',
        body: 'Вещество, на котором держится заявление о коррекции морщин, ровно в лицензированной концентрации.',
      },
      {
        name: 'Пантенол, 1%',
        body: 'Провитамин B5. Удерживает воду в коже и снимает стянутость и покраснение после процедуры или избытка солнца.',
      },
      {
        name: 'Аллантоин, 0,1%',
        body: 'Тихий успокаивающий компонент, здесь в верхней части своего обычного диапазона, а не в нижней.',
      },
      {
        name: 'Сама эссенция',
        body: 'Глицерин 5,1%, затем дипропиленгликоль и пропандиол по 3%, бутиленгликоль 2% и ксилит 1%. В банке 350 г на тридцать масок, поэтому каждая выходит тяжёлой и кожа остаётся влажной все двадцать минут.',
      },
    ],
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках. pH проверяют в каждой партии, последняя показала 6,37, почти нейтральный, поэтому маска не щиплет кожу, которая только что через что-то прошла.',
  },
  suited: {
    eyebrow: 'Честно',
    title: 'Кому это подойдёт.',
    forTitle: 'Берите, если',
    forList: [
      'Вашему барьеру достаётся: ретиноиды, кислоты, процедуры, кондиционеры, долгие перелёты',
      'Вы делаете маски достаточно часто, чтобы тридцать штук были экономией, а не обязательством',
      'Вам нужны осветление и работа с морщинами в одном шаге, и оба лицензированы, а не заявлены',
      'Вы восстанавливаетесь после чистки или пилинга и нужно что-то почти нейтральное, что не щиплет',
      'Вас в доме несколько и маски уходят быстрее, чем позволяет одиночное саше',
    ],
    notTitle: 'Ищите другое, если',
    notList: [
      'Вы делаете маску раз в месяц: тридцать штук это полгода после вскрытия, а банку лучше закончить внутри этого срока',
      'У вас аллергия на пластыри или компрессы, о чём предупреждает сама упаковка',
      'Вам нужна маска против акне и высыпаний, для этого она не создана',
      'Вы ищете пептидную маску: в этом составе нет ни одного пептида',
      'Вам нужен сильный мгновенный холод или покалывание, эта маска намеренно тихая',
    ],
    note:
      'Только для наружного применения, избегайте области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
  },
  routine: {
    eyebrow: 'Уход',
    title: 'Где стоит маска.',
    intro: 'Очищение, маска, закрепление. Маска на чистую кожу, крем поверх вбитой эссенции.',
    thisProduct: 'Этот',
    viewProduct: 'Открыть',
    chooseOptions: 'Выбрать объём',
    fromPrice: 'от',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой.',
    items: [
      {
        q: 'Что PDRN здесь реально делает?',
        a: 'Это фракция ДНК, полученная из лосося, в концентрации 1000 ppm, и работает она как увлажняющий и улучшающий состояние поверхности кожи компонент. В корейском уходе после процедур она прижилась потому, что ДНК лосося структурно близка к нашей. Мы не станем говорить, что она регенерирует клетки или строит коллаген: это лекарственные заявления, и ни одна косметика не может сделать их честно.',
      },
      {
        q: 'Исследование на продукте или на ингредиенте?',
        a: 'На продукте. Двадцать женщин от 20 до 60 лет, P&K Skin Research Center в Корее, май 2025 года. Барьер намеренно раздражали, затем измеряли, обработанная сторона против необработанной.',
      },
      {
        q: 'На сколько хватает банки?',
        a: 'Тридцать масок. Дважды в неделю это около трёх с половиной месяцев, трижды в неделю около десяти недель. На банке указано шесть месяцев после вскрытия, так что дважды в неделю это тот ритм, под который она и рассчитана.',
      },
      {
        q: 'Можно сразу после пилинга или микронидлинга?',
        a: 'Она для этого и сделана: pH 6,37, пантенол и аллантоин, чтобы успокоить кожу, и никаких кислот. Но план восстановления составил ваш специалист, поэтому следуйте его срокам, а не нашим.',
      },
      {
        q: 'Десять минут или двадцать?',
        a: 'Любое время между ними. Дольше двадцати не нужно: подсыхающая маска начинает тянуть влагу из кожи. Если хочется более долгого контакта, возьмите вторую маску, а не оставляйте первую.',
      },
      {
        q: 'Безопасно при беременности?',
        a: 'В составе нет ничего, что ограничено при беременности, но мы не ваш врач. Покажите список ингредиентов тому, кто вас ведёт, и спросите у него.',
      },
    ],
  },
  details: {
    eyebrow: 'Детали',
    title: 'Характеристики.',
    rows: [
      { label: 'Формат', value: 'Тканевая маска, банка на 30 штук со встроенным пинцетом' },
      { label: 'Объём', value: '350 г / 30 масок' },
      { label: 'Полотно', value: 'Ультратонкий лиоцелл' },
      { label: 'Функция', value: 'Осветление и коррекция морщин, лицензировано в Корее' },
      { label: 'Активы', value: 'Ниацинамид 2%, аденозин 0,04%, ДНК лосося 1000 ppm, пантенол 1%' },
      { label: 'pH', value: '6,37, почти нейтральный' },
      { label: 'Применение', value: '2-3 раза в неделю, 10-20 минут' },
      { label: 'После вскрытия', value: 'Шесть месяцев' },
      { label: 'Тестирование', value: 'Дерматологически протестировано; исследование барьера, P&K Skin Research Center, май 2025' },
      { label: 'Производитель', value: 'DTS MG Co., Ltd., Сеул, Южная Корея' },
    ],
  },
  closing: {
    title: 'Тридцать перезагрузок в одной банке.',
    body: 'Лицензировано на осветление и коррекцию морщин, измерено на восстановление барьера и стоит так, что использовать дважды в неделю можно не задумываясь.',
  },
  backToProducts: 'Продукты',
}

Object.assign(AR, {
  headline: 'ترطيب مشبع وعناية بمظهر أكثر تجانساً ونعومة.',
  subheadline:
    'ثلاثون قناعاً من الليوسيل فائق الرقة في عبوة واحدة مع ملقط مدمج. تجمع التركيبة بين النياسيناميد 2% والأدينوزين 0.04% وSodium DNA ‏(PDRN) بتركيز 1,000 جزء في المليون، مع بانثينول 1% وألانتوين 0.1%.',
  heroBullets: [
    'انخفض متوسط TEWL في الموضع المعالج نحو 35% بعد التهييج الفيزيائي واستخدام واحد',
    'نياسيناميد 2% وأدينوزين 0.04% لوظيفتي التفتيح وتحسين مظهر التجاعيد',
    'Sodium DNA ‏(PDRN) بتركيز 1,000 جزء في المليون ومن مصدر سلموني وفق العرض الرسمي',
    '350 غ / 30 قناعاً مع ملقط مدمج',
  ],
  usageNote: '10–20 دقيقة',
  stats: [
    { value: '30', label: 'قناعاً في العبوة مع ملقط مدمج' },
    { value: '1,000 ppm', label: 'Sodium DNA ‏(PDRN)' },
    { value: '2% + 0.04%', label: 'نياسيناميد وأدينوزين' },
    { value: 'نحو 35%', label: 'انخفاض متوسط TEWL عن مستوى ما بعد التهييج' },
  ],
  licence: {
    eyebrow: 'الوظيفة',
    title: 'تركيبة ثنائية الوظيفة للعناية باللون والتجاعيد.',
    body:
      'تعرّف العبوة الكورية المنتج كمستحضر تجميلي ثنائي الوظيفة يساعد على تفتيح البشرة وتحسين مظهر التجاعيد، وتذكر النياسيناميد والأدينوزين كمكوّنين وظيفيين.',
    points: [
      { title: 'نياسيناميد · 2%', body: 'المكوّن الوظيفي المرتبط بالمساعدة على تفتيح البشرة.' },
      { title: 'أدينوزين · 0.04%', body: 'المكوّن الوظيفي للعناية بمظهر التجاعيد.' },
      {
        title: 'صياغة تجميلية واضحة',
        body: 'الادعاءان يخصان مظهر البشرة. لا نقدّم القناع كعلاج ولا ننسب إليه تجديد الخلايا أو إصلاح الأنسجة.',
      },
    ],
    figureAlt: 'عبوتان من SKIN REBOOT PDRN MASK PACK بحجم 350 غ و30 قناعاً',
  },
  proof: {
    eyebrow: 'قياس TEWL',
    title: 'قياس فقد الماء بعد تهييج فيزيائي واستخدام واحد.',
    intro:
      'شملت الدراسة 20 امرأة بأعمار 20–60 عاماً. قيس TEWL قبل التهييج الفيزيائي وبعده وبعد استخدام المنتج، مع موضع غير معالج للمقارنة. لم تحدد المواد المتاحة نوع التهييج الفيزيائي.',
    chartTitle: 'فقد الماء عبر البشرة (TEWL)',
    stages: ['قبل التهييج', 'بعد التهييج', 'بعد الاستخدام'],
    controlLabel: 'غير معالج',
    treatedLabel: 'مع القناع',
    headline: { value: 'نحو 35%', label: 'انخفاض الموضع المعالج من 13.445 إلى 8.735' },
    versusControl: { value: '8.735', label: 'القراءة النهائية للموضع المعالج مقابل 10.205 لغير المعالج' },
    attribution: 'P&K Skin Research Center، 2 مايو 2025. 20 امرأة، 20–60 عاماً.',
    note:
      'كانت القراءة المعروضة للموضع المعالج 6.965 قبل التهييج، و13.445 بعده، و8.735 بعد الاستخدام. أما الموضع غير المعالج فسجّل 7.065 ثم 13.090 ثم 10.205. النتيجة تخص TEWL بعد استخدام واحد، ولا تثبت تعافي البشرة بعد الإجراءات.',
  },
  sheet: {
    eyebrow: 'قماش الليوسيل',
    title: 'قماش رقيق وشفاف مصمم لملامسة متقاربة.',
    body:
      'يصف العرض الرسمي القماش بأنه ليوسيل فائق الرقة، ناعم وشفاف وجيد التهوية. كما يعرض مقارنة بصرية لتوزيع الألياف بعد التشريب، من دون نشر قياس عددي للامتصاص أو الالتصاق.',
    points: [
      { title: 'ليوسيل فائق الرقة', body: 'وصف مثبت في العبوة والعرض الرسمي.' },
      { title: 'مظهر شفاف', body: 'القماش الرقيق يبدو شبه شفاف عند وضعه على البشرة.' },
      { title: 'ملامسة متقاربة', body: 'نعّمي القناع من الوسط إلى الأطراف للحصول على ملامسة متساوية قدر الإمكان.' },
    ],
    figureAlt: 'قناع الليوسيل الرقيق ممسوكاً بين اليدين',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'قناع واحد لمدة 10–20 دقيقة.',
    frequency: 'لا تحدد العبوة وتيرة أسبوعية',
    steps: [
      { title: 'اسحبي قناعاً واحداً', body: 'استخدمي الملقط المدمج ولا تلمسي الأقنعة المتبقية بيديك.' },
      { title: 'ضعيه على الوجه', body: 'وزعيه على بشرة نظيفة مع تجنب محيط العينين والأغشية المخاطية.' },
      { title: 'اتركيه 10–20 دقيقة', body: 'التزمي بالمدة المحددة على العبوة.' },
      { title: 'أزيليه', body: 'انزعي القناع وربتي الخلاصة المتبقية بلطف. لا تشطفيها.' },
      { title: 'أحكمي الإغلاق', body: 'أغلقي الغشاء الداخلي والغطاء مباشرة حتى لا يجف المحتوى.' },
    ],
    note:
      'العبوة لا توصي باستخدامه بعد التقشير أو الوخز الدقيق أو أي إجراء عيادي. اتبعي تعليمات المختص قبل إدخاله في رعاية ما بعد الإجراءات.',
  },
  actives: {
    eyebrow: 'التركيبة',
    title: 'تراكيز واضحة، من دون مبالغة في الآلية.',
    intro: 'القيم التالية مأخوذة من التركيبة الكمية للمنتج.',
    cards: [
      {
        name: 'Sodium DNA ‏(PDRN) · ‏0.1% / 1,000 ppm',
        body: 'مكوّن ملطف للبشرة. ويذكر العرض الرسمي أن PDRN مستخلص من حليب السلمون.',
      },
      { name: 'نياسيناميد · 2%', body: 'المكوّن الوظيفي المرتبط بالمساعدة على تفتيح البشرة.' },
      { name: 'أدينوزين · 0.04%', body: 'المكوّن الوظيفي للعناية بمظهر التجاعيد.' },
      { name: 'بانثينول · 1%', body: 'مكوّن ملطف للبشرة ضمن التركيبة.' },
      { name: 'ألانتوين · 0.1%', body: 'مكوّن ملطف للبشرة ضمن التركيبة.' },
      {
        name: 'قاعدة مرطبة متعددة المكونات',
        body: 'غليسرين 5.094076%، دايبروبيلين غلايكول 3%، بروبانديول 3%، بيوتيلين غلايكول 2.000004%، 1,2-هيكسانيديول 1.504002%، Glycereth-26 بنسبة 1%، وزيليتول 1%.',
      },
    ],
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote:
      'تحتوي التركيبة على زيت اللافندر 0.002% كمكوّن عطري. قياس pH للمنتج كان 6.37 ضمن مواصفة 5.00–7.00؛ ولا يثبت هذا الرقم وحده عدم اللسع أو الملاءمة المطلقة للبشرة الحساسة.',
  },
  suited: {
    eyebrow: 'قبل الاختيار',
    title: 'متى تختارين هذا القناع.',
    forTitle: 'اختاريه إذا',
    forList: [
      'تريدين ترطيباً مشبعاً في خطوة ورقية لمدة 10–20 دقيقة',
      'يهمك وجود النياسيناميد 2% والأدينوزين 0.04% في التركيبة',
      'تستخدمين الأقنعة بانتظام وتناسبك عبوة من 30 قناعاً',
      'تفضلين قماش ليوسيل رقيقاً مع ملقط مدمج',
    ],
    notTitle: 'اختاري غيره إذا',
    notList: [
      'كانت لديك حساسية من اللاصقات أو الكمادات',
      'كانت بشرتك تتفاعل مع زيت اللافندر أو المكونات العطرية',
      'تبحثين عن علاج للندبات أو الجروح أو حب الشباب',
      'تحتاجين منتجاً معتمداً صراحة للاستخدام بعد إجراء عيادي',
    ],
    note:
      'للاستخدام الخارجي فقط. أوقفي الاستخدام واطلبي المشورة الطبية عند ظهور احمرار أو تورم أو تهيج.',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء.',
    items: [
      {
        q: 'ما PDRN الموجود في هذا القناع؟',
        a: 'تسميه التركيبة Sodium DNA بتركيز 0.1%، أي 1,000 جزء في المليون. ويذكر العرض الرسمي أن مصدره حليب السلمون. لا ننقل إليه آليات دوائية أو نتائج الحقن.',
      },
      {
        q: 'ماذا أثبتت الدراسة؟',
        a: 'بعد التهييج الفيزيائي واستخدام واحد، انخفض متوسط TEWL في الموضع المعالج من 13.445 إلى 8.735، أي نحو 35%. شملت الدراسة 20 امرأة بأعمار 20–60 عاماً. لم تحدد المواد المتاحة طريقة التهييج، ولا تثبت النتيجة علاج الحاجز أو رعاية ما بعد الإجراءات.',
      },
      { q: 'كم مدة التطبيق؟', a: 'من 10 إلى 20 دقيقة، كما هو محدد على العبوة.' },
      {
        q: 'كم مرة أستخدمه؟',
        a: 'العبوة لا تحدد وتيرة أسبوعية. اختاري الوتيرة وفق تحمّل بشرتك وروتينك، وأوقفي الاستخدام عند التهيج.',
      },
      {
        q: 'هل يناسب البشرة الحساسة؟',
        a: 'لا توجد في المواد المتاحة مطالبة مطلقة بأنه مناسب لكل بشرة حساسة. يحتوي على زيت اللافندر، كما تحذر العبوة من الحساسية تجاه اللاصقات أو الكمادات.',
      },
      {
        q: 'كيف أحافظ على العبوة؟',
        a: 'استخدمي الملقط، وأغلقي الغشاء والغطاء بإحكام، واحفظي العبوة في مكان بارد وجاف بعيداً عن الشمس والأطفال. مدة الاستخدام بعد الفتح 6 أشهر.',
      },
    ],
  },
  details: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات.',
    rows: [
      { label: 'الشكل', value: 'قناع ليوسيل ورقي في عبوة مع ملقط مدمج' },
      { label: 'الوزن الصافي', value: '350 غ / 30 قناعاً' },
      { label: 'المدة', value: '10–20 دقيقة' },
      { label: 'الوتيرة', value: 'غير محددة على العبوة' },
      { label: 'المكوّنان الوظيفيان', value: 'نياسيناميد 2% وأدينوزين 0.04%' },
      { label: 'Sodium DNA', value: '0.1% / 1,000 جزء في المليون' },
      { label: 'pH', value: '6.37؛ المواصفة 5.00–7.00' },
      { label: 'بعد الفتح', value: '6 أشهر' },
      { label: 'الاختبار', value: 'مختبر جلدياً؛ دراسة TEWL بعد التهييج الفيزيائي' },
      { label: 'المنشأ', value: 'صنع في كوريا' },
    ],
  },
  closing: {
    title: 'ثلاثون قناعاً، في عبوة واحدة.',
    body: 'ليوسيل فائق الرقة مع نياسيناميد 2% وأدينوزين 0.04% وSodium DNA بتركيز 1,000 جزء في المليون.',
  },
} satisfies Partial<PdrnMaskCopy>)

Object.assign(RU, {
  headline: 'Насыщенное увлажнение и уход за ровным, гладким видом кожи.',
  subheadline:
    'Тридцать ультратонких лиоцелловых масок в одной банке со встроенным пинцетом. В формуле ниацинамид 2%, аденозин 0,04%, Sodium DNA (PDRN) 1 000 ppm, пантенол 1% и аллантоин 0,1%.',
  heroBullets: [
    'Средний TEWL обработанного участка снизился примерно на 35% после физического раздражения и одного применения',
    'Ниацинамид 2% и аденозин 0,04% для осветляющей функции и ухода за морщинами',
    'Sodium DNA (PDRN) 1 000 ppm; в официальной презентации указан источник из молок лосося',
    '350 г / 30 масок со встроенным пинцетом',
  ],
  usageNote: '10–20 минут',
  stats: [
    { value: '30', label: 'Масок в банке со встроенным пинцетом' },
    { value: '1 000 ppm', label: 'Sodium DNA (PDRN)' },
    { value: '2% + 0,04%', label: 'Ниацинамид и аденозин' },
    { value: '≈35%', label: 'Снижение среднего TEWL от уровня после раздражения' },
  ],
  licence: {
    eyebrow: 'Функция',
    title: 'Две косметические задачи: тон и видимые морщины.',
    body:
      'Корейская упаковка определяет продукт как двойное функциональное косметическое средство, которое помогает осветлить кожу и улучшить вид морщин. Функциональными компонентами названы ниацинамид и аденозин.',
    points: [
      { title: 'Ниацинамид · 2%', body: 'Функциональный компонент, связанный с осветляющим заявлением.' },
      { title: 'Аденозин · 0,04%', body: 'Функциональный компонент для ухода за видимыми морщинами.' },
      {
        title: 'В рамках косметического ухода',
        body: 'Эти заявления относятся к внешнему виду кожи. Маска не заявляется как средство для регенерации клеток или восстановления тканей.',
      },
    ],
    figureAlt: 'Две банки SKIN REBOOT PDRN MASK PACK объёмом 350 г на 30 масок',
  },
  proof: {
    eyebrow: 'Измерение TEWL',
    title: 'Потерю воды измеряли после физического раздражения и одного применения.',
    intro:
      'В исследовании участвовали 20 женщин 20–60 лет. TEWL измеряли до физического раздражения, после него и после применения продукта, с необработанным участком для сравнения. Вид физического воздействия в доступных материалах не указан.',
    chartTitle: 'Трансэпидермальная потеря воды (TEWL)',
    stages: ['До раздражения', 'После раздражения', 'После применения'],
    controlLabel: 'Без обработки',
    treatedLabel: 'С маской',
    headline: { value: '≈35%', label: 'Снижение на обработанном участке: с 13,445 до 8,735' },
    versusControl: { value: '8,735', label: 'Итог обработанного участка против 10,205 без обработки' },
    attribution: 'P&K Skin Research Center, 2 мая 2025 года. 20 женщин, 20–60 лет.',
    note:
      'На обработанном участке приведены значения 6,965 до раздражения, 13,445 после него и 8,735 после применения. На необработанном — 7,065, 13,090 и 10,205. Это одноразовое измерение TEWL, а не доказательство восстановления кожи после процедур.',
  },
  sheet: {
    eyebrow: 'Лиоцелловое полотно',
    title: 'Тонкое и прозрачное полотно для плотного контакта.',
    body:
      'Официальная презентация описывает полотно как ультратонкий лиоцелл: мягкий, прозрачный и воздухопроницаемый. В ней также есть визуальное сравнение распределения волокон после пропитки, но нет числовых данных по впитыванию или прилеганию.',
    points: [
      { title: 'Ультратонкий лиоцелл', body: 'Этот материал и характеристика указаны на упаковке и в презентации.' },
      { title: 'Прозрачный финиш', body: 'Тонкое полотно становится почти прозрачным на коже.' },
      { title: 'Плотный контакт', body: 'Разглаживайте маску от центра к краям, чтобы она легла максимально ровно.' },
    ],
    figureAlt: 'Тонкое лиоцелловое полотно маски между ладонями',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Одна маска на 10–20 минут.',
    frequency: 'Упаковка не устанавливает частоту',
    steps: [
      { title: 'Достаньте одну маску', body: 'Используйте встроенный пинцет и не касайтесь остальных масок руками.' },
      { title: 'Распределите по лицу', body: 'Наложите на чистую кожу, избегая области глаз и слизистых.' },
      { title: 'Оставьте на 10–20 минут', body: 'Соблюдайте время, указанное на упаковке.' },
      { title: 'Снимите', body: 'Снимите полотно и мягко вбейте оставшуюся эссенцию. Не смывайте.' },
      { title: 'Плотно закройте', body: 'Сразу закройте внутреннюю мембрану и крышку, чтобы содержимое не высыхало.' },
    ],
    note:
      'Упаковка не рекомендует маску после пилинга, микронидлинга или другой процедуры. В постпроцедурном уходе следуйте указаниям специалиста.',
  },
  actives: {
    eyebrow: 'Формула',
    title: 'Точные концентрации без лишних обещаний.',
    intro: 'Значения ниже взяты из количественной формулы продукта.',
    cards: [
      {
        name: 'Sodium DNA (PDRN) · 0,1% / 1 000 ppm',
        body: 'Компонент для кондиционирования кожи. Официальная презентация указывает происхождение PDRN из молок лосося.',
      },
      { name: 'Ниацинамид · 2%', body: 'Функциональный компонент, связанный с осветляющим заявлением.' },
      { name: 'Аденозин · 0,04%', body: 'Функциональный компонент для ухода за видимыми морщинами.' },
      { name: 'Пантенол · 1%', body: 'Компонент для кондиционирования кожи в составе формулы.' },
      { name: 'Аллантоин · 0,1%', body: 'Компонент для кондиционирования кожи в составе формулы.' },
      {
        name: 'Многокомпонентная увлажняющая основа',
        body: 'Глицерин 5,094076%, дипропиленгликоль 3%, пропандиол 3%, бутиленгликоль 2,000004%, 1,2-гександиол 1,504002%, Glycereth-26 1% и ксилит 1%.',
      },
    ],
    inciTitle: 'Полный состав (INCI)',
    inciNote:
      'Формула содержит масло лаванды 0,002% как ароматический компонент. pH продукта — 6,37 при спецификации 5,00–7,00; сам по себе этот показатель не доказывает отсутствие жжения или абсолютную пригодность для чувствительной кожи.',
  },
  suited: {
    eyebrow: 'Перед выбором',
    title: 'Когда эта маска уместна.',
    forTitle: 'Выбирайте, если',
    forList: [
      'Вам нужен насыщенный увлажняющий шаг на 10–20 минут',
      'Вам важны ниацинамид 2% и аденозин 0,04% в составе',
      'Вы регулярно используете маски и вам подходит формат на 30 штук',
      'Вы предпочитаете тонкий лиоцелл и встроенный пинцет',
    ],
    notTitle: 'Выберите другое, если',
    notList: [
      'У вас аллергия на пластыри или компрессы',
      'Кожа реагирует на масло лаванды или ароматические компоненты',
      'Вы ищете средство для лечения рубцов, ран или акне',
      'Вам нужен продукт, прямо заявленный для использования после процедуры',
    ],
    note:
      'Только для наружного применения. При покраснении, отёке или раздражении прекратите использование и обратитесь к врачу.',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой.',
    items: [
      {
        q: 'Какой PDRN содержится в маске?',
        a: 'В количественной формуле указан Sodium DNA 0,1%, то есть 1 000 ppm. Официальная презентация называет источником молоки лосося. Мы не переносим на эту маску лекарственные механизмы или результаты инъекций.',
      },
      {
        q: 'Что именно показало исследование?',
        a: 'После физического раздражения и одного применения средний TEWL обработанного участка снизился с 13,445 до 8,735, то есть примерно на 35%. Участвовали 20 женщин 20–60 лет. В доступных материалах не указан метод раздражения, а результат не доказывает лечение барьера или постпроцедурную пригодность.',
      },
      { q: 'Сколько держать маску?', a: 'От 10 до 20 минут, как указано на упаковке.' },
      {
        q: 'Как часто использовать?',
        a: 'Упаковка не устанавливает недельную частоту. Подберите её по переносимости и своему уходу; при раздражении прекратите использование.',
      },
      {
        q: 'Подходит ли чувствительной коже?',
        a: 'Абсолютного заявления для любой чувствительной кожи в доступных материалах нет. В составе есть масло лаванды, а упаковка отдельно предупреждает об аллергии на пластыри и компрессы.',
      },
      {
        q: 'Как хранить банку?',
        a: 'Пользуйтесь пинцетом, плотно закрывайте мембрану и крышку, храните в прохладном сухом месте вдали от солнца и детей. Срок после вскрытия — 6 месяцев.',
      },
    ],
  },
  details: {
    eyebrow: 'Детали',
    title: 'Характеристики.',
    rows: [
      { label: 'Формат', value: 'Лиоцелловая тканевая маска в банке со встроенным пинцетом' },
      { label: 'Масса', value: '350 г / 30 масок' },
      { label: 'Время', value: '10–20 минут' },
      { label: 'Частота', value: 'На упаковке не установлена' },
      { label: 'Функциональные компоненты', value: 'Ниацинамид 2% и аденозин 0,04%' },
      { label: 'Sodium DNA', value: '0,1% / 1 000 ppm' },
      { label: 'pH', value: '6,37; спецификация 5,00–7,00' },
      { label: 'После вскрытия', value: '6 месяцев' },
      { label: 'Тестирование', value: 'Дерматологически протестировано; исследование TEWL после физического раздражения' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },
  closing: {
    title: 'Тридцать масок в одной банке.',
    body: 'Ультратонкий лиоцелл, ниацинамид 2%, аденозин 0,04% и Sodium DNA 1 000 ppm.',
  },
} satisfies Partial<PdrnMaskCopy>)

const BY_LOCALE: Record<PdrnMaskLocale, PdrnMaskCopy> = { en: EN, ar: AR, ru: RU }

export function getPdrnMaskCopy(locale: string): PdrnMaskCopy {
  return BY_LOCALE[(locale as PdrnMaskLocale) in BY_LOCALE ? (locale as PdrnMaskLocale) : 'en']
}
