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

import { SNOW_O2_AR_COPY, SNOW_O2_RU_COPY } from './snowo2LocalizedCopy'

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
  "Aqua (Water), Methyl Perfluoroisobutyl Ether, Cocamide DEA, Butylene Glycol, Glycerin, Isopropyl Myristate, Sodium Laureth Sulfate, Propanediol, Acrylates Copolymer, Cocamidopropyl Betaine, Chamaecyparis Obtusa Water, Isopropyl Palmitate, Rosa Rugosa Leaf Extract, Melissa Officinalis Leaf Extract, Phaseolus Radiatus Extract, Pueraria Lobata Root Extract, Pueraria Mirifica Root Extract, Polygonum Cuspidatum Root Extract, Cimicifuga Racemosa Root Extract, Trifolium Pratense (Clover) Flower Extract, Punica Granatum Fruit Extract, Angelica Polymorpha Sinensis Root Extract, Betula Platyphylla Japonica Bark Extract, Rumex Crispus Root Extract, Soy Isoflavones, Glucose, Decyl Glucoside, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Tromethamine, Sodium Chloride, Xanthan Gum, Disodium EDTA, Decyl Alcohol, Cocamide MEA, Parfum (Fragrance), Limonene."

const EN: SnowO2Copy = {
  eyebrow: 'Oxygen-bubble cleanser · 180 ml / 500 ml',
  headline: 'It fizzes.',
  subheadline:
    'Put it on a dry face and it turns into fine oxygen bubbles all by itself, lifting make-up, dust and the day off your skin. Slow circles, a tepid rinse, and skin feels soft, not tight. Morning and evening.',
  heroBullets: [
    'Goes on a dry face, away from the eyes',
    'Oxygen bubbles rise on their own and lift make-up and impurities',
    'Circles with your fingertips, never a scrub',
    '180 ml at home, 500 ml on the clinic shelf',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '180 ml / 500 ml', 'Morning and evening'],
  chooseSize: 'Choose a size',
  sizes: {
    homecareLabel: 'Home',
    homecareNote: 'The daily pump for your bathroom shelf, morning and evening.',
    proLabel: 'Professional',
    proNote: 'The clinic bottle. The same formula, for a busy basin.',
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
    { value: '8%', label: 'The bubble maker, second only to water' },
    { value: 'Dry', label: 'On the face before any water' },
    { value: 'AM/PM', label: 'A daily wash, then rinse' },
    { value: '2', label: 'Sizes, one formula' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Start dry. Watch it rise. Rinse.',
    intro:
      'A Dubai day leaves dust, sweat and make-up on your skin. SNOW O₂ takes it off in three moves, and the bubbles do most of the work.',
    cards: [
      {
        title: 'Start dry',
        body: 'No water first. Smooth it over a dry face, away from the eyes, and give it a few seconds.',
      },
      {
        title: 'Watch it rise',
        body: 'Naturally generated oxygen bubbles form on their own and lift make-up and impurities from the surface. Slow circles are all it takes.',
      },
      {
        title: 'Rinse soft',
        body: 'Tepid water takes the foam and everything it lifted. Skin feels clean and comfortable, ready for toner.',
      },
    ],
  },
  engine: {
    eyebrow: 'The formula',
    title: 'Eight percent bubble power.',
    body:
      'The ingredient behind the fizz, methyl perfluoroisobutyl ether, is 8% of the cleanser and comes second only to water. That is why SNOW O₂ foams on dry skin without a drop of water or a scrub.',
    points: [
      {
        title: 'Methyl Perfluoroisobutyl Ether · 8%',
        body: 'The bubble maker. On a dry face it lifts into thousands of fine bubbles that carry make-up and impurities off the skin.',
      },
      {
        title: 'Comfort under the foam',
        body: 'Butylene glycol 4.1%, glycerin 4% and propanediol 1.8% stay behind the wash, so the rinse leaves skin soft, not tight.',
      },
      {
        title: 'A real cleanse',
        body: 'Cocamide DEA, sodium laureth sulfate and decyl glucoside do the washing, so one step takes off make-up and the day.',
      },
      {
        title: 'A wash you can watch',
        body: 'White cream turns into fizzing foam in seconds, so you know exactly when to start the massage.',
      },
    ],
    figureAlt: 'GENOSYS SNOW O2 cleanser: 8% bubble maker, second only to water',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Dry. Fizz. Rinse.',
    frequency: 'Morning and evening',
    steps: [
      {
        title: 'Apply',
        body: 'A thin, even layer on a dry face, away from the eyes. No water first.',
      },
      {
        title: 'Wait for the bubbles',
        body: 'A few seconds, and the oxygen bubbles come up on their own.',
      },
      {
        title: 'Massage',
        body: 'Slow circles with your fingertips. The bubbles do the lifting.',
      },
      {
        title: 'Rinse',
        body: 'Tepid water until the face is clear. Then SNOW BOOSTER, or whatever comes next.',
      },
    ],
    note:
      'Keep it away from the eyes and mucous membranes; if it gets in, rinse with cool water. Avoid it during pregnancy and while breastfeeding. For eye make-up and lips, use SKIN DEFENDER Lip & Eye Makeup Remover.',
    videoTitle: 'The wash, on a face',
  },
  actives: {
    eyebrow: 'Inside the pump',
    title: 'What makes it fizz.',
    intro:
      'The bubble maker, the cleansers and the comfort base, each with its real percentage in the bottle.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'Every ingredient, strongest first, from the finished formula.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'For anyone who wants the wash to do the work.',
    forTitle: 'Buy it if',
    forList: [
      'You want make-up and the day off in one step, without a scrub',
      'You love a cleanser you can see working',
      'Morning and evening is your rhythm',
      'You want the 180 ml pump at home, or the 500 ml on a clinic shelf',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You need a fragrance-free wash: this one carries a light fragrance',
      'You avoid sulfates: sodium laureth sulfate is part of the cleansing blend',
      'You are pregnant or breastfeeding',
      'You want a leave-on treatment: this is a wash that rinses off',
    ],
    note: 'For external use only. Keep it away from the eyes and mucous membranes, and rinse with cool water if contact occurs.',
  },
  routine: {
    eyebrow: 'The rest of the morning',
    title: 'Wash, then the brightening line.',
    intro:
      'SNOW O₂ is the first step. SNOW BOOSTER brings moisture straight back, then Multi Vita serum, Multi Vita cream and your SPF.',
    thisProduct: 'This wash',
    viewProduct: 'View',
    chooseOptions: 'Choose size',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Before the first fizz.',
    items: [
      {
        q: 'Do I wet my face first?',
        a: 'No. It goes on a dry face. Water comes at the end, for the rinse.',
      },
      {
        q: 'What makes the bubbles?',
        a: 'Methyl perfluoroisobutyl ether, 8% of the formula and second only to water. On dry skin it rises as fine oxygen bubbles, which is why the cleanser foams without water or scrubbing.',
      },
      {
        q: 'Does it take off make-up?',
        a: 'Yes. The bubbles lift foundation, powder and the day’s impurities. Keep it away from the eyes: for eye make-up and lips, use SKIN DEFENDER Lip & Eye Makeup Remover first.',
      },
      {
        q: 'How much do I use?',
        a: 'Enough for a thin, even layer over the whole face, so the bubbles form everywhere at once.',
      },
      {
        q: 'What comes after it?',
        a: 'SNOW BOOSTER toner brings moisture straight back, then your serum, cream and, in the morning, SPF.',
      },
      {
        q: 'Which size should I buy?',
        a: '180 ml is the home pump. 500 ml is the clinic bottle. Same formula. Pick the one that matches how often the pump is used.',
      },
      {
        q: 'Can I use it at home?',
        a: 'Yes. PROFESSIONAL on the bottle is the line name. Most of our customers keep the 180 ml by the sink and use it every day.',
      },
      {
        q: 'Is it fragrance-free or sulfate-free?',
        a: 'No. It carries a light fragrance, and sodium laureth sulfate is part of the cleansing blend. If you need a free-from wash, choose a fragrance-free, sulfate-free cleanser instead.',
      },
      {
        q: 'Can I use it while pregnant?',
        a: 'Avoid it during pregnancy and while breastfeeding. Show the ingredient list to whoever is looking after you.',
      },
    ],
  },
  details: {
    eyebrow: 'The details',
    title: 'Everything in one place.',
    rows: [
      { label: 'Type', value: 'Oxygen-bubble facial cleanser' },
      { label: 'Format', value: 'Rinse-off pump. Apply on a dry face' },
      { label: 'Sizes', value: '180 ml home · 500 ml professional' },
      { label: 'Texture', value: 'A thick, opaque liquid that turns to foam' },
      { label: 'pH', value: '5.67, inside a 5.30 to 6.30 specification' },
      { label: 'How to', value: 'Dry face, bubbles, circular massage, tepid rinse' },
      { label: 'Use', value: 'Morning and evening' },
      { label: 'Tested', value: 'Dermatologically tested' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the bottle' },
      { label: 'Made by', value: 'DTS MG Co., Ltd., South Korea' },
    ],
  },
  closing: {
    title: 'It fizzes. Then you rinse.',
    body: 'Dry face, a few seconds of bubbles, slow circles and a tepid rinse. The daily wash of the SOC line, morning and evening.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'Products',
}

const _AR: SnowO2Copy = {
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
  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
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

const _RU: SnowO2Copy = {
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

const BY_LOCALE: Record<SnowO2Locale, SnowO2Copy> = {
  en: EN,
  ar: { ..._AR, ...SNOW_O2_AR_COPY },
  ru: { ..._RU, ...SNOW_O2_RU_COPY },
}

export function getSnowO2Copy(locale: string): SnowO2Copy {
  return BY_LOCALE[(locale as SnowO2Locale) in BY_LOCALE ? (locale as SnowO2Locale) : 'en']
}
