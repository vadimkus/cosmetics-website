/**
 * Bespoke copy for the BIO-MESO PDRN EXPERT AMPOULE 60000 page (product 60).
 *
 * Shares the BioMesoCopy shape with product 65 so both ampoules can run on one
 * layout. The Expert adds the optional `clinical` block, because unlike the
 * Homecare this product has a real test report.
 *
 * SOURCING RULE FOR THIS FILE - every figure below traces to one of:
 *   - Intertek formula PDF (Registration/Intertek/Bio-Meso PDRN .../Formula-...
 *     60000.pdf): Hydrolyzed Sponge 5.72022%, Sodium DNA 0.112%, Niacinamide
 *     2%, Panthenol 1%, Adenosine 0.04%, five ceramides.
 *   - Intertek artwork PDF (outer box): "BIO-MESO PDRN 60,000ppm", "Panthenol
 *     10,000ppm", "Peptide 17 Types", "Sodium DNA (1120ppm)", the dual-
 *     functional registration, the precaution text, PAO 12M, 3ml x 4ea.
 *   - Intertek COA (LOT 001EH): pH 7.27, white lotion, viscosity 5,210,
 *     specific gravity 1.029, all five pathogens not detected.
 *   - Origin certificate (Meso/Origin-BIO-MESO™ PDRN.pdf, H&B Labs, 27 May
 *     2025): spicules from freshwater sponge, Russia; Sodium DNA from salmon
 *     milt, Japan; hydrogenated lecithin from Korean soybean.
 *   - Product brochure public/documents/ppt/GENOSYS_BIO_MESO_PDRN_EXPERT_
 *     AMPOULE_60000.pdf: the 1.0 mm needle equivalence, monthly cadence,
 *     300,000-360,000 spicules per ml, 3rd-generation cog spicule, the
 *     phytosome-versus-liposome explanation, the eight contraindications, the
 *     retinoid washout, the clinic protocol, and the full clinical dataset.
 *   - Dubai Municipality Montaji registration CPRE-221125-172642 (Approved,
 *     valid to 22 May 2029), docs/Montaji_Product_Registration_Letter_
 *     normalized.csv. The page states the registration without the CPRE code.
 *
 * WHY 60000 IS NOT THE PDRN NUMBER: the 60,000 ppm is the BIO-MESO complex
 * loading, roughly 6% w/w. The actual PDRN is Sodium DNA at 1,120 ppm, printed
 * on the pack. Against the Homecare 5000 the spicule load is 12x higher while
 * the PDRN is near identical (0.112% vs 0.101%). Nothing here may imply the
 * Expert carries twelve times the PDRN, because it does not.
 *
 * CLINICAL FIGURES: KC Skin Research Center, Seoul, 11 Aug - 9 Sep 2025, 20
 * women aged 48 +/- 8, measured after a single application at 1, 2 and 4 weeks.
 * Source values are 7.446% wrinkle decrease, 19.858% elasticity, 52.247%
 * moisture, 4.423% density, 3.634% lifting at four weeks. Shown to two
 * decimals on the page to match slide S5 in the gallery, which is already
 * printed as -7.45% / +19.86% / +52.25%; a page that rounded differently from
 * its own image would look wrong. Never show these without the panel size.
 *
 * DELIBERATE OMISSIONS:
 *   - No peptide concentrations. Most of the 17 sit near 1e-10%, so the count
 *     is fair and the dose is not. Same rule applied to Adenosine on 63.
 *   - Collagen and Elastin are in the INCI at about 5e-9%. They are listed in
 *     the INCI but never presented as doing work.
 *   - The manufacturer's deck repeats the PDRN text under Phytosphingosine and
 *     the Panthenol text under CeraShield-5, and lists Palmitoyl Tripeptide-1
 *     twice. Those are their copy-paste errors; correct text is used here.
 */

import type { BioMesoCopy } from './biomesoCopy'

export type BioMesoExpertLocale = 'en' | 'ar' | 'ru'

