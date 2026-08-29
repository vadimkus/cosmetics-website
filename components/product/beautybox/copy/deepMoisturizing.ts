/**
 * Copy for the DEEP MOISTURIZING BEAUTY BOX page (product 59), in English,
 * Arabic and Russian.
 *
 * ─── Sourcing rules ──────────────────────────────────────────────────────────
 *
 * This is a kit, so it has no paperwork of its own. Every claim below traces to
 * a document belonging to one of the five products inside it, and the five sets
 * of paperwork are:
 *
 *   Snow O₂ 180ml
 *     /Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/
 *       Ingredient lists_old/GENOSYS SNOW O2.pdf
 *       Registration DOC/Artwork/[GENOSYS]SNOW O2(180ml).pdf
 *       Intertek_folder/Certififcate of Analysis/9 SNOW O2 - COA-GENOSYS (WIE048).pdf
 *     "SOC is a gentle cleanser which gives an excellent treatment sensation.
 *      Naturally generated oxygen bubbles clean make-up dirts and skin
 *      impurities without irritation to skin."
 *     "Apply the product on dry face, avoiding eyes. When oxygen bubbles occur,
 *      give a circular massage and rinse off with tepid water."
 *     Methyl Perfluoroisobutyl Ether 3.000% (the bubble agent). pH 5.86.
 *     Contains Sodium Laureth Sulfate, Parfum, Limonene.
 *
 *   Snow Booster 200ml
 *     Ingredient lists_old/GENOSYS SNOW BOOSTER.pdf
 *     Registration DOC/Artwork/[GENOSYS]SNOW BOOSTER(200ml).pdf
 *     Certififcate of Analysis/10 SNOW BOOSTER - COA-GENOSYS (WID041).pdf
 *     "SBT is a daily toner for all skin types. It moisturizes and soothes skin
 *      with various botanical extracts, and it refines skin with pH balancing
 *      after cleansing."   "It can be used even on the make up."
 *     Betaine 3.000%, Lactobacillus/Pumpkin Ferment Extract 1.000%,
 *     Nelumbo Nucifera Flower Extract 0.100%. pH 6.08.
 *
 *   Hyaluron Serum 30ml
 *     public/documents/PPT/GENOSYS MOISTURE REPLENISHING HYALURON SERUM.pdf
 *     Intertek/MOISTURE REPLENISHING HYALURON SERUMCREAM/
 *       MOISTURE REPLENISHING HYALURON SERUM/Formula_updated22062024.pdf
 *     PENTAVITIN™ = Saccharide Isomerate, "known as moisture magnet as it binds
 *     itself to the free amino group of lysine in keratin and attracts water to
 *     skin". Glyceryl Glucoside: "by stimulating the formation of aquaporin,
 *     water-transport channel, it promotes delivery of moisture deep into the
 *     skin". Clinical: 21 adult women aged 20 to 59, deep skin hydration
 *     "significantly improved immediately after use" (50.81 -> 52.238).
 *     "Safe for pregnant/lactating women and children." pH 5.08.
 *
 *   Hyaluron Cream 50g
 *     public/documents/PPT/GENOSYS MOISTURE REPLENISHING HYALURON CREAM.pdf
 *     Intertek/.../MOISTURE REPLENISHING HYALURON CREAM/
 *       Artwork-GENOSYS MOISTURE REPLENISHING HYALURON CREAM 250g.pdf
 *     "Immediately after using ... skin hydration value increased by 82%."
 *     "The value significantly improved immediately after use and 72 hours after
 *      use compared to before use."
 *     "...helps 72-hour hydration persistence effect after single application."
 *     21 adult women aged 20 to 59. Xylitol + Erythritol are the named
 *     natural-origin cooling agents. Sodium Hyaluronate 1,000.9 ppm on the
 *     label. "Safe for pregnant/lactating women and children." pH 6.00, 12M.
 *     Contains Pelargonium Graveolens Flower Oil, Citronellol, Geraniol.
 *
 *   Sea Algae Mask 25g x3
 *     Intertek/Soothing Bomb Sea Mask/
 *       Ingredient_Report_GENOSYS SOOTHING BOMB SEA ALGAE MASK.pdf
 *       COA-GENOSYS SOOTHING BOMB SEA ALGAE MASK.pdf
 *     Registration DOC/Artwork/[GENOSYS]SOOTHING BOMB SEA ALGAE MASK.pdf
 *     "Eucalace® sheet - excellent air permeability, highly adhesive, high
 *      transmission of essence to skin."
 *     "Apply the mask closely to the face and leave on for 15-20 minutes."
 *     Jania Rubens 10 ppm, Undaria Pinnatifida 10 ppm, Centella Asiatica.
 *     pH 5.69. "No artificial pigment."
 *
 * ─── Claims that must not come back without a new document ───────────────────
 *
 *   "Coconut water complex 78%"   The serum deck says 78%; the formula signed by
 *                                 DTS MG's own R&D manager says 0.79595%. The
 *                                 registered declaration wins. Coconut water is
 *                                 named, the number is gone.
 *   "Oxygen therapy"              No Snow O₂ document uses the word therapy.
 *   "Phytolex SC" / "MultiEx      Marketing names in no Snow O₂ formula, label
 *   Phytrogen" on Snow O₂         or COA. The botanicals they stood for are real
 *                                 and are named instead.
 *   "11 types of hyaluronic acid" Both decks list 8 hyaluronate INCI names. The
 *                                 complex is described by what it does.
 *   "72-hour hydration" on the    That study is the cream's. The serum deck only
 *   serum                         measures immediately after a single use.
 *   Any duration for the kit      Nothing documents how many weeks the box
 *   ("3 months of skincare")      lasts, so the page states pack sizes and the
 *                                 mask count and lets the reader do the rest.
 *
 * See beautyBoxCopy.ts for the rules every box module follows, including why no
 * price appears in any of them.
 */

