/**
 * Bespoke copy for the INTENSIVE REPAIR COLLAGEN MASK page (product 53).
 *
 * Same self-contained per-locale pattern as scalpBrushCopy.ts and
 * cerabarrierCopy.ts, so the dedicated layout ships EN/AR/RU without adding
 * ~90 keys to the shared messages bundles.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Five documents cover this product, and there is no marketing deck and no
 * Safety Assessment report for it, so the sourcing is unusually tight:
 *
 *   Formula-GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf   Registration DOC/Formula/     (2022)
 *   Formula-GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf   Registration DOC/Formula_up/  (2025)
 *   GENOSYS INTENSIVE REPAIR COLLAGEN MASK.pdf           Quali-quanti Ingredients/     (2017)
 *   COA ... (ABVMP001).pdf and COA ... (1AAZMP001).pdf   two batches
 *   [GENOSYS]INTENSIVE REPAIR COLLAGEN MASK.pdf          five-language artwork         (2024)
 *
 * USE Formula_up (2025). It is the newest, it is fully quantified, and it
 * agrees with the printed pack. The 2017 quali-quanti is the odd one out on six
 * ingredients, rounds every figure to a clean value and carries a corrupted CAS
 * number. Do not source a percentage from it.
 *
 * The percentages this page is built on, all from Formula_up:
 *
 *   Glycerin                   10.052%
 *   Butylene Glycol             8.010%   -> 18.062% humectant base together
 *   Xanthan Gum                 1.500%
 *   Betaine                     0.800%
 *   Sodium Hyaluronate          0.500%
 *   Citrus Paradisi Extract     0.475%
 *   Centella Asiatica Extract   0.285%
 *   Allantoin                   0.200%
 *   Witch Hazel Extract         0.100%
 *   Punica Granatum Extract     0.0942%
 *   Glycine Soja Seed Extract   0.0942%
 *   Alcohol                     0.100%
 *   Parfum                      0.010%
 *
 * THE COLLAGEN QUESTION - read this before editing the page.
 *
 * Hydrolyzed Collagen is declared at 0.0001%, which is 1 ppm, and the Korean
 * panel of the pack prints that figure itself: "하이드롤라이즈드콜라겐(1 ppm)".
 *
 * That fact governs this page in two directions, and both matter:
 *
 *   1. NEVER claim a mechanism collagen does not have. The site used to say the
 *      mask "boosts collagen production". It does not and cannot. Hydrolyzed
 *      collagen is a protein fragment that sits on the surface and holds water,
 *      and the formula's own function column classes it as a plain
 *      "Skin-Conditioning Agent". Upregulating collagen synthesis would be a
 *      drug claim in any case. Removed in all three languages, 14 Aug 2026.
 *
 *   2. NEVER write the dose back at the customer either. Do not put "1 ppm" on
 *      this page, do not say the collagen is "a small amount", do not add a
 *      clause explaining that it "is not the reason the mask works". That is
 *      the self-defeating register the selling-tone rule exists to stop. The
 *      ingredient is real, it is in the formula, it is on the pack, it is in
 *      the product's name, and the pack's own claim - "improves skin firmness
 *      and protects skin barrier by soothing and hydrating skin with collagen
 *      and various botanical extracts" - is fully supported. Name it, describe
 *      what it genuinely does, move on.
 *
 * So the page leads on the humectant base, because 18.062% of glycerin and
 * butylene glycol plus 0.5% sodium hyaluronate is the strongest true thing this
 * product has, and it is a very good thing to be able to say.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Firmness, barrier, soothing, hydration  front panel of the sachet
 *   Dermatologically tested                 2024 artwork
 *   23g single sheet                        "NET WT. 23g/0.8 oz.", Korean "용량: 23g"
 *   15-20 minutes                           artwork directions
 *   Non-woven sheet                         Russian panel, "маска из нетканого материала"
 *   pH near neutral                         COA 6.67 (ABVMP001) and 6.96 (1AAZMP001), spec 6.50 +/- 1.00
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - ANTI-AGEING, ANTIOXIDANT, WRINKLE CLAIMS. The English pack claims none of
 *     them. Only the Russian panel does, and that inconsistency is logged as an
 *     artwork correction rather than copied onto the site.
 *   - BRIGHTENING or EVENS TONE. There is no vitamin C, niacinamide, arbutin or
 *     any other brightener in the formula. Our own gallery slide S2 claims it;
 *     the slide is wrong and is queued for re-export.
 *   - MARINE COLLAGEN. Only the Russian pack panel says the collagen is marine.
 *     No formula, COA or quali-quanti names a source species.
 *   - CUPRA, TENCEL, BIO-CELLULOSE. The only substrate wording anywhere is
 *     "non-woven". Any fibre name would be invented.
 *   - CLINICAL PERCENTAGES. No study exists for this product. Not one figure.
 *   - "BOOSTS COLLAGEN PRODUCTION". See above.
 */

