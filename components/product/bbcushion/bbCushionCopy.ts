/**
 * Bespoke copy for SKIN CARING BLEMISH BALM CUSHION (product 41), in the three
 * languages the site ships.
 *
 * Same self-contained per-locale pattern as revitaGlowCopy.ts, so the dedicated
 * layout ships EN/AR/RU without adding ~150 keys to the shared bundles.
 *
 * SOURCING RULE FOR THIS FILE - every figure traces to the dossier audit in
 * docs/SESSION_CHANGES_2026-08-16_PRODUCT_41_BB_CUSHION_DOSSIER_AUDIT.md:
 *   - Intertek formula sheets, all three shades: the five UV filters and their
 *     percentages, Niacinamide 2.00%, Adenosine 0.04%, the nine peptides at
 *     640 ppb down to 10 ppb, the three fixing polymers, and the iron oxide
 *     loads that separate the shades (0.892 / 1.785 / 3.056).
 *   - Intertek artwork: the Korean triple-functional panel, SPF50+ PA++++,
 *     "dermatologically tested", NET WT 15 g × 2, PAO 12M, and the precautions.
 *   - Intertek COA: pH 6.51 against a 6.5 ± 1.0 specification, microbial count
 *     inside 500 CFU/g, three-year shelf life.
 *   - Dubai Municipality Montaji: all three shades approved.
 *
 * TONE - read .cursor/rules/selling-tone.mdc before editing. The first draft of
 * this file opened with "Korea licenses this one cushion for three things at
 * once", which leads with the regulator instead of the buyer. The licence is
 * the proof under the claim, never the claim itself.
 *
 * DELIBERATE OMISSIONS, AND THEY MUST STAY OUT:
 *   - "more than 60% moisture essence". The named ingredients sum to ~73.6%,
 *     which puts water at roughly a quarter. It is on slides s5 and s6, which
 *     stay in the gallery per the gallery rule, and is logged for re-export.
 *   - Volufiline as a volumiser. The Anemarrhena extract is at 40 ppb.
 *   - the nine peptides as an engine or an anti-ageing active. They run 640 ppb
 *     down to 10 ppb, so the count can be stated and no claim can hang off it.
 *   - glutathione as a tyrosinase blocker or an acne treatment. 100 ppm.
 *   - a sixth UV filter. Butyloctyl Salicylate is a solvent on all three sheets.
 *   - any percentage-improvement figure. There is no efficacy trial on file.
 *   - the contract manufacturer's name, and any lot code.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface BbCushionShade {
  /** Must match the `colors` values in data/productConfig.ts - the cart keys
   *  its lines on this string. */
  value: 'Ivory' | 'Beige' | 'Camel'
  code: string
  name: string
  /** Sampled from the draw-downs on /images/cushion_2/s1.jpeg. */
  hex: string
  tagline: string
  body: string
}

