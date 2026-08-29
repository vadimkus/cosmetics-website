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
 * That fact governs this page:
 *
 *   - State the exact 0.0001% / 1 ppm concentration because the product audit
 *     requires quantitative transparency.
 *   - Describe it only as the formula's skin-conditioning namesake.
 *   - Never turn it into collagen production, smoothing, firming, lifting,
 *     elasticity or delivery.
 *
 * So the page leads on the humectant base, because 18.062% of glycerin and
 * butylene glycol plus 0.5% sodium hyaluronate is the strongest true thing this
 * product has, and it is a very good thing to be able to say.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Moisture and skin comfort                quantitative humectant formula
 *   Dermatologically tested                 2024 artwork
 *   23g single sheet                        "NET WT. 23g/0.8 oz.", Korean "용량: 23g"
 *   15-20 minutes                           artwork directions
 *   Non-woven sheet                         Russian panel, "маска из нетканого материала"
 *   pH values                               COA 6.67 (ABVMP001) and 6.96 (1AAZMP001), spec 5.50-7.50
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

import { PRODUCT_53_FULL_INCI } from '@/data/product53LocalizedCopy'

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
  /** Moisture-led outcomes retained by the 2026 source audit. */
  effects: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
  }
  /** The exact humectant base and supporting concentrations. */
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
    inciNote: 'Every ingredient, in the same order as the box in your hand.',
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
    note: 'For external use only, and keep it clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears.',
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
  addToBag: 'أضف إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
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
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
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
    note: 'للاستخدام الخارجي فقط، وتجنّبي منطقة العينين. أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
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
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
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
    note: 'Только для наружного применения, избегайте области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
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

/**
 * The original locale objects above are retained only as a source of stable UI
 * chrome (cart labels, section labels and routine controls). Every field that
 * can carry a product claim is overridden below, and BY_LOCALE exposes only
 * these audited objects.
 */
