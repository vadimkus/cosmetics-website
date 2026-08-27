/**
 * Bespoke copy for the REVITA GLOW BB CREAM page (product 63).
 *
 * Same self-contained per-locale pattern as biomesoCopy.ts, so the dedicated
 * layout ships EN/AR/RU without adding ~140 keys to the shared messages
 * bundles.
 *
 * SOURCING RULE FOR THIS FILE - every figure below traces to one of:
 *   - Intertek formula PDFs (Registration/Intertek/GENOSYS REVITA GLOW BB
 *     CREAM/{Bright_01,Natural_02}/Formula-...pdf): the four UV filters and
 *     their percentages, Niacinamide 2.00001%, Adenosine 0.04%, Tocopheryl
 *     Acetate 0.1%, Butylene Glycol 10.06%, the eight botanical extracts at
 *     0.005% (Tremella 0.001%), and the ten vitamins - eight of which sit at
 *     0.000001%.
 *   - Intertek artwork PDF (outer carton, #01 and #02): "A natural coverage
 *     cream (SPF38 PA+++)", the Korean triple-functional registration
 *     [자외선 차단 · 미백 · 주름개선], "DERMATOLOGICALLY TESTED", NET WT. 50g,
 *     PAO 12M, the full precaution text and the complete INCI declaration.
 *   - Intertek COA (batch SW108 #01 Bright, SW109 #02 Natural, both packaged
 *     30 Sep 2025, expiry 29 Sep 2028): pH 6.51/6.46, viscosity 70,000/76,900
 *     cPs, specific gravity 1.086/1.085, net 50.50 g/50.28 g, total plate and
 *     mould/yeast counts under 10 cfu/g.
 *   - Certificate of Free Sale 2026-01512, Korea Cosmetic Association,
 *     19 Jan 2026, issued for export to the United Arab Emirates.
 *   - Dubai Municipality Montaji registration (docs/Montaji_Product_Registration_
 *     Letter_normalized.csv): #01 Bright CPRE-260126-192507 and #02 Natural
 *     CPRE-280126-193239, both Approved, valid to Jan 2031. The page states the
 *     registration without the CPRE codes; a shopper cannot use them.
 *
 * DELIBERATE OMISSIONS AND CORRECTIONS - read before editing:
 *
 *   - "SEVEN HERBS" AND "EIGHT EXTRACTS" ARE BOTH RIGHT. Do not "fix" either.
 *     The INCI declares eight botanical extracts: Camellia Sinensis,
 *     Rosmarinus Officinalis, Centella Asiatica, Tremella Fuciformis,
 *     Chamomilla Recutita, Polygonum Cuspidatum, Scutellaria Baicalensis and
 *     Glycyrrhiza Uralensis. The manufacturer brands the marketing complex
 *     "7 Herb Complex" (DTS MG product deck, comparison table) because it
 *     files Tremella under hydrating actives, not herbs - the deck's own
 *     ingredient pages list Tremella twice, once under Skin Revitalizing and
 *     again under Hydrating, which is the only arithmetic that reconciles the
 *     two numbers. So the gallery graphics saying "7 Herbs" are quoting the
 *     brand correctly. This file counts extracts, not brand names, and says
 *     eight; if you ever print the branded complex name, print it as seven.
 *
 *   - THE PUFF IS REAL BUT IS NOT IN THIS BOX. The DTS MG deck promotes a
 *     "dedicated puff" with a micro air-cell structure for this product, so do
 *     not claim the puff language belongs to the cushion - it does not. What
 *     the carton artwork shows is a 50 g tube and nothing else: no accessory,
 *     no applicator, net weight 50 g, cap PP. The official application text is
 *     "apply to the face after skincare, blend well", and the Korean adds
 *     "가볍게 두드려" - lightly tap to finish. So: tapping is a legitimate
 *     motion, the puff is a real accessory the brand sells around the product,
 *     and neither is included here. Say that, and do not promise a puff.
 *
 *   - Eight of the ten vitamins are dosed at 0.000001% - one part per billion.
 *     The vitamin complex is therefore described as a formulation feature and
 *     never credited with an effect. The two vitamins at functional levels
 *     (Niacinamide 2%, Tocopheryl Acetate 0.1%) are named with their numbers.
 *
 *   - No "medical-grade" and no "treatment-grade" anywhere. Neither appears in
 *     any Intertek document or in the DTS MG deck, and the deck in fact rates
 *     this the lightest coverage of the three GENOSYS balms (★★★ against the
 *     cushion's ★★★★★), so "treatment-grade coverage" on s3.jpg overstates it.
 *
 *   - "All-day, no transfer" IS supported, but by the deck rather than by
 *     Intertek: its Film Gel Network step claims a flexible gel film that sets
 *     "without smudging or transfer" and holds "all day without dryness".
 *     This page still does not lead with it, because it is a manufacturer
 *     performance claim with no study behind it, but it is not a fabrication
 *     and does not need to be scrubbed from the gallery.
 *
 *   - There is NO clinical efficacy study on file for product 63, so this page
 *     carries no percentage-improvement figures anywhere. The proof section is
 *     laboratory specification, which is verifiable.
 *
 *   - `fullInci` below was transcribed from the Intertek artwork declaration
 *     because the stored INCI was missing 1,2-Hexanediol and the entire
 *     fragrance block (Parfum, lemon and bitter orange peel oils, linalool,
 *     linalyl acetate, citronellol, tetramethyl acetyloctahydronaphthalenes and
 *     hydroxycitronellal). The record was corrected in Aug 2026 and now matches
 *     token for token, so the page reads the record and this is a fallback.
 */

export type RevitaGlowLocale = 'en' | 'ar' | 'ru'

export interface RevitaGlowShade {
  /** Must match the `colors` values in data/productConfig.ts - the cart keys
   *  its lines on this string. */
  value: 'Bright' | 'Natural'
  code: string
  name: string
  /** Sampled from the shade swatches in /images/revita/s2.jpg. */
  hex: string
  tagline: string
  body: string
}

export interface RevitaGlowCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  shadeLabel: string
  shadeHelp: string
  shadeSelected: string
  shadeRequired: string
  shades: RevitaGlowShade[]
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
  functions: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
  }
  mechanism: {
    eyebrow: string
    title: string
    intro: string
    steps: Array<{ step: string; title: string; body: string }>
    note: string
  }
  filters: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; amount: string; role: string }
    rows: Array<{ name: string; amount: string; role: string }>
    note: string
  }
  shadeSection: {
    eyebrow: string
    title: string
    intro: string
    sameFormula: string
    figureAlt: string
  }
  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }
  video: {
    eyebrow: string
    title: string
    body: string
    unsupported: string
  }
  actives: {
    eyebrow: string
    title: string
    intro: string
    fullInci: string
    fullInciNote: string
    fragranceNote: string
  }
  lab: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    disclaimer: string
  }
  safety: {
    eyebrow: string
    title: string
    points: string[]
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
    brochure: string
  }
  backToProducts: string
}

/** The complete declaration from the Intertek artwork, identical for both
 *  shades. Kept in one place so all three locales stay in sync. */
const FULL_INCI =
  'Aqua (Water), Butylene Glycol, Ethylhexyl Methoxycinnamate, Titanium Dioxide, ' +
  'Ethylhexyl Salicylate, Phenyl Trimethicone, Coco-Caprylate/Caprate, ' +
  'Hydrogenated Polyisobutene, Niacinamide, Cetyl PEG/PPG-10/1 Dimethicone, Zinc Oxide, ' +
  'Dipentaerythrityl Hexahydroxystearate/Hexastearate/Hexarosinate, Polyglyceryl-4 Isostearate, ' +
  'Dimethicone, Disteardimonium Hectorite, Cetyl Dimethicone, Octyldodecyl Stearoyl Stearate, ' +
  'Retinyl Palmitate, Riboflavin, Biotin, Ascorbic Acid, Carnitine HCl, Tocopherol, ' +
  'Thiamine HCl, Pantothenic Acid, Folic Acid, Tocopheryl Acetate, Adenosine, Glycerin, ' +
  'CI 77492, CI 77491, CI 77499, Hydrolyzed Hyaluronic Acid, Cholesterol, ' +
  'Camellia Sinensis Leaf Extract, Rosmarinus Officinalis (Rosemary) Leaf Extract, ' +
  'Centella Asiatica Extract, Tremella Fuciformis (Mushroom) Extract, ' +
  'Chamomilla Recutita (Matricaria) Flower Extract, Polygonum Cuspidatum Root Extract, ' +
  'Scutellaria Baicalensis Root Extract, Glycyrrhiza Uralensis (Licorice) Root Extract, ' +
  'Erythritol, Hydrogenated Lecithin, Hydroxyethylcellulose, 1,2-Hexanediol, ' +
  'Caprylhydroxamic Acid, Magnesium Sulfate, Dextrin, Pullulan, Mica, Trihydroxystearin, ' +
  'Aluminum Hydroxide, Triethoxycaprylylsilane, Caprylyl Glycol, ' +
  'Diphenylsiloxy Phenyl Trimethicone, Dimethicone/Vinyl Dimethicone Crosspolymer, ' +
  'Methyl Methacrylate Crosspolymer, Dimethicone Crosspolymer, Parfum (Fragrance), ' +
  'Citrus Limon (Lemon) Peel Oil, Linalool, Linalyl Acetate, Limonene, ' +
  'Citrus Aurantium Peel Oil, Citronellol, Tetramethyl acetyloctahydronaphthalenes, ' +
  'Hydroxycitronellal.'

