/**
 * Bespoke copy for the SNOW O₂ CLEANSER page (product 10).
 *
 * Same self-contained per-locale pattern as epiCopy.ts, so the dedicated
 * layout ships EN/AR/RU without adding keys to the shared messages bundles.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Four documents cover every figure on this page:
 *
 *   Registration DOC/Formula_up/Formula-GENOSYS SNOW O2.pdf
 *       Finished concentrations. Signed DTS MG, Narae Han. Every percentage
 *       on this page comes from here. The 2015 Quali-quanti / Ingredient
 *       lists_old sheet is a superseded formula (silicones, ether at 3%).
 *       Ignored.
 *   Registration DOC/SA/SA-GENOSYS SNOW O2.pdf
 *       December 2020 amendment. Face cleansing, rinse-off, adults. Applied
 *       on the face and rinsed off. pH 5.3-6.3. Opaque viscous liquid.
 *       Trade-name map: NF 38 = Methyl Perfluoroisobutyl Ether 8%;
 *       PHYTOLEX SC premix 0.2000%; MULTIEX PHYTROGEN premix 0.0100%.
 *       Patch test non-irritant supports "dermatologically tested", not a
 *       no-irritation promise. Do not print the lab id.
 *   Registration DOC/Artwork/[GENOSYS]SNOW O2(180ml).pdf
 *       Function: Facial cleanser. Apply on dry face, avoiding eyes. When
 *       oxygen bubbles occur, circular massage, rinse with tepid water.
 *       Front sentence: naturally generated oxygen bubbles clean make-up
 *       dirt and skin impurities. Dermatologically tested. 180 ml.
 *       Precautions: external use, keep off eyes, avoid children, avoid
 *       pregnancy/lactation. Korean carton names WINNOVA as the contract
 *       manufacturer - DTS MG only on this page.
 *   Registration DOC/COA/COA-GENOSYS SNOW O2 180ml(WOB052).pdf
 *       Opaque viscous liquid. pH 5.67 inside 5.30-6.30. 181.89 ml against
 *       180 ml. About three years unopened. Lot omitted on the page.
 *
 * No DTS MG deck with a quantified clinical figure is on file. Do not
 * invent an oxygen-therapy %, a sebum %, or a sensitive-skin trial.
 *
 * THE FORMULA, as finished concentrations that matter on this page:
 *
 *   Methyl Perfluoroisobutyl Ether                 8.0000%
 *   Cocamide DEA                                   6.0000%
 *   Butylene Glycol                                4.1089%
 *   Glycerin                                       4.0000%
 *   Isopropyl Myristate                            3.9200%
 *   Sodium Laureth Sulfate                         2.4000%
 *   Propanediol                                    1.8340%
 *   Decyl Glucoside                                0.8220%
 *   Parfum                                         0.1500%
 *   Chamaecyparis Obtusa Water                     0.1080%
 *   Limonene                                       0.1080%
 *   Phaseolus Radiatus Extract                     0.0030%
 *   Betula Platyphylla Japonica Bark Extract       0.00004%
 *   Rumex Crispus Root Extract                     0.00002%
 *
 * Humectant total (BG + glycerin + propanediol): 9.94%.
 * Phytolex SC finished actives sit at 0.003%. MultiEx Phytrogen finished
 * actives sit at 0.001%. They are in the formula. They are not the engine.
 *
 * THE DISTINCTIVE FACT, which is why this page exists.
 *
 * This is a dry-skin oxygen-bubble cleanser. The carton function is facial
 * cleanser. You put it on a dry face. Bubbles form. You massage. You rinse
 * with tepid water. The bubbles come from Methyl Perfluoroisobutyl Ether
 * at 8%, the second-largest ingredient after water. That is the product.
 * This is not oxygen therapy, not a leave-on treatment, and not a
 * nutrifying wash. Phytolex and MultiEx are in the formula. They are not
 * the reason to buy.
 *
 * Live English, Arabic and Russian still sold oxygen therapy, a spa
 * treatment, all skin types including sensitive, no irritation, and
 * Phytolex / MultiEx as co-leads. The leftover how-to invented a wet-
 * finger second cycle the English carton does not print.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Facial cleanser                                artwork function
 *   Naturally generated oxygen bubbles             artwork front sentence
 *   Clean make-up dirt and skin impurities         artwork
 *   Apply on dry face, avoiding eyes               artwork application
 *   When bubbles occur, circular massage           artwork
 *   Rinse with tepid water                         artwork
 *   Dermatologically tested                        artwork / SA patch test
 *   180 ml and 500 ml                              artwork / COA
 *   Ether 8% and every percentage above            Formula_up
 *   Phytolex SC by name at 0.2% premix             safety assessment
 *   pH 5.67, specification 5.30 to 6.30            COA / SA
 *   Opaque viscous liquid                          COA / SA
 *   Three years unopened                           COA dates, no lot
 *   Avoid pregnancy and lactation                  artwork EN
 *   Made in Korea by DTS MG                        formula / artwork
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - OXYGEN THERAPY / NUTRIFYING / VITAMIN O2. The carton says bubbles
 *     that clean. It does not say the wash feeds the skin.
 *   - WITHOUT IRRITATION as a guarantee. The carton writes it. The SA is
 *     a patch test, which supports "dermatologically tested".
 *   - PHYTOLEX SC / MULTIEX PHYTROGEN as the engine. Premix 0.2% / 0.01%.
 *     Finished actives are 0.003% / 0.001%.
 *   - ALL SKIN TYPES INCLUDING SENSITIVE. The carton does not print it.
 *     SLES 2.4% and fragrance are in a daily wash.
 *   - FRAGRANCE-FREE. Parfum 0.15%, limonene 0.108%, hinoki water 0.108%.
 *   - SULFATE-FREE. Sodium Laureth Sulfate is 2.4%.
 *   - PARABEN-FREE as a badge. The English carton does not print it.
 *     Gallery slides invent it.
 *   - THE WET-FINGER SECOND CYCLE as the ritual. Leftover copy and
 *     gallery S4 invent it. The English carton is apply, bubbles,
 *     massage, rinse.
 *   - A KOREAN FUNCTIONAL LICENCE / PRINCIPAL INGREDIENT.
 *   - CLINICAL PERCENTAGES. No deck figure is on file.
 *   - LOT CODES. Never print WOB052, WIE048, or the SA lab id.
 *   - THE CONTRACT MANUFACTURER. DTS MG only. Never WINNOVA.
 */

