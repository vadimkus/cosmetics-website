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
 *     Methyl Perfluoroisobutyl Ether 8% is the bubble agent (product 10's formula
 *     map, NF 38; the 3.000% this block used to quote was stale). pH 5.86.
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
 * ─── Voice (29 Sep 2026, "The refill." campaign) ────────────────────────────
 *
 *   The page sells the box in the campaign's voice: desert sun outside and air
 *   conditioning inside leave skin running on empty, and the routine refills it
 *   and keeps it full. Figures stay as above. The Russian and Arabic keep the
 *   audited cautions: the SNOW O₂ pack's pregnancy and breastfeeding warning, the
 *   fragrance and essential oils by product, no weekly mask frequency, and none of
 *   the phrasings the product 59 test forbids ("layer by layer", instant cooling,
 *   oxygen bubbles, mushrooms, barrier strengthening). The dermatologically tested
 *   mark is printed on the cleanser, toner, serum and cream packs alike.
 *
 * See beautyBoxCopy.ts for the rules every box module follows, including why no
 * price appears in any of them.
 */

import type { BeautyBoxCopy, BeautyBoxLocaleCopy } from '../beautyBoxCopy'

const EN: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Products',
  headline: 'The refill.',
  subheadline:
    'Desert sun outside, air conditioning inside: skin gives its water away all day. This box puts it back and keeps it there. A cleanser that foams up on its own, a fragrance-free toner with 3% betaine, a serum with 2,000 ppm hydrolyzed hyaluronic acid that draws water in, and a cream that holds it: hydration up 82% after one use, and still higher 72 hours later. Plus three sea algae sheet masks for the evenings skin feels tight.',
  heroBullets: [
    'Made for dry, tight and dehydrated skin, and for skin that drinks a serum and is thirsty again by evening',
    'Hydration up 82% straight after one use of the cream, and still measurably higher 72 hours later',
    'A hyaluron duo: 2,000 ppm hydrolyzed hyaluronic acid in the serum, high-weight sodium hyaluronate in the cream',
    'Four full sizes and three sheet masks, for less than the five bought one by one',
  ],
  kitSize: '7 pieces',
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
  badges: ['Authentic GENOSYS', 'Made in Korea', '7 pieces', 'Dubai in 1-2 hours'],
  stats: [
    { value: '+82%', label: 'hydration straight after one use of the cream' },
    { value: '72 h', label: 'and still measurably higher three days later' },
    { value: '2,000 ppm', label: 'hydrolyzed hyaluronic acid in the serum' },
    { value: '7', label: 'pieces: four full sizes and three sheet masks' },
  ],
  contents: {
    eyebrow: 'What is inside',
    title: 'Five products, one refill',
    intro:
      'Every product here has its own page and its own price, so you can read the full detail on any of them before you buy. Together they run the whole refill: clean without stripping the day into your skin, give it a first drink, draw water in, then hold it there, with three masks for the evenings it needs more.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Step 1 - Cleanse',
        body:
          'Goes on a dry face and foams up on its own, lifting make-up and the day off your skin. Massage in circles as the foam rises, then rinse with tepid water. No scrubbing.',
        facts: ['Foams on its own', 'Goes on dry skin', 'Rinse with tepid water', '180ml'],
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'Step 2 - First sip',
        body:
          'A daily toner for every skin type. Betaine at 3% and pumpkin ferment give skin its first drink the moment it is clean, so the serum lands on skin that is already damp. Completely fragrance-free.',
        facts: ['Fragrance-free', 'Betaine 3%', 'Smooth on or spray', '200ml'],
      },
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'Step 3 - Draw it in',
        body:
          'The step that pulls water in. Hydrolyzed hyaluronic acid at 2,000 ppm and PENTAVITIN at 0.615%, in a light coconut-water serum. Pat two or three drops over face and neck, morning and night.',
        facts: ['Hydrolyzed HA 2,000 ppm', 'PENTAVITIN 0.615%', 'Light, fast-sinking', '30ml'],
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'Step 4 - Lock it in',
        body:
          'The step that holds it, and the one the 82% was measured on. High-weight sodium hyaluronate at 1,000.9 ppm stays on the surface and keeps water from leaving, with glycerin at 9% and PENTAVITIN. Hydration was still higher 72 hours after one use.',
        facts: ['+82% after one use', 'Glycerin 9%', 'Sodium hyaluronate 1,000.9 ppm', '50g'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'The top-up, any tight evening',
        body:
          'Three Eucalace® eucalyptus sheets, each soaked in 25 g of essence with sea algae and centella asiatica. Fifteen to twenty minutes after the toner, then lift it off, pat the rest in and carry on with the serum and cream.',
        facts: ['Three sheets', 'Eucalace® sheet', '15-20 minutes', '25g each'],
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
    title: 'Refill twice a day',
    intro:
      'Four steps morning and night, and a sheet mask on the evenings skin asks for more. Each product carries its own full instructions on its own page; this is how they fit together.',
    steps: [
      {
        title: 'Cleanse on dry skin',
        body:
          'Pump the cleanser on to a dry face, avoiding the eyes. Let the foam rise, massage in circles, rinse with tepid water.',
      },
      {
        title: 'Tone while skin is still damp',
        body:
          'Smooth or spray the toner on straight after cleansing and press it in with your palms. No rinsing.',
      },
      {
        title: 'Serum, two or three drops',
        body:
          'Pat it over face and neck and let it settle rather than rubbing it in. Morning and evening, always before the cream.',
      },
      {
        title: 'Cream to lock it in',
        body:
          'A small amount over face and neck, smoothed upward until it disappears. In the morning, finish with your sunscreen. Keep the cream out of the fridge.',
      },
      {
        title: 'The mask, any tight evening',
        body:
          'After the toner, lay a sheet on and leave it 15 to 20 minutes. Lift it off, pat in what is left of the essence, then serum and cream as normal. Use each sheet as soon as it is opened.',
      },
    ],
    note:
      'Sunscreen is the one step this routine assumes and does not contain. Add it every morning over the cream, and the water you put back stays there.',
  },
  evidence: {
    eyebrow: 'The proof',
    title: 'Measured on real skin',
    intro:
      'Hydration is easy to promise. The serum and the cream were both put through clinical measurement, and here is what came back.',
    cards: [
      {
        value: '+82%',
        title: 'Hydration, straight after one use',
        body:
          'One application of the hyaluron cream, measured against the same skin before use, on a panel of 21 women aged 20 to 59.',
      },
      {
        value: '72 h',
        title: 'Still higher three days later',
        body:
          'The same single application: hydration was still measurably above where it started 72 hours on.',
      },
      {
        value: '2,000 ppm',
        title: 'Hydrolyzed hyaluronic acid in the serum',
        body:
          'The step that draws water in, with PENTAVITIN at 0.615% in a coconut-water base. On the same panel it improved skin hydration straight after one use.',
      },
      {
        value: '3%',
        title: 'Betaine in the fragrance-free toner',
        body:
          'The toner\'s hydrator, so skin gets its first drink the moment it is clean and the serum lands on damp skin.',
      },
    ],
    footnote:
      'Both clinical readings come from DTS MG testing on 21 adult women aged 20 to 59, after a single application. The 72-hour result belongs to the cream.',
  },
  suited: {
    eyebrow: 'Suitability',
    title: 'Who this box is for',
    forTitle: 'A good match if',
    forList: [
      'Your skin feels tight by the afternoon, or looks flat and papery after a day in air conditioning',
      'Your skin is dry, or oily and dehydrated at the same time',
      'Serum alone stops working by the afternoon and you want the layer that holds it',
      'You are starting a routine from scratch and would rather buy the sequence than guess at it',
    ],
    notForTitle: 'Look elsewhere if',
    notForList: [
      'Fragrance or essential oils set your skin off. The cleanser carries fragrance and limonene, the serum and cream geranium oil, the mask peppermint oil, so buy the pieces that suit you on their own. The toner is fragrance-free',
      'You are treating acne or congestion rather than dryness. The Problem Skin Care box is built for that',
      'Pigmentation or tone is the goal. The Skin Brightening box targets it directly',
      'You are pregnant or breastfeeding. The SNOW O₂ pack says not to use it then, so talk to your doctor first',
      'You already own two or three of these five. Buying the missing pieces on their own will cost you less',
    ],
    alternativesLabel: 'The boxes mentioned above',
    alternatives: [
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
      { productNumber: '56', label: 'Skin Brightening Beauty Box' },
    ],
    note:
      'Cleanser, toner, serum and cream are all dermatologically tested. Skin is individual, though, so if one product does not agree with yours, drop that one rather than the whole routine.',
  },
  details: {
    eyebrow: 'Specifications',
    title: 'The details',
    rows: [
      { label: 'Contents', value: '7 pieces: cleanser 180ml, toner 200ml, serum 30ml, cream 50g, three sea algae sheet masks 25g each' },
      { label: 'Skin type', value: 'Dry, tight and dehydrated skin. The toner and cleanser suit all skin types' },
      { label: 'Routine', value: 'Cleanse, tone, serum, cream, morning and evening. A mask on any tight evening' },
      { label: 'Results', value: 'Hydration up 82% straight after one use of the cream, still higher at 72 hours. Panel of 21 women aged 20 to 59' },
      { label: 'Fragrance', value: 'The toner is fragrance-free. The cleanser carries fragrance, the serum and cream geranium oil, the mask peppermint oil' },
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
        q: 'Why a serum and a cream, when both carry hyaluronic acid?',
        a: 'Because they do two different jobs. The serum carries hydrolyzed hyaluronic acid, the small form, at 2,000 ppm, and draws water in. The cream carries high-weight sodium hyaluronate, which stays on the surface and keeps that water from leaving. One fills, the other seals, and the 82% was measured on the cream.',
      },
      {
        q: 'Can I just buy the products separately?',
        a: 'Yes, and each one is linked above. The box is not a different formula or an exclusive size, it is the same products at a lower total. If you already own some of them, buying the gaps will cost you less than the box.',
      },
      {
        q: 'Are these the home sizes or the professional ones?',
        a: 'The home sizes: 180ml cleanser, 200ml toner, 30ml serum, 50g cream. GENOSYS also makes 500ml, 1000ml and 250g professional formats of the same products for clinics, and those are sold on their own.',
      },
      {
        q: 'How long will it last?',
        a: 'That depends on how generously you apply. What is fixed: the cleanser, toner, serum and cream are the full retail units, used twice a day, and there are exactly three mask sheets, which is three evenings.',
      },
      {
        q: 'Can I use it while pregnant or breastfeeding?',
        a: 'The SNOW O₂ pack says not to use it during pregnancy or breastfeeding, so talk to your doctor before starting the routine.',
      },
      {
        q: 'My skin is reactive. Is this the right box?',
        a: 'Introduce the products one at a time. The cleanser contains fragrance and limonene, the serum and cream geranium oil with citronellol, the cream geraniol too, and the mask peppermint oil. All of it is named on the labels. If fragrance sets your skin off, no box avoids it, because every GENOSYS box is built around the same cleanser, so buy the pieces that suit you instead. The toner is fragrance-free.',
      },
      {
        q: 'Where does the mask fit if there are only three?',
        a: 'Treat them as a top-up rather than a ritual. On the evenings skin feels tight or looks flat, mask after the toner, then finish with the serum and cream. Use each sheet as soon as it is opened. If you want masks more often, they are sold on their own too.',
      },
    ],
  },
}

