/**
 * Bespoke copy for MULTI FUNCTIONAL ANTI-WRINKLE CREAM (product 32).
 *
 * SOURCING - every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_32_ANTI_WRINKLE_CREAM_SOURCE_AUDIT.md:
 *   - DTS MG signed formula: glycerin 8.00%, niacinamide 2.00%, mango seed
 *     butter 0.800%, dimethicone 0.800%, hydroxyacetophenone 0.500%, allantoin
 *     0.100%, bakuchiol 0.100%, adenosine 0.040%, roughly 13% emollients, and
 *     NO peptides.
 *   - EU safety assessment ID 24 06 00720 (the serum's is 00721): patch test
 *     graded "Non Irritant" by Dr Koziej; mango butter checked against a CIR
 *     maximum reported use of 5%.
 *   - COA lot PB001: pH 6.23, 51.11 g, specific gravity 0.9860, niacinamide
 *     assayed 101.30%, adenosine 95.50%, three pathogens not detected.
 *   - Dhaliwal et al., Br J Dermatol 2019;180(2):289-296 for the bakuchiol
 *     concentration behind the retinol comparison.
 *
 * THE SPINE OF THIS PAGE is the comparison with the serum, because the two are
 * genuinely different formulas and the certificates prove it. The serum is
 * 25.45% glycerin and weighs MORE than water (specific gravity 1.0689). This
 * cream is 8% glycerin with ~13% oils and weighs LESS than water (0.9860). One
 * pulls water in, the other holds it there. That is an honest reason to own both
 * rather than an upsell.
 *
 * The cream is also the more honest of the pair: it has no peptides at all, so
 * there is nothing here being sold as six mechanisms at parts per million.
 *
 * MUST STAY OUT:
 *   - The P&K clinical study. Same citation as the serum, still no report on the
 *     drive, so nothing from it appears.
 *   - Barrier or dermal mechanisms from the ceramide liposome, collagen or
 *     elastin. All at 0.1 to 1 ppm.
 *   - The deck's "safe without side effects" and "prevents acne" bakuchiol
 *     claims (slide 6).
 *   - Any suggestion the bakuchiol matches retinol at this concentration.
 *   - The contract manufacturer's name, and the lot code.
 */

import { ANTI_WRINKLE_CREAM_LOCALIZED_COPY } from './antiWrinkleCreamLocalizedCopy'

export type Locale = 'en' | 'ar' | 'ru'

export interface AntiWrinkleCreamCopy {
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

  /* Two sizes, 50 g and 250 g, both real SKUs with their own prices. A size has to
     travel with every cart call - see the product page component. */
  chooseSize: string
  sizes: {
    homecareLabel: string
    homecareNote: string
    proLabel: string
    proNote: string
  }
  freeDelivery: string

  stats: Array<{ value: string; label: string }>

  pair: {
    eyebrow: string
    title: string
    intro: string
    columns: { row: string; serum: string; cream: string }
    rows: Array<{ label: string; serum: string; cream: string; highlight?: boolean }>
    body: string
    aside: string
  }

  working: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  peptideFree: {
    eyebrow: string
    title: string
    body: string
  }

  bakuchiol: {
    eyebrow: string
    title: string
    body: string
  }

  quality: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    patch: string
  }

  reformulation: {
    eyebrow: string
    title: string
    body: string
    before: { title: string; items: string[] }
    after: { title: string; items: string[] }
  }

  fragrance: {
    eyebrow: string
    title: string
    body: string
  }

  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
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

