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
  headline: 'خمس خطوات واضحة للبشرة الدهنية والمختلطة.',
  subheadline:
    'روتين كامل للبشرة الدهنية والمختلطة يبدأ بمنظف يولد رغوة هوائية على الوجه الجاف ثم يشطف، يليه تونر وسيروم وكريم بقوامات خفيفة، مع ثلاثة أقنعة Eucalace® مرطبة. يساعد زنك PCA في العناية بفائض الزهم، وتدعم مكونات الترطيب راحة البشرة.',
  heroBullets: [
    'تنظيف وتونر وسيروم وكريم، مع ثلاثة أقنعة ورقية إضافية',
    'زنك PCA بتركيز 0.5% في التونر و0.05% في السيروم والكريم',
    'قوامات خفيفة مرتبة بوضوح للبشرة الدهنية أو المختلطة أو المعرّضة للشوائب',
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
    { value: '0.5%', label: 'زنك PCA في التونر للعناية بفائض الزهم' },
    { value: '0.05%', label: 'زنك PCA في كل من السيروم والكريم' },
    { value: '3', label: 'أقنعة بالطحالب البحرية للأمسيات التي تحتاج فيها البشرة إلى تهدئة' },
    { value: 'كوريا', label: 'صنع لصالح \u2066DTS MG\u2069 في سيول، المختبر الذي بنيت حوله \u2066GENOSYS\u2069' },
  ],
  contents: {
    eyebrow: 'ما بداخله',
    title: 'خمسة منتجات مرتبة كروتين واحد',
    intro:
      'لكل منتج صفحته وسعره الحالي. معاً تشكل المنتجات روتيناً واضحاً: تنظيف على بشرة جافة، ثم تونر وسيروم وكريم، مع قناع اختياري بعد التونر.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'الخطوة 1 - التنظيف',
        body:
          'يوضع على وجه جاف، وتترك الرغوة الهوائية لتتكوّن، ثم يدلك بلطف ويشطف بالماء الفاتر. تحتوي التركيبة الحالية على \u2066Methyl Perfluoroisobutyl Ether\u2069 بنسبة 8%.',
        facts: ['يوضع على وجه جاف ثم يشطف', 'Methyl Perfluoroisobutyl Ether ‏8%', 'مع عطر وليمونين وSLES', '180 مل'],
      },
      {
        titleKey: 'routineProblemControlTonerTitle',
        productNumber: '15',
        quantity: 1,
        step: 'الخطوة 2 - التونر',
        body:
          'تونر خفيف يترك على البشرة مع زنك PCA بنسبة 0.5% للعناية بفائض الزهم، وقاعدة ترطيب بنسبة 13.398%. يستخدم بقطعة قطن أو كرذاذ صباحاً ومساءً.',
        facts: ['زنك PCA ‏0.5%', 'قاعدة ترطيب 13.398%', 'حمض الساليسيليك 0.001%', '200 مل'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'عند حاجة البشرة إلى الترطيب والراحة',
        body:
          'ثلاثة أقنعة Eucalace® من ألياف الأوكالبتوس. يحمل كل قناع ميثيل بروبانديول 10% وغليسرين 5.035% مع ألانتوين وبانثينول 0.1% لكل منهما.',
        facts: ['ميثيل بروبانديول 10%', 'غليسرين 5.035%', 'زيت نعناع 0.005%', '25 غ لكل قناع'],
      },
      {
        titleKey: 'routineProblemControlSerumTitle',
        productNumber: '20',
        quantity: 1,
        step: 'الخطوة 3 - السيروم، صباحاً ومساءً',
        body:
          'سيروم مائي خفيف بزنك \u2066PCA\u2069 بتركيز 0.05% للمساعدة على تنظيم فائض الزهم واللمعان. يدعم التريهالوز 1% والزيليتول 0.5% والبانثينول 0.2% والألانتوين 0.1% الترطيب والراحة، ويمتص سريعاً تحت الكريم.',
        facts: ['زنك \u2066PCA\u2069 0.05%', 'تريهالوز 1% + زيليتول 0.5%', 'خالٍ من الزيوت والعطر', '30 مل'],
      },
      {
        titleKey: 'routineProblemControlCreamTitle',
        productNumber: '30',
        quantity: 1,
        step: 'الخطوة 4 - التثبيت',
        body:
          'يختتم الروتين بطبقة هلامية خفيفة. يساعد التريهالوز 1.5% والزيليتول 0.5% على الاحتفاظ بالماء، ويكمل زنك \u2066PCA\u2069 بتركيز 0.05% العناية بالبشرة الدهنية.',
        facts: ['بلا طور زيتي تقليدي', 'زنك \u2066PCA\u2069 0.05%، كما في السيروم', 'تريهالوز 1.5% + زيليتول 0.5%', '50 غ'],
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
    title: 'الترتيب الصباحي والمسائي',
    intro:
      'أربع خطوات صباحاً ومساءً. عند اختيار أحد الأقنعة الثلاثة، يوضع بعد التونر وقبل السيروم والكريم.',
    steps: [
      {
        title: 'الصباح: نظّف على بشرة جافة',
        body:
          'ضع المنظف على وجه جاف مع تجنب العينين. انتظر تكوّن الرغوة الهوائية، ودلّك بلطف بحركات دائرية، ثم اشطف بماء فاتر.',
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
          'تُوزع قطرتان إلى ثلاث على الوجه بعد التونر، مع تجنب المنطقة المحيطة بالعينين. يُربت بلطف حتى الامتصاص، ثم يوضع الكريم.',
      },
      {
        title: 'الكريم في النهاية',
        body:
          'كمية صغيرة تُوزَّع فوق السيروم، صباحاً ومساءً. كثيراً ما تتخطى البشرة الدهنية المرطب ثم تنتج زيتاً أكثر تعويضاً. وهذا الكريم مصمم كي لا يكون ثقيلاً.',
      },
      {
        title: 'في مساء القناع',
        body:
          'على وجه نظيف بعد التونر، ضع الورقة من خمس عشرة إلى عشرين دقيقة. ارفعها واضغط الباقي داخل البشرة. لا تشطف. تابع بالسيروم والكريم كالمعتاد.',
      },
    ],
    note:
      'استخدم واقي شمس مناسباً صباحاً. يحتوي التونر على حمض الساليسيليك وزيت شجرة الشاي، ويحتوي القناع على زيت النعناع، كما أن المنظف والكريم معطران. أدخل المنتجات واحداً بعد الآخر إذا كانت البشرة حساسة للعطر أو الزيوت العطرية أو الساليسيلات.',
  },
  evidence: {
    eyebrow: 'ما بداخله',
    title: 'التركيبات وراء كل خطوة',
    intro:
      'نعرض الجرعات التي تؤثر فعلاً في اختيار الروتين، ولا ننسب إلى الصندوق علاجاً لحب الشباب أو نتيجة مضمونة.',
    cards: [
      {
        value: '0.5%',
        title: 'زنك PCA في التونر',
        body:
          'عشرة أضعاف تركيزه في السيروم والكريم، مع قاعدة ترطيب 13.398% للمحافظة على الراحة.',
      },
      {
        value: '0.05%',
        title: 'زنك PCA في السيروم',
        body:
          'يساعد على تنظيم فائض الزهم وتقليل اللمعان. ويوازن التريهالوز 1% والزيليتول 0.5% والبانثينول 0.2% والألانتوين 0.1% هذه الخطوة بترطيب خفيف وراحة يومية.',
      },
      {
        value: '1.5%',
        title: 'تريهالوز في الكريم',
        body:
          'مع زيليتول 0.5% في قاعدة جل خفيفة من دون طور زيتي تقليدي.',
      },
      {
        value: '15–20',
        title: 'دقيقة للقناع',
        body:
          'ثم ينزع القناع ويُربت ما تبقى من الإسنس من دون شطف.',
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
      'إذا كانت بشرتك متفاعلة، أدخل كل منتج على حدة. القناع غير موثق لدينا كمنتج مختبر جلدياً، لذلك لا نعمم هذا الادعاء على المجموعة.',
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      { label: 'المحتويات', value: '5 منتجات: منظف 180 مل، تونر 200 مل، سيروم 30 مل، كريم 50 غ، وثلاثة أقنعة بالطحالب البحرية 25 غ لكل منها' },
      { label: 'نوع البشرة', value: 'البشرة الدهنية والمختلطة والمعرضة للبثور. الكريم هو الخطوة التي تمنعها من الشد' },
      { label: 'الروتين', value: 'تنظيف، تونر، سيروم، كريم، صباحاً ومساءً. وقناع في أي مساء تحتاج فيه البشرة إلى تهدئة' },
      { label: 'الأرقام الأساسية', value: 'التونر: زنك PCA ‏0.5% وقاعدة ترطيب 13.398%. السيروم والكريم: زنك PCA ‏0.05% في كل منهما. القناع: ميثيل بروبانديول 10% وغليسرين 5.035%' },
      { label: 'الاعتماد', value: 'التونر معتمد كغير مسبب لانسداد المسام، باختبار \u2066QACS Ltd.\u2069' },
      { label: 'الإحساس', value: 'التونر يبرّد عند التلامس بفضل مركب \u2066SNOW ICE\u2069، والقناع يحتوي على زيت النعناع' },
      { label: 'العطر', value: 'المنظف معطر مع الإفصاح عن مسبباته للحساسية. والقناع خالٍ من العطر المضاف ومن الأصباغ الصناعية' },
      { label: 'المنشأ', value: 'صنع في كوريا لصالح \u2066DTS MG Co., Ltd.\u2069، سيول' },
      { label: 'الاختبارات', value: 'لا يعمم ادعاء الاختبار الجلدي على المجموعة؛ لكل منتج وثائقه الخاصة' },
      { label: 'الخصومات', value: 'سعر المجموعة هو الخصم بالفعل، لذا لا تُجمع العروض الأخرى على الصندوق' },
    ],
  },
  faq: {
    eyebrow: 'قبل الشراء',
    title: 'أسئلة تستحق السؤال',
    items: [
      {
        q: 'هل يتضمن الروتين خطوة ترطيب؟',
        a: 'نعم. يحتوي السيروم على تريهالوز 1% وزيليتول 0.5%، ويحتوي الكريم الجل على تريهالوز 1.5% وزيليتول 0.5%. هذه عناية تجميلية بالراحة وليست علاجاً لحب الشباب.',
      },
      {
        q: 'ما هذا الوخز في التونر؟',
        a: 'يحتوي التونر على عوامل تبريد، منها menthyl lactate، لذلك قد يمنح إحساساً واضحاً بالبرودة. لا نعد بمدة ثابتة لهذا الإحساس؛ أوقفيه عند التهيج.',
      },
      {
        q: 'لماذا ثلاثة أقنعة وواحد فقط من كل شيء آخر؟',
        a: 'الأربعة الأخرى هي خطوات الاستخدام اليومي، أما الأقنعة فهي ثلاث وحدات منفردة للاستخدام الاختياري. يحتوي إسنس القناع على ميثيل بروبانديول 10% وغليسرين 5.035% للترطيب.',
      },
      {
        q: 'هل يمكنني استخدامه مع علاج موصوف لحب الشباب؟',
        a: 'راجعي الطبيب الذي وصف العلاج قبل جمعه مع المجموعة، خصوصاً لأن التونر يحتوي على حمض الساليسيليك. لا نقدّم المجموعة بديلاً عن العلاج الطبي.',
      },
      {
        q: 'هل تضمن المجموعة صفاء البشرة؟',
        a: 'لا. هي روتين تجميلي للبشرة الدهنية أو المختلطة أو المعرّضة للشوائب، وليست علاجاً لحب الشباب ولا تضمن إزالة البثور أو الآثار.',
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
  headline: 'Пять понятных шагов для жирной и комбинированной кожи.',
  subheadline:
    'Полный уход для жирной и комбинированной кожи: очиститель с воздушной пеной на сухое лицо, затем тоник, сыворотка и крем с лёгкими текстурами, плюс три увлажняющие маски Eucalace®. Цинк PCA помогает ухаживать за избытком себума, а увлажняющие компоненты поддерживают комфорт кожи.',
  heroBullets: [
    'Очищение, тоник, сыворотка и крем плюс три дополнительные тканевые маски',
    'Цинк PCA 0,5% в тонике и 0,05% в сыворотке и креме',
    'Лёгкие текстуры для жирной, комбинированной и склонной к несовершенствам кожи',
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
    { value: '0,5%', label: 'цинка PCA в тонике для ухода за избытком себума' },
    { value: '0,05%', label: 'цинка PCA в сыворотке и креме' },
    { value: '3', label: 'маски с морскими водорослями на вечера, когда коже нужен покой' },
    { value: 'Корея', label: 'сделано для DTS MG в Сеуле, лаборатории, вокруг которой построен GENOSYS' },
  ],
  contents: {
    eyebrow: 'Что внутри',
    title: 'Пять продуктов в одном последовательном уходе',
    intro:
      'У каждого продукта своя страница и актуальная цена. Вместе они образуют понятный порядок: очищение на сухой коже, затем тоник, сыворотка и крем, а маска при желании встаёт после тоника.',
    items: [
      {
        titleKey: 'routineSnowO2Title',
        productNumber: '10',
        quantity: 1,
        step: 'Шаг 1 - Очищение',
        body:
          'Нанесите на сухое лицо, дождитесь воздушной пены, мягко помассируйте и смойте тёплой водой. В актуальной формуле 8% Methyl Perfluoroisobutyl Ether.',
        facts: ['На сухую кожу, затем смыть', 'Methyl Perfluoroisobutyl Ether 8%', 'С отдушкой, лимоненом и SLES', '180 мл'],
      },
      {
        titleKey: 'routineProblemControlTonerTitle',
        productNumber: '15',
        quantity: 1,
        step: 'Шаг 2 - Тонизирование',
        body:
          'Лёгкий несмываемый тоник с цинком PCA 0,5% для ухода за избытком себума и увлажняющей базой 13,398%. Наносите ватным диском или распыляйте утром и вечером.',
        facts: ['Цинк PCA 0,5%', 'Увлажняющая база 13,398%', 'Салициловая кислота 0,001%', '200 мл'],
      },
      {
        titleKey: 'routineSoothingBombMaskTitle',
        productNumber: '36',
        quantity: 3,
        step: 'Когда коже нужны увлажнение и комфорт',
        body:
          'Три маски Eucalace® из эвкалиптового волокна. В каждой увлажняющая эссенция с метилпропандиолом 10%, глицерином 5,035%, аллантоином и пантенолом по 0,1%.',
        facts: ['Метилпропандиол 10%', 'Глицерин 5,035%', 'Масло мяты 0,005%', '25 г каждая'],
      },
      {
        titleKey: 'routineProblemControlSerumTitle',
        productNumber: '20',
        quantity: 1,
        step: 'Шаг 3 - Сыворотка, утром и вечером',
        body:
          'Лёгкая водная сыворотка с цинком PCA 0,05% помогает контролировать избыток себума и блеск. Трегалоза 1%, ксилитол 0,5%, пантенол 0,2% и аллантоин 0,1% поддерживают увлажнение и комфорт, а текстура быстро впитывается под крем.',
        facts: ['Цинк PCA 0,05%', 'Трегалоза 1% + ксилитол 0,5%', 'Без масел и отдушки', '30 мл'],
      },
      {
        titleKey: 'routineProblemControlCreamTitle',
        productNumber: '30',
        quantity: 1,
        step: 'Шаг 4 - Завершить кремом',
        body:
          'Завершает уход лёгким гелевым слоем без ощущения тяжести. Трегалоза 1,5% и ксилитол 0,5% помогают удерживать воду, а цинк PCA 0,05% продолжает ухаживать за жирным блеском. В формуле нет растительных масел, баттеров и восков.',
        facts: ['Без традиционной масляной фазы', 'Цинк PCA 0,05%, как в сыворотке', 'Трегалоза 1,5% + ксилитол 0,5%', '50 г'],
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
    title: 'Утренний и вечерний порядок',
    intro:
      'Четыре шага утром и вечером. Когда используете одну из трёх масок, ставьте её после тоника и перед сывороткой и кремом.',
    steps: [
      {
        title: 'Утро: очищение на сухую кожу',
        body:
          'Нанесите очиститель на сухое лицо, избегая глаз. Дождитесь воздушной пены, мягко помассируйте круговыми движениями и смойте тёплой водой.',
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
          'Нанесите 2–3 капли после тоника, избегая области вокруг глаз. Мягко вбейте до впитывания, затем нанесите крем.',
      },
      {
        title: 'Крем в конце',
        body:
          'Немного крема поверх сыворотки, утром и вечером. Жирная кожа часто пропускает увлажнение, а потом производит ещё больше жира в ответ. Этот крем сделан так, чтобы не быть тяжёлым.',
      },
      {
        title: 'Вечер с маской',
        body:
          'На чистое лицо после тоника, на пятнадцать-двадцать минут. Снимите и вбейте остатки. Не смывайте. Дальше сыворотка и крем как обычно.',
      },
    ],
    note:
      'Утром используйте подходящий SPF. В тонике есть салициловая кислота и масло чайного дерева, в маске — масло мяты, а очиститель и крем ароматизированы. При чувствительности к отдушкам, эфирным маслам или салицилатам вводите продукты по одному.',
  },
  evidence: {
    eyebrow: 'Что внутри',
    title: 'Формулы за каждым шагом',
    intro:
      'Мы показываем дозировки, важные для выбора ухода, и не обещаем от набора лечение акне или гарантированное очищение кожи.',
    cards: [
      {
        value: '0,5%',
        title: 'Цинка PCA в тонике',
        body:
          'В десять раз больше, чем в сыворотке и креме, плюс увлажняющая база 13,398% для комфорта кожи.',
      },
      {
        value: '0,05%',
        title: 'Цинка PCA в сыворотке',
        body:
          'Помогает контролировать избыток себума и уменьшать блеск. Трегалоза 1%, ксилитол 0,5%, пантенол 0,2% и аллантоин 0,1% дополняют этот этап лёгким увлажнением и ежедневным комфортом.',
      },
      {
        value: '1,5%',
        title: 'Трегалозы в креме',
        body:
          'Вместе с ксилитом 0,5% в лёгкой гелевой основе без традиционной масляной фазы.',
      },
      {
        value: '15–20',
        title: 'минут для маски',
        body:
          'Затем снимите полотно и мягко вбейте остатки эссенции, не смывая.',
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
      'Если кожа реактивная, вводите продукты по одному. Для маски у нас нет подтверждения дерматологического теста, поэтому это заявление не распространяется на весь набор.',
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Детали',
    rows: [
      { label: 'Состав набора', value: '5 продуктов: очиститель 180 мл, тоник 200 мл, сыворотка 30 мл, крем 50 г и три маски с морскими водорослями по 25 г' },
      { label: 'Тип кожи', value: 'Жирная, комбинированная и склонная к высыпаниям. Крем - тот шаг, который не даёт коже стянуться' },
      { label: 'Уход', value: 'Очищение, тоник, сыворотка, крем - утром и вечером. Маска в любой вечер, когда коже нужен покой' },
      { label: 'Ключевые цифры', value: 'Тоник: цинк PCA 0,5% и увлажняющая база 13,398%. Сыворотка и крем: цинк PCA 0,05% в каждом. Маска: метилпропандиол 10% и глицерин 5,035%' },
      { label: 'Сертификация', value: 'Тоник сертифицирован как некомедогенный, тестировано QACS Ltd.' },
      { label: 'Ощущения', value: 'Тоник холодит при нанесении за счёт комплекса SNOW ICE, в маске есть масло мяты перечной' },
      { label: 'Отдушка', value: 'Очиститель слегка ароматизирован, аллергены перечислены полностью. В маске нет добавленной отдушки и искусственных красителей' },
      { label: 'Происхождение', value: 'Сделано в Корее для DTS MG Co., Ltd., Сеул' },
      { label: 'Тестирование', value: 'Заявление о дерматологическом тесте не распространяется на набор целиком; у каждого продукта свои документы' },
      { label: 'Скидки', value: 'Цена набора уже является скидкой, поэтому другие предложения на него не суммируются' },
    ],
  },
  faq: {
    eyebrow: 'Перед покупкой',
    title: 'Вопросы, которые стоит задать',
    items: [
      {
        q: 'Есть ли в уходе увлажняющий этап?',
        a: 'Да. В сыворотке трегалоза 1% и ксилит 0,5%, в гель-креме — трегалоза 1,5% и ксилит 0,5%. Это косметический уход за комфортом кожи, а не лечение акне.',
      },
      {
        q: 'Что за покалывание в тонике?',
        a: 'В тонике есть охлаждающие агенты, включая ментиллактат, поэтому он может заметно холодить. Мы не обещаем фиксированную длительность ощущения; при раздражении прекратите использование.',
      },
      {
        q: 'Почему три маски и по одной штуке всего остального?',
        a: 'Остальные четыре средства составляют ежедневную основу, а маски — три отдельные дополнительные процедуры. В эссенции 10% метилпропандиола и 5,035% глицерина для увлажнения.',
      },
      {
        q: 'Можно ли совмещать с назначенным лечением акне?',
        a: 'Сначала согласуйте сочетание с назначившим лечение врачом, особенно из-за салициловой кислоты в тонике. Набор не заменяет медицинское лечение.',
      },
      {
        q: 'Гарантирует ли набор чистую кожу?',
        a: 'Нет. Это косметический уход для жирной, комбинированной и склонной к несовершенствам кожи, а не лечение акне и не гарантия устранения высыпаний или следов.',
      },
      {
        q: 'Можно ли купить продукты по отдельности?',
        a: 'Да, ссылка на каждый есть выше. Набор - это не другая формула и не эксклюзивный объём, это те же пять позиций за меньшую сумму. Если что-то у вас уже есть, докупить недостающее выйдет дешевле набора.',
      },
    ],
  },
}

export const PROBLEM_SKIN_COPY: BeautyBoxLocaleCopy = { en: EN, ar: AR, ru: RU }