const AR: BeautyBoxCopy = {
  eyebrow: 'صندوق الجمال',
  backToProducts: 'المنتجات',
  headline: 'املئيها من جديد.',
  subheadline:
    'شمس الصحراء في الخارج والمكيّف في الداخل: البشرة تفقد ماءها طوال اليوم. هذا الصندوق يعيد إليها الماء ويحافظ عليه. منظف يتحوّل إلى رغوة بنفسه، وتونر بلا عطر مع بيتايين 3%، وسيروم بحمض الهيالورونيك المتحلل 2,000 جزء في المليون يجذب الماء، وكريم يحبسه: ارتفع الترطيب 82% بعد استخدام واحد وبقي أعلى بعد 72 ساعة. ومعها ثلاثة أقنعة ورقية بالطحالب البحرية للأمسيات التي تشعرين فيها بشدّ البشرة.',
  heroBullets: [
    'للبشرة الجافة والمشدودة والمتعطشة للماء، وللبشرة التي تشرب السيروم ثم تعطش مجدداً مع المساء',
    'ارتفع الترطيب 82% مباشرة بعد استخدام واحد للكريم، وبقي أعلى بوضوح بعد 72 ساعة',
    'ثنائي الهيالورون: حمض الهيالورونيك المتحلل 2,000 جزء في المليون في السيروم، وهيالورونات الصوديوم عالية الوزن الجزيئي في الكريم',
    'أربعة أحجام كاملة وثلاثة أقنعة، بسعر أقل من شراء الخمسة منفردة',
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
  badges: ['GENOSYS أصلي', 'صُنع في كوريا', '7 قطع', 'دبي خلال ساعة إلى ساعتين'],
  stats: [
    { value: '+82%', label: 'ترطيب مباشرة بعد استخدام واحد للكريم' },
    { value: '72 ساعة', label: 'وبقي أعلى بوضوح بعد ثلاثة أيام' },
    { value: '2,000 ppm', label: 'حمض الهيالورونيك المتحلل في السيروم' },
    { value: '7', label: 'قطع: أربعة أحجام كاملة وثلاثة أقنعة' },
  ],
  contents: {
    eyebrow: 'ماذا يوجد داخله',
    title: 'خمسة منتجات لإعادة الملء',
    intro:
      'لكل منتج هنا صفحته وسعره، فيمكنك قراءة تفاصيل أي منها قبل الشراء. ومعاً تؤدي إعادة الملء كاملة: تنظيف، ثم رشفة أولى، ثم جذب الماء، ثم حبسه، مع ثلاثة أقنعة للأمسيات التي تحتاج فيها البشرة إلى المزيد.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'الخطوة 1 - التنظيف',
        body:
          'منظف للوجه بحجم 180 مل يوضع على وجه جاف مع تجنب العينين ويتحوّل إلى رغوة بنفسه. دلّكي بحركات دائرية ثم اشطفي بالماء الفاتر، من دون فرك.',
        facts: ['يتحوّل إلى رغوة بنفسه', 'على بشرة جافة', 'يشطف بالماء الفاتر', '180 مل'],
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'الخطوة 2 - الرشفة الأولى',
        body:
          'تونر يومي بحجم 200 مل لكل أنواع البشرة. البيتايين 3% يمنح البشرة رشفتها الأولى بعد التنظيف مباشرة، ليصل السيروم إلى بشرة رطبة. بلا عطر تماماً.',
        facts: ['بلا عطر', 'بيتايين 3%', 'باليدين أو كرذاذ', '200 مل'],
      },
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'الخطوة 3 - جذب الماء',
        body:
          'الخطوة التي تجذب الماء. سيروم خفيف بحمض الهيالورونيك المتحلل 2,000 جزء في المليون وPENTAVITIN بنسبة 0.615%. ربّتيه على الوجه والرقبة صباحاً ومساءً.',
        facts: ['هيالورونيك متحلل 2,000 ppm', 'PENTAVITIN ‏0.615%', 'خفيف وسريع الامتصاص', '30 مل'],
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'الخطوة 4 - حبس الماء',
        body:
          'الخطوة التي تحبس الماء، وعليها قيست نسبة 82%. هيالورونات الصوديوم عالية الوزن الجزيئي 1,000.9 جزء في المليون مع غليسرين 9% وPENTAVITIN بنسبة 0.615%. بقي الترطيب أعلى بعد 72 ساعة من استخدام واحد.',
        facts: ['+82% بعد استخدام واحد', 'غليسرين 9%', 'هيالورونات الصوديوم 1,000.9 ppm', '50 غ'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'جرعة إضافية في أي مساء جاف',
        body:
          'ثلاثة أقنعة Eucalace® من ألياف الأوكالبتوس، كل منها بوزن 25 غ مع الطحالب البحرية والسنتيلا. يترك القناع 15-20 دقيقة بعد التونر، ثم يرفع وتربت الخلاصة المتبقية ويتبع بالسيروم والكريم. يستخدم فور فتحه.',
        facts: ['ثلاثة أقنعة', 'قناع Eucalace®', '15-20 دقيقة', '25 غ لكل قناع'],
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
    title: 'املئيها مرتين يومياً',
    intro:
      'أربع خطوات صباحاً ومساءً، ويضاف القناع في مساء منفصل بعد التونر وقبل السيروم والكريم. لا تحدد عبوة القناع وتيرة أسبوعية.',
    steps: [
      {
        title: 'التنظيف على بشرة جافة',
        body:
          'وزعي المنظف على وجه جاف مع تجنب العينين، ودلكي بحركات دائرية ثم اشطفي بالماء الفاتر.',
      },
      {
        title: 'التونر بعد التنظيف',
        body:
          'ضعي التونر باليدين أو كرذاذ على بشرة نظيفة صباحاً ومساءً، ولا تشطفيه.',
      },
      {
        title: 'السيروم',
        body:
          'ضعي السيروم على الوجه وربتي بلطف بأطراف الأصابع صباحاً ومساءً، قبل الكريم.',
      },
      {
        title: 'الكريم لحبس الماء',
        body:
          'وزعي الكريم بلطف بعد السيروم. في الصباح، اختتمي بواقي شمس مناسب. لا تحفظي الكريم في الثلاجة.',
      },
      {
        title: 'القناع في أي مساء جاف',
        body:
          'بعد التونر، ضعي قناعاً واحداً واتركيه 15-20 دقيقة. ارفعيه وربتي الخلاصة المتبقية، ثم ضعي السيروم والكريم. استخدمي القناع فور فتحه.',
      },
    ],
    note:
      'واقي الشمس هو الخطوة التي يفترضها هذا الروتين ولا يحتويها. ضعيه كل صباح فوق الكريم ليبقى الماء الذي أعدتِه في مكانه.',
  },
  evidence: {
    eyebrow: 'الدليل',
    title: 'قياس على بشرة حقيقية',
    intro:
      'الوعد بالترطيب سهل. السيروم والكريم خضعا كلاهما لقياس سريري، وهذه النتائج.',
    cards: [
      {
        value: '+82%',
        title: 'ترطيب مباشرة بعد استخدام واحد',
        body:
          'تطبيق واحد لكريم الهيالورون، قورن بالبشرة نفسها قبل الاستخدام، لدى 21 امرأة بين 20 و59 عاماً.',
      },
      {
        value: '72 ساعة',
        title: 'وبقي أعلى بعد ثلاثة أيام',
        body:
          'بعد التطبيق الواحد نفسه، بقي الترطيب أعلى بوضوح من نقطة البداية بعد 72 ساعة.',
      },
      {
        value: '2,000 ppm',
        title: 'حمض الهيالورونيك المتحلل في السيروم',
        body:
          'الخطوة التي تجذب الماء، مع PENTAVITIN بنسبة 0.615% في قاعدة من ماء جوز الهند. وفي المجموعة نفسها حسّن ترطيب البشرة مباشرة بعد استخدام واحد.',
      },
      {
        value: '3%',
        title: 'بيتايين في التونر الخالي من العطر',
        body:
          'مرطب التونر، لتحصل البشرة على رشفتها الأولى فور تنظيفها ويصل السيروم إلى بشرة رطبة.',
      },
    ],
    footnote:
      'النتيجتان السريريتان من اختبارات DTS MG على 21 امرأة بالغة بين 20 و59 عاماً بعد تطبيق واحد. نتيجة 72 ساعة تخص الكريم.',
  },
  suited: {
    eyebrow: 'مدى الملاءمة',
    title: 'لمن هذا الصندوق',
    forTitle: 'مناسب إذا',
    forList: [
      'كانت بشرتك تشدّ مع الظهيرة، أو تبدو باهتة بعد يوم في المكيّف',
      'كانت بشرتك جافة، أو دهنية ومجففة في الوقت نفسه',
      'توقّف السيروم وحده عن العمل بعد الظهر وتريدين الطبقة التي تحفظه',
      'كنت تبدأين روتيناً من الصفر وتفضّلين شراء التتابع كاملاً بدل التخمين',
    ],
    notForTitle: 'ابحثي عن غيره إذا',
    notForList: [
      'كانت بشرتك تتفاعل مع العطر أو الزيوت الأساسية؛ فالمنظف معطر، والسيروم والكريم يحتويان زيت الجيرانيوم، والقناع يحتوي زيت النعناع الفلفلي. التونر بلا عطر',
      'كنت تعالجين حب الشباب أو انسداد المسام لا الجفاف. صندوق البشرة المعرّضة للمشاكل مخصص لذلك',
      'كان التصبغ أو توحيد اللون هو الهدف. صندوق تفتيح البشرة يستهدفه مباشرة',
      'كنت حاملاً أو مرضعة؛ تنص عبوة SNOW O₂ على عدم استخدامه خلال هذه الفترة، فاستشيري الطبيبة أولاً',
      'كنت تملكين بالفعل منتجين أو ثلاثة من الخمسة. شراء الناقص وحده سيكون أقل تكلفة',
    ],
    alternativesLabel: 'الصناديق المذكورة أعلاه',
    alternatives: [
      { productNumber: '55', label: 'صندوق البشرة المعرّضة للمشاكل' },
      { productNumber: '56', label: 'صندوق تفتيح البشرة' },
    ],
    note:
      'المنظف والتونر والسيروم والكريم مختبرة جلدياً. ومع ذلك فكل بشرة مختلفة، فإذا لم تناسبك قطعة واحدة، أوقفيها وحدها بدلاً من الروتين كله.',
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      { label: 'المحتويات', value: '7 قطع: منظف 180 مل، تونر 200 مل، سيروم 30 مل، كريم 50 غ، و3 أقنعة 25 غ' },
      { label: 'نوع البشرة', value: 'البشرة الجافة والمشدودة والمتعطشة للماء' },
      { label: 'الروتين', value: 'تنظيف، تونر، سيروم، كريم صباحاً ومساءً؛ القناع في أي مساء جاف' },
      { label: 'النتائج', value: 'ارتفع الترطيب 82% بعد استخدام واحد للكريم وبقي أعلى بعد 72 ساعة. 21 امرأة بين 20 و59 عاماً' },
      { label: 'العطر', value: 'التونر بلا عطر. المنظف معطر، والسيروم والكريم بزيت الجيرانيوم، والقناع بزيت النعناع الفلفلي' },
      { label: 'بلد الصنع', value: 'صُنع في كوريا من DTS MG Co., Ltd.، سيول' },
      { label: 'الاختبار', value: 'المنظف والتونر والسيروم والكريم مختبرة جلدياً' },
      { label: 'الباركود', value: 'لكل منتج رقم EAN خاص به، مدرج مع القطعة أعلاه' },
      { label: 'الخصومات', value: 'سعر الصندوق هو الخصم نفسه، لذا لا تُجمع عليه عروض أخرى' },
    ],
  },
  faq: {
    eyebrow: 'قبل الشراء',
    title: 'أسئلة تستحق السؤال',
    items: [
      {
        q: 'لماذا سيروم وكريم وكلاهما يحتوي على الهيالورونيك؟',
        a: 'لأن لكل منهما مهمة. السيروم يحتوي على حمض الهيالورونيك المتحلل بتركيز 2,000 جزء في المليون ويجذب الماء. والكريم يحتوي على هيالورونات الصوديوم عالية الوزن الجزيئي التي تبقى على السطح وتمنع الماء من الخروج. أحدهما يملأ والآخر يحبس، وقد قيست نسبة 82% على الكريم.',
      },
      {
        q: 'هل يمكنني شراء المنتجات منفصلة؟',
        a: 'نعم، وكل منتج مرتبط أعلاه. الصندوق ليس تركيبة مختلفة ولا حجماً حصرياً، بل المنتجات نفسها بسعر إجمالي أقل. وإن كنت تملكين بعضها، فشراء الناقص وحده أوفر.',
      },
      {
        q: 'هل هذه الأحجام المنزلية أم المهنية؟',
        a: 'الأحجام المنزلية: منظف 180ml، تونر 200ml، سيروم 30ml، كريم 50g. تصنع GENOSYS أيضاً أحجاماً مهنية 500ml و1000ml و250g من المنتجات نفسها للعيادات، وتُباع منفصلة.',
      },
      {
        q: 'إلى متى تكفي؟',
        a: 'يعتمد ذلك على كمية الاستخدام. الثابت أن المنتجات اليومية الأربعة أحجام كاملة، وأن الأقنعة ثلاثة بالضبط، أي ثلاث أمسيات.',
      },
      {
        q: 'هل يمكن استخدامه خلال الحمل أو الرضاعة؟',
        a: 'تنص عبوة SNOW O₂ على عدم استخدامه أثناء الحمل والرضاعة. راجعي الطبيبة قبل البدء بالروتين.',
      },
      {
        q: 'بشرتي حساسة. هل هذا الصندوق مناسب؟',
        a: 'أدخلي المنتجات واحداً بعد الآخر. يحتوي المنظف على عطر وليمونين؛ ويحتوي السيروم والكريم على زيت الجيرانيوم ومسببات حساسية عطرية؛ ويحتوي القناع على زيت النعناع الفلفلي. كما تنصح عبوة القناع بالحذر عند التحسس من الضمادات أو الكمادات. التونر بلا عطر.',
      },
      {
        q: 'أين يقع القناع إن كانت ثلاثة فقط؟',
        a: 'اعتبريه جرعة إضافية لا طقساً يومياً. في المساء الذي تشعرين فيه بشدّ البشرة، ضعيه بعد التونر لمدة 15-20 دقيقة، ثم أكملي بالسيروم والكريم. استخدميه فور فتحه. والقناع يُباع أيضاً منفرداً.',
      },
    ],
  },
}

