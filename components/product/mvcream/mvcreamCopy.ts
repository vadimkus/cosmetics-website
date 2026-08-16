/**
 * Bespoke copy for the MULTI VITA RADIANCE CREAM page (product 31).
 *
 * The cream half of the pair whose serum is product 21.
 *
 * SOURCING RULE FOR THIS FILE
 *
 *   Registration DOC/Formula_up/Formula-GENOSYS MULTI VITA RADIANCE CREAM .pdf
 *       Signed DTS MG formula. Every percentage here comes from it.
 *   Registration DOC/SA/SA-GENOSYS MULTI VITA RADIANCE CREAM.pdf
 *       QACS, January 2021. Trade names to INCI: NIACINAMIDE USP at 2% neat,
 *       WHITENING SAVER-WN at 1% for the licorice, ASTA C LIPO at 0.1% for
 *       the astaxanthin.
 *   Multi_vita/COA-GENOSYS MULTI VITA RADIANCE CREAM.pdf
 *       The only certificate in the range that runs an assay on the active:
 *       niacinamide specified at 2.00% and found at 2.04%. Also pH 6.48
 *       against 6.00 to 7.00, appearance orange cream, viscosity 18,480,
 *       all micro at zero. Do not print the lot code.
 *   public/documents/PPT/GENOSYS MULTI VITA RADIANCE CREAM.pdf
 *       The DTS MG deck: the two-week melanin trial, the 21-woman panel, and
 *       the note that the orange colour is the astaxanthin itself.
 *
 * THE FORMULA, as finished concentrations:
 *
 *   Aqua                             57.566%
 *   Macadamia Ternifolia Seed Oil    13.000%
 *   Dimethicone                       6.900%
 *   Methylpropanediol                 6.000%
 *   Glycerin                          3.069%
 *   Hydrogenated Polydecene           2.500%
 *   Niacinamide                       2.000%   assayed at 2.04%
 *   1,2-Hexanediol                    2.000%
 *   Cetearyl Ethylhexanoate           2.000%
 *   HEA/Sodium Acryloyldimethyl
 *     Taurate Copolymer               1.020%
 *   Squalane                          1.000%
 *   Glyceryl Stearate                 0.600%
 *   Polysorbate 60                    0.566%
 *   Betaine / Erythritol              0.500% each
 *   Butylene Glycol                   0.395%
 *   Silica / Dimethicone crosspolymer 0.100% each
 *   Sorbitan Isostearate              0.066%
 *   Bergamot Fruit Oil                0.027%
 *   Disodium EDTA                     0.020%
 *   Limonene / Linalool               0.018% / 0.005%
 *   Ascorbic Acid / Licorice /
 *     Caprylic-Capric Triglyceride    0.010% each
 *   Gluconolactone                    0.005%
 *   Astaxanthin / Ceramide NP         0.001% each
 *   Panthenol                         0.00001%
 *   Retinyl Palmitate, Biotin,
 *     Thiamine, Folic Acid, B6        0.0000001% each
 *   Menadione, Cyanocobalamin         0.00000001% each
 *
 * THE DISTINCTIVE FACT, which is why this page exists.
 *
 * A full 2% of niacinamide, and this is the one product in the range whose
 * certificate actually tests for it rather than taking the formula's word.
 * The batch on file came back at 2.04%. Same active and the same 2% as the
 * serum (product 21), in a completely different vehicle: this one carries it
 * in 13% macadamia oil, where the serum is a water gel.
 *
 * SECOND FACT: the cream is orange, and that is the astaxanthin itself. No
 * pigment is added. It also explains the carton note that the colour can
 * shift with air exposure while the product still works.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Niacinamide 2%, found at 2.04%         COA assay
 *   Macadamia oil 13%, squalane 1%         Formula_up
 *   Astaxanthin is the colour, no pigment  DTS MG deck
 *   Surface melanin 3.443 to 2.419,
 *     minus 29.7% at two weeks             DTS MG deck clinical
 *   21 women; 95% even tone, 100% no
 *     dryness, 100% no irritation          DTS MG deck survey
 *   50g and 230g                           deck and price list
 *   pH 6.48, spec 6.00 to 7.00             COA (no lot)
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - ASTAXANTHIN 6,000 TIMES STRONGER THAN VITAMIN C, or any of the other
 *     multiples on that deck page. Those are raw-material antioxidant assay
 *     comparisons. In this cream astaxanthin is at 0.001%, ten parts per
 *     million, inside a 0.1% liposome premix. Gallery s4 prints the 6,000x
 *     line and is queued for re-export.
 *   - ASTAXANTHIN AS AN INTERNAL SUNSCREEN. The deck says it. Do not.
 *   - CERAMIDE AS A BARRIER ACTIVE. It is at 0.001% here, five hundred times
 *     less than the 0.5% in product 27.
 *   - GLUCONOLACTONE AS AN EXFOLIANT. 0.005%, far below an acid dose.
 *   - PANTHENOL. It is at 0.00001%, a tenth of a part per million. The
 *     panthenol story belongs to the serum, which runs it at 1%.
 *   - COLLAGEN SYNTHESIS, ANTI-INFLAMMATORY. Deck ingredient literature.
 *   - 100% SATISFACTION ACROSS THE BOARD. On this product one measure came
 *     back at 95%, not 100%. Print 95% where it is 95%.
 *   - LOT CODES, and never the contract manufacturer. DTS MG only.
 */

