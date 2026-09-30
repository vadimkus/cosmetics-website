/**
 * Copy for the EyeCell EYE ZONE CARE KIT page (product 50), in English,
 * Arabic and Russian. "Rested eyes." campaign, Sep 2026.
 *
 * ─── Sourcing ──────────────────────────────────────────────────────────────
 *
 * Kit artwork (system source of truth)
 *   /Users/vadimkus/Desktop/Drive/Genosys/Registration/Intertek/
 *     Registration DOC/Artwork/[GENOSYS]EYECELL KIT.pdf  (Feb 2025)
 *   English function: Anti-wrinkle, Eye bag relief, Dark circle relief, Soothing
 *   Front sentence: professional eye-zone treatment covering dehydration,
 *   dark circle, eye bag, crow's feet, with a roller designed for the eye area.
 *   Contents: Eye Contour Serum 10ml, Eye Contour Cream 20g,
 *   Eye Peptide Gel Patch 101g, GENOSYS Eye Roller 0.25mm x 1ea
 *   How-to: 1 cleanse; 2 serum then roll; 3 patches; 4 cream.
 *   RU panel: roll horizontally and vertically for a few minutes; patches
 *   20-40 min; disinfect the roller 5 min in chlorhexidine before reuse.
 *   Precautions: external use; keep off eyes; avoid pregnancy / lactation;
 *   stop if redness / swelling / irritation. French panel: no roller with
 *   keloid, stainless-steel allergy or dermatitis.
 *
 * Component pages already shipped - do not contradict them
 *   17 Eye Contour Serum  - Arbutin 2% + Adenosine 0.04%. 10ml.
 *   24 Eye Contour Cream  - Arbutin 2% + Adenosine 0.04%, squalane 2.5%,
 *                          jojoba 2%. Peanut oil, retinyl palmitate, orange
 *                          peel oil + limonene. 20g.
 *   33 Eye Peptide Gel Patch - Niacinamide 2% + Adenosine 0.04%.
 *                          20-40 min then remove. 101g / 60ea. Parfum.
 *
 * The kit roller is not product 1
 *   Product 1 is the sterile single-use face roller in five needle lengths.
 *   The kit holds GENOSYS EYE ROLLER, one-body, 0.25mm, 60 needles,
 *   reusable after disinfection. Not sold on its own.
 *
 * Value math (live prices, not hardcoded here)
 *   17 + 24 + 33 = the separate total. The roller is not in that sum.
 *
 * ─── Claims that must not come back ────────────────────────────────────────
 *
 *   10 Years Back as a result             Printed on the packs. Not a claim.
 *   Peptide / Haloxyl / stem-cell as the engine
 *   Patented thermo-sensitive / transdermal patches
 *   Botox / muscle-relaxant
 *   Collagen activation, absorption or delivery claims for the roller
 *   All skin types · Fragrance-free · Pregnancy-safe
 *   Carton or dossier voice ("the carton says", "no trial on file")
 *   Contract manufacturers. DTS MG only. Lot / batch codes.
 */

export type EyeKitLocale = 'en' | 'ar' | 'ru'