const EN: AntiWrinkleCreamCopy = {
  eyebrow: 'Multi Functional Anti-Wrinkle Cream · 50 g',
  headline: 'The lid on the serum. Not a thicker version of it.',
  subheadline:
    'Around 13% of this tube is oils and butters - including mango seed butter at 0.8% - over glycerin at 8%, niacinamide at 2% and adenosine at the dose Korea licenses for wrinkle improvement. Where the serum draws water into skin, this holds it there. Different formula, different job, and the certificates show it.',
  heroBullets: [
    'Niacinamide 2%, measured at 101.30% of declaration on the batch',
    'Adenosine 0.04%, measured at 95.50% - the licensed wrinkle dose',
    'Mango seed butter at 0.8%, a real emollient dose',
    'No peptides at all - nothing here sold at parts per million',
  ],
  badges: ['Made in Korea', '50 g', 'EU safety assessed', 'Graded Non Irritant'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  chooseSize: 'Choose your size',
  sizes: {
    homecareLabel: 'Homecare',
    homecareNote: 'The 50 g size, for a daily routine at home',
    proLabel: 'Professional',
    proNote: 'The 250 g size, for clinic use',
  },
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '13%', label: 'Oils and butters, against the serum\u2019s 2.4%' },
    { value: '2%', label: 'Niacinamide, assayed at 101.30%' },
    { value: '0.8%', label: 'Mango seed butter' },
    { value: '0.9860', label: 'Specific gravity - lighter than water' },
  ],

  pair: {
    eyebrow: 'Serum or cream',
    title: 'Two different formulas, and the proof is on the paperwork',
    intro:
      'People assume a matching serum and cream are the same thing at two thicknesses. These are not. Put the two quantitative formulas side by side and they are built for opposite halves of the same job.',
    columns: { row: '', serum: 'Anti-Wrinkle Serum', cream: 'This cream' },
    rows: [
      { label: 'Glycerin', serum: '25.45%', cream: '8.00%', highlight: true },
      { label: 'Oils and butters', serum: '~2.4%', cream: '~13.0%', highlight: true },
      { label: 'Niacinamide', serum: '2.00%', cream: '2.00%' },
      { label: 'Adenosine', serum: '0.04%', cream: '0.04%' },
      { label: 'Bakuchiol', serum: '0.100%', cream: '0.100%' },
      { label: 'Peptides', serum: 'Six, ~1.4 ppm', cream: 'None' },
      { label: 'Mango seed butter', serum: 'None', cream: '0.800%' },
      { label: 'Specific gravity', serum: '1.0689', cream: '0.9860', highlight: true },
    ],
    body:
      'Look at the last row. The serum weighs more than water because a quarter of it is glycerin. This cream weighs less than water because it is loaded with oils. Two certificates of analysis, two numbers either side of 1.000, and between them a physical fingerprint of the difference - not a marketing distinction.',
    aside:
      'Which gives the only honest reason to own both: a humectant pulls water into the top layers of skin, and an occlusive stops it leaving again. The serum\u2019s own instructions say to follow it with a moisturiser. This is that moisturiser. If you only want one, take the cream in winter or on dry skin and the serum in humidity or on oily skin.',
  },

  working: {
    eyebrow: 'The working formula',
    title: 'What is actually at a dose',
    intro:
      'Eight ingredients do the work here, and the two with regulatory thresholds behind them were both measured on the batch rather than merely declared.',
    items: [
      {
        name: 'Emollients and structure',
        dose: '~13%',
        body: 'Ethylhexyl palmitate 4%, cetearyl alcohol 3%, caprylic/capric triglyceride 2.4%, butylene glycol dicaprylate 2%, dimethicone 0.8%. This is what makes it a cream rather than a lotion, and what keeps water in once it is there.',
      },
      {
        name: 'Glycerin',
        dose: '8.00%',
        body: 'A serious humectant load for a cream, though a third of what the serum carries. Enough to hold water on its own; better still under the serum.',
      },
      {
        name: 'Niacinamide',
        dose: '2.00%',
        body: 'Vitamin B3 for uneven tone and barrier support. Assayed on this batch at 101.30% of declaration - slightly over, comfortably inside spec.',
      },
      {
        name: 'Mango seed butter',
        dose: '0.800%',
        body: 'A genuine emollient dose. The safety assessment checked it against a maximum reported use of 5% in leave-on products, so it sits well inside that. It is also the ingredient the serum\u2019s deck listed by mistake - it belongs here.',
      },
      {
        name: 'Adenosine',
        dose: '0.040%',
        body: 'The exact dose Korea licenses for wrinkle improvement, assayed at 95.50%. The only anti-wrinkle active in the tube with a regulatory threshold behind it.',
      },
      {
        name: 'Bakuchiol and allantoin',
        dose: '0.100% each',
        body: 'Bakuchiol at the same level as the serum, with the same caveat below. Allantoin at a working dose for comfort.',
      },
    ],
  },

  peptideFree: {
    eyebrow: 'A point in its favour',
    title: 'There are no peptides in here at all',
    body:
      'The matching serum carries six peptides from genuinely premium materials, at between 0.05 and 1.1 parts per million, and its deck attributes a separate mechanism to each. This cream simply does not contain them - so there is nothing here being sold to you at a millionth of a gram. What remains at trace is smaller and we will name it anyway: the ceramide, cholesterol and phytosphingosine sold as a barrier liposome sit at 0.1 ppm each, hydrolyzed collagen at 0.1 ppm, elastin at 1 ppm and propolis at 10 ppm. Buy this tube for the 13% of emollients, the glycerin, the niacinamide and the adenosine.',
  },

  bakuchiol: {
    eyebrow: 'The same caveat as the serum',
    title: 'Bakuchiol at 0.1%',
    body:
      'Identical to the serum: 0.100%, genuinely present, photostable and gentle in a way retinol is not. And identically, the study behind the retinol comparison - Dhaliwal and colleagues, British Journal of Dermatology 2019 - used bakuchiol at 0.5% applied twice daily, five times this concentration. Neither this cream nor the serum has its bakuchiol assayed on the certificate, unlike the niacinamide and the adenosine. Treat it as a welcome extra rather than a retinoid replacement, and buy the tube for the ingredients that were measured.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea, released against a written specification, and assessed under European cosmetics law in a 42-page dossier submitted alongside the serum\u2019s.',
    rows: [
      { label: 'pH', value: '6.23 at 25 °C, inside a 5.00-7.00 specification' },
      { label: 'Fill', value: '51.11 g against a 50 g declaration' },
      { label: 'Specific gravity', value: '0.9860 - lighter than water, because of the oil load' },
      { label: 'Viscosity', value: '12,930 fresh and 19,900 after 24 hours, both inside spec' },
      { label: 'Niacinamide', value: 'Assayed at 101.30% of the declared 2%' },
      { label: 'Adenosine', value: 'Assayed at 95.50% of the declared 0.04%' },
      { label: 'Purity', value: 'Under 10 cfu/g, against a permitted 100' },
      { label: 'Pathogens', value: 'S. aureus, P. aeruginosa and C. albicans - all not detected' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
    ],
    patch:
      'The patch test behind the "dermatologically tested" line came back graded Non Irritant rather than simply passing - the same result the serum got, from the same laboratory. The assessor notes the volunteer count is small, so read it as reassurance about the formula rather than proof about your skin.',
  },

  reformulation: {
    eyebrow: 'If you used the old cream',
    title: 'What changed, and what stayed',
    body:
      'This cream replaced an earlier product called Intensive Multi Functional Cream. The manufacturer\u2019s own documentation records the swap, and it is worth knowing if you are coming back to a cream you used years ago: the texture, the fragrance and the dual anti-wrinkle and brightening function were all deliberately kept.',
    before: {
      title: 'Dropped from the old formula',
      items: [
        'Lactobacillus and pumpkin ferment extract',
        'The mung bean, birch bark and sorrel root trio',
      ],
    },
    after: {
      title: 'Brought in',
      items: ['Bakuchiol', 'Propolis extract', 'Hydrolyzed collagen and elastin'],
    },
  },

  fragrance: {
    eyebrow: 'If you screen your ingredients',
    title: 'More scented than the serum',
    body:
      'Lavender oil at 0.0413%, which is over twice the serum\u2019s 0.0186%, and two declared allergens rather than one: linalool at 0.0266% and limonene at 0.0021%. Both are named because European law requires it. It is essential oil rather than synthetic perfume and the amounts are small, but if you got on with the serum on fragrance grounds, know that this tube carries more of it. Our Blemish Balm Cream is the fragrance-free option in the range.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Last step, morning and night',
    frequency: 'Twice daily · over serum, under sunscreen',
    steps: [
      {
        title: 'Serum first, if you use one',
        body: 'Apply the Anti-Wrinkle Serum to damp skin, then this over the top. The serum brings water in and the cream keeps it there - in that order the pair does something neither does alone.',
      },
      {
        title: 'A pea-sized amount, warmed',
        body: 'Warm it between your fingertips first so the butters soften, then press it over face and neck. It is a rich cream and it goes further than it looks.',
      },
      {
        title: 'Massage gently upward',
        body: 'The manufacturer specifies a gentle massage, which is worth doing for the 30 seconds it takes - it helps the oil phase spread evenly rather than sitting in patches.',
      },
      {
        title: 'Sunscreen over it in the morning',
        body: 'Bakuchiol is photostable so there is no reason to keep this to the evening, but niacinamide and adenosine both work better on skin that is not being photodamaged in the meantime.',
      },
    ],
    note:
      'No acids, no retinoids and no exfoliants, so it does not compete with anything else in a routine. On very oily skin the 13% oil phase may be more than you want in humidity - the serum alone is the lighter half of the pair.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the tube',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the box in your hand.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Contains lavender oil with linalool and limonene declared. Patch test if you react to fragrance.',
      'For external use only. Do not use near the eyes. Avoid the eyes and mucous membranes, and rinse thoroughly with cool water on contact.',
      'Stop and see a doctor if redness, swelling or irritation appears.',
      'Assessed as safe under EC Regulation 1223/2009 and graded Non Irritant on patch test.',
      'If you are pregnant, ask your doctor before starting any new active - bakuchiol is not retinol, but that conversation is theirs to have with you.',
      'Store cool and dry, out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS box, plus the fragrance disclosure from the quantitative formula.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '50 g homecare · a 250 g professional size also exists' },
      { label: 'Texture', value: 'Opaque white cream, rich' },
      { label: 'Actives at dose', value: 'Glycerin 8.00%, niacinamide 2.00%, mango seed butter 0.800%, adenosine 0.040%' },
      { label: 'Bakuchiol', value: '0.100% - one fifth of the concentration in the retinol comparison study' },
      { label: 'Peptides', value: 'None' },
      { label: 'Fragranced', value: 'Yes - lavender oil 0.0413%, with linalool and limonene declared' },
      { label: 'pH', value: '5.00-7.00 (6.23 on the batch tested)' },
      { label: 'Licence', value: 'Korean dual-function: wrinkle improvement and brightening' },
      { label: 'Assessment', value: 'EU safety assessment; patch test graded Non Irritant' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Do I need both the serum and the cream?',
        a: 'Not necessarily, but they are genuinely designed to work together rather than as a size upgrade. The serum is 25.45% glycerin and pulls water into skin; this cream is about 13% oils and butters and stops it leaving. If you buy one: the cream on dry skin or in winter, the serum on oily skin or in humidity.',
      },
      {
        q: 'How is this different from the serum, really?',
        a: 'The certificates answer it best. The serum has a specific gravity of 1.0689 - heavier than water, because a quarter of it is glycerin. This cream is 0.9860 - lighter than water, because of the oil load. Same niacinamide at 2%, same adenosine at 0.04%, same bakuchiol at 0.1%. Different bases doing opposite jobs, and this one has no peptides.',
      },
      {
        q: 'Why is having no peptides a good thing?',
        a: 'It is not that peptides are bad - it is that the serum\u2019s six are present at between 0.05 and 1.1 parts per million while being sold as six separate mechanisms. This tube does not have that problem because it does not have them. What you are buying here is 13% emollients, 8% glycerin, 2% niacinamide and 0.04% adenosine, and all of those are real.',
      },
      {
        q: 'Is the bakuchiol enough to replace retinol?',
        a: 'At 0.1%, no. The study everyone cites for bakuchiol matching retinol used 0.5% twice daily. It is genuinely in here, it is photostable so you can wear it in daylight, and it is gentler than a retinoid - but if replacing a retinoid is the goal, this is not the concentration to do it with. Note the certificate assays the niacinamide and adenosine but not the bakuchiol.',
      },
      {
        q: 'Does it have a fragrance?',
        a: 'Yes, and more than the serum: lavender oil at 0.0413% against the serum\u2019s 0.0186%, with both linalool and limonene declared as allergens. Natural essential oil rather than synthetic perfume, but it is there. If fragrance is the deciding factor, our Blemish Balm Cream is fragrance-free.',
      },
      {
        q: 'I used the old Intensive Multi Functional Cream. Is this the same?',
        a: 'It is the replacement, and the manufacturer deliberately kept the texture, the fragrance and the dual anti-wrinkle and brightening function. What changed: the pumpkin ferment and the mung bean, birch bark and sorrel trio came out, and bakuchiol, propolis, collagen and elastin went in.',
      },
    ],
  },

  backToProducts: 'Products',
}

