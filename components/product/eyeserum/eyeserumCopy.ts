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
      'Registered Formula_up list in descending order. The carton lifts some peptide names earlier. This list is not claimed to match every language panel.',
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
  eyebrow: 'EyeCell · سيروم العين اليومي',
  headline: 'ابدئي بالسيروم.',
  subheadline:
    'سيروم شامل مكثّف لمحيط العين. التجاعيد العميقة والهالات وانتفاخ العين. أربوتين ٢٪ هو الرقم الذي يستحق بطاقة.',
  heroBullets: [
    'أربوتين ٢٪ لإشراق أوضح تحت العين',
    'أدينوسين ٠٫٠٤٪ هو شريك العناية الوظيفية بالتجاعيد',
    'صباحاً ومساءً، ربّتي بلطف ثم اتركي السيروم',
    '١٠ مل. اختمي بكريم محيط العين عندما تريدين خطوة EyeCell كاملة',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', '١٠ مل يُترك على البشرة', 'صباحاً ومساءً'],
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
    { value: '١٠ مل', label: 'سيروم مكثّف يُترك على البشرة' },
    { value: '٢٪', label: 'أربوتين' },
    { value: '٠٫٠٤٪', label: 'أدينوسين' },
    { value: 'صباحاً ومساءً', label: 'كل يوم' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'سيروم واحد. ثلاثة أهداف.',
    intro:
      'العبوة الإنجليزية تكتب المهمة بثلاث عبارات: التجاعيد العميقة والهالات وانتفاخ العين. هذه هي الطبقة الأولى. الكريم يختم بعدها.',
    cards: [
      {
        title: 'التجاعيد العميقة',
        body: 'مظهر أنعم للخطوط التي تظهر أولاً حول العين. أدينوسين ٠٫٠٤٪ هو المكوّن الوظيفي الكوري للعناية بالتجاعيد في هذا السيروم.',
      },
      {
        title: 'الهالات',
        body: 'تحت عين أسطع وأكثر راحة. أربوتين ٢٪ هو مكوّن التفتيح الوظيفي. Haloxyl هو اسم المصنّع لمركب الدعم الذي يجلس معه.',
      },
      {
        title: 'انتفاخ العين',
        body: 'إحساس أنضر وأقل انتفاخاً تحت العين. السيروم هو الطبقة الأولى. هذا مظهر، لا علاج تصريف.',
      },
    ],
  },
  engine: {
    eyebrow: 'السيروم',
    title: 'أربوتين ٢٪ هو الرقم الذي يستحق بطاقة.',
    body:
      'الزوج الوظيفي الكوري هو أربوتين ٢٪ وأدينوسين ٠٫٠٤٪. هذا هو المنتج. الببتيدات تجلس بتركيز تجميلي ضئيل. Haloxyl اسم لخليط جاهز بنسبة ٠٫١٠٪، لا مكوّن نشط بنسبة ٠٫١٠٪. هيالورونات الصوديوم ٠٫٢٠٪ هي الطبقة الخفيفة.',
    points: [
      {
        title: 'أربوتين · ٢٪',
        body: 'مكوّن التفتيح الوظيفي. هذا هو الرقم الذي يستحق بطاقة. أحدث دفعة جاءت داخل مواصفة الـ ٢٪.',
      },
      {
        title: 'أدينوسين · ٠٫٠٤٪',
        body: 'شريك العناية الوظيفية بالتجاعيد. نفس طبقة الادّعاء في الترخيص الكوري: مساعدة مظهر الخطوط، لا قصة إرخاء عضلات.',
      },
      {
        title: 'الطبقة الخفيفة',
        body: 'هيالورونات الصوديوم ٠٫٢٠٪ والبانثينول ٠٫١٥٪ والألانتوين ٠٫١٥٪ تجلس بنسب حقيقية. تجعل السيروم يشعر كسيروم، ثم يختم الكريم.',
      },
      {
        title: 'الببتيدات وHaloxyl يجلسان في السيروم',
        body: 'Acetyl Hexapeptide-8 الجاهز ٠٫٠٠٢٥٪. Copper Tripeptide-1 بنسبة ٠٫٠٠١٪. Palmitoyl Hexapeptide-12 بنسبة ٠٫٠٠٠٣٪. Haloxyl اسم المصنّع لمركب دعم الهالات، خليط جاهز بنسبة ٠٫١٠٪. هي في التركيبة. ليست المحرّك.',
      },
    ],
    figureAlt: 'GENOSYS EyeCell EYE CONTOUR SERUM، أربوتين ٢٪ وأدينوسين ٠٫٠٤٪ في السيروم',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'ربّتي السيروم. الكريم يختم.',
    frequency: 'صباحاً ومساءً · يُترك على البشرة',
    steps: [
      {
        title: 'التنظيف',
        body: 'نظّفي محيط العين. السيروم يوضع على بشرة هادئة، لا فوق مزيل مكياج ما زال جالساً.',
      },
      {
        title: 'السيروم',
        body: 'كمية صغيرة على المحيط. ربّتي بلطف من الزاوية الداخلية إلى الخارج حتى يستقر. لا تفركي.',
      },
      {
        title: 'الكريم',
        body: 'كريم محيط العين بعدها عندما تستخدمين الثنائي. السيروم هو الطبقة الأولى. الكريم هو الختم.',
      },
      {
        title: 'يُترك',
        body: 'صباحاً ومساءً. لا تشطفي. لصقات الجل الببتيدية اختيارية في الأيام المكثّفة.',
      },
    ],
    note:
      'تجنّبي الاستخدام أثناء الحمل والرضاعة. العبوة تقول ذلك. أبعديه عن العين. إن لامسها، اشطفي بماء بارد.',
    videoTitle: 'شاهدي الطقس',
  },
  actives: {
    eyebrow: 'ماذا فيه',
    title: 'الزوج الوظيفي، مع الأرقام.',
    intro:
      'البطاقات أدناه هي أجزاء السيروم التي تعمل. قائمة INCI المسجّلة الكاملة تحت القائمة.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote:
      'قائمة Formula_up المسجّلة بترتيب تنازلي. الكرتون يرفع بعض أسماء الببتيدات أعلى. لا ندّعي أن هذه القائمة تطابق كل لوحة لغة.',
  },
  suited: {
    eyebrow: 'هل يناسبك',
    title: 'إجابة صادقة.',
    forTitle: 'يناسبك إن',
    forList: [
      'أردتِ سيروماً مكثّفاً كطبقة أولى للتجاعيد العميقة والهالات وانتفاخ العين',
      'ستربّتينه صباحاً ومساءً ثم تختمين بالكريم',
      'أردتِ الزوج الوظيفي الكوري على البطاقة: أربوتين ٢٪ وأدينوسين ٠٫٠٤٪',
      'يمكنك الإبقاء على سيروم عين مخصّص، لا سيروم وجه يُسحب إلى الحاجب',
    ],
    notTitle: 'ابحثي عن غيره إن',
    notList: [
      'كنتِ حاملاً أو مرضعة. العبوة تقول تجنّبي',
      'كانت البشرة حول العين مكسورة أو تلسع أصلاً',
      'أردتِ قصة شبيهة بالبوتوكس أو إعادة عشر سنوات. هذا ليس هذا السيروم',
      'أردتِ منتجاً يبدأ بالكريم. هذه هي الطبقة الأولى. الكريم هو ٢٤',
    ],
    note: 'للاستخدام الخارجي فقط. إن وصل إلى العين، اشطفي بماء بارد. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو حكّة.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'أين يجلس السيروم.',
    intro:
      'نظّفي، لصقات اختيارية في الأيام المكثّفة، هذا السيروم، ثم الكريم. السيروم يوصل. الكريم يختم.',
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
        a: 'لا. العبوة الإنجليزية تقول تجنّبي الاستخدام أثناء الحمل والرضاعة. لا إستر ريتينيل ولا زيت فول سوداني في هذا السيروم، والتنبيه ما زال قائماً. اسألي طبيبك قبل أي سيروم عين في تلك الفترة.',
      },
      {
        q: 'هل يحتوي زيت الفول السوداني؟',
        a: 'لا. زيت الفول السوداني في كريم محيط العين، لا في هذا السيروم. العبوة ما زالت تقول تجنّبي أثناء الحمل والرضاعة.',
      },
      {
        q: 'هل الببتيدات هي المكوّنات الأساسية؟',
        a: 'لا. Acetyl Hexapeptide-8 الجاهز ٠٫٠٠٢٥٪. Copper Tripeptide-1 بنسبة ٠٫٠٠١٪. Palmitoyl Hexapeptide-12 بنسبة ٠٫٠٠٠٣٪. أوراق أقدم سردت محاليل خليط بنسب أعلى بكثير. الرقمان اللذان يستحقان بطاقة هما أربوتين ٢٪ وأدينوسين ٠٫٠٤٪.',
      },
      {
        q: 'ما هو Haloxyl؟',
        a: 'اسم المصنّع لمركب دعم الهالات: N-Hydroxysuccinimide وChrysin وPalmitoyl Tripeptide-1 وPalmitoyl Tetrapeptide-7، يُباع كخليط جاهز بنسبة ٠٫١٠٪. هو اسم، لا مكوّن نشط بنسبة ٠٫١٠٪، ولا علاج لتصفية الهيموغلوبين.',
      },
      {
        q: 'ماذا يعني «10 Years Back»؟',
        a: 'سطر على بعض رسوم الزجاجة، وأحياناً يُكتب Turn Years Back. ليس على العمل الفني المسجّل، وليس دراسة مقيسة. العبوة تبيع سيروماً مكثّفاً للتجاعيد العميقة والهالات وانتفاخ العين.',
      },
      {
        q: 'هل هو خالٍ من العطر؟',
        a: 'لا يوجد سطر Parfum ولا زيت قشر برتقال. العبوة لا تطبع خالياً من العطر، وهذه الصفحة لا تطبعه أيضاً.',
      },
      {
        q: 'هل أستخدمه مع الكريم؟',
        a: 'نعم، عندما تريدين ثنائي EyeCell. السيروم أولاً، الكريم ثانياً. الكريم هو الختم. لصقات الجل الببتيدية اختيارية في الأيام المكثّفة.',
      },
      {
        q: 'كم يبقى بعد الفتح؟',
        a: 'تقييم السلامة لا يوثّق PAO. استخدمي تاريخ الانتهاء على العلبة. لا نخترع عدد أشهر.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل.',
    rows: [
      { label: 'الشكل', value: 'سيروم عين مكثّف يُترك على البشرة' },
      { label: 'الحجم', value: '١٠ مل' },
      { label: 'متى', value: 'صباحاً ومساءً' },
      { label: 'التطبيق', value: 'ربّتي المحيط بلطف، واتركيه' },
      { label: 'المظهر', value: 'سائل لزج أصفر فاتح' },
      { label: 'درجة الحموضة', value: '٥٫٣٧، داخل مواصفة ٦٫٠٠ ± ١٫٠٠' },
      { label: 'بعد الفتح', value: 'غير موثّق. استخدمي تاريخ الانتهاء على العلبة' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'تنبيه', value: 'تجنّبي أثناء الحمل والرضاعة' },
      { label: 'المنشأ', value: 'صنع في كوريا، DTS MG' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'ابدئي بالسيروم.',
    body: 'أربوتين ٢٪. صباحاً ومساءً. ثم يختم الكريم.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'كل المنتجات',
}

const RU: EyeSerumCopy = {
  eyebrow: 'EyeCell · Ежедневная сыворотка для глаз',
  headline: 'Начните с сыворотки.',
  subheadline:
    'Интенсивная сыворотка «всё в одном» для контура глаз. Глубокие морщины, тёмные круги и припухлость. Арбутин 2% - цифра, которой место на карточке.',
  heroBullets: [
    'Арбутин 2% для более светлого вида под глазами',
    'Аденозин 0,04% - функциональная пара для ухода за морщинами',
    'Утром и вечером, мягкое похлопывание, затем оставить',
    '10 мл. Закрепите кремом для контура глаз, когда нужен полный шаг EyeCell',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', '10 мл leave-on', 'Утро и вечер'],
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
    { value: '10 мл', label: 'Интенсивная сыворотка leave-on' },
    { value: '2%', label: 'Арбутин' },
    { value: '0,04%', label: 'Аденозин' },
    { value: 'Утро и вечер', label: 'Каждый день' },
  ],
  effects: {
    eyebrow: 'Что делает',
    title: 'Одна сыворотка. Три цели.',
    intro:
      'Английская упаковка пишет работу тремя фразами: глубокие морщины, тёмные круги и припухлость. Это первый слой. Крем закрепляет после.',
    cards: [
      {
        title: 'Глубокие морщины',
        body: 'Более гладкий вид линий, которые садятся вокруг глаза первыми. Аденозин 0,04% - корейский функциональный актив для морщин в этой сыворотке.',
      },
      {
        title: 'Тёмные круги',
        body: 'Более светлый, отдохнувший вид под глазами. Арбутин 2% - функциональный осветляющий актив. Haloxyl - имя производителя для поддерживающего комплекса рядом с ним.',
      },
      {
        title: 'Припухлость',
        body: 'Более свежее, менее пастозное ощущение под глазами. Сыворотка - первый слой. Это вид, не дренажная процедура.',
      },
    ],
  },
  engine: {
    eyebrow: 'Сыворотка',
    title: 'Арбутин 2% - цифра, которой место на карточке.',
    body:
      'Корейская функциональная пара - арбутин 2% и аденозин 0,04%. Это и есть продукт. Пептиды сидят в косметическом следе. Haloxyl - имя для 0,10% премикса, не 0,10% актива. Гиалуронат натрия 0,20% - водный лёгкий слой.',
    points: [
      {
        title: 'Арбутин · 2%',
        body: 'Осветляющий функциональный актив. Это цифра, которой место на карточке. Последняя партия вошла в спецификацию 2%.',
      },
      {
        title: 'Аденозин · 0,04%',
        body: 'Функциональная пара для морщин. Тот же класс заявления, что и корейская лицензия: вид линий, не история про расслабление мышц.',
      },
      {
        title: 'Водный лёгкий слой',
        body: 'Гиалуронат натрия 0,20%, пантенол 0,15% и аллантоин 0,15% стоят на реальных уровнях. Они делают сыворотку сывороткой, затем крем закрепляет.',
      },
      {
        title: 'Пептиды и Haloxyl сидят в сыворотке',
        body: 'Готовый Acetyl Hexapeptide-8 - 0,0025%. Copper Tripeptide-1 - 0,001%. Palmitoyl Hexapeptide-12 - 0,0003%. Haloxyl - имя производителя для комплекса поддержки тёмных кругов, 0,10% премикс. Они в формуле. Они не двигатель.',
      },
    ],
    figureAlt: 'GENOSYS EyeCell EYE CONTOUR SERUM, арбутин 2% и аденозин 0,04% в сыворотке',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Похлопайте сыворотку. Крем закрепляет.',
    frequency: 'Утро и вечер · Оставить на коже',
    steps: [
      {
        title: 'Очищение',
        body: 'Очистите контур глаз. Сыворотка идёт на спокойную кожу, не поверх ещё сидящего ремувера.',
      },
      {
        title: 'Сыворотка',
        body: 'Небольшое количество на контур. Мягко похлопайте от внутреннего угла наружу, пока не сядет. Не тереть.',
      },
      {
        title: 'Крем',
        body: 'Затем Eye Contour Cream, когда используете пару. Сыворотка - первый слой. Крем закрепляет.',
      },
      {
        title: 'Оставить',
        body: 'Утром и вечером. Не смывать. Пептидные гелевые патчи - по желанию в интенсивные дни.',
      },
    ],
    note:
      'Не использовать во время беременности и кормления. Так говорит упаковка. Не допускать попадания в глаз. При контакте промыть прохладной водой.',
    videoTitle: 'Ритуал',
  },
  actives: {
    eyebrow: 'Что внутри',
    title: 'Функциональная пара, с цифрами.',
    intro:
      'Карточки ниже - части сыворотки, которые работают. Полный зарегистрированный INCI под списком.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote:
      'Зарегистрированный список Formula_up в убывающем порядке. Картон поднимает часть пептидных имён выше. Мы не утверждаем, что список совпадает с каждой языковой панелью.',
  },
  suited: {
    eyebrow: 'Вам ли она',
    title: 'Честный ответ.',
    forTitle: 'Подойдёт, если',
    forList: [
      'Нужна интенсивная сыворотка первым слоем от глубоких морщин, тёмных кругов и припухлости',
      'Будете наносить её утром и вечером, затем закреплять кремом',
      'Хотите корейскую функциональную пару на карточке: арбутин 2% и аденозин 0,04%',
      'Готовы держать отдельную сыворотку для глаз, а не тянуть сыворотку для лица к брови',
    ],
    notTitle: 'Ищите другое, если',
    notList: [
      'Вы беременны или кормите. Упаковка говорит избегать',
      'Кожа вокруг глаза повреждена или уже щиплет',
      'Нужна история про ботокс или откат на десять лет. Это не эта сыворотка',
      'Нужен продукт, который начинается с крема. Это первый слой. Крем - 24',
    ],
    note: 'Только наружно. Если попало в глаз, промойте прохладной водой. Прекратите и обратитесь к врачу при покраснении, отёке или зуде.',
  },
  routine: {
    eyebrow: 'Соберите ритуал',
    title: 'Где стоит сыворотка.',
    intro:
      'Очищение, патчи по желанию в интенсивные дни, эта сыворотка, затем крем. Сыворотка доставляет. Крем закрепляет.',
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
        a: 'Нет. Английская упаковка говорит избегать применения во время беременности и лактации. В этой сыворотке нет эфира ретинола и нет арахисового масла, и предупреждение всё равно стоит. Спросите врача перед любой сывороткой для глаз в этом окне.',
      },
      {
        q: 'Есть ли в ней арахисовое масло?',
        a: 'Нет. Арахисовое масло есть в креме для контура глаз, не в этой сыворотке. Упаковка всё равно говорит избегать при беременности и лактации.',
      },
      {
        q: 'Пептиды - главные активы?',
        a: 'Нет. Готовый Acetyl Hexapeptide-8 - 0,0025%. Copper Tripeptide-1 - 0,001%. Palmitoyl Hexapeptide-12 - 0,0003%. Старые листы указывали растворы премиксов с гораздо более высокими процентами. Цифры для карточки - арбутин 2% и аденозин 0,04%.',
      },
      {
        q: 'Что такое Haloxyl?',
        a: 'Имя производителя для комплекса поддержки тёмных кругов: N-Hydroxysuccinimide, Chrysin, Palmitoyl Tripeptide-1 и Palmitoyl Tetrapeptide-7, продаётся как 0,10% премикс. Это имя, не 0,10% актив и не лечение по клиренсу гемоглобина.',
      },
      {
        q: 'Что значит «10 Years Back»?',
        a: 'Строка на некоторых рендерах флакона, иногда написано Turn Years Back. Её нет на зарегистрированном артворке, и это не измеренное исследование. Упаковка продаёт интенсивную сыворотку от глубоких морщин, тёмных кругов и припухлости.',
      },
      {
        q: 'Она без отдушки?',
        a: 'Строки Parfum нет и нет масла цедры апельсина. Упаковка всё равно не пишет «без отдушки», поэтому эта страница тоже не пишет.',
      },
      {
        q: 'Использовать с кремом?',
        a: 'Да, когда нужна пара EyeCell. Сначала сыворотка, затем крем. Крем закрепляет. Пептидные гелевые патчи - по желанию в интенсивные дни.',
      },
      {
        q: 'Сколько после вскрытия?',
        a: 'Оценка безопасности не документирует PAO. Смотрите срок на коробке. Мы не придумываем число месяцев.',
      },
    ],
  },
  details: {
    eyebrow: 'Спецификация',
    title: 'Подробности.',
    rows: [
      { label: 'Формат', value: 'Интенсивная сыворотка leave-on для глаз' },
      { label: 'Объём', value: '10 мл' },
      { label: 'Когда', value: 'Утро и вечер' },
      { label: 'Нанесение', value: 'Мягко похлопать контур, оставить' },
      { label: 'Вид', value: 'Светло-жёлтая вязкая жидкость' },
      { label: 'pH', value: '5,37, в спецификации 6,00 ± 1,00' },
      { label: 'После вскрытия', value: 'Не документировано. Смотрите срок на коробке' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Осторожно', value: 'Избегать при беременности и лактации' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Начните с сыворотки.',
    body: 'Арбутин 2%. Утро и вечер. Затем крем закрепляет.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const COPY: Record<EyeSerumLocale, EyeSerumCopy> = { en: EN, ar: AR, ru: RU }

export function getEyeSerumCopy(locale: string): EyeSerumCopy {
  if (locale === 'ar' || locale === 'ru') return COPY[locale]
  return EN
}