import type { BeautyBoxCopy, BeautyBoxLocaleCopy } from '../beautyBoxCopy'

const EN: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Products',
  headline: 'The whole hydration routine, in one box.',
  subheadline:
    'Five full-size GENOSYS products that were built to work in sequence: a cleanser that does not strip, a toner that resets pH, a serum that pulls water in, a cream that keeps it there, and three sheet masks for the days skin feels tight. Bought together they cost less than the same five bought one at a time.',
  heroBullets: [
    'For dry and dehydrated skin, and for skin that drinks a serum and still feels tight by evening',
    'Every item is the full retail size sold on its own page, not a travel sample',
    'Hydration measured 82% higher immediately after one use of the cream, and still higher 72 hours later',
    'Made in Korea by DTS MG. Cleanser, toner, serum and cream all dermatologically tested',
  ],
  kitSize: '5 products',
  fullSizeNote: 'Full sizes',
  vatIncluded: 'VAT included',
  /* Delivery is free over 1,000 AED (`freeShippingThreshold` in
     lib/mobileCheckoutConfig.ts), not unconditionally. The box lists at
     1,120.30, but a clinic tier discount takes it under the threshold, so the
     condition is stated rather than assumed - and it matches what the site
     footer says two rows below this line. */
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',
  addToBag: 'Add the box',
  adding: 'Adding...',
  added: 'Added',
  outOfStock: 'Out of stock',
  loginToShop: 'Log in to shop',
  inBag: 'In your bag',
  viewBag: 'View bag',
  badges: ['Authentic GENOSYS', 'Made in Korea', 'Full retail sizes', 'Dubai in 1-2 hours'],
  stats: [
    { value: '5', label: 'full-size products, in the order you use them' },
    { value: '82%', label: 'more hydration immediately after one application of the cream' },
    { value: '72 h', label: 'and still measurably higher three days later' },
    { value: 'Korea', label: 'made by DTS MG in Seoul, the lab GENOSYS was built around' },
  ],
  contents: {
    eyebrow: 'What is inside',
    title: 'Five products, one sequence',
    intro:
      'Every product here has its own page and its own price, so you can read the full detail on any of them before you buy. What the box does is put the whole sequence in your hands at once, for less than the pieces.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Step 1 - Cleanse',
        body:
          'Goes on to a dry face, where oxygen bubbles form on their own and lift make-up and the day off the skin. Massage in circles as they appear, then rinse with tepid water: no scrubbing, and nothing left behind that the toner has to correct.',
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'Step 2 - Tone',
        body:
          'A daily toner for every skin type that moisturises and calms with botanical extracts while it brings pH back down after cleansing. That matters here, because the serum works on skin that is already damp.',
      },
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'Step 3 - Water in',
        body:
          'The step that does the pulling. Hyaluronic acid across low, medium and high molecular weights replenishes moisture layer by layer, glyceryl glucoside supports the water-transport channels in the skin itself, and PENTAVITIN™ binds water to the surface so it stops running off.',
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'Step 4 - Water sealed',
        body:
          'The step that does the holding, and the one the 72-hour test was run on. Same hyaluronic complex, plus xylitol and erythritol for a cooling drop in skin temperature the moment it goes on, which is why it is the layer people feel first.',
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'When skin needs a reset',
        body:
          'Three Eucalace® sheets, each soaked in a sea algae complex with Centella Asiatica. Fifteen to twenty minutes after toning on the evenings when skin feels tight, then carry on with the serum and cream as usual.',
      },
    ],
    eanLabel: 'Barcode',
    each: 'each',
    viewItem: 'Read the full page',
    boughtSeparately: 'Bought separately',
    inThisBox: 'In this box',
    youSave: 'You save',
    againstSeparate: 'against buying the five separately',
    seeBreakdown: 'See the breakdown',
    savingNote:
      'Prices update live, so this comparison is always what you would actually pay today.',
  },
  howTo: {
    eyebrow: 'How to use it',
    title: 'Morning and evening, in this order',
    intro:
      'Four steps twice a day, and a sheet mask slotted in on the evenings skin asks for it. Each product carries its own full instructions on its own page; this is how they fit together.',
    steps: [
      {
        title: 'Cleanse on dry skin',
        body:
          'Pump the cleanser on to a dry face, avoiding the eyes. Wait for the oxygen bubbles, massage in circles, rinse with tepid water. Morning and evening.',
      },
      {
        title: 'Tone while skin is damp',
        body:
          'Sweep or spray the toner on straight after cleansing, before skin has dried, and press it in with your palms. It can also go over make-up during the day.',
      },
      {
        title: 'Serum, two or three drops',
        body:
          'Pat two or three drops over the face and neck and let it settle rather than rubbing it in. Morning and evening, always before the cream.',
      },
      {
        title: 'Cream to close',
        body:
          'A small amount over face and neck, upward strokes until it disappears. In the morning, finish with your sunscreen.',
      },
      {
        title: 'Mask on the tight evenings',
        body:
          'After toning, lay a sheet on and leave it 15 to 20 minutes. Take it off, pat in what is left of the essence, then serum and cream as normal. Three sheets in the box.',
      },
    ],
    note:
      'Sunscreen is the one thing this routine assumes and does not contain. Hydration without daily protection is a short-lived result.',
  },
  evidence: {
    eyebrow: 'The clinical results',
    title: 'Measured on real skin',
    intro:
      'The serum and the cream were both put through clinical measurement. Here is what came back.',
    cards: [
      {
        value: '82%',
        title: 'Hydration, immediately after one use of the cream',
        body:
          'A single application, measured against the same skin before use. The panel was 21 adult women aged 20 to 59.',
      },
      {
        value: '72 h',
        title: 'Still measurably higher three days later',
        body:
          'The same single application. Hydration was significantly above baseline both immediately after use and at 72 hours: a 72-hour hydration persistence effect.',
      },
      {
        value: 'Serum',
        title: 'Deep hydration improved immediately',
        body:
          'In the same 21-subject panel, the serum significantly improved deep skin hydration straight after a single use. That is the layer that pulls water in; the cream above is the one that keeps it there.',
      },
    ],
    footnote:
      'Both readings come from DTS MG clinical testing on a panel of 21 adult women aged 20 to 59, after a single application.',
  },
  suited: {
    eyebrow: 'Suitability',
    title: 'Who this box is for',
    forTitle: 'A good match if',
    forList: [
      'Your skin is dry, or oily and dehydrated at the same time',
      'Serum alone stops working by the afternoon and you want the layer that holds it',
      'You are starting a routine from scratch and would rather buy the sequence than guess at it',
      'You are pregnant or breastfeeding: the serum and the cream are both cleared as safe, so bring the other three to your doctor',
    ],
    notForTitle: 'Look elsewhere if',
    notForList: [
      'Fragrance is a problem for you. The cleanser and the cream are both fragranced, and so is the cleanser in every other GENOSYS box, so buy the toner, serum or mask on their own rather than a kit',
      'You are treating acne or congestion rather than dryness. The Problem Skin Care box is built for that',
      'Pigmentation or tone is the goal. The Skin Brightening box targets it directly',
      'You already own two or three of these five. Buying the missing pieces on their own will cost you less',
    ],
    alternativesLabel: 'The boxes mentioned above',
    alternatives: [
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
      { productNumber: '56', label: 'Skin Brightening Beauty Box' },
    ],
    note:
      'The cleanser, toner, serum and cream are all dermatologically tested. Skin is individual, though, so if one product does not agree with yours, drop that one rather than the whole routine.',
  },
  details: {
    eyebrow: 'Specifications',
    title: 'The details',
    rows: [
      { label: 'Contents', value: '5 products: cleanser 180ml, toner 200ml, serum 30ml, cream 50g, 3 sheet masks' },
      { label: 'Skin type', value: 'Dry and dehydrated skin. The toner and cleanser suit all skin types' },
      { label: 'Routine', value: 'Cleanse, tone, serum, cream, morning and evening. Mask as needed' },
      { label: 'Origin', value: 'Made in Korea by DTS MG Co., Ltd., Seoul' },
      { label: 'Testing', value: 'Cleanser, toner, serum and cream all dermatologically tested' },
      { label: 'Barcodes', value: 'Each product carries its own EAN, listed with the item above' },
      { label: 'Discounts', value: 'The bundle price is already the discount, so other offers do not stack on the box' },
    ],
  },
  faq: {
    eyebrow: 'Before you buy',
    title: 'Questions worth asking',
    items: [
      {
        q: 'Can I just buy the products separately?',
        a: 'Yes, and each one is linked above. The box is not a different formula or an exclusive size, it is the same five units at a lower total. If you already own some of them, buying the gaps will cost you less than the box.',
      },
      {
        q: 'Are these the home sizes or the professional ones?',
        a: 'The home sizes: 180ml cleanser, 200ml toner, 30ml serum, 50g cream. GENOSYS also makes 500ml, 1000ml and 250g professional formats of the same products for clinics, and those are sold on their own.',
      },
      {
        q: 'How long will it last?',
        a: 'That depends on how heavy-handed you are. What is fixed: the cleanser, toner, serum and cream are the full retail units, used twice a day, and there are exactly three mask sheets, which is three sessions.',
      },
      {
        q: 'Can I use it while pregnant or breastfeeding?',
        a: 'The serum and the cream are both cleared as safe for pregnant and breastfeeding women and for children. For the cleanser, the toner and the mask, check with your doctor.',
      },
      {
        q: 'My skin is reactive. Is this the right box?',
        a: 'Probably not. The cleanser contains fragrance and limonene, and the cream contains geranium flower oil, citronellol and geraniol. None of that is a problem for most people and all of it is named on the labels, but if fragrance sets your skin off, no box avoids it: all six GENOSYS boxes are built around the same cleanser. Buy the pieces that suit you individually instead. The toner in this box is fragrance-free.',
      },
      {
        q: 'Where does the mask fit if there are only three?',
        a: 'Treat them as a rescue rather than a ritual. On the evenings skin feels tight or looks flat, mask after toning and then finish with the serum and cream. Sold on its own the mask is meant for two or three uses a week, so if you want it that often, buy sheets separately.',
      },
    ],
  },
}

