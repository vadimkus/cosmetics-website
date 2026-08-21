/**
 * Bespoke copy for HR³ MATRIX HAIR TONIC α (product 43).
 *
 * SOURCING — every figure traces to the line audit in
 * docs/SESSION_CHANGES_2026-08-17_HR3_MATRIX_LINE_SOURCE_AUDIT.md:
 *   - DTS MG signed formula: alcohol denat. 9.500%, dipropylene glycol 3.000%,
 *     ethoxydiglycol 1.000%, 1,2-hexanediol 0.530%, menthol 0.300%, sodium citrate
 *     and PEG-60 HCO 0.300%, salicylic acid 0.250%, panthenol 0.200%, allantoin
 *     0.100%, menthyl lactate and methyl diisopropyl propionamide 0.040% each,
 *     acorus calamus 250 ppm, centella 50 ppm, scutellaria and polygonum 20 ppm,
 *     caffeine / sophora / licorice / camellia 10 ppm, copper tripeptide-1 1 ppm.
 *   - COA lot NF002 (GENIC): THREE actives assayed — dexpanthenol 103.40% of
 *     0.2%, L-menthol 99.37% of 0.3%, salicylic acid 101.28% of 0.25%. pH 4.38,
 *     specific gravity 0.9711, 71.31 ml, bacteria <10 cfu, three pathogens not
 *     detected.
 *   - Safety assessment ID 13 06 02081: patch test is a HUMAN REPEAT INSULT PATCH
 *     TEST by BioScreen Testing Services, Inc — "No identifiable signs or symptoms
 *     of primary irritation or sensitization (contact allergy)". An application
 *     test by Centrum Kosmetyków Dr Piotr Koziej is named with no results given.
 *   - Registered carton: English function "Scalp nourishing, hair conditioning".
 *     Application: spray morning and evening, circular massage, DO NOT WASH OFF,
 *     leave at least 3-4 hours. PAO 3M. Not for children under 3. Korean panel
 *     precaution 7 carries the salicylate contraindication list.
 *
 * FRAMING DECISION (owner, 17 Aug): follow the ENGLISH panel. This is a scalp
 * toner. NO hair-loss claim, and no mention of the Korean functional designation —
 * we do not hold that filing, and it appears only on the Korean, Russian and
 * Arabic panels.
 *
 * THE SAFETY BLOCK COMES FIRST. The Korean panel tells people with salicylate
 * sensitivity, diabetes, circulatory disorders, renal impairment, active infection
 * or a reddened scalp, and anyone menstruating, pregnant or possibly pregnant, to
 * AVOID the product because existing symptoms may worsen. That appears on no other
 * panel and was nowhere on our site. Given diabetes prevalence in the UAE it leads.
 *
 * THE HONEST SELLING POINT is the certificate. Three functional actives measured
 * on the batch — dexpanthenol, L-menthol and salicylic acid — is the best quality
 * document in the whole GENOSYS range. Lead the quality section on it.
 *
 * MUST NEVER BE ADDED:
 *   - The Russian panel's "inhibits 5α-reductase activation, suppresses
 *     dihydrotestosterone production" and "stimulates the growth of new hair".
 *     That is the mechanism of finasteride, a prescription medicine.
 *   - Any hair-loss, regrowth, density or shedding claim of any kind.
 *   - The Korean functional designation, per the framing decision.
 *   - Any mechanism from caffeine (10 ppm), copper tripeptide-1 (1 ppm) or the
 *     botanicals (5-250 ppm).
 *   - The contract manufacturer, and the lot code.
 */

import { HAIR_TONIC_AR, HAIR_TONIC_RU } from './hairTonicLocalizedCopy'

export type Locale = 'en' | 'ar' | 'ru'

export interface HairTonicCopy {
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

  avoid: {
    eyebrow: string
    title: string
    body: string
    items: string[]
    detail: string
  }

  assay: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ name: string; declared: string; measured: string }>
    body: string
  }

  working: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  trace: {
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

  quality: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string }>
    patch: string
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