const EN: BioMesoCopy = {
  eyebrow: 'Bio-Meso · Professional ampoule',
  headline: 'One session a month. Measured for four weeks.',
  subheadline:
    'The in-clinic strength of the Bio-Meso line. Spicules at twelve times the homecare load open the skin like a 1.0 mm needle, and carry PDRN, seventeen peptides and five ceramides down with them - without a single needle in the room.',
  heroBullets: [
    'BIO-MESO™ PDRN at 60,000 ppm - twelve times the homecare ampoule',
    '300,000 to 360,000 spicules in every millilitre',
    'Works like a 1.0 mm needle, used once a month',
    '17 peptides, 5 ceramides, panthenol at 10,000 ppm',
    'Wrinkles, elasticity and hydration measured on 20 women',
  ],
  badges: ['Made in Korea', '3 ml × 4 · 12M PAO', 'Korean dual-functional cosmetic', 'Professional use'],
  weeklyNote: 'Once a month · in clinic',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',
  stats: [
    { value: '60,000ppm', label: 'BIO-MESO™ PDRN complex' },
    { value: '1.0mm', label: 'Needle equivalent, no needles' },
    { value: '12×', label: 'The spicules of the homecare ampoule' },
    { value: '17', label: 'Peptide types in the complex' },
  ],
  science: {
    eyebrow: 'How it works',
    title: 'Microneedling without the needle',
    intro:
      'Freshwater sponge spicules do the mechanical work. Because the PDRN is coated onto the spicules themselves, it travels in at the same moment the channel opens rather than waiting on the surface for one.',
    cards: [
      {
        title: 'The channel opens',
        body: 'Pressed into the skin, needle-shaped spicules form temporary micro-channels through the stratum corneum. At 60,000 ppm the stimulation is equivalent to a 1.0 mm needle, which is why this is a monthly professional treatment rather than a weekly one.',
      },
      {
        title: 'PDRN rides in with it',
        body: 'This is the third-generation cog spicule. PDRN is bound into phytosome form and coated onto the spicule surface, so the active and the channel arrive together instead of one chasing the other.',
      },
      {
        title: 'A controlled response',
        body: 'The mechanical stimulation triggers a mild, deliberate inflammatory response. That is what wakes the fibroblasts and drives collagen synthesis and epidermal renewal - the reason skin reads firmer weeks after a single session.',
      },
      {
        title: 'The barrier is rebuilt',
        body: 'Five ceramides - NP, EOP, AS, AP and NS - with phytosphingosine, cholesterol and panthenol at 10,000 ppm put the lipid barrier back together while the skin renews underneath it.',
      },
    ],
    figureAlt: 'BIO-MESO PDRN spicule technology - micro-channels, phytosome-coated PDRN delivery and skin renewal',
  },
  timeline: {
    eyebrow: 'What to expect',
    title: 'The month after a session',
    intro:
      'This is a real treatment with real downtime, and knowing the sequence is the difference between trusting it and panicking on day three.',
    days: [
      { day: 'Day 0', title: 'Warmth and tightness', body: 'The spicules are seated and working. Expect heat and a tight, prickling feeling through the evening of the treatment.' },
      { day: 'Day 1-3', title: 'Mild irritation', body: 'Depending on your skin, mild irritation can last up to three days. Keep the routine bare: cleanse, soothe, protect.' },
      { day: 'Day 2-3', title: 'Exfoliation starts', body: 'The surface begins to release. Do not pick or scrub - let it lift on its own and stay well moisturised.' },
      { day: 'Day 5-7', title: 'A new surface', body: 'Peeling completes and the skin underneath reads brighter, smoother and more even.' },
      { day: 'Weeks 2-4', title: 'The measured part', body: 'Elasticity and hydration keep climbing well after the surface has settled. In the clinical panel the four-week readings were the strongest of all.' },
    ],
    note: 'Between sessions, the Homecare 5000 ampoule keeps the same actives going weekly at a dose that needs no downtime. Professional first, homecare after - that is how the line is designed to be used.',
  },
  complex: {
    eyebrow: 'Inside the ampoule',
    title: 'What 3 ml is actually carrying',
    body: 'Four working groups, each doing a different job in the window the spicules open.',
    points: [
      {
        title: 'BIO-MESO™ PDRN, 60,000 ppm',
        body: 'The spicule complex, at roughly 6% by weight. For context, most professional spicule treatments run between 0.3% and 5%. The PDRN itself is salmon-milt Sodium DNA at 1,120 ppm, which shares about 95% of its sequence with human DNA.',
      },
      {
        title: 'Nine growth factor peptides',
        body: 'EGF, bFGF, aFGF, VEGF, IGF-1, KGF, PlGF, HGF and TGF. Between them they drive keratinocyte turnover, collagen synthesis, capillary formation and tissue repair.',
      },
      {
        title: 'Eight anti-ageing peptides',
        body: 'Copper Tripeptide-1 and Tripeptide-1 for collagen and elastin, Acetyl Hexapeptide-8 for expression lines, Nonapeptide-1 for pigmentation, Palmitoyl Tetrapeptide-7 for calm.',
      },
      {
        title: 'CeraShield-5 and panthenol',
        body: 'Five ceramides in an intercellular lipid ratio with cholesterol and fatty acids, plus panthenol at 10,000 ppm. This is the half of the formula that makes the other half survivable.',
      },
    ],
  },
  howTo: {
    eyebrow: 'The protocol',
    title: 'How the session runs',
    frequency: 'Once a month · professional treatment',
    steps: [
      { title: 'Cleanse and prep', body: 'Makeup remover, then Snow O₂ Cleanser and Snow Booster Toner to leave the skin clean and evenly hydrated before the ampoule.' },
      { title: 'Apply, press, roll', body: 'Avoiding the eyes and lips, spread the ampoule evenly and press it in before rolling. Protect the eyes with damp cotton.' },
      { title: 'Layer and roll again', body: 'Apply Intensive Hydro Soothing Cream over the top and roll a second time so the ampoule is fully driven in. Skipping this step is how a clinic dials the session down for sensitive skin.' },
      { title: 'Mask and calm', body: 'Finish with the Skin Reboot PDRN Mask or Bio-Ferment Powder Mask, then Soothing Repair Postcream.' },
      { title: 'Protect for a week', body: 'Sunscreen every morning without exception while the new surface comes through, and no actives until the peeling has finished.' },
    ],
    note: 'Stop retinoids 7 to 10 days before a session, or 14 days for prescription tretinoin, and do not resume for 14 days afterwards. If you have taken oral isotretinoin, spicule treatment should wait six months.',
  },
  video: {
    eyebrow: 'See it work',
    title: 'The spicule, up close',
    body: 'What a needle-shaped sponge structure looks like going into skin, and why the coating matters as much as the shape.',
    unsupported: 'Your browser does not support video playback.',
  },
  actives: {
    eyebrow: 'The formula',
    title: 'Every active, and what it is doing',
    intro: 'The working ingredients in this ampoule, and the job each one has in the window the spicules open.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the box in your hand.',
  },
  lab: {
    eyebrow: 'Quality',
    title: 'Made and tested in Korea',
    intro:
      'Made in Gyeonggi-do, and no batch ships until it passes. These are the numbers behind the lot in your hand.',
    rows: [
      { label: 'Texture', value: 'White lotion, near-neutral at pH 7.27 - the window that keeps niacinamide stable' },
      { label: 'Sterility', value: 'Tested clear for E. coli, P. aeruginosa, S. aureus and C. albicans' },
      { label: 'Registration', value: 'Korean dual-functional cosmetic for brightening and wrinkle improvement, on niacinamide and adenosine' },
      { label: 'Cleared for the UAE', value: 'Registered with Dubai Municipality on the Montaji system, on top of the Korean certificate of free sale' },
      { label: 'Shelf life', value: 'Twelve months once opened, sealed in single-use 3 ml ampoules' },
    ],
    disclaimer: 'Every production lot is tested before it ships, and we can show you the results for yours.',
  },
  clinical: {
    eyebrow: 'Measured results',
    title: 'One application, four weeks of readings',
    intro:
      'Most of this category asks you to take the mechanism on faith. This ampoule was put in front of an independent panel and measured, and these are the four-week numbers after a single professional application.',
    metrics: [
      { value: '-7.45%', label: 'Periorbital wrinkles', detail: 'Crow\'s feet depth, down from 4.8% at one week' },
      { value: '+19.86%', label: 'Skin elasticity', detail: 'Up from 5.7% at one week and 15.0% at two' },
      { value: '+52.25%', label: 'Skin hydration', detail: 'Moisture content, from 19.0% at one week' },
    ],
    note: 'Skin density improved 4.4% and cheek lifting angle 3.6% over the same period, and dermal absorption depth and rate both beat the control product. No erythema, swelling, itching or stinging was recorded at any timepoint.',
    disclaimer:
      'Clinical test by KC Skin Research Center, Seoul, 11 August to 9 September 2025. 20 female subjects aged 48 ± 8, measured at 1, 2 and 4 weeks after a single application against an untreated control site. Individual results vary.',
  },
  safety: {
    eyebrow: 'Before you book',
    title: 'When not to have this treatment',
    points: [
      'Active skin infections, or open wounds and broken skin',
      'Severe acne or rosacea',
      'Known skin allergies or hypersensitivity',
      'Autoimmune skin conditions including lupus, psoriasis and eczema',
      'Recent chemical peel, laser resurfacing or microneedling',
      'Skin cancers or precancerous lesions',
      'Recent sunburn or tanning',
      'Pregnancy or breastfeeding, unless your doctor has cleared it',
    ],
    note: 'After any device, peel or high-strength active, wait until the skin has fully recovered before a spicule session - never on the same day. Avoid the eye and lip area entirely.',
  },
  routine: {
    eyebrow: 'The full protocol',
    title: 'What the session is built around',
    intro: 'The clinic sequence this ampoule sits inside, from cleanse through to the cream that calms it down.',
    thisProduct: 'You are here',
    viewProduct: 'View product',
    chooseOptions: 'Choose size',
    fromPrice: 'From',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'What people ask',
    items: [
      {
        q: 'How is this different from the Homecare 5000?',
        a: 'Same formula, twelve times the spicules. The Homecare is 0.5% spicules used weekly, equivalent to a 0.25 mm needle. This is 6%, used monthly, equivalent to 1.0 mm. Worth knowing: the PDRN content is almost identical between the two. What you are buying here is depth of delivery, not more PDRN.',
      },
      {
        q: 'Can I use it at home?',
        a: 'It is formulated for professional use and sits above the concentration band normally handled outside a clinic. Have the session done by a trained professional, then hold the result with the Homecare ampoule weekly at home.',
      },
      {
        q: 'Will I peel?',
        a: 'Yes, and that is the treatment working. Exfoliation usually starts two to three days after the session and finishes around day five to seven. Do not help it along - picking at it is how you turn a good result into a mark.',
      },
      {
        q: 'Does it hurt?',
        a: 'You will feel heat and a prickling tightness during and after the session, and mild irritation can last up to three days. It is a real treatment with real downtime. Book it when the following few days are yours.',
      },
      {
        q: 'I use retinol. What do I do?',
        a: 'Stop 7 to 10 days before, or 14 days if you are on prescription tretinoin at 0.05% or higher. Your skin should be calm and not peeling on the day. Do not restart for 14 days afterwards, and only once it has completely recovered.',
      },
      {
        q: 'What are the spicules actually made of?',
        a: 'Freshwater sponge, harvested and hydrolysed into needle-shaped microstructures. The PDRN coated onto them is Sodium DNA from salmon milt. Both are on the certificate of origin, along with everything else in the formula.',
      },
      {
        q: 'How often should I have it?',
        a: 'Once a month. The programme runs a professional session, then weekly homecare for two months, then the next session - three or four treatments a year with the homecare ampoule holding the line in between.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details',
    rows: [
      { label: 'Format', value: '3 ml × 4 single-use ampoules' },
      { label: 'Spicule load', value: '60,000 ppm, about 6% by weight' },
      { label: 'Spicule count', value: '300,000 to 360,000 per millilitre' },
      { label: 'Needle equivalent', value: '1.0 mm' },
      { label: 'PDRN', value: 'Sodium DNA at 1,120 ppm, from salmon milt' },
      { label: 'Frequency', value: 'Once a month, professional treatment' },
      { label: 'Skin types', value: 'All skin types, outside the contraindications above' },
      { label: 'Origin', value: 'Made in Korea' },
      { label: 'After opening', value: '12 months' },
    ],
    brochure: 'Download the treatment guide',
  },
  backToProducts: 'All products',
}

const AR: BioMesoCopy = {
  eyebrow: 'بايو-ميزو · أمبولة احترافية',
  headline: 'جلسة واحدة شهرياً. نتائج مقاسة على مدى أربعة أسابيع.',
  subheadline:
    'قوة العيادة من خط بايو-ميزو. الـ spicules بتركيز يعادل اثني عشر ضعف أمبولة العناية المنزلية تفتح البشرة كإبرة 1.0 مم، وتحمل معها PDRN وسبعة عشر ببتيداً وخمسة سيراميدات - دون أي إبرة في الغرفة.',
  heroBullets: [
    'BIO-MESO™ PDRN بتركيز 60,000 جزء بالمليون - اثنا عشر ضعف أمبولة العناية المنزلية',
    'من 300,000 إلى 360,000 spicule في كل ملليلتر',
    'يعادل تأثير إبرة 1.0 مم، مرة واحدة شهرياً',
    '17 ببتيداً و5 سيراميدات وبانثينول بـ 10,000 جزء بالمليون',
    'التجاعيد والمرونة والترطيب مقاسة على 20 سيدة',
  ],
  badges: ['صنع في كوريا', '3 مل × 4 · صلاحية 12 شهراً بعد الفتح', 'مستحضر كوري ثنائي الوظيفة', 'للاستخدام الاحترافي'],
  weeklyNote: 'مرة شهرياً · في العيادة',
  addToBag: 'أضف إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في السلة',
  viewBag: 'عرض السلة',
  loginToShop: 'سجّل الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  stats: [
    { value: '60,000ppm', label: 'مركب BIO-MESO™ PDRN' },
    { value: '1.0mm', label: 'يعادل تأثير الإبرة، دون إبر' },
    { value: '12×', label: 'أضعاف spicules أمبولة العناية المنزلية' },
    { value: '17', label: 'نوعاً من الببتيدات في المركب' },
  ],
  science: {
    eyebrow: 'كيف يعمل',
    title: 'ميكرونيدلينغ دون إبرة',
    intro:
      'الـ spicules المستخلصة من الإسفنج النهري تقوم بالعمل الميكانيكي. ولأن الـ PDRN مغلف على سطح الـ spicules نفسها، فإنه ينفذ في اللحظة ذاتها التي تُفتح فيها القناة بدلاً من الانتظار على السطح.',
    cards: [
      {
        title: 'القناة تُفتح',
        body: 'عند الضغط على البشرة، تشكّل الـ spicules الإبرية قنوات دقيقة مؤقتة عبر الطبقة القرنية. عند 60,000 جزء بالمليون يعادل التحفيز إبرة 1.0 مم، ولهذا فهي جلسة احترافية شهرية لا أسبوعية.',
      },
      {
        title: 'الـ PDRN ينفذ معها',
        body: 'هذا هو الجيل الثالث من الـ cog spicule. الـ PDRN مرتبط في صورة phytosome ومغلف على سطح الـ spicule، فيصل المكوّن الفعال والقناة معاً بدل أن يلاحق أحدهما الآخر.',
      },
      {
        title: 'استجابة محسوبة',
        body: 'التحفيز الميكانيكي يطلق استجابة التهابية خفيفة ومقصودة. هذا ما يوقظ الخلايا الليفية ويحفّز تصنيع الكولاجين وتجدد البشرة - والسبب في أن البشرة تبدو أكثر شداً بعد أسابيع من جلسة واحدة.',
      },
      {
        title: 'إعادة بناء الحاجز',
        body: 'خمسة سيراميدات - NP وEOP وAS وAP وNS - مع الفيتوسفينجوسين والكوليسترول والبانثينول بـ 10,000 جزء بالمليون تعيد بناء الحاجز الدهني بينما تتجدد البشرة تحته.',
      },
    ],
    figureAlt: 'تقنية BIO-MESO PDRN spicule - قنوات دقيقة وتوصيل PDRN المغلف وتجديد البشرة',
  },
  timeline: {
    eyebrow: 'ما الذي تتوقعينه',
    title: 'الشهر الذي يلي الجلسة',
    intro:
      'هذا علاج حقيقي بفترة تعافٍ حقيقية، ومعرفة التسلسل مسبقاً هي الفرق بين الثقة بالعملية والقلق في اليوم الثالث.',
    days: [
      { day: 'اليوم 0', title: 'دفء وشد', body: 'الـ spicules مستقرة وتعمل. توقعي حرارة وإحساساً بالشد والوخز طوال مساء الجلسة.' },
      { day: 'اليوم 1-3', title: 'تهيّج خفيف', body: 'حسب نوع بشرتك، قد يستمر التهيّج الخفيف حتى ثلاثة أيام. أبقي الروتين بسيطاً: تنظيف وتهدئة وحماية.' },
      { day: 'اليوم 2-3', title: 'بداية التقشير', body: 'يبدأ السطح بالتقشر. لا تنزعي القشور ولا تفركي - اتركيها تتساقط وحدها مع ترطيب جيد.' },
      { day: 'اليوم 5-7', title: 'سطح جديد', body: 'يكتمل التقشير وتبدو البشرة تحته أكثر إشراقاً ونعومة وتجانساً.' },
      { day: 'الأسبوع 2-4', title: 'الجزء المقاس', body: 'المرونة والترطيب يواصلان الارتفاع بعد استقرار السطح بوقت طويل. في الدراسة السريرية كانت قراءات الأسبوع الرابع هي الأقوى.' },
    ],
    note: 'بين الجلسات، تواصل أمبولة العناية المنزلية 5000 تقديم المكونات نفسها أسبوعياً بجرعة لا تتطلب فترة تعافٍ. الجلسة الاحترافية أولاً ثم العناية المنزلية - هكذا صُمم الخط ليُستخدم.',
  },
  complex: {
    eyebrow: 'داخل الأمبولة',
    title: 'ما الذي تحمله 3 مل فعلياً',
    body: 'أربع مجموعات عاملة، لكل منها مهمة مختلفة داخل النافذة التي تفتحها الـ spicules.',
    points: [
      {
        title: 'BIO-MESO™ PDRN بـ 60,000 جزء بالمليون',
        body: 'مركب الـ spicule بنسبة تقارب 6% من الوزن. للمقارنة، معظم علاجات الـ spicule الاحترافية تتراوح بين 0.3% و5%. أما الـ PDRN نفسه فهو Sodium DNA من حليب السلمون بتركيز 1,120 جزء بالمليون، ويتشابه بنحو 95% مع الحمض النووي البشري.',
      },
      {
        title: 'تسعة ببتيدات عوامل نمو',
        body: 'EGF وbFGF وaFGF وVEGF وIGF-1 وKGF وPlGF وHGF وTGF. تعمل معاً على تجدد الخلايا القرنية وتصنيع الكولاجين وتكوين الشعيرات الدموية وإصلاح الأنسجة.',
      },
      {
        title: 'ثمانية ببتيدات مقاومة للشيخوخة',
        body: 'Copper Tripeptide-1 وTripeptide-1 للكولاجين والإيلاستين، وAcetyl Hexapeptide-8 لخطوط التعبير، وNonapeptide-1 للتصبغات، وPalmitoyl Tetrapeptide-7 للتهدئة.',
      },
      {
        title: 'CeraShield-5 والبانثينول',
        body: 'خمسة سيراميدات بنسبة الدهون بين الخلايا مع الكوليسترول والأحماض الدهنية، إضافة إلى البانثينول بـ 10,000 جزء بالمليون. هذا هو النصف الذي يجعل النصف الآخر محتملاً.',
      },
    ],
  },
  howTo: {
    eyebrow: 'البروتوكول',
    title: 'كيف تسير الجلسة',
    frequency: 'مرة شهرياً · علاج احترافي',
    steps: [
      { title: 'التنظيف والتحضير', body: 'مزيل المكياج، ثم منظف Snow O₂ وتونر Snow Booster لترك البشرة نظيفة ومرطبة بتجانس قبل الأمبولة.' },
      { title: 'ضعي واضغطي ودلّكي', body: 'مع تجنب العينين والشفتين، وزّعي الأمبولة بالتساوي واضغطيها برفق قبل التدليك الدائري. احمي العينين بقطن مبلل.' },
      { title: 'طبقة ثانية وتدليك مجدداً', body: 'ضعي كريم Intensive Hydro Soothing فوقها ودلّكي مرة ثانية حتى تمتص الأمبولة بالكامل. تخطي هذه الخطوة هو ما تستخدمه العيادة لتخفيف حدة الجلسة للبشرة الحساسة.' },
      { title: 'الإنهاء وفق البروتوكول', body: 'استخدمي فقط المنتجات الختامية المعتمدة في بروتوكول العيادة. لا تفترضي أن قناعاً ورقياً منفصلاً مناسب مباشرة بعد جلسة الـ spicules ما لم تنص عبوته على ذلك.' },
      { title: 'حماية لأسبوع', body: 'واقي شمس كل صباح دون استثناء بينما يظهر السطح الجديد، ولا مكونات فعالة حتى ينتهي التقشير.' },
    ],
    note: 'أوقفي الريتينويد قبل 7 إلى 10 أيام من الجلسة، أو 14 يوماً للتريتينوين الموصوف طبياً، ولا تستأنفيه قبل 14 يوماً بعدها. إذا سبق أن تناولتِ الأيزوتريتينوين الفموي، فيجب تأجيل علاج الـ spicule ستة أشهر.',
  },
  video: {
    eyebrow: 'شاهديه يعمل',
    title: 'الـ spicule عن قرب',
    body: 'كيف تبدو بنية إسفنجية إبرية وهي تدخل البشرة، ولماذا يهم التغليف بقدر ما يهم الشكل.',
    unsupported: 'متصفحك لا يدعم تشغيل الفيديو.',
  },
  actives: {
    eyebrow: 'التركيبة',
    title: 'كل مكوّن فعال وما يفعله',
    intro: 'المكونات العاملة في هذه الأمبولة، ومهمة كل منها داخل النافذة التي تفتحها الـ spicules.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },
  lab: {
    eyebrow: 'الجودة',
    title: 'مصنوع ومختبر في كوريا',
    intro:
      'يُصنع في مقاطعة غيونغي، ولا تُطرح دفعة قبل أن تجتاز الاختبار. وهذه أرقام الدفعة التي بين يديك.',
    rows: [
      { label: 'القوام', value: 'لوشن أبيض، قريب من التعادل عند pH 7.27 - النطاق الذي يحافظ على ثبات النياسيناميد' },
      { label: 'التعقيم', value: 'خالٍ من E. coli وP. aeruginosa وS. aureus وC. albicans' },
      { label: 'التسجيل', value: 'مستحضر كوري ثنائي الوظيفة للتفتيح وتحسين التجاعيد، بالنياسيناميد والأدينوسين' },
      { label: 'معتمد في الإمارات', value: 'مسجّل لدى بلدية دبي على نظام مُنتجي، إضافة إلى شهادة البيع الحر الكورية' },
      { label: 'مدة الصلاحية', value: 'اثنا عشر شهراً بعد الفتح، معبأ في أمبولات 3 مل للاستخدام مرة واحدة' },
    ],
    disclaimer: 'كل دفعة إنتاج تُختبر قبل شحنها، ويمكننا أن نطلعك على نتائج دفعتك.',
  },
  clinical: {
    eyebrow: 'نتائج مقاسة',
    title: 'تطبيق واحد، أربعة أسابيع من القياسات',
    intro:
      'معظم منتجات هذه الفئة تطلب منكِ تصديق الآلية دون دليل. هذه الأمبولة خضعت لدراسة مستقلة وقيست نتائجها، وهذه أرقام الأسبوع الرابع بعد تطبيق احترافي واحد.',
    metrics: [
      { value: '-7.45%', label: 'تجاعيد محيط العين', detail: 'عمق خطوط العين، نزولاً من 4.8% في الأسبوع الأول' },
      { value: '+19.86%', label: 'مرونة البشرة', detail: 'ارتفاعاً من 5.7% في الأسبوع الأول و15.0% في الثاني' },
      { value: '+52.25%', label: 'ترطيب البشرة', detail: 'محتوى الرطوبة، من 19.0% في الأسبوع الأول' },
    ],
    note: 'تحسنت كثافة البشرة بنسبة 4.4% وزاوية شد الخد بنسبة 3.6% خلال الفترة نفسها، وتفوق عمق ومعدل الامتصاص الجلدي على المنتج المرجعي. لم يُسجل أي احمرار أو تورم أو حكة أو وخز في أي مرحلة.',
    disclaimer:
      'دراسة سريرية أجراها مركز KC Skin Research في سيول، من 11 أغسطس إلى 9 سبتمبر 2025. 20 متطوعة بعمر 48 ± 8، قيست النتائج بعد أسبوع وأسبوعين وأربعة أسابيع من تطبيق واحد مقارنة بمنطقة غير معالجة. والنتائج تختلف من شخص لآخر.',
  },
  safety: {
    eyebrow: 'قبل الحجز',
    title: 'متى يجب تجنب هذا العلاج',
    points: [
      'التهابات جلدية نشطة، أو جروح مفتوحة وبشرة متضررة',
      'حب شباب شديد أو وردية',
      'حساسية جلدية معروفة أو فرط حساسية',
      'أمراض المناعة الذاتية الجلدية بما فيها الذئبة والصدفية والإكزيما',
      'تقشير كيميائي أو ليزر أو ميكرونيدلينغ حديث',
      'سرطانات جلدية أو آفات ما قبل سرطانية',
      'حروق شمس أو تسمير حديث',
      'الحمل أو الرضاعة، ما لم يوافق طبيبك',
    ],
    note: 'بعد أي جهاز أو تقشير أو مكوّن فعال عالي التركيز، انتظري حتى تتعافى البشرة تماماً قبل جلسة الـ spicule - ولا تجمعيهما في اليوم نفسه. تجنبي منطقة العينين والشفتين تماماً.',
  },
  routine: {
    eyebrow: 'البروتوكول الكامل',
    title: 'ما الذي تُبنى عليه الجلسة',
    intro: 'تسلسل العيادة الذي تندرج ضمنه هذه الأمبولة، من التنظيف إلى الكريم الذي يهدّئ البشرة.',
    thisProduct: 'أنتِ هنا',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الحجم',
    fromPrice: 'ابتداءً من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'ما الذي يسأل عنه الناس',
    items: [
      {
        q: 'ما الفرق بينها وبين Homecare 5000؟',
        a: 'التركيبة نفسها، لكن باثني عشر ضعف الـ spicules. أمبولة العناية المنزلية بنسبة 0.5% تُستخدم أسبوعياً وتعادل إبرة 0.25 مم. هذه بنسبة 6% تُستخدم شهرياً وتعادل 1.0 مم. ومن المهم معرفته: محتوى الـ PDRN متقارب جداً بين الاثنتين. ما تشترينه هنا هو عمق التوصيل، لا كمية PDRN أكبر.',
      },
      {
        q: 'هل يمكنني استخدامها في المنزل؟',
        a: 'هي مصممة للاستخدام الاحترافي وتتجاوز نطاق التركيز الذي يُتعامل معه عادة خارج العيادة. اجعلي الجلسة على يد مختص مدرب، ثم حافظي على النتيجة بأمبولة العناية المنزلية أسبوعياً.',
      },
      {
        q: 'هل ستتقشر بشرتي؟',
        a: 'نعم، وهذا هو العلاج وهو يعمل. يبدأ التقشير عادة بعد يومين إلى ثلاثة من الجلسة وينتهي حوالي اليوم الخامس إلى السابع. لا تساعديه - نزع القشور هو ما يحوّل نتيجة جيدة إلى أثر دائم.',
      },
      {
        q: 'هل يؤلم؟',
        a: 'ستشعرين بحرارة وشد ووخز أثناء الجلسة وبعدها، وقد يستمر التهيّج الخفيف حتى ثلاثة أيام. هذا علاج حقيقي بفترة تعافٍ حقيقية. احجزيه حين تكون الأيام التالية لكِ.',
      },
      {
        q: 'أستخدم الريتينول. ماذا أفعل؟',
        a: 'أوقفيه قبل 7 إلى 10 أيام، أو 14 يوماً إن كنتِ على تريتينوين موصوف بتركيز 0.05% فأعلى. يجب أن تكون بشرتك هادئة وغير متقشرة يوم الجلسة. لا تستأنفيه قبل 14 يوماً، وبعد التعافي الكامل فقط.',
      },
      {
        q: 'مما تُصنع الـ spicules فعلياً؟',
        a: 'من الإسفنج النهري، يُستخلص ويُحلل إلى بنى دقيقة إبرية الشكل. والـ PDRN المغلف عليها هو Sodium DNA من حليب السلمون. كلاهما موثق في شهادة المنشأ مع بقية مكونات التركيبة.',
      },
      {
        q: 'كم مرة يجب تكرارها؟',
        a: 'مرة شهرياً. يبدأ البرنامج بجلسة احترافية، ثم عناية منزلية أسبوعية لشهرين، ثم الجلسة التالية - أي ثلاث إلى أربع جلسات سنوياً مع أمبولة العناية المنزلية بينها.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل',
    rows: [
      { label: 'العبوة', value: '3 مل × 4 أمبولات للاستخدام مرة واحدة' },
      { label: 'تركيز الـ spicules', value: '60,000 جزء بالمليون، نحو 6% من الوزن' },
      { label: 'عدد الـ spicules', value: 'من 300,000 إلى 360,000 لكل ملليلتر' },
      { label: 'يعادل إبرة', value: '1.0 مم' },
      { label: 'الـ PDRN', value: 'Sodium DNA بتركيز 1,120 جزء بالمليون، من حليب السلمون' },
      { label: 'التكرار', value: 'مرة شهرياً، علاج احترافي' },
      { label: 'أنواع البشرة', value: 'جميع الأنواع، باستثناء موانع الاستعمال أعلاه' },
      { label: 'بلد الصنع', value: 'صنع في كوريا' },
      { label: 'بعد الفتح', value: '12 شهراً' },
    ],
    brochure: 'حمّلي دليل العلاج',
  },
  backToProducts: 'كل المنتجات',
}

const RU: BioMesoCopy = {
  eyebrow: 'Bio-Meso · Профессиональная ампула',
  headline: 'Одна процедура в месяц. Измерено на протяжении четырёх недель.',
  subheadline:
    'Клиническая версия линии Bio-Meso. Спикулы в двенадцатикратной концентрации по сравнению с домашней ампулой раскрывают кожу как игла 1,0 мм и проводят с собой PDRN, семнадцать пептидов и пять церамидов - без единой иглы в кабинете.',
  heroBullets: [
    'BIO-MESO™ PDRN 60 000 ppm - в двенадцать раз больше, чем в домашней ампуле',
    'От 300 000 до 360 000 спикул в каждом миллилитре',
    'Эквивалент иглы 1,0 мм, один раз в месяц',
    '17 пептидов, 5 церамидов, пантенол 10 000 ppm',
    'Морщины, упругость и увлажнение измерены на 20 женщинах',
  ],
  badges: ['Сделано в Корее', '3 мл × 4 · 12 месяцев после вскрытия', 'Корейское двухфункциональное средство', 'Профессиональное применение'],
  weeklyNote: 'Раз в месяц · в клинике',
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
    { value: '60,000ppm', label: 'Комплекс BIO-MESO™ PDRN' },
    { value: '1.0mm', label: 'Эквивалент иглы, без игл' },
    { value: '12×', label: 'Спикул по сравнению с домашней ампулой' },
    { value: '17', label: 'Типов пептидов в комплексе' },
  ],
  science: {
    eyebrow: 'Как это работает',
    title: 'Микронидлинг без иглы',
    intro:
      'Механическую работу выполняют спикулы пресноводной губки. Поскольку PDRN нанесён прямо на поверхность спикул, он проникает в тот же момент, когда открывается канал, а не ждёт своей очереди на поверхности.',
    cards: [
      {
        title: 'Канал открывается',
        body: 'При вдавливании в кожу игловидные спикулы формируют временные микроканалы через роговой слой. При 60 000 ppm стимуляция эквивалентна игле 1,0 мм - поэтому это ежемесячная профессиональная процедура, а не еженедельная.',
      },
      {
        title: 'PDRN входит вместе с ними',
        body: 'Это спикула третьего поколения (cog spicule). PDRN связан в форме фитосомы и нанесён на поверхность спикулы, поэтому активный компонент и канал появляются одновременно.',
      },
      {
        title: 'Контролируемый отклик',
        body: 'Механическая стимуляция запускает мягкий, намеренный воспалительный ответ. Именно он пробуждает фибробласты и запускает синтез коллагена и обновление эпидермиса - причина, по которой кожа выглядит плотнее спустя недели после одной процедуры.',
      },
      {
        title: 'Барьер восстанавливается',
        body: 'Пять церамидов - NP, EOP, AS, AP и NS - вместе с фитосфингозином, холестерином и пантенолом 10 000 ppm восстанавливают липидный барьер, пока кожа обновляется под ним.',
      },
    ],
    figureAlt: 'Технология спикул BIO-MESO PDRN - микроканалы, доставка PDRN в форме фитосомы и обновление кожи',
  },
  timeline: {
    eyebrow: 'Чего ожидать',
    title: 'Месяц после процедуры',
    intro:
      'Это настоящая процедура с настоящим восстановительным периодом, и знание последовательности - разница между доверием к процессу и паникой на третий день.',
    days: [
      { day: 'День 0', title: 'Тепло и стянутость', body: 'Спикулы на месте и работают. Ожидайте жар и ощущение стянутости и покалывания весь вечер после процедуры.' },
      { day: 'Дни 1-3', title: 'Лёгкое раздражение', body: 'В зависимости от типа кожи лёгкое раздражение может длиться до трёх дней. Оставьте уход минимальным: очищение, успокоение, защита.' },
      { day: 'Дни 2-3', title: 'Начинается отшелушивание', body: 'Поверхность начинает сходить. Не сдирайте и не трите - дайте ей отойти самостоятельно и хорошо увлажняйте.' },
      { day: 'Дни 5-7', title: 'Новая поверхность', body: 'Шелушение завершается, и кожа под ним выглядит светлее, ровнее и глаже.' },
      { day: 'Недели 2-4', title: 'Измеримая часть', body: 'Упругость и увлажнённость продолжают расти ещё долго после того, как поверхность успокоилась. В клиническом исследовании показатели четвёртой недели оказались самыми высокими.' },
    ],
    note: 'Между процедурами домашняя ампула 5000 продолжает работу теми же активами еженедельно в дозе, не требующей восстановления. Сначала профессиональная процедура, затем домашний уход - именно так задумана линия.',
  },
  complex: {
    eyebrow: 'Внутри ампулы',
    title: 'Что на самом деле несут эти 3 мл',
    body: 'Четыре рабочие группы, у каждой своя задача в окне, которое открывают спикулы.',
    points: [
      {
        title: 'BIO-MESO™ PDRN, 60 000 ppm',
        body: 'Комплекс спикул, около 6% по массе. Для сравнения: большинство профессиональных процедур со спикулами работают в диапазоне от 0,3% до 5%. Сам PDRN - это Sodium DNA из молок лосося в концентрации 1 120 ppm, совпадающий с человеческой ДНК примерно на 95%.',
      },
      {
        title: 'Девять пептидов факторов роста',
        body: 'EGF, bFGF, aFGF, VEGF, IGF-1, KGF, PlGF, HGF и TGF. Вместе они запускают обновление кератиноцитов, синтез коллагена, образование капилляров и восстановление тканей.',
      },
      {
        title: 'Восемь антивозрастных пептидов',
        body: 'Copper Tripeptide-1 и Tripeptide-1 для коллагена и эластина, Acetyl Hexapeptide-8 для мимических линий, Nonapeptide-1 для пигментации, Palmitoyl Tetrapeptide-7 для успокоения.',
      },
      {
        title: 'CeraShield-5 и пантенол',
        body: 'Пять церамидов в соотношении межклеточных липидов с холестерином и жирными кислотами плюс пантенол 10 000 ppm. Это та половина формулы, которая делает вторую половину переносимой.',
      },
    ],
  },
  howTo: {
    eyebrow: 'Протокол',
    title: 'Как проходит процедура',
    frequency: 'Раз в месяц · профессиональная процедура',
    steps: [
      { title: 'Очищение и подготовка', body: 'Средство для снятия макияжа, затем очищающее средство Snow O₂ и тоник Snow Booster, чтобы кожа была чистой и равномерно увлажнённой перед ампулой.' },
      { title: 'Нанести, вдавить, прокатать', body: 'Избегая области глаз и губ, равномерно распределите ампулу и вбейте её перед роллингом. Глаза защитите влажными ватными дисками.' },
      { title: 'Слой и повторный роллинг', body: 'Нанесите сверху Intensive Hydro Soothing Cream и прокатайте второй раз, чтобы ампула впиталась полностью. Пропуск этого шага - способ снизить интенсивность процедуры для чувствительной кожи.' },
      { title: 'Завершение по протоколу', body: 'Используйте только завершающие средства, утверждённые протоколом клиники. Не считайте отдельную тканевую маску подходящей сразу после сеанса со спикулами, если такое применение не указано на её упаковке.' },
      { title: 'Защита на неделю', body: 'Солнцезащитный крем каждое утро без исключений, пока проступает новая поверхность, и никаких активов до окончания шелушения.' },
    ],
    note: 'Отмените ретиноиды за 7-10 дней до процедуры или за 14 дней при рецептурном третиноине и не возобновляйте их в течение 14 дней после. Если вы принимали изотретиноин внутрь, процедуру со спикулами следует отложить на шесть месяцев.',
  },
  video: {
    eyebrow: 'Посмотрите, как это работает',
    title: 'Спикула вблизи',
    body: 'Как выглядит игловидная структура губки, входящая в кожу, и почему покрытие важно не меньше формы.',
    unsupported: 'Ваш браузер не поддерживает воспроизведение видео.',
  },
  actives: {
    eyebrow: 'Состав',
    title: 'Каждый актив и его задача',
    intro: 'Рабочие компоненты этой ампулы и роль каждого в окне, которое открывают спикулы.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },
  lab: {
    eyebrow: 'Качество',
    title: 'Произведено и протестировано в Корее',
    intro:
      'Производится в провинции Кёнгидо, и ни одна партия не выходит, не пройдя проверку. Это показатели той партии, что у вас в руках.',
    rows: [
      { label: 'Текстура', value: 'Белый лосьон, почти нейтральный pH 7,27 - диапазон, в котором ниацинамид стабилен' },
      { label: 'Стерильность', value: 'Не обнаружены E. coli, P. aeruginosa, S. aureus и C. albicans' },
      { label: 'Регистрация', value: 'Корейское двухфункциональное средство для осветления и коррекции морщин, на ниацинамиде и аденозине' },
      { label: 'Допуск в ОАЭ', value: 'Зарегистрировано в муниципалитете Дубая в системе Montaji, в дополнение к корейскому сертификату свободной продажи' },
      { label: 'Срок годности', value: 'Двенадцать месяцев после вскрытия, в одноразовых ампулах по 3 мл' },
    ],
    disclaimer: 'Каждая производственная партия проверяется перед отгрузкой, и результаты по вашей мы готовы показать.',
  },
  clinical: {
    eyebrow: 'Измеренные результаты',
    title: 'Одно применение, четыре недели измерений',
    intro:
      'Большинство средств в этой категории предлагают поверить механизму на слово. Эту ампулу отдали независимой лаборатории и измерили - вот показатели четвёртой недели после одного профессионального применения.',
    metrics: [
      { value: '-7.45%', label: 'Морщины вокруг глаз', detail: 'Глубина «гусиных лапок», против 4,8% на первой неделе' },
      { value: '+19.86%', label: 'Упругость кожи', detail: 'Против 5,7% на первой неделе и 15,0% на второй' },
      { value: '+52.25%', label: 'Увлажнённость кожи', detail: 'Содержание влаги, против 19,0% на первой неделе' },
    ],
    note: 'За тот же период плотность кожи выросла на 4,4%, а угол подтяжки щеки - на 3,6%; глубина и скорость дермальной абсорбции превзошли контрольный продукт. Ни эритемы, ни отёка, ни зуда, ни покалывания не зафиксировано ни на одном этапе.',
    disclaimer:
      'Клиническое исследование KC Skin Research Center, Сеул, с 11 августа по 9 сентября 2025 года. 20 женщин в возрасте 48 ± 8 лет, измерения через 1, 2 и 4 недели после одного применения в сравнении с необработанным участком. Результаты индивидуальны.',
  },
  safety: {
    eyebrow: 'Перед записью',
    title: 'Когда эту процедуру делать нельзя',
    points: [
      'Активные кожные инфекции, открытые раны и повреждённая кожа',
      'Тяжёлое акне или розацеа',
      'Известная кожная аллергия или гиперчувствительность',
      'Аутоиммунные заболевания кожи, включая волчанку, псориаз и экзему',
      'Недавний химический пилинг, лазерная шлифовка или микронидлинг',
      'Рак кожи или предраковые образования',
      'Недавний солнечный ожог или загар',
      'Беременность и грудное вскармливание, если врач не дал разрешения',
    ],
    note: 'После любого аппарата, пилинга или высококонцентрированного актива дождитесь полного восстановления кожи, прежде чем делать процедуру со спикулами, и никогда не совмещайте их в один день. Область глаз и губ полностью исключается.',
  },
  routine: {
    eyebrow: 'Полный протокол',
    title: 'Из чего состоит процедура',
    intro: 'Клиническая последовательность, внутри которой работает эта ампула, - от очищения до крема, который всё успокаивает.',
    thisProduct: 'Вы здесь',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать размер',
    fromPrice: 'от',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'О чём спрашивают',
    items: [
      {
        q: 'Чем это отличается от Homecare 5000?',
        a: 'Та же формула, но спикул в двенадцать раз больше. Домашняя ампула - 0,5% спикул еженедельно, эквивалент иглы 0,25 мм. Эта - 6%, раз в месяц, эквивалент 1,0 мм. Важно понимать: содержание PDRN у них практически одинаковое. Здесь вы покупаете глубину доставки, а не большее количество PDRN.',
      },
      {
        q: 'Можно ли пользоваться дома?',
        a: 'Средство разработано для профессионального применения и по концентрации выходит за пределы диапазона, с которым обычно работают вне клиники. Процедуру должен проводить обученный специалист, а результат вы поддерживаете домашней ампулой раз в неделю.',
      },
      {
        q: 'Будет ли шелушение?',
        a: 'Да, и это признак того, что процедура работает. Отшелушивание обычно начинается через два-три дня и заканчивается примерно на пятый-седьмой день. Не помогайте ему - сдирание корочек превращает хороший результат в след на коже.',
      },
      {
        q: 'Это больно?',
        a: 'Во время и после процедуры вы почувствуете жар, стянутость и покалывание, а лёгкое раздражение может длиться до трёх дней. Это настоящая процедура с настоящим восстановлением. Записывайтесь тогда, когда ближайшие дни свободны.',
      },
      {
        q: 'Я пользуюсь ретинолом. Что делать?',
        a: 'Отмените за 7-10 дней или за 14 дней, если используете рецептурный третиноин 0,05% и выше. В день процедуры кожа должна быть спокойной и без шелушения. Не возобновляйте раньше чем через 14 дней и только после полного восстановления.',
      },
      {
        q: 'Из чего сделаны спикулы?',
        a: 'Из пресноводной губки: сырьё гидролизуют до игловидных микроструктур. Нанесённый на них PDRN - это Sodium DNA из молок лосося. И то и другое указано в сертификате происхождения вместе с остальными компонентами формулы.',
      },
      {
        q: 'Как часто её делать?',
        a: 'Раз в месяц. Программа выглядит так: профессиональная процедура, затем два месяца еженедельного домашнего ухода, затем следующая процедура - три-четыре сеанса в год, а домашняя ампула удерживает результат между ними.',
      },
    ],
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Детали',
    rows: [
      { label: 'Формат', value: '3 мл × 4 одноразовые ампулы' },
      { label: 'Концентрация спикул', value: '60 000 ppm, около 6% по массе' },
      { label: 'Количество спикул', value: 'От 300 000 до 360 000 на миллилитр' },
      { label: 'Эквивалент иглы', value: '1,0 мм' },
      { label: 'PDRN', value: 'Sodium DNA 1 120 ppm, из молок лосося' },
      { label: 'Частота', value: 'Раз в месяц, профессиональная процедура' },
      { label: 'Типы кожи', value: 'Все типы, кроме перечисленных противопоказаний' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
      { label: 'После вскрытия', value: '12 месяцев' },
    ],
    brochure: 'Скачать руководство по процедуре',
  },
  backToProducts: 'Все продукты',
}

const AUDITED_AR: BioMesoCopy = {
  ...AR,
  eyebrow: 'BIO-MESO · أمبولة احترافية',
  headline: 'تركيبة موثقة ونتائج مقاسة لأربعة أسابيع.',
  subheadline:
    'أمبولة تجميلية احترافية تحتوي على 5.72022% من Hydrolyzed Sponge و1,120 جزءاً في المليون من Sodium DNA المستخلص من حليب السلمون. يشير الرقم 60000 إلى تركيز مركب BIO-MESO™ PDRN كاملاً، وليس إلى جرعة PDRN أو عدد الشويكات.',
  heroBullets: [
    'مركب BIO-MESO™ PDRN بتركيز 60,000 جزء في المليون',
    'Hydrolyzed Sponge من إسفنج المياه العذبة بنسبة 5.72022%',
    'Sodium DNA ‏(PDRN) من حليب السلمون بتركيز 1,120 جزءاً في المليون',
    'نياسيناميد 2% · بانثينول 1% · أدينوزين 0.04%',
    'دراسة استخدام واحد على 20 امرأة مع قياسات حتى 4 أسابيع',
  ],
  badges: ['صنع في كوريا', '4 أمبولات × 3 مل', 'مستحضر كوري ثنائي الوظيفة', 'للاستخدام الاحترافي'],
  weeklyNote: 'يستخدم وفق بروتوكول مختص مدرّب',
  stats: [
    { value: '60,000 ppm', label: 'مركب BIO-MESO™ PDRN، وليس PDRN وحده' },
    { value: '5.72022%', label: 'Hydrolyzed Sponge' },
    { value: '1,120 ppm', label: 'Sodium DNA ‏(PDRN)' },
    { value: '4 × 3 ml', label: 'العبوة الحالية المسجلة' },
  ],
  science: {
    eyebrow: 'ما الذي تثبته المستندات',
    title: 'تركيبة سبكيولية عالية التركيز.',
    intro:
      'تضع التركيبة Hydrolyzed Sponge ثانياً بعد الماء. ويحدد ملف المنشأ مصدره من إسفنج المياه العذبة، بينما يحدد مصدر Sodium DNA من حليب السلمون.',
    cards: [
      { title: 'الرقم 60000', body: 'هو 60,000 جزء في المليون من مركب BIO-MESO™ PDRN كاملاً. لا يعني 60,000 جزء في المليون من PDRN ولا 60,000 شويكة.' },
      { title: 'السبكيولات', body: 'Hydrolyzed Sponge موجود بنسبة 5.72022%. لا تنشر التركيبة الكمية عدداً مستقلاً للشويكات، لذلك لا نحول النسبة إلى عدد تسويقي.' },
      { title: 'PDRN منفصل', body: 'Sodium DNA موجود بنسبة 0.112%، أي 1,120 جزءاً في المليون، ومصدره الرسمي حليب السلمون.' },
      { title: 'المكونات الوظيفية', body: 'النياسيناميد 2% والأدينوزين 0.04% هما المكوّنان المرتبطان بوظيفتي التفتيح والعناية بمظهر التجاعيد في التسجيل الكوري.' },
    ],
    figureAlt: 'تركيبة BIO-MESO PDRN Expert 60000 ومكوناتها الموثقة',
  },
  timeline: {
    eyebrow: 'ما الذي يمكن توقعه',
    title: 'استجابة تختلف من بشرة إلى أخرى.',
    intro:
      'تذكر المادة التدريبية احتمال تهيج خفيف حتى ثلاثة أيام وظهور تقشر بعد يومين إلى ثلاثة أيام. هذه احتمالات وليست علامة إلزامية على الفعالية.',
    days: [
      { day: 'بعد التطبيق', title: 'راقبي البشرة', body: 'قد يظهر إحساس بالوخز أو احمرار خفيف. لا تفسري الألم الشديد أو التورم أو التهيج المتفاقم على أنه استجابة طبيعية.' },
      { day: 'حتى 3 أيام', title: 'قد يستمر تهيج خفيف', body: 'أوقفي المنتجات المهيجة واتّبعي تعليمات المختص. إذا استمرت الأعراض أو اشتدت، أوقفي الاستخدام واطلبي المشورة الطبية.' },
      { day: 'اليوم 2-3', title: 'قد يظهر تقشر', body: 'لا تفركي أو تنزعي القشور. لا تفترض الصفحة موعداً لانتهاء التقشر لأن المصدر لا يحدده.' },
      { day: 'الأسابيع 1-4', title: 'فترة القياس السريري', body: 'قيست التجاعيد والمرونة والترطيب بعد أسبوع وأسبوعين وأربعة أسابيع من استخدام واحد.' },
    ],
    note: 'لا تحدد العبوة دورة علاج أو فاصلاً شهرياً أو برنامجاً إلزامياً مع Homecare 5000.',
  },
  complex: {
    eyebrow: 'داخل الأمبولة',
    title: 'التركيزات التي يمكن إثباتها.',
    body: 'نفصل بين مكونات مثبتة كمياً وبين مكونات موجودة في INCI بتراكيز ضئيلة.',
    points: [
      { title: 'Hydrolyzed Sponge · 5.72022%', body: 'مكوّن سبكيولي من إسفنج المياه العذبة، وهو ثاني مكوّن بعد الماء.' },
      { title: 'Sodium DNA · 0.112%', body: 'يعادل 1,120 جزءاً في المليون. المصدر الرسمي هو حليب السلمون.' },
      { title: 'نياسيناميد 2% + أدينوزين 0.04%', body: 'الثنائي الوظيفي للتفتيح والعناية بمظهر التجاعيد.' },
      { title: 'بانثينول 1%', body: 'أي 10,000 جزء في المليون. وتوجد 17 ببتيداً و5 سيراميدات في التركيبة، لكن بتراكيز ضئيلة لا تبرر إسناد نتائج مستقلة إليها.' },
    ],
  },
  howTo: {
    eyebrow: 'تعليمات العبوة',
    title: 'تطبيق احترافي كما هو مطبوع.',
    frequency: 'لا تحدد العبوة فاصلاً أو دورة علاج',
    steps: [
      { title: 'قيّمي البشرة أولاً', body: 'لا تستخدميه على الحالات المذكورة في قسم السلامة. هذا منتج احترافي عالي التركيز يستخدمه مختص مدرّب.' },
      { title: 'وزعي واضغطي بلطف', body: 'مع تجنب محيط العينين والشفتين، وزعي الأمبولة بالتساوي واضغطي بلطف.' },
      { title: 'نفذي التمرير', body: 'بعد الضغط اللطيف، نفذي التمرير وفق البروتوكول الاحترافي.' },
      { title: 'أضيفي الكريم', body: 'ضعي Intensive Hydro Soothing Cream، ثم كرري التمرير حتى امتصاص الأمبولة.' },
      { title: 'لا تضيفي توقيتاً غير مطبوع', body: 'لا تحدد العبوة جرعة رقمية للوجه أو مدة تماس أو شطفاً أو عدداً من الجلسات.' },
    ],
    note: 'لا توجد على العبوة فترات زمنية لإيقاف الريتينويدات أو الإيزوتريتينوين؛ يحدد الطبيب المعالج أو المختص ما يلزم بحسب المنتج والحالة.',
  },
  video: {
    eyebrow: 'عرض المنتج',
    title: 'شاهدي القوام وطريقة التعامل.',
    body: 'يعرض الفيديو المنتج بصرياً، ولا يثبت عمق اختراق أو تكوين قنوات أو توصيل مكونات فعالة.',
    unsupported: AR.video.unsupported,
  },
  actives: {
    eyebrow: 'التركيبة',
    title: 'مكونات مسجلة بتركيزات واضحة.',
    intro: 'نبرز فقط ما تثبته الصيغة الكمية، مع إبقاء قائمة INCI كاملة.',
    fullInci: AR.actives.fullInci,
    fullInciNote: AR.actives.fullInciNote,
  },
  lab: {
    eyebrow: 'الجودة',
    title: 'دفعة مطابقة للمواصفات.',
    intro: 'يسجل COA للدفعة 001EH قوام لوشن أبيض ونتائج فيزيائية وميكروبيولوجية مطابقة.',
    rows: [
      { label: 'pH', value: '7.27 ضمن مواصفة 5.70-7.70' },
      { label: 'القوام', value: 'لوشن أبيض، لزوجة 5,210 وكثافة نوعية 1.029' },
      { label: 'الفحص الميكروبي', value: 'لم تُكتشف الكائنات الخمسة المدرجة في COA' },
      { label: 'الوظيفة الكورية', value: 'يساعد على التفتيح وتحسين مظهر التجاعيد بالنياسيناميد والأدينوزين' },
      { label: 'العبوة', value: '4 أمبولات × 3 مل · 12 شهراً بعد الفتح' },
    ],
    disclaimer: 'هذه نتائج دفعة محددة وليست ضماناً لعدم التهيج لدى كل مستخدم.',
  },
  clinical: {
    eyebrow: 'نتائج مقاسة',
    title: 'استخدام واحد وقياسات حتى أربعة أسابيع.',
    intro: 'أجرى KC Skin Research Center دراسة على المنتج نفسه، مع قياسات قبل الاستخدام وبعد أسبوع وأسبوعين وأربعة أسابيع.',
    metrics: [
      { value: '-7.446%', label: 'تجاعيد محيط العين', detail: 'التغير عن خط الأساس بعد 4 أسابيع' },
      { value: '+19.858%', label: 'مرونة البشرة', detail: 'التغير عن خط الأساس بعد 4 أسابيع' },
      { value: '+52.247%', label: 'محتوى رطوبة البشرة', detail: 'التغير عن خط الأساس بعد 4 أسابيع' },
    ],
    note: 'لم تسجل استمارات التقييم تفاعلات جلدية محددة أثناء الدراسة. لا يعني ذلك أن المنتج خالٍ من احتمال الوخز أو الاحمرار أو التهيج لدى مستخدمين آخرين.',
    disclaimer: 'KC Skin Research Center، سيول، 11 أغسطس - 9 سبتمبر 2025. استخدام واحد، 20 امرأة بمتوسط عمر 48 ± 8 عاماً؛ قياسات بعد أسبوع وأسبوعين و4 أسابيع. النتائج فردية.',
  },
  safety: {
    eyebrow: 'قبل التطبيق',
    title: 'متى يجب عدم استخدامه.',
    points: [
      'حب الشباب البثري أو الوردية',
      'الجروح المفتوحة أو الجلد المتشقق',
      'عدوى جلدية نشطة',
      'حساسية جلدية معروفة أو فرط حساسية واضح',
      'أمراض مناعة ذاتية جلدية مثل الذئبة أو الصدفية أو الإكزيما',
      'إجراء جلدي حديث، بما فيه التقشير الكيميائي أو الليزر أو الوخز الدقيق',
      'سرطان الجلد أو آفات سابقة للتسرطن',
      'حرق شمس أو تسمير حديث',
    ],
    note: 'تجنبي محيط العينين والشفتين. أوقفي الاستخدام وراجعي الطبيب عند الاحمرار أو التورم أو التهيج. لا تضيف العبوة موانع للحمل أو الرضاعة ولا جداول زمنية للريتينويدات.',
  },
  routine: {
    eyebrow: 'تسلسل العبوة',
    title: 'الأمبولة ثم Intensive Hydro Soothing Cream.',
    intro: 'هذا هو الاقتران الذي تنص عليه العبوة. المنتجات الإضافية في بطاقات الروتين ليست بديلاً عن بروتوكول المختص.',
    thisProduct: AR.routine.thisProduct,
    viewProduct: AR.routine.viewProduct,
    chooseOptions: AR.routine.chooseOptions,
    fromPrice: AR.routine.fromPrice,
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'إجابات بلا مبالغة.',
    items: [
      { q: 'ماذا يعني 60000؟', a: 'يعني 60,000 جزء في المليون من مركب BIO-MESO™ PDRN كاملاً. Sodium DNA ‏(PDRN) وحده موجود بتركيز 1,120 جزءاً في المليون.' },
      { q: 'هل 60000 هو عدد الشويكات؟', a: 'لا. التركيبة تثبت Hydrolyzed Sponge بنسبة 5.72022%، لكنها لا تنشر عدداً منفصلاً للشويكات.' },
      { q: 'هل هو إجراء وخز أو حقن؟', a: 'لا. هو مستحضر تجميلي سبكيولي موضعي، وليس جهاز وخز دقيق ولا حقناً، ولا نساويه بعمق إبرة.' },
      { q: 'هل يمكن استخدامه في المنزل؟', a: 'المادة الرسمية تصفه للاستخدام الاحترافي وتذكر أن التراكيز الأعلى من 1% مخصصة لمختصين مدرّبين. لا نزعم أن مهنة بعينها مرخصة قانوناً لاستخدامه من دون تحقق محلي.' },
      { q: 'هل أستخدمه مع Homecare 5000؟', a: 'يعرض الدليل المنتجين ضمن خط واحد، لكن العبوة الحالية لا تفرض نظاماً ثنائياً أو دورة علاج. يحدد المختص أي عناية منزلية لاحقة.' },
      { q: 'هل ستتقشر البشرة؟', a: 'قد يظهر تقشر بعد يومين إلى ثلاثة أيام وفق المادة التدريبية، لكنه ليس شرطاً للفعالية. أوقفي الاستخدام عند الألم الشديد أو التورم أو التهيج المتفاقم.' },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل الموثقة.',
    rows: [
      { label: 'العبوة', value: '4 أمبولات × 3 مل' },
      { label: 'مركب BIO-MESO™ PDRN', value: '60,000 جزء في المليون' },
      { label: 'Hydrolyzed Sponge', value: '5.72022% · إسفنج مياه عذبة' },
      { label: 'Sodium DNA ‏(PDRN)', value: '0.112% / 1,120 جزءاً في المليون · من حليب السلمون' },
      { label: 'المكونات الوظيفية', value: 'نياسيناميد 2% · أدينوزين 0.04%' },
      { label: 'بانثينول', value: '1% / 10,000 جزء في المليون' },
      { label: 'الاستخدام', value: 'احترافي، وفق بروتوكول مختص مدرّب' },
      { label: 'بلد الصنع', value: 'كوريا الجنوبية' },
      { label: 'بعد الفتح', value: '12 شهراً' },
    ],
    brochure: AR.details.brochure,
  },
}

const AUDITED_RU: BioMesoCopy = {
  ...RU,
  eyebrow: 'BIO-MESO · Профессиональная ампула',
  headline: 'Документированная формула. Четыре недели измерений.',
  subheadline:
    'Профессиональная косметическая ампула с 5,72022% Hydrolyzed Sponge и 1 120 ppm Sodium DNA из молок лосося. Число 60000 относится ко всему комплексу BIO-MESO™ PDRN, а не к дозе PDRN или количеству спикул.',
  heroBullets: [
    'Комплекс BIO-MESO™ PDRN · 60 000 ppm',
    'Hydrolyzed Sponge из пресноводной губки · 5,72022%',
    'Sodium DNA (PDRN) из молок лосося · 1 120 ppm',
    'Ниацинамид 2% · пантенол 1% · аденозин 0,04%',
    'Одно применение, 20 женщин, измерения до 4 недель',
  ],
  badges: ['Сделано в Корее', '4 ампулы × 3 мл', 'Корейское двухфункциональное средство', 'Профессиональное применение'],
  weeklyNote: 'По протоколу обученного специалиста',
  stats: [
    { value: '60 000 ppm', label: 'Комплекс BIO-MESO™ PDRN, не один PDRN' },
    { value: '5,72022%', label: 'Hydrolyzed Sponge' },
    { value: '1 120 ppm', label: 'Sodium DNA (PDRN)' },
    { value: '4 × 3 мл', label: 'Текущая зарегистрированная упаковка' },
  ],
  science: {
    eyebrow: 'Что подтверждают документы',
    title: 'Высококонцентрированная спикульная формула.',
    intro: 'Hydrolyzed Sponge стоит вторым после воды. Сертификат происхождения указывает пресноводную губку, а для Sodium DNA - молоки лосося.',
    cards: [
      { title: 'Что означает 60000', body: 'Это 60 000 ppm всего комплекса BIO-MESO™ PDRN. Не 60 000 ppm PDRN и не 60 000 спикул.' },
      { title: 'Спикульный компонент', body: 'Hydrolyzed Sponge содержится в концентрации 5,72022%. Количественная формула не публикует отдельное число спикул.' },
      { title: 'PDRN указан отдельно', body: 'Sodium DNA составляет 0,112%, то есть 1 120 ppm. Официальный источник сырья - молоки лосося.' },
      { title: 'Функциональные компоненты', body: 'Ниацинамид 2% и аденозин 0,04% связаны с корейскими функциями осветления и ухода за видимыми морщинами.' },
    ],
    figureAlt: 'Документированная формула BIO-MESO PDRN Expert 60000',
  },
  timeline: {
    eyebrow: 'Чего ожидать',
    title: 'Реакция кожи индивидуальна.',
    intro: 'Учебный материал допускает лёгкое раздражение до трёх дней и шелушение примерно на второй - третий день. Это возможные реакции, а не обязательный признак эффективности.',
    days: [
      { day: 'После нанесения', title: 'Наблюдайте за кожей', body: 'Возможны покалывание или лёгкое покраснение. Сильная боль, выраженный отёк или нарастающее раздражение не должны нормализоваться как «работа средства».' },
      { day: 'До 3 дней', title: 'Лёгкое раздражение возможно', body: 'Исключите раздражающие средства и следуйте указаниям специалиста. При ухудшении прекратите применение и обратитесь за медицинской помощью.' },
      { day: 'День 2-3', title: 'Возможно шелушение', body: 'Не трите кожу и не снимайте чешуйки. Источник не указывает универсальный день завершения.' },
      { day: 'Недели 1-4', title: 'Период клинических измерений', body: 'Морщины, упругость и увлажнённость оценивали через 1, 2 и 4 недели после одного применения.' },
    ],
    note: 'Упаковка не устанавливает курс, ежемесячный интервал или обязательную схему с Homecare 5000.',
  },
  complex: {
    eyebrow: 'Внутри ампулы',
    title: 'Концентрации, которые можно доказать.',
    body: 'Отделяем количественно подтверждённые компоненты от следовых ингредиентов.',
    points: [
      { title: 'Hydrolyzed Sponge · 5,72022%', body: 'Спикульный материал из пресноводной губки; второй компонент после воды.' },
      { title: 'Sodium DNA · 0,112%', body: '1 120 ppm. Официальный источник - молоки лосося.' },
      { title: 'Ниацинамид 2% + аденозин 0,04%', body: 'Функциональная пара для осветления и ухода за видимыми морщинами.' },
      { title: 'Пантенол 1%', body: '10 000 ppm. В составе также есть 17 пептидов и 5 церамидов, но их следовые концентрации не позволяют приписывать им отдельный эффект.' },
    ],
  },
  howTo: {
    eyebrow: 'Инструкция на упаковке',
    title: 'Профессиональное нанесение без домыслов.',
    frequency: 'Упаковка не задаёт интервал или курс',
    steps: [
      { title: 'Сначала оценка кожи', body: 'Не применяйте при состояниях из раздела безопасности. Средство высокой концентрации используется обученным специалистом.' },
      { title: 'Распределить и мягко прижать', body: 'Избегая области глаз и губ, равномерно распределите ампулу и мягко прижмите кожу.' },
      { title: 'Выполнить роллинг', body: 'После мягкого прижатия выполните роллинг по профессиональному протоколу.' },
      { title: 'Нанести крем', body: 'Добавьте Intensive Hydro Soothing Cream и повторите роллинг до впитывания ампулы.' },
      { title: 'Не придумывать таймер', body: 'Упаковка не задаёт числовую дозу на лицо, время контакта, смывание или число сеансов.' },
    ],
    note: 'На упаковке нет сроков отмены ретиноидов или изотретиноина. Их определяет лечащий врач или специалист с учётом конкретного препарата и состояния кожи.',
  },
  video: {
    eyebrow: 'Визуальный обзор',
    title: 'Посмотрите текстуру и обращение с продуктом.',
    body: 'Видео показывает продукт, но само по себе не доказывает глубину проникновения, образование каналов или доставку активов.',
    unsupported: RU.video.unsupported,
  },
  actives: {
    eyebrow: 'Формула',
    title: 'Зарегистрированные компоненты с точными концентрациями.',
    intro: 'Выделяем только количественно подтверждённые ингредиенты и сохраняем полный INCI.',
    fullInci: RU.actives.fullInci,
    fullInciNote: RU.actives.fullInciNote,
  },
  lab: {
    eyebrow: 'Качество',
    title: 'Партия в пределах спецификации.',
    intro: 'COA партии 001EH описывает белый лосьон и соответствующие спецификации физические и микробиологические показатели.',
    rows: [
      { label: 'pH', value: '7,27 при спецификации 5,70-7,70' },
      { label: 'Текстура', value: 'Белый лосьон, вязкость 5 210, удельный вес 1,029' },
      { label: 'Микробиология', value: 'Пять перечисленных в COA микроорганизмов не обнаружены' },
      { label: 'Корейские функции', value: 'Помогает осветлить кожу и улучшить вид морщин благодаря ниацинамиду и аденозину' },
      { label: 'Упаковка', value: '4 ампулы × 3 мл · 12 месяцев после вскрытия' },
    ],
    disclaimer: 'Это показатели конкретной партии, а не гарантия отсутствия раздражения у каждого пользователя.',
  },
  clinical: {
    eyebrow: 'Измеренные результаты',
    title: 'Одно применение, измерения до четырёх недель.',
    intro: 'KC Skin Research Center исследовал именно Expert Ampoule 60000, измеряя показатели до применения и через 1, 2 и 4 недели.',
    metrics: [
      { value: '-7,446%', label: 'Морщины вокруг глаз', detail: 'Изменение от исходного уровня через 4 недели' },
      { value: '+19,858%', label: 'Упругость кожи', detail: 'Изменение от исходного уровня через 4 недели' },
      { value: '+52,247%', label: 'Показатель увлажнённости', detail: 'Изменение от исходного уровня через 4 недели' },
    ],
    note: 'В формах исследования не зафиксировали перечисленных кожных нежелательных реакций. Это не гарантирует отсутствие покалывания, покраснения или раздражения у других пользователей.',
    disclaimer: 'KC Skin Research Center, Сеул, 11 августа - 9 сентября 2025 года. Одно применение, 20 женщин, средний возраст 48 ± 8 лет; измерения через 1, 2 и 4 недели. Результаты индивидуальны.',
  },
  safety: {
    eyebrow: 'Перед применением',
    title: 'Когда средство не используют.',
    points: [
      'Гнойничковое акне или розацеа',
      'Открытые раны или повреждённая кожа',
      'Активная кожная инфекция',
      'Известная кожная аллергия или выраженная гиперчувствительность',
      'Аутоиммунное заболевание кожи, включая волчанку, псориаз или экзему',
      'Недавняя дерматологическая процедура, включая химический пилинг, лазер или микронидлинг',
      'Рак кожи или предраковое образование',
      'Недавний солнечный ожог или загар',
    ],
    note: 'Полностью исключите область глаз и губ. При покраснении, отёке или раздражении остановите применение и обратитесь к врачу. Упаковка не добавляет противопоказаний для беременности или грудного вскармливания и не задаёт сроки по ретиноидам.',
  },
  routine: {
    eyebrow: 'Последовательность с упаковки',
    title: 'Ампула, затем Intensive Hydro Soothing Cream.',
    intro: 'Именно эту пару называет упаковка. Дополнительные карточки не заменяют протокол специалиста.',
    thisProduct: RU.routine.thisProduct,
    viewProduct: RU.routine.viewProduct,
    chooseOptions: RU.routine.chooseOptions,
    fromPrice: RU.routine.fromPrice,
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Ответы без медицинских обещаний.',
    items: [
      { q: 'Что означает 60000?', a: '60 000 ppm всего комплекса BIO-MESO™ PDRN. Сам Sodium DNA (PDRN) содержится отдельно в концентрации 1 120 ppm.' },
      { q: '60000 - это количество спикул?', a: 'Нет. Формула подтверждает 5,72022% Hydrolyzed Sponge, но не публикует отдельный счёт спикул.' },
      { q: 'Это аппаратная или инъекционная процедура?', a: 'Нет. Это наружное спикульное косметическое средство, а не аппарат микронидлинга и не инъекция; его нельзя приравнивать к глубине иглы.' },
      { q: 'Можно ли применять дома?', a: 'Официальный материал называет продукт профессиональным и относит концентрации выше 1% к работе обученных специалистов. Мы не приписываем право применения конкретной лицензированной профессии без отдельного юридического источника.' },
      { q: 'Обязательно ли сочетать с Homecare 5000?', a: 'Учебный материал показывает оба продукта в одной линии, но текущая упаковка не устанавливает обязательную двухступенчатую систему или курс. Домашний уход определяет специалист.' },
      { q: 'Будет ли шелушение?', a: 'Учебный материал допускает шелушение на второй - третий день, но это не обязательный признак результата. При сильной боли, отёке или нарастающем раздражении применение прекращают.' },
    ],
  },
  details: {
    eyebrow: 'Характеристики',
    title: 'Документированные данные.',
    rows: [
      { label: 'Упаковка', value: '4 ампулы × 3 мл' },
      { label: 'Комплекс BIO-MESO™ PDRN', value: '60 000 ppm' },
      { label: 'Hydrolyzed Sponge', value: '5,72022% · пресноводная губка' },
      { label: 'Sodium DNA (PDRN)', value: '0,112% / 1 120 ppm · из молок лосося' },
      { label: 'Функциональные компоненты', value: 'Ниацинамид 2% · аденозин 0,04%' },
      { label: 'Пантенол', value: '1% / 10 000 ppm' },
      { label: 'Применение', value: 'Профессиональное, по протоколу обученного специалиста' },
      { label: 'Страна производства', value: 'Южная Корея' },
      { label: 'После вскрытия', value: '12 месяцев' },
    ],
    brochure: RU.details.brochure,
  },
}

const BY_LOCALE: Record<BioMesoExpertLocale, BioMesoCopy> = { en: EN, ar: AUDITED_AR, ru: AUDITED_RU }

export function getBioMesoExpertCopy(locale: string): BioMesoCopy {
  return BY_LOCALE[locale as BioMesoExpertLocale] ?? EN
}
