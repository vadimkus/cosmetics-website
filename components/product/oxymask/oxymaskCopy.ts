/**
 * Bespoke copy for EGF REPAIR OXYMASK CREAM (product 26).
 *
 * SOURCING — every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_26_OXYMASK_SOURCE_AUDIT.md:
 *   - DTS MG signed formula: methyl perfluoroisobutyl ether 5.000%, glycerin
 *     3.996%, diglycerin 3.000%, dipropylene glycol 2.998%, decyl glucoside
 *     2.750%, 1,2-hexanediol 2.020%, hydrogenated polyisobutene 2.000%, C14-22
 *     alcohols 1.193%, shea butter 1.000%, jojoba 1.000%, tocopheryl acetate
 *     0.100%, sodium hyaluronate 0.050%, allantoin 0.050%, adenosine 0.040%,
 *     eucalyptus oil 0.0184%, salmon oil 0.0100%, limonene 0.0016%, Sepitonic M3
 *     minerals ~0.001% combined, madecassoside 0.0001%, phenoxyethanol 0.0001%,
 *     sh-oligopeptide-1 0.00001%, copper tripeptide-1 0.0000050%.
 *   - EU safety assessment E3 20 06 01815: "safe for human health" with no
 *     restrictions; patch test Non Irritant (QACS); SEPITONIC M3 mapped to
 *     magnesium aspartate + zinc gluconate + copper gluconate + phenoxyethanol
 *     (SEPPIC S.A.); salmon oil raw material "Bouncell" at 100%.
 *   - COA lot WML112: white cream, pH 6.18, 50.28 g, adenosine identity PASS and
 *     assay 0.043%, bacteria and molds both under 10 cfu/ml, 3-year life.
 *   - Registered carton: Korean [주름개선 기능성화장품] (wrinkle, single function),
 *     main ingredient adenosine, and the Korean panel PRINTS "(0.1ppm)" beside
 *     sh-Oligopeptide-1. Usage: dry skin, do not rub, 3-5 pumps, do not rinse.
 *     Avoid pregnancy and lactation. Do not use near eyes. Avoid broken skin.
 *   - DTS MG homecare deck: a CLINICAL TRIAL DATA page titled "Clinical study on
 *     skin soothing effect against external stimulus (physical stimulus)", with
 *     NO extractable result figure, plus the comparison against product 25.
 *
 * THE CARTON DECLARES THE TRACE DOSE ITSELF. The Korean panel prints "(0.1ppm)"
 * next to the EGF. No other GENOSYS carton audited this week does that. So saying
 * 0.1 ppm on this page matches the box rather than contradicting the marketing,
 * and it is worth presenting as the trust signal it is.
 *
 * THE ENGINE IS THE PERFLUOROCARBON. Methyl perfluoroisobutyl ether at 5% is the
 * second ingredient after water and the reason it bubbles; decyl glucoside at
 * 2.75% is why it can foam at all. Neither was in our key-ingredient list.
 *
 * THE USAGE RULES ARE FUNCTIONAL, NOT DECORATIVE. Dry skin, do not rub, do not
 * rinse. On a product that works by foaming, getting this wrong means it does not
 * work. It was missing from our site entirely.
 *
 * ON THE CLINICAL STUDY: the deck names it and shows no number. Say exactly that.
 * Do not imply a result, and do not call it unsupported either.
 *
 * MUST STAY OUT:
 *   - Every EGF mechanism in the deck: keratinocyte proliferation, wound healing,
 *     "EGF attracts cells to the wound site". At 0.1 ppm, and they are drug claims.
 *   - Any regeneration story from madecassoside (1 ppm) or copper tripeptide-1
 *     (0.05 ppm).
 *   - The deck's "oxygen improves cellular metabolism, accelerates the healing
 *     process, produces an anti-inflammatory effect".
 *   - That sh-oligopeptide-1 is a recombinant human peptide from E. coli.
 *   - Eucalyptol toxicology. Internal note only.
 *   - The contract manufacturer, and the lot codes.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface OxymaskCopy {
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
  outOfStock: string
  vatIncluded: string
  freeDelivery: string

  stats: Array<{ value: string; label: string }>

  rules: {
    eyebrow: string
    title: string
    body: string
    items: Array<{ do: string; body: string }>
  }

  engine: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  carton: {
    eyebrow: string
    title: string
    body: string
    rows: Array<{ name: string; value: string; note: string; real?: boolean }>
    footer: string
  }

  study: {
    eyebrow: string
    title: string
    body: string
  }

  versus: {
    eyebrow: string
    title: string
    intro: string
    columns: { post: string; oxy: string }
    postBody: string
    oxyBody: string
    body: string
  }

  quality: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    patch: string
  }

  fragrance: {
    eyebrow: string
    title: string
    body: string
  }

  inci: {
    eyebrow: string
    title: string
    intro: string
    fullInci: string
    fullInciNote: string
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

const EN: OxymaskCopy = {
  eyebrow: 'EGF Repair Oxymask Cream · 50 g',
  headline: 'The bubbles are a perfluorocarbon, not the EGF.',
  subheadline:
    'Methyl perfluoroisobutyl ether at 5% is the second ingredient after water, and it is what carries the oxygen and makes this foam on your face. A mild sugar surfactant at 2.75% is what lets it foam at all. The EGF the product is named after sits at 0.1 parts per million — and unusually, the box says so itself.',
  heroBullets: [
    'Apply to DRY skin and do not rub — the foaming is the point',
    'Do not rinse it off, despite the name',
    'Adenosine 0.04%, measured at 0.043% — the licensed wrinkle dose',
    'Contains salmon oil, so not vegan. Not for use in pregnancy',
  ],
  badges: ['Made in Korea', '50 g', 'EU safety assessed', 'Graded Non Irritant'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '5%', label: 'Perfluorocarbon — the oxygen carrier' },
    { value: '2.75%', label: 'Sugar surfactant — why it foams' },
    { value: '0.043%', label: 'Adenosine, measured against 0.04% declared' },
    { value: '0.1 ppm', label: 'The EGF, as printed on the carton' },
  ],

  rules: {
    eyebrow: 'Read this before the first use',
    title: 'Dry skin. Do not rub. Do not rinse.',
    body:
      'Most creams are forgiving about how you apply them. This one is not, because the whole thing is a foaming reaction. Get these four wrong and it will simply sit there. They are printed on the carton and were missing from this page until now.',
    items: [
      {
        do: 'Onto dry skin',
        body: 'Not damp, not over a serum that is still wet. Water on the skin dilutes the reaction before it starts.',
      },
      {
        do: 'Three to five pumps, spread, then leave it',
        body: 'The Korean panel specifies three to five pumps. Spread it evenly and stop touching it. Rubbing is what kills the bubbles.',
      },
      {
        do: 'Wait for the bubbles, then tap',
        body: 'Give it a moment until the foam covers the face. Once the bubbles start popping, massage gently and tap it in.',
      },
      {
        do: 'Do not rinse',
        body: 'It is called a mask and it behaves like one for a few minutes, but it is a leave-on cream. Nothing comes off afterwards.',
      },
    ],
  },

  engine: {
    eyebrow: 'What is actually happening',
    title: 'The two ingredients nobody mentions',
    intro:
      'Our own description named six key ingredients and neither of the two that make this product what it is appeared among them. Here they are.',
    items: [
      {
        name: 'Methyl perfluoroisobutyl ether',
        dose: '5.000%',
        body: 'The second ingredient after water. A perfluorocarbon — the family of fluids that can dissolve and release far more oxygen than water can. This is the oxygen in "oxymask", and at 5% it is by far the largest active in the formula.',
      },
      {
        name: 'Decyl glucoside',
        dose: '2.750%',
        body: 'A mild surfactant made from coconut and corn sugar. Without a surfactant nothing foams, so this is what turns the released gas into a blanket of bubbles rather than nothing at all. It is also the reason the texture behaves unlike any other cream we sell.',
      },
      {
        name: 'Glycerin, diglycerin and dipropylene glycol',
        dose: '~10% combined',
        body: 'The humectant base, which is why a cream this active still leaves skin comfortable rather than tight.',
      },
      {
        name: 'Shea butter and jojoba oil',
        dose: '1.000% each',
        body: 'The lipid half. Modest, real, and enough to stop a formula with 2.75% surfactant in it from feeling stripping.',
      },
      {
        name: 'Adenosine',
        dose: '0.040%',
        body: 'The dose Korea licenses for wrinkle improvement, and the reason this is a functional cosmetic at all. Measured on the batch at 0.043%, and the certificate also runs a separate identity check against a reference chromatogram.',
      },
      {
        name: 'Sodium hyaluronate, allantoin and vitamin E',
        dose: '0.050 / 0.050 / 0.100%',
        body: '500, 500 and 1,000 parts per million. Supporting, real, and honestly described rather than made into the headline.',
      },
    ],
  },

  carton: {
    eyebrow: 'Credit where it is due',
    title: 'The box prints the trace dose itself',
    body:
      'The Korean ingredient list on this carton reads "sh-Oligopeptide-1 (0.1ppm)". The manufacturer put the concentration on the pack, beside the ingredient the product is named after. That is rare, and it is the right thing to do — so here is the full set of named ingredients at the concentrations they are actually present in.',
    rows: [
      { name: 'sh-Oligopeptide-1 (EGF)', value: '0.1 ppm', note: 'Printed on the carton with its dose' },
      { name: 'Madecassoside', value: '1 ppm', note: 'Two hundred times lower than in our Soothing Repair Postcream' },
      { name: 'Copper Tripeptide-1', value: '0.05 ppm', note: 'Fifty parts per billion' },
      { name: 'Sepitonic M3 minerals', value: '~10 ppm', note: 'Magnesium aspartate, zinc gluconate, copper gluconate' },
      { name: 'Salmon oil', value: '100 ppm', note: 'Enough to make the product non-vegan' },
      { name: 'Adenosine', value: '0.040%', note: 'The licensed active, measured at 0.043%', real: true },
    ],
    footer:
      'One useful consequence of reading the mineral complex properly: the phenoxyethanol on the ingredient list is at 1 part per million and arrives inside Sepitonic M3 as a carryover. It is not there as a preservative. What actually preserves this cream is 1,2-hexanediol at 2% with ethylhexylglycerin.',
  },

  study: {
    eyebrow: 'What we can and cannot tell you',
    title: 'There is a clinical study, and we do not have its number',
    body:
      'The manufacturer\u2019s clinical documentation contains a page titled "Clinical study on skin soothing effect against external stimulus (physical stimulus)", placed with this product. So the study is real and it is about exactly what our description used to claim. But unlike the other products in the same document — where we can quote figures such as 12% and 17% — this page presents its result as a chart with no readable value. So we can tell you the study was done and we cannot tell you what it found, which is not the same as either proof or nothing. We have asked for the report.',
  },

  versus: {
    eyebrow: 'Which of the two you want',
    title: 'This or the Soothing Repair Postcream',
    intro:
      'The manufacturer draws the line between these two itself, and it is a sensible one, so we will use theirs rather than invent a distinction.',
    columns: { post: 'Soothing Repair Postcream', oxy: 'EGF Repair Oxymask Cream' },
    postBody:
      'Intensive repair for about a week, immediately after a professional treatment. A plain, unfoaming, unscented cream with nothing in it to react with what was just done to your skin.',
    oxyBody:
      'The daily one, for skin stressed by everything else. The manufacturer calls it an S.O.S cream. It foams, it is scented with eucalyptus, and it carries the licensed wrinkle dose the postcream does not.',
    body:
      'In practice: straight after needling or a laser, reach for the postcream. For dull, tired, generally-had-enough skin on an ordinary week, this is the one. They are not competing products and the difference is not strength — it is whether you want an active, scented, foaming cream on skin that has just been through something, and the answer to that is no.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea, released against a written specification, and assessed under European cosmetics law with a clean conclusion and no restrictions attached.',
    rows: [
      { label: 'Appearance', value: 'White cream' },
      { label: 'pH', value: '6.18 at 25 °C, inside a 5.10–7.10 specification' },
      { label: 'Fill', value: '50.28 g against a 50 g declaration' },
      { label: 'Stability', value: 'Passed at 50 °C' },
      { label: 'Adenosine identity', value: 'Chromatogram matched against a reference standard — pass' },
      { label: 'Adenosine assay', value: '0.043% against 0.040% declared, on a >90% specification' },
      { label: 'Purity', value: 'Bacteria and molds both under 10 cfu/ml, against a permitted 100' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'Licence', value: 'Korean single-function: wrinkle improvement, via adenosine' },
    ],
    patch:
      'The patch test came back graded Non Irritant rather than simply passing, and the assessment concludes the product is safe for human health without the "with restrictions" qualifier several other products in the range carry. The assessor notes the volunteer count is not statistically significant, so read it as reassurance about the formula rather than proof about your skin.',
  },

  fragrance: {
    eyebrow: 'If you screen your ingredients',
    title: 'Eucalyptus, salmon oil, and no perfume',
    body:
      'There is no fragrance compound in this formula, but there is eucalyptus globulus leaf oil at 0.0184%, which brings limonene at 0.0016% — declared, because European law requires it above 0.001%. That gives the cream a real, noticeable eucalyptus smell, and it is another reason the carton tells you not to use it near the eyes. It also contains salmon oil at 100 parts per million, so it is not vegan and not suitable if you avoid fish-derived ingredients. And it should not be used during pregnancy or breastfeeding — that instruction is on the box.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the bottle',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the carton in your hand.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Do not use during pregnancy or breastfeeding — this instruction is printed on the carton.',
      'Contains salmon oil, so it is not vegan and not suitable if you avoid fish-derived ingredients.',
      'Contains eucalyptus oil with limonene declared. Patch test if you react to essential oils.',
      'For external use only. Do not use near the eyes, and rinse thoroughly with cool water on contact.',
      'Do not use on wounded or broken skin.',
      'Stop and see a doctor if redness, swelling or irritation appears.',
      'Assessed as safe for human health under EC Regulation 1223/2009 and graded Non Irritant on patch test.',
      'Store cool and dry, out of direct sunlight and out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton, including the Korean panel.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '50 g, pump' },
      { label: 'Texture', value: 'White cream that foams on contact with skin' },
      { label: 'The oxygen', value: 'Methyl perfluoroisobutyl ether 5.000%' },
      { label: 'The foam', value: 'Decyl glucoside 2.750%' },
      { label: 'Humectants', value: 'Glycerin, diglycerin and dipropylene glycol, ~10% combined' },
      { label: 'Lipids', value: 'Shea butter 1.000%, jojoba seed oil 1.000%' },
      { label: 'Licensed active', value: 'Adenosine 0.040%, assayed at 0.043%' },
      { label: 'EGF', value: 'sh-Oligopeptide-1 at 0.1 ppm — the carton prints the dose' },
      { label: 'Preservation', value: '1,2-hexanediol 2% with ethylhexylglycerin. The 1 ppm phenoxyethanol is a carryover' },
      { label: 'Fragrance', value: 'No perfume, but eucalyptus oil 0.0184% with limonene declared' },
      { label: 'Not vegan', value: 'Contains salmon oil 100 ppm' },
      { label: 'pH', value: '5.10–7.10 (6.18 on the batch tested)' },
      { label: 'Not for', value: 'Pregnancy or breastfeeding, the eye area, or broken skin' },
      { label: 'Assessment', value: 'EU safety assessment; patch test graded Non Irritant' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Why is it not bubbling?',
        a: 'Almost always one of two things: you applied it to damp skin, or you rubbed it in. It needs dry skin and it needs to be left alone for a moment after spreading. The carton is specific about both, and it is the one product we sell where technique changes whether it works.',
      },
      {
        q: 'What makes the bubbles?',
        a: 'Methyl perfluoroisobutyl ether at 5%, a perfluorocarbon that holds far more oxygen than water can and releases it on the skin, plus decyl glucoside at 2.75%, a mild sugar surfactant that turns that gas into foam. Those two are the product. Our old description credited the effect to EGF, which is present at 0.1 parts per million.',
      },
      {
        q: 'So is the EGF doing anything?',
        a: 'At 0.1 parts per million, we are not going to claim it is. What we will say is that the manufacturer prints "(0.1ppm)" next to it on the box, which is more honest than most brands manage, and we would rather repeat that than talk around it. Buy this for the foaming oxygen delivery, the adenosine at a measured 0.043%, and the shea and jojoba.',
      },
      {
        q: 'Do I rinse it off? It says mask.',
        a: 'No. It behaves like a mask for a few minutes while it foams, then you massage it in and leave it. The carton says "do not rinse off" and means it. Morning and evening.',
      },
      {
        q: 'Is it vegan, and does it smell of anything?',
        a: 'Not vegan — it contains salmon oil at 100 parts per million. And yes, it smells distinctly of eucalyptus, from eucalyptus globulus leaf oil at 0.0184% with limonene declared. There is no perfume compound in it, but "no perfume" and "no smell" are not the same thing.',
      },
      {
        q: 'How is this different from the Soothing Repair Postcream?',
        a: 'The manufacturer draws the line itself: the postcream is intensive repair for about a week straight after a professional treatment, and this is the daily one for skin stressed by everything else. Practically, this cream foams, is scented and carries an active licence, none of which you want on skin that has just been needled. Use the postcream first, this one afterwards.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: OxymaskCopy = {
  eyebrow: 'كريم أوكسي ماسك للترميم بعامل النمو · 50 غ',
  headline: 'الفقاعات مركّب فلوري، لا عامل النمو.',
  subheadline:
    'ميثيل بيرفلورو أيزوبيوتيل إيثر بنسبة 5% هو المكوّن الثاني بعد الماء، وهو ما يحمل الأوكسجين ويجعل هذا يرتغي على وجهك. ومادة خافضة للتوتر السطحي لطيفة من السكر بنسبة 2.75% هي ما يتيح له الارتغاء أصلاً. أما عامل النمو الذي سُمّي المنتج به فيجلس عند 0.1 جزء من المليون — وبصورة غير معتادة، تقول العلبة ذلك بنفسها.',
  heroBullets: [
    'يُطبَّق على بشرة جافة ولا يُفرك — فالارتغاء هو المقصود',
    'لا يُشطَف، على الرغم من الاسم',
    'أدينوزين 0.04%، مقيس عند 0.043% — جرعة التجاعيد المرخّصة',
    'يحتوي زيت السلمون، فهو ليس نباتياً. ولا يُستخدم في الحمل',
  ],
  badges: ['صُنع في كوريا', '50 غ', 'تقييم سلامة أوروبي', 'مصنّف غير مهيّج'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '5%', label: 'مركّب فلوري — حامل الأوكسجين' },
    { value: '2.75%', label: 'خافض توتر سكري — سبب الارتغاء' },
    { value: '0.043%', label: 'أدينوزين، مقيس مقابل 0.04% معلنة' },
    { value: '0.1 ppm', label: 'عامل النمو، كما هو مطبوع على العلبة' },
  ],

  rules: {
    eyebrow: 'اقرئي هذا قبل أول استخدام',
    title: 'بشرة جافة. لا فرك. لا شطف.',
    body:
      'معظم الكريمات متسامحة بشأن طريقة التطبيق. وهذا ليس كذلك، لأن الأمر كلّه تفاعل ارتغاء. أخطئي في هذه الأربعة وسيبقى جالساً بلا فعل. وهي مطبوعة على العلبة وكانت غائبة عن هذه الصفحة حتى الآن.',
    items: [
      {
        do: 'على بشرة جافة',
        body: 'ليست رطبة، ولا فوق سيروم لم يجفّ بعد. فالماء على البشرة يخفّف التفاعل قبل أن يبدأ.',
      },
      {
        do: 'ثلاث إلى خمس ضغطات، افرديه، ثم اتركيه',
        body: 'تحدّد اللوحة الكورية ثلاث إلى خمس ضغطات. افرديه بالتساوي وتوقّفي عن ملامسته. فالفرك هو ما يقتل الفقاعات.',
      },
      {
        do: 'انتظري الفقاعات، ثم انقري',
        body: 'امنحيه لحظة حتى تغطّي الرغوة الوجه. وعندما تبدأ الفقاعات بالانفجار، دلّكي بلطف وانقري لإدخاله.',
      },
      {
        do: 'لا تشطفي',
        body: 'يُسمّى قناعاً ويتصرّف كقناع لدقائق، لكنه كريم يُترك على البشرة. ولا شيء يُزال بعده.',
      },
    ],
  },

  engine: {
    eyebrow: 'ما يحدث فعلاً',
    title: 'المكوّنان اللذان لا يذكرهما أحد',
    intro:
      'كان وصفنا نفسه يسمّي ستة مكوّنات رئيسية، ولم يظهر بينها أيٌّ من الاثنين اللذين يجعلان هذا المنتج ما هو عليه. فها هما.',
    items: [
      {
        name: 'Methyl Perfluoroisobutyl Ether',
        dose: '5.000%',
        body: 'المكوّن الثاني بعد الماء. مركّب فلوري — من عائلة السوائل التي تستطيع إذابة الأوكسجين وإطلاقه بأكثر بكثير مما يستطيع الماء. وهذا هو أوكسجين «الأوكسي ماسك»، وعند 5% فهو أكبر فعّال في التركيبة بفارق كبير.',
      },
      {
        name: 'Decyl Glucoside',
        dose: '2.750%',
        body: 'خافض توتر سطحي لطيف مصنوع من جوز الهند وسكر الذرة. فبلا خافض توتر لا يرتغي شيء، فهذا ما يحوّل الغاز المُطلَق إلى غطاء من الفقاعات لا إلى لا شيء. وهو أيضاً سبب تصرّف الملمس بخلاف أي كريم آخر نبيعه.',
      },
      {
        name: 'الغليسرين والدايغليسرين والدايبروبيلين غلايكول',
        dose: '~10% مجتمعةً',
        body: 'قاعدة المرطّبات الجاذبة، ولهذا يظل كريم بهذه النشاطية مريحاً للبشرة لا مشدوداً.',
      },
      {
        name: 'زبدة الشيا وزيت الجوجوبا',
        dose: '1.000% لكل منهما',
        body: 'النصف الدهني. متواضع وحقيقي ويكفي لمنع تركيبة فيها 2.75% خافض توتر من أن تبدو مجفّفة.',
      },
      {
        name: 'Adenosine',
        dose: '0.040%',
        body: 'الجرعة التي ترخّصها كوريا لتحسين التجاعيد، وسبب كون هذا مستحضراً وظيفياً أصلاً. مقيسة على الدفعة عند 0.043%، وتُجري الشهادة أيضاً فحص هوية منفصلاً مقابل كروماتوغرام مرجعي.',
      },
      {
        name: 'صوديوم هيالورونات وألانتوين وفيتامين E',
        dose: '0.050 / 0.050 / 0.100%',
        body: '500 و500 و1000 جزء من المليون. مساندة وحقيقية وموصوفة بصدق لا مصنوعة عنواناً.',
      },
    ],
  },

  carton: {
    eyebrow: 'الفضل لأهله',
    title: 'العلبة تطبع الجرعة الأثرية بنفسها',
    body:
      'قائمة المكوّنات الكورية على هذه العلبة تقول «sh-Oligopeptide-1 (0.1ppm)». فقد وضعت الشركة التركيز على العبوة، بجوار المكوّن الذي سُمّي المنتج به. وهذا نادر وهو الصواب — فها هي المجموعة الكاملة للمكوّنات المذكورة بالتراكيز الموجودة بها فعلاً.',
    rows: [
      { name: 'sh-Oligopeptide-1 (عامل النمو)', value: '0.1 ppm', note: 'مطبوع على العلبة بجرعته' },
      { name: 'Madecassoside', value: '1 ppm', note: 'أقل مئتَي مرة من كريم ما بعد الجلسات المهدّئ لدينا' },
      { name: 'Copper Tripeptide-1', value: '0.05 ppm', note: 'خمسون جزءاً من المليار' },
      { name: 'معادن Sepitonic M3', value: '~10 ppm', note: 'أسبارتات المغنيسيوم، غلوكونات الزنك، غلوكونات النحاس' },
      { name: 'زيت السلمون', value: '100 ppm', note: 'ما يكفي لجعل المنتج غير نباتي' },
      { name: 'Adenosine', value: '0.040%', note: 'الفعّال المرخّص، مقيس عند 0.043%', real: true },
    ],
    footer:
      'ومن نتائج قراءة مركّب المعادن قراءةً صحيحة: أن الفينوكسي إيثانول على قائمة المكوّنات موجود بجزء واحد من المليون ويأتي داخل Sepitonic M3 كترحيل. فهو ليس موجوداً كحافظ. أما ما يحفظ هذا الكريم فعلاً فهو 1,2-هكسانديول بنسبة 2% مع الإيثيل هكسيل غليسرين.',
  },

  study: {
    eyebrow: 'ما يمكننا وما لا يمكننا إخبارك به',
    title: 'هناك دراسة سريرية، ولا نملك رقمها',
    body:
      'تحتوي وثائق الشركة السريرية صفحة بعنوان «دراسة سريرية على أثر تهدئة البشرة ضد المنبّه الخارجي (المنبّه الفيزيائي)»، موضوعة مع هذا المنتج. فالدراسة حقيقية وهي عن الشيء نفسه الذي كان وصفنا يزعمه. لكن بخلاف المنتجات الأخرى في الوثيقة نفسها — حيث نستطيع نقل أرقام كـ 12% و17% — تعرض هذه الصفحة نتيجتها كمخطّط بلا قيمة مقروءة. فنستطيع إخبارك بأن الدراسة أُجريت ولا نستطيع إخبارك بما وجدته، وهذا ليس برهاناً ولا لا شيء. وقد طلبنا التقرير.',
  },

  versus: {
    eyebrow: 'أيّهما تريدين من الاثنين',
    title: 'هذا أم كريم ما بعد الجلسات المهدّئ',
    intro:
      'ترسم الشركة الحدّ بين هذين بنفسها، وهو حدّ معقول، فسنستخدم حدّها لا أن نخترع تمييزاً.',
    columns: { post: 'كريم ما بعد الجلسات المهدّئ', oxy: 'كريم أوكسي ماسك للترميم' },
    postBody:
      'ترميم مكثّف لنحو أسبوع، مباشرةً بعد جلسة احترافية. كريم بسيط غير مرتغٍ وغير معطّر ولا شيء فيه يتفاعل مع ما فُعل ببشرتك للتوّ.',
    oxyBody:
      'اليومي، للبشرة المجهدة بكل شيء آخر. وتسمّيه الشركة كريم إنقاذ. يرتغي، ومعطّر باليوكاليبتوس، ويحمل جرعة التجاعيد المرخّصة التي لا يحملها كريم ما بعد الجلسات.',
    body:
      'عملياً: بعد الإبر الدقيقة أو الليزر مباشرةً، امتدّي إلى كريم ما بعد الجلسات. وللبشرة الباهتة المتعبة التي «سئمت» في أسبوع عادي، فهذا هو المناسب. وهما ليسا منتجين متنافسين والفارق ليس القوة — بل هل تريدين كريماً فعّالاً معطّراً مرتغياً على بشرة خرجت لتوّها من شيء، والجواب لا.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما تقوله الشهادة',
    intro:
      'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة، وقُيّم وفق قانون مستحضرات التجميل الأوروبي بخلاصة نظيفة بلا قيود مرفقة.',
    rows: [
      { label: 'المظهر', value: 'كريم أبيض' },
      { label: 'الحموضة', value: '6.18 عند 25 درجة، ضمن مواصفة 5.10–7.10' },
      { label: 'التعبئة', value: '50.28 غ مقابل 50 غ معلنة' },
      { label: 'الثبات', value: 'ناجح عند 50 درجة' },
      { label: 'هوية الأدينوزين', value: 'كروماتوغرام مطابَق مقابل معيار مرجعي — ناجح' },
      { label: 'قياس الأدينوزين', value: '0.043% مقابل 0.040% معلنة، على مواصفة أكبر من 90%' },
      { label: 'النقاء', value: 'البكتيريا والعفن كلاهما أقل من 10 وحدات/مل، مقابل 100 مسموحة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات مغلقاً، وتاريخ الانتهاء على العلبة' },
      { label: 'الترخيص', value: 'مفرد الوظيفة الكوري: تحسين التجاعيد، عبر الأدينوزين' },
    ],
    patch:
      'عاد اختبار اللصقة مصنّفاً «غير مهيّج» لا مجرّد ناجح، ويخلص التقييم إلى أن المنتج آمن لصحة الإنسان بلا قيد «مع قيود» الذي تحمله عدة منتجات أخرى في المجموعة. ويلاحظ المقيّم أن عدد المتطوّعين ليس ذا دلالة إحصائية، فاقرئيها كطمأنة بشأن التركيبة لا كبرهان بشأن بشرتك.',
  },

  fragrance: {
    eyebrow: 'إن كنتِ تفحصين المكوّنات',
    title: 'يوكاليبتوس وزيت سلمون وبلا عطر',
    body:
      'لا مركّب عطري في هذه التركيبة، لكن فيها زيت ورق اليوكاليبتوس بنسبة 0.0184%، وهو يجلب الليمونين بنسبة 0.0016% — معلناً، لأن القانون الأوروبي يوجب ذلك فوق 0.001%. وهذا يعطي الكريم رائحة يوكاليبتوس حقيقية ملحوظة، وهو سبب آخر لقول العلبة ألّا يُستخدم قرب العينين. ويحتوي أيضاً زيت السلمون بمئة جزء من المليون، فهو ليس نباتياً وغير مناسب إن كنتِ تتجنّبين المكوّنات المشتقّة من الأسماك. ولا يُستخدم أثناء الحمل أو الإرضاع — وهذه التعليمة على العلبة.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في العبوة',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'لا يُستخدم أثناء الحمل أو الإرضاع — وهذه التعليمة مطبوعة على العلبة.',
      'يحتوي زيت السلمون، فهو ليس نباتياً وغير مناسب إن كنتِ تتجنّبين المكوّنات المشتقّة من الأسماك.',
      'يحتوي زيت اليوكاليبتوس مع ليمونين معلن. اختبريه على بقعة إن كنتِ تتفاعلين مع الزيوت العطرية.',
      'للاستعمال الخارجي فقط. لا يُستخدم قرب العينين، واشطفي جيداً بالماء البارد عند الملامسة.',
      'لا يُستخدم على بشرة مجروحة أو مفتوحة.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'قُيّم آمناً لصحة الإنسان وفق اللائحة EC 1223/2009 وصُنّف «غير مهيّج» في اختبار اللصقة.',
      'يُحفظ بارداً وجافاً بعيداً عن أشعة الشمس المباشرة ومتناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، بما فيها اللوحة الكورية.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '50 غ، بمضخّة' },
      { label: 'الملمس', value: 'كريم أبيض يرتغي عند ملامسة البشرة' },
      { label: 'الأوكسجين', value: 'ميثيل بيرفلورو أيزوبيوتيل إيثر 5.000%' },
      { label: 'الرغوة', value: 'دايسيل غلوكوسايد 2.750%' },
      { label: 'المرطّبات الجاذبة', value: 'غليسرين ودايغليسرين ودايبروبيلين غلايكول، ~10% مجتمعةً' },
      { label: 'الدهون', value: 'زبدة شيا 1.000%، زيت جوجوبا 1.000%' },
      { label: 'الفعّال المرخّص', value: 'أدينوزين 0.040%، مقيس عند 0.043%' },
      { label: 'عامل النمو', value: 'sh-Oligopeptide-1 عند 0.1 جزء من المليون — والعلبة تطبع الجرعة' },
      { label: 'الحفظ', value: '1,2-هكسانديول 2% مع إيثيل هكسيل غليسرين. والفينوكسي إيثانول بجزء من المليون ترحيل' },
      { label: 'العطر', value: 'لا عطر، لكن زيت يوكاليبتوس 0.0184% مع ليمونين معلن' },
      { label: 'ليس نباتياً', value: 'يحتوي زيت السلمون بمئة جزء من المليون' },
      { label: 'الحموضة', value: '5.10–7.10 (6.18 على الدفعة المختبرة)' },
      { label: 'لا يُستخدم في', value: 'الحمل أو الإرضاع، ومحيط العين، والبشرة المجروحة' },
      { label: 'التقييم', value: 'تقييم سلامة أوروبي؛ اختبار لصقة مصنّف غير مهيّج' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'لماذا لا يرتغي؟',
        a: 'في الغالب أحد أمرين: طبّقتِه على بشرة رطبة، أو فركتِه. فهو يحتاج بشرة جافة ويحتاج أن يُترك لحظة بعد الفرد. والعلبة محدّدة في الأمرين، وهو المنتج الوحيد الذي نبيعه حيث تُغيّر التقنية ما إن كان يعمل.',
      },
      {
        q: 'ما الذي يصنع الفقاعات؟',
        a: 'ميثيل بيرفلورو أيزوبيوتيل إيثر بنسبة 5%، وهو مركّب فلوري يحمل أوكسجيناً أكثر بكثير مما يستطيع الماء ويطلقه على البشرة، إضافة إلى دايسيل غلوكوسايد بنسبة 2.75%، وهو خافض توتر سكري لطيف يحوّل ذلك الغاز إلى رغوة. وهذان هما المنتج. أما وصفنا القديم فنسب الأثر إلى عامل النمو، الموجود بـ 0.1 جزء من المليون.',
      },
      {
        q: 'فهل يفعل عامل النمو شيئاً؟',
        a: 'عند 0.1 جزء من المليون، لن نزعم أنه يفعل. وما سنقوله إن الشركة تطبع «(0.1ppm)» بجواره على العلبة، وهذا أصدق مما تبلغه معظم العلامات، ونفضّل تكراره على الدوران حوله. اشتري هذا من أجل إيصال الأوكسجين بالرغوة، والأدينوزين عند 0.043% مقيسة، والشيا والجوجوبا.',
      },
      {
        q: 'هل أشطفه؟ فهو مكتوب قناع.',
        a: 'لا. يتصرّف كقناع لدقائق أثناء ارتغائه، ثم تدلّكينه وتتركينه. تقول العلبة «لا يُشطَف» وتعني ذلك. صباحاً ومساءً.',
      },
      {
        q: 'هل هو نباتي، وهل له رائحة؟',
        a: 'ليس نباتياً — فهو يحتوي زيت السلمون بمئة جزء من المليون. ونعم، رائحته يوكاليبتوس واضحة، من زيت ورق اليوكاليبتوس بنسبة 0.0184% مع ليمونين معلن. ولا مركّب عطري فيه، لكن «بلا عطر» و«بلا رائحة» ليسا الشيء نفسه.',
      },
      {
        q: 'كيف يختلف عن كريم ما بعد الجلسات المهدّئ؟',
        a: 'ترسم الشركة الحدّ بنفسها: فكريم ما بعد الجلسات ترميم مكثّف لنحو أسبوع بعد جلسة احترافية مباشرةً، وهذا هو اليومي للبشرة المجهدة بكل شيء آخر. وعملياً، هذا الكريم يرتغي ومعطّر ويحمل ترخيصاً فعّالاً، ولا شيء من ذلك تريدينه على بشرة خرجت لتوّها من الإبر. استخدمي كريم ما بعد الجلسات أولاً، وهذا بعده.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: OxymaskCopy = {
  eyebrow: 'EGF Repair Oxymask Cream · 50 г',
  headline: 'Пузырьки делает перфторуглерод, а не EGF.',
  subheadline:
    'Метил перфторизобутиловый эфир 5% — второй ингредиент после воды, и именно он несёт кислород и заставляет средство пениться на лице. А мягкий сахарный сурфактант 2,75% — то, что вообще позволяет ему пениться. EGF, по которому назван продукт, присутствует в концентрации 0,1 части на миллион — и, что необычно, коробка сама об этом пишет.',
  heroBullets: [
    'Наносить на СУХУЮ кожу и не растирать — вспенивание и есть смысл',
    'Не смывать, несмотря на название',
    'Аденозин 0,04%, измерено 0,043% — лицензионная доза для морщин',
    'Содержит масло лосося, поэтому не веганский. Не применять при беременности',
  ],
  badges: ['Сделано в Корее', '50 г', 'Оценка безопасности ЕС', 'Оценка: не раздражает'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '5%', label: 'Перфторуглерод — носитель кислорода' },
    { value: '2,75%', label: 'Сахарный сурфактант — причина пены' },
    { value: '0,043%', label: 'Аденозин, измерено против заявленных 0,04%' },
    { value: '0,1 ppm', label: 'EGF, как напечатано на коробке' },
  ],

  rules: {
    eyebrow: 'Прочтите перед первым применением',
    title: 'Сухая кожа. Не растирать. Не смывать.',
    body:
      'Большинство кремов нетребовательны к тому, как их наносят. Этот — нет, потому что всё в нём построено на реакции вспенивания. Ошибитесь в этих четырёх пунктах, и он просто будет лежать. Они напечатаны на коробке и до сих пор отсутствовали на этой странице.',
    items: [
      {
        do: 'На сухую кожу',
        body: 'Не на влажную и не поверх сыворотки, которая ещё не впиталась. Вода на коже разбавляет реакцию до её начала.',
      },
      {
        do: 'Три–пять нажатий, распределить и оставить',
        body: 'Корейская панель указывает три–пять нажатий. Распределите ровно и перестаньте прикасаться. Растирание убивает пузырьки.',
      },
      {
        do: 'Дождитесь пузырьков, затем вбейте',
        body: 'Дайте моменту пройти, пока пена не покроет лицо. Когда пузырьки начнут лопаться, мягко помассируйте и вбейте похлопывающими движениями.',
      },
      {
        do: 'Не смывать',
        body: 'Он называется маской и несколько минут ведёт себя как маска, но это несмываемый крем. Ничего потом не удаляется.',
      },
    ],
  },

  engine: {
    eyebrow: 'Что на самом деле происходит',
    title: 'Два ингредиента, о которых никто не говорит',
    intro:
      'Наше собственное описание называло шесть ключевых ингредиентов, и ни один из двух, которые делают этот продукт тем, что он есть, среди них не значился. Вот они.',
    items: [
      {
        name: 'Methyl Perfluoroisobutyl Ether',
        dose: '5.000%',
        body: 'Второй ингредиент после воды. Перфторуглерод — из семейства жидкостей, способных растворять и отдавать намного больше кислорода, чем вода. Это и есть кислород в «оксимаске», и при 5% он с большим отрывом крупнейший актив формулы.',
      },
      {
        name: 'Decyl Glucoside',
        dose: '2.750%',
        body: 'Мягкий сурфактант из кокоса и кукурузного сахара. Без сурфактанта ничего не пенится, так что именно он превращает выделяющийся газ в покрывало из пузырьков, а не в ничто. Он же причина, по которой текстура ведёт себя не как у любого другого крема, что мы продаём.',
      },
      {
        name: 'Глицерин, диглицерин и дипропиленгликоль',
        dose: '~10% суммарно',
        body: 'Увлажняющая база — поэтому столь активный крем всё же оставляет кожу комфортной, а не стянутой.',
      },
      {
        name: 'Масло ши и жожоба',
        dose: 'по 1.000%',
        body: 'Липидная половина. Скромная, реальная и достаточная, чтобы формула с 2,75% сурфактанта не ощущалась обезжиривающей.',
      },
      {
        name: 'Adenosine',
        dose: '0.040%',
        body: 'Доза, под которую Корея лицензирует уменьшение морщин, и причина, по которой это вообще функциональная косметика. Измерено в партии: 0,043%, и сертификат дополнительно проводит проверку идентичности против эталонной хроматограммы.',
      },
      {
        name: 'Гиалуронат натрия, аллантоин и витамин E',
        dose: '0.050 / 0.050 / 0.100%',
        body: '500, 500 и 1 000 частей на миллион. Поддерживающие, реальные и описанные честно, а не превращённые в заголовок.',
      },
    ],
  },

  carton: {
    eyebrow: 'Отдадим должное',
    title: 'Коробка сама печатает следовую дозу',
    body:
      'Корейский состав на этой коробке гласит «sh-Oligopeptide-1 (0.1ppm)». Производитель поставил концентрацию на упаковку, рядом с ингредиентом, по которому назван продукт. Это редкость и это правильно — поэтому вот весь набор названных ингредиентов в тех концентрациях, в которых они действительно присутствуют.',
    rows: [
      { name: 'sh-Oligopeptide-1 (EGF)', value: '0,1 ppm', note: 'Напечатано на коробке вместе с дозой' },
      { name: 'Мадекассосид', value: '1 ppm', note: 'В двести раз ниже, чем в нашем постпроцедурном креме' },
      { name: 'Copper Tripeptide-1', value: '0,05 ppm', note: 'Пятьдесят частей на миллиард' },
      { name: 'Минералы Sepitonic M3', value: '~10 ppm', note: 'Аспартат магния, глюконат цинка, глюконат меди' },
      { name: 'Масло лосося', value: '100 ppm', note: 'Достаточно, чтобы продукт не был веганским' },
      { name: 'Аденозин', value: '0,040%', note: 'Лицензионный актив, измерено 0,043%', real: true },
    ],
    footer:
      'Полезное следствие правильного чтения минерального комплекса: феноксиэтанол в составе присутствует в концентрации одна часть на миллион и приходит внутри Sepitonic M3 как перенос. Он там не в роли консерванта. Консервирует этот крем 1,2-гександиол 2% вместе с этилгексилглицерином.',
  },

  study: {
    eyebrow: 'Что мы можем и не можем сказать',
    title: 'Клиническое исследование есть, а его цифры у нас нет',
    body:
      'В клинической документации производителя есть страница под названием «Клиническое исследование успокаивающего действия на кожу против внешнего раздражителя (физического раздражителя)», размещённая при этом продукте. То есть исследование реально и оно именно о том, что раньше утверждало наше описание. Но в отличие от других продуктов в том же документе, где мы можем привести цифры вроде 12% и 17%, эта страница показывает результат графиком без читаемого значения. Так что мы можем сказать, что исследование проводилось, и не можем сказать, что оно показало, — а это не то же самое, что доказательство или его отсутствие. Мы запросили отчёт.',
  },

  versus: {
    eyebrow: 'Какой из двух вам нужен',
    title: 'Этот или Soothing Repair Postcream',
    intro:
      'Производитель сам проводит границу между этими двумя, и она разумная, так что воспользуемся его границей, а не станем изобретать различие.',
    columns: { post: 'Soothing Repair Postcream', oxy: 'EGF Repair Oxymask Cream' },
    postBody:
      'Интенсивное восстановление примерно на неделю, сразу после профессиональной процедуры. Простой, непенящийся, без аромата крем, в котором нет ничего, что конфликтовало бы с тем, что вашей коже только что сделали.',
    oxyBody:
      'Ежедневный, для кожи, уставшей от всего остального. Производитель называет его S.O.S-кремом. Он пенится, ароматизирован эвкалиптом и несёт лицензионную дозу против морщин, которой у постпроцедурного нет.',
    body:
      'На практике: сразу после микронидлинга или лазера берите постпроцедурный. Для тусклой, уставшей, в целом «наевшейся» кожи в обычную неделю — этот. Они не конкуренты, и разница не в силе: вопрос в том, хотите ли вы активный ароматизированный пенящийся крем на коже, которая только что через что-то прошла, и ответ — нет.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что говорит сертификат',
    intro:
      'Сделано в Корее, выпущено против письменной спецификации и оценено по европейскому косметическому закону с чистым заключением без ограничений.',
    rows: [
      { label: 'Внешний вид', value: 'Белый крем' },
      { label: 'pH', value: '6,18 при 25 °C, в пределах спецификации 5,10–7,10' },
      { label: 'Наполнение', value: '50,28 г при заявленных 50 г' },
      { label: 'Стабильность', value: 'Пройдена при 50 °C' },
      { label: 'Идентичность аденозина', value: 'Хроматограмма сверена с эталоном — пройдено' },
      { label: 'Измерение аденозина', value: '0,043% против заявленных 0,040%, при спецификации выше 90%' },
      { label: 'Чистота', value: 'Бактерии и плесень — обе менее 10 КОЕ/мл при допустимых 100' },
      { label: 'Срок годности', value: 'Три года закрытым, дата на коробке' },
      { label: 'Лицензия', value: 'Корейское одинарное действие: уменьшение морщин, через аденозин' },
    ],
    patch:
      'Патч-тест вернулся с оценкой «не раздражает», а не просто «пройден», и заключение признаёт продукт безопасным для здоровья человека без оговорки «с ограничениями», которую несут несколько других средств линейки. Оценщик отмечает, что число добровольцев статистически незначимо, так что читайте это как уверенность в формуле, а не как доказательство про вашу кожу.',
  },

  fragrance: {
    eyebrow: 'Если вы читаете составы',
    title: 'Эвкалипт, масло лосося и никакой отдушки',
    body:
      'В этой формуле нет парфюмерной композиции, но есть масло листьев эвкалипта 0,0184%, которое приносит лимонен 0,0016% — заявленный, потому что европейский закон требует этого выше 0,001%. Это даёт крему отчётливый эвкалиптовый запах и служит ещё одной причиной, по которой коробка просит не наносить его рядом с глазами. Он также содержит масло лосося в концентрации сто частей на миллион, поэтому не веганский и не подходит тем, кто избегает ингредиентов из рыбы. И его не следует применять при беременности и кормлении — это указание есть на коробке.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что во флаконе',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Не применять при беременности и кормлении — это указание напечатано на коробке.',
      'Содержит масло лосося, поэтому не веганский и не подходит тем, кто избегает ингредиентов из рыбы.',
      'Содержит масло эвкалипта с заявленным лимоненом. Сделайте пробу, если реагируете на эфирные масла.',
      'Только для наружного применения. Не наносите рядом с глазами, при попадании тщательно промойте прохладной водой.',
      'Не наносить на повреждённую или открытую кожу.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Оценено как безопасное для здоровья человека по регламенту EC 1223/2009, патч-тест — «не раздражает».',
      'Хранить в прохладном сухом месте, вне прямого солнца и вне доступа детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, включая корейскую панель.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '50 г, помпа' },
      { label: 'Текстура', value: 'Белый крем, вспенивается при контакте с кожей' },
      { label: 'Кислород', value: 'Метил перфторизобутиловый эфир 5,000%' },
      { label: 'Пена', value: 'Decyl Glucoside 2,750%' },
      { label: 'Увлажнители', value: 'Глицерин, диглицерин и дипропиленгликоль, ~10% суммарно' },
      { label: 'Липиды', value: 'Масло ши 1,000%, масло жожоба 1,000%' },
      { label: 'Лицензионный актив', value: 'Аденозин 0,040%, измерено 0,043%' },
      { label: 'EGF', value: 'sh-Oligopeptide-1 на 0,1 ppm — коробка печатает дозу' },
      { label: 'Консервация', value: '1,2-гександиол 2% с этилгексилглицерином. Феноксиэтанол 1 ppm — перенос' },
      { label: 'Отдушка', value: 'Нет парфюма, но масло эвкалипта 0,0184% с заявленным лимоненом' },
      { label: 'Не веганский', value: 'Содержит масло лосося 100 ppm' },
      { label: 'pH', value: '5,10–7,10 (6,18 в измеренной партии)' },
      { label: 'Не для', value: 'Беременности и кормления, зоны вокруг глаз, повреждённой кожи' },
      { label: 'Оценка', value: 'Оценка безопасности ЕС; патч-тест «не раздражает»' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Почему он не пенится?',
        a: 'Почти всегда одно из двух: вы нанесли его на влажную кожу или растёрли. Нужна сухая кожа, и нужно оставить его в покое на момент после распределения. Коробка конкретна в обоих пунктах, и это единственный продукт из нашего ассортимента, где техника меняет то, работает он или нет.',
      },
      {
        q: 'Что создаёт пузырьки?',
        a: 'Метил перфторизобутиловый эфир 5% — перфторуглерод, удерживающий гораздо больше кислорода, чем вода, и отдающий его на коже, — плюс decyl glucoside 2,75%, мягкий сахарный сурфактант, превращающий этот газ в пену. Эти два и есть продукт. Наше старое описание приписывало эффект EGF, который присутствует в концентрации 0,1 части на миллион.',
      },
      {
        q: 'Так делает ли EGF что-нибудь?',
        a: 'При 0,1 части на миллион мы не станем этого утверждать. Скажем другое: производитель печатает «(0.1ppm)» рядом с ним на коробке, что честнее, чем удаётся большинству брендов, и мы предпочтём это повторить, а не обходить. Покупайте за пенную доставку кислорода, аденозин на измеренных 0,043% и за ши с жожоба.',
      },
      {
        q: 'Смывать? Ведь написано «маска».',
        a: 'Нет. Несколько минут он ведёт себя как маска, пока пенится, затем вы вбиваете его и оставляете. Коробка говорит «не смывать» и имеет это в виду. Утром и вечером.',
      },
      {
        q: 'Он веганский и чем-нибудь пахнет?',
        a: 'Не веганский — содержит масло лосося в концентрации сто частей на миллион. И да, он отчётливо пахнет эвкалиптом, из масла листьев эвкалипта 0,0184% с заявленным лимоненом. Парфюмерной композиции в нём нет, но «без отдушки» и «без запаха» — не одно и то же.',
      },
      {
        q: 'Чем он отличается от Soothing Repair Postcream?',
        a: 'Производитель сам проводит границу: постпроцедурный — интенсивное восстановление примерно на неделю сразу после профессиональной процедуры, а этот — ежедневный для кожи, уставшей от всего остального. Практически этот крем пенится, ароматизирован и несёт активную лицензию, а ничего из этого не нужно коже, которая только что прошла микронидлинг. Сначала постпроцедурный, потом этот.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const OXYMASK_COPY: Record<Locale, OxymaskCopy> = { en: EN, ar: AR, ru: RU }

export function getOxymaskCopy(locale: string | undefined): OxymaskCopy {
  return OXYMASK_COPY[(locale as Locale) ?? 'en'] ?? OXYMASK_COPY.en
}

/** The postcream it is compared against, then the soothing and hydrating creams. */
export const COMPANION_PRODUCT_IDS = ['25', '28', '32', '16'] as const
