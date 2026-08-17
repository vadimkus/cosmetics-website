/**
 * Bespoke copy for INTENSIVE BLEMISH BALM CREAM [SPF30 / PA++] (product 42).
 *
 * SOURCING — every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_42_BLEMISH_BALM_SOURCE_AUDIT.md:
 *   - DTS MG signed formula: three filters totalling 19.70%, arbutin 2.00%,
 *     adenosine 0.04%, allantoin 0.10%, D5 3.50% + D6 2.50%, beeswax 2.00%,
 *     and the trace complex at 50 ppm and 10 ppm.
 *   - COA lot WIF025: pH 7.44, net 50.1 g, 0 cfu/ml, the assay of all five
 *     declared actives, and the lead / arsenic / hydroquinone tests.
 *   - The registered carton: the triple Korean function, the five
 *     no-additions, and the mandatory arbutin precaution.
 *   - Regulation (EU) 2024/1328 for the D5/D6 dates.
 *
 * WHAT THIS PRODUCT IS FOR. The carton says it plainly and our site never did:
 * it covers redness and blemishes *after a dermatological treatment*. This is
 * the tube you put on to walk out of the clinic. That is a specific, honest and
 * far better hook than "premium natural coverage cream".
 *
 * THREE THINGS THE PAGE VOLUNTEERS:
 *   1. The mandatory Korean warning that products with arbutin at 2% or more
 *      have reported papules and mild itching. It is on the box; it was on no
 *      page. It sits next to the brightening benefit, because the 2% is what
 *      earns that claim.
 *   2. One shade only. The BB Cushion ships three.
 *   3. D5 at 3.50% and D6 at 2.50%, and the EU date of 6 June 2027 — on
 *      environmental persistence grounds, not skin safety.
 *
 * MUST STAY OUT:
 *   - Eucalyptus oil, perilla seed oil and Rumex Crispus as actives. 50, 50 and
 *     10 ppm.
 *   - An unqualified "especially good for sensitive skin" — the arbutin warning
 *     exists, even though this is the only fragrance-free one of the three.
 *   - Any water-resistance claim. No test.
 *   - Reading 7.70% titanium dioxide as 7.70% of UV protection; here it is also
 *     the coverage pigment.
 *   - The contract manufacturer's name, and the lot code.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface BlemishBalmCopy {
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

  useCase: {
    eyebrow: string
    title: string
    body: string
    items: string[]
  }

  paradox: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; filters: string; load: string; grade: string }
    rows: Array<{ name: string; filters: string; load: string; grade: string; self?: boolean }>
    body: string
    aside: string
  }

  actives: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  arbutin: {
    eyebrow: string
    title: string
    body: string
    quote: string
    verdict: string
  }

  assay: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; declared: string; found: string }
    rows: Array<{ name: string; declared: string; found: string }>
    purity: string
  }

  clean: {
    eyebrow: string
    title: string
    body: string
    items: string[]
    note: string
  }

  silicone: {
    eyebrow: string
    title: string
    body: string
  }

  limits: {
    eyebrow: string
    title: string
    intro: string
    items: string[]
  }

  honesty: {
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

  inci: {
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

const EN: BlemishBalmCopy = {
  eyebrow: 'Intensive Blemish Balm Cream · SPF30 / PA++',
  headline: 'The tube you put on to walk out of the clinic.',
  subheadline:
    'A tinted cream built to cover the redness a treatment leaves behind, with SPF30 over the top and two actives at licensed doses: arbutin at 2% and adenosine at 0.04%. Fragrance-free, no phenoxyethanol, and Korea registers it for three functions at once.',
  heroBullets: [
    'Made for post-procedure redness, which is what the carton actually says',
    'Arbutin 2% and adenosine 0.04% — both at their licensed doses',
    'Fragrance-free: the only one of our three SPF products with no perfume',
    'One universal shade, and it contains beeswax',
  ],
  badges: ['Made in Korea', '50 g', 'Triple-function cosmetic', 'Dermatologically tested'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: 'SPF30', label: 'PA++ over full coverage' },
    { value: '2%', label: 'Arbutin, measured at 1.81%' },
    { value: '19.7%', label: 'Of the tube is UV filter' },
    { value: '0', label: 'Colony-forming units on the batch' },
  ],

  useCase: {
    eyebrow: 'What it is actually for',
    title: 'Cover, not correction',
    body:
      'The registered carton is unusually specific: this covers redness and blemishes after a dermatological treatment and helps express natural skin tone. That is a narrower and more useful promise than most base makeup makes, and it explains the whole formula — the pigment load, the SPF, the absence of fragrance, and the arbutin sitting underneath it all.',
    items: [
      'The hour after microneedling, a peel or a laser, when you still have to leave',
      'Over post-acne marks while they fade, rather than instead of treating them',
      'Days when SPF and coverage need to be one step, not two',
      'Under nothing — it is the last step, and it is enough on its own',
    ],
  },

  paradox: {
    eyebrow: 'Read across the range',
    title: 'The most filter, the lowest number',
    intro:
      'Line up our three SPF products and something looks broken. Each step down carries more UV filter by weight and earns a lower grade. This one carries the most and rates lowest.',
    columns: { name: 'Product', filters: 'Filters', load: 'Filter load', grade: 'Grade' },
    rows: [
      { name: 'Ultra Shield Sun Cream', filters: '6', load: '17.10%', grade: 'SPF50+ / PA++++' },
      { name: 'Multi Sun Cream', filters: '4', load: '18.50%', grade: 'SPF40 / PA++' },
      { name: 'Blemish Balm Cream', filters: '3', load: '19.70%', grade: 'SPF30 / PA++', self: true },
    ],
    body:
      'Two reasons, and both are real. There is no long-UVA filter in this tube — the titanium dioxide reaches short UVA and stops, and the other two are UVB absorbers. And the titanium dioxide at 7.70% is doing two jobs at once: it is the largest filter and it is the white pigment that gives the cream its coverage. Pigment dispersed for opacity is not fully available as UV protection, so you cannot read 7.70% as 7.70% of shielding.',
    aside:
      'Which is the honest way of saying: a tinted base is a compromise. You get coverage, colour and a real SPF30 in one step. If the day calls for maximum protection, wear the Ultra Shield and put this over it or leave it in the drawer.',
  },

  actives: {
    eyebrow: 'The licensed three',
    title: 'What Korea registers it for',
    intro:
      'The carton declares a triple-function cosmetic — whitening, wrinkle improvement and UV protection — and each function has an ingredient behind it at the concentration the licence requires.',
    items: [
      {
        name: 'Arbutin',
        dose: '2.00%',
        body: 'The brightening function. It works on uneven tone slowly and steadily, and at this level it also triggers a mandatory Korean warning, which is the next section rather than a footnote.',
      },
      {
        name: 'Adenosine',
        dose: '0.04%',
        body: 'The wrinkle function, at exactly the dose Korea licenses. The same figure appears in every functional anti-ageing product registered there, including our own cushion and sun cream.',
      },
      {
        name: 'Three UV filters',
        dose: '19.70%',
        body: 'Titanium dioxide 7.70%, ethylhexyl methoxycinnamate 7.00% and octocrylene 5.00%. All three were assayed on the batch rather than merely declared.',
      },
    ],
  },

  arbutin: {
    eyebrow: 'On the box, and now on this page',
    title: 'The warning that comes with arbutin at 2%',
    body:
      'Korea requires a specific precaution on any product carrying arbutin at 2% or more, and it is printed on this carton. It is not on most retailers\u2019 pages and until now it was not on ours, which is the wrong way round: the 2% is exactly what earns the brightening claim, so the tradeoff belongs beside the benefit.',
    quote:
      'In human application test data for products containing the same ingredient (arbutin at 2% or more), there have been reported cases of papules and mild itching.',
    verdict:
      'In practice: patch test on your jaw for a couple of days before you wear it over a whole face, and especially before you wear it over skin that has just had a procedure. If you react, stop. This is the same guidance a clinic would give you, and it is not a reason to avoid arbutin — it is a reason to introduce it the way you would any active.',
  },

  assay: {
    eyebrow: 'Quality',
    title: 'Measured, including the one that matters most',
    intro:
      'The certificate of analysis assays every declared active rather than restating the recipe, and it does one test that almost no brand publishes.',
    columns: { name: 'Active', declared: 'Declared', found: 'Found in the batch' },
    rows: [
      { name: 'Titanium Dioxide', declared: '7.70%', found: '7.09%' },
      { name: 'Ethylhexyl Methoxycinnamate', declared: '7.00%', found: '6.31%' },
      { name: 'Octocrylene', declared: '5.00%', found: '4.50%' },
      { name: 'Arbutin', declared: '2.00%', found: '1.81%' },
      { name: 'Adenosine', declared: '0.04%', found: '0.04%' },
    ],
    purity:
      'And the important one: hydroquinone under 1 ppm. Arbutin breaks down into hydroquinone, which is banned in cosmetics, so a brand selling arbutin at 2% ought to test the finished product for it. This one does. Lead came in under 20 ppm and arsenic under 10 ppm, which matters for a cream coloured with iron oxides.',
  },

  clean: {
    eyebrow: 'Five things it leaves out',
    title: 'Fragrance-free, and it checks out',
    body:
      'The carton carries a five-no-additions mark, and every one of them holds up against the quantitative formula. Preservation is handled by caprylyl glycol, glyceryl caprylate, caprylhydroxamic acid, tropolone and hexanediol instead.',
    items: ['No parabens', 'No artificial fragrance', 'No mineral oil', 'No ethanol', 'No phenoxyethanol'],
    note:
      'Worth knowing across the range: this is the only one of our three SPF products with no perfume in it at all. The Multi Sun is fragranced at 0.25% with five declared allergens and the Ultra Shield at 0.5%. If fragrance is your problem, this is the tube — read the arbutin section above and patch test anyway.',
  },

  silicone: {
    eyebrow: 'Worth knowing',
    title: 'On the silicones, and a date',
    body:
      'Cyclopentasiloxane at 3.50% and cyclohexasiloxane at 2.50% — D5 and D6. They are the reason a cream carrying nearly 20% mineral filter spreads like a light base rather than a paste. European law is phasing them down: Regulation (EU) 2024/1328 caps both at 0.1% in leave-on cosmetics from 6 June 2027. The grounds are environmental rather than skin safety — both were classed as very persistent and very bioaccumulative, and leave-on cosmetics are the largest source of release. Nothing here is restricted where this product is sold, and we would rather you heard the date from us.',
  },

  limits: {
    eyebrow: 'Before you add it',
    title: 'What it is not',
    intro: 'Four things this product genuinely does not do, none of which the old page mentioned.',
    items: [
      'One shade only. There is a single iron-oxide shade system in this formula, and no lighter or deeper option. Our BB Cushion ships in three shades if matching matters more than coverage.',
      'Not water resistant. There is no water-resistance test in the file, so reapply after swimming, sweating or towelling.',
      'Not vegan. It contains beeswax at 2%, which is what gives the cream its structure.',
      'Not the strongest sun protection we sell. SPF30 / PA++ with no long-UVA filter. For a day outdoors, that is the Ultra Shield.',
    ],
  },

  honesty: {
    eyebrow: 'About the botanicals',
    title: 'Three of the named ingredients are trace',
    body:
      'The old ingredient list led with eucalyptus leaf oil, perilla seed oil and Rumex Crispus root extract. On the manufacturer\u2019s quantitative formula the first two are at 50 ppm and the third at 10 ppm, alongside oregano leaf and a bean-and-birch-bark pair at the same order of magnitude. They are on the list; they are not why the product works. The arbutin, the adenosine, the allantoin at 0.1% and the filters are.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Last step, and enough of it',
    frequency: 'Daily on face and neck · reapply after sweat or water',
    steps: [
      {
        title: 'Patch test first, on the jaw',
        body: 'Two days on a small area before a full face, because of the arbutin. Do this before you plan to wear it over freshly treated skin, not after.',
      },
      {
        title: 'After your skincare, over nothing',
        body: 'Take a small amount at the end of your routine, spread it along the grain of the skin, then press it in with your fingertips. It is the final step, not a primer for something else.',
      },
      {
        title: 'Build where you need cover',
        body: 'A thin even layer everywhere, then a second pass only on the red areas. Two thin passes cover better than one thick one and stay looking like skin.',
      },
      {
        title: 'Again after sweat, water or a towel',
        body: 'It is an SPF30 with no water-resistance claim, so treat any of those as a reset. In this climate that usually means once more before the afternoon.',
      },
    ],
    note:
      'If your clinic gave you a waiting period before makeup over a treated area, that instruction comes from them and overrides anything on this page.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the tube',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the carton in your hand.',
  },

  lab: {
    eyebrow: 'The batch',
    title: 'What the certificate says',
    intro: 'Made in Korea and released against a written specification, with heavy metals and degradation both checked.',
    rows: [
      { label: 'pH', value: '7.44 at 25 °C, inside a 5.50–7.50 specification — high for skincare, normal for a mineral-loaded base' },
      { label: 'Fill', value: '50.1 g against a 50 g declaration' },
      { label: 'Purity', value: 'Zero colony-forming units per ml, for both bacteria and moulds, against a permitted 100' },
      { label: 'Heavy metals', value: 'Lead under 20 ppm and arsenic under 10 ppm — checked because the shade comes from iron oxides' },
      { label: 'Hydroquinone', value: 'Under 1 ppm — the arbutin degradation product, tested for and not found' },
      { label: 'Stability', value: 'Passed cycling at 4 °C, 25 °C and 45 °C' },
      { label: 'Licence', value: 'Korean triple-function: whitening, wrinkle improvement, UV protection' },
    ],
    disclaimer:
      'The batch on file was made in June 2019, so treat the figures above as the specification this product is released against rather than a statement about the tube currently on the shelf.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Contains arbutin at 2%. Korean human-application data for products at this level reports papules and mild itching. Patch test before first full use.',
      'For external use only. Avoid the eyes and mucous membranes, and rinse thoroughly with cool water on contact.',
      'Do not apply directly around the eyes.',
      'Avoid broken skin, and follow any waiting period your clinic gave you after a procedure.',
      'Stop and see a doctor if redness, swelling or irritation appears.',
      'Contains beeswax. Store cool and dry, out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton, including the arbutin disclosure.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '50 g' },
      { label: 'Grade', value: 'SPF30 / PA++ — three filters, 19.70% combined' },
      { label: 'Shade', value: 'One universal shade, from iron oxides and titanium dioxide' },
      { label: 'Actives', value: 'Arbutin 2.00%, adenosine 0.04%, allantoin 0.10%' },
      { label: 'Free from', value: 'Parabens, artificial fragrance, mineral oil, ethanol, phenoxyethanol' },
      { label: 'Contains', value: 'Beeswax 2%, and D5 and D6 silicones at 6% combined' },
      { label: 'Water resistance', value: 'None claimed — reapply after water or sweat' },
      { label: 'Licence', value: 'Korean triple-function cosmetic' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Why is this SPF30 when it has more filter than your SPF50+?',
        a: 'Because grade depends on which wavelengths the filters cover and how available they are. This tube is 19.7% filter against the Ultra Shield\u2019s 17.1%, but it has no long-UVA filter, and its titanium dioxide is doing double duty as the coverage pigment — pigment dispersed for opacity is not fully available as UV protection. A tinted base is a compromise, and SPF30 in one step is a good one.',
      },
      {
        q: 'What is this warning about arbutin?',
        a: 'Korea requires it on any product with arbutin at 2% or more: human application data has reported papules and mild itching. It is printed on the carton. It is not a reason to avoid the product — it is a reason to patch test on your jaw for two days first, particularly before wearing it over skin that has just had a treatment.',
      },
      {
        q: 'How many shades does it come in?',
        a: 'One. There is a single iron-oxide shade system in the formula, with no lighter or deeper version. It is built to neutralise redness rather than to match a range of skin tones, and it sheers out. If shade matching matters more to you than coverage, our BB Cushion comes in three.',
      },
      {
        q: 'Is it good for sensitive skin?',
        a: 'On one axis, better than anything else we sell in sun care: no fragrance, no ethanol, no phenoxyethanol, no parabens, no mineral oil, all verified against the formula. On another axis, it carries arbutin at 2% with the warning above. Both are true at once, so read both and patch test. That is a more useful answer than yes.',
      },
      {
        q: 'Can I put it on straight after microneedling?',
        a: 'Ask your clinic — that timing is their call, not ours, and it depends on the depth and what else went on your skin. What the product is designed for is the period after that waiting window, when the redness is still visible and you need to be seen in public.',
      },
      {
        q: 'Is it vegan?',
        a: 'No. It contains beeswax at 2%, which is part of what gives the cream its structure. Worth saying plainly since nothing on our site previously did.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: BlemishBalmCopy = {
  eyebrow: 'كريم البلسم المكثف للعيوب · SPF30 / PA++',
  headline: 'الأنبوب الذي تضعينه لتخرجي من العيادة.',
  subheadline:
    'كريم ملوّن صُنع لتغطية الاحمرار الذي يتركه الإجراء، مع حماية SPF30 فوقه وفعّالين بجرعتين مرخّصتين: أربوتين بنسبة 2% وأدينوزين بنسبة 0.04%. خالٍ من العطر ومن الفينوكسي إيثانول، وكوريا تسجّله لثلاث وظائف في وقت واحد.',
  heroBullets: [
    'مصنوع لاحمرار ما بعد الإجراءات، وهذا ما تقوله العلبة فعلاً',
    'أربوتين 2% وأدينوزين 0.04% — كلاهما بجرعته المرخّصة',
    'خالٍ من العطر: الوحيد بين واقياتنا الثلاثة بلا أي عطر',
    'درجة لون واحدة، ويحتوي على شمع العسل',
  ],
  badges: ['صُنع في كوريا', '50 غ', 'مستحضر ثلاثي الوظيفة', 'مختبر جلدياً'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: 'SPF30', label: 'PA++ فوق تغطية كاملة' },
    { value: '2%', label: 'أربوتين، مقيس عند 1.81%' },
    { value: '19.7%', label: 'من الأنبوب مرشحات' },
    { value: '0', label: 'وحدة مستعمرة على الدفعة' },
  ],

  useCase: {
    eyebrow: 'ما هو فعلاً من أجله',
    title: 'تغطية، لا تصحيح',
    body:
      'العلبة المسجّلة محدّدة بشكل غير معتاد: يغطّي الاحمرار والعيوب بعد الإجراء الجلدي ويساعد على إظهار لون البشرة الطبيعي. وهذا وعد أضيق وأنفع من معظم ما يقدّمه مكياج الأساس، وهو يفسّر التركيبة كلها — حمل الصباغ، والـ SPF، وغياب العطر، والأربوتين الجالس تحت ذلك كله.',
    items: [
      'الساعة التي تلي الوخز الدقيق أو التقشير أو الليزر، حين يبقى عليك الخروج',
      'فوق آثار حب الشباب أثناء تلاشيها، لا بدلاً من معالجتها',
      'الأيام التي يجب أن تكون فيها الحماية والتغطية خطوة واحدة لا خطوتين',
      'وتحت لا شيء — فهو الخطوة الأخيرة، ويكفي وحده',
    ],
  },

  paradox: {
    eyebrow: 'اقرئي عبر المجموعة',
    title: 'أكثر المرشحات، وأقل رقم',
    intro:
      'صُفّي واقياتنا الثلاثة وسيبدو شيء معطوباً. كل خطوة نزولاً تحمل مرشحات أكثر بالوزن وتنال درجة أقل. وهذا يحمل أكثرها ودرجته أدناها.',
    columns: { name: 'المنتج', filters: 'المرشحات', load: 'حمل المرشحات', grade: 'الدرجة' },
    rows: [
      { name: 'Ultra Shield Sun Cream', filters: '6', load: '17.10%', grade: 'SPF50+ / PA++++' },
      { name: 'Multi Sun Cream', filters: '4', load: '18.50%', grade: 'SPF40 / PA++' },
      { name: 'Blemish Balm Cream', filters: '3', load: '19.70%', grade: 'SPF30 / PA++', self: true },
    ],
    body:
      'سببان، وكلاهما حقيقي. لا يوجد في هذا الأنبوب مرشّح لـ UVA الطويل — فثاني أكسيد التيتانيوم يصل إلى UVA القصير ويتوقف، والآخران يمتصّان UVB. وثاني أكسيد التيتانيوم بنسبة 7.70% يؤدي مهمتين في وقت واحد: فهو أكبر مرشّح، وهو أيضاً الصباغ الأبيض الذي يمنح الكريم تغطيته. والصباغ الموزّع للتعتيم ليس متاحاً بالكامل كحماية من الأشعة، فلا يمكن قراءة 7.70% كـ 7.70% من الحجب.',
    aside:
      'وهذه هي الطريقة الصريحة للقول إن الأساس الملوّن حلٌّ وسط. تحصلين على تغطية ولون وSPF30 حقيقي في خطوة واحدة. وإن كان اليوم يستدعي أقصى حماية، فارتدي ألترا شيلد وضعي هذا فوقه أو اتركيه في الدرج.',
  },

  actives: {
    eyebrow: 'الثلاثة المرخّصة',
    title: 'ما تسجّله كوريا له',
    intro:
      'العلبة تعلن مستحضراً ثلاثي الوظيفة — تفتيح وتحسين تجاعيد وحماية من الأشعة — ولكل وظيفة مكوّن خلفها بالتركيز الذي يشترطه الترخيص.',
    items: [
      {
        name: 'Arbutin',
        dose: '2.00%',
        body: 'وظيفة التفتيح. يعمل على تفاوت اللون ببطء وثبات، وبهذا المستوى يستدعي أيضاً تحذيراً كورياً إلزامياً، وهو القسم التالي لا هامشاً.',
      },
      {
        name: 'Adenosine',
        dose: '0.04%',
        body: 'وظيفة التجاعيد، بالجرعة التي ترخّصها كوريا تحديداً. والرقم نفسه يظهر في كل مستحضر وظيفي مضادّ للشيخوخة مسجّل هناك، بما في ذلك كوشيوننا وواقينا.',
      },
      {
        name: 'ثلاثة مرشحات',
        dose: '19.70%',
        body: 'ثاني أكسيد التيتانيوم 7.70%، والإيثيل هكسيل ميثوكسي سينامات 7.00%، والأوكتوكريلين 5.00%. وقد قيست الثلاثة على الدفعة لا مجرّد إعلان.',
      },
    ],
  },

  arbutin: {
    eyebrow: 'على العلبة، والآن على هذه الصفحة',
    title: 'التحذير المرافق للأربوتين بنسبة 2%',
    body:
      'تشترط كوريا احتياطاً محدّداً على أي منتج يحمل أربوتين بنسبة 2% أو أكثر، وهو مطبوع على هذه العلبة. ولا تجدينه على صفحات معظم المتاجر، ولم يكن على صفحتنا حتى الآن، وهذا مقلوب: فنسبة الـ 2% هي بالضبط ما يمنح ادعاء التفتيح، فالمقايضة تنتمي إلى جانب الفائدة.',
    quote:
      'في بيانات الاستخدام البشري لمنتجات تحتوي المكوّن نفسه (أربوتين بنسبة 2% أو أكثر)، سُجّلت حالات من الحبيبات الجلدية والحكة الخفيفة.',
    verdict:
      'عملياً: اختبريه على بقعة عند الفكّ ليومين قبل ارتدائه على كامل الوجه، وخصوصاً قبل ارتدائه فوق بشرة خرجت لتوّها من إجراء. وإن حدث تفاعل فأوقفيه. هذه هي التوجيهات نفسها التي ستعطيها لك العيادة، وهي ليست سبباً لتجنّب الأربوتين — بل سبب لإدخاله كما تُدخل أي فعّال.',
  },

  assay: {
    eyebrow: 'الجودة',
    title: 'مقيس، بما في ذلك الأهمّ',
    intro:
      'شهادة التحليل تقيس كل فعّال معلن لا تكرّر الوصفة، وتُجري اختباراً واحداً لا تنشره أي علامة تقريباً.',
    columns: { name: 'الفعّال', declared: 'المعلن', found: 'الموجود في الدفعة' },
    rows: [
      { name: 'Titanium Dioxide', declared: '7.70%', found: '7.09%' },
      { name: 'Ethylhexyl Methoxycinnamate', declared: '7.00%', found: '6.31%' },
      { name: 'Octocrylene', declared: '5.00%', found: '4.50%' },
      { name: 'Arbutin', declared: '2.00%', found: '1.81%' },
      { name: 'Adenosine', declared: '0.04%', found: '0.04%' },
    ],
    purity:
      'والأهمّ: الهيدروكينون أقل من جزء واحد من المليون. فالأربوتين يتحلّل إلى هيدروكينون، وهو محظور في مستحضرات التجميل، لذا ينبغي لعلامة تبيع أربوتين بنسبة 2% أن تختبر المنتج النهائي بحثاً عنه. وهذه تفعل. وجاء الرصاص أقل من 20 جزءاً من المليون والزرنيخ أقل من 10، وهذا مهمّ لكريم مُلوَّن بأكاسيد الحديد.',
  },

  clean: {
    eyebrow: 'خمسة أشياء يستثنيها',
    title: 'خالٍ من العطر، والأمر يتحقّق',
    body:
      'العلبة تحمل علامة «خمسة بلا إضافات»، وكل واحدة منها تثبت أمام التركيبة الكمّية. والحفظ يتولّاه الكابريليل غلايكول والغليسريل كابريليت وحمض الكابريل هيدروكساميك والتروبولون والهكسانديول بدلاً من ذلك.',
    items: ['بلا بارابين', 'بلا عطر صناعي', 'بلا زيوت معدنية', 'بلا إيثانول', 'بلا فينوكسي إيثانول'],
    note:
      'ويستحق المعرفة عبر المجموعة: هذا هو الوحيد بين واقياتنا الثلاثة الذي لا عطر فيه إطلاقاً. فمالتي صن معطّر بنسبة 0.25% بخمسة مسبّبات حساسية معلنة، وألترا شيلد بنسبة 0.5%. فإن كان العطر هو مشكلتك فهذا هو الأنبوب — واقرئي قسم الأربوتين أعلاه واختبريه على بقعة رغم ذلك.',
  },

  silicone: {
    eyebrow: 'يستحق المعرفة',
    title: 'عن السيليكونات، وعن تاريخ',
    body:
      'سايكلوبنتاسيلوكسين بنسبة 3.50% وسايكلوهكساسيلوكسين بنسبة 2.50% — أي D5 وD6. وهما سبب انتشار كريم يحمل قرابة 20% من المرشحات المعدنية كأساس خفيف لا كمعجون. والقانون الأوروبي يخفّضهما تدريجياً: فاللائحة (EU) 2024/1328 تحدّدهما عند 0.1% في المستحضرات التي تبقى على البشرة من 6 يونيو 2027. والأسباب بيئية لا متعلّقة بسلامة البشرة — فقد صُنّف كلاهما شديد الثبات وشديد التراكم الحيوي، والمستحضرات الباقية على البشرة هي أكبر مصدر للانبعاث. ولا شيء هنا مقيّد حيث يُبَاع هذا المنتج، ونفضّل أن يأتيك التاريخ منّا.',
  },

  limits: {
    eyebrow: 'قبل الإضافة',
    title: 'ما ليس عليه',
    intro: 'أربعة أمور لا يفعلها هذا المنتج فعلاً، ولم تذكر الصفحة القديمة أياً منها.',
    items: [
      'درجة لون واحدة. فالتركيبة تحمل نظام درجة واحدة من أكاسيد الحديد، بلا خيار أفتح أو أغمق. وكوشيون البي بي لدينا يأتي بثلاث درجات إن كانت المطابقة أهمّ لك من التغطية.',
      'غير مقاوم للماء. لا يوجد اختبار مقاومة للماء في الملف، فأعيدي الوضع بعد السباحة أو التعرّق أو التجفيف.',
      'ليس نباتياً. يحتوي شمع العسل بنسبة 2%، وهو ما يمنح الكريم بنيته.',
      'ليس أقوى حماية نبيعها. SPF30 / PA++ بلا مرشّح لـ UVA الطويل. وليوم في الخارج، ذلك هو ألترا شيلد.',
    ],
  },

  honesty: {
    eyebrow: 'عن النباتات',
    title: 'ثلاثة من المكوّنات المذكورة بجرعات أثرية',
    body:
      'قائمة المكوّنات القديمة كانت تتصدّرها زيت أوراق الأوكالبتوس وزيت بذور البريلا ومستخلص جذر السورَل. وفي التركيبة الكمّية للشركة، الأولان عند 50 جزءاً من المليون والثالث عند 10، إلى جانب أوراق الأوريغانو وثنائي الفاصولياء ولحاء البتولا بالمقدار نفسه تقريباً. هي على القائمة؛ وليست سبب عمل المنتج. بل الأربوتين والأدينوزين والألانتوين بنسبة 0.1% والمرشحات.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'الخطوة الأخيرة، وبكمية كافية',
    frequency: 'يومياً على الوجه والرقبة · أعيدي الوضع بعد العرق أو الماء',
    steps: [
      {
        title: 'اختبريه على بقعة أولاً، عند الفكّ',
        body: 'يومان على منطقة صغيرة قبل الوجه الكامل، بسبب الأربوتين. افعلي ذلك قبل أن تخطّطي لارتدائه فوق بشرة معالجة حديثاً، لا بعده.',
      },
      {
        title: 'بعد عنايتك، وتحت لا شيء',
        body: 'خذي كمية صغيرة في نهاية روتينك، وافرديها باتجاه ملمس البشرة، ثم اضغطيها بأطراف أصابعك. إنه الخطوة الأخيرة لا أساساً لشيء آخر.',
      },
      {
        title: 'زيدي حيث تحتاجين التغطية',
        body: 'طبقة رقيقة متساوية في كل مكان، ثم مرور ثانٍ على المناطق المحمرّة فقط. فمرورَان رقيقان يغطّيان أفضل من واحد كثيف ويظلّان يشبهان البشرة.',
      },
      {
        title: 'ثم بعد العرق أو الماء أو المنشفة',
        body: 'إنه SPF30 بلا ادعاء مقاومة للماء، فعاملي أياً من ذلك كإعادة ضبط. وفي هذا المناخ يعني ذلك عادةً مرة أخرى قبل العصر.',
      },
    ],
    note:
      'وإن أعطتك عيادتك مدة انتظار قبل المكياج فوق منطقة معالجة، فتلك التعليمات منهم وهي تتقدّم على أي شيء في هذه الصفحة.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في الأنبوب',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },

  lab: {
    eyebrow: 'الدفعة',
    title: 'ما تقوله الشهادة',
    intro: 'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة، مع فحص المعادن الثقيلة والتحلّل معاً.',
    rows: [
      { label: 'الحموضة', value: '7.44 عند 25 درجة، ضمن مواصفة 5.50–7.50 — مرتفعة لمستحضر عناية، وعادية لأساس محمّل بالمعادن' },
      { label: 'التعبئة', value: '50.1 غ مقابل 50 غ معلنة' },
      { label: 'النقاء', value: 'صفر وحدة مستعمرة لكل مل، للبكتيريا والعفن معاً، مقابل 100 مسموحة' },
      { label: 'المعادن الثقيلة', value: 'الرصاص أقل من 20 جزءاً من المليون والزرنيخ أقل من 10 — فُحصا لأن الدرجة من أكاسيد الحديد' },
      { label: 'الهيدروكينون', value: 'أقل من جزء واحد من المليون — ناتج تحلّل الأربوتين، فُحص ولم يوجد' },
      { label: 'الثبات', value: 'اجتاز التدوير عند 4 و25 و45 درجة مئوية' },
      { label: 'الترخيص', value: 'ثلاثي الوظيفة الكوري: تفتيح، تحسين تجاعيد، حماية من الأشعة' },
    ],
    disclaimer:
      'الدفعة الموجودة في الملف صُنعت في يونيو 2019، فاعتبري الأرقام أعلاه المواصفة التي يُفرج المنتج مقابلها لا بياناً عن الأنبوب الموجود حالياً على الرفّ.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'يحتوي أربوتين بنسبة 2%. وبيانات الاستخدام البشري الكورية لمنتجات بهذا المستوى تسجّل حبيبات جلدية وحكة خفيفة. اختبريه على بقعة قبل الاستخدام الكامل الأول.',
      'للاستعمال الخارجي فقط. تجنّبي العينين والأغشية المخاطية، واشطفي جيداً بالماء البارد عند الملامسة.',
      'لا تضعيه مباشرة حول العينين.',
      'تجنّبي البشرة المجروحة، والتزمي بأي مدة انتظار أعطتك عيادتك بعد الإجراء.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
      'يحتوي شمع العسل. يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، بما فيها إفصاح الأربوتين.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '50 غ' },
      { label: 'الدرجة', value: 'SPF30 / PA++ — ثلاثة مرشحات، 19.70% مجتمعة' },
      { label: 'اللون', value: 'درجة واحدة شاملة، من أكاسيد الحديد وثاني أكسيد التيتانيوم' },
      { label: 'الفعّالات', value: 'أربوتين 2.00%، أدينوزين 0.04%، ألانتوين 0.10%' },
      { label: 'خالٍ من', value: 'البارابين والعطر الصناعي والزيوت المعدنية والإيثانول والفينوكسي إيثانول' },
      { label: 'يحتوي', value: 'شمع العسل 2%، وسيليكونَي D5 وD6 بنسبة 6% مجتمعة' },
      { label: 'مقاومة الماء', value: 'غير مُدّعاة — أعيدي الوضع بعد الماء أو العرق' },
      { label: 'الترخيص', value: 'مستحضر كوري ثلاثي الوظيفة' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'لماذا هذا SPF30 وفيه مرشحات أكثر من واقيكم SPF50+؟',
        a: 'لأن الدرجة تعتمد على الأطوال الموجية التي تغطّيها المرشحات وعلى مدى توفّرها. فهذا الأنبوب 19.7% مرشحات مقابل 17.1% في ألترا شيلد، لكن لا مرشّح لـ UVA الطويل فيه، وثاني أكسيد التيتانيوم فيه يؤدي مهمّة مزدوجة كصباغ التغطية — والصباغ الموزّع للتعتيم ليس متاحاً بالكامل كحماية. الأساس الملوّن حلٌّ وسط، وSPF30 في خطوة واحدة حلٌّ جيد.',
      },
      {
        q: 'ما هذا التحذير بشأن الأربوتين؟',
        a: 'تشترطه كوريا على أي منتج بأربوتين 2% أو أكثر: فبيانات الاستخدام البشري سجّلت حبيبات جلدية وحكة خفيفة. وهو مطبوع على العلبة. وليس سبباً لتجنّب المنتج — بل سبب لاختباره على بقعة عند الفكّ ليومين أولاً، خصوصاً قبل ارتدائه فوق بشرة خرجت لتوّها من إجراء.',
      },
      {
        q: 'بكم درجة لون يأتي؟',
        a: 'واحدة. نظام درجة واحدة من أكاسيد الحديد في التركيبة، بلا نسخة أفتح أو أغمق. وقد صُنع لتحييد الاحمرار لا لمطابقة مدى من درجات البشرة، وهو يخفّ عند الفرد. فإن كانت مطابقة الدرجة أهمّ لك من التغطية، فكوشيون البي بي لدينا يأتي بثلاث.',
      },
      {
        q: 'هل يناسب البشرة الحسّاسة؟',
        a: 'على محور واحد، أفضل من أي شيء نبيعه في العناية بالشمس: بلا عطر ولا إيثانول ولا فينوكسي إيثانول ولا بارابين ولا زيوت معدنية، وكلها متحقّقة أمام التركيبة. وعلى محور آخر، يحمل أربوتين 2% مع التحذير أعلاه. وكلا الأمرين صحيح في الوقت نفسه، فاقرئي الاثنين واختبريه على بقعة. وهذه إجابة أنفع من «نعم».',
      },
      {
        q: 'هل أضعه مباشرة بعد الوخز الدقيق؟',
        a: 'اسألي عيادتك — فذلك التوقيت قرارهم لا قرارنا، ويعتمد على العمق وعلى ما وُضع على بشرتك. وما صُمّم المنتج له هو الفترة التي تلي نافذة الانتظار تلك، حين يبقى الاحمرار مرئياً وتحتاجين إلى الظهور بين الناس.',
      },
      {
        q: 'هل هو نباتي؟',
        a: 'لا. يحتوي شمع العسل بنسبة 2%، وهو جزء من ما يمنح الكريم بنيته. ويستحق القول بوضوح لأن لا شيء على موقعنا كان يذكره سابقاً.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: BlemishBalmCopy = {
  eyebrow: 'Intensive Blemish Balm Cream · SPF30 / PA++',
  headline: 'Тюбик, который наносят, чтобы выйти из клиники.',
  subheadline:
    'Тонирующий крем, созданный закрывать красноту, оставшуюся после процедуры, с SPF30 сверху и двумя активами в лицензионных дозах: арбутин 2% и аденозин 0,04%. Без отдушки, без феноксиэтанола, и Корея регистрирует его сразу под три функции.',
  heroBullets: [
    'Сделан под красноту после процедур — именно так и говорит коробка',
    'Арбутин 2% и аденозин 0,04% — оба в лицензионных дозах',
    'Без отдушки: единственный из трёх наших SPF-средств совсем без парфюма',
    'Один универсальный оттенок, и в составе есть пчелиный воск',
  ],
  badges: ['Сделано в Корее', '50 г', 'Средство тройного действия', 'Дерматологически тестирован'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: 'SPF30', label: 'PA++ поверх плотного покрытия' },
    { value: '2%', label: 'Арбутина, измерено 1,81%' },
    { value: '19,7%', label: 'Тюбика — это УФ-фильтры' },
    { value: '0', label: 'КОЕ на партии' },
  ],

  useCase: {
    eyebrow: 'Для чего он на самом деле',
    title: 'Прикрыть, а не исправить',
    body:
      'Зарегистрированная коробка необычно конкретна: закрывает красноту и несовершенства после дерматологической процедуры и помогает выразить естественный тон кожи. Это более узкое и более полезное обещание, чем даёт большинство базы под макияж, и оно объясняет всю формулу — пигментную нагрузку, SPF, отсутствие отдушки и арбутин под всем этим.',
    items: [
      'Час после микронидлинга, пилинга или лазера, когда всё равно надо выйти',
      'Поверх постакне, пока следы бледнеют, — а не вместо их лечения',
      'Дни, когда защита и покрытие должны быть одним шагом, а не двумя',
      'И под ничего — это финальный шаг, и его достаточно самого по себе',
    ],
  },

  paradox: {
    eyebrow: 'Посмотрите на линейку',
    title: 'Больше всех фильтров и самое низкое число',
    intro:
      'Поставьте три наших SPF-средства рядом, и что-то покажется сломанным. Каждый шаг вниз несёт больше фильтров по массе и получает более низкую степень. Здесь фильтров больше всех, а степень самая низкая.',
    columns: { name: 'Средство', filters: 'Фильтры', load: 'Загрузка', grade: 'Степень' },
    rows: [
      { name: 'Ultra Shield Sun Cream', filters: '6', load: '17,10%', grade: 'SPF50+ / PA++++' },
      { name: 'Multi Sun Cream', filters: '4', load: '18,50%', grade: 'SPF40 / PA++' },
      { name: 'Blemish Balm Cream', filters: '3', load: '19,70%', grade: 'SPF30 / PA++', self: true },
    ],
    body:
      'Две причины, и обе настоящие. В этом тюбике нет фильтра длинного UVA — диоксид титана дотягивается до короткого UVA и останавливается, а два других поглощают UVB. И диоксид титана при 7,70% выполняет сразу две задачи: он и самый крупный фильтр, и белый пигмент, который даёт крему покрытие. Пигмент, распределённый ради плотности, не полностью доступен как УФ-защита, поэтому 7,70% нельзя читать как 7,70% экранирования.',
    aside:
      'Что и есть честный способ сказать: тонирующая база — это компромисс. Вы получаете покрытие, цвет и настоящий SPF30 за один шаг. А если день требует максимальной защиты, наденьте Ultra Shield и нанесите это поверх или оставьте в ящике.',
  },

  actives: {
    eyebrow: 'Три лицензионных',
    title: 'Под что его регистрирует Корея',
    intro:
      'Коробка заявляет средство тройного действия — осветление, уменьшение морщин и защита от УФ — и за каждой функцией стоит ингредиент в той концентрации, которой требует лицензия.',
    items: [
      {
        name: 'Arbutin',
        dose: '2,00%',
        body: 'Функция осветления. Работает с неровным тоном медленно и ровно, а на этом уровне ещё и вызывает обязательное корейское предупреждение — это следующий раздел, а не сноска.',
      },
      {
        name: 'Adenosine',
        dose: '0,04%',
        body: 'Функция морщин, ровно в той дозе, которую лицензирует Корея. То же число стоит в каждом функциональном антивозрастном средстве, зарегистрированном там, включая наш кушон и санскрин.',
      },
      {
        name: 'Три УФ-фильтра',
        dose: '19,70%',
        body: 'Диоксид титана 7,70%, этилгексил метоксициннамат 7,00% и октокрилен 5,00%. Все три измерены в партии, а не просто заявлены.',
      },
    ],
  },

  arbutin: {
    eyebrow: 'На коробке, а теперь и на этой странице',
    title: 'Предупреждение, идущее с арбутином при 2%',
    body:
      'Корея требует конкретного предостережения на любом средстве с арбутином 2% и выше, и на этой коробке оно напечатано. На страницах большинства магазинов его нет, и до сих пор не было на нашей — что неправильно: именно эти 2% и дают право на заявление об осветлении, так что компромисс должен стоять рядом с выгодой.',
    quote:
      'В данных испытаний на людях для средств с тем же ингредиентом (арбутин 2% и выше) отмечались случаи папул и легкого зуда.',
    verdict:
      'На практике: сделайте пробу на линии челюсти в течение двух дней, прежде чем наносить на всё лицо, и особенно прежде чем наносить на кожу, только что прошедшую процедуру. Появилась реакция — прекратите. Это та же рекомендация, которую дала бы клиника, и это не повод избегать арбутина, а повод вводить его так, как вводят любой актив.',
  },

  assay: {
    eyebrow: 'Качество',
    title: 'Измерено, включая самое важное',
    intro:
      'Сертификат анализа измеряет каждый заявленный актив, а не пересказывает рецепт, и делает один тест, который почти никто не публикует.',
    columns: { name: 'Актив', declared: 'Заявлено', found: 'Найдено в партии' },
    rows: [
      { name: 'Titanium Dioxide', declared: '7,70%', found: '7,09%' },
      { name: 'Ethylhexyl Methoxycinnamate', declared: '7,00%', found: '6,31%' },
      { name: 'Octocrylene', declared: '5,00%', found: '4,50%' },
      { name: 'Arbutin', declared: '2,00%', found: '1,81%' },
      { name: 'Adenosine', declared: '0,04%', found: '0,04%' },
    ],
    purity:
      'И главное: гидрохинон менее 1 ppm. Арбутин распадается до гидрохинона, запрещённого в косметике, поэтому бренду, продающему арбутин при 2%, следует проверять на него готовый продукт. Здесь проверяют. Свинец оказался ниже 20 ppm, арсен ниже 10 — это важно для крема, окрашенного оксидами железа.',
  },

  clean: {
    eyebrow: 'Пять вещей, которых в нём нет',
    title: 'Без отдушки, и это подтверждается',
    body:
      'На коробке стоит знак «пять без добавок», и каждый пункт выдерживает проверку количественной формулой. Консервирование берут на себя каприлилгликоль, глицерил каприлат, каприлгидроксамовая кислота, трополон и гександиол.',
    items: ['Без парабенов', 'Без искусственной отдушки', 'Без минерального масла', 'Без этанола', 'Без феноксиэтанола'],
    note:
      'Что стоит знать по линейке: это единственное из трёх наших SPF-средств, в котором парфюма нет вовсе. Multi Sun — отдушка 0,25% с пятью заявленными аллергенами, Ultra Shield — 0,5%. Если ваша проблема именно отдушка, это тот тюбик — прочитайте раздел про арбутин выше и всё равно сделайте пробу.',
  },

  silicone: {
    eyebrow: 'Стоит знать',
    title: 'О силиконах и об одной дате',
    body:
      'Циклопентасилоксан 3,50% и циклогексасилоксан 2,50% — D5 и D6. Именно из-за них крем с почти 20% минеральных фильтров распределяется как лёгкая база, а не как паста. Европейский закон их сворачивает: регламент (EU) 2024/1328 ограничивает оба до 0,1% в несмываемой косметике с 6 июня 2027 года. Основания экологические, а не про безопасность для кожи: оба отнесены к очень стойким и очень биоаккумулятивным, а несмываемая косметика — крупнейший источник выброса. Там, где продаётся это средство, ограничений нет, и пусть дату вы лучше услышите от нас.',
  },

  limits: {
    eyebrow: 'Перед добавлением',
    title: 'Чем он не является',
    intro: 'Четыре вещи, которых это средство действительно не делает и о которых старая страница не говорила.',
    items: [
      'Один оттенок. В формуле единственная система оттенка на оксидах железа, без светлее или темнее. Наш BB-кушон идёт в трёх оттенках, если попадание в тон важнее покрытия.',
      'Не водостойкий. Теста на водостойкость в досье нет, поэтому наносите заново после плавания, пота или полотенца.',
      'Не вегански. Содержит пчелиный воск 2%, который и придаёт крему структуру.',
      'Не самая сильная защита, которую мы продаём. SPF30 / PA++ без фильтра длинного UVA. Для дня на улице это Ultra Shield.',
    ],
  },

  honesty: {
    eyebrow: 'О растительных компонентах',
    title: 'Три из названных ингредиентов — следовые',
    body:
      'Старый список ингредиентов начинался с масла листьев эвкалипта, масла семян периллы и экстракта корня щавеля. В количественной формуле производителя первые два стоят на 50 ppm, третий на 10, рядом с листом орегано и парой из бобов и берёзовой коры того же порядка. Они в списке; работает продукт не из-за них. А из-за арбутина, аденозина, аллантоина при 0,1% и фильтров.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Последний шаг, и в достаточном количестве',
    frequency: 'Ежедневно на лицо и шею · заново после пота или воды',
    steps: [
      {
        title: 'Сначала проба, на линии челюсти',
        body: 'Два дня на небольшом участке до полного лица — из-за арбутина. Сделайте это до того, как планируете носить его на только что обработанной коже, а не после.',
      },
      {
        title: 'После ухода, и под ничего',
        body: 'Возьмите небольшое количество в конце рутины, распределите по направлению рельефа кожи, затем вбейте подушечками пальцев. Это финальный шаг, а не праймер под что-то ещё.',
      },
      {
        title: 'Добавьте там, где нужно прикрыть',
        body: 'Тонкий ровный слой везде, затем второй проход только по красным зонам. Два тонких прохода закрывают лучше одного плотного и продолжают выглядеть кожей.',
      },
      {
        title: 'И заново после пота, воды или полотенца',
        body: 'Это SPF30 без заявленной водостойкости, поэтому любое из этого считайте сбросом. В этом климате обычно означает ещё раз до второй половины дня.',
      },
    ],
    note:
      'Если клиника назначила вам паузу перед макияжем на обработанной зоне, эта инструкция от них и она важнее всего написанного на этой странице.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что в тюбике',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },

  lab: {
    eyebrow: 'Партия',
    title: 'Что говорит сертификат',
    intro: 'Сделано в Корее и выпущено против письменной спецификации, с проверкой и тяжёлых металлов, и продукта распада.',
    rows: [
      { label: 'pH', value: '7,44 при 25 °C, в пределах спецификации 5,50–7,50 — высоко для ухода, нормально для базы с минеральной загрузкой' },
      { label: 'Наполнение', value: '50,1 г при заявленных 50 г' },
      { label: 'Чистота', value: 'Ноль КОЕ на мл — и для бактерий, и для плесеней, при допустимых 100' },
      { label: 'Тяжёлые металлы', value: 'Свинец ниже 20 ppm, арсен ниже 10 — проверены, потому что оттенок даётся оксидами железа' },
      { label: 'Гидрохинон', value: 'Менее 1 ppm — продукт распада арбутина, искали и не нашли' },
      { label: 'Стабильность', value: 'Пройдено циклирование при 4, 25 и 45 °C' },
      { label: 'Лицензия', value: 'Корейское тройное действие: осветление, уменьшение морщин, защита от УФ' },
    ],
    disclaimer:
      'Партия в досье изготовлена в июне 2019 года, так что считайте цифры выше спецификацией, против которой средство выпускают, а не утверждением о тюбике, который сейчас на полке.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Содержит арбутин 2%. Корейские данные испытаний на людях для средств этого уровня отмечают папулы и легкий зуд. Сделайте пробу до первого полного применения.',
      'Только для наружного применения. Избегайте глаз и слизистых, при попадании тщательно промойте прохладной водой.',
      'Не наносите непосредственно вокруг глаз.',
      'Избегайте повреждённой кожи и соблюдайте паузу, назначенную клиникой после процедуры.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Содержит пчелиный воск. Храните в прохладном сухом месте, недоступном для детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, включая раскрытие по арбутину.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '50 г' },
      { label: 'Степень', value: 'SPF30 / PA++ — три фильтра, 19,70% суммарно' },
      { label: 'Оттенок', value: 'Один универсальный, из оксидов железа и диоксида титана' },
      { label: 'Активы', value: 'Арбутин 2,00%, аденозин 0,04%, аллантоин 0,10%' },
      { label: 'Без', value: 'Парабенов, искусственной отдушки, минерального масла, этанола, феноксиэтанола' },
      { label: 'Содержит', value: 'Пчелиный воск 2% и силиконы D5 и D6, 6% суммарно' },
      { label: 'Водостойкость', value: 'Не заявлена — наносите заново после воды или пота' },
      { label: 'Лицензия', value: 'Корейское средство тройного действия' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Почему это SPF30, если фильтров тут больше, чем в вашем SPF50+?',
        a: 'Потому что степень зависит от того, какие длины волн закрывают фильтры и насколько они доступны. Здесь 19,7% фильтров против 17,1% у Ultra Shield, но фильтра длинного UVA нет, а диоксид титана выполняет двойную работу как пигмент покрытия — пигмент, распределённый ради плотности, не полностью доступен как защита. Тонирующая база — компромисс, и SPF30 за один шаг — хороший.',
      },
      {
        q: 'Что это за предупреждение про арбутин?',
        a: 'Корея требует его на любом средстве с арбутином 2% и выше: в данных испытаний на людях отмечались папулы и легкий зуд. Оно напечатано на коробке. Это не повод избегать средства, а повод сначала два дня подержать пробу на линии челюсти — особенно перед нанесением на кожу, только что прошедшую процедуру.',
      },
      {
        q: 'Сколько оттенков?',
        a: 'Один. В формуле единственная система оттенка на оксидах железа, без светлее или темнее. Он сделан нейтрализовать красноту, а не попадать в диапазон тонов кожи, и растушёвывается в прозрачность. Если попадание в тон важнее покрытия, наш BB-кушон идёт в трёх.',
      },
      {
        q: 'Подойдёт ли для чувствительной кожи?',
        a: 'По одной оси — лучше всего, что мы продаём в солнцезащите: без отдушки, этанола, феноксиэтанола, парабенов и минерального масла, и всё это проверено по формуле. По другой оси — арбутин 2% с предупреждением выше. Верно и то, и другое одновременно, так что прочитайте оба и сделайте пробу. Это полезнее, чем «да».',
      },
      {
        q: 'Можно нанести сразу после микронидлинга?',
        a: 'Спросите клинику — это их решение, не наше, и зависит от глубины и от того, что ещё было на коже. Средство создано для периода после этого окна ожидания, когда краснота ещё видна, а показаться на людях всё равно надо.',
      },
      {
        q: 'Он веганский?',
        a: 'Нет. Содержит пчелиный воск 2%, который частично и придаёт крему структуру. Стоит сказать прямо, поскольку раньше на нашем сайте об этом не говорилось нигде.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const BLEMISH_BALM_COPY: Record<Locale, BlemishBalmCopy> = { en: EN, ar: AR, ru: RU }

export function getBlemishBalmCopy(locale: string | undefined): BlemishBalmCopy {
  return BLEMISH_BALM_COPY[(locale as Locale) ?? 'en'] ?? BLEMISH_BALM_COPY.en
}

/** The cushion is the shade-matched sibling; 39 is the stronger sun option. */
export const COMPANION_PRODUCT_IDS = ['41', '39', '13', '16'] as const
