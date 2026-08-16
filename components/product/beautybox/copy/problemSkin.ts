/**
 * Copy for the PROBLEM SKIN CARE BEAUTY BOX page (product 55), in English, Arabic
 * and Russian.
 *
 * ─── Sourcing rules ──────────────────────────────────────────────────────────
 *
 * A box has no paperwork of its own, so every claim below traces to a document
 * belonging to one of the five products inside it.
 *
 *   Snow O₂ 180ml (product 10)
 *     Ingredient lists_old/GENOSYS SNOW O2.pdf
 *     Professional deck slides 16-20
 *     Methyl Perfluoroisobutyl Ether 3.000% is the bubble agent, pH 5.86.
 *     Phytolex SC 0.2000% (ACT Co.) - defined on deck slide 19 as a complex of
 *     Phaseolus Radiatus, Betula Platyphylla Japonica bark and Rumex Crispus
 *     root, and credited there with relieving irritation and inflammation.
 *     Contains Sodium Laureth Sulfate, Parfum, Limonene.
 *
 *   Intensive Problem Control Toner 200ml (product 15)
 *     Problem Control Toner/{Formula,COA,Free_Sales_Certificate,Artwork 200ml}
 *     Genosys Intensive Problem Control Toner/{Formula,COA,CFS,Artwork 200ml}
 *     Professional deck slides 25-34. Homecare deck defers to it explicitly.
 *     Deck slide 27: "After using GENOSYS INTENSIVE PROBLEM CONTROL TONER for
 *     4 weeks, the amount of sebum decreased by about 50%." Same slide: certified
 *     non-comedogenic, tested by QACS Ltd.
 *     Deck slide 26: non-comedogenic, anti-blemish, sebum control, astringent,
 *     soothing and cooling, "subacid formula that restores the pH balance".
 *     Deck slide 29 - Anti Sebum P: "A patented complex of botanical extracts to
 *     contract pores and control excessive sebum secretion. (Complex of Ulmus
 *     Davidiana Root Extract, Pueraria Lobata Root Extract, Oenothera Biennis
 *     Flower Extract, Pinus Palustris Leaf Extract)". All four sit consecutively
 *     in the INCI.
 *     Deck slide 32 - SNOW ICE: "Complex of Menthyl Lactate, Ethyl Menthane
 *     Carboxamide, Methyl Diisopropyl Propionamide, Caprylic/Capric
 *     Triglyceride", cooling by activating TRPM8. All four are in the INCI.
 *     Deck slides 30-32: tea tree extract and leaf oil, rosemary leaf, zinc PCA,
 *     tannic acid, salicylic acid, each with the manufacturer's own mechanism.
 *     Deck slide 28 - two uses: wipe with a cotton pad, or soak pads and leave
 *     them on the face 5-10 minutes as a DIY mask.
 *
 *   Problem Control Serum 30ml (product 20)
 *     Ingredient lists_old/GENOSYS PROBLEM CONTROL SERUM.pdf
 *     Homecare deck: "reduces sebum by 17% and colour-blemishes by 8% after
 *     4 weeks of application."
 *     Zinc PCA inhibits P. acnes and S. epidermidis, is anti-seborrheic, and
 *     reduces sebum by inhibiting 5α-reductase. Salix Nigra bark corrects the
 *     abnormal desquamation of acne-prone skin and sloughs dead cells away.
 *     Carton front: "PCS is an anti-blemish serum that helps to improve skin
 *     breakouts by contributing to excessive sebum control and sloughing away of
 *     dead skin cells." Code PCS. Dermatologically tested.
 *
 *   Intensive Problem Control Cream 50g (product 30)
 *     Ingredient lists_old/GENOSYS INTENSIVE PROBLEM CONTROL CREAM.pdf
 *     Homecare deck: "reduces sebum by 14% and colour-blemishes by 9% after
 *     4 weeks of application." NET WT. 50g homecare, 250g professional.
 *     Carton front: "PCC helps rebalance skin oiliness and prevent skin
 *     breakouts while keeping the skin hydrated." Code PCC. Dermatologically
 *     tested.
 *
 *   Soothing Bomb Sea Algae Mask 25g (product 36), three sachets
 *     Soothing Bomb Sea Mask/{Ingredient_Report, COA lot LE001, deck}
 *     Registration DOC/SA/SA-GENOSYS SOOTHING BOMB SEA ALGAE MASK.pdf (QACS)
 *     Professional deck slides 91-98. Eucalace® sheet: eucalyptus spunlace
 *     nonwoven, finer and higher fibre count than ordinary nonwovens, breathable,
 *     no chemical residue on the fabric. Allantoin 0.100% and Panthenol 0.100%
 *     are the two highest-dosed actives. Castanea Crenata Shell Extract is
 *     credited on slide 97 with sebum control and pore tightening; Hamamelis
 *     Virginiana Leaf Extract with minimising the look of enlarged pores.
 *     Peppermint oil 0.005%. pH 5.69. No artificial pigment; the green is
 *     Gardenia Florida Fruit Extract. 15-20 minutes, then pat the rest in.
 *
 * ─── Claims that must not come back without a new document ───────────────────
 *
 *   Willow bark in the cream     The homecare deck reuses the serum's ingredient
 *                                slides for the cream, so it credits the cream
 *                                with Salix Nigra bark. The cream INCI contains
 *                                neither willow bark nor salicylic acid. Willow
 *                                belongs to the serum, salicylic acid to the
 *                                toner, and neither to the cream.
 *   "Anti-microbial" as a        Zinc PCA and the radish root ferment each have
 *   property of a finished       documented antimicrobial action as raw
 *   product                      materials. Nothing tests the finished cream for
 *                                it, and on a cosmetic the word reads as a drug
 *                                claim. Removed from #30 on 14 Aug.
 *   Killing acne bacteria        The deck says zinc PCA inhibits proliferation of
 *                                P. acnes in vitro. That is an ingredient
 *                                mechanism, not a promise about a face.
 *   A percentage for zinc PCA,   Not verified against a signed formula, so the
 *   salicylic acid or tea tree   page names them and describes what they do
 *                                without dosing them.
 *   An efficacy figure for the   There is none in any document. Sold on what is
 *   sea algae mask               measurably in it and on the two ingredients the
 *                                manufacturer credits with pore and sebum work.
 *   A duration for the box       Nothing documents how long five products last.
 *
 * ─── Confirmed genuine, do not "correct" ─────────────────────────────────────
 *
 *   Anti Sebum P and SNOW ICE are real DTS MG trade names, defined on
 *   professional deck slides 29 and 32, and every ingredient behind them is in
 *   the toner INCI. They were nearly stripped out as invented marketing.
 *
 * See beautyBoxCopy.ts for the rules every box module follows, including why no
 * price appears in any of them.
 */

import type { BeautyBoxCopy, BeautyBoxLocaleCopy } from '../beautyBoxCopy'

