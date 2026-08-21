/**
 * Copy for the SENSITIVE SKIN BEAUTY BOX page (product 62), in English, Arabic
 * and Russian.
 *
 * ─── The EGF substitution, 17 Aug 2026 ───────────────────────────────────────
 *
 * This box shipped with EGF REPAIR OXYMASK CREAM (product 26) in the treatment
 * slot. That product is discontinued and its record is now out of stock and
 * hidden, so the box was selling a unit that no longer exists, and the fulfilment
 * mapping in lib/moyskladBeautyBoxExplosion.ts was still raising a picking line
 * for it.
 *
 * It is replaced by SKIN RESCUE OVERNIGHT CREAM MASK (product 34), which the new
 * box photograph already shows. That is the right successor rather than a
 * convenient one:
 *   - same format, a cream mask rather than a sheet or a serum
 *   - same mechanism the oxymask was sold on, oxygen capsules that burst on
 *     contact and melt into the cream
 *   - 100 g against the oxymask's 50 g
 *   - and, unlike the oxymask, a four-week clinical trial measuring erythema,
 *     which is the single most relevant endpoint a reactive-skin box can cite
 *
 * The parts total rises from 1,696 to 1,746 AED. No price is written into this
 * module - see beautyBoxCopy.ts - so the page recalculates the saving from the
 * live records on its own.
 *
 * ─── Sourcing rules ──────────────────────────────────────────────────────────
 *
 * A kit has no paperwork of its own, so every claim below traces to a document
 * belonging to one of the six products inside it. All six already have audited
 * bespoke pages, and the figures here are taken from those modules rather than
 * re-derived, so the box and the product pages cannot disagree:
 *
 *   Snow O₂ 180ml (10)            see copy in deepMoisturizing.ts
 *     Methyl Perfluoroisobutyl Ether 3.000% is the bubble agent. pH 5.86.
 *     "Apply the product on dry face, avoiding eyes. When oxygen bubbles occur,
 *      give a circular massage and rinse off with tepid water."
 *     CONTAINS Sodium Laureth Sulfate, Parfum and Limonene. This matters more on
 *     this box than on any other, and the page says so out loud.
 *
 *   Snow Booster 200ml (16)       see copy in deepMoisturizing.ts
 *     Betaine 3.000%, Lactobacillus/Pumpkin Ferment Extract 1.000%, Nelumbo
 *     Nucifera Flower Extract 0.100%. pH 6.08. Fragrance-free. Can go over
 *     make-up.
 *
 *   All For Sensitive Serum 30ml (19)   see components/product/afs/afsCopy.ts
 *     MultiEx BSASM Plus 1.0000% per the safety assessment, carrying seven
 *     botanicals: Centella, Polygonum Cuspidatum, Scutellaria Baicalensis,
 *     Camellia Sinensis, Glycyrrhiza Glabra, Chamomilla Recutita, Rosmarinus.
 *     Betaine 0.5000%, Allantoin 0.1000%, Sodium Hyaluronate 0.0100%.
 *     Function: soothing, moisturizing. pH 5.77 against 5.20-6.20. Under
 *     10 cfu/ml against a limit of 100. Dermatologically tested.
 *     CONTAINS orange peel oil 0.0200% and Limonene 0.0176%. Never call it
 *     fragrance-free. There is no efficacy study on this product.
 *
 *   Skin Barrier Protecting Cream 100g (27)  see spcream/spcreamCopy.ts
 *     Ceramide NP 0.500% = 5,000 ppm, and the Korean carton panel prints that
 *     number in brackets: 세라마이드엔피(5,000ppm). Glycerin 17.490%, nearly a
 *     fifth of the tube, the richest cream in the range. Shea butter 3.000%.
 *     Function: soothing, hydrating. Apply on the face and gently pat, morning
 *     and evening. pH 6.07 against 6.00-7.00. Dermatologically tested.
 *     CONTAINS Parfum 0.0107%, Linalool 0.00326%, Coumarin 0.00104%.
 *
 *   Skin Rescue Overnight Cream Mask 100g (34)  see overnight/overnightCopy.ts
 *     Niacinamide 2% and Adenosine 0.04% are the Korean efficacy ingredients.
 *     Dual formula: oxygen capsules burst on contact and melt with the pink
 *     ceramide cream. Function: soothing, revitalizing. Applied at the LAST step
 *     and NOT washed off. Do not use near the eyes. pH 5.71 inside 5.8 ± 0.5.
 *     Four-week trial by Dr Koziej: TEWL improved 15%, erythema improved 26%.
 *     Special overnight care once or twice a week. PAO is not documented.
 *     The English artwork carries no pregnancy or lactation warning, so do not
 *     invent either an "avoid" or a "pregnancy-safe".
 *
 *   Soothing Bomb Sea Algae Mask 25g (36)  see deepMoisturizing.ts
 *     Eucalace® sheet. Jania Rubens 10 ppm, Undaria Pinnatifida 10 ppm,
 *     Centella Asiatica. pH 5.69. "No artificial pigment."
 *     "Apply the mask closely to the face and leave on for 15-20 minutes."
 *     ONE sheet in this box, not three. Do not borrow 59's three-mask copy.
 *
 * ─── Claims that must not come back without a new document ───────────────────
 *
 *   "CELLASURE™ 5X"          Appears in the old database description for the
 *                            serum. It is in no formula, label, safety
 *                            assessment or COA for product 19. The real complex
 *                            is MultiEx BSASM Plus at 1%, and it is named.
 *   "5-Ceramide Complex"     The old description for the cream. The formula
 *                            carries ONE ceramide, Ceramide NP, at 5,000 ppm.
 *                            One ceramide at a high dose is the better story
 *                            and it is the true one.
 *   "EGF" anything           Product 26 is discontinued. No growth factor
 *                            appears anywhere in this box now.
 *   "Oxygen therapy"         No Snow O₂ or product 34 document uses the word
 *                            therapy.
 *   "Hypoallergenic",        Nothing in this box is tested or registered for
 *   "fragrance-free box",    either. Three of the six items are fragranced and
 *   "suitable for all        the page states which.
 *   sensitive skin"
 *   Any duration for the     Nothing documents how many weeks the box lasts.
 *   box                      Pack sizes and the mask count are stated instead.
 *
 * See beautyBoxCopy.ts for the rules every box module follows, including why no
 * price appears in any of them.
 */

import type { BeautyBoxCopy, BeautyBoxLocaleCopy } from '../beautyBoxCopy'

