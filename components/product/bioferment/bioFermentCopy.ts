/**
 * Bespoke copy for the BIO-FERMENT AGE DEFYING POWDER MASK page (product 51).
 *
 * Same self-contained per-locale pattern as afsCopy.ts, so the dedicated
 * layout ships EN/AR/RU without adding keys to the shared messages bundles.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * There is no safety assessment on file for this product. Trade-name mapping
 * is therefore not available. Four documents cover every figure on this page:
 *
 *   Intertek/BIOFERMENT_MASK/Formula-GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf
 *       The quantitative formula. This is the source for every percentage.
 *       DTS MG is the registrant. Do not name the contract manufacturer
 *       printed on the COA.
 *   Intertek/BIOFERMENT_MASK/COA-GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pdf
 *       White powder, yellow colour, coagulation 5 to 10 minutes
 *       (measured 6 min 10 sec). No pH — it is a powder. Do not print the
 *       lot code or the expiry printed on that sheet. The next shipment is
 *       a different lot.
 *   Intertek/BIOFERMENT_MASK/Front.jpeg + Back.jpeg, and the matching
 *       Artwork PDF
 *       Front-panel sentence, dermatologically tested, BPM Professional,
 *       300g. Back-panel mix ratio (powder 1 : water 1.5, three scoops /
 *       40g to four and a half scoops of water), 15-20 minutes, peel,
 *       avoid eyes and eyebrows, PAO 6M, barcode 8809575679640.
 *   DTS MG deck: GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK.pptx
 *       (also served as the live PDF on genosys.ae/documents/PPT/)
 *       Clinical hydration 17.27 → 48.513 (+218%), two case studies
 *       (+323% / +327%), cooling cases −10°C / −11°C (27.5% / 29.6%),
 *       satisfaction panel of 21 women aged 30 to 59, and the comparison
 *       against Hydro Cool: this mask "doesn't dry out".
 *
 * THE FORMULA, as finished concentrations that matter on this page:
 *
 *   Diatomaceous Earth                         41.7900%
 *   Glucose                                    35.0000%
 *   Algin                                      15.0000%
 *   Calcium Sulfate                             6.0000%
 *   Hydrolyzed Collagen                         0.2000%
 *   Allantoin                                   0.1000%
 *   Chamaecyparis Obtusa Water                  0.0930%
 *   Gardenia Florida Fruit Extract              0.0450%
 *   Menthol                                     0.0200%
 *   Bacillus/Soybean Ferment Extract            0.0010%
 *   Galactomyces Ferment Filtrate               0.0010%
 *   Bifida Ferment Lysate                       0.0010%
 *   Aloe / Licorice / Rice Bran                 0.0010% each
 *   Lactobacillus/Punica Granatum Ferment       0.00001%
 *   sh-Oligopeptide-1 / -2                      0.00000010% each
 *   sh-Polypeptide-1 / -3 / -9 / -22            0.00000010% each
 *
 * THE DISTINCTIVE FACT, which is why this page exists.
 *
 * This is a professional alginate modeling mask. Diatomaceous earth, algin
 * and calcium sulfate are most of the jar. Mix with water at 1 : 1.5, it
 * sets, it peels off in one piece, and it holds moisture instead of drying
 * out. That is the product. The four ferments and the six peptides are in
 * the formula. They are not the engine.
 *
 * A July 2026 audit only removed "Fermented Green Tea" and renamed
 * "Fermented Rice". The live English, Arabic and Russian copy still sold
 * fermented rice, soy, ginseng, green tea and hyaluronic acid. None of
 * those lead the formula. Hyaluronic acid is not in it at all. Ginseng
 * and green tea are not in it. Rice bran is 0.001%.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Mix 3 scoops (40g) with 4.5 scoops of water, 1 : 1.5
 *       back label / deck how-to
 *   Apply, avoid eyes and eyebrows, peel after 15-20 minutes
 *       back label / deck how-to
 *   Wipe residue with toner                       deck how-to
 *   Seal the jar; powder spoils in air and light  deck caution
 *   Dermatologically tested                       front label
 *   300g                                          front / back / deck
 *   About seven treatments at 40g                 300 ÷ 40, from the scoop
 *   Coagulation 5-10 minutes                      COA
 *   +218% hydration (17.27 → 48.513)              DTS MG deck
 *   Cooling −10 to −11°C in the heated-face cases DTS MG deck
 *   Does not dry out                              DTS MG vs Hydro Cool
 *   Every percentage above                        Formula PDF
 *   PAO 6 months                                  back label
 *   Made in Korea by DTS MG                       formula / CFS / label
 *
 * DELIBERATE OMISSIONS — do not add these without a document:
 *   - HEALING, REPAIR, REGENERATION, ANTI-INFLAMMATORY, IMMUNE-BOOSTING,
 *     WOUND HEALING. The deck writes those next to the six peptides.
 *     Drug-register for a cosmetic sold in the UAE.
 *   - SIX GROWTH FACTORS / SIX PEPTIDES as the reason the mask works.
 *     Each sh-peptide is 1 ppb. Name them in the FAQ if asked. Do not
 *     build a card or a hero bullet on them. The pack sentence may be
 *     echoed as the product's own language; it must not become the
 *     engine of the page.
 *   - HYALURONIC ACID. Not in the formula.
 *   - FERMENTED RICE / SOY / GINSENG / GREEN TEA as lead actives.
 *     Rice bran is 0.001% and is not fermented rice. Soy ferment is
 *     0.001%. Ginseng and green tea are absent.
 *   - "MIX WITH YOUR PREFERRED LIQUID." The pack says water.
 *   - FRAGRANCE-FREE. Cypress water is listed as fragrance on the
 *     formula; menthol is in it.
 *   - LOT CODES. Never print S601P1 or the COA expiry.
 *   - THE CONTRACT MANUFACTURER. DTS MG only.
 *   - A LAB NAME OR DATE for the hydration trial. The deck does not
 *     print one. Attribute "DTS MG clinical trial".
 *   - A pH. There is none on the COA.
 */

