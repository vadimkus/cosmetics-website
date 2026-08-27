/**
 * Bespoke copy for SOOTHING REPAIR POSTCREAM (product 25), the post-procedure
 * cream clinics hand a client after microneedling.
 *
 * SOURCING - every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_25_POSTCREAM_SOURCE_AUDIT.md:
 *   - DTS MG signed formula: butylene glycol 12.000%, glycerin 6.390%,
 *     dimethicone 2.000%, squalane 1.500%, caprylic/capric triglyceride 1.500%,
 *     cetearyl olivate 0.900%, cetearyl alcohol 0.800%, sorbitan olivate 0.600%,
 *     tocopheryl acetate 0.500%, beeswax 0.500%, arginine 0.500%, jojoba 0.500%,
 *     dipotassium glycyrrhizate 0.200%, scutellaria 0.200%, allantoin 0.200%,
 *     bisabolol 0.050%, panthenol 0.050%, beta-glucan 0.028%, sodium hyaluronate
 *     0.02504%, centella triterpenes 0.020% combined, callus extracts 0.006%
 *     each, lavender oil 0.0053%, linalool 0.0047%, sh-polypeptide-7 0.000001%.
 *   - EU safety assessment ID E3 20 06 01828, 42 pages, AMENDMENT I: conclusion
 *     "safe for human health" with NO "with restrictions" qualifier; patch test
 *     "Non Irritant" (QACS Ltd); linalool measured analytically at 0.0032%.
 *   - COAs lots L0302B and L1233B: pH 6.65/6.67, specific gravity 1.009/1.004,
 *     four pathogens not detected, NO ingredient assay (no functional active).
 *   - Registered carton: "Function Soothing" only, no Korean functional licence,
 *     PAO 6 months, avoid pregnancy/lactation, avoid broken skin, may be applied
 *     several times a day, "SRP helps fast skin recovery after professional
 *     treatment".
 *
 * THIS PAGE IS A RE-ATTRIBUTION, NOT A DEBUNKING. The soothing claim holds up
 * well. It is carried by 18.4% humectants plus licorice-derived dipotassium
 * glycyrrhizate at 0.200%, baicalin-bearing scutellaria at 0.200%, allantoin at
 * 0.200%, vitamin E at 0.500% and bisabolol - none of which our record led with.
 * Meanwhile sh-polypeptide-7, which DID lead the list, is at 10 parts per billion.
 *
 * MUST STAY OUT:
 *   - The "efficacy test on protection of the skin against damage induced by
 *     physical stimuli". No report exists and the 42-page assessment never
 *     mentions physical stimuli.
 *   - "Regenerating" / "promotes healthy rejuvenation". The carton's registered
 *     function is the single word "Soothing" and there is no functional licence.
 *   - Any regeneration or stem-cell story from the two callus culture extracts
 *     at 60 ppm each. Same cut already applied to product 24.
 *   - Healing, wound healing, oedema or inflammation claims. These appear on the
 *     drifted Russian panel and are drug-adjacent; they are logged as an artwork
 *     error, not reproduced.
 *   - Anything implying it may go on open or broken skin. The Korean carton
 *     explicitly says to refrain from use on wounded areas.
 *   - That sh-polypeptide-7 is a recombinant human somatotropin peptide. True per
 *     the assessment, but it invites a drug claim and sits at 10 ppb.
 *   - The contract manufacturer, and the lot codes.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface PostcreamCopy {
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

  /* Two tubes: the 20 g retail tube and the 100 g professional one. Both are real
     SKUs with their own MoySklad codes (00038 and 54465), so a size has to travel
     with every cart call - see PostcreamProductPage. */
  chooseSize: string
  sizes: {
    homecareLabel: string
    homecareNote: string
    proLabel: string
    proNote: string
  }

  stats: Array<{ value: string; label: string }>

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
    columns: { name: string; listed: string; actual: string }
    rows: Array<{ name: string; listed: string; actual: string; real?: boolean }>
    body: string
  }

  centella: {
    eyebrow: string
    title: string
    body: string
  }

  brokenSkin: {
    eyebrow: string
    title: string
    body: string
    detail: string
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

const EN: PostcreamCopy = {
  eyebrow: 'Soothing Repair Postcream · 20 g homecare · 100 g professional',
  headline: 'The cream your practitioner hands you on the way out.',
  subheadline:
    'Nearly a fifth of this tube is humectant - butylene glycol at 12% and glycerin at 6.4% - over licorice-derived dipotassium glycyrrhizate, baicalin-bearing scutellaria and allantoin, each at 0.2%. That combination is why skin that has just been needled or lasered settles down under it. Its registered function is one word: soothing.',
  heroBullets: [
    '18.4% humectants - the most useful thing for freshly treated skin',
    'Licorice, scutellaria and allantoin, all three at a full 0.2%',
    'May be reapplied several times a day, per the manufacturer',
    'Contains beeswax and lavender oil. Not for broken skin',
  ],
  badges: ['Made in Korea', '20 g / 100 g', 'EU safety assessed', 'Graded Non Irritant'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',
  chooseSize: 'Choose your size',
  sizes: {
    homecareLabel: 'Homecare',
    homecareNote: 'The 20 g tube, for one course of aftercare at home',
    proLabel: 'Professional',
    proNote: 'The 100 g tube, for clinic use across many clients',
  },

  stats: [
    { value: '18.4%', label: 'Humectants - butylene glycol plus glycerin' },
    { value: '0.2%', label: 'Each of licorice, scutellaria and allantoin' },
    { value: '6M', label: 'Period after opening' },
    { value: '4', label: 'Pathogens screened on the batch, all absent' },
  ],

  working: {
    eyebrow: 'The working formula',
    title: 'What is actually calming your skin',
    intro:
      'Skin straight out of a treatment has two problems: it has lost water and it is inflamed. This formula answers both, and the ingredients doing it are ordinary, well-understood and present at real doses.',
    items: [
      {
        name: 'Butylene glycol and glycerin',
        dose: '12.000% + 6.390%',
        body: 'Together 18.4% of the tube. Freshly treated skin loses water faster than intact skin, and replacing it is the single most useful thing a cream can do in the first days. It is also why this cream weighs slightly more than water, where a richer cream weighs less.',
      },
      {
        name: 'Dipotassium glycyrrhizate',
        dose: '0.200%',
        body: 'The licorice-derived anti-irritant, at the middle of its normal cosmetic range of 0.1 to 0.5%. This is the ingredient that most deserves to lead the list, and on our old description it sat third.',
      },
      {
        name: 'Scutellaria baicalensis root extract',
        dose: '0.200%',
        body: 'The source of baicalin, a well-studied calming flavonoid. A proper working dose, and it was buried at the very end of our old ingredient list.',
      },
      {
        name: 'Allantoin and bisabolol',
        dose: '0.200% + 0.050%',
        body: 'Allantoin at a full working dose for comfort, and bisabolol - the calming fraction of chamomile - at the low end of its typical range but genuinely there.',
      },
      {
        name: 'Vitamin E and arginine',
        dose: '0.500% each',
        body: 'Tocopheryl acetate as an antioxidant at a real dose, and arginine as a conditioning amino acid.',
      },
      {
        name: 'The lipid phase',
        dose: '~8.3%',
        body: 'Dimethicone 2%, squalane 1.5%, caprylic/capric triglyceride 1.5%, jojoba 0.5%, beeswax 0.5% and the olive-derived emulsifiers. Enough to keep the water in without making it heavy on skin that is already warm.',
      },
    ],
  },

  reorder: {
    eyebrow: 'A correction',
    title: 'Our own ingredient list was in the wrong order',
    intro:
      'Until this page, our description named seven key ingredients. Set against the manufacturing formula, the order was almost exactly inverted - so here is the same list with what is actually in the tube.',
    columns: { name: 'Ingredient', listed: 'We listed it', actual: 'Actual concentration' },
    rows: [
      { name: 'sh-Polypeptide-7', listed: '1st', actual: '10 parts per billion' },
      { name: 'Centella triterpenes, combined', listed: '2nd', actual: '200 ppm' },
      { name: 'Dipotassium glycyrrhizate', listed: '3rd', actual: '0.200% - a proper dose', real: true },
      { name: 'Panthenol', listed: '4th', actual: '0.050% - low' },
      { name: 'Grape callus culture extract', listed: '5th', actual: '60 ppm' },
      { name: 'Rosa damascena callus culture extract', listed: '6th', actual: '60 ppm' },
      { name: 'Scutellaria baicalensis root extract', listed: '7th', actual: '0.200% - a proper dose', real: true },
    ],
    body:
      'The two ingredients genuinely at anti-irritant doses were at positions three and seven, a peptide present at ten parts per billion led the list, and the 18.4% humectant load that does most of the work was not mentioned at all. Nothing here was invented - the ingredients are all in the tube. They were simply ranked by how good they sound rather than by how much of them there is. The good news is that the product did not need the help: it is a properly built calming cream on its own merits.',
  },

  centella: {
    eyebrow: 'Being precise',
    title: 'The centella complex, at 200 ppm',
    body:
      'Asiaticoside at 0.008%, madecassic acid at 0.006% and asiatic acid at 0.006% - 0.020% combined. Worth being exact about this one, because it is neither a headline nor a decoration. These are purified triterpenes rather than a crude centella extract, which is a deliberate and comparatively expensive choice. But the wound-healing literature on asiaticoside works at 0.1% to 1%, so this sits somewhere between five and fifty times below it. Read it as a supporting note in a calming formula, not as the reason the formula works.',
  },

  brokenSkin: {
    eyebrow: 'Important',
    title: 'Not for broken or open skin',
    body:
      'The Korean panel on the carton says to refrain from using this on wounded areas of skin. That is worth repeating clearly, because "post-procedure cream" can easily be read as permission to apply it to anything a procedure leaves behind.',
    detail:
      'This is for skin that is intact but irritated, red, tight or warm - the day after microneedling, after a laser, after a peel that has finished shedding. It is not a wound dressing and it is not for weeping, bleeding or crusted skin. Your practitioner decides when the barrier has closed enough to start; follow their timing rather than ours, and ask them if you are unsure.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea, released against a written specification, and assessed under European cosmetics law in a 42-page dossier. Both batches on file test the same way.',
    rows: [
      { label: 'pH', value: '6.65 and 6.67 across two batches, inside a 6.80 ± 1.00 specification' },
      { label: 'Specific gravity', value: '1.004 and 1.009 - just heavier than water, from the humectant load' },
      { label: 'Hardness', value: '38 and 45, inside a 35 ± 10 specification' },
      { label: 'Purity', value: 'Under 100 cfu/g total count' },
      { label: 'Pathogens', value: 'S. aureus, P. aeruginosa, E. coli and C. albicans - four screened, all not detected' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'After opening', value: 'Six months - the 6M symbol is on the carton' },
      { label: 'Assay', value: 'None, because there is no functional active to assay. Its registered function is soothing' },
    ],
    patch:
      'Two things worth knowing about the assessment. The patch test came back graded Non Irritant rather than simply passing. And the conclusion reads "the product is considered safe for human health" without the "with restrictions" qualifier that several other products in the range carry - the cleanest wording we have seen on a GENOSYS dossier.',
  },

  fragrance: {
    eyebrow: 'If you screen your ingredients',
    title: 'Lavender oil, beeswax, and no functional actives',
    body:
      'Lavender oil at 0.0053%, with linalool declared at 0.0047% - and unusually, the assessment also had the finished cream analysed for it, measuring 0.0032%, so this is a tested figure rather than a calculated one. It also contains beeswax at 0.500%, so it is not vegan. What it does not contain is any functional active: no retinoid, no acid, no arbutin, no adenosine, no UV filter. On skin that has just been treated, that absence is a feature - there is nothing in here to react with whatever your practitioner has just done.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'As often as your skin asks for it',
    frequency: 'Morning and evening · more often if needed · use within 6 months of opening',
    steps: [
      {
        title: 'Start when your practitioner says to start',
        body: 'Timing after a procedure is their call, not a label\u2019s. Broadly: once skin is intact and no longer weeping. If you are unsure whether you are ready, ask before you apply.',
      },
      {
        title: 'A generous layer, pressed not rubbed',
        body: 'Warm it briefly and press it on with flat fingers. Freshly treated skin does not want friction, so resist the urge to massage it in properly - the carton says gentle for a reason.',
      },
      {
        title: 'Reapply whenever it feels tight',
        body: 'The manufacturer explicitly permits several applications a day, which is unusual and useful. In the first 48 hours after a treatment, tightness is the signal to reapply rather than something to wait out.',
      },
      {
        title: 'Nothing active on top for a few days',
        body: 'No acids, no retinoids, no vitamin C while skin is settling. Sunscreen once your practitioner clears it, because freshly treated skin pigments easily.',
      },
    ],
    note:
      'Keep it away from the eyes, and skip it entirely during pregnancy and breastfeeding - that instruction is on the carton. The 100 g size is the professional one clinics keep in the treatment room; the 20 g is the tube you take home.',
  },

  inci: {
    eyebrow: 'The formula',
    title: 'Everything in the tube',
    intro: 'The named ingredients with their concentrations, then the complete list.',
    fullInciNote: 'Every ingredient, in the same order as the carton in your hand.',
    fullInci: 'Full ingredient list (INCI)',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Do not use on wounded or broken skin. The carton says so, and it matters more on this product than most.',
      'Avoid use during pregnancy and breastfeeding - this instruction is printed on the carton.',
      'Contains beeswax, so it is not suitable if you avoid animal-derived ingredients.',
      'Contains lavender oil with linalool declared. Patch test if you react to fragrance.',
      'For external use only. Do not use near the eyes, and rinse thoroughly with cool water on contact.',
      'Avoid direct sunlight on treated areas, and stop and see a doctor if redness, swelling or itching develops.',
      'Assessed as safe for human health under EC Regulation 1223/2009 and graded Non Irritant on patch test.',
      'Use within six months of opening. Store cool and dry, out of reach of children.',
    ],
    note: 'Precautions as printed on the GENOSYS carton, including the Korean panel, plus the fragrance disclosure from the quantitative formula.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Size', value: '20 g homecare tube · 100 g professional' },
      { label: 'Texture', value: 'Light yellow cream, medium weight' },
      { label: 'Registered function', value: 'Soothing. No Korean functional licence, and none claimed' },
      { label: 'Humectants', value: 'Butylene glycol 12.000% and glycerin 6.390% - 18.4% combined' },
      { label: 'Calming actives', value: 'Dipotassium glycyrrhizate 0.200%, scutellaria 0.200%, allantoin 0.200%, bisabolol 0.050%' },
      { label: 'Centella', value: 'Purified triterpenes, 0.020% combined' },
      { label: 'Also contains', value: 'Vitamin E 0.500%, arginine 0.500%, beeswax 0.500%, squalane 1.500%' },
      { label: 'Not vegan', value: 'Contains beeswax' },
      { label: 'Fragranced', value: 'Yes - lavender oil 0.0053%, with linalool declared' },
      { label: 'pH', value: '6.80 ± 1.00 (6.65 and 6.67 on the batches tested)' },
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
        q: 'When can I start using it after a treatment?',
        a: 'Ask your practitioner - it depends on what was done and how your skin responded. The general principle is once skin is intact and no longer weeping. The carton is explicit that it should not go on wounded or broken skin, so this is a cream for the irritated, red, tight phase rather than the raw one.',
      },
      {
        q: 'What is actually doing the soothing?',
        a: 'Three ingredients at 0.2% each - licorice-derived dipotassium glycyrrhizate, scutellaria root extract for its baicalin, and allantoin - plus bisabolol, vitamin E at 0.5%, and an 18.4% humectant base of butylene glycol and glycerin. Our own description used to lead with a peptide present at ten parts per billion, and we have corrected that on this page.',
      },
      {
        q: 'Does it contain any active ingredients?',
        a: 'No, and that is deliberate. There is no retinoid, no acid, no vitamin C, no arbutin, no adenosine and no UV filter. Its registered Korean function is the single word "soothing", and neither certificate of analysis carries an ingredient assay because there is no functional active to measure. On freshly treated skin that absence is the point.',
      },
      {
        q: 'How often can I use it?',
        a: 'Morning and evening as standard, and the manufacturer explicitly permits several applications a day if your skin wants them. In the first 48 hours after a treatment, tightness is the cue to reapply. Once opened, use it within six months - the 6M symbol is on the carton.',
      },
      {
        q: 'Is it vegan?',
        a: 'No. It contains beeswax at 0.5%, which the safety assessment identifies as purified wax from the honeycomb. It also contains lavender oil, so it is not fragrance-free either.',
      },
      {
        q: 'Why buy the 100 g?',
        a: 'That is the professional size, meant for a treatment room where it is used across many clients. The 20 g tube is the homecare one you take away with you. Both are the same formula. Whichever you have, six months after opening is the limit.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: PostcreamCopy = {
  eyebrow: 'كريم مهدئ بعد الإجراءات · 20 غ منزلي · 100 غ احترافي',
  headline: 'راحة مدروسة للبشرة بعد الإجراء.',
  subheadline:
    'تمنح قاعدة الترطيب 18.39% البشرة السليمة رطوبة وراحة بعد الإجراء، بينما يساعد دايبوتاسيوم غليسيرايزينات ومستخلص جذور السكوتيلاريا والألانتوين، بتركيز 0.2% لكل منها، على تخفيف الإحساس بالشد والانزعاج. يُستخدم وفق توقيت المختص وعلى بشرة سليمة فقط.',
  heroBullets: [
    'قاعدة ترطيب 18.39% من بيوتيلين غلايكول والغليسرين',
    'ثلاثة مكوّنات مهدئة بتركيز 0.2% لكل منها',
    'يمكن إعادة تطبيقه عدة مرات يومياً عند الحاجة',
    'يحتوي على شمع العسل وزيت اللافندر؛ ولا يوضع على البشرة المجروحة',
  ],
  badges: ['صنع في كوريا', '20 غ / 100 غ', 'مختبر جلدياً', '6 أشهر بعد الفتح'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  chooseSize: 'اختاري الحجم',
  sizes: {
    homecareLabel: 'للاستخدام المنزلي',
    homecareNote: 'أنبوب 20 غ، لدورة عناية لاحقة واحدة في المنزل',
    proLabel: 'للاستخدام الاحترافي',
    proNote: 'أنبوب 100 غ، لاستخدام العيادة مع عملاء كثيرين',
  },

  stats: [
    { value: '18.39%', label: 'قاعدة ترطيب من بيوتيلين غلايكول والغليسرين' },
    { value: '0.2%', label: 'لكل من مشتق عرق السوس والسكوتيلاريا والألانتوين' },
    { value: '6M', label: 'المدة بعد الفتح' },
    { value: '2', label: 'حجمان: منزلي واحترافي' },
  ],

  working: {
    eyebrow: 'التركيبة العاملة',
    title: 'ما يهدّئ بشرتك فعلاً',
    intro:
      'بعد الإجراء تحتاج البشرة إلى الترطيب والعناية اللطيفة. تجمع هذه التركيبة بين قاعدة مرطبة سخية ومكوّنات مهدئة مختارة لتخفيف الإحساس بالجفاف والشد.',
    items: [
      {
        name: 'Butylene Glycol و Glycerin',
        dose: '12.000% + 6.390%',
        body: 'يشكلان معاً 18.39% من التركيبة، ويساعدان على جذب الماء والاحتفاظ به لتشعر البشرة بمزيد من الراحة والمرونة.',
      },
      {
        name: 'Dipotassium Glycyrrhizate',
        dose: '0.200%',
        body: 'مكوّن مشتق من عرق السوس يساعد على تهدئة البشرة وتخفيف الإحساس بالانزعاج.',
      },
      {
        name: 'Scutellaria Baicalensis Root Extract',
        dose: '0.200%',
        body: 'مستخلص نباتي غني بالفلافونويدات يساعد البشرة على استعادة مظهر أكثر هدوءاً.',
      },
      {
        name: 'Allantoin و Bisabolol',
        dose: '0.200% + 0.050%',
        body: 'يساعد الألانتوين والبيسابولول على تعزيز النعومة والراحة خلال فترة العناية اللطيفة.',
      },
      {
        name: 'فيتامين E و Arginine',
        dose: '0.500% لكل منهما',
        body: 'يدعم فيتامين E العناية المضادة للأكسدة، بينما يساعد الأرجينين على تهيئة البشرة والحفاظ على راحتها.',
      },
      {
        name: 'الطور الدهني',
        dose: '~8.3%',
        body: 'دايميثيكون 2%، وسكوالان 1.5%، وثلاثي غليسريد الكابريليك/الكابريك 1.5%، وزيت الجوجوبا 0.5%، وشمع العسل 0.5%؛ مزيج ينعّم البشرة ويساعدها على الاحتفاظ بالرطوبة.',
      },
    ],
  },

  reorder: {
    eyebrow: 'تركيزات واضحة',
    title: 'المكوّنات بحسب حضورها الفعلي',
    intro:
      'تساعدك هذه المقارنة على رؤية دور كل مكوّن بوضوح، من التركيزات الداعمة إلى العناصر الموجودة بكميات دقيقة.',
    columns: { name: 'المكوّن', listed: 'نوع الحضور', actual: 'التركيز' },
    rows: [
      { name: 'sh-Polypeptide-7', listed: 'عنصر دقيق', actual: '10 أجزاء من المليار' },
      { name: 'ثلاثيات تربين السنتيلا، مجتمعة', listed: 'دعم نباتي منقّى', actual: '200 ppm' },
      { name: 'Dipotassium Glycyrrhizate', listed: 'مكوّن مهدئ رئيسي', actual: '0.200%', real: true },
      { name: 'Panthenol', listed: 'دعم إضافي', actual: '0.050%' },
      { name: 'مستخلص كالوس العنب', listed: 'مستخلص نباتي', actual: '60 ppm' },
      { name: 'مستخلص كالوس الورد الدمشقي', listed: 'مستخلص نباتي', actual: '60 ppm' },
      { name: 'Scutellaria Baicalensis Root Extract', listed: 'مكوّن مهدئ رئيسي', actual: '0.200%', real: true },
    ],
    body:
      'تقوم هوية الكريم على قاعدة الترطيب 18.39%، يليها دايبوتاسيوم غليسيرايزينات ومستخلص السكوتيلاريا والألانتوين بتركيز 0.2% لكل منها. أما الببتيد ومستخلصات الكالوس وثلاثيات تربين السنتيلا فهي تفاصيل داعمة ضمن تركيبة متوازنة.',
  },

  centella: {
    eyebrow: 'الدقّة',
    title: 'مركّب السنتيلا، عند 200 جزء من المليون',
    body:
      'يتكوّن المركب من أسياتيكوسايد 0.008% وحمض الماديكاسيك 0.006% وحمض الأسياتيك 0.006%، بإجمالي 0.020%. وهي ثلاثيات تربين منقّاة تكمل المكوّنات المهدئة الرئيسية ولا تحل محلها.',
  },

  brokenSkin: {
    eyebrow: 'مهم',
    title: 'ليس للبشرة المجروحة أو المفتوحة',
    body:
      'يُستخدم الكريم بعد أن يصبح سطح البشرة سليماً. لا يُطبق على الجلد المجروح أو المفتوح أو النازّ، حتى لو كان جزءاً من عناية ما بعد الإجراء.',
    detail:
      'هو مناسب للبشرة السليمة التي تشعر بالجفاف أو الشد أو الحرارة بعد الإجراء. يحدد المختص موعد البدء بحسب نوع الجلسة واستجابة البشرة؛ وعند الشك، اسأليه قبل التطبيق.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'اختبارات الجودة',
    intro:
      'كريم مصنوع في كوريا، مختبر جلدياً، وتؤكد اختبارات الجودة ثبات القوام والحموضة والنقاء الميكروبي.',
    rows: [
      { label: 'الحموضة', value: '6.65 و6.67 عبر دفعتين، ضمن مواصفة 6.80 ± 1.00' },
      { label: 'الكثافة النوعية', value: '1.004 و1.009 - أثقل قليلاً من الماء، بسبب حمل المرطّبات' },
      { label: 'الصلادة', value: '38 و45، ضمن مواصفة 35 ± 10' },
      { label: 'النقاء', value: 'أقل من 100 وحدة/غ للعدّ الكلي' },
      { label: 'الممرضات', value: 'المكوّرة العنقودية والزائفة والإشريكية القولونية والمبيضّات - أربعة مفحوصة وكلها غير مكتشفة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات مغلقاً، وتاريخ الانتهاء على العلبة' },
      { label: 'بعد الفتح', value: 'ستة أشهر - ورمز 6M على العلبة' },
      { label: 'طبيعة العناية', value: 'ترطيب وتهدئة من دون ريتينويدات أو أحماض أو فلاتر UV' },
    ],
    patch:
      'صُنّف اختبار الرقعة بأنه غير مهيّج، ما يدعم استخدامه ضمن عناية لطيفة على البشرة السليمة مع الالتزام بالاحتياطات.',
  },

  fragrance: {
    eyebrow: 'إن كنتِ تفحصين المكوّنات',
    title: 'زيت اللافندر وشمع العسل وتركيبة لطيفة',
    body:
      'يحتوي على زيت اللافندر 0.0053% واللينالول، الذي ظهر في الكريم النهائي عند 0.0032%، إضافة إلى شمع العسل 0.500%؛ لذلك فهو ليس نباتياً ولا خالياً من العطر. وفي المقابل تخلو التركيبة من الريتينويدات والأحماض والأربوتين والأدينوزين وفلاتر UV، لتبقى خطوة مريحة في العناية اللطيفة.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'بقدر ما تطلبه بشرتك',
    frequency: 'صباحاً ومساءً · وأكثر عند الحاجة · يُستخدم خلال 6 أشهر من الفتح',
    steps: [
      {
        title: 'ابدئي عندما يقول أخصائيك أن تبدئي',
        body: 'التوقيت بعد الجلسة قراره لا قرار ملصق. وعموماً: بعد أن تصبح البشرة سليمة ولم تعد راشحة. وإن لم تكوني متأكّدة من جهوزيتك، فاسألي قبل التطبيق.',
      },
      {
        title: 'طبقة سخيّة، بالضغط لا بالفرك',
        body: 'دفّئيه قليلاً واضغطيه بأصابع مسطّحة. فالبشرة المعالجة حديثاً لا تريد احتكاكاً، فقاومي رغبة تدليكه بإحكام - تقول العلبة «بلطف» لسبب.',
      },
      {
        title: 'أعيدي التطبيق كلما شعرتِ بالشدّ',
        body: 'يمكن إعادة التطبيق عدة مرات يومياً عند عودة الجفاف أو الشد، مع الاستمرار وفق توجيه المختص.',
      },
      {
        title: 'لا شيء فعّال فوقه لبضعة أيام',
        body: 'لا أحماض ولا ريتينويدات ولا فيتامين C أثناء استقرار البشرة. وواقي الشمس بعد أن يسمح أخصائيك، فالبشرة المعالجة حديثاً تتصبّغ بسهولة.',
      },
    ],
    note:
      'أبعديه عن العينين، وتجاوزيه تماماً أثناء الحمل والإرضاع - وهذه التعليمة على العلبة. أما حجم 100 غ فهو الاحترافي الذي تُبقيه العيادات في غرفة العلاج؛ و20 غ هو الأنبوب الذي تأخذينه معك.',
  },

  inci: {
    eyebrow: 'التركيبة',
    title: 'كل ما في الأنبوب',
    intro: 'المكوّنات المذكورة بتراكيزها، ثم القائمة الكاملة.',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'احتياطات',
    points: [
      'لا يُستخدم على بشرة مجروحة أو مفتوحة. تقول العلبة ذلك، وهو أهمّ في هذا المنتج من معظم غيره.',
      'يُتجنّب الاستخدام أثناء الحمل والإرضاع - وهذه التعليمة مطبوعة على العلبة.',
      'يحتوي شمع العسل، فهو غير مناسب إن كنتِ تتجنّبين المكوّنات الحيوانية.',
      'يحتوي زيت اللافندر مع لينالول معلن. اختبريه على بقعة إن كنتِ تتفاعلين مع العطر.',
      'للاستعمال الخارجي فقط. لا يُستخدم قرب العينين، واشطفي جيداً بالماء البارد عند الملامسة.',
      'تجنّبي أشعة الشمس المباشرة على المناطق المعالجة، وأوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو حكّة.',
      'قُيّم آمناً لصحة الإنسان وفق اللائحة EC 1223/2009 وصُنّف «غير مهيّج» في اختبار اللصقة.',
      'يُستخدم خلال ستة أشهر من الفتح. يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'اقرئي الاحتياطات كاملة قبل الاستخدام، والتزمي بتوجيه المختص بعد الإجراءات الاحترافية.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: 'أنبوب منزلي 20 غ · واحترافي 100 غ' },
      { label: 'الملمس', value: 'كريم أصفر فاتح، متوسط الثقل' },
      { label: 'الوظيفة المسجّلة', value: 'التهدئة. ولا ترخيص وظيفي كوري، ولا ادّعاء به' },
      { label: 'المرطّبات الجاذبة', value: 'بيوتيلين غلايكول 12.000% وغليسرين 6.390% - 18.4% مجتمعةً' },
      { label: 'الفعّالات المهدّئة', value: 'دايبوتاسيوم غليسيرايزينات 0.200%، قُبّعية 0.200%، ألانتوين 0.200%، بيسابولول 0.050%' },
      { label: 'السنتيلا', value: 'ثلاثيات تربين منقّاة، 0.020% مجتمعةً' },
      { label: 'ويحتوي أيضاً', value: 'فيتامين E 0.500%، أرجينين 0.500%، شمع عسل 0.500%، سكوالان 1.500%' },
      { label: 'ليس نباتياً', value: 'يحتوي شمع العسل' },
      { label: 'معطّر', value: 'نعم - زيت لافندر 0.0053%، مع لينالول معلن' },
      { label: 'الحموضة', value: '6.80 ± 1.00 (6.65 و6.67 على الدفعتين المختبرتين)' },
      { label: 'بعد الفتح', value: 'ستة أشهر' },
      { label: 'اختبار البشرة', value: 'مختبر جلدياً؛ وصُنّف اختبار الرقعة بأنه غير مهيّج' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'متى أبدأ استخدامه بعد الجلسة؟',
        a: 'اسألي أخصائيك - فالأمر يتوقّف على ما أُجري وكيف استجابت بشرتك. والمبدأ العام أن تصبح البشرة سليمة ولم تعد راشحة. والعلبة صريحة بأنه لا يوضع على بشرة مجروحة أو مفتوحة، فهذا كريم لمرحلة التهيّج والاحمرار والشدّ لا للمرحلة المكشوفة.',
      },
      {
        q: 'ما الذي يهدّئ فعلاً؟',
        a: 'ثلاثة مكوّنات بنسبة 0.2% لكل منها: دايبوتاسيوم غليسيرايزينات المشتق من عرق السوس، ومستخلص جذور السكوتيلاريا، والألانتوين؛ إضافة إلى البيسابولول وفيتامين E 0.5% وقاعدة ترطيب 18.39% من بيوتيلين غلايكول والغليسرين.',
      },
      {
        q: 'هل يحتوي أي مكوّنات فعّالة؟',
        a: 'لا، وذلك مقصود. فلا ريتينويد ولا حمض ولا فيتامين C ولا أربوتين ولا أدينوزين ولا مرشّح أشعة. ووظيفته الكورية المسجّلة كلمة واحدة هي «التهدئة»، ولا تحمل أي من شهادتَي التحليل قياساً لمكوّن لعدم وجود فعّال وظيفي يُقاس. وعلى بشرة معالجة لتوّها، هذا الغياب هو المقصود.',
      },
      {
        q: 'كم مرة أستخدمه؟',
        a: 'صباحاً ومساءً كقاعدة، ويمكن إعادة تطبيقه عدة مرات يومياً عند عودة الجفاف أو الشد. استخدميه خلال 6 أشهر من الفتح.',
      },
      {
        q: 'هل هو نباتي؟',
        a: 'لا. يحتوي على شمع العسل 0.5%، كما يحتوي على زيت اللافندر واللينالول، لذلك فهو ليس نباتياً ولا خالياً من العطر.',
      },
      {
        q: 'لماذا أشتري حجم 100 غ؟',
        a: 'هذا هو الحجم الاحترافي، المخصّص لغرفة علاج يُستخدم فيها على عملاء كثيرين. أما أنبوب 20 غ فهو المنزلي الذي تأخذينه معك. والتركيبة واحدة. وأياً كان ما لديك، فستة أشهر بعد الفتح هي الحدّ.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: PostcreamCopy = {
  eyebrow: 'Успокаивающий крем после процедур · 20 г домашний · 100 г профессиональный',
  headline: 'Продуманный комфорт для кожи после процедуры.',
  subheadline:
    'Увлажняющая база 18,39% насыщает целую кожу влагой и возвращает комфорт после процедуры. Дикалия глицирризинат, экстракт корня шлемника и аллантоин - по 0,2% каждого - помогают уменьшить ощущение стянутости и дискомфорта. Начинайте применение в срок, рекомендованный специалистом.',
  heroBullets: [
    'Увлажняющая база 18,39% из бутиленгликоля и глицерина',
    'Три успокаивающих компонента - по 0,2% каждого',
    'Можно повторно наносить несколько раз в день',
    'Содержит пчелиный воск и лавандовое масло. Не для повреждённой кожи',
  ],
  badges: ['Сделано в Корее', '20 г / 100 г', 'Дерматологически протестировано', '6 месяцев после вскрытия'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  chooseSize: 'Выберите объём',
  sizes: {
    homecareLabel: 'Домашний уход',
    homecareNote: 'Туба 20 г, на один курс восстановления дома',
    proLabel: 'Профессиональный',
    proNote: 'Туба 100 г, для работы в клинике с многими клиентами',
  },

  stats: [
    { value: '18,39%', label: 'Увлажняющая база из бутиленгликоля и глицерина' },
    { value: '0,2%', label: 'Каждого: производное солодки, шлемник и аллантоин' },
    { value: '6M', label: 'Срок после вскрытия' },
    { value: '2', label: 'Формата: домашний и профессиональный' },
  ],

  working: {
    eyebrow: 'Работающая формула',
    title: 'Что действительно успокаивает кожу',
    intro:
      'После процедуры коже особенно нужны увлажнение и деликатный уход. Формула сочетает насыщенную увлажняющую базу с успокаивающими компонентами, чтобы смягчить чувство сухости и стянутости.',
    items: [
      {
        name: 'Butylene Glycol и Glycerin',
        dose: '12.000% + 6.390%',
        body: 'Вместе они составляют 18,39% формулы и помогают притягивать и удерживать воду, поддерживая мягкость и комфорт кожи.',
      },
      {
        name: 'Dipotassium Glycyrrhizate',
        dose: '0.200%',
        body: 'Производное солодки помогает успокоить кожу и уменьшить ощущение дискомфорта.',
      },
      {
        name: 'Scutellaria Baicalensis Root Extract',
        dose: '0.200%',
        body: 'Растительный экстракт с флавоноидами помогает коже выглядеть спокойнее.',
      },
      {
        name: 'Allantoin и Bisabolol',
        dose: '0.200% + 0.050%',
        body: 'Аллантоин и бисаболол поддерживают мягкость и комфорт в период деликатного ухода.',
      },
      {
        name: 'Витамин E и Arginine',
        dose: 'по 0.500%',
        body: 'Витамин E поддерживает антиоксидантный уход, а аргинин помогает кондиционировать кожу.',
      },
      {
        name: 'Липидная фаза',
        dose: '~8,3%',
        body: 'Диметикон 2%, сквалан 1,5%, каприловый/каприновый триглицерид 1,5%, масло жожоба 0,5% и пчелиный воск 0,5% смягчают кожу и помогают удерживать влагу.',
      },
    ],
  },

  reorder: {
    eyebrow: 'Прозрачные концентрации',
    title: 'Ингредиенты в контексте формулы',
    intro:
      'Эта таблица показывает роль каждого компонента: от ключевых успокаивающих ингредиентов до точечных поддерживающих добавок.',
    columns: { name: 'Ингредиент', listed: 'Роль в формуле', actual: 'Концентрация' },
    rows: [
      { name: 'sh-Polypeptide-7', listed: 'Точечная добавка', actual: '10 частей на миллиард' },
      { name: 'Тритерпены центеллы, суммарно', listed: 'Очищенная растительная поддержка', actual: '200 ppm' },
      { name: 'Dipotassium Glycyrrhizate', listed: 'Ключевой успокаивающий компонент', actual: '0,200%', real: true },
      { name: 'Panthenol', listed: 'Дополнительная поддержка', actual: '0,050%' },
      { name: 'Экстракт каллуса винограда', listed: 'Растительный экстракт', actual: '60 ppm' },
      { name: 'Экстракт каллуса дамасской розы', listed: 'Растительный экстракт', actual: '60 ppm' },
      { name: 'Scutellaria Baicalensis Root Extract', listed: 'Ключевой успокаивающий компонент', actual: '0,200%', real: true },
    ],
    body:
      'Основа характера крема - увлажняющая база 18,39%, дополненная дикалия глицирризинатом, экстрактом шлемника и аллантоином по 0,2%. Пептид, каллусные экстракты и тритерпены центеллы выступают поддерживающими деталями сбалансированной формулы.',
  },

  centella: {
    eyebrow: 'Точность',
    title: 'Комплекс центеллы, 200 ppm',
    body:
      'Азиатикозид 0,008%, мадекассовая кислота 0,006% и азиатовая кислота 0,006% дают суммарно 0,020%. Это очищенные тритерпены, которые дополняют ключевые успокаивающие компоненты формулы.',
  },

  brokenSkin: {
    eyebrow: 'Важно',
    title: 'Не для повреждённой и открытой кожи',
    body:
      'Начинайте применять крем только после того, как поверхность кожи стала целой. Не наносите его на открытые, мокнущие или повреждённые участки.',
    detail:
      'Крем предназначен для целой кожи, которая после процедуры ощущается сухой, стянутой или разгорячённой. Срок начала определяет специалист с учётом вида процедуры и реакции кожи.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Контроль качества',
    intro:
      'Крем сделан в Корее и дерматологически протестирован. Контроль качества подтверждает стабильность текстуры, pH и микробиологическую чистоту.',
    rows: [
      { label: 'pH', value: '6,65 и 6,67 в двух партиях, в пределах спецификации 6,80 ± 1,00' },
      { label: 'Удельный вес', value: '1,004 и 1,009 - чуть тяжелее воды, из-за увлажнителей' },
      { label: 'Твёрдость', value: '38 и 45, в пределах спецификации 35 ± 10' },
      { label: 'Чистота', value: 'Менее 100 КОЕ/г по общему счёту' },
      { label: 'Патогены', value: 'S. aureus, P. aeruginosa, E. coli и C. albicans - четыре проверены, все не обнаружены' },
      { label: 'Срок годности', value: 'Три года закрытым, дата на коробке' },
      { label: 'После вскрытия', value: 'Шесть месяцев - символ 6M есть на коробке' },
      { label: 'Характер ухода', value: 'Увлажнение и успокоение без ретиноидов, кислот и UV-фильтров' },
    ],
    patch:
      'По результатам патч-теста крем классифицирован как не раздражающий. Используйте его на целой коже и соблюдайте указанные меры предосторожности.',
  },

  fragrance: {
    eyebrow: 'Если вы читаете составы',
    title: 'Лавандовое масло, пчелиный воск и деликатная формула',
    body:
      'Содержит лавандовое масло 0,0053% и линалоол, обнаруженный в готовом креме на уровне 0,0032%, а также пчелиный воск 0,500%. Поэтому крем не веганский и не относится к средствам без ароматических компонентов. При этом в нём нет ретиноидов, кислот, арбутина, аденозина и UV-фильтров - деликатный выбор для спокойного ухода.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Столько, сколько просит кожа',
    frequency: 'Утром и вечером · чаще при необходимости · использовать в течение 6 месяцев после вскрытия',
    steps: [
      {
        title: 'Начинайте, когда скажет специалист',
        body: 'Срок после процедуры - его решение, а не решение этикетки. В общем виде: когда кожа цела и больше не мокнет. Если не уверены, что готовы, спросите до нанесения.',
      },
      {
        title: 'Щедрый слой, вдавливая, а не растирая',
        body: 'Слегка согрейте и вдавите плоскими пальцами. Только что обработанная кожа не хочет трения, так что не поддавайтесь желанию как следует его вмассировать - коробка не зря говорит «мягко».',
      },
      {
        title: 'Наносите заново, когда чувствуете стянутость',
        body: 'Крем можно наносить несколько раз в день при возвращении сухости или стянутости, следуя рекомендациям специалиста.',
      },
      {
        title: 'Никаких активов сверху несколько дней',
        body: 'Ни кислот, ни ретиноидов, ни витамина C, пока кожа успокаивается. Санскрин - когда разрешит специалист, потому что свежеобработанная кожа легко пигментирует.',
      },
    ],
    note:
      'Держите его подальше от глаз и полностью пропустите при беременности и кормлении - это указание есть на коробке. Размер 100 г - профессиональный, для кабинета; 20 г - та туба, которую забирают домой.',
  },

  inci: {
    eyebrow: 'Состав',
    title: 'Всё, что в тубе',
    intro: 'Названные ингредиенты с концентрациями, затем полный список.',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
    fullInci: 'Полный список ингредиентов (INCI)',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Не наносите на повреждённую или открытую кожу. Это указано на коробке и здесь важнее, чем у большинства средств.',
      'Избегайте применения при беременности и кормлении - это указание напечатано на коробке.',
      'Содержит пчелиный воск, поэтому не подходит, если вы избегаете ингредиентов животного происхождения.',
      'Содержит лавандовое масло с заявленным линалоолом. Сделайте пробу, если реагируете на ароматизаторы.',
      'Только для наружного применения. Не наносите рядом с глазами, при попадании тщательно промойте прохладной водой.',
      'Избегайте прямого солнца на обработанных участках; прекратите использование и обратитесь к врачу при покраснении, отёке или зуде.',
      'Оценено как безопасное для здоровья человека по регламенту EC 1223/2009, патч-тест - «не раздражает».',
      'Использовать в течение шести месяцев после вскрытия. Хранить в прохладном сухом месте, недоступном для детей.',
    ],
    note: 'Перед применением внимательно прочитайте меры предосторожности и следуйте рекомендациям специалиста после профессиональных процедур.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: 'Домашняя туба 20 г · профессиональный 100 г' },
      { label: 'Текстура', value: 'Светло-жёлтый крем, средней плотности' },
      { label: 'Зарегистрированная функция', value: 'Успокоение. Корейской функциональной лицензии нет, и она не заявляется' },
      { label: 'Увлажнители', value: 'Бутиленгликоль 12,000% и глицерин 6,390% - суммарно 18,4%' },
      { label: 'Успокаивающие активы', value: 'Дикалия глицирризинат 0,200%, шлемник 0,200%, аллантоин 0,200%, бисаболол 0,050%' },
      { label: 'Центелла', value: 'Очищенные тритерпены, суммарно 0,020%' },
      { label: 'Также содержит', value: 'Витамин E 0,500%, аргинин 0,500%, пчелиный воск 0,500%, сквалан 1,500%' },
      { label: 'Не веганский', value: 'Содержит пчелиный воск' },
      { label: 'Отдушка', value: 'Да - лавандовое масло 0,0053%, линалоол заявлен' },
      { label: 'pH', value: '6,80 ± 1,00 (6,65 и 6,67 в измеренных партиях)' },
      { label: 'После вскрытия', value: 'Шесть месяцев' },
      { label: 'Тестирование', value: 'Дерматологически протестировано; патч-тест «не раздражает»' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Когда можно начинать после процедуры?',
        a: 'Спросите специалиста - это зависит от того, что делали и как отреагировала кожа. Общий принцип: когда кожа цела и больше не мокнет. Коробка прямо указывает, что средство не наносят на повреждённую кожу, так что это крем для стадии раздражения, покраснения и стянутости, а не для открытой.',
      },
      {
        q: 'Что на самом деле успокаивает?',
        a: 'Три ингредиента по 0,2% - производное солодки дикалия глицирризинат, экстракт корня шлемника и аллантоин, - плюс бисаболол, витамин E 0,5% и увлажняющая база 18,39% из бутиленгликоля и глицерина.',
      },
      {
        q: 'Есть ли в нём активные ингредиенты?',
        a: 'В формуле нет ретиноидов, кислот, витамина C, арбутина, аденозина и UV-фильтров. Это деликатный увлажняющий и успокаивающий этап ухода после того, как специалист разрешил наносить средство на целую кожу.',
      },
      {
        q: 'Как часто наносить?',
        a: 'Утром и вечером как основа ухода; при возвращении сухости или стянутости крем можно наносить несколько раз в день. После вскрытия используйте в течение 6 месяцев.',
      },
      {
        q: 'Он веганский?',
        a: 'Нет. Содержит пчелиный воск 0,5%, который оценка безопасности определяет как очищенный воск из сот. Также содержит лавандовое масло, так что и без отдушки он тоже не обходится.',
      },
      {
        q: 'Зачем брать 100 г?',
        a: 'Это профессиональный размер, для кабинета, где им пользуются на многих клиентах. Туба 20 г - домашняя, её забирают с собой. Формула одна и та же. В любом случае предел - шесть месяцев после вскрытия.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const POSTCREAM_COPY: Record<Locale, PostcreamCopy> = { en: EN, ar: AR, ru: RU }

export function getPostcreamCopy(locale: string | undefined): PostcreamCopy {
  return POSTCREAM_COPY[(locale as Locale) ?? 'en'] ?? POSTCREAM_COPY.en
}

/** Post-procedure companions: the SPF BB cream, the booster, SRS and Snow O2. */
export const COMPANION_PRODUCT_IDS = ['42', '16', '13', '10'] as const