const EN: HairTonicCopy = {
  eyebrow: 'HR³ MATRIX Hair Tonic α · 70 ml',
  headline: 'Three actives, all three measured on the batch.',
  subheadline:
    'Dexpanthenol at 0.2%, L-menthol at 0.3% and salicylic acid at 0.25% — and unusually, the certificate assays all three rather than declaring them. They came back at 103.40%, 99.37% and 101.28% of the stated amounts. Nearly a tenth of the bottle is alcohol, which is why it dries in seconds and leaves nothing behind. A leave-on scalp toner, not a hair-loss treatment.',
  heroBullets: [
    'All three actives assayed on the batch, not just declared',
    'Menthol 0.3% plus two more cooling agents — this is the sensation',
    '9.5% alcohol, so it dries fast and leaves no residue',
    'Read the precautions: salicylic acid brings a real avoid list',
  ],
  badges: ['Made in Korea', '70 ml', 'Three actives assayed', 'HRIPT tested'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '3', label: 'Actives measured on the batch' },
    { value: '9.5%', label: 'Denatured alcohol' },
    { value: '0.3%', label: 'Menthol, assayed at 99.37%' },
    { value: '3M', label: 'Use within three months of opening' },
  ],

  avoid: {
    eyebrow: 'Read this before you buy',
    title: 'The salicylic acid brings a real avoid list',
    body:
      'At 0.25%, the salicylic acid in this tonic is doing genuine work — and it comes with genuine restrictions. The manufacturer\u2019s Korean panel says to avoid the product entirely if any of the following applies to you, because it may worsen an existing condition. None of this was on our site before, and it should have been.',
    items: [
      'Known sensitivity to salicylic acid or salicylates',
      'Diabetes',
      'Circulatory disorders',
      'Renal impairment',
      'An active scalp infection, or a scalp that is currently red and inflamed',
      'Menstruation, pregnancy, or the possibility of pregnancy',
    ],
    detail:
      'It is also not for children under three years of age, which is printed on the English panel. If you are on any scalp medication or under dermatological care, take the ingredient list to whoever is treating you before you start. We would rather lose the sale than have you find this out afterwards.',
  },

  assay: {
    eyebrow: 'The best certificate in the range',
    title: 'Declared is one thing. Measured is another.',
    intro:
      'Most cosmetic certificates confirm appearance, pH and that nothing is growing in the bottle. This one assays every functional active in the formula against its declared concentration, which no other GENOSYS product manages. Here is what the batch returned.',
    rows: [
      { name: 'Dexpanthenol', declared: '0.2%', measured: '103.40%' },
      { name: 'L-menthol', declared: '0.3%', measured: '99.37%' },
      { name: 'Salicylic acid', declared: '0.25%', measured: '101.28%' },
    ],
    body:
      'Read those as percentages of the declared amount, against a specification of at least 90% in each case. So the panthenol came back slightly over, the menthol a shade under, the salicylic acid slightly over — all three verified rather than assumed. It is a small thing that tells you something real about how the product is released, and it is the honest reason to buy this tonic over one that simply lists the same ingredients.',
  },

  working: {
    eyebrow: 'The working formula',
    title: 'What is actually in the bottle',
    intro:
      'A scalp tonic has to deliver something and then get out of the way. This one is mostly water and alcohol carrying five ingredients at doses that do something, and a long tail of botanicals that do not.',
    items: [
      {
        name: 'Alcohol denat.',
        dose: '9.500%',
        body: 'Nearly a tenth of the bottle. It carries the actives, dries in seconds and leaves no film, which is what makes a twice-daily leave-on tonic wearable at all. It is also the ingredient most likely to sting a scalp that is already sore, and the reason the specific gravity comes in below water at 0.9711.',
      },
      {
        name: 'Menthol, with two more cooling agents',
        dose: '0.300% + 0.080%',
        body: 'Menthol at 0.300%, then menthyl lactate and methyl diisopropyl propionamide at 0.040% each. Three cooling agents rather than one: menthol gives the immediate hit, the other two carry it on. This is the sensation the product is genuinely selling, and the menthol is assayed.',
      },
      {
        name: 'Salicylic acid',
        dose: '0.250%',
        body: 'A keratolytic at a working dose, which is what actually keeps the scalp feeling clear over weeks rather than hours. It is also the source of the avoid list above, and it is assayed on the batch.',
      },
      {
        name: 'Panthenol',
        dose: '0.200%',
        body: 'Vitamin B5, conditioning, and the third of the three assayed actives. The certificate calls it dexpanthenol and measured it at 103.40% of declaration.',
      },
      {
        name: 'Allantoin',
        dose: '0.100%',
        body: 'A working dose for comfort, which matters on a formula carrying both alcohol and a keratolytic.',
      },
      {
        name: 'Acorus calamus root and centella asiatica',
        dose: '250 ppm + 50 ppm',
        body: 'Modest but not trivial, and the only two botanicals in the formula present in amounts worth naming.',
      },
    ],
  },

  trace: {
    eyebrow: 'Proportion',
    title: 'About the caffeine and the copper peptide',
    body:
      'Our own description used to open its ingredient list with copper tripeptide-1, then Sophora japonica, then caffeine. Those are at 1, 10 and 10 parts per million respectively. Worth knowing if caffeine is what you came for: the MEDI Scalp Shampoo in this same line carries caffeine at a full 1% — a hundred times more than this tonic — so if that is the ingredient you want, the shampoo is where it actually is. What this tonic does well is cool, clear and condition, with all three of those actives measured.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Spray, massage, and then leave it alone',
    frequency: 'Morning and evening · leave 3–4 hours minimum · do not rinse',
    steps: [
      {
        title: 'Onto the scalp, not the hair',
        body: 'Part the hair and spray directly onto the scalp. The point is contact with skin — spraying it over the top of dry hair mostly wastes it.',
      },
      {
        title: 'Massage in circles',
        body: 'The carton specifies circular massage, and it is worth the thirty seconds. It spreads the tonic across the scalp rather than leaving it in the few spots you sprayed.',
      },
      {
        title: 'Leave it at least three to four hours',
        body: 'This is the instruction most people miss. It is a leave-on: do not wash it off, and give it hours rather than minutes. That is also why the alcohol matters — nothing else would be tolerable sitting on the scalp that long.',
      },
      {
        title: 'Morning and evening',
        body: 'Twice daily is the stated routine. Practically, most people find the evening application easiest to leave in overnight and the morning one fits after a shower, once the scalp is dry.',
      },
    ],
    note:
      'Keep it away from the eyes — it is a spray with 9.5% alcohol and 0.3% menthol in it, and it will hurt. If you use the MEDI Scalp Shampoo from the same line, wash first, dry the scalp, then apply this. And use the bottle within three months of opening, which is the shortest period in our whole range.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea and released against a written specification that includes an assay for every functional active. The safety assessment is also unusual: the sensitisation test is a full Human Repeat Insult Patch Test rather than a single-application patch test.',
    rows: [
      { label: 'Appearance', value: 'Colourless transparent, non-viscous liquid' },
      { label: 'pH', value: '4.38 at 25 °C, inside a 3.0–5.0 specification' },
      { label: 'Specific gravity', value: '0.9711 — below water, from the alcohol' },
      { label: 'Fill', value: '71.31 ml against a 70 ml declaration' },
      { label: 'Dexpanthenol', value: 'Assayed at 103.40% of the declared 0.2%' },
      { label: 'L-menthol', value: 'Assayed at 99.37% of the declared 0.3%' },
      { label: 'Salicylic acid', value: 'Assayed at 101.28% of the declared 0.25%' },
      { label: 'Purity', value: 'Under 10 cfu/ml bacteria, against a permitted 100' },
      { label: 'Pathogens', value: 'S. aureus, P. aeruginosa and C. albicans — all not detected' },
      { label: 'After opening', value: 'Three months' },
    ],
    patch:
      'The sensitisation test on file is a Human Repeat Insult Patch Test, carried out by an independent laboratory, and it concluded "no identifiable signs or symptoms of primary irritation or sensitization". That is a more demanding test than the single-application patch tests behind most "dermatologically tested" claims, because it looks for allergy developing over repeated exposure rather than irritation on first contact. A separate application test by a named laboratory is also referenced in the assessment, but no results for it are recorded in the documents we hold, so we are not claiming any.',
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
      'Avoid entirely if you have salicylate sensitivity, diabetes, a circulatory disorder, renal impairment, an active scalp infection or a red and inflamed scalp.',
      'Avoid during menstruation, pregnancy, or if pregnancy is possible.',
      'Not for children under 3 years of age.',
      'Contains 9.5% denatured alcohol and 0.3% menthol. Keep away from the eyes; rinse immediately with water on contact.',
      'For external use only, on the scalp. Do not use on broken or wounded skin.',
      'Stop and see a doctor if redness, swelling or itching develops.',
      'Store cool and dry, out of direct sunlight and out of reach of children.',
      'Use within three months of opening.',
    ],
    note: 'Precautions as printed on the GENOSYS carton, including the fuller Korean panel.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '70 ml, spray' },
      { label: 'Texture', value: 'Colourless transparent liquid, water-thin' },
      { label: 'Registered function', value: 'Scalp nourishing, hair conditioning' },
      { label: 'Assayed actives', value: 'Dexpanthenol 0.2%, L-menthol 0.3%, salicylic acid 0.25% — all three measured' },
      { label: 'Alcohol', value: 'Alcohol denat. 9.500%' },
      { label: 'Cooling', value: 'Menthol 0.300%, menthyl lactate 0.040%, methyl diisopropyl propionamide 0.040%' },
      { label: 'Also at dose', value: 'Allantoin 0.100%, acorus calamus 250 ppm, centella asiatica 50 ppm' },
      { label: 'At trace', value: 'Caffeine 10 ppm, Sophora japonica 10 ppm, copper tripeptide-1 1 ppm' },
      { label: 'pH', value: '3.0–5.0 (4.38 on the batch tested)' },
      { label: 'Sensitisation test', value: 'Human Repeat Insult Patch Test — no irritation or sensitisation identified' },
      { label: 'Avoid if', value: 'Salicylate sensitivity, diabetes, circulatory disorders, renal impairment, pregnancy, menstruation' },
      { label: 'Not for', value: 'Children under 3. Keep away from the eyes' },
      { label: 'After opening', value: 'Three months' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Will this stop my hair falling out?',
        a: 'We are not going to tell you that. Outside Korea this product is registered as a scalp toner — the carton\u2019s function line reads "scalp nourishing, hair conditioning" — and that is the claim we will stand behind. What it demonstrably does is cool the scalp, keep it feeling clear with salicylic acid at a measured 0.25%, and condition with panthenol at a measured 0.2%. If you are losing hair, that is a conversation for a doctor, not a tonic.',
      },
      {
        q: 'What does "assayed" actually mean here?',
        a: 'It means the laboratory measured how much of each active is in the batch, rather than the manufacturer simply declaring what went in. Dexpanthenol came back at 103.40% of its declared 0.2%, L-menthol at 99.37% of 0.3%, salicylic acid at 101.28% of 0.25%, all against a minimum of 90%. No other product we sell has all of its actives measured this way.',
      },
      {
        q: 'Is 9.5% alcohol a problem?',
        a: 'It depends on your scalp. It is what makes the tonic dry in seconds, leave no residue and stay tolerable sitting on the skin for three or four hours, which is what the instructions ask for. On a sensitive, flaking or already-irritated scalp, twice daily may be too much — start once a day in the evening and see. On a scalp that runs oily, the alcohol is the point.',
      },
      {
        q: 'Why the long list of people who should avoid it?',
        a: 'The salicylic acid. At 0.25% it is a real keratolytic dose, and salicylates carry established cautions — the manufacturer\u2019s own Korean panel lists diabetes, circulatory disorders, renal impairment, active infection, pregnancy and menstruation. That list was on the Korean panel and on no other, including the English one, and it was missing from our site until now.',
      },
      {
        q: 'It says caffeine on the label. How much?',
        a: 'Ten parts per million, which is not a dose anyone should buy the product for. If caffeine is what you are after, the MEDI Scalp Shampoo in this same line has it at a full 1% — a hundred times more. We would rather point you at the right product than let the ingredient list do the selling.',
      },
      {
        q: 'Why only three months after opening?',
        a: 'That is what the carton specifies, and it is the shortest period of any product we sell. At 70 ml used twice daily you will finish the bottle inside that window comfortably, so in practice it rarely bites — but it is worth knowing before you buy two.',
      },
    ],
  },

  backToProducts: 'Products',
}