const EN: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Products',
  headline: 'Less oil in four weeks. Fewer breakouts after it.',
  subheadline:
    'Oil is what starts the cycle. It blocks the pore, the pore inflames, and the mark it leaves outlasts the spot by months. So every step in this box was measured against that one thing, and every step moved it. The toner cut sebum by about half in four weeks. The serum took it down 17% and faded existing marks by 8%. The cream, 14% and 9%. Around them, an oxygen cleanser that never needs scrubbing and three sea algae masks for the evenings when skin has had enough.',
  heroBullets: [
    'Shine, breakouts and the marks they leave behind, which is usually the part nobody treats',
    'Sebum down by about half on the toner in four weeks, and down again on the serum and the cream',
    'The toner is certified non-comedogenic, so the routine cannot block the pores it is clearing',
    'Four full sizes and three sheet masks, for less than the same five bought one at a time',
  ],
  kitSize: '5 products',
  fullSizeNote: 'Full sizes',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',
  addToBag: 'Add the box',
  adding: 'Adding...',
  added: 'Added',
  outOfStock: 'Out of stock',
  loginToShop: 'Log in to shop',
  inBag: 'In your bag',
  viewBag: 'View bag',
  badges: ['Authentic GENOSYS', 'Made in Korea', '4 full sizes + 3 masks', 'Dubai in 1-2 hours'],
  stats: [
    { value: '50%', label: 'less sebum after four weeks with the toner' },
    { value: '17%', label: 'less sebum on the serum, and 8% fewer marks, over four weeks' },
    { value: '3', label: 'sea algae masks, for the evenings skin needs calming' },
    { value: 'Korea', label: 'made for DTS MG in Seoul, the lab GENOSYS was built around' },
  ],
  contents: {
    eyebrow: 'What is inside',
    title: 'Five products, and each one works on oil',
    intro:
      'Every product here has its own page and its own price, so you can read the full detail on any of them before you buy. Together they run one routine end to end: wash without scrubbing, take the oil down, treat what is already there, and keep the skin comfortable enough that you actually stay with it.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Step 1 - Cleanse',
        body:
          'Goes on to a dry face and foams by itself, so oily skin gets a deep clean with no rubbing over spots that are already sore. Phytolex SC, a mung bean, birch and curly dock complex, settles the irritation as it works.',
        facts: ['Foams on its own, no scrubbing', 'Bubble agent at 3%', 'Phytolex SC', '180ml'],
      },
      {
        titleKey: 'routineProblemControlTonerTitle',
        productNumber: '15',
        quantity: 1,
        step: 'Step 2 - Tone',
        body:
          'The strongest number in the box comes from here: sebum down by about half after four weeks. Anti Sebum P, a patented four-plant complex, tightens pores and slows the oil, salicylic acid clears out what is already in them, and SNOW ICE drops the skin temperature so a face that runs hot stops feeling like it.',
        facts: ['Sebum down ~50% in 4 weeks', 'Certified non-comedogenic', 'Anti Sebum P, patented', '200ml'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'Any evening skin needs calming',
        body:
          'Three of them, because problem skin in treatment has bad weeks. A eucalyptus Eucalace® sheet, breathable and residue-free, carrying allantoin and panthenol at 0.1% each. Chestnut shell extract keeps working on sebum and pore size while you lie there, and witch hazel leaf tightens the look of the pores themselves.',
        facts: ['Allantoin and panthenol 0.1% each', 'Eucalace® sheet', 'No artificial pigment', '25g each'],
      },
      {
        titleKey: 'routineProblemControlSerumTitle',
        productNumber: '20',
        quantity: 1,
        step: 'Step 3 - Treat, morning and night',
        body:
          'Zinc PCA at 0.05%, and it goes in neat rather than as a diluted premix. That is the ingredient Korea registers this serum on for anti-blemishes, oil and sebum control. Over 90% of the bottle is water, so it goes under the cream without adding anything to the surface.',
        facts: ['Zinc PCA 0.05%, neat', 'Over 90% water', 'Dermatologically tested', '30ml'],
      },
      {
        titleKey: 'routineProblemControlCreamTitle',
        productNumber: '30',
        quantity: 1,
        step: 'Step 4 - Seal it in',
        body:
          'The step that answers the usual complaint about acne routines, that they leave skin tight and peeling. There is no oil in this cream at all, so it can close the routine without adding anything back: trehalose at 1.5% and xylitol at 0.5% hold water in while the same 0.05% of zinc PCA keeps working.',
        facts: ['No oil, butter, wax or emulsifier', 'Zinc PCA 0.05%, as in the serum', 'Trehalose 1.5%, xylitol 0.5%', '50g'],
      },
    ],
    eanLabel: 'Barcode',
    each: 'each',
    viewItem: 'Read the full page',
    boughtSeparately: 'Bought separately',
    inThisBox: 'In this box',
    youSave: 'You save',
    againstSeparate: 'against buying the five separately',
    seeBreakdown: 'See the breakdown',
    savingNote:
      'Prices update live, so this comparison is always what you would actually pay today.',
  },
  howTo: {
    eyebrow: 'How to use it',
    title: 'A week on problem skin',
    intro:
      'Four steps morning and night, with a mask on any evening you want one. Each product carries its own full instructions on its own page; this is how they fit together.',
    steps: [
      {
        title: 'Morning: cleanse on dry skin',
        body:
          'Pump the cleanser on to a dry face, avoiding the eyes. Wait for the oxygen bubbles to build, massage gently in circles, rinse with tepid water. No scrubbing, which is the point on skin with active spots.',
      },
      {
        title: 'Tone, and take your time over it',
        body:
          'Soak a cotton pad and wipe along the skin, which lifts the residue cleansing leaves behind. It cools as it goes on, and that is the SNOW ICE complex rather than alcohol.',
      },
      {
        title: 'Or use the toner as a ten-minute compress',
        body:
          'On a bad week, soak pads and lay them over the oiliest areas for five to ten minutes. It is the cheapest way to get more out of a bottle you already own.',
      },
      {
        title: 'Serum, morning and night',
        body:
          'Two or three drops over the whole face while the toner is still damp, then press rather than rub. This is the step doing the sebum work, so it is the one worth not skipping.',
      },
      {
        title: 'Cream last',
        body:
          'A small amount, smoothed over the serum, morning and night. Oily skin often skips moisturiser and then produces more oil to compensate. This one is built not to be heavy.',
      },
      {
        title: 'A mask, whenever skin is angry',
        body:
          'On a clean face after the toner, lay the sheet on for fifteen to twenty minutes. Lift it off and press the rest in. Do not rinse. Follow with the serum and cream as usual.',
      },
    ],
    note:
      'The toner contains a BHA and the serum contains willow bark, so both make skin a little more sun-sensitive. Wear sun protection in the morning, which also matters because sunlight darkens the marks a breakout leaves behind.',
  },
  evidence: {
    eyebrow: 'What is in it',
    title: 'The numbers behind it',
    intro:
      'Three of the five products here were measured on the same thing, over the same four weeks, and all three moved it. Here is what they came back with.',
    cards: [
      {
        value: '50%',
        title: 'Less sebum after four weeks, on the toner',
        body:
          'The largest single result in this box, and it comes from the step most people treat as optional. Four weeks of use took the amount of sebum on the skin down by about half. It is also the step that earns the box its non-comedogenic certification.',
      },
      {
        value: '17%',
        title: 'Less sebum on the serum, and 8% fewer marks',
        body:
          'Measured over four weeks. The second number is the one worth reading twice: colour-blemishes, meaning the marks a breakout leaves behind long after the spot has gone, fell 8%. Most acne routines never touch those.',
      },
      {
        value: '14%',
        title: 'Less sebum on the cream, and 9% fewer marks',
        body:
          'Same four-week measurement, same two things, from the step that is meant to be doing nothing but moisturising. That is why the cream is in the routine rather than any other moisturiser you already own.',
      },
      {
        value: 'Certified',
        title: 'Non-comedogenic, tested by QACS Ltd.',
        body:
          'The toner was tested and certified for low likelihood of blocking pores. On a routine aimed at clogged pores, that is not a technicality: it is the difference between a product that clears skin and one that quietly feeds the problem.',
      },
    ],
    footnote:
      'Two of the names on the toner are ours. Anti Sebum P is a patented complex of David elm root, kudzu root, evening primrose flower and longleaf pine leaf, and it works by contracting pores and slowing sebum at the gland. SNOW ICE is a cooling complex that activates TRPM8, the receptor that senses cold, which is why the toner drops skin temperature rather than just feeling wet.',
  },
  suited: {
    eyebrow: 'Suitability',
    title: 'Who this box is for',
    forTitle: 'A good match if',
    forList: [
      'Your skin is oily and shines by midday, and blotting paper has become part of your routine',
      'You break out regularly and the marks left behind are as much of a problem as the spots',
      'Your pores look enlarged around the nose and cheeks',
      'You have tried drying everything out and ended up with skin that is both oily and flaking',
      'You want the sebum claim measured rather than implied',
    ],
    notForTitle: 'Look elsewhere if',
    notForList: [
      'Dark patches and uneven tone are the real target. The Skin Brightening box is built around two Korean-licensed brighteners',
      'Lines and firmness are the real target. The Anti-Aging box is built around the registered anti-wrinkle serum and cream',
      'Dryness is the real target. The Deep Moisturizing box is built for that instead',
      'Menthol bothers you. The toner cools deliberately and the mask carries peppermint oil, so both will tingle',
      'You are pregnant or breastfeeding, in which case check the salicylic acid in the toner with your doctor before starting',
    ],
    alternativesLabel: 'The boxes mentioned above',
    alternatives: [
      { productNumber: '56', label: 'Skin Brightening Beauty Box' },
      { productNumber: '58', label: 'Anti-Aging Beauty Box' },
      { productNumber: '59', label: 'Deep Moisturizing Beauty Box' },
    ],
    note:
      'Cleanser, toner, serum, cream and mask are all dermatologically tested, and the toner is certified non-comedogenic on top of that. If your skin is reactive as well as oily, start the toner every other day.',
  },
  details: {
    eyebrow: 'Specifications',
    title: 'The details',
    rows: [
      { label: 'Contents', value: '5 products: cleanser 180ml, toner 200ml, serum 30ml, cream 50g, and three sea algae masks at 25g each' },
      { label: 'Skin type', value: 'Oily, combination and blemish-prone skin. The cream is the step that keeps it from going tight' },
      { label: 'Routine', value: 'Cleanse, tone, serum, cream, morning and night. A mask on any evening skin needs calming' },
      { label: 'Clinical', value: 'Sebum down about 50% on the toner, 17% on the serum and 14% on the cream, each over four weeks. Marks down 8% on the serum and 9% on the cream' },
      { label: 'Certification', value: 'The toner is certified non-comedogenic, tested by QACS Ltd.' },
      { label: 'Sensation', value: 'The toner cools on contact through the SNOW ICE complex, and the mask contains peppermint oil' },
      { label: 'Fragrance', value: 'The cleanser is lightly fragranced, allergens listed in full. The mask has no added fragrance and no artificial pigment' },
      { label: 'Origin', value: 'Made in Korea for DTS MG Co., Ltd., Seoul' },
      { label: 'Testing', value: 'All five products dermatologically tested' },
      { label: 'Discounts', value: 'The bundle price is already the discount, so other offers do not stack on the box' },
    ],
  },
  faq: {
    eyebrow: 'Before you buy',
    title: 'Questions worth asking',
    items: [
      {
        q: 'Will this dry my skin out like other acne products?',
        a: 'That is what the cream is there to stop. Most acne routines work by stripping oil and leave skin tight, flaking and, a week later, oilier than before as it overcompensates. Here the sebum work happens through zinc PCA at the gland rather than by degreasing the surface, and the cream puts water back with xylitol and trehalose. It still measured 14% less sebum while doing it.',
      },
      {
        q: 'What is the tingle in the toner?',
        a: 'SNOW ICE, our cooling complex, built on menthyl lactate and two other cooling agents. It activates TRPM8, the receptor your skin uses to sense cold, so it genuinely lowers skin temperature rather than just feeling cold. There is no alcohol behind it. If you dislike the sensation it fades in under a minute.',
      },
      {
        q: 'Why three sheet masks and only one of everything else?',
        a: 'Because problem skin has bad weeks and the other four are daily steps that last months. The masks are the thing you reach for after a flare-up, a long day, or a night that showed on your face. Chestnut shell extract in them works on sebum and pore size too, so they are not just a comfort step.',
      },
      {
        q: 'Can I use this with a prescription acne treatment?',
        a: 'Speak to whoever prescribed it first. Retinoids and benzoyl peroxide already thin and sensitise the skin, and the toner contains a BHA on top of that. Where people usually land is keeping the cleanser, the cream and the masks, and spacing the toner and serum around the prescription rather than layering everything.',
      },
      {
        q: 'How soon would I see anything?',
        a: 'All three measurements were taken at four weeks, so that is the honest answer for the sebum and the marks. Oiliness is the first thing you notice changing, usually before the month is up. Take a photograph now, because marks fade slowly enough that a mirror will not show you the difference.',
      },
      {
        q: 'Can I just buy the products separately?',
        a: 'Yes, and each one is linked above. The box is not a different formula or an exclusive size, it is the same five units at a lower total. If you already own some of them, buying the gaps will cost you less than the box.',
      },
    ],
  },
}

