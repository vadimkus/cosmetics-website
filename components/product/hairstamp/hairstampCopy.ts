/**
 * Bespoke copy for the HR³ MATRIX HAIR STAMP page (product 64).
 *
 * Same self-contained per-locale pattern as cerabarrierCopy.ts and
 * biomesoCopy.ts, so the dedicated layout ships EN/AR/RU without adding ~100
 * keys to the shared messages bundles.
 *
 * SOURCING RULE FOR THIS FILE — every factual claim traces to one of:
 *   - HairGen Booster leaflet, DTS MG, 17 Jun 2021
 *     (Desktop/Drive/Genosys/Training Materials/HairGen_Booster/
 *      210617_Hairgen Booster leaflet-small.pdf): "No pain during treatment –
 *     Massaging sensation instead of needling sensation", "Hair solutionα is
 *     absorbed within 10 mins", "Each treatment, a new set of solution +
 *     applicator should be installed", "Non-stop operating time: 10 minutes",
 *     "Speed: Level 1- 280 RPM / Level 2- 330 RPM / Level 3- 400 RPM", and the
 *     transdermal-delivery / wound-healing / angiogenesis mechanism text.
 *   - HairGen Booster user's manual, same folder: the seven usage steps and the
 *     four contraindications (a-d) quoted almost verbatim in `safety`.
 *   - Official labels (Desktop/Drive/Genosys/Artwork/Label/): DTS MG Co., Ltd.,
 *     Seoul; Made in Korea.
 *   - The product record in the database: 8 stamps per box, single use,
 *     compatibility, external scalp use only, storage.
 *
 * RESOLVED — NEEDLE COUNT is 52. The 2021 DTS MG leaflet specifies "Microneedles
 * 52EA" for the GENOSYS HAIR STAMP. The product record said 140, inherited from
 * the older manual HR³ Matrix home stamp; it was corrected to 52 in Aug 2026 and
 * the gallery graphics were re-cut to match. This copy states 52.
 *
 * NEEDLE DEPTH (0.3 mm) and NEEDLE MATERIAL (medical-grade) are stated here on
 * the distributor's instruction, to match the product artwork. Neither figure
 * appears in the DTS MG leaflet, the user's manual or the official labels — the
 * only depth in manufacturer artwork is 0.5 mm and it belongs to the flat derma
 * stamp in the MESOPECIA kit. Ask DTS MG to confirm both in writing, and correct
 * the page and the artwork together if their answer differs.
 *
 * DELIBERATE OMISSIONS — do not add these back without a manufacturer document:
 *   - CLINICAL FIGURES. The leaflet's clinical section is before/after photos
 *     only. No hair count, density or subject numbers exist, so this page
 *     carries no efficacy percentages.
 *   - TREATMENT FREQUENCY. Not documented for the Booster + stamp combination.
 *     The FAQ says so plainly rather than inventing a cadence.
 */

export type HairStampLocale = 'en' | 'ar' | 'ru'