export const LEGACY_ANTI_WRINKLE_CREAM_AR_COPY: AntiWrinkleCreamCopy = {
  eyebrow: 'كريم متعدد الوظائف لمكافحة التجاعيد · 50 غ',
  headline: 'الغطاء على السيروم. لا نسخة أسمك منه.',
  subheadline:
    'نحو 13% من هذا الأنبوب زيوت وزُبد - منها زبدة بذور المانجو بنسبة 0.8% - فوق غليسرين بنسبة 8% ونياسيناميد بنسبة 2% وأدينوزين بالجرعة التي ترخّصها كوريا لتحسين التجاعيد. وحيث يجذب السيروم الماء إلى البشرة، يحتفظ هذا به. تركيبة مختلفة ومهمّة مختلفة، والشهادات تُظهر ذلك.',
  heroBullets: [
    'نياسيناميد 2%، مقيس عند 101.30% من المعلن على الدفعة',
    'أدينوزين 0.04%، مقيس عند 95.50% - جرعة التجاعيد المرخّصة',
    'زبدة بذور المانجو بنسبة 0.8%، جرعة تلطيف حقيقية',
    'بلا أي ببتيدات - لا شيء هنا يُبَاع بأجزاء من المليون',
  ],
  badges: ['صُنع في كوريا', '50 غ', 'تقييم سلامة أوروبي', 'مصنّف غير مهيّج'],

  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى السلة',
  inBag: 'في السلة',
  viewBag: 'عرض السلة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  chooseSize: 'اختاري الحجم',
  sizes: {
    homecareLabel: 'للاستخدام المنزلي',
    homecareNote: 'حجم 50 غ، لروتين يومي في المنزل',
    proLabel: 'للاستخدام الاحترافي',
    proNote: 'حجم 250 غ، لاستخدام العيادة',
  },
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '13%', label: 'زيوت وزُبد، مقابل 2.4% في السيروم' },
    { value: '2%', label: 'نياسيناميد، مقيس عند 101.30%' },
    { value: '0.8%', label: 'زبدة بذور المانجو' },
    { value: '0.9860', label: 'الكثافة النوعية - أخفّ من الماء' },
  ],

  pair: {
    eyebrow: 'السيروم أم الكريم',
    title: 'تركيبتان مختلفتان، والدليل على الورق',
    intro:
      'يفترض الناس أن السيروم والكريم المتطابقين هما الشيء نفسه بسماكتين. وليسا كذلك. ضعي التركيبتين الكمّيتين جنباً إلى جنب وستجدينهما مبنيتين لنصفين متعاكسين من المهمّة نفسها.',
    columns: { row: '', serum: 'سيروم مكافحة التجاعيد', cream: 'هذا الكريم' },
    rows: [
      { label: 'الغليسرين', serum: '25.45%', cream: '8.00%', highlight: true },
      { label: 'الزيوت والزُبد', serum: '~2.4%', cream: '~13.0%', highlight: true },
      { label: 'النياسيناميد', serum: '2.00%', cream: '2.00%' },
      { label: 'الأدينوزين', serum: '0.04%', cream: '0.04%' },
      { label: 'الباكوتشيول', serum: '0.100%', cream: '0.100%' },
      { label: 'الببتيدات', serum: 'ستة، ~1.4 ppm', cream: 'لا شيء' },
      { label: 'زبدة المانجو', serum: 'لا شيء', cream: '0.800%' },
      { label: 'الكثافة النوعية', serum: '1.0689', cream: '0.9860', highlight: true },
    ],
    body:
      'انظري إلى السطر الأخير. السيروم أثقل من الماء لأن ربعه غليسرين. وهذا الكريم أخفّ من الماء لأنه محمّل بالزيوت. شهادتا تحليل، ورقمان على جانبَي 1.000، وبينهما بصمة فيزيائية للفارق - لا تمييز تسويقي.',
    aside:
      'وهذا يمنح السبب الصريح الوحيد لامتلاك الاثنين: المرطّب الجاذب يجذب الماء إلى الطبقات العليا، والعازل يمنعه من المغادرة. وتعليمات السيروم نفسها تقول أن يُتبَع بمرطّب. وهذا هو ذلك المرطّب. وإن أردتِ واحداً فقط، فخذي الكريم شتاءً أو للبشرة الجافة، والسيروم في الرطوبة أو للبشرة الدهنية.',
  },

  working: {
    eyebrow: 'التركيبة العاملة',
    title: 'ما هو فعلاً بجرعة',
    intro:
      'ثمانية مكوّنات تؤدّي العمل هنا، والاثنان اللذان لهما عتبات تنظيمية خلفهما قيسا كلاهما على الدفعة لا مجرّد إعلان.',
    items: [
      {
        name: 'الملطّفات والبنية',
        dose: '~13%',
        body: 'إيثيل هكسيل بالميتات 4%، وسيتيريل ألكوهول 3%، وثلاثي غليسريد الكابريليك/الكابريك 2.4%، وبيوتيلين غلايكول دايكابريليت 2%، ودايميثيكون 0.8%. وهذا ما يجعله كريماً لا لوشن، وما يُبقي الماء داخلاً بعد وصوله.',
      },
      {
        name: 'Glycerin',
        dose: '8.00%',
        body: 'حمل مرطّب جدّي لكريم، وإن كان ثلث ما يحمله السيروم. كافٍ للاحتفاظ بالماء وحده، وأفضل تحت السيروم.',
      },
      {
        name: 'Niacinamide',
        dose: '2.00%',
        body: 'فيتامين B3 لتفاوت اللون ودعم الحاجز. مقيس على هذه الدفعة عند 101.30% من المعلن - أعلى قليلاً، وضمن المواصفة بارتياح.',
      },
      {
        name: 'زبدة بذور المانجو',
        dose: '0.800%',
        body: 'جرعة تلطيف حقيقية. وقد فحصها تقييم السلامة مقابل أقصى استخدام مُبلَّغ عنه بنسبة 5% في المستحضرات الباقية على البشرة، فهي داخله بارتياح. وهي أيضاً المكوّن الذي أدرجه عرض السيروم بالخطأ - وموضعه هنا.',
      },
      {
        name: 'Adenosine',
        dose: '0.040%',
        body: 'الجرعة التي ترخّصها كوريا لتحسين التجاعيد تحديداً، مقيسة عند 95.50%. وهي الفعّال الوحيد المضادّ للتجاعيد في الأنبوب الذي له عتبة تنظيمية خلفه.',
      },
      {
        name: 'Bakuchiol و Allantoin',
        dose: '0.100% لكل منهما',
        body: 'الباكوتشيول بالمستوى نفسه كالسيروم، مع التحفّظ نفسه أدناه. والألانتوين بجرعة فعّالة للراحة.',
      },
    ],
  },

  peptideFree: {
    eyebrow: 'نقطة لصالحه',
    title: 'لا ببتيدات هنا إطلاقاً',
    body:
      'السيروم المطابق يحمل ستة ببتيدات من مواد ممتازة فعلاً، بين 0.05 و1.1 جزء من المليون، وعرضه ينسب آلية منفصلة لكل منها. وهذا الكريم لا يحتويها ببساطة - فلا شيء هنا يُبَاع لك بجزء من مليون من الغرام. وما يبقى بجرعات أثرية أصغر وسنسمّيه على أي حال: السيراميد والكوليسترول والفيتوسفينغوزين المبيعة كليبوسوم للحاجز عند 0.1 جزء من المليون لكل منها، والكولاجين المتحلّل عند 0.1، والإيلاستين عند 1، والبروبوليس عند 10. اشتري هذا الأنبوب من أجل 13% من الملطّفات والغليسرين والنياسيناميد والأدينوزين.',
  },

  bakuchiol: {
    eyebrow: 'التحفّظ نفسه كالسيروم',
    title: 'الباكوتشيول بنسبة 0.1%',
    body:
      'مطابق للسيروم: 0.100%، موجود فعلاً، وثابت ضوئياً ولطيف بطريقة لا يكون الريتينول عليها. وبالمثل تماماً، الدراسة التي تقف خلف مقارنة الريتينول - دالِيوال وزملاؤه، المجلة البريطانية للأمراض الجلدية 2019 - استخدمت الباكوتشيول بنسبة 0.5% مرتين يومياً، أي خمسة أضعاف هذا التركيز. ولا هذا الكريم ولا السيروم يقيس الباكوتشيول على الشهادة، بخلاف النياسيناميد والأدينوزين. اعتبريه إضافة مرحّباً بها لا بديلاً عن الريتينويد، واشتري الأنبوب من أجل المكوّنات التي قيست.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما تقوله الشهادة',
    intro:
      'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة، وقُيّم وفق قانون مستحضرات التجميل الأوروبي في ملف من 42 صفحة قُدّم مع ملف السيروم.',
    rows: [
      { label: 'الحموضة', value: '6.23 عند 25 درجة، ضمن مواصفة 5.00-7.00' },
      { label: 'التعبئة', value: '51.11 غ مقابل 50 غ معلنة' },
      { label: 'الكثافة النوعية', value: '0.9860 - أخفّ من الماء بسبب حمل الزيوت' },
      { label: 'اللزوجة', value: '12,930 طازجاً و19,900 بعد 24 ساعة، وكلاهما ضمن المواصفة' },
      { label: 'النياسيناميد', value: 'مقيس عند 101.30% من الـ 2% المعلنة' },
      { label: 'الأدينوزين', value: 'مقيس عند 95.50% من الـ 0.04% المعلنة' },
      { label: 'النقاء', value: 'أقل من 10 وحدات/غ، مقابل 100 مسموحة' },
      { label: 'الممرضات', value: 'المكوّرة العنقودية والزائفة والمبيضّات - كلها غير مكتشفة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات مغلقاً، وتاريخ الانتهاء على العلبة' },
    ],
    patch:
      'اختبار اللصقة الذي يقف خلف عبارة «مختبر جلدياً» عاد مصنّفاً «غير مهيّج» لا مجرّد ناجح - وهي النتيجة نفسها التي حصل عليها السيروم، من المختبر نفسه. ويلاحظ المقيّم أن عدد المتطوّعين صغير، فاقرئيها كطمأنة بشأن التركيبة لا كبرهان بشأن بشرتك.',
  },

  reformulation: {
    eyebrow: 'إن كنتِ تستخدمين الكريم القديم',
    title: 'ما تغيّر وما بقي',
    body:
      'حلّ هذا الكريم محلّ منتج أقدم اسمه Intensive Multi Functional Cream. ووثائق الشركة نفسها تسجّل التبديل، ويستحق الأمر المعرفة إن كنتِ عائدة إلى كريم استخدمتِه قبل سنوات: فالملمس والعطر والوظيفة المزدوجة لمكافحة التجاعيد والتفتيح أُبقيت كلها عن قصد.',
    before: {
      title: 'حُذف من التركيبة القديمة',
      items: [
        'مستخلص تخمّر اللاكتوباسيلوس والقرع',
        'ثلاثي الفاصولياء ولحاء البتولا وجذر السورَل',
      ],
    },
    after: {
      title: 'أُضيف',
      items: ['الباكوتشيول', 'مستخلص البروبوليس', 'الكولاجين والإيلاستين المتحلّلان'],
    },
  },

  fragrance: {
    eyebrow: 'إن كنتِ تفحصين المكوّنات',
    title: 'أكثر عطراً من السيروم',
    body:
      'زيت اللافندر بنسبة 0.0413%، أي أكثر من ضعف 0.0186% في السيروم، ومسبّبَا حساسية معلنان لا واحد: لينالول بنسبة 0.0266% وليمونين بنسبة 0.0021%. وكلاهما مذكور لأن القانون الأوروبي يوجب ذلك. وهو زيت عطري لا عطر صناعي والكميات صغيرة، لكن إن كنتِ قد وافقت السيروم من ناحية العطر، فاعلمي أن هذا الأنبوب يحمل منه أكثر. وكريم البلسم للعيوب لدينا هو الخيار الخالي من العطر في المجموعة.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'الخطوة الأخيرة، صباحاً ومساءً',
    frequency: 'مرتين يومياً · فوق السيروم وتحت واقي الشمس',
    steps: [
      {
        title: 'السيروم أولاً إن كنتِ تستخدمينه',
        body: 'ضعي سيروم مكافحة التجاعيد على بشرة رطبة، ثم هذا فوقه. فالسيروم يُدخل الماء والكريم يُبقيه - وبهذا الترتيب يفعل الزوج شيئاً لا يفعله أيّهما وحده.',
      },
      {
        title: 'كمية بحجم حبة البازلاء، مُدفَّأة',
        body: 'دفّئيها بين أطراف أصابعك أولاً لتلين الزُبد، ثم اضغطيها على الوجه والرقبة. إنه كريم غنيّ ويكفي أكثر مما يبدو.',
      },
      {
        title: 'امسحي بلطف إلى أعلى',
        body: 'تحدّد الشركة تدليكاً لطيفاً، وهو يستحق الثلاثين ثانية التي يستغرقها - فهو يساعد الطور الزيتي على الانتشار بالتساوي بدل التجمّع في بقع.',
      },
      {
        title: 'واقي الشمس فوقه صباحاً',
        body: 'الباكوتشيول ثابت ضوئياً فلا سبب لقصر هذا على المساء، لكن النياسيناميد والأدينوزين كليهما يعملان أفضل على بشرة لا تتضرّر بالضوء في الوقت نفسه.',
      },
    ],
    note:
      'لا أحماض ولا ريتينويدات ولا مقشّرات، فهو لا ينافس أي شيء آخر في الروتين. وعلى البشرة الدهنية جداً قد يكون طور الزيت بنسبة 13% أكثر مما تريدين في الرطوبة - والسيروم وحده هو النصف الأخفّ من الزوج.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في الأنبوب',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'يحتوي زيت اللافندر مع اللينالول والليمونين المعلنَين. اختبريه على بقعة إن كنتِ تتفاعلين مع العطر.',
      'للاستعمال الخارجي فقط. لا يُستخدم قرب العينين. تجنّبي العينين والأغشية المخاطية، واشطفي جيداً بالماء البارد عند الملامسة.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'قُيّم آمناً وفق اللائحة EC 1223/2009 وصُنّف «غير مهيّج» في اختبار اللصقة.',
      'إن كنتِ حاملاً فاستشيري طبيبك قبل بدء أي فعّال جديد - فالباكوتشيول ليس ريتينولاً، لكن ذلك الحديث حديثهم معك.',
      'يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، مع إفصاح العطر من التركيبة الكمّية.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '50 غ للمنزل · ويوجد أيضاً حجم احترافي 250 غ' },
      { label: 'الملمس', value: 'كريم أبيض معتم، غنيّ' },
      { label: 'الفعّالات بجرعة', value: 'غليسرين 8.00%، نياسيناميد 2.00%، زبدة مانجو 0.800%، أدينوزين 0.040%' },
      { label: 'الباكوتشيول', value: '0.100% - خُمس التركيز في دراسة مقارنة الريتينول' },
      { label: 'الببتيدات', value: 'لا شيء' },
      { label: 'معطّر', value: 'نعم - زيت لافندر 0.0413%، مع اللينالول والليمونين معلنَين' },
      { label: 'الحموضة', value: '5.00-7.00 (6.23 على الدفعة المختبرة)' },
      { label: 'الترخيص', value: 'مزدوج الوظيفة الكوري: تحسين التجاعيد والتفتيح' },
      { label: 'التقييم', value: 'تقييم سلامة أوروبي؛ اختبار لصقة مصنّف غير مهيّج' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل أحتاج السيروم والكريم معاً؟',
        a: 'ليس بالضرورة، لكنهما مصمّمان فعلاً للعمل معاً لا كترقية حجم. فالسيروم 25.45% غليسرين ويجذب الماء إلى البشرة؛ وهذا الكريم نحو 13% زيوت وزُبد ويمنعه من المغادرة. وإن اشتريتِ واحداً: الكريم للبشرة الجافة أو شتاءً، والسيروم للبشرة الدهنية أو في الرطوبة.',
      },
      {
        q: 'كيف يختلف عن السيروم فعلاً؟',
        a: 'الشهادتان تجيبان أفضل. فالسيروم كثافته النوعية 1.0689 - أثقل من الماء لأن ربعه غليسرين. وهذا الكريم 0.9860 - أخفّ من الماء بسبب حمل الزيوت. النياسيناميد نفسه بنسبة 2%، والأدينوزين نفسه بنسبة 0.04%، والباكوتشيول نفسه بنسبة 0.1%. قاعدتان مختلفتان تؤدّيان مهمّتين متعاكستين، وهذا بلا ببتيدات.',
      },
      {
        q: 'ولماذا يكون غياب الببتيدات أمراً جيداً؟',
        a: 'ليس أن الببتيدات سيئة - بل أن ستة ببتيدات السيروم موجودة بين 0.05 و1.1 جزء من المليون وتُبَاع كستّ آليات منفصلة. وهذا الأنبوب لا يعاني ذلك لأنه لا يحتويها. وما تشترينه هنا 13% ملطّفات و8% غليسرين و2% نياسيناميد و0.04% أدينوزين، وكلها حقيقية.',
      },
      {
        q: 'هل الباكوتشيول كافٍ ليحلّ محلّ الريتينول؟',
        a: 'عند 0.1%، لا. فالدراسة التي يستشهد بها الجميع لمطابقة الباكوتشيول للريتينول استخدمت 0.5% مرتين يومياً. وهو موجود فعلاً هنا، وثابت ضوئياً فيمكنك ارتداؤه في النهار، وألطف من الريتينويد - لكن إن كان استبدال الريتينويد هو الهدف، فهذا ليس التركيز المناسب. ولاحظي أن الشهادة تقيس النياسيناميد والأدينوزين لا الباكوتشيول.',
      },
      {
        q: 'هل له عطر؟',
        a: 'نعم، وأكثر من السيروم: زيت لافندر بنسبة 0.0413% مقابل 0.0186% في السيروم، مع اللينالول والليمونين معلنَين كمسبّبَي حساسية. زيت عطري طبيعي لا عطر صناعي، لكنه موجود. وإن كان العطر هو العامل الفاصل، فكريم البلسم للعيوب لدينا خالٍ من العطر.',
      },
      {
        q: 'كنت أستخدم Intensive Multi Functional Cream القديم. هل هذا نفسه؟',
        a: 'إنه البديل، وقد أبقت الشركة عن قصد الملمس والعطر والوظيفة المزدوجة لمكافحة التجاعيد والتفتيح. أمّا ما تغيّر: خرج مخمّر القرع وثلاثي الفاصولياء ولحاء البتولا والسورَل، ودخل الباكوتشيول والبروبوليس والكولاجين والإيلاستين.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

export const LEGACY_ANTI_WRINKLE_CREAM_RU_COPY: AntiWrinkleCreamCopy = {
  eyebrow: 'Мультифункциональный крем против морщин · 50 г',
  headline: 'Крышка для сыворотки. А не её загущённая версия.',
  subheadline:
    'Около 13% этой тубы - масла и баттеры, включая масло семян манго 0,8%, поверх глицерина 8%, ниацинамида 2% и аденозина в дозе, под которую Корея лицензирует уменьшение морщин. Где сыворотка втягивает воду в кожу, этот крем её удерживает. Другая формула, другая задача, и сертификаты это показывают.',
  heroBullets: [
    'Ниацинамид 2%, измерено 101,30% от заявленного в партии',
    'Аденозин 0,04%, измерено 95,50% - лицензионная доза для морщин',
    'Масло семян манго 0,8% - настоящая эмолентная доза',
    'Пептидов нет вовсе - здесь ничего не продают в частях на миллион',
  ],
  badges: ['Сделано в Корее', '50 г', 'Оценка безопасности ЕС', 'Оценка: не раздражает'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  chooseSize: 'Выберите объём',
  sizes: {
    homecareLabel: 'Домашний уход',
    homecareNote: 'Объём 50 г, для ежедневного ухода дома',
    proLabel: 'Профессиональный',
    proNote: 'Объём 250 г, для работы в клинике',
  },
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '13%', label: 'Масел и баттеров против 2,4% у сыворотки' },
    { value: '2%', label: 'Ниацинамида, измерено 101,30%' },
    { value: '0,8%', label: 'Масла семян манго' },
    { value: '0,9860', label: 'Удельный вес - легче воды' },
  ],

  pair: {
    eyebrow: 'Сыворотка или крем',
    title: 'Две разные формулы, и доказательство в документах',
    intro:
      'Люди считают, что парные сыворотка и крем - это одно и то же в двух плотностях. Это не так. Положите две количественные формулы рядом, и они собраны под противоположные половины одной задачи.',
    columns: { row: '', serum: 'Сыворотка против морщин', cream: 'Этот крем' },
    rows: [
      { label: 'Глицерин', serum: '25,45%', cream: '8,00%', highlight: true },
      { label: 'Масла и баттеры', serum: '~2,4%', cream: '~13,0%', highlight: true },
      { label: 'Ниацинамид', serum: '2,00%', cream: '2,00%' },
      { label: 'Аденозин', serum: '0,04%', cream: '0,04%' },
      { label: 'Бакучиол', serum: '0,100%', cream: '0,100%' },
      { label: 'Пептиды', serum: 'Шесть, ~1,4 ppm', cream: 'Нет' },
      { label: 'Масло манго', serum: 'Нет', cream: '0,800%' },
      { label: 'Удельный вес', serum: '1,0689', cream: '0,9860', highlight: true },
    ],
    body:
      'Посмотрите на последнюю строку. Сыворотка тяжелее воды, потому что четверть её - глицерин. Этот крем легче воды, потому что он загружен маслами. Два сертификата анализа, два числа по обе стороны от 1,000, и между ними физический отпечаток разницы - не маркетинговое различие.',
    aside:
      'Отсюда единственная честная причина иметь оба: увлажнитель втягивает воду в верхние слои кожи, а окклюзив не даёт ей уйти. В инструкции самой сыворотки сказано наносить сверху крем. Это тот крем. Если нужен один: крем на сухую кожу или зимой, сыворотку на жирную кожу или во влажность.',
  },

  working: {
    eyebrow: 'Работающая формула',
    title: 'Что действительно в дозе',
    intro:
      'Работу здесь делают восемь ингредиентов, и два из них, у которых за спиной регуляторные пороги, измерены в партии, а не просто заявлены.',
    items: [
      {
        name: 'Эмоленты и структура',
        dose: '~13%',
        body: 'Этилгексил палмитат 4%, цетеарил спирт 3%, каприловый/каприновый триглицерид 2,4%, бутиленгликоль дикаприлат 2%, диметикон 0,8%. Именно это делает его кремом, а не лосьоном, и удерживает воду, когда она уже там.',
      },
      {
        name: 'Glycerin',
        dose: '8,00%',
        body: 'Серьёзная увлажняющая загрузка для крема, хотя это треть того, что несёт сыворотка. Достаточно, чтобы удерживать воду самому, и лучше - под сывороткой.',
      },
      {
        name: 'Niacinamide',
        dose: '2,00%',
        body: 'Витамин B3 для неровного тона и барьера. Измерено в этой партии: 101,30% от заявленного - чуть выше, спокойно внутри спецификации.',
      },
      {
        name: 'Масло семян манго',
        dose: '0,800%',
        body: 'Настоящая эмолентная доза. Оценка безопасности сверила её с максимальным зафиксированным применением 5% в несмываемых средствах, так что это хорошо внутри. Это же и есть ингредиент, который презентация сыворотки указала по ошибке, - его место здесь.',
      },
      {
        name: 'Adenosine',
        dose: '0,040%',
        body: 'Ровно та доза, которую Корея лицензирует для уменьшения морщин, измерено 95,50%. Единственный актив против морщин в тубе с регуляторным порогом за спиной.',
      },
      {
        name: 'Bakuchiol и Allantoin',
        dose: 'по 0,100%',
        body: 'Бакучиол на том же уровне, что и в сыворотке, с той же оговоркой ниже. Аллантоин в рабочей дозе для комфорта.',
      },
    ],
  },

  peptideFree: {
    eyebrow: 'Пункт в его пользу',
    title: 'Пептидов здесь нет совсем',
    body:
      'Парная сыворотка несёт шесть пептидов из действительно премиальных материалов, в концентрациях от 0,05 до 1,1 части на миллион, и её презентация приписывает каждому отдельный механизм. Этот крем их просто не содержит - значит, здесь вам ничего не продают в миллионных долях грамма. Что остаётся следовым, меньше, и мы всё равно это назовём: церамид, холестерин и фитосфингозин, продаваемые как барьерная липосома, по 0,1 ppm каждый, гидролизованный коллаген 0,1 ppm, эластин 1 ppm, прополис 10 ppm. Покупайте эту тубу за 13% эмолентов, глицерин, ниацинамид и аденозин.',
  },

  bakuchiol: {
    eyebrow: 'Та же оговорка, что у сыворотки',
    title: 'Бакучиол 0,1%',
    body:
      'Идентично сыворотке: 0,100%, реально присутствует, фотостабилен и мягок так, как ретинол не бывает. И точно так же исследование, стоящее за сравнением с ретинолом, - Dhaliwal и соавторы, British Journal of Dermatology 2019 - использовало бакучиол 0,5% дважды в день, в пять раз больше этой концентрации. Ни в этом креме, ни в сыворотке бакучиол не измеряется в сертификате, в отличие от ниацинамида и аденозина. Считайте его приятным дополнением, а не заменой ретиноида, и покупайте тубу за те ингредиенты, которые измерили.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что говорит сертификат',
    intro:
      'Сделано в Корее, выпущено против письменной спецификации и оценено по европейскому косметическому закону в досье на 42 страницы, поданном вместе с досье сыворотки.',
    rows: [
      { label: 'pH', value: '6,23 при 25 °C, в пределах спецификации 5,00-7,00' },
      { label: 'Наполнение', value: '51,11 г при заявленных 50 г' },
      { label: 'Удельный вес', value: '0,9860 - легче воды из-за масляной загрузки' },
      { label: 'Вязкость', value: '12 930 свежая и 19 900 через 24 часа, обе внутри спецификации' },
      { label: 'Ниацинамид', value: 'Измерено 101,30% от заявленных 2%' },
      { label: 'Аденозин', value: 'Измерено 95,50% от заявленных 0,04%' },
      { label: 'Чистота', value: 'Менее 10 КОЕ/г при допустимых 100' },
      { label: 'Патогены', value: 'S. aureus, P. aeruginosa и C. albicans - все не обнаружены' },
      { label: 'Срок годности', value: 'Три года закрытым, дата на коробке' },
    ],
    patch:
      'Патч-тест, стоящий за строкой «дерматологически протестировано», вернулся с оценкой «не раздражает», а не просто «пройден» - тот же результат, что и у сыворотки, из той же лаборатории. Оценщик отмечает, что число добровольцев невелико, так что читайте это как уверенность в формуле, а не как доказательство про вашу кожу.',
  },

  reformulation: {
    eyebrow: 'Если вы пользовались старым кремом',
    title: 'Что изменилось и что осталось',
    body:
      'Этот крем заменил более раннее средство под названием Intensive Multi Functional Cream. Документы самого производителя фиксируют замену, и это стоит знать, если вы возвращаетесь к крему, которым пользовались годы назад: текстуру, аромат и двойную функцию против морщин и осветления сохранили намеренно.',
    before: {
      title: 'Убрали из старой формулы',
      items: [
        'Экстракт ферментации лактобактерий и тыквы',
        'Трио из мунга, берёзовой коры и корня щавеля',
      ],
    },
    after: {
      title: 'Добавили',
      items: ['Бакучиол', 'Экстракт прополиса', 'Гидролизованный коллаген и эластин'],
    },
  },

  fragrance: {
    eyebrow: 'Если вы читаете составы',
    title: 'Ароматизирован сильнее сыворотки',
    body:
      'Лавандовое масло 0,0413%, что более чем вдвое больше 0,0186% у сыворотки, и два заявленных аллергена вместо одного: линалоол 0,0266% и лимонен 0,0021%. Оба названы, потому что европейский закон это требует. Это эфирное масло, а не синтетическая отдушка, и количества малы, но если с сывороткой у вас по аромату всё сложилось, знайте, что в этой тубе его больше. Наш Blemish Balm Cream - вариант линейки без отдушки.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Последний шаг, утром и вечером',
    frequency: 'Дважды в день · поверх сыворотки, под санскрин',
    steps: [
      {
        title: 'Сначала сыворотка, если вы её используете',
        body: 'Нанесите сыворотку против морщин на влажную кожу, затем этот крем сверху. Сыворотка втягивает воду, крем её удерживает - в таком порядке пара делает то, чего не делает ни одна по отдельности.',
      },
      {
        title: 'Количество с горошину, согрев',
        body: 'Сначала согрейте между подушечками пальцев, чтобы баттеры смягчились, затем вдавите по лицу и шее. Крем богатый и расходуется медленнее, чем кажется.',
      },
      {
        title: 'Мягко массируйте вверх',
        body: 'Производитель указывает мягкий массаж, и эти тридцать секунд стоит потратить - он помогает масляной фазе распределиться ровно, а не остаться пятнами.',
      },
      {
        title: 'Утром сверху санскрин',
        body: 'Бакучиол фотостабилен, поэтому нет причин ограничивать это вечером, но ниацинамид и аденозин работают лучше на коже, которая тем временем не получает фотоповреждений.',
      },
    ],
    note:
      'Без кислот, ретиноидов и эксфолиантов, поэтому он не конкурирует ни с чем в уходе. На очень жирной коже 13% масляной фазы может оказаться больше, чем вам нужно во влажности, - сыворотка отдельно и есть более лёгкая половина пары.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что в тубе',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Содержит лавандовое масло с заявленными линалоолом и лимоненом. Сделайте пробу, если реагируете на ароматизаторы.',
      'Только для наружного применения. Не наносите рядом с глазами. Избегайте глаз и слизистых, при попадании тщательно промойте прохладной водой.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Оценено как безопасное по регламенту EC 1223/2009 и получило оценку «не раздражает» в патч-тесте.',
      'При беременности спросите врача перед началом любого нового актива - бакучиол не ретинол, но этот разговор им вести с вами.',
      'Храните в прохладном сухом месте, недоступном для детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, плюс раскрытие отдушки из количественной формулы.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '50 г для дома · существует также профессиональный 250 г' },
      { label: 'Текстура', value: 'Непрозрачный белый крем, богатый' },
      { label: 'Активы в дозе', value: 'Глицерин 8,00%, ниацинамид 2,00%, масло манго 0,800%, аденозин 0,040%' },
      { label: 'Бакучиол', value: '0,100% - пятая часть концентрации в исследовании с ретинолом' },
      { label: 'Пептиды', value: 'Нет' },
      { label: 'Отдушка', value: 'Да - лавандовое масло 0,0413%, линалоол и лимонен заявлены' },
      { label: 'pH', value: '5,00-7,00 (6,23 в измеренной партии)' },
      { label: 'Лицензия', value: 'Корейское двойное действие: уменьшение морщин и осветление' },
      { label: 'Оценка', value: 'Оценка безопасности ЕС; патч-тест «не раздражает»' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Нужны ли мне и сыворотка, и крем?',
        a: 'Не обязательно, но они действительно спроектированы работать вместе, а не как апгрейд объёма. Сыворотка - 25,45% глицерина, она втягивает воду в кожу; этот крем - около 13% масел и баттеров, он не даёт ей уйти. Если покупать одно: крем на сухую кожу или зимой, сыворотку на жирную кожу или во влажность.',
      },
      {
        q: 'Чем он на самом деле отличается от сыворотки?',
        a: 'Лучше всего отвечают сертификаты. У сыворотки удельный вес 1,0689 - тяжелее воды, потому что четверть её глицерин. У этого крема 0,9860 - легче воды из-за масляной загрузки. Тот же ниацинамид 2%, тот же аденозин 0,04%, тот же бакучиол 0,1%. Разные основы, выполняющие противоположные задачи, и в этом нет пептидов.',
      },
      {
        q: 'Почему отсутствие пептидов - это плюс?',
        a: 'Дело не в том, что пептиды плохи, - а в том, что шесть пептидов сыворотки присутствуют в концентрациях от 0,05 до 1,1 части на миллион, а продаются как шесть отдельных механизмов. У этой тубы такой проблемы нет, потому что их в ней нет. Вы покупаете здесь 13% эмолентов, 8% глицерина, 2% ниацинамида и 0,04% аденозина, и всё это реально.',
      },
      {
        q: 'Достаточно ли бакучиола, чтобы заменить ретинол?',
        a: 'При 0,1% - нет. Исследование, на которое все ссылаются, использовало 0,5% дважды в день. Он действительно здесь есть, он фотостабилен, так что его можно носить днём, и он мягче ретиноида, - но если цель заменить ретиноид, это не та концентрация. Заметьте, сертификат измеряет ниацинамид и аденозин, но не бакучиол.',
      },
      {
        q: 'Есть ли отдушка?',
        a: 'Да, и больше, чем у сыворотки: лавандовое масло 0,0413% против 0,0186%, с заявленными линалоолом и лимоненом. Натуральное эфирное масло, а не синтетическая отдушка, но оно есть. Если отдушка решает, наш Blemish Balm Cream - без неё.',
      },
      {
        q: 'Я пользовалась старым Intensive Multi Functional Cream. Это то же самое?',
        a: 'Это замена, и производитель намеренно сохранил текстуру, аромат и двойную функцию против морщин и осветления. Что изменилось: убрали тыквенный фермент и трио из мунга, берёзовой коры и щавеля, добавили бакучиол, прополис, коллаген и эластин.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const ANTI_WRINKLE_CREAM_COPY: Record<Locale, AntiWrinkleCreamCopy> = {
  en: EN,
  ar: ANTI_WRINKLE_CREAM_LOCALIZED_COPY.ar,
  ru: ANTI_WRINKLE_CREAM_LOCALIZED_COPY.ru,
}

export function getAntiWrinkleCreamCopy(locale: string | undefined): AntiWrinkleCreamCopy {
  return ANTI_WRINKLE_CREAM_COPY[(locale as Locale) ?? 'en'] ?? ANTI_WRINKLE_CREAM_COPY.en
}

/** The serum first: this page argues the two belong together, in that order. */
export const COMPANION_PRODUCT_IDS = ['22', '16', '42', '13'] as const