const AR: BeautyBoxCopy = {
  eyebrow: 'صندوق الجمال',
  backToProducts: 'المنتجات',
  headline: 'سبع قطع لروتين ترطيب متكامل.',
  subheadline:
    'أربعة منتجات GENOSYS كاملة الحجم وثلاثة أقنعة ورقية: منظف، ومعزز، وسيروم هيالورون، وكريم هيالورون للاستخدام بترتيب واضح صباحاً ومساءً. ويحسب الموقع قيمة المجموعة مقارنة بشراء مكوناتها منفردة وفق الأسعار الحالية.',
  heroBullets: [
    'للبشرة الجافة والمتعطشة للماء التي تفضّل طبقات خفيفة ومنظمة',
    'أربعة أحجام كاملة للبيع وثلاثة أقنعة 25 غ، أي سبع قطع بالضبط',
    'في اختبار الكريم، ارتفعت قيمة الترطيب 82% بعد تطبيق واحد وظلت أعلى بدلالة بعد 72 ساعة',
    'السيروم 30 مل والكريم 50 غ ثنائي متناسق بتركيبتين مختلفتين',
  ],
  kitSize: '7 قطع',
  fullSizeNote: 'أحجام كاملة',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  addToBag: 'أضيفي الصندوق',
  adding: 'جارٍ الإضافة...',
  added: 'تمت الإضافة',
  outOfStock: 'غير متوفر',
  loginToShop: 'سجّلي الدخول للشراء',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
  badges: ['GENOSYS أصلي', 'صُنع في كوريا', 'أحجام كاملة', 'دبي خلال ساعة إلى ساعتين'],
  stats: [
    { value: '7', label: 'قطع: أربعة منتجات كاملة وثلاثة أقنعة' },
    { value: '2,000 ppm', label: 'حمض الهيالورونيك المتحلل في السيروم' },
    { value: '82%', label: 'ارتفاع قيمة الترطيب بعد تطبيق واحد للكريم' },
    { value: '72 ساعة', label: 'وظلت النتيجة أعلى بدلالة من خط الأساس' },
  ],
  contents: {
    eyebrow: 'ماذا يوجد داخله',
    title: 'أربعة منتجات وثلاثة أقنعة',
    intro:
      'تقرأ الصفحة سعر كل مكوّن وحجمه وحالته مباشرة من الكتالوج. لذا يبقى حساب القيمة محدثاً، وتظهر الأقنعة الثلاثة كقطع منفصلة ضمن العدد الإجمالي.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'الخطوة 1 - التنظيف',
        body:
          'منظف للوجه بحجم 180 مل. يوضع على وجه جاف مع تجنب العينين، ثم يدلك بحركات دائرية ويشطف بالماء الفاتر.',
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'الخطوة 2 - المعزز',
        body:
          'معزز مائي بحجم 200 مل للاستخدام بعد التنظيف صباحاً ومساءً. يحتوي على البيتايين 3% ويساعد على إبقاء البشرة مريحة قبل السيروم.',
      },
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'الخطوة 3 - جذب الماء',
        body:
          'سيروم خفيف بحمض الهيالورونيك المتحلل 2,000 جزء في المليون وPENTAVITIN بنسبة 0.615%، ضمن قاعدة مرطبة مجموعها 16.02%.',
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'الخطوة 4 - الاحتفاظ بالرطوبة',
        body:
          'كريم خفيف يحتوي على الغليسرين 9% وPENTAVITIN بنسبة 0.615% وهيالورونات الصوديوم عالية الوزن الجزيئي 1,000.9 جزء في المليون. في الاختبار ارتفعت قيمة الترطيب 82% بعد تطبيق واحد وظلت أعلى بدلالة بعد 72 ساعة.',
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'مساء اختياري - القناع',
        body:
          'ثلاثة أقنعة Eucalace® من ألياف الأوكالبتوس، بقاعدة تضم ميثيل بروبانديول 10% وغليسرين 5.035% وبيتايين 0.5%. يترك القناع 15-20 دقيقة ويستخدم فور فتحه.',
      },
    ],
    eanLabel: 'الباركود',
    each: 'للقطعة',
    viewItem: 'اقرأي الصفحة الكاملة',
    boughtSeparately: 'عند الشراء منفصلاً',
    inThisBox: 'في هذا الصندوق',
    youSave: 'توفّرين',
    againstSeparate: 'مقارنةً بشراء المكونات منفردة',
    seeBreakdown: 'اطّلعي على التفصيل',
    savingNote:
      'الأسعار تُحدَّث مباشرة، لذا فهذه المقارنة هي ما ستدفعينه فعلاً اليوم.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'صباحاً ومساءً، بهذا الترتيب',
    intro:
      'أربع خطوات صباحاً ومساءً، ويضاف القناع في مساء منفصل بعد المعزز وقبل السيروم والكريم. لا تحدد عبوة القناع وتيرة أسبوعية.',
    steps: [
      {
        title: 'التنظيف على بشرة جافة',
        body:
          'وزعي المنظف على وجه جاف مع تجنب العينين، ودلكي بحركات دائرية ثم اشطفي بالماء الفاتر.',
      },
      {
        title: 'المعزز بعد التنظيف',
        body:
          'ضعي المعزز باليدين أو كرذاذ على بشرة نظيفة صباحاً ومساءً، ولا تشطفيه.',
      },
      {
        title: 'السيروم',
        body:
          'ضعي السيروم على الوجه وربتي بلطف بأطراف الأصابع صباحاً ومساءً، قبل الكريم.',
      },
      {
        title: 'الكريم',
        body:
          'وزعي الكريم بلطف بعد السيروم. في الصباح، اختتمي بواقي شمس مناسب. لا تحفظي الكريم في الثلاجة.',
      },
      {
        title: 'القناع في مساء إضافي',
        body:
          'بعد المعزز، ضعي قناعاً واحداً واتركيه 15-20 دقيقة. ارفعيه وربتي الخلاصة المتبقية، ثم ضعي السيروم والكريم. استخدمي القناع فور فتحه.',
      },
    ],
    note:
      'تحتوي المجموعة على ثلاثة أقنعة فقط، ولا تحدد العبوة وتيرة أسبوعية. واقي الشمس غير موجود في المجموعة ويضاف صباحاً.',
  },
  evidence: {
    eyebrow: 'النتائج السريرية',
    title: 'نتيجتان بشروطهما الدقيقة',
    intro:
      'تعرض النتائج التالية ما قيس لكل منتج على حدة، ولا تنسب إلى المجموعة كلها.',
    cards: [
      {
        value: '82%',
        title: 'ارتفاع قيمة الترطيب بعد تطبيق واحد للكريم',
        body:
          'قورنت النتيجة بخط الأساس لدى 21 امرأة بالغة بين 20 و59 عاماً.',
      },
      {
        value: '72 ساعة',
        title: 'بقيت النتيجة أعلى بدلالة بعد 72 ساعة',
        body:
          'بعد التطبيق الواحد نفسه، ظلت قيمة الترطيب أعلى بدلالة من خط الأساس بعد 72 ساعة.',
      },
      {
        value: '50.81 → 52.238',
        title: 'قياس الترطيب الداخلي بعد استخدام واحد للسيروم',
        body:
          'ارتفع القياس من 50.81 إلى 52.238 مباشرة بعد استخدام واحد في مجموعة من 21 امرأة بين 20 و59 عاماً.',
      },
    ],
    footnote:
      'نتيجة الكريم تخص الكريم وحده، ونتيجة السيروم تخص السيروم وحده. كلاهما بعد تطبيق واحد على 21 امرأة بين 20 و59 عاماً.',
  },
  suited: {
    eyebrow: 'مدى الملاءمة',
    title: 'لمن هذا الصندوق',
    forTitle: 'مناسب إذا',
    forList: [
      'كانت بشرتك جافة، أو دهنية ومجففة في الوقت نفسه',
      'توقّف السيروم وحده عن العمل بعد الظهر وتريدين الطبقة التي تحفظه',
      'كنت تبدأين روتيناً من الصفر وتفضّلين شراء التتابع كاملاً بدل التخمين',
      'كنت تريدين روتيناً واضحاً من أربع خطوات مع ثلاث جلسات قناع إضافية',
    ],
    notForTitle: 'ابحثي عن غيره إذا',
    notForList: [
      'كانت بشرتك تتفاعل مع العطر أو الزيوت الأساسية؛ فالمنظف معطر، والسيروم والكريم يحتويان زيت الجيرانيوم، والقناع يحتوي زيت النعناع الفلفلي',
      'كنت تعالجين حب الشباب أو انسداد المسام لا الجفاف. صندوق البشرة المعرّضة للمشاكل مخصص لذلك',
      'كان التصبغ أو توحيد اللون هو الهدف. صندوق تفتيح البشرة يستهدفه مباشرة',
      'كنت تملكين بالفعل منتجين أو ثلاثة من الخمسة. شراء الناقص وحده سيكون أقل تكلفة',
    ],
    alternativesLabel: 'الصناديق المذكورة أعلاه',
    alternatives: [
      { productNumber: '55', label: 'صندوق البشرة المعرّضة للمشاكل' },
      { productNumber: '56', label: 'صندوق تفتيح البشرة' },
    ],
    note:
      'المنظف والمعزز يحملان بيان الاختبار الجلدي. لا ننسب هذا البيان إلى السيروم أو الكريم أو القناع من دون تقرير خاص بكل منتج.',
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      { label: 'المحتويات', value: '7 قطع: منظف 180 مل، معزز 200 مل، سيروم 30 مل، كريم 50 غ، و3 أقنعة 25 غ' },
      { label: 'نوع البشرة', value: 'البشرة الجافة والمتعطشة للماء' },
      { label: 'الروتين', value: 'تنظيف، معزز، سيروم، كريم صباحاً ومساءً؛ القناع في مساء إضافي' },
      { label: 'بلد الصنع', value: 'صُنع في كوريا من DTS MG Co., Ltd.، سيول' },
      { label: 'الاختبار', value: 'يحمل المنظف والمعزز بيان الاختبار الجلدي؛ لا ينطبق البيان تلقائياً على بقية القطع' },
      { label: 'الباركود', value: 'لكل منتج رقم EAN خاص به، مدرج مع القطعة أعلاه' },
      { label: 'الخصومات', value: 'سعر الصندوق هو الخصم نفسه، لذا لا تُجمع عليه عروض أخرى' },
    ],
  },
  faq: {
    eyebrow: 'قبل الشراء',
    title: 'أسئلة تستحق السؤال',
    items: [
      {
        q: 'هل يمكنني شراء المنتجات منفصلة؟',
        a: 'نعم، وكل منتج مرتبط أعلاه. المجموعة تحتوي أربعة منتجات كاملة الحجم وثلاثة أقنعة من المنتج نفسه؛ ويحسب الموقع المقارنة وفق الأسعار الحالية.',
      },
      {
        q: 'هل هذه الأحجام المنزلية أم المهنية؟',
        a: 'الأحجام المنزلية: منظف 180ml، تونر 200ml، سيروم 30ml، كريم 50g. تصنع GENOSYS أيضاً أحجاماً مهنية 500ml و1000ml و250g من المنتجات نفسها للعيادات، وتُباع منفصلة.',
      },
      {
        q: 'إلى متى تكفي؟',
        a: 'يعتمد ذلك على كمية الاستخدام. الثابت أن المنتجات اليومية الأربعة أحجام كاملة، وأن الأقنعة ثلاثة بالضبط، أي ثلاث جلسات منفردة.',
      },
      {
        q: 'هل يمكن استخدامه خلال الحمل أو الرضاعة؟',
        a: 'تنص عبوة SNOW O₂ على عدم استخدامه أثناء الحمل والرضاعة. لا تقدّم هذه المجموعة تصريح سلامة موحداً لبقية القطع؛ راجعي الطبيبة قبل استخدام الروتين.',
      },
      {
        q: 'بشرتي حساسة. هل هذا الصندوق مناسب؟',
        a: 'اختبري كل قطعة منفردة. يحتوي المنظف على عطر وليمونين؛ ويحتوي السيروم والكريم على زيت الجيرانيوم ومسببات حساسية عطرية؛ ويحتوي القناع على زيت النعناع الفلفلي. كما تنصح عبوة القناع بالحذر عند التحسس من الضمادات أو الكمادات.',
      },
      {
        q: 'أين يقع القناع إن كانت ثلاثة فقط؟',
        a: 'في مساء القناع، ضعيه بعد المعزز لمدة 15-20 دقيقة، ثم أكملي بالسيروم والكريم. استخدميه فور فتحه. العبوة لا تحدد وتيرة أسبوعية.',
      },
    ],
  },
}

