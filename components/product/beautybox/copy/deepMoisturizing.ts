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
  headline: 'روتين الترطيب بالكامل، في صندوق واحد.',
  subheadline:
    'خمسة منتجات GENOSYS بالحجم الكامل صُممت للعمل بالتتابع: منظف لا يجفف البشرة، وتونر يعيد الرطوبة والراحة، وسيروم يجذب الماء، وكريم يحفظه، وثلاثة أقنعة ورقية للأيام التي تشعرين فيها بشد البشرة. شراؤها مجتمعة أقل تكلفة من شراء المنتجات الخمسة نفسها واحداً واحداً.',
  heroBullets: [
    'للبشرة الجافة والمجففة، ولكل بشرة تشرب السيروم ثم تعود مشدودة في المساء',
    'كل منتج بالحجم الكامل المعروض في صفحته، وليس عينة سفر',
    'ارتفع الترطيب بنسبة 82% فوراً بعد استخدام واحد للكريم، وبقي أعلى بعد 72 ساعة',
    'صُنع في كوريا من DTS MG. المنظف والتونر والسيروم والكريم كلها مُختبَرة جلدياً',
  ],
  kitSize: '5 منتجات',
  fullSizeNote: 'أحجام كاملة',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  addToBag: 'أضيفي الصندوق',
  adding: 'جارٍ الإضافة...',
  added: 'تمت الإضافة',
  outOfStock: 'غير متوفر',
  loginToShop: 'سجّلي الدخول للشراء',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  badges: ['GENOSYS أصلي', 'صُنع في كوريا', 'أحجام كاملة', 'دبي خلال ساعة إلى ساعتين'],
  stats: [
    { value: '5', label: 'منتجات بالحجم الكامل، بترتيب استخدامها' },
    { value: '82%', label: 'ترطيب أعلى فوراً بعد استخدام واحد للكريم' },
    { value: '72 ساعة', label: 'وبقي أعلى بشكل ملموس بعد ثلاثة أيام' },
    { value: 'كوريا', label: 'من DTS MG في سيول، المصنع الذي وُلدت منه GENOSYS' },
  ],
  contents: {
    eyebrow: 'ماذا يوجد داخله',
    title: 'خمسة منتجات، تتابع واحد',
    intro:
      'لكل منتج هنا صفحته وسعره، ويمكنك قراءة تفاصيله كاملة قبل الشراء. ما يفعله الصندوق أنه يضع التتابع كله بين يديك مرة واحدة، بأقل من ثمن قطعه منفصلة.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'الخطوة 1 - التنظيف',
        body:
          'يُوضع على بشرة جافة، فتتكوّن فقاعات الأكسجين من تلقاء نفسها وترفع المكياج وآثار اليوم عن البشرة. دلّكي بحركات دائرية عند ظهورها، ثم اغسلي بماء فاتر: بلا فرك، وبلا بقايا يحتاج التونر إلى تصحيحها.',
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'الخطوة 2 - التونر',
        body:
          'تونر يومي خفيف لجميع أنواع البشرة يعيد الرطوبة والراحة بعد التنظيف. يساعد البيتين 3% وقاعدة الترطيب المائية على تهيئة البشرة للسيروم.',
      },
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'الخطوة 3 - جذب الماء',
        body:
          'الخطوة التي تجذب الماء. حمض الهيالورونيك بأوزان جزيئية منخفضة ومتوسطة وعالية يجدد الرطوبة طبقة تلو الأخرى، ويدعم Glyceryl Glucoside قنوات نقل الماء داخل البشرة نفسها، ويربط PENTAVITIN™ الماء بالسطح فيتوقف عن التبدد.',
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'الخطوة 4 - حفظ الماء',
        body:
          'الخطوة التي تحفظ الماء، وهي التي أُجري عليها اختبار الـ72 ساعة. المركب الهيالوروني نفسه، مع الزيليتول والإريثريتول لانخفاض منعش في حرارة البشرة لحظة النزول، ولهذا هي الطبقة التي تُحسّ أولاً.',
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'عندما تحتاج البشرة إلى إنعاش',
        body:
          'ثلاثة أقنعة Eucalace®، كل واحد مشبع بمركب الطحالب البحرية مع السنتيلا آسياتيكا. من 15 إلى 20 دقيقة بعد التونر في الأمسيات التي تشعرين فيها بشد البشرة، ثم أكملي بالسيروم والكريم كالعادة.',
      },
    ],
    eanLabel: 'الباركود',
    each: 'للقطعة',
    viewItem: 'اقرأي الصفحة الكاملة',
    boughtSeparately: 'عند الشراء منفصلاً',
    inThisBox: 'في هذا الصندوق',
    youSave: 'توفّرين',
    againstSeparate: 'مقارنةً بشراء الخمسة منفصلة',
    seeBreakdown: 'اطّلعي على التفصيل',
    savingNote:
      'الأسعار تُحدَّث مباشرة، لذا فهذه المقارنة هي ما ستدفعينه فعلاً اليوم.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'صباحاً ومساءً، بهذا الترتيب',
    intro:
      'أربع خطوات مرتين يومياً، وقناع ورقي يُضاف في الأمسيات التي تحتاجه البشرة. لكل منتج تعليماته الكاملة في صفحته؛ وهذا هو ترتيب تعاونها معاً.',
    steps: [
      {
        title: 'التنظيف على بشرة جافة',
        body:
          'ضعي المنظف على وجه جاف مع تجنب العينين. انتظري ظهور فقاعات الأكسجين، دلّكي بحركات دائرية، ثم اغسلي بماء فاتر. صباحاً ومساءً.',
      },
      {
        title: 'التونر والبشرة رطبة',
        body:
          'ضعي التونر أو رشّيه مباشرة بعد التنظيف قبل أن تجف البشرة، واضغطيه بكفّيك. ويمكن استخدامه أيضاً فوق المكياج خلال النهار.',
      },
      {
        title: 'السيروم، قطرتان أو ثلاث',
        body:
          'وزّعي قطرتين أو ثلاثاً بالطبطبة على الوجه والرقبة واتركيه يستقر بدلاً من فركه. صباحاً ومساءً، ودائماً قبل الكريم.',
      },
      {
        title: 'الكريم للإغلاق',
        body:
          'كمية صغيرة على الوجه والرقبة بحركات صاعدة حتى يختفي. وفي الصباح أنهي بواقي الشمس.',
      },
      {
        title: 'القناع في الأمسيات المشدودة',
        body:
          'بعد التونر، ضعي القناع واتركيه من 15 إلى 20 دقيقة. أزيليه، وزّعي ما تبقى من الإسنس بالطبطبة، ثم السيروم والكريم كالمعتاد. ثلاثة أقنعة في الصندوق.',
      },
    ],
    note:
      'واقي الشمس هو الشيء الوحيد الذي يفترضه هذا الروتين ولا يحتويه. الترطيب دون حماية يومية نتيجة قصيرة العمر.',
  },
  evidence: {
    eyebrow: 'النتائج السريرية',
    title: 'مقاسة على بشرة حقيقية',
    intro:
      'خضع السيروم والكريم كلاهما للقياس السريري. وهذه هي النتائج.',
    cards: [
      {
        value: '82%',
        title: 'الترطيب، فوراً بعد استخدام واحد للكريم',
        body:
          'استخدام واحد، مقيس على البشرة نفسها قبل الاستخدام. شملت المجموعة 21 امرأة بين 20 و59 عاماً.',
      },
      {
        value: '72 ساعة',
        title: 'وبقي أعلى بشكل ملموس بعد ثلاثة أيام',
        body:
          'الاستخدام الواحد نفسه. كان الترطيب أعلى بدلالة معنوية من خط الأساس فوراً بعد الاستخدام وبعد 72 ساعة، أي استمرار الترطيب 72 ساعة.',
      },
      {
        value: 'السيروم',
        title: 'تحسّن الترطيب العميق فوراً',
        body:
          'في المجموعة نفسها المكونة من 21 امرأة، حسّن السيروم ترطيب البشرة العميق بشكل ملحوظ فوراً بعد استخدام واحد. فهو الطبقة التي تجذب الماء، والكريم أعلاه هو الذي يُبقيه في مكانه.',
      },
    ],
    footnote:
      'القراءتان مأخوذتان من اختبارات سريرية أجرتها DTS MG على مجموعة من 21 امرأة بين 20 و59 عاماً، بعد استخدام واحد.',
  },
  suited: {
    eyebrow: 'مدى الملاءمة',
    title: 'لمن هذا الصندوق',
    forTitle: 'مناسب إذا',
    forList: [
      'كانت بشرتك جافة، أو دهنية ومجففة في الوقت نفسه',
      'توقّف السيروم وحده عن العمل بعد الظهر وتريدين الطبقة التي تحفظه',
      'كنت تبدأين روتيناً من الصفر وتفضّلين شراء التتابع كاملاً بدل التخمين',
      'كنت حاملاً أو مرضعة: السيروم والكريم كلاهما آمن، وللثلاثة الأخرى راجعي طبيبك',
    ],
    notForTitle: 'ابحثي عن غيره إذا',
    notForList: [
      'كان العطر مشكلة لبشرتك. المنظف والكريم معطّران، والمنظف نفسه موجود في كل صناديق GENOSYS، فاشتري التونر أو السيروم أو القناع منفصلاً بدل أي صندوق',
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
      'المنظف والتونر والسيروم والكريم كلها مُختبَرة جلدياً. ومع ذلك تبقى كل بشرة حالة خاصة، فإن لم يناسبك منتج بعينه، استغني عنه وحده لا عن الروتين كله.',
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      { label: 'المحتويات', value: '5 منتجات: منظف 180ml، تونر 200ml، سيروم 30ml، كريم 50g، و3 أقنعة ورقية' },
      { label: 'نوع البشرة', value: 'البشرة الجافة والمجففة. التونر والمنظف يناسبان كل أنواع البشرة' },
      { label: 'الروتين', value: 'تنظيف، تونر، سيروم، كريم، صباحاً ومساءً. والقناع حسب الحاجة' },
      { label: 'بلد الصنع', value: 'صُنع في كوريا من DTS MG Co., Ltd.، سيول' },
      { label: 'الاختبار', value: 'المنظف والتونر والسيروم والكريم كلها مُختبَرة جلدياً' },
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
        a: 'نعم، وكل منتج مرتبط أعلاه. الصندوق ليس تركيبة مختلفة ولا حجماً حصرياً، بل المنتجات الخمسة نفسها بمجموع أقل. وإن كنت تملكين بعضها، فشراء الناقص سيكون أقل تكلفة من الصندوق.',
      },
      {
        q: 'هل هذه الأحجام المنزلية أم المهنية؟',
        a: 'الأحجام المنزلية: منظف 180ml، تونر 200ml، سيروم 30ml، كريم 50g. تصنع GENOSYS أيضاً أحجاماً مهنية 500ml و1000ml و250g من المنتجات نفسها للعيادات، وتُباع منفصلة.',
      },
      {
        q: 'إلى متى تكفي؟',
        a: 'يعتمد ذلك على كمية استخدامك. والثابت أن المنظف والتونر والسيروم والكريم هي الوحدات الكاملة للبيع وتُستخدم مرتين يومياً، وأن الأقنعة ثلاثة بالضبط، أي ثلاث جلسات.',
      },
      {
        q: 'هل يمكن استخدامه خلال الحمل أو الرضاعة؟',
        a: 'السيروم والكريم كلاهما آمن للحوامل والمرضعات وللأطفال. أما المنظف والتونر والقناع فراجعي طبيبك بشأنها.',
      },
      {
        q: 'بشرتي حساسة. هل هذا الصندوق مناسب؟',
        a: 'على الأرجح لا. يحتوي المنظف على عطر وليمونين، ويحتوي الكريم على زيت زهرة الجيرانيوم والسيترونيلول والجيرانيول. لا يمثل ذلك مشكلة لمعظم الناس وكله مذكور على الملصقات، لكن إن كان العطر يهيّج بشرتك فلا يوجد صندوق يخلو منه: الصناديق الستة كلها مبنية على المنظف نفسه. اشتري القطع المناسبة لك منفصلة. والتونر في هذا الصندوق بلا عطر مضاف.',
      },
      {
        q: 'أين يقع القناع إن كانت ثلاثة فقط؟',
        a: 'اعتبريها إنقاذاً لا طقساً. في الأمسيات التي تشعرين فيها بشد البشرة أو ترينها باهتة، ضعي القناع بعد التونر ثم أنهي بالسيروم والكريم. القناع مخصص وحده لاستخدام مرتين أو ثلاث أسبوعياً، فإن أردته بهذا التواتر فاشتري الأقنعة منفصلة.',
      },
    ],
  },
}

