/**
 * Bespoke copy for ND Cell ANTI-WRINKLE CREAM (product 23), the neck and
 * décolleté cream.
 *
 * SOURCING - every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_23_ND_CELL_SOURCE_AUDIT.md:
 *   - DTS MG signed formula: squalane 5.000%, dimethicone 3.000%, tocopheryl
 *     acetate 1.000%, phenyl trimethicone 1.000%, jojoba 0.500%, panthenol
 *     0.300%, allantoin 0.200%, shea 0.100%, adenosine 0.040%, ascorbyl
 *     glucoside 0.025%, ceramide NP 0.020%, retinyl palmitate 0.0111%,
 *     peanut oil 0.0087%, copper tripeptide-1 0.005%, glycerin only 0.700%.
 *   - EU safety assessment ID 21 06 00677, valid since 20 May 2021, 58 pages:
 *     patch test "Non Irritant" (QACS Ltd); peanut oil under Annex III/306 with
 *     under 0.5 ppm peanut proteins; linalool 0.0235% named as a REQUIRED label
 *     declaration; the anti-wrinkle phrasing flagged as needing documentation.
 *   - COA lot L1109B: pH 6.32, specific gravity 0.981, 50.3 g, adenosine
 *     assayed 92.60%, four pathogens not detected.
 *   - Korean carton: [주름개선 기능성화장품], SINGLE function (wrinkle), main
 *     ingredient adenosine. No whitening licence.
 *
 * TWO DISCLOSURES DRIVE THIS PAGE:
 *   1. PEANUT OIL at 0.0087%, arriving as the carrier for the vitamin A. Product
 *      24 already declares peanut on our site; this one declared nothing. Fixed.
 *   2. LINALOOL at 0.0235%, which the safety assessment names as a required
 *      declaration and which the PRINTED CARTON OMITS. We declare it here
 *      because a customer reading the box would not find it.
 *
 * MUST STAY OUT:
 *   - Any depigmentation or brightening claim. Korea licenses this for wrinkle
 *     improvement only and there is no brightening active at dose.
 *   - The "efficacy test on improving wrinkles" our record used to claim. No such
 *     report exists, and the assessor specifically flagged the anti-wrinkle
 *     phrasing as needing documentation.
 *   - The carton's "Excellent Anti-Wrinkle Effect" superlative.
 *   - That sh-polypeptide-7 is a recombinant human somatotropin peptide. True per
 *     the assessment, but naming it invites a drug claim and at 10 ppb nothing
 *     rests on it. Give the number, say nothing more.
 *   - Mechanisms from the 10-30 ppb botanicals, the 10 ppm hyaluronate, or the
 *     four sub-ppm peptides.
 *   - The contract manufacturer, and the lot code.
 *
 * NOTE ON fullInciNote: the usual "as printed on the carton" line would be FALSE
 * here. The registered carton INCI is out of date - it lists five ingredients no
 * longer in the formula (including a sixth peptide) and omits tocopherol and
 * linalool. The note says so.
 */

import { ND_CELL_LOCALIZED_COPY } from './ndCellLocalizedCopy'

export type Locale = 'en' | 'ar' | 'ru'

export interface NdCellCopy {
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

  peanut: {
    eyebrow: string
    title: string
    body: string
    detail: string
  }

  working: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  occlusive: {
    eyebrow: string
    title: string
    intro: string
    columns: { row: string; glycerin: string; oils: string }
    rows: Array<{ label: string; glycerin: string; oils: string; highlight?: boolean }>
    body: string
  }

  peptides: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ name: string; value: string; note: string; highlight?: boolean }>
    body: string
  }

  vitamins: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ name: string; value: string; verdict: string; real?: boolean }>
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

