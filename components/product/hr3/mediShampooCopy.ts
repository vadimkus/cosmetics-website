/**
 * Bespoke copy for HR³ MATRIX MEDI SCALP SHAMPOO α (product 44).
 *
 * SOURCING — the CURRENT-generation dossier, Intertek/MEDI SHAMPOO ALPHA/. Note the
 * Formula_up file elsewhere in the archive belongs to a superseded product
 * ("SCALP & HAIR SHAMPOO"); do not use it. Figures from the signed DTS MG formula:
 *   sodium C14-16 olefin sulfonate 14.100%, coco-betaine 5.250%, glycerin 2.753%,
 *   C12-13 alketh-9 1.500%, MENTHOL 1.120%, CAFFEINE 1.000%, citric acid 0.300%,
 *   parfum 0.300%, coco-glucoside 0.240%, sorbitol 0.210%, polyquaternium-67 0.200%,
 *   acrylates copolymer 0.200%, ethylhexylglycerin 0.200%, decyl glucoside 0.160%,
 *   potassium benzoate 0.450%, butylene glycol 0.4079%, menthyl lactate 0.080%,
 *   mistletoe 0.050%, disodium EDTA 0.050%, 1,2-hexanediol 0.031%, malt 0.028%,
 *   piroctone olamine 0.010%, panthenol 0.0075%, acorus calamus 0.002%, persimmon /
 *   camellia japonica / carob 0.00175% each, biotin 0.0002%, glycine 0.0002%,
 *   tocopherol 0.0003%, saw palmetto 0.0001%, lecithin 0.0001%, ginseng 0.00005%,
 *   copper tripeptide-1 0.000001%, soybean seed 0.000001%.
 *   NO salicylic acid in the current formula.
 *   COA lot I30Y001, product date 2025-10-23: brown transparent liquid, pH 5.6
 *   (spec 4.50-6.50), viscosity 5,740 (spec 3,000-9,000), total aerobic microbial
 *   count 0 (spec <=100). The certificate does NOT assay the actives, unlike the
 *   hair tonic's.
 *   Registered artwork: English function "Scalp & hair cleansing". English
 *   application "Take the moderate amount in hands and emulsify. Apply to damp hair
 *   and massage. Rinse off with water thoroughly." DERMATOLOGICALLY TESTED printed.
 *   Turkish panel: not for children under 3. German panel: do not use around the
 *   eye area. Russian panel adds a THREE-MINUTE dwell that the English one omits.
 *
 * FRAMING (owner decision, 17 Aug): follow the English panel. Scalp shampoo, no
 * hair-loss claim, no mention of the Korean functional designation.
 *
 * MUST NEVER BE ADDED — the Russian panel claims this shampoo "has antibacterial
 * and antifungal action", "effectively fights dandruff", "nourishes hair follicles,
 * reduces loss and accelerates hair growth". The only antifungal present is
 * piroctone olamine at 0.010%, roughly 10-100x below an anti-dandruff working dose.
 * None of it goes on the page. Second Russian panel in this line to overclaim.
 *
 * THE HONEST STORY: caffeine at a real 1.000% (a hundred times the tonic), the
 * hardest cooling in the range at 1.120% menthol, no SLS or SLES, and an acidic pH.
 * Against that, biotin at 2 ppm and copper tripeptide-1 at 10 ppb are named on the
 * carton and mean nothing — say so.
 */

import {
  MEDI_SHAMPOO_AR_COPY,
  MEDI_SHAMPOO_RU_COPY,
} from './mediShampooLocalizedCopy'

export type Locale = 'en' | 'ar' | 'ru'

export interface MediShampooCopy {
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

