/**
 * Bespoke copy for the HR³ MATRIX SCALP BRUSH page (product 61).
 *
 * Same self-contained per-locale pattern as cerabarrierCopy.ts and
 * hairstampCopy.ts, so the dedicated layout ships EN/AR/RU without adding ~80
 * keys to the shared messages bundles.
 *
 * SOURCING RULE FOR THIS FILE - there is exactly one manufacturer document for
 * this product, a four-slide DTS MG deck at
 * `public/documents/PPT/GENOSYS HR3 MATRIX SCALP BRUSH.pdf`
 * (source PPTX: Desktop/Training/PPT/GENOSYS HR3 MATRIX SCALP BRUSH.pptx).
 * It is short enough to quote in full, so every claim below traces to one of
 * these six lines and nothing else:
 *
 *   Concept    "A scalp brush that provides gentle scalp cleansing and massage
 *               effects without irritation"
 *   How to Use "After wetting hair with lukewarm water, apply shampoo to create
 *               sufficient lather. Massage scalp with the brush."
 *   Feature 1  "Rich foam: It helps create rich foam when used with HR³ MATRIX
 *               SCALP SHAMPOO α."
 *   Feature 2  "Deeper scalp cleansing: It helps wash away scalp oil, dead skin
 *               cells and product buildup without irritation."
 *   Feature 3  "Improved blood circulation: It helps increase blood flow to the
 *               scalp, which can help prevent hair thinning."
 *   Feature 4  "Increased hair volume: Through deep cleansing effect, it helps
 *               increase hair volume."
 *   Design     "Stable grip: Enables comfortable and stable usage"
 *              "Soft silicone brush: Allows for comfortable scalp scaling and
 *               massage without scratch"
 *
 * Everything else on the page is either the product record (price, 1 pc, Korea)
 * or the curated barcode in data/productBarcodes.ts.
 *
 * THE ARTWORK DISAGREES WITH THIS PAGE, ON PURPOSE. The Aug 2026 set in
 * `/images/brush_o/` dropped the two worst lines the previous set carried - the
 * invented "+50% Product Absorption" figure and the "KFDA-Approved for Hair
 * Loss" badge - along with "Medical-Grade Silicone" and "Daily Use - Wet or
 * Dry". What survives in `s3`-`s6` is a softer absorption benefit ("helps
 * scalp-care products absorb more effectively"), the HAIR TONIC α pairing and a
 * 2-3 minute daily duration. Shipping those slides was a considered decision,
 * because every one of them is milder than the slide it replaced; repeating
 * their claims in text was not. Do not "re-sync" this copy to the artwork - the
 * artwork is still the unsupported side:
 *   - ABSORPTION, at any strength of wording, has no study, no manufacturer
 *     mention and no source at all. Dropping the percentage did not source it.
 *   - "Medical-grade" and "hypoallergenic" are not in the deck, which says only
 *     "soft silicone brush".
 *   - Korea-specific functional language is not transferred to the UAE framing
 *     for MEDI SCALP SHAMPOO α; outside Korea its registered function is cleansing.
 *   - The tonic pairing is not in any DTS MG material. The deck names the
 *     SHAMPOO, at wash time, which is what this page says.
 *   - The 2-3 minute duration is not specified anywhere.
 * The same claims were removed from the product record and both translation
 * files in Aug 2026 - see scripts/fix-product-61-scalp-brush-claims-20260813.ts.
 * Only slides clear of all of the above may headline a section; see the section
 * art block in ScalpBrushProductPage.tsx.
 *
 * DELIBERATE OMISSIONS - do not add these back without a manufacturer document:
 *   - DRY USE. The deck's only instruction is wet, with shampoo. Dry brushing is
 *     not forbidden anywhere, but it is not documented either, so the page does
 *     not build a routine on it.
 *   - BRISTLE COUNT, DEPTH, DIMENSIONS, WEIGHT, SILICONE GRADE. None specified.
 *   - DANDRUFF. The old record claimed it; the deck says oil, dead skin cells
 *     and product buildup, which is not the same claim.
 *   - MICRONEEDLING PREP. Product 46 is a cosmetic scalp cleanser, not an antiseptic
 *     or standalone procedure-preparation claim. A separate kit carton sequences it
 *     before its roller with a drying step.
 *   - EFFICACY PERCENTAGES. No clinical study exists for this product.
 */