export type SnowO2Locale = 'en' | 'ar' | 'ru'

export interface SnowO2Copy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  chooseSize: string
  sizes: {
    homecareLabel: string
    homecareNote: string
    proLabel: string
    proNote: string
  }
  usageNote: string
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
  effects: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
  }
  engine: {
    eyebrow: string
    title: string
    body: string
    points: Array<{ title: string; body: string }>
    figureAlt: string
  }
  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
    videoTitle: string
  }
  actives: {
    eyebrow: string
    title: string
    intro: string
    inciTitle: string
    inciNote: string
  }
  suited: {
    eyebrow: string
    title: string
    forTitle: string
    forList: string[]
    notTitle: string
    notList: string[]
    note: string
  }
  routine: {
    eyebrow: string
    title: string
    intro: string
    thisProduct: string
    viewProduct: string
    chooseOptions: string
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
  }
  closing: {
    title: string
    body: string
  }
  reviewsTitle: string
  backToProducts: string
}

/** Registered Formula_up INCI in descending concentration. The pack list
 *  prints Triethanolamine and grapefruit and drops propanediol, hinoki,
 *  rose and melissa. The page prints the registered order and does not
 *  claim it matches the carton. */
export const SNOW_O2_FULL_INCI =
  'Aqua (Water), Methyl Perfluoroisobutyl Ether, Cocamide DEA, Butylene Glycol, ' +
  'Glycerin, Isopropyl Myristate, Sodium Laureth Sulfate, Propanediol, ' +
  'Acrylates Copolymer, Cocamidopropyl Betaine, Decyl Glucoside, ' +
  'Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Tromethamine, Sodium Chloride, ' +
  'Xanthan Gum, Parfum (Fragrance), Chamaecyparis Obtusa Water, Limonene, ' +
  'Isopropyl Palmitate, Rosa Rugosa Leaf Extract, Melissa Officinalis Leaf Extract, ' +
  'Disodium EDTA, Decyl Alcohol, Phaseolus Radiatus Extract, Glucose, Cocamide MEA, ' +
  'Soy Isoflavones, Pueraria Lobata Root Extract, Pueraria Mirifica Root Extract, ' +
  'Polygonum Cuspidatum Root Extract, Cimicifuga Racemosa Root Extract, ' +
  'Trifolium Pratense (Clover) Flower Extract, Punica Granatum Fruit Extract, ' +
  'Angelica Polymorpha Sinensis Root Extract, Betula Platyphylla Japonica Bark Extract, ' +
  'Rumex Crispus Root Extract.'

