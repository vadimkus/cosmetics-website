/**
 * Copy for the EyeCell EYE ZONE CARE KIT page (product 50), in English,
 * Arabic and Russian.
 *
 * This is a registered DTS MG four-piece kit with its own carton and its own
 * EAN. It is not a UAE-assembled beauty box. Do not reuse beauty-box language
 * ("no barcode", "assembled here", "five full-size items").
 *
 * ─── Sourcing ──────────────────────────────────────────────────────────────
 *
 * Kit artwork (system source of truth)
 *   /Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/
 *     Registration DOC/Artwork/[GENOSYS]EYECELL KIT.pdf  (Feb 2025)
 *   English function: Anti-wrinkle, Eye bag relief, Dark circle relief, Soothing
 *   Front sentence: designed for professional eye-zone treatment covering
 *   dehydration, dark circle, eye bag, crow's feet. Combines cosmetics with a
 *   roller specially designed for the eye area to help absorption and activate
 *   collagen production.
 *   Contents: Eye Contour Serum 10ml, Eye Contour Cream 20g,
 *   Eye Peptide Gel Patch 101g, GENOSYS Eye Roller 0.25mm x 1ea
 *   How-to: cleanse; serum then roll; patches 20 minutes; cream.
 *   Precautions: external use; keep off eyes; avoid pregnancy / lactation;
 *   cool / dry; children; stop if redness / swelling / irritation.
 *   French panel: do not use the roller if keloid, stainless-steel allergy,
 *   or dermatitis.
 *
 * Older label (do not prefer)
 *   Intertek/Label/[GENOSYS]EYECELL EYE ZONE CARE KIT.pdf
 *   Patch 98g, older INCI. Use 101g from the 2025 artwork and product 33.
 *
 * Component pages already shipped - do not contradict them
 *   17 Eye Contour Serum  - Arbutin 2% + Adenosine 0.04%. Peptides at trace.
 *                          Haloxyl is a 0.10% premix. 370 AED. 10ml.
 *   24 Eye Contour Cream  - Arbutin 2% + Adenosine 0.04%. Peptides at trace.
 *                          Haloxyl is a 0.05% premix. Contains peanut oil and
 *                          retinyl palmitate. Orange peel oil + limonene.
 *                          370 AED. 20g. Pregnancy line on the English pack.
 *   33 Eye Peptide Gel Patch - Niacinamide 2% + Adenosine 0.04%.
 *                          Peptide is 46.5 ppb. Sit 20-40 min then remove.
 *                          101g / 60ea. Parfum in it. English pack prints no
 *                          pregnancy line. 380 AED.
 *
 * The roller is not product 1
 *   Product 1 is the 450-needle Standard Detachable face roller.
 *   The kit holds GENOSYS EYE ROLLER, one-body, 0.25mm, 60 needles,
 *   article EBT025 / export GRME025. Not sold as its own retail PDP.
 *   Do not link the roller to /products/1. Do not put 230 AED into the
 *   separate total.
 *
 * Value math (live prices, not hardcoded here)
 *   17 + 24 + 33 = the separate cosmetic total. Kit 980 AED.
 *   The roller is only in the kit, so it is not in that sum.
 *
 * ─── Claims that must not come back ────────────────────────────────────────
 *
 *   10 Years Back / Turn Years Back     Printed on the packs. Not our headline.
 *   Peptide / Haloxyl / callus / stem-cell as the engine
 *   Patented thermo-sensitive / transdermal patches
 *   Botox / muscle-relaxant
 *   Collagen activation as a medical or wound-healing claim
 *   Efficacy test on the kit as a whole     No kit-level trial on file
 *   All skin types
 *   Fragrance-free
 *   Pregnancy-safe
 *   The kit roller = product 1
 *   Contract manufacturers (COTDE, GENIC). DTS MG only.
 *   Lot / batch codes
 */

export type EyeKitLocale = 'en' | 'ar' | 'ru'

export interface EyeKitItemCopy {
  id: string
  title: string
  /** Live catalogue number. Omit for the kit-only eye roller. */
  productNumber?: string
  quantity: number
  step: string
  body: string
  facts?: string[]
  /** Static packshot when there is no live record (the eye roller). */
  image?: string
}

export interface EyeKitCopy {
  eyebrow: string
  backToProducts: string
  headline: string
  subheadline: string
  heroBullets: string[]
  kitSize: string
  fullSizeNote: string
  vatIncluded: string
  freeDelivery: string
  addToBag: string
  adding: string
  added: string
  outOfStock: string
  loginToShop: string
  inBag: string
  viewBag: string
  badges: string[]
  stats: { value: string; label: string }[]
  contents: {
    eyebrow: string
    title: string
    intro: string
    items: EyeKitItemCopy[]
    eanLabel: string
    each: string
    viewItem: string
    kitOnly: string
    boughtSeparately: string
    inThisBox: string
    youSave: string
    againstSeparate: string
    seeBreakdown: string
    savingNote: string
  }
  howTo: {
    eyebrow: string
    title: string
    intro: string
    steps: { title: string; body: string }[]
    note: string
    videoTitle: string
  }
  evidence: {
    eyebrow: string
    title: string
    intro: string
    cards: { value: string; title: string; body: string }[]
    footnote: string
  }
  suited: {
    eyebrow: string
    title: string
    forTitle: string
    forList: string[]
    notForTitle: string
    notForList: string[]
    alternativesLabel: string
    alternatives: { productNumber: string; label: string }[]
    note: string
  }
  details: {
    eyebrow: string
    title: string
    rows: { label: string; value: string }[]
    barcodeLabel: string
  }
  faq: {
    eyebrow: string
    title: string
    items: { q: string; a: string }[]
  }
}

