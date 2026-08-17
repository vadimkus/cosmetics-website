/**
 * Bespoke copy for INTENSIVE HYDRO SOOTHING CREAM (product 28).
 *
 * SOURCING — every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_28_HYDRO_SOOTHING_SOURCE_AUDIT.md:
 *   - DTS MG signed Formula_up (finished concentrations, matches the carton INCI
 *     exactly): butylene glycol 10.555%, glycerin 6.175%, BETAINE 5.000%,
 *     1,2-hexanediol 2.002%, carbomer 0.500%, KOH 0.135%, xanthan 0.100%,
 *     Lactobacillus/Pumpkin ferment 0.1000%, aloe 0.0500%, sodium hyaluronate
 *     0.0500%, Phytolex trio 0.00765% combined, snail secretion filtrate
 *     0.0010%, Nelumbo 0.00057%, Prunus Mume 0.00024%, beta-glucan 0.0004%.
 *   - QACS safety assessment E3 14 06 01808: patch test Non Irritant; conclusion
 *     "safe for human health" with no restrictions; supplier trade-name table.
 *   - COA lot WML008: transparent gel cream, pH 6.39, 50.95 g, bacteria and
 *     molds both under 10 cfu/ml, stability at 50 C pass, 3-year life.
 *   - Carton: "Function Hydrating, soothing", PAO 6M, avoid broken skin, do not
 *     use near eyes, and the registered claim about use after skin treatment.
 *   - DTS MG homecare deck CLINICAL TRIAL DATA page: +12% skin hydration after
 *     4 weeks, and -1 C skin temperature 20 minutes after application.
 *   - Protocol_Hydration_Treatment.pdf for the UAE framing: humidity often
 *     under 20%, air conditioning as an "artificial desert indoors".
 *
 * TWO THINGS SHAPE THIS PAGE:
 *   1. BETAINE AT 5% IS THE ENGINE and appeared nowhere in our copy. Together
 *      with butylene glycol and glycerin that is 21.7% humectants. Meanwhile
 *      snail secretion filtrate at 10 ppm was the second ingredient we named,
 *      because the quali-quanti sheet lists its PREMIX at 0.100%.
 *   2. THE COOLING FINDING. The deck records -1 C after 20 minutes, which nobody
 *      has ever used, and which is the more distinctive of the two endpoints in a
 *      country where the brand's own protocol document describes air conditioning
 *      as an artificial desert.
 *
 * ON THE CLINICAL FIGURES: state them, and state their limits in the same breath.
 * The deck gives no CRO, no subject count, no method and no instrument. They are
 * the manufacturer's figures. Do not imply peer review, and do not round up.
 *
 * MUST STAY OUT:
 *   - Any mechanism from the snail secretion filtrate. The deck credits it with
 *     accelerating cell regeneration and stimulating collagen; it is at 10 ppm.
 *   - Any regeneration or anti-ageing claim of the kind the drifted Russian panel
 *     makes. Logged as an artwork error, not reproduced.
 *   - Beta-glucan as a barrier film former. 4 ppm.
 *   - Benzene. The 2014 assessment notes unavoidable carbomer traces; that is an
 *     internal question for DTS MG, not customer copy.
 *   - Anything implying use on open or broken skin.
 *   - The contract manufacturer, and the lot codes.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface HydroSoothingCopy {
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

  /* Two sizes, 50 g and 250 g, both real SKUs with their own prices. A size has to
     travel with every cart call — see the product page component. */
  chooseSize: string
  sizes: {
    homecareLabel: string
    homecareNote: string
    proLabel: string
    proNote: string
  }
  freeDelivery: string

  stats: Array<{ value: string; label: string }>

  clinical: {
    eyebrow: string
    title: string
    intro: string
    findings: Array<{ value: string; label: string; body: string }>
    caveat: string
  }

  climate: {
    eyebrow: string
    title: string
    body: string
  }

  working: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  reorder: {
    eyebrow: string
    title: string
    intro: string
    columns: { name: string; sheet: string; actual: string }
    rows: Array<{ name: string; sheet: string; actual: string; real?: boolean }>
    body: string
  }

  quality: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    patch: string
  }

  preservation: {
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

const EN: HydroSoothingCopy = {
  eyebrow: 'Intensive Hydro Soothing Cream · 50 g homecare · 250 g professional',
  headline: 'It measurably cools skin by a degree.',
  subheadline:
    'A transparent gel-cream that is 21.7% humectant — butylene glycol at 10.6%, glycerin at 6.2% and betaine at a full 5%. The manufacturer\u2019s clinical work records skin temperature down about 1 °C twenty minutes after application, and hydration up 12% after four weeks. In a country where indoor air is drier than the outdoors, the first of those is the more interesting number.',
  heroBullets: [
    '21.7% humectants, including betaine at a full 5%',
    'Skin temperature down about 1 °C, twenty minutes after applying',
    'Hydration up 12% after four weeks of use',
    'No preservative beyond the glycols. Not vegan — contains snail filtrate',
  ],
  badges: ['Made in Korea', '50 g / 250 g', 'EU safety assessed', 'Graded Non Irritant'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  chooseSize: 'Choose your size',
  sizes: {
    homecareLabel: 'Homecare',
    homecareNote: 'The 50 g size, for a daily routine at home',
    proLabel: 'Professional',
    proNote: 'The 250 g size, for clinic use',
  },
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '−1 °C', label: 'Skin temperature after twenty minutes' },
    { value: '+12%', label: 'Hydration after four weeks' },
    { value: '5%', label: 'Betaine' },
    { value: '6M', label: 'Period after opening' },
  ],

  clinical: {
    eyebrow: 'What was measured',
    title: 'Two numbers, and what they are worth',
    intro:
      'Most of the range is sold on its formula. This one has actual measurements behind it, and they were sitting unused in the manufacturer\u2019s own clinical documentation while our website mentioned neither.',
    findings: [
      {
        value: '−1 °C',
        label: 'Skin temperature, twenty minutes after application',
        body: 'The more distinctive of the two, and the one nobody has been using. A degree does not sound like much until you have applied something to skin that feels hot after a treatment, or after a walk between an air-conditioned building and forty-degree air.',
      },
      {
        value: '+12%',
        label: 'Skin hydration, after four weeks of regular use',
        body: 'Modest and believable. This is a 21.7% humectant formula rather than a heavy occlusive, so a steady improvement over a month is the right shape of result to expect from it.',
      },
    ],
    caveat:
      'Both figures come from the manufacturer\u2019s clinical documentation, and we would rather tell you what is missing from it than round the numbers up: it names no testing laboratory, no number of subjects, no measurement method and no instrument. Treat them as the manufacturer\u2019s measurements, honestly reported, and not as a published trial. We have asked for the underlying report.',
  },

  climate: {
    eyebrow: 'Why the cooling matters here',
    title: 'The Gulf has a dehydration problem indoors as well as out',
    body:
      'GENOSYS\u2019s own hydration protocol describes the difficulty plainly: desert humidity often below 20%, air conditioning that runs continuously and creates what the document calls an artificial desert indoors, and the temperature shock of moving between the two several times a day. Skin loses water in both environments, and it is warm in one of them. A gel-cream that is a fifth humectant and measurably takes a degree off skin temperature is a sensible answer to that specific problem, which is not the problem most moisturisers are designed for.',
  },

  working: {
    eyebrow: 'The working formula',
    title: 'What is actually holding the water',
    intro:
      'Three humectants do most of this, and the largest of the three is the one our own marketing never mentioned.',
    items: [
      {
        name: 'Betaine',
        dose: '5.000%',
        body: 'The standout, and a high dose — typical cosmetic use is between 0.5 and 2%. An osmolyte, meaning it helps skin cells hold their own water rather than just sitting on the surface. The manufacturer\u2019s own material credits it with both hydration and calming redness, and it appeared in none of our copy until this page.',
      },
      {
        name: 'Butylene glycol and glycerin',
        dose: '10.555% + 6.175%',
        body: 'With the betaine that is 21.7% humectants, which is the whole design of the product. It is also why this is a transparent gel-cream rather than a rich one: almost nothing here is oil.',
      },
      {
        name: 'Lactobacillus / pumpkin ferment extract',
        dose: '0.1000%',
        body: '1,000 parts per million, so genuinely present rather than a trace. A ferment filtrate, and one of the reasons the formula reads as a light conditioning gel.',
      },
      {
        name: 'Aloe barbadensis leaf extract',
        dose: '0.0500%',
        body: '500 parts per million. Real, modest, and worth naming honestly rather than implying it is the base of the product.',
      },
      {
        name: 'Sodium hyaluronate',
        dose: '0.0500%',
        body: 'Another 500 parts per million, working with the humectants rather than carrying them. If you want hyaluronate as the point of a product, that is our Moisture Replenishing range, not this.',
      },
      {
        name: 'Phytolex SC',
        dose: '0.00765%',
        body: 'The supplier\u2019s name for a three-herb complex: mung bean, birch bark and curled dock root. About 76 parts per million between them. Named because it is a real branded material and it is in the tube, not because 76 ppm is doing the soothing.',
      },
    ],
  },

  reorder: {
    eyebrow: 'A correction worth explaining',
    title: 'Why we used to lead with snail filtrate',
    intro:
      'Until this page our description named snail secretion filtrate second, ahead of everything except aloe. There is an honest reason for the mistake, and it is worth showing, because it explains a lot of ingredient lists across this industry.',
    columns: { name: 'Ingredient', sheet: 'On the supplier sheet', actual: 'Actually in the tube' },
    rows: [
      { name: 'Snail secretion filtrate', sheet: '0.100%', actual: '10 ppm' },
      { name: 'Beta-glucan', sheet: '0.100%', actual: '4 ppm' },
      { name: 'Mung bean extract', sheet: '0.100%', actual: '75 ppm' },
      { name: 'Birch bark extract', sheet: '0.100%', actual: '1 ppm' },
      { name: 'Curled dock root extract', sheet: '0.100%', actual: '0.5 ppm' },
      { name: 'Lactobacillus / pumpkin ferment', sheet: '1.000%', actual: '1,000 ppm', real: true },
      { name: 'Betaine', sheet: '5.000%', actual: '5.000% — unchanged', real: true },
    ],
    body:
      'The supplier sheet lists what goes into the mixing tank, not what ends up in the tube. Snail secretion filtrate arrives as a pre-diluted material that is 1% filtrate and 99% water and glycols, so adding 0.1% of it puts 10 parts per million of filtrate in the finished cream — a hundred times less than the sheet appears to say. Beta-glucan works the same way and lands at 4 ppm. Betaine, by contrast, is added neat, so its 5% is 5%. Read a supplier sheet as a shopping list and you will overstate a trace ingredient by two orders of magnitude, which is exactly what happened to us.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea, released against a written specification, and assessed under European cosmetics law with a clean conclusion and no restrictions attached.',
    rows: [
      { label: 'Appearance', value: 'Transparent gel-cream' },
      { label: 'pH', value: '6.39 at 25 °C, inside a 6.00–7.00 specification' },
      { label: 'Fill', value: '50.95 g against a 50 g declaration' },
      { label: 'Stability', value: 'Passed at 50 °C' },
      { label: 'Purity', value: 'Bacteria and molds both under 10 cfu/ml, against a permitted 100' },
      { label: 'Challenge test', value: 'Performed against E. coli, S. aureus, P. aeruginosa, C. albicans and A. niger, with satisfactory results' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'After opening', value: 'Six months — the 6M symbol is on the carton' },
      { label: 'Assay', value: 'None, because there is no functional active to assay. The registered function is hydrating and soothing' },
    ],
    patch:
      'The patch test came back graded Non Irritant rather than simply passing, and the assessment concludes the product is safe for human health without the "with restrictions" qualifier several other products in the range carry. The assessor notes the volunteer count on the patch test is not statistically significant, so read it as reassurance about the formula rather than proof about your skin.',
  },

  preservation: {
    eyebrow: 'If you screen your ingredients',
    title: 'No conventional preservative, and not vegan',
    body:
      'There is no paraben and no phenoxyethanol in here. Protection comes from the glycols instead — 1,2-hexanediol at 2%, with pentylene and caprylyl glycol — which is why the ingredient list has no recognisable preservative on it. It is also fragrance-free, with no perfume in the formula at all and no declared allergens. What it does contain is snail secretion filtrate at 10 parts per million, so it is not vegan, and we would rather you knew that for ten parts per million than found out later.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Morning and evening, or whenever skin feels hot',
    frequency: 'Twice daily · more when needed · use within 6 months of opening',
    steps: [
      {
        title: 'Onto clean skin, morning and night',
        body: 'The carton asks for a gentle massage until absorbed. It is a transparent gel-cream, so it goes in quickly and leaves no film — that is the humectant load rather than oils doing the work.',
      },
      {
        title: 'Reach for it when skin feels warm',
        body: 'This is the use the measured cooling supports: after a treatment, after sun exposure, or after moving between air conditioning and outdoor heat. About twenty minutes is when the temperature difference was recorded.',
      },
      {
        title: 'Layer it under something richer if you are dry',
        body: 'Almost nothing in here is oil, so on genuinely dry skin it draws water in but does not seal it. Put an occlusive cream over the top in that case — our Multi Functional or ND Cell creams are built for exactly that half of the job.',
      },
      {
        title: 'Sunscreen over it in the morning',
        body: 'Nothing in this formula is photosensitising, but hydrated skin is not protected skin, and the climate that makes this cream useful is the same one that makes sunscreen non-negotiable.',
      },
    ],
    note:
      'Keep it away from the eyes, and do not use it on broken or wounded skin — that instruction is on the carton. The 250 g size is the professional one for treatment rooms; the 50 g tube is the homecare one. Once opened, use either within six months.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the tube',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the carton in your hand.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Contains snail secretion filtrate, so it is not suitable if you avoid animal-derived ingredients.',
      'Do not use on wounded or broken skin — this instruction is on the carton.',
      'For external use only. Do not use near the eyes, and rinse thoroughly with cool water on contact.',
      'Stop and see a doctor if redness, swelling or itching develops.',
      'No perfume in the formula and no declared allergens.',
      'Assessed as safe for human health under EC Regulation 1223/2009 and graded Non Irritant on patch test.',
      'Use within six months of opening. Store cool and dry, out of direct sunlight and out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton, including the Korean panel.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '50 g homecare tube · 250 g professional' },
      { label: 'Texture', value: 'Transparent gel-cream, light' },
      { label: 'Registered function', value: 'Hydrating and soothing. No Korean functional licence, and none claimed' },
      { label: 'Humectants', value: 'Butylene glycol 10.555%, glycerin 6.175%, betaine 5.000% — 21.7% combined' },
      { label: 'Measured', value: 'Skin temperature about −1 °C at twenty minutes; hydration +12% at four weeks' },
      { label: 'Also contains', value: 'Lactobacillus/pumpkin ferment 0.1000%, aloe 0.0500%, sodium hyaluronate 0.0500%' },
      { label: 'Snail secretion filtrate', value: '0.0010% — 10 ppm' },
      { label: 'Preservative', value: 'Glycols only — 1,2-hexanediol 2%, pentylene and caprylyl glycol. No paraben, no phenoxyethanol' },
      { label: 'Fragrance', value: 'None. No perfume in the formula, no declared allergens' },
      { label: 'Not vegan', value: 'Contains snail secretion filtrate' },
      { label: 'pH', value: '6.00–7.00 (6.39 on the batch tested)' },
      { label: 'After opening', value: 'Six months' },
      { label: 'Assessment', value: 'EU safety assessment; patch test graded Non Irritant' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Does it really cool skin?',
        a: 'The manufacturer\u2019s clinical documentation records skin temperature down by an average of about 1 °C twenty minutes after application. We are giving you that figure with its limits attached: it names no laboratory, no subject count and no method, so it is a manufacturer measurement rather than a published trial. It is also consistent with the formula — a 21.7% humectant gel with almost no oil in it behaves that way on warm skin.',
      },
      {
        q: 'Is this a snail cream?',
        a: 'No, and we used to imply otherwise. Snail secretion filtrate is present at 10 parts per million. Our old description named it second because the supplier sheet lists the pre-diluted material at 0.1%, and that material is only 1% filtrate. What actually hydrates this cream is betaine at 5%, butylene glycol at 10.6% and glycerin at 6.2%. It does still contain snail filtrate, so it is not vegan.',
      },
      {
        q: 'What is betaine and why does it matter?',
        a: 'An osmolyte — it helps skin cells hold their own water rather than simply coating the surface. At 5% this is a high dose; typical cosmetic use is between 0.5 and 2%. It is the largest active in the formula and the manufacturer\u2019s own material credits it with hydration and with calming redness. It was missing from every line of copy we had written about this product.',
      },
      {
        q: 'Is it enough on its own for dry skin?',
        a: 'On dehydrated skin, yes. On genuinely dry skin, not by itself — there is almost no oil in here, so it draws water in but does not seal it. Layer an occlusive cream over the top in that case. Think of this as the water half and something like our Multi Functional cream as the lid.',
      },
      {
        q: 'Does it have a fragrance or a preservative?',
        a: 'No perfume at all, and no declared allergens, which is unusual in this range. There is also no paraben or phenoxyethanol — the formula is held by glycols instead, mainly 1,2-hexanediol at 2%. That combination makes it one of the plainer formulas we sell, which is the point on irritated skin.',
      },
      {
        q: 'Why buy the 250 g?',
        a: 'That is the professional size for treatment rooms, where it is used across many clients. The 50 g tube is the homecare one. Same formula in both. Whichever you have, six months after opening is the limit — the 6M symbol is on the carton.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: HydroSoothingCopy = {
  eyebrow: 'كريم الترطيب المكثّف المهدّئ · 50 غ منزلي · 250 غ احترافي',
  headline: 'يبرّد البشرة درجةً واحدة، بالقياس.',
  subheadline:
    'كريم جيلي شفّاف، 21.7% منه مرطّبات جاذبة — بيوتيلين غلايكول بنسبة 10.6%، وغليسرين بنسبة 6.2%، وبيتايين بنسبة 5% كاملة. وتسجّل الأعمال السريرية للشركة انخفاض حرارة البشرة نحو درجة مئوية واحدة بعد عشرين دقيقة من التطبيق، وارتفاع الترطيب 12% بعد أربعة أسابيع. وفي بلد هواؤه الداخلي أجفّ من خارجه، فالأول هو الرقم الأكثر إثارة للاهتمام.',
  heroBullets: [
    '21.7% مرطّبات جاذبة، منها البيتايين بنسبة 5% كاملة',
    'انخفاض حرارة البشرة نحو درجة مئوية، بعد عشرين دقيقة من التطبيق',
    'ارتفاع الترطيب 12% بعد أربعة أسابيع من الاستخدام',
    'لا حافظ غير الغلايكولات. وليس نباتياً — يحتوي مرشّح المحار',
  ],
  badges: ['صُنع في كوريا', '50 غ / 250 غ', 'تقييم سلامة أوروبي', 'مصنّف غير مهيّج'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  chooseSize: 'اختاري الحجم',
  sizes: {
    homecareLabel: 'للاستخدام المنزلي',
    homecareNote: 'حجم 50 غ، لروتين يومي في المنزل',
    proLabel: 'للاستخدام الاحترافي',
    proNote: 'حجم 250 غ، لاستخدام العيادة',
  },
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '−1 °C', label: 'حرارة البشرة بعد عشرين دقيقة' },
    { value: '+12%', label: 'الترطيب بعد أربعة أسابيع' },
    { value: '5%', label: 'بيتايين' },
    { value: '6M', label: 'المدة بعد الفتح' },
  ],

  clinical: {
    eyebrow: 'ما تم قياسه',
    title: 'رقمان، وما يستحقّانه',
    intro:
      'معظم المجموعة يُبَاع بتركيبته. أما هذا فله قياسات فعلية خلفه، وقد كانت قابعة بلا استخدام في وثائق الشركة السريرية بينما لم يذكر موقعنا أيّاً منها.',
    findings: [
      {
        value: '−1 °C',
        label: 'حرارة البشرة، بعد عشرين دقيقة من التطبيق',
        body: 'الأكثر تميّزاً من الاثنين، وهو الذي لم يستخدمه أحد. ودرجة واحدة لا تبدو كثيراً حتى تضعي شيئاً على بشرة تشعر بالحرارة بعد جلسة، أو بعد مشي بين مبنى مكيّف وهواء في الأربعين.',
      },
      {
        value: '+12%',
        label: 'ترطيب البشرة، بعد أربعة أسابيع من الاستخدام المنتظم',
        body: 'متواضع وقابل للتصديق. فهذه تركيبة مرطّبات بنسبة 21.7% لا عازل ثقيل، فتحسّن مطّرد على مدى شهر هو الشكل الصحيح للنتيجة المتوقّعة منها.',
      },
    ],
    caveat:
      'الرقمان مأخوذان من وثائق الشركة السريرية، ونفضّل إخبارك بما ينقصها على تدوير الأرقام إلى أعلى: فهي لا تسمّي مختبر اختبار، ولا عدد مشاركين، ولا طريقة قياس، ولا جهازاً. فاعتبريهما قياسَي الشركة، مبلَّغين بصدق، لا تجربةً منشورة. وقد طلبنا التقرير الأصلي.',
  },

  climate: {
    eyebrow: 'لماذا يهمّ التبريد هنا',
    title: 'للخليج مشكلة جفاف داخل المباني كما خارجها',
    body:
      'يصف بروتوكول الترطيب الخاص بجينوسيس الصعوبة بوضوح: رطوبة صحراوية كثيراً ما تقلّ عن 20%، وتكييف يعمل باستمرار فيخلق ما تسمّيه الوثيقة صحراء اصطناعية داخل المبنى، وصدمة حرارية بالتنقّل بين الاثنين عدة مرات يومياً. والبشرة تفقد الماء في البيئتين، وهي دافئة في إحداهما. وكريم جيلي خُمسه مرطّبات ويخفض حرارة البشرة درجةً بالقياس هو جواب معقول لتلك المشكلة تحديداً، وهي ليست المشكلة التي صُمّم لها معظم المرطّبات.',
  },

  working: {
    eyebrow: 'التركيبة العاملة',
    title: 'ما يحتفظ بالماء فعلاً',
    intro:
      'ثلاثة مرطّبات جاذبة تؤدّي معظم هذا، وأكبرها هو الذي لم يذكره تسويقنا قطّ.',
    items: [
      {
        name: 'Betaine',
        dose: '5.000%',
        body: 'المتميّز، وجرعة عالية — فالاستخدام التجميلي المعتاد بين 0.5 و2%. وهو أوسموليت، أي أنه يساعد خلايا البشرة على الاحتفاظ بمائها لا أن يجلس على السطح فقط. وتنسب مواد الشركة نفسها إليه الترطيب وتهدئة الاحمرار معاً، ولم يظهر في أي من نصوصنا حتى هذه الصفحة.',
      },
      {
        name: 'Butylene Glycol و Glycerin',
        dose: '10.555% + 6.175%',
        body: 'ومع البيتايين تصبح 21.7% مرطّبات جاذبة، وهذا هو تصميم المنتج بأكمله. وهو أيضاً سبب كونه كريماً جيلياً شفّافاً لا غنياً: فلا شيء هنا تقريباً زيت.',
      },
      {
        name: 'مستخلص تخمّر اللاكتوباسيلوس/القرع',
        dose: '0.1000%',
        body: 'ألف جزء من المليون، فهو موجود فعلاً لا أثراً. مرشّح تخمّر، وأحد أسباب قراءة التركيبة كجيل مكيّف خفيف.',
      },
      {
        name: 'مستخلص ورق الألوة',
        dose: '0.0500%',
        body: 'خمسمئة جزء من المليون. حقيقي ومتواضع، ويستحق التسمية بصدق لا الإيحاء بأنه قاعدة المنتج.',
      },
      {
        name: 'Sodium Hyaluronate',
        dose: '0.0500%',
        body: 'خمسمئة جزء آخر من المليون، يعمل مع المرطّبات لا يحملها. وإن أردتِ الهيالورونات كمحور منتج، فتلك مجموعة الترطيب التعويضي لدينا لا هذا.',
      },
      {
        name: 'Phytolex SC',
        dose: '0.00765%',
        body: 'اسم المورّد لمركّب من ثلاث أعشاب: الفاصولياء المُنغ، ولحاء البتولا، وجذر الحُمّاض المجعّد. نحو 76 جزءاً من المليون بينها. ومذكور لأنه مادة مسجّلة حقيقية وهو في الأنبوب، لا لأن 76 جزءاً من المليون هي التي تهدّئ.',
      },
    ],
  },

  reorder: {
    eyebrow: 'تصحيح يستحق التوضيح',
    title: 'لماذا كنّا نتصدّر بمرشّح المحار',
    intro:
      'حتى هذه الصفحة كان وصفنا يسمّي مرشّح إفراز المحار ثانياً، قبل كل شيء إلا الألوة. ولذلك الخطأ سبب صريح يستحق العرض، لأنه يفسّر كثيراً من قوائم المكوّنات في هذه الصناعة.',
    columns: { name: 'المكوّن', sheet: 'على ورقة المورّد', actual: 'في الأنبوب فعلاً' },
    rows: [
      { name: 'مرشّح إفراز المحار', sheet: '0.100%', actual: '10 ppm' },
      { name: 'بيتا-غلوكان', sheet: '0.100%', actual: '4 ppm' },
      { name: 'مستخلص الفاصولياء المُنغ', sheet: '0.100%', actual: '75 ppm' },
      { name: 'مستخلص لحاء البتولا', sheet: '0.100%', actual: '1 ppm' },
      { name: 'مستخلص جذر الحُمّاض', sheet: '0.100%', actual: '0.5 ppm' },
      { name: 'تخمّر اللاكتوباسيلوس/القرع', sheet: '1.000%', actual: '1,000 ppm', real: true },
      { name: 'بيتايين', sheet: '5.000%', actual: '5.000% — بلا تغيير', real: true },
    ],
    body:
      'ورقة المورّد تسرد ما يدخل خزّان الخلط لا ما ينتهي في الأنبوب. فمرشّح إفراز المحار يأتي كمادة مخفّفة مسبقاً قوامها 1% مرشّح و99% ماء وغلايكولات، فإضافة 0.1% منها تضع عشرة أجزاء من المليون من المرشّح في الكريم النهائي — أي مئة ضعف أقل مما تبدو الورقة قائلة. والبيتا-غلوكان يعمل بالطريقة نفسها فيحلّ عند 4 أجزاء من المليون. أما البيتايين فيُضاف صافياً، فـ 5% منه هي 5%. اقرئي ورقة مورّد كقائمة شراء وستضخّمين مكوّناً أثرياً بمرتبتين عشريتين، وهو بالضبط ما حدث لنا.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما تقوله الشهادة',
    intro:
      'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة، وقُيّم وفق قانون مستحضرات التجميل الأوروبي بخلاصة نظيفة بلا قيود مرفقة.',
    rows: [
      { label: 'المظهر', value: 'كريم جيلي شفّاف' },
      { label: 'الحموضة', value: '6.39 عند 25 درجة، ضمن مواصفة 6.00–7.00' },
      { label: 'التعبئة', value: '50.95 غ مقابل 50 غ معلنة' },
      { label: 'الثبات', value: 'ناجح عند 50 درجة' },
      { label: 'النقاء', value: 'البكتيريا والعفن كلاهما أقل من 10 وحدات/مل، مقابل 100 مسموحة' },
      { label: 'اختبار التحدّي', value: 'أُجري ضد الإشريكية القولونية والعنقودية والزائفة والمبيضّات والرشاشية السوداء، بنتائج مُرضية' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات مغلقاً، وتاريخ الانتهاء على العلبة' },
      { label: 'بعد الفتح', value: 'ستة أشهر — ورمز 6M على العلبة' },
      { label: 'القياس', value: 'لا يوجد، لعدم وجود فعّال وظيفي يُقاس. فالوظيفة المسجّلة هي الترطيب والتهدئة' },
    ],
    patch:
      'عاد اختبار اللصقة مصنّفاً «غير مهيّج» لا مجرّد ناجح، ويخلص التقييم إلى أن المنتج آمن لصحة الإنسان بلا قيد «مع قيود» الذي تحمله عدة منتجات أخرى في المجموعة. ويلاحظ المقيّم أن عدد المتطوّعين في اختبار اللصقة ليس ذا دلالة إحصائية، فاقرئيه كطمأنة بشأن التركيبة لا كبرهان بشأن بشرتك.',
  },

  preservation: {
    eyebrow: 'إن كنتِ تفحصين المكوّنات',
    title: 'بلا حافظ تقليدي، وليس نباتياً',
    body:
      'لا بارابين ولا فينوكسي إيثانول هنا. بل تأتي الحماية من الغلايكولات — 1,2-هكسانديول بنسبة 2%، مع البنتيلين والكابريليل غلايكول — ولهذا لا يحمل جدول المكوّنات أي حافظ معروف. وهو أيضاً خالٍ من العطر، بلا أي عطر في التركيبة ولا مسبّبات حساسية معلنة. أما ما يحتويه فهو مرشّح إفراز المحار بعشرة أجزاء من المليون، فهو ليس نباتياً، ونفضّل أن تعرفي ذلك مقابل عشرة أجزاء من المليون على أن تعرفيه لاحقاً.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'صباحاً ومساءً، أو كلما شعرت البشرة بالحرارة',
    frequency: 'مرتين يومياً · وأكثر عند الحاجة · يُستخدم خلال 6 أشهر من الفتح',
    steps: [
      {
        title: 'على بشرة نظيفة، صباحاً ومساءً',
        body: 'تطلب العلبة تدليكاً لطيفاً حتى الامتصاص. وهو كريم جيلي شفّاف فيدخل بسرعة ولا يترك طبقة — وذلك حمل المرطّبات لا الزيوت هو ما يعمل.',
      },
      {
        title: 'امتدّي إليه عندما تشعر البشرة بالدفء',
        body: 'هذا هو الاستخدام الذي يدعمه التبريد المقيس: بعد جلسة، أو بعد التعرّض للشمس، أو بعد التنقّل بين التكييف والحرارة الخارجية. وعشرون دقيقة تقريباً هي حين سُجّل فرق الحرارة.',
      },
      {
        title: 'ضعيه تحت شيء أغنى إن كنتِ جافة',
        body: 'فلا شيء هنا تقريباً زيت، فعلى بشرة جافة فعلاً يجذب الماء لكنه لا يُحكم إغلاقه. ضعي كريماً عازلاً فوقه في تلك الحالة — فكريمانا متعدد الوظائف وإن دي سيل مبنيّان لذلك النصف من المهمّة تحديداً.',
      },
      {
        title: 'واقي الشمس فوقه صباحاً',
        body: 'لا شيء في هذه التركيبة يزيد الحساسية للضوء، لكن البشرة الرطبة ليست بشرة محميّة، والمناخ الذي يجعل هذا الكريم نافعاً هو نفسه الذي يجعل واقي الشمس غير قابل للتفاوض.',
      },
    ],
    note:
      'أبعديه عن العينين، ولا تستخدميه على بشرة مجروحة أو مفتوحة — وهذه التعليمة على العلبة. أما حجم 250 غ فهو الاحترافي لغرف العلاج؛ وأنبوب 50 غ هو المنزلي. وبعد الفتح، استخدمي أيّهما خلال ستة أشهر.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في الأنبوب',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'يحتوي مرشّح إفراز المحار، فهو غير مناسب إن كنتِ تتجنّبين المكوّنات الحيوانية.',
      'لا يُستخدم على بشرة مجروحة أو مفتوحة — وهذه التعليمة على العلبة.',
      'للاستعمال الخارجي فقط. لا يُستخدم قرب العينين، واشطفي جيداً بالماء البارد عند الملامسة.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو حكّة.',
      'لا عطر في التركيبة ولا مسبّبات حساسية معلنة.',
      'قُيّم آمناً لصحة الإنسان وفق اللائحة EC 1223/2009 وصُنّف «غير مهيّج» في اختبار اللصقة.',
      'يُستخدم خلال ستة أشهر من الفتح. يُحفظ بارداً وجافاً بعيداً عن أشعة الشمس المباشرة ومتناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، بما فيها اللوحة الكورية.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: 'أنبوب منزلي 50 غ · واحترافي 250 غ' },
      { label: 'الملمس', value: 'كريم جيلي شفّاف، خفيف' },
      { label: 'الوظيفة المسجّلة', value: 'الترطيب والتهدئة. ولا ترخيص وظيفي كوري، ولا ادّعاء به' },
      { label: 'المرطّبات الجاذبة', value: 'بيوتيلين غلايكول 10.555%، غليسرين 6.175%، بيتايين 5.000% — 21.7% مجتمعةً' },
      { label: 'المقيس', value: 'حرارة البشرة نحو −1 °C عند عشرين دقيقة؛ الترطيب +12% عند أربعة أسابيع' },
      { label: 'ويحتوي أيضاً', value: 'تخمّر لاكتوباسيلوس/قرع 0.1000%، ألوة 0.0500%، صوديوم هيالورونات 0.0500%' },
      { label: 'مرشّح إفراز المحار', value: '0.0010% — 10 أجزاء من المليون' },
      { label: 'الحافظ', value: 'غلايكولات فقط — 1,2-هكسانديول 2%، وبنتيلين وكابريليل غلايكول. لا بارابين ولا فينوكسي إيثانول' },
      { label: 'العطر', value: 'لا يوجد. لا عطر في التركيبة ولا مسبّبات حساسية معلنة' },
      { label: 'ليس نباتياً', value: 'يحتوي مرشّح إفراز المحار' },
      { label: 'الحموضة', value: '6.00–7.00 (6.39 على الدفعة المختبرة)' },
      { label: 'بعد الفتح', value: 'ستة أشهر' },
      { label: 'التقييم', value: 'تقييم سلامة أوروبي؛ اختبار لصقة مصنّف غير مهيّج' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل يبرّد البشرة فعلاً؟',
        a: 'تسجّل وثائق الشركة السريرية انخفاض حرارة البشرة بمعدل نحو درجة مئوية واحدة بعد عشرين دقيقة من التطبيق. ونعطيك ذلك الرقم بحدوده مرفقة: فهو لا يسمّي مختبراً ولا عدد مشاركين ولا طريقة، فهو قياس شركة لا تجربة منشورة. وهو أيضاً متوافق مع التركيبة — فجيل مرطّبات بنسبة 21.7% بلا زيت تقريباً يتصرّف هكذا على بشرة دافئة.',
      },
      {
        q: 'هل هذا كريم محار؟',
        a: 'لا، وكنّا نوحي بغير ذلك. فمرشّح إفراز المحار موجود بعشرة أجزاء من المليون. وكان وصفنا القديم يسمّيه ثانياً لأن ورقة المورّد تسرد المادة المخفّفة مسبقاً عند 0.1%، وتلك المادة 1% مرشّح فقط. أما ما يرطّب هذا الكريم فعلاً فهو البيتايين بنسبة 5%، والبيوتيلين غلايكول بنسبة 10.6%، والغليسرين بنسبة 6.2%. وهو لا يزال يحتوي مرشّح المحار، فهو ليس نباتياً.',
      },
      {
        q: 'ما هو البيتايين ولماذا يهمّ؟',
        a: 'أوسموليت — يساعد خلايا البشرة على الاحتفاظ بمائها لا مجرّد تغليف السطح. وعند 5% فهذه جرعة عالية؛ فالاستخدام التجميلي المعتاد بين 0.5 و2%. وهو أكبر فعّال في التركيبة، وتنسب إليه مواد الشركة نفسها الترطيب وتهدئة الاحمرار. وقد كان غائباً عن كل سطر كتبناه عن هذا المنتج.',
      },
      {
        q: 'هل يكفي وحده للبشرة الجافة؟',
        a: 'للبشرة المجفّفة، نعم. أما للبشرة الجافة فعلاً فلا وحده — فلا زيت هنا تقريباً، فهو يجذب الماء لكنه لا يُحكم إغلاقه. ضعي كريماً عازلاً فوقه في تلك الحالة. اعتبري هذا نصف الماء وشيئاً ككريمنا متعدد الوظائف هو الغطاء.',
      },
      {
        q: 'هل له عطر أو حافظ؟',
        a: 'لا عطر إطلاقاً، ولا مسبّبات حساسية معلنة، وهذا غير معتاد في هذه المجموعة. ولا بارابين ولا فينوكسي إيثانول — بل تحمله الغلايكولات، وأساساً 1,2-هكسانديول بنسبة 2%. وذلك المزيج يجعله من أبسط التركيبات التي نبيعها، وهو المقصود على بشرة متهيّجة.',
      },
      {
        q: 'لماذا أشتري حجم 250 غ؟',
        a: 'هذا هو الحجم الاحترافي لغرف العلاج، حيث يُستخدم على عملاء كثيرين. أما أنبوب 50 غ فهو المنزلي. والتركيبة واحدة في الاثنين. وأياً كان ما لديك، فستة أشهر بعد الفتح هي الحدّ — ورمز 6M على العلبة.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: HydroSoothingCopy = {
  eyebrow: 'Интенсивный увлажняющий успокаивающий крем · 50 г домашний · 250 г профессиональный',
  headline: 'Он измеримо охлаждает кожу на градус.',
  subheadline:
    'Прозрачный гель-крем, 21,7% которого — увлажнители: бутиленгликоль 10,6%, глицерин 6,2% и бетаин в полные 5%. Клиническая работа производителя фиксирует снижение температуры кожи примерно на 1 °C через двадцать минут после нанесения и рост увлажнённости на 12% через четыре недели. В стране, где воздух внутри помещений суше, чем на улице, первая цифра интереснее.',
  heroBullets: [
    '21,7% увлажнителей, включая бетаин в полные 5%',
    'Температура кожи ниже примерно на 1 °C через двадцать минут',
    'Увлажнённость выше на 12% через четыре недели',
    'Никаких консервантов кроме гликолей. Не веганский — содержит фильтрат улитки',
  ],
  badges: ['Сделано в Корее', '50 г / 250 г', 'Оценка безопасности ЕС', 'Оценка: не раздражает'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  chooseSize: 'Выберите объём',
  sizes: {
    homecareLabel: 'Домашний уход',
    homecareNote: 'Объём 50 г, для ежедневного ухода дома',
    proLabel: 'Профессиональный',
    proNote: 'Объём 250 г, для работы в клинике',
  },
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '−1 °C', label: 'Температура кожи через двадцать минут' },
    { value: '+12%', label: 'Увлажнённость через четыре недели' },
    { value: '5%', label: 'Бетаина' },
    { value: '6M', label: 'Срок после вскрытия' },
  ],

  clinical: {
    eyebrow: 'Что измерили',
    title: 'Две цифры и чего они стоят',
    intro:
      'Большая часть линейки продаётся составом. За этим средством стоят реальные измерения — и они лежали без дела в клинической документации производителя, пока наш сайт не упоминал ни одной из них.',
    findings: [
      {
        value: '−1 °C',
        label: 'Температура кожи через двадцать минут после нанесения',
        body: 'Более отличительная из двух и та, которой никто не пользовался. Градус не кажется многим, пока вы не нанесёте что-то на кожу, которая горит после процедуры или после перехода из кондиционируемого здания в сорокаградусный воздух.',
      },
      {
        value: '+12%',
        label: 'Увлажнённость кожи после четырёх недель регулярного применения',
        body: 'Скромно и правдоподобно. Это формула с 21,7% увлажнителей, а не тяжёлый окклюзив, так что ровное улучшение за месяц — именно та форма результата, которую от неё и стоит ждать.',
      },
    ],
    caveat:
      'Обе цифры взяты из клинической документации производителя, и мы предпочтём рассказать, чего в ней не хватает, чем округлить их вверх: там не названы ни лаборатория, ни число участников, ни метод измерения, ни прибор. Считайте это измерениями производителя, честно приведёнными, а не опубликованным исследованием. Мы запросили исходный отчёт.',
  },

  climate: {
    eyebrow: 'Почему охлаждение здесь важно',
    title: 'В Залив проблема обезвоживания приходит и внутрь помещений',
    body:
      'Собственный протокол увлажнения GENOSYS описывает сложность прямо: пустынная влажность нередко ниже 20%, непрерывно работающий кондиционер, создающий то, что документ называет искусственной пустыней в помещении, и температурный шок от перемещения между ними несколько раз в день. Кожа теряет воду в обеих средах, и в одной из них ей жарко. Гель-крем, на пятую часть состоящий из увлажнителей и измеримо снимающий градус с температуры кожи, — разумный ответ именно на эту задачу, а не на ту, под которую спроектировано большинство увлажняющих средств.',
  },

  working: {
    eyebrow: 'Работающая формула',
    title: 'Что действительно удерживает воду',
    intro:
      'Основную работу делают три увлажнителя, и крупнейший из трёх — тот, которого наш маркетинг никогда не упоминал.',
    items: [
      {
        name: 'Betaine',
        dose: '5.000%',
        body: 'Главное, и доза высокая — обычное косметическое применение от 0,5 до 2%. Осмолит: он помогает клеткам кожи удерживать собственную воду, а не просто лежит на поверхности. Материалы самого производителя приписывают ему и увлажнение, и успокоение красноты, а в наших текстах он не появлялся до этой страницы.',
      },
      {
        name: 'Butylene Glycol и Glycerin',
        dose: '10.555% + 6.175%',
        body: 'Вместе с бетаином это 21,7% увлажнителей — в этом весь замысел продукта. Поэтому же это прозрачный гель-крем, а не богатый: масла здесь почти нет.',
      },
      {
        name: 'Экстракт ферментации лактобактерий и тыквы',
        dose: '0.1000%',
        body: 'Тысяча частей на миллион, то есть действительно присутствует, а не следово. Ферментный фильтрат, и одна из причин, по которой формула читается как лёгкий кондиционирующий гель.',
      },
      {
        name: 'Экстракт листа алоэ',
        dose: '0.0500%',
        body: 'Пятьсот частей на миллион. Реально, скромно, и это стоит назвать честно, а не намекать, что он основа продукта.',
      },
      {
        name: 'Sodium Hyaluronate',
        dose: '0.0500%',
        body: 'Ещё пятьсот частей на миллион: работает вместе с увлажнителями, а не несёт их. Если вам нужен гиалуронат как смысл средства, это наша линия Moisture Replenishing, а не это.',
      },
      {
        name: 'Phytolex SC',
        dose: '0.00765%',
        body: 'Название поставщика для комплекса из трёх трав: мунг, берёзовая кора и корень щавеля курчавого. Около 76 частей на миллион на всех. Назван потому, что это реальный брендированный материал и он в тубе, а не потому, что 76 ppm кого-то успокаивают.',
      },
    ],
  },

  reorder: {
    eyebrow: 'Исправление, которое стоит объяснить',
    title: 'Почему мы раньше начинали с фильтрата улитки',
    intro:
      'До этой страницы наше описание называло фильтрат секрета улитки вторым, впереди всего кроме алоэ. У этой ошибки есть честная причина, и её стоит показать, потому что она объясняет очень многие составы в этой индустрии.',
    columns: { name: 'Ингредиент', sheet: 'В листе поставщика', actual: 'Фактически в тубе' },
    rows: [
      { name: 'Фильтрат секрета улитки', sheet: '0,100%', actual: '10 ppm' },
      { name: 'Бета-глюкан', sheet: '0,100%', actual: '4 ppm' },
      { name: 'Экстракт мунга', sheet: '0,100%', actual: '75 ppm' },
      { name: 'Экстракт берёзовой коры', sheet: '0,100%', actual: '1 ppm' },
      { name: 'Экстракт корня щавеля', sheet: '0,100%', actual: '0,5 ppm' },
      { name: 'Фермент лактобактерий и тыквы', sheet: '1,000%', actual: '1 000 ppm', real: true },
      { name: 'Бетаин', sheet: '5,000%', actual: '5,000% — без изменений', real: true },
    ],
    body:
      'Лист поставщика перечисляет то, что попадает в смесительный чан, а не то, что оказывается в тубе. Фильтрат секрета улитки поставляется как предразведённое сырьё: 1% фильтрата и 99% воды и гликолей, — так что добавление 0,1% этого сырья даёт десять частей на миллион фильтрата в готовом креме, в сто раз меньше, чем лист как будто говорит. С бета-глюканом то же самое, и он приходит к 4 ppm. А бетаин добавляют неразведённым, поэтому его 5% — это 5%. Прочитайте лист поставщика как список покупок, и вы преувеличите следовой ингредиент на два порядка, что с нами и произошло.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что говорит сертификат',
    intro:
      'Сделано в Корее, выпущено против письменной спецификации и оценено по европейскому косметическому закону с чистым заключением без каких-либо ограничений.',
    rows: [
      { label: 'Внешний вид', value: 'Прозрачный гель-крем' },
      { label: 'pH', value: '6,39 при 25 °C, в пределах спецификации 6,00–7,00' },
      { label: 'Наполнение', value: '50,95 г при заявленных 50 г' },
      { label: 'Стабильность', value: 'Пройдена при 50 °C' },
      { label: 'Чистота', value: 'Бактерии и плесень — обе менее 10 КОЕ/мл при допустимых 100' },
      { label: 'Челлендж-тест', value: 'Проведён против E. coli, S. aureus, P. aeruginosa, C. albicans и A. niger с удовлетворительным результатом' },
      { label: 'Срок годности', value: 'Три года закрытым, дата на коробке' },
      { label: 'После вскрытия', value: 'Шесть месяцев — символ 6M есть на коробке' },
      { label: 'Измерение актива', value: 'Отсутствует, измерять нечего: зарегистрированная функция — увлажнение и успокоение' },
    ],
    patch:
      'Патч-тест вернулся с оценкой «не раздражает», а не просто «пройден», и заключение признаёт продукт безопасным для здоровья человека без оговорки «с ограничениями», которую несут несколько других средств линейки. Оценщик отмечает, что число добровольцев в патч-тесте статистически незначимо, так что читайте это как уверенность в формуле, а не как доказательство про вашу кожу.',
  },

  preservation: {
    eyebrow: 'Если вы читаете составы',
    title: 'Без обычного консерванта и не веганский',
    body:
      'Здесь нет ни парабена, ни феноксиэтанола. Защиту дают гликоли — 1,2-гександиол 2% вместе с пентилен- и каприлилгликолем, — поэтому в составе и нет ни одного узнаваемого консерванта. Средство также без аромата: отдушки в формуле нет вовсе и заявленных аллергенов нет. А что в нём есть — это фильтрат секрета улитки в концентрации десять частей на миллион, поэтому он не веганский, и мы предпочтём, чтобы вы узнали это из-за десяти частей на миллион, чем выяснили потом.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Утром и вечером или когда коже жарко',
    frequency: 'Дважды в день · чаще при необходимости · использовать в течение 6 месяцев после вскрытия',
    steps: [
      {
        title: 'На чистую кожу, утром и вечером',
        body: 'Коробка просит мягко массировать до впитывания. Это прозрачный гель-крем, поэтому он уходит быстро и не оставляет плёнки — работает загрузка увлажнителями, а не масла.',
      },
      {
        title: 'Берите его, когда коже жарко',
        body: 'Именно это применение поддерживает измеренное охлаждение: после процедуры, после солнца или после перехода между кондиционером и уличной жарой. Разница температур зафиксирована примерно на двадцатой минуте.',
      },
      {
        title: 'Слоями под что-то более богатое, если вы сухая',
        body: 'Масла здесь почти нет, поэтому на действительно сухой коже он втягивает воду, но не запечатывает её. В этом случае нанесите сверху окклюзивный крем — наши Multi Functional и ND Cell построены именно под эту половину задачи.',
      },
      {
        title: 'Утром сверху санскрин',
        body: 'В формуле нет ничего фотосенсибилизирующего, но увлажнённая кожа — не защищённая кожа, а климат, который делает этот крем полезным, тот же, что делает санскрин обязательным.',
      },
    ],
    note:
      'Держите его подальше от глаз и не наносите на повреждённую или открытую кожу — это указание есть на коробке. Размер 250 г — профессиональный, для кабинета; туба 50 г — домашняя. После вскрытия используйте любую в течение шести месяцев.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что в тубе',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Содержит фильтрат секрета улитки, поэтому не подходит, если вы избегаете ингредиентов животного происхождения.',
      'Не наносите на повреждённую или открытую кожу — это указание есть на коробке.',
      'Только для наружного применения. Не наносите рядом с глазами, при попадании тщательно промойте прохладной водой.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или зуде.',
      'Отдушки в формуле нет, заявленных аллергенов нет.',
      'Оценено как безопасное для здоровья человека по регламенту EC 1223/2009, патч-тест — «не раздражает».',
      'Использовать в течение шести месяцев после вскрытия. Хранить в прохладном сухом месте, вне прямого солнца и вне доступа детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, включая корейскую панель.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: 'Домашняя туба 50 г · профессиональный 250 г' },
      { label: 'Текстура', value: 'Прозрачный гель-крем, лёгкий' },
      { label: 'Зарегистрированная функция', value: 'Увлажнение и успокоение. Корейской функциональной лицензии нет, и она не заявляется' },
      { label: 'Увлажнители', value: 'Бутиленгликоль 10,555%, глицерин 6,175%, бетаин 5,000% — суммарно 21,7%' },
      { label: 'Измерено', value: 'Температура кожи около −1 °C на двадцатой минуте; увлажнённость +12% на четвёртой неделе' },
      { label: 'Также содержит', value: 'Фермент лактобактерий и тыквы 0,1000%, алоэ 0,0500%, гиалуронат натрия 0,0500%' },
      { label: 'Фильтрат секрета улитки', value: '0,0010% — 10 ppm' },
      { label: 'Консервант', value: 'Только гликоли — 1,2-гександиол 2%, пентилен- и каприлилгликоль. Без парабена и феноксиэтанола' },
      { label: 'Отдушка', value: 'Нет. Отдушки в формуле нет, заявленных аллергенов нет' },
      { label: 'Не веганский', value: 'Содержит фильтрат секрета улитки' },
      { label: 'pH', value: '6,00–7,00 (6,39 в измеренной партии)' },
      { label: 'После вскрытия', value: 'Шесть месяцев' },
      { label: 'Оценка', value: 'Оценка безопасности ЕС; патч-тест «не раздражает»' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Он действительно охлаждает кожу?',
        a: 'Клиническая документация производителя фиксирует снижение температуры кожи в среднем примерно на 1 °C через двадцать минут после нанесения. Мы даём вам эту цифру вместе с её границами: там не названы ни лаборатория, ни число участников, ни метод, так что это измерение производителя, а не опубликованное исследование. Оно также согласуется с формулой: гель с 21,7% увлажнителей и почти без масла именно так и ведёт себя на тёплой коже.',
      },
      {
        q: 'Это улиточный крем?',
        a: 'Нет, а раньше мы намекали на обратное. Фильтрат секрета улитки присутствует в концентрации десять частей на миллион. Наше старое описание называло его вторым, потому что лист поставщика указывает предразведённое сырьё как 0,1%, а в этом сырье фильтрата всего 1%. Увлажняют этот крем бетаин 5%, бутиленгликоль 10,6% и глицерин 6,2%. Фильтрат улитки в нём всё же есть, поэтому он не веганский.',
      },
      {
        q: 'Что такое бетаин и почему это важно?',
        a: 'Осмолит: он помогает клеткам кожи удерживать собственную воду, а не просто покрывает поверхность. При 5% это высокая доза — обычно применяют от 0,5 до 2%. Это крупнейший актив формулы, и материалы самого производителя приписывают ему увлажнение и успокоение красноты. В наших текстах об этом продукте его не было ни в одной строке.',
      },
      {
        q: 'Хватит ли его одного для сухой кожи?',
        a: 'Для обезвоженной — да. Для действительно сухой — сам по себе нет: масла здесь почти нет, поэтому он втягивает воду, но не запечатывает её. В этом случае нанесите сверху окклюзивный крем. Считайте это водной половиной, а что-то вроде нашего Multi Functional — крышкой.',
      },
      {
        q: 'Есть ли отдушка или консервант?',
        a: 'Отдушки нет совсем, заявленных аллергенов нет — для этой линейки необычно. Парабена и феноксиэтанола тоже нет: формулу держат гликоли, прежде всего 1,2-гександиол 2%. Такое сочетание делает его одной из самых простых формул, что мы продаём, и на раздражённой коже в этом и смысл.',
      },
      {
        q: 'Зачем брать 250 г?',
        a: 'Это профессиональный размер для кабинетов, где им пользуются на многих клиентах. Туба 50 г — домашняя. Формула в обоих одна. В любом случае предел — шесть месяцев после вскрытия, символ 6M есть на коробке.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const HYDRO_SOOTHING_COPY: Record<Locale, HydroSoothingCopy> = { en: EN, ar: AR, ru: RU }

export function getHydroSoothingCopy(locale: string | undefined): HydroSoothingCopy {
  return HYDRO_SOOTHING_COPY[(locale as Locale) ?? 'en'] ?? HYDRO_SOOTHING_COPY.en
}

/** The occlusive lid, the postcream, the hyaluron cream and the mist. */
export const COMPANION_PRODUCT_IDS = ['32', '25', '29', '14'] as const
