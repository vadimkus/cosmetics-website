/**
 * Bespoke copy for the EyeCell EYE CONTOUR SERUM page (product 17).
 *
 * Same self-contained per-locale pattern as eyecreamCopy.ts, so the dedicated
 * layout ships EN/AR/RU without adding keys to the shared messages bundles.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Documents that cover every figure on this page:
 *
 *   Registration DOC/Formula_up/Formula-GENOSYS EyeCell EYE CONTOUR SERUM.pdf
 *       Finished concentrations. Every percentage comes from here.
 *       Signed DTS MG, Narae Han. This is the source of truth.
 *   Registration DOC/SA/SA-GENOSYS EyeCell EYE CONTOUR SERUM.pdf
 *       Trade names: HALOXYL 0.1000% premix (NHS + Chrysin +
 *       Palmitoyl Tripeptide-1 + Palmitoyl Tetrapeptide-7),
 *       AHP-5 (H15) 5.0000% premix (carrier + Acetyl Hexapeptide-8),
 *       Arbutin 2.0000%, Adenosine 0.0400%. pH 6.0 +/- 1.0 (one
 *       table also writes 6.5 +/- 1.0). Leave-on eye serum. PAO is
 *       not documented - do not invent one. Do not print the lab
 *       id or the lot codes.
 *   Registration DOC/Artwork/[GENOSYS]EYECELL EYE SERUM.pdf
 *       English: intensive serum. Helps reduce deep wrinkles, dark
 *       circles and diminish the appearance of eye puffs. AM & PM,
 *       gently pat. Dermatologically tested. 10ml. Avoid use during
 *       pregnancy / lactation. Made in Korea by DTS MG. Russian and
 *       Arabic panels are drifted - do not follow them. RU invents
 *       20 ml for a 10ml serum.
 *   Registration DOC/COA/COA-GENOSYS EyeCell EYE CONTOUR SERUM(L0614B).pdf
 *       Light yellow viscous liquid. pH 5.37 inside 6.00 +/- 1.00.
 *       Arbutin assay 98.56% of the 2% spec. Adenosine assay 99.29%
 *       of the 0.04% spec. Never print the lot.
 *   Intertek_folder/Quali-quanti Ingredients/EyeCell EYE CONTOUR SERUM.pdf
 *       2018 COTDE sheet. Cross-check only. Lists peptide premix
 *       solutions as if they were finished actives (0.90% / 0.90% /
 *       0.50%). Do not sell those numbers.
 *   DTS MG deck: public/documents/PPT/GENOSYS EyeCell EYE ZONE CARE SYSTEM.pdf
 *       Line context. The 14-volunteer / 28-day peptide page and the
 *       Botox / wound-healing language are not a trial of this serum.
 *
 * THE FORMULA, as finished concentrations that matter on this page:
 *
 *   Arbutin                                            2.0000%
 *   Sodium Hyaluronate                                 0.20002%
 *   Panthenol                                          0.15000%
 *   Allantoin                                          0.15000%
 *   Adenosine                                          0.04000%
 *   Vitis / Rosa callus extracts                       0.00300% each
 *   Acetyl Hexapeptide-8                               0.00250%
 *   Copper Tripeptide-1                                0.00100%
 *   Palmitoyl Hexapeptide-12                           0.00030%
 *   N-Hydroxysuccinimide                               0.00020%
 *   Palmitoyl Tripeptide-1                             0.00011%
 *   Chrysin                                            0.00001%
 *   Palmitoyl Tetrapeptide-7                           0.000005%
 *
 * THE DISTINCTIVE FACT, which is why this page exists.
 *
 * This is the first-layer intensive eye serum. The Korean functional
 * pair is Arbutin 2% (brightening) and Adenosine 0.04% (wrinkle care).
 * That is the product. The peptides sit at cosmetic trace. Haloxyl is
 * the manufacturer's name for the dark-circle support stack, a 0.10%
 * premix, not a 0.10% active. Sodium hyaluronate 0.20% is the serum
 * comfort figure. Then the cream seals.
 *
 * Live English, Arabic and Russian still sold a peptide-complex hero,
 * Haloxyl as a dark-circle treatment, callus regeneration, lift and
 * tighten, and "all skin types". None of that is the engine.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Intensive all-in-one eye serum                     artwork EN
 *   Deep wrinkles, dark circles, eye puffs             artwork EN
 *   AM & PM, gently pat                                artwork EN
 *   10ml                                               artwork / COA
 *   Arbutin 2%, Adenosine 0.04%                        Formula_up
 *   Light yellow viscous liquid                        COA
 *   pH 5.37 inside 6.00 +/- 1.00                       COA
 *   Dermatologically tested                            artwork
 *   Avoid pregnancy / lactation                        artwork EN
 *   Made in Korea by DTS MG                            formula / artwork
 *
 * DELIBERATE OMISSIONS
 *   - PEPTIDE COMPLEX AS THE ENGINE. Finished Acetyl Hexapeptide-8
 *     is 0.0025%. The 2018 quali 0.50% / 0.90% figures are premix.
 *   - HALOXYL AS A 0.10% ACTIVE. It is a 0.10% premix. Name it.
 *     Do not sell haemoglobin / iron / bilirubin clearance.
 *   - CALLUS / STEM-CELL REGENERATION. 0.003% each. Soft support.
 *   - 10 YEARS BACK / TURN YEARS BACK. On the bottle render, not
 *     on the registered artwork, and not a study.
 *   - BOTOX / B. TOXIN / MUSCLE-RELAXANT. Deck language.
 *   - 14-VOLUNTEER / 28-DAY PEPTIDE TRIAL as this SKU's clinical.
 *   - MICROCIRCULATION / BLOOD FLOW / WOUND HEALING.
 *   - FRAGRANCE-FREE. No Parfum and no orange peel oil, and the
 *     pack still does not print fragrance-free. Do not invent it.
 *   - ALL SKIN TYPES INCLUDING SENSITIVE as a blanket.
 *   - PREGNANCY-SAFE. The pack says avoid. No retinyl, no peanut,
 *     and the warning still stands.
 *   - CLINICAL PERCENTAGES. None for this finished serum.
 *   - PAO. SA says supplementary studies are needed.
 *   - LOT CODES. Never print L0614B or L0486U.
 *   - THE CONTRACT MANUFACTURER. DTS MG only.
 */

