/**
 * Bespoke copy for ULTRA SHIELD SUN CREAM [SPF50+ / PA++++] (product 39).
 *
 * SOURCING — every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_39_ULTRA_SHIELD_SOURCE_AUDIT.md:
 *   - EU safety assessment (QACS Lab, EC 1223/2009, Feb 2025, ID 24 06 01975):
 *     in-vivo SPF 65.9 +/- 4.74 and UVA-PF 23.13 / 24.3, both by Dr Koziej;
 *     the raw-material trade-name table; the homosalate regulatory history.
 *   - DTS MG signed formula: six UV filters totalling 17.10%, niacinamide
 *     2.00%, adenosine 0.04%, and the trace complex at 0.1 ppb to 1 ppm.
 *   - COA lot 370CK: pH 7.23, net 50.9 g, all four pathogens not detected.
 *   - The registered carton, including the Korean triple-function declaration.
 *
 * THE SHAPE OF THIS PAGE. Unlike products 36 and 41, the headline claim here is
 * genuinely excellent and independently measured: SPF tested at 65.9 and UVA-PF
 * at 23-24 against a required 22.0. So the page leads on measured numbers, then
 * niacinamide 2% and adenosine 0.04%, which are the two actives Korea licenses
 * the brightening and wrinkle functions against.
 *
 * WHAT MUST STAY OUT:
 *   - "7-filter". It is SIX. The seventh is butyloctyl salicylate, a
 *     photostabiliser the dossier classes as a skin-conditioning agent.
 *   - "Reef-safe". Unregulated term, and the formula contains homosalate and
 *     octisalate. The verifiable claim is "no oxybenzone, no octinoxate".
 *   - Any water-resistance or swimming claim. No water-resistance test exists
 *     in the pack, so the page tells people to reapply after water instead.
 *   - Barrier repair from Ceramide NP (0.1 ppb), recovery from MicroHA (1 ppm)
 *     or ProbioMETA (1 ppm), and above all the deck's "improves rosacea and
 *     acne", which is a medical claim on a trace ingredient.
 *   - The contract manufacturer's name, and the lot code.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface UltraShieldCopy {
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

  measured: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string; note: string }>
    footnote: string
  }

  filters: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; amount: string; role: string }
    rows: Array<{ name: string; amount: string; role: string }>
    total: string
    seventh: string
  }

  actives: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  honesty: {
    eyebrow: string
    title: string
    body: string
    aside: string
  }

  homosalate: {
    eyebrow: string
    title: string
    body: string
  }

  water: {
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

  uae: {
    eyebrow: string
    title: string
    intro: string
    items: string[]
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

const EN: UltraShieldCopy = {
  eyebrow: 'Ultra Shield Sun Cream · SPF50+ / PA++++',
  headline: 'Tested at SPF 65.9. Sold as 50+ because that is the ceiling.',
  subheadline:
    'Six UV filters at a combined 17.1%, measured in a laboratory rather than estimated: SPF 65.9 and a UVA protection factor of 23 to 24, against the 22.0 European law asks of a sunscreen this strong. Niacinamide at 2% and adenosine at 0.04% come with it, which is why Korea licenses this as a triple-function cosmetic rather than a sunscreen.',
  heroBullets: [
    'SPF measured at 65.9 in vivo · UVA-PF 23.1 and 24.3',
    'Six filters, 17.1% of the formula, chemical and mineral',
    'Niacinamide 2% and adenosine 0.04%, both at licensed doses',
    'No oxybenzone, no octinoxate',
  ],
  badges: ['Made in Korea', '50 g', 'EU safety assessed', 'Dermatologically tested'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '65.9', label: 'Measured SPF, in vivo' },
    { value: '24.3', label: 'UVA factor, where 22.0 is required' },
    { value: '17.1%', label: 'Of the tube is UV filter' },
    { value: '2%', label: 'Niacinamide, at the licensed dose' },
  ],

  measured: {
    eyebrow: 'The numbers',
    title: 'Somebody actually measured this',
    intro:
      'Most sunscreen pages tell you the number on the front of the box. This one comes out of a European safety dossier assessed under EC Regulation 1223/2009, with the test reports named inside it.',
    rows: [
      {
        label: 'Sun protection factor',
        value: '65.9 ± 4.74',
        note: 'Measured on skin, not calculated. The label reads 50+ because European law does not let a sunscreen claim a higher number, however well it performs.',
      },
      {
        label: 'UVA protection factor',
        value: '23.13 and 24.3',
        note: 'Two separate reports. UVA is the wavelength that ages skin rather than burns it, and it is the one most sunscreens are weakest on.',
      },
      {
        label: 'The European requirement',
        value: 'UVA-PF ≥ SPF ÷ 3',
        note: 'A third of 65.9 is 22.0. Both measured results clear it, which is what earns the PA++++ grade rather than a marketing department deciding on it.',
      },
    ],
    footnote:
      'Testing by Dr Koziej Sp. z o.o. Sp.k., reported inside the product\u2019s EU safety assessment. It is also dermatologically tested by patch test, which the assessor cleared for the label.',
  },

  filters: {
    eyebrow: 'The filter system',
    title: 'Six filters, and what each one is for',
    intro:
      'Five organic filters and one mineral. Between them they cover UVB and both halves of UVA, which is how a single product reaches this grade.',
    columns: { name: 'Filter', amount: 'Concentration', role: 'What it covers' },
    rows: [
      { name: 'Homosalate', amount: '4.00%', role: 'UVB, and it keeps the others in solution' },
      { name: 'Ethylhexyl Salicylate', amount: '3.50%', role: 'UVB, and a photostabiliser for the rest' },
      { name: 'Terephthalylidene Dicamphor Sulfonic Acid', amount: '3.07%', role: 'Short UVA — the reason this scores as it does' },
      { name: 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine', amount: '3.00%', role: 'Broad spectrum, UVB through long UVA' },
      { name: 'Ethylhexyl Triazone', amount: '2.00%', role: 'UVB, the most efficient filter per gram there is' },
      { name: 'Titanium Dioxide', amount: '1.53%', role: 'Mineral, reflects UVB and short UVA' },
    ],
    total: 'Combined filter load: 17.10% of the tube.',
    seventh:
      'You may see this described as a seven-filter system. It is six. The seventh is butyloctyl salicylate, which at 5% is the largest single ingredient of the group but is not an approved filter — it is a solvent that keeps the real filters dissolved and stable. It raises the SPF, it just does not do it by absorbing UV. The manufacturer\u2019s own technical deck lists six.',
  },

  actives: {
    eyebrow: 'Beyond the filters',
    title: 'Two actives at doses that count',
    intro:
      'Korea licenses this as a triple-function cosmetic — protection, brightening and wrinkle improvement — and each function has an ingredient behind it at the concentration the licence requires.',
    items: [
      {
        name: 'Niacinamide',
        dose: '2.00%',
        body: 'Vitamin B3 at the level the brightening function is granted on. It works on uneven tone and it supports the barrier, which is a sensible thing to have in the product you wear on the days your skin takes the most light.',
      },
      {
        name: 'Adenosine',
        dose: '0.04%',
        body: 'The exact dose Korea licenses for wrinkle improvement — the same figure that appears in every functional anti-ageing product registered there. Small number, specific meaning.',
      },
      {
        name: 'The six filters',
        dose: '17.10%',
        body: 'The protection function itself. Nearly a fifth of what is in the tube is doing the one job you bought it for.',
      },
    ],
  },

  honesty: {
    eyebrow: 'About the recovery complex',
    title: 'The soothing story is thinner than the protection',
    body:
      'This product is also sold on after-sun recovery: a Sunburn Care Complex, MicroHA™, ProbioMETA™, a tropical antioxidant complex. Here are the doses. Ceramide NP is at 0.00000001% — one part in ten billion, about five nanograms in a 50 g tube. The hyaluronic acid and the Lactobacillus ferment are around one part per million each. The four fruit extracts are 25 parts per billion apiece.',
    aside:
      'We are not going to build a page on that. The reason to buy this tube is a filter system measured at SPF 65.9 with UVA cover to match, plus niacinamide and adenosine at real doses. That is more than enough of a product without the nanograms.',
  },

  homosalate: {
    eyebrow: 'Worth knowing',
    title: 'On homosalate',
    body:
      'If you look up the filters you will find a question mark over homosalate. In 2021 the European Commission\u2019s scientific committee said it was not safe at the 10% then allowed and proposed 0.5%; after further data it settled on 7.34%, and that limit is now written into European cosmetics law. This formula uses 4.00%, a little over half the permitted maximum, and the safety assessment records a margin of safety above 100. We would rather you read that here than find it somewhere else.',
  },

  water: {
    eyebrow: 'One limitation, stated plainly',
    title: 'This is not a water-resistant sunscreen',
    body:
      'There is no water-resistance test in this product\u2019s file, so we will not imply one. Swim in it, sweat in it or towel off, and you have to reapply — that is true of any sunscreen without a water-resistance claim, and most beach failures come from assuming otherwise. For a day by the water, take the tube with you.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Enough of it, early enough, again later',
    frequency: 'Every morning · reapply every two hours outdoors',
    steps: [
      {
        title: 'Last step, before make-up',
        body: 'After your moisturiser and before anything with colour in it. Sunscreen is the final skincare layer, not the first make-up one.',
      },
      {
        title: 'Two fingers for a face and neck',
        body: 'A line of cream along your index and middle finger is roughly the quantity the SPF was tested at. Almost everyone applies about a third of that, and gets about a third of the protection.',
      },
      {
        title: 'Fifteen to thirty minutes before you go out',
        body: 'The film needs time to set. Applying at the door means walking out under a coat of sunscreen that is not fully formed.',
      },
      {
        title: 'Again every two hours in daylight',
        body: 'And immediately after swimming, sweating or towelling. This one has no water-resistance claim, so treat water as a reset.',
      },
    ],
    note:
      'It has a fragrance, at 0.5%. If you are choosing a sunscreen for reactive skin specifically, that is the line in the ingredient list to weigh up.',
  },

  uae: {
    eyebrow: 'In this climate',
    title: 'Why this one, in the Gulf',
    intro: 'The UV index in the UAE sits at extreme for a good part of the year, including on days that do not feel hot.',
    items: [
      'A grade that holds up when the index is 11 or above',
      'UVA cover that clears the European threshold, and UVA passes through window glass',
      'Silky rather than heavy, so it is wearable at 45 °C',
      'No white cast to speak of: only 1.53% of the filter load is mineral',
      'Niacinamide 2%, which is the right ingredient to be wearing on high-UV days',
      'Fifty grams — a size you can afford to use at the right thickness',
    ],
  },

  video: {
    title: 'The texture',
    body: 'How it spreads, how it finishes, and what it looks like on skin.',
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
    eyebrow: 'Quality',
    title: 'What the batch sheet says',
    intro: 'Made in Korea under GMP and released against a specification. The microbiology on this one is as clean as a sheet gets.',
    rows: [
      { label: 'pH', value: '7.23, inside a 7.20 ± 1.00 specification — higher than most skincare, because the tromethamine neutralises an acidic filter' },
      { label: 'Fill', value: '50.9 g against a 50 g declaration' },
      { label: 'Purity', value: 'Total aerobic count not detected, against a permitted 100 CFU/g' },
      { label: 'Pathogens', value: 'E. coli, P. aeruginosa, S. aureus and C. albicans — all four not detected' },
      { label: 'After opening', value: 'Twelve months, marked on the carton' },
      { label: 'Assessment', value: 'Full EU safety assessment under EC Regulation 1223/2009' },
    ],
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'For external use only. Avoid the eyes and mucous membranes, and rinse thoroughly with cool water on contact.',
      'Do not apply directly around the eyes.',
      'Stop and see a doctor if redness, swelling or irritation appears.',
      'Do not stay out too long even wearing sunscreen. Over-exposure is a serious health risk and no SPF removes it.',
      'Contains fragrance at 0.5%.',
      'Store cool and dry, out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '50 g' },
      { label: 'Grade', value: 'SPF50+ / PA++++ (measured SPF 65.9, UVA-PF 23.1–24.3)' },
      { label: 'Filters', value: 'Six — five organic, one mineral, 17.10% combined' },
      { label: 'Actives', value: 'Niacinamide 2.00%, adenosine 0.04%' },
      { label: 'Free from', value: 'Oxybenzone and octinoxate' },
      { label: 'Water resistance', value: 'None claimed — reapply after water or sweat' },
      { label: 'Licence', value: 'Korean triple-function: UV protection, brightening, wrinkle improvement' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'If it tests at 65.9, why does the box say 50+?',
        a: 'Because 50+ is the highest figure a sunscreen label is permitted to state in Europe, regardless of how it performs. The regulator caps it deliberately, on the grounds that the difference between an SPF 50 and an SPF 70 is small in practice and encourages people to stay out longer. The measured figure is 65.9; the label is telling the truth in the only way it is allowed to.',
      },
      {
        q: 'Is it six filters or seven?',
        a: 'Six. Some of our own older material says seven, which we are correcting. The extra one being counted is butyloctyl salicylate at 5% — a solvent that keeps the real filters dissolved and stable. It does raise the SPF, but it does not absorb UV, and neither the manufacturer\u2019s technical deck nor the registration counts it as a filter.',
      },
      {
        q: 'Can I swim in it?',
        a: 'You can, but reapply as soon as you are out and dry. There is no water-resistance test in this product\u2019s file, so we do not claim water resistance and you should not assume it. This is the most common way people get burnt while wearing sunscreen.',
      },
      {
        q: 'Does it leave a white cast?',
        a: 'Very little. Only titanium dioxide at 1.53% is mineral and the other 15.6% of the filter load is organic and colourless, so it sits far closer to a Korean chemical sunscreen than a mineral one. It is also the reason the texture is silky rather than thick.',
      },
      {
        q: 'What about the ceramides and hyaluronic acid it is marketed with?',
        a: 'They are in the formula, at doses too small to do anything: the Ceramide NP is at one part in ten billion, and the hyaluronic acid and probiotic ferment at roughly one part per million each. Buy this for the filter system, the niacinamide at 2% and the adenosine at 0.04%. Those are real, and they are plenty.',
      },
      {
        q: 'Is it all right for sensitive skin?',
        a: 'The formula is dermatologically tested by patch test and the filter set is a modern one with no oxybenzone or octinoxate. The one thing to weigh is the fragrance at 0.5%: if you are specifically choosing for reactive skin, a fragrance-free sunscreen may suit you better, and we would rather say so than sell you the wrong tube.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: UltraShieldCopy = {
  eyebrow: 'واقي الشمس ألترا شيلد · SPF50+ / PA++++',
  headline: 'اختُبر عند SPF 65.9. ويُباع كـ 50+ لأن ذلك هو السقف.',
  subheadline:
    'ستة مرشحات للأشعة فوق البنفسجية بمجموع 17.1%، مقيسة في المختبر لا مقدَّرة: SPF 65.9 وعامل حماية من UVA بين 23 و24، مقابل 22.0 الذي يطلبه القانون الأوروبي من واقٍ بهذه القوة. ومعها نياسيناميد بنسبة 2% وأدينوزين بنسبة 0.04%، ولهذا ترخّصه كوريا كمستحضر ثلاثي الوظيفة لا كواقٍ من الشمس فحسب.',
  heroBullets: [
    'SPF مقيس عند 65.9 داخل الجسم الحي · UVA-PF 23.1 و24.3',
    'ستة مرشحات، 17.1% من التركيبة، كيميائية ومعدنية',
    'نياسيناميد 2% وأدينوزين 0.04%، كلاهما بالجرعة المرخّصة',
    'بلا أوكسيبنزون وبلا أوكتينوكسات',
  ],
  badges: ['صُنع في كوريا', '50 غ', 'تقييم سلامة أوروبي', 'مختبر جلدياً'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '65.9', label: 'SPF المقيس داخل الجسم الحي' },
    { value: '24.3', label: 'عامل UVA حيث المطلوب 22.0' },
    { value: '17.1%', label: 'من الأنبوب مرشحات' },
    { value: '2%', label: 'نياسيناميد بالجرعة المرخّصة' },
  ],

  measured: {
    eyebrow: 'الأرقام',
    title: 'أحدهم قاس هذا فعلاً',
    intro:
      'معظم صفحات واقي الشمس تخبرك بالرقم المطبوع على العلبة. هذا الرقم يأتي من ملف سلامة أوروبي مقيَّم وفق اللائحة EC 1223/2009، وتقارير الاختبار مذكورة بالاسم داخله.',
    rows: [
      {
        label: 'عامل الحماية من الشمس',
        value: '65.9 ± 4.74',
        note: 'مقيس على البشرة لا محسوب. والملصق يقول 50+ لأن القانون الأوروبي لا يسمح لواقٍ بادعاء رقم أعلى مهما كان أداؤه.',
      },
      {
        label: 'عامل الحماية من UVA',
        value: '23.13 و24.3',
        note: 'تقريران منفصلان. وUVA هو الطول الموجي الذي يشيخ البشرة لا الذي يحرقها، وهو الأضعف في معظم الواقيات.',
      },
      {
        label: 'الاشتراط الأوروبي',
        value: 'UVA-PF ≥ SPF ÷ 3',
        note: 'ثلث 65.9 هو 22.0. وكلا النتيجتين يتجاوزه، وهذا ما يمنح درجة PA++++ بدل أن يقرّرها قسم تسويق.',
      },
    ],
    footnote:
      'الاختبار من Dr Koziej Sp. z o.o. Sp.k.، وارد داخل تقييم السلامة الأوروبي للمنتج. وهو مختبر جلدياً كذلك باختبار اللصقة، وقد أجاز المقيِّم ذكر ذلك على الملصق.',
  },

  filters: {
    eyebrow: 'منظومة المرشحات',
    title: 'ستة مرشحات، وما يغطّيه كل منها',
    intro:
      'خمسة مرشحات عضوية وواحد معدني. وبينها تغطّي UVB وشطري UVA معاً، وهكذا يبلغ منتج واحد هذه الدرجة.',
    columns: { name: 'المرشّح', amount: 'التركيز', role: 'ما يغطّيه' },
    rows: [
      { name: 'Homosalate', amount: '4.00%', role: 'UVB، ويُبقي البقية ذائبة' },
      { name: 'Ethylhexyl Salicylate', amount: '3.50%', role: 'UVB، ومثبّت ضوئي للبقية' },
      { name: 'Terephthalylidene Dicamphor Sulfonic Acid', amount: '3.07%', role: 'UVA القصير — وسبب هذه النتيجة' },
      { name: 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine', amount: '3.00%', role: 'طيف واسع، من UVB إلى UVA الطويل' },
      { name: 'Ethylhexyl Triazone', amount: '2.00%', role: 'UVB، أكفأ مرشّح لكل غرام على الإطلاق' },
      { name: 'Titanium Dioxide', amount: '1.53%', role: 'معدني، يعكس UVB وUVA القصير' },
    ],
    total: 'مجموع حمل المرشحات: 17.10% من الأنبوب.',
    seventh:
      'قد تجدين وصفه بمنظومة من سبعة مرشحات. هي ستة. والسابع هو البيوتيل أوكتيل ساليسيلات، وبنسبة 5% هو أكبر مكوّن مفرد في المجموعة لكنه ليس مرشّحاً معتمداً — بل مذيب يُبقي المرشحات الحقيقية ذائبة وثابتة. صحيح أنه يرفع الـ SPF، لكنه لا يفعل ذلك بامتصاص الأشعة. والعرض التقني للشركة نفسها يذكر ستة.',
  },

  actives: {
    eyebrow: 'ما بعد المرشحات',
    title: 'فعّالان بجرعتين تُحتسبان',
    intro:
      'ترخّص كوريا هذا المستحضر كثلاثي الوظيفة — حماية وتفتيح وتحسين التجاعيد — ولكل وظيفة مكوّن خلفها بالتركيز الذي يشترطه الترخيص.',
    items: [
      {
        name: 'Niacinamide',
        dose: '2.00%',
        body: 'فيتامين B3 بالمستوى الذي تُمنح عليه وظيفة التفتيح. يعمل على تفاوت اللون ويدعم الحاجز، وهو أمر منطقي أن يكون في المنتج الذي ترتدينه في الأيام التي تأخذ فيها بشرتك أكبر قدر من الضوء.',
      },
      {
        name: 'Adenosine',
        dose: '0.04%',
        body: 'الجرعة التي ترخّصها كوريا تحديداً لتحسين التجاعيد — الرقم نفسه الذي يظهر في كل مستحضر وظيفي مضادّ للشيخوخة مسجّل هناك. رقم صغير بمعنى محدّد.',
      },
      {
        name: 'المرشحات الستة',
        dose: '17.10%',
        body: 'وظيفة الحماية نفسها. نحو خُمس ما في الأنبوب يؤدي المهمة الوحيدة التي اشتريتِه من أجلها.',
      },
    ],
  },

  honesty: {
    eyebrow: 'عن مركّب التعافي',
    title: 'قصة التهدئة أرقّ من قصة الحماية',
    body:
      'يُباع هذا المنتج أيضاً على أساس التعافي بعد الشمس: مركّب للعناية بحروق الشمس، وMicroHA™، وProbioMETA™، ومركّب مضادات أكسدة استوائي. وهذه هي الجرعات. سيراميد NP عند 0.00000001% — جزء واحد من عشرة مليارات، أي نحو خمسة نانوغرامات في أنبوب 50 غ. وحمض الهيالورونيك ومخمّر اللاكتوباسيلوس نحو جزء واحد من المليون لكل منهما. ومستخلصات الفاكهة الأربعة 25 جزءاً من المليار لكل منها.',
    aside:
      'لن نبني صفحة على ذلك. سبب شراء هذا الأنبوب هو منظومة مرشحات مقيسة عند SPF 65.9 مع تغطية UVA تضاهيها، ونياسيناميد وأدينوزين بجرعات حقيقية. وهذا أكثر من كافٍ من دون النانوغرامات.',
  },

  homosalate: {
    eyebrow: 'يستحق المعرفة',
    title: 'عن الهوموساليت',
    body:
      'إن بحثتِ عن المرشحات فستجدين علامة استفهام حول الهوموساليت. ففي 2021 قالت اللجنة العلمية للمفوضية الأوروبية إنه غير آمن عند نسبة 10% المسموحة حينها واقترحت 0.5%؛ وبعد بيانات إضافية استقرّت على 7.34%، وهذا الحدّ مكتوب اليوم في قانون مستحضرات التجميل الأوروبي. وهذه التركيبة تستخدم 4.00%، أي ما يزيد قليلاً على نصف الحدّ المسموح، ويسجّل تقييم السلامة هامش أمان يتجاوز 100. ونفضّل أن تقرئي ذلك هنا على أن تجديه في مكان آخر.',
  },

  water: {
    eyebrow: 'قيد واحد، بصراحة',
    title: 'هذا ليس واقياً مقاوماً للماء',
    body:
      'لا يوجد اختبار مقاومة للماء في ملف هذا المنتج، فلن نلمّح إلى واحد. اسبحي به أو تعرّقي أو جفّفي بالمنشفة، وعليكِ إعادة الوضع — وهذا يصحّ على أي واقٍ بلا ادعاء مقاومة للماء، ومعظم إخفاقات الشاطئ تأتي من افتراض العكس. ليوم قرب الماء، خذي الأنبوب معك.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'كمية كافية، مبكراً بما يكفي، ثم مرة أخرى',
    frequency: 'كل صباح · أعيدي الوضع كل ساعتين في الخارج',
    steps: [
      {
        title: 'الخطوة الأخيرة، قبل المكياج',
        body: 'بعد المرطّب وقبل أي شيء فيه لون. واقي الشمس هو آخر طبقة عناية لا أول طبقة مكياج.',
      },
      {
        title: 'إصبعان للوجه والرقبة',
        body: 'خط من الكريم على السبابة والوسطى هو تقريباً الكمية التي اختُبر عليها الـ SPF. ومعظم الناس يضعون نحو ثلثها، فيحصلون على نحو ثلث الحماية.',
      },
      {
        title: 'من خمس عشرة إلى ثلاثين دقيقة قبل الخروج',
        body: 'الطبقة تحتاج وقتاً لتستقرّ. والوضع عند الباب يعني الخروج بطبقة واقٍ لم تتشكّل بالكامل.',
      },
      {
        title: 'ثم كل ساعتين في ضوء النهار',
        body: 'وفوراً بعد السباحة أو التعرّق أو التجفيف. هذا المنتج بلا ادعاء مقاومة للماء، فعاملي الماء كإعادة ضبط.',
      },
    ],
    note:
      'يحتوي على عطر بنسبة 0.5%. وإن كنتِ تختارين واقياً للبشرة التفاعلية تحديداً، فهذا هو السطر الذي يستحق الموازنة في قائمة المكوّنات.',
  },

  uae: {
    eyebrow: 'في هذا المناخ',
    title: 'لماذا هذا تحديداً، في الخليج',
    intro: 'مؤشر الأشعة فوق البنفسجية في الإمارات عند المستوى المتطرّف جزءاً كبيراً من السنة، بما في ذلك أيام لا تبدو حارّة.',
    items: [
      'درجة تصمد حين يكون المؤشر 11 أو أعلى',
      'تغطية UVA تتجاوز العتبة الأوروبية، وUVA يعبر زجاج النوافذ',
      'حريري لا ثقيل، فيمكن ارتداؤه عند 45 درجة',
      'لا أثر أبيض يُذكر: 1.53% فقط من حمل المرشحات معدني',
      'نياسيناميد 2%، وهو المكوّن الصحيح لارتدائه في أيام الأشعة العالية',
      'خمسون غراماً — حجم يسمح لكِ باستخدامه بالسماكة الصحيحة',
    ],
  },

  video: {
    title: 'الملمس',
    body: 'كيف ينتشر، وكيف ينتهي، وكيف يبدو على البشرة.',
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
    eyebrow: 'الجودة',
    title: 'ما تقوله ورقة الدفعة',
    intro: 'صُنع في كوريا وفق GMP وأُفرج عنه مقابل مواصفة. والنتائج الميكروبية هنا نظيفة إلى أقصى حدّ.',
    rows: [
      { label: 'الحموضة', value: '7.23 ضمن مواصفة 7.20 ± 1.00 — أعلى من معظم مستحضرات العناية، لأن التروميثامين يعادل مرشّحاً حمضياً' },
      { label: 'التعبئة', value: '50.9 غ مقابل 50 غ معلنة' },
      { label: 'النقاء', value: 'العدّ الهوائي الكلي غير مكتشف، مقابل 100 وحدة/غ مسموحة' },
      { label: 'الممرضات', value: 'الإشريكية القولونية والزائفة والمكوّرة العنقودية والمبيضّات — الأربعة غير مكتشفة' },
      { label: 'بعد الفتح', value: 'اثنا عشر شهراً، مذكورة على العلبة' },
      { label: 'التقييم', value: 'تقييم سلامة أوروبي كامل وفق اللائحة EC 1223/2009' },
    ],
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'للاستعمال الخارجي فقط. تجنّبي العينين والأغشية المخاطية، واشطفي جيداً بالماء البارد عند الملامسة.',
      'لا تضعيه مباشرة حول العينين.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'لا تبقي في الشمس طويلاً حتى مع الواقي. فالتعرّض المفرط خطر صحي جدّي ولا يزيله أي SPF.',
      'يحتوي على عطر بنسبة 0.5%.',
      'يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '50 غ' },
      { label: 'الدرجة', value: 'SPF50+ / PA++++ (SPF مقيس 65.9، وUVA-PF 23.1–24.3)' },
      { label: 'المرشحات', value: 'ستة — خمسة عضوية وواحد معدني، 17.10% مجتمعة' },
      { label: 'الفعّالات', value: 'نياسيناميد 2.00%، أدينوزين 0.04%' },
      { label: 'خالٍ من', value: 'الأوكسيبنزون والأوكتينوكسات' },
      { label: 'مقاومة الماء', value: 'غير مُدّعاة — أعيدي الوضع بعد الماء أو العرق' },
      { label: 'الترخيص', value: 'ثلاثي الوظيفة الكوري: حماية من الأشعة، تفتيح، تحسين التجاعيد' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'إن كان يختبر عند 65.9، فلماذا تقول العلبة 50+؟',
        a: 'لأن 50+ هو أعلى رقم يُسمح لملصق واقي شمس بذكره في أوروبا، مهما كان الأداء. والمنظّم يضع السقف عمداً، على أساس أن الفارق بين SPF 50 وSPF 70 صغير عملياً ويشجّع الناس على البقاء في الشمس أطول. الرقم المقيس 65.9، والملصق يقول الحقيقة بالطريقة الوحيدة المسموح له بها.',
      },
      {
        q: 'هل هي ستة مرشحات أم سبعة؟',
        a: 'ستة. بعض موادنا الأقدم تقول سبعة، ونحن نصحّح ذلك. والمرشّح الإضافي المحتسب هو البيوتيل أوكتيل ساليسيلات بنسبة 5% — مذيب يُبقي المرشحات الحقيقية ذائبة وثابتة. صحيح أنه يرفع الـ SPF، لكنه لا يمتصّ الأشعة، ولا العرض التقني للشركة ولا التسجيل يحتسبه مرشّحاً.',
      },
      {
        q: 'هل أستطيع السباحة به؟',
        a: 'تستطيعين، لكن أعيدي الوضع فور خروجك وجفافك. لا يوجد اختبار مقاومة للماء في ملف هذا المنتج، فلا ندّعي مقاومة للماء وعليكِ ألا تفترضيها. وهذه أكثر طريقة شائعة يحترق بها الناس وهم يضعون واقياً.',
      },
      {
        q: 'هل يترك أثراً أبيض؟',
        a: 'قليلاً جداً. فثاني أكسيد التيتانيوم بنسبة 1.53% وحده معدني، و15.6% الباقية من حمل المرشحات عضوية وعديمة اللون، فهو أقرب بكثير إلى واقٍ كيميائي كوري منه إلى واقٍ معدني. وهذا أيضاً سبب كون الملمس حريرياً لا ثقيلاً.',
      },
      {
        q: 'وماذا عن السيراميد وحمض الهيالورونيك المسوَّق بهما؟',
        a: 'هما في التركيبة، بجرعات أصغر من أن تفعل شيئاً: سيراميد NP عند جزء واحد من عشرة مليارات، وحمض الهيالورونيك والمخمّر الحيوي عند نحو جزء واحد من المليون لكل منهما. اشتريه من أجل منظومة المرشحات والنياسيناميد بنسبة 2% والأدينوزين بنسبة 0.04%. هذه حقيقية، وهي كافية.',
      },
      {
        q: 'هل يناسب البشرة الحسّاسة؟',
        a: 'التركيبة مختبرة جلدياً باختبار اللصقة، ومجموعة المرشحات حديثة بلا أوكسيبنزون أو أوكتينوكسات. والشيء الوحيد الذي يستحق الموازنة هو العطر بنسبة 0.5%: إن كنتِ تختارين تحديداً لبشرة تفاعلية، فقد يناسبك واقٍ خالٍ من العطر أكثر، ونفضّل قول ذلك على بيعك الأنبوب الخطأ.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: UltraShieldCopy = {
  eyebrow: 'Ultra Shield Sun Cream · SPF50+ / PA++++',
  headline: 'Измерено на SPF 65,9. Продаётся как 50+, потому что это потолок.',
  subheadline:
    'Шесть УФ-фильтров общей массой 17,1%, измеренные в лаборатории, а не рассчитанные: SPF 65,9 и фактор защиты от UVA 23–24 против 22,0, которых европейский закон требует от санскрина такой силы. Вместе с ними ниацинамид 2% и аденозин 0,04% — поэтому Корея лицензирует его как средство тройного действия, а не просто как санскрин.',
  heroBullets: [
    'SPF измерен in vivo на 65,9 · UVA-PF 23,1 и 24,3',
    'Шесть фильтров, 17,1% формулы, химические и минеральный',
    'Ниацинамид 2% и аденозин 0,04% — обе дозы лицензионные',
    'Без оксибензона и октиноксата',
  ],
  badges: ['Сделано в Корее', '50 г', 'Оценка безопасности ЕС', 'Дерматологически тестировано'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '65,9', label: 'Измеренный SPF, in vivo' },
    { value: '24,3', label: 'Фактор UVA при требуемых 22,0' },
    { value: '17,1%', label: 'Тюбика — это УФ-фильтры' },
    { value: '2%', label: 'Ниацинамида, лицензионная доза' },
  ],

  measured: {
    eyebrow: 'Цифры',
    title: 'Это действительно кто-то измерил',
    intro:
      'Большинство страниц про санскрин пересказывают число с коробки. Это взято из европейского досье безопасности по регламенту EC 1223/2009, где протоколы испытаний названы поимённо.',
    rows: [
      {
        label: 'Фактор защиты от солнца',
        value: '65,9 ± 4,74',
        note: 'Измерен на коже, а не рассчитан. На этикетке 50+, потому что европейский закон не позволяет санскрину заявлять число выше, как бы хорошо он ни работал.',
      },
      {
        label: 'Фактор защиты от UVA',
        value: '23,13 и 24,3',
        note: 'Два отдельных протокола. UVA — это длина волны, которая старит кожу, а не обжигает, и именно на ней большинство санскринов слабее всего.',
      },
      {
        label: 'Европейское требование',
        value: 'UVA-PF ≥ SPF ÷ 3',
        note: 'Треть от 65,9 — это 22,0. Оба результата его превышают, и именно это даёт степень PA++++, а не решение отдела маркетинга.',
      },
    ],
    footnote:
      'Испытания Dr Koziej Sp. z o.o. Sp.k., приведены внутри европейской оценки безопасности продукта. Он также дерматологически протестирован патч-тестом, который оценщик допустил к этикетке.',
  },

  filters: {
    eyebrow: 'Система фильтров',
    title: 'Шесть фильтров и что закрывает каждый',
    intro:
      'Пять органических фильтров и один минеральный. Вместе они покрывают UVB и обе половины UVA — так одно средство и достигает этой степени.',
    columns: { name: 'Фильтр', amount: 'Концентрация', role: 'Что закрывает' },
    rows: [
      { name: 'Homosalate', amount: '4,00%', role: 'UVB, и держит остальные в растворе' },
      { name: 'Ethylhexyl Salicylate', amount: '3,50%', role: 'UVB и фотостабилизатор для остальных' },
      { name: 'Terephthalylidene Dicamphor Sulfonic Acid', amount: '3,07%', role: 'Короткий UVA — причина такого результата' },
      { name: 'Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine', amount: '3,00%', role: 'Широкий спектр, от UVB до длинного UVA' },
      { name: 'Ethylhexyl Triazone', amount: '2,00%', role: 'UVB, самый эффективный фильтр на грамм' },
      { name: 'Titanium Dioxide', amount: '1,53%', role: 'Минеральный, отражает UVB и короткий UVA' },
    ],
    total: 'Суммарная загрузка фильтрами: 17,10% тюбика.',
    seventh:
      'Иногда это описывают как систему из семи фильтров. Их шесть. Седьмым считают бутилоктил салицилат: при 5% это крупнейший отдельный ингредиент группы, но он не одобренный фильтр — это растворитель, который держит настоящие фильтры растворёнными и стабильными. SPF он повышает, просто не поглощением УФ. В техническом досье самого производителя указано шесть.',
  },

  actives: {
    eyebrow: 'Помимо фильтров',
    title: 'Два актива в дозах, которые считаются',
    intro:
      'Корея лицензирует это как средство тройного действия — защита, осветление и уменьшение морщин — и за каждой функцией стоит ингредиент в той концентрации, которой требует лицензия.',
    items: [
      {
        name: 'Niacinamide',
        dose: '2,00%',
        body: 'Витамин B3 на уровне, под который выдаётся функция осветления. Работает с неровным тоном и поддерживает барьер — разумно иметь его именно в том средстве, которое вы носите в дни наибольшей световой нагрузки.',
      },
      {
        name: 'Adenosine',
        dose: '0,04%',
        body: 'Ровно та доза, которую Корея лицензирует для уменьшения морщин, — то же число стоит в каждом функциональном антивозрастном средстве, зарегистрированном там. Маленькая цифра с конкретным смыслом.',
      },
      {
        name: 'Шесть фильтров',
        dose: '17,10%',
        body: 'Собственно функция защиты. Почти пятая часть содержимого тюбика делает ровно ту работу, ради которой вы его купили.',
      },
    ],
  },

  honesty: {
    eyebrow: 'О комплексе восстановления',
    title: 'История про успокоение тоньше, чем история про защиту',
    body:
      'Это средство продают ещё и как восстановление после солнца: Sunburn Care Complex, MicroHA™, ProbioMETA™, тропический антиоксидантный комплекс. Вот дозы. Ceramide NP — 0,00000001%, одна часть на десять миллиардов, около пяти нанограммов в тюбике на 50 г. Гиалуроновая кислота и лактобактериальный фермент — примерно по одной части на миллион. Четыре фруктовых экстракта — по 25 частей на миллиард.',
    aside:
      'Мы не станем строить на этом страницу. Причина купить этот тюбик — система фильтров, измеренная на SPF 65,9, с сопоставимым покрытием UVA, плюс ниацинамид и аденозин в реальных дозах. Этого более чем достаточно и без нанограммов.',
  },

  homosalate: {
    eyebrow: 'Стоит знать',
    title: 'О гомосалате',
    body:
      'Если поискать про фильтры, вы найдёте вопрос к гомосалату. В 2021 году научный комитет Еврокомиссии заявил, что при разрешённых тогда 10% он небезопасен, и предложил 0,5%; после дополнительных данных остановились на 7,34%, и этот предел теперь записан в европейском косметическом законе. В этой формуле — 4,00%, чуть больше половины допустимого максимума, а оценка безопасности фиксирует запас безопасности выше 100. Пусть лучше вы прочтёте это здесь, чем найдёте где-то ещё.',
  },

  water: {
    eyebrow: 'Одно ограничение, прямо',
    title: 'Это не водостойкий санскрин',
    body:
      'В досье этого продукта нет теста на водостойкость, и мы не станем её подразумевать. Поплавали, вспотели, вытерлись полотенцем — нужно нанести заново. Это верно для любого санскрина без заявленной водостойкости, и большинство пляжных провалов происходит из-за обратного допущения. На день у воды берите тюбик с собой.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Достаточно, заранее и ещё раз потом',
    frequency: 'Каждое утро · заново каждые два часа на улице',
    steps: [
      {
        title: 'Последний шаг, до макияжа',
        body: 'После крема и до всего, в чём есть цвет. Санскрин — это финальный слой ухода, а не первый слой макияжа.',
      },
      {
        title: 'Два пальца на лицо и шею',
        body: 'Полоска крема по указательному и среднему пальцу — примерно то количество, на котором тестировали SPF. Почти все наносят около трети и получают около трети защиты.',
      },
      {
        title: 'За пятнадцать-тридцать минут до выхода',
        body: 'Плёнке нужно время схватиться. Нанести у двери — значит выйти под покрытием, которое ещё не сформировалось.',
      },
      {
        title: 'И каждые два часа при свете дня',
        body: 'А также сразу после плавания, пота или полотенца. Здесь нет заявленной водостойкости, поэтому воду считайте сбросом.',
      },
    ],
    note:
      'В составе есть отдушка, 0,5%. Если вы выбираете санскрин именно для реактивной кожи, это та строка состава, которую стоит взвесить.',
  },

  uae: {
    eyebrow: 'В этом климате',
    title: 'Почему именно этот, в Заливе',
    intro: 'УФ-индекс в ОАЭ держится на экстремальном уровне значительную часть года, в том числе в дни, которые не кажутся жаркими.',
    items: [
      'Степень, которая держится при индексе 11 и выше',
      'Покрытие UVA выше европейского порога, а UVA проходит через оконное стекло',
      'Шелковистый, а не тяжёлый, — носится и при 45 °C',
      'Белёсости практически нет: минеральных всего 1,53% из всей загрузки',
      'Ниацинамид 2% — правильный ингредиент для дней с высоким УФ',
      'Пятьдесят граммов — объём, который позволяет наносить нужным слоем',
    ],
  },

  video: {
    title: 'Текстура',
    body: 'Как распределяется, как финиширует и как выглядит на коже.',
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
    eyebrow: 'Качество',
    title: 'Что говорит паспорт партии',
    intro: 'Сделано в Корее по GMP и выпущено против спецификации. Микробиология здесь настолько чистая, насколько бывает.',
    rows: [
      { label: 'pH', value: '7,23 при спецификации 7,20 ± 1,00 — выше, чем у большинства ухода, потому что трометамин нейтрализует кислотный фильтр' },
      { label: 'Наполнение', value: '50,9 г при заявленных 50 г' },
      { label: 'Чистота', value: 'Общее аэробное число не обнаружено при допустимых 100 КОЕ/г' },
      { label: 'Патогены', value: 'E. coli, P. aeruginosa, S. aureus и C. albicans — все четыре не обнаружены' },
      { label: 'После вскрытия', value: 'Двенадцать месяцев, указано на коробке' },
      { label: 'Оценка', value: 'Полная оценка безопасности ЕС по регламенту EC 1223/2009' },
    ],
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Только для наружного применения. Избегайте глаз и слизистых, при попадании тщательно промойте прохладной водой.',
      'Не наносите непосредственно вокруг глаз.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Не находитесь на солнце слишком долго даже с санскрином. Избыточное облучение — серьёзный риск, и никакой SPF его не убирает.',
      'Содержит отдушку, 0,5%.',
      'Храните в прохладном сухом месте, недоступном для детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '50 г' },
      { label: 'Степень', value: 'SPF50+ / PA++++ (измеренный SPF 65,9, UVA-PF 23,1–24,3)' },
      { label: 'Фильтры', value: 'Шесть — пять органических, один минеральный, 17,10% суммарно' },
      { label: 'Активы', value: 'Ниацинамид 2,00%, аденозин 0,04%' },
      { label: 'Без', value: 'Оксибензона и октиноксата' },
      { label: 'Водостойкость', value: 'Не заявлена — наносите заново после воды или пота' },
      { label: 'Лицензия', value: 'Корейское тройное действие: защита от УФ, осветление, уменьшение морщин' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Если измерено 65,9, почему на коробке 50+?',
        a: 'Потому что 50+ — максимальное число, которое санскрину разрешено указывать в Европе, независимо от результата. Регулятор ставит потолок намеренно: разница между SPF 50 и SPF 70 на практике невелика, а более крупная цифра побуждает дольше оставаться на солнце. Измерено 65,9; этикетка говорит правду единственным разрешённым ей способом.',
      },
      {
        q: 'Шесть фильтров или семь?',
        a: 'Шесть. Часть наших старых материалов говорит «семь», и мы это исправляем. Лишним считают бутилоктил салицилат при 5% — растворитель, который держит настоящие фильтры растворёнными и стабильными. SPF он повышает, но УФ не поглощает, и ни техническое досье производителя, ни регистрация не считают его фильтром.',
      },
      {
        q: 'Можно в нём плавать?',
        a: 'Можно, но нанесите заново, как только вышли и обсохли. В досье продукта нет теста на водостойкость, поэтому мы её не заявляем, и вам не стоит её предполагать. Это самый частый способ обгореть, будучи в санскрине.',
      },
      {
        q: 'Оставляет ли белёсость?',
        a: 'Почти нет. Минеральный только диоксид титана при 1,53%, остальные 15,6% загрузки — органические и бесцветные, так что он гораздо ближе к корейскому химическому санскрину, чем к минеральному. По той же причине текстура шелковистая, а не плотная.',
      },
      {
        q: 'А церамиды и гиалуроновая кислота, которыми его рекламируют?',
        a: 'Они в формуле, в дозах, слишком малых, чтобы что-то делать: Ceramide NP — одна часть на десять миллиардов, гиалуроновая кислота и пробиотический фермент — примерно по одной части на миллион. Покупайте ради системы фильтров, ниацинамида 2% и аденозина 0,04%. Это реально, и этого достаточно.',
      },
      {
        q: 'Подойдёт ли для чувствительной кожи?',
        a: 'Формула дерматологически протестирована патч-тестом, набор фильтров современный, без оксибензона и октиноксата. Взвесить стоит одно: отдушка 0,5%. Если вы выбираете именно под реактивную кожу, санскрин без отдушки может подойти лучше, и мы скорее скажем это, чем продадим вам не тот тюбик.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const ULTRA_SHIELD_COPY: Record<Locale, UltraShieldCopy> = { en: EN, ar: AR, ru: RU }

export function getUltraShieldCopy(locale: string | undefined): UltraShieldCopy {
  return ULTRA_SHIELD_COPY[(locale as Locale) ?? 'en'] ?? ULTRA_SHIELD_COPY.en
}

/** Multi Sun Cream is the lighter sibling; the rest is the post-sun shelf. */
export const COMPANION_PRODUCT_IDS = ['40', '36', '16', '13'] as const
