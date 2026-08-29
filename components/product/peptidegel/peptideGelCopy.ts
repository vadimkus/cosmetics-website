import { PEPTIDE_GEL_AR_COPY, PEPTIDE_GEL_RU_COPY } from './peptideGelLocalizedCopy'

/**
 * Bespoke copy for the PEPTIDE GEL MASK page (product 37).
 *
 * Same self-contained per-locale pattern as eyepatchCopy.ts, so the
 * dedicated layout ships EN/AR/RU without adding keys to the shared
 * messages bundles.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Documents that cover every figure on this page:
 *
 *   Registration DOC/Formula_up/Formula-GENOSYS PEPTIDE GEL MASK.pdf
 *       Finished concentrations. Every percentage comes from here.
 *       Signed DTS MG, Narae Han. This is the source of truth.
 *   Registration DOC/SA/SA-GENOSYS PEPTIDE GEL MASK.pdf
 *       Product category: Face Mask. Function: moisturizing, soothing.
 *       Product type: leave on (the leftover essence stays; the sheet
 *       comes off). pH 5.0-7.0 / 6±1. Translucent gel. PAO is not
 *       documented - do not invent one. Dermatological in vivo patch
 *       test allows "Dermatologically tested". English artwork has no
 *       pregnancy / lactation warning. SA recommends a conservative
 *       pregnancy line because of possible phytochemicals; the English
 *       pack prints neither. Do not invent "avoid" or "pregnancy-safe".
 *       ARGIRELINE peptide solution C is a 0.012% premix. Multicare-Plus
 *       is a 0.3000% premix. ELOGLYN R995 is the 20% glycerin premix.
 *       Sodium Hyaluronate arrives as a 0.1000% of a 0.5% premix.
 *       Marine collagen arrives as a 0.1000% of a 2% premix. Do not
 *       print the lab id. Do not print the contract manufacturer.
 *   Registration DOC/Artwork/[GENOSYS]PEPTIDE GEL MASK.pdf
 *       English: refreshes and moisturizes. Soothes and revitalizes
 *       after dermatological procedures. Function Moisturizing,
 *       soothing. After cleansing, prepare with toner. Open the pouch,
 *       remove the transparent film, apply closely, leave 20-40
 *       minutes, remove, massage remaining essence until absorbed.
 *       Refrigerate for a better cooling effect. 38g / 1.34 oz
 *       including mesh, 5 sheets. Avoid eyes and mucous membranes.
 *       Bandage / compress allergy caution. Use immediately after
 *       open. Korean: Acetyl Hexapeptide-8 0.05ppm. 38g x 5ea.
 *       Russian, Arabic and Turkish panels are drifted - do not follow
 *       them. AR writes 20 minutes only. RU invents healing of damaged
 *       tissue, a peptide-and-plant hero, and a required LED pairing.
 *   Registration DOC/COA/COA-GENOSYS PEPTIDE GEL MASK(OF001).pdf
 *       Translucent gel. pH 5.62 inside 5.0-7.0. Net 40.12g against
 *       >38g. Never print the lot. Never print the contract
 *       manufacturer. DTS MG only.
 *   Ingredient lists_old / Quali-quanti
 *       Legacy sheets. Cross-check only.
 *
 * THE FORMULA, as finished concentrations that matter on this page:
 *
 *   Aqua (Water)                                      76.4588206%
 *   Glycerin                                          19.9210000%
 *   Ceratonia Siliqua Gum                              2.2000000%
 *   Chondrus Crispus Extract                           0.8000000%
 *   Phenoxyethanol                                     0.3019200%
 *   Dipotassium Glycyrrhizate                          0.1000000%
 *   Ethylhexylglycerin                                 0.0699300%
 *   Butylene Glycol                                    0.0330000%
 *   Caprylyl Glycol                                    0.0300540%
 *   1,2-Hexanediol                                     0.0300000%
 *   Disodium EDTA                                      0.0200000%
 *   Ricinus Communis (Castor) Seed Oil                 0.0090000%
 *   Potassium Hydroxide                                0.0045000%
 *   Scutellaria / Camellia / Artemisia / Houttuynia /
 *     Lactobacillus / Citrus Junos                     0.0030000% each
 *   Hydrolyzed Collagen                                0.0020000%
 *   Portulaca Oleracea Extract                         0.0010000%
 *   Sodium Hyaluronate                                 0.0005000%
 *   Arnica / Chamomile                                 0.0001000% each
 *   Tocopherol                                         0.0000700%
 *   Acetyl Hexapeptide-8                               0.0000054%  (0.05 ppm)
 *
 * THE DISTINCTIVE FACT, which is why this page exists.
 *
 * This is a face hydrogel sheet. 38g including mesh, five in the box.
 * After a dermatological procedure. Moisturizing, soothing. Sit 20 to
 * 40 minutes, take the sheet off, massage the leftover in. Glycerin is
 * 20% of the pouch. That is the product. The name says PEPTIDE.
 * Finished Acetyl Hexapeptide-8 is 0.05 ppm. Sodium Hyaluronate is
 * 0.0005%. Hydrolyzed collagen is 0.002%. They are in the formula.
 * They are not the engine.
 *
 * This is not the EyeCell eye patch (33). That mask carries Niacinamide
 * 2% and Adenosine 0.04%. This one does not. Do not borrow them.
 *
 * Live English, Arabic and Russian still sold a patented thermo-
 * sensitive transdermal system, a peptide hero, hyaluronic acid as a
 * card, collagen as a card, 15-20 minutes, all skin types, a required
 * LED pairing, and firm / lift / nourish. None of that is the engine.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Face hydrogel, moisturizing, soothing              SA / artwork EN
 *   After dermatological procedures                    artwork EN
 *   20 to 40 minutes, then remove                      artwork EN
 *   Massage remaining essence until absorbed           artwork EN
 *   Refrigerate for a better cooling effect            artwork EN
 *   38g including mesh x 5 sheets                      artwork
 *   Glycerin ~20%, carob 2.2%, chondrus 0.8%           Formula_up
 *   Dipotassium Glycyrrhizate 0.10%                    Formula_up
 *   Acetyl Hexapeptide-8 at 0.05 ppm                   artwork KR / Formula_up
 *   Translucent gel, pH 5.62 inside 5.0 to 7.0         COA
 *   Dermatologically tested                            SA / pouch
 *   Bandage / compress allergy caution                 artwork EN
 *   Use immediately after open                         artwork EN
 *   Avoid eyes and mucous membranes                    artwork EN
 *   Made in Korea by DTS MG                            formula / artwork
 *
 * DELIBERATE OMISSIONS
 *   - PEPTIDE AS THE ENGINE. Finished Acetyl Hexapeptide-8 is 0.05 ppm.
 *   - ARGIRELINE / OTHER PEPTIDES. One peptide. Premix 0.012%.
 *   - HYALURONIC ACID / COLLAGEN AS A CARD. 0.0005% and 0.002%.
 *   - PATENTED / TRANSDERMAL / MELTS ON CONTACT / BOOSTS DELIVERY.
 *     English artwork does not say patented. No patent is in hand.
 *   - BOTOX / MUSCLE-RELAXANT / LIFT / FIRM as a result.
 *   - HEALING DAMAGED TISSUE. RU panel only.
 *   - REQUIRED LED PAIRING. RU panel only. English pack is silent.
 *   - 15-20 MINUTES or 20 MINUTES ONLY. Artwork EN is 20-40.
 *   - 2-3 TIMES A WEEK. Not on the English pack.
 *   - ALL SKIN TYPES INCLUDING SENSITIVE as a blanket.
 *   - FRAGRANCE-FREE. No Parfum, but Citrus Junos and castor oil are in it.
 *   - PREGNANCY AVOID or PREGNANCY-SAFE. The English pack prints neither.
 *   - CLINICAL HYDRATION PERCENTAGES. None for this finished mask.
 *   - PAO. SA says supplementary studies are needed.
 *   - LOT CODES. Never print OF001.
 *   - THE CONTRACT MANUFACTURER. DTS MG only.
 */

