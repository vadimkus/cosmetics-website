/**
 * Bespoke copy for the BIO-MESO PDRN HOMECARE AMPOULE 5000 page (product 65).
 *
 * Same self-contained per-locale pattern as cerabarrierCopy.ts, so the
 * dedicated layout ships EN/AR/RU without adding ~120 keys to the shared
 * messages bundles.
 *
 * SOURCING RULE FOR THIS FILE — every figure below traces to one of:
 *   - Intertek formula PDF (Registration/Intertek/BIO-MESO PDRN HOMECARE
 *     AMPOULE/Formula-...5000.pdf): Sodium DNA 0.101% = 1,010 ppm,
 *     Niacinamide 2%, Panthenol 1%, nine peptides, five ceramides.
 *   - Intertek artwork PDF (outer box): "BIO-MESO PDRN 5,000ppm",
 *     "Panthenol 10,000ppm", "Peptide 9 Types", the precaution text, PAO 12M.
 *   - Intertek COA (LOT 665EK): pH 6.77, white opaque lotion, specific gravity
 *     1.017, net 50.8 ml, all four pathogens not detected.
 *   - Certificate of Free Sale 2025-25983, Korea Cosmetic Association.
 *   - Dubai Municipality Montaji registration CPRE-240126-191961 (Approved,
 *     valid to Jan 2031), docs/Montaji_Product_Registration_Letter_normalized.csv.
 *     The page states the registration without the CPRE code.
 *   - The product record in the database (description, benefits, ingredients,
 *     howToUse), which was itself audited against Intertek in July 2026.
 *   - docs/SESSION_CHANGES_2026-07-05_BIO_MESO_PDRN_5000_5_SLIDES.md for the
 *     0.25 mm needle equivalent, the 24-72 h spicule window and the six-day
 *     renewal sequence, all taken from the Bio-Meso line training manual.
 *
 * There is NO clinical efficacy study on file for product 65 — no percentage
 * improvement figures exist in Intertek or in the repo. So this page carries no
 * clinical percentages at all. The proof section shows laboratory
 * specification instead, which is verifiable. Do not add efficacy percentages
 * here without the actual study certificate.
 *
 * The training manual also states the spicule treatment has low-to-moderate
 * downtime, so nothing here claims it is pain-free or downtime-free.
 */

export type BioMesoLocale = 'en' | 'ar' | 'ru'

export interface BioMesoCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  weeklyNote: string
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
  science: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
    figureAlt: string
  }
  timeline: {
    eyebrow: string
    title: string
    intro: string
    days: Array<{ day: string; title: string; body: string }>
    note: string
  }
  complex: {
    eyebrow: string
    title: string
    body: string
    points: Array<{ title: string; body: string }>
  }
  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }
  video: {
    eyebrow: string
    title: string
    body: string
    unsupported: string
  }
  actives: {
    eyebrow: string
    title: string
    intro: string
    fullInci: string
    fullInciNote: string
  }
  lab: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    disclaimer: string
  }
  /**
   * Measured clinical results. Optional because most of the line has no study
   * on file — product 65 deliberately omits this and shows laboratory
   * specification instead. Only populate it where a test report actually
   * exists, and keep the panel size and duration in the disclaimer.
   */
  clinical?: {
    eyebrow: string
    title: string
    intro: string
    metrics: Array<{ value: string; label: string; detail: string }>
    note: string
    disclaimer: string
  }
  safety: {
    eyebrow: string
    title: string
    points: string[]
    note: string
  }
  routine: {
    eyebrow: string
    title: string
    intro: string
    thisProduct: string
    viewProduct: string
    chooseOptions: string
    /** Prefix for routine items sold in more than one size. */
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
    brochure: string
  }
  backToProducts: string
}