export type MvcreamLocale = 'en' | 'ar' | 'ru'

export interface MvcreamCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  packSize: string
  usageNote: string
  chooseSize: string
  sizes: { homecareLabel: string; homecareNote: string; proLabel: string; proNote: string }
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
  effects: { eyebrow: string; title: string; intro: string; cards: Array<{ title: string; body: string }> }
  engine: { eyebrow: string; title: string; body: string; points: Array<{ title: string; body: string }>; figureAlt: string }
  clean: { eyebrow: string; title: string; intro: string; items: string[]; note: string }
  howTo: { eyebrow: string; title: string; frequency: string; steps: Array<{ title: string; body: string }>; note: string; videoTitle: string }
  actives: { eyebrow: string; title: string; intro: string; inciTitle: string; inciNote: string }
  suited: { eyebrow: string; title: string; forTitle: string; forList: string[]; notTitle: string; notList: string[]; note: string }
  routine: { eyebrow: string; title: string; intro: string; thisProduct: string; viewProduct: string; chooseOptions: string; fromPrice: string }
  faq: { eyebrow: string; title: string; items: Array<{ q: string; a: string }> }
  details: { eyebrow: string; title: string; rows: Array<{ label: string; value: string }>; barcodeLabel: string }
  closing: { title: string; body: string }
  reviewsTitle: string
  backToProducts: string
}