const EN: RevitaGlowCopy = {
  eyebrow: 'Revita Glow · VBC Professional',
  headline: 'Sun protection you would actually wear every day.',
  subheadline:
    'A tinted daily base registered in Korea as a triple-functional cosmetic - UV protection, brightening and wrinkle improvement, in one 50 g tube. Four filters carry the SPF 38 PA+++ rating, niacinamide sits at 2%, and the coverage stays light enough to read as skin rather than makeup.',
  heroBullets: [
    'SPF 38 PA+++ from four filters - two organic, two mineral',
    'Niacinamide at 2% and adenosine at 0.04%, both registered functional actives',
    'Two shades, one identical formula - only the pigment load differs',
    'Dermatologically tested · 50 g · 12 months after opening',
  ],
  badges: ['Made in Korea', '50 g · 12M PAO', 'Korean triple-functional cosmetic', 'Official UAE distributor'],
  shadeLabel: 'Choose your shade',
  shadeHelp: 'Same formula in both. Only the pigment differs.',
  shadeSelected: 'Selected',
  shadeRequired: 'Pick a shade before adding to the bag.',
  shades: [
    {
      value: 'Bright',
      code: '#01',
      name: 'Bright',
      hex: '#e9ccb6',
      tagline: 'The lighter one',
      body: 'Carries more titanium dioxide and less iron oxide, so it sits brighter and more luminous. Suits fair to light-medium skin.',
    },
    {
      value: 'Natural',
      code: '#02',
      name: 'Natural',
      hex: '#c99569',
      tagline: 'The warmer one',
      body: 'More iron oxide and mica, less titanium dioxide. Deeper and warmer, with a softer glow. Suits light-medium to medium skin.',
    },
  ],
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',
  stats: [
    { value: 'SPF 38', label: 'PA+++ broad-spectrum, every single day' },
    { value: '4', label: 'UV filters, two organic and two mineral' },
    { value: '2%', label: 'Niacinamide, the registered brightening active' },
    { value: '10', label: 'Vitamins in the complex, alongside eight botanical extracts' },
  ],
  functions: {
    eyebrow: 'Registered in Korea',
    title: 'Three functions, not one',
    intro:
      'Korea does not let a cosmetic claim UV protection, brightening and wrinkle improvement unless there is a named active at a set concentration behind each one. This cream is registered for all three.',
    cards: [
      {
        title: 'Protects from UV',
        body: 'Ethylhexyl methoxycinnamate at 7.5% and ethylhexyl salicylate at 5% absorb UV; titanium dioxide and zinc oxide scatter and reflect it. Together they earn its SPF 38 PA+++ rating.',
      },
      {
        title: 'Helps brighten',
        body: 'Niacinamide at 2% is the brightening active named on the filing. It is also the highest-concentration active in the whole formula, and it supports the barrier while it works on tone.',
      },
      {
        title: 'Helps improve wrinkles',
        body: 'Adenosine at 0.04%, the concentration Korea sets for a wrinkle-improvement claim. It works by increasing collagen synthesis and stimulating fibroblasts, so there is treatment happening under the coverage.',
      },
      {
        title: 'Evens tone the moment it goes on',
        body: 'Three iron oxides and mica do the optical work. Coverage is buildable and deliberately natural, so it works as a base under foundation or in place of one.',
      },
    ],
  },
  mechanism: {
    eyebrow: 'How it behaves on skin',
    title: 'Three things happening at once',
    intro:
      'Most tinted bases do one job: cover. This one is built in three layers, and only the top one is about colour.',
    steps: [
      {
        step: '01',
        title: 'Smoothing and fitting',
        body: 'Before any colour reads, the base has to sit flush. A smoothing system softens surface irregularities and a high-adhesion system holds the layer against the skin instead of letting it settle into texture.',
      },
      {
        step: '02',
        title: 'Revitalising',
        body: 'Underneath the coverage, the ten vitamins, the herbal complex and the naturally derived humectants go to work. This is the layer that makes it a treatment base rather than a foundation with SPF in it.',
      },
      {
        step: '03',
        title: 'Film gel network',
        body: 'A transparent, flexible gel film sets over the top. It is what stops the finish moving through the day and what keeps water and actives from evaporating straight back off.',
      },
    ],
    note: 'It is the third layer that gets you through a Dubai day. The film sets instead of staying wet on the surface, so the finish stops moving and the hydration underneath stays put rather than flashing off in the heat.',
  },
  filters: {
    eyebrow: 'The filter system',
    title: 'Two that absorb, two that reflect',
    intro:
      'Hybrid filter systems wear more comfortably than all-mineral ones and are far less prone to a white cast - which matters when the base is meant to disappear into your skin. Here is what each of the four contributes.',
    columns: { name: 'Filter', amount: 'Concentration', role: 'Type' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7.50%', role: 'Organic UV absorber' },
      { name: 'Titanium Dioxide', amount: '7.13% / 6.18%', role: 'Mineral filter and white pigment' },
      { name: 'Ethylhexyl Salicylate', amount: '5.00%', role: 'Organic UV absorber' },
      { name: 'Zinc Oxide', amount: '1.96%', role: 'Mineral broad-spectrum filter' },
    ],
    note:
      'Titanium dioxide is the one ingredient that differs between the shades - 7.13% in #01 Bright against 6.18% in #02 Natural - because it doubles as the white pigment. Everything else in the two formulas is identical, filters included.',
  },
  shadeSection: {
    eyebrow: 'Two shades',
    title: 'Bright or Natural',
    intro:
      'Both are warm-toned and both are buildable. The choice is about depth, not undertone.',
    sameFormula:
      'Identical actives, identical SPF, identical botanicals. The only difference between #01 and #02 is the iron oxide, mica and titanium dioxide load.',
    figureAlt:
      'GENOSYS REVITA GLOW BB CREAM - shade comparison between #01 Bright and #02 Natural',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'The last step of the morning',
    frequency: 'Every morning · after skincare',
    steps: [
      {
        title: 'Finish your skincare first',
        body: 'Apply after serum and moisturiser. This is the final step before you go out, not something to layer more product over.',
      },
      {
        title: 'Take less than you think',
        body: 'The pigment is concentrated. Start small and add - building up is far easier than lifting excess back off.',
      },
      {
        title: 'Blend outward, then press',
        body: 'Spread evenly with fingertips, a sponge or a brush, following the direction of the skin. Finish by patting lightly so it settles instead of sitting on the surface.',
      },
      {
        title: 'Build only where you need it',
        body: 'Add a second thin layer over redness or uneven patches rather than thickening the whole face. Thin layers are what keep it reading as skin.',
      },
    ],
    note:
      'SPF ratings are measured at a thicker layer than anyone applies a tinted base, so for everyday sun - the commute, the school run, a desk by the window - this does the job. For hours out in direct sun, put a dedicated sunscreen underneath and reapply. That is true of every tinted base, not just this one.',
  },
  video: {
    eyebrow: 'In motion',
    title: 'Texture and finish',
    body: 'How the cream breaks down on skin, how far a small amount goes, and where the glow actually sits.',
    unsupported: 'Your browser does not support the video tag.',
  },
  actives: {
    eyebrow: 'The formula',
    title: 'Every active, and what it actually does',
    intro:
      'Every active in the formula, and what each one is doing while you wear it.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote:
      'Every ingredient, in the same order as the box in your hand. Identical for #01 Bright and #02 Natural apart from the pigments.',
    fragranceNote:
      'Lightly fragranced. Parfum is on the list along with lemon and bitter orange peel oils, and the allergens linalool, linalyl acetate, limonene, citronellol and hydroxycitronellal. Worth a look first if your skin reacts to fragrance.',
  },
  lab: {
    eyebrow: 'Quality',
    title: 'Made and tested in Korea',
    intro:
      'No batch leaves the factory until it passes, and it arrives in Dubai cleared for sale here as well as in Korea.',
    rows: [
      { label: 'Skin testing', value: 'Dermatologically tested' },
      { label: 'Purity', value: 'Ten times cleaner than the limit allows - under 10 cfu/g against a permitted 100' },
      { label: 'Shelf life', value: 'Three years sealed · 12 months after opening' },
      { label: 'Cleared for the UAE', value: 'Registered with Dubai Municipality on the Montaji system, on top of the Korean certificate of free sale' },
    ],
    disclaimer:
      'Daily SPF is what protects the result you build with it. Stubborn pigmentation and melasma respond best when a dermatologist works alongside your routine.',
  },
  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'For external use only. Avoid contact with the eyes and mucous membranes; if contact occurs, rinse thoroughly with cool water.',
      'Do not apply directly around the eyes.',
      'Stop use and consult a doctor if redness, swelling or irritation occurs.',
      'Avoid applying to broken or damaged skin.',
      'Contains fragrance, including linalool, linalyl acetate, limonene, citronellol and hydroxycitronellal.',
      'Store in a cool, dry place away from direct sunlight, and keep out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton. Use within 12 months of opening.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'What it works with',
    intro:
      'Revita Glow is the last step. These are the products the GENOSYS protocol puts before it, so the base has something to sit on.',
    thisProduct: 'You are here',
    viewProduct: 'View product',
    chooseOptions: 'Choose options',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Which shade should I choose?',
        a: 'Both are warm-toned, so the decision is depth. #01 Bright suits fair to light-medium skin and leaves the more luminous finish. #02 Natural suits light-medium to medium skin and reads closer to your own tone. If you are genuinely between the two, #02 is the safer pick - a shade that is too light shows the mismatch far more than one that is slightly deep.',
      },
      {
        q: 'Is this enough sun protection on its own?',
        a: 'For everyday exposure, yes. SPF 38 PA+++ is a real rating and it covers commuting, errands and a desk near a window. If you will be out in direct sun for hours, layer a dedicated sunscreen underneath and reapply through the day - that applies to any tinted base, not just this one.',
      },
      {
        q: 'Does it contain fragrance?',
        a: 'Yes, a light one. Parfum is on the ingredient list together with lemon peel oil, bitter orange peel oil, and the allergens linalool, linalyl acetate, limonene, citronellol and hydroxycitronellal. If fragrance is something your skin reacts to, that is the group to check.',
      },
      {
        q: 'Is this the same as the GENOSYS BB Cushion?',
        a: 'No, they are different products. This is a 50 g tube; the Skin Caring Blemish Balm Cushion is a compact with a refill and a heavier SPF 50+ PA++++ formula. GENOSYS does make a dedicated air-cell puff that pairs with this cream, and tapping the last layer in with one is the finish the brand recommends . The puff is sold separately, and the tube blends perfectly well with fingertips, a sponge or a brush.',
      },
      {
        q: 'How do the two shades differ in the formula?',
        a: 'Only in the colourants. The iron oxides, mica and titanium dioxide are dosed differently. The UV filters, niacinamide, adenosine, vitamins and the eight botanical extracts are identical in both.',
      },
      {
        q: 'Does it need to be removed properly?',
        a: 'Yes. It contains UV filters, film formers and pigment, so cleanse it off at the end of the day rather than rinsing with water alone.',
      },
    ],
  },
  details: {
    eyebrow: 'Details',
    title: 'Specification',
    rows: [
      { label: 'Format', value: 'Blemish balm cream · 50 g tube' },
      { label: 'Shades', value: '#01 Bright · #02 Natural' },
      { label: 'UV rating', value: 'SPF 38 PA+++' },
      { label: 'Registered functions', value: 'UV protection · brightening · wrinkle improvement' },
      { label: 'Skin type', value: 'All skin types' },
      { label: 'Tested', value: 'Dermatologically tested' },
      { label: 'Period after opening', value: '12 months' },
      { label: 'Origin', value: 'Made in Korea for DTS MG Co., Ltd.' },
    ],
    brochure: 'Download the Revita Glow product guide',
  },
  backToProducts: 'Products',
}

