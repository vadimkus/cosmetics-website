/**
 * Bespoke copy for the MOISTURE REPLENISHING HYALURON CREAM page (product 29), in English,
 * Arabic and Russian. Campaign: "Sealed fresh." (bb-style single-product carousel,
 * public/images/mhcream_campaign). The cream half of the pair whose serum is product 18.
 *
 * SOURCES (Intertek, MOISTURE REPLENISHING HYALURON SERUMCREAM/MOISTURE REPLENISHING HYALURON
 * CREAM/, plus the DTS MG deck public/documents/PPT/GENOSYS MOISTURE REPLENISHING HYALURON
 * CREAM.pdf):
 *
 *   Formula_updated_22062025.pdf    glycerin 9.000%, Saccharide Isomerate (PENTAVITIN) 0.615%,
 *                                   Sodium Hyaluronate 0.10009% = 1,000.9 ppm, seven further
 *                                   hyaluronates at 30 ppb, one at 1 ppb, five mushroom extracts
 *                                   at ~0.17 ppm, Tremella polysaccharide 0.6 ppm, geranium
 *                                   flower oil with citronellol and geraniol.
 *   Artwork_updated_22062024.pdf    function Moisturizing; apply on the face and gently massage,
 *                                   morning and evening; "a refreshing moisturizer that provides
 *                                   multi-level hydration"; dermatologically tested; 50g.
 *   COA_updated_22062024.pdf        pH 6.00 against 6.0 +/- 1.0; three years unopened. No lot
 *                                   code and no plant name on the page: DTS MG only.
 *   DTS MG deck                     Hyaluronan 11 Multi-Complex (11 molecular-weight grades
 *                                   across 8 INCI names, the Korean panel prints the same
 *                                   count); the 1,000 ppm is the high-molecular-weight fraction;
 *                                   PENTAVITIN the moisture magnet; hydration +82% immediately
 *                                   after a single use and still significantly above baseline at
 *                                   72 hours, 21 women aged 20-59, 100% satisfaction panel; do
 *                                   not refrigerate.
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - Mushrooms as anti-inflammatory or antioxidant actives (0.17 ppm). Name them only.
 *   - Aquaporin as the mechanism (glyceryl glucoside is at 5 ppm).
 *   - Anti-ageing, fine lines, elasticity, firming: the clinical is hydration only.
 *   - All skin types including sensitive; say dry, and dehydrated skin of any type.
 *   - Safe for pregnancy and children, either way.
 *   - Fragrance-free: geranium flower oil, citronellol and geraniol are in the formula.
 *   - A cooling effect: xylitol 0.012%, erythritol 0.010%. "Refreshing" describes the texture.
 */

export type MhcreamLocale = 'en' | 'ar' | 'ru'