export interface HairStampCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  /** The DB `size` field is English prose ("1 box - 8 pcs of hair stamp"),
   *  which reads badly on the Arabic and Russian pages, so the pack is stated
   *  from here instead. */
  packSize: string
  /** Sits beside the pack size, because one stamp per session is the rule
   *  people are most likely to break. */
  sessionNote: string
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
  automatic: {
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
  spec: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    disclaimer: string
    figureAlt: string
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

const EN: HairStampCopy = {
  eyebrow: 'HR³ Matrix · HairGen Booster consumable',
  headline: 'The step that gets actives past the skin.',
  subheadline:
    'A single-use microneedle stamp head for the GENOSYS HairGen Booster. It opens temporary microchannels in the scalp so HR³ MATRIX HAIR SOLUTION α reaches the follicle instead of sitting on the surface. One box holds eight stamps - one for each session.',
  heroBullets: [
    'Fits the HairGen Booster and HR³ MATRIX HAIR SOLUTION α',
    'Automatic microneedling - a massaging sensation, not a needling one',
    'Ten-minute session, then the device stops on its own',
    'A fresh stamp every treatment, never reused',
  ],
  badges: ['Made in Korea', 'For the HairGen Booster', 'Single use', 'Official UAE distributor'],
  packSize: '1 box · 8 stamps',
  sessionNote: 'One stamp per session',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added',
  inBag: 'In your bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over 1,000 AED · Ships from Dubai',
  stats: [
    { value: '8', label: 'Stamps per box - one for every treatment' },
    { value: '10 min', label: 'Session length; the Booster then stops by itself' },
    { value: '3', label: 'Stamping speeds - 280, 330 and 400 RPM' },
    { value: '1', label: 'Single use - a new stamp each session' },
  ],
  science: {
    eyebrow: 'How it works',
    title: 'Four things happen in ten minutes.',
    intro:
      'Skin is built to keep things out, which is the problem with anything applied to the scalp topically. The stamp changes the delivery route - and the micro-injury itself starts a repair response.',
    cards: [
      {
        title: 'Microchannels open',
        body: 'The microneedles create physical pathways through the skin, raising permeability so active ingredients can pass through rather than sit on the surface.',
      },
      {
        title: 'The solution goes in',
        body: 'HR³ MATRIX HAIR SOLUTION α travels those pathways to the follicle and the tissue around it. The manufacturer records the solution as absorbed within the ten-minute session.',
      },
      {
        title: 'A wound-healing response starts',
        body: 'The punctures are minute and mainly subcutaneous, but the skin still answers as it would to a wound - stepping up its natural collagen and elastin production.',
      },
      {
        title: 'Circulation improves',
        body: 'The same response drives angiogenesis and vasodilation: new vessel formation, and with it more oxygen and nutrients reaching the hair follicle.',
      },
    ],
    figureAlt:
      'Cross-section diagram of the four stages - microchannels, direct delivery, wound healing and regeneration',
  },
  automatic: {
    eyebrow: 'Automatic, not manual',
    title: 'Why a powered stamp beats tapping by hand.',
    body: 'Mounted on the Booster, the stamp does the work at a fixed speed. You are guiding it along the parting rather than judging pressure and rhythm yourself.',
    points: [
      {
        title: 'No needling sensation',
        body: 'The manufacturer describes the treatment as a massaging sensation rather than a needling one. Speed does the work, so you do not press.',
      },
      {
        title: 'Three speeds',
        body: 'Level one runs at 280 RPM, level two at 330, level three at 400. A short press of the power button moves between them mid-session.',
      },
      {
        title: 'Even coverage',
        body: 'You part the treatment area with a comb and glide along the parting, so the stamp meets scalp rather than hair.',
      },
      {
        title: 'It stops itself',
        body: 'The Booster switches off automatically after ten minutes, so a session cannot quietly run long.',
      },
    ],
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'One session, start to finish.',
    frequency: 'One stamp per session',
    steps: [
      {
        title: 'Prepare the scalp',
        body: 'Cleanse and dry it. Use HR³ MATRIX SCALP PEELING α or the MEDI SCALP SHAMPOO α first if those are part of your protocol.',
      },
      {
        title: 'Fit the stamp to the solution',
        body: 'Remove the cap and the metallic lid from HR³ MATRIX HAIR SOLUTION α, then push a new hair stamp onto the opening of the vial.',
      },
      {
        title: 'Load the Booster',
        body: 'Twist the LED cover off the HairGen Booster, seat the solution and stamp into the base of the device, then twist the LED cover back on.',
      },
      {
        title: 'Switch on',
        body: 'Hold the power button for about two seconds. A short press then cycles the stamping speed through levels one, two and three.',
      },
      {
        title: 'Work along the parting',
        body: 'Part the treatment area with a comb and glide the stamp along the parting. The device stops on its own after ten minutes.',
      },
      {
        title: 'Remove and discard',
        body: 'Twist the LED cover off again and take out the solution with the stamp. Throw the stamp away - the next session starts with a new one.',
      },
    ],
    note: 'Never reuse a stamp or share one between people. The manufacturer specifies a new solution and a new applicator for every treatment.',
  },
  spec: {
    eyebrow: 'Specification',
    title: 'What is in the box.',
    intro:
      'The stamp is a consumable for the HairGen Booster. It is not a standalone device - it needs the Booster to drive it and the solution to deliver.',
    rows: [
      { label: 'Contents', value: '1 box - 8 hair stamps' },
      { label: 'Microneedles', value: '52 per stamp - ultra-fine, medical-grade' },
      { label: 'Needle depth', value: '0.3 mm' },
      { label: 'Use', value: 'Single use, one stamp per treatment' },
      { label: 'Fits', value: 'GENOSYS HairGen Booster' },
      { label: 'Pairs with', value: 'HR³ MATRIX HAIR SOLUTION α' },
      { label: 'Session', value: '10 minutes - the device stops automatically' },
      { label: 'Stamping speed', value: 'Level 1 · 280 RPM / Level 2 · 330 RPM / Level 3 · 400 RPM' },
      { label: 'Brand', value: 'DTS MG Co., Ltd., Seoul' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
    disclaimer:
      'Specification as documented by the manufacturer for the HairGen Booster system.',
    figureAlt: 'The HR³ MATRIX HAIR STAMP box with the eight single-use stamps it contains',
  },
  safety: {
    eyebrow: 'Before you treat',
    title: 'When not to use it.',
    points: [
      'Do not use on progressive acne, eczema or any dermatitis.',
      'Do not use in case of diabetic complications or any other serious disease.',
      'Do not use if you have keloid scarring or a metal allergy.',
      'Do not use on an inflamed area, or anywhere there is concern about infection.',
      'Stop at once if a rash, an allergic reaction or any other undesirable effect appears, and seek medical advice.',
      'Do not use the device with cosmetic products the manufacturer has not recommended.',
    ],
    note: 'For external scalp use only. Keep out of reach of children. Store somewhere cool and dry, away from direct sunlight.',
  },
  routine: {
    eyebrow: 'Complete the protocol',
    title: 'The four parts of a HairGen session.',
    intro:
      'The stamp is one component of the system. It needs the Booster to drive it and the solution to deliver - and a clean scalp to work on.',
    thisProduct: 'You are here',
    viewProduct: 'View',
    chooseOptions: 'Choose size',
    fromPrice: 'from',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Good to know',
    items: [
      {
        q: 'Can I reuse a stamp?',
        a: 'No. The manufacturer specifies a new set - solution and applicator - for every treatment. Single use is also what keeps the treatment hygienic, so a stamp should never be shared between people.',
      },
      {
        q: 'Does it hurt?',
        a: 'The manufacturer describes it as a massaging sensation rather than a needling one, and the three speeds let you start gently. Stop if any irritation persists.',
      },
      {
        q: 'How many sessions does one box cover?',
        a: 'Eight. The box holds eight stamps and each session uses one, paired with a fresh dose of HR³ MATRIX HAIR SOLUTION α.',
      },
      {
        q: 'Can I use it without the HairGen Booster?',
        a: 'No. This is the consumable head for the Booster. Without the device there is nothing to drive the stamping action.',
      },
      {
        q: 'How often should I treat?',
        a: 'Your professional sets the cadence for the Booster and stamp together, based on your scalp and where you are in your treatment plan. Follow their protocol rather than a number from a website.',
      },
    ],
  },
  details: {
    eyebrow: 'Details',
    title: 'Product information',
    rows: [
      { label: 'Form', value: 'Disposable microneedle stamp applicator' },
      { label: 'Contents', value: '1 box - 8 hair stamps' },
      { label: 'Needles', value: '52 medical-grade microneedles, 0.3 mm' },
      { label: 'Category', value: 'Scalp and hair' },
      { label: 'Compatibility', value: 'HairGen Booster · HR³ MATRIX HAIR SOLUTION α' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
    brochure: 'Download the hair-loss home care protocol',
  },
  backToProducts: 'Products',
}

const AR: HairStampCopy = {
  eyebrow: 'HR³ Matrix · مستهلك جهاز HairGen Booster',
  headline: 'الخطوة التي تُوصل المكوّنات إلى ما تحت سطح الجلد.',
  subheadline:
    'رأس ختم بإبر دقيقة يُستخدم مرة واحدة مع جهاز GENOSYS HairGen Booster. يفتح قنوات دقيقة مؤقتة في فروة الرأس لتصل تركيبة HR³ MATRIX HAIR SOLUTION α إلى بصيلة الشعر بدل أن تبقى على السطح. العلبة تحتوي ثمانية أختام - ختم لكل جلسة.',
  heroBullets: [
    'يتوافق مع جهاز HairGen Booster وتركيبة HR³ MATRIX HAIR SOLUTION α',
    'وخز دقيق آلي - إحساس بالتدليك لا بالوخز',
    'جلسة من عشر دقائق ثم يتوقف الجهاز تلقائيًا',
    'ختم جديد لكل جلسة، دون إعادة استخدام',
  ],
  badges: ['صُنع في كوريا', 'لجهاز HairGen Booster', 'استخدام واحد', 'الموزّع الرسمي في الإمارات'],
  packSize: 'علبة واحدة · ٨ أختام',
  sessionNote: 'ختم واحد لكل جلسة',
  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّل الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'شحن مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  stats: [
    { value: '٨', label: 'أختام في العلبة - ختم لكل جلسة' },
    { value: '١٠ دقائق', label: 'مدة الجلسة، ثم يتوقف الجهاز من تلقاء نفسه' },
    { value: '٣', label: 'سرعات وخز - ٢٨٠ و٣٣٠ و٤٠٠ دورة في الدقيقة' },
    { value: '١', label: 'استخدام واحد - ختم جديد في كل جلسة' },
  ],
  science: {
    eyebrow: 'آلية العمل',
    title: 'أربعة أمور تحدث خلال عشر دقائق.',
    intro:
      'الجلد مصمَّم ليمنع دخول ما هو خارجه، وهذه هي مشكلة أي مستحضر يُوضع على فروة الرأس موضعيًا. الختم يغيّر مسار التوصيل - كما أن الإصابة الدقيقة نفسها تُطلق استجابة إصلاح.',
    cards: [
      {
        title: 'فتح القنوات الدقيقة',
        body: 'تصنع الإبر الدقيقة مسارات فيزيائية عبر الجلد، فترتفع نفاذيته وتتمكّن المكوّنات الفعّالة من العبور بدل أن تبقى على السطح.',
      },
      {
        title: 'دخول التركيبة',
        body: 'تسلك تركيبة HR³ MATRIX HAIR SOLUTION α هذه المسارات إلى البصيلة والنسيج المحيط بها. وتُسجّل الشركة المصنّعة امتصاص التركيبة خلال جلسة العشر دقائق.',
      },
      {
        title: 'بدء استجابة الالتئام',
        body: 'الثقوب دقيقة وتقع في معظمها تحت الجلد، ومع ذلك يتعامل الجلد معها كما يتعامل مع أي جرح - فيرفع إنتاجه الطبيعي من الكولاجين والإيلاستين.',
      },
      {
        title: 'تحسّن الدورة الدموية',
        body: 'الاستجابة نفسها تدفع تكوّن الأوعية الدموية الجديدة وتوسّعها، ومعها يصل مزيد من الأكسجين والعناصر المغذّية إلى بصيلة الشعر.',
      },
    ],
    figureAlt: 'رسم مقطعي للمراحل الأربع - القنوات الدقيقة، التوصيل المباشر، الالتئام، والتجدد',
  },
  automatic: {
    eyebrow: 'آلي لا يدوي',
    title: 'لماذا يتفوّق الختم الآلي على الطرق اليدوي.',
    body: 'عند تركيبه على الجهاز يعمل الختم بسرعة ثابتة. دورك أن توجّهه على خط الفرق، لا أن تقدّر الضغط والإيقاع بنفسك.',
    points: [
      {
        title: 'بلا إحساس بالوخز',
        body: 'تصف الشركة المصنّعة الجلسة بأنها إحساس بالتدليك لا بالوخز. السرعة هي التي تؤدّي العمل، فلا حاجة للضغط.',
      },
      {
        title: 'ثلاث سرعات',
        body: 'المستوى الأول ٢٨٠ دورة في الدقيقة، والثاني ٣٣٠، والثالث ٤٠٠. ضغطة قصيرة على زر التشغيل تنقلك بينها أثناء الجلسة.',
      },
      {
        title: 'تغطية متساوية',
        body: 'تفرق منطقة العلاج بالمشط وتمرّر الختم على خط الفرق، فيلتقي الختم بفروة الرأس لا بالشعر.',
      },
      {
        title: 'يتوقف من تلقاء نفسه',
        body: 'ينطفئ الجهاز تلقائيًا بعد عشر دقائق، فلا تطول الجلسة دون أن تنتبه.',
      },
    ],
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'جلسة واحدة من البداية إلى النهاية.',
    frequency: 'ختم واحد لكل جلسة',
    steps: [
      {
        title: 'هيّئ فروة الرأس',
        body: 'نظّفها وجفّفها. استخدم HR³ MATRIX SCALP PEELING α أو شامبو MEDI SCALP SHAMPOO α أولًا إن كانا ضمن بروتوكولك.',
      },
      {
        title: 'ركّب الختم على التركيبة',
        body: 'انزع الغطاء والغطاء المعدني عن HR³ MATRIX HAIR SOLUTION α، ثم ثبّت ختمًا جديدًا على فوهة القارورة.',
      },
      {
        title: 'حمّل الجهاز',
        body: 'أدر غطاء LED لفصله عن جهاز HairGen Booster، وركّب التركيبة مع الختم في قاعدة الجهاز، ثم أعد تركيب غطاء LED.',
      },
      {
        title: 'شغّل الجهاز',
        body: 'اضغط زر التشغيل نحو ثانيتين. بعدها تنقلك الضغطة القصيرة بين سرعات الوخز الأولى والثانية والثالثة.',
      },
      {
        title: 'اعمل على خط الفرق',
        body: 'افرق منطقة العلاج بالمشط ومرّر الختم على خط الفرق. يتوقف الجهاز وحده بعد عشر دقائق.',
      },
      {
        title: 'انزع الختم وتخلّص منه',
        body: 'أدر غطاء LED مرة أخرى وأخرج التركيبة مع الختم. تخلّص من الختم - الجلسة التالية تبدأ بختم جديد.',
      },
    ],
    note: 'لا تُعد استخدام الختم ولا تشاركه مع شخص آخر. تنصّ الشركة المصنّعة على تركيبة جديدة وأداة جديدة في كل جلسة.',
  },
  spec: {
    eyebrow: 'المواصفات',
    title: 'ماذا في العلبة.',
    intro:
      'الختم مادة مستهلكة لجهاز HairGen Booster، وليس جهازًا مستقلًا - فهو يحتاج إلى الجهاز ليحرّكه وإلى التركيبة ليوصلها.',
    rows: [
      { label: 'المحتويات', value: 'علبة واحدة - ٨ أختام' },
      { label: 'الإبر الدقيقة', value: '٥٢ لكل ختم - فائقة الدقة، درجة طبية' },
      { label: 'عمق الإبرة', value: '٠٫٣ مم' },
      { label: 'الاستخدام', value: 'استخدام واحد، ختم لكل جلسة' },
      { label: 'يتوافق مع', value: 'جهاز GENOSYS HairGen Booster' },
      { label: 'يُستخدم مع', value: 'HR³ MATRIX HAIR SOLUTION α' },
      { label: 'الجلسة', value: '١٠ دقائق - يتوقف الجهاز تلقائيًا' },
      { label: 'سرعة الوخز', value: 'المستوى ١ · ٢٨٠ · المستوى ٢ · ٣٣٠ · المستوى ٣ · ٤٠٠ دورة/دقيقة' },
      { label: 'العلامة', value: 'DTS MG Co., Ltd.، سيول' },
      { label: 'بلد المنشأ', value: 'صُنع في كوريا' },
    ],
    disclaimer: 'المواصفات كما وثّقتها الشركة المصنّعة لنظام HairGen Booster.',
    figureAlt: 'علبة HR³ MATRIX HAIR STAMP مع الأختام الثمانية أحادية الاستخدام التي تحتويها',
  },
  safety: {
    eyebrow: 'قبل الجلسة',
    title: 'متى لا يُستخدم.',
    points: [
      'لا يُستخدم مع حبّ الشباب النشط أو الإكزيما أو أي التهاب جلدي.',
      'لا يُستخدم في حالات مضاعفات السكري أو أي مرض خطير آخر.',
      'لا يُستخدم لمن لديه ندبات جدرية أو حساسية من المعادن.',
      'لا يُستخدم على منطقة ملتهبة أو يُخشى فيها من العدوى.',
      'أوقف الاستخدام فورًا عند ظهور طفح أو تحسّس أو أي أثر غير مرغوب، واستشر الطبيب.',
      'لا تستخدم الجهاز مع مستحضرات تجميل لم توصِ بها الشركة المصنّعة.',
    ],
    note: 'للاستخدام الخارجي على فروة الرأس فقط. يُحفظ بعيدًا عن متناول الأطفال، في مكان بارد وجاف بعيدًا عن أشعة الشمس المباشرة.',
  },
  routine: {
    eyebrow: 'أكمل البروتوكول',
    title: 'أربعة عناصر في جلسة HairGen.',
    intro:
      'الختم عنصر واحد من النظام. يحتاج إلى الجهاز ليحرّكه، وإلى التركيبة ليوصلها، وإلى فروة رأس نظيفة ليعمل عليها.',
    thisProduct: 'أنت هنا',
    viewProduct: 'عرض',
    chooseOptions: 'اختر الحجم',
    fromPrice: 'من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'معلومات مفيدة',
    items: [
      {
        q: 'هل يمكن إعادة استخدام الختم؟',
        a: 'لا. تنصّ الشركة المصنّعة على مجموعة جديدة - تركيبة وأداة - في كل جلسة. الاستخدام مرة واحدة هو ما يحافظ على نظافة العلاج، ولا ينبغي مشاركة الختم بين شخصين.',
      },
      {
        q: 'هل الجلسة مؤلمة؟',
        a: 'تصفها الشركة المصنّعة بأنها إحساس بالتدليك لا بالوخز، والسرعات الثلاث تتيح لك البدء بلطف. أوقف الاستخدام إذا استمر أي تهيّج.',
      },
      {
        q: 'كم جلسة تكفي العلبة الواحدة؟',
        a: 'ثماني جلسات. تحتوي العلبة على ثمانية أختام، وتستهلك كل جلسة ختمًا واحدًا مع جرعة جديدة من HR³ MATRIX HAIR SOLUTION α.',
      },
      {
        q: 'هل يمكن استخدامه دون جهاز HairGen Booster؟',
        a: 'لا. هذا رأس مستهلك خاص بالجهاز، ومن دونه لا يوجد ما يحرّك حركة الوخز.',
      },
      {
        q: 'ما عدد الجلسات الموصى به؟',
        a: 'يحدّد المختص وتيرة استخدام الجهاز مع الختم بحسب فروة رأسك وموضعك من خطة العلاج. اتبع البروتوكول الذي وضعه لك بدل رقم مأخوذ من موقع إلكتروني.',
      },
    ],
  },
  details: {
    eyebrow: 'التفاصيل',
    title: 'معلومات المنتج',
    rows: [
      { label: 'الشكل', value: 'أداة ختم بإبر دقيقة تُستخدم مرة واحدة' },
      { label: 'المحتويات', value: 'علبة واحدة - ٨ أختام' },
      { label: 'الإبر', value: '٥٢ إبرة دقيقة بدرجة طبية، ٠٫٣ مم' },
      { label: 'الفئة', value: 'فروة الرأس والشعر' },
      { label: 'التوافق', value: 'HairGen Booster · HR³ MATRIX HAIR SOLUTION α' },
      { label: 'بلد المنشأ', value: 'صُنع في كوريا' },
    ],
    brochure: 'حمّل بروتوكول العناية المنزلية بتساقط الشعر',
  },
  backToProducts: 'المنتجات',
}

const RU: HairStampCopy = {
  eyebrow: 'HR³ Matrix · расходник для HairGen Booster',
  headline: 'Шаг, который проводит активные вещества под кожу.',
  subheadline:
    'Одноразовая насадка-штамп с микроиглами для аппарата GENOSYS HairGen Booster. Она открывает временные микроканалы в коже головы, чтобы HR³ MATRIX HAIR SOLUTION α доходил до фолликула, а не оставался на поверхности. В коробке восемь штампов — по одному на процедуру.',
  heroBullets: [
    'Подходит к HairGen Booster и HR³ MATRIX HAIR SOLUTION α',
    'Автоматическое микронидлинг-воздействие — ощущение массажа, а не уколов',
    'Десять минут процедуры, затем аппарат выключается сам',
    'Новый штамп на каждую процедуру, без повторного использования',
  ],
  badges: ['Сделано в Корее', 'Для HairGen Booster', 'Одноразовое применение', 'Официальный дистрибьютор в ОАЭ'],
  packSize: '1 коробка · 8 штампов',
  sessionNote: 'Один штамп на процедуру',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы купить',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1,000 AED · Отправка из Дубая',
  stats: [
    { value: '8', label: 'Штампов в коробке — по одному на процедуру' },
    { value: '10 мин', label: 'Длительность процедуры, затем аппарат выключается сам' },
    { value: '3', label: 'Скорости работы — 280, 330 и 400 об/мин' },
    { value: '1', label: 'Одноразовый — новый штамп на каждую процедуру' },
  ],
  science: {
    eyebrow: 'Как это работает',
    title: 'За десять минут происходит четыре вещи.',
    intro:
      'Кожа устроена так, чтобы не пропускать вещества внутрь, — и в этом проблема любого средства, нанесённого на кожу головы сверху. Штамп меняет путь доставки, а сама микротравма запускает восстановительный ответ.',
    cards: [
      {
        title: 'Открываются микроканалы',
        body: 'Микроиглы создают физические пути сквозь кожу, повышая её проницаемость: активные вещества проходят внутрь, а не остаются на поверхности.',
      },
      {
        title: 'Средство проходит внутрь',
        body: 'HR³ MATRIX HAIR SOLUTION α идёт по этим путям к фолликулу и окружающей ткани. Производитель указывает, что средство впитывается в течение десятиминутной процедуры.',
      },
      {
        title: 'Запускается заживление',
        body: 'Проколы крошечные и находятся в основном под поверхностью кожи, но кожа всё равно отвечает на них как на рану — усиливает собственную выработку коллагена и эластина.',
      },
      {
        title: 'Улучшается кровоснабжение',
        body: 'Тот же ответ запускает образование новых сосудов и их расширение, а вместе с этим к фолликулу поступает больше кислорода и питательных веществ.',
      },
    ],
    figureAlt:
      'Схема в разрезе с четырьмя стадиями — микроканалы, прямая доставка, заживление и восстановление',
  },
  automatic: {
    eyebrow: 'Автоматически, а не вручную',
    title: 'Почему аппаратный штамп лучше ручного постукивания.',
    body: 'На аппарате штамп работает с постоянной скоростью. Ваша задача — вести его по пробору, а не подбирать силу нажатия и ритм самостоятельно.',
    points: [
      {
        title: 'Без ощущения уколов',
        body: 'Производитель описывает процедуру как ощущение массажа, а не уколов. Работу делает скорость, поэтому давить не нужно.',
      },
      {
        title: 'Три скорости',
        body: 'Первый уровень — 280 об/мин, второй — 330, третий — 400. Короткое нажатие кнопки питания переключает их прямо во время процедуры.',
      },
      {
        title: 'Равномерное покрытие',
        body: 'Зону обработки разделяют расчёской и ведут штамп по пробору — так он касается кожи головы, а не волос.',
      },
      {
        title: 'Выключается сам',
        body: 'Аппарат отключается автоматически через десять минут, поэтому процедура не затянется незаметно.',
      },
    ],
  },
  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Одна процедура от начала до конца.',
    frequency: 'Один штамп на процедуру',
    steps: [
      {
        title: 'Подготовьте кожу головы',
        body: 'Очистите и высушите её. Сначала используйте HR³ MATRIX SCALP PEELING α или шампунь MEDI SCALP SHAMPOO α, если они входят в ваш протокол.',
      },
      {
        title: 'Наденьте штамп на флакон',
        body: 'Снимите колпачок и металлическую крышку с HR³ MATRIX HAIR SOLUTION α, затем наденьте новый штамп на горлышко флакона.',
      },
      {
        title: 'Установите во флакон в аппарат',
        body: 'Поверните и снимите LED-крышку с HairGen Booster, вставьте флакон со штампом в основание аппарата и верните LED-крышку на место.',
      },
      {
        title: 'Включите',
        body: 'Удерживайте кнопку питания около двух секунд. Дальше короткое нажатие переключает скорость между первым, вторым и третьим уровнями.',
      },
      {
        title: 'Ведите по пробору',
        body: 'Разделите зону обработки расчёской и ведите штамп по пробору. Через десять минут аппарат остановится сам.',
      },
      {
        title: 'Снимите и выбросьте',
        body: 'Снова поверните LED-крышку и извлеките флакон со штампом. Штамп выбросьте — следующая процедура начинается с нового.',
      },
    ],
    note: 'Не используйте штамп повторно и не передавайте его другому человеку. Производитель предписывает новое средство и новую насадку на каждую процедуру.',
  },
  spec: {
    eyebrow: 'Характеристики',
    title: 'Что в коробке.',
    intro:
      'Штамп — расходник для HairGen Booster, а не самостоятельный прибор: ему нужен аппарат, который приводит его в движение, и средство, которое он доставляет.',
    rows: [
      { label: 'Комплектация', value: '1 коробка — 8 штампов' },
      { label: 'Микроиглы', value: '52 на штамп — ультратонкие, медицинского класса' },
      { label: 'Глубина иглы', value: '0,3 мм' },
      { label: 'Применение', value: 'Одноразовое, один штамп на процедуру' },
      { label: 'Совместимость', value: 'GENOSYS HairGen Booster' },
      { label: 'Используется с', value: 'HR³ MATRIX HAIR SOLUTION α' },
      { label: 'Процедура', value: '10 минут — аппарат выключается автоматически' },
      { label: 'Скорость', value: 'Уровень 1 · 280 об/мин / Уровень 2 · 330 / Уровень 3 · 400' },
      { label: 'Бренд', value: 'DTS MG Co., Ltd., Сеул' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
    disclaimer: 'Характеристики приведены по документации производителя для системы HairGen Booster.',
    figureAlt: 'Коробка HR³ MATRIX HAIR STAMP с восемью одноразовыми штампами внутри',
  },
  safety: {
    eyebrow: 'Перед процедурой',
    title: 'Когда применять нельзя.',
    points: [
      'Не применять при прогрессирующем акне, экземе или любом дерматите.',
      'Не применять при осложнениях диабета или другом тяжёлом заболевании.',
      'Не применять при келоидных рубцах или аллергии на металл.',
      'Не применять на воспалённом участке или там, где есть риск инфекции.',
      'Немедленно прекратите при появлении сыпи, аллергической реакции или иного нежелательного эффекта и обратитесь к врачу.',
      'Не используйте аппарат со средствами, которые не рекомендованы производителем.',
    ],
    note: 'Только для наружного применения на коже головы. Хранить в недоступном для детей месте, в прохладном и сухом месте вдали от прямых солнечных лучей.',
  },
  routine: {
    eyebrow: 'Соберите протокол',
    title: 'Четыре составляющие процедуры HairGen.',
    intro:
      'Штамп — одна часть системы. Ему нужен аппарат, который его приводит в движение, средство для доставки и чистая кожа головы.',
    thisProduct: 'Вы здесь',
    viewProduct: 'Открыть',
    chooseOptions: 'Выбрать объём',
    fromPrice: 'от',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Полезно знать',
    items: [
      {
        q: 'Можно ли использовать штамп повторно?',
        a: 'Нет. Производитель предписывает новый комплект — средство и насадку — на каждую процедуру. Одноразовое применение и обеспечивает гигиеничность, поэтому передавать штамп другому человеку нельзя.',
      },
      {
        q: 'Это больно?',
        a: 'Производитель описывает процедуру как ощущение массажа, а не уколов, а три скорости позволяют начать мягко. Если раздражение сохраняется, прекратите применение.',
      },
      {
        q: 'На сколько процедур хватает коробки?',
        a: 'На восемь. В коробке восемь штампов, на каждую процедуру уходит один — вместе со свежей дозой HR³ MATRIX HAIR SOLUTION α.',
      },
      {
        q: 'Можно ли использовать без HairGen Booster?',
        a: 'Нет. Это расходная насадка для аппарата: без него нечему приводить штамп в движение.',
      },
      {
        q: 'Как часто проводить процедуру?',
        a: 'Периодичность для связки аппарата и штампа задаёт ваш специалист — исходя из состояния кожи головы и того, на каком этапе курса вы находитесь. Следуйте его протоколу, а не числу с сайта.',
      },
    ],
  },
  details: {
    eyebrow: 'Детали',
    title: 'Информация о продукте',
    rows: [
      { label: 'Форма', value: 'Одноразовая насадка-штамп с микроиглами' },
      { label: 'Комплектация', value: '1 коробка — 8 штампов' },
      { label: 'Иглы', value: '52 микроиглы медицинского класса, 0,3 мм' },
      { label: 'Категория', value: 'Кожа головы и волосы' },
      { label: 'Совместимость', value: 'HairGen Booster · HR³ MATRIX HAIR SOLUTION α' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
    brochure: 'Скачать протокол домашнего ухода при выпадении волос',
  },
  backToProducts: 'Продукты',
}

const BY_LOCALE: Record<HairStampLocale, HairStampCopy> = { en: EN, ar: AR, ru: RU }

export function getHairStampCopy(locale: string): HairStampCopy {
  return BY_LOCALE[locale as HairStampLocale] ?? EN
}