const AR: RevitaGlowCopy = {
  eyebrow: 'ريفيتا جلو · VBC Professional',
  headline: 'حماية من الشمس ترغبين فعلاً في استخدامها كل يوم.',
  subheadline:
    'كريم أساس ملوّن للاستخدام اليومي، مسجّل في كوريا كمستحضر ثلاثي الوظيفة - حماية من الأشعة فوق البنفسجية، وتفتيح، وتحسين التجاعيد، في أنبوب واحد سعة ٥٠ غ. أربعة فلاتر تمنح تصنيف SPF 38 PA+++، والنياسيناميد بتركيز ٢٪، وتغطية خفيفة تبدو كبشرة لا كمكياج.',
  heroBullets: [
    'SPF 38 PA+++ من أربعة فلاتر - اثنان عضويان واثنان معدنيان',
    'نياسيناميد ٢٪ وأدينوزين ٠٫٠٤٪، وكلاهما مادة فعّالة وظيفية مسجّلة',
    'درجتان لونيتان بتركيبة واحدة متطابقة - الاختلاف في الصبغة فقط',
    'مختبر جلدياً · ٥٠ غ · ١٢ شهراً بعد الفتح',
  ],
  badges: ['صنع في كوريا', '٥٠ غ · ١٢ شهراً بعد الفتح', 'مستحضر كوري ثلاثي الوظيفة', 'الموزّع الرسمي في الإمارات'],
  shadeLabel: 'اختاري درجتك',
  shadeHelp: 'التركيبة نفسها في الاثنتين. الاختلاف في الصبغة فقط.',
  shadeSelected: 'المحددة',
  shadeRequired: 'اختاري درجة قبل الإضافة إلى الحقيبة.',
  shades: [
    {
      value: 'Bright',
      code: '#01',
      name: 'Bright',
      hex: '#e9ccb6',
      tagline: 'الأفتح',
      body: 'تحتوي على نسبة أعلى من ثاني أكسيد التيتانيوم وأقل من أكاسيد الحديد، فتبدو أكثر إشراقاً ونضارة. تناسب البشرة الفاتحة إلى الفاتحة المتوسطة.',
    },
    {
      value: 'Natural',
      code: '#02',
      name: 'Natural',
      hex: '#c99569',
      tagline: 'الأدفأ',
      body: 'أكاسيد حديد وميكا أكثر، وثاني أكسيد تيتانيوم أقل. أعمق وأدفأ مع لمعان أنعم. تناسب البشرة الفاتحة المتوسطة إلى المتوسطة.',
    },
  ],
  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّلي الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق ١٬٠٠٠ درهم · يُشحن من دبي',
  stats: [
    { value: 'SPF 38', label: 'PA+++ حماية واسعة الطيف، كل يوم' },
    { value: '٤', label: 'فلاتر للأشعة فوق البنفسجية، اثنان عضويان واثنان معدنيان' },
    { value: '٢٪', label: 'نياسيناميد، المادة الفعّالة المسجّلة للتفتيح' },
    { value: '١٠', label: 'فيتامينات في المركّب، إلى جانب ثمانية مستخلصات نباتية' },
  ],
  functions: {
    eyebrow: 'مسجّل في كوريا',
    title: 'ثلاث وظائف، لا واحدة',
    intro:
      'لا تسمح كوريا لأي مستحضر تجميل بادعاء الحماية من الشمس والتفتيح وتحسين التجاعيد ما لم تكن خلف كل واحد منها مادة فعّالة محددة بالاسم وبتركيز معيّن. هذا الكريم مسجّل للثلاثة معاً.',
    cards: [
      {
        title: 'يحمي من الأشعة فوق البنفسجية',
        body: 'إيثيل هكسيل ميثوكسي سينامات بنسبة ٧٫٥٪ وإيثيل هكسيل ساليسيلات بنسبة ٥٪ يمتصّان الأشعة؛ وثاني أكسيد التيتانيوم وأكسيد الزنك يعكسانها ويشتّتانها. معاً يمنحانه تصنيف SPF 38 PA+++.',
      },
      {
        title: 'يساعد على التفتيح',
        body: 'النياسيناميد بتركيز ٢٪ هو المادة الفعّالة للتفتيح المذكورة في التسجيل. وهو أيضاً أعلى مادة فعّالة تركيزاً في التركيبة بأكملها، ويدعم حاجز البشرة في الوقت نفسه.',
      },
      {
        title: 'يساعد على تحسين التجاعيد',
        body: 'الأدينوزين بتركيز ٠٫٠٤٪، وهو التركيز الذي تحدده كوريا لادعاء تحسين التجاعيد. يعمل عبر زيادة تصنيع الكولاجين وتحفيز الخلايا الليفية، أي أن هناك معالجة تجري تحت طبقة التغطية.',
      },
      {
        title: 'يوحّد اللون فور تطبيقه',
        body: 'ثلاثة أكاسيد حديد والميكا تقوم بالعمل البصري. التغطية قابلة للبناء وطبيعية عن قصد، فتصلح كأساس تحت كريم الأساس أو بديلاً عنه.',
      },
    ],
  },
  mechanism: {
    eyebrow: 'كيف يتصرّف على البشرة',
    title: 'ثلاثة أمور تحدث في آن واحد',
    intro:
      'معظم الكريمات الملوّنة تؤدي مهمة واحدة: التغطية. أما هذا فمبني على ثلاث طبقات، والعليا وحدها هي المعنيّة باللون.',
    steps: [
      {
        step: '٠١',
        title: 'التنعيم والالتصاق',
        body: 'قبل أن يظهر أي لون، يجب أن تستقر الطبقة مستوية. نظام تنعيم يخفّف تفاوت سطح البشرة، ونظام التصاق عالي يثبّت الطبقة على البشرة بدل أن تترسّب داخل مسامها وخطوطها.',
      },
      {
        step: '٠٢',
        title: 'إعادة الحيوية',
        body: 'تحت طبقة التغطية، تبدأ الفيتامينات العشرة والمركّب النباتي والمرطّبات المشتقّة طبيعياً بالعمل. هذه هي الطبقة التي تجعله أساساً علاجياً لا مجرّد كريم أساس بعامل حماية.',
      },
      {
        step: '٠٣',
        title: 'شبكة الفيلم الجيلي',
        body: 'يتشكّل فوق الطبقات غشاء جيلي شفّاف ومرن. وهو ما يمنع تحرّك اللمسة النهائية خلال اليوم، ويحدّ من تبخّر الماء والمواد الفعّالة من جديد.',
      },
    ],
    note: 'الطبقة الثالثة هي التي تُبقيك متماسكة طوال يوم في دبي. يجفّ الغشاء بدل أن يبقى رطباً على السطح، فتتوقّف اللمسة النهائية عن التحرّك، ويبقى الترطيب تحته بدل أن يتبخّر في الحرارة.',
  },
  filters: {
    eyebrow: 'نظام الفلاتر',
    title: 'اثنان يمتصّان واثنان يعكسان',
    intro:
      'أنظمة الفلاتر الهجينة أكثر راحة من الأنظمة المعدنية بالكامل، وأقل ميلاً بكثير لترك أثر أبيض - وهذا مهم حين يُفترض بالكريم أن يختفي في بشرتك. وهذا ما يقدّمه كل فلتر من الأربعة.',
    columns: { name: 'الفلتر', amount: 'التركيز', role: 'النوع' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '٧٫٥٠٪', role: 'ماص عضوي للأشعة' },
      { name: 'Titanium Dioxide', amount: '٧٫١٣٪ / ٦٫١٨٪', role: 'فلتر معدني وصبغة بيضاء' },
      { name: 'Ethylhexyl Salicylate', amount: '٥٫٠٠٪', role: 'ماص عضوي للأشعة' },
      { name: 'Zinc Oxide', amount: '١٫٩٦٪', role: 'فلتر معدني واسع الطيف' },
    ],
    note:
      'ثاني أكسيد التيتانيوم هو المكوّن الوحيد الذي يختلف بين الدرجتين - ٧٫١٣٪ في ٠١ Bright مقابل ٦٫١٨٪ في ٠٢ Natural - لأنه يعمل أيضاً كصبغة بيضاء. وكل ما عدا ذلك في التركيبتين متطابق، بما في ذلك الفلاتر.',
  },
  shadeSection: {
    eyebrow: 'درجتان',
    title: 'Bright أم Natural',
    intro: 'كلتاهما بدرجة دافئة وكلتاهما قابلة للبناء. الاختيار يتعلق بالعمق لا بالتدرّج اللوني.',
    sameFormula:
      'مواد فعّالة متطابقة، وحماية شمسية متطابقة، ومستخلصات نباتية متطابقة. الفرق الوحيد بين ٠١ و٠٢ هو نسبة أكاسيد الحديد والميكا وثاني أكسيد التيتانيوم.',
    figureAlt: 'جينوسيس ريفيتا جلو بي بي كريم - مقارنة بين الدرجة ٠١ Bright والدرجة ٠٢ Natural',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'الخطوة الأخيرة في الصباح',
    frequency: 'كل صباح · بعد العناية بالبشرة',
    steps: [
      {
        title: 'أنهي روتين العناية أولاً',
        body: 'يُطبّق بعد السيروم والمرطب. هذه هي الخطوة الأخيرة قبل الخروج، وليست طبقة تُوضع فوقها منتجات أخرى.',
      },
      {
        title: 'خذي كمية أقل مما تتوقعين',
        body: 'الصبغة مركّزة. ابدئي بكمية صغيرة ثم أضيفي - البناء التدريجي أسهل بكثير من إزالة الفائض.',
      },
      {
        title: 'وزّعيه للخارج ثم اضغطي',
        body: 'وزّعيه بالتساوي بأطراف الأصابع أو الإسفنجة أو الفرشاة باتجاه ملمس البشرة. ثم اربتي بلطف ليستقر بدل أن يبقى على السطح.',
      },
      {
        title: 'ابني الطبقات حيث تحتاجين فقط',
        body: 'أضيفي طبقة رقيقة ثانية فوق الاحمرار أو المناطق غير الموحّدة بدل تثخين الوجه بالكامل. الطبقات الرقيقة هي ما يبقيه بمظهر البشرة الطبيعية.',
      },
    ],
    note:
      'يُقاس تصنيف الحماية الشمسية عند طبقة أسمك مما يضعه أي أحد من أساس ملوّن، ولذلك فهو يفي بالغرض في التعرّض اليومي - التنقّل، وتوصيل الأطفال، ومكتب بجانب نافذة. أما ساعات تحت الشمس المباشرة فتستدعي واقي شمس مخصصاً تحته مع إعادة التطبيق. وهذا ينطبق على كل أساس ملوّن، لا على هذا وحده.',
  },
  video: {
    eyebrow: 'بالحركة',
    title: 'الملمس والنتيجة النهائية',
    body: 'كيف ينتشر الكريم على البشرة، وإلى أي مدى تكفي كمية صغيرة، وأين يستقر الإشراق فعلياً.',
    unsupported: 'متصفحك لا يدعم تشغيل الفيديو.',
  },
  actives: {
    eyebrow: 'التركيبة',
    title: 'كل مادة فعّالة وما تفعله حقاً',
    intro:
      'كل مادة فعّالة في التركيبة، وما تفعله كل واحدة منها بينما تضعينه.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote:
      'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك. متطابقة للدرجتين ٠١ Bright و٠٢ Natural باستثناء الصبغات.',
    fragranceNote:
      'معطّر بخفّة. العطر (Parfum) مذكور في القائمة إلى جانب زيت قشر الليمون وزيت قشر البرتقال المرّ، ومسببات الحساسية: لينالول، ولينالايل أسيتات، وليمونين، وسيترونيلول، وهيدروكسي سيترونيلال. يستحق نظرة أولى إن كانت بشرتك تتفاعل مع العطور.',
  },
  lab: {
    eyebrow: 'الجودة',
    title: 'صُنع واختُبر في كوريا',
    intro:
      'لا تغادر أي دفعة المصنع قبل أن تجتاز الاختبار، وتصل إلى دبي ومعها ما يثبت ذلك.',
    rows: [
      { label: 'الاختبار الجلدي', value: 'مختبر جلدياً' },
      { label: 'النقاء', value: 'أنظف عشر مرات مما يسمح به الحد - أقل من ١٠ وحدة/غ مقابل ١٠٠ مسموح بها' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات مغلقاً · ١٢ شهراً بعد الفتح' },
      { label: 'مصرّح به للإمارات', value: 'مسجّل لدى بلدية دبي ضمن نظام Montaji، إضافة إلى شهادة البيع الحر الكورية' },
    ],
    disclaimer:
      'الحماية اليومية من الشمس هي ما يحافظ على النتيجة التي تبنينها معه. أما التصبّغات العنيدة والكلف فتستجيب على نحو أفضل عندما يعمل طبيب الجلدية جنباً إلى جنب مع روتينك.',
  },
  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'للاستخدام الخارجي فقط. تجنّبي ملامسة العينين والأغشية المخاطية؛ وعند حدوث تلامس اشطفي جيداً بالماء البارد.',
      'لا يُستخدم مباشرة حول العينين.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'تجنّبي التطبيق على البشرة المجروحة أو المتضررة.',
      'يحتوي على عطر، بما في ذلك لينالول ولينالايل أسيتات وليمونين وسيترونيلول وهيدروكسي سيترونيلال.',
      'يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على عبوة جينوسيس. يُستخدم خلال ١٢ شهراً من الفتح.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'ما الذي يعمل معه',
    intro:
      'ريفيتا جلو هو الخطوة الأخيرة. هذه هي المنتجات التي يضعها بروتوكول جينوسيس قبله، ليكون للأساس ما يستقر عليه.',
    thisProduct: 'أنتِ هنا',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الخيارات',
    fromPrice: 'ابتداءً من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'أي درجة أختار؟',
        a: 'كلتاهما دافئة، فالقرار يتعلق بالعمق. الدرجة ٠١ Bright تناسب البشرة الفاتحة إلى الفاتحة المتوسطة وتترك نتيجة أكثر إشراقاً. والدرجة ٠٢ Natural تناسب البشرة الفاتحة المتوسطة إلى المتوسطة وتبدو أقرب إلى لونك الطبيعي. إذا كنت بين الاثنتين فالدرجة ٠٢ هي الخيار الأأمن - الدرجة الأفتح من اللازم تُظهر عدم التطابق أكثر بكثير من الأغمق قليلاً.',
      },
      {
        q: 'هل هذه حماية كافية من الشمس وحدها؟',
        a: 'للتعرّض اليومي، نعم. تصنيف SPF 38 PA+++ حقيقي ويغطي التنقّل والمشاوير ومكتباً بجانب نافذة. أما إن كنت ستقضين ساعات تحت الشمس المباشرة، فضعي واقي شمس مخصصاً تحته وأعيدي تطبيقه خلال اليوم - وهذا ينطبق على أي أساس ملوّن، لا على هذا وحده.',
      },
      {
        q: 'هل يحتوي على عطر؟',
        a: 'نعم، عطر خفيف. مصرّح به على العبوة إلى جانب زيت قشر الليمون وزيت قشر البرتقال المرّ ومسببات الحساسية: لينالول ولينالايل أسيتات وليمونين وسيترونيلول وهيدروكسي سيترونيلال. إن كانت بشرتك تتفاعل مع العطور، فهذه هي المجموعة التي ينبغي مراجعتها.',
      },
      {
        q: 'هل هو نفسه كوشن جينوسيس؟',
        a: 'لا، هما منتجان مختلفان. هذا أنبوب سعة ٥٠ غ، أما Skin Caring Blemish Balm Cushion فهو علبة كوشن مع عبوة تعبئة وتركيبة أثقل بحماية SPF 50+ PA++++. وجينوسيس تنتج بالفعل إسفنجة ضغط مخصّصة بخلايا هوائية دقيقة تُستخدم مع هذا الكريم، والتربيت بها في الطبقة الأخيرة هو اللمسة التي توصي بها العلامة . والإسفنجة تُباع منفصلة، والأنبوب يمتزج بسهولة بأطراف الأصابع أو الإسفنجة أو الفرشاة.',
      },
      {
        q: 'كيف تختلف الدرجتان في التركيبة؟',
        a: 'في المواد الملوّنة فقط. أكاسيد الحديد والميكا وثاني أكسيد التيتانيوم بنسب مختلفة. أما فلاتر الأشعة والنياسيناميد والأدينوزين والفيتامينات والمستخلصات النباتية الثمانية فمتطابقة في الاثنتين.',
      },
      {
        q: 'هل يحتاج إلى إزالة بعناية؟',
        a: 'نعم. يحتوي على فلاتر للأشعة ومكوّنات مكوّنة للطبقة وصبغات، لذا نظّفي البشرة جيداً في نهاية اليوم بدل الاكتفاء بالماء.',
      },
    ],
  },
  details: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الشكل', value: 'كريم بي بي · أنبوب ٥٠ غ' },
      { label: 'الدرجات', value: '٠١ Bright · ٠٢ Natural' },
      { label: 'تصنيف الحماية', value: 'SPF 38 PA+++' },
      { label: 'الوظائف المسجّلة', value: 'حماية من الأشعة · تفتيح · تحسين التجاعيد' },
      { label: 'نوع البشرة', value: 'جميع أنواع البشرة' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'المدة بعد الفتح', value: '١٢ شهراً' },
      { label: 'المنشأ', value: 'صنع في كوريا لصالح DTS MG Co., Ltd.' },
    ],
    brochure: 'تحميل دليل منتج ريفيتا جلو',
  },
  backToProducts: 'المنتجات',
}