export interface MhcreamCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  packSize: string
  usageNote: string
  chooseSize: string
  sizes: {
    homecareLabel: string
    homecareNote: string
    proLabel: string
    proNote: string
  }
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
  clean: {
    eyebrow: string
    title: string
    intro: string
    items: string[]
    note: string
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

const EN: MhcreamCopy = {
  eyebrow: 'Cream · Dry and dehydrated skin',
  headline: 'Sealed fresh.',
  subheadline:
    'Dubai air takes water from your skin all day. This cream puts it back and puts a lid on it. Glycerin at 9% and PENTAVITIN pull water in; 1,000.9 ppm of high-weight hyaluronic acid rests on the surface like a fine film and keeps it there. Hydration rose 82% straight after one use, and three days later it was still higher than where it started.',
  heroBullets: [
    'Hydration up 82% after a single use',
    'Still measurably higher 72 hours later',
    '1,000.9 ppm of high-weight hyaluronic acid seals the water in',
    'Glycerin 9% and PENTAVITIN 0.615% draw it into skin',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '50g and 250g', 'Morning and night'],
  packSize: '50g / 250g',
  usageNote: 'Morning and night, after the serum',
  chooseSize: 'Choose your size',
  sizes: {
    homecareLabel: 'Homecare',
    homecareNote: 'The 50g tube, small enough for your hand luggage',
    proLabel: 'Professional',
    proNote: 'The 250g tube, for your shelf at home or the clinic',
  },
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
    { value: '+82%', label: 'Hydration straight after one use' },
    { value: '72h', label: 'Later, and still measurably higher' },
    { value: '1,000.9', label: 'ppm of high-weight hyaluronic acid' },
    { value: '9%', label: 'Glycerin, nearly a tenth of the tube' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Grape, not raisin.',
    intro:
      'Same fruit, and the only difference is water. A moisturizer earns its place by keeping skin on the grape side of that line, hours after you put it on.',
    cards: [
      {
        title: 'Pulls water in',
        body: 'Glycerin at 9% and PENTAVITIN at 0.615%, the moisture magnet, draw water toward the skin.',
      },
      {
        title: 'Keeps it there',
        body: 'The 1,000.9 ppm of hyaluronic acid is the high-weight grade. It rests on the surface as a light film that holds the water in, the half of the job a serum cannot do alone.',
      },
      {
        title: 'Measured on skin',
        body: 'Hydration rose 82% straight after a single application and was still significantly higher 72 hours later.',
      },
    ],
  },
  engine: {
    eyebrow: 'The complex',
    title: 'Hyaluronan 11, led by the heavy one.',
    body:
      'Eleven grades of hyaluronic acid, from light to heavy, in one complex. The heavy grade leads: 1,000.9 ppm of high-molecular-weight sodium hyaluronate, the form that stays on top of skin and keeps its water from escaping, the way a waxy leaf holds on to its water in the midday sun.',
    points: [
      {
        title: 'High-weight hyaluronic acid · 1,000.9 ppm',
        body: 'The seal. A light film on the surface that slows the water leaving, so skin stays soft for hours.',
      },
      {
        title: 'Glycerin · 9%',
        body: 'Nearly a tenth of the tube, pulling water into the outer layer of skin.',
      },
      {
        title: 'PENTAVITIN · 0.615%',
        body: 'A plant-derived sugar close to the ones already in skin, known as the moisture magnet.',
      },
      {
        title: 'The rest of Hyaluronan 11',
        body: 'Lighter grades of hyaluronic acid round out the complex around its 1,000.9 ppm lead.',
      },
      {
        title: 'Five mushrooms',
        body: 'Tremella, turkey tail, cauliflower fungus, reishi and blackhood: the "with MUSHROOMS" on the tube.',
      },
    ],
    figureAlt: 'Hyaluronan 11, led by 1,000.9 ppm of high-weight hyaluronic acid',
  },
  clean: {
    eyebrow: 'The proof',
    title: 'One use. Three days.',
    intro:
      'Hydration was measured on 21 women straight after a single application, then again 72 hours later.',
    items: [
      'Hydration up 82% straight after a single application',
      'Still significantly higher 72 hours later',
      '21 women, aged 20 to 59',
      '100% said their skin felt moisturized enough',
      '100% felt no tightness underneath',
      '100% were happy using it',
    ],
    note:
      'Every result here is about water: how much skin holds, and how long it keeps it.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Last on, morning and night.',
    frequency: 'Morning and night',
    steps: [
      {
        title: 'Cleanse and tone',
        body: 'Start on clean skin, toner first.',
      },
      {
        title: 'Serum first',
        body: 'Pat in the Moisture Replenishing Hyaluron Serum. It fills skin with water; this cream seals it in.',
      },
      {
        title: 'Massage in the cream',
        body: 'Smooth it over the face with gentle massage, like laying down a fine film of moisture.',
      },
      {
        title: 'Sunscreen by day',
        body: 'At night it is the last step. In the morning, sunscreen goes on top.',
      },
    ],
    note:
      'Keep it cool and dry, but out of the fridge: cold changes the texture.',
    videoTitle: 'See the texture',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The full list.',
    intro:
      'Hyaluronic acid, glycerin, PENTAVITIN and five mushrooms, with everything else in the tube.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'Every ingredient, as printed on the carton.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Made for thirsty skin.',
    forTitle: 'A good fit if',
    forList: [
      'Your skin is dry, or dehydrated, which happens to oily skin too',
      'Hydrating layers feel good going on and are gone by lunchtime',
      'You use the Hyaluron Serum and want the step that seals it in',
      'Air conditioning, long flights or a Gulf summer leave your face tight',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You avoid fragrance: there is geranium flower oil in it, with citronellol and geraniol',
      'You want a wrinkle or firming cream: this one is built for water',
      'You want an oil-free gel: the Problem Control Cream is the other tube',
    ],
    note:
      'For external use only, and keep it clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'Fill first, then seal.',
    intro:
      'The cream is the last step. These come before it, and you can add any of them here.',
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
        q: 'Serum or cream, if I only buy one?',
        a: 'The serum carries 2,000 ppm of light, hydrolyzed hyaluronic acid that fills the surface with water. The cream carries 1,000.9 ppm of the heavy grade that keeps it there. On dry skin, start with the cream. On skin that just feels tight by the afternoon, start with the serum. Together they do both jobs.',
      },
      {
        q: 'How long does it keep working?',
        a: 'Hydration was up 82% straight after one application and still significantly higher 72 hours later. Use it morning and night to keep that level topped up.',
      },
      {
        q: 'What is Hyaluronan 11?',
        a: 'A complex of eleven hyaluronic acid grades, from light to heavy, led here by 1,000.9 ppm of the heavy grade that seals water in.',
      },
      {
        q: 'Can I fly with it?',
        a: 'The 50g tube goes in your hand luggage, and dry cabin air is exactly where it earns its place. The 250g stays at home.',
      },
      {
        q: 'Does it have a scent?',
        a: 'A light floral one, from geranium flower oil, with citronellol and geraniol. If you avoid fragrance entirely, pick another cream.',
      },
      {
        q: 'Can I keep it in the fridge?',
        a: 'Better not: cold changes the viscosity and the texture. Somewhere cool and dry is perfect.',
      },
      {
        q: 'What is the pH?',
        a: '6.00, close to skin, inside a 6.0 plus or minus 1.0 specification.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details.',
    rows: [
      { label: 'Format', value: 'Leave-on moisturizing cream, tube' },
      { label: 'Sizes', value: '50g homecare / 250g professional' },
      { label: 'Function', value: 'Moisturizing' },
      { label: 'When', value: 'Morning and night, after the serum' },
      { label: 'Skin types', value: 'Dry skin, and dehydrated skin of any type' },
      { label: 'Hyaluronic acid', value: '1,000.9 ppm, high molecular weight' },
      { label: 'pH', value: '6.00, inside a 6.0 plus or minus 1.0 specification' },
      { label: 'Fragrance', value: 'Light floral: geranium flower oil, with citronellol and geraniol' },
      { label: 'Storage', value: 'Cool and dry, but not the fridge' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'Sealed fresh.',
    body: 'Water in, water kept, and still there three days after a single use.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const AR: MhcreamCopy = {
  eyebrow: 'كريم · للبشرة الجافة والمفتقرة إلى الماء',
  headline: 'نضارة محفوظة.',
  subheadline:
    'هواء دبي يأخذ الماء من بشرتك طوال اليوم. هذا الكريم يعيده إليها ويُحكم الغطاء عليه. يجذب الغليسرين 9% وPENTAVITIN الماء، بينما تستقر 1,000.9 جزء في المليون من حمض الهيالورونيك عالي الوزن الجزيئي على السطح كطبقة رقيقة تحبسه. ارتفع الترطيب 82% فور استخدام واحد، وبعد ثلاثة أيام ظل أعلى من نقطة البداية.',
  heroBullets: [
    'ترطيب أعلى بنسبة 82% بعد استخدام واحد',
    'وما زال أعلى بوضوح بعد 72 ساعة',
    '1,000.9 جزء في المليون من الهيالورونيك عالي الوزن الجزيئي يحبس الماء',
    'غليسرين 9% وPENTAVITIN بنسبة 0.615% يجذبانه إلى البشرة',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', '٥٠ غ و٢٥٠ غ', 'صباحاً ومساءً'],
  packSize: '٥٠ غ / ٢٥٠ غ',
  usageNote: 'صباحاً ومساءً، بعد السيروم',
  chooseSize: 'اختاري الحجم',
  sizes: {
    homecareLabel: 'للاستخدام المنزلي',
    homecareNote: 'أنبوب ٥٠ غ، صغير بما يكفي لأمتعة المقصورة',
    proLabel: 'للاستخدام الاحترافي',
    proNote: 'أنبوب ٢٥٠ غ، لرفّ البيت أو للعيادة',
  },
  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
  loginToShop: 'سجّلي الدخول للتسوق',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني فوق ١٬٠٠٠ درهم · يُشحن من دبي',
  stats: [
    { value: '+82%', label: 'ترطيب فور استخدام واحد' },
    { value: '72 ساعة', label: 'بعدها، وما زال أعلى بوضوح' },
    { value: '1,000.9', label: 'جزء في المليون من الهيالورونيك عالي الوزن الجزيئي' },
    { value: '9%', label: 'غليسرين، قرابة عُشر الأنبوب' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'عنب، لا زبيب.',
    intro:
      'الثمرة نفسها، والفرق الوحيد هو الماء. يستحق المرطب مكانه عندما يُبقي البشرة في جهة العنب لساعات بعد وضعه.',
    cards: [
      {
        title: 'يجذب الماء',
        body: 'يجذب الغليسرين 9% وPENTAVITIN بنسبة 0.615%، مغناطيس الرطوبة، الماء نحو البشرة.',
      },
      {
        title: 'ويحتفظ به',
        body: 'الـ1,000.9 جزء في المليون من الهيالورونيك هي الفئة عالية الوزن الجزيئي، تستقر على السطح كطبقة خفيفة تحبس الماء، وهو نصف المهمة الذي لا يستطيعه السيروم وحده.',
      },
      {
        title: 'قيس على البشرة',
        body: 'ارتفع الترطيب 82% فور تطبيق واحد، وظل أعلى بوضوح بعد 72 ساعة.',
      },
    ],
  },
  engine: {
    eyebrow: 'المركّب',
    title: 'Hyaluronan 11، بقيادة الفئة الأثقل.',
    body:
      'إحدى عشرة فئة من حمض الهيالورونيك، من الخفيفة إلى الثقيلة، في مركّب واحد. وتقوده الفئة الثقيلة: 1,000.9 جزء في المليون من هيالورونات الصوديوم عالية الوزن الجزيئي، الشكل الذي يبقى على سطح البشرة ويمنع ماءها من التسرّب، كما تحتفظ الورقة الشمعية بمائها تحت شمس الظهيرة.',
    points: [
      {
        title: 'هيالورونيك عالي الوزن الجزيئي · 1,000.9 جزء في المليون',
        body: 'الختم. طبقة خفيفة على السطح تبطئ خروج الماء، فتبقى البشرة ناعمة لساعات.',
      },
      {
        title: 'غليسرين · 9%',
        body: 'قرابة عُشر الأنبوب، يجذب الماء إلى الطبقة الخارجية من البشرة.',
      },
      {
        title: 'PENTAVITIN · ‏0.615%',
        body: 'سكّر نباتي المصدر قريب مما تحتويه البشرة أصلاً، ويُعرف بمغناطيس الرطوبة.',
      },
      {
        title: 'بقية Hyaluronan 11',
        body: 'فئات أخف من حمض الهيالورونيك تكمل المركّب حول قائده بتركيز 1,000.9 جزء في المليون.',
      },
      {
        title: 'خمسة أنواع من الفطر',
        body: 'التريميلا والترايميتس والسباراسيس والريشي والفلينوس: عبارة "with MUSHROOMS" على الأنبوب.',
      },
    ],
    figureAlt: 'مركّب Hyaluronan 11 بقيادة 1,000.9 جزء في المليون من الهيالورونيك عالي الوزن الجزيئي',
  },
  clean: {
    eyebrow: 'الدليل',
    title: 'استخدام واحد. ثلاثة أيام.',
    intro:
      'قيس الترطيب لدى 21 امرأة فور تطبيق واحد، ثم مرة أخرى بعد 72 ساعة.',
    items: [
      'ترطيب أعلى بنسبة 82% فور تطبيق واحد',
      'وما زال أعلى بوضوح بعد 72 ساعة',
      '21 امرأة بأعمار من 20 إلى 59 عاماً',
      '100% شعرن بترطيب كافٍ',
      '100% لم يشعرن بأي شد تحت السطح',
      '100% سعيدات باستخدامه',
    ],
    note:
      'كل نتيجة هنا تتعلق بالماء: كم تحتفظ به البشرة، وإلى متى.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'الخطوة الأخيرة، صباحاً ومساءً.',
    frequency: 'صباحاً ومساءً',
    steps: [
      {
        title: 'التنظيف والتونر',
        body: 'ابدئي على بشرة نظيفة، والتونر أولاً.',
      },
      {
        title: 'السيروم أولاً',
        body: 'ربّتي Moisture Replenishing Hyaluron Serum. فهو يملأ البشرة بالماء، وهذا الكريم يحبسه.',
      },
      {
        title: 'دلّكي الكريم',
        body: 'وزّعيه على الوجه بتدليك لطيف، كأنك تضعين طبقة رقيقة من الرطوبة.',
      },
      {
        title: 'واقي الشمس نهاراً',
        body: 'مساءً هو الخطوة الأخيرة، وصباحاً يوضع واقي الشمس فوقه.',
      },
    ],
    note:
      'احفظيه في مكان بارد وجاف، لكن بعيداً عن الثلاجة: البرودة تغيّر قوامه.',
    videoTitle: 'شاهدي القوام',
  },
  actives: {
    eyebrow: 'المكونات',
    title: 'التركيبة كاملة.',
    intro:
      'حمض الهيالورونيك والغليسرين وPENTAVITIN وخمسة أنواع من الفطر، مع كل ما في الأنبوب.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote: 'جميع المكونات كما هي مطبوعة على العبوة.',
  },
  suited: {
    eyebrow: 'هل يناسبك؟',
    title: 'للبشرة العطشى.',
    forTitle: 'مناسب إذا',
    forList: [
      'كانت بشرتك جافة أو مفتقرة إلى الماء، وهذا يحدث للبشرة الدهنية أيضاً',
      'كانت الطبقات المرطبة جميلة عند وضعها ثم تختفي قبل الظهر',
      'كنت تستخدمين Hyaluron Serum وتريدين الخطوة التي تحبس رطوبته',
      'كان التكييف أو الرحلات الطويلة أو صيف الخليج يترك وجهك مشدوداً',
    ],
    notTitle: 'اختاري بديلاً إذا',
    notList: [
      'كنت تتجنبين العطور: يحتوي على زيت زهرة إبرة الراعي مع السيترونيلول والجيرانيول',
      'كنت تبحثين عن كريم للتجاعيد أو الشد: هذا الكريم مصمَّم للماء',
      'كنت تريدين جلاً خالياً من الزيوت: عندها يكون Problem Control Cream هو الأنبوب الآخر',
    ],
    note:
      'للاستخدام الخارجي فقط، وأبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'املئي أولاً، ثم احبسي.',
    intro: 'الكريم هو الخطوة الأخيرة. هذه المنتجات تأتي قبله، ويمكنك إضافة أي منها هنا.',
    thisProduct: 'هذا المنتج',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الخيارات',
    fromPrice: 'ابتداءً من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'أسئلة شائعة',
    items: [
      {
        q: 'سيروم أم كريم إن اشتريت واحداً فقط؟',
        a: 'يحتوي السيروم على 2,000 جزء في المليون من حمض الهيالورونيك المتحلل الخفيف الذي يملأ السطح بالماء، ويحتوي الكريم على 1,000.9 جزء في المليون من الفئة الثقيلة التي تبقيه هناك. للبشرة الجافة ابدئي بالكريم، وللبشرة التي تشعر بالشد بعد الظهر ابدئي بالسيروم. ومعاً يؤديان المهمتين.',
      },
      {
        q: 'كم يدوم مفعوله؟',
        a: 'ارتفع الترطيب 82% فور تطبيق واحد، وظل أعلى بوضوح بعد 72 ساعة. استخدميه صباحاً ومساءً لتحافظي على هذا المستوى.',
      },
      {
        q: 'ما هو Hyaluronan 11؟',
        a: 'مركّب من إحدى عشرة فئة من حمض الهيالورونيك، من الخفيفة إلى الثقيلة، تقوده هنا 1,000.9 جزء في المليون من الفئة الثقيلة التي تحبس الماء.',
      },
      {
        q: 'هل يمكنني السفر به؟',
        a: 'أنبوب ٥٠ غ يرافقك في أمتعة المقصورة، وهواء الطائرة الجاف هو بالضبط المكان الذي يُثبت فيه قيمته. أما ٢٥٠ غ فيبقى في البيت.',
      },
      {
        q: 'هل له رائحة؟',
        a: 'نعم، رائحة زهرية خفيفة من زيت زهرة إبرة الراعي، مع السيترونيلول والجيرانيول. إذا كنت تتجنبين العطور تماماً فاختاري كريماً آخر.',
      },
      {
        q: 'هل أحفظه في الثلاجة؟',
        a: 'الأفضل لا: البرودة تغيّر لزوجته وقوامه. المكان البارد والجاف مثالي.',
      },
      {
        q: 'ما درجة الحموضة؟',
        a: '6.00، قريبة من البشرة، ضمن نطاق 6.0 ± 1.0.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      { label: 'الشكل', value: 'كريم ترطيب يُترك على البشرة، أنبوب' },
      { label: 'الأحجام', value: '٥٠ غ منزلي / ٢٥٠ غ احترافي' },
      { label: 'الوظيفة', value: 'الترطيب' },
      { label: 'متى', value: 'صباحاً ومساءً، بعد السيروم' },
      { label: 'نوع البشرة', value: 'البشرة الجافة والبشرة المفتقرة إلى الماء من أي نوع' },
      { label: 'حمض الهيالورونيك', value: '1,000.9 جزء في المليون، عالي الوزن الجزيئي' },
      { label: 'الأس الهيدروجيني', value: '6.00 ضمن نطاق 6.0 ± 1.0' },
      { label: 'الرائحة', value: 'زهرية خفيفة؛ زيت إبرة الراعي مع السيترونيلول والجيرانيول' },
      { label: 'التخزين', value: 'بارد وجاف، لكن ليس الثلاجة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات دون فتح، وتاريخ الانتهاء على العلبة' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'المنشأ', value: 'صنع في كوريا من DTS MG' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'نضارة محفوظة.',
    body: 'ماء يدخل، وماء يبقى، وما زال هناك بعد ثلاثة أيام من استخدام واحد.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'كل المنتجات',
}

const RU: MhcreamCopy = {
  eyebrow: 'Крем · Сухая и обезвоженная кожа',
  headline: 'Свежесть под замком.',
  subheadline:
    'Воздух Дубая весь день забирает у кожи воду. Этот крем возвращает её и закрывает крышкой. 9% глицерина и PENTAVITIN притягивают влагу, а 1 000,9 ppm высокомолекулярной гиалуроновой кислоты ложатся на поверхность тонкой плёнкой и удерживают её. Сразу после одного нанесения увлажнённость выросла на 82%, а через три дня всё ещё оставалась выше исходной.',
  heroBullets: [
    '+82% увлажнённости после одного нанесения',
    'Через 72 часа всё ещё заметно выше',
    '1 000,9 ppm высокомолекулярной гиалуроновой кислоты удерживают влагу',
    '9% глицерина и 0,615% PENTAVITIN притягивают её к коже',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', '50 г и 250 г', 'Утром и вечером'],
  packSize: '50 г / 250 г',
  usageNote: 'Утром и вечером, после сыворотки',
  chooseSize: 'Выберите объём',
  sizes: {
    homecareLabel: 'Домашний уход',
    homecareNote: 'Туба 50 г, помещается в ручную кладь',
    proLabel: 'Профессиональный',
    proNote: 'Туба 250 г, для полки дома или для клиники',
  },
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
    { value: '+82%', label: 'Увлажнённости сразу после одного нанесения' },
    { value: '72 ч', label: 'Спустя, и всё ещё заметно выше' },
    { value: '1 000,9', label: 'ppm высокомолекулярной гиалуроновой кислоты' },
    { value: '9%', label: 'Глицерина, почти десятая часть тубы' },
  ],
  effects: {
    eyebrow: 'Что делает крем',
    title: 'Виноград, а не изюм.',
    intro:
      'Один и тот же плод, разница только в воде. Хороший крем держит кожу на стороне винограда ещё много часов после нанесения.',
    cards: [
      {
        title: 'Притягивает влагу',
        body: '9% глицерина и 0,615% PENTAVITIN, «магнит для влаги», притягивают воду к коже.',
      },
      {
        title: 'Удерживает её',
        body: '1 000,9 ppm гиалуроновой кислоты - это высокомолекулярная форма. Она ложится на поверхность лёгкой плёнкой и удерживает воду: ту половину работы, с которой сыворотка одна не справится.',
      },
      {
        title: 'Измерено на коже',
        body: 'Сразу после одного нанесения увлажнённость выросла на 82% и через 72 часа всё ещё была значимо выше исходной.',
      },
    ],
  },
  engine: {
    eyebrow: 'Комплекс',
    title: 'Hyaluronan 11 во главе с высокомолекулярной формой.',
    body:
      'Одиннадцать форм гиалуроновой кислоты, от лёгких до плотных, в одном комплексе. Ведёт высокомолекулярная: 1 000,9 ppm гиалуроната натрия, который остаётся на поверхности кожи и не даёт воде уходить, как восковой лист сохраняет влагу под полуденным солнцем.',
    points: [
      {
        title: 'Высокомолекулярная гиалуроновая кислота · 1 000,9 ppm',
        body: 'Замок. Лёгкая плёнка на поверхности замедляет потерю воды, и кожа остаётся мягкой часами.',
      },
      {
        title: 'Глицерин · 9%',
        body: 'Почти десятая часть тубы: притягивает воду в верхний слой кожи.',
      },
      {
        title: 'PENTAVITIN · 0,615%',
        body: 'Растительный сахарид, близкий к тем, что уже есть в коже; его называют магнитом для влаги.',
      },
      {
        title: 'Остальные формы Hyaluronan 11',
        body: 'Более лёгкие формы гиалуроновой кислоты дополняют комплекс вокруг ведущих 1 000,9 ppm.',
      },
      {
        title: 'Пять грибов',
        body: 'Тремелла, траметес, спарассис, рейши и феллинус: те самые «with MUSHROOMS» на тубе.',
      },
    ],
    figureAlt: 'Комплекс Hyaluronan 11 во главе с 1 000,9 ppm высокомолекулярной гиалуроновой кислоты',
  },
  clean: {
    eyebrow: 'Результаты',
    title: 'Одно нанесение. Три дня.',
    intro:
      'Увлажнённость измерили у 21 женщины сразу после одного нанесения и ещё раз через 72 часа.',
    items: [
      'Увлажнённость выше на 82% сразу после одного нанесения',
      'Через 72 часа всё ещё значимо выше исходной',
      '21 женщина в возрасте от 20 до 59 лет',
      '100% отметили, что коже хватает увлажнения',
      '100% не чувствовали стянутости',
      '100% довольны кремом',
    ],
    note:
      'Все результаты здесь - об увлажнении: сколько воды удерживает кожа и как долго.',
  },
  howTo: {
    eyebrow: 'Как применять',
    title: 'Последний шаг утром и вечером.',
    frequency: 'Утром и вечером',
    steps: [
      {
        title: 'Очищение и тоник',
        body: 'Начните с чистой кожи и тоника.',
      },
      {
        title: 'Сначала сыворотка',
        body: 'Вбейте Moisture Replenishing Hyaluron Serum. Она наполняет кожу водой, а крем запечатывает её.',
      },
      {
        title: 'Нанесите крем',
        body: 'Распределите по лицу мягкими массажными движениями, словно покрывая кожу тонким слоем влаги.',
      },
      {
        title: 'Днём - SPF',
        body: 'Вечером крем - последний шаг. Утром поверх него наносится солнцезащитное средство.',
      },
    ],
    note:
      'Храните в прохладном сухом месте, но не в холодильнике: холод меняет текстуру.',
    videoTitle: 'Посмотрите на текстуру',
  },
  actives: {
    eyebrow: 'Что внутри',
    title: 'Полный состав.',
    intro:
      'Гиалуроновая кислота, глицерин, PENTAVITIN и пять грибов, а также всё остальное, что есть в тубе.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote: 'Все ингредиенты, как они напечатаны на упаковке.',
  },
  suited: {
    eyebrow: 'Подойдёт ли вам',
    title: 'Для кожи, которой не хватает воды.',
    forTitle: 'Подойдёт, если',
    forList: [
      'Кожа сухая или обезвоженная, а это бывает и с жирной кожей',
      'Увлажняющие средства приятны при нанесении, но к обеду от них ничего не остаётся',
      'Вы пользуетесь Hyaluron Serum и хотите шаг, который её запечатает',
      'Кондиционер, долгие перелёты или лето в Заливе стягивают лицо',
    ],
    notTitle: 'Поищите другое, если',
    notList: [
      'Вы избегаете ароматов: в составе масло цветков герани, цитронеллол и гераниол',
      'Вам нужен крем от морщин или для упругости: этот создан для увлажнения',
      'Вам нужен безмасляный гель: тогда ваша туба - Problem Control Cream',
    ],
    note:
      'Только для наружного применения, держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
  },
  routine: {
    eyebrow: 'Дополните уход',
    title: 'Сначала наполнить, потом запечатать.',
    intro:
      'Крем - последний шаг. Эти средства идут перед ним, и любое можно добавить прямо здесь.',
    thisProduct: 'Этот продукт',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать вариант',
    fromPrice: 'От',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Частые вопросы',
    items: [
      {
        q: 'Сыворотка или крем, если брать что-то одно?',
        a: 'В сыворотке 2 000 ppm лёгкой гидролизованной гиалуроновой кислоты, которая наполняет поверхность водой. В креме 1 000,9 ppm высокомолекулярной формы, которая удерживает её там. Сухой коже начните с крема, коже, которая к обеду стягивается, - с сыворотки. Вместе они делают обе работы.',
      },
      {
        q: 'Как долго он действует?',
        a: 'Сразу после одного нанесения увлажнённость выросла на 82% и через 72 часа всё ещё была значимо выше исходной. Наносите утром и вечером, чтобы поддерживать этот уровень.',
      },
      {
        q: 'Что такое Hyaluronan 11?',
        a: 'Комплекс из одиннадцати форм гиалуроновой кислоты, от лёгких до плотных. Здесь его ведут 1 000,9 ppm высокомолекулярной формы, которая удерживает воду.',
      },
      {
        q: 'Можно взять в самолёт?',
        a: 'Туба 50 г помещается в ручную кладь, а сухой воздух в салоне - именно то место, где крем показывает себя. Туба 250 г остаётся дома.',
      },
      {
        q: 'Есть ли запах?',
        a: 'Да, лёгкий цветочный: масло цветков герани, цитронеллол и гераниол. Если вы полностью избегаете ароматов, выберите другой крем.',
      },
      {
        q: 'Можно хранить в холодильнике?',
        a: 'Лучше не надо: холод меняет вязкость и текстуру. Прохладное сухое место - идеально.',
      },
      {
        q: 'Какой pH?',
        a: '6,00, близко к коже, при спецификации 6,0 ± 1,0.',
      },
    ],
  },
  details: {
    eyebrow: 'Спецификация',
    title: 'Характеристики',
    rows: [
      { label: 'Формат', value: 'Несмываемый увлажняющий крем, туба' },
      { label: 'Объёмы', value: '50 г для домашнего ухода / 250 г для профессионального применения' },
      { label: 'Назначение', value: 'Увлажнение и удержание влаги' },
      { label: 'Применение', value: 'Утром и вечером после сыворотки' },
      { label: 'Тип кожи', value: 'Сухая и обезвоженная кожа любого типа' },
      { label: 'Гиалуроновая кислота', value: '1 000,9 ppm, высокомолекулярная форма' },
      { label: 'pH', value: '6,00 при спецификации 6,0 ± 1,0' },
      { label: 'Аромат', value: 'Лёгкий цветочный; масло герани, цитронеллол и гераниол' },
      { label: 'Хранение', value: 'В прохладном сухом месте, не в холодильнике' },
      { label: 'Срок годности', value: 'Три года в невскрытом виде; точная дата указана на упаковке' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Свежесть под замком.',
    body: 'Влага внутри, влага удержана, и всё ещё на месте через три дня после одного нанесения.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const BY_LOCALE: Record<MhcreamLocale, MhcreamCopy> = { en: EN, ar: AR, ru: RU }

export function getMhcreamCopy(locale: string): MhcreamCopy {
  return BY_LOCALE[(locale as MhcreamLocale) in BY_LOCALE ? (locale as MhcreamLocale) : 'en']
}