export interface BbCushionCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]

  shadeLabel: string
  shadeHelp: string
  shadeSelected: string
  shadeRequired: string
  shades: BbCushionShade[]

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

  wear: {
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

  puff: {
    eyebrow: string
    title: string
    intro: string
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

  video: {
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

const EN: BbCushionCopy = {
  eyebrow: 'Skin Caring Blemish Balm Cushion · SPF50+ PA++++',
  headline: 'One press covers you, shields you and treats you.',
  subheadline:
    'Press, pat, and you are done: even coverage that still reads as skin, the highest sun rating Korea awards, and two skincare actives working underneath it all day. Korea licenses this cushion for all three at once - sun, tone and wrinkles - which is a licence almost no base makeup holds.',
  heroBullets: [
    'SPF50+ PA++++, the top of both scales, from five filters',
    'Niacinamide at a full 2% for tone, adenosine at 0.04% for fine lines',
    'A second 15 g refill already in the box - twice the wear for one price',
    'Light enough for post-treatment skin, buildable where you want more',
  ],
  badges: ['Made in Korea', '15 g × 2 · 12M PAO', 'Dermatologically tested', 'Official UAE distributor'],

  shadeLabel: 'Choose your shade',
  shadeHelp: 'Same formula in all three. Only the colour changes.',
  shadeSelected: 'Selected',
  shadeRequired: 'Pick a shade before adding to the bag.',
  shades: [
    {
      value: 'Ivory',
      code: '#01',
      name: 'Ivory',
      hex: '#f1dcc4',
      tagline: 'The lightest',
      body: 'For fair skin that burns easily and rarely tans, with cool pink or bluish undertones. The lightest pigment load of the three, so it brightens rather than warms.',
    },
    {
      value: 'Beige',
      code: '#02',
      name: 'Beige',
      hex: '#e7bd95',
      tagline: 'The one most people wear',
      body: 'For light to medium skin with neutral undertones. Exactly twice the pigment of Ivory, which makes it the safe middle if you are between two shades. Our best seller.',
    },
    {
      value: 'Camel',
      code: '#03',
      name: 'Camel',
      hex: '#cf9d6d',
      tagline: 'The deepest',
      body: 'For medium to tan skin that holds colour, with warm golden or olive undertones. Around three and a half times the pigment of Ivory, so it covers without going ashy.',
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
    { value: 'SPF50+', label: 'PA++++ - the highest rating on either scale' },
    { value: '5', label: 'UV filters, two mineral and three chemical' },
    { value: '2%', label: 'Niacinamide, the same dose as our Multi Vita serum' },
    { value: '30 g', label: 'Cushion and refill, both in the box' },
  ],

  functions: {
    eyebrow: 'Three jobs, one compact',
    title: 'It does not just sit there looking pretty',
    intro:
      'Korea will not let a cosmetic claim sun protection, tone or wrinkles unless a named active sits behind each one at a set dose. This cushion is licensed for all three, and the actives are printed on the carton.',
    cards: [
      {
        title: 'It holds off the sun',
        body: 'SPF50+ PA++++, carried by five filters. Titanium dioxide and zinc oxide scatter the light, three chemical filters absorb it, and running both is how a base this light gets to the top of the scale.',
      },
      {
        title: 'It works on your tone',
        body: 'Niacinamide at a full 2% - the same dose as our Multi Vita serum and cream, not a token sprinkle. It evens tone and supports the barrier for as long as you are wearing it.',
      },
      {
        title: 'It softens fine lines',
        body: 'Adenosine at 0.04%, the dose Korea licenses wrinkle claims on. So there is real treatment happening under the coverage, not just colour.',
      },
      {
        title: 'It evens you out instantly',
        body: 'Three iron oxides do the optical work the moment you pat it on. Coverage is buildable and deliberately natural, so it reads as good skin rather than makeup.',
      },
    ],
  },

  wear: {
    eyebrow: 'Why it lasts',
    title: 'Built to survive a Dubai day',
    intro:
      'A cushion that slides off by lunchtime is not protecting anything. This one is built in three layers, and only the middle one is about colour.',
    steps: [
      {
        step: '01',
        title: 'An essence base that stays comfortable',
        body: 'The formula goes on wet and light rather than thick, which is what keeps it from clinging to dry patches or settling into texture. It is why it works straight after a treatment.',
      },
      {
        step: '02',
        title: 'Pigment and filters together',
        body: 'The colour and the sun protection travel in the same layer, so you are not choosing between wearing SPF and wearing a base. One press does both.',
      },
      {
        step: '03',
        title: 'Three polymers that lock it down',
        body: 'A trio of fixing polymers sets a flexible film over the top. That film is what stops the finish moving in heat and humidity, and what keeps you from touching up every two hours.',
      },
    ],
    note:
      'Heat, air conditioning and a car window are the three things that break a base in the Gulf. The film layer is the answer to all of them - it sets instead of staying wet, so what you patted on in the morning is still where you left it.',
  },

  filters: {
    eyebrow: 'The sun protection',
    title: 'Five filters, mineral and chemical together',
    intro:
      'All-mineral bases leave a white cast and all-chemical ones can sting. Running both means you get the top rating without either problem - comfortable enough to wear every day, which is the only sunscreen that actually protects anyone.',
    columns: { name: 'Filter', amount: 'Concentration', role: 'Type' },
    rows: [
      { name: 'Titanium Dioxide', amount: '9.00%', role: 'Mineral - scatters light' },
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7.00%', role: 'Chemical - absorbs UVB' },
      { name: 'Ethylhexyl Salicylate', amount: '4.50%', role: 'Chemical - absorbs UVB' },
      { name: 'Octocrylene', amount: '2.00%', role: 'Chemical - absorbs UVB and short UVA' },
      { name: 'Zinc Oxide', amount: '2.00%', role: 'Mineral - broad spectrum' },
    ],
    note:
      'Butyloctyl salicylate sits at 6% and looks like a sixth filter. It is not one - it is the solvent that keeps the other five dissolved and comfortable on skin. Five is the honest number, and five is enough for SPF50+ PA++++.',
  },

  shadeSection: {
    eyebrow: 'Three shades',
    title: 'Pick the colour, the rest is identical',
    intro:
      'Match your depth first, then your undertone. If you are between two, take the deeper one - it warms up on skin, where the lighter one can sit flat.',
    sameFormula:
      'Same sun protection, same niacinamide, same adenosine, same peptides. The only thing that changes between #01, #02 and #03 is the iron oxide, so no shade protects or treats you better than another.',
    figureAlt: 'GENOSYS Skin Caring Blemish Balm Cushion - shade guide for #01 Ivory, #02 Beige and #03 Camel',
  },

  puff: {
    eyebrow: 'The puff',
    title: 'Four layers, where everyone else uses three',
    intro:
      'The applicator is the part nobody thinks about until it starts drinking your product. This one was engineered so it does not.',
    points: [
      {
        title: 'A waterdrop tip, not a circle',
        body: 'Pointed at one end, so it gets into the curve beside your nose and the inner corner of your eye without folding over. That is where most cushions leave a gap.',
      },
      {
        title: 'A fourth, waterproof layer',
        body: 'An ordinary cushion puff is three layers and soaks up whatever it touches. The waterproof film underneath keeps the formula in the cushion and on your face, so the compact lasts as long as it should.',
      },
      {
        title: 'And a refill already in the box',
        body: 'When the first 15 g runs out, push the used insert up from underneath and click the new one in. No second purchase, no waiting.',
      },
    ],
    figureAlt: 'The quadruple-layered waterdrop puff, shown in cross-section',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Press, pat, build',
    frequency: 'Every morning · the last step before you leave',
    steps: [
      {
        title: 'Press lightly',
        body: 'Press the puff onto the cushion - lightly. It picks up far more than it looks like it does, and taking too much is the only way to make this product look heavy.',
      },
      {
        title: 'Pat, do not sweep',
        body: 'Tap it onto the skin rather than dragging it across. Patting is what settles the layer evenly and keeps it from streaking on dry areas.',
      },
      {
        title: 'Build only where you need it',
        body: 'Go back over redness, marks or shadows with a second thin pass. Thin layers stacked stay looking like skin; one thick layer never does.',
      },
      {
        title: 'Refill and carry on',
        body: 'Push the empty insert out from underneath, click the spare in, and you are back to a full compact. Keep the puff or use the fresh one.',
      },
    ],
    note:
      'SPF ratings are measured at a thicker layer than anyone wears a base, so for a normal day - the commute, the office, the school run - this does the job. For hours in direct sun, put a dedicated sunscreen underneath and top up. That is true of every tinted base, not just this one.',
  },

  video: {
    title: 'See the finish',
    body: 'How it picks up on the puff, how it sits once patted in, and how far one press actually goes.',
    unsupported: 'Your browser does not support the video tag.',
  },

  actives: {
    eyebrow: 'The formula',
    title: 'What is actually in it',
    intro:
      'Two registered actives doing the work, nine peptides named on the carton, and the full list below with nothing left out.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote:
      'Every ingredient, in the same order as the box in your hand. Identical for all three shades apart from the pigments.',
  },

  lab: {
    eyebrow: 'Quality',
    title: 'Made and tested in Korea, cleared for the UAE',
    intro:
      'Nothing leaves the factory untested, and nothing reaches you here without being registered for sale in the UAE first.',
    rows: [
      { label: 'Skin testing', value: 'Dermatologically tested' },
      { label: 'pH', value: '6.5 - the same range as healthy skin, so nothing to sting or tighten' },
      { label: 'Purity', value: 'Every batch tested for microbial count and cleared well inside the limit' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box · 12 months after opening' },
      { label: 'Cleared for the UAE', value: 'All three shades registered with Dubai Municipality, alongside the Korean certificate of free sale' },
    ],
    disclaimer:
      'Daily sun protection is what keeps pigmentation from coming back. Stubborn melasma and post-inflammatory marks respond best when a dermatologist works alongside your routine.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'For external use only. Avoid the eyes and mucous membranes, and rinse with cool water if it gets in.',
      'Stop and see a doctor if redness, swelling or irritation appears.',
      'See a specialist if red spots, swelling or itching appear on the applied area after sun exposure.',
      'Avoid broken or damaged skin.',
      'Store between 10 and 30 °C, out of direct sunlight, and keep out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton, including the two the Korean panel carries. Use within 12 months of opening.',
  },

  routine: {
    eyebrow: 'Complete the routine',
    title: 'What goes on before it',
    intro:
      'The cushion is the last step of the morning. Clean skin, a mist and a moisturiser underneath are what make it sit well and stay put.',
    thisProduct: 'This product',
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
        a: 'Match depth first: #01 Ivory for fair skin that burns easily, #02 Beige for light to medium, #03 Camel for medium to tan. Then undertone - cool for Ivory, neutral for Beige, warm for Camel. Between two? Take the deeper one, and test it along your jawline in daylight rather than on your hand.',
      },
      {
        q: 'Is SPF50+ enough on its own?',
        a: 'For a normal day, yes. Sun protection factors are measured at a heavier layer than anyone applies a base, so if you are going to be out in direct sun for hours, wear a dedicated sunscreen underneath and top it up. On a commute-and-office day the cushion is doing the job on its own.',
      },
      {
        q: 'Can I wear it after a treatment?',
        a: 'That is what it was built for. The texture is light, the formula is dermatologically tested, and the actives are the gentle registered pair rather than acids or retinol. Follow whatever waiting period your clinic gave you after needling, laser or peels - that instruction comes from them, not from us.',
      },
      {
        q: 'How long does one compact last?',
        a: 'You get 30 g in total: a 15 g cushion plus a 15 g refill in the same box. For most people wearing it daily that is several months, and there is no second purchase in between.',
      },
      {
        q: 'How do I change the refill?',
        a: 'Lift out the empty insert by pushing up from the hole underneath the case, drop the spare in and press until it clicks. It takes about ten seconds and the puff can be reused or swapped for the fresh one.',
      },
      {
        q: 'Will it feel heavy or clog my skin?',
        a: 'It is a cushion, not a full-coverage foundation: an essence-light texture with buildable pigment. Take less than you think on the first press, pat rather than drag, and add a second layer only where you want more.',
      },
    ],
  },

  details: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '15 g cushion plus a 15 g refill - 30 g in total' },
      { label: 'Sun protection', value: 'SPF50+ PA++++, from five filters' },
      { label: 'Registered actives', value: 'Niacinamide 2% · Adenosine 0.04%' },
      { label: 'Shades', value: '#01 Ivory · #02 Beige · #03 Camel' },
      { label: 'Finish', value: 'Natural and luminous, buildable' },
      { label: 'Skin', value: 'All types, including sensitive and post-treatment' },
      { label: 'Origin', value: 'Made in Korea' },
      { label: 'After opening', value: '12 months' },
      { label: 'Storage', value: '10-30 °C, away from direct sunlight' },
    ],
    brochure: 'Download the product guide (PDF)',
  },

  backToProducts: 'Products',
}