  caffeine: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ product: string; caffeine: string; note: string; here?: boolean }>
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
    items: Array<{ name: string; dose: string }>
    footnote: string
  }

  dandruff: {
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

const EN: MediShampooCopy = {
  eyebrow: 'HR³ MATRIX Medi Scalp Shampoo α · 300 ml',
  headline: 'The one in the range with caffeine at a real dose.',
  subheadline:
    'A full 1.000% caffeine — a hundred times what is in the hair tonic from this same line. Menthol at 1.120% with menthyl lactate on top of it is more menthol than anything else GENOSYS makes. No sodium lauryl or laureth sulfate, glycerin at 2.753% so a thorough cleanse does not leave the scalp tight, and a batch pH of 5.6.',
  heroBullets: [
    'Caffeine 1.000% — a hundred times the dose in the hair tonic',
    'Menthol 1.120% plus menthyl lactate: the most menthol in the range',
    'No SLS, no SLES — olefin sulfonate and coco-betaine instead',
    'Leave the lather on for three minutes, which the English panel forgets to tell you',
  ],
  badges: ['Made in Korea', '300 ml', 'Sulfate-free', 'Dermatologically tested'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '1.000%', label: 'Caffeine' },
    { value: '1.120%', label: 'Menthol, the most in the range' },
    { value: '5.6', label: 'Batch pH, acid side of neutral' },
    { value: '0', label: 'Sulfates, and nil microbial count' },
  ],

  caffeine: {
    eyebrow: 'The reason to buy this one',
    title: 'Caffeine, and where it actually is',
    intro:
      'Caffeine appears on the ingredient list of three products in this line. Only one of them carries it at a dose worth the words. If caffeine is what brought you here, it is worth seeing the three side by side before you choose.',
    rows: [
      { product: 'Medi Scalp Shampoo α — this one', caffeine: '1.000%', note: '10,000 ppm', here: true },
      { product: 'Hair Tonic α', caffeine: '0.001%', note: '10 ppm' },
      { product: 'Scalp Peeling α', caffeine: '—', note: 'not in the formula' },
    ],
    body:
      'A hundredfold difference, from the same brand, in the same line, with caffeine named on both cartons. That is the sort of thing an ingredient list will never tell you. It also does not mean the tonic is a bad product — it does other things well, and all three of its actives are measured on the batch — but if you came for caffeine, this is the bottle.',
  },

  working: {
    eyebrow: 'The working formula',
    title: 'What is actually doing the work',
    intro:
      'A shampoo has about ninety seconds of contact and then it goes down the drain, so the things that matter are the cleansing system, what stops it stripping, and whatever is present in enough quantity to survive the rinse.',
    items: [
      {
        name: 'Sodium C14-16 olefin sulfonate',
        dose: '14.100%',
        body: 'The primary surfactant, and a thorough one. Worth being precise about the naming: an olefin sulfonate is not a sulfate, so there is no sodium lauryl sulfate or laureth sulfate here. That does not make it a mild, low-foaming cleanser — it makes it a sulfate-free cleanser that still cleans hard.',
      },
      {
        name: 'Coco-betaine, with two glucosides',
        dose: '5.250% + 0.400%',
        body: 'Coco-betaine at 5.250%, then coco-glucoside at 0.240% and decyl glucoside at 0.160%. These soften the primary surfactant and build the foam, which is why the lather is dense rather than squeaky.',
      },
      {
        name: 'Menthol, with menthyl lactate',
        dose: '1.120% + 0.080%',
        body: 'The most menthol in the range — roughly three and a half times the hair tonic. Menthol is the cold hit in the shower, menthyl lactate is what you still feel ten minutes after towelling off.',
      },
      {
        name: 'Caffeine',
        dose: '1.000%',
        body: 'A full one per cent. Present at a hundred times the concentration in the tonic, and the honest reason to choose this shampoo over another.',
      },
      {
        name: 'Glycerin, with sorbitol',
        dose: '2.753% + 0.210%',
        body: 'Humectants at a real dose for something that gets rinsed off. This is what stops a 14% surfactant load leaving the scalp tight, and it is why the shampoo reads comfortable rather than stripping.',
      },
      {
        name: 'Citric acid',
        dose: '0.300%',
        body: 'Holds the formula on the acid side of neutral. The batch tested at pH 5.6, which suits scalp skin and hair better than an alkaline wash.',
      },
      {
        name: 'Mistletoe extract, then malt',
        dose: '0.050% + 0.028%',
        body: 'At 500 ppm and 280 ppm, the only two botanicals in a long list that are present in amounts worth naming.',
      },
      {
        name: 'Polyquaternium-67',
        dose: '0.200%',
        body: 'A conditioning polymer, which is what stops a strong cleanse leaving hair tangled and hard to comb.',
      },
    ],
  },

  trace: {
    eyebrow: 'Proportion',
    title: 'Biotin is on the carton. It is at two parts per million.',
    body:
      'The English carton opens with "powered by caffeine, biotin, and patented complexes". One of those three is at a real dose. Here is the rest of what the ingredient list promotes, with the actual numbers, because reading order on a carton follows the manufacturer\u2019s sequence rather than the quantity in the bottle.',
    items: [
      { name: 'Panthenol', dose: '75 ppm' },
      { name: 'Biotin', dose: '2 ppm' },
      { name: 'Saw palmetto fruit extract', dose: '1 ppm' },
      { name: 'Ginseng root extract', dose: '0.5 ppm' },
      { name: 'Copper tripeptide-1', dose: '0.01 ppm' },
    ],
    footnote:
      'Copper tripeptide-1 at 0.000001% is ten parts per billion. For scale: if the 300 ml bottle were an Olympic swimming pool, that is about three millilitres of it. The panthenol is worth one more note — at 75 ppm it is a small fraction of the 0.200% in the hair tonic, so if panthenol is what you want, that is the other product.',
  },

  dandruff: {
    eyebrow: 'What we are not going to claim',
    title: 'This is not an anti-dandruff shampoo',
    body:
      'The formula does contain piroctone olamine, a genuine antifungal, and one of the panels on the carton claims the shampoo fights dandruff. But it is present at 0.010% — and piroctone olamine generally needs somewhere between 0.1% and 1.0% to work on dandruff, so this is ten to a hundred times under. At this level it is part of how the bottle keeps itself preserved, not a treatment. If you have flaking that keeps coming back, buy an actual medicated shampoo and use this one on the days in between.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Lather, then wait three minutes',
    frequency: 'Daily or every other day · leave on ~3 minutes · rinse thoroughly',
    steps: [
      {
        title: 'Emulsify in your hands first',
        body: 'The carton is specific about this and it is worth doing. Three to five millilitres, worked between wet palms until it foams, spreads far better than neat shampoo dropped onto one spot of the head.',
      },
      {
        title: 'Massage into the scalp, not the ends',
        body: 'The scalp is what is being treated. The lengths get cleaned by the water running through them on the way out, and they do not need scrubbing.',
      },
      {
        title: 'Leave it on for about three minutes',
        body: 'This is the step that matters most, and the English panel does not mention it — we found it on the manufacturer\u2019s Russian panel. A shampoo rinsed straight off gives the caffeine and the menthol no contact time at all. Three minutes is the difference between a wash and a treatment.',
      },
      {
        title: 'Rinse thoroughly',
        body: 'All the way out, especially at the hairline and the nape. Then, if you use the hair tonic from this line, dry the scalp first and apply it to dry skin.',
      },
    ],
    note:
      'Expect it to be cold. At 1.120% menthol with menthyl lactate on top, the three-minute wait is noticeably chilly, and on a freshly-shaved head or a scalp that is already sore it can be too much — rinse sooner if so. Keep it out of the eyes and away from the eye area, and rinse immediately with water if it gets in.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea and released against a written specification. The batch we hold documentation for was produced in October 2025 and certified the following month.',
    rows: [
      { label: 'Appearance', value: 'Brown transparent liquid' },
      { label: 'pH', value: '5.6 at 25 °C, inside a 4.50–6.50 specification' },
      { label: 'Viscosity', value: '5,740 against a 3,000–9,000 specification' },
      { label: 'Purity', value: 'Total aerobic microbial count nil, against a permitted 100 cfu/ml' },
      { label: 'Odour', value: 'Matched against the reference sample' },
      { label: 'Caffeine', value: '1.000% as formulated' },
      { label: 'Menthol', value: '1.120% as formulated' },
      { label: 'Testing', value: 'Dermatologically tested, as printed on the carton' },
      { label: 'Sulfates', value: 'None — no sodium lauryl sulfate, no laureth sulfate' },
    ],
    patch:
      'One honest difference from the hair tonic in this line: that product\u2019s certificate assays each of its actives against declaration, and this one does not. What we hold for the shampoo confirms appearance, odour, pH, viscosity and that nothing is growing in the bottle — a normal cosmetic release, just not the unusually thorough one the tonic gets. The caffeine and menthol figures above come from the signed formula rather than from a batch assay.',
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
      'For external use only.',
      'Not for children under 3 years of age.',
      'Do not use around the eye area. Avoid contact with the eyes and mucous membranes; rinse thoroughly with water on contact.',
      'Contains menthol at 1.120%. It will feel cold, and it can sting a scalp that is broken, sunburned or freshly shaved.',
      'Contains fragrance at 0.300%.',
      'Stop and see a doctor or dermatologist if redness, swelling, itching or irritation develops.',
      'Store at room temperature, out of direct sunlight and out of reach of small children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton, drawing on the English, German and Turkish panels together.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '300 ml' },
      { label: 'Texture', value: 'Brown transparent liquid, rinse-off' },
      { label: 'Registered function', value: 'Scalp and hair cleansing' },
      { label: 'Caffeine', value: '1.000% — a hundred times the hair tonic' },
      { label: 'Cooling', value: 'Menthol 1.120%, menthyl lactate 0.080% — the most in the range' },
      { label: 'Cleansing', value: 'Sodium C14-16 olefin sulfonate 14.100%, coco-betaine 5.250%, coco-glucoside 0.240%, decyl glucoside 0.160%' },
      { label: 'Sulfates', value: 'None' },
      { label: 'Humectants', value: 'Glycerin 2.753%, sorbitol 0.210%' },
      { label: 'Conditioning', value: 'Polyquaternium-67 0.200%' },
      { label: 'At trace', value: 'Panthenol 75 ppm, biotin 2 ppm, saw palmetto 1 ppm, copper tripeptide-1 0.01 ppm' },
      { label: 'Piroctone olamine', value: '0.010% — preservative level, not a dandruff treatment dose' },
      { label: 'Fragrance', value: 'Parfum 0.300%' },
      { label: 'pH', value: '4.50–6.50 (5.6 on the batch tested)' },
      { label: 'Viscosity', value: '5,740 (specification 3,000–9,000)' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Not for', value: 'Children under 3. Do not use around the eye area' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Will this stop hair loss?',
        a: 'No, and we will not tell you it does. The function line on the carton reads "scalp and hair cleansing", and that is the claim we stand behind. It is a genuinely good scalp shampoo — caffeine at a working 1%, hard cooling, no sulfates, an acidic pH — but a shampoo that is on your head for three minutes is not a treatment for hair loss. If you are losing hair, see a doctor.',
      },
      {
        q: 'Does it treat dandruff?',
        a: 'Not at this dose. There is piroctone olamine in the formula, which is a real antifungal, but at 0.010% it is roughly ten to a hundred times below the concentration that works on dandruff. It is there as part of the preservative system. For persistent flaking, use a medicated shampoo and put this one on the days in between.',
      },
      {
        q: 'Is it really sulfate-free?',
        a: 'Yes, in the sense people usually mean: there is no sodium lauryl sulfate and no sodium laureth sulfate. The main surfactant is sodium C14-16 olefin sulfonate, which is a sulfonate rather than a sulfate. What we will not pretend is that this makes it a gentle shampoo — at 14.1% it cleans thoroughly. The glycerin at 2.753% is what keeps that from feeling stripping.',
      },
      {
        q: 'How cold is it?',
        a: 'Very. At 1.120% this is more menthol than anything else GENOSYS makes, roughly three and a half times the hair tonic. Most people like it, especially in a Dubai summer. On a freshly shaved head, sunburn, or a scalp that is already irritated, it will be too much — rinse sooner, or start every other day.',
      },
      {
        q: 'Can I use it with the hair tonic?',
        a: 'That is the intended pairing. Shampoo first, rinse thoroughly, dry the scalp, then spray the tonic onto dry skin and leave it. The two are not redundant: the shampoo has the caffeine, the tonic has the salicylic acid and considerably more panthenol. Do read the tonic\u2019s precautions before you buy it, though — it carries an avoid list that this shampoo does not.',
      },
      {
        q: 'Why does the carton make more of biotin than you do?',
        a: 'Because carton ingredient lists follow the manufacturer\u2019s own sequence, not the amount in the bottle. Biotin is present at two parts per million, which does nothing measurable. We would rather point you at the 1% caffeine and the 1.120% menthol, which are real, than let a name on a label do the selling.',
      },
    ],
  },

  backToProducts: 'Products',
}