const RU: RevitaGlowCopy = {
  eyebrow: 'Revita Glow · VBC Professional',
  headline: 'Защита от солнца, которую действительно хочется наносить каждый день.',
  subheadline:
    'Тонирующая дневная база, зарегистрированная в Корее как средство тройного функционального действия: защита от УФ, осветление и коррекция морщин - в одной тубе 50 г. Четыре фильтра обеспечивают SPF 38 PA+++, ниацинамид - 2%, а покрытие остаётся достаточно лёгким, чтобы выглядеть кожей, а не макияжем.',
  heroBullets: [
    'SPF 38 PA+++ на четырёх фильтрах - два органических, два минеральных',
    'Ниацинамид 2% и аденозин 0,04% - оба зарегистрированные функциональные активы',
    'Два оттенка, одна и та же формула - различается только пигмент',
    'Дерматологически протестировано · 50 г · 12 месяцев после вскрытия',
  ],
  badges: ['Сделано в Корее', '50 г · 12 мес. после вскрытия', 'Тройное функциональное средство', 'Официальный дистрибьютор в ОАЭ'],
  shadeLabel: 'Выберите оттенок',
  shadeHelp: 'Формула одинаковая. Различается только пигмент.',
  shadeSelected: 'Выбрано',
  shadeRequired: 'Выберите оттенок, прежде чем добавлять в корзину.',
  shades: [
    {
      value: 'Bright',
      code: '#01',
      name: 'Bright',
      hex: '#e9ccb6',
      tagline: 'Светлее',
      body: 'Больше диоксида титана и меньше оксидов железа, поэтому оттенок светлее и сияние заметнее. Подходит светлой и светло-средней коже.',
    },
    {
      value: 'Natural',
      code: '#02',
      name: 'Natural',
      hex: '#c99569',
      tagline: 'Теплее',
      body: 'Больше оксидов железа и слюды, меньше диоксида титана. Глубже и теплее, сияние мягче. Подходит светло-средней и средней коже.',
    },
  ],
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы купить',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  stats: [
    { value: 'SPF 38', label: 'PA+++ широкий спектр, каждый день' },
    { value: '4', label: 'УФ-фильтра: два органических и два минеральных' },
    { value: '2%', label: 'Ниацинамид - зарегистрированный актив для осветления' },
    { value: '10', label: 'Витаминов в комплексе плюс восемь растительных экстрактов' },
  ],
  functions: {
    eyebrow: 'Зарегистрировано в Корее',
    title: 'Три функции, а не одна',
    intro:
      'Корея не позволяет косметическому средству заявлять защиту от УФ, осветление и уменьшение морщин, если за каждым пунктом не стоит названный актив в определённой концентрации. Это средство зарегистрировано по всем трём.',
    cards: [
      {
        title: 'Защищает от УФ',
        body: 'Этилгексилметоксициннамат 7,5% и этилгексилсалицилат 5% поглощают излучение, диоксид титана и оксид цинка отражают и рассеивают его. Вместе они и дают ему SPF 38 PA+++.',
      },
      {
        title: 'Помогает осветлить тон',
        body: 'Ниацинамид 2% - актив для осветления, указанный в регистрации. Это же самая высокая концентрация активного компонента во всей формуле, и параллельно он поддерживает барьер.',
      },
      {
        title: 'Помогает уменьшить морщины',
        body: 'Аденозин 0,04% - именно эту концентрацию Корея устанавливает для заявления об уменьшении морщин. Он усиливает синтез коллагена и стимулирует фибробласты, то есть под покрытием идёт работа с кожей.',
      },
      {
        title: 'Выравнивает тон сразу',
        body: 'Оптическую работу выполняют три оксида железа и слюда. Покрытие наращиваемое и намеренно естественное: средство работает и как база под тональный крем, и вместо него.',
      },
    ],
  },
  mechanism: {
    eyebrow: 'Как ведёт себя на коже',
    title: 'Три процесса одновременно',
    intro:
      'Большинство тонирующих средств делают одно: перекрывают. Это построено в три слоя, и только верхний отвечает за цвет.',
    steps: [
      {
        step: '01',
        title: 'Выравнивание и сцепление',
        body: 'Прежде чем проявится цвет, слой должен лечь ровно. Смягчающая система сглаживает неровности рельефа, а система высокой адгезии удерживает слой на коже, не давая ему проваливаться в текстуру.',
      },
      {
        step: '02',
        title: 'Восстановление',
        body: 'Под покрытием начинают работать десять витаминов, растительный комплекс и увлажнители природного происхождения. Именно этот слой делает средство ухаживающей базой, а не тональным кремом с SPF.',
      },
      {
        step: '03',
        title: 'Гелевая плёнка',
        body: 'Сверху застывает прозрачная эластичная гелевая плёнка. Она удерживает финиш в течение дня и не даёт воде и активам испаряться обратно.',
      },
    ],
    note: 'Именно третий слой держит вас весь день в Дубае. Плёнка схватывается, а не остаётся влажной на поверхности: финиш перестаёт сдвигаться, а увлажнение под ним никуда не испаряется на жаре.',
  },
  filters: {
    eyebrow: 'Система фильтров',
    title: 'Два поглощают, два отражают',
    intro:
      'Гибридные системы комфортнее полностью минеральных и гораздо реже дают белёсый след - а это важно, когда база должна раствориться в коже. Вот что даёт каждый из четырёх фильтров.',
    columns: { name: 'Фильтр', amount: 'Концентрация', role: 'Тип' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7,50%', role: 'Органический УФ-абсорбер' },
      { name: 'Titanium Dioxide', amount: '7,13% / 6,18%', role: 'Минеральный фильтр и белый пигмент' },
      { name: 'Ethylhexyl Salicylate', amount: '5,00%', role: 'Органический УФ-абсорбер' },
      { name: 'Zinc Oxide', amount: '1,96%', role: 'Минеральный фильтр широкого спектра' },
    ],
    note:
      'Диоксид титана - единственный компонент, который отличается у двух оттенков: 7,13% в #01 Bright против 6,18% в #02 Natural, потому что он одновременно служит белым пигментом. Всё остальное в обеих формулах идентично, включая фильтры.',
  },
  shadeSection: {
    eyebrow: 'Два оттенка',
    title: 'Bright или Natural',
    intro: 'Оба тёплые и оба наращиваемые. Выбор идёт по глубине, а не по подтону.',
    sameFormula:
      'Идентичные активы, идентичный SPF, идентичные растительные экстракты. Единственное различие между #01 и #02 - доля оксидов железа, слюды и диоксида титана.',
    figureAlt: 'GENOSYS REVITA GLOW BB CREAM - сравнение оттенков #01 Bright и #02 Natural',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Последний шаг утреннего ухода',
    frequency: 'Каждое утро · после ухода',
    steps: [
      {
        title: 'Сначала завершите уход',
        body: 'Наносите после сыворотки и крема. Это финальный шаг перед выходом, а не слой, поверх которого идут другие средства.',
      },
      {
        title: 'Возьмите меньше, чем кажется нужным',
        body: 'Пигмент концентрированный. Начните с малого и добавьте: нарастить покрытие намного проще, чем снять излишек.',
      },
      {
        title: 'Растушуйте и вбейте',
        body: 'Распределите равномерно пальцами, спонжем или кистью по направлению рельефа кожи. Затем слегка вбейте, чтобы средство закрепилось, а не лежало на поверхности.',
      },
      {
        title: 'Добавляйте только там, где нужно',
        body: 'Нанесите второй тонкий слой на покраснения и неровности вместо того, чтобы утолщать покрытие по всему лицу. Именно тонкие слои сохраняют эффект живой кожи.',
      },
    ],
    note:
      'Рейтинг SPF измеряется при более толстом слое, чем кто-либо наносит тонирующую базу, поэтому для повседневного солнца - дорога на работу, дела, стол у окна - этого достаточно. Если предстоят часы под прямым солнцем, нанесите под низ отдельный солнцезащитный крем и обновляйте его. Это верно для любой тонирующей базы, не только для этой.',
  },
  video: {
    eyebrow: 'В движении',
    title: 'Текстура и финиш',
    body: 'Как крем распределяется по коже, насколько хватает небольшого количества и где в итоге ложится сияние.',
    unsupported: 'Ваш браузер не поддерживает воспроизведение видео.',
  },
  actives: {
    eyebrow: 'Формула',
    title: 'Каждый актив и что он на самом деле делает',
    intro:
      'Каждый актив в формуле и то, что он делает, пока средство на коже.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote:
      'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках. Идентичен для #01 Bright и #02 Natural, кроме пигментов.',
    fragranceNote:
      'Лёгкая отдушка. В составе есть Parfum, масло кожуры лимона и горького апельсина, а также аллергены: линалоол, линалилацетат, лимонен, цитронеллол и гидроксицитронеллаль. Стоит посмотреть в первую очередь, если кожа реагирует на отдушки.',
  },
  lab: {
    eyebrow: 'Качество',
    title: 'Сделано и протестировано в Корее',
    intro:
      'Ни одна партия не покидает завод, не пройдя проверку, и до Дубая она доезжает с допуском к продаже и здесь, и в Корее.',
    rows: [
      { label: 'Кожные тесты', value: 'Дерматологически протестировано' },
      { label: 'Чистота', value: 'В десять раз чище допустимого - менее 10 КОЕ/г при разрешённых 100' },
      { label: 'Срок годности', value: 'Три года в закрытой упаковке · 12 месяцев после вскрытия' },
      { label: 'Допуск в ОАЭ', value: 'Зарегистрирован Муниципалитетом Дубая в системе Montaji, плюс корейский сертификат свободной продажи' },
    ],
    disclaimer:
      'Ежедневная защита от солнца - это то, что сохраняет достигнутый результат. Стойкая пигментация и мелазма лучше всего отвечают, когда рядом с вашим уходом работает дерматолог.',
  },
  safety: {
    eyebrow: 'Перед использованием',
    title: 'Меры предосторожности',
    points: [
      'Только для наружного применения. Избегайте попадания в глаза и на слизистые; при попадании тщательно промойте прохладной водой.',
      'Не наносите непосредственно вокруг глаз.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Не наносите на повреждённую кожу.',
      'Содержит отдушку, включая линалоол, линалилацетат, лимонен, цитронеллол и гидроксицитронеллаль.',
      'Храните в прохладном сухом месте вдали от прямых солнечных лучей и в недоступном для детей месте.',
    ],
    note: 'Меры предосторожности приведены по тексту на упаковке GENOSYS. Использовать в течение 12 месяцев после вскрытия.',
  },
  routine: {
    eyebrow: 'Завершите routine',
    title: 'С чем это работает',
    intro:
      'Revita Glow - последний шаг. Это средства, которые протокол GENOSYS ставит перед ним, чтобы базе было на что лечь.',
    thisProduct: 'Вы здесь',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать вариант',
    fromPrice: 'от',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Какой оттенок выбрать?',
        a: 'Оба тёплые, поэтому вопрос в глубине. #01 Bright подходит светлой и светло-средней коже и даёт более сияющий финиш. #02 Natural подходит светло-средней и средней коже и выглядит ближе к собственному тону. Если вы ровно между ними, безопаснее взять #02: слишком светлый оттенок выдаёт несовпадение заметно сильнее, чем чуть более глубокий.',
      },
      {
        q: 'Хватает ли этой защиты от солнца?',
        a: 'Для повседневного солнца - да. SPF 38 PA+++ - настоящий рейтинг, и его хватает на дорогу, дела в городе и стол у окна. Если предстоят часы под прямым солнцем, нанесите под низ отдельный солнцезащитный крем и обновляйте его в течение дня. Это касается любой тонирующей базы, не только этой.',
      },
      {
        q: 'Есть ли в составе отдушка?',
        a: 'Да, лёгкая. В составе есть Parfum, масло кожуры лимона и горького апельсина, а также аллергены линалоол, линалилацетат, лимонен, цитронеллол и гидроксицитронеллаль. Если кожа реагирует на отдушки, смотреть нужно именно эту группу.',
      },
      {
        q: 'Это то же самое, что кушон GENOSYS?',
        a: 'Нет, это разные продукты. Здесь туба 50 г, а Skin Caring Blemish Balm Cushion - кушон в компактном футляре со сменным блоком и более плотной формулой SPF 50+ PA++++. У GENOSYS действительно есть отдельная пуховка с микроячеистой структурой, рассчитанная на этот крем, и вбить ею последний слой - тот финиш, который рекомендует марка. Пуховка продаётся отдельно, а сама туба прекрасно растушёвывается пальцами, спонжем или кистью.',
      },
      {
        q: 'Чем оттенки различаются по формуле?',
        a: 'Только красящими веществами. По-разному дозированы оксиды железа, слюда и диоксид титана. УФ-фильтры, ниацинамид, аденозин, витамины и восемь растительных экстрактов в обоих оттенках идентичны.',
      },
      {
        q: 'Нужно ли его тщательно смывать?',
        a: 'Да. В составе есть УФ-фильтры, плёнкообразователи и пигменты, поэтому в конце дня умывайтесь средством для очищения, а не только водой.',
      },
    ],
  },
  details: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Формат', value: 'BB-крем · туба 50 г' },
      { label: 'Оттенки', value: '#01 Bright · #02 Natural' },
      { label: 'Защита', value: 'SPF 38 PA+++' },
      { label: 'Зарегистрированные функции', value: 'Защита от УФ · осветление · коррекция морщин' },
      { label: 'Тип кожи', value: 'Все типы кожи' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Срок после вскрытия', value: '12 месяцев' },
      { label: 'Происхождение', value: 'Сделано в Корее для DTS MG Co., Ltd.' },
    ],
    brochure: 'Скачать гид по продукту Revita Glow',
  },
  backToProducts: 'Продукты',
}