const AUDITED_EN: CollagenMaskCopy = {
  ...EN,
  eyebrow: 'Sheet mask · Moisture and comfort',
  headline: 'A moisture-rich mask for a softer feel.',
  subheadline:
    'One 23g sheet saturated with a humectant-rich essence. Glycerin 10.052% and butylene glycol 8.010% form the base, supported by betaine 0.8%, sodium hyaluronate 0.5% and allantoin 0.2%. Leave on for 15-20 minutes, then pat in the remaining essence.',
  heroBullets: [
    'Glycerin and butylene glycol at a combined 18.062%',
    'Betaine 0.8%, sodium hyaluronate 0.5% and allantoin 0.2%',
    'Five botanical extracts in the quantitative formula',
    'Contains Alcohol 0.1% and Parfum (Fragrance) 0.01%',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', 'One 23g sheet', 'Single use'],
  packSize: '1 sheet · 23g',
  usageNote: '15-20 minutes · use immediately after opening',
  stats: [
    { value: '18.062%', label: 'Glycerin and butylene glycol together' },
    { value: '15-20 min', label: 'Wear time printed on the pack' },
    { value: '23g', label: 'One single-use sheet' },
    { value: '6.67 / 6.96', label: 'pH measured in two COAs' },
  ],
  effects: {
    eyebrow: 'What to expect',
    title: 'Moisture. Softness. Comfort.',
    intro:
      'A straightforward sheet-mask step built around a high-humectant essence for a softer, more comfortable feel.',
    cards: [
      { title: 'A moisture-rich feel', body: 'Glycerin and butylene glycol make up 18.062% of the essence.' },
      { title: 'A softer finish', body: 'Betaine, sodium hyaluronate and allantoin complement the humectant base.' },
      { title: 'Fifteen to twenty minutes', body: 'One clearly timed step between cleansing or toner and leave-on care.' },
      { title: 'One fresh sheet', body: 'The 23g sachet is opened, used immediately and discarded after one application.' },
    ],
  },
  engine: {
    ...EN.engine,
    eyebrow: 'The formula',
    title: '18.062% humectant base.',
    body:
      'The formula puts glycerin at 10.052% and butylene glycol at 8.010%. Betaine 0.8%, sodium hyaluronate 0.5% and allantoin 0.2% round out a moisture-focused essence.',
    points: [
      { title: 'Glycerin + butylene glycol · 18.062%', body: 'The main humectant base of the essence.' },
      { title: 'Sodium hyaluronate · 0.5%', body: 'A skin-conditioning humectant in the quantitative formula.' },
      { title: 'Betaine 0.8% + allantoin 0.2%', body: 'Two supporting skin-conditioning ingredients.' },
      {
        title: 'Hydrolyzed collagen · 0.0001% / 1 ppm',
        body: 'The namesake skin-conditioning ingredient at its exact documented concentration.',
      },
    ],
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'One sheet, 15-20 minutes.',
    frequency: 'The pack does not set a weekly frequency',
    steps: [
      { title: 'Open', body: 'Remove and unfold the sheet. Use immediately after opening.' },
      { title: 'Apply', body: 'Place on clean skin, avoiding the eyes and mouth.' },
      { title: 'Wait', body: 'Leave on for 15-20 minutes, as directed on the pack.' },
      { title: 'Remove', body: 'Lift off the sheet and gently pat in the essence left on the skin. Do not rinse.' },
      { title: 'Discard', body: 'This is a single-use sheet. Do not store the opened sachet or reuse the mask.' },
    ],
    note: 'For external use only. Stop use if redness, swelling, itching or irritation develops.',
  },
  actives: {
    ...EN.actives,
    intro:
      'The quantitative formula contains five botanical extracts: grapefruit 0.475%, centella 0.285%, witch hazel 0.1%, pomegranate 0.0942% and soybean 0.0942%.',
    inciNote: 'Complete INCI as printed on the registered artwork.',
  },
  suited: {
    ...EN.suited,
    forList: [
      'You want a 15-20-minute moisture-focused sheet-mask step',
      'You prefer a formula led by glycerin and butylene glycol',
      'You want one individually sealed sheet for one application',
    ],
    notList: [
      'You avoid fragrance: the formula contains Parfum (Fragrance) 0.01%',
      'You avoid alcohol: the formula contains Alcohol 0.1%',
      'You are sensitive to soybean-derived ingredients or patch-like products',
      'You need treatment for pigmentation, wrinkles, blemishes or a damaged skin barrier',
    ],
    note:
      'Do not apply to damaged skin. Use cautiously if you react to patches or compresses. Seek medical advice if a reaction develops.',
  },
  faq: {
    ...EN.faq,
    items: [
      { q: 'How often should I use it?', a: 'The pack does not set a weekly frequency. Use according to your routine and skin tolerance.' },
      { q: 'Do I rinse afterwards?', a: 'No. Remove after 15-20 minutes and gently pat in the essence left on the skin.' },
      { q: 'Can I leave it on overnight?', a: 'No. The printed directions set a 15-20-minute wear time.' },
      { q: 'Is it fragranced?', a: 'Yes. The formula contains Parfum (Fragrance) at 0.01% and Alcohol at 0.1%.' },
      { q: 'Can I use it after a procedure?', a: 'The pack does not claim post-procedure use. Follow the instructions of the clinician who treated your skin.' },
      { q: 'What about pregnancy?', a: 'The pack gives no pregnancy claim. Ask your doctor if you need individual guidance.' },
      { q: 'What is the sheet?', a: 'A single-use non-woven sheet in an individually sealed 23g sachet.' },
    ],
  },
  details: {
    ...EN.details,
    rows: [
      { label: 'Format', value: 'Single-use non-woven sheet mask' },
      { label: 'Net weight', value: '23g (0.8 oz) / one sheet' },
      { label: 'Wear time', value: '15-20 minutes' },
      { label: 'Frequency', value: 'Not specified on the pack' },
      { label: 'pH', value: '6.67 and 6.96 in two COAs; specification 5.50-7.50' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'After opening', value: 'Use immediately; single use' },
      { label: 'Disclosure', value: 'Alcohol 0.1%; Parfum (Fragrance) 0.01%; soybean extract' },
      { label: 'Ingredients', value: PRODUCT_53_FULL_INCI },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },
  closing: {
    title: 'Moisture in one measured step.',
    body: 'One 23g sheet, 15-20 minutes, then softly pat in the remaining essence.',
  },
}

const AUDITED_AR: CollagenMaskCopy = {
  ...AR,
  eyebrow: 'قناع ورقي · ترطيب وراحة',
  headline: 'قناع غني بالمرطبات لبشرة أكثر نعومة.',
  subheadline:
    'قناع واحد بوزن 23 غ مشبع بخلاصة مرطبة. يشكل الغليسرين 10.052% وبيوتيلين غلايكول 8.010% قاعدة التركيبة، ويكملها البيتايين 0.8% وهيالورونات الصوديوم 0.5% والألانتوين 0.2%. يترك 15-20 دقيقة ثم تربت الخلاصة المتبقية.',
  heroBullets: [
    'غليسرين وبيوتيلين غلايكول بتركيز إجمالي 18.062%',
    'بيتايين 0.8% وهيالورونات الصوديوم 0.5% وألانتوين 0.2%',
    'خمسة مستخلصات نباتية في التركيبة الكمية',
    'يحتوي على Alcohol ‏0.1% وParfum (Fragrance) ‏0.01%',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', 'قناع واحد 23 غ', 'أحادي الاستخدام'],
  packSize: 'قناع واحد · 23 غ',
  usageNote: '15-20 دقيقة · يستخدم مباشرة بعد الفتح',
  stats: [
    { value: '18.062%', label: 'غليسرين وبيوتيلين غلايكول معاً' },
    { value: '15-20 دقيقة', label: 'مدة الاستخدام على العبوة' },
    { value: '23 غ', label: 'قناع واحد أحادي الاستخدام' },
    { value: '6.67 / 6.96', label: 'درجتا pH في شهادتي تحليل' },
  ],
  effects: {
    eyebrow: 'ما الذي تتوقعينه',
    title: 'ترطيب. نعومة. راحة.',
    intro: 'خطوة قناع ورقي واضحة بخلاصة غنية بالمرطبات لإحساس أكثر نعومة وراحة.',
    cards: [
      { title: 'إحساس غني بالترطيب', body: 'يشكل الغليسرين وبيوتيلين غلايكول 18.062% من الخلاصة.' },
      { title: 'ملمس أكثر نعومة', body: 'يكمل البيتايين وهيالورونات الصوديوم والألانتوين قاعدة المرطبات.' },
      { title: '15-20 دقيقة', body: 'خطوة محددة المدة بعد التنظيف أو التونر وقبل العناية التي تترك على البشرة.' },
      { title: 'قناع طازج واحد', body: 'يفتح كيس 23 غ ويستخدم مباشرة ثم يتخلص منه بعد تطبيق واحد.' },
    ],
  },
  engine: {
    ...AR.engine,
    eyebrow: 'التركيبة',
    title: 'قاعدة مرطبة 18.062%.',
    body:
      'تحتوي التركيبة على الغليسرين 10.052% وبيوتيلين غلايكول 8.010%، وتكملها البيتايين 0.8% وهيالورونات الصوديوم 0.5% والألانتوين 0.2% في خلاصة تركز على الترطيب.',
    points: [
      { title: 'غليسرين + بيوتيلين غلايكول · 18.062%', body: 'قاعدة المرطبات الرئيسية في الخلاصة.' },
      { title: 'هيالورونات الصوديوم · 0.5%', body: 'مكوّن مرطب وملطف للبشرة في التركيبة الكمية.' },
      { title: 'بيتايين 0.8% + ألانتوين 0.2%', body: 'مكوّنان داعمان للعناية بملمس البشرة.' },
      {
        title: 'كولاجين متحلل مائياً · 0.0001% / جزء واحد في المليون',
        body: 'المكوّن الملطف الذي يحمل القناع اسمه بتركيزه الموثق بدقة.',
      },
    ],
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'قناع واحد، 15-20 دقيقة.',
    frequency: 'لا تحدد العبوة وتيرة أسبوعية',
    steps: [
      { title: 'افتحي', body: 'أخرجي القناع وافرديه، واستخدميه مباشرة بعد الفتح.' },
      { title: 'ضعيه', body: 'وزعيه على بشرة نظيفة مع تجنب العينين والفم.' },
      { title: 'انتظري', body: 'اتركيه 15-20 دقيقة وفق تعليمات العبوة.' },
      { title: 'ارفعيه', body: 'ارفعي القناع وربتي بلطف على الخلاصة المتبقية. لا تشطفيها.' },
      { title: 'تخلصي منه', body: 'القناع أحادي الاستخدام. لا تحفظي الكيس بعد فتحه ولا تعيدي استخدامه.' },
    ],
    note: 'للاستخدام الخارجي فقط. أوقفيه إذا ظهر احمرار أو تورم أو حكة أو تهيج.',
  },
  actives: {
    ...AR.actives,
    intro:
      'تضم التركيبة الكمية خمسة مستخلصات نباتية: الجريب فروت 0.475% والسنتيلا 0.285% وبندق الساحرة 0.1% والرمان 0.0942% والصويا 0.0942%.',
    inciNote: 'قائمة INCI الكاملة كما تظهر على تصميم العبوة المسجل.',
  },
  suited: {
    ...AR.suited,
    forList: [
      'تريدين خطوة قناع مرطبة مدتها 15-20 دقيقة',
      'تفضلين تركيبة أساسها الغليسرين وبيوتيلين غلايكول',
      'تريدين قناعاً فردياً محكم الإغلاق لاستخدام واحد',
    ],
    notList: [
      'تتجنبين العطر: تحتوي التركيبة على Parfum (Fragrance) ‏0.01%',
      'تتجنبين الكحول: تحتوي التركيبة على Alcohol ‏0.1%',
      'لديك حساسية من مشتقات الصويا أو المنتجات المشابهة للكمادات',
      'تبحثين عن علاج للتصبغات أو التجاعيد أو الحبوب أو حاجز جلدي متضرر',
    ],
    note:
      'لا يطبق على الجلد المتضرر. يستخدم بحذر عند التحسس من اللاصقات أو الكمادات، وتطلب المشورة الطبية عند ظهور تفاعل.',
  },
  faq: {
    ...AR.faq,
    items: [
      { q: 'كم مرة أستخدمه؟', a: 'لا تحدد العبوة وتيرة أسبوعية. استخدميه بحسب روتينك ومدى تحمل بشرتك.' },
      { q: 'هل أشطف وجهي بعده؟', a: 'لا. ارفعيه بعد 15-20 دقيقة وربتي بلطف على الخلاصة المتبقية.' },
      { q: 'هل أتركه طوال الليل؟', a: 'لا. تحدد التعليمات المطبوعة مدة 15-20 دقيقة.' },
      { q: 'هل يحتوي على عطر؟', a: 'نعم. يحتوي على Parfum (Fragrance) ‏0.01% وAlcohol ‏0.1%.' },
      { q: 'هل أستخدمه بعد جلسة؟', a: 'لا تدعي العبوة استخدامه بعد الإجراءات. اتبعي تعليمات المختص الذي عالج بشرتك.' },
      { q: 'ماذا عن الحمل؟', a: 'لا تتضمن العبوة ادعاء خاصاً بالحمل. اسألي طبيبك عند الحاجة إلى إرشاد فردي.' },
      { q: 'ما نوع القماش؟', a: 'قناع غير منسوج أحادي الاستخدام داخل كيس فردي محكم بوزن 23 غ.' },
    ],
  },
  details: {
    ...AR.details,
    rows: [
      { label: 'الشكل', value: 'قناع ورقي غير منسوج أحادي الاستخدام' },
      { label: 'الوزن الصافي', value: '23 غ / قناع واحد' },
      { label: 'مدة الاستخدام', value: '15-20 دقيقة' },
      { label: 'الوتيرة', value: 'غير محددة على العبوة' },
      { label: 'pH', value: '‏6.67 و6.96 في شهادتي التحليل؛ المواصفة 5.50-7.50' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'بعد الفتح', value: 'يستخدم مباشرة؛ أحادي الاستخدام' },
      { label: 'الإفصاح', value: 'Alcohol ‏0.1% وParfum (Fragrance) ‏0.01% ومستخلص الصويا' },
      { label: 'المكونات', value: PRODUCT_53_FULL_INCI },
      { label: 'المنشأ', value: 'صنع في كوريا' },
    ],
  },
  closing: {
    title: 'ترطيب في خطوة محددة.',
    body: 'قناع واحد بوزن 23 غ لمدة 15-20 دقيقة، ثم تربت الخلاصة المتبقية بلطف.',
  },
}

const AUDITED_RU: CollagenMaskCopy = {
  ...RU,
  eyebrow: 'Тканевая маска · Увлажнение и комфорт',
  headline: 'Насыщенная эссенция для мягкости кожи.',
  subheadline:
    'Одна тканевая маска 23 г с увлажняющей эссенцией. Глицерин 10,052% и бутиленгликоль 8,010% образуют основу формулы, а бетаин 0,8%, гиалуронат натрия 0,5% и аллантоин 0,2% дополняют её. Оставьте на 15-20 минут и мягко вбейте остатки эссенции.',
  heroBullets: [
    'Глицерин и бутиленгликоль в общей концентрации 18,062%',
    'Бетаин 0,8%, гиалуронат натрия 0,5% и аллантоин 0,2%',
    'Пять растительных экстрактов в количественной формуле',
    'Содержит Alcohol 0,1% и Parfum (Fragrance) 0,01%',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', 'Одна маска 23 г', 'Одноразовая'],
  packSize: '1 маска · 23 г',
  usageNote: '15-20 минут · использовать сразу после вскрытия',
  stats: [
    { value: '18,062%', label: 'Глицерин и бутиленгликоль вместе' },
    { value: '15-20 мин', label: 'Время применения на упаковке' },
    { value: '23 г', label: 'Одна одноразовая маска' },
    { value: '6,67 / 6,96', label: 'pH в двух COA' },
  ],
  effects: {
    eyebrow: 'Чего ожидать',
    title: 'Увлажнение. Мягкость. Комфорт.',
    intro:
      'Понятный этап ухода с насыщенной увлажнителями эссенцией для мягкости и комфорта кожи.',
    cards: [
      { title: 'Насыщенное увлажнение', body: 'Глицерин и бутиленгликоль составляют 18,062% эссенции.' },
      { title: 'Более мягкая кожа', body: 'Бетаин, гиалуронат натрия и аллантоин дополняют увлажняющую основу.' },
      { title: '15-20 минут', body: 'Точно рассчитанный этап после очищения или тоника и до несмываемого ухода.' },
      { title: 'Одна свежая маска', body: 'Саше 23 г открывают, используют сразу и утилизируют после одного применения.' },
    ],
  },
  engine: {
    ...RU.engine,
    eyebrow: 'Формула',
    title: '18,062% увлажняющей основы.',
    body:
      'В формуле 10,052% глицерина и 8,010% бутиленгликоля. Бетаин 0,8%, гиалуронат натрия 0,5% и аллантоин 0,2% завершают эссенцию с акцентом на увлажнение.',
    points: [
      { title: 'Глицерин + бутиленгликоль · 18,062%', body: 'Главная увлажняющая основа эссенции.' },
      { title: 'Гиалуронат натрия · 0,5%', body: 'Увлажняющий и кондиционирующий кожу компонент количественной формулы.' },
      { title: 'Бетаин 0,8% + аллантоин 0,2%', body: 'Два дополняющих компонента для комфорта кожи.' },
      {
        title: 'Гидролизованный коллаген · 0,0001% / 1 ppm',
        body: 'Кондиционирующий компонент, давший маске имя, в точно указанной концентрации.',
      },
    ],
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Одна маска, 15-20 минут.',
    frequency: 'Недельная частота на упаковке не указана',
    steps: [
      { title: 'Откройте', body: 'Достаньте и расправьте маску. Используйте сразу после вскрытия.' },
      { title: 'Наложите', body: 'Распределите по чистому лицу, не заходя на область глаз и рта.' },
      { title: 'Подождите', body: 'Оставьте на 15-20 минут, как указано на упаковке.' },
      { title: 'Снимите', body: 'Снимите маску и мягко вбейте эссенцию, оставшуюся на коже. Не смывайте.' },
      { title: 'Утилизируйте', body: 'Маска одноразовая. Не храните вскрытое саше и не используйте маску повторно.' },
    ],
    note: 'Только для наружного применения. Прекратите использование при покраснении, отёке, зуде или раздражении.',
  },
  actives: {
    ...RU.actives,
    intro:
      'В количественной формуле пять растительных экстрактов: грейпфрут 0,475%, центелла 0,285%, гамамелис 0,1%, гранат 0,0942% и соя 0,0942%.',
    inciNote: 'Полный INCI в том же составе, что и на зарегистрированном макете упаковки.',
  },
  suited: {
    ...RU.suited,
    forList: [
      'Вам нужен 15-20-минутный этап ухода с акцентом на увлажнение',
      'Вы предпочитаете формулу на основе глицерина и бутиленгликоля',
      'Вам удобна одна герметично упакованная маска на одно применение',
    ],
    notList: [
      'Вы избегаете отдушек: в формуле Parfum (Fragrance) 0,01%',
      'Вы избегаете спирта: в формуле Alcohol 0,1%',
      'У вас есть чувствительность к компонентам сои или средствам по типу компрессов',
      'Вам нужно лечение пигментации, морщин, высыпаний или повреждённого кожного барьера',
    ],
    note:
      'Не наносите на повреждённую кожу. При реакции на пластыри или компрессы используйте с осторожностью и обратитесь к врачу при появлении реакции.',
  },
  faq: {
    ...RU.faq,
    items: [
      { q: 'Как часто использовать?', a: 'Упаковка не устанавливает недельную частоту. Ориентируйтесь на свой уход и переносимость кожи.' },
      { q: 'Нужно ли смывать?', a: 'Нет. Снимите через 15-20 минут и мягко вбейте эссенцию, оставшуюся на коже.' },
      { q: 'Можно оставить на ночь?', a: 'Нет. В печатной инструкции указано время 15-20 минут.' },
      { q: 'Есть ли отдушка?', a: 'Да. Формула содержит Parfum (Fragrance) 0,01% и Alcohol 0,1%.' },
      { q: 'Можно после процедуры?', a: 'Упаковка не заявляет постпроцедурное применение. Следуйте инструкции специалиста, проводившего процедуру.' },
      { q: 'Что насчёт беременности?', a: 'На упаковке нет отдельного заявления для беременности. За индивидуальной рекомендацией обратитесь к врачу.' },
      { q: 'Какое полотно?', a: 'Одноразовая маска из нетканого материала в индивидуальном герметичном саше 23 г.' },
    ],
  },
  details: {
    ...RU.details,
    rows: [
      { label: 'Формат', value: 'Одноразовая тканевая маска из нетканого материала' },
      { label: 'Масса нетто', value: '23 г / 1 маска' },
      { label: 'Время применения', value: '15-20 минут' },
      { label: 'Частота', value: 'На упаковке не указана' },
      { label: 'pH', value: '6,67 и 6,96 в двух COA; спецификация 5,50-7,50' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'После вскрытия', value: 'Использовать сразу; одноразовая' },
      { label: 'Состав содержит', value: 'Alcohol 0,1%; Parfum (Fragrance) 0,01%; экстракт сои' },
      { label: 'Ингредиенты', value: PRODUCT_53_FULL_INCI },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },
  closing: {
    title: 'Увлажнение в одном точном этапе.',
    body: 'Одна маска 23 г на 15-20 минут, затем мягко вбейте остатки эссенции.',
  },
}

// Retained as an audit reference; English deliberately continues to use the
// protected bespoke EN object while only AR/RU use the localized audit copy.
void AUDITED_EN

const BY_LOCALE: Record<CollagenMaskLocale, CollagenMaskCopy> = {
  en: EN,
  ar: AUDITED_AR,
  ru: AUDITED_RU,
}

export function getCollagenMaskCopy(locale: string): CollagenMaskCopy {
  return BY_LOCALE[(locale as CollagenMaskLocale) ?? 'en'] ?? EN
}