/* Anti Sebum P, SNOW ICE, Eucalace®, Phytolex SC, Zinc PCA, QACS Ltd., TRPM8,
   Snow O₂ and the DTS MG address all sit inside U+2066/U+2069 in this block.
   Each begins or ends on a bidi-neutral character - a registered mark, a
   trailing comma or period, a digit - and without the isolate the
   right-to-left paragraph throws that character to the wrong side. */
const AR: BeautyBoxCopy = {
  eyebrow: 'صندوق الجمال',
  backToProducts: 'المنتجات',
  headline: 'زيت أقل خلال أربعة أسابيع. وبثور أقل بعدها.',
  subheadline:
    'الزيت هو ما يبدأ الدورة. يسد المسام، فتلتهب، وتبقى الآثار التي يخلّفها شهوراً بعد اختفاء البثرة. لذلك قيست كل خطوة في هذا الصندوق على هذا الأمر بالذات، وحرّكته كل خطوة. خفّض التونر الدهون بنحو النصف خلال أربعة أسابيع. وخفّضها السيروم ‎17%‎ وقلّل الآثار الموجودة ‎8%‎. والكريم ‎14%‎ و‎9%‎. وحولها منظف بالأكسجين لا يحتاج إلى فرك، وثلاثة أقنعة بالطحالب البحرية للأمسيات التي تحتاج فيها البشرة إلى راحة.',
  heroBullets: [
    'اللمعان والبثور والآثار التي تتركها وراءها، وهي عادةً الجزء الذي لا يعالجه أحد',
    'الدهون أقل بنحو النصف مع التونر خلال أربعة أسابيع، وأقل مرة أخرى مع السيروم والكريم',
    'التونر معتمد كغير مسبب لانسداد المسام، فلا يمكن للروتين أن يسد المسام التي ينظفها',
    'أربعة أحجام كاملة وثلاثة أقنعة ورقية، بأقل من شراء الخمسة منفصلة',
  ],
  kitSize: '5 منتجات',
  fullSizeNote: 'أحجام كاملة',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  addToBag: 'أضف الصندوق',
  adding: 'جارٍ الإضافة...',
  added: 'تمت الإضافة',
  outOfStock: 'غير متوفر',
  loginToShop: 'سجّل الدخول للشراء',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
  badges: ['\u2066GENOSYS\u2069 أصلي', 'صنع في كوريا', '4 أحجام كاملة + 3 أقنعة', 'دبي خلال 1-2 ساعة'],
  stats: [
    { value: '50%', label: 'دهون أقل بعد أربعة أسابيع مع التونر' },
    { value: '17%', label: 'دهون أقل مع السيروم، وآثار أقل بنسبة 8% خلال أربعة أسابيع' },
    { value: '3', label: 'أقنعة بالطحالب البحرية للأمسيات التي تحتاج فيها البشرة إلى تهدئة' },
    { value: 'كوريا', label: 'صنع لصالح \u2066DTS MG\u2069 في سيول، المختبر الذي بنيت حوله \u2066GENOSYS\u2069' },
  ],
  contents: {
    eyebrow: 'ما بداخله',
    title: 'خمسة منتجات، وكل واحد منها يعمل على الزيت',
    intro:
      'لكل منتج هنا صفحته الخاصة وسعره الخاص، فيمكنك قراءة التفاصيل الكاملة لأي منها قبل الشراء. ومعاً تشكّل روتيناً واحداً من البداية إلى النهاية: غسل دون فرك، خفض الزيت، معالجة ما هو موجود بالفعل، وإبقاء البشرة مرتاحة بما يكفي كي تستمر فعلاً.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'الخطوة 1 - التنظيف',
        body:
          'يوضع على وجه جاف ويتحول إلى رغوة من تلقاء نفسه، فتحصل البشرة الدهنية على تنظيف عميق دون فرك فوق بثور مؤلمة أصلاً. ومركب \u2066Phytolex SC\u2069، من فول المونغ ولحاء البتولا وجذر الحميض، يهدئ التهيج أثناء العمل.',
        facts: ['رغوة ذاتية دون فرك', 'عامل الفقاعات بنسبة 3%', '\u2066Phytolex SC\u2069', '180 مل'],
      },
      {
        titleKey: 'routineProblemControlTonerTitle',
        productNumber: '15',
        quantity: 1,
        step: 'الخطوة 2 - التونر',
        body:
          'أقوى رقم في الصندوق يأتي من هنا: الدهون أقل بنحو النصف بعد أربعة أسابيع. مركب \u2066Anti Sebum P\u2069 الحاصل على براءة اختراع، وهو مزيج من أربعة نباتات، يضيّق المسام ويبطئ الزيت، وحمض الساليسيليك ينظف ما بداخلها، و\u2066SNOW ICE\u2069 يخفض حرارة البشرة فيتوقف الوجه الساخن عن الإحساس بذلك.',
        facts: ['الدهون أقل بنحو 50% خلال 4 أسابيع', 'معتمد كغير مسبب لانسداد المسام', 'براءة اختراع \u2066Anti Sebum P\u2069', '200 مل'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'أي مساء تحتاج فيه البشرة إلى تهدئة',
        body:
          'ثلاثة منها، لأن البشرة المشكلة تحت العلاج تمر بأسابيع صعبة. ورقة \u2066Eucalace®\u2069 من الأوكالبتوس، تسمح بمرور الهواء وخالية من البقايا، تحمل الألانتوين والبانثينول بنسبة 0.1% لكل منهما. ومستخلص قشر الكستناء يواصل العمل على الدهون وحجم المسام بينما أنت مستلقٍ، وأوراق بندق الساحرة تشد مظهر المسام نفسها.',
        facts: ['الألانتوين والبانثينول 0.1% لكل منهما', 'ورقة \u2066Eucalace®\u2069', 'دون أصباغ صناعية', '25 غ لكل قناع'],
      },
      {
        titleKey: 'routineProblemControlSerumTitle',
        productNumber: '20',
        quantity: 1,
        step: 'الخطوة 3 - العلاج، صباحاً ومساءً',
        body:
          'زنك \u2066PCA\u2069 بنسبة 0.05%، ويدخل صافياً لا كخليط مخفّف. هذا هو المكوّن الذي تسجّل عليه كوريا هذا السيروم لمقاومة العيوب والتحكم بالدهون والزهم. أكثر من 90% من الزجاجة ماء، فيجلس تحت الكريم دون أن يضيف شيئاً على السطح.',
        facts: ['زنك \u2066PCA\u2069 0.05% صافياً', 'أكثر من 90% ماء', 'مختبر جلدياً', '30 مل'],
      },
      {
        titleKey: 'routineProblemControlCreamTitle',
        productNumber: '30',
        quantity: 1,
        step: 'الخطوة 4 - التثبيت',
        body:
          'الخطوة التي ترد على الشكوى المعتادة من روتينات حب الشباب، أنها تترك البشرة مشدودة ومتقشرة. لا زيت في هذا الكريم إطلاقاً، فيستطيع ختم الروتين دون أن يضيف شيئاً: تريهالوز 1.5% وزايليتول 0.5% يحبسان الماء بينما يواصل زنك \u2066PCA\u2069 نفسه بنسبة 0.05% عمله.',
        facts: ['بلا زيت أو زبدة أو شمع أو مستحلب', 'زنك \u2066PCA\u2069 0.05%، كما في السيروم', 'تريهالوز 1.5%، زايليتول 0.5%', '50 غ'],
      },
    ],
    eanLabel: 'الباركود',
    each: 'لكل واحد',
    viewItem: 'اقرأ الصفحة كاملة',
    boughtSeparately: 'عند الشراء منفصلاً',
    inThisBox: 'في هذا الصندوق',
    youSave: 'توفّر',
    againstSeparate: 'مقارنة بشراء الخمسة منفصلة',
    seeBreakdown: 'اعرض التفصيل',
    savingNote: 'تتحدّث الأسعار مباشرة، فهذه المقارنة هي دائماً ما ستدفعه اليوم فعلاً.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'أسبوع مع البشرة المشكلة',
    intro:
      'أربع خطوات صباحاً ومساءً، مع قناع في أي مساء ترغب فيه. لكل منتج تعليماته الكاملة على صفحته الخاصة؛ وهذا هو ترتيبها معاً.',
    steps: [
      {
        title: 'الصباح: نظّف على بشرة جافة',
        body:
          'ضع المنظف على وجه جاف مع تجنب العينين. انتظر تكوّن فقاعات الأكسجين، دلّك بلطف بحركات دائرية، ثم اشطف بماء فاتر. دون فرك، وهذا هو المقصود مع بشرة فيها بثور نشطة.',
      },
      {
        title: 'ضع التونر، ولا تستعجل فيه',
        body:
          'بلّل قطنة وامسح بمحاذاة البشرة، فيرفع ذلك ما يتركه التنظيف خلفه. يبرد عند وضعه، وذلك بفضل مركب \u2066SNOW ICE\u2069 لا الكحول.',
      },
      {
        title: 'أو استخدم التونر ككمادة لعشر دقائق',
        body:
          'في أسبوع صعب، بلّل قطناً وضعه على أكثر المناطق دهنية لخمس إلى عشر دقائق. أرخص وسيلة للاستفادة أكثر من عبوة تملكها أصلاً.',
      },
      {
        title: 'السيروم، صباحاً ومساءً',
        body:
          'قطرتان أو ثلاث على كامل الوجه بينما التونر ما زال رطباً، ثم اضغط بدل الفرك. هذه هي الخطوة التي تعمل على الدهون، فهي الخطوة التي لا تستحق التخطي.',
      },
      {
        title: 'الكريم في النهاية',
        body:
          'كمية صغيرة تُوزَّع فوق السيروم، صباحاً ومساءً. كثيراً ما تتخطى البشرة الدهنية المرطب ثم تنتج زيتاً أكثر تعويضاً. وهذا الكريم مصمم كي لا يكون ثقيلاً.',
      },
      {
        title: 'قناع، كلما كانت البشرة غاضبة',
        body:
          'على وجه نظيف بعد التونر، ضع الورقة من خمس عشرة إلى عشرين دقيقة. ارفعها واضغط الباقي داخل البشرة. لا تشطف. تابع بالسيروم والكريم كالمعتاد.',
      },
    ],
    note:
      'التونر يحتوي على حمض \u2066BHA\u2069 والسيروم يحتوي على لحاء الصفصاف، فكلاهما يزيد حساسية البشرة للشمس قليلاً. استخدم واقي الشمس صباحاً، وهو مهم أيضاً لأن ضوء الشمس يعمّق الآثار التي تتركها البثرة.',
  },
  evidence: {
    eyebrow: 'ما بداخله',
    title: 'الأرقام وراءه',
    intro:
      'ثلاثة من المنتجات الخمسة هنا قيست على الأمر نفسه، خلال الأسابيع الأربعة نفسها، وحرّكته ثلاثتها. وهذه نتائجها.',
    cards: [
      {
        value: '50%',
        title: 'دهون أقل بعد أربعة أسابيع، مع التونر',
        body:
          'أكبر نتيجة منفردة في هذا الصندوق، وتأتي من الخطوة التي يعدّها معظم الناس اختيارية. أربعة أسابيع من الاستخدام خفّضت كمية الدهون على البشرة بنحو النصف. وهي أيضاً الخطوة التي تمنح الصندوق اعتماده كغير مسبب لانسداد المسام.',
      },
      {
        value: '17%',
        title: 'دهون أقل مع السيروم، وآثار أقل بنسبة 8%',
        body:
          'قيست خلال أربعة أسابيع. والرقم الثاني يستحق القراءة مرتين: الآثار الملوّنة، أي العلامات التي تتركها البثرة بعد اختفائها بوقت طويل، انخفضت 8%. ومعظم روتينات حب الشباب لا تمسّها أصلاً.',
      },
      {
        value: '14%',
        title: 'دهون أقل مع الكريم، وآثار أقل بنسبة 9%',
        body:
          'القياس نفسه خلال أربعة أسابيع، والأمران نفسهما، من الخطوة التي يفترض ألا تفعل شيئاً سوى الترطيب. ولهذا السبب هذا الكريم تحديداً في الروتين، لا أي مرطب آخر تملكه بالفعل.',
      },
      {
        value: 'معتمد',
        title: 'غير مسبب لانسداد المسام، باختبار \u2066QACS Ltd.\u2069',
        body:
          'اختبر التونر واعتمد لانخفاض احتمال سدّه للمسام. وفي روتين موجّه للمسام المسدودة، هذه ليست تفصيلاً تقنياً: إنها الفرق بين منتج ينقي البشرة وآخر يغذّي المشكلة بهدوء.',
      },
    ],
    footnote:
      'اسمان على التونر من تسميتنا نحن. \u2066Anti Sebum P\u2069 مركب حاصل على براءة اختراع من جذر الدردار الصيني وجذر الكودزو وزهرة زهرة الربيع المسائية وأوراق الصنوبر طويل الأوراق، ويعمل بتضييق المسام وإبطاء الدهون عند الغدة. و\u2066SNOW ICE\u2069 مركب تبريد ينشّط \u2066TRPM8\u2069، المستقبل الذي يستشعر البرودة، ولهذا يخفض التونر حرارة البشرة بدل أن يكون مجرد إحساس بالبلل.',
  },
  suited: {
    eyebrow: 'الملاءمة',
    title: 'لمن هذا الصندوق',
    forTitle: 'مناسب إذا',
    forList: [
      'بشرتك دهنية وتلمع بحلول منتصف النهار، وصار ورق التنشيف جزءاً من روتينك',
      'تظهر لديك البثور بانتظام، والآثار التي تتركها لا تقل إزعاجاً عن البثور نفسها',
      'تبدو مسامك متسعة حول الأنف والوجنتين',
      'جربت تجفيف كل شيء فانتهيت ببشرة دهنية ومتقشرة في آن واحد',
      'تريد ادعاء خفض الدهون مقيساً لا مُلمّحاً إليه',
    ],
    notForTitle: 'ابحث عن غيره إذا',
    notForList: [
      'كانت البقع الداكنة وتفاوت اللون هي الهدف الحقيقي. صندوق تفتيح البشرة مبني حول منتجين مرخصين كورياً للتفتيح',
      'كانت الخطوط والشد هي الهدف الحقيقي. صندوق مكافحة الشيخوخة مبني حول السيروم والكريم المسجلين لمكافحة التجاعيد',
      'كان الجفاف هو الهدف الحقيقي. صندوق الترطيب العميق مصمم لذلك',
      'كان المنثول يزعجك. التونر يبرّد عن قصد والقناع يحتوي على زيت النعناع، فكلاهما سيمنحك وخزاً',
      'كنتِ حاملاً أو مرضعة، فراجعي طبيبك بشأن حمض الساليسيليك في التونر قبل البدء',
    ],
    alternativesLabel: 'الصناديق المذكورة أعلاه',
    alternatives: [
      { productNumber: '56', label: 'صندوق تفتيح البشرة' },
      { productNumber: '58', label: 'صندوق مكافحة الشيخوخة' },
      { productNumber: '59', label: 'صندوق الترطيب العميق' },
    ],
    note:
      'المنظف والتونر والسيروم والكريم والقناع كلها مختبرة جلدياً، والتونر معتمد كغير مسبب لانسداد المسام إضافة إلى ذلك. وإذا كانت بشرتك حساسة ودهنية معاً، فابدأ التونر يوماً بعد يوم.',
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      { label: 'المحتويات', value: '5 منتجات: منظف 180 مل، تونر 200 مل، سيروم 30 مل، كريم 50 غ، وثلاثة أقنعة بالطحالب البحرية 25 غ لكل منها' },
      { label: 'نوع البشرة', value: 'البشرة الدهنية والمختلطة والمعرضة للبثور. الكريم هو الخطوة التي تمنعها من الشد' },
      { label: 'الروتين', value: 'تنظيف، تونر، سيروم، كريم، صباحاً ومساءً. وقناع في أي مساء تحتاج فيه البشرة إلى تهدئة' },
      { label: 'النتائج السريرية', value: 'الدهون أقل بنحو 50% مع التونر، و17% مع السيروم، و14% مع الكريم، خلال أربعة أسابيع لكل منها. والآثار أقل 8% مع السيروم و9% مع الكريم' },
      { label: 'الاعتماد', value: 'التونر معتمد كغير مسبب لانسداد المسام، باختبار \u2066QACS Ltd.\u2069' },
      { label: 'الإحساس', value: 'التونر يبرّد عند التلامس بفضل مركب \u2066SNOW ICE\u2069، والقناع يحتوي على زيت النعناع' },
      { label: 'العطر', value: 'المنظف معطر مع الإفصاح عن مسبباته للحساسية. والقناع خالٍ من العطر المضاف ومن الأصباغ الصناعية' },
      { label: 'المنشأ', value: 'صنع في كوريا لصالح \u2066DTS MG Co., Ltd.\u2069، سيول' },
      { label: 'الاختبارات', value: 'المنتجات الخمسة كلها مختبرة جلدياً' },
      { label: 'الخصومات', value: 'سعر المجموعة هو الخصم بالفعل، لذا لا تُجمع العروض الأخرى على الصندوق' },
    ],
  },
  faq: {
    eyebrow: 'قبل الشراء',
    title: 'أسئلة تستحق السؤال',
    items: [
      {
        q: 'هل سيجفف هذا بشرتي مثل منتجات حب الشباب الأخرى؟',
        a: 'هذا تحديداً ما وُجد الكريم لمنعه. معظم روتينات حب الشباب تعمل بتجريد الزيت وتترك البشرة مشدودة ومتقشرة، ثم أكثر دهنية بعد أسبوع تعويضاً. هنا يحدث العمل على الدهون عبر زنك \u2066PCA\u2069 عند الغدة، لا بتجريد السطح، ويعيد الكريم الماء بالزيليتول والتريهالوز. ومع ذلك سجّل انخفاضاً في الدهون بنسبة 14%.',
      },
      {
        q: 'ما هذا الوخز في التونر؟',
        a: '\u2066SNOW ICE\u2069، مركب التبريد الخاص بنا، مبني على \u2066menthyl lactate\u2069 وعاملي تبريد آخرين. ينشّط \u2066TRPM8\u2069، المستقبل الذي تستشعر به بشرتك البرودة، فيخفض حرارة البشرة فعلاً بدل أن يكون إحساساً بالبرودة فحسب. ولا كحول وراءه. وإذا لم يعجبك الإحساس فهو يزول في أقل من دقيقة.',
      },
      {
        q: 'لماذا ثلاثة أقنعة وواحد فقط من كل شيء آخر؟',
        a: 'لأن البشرة المشكلة تمر بأسابيع صعبة، والأربعة الأخرى خطوات يومية تكفي شهوراً. الأقنعة هي ما تلجأ إليه بعد ثوران، أو يوم طويل، أو ليلة ظهر أثرها على وجهك. ومستخلص قشر الكستناء فيها يعمل على الدهون وحجم المسام أيضاً، فهي ليست مجرد خطوة راحة.',
      },
      {
        q: 'هل يمكنني استخدامه مع علاج موصوف لحب الشباب؟',
        a: 'راجع من وصفه لك أولاً. الريتينويدات وبيروكسيد البنزويل تُرقق البشرة وتزيد حساسيتها أصلاً، والتونر يحتوي على \u2066BHA\u2069 فوق ذلك. وما يستقر عليه الناس عادةً هو الإبقاء على المنظف والكريم والأقنعة، وتوزيع التونر والسيروم حول العلاج بدل تطبيق كل شيء طبقة فوق طبقة.',
      },
      {
        q: 'متى سأرى شيئاً؟',
        a: 'أُخذت القياسات الثلاثة كلها عند أربعة أسابيع، فهذه هي الإجابة الصادقة عن الدهون والآثار. واللمعان هو أول ما تلاحظ تغيّره، عادةً قبل انتهاء الشهر. التقط صورة الآن، فالآثار تتلاشى ببطء يكفي لألا تريك المرآة الفرق.',
      },
      {
        q: 'هل يمكنني شراء المنتجات منفصلة؟',
        a: 'نعم، وكل منها مرتبط أعلاه. الصندوق ليس تركيبة مختلفة ولا حجماً حصرياً، بل هي الوحدات الخمس نفسها بإجمالي أقل. وإذا كنت تملك بعضها، فشراء الناقص سيكلفك أقل من الصندوق.',
      },
    ],
  },
}