const EN: NdCellCopy = {
  eyebrow: 'ND Cell Anti-Wrinkle Cream · Neck & Décolleté · 50 g',
  headline: 'Built for the skin people stop moisturising at the jawline.',
  subheadline:
    'Squalane at 5% over dimethicone at 3% and vitamin E at a full 1%, with adenosine at the dose Korea licenses for wrinkle improvement. Glycerin is only 0.7%, so this is an occlusive cream rather than a hydrating one - it seals thin neck and chest skin rather than watering it. Contains peanut oil and lavender oil; both are declared below.',
  heroBullets: [
    'Squalane 5% - the ingredient actually carrying this formula',
    'Vitamin E at 1% and B5 at 0.3%, both real working doses',
    'Adenosine 0.04%, measured at 92.60% - the licensed wrinkle dose',
    'Contains peanut oil and linalool - declared in full below',
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
    { value: '5%', label: 'Squalane' },
    { value: '1%', label: 'Vitamin E, a genuinely strong dose' },
    { value: '0.04%', label: 'Adenosine, assayed at 92.60%' },
    { value: '0.7%', label: 'Glycerin - this seals rather than hydrates' },
  ],

  peanut: {
    eyebrow: 'Read this first',
    title: 'This cream contains peanut oil',
    body:
      'Arachis hypogaea seed oil at 0.0087%. It is not there as a feature - it is the oil the vitamin A arrives in, and it stays in the finished formula. The refined oil is held below 0.5 parts per million of peanut protein under the European rule that governs it, which is why it can be used at all, and the safety assessment addresses it directly.',
    detail:
      'If you or the person you are buying for has a peanut allergy, do not use this product, and speak to your doctor before using anything with peanut-derived oil on a large area of skin. We are putting this at the top of the page rather than at the bottom of an ingredient list because the neck and chest is a large area, and because our EyeCell eye cream already declares its peanut oil while this page previously did not. That was our omission and this corrects it.',
  },

  working: {
    eyebrow: 'The working formula',
    title: 'What is actually at a dose',
    intro:
      'Neck and chest skin is thinner than facial skin, has fewer oil glands and creases along fixed lines. This formula answers that with lipids and occlusion rather than with actives, and the honest version of the ingredient list is short.',
    items: [
      {
        name: 'Squalane',
        dose: '5.000%',
        body: 'The single largest ingredient after water, and the one carrying this cream. A lipid the skin already recognises, stable, non-greasy, and the reason the texture suits a neck rather than a face.',
      },
      {
        name: 'Dimethicone and phenyl trimethicone',
        dose: '3.000% + 1.000%',
        body: 'The occlusive layer and the slip. Between them and the squalane, this is where the product does most of its work: reducing what evaporates off skin that has little of its own oil.',
      },
      {
        name: 'Tocopheryl acetate (vitamin E)',
        dose: '1.000%',
        body: 'A genuinely strong dose, not a token one. Antioxidant, and it earns its place in the vitamin claim, which not all four vitamins do.',
      },
      {
        name: 'Panthenol (vitamin B5)',
        dose: '0.300%',
        body: 'A real working dose for comfort and barrier support, alongside allantoin at 0.200%.',
      },
      {
        name: 'Adenosine',
        dose: '0.040%',
        body: 'The exact dose Korea licenses for wrinkle improvement, and the reason this can be sold as an anti-wrinkle cream at all. Measured on the batch at 92.60% of declaration - the only active on the certificate that gets assayed.',
      },
      {
        name: 'Ceramide NP and jojoba',
        dose: '0.020% + 0.500%',
        body: 'The ceramide is modest at 200 parts per million, but worth noting: that is about two thousand times the ceramide in our Multi Functional cream. Jojoba oil rounds out the lipid phase.',
      },
    ],
  },

  occlusive: {
    eyebrow: 'Which of the three you want',
    title: 'This one seals. The other two hydrate.',
    intro:
      'We now have three anti-wrinkle products with adenosine at the same 0.04%, and the thing that separates them is not the actives. It is the ratio of water-binding humectant to sealing oil, and the three sit at completely different points.',
    columns: { row: '', glycerin: 'Glycerin', oils: 'Oils and silicones' },
    rows: [
      { label: 'Anti-Wrinkle Serum', glycerin: '25.45%', oils: '~2.4%' },
      { label: 'Multi Functional Cream', glycerin: '8.00%', oils: '~13%' },
      { label: 'ND Cell, this cream', glycerin: '0.70%', oils: '~9.6% plus 5% squalane', highlight: true },
    ],
    body:
      'At 0.7% glycerin this is barely a humectant at all, and we would rather say so than let you expect the serum\u2019s plumping. It is designed to hold moisture in skin that struggles to keep its own, which is a fair description of most necks after forty. If you want water-binding on your neck too, the serum underneath it is the way to get both.',
  },

  peptides: {
    eyebrow: 'Proportion',
    title: 'Five peptides, and one of them carries 97% of the load',
    intro:
      'Our own description used to list all five as though they were equals. They are not close to equal, so here they are with their real concentrations.',
    rows: [
      { name: 'Copper Tripeptide-1', value: '50 ppm', note: 'The one with genuine literature behind it, and the only one present in a meaningful amount', highlight: true },
      { name: 'Palmitoyl Hexapeptide-12', value: '1 ppm', note: 'Present, not deliverable' },
      { name: 'Acetyl Hexapeptide-8', value: '0.25 ppm', note: 'Studied at 5-10% in the literature. This is a quarter of one part per million' },
      { name: 'Palmitoyl Tripeptide-1', value: '0.2 ppm', note: 'Present, not deliverable' },
      { name: 'sh-Polypeptide-7', value: '0.01 ppm', note: 'Ten parts per billion' },
    ],
    body:
      'About 51.5 parts per million of peptide in total, and copper tripeptide-1 is 97% of it. So one peptide is worth mentioning and four are on the list because they are in the formula. Buy this cream for the squalane, the vitamin E and the adenosine - all three are real, and one of them is measured on every batch.',
  },

  vitamins: {
    eyebrow: 'Proportion',
    title: 'The vitamin complex is two real and two token',
    intro:
      '"Vitamin A, B5, C and E" reads like four equal contributions. Two of them are at doses that do something and two are at doses that fill out a sentence, so we have marked which is which.',
    rows: [
      { name: 'Vitamin E - tocopheryl acetate', value: '1.000%', verdict: 'A strong, genuine dose', real: true },
      { name: 'Vitamin B5 - panthenol', value: '0.300%', verdict: 'A real working dose', real: true },
      { name: 'Vitamin C - ascorbyl glucoside', value: '0.025%', verdict: 'Around one eightieth of the concentration used in efficacy work' },
      { name: 'Vitamin A - retinyl palmitate', value: '0.0111%', verdict: 'Low, and the gentlest and weakest of the retinoid esters' },
    ],
    body:
      'The vitamin A figure has a story worth telling: an earlier version of this formula carried 0.02%, and the safety assessor capped body-area products at 0.025% and asked for a reduction. The current formula is at 0.0111%, comfortably under. That is the assessment process working as it should, and it is also why nobody should buy this expecting retinoid results.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea, released against a written specification, and assessed under European cosmetics law in a 58-page dossier valid since May 2021.',
    rows: [
      { label: 'pH', value: '6.32 at 25 °C, inside a 6.00 ± 1.00 specification' },
      { label: 'Fill', value: '50.3 g against a 50 g declaration' },
      { label: 'Specific gravity', value: '0.981 - lighter than water, from the oil and silicone load' },
      { label: 'Hardness', value: '35, inside a 30 ± 10 specification' },
      { label: 'Adenosine', value: 'Assayed at 92.60% of the declared 0.04%' },
      { label: 'Purity', value: 'Under 100 cfu/g total count' },
      { label: 'Pathogens', value: 'S. aureus, P. aeruginosa, E. coli and C. albicans - four screened, all not detected' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
    ],
    patch:
      'The patch test behind the "dermatologically tested" line came back graded Non Irritant rather than simply passing. The assessor notes the volunteer count is small, so read it as reassurance about the formula rather than proof about your skin - particularly given the peanut oil and the lavender.',
  },

  fragrance: {
    eyebrow: 'If you screen your ingredients',
    title: 'Lavender oil, and a note about the box',
    body:
      'Lavender oil at 0.0265%, with linalool at 0.0235%. There is no synthetic perfume in the formula, which is what the carton\u2019s "no artificial fragrance" line refers to - but it is scented, and free of synthetic fragrance is not the same as fragrance-free. One thing you should know: European law requires linalool to be declared above 0.001%, this is twenty-three times that, and the printed carton\u2019s ingredient list does not name it. The safety assessment does. We are declaring it here because anyone screening the box for it would not find it, and we have asked the manufacturer to correct the artwork. Our Blemish Balm Cream is the genuinely fragrance-free option in the range.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Neck and chest, morning and night',
    frequency: 'Twice daily · upward strokes · sunscreen over it by day',
    steps: [
      {
        title: 'Start lower than you think',
        body: 'Begin at the collarbones and work up. Most people treat the neck as an afterthought to the face and stop at the jawline, which is exactly why the décolleté ages on its own schedule.',
      },
      {
        title: 'Upward strokes, flat hands',
        body: 'Use the flats of your fingers rather than your fingertips, and sweep upward from collarbone to jaw. The manufacturer specifies massaging until absorbed, and this cream is rich enough that it takes a moment.',
      },
      {
        title: 'Take it across the chest',
        body: 'The V of skin exposed by most necklines gets as much sun as your face and almost none of the care. Extend the same amount out across it.',
      },
      {
        title: 'Sunscreen over it in the morning',
        body: 'The single highest-value thing you can do for a décolleté. This cream contains vitamin A and no UV filter of its own, so daytime use wants sunscreen over the top.',
      },
    ],
    note:
      'Do not use it near the eyes - the carton says so explicitly, and our EyeCell cream is the product formulated for that skin. It layers happily under or over anything without acids or retinoids, and if you want water-binding as well, put the Anti-Wrinkle Serum underneath.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the bottle',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote:
      'Transcribed from the current signed manufacturing formula. If you compare it with an older carton you will find differences: the printed list still carries a few ingredients that have since been removed and omits tocopherol and linalool. The list here is the one that matches what is in the bottle.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Contains peanut oil (Arachis Hypogaea). Do not use if you have a peanut allergy, and ask your doctor first if you are unsure.',
      'Contains lavender oil with linalool at 0.0235%. Patch test if you react to fragrance.',
      'For external use only. Do not use near the eyes. Avoid the eyes and mucous membranes, and rinse thoroughly with cool water on contact.',
      'Contains retinyl palmitate. If you are pregnant or breastfeeding, ask your doctor before using any vitamin A product.',
      'Stop and see a doctor if redness, swelling, itching or irritation appears.',
      'Assessed as safe under EC Regulation 1223/2009 and graded Non Irritant on patch test.',
      'Store cool and dry, out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS box, plus the peanut and fragrance disclosures from the quantitative formula and the safety assessment.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '50 g, pump bottle' },
      { label: 'For', value: 'Neck and décolleté' },
      { label: 'Texture', value: 'White cream, rich and sealing' },
      { label: 'Actives at dose', value: 'Squalane 5.00%, dimethicone 3.00%, vitamin E 1.00%, panthenol 0.300%, allantoin 0.200%, adenosine 0.040%' },
      { label: 'Glycerin', value: '0.700% - occlusive rather than hydrating' },
      { label: 'Peptides', value: 'Five, totalling ~51.5 ppm; copper tripeptide-1 is 97% of that' },
      { label: 'Allergens', value: 'Contains peanut oil 0.0087% and linalool 0.0235%' },
      { label: 'Fragranced', value: 'Yes - lavender oil 0.0265%. No synthetic perfume' },
      { label: 'pH', value: '6.00 ± 1.00 (6.32 on the batch tested)' },
      { label: 'Licence', value: 'Korean single-function: wrinkle improvement, via adenosine' },
      { label: 'Assessment', value: 'EU safety assessment; patch test graded Non Irritant' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Does this really contain peanut oil?',
        a: 'Yes, at 0.0087%, and it is there because it is the carrier the vitamin A arrives in rather than because anyone chose it. The refined oil is held under 0.5 parts per million of peanut protein, which is the European limit that allows it to be used. If you have a peanut allergy, do not use it. We have put this at the top of the page because the neck and chest is a large area of skin and because it was previously missing from this page entirely.',
      },
      {
        q: 'Will it brighten pigmentation on my chest?',
        a: 'We are not going to claim that. Our own description used to say it had an excellent depigmentation effect and we have removed it: Korea licenses this product for wrinkle improvement only, and there is no brightening active in it at a working dose - the vitamin C is at 0.025%, roughly an eightieth of what efficacy studies use. For sun damage on the décolleté the honest answer is daily sunscreen, and a product built for pigment.',
      },
      {
        q: 'How is this different from a normal face cream?',
        a: 'The ratio. It is 0.7% glycerin against roughly 15% oils, silicones and squalane, where our Multi Functional cream is 8% glycerin and the serum is 25%. Neck and chest skin is thinner and has fewer oil glands, so this is built to seal rather than to water. That also means it will feel too rich for some faces.',
      },
      {
        q: 'Five peptides sounds impressive. Is it?',
        a: 'One of them is. Copper tripeptide-1 is at 50 parts per million and has real literature behind it. The other four run from 1 part per million down to 10 parts per billion, and acetyl hexapeptide-8 in particular is studied at 5 to 10% while sitting here at a quarter of one part per million. Together all five come to about 51.5 ppm and copper tripeptide is 97% of that. The squalane, the vitamin E and the adenosine are the reasons to buy it.',
      },
      {
        q: 'There is vitamin A in it. Is that a retinoid treatment?',
        a: 'No. Retinyl palmitate at 0.0111% is the gentlest and weakest ester in the retinoid family, at a low concentration. There is a reason for the number: an earlier formula had 0.02%, and the safety assessor capped body products at 0.025% and asked for a reduction, so it came down. If you are pregnant or breastfeeding, ask your doctor before using any vitamin A product regardless of how small the dose is.',
      },
      {
        q: 'Can I use it around my eyes?',
        a: 'No - the carton says not to, explicitly. The skin there is thinner again and this is a rich, sealing cream with vitamin A and lavender oil in it. Our EyeCell Eye Contour Cream is the product formulated for that area.',
      },
    ],
  },

  backToProducts: 'Products',
}