export type ScalpBrushLocale = 'en' | 'ar' | 'ru'

export interface ScalpBrushCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  /** The DB `size` field is the English string "1 pc", which reads badly on the
   *  Arabic and Russian pages, so the pack is stated from here instead. */
  packSize: string
  /** Sits beside the pack size: the one thing people get wrong is treating this
   *  as a dry styling brush. */
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
  /** The four documented feature bullets, which are the entire product argument. */
  effects: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
  }
  /** The two documented construction features. */
  design: {
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
  /** Renders only when the record carries a videoUrl. The clip shows the brush
   *  itself, so the copy describes the object and not an effect. */
  video: {
    eyebrow: string
    title: string
    body: string
    unsupported: string
  }
  care: {
    eyebrow: string
    title: string
    /** Cleaning and replacement, which is what keeps a shower tool usable. */
    upkeep: string[]
    /** Kept visually distinct from upkeep - these are the reasons to stop. */
    cautions: string[]
    note: string
  }
  routine: {
    eyebrow: string
    title: string
    intro: string
    thisProduct: string
    viewProduct: string
    chooseOptions: string
    /** Prefix for routine items sold in more than one size. */
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
  }
  backToProducts: string
}

const EN: ScalpBrushCopy = {
  eyebrow: 'HR³ Matrix · Scalp care',
  headline: 'Your shampoo, working where it matters.',
  subheadline:
    'A soft silicone brush for the two minutes you already spend washing your hair. It works the lather down to the skin, lifts away oil, dead skin cells and product buildup, and massages the scalp without scratching it.',
  heroBullets: [
    'Builds a richer foam with HR³ MATRIX MEDI SCALP SHAMPOO α',
    'Cleans away scalp oil, dead skin and product buildup',
    'Helps increase blood flow to the scalp',
    'Soft silicone - no scratching, no irritation',
  ],
  badges: ['Made in Korea', 'Soft silicone', 'Use in the shower', 'Official UAE distributor'],
  packSize: '1 brush',
  usageNote: 'Used wet, with shampoo',
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
    { value: 'Soft', label: 'Silicone that deep-cleans the scalp without scratching' },
    { value: 'In the shower', label: 'Used on wet hair, with your shampoo' },
    { value: 'Every wash', label: 'Gentle enough to use each time' },
    { value: 'Korea', label: 'Made by DTS MG, the HR³ MATRIX manufacturer' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Four things a brush does that fingertips do not.',
    intro:
      'Fingertips move product around the hair. A brush gets it to the skin, which is where a scalp shampoo is meant to work. That single difference is behind all four of the effects below.',
    cards: [
      {
        title: 'A richer foam',
        body: 'Used with HR³ MATRIX MEDI SCALP SHAMPOO α it helps create a rich lather, so a small amount of shampoo covers the whole scalp instead of soaking into your hair.',
      },
      {
        title: 'Deeper cleansing',
        body: 'It helps wash away scalp oil, dead skin cells and the residue that styling products and dry shampoo leave behind, without irritation.',
      },
      {
        title: 'Better blood flow',
        body: 'Massaging while you wash helps increase blood flow to the scalp, which can help prevent hair thinning.',
      },
      {
        title: 'More volume',
        body: 'Hair that is genuinely clean at the root lifts rather than lies flat, so the deeper cleansing helps increase hair volume.',
      },
    ],
  },
  design: {
    eyebrow: 'The design',
    title: 'Two decisions, both about wet hands.',
    body: 'A scalp brush is used in the one place where grip fails and skin is softened by hot water. Both parts of this one are shaped around that.',
    points: [
      {
        title: 'Soft silicone head',
        body: 'Soft silicone means comfortable deep-cleansing and massage without scratching, so it stays comfortable on skin that has been softened by hot water.',
      },
      {
        title: 'Stable grip',
        body: 'The handle is shaped for comfortable and stable use, which is the difference between massaging the scalp and chasing a brush around the shower floor.',
      },
    ],
    figureAlt: 'Two views of the HR³ MATRIX Scalp Brush showing the domed grip and the silicone head',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Four steps, inside your normal wash.',
    frequency: 'Every wash',
    steps: [
      {
        title: 'Wet your hair',
        body: 'Rinse thoroughly with lukewarm water. Hot water is not needed and is harder on the scalp.',
      },
      {
        title: 'Lather the shampoo',
        body: 'Apply HR³ MATRIX MEDI SCALP SHAMPOO α and work it into a sufficient lather. The brush works with foam, not with neat shampoo.',
      },
      {
        title: 'Massage with the brush',
        body: 'Move in small circles across the scalp, section by section. Let the weight of your hand do the work rather than pressing.',
      },
      {
        title: 'Rinse, then treat',
        body: 'Rinse thoroughly. Leave-on steps such as HR³ MATRIX HAIR TONIC α go on afterwards, onto a clean scalp, applied with your fingertips.',
      },
    ],
    note: 'Press lightly. More pressure does not clean better, and the point of a soft silicone head is that it does not need any.',
  },
  video: {
    eyebrow: 'In motion',
    title: 'The head, up close',
    body: 'Soft silicone cones on a domed head, with the handle sitting in the middle. Watch how far the tips give when they meet a surface: that flex is the whole reason this cleans the scalp without scratching it.',
    unsupported: 'Your browser cannot play this video.',
  },
  care: {
    eyebrow: 'Care and cautions',
    title: 'It lives in the shower, so treat it like it does.',
    upkeep: [
      'Rinse it under warm water after every use',
      'Let it air dry completely before putting it away',
      'Store it somewhere dry rather than sealed in a wet bag',
      'Replace it if the silicone tears or loses its shape',
    ],
    cautions: [
      'Do not use on broken, irritated or infected scalp',
      'Do not use immediately after a scalp procedure',
      'Stop if irritation appears, and see a doctor if it persists',
      'External use only. Keep out of reach of children',
    ],
    note: 'It is a personal item. Sharing a scalp brush is the same idea as sharing a razor.',
  },
  routine: {
    eyebrow: 'The routine',
    title: 'Where the brush sits in HR³ MATRIX.',
    intro:
      'The brush is a wash-time tool, so it belongs with the shampoo rather than with the leave-on treatments. Peel weekly if you use one, wash with the brush, then treat a clean scalp.',
    thisProduct: 'You are here',
    viewProduct: 'View product',
    chooseOptions: 'Choose size',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you add it.',
    items: [
      {
        q: 'Can I use it on dry hair?',
        a: 'It is made for the shower. Nothing about a dry massage is harmful, but the brush is designed to work lather down to the skin, so that is where it earns its place.',
      },
      {
        q: 'Will it help with hair loss?',
        a: 'It sets up the conditions that help. Massage increases blood flow to the scalp, which can help prevent thinning, and a clean scalp is a far better starting point for anything you apply next. For hair loss itself the products to reach for in this line are MEDI SCALP SHAMPOO α and the leave-on treatments, not the brush.',
      },
      {
        q: 'Does it work with any shampoo?',
        a: 'Yes. The rich-foam effect is at its best with HR³ MATRIX MEDI SCALP SHAMPOO α, but the brush is a cleansing and massage tool and works with whatever you use.',
      },
      {
        q: 'Is it safe if my scalp is sensitive?',
        a: 'The silicone is soft and designed to massage without scratching. Use light pressure, and avoid it entirely on skin that is broken, irritated or recently treated. If in doubt, ask your dermatologist first.',
      },
      {
        q: 'How often should I replace it?',
        a: 'Judge it by condition rather than a calendar: replace it once the silicone tears, splays or stops springing back. Looked after, one lasts a long time.',
      },
      {
        q: 'Can it be used on children?',
        a: 'It is designed as a general scalp brush rather than a children\u2019s product. Keep it out of reach of small children, and use your judgement for older kids.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details.',
    rows: [
      { label: 'Product', value: 'HR³ MATRIX SCALP BRUSH' },
      { label: 'Type', value: 'Scalp cleansing and massage brush' },
      { label: 'Pack', value: '1 brush' },
      { label: 'Material', value: 'Soft silicone' },
      { label: 'Design', value: 'Soft silicone head, stable grip' },
      { label: 'Use', value: 'On wet hair, with shampoo' },
      { label: 'Suitable for', value: 'All scalp types' },
      { label: 'Pairs with', value: 'HR³ MATRIX MEDI SCALP SHAMPOO α' },
      { label: 'Manufacturer', value: 'DTS MG Co., Ltd., Republic of Korea' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },
  backToProducts: 'All products',
}

const AR: ScalpBrushCopy = {
  eyebrow: 'HR³ Matrix · العناية بفروة الرأس',
  headline: 'طريقة ألطف لتوزيع الشامبو.',
  subheadline:
    'فرشاة يدوية بأسنان من السيليكون الناعم ومقبض مركزي ثابت، لتلامس متحكم فيه أثناء الغسل. تستخدم على شعر مبلل بعد تكوين رغوة الشامبو، ثم يشطف الشعر جيداً.',
  heroBullets: [
    'أسنان مرنة من السيليكون الناعم',
    'مقبض مركزي ثابت لليد المبللة',
    'تستخدم بعد تكوين رغوة الشامبو على شعر مبلل',
    'ضغط متحكم فيه، من دون ادعاء علاجي',
  ],
  badges: ['سيليكون ناعم', 'للاستخدام في الحمّام', 'فرشاة واحدة', 'الموزّع الرسمي في الإمارات'],
  packSize: 'فرشاة واحدة',
  usageNote: 'تُستخدم مبللة، مع الشامبو',
  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
  loginToShop: 'سجّلي الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  stats: [
    { value: 'ناعم', label: 'أسنان سيليكون مرنة لتلامس لطيف' },
    { value: 'في الحمّام', label: 'على شعر مبلل، مع الشامبو' },
    { value: 'متحكم فيه', label: 'يساعد المقبض الثابت على ضبط الضغط' },
    { value: 'قطعة واحدة', label: 'فرشاة يدوية من دون رؤوس بديلة' },
  ],
  effects: {
    eyebrow: 'ما تم التحقق منه',
    title: 'أداة بسيطة لوقت الغسل، بوظيفة واضحة.',
    intro:
      'تؤكد نشرة DTS MG المتاحة مادة السيليكون والمقبض الثابت وطريقة الاستخدام مع الشامبو على شعر مبلل. ولا تتضمن اختبار فعالية خاصاً بالفرشاة، لذلك تلتزم الصفحة بهذه الحقائق العملية.',
    cards: [
      {
        title: 'تلامس ناعم بالسيليكون',
        body: 'تلامس الأسنان المرنة فروة الرأس بلطف أكبر من الفرشاة الصلبة عند إبقاء الضغط خفيفاً.',
      },
      {
        title: 'استخدام مع الشامبو المبلل',
        body: 'الطريقة الموثقة هي تبليل الشعر وتكوين رغوة الشامبو واستخدام الفرشاة على الفروة ثم الشطف جيداً.',
      },
      {
        title: 'مقبض لليد المبللة',
        body: 'يساعد المقبض المركزي الثابت على إمساك الفرشاة والتحكم في حركتها والضغط.',
      },
      {
        title: 'دور واحد واضح',
        body: 'استخدميها أثناء غسل الشعر فقط. ضعي التونيك والمحاليل التي تترك على الفروة بعد ذلك بأطراف الأصابع.',
      },
    ],
  },
  design: {
    eyebrow: 'التصميم',
    title: 'قرارَان، وكلاهما عن اليدين المبللتين.',
    body: 'تستخدم الفرشاة واليد مبللة، لذلك يجمع تصميمها بين أسنان سيليكون مرنة ومقبض مركزي ثابت.',
    points: [
      {
        title: 'رأس من السيليكون الناعم',
        body: 'توفر أسنان السيليكون المرنة تلامساً ناعماً عند استخدام ضغط خفيف ومتحكم فيه.',
      },
      {
        title: 'مقبض ثابت',
        body: 'شكل المقبض يتيح استخداماً مريحاً وثابتاً، وهذا هو الفرق بين تدليك فروة الرأس ومطاردة فرشاة على أرض الحمّام.',
      },
    ],
    figureAlt: 'منظران لفرشاة HR³ MATRIX يوضحان المقبض المقوّس ورأس السيليكون',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'أربع خطوات، داخل غسلتك المعتادة.',
    frequency: 'عند الحاجة ضمن خطوة الشامبو',
    steps: [
      {
        title: 'بلّلي شعرك',
        body: 'اشطفي جيداً بماء فاتر. لا حاجة للماء الساخن، وهو أقسى على فروة الرأس.',
      },
      {
        title: 'كوّني رغوة الشامبو',
        body: 'ضعي HR³ MATRIX MEDI SCALP SHAMPOO α واعملي على تكوين رغوة كافية. الفرشاة تعمل مع الرغوة، لا مع الشامبو الخالص.',
      },
      {
        title: 'دلّكي بالفرشاة',
        body: 'مرريها بلطف على فروة الرأس منطقة بعد أخرى. أبقي الضغط خفيفاً ومتحكماً فيه.',
      },
      {
        title: 'اشطفي، ثم ضعي العناية منفصلة',
        body: 'اشطفي جيداً. المنتجات التي لا تُشطف مثل HR³ MATRIX HAIR TONIC α توضع بعد ذلك، على فروة رأس نظيفة، بأطراف الأصابع.',
      },
    ],
    note: 'اضغطي بلطف. الضغط الأقوى لا ينظّف أفضل، وميزة رأس السيليكون الناعم أنه لا يحتاج إليه.',
  },
  video: {
    eyebrow: 'في الحركة',
    title: 'الرأس عن قرب',
    body: 'أسنان سيليكون ناعمة حول رأس مقبب، والمقبض في المنتصف. يوضح المشهد القريب مرونة الأطراف وتصميماً تتحكم فيه اليد.',
    unsupported: 'متصفحك لا يدعم تشغيل هذا الفيديو.',
  },
  care: {
    eyebrow: 'العناية والتنبيهات',
    title: 'مكانها الحمّام، فتعاملي معها على هذا الأساس.',
    upkeep: [
      'اغسليها بماء دافئ بعد كل استخدام',
      'اتركيها تجف تماماً في الهواء قبل تخزينها',
      'احفظيها في مكان جاف، لا في كيس مغلق ورطب',
      'استبدليها إذا تمزق السيليكون أو فقد شكله',
    ],
    cautions: [
      'لا تستخدميها على فروة رأس مجروحة أو متهيجة أو مصابة بالتهاب',
      'لا يحدد الدليل فترة بعد الإجراءات؛ لا تستخدميها قبل تعافي الفروة',
      'أوقفي الاستخدام إذا ظهر تهيج، وراجعي الطبيب إذا استمر',
      'للاستخدام الخارجي فقط. يُحفظ بعيداً عن متناول الأطفال',
    ],
    note: 'يفضل إبقاؤها أداة شخصية، وتنظيفها وتجفيفها بعد الاستخدام.',
  },
  routine: {
    eyebrow: 'الروتين',
    title: 'موقع الفرشاة في خط HR³ MATRIX.',
    intro:
      'الفرشاة أداة لوقت الغسل. استخدميها فقط مع رغوة الشامبو، ثم اشطفي، وضعي أي منتج يترك على الفروة منفصلاً بأطراف الأصابع.',
    thisProduct: 'أنتِ هنا',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الحجم',
    fromPrice: 'من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل أن تضيفيها.',
    items: [
      {
        q: 'هل يمكنني استخدامها على شعر جاف؟',
        a: 'توثق النشرة المتاحة استخدامها في الحمام مع الشامبو، ولا توثق التدليك الجاف. أبقي هذه الفرشاة ضمن خطوة الغسل.',
      },
      {
        q: 'هل تساعد في تساقط الشعر؟',
        a: 'لا يوجد دليل خاص بالفرشاة يدعم ادعاء علاج التساقط أو تحفيز النمو أو الوقاية من الترقق أو زيادة تدفق الدم. يستلزم التساقط المستمر تشخيصاً مناسباً.',
      },
      {
        q: 'هل تعمل مع أي شامبو؟',
        a: 'تعرض النشرة الفرشاة مع الشامبو، وتذكر MEDI SCALP SHAMPOO α تحديداً. هذا اقتراح ضمن الروتين، وليس ادعاء فعالية.',
      },
      {
        q: 'هل هي آمنة إذا كانت فروة رأسي حساسة؟',
        a: 'السيليكون الناعم لا يضمن ملاءمة الجميع. استخدمي ضغطاً خفيفاً، وتجنبي الجلد المتضرر أو المتهيج أو المصاب بعدوى، وتوقفي عند الشعور بعدم الراحة.',
      },
      {
        q: 'كم مرة يجب أن أستبدلها؟',
        a: 'لا يحدد الدليل المتاح موعداً زمنياً للاستبدال. استبدليها إذا تمزق السيليكون أو تشوه أو توقف عن العودة إلى شكله.',
      },
      {
        q: 'هل يمكن استخدامها للأطفال؟',
        a: 'لا يقدم الدليل المتاح تعليمات للأطفال أو فئة عمرية. لا تقدميها كمنتج مخصص للأطفال.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل.',
    rows: [
      { label: 'المنتج', value: 'HR³ MATRIX SCALP BRUSH' },
      { label: 'النوع', value: 'فرشاة سيليكون يدوية للاستخدام مع الشامبو' },
      { label: 'العبوة', value: 'فرشاة واحدة' },
      { label: 'المادة', value: 'سيليكون ناعم' },
      { label: 'التصميم', value: 'رأس من السيليكون الناعم، مقبض ثابت' },
      { label: 'الاستخدام', value: 'على شعر مبلل، مع الشامبو' },
      { label: 'الضغط', value: 'خفيف ومتحكم فيه' },
      { label: 'تُستخدم مع', value: 'HR³ MATRIX MEDI SCALP SHAMPOO α' },
      { label: 'حدود المصدر', value: 'لا يذكر الدليل المتاح بلد المنشأ' },
    ],
  },
  backToProducts: 'كل المنتجات',
}

/* Russian keeps its em dashes. They are correct punctuation in Russian rather
   than a stylistic flourish, so replacing them with hyphens as we do in English
   and Arabic would introduce an actual error for a Russian reader. */
const RU: ScalpBrushCopy = {
  eyebrow: 'HR³ Matrix · Уход за кожей головы',
  headline: 'Более мягкий способ распределить шампунь.',
  subheadline:
    'Ручная щётка с мягкими силиконовыми зубцами и устойчивым центральным хватом для контролируемого контакта во время мытья. Используйте на влажных волосах после вспенивания шампуня, затем тщательно смойте.',
  heroBullets: [
    'Мягкие гибкие силиконовые зубцы',
    'Устойчивый центральный хват для мокрых рук',
    'Использование на влажных волосах после вспенивания шампуня',
    'Контролируемый нажим без лечебных заявлений',
  ],
  badges: ['Мягкий силикон', 'Для душа', '1 щётка', 'Официальный дистрибьютор в ОАЭ'],
  packSize: '1 щётка',
  usageNote: 'Используется влажной, с шампунем',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы купить',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'Включая НДС',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  stats: [
    { value: 'Мягкий', label: 'Гибкие силиконовые зубцы для деликатного контакта' },
    { value: 'В душе', label: 'На влажных волосах, вместе с шампунем' },
    { value: 'Контроль', label: 'Устойчивая ручка помогает дозировать нажим' },
    { value: '1 предмет', label: 'Ручная щётка без сменных насадок' },
  ],
  effects: {
    eyebrow: 'Что подтверждено',
    title: 'Простой аксессуар для мытья с ясной задачей.',
    intro:
      'Доступное руководство DTS MG подтверждает силикон, устойчивый хват и влажный способ применения с шампунем. Отдельного теста эффективности щётки в нём нет, поэтому здесь только практические факты.',
    cards: [
      {
        title: 'Мягкий контакт силикона',
        body: 'Гибкие зубцы мягче соприкасаются с кожей, чем жёсткая щётка, если сохранять лёгкий нажим.',
      },
      {
        title: 'Влажное применение с шампунем',
        body: 'Документированный способ: намочить волосы, вспенить шампунь, использовать щётку на коже головы и тщательно смыть.',
      },
      {
        title: 'Хват для мокрых рук',
        body: 'Устойчивая центральная ручка помогает удерживать щётку и контролировать движение и нажим.',
      },
      {
        title: 'Одна ясная роль',
        body: 'Используйте её во время мытья. Тоники и растворы наносятся после, кончиками пальцев, не щёткой.',
      },
    ],
  },
  design: {
    eyebrow: 'Конструкция',
    title: 'Два решения - и оба про мокрые руки.',
    body: 'Щёткой пользуются мокрой рукой, поэтому в конструкции сочетаются гибкие силиконовые зубцы и устойчивый центральный хват.',
    points: [
      {
        title: 'Мягкая силиконовая насадка',
        body: 'Гибкие силиконовые зубцы обеспечивают мягкий контакт при лёгком контролируемом нажиме.',
      },
      {
        title: 'Устойчивая ручка',
        body: 'Форма ручки рассчитана на удобный и устойчивый хват - это разница между массажем кожи головы и погоней за щёткой по полу душевой.',
      },
    ],
    figureAlt: 'Две проекции щётки HR³ MATRIX: куполообразная ручка и силиконовая насадка',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Четыре шага внутри обычного мытья.',
    frequency: 'По необходимости на этапе шампуня',
    steps: [
      {
        title: 'Намочите волосы',
        body: 'Тщательно смочите тёплой водой. Горячая вода не нужна и хуже переносится кожей головы.',
      },
      {
        title: 'Взбейте пену',
        body: 'Нанесите HR³ MATRIX MEDI SCALP SHAMPOO α и взбейте достаточную пену. Щётка работает с пеной, а не с неразбавленным шампунем.',
      },
      {
        title: 'Массируйте щёткой',
        body: 'Мягко ведите по коже головы, зона за зоной. Сохраняйте лёгкий контролируемый нажим.',
      },
      {
        title: 'Смойте, затем нанесите уход отдельно',
        body: 'Тщательно смойте. Несмываемые средства, например HR³ MATRIX HAIR TONIC α, наносятся после - на чистую кожу головы, кончиками пальцев.',
      },
    ],
    note: 'Нажимайте легко. Сильнее не значит чище, а смысл мягкой силиконовой насадки как раз в том, что нажим не нужен.',
  },
  video: {
    eyebrow: 'В движении',
    title: 'Насадка вблизи',
    body: 'Мягкие силиконовые зубцы расположены вокруг куполообразной насадки, ручка находится по центру. Крупный план показывает гибкость кончиков и управляемую рукой конструкцию.',
    unsupported: 'Ваш браузер не может воспроизвести это видео.',
  },
  care: {
    eyebrow: 'Уход и предостережения',
    title: 'Она живёт в душе - с ней и надо обращаться соответственно.',
    upkeep: [
      'Промывайте тёплой водой после каждого использования',
      'Дайте полностью высохнуть на воздухе перед хранением',
      'Храните в сухом месте, а не в закрытом влажном мешке',
      'Замените, если силикон порвался или потерял форму',
    ],
    cautions: [
      'Не используйте на повреждённой, раздражённой или воспалённой коже головы',
      'Руководство не задаёт срок после процедур; не используйте до восстановления кожи',
      'Прекратите при появлении раздражения, при сохранении - обратитесь к врачу',
      'Только для наружного применения. Хранить в недоступном для детей месте',
    ],
    note: 'Лучше оставить её личным аксессуаром и промывать и высушивать после использования.',
  },
  routine: {
    eyebrow: 'Порядок ухода',
    title: 'Место щётки в линии HR³ MATRIX.',
    intro:
      'Щётка - аксессуар для мытья. Используйте её только со вспененным шампунем, смойте, а несмываемый продукт нанесите отдельно кончиками пальцев.',
    thisProduct: 'Вы здесь',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать объём',
    fromPrice: 'от',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Прежде чем добавить.',
    items: [
      {
        q: 'Можно ли использовать на сухих волосах?',
        a: 'Доступное руководство описывает применение в душе с шампунем, а не сухой массаж. Оставьте эту щётку на этапе мытья.',
      },
      {
        q: 'Поможет ли она при выпадении волос?',
        a: 'Для щётки не подтверждены лечение выпадения, стимуляция роста, профилактика истончения или усиление кровотока. При продолжающемся выпадении нужна диагностика.',
      },
      {
        q: 'Работает ли она с любым шампунем?',
        a: 'Руководство показывает щётку с шампунем и отдельно называет MEDI SCALP SHAMPOO α. Это предложение для порядка ухода, а не заявление об эффективности.',
      },
      {
        q: 'Безопасна ли она для чувствительной кожи головы?',
        a: 'Мягкий силикон не гарантирует универсальную переносимость. Нажимайте легко, не используйте на повреждённой, раздражённой или инфицированной коже и прекратите при дискомфорте.',
      },
      {
        q: 'Как часто её менять?',
        a: 'Доступное руководство не задаёт календарный срок. Замените щётку, если силикон порвался, деформировался или перестал возвращаться в исходную форму.',
      },
      {
        q: 'Можно ли использовать для детей?',
        a: 'Доступное руководство не указывает детский способ применения или возраст. Не представляйте её как детский продукт.',
      },
    ],
  },
  details: {
    eyebrow: 'Спецификация',
    title: 'Детали.',
    rows: [
      { label: 'Продукт', value: 'HR³ MATRIX SCALP BRUSH' },
      { label: 'Тип', value: 'Ручная силиконовая щётка для использования с шампунем' },
      { label: 'Упаковка', value: '1 щётка' },
      { label: 'Материал', value: 'Мягкий силикон' },
      { label: 'Конструкция', value: 'Мягкая силиконовая насадка, устойчивая ручка' },
      { label: 'Применение', value: 'На влажных волосах, с шампунем' },
      { label: 'Нажим', value: 'Лёгкий и контролируемый' },
      { label: 'Используется с', value: 'HR³ MATRIX MEDI SCALP SHAMPOO α' },
      { label: 'Граница источника', value: 'Доступное руководство не указывает страну происхождения' },
    ],
  },
  backToProducts: 'Все продукты',
}

const COPY: Record<ScalpBrushLocale, ScalpBrushCopy> = { en: EN, ar: AR, ru: RU }

export function getScalpBrushCopy(locale: string): ScalpBrushCopy {
  return COPY[(locale as ScalpBrushLocale) in COPY ? (locale as ScalpBrushLocale) : 'en']
}