export type BioFermentLocale = 'en' | 'ar' | 'ru'

export interface BioFermentCopy {
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
  proof: {
    eyebrow: string
    title: string
    intro: string
    chartTitle: string
    beforeLabel: string
    afterLabel: string
    headline: { value: string; label: string }
    cooling: { value: string; label: string }
    attribution: string
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

/** Registered formula INCI. The pack list differs (Hydrolyzed Corn Starch
 *  and sh-Polypeptide-11 in place of Hydrolyzed Collagen, Allantoin and
 *  sh-Polypeptide-3). The page prints the registered list and does not
 *  claim it matches the carton. */
export const FULL_INCI =
  'Diatomaceous Earth, Glucose, Algin, Calcium Sulfate, Aqua (Water), Sodium Benzoate, ' +
  'Sodium Dehydroacetate, Hydrolyzed Collagen, Allantoin, Lactobacillus/Punica Granatum ' +
  'Fruit Ferment Extract, Bacillus/Soybean Ferment Extract, Galactomyces Ferment Filtrate, ' +
  'Bifida Ferment Lysate, Chamaecyparis Obtusa Water, Aloe Barbadensis Leaf Extract, ' +
  'Glycyrrhiza Glabra (Licorice) Root Extract, Oryza Sativa (Rice) Bran Extract, ' +
  'Gardenia Florida Fruit Extract, sh-Oligopeptide-1, sh-Oligopeptide-2, sh-Polypeptide-1, ' +
  'sh-Polypeptide-3, sh-Polypeptide-9, sh-Polypeptide-22, Glycerin, Ethylhexylglycerin, ' +
  'Menthol, 1,2-Hexanediol, Butylene Glycol, Tetrasodium Pyrophosphate, Dextrin.'

const EN: BioFermentCopy = {
  eyebrow: 'Modeling mask · Powder',
  headline: 'Mix it fresh. Peel it off.',
  subheadline:
    'A diatomaceous-earth modeling mask that locks moisture in instead of drying out. Three scoops of powder, water, fifteen minutes, and hydration that rose 218% in the clinical trial.',
  heroBullets: [
    'Mixes 1 to 1.5 with water, sets, and peels away in one piece',
    'Hydration rose 218% in the DTS MG clinical trial',
    'Diatomaceous earth base that holds moisture instead of drying out',
    '300g jar — about seven treatments at 40g, scoop in the pack',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '300g professional jar', 'Clinic and home'],
  packSize: '300g',
  usageNote: 'Once or twice a week',
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
    { value: '218%', label: 'Hydration lift in the clinical trial' },
    { value: '1 : 1.5', label: 'Powder to water, mixed fresh each time' },
    { value: '15–20 min', label: 'On the face, then peel' },
    { value: '300g', label: 'About seven treatments at 40g' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Hydrate. Cool. Peel.',
    intro:
      'Three jobs, which is what a modeling mask is for: put water back, take the heat down, and come off in one piece.',
    cards: [
      {
        title: 'Hydrate',
        body: 'The earth-and-algin set holds moisture against the skin instead of tightening as it dries. In the clinical trial, hydration rose from 17.27 to 48.513 — 218%.',
      },
      {
        title: 'Cool',
        body: 'Menthol and cypress water take the temperature down while the mask sits. On heated skin in the trial, the treated side fell about 10 to 11°C.',
      },
      {
        title: 'Peel',
        body: 'Calcium sulfate sets the algin. After fifteen to twenty minutes you lift the mask off in one sheet, then wipe what is left with toner.',
      },
    ],
  },
  engine: {
    eyebrow: 'The mask',
    title: 'The earth, the algin, and the set.',
    body:
      'Most of the jar is a modeling-mask base: diatomaceous earth, glucose, algin and calcium sulfate. Mix them with water and they become a cream that sets on the face and peels away without drying the skin out. That is the product. Hydrolyzed collagen and allantoin ride in the set. The four ferments sit with them.',
    points: [
      {
        title: 'Diatomaceous earth · 41.79%',
        body: 'The moisture-locking base. Fine mineral powder that holds water against the skin for the full wear, which is why this mask does not dry out the way a cooling alginate can.',
      },
      {
        title: 'Algin 15% + calcium sulfate 6%',
        body: 'The set. Algin thickens with water; calcium sulfate turns that cream into a peelable sheet in five to ten minutes. You leave it on for fifteen to twenty, then lift.',
      },
      {
        title: 'Glucose · 35%',
        body: 'The humectant in the powder. It pulls water into the mix so the cream stays workable, then sits on the skin as moisture rather than as a film.',
      },
      {
        title: 'Hydrolyzed collagen 0.2% + allantoin 0.1%',
        body: 'The two skin-conditioning actives at a level that belongs on a card. Collagen for the feel of a smoother surface; allantoin for comfort while the mask sits.',
      },
    ],
    figureAlt: 'GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK jar, powder bag and measuring scoop',
  },
  proof: {
    eyebrow: 'The study',
    title: 'They measured moisture. Then they measured again.',
    intro:
      'A DTS MG clinical trial on the finished mask, not on a single ingredient. Skin moisture was read before the treatment and after it. The same deck then heated the face and read temperature on the treated side against the untreated side.',
    chartTitle: 'Skin moisture content',
    beforeLabel: 'Before',
    afterLabel: 'After',
    headline: { value: '218%', label: 'Rise in skin hydration after one treatment' },
    cooling: { value: '−10 to −11°C', label: 'Drop on heated skin in the two published cases' },
    attribution: 'DTS MG clinical trial. Satisfaction panel: 21 women aged 30 to 59.',
    note:
      'Moisture moved from 17.27 to 48.513. Two women in the same trial, one in her late forties with dry skin and one in her mid-fifties with normal-to-dry skin, read +327% and +323%. Cooling was measured after the face was heated: −10°C on oily skin in the late thirties, −11°C on normal-to-dry skin in the mid-fifties.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Three scoops. Water. Peel.',
    frequency: 'Once or twice a week',
    steps: [
      {
        title: 'Mix',
        body: 'Three scoops of powder (40g) with four and a half scoops of water, using the cup in the pack. That is powder 1 to water 1.5. Stir to a smooth cream.',
      },
      {
        title: 'Apply',
        body: 'Spread evenly on clean skin. Keep it off the eyes and the eyebrows.',
      },
      {
        title: 'Wait',
        body: 'Leave it fifteen to twenty minutes. It sets in five to ten; the extra time is the treatment.',
      },
      {
        title: 'Peel',
        body: 'Lift the mask off in one piece. Wipe any residue with toner. Then go on with serum and cream.',
      },
    ],
    note:
      'Close the jar tightly after every use. Left open, the powder takes on air and light and the next mix will not set the same way. Water only — not toner, not an ampoule.',
    videoTitle: 'See it mixed',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The formula, with the figures.',
    intro:
      'The cards below are the parts of the jar that do the work. The complete registered INCI is under the list.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'The registered formula.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Honest answer.',
    forTitle: 'A good fit if',
    forList: [
      'You want a weekly modeling mask that peels off in one piece',
      'Skin feels tight, dull or heat-stressed and needs a real drink',
      'You have used Hydro Cool and want the mask that holds moisture instead of cooling until it comes off',
      'You work in a clinic or you mask at home and can give it twenty minutes',
      'You like a fresh mix each time, not a sheet from a tub',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You want a ready sheet mask — that is PDRN or Collagen, not this jar',
      'Menthol or a cypress note bothers you — both are in the powder',
      'You need a daily leave-on. This is once or twice a week',
      'You cannot keep it off the eyes and eyebrows',
      'You want to mix it with toner or an ampoule. The directions are water',
    ],
    note: 'For external use only. If it reaches the eyes, rinse with cool water. Stop and speak to a doctor if redness, swelling or irritation appears.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'What to put it with.',
    intro:
      'A modeling mask is a weekly step. Cleanse first, mask, then mist and cream so the moisture stays.',
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
        q: 'How do I mix it?',
        a: 'Three scoops of powder (40g) to four and a half scoops of water, with the cup in the pack. Powder 1 to water 1.5. Stir to a smooth cream and apply before it starts to set.',
      },
      {
        q: 'How many treatments in the jar?',
        a: 'About seven. Each mix is 40g and the jar is 300g. The scoop is in the pack.',
      },
      {
        q: 'Do I rinse it off?',
        a: 'No. Peel it off in one piece after fifteen to twenty minutes, then wipe what is left with toner.',
      },
      {
        q: 'Can I mix it with toner or an ampoule?',
        a: 'The directions are water. Other liquids change the set, and the coagulation time on the certificate is measured on a water mix.',
      },
      {
        q: 'What are the six peptides on the front?',
        a: 'Six sh-peptides named in the formula: sh-Oligopeptide-1 and -2, and sh-Polypeptide-1, -3, -9 and -22. They sit at laboratory level. The mask you feel is the earth-and-algin set that locks moisture and peels away in one piece.',
      },
      {
        q: 'How is this different from Hydro Cool?',
        a: 'Hydro Cool is the clinic kilo you reach for when you want cooling until the mask comes off. This one is the 300g moisturizing modeling mask that does not dry out, for clinic or home.',
      },
      {
        q: 'Is it fragrance-free?',
        a: 'No. Cypress water is in the formula as a fragrance ingredient, and there is menthol. If you avoid both, this is not the mask.',
      },
      {
        q: 'How do I store it?',
        a: 'Cool, dry, lid tight. Powder that sits open takes on moisture and light and will not set the same way next time. Use within six months of opening.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details.',
    rows: [
      { label: 'Format', value: 'Powder modeling mask, mixes with water' },
      { label: 'Net weight', value: '300g / 10.58 oz.' },
      { label: 'Mix', value: 'Powder 1 : water 1.5 · 40g powder per treatment' },
      { label: 'Set time', value: 'Coagulates in 5 to 10 minutes' },
      { label: 'Wear', value: '15 to 20 minutes, then peel' },
      { label: 'When', value: 'Once or twice a week' },
      { label: 'Appearance', value: 'White powder, yellow in the colour test' },
      { label: 'After opening', value: 'Six months, lid tight, cool and dry' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'Mix it fresh. Peel it off.',
    body: 'Forty grams of powder, water, twenty minutes, and skin that drank.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const AR: BioFermentCopy = {
  eyebrow: 'ماسك قولبة · بودرة',
  headline: 'اخلطيه طازجاً. انزعيه قطعة واحدة.',
  subheadline:
    'ماسك قولبة من تراب الدياتوم يحبس الرطوبة بدل أن يجف على الوجه. ثلاث مغارف من البودرة، ماء، خمس عشرة دقيقة، وترطيب ارتفع ٢١٨٪ في التجربة السريرية.',
  heroBullets: [
    'يُخلط ١ إلى ١.٥ بالماء، يتماسك، ويُنزع قطعة واحدة',
    'ارتفع الترطيب ٢١٨٪ في التجربة السريرية لـ DTS MG',
    'قاعدة من تراب الدياتوم تمسك الرطوبة بدل أن تجف',
    'عبوة ٣٠٠ غ — نحو سبع جلسات بـ ٤٠ غ، والمغرفة في العبوة',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', 'عبوة مهنية ٣٠٠ غ', 'للعيادة والمنزل'],
  packSize: '٣٠٠ غ',
  usageNote: 'مرة أو مرتين في الأسبوع',
  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّل الدخول للتسوق',
  outOfStock: 'نفد المخزون',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني فوق ١٬٠٠٠ درهم · الشحن من دبي',
  stats: [
    { value: '٢١٨٪', label: 'ارتفاع الترطيب في التجربة السريرية' },
    { value: '١ : ١.٥', label: 'بودرة إلى ماء، تُخلط طازجة في كل مرة' },
    { value: '١٥–٢٠ د', label: 'على الوجه، ثم يُنزع' },
    { value: '٣٠٠ غ', label: 'نحو سبع جلسات بـ ٤٠ غ' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'يرطّب. يبرّد. يُنزع.',
    intro:
      'ثلاث مهام، وهذا ما وُجد ماسك القولبة من أجله: يعيد الماء، يخفّض الحرارة، ويخرج قطعة واحدة.',
    cards: [
      {
        title: 'يرطّب',
        body: 'تماسك التراب والألجين يحبس الرطوبة على البشرة بدل أن يشدّ وهو يجف. في التجربة السريرية ارتفع الترطيب من ١٧.٢٧ إلى ٤٨.٥١٣ — أي ٢١٨٪.',
      },
      {
        title: 'يبرّد',
        body: 'المنثول وماء السرو يخفّضان الحرارة بينما يجلس الماسك. على بشرة مُسخَّنة في التجربة انخفض الجانب المعالَج نحو ١٠ إلى ١١ درجة.',
      },
      {
        title: 'يُنزع',
        body: 'كبريتات الكالسيوم تثبّت الألجين. بعد خمس عشرة إلى عشرين دقيقة ترفعين الماسك قطعة واحدة، ثم تمسحين الباقي بالتونر.',
      },
    ],
  },
  engine: {
    eyebrow: 'الماسك',
    title: 'التراب، والألجين، والتماسك.',
    body:
      'معظم العبوة قاعدة ماسك قولبة: تراب دياتوم، غلوكوز، ألجين وكبريتات كالسيوم. اخلطيها بالماء فتصبح كريماً يتماسك على الوجه ويُنزع دون أن يجفّف البشرة. هذا هو المنتج. الكولاجين المتحلل والألانتوين يسيران في التماسك. والمخمّرات الأربعة معها.',
    points: [
      {
        title: 'تراب الدياتوم · ٤١.٧٩٪',
        body: 'قاعدة حبس الرطوبة. بودرة معدنية ناعمة تمسك الماء على البشرة طوال مدة الجلوس، ولهذا لا يجف هذا الماسك كما يجف ألجين التبريد.',
      },
      {
        title: 'ألجين ١٥٪ + كبريتات كالسيوم ٦٪',
        body: 'التماسك. الألجين يثخن بالماء؛ كبريتات الكالسيوم تحوّل الكريم إلى ورقة تُنزع في خمس إلى عشر دقائق. تتركينه خمس عشرة إلى عشرين، ثم ترفعينه.',
      },
      {
        title: 'الغلوكوز · ٣٥٪',
        body: 'المرطّب في البودرة. يسحب الماء إلى الخليط ليبقى الكريم قابلاً للفرد، ثم يجلس على البشرة رطوبة لا فيلماً.',
      },
      {
        title: 'كولاجين متحلل ٠.٢٪ + ألانتوين ٠.١٪',
        body: 'المكوّنان الملطّفان عند مستوى يستحق بطاقة. الكولاجين لملمس أملس؛ الألانتوين للراحة بينما يجلس الماسك.',
      },
    ],
    figureAlt: 'عبوة GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK وكيس البودرة والمغرفة',
  },
  proof: {
    eyebrow: 'الدراسة',
    title: 'قاسوا الرطوبة. ثم قاسوا مرة أخرى.',
    intro:
      'تجربة سريرية من DTS MG على الماسك الجاهز، لا على مكوّن واحد. قُرئت رطوبة البشرة قبل الجلسة وبعدها. ثم سخّن الوجه وقُرئت الحرارة على الجانب المعالَج مقابل غير المعالَج.',
    chartTitle: 'محتوى رطوبة البشرة',
    beforeLabel: 'قبل',
    afterLabel: 'بعد',
    headline: { value: '٢١٨٪', label: 'ارتفاع ترطيب البشرة بعد جلسة واحدة' },
    cooling: { value: '−١٠ إلى −١١°م', label: 'الانخفاض على بشرة مُسخَّنة في الحالتين المنشورتين' },
    attribution: 'تجربة سريرية من DTS MG. استبيان الرضا: ٢١ امرأة بين ٣٠ و٥٩ عاماً.',
    note:
      'تحركت الرطوبة من ١٧.٢٧ إلى ٤٨.٥١٣. امرأتان في التجربة نفسها، واحدة أواخر الأربعين ببشرة جافة وواحدة منتصف الخمسين ببشرة عادية إلى جافة، قرأتا +٣٢٧٪ و+٣٢٣٪. قيس التبريد بعد تسخين الوجه: −١٠°م على بشرة دهنية أواخر الثلاثين، و−١١°م على بشرة عادية إلى جافة منتصف الخمسين.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'ثلاث مغارف. ماء. انزعي.',
    frequency: 'مرة أو مرتين في الأسبوع',
    steps: [
      {
        title: 'اخلطي',
        body: 'ثلاث مغارف من البودرة (٤٠ غ) مع أربع مغارف ونصف من الماء، بالكأس في العبوة. أي بودرة ١ إلى ماء ١.٥. حرّكي حتى يصير كريماً ناعماً.',
      },
      {
        title: 'ضعي',
        body: 'وزّعي بالتساوي على بشرة نظيفة. أبعديه عن العينين والحاجبين.',
      },
      {
        title: 'انتظري',
        body: 'اتركيه خمس عشرة إلى عشرين دقيقة. يتماسك في خمس إلى عشر؛ الوقت الإضافي هو الجلسة.',
      },
      {
        title: 'انزعي',
        body: 'ارفعي الماسك قطعة واحدة. امسحي الباقي بالتونر. ثم تابعي بالسيروم والكريم.',
      },
    ],
    note:
      'أغلقي العبوة بإحكام بعد كل استخدام. إن تُركت مفتوحة تأخذ البودرة الهواء والضوء ولن يتماسك الخلط التالي كما ينبغي. ماء فقط — لا تونر ولا أمبول.',
    videoTitle: 'شاهديه وهو يُخلط',
  },
  actives: {
    eyebrow: 'ماذا فيه',
    title: 'التركيبة، بالأرقام.',
    intro:
      'البطاقات أدناه هي أجزاء العبوة التي تعمل. قائمة INCI المسجّلة كاملة تحتها.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote: 'التركيبة المسجّلة.',
  },
  suited: {
    eyebrow: 'هل يناسبك',
    title: 'جواب صادق.',
    forTitle: 'يناسبك إذا',
    forList: [
      'تريدين ماسك قولبة أسبوعياً يُنزع قطعة واحدة',
      'البشرة مشدودة أو باهتة أو منهكة من الحر وتحتاج شربة حقيقية',
      'جرّبتِ Hydro Cool وتريدين الماسك الذي يحبس الرطوبة بدل أن يبرّد حتى يُنزع',
      'تعملين في عيادة أو تضعين الماسك في المنزل وتقدرين على عشرين دقيقة',
      'تفضلين خلطاً طازجاً في كل مرة، لا ورقة من علبة',
    ],
    notTitle: 'ابحثي عن غيره إذا',
    notList: [
      'تريدين ماسك ورق جاهز — ذلك PDRN أو الكولاجين، لا هذه العبوة',
      'يزعجك المنثول أو نفحة السرو — كلاهما في البودرة',
      'تحتاجين عناية يومية تُترك على البشرة. هذا مرة أو مرتين في الأسبوع',
      'لا تستطيعين إبعاده عن العينين والحاجبين',
      'تريدين خلطه بتونر أو أمبول. التعليمات ماء',
    ],
    note: 'للاستخدام الخارجي فقط. إن وصل إلى العينين، اشطفي بماء بارد. توقفي وراجعي طبيباً إن ظهر احمرار أو تورم أو تهيّج.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'ماذا تضعين معه.',
    intro:
      'ماسك القولبة خطوة أسبوعية. نظّفي أولاً، ثم الماسك، ثم الرذاذ والكريم كي تبقى الرطوبة.',
    thisProduct: 'هذا المنتج',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الخيارات',
    fromPrice: 'من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'أسئلة شائعة.',
    items: [
      {
        q: 'كيف أخلطه؟',
        a: 'ثلاث مغارف من البودرة (٤٠ غ) إلى أربع مغارف ونصف من الماء، بالكأس في العبوة. بودرة ١ إلى ماء ١.٥. حرّكي حتى يصير كريماً ناعماً وضعيه قبل أن يبدأ بالتماسك.',
      },
      {
        q: 'كم جلسة في العبوة؟',
        a: 'نحو سبع. كل خلط ٤٠ غ والعبوة ٣٠٠ غ. المغرفة في العبوة.',
      },
      {
        q: 'هل أشطفه؟',
        a: 'لا. انزعيه قطعة واحدة بعد خمس عشرة إلى عشرين دقيقة، ثم امسحي الباقي بالتونر.',
      },
      {
        q: 'هل أخلطه بتونر أو أمبول؟',
        a: 'التعليمات ماء. السوائل الأخرى تغيّر التماسك، وزمن التجلّط في الشهادة مقاس على خلط بالماء.',
      },
      {
        q: 'ما الببتيدات الستة على الواجهة؟',
        a: 'ستة ببتيدات sh مسمّاة في التركيبة: sh-Oligopeptide-1 و-2، وsh-Polypeptide-1 و-3 و-9 و-22. مستواها مخبري. الماسك الذي تحسّين به هو تماسك التراب والألجين الذي يحبس الرطوبة ويُنزع قطعة واحدة.',
      },
      {
        q: 'ما الفرق عن Hydro Cool؟',
        a: 'Hydro Cool هو كيلو العيادة حين تريدين تبريداً حتى يُنزع الماسك. هذا ماسك القولبة المرطّب بـ ٣٠٠ غ الذي لا يجف، للعيادة أو المنزل.',
      },
      {
        q: 'هل هو خالٍ من العطر؟',
        a: 'لا. ماء السرو في التركيبة كمكوّن عطري، وفيه منثول. إن كنتِ تتجنّبين الاثنين، فهذا ليس الماسك.',
      },
      {
        q: 'كيف أخزّنه؟',
        a: 'مكان بارد جاف، الغطاء محكم. البودرة المفتوحة تأخذ رطوبة وضوءاً ولن تتماسك في المرة التالية كما ينبغي. استخدمي خلال ستة أشهر من الفتح.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل.',
    rows: [
      { label: 'الشكل', value: 'ماسك قولبة بودرة، يُخلط بالماء' },
      { label: 'الوزن الصافي', value: '٣٠٠ غ / ١٠.٥٨ أونصة' },
      { label: 'الخلط', value: 'بودرة ١ : ماء ١.٥ · ٤٠ غ بودرة لكل جلسة' },
      { label: 'زمن التماسك', value: 'يتجلّط في ٥ إلى ١٠ دقائق' },
      { label: 'الجلوس', value: '١٥ إلى ٢٠ دقيقة، ثم يُنزع' },
      { label: 'متى', value: 'مرة أو مرتين في الأسبوع' },
      { label: 'المظهر', value: 'بودرة بيضاء، صفراء في اختبار اللون' },
      { label: 'بعد الفتح', value: 'ستة أشهر، غطاء محكم، بارد وجاف' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'المنشأ', value: 'صنع في كوريا لدى DTS MG' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'اخلطيه طازجاً. انزعيه قطعة واحدة.',
    body: 'أربعون غراماً من البودرة، ماء، عشرون دقيقة، وبشرة شربت.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'كل المنتجات',
}

const RU: BioFermentCopy = {
  eyebrow: 'Моделирующая маска · Пудра',
  headline: 'Смешай свежую. Сними целиком.',
  subheadline:
    'Моделирующая маска на диатомовой земле, которая держит влагу, а не сушит. Три мерные ложки пудры, вода, пятнадцать минут — и увлажнение, которое выросло на 218% в клиническом исследовании.',
  heroBullets: [
    'Смешивается 1 к 1,5 с водой, схватывается и снимается одним пластом',
    'Увлажнение выросло на 218% в клиническом исследовании DTS MG',
    'База из диатомовой земли держит влагу вместо того, чтобы сохнуть',
    'Банка 300 г — около семи процедур по 40 г, мерная ложка в упаковке',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', 'Профессиональная банка 300 г', 'Клиника и дом'],
  packSize: '300 г',
  usageNote: 'Раз или два в неделю',
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
    { value: '218%', label: 'Рост увлажнения в клиническом исследовании' },
    { value: '1 : 1,5', label: 'Пудра к воде, свежая смесь каждый раз' },
    { value: '15–20 мин', label: 'На лице, затем снять' },
    { value: '300 г', label: 'Около семи процедур по 40 г' },
  ],
  effects: {
    eyebrow: 'Что делает',
    title: 'Увлажняет. Охлаждает. Снимается.',
    intro:
      'Три задачи — ради этого и нужна моделирующая маска: вернуть воду, снять жар и сойти одним пластом.',
    cards: [
      {
        title: 'Увлажняет',
        body: 'Схватка земли и альгина держит влагу на коже, а не стягивает, пока сохнет. В исследовании увлажнение выросло с 17,27 до 48,513 — на 218%.',
      },
      {
        title: 'Охлаждает',
        body: 'Ментол и кипарисовая вода снижают температуру, пока маска сидит. На нагретой коже в исследовании обработанная сторона упала примерно на 10–11°C.',
      },
      {
        title: 'Снимается',
        body: 'Сульфат кальция схватывает альгин. Через пятнадцать-двадцать минут маска снимается одним пластом, остаток стирают тоником.',
      },
    ],
  },
  engine: {
    eyebrow: 'Маска',
    title: 'Земля, альгин и схватка.',
    body:
      'Большая часть банки — база моделирующей маски: диатомовая земля, глюкоза, альгин и сульфат кальция. Смешай с водой — получится крем, который схватывается на лице и снимается, не высушивая кожу. Это и есть продукт. Гидролизованный коллаген и аллантоин идут в схватке. Четыре фермента — рядом.',
    points: [
      {
        title: 'Диатомовая земля · 41,79%',
        body: 'Влагоудерживающая база. Тонкий минеральный порошок держит воду на коже всё время ношения — поэтому эта маска не сохнет так, как охлаждающий альгинат.',
      },
      {
        title: 'Альгин 15% + сульфат кальция 6%',
        body: 'Схватка. Альгин густеет с водой; сульфат кальция превращает крем в снимаемый пласт за пять-десять минут. Держишь пятнадцать-двадцать, затем снимаешь.',
      },
      {
        title: 'Глюкоза · 35%',
        body: 'Увлажнитель в пудре. Тянет воду в смесь, чтобы крем оставался пластичным, и остаётся на коже влагой, а не плёнкой.',
      },
      {
        title: 'Гидролизованный коллаген 0,2% + аллантоин 0,1%',
        body: 'Два кондиционирующих актива на уровне, который стоит карточки. Коллаген — для более гладкой поверхности; аллантоин — для комфорта, пока маска сидит.',
      },
    ],
    figureAlt: 'Банка GENOSYS BIO-FERMENT AGE DEFYING POWDER MASK, пакет с пудрой и мерная ложка',
  },
  proof: {
    eyebrow: 'Исследование',
    title: 'Измерили влагу. Потом измерили ещё раз.',
    intro:
      'Клиническое исследование DTS MG на готовой маске, не на одном ингредиенте. Влажность кожи снимали до процедуры и после. Затем лицо нагревали и сравнивали температуру обработанной стороны с необработанной.',
    chartTitle: 'Содержание влаги в коже',
    beforeLabel: 'До',
    afterLabel: 'После',
    headline: { value: '218%', label: 'Рост увлажнения кожи после одной процедуры' },
    cooling: { value: '−10 до −11°C', label: 'Снижение на нагретой коже в двух опубликованных случаях' },
    attribution: 'Клиническое исследование DTS MG. Опрос удовлетворённости: 21 женщина 30–59 лет.',
    note:
      'Влага сдвинулась с 17,27 до 48,513. Две участницы того же исследования — поздние сорок, сухая кожа, и середина пятидесятых, нормальная к сухой — дали +327% и +323%. Охлаждение мерили после нагрева лица: −10°C на жирной коже в поздние тридцать, −11°C на нормальной к сухой в середине пятидесятых.',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Три ложки. Вода. Снять.',
    frequency: 'Раз или два в неделю',
    steps: [
      {
        title: 'Смешай',
        body: 'Три мерные ложки пудры (40 г) с четырьмя с половиной ложками воды — стаканчиком из упаковки. Это пудра 1 к воде 1,5. Размешай до гладкого крема.',
      },
      {
        title: 'Нанеси',
        body: 'Распредели ровно по чистой коже. Не заходи на глаза и брови.',
      },
      {
        title: 'Подожди',
        body: 'Оставь на пятнадцать-двадцать минут. Схватывается за пять-десять; остальное время — сама процедура.',
      },
      {
        title: 'Сними',
        body: 'Подними маску одним пластом. Остаток сотри тоником. Дальше — сыворотка и крем.',
      },
    ],
    note:
      'Плотно закрывай банку после каждого раза. Открытая пудра берёт воздух и свет, и следующая смесь схватится иначе. Только вода — не тоник и не ампула.',
    videoTitle: 'Как смешивать',
  },
  actives: {
    eyebrow: 'Что внутри',
    title: 'Формула, с цифрами.',
    intro:
      'Карточки ниже — те части банки, которые работают. Полный зарегистрированный INCI — под списком.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote: 'Зарегистрированная формула.',
  },
  suited: {
    eyebrow: 'Тебе подойдёт',
    title: 'Честный ответ.',
    forTitle: 'Хороший выбор, если',
    forList: [
      'Нужна еженедельная моделирующая маска, которая снимается одним пластом',
      'Кожа стянута, тусклая или перегрета и хочет настоящей влаги',
      'Ты уже пробовала Hydro Cool и хочешь маску, которая держит влагу, а не охлаждает до снятия',
      'Работаешь в кабинете или красишься дома и можешь дать ей двадцать минут',
      'Любишь свежую смесь каждый раз, а не лист из банки',
    ],
    notTitle: 'Ищи другое, если',
    notList: [
      'Нужна готовая тканевая маска — это PDRN или коллаген, не эта банка',
      'Ментол или кипарисовая нота тебе мешают — оба в пудре',
      'Нужен ежедневный несмываемый уход. Это раз или два в неделю',
      'Не можешь держать её в стороне от глаз и бровей',
      'Хочешь мешать с тоником или ампулой. В инструкции — вода',
    ],
    note: 'Только наружно. Если попала в глаза — промой прохладной водой. Прекрати и обратись к врачу, если появились покраснение, отёк или раздражение.',
  },
  routine: {
    eyebrow: 'Собери уход',
    title: 'С чем ставить.',
    intro:
      'Моделирующая маска — недельный шаг. Сначала очищение, затем маска, затем мист и крем, чтобы влага осталась.',
    thisProduct: 'Этот продукт',
    viewProduct: 'Смотреть продукт',
    chooseOptions: 'Выбрать опции',
    fromPrice: 'От',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Частые вопросы.',
    items: [
      {
        q: 'Как смешивать?',
        a: 'Три мерные ложки пудры (40 г) на четыре с половиной ложки воды, стаканчиком из упаковки. Пудра 1 к воде 1,5. Размешай до гладкого крема и нанеси, пока не начала схватываться.',
      },
      {
        q: 'Сколько процедур в банке?',
        a: 'Около семи. Каждая смесь — 40 г, банка — 300 г. Мерная ложка в упаковке.',
      },
      {
        q: 'Смывать?',
        a: 'Нет. Сними одним пластом через пятнадцать-двадцать минут, остаток сотри тоником.',
      },
      {
        q: 'Можно мешать с тоником или ампулой?',
        a: 'В инструкции — вода. Другие жидкости меняют схватку, а время коагуляции в сертификате измерено на водной смеси.',
      },
      {
        q: 'Что за шесть пептидов на лицевой стороне?',
        a: 'Шесть sh-пептидов из формулы: sh-Oligopeptide-1 и -2, sh-Polypeptide-1, -3, -9 и -22. Их уровень лабораторный. Маска, которую чувствуешь, — это схватка земли и альгина, которая держит влагу и снимается одним пластом.',
      },
      {
        q: 'Чем это отличается от Hydro Cool?',
        a: 'Hydro Cool — клинический килограмм, когда нужно охлаждение до снятия маски. Это увлажняющая моделирующая маска на 300 г, которая не сохнет — для кабинета или дома.',
      },
      {
        q: 'Она без отдушки?',
        a: 'Нет. Кипарисовая вода стоит в формуле как ароматический ингредиент, плюс ментол. Если избегаешь обоих — это не та маска.',
      },
      {
        q: 'Как хранить?',
        a: 'В прохладе и сухости, крышка плотно. Открытая пудра берёт влагу и свет и в следующий раз схватится иначе. После вскрытия — шесть месяцев.',
      },
    ],
  },
  details: {
    eyebrow: 'Спецификация',
    title: 'Подробности.',
    rows: [
      { label: 'Формат', value: 'Пудровая моделирующая маска, смешивается с водой' },
      { label: 'Нетто', value: '300 г / 10,58 унции' },
      { label: 'Смесь', value: 'Пудра 1 : вода 1,5 · 40 г пудры на процедуру' },
      { label: 'Схватка', value: 'Коагуляция за 5–10 минут' },
      { label: 'Выдержка', value: '15–20 минут, затем снять' },
      { label: 'Когда', value: 'Раз или два в неделю' },
      { label: 'Вид', value: 'Белая пудра, жёлтая в цветовом тесте' },
      { label: 'После вскрытия', value: 'Шесть месяцев, крышка плотно, прохлада и сухость' },
      { label: 'Тесты', value: 'Дерматологически протестировано' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Смешай свежую. Сними целиком.',
    body: 'Сорок граммов пудры, вода, двадцать минут — и кожа, которая напилась.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const COPY: Record<BioFermentLocale, BioFermentCopy> = { en: EN, ar: AR, ru: RU }

export function getBioFermentCopy(locale: string): BioFermentCopy {
  if (locale === 'ar' || locale === 'ru') return COPY[locale]
  return COPY.en
}