const AUDITED_RU: RevitaGlowCopy = {
  ...RU,
  headline: 'Естественный тон и мягкое сияние - с SPF 38 PA+++.',
  subheadline:
    'Естественное покрытие в двух оттенках, SPF 38 PA+++, ниацинамид 2% и аденозин 0,04% с подтверждённой регистрационной основой.',
  heroBullets: [
    'Естественное покрытие с мягким сияющим финишем',
    'SPF 38 PA+++ на четырёх УФ-фильтрах',
    'Две разные формулы: #01 Bright и #02 Natural',
  ],
  shadeHelp: 'Оттенки различаются пигментной частью и точной долей диоксида титана.',
  shades: [
    {
      value: 'Bright',
      code: '#01',
      name: 'Bright',
      hex: '#e9ccb6',
      tagline: 'Более светлый',
      body: 'Более светлая формула с 7,1295% диоксида титана, большей долей слюды и пигментом CI 77742.',
    },
    {
      value: 'Natural',
      code: '#02',
      name: 'Natural',
      hex: '#c99569',
      tagline: 'Глубже и теплее',
      body: 'Более глубокая тёплая смесь оксидов железа с 6,1789% диоксида титана и меньшей долей слюды.',
    },
  ],
  stats: [
    { value: '38', label: 'SPF на зарегистрированной упаковке' },
    { value: 'PA+++', label: 'высокая UVA-защита · PFA 8 - <16' },
    { value: '2%', label: 'ниацинамид' },
    { value: '0,04%', label: 'аденозин' },
  ],
  functions: {
    ...RU.functions,
    intro:
      'Корейская регистрация подтверждает три функции. Покрытие и оттенок - косметический результат, а не доказательство солнцезащитной эффективности.',
    cards: [
      {
        title: 'Защита от УФ · SPF 38 PA+++',
        body: 'SPF относится прежде всего к UVB. PA+++ означает высокий уровень защиты от UVA в системе PA: PFA от 8 до менее 16. Водостойкость не заявлена.',
      },
      {
        title: 'Осветляющая функция · ниацинамид 2%',
        body: 'Ниацинамид 2,000010% отвечает за зарегистрированную осветляющую функцию.',
      },
      {
        title: 'Уход за морщинами · аденозин 0,04%',
        body: 'Аденозин 0,040000% отвечает за зарегистрированную функцию ухода за морщинами.',
      },
    ],
  },
  mechanism: {
    ...RU.mechanism,
    title: 'Покрытие отдельно, солнцезащита отдельно',
    intro:
      'Пигменты и текстура создают косметический финиш. Четыре УФ-фильтра обеспечивают основу SPF 38 PA+++. Одно не служит доказательством другого.',
    steps: [
      { step: '01', title: 'Распределить', body: 'После ухода равномерно нанесите подходящее количество на лицо.' },
      { step: '02', title: 'Слегка вбить', body: 'Завершите лёгким похлопыванием. Фирменный спонж не требуется и не входит в коробку.' },
      { step: '03', title: 'Использовать отдельный SPF', body: 'Для надёжной защиты всего лица нанесите под BB-крем отдельный санскрин достаточным количеством и обновляйте по его инструкции.' },
    ],
    note: 'Косметическое покрытие не заменяет контролируемое нанесение отдельного санскрина.',
  },
  filters: {
    ...RU.filters,
    intro:
      'В обоих оттенках четыре одинаковых УФ-фильтра. Концентрация диоксида титана различается, поэтому отличается и точная сумма.',
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7,5%', role: 'УФ-фильтр · оба оттенка' },
      { name: 'Ethylhexyl Salicylate', amount: '5%', role: 'УФ-фильтр · оба оттенка' },
      { name: 'Zinc Oxide', amount: '1,96%', role: 'УФ-фильтр · оба оттенка' },
      { name: 'Titanium Dioxide', amount: '7,1295% / 6,1789%', role: 'Bright / Natural' },
    ],
    note: 'Сумма УФ-фильтров: #01 Bright 21,5895%; #02 Natural 20,6389%.',
  },
  shadeSection: {
    ...RU.shadeSection,
    intro:
      'Bright светлее; Natural глубже и теплее. Отличаются пигменты, слюда, диоксид титана и связанный с ним гидроксид алюминия.',
    sameFormula:
      'Выбирайте совпадение с тоном лица, а не уровень защиты: оба оттенка заявлены как SPF 38 PA+++.',
  },
  howTo: {
    ...RU.howTo,
    frequency: 'Утром, после ухода.',
    steps: [
      { title: 'Завершите уход', body: 'Используйте как последний косметический этап после утреннего ухода.' },
      { title: 'Равномерно распределите', body: 'Нанесите подходящее количество и равномерно растушуйте по лицу.' },
      { title: 'Слегка вбейте', body: 'Завершите лёгкими похлопывающими движениями пальцами, чистым спонжем или кистью.' },
      { title: 'Отделите солнцезащиту', body: 'Для надёжной защиты нанесите под BB-крем отдельный санскрин достаточным количеством и обновляйте по его инструкции.' },
    ],
    note:
      'Водостойкость не заявлена. После плавания, потоотделения или вытирания следуйте инструкции отдельного водостойкого санскрина.',
  },
  video: {
    ...RU.video,
    title: 'Текстура и два оттенка в движении',
    body: 'Посмотрите, как распределяется крем и как рядом выглядят #01 Bright и #02 Natural.',
  },
  actives: {
    ...RU.actives,
    title: 'Что и в какой концентрации находится в формуле',
    intro:
      'Количественную формулу отделяем от названий комплексов. Следовым витаминам и растительным экстрактам не приписываем отдельные эффекты.',
    fullInciNote:
      'Полный список с упаковки. Оттенки различаются пигментной частью, слюдой, диоксидом титана и связанным с ним гидроксидом алюминия.',
    fragranceNote:
      'Содержит Parfum, масла кожуры лимона и горького апельсина, linalool, linalyl acetate, limonene, citronellol, tetramethyl acetyloctahydronaphthalenes и hydroxycitronellal.',
  },
  lab: {
    ...RU.lab,
    title: 'Проверенные документы и ясная граница доказательств',
    intro:
      'SPF 38 PA+++, тройная функциональная регистрация и фраза о дерматологическом тестировании напечатаны на зарегистрированной корейской упаковке.',
    disclaimer:
      'Отдельного отчёта испытаний SPF/UVA, отчёта дерматологического теста и safety assessment именно для Revita Glow в доступном архиве нет. COA подтверждают только физические и микробиологические параметры партий. Водостойкость не заявлена.',
  },
  safety: {
    ...RU.safety,
    points: [
      'Только для наружного применения; избегайте глаз, слизистых и повреждённой кожи.',
      'При стойком покраснении, отёке, зуде или раздражении прекратите использование и обратитесь к врачу.',
      'Содержит отдушку, масла кожуры лимона и горького апельсина и перечисленные ароматические аллергены.',
      'Храните в прохладном сухом месте вдали от прямого солнца и детей.',
    ],
    note: 'Водостойкость не заявлена. Для плавания и потоотделения используйте отдельный водостойкий санскрин.',
  },
  faq: {
    ...RU.faq,
    items: [
      { q: 'Что означает PA+++?', a: 'Высокий уровень UVA-защиты в системе PA, соответствующий PFA от 8 до менее 16. SPF относится прежде всего к UVB.' },
      { q: 'Можно заменить им отдельный санскрин?', a: 'Не полагайтесь на тонирующий макияж как на единственную защиту всего лица. Нанесите под него достаточное количество отдельного санскрина и обновляйте по инструкции.' },
      { q: 'Он водостойкий?', a: 'Водостойкость не заявлена. Для плавания и потоотделения используйте отдельный водостойкий санскрин.' },
      { q: 'Чем отличаются оттенки?', a: 'Пигментами, слюдой, диоксидом титана и связанным с ним гидроксидом алюминия. Bright светлее, Natural глубже и теплее.' },
      { q: 'Фирменный спонж входит в комплект?', a: 'Нет. В коробке находится туба 50 г. Используйте пальцы, собственный чистый спонж или кисть.' },
    ],
  },
  details: {
    ...RU.details,
    rows: [
      { label: 'Объём', value: '50 г' },
      { label: 'Оттенки', value: '#01 Bright · #02 Natural' },
      { label: 'УФ-рейтинг', value: 'SPF 38 PA+++' },
      { label: 'Функции', value: 'Защита от УФ · осветление · уход за морщинами' },
      { label: 'Водостойкость', value: 'Не заявлена' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'После вскрытия', value: '12 месяцев' },
      { label: 'Производство', value: 'Корея' },
    ],
  },
}