export type PeptideGelLocale = 'en' | 'ar' | 'ru'

export interface PeptideGelCopy {
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

/** Registered Formula_up INCI in descending finished order. The carton
 *  lifts Acetyl Hexapeptide-8 after Chondrus and prints 0.05ppm. The
 *  page does not claim this matches every language panel. */
export const FULL_INCI =
  'Aqua (Water), Glycerin, Ceratonia Siliqua Gum, Chondrus Crispus ' +
  'Extract, Phenoxyethanol, Dipotassium Glycyrrhizate, Ethylhexylglycerin, ' +
  'Butylene Glycol, Caprylyl Glycol, 1,2-Hexanediol, Disodium EDTA, ' +
  'Ricinus Communis (Castor) Seed Oil, Potassium Hydroxide, Scutellaria ' +
  'Baicalensis Root Extract, Camellia Sinensis Leaf Extract, Artemisia ' +
  'Princeps Leaf Extract, Houttuynia Cordata Extract, Lactobacillus ' +
  'Ferment, Citrus Junos Fruit Extract, Hydrolyzed Collagen, Portulaca ' +
  'Oleracea Extract, Sodium Hyaluronate, Arnica Montana Flower Extract, ' +
  'Chamomilla Recutita (Matricaria) Flower Extract, Tocopherol, Acetyl ' +
  'Hexapeptide-8.'

const EN: PeptideGelCopy = {
  eyebrow: 'Face hydrogel · After a procedure',
  headline: 'Twenty to forty minutes. Then the sheet comes off.',
  subheadline:
    'A face hydrogel for moisturizing and soothing after a dermatological procedure. Glycerin 20% is the figure that belongs on a card. The name says peptide. The peptide sits at 0.05 ppm.',
  heroBullets: [
    'Glycerin 20% holds water on the face for the full sit',
    '20 to 40 minutes, then take the sheet off and massage the leftover in',
    'After a dermatological procedure. Moisturizing, soothing',
    '38g including mesh. Five sheets. Refrigerate if you want it colder',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '38g × 5 sheets', 'After a procedure'],
  packSize: '38g × 5',
  usageNote: '20 to 40 minutes, then remove',
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
    { value: '5', label: 'Sheets in the box' },
    { value: '20%', label: 'Glycerin' },
    { value: '0.05 ppm', label: 'Acetyl Hexapeptide-8' },
    { value: '20-40 min', label: 'Then the sheet comes off' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'A sheet. Then it comes off.',
    intro:
      'The English pack writes the job in two words: moisturizing, soothing. The sentence under the name is after dermatological procedures. This is a take-off sheet. The leftover essence stays.',
    cards: [
      {
        title: 'Moisturize',
        body: 'Glycerin 20% is most of what is not water. It holds water on the face for the full 20 to 40 minutes.',
      },
      {
        title: 'Soothe',
        body: 'The pack sells soothing after a dermatological procedure. That is the first job, not a lift and not a muscle-relaxant story.',
      },
      {
        title: 'A cooler feel',
        body: 'Moisture displaces heat, so the face feels cooler while the sheet sits. Keep the pouch in the fridge if you want that stronger.',
      },
      {
        title: 'After a procedure',
        body: 'The registered sentence is after dermatological procedures. Cleanse, toner, this sheet, then the leftover in. Not a weekly anti-wrinkle ritual.',
      },
    ],
  },
  engine: {
    eyebrow: 'The mask',
    title: 'Glycerin 20% is the figure that belongs on a card.',
    body:
      'This is a face hydrogel sheet. Glycerin is 20% of the pouch. Carob gum and Chondrus make the gel. The name says peptide. Acetyl Hexapeptide-8 sits at 0.05 ppm. Hyaluronic acid is 0.0005%. Collagen is 0.002%. They are in the formula. They are not the engine.',
    points: [
      {
        title: 'Glycerin · 20%',
        body: 'The humectant. This is the figure that belongs on a card. Almost a fifth of the pouch is glycerin. That is why the sheet feels wet and stays that way.',
      },
      {
        title: 'Carob 2.2% + Chondrus 0.8%',
        body: 'The gel. Body heat makes it sit closer. Moisture displaces heat, so the face feels cooler. Innovative enough. Not a transdermal-delivery system, and not a patent we have in hand.',
      },
      {
        title: 'Dipotassium Glycyrrhizate · 0.10%',
        body: 'The licorice salt at a dose that still deserves a line. Soothing support in the gel. Not a repair claim.',
      },
      {
        title: 'The peptide sits at 0.05 ppm',
        body: 'Acetyl Hexapeptide-8 is 0.05 ppm finished. Sodium Hyaluronate is 0.0005%. Hydrolyzed collagen is 0.002%. They are in the formula. They are not why you buy the box.',
      },
    ],
    figureAlt: 'GENOSYS PEPTIDE GEL MASK pouch, the white-and-blue 38g sheet',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Sit. Then take the sheet off.',
    frequency: '20 to 40 minutes · Then remove',
    steps: [
      {
        title: 'Cleanse + toner',
        body: 'After cleansing, prepare the skin with toner. The sheet goes on settled skin, not over makeup remover still sitting there.',
      },
      {
        title: 'Open',
        body: 'Open the pouch. Pull the transparent film off both sides of the sheet. Use it at once. The pack says so.',
      },
      {
        title: 'Apply',
        body: 'Lay it on the face and press it close. Keep it off the eyes and the mucous membranes.',
      },
      {
        title: 'Sit',
        body: 'Twenty to forty minutes. Not fifteen. Not twenty only. Lie back if you can, so the gel stays put.',
      },
      {
        title: 'Remove',
        body: 'Take the sheet off. Massage the remaining essence until it is absorbed. Then the cream, when you use one.',
      },
    ],
    note:
      'If you react to bandages or compresses, use this mask with caution, or skip it. Keep it out of the eyes. If contact occurs, rinse with cool water. Refrigerate the pouch if you want a colder sit.',
    videoTitle: 'See the ritual',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The gel, with the figures.',
    intro:
      'The cards below are the parts of the sheet that do the work. The complete registered INCI is under the list.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote:
      'Every ingredient, strongest first. Your box prints Acetyl Hexapeptide-8 just after Chondrus, at 0.05 ppm, and this page follows the registered formula.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Honest answer.',
    forTitle: 'A good fit if',
    forList: [
      'You want a take-off face hydrogel after a dermatological procedure',
      'You will sit 20 to 40 minutes, then massage the leftover in',
      'You want glycerin 20% on the card, not a peptide story',
      'You want the face sheet. The eye contour is product 33',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You want Niacinamide 2% and Adenosine 0.04% as the engine. That is the EyeCell eye patch, product 33',
      'The skin is broken, or you react to bandages or compresses',
      'You want a Botox story, a lift, or a peptide as the reason it works',
      'You want a leave-on cream as the only step, with no sit',
      'You need it around the eyes. The pack says keep it off them',
    ],
    note: 'For external use only. If it reaches the eye, rinse with cool water. Stop and speak to a doctor if redness, swelling or itching appears. Use each sheet as soon as you open the pouch.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'Where the sheet sits.',
    intro:
      'Cleanse, mist, this sheet, then the postcream. The sheet comes off. The leftover stays. Cream seals.',
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
        q: 'Are the peptides the main actives?',
        a: 'No. Finished Acetyl Hexapeptide-8 is 0.05 ppm. The name says PEPTIDE. The figure that belongs on a card is glycerin 20%.',
      },
      {
        q: 'Is this the same as the EyeCell eye patch?',
        a: 'No. Product 33 is the eye mask, with Niacinamide 2% and Adenosine 0.04%. This is the face sheet. It has neither functional. Keep it off the eyes.',
      },
      {
        q: 'Is it patented? Does it deliver through the skin?',
        a: 'The English pack does not say patented, and it does not say transdermal. Body heat makes the gel sit closer. Moisture displaces heat. That is the wear, not a delivery system we have a patent for.',
      },
      {
        q: 'How long do I leave it on?',
        a: 'Twenty to forty minutes, then remove. The English pack says so. Not fifteen to twenty, and not twenty only.',
      },
      {
        q: 'Do I have to use it with LED?',
        a: 'No. The English pack does not mention a lamp. Some clinic protocols sit a cooling sheet with one. That is optional, not a requirement.',
      },
      {
        q: 'Is it fragrance-free?',
        a: 'There is no Parfum in the formula. Citrus Junos fruit extract and castor seed oil are in it. The page does not print fragrance-free.',
      },
      {
        q: 'Can I use it in pregnancy?',
        a: 'The English pack prints neither avoid nor pregnancy-safe. Ask your doctor. This page does not invent either line.',
      },
      {
        q: 'Should I refrigerate it?',
        a: 'You can. The pack says a refrigerated sheet feels colder. It is a tip, not a rule.',
      },
    ],
  },
  details: {
    eyebrow: 'The spec',
    title: 'What you are buying.',
    rows: [
      { label: 'Form', value: 'Hydrogel face sheet, mesh included' },
      { label: 'Size', value: '38g / 1.34 oz × 5 sheets' },
      { label: 'Function', value: 'Moisturizing, soothing. After a dermatological procedure' },
      { label: 'Wear', value: '20 to 40 minutes, then remove. Massage the leftover in' },
      { label: 'pH', value: '5.62, inside a 5.0 to 7.0 specification' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
      { label: 'Testing', value: 'Dermatologically tested' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'The cool-down, with the figures on the card.',
    body: 'Five sheets. Glycerin 20%. Twenty to forty minutes. Then it comes off.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

export const LEGACY_AR: PeptideGelCopy = {
  eyebrow: 'هيدروجيل للوجه · بعد إجراء',
  headline: 'عشرون إلى أربعون دقيقة. ثم تُنزع الورقة.',
  subheadline:
    'هيدروجيل للوجه للترطيب والتهدئة بعد إجراء جلدي. غليسرين ٢٠٪ هو الرقم الذي يستحق بطاقة. الاسم يقول ببتيد. الببتيد عند ٠٫٠٥ جزء في المليون.',
  heroBullets: [
    'غليسرين ٢٠٪ يمسك الماء على الوجه طوال الجلسة',
    '٢٠ إلى ٤٠ دقيقة، ثم انزعي الورقة ودلّكي الباقي',
    'بعد إجراء جلدي. ترطيب وتهدئة',
    '٣٨ غ مع الشبكة. خمس ورقات. برّديه إن أردتِ برداً أقوى',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', '٣٨ غ × ٥ ورقات', 'بعد إجراء'],
  packSize: '٣٨ غ × ٥',
  usageNote: '٢٠ إلى ٤٠ دقيقة ثم انزعي',
  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف',
  inBag: 'في سلتك',
  viewBag: 'عرض السلة',
  loginToShop: 'سجّلي الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني فوق ١٬٠٠٠ درهم · الشحن من دبي',
  stats: [
    { value: '٥', label: 'ورقات في العلبة' },
    { value: '٢٠٪', label: 'غليسرين' },
    { value: '٠٫٠٥ ppm', label: 'أسيتيل هكسا ببتيد-٨' },
    { value: '٢٠-٤٠ د', label: 'ثم تُنزع الورقة' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'ورقة. ثم تُنزع.',
    intro:
      'العلبة الإنجليزية تكتب المهمة بكلمتين: ترطيب وتهدئة. الجملة تحت الاسم: بعد الإجراءات الجلدية. هذه ورقة تُنزع. الخلاصة الباقية تبقى.',
    cards: [
      {
        title: 'يرطّب',
        body: 'غليسرين ٢٠٪ هو معظم ما ليس ماء. يمسك الماء على الوجه طوال ٢٠ إلى ٤٠ دقيقة.',
      },
      {
        title: 'يهدّئ',
        body: 'العلبة تبيع التهدئة بعد إجراء جلدي. هذه هي المهمة الأولى، لا رفع ولا قصة إرخاء عضلات.',
      },
      {
        title: 'إحساس أبرد',
        body: 'الرطوبة تزيح الحرارة، فيبرد الوجه والورقة عليه. ضعي الكيس في الثلاجة إن أردتِ ذلك أقوى.',
      },
      {
        title: 'بعد إجراء',
        body: 'الجملة المسجّلة: بعد الإجراءات الجلدية. نظّفي، تونر، هذه الورقة، ثم الباقي. ليست طقساً أسبوعياً ضد التجاعيد.',
      },
    ],
  },
  engine: {
    eyebrow: 'القناع',
    title: 'غليسرين ٢٠٪ هو الرقم الذي يستحق بطاقة.',
    body:
      'هذه ورقة هيدروجيل للوجه. الغليسرين ٢٠٪ من الكيس. صمغ الخروب والشوندروس يصنعان الجل. الاسم يقول ببتيد. أسيتيل هكسا ببتيد-٨ عند ٠٫٠٥ جزء في المليون. الهيالورون ٠٫٠٠٠٥٪. الكولاجين ٠٫٠٠٢٪. في التركيبة. ليست المحرّك.',
    points: [
      {
        title: 'غليسرين · ٢٠٪',
        body: 'المرطّب. هذا هو الرقم الذي يستحق بطاقة. نحو خُمس الكيس غليسرين. لذلك تبقى الورقة رطبة.',
      },
      {
        title: 'خروب ٢٫٢٪ + شوندروس ٠٫٨٪',
        body: 'الجل. حرارة الجسم تجعله أقرب. الرطوبة تزيح الحرارة فيبرد الوجه. كافٍ. ليست نظام توصيل عبر الجلد، وليست براءة لدينا.',
      },
      {
        title: 'غليسيريزات ثنائي البوتاسيوم · ٠٫١٠٪',
        body: 'ملح العرقسوس بجرعة تستحق سطراً. دعم تهدئة في الجل. ليس ادّعاء إصلاح.',
      },
      {
        title: 'الببتيد عند ٠٫٠٥ جزء في المليون',
        body: 'أسيتيل هكسا ببتيد-٨ ٠٫٠٥ جزء في المليون جاهزاً. هيالورونات الصوديوم ٠٫٠٠٠٥٪. الكولاجين المتحلل ٠٫٠٠٢٪. في التركيبة. ليست سبب شراء العلبة.',
      },
    ],
    figureAlt: 'كيس GENOSYS PEPTIDE GEL MASK، الورقة البيضاء والزرقاء ٣٨ غ',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'اجلسي. ثم انزعي الورقة.',
    frequency: '٢٠ إلى ٤٠ دقيقة · ثم انزعي',
    steps: [
      {
        title: 'نظّفي + تونر',
        body: 'بعد التنظيف، جهّزي البشرة بالتونر. الورقة على بشرة هادئة، لا فوق مزيل مكياج ما زال عليها.',
      },
      {
        title: 'افتحي',
        body: 'افتحي الكيس. انزعي الفيلم الشفاف من وجهي الورقة. استخدميها فوراً. العلبة تقول ذلك.',
      },
      {
        title: 'ضعي',
        body: 'ضعيها على الوجه واضغطيها لتلتصق. أبعديها عن العينين والأغشية المخاطية.',
      },
      {
        title: 'انتظري',
        body: 'عشرون إلى أربعون دقيقة. ليست خمس عشرة. وليست عشرين فقط. استلقي إن استطعتِ حتى يبقى الجل.',
      },
      {
        title: 'انزعي',
        body: 'انزعي الورقة. دلّكي الخلاصة الباقية حتى تُمتص. ثم الكريم إن كنتِ تستخدمينه.',
      },
    ],
    note:
      'إن كان لديكِ تحسّس من الضمادات أو الكمادات، استخدميه بحذر أو تجنّبيه. أبعديه عن العينين. إن لامسها، اشطفي بماء بارد. برّدي الكيس إن أردتِ جلوساً أبرد.',
    videoTitle: 'شاهدي الطقس',
  },
  actives: {
    eyebrow: 'ماذا فيه',
    title: 'الجل، مع الأرقام.',
    intro: 'البطاقات أدناه هي أجزاء الورقة التي تعمل. قائمة INCI المسجّلة الكاملة تحت القائمة.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote:
      'كل مكوّن، من الأعلى نسبةً إلى الأقل. علبتك تطبع أسيتيل هكسا ببتيد-٨ بعد الشوندروس مباشرة عند 0.05 جزء في المليون، وهذه الصفحة تتبع التركيبة المسجّلة.',
  },
  suited: {
    eyebrow: 'هل يناسبك',
    title: 'جواب صادق.',
    forTitle: 'مناسب إن',
    forList: [
      'أردتِ هيدروجيل وجه يُنزع بعد إجراء جلدي',
      'ستجلسين ٢٠ إلى ٤٠ دقيقة ثم تدلّكين الباقي',
      'أردتِ غليسرين ٢٠٪ على البطاقة، لا قصة ببتيد',
      'أردتِ ورقة الوجه. محيط العين هو المنتج ٣٣',
    ],
    notTitle: 'ابحثي عن غيره إن',
    notList: [
      'أردتِ نياسيناميد ٢٪ وأدينوزين ٠٫٠٤٪ كمحرّك. ذلك لصقة عين EyeCell، المنتج ٣٣',
      'البشرة مجروحة، أو تتحسّسين من الضمادات أو الكمادات',
      'أردتِ قصة بوتوكس أو رفعاً أو ببتيداً كسبب العمل',
      'أردتِ كريماً يُترك فقط، بلا جلوس',
      'احتجتِه حول العينين. العلبة تقول أبعديه عنهما',
    ],
    note: 'للاستخدام الخارجي فقط. إن وصل إلى العين، اشطفي بماء بارد. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو حكّة. استخدمي كل ورقة فور فتح الكيس.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'أين تجلس الورقة.',
    intro: 'نظّفي، الرذاذ، هذه الورقة، ثم كريم ما بعد الإجراء. الورقة تُنزع. الباقي يبقى. الكريم يختم.',
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
        q: 'هل الببتيدات هي المكوّنات الرئيسية؟',
        a: 'لا. أسيتيل هكسا ببتيد-٨ الجاهز ٠٫٠٥ جزء في المليون. الاسم يقول ببتيد. الرقم الذي يستحق بطاقة هو غليسرين ٢٠٪.',
      },
      {
        q: 'هل هذا نفس لصقة عين EyeCell؟',
        a: 'لا. المنتج ٣٣ قناع العين، بنياسيناميد ٢٪ وأدينوزين ٠٫٠٤٪. هذه ورقة الوجه. ليس فيها أيّ من الوظيفيّين. أبعديها عن العينين.',
      },
      {
        q: 'هل هو حاصل على براءة؟ هل يوصل عبر الجلد؟',
        a: 'العلبة الإنجليزية لا تقول براءة ولا تقول عبر الجلد. حرارة الجسم تجعل الجل أقرب. الرطوبة تزيح الحرارة. هذا هو الارتداء، لا نظام توصيل لدينا براءته.',
      },
      {
        q: 'كم أتركه؟',
        a: 'عشرون إلى أربعون دقيقة ثم انزعي. العلبة الإنجليزية تقول ذلك. ليست خمس عشرة إلى عشرين، وليست عشرين فقط.',
      },
      {
        q: 'هل يجب استخدامه مع LED؟',
        a: 'لا. العلبة الإنجليزية لا تذكر مصباحاً. بعض بروتوكولات العيادة تضع ورقة تبريد مع مصباح. ذلك اختياري، لا شرط.',
      },
      {
        q: 'هل هو خالي العطر؟',
        a: 'لا يوجد Parfum في التركيبة. مستخلص ثمر Citrus Junos وزيت الخروع فيه. الصفحة لا تطبع خالي العطر.',
      },
      {
        q: 'هل أستخدمه في الحمل؟',
        a: 'العلبة الإنجليزية لا تطبع تجنّبي ولا آمناً للحمل. اسألي طبيبك. هذه الصفحة لا تخترع أياً من السطرين.',
      },
      {
        q: 'هل أبرّده؟',
        a: 'يمكنكِ. العلبة تقول إن الورقة المبرّدة أبرد. نصيحة، لا قاعدة.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفة',
    title: 'ماذا تشترين.',
    rows: [
      { label: 'الشكل', value: 'ورقة هيدروجيل للوجه، مع الشبكة' },
      { label: 'الحجم', value: '٣٨ غ / ١٫٣٤ أونصة × ٥ ورقات' },
      { label: 'الوظيفة', value: 'ترطيب وتهدئة. بعد إجراء جلدي' },
      { label: 'الارتداء', value: '٢٠ إلى ٤٠ دقيقة ثم انزعي. دلّكي الباقي' },
      { label: 'pH', value: '٥٫٦٢، داخل مواصفة ٥٫٠ إلى ٧٫٠' },
      { label: 'المنشأ', value: 'صنع في كوريا لدى DTS MG' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'التبريد، مع الأرقام على البطاقة.',
    body: 'خمس ورقات. غليسرين ٢٠٪. عشرون إلى أربعون دقيقة. ثم تُنزع.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'كل المنتجات',
}

export const LEGACY_RU: PeptideGelCopy = {
  eyebrow: 'Гидрогель для лица · После процедуры',
  headline: 'Двадцать-сорок минут. Затем лист снимается.',
  subheadline:
    'Гидрогель для лица: увлажнение и успокоение после дерматологической процедуры. Глицерин 20% - цифра, которой место на карточке. Название говорит пептид. Пептид сидит на 0,05 ppm.',
  heroBullets: [
    'Глицерин 20% держит воду на лице всё время ношения',
    '20-40 минут, затем сними лист и вмассируй остаток',
    'После дерматологической процедуры. Увлажнение, успокоение',
    '38 г вместе с сеткой. Пять листов. Охлади, если хочешь холоднее',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', '38 г × 5 листов', 'После процедуры'],
  packSize: '38 г × 5',
  usageNote: '20-40 минут, затем снять',
  addToBag: 'В корзину',
  adding: 'Добавляю…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'К корзине',
  loginToShop: 'Войдите, чтобы купить',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',
  stats: [
    { value: '5', label: 'Листов в коробке' },
    { value: '20%', label: 'Глицерин' },
    { value: '0,05 ppm', label: 'Ацетилгексапептид-8' },
    { value: '20-40 мин', label: 'Затем лист снимается' },
  ],
  effects: {
    eyebrow: 'Что делает',
    title: 'Лист. Затем он снимается.',
    intro:
      'Английская упаковка пишет работу в двух словах: увлажнение, успокоение. Предложение под именем - после дерматологических процедур. Это снимаемый лист. Оставшаяся эссенция остаётся.',
    cards: [
      {
        title: 'Увлажняет',
        body: 'Глицерин 20% - большая часть того, что не вода. Держит воду на лице все 20-40 минут.',
      },
      {
        title: 'Успокаивает',
        body: 'Упаковка продаёт успокоение после дерматологической процедуры. Это первая работа, не лифтинг и не история про расслабление мышц.',
      },
      {
        title: 'Прохладнее на ощупь',
        body: 'Влага вытесняет тепло, поэтому лицо холодеет, пока лист лежит. Держи пакет в холодильнике, если хочешь сильнее.',
      },
      {
        title: 'После процедуры',
        body: 'Зарегистрированная фраза - после дерматологических процедур. Очищение, тоник, этот лист, затем остаток. Не еженедельный антивозрастной ритуал.',
      },
    ],
  },
  engine: {
    eyebrow: 'Маска',
    title: 'Глицерин 20% - цифра, которой место на карточке.',
    body:
      'Это гидрогелевый лист для лица. Глицерин - 20% пакета. Кэроб и хондрус делают гель. Название говорит пептид. Ацетилгексапептид-8 сидит на 0,05 ppm. Гиалуроновая кислота 0,0005%. Коллаген 0,002%. Они в формуле. Они не двигатель.',
    points: [
      {
        title: 'Глицерин · 20%',
        body: 'Увлажнитель. Это цифра, которой место на карточке. Почти пятая часть пакета - глицерин. Поэтому лист остаётся мокрым.',
      },
      {
        title: 'Кэроб 2,2% + хондрус 0,8%',
        body: 'Гель. Тепло тела сажает его ближе. Влага вытесняет тепло, лицо холодеет. Достаточно инновационно. Не трансдермальная система доставки и не патент у нас на руках.',
      },
      {
        title: 'Дикалия глицирризат · 0,10%',
        body: 'Соль солодки в дозе, которой ещё место в строке. Успокаивающая поддержка в геле. Не заявление о восстановлении.',
      },
      {
        title: 'Пептид сидит на 0,05 ppm',
        body: 'Ацетилгексапептид-8 - 0,05 ppm в готовом виде. Гиалуронат натрия 0,0005%. Гидролизованный коллаген 0,002%. Они в формуле. Не поэтому покупают коробку.',
      },
    ],
    figureAlt: 'Пакет GENOSYS PEPTIDE GEL MASK, бело-синий лист 38 г',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Посиди. Затем сними лист.',
    frequency: '20-40 минут · Затем снять',
    steps: [
      {
        title: 'Очищение + тоник',
        body: 'После очищения подготовь кожу тоником. Лист на спокойную кожу, не поверх средства для снятия макияжа.',
      },
      {
        title: 'Открыть',
        body: 'Открой пакет. Сними прозрачную плёнку с обеих сторон листа. Используй сразу. Так написано на упаковке.',
      },
      {
        title: 'Нанести',
        body: 'Положи на лицо и прижми. Держи в стороне от глаз и слизистых.',
      },
      {
        title: 'Подождать',
        body: 'Двадцать-сорок минут. Не пятнадцать. Не только двадцать. Ляг, если можешь, чтобы гель не съехал.',
      },
      {
        title: 'Снять',
        body: 'Сними лист. Вмассируй оставшуюся эссенцию до впитывания. Затем крем, если используешь.',
      },
    ],
    note:
      'Если есть реакция на бинты или компрессы, используй осторожно или пропусти. Держи в стороне от глаз. При контакте промой прохладной водой. Охлади пакет, если хочешь более холодное ношение.',
    videoTitle: 'Как надевают',
  },
  actives: {
    eyebrow: 'Что внутри',
    title: 'Гель, с цифрами.',
    intro: 'Карточки ниже - части листа, которые работают. Полный зарегистрированный INCI под списком.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote:
      'Каждый ингредиент, от большего к меньшему. На вашей коробке ацетилгексапептид-8 стоит сразу после хондруса, при 0,05 ppm, а эта страница следует зарегистрированной формуле.',
  },
  suited: {
    eyebrow: 'Тебе подойдёт',
    title: 'Честный ответ.',
    forTitle: 'Хороший выбор, если',
    forList: [
      'Нужен снимаемый гидрогель для лица после дерматологической процедуры',
      'Готова сидеть 20-40 минут, затем вмассировать остаток',
      'Хочешь глицерин 20% на карточке, а не пептидную историю',
      'Нужен лист для лица. Контур глаз - продукт 33',
    ],
    notTitle: 'Ищи другое, если',
    notList: [
      'Нужны ниацинамид 2% и аденозин 0,04% как двигатель. Это патч EyeCell, продукт 33',
      'Кожа повреждена, или есть реакция на бинты и компрессы',
      'Нужна история про ботокс, лифтинг или пептид как причину работы',
      'Нужен только оставляемый крем, без сидения',
      'Нужно вокруг глаз. Упаковка говорит держать в стороне',
    ],
    note: 'Только наружно. Если попало в глаз, промой прохладной водой. Прекрати и обратись к врачу при покраснении, отёке или зуде. Каждый лист - сразу после вскрытия пакета.',
  },
  routine: {
    eyebrow: 'Собери ритуал',
    title: 'Где сидит лист.',
    intro: 'Очищение, мист, этот лист, затем посткрем. Лист снимается. Остаток остаётся. Крем закрывает.',
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
        q: 'Пептиды - главные активы?',
        a: 'Нет. Готовый ацетилгексапептид-8 - 0,05 ppm. Название говорит PEPTIDE. Цифра, которой место на карточке, - глицерин 20%.',
      },
      {
        q: 'Это то же, что патч EyeCell?',
        a: 'Нет. Продукт 33 - маска для глаз, с ниацинамидом 2% и аденозином 0,04%. Это лист для лица. Ни того, ни другого функционала здесь нет. Держи в стороне от глаз.',
      },
      {
        q: 'Это запатентовано? Это доставка через кожу?',
        a: 'Английская упаковка не пишет patented и не пишет transdermal. Тепло тела сажает гель ближе. Влага вытесняет тепло. Это ношение, не система доставки, на которую у нас есть патент.',
      },
      {
        q: 'Сколько держать?',
        a: 'Двадцать-сорок минут, затем снять. Так на английской упаковке. Не пятнадцать-двадцать и не только двадцать.',
      },
      {
        q: 'Обязательно с LED?',
        a: 'Нет. Английская упаковка лампу не упоминает. В некоторых протоколах кабинета охлаждающий лист сидит с лампой. Это опция, не требование.',
      },
      {
        q: 'Это без отдушки?',
        a: 'Parfum в формуле нет. Экстракт юдзу и касторовое масло есть. Страница не пишет «без отдушки».',
      },
      {
        q: 'Можно при беременности?',
        a: 'Английская упаковка не пишет ни «избегать», ни «безопасно при беременности». Спроси врача. Эта страница не выдумывает ни одну из строк.',
      },
      {
        q: 'Держать в холодильнике?',
        a: 'Можно. Упаковка говорит, что охлаждённый лист холодит сильнее. Это совет, не правило.',
      },
    ],
  },
  details: {
    eyebrow: 'Спецификация',
    title: 'Что ты покупаешь.',
    rows: [
      { label: 'Форма', value: 'Гидрогелевый лист для лица, сетка в комплекте' },
      { label: 'Размер', value: '38 г / 1,34 унции × 5 листов' },
      { label: 'Функция', value: 'Увлажнение, успокоение. После дерматологической процедуры' },
      { label: 'Ношение', value: '20-40 минут, затем снять. Вмассировать остаток' },
      { label: 'pH', value: '5,62, внутри спецификации 5,0-7,0' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG' },
      { label: 'Тест', value: 'Дерматологически протестировано' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Охлаждение, с цифрами на карточке.',
    body: 'Пять листов. Глицерин 20%. Двадцать-сорок минут. Затем снимается.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const COPY: Record<PeptideGelLocale, PeptideGelCopy> = {
  en: EN,
  ar: PEPTIDE_GEL_AR_COPY,
  ru: PEPTIDE_GEL_RU_COPY,
}

export function getPeptideGelCopy(locale: string): PeptideGelCopy {
  if (locale === 'ar' || locale === 'ru') return COPY[locale]
  return COPY.en
}