const EN: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Products',
  headline: 'Built for skin that reacts, and measured for redness.',
  subheadline:
    'Six full-size GENOSYS products for sensitive, reactive skin: a cleanser that works without scrubbing, a fragrance-free toner, a serum built on a seven-botanical calming complex, the richest barrier cream in the range at 5,000 ppm ceramide, an overnight cream mask that cut redness 26% over four weeks, and a sea algae sheet for the bad evenings. Bought together they cost less than the six bought one at a time.',
  heroBullets: [
    'Redness measured 26% lower and water loss 15% lower after four weeks with the overnight mask',
    'Ceramide NP at 5,000 ppm in the barrier cream, a dose its Korean panel prints on the carton',
    'Every item is the full retail size sold on its own page, not a travel sample',
    'Read the fragrance note below before you buy: three of the six are fragranced',
  ],
  kitSize: '6 products',
  fullSizeNote: 'Full sizes',
  vatIncluded: 'VAT included',
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
    { value: '26%', label: 'less redness after four weeks with the overnight mask' },
    { value: '5,000 ppm', label: 'Ceramide NP in the barrier cream' },
    { value: '6', label: 'full-size products, in the order you use them' },
    { value: 'Korea', label: 'made by DTS MG in Seoul, the lab GENOSYS was built around' },
  ],
  contents: {
    eyebrow: 'What is inside',
    title: 'Six products, one sequence',
    intro:
      'Every product here has its own page, its own paperwork and its own price, so you can read the full detail on any of them before you buy. What the box does is put the whole sequence in your hands at once, for less than the pieces.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Step 1 - Cleanse',
        body:
          'Goes on to a dry face, where oxygen bubbles form on their own and lift make-up and the day off the skin. Massage in circles as they appear, then rinse with tepid water. The point on reactive skin is that nothing has to be scrubbed off.',
        facts: ['Bubble agent 3.000%', 'pH 5.86', 'Fragranced · contains limonene and SLS'],
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'Step 2 - Tone',
        body:
          'The one item in the box with no fragrance in it at all. A daily toner that hydrates and calms with botanical extracts while bringing pH back down after cleansing, which matters because the serum works best on skin that is still damp.',
        facts: ['Betaine 3.000%', 'Pumpkin ferment 1.000%', 'pH 6.08', 'Fragrance-free'],
      },
      {
        titleKey: 'routineAllForSensitiveSerumTitle',
        productNumber: '19',
        quantity: 1,
        step: 'Step 3 - Calm',
        body:
          'The calming step, and the reason this is the sensitive box rather than a hydration one. It is built on a botanical complex at a full 1% of the bottle carrying seven plants — centella, polygonum, scutellaria, green tea, licorice, chamomile and rosemary — with allantoin and betaine behind them.',
        facts: ['Botanical complex 1.0000%', 'Allantoin 0.1000%', 'pH 5.77', 'Fragranced · orange peel oil'],
      },
      {
        titleKey: 'routineSkinBarrierCreamTitle',
        productNumber: '27',
        quantity: 1,
        step: 'Step 4 - Seal',
        body:
          'The richest cream GENOSYS makes, and the one with the number worth checking: Ceramide NP at 5,000 ppm, which the Korean carton panel prints in brackets next to the ingredient because ceramide creams usually run it far lower. Behind it, glycerin at nearly a fifth of the tube.',
        facts: ['Ceramide NP 5,000 ppm', 'Glycerin 17.490%', 'Shea butter 3.000%', 'pH 6.07', 'Fragranced'],
      },
      {
        titleKey: 'routineOvernightMaskTitle',
        productNumber: '34',
        quantity: 1,
        step: 'Once or twice a week, overnight',
        body:
          'The treatment step, and the only item in the box with a clinical trial behind it. Oxygen capsules burst as it goes on and melt into a pink ceramide cream. It is the last thing on your face at night and it is not washed off. Niacinamide at 2% and adenosine at 0.04% are the working actives.',
        facts: ['Niacinamide 2%', 'Adenosine 0.04%', 'Erythema −26% at 4 weeks', 'pH 5.71', 'Leave on · avoid the eyes'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 1,
        step: 'When skin needs a reset',
        body:
          'One Eucalace® sheet soaked in a sea algae complex with centella. Fifteen to twenty minutes after toning on an evening when skin feels hot or tight, then carry on with the serum and cream as usual. One sheet, so treat it as a rescue rather than a routine.',
        facts: ['1 sheet', '15-20 minutes', 'pH 5.69', 'No artificial pigment'],
      },
    ],
    eanLabel: 'Barcode',
    each: 'each',
    viewItem: 'Read the full page',
    boughtSeparately: 'Bought separately',
    inThisBox: 'In this box',
    youSave: 'You save',
    againstSeparate: 'against buying the six separately',
    seeBreakdown: 'See the breakdown',
    savingNote:
      'Prices update live, so this comparison is always what you would actually pay today.',
  },
  howTo: {
    eyebrow: 'How to use it',
    title: 'Four steps daily, two masks as needed',
    intro:
      'Cleanse, tone, serum, cream, morning and evening. The overnight mask replaces your night cream once or twice a week; the sheet mask is for the evening skin has had enough. Each product carries its own full instructions on its own page.',
    steps: [
      {
        title: 'Cleanse on dry skin',
        body:
          'Pump the cleanser on to a dry face, avoiding the eyes. Wait for the oxygen bubbles, massage in circles, rinse with tepid water. Morning and evening, and no flannel or brush.',
      },
      {
        title: 'Tone while skin is damp',
        body:
          'Straight after cleansing, before skin dries, pressed in with your palms rather than wiped. This is the fragrance-free step, so if your skin is having a bad week you can stop the routine here and just tone and seal.',
      },
      {
        title: 'Serum, two or three drops',
        body:
          'Pat it over face and neck and let it settle rather than rubbing it in. Morning and evening, always before the cream.',
      },
      {
        title: 'Cream to close',
        body:
          'Apply on the face and gently pat, which is what the carton asks for and what reactive skin prefers to rubbing. In the morning, finish with your sunscreen.',
      },
      {
        title: 'Overnight mask, once or twice a week',
        body:
          'On those nights it goes on last instead of the cream, and it stays on until morning: do not wash it off. Keep it away from the eyes. It can also sit under make-up as a base, ten minutes then wipe and reapply.',
      },
      {
        title: 'Sheet mask on the bad evening',
        body:
          'After toning, lay the sheet on for 15 to 20 minutes, take it off, pat in what is left, then serum and cream as normal. There is one sheet in the box.',
      },
    ],
    note:
      'Sunscreen is the one thing this routine assumes and does not contain. If your skin is currently broken, weeping or freshly treated, wait until it has closed before starting anything here.',
  },
  evidence: {
    eyebrow: 'The clinical results',
    title: 'Measured on real skin',
    intro:
      'One product in this box has been through clinical measurement, and it happens to have been measured on the two things that matter most to reactive skin. Here is what came back, and what the rest of the box rests on instead.',
    cards: [
      {
        value: '26%',
        title: 'Less redness after four weeks',
        body:
          'Erythema improved 26% over a four-week trial of the overnight cream mask, run by an independent laboratory. Redness is the symptom most people mean when they say their skin is sensitive, and it is the one endpoint here that was actually measured.',
      },
      {
        value: '15%',
        title: 'Less water lost through the skin',
        body:
          'Transepidermal water loss improved 15% in the same four-week trial. That is a barrier reading rather than a hydration one: it measures how much moisture the skin is leaking, not how much you put on it.',
      },
      {
        value: '5,000 ppm',
        title: 'Ceramide NP in the barrier cream',
        body:
          'Not a trial, a declaration — and an unusually checkable one. The Korean carton panel prints the ceramide dose in brackets next to the ingredient, which most brands never do, and 5,000 ppm is well above where ceramide creams normally sit.',
      },
    ],
    footnote:
      'The 26% and 15% readings are both from the same four-week study on the overnight cream mask. The serum, cleanser, toner and sheet mask have no efficacy studies, and we are not going to imply otherwise: the cleanser, toner, serum and cream are dermatologically tested, which is a safety test and not a performance one.',
  },
  suited: {
    eyebrow: 'Suitability',
    title: 'Who this box is for',
    forTitle: 'A good match if',
    forList: [
      'Your skin flushes, stings or reddens easily and you want the sequence rather than another single product',
      'Your barrier is worn down — from over-exfoliating, retinoids, hard water or a Dubai summer of air conditioning',
      'You want a night that is a treatment rather than a cream, once or twice a week',
      'You are rebuilding after a course of treatments and need comfort rather than actives',
    ],
    notForTitle: 'Look elsewhere if',
    notForList: [
      'Fragrance is what sets your skin off. Three of the six are fragranced: the cleanser has parfum and limonene, the serum has orange peel oil, the cream has parfum, linalool and coumarin. Only the toner and the two masks are free of it. No GENOSYS box avoids this, because all six are built around the same cleanser — buy the toner, the masks and the cream individually instead',
      'Your skin is broken, weeping or open. Nothing here is for use on a wound, and the overnight mask says to avoid the eye area',
      'You are treating acne or congestion rather than reactivity. The Problem Skin Care box is built for that',
      'Pigmentation or uneven tone is the goal. The Skin Brightening box targets it directly',
      'You already own two or three of these six. Buying the gaps on their own will cost you less',
    ],
    alternativesLabel: 'The boxes mentioned above',
    alternatives: [
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
      { productNumber: '56', label: 'Skin Brightening Beauty Box' },
    ],
    note:
      'The cleanser, toner, serum and cream are all dermatologically tested. Skin is individual, though, so if one product does not agree with yours, drop that one rather than the whole routine — and patch test behind the ear first if you know you react.',
  },
  details: {
    eyebrow: 'Specifications',
    title: 'The details',
    rows: [
      {
        label: 'Contents',
        value: '6 products: cleanser 180ml, toner 200ml, serum 30ml, barrier cream 100g, overnight cream mask 100g, 1 sheet mask',
      },
      { label: 'Skin type', value: 'Sensitive and reactive skin. The cleanser and toner suit all skin types' },
      { label: 'Routine', value: 'Cleanse, tone, serum, cream, morning and evening. Overnight mask once or twice a week' },
      { label: 'Fragrance', value: 'Cleanser, serum and cream are fragranced. Toner and both masks are not' },
      { label: 'Clinical', value: 'Overnight mask: erythema −26%, water loss −15% over four weeks' },
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
        q: 'It is called the sensitive box, so why is anything in it fragranced?',
        a: 'A fair question and we would rather answer it than bury it. Three of the six carry fragrance: the cleanser, the serum and the barrier cream. The toner and both masks do not. Every one of those ingredients is named on the label, and the amounts are small — the cream\u2019s parfum is around a hundredth of a per cent — but small is not zero, and if fragrance is your trigger then this box is the wrong purchase. The honest route in that case is to buy the toner, the two masks and skip the rest, because all six GENOSYS boxes are built around the same fragranced cleanser.',
      },
      {
        q: 'What happened to the EGF Repair Oxymask that used to be in this box?',
        a: 'It has been discontinued, so we replaced it with the Skin Rescue Overnight Cream Mask. It is the closer relative than the swap sounds: same cream-mask format, the same oxygen capsules that burst on contact, double the size at 100 g, and unlike the oxymask it has a four-week trial behind it measuring redness and water loss. The box is better for the change, not worse.',
      },
      {
        q: 'Can I just buy the products separately?',
        a: 'Yes, and each one is linked above. The box is not a different formula or an exclusive size, it is the same six units at a lower total. If you already own some, buying the gaps will cost you less than the box.',
      },
      {
        q: 'Do I use the overnight mask instead of the cream, or on top of it?',
        a: 'Instead of it, on the nights you use it. The mask is the last step and it stays on until morning, so on those nights the order is cleanse, tone, serum, mask. Use the barrier cream every other night. Once or twice a week is what the manufacturer specifies.',
      },
      {
        q: 'Can I use it while pregnant or breastfeeding?',
        a: 'We cannot answer that for this box. None of the six carries a pregnancy clearance in its paperwork, and the overnight mask\u2019s English carton carries no pregnancy warning either way — an absence is not a clearance. Take the ingredient lists to your doctor, who can also tell you whether niacinamide at 2% is something they are comfortable with.',
      },
      {
        q: 'My skin is red right now. Should I start with everything at once?',
        a: 'No. On angry skin, start with the toner and the barrier cream only, twice a day, for about a week. Add the serum next, then the overnight mask once things have settled. Introducing six products to reactive skin on the same evening makes it impossible to tell which one helped and which one did not.',
      },
      {
        q: 'How long will it last?',
        a: 'That depends on how heavy-handed you are. What is fixed: the cleanser, toner, serum and both creams are full retail units, and there is exactly one sheet mask, which is one session. The overnight mask at once or twice a week will outlast the daily items by a long way.',
      },
    ],
  },
}