const EN: MvcreamCopy = {
  eyebrow: 'Cream · Dull and uneven skin tone',
  headline: 'A full 2% of niacinamide, and it gets tested.',
  subheadline:
    'Every batch of this cream is checked for how much niacinamide is actually in it, which is not something most creams can say. The latest came back at 2.04% against a 2% formula. It is the same active and the same dose as the Multi Vita serum, carried here in 13% macadamia oil instead of water. The orange colour is astaxanthin, not pigment.',
  heroBullets: [
    'Niacinamide at 2%, and every batch is tested to prove it',
    'The latest came back at 2.04%',
    'Carried in 13% macadamia oil, with 1% squalane',
    'Surface melanin down 29.7% in two weeks in the maker\'s trial',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '50g and 230g', 'Morning and night'],
  packSize: '50g / 230g',
  usageNote: 'Morning and night, with sunscreen by day',
  chooseSize: 'Choose your size',
  sizes: {
    homecareLabel: 'Homecare',
    homecareNote: 'The 50g tube, for a daily routine at home',
    proLabel: 'Professional',
    proNote: 'The 230g tube, for clinic use',
  },
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
    { value: '2.04%', label: 'Niacinamide found in the batch on file' },
    { value: '13%', label: 'Macadamia oil, the second ingredient after water' },
    { value: '−29.7%', label: 'Surface melanin at two weeks, in the maker\'s trial' },
    { value: '50g', label: 'Home tube, with a 230g clinic size' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Even tone. Real glow.',
    intro:
      'The finishing half of the Multi Vita pair. The serum carries the tone work in water; this carries the same active in oil and stays on the skin.',
    cards: [
      {
        title: 'Tone',
        body: 'Niacinamide at 2%, the same dose as the serum, working on the handover of pigment to the cells at the surface.',
      },
      {
        title: 'Glow',
        body: 'Thirteen percent macadamia oil with squalane at 1%. The light comes from a skin that is properly fed, which is a different thing from shine.',
      },
      {
        title: 'Comfort',
        body: 'Betaine and erythritol at half a percent each, in a cream that is more than half water despite the oil load.',
      },
    ],
  },
  engine: {
    eyebrow: 'The complex',
    title: 'The number that gets checked.',
    body:
      'Korea treats niacinamide as a functional ingredient, and the certificate for this cream reflects that: it does not just record the formula, it runs an assay for the active and prints the result. Specified at 2.00%, found at 2.04%. Very few creams anywhere are sold with that number attached.',
    points: [
      {
        title: 'Niacinamide 2%, found at 2.04%',
        body: 'Neat USP-grade material, not a diluted premix. The same dose as the Multi Vita serum, so the pair is genuinely matched rather than strong and weak.',
      },
      {
        title: 'Macadamia oil 13%',
        body: 'The second ingredient after water and the reason this feels nothing like the serum. Its fatty acid profile is unusually close to skin\'s own sebum.',
      },
      {
        title: 'Squalane 1% · Betaine 0.5% · Erythritol 0.5%',
        body: 'Squalane is another lipid the skin already makes. The two humectants sit behind it and keep the oil from being the only thing holding water in.',
      },
      {
        title: 'Astaxanthin, and the colour',
        body: 'At 0.001% in a liposome premix, so it is a real presence at ten parts per million. It is also why the cream is orange: no pigment has been added, and the shade can shift a little with air.',
      },
      {
        title: 'Licorice 0.01% and vitamin C 0.01%',
        body: 'The supporting tone pair, arriving through a named premix. Honest tenths of a percent rather than headline actives.',
      },
    ],
    figureAlt: 'The Multi Vita radiance complex, led by niacinamide at 2%',
  },
  clean: {
    eyebrow: 'The proof',
    title: 'What the trial measured.',
    intro: 'One clinical and one panel, both run by the manufacturer, and both about tone.',
    items: [
      'Skin surface melanin fell from 3.443 to 2.419 after two weeks of use',
      'That is a 29.7% improvement on the measure they took',
      '21 women, aged 20 to 59, in the satisfaction panel',
      '95% said skin tone had become even',
      '100% reported no dryness or inner tightness',
      '100% felt no irritation on the skin',
    ],
    note:
      'That 95% is worth pointing at. On the serum the same question came back at 100%, and it would have been easy to round this one up to match. Two weeks is also what was measured, so two weeks is what is claimed.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Last step, and sunscreen over it.',
    frequency: 'Morning and night',
    steps: [
      { title: 'Cleanse and tone', body: 'Start on clean skin with a toner down first.' },
      {
        title: 'Serum first',
        body: 'Multi Vita Radiance Serum goes on before this and gets patted in. Same active, lighter vehicle, so it goes underneath.',
      },
      {
        title: 'Then the cream',
        body: 'Apply on the face and work it in. It is the last step at night.',
      },
      {
        title: 'Sunscreen in the morning',
        body: 'Not optional with anything aimed at tone. A brightening routine without daily SPF is working against itself.',
      },
      {
        title: 'Close the cap',
        body: 'The orange can shift a little on contact with air without the cream changing how it works. Shut it properly and keep it out of the light.',
      },
    ],
    note:
      'Keep it clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears.',
    videoTitle: 'See the texture',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The list, in full.',
    intro:
      'Forty-two entries. The top eleven account for almost the whole tube, and the tail is a long list of vitamins at parts per billion, which the page names rather than sells.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'Every ingredient, in the same order as the box in your hand.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Honest answer.',
    forTitle: 'A good fit if',
    forList: [
      'Your tone is uneven and you want the cream step to carry a real active, not just seal one in',
      'Your skin is normal to dry and takes an oil-rich cream well',
      'You already use the Multi Vita serum and want the finish that matches it',
      'You wear sunscreen daily, which any tone routine requires',
      'You want to see the active tested rather than declared',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'Your skin is oily. Thirteen percent macadamia oil is a lot of oil',
      'You avoid fragrance. There is bergamot oil in this, with limonene and linalool',
      'You want the astaxanthin to be the active. It is at ten parts per million and it is mostly the colour',
      'You expected a ceramide cream. That is product 27, which runs five hundred times more of it',
    ],
    note:
      'For external use only, and keep it clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'What to put it with.',
    intro: 'A cream is the last step. These are the products that come before it, and you can add any of them here.',
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
        q: 'What does "tested at 2.04%" actually mean?',
        a: 'Korea treats niacinamide as a functional ingredient, so the batch certificate runs a laboratory assay for it rather than just repeating the recipe. The specification is 2.00% and the batch on file came back at 2.04%. It is the difference between a brand telling you what it put in and a laboratory confirming what came out.',
      },
      {
        q: 'Serum or cream, if I only buy one?',
        a: 'Both carry niacinamide at 2%. The serum is water-based and also holds MELAZERO, the patented melanin complex, so for tone alone the serum does more. This cream is the one to buy if your skin is dry and you want the active in something that feeds it at the same time.',
      },
      {
        q: 'Why is it orange?',
        a: 'That is the astaxanthin, which is a carotenoid and naturally that colour. No pigment has been added. The shade can shift slightly with air exposure without the cream changing how it performs, so close the cap.',
      },
      {
        q: 'Is the astaxanthin doing much?',
        a: 'Honestly, it is at ten parts per million, so it is more the colour than the engine. You will see figures elsewhere about astaxanthin being thousands of times stronger than vitamin C. Those come from testing the raw material, not this cream, and we are not going to print them here.',
      },
      {
        q: 'Is it too rich for oily skin?',
        a: 'Probably, yes. Macadamia oil is the second ingredient at 13%. If your skin is oily and you want the tone work, take the serum and pair it with a lighter cream.',
      },
      {
        q: 'What is the pH?',
        a: 'The batch on file came back at 6.48, inside a 6.00 to 7.00 specification.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details.',
    rows: [
      { label: 'Format', value: 'Leave-on face cream, tube' },
      { label: 'Sizes', value: '50g homecare / 230g professional' },
      { label: 'Niacinamide', value: '2% in the formula, found at 2.04% in the batch on file' },
      { label: 'When', value: 'Morning and night, with sunscreen by day' },
      { label: 'Skin types', value: 'Normal to dry, with uneven tone' },
      { label: 'pH', value: '6.48, inside a 6.00 to 7.00 specification' },
      { label: 'Appearance', value: 'Orange cream. The colour is astaxanthin, not pigment' },
      { label: 'Fragrance', value: 'Bergamot fruit oil, with limonene and linalool' },
      { label: 'Storage', value: 'Cool and dark, cap closed' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'Two percent, confirmed.',
    body: 'The tone active at a real dose, in thirteen percent macadamia oil, with a laboratory number rather than a promise.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const AR: MvcreamCopy = {
  eyebrow: 'كريم · للون الباهت وغير المتجانس',
  headline: 'نياسيناميد ٢٪ كاملة، ويُختبر فعلاً.',
  subheadline:
    'كل دفعة من هذا الكريم تُفحص لمعرفة كمية النياسيناميد الموجودة فيها بالفعل، وهو ما لا تستطيع معظم الكريمات قوله. آخر دفعة جاءت عند ٢٫٠٤٪ مقابل تركيبة بنسبة ٢٪. هو الفعّال نفسه والجرعة نفسها الموجودة في سيروم Multi Vita، محمولاً هنا في ١٣٪ من زيت المكاداميا بدل الماء. اللون البرتقالي هو الأستازانتين، لا صبغة.',
  heroBullets: [
    'نياسيناميد بنسبة ٢٪، وكل دفعة تُختبر لإثبات ذلك',
    'آخر دفعة جاءت عند ٢٫٠٤٪',
    'محمول في ١٣٪ من زيت المكاداميا، مع ١٪ سكوالان',
    'ميلانين السطح أقل بـ ٢٩٫٧٪ خلال أسبوعين في تجربة المصنّع',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', '٥٠ غ و٢٣٠ غ', 'صباحاً ومساءً'],
  packSize: '٥٠ غ / ٢٣٠ غ',
  usageNote: 'صباحاً ومساءً، مع واقي الشمس نهاراً',
  chooseSize: 'اختاري الحجم',
  sizes: {
    homecareLabel: 'للاستخدام المنزلي',
    homecareNote: 'أنبوب ٥٠ غ، لروتين يومي في البيت',
    proLabel: 'للاستخدام الاحترافي',
    proNote: 'أنبوب ٢٣٠ غ، لاستخدام العيادة',
  },
  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّلي الدخول للتسوق',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني فوق ١٬٠٠٠ درهم · يُشحن من دبي',
  stats: [
    { value: '٢٫٠٤٪', label: 'نياسيناميد وُجد في الدفعة المسجّلة' },
    { value: '١٣٪', label: 'زيت مكاداميا، المكوّن الثاني بعد الماء' },
    { value: '−٢٩٫٧٪', label: 'ميلانين السطح عند أسبوعين، في تجربة المصنّع' },
    { value: '٥٠ غ', label: 'أنبوب منزلي، مع حجم عيادة ٢٣٠ غ' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'لون متجانس. توهّج حقيقي.',
    intro:
      'النصف الختامي من ثنائي Multi Vita. السيروم يحمل العمل على اللون في الماء؛ وهذا يحمل الفعّال نفسه في الزيت ويبقى على البشرة.',
    cards: [
      {
        title: 'اللون',
        body: 'نياسيناميد بنسبة ٢٪، نفس جرعة السيروم، يعمل على تسليم الصبغة إلى الخلايا عند السطح.',
      },
      {
        title: 'التوهّج',
        body: 'ثلاثة عشر بالمئة زيت مكاداميا مع سكوالان ١٪. الضوء يأتي من بشرة مغذّاة جيداً، وهو شيء مختلف عن اللمعان.',
      },
      {
        title: 'الراحة',
        body: 'بيتايين وإريثريتول بنصف بالمئة لكل منهما، في كريم أكثر من نصفه ماء رغم حِمل الزيت.',
      },
    ],
  },
  engine: {
    eyebrow: 'المركّب',
    title: 'الرقم الذي يُفحص.',
    body:
      'كوريا تعامل النياسيناميد كمكوّن وظيفي، وشهادة هذا الكريم تعكس ذلك: لا تسجّل التركيبة فحسب بل تُجري فحصاً للفعّال وتطبع النتيجة. المواصفة ٢٫٠٠٪ والنتيجة ٢٫٠٤٪. قليلة جداً هي الكريمات في أي مكان التي تُباع ومعها هذا الرقم.',
    points: [
      {
        title: 'نياسيناميد ٢٪، وُجد عند ٢٫٠٤٪',
        body: 'مادة صافية بدرجة USP، لا خليط مخفّف. نفس جرعة سيروم Multi Vita، فالثنائي متطابق فعلاً لا قوي وضعيف.',
      },
      {
        title: 'زيت المكاداميا ١٣٪',
        body: 'المكوّن الثاني بعد الماء والسبب في أن إحساسه لا يشبه السيروم إطلاقاً. تركيب أحماضه الدهنية قريب بشكل غير معتاد من زهم البشرة نفسه.',
      },
      {
        title: 'سكوالان ١٪ · بيتايين ٠٫٥٪ · إريثريتول ٠٫٥٪',
        body: 'السكوالان دهن آخر تصنعه البشرة أصلاً. والمرطّبان خلفه يمنعان الزيت من أن يكون الشيء الوحيد الذي يحبس الماء.',
      },
      {
        title: 'الأستازانتين، واللون',
        body: 'عند ٠٫٠٠١٪ في خليط ليبوزومي، فهو وجود حقيقي عند عشرة أجزاء بالمليون. وهو أيضاً سبب برتقالية الكريم: لم تُضف أي صبغة، وقد تتغيّر الدرجة قليلاً مع الهواء.',
      },
      {
        title: 'السوس ٠٫٠١٪ وفيتامين C ٠٫٠١٪',
        body: 'ثنائي اللون المساند، يصل عبر خليط مُسمّى. أعشار بالمئة صادقة لا فعّالات عناوين.',
      },
    ],
    figureAlt: 'مركّب Multi Vita للإشراق، بقيادة النياسيناميد بنسبة ٢٪',
  },
  clean: {
    eyebrow: 'الدليل',
    title: 'ماذا قاست التجربة.',
    intro: 'دراسة سريرية واحدة ولوحة واحدة، كلتاهما من المصنّع، وكلتاهما عن اللون.',
    items: [
      'ميلانين سطح البشرة انخفض من ٣٫٤٤٣ إلى ٢٫٤١٩ بعد أسبوعين من الاستخدام',
      'أي تحسّن بنسبة ٢٩٫٧٪ على المقياس الذي أخذوه',
      '٢١ امرأة، بأعمار من ٢٠ إلى ٥٩، في لوحة الرضا',
      '٩٥٪ قلن إن لون البشرة أصبح متجانساً',
      '١٠٠٪ أبلغن بعدم جفاف أو شدّ داخلي',
      '١٠٠٪ لم يشعرن بأي تهيّج على البشرة',
    ],
    note:
      'الـ ٩٥٪ تلك تستحق الإشارة. على السيروم جاء السؤال نفسه عند ١٠٠٪، وكان من السهل تقريب هذا الرقم ليطابقه. وأسبوعان هو ما قيس، فأسبوعان هو ما يُدّعى.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'الخطوة الأخيرة، وواقي الشمس فوقه.',
    frequency: 'صباحاً ومساءً',
    steps: [
      { title: 'التنظيف والتونر', body: 'ابدئي ببشرة نظيفة وتونر أولاً.' },
      {
        title: 'السيروم أولاً',
        body: 'Multi Vita Radiance Serum يوضع قبل هذا ويُربّت. الفعّال نفسه بحامل أخف، فيذهب تحته.',
      },
      { title: 'ثم الكريم', body: 'ضعيه على الوجه وافرديه. هو الخطوة الأخيرة ليلاً.' },
      {
        title: 'واقي الشمس صباحاً',
        body: 'غير اختياري مع أي شيء موجّه للّون. روتين تفتيح بلا واقٍ يومي يعمل ضد نفسه.',
      },
      {
        title: 'أغلقي الغطاء',
        body: 'البرتقالي قد يتغيّر قليلاً عند ملامسة الهواء دون أن يتغيّر عمل الكريم. أغلقيه جيداً وأبعديه عن الضوء.',
      },
    ],
    note: 'أبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج.',
    videoTitle: 'شاهدي القوام',
  },
  actives: {
    eyebrow: 'ماذا يحتوي',
    title: 'القائمة كاملة.',
    intro:
      'اثنان وأربعون مدخلاً. الأحد عشر الأوائل يشكّلون الأنبوب كله تقريباً، والذيل قائمة طويلة من الفيتامينات بالأجزاء بالمليار، تسمّيها الصفحة ولا تبيعها.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },
  suited: {
    eyebrow: 'هل هو لك',
    title: 'الجواب الصريح.',
    forTitle: 'مناسب إذا',
    forList: [
      'لون بشرتك غير متجانس وتريدين خطوة الكريم أن تحمل فعّالاً حقيقياً لا أن تحبس واحداً فقط',
      'بشرتك عادية إلى جافة وتتقبّل كريماً غنياً بالزيت',
      'تستخدمين سيروم Multi Vita وتريدين الختام المطابق له',
      'ترتدين واقي الشمس يومياً، وهو ما يتطلّبه أي روتين للّون',
      'تريدين رؤية الفعّال مفحوصاً لا مُعلناً',
    ],
    notTitle: 'ابحثي عن غيره إذا',
    notList: [
      'كانت بشرتك دهنية. ثلاثة عشر بالمئة زيت مكاداميا كمية كبيرة من الزيت',
      'كنت تتجنّبين العطر. فيه زيت البرغموت، مع ليمونين ولينالول',
      'كنت تريدين الأستازانتين فعّالاً. هو عند عشرة أجزاء بالمليون وهو في الأغلب اللون',
      'كنت تتوقّعين كريم سيراميد. ذلك هو المنتج ٢٧، وفيه خمسمئة ضعف منه',
    ],
    note:
      'للاستخدام الخارجي فقط، وأبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'ماذا تضعين معه.',
    intro: 'الكريم هو الخطوة الأخيرة. هذه المنتجات التي تسبقه، ويمكنك إضافة أي منها من هنا.',
    thisProduct: 'هذا المنتج',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الخيارات',
    fromPrice: 'ابتداءً من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'أسئلة متكرّرة.',
    items: [
      {
        q: 'ماذا تعني عبارة "مفحوص عند ٢٫٠٤٪" فعلاً؟',
        a: 'كوريا تعامل النياسيناميد كمكوّن وظيفي، فشهادة الدفعة تُجري فحصاً مخبرياً له بدل مجرّد تكرار الوصفة. المواصفة ٢٫٠٠٪ والدفعة المسجّلة جاءت عند ٢٫٠٤٪. هذا هو الفرق بين علامة تخبرك بما وضعته ومختبر يؤكّد ما خرج.',
      },
      {
        q: 'سيروم أم كريم إن اشتريت واحداً فقط؟',
        a: 'كلاهما يحمل نياسيناميد بنسبة ٢٪. السيروم مائي ويحمل أيضاً MELAZERO، مركّب الميلانين الحاصل على براءة، فللّون وحده يفعل السيروم أكثر. وهذا الكريم هو ما تشترينه إن كانت بشرتك جافة وتريدين الفعّال في شيء يغذّيها في الوقت نفسه.',
      },
      {
        q: 'لماذا لونه برتقالي؟',
        a: 'ذلك هو الأستازانتين، وهو كاروتينويد ولونه كذلك طبيعياً. لم تُضف أي صبغة. وقد تتغيّر الدرجة قليلاً مع التعرّض للهواء دون أن يتغيّر أداء الكريم، لذا أغلقي الغطاء.',
      },
      {
        q: 'هل يفعل الأستازانتين الكثير؟',
        a: 'بصراحة، هو عند عشرة أجزاء بالمليون، فهو اللون أكثر منه المحرّك. سترين في أماكن أخرى أرقاماً عن كون الأستازانتين أقوى بآلاف المرات من فيتامين C. تلك من فحص المادة الخام لا هذا الكريم، ولن نطبعها هنا.',
      },
      {
        q: 'هل هو غني أكثر من اللازم للبشرة الدهنية؟',
        a: 'على الأرجح نعم. زيت المكاداميا هو المكوّن الثاني بنسبة ١٣٪. إن كانت بشرتك دهنية وتريدين العمل على اللون، خذي السيروم واقرنيه بكريم أخف.',
      },
      {
        q: 'ما درجة الحموضة؟',
        a: 'الدفعة المسجّلة جاءت عند ٦٫٤٨، داخل مواصفة من ٦٫٠٠ إلى ٧٫٠٠.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل.',
    rows: [
      { label: 'الشكل', value: 'كريم وجه يُترك على البشرة، أنبوب' },
      { label: 'الأحجام', value: '٥٠ غ منزلي / ٢٣٠ غ احترافي' },
      { label: 'النياسيناميد', value: '٢٪ في التركيبة، وُجد عند ٢٫٠٤٪ في الدفعة المسجّلة' },
      { label: 'متى', value: 'صباحاً ومساءً، مع واقي الشمس نهاراً' },
      { label: 'أنواع البشرة', value: 'عادية إلى جافة، بلون غير متجانس' },
      { label: 'درجة الحموضة', value: '٦٫٤٨، داخل مواصفة من ٦٫٠٠ إلى ٧٫٠٠' },
      { label: 'المظهر', value: 'كريم برتقالي. اللون أستازانتين لا صبغة' },
      { label: 'العطر', value: 'زيت ثمرة البرغموت، مع ليمونين ولينالول' },
      { label: 'التخزين', value: 'بارد ومظلم، والغطاء مغلق' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'المنشأ', value: 'صنع في كوريا من DTS MG' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'اثنان بالمئة، مؤكّدة.',
    body: 'فعّال اللون بجرعة حقيقية، في ثلاثة عشر بالمئة من زيت المكاداميا، ومعه رقم مخبري لا وعد.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'كل المنتجات',
}

const RU: MvcreamCopy = {
  eyebrow: 'Крем · Тусклый и неровный тон',
  headline: 'Полные 2% ниацинамида, и его проверяют.',
  subheadline:
    'Каждую партию этого крема проверяют на реальное содержание ниацинамида, чего большинство кремов сказать о себе не могут. Последняя показала 2,04% при формуле в 2%. Это тот же актив и та же доза, что в сыворотке Multi Vita, только здесь он идёт в 13% масла макадамии, а не в воде. Оранжевый цвет — это астаксантин, а не пигмент.',
  heroBullets: [
    'Ниацинамид 2%, и каждая партия проверяется',
    'Последняя показала 2,04%',
    'В носителе из 13% масла макадамии, с 1% сквалана',
    'Поверхностный меланин ниже на 29,7% за две недели у производителя',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', '50 г и 230 г', 'Утром и вечером'],
  packSize: '50 г / 230 г',
  usageNote: 'Утром и вечером, днём с SPF',
  chooseSize: 'Выберите размер',
  sizes: {
    homecareLabel: 'Домашний уход',
    homecareNote: 'Туба 50 г, для ежедневного ухода дома',
    proLabel: 'Профессиональный',
    proNote: 'Туба 230 г, для работы в клинике',
  },
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
    { value: '2,04%', label: 'Ниацинамида найдено в партии из досье' },
    { value: '13%', label: 'Масло макадамии, второй ингредиент после воды' },
    { value: '−29,7%', label: 'Поверхностный меланин за две недели у производителя' },
    { value: '50 г', label: 'Домашняя туба, есть клинические 230 г' },
  ],
  effects: {
    eyebrow: 'Что он делает',
    title: 'Ровный тон. Настоящее сияние.',
    intro:
      'Завершающая половина пары Multi Vita. Сыворотка везёт работу над тоном в воде, крем везёт тот же актив в масле и остаётся на коже.',
    cards: [
      {
        title: 'Тон',
        body: 'Ниацинамид 2%, та же доза, что в сыворотке, работающий на этапе передачи пигмента клеткам поверхности.',
      },
      {
        title: 'Сияние',
        body: 'Тринадцать процентов масла макадамии со скваланом на 1%. Свет идёт от накормленной кожи, а это не то же самое, что блеск.',
      },
      {
        title: 'Комфорт',
        body: 'Бетаин и эритритол по полпроцента каждый, в креме, который больше чем наполовину состоит из воды, несмотря на масляную нагрузку.',
      },
    ],
  },
  engine: {
    eyebrow: 'Комплекс',
    title: 'Цифра, которую проверяют.',
    body:
      'Корея считает ниацинамид функциональным ингредиентом, и сертификат этого крема это отражает: он не просто фиксирует рецептуру, а проводит анализ актива и печатает результат. Спецификация 2,00%, найдено 2,04%. Очень немногие кремы вообще продаются с такой цифрой.',
    points: [
      {
        title: 'Ниацинамид 2%, найдено 2,04%',
        body: 'Чистое сырьё фармакопейного качества, а не разбавленный премикс. Та же доза, что в сыворотке Multi Vita, так что пара действительно парная, а не «сильный и слабый».',
      },
      {
        title: 'Масло макадамии 13%',
        body: 'Второй ингредиент после воды и причина, по которой ощущение совершенно не похоже на сыворотку. Его жирнокислотный профиль необычно близок к собственному себуму кожи.',
      },
      {
        title: 'Сквалан 1% · Бетаин 0,5% · Эритритол 0,5%',
        body: 'Сквалан — ещё один липид, который кожа делает сама. Два увлажнителя за ним не дают маслу быть единственным, что удерживает воду.',
      },
      {
        title: 'Астаксантин и цвет',
        body: 'На уровне 0,001% в липосомном премиксе, то есть реальное присутствие в десять частей на миллион. Он же причина оранжевого цвета: пигмент не добавлен, а оттенок может немного меняться от воздуха.',
      },
      {
        title: 'Солодка 0,01% и витамин C 0,01%',
        body: 'Вспомогательная пара по тону, приходящая через именованный премикс. Честные сотые доли процента, а не заглавные активы.',
      },
    ],
    figureAlt: 'Комплекс Multi Vita во главе с ниацинамидом 2%',
  },
  clean: {
    eyebrow: 'Доказательства',
    title: 'Что именно измерили.',
    intro: 'Одно клиническое и одна панель, обе от производителя, и обе про тон.',
    items: [
      'Поверхностный меланин снизился с 3,443 до 2,419 за две недели применения',
      'Это улучшение на 29,7% по взятой ими метрике',
      '21 женщина в возрасте от 20 до 59 лет в панели удовлетворённости',
      '95% отметили, что тон кожи стал ровным',
      '100% сообщили об отсутствии сухости и внутренней стянутости',
      '100% не почувствовали раздражения кожи',
    ],
    note:
      'На эти 95% стоит обратить внимание. В сыворотке тот же вопрос дал 100%, и округлить эту цифру до совпадения было бы легко. Измерены также именно две недели, поэтому две недели и заявляются.',
  },
  howTo: {
    eyebrow: 'Как применять',
    title: 'Последний шаг, и SPF сверху.',
    frequency: 'Утром и вечером',
    steps: [
      { title: 'Очищение и тоник', body: 'Начните на чистой коже, тоник первым.' },
      {
        title: 'Сначала сыворотка',
        body: 'Multi Vita Radiance Serum идёт до этого и вбивается. Тот же актив в более лёгком носителе, поэтому она снизу.',
      },
      { title: 'Затем крем', body: 'Нанесите на лицо и распределите. Вечером это последний шаг.' },
      {
        title: 'Утром SPF',
        body: 'С любым уходом за тоном это не опция. Осветляющий уход без ежедневного SPF работает против себя.',
      },
      {
        title: 'Закрывайте крышку',
        body: 'Оранжевый может немного измениться от контакта с воздухом, при этом крем работает по-прежнему. Плотно закрывайте и держите вдали от света.',
      },
    ],
    note: 'Держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
    videoTitle: 'Посмотрите на текстуру',
  },
  actives: {
    eyebrow: 'Что внутри',
    title: 'Состав целиком.',
    intro:
      'Сорок две позиции. Первые одиннадцать составляют почти всю тубу, а хвост — длинный список витаминов в частях на миллиард, которые страница называет, но не продаёт.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },
  suited: {
    eyebrow: 'Подойдёт ли вам',
    title: 'Честный ответ.',
    forTitle: 'Подойдёт, если',
    forList: [
      'Тон неровный, и хочется, чтобы шаг крема нёс реальный актив, а не только запечатывал чужой',
      'Кожа нормальная или сухая и хорошо принимает насыщенный маслом крем',
      'Вы уже пользуетесь сывороткой Multi Vita и нужен подходящий финиш',
      'Вы наносите SPF ежедневно, чего требует любой уход за тоном',
      'Вам важно видеть актив проверенным, а не заявленным',
    ],
    notTitle: 'Поищите другое, если',
    notList: [
      'Кожа жирная. Тринадцать процентов масла макадамии — это много масла',
      'Вы избегаете отдушки. Здесь масло бергамота, с лимоненом и линалоолом',
      'Вы хотите, чтобы работал астаксантин. Он на десяти частях на миллион и это в основном цвет',
      'Вы ждали церамидный крем. Это продукт 27, там его в пятьсот раз больше',
    ],
    note:
      'Только для наружного применения, держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
  },
  routine: {
    eyebrow: 'Дополните уход',
    title: 'С чем это сочетать.',
    intro: 'Крем — последний шаг. Вот продукты, которые идут до него, и любой из них можно добавить прямо здесь.',
    thisProduct: 'Этот продукт',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать вариант',
    fromPrice: 'От',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Частые вопросы.',
    items: [
      {
        q: 'Что на самом деле значит «найдено 2,04%»?',
        a: 'Корея считает ниацинамид функциональным ингредиентом, поэтому сертификат партии проводит лабораторный анализ на него, а не просто повторяет рецептуру. Спецификация 2,00%, партия из досье показала 2,04%. Это разница между тем, что бренд говорит, что положил, и тем, что лаборатория подтверждает на выходе.',
      },
      {
        q: 'Сыворотка или крем, если брать что-то одно?',
        a: 'Ниацинамид 2% есть в обоих. Сыворотка на водной основе и дополнительно несёт MELAZERO, запатентованный меланиновый комплекс, так что по тону она делает больше. Этот крем стоит брать, если кожа сухая и хочется, чтобы актив пришёл в том, что её одновременно питает.',
      },
      {
        q: 'Почему он оранжевый?',
        a: 'Это астаксантин, каротиноид, и такой цвет для него естественен. Пигмент не добавляли. Оттенок может слегка меняться от воздуха, при этом крем работает как прежде, так что закрывайте крышку.',
      },
      {
        q: 'Астаксантин много ли делает?',
        a: 'Честно говоря, он на десяти частях на миллион, так что это скорее цвет, чем двигатель. В других местах встречаются цифры о том, что астаксантин в тысячи раз сильнее витамина C. Они получены на сырье, а не на этом креме, и печатать их здесь мы не будем.',
      },
      {
        q: 'Не слишком ли он насыщенный для жирной кожи?',
        a: 'Скорее всего да. Масло макадамии — второй ингредиент, 13%. Если кожа жирная, а работа над тоном нужна, возьмите сыворотку и сочетайте её с более лёгким кремом.',
      },
      {
        q: 'Какой pH?',
        a: 'Партия из досье показала 6,48 при спецификации от 6,00 до 7,00.',
      },
    ],
  },
  details: {
    eyebrow: 'Спецификация',
    title: 'Детали.',
    rows: [
      { label: 'Формат', value: 'Несмываемый крем для лица, туба' },
      { label: 'Размеры', value: '50 г домашний / 230 г профессиональный' },
      { label: 'Ниацинамид', value: '2% в формуле, найдено 2,04% в партии из досье' },
      { label: 'Когда', value: 'Утром и вечером, днём с SPF' },
      { label: 'Типы кожи', value: 'Нормальная и сухая, с неровным тоном' },
      { label: 'pH', value: '6,48 при спецификации от 6,00 до 7,00' },
      { label: 'Внешний вид', value: 'Оранжевый крем. Цвет — астаксантин, не пигмент' },
      { label: 'Отдушка', value: 'Масло плодов бергамота, с лимоненом и линалоолом' },
      { label: 'Хранение', value: 'Прохладно и в темноте, крышка закрыта' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Два процента, подтверждённые.',
    body: 'Актив для тона в реальной дозе, в тринадцати процентах масла макадамии, с лабораторной цифрой вместо обещания.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const BY_LOCALE: Record<MvcreamLocale, MvcreamCopy> = { en: EN, ar: AR, ru: RU }

export function getMvcreamCopy(locale: string): MvcreamCopy {
  return BY_LOCALE[(locale as MvcreamLocale) in BY_LOCALE ? (locale as MvcreamLocale) : 'en']
}
