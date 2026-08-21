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
  headline: 'تسلسل منطقة العين، في علبة واحدة.',
  subheadline:
    'السيروم، رولر العين 0.25 مم، اللصقات، ثم الكريم. طقم كوري مسجّل بباركود خاص به، لا صندوق جمّعناه هنا.',
  heroBullets: [
    'السيروم، تمرير لطيف، لصقات من 20 إلى 40 دقيقة، ثم الكريم',
    'أربوتين 2% وأدينوزين 0.04% في السيروم وفي الكريم',
    'نياسيناميد 2% وأدينوزين 0.04% في اللصقات',
    'رولر العين 0.25 مم يأتي في هذا الطقم فقط',
  ],
  kitSize: 'علبة واحدة',
  fullSizeNote: 'طقم كوري مسجّل',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني فوق 1,000 درهم · الشحن من دبي',
  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف',
  outOfStock: 'غير متوفر',
  loginToShop: 'سجّلي الدخول للشراء',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  badges: ['مختبر جلدياً', 'صُنع في كوريا', 'باركود خاص', 'تسلسل من أربع قطع'],
  stats: [
    { value: '4', label: 'قطع في العلبة' },
    { value: '2%', label: 'أربوتين في السيروم والكريم' },
    { value: '2%', label: 'نياسيناميد في اللصقات' },
    { value: '0.25مم', label: 'رولر العين، 60 إبرة' },
  ],
  contents: {
    eyebrow: 'داخل العلبة',
    title: 'ثلاثة مستحضرات تعرفينها، والرولر الذي يعيش هنا فقط.',
    intro:
      'لكل مستحضر صفحته وسعره وملفه. رولر العين لا. أداة قطعة واحدة 0.25 مم صُنعت لعظم الحجاج، وتُشحن في هذا الطقم فقط.',
    items: [
      {
        id: 'serum',
        title: 'EyeCell EYE CONTOUR SERUM',
        productNumber: '17',
        quantity: 1,
        step: 'الخطوة 1 · السيروم أولاً',
        body: 'سيروم مكثف يُترك على البشرة للعناية بمظهر التجاعيد العميقة والهالات والميل إلى الانتفاخ. يجمع الأربوتين 2% والأدينوسين 0.04%، ثم يُستخدم الرولر بلطف وفق خطوات الطقم.',
        facts: ['10 مل', 'أربوتين 2%', 'أدينوزين 0.04%', 'من دون شطف'],
      },
      {
        id: 'roller',
        title: 'GENOSYS EYE ROLLER',
        quantity: 1,
        step: 'الخطوة 1 · مع السيروم',
        body: 'قطعة واحدة، 0.25 مم، 60 إبرة. لمنحنى العين، لا للوجه. عناية زائدة، ضغط خفيف، بعيداً عن العين والشفة. هذا ليس رولر الوجه 450 إبرة في صفحته الخاصة.',
        facts: ['0.25 مم', '60 إبرة', 'قطعة واحدة', 'في الطقم فقط'],
        image: ROLLER_IMAGE,
      },
      {
        id: 'patch',
        title: 'EyeCell EYE PEPTIDE GEL PATCH',
        productNumber: '33',
        quantity: 1,
        step: 'الخطوة 2 · قناع يُرفع',
        body: 'أهلة هيدروجيل تحت العينين، أو على عظمتي الحاجب إن أردتِ الجلسة المكثّفة. نياسيناميد 2% وأدينوزين 0.04% هما الزوج الوظيفي. من عشرين إلى أربعين دقيقة ثم ارفعيهما. الببتيد عند أثر تجميلي.',
        facts: ['101 غ / 60 قطعة', 'نياسيناميد 2%', 'أدينوزين 0.04%', '20-40 دقيقة ثم تُرفع'],
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
      'المجموع المنفصل هو المستحضرات الثلاثة بأسعار صفحاتها. رولر العين 0.25 مم في الطقم فقط، لذلك لا يدخل ذلك المجموع. إن جعل خصم العيادة الثلاثة أرخص من الطقم، تختفي هذه الخانة.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'أربع خطوات. العلبة تكتب الترتيب.',
    intro:
      'نظّفي، السيروم والرولر، اللصقات، الكريم. لوحة الطقم الإنجليزية تطبع 20 دقيقة على اللصقات. البسيها من 20 إلى 40 دقيقة، وهذا ما تقوله اللصقة نفسها.',
    steps: [
      {
        title: 'نظّفي محيط العين',
        body: 'المكياج خارجاً، والبشرة جافة بما يكفي لتأخذ السيروم. أبقي المنظف بعيداً عن العين.',
      },
      {
        title: 'السيروم، ثم تمرير لطيف',
        body: 'طبقة رقيقة من سيروم محيط العين. مرّري رولر العين 0.25 مم فوق تلك الطبقة ودعيه يُمتص. عناية زائدة. بلا ضغط زائد. أبعدي الرولر عن العين والأغشية المخاطية والشفة.',
      },
      {
        title: 'اللصقات، 20-40 دقيقة',
        body: 'هلالان تحت العينين. هلالان آخران على عظمتي الحاجب إن أردتِ الجلسة المكثّفة. ثم ارفعي. ربّتي على المتبقي. لا تتركيها طوال الليل.',
      },
      {
        title: 'الكريم للختم',
        body: 'كريم محيط العين أخيراً. كمية صغيرة، تربيت لطيف، ثم يُترك. صباحاً أو مساءً بعد التسلسل.',
      },
    ],
    note: 'تجاوزي الرولر إن كان لديكِ تاريخ جدرة أو حساسية فولاذ مقاوم أو التهاب جلد. الكريم يحتوي زيت الفول السوداني. علبة الطقم تقول تجنّبي الاستخدام أثناء الحمل والرضاعة.',
    videoTitle: 'التسلسل على الفيلم',
  },
  evidence: {
    eyebrow: 'ما يستحق البطاقة فعلاً',
    title: 'زوجان وظيفيان، ورولر 0.25 مم.',
    intro:
      'ليس للطقم دراسة خاصة به. ما يُقال هو ما قيس أصلاً على المستحضرات الثلاثة وطُبع على الرولر.',
    cards: [
      {
        value: '2% + 0.04%',
        title: 'السيروم والكريم',
        body: 'يجمع السيروم والكريم الأربوتين 2% للعناية بمظهر الهالات والأدينوزين 0.04% للعناية بمظهر التجاعيد. وتأتي الببتيدات وHaloxyl كدعم إضافي للتركيبة.',
      },
      {
        value: '2% + 0.04%',
        title: 'اللصقات',
        body: 'نياسيناميد 2% وأدينوزين 0.04%. من 20 إلى 40 دقيقة ثم تُرفع. الببتيد المسمّى 46.5 جزء في البليون.',
      },
      {
        value: '0.25مم',
        title: 'رولر العين',
        body: 'ستون إبرة، قطعة واحدة، لمحيط العين. العلبة تقول إنه يساعد الامتصاص. هذه جملة العلبة، لا ادّعاء إبر طبية.',
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
      'المهمة هي الجفاف أو الهالات أو أكياس العين أو خطوط الغراب',
      'ستستخدمين رولر 0.25 مم بلطف ثم ترفعين اللصقات',
    ],
    notForTitle: 'اشتري شيئاً آخر إن',
    notForList: [
      'كنتِ حاملاً أو مرضعة. علبة الطقم تقول تجنّبي',
      'لديكِ حساسية الفول السوداني. الكريم يحتوي زيته',
      'لديكِ تاريخ جدرة أو حساسية معدن أو التهاب جلد. تجاوزي الرولر، أو اشتري المستحضرات الثلاثة من صفحاتها',
      'أردتِ قطعة واحدة فقط. افتحي ذلك المنتج',
      'أردتِ رولر الوجه 450 إبرة. تلك أداة أخرى',
    ],
    alternativesLabel: 'القطع، ورولر الوجه',
    alternatives: [
      { productNumber: '17', label: 'سيروم EyeCell المكثف لمحيط العين' },
      { productNumber: '24', label: 'كريم EyeCell لمحيط العين' },
      { productNumber: '33', label: 'لصقات هلام العين' },
      { productNumber: '1', label: 'رولر الوجه، 450 إبرة' },
    ],
    note: 'الكريم ليس خالياً من العطر: زيت قشر البرتقال والليمونين. اللصقات تحمل Parfum. أبعدي كل قطعة عن العين.',
  },
  details: {
    eyebrow: 'على العلبة',
    title: 'الحقائق التي تستحق بطاقة.',
    rows: [
      { label: 'الشكل', value: 'طقم مسجّل من أربع قطع لمنطقة العين' },
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
        q: 'هل هذا صندوق جمال؟',
        a: 'لا. صناديق الجمال تُجمَّع هنا وليس لها باركود خاص. هذه العلبة طقم كوري مسجّل باركوده 8809046298035.',
      },
      {
        q: 'هل الرولر هو نفسه رولر الإبر في صفحته؟',
        a: 'لا. تلك الصفحة لرولر الوجه القابل للفصل بـ 450 إبرة. هذا الطقم يحمل رولر عين قطعة واحدة 0.25 مم بـ 60 إبرة. لا يُباع وحده.',
      },
      {
        q: 'كم تبقى اللصقات؟',
        a: 'من 20 إلى 40 دقيقة ثم تُرفع. لوحة الطقم الإنجليزية تطبع 20 دقيقة. اللصقة نفسها، واللوحتان الكورية والروسية، تطبعان 20-40. البسي النافذة الأطول.',
      },
      {
        q: 'هل يُستخدم أثناء الحمل؟',
        a: 'علبة الطقم تقول تجنّبي الاستخدام أثناء الحمل والرضاعة. الكريم يطبع السطر نفسه ويحمل إستر ريتينيل بالميتات. اسألي طبيبك قبل أي طقم لمنطقة العين في تلك الفترة.',
      },
      {
        q: 'هل يحتوي زيت الفول السوداني؟',
        a: 'الكريم يحتويه. Arachis Hypogaea (Peanut) Oil في تركيبة الكريم المسجّلة. إن كان الفول السوداني محسّساً لكِ، تجاوزي الطقم أو اشتري السيروم واللصقات من صفحاتهما.',
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
        q: 'هل هذا طقم ببتيد؟ هل يغني عن البوتوكس؟',
        a: 'لا. الببتيدات عند أثر تجميلي في المستحضرات الثلاثة. الأرقام التي تستحق بطاقة هي الأزواج الوظيفية: أربوتين وأدينوزين في السيروم والكريم، نياسيناميد وأدينوزين في اللصقات. هذه ليست قصة إرخاء عضلة.',
      },
    ],
  },
}

const RU: EyeKitCopy = {
  eyebrow: 'EyeCell · Набор из четырёх частей',
  backToProducts: 'Все продукты',
  headline: 'Последовательность для зоны глаз, в одной коробке.',
  subheadline:
    'Сыворотка, роллер 0,25 мм, патчи, затем крем. Зарегистрированный корейский набор со своим штрихкодом, не коробка, собранная здесь.',
  heroBullets: [
    'Сыворотка, мягкий прокат, патчи 20-40 минут, затем крем',
    'Арбутин 2% и аденозин 0,04% в сыворотке и в креме',
    'Ниацинамид 2% и аденозин 0,04% в патчах',
    'Роллер для глаз 0,25 мм есть только в этом наборе',
  ],
  kitSize: '1 коробка',
  fullSizeNote: 'Зарегистрированный корейский набор',
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
    'Свой штрихкод',
    'Последовательность из четырёх частей',
  ],
  stats: [
    { value: '4', label: 'Части в коробке' },
    { value: '2%', label: 'Арбутин в сыворотке и креме' },
    { value: '2%', label: 'Ниацинамид в патчах' },
    { value: '0,25 мм', label: 'Роллер для глаз, 60 игл' },
  ],
  contents: {
    eyebrow: 'Что в коробке',
    title: 'Три средства, которые уже есть на сайте, и роллер, который живёт только здесь.',
    intro:
      'У каждого средства своя страница, своя цена и свои документы. У роллера для глаз нет. Это цельный инструмент 0,25 мм для орбитальной кости, и он едет только в этом наборе.',
    items: [
      {
        id: 'serum',
        title: 'EyeCell EYE CONTOUR SERUM',
        productNumber: '17',
        quantity: 1,
        step: 'Шаг 1 · Сначала сыворотка',
        body: 'Интенсивная несмываемая сыворотка для ухода за глубокими морщинами, тёмными кругами и склонностью к припухлости. Сочетает арбутин 2% и аденозин 0,04%; затем роллер используют мягко по инструкции набора.',
        facts: ['10 мл', 'Арбутин 2%', 'Аденозин 0,04%', 'Не смывать'],
      },
      {
        id: 'roller',
        title: 'GENOSYS EYE ROLLER',
        quantity: 1,
        step: 'Шаг 1 · Вместе с сывороткой',
        body: 'Цельный, 0,25 мм, 60 игл. Для изгиба вокруг глаза, не для лица. Особая осторожность, лёгкое давление, не на глаз и не на губу. Это не съёмный роллер на 450 игл с отдельной страницы.',
        facts: ['0,25 мм', '60 игл', 'Цельный', 'Только в наборе'],
        image: ROLLER_IMAGE,
      },
      {
        id: 'patch',
        title: 'EyeCell EYE PEPTIDE GEL PATCH',
        productNumber: '33',
        quantity: 1,
        step: 'Шаг 2 · Маска, которую снимают',
        body: 'Гидрогелевые полумесяцы под глаза или на кости бровей, если нужна интенсивная посадка. Ниацинамид 2% и аденозин 0,04% функциональная пара. Двадцать-сорок минут, затем снять. Пептид в следовом количестве.',
        facts: ['101 г / 60 шт', 'Ниацинамид 2%', 'Аденозин 0,04%', '20-40 мин, затем снять'],
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
      'Отдельная сумма это три средства по ценам их страниц. Роллер 0,25 мм есть только в наборе, поэтому его нет в этой сумме. Если скидка клиники сделает три средства дешевле набора, эта строка скроется.',
  },
  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Четыре шага. Порядок пишет коробка.',
    intro:
      'Очистить, сыворотка и роллер, патчи, крем. Английская панель набора печатает 20 минут на патчах. Держите 20-40 минут, как написано на самих патчах.',
    steps: [
      {
        title: 'Очистите контур глаз',
        body: 'Макияж снят, кожа достаточно сухая, чтобы принять сыворотку. Очищающее средство не в глаз.',
      },
      {
        title: 'Сыворотка, затем мягкий прокат',
        body: 'Тонкий слой сыворотки для контура глаз. Прокатайте роллер 0,25 мм по этому слою и дайте впитаться. Особая осторожность. Без лишнего давления. Роллер не на глаз, не на слизистую и не на губу.',
      },
      {
        title: 'Патчи, 20-40 минут',
        body: 'Два полумесяца под глаза. Ещё два на кости бровей, если нужна интенсивная посадка. Затем снять. Остаток вбить. Не оставлять на ночь.',
      },
      {
        title: 'Крем, чтобы закрепить',
        body: 'Крем для контура глаз последним. Немного, мягкое похлопывание, оставить. Утром или вечером после последовательности.',
      },
    ],
    note: 'Не используйте роллер при келоидном рубцевании, аллергии на нержавеющую сталь или дерматите. В креме арахисовое масло. Коробка набора пишет: не использовать при беременности и кормлении.',
    videoTitle: 'Последовательность на видео',
  },
  evidence: {
    eyebrow: 'Что реально на карточках',
    title: 'Две функциональные пары и роллер 0,25 мм.',
    intro:
      'У набора нет собственного исследования. Можно сказать то, что уже измерено на трёх средствах и напечатано на роллере.',
    cards: [
      {
        value: '2% + 0,04%',
        title: 'Сыворотка и крем',
        body: 'Сыворотка и крем сочетают арбутин 2% для ухода за тёмными кругами и аденозин 0,04% для ухода за морщинами. Пептиды и Haloxyl дополняют формулу.',
      },
      {
        value: '2% + 0,04%',
        title: 'Патчи',
        body: 'Ниацинамид 2% и аденозин 0,04%. 20-40 минут, затем снять. Названный пептид 46,5 ppb.',
      },
      {
        value: '0,25 мм',
        title: 'Роллер для глаз',
        body: 'Шестьдесят игл, цельный, для контура глаз. Коробка пишет, что он помогает впитыванию. Это фраза коробки, не медицинское заявление о микронидлинге.',
      },
    ],
    footnote:
      'Описание каждого шага опирается на состав и подтверждённое косметическое назначение средств, без переноса результатов исследований, не относящихся к набору целиком.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Полная последовательность EyeCell или отдельные части.',
    forTitle: 'Этот набор ваш, если',
    forList: [
      'Нужны сыворотка, роллер, патчи и крем в одной коробке',
      'Задача это обезвоживание, тёмные круги, мешки или гусиные лапки',
      'Роллер 0,25 мм будете использовать мягко, патчи снимете',
    ],
    notForTitle: 'Возьмите другое, если',
    notForList: [
      'Беременность или кормление. Коробка набора пишет избегать',
      'Аллергия на арахис. В креме арахисовое масло',
      'Келоидный рубец, аллергия на металл или дерматит. Без роллера, или три средства с их страниц',
      'Нужна только одна часть. Откройте тот продукт',
      'Нужен лицевой роллер на 450 игл. Это другой инструмент',
    ],
    alternativesLabel: 'Части и лицевой роллер',
    alternatives: [
      { productNumber: '17', label: 'Интенсивная сыворотка EyeCell для контура глаз' },
      { productNumber: '24', label: 'Крем EyeCell для контура глаз' },
      { productNumber: '33', label: 'Пептидные патчи для глаз' },
      { productNumber: '1', label: 'Лицевой роллер, 450 игл' },
    ],
    note: 'Крем не без отдушки: масло цедры апельсина и лимонен. В патчах Parfum. Каждую часть держите вне глаза.',
  },
  details: {
    eyebrow: 'На коробке',
    title: 'Факты, которым место на карточке.',
    rows: [
      { label: 'Форма', value: 'Зарегистрированный набор из четырёх частей для зоны глаз' },
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
        q: 'Это бьюти-бокс?',
        a: 'Нет. Бьюти-боксы собирают здесь, и у них нет своего EAN. Эта коробка зарегистрированный корейский набор со штрихкодом 8809046298035.',
      },
      {
        q: 'Роллер тот же, что на странице микроигольчатого роллера?',
        a: 'Нет. Та страница это съёмный лицевой роллер на 450 игл. В этом наборе цельный роллер для глаз 0,25 мм на 60 игл. Отдельно его не продают.',
      },
      {
        q: 'Сколько держать патчи?',
        a: '20-40 минут, затем снять. Английская панель набора печатает 20 минут. Сами патчи, а также корейская и русская панели, печатают 20-40. Держите более длинное окно.',
      },
      {
        q: 'Можно ли при беременности?',
        a: 'Коробка набора пишет: не использовать при беременности и кормлении. Крем печатает ту же строку и несёт эфир ретинилпальмитата. Спросите врача перед любым набором для зоны глаз в этом окне.',
      },
      {
        q: 'Есть ли арахисовое масло?',
        a: 'В креме есть. Arachis Hypogaea (Peanut) Oil в зарегистрированной формуле крема. Если арахис для вас аллерген, не берите набор или купите сыворотку и патчи отдельно.',
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
        q: 'Это пептидный набор? Заменяет ли он ботокс?',
        a: 'Нет. Пептиды в косметическом следе во всех трёх средствах. Цифры для карточки это функциональные пары: арбутин и аденозин в сыворотке и креме, ниацинамид и аденозин в патчах. Это не история про расслабление мышцы.',
      },
    ],
  },
}

const BY_LOCALE: Record<EyeKitLocale, EyeKitCopy> = { en: EN, ar: AR, ru: RU }

export function getEyeKitCopy(locale: string): EyeKitCopy {
  return BY_LOCALE[(locale as EyeKitLocale) in BY_LOCALE ? (locale as EyeKitLocale) : 'en']
}
