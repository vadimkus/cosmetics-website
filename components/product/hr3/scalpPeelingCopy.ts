/**
 * Bespoke copy for HR³ MATRIX SCALP PEELING α (product 46), fourth of the scalp line.
 *
 * SOURCING - signed DTS MG formula, SA QACS 22 06 00966 (July 2022), the older
 * assessment under the "CSP CLINICAL SCALP PEELING" name, COA lot WNL088, DTS MG deck.
 * The registered artwork PDF has no text layer, so NOTHING here is attributed to the
 * carton panel.
 *   Aqua 50.131%, ALCOHOL DENAT. 33.600%, propylene glycol 11.994%, PEG-60
 *   hydrogenated castor oil 2.000%, MENTHOL 0.900%, MENTHYL LACTATE 0.800%,
 *   phenoxyethanol 0.200%, chlorphenesin 0.150%, betaine 0.100%, t-butyl alcohol
 *   0.0875%, disodium EDTA 0.020%, SALICYLIC ACID 0.00990% (99 ppm), dipropylene
 *   glycol 0.006%, butylene glycol 0.0007%, denatonium benzoate 0.00029%,
 *   1,2-hexanediol 0.00008%, camellia sinensis 0.00005% (0.5 ppm), fifteen other botanicals
 *   at 0.00001% (0.1 ppm) each, COPPER TRIPEPTIDE-1 0.0000005% (5 ppb).
 *   COA: transparent liquid, pH 4.31 (spec 4.00-5.00), stability PASS at 50 C,
 *   bacteria <10 cfu/ml and moulds/yeasts <10 cfu/ml against 100 each, fill 100.33 ml,
 *   three-year life.
 *   SA: product category "Hair care". Patch test satisfactory, NON IRRITANT (QACS) -
 *   assessor notes volunteer numbers not statistically significant. "Other Tests: Use
 *   Test Panel Of 20 Subjects (QACS Ltd)" - NO RESULTS RECORDED, so no result claimed.
 *   OLDER SA: "The product is applied on the scalp and hair and it is NOT RINSED OFF."
 *   Toxicologically assessed as a leave-on hair care product. That older assessment
 *   describes a superseded formula preserved with methylparaben and iodopropynyl
 *   butylcarbamate; the current formula contains neither.
 *   DECK: how to use is "Drop the Scalp Peeling 5ml into the glass cylinder. Dip swab
 *   enough in the solvent. Hold right under the swab head and rub rather powerfully."
 *
 * COOLING TOTALS ACROSS THE LINE, for the comparison this page makes:
 *   Peeling 0.900 + 0.800 = 1.700%  (highest total in the compared HR³ range)
 *   Shampoo 1.120 + 0.080 = 1.200%  (most MENTHOL specifically)
 *   Tonic   0.300 + 0.080 = 0.380%
 *   Ampoule 0.200                   = 0.200%
 * The shampoo copy was corrected on 17 Aug to say "most menthol" rather than
 * "hardest-cooling", because this product beats it on the total. Keep the two
 * consistent if either figure ever changes.
 *
 * FRAMING (owner decision, 17 Aug): no hair-loss claim. Registered category is hair
 * care; this is a prep step.
 *
 * MUST NEVER BE ADDED:
 *   - "Gentle" in any form. A third of this bottle is denatured alcohol and it is
 *     rubbed in with a swab. Our own record called it gentle three times.
 *   - "Disinfects the treatment area" (deck). Alcohol needs roughly 60-70% to work as
 *     an antiseptic; this is 33.6%. The page says outright that it is not a
 *     disinfectant.
 *   - Salicylic acid as the exfoliating active. It is 99 ppm. The alcohol and the
 *     propylene glycol do the work.
 *   - The deck's copper tripeptide and saw palmetto slides repeat the 5α-reductase /
 *     DHT, angiogenesis, anagen-follicle and dermal-papilla claims - for ingredients
 *     present here at 5 PARTS PER BILLION and 0.1 ppm. With the hair tonic's Russian
 *     panel and the Hair Solution deck, that is six documents in this line asserting a
 *     prescription-drug mechanism.
 *   - Black Complex "effective for anti-hair loss and hair regrowth".
 *   - Any anti-inflammatory or blood-circulation claim.
 *   - A pregnancy instruction attributed to this carton: the readable registered artwork
 *     does not carry one, so the standalone product page does not invent one.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface ScalpPeelingCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]

  addToBag: string
  adding: string
  added: string
  inBag: string
  viewBag: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string

  stats: Array<{ value: string; label: string }>

  notGentle: {
    eyebrow: string
    title: string
    body: string
    items: string[]
    detail: string
  }

  working: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  cooling: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ product: string; dose: string; note: string; here?: boolean }>
    body: string
  }

  labelClaims: {
    eyebrow: string
    title: string
    body: string
    items: Array<{ name: string; dose: string; note: string }>
    footnote: string
  }

  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }

  quality: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    patch: string
  }

  inci: {
    eyebrow: string
    title: string
    intro: string
    fullInci: string
    fullInciNote: string
  }

  safety: {
    eyebrow: string
    title: string
    points: string[]
    note: string
  }

  spec: {
    eyebrow: string
    title: string
    rows: Array<{ label: string; value: string }>
  }

  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string }>
  }

  backToProducts: string
}

const EN: ScalpPeelingCopy = {
  eyebrow: 'HR³ MATRIX Scalp Peeling α · 100 ml',
  headline: 'A third of this bottle is alcohol. That is the point.',
  subheadline:
    'This is not an exfoliating treatment, it is a prep step - and a genuinely good one. Denatured alcohol at 33.600% with propylene glycol at 11.994% cuts through scalp oil, sweat and product build-up in seconds, so that whatever you do next lands on clean skin. In this range, what you do next is needle the Hair Solution ampoule in. Then 1.7% of combined cooling agents, which is more than any other GENOSYS product carries.',
  heroBullets: [
    'Alcohol denat. 33.600% - it degreases the scalp, it does not condition it',
    'Menthol 0.900% with menthyl lactate 0.800%: the most cooling agent in the range',
    'Applied on a cotton swab, rubbed in firmly, and not rinsed off',
    'The salicylic acid is 99 ppm. We are not going to call this a peel',
  ],
  badges: ['Made in Korea', '100 ml', 'Prep step', 'Not rinsed off'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '33.6%', label: 'denatured alcohol' },
    { value: '1.7%', label: 'combined cooling agents, the most in the range' },
    { value: '99 ppm', label: 'salicylic acid - not a peeling dose' },
    { value: '4.31', label: 'batch pH' },
  ],

  notGentle: {
    eyebrow: 'Read this first',
    title: 'Our own description used to call this gentle. It is not.',
    body:
      'Three times over, the old copy on this page described a gentle scalp peel. A solution that is a third denatured alcohol, carries 1.7% cooling agents and is rubbed into the scalp with a cotton swab is not gentle, and saying so before you buy is more use to you than saying it afterwards. It is effective. That is a different word.',
    items: [
      'Expect it to feel cold and sharp on contact, especially once the scalp is degreased',
      'It will sting on skin that is broken, sunburned, freshly shaved or already inflamed',
      'It is flammable at this alcohol level - let it dry before a dryer or styling iron',
      'It is not a disinfectant: alcohol needs roughly 60 to 70% to work that way, and this is 33.6%',
    ],
    detail:
      'None of that is a fault in the formula. Stripping the scalp fast and drying without residue is exactly what a prep step before microneedling should do. But it is a tool for a job, not a comfort product, and it belongs in a routine rather than on its own.',
  },

  working: {
    eyebrow: 'The working formula',
    title: 'What is actually doing the work',
    intro:
      'Almost half the bottle is a solvent system, and that is the honest description of this product. Here is what is in it, in the order the quantities matter.',
    items: [
      {
        name: 'Alcohol denat.',
        dose: '33.600%',
        body: 'A third of the bottle. It dissolves sebum and product residue on contact and flashes off in seconds, leaving nothing behind for the next step to push through. It also carries denatonium benzoate, a bittering agent, so the denatured alcohol cannot be drunk.',
      },
      {
        name: 'Propylene glycol',
        dose: '11.994%',
        body: 'Nearly an eighth of the bottle. It lifts oil-soluble build-up alongside the alcohol, and it slows evaporation just enough that the solution stays wet long enough to work across a section rather than drying on the swab.',
      },
      {
        name: 'Menthol, with menthyl lactate',
        dose: '0.900% + 0.800%',
        body: '1.7% of cooling agents between them, the highest total in any GENOSYS product. Menthol gives the immediate cold, menthyl lactate carries it on for several minutes afterwards.',
      },
      {
        name: 'PEG-60 hydrogenated castor oil',
        dose: '2.000%',
        body: 'The solubiliser, and what stops a formula that is a third alcohol and half water from separating in the bottle.',
      },
      {
        name: 'Phenoxyethanol, with chlorphenesin',
        dose: '0.200% + 0.150%',
        body: 'The preservative system, backed by the alcohol itself. Worth noting that an older version of this formula used methylparaben and iodopropynyl butylcarbamate; the current one contains neither.',
      },
      {
        name: 'Betaine',
        dose: '0.100%',
        body: 'The only humectant in the formula, and a small counterweight to the alcohol. It is present and it is not enough to make this a hydrating step - nothing at 0.1% could be, against 33.6%.',
      },
    ],
  },

  cooling: {
    eyebrow: 'How cold, exactly',
    title: 'The most cooling agent GENOSYS puts in anything',
    intro:
      'Every product in this range cools, and they are not remotely equivalent. If the cold is what you like about the line - or what you cannot tolerate - the totals are worth seeing side by side.',
    rows: [
      { product: 'Scalp Peeling α - this one', dose: '1.700%', note: 'menthol 0.900 + menthyl lactate 0.800', here: true },
      { product: 'Medi Scalp Shampoo α', dose: '1.200%', note: 'menthol 1.120 + menthyl lactate 0.080' },
      { product: 'Hair Tonic α', dose: '0.380%', note: 'menthol 0.300 + two agents at 0.040' },
      { product: 'Hair Solution α', dose: '0.200%', note: 'menthol only' },
    ],
    body:
      'One honest distinction: the shampoo carries more menthol specifically, at 1.120% against 0.900% here, but this formula has more cooling agent in total and it goes onto skin that has just been stripped of its oil, with no water to dilute it. In practice this is the coldest thing in the range to actually use. The ampoule at the bottom of that table is the mildest, which is deliberate - it goes on after needling.',
  },

  labelClaims: {
    eyebrow: 'Proportion',
    title: 'Two ingredients the label leads on, and their real doses',
    body:
      'Salicylic acid and copper tripeptide-1 both appear high on the ingredient list, and our own copy used to build the product around them. Here is what is actually there.',
    items: [
      { name: 'Salicylic acid', dose: '99 ppm', note: 'the Hair Tonic runs 0.250% - twenty-five times more' },
      { name: 'Green tea leaf extract', dose: '0.5 ppm', note: 'named on the label' },
      { name: 'Sixteen botanicals', dose: '0.1 ppm each', note: 'including the nine Black Complex extracts' },
      { name: 'Copper tripeptide-1', dose: '0.005 ppm', note: 'five parts per billion - the lowest in the range' },
    ],
    footnote:
      'Salicylic acid is a real keratolytic at working concentrations, and 99 parts per million is not one. So the flaking and build-up this product removes are removed by the alcohol and the glycol, not by the acid - which is fine, because they are very good at it. And if copper peptide is what you want from this line, the Hair Solution ampoule carries it at a thousand times this concentration.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Swab, section, rub firmly. Do not rinse.',
    frequency: 'Before a microneedling treatment · not rinsed off',
    steps: [
      {
        title: 'Decant about 5 ml',
        body: 'Into a small glass or cylinder rather than working from the bottle. It keeps the rest of the bottle clean and lets you soak the swab properly.',
      },
      {
        title: 'Soak a cotton swab',
        body: 'Dip it until it is genuinely wet, not damp. A dry swab drags on the scalp and does not carry enough solution to cut through oil.',
      },
      {
        title: 'Hold close to the head and rub firmly',
        body: 'Grip the swab just below the head so you can apply real pressure, and work the parting rather than dabbing at it. The manufacturer\u2019s instruction is to rub "rather powerfully", and that is not a translation artefact - this step is mechanical as well as chemical.',
      },
      {
        title: 'Work section by section, then stop',
        body: 'Part, swab, move on. Do not rinse it off and do not follow it with water: the whole point is that the scalp is left clean and dry for the next step.',
      },
      {
        title: 'Then the ampoule',
        body: 'In the HR³ MATRIX system this is followed by the Hair Solution α, needled in with a 0.25 to 0.5 mm roller or stamp. Both products are supplied together in the Mesopecia Kit.',
      },
    ],
    note:
      'Keep it well away from the eyes - this is a third alcohol with 0.9% menthol and it will hurt considerably more than a shampoo would. Let the scalp dry before any heat: at this alcohol concentration the liquid is flammable. And if you are pregnant or breastfeeding, ask your doctor first: the Hair Solution ampoule in this same range carries a pregnancy caution attributed to its menthol, and this formula has four and a half times as much of it.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea and released against a written specification, and unusually for this range the batch was tested for stability as well as purity. Registered under hair care rather than as a treatment.',
    rows: [
      { label: 'Appearance', value: 'Transparent liquid' },
      { label: 'pH', value: '4.31 at 25 °C, inside a 4.00-5.00 specification' },
      { label: 'Stability', value: 'Passes at 50 °C' },
      { label: 'Bacteria', value: 'Under 10 cfu/ml, against a permitted 100' },
      { label: 'Moulds and yeasts', value: 'Under 10 cfu/ml, against a permitted 100' },
      { label: 'Fill', value: '100.33 ml against a 100 ml declaration' },
      { label: 'Shelf life', value: 'Three years unopened' },
      { label: 'Registered category', value: 'Hair care' },
      { label: 'Not rinsed off', value: 'Assessed as a leave-on product' },
    ],
    patch:
      'The test on file is a cutaneous irritancy patch test by an independent laboratory, and it came back non-irritant - which, given a third of the bottle is alcohol, is worth knowing. The assessor adds the same caveat as elsewhere in this range: the number of volunteers was not statistically significant. A use test on a panel of 20 subjects was also carried out, but no results for it appear in the documents we hold, so we are not claiming any. There is no efficacy study.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the bottle',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the carton in your hand.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Contains 33.6% denatured alcohol. Flammable - keep away from open flame, and let the scalp dry before using a dryer or styling iron.',
      'Contains 0.9% menthol with 0.8% menthyl lactate. It will feel strongly cold.',
      'For external use only, on the scalp. Not rinsed off.',
      'Do not use on broken, wounded, sunburned, freshly shaved or inflamed scalp.',
      'Keep well away from the eyes and mucous membranes; rinse thoroughly with cool water on contact.',
      'Not a disinfectant. Do not rely on it to sterilise anything.',
      'If you are pregnant or breastfeeding, ask your doctor before use.',
      'Stop and see a doctor if redness, swelling or irritation develops.',
      'Keep out of reach of children. It contains a bittering agent, but it is still a third alcohol.',
    ],
    note:
      'Drawn from the safety assessment and the formula. The registered artwork we hold has no readable panel text, so nothing above is quoted from the carton - check the box you receive for its own wording.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '100 ml' },
      { label: 'Texture', value: 'Transparent liquid, water-thin' },
      { label: 'Registered category', value: 'Hair care' },
      { label: 'What it is for', value: 'Degreasing and preparing the scalp before a microneedling treatment' },
      { label: 'Alcohol', value: 'Alcohol denat. 33.600% - flammable' },
      { label: 'Solvents', value: 'Propylene glycol 11.994%, PEG-60 hydrogenated castor oil 2.000%' },
      { label: 'Cooling', value: 'Menthol 0.900% + menthyl lactate 0.800% = 1.700%, the most in the range' },
      { label: 'Salicylic acid', value: '0.00990% (99 ppm) - not a keratolytic dose' },
      { label: 'At trace', value: 'Green tea 0.5 ppm, sixteen botanicals 0.1 ppm each, copper tripeptide-1 5 ppb' },
      { label: 'Humectant', value: 'Betaine 0.100%' },
      { label: 'Preservation', value: 'Phenoxyethanol 0.200%, chlorphenesin 0.150%, plus the alcohol' },
      { label: 'pH', value: '4.00-5.00 (4.31 on the batch tested)' },
      { label: 'Application', value: 'On a cotton swab, rubbed firmly, section by section. Not rinsed' },
      { label: 'Testing', value: 'Patch tested, non-irritant. A 20-subject use test exists with no recorded results' },
      { label: 'Also in', value: 'The HR³ MATRIX Mesopecia Kit' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Is this actually a peel?',
        a: 'Not in the sense you are probably thinking. There is no AHA in it and the salicylic acid is at 99 parts per million, which does not exfoliate anything. What removes flaking and build-up here is 33.6% alcohol with 12% propylene glycol dissolving it and a swab rubbing it off. That works, and it works fast - it is just cleaning rather than chemical exfoliation, and "peeling" is the manufacturer\u2019s name for the product rather than a description of the mechanism.',
      },
      {
        q: 'Do I need it if I already use the shampoo?',
        a: 'Only if you are microneedling. The shampoo cleans your scalp perfectly well for daily purposes. This exists to leave the scalp completely stripped and dry immediately before a needling treatment, which a rinse-and-towel-dry cannot do as reliably. If you are not needling, buy the shampoo and skip this.',
      },
      {
        q: 'Will it dry my scalp out?',
        a: 'Used as intended - before a treatment, not daily - no, because you are not leaving 33.6% alcohol on your scalp every day. Used as a daily toner it absolutely would, and it is not meant for that. There is one humectant in the formula, betaine at 0.1%, and it is not there to make the product moisturising.',
      },
      {
        q: 'Does it disinfect the scalp before needling?',
        a: 'No, and this matters if you are needling at home. The manufacturer\u2019s literature does say it disinfects the treatment area, but alcohol generally needs 60 to 70% to work as an antiseptic and this is 33.6%. It degreases and it cleans. For anything that needs to be sterile, use a product actually intended for that - the homecare kits include a separate disinfecting jar for the applicator for exactly this reason.',
      },
      {
        q: 'How cold is it compared with the shampoo?',
        a: 'Colder in use. The shampoo has more menthol on paper, 1.120% against 0.900%, but this has more cooling agent in total at 1.7%, and it goes onto scalp that has just had its oil stripped off with no water to dilute it. Most people find this the sharpest sensation in the range.',
      },
      {
        q: 'Why is copper peptide on the label if there is almost none?',
        a: 'Because carton ingredient lists follow the manufacturer\u2019s own sequence, not the quantity in the bottle. Copper tripeptide-1 is here at five parts per billion, which is the lowest concentration of anything in the whole HR³ MATRIX range. It is on the label; it is not a reason to buy this. The Hair Solution ampoule carries it at a thousand times this dose.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: ScalpPeelingCopy = {
  eyebrow: 'منظف فروة الرأس إتش آر³ ماتريكس α · 100 مل',
  headline: 'فروة نظيفة ومنتعشة خلال خمس دقائق.',
  subheadline:
    'محلول احترافي يترك على فروة الرأس لتنظيفها وإنعاشها. يساعد الكحول المغير 33.600% والبروبيلين غليكول 11.994% على إزالة الدهون والقشور السطحية وبقايا مستحضرات التصفيف، بينما يمنح المنثول 0.900% ومنثيل لاكتات 0.800% إحساساً مبرداً قوياً. يوزع بعود قطني، وتدلك الفروة، ثم يترك خمس دقائق قبل Hair Solution إذا كان ضمن روتينك.',
  heroBullets: [
    'كحول مُمَوَّه 33.600% - يُزيل دهن الفروة، لا يكيّفها',
    'منثول 0.900% مع منثيل لاكتات 0.800%: أعلى عامل تبريد في المجموعة',
    'يوضع بعود قطني، ويُفرك بقوة، ولا يُشطف',
    'حمض الساليسيليك 99 جزءاً من المليون. ولن نسمّي هذا تقشيراً',
  ],
  badges: ['صُنع في كوريا', '100 مل', 'خطوة من خمس دقائق', 'لا يُشطف'],

  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى السلة',
  inBag: 'في السلة',
  viewBag: 'عرض السلة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '33.6%', label: 'كحول مُمَوَّه' },
    { value: '1.7%', label: 'عوامل تبريد مجتمعة، الأعلى في المجموعة' },
    { value: '99 ppm', label: 'حمض ساليسيليك - ليست جرعة تقشير' },
    { value: '4.31', label: 'حموضة الدفعة' },
  ],

  notGentle: {
    eyebrow: 'إحساس واضح',
    title: 'تنظيف قوي بلمسة مبردة مكثفة.',
    body:
      'هذا محلول احترافي مركز لإنعاش الفروة، وليس تونراً يومياً للراحة. تنظف قاعدته الكحولية بسرعة، وتمنح عوامل التبريد بتركيز إجمالي 1.7% إحساساً بارداً قوياً يدوم.',
    items: [
      'توقّعي إحساساً بارداً حادّاً عند الملامسة، خاصة بعد إزالة دهن الفروة',
      'سيلسع بشرة مجروحة أو محروقة بالشمس أو محلوقة حديثاً أو ملتهبة أصلاً',
      'قابل للاشتعال بهذا المستوى من الكحول - اتركيه يجفّ قبل المجفّف أو مكواة الشعر',
      'ليس مطهّراً: فالكحول يحتاج نحو 60 إلى 70% ليعمل بذلك الشكل، وهذا 33.6%',
    ],
    detail:
      'يستخدم على فروة رأس سليمة فقط. توجه العبوة إلى تركه خمس دقائق قبل Hair Solution، ولا توجه إلى استخدامه فوق جلد سبق وخزه بالإبر أو تضرر بأي طريقة.',
  },

  working: {
    eyebrow: 'التركيبة العاملة',
    title: 'ما يقوم بالعمل فعلاً',
    intro:
      'قرابة نصف العبوة نظام مُذيبات، وهذا هو الوصف الصريح لهذا المنتج. وهذا ما فيه، بترتيب أهمّية الكمّيات.',
    items: [
      {
        name: 'Alcohol Denat.',
        dose: '33.600%',
        body: 'ثلث العبوة. يساعد على إذابة الزهم وبقايا المنتجات، ثم يتبخر سريعاً ليترك إحساساً نظيفاً وخفيفاً. ويحتوي أيضاً على ديناتونيوم بنزوات، وهو عامل شديد المرارة يمنع شرب الكحول المغير.',
      },
      {
        name: 'Propylene Glycol',
        dose: '11.994%',
        body: 'قرابة ثُمن العبوة. يرفع التراكم الذوّاب في الزيت مع الكحول، ويُبطئ التبخّر بما يكفي ليبقى المحلول رطباً مدة تكفي للعمل على قسم كامل بدل أن يجفّ على العود.',
      },
      {
        name: 'المنثول، مع منثيل لاكتات',
        dose: '0.900% + 0.800%',
        body: '1.7% من عوامل التبريد بينهما، وهو أعلى مجموع ضمن مجموعة HR³ المقارنة. يمنح المنثول البرودة الفورية، بينما يطيل منثيل لاكتات الإحساس المبرد.',
      },
      {
        name: 'PEG-60 Hydrogenated Castor Oil',
        dose: '2.000%',
        body: 'المُذيب، وما يمنع تركيبة ثلثها كحول ونصفها ماء من الانفصال في العبوة.',
      },
      {
        name: 'فينوكسي إيثانول، مع كلورفينيسين',
        dose: '0.200% + 0.150%',
        body: 'نظام الحفظ، مدعوماً بالكحول نفسه. ويستحق الذكر أن نسخة أقدم من هذه التركيبة استخدمت ميثيل بارابين وأيودوبروبينيل بوتيل كارباميت؛ والحالية لا تحتوي أيّاً منهما.',
      },
      {
        name: 'Betaine',
        dose: '0.100%',
        body: 'المرطّب الجاذب الوحيد في التركيبة، وثقل موازن صغير للكحول. موجود ولا يكفي لجعل هذه خطوة ترطيب - فلا شيء عند 0.1% يمكنه ذلك مقابل 33.6%.',
      },
    ],
  },

  cooling: {
    eyebrow: 'كم البرد بالضبط',
    title: 'أعلى مجموع لعوامل التبريد في مجموعة HR³',
    intro:
      'كل منتج في هذه المجموعة يبرّد، وهي ليست متكافئة إطلاقاً. فإن كان البرد هو ما يعجبك في المجموعة - أو ما لا تتحمّلينه - فالمجاميع تستحق النظر جنباً إلى جنب.',
    rows: [
      { product: 'مقشّر الفروة α - هذا', dose: '1.700%', note: 'منثول 0.900 + منثيل لاكتات 0.800', here: true },
      { product: 'شامبو ميدي للفروة α', dose: '1.200%', note: 'منثول 1.120 + منثيل لاكتات 0.080' },
      { product: 'تونيك الشعر α', dose: '0.380%', note: 'منثول 0.300 + عاملان بـ 0.040' },
      { product: 'محلول الشعر α', dose: '0.200%', note: 'منثول فقط' },
    ],
    body:
      'يحتوي الشامبو على منثول أكثر منفرداً، 1.120% مقابل 0.900% هنا، بينما يحمل هذا المحلول أعلى مجموع من عوامل التبريد في المجموعة عند 1.700%. اختاريه عندما تريدين إحساساً مبرداً واضحاً يترك على الفروة بدلاً من تنظيف يشطف.',
  },

  labelClaims: {
    eyebrow: 'الجرعة مهمة',
    title: 'كل مكوّن مذكور بحجمه الحقيقي',
    body:
      'حمض الساليسيليك والمستخلصات النباتية وCopper Tripeptide-1 موجودة بتراكيز أثرية فقط. أما قصة التنظيف والتبريد فتعود إلى المكونات الموجودة بمستويات ملموسة.',
    items: [
      { name: 'حمض الساليسيليك', dose: '99 ppm', note: 'تونيك الشعر يحمله بـ 0.250% - خمسة وعشرون ضعفاً' },
      { name: 'مستخلص أوراق الشاي الأخضر', dose: '0.5 ppm', note: 'مذكور على الملصق' },
      { name: 'خمسة عشر مستخلصاً نباتياً آخر', dose: '0.1 ppm لكل', note: 'ومنها تسعة مستخلصات Black Complex' },
      { name: 'كوبر ترايببتايد-1', dose: '0.005 ppm', note: 'خمسة أجزاء من المليار - الأدنى في المجموعة' },
    ],
    footnote:
      'حمض الساليسيليك محلّل حقيقي للكيراتين عند تراكيز عاملة، و99 جزءاً من المليون ليست واحدة منها. فالتقشّر والتراكم الذي يزيله هذا المنتج يزيله الكحول والجليكول، لا الحمض - وهذا لا بأس به، فهما بارعان في ذلك جداً. وإن كان الببتيد النحاسي مرادك من هذه المجموعة، فأمبولة Hair Solution تحمله بألف ضعف هذا التركيز.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'عود، قسم، فرك بقوة. ولا شطف.',
    frequency: 'يترك 5 دقائق · لا يُشطف',
    steps: [
      {
        title: 'صبّي نحو 5 مل',
        body: 'في كأس صغير أو أسطوانة بدل العمل من العبوة. فذلك يُبقي بقيّة العبوة نظيفة ويسمح بتشبيع العود جيداً.',
      },
      {
        title: 'شبّعي عوداً قطنياً',
        body: 'اغمسيه حتى يصبح رطباً فعلاً لا نديّاً. فالعود الجافّ يشدّ على الفروة ولا يحمل محلولاً يكفي لقطع الزيت.',
      },
      {
        title: 'أمسكي قريباً من الرأس وافركي بقوة',
        body: 'اقبضي العود أسفل رأسه مباشرة لتتمكّني من ضغط حقيقي، واعملي على الفرق بدل الطبطبة عليه. وتعليمة الشركة هي الفرك «بقوة إلى حدّ ما»، وهذه ليست زلّة ترجمة - فهذه الخطوة ميكانيكية بقدر ما هي كيميائية.',
      },
      {
        title: 'دلكي ثم انتظري خمس دقائق',
        body: 'اعملي فرقاً بعد فرق، ثم دلكي فروة الرأس واتركي المحلول خمس دقائق. لا تشطفيه.',
      },
      {
        title: 'ثم Hair Solution عند استخدامه',
        body: 'تضع العبوة Hair Solution بعد الانتظار خمس دقائق. اتبعي تعليمات الطقم أو الجهاز المنفصلة إذا كنت تستخدمين بروتوكولاً احترافياً كاملاً.',
      },
    ],
    note:
      'أبعديه جيداً عن العينين والأغشية المخاطية. يستخدم على فروة سليمة فقط، ولا يوضع بعد الميكرونيدلينغ أو على جلد سبق وخزه. اتركي الفروة تجف قبل الحرارة أو اللهب، واستخدميه خلال ستة أشهر من الفتح.',
  },

  quality: {
    eyebrow: 'جودة موثقة',
    title: 'مختبر من الحموضة إلى التعبئة',
    intro:
      'يفحص السائل النهائي من حيث الثبات والجودة الميكروبيولوجية والرقم الهيدروجيني وحجم التعبئة. وظيفته التجميلية المسجلة هي إنعاش فروة الرأس.',
    rows: [
      { label: 'المظهر', value: 'سائل شفّاف' },
      { label: 'الحموضة', value: '4.31 عند 25 درجة، ضمن مواصفة 4.00-5.00' },
      { label: 'الاستقرار', value: 'ناجح عند 50 درجة' },
      { label: 'البكتيريا', value: 'أقل من 10 وحدات/مل، مقابل 100 مسموحة' },
      { label: 'الأعفان والخمائر', value: 'أقل من 10 وحدات/مل، مقابل 100 مسموحة' },
      { label: 'التعبئة', value: '100.33 مل مقابل 100 مل معلنة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات غير مفتوح' },
      { label: 'الفئة المسجّلة', value: 'العناية بالشعر' },
      { label: 'لا يُشطف', value: 'مُقيَّم كمنتج يُترك' },
    ],
    patch:
      'الاختبار المتوفّر هو اختبار لصقة لتهيّج الجلد أجراه مختبر مستقل، وعاد غير مهيّج - وهذا يستحق المعرفة بالنظر إلى أن ثلث العبوة كحول. ويضيف المُقيّم التحفّظ نفسه الموجود في غير هذا المنتج من المجموعة: عدد المتطوّعين لم يكن ذا دلالة إحصائية. وأُجري أيضاً اختبار استخدام على لجنة من 20 شخصاً، لكن لا نتائج له في الوثائق التي نملكها، فلا نزعم أيّاً منها. ولا توجد دراسة فعالية.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في العبوة',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'يحتوي 33.6% كحولاً مُمَوَّهاً. قابل للاشتعال - يُبعَد عن اللهب المكشوف، وتُترك الفروة لتجفّ قبل استخدام مجفّف أو مكواة.',
      'يحتوي 0.9% منثول مع 0.8% منثيل لاكتات. سيُحسّ ببرد قويّ.',
      'للاستعمال الخارجي فقط على فروة الرأس. لا يُشطف.',
      'للبالغين. لا يستخدم للأطفال دون ثلاث سنوات.',
      'لا يُستخدم على فروة مجروحة أو محروقة بالشمس أو محلوقة حديثاً أو ملتهبة.',
      'لا يوضع بعد الميكرونيدلينغ أو على جلد سبق وخزه بالإبر.',
      'يُبعَد جيداً عن العينين والأغشية المخاطية؛ ويُشطف جيداً بماء بارد عند الملامسة.',
      'ليس مطهّراً. لا تعتمدي عليه لتعقيم أي شيء.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'يُحفظ بعيداً عن متناول الأطفال. فهو يحتوي عاملاً مُمرّراً، لكنه لا يزال ثلثه كحولاً.',
      'يستخدم خلال ستة أشهر من الفتح، ويحفظ في مكان بارد وجاف بعيداً عن الشمس المباشرة.',
    ],
    note:
      'تؤكد العبوة الاستعمال الخارجي، واحتياطات العينين والأغشية المخاطية، ومنع الاستخدام دون ثلاث سنوات، وإرشادات التوقف عند التفاعل، والتخزين البارد الجاف، وفترة ستة أشهر بعد الفتح.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '100 مل' },
      { label: 'الملمس', value: 'سائل شفّاف، بخفّة الماء' },
      { label: 'الفئة المسجّلة', value: 'العناية بالشعر' },
      { label: 'الغرض', value: 'التنظيف التجميلي العميق وإنعاش فروة الرأس السليمة' },
      { label: 'الكحول', value: 'كحول مُمَوَّه 33.600% - قابل للاشتعال' },
      { label: 'المُذيبات', value: 'بروبيلين جليكول 11.994%، PEG-60 زيت خروع مهدرج 2.000%' },
      { label: 'التبريد', value: 'منثول 0.900% + منثيل لاكتات 0.800% = 1.700%، الأعلى في المجموعة' },
      { label: 'حمض الساليسيليك', value: '0.00990% (99 ppm) - ليست جرعة محلّلة للكيراتين' },
      { label: 'بجرعات أثرية', value: 'شاي أخضر 0.5 ppm، خمسة عشر مستخلصاً نباتياً آخر 0.1 ppm لكل، كوبر ترايببتايد-1 5 ppb' },
      { label: 'المرطّب الجاذب', value: 'بيتايين 0.100%' },
      { label: 'الحفظ', value: 'فينوكسي إيثانول 0.200%، كلورفينيسين 0.150%، مع الكحول' },
      { label: 'الحموضة', value: '4.00-5.00 (4.31 على الدفعة المختبرة)' },
      { label: 'التطبيق', value: 'يوزع بعود قطني، وتدلك الفروة، ويترك 5 دقائق من دون شطف' },
      { label: 'الاختبار', value: 'اختبار لصقة، غير مهيّج. واختبار استخدام على 20 شخصاً بلا نتائج مسجّلة' },
      { label: 'بعد الفتح', value: 'يستخدم خلال 6 أشهر' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل هذا تقشير فعلاً؟',
        a: 'ليس بالمعنى الذي تفكّرين فيه على الأرجح. فلا حمض ألفا هيدروكسي فيه، وحمض الساليسيليك عند 99 جزءاً من المليون لا يقشّر شيئاً. وما يُزيل التقشّر والتراكم هنا هو 33.6% كحول مع 12% بروبيلين جليكول يُذيبانه وعود يفركه. وذلك يعمل، ويعمل بسرعة - لكنه تنظيف لا تقشير كيميائي، و«التقشير» اسم الشركة للمنتج لا وصف للآلية.',
      },
      {
        q: 'أحتاجه إن كنت أستخدم الشامبو أصلاً؟',
        a: 'الشامبو هو التنظيف اليومي الذي يشطف. أما هذا فهو خيار مركز يترك على الفروة لتنظيف أعمق من حين إلى آخر، مع إحساس تبريد قوي قبل Hair Solution. لا تشترط العبوة استخدام الميكرونيدلينغ.',
      },
      {
        q: 'هل سيجفّف فروة رأسي؟',
        a: 'باستخدامه كما هو مقصود - قبل معالجة لا يومياً - فلا، لأنك لا تتركين 33.6% كحولاً على فروتك كل يوم. أما استخدامه كتونر يومي فسيفعل ذلك قطعاً، وهو غير مخصّص لذلك. وفي التركيبة مرطّب جاذب واحد، بيتايين بنسبة 0.1%، وهو ليس موجوداً لجعل المنتج مرطّباً.',
      },
      {
        q: 'هل يطهّر فروة الرأس؟',
        a: 'لا. إنه منظف تجميلي ومنعش لفروة الرأس، وليس مطهراً أو منتج تعقيم. لا يوضع بعد الوخز بالإبر ولا يعتمد عليه للوقاية من العدوى.',
      },
      {
        q: 'كم يبرّد مقارنة بالشامبو؟',
        a: 'أبرد في الاستخدام. فالشامبو فيه منثول أكثر على الورق، 1.120% مقابل 0.900%، لكن هذا فيه عامل تبريد أكثر بالمجموع عند 1.7%، ويذهب على فروة جُرّد زيتها للتوّ بلا ماء يخفّفه. ويجد معظم الناس هذا أحدّ إحساس في المجموعة.',
      },
      {
        q: 'لماذا الببتيد النحاسي على الملصق إن كان لا يكاد يوجد؟',
        a: 'لأن قوائم مكوّنات العلب تتبع تسلسل الشركة نفسها، لا الكمّية في العبوة. فالكوبر ترايببتايد-1 هنا عند خمسة أجزاء من المليار، وهو أدنى تركيز لأي شيء في مجموعة إتش آر³ ماتريكس كلها. وهو على الملصق؛ وليس سبباً لشراء هذا. وأمبولة Hair Solution تحمله بألف ضعف هذه الجرعة.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: ScalpPeelingCopy = {
  eyebrow: 'HR³ MATRIX очищение кожи головы α · 100 мл',
  headline: 'Чистая, свежая кожа головы за пять минут.',
  subheadline:
    'Профессиональный несмываемый раствор для глубокого очищения и освежения кожи головы. Денатурированный спирт 33,600% с пропиленгликолем 11,994% помогает убрать себум, поверхностные чешуйки и остатки стайлинга, а ментол 0,900% с ментиллактатом 0,800% дарит интенсивную прохладу. Нанесите ватной палочкой, помассируйте и оставьте на пять минут перед Hair Solution, если он входит в ваш уход.',
  heroBullets: [
    'Спирт денат. 33,600% - он обезжиривает кожу головы, а не кондиционирует её',
    'Ментол 0,900% с ментил лактатом 0,800%: больше всего охлаждающего агента в линейке',
    'Наносится ватной палочкой, втирается с усилием и не смывается',
    'Салициловой кислоты 99 ppm. Мы не станем называть это пилингом',
  ],
  badges: ['Сделано в Корее', '100 мл', 'Пять минут', 'Не смывается'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '33,6%', label: 'денатурированного спирта' },
    { value: '1,7%', label: 'охлаждающих агентов, больше всех в линейке' },
    { value: '99 ppm', label: 'салициловой кислоты - не пилинговая доза' },
    { value: '4,31', label: 'pH партии' },
  ],

  notGentle: {
    eyebrow: 'Ощущение',
    title: 'Решительное очищение с интенсивной прохладой.',
    body:
      'Это концентрированный профессиональный раствор для освежения кожи головы, а не ежедневный комфорт-тоник. Спиртовая основа очищает быстро, а охлаждающие компоненты в общей концентрации 1,7% дают яркое и продолжительное ощущение свежести.',
    items: [
      'Ожидайте холодного, резкого ощущения при контакте, особенно после обезжиривания',
      'Он будет щипать повреждённую, обожжённую солнцем, свежевыбритую или уже воспалённую кожу',
      'При таком содержании спирта он горюч - дайте высохнуть до фена или утюжка',
      'Это не антисептик: спирту нужно примерно 60-70%, чтобы работать так, а здесь 33,6%',
    ],
    detail:
      'Используйте только на неповреждённой коже головы. Упаковка предписывает оставить средство на пять минут перед Hair Solution; она не инструктирует наносить его на уже обработанную иглами или иным образом повреждённую кожу.',
  },

  working: {
    eyebrow: 'Работающая формула',
    title: 'Что действительно делает работу',
    intro:
      'Почти половина флакона - система растворителей, и это честное описание продукта. Вот что в нём, в порядке значимости количеств.',
    items: [
      {
        name: 'Alcohol Denat.',
        dose: '33.600%',
        body: 'Треть флакона. Помогает растворить себум и остатки средств, затем быстро испаряется, оставляя чистое и лёгкое ощущение. Денатония бензоат придаёт спирту выраженную горечь, чтобы его нельзя было выпить.',
      },
      {
        name: 'Propylene Glycol',
        dose: '11.994%',
        body: 'Почти восьмая часть флакона. Поднимает жирорастворимые загрязнения вместе со спиртом и замедляет испарение ровно настолько, чтобы раствор оставался влажным достаточно долго для обработки пробора, а не сохнул на палочке.',
      },
      {
        name: 'Ментол с ментил лактатом',
        dose: '0.900% + 0.800%',
        body: 'Вместе 1,7% охлаждающих компонентов - самая высокая сумма в сравниваемой линии HR³. Ментол даёт немедленный холод, а ментиллактат продлевает ощущение прохлады.',
      },
      {
        name: 'PEG-60 Hydrogenated Castor Oil',
        dose: '2.000%',
        body: 'Солюбилизатор, и то, что не даёт формуле, на треть спиртовой и наполовину водной, расслоиться во флаконе.',
      },
      {
        name: 'Феноксиэтанол с хлорфенезином',
        dose: '0.200% + 0.150%',
        body: 'Система консервации, подкреплённая самим спиртом. Стоит отметить, что более старая версия формулы использовала метилпарабен и йодопропинилбутилкарбамат; в текущей нет ни того, ни другого.',
      },
      {
        name: 'Betaine',
        dose: '0.100%',
        body: 'Единственный увлажнитель в формуле и небольшой противовес спирту. Он есть, и его недостаточно, чтобы сделать это увлажняющим шагом: ничто при 0,1% не смогло бы против 33,6%.',
      },
    ],
  },

  cooling: {
    eyebrow: 'Насколько именно холодно',
    title: 'Самая высокая сумма охлаждающих компонентов в линии HR³',
    intro:
      'Охлаждает каждый продукт этой линии, и они совсем не равнозначны. Если холод - это то, что вам нравится в линии, или то, чего вы не переносите, суммы стоит увидеть рядом.',
    rows: [
      { product: 'Пилинг для кожи головы α - этот', dose: '1,700%', note: 'ментол 0,900 + ментил лактат 0,800', here: true },
      { product: 'MEDI шампунь α', dose: '1,200%', note: 'ментол 1,120 + ментил лактат 0,080' },
      { product: 'Тоник для кожи головы α', dose: '0,380%', note: 'ментол 0,300 + два агента по 0,040' },
      { product: 'Hair Solution α', dose: '0,200%', note: 'только ментол' },
    ],
    body:
      'В шампуне больше именно ментола - 1,120% против 0,900% здесь, - зато у этого раствора самая высокая суммарная концентрация охлаждающих компонентов в линейке: 1,700%. Выбирайте его, когда нужен выраженный несмываемый охлаждающий эффект, а не очищение с последующим смыванием.',
  },

  labelClaims: {
    eyebrow: 'Доза имеет значение',
    title: 'Каждый компонент - в честной пропорции',
    body:
      'Салициловая кислота, растительные экстракты и Copper Tripeptide-1 присутствуют лишь в следовых концентрациях. Очищение и охлаждение обеспечивают компоненты, введённые в значимых количествах.',
    items: [
      { name: 'Салициловая кислота', dose: '99 ppm', note: 'в тонике 0,250% - в двадцать пять раз больше' },
      { name: 'Экстракт листьев зелёного чая', dose: '0,5 ppm', note: 'назван на этикетке' },
      { name: 'Шестнадцать растительных', dose: 'по 0,1 ppm', note: 'включая девять экстрактов Black Complex' },
      { name: 'Медный трипептид-1', dose: '0,005 ppm', note: 'пять частей на миллиард - минимум в линейке' },
    ],
    footnote:
      'Салициловая кислота - настоящий кератолитик в рабочих концентрациях, а 99 частей на миллион таковой не является. Так что шелушение и налёт, которые этот продукт снимает, снимают спирт и гликоль, а не кислота - и это нормально, потому что они справляются с этим очень хорошо. А если из этой линии вам нужен медный пептид, ампула Hair Solution несёт его в тысячу раз концентрированнее.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Палочка, пробор, втирать с усилием. Не смывать.',
    frequency: 'Оставить на 5 минут · не смывать',
    steps: [
      {
        title: 'Отлейте около 5 мл',
        body: 'В небольшой стакан или цилиндр, а не работайте из флакона. Так остальной флакон остаётся чистым, и палочку можно пропитать как следует.',
      },
      {
        title: 'Пропитайте ватную палочку',
        body: 'Погружайте, пока она не станет действительно мокрой, а не влажной. Сухая палочка тянет кожу и не несёт достаточно раствора, чтобы срезать жир.',
      },
      {
        title: 'Держите близко к головке и втирайте с усилием',
        body: 'Возьмите палочку сразу под головкой, чтобы можно было приложить реальное давление, и обрабатывайте пробор, а не промакивайте его. Инструкция производителя - втирать «довольно энергично», и это не артефакт перевода: шаг механический не меньше, чем химический.',
      },
      {
        title: 'Помассируйте и подождите пять минут',
        body: 'Обработайте пробор за пробором, затем помассируйте кожу головы и оставьте раствор на пять минут. Не смывайте.',
      },
      {
        title: 'Затем Hair Solution, если вы его используете',
        body: 'На упаковке Hair Solution следует после пятиминутной выдержки. Если вы используете полный профессиональный протокол, следуйте отдельной инструкции набора или устройства.',
      },
    ],
    note:
      'Держите средство вдали от глаз и слизистых. Используйте только на неповреждённой коже головы, никогда после микронидлинга или на уже проколотой коже. Дайте коже высохнуть до контакта с теплом или открытым огнём и используйте средство в течение шести месяцев после открытия.',
  },

  quality: {
    eyebrow: 'Подтверждённое качество',
    title: 'Проверено от pH до наполнения',
    intro:
      'Готовый раствор проверяют на стабильность, микробиологическую чистоту, pH и объём наполнения. Его зарегистрированная косметическая функция - освежение кожи головы.',
    rows: [
      { label: 'Внешний вид', value: 'Прозрачная жидкость' },
      { label: 'pH', value: '4,31 при 25 °C, в пределах спецификации 4,00-5,00' },
      { label: 'Стабильность', value: 'Проходит при 50 °C' },
      { label: 'Бактерии', value: 'Менее 10 КОЕ/мл при допустимых 100' },
      { label: 'Плесени и дрожжи', value: 'Менее 10 КОЕ/мл при допустимых 100' },
      { label: 'Наполнение', value: '100,33 мл при заявленных 100 мл' },
      { label: 'Срок годности', value: 'Три года невскрытым' },
      { label: 'Категория', value: 'Уход за волосами' },
      { label: 'Не смывается', value: 'Оценён как несмываемый продукт' },
    ],
    patch:
      'Тест в деле - патч-тест на кожное раздражение, проведённый независимой лабораторией, и он вернулся как «не раздражающий», что стоит знать, учитывая, что треть флакона - спирт. Оценщик добавляет ту же оговорку, что и в остальной линии: число добровольцев не было статистически значимым. Был также проведён тест применения на панели из 20 человек, но результатов по нему в имеющихся документах нет, поэтому мы ничего не заявляем. Исследования эффективности нет.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что во флаконе',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Содержит 33,6% денатурированного спирта. Горюч - держите вдали от открытого огня и дайте коже головы высохнуть до фена или утюжка.',
      'Содержит 0,9% ментола и 0,8% ментил лактата. Будет ощущаться сильный холод.',
      'Только для наружного применения на кожу головы. Не смывается.',
      'Для взрослых. Не использовать детям младше трёх лет.',
      'Не наносить на повреждённую, обожжённую солнцем, свежевыбритую или воспалённую кожу головы.',
      'Не наносить после микронидлинга или на уже проколотую иглами кожу.',
      'Держите подальше от глаз и слизистых; при попадании тщательно промойте прохладной водой.',
      'Не антисептик. Не полагайтесь на него для стерилизации чего-либо.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Хранить вне доступа детей. В нём есть горькая добавка, но это по-прежнему на треть спирт.',
      'Использовать в течение шести месяцев после открытия. Хранить в прохладном сухом месте вдали от прямого солнца.',
    ],
    note:
      'Упаковка подтверждает наружное применение, меры для глаз и слизистых, запрет для детей младше трёх лет, действия при реакции, хранение в прохладном сухом месте и срок шесть месяцев после открытия.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '100 мл' },
      { label: 'Текстура', value: 'Прозрачная жидкость, как вода' },
      { label: 'Категория', value: 'Уход за волосами' },
      { label: 'Для чего', value: 'Глубокое косметическое очищение и освежение неповреждённой кожи головы' },
      { label: 'Спирт', value: 'Alcohol denat. 33,600% - горюч' },
      { label: 'Растворители', value: 'Пропиленгликоль 11,994%, PEG-60 гидрогенизированное касторовое масло 2,000%' },
      { label: 'Охлаждение', value: 'Ментол 0,900% + ментил лактат 0,800% = 1,700%, больше всех в линейке' },
      { label: 'Салициловая кислота', value: '0,00990% (99 ppm) - не кератолитическая доза' },
      { label: 'Следово', value: 'Зелёный чай 0,5 ppm, пятнадцать других растительных экстрактов по 0,1 ppm, медный трипептид-1 5 ppb' },
      { label: 'Увлажнитель', value: 'Бетаин 0,100%' },
      { label: 'Консервация', value: 'Феноксиэтанол 0,200%, хлорфенезин 0,150%, плюс спирт' },
      { label: 'pH', value: '4,00-5,00 (4,31 в измеренной партии)' },
      { label: 'Нанесение', value: 'Ватной палочкой, затем массаж и выдержка 5 минут. Не смывать' },
      { label: 'Тестирование', value: 'Патч-тест, не раздражающий. Тест применения на 20 человек без записанных результатов' },
      { label: 'После открытия', value: 'Использовать в течение 6 месяцев' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Это вообще пилинг?',
        a: 'Не в том смысле, о котором вы, скорее всего, думаете. AHA в нём нет, а салициловая кислота - 99 частей на миллион, что не отшелушивает ничего. Шелушение и налёт здесь снимают 33,6% спирта с 12% пропиленгликоля, растворяющие их, и палочка, стирающая их. Это работает, и работает быстро - просто это очищение, а не химическое отшелушивание, и «пилинг» - название продукта у производителя, а не описание механизма.',
      },
      {
        q: 'Нужен ли он, если я уже пользуюсь шампунем?',
        a: 'Шампунь - ежедневное смываемое очищение. Этот раствор - более концентрированный несмываемый вариант для периодического глубокого очищения и яркого охлаждающего ощущения перед Hair Solution. Упаковка не требует микронидлинга.',
      },
      {
        q: 'Он высушит кожу головы?',
        a: 'При использовании по назначению - перед процедурой, а не ежедневно - нет, потому что вы не оставляете 33,6% спирта на голове каждый день. Как ежедневный тоник - безусловно высушит, и для этого он не предназначен. Увлажнитель в формуле один, бетаин 0,1%, и он там не для того, чтобы сделать продукт увлажняющим.',
      },
      {
        q: 'Он дезинфицирует кожу головы?',
        a: 'Нет. Это косметическое очищающее и освежающее средство, а не антисептик или стерилизующий продукт. Не наносите его после игл и не полагайтесь на него для профилактики инфекции.',
      },
      {
        q: 'Насколько он холоднее шампуня?',
        a: 'Холоднее в использовании. У шампуня больше ментола на бумаге, 1,120% против 0,900%, но здесь больше охлаждающего агента суммарно - 1,7%, - и попадает он на кожу, с которой только что сняли жир, без воды, которая бы разбавила. Большинству это кажется самым резким ощущением в линии.',
      },
      {
        q: 'Почему медный пептид на этикетке, если его почти нет?',
        a: 'Потому что списки ингредиентов на коробках следуют последовательности производителя, а не количеству во флаконе. Медного трипептида-1 здесь пять частей на миллиард - самая низкая концентрация чего-либо во всей линейке HR³ MATRIX. Он на этикетке; он не причина покупать это. Ампула Hair Solution несёт его в тысячу раз концентрированнее.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const SCALP_PEELING_COPY: Record<Locale, ScalpPeelingCopy> = { en: EN, ar: AR, ru: RU }

export function getScalpPeelingCopy(locale: string | undefined): ScalpPeelingCopy {
  return SCALP_PEELING_COPY[(locale as Locale) ?? 'en'] ?? SCALP_PEELING_COPY.en
}

/** The ampoule it precedes, the kit that pairs them, then the daily products. */
export const COMPANION_PRODUCT_IDS = ['45', '47', '44', '43'] as const