const _AR: NdCellCopy = {
  eyebrow: 'كريم إن دي سيل المضادّ للتجاعيد · الرقبة والصدر · 50 غ',
  headline: 'مصمّم للبشرة التي يتوقّف الناس عن ترطيبها عند خط الفكّ.',
  subheadline:
    'سكوالان بنسبة 5% فوق دايميثيكون بنسبة 3% وفيتامين E بنسبة 1% كاملة، مع أدينوزين بالجرعة التي ترخّصها كوريا لتحسين التجاعيد. أما الغليسرين فبنسبة 0.7% فقط، فهذا كريم عازل لا مرطّب - يُحكم إغلاق بشرة الرقبة والصدر الرقيقة لا يسقيها. يحتوي زيت الفول السوداني وزيت اللافندر؛ وكلاهما مُفصح عنه أدناه.',
  heroBullets: [
    'سكوالان 5% - المكوّن الذي يحمل هذه التركيبة فعلاً',
    'فيتامين E بنسبة 1% وB5 بنسبة 0.3%، وكلتاهما جرعتان عاملتان حقيقيتان',
    'أدينوزين 0.04%، مقيس عند 92.60% - جرعة التجاعيد المرخّصة',
    'يحتوي زيت الفول السوداني واللينالول - مُفصح عنهما كاملاً أدناه',
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
    { value: '5%', label: 'سكوالان' },
    { value: '1%', label: 'فيتامين E، جرعة قوية فعلاً' },
    { value: '0.04%', label: 'أدينوزين، مقيس عند 92.60%' },
    { value: '0.7%', label: 'غليسرين - هذا يُحكم الإغلاق لا يرطّب' },
  ],

  peanut: {
    eyebrow: 'اقرئي هذا أولاً',
    title: 'هذا الكريم يحتوي زيت الفول السوداني',
    body:
      'زيت بذور الفول السوداني بنسبة 0.0087%. وهو ليس موجوداً كميزة - بل هو الزيت الذي يأتي فيه فيتامين A، ويبقى في التركيبة النهائية. ويُحفظ الزيت المكرّر تحت 0.5 جزء من المليون من بروتين الفول السوداني بموجب القاعدة الأوروبية التي تحكمه، ولهذا يمكن استخدامه أصلاً، ويتناوله تقييم السلامة مباشرة.',
    detail:
      'إن كان لديك أو لدى من تشترين له حساسية من الفول السوداني، فلا تستخدمي هذا المنتج، واستشيري طبيبك قبل استخدام أي شيء يحتوي زيتاً مشتقاً من الفول السوداني على منطقة واسعة من الجلد. ونضع هذا في أعلى الصفحة لا في أسفل قائمة مكوّنات، لأن الرقبة والصدر منطقة واسعة، ولأن كريم العيون EyeCell لدينا يُفصح عن زيت الفول السوداني فيه بينما لم تكن هذه الصفحة تفعل. كان ذلك تقصيراً منّا وهذا يصحّحه.',
  },

  working: {
    eyebrow: 'التركيبة العاملة',
    title: 'ما هو فعلاً بجرعة',
    intro:
      'بشرة الرقبة والصدر أرقّ من بشرة الوجه، وغددها الزيتية أقل، وتتجعّد على خطوط ثابتة. وتجيب هذه التركيبة على ذلك بالدهون والعزل لا بالفعّالات، والنسخة الصريحة من قائمة المكوّنات قصيرة.',
    items: [
      {
        name: 'Squalane',
        dose: '5.000%',
        body: 'أكبر مكوّن منفرد بعد الماء، وهو الذي يحمل هذا الكريم. دهن تعرفه البشرة أصلاً، وثابت، وغير دهني الملمس، وهو سبب ملاءمة الملمس لرقبة لا لوجه.',
      },
      {
        name: 'Dimethicone و Phenyl Trimethicone',
        dose: '3.000% + 1.000%',
        body: 'طبقة العزل والانزلاق. وبينهما وبين السكوالان يقع معظم عمل المنتج: تقليل ما يتبخّر من بشرة قليلة الزيت الذاتي.',
      },
      {
        name: 'Tocopheryl Acetate (فيتامين E)',
        dose: '1.000%',
        body: 'جرعة قوية فعلاً لا رمزية. مضادّ أكسدة، وتستحقّ موضعها في ادّعاء الفيتامينات، وهو ما لا تستحقّه الفيتامينات الأربعة كلها.',
      },
      {
        name: 'Panthenol (فيتامين B5)',
        dose: '0.300%',
        body: 'جرعة عاملة حقيقية للراحة ودعم الحاجز، إلى جانب الألانتوين بنسبة 0.200%.',
      },
      {
        name: 'Adenosine',
        dose: '0.040%',
        body: 'الجرعة التي ترخّصها كوريا لتحسين التجاعيد تحديداً، وسبب إمكان بيع هذا ككريم مضادّ للتجاعيد أصلاً. مقيس على الدفعة عند 92.60% من المعلن - وهو الفعّال الوحيد على الشهادة الذي يُقاس.',
      },
      {
        name: 'Ceramide NP و Jojoba',
        dose: '0.020% + 0.500%',
        body: 'السيراميد متواضع عند 200 جزء من المليون، لكنه يستحق الذكر: فهذا نحو ألفَي ضعف السيراميد في كريمنا متعدد الوظائف. وزيت الجوجوبا يكمل الطور الدهني.',
      },
    ],
  },

  occlusive: {
    eyebrow: 'أيّها تريدين من الثلاثة',
    title: 'هذا يُحكم الإغلاق. والآخران يرطّبان.',
    intro:
      'لدينا الآن ثلاثة منتجات مضادّة للتجاعيد بالأدينوزين نفسه بنسبة 0.04%، وما يفرّق بينها ليس الفعّالات. بل نسبة المرطّب الجاذب للماء إلى الزيت العازل، والثلاثة تقع عند نقاط مختلفة تماماً.',
    columns: { row: '', glycerin: 'الغليسرين', oils: 'الزيوت والسيليكونات' },
    rows: [
      { label: 'سيروم مكافحة التجاعيد', glycerin: '25.45%', oils: '~2.4%' },
      { label: 'الكريم متعدد الوظائف', glycerin: '8.00%', oils: '~13%' },
      { label: 'إن دي سيل، هذا الكريم', glycerin: '0.70%', oils: '~9.6% زائد 5% سكوالان', highlight: true },
    ],
    body:
      'عند 0.7% غليسرين لا يكاد هذا يكون مرطّباً جاذباً، ونفضّل قول ذلك على أن نتركك تتوقّعين امتلاء السيروم. فهو مصمّم لحفظ الرطوبة في بشرة تكافح للاحتفاظ برطوبتها، وهذا وصف منصف لمعظم الرقاب بعد الأربعين. وإن أردتِ ربط الماء على رقبتك أيضاً، فالسيروم تحته هو السبيل للحصول على الاثنين.',
  },

  peptides: {
    eyebrow: 'التناسب',
    title: 'خمسة ببتيدات، وواحد منها يحمل 97% من الحمل',
    intro:
      'كان وصفنا نفسه يسرد الخمسة كأنها متساوية. وهي ليست قريبة من التساوي، فها هي بتراكيزها الحقيقية.',
    rows: [
      { name: 'Copper Tripeptide-1', value: '50 ppm', note: 'الوحيد الذي له أدبيات حقيقية خلفه، والوحيد الموجود بكمّية ذات معنى', highlight: true },
      { name: 'Palmitoyl Hexapeptide-12', value: '1 ppm', note: 'موجود، غير قابل للإيصال' },
      { name: 'Acetyl Hexapeptide-8', value: '0.25 ppm', note: 'يُدرَس عند 5-10% في الأدبيات. وهذا ربع جزء من المليون' },
      { name: 'Palmitoyl Tripeptide-1', value: '0.2 ppm', note: 'موجود، غير قابل للإيصال' },
      { name: 'sh-Polypeptide-7', value: '0.01 ppm', note: 'عشرة أجزاء من المليار' },
    ],
    body:
      'نحو 51.5 جزءاً من المليون من الببتيد إجمالاً، والكوبر ترايببتايد-1 يمثّل 97% منه. فببتيد واحد يستحق الذكر وأربعة على القائمة لأنها في التركيبة. اشتري هذا الكريم من أجل السكوالان وفيتامين E والأدينوزين - فالثلاثة حقيقية، وواحد منها يُقاس على كل دفعة.',
  },

  vitamins: {
    eyebrow: 'التناسب',
    title: 'مركّب الفيتامينات اثنان حقيقيان واثنان رمزيان',
    intro:
      '«فيتامين A وB5 وC وE» يُقرأ كأربع مساهمات متساوية. اثنان منها بجرعات تفعل شيئاً واثنان بجرعات تكمل جملة، فأشّرنا أيّها أيّ.',
    rows: [
      { name: 'فيتامين E - Tocopheryl Acetate', value: '1.000%', verdict: 'جرعة قوية حقيقية', real: true },
      { name: 'فيتامين B5 - Panthenol', value: '0.300%', verdict: 'جرعة عاملة حقيقية', real: true },
      { name: 'فيتامين C - Ascorbyl Glucoside', value: '0.025%', verdict: 'نحو واحد على ثمانين من التركيز المستخدم في أعمال الفاعلية' },
      { name: 'فيتامين A - Retinyl Palmitate', value: '0.0111%', verdict: 'منخفض، وهو ألطف إسترات الريتينويد وأضعفها' },
    ],
    body:
      'ولرقم فيتامين A حكاية تستحق السرد: فنسخة أقدم من هذه التركيبة حملت 0.02%، وقد حدّد مقيّم السلامة سقف منتجات الجسم عند 0.025% وطلب تخفيضاً. والتركيبة الحالية عند 0.0111%، أي تحته بارتياح. وهذا هو عمل التقييم كما ينبغي، وهو أيضاً سبب ألّا يشتري أحد هذا متوقّعاً نتائج ريتينويد.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما تقوله الشهادة',
    intro:
      'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة، وقُيّم وفق قانون مستحضرات التجميل الأوروبي في ملف من 58 صفحة سارٍ منذ مايو 2021.',
    rows: [
      { label: 'الحموضة', value: '6.32 عند 25 درجة، ضمن مواصفة 6.00 ± 1.00' },
      { label: 'التعبئة', value: '50.3 غ مقابل 50 غ معلنة' },
      { label: 'الكثافة النوعية', value: '0.981 - أخفّ من الماء، بسبب حمل الزيوت والسيليكون' },
      { label: 'الصلادة', value: '35، ضمن مواصفة 30 ± 10' },
      { label: 'الأدينوزين', value: 'مقيس عند 92.60% من الـ 0.04% المعلنة' },
      { label: 'النقاء', value: 'أقل من 100 وحدة/غ للعدّ الكلي' },
      { label: 'الممرضات', value: 'المكوّرة العنقودية والزائفة والإشريكية القولونية والمبيضّات - أربعة مفحوصة وكلها غير مكتشفة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات مغلقاً، وتاريخ الانتهاء على العلبة' },
    ],
    patch:
      'اختبار اللصقة الذي يقف خلف عبارة «مختبر جلدياً» عاد مصنّفاً «غير مهيّج» لا مجرّد ناجح. ويلاحظ المقيّم أن عدد المتطوّعين صغير، فاقرئيها كطمأنة بشأن التركيبة لا كبرهان بشأن بشرتك - خصوصاً مع وجود زيت الفول السوداني واللافندر.',
  },

  fragrance: {
    eyebrow: 'إن كنتِ تفحصين المكوّنات',
    title: 'زيت اللافندر، وملاحظة عن العلبة',
    body:
      'زيت اللافندر بنسبة 0.0265%، مع لينالول بنسبة 0.0235%. ولا عطر صناعي في التركيبة، وهذا ما تشير إليه عبارة «بلا عطر صناعي» على العلبة - لكنه معطّر، والخلوّ من العطر الصناعي ليس كالخلوّ من العطر. وأمر ينبغي أن تعرفيه: يوجب القانون الأوروبي الإفصاح عن اللينالول فوق 0.001%، وهذا ثلاثة وعشرون ضعف ذلك، وقائمة مكوّنات العلبة المطبوعة لا تسمّيه. أما تقييم السلامة فيسمّيه. ونحن نُفصح عنه هنا لأن من يفحص العلبة بحثاً عنه لن يجده، وقد طلبنا من الشركة تصحيح التصميم. وكريم البلسم للعيوب لدينا هو الخيار الخالي من العطر فعلاً في المجموعة.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'الرقبة والصدر، صباحاً ومساءً',
    frequency: 'مرتين يومياً · حركات لأعلى · واقي شمس فوقه نهاراً',
    steps: [
      {
        title: 'ابدئي أخفض مما تظنّين',
        body: 'ابدئي من الترقوتين واصعدي. فمعظم الناس يعاملون الرقبة كملحق للوجه ويتوقّفون عند خط الفكّ، وهذا بالضبط سبب تقدّم الصدر في العمر على جدوله الخاص.',
      },
      {
        title: 'حركات لأعلى بكفّين مسطّحتين',
        body: 'استخدمي بطون أصابعك لا أطرافها، وامسحي لأعلى من الترقوة إلى الفكّ. تحدّد الشركة التدليك حتى الامتصاص، وهذا الكريم غنيّ بما يجعله يستغرق لحظة.',
      },
      {
        title: 'خذيه عبر الصدر',
        body: 'مثلّث الجلد الذي تكشفه معظم الياقات ينال شمساً كوجهك ورعاية تكاد لا تُذكر. مدّي القدر نفسه عبره.',
      },
      {
        title: 'واقي الشمس فوقه صباحاً',
        body: 'أعلى ما يمكنك فعله قيمةً لصدرك. فهذا الكريم يحتوي فيتامين A ولا مرشّح أشعة خاصاً به، فالاستخدام النهاري يريد واقي شمس فوقه.',
      },
    ],
    note:
      'لا تستخدميه قرب العينين - تقول العلبة ذلك صراحةً، وكريم EyeCell لدينا هو المنتج المصمّم لتلك البشرة. ويتراكب بسلاسة تحت أي شيء أو فوقه بلا أحماض أو ريتينويدات، وإن أردتِ ربط الماء أيضاً فضعي سيروم مكافحة التجاعيد تحته.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في العبوة',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote:
      'منقولة من تركيبة التصنيع الموقّعة الحالية. وإن قارنتِها بعلبة أقدم فستجدين فوارق: فالقائمة المطبوعة لا تزال تحمل مكوّنات أُزيلت لاحقاً وتُسقط التوكوفيرول واللينالول. والقائمة هنا هي المطابقة لما في العبوة.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'يحتوي زيت الفول السوداني (Arachis Hypogaea). لا يُستخدم إن كانت لديك حساسية من الفول السوداني، واستشيري طبيبك أولاً إن لم تكوني متأكّدة.',
      'يحتوي زيت اللافندر مع لينالول بنسبة 0.0235%. اختبريه على بقعة إن كنتِ تتفاعلين مع العطر.',
      'للاستعمال الخارجي فقط. لا يُستخدم قرب العينين. تجنّبي العينين والأغشية المخاطية، واشطفي جيداً بالماء البارد عند الملامسة.',
      'يحتوي ريتينيل بالميتات. إن كنتِ حاملاً أو مرضعة فاستشيري طبيبك قبل استخدام أي منتج يحتوي فيتامين A.',
      'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو حكّة أو تهيّج.',
      'قُيّم آمناً وفق اللائحة EC 1223/2009 وصُنّف «غير مهيّج» في اختبار اللصقة.',
      'يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، مع إفصاحَي الفول السوداني والعطر من التركيبة الكمّية وتقييم السلامة.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '50 غ، عبوة بمضخّة' },
      { label: 'لأجل', value: 'الرقبة والصدر' },
      { label: 'الملمس', value: 'كريم أبيض، غنيّ وعازل' },
      { label: 'الفعّالات بجرعة', value: 'سكوالان 5.00%، دايميثيكون 3.00%، فيتامين E 1.00%، بانثينول 0.300%، ألانتوين 0.200%، أدينوزين 0.040%' },
      { label: 'الغليسرين', value: '0.700% - عازل لا مرطّب' },
      { label: 'الببتيدات', value: 'خمسة، بإجمالي ~51.5 جزءاً من المليون؛ والكوبر ترايببتايد-1 يمثّل 97% منها' },
      { label: 'مسبّبات الحساسية', value: 'يحتوي زيت الفول السوداني 0.0087% ولينالول 0.0235%' },
      { label: 'معطّر', value: 'نعم - زيت لافندر 0.0265%. ولا عطر صناعي' },
      { label: 'الحموضة', value: '6.00 ± 1.00 (6.32 على الدفعة المختبرة)' },
      { label: 'الترخيص', value: 'مفرد الوظيفة الكوري: تحسين التجاعيد، عبر الأدينوزين' },
      { label: 'التقييم', value: 'تقييم سلامة أوروبي؛ اختبار لصقة مصنّف غير مهيّج' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل يحتوي فعلاً زيت الفول السوداني؟',
        a: 'نعم، بنسبة 0.0087%، وهو موجود لأنه الحامل الذي يأتي فيه فيتامين A لا لأن أحداً اختاره. ويُحفظ الزيت المكرّر تحت 0.5 جزء من المليون من بروتين الفول السوداني، وهو الحدّ الأوروبي الذي يسمح باستخدامه. وإن كانت لديك حساسية من الفول السوداني فلا تستخدميه. وقد وضعنا هذا في أعلى الصفحة لأن الرقبة والصدر منطقة واسعة من الجلد ولأنه كان غائباً عن هذه الصفحة تماماً قبل ذلك.',
      },
      {
        q: 'هل سيفتّح التصبّغ على صدري؟',
        a: 'لن نزعم ذلك. كان وصفنا نفسه يقول إن له أثراً ممتازاً في إزالة التصبّغ وقد حذفناه: فكوريا ترخّص هذا المنتج لتحسين التجاعيد فقط، ولا فعّال مفتّح فيه بجرعة عاملة - ففيتامين C عند 0.025%، أي نحو ثُمن العشر مما تستخدمه دراسات الفاعلية. وللتلف الشمسي على الصدر، الجواب الصريح هو واقي شمس يومي ومنتج مبني للتصبّغ.',
      },
      {
        q: 'كيف يختلف عن كريم وجه عادي؟',
        a: 'النسبة. فهو 0.7% غليسرين مقابل نحو 15% زيوت وسيليكونات وسكوالان، حيث كريمنا متعدد الوظائف 8% غليسرين والسيروم 25%. وبشرة الرقبة والصدر أرقّ وغددها الزيتية أقل، فهذا مبني ليُحكم الإغلاق لا ليسقي. وهذا يعني أيضاً أنه سيبدو غنياً أكثر مما يلزم لبعض الوجوه.',
      },
      {
        q: 'خمسة ببتيدات تبدو مبهرة. أهي كذلك؟',
        a: 'واحد منها كذلك. الكوبر ترايببتايد-1 عند 50 جزءاً من المليون وله أدبيات حقيقية خلفه. أما الأربعة الأخرى فتتراوح من جزء واحد من المليون إلى عشرة أجزاء من المليار، والأسيتيل هكساببتايد-8 خصوصاً يُدرَس عند 5 إلى 10% بينما يجلس هنا عند ربع جزء من المليون. ومجتمعةً تبلغ الخمسة نحو 51.5 جزءاً من المليون والكوبر ترايببتايد 97% منها. فالسكوالان وفيتامين E والأدينوزين هي أسباب الشراء.',
      },
      {
        q: 'فيه فيتامين A. هل هذا علاج بالريتينويد؟',
        a: 'لا. فالريتينيل بالميتات عند 0.0111% هو ألطف إسترات عائلة الريتينويد وأضعفها، وبتركيز منخفض. ولهذا الرقم سبب: فتركيبة أقدم كانت عند 0.02%، وقد حدّد مقيّم السلامة سقف منتجات الجسم عند 0.025% وطلب تخفيضاً، فانخفض. وإن كنتِ حاملاً أو مرضعة فاستشيري طبيبك قبل استخدام أي منتج يحتوي فيتامين A مهما صغرت الجرعة.',
      },
      {
        q: 'هل أستخدمه حول عينيّ؟',
        a: 'لا - تقول العلبة صراحةً ألّا تفعلي. فالبشرة هناك أرقّ مرة أخرى وهذا كريم غنيّ عازل فيه فيتامين A وزيت لافندر. وكريم EyeCell لمحيط العين لدينا هو المنتج المصمّم لتلك المنطقة.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const _RU: NdCellCopy = {
  eyebrow: 'ND Cell крем против морщин · Шея и декольте · 50 г',
  headline: 'Для кожи, которую перестают увлажнять на линии челюсти.',
  subheadline:
    'Сквалан 5% поверх диметикона 3% и витамина E в полный 1%, с аденозином в дозе, под которую Корея лицензирует уменьшение морщин. Глицерина всего 0,7%, так что это окклюзивный крем, а не увлажняющий: он запечатывает тонкую кожу шеи и груди, а не поит её. Содержит арахисовое и лавандовое масло - оба раскрыты ниже.',
  heroBullets: [
    'Сквалан 5% - ингредиент, который реально несёт эту формулу',
    'Витамин E 1% и B5 0,3%, обе - реальные рабочие дозы',
    'Аденозин 0,04%, измерено 92,60% - лицензионная доза для морщин',
    'Содержит арахисовое масло и линалоол - полностью раскрыто ниже',
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
    { value: '5%', label: 'Сквалана' },
    { value: '1%', label: 'Витамина E - действительно сильная доза' },
    { value: '0,04%', label: 'Аденозина, измерено 92,60%' },
    { value: '0,7%', label: 'Глицерина - он запечатывает, а не увлажняет' },
  ],

  peanut: {
    eyebrow: 'Сначала прочтите это',
    title: 'Этот крем содержит арахисовое масло',
    body:
      'Масло семян арахиса, 0,0087%. Оно здесь не как достоинство - это масло, в котором приходит витамин A, и оно остаётся в готовой формуле. Рафинированное масло держат ниже 0,5 части на миллион арахисового белка по европейскому правилу, которое им управляет, - именно поэтому его вообще можно использовать, и оценка безопасности разбирает это прямо.',
    detail:
      'Если у вас или у того, кому вы покупаете, аллергия на арахис - не используйте этот продукт и поговорите с врачом прежде, чем наносить что-либо с маслом из арахиса на большую площадь кожи. Мы ставим это в начало страницы, а не в конец состава, потому что шея и грудь - большая площадь и потому что наш крем для глаз EyeCell уже раскрывает своё арахисовое масло, а эта страница не раскрывала ничего. Это было нашим упущением, и здесь оно исправлено.',
  },

  working: {
    eyebrow: 'Работающая формула',
    title: 'Что действительно в дозе',
    intro:
      'Кожа шеи и груди тоньше кожи лица, в ней меньше сальных желёз, и заминается она по фиксированным линиям. Эта формула отвечает на это липидами и окклюзией, а не активами, и честная версия состава коротка.',
    items: [
      {
        name: 'Squalane',
        dose: '5.000%',
        body: 'Крупнейший ингредиент после воды и тот, что несёт этот крем. Липид, который кожа уже узнаёт: стабильный, без жирности, и именно поэтому текстура подходит шее, а не лицу.',
      },
      {
        name: 'Dimethicone и Phenyl Trimethicone',
        dose: '3.000% + 1.000%',
        body: 'Окклюзивный слой и скольжение. Вместе со скваланом здесь и происходит основная работа продукта: сокращается то, что испаряется с кожи, у которой мало своего жира.',
      },
      {
        name: 'Tocopheryl Acetate (витамин E)',
        dose: '1.000%',
        body: 'Действительно сильная доза, а не символическая. Антиоксидант, и он заслуживает своего места в витаминном заявлении - чего нельзя сказать обо всех четырёх витаминах.',
      },
      {
        name: 'Panthenol (витамин B5)',
        dose: '0.300%',
        body: 'Реальная рабочая доза для комфорта и поддержки барьера, рядом с аллантоином 0,200%.',
      },
      {
        name: 'Adenosine',
        dose: '0.040%',
        body: 'Ровно та доза, которую Корея лицензирует для уменьшения морщин, и причина, по которой это вообще можно продавать как крем против морщин. Измерено в партии: 92,60% от заявленного - единственный актив в сертификате, который измеряют.',
      },
      {
        name: 'Ceramide NP и Jojoba',
        dose: '0.020% + 0.500%',
        body: 'Церамида скромно - 200 частей на миллион, но это стоит отметить: примерно в две тысячи раз больше, чем церамида в нашем Multi Functional креме. Масло жожоба дополняет липидную фазу.',
      },
    ],
  },

  occlusive: {
    eyebrow: 'Какой из трёх вам нужен',
    title: 'Этот запечатывает. Два других увлажняют.',
    intro:
      'Теперь у нас три средства против морщин с одинаковым аденозином 0,04%, и различает их не активы. А соотношение связывающего воду увлажнителя к запечатывающему маслу - и все три стоят в совершенно разных точках.',
    columns: { row: '', glycerin: 'Глицерин', oils: 'Масла и силиконы' },
    rows: [
      { label: 'Сыворотка против морщин', glycerin: '25,45%', oils: '~2,4%' },
      { label: 'Multi Functional крем', glycerin: '8,00%', oils: '~13%' },
      { label: 'ND Cell, этот крем', glycerin: '0,70%', oils: '~9,6% плюс 5% сквалана', highlight: true },
    ],
    body:
      'При 0,7% глицерина это едва ли увлажнитель вовсе, и мы предпочтём сказать это, чем позволить вам ждать наполненности от сыворотки. Он создан удерживать влагу в коже, которой трудно сохранить свою, - а это справедливое описание большинства шей после сорока. Если хотите связывать воду и на шее, сыворотка под ним даст и то, и другое.',
  },

  peptides: {
    eyebrow: 'Пропорция',
    title: 'Пять пептидов, и один несёт 97% всей загрузки',
    intro:
      'Наше собственное описание перечисляло все пять как равные. Они и близко не равны, так что вот они с реальными концентрациями.',
    rows: [
      { name: 'Copper Tripeptide-1', value: '50 ppm', note: 'Единственный с реальной литературой за спиной и единственный в осмысленном количестве', highlight: true },
      { name: 'Palmitoyl Hexapeptide-12', value: '1 ppm', note: 'Присутствует, но не доставляется' },
      { name: 'Acetyl Hexapeptide-8', value: '0,25 ppm', note: 'В литературе изучается при 5-10%. Здесь - четверть части на миллион' },
      { name: 'Palmitoyl Tripeptide-1', value: '0,2 ppm', note: 'Присутствует, но не доставляется' },
      { name: 'sh-Polypeptide-7', value: '0,01 ppm', note: 'Десять частей на миллиард' },
    ],
    body:
      'Итого около 51,5 части на миллион пептидов, и copper tripeptide-1 - это 97% от них. То есть один пептид стоит упоминания, а четыре в списке потому, что они в формуле. Покупайте этот крем за сквалан, витамин E и аденозин: все три реальны, а один из них измеряют в каждой партии.',
  },

  vitamins: {
    eyebrow: 'Пропорция',
    title: 'Витаминный комплекс: два реальных и два символических',
    intro:
      '«Витамины A, B5, C и E» читаются как четыре равных вклада. Два из них в дозах, которые что-то делают, и два - в дозах, которые дополняют фразу, так что мы отметили, что есть что.',
    rows: [
      { name: 'Витамин E - tocopheryl acetate', value: '1.000%', verdict: 'Сильная, настоящая доза', real: true },
      { name: 'Витамин B5 - panthenol', value: '0.300%', verdict: 'Реальная рабочая доза', real: true },
      { name: 'Витамин C - ascorbyl glucoside', value: '0.025%', verdict: 'Примерно одна восьмидесятая от концентрации в работах по эффективности' },
      { name: 'Витамин A - retinyl palmitate', value: '0.0111%', verdict: 'Мало, и это самый мягкий и слабый из ретиноидных эфиров' },
    ],
    body:
      'У цифры витамина A есть история, которую стоит рассказать: более ранняя версия формулы несла 0,02%, а оценщик безопасности ограничил средства для тела 0,025% и попросил снизить. Текущая формула - 0,0111%, спокойно ниже. Это процесс оценки, работающий как должно, и это же причина, по которой никому не стоит покупать это, ожидая результатов ретиноида.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что говорит сертификат',
    intro:
      'Сделано в Корее, выпущено против письменной спецификации и оценено по европейскому косметическому закону в досье на 58 страниц, действующем с мая 2021 года.',
    rows: [
      { label: 'pH', value: '6,32 при 25 °C, в пределах спецификации 6,00 ± 1,00' },
      { label: 'Наполнение', value: '50,3 г при заявленных 50 г' },
      { label: 'Удельный вес', value: '0,981 - легче воды, из-за загрузки маслами и силиконами' },
      { label: 'Твёрдость', value: '35, в пределах спецификации 30 ± 10' },
      { label: 'Аденозин', value: 'Измерено 92,60% от заявленных 0,04%' },
      { label: 'Чистота', value: 'Менее 100 КОЕ/г по общему счёту' },
      { label: 'Патогены', value: 'S. aureus, P. aeruginosa, E. coli и C. albicans - четыре проверены, все не обнаружены' },
      { label: 'Срок годности', value: 'Три года закрытым, дата на коробке' },
    ],
    patch:
      'Патч-тест, стоящий за строкой «дерматологически протестировано», вернулся с оценкой «не раздражает», а не просто «пройден». Оценщик отмечает, что число добровольцев невелико, так что читайте это как уверенность в формуле, а не как доказательство про вашу кожу - тем более при наличии арахисового масла и лаванды.',
  },

  fragrance: {
    eyebrow: 'Если вы читаете составы',
    title: 'Лавандовое масло и замечание о коробке',
    body:
      'Лавандовое масло 0,0265%, с линалоолом 0,0235%. Синтетической отдушки в формуле нет - именно об этом строка «без искусственного ароматизатора» на коробке, - но он ароматизирован, а отсутствие синтетической отдушки не то же самое, что отсутствие аромата. Что вам стоит знать: европейский закон требует заявлять линалоол выше 0,001%, здесь его в двадцать три раза больше, и печатный состав на коробке его не называет. Оценка безопасности называет. Мы раскрываем его здесь, потому что тот, кто ищет его на коробке, не найдёт, и мы попросили производителя исправить макет. Наш Blemish Balm Cream - действительно вариант без отдушки в линейке.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Шея и грудь, утром и вечером',
    frequency: 'Дважды в день · движения вверх · днём сверху санскрин',
    steps: [
      {
        title: 'Начинайте ниже, чем кажется',
        body: 'Начните от ключиц и идите вверх. Большинство относится к шее как к дополнению к лицу и останавливается на линии челюсти - именно поэтому декольте старится по собственному графику.',
      },
      {
        title: 'Движения вверх, плоскими руками',
        body: 'Используйте подушечки пальцев плашмя, а не кончики, и ведите вверх от ключицы к челюсти. Производитель указывает массировать до впитывания, а крем достаточно богатый, чтобы это заняло момент.',
      },
      {
        title: 'Проведите по груди',
        body: 'Треугольник кожи, открытый большинством вырезов, получает столько же солнца, сколько лицо, и почти никакого ухода. Распределите столько же и туда.',
      },
      {
        title: 'Утром сверху санскрин',
        body: 'Самое ценное, что можно сделать для декольте. В этом креме есть витамин A и нет собственного UV-фильтра, так что днём поверх нужен санскрин.',
      },
    ],
    note:
      'Не наносите рядом с глазами - коробка говорит это прямо, а наш крем EyeCell и есть средство для той кожи. Он спокойно слоится под и над чем угодно без кислот и ретиноидов, а если хотите ещё и связывать воду, положите под него сыворотку против морщин.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что во флаконе',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote:
      'Перенесено из текущей подписанной производственной формулы. Если сравните со старой коробкой, найдёте расхождения: печатный список всё ещё несёт несколько ингредиентов, которые с тех пор убрали, и не содержит токоферол и линалоол. Список здесь - тот, что соответствует содержимому флакона.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Содержит арахисовое масло (Arachis Hypogaea). Не используйте при аллергии на арахис, а если не уверены - сначала спросите врача.',
      'Содержит лавандовое масло с линалоолом 0,0235%. Сделайте пробу, если реагируете на ароматизаторы.',
      'Только для наружного применения. Не наносите рядом с глазами. Избегайте глаз и слизистых, при попадании тщательно промойте прохладной водой.',
      'Содержит ретинил палмитат. При беременности и кормлении спросите врача перед применением любого средства с витамином A.',
      'Прекратите использование и обратитесь к врачу при покраснении, отёке, зуде или раздражении.',
      'Оценено как безопасное по регламенту EC 1223/2009 и получило оценку «не раздражает» в патч-тесте.',
      'Храните в прохладном сухом месте, недоступном для детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, плюс раскрытие арахиса и отдушки из количественной формулы и оценки безопасности.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '50 г, флакон с помпой' },
      { label: 'Для', value: 'Шеи и декольте' },
      { label: 'Текстура', value: 'Белый крем, богатый и запечатывающий' },
      { label: 'Активы в дозе', value: 'Сквалан 5,00%, диметикон 3,00%, витамин E 1,00%, пантенол 0,300%, аллантоин 0,200%, аденозин 0,040%' },
      { label: 'Глицерин', value: '0,700% - окклюзивный, а не увлажняющий' },
      { label: 'Пептиды', value: 'Пять, всего ~51,5 ppm; copper tripeptide-1-97% из них' },
      { label: 'Аллергены', value: 'Содержит арахисовое масло 0,0087% и линалоол 0,0235%' },
      { label: 'Отдушка', value: 'Да - лавандовое масло 0,0265%. Синтетической отдушки нет' },
      { label: 'pH', value: '6,00 ± 1,00 (6,32 в измеренной партии)' },
      { label: 'Лицензия', value: 'Корейское одинарное действие: уменьшение морщин, через аденозин' },
      { label: 'Оценка', value: 'Оценка безопасности ЕС; патч-тест «не раздражает»' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Он действительно содержит арахисовое масло?',
        a: 'Да, 0,0087%, и оно там потому, что это носитель, в котором приходит витамин A, а не потому, что его кто-то выбрал. Рафинированное масло держат ниже 0,5 части на миллион арахисового белка - это европейский предел, который позволяет его применять. При аллергии на арахис не используйте. Мы вынесли это в начало страницы, потому что шея и грудь - большая площадь кожи и потому что раньше на этой странице этого не было вовсе.',
      },
      {
        q: 'Он осветлит пигментацию на груди?',
        a: 'Мы не станем этого утверждать. В нашем же описании раньше говорилось об отличном эффекте депигментации, и мы его убрали: Корея лицензирует это средство только для уменьшения морщин, и осветляющего актива в рабочей дозе в нём нет - витамин C на 0,025%, примерно одна восьмидесятая от того, что используют исследования эффективности. Для фотоповреждений на декольте честный ответ - ежедневный санскрин и средство, построенное под пигмент.',
      },
      {
        q: 'Чем он отличается от обычного крема для лица?',
        a: 'Соотношением. Это 0,7% глицерина против примерно 15% масел, силиконов и сквалана, тогда как наш Multi Functional крем - 8% глицерина, а сыворотка - 25%. Кожа шеи и груди тоньше, сальных желёз в ней меньше, поэтому он построен запечатывать, а не поить. Это же значит, что некоторым лицам он покажется слишком богатым.',
      },
      {
        q: 'Пять пептидов звучит внушительно. Так ли это?',
        a: 'Один из них - да. Copper tripeptide-1 на 50 частях на миллион, и за ним есть реальная литература. Остальные четыре идут от одной части на миллион до десяти частей на миллиард, а acetyl hexapeptide-8 в литературе изучают при 5-10%, тогда как здесь он на четверти части на миллион. Вместе все пять дают около 51,5 ppm, и copper tripeptide - 97% из этого. Причины купить - сквалан, витамин E и аденозин.',
      },
      {
        q: 'В нём витамин A. Это ретиноидная терапия?',
        a: 'Нет. Ретинил палмитат на 0,0111% - самый мягкий и слабый эфир в семействе ретиноидов, в низкой концентрации. У этой цифры есть причина: более ранняя формула имела 0,02%, а оценщик безопасности ограничил средства для тела 0,025% и попросил снизить, и её снизили. При беременности и кормлении спросите врача перед применением любого средства с витамином A, какой бы малой ни была доза.',
      },
      {
        q: 'Можно вокруг глаз?',
        a: 'Нет - коробка прямо это запрещает. Кожа там ещё тоньше, а это богатый запечатывающий крем с витамином A и лавандовым маслом. Наш EyeCell Eye Contour Cream и есть средство для этой зоны.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

// Retained temporarily as the pre-audit reference; neither locale is served at runtime.
void _AR
void _RU

export const ND_CELL_COPY: Record<Locale, NdCellCopy> = {
  en: EN,
  ar: ND_CELL_LOCALIZED_COPY.ar,
  ru: ND_CELL_LOCALIZED_COPY.ru,
}

export function getNdCellCopy(locale: string | undefined): NdCellCopy {
  return ND_CELL_COPY[(locale as Locale) ?? 'en'] ?? ND_CELL_COPY.en
}

/** EyeCell first: the closest sibling, also a delicate area and also peanut oil. */
export const COMPANION_PRODUCT_IDS = ['24', '32', '22', '16'] as const