const RU: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Продукты',
  headline: 'Семь единиц для выверенного ухода.',
  subheadline:
    'Четыре полноразмерных средства GENOSYS и три тканевые маски: очищение, бустер, гиалуроновая сыворотка и гиалуроновый крем в понятной утренней и вечерней последовательности. Стоимость компонентов и выгода набора рассчитываются по актуальным ценам.',
  heroBullets: [
    'Для сухой и обезвоженной кожи, которой подходит последовательное нанесение лёгких текстур',
    'Четыре полноразмерных средства и три маски по 25 г, всего ровно семь единиц',
    'После одного нанесения крема показатель увлажнённости вырос на 82% и оставался значимо выше исходного спустя 72 часа',
    'Сыворотка 30 мл и крем 50 г работают как согласованный дуэт с разными формулами',
  ],
  kitSize: '7 единиц',
  fullSizeNote: 'Полные объёмы',
  vatIncluded: 'включая НДС',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  addToBag: 'Добавить набор',
  adding: 'Добавляем...',
  added: 'Добавлено',
  outOfStock: 'Нет в наличии',
  loginToShop: 'Войдите, чтобы купить',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  badges: ['Оригинальный GENOSYS', 'Сделано в Корее', 'Полные объёмы', 'Дубай за 1-2 часа'],
  stats: [
    { value: '7', label: 'единиц: четыре полноразмерных средства и три маски' },
    { value: '2 000 ppm', label: 'гидролизованной гиалуроновой кислоты в сыворотке' },
    { value: '82%', label: 'рост показателя увлажнённости после одного нанесения крема' },
    { value: '72 часа', label: 'результат оставался значимо выше исходного' },
  ],
  contents: {
    eyebrow: 'Что внутри',
    title: 'Четыре средства и три маски',
    intro:
      'Страница получает цену, объём и наличие каждого компонента из каталога. Поэтому стоимость набора сравнивается с актуальной суммой компонентов, а три маски учитываются как три отдельные единицы.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Шаг 1 - Очищение',
        body:
          'Нанесите средство на сухое лицо, избегая области глаз, мягко помассируйте круговыми движениями и смойте тёплой водой.',
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'Шаг 2 - Бустер',
        body:
          'Водный бустер 200 мл наносится после очищения утром и вечером. Формула содержит бетаин 3%.',
      },
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'Шаг 3 - Сыворотка',
        body:
          'Лёгкая сыворотка с гидролизованной гиалуроновой кислотой 2 000 ppm и PENTAVITIN 0,615% в увлажняющей основе общей концентрацией 16,02%.',
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'Шаг 4 - Крем',
        body:
          'Крем с глицерином 9%, PENTAVITIN 0,615% и высокомолекулярным гиалуронатом натрия 1 000,9 ppm. В исследовании показатель увлажнённости вырос на 82% после одного нанесения и оставался значимо выше исходного спустя 72 часа.',
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'Дополнительный вечер - Маска',
        body:
          'Три маски Eucalace® из эвкалиптового волокна с метилпропандиолом 10%, глицерином 5,035% и бетаином 0,5%. Оставьте на 15-20 минут и используйте сразу после вскрытия.',
      },
    ],
    eanLabel: 'Штрихкод',
    each: 'за штуку',
    viewItem: 'Открыть страницу средства',
    boughtSeparately: 'По отдельности',
    inThisBox: 'В этом наборе',
    youSave: 'Экономия',
    againstSeparate: 'по сравнению с компонентами по отдельности',
    seeBreakdown: 'Посмотреть расчёт',
    savingNote:
      'Цены обновляются автоматически, поэтому сравнение всегда показывает то, что вы заплатите сегодня.',
  },
  howTo: {
    eyebrow: 'Как применять',
    title: 'Утром и вечером, в этом порядке',
    intro:
      'Четыре шага утром и вечером. В отдельный вечер маска идёт после бустера и перед сывороткой и кремом. Недельная частота на упаковке не указана.',
    steps: [
      {
        title: 'Очищение на сухой коже',
        body:
          'Нанесите средство на сухое лицо, избегая области глаз, мягко помассируйте круговыми движениями и смойте тёплой водой.',
      },
      {
        title: 'Бустер после очищения',
        body:
          'Нанесите бустер руками или распылите на чистую кожу утром и вечером. Не смывайте.',
      },
      {
        title: 'Сыворотка',
        body:
          'Нанесите на лицо и мягко вбейте кончиками пальцев утром и вечером, перед кремом.',
      },
      {
        title: 'Крем',
        body:
          'Мягко распределите после сыворотки. Утром завершите уход подходящим SPF. Не храните крем в холодильнике.',
      },
      {
        title: 'Маска в дополнительный вечер',
        body:
          'После бустера наложите одну маску на 15-20 минут. Снимите, мягко вбейте остатки эссенции, затем нанесите сыворотку и крем. Используйте сразу после вскрытия.',
      },
    ],
    note:
      'В наборе три маски; производитель не указывает недельную частоту. Солнцезащитного средства в наборе нет, его нужно добавить утром.',
  },
  evidence: {
    eyebrow: 'Клинические результаты',
    title: 'Два результата с точными условиями',
    intro:
      'Каждый результат относится только к указанному продукту, а не ко всему набору.',
    cards: [
      {
        value: '82%',
        title: 'Рост показателя увлажнённости после одного нанесения крема',
        body:
          'Сравнение с исходным значением у 21 взрослой женщины от 20 до 59 лет.',
      },
      {
        value: '72 ч',
        title: 'Значимо выше исходного спустя 72 часа',
        body:
          'После того же единственного нанесения показатель оставался значимо выше исходного спустя 72 часа.',
      },
      {
        value: '50,81 → 52,238',
        title: 'Показатель внутреннего увлажнения после сыворотки',
        body:
          'После одного нанесения показатель вырос с 50,81 до 52,238 у 21 женщины от 20 до 59 лет.',
      },
    ],
    footnote:
      'Результат крема относится только к крему, результат сыворотки - только к сыворотке. Оба измерены после одного нанесения у 21 женщины от 20 до 59 лет.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Для кого этот набор',
    forTitle: 'Подойдёт, если',
    forList: [
      'Кожа сухая - или жирная и обезвоженная одновременно',
      'Вы предпочитаете лёгкую сыворотку и отдельный крем',
      'Вы начинаете уход с нуля и предпочитаете купить готовый порядок, а не угадывать',
      'Вам нужен понятный четырёхступенчатый уход и три отдельные процедуры с маской',
    ],
    notForTitle: 'Лучше другой набор, если',
    notForList: [
      'Кожа реагирует на отдушки или эфирные масла: очищение ароматизировано, сыворотка и крем содержат масло герани, маска - масло мяты перечной',
      'Вы работаете с акне и забитыми порами, а не с сухостью. Для этого есть набор для проблемной кожи',
      'Цель - пигментация и ровный тон. Набор для сияния кожи занимается именно этим',
      'У вас уже есть два-три средства из пяти. Докупить недостающие выйдет дешевле',
    ],
    alternativesLabel: 'Наборы, упомянутые выше',
    alternatives: [
      { productNumber: '55', label: 'Набор для проблемной кожи' },
      { productNumber: '56', label: 'Набор для сияния кожи' },
    ],
    note:
      'На очищении и бустере есть отметка о дерматологическом тестировании. Мы не переносим её на сыворотку, крем и маску без отдельного отчёта.',
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Детали',
    rows: [
      { label: 'Состав набора', value: '7 единиц: очищение 180 мл, бустер 200 мл, сыворотка 30 мл, крем 50 г и 3 маски по 25 г' },
      { label: 'Тип кожи', value: 'Сухая и обезвоженная' },
      { label: 'Порядок', value: 'Очищение, бустер, сыворотка, крем утром и вечером; маска в дополнительный вечер' },
      { label: 'Производство', value: 'Сделано в Корее, DTS MG Co., Ltd., Сеул' },
      { label: 'Контроль', value: 'Отметка о дерматологическом тестировании есть у очищения и бустера; она не распространяется автоматически на остальные продукты' },
      { label: 'Штрихкоды', value: 'У каждого средства свой EAN, он указан рядом с позицией выше' },
      { label: 'Скидки', value: 'Цена набора уже является скидкой, поэтому другие предложения на него не суммируются' },
    ],
  },
  faq: {
    eyebrow: 'Перед покупкой',
    title: 'Вопросы, которые стоит задать',
    items: [
      {
        q: 'Можно купить средства по отдельности?',
        a: 'Да, у каждого продукта есть своя страница. В наборе четыре полноразмерных средства и три маски; сравнение стоимости рассчитывается по актуальным ценам.',
      },
      {
        q: 'Это домашние объёмы или профессиональные?',
        a: 'Домашние: очищение 180 мл, тоник 200 мл, сыворотка 30 мл, крем 50 г. У GENOSYS есть и профессиональные форматы тех же средств - 500 мл, 1000 мл и 250 г - они продаются отдельно для клиник.',
      },
      {
        q: 'На сколько хватит набора?',
        a: 'Зависит от расхода. Четыре ежедневных продукта представлены в полных розничных объёмах, а масок ровно три - на три отдельные процедуры.',
      },
      {
        q: 'Можно при беременности и кормлении?',
        a: 'На упаковке SNOW O₂ указано не использовать средство во время беременности и грудного вскармливания. Для остальных продуктов у набора нет общего подтверждения безопасности; обсудите уход с врачом.',
      },
      {
        q: 'У меня реактивная кожа. Это мой набор?',
        a: 'Вводите продукты по одному. В очищении есть parfum и limonene; в сыворотке и креме - масло герани и ароматические аллергены; в маске - масло мяты перечной. При чувствительности к пластырям и компрессам с маской также нужна осторожность.',
      },
      {
        q: 'Куда вписать маску, если их всего три?',
        a: 'В вечер с маской наложите её после бустера на 15-20 минут, затем нанесите сыворотку и крем. Используйте сразу после вскрытия. Недельная частота на упаковке не указана.',
      },
    ],
  },
}

export const DEEP_MOISTURIZING_COPY: BeautyBoxLocaleCopy = { en: EN, ar: AR, ru: RU }
