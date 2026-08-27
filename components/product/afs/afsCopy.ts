/**
 * Bespoke copy for the ALL FOR SENSITIVE SERUM page (product 19).
 *
 * Same self-contained per-locale pattern as collagenMaskCopy.ts, so the
 * dedicated layout ships EN/AR/RU without adding keys to the shared messages
 * bundles.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Four documents cover every figure on this page. There is no dedicated DTS MG
 * product deck and no efficacy study, so the sourcing is tight:
 *
 *   Registration DOC/Formula_up/Formula-GENOSYS ALL FOR SENSITIVE SERUM.pdf
 *       The quantitative formula as finished concentrations. Use this, not the
 *       older Winnova Ingredient lists_old sheet, when the two disagree on a
 *       carrier residual. The named actives match on both.
 *   Registration DOC/SA/SA-GENOSYS ALL FOR SENSITIVE SERUM.pdf
 *       The only document that maps supplier trade names to INCI and
 *       percentage. This is where MultiEx BSASM Plus at 1.0000% and
 *       Phytolex SC at 0.0010% are recorded. Reading the formula INCI list
 *       alone and declaring those names "not in the product" is the failure
 *       already logged on products 10, 16, 28, 29 and 63. Do not repeat it.
 *   Registration DOC/Artwork/[GENOSYS]ALL FOR SENSITIVE SERUM.pdf
 *       Front-panel sentence, function (Soothing, moisturizing), AM & PM
 *       directions, dermatologically tested, 30ml, Made in Korea, full INCI,
 *       precautions.
 *   Registration DOC/COA/COA-GENOSYS ALL FOR SENSITIVE SERUM 30ml(WOC056).pdf
 *       pH 5.77 against 5.20-6.20, translucent viscous liquid, under 10 cfu/ml
 *       against a limit of 100, three-year unopened life. Do not print the
 *       lot code or the manufacture date. The next shipment is a different lot.
 *
 * THE FORMULA, as finished concentrations that matter on this page:
 *
 *   Betaine                         0.5000%
 *   Allantoin                       0.1000%
 *   Centella Asiatica Extract       0.0500%
 *   Polygonum Cuspidatum Root       0.0200%
 *   Scutellaria Baicalensis Root    0.0200%
 *   Camellia Sinensis Leaf          0.0100%
 *   Glycyrrhiza Glabra Root         0.0100%
 *   Sodium Hyaluronate              0.0100%
 *   Chamomilla Recutita Flower      0.0050%
 *   Rosmarinus Officinalis Leaf     0.0050%
 *   Citrus Aurantium Dulcis Peel Oil 0.0024%
 *   Limonene                        0.0176%
 *
 * THE PREMIXES, from the safety assessment:
 *
 *   MultiEx BSASM Plus   1.0000%   Centella + Polygonum + Scutellaria +
 *                                  Camellia + Glycyrrhiza + Chamomilla +
 *                                  Rosmarinus, in a glycerin/water/butylene
 *                                  glycol carrier. That is the botanical
 *                                  complex this page is built around.
 *   Phytolex SC          0.0010%   Phaseolus Radiatus + Betula Platyphylla
 *                                  Japonica Bark + Rumex Crispus Root.
 *                                  Real, recorded, and not credited with an
 *                                  effect. Same rule as the 1 ppb vitamins
 *                                  on product 63.
 *   FRAG-51193           0.0200%   Orange peel oil. This is why the page
 *                                  never says fragrance-free.
 *
 * THE DISTINCTIVE FACT, which is why this page exists.
 *
 * A July 2026 audit read the INCI list, did not open the safety assessment,
 * and banned MultiEx BSASM® from this product. The SA puts it at one percent
 * of the batch. The formula then lists what that premix delivers as finished
 * extract. Both statements are true. The page names the complex and the
 * seven botanicals inside it, the same way product 4 names BIOPHYTEX and
 * the six actives it carries. It does not add the premix and the extracts
 * together, and it does not apologise for the carrier.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Designed for sensitive skin, relieve / protect / moisturize
 *       artwork front panel
 *   Soothing, moisturizing                     artwork function line
 *   AM & PM, apply on the face, gently pat     artwork application
 *   Dermatologically tested                    artwork
 *   Every percentage above                     Formula_up
 *   MultiEx BSASM Plus by name at 1%           safety assessment
 *   pH 5.77, spec 5.20-6.20                    COA (no lot)
 *   Three-year unopened life                   COA span, expiry on the box
 *   Five no-additions                          artwork badge / gallery s3,
 *                                              each absence confirmed in the
 *                                              formula (no paraben, no added
 *                                              ethanol, no pigment, no
 *                                              artificial fragrance; orange
 *                                              peel oil is a fragrance
 *                                              ingredient and is named)
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - HEALING, REPAIR, ANTI-INFLAMMATORY, IMMUNE-BOOSTING, REGENERATION.
 *     All five were on this product in English, Arabic and Russian before
 *     15 Aug 2026, including beta-glucan as an "immune-boosting" active that
 *     "promotes healing". Drug-register for a cosmetic sold in the UAE.
 *   - PANTHENOL, MADECASSOSIDE. Protocol_Sensitive.pdf invents both. The
 *     formula has Centella extract, not a isolated madecassoside fraction.
 *     Do not link that PDF from this page.
 *   - FRAGRANCE-FREE. Orange peel oil and limonene are in the formula.
 *     "No artificial fragrance" is the accurate line.
 *   - CLINICAL PERCENTAGES. The 2019 Intertek test report is microbiology
 *     and heavy metals only. No efficacy study exists.
 *   - LOT CODES. Never print WOC056, WIF005, or any other batch.
 *   - PHYTOLEX SC as a featured active. It is in the SA at 0.001%. Name it
 *     only if a shopper asks; do not build a card on it.
 *   - ALOE, WITCH HAZEL, BETA-GLUCAN as lead actives. Each arrives as a
 *     0.001% premix. They are in the INCI. They do not lead the page.
 */