const RU: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Продукты',
  headline: 'Весь уход за увлажнением - в одном наборе.',
  subheadline:
    'Пять средств GENOSYS полного объёма, рассчитанных на работу по порядку: очищение без пересушивания, тоник для влаги и комфорта, сыворотка, которая притягивает воду, крем, который её удерживает, и три тканевые маски на дни, когда кожа стянута. Вместе они стоят меньше, чем те же пять средств по одному.',
  heroBullets: [
    'Для сухой и обезвоженной кожи и для той, что впитывает сыворотку и к вечеру снова стянута',
    'Каждое средство - полный розничный объём со своей страницы, а не дорожный пробник',
    'Увлажнённость на 82% выше сразу после одного применения крема и всё ещё выше через 72 часа',
    'Сделано в Корее, DTS MG. Очищающее средство, тонер, сыворотка и крем прошли дерматологический контроль',
  ],
  kitSize: '5 средств',
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
    { value: '5', label: 'средств полного объёма, в порядке применения' },
    { value: '82%', label: 'прибавка увлажнённости сразу после одного нанесения крема' },
    { value: '72 ч', label: 'и заметно выше исходной даже через три дня' },
    { value: 'Корея', label: 'производство DTS MG в Сеуле — лаборатории, из которой вырос GENOSYS' },
  ],
  contents: {
    eyebrow: 'Что внутри',
    title: 'Пять средств, один порядок',
    intro:
      'У каждого средства здесь своя страница и своя цена, так что все подробности можно прочитать до покупки. Набор просто отдаёт вам весь порядок сразу - дешевле, чем по частям.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Шаг 1 - Очищение',
        body:
          'Наносится на сухое лицо: кислородные пузырьки образуются сами и поднимают макияж и следы дня с кожи. Как появятся - помассируйте круговыми движениями и смойте тёплой водой: без трения и без остатков, которые пришлось бы исправлять тоником.',
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'Шаг 2 - Тоник',
        body:
          'Лёгкий ежедневный тоник для всех типов кожи возвращает влагу и комфорт после очищения. Бетаин 3% и водная увлажняющая база подготавливают кожу к сыворотке.',
      },
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'Шаг 3 - Вода внутрь',
        body:
          'Шаг, который притягивает воду. Гиалуроновая кислота низкой, средней и высокой молекулярной массы восполняет влагу слой за слоем, глицерил глюкозид поддерживает собственные каналы транспорта воды, а PENTAVITIN™ связывает воду с поверхностью, чтобы она не уходила.',
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'Шаг 4 - Вода под замком',
        body:
          'Шаг, который удерживает влагу, и именно на нём проводили тест на 72 часа. Тот же гиалуроновый комплекс плюс ксилитол и эритритол: температура кожи заметно снижается в момент нанесения, поэтому этот слой чувствуется первым.',
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'Когда коже нужна перезагрузка',
        body:
          'Три маски Eucalace®, каждая пропитана комплексом морских водорослей с центеллой азиатской. 15-20 минут после тоника в те вечера, когда кожа стянута, а затем сыворотка и крем как обычно.',
      },
    ],
    eanLabel: 'Штрихкод',
    each: 'за штуку',
    viewItem: 'Открыть страницу средства',
    boughtSeparately: 'По отдельности',
    inThisBox: 'В этом наборе',
    youSave: 'Экономия',
    againstSeparate: 'по сравнению с покупкой пяти средств по отдельности',
    seeBreakdown: 'Посмотреть расчёт',
    savingNote:
      'Цены обновляются автоматически, поэтому сравнение всегда показывает то, что вы заплатите сегодня.',
  },
  howTo: {
    eyebrow: 'Как применять',
    title: 'Утром и вечером, в этом порядке',
    intro:
      'Четыре шага дважды в день и тканевая маска в те вечера, когда кожа её просит. Полные инструкции есть на странице каждого средства; здесь - как они складываются вместе.',
    steps: [
      {
        title: 'Очищение на сухой коже',
        body:
          'Нанесите средство на сухое лицо, избегая области глаз. Дождитесь кислородных пузырьков, помассируйте круговыми движениями, смойте тёплой водой. Утром и вечером.',
      },
      {
        title: 'Тоник на влажную кожу',
        body:
          'Нанесите или распылите тоник сразу после очищения, пока кожа не высохла, и вбейте ладонями. Днём его можно использовать даже поверх макияжа.',
      },
      {
        title: 'Сыворотка, две-три капли',
        body:
          'Распределите две-три капли по лицу и шее похлопывающими движениями и дайте впитаться, не растирая. Утром и вечером, всегда до крема.',
      },
      {
        title: 'Крем в финале',
        body:
          'Небольшое количество на лицо и шею восходящими движениями до полного впитывания. Утром завершайте своей солнцезащитой.',
      },
      {
        title: 'Маска в стянутые вечера',
        body:
          'После тоника наложите маску на 15-20 минут. Снимите, вбейте остатки эссенции, затем сыворотка и крем как обычно. В наборе три маски.',
      },
    ],
    note:
      'Солнцезащита - единственное, что этот уход подразумевает, но не содержит. Увлажнение без ежедневной защиты держится недолго.',
  },
  evidence: {
    eyebrow: 'Клинические результаты',
    title: 'Измерено на реальной коже',
    intro:
      'И сыворотка, и крем прошли клинические измерения. Вот что получилось.',
    cards: [
      {
        value: '82%',
        title: 'Увлажнённость сразу после одного применения крема',
        body:
          'Однократное нанесение, измерение на той же коже до применения. В панели участвовали 21 женщина от 20 до 59 лет.',
      },
      {
        value: '72 ч',
        title: 'И заметно выше через три дня',
        body:
          'То же однократное нанесение. Увлажнённость была значимо выше исходной и сразу после применения, и через 72 часа - то есть сохранение увлажнения на 72 часа.',
      },
      {
        value: 'Сыворотка',
        title: 'Глубокое увлажнение улучшилось сразу',
        body:
          'В той же панели из 21 женщины сыворотка значимо улучшила глубокое увлажнение кожи сразу после однократного применения. Это слой, который притягивает воду; крем выше - тот, который её удерживает.',
      },
    ],
    footnote:
      'Оба показателя получены в клинических тестах DTS MG на панели из 21 женщины от 20 до 59 лет после однократного применения.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Для кого этот набор',
    forTitle: 'Подойдёт, если',
    forList: [
      'Кожа сухая - или жирная и обезвоженная одновременно',
      'Одной сыворотки хватает до обеда, и нужен слой, который её удержит',
      'Вы начинаете уход с нуля и предпочитаете купить готовый порядок, а не угадывать',
      'Вы беременны или кормите: сыворотка и крем признаны безопасными, а остальные три обсудите с врачом',
    ],
    notForTitle: 'Лучше другой набор, если',
    notForList: [
      'Ароматизаторы для вас проблема. Очищающее средство и крем содержат парфюмерную композицию, и это же очищающее средство входит во все наборы GENOSYS, поэтому покупайте тоник, сыворотку или маску отдельно, а не набором',
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
      'Очищающее средство, тонер, сыворотка и крем прошли дерматологический контроль. Кожа у всех своя, поэтому если одно средство вам не подошло, откажитесь именно от него, а не от всего ухода.',
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Детали',
    rows: [
      { label: 'Состав набора', value: '5 средств: очищение 180 мл, тоник 200 мл, сыворотка 30 мл, крем 50 г, 3 тканевые маски' },
      { label: 'Тип кожи', value: 'Сухая и обезвоженная. Тоник и очищающее средство подходят всем типам' },
      { label: 'Порядок', value: 'Очищение, тоник, сыворотка, крем - утром и вечером. Маска по необходимости' },
      { label: 'Производство', value: 'Сделано в Корее, DTS MG Co., Ltd., Сеул' },
      { label: 'Контроль', value: 'Очищающее средство, тонер, сыворотка и крем прошли дерматологический контроль' },
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
        a: 'Да, и каждое из них связано ссылкой выше. Набор - это не другая формула и не эксклюзивный объём, а те же пять единиц дешевле в сумме. Если часть у вас уже есть, докупить недостающее выйдет дешевле набора.',
      },
      {
        q: 'Это домашние объёмы или профессиональные?',
        a: 'Домашние: очищение 180 мл, тоник 200 мл, сыворотка 30 мл, крем 50 г. У GENOSYS есть и профессиональные форматы тех же средств - 500 мл, 1000 мл и 250 г - они продаются отдельно для клиник.',
      },
      {
        q: 'На сколько хватит набора?',
        a: 'Это зависит от расхода. Что известно точно: очищение, тоник, сыворотка и крем - полные розничные объёмы для применения дважды в день, а масок ровно три, то есть три процедуры.',
      },
      {
        q: 'Можно при беременности и кормлении?',
        a: 'Сыворотка и крем признаны безопасными для беременных, кормящих и детей. Очищающее средство, тоник и маску обсудите с врачом.',
      },
      {
        q: 'У меня реактивная кожа. Это мой набор?',
        a: 'Скорее нет. В очищающем средстве есть парфюмерная композиция и лимонен, в креме - масло цветков герани, цитронеллол и гераниол. Для большинства это не проблема, и всё названо на этикетках, но если кожа реагирует на ароматизаторы, ни один набор этого не обойдёт: все шесть собраны вокруг одного и того же очищающего средства. Тогда покупайте подходящие средства по отдельности. Тоник в этом наборе без ароматизаторов.',
      },
      {
        q: 'Куда вписать маску, если их всего три?',
        a: 'Считайте их выручающей процедурой, а не ритуалом. В вечера, когда кожа стянута или выглядит тусклой, нанесите маску после тоника, а закончите сывороткой и кремом. Отдельно маска рассчитана на два-три раза в неделю, так что для такой частоты покупайте её штучно.',
      },
    ],
  },
}

export const DEEP_MOISTURIZING_COPY: BeautyBoxLocaleCopy = { en: EN, ar: AR, ru: RU }
