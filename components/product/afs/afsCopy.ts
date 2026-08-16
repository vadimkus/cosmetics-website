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
    'Built for the days skin will not take more. It settles what is reactive, shields against the day, and puts moisture back — two or three drops, morning and night.',
  heroBullets: [
    'Designed for sensitive, reactive, easily irritated skin',
    'MultiEx BSASM® Plus at 1% — seven calming botanicals in one complex',
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
      'Seven botanicals travel together in one named complex, at one percent of everything in the bottle: Centella Asiatica, knotweed, skullcap, green tea, licorice, chamomile and rosemary. Around them sit the moisture pair — betaine and hyaluronic acid — and allantoin for comfort. Nothing else on this page is trying to be the story.',
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
    note: 'The cream that belongs with this serum is Skin Barrier Protecting Cream — NMF amino acids over the top, so the comfort lasts.',
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
      'You avoid fragrance entirely — this serum has a light orange-peel note',
      'You need a blemish or oil-control treatment, which this is not',
      'You want a brightening or anti-wrinkle serum — those are different bottles',
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
  headline: 'حين تقول البشرة: يكفي.',
  subheadline:
    'مُعدّ للأيام التي لا تحتمل فيها البشرة المزيد. يهدّئ ما يتفاعل، يحميها من يومها، ويعيد إليها الرطوبة — قطرتان أو ثلاث، صباحاً ومساءً.',
  heroBullets: [
    'مصمّم للبشرة الحساسة والتفاعلية وسريعة التهيّج',
    'MultiEx BSASM® Plus بنسبة ١٪ — سبعة مستخلصات مهدّئة في مركّب واحد',
    'بيتايين وألانتوين وحمض الهيالورونيك لترطيب يومي',
    'مختبر جلدياً · صباحاً ومساءً',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', '٣٠ مل بقطّارة', 'صباحاً ومساءً'],
  packSize: '٣٠ مل',
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
    { value: '١٪', label: 'MultiEx BSASM® Plus، المركّب النباتي' },
    { value: '٠٫٥٪', label: 'بيتايين، المرطّب المريح' },
    { value: 'صباحاً ومساءً', label: 'قطرتان أو ثلاث، ثم ربّتي' },
    { value: 'كوريا', label: 'من إنتاج DTS MG، الشركة صاحبة GENOSYS' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'يهدّئ. يحمي. يرطّب.',
    intro:
      'ثلاث مهام، وهي ما بُني السيروم من أجله: يهدّئ البشرة المتفاعلة، يقف بينها وبين يومها، ويعيد الرطوبة.',
    cards: [
      {
        title: 'يهدّئ',
        body: 'السنتيلا والبابونج والألانتوين تخفّف حدّة البشرة التي تتفاعل أصلاً. الوجه يهدأ، من دون طبقة ثقيلة.',
      },
      {
        title: 'يحمي',
        body: 'طبقة خفيفة من الراحة أمام الريح والتكييف وبقية يوم الخليج، فلا تبدأ البشرة الحساسة من الصفر كل مساء.',
      },
      {
        title: 'يرطّب',
        body: 'بيتايين بنسبة نصف بالمئة وهيالورونات الصوديوم تمسكان الماء حيث يُحتاج. خفيف بما يكفي تحت الكريم وتحت واقي الشمس.',
      },
    ],
  },
  engine: {
    eyebrow: 'المركّب',
    title: 'واحد بالمئة MultiEx BSASM® Plus. هذا هو السيروم.',
    body:
      'سبعة مستخلصات نباتية تسير معاً في مركّب واحد مسمّى، بنسبة واحد بالمئة من كل ما في الزجاجة: السنتيلا الآسيوية، وجذر الهوثارة، والشلمون البيكالي، والشاي الأخضر، وعرق السوس، والبابونج، وإكليل الجبل. حولها ثنائي الترطيب — البيتايين وحمض الهيالورونيك — والألانتوين للراحة. لا شيء آخر في هذه الصفحة يحاول أن يكون القصة.',
    points: [
      {
        title: 'MultiEx BSASM® Plus · ١٪',
        body: 'المركّب النباتي. السنتيلا تقوده، والستة الباقية معها. هذا هو الجزء الذي بُنيت حوله التركيبة.',
      },
      {
        title: 'بيتايين · ٠٫٥٪',
        body: 'مرطّب مريح بتركيز يُحس. يجذب الماء ويمنع شدّ البشرة وهي ترتوي.',
      },
      {
        title: 'ألانتوين · ٠٫١٪',
        body: 'العامل المهدّئ الكلاسيكي. يليّن ويهدّئ، ويترك البشرة المتفاعلة مستعدّة للخطوة التالية.',
      },
      {
        title: 'هيالورونات الصوديوم · ٠٫٠١٪',
        body: 'الصيغة الملحية من حمض الهيالورونيك. خفيفة وثابتة، لتمسك الرطوبة لا لتجلس على السطح كفيلم.',
      },
    ],
    figureAlt: 'المكوّنات الأساسية في سيروم GENOSYS All For Sensitive',
  },
  clean: {
    eyebrow: 'التركيبة',
    title: 'لا شيء قاسياً فيها.',
    intro: 'خمسة أشياء تبقى خارجاً، لأن البشرة الحساسة لا تحتاجها.',
    items: [
      'بدون بارابين',
      'بدون عامل سطحي اصطناعي',
      'بدون عطر اصطناعي',
      'بدون صبغة اصطناعية',
      'بدون إيثانول',
    ],
    note:
      'هناك نفحة خفيفة من قشر البرتقال من الزيت النباتي. هذا ليس عطراً اصطناعياً، وهو أيضاً سبب أن هذا السيروم ليس خالياً من العطر.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'قطرتان أو ثلاث. صباحاً ومساءً.',
    frequency: 'كل صباح وكل مساء',
    steps: [
      { title: 'نظّفي', body: 'ابدئي ببشرة نظيفة. غسول لطيف، ثم رذاذ أو تونر إن كان ذلك عادتك.' },
      { title: 'ضعي', body: 'قطرتان أو ثلاث على الوجه. ابتعدي عن محيط العين.' },
      { title: 'ربّتي', body: 'اضغطي بأصابعك حتى يختفي. لا تفركي بشرة متفاعلة.' },
      { title: 'أغلقي', body: 'أتبعيه بكريم Skin Barrier Protecting حتى تبقى الرطوبة. وفي الصباح اختتمي بواقي الشمس.' },
    ],
    note: 'الكريم الذي يناسب هذا السيروم هو Skin Barrier Protecting Cream — أحماض أمينية من العامل المرطّب الطبيعي فوقه، فتدوم الراحة.',
    videoTitle: 'شاهديه على البشرة',
  },
  actives: {
    eyebrow: 'ماذا فيه',
    title: 'التركيبة كاملة، بلا إخفاء.',
    intro:
      'البطاقات أدناه هي المكوّنات التي تقوم بالعمل. قائمة INCI الكاملة تحت القائمة، كما طُبعت على العبوة.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },
  suited: {
    eyebrow: 'هل يناسبك',
    title: 'جواب صريح.',
    forTitle: 'اختيار جيد إذا',
    forList: [
      'بشرتك حساسة أو تفاعلية أو سريعة الاحمرار',
      'يوم خليجي من حرّ وريح وتكييف يترك وجهك مشدوداً',
      'تريدين سيروماً يومياً يهدّئ لا يصحّح',
      'استخدمتِ شيئاً قوياً وتحتاجين أن تعود الراحة',
      'تريدين سيروماً واحداً صباحاً ومساءً تحت الكريم',
    ],
    notTitle: 'ابحثي عن غيره إذا',
    notList: [
      'تتجنّبين العطر تماماً — في هذا السيروم نفحة خفيفة من قشر البرتقال',
      'تحتاجين علاجاً للعيوب أو للدهون، وهذا ليس كذلك',
      'تريدين سيروم إشراق أو مضاد تجاعيد — تلك زجاجات أخرى',
      'تبحثين عن تقشير أو خطوة أحماض',
    ],
    note: 'للاستخدام الخارجي فقط، وابتعدي عن محيط العين. توقّفي واستشيري طبيباً إذا ظهر احمرار أو تورّم أو تهيّج.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'ماذا تضعين معه.',
    intro: 'السيروم خطوة. هذه المنتجات التي يجلس بينها، ويمكنك إضافة أي منها من هنا.',
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
        a: 'قطرتان أو ثلاث على بشرة نظيفة، صباحاً ومساءً. ربّتي حتى يختفي، ثم أغلقي بكريم. أبعديه عن محيط العين.',
      },
      {
        q: 'هل هو خالٍ من العطر؟',
        a: 'لا. فيه نفحة خفيفة من قشر البرتقال من زيت Citrus Aurantium Dulcis، والليمونين مُعلن. ما ليس فيه هو عطر اصطناعي. إن كنتِ تتجنّبين العطر تماماً فهذا ليس السيروم.',
      },
      {
        q: 'ما هو MultiEx BSASM® Plus؟',
        a: 'مركّب من سبعة مستخلصات نباتية بنسبة واحد بالمئة من السيروم: السنتيلا الآسيوية، وجذر الهوثارة، والشلمون البيكالي، والشاي الأخضر، وعرق السوس، والبابونج، وإكليل الجبل. وهو المركّب المسمّى الذي بُنيت حوله هذه التركيبة.',
      },
      {
        q: 'ماذا أضع فوقه؟',
        a: 'كريم Skin Barrier Protecting. السيروم يهدّئ ويرطّب؛ أحماض الكريم الأمينية من العامل المرطّب الطبيعي تمسك تلك الراحة. وفي الصباح واقي الشمس بعد الكريم.',
      },
      {
        q: 'هل أستخدمه بعد جلسة علاج أو تقشير؟',
        a: 'اسألي من أجرى الجلسة أولاً. على بشرة متفاعلة فقط، هذا هو السيروم الذي نمدّ اليد إليه. القرار لمن عمل على وجهك للتو.',
      },
      {
        q: 'هل هو آمن أثناء الحمل؟',
        a: 'لا يوجد في التركيبة ما يرد في قوائم التجنّب المعتادة، لكن راجعي طبيبك بدل الاكتفاء بكلامنا.',
      },
      {
        q: 'كيف ملمسه؟',
        a: 'سيروم شفاف لزج قليلاً يختفي بعد ربّات قليلة. بلا فيلم وبلا لزوجة، خفيف بما يكفي لصباح الخليج.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل.',
    rows: [
      { label: 'الشكل', value: 'سيروم وجه يُترك على البشرة، زجاجة بقطّارة' },
      { label: 'الحجم الصافي', value: '٣٠ مل / ١٫٠١ أونصة سائلة' },
      { label: 'الوظيفة', value: 'تهدئة وترطيب' },
      { label: 'الوقت', value: 'صباحاً ومساءً' },
      { label: 'أنواع البشرة', value: 'حساسة، تفاعلية، سريعة التهيّج' },
      { label: 'الأس الهيدروجيني', value: '٥٫٧٧، ضمن مواصفة ٥٫٢٠ إلى ٦٫٢٠' },
      { label: 'المظهر', value: 'سائل لزج شفاف' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات دون فتح، وتاريخ الانتهاء على العلبة' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'بلد المنشأ', value: 'صنع في كوريا بواسطة DTS MG' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'يهدّئ. يحمي. يرطّب.',
    body: 'قطرتان أو ثلاث، صباحاً ومساءً، وبشرة تحتمل يومها.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'جميع المنتجات',
}

const RU: AfsCopy = {
  eyebrow: 'Сыворотка · Чувствительная кожа',
  headline: 'Когда кожа говорит: хватит.',
  subheadline:
    'Для дней, когда кожа больше не выдерживает. Успокаивает то, что реагирует, защищает от дня и возвращает влагу — две-три капли утром и вечером.',
  heroBullets: [
    'Для чувствительной, реактивной, легко раздражаемой кожи',
    'MultiEx BSASM® Plus 1% — семь успокаивающих растений в одном комплексе',
    'Бетаин, аллантоин и гиалуроновая кислота для ежедневного увлажнения',
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
    { value: '0,5%', label: 'Бетаин, комфортный увлажнитель' },
    { value: 'Утро и вечер', label: 'Две-три капли, затем вбить' },
    { value: 'Корея', label: 'Производство DTS MG, владельца марки GENOSYS' },
  ],
  effects: {
    eyebrow: 'Что она делает',
    title: 'Успокаивает. Защищает. Увлажняет.',
    intro:
      'Три задачи, ради которых сыворотка и собрана: успокоить реактивную кожу, встать между ней и днём и вернуть влагу.',
    cards: [
      {
        title: 'Успокаивает',
        body: 'Центелла, ромашка и аллантоин снимают напряжение с кожи, которая уже реагирует. Лицо становится тише, без плёнки.',
      },
      {
        title: 'Защищает',
        body: 'Лёгкий слой комфорта против ветра, кондиционера и остального дня в заливе, чтобы чувствительной коже не приходилось начинать сначала каждый вечер.',
      },
      {
        title: 'Увлажняет',
        body: 'Бетаин на уровне половины процента и гиалуронат натрия удерживают воду там, где она нужна. Достаточно лёгкая, чтобы носить под кремом и под SPF.',
      },
    ],
  },
  engine: {
    eyebrow: 'Комплекс',
    title: 'Один процент MultiEx BSASM® Plus. В этом вся сыворотка.',
    body:
      'Семь растений идут вместе в одном названном комплексе, на уровне одного процента всего, что в флаконе: центелла азиатская, горец, шлемник, зелёный чай, солодка, ромашка и розмарин. Рядом с ними увлажняющая пара — бетаин и гиалуроновая кислота — и аллантоин для комфорта. Ничто другое на этой странице не пытается стать главной историей.',
    points: [
      {
        title: 'MultiEx BSASM® Plus · 1%',
        body: 'Растительный комплекс. Центелла ведёт его, остальные шесть — с ней. Именно вокруг этой части собрана формула.',
      },
      {
        title: 'Бетаин · 0,5%',
        body: 'Комфортный увлажнитель в количестве, которое чувствуется. Притягивает воду и не даёт коже стягиваться, пока она пьёт.',
      },
      {
        title: 'Аллантоин · 0,1%',
        body: 'Классический успокаивающий агент. Смягчает, успокаивает и оставляет реактивную кожу готовой к следующему шагу.',
      },
      {
        title: 'Гиалуронат натрия · 0,01%',
        body: 'Солевая форма гиалуроновой кислоты. Лёгкая и стабильная, чтобы удерживать влагу, а не лежать на поверхности плёнкой.',
      },
    ],
    figureAlt: 'Ключевые ингредиенты сыворотки GENOSYS All For Sensitive',
  },
  clean: {
    eyebrow: 'Формула',
    title: 'В ней нет ничего жёсткого.',
    intro: 'Пять вещей остаются снаружи, потому что чувствительной коже они не нужны.',
    items: [
      'Без парабенов',
      'Без искусственного ПАВ',
      'Без искусственного аромата',
      'Без искусственного пигмента',
      'Без этанола',
    ],
    note:
      'Есть лёгкая нота апельсиновой цедры от растительного масла. Это не искусственный аромат, и именно поэтому сыворотка не является fragrance-free.',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Две-три капли. Утро и вечер.',
    frequency: 'Каждое утро и каждый вечер',
    steps: [
      { title: 'Очистите', body: 'Начните с чистой кожи. Мягкое очищение, затем мист или тоник, если так привычно.' },
      { title: 'Нанесите', body: 'Две-три капли на лицо. Обходите область вокруг глаз.' },
      { title: 'Вбейте', body: 'Вдавите пальцами, пока не исчезнет. Реактивную кожу не растирайте.' },
      { title: 'Закрепите', body: 'Дальше Skin Barrier Protecting Cream, чтобы влага осталась. Утром завершите SPF.' },
    ],
    note: 'Крем к этой сыворотке — Skin Barrier Protecting Cream: аминокислоты NMF сверху, и комфорт держится.',
    videoTitle: 'Как это выглядит на коже',
  },
  actives: {
    eyebrow: 'Состав',
    title: 'Полная формула, без умолчаний.',
    intro:
      'Карточки ниже — активы, которые делают работу. Полный INCI под списком, как на упаковке.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },
  suited: {
    eyebrow: 'Подойдёт ли вам',
    title: 'Честный ответ.',
    forTitle: 'Хороший выбор, если',
    forList: [
      'Кожа чувствительная, реактивная или легко краснеет',
      'День в заливе — жара, ветер, кондиционер — оставляет лицо стянутым',
      'Нужна ежедневная сыворотка, которая успокаивает, а не «лечит»',
      'Вы использовали что-то сильное и хотите вернуть комфорт',
      'Нужна одна сыворотка утром и вечером под крем',
    ],
    notTitle: 'Посмотрите другое, если',
    notList: [
      'Вы полностью избегаете отдушек — в этой сыворотке лёгкая нота апельсиновой цедры',
      'Нужен уход от высыпаний или жирности, а это не он',
      'Нужна осветляющая или антивозрастная сыворотка — это другие флаконы',
      'Вы ищете пилинг или кислотный шаг',
    ],
    note: 'Только для наружного применения, избегайте области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
  },
  routine: {
    eyebrow: 'Дополните уход',
    title: 'С чем её использовать.',
    intro: 'Сыворотка — это шаг. Вот продукты, между которыми она стоит, и любой из них можно добавить прямо здесь.',
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
        a: 'Две-три капли на чистую кожу утром и вечером. Вбейте, пока не исчезнет, затем закрепите кремом. Не наносите вокруг глаз.',
      },
      {
        q: 'Она без отдушки?',
        a: 'Нет. Есть лёгкая нота апельсиновой цедры от масла Citrus Aurantium Dulcis, лимонен заявлен. Чего в ней нет — так это искусственного аромата. Если вы полностью избегаете отдушек, эта сыворотка не для вас.',
      },
      {
        q: 'Что такое MultiEx BSASM® Plus?',
        a: 'Комплекс из семи растений на уровне одного процента сыворотки: центелла азиатская, горец, шлемник, зелёный чай, солодка, ромашка и розмарин. Это названный комплекс, вокруг которого собрана формула.',
      },
      {
        q: 'Что наносить сверху?',
        a: 'Skin Barrier Protecting Cream. Сыворотка успокаивает и увлажняет; аминокислоты NMF крема удерживают этот комфорт. Утром после крема — SPF.',
      },
      {
        q: 'Можно после процедуры или пилинга?',
        a: 'Сначала спросите того, кто проводил процедуру. Просто на реактивной коже это сыворотка, к которой мы тянемся. Решение за специалистом, который только что работал с вашим лицом.',
      },
      {
        q: 'Безопасно ли при беременности?',
        a: 'В формуле нет ничего из обычных списков ограничений, но уточните у врача, а не полагайтесь на наши слова.',
      },
      {
        q: 'Какая она на ощупь?',
        a: 'Прозрачная, слегка вязкая сыворотка, которая исчезает за несколько касаний. Без плёнки и липкости, достаточно лёгкая для утра в заливе.',
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
      { label: 'pH', value: '5,77, в пределах спецификации 5,20–6,20' },
      { label: 'Вид', value: 'Прозрачная вязкая жидкость' },
      { label: 'Срок', value: 'Три года невскрытой, срок годности на коробке' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Успокаивает. Защищает. Увлажняет.',
    body: 'Две-три капли утром и вечером, и кожа, которая выдерживает день.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const BY_LOCALE: Record<AfsLocale, AfsCopy> = { en: EN, ar: AR, ru: RU }

export function getAfsCopy(locale: string): AfsCopy {
  return BY_LOCALE[(locale as AfsLocale) ?? 'en'] ?? EN
}
