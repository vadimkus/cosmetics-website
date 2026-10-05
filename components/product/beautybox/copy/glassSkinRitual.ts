/**
 * Copy for the GLASS SKIN RITUAL KIT page (product 68), the 2026 holiday
 * edition, in English, Arabic and Russian.
 *
 * ─── Sourcing rules ──────────────────────────────────────────────────────────
 *
 * The kit is the DTS MG holiday edition, packed in Korea in the brand's own gift
 * box, not a box assembled in the UAE. It still has no formula of its own, so
 * every claim below traces to one of its three member products, each of which
 * carries its own audited sourcing block:
 *
 *   Moisture Replenishing Hyaluron Serum 30ml (product 18)
 *     components/product/hsserum/hsserumCopy.ts and the Intertek formula,
 *     artwork and COA it names. Coconut-water serum with an HA complex and
 *     mushrooms (artwork front); hydrolyzed hyaluronic acid 2,000 ppm (carton
 *     INCI); PENTAVITIN 0.615%; Hyaluronan 11 Multi-Complex by name (DTS MG
 *     deck); apply and pat, morning and evening; dermatologically tested.
 *
 *   Moisture Replenishing Hyaluron Cream 50g (product 29)
 *     components/product/mhcream/mhcreamCopy.ts. Sodium hyaluronate 1,000.9 ppm,
 *     the high molecular weight fraction (deck); glycerin 9%; PENTAVITIN 0.615%;
 *     massage in, morning and evening; +82% hydration immediately after one use,
 *     still above baseline at 72 hours (DTS MG clinical); dermatologically tested.
 *
 *   Revita Glow BB Cream 50g, #01 Bright or #02 Natural (product 63)
 *     components/product/revitaglow/revitaGlowCopy.ts. SPF 38 PA+++ from four
 *     filters; niacinamide 2% and adenosine 0.04%; Korean triple-functional
 *     registration (UV protection, brightening, wrinkle improvement); blend,
 *     then tap to finish; shade descriptions as on that page.
 *
 *   The kit sheet: holiday_kit_v/2026 GENOSYS HOLIDAY KIT - GLASS SKIN RETUAL.pdf
 *     Contents (serum, cream, BB cream in one of two shades, the Revita Glow BB
 *     cream puff, a holiday puff case with mirror), the three-step order, and the
 *     Moon Jar story. The puff is the dedicated Revita Glow puff the DTS MG deck
 *     describes; in this kit it is included, unlike the single tube.
 *
 *   MoySklad: two SKUs, Genosys Glass Skin Ritual Kit #01 Bright (54501) and
 *   #02 Natural (54502). The cart line carries the shade (lib/moysklad.ts).
 *
 * ─── Claims that stay off this page ──────────────────────────────────────────
 *
 *   Barrier repair or strengthening   The kit sheet says it; no member document
 *                                     measures it. The page says water held in.
 *   Mushrooms as actives              Each extract is at 0.17 ppm. Named, never
 *                                     credited.
 *   A drop count for the serum        Not on the artwork. "Apply and pat".
 *   Coconut water as the base         It is 0.80% of the serum; the artwork's
 *                                     "coconut water-based" is quoted as the
 *                                     serum's description, never as a percentage.
 *   Fragrance-free                    All three carry fragrance.
 *   Duration of the kit               Not documented; pack sizes are given.
 *
 * ─── Voice ("Full moon glow." campaign, 29 Sep 2026) ────────────────────────
 *
 *   The Korean moon jar on the box is named for the full moon and glows rather
 *   than shines, which is the glass-skin promise: water filled, water held, an
 *   even luminous finish on top. Lot results, protocols and dossier vocabulary
 *   stay in the member files.
 *
 * See beautyBoxCopy.ts for why no price appears in any of these modules.
 */

import type { BeautyBoxCopy, BeautyBoxLocaleCopy } from '../beautyBoxCopy'

