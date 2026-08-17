/**
 * Bespoke copy for SOOTHING REPAIR POSTCREAM (product 25), the post-procedure
 * cream clinics hand a client after microneedling.
 *
 * SOURCING — every figure traces to the audit in
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
 * 0.200%, vitamin E at 0.500% and bisabolol — none of which our record led with.
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
     with every cart call — see PostcreamProductPage. */
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
    'Nearly a fifth of this tube is humectant — butylene glycol at 12% and glycerin at 6.4% — over licorice-derived dipotassium glycyrrhizate, baicalin-bearing scutellaria and allantoin, each at 0.2%. That combination is why skin that has just been needled or lasered settles down under it. Its registered function is one word: soothing.',
  heroBullets: [
    '18.4% humectants — the most useful thing for freshly treated skin',
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
    { value: '18.4%', label: 'Humectants — butylene glycol plus glycerin' },
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
        body: 'Allantoin at a full working dose for comfort, and bisabolol — the calming fraction of chamomile — at the low end of its typical range but genuinely there.',
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
      'Until this page, our description named seven key ingredients. Set against the manufacturing formula, the order was almost exactly inverted — so here is the same list with what is actually in the tube.',
    columns: { name: 'Ingredient', listed: 'We listed it', actual: 'Actual concentration' },
    rows: [
      { name: 'sh-Polypeptide-7', listed: '1st', actual: '10 parts per billion' },
      { name: 'Centella triterpenes, combined', listed: '2nd', actual: '200 ppm' },
      { name: 'Dipotassium glycyrrhizate', listed: '3rd', actual: '0.200% — a proper dose', real: true },
      { name: 'Panthenol', listed: '4th', actual: '0.050% — low' },
      { name: 'Grape callus culture extract', listed: '5th', actual: '60 ppm' },
      { name: 'Rosa damascena callus culture extract', listed: '6th', actual: '60 ppm' },
      { name: 'Scutellaria baicalensis root extract', listed: '7th', actual: '0.200% — a proper dose', real: true },
    ],
    body:
      'The two ingredients genuinely at anti-irritant doses were at positions three and seven, a peptide present at ten parts per billion led the list, and the 18.4% humectant load that does most of the work was not mentioned at all. Nothing here was invented — the ingredients are all in the tube. They were simply ranked by how good they sound rather than by how much of them there is. The good news is that the product did not need the help: it is a properly built calming cream on its own merits.',
  },

  centella: {
    eyebrow: 'Being precise',
    title: 'The centella complex, at 200 ppm',
    body:
      'Asiaticoside at 0.008%, madecassic acid at 0.006% and asiatic acid at 0.006% — 0.020% combined. Worth being exact about this one, because it is neither a headline nor a decoration. These are purified triterpenes rather than a crude centella extract, which is a deliberate and comparatively expensive choice. But the wound-healing literature on asiaticoside works at 0.1% to 1%, so this sits somewhere between five and fifty times below it. Read it as a supporting note in a calming formula, not as the reason the formula works.',
  },

  brokenSkin: {
    eyebrow: 'Important',
    title: 'Not for broken or open skin',
    body:
      'The Korean panel on the carton says to refrain from using this on wounded areas of skin. That is worth repeating clearly, because "post-procedure cream" can easily be read as permission to apply it to anything a procedure leaves behind.',
    detail:
      'This is for skin that is intact but irritated, red, tight or warm — the day after microneedling, after a laser, after a peel that has finished shedding. It is not a wound dressing and it is not for weeping, bleeding or crusted skin. Your practitioner decides when the barrier has closed enough to start; follow their timing rather than ours, and ask them if you are unsure.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What the certificate says',
    intro:
      'Made in Korea, released against a written specification, and assessed under European cosmetics law in a 42-page dossier. Both batches on file test the same way.',
    rows: [
      { label: 'pH', value: '6.65 and 6.67 across two batches, inside a 6.80 ± 1.00 specification' },
      { label: 'Specific gravity', value: '1.004 and 1.009 — just heavier than water, from the humectant load' },
      { label: 'Hardness', value: '38 and 45, inside a 35 ± 10 specification' },
      { label: 'Purity', value: 'Under 100 cfu/g total count' },
      { label: 'Pathogens', value: 'S. aureus, P. aeruginosa, E. coli and C. albicans — four screened, all not detected' },
      { label: 'Shelf life', value: 'Three years unopened, with the expiry date on the box' },
      { label: 'After opening', value: 'Six months — the 6M symbol is on the carton' },
      { label: 'Assay', value: 'None, because there is no functional active to assay. Its registered function is soothing' },
    ],
    patch:
      'Two things worth knowing about the assessment. The patch test came back graded Non Irritant rather than simply passing. And the conclusion reads "the product is considered safe for human health" without the "with restrictions" qualifier that several other products in the range carry — the cleanest wording we have seen on a GENOSYS dossier.',
  },

  fragrance: {
    eyebrow: 'If you screen your ingredients',
    title: 'Lavender oil, beeswax, and no functional actives',
    body:
      'Lavender oil at 0.0053%, with linalool declared at 0.0047% — and unusually, the assessment also had the finished cream analysed for it, measuring 0.0032%, so this is a tested figure rather than a calculated one. It also contains beeswax at 0.500%, so it is not vegan. What it does not contain is any functional active: no retinoid, no acid, no arbutin, no adenosine, no UV filter. On skin that has just been treated, that absence is a feature — there is nothing in here to react with whatever your practitioner has just done.',
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
        body: 'Warm it briefly and press it on with flat fingers. Freshly treated skin does not want friction, so resist the urge to massage it in properly — the carton says gentle for a reason.',
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
      'Keep it away from the eyes, and skip it entirely during pregnancy and breastfeeding — that instruction is on the carton. The 100 g size is the professional one clinics keep in the treatment room; the 20 g is the tube you take home.',
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
      'Avoid use during pregnancy and breastfeeding — this instruction is printed on the carton.',
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
      { label: 'Humectants', value: 'Butylene glycol 12.000% and glycerin 6.390% — 18.4% combined' },
      { label: 'Calming actives', value: 'Dipotassium glycyrrhizate 0.200%, scutellaria 0.200%, allantoin 0.200%, bisabolol 0.050%' },
      { label: 'Centella', value: 'Purified triterpenes, 0.020% combined' },
      { label: 'Also contains', value: 'Vitamin E 0.500%, arginine 0.500%, beeswax 0.500%, squalane 1.500%' },
      { label: 'Not vegan', value: 'Contains beeswax' },
      { label: 'Fragranced', value: 'Yes — lavender oil 0.0053%, with linalool declared' },
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
        a: 'Ask your practitioner — it depends on what was done and how your skin responded. The general principle is once skin is intact and no longer weeping. The carton is explicit that it should not go on wounded or broken skin, so this is a cream for the irritated, red, tight phase rather than the raw one.',
      },
      {
        q: 'What is actually doing the soothing?',
        a: 'Three ingredients at 0.2% each — licorice-derived dipotassium glycyrrhizate, scutellaria root extract for its baicalin, and allantoin — plus bisabolol, vitamin E at 0.5%, and an 18.4% humectant base of butylene glycol and glycerin. Our own description used to lead with a peptide present at ten parts per billion, and we have corrected that on this page.',
      },
      {
        q: 'Does it contain any active ingredients?',
        a: 'No, and that is deliberate. There is no retinoid, no acid, no vitamin C, no arbutin, no adenosine and no UV filter. Its registered Korean function is the single word "soothing", and neither certificate of analysis carries an ingredient assay because there is no functional active to measure. On freshly treated skin that absence is the point.',
      },
      {
        q: 'How often can I use it?',
        a: 'Morning and evening as standard, and the manufacturer explicitly permits several applications a day if your skin wants them. In the first 48 hours after a treatment, tightness is the cue to reapply. Once opened, use it within six months — the 6M symbol is on the carton.',
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
  eyebrow: 'كريم ما بعد الجلسات المهدّئ · 20 غ منزلي · 100 غ احترافي',
  headline: 'الكريم الذي يسلّمك إياه أخصائيك عند الخروج.',
  subheadline:
    'نحو خُمس هذا الأنبوب مرطّبات جاذبة — بيوتيلين غلايكول بنسبة 12% وغليسرين بنسبة 6.4% — فوق دايبوتاسيوم غليسيرايزينات المشتقّ من عرق السوس، والقُبّعية الحاملة للبايكالين، والألانتوين، كلٌّ بنسبة 0.2%. وهذه التركيبة هي سبب هدوء البشرة التي خرجت لتوّها من الإبر الدقيقة أو الليزر تحته. ووظيفته المسجّلة كلمة واحدة: التهدئة.',
  heroBullets: [
    '18.4% مرطّبات جاذبة — أنفع ما يمكن للبشرة المعالجة حديثاً',
    'عرق السوس والقُبّعية والألانتوين، ثلاثتها بنسبة 0.2% كاملة',
    'يمكن إعادة تطبيقه عدة مرات يومياً، بحسب الشركة',
    'يحتوي شمع العسل وزيت اللافندر. وليس للبشرة المجروحة',
  ],
  badges: ['صُنع في كوريا', '20 غ / 100 غ', 'تقييم سلامة أوروبي', 'مصنّف غير مهيّج'],

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
    { value: '18.4%', label: 'مرطّبات جاذبة — بيوتيلين غلايكول مع غليسرين' },
    { value: '0.2%', label: 'لكلٍّ من عرق السوس والقُبّعية والألانتوين' },
    { value: '6M', label: 'المدة بعد الفتح' },
    { value: '4', label: 'ممرضات مفحوصة على الدفعة، وكلها غائبة' },
  ],

  working: {
    eyebrow: 'التركيبة العاملة',
    title: 'ما يهدّئ بشرتك فعلاً',
    intro:
      'البشرة الخارجة من جلسة لديها مشكلتان: فقدت الماء وهي ملتهبة. وتجيب هذه التركيبة على الاثنتين، والمكوّنات التي تفعل ذلك عادية ومفهومة جيداً وموجودة بجرعات حقيقية.',
    items: [
      {
        name: 'Butylene Glycol و Glycerin',
        dose: '12.000% + 6.390%',
        body: 'معاً 18.4% من الأنبوب. فالبشرة المعالجة حديثاً تفقد الماء أسرع من البشرة السليمة، وتعويضه أنفع ما يمكن لكريم أن يفعله في الأيام الأولى. وهو أيضاً سبب كون هذا الكريم أثقل قليلاً من الماء، حيث يكون الكريم الأغنى أخفّ منه.',
      },
      {
        name: 'Dipotassium Glycyrrhizate',
        dose: '0.200%',
        body: 'مضادّ التهيّج المشتقّ من عرق السوس، في وسط نطاقه التجميلي المعتاد بين 0.1 و0.5%. وهو المكوّن الأحقّ بتصدّر القائمة، وقد جلس ثالثاً في وصفنا القديم.',
      },
      {
        name: 'Scutellaria Baicalensis Root Extract',
        dose: '0.200%',
        body: 'مصدر البايكالين، وهو فلافونويد مهدّئ مدروس جيداً. جرعة عاملة صحيحة، وقد كان مدفوناً في آخر قائمة مكوّناتنا القديمة.',
      },
      {
        name: 'Allantoin و Bisabolol',
        dose: '0.200% + 0.050%',
        body: 'الألانتوين بجرعة عاملة كاملة للراحة، والبيسابولول — الجزء المهدّئ من البابونج — في الطرف المنخفض من نطاقه المعتاد لكنه موجود فعلاً.',
      },
      {
        name: 'فيتامين E و Arginine',
        dose: '0.500% لكل منهما',
        body: 'التوكوفيريل أسيتات كمضادّ أكسدة بجرعة حقيقية، والأرجينين كحمض أميني مكيّف للبشرة.',
      },
      {
        name: 'الطور الدهني',
        dose: '~8.3%',
        body: 'دايميثيكون 2%، وسكوالان 1.5%، وثلاثي غليسريد الكابريليك/الكابريك 1.5%، وجوجوبا 0.5%، وشمع عسل 0.5%، والمُستحلِبات المشتقّة من الزيتون. ما يكفي لحفظ الماء دون أن يثقل بشرة دافئة أصلاً.',
      },
    ],
  },

  reorder: {
    eyebrow: 'تصحيح',
    title: 'قائمة مكوّناتنا نفسها كانت بترتيب خاطئ',
    intro:
      'حتى هذه الصفحة، كان وصفنا يسمّي سبعة مكوّنات رئيسية. وبمقابلتها بتركيبة التصنيع، كان الترتيب معكوساً تقريباً — فهذه هي القائمة نفسها مع ما في الأنبوب فعلاً.',
    columns: { name: 'المكوّن', listed: 'أدرجناه', actual: 'التركيز الفعلي' },
    rows: [
      { name: 'sh-Polypeptide-7', listed: 'الأول', actual: '10 أجزاء من المليار' },
      { name: 'ثلاثيات تربين السنتيلا، مجتمعة', listed: 'الثاني', actual: '200 ppm' },
      { name: 'Dipotassium Glycyrrhizate', listed: 'الثالث', actual: '0.200% — جرعة صحيحة', real: true },
      { name: 'Panthenol', listed: 'الرابع', actual: '0.050% — منخفض' },
      { name: 'مستخلص كالوس العنب', listed: 'الخامس', actual: '60 ppm' },
      { name: 'مستخلص كالوس الورد الدمشقي', listed: 'السادس', actual: '60 ppm' },
      { name: 'Scutellaria Baicalensis Root Extract', listed: 'السابع', actual: '0.200% — جرعة صحيحة', real: true },
    ],
    body:
      'المكوّنان الموجودان فعلاً بجرعات مضادّة للتهيّج كانا في الموضعين الثالث والسابع، وببتيد موجود بعشرة أجزاء من المليار تصدّر القائمة، وحمل المرطّبات البالغ 18.4% الذي يؤدّي معظم العمل لم يُذكر إطلاقاً. ولم يُختلق شيء هنا — فالمكوّنات كلها في الأنبوب. لكنها رُتّبت بحسب جمال وقعها لا بحسب كمّيتها. والخبر الجيد أن المنتج لم يكن بحاجة إلى تلك المساعدة: فهو كريم مهدّئ مبنيّ جيداً بجدارته وحده.',
  },

  centella: {
    eyebrow: 'الدقّة',
    title: 'مركّب السنتيلا، عند 200 جزء من المليون',
    body:
      'أسياتيكوسايد بنسبة 0.008%، وحمض المادِكاسيك بنسبة 0.006%، وحمض الأسياتيك بنسبة 0.006% — أي 0.020% مجتمعةً. ويستحق هذا الدقّة، فهو ليس عنواناً ولا زينة. فهذه ثلاثيات تربين منقّاة لا مستخلص سنتيلا خام، وهو خيار مقصود ومكلف نسبياً. لكن أدبيات شفاء الجروح حول الأسياتيكوسايد تعمل عند 0.1% إلى 1%، فهذا يقع بين خمسة وخمسين ضعفاً تحته. فاقرئيه كملاحظة مساندة في تركيبة مهدّئة، لا كسبب عمل التركيبة.',
  },

  brokenSkin: {
    eyebrow: 'مهم',
    title: 'ليس للبشرة المجروحة أو المفتوحة',
    body:
      'تقول اللوحة الكورية على العلبة إنه يُتجنّب استخدامه على مناطق الجلد المجروحة. ويستحق ذلك التكرار بوضوح، لأن عبارة «كريم ما بعد الجلسات» يمكن أن تُقرأ بسهولة كإذن بتطبيقه على أي شيء تتركه الجلسة.',
    detail:
      'هذا للبشرة السليمة لكن المتهيّجة أو المحمرّة أو المشدودة أو الدافئة — اليوم التالي للإبر الدقيقة، أو بعد الليزر، أو بعد تقشير أنهى تساقطه. وهو ليس ضماداً للجرح وليس للبشرة الراشحة أو الدامية أو المتقشّرة. وأخصائيك هو من يقرّر متى انغلق الحاجز بما يكفي للبدء؛ فاتبعي توقيته لا توقيتنا، واسأليه إن لم تكوني متأكّدة.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما تقوله الشهادة',
    intro:
      'صُنع في كوريا وأُفرج عنه مقابل مواصفة مكتوبة، وقُيّم وفق قانون مستحضرات التجميل الأوروبي في ملف من 42 صفحة. والدفعتان المتوفّرتان تُختبران بالنتائج نفسها.',
    rows: [
      { label: 'الحموضة', value: '6.65 و6.67 عبر دفعتين، ضمن مواصفة 6.80 ± 1.00' },
      { label: 'الكثافة النوعية', value: '1.004 و1.009 — أثقل قليلاً من الماء، بسبب حمل المرطّبات' },
      { label: 'الصلادة', value: '38 و45، ضمن مواصفة 35 ± 10' },
      { label: 'النقاء', value: 'أقل من 100 وحدة/غ للعدّ الكلي' },
      { label: 'الممرضات', value: 'المكوّرة العنقودية والزائفة والإشريكية القولونية والمبيضّات — أربعة مفحوصة وكلها غير مكتشفة' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات مغلقاً، وتاريخ الانتهاء على العلبة' },
      { label: 'بعد الفتح', value: 'ستة أشهر — ورمز 6M على العلبة' },
      { label: 'القياس', value: 'لا يوجد، لعدم وجود فعّال وظيفي يُقاس. فوظيفته المسجّلة هي التهدئة' },
    ],
    patch:
      'أمران يستحقّان المعرفة عن التقييم. اختبار اللصقة عاد مصنّفاً «غير مهيّج» لا مجرّد ناجح. والخلاصة تقول «يُعدّ المنتج آمناً لصحة الإنسان» بلا قيد «مع قيود» الذي تحمله عدة منتجات أخرى في المجموعة — وهي أنظف صيغة رأيناها في ملف جينوسيس.',
  },

  fragrance: {
    eyebrow: 'إن كنتِ تفحصين المكوّنات',
    title: 'زيت اللافندر وشمع العسل وبلا فعّالات وظيفية',
    body:
      'زيت اللافندر بنسبة 0.0053%، مع لينالول معلن بنسبة 0.0047% — وبصورة غير معتادة، حُلّل الكريم النهائي أيضاً في التقييم بحثاً عنه فقيس عند 0.0032%، فهذا رقم مختبَر لا محسوب. ويحتوي أيضاً شمع العسل بنسبة 0.500%، فهو ليس نباتياً. أما ما لا يحتويه فهو أي فعّال وظيفي: لا ريتينويد ولا حمض ولا أربوتين ولا أدينوزين ولا مرشّح أشعة. وعلى بشرة معالجة لتوّها، هذا الغياب ميزة — فلا شيء هنا يتفاعل مع ما فعله أخصائيك قبل قليل.',
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
        body: 'دفّئيه قليلاً واضغطيه بأصابع مسطّحة. فالبشرة المعالجة حديثاً لا تريد احتكاكاً، فقاومي رغبة تدليكه بإحكام — تقول العلبة «بلطف» لسبب.',
      },
      {
        title: 'أعيدي التطبيق كلما شعرتِ بالشدّ',
        body: 'تسمح الشركة صراحةً بعدة تطبيقات يومياً، وهذا غير معتاد ونافع. وفي أول 48 ساعة بعد الجلسة، الشدّ إشارة لإعادة التطبيق لا شيء يُنتظر انقضاؤه.',
      },
      {
        title: 'لا شيء فعّال فوقه لبضعة أيام',
        body: 'لا أحماض ولا ريتينويدات ولا فيتامين C أثناء استقرار البشرة. وواقي الشمس بعد أن يسمح أخصائيك، فالبشرة المعالجة حديثاً تتصبّغ بسهولة.',
      },
    ],
    note:
      'أبعديه عن العينين، وتجاوزيه تماماً أثناء الحمل والإرضاع — وهذه التعليمة على العلبة. أما حجم 100 غ فهو الاحترافي الذي تُبقيه العيادات في غرفة العلاج؛ و20 غ هو الأنبوب الذي تأخذينه معك.',
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
      'يُتجنّب الاستخدام أثناء الحمل والإرضاع — وهذه التعليمة مطبوعة على العلبة.',
      'يحتوي شمع العسل، فهو غير مناسب إن كنتِ تتجنّبين المكوّنات الحيوانية.',
      'يحتوي زيت اللافندر مع لينالول معلن. اختبريه على بقعة إن كنتِ تتفاعلين مع العطر.',
      'للاستعمال الخارجي فقط. لا يُستخدم قرب العينين، واشطفي جيداً بالماء البارد عند الملامسة.',
      'تجنّبي أشعة الشمس المباشرة على المناطق المعالجة، وأوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو حكّة.',
      'قُيّم آمناً لصحة الإنسان وفق اللائحة EC 1223/2009 وصُنّف «غير مهيّج» في اختبار اللصقة.',
      'يُستخدم خلال ستة أشهر من الفتح. يُحفظ بارداً وجافاً وبعيداً عن متناول الأطفال.',
    ],
    note: 'الاحتياطات كما هي مطبوعة على علبة جينوسيس، بما فيها اللوحة الكورية، مع إفصاح العطر من التركيبة الكمّية.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الحجم', value: 'أنبوب منزلي 20 غ · واحترافي 100 غ' },
      { label: 'الملمس', value: 'كريم أصفر فاتح، متوسط الثقل' },
      { label: 'الوظيفة المسجّلة', value: 'التهدئة. ولا ترخيص وظيفي كوري، ولا ادّعاء به' },
      { label: 'المرطّبات الجاذبة', value: 'بيوتيلين غلايكول 12.000% وغليسرين 6.390% — 18.4% مجتمعةً' },
      { label: 'الفعّالات المهدّئة', value: 'دايبوتاسيوم غليسيرايزينات 0.200%، قُبّعية 0.200%، ألانتوين 0.200%، بيسابولول 0.050%' },
      { label: 'السنتيلا', value: 'ثلاثيات تربين منقّاة، 0.020% مجتمعةً' },
      { label: 'ويحتوي أيضاً', value: 'فيتامين E 0.500%، أرجينين 0.500%، شمع عسل 0.500%، سكوالان 1.500%' },
      { label: 'ليس نباتياً', value: 'يحتوي شمع العسل' },
      { label: 'معطّر', value: 'نعم — زيت لافندر 0.0053%، مع لينالول معلن' },
      { label: 'الحموضة', value: '6.80 ± 1.00 (6.65 و6.67 على الدفعتين المختبرتين)' },
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
        q: 'متى أبدأ استخدامه بعد الجلسة؟',
        a: 'اسألي أخصائيك — فالأمر يتوقّف على ما أُجري وكيف استجابت بشرتك. والمبدأ العام أن تصبح البشرة سليمة ولم تعد راشحة. والعلبة صريحة بأنه لا يوضع على بشرة مجروحة أو مفتوحة، فهذا كريم لمرحلة التهيّج والاحمرار والشدّ لا للمرحلة المكشوفة.',
      },
      {
        q: 'ما الذي يهدّئ فعلاً؟',
        a: 'ثلاثة مكوّنات بنسبة 0.2% لكل منها — دايبوتاسيوم غليسيرايزينات المشتقّ من عرق السوس، ومستخلص جذر القُبّعية لبايكالينه، والألانتوين — إضافة إلى البيسابولول، وفيتامين E بنسبة 0.5%، وقاعدة مرطّبات بنسبة 18.4% من البيوتيلين غلايكول والغليسرين. وكان وصفنا نفسه يتصدّره ببتيد موجود بعشرة أجزاء من المليار، وقد صحّحنا ذلك في هذه الصفحة.',
      },
      {
        q: 'هل يحتوي أي مكوّنات فعّالة؟',
        a: 'لا، وذلك مقصود. فلا ريتينويد ولا حمض ولا فيتامين C ولا أربوتين ولا أدينوزين ولا مرشّح أشعة. ووظيفته الكورية المسجّلة كلمة واحدة هي «التهدئة»، ولا تحمل أي من شهادتَي التحليل قياساً لمكوّن لعدم وجود فعّال وظيفي يُقاس. وعلى بشرة معالجة لتوّها، هذا الغياب هو المقصود.',
      },
      {
        q: 'كم مرة أستخدمه؟',
        a: 'صباحاً ومساءً كقاعدة، وتسمح الشركة صراحةً بعدة تطبيقات يومياً إن أرادتها بشرتك. وفي أول 48 ساعة بعد الجلسة، الشدّ هو الإشارة لإعادة التطبيق. وبعد الفتح، استخدميه خلال ستة أشهر — ورمز 6M على العلبة.',
      },
      {
        q: 'هل هو نباتي؟',
        a: 'لا. يحتوي شمع العسل بنسبة 0.5%، وهو ما يعرّفه تقييم السلامة بأنه شمع منقّى من قرص العسل. ويحتوي أيضاً زيت اللافندر، فهو ليس خالياً من العطر كذلك.',
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
  eyebrow: 'Успокаивающий восстанавливающий крем · 20 г домашний · 100 г профессиональный',
  headline: 'Крем, который вам отдают на выходе из кабинета.',
  subheadline:
    'Почти пятая часть этой тубы — увлажнители: бутиленгликоль 12% и глицерин 6,4%, поверх производного лакрицы дикалия глицирризината, шлемника с байкалином и аллантоина, каждого по 0,2%. Именно это сочетание успокаивает кожу сразу после микронидлинга или лазера. Зарегистрированная функция — одно слово: успокоение.',
  heroBullets: [
    '18,4% увлажнителей — самое полезное для только что обработанной кожи',
    'Лакрица, шлемник и аллантоин — все три по полные 0,2%',
    'Можно наносить несколько раз в день, по указанию производителя',
    'Содержит пчелиный воск и лавандовое масло. Не для повреждённой кожи',
  ],
  badges: ['Сделано в Корее', '20 г / 100 г', 'Оценка безопасности ЕС', 'Оценка: не раздражает'],

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
    { value: '18,4%', label: 'Увлажнителей — бутиленгликоль плюс глицерин' },
    { value: '0,2%', label: 'Каждого: лакрица, шлемник, аллантоин' },
    { value: '6M', label: 'Срок после вскрытия' },
    { value: '4', label: 'Патогена проверено в партии, все отсутствуют' },
  ],

  working: {
    eyebrow: 'Работающая формула',
    title: 'Что действительно успокаивает кожу',
    intro:
      'У кожи сразу после процедуры две проблемы: она потеряла воду и она воспалена. Эта формула отвечает на обе, и ингредиенты, которые это делают, — обычные, хорошо изученные и в реальных дозах.',
    items: [
      {
        name: 'Butylene Glycol и Glycerin',
        dose: '12.000% + 6.390%',
        body: 'Вместе 18,4% тубы. Только что обработанная кожа теряет воду быстрее целой, и восполнить её — самое полезное, что может сделать крем в первые дни. Поэтому же этот крем чуть тяжелее воды, тогда как более богатый крем легче.',
      },
      {
        name: 'Dipotassium Glycyrrhizate',
        dose: '0.200%',
        body: 'Производное лакрицы против раздражения, в середине своего обычного косметического диапазона 0,1–0,5%. Именно этот ингредиент больше всех заслуживает первой строки, а в нашем старом описании он стоял третьим.',
      },
      {
        name: 'Scutellaria Baicalensis Root Extract',
        dose: '0.200%',
        body: 'Источник байкалина, хорошо изученного успокаивающего флавоноида. Полноценная рабочая доза, и он был закопан в самом конце нашего старого списка.',
      },
      {
        name: 'Allantoin и Bisabolol',
        dose: '0.200% + 0.050%',
        body: 'Аллантоин в полной рабочей дозе для комфорта и бисаболол — успокаивающая фракция ромашки — в нижней части обычного диапазона, но действительно присутствующий.',
      },
      {
        name: 'Витамин E и Arginine',
        dose: 'по 0.500%',
        body: 'Токоферил ацетат как антиоксидант в реальной дозе и аргинин как кондиционирующая аминокислота.',
      },
      {
        name: 'Липидная фаза',
        dose: '~8,3%',
        body: 'Диметикон 2%, сквалан 1,5%, каприловый/каприновый триглицерид 1,5%, жожоба 0,5%, пчелиный воск 0,5% и эмульгаторы из оливы. Достаточно, чтобы удержать воду, не утяжеляя и без того горячую кожу.',
      },
    ],
  },

  reorder: {
    eyebrow: 'Исправление',
    title: 'Наш собственный список ингредиентов был в неверном порядке',
    intro:
      'До этой страницы наше описание называло семь ключевых ингредиентов. Против производственной формулы порядок оказался почти полностью перевёрнутым — вот тот же список с тем, что реально в тубе.',
    columns: { name: 'Ингредиент', listed: 'Мы указали', actual: 'Реальная концентрация' },
    rows: [
      { name: 'sh-Polypeptide-7', listed: '1-м', actual: '10 частей на миллиард' },
      { name: 'Тритерпены центеллы, суммарно', listed: '2-м', actual: '200 ppm' },
      { name: 'Dipotassium Glycyrrhizate', listed: '3-м', actual: '0,200% — полноценная доза', real: true },
      { name: 'Panthenol', listed: '4-м', actual: '0,050% — мало' },
      { name: 'Экстракт каллуса винограда', listed: '5-м', actual: '60 ppm' },
      { name: 'Экстракт каллуса дамасской розы', listed: '6-м', actual: '60 ppm' },
      { name: 'Scutellaria Baicalensis Root Extract', listed: '7-м', actual: '0,200% — полноценная доза', real: true },
    ],
    body:
      'Два ингредиента, действительно находящиеся в противораздражающих дозах, стояли на третьем и седьмом местах, пептид в концентрации десять частей на миллиард возглавлял список, а увлажняющая загрузка 18,4%, которая делает основную работу, не упоминалась вовсе. Здесь ничего не выдумано — все ингредиенты в тубе есть. Их просто расположили по тому, как хорошо они звучат, а не по тому, сколько их. Хорошая новость: продукту эта помощь не требовалась — это грамотно собранный успокаивающий крем сам по себе.',
  },

  centella: {
    eyebrow: 'Точность',
    title: 'Комплекс центеллы, 200 ppm',
    body:
      'Азиатикозид 0,008%, мадекассовая кислота 0,006% и азиатовая кислота 0,006% — суммарно 0,020%. Здесь стоит быть точным, потому что это ни заголовок, ни украшение. Это очищенные тритерпены, а не грубый экстракт центеллы, то есть осознанный и сравнительно дорогой выбор. Но литература по заживлению с азиатикозидом работает при 0,1–1%, так что здесь в пять–пятьдесят раз ниже. Читайте это как поддерживающую деталь успокаивающей формулы, а не как причину, по которой формула работает.',
  },

  brokenSkin: {
    eyebrow: 'Важно',
    title: 'Не для повреждённой и открытой кожи',
    body:
      'Корейская панель на коробке предписывает воздержаться от нанесения на повреждённые участки кожи. Это стоит повторить прямо, потому что «постпроцедурный крем» легко прочитать как разрешение наносить его на всё, что процедура после себя оставила.',
    detail:
      'Это для кожи целой, но раздражённой, покрасневшей, стянутой или горячей — на следующий день после микронидлинга, после лазера, после пилинга, который закончил шелушение. Это не раневая повязка и не средство для мокнущей, кровящей или покрытой корочками кожи. Когда барьер закрылся достаточно, чтобы начать, решает ваш специалист: следуйте его срокам, а не нашим, и спросите, если не уверены.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что говорит сертификат',
    intro:
      'Сделано в Корее, выпущено против письменной спецификации и оценено по европейскому косметическому закону в досье на 42 страницы. Обе партии в деле показывают одинаковые результаты.',
    rows: [
      { label: 'pH', value: '6,65 и 6,67 в двух партиях, в пределах спецификации 6,80 ± 1,00' },
      { label: 'Удельный вес', value: '1,004 и 1,009 — чуть тяжелее воды, из-за увлажнителей' },
      { label: 'Твёрдость', value: '38 и 45, в пределах спецификации 35 ± 10' },
      { label: 'Чистота', value: 'Менее 100 КОЕ/г по общему счёту' },
      { label: 'Патогены', value: 'S. aureus, P. aeruginosa, E. coli и C. albicans — четыре проверены, все не обнаружены' },
      { label: 'Срок годности', value: 'Три года закрытым, дата на коробке' },
      { label: 'После вскрытия', value: 'Шесть месяцев — символ 6M есть на коробке' },
      { label: 'Измерение актива', value: 'Отсутствует, так как измерять нечего: зарегистрированная функция — успокоение' },
    ],
    patch:
      'Об оценке стоит знать две вещи. Патч-тест вернулся с оценкой «не раздражает», а не просто «пройден». И заключение гласит «продукт считается безопасным для здоровья человека» без оговорки «с ограничениями», которую несут несколько других средств линейки, — самая чистая формулировка, что мы видели в досье GENOSYS.',
  },

  fragrance: {
    eyebrow: 'Если вы читаете составы',
    title: 'Лавандовое масло, пчелиный воск и никаких функциональных активов',
    body:
      'Лавандовое масло 0,0053%, с заявленным линалоолом 0,0047% — и, что необычно, готовый крем в рамках оценки дополнительно проанализировали на него, получив 0,0032%, так что это измеренная цифра, а не расчётная. Также содержит пчелиный воск 0,500%, поэтому он не веганский. А чего в нём нет — так это любых функциональных активов: ни ретиноида, ни кислоты, ни арбутина, ни аденозина, ни UV-фильтра. Для только что обработанной кожи это отсутствие и есть достоинство: здесь нечему конфликтовать с тем, что вам только что сделали.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Столько, сколько просит кожа',
    frequency: 'Утром и вечером · чаще при необходимости · использовать в течение 6 месяцев после вскрытия',
    steps: [
      {
        title: 'Начинайте, когда скажет специалист',
        body: 'Срок после процедуры — его решение, а не решение этикетки. В общем виде: когда кожа цела и больше не мокнет. Если не уверены, что готовы, спросите до нанесения.',
      },
      {
        title: 'Щедрый слой, вдавливая, а не растирая',
        body: 'Слегка согрейте и вдавите плоскими пальцами. Только что обработанная кожа не хочет трения, так что не поддавайтесь желанию как следует его вмассировать — коробка не зря говорит «мягко».',
      },
      {
        title: 'Наносите заново, когда чувствуете стянутость',
        body: 'Производитель прямо разрешает несколько нанесений в день — это необычно и полезно. В первые 48 часов после процедуры стянутость — сигнал нанести снова, а не то, что нужно перетерпеть.',
      },
      {
        title: 'Никаких активов сверху несколько дней',
        body: 'Ни кислот, ни ретиноидов, ни витамина C, пока кожа успокаивается. Санскрин — когда разрешит специалист, потому что свежеобработанная кожа легко пигментирует.',
      },
    ],
    note:
      'Держите его подальше от глаз и полностью пропустите при беременности и кормлении — это указание есть на коробке. Размер 100 г — профессиональный, для кабинета; 20 г — та туба, которую забирают домой.',
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
      'Избегайте применения при беременности и кормлении — это указание напечатано на коробке.',
      'Содержит пчелиный воск, поэтому не подходит, если вы избегаете ингредиентов животного происхождения.',
      'Содержит лавандовое масло с заявленным линалоолом. Сделайте пробу, если реагируете на ароматизаторы.',
      'Только для наружного применения. Не наносите рядом с глазами, при попадании тщательно промойте прохладной водой.',
      'Избегайте прямого солнца на обработанных участках; прекратите использование и обратитесь к врачу при покраснении, отёке или зуде.',
      'Оценено как безопасное для здоровья человека по регламенту EC 1223/2009, патч-тест — «не раздражает».',
      'Использовать в течение шести месяцев после вскрытия. Хранить в прохладном сухом месте, недоступном для детей.',
    ],
    note: 'Предостережения как напечатаны на коробке GENOSYS, включая корейскую панель, плюс раскрытие отдушки из количественной формулы.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Объём', value: 'Домашняя туба 20 г · профессиональный 100 г' },
      { label: 'Текстура', value: 'Светло-жёлтый крем, средней плотности' },
      { label: 'Зарегистрированная функция', value: 'Успокоение. Корейской функциональной лицензии нет, и она не заявляется' },
      { label: 'Увлажнители', value: 'Бутиленгликоль 12,000% и глицерин 6,390% — суммарно 18,4%' },
      { label: 'Успокаивающие активы', value: 'Дикалия глицирризинат 0,200%, шлемник 0,200%, аллантоин 0,200%, бисаболол 0,050%' },
      { label: 'Центелла', value: 'Очищенные тритерпены, суммарно 0,020%' },
      { label: 'Также содержит', value: 'Витамин E 0,500%, аргинин 0,500%, пчелиный воск 0,500%, сквалан 1,500%' },
      { label: 'Не веганский', value: 'Содержит пчелиный воск' },
      { label: 'Отдушка', value: 'Да — лавандовое масло 0,0053%, линалоол заявлен' },
      { label: 'pH', value: '6,80 ± 1,00 (6,65 и 6,67 в измеренных партиях)' },
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
        q: 'Когда можно начинать после процедуры?',
        a: 'Спросите специалиста — это зависит от того, что делали и как отреагировала кожа. Общий принцип: когда кожа цела и больше не мокнет. Коробка прямо указывает, что средство не наносят на повреждённую кожу, так что это крем для стадии раздражения, покраснения и стянутости, а не для открытой.',
      },
      {
        q: 'Что на самом деле успокаивает?',
        a: 'Три ингредиента по 0,2% — производное лакрицы дикалия глицирризинат, экстракт корня шлемника ради байкалина и аллантоин, — плюс бисаболол, витамин E 0,5% и увлажняющая база 18,4% из бутиленгликоля и глицерина. Наше описание раньше начиналось с пептида в концентрации десять частей на миллиард, и на этой странице мы это исправили.',
      },
      {
        q: 'Есть ли в нём активные ингредиенты?',
        a: 'Нет, и это намеренно. Ни ретиноида, ни кислоты, ни витамина C, ни арбутина, ни аденозина, ни UV-фильтра. Зарегистрированная корейская функция — одно слово «успокоение», и ни один сертификат анализа не содержит измерения активов, потому что измерять нечего. Для свежеобработанной кожи в этом отсутствии и весь смысл.',
      },
      {
        q: 'Как часто наносить?',
        a: 'Утром и вечером как правило, а производитель прямо разрешает несколько нанесений в день, если кожа просит. В первые 48 часов после процедуры стянутость — сигнал нанести снова. После вскрытия используйте в течение шести месяцев — символ 6M есть на коробке.',
      },
      {
        q: 'Он веганский?',
        a: 'Нет. Содержит пчелиный воск 0,5%, который оценка безопасности определяет как очищенный воск из сот. Также содержит лавандовое масло, так что и без отдушки он тоже не обходится.',
      },
      {
        q: 'Зачем брать 100 г?',
        a: 'Это профессиональный размер, для кабинета, где им пользуются на многих клиентах. Туба 20 г — домашняя, её забирают с собой. Формула одна и та же. В любом случае предел — шесть месяцев после вскрытия.',
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
