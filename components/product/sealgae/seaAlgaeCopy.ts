/**
 * Bespoke copy for SOOTHING BOMB SEA ALGAE MASK (product 36), in the three
 * languages the site ships.
 *
 * SOURCES:
 *   - the DTS MG ingredient report: methylpropanediol 10%, glycerin 5.035%,
 *     betaine 0.5%, allantoin 0.1%, panthenol 0.1%, gardenia fruit extract as
 *     the colorant, peppermint oil 0.005%.
 *   - the COA: pH 5.69 inside a 5.00-6.00 specification, at least 25 g of
 *     essence, bacteria under a tenth of the permitted limit, 30-month shelf life.
 *   - the registered pouch artwork (Registration DOC/Artwork): "provides
 *     intensive relief to the skin and moisturizes skin with sea algae complex
 *     and centella asiatica extract", DERMATOLOGICALLY TESTED, no artificial
 *     pigment, the Snow Booster prep step and the precautions.
 *   - the DTS MG deck, slide 2, for the Eucalace® sheet.
 *
 * MUST STAY OUT: the deck's ingredient physiology (wound healing, collagen
 * synthesis, tyrosinase inhibition, sebum control, detoxifying), any hydration
 * percentage, a use frequency, the contract manufacturer's name and lot codes.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface SeaAlgaeCopy {
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
  loginToShop: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string

  stats: Array<{ value: string; label: string }>

  sheet: {
    eyebrow: string
    title: string
    intro: string
    points: Array<{ title: string; body: string }>
  }

  formula: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; amount: string; role: string }
    rows: Array<{ name: string; amount: string; role: string }>
    note: string
  }

  sea: {
    eyebrow: string
    title: string
    body: string
    aside: string
  }

  colour: {
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

  when: {
    eyebrow: string
    title: string
    intro: string
    items: string[]
  }

  video: { title: string; body: string; unsupported: string }

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

const EN: SeaAlgaeCopy = {
  eyebrow: 'Soothing Bomb Sea Algae Mask · One sheet',
  headline: 'Calm on contact.',
  subheadline:
    'One eucalyptus-fibre sheet soaked in 25 g of cool essence: glycerin, methylpropanediol and betaine to hydrate, allantoin and panthenol to calm, with sea algae and centella asiatica. Twenty minutes after sun, after a flight, or on any evening your face feels tight and hot.',
  heroBullets: [
    'Eucalace® eucalyptus sheet: it breathes, and it holds more essence',
    'Glycerin 5% and methylpropanediol 10% for real hydration',
    'Allantoin and panthenol for tight, hot skin',
    'Sea algae and centella asiatica, dermatologically tested',
  ],
  badges: ['Made in Korea', '1 sheet · 25 g', 'Dermatologically tested', 'No artificial pigment'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to see price',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '15-20', label: 'Minutes from tight to calm' },
    { value: '5%', label: 'Glycerin in the essence' },
    { value: '25 g', label: 'Of essence in one sheet' },
    { value: 'pH 5.7', label: 'Close to healthy skin' },
  ],

  sheet: {
    eyebrow: 'The sheet',
    title: 'The sheet makes the mask',
    intro:
      'This essence sits in Eucalace®, a eucalyptus spunlace that holds more, breathes better and clings closer than the usual nonwoven.',
    points: [
      {
        title: 'Finer fibre, more essence',
        body: 'The fibres are finer and packed at a higher count than a standard nonwoven of the same size, so the sheet carries more essence and gives more of it to your skin.',
      },
      {
        title: 'It breathes',
        body: 'Air passes through the spunlace, so a warm face stays comfortable for the full twenty minutes.',
      },
      {
        title: 'Nothing but fibre',
        body: 'Bonded with water jets, not adhesive: the surface on your face is clean, soft fibre with no chemical residue.',
      },
      {
        title: 'It stays put',
        body: 'Fine and high-adhesion, it follows the curve of the jaw and the bridge of the nose instead of lifting off while you lie still.',
      },
    ],
  },

  formula: {
    eyebrow: 'In the essence',
    title: 'Hydration you can count',
    intro: 'Five ingredients carry the mask, and every one of them is here at a percentage you can read.',
    columns: { name: 'Ingredient', amount: 'Concentration', role: 'What it does' },
    rows: [
      { name: 'Methylpropanediol', amount: '10.00%', role: 'Draws water in and carries the essence' },
      { name: 'Glycerin', amount: '5.04%', role: 'The classic humectant, holding moisture in the skin' },
      { name: 'Betaine', amount: '0.50%', role: 'A gentle second humectant for reactive skin' },
      { name: 'Allantoin', amount: '0.10%', role: 'Soothes and takes the edge off irritation' },
      { name: 'Panthenol', amount: '0.10%', role: 'Provitamin B5, for comfort and the barrier' },
      { name: 'Peppermint oil', amount: '0.005%', role: 'The cool note you feel as it goes on' },
    ],
    note:
      'Humectants hydrate, allantoin and panthenol settle, and a touch of peppermint keeps it cool. No acids and no strong actives, so it is kind to skin that has had a long day.',
  },

  sea: {
    eyebrow: 'From the sea',
    title: 'Sea algae and centella',
    body:
      'Two sea algae meet centella asiatica in the essence: Jania rubens, a red coralline alga, and Undaria pinnatifida, the brown kelp better known as wakame. Witch hazel leaf, bamboo and chestnut shell complete the botanical side.',
    aside: 'Intensive relief and moisture in one sheet: the promise in the name.',
  },

  colour: {
    eyebrow: 'The colour',
    title: 'Green by nature',
    body: 'The essence takes its green from gardenia fruit extract. No artificial pigment, nothing added just for looks.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Cleanse, apply, relax, pat',
    frequency: 'Whenever skin needs it · one sheet, straight from the pouch',
    steps: [
      {
        title: 'Start on clean skin',
        body: 'Cleanse and pat dry, then mist on GENOSYS Snow Booster so the sheet has a damp surface to work on.',
      },
      {
        title: 'Smooth it on',
        body: 'Unfold the sheet and press it along the nose, the jaw and under the eyes so every part of it touches the skin.',
      },
      {
        title: 'Fifteen to twenty minutes',
        body: 'Lie back and let it work. Take it off while it is still wet, before it starts to dry.',
      },
      {
        title: 'Pat the rest in',
        body: 'Lift the sheet and press the remaining essence in with your fingertips. No rinse. Follow with a moisturiser if your skin is dry.',
      },
    ],
    note: 'Use it as soon as you open the pouch: one sheet, one use.',
  },

  when: {
    eyebrow: 'When to reach for it',
    title: 'The evenings it is made for',
    intro: 'Reach for it whenever your skin needs settling.',
    items: [
      'After a day in the sun, once the skin has cooled',
      'Off a long flight, when everything feels tight',
      'The evening after a peel or a needling session, if your clinic has cleared it',
      'Mid-summer in the Gulf, when air conditioning has dried you out',
      'Before an event, for the fresh, plump look of well-hydrated skin',
    ],
  },

  video: {
    title: 'See the sheet',
    body: 'How the fabric unfolds, how it sits, and how much essence comes with it.',
    unsupported: 'Your browser does not support the video tag.',
  },

  actives: {
    eyebrow: 'The formula',
    title: 'Everything in the essence',
    intro: 'The key ingredients and what each one brings, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the pouch in your hand.',
  },

  lab: {
    eyebrow: 'Quality',
    title: 'Clean, tested, Korean',
    intro: 'Made in Korea to a tight specification, and every batch is tested before it ships.',
    rows: [
      { label: 'pH', value: '5.69, inside a 5.00-6.00 specification: close to healthy skin' },
      { label: 'Essence', value: 'At least 25 g in every pouch' },
      { label: 'Purity', value: 'The latest batch came back ten times cleaner than the microbial limit' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Shelf life', value: 'Thirty months unopened, with the expiry date on the pouch' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'For external use only. Avoid the eyes and mucous membranes, and rinse thoroughly with cool water on contact.',
      'Do not use directly around the eyes.',
      'Stop and see a doctor if redness, swelling or irritation appears.',
      'If you react to bandages or compresses, use it with caution.',
      'Use immediately after opening, and do not keep a part-used sheet.',
      'Store cool and dry, out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS pouch.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: 'One sheet, 25 g of essence' },
      { label: 'Sheet', value: 'Eucalace® eucalyptus spunlace' },
      { label: 'Wear time', value: '15-20 minutes' },
      { label: 'pH', value: '5.00-6.00' },
      { label: 'For', value: 'Tight, hot and sensitive skin, and after professional treatments' },
      { label: 'Colour', value: 'Green, from gardenia fruit extract - no artificial pigment' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'What does it feel like?',
        a: 'Cool and wet the moment it goes on, from a sheet soaked through with 25 g of essence and a touch of peppermint. Then you lie back for twenty minutes.',
      },
      {
        q: 'How long should I leave it on?',
        a: 'Fifteen to twenty minutes. Take it off while the sheet is still wet, then pat the remaining essence in.',
      },
      {
        q: 'Can I use it after a peel or needling?',
        a: 'It is a favourite way to finish a session: a light, cool essence with allantoin and panthenol, no acids and no strong actives. Follow the waiting period your clinic gave you.',
      },
      {
        q: 'Does it need rinsing off?',
        a: 'No. Take the sheet off and pat the remaining essence in. If your skin is dry, put a moisturiser over the top to hold it there.',
      },
      {
        q: 'How often can I use one?',
        a: 'As often as your skin asks for it. Nothing in the formula needs a rest between uses.',
      },
      {
        q: 'Why is it green?',
        a: 'Gardenia fruit extract gives the essence its colour. There is no artificial pigment in it.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: SeaAlgaeCopy = {
  eyebrow: 'قناع Soothing Bomb بالطحالب البحرية · ورقة واحدة',
  headline: 'هدوء من أول لمسة.',
  subheadline:
    'ورقة واحدة من ألياف الأوكالبتوس مشبعة بـ25 غ من خلاصة منعشة: غليسرين وميثيل بروبانديول وبيتايين للترطيب، وألانتوين وبانثينول للتهدئة، مع الطحالب البحرية والسنتيلا الآسيوية. عشرون دقيقة بعد الشمس، أو بعد السفر، أو في أي مساء تشعرين فيه بشدّ وحرارة في وجهك.',
  heroBullets: [
    'ورقة Eucalace® من الأوكالبتوس: تتنفس، وتحمل خلاصة أكثر',
    'غليسرين 5% وميثيل بروبانديول 10% لترطيب حقيقي',
    'ألانتوين وبانثينول للبشرة المشدودة والحارة',
    'طحالب بحرية وسنتيلا آسيوية، وخضع لاختبار جلدي',
  ],
  badges: ['صُنع في كوريا', 'ورقة واحدة · 25 غ', 'خضع لاختبار جلدي', 'دون أصباغ صناعية'],

  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى السلة',
  inBag: 'في السلة',
  viewBag: 'عرض السلة',
  loginToShop: 'سجّلي الدخول لعرض السعر',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '15-20', label: 'دقيقة من الشدّ إلى الهدوء' },
    { value: '5%', label: 'غليسرين في الخلاصة' },
    { value: '25 غ', label: 'من الخلاصة في ورقة واحدة' },
    { value: 'pH 5.7', label: 'قريبة من البشرة الصحية' },
  ],

  sheet: {
    eyebrow: 'الورقة',
    title: 'الورقة تصنع القناع',
    intro:
      'تستقر هذه الخلاصة في Eucalace®، نسيج سبانليس من الأوكالبتوس يحمل أكثر ويتنفس أفضل ويلتصق أقرب من النسيج المعتاد.',
    points: [
      {
        title: 'ألياف أدق، خلاصة أكثر',
        body: 'الألياف أدق وبكثافة أعلى من نسيج قياسي بالمساحة نفسها، فتحمل الورقة خلاصة أكثر وتمنح بشرتك منها أكثر.',
      },
      {
        title: 'تتنفس',
        body: 'يمر الهواء عبر ألياف السبانليس، فتبقى البشرة الدافئة مرتاحة طوال عشرين دقيقة.',
      },
      {
        title: 'ألياف فقط',
        body: 'تُربط بنفاثات الماء لا باللواصق: السطح الملامس لوجهك ألياف نظيفة وناعمة بلا أي بقايا كيميائية.',
      },
      {
        title: 'تبقى مكانها',
        body: 'رقيقة وعالية الالتصاق، تتبع انحناء الفك وجسر الأنف بدل أن ترتفع عنهما وأنتِ مستلقية.',
      },
    ],
  },

  formula: {
    eyebrow: 'في الخلاصة',
    title: 'ترطيب بالأرقام',
    intro: 'خمسة مكوّنات تحمل القناع، وكل منها موجود بنسبة يمكنك قراءتها.',
    columns: { name: 'المكوّن', amount: 'التركيز', role: 'ما يفعله' },
    rows: [
      { name: 'Methylpropanediol', amount: '10.00%', role: 'يجذب الماء ويحمل الخلاصة' },
      { name: 'Glycerin', amount: '5.04%', role: 'المرطّب الكلاسيكي الذي يحفظ الرطوبة في البشرة' },
      { name: 'Betaine', amount: '0.50%', role: 'مرطّب ثانٍ لطيف على البشرة التفاعلية' },
      { name: 'Allantoin', amount: '0.10%', role: 'يهدّئ ويخفف حدة التهيّج' },
      { name: 'Panthenol', amount: '0.10%', role: 'بروفيتامين B5 للراحة وحاجز البشرة' },
      { name: 'Peppermint oil', amount: '0.005%', role: 'لمسة البرودة التي تشعرين بها عند وضعه' },
    ],
    note:
      'المرطّبات ترطّب، والألانتوين والبانثينول يهدّئان، ولمسة من النعناع تبقيه منعشاً. بلا أحماض ولا مكوّنات فعّالة قوية، فهو لطيف على بشرة مرّت بيوم طويل.',
  },

  sea: {
    eyebrow: 'من البحر',
    title: 'طحالب بحرية وسنتيلا',
    body:
      'يلتقي نوعان من الطحالب البحرية بالسنتيلا الآسيوية في الخلاصة: Jania rubens، طحلب مرجاني أحمر، وUndaria pinnatifida، الطحلب البني المعروف باسم واكامي. وتكمل أوراق بندق الساحرة والخيزران وقشر الكستناء الجانب النباتي.',
    aside: 'راحة مكثفة وترطيب في ورقة واحدة: هذا ما يعد به الاسم.',
  },

  colour: {
    eyebrow: 'اللون',
    title: 'أخضر بطبيعته',
    body: 'تأخذ الخلاصة لونها الأخضر من خلاصة ثمار الغاردينيا. دون أصباغ صناعية، ولا شيء يُضاف للمظهر فقط.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'نظّفي، ضعي، استرخي، ربّتي',
    frequency: 'وقتما تحتاجه البشرة · ورقة واحدة، مباشرة من الكيس',
    steps: [
      {
        title: 'ابدئي على بشرة نظيفة',
        body: 'نظّفي البشرة وجفّفيها بالتربيت، ثم رشّي GENOSYS Snow Booster لتعمل الورقة على سطح رطب.',
      },
      {
        title: 'ضعيها بإحكام',
        body: 'افردي الورقة واضغطيها على الأنف والفك وتحت العينين ليلامس كل جزء منها البشرة.',
      },
      {
        title: 'من خمس عشرة إلى عشرين دقيقة',
        body: 'استلقي ودعيها تعمل. ارفعيها وهي لا تزال رطبة، قبل أن تبدأ بالجفاف.',
      },
      {
        title: 'ربّتي الباقي',
        body: 'ارفعي الورقة واضغطي الخلاصة المتبقية بأطراف أصابعك. دون شطف. واتبعيها بمرطّب إن كانت بشرتك جافة.',
      },
    ],
    note: 'استخدميها فور فتح الكيس: ورقة واحدة لاستخدام واحد.',
  },

  when: {
    eyebrow: 'متى تلجئين إليه',
    title: 'الأمسيات التي صُنع لها',
    intro: 'استخدميه كلما احتاجت بشرتك إلى الهدوء.',
    items: [
      'بعد يوم في الشمس، حين تبرد البشرة',
      'بعد رحلة طويلة، حين يصبح كل شيء مشدوداً',
      'مساء اليوم التالي للتقشير أو الوخز، إن سمحت عيادتك',
      'في منتصف صيف الخليج، حين يجفّفك التكييف',
      'قبل مناسبة، لإطلالة منتعشة وممتلئة لبشرة مرطّبة جيداً',
    ],
  },

  video: {
    title: 'شاهدي الورقة',
    body: 'كيف تُفرد، وكيف تستقر، وكم من الخلاصة يأتي معها.',
    unsupported: 'متصفحك لا يدعم تشغيل الفيديو.',
  },

  actives: {
    eyebrow: 'التركيبة',
    title: 'كل ما في الخلاصة',
    intro: 'المكوّنات الرئيسية وما يقدمه كل منها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على الكيس بين يديك.',
  },

  lab: {
    eyebrow: 'الجودة',
    title: 'نظيف، مُختبر، كوري',
    intro: 'صُنع في كوريا وفق مواصفة دقيقة، وتُختبر كل دفعة قبل شحنها.',
    rows: [
      { label: 'الحموضة', value: '5.69 ضمن مواصفة 5.00-6.00: قريبة من البشرة الصحية' },
      { label: 'الخلاصة', value: '25 غ على الأقل في كل كيس' },
      { label: 'النقاء', value: 'جاءت أحدث دفعة أنظف بعشر مرات من الحد الميكروبي' },
      { label: 'الاختبار', value: 'خضع لاختبار جلدي' },
      { label: 'مدة الصلاحية', value: 'ثلاثون شهراً مغلقاً، وتاريخ الانتهاء على الكيس' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'للاستعمال الخارجي فقط. تجنّبي العينين والأغشية المخاطية، واشطفي جيداً بالماء البارد عند الملامسة.',
      'لا تستعمليه مباشرة حول العينين.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'إن كنتِ تتحسّسين من الضمادات أو الكمادات فاستعمليه بحذر.',
      'استعمليه فور الفتح، ولا تحتفظي بورقة مستعملة جزئياً.',
      'يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على كيس GENOSYS.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: 'ورقة واحدة، 25 غ من الخلاصة' },
      { label: 'الورقة', value: 'نسيج Eucalace® سبانليس من الأوكالبتوس' },
      { label: 'مدة الوضع', value: '15-20 دقيقة' },
      { label: 'الحموضة', value: '5.00-6.00' },
      { label: 'مناسب لـ', value: 'البشرة المشدودة والحارة والحساسة، وبعد الإجراءات الاحترافية' },
      { label: 'اللون', value: 'أخضر من خلاصة ثمار الغاردينيا - دون أصباغ صناعية' },
      { label: 'الاختبار', value: 'خضع لاختبار جلدي' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'كيف أشعر به؟',
        a: 'بارد ورطب من لحظة وضعه، من ورقة مشبعة بـ25 غ من الخلاصة ولمسة من النعناع. ثم تستلقين عشرين دقيقة.',
      },
      {
        q: 'كم أتركه على وجهي؟',
        a: 'من خمس عشرة إلى عشرين دقيقة. ارفعي الورقة وهي لا تزال رطبة، ثم ربّتي الخلاصة المتبقية.',
      },
      {
        q: 'هل أستخدمه بعد التقشير أو الوخز؟',
        a: 'هو طريقة محببة لإنهاء الجلسة: خلاصة خفيفة ومنعشة مع ألانتوين وبانثينول، بلا أحماض ولا مكوّنات فعّالة قوية. التزمي بمدة الانتظار التي حددتها عيادتك.',
      },
      {
        q: 'هل يحتاج إلى شطف؟',
        a: 'لا. ارفعي الورقة وربّتي الخلاصة المتبقية. وإن كانت بشرتك جافة فضعي مرطّباً فوقها ليثبتها.',
      },
      {
        q: 'كم مرة أستطيع استعماله؟',
        a: 'كلما طلبته بشرتك. لا شيء في التركيبة يحتاج إلى راحة بين الاستعمالات.',
      },
      {
        q: 'لماذا لونه أخضر؟',
        a: 'تمنح خلاصة ثمار الغاردينيا الخلاصة لونها. ولا توجد فيه أصباغ صناعية.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: SeaAlgaeCopy = {
  eyebrow: 'Soothing Bomb Sea Algae Mask · Одна тканевая маска',
  headline: 'Спокойствие с первого касания.',
  subheadline:
    'Одно полотно из эвкалиптового волокна, пропитанное 25 г прохладной эссенции: глицерин, метилпропандиол и бетаин увлажняют, аллантоин и пантенол успокаивают, а рядом с ними морские водоросли и центелла азиатская. Двадцать минут после солнца, после перелёта или в любой вечер, когда лицо стянуто и горячее.',
  heroBullets: [
    'Полотно Eucalace® из эвкалипта: дышит и держит больше эссенции',
    'Глицерин 5% и метилпропандиол 10% для настоящего увлажнения',
    'Аллантоин и пантенол для стянутой, горячей кожи',
    'Морские водоросли и центелла, дерматологически протестировано',
  ],
  badges: ['Сделано в Корее', '1 маска · 25 г', 'Дерматологически протестировано', 'Без искусственных красителей'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы увидеть цену',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '15-20', label: 'минут от стянутости к спокойствию' },
    { value: '5%', label: 'глицерина в эссенции' },
    { value: '25 г', label: 'эссенции в одной маске' },
    { value: 'pH 5,7', label: 'близко к здоровой коже' },
  ],

  sheet: {
    eyebrow: 'Полотно',
    title: 'Маску делает полотно',
    intro:
      'Эта эссенция лежит в Eucalace® - эвкалиптовом спанлейсе, который держит больше, дышит лучше и прилегает плотнее обычного нетканого полотна.',
    points: [
      {
        title: 'Тоньше волокно, больше эссенции',
        body: 'Волокна тоньше и плотнее, чем у стандартного нетканого полотна той же площади, поэтому маска несёт больше эссенции и отдаёт её коже.',
      },
      {
        title: 'Оно дышит',
        body: 'Воздух проходит сквозь спанлейс, и тёплой коже комфортно все двадцать минут.',
      },
      {
        title: 'Только волокно',
        body: 'Спанлейс скрепляют водяными струями, а не клеем: к лицу прилегает чистое мягкое волокно без химических остатков.',
      },
      {
        title: 'Держится на месте',
        body: 'Тонкое и с высокой адгезией, оно повторяет линию челюсти и спинку носа и не отходит, пока вы лежите.',
      },
    ],
  },

  formula: {
    eyebrow: 'В эссенции',
    title: 'Увлажнение в цифрах',
    intro: 'Пять ингредиентов несут маску, и у каждого есть процент, который можно прочитать.',
    columns: { name: 'Ингредиент', amount: 'Концентрация', role: 'Что делает' },
    rows: [
      { name: 'Methylpropanediol', amount: '10,00%', role: 'Притягивает воду и несёт эссенцию' },
      { name: 'Glycerin', amount: '5,04%', role: 'Классический увлажнитель, удерживает влагу в коже' },
      { name: 'Betaine', amount: '0,50%', role: 'Мягкий второй увлажнитель для реактивной кожи' },
      { name: 'Allantoin', amount: '0,10%', role: 'Успокаивает и снимает ощущение раздражения' },
      { name: 'Panthenol', amount: '0,10%', role: 'Провитамин B5 для комфорта и барьера' },
      { name: 'Peppermint oil', amount: '0,005%', role: 'Прохлада, которую чувствуешь при нанесении' },
    ],
    note:
      'Увлажнители увлажняют, аллантоин и пантенол успокаивают, капля мяты дарит прохладу. Без кислот и сильных активов, поэтому маска бережна к коже после долгого дня.',
  },

  sea: {
    eyebrow: 'Из моря',
    title: 'Морские водоросли и центелла',
    body:
      'В эссенции две морские водоросли встречаются с центеллой азиатской: Jania rubens - красная коралловая водоросль, и Undaria pinnatifida - бурая водоросль, известная как вакаме. Растительную часть дополняют лист гамамелиса, бамбук и скорлупа каштана.',
    aside: 'Интенсивное успокоение и увлажнение в одном листе - то, что обещает название.',
  },

  colour: {
    eyebrow: 'Цвет',
    title: 'Зелёный от природы',
    body: 'Зелёный цвет эссенции даёт экстракт плодов гардении. Без искусственных красителей и ничего только ради вида.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Очистить, наложить, расслабиться, вбить',
    frequency: 'Когда коже нужно · одно полотно, прямо из саше',
    steps: [
      {
        title: 'Начните с чистой кожи',
        body: 'Очистите и промокните кожу, затем нанесите GENOSYS Snow Booster, чтобы полотно легло на влажную поверхность.',
      },
      {
        title: 'Уложите плотно',
        body: 'Разверните полотно и прижмите по носу, челюсти и под глазами, чтобы оно касалось кожи везде.',
      },
      {
        title: 'Пятнадцать-двадцать минут',
        body: 'Прилягте и расслабьтесь. Снимите маску, пока она ещё влажная, до того как начнёт подсыхать.',
      },
      {
        title: 'Вбейте остаток',
        body: 'Снимите полотно и вбейте оставшуюся эссенцию подушечками пальцев. Без смывания. Если кожа сухая, закройте кремом.',
      },
    ],
    note: 'Используйте сразу после вскрытия саше: одно полотно - одно применение.',
  },

  when: {
    eyebrow: 'Когда браться',
    title: 'Вечера, для которых она создана',
    intro: 'Берите её каждый раз, когда коже нужно успокоиться.',
    items: [
      'После дня на солнце, когда кожа уже остыла',
      'После долгого перелёта, когда всё стянуто',
      'Вечером после пилинга или микронидлинга, если клиника разрешила',
      'В разгар лета в Заливе, когда кондиционер высушил',
      'Перед событием - ради свежего, наполненного вида увлажнённой кожи',
    ],
  },

  video: {
    title: 'Посмотрите на полотно',
    body: 'Как ткань разворачивается, как ложится и сколько эссенции идёт вместе с ней.',
    unsupported: 'Ваш браузер не поддерживает воспроизведение видео.',
  },

  actives: {
    eyebrow: 'Состав',
    title: 'Всё, что в эссенции',
    intro: 'Ключевые ингредиенты и что даёт каждый, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на саше у вас в руках.',
  },

  lab: {
    eyebrow: 'Качество',
    title: 'Чисто, проверено, из Кореи',
    intro: 'Сделано в Корее по строгой спецификации, и каждая партия проходит проверку перед отправкой.',
    rows: [
      { label: 'pH', value: '5,69 при спецификации 5,00-6,00: близко к здоровой коже' },
      { label: 'Эссенция', value: 'Не меньше 25 г в каждом саше' },
      { label: 'Чистота', value: 'Последняя партия в десять раз чище микробиологического предела' },
      { label: 'Проверка', value: 'Дерматологически протестировано' },
      { label: 'Срок годности', value: 'Тридцать месяцев закрытой, дата на саше' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Только для наружного применения. Избегайте глаз и слизистых, при попадании тщательно промойте прохладной водой.',
      'Не наносите непосредственно вокруг глаз.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Если у вас реакция на пластыри или компрессы, используйте с осторожностью.',
      'Используйте сразу после вскрытия и не храните начатое полотно.',
      'Храните в прохладном сухом месте, недоступном для детей.',
    ],
    note: 'Предостережения как напечатаны на саше GENOSYS.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Размер', value: 'Одно полотно, 25 г эссенции' },
      { label: 'Полотно', value: 'Спанлейс Eucalace® из эвкалипта' },
      { label: 'Время', value: '15-20 минут' },
      { label: 'pH', value: '5,00-6,00' },
      { label: 'Для кожи', value: 'Стянутой, горячей и чувствительной, а также после процедур' },
      { label: 'Цвет', value: 'Зелёный, от экстракта плодов гардении - без искусственных красителей' },
      { label: 'Проверка', value: 'Дерматологически протестировано' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Какие ощущения?',
        a: 'Прохладно и влажно с первой секунды: полотно пропитано 25 г эссенции с каплей мяты. Дальше - двадцать минут отдыха.',
      },
      {
        q: 'Сколько держать?',
        a: 'Пятнадцать-двадцать минут. Снимите полотно, пока оно ещё влажное, и вбейте остаток эссенции.',
      },
      {
        q: 'Можно после пилинга или микронидлинга?',
        a: 'Это любимый способ завершить процедуру: лёгкая прохладная эссенция с аллантоином и пантенолом, без кислот и сильных активов. Соблюдайте паузу, которую назначила ваша клиника.',
      },
      {
        q: 'Нужно ли смывать?',
        a: 'Нет. Снимите полотно и вбейте остаток эссенции. Если кожа сухая, сверху нанесите крем, чтобы удержать её.',
      },
      {
        q: 'Как часто можно?',
        a: 'Каждый раз, когда кожа просит. В формуле нет ничего, что требует перерыва между применениями.',
      },
      {
        q: 'Почему она зелёная?',
        a: 'Цвет эссенции даёт экстракт плодов гардении. Искусственных красителей нет.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const SEA_ALGAE_COPY: Record<Locale, SeaAlgaeCopy> = { en: EN, ar: AR, ru: RU }

export function getSeaAlgaeCopy(locale: string | undefined): SeaAlgaeCopy {
  return SEA_ALGAE_COPY[(locale as Locale) ?? 'en'] ?? SEA_ALGAE_COPY.en
}

/** Products the manufacturer pairs it with, and the two masks it ships beside. */
export const COMPANION_PRODUCT_IDS = ['16', '53', '13', '37'] as const