const ROLLER_IMAGE = '/images/eye_kit/roller.jpeg'

const EN: EyeKitCopy = {
  eyebrow: 'EyeCell · Four-piece kit',
  backToProducts: 'All products',
  headline: 'The eye-zone sequence, in one carton.',
  subheadline:
    'Serum, the 0.25mm eye roller, patches, then cream. A registered Korean kit with its own barcode, not a box assembled here.',
  heroBullets: [
    'Serum, a gentle roll, patches for 20-40 minutes, then cream',
    'Arbutin 2% and adenosine 0.04% on the serum and the cream',
    'Niacinamide 2% and adenosine 0.04% on the patches',
    'The 0.25mm eye roller ships only in this kit',
  ],
  kitSize: '1 box',
  fullSizeNote: 'Registered Korean kit',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over 1,000 AED · Ships from Dubai',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added',
  outOfStock: 'Out of stock',
  loginToShop: 'Log in to shop',
  inBag: 'In your bag',
  viewBag: 'View bag',
  badges: [
    'Dermatologically tested',
    'Made in Korea',
    'Own barcode',
    'Four-piece sequence',
  ],
  stats: [
    { value: '4', label: 'Pieces in the carton' },
    { value: '2%', label: 'Arbutin on serum and cream' },
    { value: '2%', label: 'Niacinamide on the patches' },
    { value: '0.25mm', label: 'Eye roller, 60 needles' },
  ],
  contents: {
    eyebrow: 'Inside the carton',
    title: 'Three cosmetics you already know, plus the roller that only lives here.',
    intro:
      'Each cosmetic has its own page, its own price and its own paperwork. The eye roller does not. It is a one-body 0.25mm tool made for the orbital bone, and it ships only in this kit.',
    items: [
      {
        id: 'serum',
        title: 'EyeCell EYE CONTOUR SERUM',
        productNumber: '17',
        quantity: 1,
        step: 'Step 1 · First layer',
        body: 'The intensive leave-on serum. Deep wrinkles, dark circles and eye puffs. Arbutin 2% is the figure that belongs on a card. Adenosine 0.04% is the wrinkle-care pair. Then you roll.',
        facts: ['10ml', 'Arbutin 2%', 'Adenosine 0.04%', 'Leave on'],
      },
      {
        id: 'roller',
        title: 'GENOSYS EYE ROLLER',
        quantity: 1,
        step: 'Step 1 · With the serum',
        body: 'One-body, 0.25mm, 60 needles. Made for the curve around the eye, not for the face. Extra care, light pressure, keep it off the eye and the lip. This is not the 450-needle detachable roller on its own page.',
        facts: ['0.25mm', '60 needles', 'One-body', 'Kit only'],
        image: ROLLER_IMAGE,
      },
      {
        id: 'patch',
        title: 'EyeCell EYE PEPTIDE GEL PATCH',
        productNumber: '33',
        quantity: 1,
        step: 'Step 2 · Take-off mask',
        body: 'Hydrogel crescents under the eyes, or on the brow bones when you want the intensive sit. Niacinamide 2% and adenosine 0.04% are the functional pair. Twenty to forty minutes, then take them off. The peptide sits at trace.',
        facts: ['101g / 60 ea', 'Niacinamide 2%', 'Adenosine 0.04%', '20-40 min, then remove'],
      },
      {
        id: 'cream',
        title: 'EyeCell EYE CONTOUR CREAM',
        productNumber: '24',
        quantity: 1,
        step: 'Step 3 · Seal',
        body: 'The daily leave-on cream after the patches come off. Same Korean functional pair as the serum: arbutin 2% and adenosine 0.04%. Contains peanut oil and a retinyl palmitate ester. Orange peel oil and limonene are in it, so it is not fragrance-free.',
        facts: ['20g', 'Arbutin 2%', 'Adenosine 0.04%', 'Contains peanut oil'],
      },
    ],
    eanLabel: 'Barcode',
    each: 'each',
    viewItem: 'Open this product',
    kitOnly: 'Only in this kit',
    boughtSeparately: 'Serum, cream and patches on their own pages',
    inThisBox: 'This kit',
    youSave: 'You save',
    againstSeparate: 'against those three bought separately',
    seeBreakdown: 'See the arithmetic',
    savingNote:
      'The separate total is the three cosmetics at the prices on their own pages. The 0.25mm eye roller is only in the kit, so it is not in that sum. If a clinic discount ever makes the three cheaper than the kit, this row hides.',
  },
  howTo: {
    eyebrow: 'How to use it',
    title: 'Four steps. The carton writes the order.',
    intro:
      'Cleanse, serum and roll, patches, cream. The English kit panel prints 20 minutes on the patches. Wear them 20-40 minutes, which is what the patch itself says.',
    steps: [
      {
        title: 'Cleanse the eye contour',
        body: 'Make-up off, skin dry enough to take a serum. Keep cleanser out of the eye.',
      },
      {
        title: 'Serum, then a gentle roll',
        body: 'A thin layer of Eye Contour Serum. Roll the 0.25mm eye roller over that layer and let it absorb. Extra care. Not too much pressure. Keep the roller off the eye, the mucous membrane and the lip.',
      },
      {
        title: 'Patches, 20-40 minutes',
        body: 'Two crescents under the eyes. Two more on the brow bones when you want the intensive sit. Then remove. Pat the leftover in. Do not leave them on overnight.',
      },
      {
        title: 'Cream to seal',
        body: 'Eye Contour Cream last. A small amount, a gentle pat, then leave on. Morning or evening after the sequence.',
      },
    ],
    note: 'Skip the roller if you have a keloid history, a stainless-steel allergy or dermatitis. The cream contains peanut oil. The kit carton says avoid use during pregnancy and lactation.',
    videoTitle: 'The sequence on film',
  },
  evidence: {
    eyebrow: 'What is actually on the cards',
    title: 'Two functional pairs, and a 0.25mm roller.',
    intro:
      'The kit has no trial of its own. What can be said is what is already measured on the three cosmetics and printed on the roller.',
    cards: [
      {
        value: '2% + 0.04%',
        title: 'Serum and cream',
        body: 'Arbutin 2% and adenosine 0.04%. The Korean functional pair on both leave-ons. Peptides sit at cosmetic trace. Haloxyl is a premix name, not the engine.',
      },
      {
        value: '2% + 0.04%',
        title: 'The patches',
        body: 'Niacinamide 2% and adenosine 0.04%. Sit 20-40 minutes, then take them off. The named peptide is 46.5 ppb.',
      },
      {
        value: '0.25mm',
        title: 'The eye roller',
        body: 'Sixty needles, one-body, made for the eye contour. The carton says it helps absorption. That is the carton sentence, not a medical microneedling claim.',
      },
    ],
    footnote:
      'No kit-level efficacy study is on file. Do not read "10 Years Back" on the packs as a measured result. This is not a peptide kit and not a Botox story.',
  },
  suited: {
    eyebrow: 'Who it is for',
    title: 'The full EyeCell sequence, or the pieces.',
    forTitle: 'This kit is for you if',
    forList: [
      'You want serum, roller, patches and cream in one carton',
      'The job is dehydration, dark circles, eye bags or crow\'s feet',
      'You will use the 0.25mm roller gently, then take the patches off',
    ],
    notForTitle: 'Buy something else if',
    notForList: [
      'You are pregnant or breastfeeding. The kit carton says avoid',
      'You have a peanut allergy. The cream contains peanut oil',
      'You have a keloid history, a metal allergy or dermatitis. Skip the roller, or buy the three cosmetics on their own',
      'You only want one piece. Open that product instead',
      'You want the 450-needle face roller. That is a different tool',
    ],
    alternativesLabel: 'The pieces, and the face roller',
    alternatives: [
      { productNumber: '17', label: 'Eye Contour Serum' },
      { productNumber: '24', label: 'Eye Contour Cream' },
      { productNumber: '33', label: 'Eye Peptide Gel Patch' },
      { productNumber: '1', label: 'Face roller, 450 needles' },
    ],
    note: 'The cream is not fragrance-free: orange peel oil and limonene. The patches carry Parfum. Keep every piece out of the eye.',
  },
  details: {
    eyebrow: 'On the carton',
    title: 'The facts that belong on a card.',
    rows: [
      { label: 'Form', value: 'Registered four-piece eye-zone kit' },
      { label: 'Size', value: '1 box' },
      { label: 'Contents', value: 'Serum 10ml, cream 20g, patches 101g / 60 ea, eye roller 0.25mm' },
      { label: 'Function', value: 'Anti-wrinkle, eye bag relief, dark circle relief, soothing' },
      { label: 'Made by', value: 'DTS MG, South Korea' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Caution', value: 'Avoid during pregnancy and lactation. Cream contains peanut oil' },
    ],
    barcodeLabel: 'Barcode',
  },
  faq: {
    eyebrow: 'Before you buy',
    title: 'The questions this kit actually gets.',
    items: [
      {
        q: 'Is this a beauty box?',
        a: 'No. Beauty boxes are assembled here and have no EAN of their own. This carton is a registered Korean kit with barcode 8809046298035.',
      },
      {
        q: 'Is the roller the same as the microneedle roller on its own page?',
        a: 'No. That page is the 450-needle detachable face roller. This kit holds a one-body 0.25mm eye roller with 60 needles. It is not sold on its own.',
      },
      {
        q: 'How long do the patches stay on?',
        a: '20-40 minutes, then remove. The English kit panel prints 20 minutes. The patch itself, and the Korean and Russian kit panels, print 20-40. Wear the longer window.',
      },
      {
        q: 'Can I use it while pregnant?',
        a: 'The kit carton says avoid use during pregnancy and lactation. The cream also prints that line and carries a retinyl palmitate ester. Ask your doctor before any eye-zone kit in that window.',
      },
      {
        q: 'Does it contain peanut oil?',
        a: 'The cream does. Arachis Hypogaea (Peanut) Oil is in the registered cream formula. If peanut is an allergen for you, skip the kit or buy the serum and the patches on their own.',
      },
      {
        q: 'Is it fragrance-free?',
        a: 'No. The cream has orange peel oil and limonene. The patches have Parfum.',
      },
      {
        q: 'Can I buy the pieces separately?',
        a: 'Serum, cream and patches each have their own page. The 0.25mm eye roller does not. It only ships in this kit.',
      },
      {
        q: 'Is this a peptide kit? Does it replace Botox?',
        a: 'No. Peptides sit at cosmetic trace on all three cosmetics. The figures that belong on a card are the functional pairs: arbutin and adenosine on the serum and cream, niacinamide and adenosine on the patches. This is not a muscle-relaxant story.',
      },
    ],
  },
}

const AR: EyeKitCopy = {
  eyebrow: 'EyeCell · طقم من أربع قطع',
  backToProducts: 'كل المنتجات',
  headline: 'طقوس متكاملة تمنح محيط العين عناية أدق.',
  subheadline:
    'سيروم ورولر حصري بعمق 0.25 مم، ثم لصقات هيدروجيل وكريم يومي. أربع خطوات متناسقة لمظهر أكثر نضارة ونعومة وتجانساً حول العين.',
  heroBullets: [
    'السيروم مع الرولر، لصقات من 20 إلى 40 دقيقة، ثم الكريم',
    'أربوتين 2% وأدينوزين 0.04% في السيروم وفي الكريم',
    'نياسيناميد 2% وأدينوزين 0.04% في اللصقات',
    'رولر العين 0.25 مم يأتي في هذا الطقم فقط',
  ],
  kitSize: 'علبة واحدة',
  fullSizeNote: 'طقوس EyeCell الكاملة',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني فوق 1,000 درهم · الشحن من دبي',
  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف',
  outOfStock: 'غير متوفر',
  loginToShop: 'سجّلي الدخول للشراء',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  badges: ['مختبر جلدياً', 'صُنع في كوريا', 'رولر حصري للطقم', 'تسلسل من أربع خطوات'],
  stats: [
    { value: '4', label: 'قطع في العلبة' },
    { value: '2%', label: 'أربوتين في السيروم والكريم' },
    { value: '2%', label: 'نياسيناميد في اللصقات' },
    { value: '0.25مم', label: 'رولر العين، 60 إبرة' },
  ],
  contents: {
    eyebrow: 'داخل العلبة',
    title: 'كل ما تحتاجه طقوس EyeCell، من السيروم إلى الكريم.',
    intro:
      'ثلاثة مستحضرات عناية كاملة الحجم مع رولر GENOSYS EYE ROLLER المصمم لمحيط العين. الرولر بعمق 0.25 مم و60 إبرة، ولا يتوفر منفرداً.',
    items: [
      {
        id: 'serum',
        title: 'EyeCell EYE CONTOUR SERUM',
        productNumber: '17',
        quantity: 1,
        step: 'الخطوة 1 · السيروم أولاً',
        body: 'سيروم مكثف يُترك على البشرة للعناية بمظهر التجاعيد العميقة والهالات والميل إلى الانتفاخ. يجمع الأربوتين 2% والأدينوسين 0.04%، ثم يُستخدم الرولر بعناية خاصة وفق خطوات الطقم.',
        facts: ['10 مل', 'أربوتين 2%', 'أدينوزين 0.04%', 'من دون شطف'],
      },
      {
        id: 'roller',
        title: 'GENOSYS EYE ROLLER',
        quantity: 1,
        step: 'الخطوة 1 · مع السيروم',
        body: 'رولر من قطعة واحدة بعمق 0.25 مم و60 إبرة لمحيط العين. يُمرر فوق السيروم بحركات أفقية وعمودية مع عناية خاصة ومن دون ضغط، بعيداً عن العين والأغشية المخاطية.',
        facts: ['0.25 مم', '60 إبرة', 'قطعة واحدة', 'قابل لإعادة الاستخدام بعد التعقيم'],
        image: ROLLER_IMAGE,
      },
      {
        id: 'patch',
        title: 'EyeCell EYE PEPTIDE GEL PATCH',
        productNumber: '33',
        quantity: 1,
        step: 'الخطوة 2 · لصقات هيدروجيل',
        body: 'توضع تحت العينين أو أسفل الحاجبين لتمنح البشرة ترطيباً وراحة طوال الجلسة. يجمع القناع بين نياسيناميد 2% وأدينوزين 0.04% للعناية بمظهر اللون والتجاعيد. تترك 20–40 دقيقة ثم تزال.',
        facts: ['101 غ / 60 لصقة', 'نياسيناميد 2%', 'أدينوزين 0.04%', '20–40 دقيقة ثم تزال'],
      },
      {
        id: 'cream',
        title: 'EyeCell EYE CONTOUR CREAM',
        productNumber: '24',
        quantity: 1,
        step: 'الخطوة 3 · استكمال العناية',
        body: 'بعد إزالة اللصقات، يُستخدم الكريم اليومي لاستكمال العناية. يجمع مثل السيروم بين الأربوتين 2% والأدينوزين 0.04%، مع السكوالان 2.5% وزيت الجوجوبا 2% لنعومة البشرة وراحتها. يحتوي على زيت الفول السوداني، كما أن وجود زيت قشر البرتقال والليمونين يعني أنه ليس خالياً تماماً من المكونات العطرية.',
        facts: ['20 غ', 'أربوتين 2%', 'أدينوزين 0.04%', 'يحتوي زيت الفول السوداني'],
      },
    ],
    eanLabel: 'الباركود',
    each: 'للقطعة',
    viewItem: 'افتحي هذا المنتج',
    kitOnly: 'في هذا الطقم فقط',
    boughtSeparately: 'السيروم والكريم واللصقات في صفحاتها',
    inThisBox: 'هذا الطقم',
    youSave: 'توفّرين',
    againstSeparate: 'مقابل شراء الثلاثة منفصلة',
    seeBreakdown: 'انظري الحساب',
    savingNote:
      'تُحسب المقارنة من أسعار السيروم والكريم واللصقات عند شرائها منفصلة. أما رولر العين 0.25 مم فهو إضافة حصرية لهذا الطقم ولا يدخل سعره في المقارنة.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'أربع خطوات، بترتيب واحد واضح.',
    intro:
      'ابدئي ببشرة نظيفة، ثم ضعي السيروم واستخدمي الرولر، واتركي اللصقات 20–40 دقيقة، واختتمي بالكريم.',
    steps: [
      {
        title: 'نظّفي محيط العين',
        body: 'المكياج خارجاً، والبشرة جافة بما يكفي لتأخذ السيروم. أبقي المنظف بعيداً عن العين.',
      },
      {
        title: 'السيروم، ثم الرولر',
        body: 'وزعي كمية كافية من سيروم محيط العين تحت العينين وأسفل الحاجبين. مرري رولر 0.25 مم بحركات أفقية وعمودية لبضع دقائق مع عناية خاصة ومن دون ضغط، بعيداً عن العين والأغشية المخاطية.',
      },
      {
        title: 'اللصقات، 20-40 دقيقة',
        body: 'هلالان تحت العينين. هلالان آخران على عظمتي الحاجب إن أردتِ الجلسة المكثّفة. ثم ارفعي. ربّتي على المتبقي. لا تتركيها طوال الليل.',
      },
      {
        title: 'اختتمي بالكريم',
        body: 'ضعي كمية صغيرة من كريم محيط العين ووزعيها بأطراف الأصابع بلطف حتى الامتصاص.',
      },
      {
        title: 'عقّمي الرولر قبل إعادة استخدامه',
        body: 'تسمح العبوة بإعادة استخدام الرولر بعد غمره 5 دقائق في محلول الكلورهيكسيدين. احتفظي به للاستخدام الشخصي فقط.',
      },
    ],
    note: 'لا تستخدمي الرولر مع قابلية للندبات الجدروية أو حساسية من الفولاذ المقاوم للصدأ أو التهاب جلدي أو على بشرة متضررة. يحتوي الكريم على زيت الفول السوداني، ويُتجنب الطقم كاملاً أثناء الحمل والرضاعة.',
    videoTitle: 'التسلسل على الفيلم',
  },
  evidence: {
    eyebrow: 'التركيبات الأساسية',
    title: 'مكوّنات وظيفية واضحة في كل مرحلة.',
    intro:
      'يركز كل منتج على المواد الوظيفية المثبتة في تركيبته، بينما يكمل الرولر تسلسل العناية من دون وعود طبية.',
    cards: [
      {
        value: '2% + 0.04%',
        title: 'السيروم والكريم',
        body: 'يجمع السيروم والكريم الأربوتين 2% للعناية بمظهر الهالات والأدينوزين 0.04% للعناية بمظهر التجاعيد. وتأتي الببتيدات وHaloxyl كدعم إضافي للتركيبة.',
      },
      {
        value: '2% + 0.04%',
        title: 'اللصقات',
        body: 'نياسيناميد 2% لمظهر أكثر تجانساً ونضارة، وأدينوزين 0.04% للعناية بمظهر التجاعيد. تترك اللصقات 20–40 دقيقة ثم تزال.',
      },
      {
        value: '0.25مم',
        title: 'رولر العين',
        body: 'ستون إبرة في تصميم من قطعة واحدة لمحيط العين. يُستخدم فوق السيروم بعناية ومن دون أي ادعاء بالتوصيل الطبي أو الاختراق.',
      },
    ],
    footnote:
      'يستند وصف كل خطوة إلى مكوّنات المستحضرات ووظيفتها التجميلية الموثقة، من دون نقل نتائج من دراسات لا تخص هذا الطقم كاملاً.',
  },
  suited: {
    eyebrow: 'لمن هو',
    title: 'تسلسل EyeCell كاملاً، أو القطع.',
    forTitle: 'هذا الطقم لكِ إن',
    forList: [
      'أردتِ السيروم والرولر واللصقات والكريم في علبة واحدة',
      'أردتِ عناية متكاملة بمظهر التجاعيد والهالات والانتفاخ والراحة',
      'يمكنكِ اتباع تسلسل السيروم والرولر واللصقات والكريم بدقة',
    ],
    notForTitle: 'اشتري شيئاً آخر إن',
    notForList: [
      'كنتِ حاملاً أو مرضعة؛ تحذير الطقم يشمل هذه الفترة كاملة',
      'لديكِ حساسية الفول السوداني. الكريم يحتوي زيته',
      'لديكِ قابلية لندبات جدروية أو حساسية من الفولاذ المقاوم للصدأ أو التهاب جلد. تجنّبي الرولر أو اختاري المستحضرات منفصلة',
      'أردتِ قطعة واحدة فقط. افتحي ذلك المنتج',
      'أردتِ رولر الوجه 450 إبرة. تلك أداة أخرى',
    ],
    alternativesLabel: 'القطع، ورولر الوجه',
    alternatives: [
      { productNumber: '17', label: 'سيروم EyeCell المكثف لمحيط العين' },
      { productNumber: '24', label: 'كريم EyeCell لمحيط العين' },
      { productNumber: '33', label: 'لصقات هيدروجيل EyeCell للعين' },
      { productNumber: '1', label: 'رولر الوجه، 450 إبرة' },
    ],
    note: 'يحتوي الكريم على زيت قشر البرتقال والليمونين، وتحتوي اللصقات على العطر. أبقي جميع المكونات بعيداً عن العينين والأغشية المخاطية.',
  },
  details: {
    eyebrow: 'تفاصيل الطقم',
    title: 'أربع خطوات، بأحجامها الدقيقة.',
    rows: [
      { label: 'الشكل', value: 'طقم عناية متكامل من أربع قطع لمحيط العين' },
      { label: 'الحجم', value: 'علبة واحدة' },
      { label: 'المحتويات', value: 'سيروم 10 مل، كريم 20 غ، لصقات 101 غ / 60 قطعة، رولر عين 0.25 مم' },
      { label: 'الوظيفة', value: 'مضاد تجاعيد، تخفيف أكياس العين، تخفيف الهالات، تهدئة' },
      { label: 'الصانع', value: 'DTS MG، كوريا الجنوبية' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'تنبيه', value: 'تجنّبي أثناء الحمل والرضاعة. الكريم يحتوي زيت الفول السوداني' },
    ],
    barcodeLabel: 'الباركود',
  },
  faq: {
    eyebrow: 'قبل الشراء',
    title: 'الأسئلة التي يأتي بها هذا الطقم فعلاً.',
    items: [
      {
        q: 'ما الذي يميز هذا الطقم عن شراء المستحضرات منفصلة؟',
        a: 'يمنحكِ تسلسل EyeCell كاملاً ويضيف رولر العين 0.25 مم ذي 60 إبرة، وهو لا يُباع منفرداً.',
      },
      {
        q: 'هل الرولر هو نفسه رولر الإبر في صفحته؟',
        a: 'لا. تلك الصفحة لرولر الوجه القابل للفصل بـ 450 إبرة. هذا الطقم يحمل رولر عين قطعة واحدة 0.25 مم بـ 60 إبرة. لا يُباع وحده.',
      },
      {
        q: 'كم تبقى اللصقات؟',
        a: 'تُترك من 20 إلى 40 دقيقة ثم تُزال. يمكن وضعها تحت العينين و/أو أسفل الحاجبين.',
      },
      {
        q: 'هل يُستخدم أثناء الحمل؟',
        a: 'لا يُستخدم الطقم أثناء الحمل أو الرضاعة. ويحمل الكريم التحذير نفسه كما يحتوي على ريتينيل بالميتات.',
      },
      {
        q: 'هل يحتوي زيت الفول السوداني؟',
        a: 'نعم. تحتوي تركيبة الكريم على Arachis Hypogaea (Peanut) Oil. إن كان الفول السوداني محسّساً لكِ، فلا تستخدمي الطقم، ويمكنكِ اختيار السيروم واللصقات منفصلين.',
      },
      {
        q: 'هل هو خالٍ من العطر؟',
        a: 'لا. الكريم فيه زيت قشر البرتقال والليمونين. اللصقات فيها Parfum.',
      },
      {
        q: 'هل أشتري القطع منفصلة؟',
        a: 'للسيروم والكريم واللصقات صفحة لكل منها. رولر العين 0.25 مم لا. يُشحن في هذا الطقم فقط.',
      },
      {
        q: 'هل يمكن إعادة استخدام الرولر؟',
        a: 'نعم. تنص اللوحة الروسية على تعقيمه 5 دقائق في محلول الكلورهيكسيدين قبل إعادة الاستخدام. الرولر للاستخدام الشخصي ولا يشارك.',
      },
    ],
  },
}

const RU: EyeKitCopy = {
  eyebrow: 'EyeCell · Набор из четырёх частей',
  backToProducts: 'Все продукты',
  headline: 'Продуманный ритуал для выразительного взгляда.',
  subheadline:
    'Сыворотка, эксклюзивный роллер 0,25 мм, гидрогелевые патчи и ежедневный крем. Четыре согласованных этапа для более свежего, гладкого и ровного вида кожи вокруг глаз.',
  heroBullets: [
    'Сыворотка с роллером, патчи на 20–40 минут, затем крем',
    'Арбутин 2% и аденозин 0,04% в сыворотке и в креме',
    'Ниацинамид 2% и аденозин 0,04% в патчах',
    'Роллер для глаз 0,25 мм есть только в этом наборе',
  ],
  kitSize: '1 коробка',
  fullSizeNote: 'Полный ритуал EyeCell',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  outOfStock: 'Нет в наличии',
  loginToShop: 'Войдите, чтобы купить',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  badges: [
    'Дерматологически протестировано',
    'Сделано в Корее',
    'Роллер только в наборе',
    'Последовательность из четырёх этапов',
  ],
  stats: [
    { value: '4', label: 'Части в коробке' },
    { value: '2%', label: 'Арбутин в сыворотке и креме' },
    { value: '2%', label: 'Ниацинамид в патчах' },
    { value: '0,25 мм', label: 'Роллер для глаз, 60 игл' },
  ],
  contents: {
    eyebrow: 'Что в коробке',
    title: 'Весь ритуал EyeCell: от сыворотки до крема.',
    intro:
      'Три полноразмерных средства и GENOSYS EYE ROLLER, разработанный для контура глаз. Цельный роллер 0,25 мм на 60 игл отдельно не продаётся.',
    items: [
      {
        id: 'serum',
        title: 'EyeCell EYE CONTOUR SERUM',
        productNumber: '17',
        quantity: 1,
        step: 'Шаг 1 · Сначала сыворотка',
        body: 'Интенсивная несмываемая сыворотка для ухода за глубокими морщинами, тёмными кругами и склонностью к припухлости. Сочетает арбутин 2% и аденозин 0,04%; затем роллер используют с особой осторожностью по инструкции набора.',
        facts: ['10 мл', 'Арбутин 2%', 'Аденозин 0,04%', 'Не смывать'],
      },
      {
        id: 'roller',
        title: 'GENOSYS EYE ROLLER',
        quantity: 1,
        step: 'Шаг 1 · Вместе с сывороткой',
        body: 'Цельный роллер 0,25 мм на 60 игл для контура глаз. Его проводят поверх сыворотки горизонтальными и вертикальными движениями, с особой осторожностью и без надавливания, вдали от глаз и слизистых.',
        facts: ['0,25 мм', '60 игл', 'Цельный', 'Повторное использование после дезинфекции'],
        image: ROLLER_IMAGE,
      },
      {
        id: 'patch',
        title: 'EyeCell EYE PEPTIDE GEL PATCH',
        productNumber: '33',
        quantity: 1,
        step: 'Шаг 2 · Гидрогелевые патчи',
        body: 'Расположите под глазами или под бровями для длительного увлажнения и комфорта. Ниацинамид 2% и аденозин 0,04% ухаживают за видимым тоном и морщинами. Оставьте на 20–40 минут, затем снимите.',
        facts: ['101 г / 60 патчей', 'Ниацинамид 2%', 'Аденозин 0,04%', '20–40 мин, затем снять'],
      },
      {
        id: 'cream',
        title: 'EyeCell EYE CONTOUR CREAM',
        productNumber: '24',
        quantity: 1,
        step: 'Шаг 3 · Завершить уход',
        body: 'После снятия патчей нанесите ежедневный крем. Как и сыворотка, он сочетает арбутин 2% и аденозин 0,04%, а сквалан 2,5% и масло жожоба 2% поддерживают мягкость и комфорт кожи. Крем содержит арахисовое масло; масло цедры апельсина и лимонен означают, что формула не полностью свободна от ароматических компонентов.',
        facts: ['20 г', 'Арбутин 2%', 'Аденозин 0,04%', 'Содержит арахисовое масло'],
      },
    ],
    eanLabel: 'Штрихкод',
    each: 'за штуку',
    viewItem: 'Открыть этот продукт',
    kitOnly: 'Только в этом наборе',
    boughtSeparately: 'Сыворотка, крем и патчи на своих страницах',
    inThisBox: 'Этот набор',
    youSave: 'Вы экономите',
    againstSeparate: 'против этих трёх по отдельности',
    seeBreakdown: 'Смотреть расчёт',
    savingNote:
      'Сравнение рассчитано по ценам сыворотки, крема и патчей при покупке по отдельности. Эксклюзивный роллер 0,25 мм идёт дополнением к набору и в отдельную сумму не входит.',
  },
  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Четыре шага в точной последовательности.',
    intro:
      'Начните с чистой кожи, нанесите сыворотку и используйте роллер, оставьте патчи на 20–40 минут и завершите уход кремом.',
    steps: [
      {
        title: 'Очистите контур глаз',
        body: 'Макияж снят, кожа достаточно сухая, чтобы принять сыворотку. Очищающее средство не в глаз.',
      },
      {
        title: 'Сыворотка, затем роллер',
        body: 'Распределите достаточное количество сыворотки под глазами и под бровями. В течение нескольких минут проводите роллером 0,25 мм горизонтально и вертикально, с особой осторожностью и без надавливания, не заходя на глаза и слизистые.',
      },
      {
        title: 'Патчи, 20-40 минут',
        body: 'Два полумесяца под глаза. Ещё два на кости бровей, если нужна интенсивная посадка. Затем снять. Остаток вбить. Не оставлять на ночь.',
      },
      {
        title: 'Завершите кремом',
        body: 'Нанесите небольшое количество крема для контура глаз и мягко распределите кончиками пальцев до впитывания.',
      },
      {
        title: 'Продезинфицируйте роллер перед повторным использованием',
        body: 'Коробка допускает повторное применение после пяти минут в растворе хлоргексидина. Роллер должен оставаться только вашим.',
      },
    ],
    note: 'Не используйте роллер при склонности к келоидным рубцам, аллергии на нержавеющую сталь, дерматите или на повреждённой коже. Крем содержит арахисовое масло. Весь набор противопоказан во время беременности и грудного вскармливания.',
    videoTitle: 'Последовательность на видео',
  },
  evidence: {
    eyebrow: 'Главное в формулах',
    title: 'Функциональные активы на каждом этапе.',
    intro:
      'Каждое средство опирается на подтверждённые функциональные активы, а роллер дополняет ритуал без медицинских обещаний.',
    cards: [
      {
        value: '2% + 0,04%',
        title: 'Сыворотка и крем',
        body: 'Сыворотка и крем сочетают арбутин 2% для ухода за тёмными кругами и аденозин 0,04% для ухода за морщинами. Пептиды и Haloxyl дополняют формулу.',
      },
      {
        value: '2% + 0,04%',
        title: 'Патчи',
        body: 'Ниацинамид 2% для более ровного и свежего вида, аденозин 0,04% для ухода за видимыми морщинами. Оставьте на 20–40 минут, затем снимите.',
      },
      {
        value: '0,25 мм',
        title: 'Роллер для глаз',
        body: 'Цельный роллер на 60 игл для контура глаз. Используется поверх сыворотки без заявлений о медицинской доставке или проникновении.',
      },
    ],
    footnote:
      'Здесь только подтверждённые косметические функции каждого средства, без медицинских обещаний и переноса чужих результатов на весь набор.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Полная последовательность EyeCell или отдельные части.',
    forTitle: 'Этот набор ваш, если',
    forList: [
      'Нужны сыворотка, роллер, патчи и крем в одной коробке',
      'Нужен комплексный уход за видимыми морщинами, тёмными кругами, припухлостью и комфортом кожи',
      'Вы готовы точно соблюдать порядок: сыворотка, роллер, патчи и крем',
    ],
    notForTitle: 'Возьмите другое, если',
    notForList: [
      'Беременность или грудное вскармливание: предупреждение относится ко всему набору',
      'Аллергия на арахис. В креме арахисовое масло',
      'Склонность к келоидным рубцам, аллергия на нержавеющую сталь или дерматит. Исключите роллер или выберите средства отдельно',
      'Нужна только одна часть. Откройте тот продукт',
      'Нужен лицевой роллер на 450 игл. Это другой инструмент',
    ],
    alternativesLabel: 'Части и лицевой роллер',
    alternatives: [
      { productNumber: '17', label: 'Интенсивная сыворотка EyeCell для контура глаз' },
      { productNumber: '24', label: 'Крем EyeCell для контура глаз' },
      { productNumber: '33', label: 'Гидрогелевые патчи EyeCell для глаз' },
      { productNumber: '1', label: 'Лицевой роллер, 450 игл' },
    ],
    note: 'Крем содержит масло цедры апельсина и лимонен, а патчи — отдушку. Не допускайте попадания средств на глаза и слизистые.',
  },
  details: {
    eyebrow: 'Детали набора',
    title: 'Четыре этапа в точных объёмах.',
    rows: [
      { label: 'Форма', value: 'Комплексный набор из четырёх частей для контура глаз' },
      { label: 'Размер', value: '1 коробка' },
      { label: 'Состав', value: 'Сыворотка 10 мл, крем 20 г, патчи 101 г / 60 шт, роллер 0,25 мм' },
      { label: 'Функция', value: 'Против морщин, мешков, тёмных кругов, успокоение' },
      { label: 'Производитель', value: 'DTS MG, Южная Корея' },
      { label: 'Тест', value: 'Дерматологически протестировано' },
      { label: 'Осторожно', value: 'Не использовать при беременности и кормлении. В креме арахисовое масло' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  faq: {
    eyebrow: 'Перед покупкой',
    title: 'Вопросы, которые этот набор реально получает.',
    items: [
      {
        q: 'Чем набор отличается от покупки средств по отдельности?',
        a: 'Он даёт полный ритуал EyeCell и включает роллер для глаз 0,25 мм на 60 игл, который отдельно не продаётся.',
      },
      {
        q: 'Роллер тот же, что на странице микроигольчатого роллера?',
        a: 'Нет. Та страница это съёмный лицевой роллер на 450 игл. В этом наборе цельный роллер для глаз 0,25 мм на 60 игл. Отдельно его не продают.',
      },
      {
        q: 'Сколько держать патчи?',
        a: '20–40 минут, затем снять. Патчи можно расположить под глазами и/или под бровями.',
      },
      {
        q: 'Можно ли при беременности?',
        a: 'Набор не используют во время беременности и грудного вскармливания. То же предупреждение есть у крема, который также содержит ретинилпальмитат.',
      },
      {
        q: 'Есть ли арахисовое масло?',
        a: 'Да. В формуле крема есть Arachis Hypogaea (Peanut) Oil. При аллергии на арахис не используйте набор; сыворотку и патчи можно выбрать отдельно.',
      },
      {
        q: 'Это без отдушки?',
        a: 'Нет. В креме масло цедры апельсина и лимонен. В патчах Parfum.',
      },
      {
        q: 'Можно купить части отдельно?',
        a: 'У сыворотки, крема и патчей есть свои страницы. У роллера 0,25 мм нет. Он едет только в этом наборе.',
      },
      {
        q: 'Можно ли использовать роллер повторно?',
        a: 'Да. Русская панель требует перед повторным использованием выдержать его 5 минут в растворе хлоргексидина. Роллер предназначен только для личного использования.',
      },
    ],
  },
}

const BY_LOCALE: Record<EyeKitLocale, EyeKitCopy> = { en: EN, ar: AR, ru: RU }

export function getEyeKitCopy(locale: string): EyeKitCopy {
  return BY_LOCALE[(locale as EyeKitLocale) in BY_LOCALE ? (locale as EyeKitLocale) : 'en']
}