const RU: BeautyBoxCopy = {
  eyebrow: 'Beauty Box',
  backToProducts: 'Продукты',
  headline: 'Меньше жира за четыре недели. Меньше высыпаний после.',
  subheadline:
    'Жир запускает весь цикл. Он забивает пору, пора воспаляется, а след, который остаётся, живёт на месяцы дольше самого прыща. Поэтому каждый шаг в этом наборе измеряли по одному и тому же показателю, и каждый шаг его сдвинул. Тоник снизил себум примерно вдвое за четыре недели. Сыворотка - на 17%, а уже имеющиеся следы на 8%. Крем - на 14% и 9%. Рядом с ними кислородный очиститель, который не нужно тереть, и три маски с морскими водорослями на те вечера, когда коже нужен покой.',
  heroBullets: [
    'Блеск, высыпания и следы, которые они оставляют - обычно именно последнее никто не лечит',
    'Себум меньше примерно вдвое с тоником за четыре недели, и ещё меньше с сывороткой и кремом',
    'Тоник сертифицирован как некомедогенный, так что уход не забьёт поры, которые он же и чистит',
    'Четыре полных размера и три тканевые маски дешевле, чем те же пять позиций по отдельности',
  ],
  kitSize: '5 продуктов',
  fullSizeNote: 'Полные размеры',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  addToBag: 'Добавить набор',
  adding: 'Добавляем...',
  added: 'Добавлено',
  outOfStock: 'Нет в наличии',
  loginToShop: 'Войдите, чтобы купить',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  badges: ['Оригинальный GENOSYS', 'Сделано в Корее', '4 полных размера + 3 маски', 'Дубай за 1-2 часа'],
  stats: [
    { value: '50%', label: 'меньше себума после четырёх недель с тоником' },
    { value: '17%', label: 'меньше себума с сывороткой и на 8% меньше следов за четыре недели' },
    { value: '3', label: 'маски с морскими водорослями на вечера, когда коже нужен покой' },
    { value: 'Корея', label: 'сделано для DTS MG в Сеуле, лаборатории, вокруг которой построен GENOSYS' },
  ],
  contents: {
    eyebrow: 'Что внутри',
    title: 'Пять продуктов, и каждый работает с жиром',
    intro:
      'У каждого продукта здесь своя страница и своя цена, так что перед покупкой можно прочитать про любой из них подробно. Вместе они складываются в один уход от начала до конца: умыть без трения, снизить жирность, поработать с тем, что уже есть, и оставить кожу достаточно комфортной, чтобы вы действительно продолжили.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Шаг 1 - Очищение',
        body:
          'Наносится на сухое лицо и вспенивается само, так что жирная кожа получает глубокое очищение без трения по и без того болезненным высыпаниям. Phytolex SC - комплекс из маша, коры берёзы и корня щавеля - успокаивает раздражение по ходу дела.',
        facts: ['Пенится сам, без трения', 'Пузырьковый агент 3%', 'Phytolex SC', '180 мл'],
      },
      {
        titleKey: 'routineProblemControlTonerTitle',
        productNumber: '15',
        quantity: 1,
        step: 'Шаг 2 - Тонизирование',
        body:
          'Самая крупная цифра набора приходит отсюда: себум меньше примерно вдвое через четыре недели. Запатентованный комплекс Anti Sebum P из четырёх растений сужает поры и притормаживает выработку жира, салициловая кислота вычищает то, что в них уже есть, а SNOW ICE снижает температуру кожи, и лицо перестаёт гореть.',
        facts: ['Себум -50% за 4 недели', 'Сертифицирован как некомедогенный', 'Anti Sebum P, патент', '200 мл'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'Любой вечер, когда коже нужен покой',
        body:
          'Их три, потому что у проблемной кожи в процессе лечения бывают плохие недели. Эвкалиптовое полотно Eucalace®, дышащее и без химических остатков, с аллантоином и пантенолом по 0,1% каждый. Экстракт скорлупы каштана продолжает работать с себумом и размером пор, пока вы лежите, а лист гамамелиса стягивает вид самих пор.',
        facts: ['Аллантоин и пантенол по 0,1%', 'Полотно Eucalace®', 'Без искусственных красителей', '25 г каждая'],
      },
      {
        titleKey: 'routineProblemControlSerumTitle',
        productNumber: '20',
        quantity: 1,
        step: 'Шаг 3 - Уход, утром и вечером',
        body:
          'Цинк PCA в дозе 0,05%, причём в чистом виде, а не разбавленным премиксом. Именно на нём Корея регистрирует эту сыворотку: контроль высыпаний, жирности и себума. Более 90% флакона — вода, поэтому она уходит под крем, ничего не добавляя на поверхность.',
        facts: ['Цинк PCA 0,05% в чистом виде', 'Более 90% воды', 'Дерматологически протестировано', '30 мл'],
      },
      {
        titleKey: 'routineProblemControlCreamTitle',
        productNumber: '30',
        quantity: 1,
        step: 'Шаг 4 - Закрепить',
        body:
          'Шаг, который отвечает на обычную претензию к уходу от акне: что после него кожа стянута и шелушится. Масла в этом креме нет вообще, поэтому он закрывает уход, ничего не добавляя обратно: трегалоза 1,5% и ксилитол 0,5% удерживают воду, пока те же 0,05% цинка PCA продолжают работу.',
        facts: ['Ни масел, ни баттеров, ни восков, ни эмульгаторов', 'Цинк PCA 0,05%, как в сыворотке', 'Трегалоза 1,5%, ксилитол 0,5%', '50 г'],
      },
    ],
    eanLabel: 'Штрихкод',
    each: 'за штуку',
    viewItem: 'Читать страницу целиком',
    boughtSeparately: 'По отдельности',
    inThisBox: 'В этом наборе',
    youSave: 'Вы экономите',
    againstSeparate: 'по сравнению с покупкой пяти позиций отдельно',
    seeBreakdown: 'Показать расчёт',
    savingNote: 'Цены обновляются в реальном времени, так что это сравнение всегда показывает то, что вы заплатите сегодня.',
  },
  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Неделя с проблемной кожей',
    intro:
      'Четыре шага утром и вечером, плюс маска в любой вечер, когда захочется. У каждого продукта своя полная инструкция на своей странице; здесь - как они складываются вместе.',
    steps: [
      {
        title: 'Утро: очищение на сухую кожу',
        body:
          'Нанесите очиститель на сухое лицо, избегая глаз. Дождитесь кислородных пузырьков, мягко помассируйте круговыми движениями, смойте тёплой водой. Без трения - в этом и смысл, когда на коже активные высыпания.',
      },
      {
        title: 'Тоник, и не спешите с ним',
        body:
          'Смочите ватный диск и протрите по ходу кожи: так снимается то, что осталось после умывания. При нанесении он холодит, и это комплекс SNOW ICE, а не спирт.',
      },
      {
        title: 'Или используйте тоник как десятиминутный компресс',
        body:
          'В тяжёлую неделю смочите диски и положите их на самые жирные зоны на пять-десять минут. Самый дешёвый способ получить больше от флакона, который у вас уже есть.',
      },
      {
        title: 'Сыворотка, утром и вечером',
        body:
          'Две-три капли на всё лицо, пока тоник ещё влажный, затем вбейте, а не втирайте. Это шаг, который работает с себумом, поэтому именно его не стоит пропускать.',
      },
      {
        title: 'Крем в конце',
        body:
          'Немного крема поверх сыворотки, утром и вечером. Жирная кожа часто пропускает увлажнение, а потом производит ещё больше жира в ответ. Этот крем сделан так, чтобы не быть тяжёлым.',
      },
      {
        title: 'Маска, когда кожа злится',
        body:
          'На чистое лицо после тоника, на пятнадцать-двадцать минут. Снимите и вбейте остатки. Не смывайте. Дальше сыворотка и крем как обычно.',
      },
    ],
    note:
      'В тонике есть BHA, а в сыворотке кора ивы, так что оба немного повышают чувствительность к солнцу. Пользуйтесь защитой от солнца утром - это важно ещё и потому, что солнечный свет делает следы от высыпаний темнее.',
  },
  evidence: {
    eyebrow: 'Что внутри',
    title: 'Цифры, на которых всё держится',
    intro:
      'Три продукта из пяти здесь измеряли по одному и тому же показателю, за одни и те же четыре недели, и все три его сдвинули. Вот с чем они вернулись.',
    cards: [
      {
        value: '50%',
        title: 'Меньше себума за четыре недели, тоник',
        body:
          'Самый крупный отдельный результат в наборе, и он приходит из шага, который большинство считает необязательным. Четыре недели применения снизили количество себума на коже примерно вдвое. Это же и тот шаг, который приносит набору сертификат некомедогенности.',
      },
      {
        value: '17%',
        title: 'Меньше себума с сывороткой и на 8% меньше следов',
        body:
          'Измерено за четыре недели. Вторую цифру стоит перечитать: цветные следы, то есть отметины, которые остаются надолго после того, как сам прыщ прошёл, уменьшились на 8%. Большинство уходов от акне их вообще не трогает.',
      },
      {
        value: '14%',
        title: 'Меньше себума с кремом и на 9% меньше следов',
        body:
          'То же четырёхнедельное измерение, те же два показателя - от шага, который вроде бы должен только увлажнять. Именно поэтому в уходе стоит этот крем, а не любой другой, который у вас уже есть.',
      },
      {
        value: 'Сертификат',
        title: 'Некомедогенно, тестировано QACS Ltd.',
        body:
          'Тоник прошёл испытание и сертифицирован как продукт с низкой вероятностью закупорки пор. В уходе, нацеленном на забитые поры, это не формальность: это разница между средством, которое чистит кожу, и средством, которое тихо подкармливает проблему.',
      },
    ],
    footnote:
      'Два названия на тонике - наши собственные. Anti Sebum P - запатентованный комплекс из корня вяза Давида, корня кудзу, цветка энотеры и хвои болотной сосны, он сужает поры и притормаживает себум прямо у железы. SNOW ICE - охлаждающий комплекс, активирующий TRPM8, рецептор холода, поэтому тоник действительно снижает температуру кожи, а не просто ощущается влажным.',
  },
  suited: {
    eyebrow: 'Кому подходит',
    title: 'Для кого этот набор',
    forTitle: 'Хороший выбор, если',
    forList: [
      'Кожа жирная и блестит уже к середине дня, а матирующие салфетки стали частью рутины',
      'Высыпания появляются регулярно, и следы от них мешают не меньше самих прыщей',
      'Поры выглядят расширенными вокруг носа и на щеках',
      'Вы пробовали всё подсушить и получили кожу одновременно жирную и шелушащуюся',
      'Вам нужно, чтобы снижение себума было измерено, а не подразумевалось',
    ],
    notForTitle: 'Посмотрите другое, если',
    notForList: [
      'Настоящая цель - тёмные пятна и неровный тон. Набор для сияния построен вокруг двух средств с корейской лицензией на осветление',
      'Настоящая цель - морщины и упругость. Антивозрастной набор построен вокруг зарегистрированных сыворотки и крема против морщин',
      'Настоящая цель - сухость. Для этого есть набор глубокого увлажнения',
      'Вас беспокоит ментол. Тоник охлаждает намеренно, а в маске есть масло мяты, так что покалывание будет от обоих',
      'Вы беременны или кормите: обсудите салициловую кислоту в тонике с врачом до начала',
    ],
    alternativesLabel: 'Наборы, упомянутые выше',
    alternatives: [
      { productNumber: '56', label: 'Набор для сияния кожи' },
      { productNumber: '58', label: 'Антивозрастной набор' },
      { productNumber: '59', label: 'Набор глубокого увлажнения' },
    ],
    note:
      'Очиститель, тоник, сыворотка, крем и маска дерматологически протестированы, а тоник вдобавок сертифицирован как некомедогенный. Если кожа не только жирная, но и реактивная, начните с тоника через день.',
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Детали',
    rows: [
      { label: 'Состав набора', value: '5 продуктов: очиститель 180 мл, тоник 200 мл, сыворотка 30 мл, крем 50 г и три маски с морскими водорослями по 25 г' },
      { label: 'Тип кожи', value: 'Жирная, комбинированная и склонная к высыпаниям. Крем - тот шаг, который не даёт коже стянуться' },
      { label: 'Уход', value: 'Очищение, тоник, сыворотка, крем - утром и вечером. Маска в любой вечер, когда коже нужен покой' },
      { label: 'Клинические данные', value: 'Себум меньше примерно на 50% с тоником, на 17% с сывороткой и на 14% с кремом, за четыре недели каждый. Следы меньше на 8% с сывороткой и на 9% с кремом' },
      { label: 'Сертификация', value: 'Тоник сертифицирован как некомедогенный, тестировано QACS Ltd.' },
      { label: 'Ощущения', value: 'Тоник холодит при нанесении за счёт комплекса SNOW ICE, в маске есть масло мяты перечной' },
      { label: 'Отдушка', value: 'Очиститель слегка ароматизирован, аллергены перечислены полностью. В маске нет добавленной отдушки и искусственных красителей' },
      { label: 'Происхождение', value: 'Сделано в Корее для DTS MG Co., Ltd., Сеул' },
      { label: 'Тестирование', value: 'Все пять продуктов дерматологически протестированы' },
      { label: 'Скидки', value: 'Цена набора уже является скидкой, поэтому другие предложения на него не суммируются' },
    ],
  },
  faq: {
    eyebrow: 'Перед покупкой',
    title: 'Вопросы, которые стоит задать',
    items: [
      {
        q: 'Не пересушит ли это кожу, как другие средства от акне?',
        a: 'Именно это крем и должен предотвратить. Большинство уходов от акне работают через снятие жира и оставляют кожу стянутой и шелушащейся, а через неделю - более жирной, чем была, в порядке компенсации. Здесь работа с себумом идёт через Zinc PCA у железы, а не через обезжиривание поверхности, и крем возвращает воду ксилитом и трегалозой. При этом он всё равно показал на 14% меньше себума.',
      },
      {
        q: 'Что за покалывание в тонике?',
        a: 'SNOW ICE, наш охлаждающий комплекс, на основе ментиллактата и ещё двух охлаждающих агентов. Он активирует TRPM8, рецептор, которым кожа чувствует холод, так что температура кожи действительно снижается, а не просто кажется прохладной. Спирта за этим нет. Если ощущение не нравится, оно проходит меньше чем за минуту.',
      },
      {
        q: 'Почему три маски и по одной штуке всего остального?',
        a: 'Потому что у проблемной кожи бывают плохие недели, а остальные четыре - ежедневные шаги, которых хватает на месяцы. Маски - это то, за чем тянешься после обострения, длинного дня или ночи, которая отразилась на лице. Экстракт скорлупы каштана в них работает и с себумом, и с размером пор, так что это не просто утешительный шаг.',
      },
      {
        q: 'Можно ли совмещать с назначенным лечением акне?',
        a: 'Сначала поговорите с тем, кто его назначил. Ретиноиды и бензоилпероксид и без того истончают кожу и повышают её чувствительность, а в тонике поверх этого есть BHA. Обычно останавливаются на том, чтобы оставить очиститель, крем и маски, а тоник и сыворотку развести по времени с назначенным средством, а не наслаивать всё сразу.',
      },
      {
        q: 'Когда будет видно результат?',
        a: 'Все три измерения делали на четвёртой неделе, так что это честный ответ про себум и следы. Жирность меняется первой, обычно ещё до конца месяца. Сфотографируйтесь сейчас: следы уходят достаточно медленно, чтобы зеркало разницы не показало.',
      },
      {
        q: 'Можно ли купить продукты по отдельности?',
        a: 'Да, ссылка на каждый есть выше. Набор - это не другая формула и не эксклюзивный объём, это те же пять позиций за меньшую сумму. Если что-то у вас уже есть, докупить недостающее выйдет дешевле набора.',
      },
    ],
  },
}

export const PROBLEM_SKIN_COPY: BeautyBoxLocaleCopy = { en: EN, ar: AR, ru: RU }