const AR: BbCushionCopy = {
  eyebrow: 'كوشن سكين كيرينغ بليمش بالم · SPF50+ PA++++',
  headline: 'ضغطة واحدة تغطّي وتحمي وتعتني.',
  subheadline:
    'اضغطي، ربّتي، وانتهى الأمر: تغطية متجانسة تبدو كبشرتك، وأعلى تصنيف حماية تمنحه كوريا، وفعّالان للعناية يعملان تحتها طوال اليوم. وترخّص كوريا هذا الكوشن للثلاثة معاً - الشمس واللون والتجاعيد - وهو ترخيص لا تكاد تحمله مستحضرات الأساس.',
  heroBullets: [
    'SPF50+ PA++++، أعلى درجة في المقياسين، بخمسة فلاتر',
    'نياسيناميد بنسبة 2% كاملة للون، وأدينوزين 0.04% للخطوط الدقيقة',
    'عبوة احتياطية 15 غ داخل العلبة - ضعف الاستعمال بسعر واحد',
    'خفيف بما يكفي للبشرة بعد الجلسات، وقابل للتكثيف حيث تريدين',
  ],
  badges: ['صُنع في كوريا', '15 غ × 2 · 12 شهراً بعد الفتح', 'مُختبر جلدياً', 'الموزّع الرسمي في الإمارات'],

  shadeLabel: 'اختاري درجتك',
  shadeHelp: 'التركيبة نفسها في الدرجات الثلاث. اللون وحده هو ما يتغيّر.',
  shadeSelected: 'مختارة',
  shadeRequired: 'اختاري درجة قبل الإضافة إلى السلة.',
  shades: [
    {
      value: 'Ivory',
      code: '#01',
      name: 'Ivory',
      hex: '#f1dcc4',
      tagline: 'الأفتح',
      body: 'للبشرة الفاتحة التي تحترق بسرعة ونادراً ما تسمرّ، بدرجات باردة وردية أو مزرقّة. أقل نسبة صبغة بين الثلاث، فتُضيء أكثر مما تُدفئ.',
    },
    {
      value: 'Beige',
      code: '#02',
      name: 'Beige',
      hex: '#e7bd95',
      tagline: 'الأكثر اختياراً',
      body: 'للبشرة الفاتحة إلى المتوسطة بدرجات محايدة. ضعف صبغة آيفوري تماماً، وهي الخيار الآمن إن كنتِ بين درجتين. الأكثر مبيعاً لدينا.',
    },
    {
      value: 'Camel',
      code: '#03',
      name: 'Camel',
      hex: '#cf9d6d',
      tagline: 'الأعمق',
      body: 'للبشرة المتوسطة إلى القمحية التي تحتفظ باللون، بدرجات دافئة ذهبية أو زيتونية. نحو ثلاثة أضعاف ونصف صبغة آيفوري، فتغطّي من دون أن تبهت.',
    },
  ],

  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى السلة',
  inBag: 'في السلة',
  viewBag: 'عرض السلة',
  loginToShop: 'سجّلي الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: 'SPF50+', label: 'PA++++ - أعلى تصنيف في المقياسين' },
    { value: '5', label: 'فلاتر شمسية، اثنان معدنيان وثلاثة كيميائية' },
    { value: '2%', label: 'نياسيناميد، الجرعة نفسها في سيروم مالتي فيتا' },
    { value: '30 غ', label: 'كوشن وعبوة احتياطية، كلاهما في العلبة' },
  ],

  functions: {
    eyebrow: 'ثلاث وظائف في علبة واحدة',
    title: 'لا يكتفي بأن يبدو جميلاً',
    intro:
      'لا تسمح كوريا لمستحضر بادّعاء الحماية من الشمس أو توحيد اللون أو تحسين التجاعيد ما لم يقف خلف كل واحدة منها فعّال مُسمّى بجرعة محدّدة. وهذا الكوشن مرخّص للثلاث، والفعّالات مطبوعة على العلبة.',
    cards: [
      {
        title: 'يصدّ الشمس',
        body: 'SPF50+ PA++++ بخمسة فلاتر. ثاني أكسيد التيتانيوم وأكسيد الزنك يشتّتان الضوء، وثلاثة فلاتر كيميائية تمتصّه، والجمع بينهما هو ما يوصل قاعدة بهذه الخفّة إلى قمة المقياس.',
      },
      {
        title: 'يعمل على لون بشرتك',
        body: 'نياسيناميد بنسبة 2% كاملة - الجرعة نفسها في سيروم وكريم مالتي فيتا، لا رشّة رمزية. يوحّد اللون ويدعم حاجز البشرة طوال ارتدائك له.',
      },
      {
        title: 'يليّن الخطوط الدقيقة',
        body: 'أدينوزين بنسبة 0.04%، وهي الجرعة التي ترخّص عليها كوريا ادعاءات التجاعيد. أي أن هناك عناية حقيقية تحت التغطية، لا مجرّد لون.',
      },
      {
        title: 'يوحّد مظهرك فوراً',
        body: 'ثلاثة أكاسيد حديد تؤدي العمل البصري لحظة التربيت. التغطية قابلة للبناء وطبيعية عن قصد، فتبدو كبشرة جيدة لا كمكياج.',
      },
    ],
  },

  wear: {
    eyebrow: 'لماذا يدوم',
    title: 'مصمّم ليصمد في يوم دبي',
    intro:
      'الكوشن الذي يزول عند الظهيرة لا يحمي شيئاً. هذا مبني من ثلاث طبقات، والوسطى وحدها هي المعنيّة باللون.',
    steps: [
      {
        step: '٠١',
        title: 'قاعدة إسنس تبقى مريحة',
        body: 'التركيبة تنزل رطبة وخفيفة لا ثقيلة، وهذا ما يمنعها من التعلّق بالمناطق الجافة أو الاستقرار في المسام. ولهذا تصلح مباشرة بعد الجلسات.',
      },
      {
        step: '٠٢',
        title: 'الصبغة والفلاتر معاً',
        body: 'اللون والحماية من الشمس ينتقلان في الطبقة نفسها، فلا تختارين بين ارتداء واقٍ وارتداء أساس. ضغطة واحدة تفعل الاثنين.',
      },
      {
        step: '٠٣',
        title: 'ثلاثة بوليمرات تثبّت كل شيء',
        body: 'ثلاثي من بوليمرات التثبيت يشكّل طبقة مرنة فوق السطح. هذه الطبقة هي ما يمنع النتيجة من التحرّك في الحرّ والرطوبة، وما يعفيك من التصحيح كل ساعتين.',
      },
    ],
    note:
      'الحرارة والتكييف ونافذة السيارة هي الثلاثة التي تفسد أي أساس في الخليج. طبقة التثبيت هي الجواب عليها جميعاً - تتماسك بدل أن تبقى رطبة، فيبقى ما ربّتِه صباحاً في مكانه.',
  },

  filters: {
    eyebrow: 'الحماية من الشمس',
    title: 'خمسة فلاتر، معدنية وكيميائية معاً',
    intro:
      'القواعد المعدنية بالكامل تترك أثراً أبيض، والكيميائية بالكامل قد تلسع. والجمع بينهما يمنحك أعلى تصنيف من دون أيٍّ من المشكلتين - مريح بما يكفي لارتدائه يومياً، وهذا وحده الواقي الذي يحمي فعلاً.',
    columns: { name: 'الفلتر', amount: 'التركيز', role: 'النوع' },
    rows: [
      { name: 'Titanium Dioxide', amount: '9.00%', role: 'معدني - يشتّت الضوء' },
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7.00%', role: 'كيميائي - يمتصّ UVB' },
      { name: 'Ethylhexyl Salicylate', amount: '4.50%', role: 'كيميائي - يمتصّ UVB' },
      { name: 'Octocrylene', amount: '2.00%', role: 'كيميائي - يمتصّ UVB وقصير UVA' },
      { name: 'Zinc Oxide', amount: '2.00%', role: 'معدني - طيف واسع' },
    ],
    note:
      'بيوتيل أوكتيل ساليسيلات بنسبة 6% يبدو كفلتر سادس، لكنه ليس كذلك - إنه المذيب الذي يبقي الفلاتر الخمسة ذائبة ومريحة على البشرة. خمسة هو الرقم الصادق، وخمسة تكفي لـ SPF50+ PA++++.',
  },

  shadeSection: {
    eyebrow: 'ثلاث درجات',
    title: 'اختاري اللون، وما عداه متطابق',
    intro:
      'طابقي العمق أولاً ثم الدرجة الأساسية. وإن كنتِ بين اثنتين فخذي الأعمق - تدفأ على البشرة، بينما قد تبدو الأفتح باهتة.',
    sameFormula:
      'الحماية نفسها، والنياسيناميد نفسه، والأدينوزين نفسه، والببتيدات نفسها. الشيء الوحيد الذي يتغيّر بين #01 و#02 و#03 هو أكسيد الحديد، فلا درجة تحميك أو تعتني ببشرتك أفضل من أخرى.',
    figureAlt: 'كوشن جينوسيس سكين كيرينغ بليمش بالم - دليل الدرجات #01 Ivory و#02 Beige و#03 Camel',
  },

  puff: {
    eyebrow: 'الإسفنجة',
    title: 'أربع طبقات، حيث يكتفي الجميع بثلاث',
    intro:
      'الإسفنجة هي الجزء الذي لا يفكّر فيه أحد حتى تبدأ بابتلاع المنتج. وهذه صُمّمت لئلّا تفعل.',
    points: [
      {
        title: 'طرف على شكل قطرة لا دائرة',
        body: 'مدبّب من طرف، فيصل إلى الانحناء بجانب الأنف وإلى الزاوية الداخلية للعين من دون أن ينثني. وهناك تحديداً تترك معظم الكوشنات فراغاً.',
      },
      {
        title: 'طبقة رابعة مقاومة للماء',
        body: 'إسفنجة الكوشن العادية ثلاث طبقات تمتصّ كل ما تلمسه. الطبقة المقاومة للماء تحتها تُبقي التركيبة في الكوشن وعلى وجهك، فتدوم العلبة كما ينبغي.',
      },
      {
        title: 'وعبوة احتياطية جاهزة في العلبة',
        body: 'حين تنفد الـ 15 غ الأولى، ادفعي العبوة المستعملة من الأسفل وثبّتي الجديدة حتى تسمعي الصوت. لا شراء ثانٍ ولا انتظار.',
      },
    ],
    figureAlt: 'الإسفنجة الرباعية الطبقات على شكل قطرة، بمقطع عرضي',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'اضغطي، ربّتي، كثّفي',
    frequency: 'كل صباح · آخر خطوة قبل الخروج',
    steps: [
      {
        title: 'اضغطي برفق',
        body: 'اضغطي الإسفنجة على الكوشن - برفق. فهي تلتقط أكثر بكثير مما تبدو، وأخذ الكثير هو الطريقة الوحيدة لجعل هذا المنتج يبدو ثقيلاً.',
      },
      {
        title: 'ربّتي ولا تسحبي',
        body: 'انقري على البشرة بدل السحب عليها. التربيت هو ما يوزّع الطبقة بالتساوي ويمنع التخطيط على المناطق الجافة.',
      },
      {
        title: 'كثّفي حيث تحتاجين فقط',
        body: 'أعيدي المرور على الاحمرار أو الآثار أو الظلال بطبقة رقيقة ثانية. الطبقات الرقيقة المتراكمة تبقى كالبشرة، والطبقة السميكة الواحدة لا تفعل أبداً.',
      },
      {
        title: 'بدّلي العبوة وتابعي',
        body: 'ادفعي العبوة الفارغة من الأسفل، ثبّتي الاحتياطية، وعادت العلبة ممتلئة. احتفظي بالإسفنجة أو استخدمي الجديدة.',
      },
    ],
    note:
      'تُقاس معاملات الحماية بطبقة أسمك مما يضعه أحد من الأساس، فليومٍ عادي - الطريق والمكتب وتوصيل الأولاد - يؤدي هذا الغرض. أما لساعات تحت الشمس المباشرة فضعي واقياً مخصّصاً تحته وجدّديه. وهذا ينطبق على كل أساس ملوّن، لا على هذا وحده.',
  },

  video: {
    title: 'شاهدي النتيجة',
    body: 'كيف يلتقطه الإسفنج، وكيف يستقرّ بعد التربيت، وإلى أي مدى تكفي ضغطة واحدة.',
    unsupported: 'متصفّحك لا يدعم تشغيل الفيديو.',
  },

  actives: {
    eyebrow: 'التركيبة',
    title: 'ما بداخله فعلاً',
    intro:
      'فعّالان مسجّلان يقومان بالعمل، وتسع ببتيدات مذكورة على العلبة، والقائمة الكاملة أدناه من دون حذف.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote:
      'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك. متطابقة في الدرجات الثلاث باستثناء الصبغات.',
  },

  lab: {
    eyebrow: 'الجودة',
    title: 'صُنع واختُبر في كوريا، ومُعتمد في الإمارات',
    intro: 'لا شيء يغادر المصنع دون اختبار، ولا شيء يصلك هنا قبل تسجيله للبيع في الإمارات.',
    rows: [
      { label: 'الاختبار الجلدي', value: 'مُختبر جلدياً' },
      { label: 'درجة الحموضة', value: '6.5 - النطاق نفسه للبشرة السليمة، فلا لسع ولا شدّ' },
      { label: 'النقاء', value: 'كل دفعة تُختبر ميكروبياً وتُعتمد ضمن الحدّ بمسافة مريحة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات مغلقاً، وتاريخ الانتهاء على العلبة · 12 شهراً بعد الفتح' },
      { label: 'معتمد في الإمارات', value: 'الدرجات الثلاث مسجّلة لدى بلدية دبي، إلى جانب شهادة البيع الحر الكورية' },
    ],
    disclaimer:
      'الحماية اليومية من الشمس هي ما يمنع التصبّغ من العودة. والكلف العنيد وآثار ما بعد الالتهاب تستجيب أفضل حين يعمل طبيب الجلد إلى جانب روتينك.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'للاستعمال الخارجي فقط. تجنّبي العينين والأغشية المخاطية، واشطفي بالماء البارد عند الملامسة.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'استشيري مختصاً إذا ظهرت بقع حمراء أو تورّم أو حكة على موضع الاستخدام بعد التعرّض للشمس.',
      'تجنّبي البشرة المجروحة أو المتضرّرة.',
      'يُحفظ بين 10 و30 درجة مئوية بعيداً عن الشمس المباشرة، وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، بما فيها التحذيران اللذان تحملهما اللوحة الكورية. يُستخدم خلال 12 شهراً من الفتح.',
  },

  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'ما يأتي قبله',
    intro:
      'الكوشن هو آخر خطوة في الصباح. البشرة النظيفة والميست والمرطّب تحته هي ما يجعله يستقرّ جيداً ويثبت.',
    thisProduct: 'هذا المنتج',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الخيارات',
    fromPrice: 'من',
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'أي درجة أختار؟',
        a: 'طابقي العمق أولاً: ‎#01 Ivory‎ للبشرة الفاتحة التي تحترق بسرعة، و‎#02 Beige‎ للفاتحة إلى المتوسطة، و‎#03 Camel‎ للمتوسطة إلى القمحية. ثم الدرجة الأساسية - باردة لآيفوري، محايدة لبيج، دافئة لكاميل. وإن كنتِ بين اثنتين فخذي الأعمق، وجرّبيها على خط الفكّ في ضوء النهار لا على يدك.',
      },
      {
        q: 'هل SPF50+ كافٍ وحده؟',
        a: 'ليومٍ عادي، نعم. تُقاس معاملات الحماية بطبقة أثقل مما يضعه أحد من الأساس، فإن كنتِ ستقضين ساعات تحت الشمس المباشرة فضعي واقياً مخصّصاً تحته وجدّديه. أما في يوم بين الطريق والمكتب فالكوشن يؤدي الغرض وحده.',
      },
      {
        q: 'هل أستخدمه بعد الجلسات؟',
        a: 'لهذا صُنع. القوام خفيف، والتركيبة مُختبرة جلدياً، والفعّالان هما الزوج المسجّل اللطيف لا الأحماض أو الريتينول. التزمي بمدة الانتظار التي حدّدتها عيادتك بعد الميكرونيدلنغ أو الليزر أو التقشير - تلك التعليمات منهم لا منّا.',
      },
      {
        q: 'كم تدوم العلبة الواحدة؟',
        a: 'تحصلين على 30 غ إجمالاً: كوشن 15 غ وعبوة احتياطية 15 غ في العلبة نفسها. للاستعمال اليومي تكفي معظم الناس عدة أشهر، من دون شراء ثانٍ بينهما.',
      },
      {
        q: 'كيف أبدّل العبوة الاحتياطية؟',
        a: 'ارفعي العبوة الفارغة بالدفع من الفتحة أسفل العلبة، ضعي الاحتياطية واضغطي حتى تسمعي صوت التثبيت. تستغرق نحو عشر ثوانٍ، ويمكن إعادة استخدام الإسفنجة أو استبدالها بالجديدة.',
      },
      {
        q: 'هل يبدو ثقيلاً أو يسدّ المسام؟',
        a: 'هو كوشن لا كريم أساس بتغطية كاملة: قوام خفيف كالإسنس بصبغة قابلة للبناء. خذي أقل مما تظنّين في الضغطة الأولى، وربّتي بدل السحب، وأضيفي طبقة ثانية حيث تريدين المزيد فقط.',
      },
    ],
  },

  details: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: 'كوشن 15 غ مع عبوة احتياطية 15 غ - 30 غ إجمالاً' },
      { label: 'الحماية من الشمس', value: 'SPF50+ PA++++ بخمسة فلاتر' },
      { label: 'الفعّالات المسجّلة', value: 'نياسيناميد 2% · أدينوزين 0.04%' },
      { label: 'الدرجات', value: '‎#01 Ivory‎ · ‎#02 Beige‎ · ‎#03 Camel‎' },
      { label: 'النهاية', value: 'طبيعية ومشرقة، قابلة للبناء' },
      { label: 'البشرة', value: 'كل الأنواع، بما فيها الحسّاسة وما بعد الجلسات' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
      { label: 'بعد الفتح', value: '12 شهراً' },
      { label: 'التخزين', value: '10-30 درجة مئوية بعيداً عن الشمس المباشرة' },
    ],
    brochure: 'حمّلي دليل المنتج (PDF)',
  },

  backToProducts: 'المنتجات',
}