const EN: BeautyBoxCopy = {
  eyebrow: 'Holiday Edition 2026',
  backToProducts: 'Products',
  headline: 'Full moon glow.',
  subheadline:
    'Three steps to the Korean glass-skin look, in the GENOSYS holiday box. A coconut-water hyaluron serum fills skin with water, a hyaluron cream holds it there, and Revita Glow BB cream finishes with SPF 38 and a soft, luminous tint, tapped in with its own puff. On the box, a Korean moon jar: named for the full moon, a symbol of abundance and good fortune, and a porcelain that glows softly from within, just like the skin this ritual is made for.',
  heroBullets: [
    'Hydration you can measure: up 82% straight after one use of the cream, and still holding at 72 hours',
    'Hyaluronan 11 Multi-Complex in the serum and the cream: one form fills, the other holds',
    'Revita Glow BB cream with SPF 38 PA+++ and 2% niacinamide, in #01 Bright or #02 Natural',
    'Three full sizes, the puff and a mirror case, for less than the three bought separately',
  ],
  kitSize: '3 products · 5 pieces',
  fullSizeNote: 'Full sizes',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',
  addToBag: 'Add the kit',
  adding: 'Adding...',
  added: 'Added',
  outOfStock: 'Out of stock',
  loginToShop: 'Log in to shop',
  inBag: 'In your bag',
  viewBag: 'View bag',
  badges: ['Authentic GENOSYS', 'Made in Korea', 'Holiday gift box', 'Dubai in 1-2 hours'],
  stats: [
    { value: '+82%', label: 'hydration straight after one use of the cream' },
    { value: '72h', label: 'and the hydration was still holding' },
    { value: 'SPF 38', label: 'PA+++ in the BB cream, the last step every morning' },
    { value: '5', label: 'pieces: serum, cream, BB cream, puff and mirror case' },
  ],
  contents: {
    eyebrow: 'What is inside',
    title: 'Three steps to glass skin',
    intro:
      'Every product here has its own page and its own price, so you can read all about it before you buy. In the box they run the glass-skin ritual in order: water in, water held, glow on top. The Revita Glow puff and a holiday puff case with a mirror come with them.',
    items: [
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'Step 1 - Fill, morning and evening',
        body:
          'A coconut-water serum with 2,000 ppm of hydrolyzed hyaluronic acid, the light form that sinks in, plus PENTAVITIN and a mushroom complex. Pat it over the face and skin drinks it in.',
        facts: ['Hydrolyzed HA 2,000 ppm', 'Hyaluronan 11 Multi-Complex', 'PENTAVITIN', '30ml'],
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'Step 2 - Seal, morning and evening',
        body:
          'High-weight hyaluronic acid at 1,000 ppm stays on the surface and keeps the water from leaving, with 9% glycerin behind it. Massage it in over the serum. One use lifted hydration 82%.',
        facts: ['Sodium hyaluronate 1,000 ppm', 'Glycerin 9%', '+82% after one use', '50g'],
      },
      {
        titleKey: 'routineRevitaGlowBBTitle',
        productNumber: '63',
        quantity: 1,
        step: 'Step 3 - Glow, every morning',
        body:
          'The finish: a light, luminous tint with SPF 38 PA+++ from four filters, 2% niacinamide and adenosine, registered in Korea for UV protection, brightening and wrinkle care. Blend, then tap it in with the puff. Pick #01 Bright or #02 Natural above.',
        facts: ['SPF 38 PA+++', 'Niacinamide 2%', 'Korean triple-functional', '50g'],
      },
    ],
    eanLabel: 'Barcode',
    each: 'each',
    viewItem: 'Read the full page',
    boughtSeparately: 'Bought separately',
    inThisBox: 'In this kit',
    youSave: 'You save',
    againstSeparate: 'against buying the three separately',
    seeBreakdown: 'See the breakdown',
    savingNote:
      'Prices update live, so this comparison is always what you would actually pay today. The puff, the mirror case and the gift box come on top.',
  },
  howTo: {
    eyebrow: 'How to use it',
    title: 'The morning ritual',
    intro:
      'Serum and cream morning and evening, the BB cream every morning as the last step. Each product carries its full instructions on its own page; this is how the three fit together.',
    steps: [
      {
        title: 'Serum on clean skin',
        body:
          'Smooth it over the face and pat it in with your fingertips, morning and evening. Give it a moment to sink in before the cream.',
      },
      {
        title: 'Cream to hold the water in',
        body:
          'A small amount over the serum, massaged in gently. It seals in the water the serum just brought.',
      },
      {
        title: 'BB cream last, every morning',
        body:
          'Dot it over the face, blend it out, then tap it in with the puff for an even, luminous finish. Add a second thin layer wherever you want more coverage.',
      },
      {
        title: 'In the evening',
        body:
          'Cleanse the BB cream away, then serum and cream only. Skin gets the night to drink.',
      },
    ],
    note:
      'Revita Glow carries SPF 38 PA+++, so it is your morning sun protection as well as your base. For long hours outdoors, reapply through the day. Wash the puff regularly and let it dry in the open case.',
  },
  video: {
    eyebrow: 'Full moon glow. In 20 seconds',
    title: 'Open the box with us',
    body: 'The moon, the moon jar on the lid, then everything inside: the serum, the cream, Revita Glow, the puff and its mirror case. Ready to give, or to keep.',
    poster: '/images/glass_skin_campaign/reel-poster.jpg',
  },
  evidence: {
    eyebrow: 'The proof',
    title: 'Why skin glows',
    intro:
      'Glass skin is water, held where it belongs, under an even finish. Every figure here belongs to one of the three products in the box.',
    cards: [
      {
        value: '+82%',
        title: 'Hydration after one use',
        body:
          'The hyaluron cream lifted skin hydration 82% straight after a single application, and hydration was still well above where it started 72 hours later.',
      },
      {
        value: '2,000 ppm',
        title: 'Hydrolyzed hyaluronic acid in the serum',
        body:
          'The light, low-weight form that sinks in and fills. The serum is where the water goes in.',
      },
      {
        value: '1,000 ppm',
        title: 'High-weight hyaluronic acid in the cream',
        body:
          'The large form stays on the surface and keeps water from escaping. Serum fills, cream seals, and neither is a weaker copy of the other.',
      },
      {
        value: 'SPF 38',
        title: 'PA+++ in the finish',
        body:
          'Two organic and two mineral filters, with niacinamide at 2% and adenosine at 0.04%. Korea registers the BB cream for UV protection, brightening and wrinkle care at once.',
      },
    ],
    footnote:
      'Hyaluronan 11 Multi-Complex is the name DTS MG gives to the eleven grades of hyaluronic acid across the serum and the cream, from the light form that fills to the heavy one that holds. All three products are dermatologically tested.',
  },
  suited: {
    eyebrow: 'Suitability',
    title: 'Who this kit is for',
    forTitle: 'A good match if',
    forList: [
      'Your skin feels tight or looks flat by the afternoon, and you want the dewy, lit-from-within look',
      'You want a light base with sun protection built in, instead of foundation',
      'You are new to Korean skincare and want three steps, not ten',
      'You want a gift that looks beautiful and gets used every single morning',
    ],
    notForTitle: 'Look elsewhere if',
    notForList: [
      'Uneven tone and dark spots are the main target. The Skin Brightening box is built for that',
      'Breakouts are the priority. The Problem Skin Care box works on those first',
      'You want full coverage. Revita Glow is a light, natural finish, and the Blemish Balm Cushion covers more',
      'Fragrance is a problem for you. All three products carry a light scent',
    ],
    alternativesLabel: 'Mentioned above',
    alternatives: [
      { productNumber: '56', label: 'Skin Brightening Beauty Box' },
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
      { productNumber: '41', label: 'Skin Caring Blemish Balm Cushion' },
    ],
    note:
      'Serum, cream and BB cream are all dermatologically tested. If your skin is reactive, try each on a small area first.',
  },
  details: {
    eyebrow: 'Specifications',
    title: 'The details',
    rows: [
      { label: 'Contents', value: 'Moisture Replenishing Hyaluron Serum 30ml, Moisture Replenishing Hyaluron Cream 50g, Revita Glow BB Cream 50g in one shade, the Revita Glow puff and a holiday puff case with mirror' },
      { label: 'Shades', value: '#01 Bright, lighter and more luminous, for fair to light-medium skin. #02 Natural, warmer and a touch deeper, for light-medium to medium skin' },
      { label: 'Routine', value: 'Serum and cream morning and evening; BB cream every morning as the last step' },
      { label: 'Sun protection', value: 'SPF 38 PA+++ in the BB cream' },
      { label: 'Skin type', value: 'Dry and dehydrated skin, and any skin that wants a dewy finish. Dehydration can happen to every skin type' },
      { label: 'Fragrance', value: 'All three are lightly fragranced, with allergens listed on each product page' },
      { label: 'Gift box', value: 'The GENOSYS holiday box with the Korean moon jar design' },
      { label: 'Origin', value: 'Made in Korea for DTS MG Co., Ltd., Seoul' },
      { label: 'Testing', value: 'Serum, cream and BB cream all dermatologically tested' },
      { label: 'Discounts', value: 'The kit price is already the discount, so other offers do not stack on it' },
    ],
  },
  faq: {
    eyebrow: 'Before you buy',
    title: 'Questions worth asking',
    items: [
      {
        q: 'Which shade should I choose?',
        a: '#01 Bright for fair to light-medium skin: it sits lighter and more luminous. #02 Natural for light-medium to medium skin: warmer and a touch deeper, with a softer glow. Both carry the same SPF 38 PA+++, niacinamide and adenosine; only the pigment changes.',
      },
      {
        q: 'What is the moon jar on the box?',
        a: 'The Korean moon jar, dalhangari, is one of Korea\'s best-loved porcelain pieces, named for its likeness to the full moon. It stands for abundance, purity and good fortune, which is why it welcomes a new season and a new year. Its soft white glow is the look this ritual is made for.',
      },
      {
        q: 'Is the BB cream enough sun protection?',
        a: 'It carries SPF 38 PA+++, so on a normal day it is your morning sun step. For long hours outdoors, reapply through the day or add a dedicated sun cream.',
      },
      {
        q: 'Do I need all three?',
        a: 'Serum and cream each work alone, but together they do what neither can: the serum fills skin with water and the cream holds it there. The BB cream is the finish and the sun protection, so skip it in the evening, never in the morning.',
      },
      {
        q: 'Is it ready to give as a gift?',
        a: 'Yes. It comes in the GENOSYS holiday box with the moon jar design, with the puff and a mirror case inside. Pick the shade closest to the person you are buying for.',
      },
      {
        q: 'Can I buy the products separately?',
        a: 'Yes, each one is linked above. The kit is the same three full sizes at a lower total, with the puff, the mirror case and the gift box on top.',
      },
    ],
  },
}