const RU: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Продукты',
  headline: 'Долейте влаги.',
  subheadline:
    'Снаружи пустынное солнце, внутри кондиционер: кожа отдаёт воду весь день. Этот набор возвращает её и удерживает. Очищение, которое само превращается в пену, тоник без отдушки с 3% бетаина, сыворотка с 2 000 ppm гидролизованной гиалуроновой кислоты, которая притягивает воду, и крем, который её держит: увлажнённость выросла на 82% после одного нанесения и оставалась выше через 72 часа. Плюс три тканевые маски с морскими водорослями для вечеров, когда кожа стянута.',
  heroBullets: [
    'Для сухой, стянутой и обезвоженной кожи, а также для кожи, которая к вечеру снова хочет пить',
    'Увлажнённость выросла на 82% сразу после одного нанесения крема и оставалась заметно выше через 72 часа',
    'Гиалуроновый дуэт: 2 000 ppm гидролизованной гиалуроновой кислоты в сыворотке и высокомолекулярный гиалуронат натрия в креме',
    'Четыре полноразмерных средства и три маски дешевле, чем пять средств по отдельности',
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
  badges: ['Оригинальный GENOSYS', 'Сделано в Корее', '7 единиц', 'Дубай за 1-2 часа'],
  stats: [
    { value: '+82%', label: 'увлажнённости сразу после одного нанесения крема' },
    { value: '72 часа', label: 'и всё ещё заметно выше через три дня' },
    { value: '2 000 ppm', label: 'гидролизованной гиалуроновой кислоты в сыворотке' },
    { value: '7', label: 'единиц: четыре полноразмерных средства и три маски' },
  ],
  contents: {
    eyebrow: 'Что внутри',
    title: 'Пять средств, одна дозаправка',
    intro:
      'У каждого средства есть своя страница и своя цена, так что подробности можно прочитать до покупки. Вместе они делают всю дозаправку: очищение, первый глоток, притянуть воду, удержать её, и три маски для вечеров, когда коже нужно больше.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Шаг 1 - Очищение',
        body:
          'Очищение 180 мл наносится на сухое лицо, избегая области глаз, и само превращается в пену. Помассируйте круговыми движениями и смойте тёплой водой, без трения.',
        facts: ['Само пенится', 'На сухую кожу', 'Смыть тёплой водой', '180 мл'],
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'Шаг 2 - Первый глоток',
        body:
          'Ежедневный тоник 200 мл для любого типа кожи. Бетаин 3% даёт коже первый глоток сразу после очищения, и сыворотка ложится на уже влажную кожу. Полностью без отдушки.',
        facts: ['Без отдушки', 'Бетаин 3%', 'Руками или спреем', '200 мл'],
      },
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'Шаг 3 - Притянуть воду',
        body:
          'Шаг, который притягивает воду. Лёгкая сыворотка с гидролизованной гиалуроновой кислотой 2 000 ppm и PENTAVITIN 0,615%. Вбивайте в лицо и шею утром и вечером.',
        facts: ['Гидролизованная ГК 2 000 ppm', 'PENTAVITIN 0,615%', 'Лёгкая текстура', '30 мл'],
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'Шаг 4 - Удержать воду',
        body:
          'Шаг, который удерживает воду, и тот, на котором измерили 82%. Высокомолекулярный гиалуронат натрия 1 000,9 ppm с глицерином 9% и PENTAVITIN 0,615%. Через 72 часа после одного нанесения увлажнённость оставалась выше.',
        facts: ['+82% после одного нанесения', 'Глицерин 9%', 'Гиалуронат натрия 1 000,9 ppm', '50 г'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'Дозаправка в любой сухой вечер',
        body:
          'Три маски Eucalace® из эвкалиптового волокна по 25 г с морскими водорослями и центеллой. Оставьте на 15-20 минут после тоника, снимите, вбейте остатки эссенции и продолжите сывороткой и кремом. Используйте сразу после вскрытия.',
        facts: ['Три маски', 'Основа Eucalace®', '15-20 минут', '25 г каждая'],
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
    title: 'Доливайте дважды в день',
    intro:
      'Четыре шага утром и вечером. В отдельный вечер маска идёт после тоника и перед сывороткой и кремом. Недельная частота на упаковке не указана.',
    steps: [
      {
        title: 'Очищение на сухой коже',
        body:
          'Нанесите средство на сухое лицо, избегая области глаз, мягко помассируйте круговыми движениями и смойте тёплой водой.',
      },
      {
        title: 'Тоник после очищения',
        body:
          'Нанесите тоник руками или распылите на чистую кожу утром и вечером. Не смывайте.',
      },
      {
        title: 'Сыворотка',
        body:
          'Нанесите на лицо и мягко вбейте кончиками пальцев утром и вечером, перед кремом.',
      },
      {
        title: 'Крем, чтобы удержать воду',
        body:
          'Мягко распределите после сыворотки. Утром завершите уход подходящим SPF. Не храните крем в холодильнике.',
      },
      {
        title: 'Маска в любой сухой вечер',
        body:
          'После тоника наложите одну маску на 15-20 минут. Снимите, мягко вбейте остатки эссенции, затем нанесите сыворотку и крем. Используйте сразу после вскрытия.',
      },
    ],
    note:
      'Солнцезащитное средство - единственный шаг, которого нет в наборе. Наносите SPF каждое утро поверх крема, и возвращённая влага останется на месте.',
  },
  evidence: {
    eyebrow: 'Доказательства',
    title: 'Измерено на реальной коже',
    intro:
      'Обещать увлажнение легко. Сыворотку и крем проверили клиническими измерениями, и вот результаты.',
    cards: [
      {
        value: '+82%',
        title: 'Увлажнённость сразу после одного нанесения',
        body:
          'Одно нанесение гиалуронового крема в сравнении с той же кожей до применения, у 21 женщины от 20 до 59 лет.',
      },
      {
        value: '72 ч',
        title: 'И всё ещё выше через три дня',
        body:
          'После того же единственного нанесения увлажнённость оставалась заметно выше исходной спустя 72 часа.',
      },
      {
        value: '2 000 ppm',
        title: 'Гидролизованной гиалуроновой кислоты в сыворотке',
        body:
          'Шаг, который притягивает воду, с PENTAVITIN 0,615% на основе кокосовой воды. В той же группе сыворотка улучшила увлажнённость кожи сразу после одного нанесения.',
      },
      {
        value: '3%',
        title: 'Бетаина в тонике без отдушки',
        body:
          'Увлажняющий компонент тоника: кожа получает первый глоток сразу после очищения, и сыворотка ложится на влажную кожу.',
      },
    ],
    footnote:
      'Оба клинических результата получены DTS MG у 21 взрослой женщины от 20 до 59 лет после одного нанесения. Результат через 72 часа относится к крему.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Для кого этот набор',
    forTitle: 'Подойдёт, если',
    forList: [
      'К середине дня кожа стянута или выглядит тусклой после дня под кондиционером',
      'Кожа сухая - или жирная и обезвоженная одновременно',
      'Одной сыворотки к вечеру уже не хватает, и нужен слой, который её удержит',
      'Вы начинаете уход с нуля и предпочитаете купить готовый порядок, а не угадывать',
    ],
    notForTitle: 'Лучше другой набор, если',
    notForList: [
      'Кожа реагирует на отдушки или эфирные масла: очищение ароматизировано, сыворотка и крем содержат масло герани, маска - масло мяты перечной. Тоник без отдушки',
      'Вы работаете с акне и забитыми порами, а не с сухостью. Для этого есть набор для проблемной кожи',
      'Цель - пигментация и ровный тон. Набор для сияния кожи занимается именно этим',
      'Вы беременны или кормите грудью: на упаковке SNOW O₂ указано не использовать его в этот период, поэтому сначала обсудите уход с врачом',
      'У вас уже есть два-три средства из пяти. Докупить недостающие выйдет дешевле',
    ],
    alternativesLabel: 'Наборы, упомянутые выше',
    alternatives: [
      { productNumber: '55', label: 'Набор для проблемной кожи' },
      { productNumber: '56', label: 'Набор для сияния кожи' },
    ],
    note:
      'Очищение, тоник, сыворотка и крем дерматологически протестированы. Но кожа у всех разная: если одно средство вам не подойдёт, откажитесь от него, а не от всего ухода.',
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Детали',
    rows: [
      { label: 'Состав набора', value: '7 единиц: очищение 180 мл, тоник 200 мл, сыворотка 30 мл, крем 50 г и 3 маски по 25 г' },
      { label: 'Тип кожи', value: 'Сухая, стянутая и обезвоженная' },
      { label: 'Порядок', value: 'Очищение, тоник, сыворотка, крем утром и вечером; маска в любой сухой вечер' },
      { label: 'Результаты', value: 'Увлажнённость +82% сразу после одного нанесения крема и выше исходной через 72 часа. 21 женщина от 20 до 59 лет' },
      { label: 'Отдушка', value: 'Тоник без отдушки. Очищение ароматизировано, в сыворотке и креме масло герани, в маске масло мяты перечной' },
      { label: 'Производство', value: 'Сделано в Корее, DTS MG Co., Ltd., Сеул' },
      { label: 'Контроль', value: 'Очищение, тоник, сыворотка и крем дерматологически протестированы' },
      { label: 'Штрихкоды', value: 'У каждого средства свой EAN, он указан рядом с позицией выше' },
      { label: 'Скидки', value: 'Цена набора уже является скидкой, поэтому другие предложения на него не суммируются' },
    ],
  },
  faq: {
    eyebrow: 'Перед покупкой',
    title: 'Вопросы, которые стоит задать',
    items: [
      {
        q: 'Зачем сыворотка и крем, если в обоих гиалуроновая кислота?',
        a: 'У них разные задачи. В сыворотке гидролизованная гиалуроновая кислота 2 000 ppm, она притягивает воду. В креме высокомолекулярный гиалуронат натрия: он остаётся на поверхности и не даёт воде уходить. Одна наполняет, другой удерживает, и 82% измерены именно на креме.',
      },
      {
        q: 'Можно купить средства по отдельности?',
        a: 'Да, у каждого продукта есть своя страница. Набор - это не другая формула и не эксклюзивный объём, а те же средства дешевле. Если часть из них у вас уже есть, докупить недостающие выйдет выгоднее.',
      },
      {
        q: 'Это домашние объёмы или профессиональные?',
        a: 'Домашние: очищение 180 мл, тоник 200 мл, сыворотка 30 мл, крем 50 г. У GENOSYS есть и профессиональные форматы тех же средств - 500 мл, 1000 мл и 250 г - они продаются отдельно для клиник.',
      },
      {
        q: 'На сколько хватит набора?',
        a: 'Зависит от расхода. Четыре ежедневных продукта представлены в полных розничных объёмах, а масок ровно три - на три вечера.',
      },
      {
        q: 'Можно при беременности и кормлении?',
        a: 'На упаковке SNOW O₂ указано не использовать средство во время беременности и грудного вскармливания. Обсудите уход с врачом до начала.',
      },
      {
        q: 'У меня реактивная кожа. Это мой набор?',
        a: 'Вводите продукты по одному. В очищении есть parfum и limonene; в сыворотке и креме - масло герани и ароматические аллергены; в маске - масло мяты перечной. При чувствительности к пластырям и компрессам с маской также нужна осторожность. Тоник без отдушки.',
      },
      {
        q: 'Куда вписать маску, если их всего три?',
        a: 'Считайте её дозаправкой, а не ежедневным ритуалом. В вечер, когда кожа стянута, наложите маску после тоника на 15-20 минут, затем нанесите сыворотку и крем. Используйте сразу после вскрытия. Маски продаются и отдельно.',
      },
    ],
  },
}

export const DEEP_MOISTURIZING_COPY: BeautyBoxLocaleCopy = { en: EN, ar: AR, ru: RU }