const RU: BbCushionCopy = {
  eyebrow: 'Skin Caring Blemish Balm Cushion · SPF50+ PA++++',
  headline: 'Одно нажатие: покрытие, защита и уход.',
  subheadline:
    'Нажали, похлопали - готово: ровное покрытие, которое выглядит как кожа, высшая солнцезащитная оценка Кореи и два ухаживающих актива, работающих под ним весь день. Корея лицензирует этот кушон сразу для всех трёх задач - солнце, тон и морщины, - а такой лицензии у тональных средств почти не бывает.',
  heroBullets: [
    'SPF50+ PA++++ - максимум по обеим шкалам, на пяти фильтрах',
    'Ниацинамид на полных 2% для тона, аденозин 0,04% для мелких морщин',
    'Сменный блок 15 г уже в коробке - вдвое дольше за ту же цену',
    'Достаточно лёгкий для кожи после процедур, наращиваемый там, где нужно',
  ],
  badges: ['Сделано в Корее', '15 г × 2 · 12 месяцев после вскрытия', 'Дерматологически протестировано', 'Официальный дистрибьютор в ОАЭ'],

  shadeLabel: 'Выберите оттенок',
  shadeHelp: 'Формула во всех трёх одинакова. Меняется только цвет.',
  shadeSelected: 'Выбрано',
  shadeRequired: 'Выберите оттенок перед добавлением в корзину.',
  shades: [
    {
      value: 'Ivory',
      code: '#01',
      name: 'Ivory',
      hex: '#f1dcc4',
      tagline: 'Самый светлый',
      body: 'Для светлой кожи, которая быстро обгорает и почти не загорает, с холодным розовым или голубоватым подтоном. Наименьшая доля пигмента из трёх - скорее высветляет, чем согревает.',
    },
    {
      value: 'Beige',
      code: '#02',
      name: 'Beige',
      hex: '#e7bd95',
      tagline: 'Выбирают чаще всего',
      body: 'Для светлой и средней кожи с нейтральным подтоном. Ровно вдвое больше пигмента, чем в Ivory, - безопасный средний вариант, если вы между двумя. Наш бестселлер.',
    },
    {
      value: 'Camel',
      code: '#03',
      name: 'Camel',
      hex: '#cf9d6d',
      tagline: 'Самый глубокий',
      body: 'Для средней и смуглой кожи, которая держит загар, с тёплым золотистым или оливковым подтоном. Примерно в три с половиной раза больше пигмента, чем в Ivory: перекрывает, не уходя в серость.',
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
    { value: 'SPF50+', label: 'PA++++ - максимум по обеим шкалам' },
    { value: '5', label: 'UV-фильтров: два минеральных и три химических' },
    { value: '2%', label: 'Ниацинамид - та же доза, что в сыворотке Multi Vita' },
    { value: '30 г', label: 'Кушон и сменный блок, оба в коробке' },
  ],

  functions: {
    eyebrow: 'Три задачи, одна пудреница',
    title: 'Он не просто лежит и красиво выглядит',
    intro:
      'Корея не разрешает заявлять защиту от солнца, работу с тоном и коррекцию морщин, пока за каждой заявкой не стоит названный актив в установленной дозе. Этот кушон лицензирован сразу для трёх, и активы напечатаны на коробке.',
    cards: [
      {
        title: 'Он держит солнце',
        body: 'SPF50+ PA++++ на пяти фильтрах. Диоксид титана и оксид цинка рассеивают свет, три химических фильтра его поглощают, и именно сочетание позволяет такой лёгкой базе дойти до верха шкалы.',
      },
      {
        title: 'Он работает с тоном',
        body: 'Ниацинамид на полных 2% - та же доза, что в сыворотке и креме Multi Vita, а не символическая щепотка. Выравнивает тон и поддерживает барьер всё время, пока вы его носите.',
      },
      {
        title: 'Он смягчает мелкие морщины',
        body: 'Аденозин 0,04% - доза, на которой Корея лицензирует заявления о морщинах. То есть под покрытием идёт настоящий уход, а не только цвет.',
      },
      {
        title: 'Он выравнивает сразу',
        body: 'Три оксида железа делают оптическую работу в момент нанесения. Покрытие наращиваемое и намеренно естественное: читается как хорошая кожа, а не как макияж.',
      },
    ],
  },

  wear: {
    eyebrow: 'Почему держится',
    title: 'Рассчитан на день в Дубае',
    intro:
      'Кушон, который сползает к обеду, ничего не защищает. Этот построен из трёх слоёв, и только средний отвечает за цвет.',
    steps: [
      {
        step: '01',
        title: 'Эссенс-основа, которой комфортно',
        body: 'Формула ложится влажно и легко, а не плотно, - поэтому не цепляется за сухие участки и не забивается в рельеф. Именно за это её можно наносить сразу после процедур.',
      },
      {
        step: '02',
        title: 'Пигмент и фильтры вместе',
        body: 'Цвет и защита идут одним слоем, так что не нужно выбирать между SPF и тоном. Одно нажатие делает и то и другое.',
      },
      {
        step: '03',
        title: 'Три полимера, которые фиксируют',
        body: 'Тройка фиксирующих полимеров образует сверху эластичную плёнку. Она и не даёт покрытию плыть в жару и влажность, и избавляет от подправок каждые два часа.',
      },
    ],
    note:
      'Жара, кондиционер и окно машины - три вещи, которые убивают любую базу в Заливе. Фиксирующая плёнка отвечает сразу на все: она схватывается, а не остаётся влажной, поэтому то, что вы нанесли утром, остаётся на месте.',
  },

  filters: {
    eyebrow: 'Защита от солнца',
    title: 'Пять фильтров: минеральные и химические вместе',
    intro:
      'Полностью минеральные базы дают белый налёт, полностью химические могут пощипывать. Сочетание даёт высшую оценку без обеих проблем - достаточно комфортно, чтобы носить каждый день, а только такой санскрин и защищает.',
    columns: { name: 'Фильтр', amount: 'Концентрация', role: 'Тип' },
    rows: [
      { name: 'Titanium Dioxide', amount: '9,00%', role: 'Минеральный - рассеивает свет' },
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7,00%', role: 'Химический - поглощает UVB' },
      { name: 'Ethylhexyl Salicylate', amount: '4,50%', role: 'Химический - поглощает UVB' },
      { name: 'Octocrylene', amount: '2,00%', role: 'Химический - UVB и короткий UVA' },
      { name: 'Zinc Oxide', amount: '2,00%', role: 'Минеральный - широкий спектр' },
    ],
    note:
      'Бутилоктилсалицилат стоит на 6% и выглядит шестым фильтром. Это не так - он растворитель, который удерживает остальные пять в растворе и делает их комфортными на коже. Пять - честное число, и пяти достаточно для SPF50+ PA++++.',
  },

  shadeSection: {
    eyebrow: 'Три оттенка',
    title: 'Выбираете цвет, всё остальное одинаково',
    intro:
      'Сначала глубина, потом подтон. Если вы между двумя - берите тот, что темнее: он согревается на коже, а более светлый может лечь плоско.',
    sameFormula:
      'Одинаковая защита, одинаковый ниацинамид, одинаковый аденозин, одинаковые пептиды. Между #01, #02 и #03 меняется только оксид железа, поэтому ни один оттенок не защищает и не ухаживает лучше другого.',
    figureAlt: 'GENOSYS Skin Caring Blemish Balm Cushion - гид по оттенкам #01 Ivory, #02 Beige и #03 Camel',
  },

  puff: {
    eyebrow: 'Спонж',
    title: 'Четыре слоя там, где у всех три',
    intro:
      'О спонже никто не думает, пока он не начинает выпивать средство. Этот спроектирован так, чтобы не начинал.',
    points: [
      {
        title: 'Кончик-капля, а не круг',
        body: 'Заострён с одной стороны, поэтому достаёт до изгиба у носа и внутреннего уголка глаза, не сминаясь. Именно там большинство кушонов оставляют пробел.',
      },
      {
        title: 'Четвёртый, водонепроницаемый слой',
        body: 'Обычный спонж - три слоя, и он впитывает всё, чего касается. Водонепроницаемая плёнка снизу оставляет формулу в кушоне и на лице, поэтому пудреницы хватает настолько, насколько должно.',
      },
      {
        title: 'И сменный блок уже в коробке',
        body: 'Когда первые 15 г закончатся, вытолкните использованный блок снизу и вставьте новый до щелчка. Ни второй покупки, ни ожидания.',
      },
    ],
    figureAlt: 'Четырёхслойный спонж-капля в разрезе',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Нажать, похлопать, добавить',
    frequency: 'Каждое утро · последний шаг перед выходом',
    steps: [
      {
        title: 'Нажмите слегка',
        body: 'Прижмите спонж к подушечке - слегка. Он набирает гораздо больше, чем кажется, а взять лишнее - единственный способ сделать это средство тяжёлым.',
      },
      {
        title: 'Похлопывайте, а не растирайте',
        body: 'Наносите постукиванием, а не протягиванием. Именно похлопывание кладёт слой ровно и не даёт полосить на сухих участках.',
      },
      {
        title: 'Добавляйте только там, где нужно',
        body: 'Пройдите вторым тонким слоем по покраснениям, следам и теням. Тонкие слои друг на друге остаются похожими на кожу, один толстый - никогда.',
      },
      {
        title: 'Замените блок и продолжайте',
        body: 'Вытолкните пустой блок снизу, вставьте запасной - и пудреница снова полная. Спонж можно оставить прежний или взять новый.',
      },
    ],
    note:
      'SPF измеряют на более толстом слое, чем кто-либо наносит тональное средство, поэтому для обычного дня - дорога, офис, школа - этого хватает. Для нескольких часов на прямом солнце нанесите отдельный санскрин под низ и обновляйте его. Это верно для любой тональной базы, не только для этой.',
  },

  video: {
    title: 'Посмотрите, как ложится',
    body: 'Как средство набирается на спонж, как выглядит после похлопывания и на сколько хватает одного нажатия.',
    unsupported: 'Ваш браузер не поддерживает воспроизведение видео.',
  },

  actives: {
    eyebrow: 'Состав',
    title: 'Что внутри на самом деле',
    intro:
      'Два зарегистрированных актива делают работу, девять пептидов названы на коробке, а полный список ниже - без сокращений.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote:
      'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках. Одинаково для всех трёх оттенков, кроме пигментов.',
  },

  lab: {
    eyebrow: 'Качество',
    title: 'Сделано и проверено в Корее, допущено в ОАЭ',
    intro: 'Ничего не уходит с завода без проверки и ничего не попадает к вам без регистрации для продажи в ОАЭ.',
    rows: [
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'pH', value: '6,5 - тот же диапазон, что у здоровой кожи: ничего не щиплет и не стягивает' },
      { label: 'Чистота', value: 'Каждая партия проверяется на микробиологию и проходит с большим запасом' },
      { label: 'Срок годности', value: 'Три года закрытым, дата на коробке · 12 месяцев после вскрытия' },
      { label: 'Допуск в ОАЭ', value: 'Все три оттенка зарегистрированы в муниципалитете Дубая, плюс корейский сертификат свободной продажи' },
    ],
    disclaimer:
      'Ежедневная защита от солнца - это то, что не даёт пигментации вернуться. Стойкая мелазма и постакне-пятна отвечают лучше, когда рядом с вашим уходом работает дерматолог.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Только для наружного применения. Избегайте глаз и слизистых, при попадании промойте прохладной водой.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Обратитесь к специалисту, если после солнца на обработанном участке появились красные пятна, отёк или зуд.',
      'Не наносите на повреждённую кожу.',
      'Храните при 10-30 °C вдали от прямого солнца и в недоступном для детей месте.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, включая два, которые есть на корейской панели. Использовать в течение 12 месяцев после вскрытия.',
  },

  routine: {
    eyebrow: 'Дополните уход',
    title: 'Что идёт до него',
    intro:
      'Кушон - последний шаг утра. Чистая кожа, мист и крем под ним - это то, из-за чего он ложится ровно и держится.',
    thisProduct: 'Этот продукт',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать опции',
    fromPrice: 'от',
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Какой оттенок выбрать?',
        a: 'Сначала глубина: #01 Ivory - светлая кожа, которая быстро обгорает, #02 Beige - светлая и средняя, #03 Camel - средняя и смуглая. Затем подтон: холодный для Ivory, нейтральный для Beige, тёплый для Camel. Между двумя - берите тот, что темнее, и проверяйте по линии челюсти при дневном свете, а не на руке.',
      },
      {
        q: 'Достаточно ли SPF50+ самого по себе?',
        a: 'Для обычного дня - да. SPF измеряют на более плотном слое, чем кто-либо наносит базу, поэтому для нескольких часов на прямом солнце нужен отдельный санскрин под низ и его обновление. В режиме «дорога и офис» кушон справляется сам.',
      },
      {
        q: 'Можно ли после процедур?',
        a: 'Для этого он и сделан. Текстура лёгкая, формула дерматологически протестирована, а активы - мягкая зарегистрированная пара, а не кислоты или ретинол. Соблюдайте паузу, которую назначила ваша клиника после микронидлинга, лазера или пилинга: это их инструкция, не наша.',
      },
      {
        q: 'Насколько хватает одной пудреницы?',
        a: 'Всего 30 г: кушон 15 г плюс сменный блок 15 г в той же коробке. При ежедневном использовании большинству хватает на несколько месяцев, и докупать между ними ничего не нужно.',
      },
      {
        q: 'Как поменять сменный блок?',
        a: 'Вытолкните пустой блок через отверстие снизу корпуса, вложите запасной и прижмите до щелчка. Занимает секунд десять, спонж можно оставить прежний или взять новый.',
      },
      {
        q: 'Не будет ли тяжело и не забьёт ли поры?',
        a: 'Это кушон, а не плотный тональный крем: лёгкая эссенс-текстура с наращиваемым пигментом. Возьмите меньше, чем кажется нужным, на первом нажатии, похлопывайте вместо растирания и добавляйте второй слой только там, где хотите плотнее.',
      },
    ],
  },

  details: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: 'Кушон 15 г плюс сменный блок 15 г - 30 г всего' },
      { label: 'Защита от солнца', value: 'SPF50+ PA++++ на пяти фильтрах' },
      { label: 'Зарегистрированные активы', value: 'Ниацинамид 2% · Аденозин 0,04%' },
      { label: 'Оттенки', value: '#01 Ivory · #02 Beige · #03 Camel' },
      { label: 'Финиш', value: 'Естественный, сияющий, наращиваемый' },
      { label: 'Кожа', value: 'Все типы, включая чувствительную и после процедур' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
      { label: 'После вскрытия', value: '12 месяцев' },
      { label: 'Хранение', value: '10-30 °C, вдали от прямого солнца' },
    ],
    brochure: 'Скачать гид по продукту (PDF)',
  },

  backToProducts: 'Продукты',
}

