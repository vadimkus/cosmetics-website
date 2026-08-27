import { MULTI_SUN_AR_COPY, MULTI_SUN_RU_COPY } from './multiSunLocalizedCopy'

/**
 * Bespoke copy for MULTI SUN CREAM [SPF40 / PA++] (product 40).
 *
 * SOURCING - every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_40_MULTI_SUN_SOURCE_AUDIT.md:
 *   - DTS MG signed formula: four filters totalling 18.50%, and the trace
 *     complex running from 100 ppm down to a declared zero.
 *   - COA lot WOB053: pH 6.71, net 41.07 g, under 10 cfu/ml, three-year life,
 *     and an assay of all four filters.
 *   - The registered carton, including the single-function Korean declaration
 *     and the five declared fragrance allergens.
 *   - Regulation (EC) 1223/2009 Annex VI as at 1 May 2026 for the caps, and
 *     SCCS/1671/24 (June 2025, corrigendum March 2026) for octinoxate.
 *
 * THE SPINE OF THIS PAGE. This cream carries MORE filter by weight than its
 * bigger sibling - 18.50% against 17.10% - and lands a lower grade, SPF40/PA++
 * against SPF50+/PA++++. That is not a flaw, it is the whole explanation: three
 * of its four filters are UVB absorbers and the only UVA cover is titanium
 * dioxide, which reaches short UVA and stops. Explaining that honestly is more
 * persuasive than pretending the two products are the same thing in different
 * sizes.
 *
 * OCTINOXATE. This contains it at 7.50%, and product 39's page advertises being
 * free of it. The page states the figure, the 10% cap, the SCCS endocrine
 * finding and the fact that the SCCS did not assess environmental effects, then
 * sends anyone avoiding octinoxate to product 39 - which costs more. Say it
 * anyway.
 *
 * MUST STAY OUT:
 *   - Palmitoyl Pentapeptide-4 as a calming active. It is at 1 ppb, and the
 *     Lactobacillus/Soymilk ferment is declared at literally zero.
 *   - "Mannan", which is not an INCI name.
 *   - An unqualified "suitable for sensitive skin" on a fragranced product with
 *     five declared allergens.
 *   - Any water-resistance or swimming claim. No test exists.
 *   - The contract manufacturer's name, and the lot code.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface MultiSunCopy {
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

  filters: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; amount: string; role: string; cap: string }
    rows: Array<{ name: string; amount: string; role: string; cap: string }>
    total: string
  }

  grade: {
    eyebrow: string
    title: string
    body: string
    aside: string
  }

  octinoxate: {
    eyebrow: string
    title: string
    body: string
    points: string[]
    verdict: string
  }

  assay: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; declared: string; found: string }
    rows: Array<{ name: string; declared: string; found: string }>
    note: string
  }

  honesty: {
    eyebrow: string
    title: string
    body: string
    aside: string
  }

  fragrance: {
    eyebrow: string
    title: string
    body: string
    allergens: string[]
  }

  pick: {
    eyebrow: string
    title: string
    intro: string
    thisOne: { title: string; items: string[] }
    otherOne: { title: string; items: string[] }
  }

  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }

  video: { title: string; body: string; unsupported: string }

  inci: {
    eyebrow: string
    title: string
    intro: string
    fullInci: string
    fullInciNote: string
  }

  lab: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
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

const EN: MultiSunCopy = {
  eyebrow: 'Multi Sun Cream · SPF40 / PA++',
  headline: 'More filter than the strong one. Lower grade. Here is why.',
  subheadline:
    'Four UV filters at a combined 18.5% - actually a heavier load than the SPF50+ in the range - but three of them absorb UVB and only the titanium dioxide reaches into UVA. That is what a PA++ rating means, and it is why this is the light everyday cream rather than the one for a day outdoors.',
  heroBullets: [
    'Four filters, 18.5% of the tube, every one assayed on the batch',
    'SPF40 / PA++ - moderate UVA, strong UVB',
    'Light enough to wear under make-up every morning',
    'Contains octinoxate at 7.5%, stated plainly below',
  ],
  badges: ['Made in Korea', '40 g', 'Dermatologically tested', 'No parabens, alcohol or dyes'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '18.5%', label: 'Of the tube is UV filter' },
    { value: '4', label: 'Filters, all assayed on the batch' },
    { value: '40 g', label: 'Filled at 41.07 g' },
    { value: 'pH 6.7', label: 'Inside a 5.0-7.0 specification' },
  ],

  filters: {
    eyebrow: 'The filter system',
    title: 'Four filters, and what each one reaches',
    intro:
      'Straight off the manufacturer\u2019s quantitative formula, with the European legal maximum beside each one so you can see where the formula sits against it.',
    columns: { name: 'Filter', amount: 'In this tube', role: 'What it covers', cap: 'EU maximum' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7.50%', role: 'UVB', cap: '10%' },
      { name: 'Ethylhexyl Salicylate', amount: '5.00%', role: 'UVB', cap: '5%' },
      { name: 'Titanium Dioxide', amount: '3.00%', role: 'UVB and short UVA', cap: '25%' },
      { name: 'Isoamyl p-Methoxycinnamate', amount: '3.00%', role: 'UVB', cap: '10%' },
    ],
    total:
      'Combined: 18.50%. The octisalate sits exactly on its 5% ceiling - at the limit, not over it. Caps from Regulation (EC) 1223/2009, Annex VI.',
  },

  grade: {
    eyebrow: 'Why PA++ and not PA++++',
    title: 'The missing wavelength',
    body:
      'Compare the two GENOSYS sunscreens and something looks wrong: this one holds 18.5% filter and rates SPF40 / PA++, while Ultra Shield holds 17.1% and rates SPF50+ / PA++++. Less filter, better grade. The reason is which wavelengths those filters absorb. Three of the four here - the methoxycinnamate, the salicylate and the amiloxate - are UVB absorbers, and the only thing reaching UVA is the titanium dioxide, which covers the short end and stops. There is no dedicated long-UVA filter in this tube.',
    aside:
      'SPF is a UVB number and PA is a UVA number. This cream is strong on the first and moderate on the second, which is a perfectly sensible way to build a light daily cream - and a poor way to build one for a beach day.',
  },

  octinoxate: {
    eyebrow: 'Read this before you buy',
    title: 'This one contains octinoxate',
    body:
      'Ethylhexyl methoxycinnamate, better known as octinoxate, is the largest filter in this formula at 7.50%. Our Ultra Shield page states that product contains no octinoxate, and that is true of it - but not of this one, so here is the position in full rather than in a footnote.',
    points: [
      'European law permits it up to 10% as a UV filter. This formula uses 7.50%.',
      'The EU\u2019s scientific committee reviewed it and concluded in June 2025 that it is safe at up to 10% in a face cream, and safe for children on margin-of-safety grounds.',
      'The same opinion confirms it is endocrine-active - estrogenic and weakly anti-androgenic. That finding was not withdrawn; it was accounted for in the exposure modelling behind the 10% figure.',
      'That review explicitly did not cover environmental effects. So it is not an answer to the coral question, and nobody should present it as one.',
    ],
    verdict:
      'If avoiding octinoxate is the reason you are reading an ingredient list, buy the Ultra Shield instead. It costs more than this one and we would rather say so than sell you the wrong tube.',
  },

  assay: {
    eyebrow: 'Quality',
    title: 'They measured what is actually in it',
    intro:
      'Most sunscreens tell you what went into the mixing tank. This batch was tested afterwards, filter by filter, and the results are on the certificate.',
    columns: { name: 'Filter', declared: 'Declared', found: 'Found in the batch' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', declared: '7.50%', found: '7.21%' },
      { name: 'Ethylhexyl Salicylate', declared: '5.00%', found: '4.96%' },
      { name: 'Isoamyl p-Methoxycinnamate', declared: '3.00%', found: '2.98%' },
      { name: 'Titanium Dioxide', declared: '3.00%', found: '2.75%' },
    ],
    note:
      'All four clear the specification, which requires at least 90% of the declared amount. It is a small thing that almost no brand publishes, and it is the difference between a number on a box and a number somebody checked.',
  },

  honesty: {
    eyebrow: 'About the soothing ingredients',
    title: 'One of them is dosed at zero',
    body:
      'The carton credits the calming to palmitoyl pentapeptide-4, centella and scutellaria. On the manufacturer\u2019s own quantitative formula the peptide is at 0.0000001% - one part per billion - and the two botanicals are at 10 ppm each. The rose and grape stem-cell extracts are 3 ppm and 1 ppm. And the Lactobacillus/Soymilk ferment filtrate, which our own product page used to list as a key ingredient, is declared at 0.0000000%.',
    aside:
      'What is genuinely in here at a working level is the filter system, butylene glycol at 5%, dimethicone at 2.3% and glycerin at 1%. That makes a light, comfortable, non-greasy sunscreen. It does not make a treatment, and we are not going to sell it as one.',
  },

  fragrance: {
    eyebrow: 'If your skin is reactive',
    title: 'It is fragranced, and here is exactly what with',
    body:
      'A lavender fragrance at 0.25%, carrying five allergens that European law requires to be named. They are printed on the carton and repeated here, because a sunscreen sold partly on soothing should be honest with the people most likely to react to it. If you are choosing specifically for reactive skin, a fragrance-free sunscreen may suit you better.',
    allergens: [
      'Benzyl Benzoate - 0.025%',
      'Citronellol - 0.011%',
      'Hexyl Cinnamal - 0.011%',
      'Alpha-Isomethyl Ionone - 0.011%',
      'Limonene - 0.004%',
    ],
  },

  pick: {
    eyebrow: 'Choosing between the two',
    title: 'Which GENOSYS sunscreen',
    intro: 'They are not a good and a better. They are built for different days.',
    thisOne: {
      title: 'Multi Sun Cream, SPF40 / PA++',
      items: [
        'Weekdays, the commute, the office, the school run',
        'Under make-up - it is the lighter of the two',
        'When most of your UV is incidental rather than deliberate',
        '40 g, and the more affordable of the pair',
      ],
    },
    otherOne: {
      title: 'Ultra Shield, SPF50+ / PA++++',
      items: [
        'A day actually spent outdoors, or a UV index of 11 and up',
        'When long-UVA cover matters - it is measured, this one is not',
        'If you are avoiding octinoxate',
        '50 g, and the stronger of the pair',
      ],
    },
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Enough of it, every morning',
    frequency: 'Daily, as the last skincare step · reapply every two hours outdoors',
    steps: [
      {
        title: 'After your moisturiser',
        body: 'Sunscreen is the last step of skincare and the step before make-up, not part of either. The carton is explicit that it sits well under foundation.',
      },
      {
        title: 'Two fingers for face and neck',
        body: 'A line along your index and middle finger is roughly the amount SPF is tested at. Apply a third of that and you get roughly a third of the protection, which is how most people end up burnt in a product that works.',
      },
      {
        title: 'Let it settle before you leave',
        body: 'Give it a few minutes to form a film rather than walking out the door still tacky.',
      },
      {
        title: 'Again every two hours in the sun',
        body: 'The carton says so, and it is right. Also after sweating or towelling - there is no water-resistance claim on this product.',
      },
    ],
    note:
      'No parabens, no drying alcohol and no colourants, which the Russian panel of the carton states and the formula backs up.',
  },

  video: {
    title: 'The texture',
    body: 'How it spreads, how it finishes, and how little it leaves behind.',
    unsupported: 'Your browser does not support the video tag.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the tube',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the carton in your hand.',
  },

  lab: {
    eyebrow: 'The batch',
    title: 'What the certificate says',
    intro: 'Made in Korea and released against a written specification.',
    rows: [
      { label: 'pH', value: '6.71 at 25 °C, inside a 5.00-7.00 specification' },
      { label: 'Fill', value: '41.07 g against a 40 g declaration' },
      { label: 'Bacteria', value: 'Under 10 cfu/ml, against a permitted 100' },
      { label: 'Moulds and yeasts', value: 'Under 10 cfu/ml, against a permitted 100' },
      { label: 'Stability', value: 'Passed at 50 °C' },
      { label: 'Shelf life', value: 'Three years, with the expiry date on the carton' },
      { label: 'Licence', value: 'Korean functional cosmetic for UV protection' },
    ],
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'For external use only. Avoid the eyes and mucous membranes, and rinse thoroughly with cool water on contact.',
      'Do not apply directly around the eyes.',
      'Stop and see a doctor if redness, swelling or irritation appears.',
      'Contains fragrance with five declared allergens. Patch test first if you react easily.',
      'No water-resistance claim - reapply after swimming, sweating or towelling.',
      'Store cool and dry, out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '40 g' },
      { label: 'Grade', value: 'SPF40 / PA++ - strong UVB, moderate UVA' },
      { label: 'Filters', value: 'Four, 18.50% combined, all assayed on the batch' },
      { label: 'Contains', value: 'Octinoxate at 7.50%, within the 10% European limit' },
      { label: 'Free from', value: 'Parabens, drying alcohol and colourants' },
      { label: 'Fragranced', value: 'Yes, 0.25%, with five declared allergens' },
      { label: 'Water resistance', value: 'None claimed - reapply after water or sweat' },
      { label: 'Licence', value: 'Korean single-function: UV protection' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'How is this weaker than Ultra Shield when it has more filter in it?',
        a: 'Because grade depends on which wavelengths the filters absorb, not how much filter there is. This tube is 18.5% filter against Ultra Shield\u2019s 17.1%, but three of its four are UVB absorbers and the only UVA cover is titanium dioxide, which reaches short UVA and stops. Ultra Shield carries dedicated long-UVA filters, which is what earns it PA++++ instead of PA++.',
      },
      {
        q: 'Does it really contain octinoxate?',
        a: 'Yes, at 7.50%, and it is the largest single filter in the formula. European law allows up to 10% and the EU\u2019s scientific committee concluded in 2025 that it is safe at that level in a face cream. The same review confirmed it is endocrine-active and did not look at environmental effects at all. If that is a dealbreaker, buy the Ultra Shield - it has none, and it costs more than this.',
      },
      {
        q: 'Which of the two should I actually buy?',
        a: 'This one for weekdays, under make-up, when your sun exposure is incidental. Ultra Shield for a day genuinely spent outside, or when the UV index is at the top of the scale. If you only want one tube and you live in the Gulf, take the Ultra Shield.',
      },
      {
        q: 'Can I swim in it?',
        a: 'Reapply as soon as you are out and dry. There is no water-resistance test for this product, so we make no such claim and you should not assume one.',
      },
      {
        q: 'Is it good for sensitive skin?',
        a: 'It is dermatologically tested and free of parabens, drying alcohol and colourants. But it is fragranced at 0.25% with five declared allergens, so for genuinely reactive skin a fragrance-free sunscreen is the safer choice. We list the allergens on this page rather than making you find the carton.',
      },
      {
        q: 'What about the peptide and the stem cells it is marketed with?',
        a: 'They are in the formula at doses too small to do anything: the palmitoyl pentapeptide-4 is at one part per billion, the rose and grape stem-cell extracts at 3 and 1 parts per million, and the Lactobacillus ferment at a declared zero. Buy this for the filter system, which is real and was measured.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: MultiSunCopy = {
  eyebrow: 'واقي الشمس مالتي صن · SPF40 / PA++',
  headline: 'مرشحات أكثر من الأقوى. ودرجة أقل. وإليك السبب.',
  subheadline:
    'أربعة مرشحات بمجموع 18.5% - أي حمل أثقل فعلياً من واقي SPF50+ في المجموعة - لكن ثلاثة منها تمتصّ UVB، ولا يصل إلى UVA سوى ثاني أكسيد التيتانيوم. هذا ما تعنيه درجة PA++، ولهذا فهو الكريم اليومي الخفيف لا كريم يوم في الخارج.',
  heroBullets: [
    'أربعة مرشحات، 18.5% من الأنبوب، جميعها مقيسة على الدفعة',
    'SPF40 / PA++ - حماية قوية من UVB ومتوسطة من UVA',
    'خفيف بما يكفي لوضعه تحت المكياج كل صباح',
    'يحتوي أوكتينوكسات بنسبة 7.5%، مذكورة بوضوح أدناه',
  ],
  badges: ['صُنع في كوريا', '40 غ', 'مختبر جلدياً', 'بلا بارابين أو كحول أو ملوّنات'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '18.5%', label: 'من الأنبوب مرشحات' },
    { value: '4', label: 'مرشحات، كلها مقيسة على الدفعة' },
    { value: '40 غ', label: 'معبّأ عند 41.07 غ' },
    { value: 'pH 6.7', label: 'ضمن مواصفة 5.0-7.0' },
  ],

  filters: {
    eyebrow: 'منظومة المرشحات',
    title: 'أربعة مرشحات، وما يصل إليه كل منها',
    intro:
      'مأخوذة مباشرة من تركيبة الشركة الكمّية، وبجانب كلٍّ منها الحدّ الأوروبي الأقصى لترَي أين تقف التركيبة منه.',
    columns: { name: 'المرشّح', amount: 'في هذا الأنبوب', role: 'ما يغطّيه', cap: 'الحدّ الأوروبي' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7.50%', role: 'UVB', cap: '10%' },
      { name: 'Ethylhexyl Salicylate', amount: '5.00%', role: 'UVB', cap: '5%' },
      { name: 'Titanium Dioxide', amount: '3.00%', role: 'UVB وUVA القصير', cap: '25%' },
      { name: 'Isoamyl p-Methoxycinnamate', amount: '3.00%', role: 'UVB', cap: '10%' },
    ],
    total:
      'المجموع: 18.50%. والأوكتيساليت عند سقفه تماماً 5% - عند الحدّ لا فوقه. الحدود من اللائحة (EC) 1223/2009، الملحق السادس.',
  },

  grade: {
    eyebrow: 'لماذا PA++ لا PA++++',
    title: 'الطول الموجي الغائب',
    body:
      'قارني بين واقيَي جينوسيس وسيبدو شيء غريباً: هذا يحمل 18.5% مرشحات ودرجته SPF40 / PA++، بينما ألترا شيلد يحمل 17.1% ودرجته SPF50+ / PA++++. مرشحات أقل، ودرجة أفضل. والسبب هو أي الأطوال الموجية تمتصّها تلك المرشحات. فثلاثة من الأربعة هنا - الميثوكسي سينامات والساليسيلات والأميلوكسات - تمتصّ UVB، والوحيد الذي يصل إلى UVA هو ثاني أكسيد التيتانيوم، وهو يغطّي الطرف القصير ويتوقف. لا يوجد في هذا الأنبوب مرشّح مخصّص لـ UVA الطويل.',
    aside:
      'الـ SPF رقم يخصّ UVB، والـ PA رقم يخصّ UVA. وهذا الكريم قويّ في الأول ومتوسط في الثاني، وهي طريقة منطقية تماماً لبناء كريم يومي خفيف - وطريقة رديئة لبناء كريم ليوم على الشاطئ.',
  },

  octinoxate: {
    eyebrow: 'اقرئي هذا قبل الشراء',
    title: 'هذا المنتج يحتوي أوكتينوكسات',
    body:
      'الإيثيل هكسيل ميثوكسي سينامات، المعروف بالأوكتينوكسات، هو أكبر مرشّح في هذه التركيبة بنسبة 7.50%. وصفحة ألترا شيلد لدينا تذكر أن ذلك المنتج خالٍ من الأوكتينوكسات، وهذا صحيح بشأنه - لكن ليس بشأن هذا، ولذلك نعرض الموقف كاملاً لا في هامش.',
    points: [
      'القانون الأوروبي يسمح به حتى 10% كمرشّح. وهذه التركيبة تستخدم 7.50%.',
      'راجعته اللجنة العلمية الأوروبية وخلصت في يونيو 2025 إلى أنه آمن حتى 10% في كريم للوجه، وآمن للأطفال استناداً إلى هامش الأمان.',
      'والرأي نفسه يؤكّد أنه نشط هرمونياً - إستروجيني ومضادّ ضعيف للأندروجين. ولم يُسحب هذا الاستنتاج، بل جرت مراعاته في نمذجة التعرّض التي بُني عليها رقم الـ 10%.',
      'وتلك المراجعة لم تتناول الآثار البيئية إطلاقاً. فهي ليست إجابة عن سؤال الشعاب المرجانية، ولا ينبغي تقديمها كذلك.',
    ],
    verdict:
      'إن كان تجنّب الأوكتينوكسات هو سبب قراءتك لقائمة المكوّنات، فاشتري ألترا شيلد بدلاً منه. سعره أعلى من هذا، ونفضّل قول ذلك على بيعك الأنبوب الخطأ.',
  },

  assay: {
    eyebrow: 'الجودة',
    title: 'قاسوا ما فيه فعلاً',
    intro:
      'معظم الواقيات تخبرك بما دخل خزّان الخلط. أما هذه الدفعة فقد اختُبرت بعد ذلك، مرشّحاً مرشّحاً، والنتائج مسجّلة على الشهادة.',
    columns: { name: 'المرشّح', declared: 'المعلن', found: 'الموجود في الدفعة' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', declared: '7.50%', found: '7.21%' },
      { name: 'Ethylhexyl Salicylate', declared: '5.00%', found: '4.96%' },
      { name: 'Isoamyl p-Methoxycinnamate', declared: '3.00%', found: '2.98%' },
      { name: 'Titanium Dioxide', declared: '3.00%', found: '2.75%' },
    ],
    note:
      'الأربعة جميعاً تتجاوز المواصفة التي تشترط 90% على الأقل من الكمية المعلنة. تفصيل صغير لا تنشره أي علامة تقريباً، وهو الفارق بين رقم على العلبة ورقم تحقّق منه أحد.',
  },

  honesty: {
    eyebrow: 'عن المكوّنات المهدّئة',
    title: 'أحدها بجرعة صفر',
    body:
      'العلبة تنسب التهدئة إلى بالميتويل بنتابيبتايد-4 والقنطورية والقبعية. وفي التركيبة الكمّية للشركة نفسها، البيبتايد عند 0.0000001% - جزء واحد من المليار - والنباتان عند 10 أجزاء من المليون لكل منهما. ومستخلصا الخلايا الجذعية للورد والعنب عند 3 و1 جزء من المليون. أما مرشَّح تخمّر اللاكتوباسيلوس/حليب الصويا، الذي كانت صفحة منتجنا تدرجه كمكوّن رئيسي، فمُعلَن عند 0.0000000%.',
    aside:
      'الموجود هنا فعلاً بمستوى فعّال هو منظومة المرشحات، والبيوتيلين غلايكول بنسبة 5%، والدايميثيكون بنسبة 2.3%، والغليسرين بنسبة 1%. وهذا يصنع واقياً خفيفاً مريحاً غير دهني. لكنه لا يصنع علاجاً، ولن نبيعه على هذا الأساس.',
  },

  fragrance: {
    eyebrow: 'إن كانت بشرتك تفاعلية',
    title: 'إنه معطّر، وهذه مكوّناته بالضبط',
    body:
      'عطر لافندر بنسبة 0.25%، يحمل خمسة مسبّبات حساسية يوجب القانون الأوروبي ذكرها بالاسم. وهي مطبوعة على العلبة ومكرّرة هنا، لأن واقياً يُباع جزئياً على التهدئة ينبغي أن يكون صريحاً مع أكثر الناس عرضة للتفاعل معه. وإن كنتِ تختارين تحديداً لبشرة تفاعلية، فقد يناسبك واقٍ خالٍ من العطر أكثر.',
    allergens: [
      'Benzyl Benzoate - 0.025%',
      'Citronellol - 0.011%',
      'Hexyl Cinnamal - 0.011%',
      'Alpha-Isomethyl Ionone - 0.011%',
      'Limonene - 0.004%',
    ],
  },

  pick: {
    eyebrow: 'الاختيار بين الاثنين',
    title: 'أي واقٍ من جينوسيس',
    intro: 'ليسا جيّداً وأفضل. بل مصنوعان لأيام مختلفة.',
    thisOne: {
      title: 'مالتي صن كريم، SPF40 / PA++',
      items: [
        'أيام الأسبوع، والتنقّل، والمكتب، وتوصيل الأطفال',
        'تحت المكياج - فهو الأخفّ بين الاثنين',
        'حين يكون معظم تعرّضك عارضاً لا مقصوداً',
        '40 غ، وهو الأيسر سعراً في الزوج',
      ],
    },
    otherOne: {
      title: 'ألترا شيلد، SPF50+ / PA++++',
      items: [
        'يوم يُقضى فعلاً في الخارج، أو مؤشر UV عند 11 فما فوق',
        'حين تهمّ تغطية UVA الطويل - فهي مقيسة هناك وغير مقيسة هنا',
        'إن كنتِ تتجنّبين الأوكتينوكسات',
        '50 غ، وهو الأقوى في الزوج',
      ],
    },
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'كمية كافية، كل صباح',
    frequency: 'يومياً كآخر خطوة عناية · أعيدي الوضع كل ساعتين في الخارج',
    steps: [
      {
        title: 'بعد المرطّب',
        body: 'واقي الشمس هو آخر خطوة في العناية والخطوة السابقة للمكياج، لا جزء من أيّهما. والعلبة تذكر صراحةً أنه يستقرّ جيداً تحت كريم الأساس.',
      },
      {
        title: 'إصبعان للوجه والرقبة',
        body: 'خط على السبابة والوسطى هو تقريباً الكمية التي يُختبر عليها الـ SPF. وإن وضعتِ ثلثها حصلتِ على نحو ثلث الحماية، وهكذا يحترق معظم الناس وهم يستعملون منتجاً فعّالاً.',
      },
      {
        title: 'اتركيه يستقرّ قبل الخروج',
        body: 'امنحيه دقائق ليشكّل طبقة بدل الخروج وهو ما زال لزجاً.',
      },
      {
        title: 'ثم كل ساعتين في الشمس',
        body: 'العلبة تقول ذلك وهي محقّة. وكذلك بعد التعرّق أو التجفيف - فلا ادعاء لمقاومة الماء في هذا المنتج.',
      },
    ],
    note:
      'بلا بارابين ولا كحول مجفّف ولا ملوّنات، وهو ما يذكره اللوح الروسي على العلبة وتؤكده التركيبة.',
  },

  video: {
    title: 'الملمس',
    body: 'كيف ينتشر، وكيف ينتهي، وكم يترك خلفه من أثر.',
    unsupported: 'متصفّحك لا يدعم تشغيل الفيديو.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في الأنبوب',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },

  lab: {
    eyebrow: 'الدفعة',
    title: 'ما تقوله الشهادة',
    intro: 'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة.',
    rows: [
      { label: 'الحموضة', value: '6.71 عند 25 درجة، ضمن مواصفة 5.00-7.00' },
      { label: 'التعبئة', value: '41.07 غ مقابل 40 غ معلنة' },
      { label: 'البكتيريا', value: 'أقل من 10 وحدات/مل، مقابل 100 مسموحة' },
      { label: 'العفن والخمائر', value: 'أقل من 10 وحدات/مل، مقابل 100 مسموحة' },
      { label: 'الثبات', value: 'اجتاز عند 50 درجة مئوية' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات، وتاريخ الانتهاء على العلبة' },
      { label: 'الترخيص', value: 'مستحضر وظيفي كوري للحماية من الأشعة فوق البنفسجية' },
    ],
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'للاستعمال الخارجي فقط. تجنّبي العينين والأغشية المخاطية، واشطفي جيداً بالماء البارد عند الملامسة.',
      'لا تضعيه مباشرة حول العينين.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'يحتوي عطراً بخمسة مسبّبات حساسية معلنة. اختبريه على بقعة صغيرة أولاً إن كنتِ سريعة التفاعل.',
      'لا ادعاء لمقاومة الماء - أعيدي الوضع بعد السباحة أو التعرّق أو التجفيف.',
      'يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '40 غ' },
      { label: 'الدرجة', value: 'SPF40 / PA++ - قوي على UVB، متوسط على UVA' },
      { label: 'المرشحات', value: 'أربعة، 18.50% مجتمعة، وكلها مقيسة على الدفعة' },
      { label: 'يحتوي', value: 'أوكتينوكسات بنسبة 7.50%، ضمن الحدّ الأوروبي 10%' },
      { label: 'خالٍ من', value: 'البارابين والكحول المجفّف والملوّنات' },
      { label: 'معطّر', value: 'نعم، 0.25%، بخمسة مسبّبات حساسية معلنة' },
      { label: 'مقاومة الماء', value: 'غير مُدّعاة - أعيدي الوضع بعد الماء أو العرق' },
      { label: 'الترخيص', value: 'وظيفة كورية واحدة: الحماية من الأشعة فوق البنفسجية' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'كيف يكون أضعف من ألترا شيلد وفيه مرشحات أكثر؟',
        a: 'لأن الدرجة تعتمد على أي الأطوال الموجية تمتصّها المرشحات، لا على كميتها. هذا الأنبوب 18.5% مرشحات مقابل 17.1% في ألترا شيلد، لكن ثلاثة من أربعته تمتصّ UVB، والتغطية الوحيدة لـ UVA هي ثاني أكسيد التيتانيوم الذي يصل إلى UVA القصير ويتوقف. أما ألترا شيلد فيحمل مرشحات مخصّصة لـ UVA الطويل، وهذا ما يمنحه PA++++ بدل PA++.',
      },
      {
        q: 'هل يحتوي فعلاً على أوكتينوكسات؟',
        a: 'نعم، بنسبة 7.50%، وهو أكبر مرشّح مفرد في التركيبة. والقانون الأوروبي يسمح حتى 10%، وخلصت اللجنة العلمية الأوروبية في 2025 إلى أنه آمن عند هذا المستوى في كريم للوجه. والمراجعة نفسها أكّدت أنه نشط هرمونياً ولم تتناول الآثار البيئية إطلاقاً. فإن كان ذلك مانعاً حاسماً لديك، فاشتري ألترا شيلد - فهو خالٍ منه، وسعره أعلى من هذا.',
      },
      {
        q: 'أيّهما أشتري فعلاً؟',
        a: 'هذا لأيام الأسبوع وتحت المكياج وحين يكون تعرّضك للشمس عارضاً. وألترا شيلد ليوم يُقضى فعلاً في الخارج، أو حين يكون مؤشر UV في أعلى السلّم. وإن أردتِ أنبوباً واحداً فقط وتعيشين في الخليج، فخذي ألترا شيلد.',
      },
      {
        q: 'هل أستطيع السباحة به؟',
        a: 'أعيدي الوضع فور خروجك وجفافك. لا يوجد اختبار مقاومة للماء لهذا المنتج، فلا ندّعي ذلك وعليكِ ألا تفترضيه.',
      },
      {
        q: 'هل يناسب البشرة الحسّاسة؟',
        a: 'هو مختبر جلدياً وخالٍ من البارابين والكحول المجفّف والملوّنات. لكنه معطّر بنسبة 0.25% بخمسة مسبّبات حساسية معلنة، فلبشرة تفاعلية حقاً يبقى الواقي الخالي من العطر الخيار الأأمن. ونحن ندرج المسبّبات على هذه الصفحة بدل أن نجعلك تبحثين عنها على العلبة.',
      },
      {
        q: 'وماذا عن البيبتايد والخلايا الجذعية المسوَّق بها؟',
        a: 'هي في التركيبة بجرعات أصغر من أن تفعل شيئاً: البالميتويل بنتابيبتايد-4 عند جزء واحد من المليار، ومستخلصا الورد والعنب عند 3 و1 جزء من المليون، ومخمّر اللاكتوباسيلوس عند صفر معلن. اشتريه من أجل منظومة المرشحات، فهي حقيقية وقد قيست.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: MultiSunCopy = {
  eyebrow: 'Multi Sun Cream · SPF40 / PA++',
  headline: 'Фильтров больше, чем у сильного. Степень ниже. Вот почему.',
  subheadline:
    'Четыре УФ-фильтра общей массой 18,5% - фактически больше, чем у SPF50+ в линейке, - но три из них поглощают UVB, а до UVA дотягивается только диоксид титана. Это и означает степень PA++, и поэтому перед вами лёгкий крем на каждый день, а не крем для дня на улице.',
  heroBullets: [
    'Четыре фильтра, 18,5% тюбика, и каждый измерен в партии',
    'SPF40 / PA++ - сильно по UVB, умеренно по UVA',
    'Достаточно лёгкий, чтобы носить под макияжем каждое утро',
    'Содержит октиноксат 7,5% - прямо сказано ниже',
  ],
  badges: ['Сделано в Корее', '40 г', 'Дерматологически тестирован', 'Без парабенов, спирта и красителей'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '18,5%', label: 'Тюбика - это УФ-фильтры' },
    { value: '4', label: 'Фильтра, все измерены в партии' },
    { value: '40 г', label: 'Налито 41,07 г' },
    { value: 'pH 6,7', label: 'При спецификации 5,0-7,0' },
  ],

  filters: {
    eyebrow: 'Система фильтров',
    title: 'Четыре фильтра и до чего дотягивается каждый',
    intro:
      'Прямо из количественной формулы производителя, с европейским законным максимумом рядом с каждым, чтобы было видно, где стоит формула.',
    columns: { name: 'Фильтр', amount: 'В этом тюбике', role: 'Что закрывает', cap: 'Максимум ЕС' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7,50%', role: 'UVB', cap: '10%' },
      { name: 'Ethylhexyl Salicylate', amount: '5,00%', role: 'UVB', cap: '5%' },
      { name: 'Titanium Dioxide', amount: '3,00%', role: 'UVB и короткий UVA', cap: '25%' },
      { name: 'Isoamyl p-Methoxycinnamate', amount: '3,00%', role: 'UVB', cap: '10%' },
    ],
    total:
      'Суммарно: 18,50%. Октисалат стоит ровно на своём потолке в 5% - на пределе, но не выше. Пределы по регламенту (EC) 1223/2009, Приложение VI.',
  },

  grade: {
    eyebrow: 'Почему PA++, а не PA++++',
    title: 'Недостающая длина волны',
    body:
      'Сравните два санскрина GENOSYS, и что-то покажется неправильным: здесь 18,5% фильтров и степень SPF40 / PA++, а у Ultra Shield 17,1% и SPF50+ / PA++++. Фильтров меньше, степень выше. Причина в том, какие длины волн эти фильтры поглощают. Три из четырёх здесь - метоксициннамат, салицилат и амилоксат - поглощают UVB, а до UVA дотягивается только диоксид титана, который закрывает короткий край и на этом останавливается. Специального фильтра длинного UVA в этом тюбике нет.',
    aside:
      'SPF - это число про UVB, PA - про UVA. Этот крем силён в первом и умерен во втором, и это вполне разумный способ собрать лёгкий ежедневный крем - и плохой способ собрать крем для пляжа.',
  },

  octinoxate: {
    eyebrow: 'Прочитайте перед покупкой',
    title: 'Здесь есть октиноксат',
    body:
      'Этилгексил метоксициннамат, он же октиноксат, - самый крупный фильтр в этой формуле, 7,50%. На странице Ultra Shield написано, что тот продукт октиноксата не содержит, и для него это правда - но не для этого. Поэтому позиция изложена целиком, а не сноской.',
    points: [
      'Европейский закон разрешает его как фильтр до 10%. В этой формуле - 7,50%.',
      'Научный комитет ЕС рассмотрел его и в июне 2025 года заключил, что он безопасен до 10% в креме для лица и безопасен для детей исходя из запаса безопасности.',
      'То же заключение подтверждает, что он эндокринно активен - эстрогенен и слабо антиандрогенен. Этот вывод не отменён, он учтён в моделировании воздействия, на котором построена цифра 10%.',
      'Тот пересмотр вообще не рассматривал воздействие на окружающую среду. Значит, он не ответ на вопрос о кораллах, и подавать его так нельзя.',
    ],
    verdict:
      'Если вы читаете состав именно потому, что избегаете октиноксата, берите Ultra Shield. Он дороже этого, и мы скорее скажем это, чем продадим вам не тот тюбик.',
  },

  assay: {
    eyebrow: 'Качество',
    title: 'Они измерили то, что внутри',
    intro:
      'Большинство санскринов сообщают, что попало в смеситель. Эту партию проверили после, фильтр за фильтром, и результаты стоят в сертификате.',
    columns: { name: 'Фильтр', declared: 'Заявлено', found: 'Найдено в партии' },
    rows: [
      { name: 'Ethylhexyl Methoxycinnamate', declared: '7,50%', found: '7,21%' },
      { name: 'Ethylhexyl Salicylate', declared: '5,00%', found: '4,96%' },
      { name: 'Isoamyl p-Methoxycinnamate', declared: '3,00%', found: '2,98%' },
      { name: 'Titanium Dioxide', declared: '3,00%', found: '2,75%' },
    ],
    note:
      'Все четыре проходят спецификацию, которая требует не менее 90% заявленного. Мелочь, которую почти никто не публикует, и разница между числом на коробке и числом, которое кто-то проверил.',
  },

  honesty: {
    eyebrow: 'Об успокаивающих компонентах',
    title: 'Один из них в дозе ноль',
    body:
      'Коробка приписывает успокоение пальмитоил пентапептиду-4, центелле и шлемнику. В количественной формуле самого производителя пептид стоит на 0,0000001% - одна часть на миллиард, - а два растения по 10 ppm каждое. Экстракты стволовых клеток розы и винограда - 3 и 1 ppm. А фильтрат ферментации лактобактерий и соевого молока, который наша же страница указывала как ключевой компонент, заявлен на 0,0000000%.',
    aside:
      'Что действительно здесь на рабочем уровне - система фильтров, бутиленгликоль 5%, диметикон 2,3% и глицерин 1%. Из этого получается лёгкий, комфортный, нежирный санскрин. Лечения из этого не получается, и продавать его так мы не будем.',
  },

  fragrance: {
    eyebrow: 'Если кожа реактивная',
    title: 'Он с отдушкой, и вот с какой именно',
    body:
      'Лавандовая отдушка 0,25%, несущая пять аллергенов, которые европейский закон обязывает назвать поимённо. Они напечатаны на коробке и повторены здесь, потому что санскрин, который отчасти продают за успокоение, обязан быть честным с теми, кто скорее всего на него отреагирует. Если вы выбираете именно под реактивную кожу, санскрин без отдушки подойдёт лучше.',
    allergens: [
      'Benzyl Benzoate - 0,025%',
      'Citronellol - 0,011%',
      'Hexyl Cinnamal - 0,011%',
      'Alpha-Isomethyl Ionone - 0,011%',
      'Limonene - 0,004%',
    ],
  },

  pick: {
    eyebrow: 'Выбор между двумя',
    title: 'Какой санскрин GENOSYS',
    intro: 'Это не «хороший» и «лучше». Они собраны под разные дни.',
    thisOne: {
      title: 'Multi Sun Cream, SPF40 / PA++',
      items: [
        'Будни, дорога, офис, школа',
        'Под макияж - он легче из двух',
        'Когда большая часть УФ достаётся вам мимоходом',
        '40 г, и он доступнее в паре',
      ],
    },
    otherOne: {
      title: 'Ultra Shield, SPF50+ / PA++++',
      items: [
        'День, действительно проведённый на улице, или УФ-индекс 11 и выше',
        'Когда важен длинный UVA - там он измерен, здесь нет',
        'Если вы избегаете октиноксата',
        '50 г, и он сильнее в паре',
      ],
    },
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Достаточно, каждое утро',
    frequency: 'Ежедневно, последним шагом ухода · заново каждые два часа на улице',
    steps: [
      {
        title: 'После крема',
        body: 'Санскрин - последний шаг ухода и шаг перед макияжем, а не часть того или другого. Коробка прямо говорит, что он хорошо ложится под тональное средство.',
      },
      {
        title: 'Два пальца на лицо и шею',
        body: 'Полоска по указательному и среднему - примерно то количество, на котором тестируют SPF. Нанесёте треть - получите примерно треть защиты, и именно так люди обгорают в работающем средстве.',
      },
      {
        title: 'Дайте схватиться перед выходом',
        body: 'Несколько минут на формирование плёнки лучше, чем выйти за дверь ещё липким.',
      },
      {
        title: 'И каждые два часа на солнце',
        body: 'Коробка так говорит, и она права. А также после пота или полотенца - водостойкости у этого продукта не заявлено.',
      },
    ],
    note:
      'Без парабенов, без сушащего спирта и без красителей - это указано на русской панели коробки и подтверждается формулой.',
  },

  video: {
    title: 'Текстура',
    body: 'Как распределяется, как финиширует и как мало оставляет после себя.',
    unsupported: 'Ваш браузер не поддерживает воспроизведение видео.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что в тюбике',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },

  lab: {
    eyebrow: 'Партия',
    title: 'Что говорит сертификат',
    intro: 'Сделано в Корее и выпущено против письменной спецификации.',
    rows: [
      { label: 'pH', value: '6,71 при 25 °C, в пределах спецификации 5,00-7,00' },
      { label: 'Наполнение', value: '41,07 г при заявленных 40 г' },
      { label: 'Бактерии', value: 'Менее 10 КОЕ/мл при допустимых 100' },
      { label: 'Плесени и дрожжи', value: 'Менее 10 КОЕ/мл при допустимых 100' },
      { label: 'Стабильность', value: 'Пройдена при 50 °C' },
      { label: 'Срок годности', value: 'Три года, дата на коробке' },
      { label: 'Лицензия', value: 'Корейское функциональное средство для защиты от УФ' },
    ],
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Только для наружного применения. Избегайте глаз и слизистых, при попадании тщательно промойте прохладной водой.',
      'Не наносите непосредственно вокруг глаз.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Содержит отдушку с пятью заявленными аллергенами. Сделайте пробу, если легко реагируете.',
      'Водостойкость не заявлена - наносите заново после плавания, пота или полотенца.',
      'Храните в прохладном сухом месте, недоступном для детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '40 г' },
      { label: 'Степень', value: 'SPF40 / PA++ - сильно по UVB, умеренно по UVA' },
      { label: 'Фильтры', value: 'Четыре, 18,50% суммарно, все измерены в партии' },
      { label: 'Содержит', value: 'Октиноксат 7,50%, в пределах европейского лимита 10%' },
      { label: 'Без', value: 'Парабенов, сушащего спирта и красителей' },
      { label: 'Отдушка', value: 'Да, 0,25%, с пятью заявленными аллергенами' },
      { label: 'Водостойкость', value: 'Не заявлена - наносите заново после воды или пота' },
      { label: 'Лицензия', value: 'Одна корейская функция: защита от УФ' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Как он слабее Ultra Shield, если фильтров в нём больше?',
        a: 'Потому что степень зависит от того, какие длины волн поглощают фильтры, а не от их количества. Здесь 18,5% фильтров против 17,1% у Ultra Shield, но три из четырёх поглощают UVB, а единственное покрытие UVA - диоксид титана, который дотягивается до короткого UVA и останавливается. У Ultra Shield есть специальные фильтры длинного UVA, и именно это даёт ему PA++++ вместо PA++.',
      },
      {
        q: 'В нём правда есть октиноксат?',
        a: 'Да, 7,50%, и это крупнейший фильтр формулы. Европейский закон разрешает до 10%, и научный комитет ЕС в 2025 году заключил, что на этом уровне он безопасен в креме для лица. То же заключение подтвердило, что он эндокринно активен, и вообще не рассматривало воздействие на среду. Если для вас это принципиально, берите Ultra Shield - там его нет, и он дороже этого.',
      },
      {
        q: 'Какой из двух брать?',
        a: 'Этот - на будни, под макияж, когда солнце достаётся мимоходом. Ultra Shield - на день, реально проведённый снаружи, или когда УФ-индекс на верхней отметке. Если нужен один тюбик и вы живёте в Заливе, берите Ultra Shield.',
      },
      {
        q: 'Можно в нём плавать?',
        a: 'Нанесите заново, как только вышли и обсохли. Теста на водостойкость для этого продукта нет, поэтому мы её не заявляем, и предполагать её не стоит.',
      },
      {
        q: 'Подойдёт ли для чувствительной кожи?',
        a: 'Он дерматологически тестирован и без парабенов, сушащего спирта и красителей. Но в нём отдушка 0,25% с пятью заявленными аллергенами, так что для по-настоящему реактивной кожи безопаснее санскрин без отдушки. Аллергены мы перечисляем прямо на этой странице, а не отправляем вас искать коробку.',
      },
      {
        q: 'А пептид и стволовые клетки, которыми его рекламируют?',
        a: 'Они в формуле в дозах, слишком малых, чтобы что-то делать: пальмитоил пентапептид-4 - одна часть на миллиард, экстракты розы и винограда - 3 и 1 ppm, фермент лактобактерий - заявленный ноль. Покупайте ради системы фильтров: она реальна и её измерили.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const MULTI_SUN_COPY: Record<Locale, MultiSunCopy> = {
  en: EN,
  ar: { ...AR, ...MULTI_SUN_AR_COPY },
  ru: { ...RU, ...MULTI_SUN_RU_COPY },
}

export function getMultiSunCopy(locale: string | undefined): MultiSunCopy {
  return MULTI_SUN_COPY[(locale as Locale) ?? 'en'] ?? MULTI_SUN_COPY.en
}

/** Ultra Shield first: the page sends octinoxate-avoiders straight to it. */
export const COMPANION_PRODUCT_IDS = ['39', '16', '36', '13'] as const