/* SPF 38 PA+++, +82% and the ® mark sit inside U+2066/U+2069 where they touch
   Arabic text: each begins or ends on a bidi-neutral character, and without the
   isolate the right-to-left paragraph throws it to the wrong side. */
const AR: BeautyBoxCopy = {
  eyebrow: 'إصدار الأعياد 2026',
  backToProducts: 'المنتجات',
  headline: 'توهّج البدر.',
  subheadline:
    'ثلاث خطوات إلى إطلالة البشرة الزجاجية الكورية، في علبة أعياد GENOSYS. سيروم الهيالورون بماء جوز الهند يملأ البشرة بالماء، وكريم الهيالورون يحبسه فيها، ثم يختم كريم Revita Glow BB بحماية ⁦SPF 38⁩ ولمسة لون ناعمة مشرقة تُربَّت بإسفنجته الخاصة. وعلى العلبة جرّة القمر الكورية: سُمّيت على اسم البدر، وهي رمز للوفرة وحسن الطالع، وخزفها يتوهّج بهدوء من الداخل، تماماً كالبشرة التي صُنع لها هذا الروتين.',
  heroBullets: [
    'ترطيب يمكن قياسه: ارتفع ⁦82%⁩ مباشرة بعد استخدام واحد للكريم، وبقي بعد 72 ساعة',
    'مركّب Hyaluronan 11 Multi-Complex في السيروم والكريم: شكل يملأ وشكل يحبس',
    'كريم Revita Glow BB بحماية ⁦SPF 38 PA+++⁩ ونياسيناميد 2%، بدرجة ⁦#01 Bright⁩ أو ⁦#02 Natural⁩',
    'ثلاثة أحجام كاملة مع الإسفنجة وعلبة بمرآة، بسعر أقل من شراء الثلاثة منفردة',
  ],
  kitSize: '3 منتجات · 5 قطع',
  fullSizeNote: 'أحجام كاملة',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  addToBag: 'أضيفي المجموعة',
  adding: 'جارٍ الإضافة...',
  added: 'تمت الإضافة',
  outOfStock: 'غير متوفر',
  loginToShop: 'سجّلي الدخول للتسوق',
  inBag: 'في سلتكِ',
  viewBag: 'عرض السلة',
  badges: ['GENOSYS أصلي', 'صُنع في كوريا', 'علبة هدايا الأعياد', 'دبي خلال 1-2 ساعة'],
  stats: [
    { value: '⁦+82%⁩', label: 'ترطيب مباشرة بعد استخدام واحد للكريم' },
    { value: '72 ساعة', label: 'وبقي الترطيب ثابتاً' },
    { value: '⁦SPF 38⁩', label: 'مع PA+++ في كريم BB، آخر خطوة كل صباح' },
    { value: '5', label: 'قطع: سيروم وكريم وكريم BB وإسفنجة وعلبة بمرآة' },
  ],
  contents: {
    eyebrow: 'ما في الداخل',
    title: 'ثلاث خطوات إلى البشرة الزجاجية',
    intro:
      'لكل منتج هنا صفحته وسعره الخاص، فيمكنكِ قراءة كل شيء عنه قبل الشراء. وفي العلبة تسير خطوات الروتين بالترتيب: ماء يدخل، ماء يُحبس، وتوهّج فوقه. وتأتي معها إسفنجة Revita Glow وعلبة إسفنجة احتفالية بمرآة.',
    items: [
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'الخطوة 1 - الملء، صباحاً ومساءً',
        body:
          'سيروم بماء جوز الهند مع 2,000 جزء في المليون من حمض الهيالورونيك المحلل، الشكل الخفيف الذي يتغلغل، مع PENTAVITIN ومركّب الفطر. ربّتيه على الوجه فتشربه البشرة.',
        facts: ['هيالورونيك محلل 2,000 ppm', 'Hyaluronan 11 Multi-Complex', 'PENTAVITIN', '30 مل'],
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'الخطوة 2 - الحبس، صباحاً ومساءً',
        body:
          'حمض هيالورونيك عالي الوزن الجزيئي بتركيز 1,000 جزء في المليون يبقى على السطح ويمنع الماء من التبخر، ومعه غليسرين 9%. دلّكيه فوق السيروم. استخدام واحد رفع الترطيب ⁦82%⁩.',
        facts: ['هيالورونات الصوديوم 1,000 ppm', 'غليسرين 9%', '⁦+82%⁩ بعد استخدام واحد', '50 غ'],
      },
      {
        titleKey: 'routineRevitaGlowBBTitle',
        productNumber: '63',
        quantity: 1,
        step: 'الخطوة 3 - التوهّج، كل صباح',
        body:
          'اللمسة الأخيرة: لون خفيف مشرق بحماية ⁦SPF 38 PA+++⁩ من أربعة فلاتر، ونياسيناميد 2% وأدينوزين، ومسجّل في كوريا للحماية من الأشعة والتفتيح والعناية بالتجاعيد. وزّعيه ثم ربّتيه بالإسفنجة. اختاري ⁦#01 Bright⁩ أو ⁦#02 Natural⁩ في الأعلى.',
        facts: ['⁦SPF 38 PA+++⁩', 'نياسيناميد 2%', 'ثلاثي الوظائف في كوريا', '50 غ'],
      },
    ],
    eanLabel: 'الباركود',
    each: 'للقطعة',
    viewItem: 'اقرئي الصفحة كاملة',
    boughtSeparately: 'عند الشراء منفردة',
    inThisBox: 'في هذه المجموعة',
    youSave: 'توفّرين',
    againstSeparate: 'مقارنة بشراء الثلاثة منفردة',
    seeBreakdown: 'اطّلعي على التفاصيل',
    savingNote:
      'الأسعار تتحدّث مباشرة، فهذه المقارنة هي دائماً ما ستدفعينه اليوم. والإسفنجة وعلبة المرآة وعلبة الهدايا تأتي فوق ذلك.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'روتين الصباح',
    intro:
      'السيروم والكريم صباحاً ومساءً، وكريم BB كل صباح كآخر خطوة. لكل منتج تعليماته الكاملة على صفحته، وهذه طريقة جمع الثلاثة معاً.',
    steps: [
      {
        title: 'السيروم على بشرة نظيفة',
        body:
          'وزّعيه على الوجه وربّتي عليه بأطراف أصابعكِ صباحاً ومساءً. امنحيه لحظة ليتغلغل قبل الكريم.',
      },
      {
        title: 'الكريم ليحبس الماء',
        body:
          'كمية صغيرة فوق السيروم تُدلَّك بلطف. يحبس الماء الذي أدخله السيروم للتو.',
      },
      {
        title: 'كريم BB أخيراً، كل صباح',
        body:
          'ضعي نقاطاً منه على الوجه ووزّعيه، ثم ربّتيه بالإسفنجة للمسة متجانسة مشرقة. أضيفي طبقة رقيقة ثانية حيث تريدين تغطية أكبر.',
      },
      {
        title: 'في المساء',
        body:
          'أزيلي كريم BB بالتنظيف، ثم السيروم والكريم فقط. الليل للبشرة كي ترتوي.',
      },
    ],
    note:
      'يحمل Revita Glow حماية ⁦SPF 38 PA+++⁩، فهو واقي الشمس الصباحي وأساسكِ معاً. عند البقاء طويلاً في الخارج، جدّدي وضعه خلال النهار. اغسلي الإسفنجة بانتظام واتركيها تجف في العلبة المفتوحة.',
  },
  video: {
    eyebrow: 'توهّج البدر. في 20 ثانية',
    title: 'افتحي العلبة معنا',
    body: 'القمر، وجرة القمر على الغطاء، ثم كل ما في الداخل: السيروم والكريم وRevita Glow والإسفنجة مع علبة المرآة. جاهزة لتكون هدية، أو لتبقى لكِ.',
    poster: '/images/glass_skin_campaign/reel-poster.jpg',
  },
  evidence: {
    eyebrow: 'الدليل',
    title: 'لماذا تتوهّج البشرة',
    intro:
      'البشرة الزجاجية ماء محبوس في مكانه، تحت لمسة متجانسة. وكل رقم هنا يعود إلى أحد المنتجات الثلاثة في العلبة.',
    cards: [
      {
        value: '⁦+82%⁩',
        title: 'ترطيب بعد استخدام واحد',
        body:
          'رفع كريم الهيالورون ترطيب البشرة ⁦82%⁩ مباشرة بعد وضعه مرة واحدة، وبقي الترطيب أعلى بكثير من نقطة البداية بعد 72 ساعة.',
      },
      {
        value: '2,000 ppm',
        title: 'حمض هيالورونيك محلل في السيروم',
        body: 'الشكل الخفيف منخفض الوزن الذي يتغلغل ويملأ. السيروم هو حيث يدخل الماء.',
      },
      {
        value: '1,000 ppm',
        title: 'هيالورونيك عالي الوزن في الكريم',
        body:
          'الشكل الكبير يبقى على السطح ويمنع الماء من الهروب. السيروم يملأ والكريم يحبس، ولا أحدهما نسخة أضعف من الآخر.',
      },
      {
        value: '⁦SPF 38⁩',
        title: 'مع PA+++ في اللمسة الأخيرة',
        body:
          'فلتران عضويان وفلتران معدنيان، مع نياسيناميد 2% وأدينوزين 0.04%. وتسجّل كوريا كريم BB للحماية من الأشعة والتفتيح والعناية بالتجاعيد في آن واحد.',
      },
    ],
    footnote:
      'Hyaluronan 11 Multi-Complex هو الاسم الذي تطلقه DTS MG على الدرجات الإحدى عشرة من حمض الهيالورونيك في السيروم والكريم، من الشكل الخفيف الذي يملأ إلى الثقيل الذي يحبس. والمنتجات الثلاثة مختبرة جلدياً.',
  },
  suited: {
    eyebrow: 'الملاءمة',
    title: 'لمن هذه المجموعة',
    forTitle: 'مناسبة لكِ إذا',
    forList: [
      'تشعرين بشدّ في بشرتكِ أو تبدو باهتة بعد الظهر، وتريدين إطلالة ندية تتوهّج من الداخل',
      'تريدين أساساً خفيفاً مع حماية من الشمس بدلاً من كريم الأساس',
      'أنتِ جديدة على العناية الكورية وتريدين ثلاث خطوات لا عشراً',
      'تبحثين عن هدية جميلة المظهر تُستخدم كل صباح',
    ],
    notForTitle: 'ابحثي عن خيار آخر إذا',
    notForList: [
      'كان تفاوت اللون والبقع الداكنة هدفكِ الأول. صندوق Skin Brightening مصمّم لذلك',
      'كانت الحبوب أولويتكِ. صندوق Problem Skin Care يعالجها أولاً',
      'أردتِ تغطية كاملة. Revita Glow لمسة خفيفة طبيعية، وكوشن Blemish Balm يغطي أكثر',
      'كان العطر مشكلة لكِ. المنتجات الثلاثة تحمل رائحة خفيفة',
    ],
    alternativesLabel: 'المذكورة أعلاه',
    alternatives: [
      { productNumber: '56', label: 'Skin Brightening Beauty Box' },
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
      { productNumber: '41', label: 'Skin Caring Blemish Balm Cushion' },
    ],
    note:
      'السيروم والكريم وكريم BB مختبرة جلدياً. إن كانت بشرتكِ حساسة، جرّبي كل منتج على مساحة صغيرة أولاً.',
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      { label: 'المحتويات', value: 'سيروم Moisture Replenishing Hyaluron بحجم 30 مل، وكريم Moisture Replenishing Hyaluron بوزن 50 غ، وكريم Revita Glow BB بوزن 50 غ بدرجة واحدة، وإسفنجة Revita Glow وعلبة إسفنجة احتفالية بمرآة' },
      { label: 'الدرجات', value: '⁦#01 Bright⁩ أفتح وأكثر إشراقاً، للبشرة الفاتحة إلى الفاتحة المتوسطة. ⁦#02 Natural⁩ أدفأ وأعمق قليلاً، للبشرة الفاتحة المتوسطة إلى المتوسطة' },
      { label: 'الروتين', value: 'السيروم والكريم صباحاً ومساءً، وكريم BB كل صباح كآخر خطوة' },
      { label: 'الحماية من الشمس', value: '⁦SPF 38 PA+++⁩ في كريم BB' },
      { label: 'نوع البشرة', value: 'البشرة الجافة والمجففة، وكل بشرة تريد لمسة ندية. الجفاف قد يصيب كل أنواع البشرة' },
      { label: 'العطر', value: 'المنتجات الثلاثة معطّرة بخفة، ومسببات الحساسية مذكورة على صفحة كل منتج' },
      { label: 'علبة الهدايا', value: 'علبة أعياد GENOSYS بتصميم جرّة القمر الكورية' },
      { label: 'بلد المنشأ', value: 'صُنع في كوريا لصالح ⁦DTS MG Co., Ltd.⁩ في سيول' },
      { label: 'الاختبارات', value: 'السيروم والكريم وكريم BB كلها مختبرة جلدياً' },
      { label: 'الخصومات', value: 'سعر المجموعة هو الخصم بالفعل، فلا تُضاف إليه عروض أخرى' },
    ],
  },
  faq: {
    eyebrow: 'قبل الشراء',
    title: 'أسئلة تستحق الطرح',
    items: [
      {
        q: 'أي درجة أختار؟',
        a: '⁦#01 Bright⁩ للبشرة الفاتحة إلى الفاتحة المتوسطة: أفتح وأكثر إشراقاً. ⁦#02 Natural⁩ للبشرة الفاتحة المتوسطة إلى المتوسطة: أدفأ وأعمق قليلاً بتوهّج أنعم. وكلاهما يحمل حماية ⁦SPF 38 PA+++⁩ والنياسيناميد والأدينوزين نفسها، والفرق في الصبغة فقط.',
      },
      {
        q: 'ما جرّة القمر المرسومة على العلبة؟',
        a: 'جرّة القمر الكورية، أو دالهانغاري، من أحب قطع الخزف الكوري، وسُمّيت لشبهها بالبدر. وهي رمز للوفرة والنقاء وحسن الطالع، ولذلك تستقبل بها كوريا الموسم الجديد والعام الجديد. وتوهّجها الأبيض الهادئ هو الإطلالة التي صُنع لها هذا الروتين.',
      },
      {
        q: 'هل يكفي كريم BB كحماية من الشمس؟',
        a: 'يحمل حماية ⁦SPF 38 PA+++⁩، ففي يوم عادي هو خطوة الحماية الصباحية. عند البقاء طويلاً في الخارج، جدّدي وضعه خلال النهار أو أضيفي واقي شمس مخصصاً.',
      },
      {
        q: 'هل أحتاج إلى المنتجات الثلاثة؟',
        a: 'السيروم والكريم يعمل كل منهما وحده، لكنهما معاً يقدّمان ما لا يقدّمه أحدهما: السيروم يملأ البشرة بالماء والكريم يحبسه. وكريم BB هو اللمسة الأخيرة والحماية من الشمس، فاستغني عنه مساءً لا صباحاً.',
      },
      {
        q: 'هل هي جاهزة كهدية؟',
        a: 'نعم. تأتي في علبة أعياد GENOSYS بتصميم جرّة القمر، ومعها الإسفنجة وعلبة بمرآة في الداخل. اختاري الدرجة الأقرب إلى من تهدينها.',
      },
      {
        q: 'هل يمكنني شراء المنتجات منفردة؟',
        a: 'نعم، وكل منها مرتبط في الأعلى. المجموعة هي الأحجام الكاملة الثلاثة نفسها بمجموع أقل، ومعها الإسفنجة وعلبة المرآة وعلبة الهدايا.',
      },
    ],
  },
}