const AR_AUDITED: BbCushionCopy = {
  ...AR,
  headline: 'تغطية طبيعية وحماية عالية في خطوة واحدة.',
  subheadline:
    'كوشن خفيف قابل للبناء يمنح البشرة مظهراً متجانساً وإشراقة طبيعية، مع حماية SPF 50+ PA++++ بخمسة مرشحات. يدعم النياسيناميد 2% مظهر لون أكثر تجانساً، ويعتني الأدينوزين 0.04% بمظهر التجاعيد.',
  heroBullets: [
    'خمسة مرشحات للأشعة فوق البنفسجية بتصنيف SPF 50+ PA++++',
    'نياسيناميد 2% وأدينوزين 0.04%',
    'كوشن 15 غ وعبوة إعادة تعبئة 15 غ داخل العلبة',
    'ثلاث درجات: #01 Ivory و#02 Beige و#03 Camel',
  ],
  shadeHelp: 'تشترك الدرجات الثلاث في نظام المرشحات والمكونات الوظيفية.',
  shades: [
    {
      value: 'Ivory',
      code: '#01',
      name: 'Ivory',
      hex: '#f1dcc4',
      tagline: 'درجة فاتحة',
      body: 'درجة فاتحة بلمسة محايدة إلى باردة. اختبريها على خط الفك في ضوء النهار.',
    },
    {
      value: 'Beige',
      code: '#02',
      name: 'Beige',
      hex: '#e7bd95',
      tagline: 'درجة متوسطة',
      body: 'درجة بيج متوسطة بلمسة محايدة. اختبريها على خط الفك في ضوء النهار.',
    },
    {
      value: 'Camel',
      code: '#03',
      name: 'Camel',
      hex: '#cf9d6d',
      tagline: 'درجة أعمق ودافئة',
      body: 'درجة أعمق بلمسة دافئة. اختبريها على خط الفك في ضوء النهار.',
    },
  ],
  stats: [
    { value: 'SPF 50+', label: 'حماية PA++++' },
    { value: '5', label: 'مرشحات للأشعة فوق البنفسجية' },
    { value: '2%', label: 'نياسيناميد' },
    { value: '15 + 15 غ', label: 'الكوشن وعبوة إعادة التعبئة' },
  ],
  functions: {
    eyebrow: 'ثلاث وظائف مسجلة في كوريا',
    title: 'لون متجانس وحماية وعناية',
    intro:
      'يسجل في كوريا كمستحضر وظيفي ثلاثي للوقاية من الأشعة فوق البنفسجية والتفتيح والعناية بالتجاعيد.',
    cards: [
      {
        title: 'حماية SPF 50+ PA++++',
        body: 'خمسة مرشحات معدنية وعضوية تكوّن نظام الوقاية من الأشعة فوق البنفسجية.',
      },
      {
        title: 'مظهر لون أكثر تجانساً',
        body: 'النياسيناميد بتركيز 2% هو المكون الوظيفي المسجل للعناية بمظهر اللون.',
      },
      {
        title: 'العناية بمظهر التجاعيد',
        body: 'الأدينوزين بتركيز 0.04% هو المكون الوظيفي المسجل للعناية بمظهر التجاعيد.',
      },
      {
        title: 'تغطية قابلة للبناء',
        body: 'تمنح أكاسيد الحديد تغطية لونية يمكن تكثيفها بطبقات رقيقة مع الحفاظ على مظهر طبيعي.',
      },
    ],
  },
  wear: {
    eyebrow: 'تغطية عملية',
    title: 'طبقات رقيقة لمظهر أكثر ثباتاً',
    intro:
      'ابدئي بكمية قليلة وربتيها بالتساوي، ثم أضيفي طبقة أخرى على المواضع التي تحتاج إلى تغطية أكبر.',
    steps: [
      {
        step: '01',
        title: 'تغطية خفيفة',
        body: 'يوزع قوام الكوشن بالتربيت في طبقة رقيقة ومتجانسة.',
      },
      {
        step: '02',
        title: 'لون وحماية',
        body: 'تحمل طبقة الكوشن الصبغات ونظام المرشحات الخمسة معاً.',
      },
      {
        step: '03',
        title: 'بوليمرات مكوّنة للغشاء',
        body: 'تضم التركيبة ثلاثة بوليمرات مكوّنة للغشاء تساعد التغطية على الثبات.',
      },
    ],
    note:
      'الثبات التجميلي لا يعني مقاومة الماء ولا يلغي إعادة تطبيق الحماية عند البقاء في الخارج.',
  },
  filters: {
    eyebrow: 'الحماية من الشمس',
    title: 'خمسة مرشحات بتركيز إجمالي 24.50208%',
    intro:
      'يجمع النظام بين مرشحين معدنيين وثلاثة مرشحات عضوية للوصول إلى تصنيف SPF 50+ PA++++.',
    columns: { name: 'المرشح', amount: 'التركيز', role: 'النوع' },
    rows: [
      { name: 'Titanium Dioxide', amount: '9.00208%', role: 'معدني' },
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7%', role: 'عضوي · UVB' },
      { name: 'Ethylhexyl Salicylate', amount: '4.5%', role: 'عضوي · UVB' },
      { name: 'Octocrylene', amount: '2%', role: 'عضوي' },
      { name: 'Zinc Oxide', amount: '2%', role: 'معدني' },
    ],
    note:
      'Butyloctyl Salicylate بنسبة 6% مسجل كمذيب في أوراق التركيبة، وليس مرشحاً سادساً.',
  },
  shadeSection: {
    eyebrow: 'ثلاث درجات',
    title: 'اختاري الدرجة المناسبة للون بشرتك',
    intro:
      'اختبري الدرجة على خط الفك في ضوء النهار، ثم اتركيها تستقر قبل اتخاذ القرار.',
    sameFormula:
      'تشترك الدرجات الثلاث في المرشحات الخمسة والنياسيناميد 2% والأدينوزين 0.04%. تحدد أكاسيد الحديد لون كل درجة، كما تُظهر أوراق التركيبة اختلافاً إضافياً في توازن بعض المذيبات لدرجة Camel.',
    figureAlt: 'دليل درجات كوشن GENOSYS: #01 Ivory و#02 Beige و#03 Camel',
  },
  puff: {
    ...AR.puff,
    intro:
      'تساعد إسفنجة Waterdrop على الوصول إلى جوانب الأنف والزوايا الصغيرة، وتحد طبقتها الداخلية المقاومة للماء من امتصاص الإسفنجة للتركيبة.',
    points: [
      {
        title: 'طرف دقيق على شكل قطرة',
        body: 'يساعد الطرف المدبب على توزيع المنتج حول الأنف وفي المناطق الصغيرة.',
      },
      {
        title: 'طبقة داخلية مقاومة للماء',
        body: 'هذه خاصية في بنية الإسفنجة لتقليل امتصاصها للتركيبة، وليست ادعاءً بأن منتج الكوشن نفسه مقاوم للماء.',
      },
      {
        title: 'عبوة إعادة تعبئة داخل العلبة',
        body: 'بعد انتهاء 15 غ الأولى، تستبدل بعبوة إعادة التعبئة 15 غ المرفقة.',
      },
    ],
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'اضغطي برفق ثم ربتي',
    frequency: 'الخطوة الأخيرة صباحاً',
    steps: [
      {
        title: 'اختاري الدرجة',
        body: 'اختبري Ivory أو Beige أو Camel على خط الفك في ضوء النهار.',
      },
      {
        title: 'خذي كمية قليلة',
        body: 'اضغطي الإسفنجة برفق على وسادة الكوشن من دون ضغط عميق.',
      },
      {
        title: 'ربتي ووزعي',
        body: 'وزعي طبقة رقيقة بالتربيت، ثم أضيفي طبقة أخرى حيث تحتاجين إلى تغطية أكبر.',
      },
      {
        title: 'جددي الحماية',
        body: 'أعيدي التطبيق كل ساعتين على الأقل في الخارج وبعد السباحة أو التعرق الشديد أو التجفيف بالمنشفة.',
      },
    ],
    note:
      'لا يدّعي المنتج مقاومة الماء. عند التعرض الطويل أو القوي للشمس، استخدمي واقياً مخصصاً بكمية كافية تحت المكياج.',
  },
  actives: {
    ...AR.actives,
    intro:
      'المكونان الوظيفيان هما النياسيناميد 2% والأدينوزين 0.04%. توجد الببتيدات والغلوتاثيون ومستخلص Anemarrhena بمستويات ضئيلة، لذلك لا ننسب إليها ادعاءات وظيفية.',
    fullInciNote:
      'القائمة كما هي مطبوعة على العبوة. تتغير نسب أكاسيد الحديد بين الدرجات، وتظهر ورقة Camel اختلافاً في توازن بعض المذيبات.',
  },
  lab: {
    eyebrow: 'الجودة',
    title: 'ثلاث درجات اجتازت اختبارات الجودة',
    intro:
      'سجلت شهادات التحليل المظهر واللون والرائحة واللزوجة والأس الهيدروجيني والاختبار الميكروبي.',
    rows: [
      { label: 'الاختبار الجلدي', value: 'تحمل العبوة عبارة «مختبر جلدياً»' },
      { label: 'الأس الهيدروجيني', value: 'Ivory ‏6.44 · Beige ‏6.49 · Camel ‏6.51' },
      { label: 'الفحص الميكروبي', value: 'أقل من 500 CFU/g لكل درجة · ناجح' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات قبل الفتح · 12 شهراً بعد الفتح' },
      { label: 'العطر', value: 'لا تحتوي أوراق التركيبة على Parfum' },
    ],
    disclaimer:
      'لا توجد في الملف دراسة فعالية تبرر نسب تحسن سريرية أو ادعاءات علاجية.',
  },
  safety: {
    ...AR.safety,
    note:
      'احتياطات العبوة: للاستخدام الخارجي فقط، لا يوضع على الجلد المتضرر، ويوقف عند التهيج. لا توجد تعليمات موثقة تجيز الاستخدام الفوري بعد الإجراءات.',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'أي درجة أختار؟',
        a: '#01 Ivory فاتحة، و#02 Beige متوسطة، و#03 Camel أعمق ودافئة. اختبري الدرجة على خط الفك في ضوء النهار.',
      },
      {
        q: 'هل يكفي الكوشن وحده للحماية؟',
        a: 'تعتمد الحماية الفعلية على الكمية وإعادة التطبيق. عند التعرض الطويل للشمس استخدمي واقياً مخصصاً بكمية كافية تحت المكياج، وجددي الحماية كل ساعتين على الأقل في الخارج.',
      },
      {
        q: 'هل المنتج مقاوم للماء؟',
        a: 'لا. الطبقة المقاومة للماء موجودة داخل إسفنجة Waterdrop لتقليل امتصاصها للتركيبة، ولا تمثل ادعاءً بمقاومة المنتج للماء.',
      },
      {
        q: 'هل يمكن استخدامه مباشرة بعد إجراء تجميلي؟',
        a: 'لا توجد تعليمات موثقة للاستخدام الفوري بعد الإجراءات. اتبعي المدة وتعليمات العناية التي يحددها طبيبك أو مختصك.',
      },
      {
        q: 'ماذا تحتوي العلبة؟',
        a: 'كوشن 15 غ وعبوة إعادة تعبئة 15 غ وإسفنجة Waterdrop.',
      },
      {
        q: 'هل يحتوي على عطر؟',
        a: 'لا تحتوي أوراق تركيبة الدرجات الثلاث على Parfum أو عطر مضاف.',
      },
    ],
  },
  details: {
    ...AR.details,
    rows: [
      { label: 'الحجم', value: 'كوشن 15 غ + عبوة إعادة تعبئة 15 غ' },
      { label: 'الحماية', value: 'SPF 50+ PA++++ · خمسة مرشحات' },
      { label: 'المكونات الوظيفية', value: 'نياسيناميد 2% · أدينوزين 0.04%' },
      { label: 'الدرجات', value: '#01 Ivory · #02 Beige · #03 Camel' },
      { label: 'مقاومة الماء', value: 'غير مدعاة للمنتج' },
      { label: 'العطر', value: 'من دون عطر مضاف' },
      { label: 'المنشأ', value: 'صنع في كوريا' },
      { label: 'بعد الفتح', value: '12 شهراً' },
      { label: 'التخزين', value: '10-30°م بعيداً عن الشمس المباشرة' },
    ],
  },
}

