/**
 * Bespoke copy for SOOTHING BOMB SEA ALGAE MASK (product 36), in the three
 * languages the site ships.
 *
 * SOURCING RULE - every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_36_SEA_ALGAE_SOURCE_AUDIT.md:
 *   - the DTS MG ingredient report: methylpropanediol 10%, glycerin 5.035%,
 *     betaine 0.5%, allantoin 0.1%, panthenol 0.1%, gardenia fruit extract
 *     0.0196% as the colorant, and the marine and botanical extracts at
 *     10 ppm and 1 ppm.
 *   - the COA, lot LE001: pH 5.69 against a 5.00-6.00 specification, net
 *     25.10 g against a 25 g minimum, bacteria under 10 cfu/g against a limit
 *     of 100, and a 30-month shelf life.
 *   - the pouch, both faces, and deck slide 2 for the Eucalace® sheet.
 *
 * THE CENTRAL HONESTY PROBLEM WITH THIS PRODUCT. Every piece of copy the brand
 * ships leads on "sea algae complex and centella asiatica extract". Those are
 * dosed at 10 ppm and 1 ppm. What hydrates this mask is glycerin at 5% with
 * methylpropanediol at 10% and betaine at 0.5%; what calms it is allantoin and
 * panthenol at 0.1% each. So the page leads on the humectants and the sheet,
 * names the algae plainly with its dose, and hangs nothing on it. GENOSYS
 * already print "(10ppm)" on the back of the pouch, so this is not a secret we
 * are keeping - it is one we are declining to paper over.
 *
 * MUST STAY OUT:
 *   - "dermatologically tested". Not on either pouch face, no report in the
 *     dossier. It appears on our own studio slides, which is a slide error.
 *   - any hydration percentage. There is no efficacy study in the pack.
 *   - the deck's ingredient claims: wound healing, collagen synthesis,
 *     tyrosinase inhibition, sebum control, detoxifying. All are attached to
 *     ingredients at 1-10 ppm.
 *   - the contract manufacturer's name, and the lot code.
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

  honesty: {
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
    disclaimer: string
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
  headline: 'Twenty minutes for skin that has had enough.',
  subheadline:
    'A single eucalyptus-fibre sheet soaked in a humectant essence: glycerin at 5%, methylpropanediol at 10% and betaine, with allantoin and panthenol for comfort. Put it on after sun, after a flight, after a peel, or on any evening your face feels tight and hot.',
  heroBullets: [
    'Eucalace® eucalyptus sheet - breathable, and it holds more essence',
    'Allantoin and panthenol at 0.1% each, both working doses',
    'pH 5.69, inside a 5.00-6.00 specification',
    'Green from gardenia fruit, not from pigment',
  ],
  badges: ['Made in Korea', '1 sheet · 25 g', 'No artificial pigment', 'Official UAE distributor'],

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
    { value: '15-20', label: 'Minutes, and the sheet comes off' },
    { value: '5%', label: 'Glycerin - the hydration is real' },
    { value: '25 g', label: 'Of essence in one sheet' },
    { value: 'pH 5.7', label: 'The same range as healthy skin' },
  ],

  sheet: {
    eyebrow: 'The sheet',
    title: 'The fabric is the product',
    intro:
      'Every sheet mask on the market holds a similar essence. What separates one from another is what the essence is sitting in, and this one is a eucalyptus spunlace rather than the usual nonwoven.',
    points: [
      {
        title: 'Finer fibre, more essence',
        body: 'The fibres are finer and packed at a higher count than a standard nonwoven of the same size, which means the sheet carries more essence and hands more of it over to your skin instead of keeping it.',
      },
      {
        title: 'It breathes',
        body: 'Air permeability well above a standard nonwoven. That matters over twenty minutes on a warm face: a sheet that seals completely is the one that leaves skin looking angrier than it started.',
      },
      {
        title: 'Nothing on the surface',
        body: 'Spunlace is bonded with water jets rather than adhesive, so the fabric comes with no chemical residue on it. The surface that sits against your face is just clean, soft fibre.',
      },
      {
        title: 'It stays where you put it',
        body: 'Transparent and high-adhesion, so it holds the curve of a jaw and the bridge of a nose rather than lifting off them while you lie still.',
      },
    ],
  },

  formula: {
    eyebrow: 'What is in the essence',
    title: 'The parts that carry the weight',
    intro:
      'These are the ingredients present at a level that does something, straight off the manufacturer\u2019s quantitative formula. Percentages, not an order of appearance.',
    columns: { name: 'Ingredient', amount: 'Concentration', role: 'What it is doing' },
    rows: [
      { name: 'Methylpropanediol', amount: '10.00%', role: 'Draws water in and carries the rest' },
      { name: 'Glycerin', amount: '5.04%', role: 'The humectant most of the hydration comes from' },
      { name: 'Betaine', amount: '0.50%', role: 'A second humectant, gentle on reactive skin' },
      { name: 'Allantoin', amount: '0.10%', role: 'Soothing and anti-irritant, at a working dose' },
      { name: 'Panthenol', amount: '0.10%', role: 'Provitamin B5, for comfort and the barrier' },
      { name: 'Peppermint oil', amount: '0.005%', role: 'The faint cool note, and no more than that' },
    ],
    note:
      'That is the whole functional load. Nothing here is exotic, and that is the point: a mask that hydrates does it with humectants at percent level, not with a rare extract at parts per million.',
  },

  honesty: {
    eyebrow: 'About the sea algae',
    title: 'It is in there. It is not what is working.',
    body:
      'The name promises algae, so here is the actual dose: Jania Rubens at 10 ppm and Undaria Pinnatifida at 10 ppm, with centella, bamboo, witch hazel and chestnut shell at 1 ppm each. Parts per million. They are real ingredients on a real ingredient list, and at those levels they are not what calms your face - the humectants and the allantoin are.',
    aside:
      'GENOSYS print those ppm figures on the back of the pouch themselves, which is more than most brands do. We would rather repeat them than let the word "complex" do work the formula cannot.',
  },

  colour: {
    eyebrow: 'The colour',
    title: 'Green from a fruit, not a dye',
    body:
      'The essence is green because of gardenia fruit extract at 0.02%, listed on the formula as the colorant. There is no artificial pigment in it, which the pouch states and the formula backs up. It is a small thing, but it is the kind of small thing that is easy to check and worth knowing.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Cleanse, apply, wait, pat',
    frequency: 'Whenever skin needs it · single use, straight from the pouch',
    steps: [
      {
        title: 'Start on clean skin',
        body: 'Cleanse and pat dry. The manufacturer suggests prepping with the GENOSYS Snow Booster first, which gives the sheet a damp surface to work against.',
      },
      {
        title: 'Lay it on properly',
        body: 'Unfold and press it down along the nose, the jaw and under the eyes so the whole sheet is in contact. Air pockets are where a mask stops doing anything.',
      },
      {
        title: 'Fifteen to twenty minutes',
        body: 'No longer. Once a sheet begins to dry it starts taking moisture back off the skin, which is the opposite of the point.',
      },
      {
        title: 'Pat the rest in',
        body: 'Lift the sheet, then press the essence left on your face in with your fingertips rather than rinsing. Follow with a moisturiser if your skin is dry.',
      },
    ],
    note:
      'Use it immediately after opening - a single sheet in an opened pouch has no preservation story once air gets to it.',
  },

  when: {
    eyebrow: 'When to reach for it',
    title: 'The evenings it is actually for',
    intro: 'This is a comfort mask, not a treatment. It is at its best when skin needs settling rather than changing.',
    items: [
      'After a day in the sun, once the skin has cooled',
      'Off a long flight, when everything feels tight',
      'The evening after a peel or a needling session, if your clinic has cleared it',
      'Mid-summer in the Gulf, when air conditioning has dried you out',
      'Before an event, for the temporary plumpness a hydrated face has',
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
    intro: 'The named ingredients and what each is for, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the pouch in your hand.',
  },

  lab: {
    eyebrow: 'Quality',
    title: 'What the batch sheet says',
    intro: 'Made and released in Korea, and the numbers behind it are ordinary in the way you want a mask to be ordinary.',
    rows: [
      { label: 'pH', value: '5.69, inside a 5.00-6.00 specification - the same range as healthy skin' },
      { label: 'Essence', value: '25.10 g against a 25 g minimum' },
      { label: 'Purity', value: 'Under 10 cfu/g against a permitted 100 - ten times cleaner than the limit' },
      { label: 'Shelf life', value: 'Thirty months unopened, with the expiry date on the pouch' },
      { label: 'Single use', value: 'One sheet per pouch, used immediately after opening' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
    disclaimer:
      'No efficacy trial exists for this mask, so there are no percentage figures anywhere on this page. What is above is the batch specification, which is a different and more checkable thing.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'For external use only. Avoid the eyes and mucous membranes, and rinse thoroughly with cool water on contact.',
      'Do not use directly around the eyes.',
      'Stop and see a doctor if redness, swelling or irritation appears.',
      'If you react to bandages or compresses, use this with caution - the pouch says so, and it is worth taking seriously.',
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
      { label: 'Sheet', value: 'Eucalace® eucalyptus spunlace nonwoven' },
      { label: 'Wear time', value: '15-20 minutes' },
      { label: 'pH', value: '5.00-6.00' },
      { label: 'Skin', value: 'All types, including sensitive and post-procedure' },
      { label: 'Colour', value: 'Green, from gardenia fruit extract - no artificial pigment' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Is the sea algae doing anything at 10 ppm?',
        a: 'Honestly, no - not at that level. It is on the ingredient list and GENOSYS print the figure on the pouch themselves. The hydration comes from glycerin at 5% with methylpropanediol at 10%, and the calming from allantoin and panthenol at 0.1% each. Those are the doses that do the work, and they are the reason the mask is worth its price rather than the algae.',
      },
      {
        q: 'How long should I leave it on?',
        a: 'Fifteen to twenty minutes, and not longer. Once the sheet starts to dry it begins pulling moisture back out of your skin, so a mask left on for an hour is worse than one taken off on time.',
      },
      {
        q: 'Can I use it after a peel or needling?',
        a: 'It is a common way to finish a session, and the texture is right for it - a light humectant essence with allantoin and panthenol, no acids, no actives, no fragrance beyond a trace of peppermint. Follow whatever waiting period your clinic gave you; that instruction comes from them.',
      },
      {
        q: 'Does it need rinsing off?',
        a: 'No. Take the sheet off and pat the remaining essence in. If your skin is dry, put a moisturiser over the top to hold it there.',
      },
      {
        q: 'How often can I use one?',
        a: 'As often as your skin wants it. There is nothing in the formula that needs a rest between uses, though a sheet mask is a top-up rather than a routine - the moisturiser you use every day matters more.',
      },
      {
        q: 'Why is it green?',
        a: 'Gardenia fruit extract, which is the colorant on the formula at 0.02%. There is no artificial pigment in it. Not the algae, which is far too dilute to colour anything.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: SeaAlgaeCopy = {
  eyebrow: 'ماسك سوذينغ بومب سي ألجي · ورقة واحدة',
  headline: 'عشرون دقيقة لبشرة سئمت.',
  subheadline:
    'ورقة واحدة من ألياف الأوكالبتوس مشبعة بإسنس مرطّب: غليسرين بنسبة 5%، وميثيل بروبانديول بنسبة 10%، وبيتايين، مع ألانتوين وبانثينول للراحة. ضعيه بعد الشمس، أو بعد الطيران، أو بعد التقشير، أو في أي مساء تشعرين فيه بشدّ وحرارة في وجهك.',
  heroBullets: [
    'ورقة Eucalace® من الأوكالبتوس - تتنفّس، وتحمل إسنس أكثر',
    'ألانتوين وبانثينول بنسبة 0.1% لكل منهما، وكلاهما بجرعة فعّالة',
    'درجة حموضة 5.69، ضمن مواصفة 5.00-6.00',
    'الأخضر من ثمرة الغردينيا لا من صبغة',
  ],
  badges: ['صُنع في كوريا', 'ورقة واحدة · 25 غ', 'بلا صبغات صناعية', 'الموزّع الرسمي في الإمارات'],

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
    { value: '15-20', label: 'دقيقة ثم تُرفع الورقة' },
    { value: '5%', label: 'غليسرين - الترطيب حقيقي' },
    { value: '25 غ', label: 'من الإسنس في ورقة واحدة' },
    { value: 'pH 5.7', label: 'النطاق نفسه للبشرة السليمة' },
  ],

  sheet: {
    eyebrow: 'الورقة',
    title: 'القماش هو المنتج',
    intro:
      'كل ماسك ورقي في السوق يحمل إسنس متشابهاً. ما يفرّق بينها هو ما يجلس فيه هذا الإسنس، وهذه ورقة سبانليس من الأوكالبتوس لا النسيج غير المنسوج المعتاد.',
    points: [
      {
        title: 'ألياف أدقّ، وإسنس أكثر',
        body: 'الألياف أدقّ وبكثافة أعلى من نسيج قياسي بالمساحة نفسها، ما يعني أن الورقة تحمل إسنس أكثر وتسلّم منه أكثر لبشرتك بدل الاحتفاظ به.',
      },
      {
        title: 'تتنفّس',
        body: 'نفاذية هواء أعلى بكثير من النسيج القياسي. وهذا مهم خلال عشرين دقيقة على وجه دافئ: الورقة التي تغلق تماماً هي التي تترك البشرة أكثر احمراراً مما بدأت.',
      },
      {
        title: 'لا شيء على السطح',
        body: 'السبانليس يُربَط بنفّاثات الماء لا باللواصق، فلا تأتي بأي بقايا كيميائية. والسطح الملامس لوجهك ليس إلا ليفاً نظيفاً وناعماً.',
      },
      {
        title: 'تبقى مكانها',
        body: 'شفّافة وعالية الالتصاق، فتتبع انحناء الفكّ وجسر الأنف بدل أن ترتفع عنهما وأنتِ مستلقية.',
      },
    ],
  },

  formula: {
    eyebrow: 'ما في الإسنس',
    title: 'الأجزاء التي تحمل الوزن',
    intro:
      'هذه هي المكوّنات الموجودة بمستوى يفعل شيئاً، مأخوذة مباشرة من تركيبة الشركة الكمّية. نِسب، لا ترتيب ظهور.',
    columns: { name: 'المكوّن', amount: 'التركيز', role: 'ما يفعله' },
    rows: [
      { name: 'Methylpropanediol', amount: '10.00%', role: 'يجذب الماء ويحمل البقية' },
      { name: 'Glycerin', amount: '5.04%', role: 'المرطّب الذي يأتي منه معظم الترطيب' },
      { name: 'Betaine', amount: '0.50%', role: 'مرطّب ثانٍ، لطيف على البشرة التفاعلية' },
      { name: 'Allantoin', amount: '0.10%', role: 'مهدّئ ومضادّ للتهيّج، بجرعة فعّالة' },
      { name: 'Panthenol', amount: '0.10%', role: 'بروفيتامين B5، للراحة وحاجز البشرة' },
      { name: 'Peppermint oil', amount: '0.005%', role: 'لمسة البرودة الخفيفة، ولا أكثر' },
    ],
    note:
      'هذا هو كامل الحمل الفعّال. لا شيء هنا نادر، وهذا هو المقصود: الماسك الذي يرطّب يفعل ذلك بمرطّبات بنسب مئوية، لا بمستخلص نادر بأجزاء من المليون.',
  },

  honesty: {
    eyebrow: 'عن الطحالب البحرية',
    title: 'موجودة. لكنها ليست ما يعمل.',
    body:
      'الاسم يَعِد بالطحالب، وهذه هي الجرعة الفعلية: جانيا روبنز 10 أجزاء من المليون، وأنداريا بينّاتيفيدا 10 أجزاء من المليون، والقنطورية والخيزران والهاماميليس وقشر الكستناء جزء واحد من المليون لكل منها. أجزاء من المليون. هي مكوّنات حقيقية على قائمة حقيقية، وبهذه المستويات ليست هي ما يهدّئ وجهك - المرطّبات والألانتوين هي التي تفعل.',
    aside:
      'وجينوسيس تطبع أرقام الـ ppm هذه على ظهر الكيس بنفسها، وهذا أكثر مما تفعله معظم العلامات. ونحن نفضّل تكرارها على ترك كلمة «مركّب» تؤدي عملاً لا تستطيعه التركيبة.',
  },

  colour: {
    eyebrow: 'اللون',
    title: 'أخضر من ثمرة، لا من صبغة',
    body:
      'الإسنس أخضر بسبب مستخلص ثمرة الغردينيا بنسبة 0.02%، وهو مسجّل في التركيبة كملوّن. ولا صبغة صناعية فيه، وهو ما يذكره الكيس وتؤكده التركيبة. تفصيل صغير، لكنه من النوع السهل التحقّق منه ويستحق المعرفة.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'نظّفي، ضعي، انتظري، ربّتي',
    frequency: 'وقت ما تحتاجه البشرة · استعمال واحد، مباشرة من الكيس',
    steps: [
      {
        title: 'ابدئي على بشرة نظيفة',
        body: 'نظّفي البشرة وجفّفيها بالتربيت، ثم طبقي GENOSYS SNOW BOOSTER لطبقة ترطيب خفيفة قبل وضع القناع.',
      },
      {
        title: 'ضعيها كما ينبغي',
        body: 'افردي الورقة واضغطيها على الأنف والفكّ وتحت العينين ليكون كامل السطح ملامساً. الفقاعات الهوائية هي حيث يتوقف الماسك عن فعل أي شيء.',
      },
      {
        title: 'من خمس عشرة إلى عشرين دقيقة',
        body: 'لا أكثر. فما إن تبدأ الورقة في الجفاف حتى تبدأ بسحب الرطوبة من البشرة، وهذا عكس المقصود.',
      },
      {
        title: 'ربّتي الباقي',
        body: 'ارفعي الورقة ثم اضغطي الإسنس المتبقي على وجهك بأطراف أصابعك بدل الشطف. واتبعيه بمرطّب إن كانت بشرتك جافة.',
      },
    ],
    note: 'استعمليه فور الفتح - الورقة المفردة في كيس مفتوح لا تملك أي حفظ بعد وصول الهواء إليها.',
  },

  when: {
    eyebrow: 'متى تلجئين إليه',
    title: 'الأمسيات التي صُنع لها فعلاً',
    intro: 'هذا ماسك راحة لا علاج. وهو في أفضل حالاته حين تحتاج البشرة إلى تهدئة لا إلى تغيير.',
    items: [
      'بعد يوم في الشمس، حين تبرد البشرة',
      'بعد رحلة طويلة، حين يصبح كل شيء مشدوداً',
      'مساء اليوم التالي للتقشير أو الوخز، إن سمحت عيادتك',
      'في منتصف صيف الخليج، حين يجفّفك التكييف',
      'قبل مناسبة، من أجل الامتلاء المؤقت الذي تمنحه بشرة مرطّبة',
    ],
  },

  video: {
    title: 'شاهدي الورقة',
    body: 'كيف تُفرد، وكيف تستقرّ، وكم من الإسنس يأتي معها.',
    unsupported: 'متصفّحك لا يدعم تشغيل الفيديو.',
  },

  actives: {
    eyebrow: 'التركيبة',
    title: 'كل ما في الإسنس',
    intro: 'المكوّنات المذكورة وما يفيده كل منها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على الكيس بين يديك.',
  },

  lab: {
    eyebrow: 'الجودة',
    title: 'ما تقوله ورقة الدفعة',
    intro: 'صُنع وأُفرج عنه في كوريا، وأرقامه عادية بالطريقة التي تريدين ماسكاً أن يكون بها عادياً.',
    rows: [
      { label: 'الحموضة', value: '5.69 ضمن مواصفة 5.00-6.00 - النطاق نفسه للبشرة السليمة' },
      { label: 'الإسنس', value: '25.10 غ مقابل حدّ أدنى 25 غ' },
      { label: 'النقاء', value: 'أقل من 10 وحدات/غ مقابل 100 مسموحة - أنظف بعشرة أضعاف من الحدّ' },
      { label: 'مدة الصلاحية', value: 'ثلاثون شهراً مغلقاً، وتاريخ الانتهاء على الكيس' },
      { label: 'استعمال واحد', value: 'ورقة واحدة لكل كيس، تُستعمل فور الفتح' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
    disclaimer:
      'لا توجد تجربة فعالية لهذا الماسك، لذا لا نسب مئوية في أي مكان على هذه الصفحة. وما سبق هو مواصفة الدفعة، وهي شيء مختلف وأسهل في التحقّق.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'للاستعمال الخارجي فقط. تجنّبي العينين والأغشية المخاطية، واشطفي جيداً بالماء البارد عند الملامسة.',
      'لا تستعمليه مباشرة حول العينين.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'إن كنتِ تتحسّسين من الضمادات أو الكمادات فاستعمليه بحذر - الكيس يذكر ذلك، ويستحق الأخذ به.',
      'استعمليه فور الفتح، ولا تحتفظي بورقة مستعملة جزئياً.',
      'يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على كيس جينوسيس.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: 'ورقة واحدة، 25 غ من الإسنس' },
      { label: 'الورقة', value: 'نسيج Eucalace® سبانليس من الأوكالبتوس' },
      { label: 'مدة الوضع', value: '15-20 دقيقة' },
      { label: 'الحموضة', value: '5.00-6.00' },
      { label: 'البشرة', value: 'كل الأنواع، بما فيها الحسّاسة وما بعد الإجراءات' },
      { label: 'اللون', value: 'أخضر من مستخلص ثمرة الغردينيا - بلا صبغة صناعية' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل تفعل الطحالب شيئاً عند 10 أجزاء من المليون؟',
        a: 'بصراحة لا، ليس عند هذا المستوى. هي على قائمة المكوّنات وجينوسيس تطبع الرقم على الكيس بنفسها. الترطيب يأتي من الغليسرين بنسبة 5% مع الميثيل بروبانديول بنسبة 10%، والتهدئة من الألانتوين والبانثينول بنسبة 0.1% لكل منهما. هذه هي الجرعات التي تعمل، وهي سبب استحقاق الماسك لسعره لا الطحالب.',
      },
      {
        q: 'كم أتركه على وجهي؟',
        a: 'من خمس عشرة إلى عشرين دقيقة، لا أكثر. فما إن تبدأ الورقة في الجفاف حتى تسحب الرطوبة من بشرتك، فالماسك المتروك ساعة أسوأ من المرفوع في وقته.',
      },
      {
        q: 'هل أستخدمه بعد التقشير أو الوخز؟',
        a: 'هذه طريقة شائعة لإنهاء الجلسة، والقوام مناسب لها - إسنس مرطّب خفيف مع ألانتوين وبانثينول، بلا أحماض ولا فعّالات ولا عطر سوى أثر من النعناع. التزمي بمدة الانتظار التي حدّدتها عيادتك؛ تلك التعليمات منهم.',
      },
      {
        q: 'هل يحتاج إلى شطف؟',
        a: 'لا. ارفعي الورقة وربّتي الإسنس المتبقي. وإن كانت بشرتك جافة فضعي مرطّباً فوقه ليثبت.',
      },
      {
        q: 'كم مرة أستطيع استعماله؟',
        a: 'كلما رغبت بشرتك. لا شيء في التركيبة يحتاج إلى راحة بين الاستعمالات، مع أن الماسك الورقي إضافة لا روتين - المرطّب الذي تستعملينه يومياً أهمّ منه.',
      },
      {
        q: 'لماذا لونه أخضر؟',
        a: 'مستخلص ثمرة الغردينيا، وهو الملوّن في التركيبة بنسبة 0.02%. ولا صبغة صناعية فيه. وليست الطحالب، فهي أرقّ بكثير من أن تلوّن شيئاً.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: SeaAlgaeCopy = {
  eyebrow: 'Soothing Bomb Sea Algae Mask · Одна тканевая маска',
  headline: 'Двадцать минут для кожи, с которой хватит.',
  subheadline:
    'Одно полотно из эвкалиптового волокна, пропитанное увлажняющей эссенцией: глицерин 5%, метилпропандиол 10% и бетаин, плюс аллантоин и пантенол для комфорта. Наденьте после солнца, после перелёта, после пилинга или в любой вечер, когда лицо стянуто и горячее.',
  heroBullets: [
    'Полотно Eucalace® из эвкалипта - дышит и держит больше эссенции',
    'Аллантоин и пантенол по 0,1% - обе дозы рабочие',
    'pH 5,69 при спецификации 5,00-6,00',
    'Зелёный цвет от плода гардении, а не от красителя',
  ],
  badges: ['Сделано в Корее', '1 маска · 25 г', 'Без искусственных красителей', 'Официальный дистрибьютор в ОАЭ'],

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
    { value: '15-20', label: 'минут, и маска снимается' },
    { value: '5%', label: 'глицерина - увлажнение настоящее' },
    { value: '25 г', label: 'эссенции в одной маске' },
    { value: 'pH 5,7', label: 'тот же диапазон, что у здоровой кожи' },
  ],

  sheet: {
    eyebrow: 'Полотно',
    title: 'Ткань и есть продукт',
    intro:
      'Эссенция у большинства тканевых масок похожая. Разница в том, в чём эта эссенция лежит, - и здесь это эвкалиптовый спанлейс, а не обычный нетканый материал.',
    points: [
      {
        title: 'Тоньше волокно, больше эссенции',
        body: 'Волокна тоньше и плотнее по количеству, чем у стандартного нетканого полотна той же площади. Значит, маска несёт больше эссенции и отдаёт коже больше, а не удерживает в себе.',
      },
      {
        title: 'Она дышит',
        body: 'Воздухопроницаемость заметно выше стандартной. За двадцать минут на тёплом лице это важно: полотно, которое запечатывает наглухо, и оставляет кожу краснее, чем была.',
      },
      {
        title: 'Ничего на поверхности',
        body: 'Спанлейс скрепляют водяными струями, а не клеем, поэтому на ткани нет химических остатков. К лицу прилегает просто чистое мягкое волокно.',
      },
      {
        title: 'Держится там, где положили',
        body: 'Прозрачное и с высокой адгезией: повторяет линию челюсти и спинку носа, а не отходит от них, пока вы лежите.',
      },
    ],
  },

  formula: {
    eyebrow: 'Что в эссенции',
    title: 'То, что несёт нагрузку',
    intro:
      'Это ингредиенты, присутствующие на уровне, который что-то делает, - прямо из количественной формулы производителя. Проценты, а не порядок перечисления.',
    columns: { name: 'Ингредиент', amount: 'Концентрация', role: 'Что делает' },
    rows: [
      { name: 'Methylpropanediol', amount: '10,00%', role: 'Притягивает воду и несёт остальное' },
      { name: 'Glycerin', amount: '5,04%', role: 'Увлажнитель, дающий большую часть эффекта' },
      { name: 'Betaine', amount: '0,50%', role: 'Второй увлажнитель, мягкий для реактивной кожи' },
      { name: 'Allantoin', amount: '0,10%', role: 'Успокаивает и снимает раздражение, рабочая доза' },
      { name: 'Panthenol', amount: '0,10%', role: 'Провитамин B5 - комфорт и барьер' },
      { name: 'Peppermint oil', amount: '0,005%', role: 'Лёгкая прохладная нота, и не более' },
    ],
    note:
      'Это вся функциональная нагрузка. Ничего экзотического - и в этом суть: маска увлажняет увлажнителями в процентах, а не редким экстрактом в частях на миллион.',
  },

  honesty: {
    eyebrow: 'О морских водорослях',
    title: 'Они внутри. Но работают не они.',
    body:
      'Название обещает водоросли, поэтому вот реальная доза: Jania Rubens - 10 ppm, Undaria Pinnatifida - 10 ppm, а центелла, бамбук, гамамелис и скорлупа каштана - по 1 ppm. Частей на миллион. Это настоящие ингредиенты в настоящем списке, но на таких уровнях успокаивают лицо не они, а увлажнители и аллантоин.',
    aside:
      'GENOSYS сами печатают эти ppm на обороте саше - так делают немногие. Мы лучше повторим их, чем позволим слову «комплекс» выполнять работу, которой формула не делает.',
  },

  colour: {
    eyebrow: 'Цвет',
    title: 'Зелёный от плода, а не от краски',
    body:
      'Эссенция зелёная из-за экстракта плода гардении - 0,02%, в формуле он числится красителем. Искусственных пигментов нет: это заявлено на саше и подтверждается формулой. Мелочь, но из тех, которые легко проверить и стоит знать.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Очистить, наложить, подождать, вбить',
    frequency: 'Когда коже нужно · одно применение, прямо из саше',
    steps: [
      {
        title: 'Начните с чистой кожи',
        body: 'Очистите и промокните кожу, затем нанесите GENOSYS SNOW BOOSTER как лёгкий увлажняющий слой перед маской.',
      },
      {
        title: 'Уложите как следует',
        body: 'Разверните и прижмите по носу, челюсти и под глазами, чтобы всё полотно контактировало с кожей. Воздушные карманы - это места, где маска перестаёт работать.',
      },
      {
        title: 'Пятнадцать-двадцать минут',
        body: 'Не дольше. Как только полотно начинает подсыхать, оно забирает влагу обратно с кожи, а это противоположно замыслу.',
      },
      {
        title: 'Вбейте остаток',
        body: 'Снимите полотно и вбейте оставшуюся эссенцию подушечками пальцев, не смывая. Если кожа сухая, закройте кремом.',
      },
    ],
    note: 'Используйте сразу после вскрытия - у одной маски во вскрытом саше нет никакой защиты, как только к ней попал воздух.',
  },

  when: {
    eyebrow: 'Когда браться',
    title: 'Вечера, для которых она и сделана',
    intro: 'Это маска комфорта, а не лечение. Она хороша, когда коже нужно успокоиться, а не измениться.',
    items: [
      'После дня на солнце, когда кожа уже остыла',
      'После долгого перелёта, когда всё стянуто',
      'Вечером после пилинга или микронидлинга, если клиника разрешила',
      'В разгар лета в Заливе, когда кондиционер высушил',
      'Перед событием - ради временной наполненности увлажнённого лица',
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
    intro: 'Названные ингредиенты и назначение каждого, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на саше у вас в руках.',
  },

  lab: {
    eyebrow: 'Качество',
    title: 'Что говорит паспорт партии',
    intro: 'Сделано и выпущено в Корее, и цифры у него обычные - ровно так, как и хочется от маски.',
    rows: [
      { label: 'pH', value: '5,69 при спецификации 5,00-6,00 - тот же диапазон, что у здоровой кожи' },
      { label: 'Эссенция', value: '25,10 г при минимуме 25 г' },
      { label: 'Чистота', value: 'Менее 10 КОЕ/г при допустимых 100 - в десять раз чище предела' },
      { label: 'Срок годности', value: 'Тридцать месяцев закрытой, дата на саше' },
      { label: 'Одно применение', value: 'Одно полотно в саше, использовать сразу после вскрытия' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
    disclaimer:
      'Клинического исследования для этой маски нет, поэтому на странице нет ни одной процентной цифры эффективности. Выше - спецификация партии, а это другая и куда более проверяемая вещь.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Только для наружного применения. Избегайте глаз и слизистых, при попадании тщательно промойте прохладной водой.',
      'Не наносите непосредственно вокруг глаз.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Если у вас реакция на пластыри или компрессы, используйте с осторожностью - так написано на саше, и к этому стоит отнестись серьёзно.',
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
      { label: 'Полотно', value: 'Нетканый спанлейс Eucalace® из эвкалипта' },
      { label: 'Время', value: '15-20 минут' },
      { label: 'pH', value: '5,00-6,00' },
      { label: 'Кожа', value: 'Все типы, включая чувствительную и после процедур' },
      { label: 'Цвет', value: 'Зелёный, от экстракта плода гардении - без искусственных красителей' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Работают ли водоросли при 10 ppm?',
        a: 'Честно - нет, не на таком уровне. Они есть в списке, и GENOSYS сами печатают эту цифру на саше. Увлажнение даёт глицерин 5% с метилпропандиолом 10%, а успокоение - аллантоин и пантенол по 0,1%. Это и есть работающие дозы, и именно из-за них маска стоит своих денег, а не из-за водорослей.',
      },
      {
        q: 'Сколько держать?',
        a: 'Пятнадцать-двадцать минут, не дольше. Как только полотно начинает подсыхать, оно тянет влагу обратно из кожи, так что маска, оставленная на час, хуже снятой вовремя.',
      },
      {
        q: 'Можно после пилинга или микронидлинга?',
        a: 'Так часто и завершают процедуру, и текстура для этого подходит: лёгкая увлажняющая эссенция с аллантоином и пантенолом, без кислот, без активов, без отдушки кроме следа мяты. Соблюдайте паузу, назначенную вашей клиникой, - это их инструкция.',
      },
      {
        q: 'Нужно ли смывать?',
        a: 'Нет. Снимите полотно и вбейте остаток эссенции. Если кожа сухая, сверху нанесите крем, чтобы удержать её.',
      },
      {
        q: 'Как часто можно?',
        a: 'Столько, сколько хочет кожа. В формуле нет ничего, что требует перерыва, хотя тканевая маска - это добавка, а не уход: крем, которым вы пользуетесь каждый день, важнее.',
      },
      {
        q: 'Почему она зелёная?',
        a: 'Экстракт плода гардении - краситель в формуле, 0,02%. Искусственных пигментов нет. И это не водоросли: они слишком разбавлены, чтобы что-то окрасить.',
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