export const LEGACY_MEDI_SHAMPOO_AR_COPY: MediShampooCopy = {
  eyebrow: 'شامبو إتش آر³ ماتريكس ميدي للفروة α · 300 مل',
  headline: 'الوحيد في المجموعة بكافيين بجرعة حقيقية.',
  subheadline:
    'كافيين بنسبة 1.000% كاملة — أي مئة ضعف ما في تونيك الشعر من المجموعة نفسها. ومنثول بنسبة 1.120% فوقه منثيل لاكتات، وهو منثول أكثر من أي شيء آخر تصنعه جينوسيس. ولا كبريتات لوريل أو لوريث الصوديوم، وجليسرين بنسبة 2.753% حتى لا يترك التنظيف الشامل الفروة مشدودة، وحموضة الدفعة 5.6.',
  heroBullets: [
    'كافيين 1.000% — مئة ضعف الجرعة في تونيك الشعر',
    'منثول 1.120% مع منثيل لاكتات: أعلى منثول في المجموعة',
    'بلا SLS ولا SLES — أوليفين سلفونات وكوكو-بيتايين بدلاً منها',
    'اتركي الرغوة ثلاث دقائق، وهو ما تنسى اللوحة الإنجليزية ذكره',
  ],
  badges: ['صُنع في كوريا', '300 مل', 'بلا كبريتات', 'مختبر جلدياً'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '1.000%', label: 'كافيين' },
    { value: '1.120%', label: 'منثول، الأعلى في المجموعة' },
    { value: '5.6', label: 'حموضة الدفعة، حمضية' },
    { value: '0', label: 'كبريتات، وعدد ميكروبي صفر' },
  ],

  caffeine: {
    eyebrow: 'سبب اختيار هذا',
    title: 'الكافيين، وموضعه فعلاً',
    intro:
      'يظهر الكافيين على قائمة مكوّنات ثلاثة منتجات في هذه المجموعة. وواحد منها فقط يحمله بجرعة تستحق الكلام. وإن كان الكافيين هو ما جاء بك، فيستحق أن ترى الثلاثة جنباً إلى جنب قبل الاختيار.',
    rows: [
      { product: 'شامبو ميدي للفروة α — هذا', caffeine: '1.000%', note: '10,000 ppm', here: true },
      { product: 'تونيك الشعر α', caffeine: '0.001%', note: '10 ppm' },
      { product: 'مقشّر الفروة α', caffeine: '—', note: 'غير موجود في التركيبة' },
    ],
    body:
      'فرق مئة ضعف، من العلامة نفسها، في المجموعة نفسها، والكافيين مذكور على العلبتين. وهذا ممّا لا تخبرك به قائمة مكوّنات أبداً. ولا يعني ذلك أن التونيك منتج سيّئ — فهو يُحسن أموراً أخرى، وفعّالاته الثلاثة كلها مقيسة على الدفعة — لكن إن جئتِ من أجل الكافيين، فهذه هي العبوة.',
  },

  working: {
    eyebrow: 'التركيبة العاملة',
    title: 'ما يقوم بالعمل فعلاً',
    intro:
      'للشامبو نحو تسعين ثانية من التلامس ثم يذهب إلى المصرف، فما يهمّ هو نظام التنظيف، وما يمنعه من التجريد، وما هو موجود بكمّية تكفي للنجاة من الشطف.',
    items: [
      {
        name: 'Sodium C14-16 Olefin Sulfonate',
        dose: '14.100%',
        body: 'الفاعل السطحي الأساسي، وهو شامل. ويستحق الأمر دقّة في التسمية: فالأوليفين سلفونات ليس كبريتاً، فلا كبريتات لوريل الصوديوم ولا لوريث هنا. ولا يجعله ذلك منظّفاً لطيفاً قليل الرغوة — بل يجعله منظّفاً بلا كبريتات ينظّف بقوة مع ذلك.',
      },
      {
        name: 'كوكو-بيتايين، مع جلوكوزيدين',
        dose: '5.250% + 0.400%',
        body: 'كوكو-بيتايين بنسبة 5.250%، ثم كوكو-جلوكوزيد 0.240% وديسيل جلوكوزيد 0.160%. تُلطّف هذه الفاعل السطحي الأساسي وتبني الرغوة، ولهذا تكون الرغوة كثيفة لا صرّارة.',
      },
      {
        name: 'المنثول، مع منثيل لاكتات',
        dose: '1.120% + 0.080%',
        body: 'أعلى منثول في المجموعة — نحو ثلاثة أضعاف ونصف تونيك الشعر. فالمنثول هو الضربة الباردة تحت الدوش، والمنثيل لاكتات هو ما تشعرين به بعد عشر دقائق من التنشيف.',
      },
      {
        name: 'Caffeine',
        dose: '1.000%',
        body: 'واحد بالمئة كامل. موجود بمئة ضعف تركيزه في التونيك، وهو السبب الصريح لاختيار هذا الشامبو على غيره.',
      },
      {
        name: 'الجليسرين، مع السوربيتول',
        dose: '2.753% + 0.210%',
        body: 'مرطّبات جاذبة بجرعة حقيقية لشيء يُشطف. وهذا ما يمنع حمولة 14% من الفاعلات السطحية من ترك الفروة مشدودة، ولهذا يُقرأ الشامبو مريحاً لا مجرّداً.',
      },
      {
        name: 'Citric Acid',
        dose: '0.300%',
        body: 'يُبقي التركيبة على الجانب الحمضي. وقد اختُبرت الدفعة عند حموضة 5.6، وهي أنسب لجلد الفروة والشعر من غسول قلوي.',
      },
      {
        name: 'مستخلص الدبق، ثم الشعير',
        dose: '0.050% + 0.028%',
        body: 'عند 500 و280 جزءاً من المليون، وهما النباتان الوحيدان في قائمة طويلة موجودان بكمّيات تستحق التسمية.',
      },
      {
        name: 'Polyquaternium-67',
        dose: '0.200%',
        body: 'بوليمر مكيّف، وهو ما يمنع التنظيف القوي من ترك الشعر متشابكاً صعب التسريح.',
      },
    ],
  },

  trace: {
    eyebrow: 'التناسب',
    title: 'البيوتين على العلبة. وهو عند جزأين من المليون.',
    body:
      'تفتتح العلبة الإنجليزية بعبارة «مدعوم بالكافيين والبيوتين ومركّبات مسجّلة». وواحد من الثلاثة بجرعة حقيقية. وهذا بقيّة ما تروّج له قائمة المكوّنات، بالأرقام الفعلية، لأن ترتيب القراءة على العلبة يتبع تسلسل الشركة لا الكمّية في العبوة.',
    items: [
      { name: 'بانثينول', dose: '75 ppm' },
      { name: 'بيوتين', dose: '2 ppm' },
      { name: 'مستخلص ثمرة نخيل المنشار', dose: '1 ppm' },
      { name: 'مستخلص جذر الجنسنغ', dose: '0.5 ppm' },
      { name: 'كوبر ترايببتايد-1', dose: '0.01 ppm' },
    ],
    footnote:
      'الكوبر ترايببتايد-1 عند 0.000001% هو عشرة أجزاء من المليار. وللقياس: لو كانت عبوة الـ 300 مل حوض سباحة أولمبياً، فذلك نحو ثلاثة ملّيلترات منه. والبانثينول يستحق ملاحظة أخرى — فعند 75 جزءاً من المليون هو كسر صغير من الـ 0.200% في تونيك الشعر، فإن كان البانثينول مرادك فذاك هو المنتج الآخر.',
  },

  dandruff: {
    eyebrow: 'ما لن نزعمه',
    title: 'هذا ليس شامبو ضدّ القشرة',
    body:
      'تحتوي التركيبة فعلاً على بيروكتون أولامين، وهو مضاد فطريات حقيقي، وتزعم إحدى اللوحات على العلبة أن الشامبو يحارب القشرة. لكنه موجود بنسبة 0.010% — والبيروكتون أولامين يحتاج عموماً ما بين 0.1% و1.0% ليعمل على القشرة، فهذا أقلّ بعشرة إلى مئة ضعف. وعند هذا المستوى هو جزء من كيفية حفظ العبوة لنفسها، لا علاج. وإن كان لديك تقشّر يعود دائماً، فاشتري شامبو دوائياً فعلياً واستخدمي هذا في الأيام بينهما.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'رغّي ثم انتظري ثلاث دقائق',
    frequency: 'يومياً أو كل يومين · يُترك نحو 3 دقائق · يُشطف جيداً',
    steps: [
      {
        title: 'استحلبيه بين يديك أولاً',
        body: 'العلبة محدّدة في هذا ويستحق الفعل. فثلاثة إلى خمسة ملّيلترات تُعمل بين كفّين مبلّلتين حتى ترغي، تنتشر أفضل بكثير من شامبو خالص يُسقط على موضع واحد من الرأس.',
      },
      {
        title: 'دلّكي الفروة، لا الأطراف',
        body: 'الفروة هي ما يُعالج. أما الأطوال فينظّفها الماء المارّ بها في طريقه للخارج، ولا تحتاج فركاً.',
      },
      {
        title: 'اتركيه نحو ثلاث دقائق',
        body: 'هذه الخطوة الأهمّ، واللوحة الإنجليزية لا تذكرها — وجدناها على اللوحة الروسية للشركة. فشامبو يُشطف فوراً لا يمنح الكافيين والمنثول أي وقت تلامس. وثلاث دقائق هي الفرق بين غسلة ومعالجة.',
      },
      {
        title: 'اشطفي جيداً',
        body: 'حتى النهاية، خاصة عند خطّ الشعر والقفا. ثم إن كنتِ تستخدمين تونيك الشعر من هذه المجموعة، فجفّفي الفروة أولاً وضعيه على جلد جافّ.',
      },
    ],
    note:
      'توقّعي البرد. فعند منثول 1.120% مع منثيل لاكتات فوقه، تكون دقائق الانتظار الثلاث باردة بشكل ملحوظ، وعلى رأس حُلق حديثاً أو فروة متألمة أصلاً قد يكون ذلك أكثر من اللازم — فاشطفي أسرع. وأبعديه عن العينين ومحيطهما، واشطفي فوراً بالماء إن وصل إليهما.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما تقوله الشهادة',
    intro:
      'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة. والدفعة التي نملك وثائقها أُنتجت في أكتوبر 2025 وصُدّق عليها في الشهر التالي.',
    rows: [
      { label: 'المظهر', value: 'سائل شفّاف بنّي' },
      { label: 'الحموضة', value: '5.6 عند 25 درجة، ضمن مواصفة 4.50–6.50' },
      { label: 'اللزوجة', value: '5,740 مقابل مواصفة 3,000–9,000' },
      { label: 'النقاء', value: 'العدد الميكروبي الهوائي الكلي صفر، مقابل 100 وحدة/مل مسموحة' },
      { label: 'الرائحة', value: 'مطابقة للعيّنة المرجعية' },
      { label: 'الكافيين', value: '1.000% كما رُكّب' },
      { label: 'المنثول', value: '1.120% كما رُكّب' },
      { label: 'الاختبار', value: 'مختبر جلدياً، كما هو مطبوع على العلبة' },
      { label: 'الكبريتات', value: 'لا شيء — لا كبريتات لوريل ولا لوريث الصوديوم' },
    ],
    patch:
      'فرق صريح واحد عن تونيك الشعر في هذه المجموعة: فشهادة ذلك المنتج تقيس كل فعّال من فعّالاته مقابل المعلن، وهذه لا تفعل. فما نملكه للشامبو يؤكّد المظهر والرائحة والحموضة واللزوجة وأن لا شيء ينمو في العبوة — إفراج تجميلي عادي، لكنه ليس ذاك الإفراج الشامل بشكل غير معتاد الذي يناله التونيك. أما رقما الكافيين والمنثول أعلاه فمن التركيبة الموقّعة لا من قياس دفعة.',
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
      'للاستعمال الخارجي فقط.',
      'ليس للأطفال تحت سن الثالثة.',
      'لا يُستخدم حول منطقة العين. يُتجنّب ملامسة العينين والأغشية المخاطية، ويُشطف جيداً بالماء عند الملامسة.',
      'يحتوي منثول بنسبة 1.120%. سيُحسّ بالبرد، وقد يلسع فروة مجروحة أو محروقة بالشمس أو محلوقة حديثاً.',
      'يحتوي عطراً بنسبة 0.300%.',
      'أوقفي الاستخدام واستشيري طبيباً أو طبيب جلد عند ظهور احمرار أو تورّم أو حكّة أو تهيّج.',
      'يُحفظ في حرارة الغرفة بعيداً عن أشعة الشمس المباشرة ومتناول الأطفال الصغار.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، مستندة إلى اللوحات الإنجليزية والألمانية والتركية معاً.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: '300 مل' },
      { label: 'الملمس', value: 'سائل شفّاف بنّي، يُشطف' },
      { label: 'الوظيفة المسجّلة', value: 'تنظيف فروة الرأس والشعر' },
      { label: 'الكافيين', value: '1.000% — مئة ضعف تونيك الشعر' },
      { label: 'التبريد', value: 'منثول 1.120%، منثيل لاكتات 0.080% — الأعلى في المجموعة' },
      { label: 'التنظيف', value: 'صوديوم C14-16 أوليفين سلفونات 14.100%، كوكو-بيتايين 5.250%، كوكو-جلوكوزيد 0.240%، ديسيل جلوكوزيد 0.160%' },
      { label: 'الكبريتات', value: 'لا شيء' },
      { label: 'المرطّبات الجاذبة', value: 'جليسرين 2.753%، سوربيتول 0.210%' },
      { label: 'التكييف', value: 'بوليكواتيرنيوم-67 0.200%' },
      { label: 'بجرعات أثرية', value: 'بانثينول 75 ppm، بيوتين 2 ppm، نخيل المنشار 1 ppm، كوبر ترايببتايد-1 0.01 ppm' },
      { label: 'بيروكتون أولامين', value: '0.010% — مستوى حافظ، لا جرعة علاج للقشرة' },
      { label: 'العطر', value: 'عطر 0.300%' },
      { label: 'الحموضة', value: '4.50–6.50 (5.6 على الدفعة المختبرة)' },
      { label: 'اللزوجة', value: '5,740 (المواصفة 3,000–9,000)' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'ليس لأجل', value: 'الأطفال تحت الثالثة. لا يُستخدم حول منطقة العين' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل سيوقف هذا تساقط الشعر؟',
        a: 'لا، ولن نقول لك إنه يفعل. فسطر الوظيفة على العلبة يقول «تنظيف فروة الرأس والشعر»، وهذا هو الادّعاء الذي نقف خلفه. وهو شامبو فروة جيّد فعلاً — كافيين بنسبة عاملة 1%، وتبريد قوي، وبلا كبريتات، وحموضة حمضية — لكن شامبو يبقى على رأسك ثلاث دقائق ليس علاجاً لتساقط الشعر. وإن كنتِ تفقدين شعراً، فراجعي طبيباً.',
      },
      {
        q: 'هل يعالج القشرة؟',
        a: 'ليس بهذه الجرعة. ففي التركيبة بيروكتون أولامين، وهو مضاد فطريات حقيقي، لكنه عند 0.010% أقلّ بعشرة إلى مئة ضعف من التركيز الذي يعمل على القشرة. وهو موجود كجزء من نظام الحفظ. وللتقشّر المستمر، استخدمي شامبو دوائياً وضعي هذا في الأيام بينهما.',
      },
      {
        q: 'هل هو بلا كبريتات فعلاً؟',
        a: 'نعم، بالمعنى الذي يقصده الناس عادة: فلا كبريتات لوريل الصوديوم ولا لوريث الصوديوم. والفاعل السطحي الرئيسي صوديوم C14-16 أوليفين سلفونات، وهو سلفونات لا كبريت. أما ما لن نتظاهر به فهو أن ذلك يجعله شامبو لطيفاً — فعند 14.1% ينظّف بشمول. والجليسرين بنسبة 2.753% هو ما يمنع ذلك من الإحساس بالتجريد.',
      },
      {
        q: 'كم هو بارد؟',
        a: 'بارد جداً. فعند 1.120% هذا منثول أكثر من أي شيء آخر تصنعه جينوسيس، نحو ثلاثة أضعاف ونصف تونيك الشعر. ويحبّه معظم الناس، خاصة في صيف دبي. وعلى رأس محلوق حديثاً أو حرق شمس أو فروة متهيّجة أصلاً سيكون أكثر من اللازم — فاشطفي أسرع، أو ابدئي كل يومين.',
      },
      {
        q: 'أيمكن استخدامه مع تونيك الشعر؟',
        a: 'ذلك هو الاقتران المقصود. شامبو أولاً، ثم شطف جيّد، ثم تجفيف الفروة، ثم رشّ التونيك على جلد جافّ وتركه. والاثنان ليسا مكرّرين: فالشامبو فيه الكافيين، والتونيك فيه حمض الساليسيليك وبانثينول أكثر بكثير. لكن اقرئي احتياطات التونيك قبل شرائه — فهو يحمل قائمة تجنّب لا يحملها هذا الشامبو.',
      },
      {
        q: 'لماذا تُعلي العلبة من البيوتين أكثر منكم؟',
        a: 'لأن قوائم مكوّنات العلب تتبع تسلسل الشركة نفسها، لا الكمّية في العبوة. فالبيوتين موجود عند جزأين من المليون، وهو ما لا يفعل شيئاً قابلاً للقياس. ونفضّل أن ندلّك على الكافيين 1% والمنثول 1.120%، وهما حقيقيان، بدل أن نترك اسماً على ملصق يقوم بالبيع.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

export const LEGACY_MEDI_SHAMPOO_RU_COPY: MediShampooCopy = {
  eyebrow: 'HR³ MATRIX MEDI шампунь для кожи головы α · 300 мл',
  headline: 'Единственный в линейке с кофеином в реальной дозе.',
  subheadline:
    'Полный 1,000% кофеина — в сто раз больше, чем в тонике из этой же линии. Ментол 1,120% плюс ментил лактат сверху — это больше ментола, чем в любом другом продукте GENOSYS. Ни лаурилсульфата, ни лауретсульфата натрия, глицерин 2,753%, чтобы тщательное очищение не оставляло кожу головы стянутой, и pH партии 5,6.',
  heroBullets: [
    'Кофеин 1,000% — в сто раз больше, чем в тонике',
    'Ментол 1,120% плюс ментил лактат: больше всего ментола в линейке',
    'Без SLS и SLES — олефинсульфонат и кокобетаин вместо них',
    'Оставьте пену на три минуты — англоязычная панель об этом забывает',
  ],
  badges: ['Сделано в Корее', '300 мл', 'Без сульфатов', 'Дерматологически протестировано'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '1,000%', label: 'Кофеина' },
    { value: '1,120%', label: 'Ментола, больше всех в линейке' },
    { value: '5,6', label: 'pH партии, кислая сторона' },
    { value: '0', label: 'Сульфатов, и нулевой микробный счёт' },
  ],

  caffeine: {
    eyebrow: 'Причина выбрать именно этот',
    title: 'Кофеин и где он действительно есть',
    intro:
      'Кофеин указан в составе трёх продуктов этой линии. Только один несёт его в дозе, которая стоит слов. Если вы пришли за кофеином, стоит увидеть все три рядом до выбора.',
    rows: [
      { product: 'MEDI шампунь α — этот', caffeine: '1,000%', note: '10 000 ppm', here: true },
      { product: 'Тоник для кожи головы α', caffeine: '0,001%', note: '10 ppm' },
      { product: 'Пилинг для кожи головы α', caffeine: '—', note: 'нет в формуле' },
    ],
    body:
      'Стократная разница, у одного бренда, в одной линии, и кофеин назван на обеих коробках. Такого список ингредиентов вам никогда не скажет. Это не значит, что тоник плох — он хорошо делает другое, и все три его актива измерены в партии, — но если вы пришли за кофеином, то вот этот флакон.',
  },

  working: {
    eyebrow: 'Работающая формула',
    title: 'Что действительно делает работу',
    intro:
      'У шампуня примерно девяносто секунд контакта, затем он уходит в слив. Поэтому значение имеют система очищения, то, что не даёт ей пересушивать, и то, чего достаточно, чтобы пережить смывание.',
    items: [
      {
        name: 'Sodium C14-16 Olefin Sulfonate',
        dose: '14.100%',
        body: 'Основной сурфактант, и притом тщательный. О названии стоит сказать точно: олефинсульфонат — не сульфат, поэтому здесь нет ни лаурилсульфата, ни лауретсульфата натрия. Это не делает его мягким малопенящимся очищением — это делает его очищением без сульфатов, которое всё равно моет сильно.',
      },
      {
        name: 'Кокобетаин с двумя глюкозидами',
        dose: '5.250% + 0.400%',
        body: 'Кокобетаин 5,250%, затем кокоглюкозид 0,240% и децилглюкозид 0,160%. Они смягчают основной сурфактант и строят пену — поэтому пена плотная, а не «скрипучая».',
      },
      {
        name: 'Ментол с ментил лактатом',
        dose: '1.120% + 0.080%',
        body: 'Больше всего ментола в линейке — примерно в три с половиной раза больше, чем в тонике. Ментол — холодный удар в душе, ментил лактат — то, что вы чувствуете и через десять минут после полотенца.',
      },
      {
        name: 'Caffeine',
        dose: '1.000%',
        body: 'Полный один процент. В сто раз больше, чем в тонике, и честная причина выбрать этот шампунь.',
      },
      {
        name: 'Глицерин с сорбитолом',
        dose: '2.753% + 0.210%',
        body: 'Увлажнители в реальной дозе для смываемого продукта. Именно это не даёт 14-процентной загрузке сурфактантов оставлять кожу головы стянутой, и поэтому шампунь читается комфортным, а не пересушивающим.',
      },
      {
        name: 'Citric Acid',
        dose: '0.300%',
        body: 'Держит формулу на кислой стороне. Партия показала pH 5,6 — коже головы и волосам это подходит лучше щелочного мытья.',
      },
      {
        name: 'Экстракт омелы, затем мальтозный',
        dose: '0.050% + 0.028%',
        body: 'При 500 и 280 ppm — два единственных растительных экстракта в длинном списке, присутствующие в количествах, которые стоит называть.',
      },
      {
        name: 'Polyquaternium-67',
        dose: '0.200%',
        body: 'Кондиционирующий полимер — то, что не даёт сильному очищению оставить волосы спутанными и трудными для расчёсывания.',
      },
    ],
  },

  trace: {
    eyebrow: 'Пропорция',
    title: 'Биотин есть на коробке. Его две части на миллион.',
    body:
      'Английская коробка открывается словами «powered by caffeine, biotin, and patented complexes». Из этих трёх в реальной дозе один. Вот остальное, что продвигает список ингредиентов, с фактическими числами — потому что порядок чтения на коробке следует последовательности производителя, а не количеству во флаконе.',
    items: [
      { name: 'Пантенол', dose: '75 ppm' },
      { name: 'Биотин', dose: '2 ppm' },
      { name: 'Экстракт плодов сереноа', dose: '1 ppm' },
      { name: 'Экстракт корня женьшеня', dose: '0,5 ppm' },
      { name: 'Медный трипептид-1', dose: '0,01 ppm' },
    ],
    footnote:
      'Медный трипептид-1 при 0,000001% — это десять частей на миллиард. Для масштаба: если бы флакон 300 мл был олимпийским бассейном, это около трёх миллилитров. Пантенол стоит ещё одной оговорки — при 75 ppm это малая доля от 0,200% в тонике, так что если вам нужен пантенол, то это другой продукт.',
  },

  dandruff: {
    eyebrow: 'Чего мы заявлять не будем',
    title: 'Это не шампунь против перхоти',
    body:
      'В формуле действительно есть пироктон оламин, настоящий противогрибковый компонент, и одна из панелей на коробке заявляет, что шампунь борется с перхотью. Но его 0,010% — а пироктону оламину обычно нужно от 0,1% до 1,0%, чтобы работать против перхоти, то есть здесь в десять-сто раз меньше. На этом уровне он часть того, как флакон сохраняет себя, а не лечение. Если шелушение возвращается, купите настоящий лечебный шампунь, а этот используйте в дни между.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Взбить пену, затем подождать три минуты',
    frequency: 'Ежедневно или через день · оставить ~3 минуты · тщательно смыть',
    steps: [
      {
        title: 'Сначала эмульгируйте в руках',
        body: 'Коробка на этом настаивает, и это стоит делать. Три-пять миллилитров, растёртые между влажными ладонями до пены, распределяются гораздо лучше, чем шампунь, вылитый на одно место головы.',
      },
      {
        title: 'Массируйте кожу головы, а не концы',
        body: 'Обрабатывается кожа головы. Длина отмывается водой, стекающей по ней на выходе, и в оттирании не нуждается.',
      },
      {
        title: 'Оставьте примерно на три минуты',
        body: 'Это самый важный шаг, и английская панель его не упоминает — мы нашли его на русской панели производителя. Смытый сразу шампунь не даёт ни кофеину, ни ментолу никакого времени контакта. Три минуты — это разница между мытьём и уходом.',
      },
      {
        title: 'Тщательно смойте',
        body: 'До конца, особенно у линии роста волос и на затылке. Затем, если вы пользуетесь тоником из этой линии, сначала высушите кожу головы и нанесите его на сухую кожу.',
      },
    ],
    note:
      'Будет холодно. При ментоле 1,120% с ментил лактатом сверху три минуты ожидания заметно зябкие, а на свежевыбритой голове или уже болящей коже головы это может быть слишком — тогда смойте раньше. Держите подальше от глаз и области вокруг них, при попадании сразу промойте водой.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что говорит сертификат',
    intro:
      'Сделано в Корее и выпущено против письменной спецификации. Партия, по которой у нас есть документы, произведена в октябре 2025 года и сертифицирована в следующем месяце.',
    rows: [
      { label: 'Внешний вид', value: 'Коричневая прозрачная жидкость' },
      { label: 'pH', value: '5,6 при 25 °C, в пределах спецификации 4,50–6,50' },
      { label: 'Вязкость', value: '5 740 при спецификации 3 000–9 000' },
      { label: 'Чистота', value: 'Общее число аэробных микроорганизмов ноль при допустимых 100 КОЕ/мл' },
      { label: 'Запах', value: 'Соответствует эталонному образцу' },
      { label: 'Кофеин', value: '1,000% по составу' },
      { label: 'Ментол', value: '1,120% по составу' },
      { label: 'Тестирование', value: 'Дерматологически протестировано, как напечатано на коробке' },
      { label: 'Сульфаты', value: 'Нет — ни лаурилсульфата, ни лауретсульфата натрия' },
    ],
    patch:
      'Одно честное отличие от тоника этой линии: его сертификат измеряет каждый актив против заявленного, а этот — нет. То, что у нас есть на шампунь, подтверждает внешний вид, запах, pH, вязкость и что во флаконе ничего не растёт — обычный косметический выпуск, просто не тот необычно тщательный, который получает тоник. Цифры кофеина и ментола выше взяты из подписанной формулы, а не из анализа партии.',
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
      'Только для наружного применения.',
      'Не для детей младше 3 лет.',
      'Не использовать вокруг области глаз. Избегайте контакта с глазами и слизистыми, при попадании тщательно промойте водой.',
      'Содержит ментол 1,120%. Будет ощущаться холод, и может щипать повреждённую, обгоревшую или свежевыбритую кожу головы.',
      'Содержит ароматизатор 0,300%.',
      'Прекратите использование и обратитесь к врачу или дерматологу при покраснении, отёке, зуде или раздражении.',
      'Хранить при комнатной температуре, вне прямого солнца и вне доступа маленьких детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, по английской, немецкой и турецкой панелям вместе.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: '300 мл' },
      { label: 'Текстура', value: 'Коричневая прозрачная жидкость, смываемая' },
      { label: 'Зарегистрированная функция', value: 'Очищение кожи головы и волос' },
      { label: 'Кофеин', value: '1,000% — в сто раз больше тоника' },
      { label: 'Охлаждение', value: 'Ментол 1,120%, ментил лактат 0,080% — больше всех в линейке' },
      { label: 'Очищение', value: 'Sodium C14-16 olefin sulfonate 14,100%, кокобетаин 5,250%, кокоглюкозид 0,240%, децилглюкозид 0,160%' },
      { label: 'Сульфаты', value: 'Нет' },
      { label: 'Увлажнители', value: 'Глицерин 2,753%, сорбитол 0,210%' },
      { label: 'Кондиционирование', value: 'Polyquaternium-67 0,200%' },
      { label: 'Следово', value: 'Пантенол 75 ppm, биотин 2 ppm, сереноа 1 ppm, медный трипептид-1 0,01 ppm' },
      { label: 'Пироктон оламин', value: '0,010% — уровень консерванта, не доза лечения перхоти' },
      { label: 'Ароматизатор', value: 'Parfum 0,300%' },
      { label: 'pH', value: '4,50–6,50 (5,6 в измеренной партии)' },
      { label: 'Вязкость', value: '5 740 (спецификация 3 000–9 000)' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Не для', value: 'Детей младше 3 лет. Не использовать вокруг глаз' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Он остановит выпадение волос?',
        a: 'Нет, и мы не станем этого утверждать. Строка функции на коробке гласит «очищение кожи головы и волос», и именно за это заявление мы отвечаем. Это действительно хороший шампунь для кожи головы — кофеин в рабочем 1%, сильное охлаждение, без сульфатов, кислый pH, — но шампунь, который держится на голове три минуты, не является лечением выпадения волос. Если вы теряете волосы, обратитесь к врачу.',
      },
      {
        q: 'Он лечит перхоть?',
        a: 'Не в этой дозе. В формуле есть пироктон оламин, настоящий противогрибковый компонент, но при 0,010% это в десять-сто раз ниже концентрации, работающей против перхоти. Он там как часть системы консервации. При стойком шелушении используйте лечебный шампунь, а этот — в дни между.',
      },
      {
        q: 'Он действительно без сульфатов?',
        a: 'Да, в том смысле, который обычно имеют в виду: нет ни лаурилсульфата, ни лауретсульфата натрия. Основной сурфактант — sodium C14-16 olefin sulfonate, то есть сульфонат, а не сульфат. Чего мы не будем изображать — что это делает шампунь мягким: при 14,1% он моет тщательно. Глицерин 2,753% — то, что не даёт этому ощущаться пересушиванием.',
      },
      {
        q: 'Насколько он холодный?',
        a: 'Очень. При 1,120% это больше ментола, чем в любом другом продукте GENOSYS, примерно в три с половиной раза больше, чем в тонике. Большинству это нравится, особенно в дубайское лето. На свежевыбритой голове, при солнечном ожоге или уже раздражённой коже головы будет слишком — смойте раньше или начните через день.',
      },
      {
        q: 'Можно вместе с тоником?',
        a: 'Это и есть задуманная пара. Сначала шампунь, тщательно смыть, высушить кожу головы, затем распылить тоник на сухую кожу и оставить. Они не дублируют друг друга: в шампуне кофеин, в тонике салициловая кислота и значительно больше пантенола. Но прочтите предостережения тоника до покупки — у него есть список ограничений, которого у этого шампуня нет.',
      },
      {
        q: 'Почему коробка делает из биотина больше, чем вы?',
        a: 'Потому что списки ингредиентов на коробках следуют последовательности производителя, а не количеству во флаконе. Биотина две части на миллион, что не даёт ничего измеримого. Мы предпочтём указать вам на 1% кофеина и 1,120% ментола, которые реальны, чем позволить названию на этикетке делать продажу.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const MEDI_SHAMPOO_COPY: Record<Locale, MediShampooCopy> = {
  en: EN,
  ar: MEDI_SHAMPOO_AR_COPY,
  ru: MEDI_SHAMPOO_RU_COPY,
}

export function getMediShampooCopy(locale: string | undefined): MediShampooCopy {
  return MEDI_SHAMPOO_COPY[(locale as Locale) ?? 'en'] ?? MEDI_SHAMPOO_COPY.en
}

/** The tonic it pairs with, the brush, then the rest of the scalp line. */
export const COMPANION_PRODUCT_IDS = ['43', '61', '46', '45'] as const