export type AfsLocale = 'en' | 'ar' | 'ru'

export interface AfsCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  packSize: string
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
  clean: {
    eyebrow: string
    title: string
    intro: string
    items: string[]
    note: string
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
    barcodeLabel: string
  }
  closing: {
    title: string
    body: string
  }
  reviewsTitle: string
  backToProducts: string
}

const EN: AfsCopy = {
  eyebrow: 'Serum · Sensitive skin',
  headline: 'When skin says enough.',
  subheadline:
    'Built for the days skin will not take more. It settles what is reactive, shields against the day, and puts moisture back - two or three drops, morning and night.',
  heroBullets: [
    'Designed for sensitive, reactive, easily irritated skin',
    'MultiEx BSASM® Plus at 1% - seven calming botanicals in one complex',
    'Betaine, allantoin and hyaluronic acid for daily moisture',
    'Dermatologically tested · morning and night',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '30ml dropper', 'Morning and night'],
  packSize: '30ml',
  usageNote: 'Morning and night',
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
    { value: '1%', label: 'MultiEx BSASM® Plus, the botanical complex' },
    { value: '0.5%', label: 'Betaine, the comfort humectant' },
    { value: 'AM & PM', label: 'Two or three drops, then pat' },
    { value: 'Korea', label: 'Made by DTS MG, the GENOSYS manufacturer' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Relieve. Protect. Moisturize.',
    intro:
      'Three jobs, which is what the serum is built for: settle reactive skin, stand between it and the day, and put moisture back.',
    cards: [
      {
        title: 'Relieve',
        body: 'Centella, chamomile and allantoin take the heat out of skin that is already reacting. The face feels quieter, not coated.',
      },
      {
        title: 'Protect',
        body: 'A light film of comfort against wind, air conditioning and the rest of a Gulf day, so sensitive skin does not have to start again every evening.',
      },
      {
        title: 'Moisturize',
        body: 'Betaine at half a percent and sodium hyaluronate hold water where it is needed. Lightweight enough to wear under cream and under SPF.',
      },
    ],
  },
  engine: {
    eyebrow: 'The complex',
    title: 'One percent MultiEx BSASM® Plus. That is the serum.',
    body:
      'Seven botanicals travel together in one named complex, at one percent of everything in the bottle: Centella Asiatica, knotweed, skullcap, green tea, licorice, chamomile and rosemary. Around them sit the moisture pair - betaine and hyaluronic acid - and allantoin for comfort. Nothing else on this page is trying to be the story.',
    points: [
      {
        title: 'MultiEx BSASM® Plus · 1%',
        body: 'The botanical complex. Centella leads it; the other six sit with her. This is the part of the formula the serum is built around.',
      },
      {
        title: 'Betaine · 0.5%',
        body: 'A comfort humectant at a level you can feel. It pulls water in and keeps skin from tightening while it drinks.',
      },
      {
        title: 'Allantoin · 0.1%',
        body: 'The classic soothing agent. Softens, settles, and leaves reactive skin willing to take the next step in the routine.',
      },
      {
        title: 'Sodium hyaluronate · 0.01%',
        body: 'The salt form of hyaluronic acid. Light, stable, and there to hold moisture rather than sit on the surface as a film.',
      },
    ],
    figureAlt: 'Key ingredients inside GENOSYS All For Sensitive Serum',
  },
  clean: {
    eyebrow: 'The formula',
    title: 'Nothing harsh in it.',
    intro:
      'Five things stay out, because sensitive skin has no use for them.',
    items: [
      'No paraben',
      'No artificial surfactant',
      'No artificial fragrance',
      'No artificial pigment',
      'No ethanol',
    ],
    note:
      'There is a light orange-peel note from the botanical oil. That is not an artificial fragrance, and it is also why this is not a fragrance-free serum.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Two or three drops. Morning and night.',
    frequency: 'Every morning and every evening',
    steps: [
      { title: 'Cleanse', body: 'Start on clean skin. A gentle cleanser, then a mist or toner if that is your habit.' },
      { title: 'Apply', body: 'Two or three drops on the face. Keep clear of the eye area.' },
      { title: 'Pat', body: 'Press in with your fingers until it disappears. Do not rub reactive skin.' },
      { title: 'Seal', body: 'Follow with Skin Barrier Protecting Cream so the moisture stays. In the morning, finish with SPF.' },
    ],
    note: 'The cream that belongs with this serum is Skin Barrier Protecting Cream - NMF amino acids over the top, so the comfort lasts.',
    videoTitle: 'See it on skin',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The full formula, nothing held back.',
    intro:
      'The cards below are the actives that do the work. The complete INCI is under the list, as printed on the pack.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'Every ingredient, in the same order as the box in your hand.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Honest answer.',
    forTitle: 'A good fit if',
    forList: [
      'Your skin is sensitive, reactive or easily flushed',
      'A Gulf day of heat, wind and air conditioning leaves your face tight',
      'You want a daily serum that calms rather than corrects',
      'You have just used something strong and need comfort back',
      'You want one serum you can wear morning and night under cream',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You avoid fragrance entirely - this serum has a light orange-peel note',
      'You need a blemish or oil-control treatment, which this is not',
      'You want a brightening or anti-wrinkle serum - those are different bottles',
      'You are looking for a peel or an acid step',
    ],
    note: 'For external use only, and keep it clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'What to put it with.',
    intro:
      'A serum is a step. These are the products it sits between, and you can add any of them here.',
    thisProduct: 'This product',
    viewProduct: 'View product',
    chooseOptions: 'Choose options',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Common questions.',
    items: [
      {
        q: 'How do I use it?',
        a: 'Two or three drops on clean skin, morning and night. Pat until it disappears, then seal with a cream. Keep it off the eye area.',
      },
      {
        q: 'Is it fragrance-free?',
        a: 'No. It has a light orange-peel note from Citrus Aurantium Dulcis peel oil, and limonene is declared. What it does not have is an artificial fragrance. If you avoid fragrance entirely, this is not the serum.',
      },
      {
        q: 'What is MultiEx BSASM® Plus?',
        a: 'A seven-botanical complex at one percent of the serum: Centella Asiatica, knotweed, skullcap, green tea, licorice, chamomile and rosemary. It is the named complex this formula is built around.',
      },
      {
        q: 'What should I put over it?',
        a: 'Skin Barrier Protecting Cream. The serum settles and hydrates; the cream’s NMF amino acids hold that comfort in. In the morning, SPF after the cream.',
      },
      {
        q: 'Can I use it after a treatment or a peel?',
        a: 'Ask whoever performed the treatment first. On skin that is simply reactive, this is the serum we reach for. A clinician who has just worked on your face should make that call.',
      },
      {
        q: 'Is it safe in pregnancy?',
        a: 'There is nothing in the formula on the usual avoid lists, but check with your doctor rather than take our word for it.',
      },
      {
        q: 'What does it feel like?',
        a: 'A translucent, slightly viscous serum that disappears on a few pats. No film, no tack, light enough for the Gulf morning.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details.',
    rows: [
      { label: 'Format', value: 'Leave-on face serum, dropper bottle' },
      { label: 'Net volume', value: '30ml / 1.01 fl. oz.' },
      { label: 'Function', value: 'Soothing, moisturizing' },
      { label: 'When', value: 'Morning and night' },
      { label: 'Skin types', value: 'Sensitive, reactive, easily irritated skin' },
      { label: 'pH', value: '5.77, inside a 5.20 to 6.20 specification' },
      { label: 'Appearance', value: 'Translucent viscous liquid' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'Relieve. Protect. Moisturize.',
    body: 'Two or three drops, morning and night, and skin that can take the day.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const AR: AfsCopy = {
  eyebrow: 'سيروم · البشرة الحساسة',
  headline: 'راحة يومية للبشرة الحساسة.',
  subheadline:
    'سيروم خفيف يساعد على تهدئة البشرة المتفاعلة ودعم ترطيبها من دون إحساس ثقيل. قطرتان إلى ثلاث صباحاً ومساءً لروتين أكثر لطفاً وراحة.',
  heroBullets: [
    'مناسب للبشرة الحساسة والمتفاعلة والمعرضة للاحمرار',
    'MultiEx BSASM® Plus بتركيز 1% - سبعة مستخلصات نباتية في مركّب واحد',
    'بيتين 0.5% وألانتوين 0.1% وهيالورونات الصوديوم 0.01%',
    'مختبر جلدياً · صباحاً ومساءً',
  ],
  badges: ['مختبر جلدياً', 'صُنع في كوريا', '30 مل مع قطّارة', 'صباحاً ومساءً'],
  packSize: '30 مل',
  usageNote: 'صباحاً ومساءً',
  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّل الدخول للتسوق',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق ١٬٠٠٠ درهم · يُشحن من دبي',
  stats: [
    { value: '1%', label: 'MultiEx BSASM® Plus، المركّب النباتي' },
    { value: '0.5%', label: 'بيتين لدعم ترطيب البشرة' },
    { value: 'صباحاً ومساءً', label: 'قطرتان إلى ثلاث مع التربيت بلطف' },
    { value: 'كوريا', label: 'بلد المنشأ' },
  ],
  effects: {
    eyebrow: 'ما الذي يقدمه لبشرتك؟',
    title: 'تهدئة وترطيب وراحة أخف.',
    intro:
      'عناية يومية متوازنة للبشرة التي تتأثر سريعاً بالحرارة والهواء الجاف والتكييف.',
    cards: [
      {
        title: 'يهدّئ',
        body: 'تجمع التركيبة السنتيلا والبابونج والألانتوين للمساعدة على استعادة الإحساس بالراحة من دون طبقة ثقيلة.',
      },
      {
        title: 'يدعم الراحة',
        body: 'قوام خفيف يلائم الأيام الحارة والبيئات المكيّفة ويساعد البشرة الحساسة على الشعور بمرونة أكبر.',
      },
      {
        title: 'يرطّب',
        body: 'يدعم البيتين 0.5% وهيالورونات الصوديوم 0.01% احتفاظ البشرة بالرطوبة، مع قوام ينسجم بسهولة تحت الكريم وواقي الشمس.',
      },
    ],
  },
  engine: {
    eyebrow: 'المركّب النباتي',
    title: 'MultiEx BSASM® Plus بتركيز 1%.',
    body:
      'يجمع المركّب السنتيلا الآسيوية والبوليجونوم والسكوتيلاريا والشاي الأخضر وعرق السوس والبابونج وإكليل الجبل. ويكمل البيتين وهيالورونات الصوديوم والألانتوين هذا المزيج بترطيب خفيف وإحساس مريح.',
    points: [
      {
        title: 'MultiEx BSASM® Plus · 1%',
        body: 'مركّب من سبعة مستخلصات نباتية صُممت حوله هوية هذا السيروم المهدئ.',
      },
      {
        title: 'بيتين · 0.5%',
        body: 'مكوّن مرطب يساعد البشرة على الاحتفاظ بالماء وتخفيف الإحساس بالشد.',
      },
      {
        title: 'ألانتوين · 0.1%',
        body: 'يدعم نعومة البشرة وإحساسها بالراحة ضمن العناية اليومية.',
      },
      {
        title: 'هيالورونات الصوديوم · 0.01%',
        body: 'شكل خفيف من حمض الهيالورونيك يساعد على الاحتفاظ بالرطوبة من دون إحساس ثقيل.',
      },
    ],
    figureAlt: 'المكوّنات الأساسية في سيروم GENOSYS All For Sensitive',
  },
  clean: {
    eyebrow: 'التركيبة',
    title: 'اختيارات مدروسة للبشرة الحساسة.',
    intro: 'تركيبة يومية تراعي ما لا تحتاجه البشرة المتفاعلة.',
    items: [
      'بدون بارابين',
      'بدون عامل سطحي اصطناعي',
      'بدون عطر اصطناعي',
      'بدون صبغة اصطناعية',
      'بدون إيثانول',
    ],
    note:
      'تحتوي التركيبة على زيت قشر البرتقال والليمونين، لذلك لا يُقدّم السيروم على أنه خالٍ من العطر.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'قطرتان أو ثلاث. صباحاً ومساءً.',
    frequency: 'كل صباح وكل مساء',
    steps: [
      { title: 'نظفي', body: 'ابدئي ببشرة نظيفة، ويمكنك استخدام تونر لطيف عند الرغبة.' },
      { title: 'ضعي السيروم', body: 'وزعي قطرتين إلى ثلاث على الوجه مع تجنب محيط العينين.' },
      { title: 'ربتي بلطف', body: 'ربتي بأطراف الأصابع حتى الامتصاص من دون فرك البشرة المتفاعلة.' },
      { title: 'أكملي الروتين', body: 'اتبعيه بكريم Skin Barrier Protecting، واختتمي الروتين الصباحي بواقي الشمس.' },
    ],
    note: 'الكريم الذي يناسب هذا السيروم هو Skin Barrier Protecting Cream - أحماض أمينية من العامل المرطّب الطبيعي فوقه، فتدوم الراحة.',
    videoTitle: 'شاهديه على البشرة',
  },
  actives: {
    eyebrow: 'ماذا فيه',
    title: 'المكونات التي تمنح البشرة راحتها.',
    intro:
      'تعرفي إلى المركب النباتي ومكونات الترطيب الأساسية، ثم اطلعي على قائمة INCI الكاملة كما تظهر على العبوة.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote: 'القائمة بالترتيب نفسه المطبوع على العبوة.',
  },
  suited: {
    eyebrow: 'هل يناسبك',
    title: 'هل يناسب روتينك؟',
    forTitle: 'اختيار جيد إذا',
    forList: [
      'بشرتك حساسة أو تفاعلية أو سريعة الاحمرار',
      'تترك الحرارة أو الأجواء المكيّفة بشرتك مشدودة وغير مرتاحة',
      'تبحثين عن سيروم يومي خفيف يركز على الراحة والترطيب',
      'تريدين عناية لطيفة بعد استخدام مستحضرات قوية، وبعد هدوء البشرة',
      'تريدين سيروماً واحداً صباحاً ومساءً تحت الكريم',
    ],
    notTitle: 'ابحثي عن غيره إذا',
    notList: [
      'تتجنّبين العطر تماماً - في هذا السيروم نفحة خفيفة من قشر البرتقال',
      'كان هدفك الأساسي التحكم بالدهون أو العناية بالبثور',
      'كنت تبحثين عن سيروم مخصص للإشراق أو مظهر التجاعيد',
      'تبحثين عن تقشير أو خطوة أحماض',
    ],
    note: 'للاستخدام الخارجي فقط. تجنبي محيط العينين، وأوقفي الاستخدام واطلبي المشورة الطبية عند ظهور احمرار أو تورم أو تهيج مستمر.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'روتين لطيف ومتكامل.',
    intro: 'ضعي السيروم بعد التنظيف والتونر، ثم أكملي العناية بالكريم وواقي الشمس صباحاً.',
    thisProduct: 'هذا المنتج',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الخيار',
    fromPrice: 'من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'أسئلة شائعة.',
    items: [
      {
        q: 'كيف أستخدمه؟',
        a: 'وزعي قطرتين إلى ثلاث على بشرة نظيفة صباحاً ومساءً، ثم ربتي بلطف حتى الامتصاص وأتبعيه بالكريم. تجنبي محيط العينين.',
      },
      {
        q: 'هل هو خالٍ من العطر؟',
        a: 'لا. تحتوي التركيبة على زيت قشر البرتقال والليمونين، مع عدم إضافة عطر اصطناعي. إذا كنت تتجنبين العطور تماماً فاختاري بديلاً مناسباً.',
      },
      {
        q: 'ما هو MultiEx BSASM® Plus؟',
        a: 'مركّب نباتي بتركيز 1% يضم السنتيلا الآسيوية والبوليجونوم والسكوتيلاريا والشاي الأخضر وعرق السوس والبابونج وإكليل الجبل.',
      },
      {
        q: 'ماذا أضع فوقه؟',
        a: 'اتبعيه بكريم Skin Barrier Protecting للمساعدة على الاحتفاظ بالترطيب، ثم ضعي واقي الشمس بعد الكريم صباحاً.',
      },
      {
        q: 'هل أستخدمه بعد جلسة علاج أو تقشير؟',
        a: 'اتبعي تعليمات المختص الذي أجرى الجلسة وانتظري حتى تصبح البشرة جاهزة للعناية الموضعية. لا يُستخدم على بشرة متضررة.',
      },
      {
        q: 'هل هو آمن أثناء الحمل؟',
        a: 'إذا كنت حاملاً أو مرضعة، راجعي طبيبك قبل إدخال أي مستحضر جديد إلى روتينك.',
      },
      {
        q: 'كيف ملمسه؟',
        a: 'سيروم شبه شفاف بقوام لزج خفيف، يمتص بالتربيت وينسجم بسهولة مع الروتين الصباحي.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل.',
    rows: [
      { label: 'الشكل', value: 'سيروم وجه يُترك على البشرة، زجاجة بقطّارة' },
      { label: 'الحجم الصافي', value: '30 مل / 1.01 أونصة سائلة' },
      { label: 'الوظيفة', value: 'تهدئة وترطيب' },
      { label: 'الوقت', value: 'صباحاً ومساءً' },
      { label: 'أنواع البشرة', value: 'حساسة، تفاعلية، سريعة التهيّج' },
      { label: 'الأس الهيدروجيني', value: '5.77 ضمن نطاق 5.20-6.20' },
      { label: 'المظهر', value: 'سائل شبه شفاف بقوام لزج' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات دون فتح، وتاريخ الانتهاء على العلبة' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'بلد المنشأ', value: 'صُنع في كوريا' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'راحة خفيفة، صباحاً ومساءً.',
    body: 'قطرتان إلى ثلاث تمنحان البشرة الحساسة ترطيباً يومياً وإحساساً أكثر هدوءاً.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'جميع المنتجات',
}

const RU: AfsCopy = {
  eyebrow: 'Сыворотка · Чувствительная кожа',
  headline: 'Ежедневный комфорт для чувствительной кожи.',
  subheadline:
    'Лёгкая сыворотка помогает успокоить реактивную кожу и поддержать увлажнение без ощущения тяжести. Две-три капли утром и вечером - для мягкого и комфортного ухода.',
  heroBullets: [
    'Для чувствительной, реактивной и склонной к покраснению кожи',
    'MultiEx BSASM® Plus 1% - семь растительных экстрактов в одном комплексе',
    'Бетаин 0,5%, аллантоин 0,1% и гиалуронат натрия 0,01%',
    'Дерматологически протестировано · утро и вечер',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', '30 мл с пипеткой', 'Утро и вечер'],
  packSize: '30 мл',
  usageNote: 'Утро и вечер',
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
    { value: '1%', label: 'MultiEx BSASM® Plus, растительный комплекс' },
    { value: '0,5%', label: 'Бетаин для поддержки увлажнения' },
    { value: 'Утро и вечер', label: 'Две-три капли, затем мягко вбить' },
    { value: 'Корея', label: 'Страна производства' },
  ],
  effects: {
    eyebrow: 'Что она делает',
    title: 'Успокаивает, увлажняет, возвращает комфорт.',
    intro:
      'Ежедневный уход для кожи, которая быстро реагирует на жару, сухой воздух и кондиционирование.',
    cards: [
      {
        title: 'Успокаивает',
        body: 'Центелла, ромашка и аллантоин помогают вернуть чувствительной коже ощущение спокойствия без плотной плёнки.',
      },
      {
        title: 'Поддерживает комфорт',
        body: 'Лёгкая текстура подходит для жаркого климата и помещений с кондиционером, не перегружая реактивную кожу.',
      },
      {
        title: 'Увлажняет',
        body: 'Бетаин 0,5% и гиалуронат натрия 0,01% помогают удерживать влагу. Сыворотка легко наслаивается под крем и SPF.',
      },
    ],
  },
  engine: {
    eyebrow: 'Комплекс',
    title: 'MultiEx BSASM® Plus в концентрации 1%.',
    body:
      'Комплекс объединяет центеллу азиатскую, горец, шлемник, зелёный чай, солодку, ромашку и розмарин. Бетаин, гиалуронат натрия и аллантоин дополняют его лёгким увлажнением и комфортом.',
    points: [
      {
        title: 'MultiEx BSASM® Plus · 1%',
        body: 'Комплекс из семи растительных экстрактов, вокруг которого построена успокаивающая направленность сыворотки.',
      },
      {
        title: 'Бетаин · 0,5%',
        body: 'Увлажняющий компонент помогает коже удерживать воду и уменьшает ощущение стянутости.',
      },
      {
        title: 'Аллантоин · 0,1%',
        body: 'Поддерживает мягкость и ощущение спокойствия в ежедневном уходе.',
      },
      {
        title: 'Гиалуронат натрия · 0,01%',
        body: 'Лёгкая форма гиалуроновой кислоты помогает удерживать влагу без ощущения тяжести.',
      },
    ],
    figureAlt: 'Ключевые ингредиенты сыворотки GENOSYS All For Sensitive',
  },
  clean: {
    eyebrow: 'Формула',
    title: 'Продуманный состав для чувствительной кожи.',
    intro: 'Ежедневная формула без лишней нагрузки для реактивной кожи.',
    items: [
      'Без парабенов',
      'Без искусственного ПАВ',
      'Без искусственного аромата',
      'Без искусственного пигмента',
      'Без этанола',
    ],
    note:
      'Формула содержит масло апельсиновой цедры и лимонен, поэтому сыворотка не является средством без отдушки.',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Две-три капли. Утро и вечер.',
    frequency: 'Каждое утро и каждый вечер',
    steps: [
      { title: 'Подготовьте кожу', body: 'Начните с мягкого очищения; при желании нанесите тоник.' },
      { title: 'Нанесите', body: 'Две-три капли на лицо. Обходите область вокруг глаз.' },
      { title: 'Мягко вбейте', body: 'Впитайте средство лёгкими похлопывающими движениями, не растирая реактивную кожу.' },
      { title: 'Завершите уход', body: 'Нанесите Skin Barrier Protecting Cream, а утром завершите уход SPF.' },
    ],
    note: 'Крем к этой сыворотке - Skin Barrier Protecting Cream: аминокислоты NMF сверху, и комфорт держится.',
    videoTitle: 'Как это выглядит на коже',
  },
  actives: {
    eyebrow: 'Состав',
    title: 'Компоненты, которые дарят коже комфорт.',
    intro:
      'Познакомьтесь с растительным комплексом и ключевыми увлажняющими компонентами. Полный INCI приведён ниже в том же порядке, что и на упаковке.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },
  suited: {
    eyebrow: 'Подойдёт ли вам',
    title: 'Подойдёт ли она вашему уходу?',
    forTitle: 'Хороший выбор, если',
    forList: [
      'Кожа чувствительная, реактивная или легко краснеет',
      'Жара или кондиционированный воздух оставляют ощущение стянутости',
      'Нужна лёгкая ежедневная сыворотка с акцентом на комфорт и увлажнение',
      'После интенсивных средств коже нужен более мягкий уход, когда реакция уже стихла',
      'Нужна одна сыворотка утром и вечером под крем',
    ],
    notTitle: 'Посмотрите другое, если',
    notList: [
      'Вы полностью избегаете отдушек - в этой сыворотке лёгкая нота апельсиновой цедры',
      'Основная задача - контроль жирности или уход за высыпаниями',
      'Вы ищете сыворотку именно для сияния или коррекции видимых морщин',
      'Вы ищете пилинг или кислотный шаг',
    ],
    note: 'Только для наружного применения, избегайте области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
  },
  routine: {
    eyebrow: 'Дополните уход',
    title: 'Мягкий и последовательный ритуал.',
    intro: 'Наносите сыворотку после очищения и тоника, затем используйте крем, а утром - солнцезащитное средство.',
    thisProduct: 'Этот продукт',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать вариант',
    fromPrice: 'от',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Частые вопросы.',
    items: [
      {
        q: 'Как её использовать?',
        a: 'Нанесите две-три капли на чистую кожу утром и вечером, мягко вбейте до впитывания и завершите уход кремом. Избегайте области вокруг глаз.',
      },
      {
        q: 'Она без отдушки?',
        a: 'Нет. Формула содержит масло апельсиновой цедры и лимонен, хотя искусственная отдушка не добавлена. Если вы полностью избегаете ароматических компонентов, выберите другой продукт.',
      },
      {
        q: 'Что такое MultiEx BSASM® Plus?',
        a: 'Это растительный комплекс в концентрации 1%: центелла азиатская, горец, шлемник, зелёный чай, солодка, ромашка и розмарин.',
      },
      {
        q: 'Что наносить сверху?',
        a: 'Skin Barrier Protecting Cream. Сыворотка успокаивает и увлажняет; аминокислоты NMF крема удерживают этот комфорт. Утром после крема - SPF.',
      },
      {
        q: 'Можно после процедуры или пилинга?',
        a: 'Следуйте рекомендациям специалиста, проводившего процедуру, и дождитесь, пока кожа будет готова к нанесению косметики. Не используйте на повреждённой коже.',
      },
      {
        q: 'Безопасно ли при беременности?',
        a: 'Во время беременности и грудного вскармливания согласуйте введение нового средства со своим врачом.',
      },
      {
        q: 'Какая она на ощупь?',
        a: 'Полупрозрачная, слегка вязкая сыворотка, которая быстро впитывается при похлопывании и легко вписывается в утренний уход.',
      },
    ],
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Подробности.',
    rows: [
      { label: 'Формат', value: 'Оставляемая на коже сыворотка, флакон с пипеткой' },
      { label: 'Объём', value: '30 мл / 1,01 fl. oz.' },
      { label: 'Функция', value: 'Успокаивающая, увлажняющая' },
      { label: 'Когда', value: 'Утро и вечер' },
      { label: 'Типы кожи', value: 'Чувствительная, реактивная, легко раздражаемая' },
      { label: 'pH', value: '5,77, в пределах спецификации 5,20-6,20' },
      { label: 'Вид', value: 'Полупрозрачная вязкая жидкость' },
      { label: 'Срок', value: 'Три года невскрытой, срок годности на коробке' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Лёгкий комфорт утром и вечером.',
    body: 'Две-три капли помогают чувствительной коже сохранять увлажнённость и ощущение спокойствия.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const BY_LOCALE: Record<AfsLocale, AfsCopy> = { en: EN, ar: AR, ru: RU }

export function getAfsCopy(locale: string): AfsCopy {
  return BY_LOCALE[(locale as AfsLocale) ?? 'en'] ?? EN
}