const EN: BioMesoCopy = {
  eyebrow: 'Bio-Meso · Homecare ampoule',
  headline: 'Regeneration without classic needles.',
  subheadline:
    'A specialized homecare ampoule built on BIO-MESO™ PDRN coated spicules. Their needle-shaped structure penetrates the skin directly for a bio-peeling effect that drives turnover and regeneration - designed to hold your results between professional treatments.',
  heroBullets: [
    'BIO-MESO™ PDRN 5,000 ppm, with Sodium DNA at 1,010 ppm',
    'Spicules open micro-channels - no classic needles',
    'Nine peptides, five ceramides, panthenol at 10,000 ppm',
    'One evening a week, between clinic treatments',
  ],
  badges: ['Made in Korea', '50 ml · 12M PAO', 'Korean dual-functional cosmetic', 'Official UAE distributor'],
  weeklyNote: 'Once a week · evening',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',
  stats: [
    { value: '5,000ppm', label: 'BIO-MESO™ PDRN complex' },
    { value: '1,010ppm', label: 'Sodium DNA, salmon-derived' },
    { value: '10,000ppm', label: 'Panthenol, provitamin B5' },
    { value: '9', label: 'Peptide types in the complex' },
  ],
  science: {
    eyebrow: 'How it works',
    title: 'Four things happen at once',
    intro:
      'Hydrolyzed sponge spicules do the mechanical work, PDRN and the peptide complex do the biological work, and the ceramides put the barrier back together.',
    cards: [
      {
        title: 'Micro-channels, not needles',
        body: 'Hydrolyzed sponge spicules are needle-shaped natural components. Pressed into the skin they open micro-channels through the stratum corneum - the mechanism behind the 0.25 mm needle equivalence this ampoule is rated at.',
      },
      {
        title: 'PDRN goes deep',
        body: 'Salmon-derived Sodium DNA travels through those channels. PDRN promotes the release of anti-inflammatory cytokines to soothe damaged skin, and supports collagen and elastin synthesis.',
      },
      {
        title: 'Bio-peeling turnover',
        body: 'The spicules stay in the skin and keep stimulating for roughly 24 to 72 hours. That sustained bio-peeling effect is what drives cell turnover and the regeneration this ampoule is built for.',
      },
      {
        title: 'Barrier put back together',
        body: 'Five ceramides - NP, AS, NS, AP and EOP - with phytosphingosine, cholesterol and panthenol at 10,000 ppm rebuild the lipid barrier while the skin renews.',
      },
    ],
    figureAlt: 'BIO-MESO PDRN spicule technology - micro-channels, deep delivery, bio-peeling and regeneration',
  },
  timeline: {
    eyebrow: 'What to expect',
    title: 'The six-day renewal',
    intro:
      'This is an active exfoliating treatment, and it behaves like one. Knowing the sequence in advance is the difference between trusting the process and stopping halfway.',
    days: [
      { day: 'Day 0–1', title: 'Tingling and tightness', body: 'The spicules are seated in the skin and working. A warm, tight sensation on the evening of application and the day after is expected.' },
      { day: 'Day 2', title: 'A prickly feeling', body: 'The sensation sharpens slightly as stimulation continues. Keep the routine simple and skip other actives.' },
      { day: 'Day 3–4', title: 'Micro-shedding begins', body: 'The surface starts to release. Do not pick or scrub - let it lift on its own and keep the skin well moisturised.' },
      { day: 'Day 5', title: 'Visible peeling', body: 'The most noticeable day. This is the bio-peeling completing, not a reaction to treat.' },
      { day: 'Day 6', title: 'Renewed surface', body: 'Skin reads brighter, smoother and more even. You are back to baseline and ready for the next weekly application.' },
    ],
    note: 'Spicule treatment carries genuine low-to-moderate downtime. Plan the application for an evening when the days that follow are yours.',
  },
  complex: {
    eyebrow: 'Inside the ampoule',
    title: 'What the 5,000 is made of',
    body: 'The number on the tube is the BIO-MESO PDRN complex concentration. Underneath it sits a peptide, ceramide and regenerating package built for skin that is actively renewing.',
    points: [
      {
        title: 'BIO-MESO™ PDRN coated spicules',
        body: 'Hydrolyzed sponge spicules coated with PDRN, so the active is delivered by the same structure that opens the channel. Sodium DNA is dosed at 1,010 ppm.',
      },
      {
        title: 'Nine peptide types',
        body: 'EGF (sh-Oligopeptide-1), Copper Tripeptide-1, Hexapeptide-9, Nonapeptide-1, Tripeptide-1, Acetyl Hexapeptide-8, Palmitoyl Pentapeptide-4, Palmitoyl Tripeptide-1 and Palmitoyl Tetrapeptide-7.',
      },
      {
        title: 'Five ceramides and their precursor',
        body: 'Ceramide NP, AS, NS, AP and EOP with phytosphingosine and cholesterol - the lipid set that limits water loss while the barrier is compromised.',
      },
      {
        title: 'Niacinamide and adenosine',
        body: 'Niacinamide at 2% and adenosine are the two actives behind the Korean dual-functional registration for brightening and wrinkle improvement.',
      },
    ],
  },
  howTo: {
    eyebrow: 'The ritual',
    title: 'How to use it',
    frequency: 'Once a week · evening',
    steps: [
      {
        title: 'Cleanse, then apply',
        body: 'On clean skin, apply around 3 ml of the ampoule to the face. Avoid the eye and lip areas.',
      },
      {
        title: 'Spread, then press',
        body: 'Spread the ampoule evenly, then press the treatment area with your palms or fingers. Pressing is what seats the spicules - spreading alone is not enough.',
      },
      {
        title: 'Roll for 30 seconds',
        body: 'Massage the face with a rolling motion for around 30 seconds.',
      },
      {
        title: 'Calm it down',
        body: 'Apply the Skin Reboot PDRN Mask and leave it on for 10 to 15 minutes.',
      },
    ],
    note: 'Never combine this with a microneedle roller. The spicules already create the micro-channels; adding a roller stacks two injuries on the same skin.',
  },
  video: {
    eyebrow: 'In motion',
    title: 'The texture, up close',
    body: 'A white opaque lotion, denser than a serum. You will feel the spicules as a fine grain, and that grain is the treatment.',
    unsupported: 'Your browser cannot play this video.',
  },
  actives: {
    eyebrow: 'The formula',
    title: 'Every active, and what it does',
    intro:
      'Every active in the ampoule, and what each one is doing once the spicules open the way in.',
    fullInci: 'Full INCI list',
    fullInciNote: 'The complete ingredient list as printed on the carton.',
  },
  lab: {
    eyebrow: 'Quality',
    title: 'Made and tested in Korea',
    intro:
      'Made in Korea, and no batch ships until it passes. These are the numbers behind the bottle you receive.',
    rows: [
      { label: 'Texture', value: 'White opaque lotion, denser than a serum' },
      { label: 'Volume', value: '50 ml' },
      { label: 'Sterility', value: 'Tested clear for E. coli, P. aeruginosa, S. aureus and C. albicans' },
      { label: 'Cleared for the UAE', value: 'Registered with Dubai Municipality on the Montaji system, on top of the Korean certificate of free sale' },
      { label: 'Shelf life', value: 'Twelve months once opened' },
    ],
    disclaimer:
      'Certificates of analysis are issued per production lot and available on request. This is the homecare that keeps professional results going between appointments.',
  },
  safety: {
    eyebrow: 'Before you start',
    title: 'When not to use it',
    points: [
      'For external use only. Avoid the eye and lip areas - if contact occurs, rinse thoroughly with cool water.',
      'Do not use on pustular acne, rosacea, open wounds, or skin that has just had a facial procedure.',
      'Never use alongside a microneedle roller or any other needling device.',
      'Stop use and see a doctor if redness, swelling or irritation occurs.',
    ],
    note: 'Keep in a cool, dry place, out of reach of children. Use within 12 months of opening.',
  },
  routine: {
    eyebrow: 'The protocol',
    title: 'Complete the routine',
    intro:
      'The weekly Bio-Meso evening, in order. Cleanse first, treat, calm with the PDRN mask, then seal with the postcream.',
    thisProduct: 'You are here',
    viewProduct: 'View product',
    chooseOptions: 'Choose size',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Good to know',
    items: [
      {
        q: 'How often should I use it?',
        a: 'Once a week, in the evening. This is not a daily ampoule - the spicules keep stimulating the skin for 24 to 72 hours after application, and using it more often stacks treatments on skin that has not finished renewing.',
      },
      {
        q: 'Will it sting?',
        a: 'Expect tingling and tightness on the evening of application and a prickly sensation over the next day or two. That is the spicules working. It is an active treatment with low-to-moderate downtime, so give it an evening when the days that follow are yours.',
      },
      {
        q: 'Can I use it with my microneedle roller?',
        a: 'No. The spicules already create the micro-channels a roller is meant to create. Using both puts two separate injuries into the same skin on the same evening. Choose one.',
      },
      {
        q: 'How is this different from the Bio-Meso PDRN Ampoule 60000?',
        a: 'The 60000 is a professional clinic ampoule at a much higher spicule and PDRN concentration, used roughly monthly by a trained practitioner. This 5000 is the homecare half of that system - a lower concentration designed for weekly use at home, to hold results between clinic visits.',
      },
      {
        q: 'Will I actually peel?',
        a: 'Most skins shed visibly around days three to five. It is a bio-peeling treatment, so some flaking is the intended outcome rather than a side effect. Do not pick or scrub it off.',
      },
      {
        q: 'What is PDRN?',
        a: 'Polydeoxyribonucleotide - DNA fragments, here derived from salmon and listed as Sodium DNA. It promotes the release of anti-inflammatory cytokines to soothe damaged skin and supports collagen and elastin synthesis.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details',
    rows: [
      { label: 'Format', value: 'Homecare treatment ampoule' },
      { label: 'Size', value: '50 ml' },
      { label: 'Reference', value: 'GCAP01' },
      { label: 'Technology', value: 'BIO-MESO™ PDRN coated spicules' },
      { label: 'Skin type', value: 'All skin types' },
      { label: 'Frequency', value: 'Once weekly, evening' },
      { label: 'Period after opening', value: '12 months' },
      { label: 'Origin', value: 'South Korea' },
    ],
    brochure: 'Bio-Meso PDRN line training manual',
  },
  backToProducts: 'Products',
}

const AR: BioMesoCopy = {
  eyebrow: 'بايو-ميزو · أمبولة العناية المنزلية',
  headline: 'تجديد البشرة دون إبر تقليدية.',
  subheadline:
    'أمبولة متخصصة للعناية المنزلية قائمة على spicules المغلفة بـ BIO-MESO™ PDRN. بنيتها الإبرية تخترق البشرة مباشرة وتمنح تأثير تقشير حيوي يعزز تجدد الخلايا والتجديد - مصممة للحفاظ على نتائجك بين الجلسات الاحترافية.',
  heroBullets: [
    'BIO-MESO™ PDRN بتركيز 5,000 جزء بالمليون، وSodium DNA بـ 1,010 جزء بالمليون',
    'الـ spicules تفتح قنوات دقيقة - دون إبر تقليدية',
    'تسعة ببتيدات وخمسة سيراميدات وبانثينول بـ 10,000 جزء بالمليون',
    'مرة واحدة أسبوعياً مساءً، بين جلسات العيادة',
  ],
  badges: ['صنع في كوريا', '50 مل · صلاحية 12 شهراً بعد الفتح', 'مستحضر كوري ثنائي الوظيفة', 'الموزع الرسمي في الإمارات'],
  weeklyNote: 'مرة أسبوعياً · مساءً',
  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّل الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  stats: [
    { value: '5,000ppm', label: 'مركب BIO-MESO™ PDRN' },
    { value: '1,010ppm', label: 'Sodium DNA المستخلص من السلمون' },
    { value: '10,000ppm', label: 'بانثينول، بروفيتامين B5' },
    { value: '9', label: 'أنواع الببتيد في المركب' },
  ],
  science: {
    eyebrow: 'كيف يعمل',
    title: 'أربعة أمور تحدث في آنٍ واحد',
    intro:
      'الـ spicules المستخلصة من الإسفنج تؤدي العمل الميكانيكي، وPDRN ومركب الببتيد يؤديان العمل البيولوجي، والسيراميدات تعيد بناء الحاجز.',
    cards: [
      {
        title: 'قنوات دقيقة، لا إبر',
        body: 'الـ spicules مكوّنات طبيعية ذات بنية إبرية. عند الضغط عليها في البشرة تفتح قنوات دقيقة عبر الطبقة القرنية - وهي الآلية وراء معادلة إبرة 0.25 مم التي تُصنَّف عندها هذه الأمبولة.',
      },
      {
        title: 'PDRN يصل إلى العمق',
        body: 'ينتقل Sodium DNA المستخلص من السلمون عبر تلك القنوات. يعزز PDRN إفراز السيتوكينات المضادة للالتهاب لتهدئة البشرة المتضررة، ويدعم تصنيع الكولاجين والإيلاستين.',
      },
      {
        title: 'تقشير حيوي وتجدد',
        body: 'تبقى الـ spicules داخل البشرة وتواصل التحفيز نحو 24 إلى 72 ساعة. هذا التأثير المستمر هو ما يقود تجدد الخلايا والتجديد الذي صُممت له الأمبولة.',
      },
      {
        title: 'إعادة بناء الحاجز',
        body: 'خمسة سيراميدات - NP وAS وNS وAP وEOP - مع الفيتوسفينغوزين والكوليسترول والبانثينول بـ 10,000 جزء بالمليون تعيد بناء الحاجز الدهني أثناء تجدد البشرة.',
      },
    ],
    figureAlt: 'تقنية spicules من BIO-MESO PDRN - قنوات دقيقة وتوصيل عميق وتقشير حيوي وتجديد',
  },
  timeline: {
    eyebrow: 'ما الذي تتوقعينه',
    title: 'التجدد خلال ستة أيام',
    intro:
      'هذه علاج تقشير فعّال، وهي تتصرف كذلك. معرفة التسلسل مسبقاً هي الفرق بين الثقة بالعملية والتوقف في منتصفها.',
    days: [
      { day: 'اليوم 0–1', title: 'وخز وشدّ', body: 'الـ spicules مثبّتة في البشرة وتعمل. الإحساس بالدفء والشدّ مساء التطبيق واليوم التالي أمر متوقع.' },
      { day: 'اليوم 2', title: 'إحساس بالوخز', body: 'يزداد الإحساس قليلاً مع استمرار التحفيز. أبقي الروتين بسيطاً وتجنّبي المكونات الفعالة الأخرى.' },
      { day: 'اليوم 3–4', title: 'بداية التقشر الدقيق', body: 'يبدأ السطح بالتقشر. لا تنزعي الجلد ولا تفركيه - دعيه ينفصل وحده مع ترطيب جيد.' },
      { day: 'اليوم 5', title: 'تقشير ظاهر', body: 'اليوم الأكثر وضوحاً. هذا اكتمال التقشير الحيوي، وليس رد فعل يحتاج علاجاً.' },
      { day: 'اليوم 6', title: 'سطح متجدد', body: 'تبدو البشرة أكثر إشراقاً ونعومة وتجانساً. عدتِ إلى نقطة البداية وأنتِ جاهزة للتطبيق الأسبوعي التالي.' },
    ],
    note: 'علاج الـ spicules ينطوي على فترة تعافٍ حقيقية من خفيفة إلى متوسطة. خططي للتطبيق في مساء تكون الأيام التالية فيه لكِ.',
  },
  complex: {
    eyebrow: 'داخل الأمبولة',
    title: 'مِمّ يتكوّن الـ 5,000',
    body: 'الرقم على العبوة هو تركيز مركب BIO-MESO PDRN. تحته حزمة من الببتيدات والسيراميدات ومكونات التجديد، مصممة لبشرة في طور التجدد النشط.',
    points: [
      {
        title: 'spicules مغلفة بـ BIO-MESO™ PDRN',
        body: 'spicules إسفنجية مغلفة بـ PDRN، بحيث تُوصَل المادة الفعالة عبر البنية نفسها التي تفتح القناة. Sodium DNA بجرعة 1,010 جزء بالمليون.',
      },
      {
        title: 'تسعة أنواع من الببتيد',
        body: 'EGF (sh-Oligopeptide-1) وCopper Tripeptide-1 وHexapeptide-9 وNonapeptide-1 وTripeptide-1 وAcetyl Hexapeptide-8 وPalmitoyl Pentapeptide-4 وPalmitoyl Tripeptide-1 وPalmitoyl Tetrapeptide-7.',
      },
      {
        title: 'خمسة سيراميدات وسليفها',
        body: 'Ceramide NP وAS وNS وAP وEOP مع الفيتوسفينغوزين والكوليسترول - مجموعة الدهون التي تحدّ من فقدان الماء بينما الحاجز في حالة ضعف.',
      },
      {
        title: 'نياسيناميد وأدينوزين',
        body: 'النياسيناميد بنسبة 2% والأدينوزين هما المادتان الفعالتان وراء التسجيل الكوري ثنائي الوظيفة للتفتيح وتحسين التجاعيد.',
      },
    ],
  },
  howTo: {
    eyebrow: 'الطقس',
    title: 'طريقة الاستخدام',
    frequency: 'مرة أسبوعياً · مساءً',
    steps: [
      {
        title: 'نظّفي ثم ضعي المنتج',
        body: 'على بشرة نظيفة، ضعي حوالي 3 مل من الأمبولة على الوجه، مع تجنّب محيط العينين والشفتين.',
      },
      {
        title: 'وزّعي ثم اضغطي',
        body: 'وزّعي الأمبولة بالتساوي، ثم اضغطي على منطقة المعالجة بالكفين أو الأصابع. الضغط هو ما يثبّت الـ spicules - التوزيع وحده لا يكفي.',
      },
      {
        title: 'دلّكي 30 ثانية',
        body: 'دلّكي الوجه بحركة دائرية لمدة 30 ثانية تقريباً.',
      },
      {
        title: 'هدّئي البشرة',
        body: 'ضعي قناع Skin Reboot PDRN واتركيه من 10 إلى 15 دقيقة.',
      },
    ],
    note: 'لا تجمعي هذا المنتج أبداً مع رولر الوخز الدقيق. الـ spicules تُنشئ القنوات الدقيقة أصلاً، وإضافة الرولر تضاعف الإجهاد على البشرة نفسها.',
  },
  video: {
    eyebrow: 'في الحركة',
    title: 'القوام عن قرب',
    body: 'لوشن أبيض معتم، أكثف من السيروم. ستشعرين بالـ spicules كحبيبات دقيقة، وهذه الحبيبات هي العلاج نفسه.',
    unsupported: 'متصفحك لا يدعم تشغيل هذا الفيديو.',
  },
  actives: {
    eyebrow: 'التركيبة',
    title: 'كل مادة فعالة وما تفعله',
    intro:
      'كل مادة فعّالة في الأمبولة، وما تفعله كل واحدة بعد أن تفتح الإبر المجهرية الطريق أمامها.',
    fullInci: 'قائمة INCI الكاملة',
    fullInciNote: 'قائمة المكوّنات الكاملة كما هي مطبوعة على العبوة.',
  },
  lab: {
    eyebrow: 'الجودة',
    title: 'صُنع واختُبر في كوريا',
    intro:
      'يُصنع في كوريا، ولا تُطرح دفعة قبل أن تجتاز الاختبار. وهذه أرقام العبوة التي بين يديك.',
    rows: [
      { label: 'القوام', value: 'لوشن أبيض معتم، أكثف من السيروم' },
      { label: 'الحجم', value: '٥٠ مل' },
      { label: 'التعقيم', value: 'خالٍ عند الفحص من E. coli و P. aeruginosa و S. aureus و C. albicans' },
      { label: 'مصرّح به للإمارات', value: 'مسجّل لدى بلدية دبي ضمن نظام Montaji، إضافة إلى شهادة البيع الحر الكورية' },
      { label: 'مدة الصلاحية', value: 'اثنا عشر شهراً بعد الفتح' },
    ],
    disclaimer:
      'تُصدر شهادة التحليل لكل دفعة إنتاج وهي متاحة عند الطلب. هذه هي العناية المنزلية التي تحافظ على نتائج الجلسات بين موعد وآخر.',
  },
  safety: {
    eyebrow: 'قبل البدء',
    title: 'متى لا يُستخدم',
    points: [
      'للاستعمال الخارجي فقط. تجنّبي محيط العينين والشفتين - وعند الملامسة اشطفي جيداً بماء بارد.',
      'لا يُستخدم على حب الشباب البثري أو الوردية أو الجروح المفتوحة أو بشرة خضعت للتو لإجراء تجميلي.',
      'لا يُستخدم مع رولر الوخز الدقيق أو أي جهاز وخز آخر.',
      'أوقفي الاستخدام واستشيري الطبيب عند حدوث احمرار أو تورم أو تهيّج.',
    ],
    note: 'يُحفظ في مكان بارد وجاف بعيداً عن متناول الأطفال. يُستخدم خلال 12 شهراً من الفتح.',
  },
  routine: {
    eyebrow: 'البروتوكول',
    title: 'أكملي الروتين',
    intro:
      'مساء Bio-Meso الأسبوعي بالترتيب. نظّفي أولاً، ثم عالجي، ثم هدّئي بقناع PDRN، ثم اختمي بالكريم.',
    thisProduct: 'أنتِ هنا',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الحجم',
    fromPrice: 'ابتداءً من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'من الجيد معرفته',
    items: [
      {
        q: 'كم مرة أستخدمها؟',
        a: 'مرة واحدة أسبوعياً مساءً. ليست أمبولة يومية - تواصل الـ spicules تحفيز البشرة من 24 إلى 72 ساعة بعد التطبيق، والاستخدام الأكثر تكراراً يراكم الجلسات على بشرة لم تُكمل تجددها.',
      },
      {
        q: 'هل ستسبب وخزاً؟',
        a: 'توقّعي وخزاً وشدّاً مساء التطبيق وإحساساً بالوخز خلال اليوم أو اليومين التاليين. هذا عمل الـ spicules. وهو علاج فعّال بفترة تعافٍ من خفيفة إلى متوسطة، فاختاري له مساءً تكون الأيام التالية له لكِ.',
      },
      {
        q: 'هل أستخدمها مع رولر الوخز الدقيق؟',
        a: 'لا. الـ spicules تُنشئ أصلاً القنوات الدقيقة التي يُفترض أن ينشئها الرولر. استخدام الاثنين معاً يضع إصابتين منفصلتين في البشرة نفسها في المساء نفسه. اختاري واحداً.',
      },
      {
        q: 'ما الفرق بينها وبين أمبولة Bio-Meso PDRN 60000؟',
        a: 'الـ 60000 أمبولة احترافية للعيادات بتركيز أعلى بكثير من الـ spicules وPDRN، تُستخدم شهرياً تقريباً على يد مختص مدرّب. أما 5000 فهي الجزء المنزلي من المنظومة نفسها - تركيز أقل للاستخدام الأسبوعي في المنزل للحفاظ على النتائج بين زيارات العيادة.',
      },
      {
        q: 'هل ستتقشر بشرتي فعلاً؟',
        a: 'معظم أنواع البشرة تتقشر بوضوح بين اليوم الثالث والخامس. إنه علاج تقشير حيوي، لذا فبعض التقشر نتيجة مقصودة وليس أثراً جانبياً. لا تنزعي القشور ولا تفركيها.',
      },
      {
        q: 'ما هو PDRN؟',
        a: 'بولي ديوكسي ريبونوكليوتيد - شظايا DNA، مستخلصة هنا من السلمون ومدرجة باسم Sodium DNA. يعزز إفراز السيتوكينات المضادة للالتهاب لتهدئة البشرة المتضررة ويدعم تصنيع الكولاجين والإيلاستين.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      { label: 'الشكل', value: 'أمبولة علاجية للعناية المنزلية' },
      { label: 'الحجم', value: '50 مل' },
      { label: 'الرمز المرجعي', value: 'GCAP01' },
      { label: 'التقنية', value: 'spicules مغلفة بـ BIO-MESO™ PDRN' },
      { label: 'نوع البشرة', value: 'جميع أنواع البشرة' },
      { label: 'التكرار', value: 'مرة أسبوعياً، مساءً' },
      { label: 'الصلاحية بعد الفتح', value: '12 شهراً' },
      { label: 'بلد المنشأ', value: 'كوريا الجنوبية' },
    ],
    brochure: 'دليل تدريب خط Bio-Meso PDRN',
  },
  backToProducts: 'المنتجات',
}

const RU: BioMesoCopy = {
  eyebrow: 'Bio-Meso · ампула для домашнего ухода',
  headline: 'Регенерация без классических игл.',
  subheadline:
    'Специализированная ампула для домашнего ухода на основе спикул с покрытием BIO-MESO™ PDRN. Их игольчатая структура обеспечивает прямое проникновение в кожу и эффект био-пилинга, который запускает обновление и регенерацию — чтобы удерживать результат между профессиональными процедурами.',
  heroBullets: [
    'BIO-MESO™ PDRN 5 000 ppm, Sodium DNA — 1 010 ppm',
    'Спикулы открывают микроканалы — без классических игл',
    'Девять пептидов, пять церамидов, пантенол 10 000 ppm',
    'Один вечер в неделю, между процедурами в клинике',
  ],
  badges: ['Сделано в Корее', '50 мл · 12 месяцев после вскрытия', 'Корейское двойное функциональное средство', 'Официальный дистрибьютор в ОАЭ'],
  weeklyNote: 'Раз в неделю · вечером',
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
    { value: '5 000ppm', label: 'Комплекс BIO-MESO™ PDRN' },
    { value: '1 010ppm', label: 'Sodium DNA из лосося' },
    { value: '10 000ppm', label: 'Пантенол, провитамин B5' },
    { value: '9', label: 'Типов пептидов в комплексе' },
  ],
  science: {
    eyebrow: 'Как это работает',
    title: 'Четыре процесса одновременно',
    intro:
      'Спикулы гидролизованной губки выполняют механическую работу, PDRN и пептидный комплекс — биологическую, а церамиды заново собирают барьер.',
    cards: [
      {
        title: 'Микроканалы, а не иглы',
        body: 'Спикулы гидролизованной губки — природные компоненты игольчатой формы. При вдавливании в кожу они открывают микроканалы через роговой слой. Это и есть механизм, стоящий за эквивалентом иглы 0,25 мм, на который рассчитана эта ампула.',
      },
      {
        title: 'PDRN проникает глубже',
        body: 'Sodium DNA из лосося проходит по этим каналам. PDRN способствует высвобождению противовоспалительных цитокинов, успокаивая повреждённую кожу, и поддерживает синтез коллагена и эластина.',
      },
      {
        title: 'Био-пилинг и обновление',
        body: 'Спикулы остаются в коже и продолжают стимуляцию примерно 24–72 часа. Именно этот продолжительный эффект био-пилинга запускает обновление клеток и регенерацию, ради которой создана ампула.',
      },
      {
        title: 'Барьер собирается заново',
        body: 'Пять церамидов — NP, AS, NS, AP и EOP — вместе с фитосфингозином, холестерином и пантенолом 10 000 ppm восстанавливают липидный барьер, пока кожа обновляется.',
      },
    ],
    figureAlt: 'Технология спикул BIO-MESO PDRN — микроканалы, глубокая доставка, био-пилинг и регенерация',
  },
  timeline: {
    eyebrow: 'Чего ожидать',
    title: 'Шесть дней обновления',
    intro:
      'Это активная отшелушивающая процедура, и ведёт она себя соответственно. Знание последовательности заранее — разница между доверием процессу и остановкой на полпути.',
    days: [
      { day: 'День 0–1', title: 'Покалывание и стянутость', body: 'Спикулы закреплены в коже и работают. Ощущение тепла и стянутости вечером после нанесения и на следующий день — норма.' },
      { day: 'День 2', title: 'Колкое ощущение', body: 'Ощущение слегка усиливается по мере продолжения стимуляции. Держите уход простым и откажитесь от других активов.' },
      { day: 'День 3–4', title: 'Начинается микрошелушение', body: 'Поверхность начинает отходить. Не сдирайте и не трите — дайте коже отшелушиться самой и хорошо увлажняйте.' },
      { day: 'День 5', title: 'Заметное шелушение', body: 'Самый выраженный день. Это завершение био-пилинга, а не реакция, которую нужно лечить.' },
      { day: 'День 6', title: 'Обновлённая кожа', body: 'Кожа выглядит светлее, глаже и ровнее. Вы вернулись к исходной точке и готовы к следующему еженедельному нанесению.' },
    ],
    note: 'Процедура со спикулами предполагает реальный восстановительный период — от лёгкого до умеренного. Планируйте нанесение на вечер, после которого следующие дни принадлежат вам.',
  },
  complex: {
    eyebrow: 'Внутри ампулы',
    title: 'Из чего состоит 5 000',
    body: 'Число на тубе — это концентрация комплекса BIO-MESO PDRN. Под ним — пептидный, церамидный и регенерирующий набор, собранный для кожи в состоянии активного обновления.',
    points: [
      {
        title: 'Спикулы с покрытием BIO-MESO™ PDRN',
        body: 'Спикулы губки с покрытием PDRN: актив доставляется той же структурой, которая открывает канал. Sodium DNA — 1 010 ppm.',
      },
      {
        title: 'Девять типов пептидов',
        body: 'EGF (sh-Oligopeptide-1), Copper Tripeptide-1, Hexapeptide-9, Nonapeptide-1, Tripeptide-1, Acetyl Hexapeptide-8, Palmitoyl Pentapeptide-4, Palmitoyl Tripeptide-1 и Palmitoyl Tetrapeptide-7.',
      },
      {
        title: 'Пять церамидов и их предшественник',
        body: 'Ceramide NP, AS, NS, AP и EOP с фитосфингозином и холестерином — липидный набор, который ограничивает потерю влаги, пока барьер ослаблен.',
      },
      {
        title: 'Ниацинамид и аденозин',
        body: 'Ниацинамид 2% и аденозин — два актива, на которых основана корейская двойная функциональная регистрация: осветление и коррекция морщин.',
      },
    ],
  },
  howTo: {
    eyebrow: 'Ритуал',
    title: 'Как применять',
    frequency: 'Раз в неделю · вечером',
    steps: [
      {
        title: 'Очистите и нанесите',
        body: 'На очищенную кожу нанесите около 3 мл ампулы, избегая области вокруг глаз и губ.',
      },
      {
        title: 'Распределите и вбейте',
        body: 'Равномерно распределите ампулу, затем вбейте средство в зону обработки ладонями или пальцами. Именно вбивание закрепляет спикулы — одного распределения недостаточно.',
      },
      {
        title: 'Массируйте 30 секунд',
        body: 'Помассируйте лицо круговыми движениями около 30 секунд.',
      },
      {
        title: 'Успокойте кожу',
        body: 'Нанесите маску Skin Reboot PDRN и оставьте на 10–15 минут.',
      },
    ],
    note: 'Никогда не сочетайте это средство с микроигольчатым роллером. Спикулы уже создают микроканалы, и роллер добавляет вторую травму на ту же кожу.',
  },
  video: {
    eyebrow: 'В движении',
    title: 'Текстура вблизи',
    body: 'Белый непрозрачный лосьон, плотнее сыворотки. Спикулы ощущаются как мелкая крупинка, и эта крупинка и есть процедура.',
    unsupported: 'Ваш браузер не может воспроизвести это видео.',
  },
  actives: {
    eyebrow: 'Формула',
    title: 'Каждый актив и его роль',
    intro:
      'Каждый актив в ампуле и то, что он делает после того, как спикулы открыли ему путь.',
    fullInci: 'Полный состав INCI',
    fullInciNote: 'Полный список ингредиентов, как он напечатан на упаковке.',
  },
  lab: {
    eyebrow: 'Качество',
    title: 'Сделано и протестировано в Корее',
    intro:
      'Производится в Корее, и ни одна партия не выходит, не пройдя проверку. Это показатели того флакона, что у вас в руках.',
    rows: [
      { label: 'Текстура', value: 'Белый непрозрачный лосьон, плотнее сыворотки' },
      { label: 'Объём', value: '50 мл' },
      { label: 'Стерильность', value: 'Проверено и чисто по E. coli, P. aeruginosa, S. aureus и C. albicans' },
      { label: 'Допуск в ОАЭ', value: 'Зарегистрирован Муниципалитетом Дубая в системе Montaji, плюс корейский сертификат свободной продажи' },
      { label: 'Срок годности', value: 'Двенадцать месяцев после открытия' },
    ],
    disclaimer:
      'Сертификат анализа выпускается на каждую производственную партию и доступен по запросу. Это домашний уход, который поддерживает результат между визитами.',
  },
  safety: {
    eyebrow: 'Перед началом',
    title: 'Когда применять нельзя',
    points: [
      'Только для наружного применения. Избегайте области вокруг глаз и губ — при попадании тщательно промойте прохладной водой.',
      'Не наносите на пустулёзное акне, розацеа, открытые раны и кожу сразу после косметологической процедуры.',
      'Не используйте вместе с микроигольчатым роллером или любым другим устройством для нидлинга.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
    ],
    note: 'Хранить в прохладном сухом месте, в недоступном для детей. Использовать в течение 12 месяцев после вскрытия.',
  },
  routine: {
    eyebrow: 'Протокол',
    title: 'Завершите протокол',
    intro:
      'Еженедельный вечер Bio-Meso по порядку. Сначала очищение, затем процедура, успокоение маской PDRN и завершение посткремом.',
    thisProduct: 'Вы здесь',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать объём',
    fromPrice: 'от',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Полезно знать',
    items: [
      {
        q: 'Как часто её использовать?',
        a: 'Раз в неделю, вечером. Это не ежедневная ампула: спикулы продолжают стимулировать кожу 24–72 часа после нанесения, и более частое применение накладывает процедуры на кожу, которая ещё не завершила обновление.',
      },
      {
        q: 'Будет ли пощипывать?',
        a: 'Ожидайте покалывания и стянутости вечером после нанесения и колкого ощущения в следующие день-два. Так работают спикулы. Это активная процедура с восстановительным периодом от лёгкого до умеренного, поэтому выбирайте вечер, когда следующие дни принадлежат вам.',
      },
      {
        q: 'Можно ли сочетать с микроигольчатым роллером?',
        a: 'Нет. Спикулы уже создают микроканалы, ради которых используется роллер. Применение обоих наносит коже две отдельные травмы за один вечер. Выберите что-то одно.',
      },
      {
        q: 'Чем это отличается от Bio-Meso PDRN Ampoule 60000?',
        a: '60000 — профессиональная ампула для клиник с намного более высокой концентрацией спикул и PDRN, применяется примерно раз в месяц обученным специалистом. 5000 — домашняя половина той же системы: меньшая концентрация для еженедельного применения дома, чтобы удерживать результат между визитами в клинику.',
      },
      {
        q: 'Кожа действительно будет шелушиться?',
        a: 'У большинства заметное шелушение приходится на третий–пятый день. Это процедура био-пилинга, поэтому шелушение — задуманный результат, а не побочный эффект. Не сдирайте и не отшелушивайте его механически.',
      },
      {
        q: 'Что такое PDRN?',
        a: 'Полидезоксирибонуклеотид — фрагменты ДНК, здесь полученные из лосося и указанные как Sodium DNA. Способствует высвобождению противовоспалительных цитокинов, успокаивая повреждённую кожу, и поддерживает синтез коллагена и эластина.',
      },
    ],
  },
  details: {
    eyebrow: 'Спецификация',
    title: 'Детали',
    rows: [
      { label: 'Формат', value: 'Ампула для домашнего ухода' },
      { label: 'Объём', value: '50 мл' },
      { label: 'Артикул', value: 'GCAP01' },
      { label: 'Технология', value: 'Спикулы с покрытием BIO-MESO™ PDRN' },
      { label: 'Тип кожи', value: 'Все типы кожи' },
      { label: 'Частота', value: 'Раз в неделю, вечером' },
      { label: 'Срок после вскрытия', value: '12 месяцев' },
      { label: 'Происхождение', value: 'Южная Корея' },
    ],
    brochure: 'Учебное руководство по линии Bio-Meso PDRN',
  },
  backToProducts: 'Продукты',
}

const BY_LOCALE: Record<BioMesoLocale, BioMesoCopy> = { en: EN, ar: AR, ru: RU }

export function getBioMesoCopy(locale: string): BioMesoCopy {
  return BY_LOCALE[locale as BioMesoLocale] ?? EN
}