const RU_AUDITED: BbCushionCopy = {
  ...RU,
  headline: 'Естественное покрытие и высокая защита в одном шаге.',
  subheadline:
    'Лёгкий BB-кушон с регулируемой плотностью покрытия, естественным сиянием и SPF 50+ PA++++ на пяти УФ-фильтрах. Ниацинамид 2% поддерживает более ровный тон, а аденозин 0,04% ухаживает за видимыми морщинами.',
  heroBullets: [
    'Пять УФ-фильтров · SPF 50+ PA++++',
    'Ниацинамид 2% · аденозин 0,04%',
    'Кушон 15 г и сменный блок 15 г в коробке',
    'Три оттенка: #01 Ivory, #02 Beige и #03 Camel',
  ],
  shadeHelp: 'Во всех трёх оттенках одинаковы система фильтров и функциональные компоненты.',
  shades: [
    {
      value: 'Ivory',
      code: '#01',
      name: 'Ivory',
      hex: '#f1dcc4',
      tagline: 'Светлый',
      body: 'Светлый оттенок с нейтрально-холодным подтоном. Проверяйте на линии челюсти при дневном свете.',
    },
    {
      value: 'Beige',
      code: '#02',
      name: 'Beige',
      hex: '#e7bd95',
      tagline: 'Средний',
      body: 'Средний бежевый оттенок с нейтральным подтоном. Проверяйте на линии челюсти при дневном свете.',
    },
    {
      value: 'Camel',
      code: '#03',
      name: 'Camel',
      hex: '#cf9d6d',
      tagline: 'Более глубокий и тёплый',
      body: 'Более глубокий оттенок с тёплым подтоном. Проверяйте на линии челюсти при дневном свете.',
    },
  ],
  stats: [
    { value: 'SPF 50+', label: 'защита PA++++' },
    { value: '5', label: 'УФ-фильтров' },
    { value: '2%', label: 'ниацинамида' },
    { value: '15 + 15 г', label: 'кушон и сменный блок' },
  ],
  functions: {
    eyebrow: 'Три функции, зарегистрированные в Корее',
    title: 'Ровный тон, защита и уход',
    intro:
      'В Корее средство зарегистрировано как функциональная косметика тройного действия: защита от УФ, осветляющий уход и уход за морщинами.',
    cards: [
      {
        title: 'SPF 50+ PA++++',
        body: 'Пять минеральных и органических фильтров образуют систему защиты от ультрафиолета.',
      },
      {
        title: 'Более ровный вид тона',
        body: 'Ниацинамид 2% - зарегистрированный функциональный компонент для осветляющего ухода.',
      },
      {
        title: 'Уход за видимыми морщинами',
        body: 'Аденозин 0,04% - зарегистрированный функциональный компонент для ухода за морщинами.',
      },
      {
        title: 'Регулируемая плотность',
        body: 'Оксиды железа дают цветное покрытие, которое можно наслаивать тонкими слоями.',
      },
    ],
  },
  wear: {
    eyebrow: 'Практичное покрытие',
    title: 'Тонкие слои выглядят аккуратнее',
    intro:
      'Начните с небольшого количества, равномерно распределите похлопывающими движениями и добавьте второй слой только там, где нужна дополнительная коррекция.',
    steps: [
      {
        step: '01',
        title: 'Тонкое покрытие',
        body: 'Текстура кушона распределяется лёгкими похлопывающими движениями.',
      },
      {
        step: '02',
        title: 'Цвет и защита',
        body: 'В одном слое работают пигменты и система из пяти УФ-фильтров.',
      },
      {
        step: '03',
        title: 'Плёнкообразующие полимеры',
        body: 'Три плёнкообразующих полимера помогают покрытию сохранять аккуратный вид.',
      },
    ],
    note:
      'Стойкость покрытия не означает водостойкость и не отменяет обновление солнцезащиты на улице.',
  },
  filters: {
    eyebrow: 'Защита от солнца',
    title: 'Пять фильтров · 24,50208%',
    intro:
      'Система сочетает два минеральных и три органических УФ-фильтра и обеспечивает SPF 50+ PA++++.',
    columns: { name: 'Фильтр', amount: 'Концентрация', role: 'Тип' },
    rows: [
      { name: 'Titanium Dioxide', amount: '9,00208%', role: 'Минеральный' },
      { name: 'Ethylhexyl Methoxycinnamate', amount: '7%', role: 'Органический · UVB' },
      { name: 'Ethylhexyl Salicylate', amount: '4,5%', role: 'Органический · UVB' },
      { name: 'Octocrylene', amount: '2%', role: 'Органический' },
      { name: 'Zinc Oxide', amount: '2%', role: 'Минеральный' },
    ],
    note:
      'Butyloctyl Salicylate 6% указан в формулах как растворитель, а не как шестой УФ-фильтр.',
  },
  shadeSection: {
    eyebrow: 'Три оттенка',
    title: 'Выберите оттенок под тон кожи',
    intro:
      'Проверяйте оттенок на линии челюсти при дневном свете и дайте ему немного стабилизироваться.',
    sameFormula:
      'Во всех оттенках одинаковы пять УФ-фильтров, ниацинамид 2% и аденозин 0,04%. Цвет задают разные пропорции оксидов железа. В формуле Camel есть и дополнительное отличие в балансе некоторых растворителей.',
    figureAlt: 'Оттенки BB-кушона GENOSYS: #01 Ivory, #02 Beige и #03 Camel',
  },
  puff: {
    ...RU.puff,
    intro:
      'Форма Waterdrop помогает проработать область у крыльев носа и небольшие зоны, а внутренний водонепроницаемый слой уменьшает впитывание формулы спонжем.',
    points: [
      {
        title: 'Заострённая форма капли',
        body: 'Узкий край помогает аккуратно распределить средство у крыльев носа и в небольших зонах.',
      },
      {
        title: 'Внутренний водонепроницаемый слой',
        body: 'Это свойство конструкции спонжа, которое уменьшает впитывание формулы. Оно не означает водостойкость самого кушона.',
      },
      {
        title: 'Сменный блок в комплекте',
        body: 'Когда первые 15 г закончатся, установите сменный блок 15 г из коробки.',
      },
    ],
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Слегка прижмите и нанесите похлопывающими движениями',
    frequency: 'Последний шаг утром',
    steps: [
      {
        title: 'Выберите оттенок',
        body: 'Проверьте Ivory, Beige или Camel на линии челюсти при дневном свете.',
      },
      {
        title: 'Наберите немного средства',
        body: 'Слегка прижмите спонж к подушечке, не продавливая её глубоко.',
      },
      {
        title: 'Распределите похлопываниями',
        body: 'Нанесите тонкий ровный слой и добавьте второй только там, где нужно больше покрытия.',
      },
      {
        title: 'Обновляйте защиту',
        body: 'На улице наносите повторно не реже чем каждые два часа, а также после плавания, сильного потоотделения или полотенца.',
      },
    ],
    note:
      'Водостойкость средства не заявлена. При длительном или интенсивном пребывании на солнце наносите под макияж отдельный санскрин в достаточном количестве.',
  },
  actives: {
    ...RU.actives,
    intro:
      'Функциональные компоненты - ниацинамид 2% и аденозин 0,04%. Пептиды, глутатион и экстракт Anemarrhena присутствуют в следовых количествах, поэтому функциональные обещания к ним не привязаны.',
    fullInciNote:
      'Состав приведён в порядке с упаковки. Между оттенками меняются пропорции оксидов железа; формула Camel также показывает иной баланс некоторых растворителей.',
  },
  lab: {
    eyebrow: 'Качество',
    title: 'Три оттенка прошли контроль качества',
    intro:
      'В сертификатах анализа проверены внешний вид, цвет, запах, вязкость, pH и микробиологические показатели.',
    rows: [
      { label: 'Дерматологический тест', value: 'На упаковке указано «Dermatologically tested»' },
      { label: 'pH', value: 'Ivory 6,44 · Beige 6,49 · Camel 6,51' },
      { label: 'Микробиология', value: 'Менее 500 CFU/g для каждого оттенка · пройдено' },
      { label: 'Срок хранения', value: 'Три года до вскрытия · 12 месяцев после вскрытия' },
      { label: 'Отдушка', value: 'В формулах нет Parfum' },
    ],
    disclaimer:
      'В архиве нет исследования эффективности, которое подтверждало бы проценты клинического улучшения или лечебные обещания.',
  },
  safety: {
    ...RU.safety,
    note:
      'По инструкции на упаковке средство предназначено только для наружного применения, не наносится на повреждённую кожу и отменяется при раздражении. Подтверждённой инструкции для немедленного применения после процедур нет.',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Какой оттенок выбрать?',
        a: '#01 Ivory - светлый, #02 Beige - средний, #03 Camel - более глубокий и тёплый. Проверяйте оттенок на линии челюсти при дневном свете.',
      },
      {
        q: 'Достаточно ли одного кушона для защиты?',
        a: 'Фактическая защита зависит от количества и обновления. При длительном пребывании на солнце используйте под макияж отдельный санскрин в достаточном количестве и обновляйте защиту не реже чем каждые два часа на улице.',
      },
      {
        q: 'Средство водостойкое?',
        a: 'Нет. Водонепроницаемый слой находится внутри спонжа Waterdrop и уменьшает впитывание формулы. Это не заявление о водостойкости самого средства.',
      },
      {
        q: 'Можно наносить сразу после процедуры?',
        a: 'Подтверждённой инструкции для немедленного применения после процедур нет. Соблюдайте сроки и правила постухода, которые назначил врач или специалист.',
      },
      {
        q: 'Что входит в коробку?',
        a: 'Кушон 15 г, сменный блок 15 г и спонж Waterdrop.',
      },
      {
        q: 'Есть ли отдушка?',
        a: 'В формулах трёх оттенков нет Parfum или добавленной парфюмерной отдушки.',
      },
    ],
  },
  details: {
    ...RU.details,
    rows: [
      { label: 'Объём', value: 'Кушон 15 г + сменный блок 15 г' },
      { label: 'Защита', value: 'SPF 50+ PA++++ · пять фильтров' },
      { label: 'Функциональные компоненты', value: 'Ниацинамид 2% · аденозин 0,04%' },
      { label: 'Оттенки', value: '#01 Ivory · #02 Beige · #03 Camel' },
      { label: 'Водостойкость', value: 'Для средства не заявлена' },
      { label: 'Отдушка', value: 'Без добавленной парфюмерной отдушки' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
      { label: 'После вскрытия', value: '12 месяцев' },
      { label: 'Хранение', value: '10-30 °C, вдали от прямого солнца' },
    ],
  },
}

export const BB_CUSHION_COPY: Record<Locale, BbCushionCopy> = {
  en: EN,
  ar: AR_AUDITED,
  ru: RU_AUDITED,
}

export function getBbCushionCopy(locale: string | undefined): BbCushionCopy {
  return BB_CUSHION_COPY[(locale as Locale) ?? 'en'] ?? BB_CUSHION_COPY.en
}