const AR: BeautyBoxCopy = {
  eyebrow: 'صندوق الجمال',
  backToProducts: 'المنتجات',
  headline: 'مصمَّم لبشرة تتفاعل، ومقيس على الاحمرار.',
  subheadline:
    'ستة منتجات GENOSYS بالحجم الكامل للبشرة الحساسة والمتفاعلة: منظف يعمل بلا فرك، وتونر بلا عطر، وسيروم مبني على مركّب مهدّئ من سبعة نباتات، وأغنى كريم حاجز في المجموعة بسيراميد 5,000 جزء من المليون، وقناع كريمي ليلي خفّض الاحمرار 26% خلال أربعة أسابيع، وقناع ورقي بطحالب البحر للأمسيات الصعبة. شراؤها مجتمعة أقل تكلفة من شرائها واحداً واحداً.',
  heroBullets: [
    'الاحمرار أقل بنسبة 26% وفقدان الماء أقل بنسبة 15% بعد أربعة أسابيع مع القناع الليلي',
    'سيراميد NP بـ 5,000 جزء من المليون في كريم الحاجز، وهي جرعة تطبعها لوحته الكورية على العلبة',
    'كل منتج بالحجم الكامل المعروض في صفحته، وليس عيّنة سفر',
    'اقرئي ملاحظة العطر أدناه قبل الشراء: ثلاثة من الستة معطَّرة',
  ],
  kitSize: '6 منتجات',
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
  badges: ['GENOSYS أصلي', 'صُنع في كوريا', 'أحجام كاملة', 'دبي في 1-2 ساعة'],
  stats: [
    { value: '26%', label: 'احمرار أقل بعد أربعة أسابيع مع القناع الليلي' },
    { value: '5,000 ppm', label: 'سيراميد NP في كريم الحاجز' },
    { value: '6', label: 'منتجات بالحجم الكامل، بترتيب استخدامها' },
    { value: 'كوريا', label: 'صُنع من DTS MG في سيول، المختبر الذي بُنيت جينوسيس حوله' },
  ],
  contents: {
    eyebrow: 'ما في الداخل',
    title: 'ستة منتجات، تتابع واحد',
    intro:
      'لكل منتج هنا صفحته الخاصة ووثائقه وسعره، فيمكنك قراءة التفاصيل الكاملة لأيّها قبل الشراء. وما يفعله الصندوق أنه يضع التتابع كلّه في يديك مرة واحدة، بأقل من ثمن أجزائه.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'الخطوة 1 - التنظيف',
        body:
          'يوضع على وجه جافّ، فتتكوّن فقاعات الأكسجين من تلقاء نفسها وترفع المكياج وأثر اليوم عن البشرة. دلّكي بحركات دائرية عند ظهورها، ثم اشطفي بماء فاتر. والمقصود على بشرة متفاعلة أن لا شيء يحتاج إلى فرك.',
        facts: ['عامل الفقاعات 3.000%', 'الحموضة 5.86', 'معطَّر · يحتوي ليمونين وكبريتات لوريث'],
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'الخطوة 2 - التونر',
        body:
          'تونر يومي خفيف لجميع أنواع البشرة يعيد الرطوبة والراحة بعد التنظيف. يحتوي على البيتين 3% وقاعدة مائية مرطبة، ويهيئ البشرة للسيروم من دون طبقة ثقيلة.',
        facts: ['بيتين 3%', 'قاعدة ترطيب نحو 18%', 'الأس الهيدروجيني 6.14', 'بلا عطر مضاف'],
      },
      {
        titleKey: 'routineAllForSensitiveSerumTitle',
        productNumber: '19',
        quantity: 1,
        step: 'الخطوة 3 - التهدئة',
        body:
          'سيروم خفيف للبشرة الحساسة والمتفاعلة. يجمع MultiEx BSASM® Plus بتركيز 1% سبعة مستخلصات نباتية، ويكمل البيتين 0.5% والألانتوين 0.1% العناية بترطيب مريح من دون طبقة ثقيلة.',
        facts: ['MultiEx BSASM® Plus بتركيز 1%', 'بيتين 0.5% · ألانتوين 0.1%', 'الأس الهيدروجيني 5.77', 'يحتوي على زيت قشر البرتقال والليمونين'],
      },
      {
        titleKey: 'routineSkinBarrierCreamTitle',
        productNumber: '27',
        quantity: 1,
        step: 'الخطوة 4 - الإغلاق',
        body:
          'أغنى كريم تصنعه جينوسيس، وصاحب الرقم الذي يستحق التحقّق: سيراميد NP بـ 5,000 جزء من المليون، وهو ما تطبعه اللوحة الكورية بين قوسين إلى جانب المكوّن، لأن كريمات السيراميد تحمله عادة بأقل من ذلك بكثير. ووراءه جليسرين يقارب خمس العبوة.',
        facts: ['سيراميد NP 5,000 ppm', 'جليسرين 17.490%', 'زبدة الشيا 3.000%', 'الحموضة 6.07', 'معطَّر'],
      },
      {
        titleKey: 'routineOvernightMaskTitle',
        productNumber: '34',
        quantity: 1,
        step: 'مرة أو مرتين أسبوعياً، ليلاً',
        body:
          'خطوة المعالجة، والمنتج الوحيد في الصندوق الذي تقف خلفه تجربة سريرية. تنفجر كبسولات الأكسجين عند وضعه وتذوب في كريم سيراميد وردي. وهو آخر ما يبقى على وجهك ليلاً ولا يُشطف. والنياسيناميد بنسبة 2% والأدينوزين بنسبة 0.04% هما الفعّالان العاملان.',
        facts: ['نياسيناميد 2%', 'أدينوزين 0.04%', 'الاحمرار −26% في 4 أسابيع', 'الحموضة 5.71', 'يُترك · تجنّبي العينين'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 1,
        step: 'عندما تحتاج البشرة إلى إعادة ضبط',
        body:
          'ورقة Eucalace® واحدة مشبعة بمركّب طحالب البحر مع السنتيلا. خمس عشرة إلى عشرين دقيقة بعد التونر في أمسية تشعر فيها البشرة بالحرارة أو الشدّ، ثم تابعي بالسيروم والكريم كالمعتاد. ورقة واحدة، فتعامليها كإنقاذ لا كروتين.',
        facts: ['ورقة واحدة', '15-20 دقيقة', 'الحموضة 5.69', 'بلا صبغات صناعية'],
      },
    ],
    eanLabel: 'الباركود',
    each: 'للواحدة',
    viewItem: 'اقرئي الصفحة الكاملة',
    boughtSeparately: 'عند الشراء منفصلاً',
    inThisBox: 'في هذا الصندوق',
    youSave: 'توفّرين',
    againstSeparate: 'مقابل شراء الستة منفصلة',
    seeBreakdown: 'عرض التفصيل',
    savingNote: 'الأسعار تُحدَّث مباشرة، فهذه المقارنة هي دائماً ما ستدفعينه فعلاً اليوم.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'أربع خطوات يومياً، وقناعان حسب الحاجة',
    intro:
      'تنظيف وتونر وسيروم وكريم، صباحاً ومساءً. والقناع الليلي يحلّ محلّ كريم الليل مرة أو مرتين أسبوعياً، والقناع الورقي للأمسية التي تكون البشرة قد اكتفت فيها. ولكل منتج تعليماته الكاملة في صفحته.',
    steps: [
      {
        title: 'نظّفي على بشرة جافة',
        body:
          'ضعي المنظف على وجه جافّ مع تجنّب العينين. انتظري فقاعات الأكسجين، دلّكي بحركات دائرية، واشطفي بماء فاتر. صباحاً ومساءً، وبلا ليفة أو فرشاة.',
      },
      {
        title: 'التونر على بشرة رطبة',
        body:
          'مباشرة بعد التنظيف وقبل أن تجفّ البشرة، ويُضغط بالكفّين لا يُمسح. وهذه هي الخطوة بلا عطر، فإن كانت بشرتك تمرّ بأسبوع سيّئ يمكنك التوقّف هنا والاكتفاء بالتونر والإغلاق.',
      },
      {
        title: 'السيروم، قطرتان أو ثلاث',
        body: 'وزّعيه على الوجه والرقبة بالطبطبة واتركيه يستقرّ بدل فركه. صباحاً ومساءً، ودائماً قبل الكريم.',
      },
      {
        title: 'الكريم للإغلاق',
        body:
          'يوضع على الوجه مع طبطبة لطيفة، وهو ما تطلبه العلبة وما تفضّله البشرة المتفاعلة على الفرك. وفي الصباح، أنهي بواقي الشمس.',
      },
      {
        title: 'القناع الليلي، مرة أو مرتين أسبوعياً',
        body:
          'في تلك الليالي يوضع أخيراً بدل الكريم، ويبقى حتى الصباح: لا تشطفيه. وأبعديه عن العينين. ويمكنه أيضاً أن يكون قاعدة تحت المكياج، عشر دقائق ثم مسح وإعادة وضع.',
      },
      {
        title: 'القناع الورقي في الأمسية الصعبة',
        body:
          'بعد التونر، ضعي الورقة 15 إلى 20 دقيقة، ثم أزيليها وطبطبي ما تبقّى، ثم السيروم والكريم كالمعتاد. وفي الصندوق ورقة واحدة.',
      },
    ],
    note:
      'واقي الشمس هو الشيء الوحيد الذي يفترضه هذا الروتين ولا يحتويه. وإن كانت بشرتك حالياً مجروحة أو مترشّحة أو خضعت لعلاج حديث، فانتظري حتى تُغلق قبل البدء بأي شيء هنا.',
  },
  evidence: {
    eyebrow: 'النتائج السريرية',
    title: 'مقيسة على بشرة حقيقية',
    intro:
      'منتج واحد في هذا الصندوق خضع لقياس سريري، وحدث أن قياسه جرى على أهمّ أمرين للبشرة المتفاعلة. وهذا ما عاد به، وما يستند إليه بقيّة الصندوق بدلاً منه.',
    cards: [
      {
        value: '26%',
        title: 'احمرار أقل بعد أربعة أسابيع',
        body:
          'تحسّن الاحمرار بنسبة 26% خلال تجربة أربعة أسابيع للقناع الكريمي الليلي، أجراها مختبر مستقل. والاحمرار هو العَرَض الذي يقصده معظم الناس عندما يقولون إن بشرتهم حسّاسة، وهو المؤشّر الوحيد هنا الذي قيس فعلاً.',
      },
      {
        value: '15%',
        title: 'فقدان أقل للماء عبر البشرة',
        body:
          'تحسّن فقدان الماء عبر البشرة بنسبة 15% في تجربة الأربعة أسابيع نفسها. وهذه قراءة حاجز لا قراءة ترطيب: فهي تقيس كم ترشح البشرة من رطوبة، لا كم تضعين عليها.',
      },
      {
        value: '5,000 ppm',
        title: 'سيراميد NP في كريم الحاجز',
        body:
          'ليست تجربة بل إعلاناً — وقابلاً للتحقّق بصورة غير معتادة. فاللوحة الكورية على العلبة تطبع جرعة السيراميد بين قوسين إلى جانب المكوّن، وهو ما لا تفعله معظم العلامات، و5,000 جزء من المليون أعلى بكثير من موضع كريمات السيراميد عادة.',
      },
    ],
    footnote:
      'قراءتا 26% و15% من الدراسة نفسها ذات الأربعة أسابيع على القناع الكريمي الليلي. أما السيروم والمنظف والتونر والقناع الورقي فلا دراسات فعالية لها، ولن نوحي بغير ذلك: فالمنظف والتونر والسيروم والكريم مختبرة جلدياً، وذلك اختبار سلامة لا اختبار أداء.',
  },
  suited: {
    eyebrow: 'الملاءمة',
    title: 'لمن هذا الصندوق',
    forTitle: 'مناسب إن',
    forList: [
      'بشرتك تتورّد أو تلسع أو تحمرّ بسهولة وتريدين التتابع لا منتجاً منفرداً آخر',
      'حاجز بشرتك مُنهَك — من تقشير مفرط أو ريتينويد أو ماء قاسٍ أو صيف دبي مع التكييف',
      'تريدين ليلة تكون معالجة لا كريماً، مرة أو مرتين أسبوعياً',
      'تعيدين البناء بعد سلسلة علاجات وتحتاجين الراحة لا الفعّالات',
    ],
    notForTitle: 'ابحثي عن غيره إن',
    notForList: [
      'كان العطر هو ما يهيّج بشرتك. فثلاثة من الستة معطَّرة: المنظف فيه عطر وليمونين، والسيروم فيه زيت قشر البرتقال، والكريم فيه عطر ولينالول وكومارين. والتونر والقناعان وحدهم خالون منه. ولا صندوق جينوسيس يتجنّب هذا لأن الستة كلها مبنية على المنظف نفسه — فاشتري التونر والقناعين والكريم منفصلة',
      'كانت بشرتك مجروحة أو مترشّحة أو مفتوحة. فلا شيء هنا للاستخدام على جرح، والقناع الليلي ينصّ على تجنّب منطقة العين',
      'كنتِ تعالجين حبّ الشباب أو الانسداد لا التفاعلية. فصندوق العناية بالبشرة المعرّضة للمشاكل مبني لذلك',
      'كان التصبّغ أو تفاوت اللون هو الهدف. فصندوق تفتيح البشرة يستهدفه مباشرة',
      'كنتِ تملكين اثنين أو ثلاثة من هذه الستة. فشراء الناقص وحده سيكلّفك أقل',
    ],
    alternativesLabel: 'الصناديق المذكورة أعلاه',
    alternatives: [
      { productNumber: '55', label: 'صندوق العناية بالبشرة المعرّضة للمشاكل' },
      { productNumber: '56', label: 'صندوق تفتيح البشرة' },
    ],
    note:
      'المنظف والتونر والسيروم والكريم كلها مختبرة جلدياً. لكن البشرة فردية، فإن لم يوافق منتج واحد بشرتك فاستبعدي ذلك المنتج لا الروتين كلّه — واختبري وراء الأذن أولاً إن كنتِ تعرفين أنك تتفاعلين.',
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      {
        label: 'المحتويات',
        value: '6 منتجات: منظف 180 مل، تونر 200 مل، سيروم 30 مل، كريم حاجز 100 غ، قناع كريمي ليلي 100 غ، قناع ورقي واحد',
      },
      { label: 'نوع البشرة', value: 'البشرة الحساسة والمتفاعلة. والمنظف والتونر يناسبان كل الأنواع' },
      { label: 'الروتين', value: 'تنظيف وتونر وسيروم وكريم صباحاً ومساءً. والقناع الليلي مرة أو مرتين أسبوعياً' },
      { label: 'العطر', value: 'المنظف والسيروم والكريم معطَّرة. والتونر والقناعان لا' },
      { label: 'سريرياً', value: 'القناع الليلي: الاحمرار −26%، فقدان الماء −15% خلال أربعة أسابيع' },
      { label: 'المنشأ', value: 'صُنع في كوريا من DTS MG Co., Ltd.، سيول' },
      { label: 'الاختبار', value: 'المنظف والتونر والسيروم والكريم كلها مختبرة جلدياً' },
      { label: 'الباركود', value: 'لكل منتج رمزه EAN، مُدرج مع المنتج أعلاه' },
      { label: 'الخصومات', value: 'سعر المجموعة هو الخصم أصلاً، فالعروض الأخرى لا تُجمع عليه' },
    ],
  },
  faq: {
    eyebrow: 'قبل الشراء',
    title: 'أسئلة تستحق السؤال',
    items: [
      {
        q: 'يُسمّى صندوق البشرة الحساسة، فلماذا فيه شيء معطَّر؟',
        a: 'سؤال مهم. تحتوي ثلاثة من المنتجات الستة على عطر مضاف: المنظف والسيروم وكريم الحاجز، بينما لا يحتوي التونر والقناعان على عطر مضاف. إذا كانت العطور تهيّج بشرتك، فاختاري التونر والقناعين منفصلة؛ إذ تعتمد جميع مجموعات GENOSYS الست على المنظف المعطّر نفسه.',
      },
      {
        q: 'ماذا حلّ بقناع EGF Repair Oxymask الذي كان في هذا الصندوق؟',
        a: 'أُوقف إنتاجه، فاستبدلناه بالقناع الكريمي الليلي Skin Rescue. وهو قريب أكثر مما يبدو التبديل: القالب نفسه كقناع كريمي، وكبسولات الأكسجين نفسها التي تنفجر عند الملامسة، وضعف الحجم عند 100 غ، وبخلاف الأوكسي ماسك تقف خلفه تجربة أربعة أسابيع تقيس الاحمرار وفقدان الماء. فالصندوق أفضل بهذا التغيير لا أسوأ.',
      },
      {
        q: 'أيمكنني شراء المنتجات منفصلة؟',
        a: 'نعم، وكلٌّ منها مرتبط أعلاه. فالصندوق ليس تركيبة مختلفة ولا حجماً حصرياً، بل الوحدات الستة نفسها بمجموع أقل. وإن كنتِ تملكين بعضها فشراء الناقص سيكلّفك أقل من الصندوق.',
      },
      {
        q: 'أستخدم القناع الليلي بدل الكريم أم فوقه؟',
        a: 'بدلاً منه، في الليالي التي تستخدمينه فيها. فالقناع هو الخطوة الأخيرة ويبقى حتى الصباح، وفي تلك الليالي يكون الترتيب: تنظيف، تونر، سيروم، قناع. واستخدمي كريم الحاجز في الليالي الأخرى. ومرة أو مرتين أسبوعياً هو ما تحدّده الشركة.',
      },
      {
        q: 'أيمكن استخدامه أثناء الحمل أو الإرضاع؟',
        a: 'لا نستطيع الإجابة عن هذا الصندوق. فلا واحد من الستة يحمل إخلاءً للحمل في وثائقه، والعلبة الإنجليزية للقناع الليلي لا تحمل تحذير حمل في أي من الاتجاهين — والغياب ليس إخلاءً. خذي قوائم المكوّنات إلى طبيبك، الذي يمكنه أيضاً أن يخبرك إن كان النياسيناميد بنسبة 2% أمراً يرتاح إليه.',
      },
      {
        q: 'بشرتي محمرّة الآن. أأبدأ بكل شيء معاً؟',
        a: 'لا. على بشرة غاضبة، ابدئي بالتونر وكريم الحاجز وحدهما، مرتين يومياً، نحو أسبوع. ثم أضيفي السيروم، ثم القناع الليلي بعد أن تستقرّ الأمور. فإدخال ستة منتجات إلى بشرة متفاعلة في المساء نفسه يجعل من المستحيل معرفة أيّها ساعد وأيّها لا.',
      },
      {
        q: 'كم سيدوم؟',
        a: 'يتوقّف على مدى سخائك في الكمّية. والثابت: المنظف والتونر والسيروم والكريمان وحدات تجزئة كاملة، وهناك قناع ورقي واحد بالضبط، أي جلسة واحدة. أما القناع الليلي بمعدّل مرة أو مرتين أسبوعياً فسيدوم أطول بكثير من المنتجات اليومية.',
      },
    ],
  },
}