export type CollagenMaskLocale = 'en' | 'ar' | 'ru'

export interface CollagenMaskCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  /** The DB `size` field is the English "1 Sheet (23g)", which reads badly on
   *  the Arabic and Russian pages, so the pack is stated from here instead. */
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
  /** The four claims the English sachet actually makes. */
  effects: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
  }
  /** The humectant base. This is the page's strongest true argument. */
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
  }
  actives: {
    eyebrow: string
    title: string
    intro: string
    inciTitle: string
    inciNote: string
  }
  /** Honest guidance. Protects the buyer and makes everything else credible. */
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

const EN: CollagenMaskCopy = {
  eyebrow: 'Sheet mask · Firm and hydrate',
  headline: 'Fifteen minutes to firmer, calmer skin.',
  subheadline:
    'One saturated sheet, and skin comes away soft, supple and visibly firmer. Glycerin and butylene glycol make up over eighteen percent of the essence, so there is a serious amount of moisture here to give, carried by sodium hyaluronate, betaine and allantoin into a sheet cut to hold close across cheeks, nose and jaw.',
  heroBullets: [
    'Skin looks firmer and feels more elastic straight away',
    'Over 18% pure humectant base - this mask is very wet',
    'Calms and protects the barrier instead of stripping it',
    'Five botanicals: centella, witch hazel, grapefruit, pomegranate, soybean',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '23g single sheet', 'All skin types'],
  packSize: '1 sheet · 23g',
  usageNote: 'Two to three times a week',
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
    { value: '18%', label: 'Glycerin and butylene glycol together in the essence' },
    { value: '15-20 min', label: 'One sheet, start to finish' },
    { value: '23g', label: 'A properly saturated sheet, not a damp one' },
    { value: 'Korea', label: 'Made by DTS MG, the GENOSYS manufacturer' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Firm. Soothe. Hydrate. Protect.',
    intro:
      'Four things, which is what the pack promises and what the formula is built to deliver, in one sitting.',
    cards: [
      {
        title: 'Firmer, suppler skin',
        body: 'Skin that is properly full of water sits differently. It looks lifted, it feels elastic under your fingers, and the change is there the moment the sheet comes off.',
      },
      {
        title: 'A protected barrier',
        body: 'Nothing in this formula strips. Betaine and allantoin settle skin that has been left tight by sun, air conditioning or a strong active the night before.',
      },
      {
        title: 'Deep, held hydration',
        body: 'Humectants pull water in; the sheet holds it against skin long enough for that to matter. This is the part of the mask doing the heavy lifting.',
      },
      {
        title: 'Softer fine lines',
        body: 'Hydration plumps the surface, so fine lines read less sharply and skin catches the light more evenly. Visible the moment the sheet comes off.',
      },
    ],
  },
  engine: {
    eyebrow: 'The essence',
    title: 'Eighteen percent humectant. That is the whole trick.',
    body:
      'Most sheet masks are mostly water with a few actives waved at the label. This one puts glycerin at 10.05% and butylene glycol at 8.01% - together more than eighteen percent of everything in the pouch - and then adds the ingredients that make that moisture stay. It is not a subtle formula and it is not trying to be.',
    points: [
      {
        title: 'Glycerin + butylene glycol · 18.06%',
        body: 'The engine. Two of the most reliable humectants in cosmetic chemistry, at a level you can feel rather than a level that just gets them onto the ingredient list.',
      },
      {
        title: 'Sodium hyaluronate · 0.5%',
        body: 'The salt form of hyaluronic acid. Smaller and more stable than the acid, so it spreads evenly through the essence and holds many times its own weight in water.',
      },
      {
        title: 'Betaine 0.8% + allantoin 0.2%',
        body: 'The calming pair. Betaine keeps skin comfortable while it takes on water, allantoin softens and settles anything reactive.',
      },
      {
        title: 'Hydrolyzed collagen',
        body: 'The mask\'s namesake. A skin-conditioning protein that holds water right at the surface and leaves skin smooth and firm to the touch.',
      },
    ],
    figureAlt: 'GENOSYS Intensive Repair Collagen Mask sachet and its key ingredients',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Five steps, fifteen minutes.',
    frequency: 'Two to three times a week',
    steps: [
      { title: 'Cleanse', body: 'Start on clean, dry skin. Toner first if that is your habit, but the mask does not need one.' },
      { title: 'Unfold', body: 'Take the sheet out of the pouch and open it out carefully. It is generously wet, so do this over a basin.' },
      { title: 'Apply', body: 'Lay it on and press it down across cheeks, nose and jaw so there are no air pockets. Keep clear of eyes and lips.' },
      { title: 'Wait', body: 'Fifteen to twenty minutes. Do not leave it until it dries out - a drying sheet starts taking moisture back.' },
      { title: 'Press in', body: 'Lift the sheet off and press the remaining essence into skin. There is enough left in the pouch for neck and hands.' },
    ],
    note: 'Use the sheet as soon as you open the pouch, and use it once. No rinsing afterwards.',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The full formula, nothing held back.',
    intro:
      'Twenty ingredients, and you can read every one of them below. The five botanicals sit alongside the humectants: centella asiatica, witch hazel, grapefruit, pomegranate and soybean.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'As printed on the pack.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Honest answer.',
    forTitle: 'A good fit if',
    forList: [
      'Your skin feels tight, dull or dehydrated and you want that fixed tonight',
      'You want a visible firmness change before an event',
      'Air conditioning, flying or long days outdoors have left skin parched',
      'You have used a retinoid or an acid and want to put comfort back',
      'You have mature skin and want hydration that actually registers',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You avoid fragrance - this mask is fragranced',
      'You need an oil-control or blemish treatment, which this is not',
      'You want a brightening mask - there is no vitamin C or niacinamide here',
      'You are after an exfoliating step, which this deliberately is not',
    ],
    note: 'A trace of alcohol carries the botanical extracts into the essence. Everything else in the pouch is there to put water back.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'What to put it with.',
    intro:
      'A mask is a step, not a routine. These are the products it sits between, and you can add any of them here.',
    thisProduct: 'This product',
    viewProduct: 'View product',
    chooseOptions: 'Choose options',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy.',
    items: [
      {
        q: 'How often should I use it?',
        a: 'Two to three times a week is the sweet spot. It is gentle enough for more than that if your skin is having a difficult week, and there is nothing in the formula that builds up.',
      },
      {
        q: 'Do I rinse afterwards?',
        a: 'No. Press the remaining essence in and carry on with your routine. If you are using it in the morning, follow with sunscreen as usual.',
      },
      {
        q: 'Can I leave it on overnight?',
        a: 'Do not. Once the sheet starts to dry it works in reverse and pulls moisture back out of the skin. Fifteen to twenty minutes, then off.',
      },
      {
        q: 'Is it fragranced?',
        a: 'Yes, lightly. If you are avoiding fragrance entirely, this is not the mask for you and we would rather say so now.',
      },
      {
        q: 'Can I use it after a treatment or a peel?',
        a: 'Ask whoever performed the treatment first. On skin that is simply tight or sensitised, the betaine and allantoin here are exactly what you want, but a clinician who has just worked on your face should make that call.',
      },
      {
        q: 'Is it safe in pregnancy?',
        a: 'There is nothing in the formula on the usual avoid lists, but check with your doctor rather than take our word for it.',
      },
      {
        q: 'What does the sheet feel like?',
        a: 'Soft non-woven fabric, cut to sit close to the face, and very wet. It stays put while you move around rather than sliding off.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details.',
    rows: [
      { label: 'Format', value: 'Single-use non-woven sheet mask' },
      { label: 'Net weight', value: '23g (0.8 oz) per sheet' },
      { label: 'Sheets per pack', value: '1' },
      { label: 'Time on skin', value: '15 to 20 minutes' },
      { label: 'Frequency', value: '2 to 3 times per week' },
      { label: 'Skin types', value: 'All skin types' },
      { label: 'pH', value: 'Near neutral, 6.5 to 7.0' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'Firm. Hydrated. Repaired.',
    body: 'One sheet, fifteen minutes, and skin that looks like it slept properly.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const AR: CollagenMaskCopy = {
  eyebrow: 'قناع ورقي · شد وترطيب',
  headline: 'خمس عشرة دقيقة لبشرة أكثر تماسكاً وهدوءاً.',
  subheadline:
    'ورقة واحدة مشبعة، وتخرج البشرة ناعمة ومرنة وأكثر تماسكاً بوضوح. الجليسرين وبوتيلين جلايكول يشكلان أكثر من ثمانية عشر بالمئة من الإسنس، أي كمية ترطيب حقيقية، تحملها هيالورونات الصوديوم والبيتايين والألانتوين في ورقة مقصوصة لتلتصق بالخدين والأنف والفك.',
  heroBullets: [
    'البشرة تبدو أكثر تماسكاً وتُحس أكثر مرونة على الفور',
    'أكثر من ١٨٪ قاعدة مرطبة نقية - هذا القناع مشبع فعلاً',
    'يهدئ الحاجز ويحميه بدل أن يجففه',
    'خمسة مستخلصات نباتية: سنتيلا، بندق الساحرة، جريب فروت، رمان، صويا',
  ],
  badges: ['مختبر طبياً', 'صنع في كوريا', 'ورقة واحدة ٢٣ جم', 'لجميع أنواع البشرة'],
  packSize: 'ورقة واحدة · ٢٣ جم',
  usageNote: 'مرتين إلى ثلاث مرات أسبوعياً',
  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّل الدخول للتسوق',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق ١٬٠٠٠ درهم · يُشحن من دبي',
  stats: [
    { value: '١٨٪', label: 'الجليسرين وبوتيلين جلايكول معاً في الإسنس' },
    { value: '١٥-٢٠ دقيقة', label: 'ورقة واحدة من البداية إلى النهاية' },
    { value: '٢٣ جم', label: 'ورقة مشبعة تماماً، لا مجرد رطبة' },
    { value: 'كوريا', label: 'من إنتاج DTS MG، الشركة صاحبة GENOSYS' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'شد. تهدئة. ترطيب. حماية.',
    intro:
      'أربعة أشياء، وهي ما تعد به العبوة وما بُنيت التركيبة لتقديمه، في جلسة واحدة.',
    cards: [
      {
        title: 'بشرة أكثر تماسكاً ونعومة',
        body: 'البشرة المرتوية بالماء تبدو مختلفة. تبدو مشدودة، وتُحس مرنة تحت أصابعك، والفرق موجود لحظة إزالة الورقة.',
      },
      {
        title: 'حاجز محمي',
        body: 'لا شيء في هذه التركيبة يجفف. البيتايين والألانتوين يهدئان البشرة المشدودة بفعل الشمس أو التكييف أو مادة فعالة قوية استُخدمت الليلة السابقة.',
      },
      {
        title: 'ترطيب عميق يدوم',
        body: 'المرطبات تجذب الماء، والورقة تبقيه ملاصقاً للبشرة مدة كافية ليُحدث فرقاً. هذا هو الجزء الذي يقوم بالعمل الأصعب.',
      },
      {
        title: 'خطوط دقيقة أنعم',
        body: 'الترطيب يملأ سطح البشرة فتبدو الخطوط أقل حدة، وتعكس البشرة الضوء بتساوٍ أكبر. يظهر ذلك فور رفع الورقة.',
      },
    ],
  },
  engine: {
    eyebrow: 'الإسنس',
    title: 'ثمانية عشر بالمئة مرطبات. هذه هي الحيلة كلها.',
    body:
      'معظم الأقنعة الورقية ماء في معظمها مع مواد فعالة تُذكر على الملصق فقط. هذا القناع يضع الجليسرين عند ١٠٫٠٥٪ وبوتيلين جلايكول عند ٨٫٠١٪ - أي أكثر من ثمانية عشر بالمئة من محتوى العبوة - ثم يضيف ما يجعل هذه الرطوبة تبقى. تركيبة غير خجولة ولا تحاول أن تكون كذلك.',
    points: [
      {
        title: 'جليسرين + بوتيلين جلايكول · ١٨٫٠٦٪',
        body: 'المحرك. اثنان من أكثر المرطبات موثوقية في كيمياء التجميل، بنسبة تُحس لا بنسبة تكفي فقط لإدراجهما في قائمة المكونات.',
      },
      {
        title: 'هيالورونات الصوديوم · ٠٫٥٪',
        body: 'الشكل الملحي لحمض الهيالورونيك. أصغر وأكثر ثباتاً من الحمض، فينتشر بالتساوي في الإسنس ويحتفظ بأضعاف وزنه ماءً.',
      },
      {
        title: 'بيتايين ٠٫٨٪ + ألانتوين ٠٫٢٪',
        body: 'الثنائي المهدئ. البيتايين يحافظ على راحة البشرة أثناء امتصاص الماء، والألانتوين يلطف ويهدئ أي تحسس.',
      },
      {
        title: 'الكولاجين المتحلل المائي',
        body: 'الاسم الذي حمله القناع. بروتين مرطب يحتفظ بالماء عند سطح البشرة مباشرة فتبقى ناعمة ومتماسكة الملمس.',
      },
    ],
    figureAlt: 'عبوة قناع GENOSYS Intensive Repair Collagen Mask ومكوناته الأساسية',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'خمس خطوات، خمس عشرة دقيقة.',
    frequency: 'مرتين إلى ثلاث مرات أسبوعياً',
    steps: [
      { title: 'التنظيف', body: 'ابدئي ببشرة نظيفة وجافة. التونر أولاً إن كان من عادتك، لكن القناع لا يحتاجه.' },
      { title: 'الفتح', body: 'أخرجي الورقة من العبوة وافتحيها بعناية. هي مشبعة بسخاء، فافعلي ذلك فوق الحوض.' },
      { title: 'التطبيق', body: 'ضعيها واضغطيها على الخدين والأنف والفك حتى لا تبقى فقاعات هواء. ابتعدي عن العينين والشفتين.' },
      { title: 'الانتظار', body: 'خمس عشرة إلى عشرين دقيقة. لا تتركيها حتى تجف - الورقة الجافة تبدأ باستعادة الرطوبة.' },
      { title: 'التدليك', body: 'ارفعي الورقة ودلّكي الإسنس المتبقي في البشرة. ما تبقى في العبوة يكفي للرقبة واليدين.' },
    ],
    note: 'استخدمي الورقة فور فتح العبوة، ومرة واحدة فقط. لا حاجة للشطف بعدها.',
  },
  actives: {
    eyebrow: 'المكونات',
    title: 'التركيبة كاملة، دون إخفاء.',
    intro:
      'عشرون مكوناً، ويمكنك قراءتها كلها أدناه. المستخلصات النباتية الخمسة تقف إلى جانب المرطبات: سنتيلا آسياتيكا، بندق الساحرة، الجريب فروت، الرمان وفول الصويا.',
    inciTitle: 'قائمة المكونات الكاملة (INCI)',
    inciNote: 'كما هي مطبوعة على العبوة.',
  },
  suited: {
    eyebrow: 'هل يناسبك',
    title: 'إجابة صريحة.',
    forTitle: 'مناسب إذا',
    forList: [
      'كانت بشرتك مشدودة أو باهتة أو جافة وتريدين حلاً الليلة',
      'أردت تغييراً واضحاً في التماسك قبل مناسبة',
      'تركك التكييف أو السفر أو أيام طويلة في الخارج ببشرة متعطشة',
      'استخدمتِ ريتينويد أو حمضاً وتريدين إعادة الراحة للبشرة',
      'كانت بشرتك ناضجة وتريدين ترطيباً يُلاحظ فعلاً',
    ],
    notTitle: 'ابحثي عن غيره إذا',
    notList: [
      'كنت تتجنبين العطور - هذا القناع معطر',
      'كنت تحتاجين علاجاً للزيوت أو البثور، وهذا ليس كذلك',
      'أردت قناعاً مفتحاً - لا يوجد هنا فيتامين C أو نياسيناميد',
      'كنت تبحثين عن خطوة تقشير، وهذا القناع ليس كذلك عن قصد',
    ],
    note: 'أثر من الكحول يحمل المستخلصات النباتية داخل الإسنس. وكل ما عدا ذلك في العبوة موجود لإعادة الماء إلى البشرة.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'مع ماذا تستخدمينه.',
    intro:
      'القناع خطوة وليس روتيناً كاملاً. هذه هي المنتجات التي يقع بينها، ويمكنك إضافة أي منها من هنا.',
    thisProduct: 'هذا المنتج',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الخيارات',
    fromPrice: 'من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء.',
    items: [
      {
        q: 'كم مرة أستخدمه؟',
        a: 'مرتان إلى ثلاث مرات أسبوعياً هي الأمثل. وهو لطيف بما يكفي لأكثر من ذلك إذا مرت بشرتك بأسبوع صعب، ولا يوجد في التركيبة ما يتراكم.',
      },
      {
        q: 'هل أشطف وجهي بعده؟',
        a: 'لا. دلّكي الإسنس المتبقي وتابعي روتينك. وإن استخدمتِه صباحاً، اتبعيه بواقي الشمس كالمعتاد.',
      },
      {
        q: 'هل أتركه طوال الليل؟',
        a: 'لا. حين تبدأ الورقة بالجفاف تعمل بالعكس وتسحب الرطوبة من البشرة. خمس عشرة إلى عشرين دقيقة، ثم أزيليه.',
      },
      {
        q: 'هل هو معطر؟',
        a: 'نعم، بلطف. إن كنت تتجنبين العطور تماماً فهذا ليس القناع المناسب لك، ونفضّل أن نقول ذلك الآن.',
      },
      {
        q: 'هل أستخدمه بعد جلسة علاج أو تقشير؟',
        a: 'اسألي من أجرى الجلسة أولاً. على بشرة مشدودة أو متحسسة فقط، البيتايين والألانتوين هنا هما بالضبط ما تحتاجينه، لكن القرار لمن عمل على وجهك للتو.',
      },
      {
        q: 'هل هو آمن أثناء الحمل؟',
        a: 'لا يوجد في التركيبة ما يرد في قوائم التجنب المعتادة، لكن راجعي طبيبك بدل الاكتفاء بكلامنا.',
      },
      {
        q: 'كيف يبدو ملمس الورقة؟',
        a: 'قماش ناعم غير منسوج، مقصوص ليلتصق بالوجه، ومشبع جداً. يبقى مكانه أثناء الحركة بدل أن ينزلق.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل.',
    rows: [
      { label: 'الشكل', value: 'قناع ورقي غير منسوج للاستخدام مرة واحدة' },
      { label: 'الوزن الصافي', value: '٢٣ جم لكل ورقة' },
      { label: 'عدد الأوراق', value: '١' },
      { label: 'المدة على البشرة', value: '١٥ إلى ٢٠ دقيقة' },
      { label: 'التكرار', value: 'مرتان إلى ٣ مرات أسبوعياً' },
      { label: 'أنواع البشرة', value: 'جميع أنواع البشرة' },
      { label: 'الأس الهيدروجيني', value: 'قريب من المتعادل، ٦٫٥ إلى ٧٫٠' },
      { label: 'الاختبار', value: 'مختبر طبياً' },
      { label: 'بلد المنشأ', value: 'صنع في كوريا بواسطة DTS MG' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'تماسك. ترطيب. إصلاح.',
    body: 'ورقة واحدة، خمس عشرة دقيقة، وبشرة تبدو وكأنها نامت جيداً.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'جميع المنتجات',
}

const RU: CollagenMaskCopy = {
  eyebrow: 'Тканевая маска · Упругость и увлажнение',
  headline: 'Пятнадцать минут до упругой и спокойной кожи.',
  subheadline:
    'Один пропитанный лист, и кожа становится мягкой, эластичной и заметно более упругой. Глицерин и бутиленгликоль составляют более восемнадцати процентов эссенции, то есть влаги здесь действительно много, и её несут гиалуронат натрия, бетаин и аллантоин в полотне, выкроенном так, чтобы плотно лечь на щёки, нос и подбородок.',
  heroBullets: [
    'Кожа выглядит упругой и ощущается эластичной сразу',
    'Более 18% чистой увлажняющей основы - маска по-настоящему влажная',
    'Успокаивает и защищает барьер, а не пересушивает его',
    'Пять растительных экстрактов: центелла, гамамелис, грейпфрут, гранат, соя',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', 'Один лист 23 г', 'Для всех типов кожи'],
  packSize: '1 лист · 23 г',
  usageNote: 'Два-три раза в неделю',
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
    { value: '18%', label: 'Глицерин и бутиленгликоль вместе в эссенции' },
    { value: '15-20 мин', label: 'Один лист от начала до конца' },
    { value: '23 г', label: 'По-настоящему пропитанный лист, а не просто влажный' },
    { value: 'Корея', label: 'Производство DTS MG, владельца марки GENOSYS' },
  ],
  effects: {
    eyebrow: 'Что она делает',
    title: 'Упругость. Спокойствие. Увлажнение. Защита.',
    intro:
      'Четыре вещи - именно то, что обещает упаковка и на что рассчитана формула, за одну процедуру.',
    cards: [
      {
        title: 'Упругая, эластичная кожа',
        body: 'Кожа, наполненная влагой, выглядит иначе. Она кажется подтянутой, ощущается эластичной под пальцами, и разница видна сразу после снятия листа.',
      },
      {
        title: 'Защищённый барьер',
        body: 'В этой формуле нет ничего пересушивающего. Бетаин и аллантоин успокаивают кожу, стянутую солнцем, кондиционером или сильным активом накануне.',
      },
      {
        title: 'Глубокое, удержанное увлажнение',
        body: 'Увлажнители притягивают воду, а полотно удерживает её у кожи достаточно долго, чтобы это имело значение. Именно эта часть маски делает основную работу.',
      },
      {
        title: 'Смягчение тонких линий',
        body: 'Увлажнение наполняет поверхность, тонкие линии читаются менее резко, а кожа ровнее отражает свет. Видно сразу после снятия листа.',
      },
    ],
  },
  engine: {
    eyebrow: 'Эссенция',
    title: 'Восемнадцать процентов увлажнителей. В этом весь секрет.',
    body:
      'Большинство тканевых масок - это в основном вода с активами, упомянутыми только на этикетке. Здесь глицерин на уровне 10,05% и бутиленгликоль на уровне 8,01% - вместе более восемнадцати процентов содержимого саше - а затем добавлено то, что заставляет эту влагу остаться. Формула не робкая и не пытается такой быть.',
    points: [
      {
        title: 'Глицерин + бутиленгликоль · 18,06%',
        body: 'Двигатель. Два самых надёжных увлажнителя в косметической химии, в количестве, которое чувствуется, а не просто позволяет внести их в состав.',
      },
      {
        title: 'Гиалуронат натрия · 0,5%',
        body: 'Солевая форма гиалуроновой кислоты. Меньше и стабильнее самой кислоты, поэтому равномерно расходится в эссенции и удерживает влагу, во много раз превышающую собственный вес.',
      },
      {
        title: 'Бетаин 0,8% + аллантоин 0,2%',
        body: 'Успокаивающая пара. Бетаин сохраняет комфорт кожи, пока она набирает воду, аллантоин смягчает и снимает реактивность.',
      },
      {
        title: 'Гидролизованный коллаген',
        body: 'Ингредиент, давший маске имя. Кондиционирующий белок, который удерживает влагу прямо у поверхности, оставляя кожу гладкой и упругой на ощупь.',
      },
    ],
    figureAlt: 'Саше маски GENOSYS Intensive Repair Collagen Mask и её ключевые ингредиенты',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Пять шагов, пятнадцать минут.',
    frequency: 'Два-три раза в неделю',
    steps: [
      { title: 'Очищение', body: 'Начните с чистой сухой кожи. Тоник по привычке, но маске он не нужен.' },
      { title: 'Разверните', body: 'Достаньте лист из саше и аккуратно расправьте. Он щедро пропитан, так что делайте это над раковиной.' },
      { title: 'Нанесите', body: 'Приложите и прижмите по щекам, носу и подбородку, чтобы не осталось воздушных пузырей. Обходите глаза и губы.' },
      { title: 'Подождите', body: 'Пятнадцать-двадцать минут. Не держите до высыхания - подсыхающий лист начинает забирать влагу обратно.' },
      { title: 'Вбейте остаток', body: 'Снимите лист и вбейте оставшуюся эссенцию в кожу. В саше хватит ещё на шею и руки.' },
    ],
    note: 'Используйте лист сразу после вскрытия саше и только один раз. Смывать не нужно.',
  },
  actives: {
    eyebrow: 'Состав',
    title: 'Полная формула, без умолчаний.',
    intro:
      'Двадцать ингредиентов, и все они перечислены ниже. Пять растительных экстрактов стоят рядом с увлажнителями: центелла азиатская, гамамелис, грейпфрут, гранат и соя.',
    inciTitle: 'Полный состав (INCI)',
    inciNote: 'Так, как напечатано на упаковке.',
  },
  suited: {
    eyebrow: 'Подойдёт ли вам',
    title: 'Честный ответ.',
    forTitle: 'Хороший выбор, если',
    forList: [
      'Кожа стянута, выглядит тускло или обезвожена, и решить это нужно сегодня',
      'Нужна заметная упругость перед событием',
      'Кондиционер, перелёты или долгие дни на улице оставили кожу пересушенной',
      'Вы использовали ретиноид или кислоту и хотите вернуть комфорт',
      'У вас зрелая кожа и нужно увлажнение, которое действительно заметно',
    ],
    notTitle: 'Посмотрите другое, если',
    notList: [
      'Вы избегаете отдушек - эта маска ароматизирована',
      'Нужен уход за жирностью или высыпаниями, а это не он',
      'Нужна осветляющая маска - здесь нет ни витамина C, ни ниацинамида',
      'Вы ищете этап отшелушивания, которым эта маска намеренно не является',
    ],
    note: 'Следовое количество спирта служит носителем растительных экстрактов. Всё остальное в саше работает на то, чтобы вернуть коже воду.',
  },
  routine: {
    eyebrow: 'Дополните уход',
    title: 'С чем её использовать.',
    intro:
      'Маска - это один шаг, а не весь уход. Вот продукты, между которыми она стоит, и любой из них можно добавить прямо здесь.',
    thisProduct: 'Этот продукт',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать вариант',
    fromPrice: 'от',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой.',
    items: [
      {
        q: 'Как часто её использовать?',
        a: 'Два-три раза в неделю - оптимально. Она достаточно мягкая и для более частого применения, если у кожи выдалась тяжёлая неделя, и в формуле нет ничего накапливающегося.',
      },
      {
        q: 'Нужно ли смывать?',
        a: 'Нет. Вбейте остатки эссенции и продолжайте уход. Если используете утром, дальше как обычно наносите санскрин.',
      },
      {
        q: 'Можно оставить на ночь?',
        a: 'Не нужно. Как только лист начинает подсыхать, он работает в обратную сторону и вытягивает влагу из кожи. Пятнадцать-двадцать минут, и снимайте.',
      },
      {
        q: 'Есть ли отдушка?',
        a: 'Да, лёгкая. Если вы полностью избегаете отдушек, эта маска вам не подойдёт, и мы предпочитаем сказать это сразу.',
      },
      {
        q: 'Можно после процедуры или пилинга?',
        a: 'Сначала спросите того, кто проводил процедуру. Просто на стянутой или чувствительной коже бетаин и аллантоин здесь - именно то, что нужно, но решение за специалистом, который только что работал с вашим лицом.',
      },
      {
        q: 'Безопасно ли при беременности?',
        a: 'В формуле нет ничего из обычных списков ограничений, но уточните у врача, а не полагайтесь на наши слова.',
      },
      {
        q: 'Какое полотно на ощупь?',
        a: 'Мягкий нетканый материал, выкроенный под лицо, и очень влажный. Держится на месте при движении, а не сползает.',
      },
    ],
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Подробности.',
    rows: [
      { label: 'Формат', value: 'Одноразовая тканевая маска из нетканого материала' },
      { label: 'Масса нетто', value: '23 г на лист' },
      { label: 'Листов в упаковке', value: '1' },
      { label: 'Время на коже', value: '15-20 минут' },
      { label: 'Частота', value: '2-3 раза в неделю' },
      { label: 'Типы кожи', value: 'Все типы кожи' },
      { label: 'pH', value: 'Близкий к нейтральному, 6,5-7,0' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Упругость. Увлажнение. Восстановление.',
    body: 'Один лист, пятнадцать минут, и кожа выглядит так, будто наконец выспалась.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const BY_LOCALE: Record<CollagenMaskLocale, CollagenMaskCopy> = { en: EN, ar: AR, ru: RU }

export function getCollagenMaskCopy(locale: string): CollagenMaskCopy {
  return BY_LOCALE[(locale as CollagenMaskLocale) ?? 'en'] ?? EN
}