const RU: BeautyBoxCopy = {
  eyebrow: 'Праздничный выпуск 2026',
  backToProducts: 'Продукты',
  headline: 'Сияние полной луны.',
  subheadline:
    'Три шага к корейскому эффекту стеклянной кожи в праздничной коробке GENOSYS. Гиалуроновая сыворотка на кокосовой воде наполняет кожу водой, гиалуроновый крем удерживает её, а BB-крем Revita Glow завершает уход с SPF 38 и мягким сияющим тоном, который вбивается собственным пуфом. На коробке корейская лунная ваза: она названа в честь полной луны, символизирует изобилие и удачу, а её фарфор мягко светится изнутри, как кожа, для которой создан этот ритуал.',
  heroBullets: [
    'Увлажнение, которое можно измерить: +82% сразу после одного нанесения крема, и оно держится 72 часа',
    'Hyaluronan 11 Multi-Complex в сыворотке и креме: одна форма наполняет, другая удерживает',
    'BB-крем Revita Glow с SPF 38 PA+++ и ниацинамидом 2%, в оттенке #01 Bright или #02 Natural',
    'Три полноразмерных средства, пуф и футляр с зеркалом дешевле, чем три средства по отдельности',
  ],
  kitSize: '3 средства · 5 предметов',
  fullSizeNote: 'Полные размеры',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  addToBag: 'Добавить набор',
  adding: 'Добавляем...',
  added: 'Добавлено',
  outOfStock: 'Нет в наличии',
  loginToShop: 'Войдите, чтобы купить',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  badges: ['Оригинальный GENOSYS', 'Сделано в Корее', 'Праздничная подарочная коробка', 'По Дубаю за 1-2 часа'],
  stats: [
    { value: '+82%', label: 'увлажнения сразу после одного нанесения крема' },
    { value: '72 ч', label: 'и увлажнение всё ещё держалось' },
    { value: 'SPF 38', label: 'PA+++ в BB-креме, последний шаг каждое утро' },
    { value: '5', label: 'предметов: сыворотка, крем, BB-крем, пуф и футляр с зеркалом' },
  ],
  contents: {
    eyebrow: 'Что внутри',
    title: 'Три шага к стеклянной коже',
    intro:
      'У каждого средства есть своя страница и своя цена, поэтому о каждом можно прочитать всё до покупки. В коробке они выстраиваются в ритуал: вода внутрь, вода удержана, сияние сверху. К ним прилагаются пуф Revita Glow и праздничный футляр для пуфа с зеркалом.',
    items: [
      {
        titleKey: 'routineHyaluronSerumTitle',
        productNumber: '18',
        quantity: 1,
        step: 'Шаг 1 - Наполнить, утром и вечером',
        body:
          'Сыворотка на кокосовой воде с 2 000 ppm гидролизованной гиалуроновой кислоты, лёгкой формы, которая проникает внутрь, а также PENTAVITIN и грибной комплекс. Вбейте её похлопывающими движениями, и кожа напьётся.',
        facts: ['Гидролизованная ГК 2 000 ppm', 'Hyaluronan 11 Multi-Complex', 'PENTAVITIN', '30 мл'],
      },
      {
        titleKey: 'routineHyaluronCreamTitle',
        productNumber: '29',
        quantity: 1,
        step: 'Шаг 2 - Запечатать, утром и вечером',
        body:
          'Высокомолекулярная гиалуроновая кислота 1 000 ppm остаётся на поверхности и не даёт воде уходить, а за ней глицерин 9%. Вмассируйте поверх сыворотки. Одно нанесение подняло увлажнение на 82%.',
        facts: ['Гиалуронат натрия 1 000 ppm', 'Глицерин 9%', '+82% после одного нанесения', '50 г'],
      },
      {
        titleKey: 'routineRevitaGlowBBTitle',
        productNumber: '63',
        quantity: 1,
        step: 'Шаг 3 - Сияние, каждое утро',
        body:
          'Финальный штрих: лёгкий сияющий тон с SPF 38 PA+++ от четырёх фильтров, ниацинамид 2% и аденозин, регистрация в Корее для защиты от УФ, осветления и ухода за морщинами. Распределите и вбейте пуфом. Выберите #01 Bright или #02 Natural выше.',
        facts: ['SPF 38 PA+++', 'Ниацинамид 2%', 'Три функции по регистрации в Корее', '50 г'],
      },
    ],
    eanLabel: 'Штрихкод',
    each: 'за штуку',
    viewItem: 'Открыть страницу',
    boughtSeparately: 'По отдельности',
    inThisBox: 'В наборе',
    youSave: 'Экономия',
    againstSeparate: 'по сравнению с покупкой трёх средств по отдельности',
    seeBreakdown: 'Посмотреть расчёт',
    savingNote:
      'Цены обновляются в реальном времени, поэтому сравнение всегда показывает то, что вы заплатите сегодня. Пуф, футляр с зеркалом и подарочная коробка идут сверху.',
  },
  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Утренний ритуал',
    intro:
      'Сыворотка и крем утром и вечером, BB-крем каждое утро последним шагом. Полная инструкция к каждому средству есть на его странице; здесь о том, как три средства работают вместе.',
    steps: [
      {
        title: 'Сыворотка на чистую кожу',
        body:
          'Распределите по лицу и вбейте кончиками пальцев, утром и вечером. Дайте ей немного впитаться перед кремом.',
      },
      {
        title: 'Крем, чтобы удержать воду',
        body:
          'Немного крема поверх сыворотки, мягкими массажными движениями. Он запечатывает воду, которую только что принесла сыворотка.',
      },
      {
        title: 'BB-крем последним, каждое утро',
        body:
          'Нанесите точками, распределите, затем вбейте пуфом для ровного сияющего покрытия. Там, где нужно больше покрытия, добавьте второй тонкий слой.',
      },
      {
        title: 'Вечером',
        body:
          'Смойте BB-крем, затем только сыворотка и крем. Ночь коже, чтобы напиться.',
      },
    ],
    note:
      'Revita Glow даёт SPF 38 PA+++, поэтому это и утренняя защита от солнца, и тональная основа. Если долго находитесь на улице, обновляйте его в течение дня. Регулярно мойте пуф и давайте ему высохнуть в открытом футляре.',
  },
  video: {
    eyebrow: 'Сияние полной луны. За 20 секунд',
    title: 'Откройте коробку вместе с нами',
    body: 'Луна, лунная ваза на крышке, а затем всё, что внутри: сыворотка, крем, Revita Glow, пуф и футляр с зеркалом. Готово к подарку - или к себе.',
    poster: '/images/glass_skin_campaign/reel-poster.jpg',
  },
  evidence: {
    eyebrow: 'Доказательства',
    title: 'Почему кожа сияет',
    intro:
      'Стеклянная кожа это вода, удержанная там, где ей место, под ровным покрытием. Каждая цифра здесь относится к одному из трёх средств в коробке.',
    cards: [
      {
        value: '+82%',
        title: 'Увлажнение после одного нанесения',
        body:
          'Гиалуроновый крем поднял увлажнённость кожи на 82% сразу после одного нанесения, и через 72 часа увлажнение оставалось заметно выше исходного.',
      },
      {
        value: '2 000 ppm',
        title: 'Гидролизованная гиалуроновая кислота в сыворотке',
        body: 'Лёгкая низкомолекулярная форма, которая проникает и наполняет. Именно через сыворотку вода попадает внутрь.',
      },
      {
        value: '1 000 ppm',
        title: 'Высокомолекулярная гиалуроновая кислота в креме',
        body:
          'Крупная форма остаётся на поверхности и не выпускает воду. Сыворотка наполняет, крем запечатывает, и ни один не слабая копия другого.',
      },
      {
        value: 'SPF 38',
        title: 'PA+++ в финальном шаге',
        body:
          'Два органических и два минеральных фильтра, ниацинамид 2% и аденозин 0,04%. В Корее BB-крем зарегистрирован сразу для защиты от УФ, осветления и ухода за морщинами.',
      },
    ],
    footnote:
      'Hyaluronan 11 Multi-Complex это название, которое DTS MG даёт одиннадцати видам гиалуроновой кислоты в сыворотке и креме, от лёгкой формы, которая наполняет, до тяжёлой, которая удерживает. Все три средства дерматологически протестированы.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Для кого этот набор',
    forTitle: 'Подойдёт, если',
    forList: [
      'К середине дня кожа стягивается или выглядит тусклой, а хочется свежего сияния изнутри',
      'Нужна лёгкая основа со встроенной защитой от солнца вместо тонального крема',
      'Вы только знакомитесь с корейским уходом и хотите три шага, а не десять',
      'Ищете красивый подарок, которым будут пользоваться каждое утро',
    ],
    notForTitle: 'Выберите другое, если',
    notForList: [
      'Главная задача неровный тон и пигментные пятна. Для этого создан бокс Skin Brightening',
      'В приоритете высыпания. Бокс Problem Skin Care работает с ними в первую очередь',
      'Нужно плотное покрытие. Revita Glow даёт лёгкий естественный финиш, кушон Blemish Balm перекрывает больше',
      'Отдушки для вас проблема. Все три средства слегка ароматизированы',
    ],
    alternativesLabel: 'Упомянутые выше',
    alternatives: [
      { productNumber: '56', label: 'Skin Brightening Beauty Box' },
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
      { productNumber: '41', label: 'Skin Caring Blemish Balm Cushion' },
    ],
    note:
      'Сыворотка, крем и BB-крем дерматологически протестированы. Если кожа реактивная, сначала попробуйте каждое средство на небольшом участке.',
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Подробности',
    rows: [
      { label: 'Состав набора', value: 'Сыворотка Moisture Replenishing Hyaluron 30 мл, крем Moisture Replenishing Hyaluron 50 г, BB-крем Revita Glow 50 г в одном оттенке, пуф Revita Glow и праздничный футляр для пуфа с зеркалом' },
      { label: 'Оттенки', value: '#01 Bright светлее и сияющее, для светлой и светло-средней кожи. #02 Natural теплее и чуть глубже, для светло-средней и средней кожи' },
      { label: 'Ритуал', value: 'Сыворотка и крем утром и вечером; BB-крем каждое утро последним шагом' },
      { label: 'Защита от солнца', value: 'SPF 38 PA+++ в BB-креме' },
      { label: 'Тип кожи', value: 'Сухая и обезвоженная кожа и любая кожа, которой хочется сияющего финиша. Обезвоженной может быть кожа любого типа' },
      { label: 'Аромат', value: 'Все три средства слегка ароматизированы, аллергены указаны на странице каждого' },
      { label: 'Подарочная коробка', value: 'Праздничная коробка GENOSYS с рисунком корейской лунной вазы' },
      { label: 'Производство', value: 'Сделано в Корее для DTS MG Co., Ltd., Сеул' },
      { label: 'Тестирование', value: 'Сыворотка, крем и BB-крем дерматологически протестированы' },
      { label: 'Скидки', value: 'Цена набора уже со скидкой, другие предложения к нему не суммируются' },
    ],
  },
  faq: {
    eyebrow: 'Перед покупкой',
    title: 'Вопросы, которые стоит задать',
    items: [
      {
        q: 'Какой оттенок выбрать?',
        a: '#01 Bright для светлой и светло-средней кожи: он светлее и сияющее. #02 Natural для светло-средней и средней кожи: теплее и чуть глубже, с более мягким сиянием. В обоих одинаковые SPF 38 PA+++, ниацинамид и аденозин, отличается только пигмент.',
      },
      {
        q: 'Что за лунная ваза на коробке?',
        a: 'Корейская лунная ваза, тальхангари, одна из самых любимых вещей корейского фарфора, названа за сходство с полной луной. Она символизирует изобилие, чистоту и удачу, поэтому с ней встречают новый сезон и новый год. Её мягкое белое сияние и есть тот образ, ради которого создан этот ритуал.',
      },
      {
        q: 'Хватит ли BB-крема для защиты от солнца?',
        a: 'В нём SPF 38 PA+++, поэтому в обычный день это ваш утренний шаг защиты. Если долго находитесь на улице, обновляйте его в течение дня или добавьте отдельный солнцезащитный крем.',
      },
      {
        q: 'Нужны ли все три средства?',
        a: 'Сыворотка и крем работают и по отдельности, но вместе делают то, что не может ни одно из них: сыворотка наполняет кожу водой, крем её удерживает. BB-крем это финиш и защита от солнца, поэтому его можно пропустить вечером, но не утром.',
      },
      {
        q: 'Подходит ли набор как подарок?',
        a: 'Да. Он приходит в праздничной коробке GENOSYS с рисунком лунной вазы, внутри пуф и футляр с зеркалом. Выберите оттенок, ближе всего подходящий тому, кому дарите.',
      },
      {
        q: 'Можно ли купить средства по отдельности?',
        a: 'Да, каждое по ссылке выше. Набор это те же три полноразмерных средства дешевле в сумме, плюс пуф, футляр с зеркалом и подарочная коробка.',
      },
    ],
  },
}

export const GLASS_SKIN_RITUAL_COPY: BeautyBoxLocaleCopy = { en: EN, ar: AR, ru: RU }