export type EyeSerumLocale = 'en' | 'ar' | 'ru'

export interface EyeSerumCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
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
  effects: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
  }
  engine: {
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
    videoTitle: string
  }
  actives: {
    eyebrow: string
    title: string
    intro: string
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
    barcodeLabel: string
  }
  closing: {
    title: string
    body: string
  }
  reviewsTitle: string
  backToProducts: string
}

/** Registered Formula_up INCI in descending finished order. The carton
 *  lifts some peptide names earlier. The page does not claim this matches
 *  every language panel. */
export const FULL_INCI =
  'Aqua (Water), Glycerin, Butylene Glycol, Arbutin, Phenoxyethanol, ' +
  'Ammonium Acryloyldimethyltaurate/VP Copolymer, PEG-60 Hydrogenated ' +
  'Castor Oil, Caprylyl Glycol, Sodium Hyaluronate, Panthenol, Allantoin, ' +
  '1,2-Hexanediol, Caprylhydroxamic Acid, Adenosine, t-Butyl Alcohol, ' +
  'PEG-40 Hydrogenated Castor Oil, Steareth-20, PPG-26-Buteth-26, Vitis ' +
  'Vinifera (Grape) Callus Culture Extract, Rosa Damascena Callus Culture ' +
  'Extract, Acetyl Hexapeptide-8, Copper Tripeptide-1, Potassium Sorbate, ' +
  'Palmitoyl Hexapeptide-12, N-Hydroxysuccinimide, Palmitoyl Tripeptide-1, ' +
  'Chlorhexidine Digluconate, Ethylhexylglycerin, Chrysin, Palmitoyl ' +
  'Tetrapeptide-7.'