const _AR: HairTonicCopy = {
  eyebrow: 'تونيك الشعر إتش آر³ ماتريكس α · 70 مل',
  headline: 'ثلاثة فعّالات، وثلاثتها مقيسة على الدفعة.',
  subheadline:
    'ديكسبانثينول بنسبة 0.2%، ول-منثول بنسبة 0.3%، وحمض الساليسيليك بنسبة 0.25% — وبصورة غير معتادة، تقيس الشهادة ثلاثتها لا تكتفي بإعلانها. وقد عادت عند 103.40% و99.37% و101.28% من الكمّيات المذكورة. ونحو عُشر العبوة كحول، ولهذا يجفّ في ثوانٍ ولا يترك شيئاً. تونيك لفروة الرأس يُترك عليها، لا علاج لتساقط الشعر.',
  heroBullets: [
    'الفعّالات الثلاثة كلها مقيسة على الدفعة لا معلنة فقط',
    'منثول 0.3% مع عاملَي تبريد آخرين — وهذا هو الإحساس',
    'كحول بنسبة 9.5%، فيجفّ سريعاً ولا يترك أثراً',
    'اقرئي الاحتياطات: حمض الساليسيليك يجلب قائمة تجنّب حقيقية',
  ],
  badges: ['صُنع في كوريا', '70 مل', 'ثلاثة فعّالات مقيسة', 'اختبار HRIPT'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '3', label: 'فعّالات مقيسة على الدفعة' },
    { value: '9.5%', label: 'كحول مُمَوَّه' },
    { value: '0.3%', label: 'منثول، مقيس عند 99.37%' },
    { value: '3M', label: 'يُستخدم خلال ثلاثة أشهر من الفتح' },
  ],

  avoid: {
    eyebrow: 'اقرئي هذا قبل الشراء',
    title: 'حمض الساليسيليك يجلب قائمة تجنّب حقيقية',
    body:
      'عند 0.25%، يؤدّي حمض الساليسيليك في هذا التونيك عملاً حقيقياً — ويأتي بقيود حقيقية. وتقول اللوحة الكورية للشركة بتجنّب المنتج تماماً إن كان أيٌّ من التالي ينطبق عليك، لأنه قد يفاقم حالة قائمة. ولم يكن أيٌّ من هذا على موقعنا سابقاً، وكان ينبغي أن يكون.',
    items: [
      'حساسية معروفة لحمض الساليسيليك أو الساليسيلات',
      'السكّري',
      'اضطرابات الدورة الدموية',
      'قصور الكلى',
      'عدوى نشطة في فروة الرأس، أو فروة محمرّة وملتهبة حالياً',
      'الحيض أو الحمل أو احتمال الحمل',
    ],
    detail:
      'وهو أيضاً ليس للأطفال تحت سن الثالثة، وهذا مطبوع على اللوحة الإنجليزية. وإن كنتِ على أي دواء لفروة الرأس أو تحت رعاية جلدية، فخذي قائمة المكوّنات إلى من يعالجك قبل البدء. نفضّل خسارة البيع على أن تعرفي هذا لاحقاً.',
  },

  assay: {
    eyebrow: 'أفضل شهادة في المجموعة',
    title: 'المعلن شيء. والمقيس شيء آخر.',
    intro:
      'معظم شهادات مستحضرات التجميل تؤكّد المظهر والحموضة وأن لا شيء ينمو في العبوة. أما هذه فتقيس كل فعّال وظيفي في التركيبة مقابل تركيزه المعلن، وهو ما لا يحقّقه أي منتج جينوسيس آخر. وهذا ما أعادته الدفعة.',
    rows: [
      { name: 'ديكسبانثينول', declared: '0.2%', measured: '103.40%' },
      { name: 'ل-منثول', declared: '0.3%', measured: '99.37%' },
      { name: 'حمض الساليسيليك', declared: '0.25%', measured: '101.28%' },
    ],
    body:
      'اقرئيها كنسب من الكمّية المعلنة، مقابل مواصفة لا تقلّ عن 90% في كل حالة. فالبانثينول عاد أعلى قليلاً، والمنثول أدنى بقليل، وحمض الساليسيليك أعلى قليلاً — وثلاثتها محقّقة لا مفترضة. أمر صغير يقول شيئاً حقيقياً عن كيفية الإفراج عن المنتج، وهو السبب الصريح لشراء هذا التونيك بدل آخر يسرد المكوّنات نفسها.',
  },

  working: {
    eyebrow: 'التركيبة العاملة',
    title: 'ما في العبوة فعلاً',
    intro:
      'على تونيك فروة الرأس أن يوصّل شيئاً ثم يبتعد عن الطريق. وهذا في معظمه ماء وكحول يحملان خمسة مكوّنات بجرعات تفعل شيئاً، وذيلاً طويلاً من النباتات لا تفعل.',
    items: [
      {
        name: 'Alcohol Denat.',
        dose: '9.500%',
        body: 'نحو عُشر العبوة. يحمل الفعّالات، ويجفّ في ثوانٍ، ولا يترك طبقة، وهذا ما يجعل تونيكاً يُترك مرتين يومياً قابلاً للاستخدام أصلاً. وهو أيضاً المكوّن الأرجح أن يلسع فروة متهيّجة أصلاً، وسبب هبوط الكثافة النوعية تحت الماء عند 0.9711.',
      },
      {
        name: 'المنثول، مع عاملَي تبريد آخرين',
        dose: '0.300% + 0.080%',
        body: 'منثول بنسبة 0.300%، ثم منثيل لاكتات وميثيل دايأيزوبروبيل بروبيوناميد بنسبة 0.040% لكل منهما. ثلاثة عوامل تبريد لا واحد: المنثول يعطي الضربة الفورية، والآخران يحملانها. وهذا هو الإحساس الذي يبيعه المنتج فعلاً، والمنثول مقيس.',
      },
      {
        name: 'Salicylic Acid',
        dose: '0.250%',
        body: 'محلّل للكيراتين بجرعة عاملة، وهو ما يُبقي فروة الرأس صافية على مدى أسابيع لا ساعات. وهو أيضاً مصدر قائمة التجنّب أعلاه، ومقيس على الدفعة.',
      },
      {
        name: 'Panthenol',
        dose: '0.200%',
        body: 'فيتامين B5، مكيّف، وثالث الفعّالات المقيسة الثلاثة. تسمّيه الشهادة ديكسبانثينول وقاسته عند 103.40% من المعلن.',
      },
      {
        name: 'Allantoin',
        dose: '0.100%',
        body: 'جرعة عاملة للراحة، وهو ما يهمّ في تركيبة تحمل كحولاً ومحلّلاً للكيراتين معاً.',
      },
      {
        name: 'جذر الأقورس والسنتيلا الآسيوية',
        dose: '250 ppm + 50 ppm',
        body: 'متواضعان لكن ليسا تافهين، وهما النباتان الوحيدان في التركيبة الموجودان بكمّيات تستحق التسمية.',
      },
    ],
  },

  trace: {
    eyebrow: 'التناسب',
    title: 'عن الكافيين والببتيد النحاسي',
    body:
      'كان وصفنا نفسه يفتتح قائمة مكوّناته بالكوبر ترايببتايد-1، ثم الصفير الياباني، ثم الكافيين. وهذه عند 1 و10 و10 أجزاء من المليون على التوالي. ويستحق المعرفة إن كان الكافيين هو ما جئتِ من أجله: فشامبو MEDI للفروة في المجموعة نفسها يحمل الكافيين بنسبة 1% كاملة — أي مئة ضعف هذا التونيك — فإن كان ذلك هو المكوّن الذي تريدينه، فالشامبو هو موضعه فعلاً. أما ما يُحسنه هذا التونيك فهو التبريد والتصفية والتكييف، وثلاثة فعّالات مقيسة.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'رشّي ودلّكي ثم اتركيه',
    frequency: 'صباحاً ومساءً · يُترك 3–4 ساعات على الأقل · لا يُشطف',
    steps: [
      {
        title: 'على فروة الرأس، لا على الشعر',
        body: 'افرقي الشعر ورشّي مباشرة على فروة الرأس. فالمقصود التلامس مع الجلد — والرشّ فوق الشعر الجاف يهدره في معظمه.',
      },
      {
        title: 'دلّكي بحركات دائرية',
        body: 'تحدّد العلبة تدليكاً دائرياً، ويستحق الثلاثين ثانية. فهو ينشر التونيك على الفروة بدل تركه في المواضع القليلة التي رششتِها.',
      },
      {
        title: 'اتركيه ثلاث إلى أربع ساعات على الأقل',
        body: 'هذه هي التعليمة التي يفوّتها معظم الناس. فهو يُترك: لا تشطفيه، وامنحيه ساعات لا دقائق. ولهذا أيضاً يهمّ الكحول — فلا شيء آخر سيكون محتملاً جالساً على الفروة كل هذه المدة.',
      },
      {
        title: 'صباحاً ومساءً',
        body: 'مرتان يومياً هو الروتين المذكور. وعملياً يجد معظم الناس تطبيق المساء أسهل للترك طوال الليل، وتطبيق الصباح يناسب ما بعد الاستحمام، بعد أن تجفّ الفروة.',
      },
    ],
    note:
      'أبعديه عن العينين — فهو بخّاخ فيه 9.5% كحول و0.3% منثول، وسيؤلم. وإن كنتِ تستخدمين شامبو MEDI من المجموعة نفسها، فاغسلي أولاً وجفّفي الفروة ثم ضعي هذا. واستخدمي العبوة خلال ثلاثة أشهر من الفتح، وهي أقصر مدة في مجموعتنا كلها.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما تقوله الشهادة',
    intro:
      'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة تتضمّن قياساً لكل فعّال وظيفي. وتقييم السلامة غير معتاد أيضاً: فاختبار التحسّس اختبار لصقة بشرية متكرّرة كامل لا اختبار لصقة بتطبيق واحد.',
    rows: [
      { label: 'المظهر', value: 'سائل شفّاف عديم اللون وغير لزج' },
      { label: 'الحموضة', value: '4.38 عند 25 درجة، ضمن مواصفة 3.0–5.0' },
      { label: 'الكثافة النوعية', value: '0.9711 — تحت الماء، بسبب الكحول' },
      { label: 'التعبئة', value: '71.31 مل مقابل 70 مل معلنة' },
      { label: 'ديكسبانثينول', value: 'مقيس عند 103.40% من الـ 0.2% المعلنة' },
      { label: 'ل-منثول', value: 'مقيس عند 99.37% من الـ 0.3% المعلنة' },
      { label: 'حمض الساليسيليك', value: 'مقيس عند 101.28% من الـ 0.25% المعلنة' },
      { label: 'النقاء', value: 'أقل من 10 وحدات/مل بكتيريا، مقابل 100 مسموحة' },
      { label: 'الممرضات', value: 'المكوّرة العنقودية والزائفة والمبيضّات — كلها غير مكتشفة' },
      { label: 'بعد الفتح', value: 'ثلاثة أشهر' },
    ],
    patch:
      'اختبار التحسّس المتوفّر هو اختبار لصقة بشرية متكرّرة (HRIPT)، أجراه مختبر مستقل، وخلص إلى «لا علامات ولا أعراض قابلة للتحديد لتهيّج أوّلي أو تحسّس». وهو اختبار أكثر صعوبة من اختبارات اللصقة بتطبيق واحد التي تقف خلف معظم ادّعاءات «مختبر جلدياً»، لأنه يبحث عن حساسية تتطوّر عبر تعرّض متكرّر لا عن تهيّج عند أول ملامسة. ويُشار في التقييم أيضاً إلى اختبار تطبيق منفصل أجراه مختبر مسمّى، لكن لا نتائج له مسجّلة في الوثائق التي نملكها، فلا نزعم أي نتيجة.',
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
      'يُتجنّب تماماً إن كانت لديك حساسية للساليسيلات أو سكّري أو اضطراب في الدورة الدموية أو قصور كلوي أو عدوى نشطة في الفروة أو فروة محمرّة وملتهبة.',
      'يُتجنّب أثناء الحيض والحمل أو إن كان الحمل محتملاً.',
      'ليس للأطفال تحت سن الثالثة.',
      'يحتوي 9.5% كحول مُمَوَّه و0.3% منثول. أبعديه عن العينين، واشطفي فوراً بالماء عند الملامسة.',
      'للاستعمال الخارجي فقط على فروة الرأس. لا يُستخدم على بشرة مجروحة أو مفتوحة.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو حكّة.',
      'يُحفظ بارداً وجافاً بعيداً عن أشعة الشمس المباشرة ومتناول الأطفال.',
      'يُستخدم خلال ثلاثة أشهر من الفتح.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، بما فيها اللوحة الكورية الأوفى.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '70 مل، بخّاخ' },
      { label: 'الملمس', value: 'سائل شفّاف عديم اللون، بخفّة الماء' },
      { label: 'الوظيفة المسجّلة', value: 'تغذية فروة الرأس وتكييف الشعر' },
      { label: 'الفعّالات المقيسة', value: 'ديكسبانثينول 0.2%، ل-منثول 0.3%، حمض ساليسيليك 0.25% — ثلاثتها مقيسة' },
      { label: 'الكحول', value: 'كحول مُمَوَّه 9.500%' },
      { label: 'التبريد', value: 'منثول 0.300%، منثيل لاكتات 0.040%، ميثيل دايأيزوبروبيل بروبيوناميد 0.040%' },
      { label: 'وبجرعة أيضاً', value: 'ألانتوين 0.100%، جذر أقورس 250 ppm، سنتيلا آسيوية 50 ppm' },
      { label: 'بجرعات أثرية', value: 'كافيين 10 ppm، صفير ياباني 10 ppm، كوبر ترايببتايد-1 1 ppm' },
      { label: 'الحموضة', value: '3.0–5.0 (4.38 على الدفعة المختبرة)' },
      { label: 'اختبار التحسّس', value: 'اختبار لصقة بشرية متكرّرة — لا تهيّج ولا تحسّس محدّد' },
      { label: 'يُتجنّب إن', value: 'حساسية للساليسيلات، سكّري، اضطرابات الدورة الدموية، قصور كلوي، حمل، حيض' },
      { label: 'ليس لأجل', value: 'الأطفال تحت الثالثة. أبعديه عن العينين' },
      { label: 'بعد الفتح', value: 'ثلاثة أشهر' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل سيوقف هذا تساقط شعري؟',
        a: 'لن نقول لك ذلك. فخارج كوريا هذا المنتج مسجّل كتونيك لفروة الرأس — وسطر الوظيفة على العلبة يقول «تغذية فروة الرأس وتكييف الشعر» — وهذا هو الادّعاء الذي سنقف خلفه. أما ما يفعله بشكل ملحوظ فهو تبريد الفروة، وإبقاؤها صافية بحمض ساليسيليك مقيس عند 0.25%، والتكييف ببانثينول مقيس عند 0.2%. وإن كنتِ تفقدين شعراً، فذلك حديث مع طبيب لا مع تونيك.',
      },
      {
        q: 'ماذا يعني «مقيس» هنا فعلاً؟',
        a: 'يعني أن المختبر قاس كم من كل فعّال موجود في الدفعة، بدل أن تعلن الشركة ما أُضيف فقط. فالديكسبانثينول عاد عند 103.40% من الـ 0.2% المعلنة، ول-المنثول عند 99.37% من 0.3%، وحمض الساليسيليك عند 101.28% من 0.25%، وكلها مقابل حدّ أدنى 90%. ولا منتج آخر نبيعه تُقاس فعّالاته كلها بهذه الطريقة.',
      },
      {
        q: 'هل 9.5% كحول مشكلة؟',
        a: 'يتوقّف على فروتك. فهو ما يجعل التونيك يجفّ في ثوانٍ ولا يترك أثراً ويبقى محتملاً جالساً على الجلد ثلاث أو أربع ساعات، وهو ما تطلبه التعليمات. وعلى فروة حسّاسة أو متقشّرة أو متهيّجة أصلاً، قد يكون مرتين يومياً أكثر من اللازم — ابدئي مرة واحدة مساءً وراقبي. وعلى فروة دهنية، فالكحول هو المقصود.',
      },
      {
        q: 'لماذا القائمة الطويلة لمن ينبغي أن يتجنّبوه؟',
        a: 'حمض الساليسيليك. فعند 0.25% هو جرعة محلّلة للكيراتين حقيقية، وللساليسيلات تحفّظات مستقرّة — وتسرد اللوحة الكورية للشركة السكّري واضطرابات الدورة الدموية والقصور الكلوي والعدوى النشطة والحمل والحيض. وكانت تلك القائمة على اللوحة الكورية وعلى غيرها لا، بما فيها الإنجليزية، وكانت غائبة عن موقعنا حتى الآن.',
      },
      {
        q: 'مكتوب كافيين على الملصق. كم؟',
        a: 'عشرة أجزاء من المليون، وهي ليست جرعة ينبغي أن يشتري أحد المنتج من أجلها. وإن كان الكافيين مرادك، فشامبو MEDI للفروة في المجموعة نفسها فيه 1% كاملة — مئة ضعف. ونفضّل أن ندلّك على المنتج الصحيح بدل أن نترك قائمة المكوّنات تقوم بالبيع.',
      },
      {
        q: 'لماذا ثلاثة أشهر فقط بعد الفتح؟',
        a: 'هذا ما تحدّده العلبة، وهي أقصر مدة لأي منتج نبيعه. وعند 70 مل تُستخدم مرتين يومياً ستنهين العبوة داخل تلك النافذة بارتياح، فهي عملياً نادراً ما تعضّ — لكن يستحق الأمر المعرفة قبل شراء عبوتين.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const _RU: HairTonicCopy = {
  eyebrow: 'HR³ MATRIX тоник для кожи головы α · 70 мл',
  headline: 'Три актива, и все три измерены в партии.',
  subheadline:
    'Декспантенол 0,2%, L-ментол 0,3% и салициловая кислота 0,25% — и, что необычно, сертификат измеряет все три, а не просто заявляет их. Они вернулись на 103,40%, 99,37% и 101,28% от указанных количеств. Почти десятая часть флакона — спирт, поэтому средство сохнет за секунды и ничего не оставляет. Несмываемый тоник для кожи головы, а не средство от выпадения волос.',
  heroBullets: [
    'Все три актива измерены в партии, а не только заявлены',
    'Ментол 0,3% плюс два других охлаждающих агента — это и есть ощущение',
    '9,5% спирта, поэтому сохнет быстро и не оставляет следа',
    'Прочтите предостережения: салициловая кислота несёт реальный список ограничений',
  ],
  badges: ['Сделано в Корее', '70 мл', 'Три актива измерены', 'Тест HRIPT'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '3', label: 'Актива измерено в партии' },
    { value: '9,5%', label: 'Денатурированного спирта' },
    { value: '0,3%', label: 'Ментола, измерено 99,37%' },
    { value: '3M', label: 'Использовать в течение трёх месяцев после вскрытия' },
  ],

  avoid: {
    eyebrow: 'Прочтите перед покупкой',
    title: 'Салициловая кислота несёт реальный список ограничений',
    body:
      'При 0,25% салициловая кислота в этом тонике делает настоящую работу — и приходит с настоящими ограничениями. Корейская панель производителя предписывает полностью отказаться от средства, если к вам относится что-либо из перечисленного, поскольку оно может усугубить имеющееся состояние. Ничего из этого раньше на нашем сайте не было, а должно было быть.',
    items: [
      'Известная чувствительность к салициловой кислоте или салицилатам',
      'Диабет',
      'Нарушения кровообращения',
      'Почечная недостаточность',
      'Активная инфекция кожи головы или покраснение и воспаление',
      'Менструация, беременность или её возможность',
    ],
    detail:
      'Средство также не предназначено для детей младше трёх лет — это указано на английской панели. Если вы принимаете какие-либо препараты для кожи головы или находитесь под наблюдением дерматолога, покажите состав тому, кто вас ведёт, прежде чем начинать. Мы предпочтём потерять продажу, чем чтобы вы узнали об этом потом.',
  },

  assay: {
    eyebrow: 'Лучший сертификат в линейке',
    title: 'Заявлено — одно. Измерено — другое.',
    intro:
      'Большинство косметических сертификатов подтверждают внешний вид, pH и то, что во флаконе ничего не растёт. Этот измеряет каждый функциональный актив формулы против заявленной концентрации — чего не делает ни один другой продукт GENOSYS. Вот что вернула партия.',
    rows: [
      { name: 'Декспантенол', declared: '0,2%', measured: '103,40%' },
      { name: 'L-ментол', declared: '0,3%', measured: '99,37%' },
      { name: 'Салициловая кислота', declared: '0,25%', measured: '101,28%' },
    ],
    body:
      'Читайте это как проценты от заявленного количества при спецификации не менее 90% в каждом случае. То есть пантенол вернулся чуть выше, ментол чуть ниже, салициловая кислота чуть выше — все три подтверждены, а не приняты на слово. Мелочь, которая говорит нечто реальное о том, как продукт выпускают, и это честная причина выбрать этот тоник, а не тот, что просто перечисляет те же ингредиенты.',
  },

  working: {
    eyebrow: 'Работающая формула',
    title: 'Что действительно во флаконе',
    intro:
      'Тоник для кожи головы должен что-то доставить и уйти с дороги. Этот в основном вода и спирт, несущие пять ингредиентов в дозах, которые что-то делают, и длинный хвост растительных экстрактов, которые нет.',
    items: [
      {
        name: 'Alcohol Denat.',
        dose: '9.500%',
        body: 'Почти десятая часть флакона. Он несёт активы, сохнет за секунды и не оставляет плёнки — именно это делает несмываемый тоник дважды в день вообще носибельным. Он же вероятнее всего защиплет кожу головы, которая уже болит, и он же причина того, что удельный вес ниже воды: 0,9711.',
      },
      {
        name: 'Ментол и два других охлаждающих агента',
        dose: '0.300% + 0.080%',
        body: 'Ментол 0,300%, затем ментил лактат и метил диизопропил пропионамид по 0,040%. Три охлаждающих агента, а не один: ментол даёт немедленный удар, два других его продлевают. Это и есть то ощущение, которое продукт действительно продаёт, и ментол измерен.',
      },
      {
        name: 'Salicylic Acid',
        dose: '0.250%',
        body: 'Кератолитик в рабочей дозе — именно он держит кожу головы ощутимо чистой недели, а не часы. Он же источник списка ограничений выше, и он измерен в партии.',
      },
      {
        name: 'Panthenol',
        dose: '0.200%',
        body: 'Витамин B5, кондиционирование, и третий из трёх измеренных активов. Сертификат называет его декспантенолом и измерил на 103,40% от заявленного.',
      },
      {
        name: 'Allantoin',
        dose: '0.100%',
        body: 'Рабочая доза для комфорта, что важно в формуле, несущей и спирт, и кератолитик.',
      },
      {
        name: 'Корень акоруса и центелла азиатская',
        dose: '250 ppm + 50 ppm',
        body: 'Скромно, но не пренебрежимо, и это два единственных растительных экстракта формулы в количествах, которые стоит называть.',
      },
    ],
  },

  trace: {
    eyebrow: 'Пропорция',
    title: 'О кофеине и медном пептиде',
    body:
      'Наше собственное описание раньше открывало список ингредиентов медным трипептидом-1, затем софорой японской, затем кофеином. Это 1, 10 и 10 частей на миллион соответственно. Стоит знать, если вы пришли за кофеином: шампунь MEDI из этой же линии несёт кофеин в полный 1% — в сто раз больше этого тоника, — так что если вам нужен именно этот ингредиент, он в шампуне. А этот тоник хорошо делает другое: охлаждает, очищает и кондиционирует, причём все три актива измерены.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Распылить, помассировать и оставить в покое',
    frequency: 'Утром и вечером · оставить минимум на 3–4 часа · не смывать',
    steps: [
      {
        title: 'На кожу головы, а не на волосы',
        body: 'Разделите волосы и распыляйте прямо на кожу головы. Смысл в контакте с кожей — распыление поверх сухих волос в основном тратит средство впустую.',
      },
      {
        title: 'Массируйте круговыми движениями',
        body: 'Коробка указывает круговой массаж, и эти тридцать секунд стоит потратить. Он распределяет тоник по коже головы, а не оставляет его в тех нескольких местах, куда вы попали.',
      },
      {
        title: 'Оставьте минимум на три-четыре часа',
        body: 'Это указание пропускают чаще всего. Средство несмываемое: не смывайте и дайте ему часы, а не минуты. Поэтому же важен спирт — ничто другое не было бы терпимо на коже головы столько времени.',
      },
      {
        title: 'Утром и вечером',
        body: 'Дважды в день — заявленный режим. Практически большинству удобнее оставлять вечернее нанесение на ночь, а утреннее вписывать после душа, когда кожа головы высохла.',
      },
    ],
    note:
      'Держите подальше от глаз — это спрей с 9,5% спирта и 0,3% ментола, и будет больно. Если вы пользуетесь шампунем MEDI из этой же линии: сначала помойте, высушите кожу головы, затем нанесите это. И используйте флакон в течение трёх месяцев после вскрытия — это самый короткий срок во всей нашей линейке.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что говорит сертификат',
    intro:
      'Сделано в Корее и выпущено против письменной спецификации, включающей измерение каждого функционального актива. Оценка безопасности тоже необычна: тест на сенсибилизацию — полноценный Human Repeat Insult Patch Test, а не однократный патч-тест.',
    rows: [
      { label: 'Внешний вид', value: 'Бесцветная прозрачная невязкая жидкость' },
      { label: 'pH', value: '4,38 при 25 °C, в пределах спецификации 3,0–5,0' },
      { label: 'Удельный вес', value: '0,9711 — ниже воды, из-за спирта' },
      { label: 'Наполнение', value: '71,31 мл при заявленных 70 мл' },
      { label: 'Декспантенол', value: 'Измерено 103,40% от заявленных 0,2%' },
      { label: 'L-ментол', value: 'Измерено 99,37% от заявленных 0,3%' },
      { label: 'Салициловая кислота', value: 'Измерено 101,28% от заявленных 0,25%' },
      { label: 'Чистота', value: 'Менее 10 КОЕ/мл бактерий при допустимых 100' },
      { label: 'Патогены', value: 'S. aureus, P. aeruginosa и C. albicans — все не обнаружены' },
      { label: 'После вскрытия', value: 'Три месяца' },
    ],
    patch:
      'Тест на сенсибилизацию в деле — Human Repeat Insult Patch Test, проведённый независимой лабораторией, и он заключил: «нет идентифицируемых признаков или симптомов первичного раздражения или сенсибилизации». Это более требовательный тест, чем однократные патч-тесты, стоящие за большинством заявлений «дерматологически протестировано», потому что он ищет аллергию, развивающуюся при повторном контакте, а не раздражение при первом. В оценке упоминается и отдельный аппликационный тест названной лаборатории, но результатов по нему в имеющихся документах нет, поэтому мы ничего по нему не заявляем.',
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
      'Полностью откажитесь при чувствительности к салицилатам, диабете, нарушениях кровообращения, почечной недостаточности, активной инфекции или покраснении и воспалении кожи головы.',
      'Избегайте при менструации, беременности или её возможности.',
      'Не для детей младше 3 лет.',
      'Содержит 9,5% денатурированного спирта и 0,3% ментола. Держите подальше от глаз, при попадании сразу промойте водой.',
      'Только для наружного применения на кожу головы. Не наносить на повреждённую кожу.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке или зуде.',
      'Хранить в прохладном сухом месте, вне прямого солнца и вне доступа детей.',
      'Использовать в течение трёх месяцев после вскрытия.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, включая более полную корейскую панель.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '70 мл, спрей' },
      { label: 'Текстура', value: 'Бесцветная прозрачная жидкость, как вода' },
      { label: 'Зарегистрированная функция', value: 'Питание кожи головы, кондиционирование волос' },
      { label: 'Измеренные активы', value: 'Декспантенол 0,2%, L-ментол 0,3%, салициловая кислота 0,25% — все три измерены' },
      { label: 'Спирт', value: 'Alcohol denat. 9,500%' },
      { label: 'Охлаждение', value: 'Ментол 0,300%, ментил лактат 0,040%, метил диизопропил пропионамид 0,040%' },
      { label: 'Также в дозе', value: 'Аллантоин 0,100%, корень акоруса 250 ppm, центелла 50 ppm' },
      { label: 'Следово', value: 'Кофеин 10 ppm, софора японская 10 ppm, медный трипептид-1 1 ppm' },
      { label: 'pH', value: '3,0–5,0 (4,38 в измеренной партии)' },
      { label: 'Тест на сенсибилизацию', value: 'Human Repeat Insult Patch Test — раздражения и сенсибилизации не выявлено' },
      { label: 'Избегать при', value: 'Чувствительности к салицилатам, диабете, нарушениях кровообращения, почечной недостаточности, беременности, менструации' },
      { label: 'Не для', value: 'Детей младше 3 лет. Держать подальше от глаз' },
      { label: 'После вскрытия', value: 'Три месяца' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Он остановит выпадение волос?',
        a: 'Мы этого вам не скажем. За пределами Кореи этот продукт зарегистрирован как тоник для кожи головы — строка функции на коробке гласит «питание кожи головы, кондиционирование волос», — и именно за это заявление мы отвечаем. Что он делает доказуемо: охлаждает кожу головы, держит её ощутимо чистой салициловой кислотой на измеренных 0,25% и кондиционирует пантенолом на измеренных 0,2%. Если вы теряете волосы, это разговор с врачом, а не с тоником.',
      },
      {
        q: 'Что здесь означает «измерено»?',
        a: 'Что лаборатория измерила, сколько каждого актива в партии, а не что производитель просто заявил, сколько положил. Декспантенол вернулся на 103,40% от заявленных 0,2%, L-ментол на 99,37% от 0,3%, салициловая кислота на 101,28% от 0,25% — всё против минимума 90%. Ни у одного другого продукта, что мы продаём, все активы так не измеряются.',
      },
      {
        q: '9,5% спирта — это проблема?',
        a: 'Зависит от вашей кожи головы. Именно спирт даёт высыхание за секунды, отсутствие следа и терпимость при трёх-четырёх часах на коже — а это то, что требует инструкция. На чувствительной, шелушащейся или уже раздражённой коже дважды в день может быть много: начните раз в день вечером и посмотрите. На жирной коже головы спирт и есть смысл.',
      },
      {
        q: 'Почему такой длинный список тех, кому не следует?',
        a: 'Салициловая кислота. При 0,25% это реальная кератолитическая доза, а у салицилатов есть устоявшиеся предостережения — корейская панель производителя перечисляет диабет, нарушения кровообращения, почечную недостаточность, активную инфекцию, беременность и менструацию. Этот список был на корейской панели и ни на одной другой, включая английскую, и до сих пор отсутствовал на нашем сайте.',
      },
      {
        q: 'На этикетке написано «кофеин». Сколько?',
        a: 'Десять частей на миллион — не та доза, из-за которой стоит покупать продукт. Если вам нужен кофеин, в шампуне MEDI из этой же линии его полный 1%, в сто раз больше. Мы предпочтём направить вас к нужному продукту, чем позволить списку ингредиентов делать продажу.',
      },
      {
        q: 'Почему всего три месяца после вскрытия?',
        a: 'Так указано на коробке, и это самый короткий срок среди всего, что мы продаём. При 70 мл дважды в день вы спокойно закончите флакон внутри этого окна, так что на практике это редко мешает, — но стоит знать до покупки двух флаконов.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

// Keep the former blocks temporarily as a diffable source reference while the
// runtime is pinned to the calmer, source-checked localized modules above.
void _AR
void _RU

export const HAIR_TONIC_COPY: Record<Locale, HairTonicCopy> = {
  en: EN,
  ar: HAIR_TONIC_AR,
  ru: HAIR_TONIC_RU,
}

export function getHairTonicCopy(locale: string | undefined): HairTonicCopy {
  return HAIR_TONIC_COPY[(locale as Locale) ?? 'en'] ?? HAIR_TONIC_COPY.en
}

/** The shampoo it points at for caffeine, then the rest of the scalp line. */
export const COMPANION_PRODUCT_IDS = ['44', '46', '45', '48'] as const
