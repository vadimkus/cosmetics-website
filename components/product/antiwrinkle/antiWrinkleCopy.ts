/**
 * Bespoke copy for MULTI FUNCTIONAL ANTI-WRINKLE SERUM (product 22).
 *
 * SOURCING — every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_22_ANTI_WRINKLE_SERUM_SOURCE_AUDIT.md:
 *   - DTS MG signed formula: glycerin 25.45%, niacinamide 2.00%, bakuchiol
 *     0.100%, betaine 0.50%, allantoin and panthenol 0.100% each, adenosine
 *     0.040%, lavender oil 0.0186% with linalool 0.0114%, and six peptides
 *     totalling roughly 1.4 ppm.
 *   - EU safety assessment (QACS Lab, ID 24 06 00721, 46 pages): the branded
 *     raw materials and their suppliers, and a Dr Koziej patch test graded
 *     "Non Irritant".
 *   - COA lot OE002: pH 6.78, 30.17 ml, under 10 cfu/ml, three pathogens not
 *     detected, niacinamide assayed at 96.72% and adenosine at 101.00%.
 *   - Dhaliwal et al., Br J Dermatol 2019;180(2):289-296, verified from the
 *     journal, for the bakuchiol concentration behind the retinol comparison.
 *
 * THE SHAPE OF THIS PAGE. Nothing here is fabricated; the problem is
 * proportion. A quarter of the bottle is glycerin and the site never mentioned
 * it, while the description led on a peptide complex present at about 1.4 parts
 * per million. So the page leads on the humectant load and the niacinamide, then
 * handles bakuchiol precisely, then credits the peptide sourcing while giving
 * the real numbers.
 *
 * BAKUCHIOL. Present at 0.100%, which reads like a dose. The retinol-equivalence
 * study everyone cites used 0.5% twice daily. State both figures; do not repeat
 * the equivalence claim as though it applied here, and do not pretend the
 * ingredient is absent.
 *
 * MUST STAY OUT:
 *   - The P&K clinical study. The citation is specific but we hold no report,
 *     so no result from it appears anywhere.
 *   - Mechanisms for the six peptides, the ceramide liposome, collagen, elastin
 *     or propolis. All between 0.05 and 10 ppm.
 *   - "Mango seed butter" (deck slide 3) — not in the formula at all.
 *   - "Safe without side effects" and the acne claims from deck slide 5.
 *   - The contract manufacturer's name, and the lot code.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface AntiWrinkleCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]

  addToBag: string
  adding: string
  added: string
  inBag: string
  viewBag: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string

  stats: Array<{ value: string; label: string }>

  glycerin: {
    eyebrow: string
    title: string
    body: string
    aside: string
  }

  bakuchiol: {
    eyebrow: string
    title: string
    body: string
    rows: Array<{ label: string; value: string; note: string }>
    verdict: string
  }

  peptides: {
    eyebrow: string
    title: string
    intro: string
    columns: { brand: string; supplier: string; peptide: string; amount: string }
    rows: Array<{ brand: string; supplier: string; peptide: string; amount: string }>
    note: string
  }

  working: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  quality: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    patch: string
  }

  fragrance: {
    eyebrow: string
    title: string
    body: string
  }

  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }

  inci: {
    eyebrow: string
    title: string
    intro: string
    fullInci: string
    fullInciNote: string
  }

  safety: {
    eyebrow: string
    title: string
    points: string[]
    note: string
  }

  spec: {
    eyebrow: string
    title: string
    rows: Array<{ label: string; value: string }>
  }

  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string }>
  }

  backToProducts: string
}

const EN: AntiWrinkleCopy = {
  eyebrow: 'Multi Functional Anti-Wrinkle Serum · 30 ml',
  headline: 'A quarter of this bottle is glycerin. That is the good news.',
  subheadline:
    'The label sells a six-peptide complex. The formula sells something more useful: glycerin at 25.45%, niacinamide at 2%, betaine, panthenol and allantoin, with adenosine at the dose Korea licenses for wrinkle improvement and bakuchiol at 0.1%. It is a serious humectant serum with two real actives in it, and it was never described that way.',
  heroBullets: [
    'Glycerin 25.45% — the second ingredient, and the largest by far',
    'Niacinamide 2%, measured at 96.72% of declaration on the batch',
    'Adenosine 0.04%, measured at 101% — the licensed wrinkle dose',
    'Patch tested and graded Non Irritant, not merely "tested"',
  ],
  badges: ['Made in Korea', '30 ml', 'EU safety assessed', 'Graded Non Irritant'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '25.45%', label: 'Glycerin — a quarter of the bottle' },
    { value: '2%', label: 'Niacinamide, assayed at 96.72%' },
    { value: '0.04%', label: 'Adenosine, assayed at 101%' },
    { value: '30.17', label: 'Millilitres in a 30 ml bottle' },
  ],

  glycerin: {
    eyebrow: 'Start with the biggest number',
    title: 'The ingredient nobody mentioned',
    body:
      'Glycerin sits second on this ingredient list at 25.45%, sourced as a branded pharmaceutical grade. A quarter of what you are buying is a humectant, and the certificate of analysis backs it: specific gravity 1.0689, which is what a bottle that heavy with glycerin weighs. Add betaine at 0.5% and panthenol at 0.1% and you have a serum whose primary job is pulling water into the top layers of skin and holding it there.',
    aside:
      'In Gulf air that is not a small thing. Skin that is holding water looks smoother and fuller within minutes, and lines look shallower because they are plumped rather than because anything has been remodelled. It is the most immediate effect this serum has, and until now it was the one thing the page did not say.',
  },

  bakuchiol: {
    eyebrow: 'Now the honest bit',
    title: 'Bakuchiol, at 0.1%',
    body:
      'This serum is positioned on bakuchiol as a natural alternative to retinol, and there is a good study behind that comparison. It is worth reading the numbers side by side before you decide what to expect.',
    rows: [
      {
        label: 'In this serum',
        value: '0.100%',
        note: 'Straight off the manufacturer\u2019s quantitative formula. Real, and present at a level that reads like a dose.',
      },
      {
        label: 'In the study',
        value: '0.5%, twice daily',
        note: 'Dhaliwal and colleagues, British Journal of Dermatology 2019: 44 patients, 12 weeks, randomised and double-blind, bakuchiol 0.5% cream twice daily against retinol 0.5% nightly.',
      },
      {
        label: 'What the study found',
        value: 'No significant difference',
        note: 'Both reduced wrinkle surface area and pigmentation, with retinol causing more scaling and stinging. Good evidence — for 0.5%, which is five times what is in this bottle.',
      },
    ],
    verdict:
      'So: bakuchiol is genuinely here, it is photostable and gentle in a way retinol is not, and it is a sensible ingredient to put in a daytime serum. But the head-to-head-with-retinol result belongs to a concentration five times higher, and we are not going to borrow it. Buy this for the humectant load and the niacinamide, and treat the bakuchiol as a welcome extra rather than the reason.',
  },

  peptides: {
    eyebrow: 'Credit where it is due',
    title: 'Excellent peptides, in very small amounts',
    intro:
      'The safety assessment names the raw materials, and somebody chose well — these are respected, expensive actives from Sederma, DSM and Corum, not commodity substitutes. Each was bought in at 0.1% of the formula, which is what the concentrations in the right-hand column work out to.',
    columns: { brand: 'Raw material', supplier: 'Supplier', peptide: 'Peptide', amount: 'In the bottle' },
    rows: [
      { brand: 'Syn-Coll', supplier: 'DSM', peptide: 'Palmitoyl Tripeptide-5', amount: '1.1 ppm' },
      { brand: 'Matrixyl 3000', supplier: 'Sederma', peptide: 'Palmitoyl Tripeptide-1', amount: '0.1 ppm' },
      { brand: 'Matrixyl 3000', supplier: 'Sederma', peptide: 'Palmitoyl Tetrapeptide-7', amount: '0.08 ppm' },
      { brand: 'Elastyl', supplier: 'Corum', peptide: 'Palmitoyl Hexapeptide-12', amount: '0.1 ppm' },
      { brand: 'AH PEP 50', supplier: 'Danjoungbio', peptide: 'Acetyl Hexapeptide-8', amount: '0.05 ppm' },
      { brand: '—', supplier: '—', peptide: 'Dipeptide-2', amount: '0.1 ppm' },
    ],
    note:
      'Six peptides, about 1.4 parts per million between them. The same applies to the ceramide, cholesterol and phytosphingosine sold as a barrier liposome — 0.1 ppm each — and to the collagen, elastin and propolis. They are on the ingredient list and they are not what this serum does. We would rather tell you that than describe six mechanisms you cannot get from a millionth of a gram.',
  },

  working: {
    eyebrow: 'The working formula',
    title: 'What is actually at a dose',
    intro:
      'Five ingredients do the work in this bottle, and two of them were measured on the batch rather than merely declared.',
    items: [
      {
        name: 'Glycerin',
        dose: '25.45%',
        body: 'The humectant that makes this a serum rather than a claim. Backed by a specific gravity of 1.0689 on the certificate.',
      },
      {
        name: 'Niacinamide',
        dose: '2.00%',
        body: 'Vitamin B3 at a genuinely useful level, for uneven tone and barrier support. Assayed on the batch at 96.72% of declaration.',
      },
      {
        name: 'Adenosine',
        dose: '0.04%',
        body: 'The exact dose Korea licenses for wrinkle improvement, and the only anti-wrinkle active here with a regulatory threshold behind it. Assayed at 101%.',
      },
      {
        name: 'Betaine',
        dose: '0.50%',
        body: 'A second humectant, and a gentle one — it works alongside the glycerin rather than duplicating it.',
      },
      {
        name: 'Allantoin and panthenol',
        dose: '0.10% each',
        body: 'Both at working levels, both there for comfort and barrier support rather than for a headline.',
      },
    ],
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea, released against a written specification, and assessed under European cosmetics law in a 46-page dossier.',
    rows: [
      { label: 'pH', value: '6.78 at 25 °C, inside a 5.60–7.60 specification' },
      { label: 'Fill', value: '30.17 ml against a 30 ml declaration' },
      { label: 'Specific gravity', value: '1.0689 — the weight of a quarter-glycerin serum' },
      { label: 'Niacinamide', value: 'Assayed at 96.72% of the declared 2%' },
      { label: 'Adenosine', value: 'Assayed at 101.00% of the declared 0.04%' },
      { label: 'Purity', value: 'Under 10 cfu/ml, against a permitted 100' },
      { label: 'Pathogens', value: 'S. aureus, P. aeruginosa and C. albicans — all not detected' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
    ],
    patch:
      'The dermatological patch test behind the "dermatologically tested" line came back graded Non Irritant rather than simply passing, which is a stronger result and worth the distinction. The assessor notes the volunteer count is small, so read it as reassurance about the formula rather than proof about your skin.',
  },

  fragrance: {
    eyebrow: 'If you screen your ingredients',
    title: 'It is scented, with lavender',
    body:
      'Lavender oil at 0.0186%, with linalool listed separately at 0.0114% because European law requires that allergen to be named. It is an essential oil rather than a synthetic perfume, and the amount is small, but if you avoid fragrance or react to linalool specifically then it is here and you should know before you open the box rather than after. Our Blemish Balm Cream is the fragrance-free option if that is the deciding factor.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Onto damp skin, then seal it',
    frequency: 'Morning and evening · after cleansing, before moisturiser',
    steps: [
      {
        title: 'Apply to skin that is still damp',
        body: 'This matters more here than with most serums. A quarter-glycerin formula works by holding water, so give it water to hold — press it on within a minute of cleansing rather than onto a dry face.',
      },
      {
        title: 'Three or four drops, pressed not rubbed',
        body: 'Warm it between your fingertips and press it over the face and neck. Rubbing a viscous humectant just moves it around.',
      },
      {
        title: 'Follow with a moisturiser',
        body: 'Glycerin pulls water in; an occlusive layer over the top stops it leaving again. Without that second step a humectant serum can leave skin feeling tighter in dry air, not softer.',
      },
      {
        title: 'Both ends of the day',
        body: 'Unlike retinol, bakuchiol is photostable, so there is no reason to keep this to the evening. Wear sunscreen over it in the morning regardless.',
      },
    ],
    note:
      'It layers under anything. There are no acids, no retinoids and no exfoliants in the formula, so it does not compete with the rest of a routine.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the bottle',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the box in your hand.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Contains lavender oil and declared linalool. Patch test if you react to fragrance.',
      'For external use only. Avoid the eyes and mucous membranes, and rinse thoroughly with cool water on contact.',
      'Stop and see a doctor if redness, swelling or irritation appears.',
      'Assessed as safe under EC Regulation 1223/2009 and graded Non Irritant on patch test.',
      'If you are pregnant, ask your doctor before starting any new active — bakuchiol is not retinol, but that conversation is theirs to have with you.',
      'Store cool and dry, out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS box, plus the fragrance disclosure from the quantitative formula.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '30 ml' },
      { label: 'Texture', value: 'Opaque, light yellow to white, viscous serum' },
      { label: 'Actives at dose', value: 'Glycerin 25.45%, niacinamide 2.00%, adenosine 0.04%, betaine 0.50%' },
      { label: 'Bakuchiol', value: '0.100% — one fifth of the concentration in the retinol comparison study' },
      { label: 'Peptides', value: 'Six, roughly 1.4 ppm combined, from Sederma, DSM and Corum materials' },
      { label: 'Fragranced', value: 'Yes — lavender oil 0.0186%, with linalool declared' },
      { label: 'pH', value: '5.60–7.60 (6.78 on the batch tested)' },
      { label: 'Assessment', value: 'EU safety assessment; patch test graded Non Irritant' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Is the bakuchiol enough to work like retinol?',
        a: 'Not at the level the famous comparison was run at. That study used 0.5% twice daily; this serum has 0.100%. Bakuchiol is still a sensible, photostable, well-tolerated ingredient and it is genuinely in here — but if you are buying specifically to replace a retinoid, this is not the concentration to do it with, and we would rather say so.',
      },
      {
        q: 'So what does it actually do?',
        a: 'It hydrates hard. A quarter of the bottle is glycerin, with betaine and panthenol alongside, so skin looks plumper and lines look shallower while it is holding water. On top of that you get niacinamide at 2% for tone and barrier, and adenosine at the exact dose Korea licenses for wrinkle improvement. Those are real and both were measured on the batch.',
      },
      {
        q: 'Why list six peptides if they are at parts per million?',
        a: 'Because they are in the formula and we would rather show you the numbers than hide them. Worth knowing that the raw materials are the good ones — Matrixyl 3000 from Sederma, Syn-Coll from DSM, Elastyl from Corum — bought in at 0.1% each. Somebody chose well and then used very little. Do not buy this bottle for the peptides.',
      },
      {
        q: 'Can I use it in the morning?',
        a: 'Yes, and that is one of bakuchiol\u2019s genuine advantages over retinol — it is photostable, so it does not need to be an evening-only product. Apply to damp skin, follow with moisturiser, then sunscreen.',
      },
      {
        q: 'Does it have a fragrance?',
        a: 'Yes. Lavender oil at 0.0186%, with linalool declared separately as an allergen at 0.0114%. Small amounts of a natural essential oil rather than a synthetic perfume, but it is there. If fragrance is the deciding factor, our Blemish Balm Cream is fragrance-free.',
      },
      {
        q: 'Will it sting or peel?',
        a: 'It should not. There are no acids, no retinoids and no exfoliants in the formula, and the patch test came back graded Non Irritant rather than merely passing. The one thing to watch is the lavender, and the one thing to get right is following it with a moisturiser so the glycerin has something to hold the water under.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: AntiWrinkleCopy = {
  eyebrow: 'سيروم متعدد الوظائف لمكافحة التجاعيد · 30 مل',
  headline: 'ربع هذه العبوة غليسرين. وهذا هو الخبر الجيد.',
  subheadline:
    'الملصق يبيع مركّباً من ستة ببتيدات. والتركيبة تبيع شيئاً أنفع: غليسرين بنسبة 25.45%، ونياسيناميد بنسبة 2%، وبيتايين وبانثينول وألانتوين، مع أدينوزين بالجرعة التي ترخّصها كوريا لتحسين التجاعيد، وباكوتشيول بنسبة 0.1%. إنه سيروم مرطّب جدّي بفعّالَين حقيقيَّين، ولم يوصف قط بهذه الطريقة.',
  heroBullets: [
    'غليسرين 25.45% — المكوّن الثاني، والأكبر بفارق كبير',
    'نياسيناميد 2%، مقيس عند 96.72% من المعلن على الدفعة',
    'أدينوزين 0.04%، مقيس عند 101% — جرعة التجاعيد المرخّصة',
    'مختبر باللصقة ومصنّف «غير مهيّج»، لا «مختبر» فحسب',
  ],
  badges: ['صُنع في كوريا', '30 مل', 'تقييم سلامة أوروبي', 'مصنّف غير مهيّج'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '25.45%', label: 'غليسرين — ربع العبوة' },
    { value: '2%', label: 'نياسيناميد، مقيس عند 96.72%' },
    { value: '0.04%', label: 'أدينوزين، مقيس عند 101%' },
    { value: '30.17', label: 'مليلتر في عبوة 30 مل' },
  ],

  glycerin: {
    eyebrow: 'ابدئي من أكبر رقم',
    title: 'المكوّن الذي لم يذكره أحد',
    body:
      'الغليسرين يأتي ثانياً في قائمة المكوّنات بنسبة 25.45%، ومصدره درجة صيدلانية ذات علامة. أي أن ربع ما تشترينه مرطّب جاذب للماء، وشهادة التحليل تؤكّده: كثافة نوعية 1.0689، وهي وزن عبوة بهذا القدر من الغليسرين. أضيفي بيتايين بنسبة 0.5% وبانثينول بنسبة 0.1% وسيكون لديك سيروم مهمّته الأولى جذب الماء إلى الطبقات العليا من البشرة والاحتفاظ به هناك.',
    aside:
      'وفي هواء الخليج هذا ليس أمراً هيّناً. فالبشرة الممتلئة بالماء تبدو أنعم وأكثر امتلاءً في دقائق، وتبدو الخطوط أقلّ عمقاً لأنها ممتلئة لا لأن شيئاً أُعيد بناؤه. وهذا هو الأثر الأسرع لهذا السيروم، وحتى الآن كان الشيء الوحيد الذي لم تقله الصفحة.',
  },

  bakuchiol: {
    eyebrow: 'وأمّا الجزء الصريح',
    title: 'الباكوتشيول، بنسبة 0.1%',
    body:
      'يُقدَّم هذا السيروم على أساس الباكوتشيول كبديل طبيعي للريتينول، وثمّة دراسة جيدة خلف تلك المقارنة. ويستحق الأمر قراءة الأرقام جنباً إلى جنب قبل أن تقرّري ما تتوقّعينه.',
    rows: [
      {
        label: 'في هذا السيروم',
        value: '0.100%',
        note: 'مأخوذ مباشرة من التركيبة الكمّية للشركة. حقيقي، وموجود بمستوى يُقرأ كجرعة.',
      },
      {
        label: 'في الدراسة',
        value: '0.5%، مرتين يومياً',
        note: 'دالِيوال وزملاؤه، المجلة البريطانية للأمراض الجلدية 2019: 44 مريضاً، 12 أسبوعاً، عشوائية ومزدوجة التعمية، كريم باكوتشيول 0.5% مرتين يومياً مقابل ريتينول 0.5% ليلاً.',
      },
      {
        label: 'ما وجدته الدراسة',
        value: 'لا فرق ذا دلالة',
        note: 'كلاهما خفّض مساحة التجاعيد والتصبّغ، مع تسبّب الريتينول في مزيد من التقشّر واللسع. دليل جيد — لنسبة 0.5%، أي خمسة أضعاف ما في هذه العبوة.',
      },
    ],
    verdict:
      'إذن: الباكوتشيول موجود فعلاً، وهو ثابت ضوئياً ولطيف بطريقة لا يكون الريتينول عليها، وهو مكوّن منطقي في سيروم نهاري. لكن نتيجة المقارنة المباشرة مع الريتينول تنتمي إلى تركيز أعلى بخمس مرات، ولن نستعيرها. اشتريه من أجل حمل المرطّبات والنياسيناميد، واعتبري الباكوتشيول إضافة مرحّباً بها لا السبب.',
  },

  peptides: {
    eyebrow: 'الفضل لأهله',
    title: 'ببتيدات ممتازة، بكميات صغيرة جداً',
    intro:
      'تقييم السلامة يسمّي المواد الأولية، وقد أحسن أحدهم الاختيار — فهذه فعّالات محترمة وباهظة من Sederma وDSM وCorum، لا بدائل تجارية. وقد أُدخلت كل منها بنسبة 0.1% من التركيبة، وهذا ما تعنيه التراكيز في العمود الأيمن.',
    columns: { brand: 'المادة الأولية', supplier: 'المورّد', peptide: 'الببتيد', amount: 'في العبوة' },
    rows: [
      { brand: 'Syn-Coll', supplier: 'DSM', peptide: 'Palmitoyl Tripeptide-5', amount: '1.1 ppm' },
      { brand: 'Matrixyl 3000', supplier: 'Sederma', peptide: 'Palmitoyl Tripeptide-1', amount: '0.1 ppm' },
      { brand: 'Matrixyl 3000', supplier: 'Sederma', peptide: 'Palmitoyl Tetrapeptide-7', amount: '0.08 ppm' },
      { brand: 'Elastyl', supplier: 'Corum', peptide: 'Palmitoyl Hexapeptide-12', amount: '0.1 ppm' },
      { brand: 'AH PEP 50', supplier: 'Danjoungbio', peptide: 'Acetyl Hexapeptide-8', amount: '0.05 ppm' },
      { brand: '—', supplier: '—', peptide: 'Dipeptide-2', amount: '0.1 ppm' },
    ],
    note:
      'ستة ببتيدات، بنحو 1.4 جزء من المليون مجتمعة. وينطبق الأمر نفسه على السيراميد والكوليسترول والفيتوسفينغوزين المبيعة كليبوسوم للحاجز — 0.1 جزء من المليون لكل منها — وعلى الكولاجين والإيلاستين والبروبوليس. هي على قائمة المكوّنات وليست ما يفعله هذا السيروم. ونفضّل إخبارك بذلك على وصف ستّ آليات لا يمكنك الحصول عليها من جزء من مليون من الغرام.',
  },

  working: {
    eyebrow: 'التركيبة العاملة',
    title: 'ما هو فعلاً بجرعة',
    intro:
      'خمسة مكوّنات تؤدّي العمل في هذه العبوة، واثنان منها قيسا على الدفعة لا مجرّد إعلان.',
    items: [
      {
        name: 'Glycerin',
        dose: '25.45%',
        body: 'المرطّب الذي يجعل هذا سيروماً لا ادعاءً. وتؤكّده كثافة نوعية 1.0689 على الشهادة.',
      },
      {
        name: 'Niacinamide',
        dose: '2.00%',
        body: 'فيتامين B3 بمستوى نافع فعلاً، لتفاوت اللون ودعم الحاجز. مقيس على الدفعة عند 96.72% من المعلن.',
      },
      {
        name: 'Adenosine',
        dose: '0.04%',
        body: 'الجرعة التي ترخّصها كوريا لتحسين التجاعيد تحديداً، وهي الفعّال الوحيد هنا الذي له عتبة تنظيمية خلفه. مقيس عند 101%.',
      },
      {
        name: 'Betaine',
        dose: '0.50%',
        body: 'مرطّب ثانٍ، ولطيف — يعمل مع الغليسرين لا يكرّره.',
      },
      {
        name: 'Allantoin و Panthenol',
        dose: '0.10% لكل منهما',
        body: 'كلاهما بمستوى فعّال، وكلاهما للراحة ودعم الحاجز لا لعنوان دعائي.',
      },
    ],
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما تقوله الشهادة',
    intro:
      'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة، وقُيّم وفق قانون مستحضرات التجميل الأوروبي في ملف من 46 صفحة.',
    rows: [
      { label: 'الحموضة', value: '6.78 عند 25 درجة، ضمن مواصفة 5.60–7.60' },
      { label: 'التعبئة', value: '30.17 مل مقابل 30 مل معلنة' },
      { label: 'الكثافة النوعية', value: '1.0689 — وزن سيروم ربعه غليسرين' },
      { label: 'النياسيناميد', value: 'مقيس عند 96.72% من الـ 2% المعلنة' },
      { label: 'الأدينوزين', value: 'مقيس عند 101.00% من الـ 0.04% المعلنة' },
      { label: 'النقاء', value: 'أقل من 10 وحدات/مل، مقابل 100 مسموحة' },
      { label: 'الممرضات', value: 'المكوّرة العنقودية والزائفة والمبيضّات — كلها غير مكتشفة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات مغلقاً، وتاريخ الانتهاء على العلبة' },
    ],
    patch:
      'اختبار اللصقة الجلدي الذي يقف خلف عبارة «مختبر جلدياً» عاد مصنّفاً «غير مهيّج» لا مجرّد ناجح، وهذه نتيجة أقوى تستحق التمييز. ويلاحظ المقيّم أن عدد المتطوّعين صغير، فاقرئيها كطمأنة بشأن التركيبة لا كبرهان بشأن بشرتك.',
  },

  fragrance: {
    eyebrow: 'إن كنتِ تفحصين المكوّنات',
    title: 'إنه معطّر، باللافندر',
    body:
      'زيت اللافندر بنسبة 0.0186%، مع اللينالول مذكوراً منفصلاً بنسبة 0.0114% لأن القانون الأوروبي يوجب ذكر ذلك المسبّب. وهو زيت عطري لا عطر صناعي، والكمية صغيرة، لكن إن كنتِ تتجنّبين العطر أو تتفاعلين مع اللينالول تحديداً فهو موجود وينبغي أن تعرفي قبل فتح العلبة لا بعده. وكريم البلسم للعيوب لدينا هو الخيار الخالي من العطر إن كان ذلك هو العامل الفاصل.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'على بشرة رطبة، ثم اختميه',
    frequency: 'صباحاً ومساءً · بعد التنظيف وقبل المرطّب',
    steps: [
      {
        title: 'ضعيه على بشرة ما زالت رطبة',
        body: 'هذا أهمّ هنا من معظم السيرومات. فتركيبة ربعها غليسرين تعمل بالاحتفاظ بالماء، فامنحيها ماءً تحتفظ به — اضغطيها خلال دقيقة من التنظيف لا على وجه جاف.',
      },
      {
        title: 'ثلاث أو أربع قطرات، بالضغط لا بالفرك',
        body: 'دفّئيها بين أطراف أصابعك واضغطيها على الوجه والرقبة. ففرك مرطّب لزج يحرّكه فقط.',
      },
      {
        title: 'اتبعيه بمرطّب',
        body: 'الغليسرين يجذب الماء؛ وطبقة عازلة فوقه تمنعه من المغادرة مرة أخرى. فبلا هذه الخطوة الثانية قد يترك سيروم مرطّب البشرة أكثر شدّاً في الهواء الجاف لا أنعم.',
      },
      {
        title: 'في طرفَي اليوم',
        body: 'بخلاف الريتينول، الباكوتشيول ثابت ضوئياً، فلا سبب لقصر هذا على المساء. وضعي واقي الشمس فوقه صباحاً على أي حال.',
      },
    ],
    note:
      'يمكن وضعه تحت أي شيء. فلا أحماض ولا ريتينويدات ولا مقشّرات في التركيبة، فهو لا ينافس بقية الروتين.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في العبوة',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'يحتوي زيت اللافندر واللينالول المعلن. اختبريه على بقعة إن كنتِ تتفاعلين مع العطر.',
      'للاستعمال الخارجي فقط. تجنّبي العينين والأغشية المخاطية، واشطفي جيداً بالماء البارد عند الملامسة.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'قُيّم آمناً وفق اللائحة EC 1223/2009 وصُنّف «غير مهيّج» في اختبار اللصقة.',
      'إن كنتِ حاملاً فاستشيري طبيبك قبل بدء أي فعّال جديد — فالباكوتشيول ليس ريتينولاً، لكن ذلك الحديث حديثهم معك.',
      'يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، مع إفصاح العطر من التركيبة الكمّية.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '30 مل' },
      { label: 'الملمس', value: 'سيروم لزج معتم، أصفر فاتح إلى أبيض' },
      { label: 'الفعّالات بجرعة', value: 'غليسرين 25.45%، نياسيناميد 2.00%، أدينوزين 0.04%، بيتايين 0.50%' },
      { label: 'الباكوتشيول', value: '0.100% — خُمس التركيز في دراسة مقارنة الريتينول' },
      { label: 'الببتيدات', value: 'ستة، نحو 1.4 جزء من المليون مجتمعة، من مواد Sederma وDSM وCorum' },
      { label: 'معطّر', value: 'نعم — زيت لافندر 0.0186%، مع اللينالول معلناً' },
      { label: 'الحموضة', value: '5.60–7.60 (6.78 على الدفعة المختبرة)' },
      { label: 'التقييم', value: 'تقييم سلامة أوروبي؛ اختبار لصقة مصنّف غير مهيّج' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل الباكوتشيول كافٍ ليعمل كالريتينول؟',
        a: 'ليس بالمستوى الذي أُجريت عليه المقارنة الشهيرة. فتلك الدراسة استخدمت 0.5% مرتين يومياً؛ وهذا السيروم فيه 0.100%. الباكوتشيول ما زال مكوّناً منطقياً وثابتاً ضوئياً وجيد التحمّل وهو موجود فعلاً هنا — لكن إن كنتِ تشترين تحديداً لتحلّ محلّ ريتينويد، فهذا ليس التركيز المناسب لذلك، ونفضّل قول ذلك.',
      },
      {
        q: 'فماذا يفعل فعلاً؟',
        a: 'يرطّب بقوة. ربع العبوة غليسرين، ومعه بيتايين وبانثينول، فتبدو البشرة أكثر امتلاءً وتبدو الخطوط أقلّ عمقاً وهي محتفظة بالماء. وفوق ذلك تحصلين على نياسيناميد بنسبة 2% للّون والحاجز، وأدينوزين بالجرعة التي ترخّصها كوريا تحديداً لتحسين التجاعيد. وهذان حقيقيان وقيسا كلاهما على الدفعة.',
      },
      {
        q: 'لماذا تُدرج ستة ببتيدات إن كانت بأجزاء من المليون؟',
        a: 'لأنها في التركيبة ونفضّل أن نعرض عليك الأرقام على أن نخفيها. ويستحق المعرفة أن المواد الأولية هي الجيدة — Matrixyl 3000 من Sederma وSyn-Coll من DSM وElastyl من Corum — أُدخلت بنسبة 0.1% لكل منها. أحسن أحدهم الاختيار ثم استخدم القليل جداً. لا تشتري هذه العبوة من أجل الببتيدات.',
      },
      {
        q: 'أستطيع استخدامه صباحاً؟',
        a: 'نعم، وهذه إحدى مزايا الباكوتشيول الحقيقية على الريتينول — فهو ثابت ضوئياً، ولا يحتاج أن يكون منتجاً مسائياً فقط. ضعيه على بشرة رطبة، واتبعيه بمرطّب، ثم واقي الشمس.',
      },
      {
        q: 'هل له عطر؟',
        a: 'نعم. زيت لافندر بنسبة 0.0186%، مع اللينالول معلناً منفصلاً كمسبّب حساسية بنسبة 0.0114%. كميات صغيرة من زيت عطري طبيعي لا عطر صناعي، لكنه موجود. وإن كان العطر هو العامل الفاصل، فكريم البلسم للعيوب لدينا خالٍ من العطر.',
      },
      {
        q: 'هل يلسع أو يقشّر؟',
        a: 'لا ينبغي. فلا أحماض ولا ريتينويدات ولا مقشّرات في التركيبة، وعاد اختبار اللصقة مصنّفاً «غير مهيّج» لا مجرّد ناجح. والشيء الوحيد الذي ينبغي مراقبته هو اللافندر، والشيء الوحيد الذي ينبغي إتقانه هو اتباعه بمرطّب ليكون للغليسرين ما يحتفظ بالماء تحته.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: AntiWrinkleCopy = {
  eyebrow: 'Мультифункциональная сыворотка против морщин · 30 мл',
  headline: 'Четверть этого флакона — глицерин. И это хорошая новость.',
  subheadline:
    'Этикетка продаёт комплекс из шести пептидов. Формула продаёт кое-что полезнее: глицерин 25,45%, ниацинамид 2%, бетаин, пантенол и аллантоин, плюс аденозин в дозе, под которую Корея лицензирует уменьшение морщин, и бакучиол 0,1%. Это серьёзная увлажняющая сыворотка с двумя настоящими активами, и так её ещё никто не описывал.',
  heroBullets: [
    'Глицерин 25,45% — второй ингредиент и крупнейший с большим отрывом',
    'Ниацинамид 2%, измерено 96,72% от заявленного в партии',
    'Аденозин 0,04%, измерено 101% — лицензионная доза для морщин',
    'Патч-тест с оценкой «не раздражает», а не просто «протестировано»',
  ],
  badges: ['Сделано в Корее', '30 мл', 'Оценка безопасности ЕС', 'Оценка: не раздражает'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '25,45%', label: 'Глицерина — четверть флакона' },
    { value: '2%', label: 'Ниацинамида, измерено 96,72%' },
    { value: '0,04%', label: 'Аденозина, измерено 101%' },
    { value: '30,17', label: 'Миллилитра во флаконе на 30 мл' },
  ],

  glycerin: {
    eyebrow: 'Начнём с самой большой цифры',
    title: 'Ингредиент, о котором никто не говорил',
    body:
      'Глицерин стоит вторым в этом составе, 25,45%, и закуплен как брендированная фармацевтическая марка. Четверть того, что вы покупаете, — увлажнитель, и сертификат это подтверждает: удельный вес 1,0689, ровно столько весит флакон с такой глицериновой загрузкой. Добавьте бетаин 0,5% и пантенол 0,1%, и получится сыворотка, чья первая задача — втягивать воду в верхние слои кожи и удерживать её там.',
    aside:
      'В воздухе Залива это немало. Кожа, удерживающая воду, выглядит ровнее и полнее уже через минуты, а линии кажутся мельче потому, что они наполнены, а не потому, что что-то перестроилось. Это самый быстрый эффект этой сыворотки, и до сих пор он был единственным, о чём страница молчала.',
  },

  bakuchiol: {
    eyebrow: 'А теперь честная часть',
    title: 'Бакучиол, 0,1%',
    body:
      'Эта сыворотка позиционируется на бакучиоле как натуральной альтернативе ретинолу, и за той сравнительной оценкой стоит хорошее исследование. Стоит прочитать цифры рядом друг с другом, прежде чем решать, чего ждать.',
    rows: [
      {
        label: 'В этой сыворотке',
        value: '0,100%',
        note: 'Прямо из количественной формулы производителя. Настоящий и присутствует на уровне, который читается как доза.',
      },
      {
        label: 'В исследовании',
        value: '0,5%, дважды в день',
        note: 'Dhaliwal и соавторы, British Journal of Dermatology 2019: 44 пациента, 12 недель, рандомизированно и двойным слепым методом, крем с бакучиолом 0,5% дважды в день против ретинола 0,5% на ночь.',
      },
      {
        label: 'Что нашли',
        value: 'Значимой разницы нет',
        note: 'Оба уменьшили площадь морщин и пигментацию, при этом ретинол чаще вызывал шелушение и покалывание. Хорошее доказательство — для 0,5%, то есть в пять раз больше, чем в этом флаконе.',
      },
    ],
    verdict:
      'Итак: бакучиол здесь действительно есть, он фотостабилен и мягок так, как ретинол не бывает, и это разумный ингредиент для дневной сыворотки. Но результат прямого сравнения с ретинолом принадлежит концентрации в пять раз выше, и занимать его мы не станем. Покупайте это за увлажняющую загрузку и ниацинамид, а бакучиол считайте приятным дополнением, а не причиной.',
  },

  peptides: {
    eyebrow: 'Отдадим должное',
    title: 'Отличные пептиды в очень малых количествах',
    intro:
      'Оценка безопасности называет сырьё, и выбор сделан хорошо — это уважаемые дорогие активы от Sederma, DSM и Corum, а не товарные заменители. Каждое закуплено на уровне 0,1% формулы, и именно это даёт концентрации в правом столбце.',
    columns: { brand: 'Сырьё', supplier: 'Поставщик', peptide: 'Пептид', amount: 'Во флаконе' },
    rows: [
      { brand: 'Syn-Coll', supplier: 'DSM', peptide: 'Palmitoyl Tripeptide-5', amount: '1,1 ppm' },
      { brand: 'Matrixyl 3000', supplier: 'Sederma', peptide: 'Palmitoyl Tripeptide-1', amount: '0,1 ppm' },
      { brand: 'Matrixyl 3000', supplier: 'Sederma', peptide: 'Palmitoyl Tetrapeptide-7', amount: '0,08 ppm' },
      { brand: 'Elastyl', supplier: 'Corum', peptide: 'Palmitoyl Hexapeptide-12', amount: '0,1 ppm' },
      { brand: 'AH PEP 50', supplier: 'Danjoungbio', peptide: 'Acetyl Hexapeptide-8', amount: '0,05 ppm' },
      { brand: '—', supplier: '—', peptide: 'Dipeptide-2', amount: '0,1 ppm' },
    ],
    note:
      'Шесть пептидов, вместе около 1,4 части на миллион. То же касается церамида, холестерина и фитосфингозина, которые продают как барьерную липосому, — по 0,1 ppm каждый — а также коллагена, эластина и прополиса. Они в составе, и работает сыворотка не из-за них. Мы лучше скажем это, чем опишем шесть механизмов, которых не получить из миллионной доли грамма.',
  },

  working: {
    eyebrow: 'Работающая формула',
    title: 'Что действительно в дозе',
    intro:
      'Работу в этом флаконе делают пять ингредиентов, и два из них измерены в партии, а не просто заявлены.',
    items: [
      {
        name: 'Glycerin',
        dose: '25,45%',
        body: 'Увлажнитель, который делает это сывороткой, а не заявлением. Подтверждён удельным весом 1,0689 в сертификате.',
      },
      {
        name: 'Niacinamide',
        dose: '2,00%',
        body: 'Витамин B3 на действительно полезном уровне — для неровного тона и барьера. Измерено в партии: 96,72% от заявленного.',
      },
      {
        name: 'Adenosine',
        dose: '0,04%',
        body: 'Ровно та доза, которую Корея лицензирует для уменьшения морщин, и единственный здесь актив против морщин с регуляторным порогом за спиной. Измерено 101%.',
      },
      {
        name: 'Betaine',
        dose: '0,50%',
        body: 'Второй увлажнитель, и мягкий — работает вместе с глицерином, а не дублирует его.',
      },
      {
        name: 'Allantoin и Panthenol',
        dose: 'по 0,10%',
        body: 'Оба на рабочем уровне, оба ради комфорта и барьера, а не ради заголовка.',
      },
    ],
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что говорит сертификат',
    intro:
      'Сделано в Корее, выпущено против письменной спецификации и оценено по европейскому косметическому закону в досье на 46 страниц.',
    rows: [
      { label: 'pH', value: '6,78 при 25 °C, в пределах спецификации 5,60–7,60' },
      { label: 'Наполнение', value: '30,17 мл при заявленных 30 мл' },
      { label: 'Удельный вес', value: '1,0689 — вес сыворотки, на четверть состоящей из глицерина' },
      { label: 'Ниацинамид', value: 'Измерено 96,72% от заявленных 2%' },
      { label: 'Аденозин', value: 'Измерено 101,00% от заявленных 0,04%' },
      { label: 'Чистота', value: 'Менее 10 КОЕ/мл при допустимых 100' },
      { label: 'Патогены', value: 'S. aureus, P. aeruginosa и C. albicans — все не обнаружены' },
      { label: 'Срок годности', value: 'Три года закрытой, дата на коробке' },
    ],
    patch:
      'Дерматологический патч-тест, стоящий за строкой «дерматологически протестировано», вернулся с оценкой «не раздражает», а не просто «пройден», — это более сильный результат и он заслуживает различения. Оценщик отмечает, что число добровольцев невелико, так что читайте это как уверенность в формуле, а не как доказательство про вашу кожу.',
  },

  fragrance: {
    eyebrow: 'Если вы читаете составы',
    title: 'Он с ароматом, лавандовым',
    body:
      'Лавандовое масло 0,0186%, с линалоолом, указанным отдельно как 0,0114%, потому что европейский закон требует называть этот аллерген. Это эфирное масло, а не синтетическая отдушка, и количество мало, но если вы избегаете ароматизаторов или реагируете именно на линалоол, он здесь, и знать об этом стоит до открытия коробки, а не после. Наш Blemish Balm Cream — вариант без отдушки, если это решающий фактор.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'На влажную кожу, затем запечатать',
    frequency: 'Утром и вечером · после очищения, до крема',
    steps: [
      {
        title: 'Наносите на кожу, которая ещё влажная',
        body: 'Здесь это важнее, чем для большинства сывороток. Формула на четверть из глицерина работает удержанием воды, так дайте ей воду для удержания — нанесите в течение минуты после очищения, а не на сухое лицо.',
      },
      {
        title: 'Три-четыре капли, вдавливая, а не растирая',
        body: 'Согрейте между подушечками пальцев и вдавите по лицу и шее. Растирание вязкого увлажнителя лишь перемещает его.',
      },
      {
        title: 'Сверху крем',
        body: 'Глицерин втягивает воду; окклюзивный слой сверху не даёт ей уйти. Без этого второго шага увлажняющая сыворотка в сухом воздухе может оставить кожу более стянутой, а не более мягкой.',
      },
      {
        title: 'В оба конца дня',
        body: 'В отличие от ретинола, бакучиол фотостабилен, поэтому нет причин ограничивать это вечером. Утром всё равно нанесите санскрин сверху.',
      },
    ],
    note:
      'Он слоится под что угодно. В формуле нет кислот, ретиноидов и эксфолиантов, поэтому он не конкурирует с остальным уходом.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что во флаконе',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Содержит лавандовое масло и заявленный линалоол. Сделайте пробу, если реагируете на ароматизаторы.',
      'Только для наружного применения. Избегайте глаз и слизистых, при попадании тщательно промойте прохладной водой.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Оценено как безопасное по регламенту EC 1223/2009 и получило оценку «не раздражает» в патч-тесте.',
      'При беременности спросите врача перед началом любого нового актива — бакучиол не ретинол, но этот разговор им вести с вами.',
      'Храните в прохладном сухом месте, недоступном для детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, плюс раскрытие отдушки из количественной формулы.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '30 мл' },
      { label: 'Текстура', value: 'Непрозрачная вязкая сыворотка, от светло-жёлтой до белой' },
      { label: 'Активы в дозе', value: 'Глицерин 25,45%, ниацинамид 2,00%, аденозин 0,04%, бетаин 0,50%' },
      { label: 'Бакучиол', value: '0,100% — пятая часть концентрации в исследовании с ретинолом' },
      { label: 'Пептиды', value: 'Шесть, около 1,4 ppm суммарно, из материалов Sederma, DSM и Corum' },
      { label: 'Отдушка', value: 'Да — лавандовое масло 0,0186%, линалоол заявлен' },
      { label: 'pH', value: '5,60–7,60 (6,78 в измеренной партии)' },
      { label: 'Оценка', value: 'Оценка безопасности ЕС; патч-тест «не раздражает»' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Достаточно ли бакучиола, чтобы работать как ретинол?',
        a: 'Не на том уровне, на котором проводили знаменитое сравнение. В том исследовании было 0,5% дважды в день; в этой сыворотке 0,100%. Бакучиол по-прежнему разумный, фотостабильный, хорошо переносимый ингредиент, и он здесь действительно есть, — но если вы покупаете именно на замену ретиноиду, это не та концентрация, и мы скорее скажем это прямо.',
      },
      {
        q: 'Так что он делает?',
        a: 'Сильно увлажняет. Четверть флакона — глицерин, рядом бетаин и пантенол, поэтому кожа выглядит полнее, а линии мельче, пока она удерживает воду. Сверху — ниацинамид 2% для тона и барьера и аденозин ровно в той дозе, которую Корея лицензирует для уменьшения морщин. Это реально, и оба измерены в партии.',
      },
      {
        q: 'Зачем перечислять шесть пептидов, если они в частях на миллион?',
        a: 'Потому что они в формуле, и мы лучше покажем вам цифры, чем спрячем их. Стоит знать, что сырьё хорошее — Matrixyl 3000 от Sederma, Syn-Coll от DSM, Elastyl от Corum, — закупленное по 0,1% каждое. Выбор сделали хороший, а использовали очень мало. Не покупайте этот флакон ради пептидов.',
      },
      {
        q: 'Можно утром?',
        a: 'Да, и это одно из настоящих преимуществ бакучиола перед ретинолом — он фотостабилен, поэтому не обязан быть только вечерним продуктом. Нанесите на влажную кожу, сверху крем, затем санскрин.',
      },
      {
        q: 'Есть ли отдушка?',
        a: 'Да. Лавандовое масло 0,0186%, с линалоолом, заявленным отдельно как аллерген, 0,0114%. Малые количества натурального эфирного масла, а не синтетической отдушки, но они есть. Если отдушка решает, наш Blemish Balm Cream — без неё.',
      },
      {
        q: 'Будет ли щипать или шелушить?',
        a: 'Не должно. В формуле нет кислот, ретиноидов и эксфолиантов, а патч-тест вернулся с оценкой «не раздражает», а не просто «пройден». Следить стоит за лавандой, а сделать правильно — нанести сверху крем, чтобы глицерину было под чем удерживать воду.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const ANTI_WRINKLE_COPY: Record<Locale, AntiWrinkleCopy> = { en: EN, ar: AR, ru: RU }

export function getAntiWrinkleCopy(locale: string | undefined): AntiWrinkleCopy {
  return ANTI_WRINKLE_COPY[(locale as Locale) ?? 'en'] ?? ANTI_WRINKLE_COPY.en
}

/** 32 is the cream sibling; 42 is the fragrance-free option the page names. */
export const COMPANION_PRODUCT_IDS = ['32', '16', '42', '13'] as const