const RU: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Продукты',
  headline: 'Собран для кожи, которая реагирует, и измерен по покраснению.',
  subheadline:
    'Шесть полноразмерных продуктов GENOSYS для чувствительной, реактивной кожи: очищение без трения, тоник без добавленной отдушки, сыворотка с комплексом из семи растений, насыщенный барьерный крем с церамидом 5 000 ppm, ночная крем-маска, снизившая покраснение на 26% за четыре недели, и тканевая маска с морскими водорослями. Вместе они стоят меньше, чем те же шесть по отдельности.',
  heroBullets: [
    'Покраснение ниже на 26%, потеря влаги ниже на 15% после четырёх недель с ночной маской',
    'Керамид NP 5 000 ppm в барьерном креме — дозу печатает на коробке его корейская панель',
    'Каждый продукт — полный розничный размер со своей страницы, а не пробник',
    'Прочтите примечание об ароматизаторе ниже: три из шести ароматизированы',
  ],
  kitSize: '6 продуктов',
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
  badges: ['Оригинальный GENOSYS', 'Сделано в Корее', 'Полные размеры', 'Дубай за 1-2 часа'],
  stats: [
    { value: '26%', label: 'меньше покраснения после четырёх недель с ночной маской' },
    { value: '5 000 ppm', label: 'керамида NP в барьерном креме' },
    { value: '6', label: 'полноразмерных продуктов, в порядке применения' },
    { value: 'Корея', label: 'сделано DTS MG в Сеуле, лабораторией, вокруг которой построена GENOSYS' },
  ],
  contents: {
    eyebrow: 'Что внутри',
    title: 'Шесть продуктов, одна последовательность',
    intro:
      'У каждого продукта здесь своя страница, свои документы и своя цена, так что вы можете прочитать подробности по любому до покупки. Набор же даёт вам всю последовательность сразу и дешевле, чем по частям.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Шаг 1 - Очищение',
        body:
          'Наносится на сухое лицо, где кислородные пузырьки образуются сами и поднимают макияж и день с кожи. Массируйте круговыми движениями по мере их появления, затем смойте тёплой водой. На реактивной коже смысл в том, что ничего не нужно оттирать.',
        facts: ['Пузырьковый агент 3,000%', 'pH 5,86', 'Ароматизирован · лимонен и SLS'],
      },
      {
        titleKey: 'routineSnowBoosterTitle',
        productNumber: '16',
        quantity: 1,
        step: 'Шаг 2 - Тонизирование',
        body:
          'Лёгкий ежедневный тоник для всех типов кожи возвращает влагу и комфорт после очищения. Бетаин 3% и водная увлажняющая база подготавливают кожу к сыворотке без тяжёлой плёнки.',
        facts: ['Бетаин 3%', 'Увлажняющая база около 18%', 'pH 6,14', 'Без добавленной отдушки'],
      },
      {
        titleKey: 'routineAllForSensitiveSerumTitle',
        productNumber: '19',
        quantity: 1,
        step: 'Шаг 3 - Успокоение',
        body:
          'Лёгкая сыворотка для чувствительной и реактивной кожи. MultiEx BSASM® Plus 1% объединяет семь растительных экстрактов, а бетаин 0,5% и аллантоин 0,1% поддерживают комфортное увлажнение без тяжёлой плёнки.',
        facts: ['MultiEx BSASM® Plus 1%', 'Бетаин 0,5% · аллантоин 0,1%', 'pH 5,77', 'Содержит масло апельсиновой цедры и лимонен'],
      },
      {
        titleKey: 'routineSkinBarrierCreamTitle',
        productNumber: '27',
        quantity: 1,
        step: 'Шаг 4 - Запечатывание',
        body:
          'Самый богатый крем GENOSYS и тот, чьё число стоит проверить: керамид NP при 5 000 ppm, который корейская панель коробки печатает в скобках рядом с ингредиентом, потому что керамидные кремы обычно содержат его существенно меньше. За ним — глицерин почти на пятую часть тюбика.',
        facts: ['Керамид NP 5 000 ppm', 'Глицерин 17,490%', 'Масло ши 3,000%', 'pH 6,07', 'Ароматизирован'],
      },
      {
        titleKey: 'routineOvernightMaskTitle',
        productNumber: '34',
        quantity: 1,
        step: 'Раз или два в неделю, на ночь',
        body:
          'Уходовый шаг и единственный продукт набора, за которым стоит клиническое исследование. Кислородные капсулы лопаются при нанесении и растворяются в розовом керамидном креме. Это последнее, что остаётся на лице на ночь, и это не смывается. Ниацинамид 2% и аденозин 0,04% — работающие активы.',
        facts: ['Ниацинамид 2%', 'Аденозин 0,04%', 'Эритема −26% за 4 недели', 'pH 5,71', 'Не смывать · избегать глаз'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 1,
        step: 'Когда коже нужна перезагрузка',
        body:
          'Одна салфетка Eucalace®, пропитанная комплексом морских водорослей с центеллой. Пятнадцать-двадцать минут после тоника в вечер, когда кожа горит или стянута, затем сыворотка и крем как обычно. Салфетка одна, так что относитесь к ней как к спасению, а не к ритуалу.',
        facts: ['1 салфетка', '15-20 минут', 'pH 5,69', 'Без искусственных пигментов'],
      },
    ],
    eanLabel: 'Штрихкод',
    each: 'за штуку',
    viewItem: 'Читать полную страницу',
    boughtSeparately: 'По отдельности',
    inThisBox: 'В этом наборе',
    youSave: 'Вы экономите',
    againstSeparate: 'против покупки шести по отдельности',
    seeBreakdown: 'Посмотреть расчёт',
    savingNote: 'Цены обновляются live, поэтому это сравнение — всегда то, что вы заплатили бы сегодня.',
  },
  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Четыре шага ежедневно, две маски по необходимости',
    intro:
      'Очищение, тоник, сыворотка, крем — утром и вечером. Ночная маска заменяет ночной крем раз или два в неделю; тканевая маска — для вечера, когда кожа уже не выдерживает. У каждого продукта своя полная инструкция на своей странице.',
    steps: [
      {
        title: 'Очищение на сухой коже',
        body:
          'Нанесите очищающее средство на сухое лицо, избегая глаз. Дождитесь кислородных пузырьков, помассируйте круговыми движениями, смойте тёплой водой. Утром и вечером, без мочалок и щёток.',
      },
      {
        title: 'Тоник на влажную кожу',
        body:
          'Сразу после очищения, пока кожа не высохла, вбивая ладонями, а не протирая. Это шаг без ароматизатора, так что если у кожи плохая неделя, можно остановиться здесь и обойтись тоником и кремом.',
      },
      {
        title: 'Сыворотка, две-три капли',
        body: 'Распределите по лицу и шее вбивающими движениями и дайте впитаться, не втирая. Утром и вечером, всегда перед кремом.',
      },
      {
        title: 'Крем в завершение',
        body:
          'Нанесите на лицо и мягко вбейте — так просит коробка и так реактивная кожа предпочитает вместо растирания. Утром завершите солнцезащитой.',
      },
      {
        title: 'Ночная маска, раз или два в неделю',
        body:
          'В такие ночи она идёт последней вместо крема и остаётся до утра: не смывайте. Держите подальше от глаз. Её также можно использовать как базу под макияж: десять минут, снять салфеткой, нанести заново.',
      },
      {
        title: 'Тканевая маска в тяжёлый вечер',
        body:
          'После тоника наложите салфетку на 15-20 минут, снимите, вбейте остатки, затем сыворотка и крем как обычно. В наборе одна салфетка.',
      },
    ],
    note:
      'Солнцезащита — единственное, что этот уход предполагает и не содержит. Если кожа сейчас повреждена, мокнет или только что после процедуры, дождитесь, пока она закроется, прежде чем начинать что-либо отсюда.',
  },
  evidence: {
    eyebrow: 'Клинические результаты',
    title: 'Измерено на реальной коже',
    intro:
      'Один продукт в этом наборе прошёл клиническое измерение — и измерен он оказался по двум вещам, которые важнее всего реактивной коже. Вот что вернулось и на чём держится остальная часть набора.',
    cards: [
      {
        value: '26%',
        title: 'Меньше покраснения после четырёх недель',
        body:
          'Эритема улучшилась на 26% за четырёхнедельное исследование ночной крем-маски, проведённое независимой лабораторией. Покраснение — это тот симптом, который большинство и имеет в виду, говоря «чувствительная кожа», и единственный показатель здесь, который действительно измеряли.',
      },
      {
        value: '15%',
        title: 'Меньше влаги теряется через кожу',
        body:
          'Трансэпидермальная потеря влаги улучшилась на 15% в том же четырёхнедельном исследовании. Это показатель барьера, а не увлажнения: он измеряет, сколько влаги кожа отдаёт, а не сколько вы на неё нанесли.',
      },
      {
        value: '5 000 ppm',
        title: 'Керамид NP в барьерном креме',
        body:
          'Не исследование, а декларация — но необычно проверяемая. Корейская панель коробки печатает дозу керамида в скобках рядом с ингредиентом, чего почти никто не делает, а 5 000 ppm заметно выше того уровня, на котором керамидные кремы обычно находятся.',
      },
    ],
    footnote:
      'Показатели 26% и 15% получены в четырёхнедельном исследовании ночной крем-маски. Очищающее средство, тоник, сыворотка и крем дерматологически протестированы; для остальных продуктов набора количественные результаты эффективности не заявлены.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Для кого этот набор',
    forTitle: 'Хороший выбор, если',
    forList: [
      'Кожа легко краснеет, щиплет или вспыхивает, и вам нужна последовательность, а не ещё один отдельный продукт',
      'Барьер изношен — избыточным пилингом, ретиноидами, жёсткой водой или дубайским летом с кондиционерами',
      'Вам нужна ночь, которая работает как уход, а не как крем, раз или два в неделю',
      'Вы восстанавливаетесь после курса процедур и вам нужен комфорт, а не активы',
    ],
    notForTitle: 'Поищите другое, если',
    notForList: [
      'Реакцию у вас вызывает именно ароматизатор. Три из шести ароматизированы: в очищающем — parfum и лимонен, в сыворотке — масло апельсиновой корки, в креме — parfum, линалоол и кумарин. Свободны от него только тоник и обе маски. Ни один набор GENOSYS этого не избегает, потому что все шесть построены на одном очищающем — покупайте тоник, маски и крем по отдельности',
      'Кожа повреждена, мокнет или открыта. Здесь нет ничего для нанесения на рану, а ночная маска предписывает избегать области глаз',
      'Вы лечите акне или закупоренность, а не реактивность. Для этого собран набор Problem Skin Care',
      'Цель — пигментация или неровный тон. Набор Skin Brightening бьёт в это напрямую',
      'У вас уже есть два-три из этих шести. Докупить недостающее выйдет дешевле',
    ],
    alternativesLabel: 'Наборы, упомянутые выше',
    alternatives: [
      { productNumber: '55', label: 'Problem Skin Care Beauty Box' },
      { productNumber: '56', label: 'Skin Brightening Beauty Box' },
    ],
    note:
      'Очищающее, тоник, сыворотка и крем дерматологически протестированы. Но кожа индивидуальна: если один продукт вам не подошёл, откажитесь от него, а не от всего ухода — и сделайте пробу за ухом, если знаете, что реагируете.',
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Детали',
    rows: [
      {
        label: 'Состав набора',
        value: '6 продуктов: очищающее 180 мл, тоник 200 мл, сыворотка 30 мл, барьерный крем 100 г, ночная крем-маска 100 г, 1 тканевая маска',
      },
      { label: 'Тип кожи', value: 'Чувствительная и реактивная. Очищающее и тоник подходят всем типам' },
      { label: 'Уход', value: 'Очищение, тоник, сыворотка, крем утром и вечером. Ночная маска раз или два в неделю' },
      { label: 'Ароматизатор', value: 'Очищающее, сыворотка и крем ароматизированы. Тоник и обе маски — нет' },
      { label: 'Клинически', value: 'Ночная маска: эритема −26%, потеря влаги −15% за четыре недели' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG Co., Ltd., Сеул' },
      { label: 'Тестирование', value: 'Очищающее, тоник, сыворотка и крем дерматологически протестированы' },
      { label: 'Штрихкоды', value: 'У каждого продукта свой EAN, указан рядом с продуктом выше' },
      { label: 'Скидки', value: 'Цена набора и есть скидка, поэтому другие предложения на него не суммируются' },
    ],
  },
  faq: {
    eyebrow: 'Перед покупкой',
    title: 'Вопросы, которые стоит задать',
    items: [
      {
        q: 'Набор называется «для чувствительной кожи» — почему тогда в нём есть ароматизаторы?',
        a: 'Три из шести продуктов содержат добавленную отдушку: очищающее средство, сыворотка и барьерный крем. В тонике и обеих масках добавленной отдушки нет. Если ароматизаторы раздражают вашу кожу, лучше выбрать тоник и маски отдельно: все шесть наборов GENOSYS включают одно и то же ароматизированное очищающее средство.',
      },
      {
        q: 'Что случилось с маской EGF Repair Oxymask, которая была в этом наборе?',
        a: 'Она снята с производства, и мы заменили её ночной крем-маской Skin Rescue. Родство здесь ближе, чем кажется: тот же формат крем-маски, те же кислородные капсулы, лопающиеся при нанесении, двойной объём — 100 г, и, в отличие от оксимаски, за ней стоит четырёхнедельное исследование, измерявшее покраснение и потерю влаги. От этой замены набор стал лучше, а не хуже.',
      },
      {
        q: 'Можно просто купить продукты по отдельности?',
        a: 'Да, и каждый из них указан со ссылкой выше. Набор — это не другая формула и не эксклюзивный объём, это те же шесть единиц дешевле в сумме. Если что-то у вас уже есть, докупить недостающее выйдет дешевле набора.',
      },
      {
        q: 'Ночную маску использовать вместо крема или поверх него?',
        a: 'Вместо него, в те ночи, когда вы её используете. Маска — последний шаг и остаётся до утра, так что в такие ночи порядок такой: очищение, тоник, сыворотка, маска. Барьерный крем — в остальные ночи. Раз или два в неделю — это то, что указывает производитель.',
      },
      {
        q: 'Можно во время беременности или кормления?',
        a: 'На этот набор мы ответить не можем. Ни у одного из шести в документах нет разрешения для беременных, а на английской коробке ночной маски нет предупреждения о беременности ни в ту, ни в другую сторону — отсутствие не является разрешением. Покажите составы своему врачу, который также скажет, устраивает ли его ниацинамид в концентрации 2%.',
      },
      {
        q: 'Кожа сейчас красная. Начинать сразу со всего?',
        a: 'Нет. На раздражённой коже начните только с тоника и барьерного крема, дважды в день, около недели. Затем добавьте сыворотку, а ночную маску — когда всё успокоится. Ввести шесть продуктов реактивной коже в один вечер значит лишить себя возможности понять, что помогло, а что нет.',
      },
      {
        q: 'На сколько хватит?',
        a: 'Зависит от того, насколько щедро вы наносите. Что фиксировано: очищающее, тоник, сыворотка и оба крема — полные розничные единицы, а тканевая маска ровно одна, то есть один сеанс. Ночной маски при частоте раз-два в неделю хватит намного дольше, чем ежедневных средств.',
      },
    ],
  },
}

export const SENSITIVE_SKIN_COPY: BeautyBoxLocaleCopy = { en: EN, ar: AR, ru: RU }