const EN: SnowO2Copy = {
  eyebrow: 'Facial cleanser · Oxygen bubbles',
  headline: 'Dry face. Then the bubbles.',
  subheadline:
    'A gentle cleanser that starts on dry skin. Naturally generated oxygen bubbles lift make-up and impurities, you massage in circles, and tepid water takes them. Morning and evening.',
  heroBullets: [
    'On a dry face, away from the eyes',
    'Oxygen bubbles form on contact, then a circular massage',
    'Rinse with tepid water. It is a wash, not a leave-on',
    '180 ml at home, 500 ml on the clinic shelf',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '180 ml / 500 ml', 'Morning and evening'],
  chooseSize: 'Choose a size',
  sizes: {
    homecareLabel: 'Home',
    homecareNote: 'The daily pump. Enough for months of morning and evening.',
    proLabel: 'Professional',
    proNote: 'The clinic bottle. Same formula, a longer run.',
  },
  usageNote: 'Morning and evening',
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
    { value: '8%', label: 'The ether that makes the bubbles' },
    { value: 'Dry', label: 'On the face before any water' },
    { value: 'AM/PM', label: 'A daily wash, then rinse' },
    { value: '2', label: 'Sizes, same formula' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Apply dry. Bubbles. Rinse.',
    intro:
      'Three moves: the cleanser goes on a dry face, oxygen bubbles lift what is on the surface, and tepid water takes them. That is the wash the carton describes.',
    cards: [
      {
        title: 'Dry',
        body: 'This is not a wet-hand foam. You put it on a dry face, away from the eyes, and wait for the bubbles. Water comes after, not before.',
      },
      {
        title: 'Bubbles',
        body: 'Naturally generated oxygen bubbles lift make-up dirt and skin impurities. A circular massage is enough. You do not scrub.',
      },
      {
        title: 'Rinse',
        body: 'Tepid water takes the bubbles and what they lifted. The face is clean and ready for toner, not coated in a treatment.',
      },
    ],
  },
  engine: {
    eyebrow: 'The wash',
    title: 'The ether is the bubbles.',
    body:
      'Eight percent of the cleanser is Methyl Perfluoroisobutyl Ether, the second-largest ingredient after water. That is what rises on dry skin. Phytolex and MultiEx sit in the formula. They are not the engine.',
    points: [
      {
        title: 'Methyl Perfluoroisobutyl Ether · 8%',
        body: 'The reason the bubbles appear on a dry face. The carton calls them naturally generated oxygen bubbles. This is the figure that belongs on a card.',
      },
      {
        title: 'A wash that still feels comfortable',
        body: 'Butylene glycol 4.1%, glycerin 4% and propanediol 1.8% sit under the foam, so the rinse does not leave the face tight.',
      },
      {
        title: 'The clean itself',
        body: 'Cocamide DEA, sodium laureth sulfate and decyl glucoside do the washing. This is a real cleanser, not a cream that happens to foam.',
      },
      {
        title: 'Phytolex and MultiEx',
        body: 'Named because leftover copy treated them as the reason to buy. Phytolex is a 0.2% premix; the finished extracts sit at 0.003%. MultiEx is a 0.01% premix. They are in the formula. They are not why the bubbles form.',
      },
    ],
    figureAlt: 'GENOSYS SNOW O2 cleanser, 180 ml and 500 ml pumps',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Dry face. Bubbles. Massage. Rinse.',
    frequency: 'Morning and evening',
    steps: [
      {
        title: 'Apply',
        body: 'Put it on a dry face, away from the eyes. No water first.',
      },
      {
        title: 'Bubbles',
        body: 'Wait until the oxygen bubbles come up. That is the cleanser working.',
      },
      {
        title: 'Massage',
        body: 'Circular movements. The bubbles lift the make-up. You do not scrub.',
      },
      {
        title: 'Rinse',
        body: 'Tepid water, until the face is clear. Then toner, or whatever comes next.',
      },
    ],
    note:
      'Keep it off the eyes and mucous membranes; rinse with cool water if contact occurs. Avoid it during pregnancy and while breastfeeding - a precaution the carton prints itself. An opened pump is a daily wash, not a treatment you leave on.',
    videoTitle: 'The wash, on a face',
  },
  actives: {
    eyebrow: 'Inside the pump',
    title: 'What is actually in it.',
    intro:
      'Every percentage here is a finished concentration in the bottle, not a guess from a trade name at the top of a list.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote:
      'Every ingredient, strongest first. Your box prints a shorter order and names grapefruit and triethanolamine in places the finished formula does not carry them, so this page follows the formula.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'A daily wash, if you want the bubbles.',
    forTitle: 'Buy it if',
    forList: [
      'You want a cleanser that starts on dry skin and lifts make-up without a scrub',
      'You like a treatment sensation in the wash, then a clean rinse',
      'Morning and evening is your rhythm',
      'You want the 180 ml pump at home, or the 500 ml on a clinic shelf',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You need a fragrance-free wash. Parfum, limonene and hinoki water are in this one',
      'You need a sulfate-free cleanser. Sodium laureth sulfate is 2.4%',
      'You are pregnant or breastfeeding, which the carton itself asks you to avoid',
      'You want a leave-on treatment. This rinses off',
      'You came for Phytolex or MultiEx. They are traces under the foam',
    ],
    note: 'For external use only. Keep it away from the eyes and mucous membranes, and rinse with cool water if contact occurs.',
  },
  routine: {
    eyebrow: 'The rest of the morning',
    title: 'Wash, then the brightening line.',
    intro:
      'Snow O₂ is the first step. Booster, Multi Vita serum, Multi Vita cream and the SPF sit after the rinse.',
    thisProduct: 'This wash',
    viewProduct: 'View',
    chooseOptions: 'Choose size',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before you put it on a dry face.',
    items: [
      {
        q: 'Do I wet my face first?',
        a: 'No. The English carton is apply on a dry face. Water is the rinse, not the start.',
      },
      {
        q: 'What are the oxygen bubbles, really?',
        a: 'Methyl Perfluoroisobutyl Ether at 8%. It is a solvent that foams on dry skin. The carton calls the foam naturally generated oxygen bubbles. It is not oxygen therapy and it is not a gas you absorb.',
      },
      {
        q: 'Is this a Korean functional cosmetic?',
        a: 'No. The carton function is facial cleanser. There is no principal ingredient to name.',
      },
      {
        q: 'Why do leftover pages talk about Phytolex and MultiEx?',
        a: 'They are in the formula. Phytolex is a 0.2% premix; the finished extracts sit at 0.003%. MultiEx is a 0.01% premix. They are not why the bubbles form, and they are not a nutrifying treatment.',
      },
      {
        q: 'Do I need wet fingers in the middle?',
        a: 'The English carton does not ask for that. Apply, wait for the bubbles, massage, rinse. Damp fingers are fine if you want to spread further. They are not the ritual.',
      },
      {
        q: 'Which size should I buy?',
        a: '180 ml is the home pump. 500 ml is the clinic bottle. Same formula. Pick the one that matches how often the pump is used.',
      },
      {
        q: 'Can I use it at home?',
        a: 'Yes. PROFESSIONAL on the bottle is the line name. Most of our customers use the 180 ml at the sink every day.',
      },
      {
        q: 'Is it fragrance-free? Sulfate-free? Paraben-free?',
        a: 'No, no, and the English carton does not print the third. Parfum, limonene and hinoki water are in the formula. Sodium laureth sulfate is 2.4%. Do not buy it for a free-from list.',
      },
      {
        q: 'Can I use it while pregnant?',
        a: 'The carton asks you to avoid it during pregnancy and lactation, and we pass that on. Show the ingredient list to whoever is looking after you.',
      },
    ],
  },
  details: {
    eyebrow: 'The facts',
    title: 'What the documents actually say.',
    rows: [
      { label: 'Function', value: 'Facial cleanser - the line printed on the carton' },
      { label: 'Format', value: 'Rinse-off pump. Apply on a dry face' },
      { label: 'Sizes', value: '180 ml home · 500 ml professional' },
      { label: 'Appearance', value: 'Opaque viscous liquid' },
      { label: 'pH', value: '5.67, inside a 5.30 to 6.30 specification' },
      { label: 'How to', value: 'Dry face, bubbles, circular massage, tepid rinse' },
      { label: 'Use', value: 'Morning and evening' },
      { label: 'Tests', value: 'Dermatologically tested; each batch checked for pH and microbiology' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the bottle' },
      { label: 'Manufacturer', value: 'DTS MG Co., Ltd., South Korea' },
    ],
  },
  closing: {
    title: 'A dry face, then the bubbles.',
    body: 'The daily wash of the SOC line, and every percentage is printed above, nothing hidden.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'Products',
}

const AR: SnowO2Copy = {
  eyebrow: 'منظف وجه · فقاعات أكسجين',
  headline: 'وجه جاف. ثم الفقاعات.',
  subheadline:
    'منظف لطيف يبدأ على بشرة جافة. فقاعات أكسجين تتولّد طبيعياً ترفع المكياج والشوائب، تدلّكين دوائر، والماء الفاتر يأخذها. صباحاً ومساءً.',
  heroBullets: [
    'على وجه جاف، بعيداً عن العينين',
    'فقاعات الأكسجين تتكوّن عند التلامس، ثم تدليك دائري',
    'اشطفي بماء فاتر. هذا غسول، لا مستحضر يُترك',
    '180 مل في المنزل، 500 مل على رف العيادة',
  ],
  badges: ['مختبر جلدياً', 'صُنع في كوريا', '180 مل / 500 مل', 'صباحاً ومساءً'],
  chooseSize: 'اختاري الحجم',
  sizes: {
    homecareLabel: 'منزلي',
    homecareNote: 'المضخة اليومية. تكفي لأشهر من الصباح والمساء.',
    proLabel: 'احترافي',
    proNote: 'زجاجة العيادة. التركيبة نفسها، تشغيل أطول.',
  },
  usageNote: 'صباحاً ومساءً',
  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّلي الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني فوق 1,000 درهم · الشحن من دبي',
  stats: [
    { value: '8%', label: 'الإيثر الذي يصنع الفقاعات' },
    { value: 'جاف', label: 'على الوجه قبل أي ماء' },
    { value: 'ص/م', label: 'غسول يومي، ثم شطف' },
    { value: '2', label: 'حجمان، التركيبة نفسها' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'ضعي على الجاف. فقاعات. اشطفي.',
    intro:
      'ثلاث حركات: المنظف على وجه جاف، فقاعات الأكسجين ترفع ما على السطح، والماء الفاتر يأخذها. هذا هو الغسول الذي تصفه العلبة.',
    cards: [
      {
        title: 'جاف',
        body: 'هذه ليست رغوة بأيدٍ مبللة. تضعينه على وجه جاف، بعيداً عن العينين، وتنتظرين الفقاعات. الماء يأتي بعد ذلك، لا قبله.',
      },
      {
        title: 'فقاعات',
        body: 'فقاعات أكسجين تتولّد طبيعياً ترفع أوساخ المكياج وشوائب البشرة. تدليك دائري يكفي. لا فرك.',
      },
      {
        title: 'شطف',
        body: 'الماء الفاتر يأخذ الفقاعات وما رفعته. الوجه نظيف وجاهز للتونر، لا مغطى بعلاج.',
      },
    ],
  },
  engine: {
    eyebrow: 'الغسول',
    title: 'الإيثر هو الفقاعات.',
    body:
      'ثمانية في المئة من المنظف هي Methyl Perfluoroisobutyl Ether، ثاني أكبر مكوّن بعد الماء. هذا ما يصعد على البشرة الجافة. Phytolex وMultiEx في التركيبة. ليسا المحرّك.',
    points: [
      {
        title: 'Methyl Perfluoroisobutyl Ether · 8%',
        body: 'سبب ظهور الفقاعات على الوجه الجاف. العلبة تسمّيها فقاعات أكسجين تتولّد طبيعياً. هذا هو الرقم الذي يستحق بطاقة.',
      },
      {
        title: 'غسول يبقى مريحاً',
        body: 'بيوتيلين جلايكول 4.1% وجليسرين 4% وبروبانديول 1.8% تحت الرغوة، فلا يترك الشطف الوجه مشدوداً.',
      },
      {
        title: 'التنظيف نفسه',
        body: 'Cocamide DEA وكبريتات لوريث الصوديوم وDecyl Glucoside تقوم بالغسل. هذا منظف حقيقي، لا كريم يحدث أن يرغو.',
      },
      {
        title: 'Phytolex وMultiEx',
        body: 'مذكوران لأن النسخ القديمة عاملتهما كسبب الشراء. Phytolex خلطة 0.2%؛ والمستخلصات النهائية عند 0.003%. MultiEx خلطة 0.01%. هما في التركيبة. وليسا سبب الفقاعات.',
      },
    ],
    figureAlt: 'منظف GENOSYS SNOW O2، مضختا 180 مل و500 مل',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'وجه جاف. فقاعات. دلّكي. اشطفي.',
    frequency: 'صباحاً ومساءً',
    steps: [
      { title: 'ضعي', body: 'على وجه جاف، بعيداً عن العينين. بلا ماء أولاً.' },
      { title: 'فقاعات', body: 'انتظري حتى تصعد فقاعات الأكسجين. هذا هو عمل المنظف.' },
      { title: 'دلّكي', body: 'حركات دائرية. الفقاعات ترفع المكياج. لا تفركي.' },
      { title: 'اشطفي', body: 'ماء فاتر حتى يصفو الوجه. ثم التونر، أو ما يلي.' },
    ],
    note:
      'أبعديه عن العينين والأغشية المخاطية، واشطفي بماء بارد عند الملامسة. تجنّبيه أثناء الحمل والرضاعة - وهو تحذير تطبعه العلبة نفسها. المضخة المفتوحة غسول يومي، لا علاج يُترك.',
    videoTitle: 'الغسول، على وجه',
  },
  actives: {
    eyebrow: 'داخل المضخة',
    title: 'ما فيه فعلاً.',
    intro: 'كل نسبة هنا تركيز نهائي في الزجاجة، لا تخمين من اسم تجاري في رأس القائمة.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote:
      'كل مكوّن، من الأعلى نسبةً إلى الأقل. علبتك تطبع ترتيباً أقصر وتذكر الجريب فروت وتريإيثانولامين في مواضع لا تحملها التركيبة النهائية، وهذه الصفحة تتبع التركيبة.',
  },
  suited: {
    eyebrow: 'هل يناسبك',
    title: 'غسول يومي، إن أردت الفقاعات.',
    forTitle: 'اشتريه إن',
    forList: [
      'أردت منظفاً يبدأ على بشرة جافة ويرفع المكياج بلا فرك',
      'أحببت إحساس جلسة في الغسول، ثم شطفاً نظيفاً',
      'كان الصباح والمساء إيقاعك',
      'أردت مضخة 180 مل في المنزل، أو 500 مل على رف العيادة',
    ],
    notTitle: 'ابحثي عن غيره إن',
    notList: [
      'احتجت غسولاً بلا عطر. العطر والليمونين وماء السرو في هذا',
      'احتجت منظفاً بلا كبريتات. كبريتات لوريث الصوديوم 2.4%',
      'كنت حاملاً أو مرضعة، والعلبة نفسها تطلب تجنّبه',
      'أردت علاجاً يُترك على البشرة. هذا يُشطف',
      'جئت من أجل Phytolex أو MultiEx. هما أثر تحت الرغوة',
    ],
    note: 'للاستعمال الخارجي فقط. أبعديه عن العينين والأغشية المخاطية، واشطفي بماء بارد عند الملامسة.',
  },
  routine: {
    eyebrow: 'بقية الصباح',
    title: 'اغسلي، ثم خط التفتيح.',
    intro: 'Snow O₂ هي الخطوة الأولى. البوستر وسيروم Multi Vita وكريم Multi Vita والواقي بعد الشطف.',
    thisProduct: 'هذا الغسول',
    viewProduct: 'عرض',
    chooseOptions: 'اختاري الحجم',
    fromPrice: 'من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل أن تضعيه على وجه جاف.',
    items: [
      {
        q: 'هل أبلّل وجهي أولاً؟',
        a: 'لا. العلبة الإنجليزية تقول: ضعي على وجه جاف. الماء هو الشطف، لا البداية.',
      },
      {
        q: 'ما فقاعات الأكسجين حقاً؟',
        a: 'Methyl Perfluoroisobutyl Ether بنسبة 8%. مذيب يرغو على البشرة الجافة. العلبة تسمّي الرغوة فقاعات أكسجين تتولّد طبيعياً. ليست علاج أكسجين وليست غازاً تمتصينه.',
      },
      {
        q: 'هل هذا مستحضر وظيفي كوري؟',
        a: 'لا. وظيفة العلبة منظف وجه. وليس هناك مكوّن رئيسي لتسميته.',
      },
      {
        q: 'لماذا تتحدث الصفحات القديمة عن Phytolex وMultiEx؟',
        a: 'هما في التركيبة. Phytolex خلطة 0.2%؛ والمستخلصات النهائية عند 0.003%. MultiEx خلطة 0.01%. ليسا سبب الفقاعات، وليسا علاجاً مغذياً.',
      },
      {
        q: 'هل أحتاج أصابع مبللة في الوسط؟',
        a: 'العلبة الإنجليزية لا تطلب ذلك. ضعي، انتظري الفقاعات، دلّكي، اشطفي. الأصابع المبللة مقبولة إن أردت توزيعاً أوسع. ليست الطقس.',
      },
      {
        q: 'أي حجم أشتري؟',
        a: '180 مل مضخة المنزل. 500 مل زجاجة العيادة. التركيبة نفسها. اختاري ما يناسب كثرة استعمال المضخة.',
      },
      {
        q: 'هل أستخدمه في المنزل؟',
        a: 'نعم. PROFESSIONAL على الزجاجة اسم الخط. ومعظم زبائننا يستعملون 180 مل عند المغسلة كل يوم.',
      },
      {
        q: 'هل هو خالٍ من العطر؟ من الكبريتات؟ من البارابين؟',
        a: 'لا، لا، والعلبة الإنجليزية لا تطبع الثالثة. العطر والليمونين وماء السرو في التركيبة. كبريتات لوريث الصوديوم 2.4%. لا تشتريه من أجل قائمة خالٍ من.',
      },
      {
        q: 'هل أستخدمه أثناء الحمل؟',
        a: 'العلبة تطلب تجنّبه أثناء الحمل والرضاعة، ونحن ننقل ذلك. أري قائمة المكوّنات لمن يتابعك.',
      },
    ],
  },
  details: {
    eyebrow: 'الوقائع',
    title: 'ما تقوله الوثائق فعلاً.',
    rows: [
      { label: 'الوظيفة', value: 'منظف وجه - السطر المطبوع على العلبة' },
      { label: 'الشكل', value: 'مضخة تُشطف. تُوضع على وجه جاف' },
      { label: 'الأحجام', value: '180 مل منزلي · 500 مل احترافي' },
      { label: 'المظهر', value: 'سائل لزج غير شفاف' },
      { label: 'درجة الحموضة', value: '5.67، داخل مواصفة 5.30 إلى 6.30' },
      { label: 'الاستخدام', value: 'وجه جاف، فقاعات، تدليك دائري، شطف فاتر' },
      { label: 'التكرار', value: 'صباحاً ومساءً' },
      { label: 'الاختبارات', value: 'مختبر جلدياً؛ كل دفعة تُفحص للحموضة والميكروبات' },
      { label: 'الصلاحية', value: 'ثلاث سنوات دون فتح، وتاريخ الانتهاء على الزجاجة' },
      { label: 'الشركة', value: 'DTS MG Co., Ltd.، كوريا الجنوبية' },
    ],
  },
  closing: {
    title: 'وجه جاف، ثم الفقاعات.',
    body: 'الغسول اليومي لخط SOC، وكل نسبة مطبوعة أعلاه، لا شيء مخفي.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'المنتجات',
}

const RU: SnowO2Copy = {
  eyebrow: 'Очищение лица · Кислородные пузырьки',
  headline: 'Сухое лицо. Потом пузырьки.',
  subheadline:
    'Мягкое очищение, которое начинают на сухой коже. Естественно образующиеся кислородные пузырьки поднимают макияж и загрязнения, круговой массаж, тёплая вода смывает. Утром и вечером.',
  heroBullets: [
    'На сухое лицо, в стороне от глаз',
    'Кислородные пузырьки появляются при контакте, затем круговой массаж',
    'Смыть тёплой водой. Это умывание, не несмываемое средство',
    '180 мл дома, 500 мл на полке клиники',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', '180 мл / 500 мл', 'Утром и вечером'],
  chooseSize: 'Выберите объём',
  sizes: {
    homecareLabel: 'Дом',
    homecareNote: 'Ежедневный дозатор. Хватает на месяцы утра и вечера.',
    proLabel: 'Профессиональный',
    proNote: 'Клинический флакон. Та же формула, дольше хватает.',
  },
  usageNote: 'Утром и вечером',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'К корзине',
  loginToShop: 'Войдите, чтобы купить',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  stats: [
    { value: '8%', label: 'Эфир, из которого пузырьки' },
    { value: 'Сухо', label: 'На лицо до любой воды' },
    { value: 'Утро/вечер', label: 'Ежедневное умывание, затем смыть' },
    { value: '2', label: 'Объёма, одна формула' },
  ],
  effects: {
    eyebrow: 'Что делает',
    title: 'Нанести на сухое. Пузырьки. Смыть.',
    intro:
      'Три движения: средство на сухое лицо, кислородные пузырьки поднимают то, что на поверхности, тёплая вода смывает. Так описывает умывание коробка.',
    cards: [
      {
        title: 'Сухо',
        body: 'Это не пенка мокрыми руками. Наносят на сухое лицо, в стороне от глаз, и ждут пузырьков. Вода потом, не сначала.',
      },
      {
        title: 'Пузырьки',
        body: 'Естественно образующиеся кислородные пузырьки поднимают макияж и загрязнения. Кругового массажа достаточно. Не скраб.',
      },
      {
        title: 'Смыть',
        body: 'Тёплая вода забирает пузырьки и то, что они подняли. Лицо чистое и готово к тонику, а не покрыто уходом.',
      },
    ],
  },
  engine: {
    eyebrow: 'Умывание',
    title: 'Эфир - это пузырьки.',
    body:
      'Восемь процентов очищающего средства - Methyl Perfluoroisobutyl Ether, второй по величине компонент после воды. Именно он поднимается на сухой коже. Phytolex и MultiEx есть в формуле. Они не двигатель.',
    points: [
      {
        title: 'Methyl Perfluoroisobutyl Ether · 8%',
        body: 'Причина, по которой пузырьки появляются на сухом лице. Коробка называет их естественно образующимися кислородными пузырьками. Это цифра для карточки.',
      },
      {
        title: 'Умывание, которое остаётся комфортным',
        body: 'Бутиленгликоль 4,1%, глицерин 4% и пропандиол 1,8% под пеной, поэтому после смывания лицо не стянуто.',
      },
      {
        title: 'Само очищение',
        body: 'Cocamide DEA, laureth sulfate натрия и децилглюкозид моют. Это настоящее очищающее средство, а не крем, который вдруг пенится.',
      },
      {
        title: 'Phytolex и MultiEx',
        body: 'Названы потому, что старые тексты делали их причиной покупки. Phytolex - премикс 0,2%; готовые экстракты - 0,003%. MultiEx - премикс 0,01%. Они в формуле. Не они дают пузырьки.',
      },
    ],
    figureAlt: 'Очищающее средство GENOSYS SNOW O2, дозаторы 180 мл и 500 мл',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Сухое лицо. Пузырьки. Массаж. Смыть.',
    frequency: 'Утром и вечером',
    steps: [
      { title: 'Нанести', body: 'На сухое лицо, в стороне от глаз. Без воды сначала.' },
      { title: 'Пузырьки', body: 'Подождите, пока поднимутся кислородные пузырьки. Так работает средство.' },
      { title: 'Массаж', body: 'Круговые движения. Пузырьки поднимают макияж. Не скрабируйте.' },
      { title: 'Смыть', body: 'Тёплой водой, пока лицо не станет чистым. Затем тоник или то, что дальше.' },
    ],
    note:
      'Держите в стороне от глаз и слизистых; при попадании промойте прохладной водой. Избегайте во время беременности и грудного вскармливания - это предупреждение печатает сама упаковка. Открытый дозатор - ежедневное умывание, не средство, которое оставляют.',
    videoTitle: 'Умывание, на лице',
  },
  actives: {
    eyebrow: 'Внутри дозатора',
    title: 'Что в нём на самом деле.',
    intro: 'Каждый процент здесь - готовая концентрация во флаконе, а не догадка по торговому названию в начале списка.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote:
      'Каждый ингредиент, от большего к меньшему. На вашей коробке порядок короче, а грейпфрут и триэтаноламин названы там, где готовая формула их не несёт, поэтому эта страница следует формуле.',
  },
  suited: {
    eyebrow: 'Вам ли это',
    title: 'Ежедневное умывание, если нужны пузырьки.',
    forTitle: 'Берите, если',
    forList: [
      'Нужно очищение, которое начинают на сухой коже и снимают макияж без скраба',
      'Нравится ощущение процедуры в умывании и чистый смыв',
      'Утро и вечер - ваш ритм',
      'Нужен дозатор 180 мл дома или 500 мл на полке клиники',
    ],
    notTitle: 'Ищите другое, если',
    notList: [
      'Нужно умывание без отдушки. Здесь парфюм, лимонен и вода хиноки',
      'Нужно средство без сульфатов. Laureth sulfate натрия - 2,4%',
      'Вы беременны или кормите, и сама коробка просит этого избегать',
      'Нужен несмываемый уход. Это смывается',
      'Вы пришли за Phytolex или MultiEx. Это следы под пеной',
    ],
    note: 'Только для наружного применения. Держите в стороне от глаз и слизистых, при попадании промойте прохладной водой.',
  },
  routine: {
    eyebrow: 'Дальше утром',
    title: 'Умыть, затем линия сияния.',
    intro: 'Snow O₂ - первый шаг. Бустер, сыворотка Multi Vita, крем Multi Vita и SPF - после смывания.',
    thisProduct: 'Это умывание',
    viewProduct: 'Смотреть',
    chooseOptions: 'Выбрать объём',
    fromPrice: 'От',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Прежде чем нанести на сухое лицо.',
    items: [
      {
        q: 'Сначала намочить лицо?',
        a: 'Нет. Английская коробка: нанести на сухое лицо. Вода - это смывание, не начало.',
      },
      {
        q: 'Что такое кислородные пузырьки на самом деле?',
        a: 'Methyl Perfluoroisobutyl Ether 8%. Растворитель, который пенится на сухой коже. Коробка называет пену естественно образующимися кислородными пузырьками. Это не кислородная терапия и не газ, который вы впитываете.',
      },
      {
        q: 'Это корейская функциональная косметика?',
        a: 'Нет. Функция на коробке - очищение лица. Основного компонента здесь нет.',
      },
      {
        q: 'Почему старые страницы говорят о Phytolex и MultiEx?',
        a: 'Они в формуле. Phytolex - премикс 0,2%; готовые экстракты - 0,003%. MultiEx - премикс 0,01%. Не они дают пузырьки и не питающий уход.',
      },
      {
        q: 'Нужны ли мокрые пальцы в середине?',
        a: 'Английская коробка этого не просит. Нанести, дождаться пузырьков, массировать, смыть. Влажные пальцы нормальны, если нужно распределить дальше. Это не ритуал.',
      },
      {
        q: 'Какой объём брать?',
        a: '180 мл - домашний дозатор. 500 мл - клинический флакон. Одна формула. Берите тот, который соответствует частоте насоса.',
      },
      {
        q: 'Можно ли дома?',
        a: 'Да. PROFESSIONAL на флаконе - имя линии. Большинство наших покупателей используют 180 мл у раковины каждый день.',
      },
      {
        q: 'Без отдушки? Без сульфатов? Без парабенов?',
        a: 'Нет, нет, и третьего английская коробка не печатает. В формуле парфюм, лимонен и вода хиноки. Laureth sulfate натрия - 2,4%. Не берите его из-за списка «без».',
      },
      {
        q: 'Можно ли при беременности?',
        a: 'Коробка просит избегать во время беременности и лактации, и мы это передаём. Покажите состав тому, кто вас ведёт.',
      },
    ],
  },
  details: {
    eyebrow: 'Факты',
    title: 'Что документы говорят на самом деле.',
    rows: [
      { label: 'Функция', value: 'Очищение лица - строка на коробке' },
      { label: 'Формат', value: 'Смываемый дозатор. Наносят на сухое лицо' },
      { label: 'Объёмы', value: '180 мл дом · 500 мл профессиональный' },
      { label: 'Вид', value: 'Непрозрачная вязкая жидкость' },
      { label: 'pH', value: '5,67, в пределах спецификации 5,30-6,30' },
      { label: 'Применение', value: 'Сухое лицо, пузырьки, круговой массаж, тёплый смыв' },
      { label: 'Частота', value: 'Утром и вечером' },
      { label: 'Тесты', value: 'Дерматологически протестировано; каждая партия проверяется на pH и микробиологию' },
      { label: 'Срок', value: 'Три года невскрытым, срок годности на флаконе' },
      { label: 'Производитель', value: 'DTS MG Co., Ltd., Южная Корея' },
    ],
  },
  closing: {
    title: 'Сухое лицо, потом пузырьки.',
    body: 'Ежедневное умывание линии SOC, и каждый процент напечатан выше, ничего не скрыто.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Продукты',
}

const BY_LOCALE: Record<SnowO2Locale, SnowO2Copy> = { en: EN, ar: AR, ru: RU }

export function getSnowO2Copy(locale: string): SnowO2Copy {
  return BY_LOCALE[(locale as SnowO2Locale) in BY_LOCALE ? (locale as SnowO2Locale) : 'en']
}