const EN: EyeSerumCopy = {
  eyebrow: 'EyeCell · Daily eye serum',
  headline: 'Start with serum.',
  subheadline:
    'An intensive all-in-one serum for the eye contour. Deep wrinkles, dark circles and eye puffs. Arbutin 2% is the figure that belongs on a card.',
  heroBullets: [
    'Arbutin 2% for a brighter under-eye look',
    'Adenosine 0.04% is the wrinkle-care functional pair',
    'Morning and evening, a gentle pat, then leave on',
    '10ml. Seal with Eye Contour Cream when you want the full EyeCell step',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '10ml leave-on', 'Morning and evening'],
  packSize: '10ml',
  usageNote: 'Morning and evening',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added',
  inBag: 'In your bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over 1,000 AED · Ships from Dubai',
  stats: [
    { value: '10ml', label: 'Intensive leave-on serum' },
    { value: '2%', label: 'Arbutin' },
    { value: '0.04%', label: 'Adenosine' },
    { value: 'AM & PM', label: 'Morning and evening' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'One serum. Three targets.',
    intro:
      'The English pack writes the job in three phrases: deep wrinkles, dark circles and eye puffs. This is the first layer. The cream seals after.',
    cards: [
      {
        title: 'Deep wrinkles',
        body: 'A smoother look on the lines that sit first around the eye. Adenosine 0.04% is the Korean wrinkle-care functional in the serum.',
      },
      {
        title: 'Dark circles',
        body: "A brighter, more rested under-eye. Arbutin 2% is the brightening functional. Haloxyl is the manufacturer's name for the support stack that sits with it.",
      },
      {
        title: 'Eye puffs',
        body: 'A fresher, less puffy under-eye feel. The serum is the first layer. It is a look, not a drainage treatment.',
      },
    ],
  },
  engine: {
    eyebrow: 'The serum',
    title: 'Arbutin 2% is the figure that belongs on a card.',
    body:
      'The Korean functional pair is Arbutin 2% and Adenosine 0.04%. That is the product. The peptides sit at cosmetic trace. Haloxyl is a name for a 0.10% premix, not a 0.10% active. Sodium hyaluronate 0.20% is the water-light layer.',
    points: [
      {
        title: 'Arbutin · 2%',
        body: 'The brightening functional. This is the figure that belongs on a card. The latest batch came back inside the 2% specification.',
      },
      {
        title: 'Adenosine · 0.04%',
        body: 'The wrinkle-care functional pair. Same class of claim as the Korean licence: help the look of lines, not a muscle-relaxant story.',
      },
      {
        title: 'The water-light layer',
        body: 'Sodium hyaluronate 0.20%, panthenol 0.15% and allantoin 0.15% sit at real levels. They make the serum feel like a serum, then the cream seals.',
      },
      {
        title: 'Peptides and Haloxyl sit in the serum',
        body: "Acetyl Hexapeptide-8 is 0.0025% finished. Copper Tripeptide-1 is 0.001%. Palmitoyl Hexapeptide-12 is 0.0003%. Haloxyl is the manufacturer's name for the dark-circle support stack, a 0.10% premix. They are in the formula. They are not the engine.",
      },
    ],
    figureAlt: 'GENOSYS EyeCell EYE CONTOUR SERUM, Arbutin 2% and Adenosine 0.04% in the serum',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Pat the serum. Cream seals.',
    frequency: 'Morning and evening · Leave on',
    steps: [
      {
        title: 'Cleanse',
        body: 'Clean the eye contour. The serum goes on settled skin, not over makeup remover still sitting there.',
      },
      {
        title: 'Serum',
        body: 'A small amount on the contour. Gently pat from the inner corner out until it settles. Do not rub.',
      },
      {
        title: 'Cream',
        body: 'Eye Contour Cream after when you use the pair. The serum is the first layer. The cream is the seal.',
      },
      {
        title: 'Leave on',
        body: 'Morning and evening. Do not rinse. Peptide gel patches are optional on intensive days.',
      },
    ],
    note:
      'Avoid use during pregnancy and lactation. The pack says so. Keep it out of the eye. If contact occurs, rinse with cool water.',
    videoTitle: 'See the ritual',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The functional pair, with the figures.',
    intro:
      'The cards below are the parts of the serum that do the work. The complete registered INCI is under the list.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote:
      'Every ingredient, strongest first. Your box may print one or two of the peptide names higher up, and this page follows the registered formula.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Honest answer.',
    forTitle: 'A good fit if',
    forList: [
      'You want an intensive first-layer serum for deep wrinkles, dark circles and eye puffs',
      'You will pat it on morning and evening, then seal with the cream',
      'You want the Korean functional pair on the card: Arbutin 2% and Adenosine 0.04%',
      'You can keep a dedicated eye serum, not a face serum pulled up to the brow',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You are pregnant or nursing. The pack says avoid',
      'The skin around the eye is broken or already stinging',
      'You want a Botox story or a ten-year rewind. That is not this serum',
      'You want a cream-first product. This is the first layer. The cream is 24',
    ],
    note: 'For external use only. If it reaches the eye, rinse with cool water. Stop and speak to a doctor if redness, swelling or itching appears.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'Where the serum sits.',
    intro:
      'Cleanse, optional patch on intensive days, this serum, then the cream. Serum delivers. Cream seals.',
    thisProduct: 'This product',
    viewProduct: 'View product',
    chooseOptions: 'Choose options',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Common questions.',
    items: [
      {
        q: 'Can I use it if I am pregnant or nursing?',
        a: 'No. The English pack says avoid use during pregnancy and lactation. There is no retinyl ester and no peanut oil in this serum, and the warning still stands. Ask your doctor before any eye serum in that window.',
      },
      {
        q: 'Does it contain peanut oil?',
        a: 'No. Peanut oil is in the Eye Contour Cream, not in this serum. The pack still says avoid during pregnancy and lactation.',
      },
      {
        q: 'Are the peptides the main actives?',
        a: 'No. Finished Acetyl Hexapeptide-8 is 0.0025%. Copper Tripeptide-1 is 0.001%. Palmitoyl Hexapeptide-12 is 0.0003%. Older sheets listed premix solutions at much higher percentages. The figures that belong on a card are Arbutin 2% and Adenosine 0.04%.',
      },
      {
        q: 'What is Haloxyl?',
        a: "The manufacturer's name for the dark-circle support stack: N-Hydroxysuccinimide, Chrysin, Palmitoyl Tripeptide-1 and Palmitoyl Tetrapeptide-7, sold as a 0.10% premix. It is a name, not a 0.10% active, and not a haemoglobin-clearance treatment.",
      },
      {
        q: 'What does “10 Years Back” mean?',
        a: 'It is a line on some bottle renders, sometimes written Turn Years Back. It is not on the registered artwork, and it is not a measured study. The pack sells an intensive serum for deep wrinkles, dark circles and eye puffs.',
      },
      {
        q: 'Is it fragrance-free?',
        a: 'There is no Parfum line and no orange peel oil. The pack still does not print fragrance-free, so this page does not either.',
      },
      {
        q: 'Do I use it with the cream?',
        a: 'Yes, when you want the EyeCell pair. Serum first, cream second. The cream is the seal. Peptide gel patches are optional on intensive days.',
      },
      {
        q: 'How long after opening?',
        a: 'The safety assessment does not document a PAO. Use the expiry date on the box. Do not invent a month count.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details.',
    rows: [
      { label: 'Format', value: 'Intensive leave-on eye serum' },
      { label: 'Size', value: '10ml' },
      { label: 'When', value: 'Morning and evening' },
      { label: 'Application', value: 'Gently pat the contour, leave on' },
      { label: 'Appearance', value: 'Light yellow viscous liquid' },
      { label: 'pH', value: '5.37, inside a 6.00 ± 1.00 specification' },
      { label: 'After opening', value: 'Not documented. Use the expiry date on the box' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Caution', value: 'Avoid during pregnancy and lactation' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'Start with serum.',
    body: 'Arbutin 2%. Morning and evening. Then the cream seals.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const AR: EyeSerumCopy = {
  eyebrow: 'EyeCell · عناية يومية دقيقة بمحيط العين',
  headline: 'إشراقة ونعومة تبدأان بالسيروم.',
  subheadline:
    'سيروم مكثف لمحيط العين يجمع الأربوتين ٢٪ والأدينوسين ٠٫٠٤٪ للمساعدة على تقليل مظهر الهالات وتنعيم مظهر التجاعيد العميقة وإنعاش المنطقة عند الميل إلى الانتفاخ.',
  heroBullets: [
    'أربوتين ٢٪ لمظهر أكثر إشراقاً وتجانساً تحت العين',
    'أدينوسين ٠٫٠٤٪ للعناية اليومية بمظهر التجاعيد',
    'هيالورونات الصوديوم ٠٫٢٠٠٠٢٪ مع بانثينول وألانتوين للترطيب والراحة',
    '١٠ مل · يُربّت صباحاً ومساءً ويُترك على البشرة',
  ],
  badges: ['مختبر جلدياً', 'صُنع في كوريا', '١٠ مل', 'صباحاً ومساءً'],
  packSize: '١٠ مل',
  usageNote: 'صباحاً ومساءً',
  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّل الدخول للتسوق',
  outOfStock: 'نفد المخزون',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني فوق ١٬٠٠٠ درهم · الشحن من دبي',
  stats: [
    { value: '١٠ مل', label: 'سيروم مكثف يُترك على البشرة' },
    { value: '٢٪', label: 'أربوتين' },
    { value: '٠٫٠٤٪', label: 'أدينوسين' },
    { value: 'صباحاً ومساءً', label: 'كل يوم' },
  ],
  effects: {
    eyebrow: 'النتيجة على محيط العين',
    title: 'ثلاث علامات، وخطوة واحدة خفيفة.',
    intro:
      'صُمم السيروم للعناية بأبرز ما يجعل محيط العين يبدو متعباً: التجاعيد العميقة والهالات والميل إلى الانتفاخ. قوامه الخفيف يجعله الطبقة الأولى المثالية قبل الكريم.',
    cards: [
      {
        title: 'التجاعيد العميقة',
        body: 'يساعد الأدينوسين ٠٫٠٤٪ على تحسين مظهر الخطوط ومنح البشرة الرقيقة حول العين مظهراً أكثر نعومة.',
      },
      {
        title: 'الهالات',
        body: 'يعمل الأربوتين ٢٪ على تفاوت اللون تحت العين، لتبدو المنطقة أكثر إشراقاً وراحة.',
      },
      {
        title: 'مظهر الانتفاخ',
        body: 'تمنح القاعدة المرطبة البشرة إحساساً منعشاً ومظهراً أكثر صفاءً عند الصباح أو بعد يوم طويل.',
      },
    ],
  },
  engine: {
    eyebrow: 'تركيبة مدروسة لمحيط العين',
    title: 'أربوتين ٢٪ وأدينوسين ٠٫٠٤٪ في المقدمة.',
    body:
      'يرتكز السيروم على ثنائي وظيفي واضح: الأربوتين للعناية بمظهر اللون، والأدينوسين للعناية بمظهر التجاعيد. وتكمل هيالورونات الصوديوم والبانثينول والألانتوين هذا الثنائي بترطيب خفيف يناسب البشرة الرقيقة.',
    points: [
      {
        title: 'أربوتين · ٢٪',
        body: 'تركيز كامل يساعد على تقليل مظهر الهالات وتفاوت اللون تحت العين.',
      },
      {
        title: 'أدينوسين · ٠٫٠٤٪',
        body: 'مكوّن وظيفي للعناية بالتجاعيد يساعد على منح محيط العين مظهراً أكثر نعومة.',
      },
      {
        title: 'ترطيب خفيف ومريح',
        body: 'هيالورونات الصوديوم ٠٫٢٠٠٠٢٪ والبانثينول ٠٫١٥٪ والألانتوين ٠٫١٥٪ تساعد على حفظ النعومة والراحة من دون ثقل.',
      },
      {
        title: 'مجموعة ببتيدات داعمة',
        body: 'تضم التركيبة Acetyl Hexapeptide-8 بنسبة ٠٫٠٠٢٥٪ وCopper Tripeptide-1 بنسبة ٠٫٠٠١٪ وPalmitoyl Hexapeptide-12 بنسبة ٠٫٠٠٠٣٪، إلى جانب مزيج Haloxyl الأولي بنسبة ٠٫١٠٪.',
      },
    ],
    figureAlt: 'GENOSYS EyeCell EYE CONTOUR SERUM، أربوتين ٢٪ وأدينوسين ٠٫٠٤٪ في السيروم',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'ربّتي بلطف، ثم أكملي بالكريم.',
    frequency: 'صباحاً ومساءً · يُترك على البشرة',
    steps: [
      {
        title: 'التنظيف',
        body: 'نظّفي محيط العين جيداً من المكياج وبقايا مزيل المكياج وجففيه بلطف.',
      },
      {
        title: 'السيروم',
        body: 'وزّعي كمية صغيرة حول العين وربّتي من الزاوية الداخلية نحو الخارج من دون فرك أو شد.',
      },
      {
        title: 'الكريم',
        body: 'عند استخدام ثنائي EyeCell، ضعي كريم محيط العين بعد امتصاص السيروم للحفاظ على الترطيب.',
      },
      {
        title: 'صباحاً ومساءً',
        body: 'اتركي السيروم على البشرة ولا تشطفيه. يمكن إضافة لصقات الجل في الأيام التي تحتاج إلى عناية مكثفة.',
      },
    ],
    note:
      'لا يُستخدم أثناء الحمل أو الرضاعة. تجنبي ملامسة العين مباشرة، واشطفي جيداً بالماء البارد عند الملامسة.',
    videoTitle: 'شاهدي خطوات العناية',
  },
  actives: {
    eyebrow: 'المكوّنات الرئيسية',
    title: 'تركيزات واضحة، وعناية دقيقة.',
    intro:
      'يتصدر الأربوتين والأدينوسين التركيبة، وتدعمهما مجموعة مرطبة وببتيدات مختارة للعناية اليومية بمحيط العين.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote:
      'كل مكوّن بالترتيب نفسه المطبوع على العبوة التي بين يديك.',
  },
  suited: {
    eyebrow: 'هل يناسب روتينك؟',
    title: 'اختيار دقيق لمحيط العين.',
    forTitle: 'اختاريه إذا',
    forList: [
      'كان هدفك العناية بمظهر الهالات والتجاعيد العميقة والميل إلى الانتفاخ',
      'تفضلين سيروماً خفيفاً مخصصاً للبشرة الرقيقة حول العين',
      'تبحثين عن أربوتين ٢٪ وأدينوسين ٠٫٠٤٪ بتركيزات واضحة',
      'ترغبين في طبقة أولى تنسجم بسهولة تحت الكريم والمكياج',
    ],
    notTitle: 'ابحثي عن غيره إن',
    notList: [
      'كنتِ حاملاً أو مرضعة',
      'كانت البشرة حول العين متضررة أو شديدة التهيج',
      'كنتِ تريدين منتجاً واحداً غنياً بدلاً من سيروم يتبعه كريم',
      'كنتِ تبحثين عن نتيجة طبية أو فورية لا يمكن لمستحضر تجميلي أن يعد بها',
    ],
    note: 'للاستخدام الخارجي فقط. عند ملامسة العين، تُشطف جيداً بالماء البارد. يُوقف الاستخدام وتُطلب المشورة الطبية عند ظهور احمرار أو تورم أو حكة.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'مكان السيروم في روتين EyeCell.',
    intro:
      'ابدئي بالتنظيف، وأضيفي اللصقات عند الحاجة، ثم ربّتي السيروم واختتمي بالكريم. ترتيب بسيط يحافظ على خفة الطبقات وراحة المنطقة.',
    thisProduct: 'هذا المنتج',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الخيارات',
    fromPrice: 'من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'أسئلة شائعة.',
    items: [
      {
        q: 'هل أستخدمه إن كنت حاملاً أو مرضعة؟',
        a: 'لا. تعليمات الاستخدام تنص على تجنبه أثناء الحمل والرضاعة. استشيري طبيبك لاختيار عناية مناسبة لمحيط العين خلال هذه الفترة.',
      },
      {
        q: 'هل يحتوي زيت الفول السوداني؟',
        a: 'لا يحتوي هذا السيروم على زيت الفول السوداني. يوجد الزيت في كريم EyeCell لمحيط العين، لذلك راجعي قائمة مكوّنات كل منتج عند وجود حساسية.',
      },
      {
        q: 'هل الببتيدات هي المكوّنات الأساسية؟',
        a: 'المكوّنان الرئيسيان هما الأربوتين ٢٪ والأدينوسين ٠٫٠٤٪. أما الببتيدات فتأتي كدعم إضافي بتركيزات أقل: Acetyl Hexapeptide-8 بنسبة ٠٫٠٠٢٥٪ وCopper Tripeptide-1 بنسبة ٠٫٠٠١٪ وPalmitoyl Hexapeptide-12 بنسبة ٠٫٠٠٠٣٪.',
      },
      {
        q: 'ما هو Haloxyl؟',
        a: 'Haloxyl اسم لمزيج تجميلي يضم N-Hydroxysuccinimide وChrysin وPalmitoyl Tripeptide-1 وPalmitoyl Tetrapeptide-7. يدخل في السيروم كمزيج أولي بنسبة ٠٫١٠٪ ويكمل العناية بمظهر الهالات.',
      },
      {
        q: 'هل هو خالٍ من العطر؟',
        a: 'لا تتضمن قائمة المكوّنات Parfum أو زيت قشر البرتقال. إذا كانت بشرتك شديدة التحسس للعطور، اختبري كمية صغيرة أولاً.',
      },
      {
        q: 'هل أستخدمه مع الكريم؟',
        a: 'نعم. ضعي السيروم أولاً، ثم كريم EyeCell بعد امتصاصه. ويمكن استخدام لصقات الجل قبل السيروم في الأيام التي تحتاج إلى عناية مكثفة.',
      },
      {
        q: 'كم يبقى بعد الفتح؟',
        a: 'لا توجد مدة موثقة للاستخدام بعد الفتح. التزمي بتاريخ الانتهاء المدون على العبوة واحفظي السيروم في مكان بارد وجاف بعيداً عن الشمس.',
      },
    ],
  },
  details: {
    eyebrow: 'معلومات المنتج',
    title: 'التفاصيل.',
    rows: [
      { label: 'الشكل', value: 'سيروم عين مكثّف يُترك على البشرة' },
      { label: 'الحجم', value: '١٠ مل' },
      { label: 'متى', value: 'صباحاً ومساءً' },
      { label: 'التطبيق', value: 'ربّتي المحيط بلطف، واتركيه' },
      { label: 'المظهر', value: 'سائل لزج أصفر فاتح' },
      { label: 'درجة الحموضة', value: '٥٫٣٧، ضمن النطاق المقبول ٥٫٠٠–٧٫٠٠' },
      { label: 'بعد الفتح', value: 'التزمي بتاريخ الانتهاء المدون على العبوة' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'تنبيه', value: 'تجنّبي أثناء الحمل والرضاعة' },
      { label: 'المنشأ', value: 'صُنع في كوريا الجنوبية' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'خطوة خفيفة، ونظرة أكثر انتعاشاً.',
    body: 'أربوتين ٢٪ وأدينوسين ٠٫٠٤٪ صباحاً ومساءً، ثم كريم EyeCell عند الرغبة.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'كل المنتجات',
}

const RU: EyeSerumCopy = {
  eyebrow: 'EyeCell · Ежедневный уход за контуром глаз',
  headline: 'Сияние и гладкость начинаются с сыворотки.',
  subheadline:
    'Интенсивная сыворотка с арбутином 2% и аденозином 0,04% помогает сделать тёмные круги менее заметными, визуально смягчить глубокие морщины и освежить область под глазами при склонности к припухлости.',
  heroBullets: [
    'Арбутин 2% для более светлого и ровного тона под глазами',
    'Аденозин 0,04% для ежедневного ухода за морщинами',
    'Гиалуронат натрия 0,20002% с пантенолом и аллантоином для увлажнения и комфорта',
    '10 мл · Вбивать утром и вечером, не смывать',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', '10 мл', 'Утро и вечер'],
  packSize: '10 мл',
  usageNote: 'Утро и вечер',
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
    { value: '10 мл', label: 'Интенсивная несмываемая сыворотка' },
    { value: '2%', label: 'Арбутин' },
    { value: '0,04%', label: 'Аденозин' },
    { value: 'Утро и вечер', label: 'Каждый день' },
  ],
  effects: {
    eyebrow: 'Результат для контура глаз',
    title: 'Три признака усталости. Один лёгкий шаг.',
    intro:
      'Сыворотка работает с тем, что чаще всего делает взгляд уставшим: глубокими морщинами, тёмными кругами и склонностью к припухлости. Лёгкая текстура идеально ложится первым слоем перед кремом.',
    cards: [
      {
        title: 'Глубокие морщины',
        body: 'Аденозин 0,04% помогает улучшить вид линий и придаёт тонкой коже вокруг глаз более гладкий вид.',
      },
      {
        title: 'Тёмные круги',
        body: 'Арбутин 2% работает с неровным тоном под глазами, помогая сделать взгляд более светлым и отдохнувшим.',
      },
      {
        title: 'Склонность к припухлости',
        body: 'Увлажняющая основа освежает кожу и помогает области под глазами выглядеть более ухоженной утром или после долгого дня.',
      },
    ],
  },
  engine: {
    eyebrow: 'Формула для тонкой кожи',
    title: 'Арбутин 2% и аденозин 0,04% в главных ролях.',
    body:
      'Основа формулы — арбутин для ухода за неровным тоном и аденозин для ухода за морщинами. Гиалуронат натрия, пантенол и аллантоин дополняют их лёгким увлажнением, подходящим для деликатного контура глаз.',
    points: [
      {
        title: 'Арбутин · 2%',
        body: 'Высокая концентрация помогает сделать тёмные круги и неровный тон под глазами менее заметными.',
      },
      {
        title: 'Аденозин · 0,04%',
        body: 'Функциональный компонент для ухода за морщинами помогает контуру глаз выглядеть более гладким.',
      },
      {
        title: 'Лёгкое увлажнение',
        body: 'Гиалуронат натрия 0,20002%, пантенол 0,15% и аллантоин 0,15% помогают сохранить мягкость и комфорт без ощущения тяжести.',
      },
      {
        title: 'Поддерживающий пептидный комплекс',
        body: 'Формулу дополняют Acetyl Hexapeptide-8 0,0025%, Copper Tripeptide-1 0,001%, Palmitoyl Hexapeptide-12 0,0003% и премикс Haloxyl 0,10%.',
      },
    ],
    figureAlt: 'GENOSYS EyeCell EYE CONTOUR SERUM, арбутин 2% и аденозин 0,04% в сыворотке',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Мягко вбейте, затем нанесите крем.',
    frequency: 'Утро и вечер · Оставить на коже',
    steps: [
      {
        title: 'Очищение',
        body: 'Тщательно удалите макияж и остатки средства для снятия макияжа, затем аккуратно промокните кожу.',
      },
      {
        title: 'Сыворотка',
        body: 'Распределите небольшое количество вокруг глаз и мягко вбейте от внутреннего уголка к внешнему, не растягивая кожу.',
      },
      {
        title: 'Крем',
        body: 'Если используете пару EyeCell, после впитывания сыворотки нанесите крем для сохранения увлажнённости.',
      },
      {
        title: 'Утром и вечером',
        body: 'Не смывайте. В дни интенсивного ухода перед сывороткой можно использовать гелевые патчи.',
      },
    ],
    note:
      'Не использовать во время беременности и грудного вскармливания. Избегайте прямого попадания в глаза; при попадании тщательно промойте прохладной водой.',
    videoTitle: 'Посмотрите, как наносить',
  },
  actives: {
    eyebrow: 'Ключевые компоненты',
    title: 'Точные концентрации для точного ухода.',
    intro:
      'Арбутин и аденозин занимают центральное место, а увлажняющая группа и пептиды дополняют ежедневный уход за контуром глаз.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote:
      'Все ингредиенты в том же порядке, что и на коробке у вас в руках.',
  },
  suited: {
    eyebrow: 'Подойдёт ли вам?',
    title: 'Точный выбор для контура глаз.',
    forTitle: 'Выбирайте, если',
    forList: [
      'Вас беспокоят тёмные круги, глубокие морщины и склонность к припухлости',
      'Вы предпочитаете лёгкую сыворотку, созданную специально для тонкой кожи вокруг глаз',
      'Вам важны точные концентрации арбутина 2% и аденозина 0,04%',
      'Нужен первый слой, который легко сочетается с кремом и макияжем',
    ],
    notTitle: 'Ищите другое, если',
    notList: [
      'Вы беременны или кормите грудью',
      'Кожа вокруг глаз повреждена или сильно раздражена',
      'Вы хотите одно насыщенное средство вместо сочетания сыворотки и крема',
      'Вы ожидаете медицинского или мгновенного результата, который косметика обещать не должна',
    ],
    note: 'Только для наружного применения. При попадании в глаза тщательно промойте прохладной водой. При покраснении, отёке или зуде прекратите использование и обратитесь к врачу.',
  },
  routine: {
    eyebrow: 'Соберите ритуал',
    title: 'Место сыворотки в ритуале EyeCell.',
    intro:
      'Начните с очищения, при необходимости добавьте патчи, затем вбейте сыворотку и завершите кремом. Простая последовательность сохраняет лёгкость слоёв и комфорт кожи.',
    thisProduct: 'Этот продукт',
    viewProduct: 'Смотреть продукт',
    chooseOptions: 'Выбрать опции',
    fromPrice: 'От',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Частые вопросы.',
    items: [
      {
        q: 'Можно ли при беременности или кормлении?',
        a: 'Нет. В инструкции указано не использовать средство во время беременности и грудного вскармливания. Попросите врача подобрать подходящий уход за контуром глаз на этот период.',
      },
      {
        q: 'Есть ли в ней арахисовое масло?',
        a: 'Нет, в сыворотке арахисового масла нет. Оно входит в крем EyeCell для контура глаз, поэтому при аллергии проверяйте состав каждого средства отдельно.',
      },
      {
        q: 'Пептиды - главные активы?',
        a: 'Главные компоненты — арбутин 2% и аденозин 0,04%. Пептиды дополняют формулу в меньших концентрациях: Acetyl Hexapeptide-8 0,0025%, Copper Tripeptide-1 0,001% и Palmitoyl Hexapeptide-12 0,0003%.',
      },
      {
        q: 'Что такое Haloxyl?',
        a: 'Haloxyl — название косметического комплекса из N-Hydroxysuccinimide, Chrysin, Palmitoyl Tripeptide-1 и Palmitoyl Tetrapeptide-7. В сыворотке он используется как премикс 0,10% и дополняет уход за тёмными кругами.',
      },
      {
        q: 'Она без отдушки?',
        a: 'В списке ингредиентов нет Parfum и масла апельсиновой цедры. Если кожа особенно чувствительна к ароматическим компонентам, сначала протестируйте небольшое количество.',
      },
      {
        q: 'Использовать с кремом?',
        a: 'Да. Сначала нанесите сыворотку, затем крем EyeCell. В дни интенсивного ухода перед сывороткой можно использовать гелевые патчи.',
      },
      {
        q: 'Сколько после вскрытия?',
        a: 'Подтверждённый срок после вскрытия не указан. Ориентируйтесь на дату окончания срока годности на упаковке и храните сыворотку в прохладном сухом месте вдали от солнца.',
      },
    ],
  },
  details: {
    eyebrow: 'Информация о продукте',
    title: 'Подробности.',
    rows: [
      { label: 'Формат', value: 'Интенсивная несмываемая сыворотка для контура глаз' },
      { label: 'Объём', value: '10 мл' },
      { label: 'Когда', value: 'Утро и вечер' },
      { label: 'Нанесение', value: 'Мягко похлопать контур, оставить' },
      { label: 'Вид', value: 'Светло-жёлтая вязкая жидкость' },
      { label: 'pH', value: '5,37; допустимый диапазон 5,00–7,00' },
      { label: 'После вскрытия', value: 'Ориентируйтесь на срок годности на упаковке' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Осторожно', value: 'Избегать при беременности и лактации' },
      { label: 'Происхождение', value: 'Сделано в Южной Корее' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Лёгкий шаг для более свежего взгляда.',
    body: 'Арбутин 2% и аденозин 0,04% утром и вечером, затем крем EyeCell при желании.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const COPY: Record<EyeSerumLocale, EyeSerumCopy> = { en: EN, ar: AR, ru: RU }

export function getEyeSerumCopy(locale: string): EyeSerumCopy {
  if (locale === 'ar' || locale === 'ru') return COPY[locale]
  return EN
}