const AUDITED_AR: RevitaGlowCopy = {
  ...AR,
  headline: 'لون طبيعي ولمسة مشرقة ناعمة، مع SPF 38 PA+++.',
  subheadline:
    'تغطية طبيعية بدرجتين، مع SPF 38 PA+++ ونياسيناميد 2% وأدينوزين 0.04% على أساس مسجّل ومتحقق.',
  heroBullets: [
    'تغطية طبيعية بلمسة مشرقة ناعمة',
    'SPF 38 PA+++ بأربعة مرشحات للأشعة',
    'تركيبتان مختلفتان فعلياً: #01 Bright و#02 Natural',
  ],
  shadeHelp: 'تختلف الدرجتان في جزء الصبغات والنسبة الدقيقة لثاني أكسيد التيتانيوم.',
  shades: [
    {
      value: 'Bright',
      code: '#01',
      name: 'Bright',
      hex: '#e9ccb6',
      tagline: 'أفتح',
      body: 'تركيبة أفتح مع 7.1295% من ثاني أكسيد التيتانيوم ونسبة أعلى من الميكا والصبغة CI 77742.',
    },
    {
      value: 'Natural',
      code: '#02',
      name: 'Natural',
      hex: '#c99569',
      tagline: 'أعمق وأدفأ',
      body: 'مزيج أعمق وأدفأ من أكاسيد الحديد مع 6.1789% من ثاني أكسيد التيتانيوم ونسبة أقل من الميكا.',
    },
  ],
  stats: [
    { value: '38', label: 'قيمة SPF على العبوة المسجّلة' },
    { value: 'PA+++', label: 'حماية UVA مرتفعة · PFA ‏8 - <16' },
    { value: '2%', label: 'نياسيناميد' },
    { value: '0.04%', label: 'أدينوزين' },
  ],
  functions: {
    ...AR.functions,
    intro:
      'يدعم التسجيل الكوري ثلاث وظائف. أما التغطية والدرجة فهما نتيجة تجميلية منفصلة عن إثبات الحماية من الأشعة.',
    cards: [
      {
        title: 'الحماية من الأشعة · SPF 38 PA+++',
        body: 'يتعلق SPF أساساً بالحماية من UVB. وتعني PA+++ مستوى مرتفعاً من الحماية من UVA ضمن نظام PA، أي PFA من 8 إلى أقل من 16. لا توجد دعوى لمقاومة الماء.',
      },
      {
        title: 'وظيفة التفتيح · نياسيناميد 2%',
        body: 'النياسيناميد بنسبة 2.000010% هو المادة الوظيفية المرتبطة بوظيفة التفتيح المسجّلة.',
      },
      {
        title: 'العناية بمظهر التجاعيد · أدينوزين 0.04%',
        body: 'الأدينوزين بنسبة 0.040000% هو المادة الوظيفية المرتبطة بالعناية بمظهر التجاعيد.',
      },
    ],
  },
  mechanism: {
    ...AR.mechanism,
    title: 'التغطية منفصلة بوضوح عن العناية الشمسية',
    intro:
      'تصنع الصبغات والقوام اللمسة التجميلية، بينما تدعم أربعة مرشحات للأشعة ادعاء SPF 38 PA+++. ولا يثبت أحد الأمرين الآخر.',
    steps: [
      { step: '01', title: 'امزجي', body: 'بعد العناية، وزعي كمية مناسبة بالتساوي على الوجه.' },
      { step: '02', title: 'ربتي بخفة', body: 'أنهي بالتربيت الخفيف. لا تشترط العبوة إسفنجة مخصصة ولا تتضمنها.' },
      { step: '03', title: 'استخدمي واقياً مخصصاً', body: 'لحماية موثوقة لكامل الوجه، ضعي تحته واقي شمس مخصصاً بكمية كافية وجدديه وفق تعليماته.' },
    ],
    note: 'التغطية التجميلية لا تحل محل التطبيق المنضبط لواقي شمس مخصص.',
  },
  filters: {
    ...AR.filters,
    intro:
      'تستخدم الدرجتان المرشحات الأربعة نفسها. تختلف نسبة ثاني أكسيد التيتانيوم، ولذلك يختلف المجموع الدقيق حسب الدرجة.',
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7.5%', role: 'مرشح للأشعة · الدرجتان' },
      { name: 'Ethylhexyl Salicylate', amount: '5%', role: 'مرشح للأشعة · الدرجتان' },
      { name: 'Zinc Oxide', amount: '1.96%', role: 'مرشح للأشعة · الدرجتان' },
      { name: 'Titanium Dioxide', amount: '7.1295% / 6.1789%', role: 'Bright / Natural' },
    ],
    note: 'مجموع مرشحات الأشعة: #01 Bright ‏21.5895%؛ #02 Natural ‏20.6389%.',
  },
  shadeSection: {
    ...AR.shadeSection,
    intro:
      'Bright أفتح، وNatural أعمق وأدفأ. تختلف الصبغات والميكا وثاني أكسيد التيتانيوم وهيدروكسيد الألومنيوم المرتبط به.',
    sameFormula:
      'اختاري ما يطابق لون بشرتك، لا مستوى حماية مختلفاً: كلتا الدرجتين تحملان SPF 38 PA+++.',
  },
  howTo: {
    ...AR.howTo,
    frequency: 'صباحاً بعد روتين العناية.',
    steps: [
      { title: 'أنهي روتين العناية', body: 'استخدميه كآخر خطوة تجميلية بعد العناية الصباحية.' },
      { title: 'وزعي بالتساوي', body: 'ضعي كمية مناسبة وامزجيها بالتساوي على الوجه.' },
      { title: 'ربتي بخفة', body: 'أنهي بالتربيت الخفيف بالأصابع أو بإسفنجة نظيفة أو فرشاة.' },
      { title: 'افصلي الحماية الشمسية', body: 'لحماية موثوقة، ضعي تحته واقي شمس مخصصاً بكمية كافية وجدديه وفق تعليماته.' },
    ],
    note:
      'لا توجد دعوى لمقاومة الماء. بعد السباحة أو التعرق أو التجفيف، اتبعي تعليمات واق شمس مخصص مقاوم للماء.',
  },
  video: {
    ...AR.video,
    title: 'القوام والدرجتان بالحركة',
    body: 'شاهدي كيف يندمج الكريم وكيف تبدو #01 Bright و#02 Natural جنباً إلى جنب.',
  },
  actives: {
    ...AR.actives,
    title: 'ما الذي تحتويه التركيبة، وبأي تركيز',
    intro:
      'نفصل حقائق التركيبة الكمية عن أسماء المركّبات التسويقية، ولا ننسب آثاراً مستقلة للفيتامينات والمستخلصات النباتية ذات النسب النزرة.',
    fullInciNote:
      'القائمة الكاملة كما على العبوة. تختلف الدرجتان في جزء الصبغات والميكا وثاني أكسيد التيتانيوم وهيدروكسيد الألومنيوم المرتبط به.',
    fragranceNote:
      'يحتوي على Parfum وزيتي قشر الليمون والبرتقال المر وlinalool وlinalyl acetate وlimonene وcitronellol وtetramethyl acetyloctahydronaphthalenes وhydroxycitronellal.',
  },
  lab: {
    ...AR.lab,
    title: 'وثائق متحققة وحدود أدلة واضحة',
    intro:
      'تطبع العبوة الكورية المسجّلة SPF 38 PA+++ والتسجيل ثلاثي الوظيفة وعبارة الاختبار الجلدي.',
    disclaimer:
      'لا يتضمن الأرشيف المتاح تقرير اختبار SPF/UVA مستقلاً، أو تقرير الاختبار الجلدي، أو تقييم سلامة خاصاً بمنتج Revita Glow. وتثبت شهادات التحليل الخصائص الفيزيائية والميكروبية للدفعات فقط. مقاومة الماء غير مدّعاة.',
  },
  safety: {
    ...AR.safety,
    points: [
      'للاستخدام الخارجي فقط؛ تجنبي العينين والأغشية المخاطية والبشرة المتضررة.',
      'أوقفي الاستخدام واطلبي المشورة الطبية عند استمرار الاحمرار أو التورم أو الحكة أو التهيج.',
      'يحتوي على عطر وزيتي قشر الليمون والبرتقال المر ومسببات الحساسية العطرية المدرجة.',
      'يحفظ في مكان بارد وجاف بعيداً عن الشمس المباشرة ومتناول الأطفال.',
    ],
    note: 'لا توجد دعوى لمقاومة الماء. استخدمي واقياً مخصصاً مقاوماً للماء عند السباحة أو التعرق.',
  },
  faq: {
    ...AR.faq,
    items: [
      { q: 'ماذا تعني PA+++؟', a: 'هي الدرجة المرتفعة لحماية UVA ضمن نظام PA، وتقابل PFA من 8 إلى أقل من 16. ويتعلق SPF أساساً بـUVB.' },
      { q: 'هل يغني عن واقي الشمس المخصص؟', a: 'لا تعتمدي على مكياج ملوّن بوصفه الحماية الوحيدة لكامل الوجه. ضعي تحته كمية كافية من واق مخصص وجدديه وفق تعليماته.' },
      { q: 'هل هو مقاوم للماء؟', a: 'لا توجد دعوى لمقاومة الماء. استخدمي واقياً مخصصاً مقاوماً للماء عند السباحة أو التعرق.' },
      { q: 'ما الفرق بين الدرجتين؟', a: 'تختلف الصبغات والميكا وثاني أكسيد التيتانيوم وهيدروكسيد الألومنيوم المرتبط به. Bright أفتح، وNatural أعمق وأدفأ.' },
      { q: 'هل تتضمن العبوة إسفنجة مخصصة؟', a: 'لا. تحتوي العلبة على أنبوب 50 غ. استخدمي الأصابع أو إسفنجتك النظيفة أو فرشاة.' },
    ],
  },
  details: {
    ...AR.details,
    rows: [
      { label: 'المحتوى', value: '50 غ' },
      { label: 'الدرجات', value: '#01 Bright · #02 Natural' },
      { label: 'تصنيف الحماية', value: 'SPF 38 PA+++' },
      { label: 'الوظائف', value: 'حماية من الأشعة · تفتيح · عناية بمظهر التجاعيد' },
      { label: 'مقاومة الماء', value: 'غير مدّعاة' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'بعد الفتح', value: '12 شهراً' },
      { label: 'بلد الصنع', value: 'كوريا' },
    ],
  },
}

const BY_LOCALE: Record<RevitaGlowLocale, RevitaGlowCopy> = {
  en: EN,
  ar: AUDITED_AR,
  ru: AUDITED_RU,
}

export function getRevitaGlowCopy(locale: string): RevitaGlowCopy {
  return BY_LOCALE[locale as RevitaGlowLocale] ?? EN
}

/**
 * The Intertek artwork INCI declaration, kept as a fallback only.
 *
 * The product record was corrected in Aug 2026 and now matches this string
 * token for token, so the page reads the record instead. This stays as a safety
 * net in case the record is ever edited back to an incomplete declaration.
 */
export function getRevitaGlowFullInci(): string {
  return FULL_INCI
}