export interface EyeKitItemCopy {
  id: string
  title: string
  /** Live catalogue number linked from the kit. The eye roller (product 69) stays unlinked so
   *  the separate total keeps counting the three cosmetics only. */
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
  concern: {
    eyebrow: string
    title: string
    body: string
    points: string[]
  }
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
  roller: {
    eyebrow: string
    title: string
    body: string
    points: string[]
    aside: string
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
  eyebrow: 'EyeCell · Eye zone care kit',
  backToProducts: 'All products',
  headline: 'Rested eyes, in four steps.',
  subheadline:
    'Serum, a 0.25 mm eye roller, cooling gel patches and cream: one routine for dark circles, eye bags and crow\'s feet, with every piece in the box.',
  heroBullets: [
    'Serum and a gentle roll, patches for 20-40 minutes, then cream',
    'Arbutin 2% and adenosine 0.04% in the serum and the cream',
    'Niacinamide 2% and adenosine 0.04% in the patches',
    'The GENOSYS Eye Roller 0.25 mm is in the box',
  ],
  kitSize: '1 box',
  fullSizeNote: 'Full-size serum, cream and patches',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over 1,000 AED · Ships from Dubai',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added',
  outOfStock: 'Out of stock',
  loginToShop: 'Log in to shop',
  inBag: 'In your bag',
  viewBag: 'View bag',
  badges: ['Dermatologically tested', 'Made in Korea', 'Full-size products', 'Eye roller included'],
  stats: [
    { value: '4', label: 'Pieces in one box' },
    { value: '2%', label: 'Arbutin in serum and cream' },
    { value: '2%', label: 'Niacinamide in the patches' },
    { value: '0.25 mm', label: 'Eye roller, 60 needles' },
  ],
  concern: {
    eyebrow: 'Made for the eye zone',
    title: 'Dark circles, eye bags and crow\'s feet, cared for together.',
    body: 'The skin around the eyes is the first place a short night shows. The kit answers it in layers: brightening arbutin and wrinkle-care adenosine in the serum and cream, niacinamide in patches that cool and soothe, and a fine roller made for the curve under the eye.',
    points: [
      'Brighter-looking under-eyes',
      'Smoother-looking crow\'s feet',
      'Eye bags that look less puffy',
      'Skin that feels soothed and hydrated',
    ],
  },
  contents: {
    eyebrow: 'Inside the box',
    title: 'Three full-size formulas and the roller made for them.',
    intro:
      'Serum, cream and patches are the same full-size products sold on their own pages. The 0.25 mm eye roller completes the set: one body, 60 fine needles, shaped for the eye contour.',
    items: [
      {
        id: 'serum',
        title: 'EyeCell EYE CONTOUR SERUM',
        productNumber: '17',
        quantity: 1,
        step: 'First layer',
        body: 'An intensive leave-on serum for dark circles, puffiness and deep lines. Arbutin 2% brightens and adenosine 0.04% smooths, placed through a fine metal tip right onto the contour. The roller goes over it.',
        facts: ['10 ml', 'Arbutin 2%', 'Adenosine 0.04%', 'Leave on'],
      },
      {
        id: 'roller',
        title: 'GENOSYS EYE ROLLER',
        quantity: 1,
        step: 'Over the serum',
        body: 'One body, 0.25 mm, 60 fine needles, sized for the delicate curve around the eye. Roll it lightly over the serum, horizontally and vertically, away from the eye and the lips.',
        facts: ['0.25 mm', '60 needles', 'One body', 'Reusable'],
        image: ROLLER_IMAGE,
      },
      {
        id: 'patch',
        title: 'EyeCell EYE PEPTIDE GEL PATCH',
        productNumber: '33',
        quantity: 1,
        step: 'After the roll',
        body: 'Cooling hydrogel crescents under the eyes, or along the brow bones for a fuller treatment. Niacinamide 2% and adenosine 0.04% work while you rest for 20 to 40 minutes, then lift them off and pat the essence in.',
        facts: ['101 g / 60 pcs', 'Niacinamide 2%', 'Adenosine 0.04%', '20-40 min'],
      },
      {
        id: 'cream',
        title: 'EyeCell EYE CONTOUR CREAM',
        productNumber: '24',
        quantity: 1,
        step: 'Last layer',
        body: 'The finishing layer. The same arbutin 2% and adenosine 0.04% as the serum, with squalane 2.5% and jojoba oil 2% to leave the contour soft and comfortable. Contains peanut oil, orange peel oil and limonene.',
        facts: ['20 g', 'Arbutin 2%', 'Adenosine 0.04%', 'Contains peanut oil'],
      },
    ],
    eanLabel: 'Barcode',
    each: 'each',
    viewItem: 'Open this product',
    kitOnly: 'Also sold on its own',
    boughtSeparately: 'Serum, cream and patches bought separately',
    inThisBox: 'This kit',
    youSave: 'You save',
    againstSeparate: 'against the three bought separately',
    seeBreakdown: 'See the breakdown',
    savingNote:
      'The separate total counts the serum, cream and patches at their own prices. The eye roller comes on top and is not counted.',
  },
  howTo: {
    eyebrow: 'How to use it',
    title: 'Four steps, one calm routine.',
    intro: 'Cleanse, serum and a gentle roll, patches for 20 to 40 minutes, then cream to finish.',
    steps: [
      {
        title: 'Cleanse the eye contour',
        body: 'Remove make-up and cleanse gently, then pat the skin dry so the serum goes onto clean skin.',
      },
      {
        title: 'Serum, then a gentle roll',
        body: 'Smooth Eye Contour Serum under the eyes and along the brow bones. Roll the 0.25 mm eye roller over it for a few minutes, horizontally and vertically, with light pressure and away from the eye.',
      },
      {
        title: 'Patches for 20-40 minutes',
        body: 'Place two crescents under the eyes, and two more on the brow bones if you like. Rest, lift them off after 20 to 40 minutes and pat the leftover essence in.',
      },
      {
        title: 'Cream to finish',
        body: 'A small amount of Eye Contour Cream, patted in gently with the fingertips.',
      },
    ],
    note: 'Skip the roller with a keloid tendency, a stainless-steel allergy, dermatitis or broken skin. The cream contains peanut oil. Avoid the kit during pregnancy and breastfeeding.',
    videoTitle: 'The routine on film',
  },
  roller: {
    eyebrow: 'The eye roller',
    title: '0.25 mm, made for the eye zone.',
    body: 'Sixty fine needles on a small one-body drum, sized for the thin skin under the eye and along the brow bone. It glides over the serum in light passes and goes back into the box when you are done.',
    points: [
      'Over the serum, horizontally and vertically, for a few minutes',
      'Light pressure, away from the eye and the lips',
      'Before each reuse, soak it in chlorhexidine solution for 5 minutes',
      'Yours alone: never share it',
    ],
    aside: 'Skip the roller with a keloid tendency, a stainless-steel allergy, dermatitis or broken skin, and use the three formulas on their own.',
  },
  evidence: {
    eyebrow: 'What does the work',
    title: 'Two proven pairs and one fine roller.',
    intro:
      'Arbutin, niacinamide and adenosine are the ingredients Korea recognises for brightening and wrinkle care, and each formula carries them at the levels set for functional cosmetics.',
    cards: [
      {
        value: '2% + 0.04%',
        title: 'Serum and cream',
        body: 'Arbutin 2% for brighter-looking under-eyes and adenosine 0.04% for smoother-looking lines, in both leave-on layers.',
      },
      {
        value: '2% + 0.04%',
        title: 'The patches',
        body: 'Niacinamide 2% and adenosine 0.04% in a cooling hydrogel that stays on for 20 to 40 minutes while you rest.',
      },
      {
        value: '0.25 mm',
        title: 'The eye roller',
        body: 'Sixty fine needles on a one-body drum made for the eye contour. Light passes over the serum for a few minutes, then the patches.',
      },
    ],
    footnote: 'The kit is dermatologically tested and made in Korea by DTS MG.',
  },
  suited: {
    eyebrow: 'Who it is for',
    title: 'The whole routine, or just the pieces.',
    forTitle: 'This kit is for you if',
    forList: [
      'You want serum, roller, patches and cream in one box',
      'Dark circles, eye bags or crow\'s feet are what you want to work on',
      'You like a routine you can repeat at home, step by step',
    ],
    notForTitle: 'Choose something else if',
    notForList: [
      'You are pregnant or breastfeeding: avoid the kit in that time',
      'You are allergic to peanuts: the cream contains peanut oil',
      'You have a keloid tendency, a metal allergy or dermatitis: skip the roller, or take the three formulas on their own',
      'You only want one piece: open that product instead',
      'You want to roll the whole face: the face roller is made for that',
    ],
    alternativesLabel: 'The pieces, and the face roller',
    alternatives: [
      { productNumber: '17', label: 'Eye Contour Serum' },
      { productNumber: '24', label: 'Eye Contour Cream' },
      { productNumber: '33', label: 'Eye Peptide Gel Patch' },
      { productNumber: '1', label: 'Face microneedle roller' },
    ],
    note: 'The cream contains orange peel oil and limonene, and the patches contain fragrance. Keep every piece away from the eye itself.',
  },
  details: {
    eyebrow: 'At a glance',
    title: 'Everything in the box.',
    rows: [
      { label: 'Form', value: 'Four-piece eye-zone care kit' },
      { label: 'Size', value: '1 box' },
      { label: 'Contents', value: 'Serum 10 ml, cream 20 g, gel patches 101 g / 60 pcs, eye roller 0.25 mm' },
      { label: 'Function', value: 'Anti-wrinkle, eye bag relief, dark circle relief, soothing' },
      { label: 'Made by', value: 'DTS MG, South Korea' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Caution', value: 'Avoid during pregnancy and breastfeeding. Cream contains peanut oil' },
    ],
    barcodeLabel: 'Barcode',
  },
  faq: {
    eyebrow: 'Before you buy',
    title: 'Questions about the kit.',
    items: [
      {
        q: 'What do I get over buying the pieces separately?',
        a: 'The full EyeCell routine in one box, for less than the serum, cream and patches cost on their own, plus the 0.25 mm eye roller, which is only sold in this kit.',
      },
      {
        q: 'Is the eye roller the same as the face roller?',
        a: 'No. The face roller is a sterile single-use roller for the whole face, in five needle lengths. This is a one-body 0.25 mm roller with 60 needles, made for the eye zone and reusable after disinfection.',
      },
      {
        q: 'How long do the patches stay on?',
        a: '20 to 40 minutes, then lift them off and pat the leftover essence in. Do not sleep in them.',
      },
      {
        q: 'How do I look after the roller?',
        a: 'Before each reuse, soak it in chlorhexidine solution for 5 minutes, and keep it for yourself: never share it.',
      },
      {
        q: 'Can I use it while pregnant?',
        a: 'Avoid the kit during pregnancy and breastfeeding. The cream also contains a retinyl palmitate ester. Ask your doctor before starting any eye-zone routine in that time.',
      },
      {
        q: 'Does it contain peanut oil?',
        a: 'The cream does: Arachis Hypogaea (Peanut) Oil. If peanut is an allergen for you, skip the kit and choose the serum and patches on their own.',
      },
      {
        q: 'Is it fragrance-free?',
        a: 'No. The cream contains orange peel oil and limonene, and the patches contain fragrance.',
      },
      {
        q: 'Can I buy the pieces separately?',
        a: 'Serum, cream and patches each have their own page, and so does the 0.25 mm eye roller.',
      },
    ],
  },
}

const AR: EyeKitCopy = {
  eyebrow: 'EyeCell · طقم العناية بمحيط العين',
  backToProducts: 'كل المنتجات',
  headline: 'عيون مرتاحة في أربع خطوات.',
  subheadline:
    'سيروم ورولر للعين بعمق 0.25 مم ولصقات جل منعشة وكريم: روتين واحد للهالات الداكنة وانتفاخ تحت العين وتجاعيد زوايا العين، وكل قطعة في العلبة.',
  heroBullets: [
    'السيروم مع تمريرة لطيفة للرولر، لصقات 20-40 دقيقة، ثم الكريم',
    'أربوتين 2% وأدينوزين 0.04% في السيروم والكريم',
    'نياسيناميد 2% وأدينوزين 0.04% في اللصقات',
    'رولر العين GENOSYS بطول 0.25 مم داخل العلبة',
  ],
  kitSize: 'علبة واحدة',
  fullSizeNote: 'سيروم وكريم ولصقات بالحجم الكامل',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني فوق 1,000 درهم · الشحن من دبي',
  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف',
  outOfStock: 'غير متوفر',
  loginToShop: 'سجّلي الدخول للشراء',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
  badges: ['مختبر جلدياً', 'صُنع في كوريا', 'منتجات بالحجم الكامل', 'رولر العين مرفق'],
  stats: [
    { value: '4', label: 'قطع في علبة واحدة' },
    { value: '2%', label: 'أربوتين في السيروم والكريم' },
    { value: '2%', label: 'نياسيناميد في اللصقات' },
    { value: '0.25 مم', label: 'رولر العين، 60 إبرة' },
  ],
  concern: {
    eyebrow: 'مصمم لمحيط العين',
    title: 'الهالات والانتفاخ وتجاعيد زوايا العين، بعناية واحدة.',
    body: 'بشرة محيط العين أول ما يكشف ليلة قصيرة. يجيب الطقم على ذلك بطبقات: أربوتين للإشراق وأدينوزين للعناية بالتجاعيد في السيروم والكريم، ونياسيناميد في لصقات منعشة ومهدئة، ورولر دقيق مصمم لانحناءة ما تحت العين.',
    points: [
      'مظهر أكثر إشراقاً تحت العينين',
      'تجاعيد زوايا العين أكثر نعومة',
      'انتفاخ أقل وضوحاً',
      'بشرة مرطبة ومهدأة',
    ],
  },
  contents: {
    eyebrow: 'داخل العلبة',
    title: 'ثلاث تركيبات بالحجم الكامل والرولر المصمم لها.',
    intro:
      'السيروم والكريم واللصقات هي المنتجات نفسها التي تُباع في صفحاتها، بحجمها الكامل. ويكتمل الطقم برولر العين 0.25 مم: قطعة واحدة، 60 إبرة دقيقة، بشكل يناسب محيط العين.',
    items: [
      {
        id: 'serum',
        title: 'EyeCell EYE CONTOUR SERUM',
        productNumber: '17',
        quantity: 1,
        step: 'الطبقة الأولى',
        body: 'سيروم مكثف يُترك على البشرة للهالات والانتفاخ والخطوط العميقة. أربوتين 2% يفتّح وأدينوزين 0.04% ينعّم، ورأس معدني دقيق يضعه على محيط العين بدقة. ثم يأتي الرولر فوقه.',
        facts: ['10 مل', 'أربوتين 2%', 'أدينوزين 0.04%', 'من دون شطف'],
      },
      {
        id: 'roller',
        title: 'GENOSYS EYE ROLLER',
        quantity: 1,
        step: 'فوق السيروم',
        body: 'رولر من قطعة واحدة بعمق 0.25 مم و60 إبرة دقيقة لانحناءة محيط العين الرقيقة. مرّريه بخفة فوق السيروم أفقياً وعمودياً، بعيداً عن العين والشفتين.',
        facts: ['0.25 مم', '60 إبرة', 'قطعة واحدة', 'قابل لإعادة الاستخدام'],
        image: ROLLER_IMAGE,
      },
      {
        id: 'patch',
        title: 'EyeCell EYE PEPTIDE GEL PATCH',
        productNumber: '33',
        quantity: 1,
        step: 'بعد الرولر',
        body: 'أهلّة هيدروجل منعشة تحت العينين أو على عظمة الحاجب لعناية أشمل. يعمل النياسيناميد 2% والأدينوزين 0.04% بينما ترتاحين 20-40 دقيقة، ثم انزعي اللصقات وربّتي على بقايا الخلاصة.',
        facts: ['101 غ / 60 لصقة', 'نياسيناميد 2%', 'أدينوزين 0.04%', '20-40 دقيقة'],
      },
      {
        id: 'cream',
        title: 'EyeCell EYE CONTOUR CREAM',
        productNumber: '24',
        quantity: 1,
        step: 'الطبقة الأخيرة',
        body: 'الطبقة الأخيرة. أربوتين 2% وأدينوزين 0.04% كما في السيروم، مع سكوالان 2.5% وزيت الجوجوبا 2% لبشرة ناعمة ومريحة. يحتوي على زيت الفول السوداني وزيت قشر البرتقال والليمونين.',
        facts: ['20 غ', 'أربوتين 2%', 'أدينوزين 0.04%', 'يحتوي زيت الفول السوداني'],
      },
    ],
    eanLabel: 'الباركود',
    each: 'للقطعة',
    viewItem: 'افتحي هذا المنتج',
    kitOnly: 'يُباع منفرداً أيضاً',
    boughtSeparately: 'السيروم والكريم واللصقات منفردة',
    inThisBox: 'هذا الطقم',
    youSave: 'توفّرين',
    againstSeparate: 'مقارنة بشراء المنتجات الثلاثة منفردة',
    seeBreakdown: 'انظري التفاصيل',
    savingNote:
      'يُحسب المجموع المنفصل بأسعار السيروم والكريم واللصقات في صفحاتها. أما رولر العين فيأتي إضافة ولا يدخل في الحساب.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'أربع خطوات، روتين هادئ واحد.',
    intro: 'التنظيف، ثم السيروم مع تمريرة لطيفة للرولر، ثم اللصقات 20-40 دقيقة، والكريم للختام.',
    steps: [
      {
        title: 'نظّفي محيط العين',
        body: 'أزيلي المكياج ونظّفي البشرة بلطف، ثم جففيها بالتربيت ليوضع السيروم على بشرة نظيفة.',
      },
      {
        title: 'السيروم، ثم الرولر',
        body: 'وزّعي السيروم تحت العينين وأسفل الحاجبين. مرّري رولر 0.25 مم فوقه لبضع دقائق بحركات أفقية وعمودية، بخفة وبعيداً عن العين.',
      },
      {
        title: 'اللصقات 20-40 دقيقة',
        body: 'ضعي هلالين تحت العينين، وهلالين آخرين على عظمتي الحاجب إن رغبتِ. استرخي، ثم انزعيها بعد 20-40 دقيقة وربّتي على بقايا الخلاصة.',
      },
      {
        title: 'الكريم للختام',
        body: 'كمية صغيرة من كريم محيط العين، تربّتين عليها بلطف بأطراف الأصابع.',
      },
    ],
    note: 'لا تستخدمي الرولر مع قابلية للندبات الجدروية أو حساسية من الفولاذ المقاوم للصدأ أو التهاب جلدي أو على بشرة متضررة. يحتوي الكريم على زيت الفول السوداني. تجنّبي الطقم أثناء الحمل والرضاعة.',
    videoTitle: 'الروتين بالفيديو',
  },
  roller: {
    eyebrow: 'رولر العين',
    title: '0.25 مم، مصمم لمحيط العين.',
    body: 'ستون إبرة دقيقة على أسطوانة صغيرة من قطعة واحدة، تناسب البشرة الرقيقة تحت العين وعلى عظمة الحاجب. ينزلق بخفة فوق السيروم، ثم يعود إلى علبته بعد الروتين.',
    points: [
      'فوق السيروم، أفقياً وعمودياً، لبضع دقائق',
      'من دون ضغط، وبعيداً عن العين والشفتين',
      'قبل كل إعادة استخدام، اغمريه 5 دقائق في محلول الكلورهيكسيدين',
      'لكِ وحدكِ: لا تشاركيه مع أحد',
    ],
    aside: 'تجاوزي الرولر مع قابلية للندبات الجدروية أو حساسية من الفولاذ المقاوم للصدأ أو التهاب جلدي أو بشرة متضررة، واستخدمي التركيبات الثلاث وحدها.',
  },
  evidence: {
    eyebrow: 'ما الذي يعمل',
    title: 'ثنائيان مثبتان ورولر دقيق.',
    intro:
      'الأربوتين والنياسيناميد والأدينوزين مكونات وظيفية معتمدة في كوريا للإشراق والعناية بالتجاعيد، وكل تركيبة تحملها بالتركيزات المحددة لذلك.',
    cards: [
      {
        value: '2% + 0.04%',
        title: 'السيروم والكريم',
        body: 'أربوتين 2% لمظهر أكثر إشراقاً تحت العينين وأدينوزين 0.04% لخطوط أكثر نعومة، في الطبقتين اللتين تبقيان على البشرة.',
      },
      {
        value: '2% + 0.04%',
        title: 'اللصقات',
        body: 'نياسيناميد 2% وأدينوزين 0.04% في هيدروجل منعش يبقى 20-40 دقيقة بينما ترتاحين.',
      },
      {
        value: '0.25 مم',
        title: 'رولر العين',
        body: 'ستون إبرة دقيقة على أسطوانة من قطعة واحدة لمحيط العين. تمريرات خفيفة فوق السيروم لبضع دقائق، ثم اللصقات.',
      },
    ],
    footnote: 'الطقم مختبر جلدياً ومصنوع في كوريا بواسطة DTS MG.',
  },
  suited: {
    eyebrow: 'لمن هو',
    title: 'الروتين كاملاً، أو القطع منفردة.',
    forTitle: 'هذا الطقم لكِ إن',
    forList: [
      'أردتِ السيروم والرولر واللصقات والكريم في علبة واحدة',
      'أردتِ العناية بالهالات أو الانتفاخ أو تجاعيد زوايا العين',
      'تحبين روتيناً منزلياً سهل التكرار خطوة بخطوة',
    ],
    notForTitle: 'اختاري شيئاً آخر إن',
    notForList: [
      'كنتِ حاملاً أو مرضعة: تجنّبي الطقم في هذه الفترة',
      'لديكِ حساسية من الفول السوداني: الكريم يحتوي زيته',
      'لديكِ قابلية للندبات الجدروية أو حساسية من المعادن أو التهاب جلدي: تجاوزي الرولر أو اختاري التركيبات الثلاث منفردة',
      'أردتِ قطعة واحدة فقط: افتحي صفحتها',
      'أردتِ تمرير الرولر على الوجه كله: رولر الوجه مصمم لذلك',
    ],
    alternativesLabel: 'القطع منفردة، ورولر الوجه',
    alternatives: [
      { productNumber: '17', label: 'سيروم EyeCell لمحيط العين' },
      { productNumber: '24', label: 'كريم EyeCell لمحيط العين' },
      { productNumber: '33', label: 'لصقات الجل EyeCell للعين' },
      { productNumber: '1', label: 'رولر الإبر الدقيقة للوجه' },
    ],
    note: 'يحتوي الكريم على زيت قشر البرتقال والليمونين، وتحتوي اللصقات على عطر. أبقي كل القطع بعيداً عن العين نفسها.',
  },
  details: {
    eyebrow: 'لمحة سريعة',
    title: 'كل ما في العلبة.',
    rows: [
      { label: 'الشكل', value: 'طقم من أربع قطع للعناية بمحيط العين' },
      { label: 'الحجم', value: 'علبة واحدة' },
      { label: 'المحتويات', value: 'سيروم 10 مل، كريم 20 غ، لصقات جل 101 غ / 60 لصقة، رولر عين 0.25 مم' },
      { label: 'الوظيفة', value: 'مضاد للتجاعيد، تخفيف أكياس العين، تخفيف الهالات، تهدئة' },
      { label: 'الصانع', value: 'DTS MG، كوريا الجنوبية' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'تنبيه', value: 'تجنّبي أثناء الحمل والرضاعة. الكريم يحتوي زيت الفول السوداني' },
    ],
    barcodeLabel: 'الباركود',
  },
  faq: {
    eyebrow: 'قبل الشراء',
    title: 'أسئلة عن الطقم.',
    items: [
      {
        q: 'ماذا أكسب مقارنة بشراء القطع منفردة؟',
        a: 'روتين EyeCell كاملاً في علبة واحدة بسعر أقل من السيروم والكريم واللصقات منفردة، مع رولر العين 0.25 مم الذي لا يُباع إلا في هذا الطقم.',
      },
      {
        q: 'هل رولر العين هو نفسه رولر الوجه؟',
        a: 'لا. رولر الوجه معقّم للاستخدام مرة واحدة على الوجه كله، بخمسة أطوال للإبر. أما هذا فرولر من قطعة واحدة بعمق 0.25 مم و60 إبرة لمحيط العين، ويمكن إعادة استخدامه بعد التعقيم.',
      },
      {
        q: 'كم تبقى اللصقات؟',
        a: '20-40 دقيقة، ثم انزعيها وربّتي على بقايا الخلاصة. لا تنامي بها.',
      },
      {
        q: 'كيف أعتني بالرولر؟',
        a: 'قبل كل إعادة استخدام، اغمريه 5 دقائق في محلول الكلورهيكسيدين، واحتفظي به لنفسكِ: لا تشاركيه مع أحد.',
      },
      {
        q: 'هل يُستخدم أثناء الحمل؟',
        a: 'تجنّبي الطقم أثناء الحمل والرضاعة. يحتوي الكريم أيضاً على ريتينيل بالميتات. استشيري طبيبكِ قبل أي روتين لمحيط العين في هذه الفترة.',
      },
      {
        q: 'هل يحتوي زيت الفول السوداني؟',
        a: 'نعم، في الكريم: Arachis Hypogaea (Peanut) Oil. إن كان الفول السوداني يسبب لكِ الحساسية، فاختاري السيروم واللصقات منفردة.',
      },
      {
        q: 'هل هو خالٍ من العطر؟',
        a: 'لا. يحتوي الكريم على زيت قشر البرتقال والليمونين، وتحتوي اللصقات على عطر.',
      },
      {
        q: 'هل يمكنني شراء القطع منفردة؟',
        a: 'للسيروم والكريم واللصقات صفحة لكل منها، وكذلك لرولر العين 0.25 مم.',
      },
    ],
  },
}

const RU: EyeKitCopy = {
  eyebrow: 'EyeCell · Набор для зоны вокруг глаз',
  backToProducts: 'Все продукты',
  headline: 'Свежий взгляд за четыре шага.',
  subheadline:
    'Сыворотка, роллер 0,25 мм для глаз, охлаждающие гелевые патчи и крем: один ритуал против тёмных кругов, мешков и гусиных лапок, и всё уже в коробке.',
  heroBullets: [
    'Сыворотка и мягкий роллер, патчи на 20-40 минут, затем крем',
    'Арбутин 2% и аденозин 0,04% в сыворотке и креме',
    'Ниацинамид 2% и аденозин 0,04% в патчах',
    'Роллер для глаз GENOSYS 0,25 мм в коробке',
  ],
  kitSize: '1 коробка',
  fullSizeNote: 'Сыворотка, крем и патчи полного объёма',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  outOfStock: 'Нет в наличии',
  loginToShop: 'Войдите, чтобы купить',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  badges: ['Дерматологически протестировано', 'Сделано в Корее', 'Полноразмерные средства', 'Роллер в комплекте'],
  stats: [
    { value: '4', label: 'Предмета в одной коробке' },
    { value: '2%', label: 'Арбутин в сыворотке и креме' },
    { value: '2%', label: 'Ниацинамид в патчах' },
    { value: '0,25 мм', label: 'Роллер для глаз, 60 игл' },
  ],
  concern: {
    eyebrow: 'Создан для зоны вокруг глаз',
    title: 'Тёмные круги, мешки и гусиные лапки: уход сразу за всем.',
    body: 'Кожа вокруг глаз первой выдаёт короткую ночь. Набор отвечает слоями: осветляющий арбутин и аденозин против морщин в сыворотке и креме, ниацинамид в охлаждающих успокаивающих патчах и тонкий роллер, созданный для изгиба под глазом.',
    points: [
      'Более светлая кожа под глазами',
      'Более гладкие гусиные лапки',
      'Менее заметные мешки',
      'Успокоенная, увлажнённая кожа',
    ],
  },
  contents: {
    eyebrow: 'Что в коробке',
    title: 'Три полноразмерные формулы и роллер, созданный для них.',
    intro:
      'Сыворотка, крем и патчи те же, что продаются на своих страницах, в полном объёме. Набор дополняет роллер для глаз 0,25 мм: цельный корпус, 60 тонких игл, форма под контур глаза.',
    items: [
      {
        id: 'serum',
        title: 'EyeCell EYE CONTOUR SERUM',
        productNumber: '17',
        quantity: 1,
        step: 'Первый слой',
        body: 'Интенсивная несмываемая сыворотка для тёмных кругов, припухлости и глубоких морщин. Арбутин 2% осветляет, аденозин 0,04% разглаживает, а тонкий металлический носик наносит её точно по контуру. Роллер идёт поверх.',
        facts: ['10 мл', 'Арбутин 2%', 'Аденозин 0,04%', 'Не смывать'],
      },
      {
        id: 'roller',
        title: 'GENOSYS EYE ROLLER',
        quantity: 1,
        step: 'Поверх сыворотки',
        body: 'Цельный роллер 0,25 мм, 60 тонких игл под нежный изгиб вокруг глаза. Прокатывайте его легко поверх сыворотки, горизонтально и вертикально, не касаясь глаз и губ.',
        facts: ['0,25 мм', '60 игл', 'Цельный', 'Многоразовый'],
        image: ROLLER_IMAGE,
      },
      {
        id: 'patch',
        title: 'EyeCell EYE PEPTIDE GEL PATCH',
        productNumber: '33',
        quantity: 1,
        step: 'После роллера',
        body: 'Охлаждающие гидрогелевые полумесяцы под глаза или на надбровные дуги для более полного ухода. Ниацинамид 2% и аденозин 0,04% работают, пока вы отдыхаете 20-40 минут; затем снимите патчи и вбейте остатки эссенции.',
        facts: ['101 г / 60 шт', 'Ниацинамид 2%', 'Аденозин 0,04%', '20-40 мин'],
      },
      {
        id: 'cream',
        title: 'EyeCell EYE CONTOUR CREAM',
        productNumber: '24',
        quantity: 1,
        step: 'Финальный слой',
        body: 'Финальный слой. Те же арбутин 2% и аденозин 0,04%, что и в сыворотке, плюс сквалан 2,5% и масло жожоба 2% для мягкости и комфорта. Содержит арахисовое масло, масло цедры апельсина и лимонен.',
        facts: ['20 г', 'Арбутин 2%', 'Аденозин 0,04%', 'Содержит арахисовое масло'],
      },
    ],
    eanLabel: 'Штрихкод',
    each: 'за штуку',
    viewItem: 'Открыть этот продукт',
    kitOnly: 'Продаётся и отдельно',
    boughtSeparately: 'Сыворотка, крем и патчи по отдельности',
    inThisBox: 'Этот набор',
    youSave: 'Вы экономите',
    againstSeparate: 'по сравнению с тремя средствами по отдельности',
    seeBreakdown: 'Смотреть расчёт',
    savingNote:
      'Отдельная сумма считается по ценам сыворотки, крема и патчей на их страницах. Роллер для глаз идёт сверху и в расчёт не входит.',
  },
  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Четыре шага, один спокойный ритуал.',
    intro: 'Очищение, сыворотка и мягкий роллер, патчи на 20-40 минут и крем в завершение.',
    steps: [
      {
        title: 'Очистите контур глаз',
        body: 'Снимите макияж, бережно очистите кожу и промокните насухо, чтобы сыворотка легла на чистую кожу.',
      },
      {
        title: 'Сыворотка, затем роллер',
        body: 'Распределите сыворотку под глазами и под бровями. В течение нескольких минут прокатывайте роллер 0,25 мм поверх неё горизонтально и вертикально, легко и не касаясь глаз.',
      },
      {
        title: 'Патчи на 20-40 минут',
        body: 'Два полумесяца под глаза и, по желанию, ещё два на надбровные дуги. Отдохните, через 20-40 минут снимите и вбейте остатки эссенции.',
      },
      {
        title: 'Крем в завершение',
        body: 'Небольшое количество крема для контура глаз, мягко вбейте кончиками пальцев.',
      },
    ],
    note: 'Не используйте роллер при склонности к келоидным рубцам, аллергии на нержавеющую сталь, дерматите или на повреждённой коже. Крем содержит арахисовое масло. Не используйте набор во время беременности и грудного вскармливания.',
    videoTitle: 'Ритуал на видео',
  },
  roller: {
    eyebrow: 'Роллер для глаз',
    title: '0,25 мм, созданный для зоны вокруг глаз.',
    body: 'Шестьдесят тонких игл на маленьком цельном барабане, под тонкую кожу под глазом и вдоль надбровной дуги. Он легко скользит по сыворотке и после ухода возвращается в коробку.',
    points: [
      'Поверх сыворотки, горизонтально и вертикально, несколько минут',
      'Без нажима, не касаясь глаз и губ',
      'Перед каждым повторным применением выдержите 5 минут в растворе хлоргексидина',
      'Только для вас: никому не передавайте',
    ],
    aside: 'Пропустите роллер при склонности к келоидным рубцам, аллергии на нержавеющую сталь, дерматите или повреждённой коже и используйте три формулы отдельно.',
  },
  evidence: {
    eyebrow: 'Что работает',
    title: 'Две проверенные пары и тонкий роллер.',
    intro:
      'Арбутин, ниацинамид и аденозин признаны в Корее функциональными ингредиентами для осветления и ухода за морщинами, и каждая формула содержит их в концентрациях, установленных для функциональной косметики.',
    cards: [
      {
        value: '2% + 0,04%',
        title: 'Сыворотка и крем',
        body: 'Арбутин 2% для более светлой кожи под глазами и аденозин 0,04% для более гладких морщин, в обоих несмываемых слоях.',
      },
      {
        value: '2% + 0,04%',
        title: 'Патчи',
        body: 'Ниацинамид 2% и аденозин 0,04% в охлаждающем гидрогеле, который остаётся на коже 20-40 минут, пока вы отдыхаете.',
      },
      {
        value: '0,25 мм',
        title: 'Роллер для глаз',
        body: 'Шестьдесят тонких игл на цельном барабане для контура глаз. Лёгкие движения поверх сыворотки несколько минут, затем патчи.',
      },
    ],
    footnote: 'Набор дерматологически протестирован и произведён в Корее компанией DTS MG.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Весь ритуал или отдельные средства.',
    forTitle: 'Этот набор для вас, если',
    forList: [
      'Хотите сыворотку, роллер, патчи и крем в одной коробке',
      'Хотите поработать с тёмными кругами, мешками или гусиными лапками',
      'Любите домашний ритуал, который легко повторять шаг за шагом',
    ],
    notForTitle: 'Выберите другое, если',
    notForList: [
      'Вы беременны или кормите грудью: в этот период набор не используют',
      'У вас аллергия на арахис: в креме арахисовое масло',
      'Склонность к келоидным рубцам, аллергия на металл или дерматит: пропустите роллер или возьмите три средства отдельно',
      'Нужно только одно средство: откройте его страницу',
      'Хотите прокатывать всё лицо: для этого есть лицевой роллер',
    ],
    alternativesLabel: 'Средства по отдельности и лицевой роллер',
    alternatives: [
      { productNumber: '17', label: 'Сыворотка EyeCell для контура глаз' },
      { productNumber: '24', label: 'Крем EyeCell для контура глаз' },
      { productNumber: '33', label: 'Гелевые патчи EyeCell для глаз' },
      { productNumber: '1', label: 'Лицевой микроигольчатый роллер' },
    ],
    note: 'Крем содержит масло цедры апельсина и лимонен, а патчи - отдушку. Не допускайте попадания средств в глаза.',
  },
  details: {
    eyebrow: 'Коротко',
    title: 'Всё, что в коробке.',
    rows: [
      { label: 'Форма', value: 'Набор из четырёх предметов для зоны вокруг глаз' },
      { label: 'Размер', value: '1 коробка' },
      { label: 'Состав', value: 'Сыворотка 10 мл, крем 20 г, гелевые патчи 101 г / 60 шт, роллер для глаз 0,25 мм' },
      { label: 'Функция', value: 'Против морщин, мешков и тёмных кругов, успокоение' },
      { label: 'Производитель', value: 'DTS MG, Южная Корея' },
      { label: 'Тест', value: 'Дерматологически протестировано' },
      { label: 'Осторожно', value: 'Не использовать при беременности и кормлении грудью. В креме арахисовое масло' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  faq: {
    eyebrow: 'Перед покупкой',
    title: 'Вопросы о наборе.',
    items: [
      {
        q: 'Что я получаю по сравнению с покупкой по отдельности?',
        a: 'Полный ритуал EyeCell в одной коробке дешевле, чем сыворотка, крем и патчи по отдельности, плюс роллер для глаз 0,25 мм в придачу.',
      },
      {
        q: 'Роллер для глаз и лицевой роллер - это одно и то же?',
        a: 'Нет. Лицевой роллер стерильный и одноразовый, для всего лица, с пятью длинами игл. Здесь цельный роллер 0,25 мм на 60 игл для зоны вокруг глаз, который можно использовать повторно после дезинфекции.',
      },
      {
        q: 'Сколько держать патчи?',
        a: '20-40 минут, затем снимите их и вбейте остатки эссенции. Не оставляйте на ночь.',
      },
      {
        q: 'Как ухаживать за роллером?',
        a: 'Перед каждым повторным применением выдерживайте его 5 минут в растворе хлоргексидина и никому не передавайте.',
      },
      {
        q: 'Можно ли при беременности?',
        a: 'Во время беременности и грудного вскармливания набор не используют. Крем также содержит ретинилпальмитат. Перед любым уходом за зоной вокруг глаз в этот период посоветуйтесь с врачом.',
      },
      {
        q: 'Есть ли арахисовое масло?',
        a: 'Да, в креме: Arachis Hypogaea (Peanut) Oil. При аллергии на арахис выберите сыворотку и патчи отдельно.',
      },
      {
        q: 'Это без отдушки?',
        a: 'Нет. В креме масло цедры апельсина и лимонен, в патчах отдушка.',
      },
      {
        q: 'Можно купить средства отдельно?',
        a: 'У сыворотки, крема и патчей есть свои страницы, как и у роллера для глаз 0,25 мм.',
      },
    ],
  },
}

const BY_LOCALE: Record<EyeKitLocale, EyeKitCopy> = { en: EN, ar: AR, ru: RU }

export function getEyeKitCopy(locale: string): EyeKitCopy {
  return BY_LOCALE[(locale as EyeKitLocale) in BY_LOCALE ? (locale as EyeKitLocale) : 'en']
}
