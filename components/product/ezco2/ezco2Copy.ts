import { EZ_CO2_AR_COPY, EZ_CO2_RU_COPY } from './ezco2LocalizedCopy'

/**
 * Bespoke copy for the EZ CO₂ MASK KIT page (product 38).
 *
 * Same self-contained per-locale pattern as epiCopy.ts, so the dedicated
 * layout ships EN/AR/RU without adding keys to the shared messages bundles.
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Documents that cover every figure on this page:
 *
 *   Intertek_folder/Quali-quanti Ingredients/GENOSYS EZ CO2 GEL.pdf
 *   Intertek_folder/Quali-quanti Ingredients/GENOSYS EZ CO2 MASK.pdf
 *       Finished concentrations. Every percentage comes from here.
 *   Registration DOC/SA/SA-GENOSYS EZ CO2 MASK KIT (GEL+MASK).pdf
 *       Two-part kit, rinse-off after 10 minutes, gel pH 2.0-3.0 opaque
 *       gel, mask pH 7.7-8.7 transparent liquid, patch test
 *       non-irritant / non-sensitizing. PAO is not documented - do not
 *       invent one. Do not print the lab id or the lot codes.
 *   Registration DOC/Artwork/[GENOSYS]EZ CO2 MASK.pdf
 *       Bohr Effect sentence, function line, 10-minute English / French
 *       / Korean how-to, sparkling 20-30 seconds, contents
 *       Gel 20g ×5 / Mask 12g ×5 / Spatula ×1, do not refrigerate,
 *       avoid UV after, coated side upward. Turkish 20 minutes and
 *       Russian 10+5 are drifted - do not follow them.
 *   Registration DOC/Formula/Formula-GENOSYS EZ CO2 GEL.pdf
 *   Registration DOC/Formula/Formula-GENOSYS EZ CO2 MASK.pdf
 *       Registered INCI, DTS MG as registrant.
 *   DTS MG deck: public/documents/PPT/Genosys Ez Co2 Mask.pdf
 *       5 treatments, 5-10 minutes, before/after photos. No quantified
 *       clinical figures. Slimming / fat / 7-day pages are cut.
 *
 * THE FORMULA, as finished concentrations that matter on this page:
 *
 *   GEL
 *     Carbomer                                         3.940%
 *     Chamomilla Recutita Flower Extract               0.300%
 *     Butylene Glycol                                  0.300%
 *     Portulaca Oleracea Extract                       0.210%
 *     Citrus Paradisi Fruit Extract                    0.100%
 *     Rosemary / Polygonum / Licorice / Scutellaria /
 *       Centella / Green tea                           0.020% each
 *     No Lactic Acid. No Parfum. No Sodium Bicarbonate.
 *
 *   MASK
 *     Sodium Bicarbonate                               9.000%
 *     Dipropylene Glycol                               0.500%
 *     Lactic Acid                                      0.330%
 *     Portulaca Oleracea Extract                       0.300%
 *     Disodium EDTA                                    0.300%
 *     Citrus Paradisi Fruit Extract                    0.100%
 *     Scutellaria                                      0.010%
 *     Remaining botanicals                             0.020% each
 *     No Parfum.
 *
 * THE DISTINCTIVE FACT, which is why this page exists.
 *
 * This is a two-part carboxy kit. The gel is an acidic carbomer base.
 * The sheet carries sodium bicarbonate at 9%. They meet on dry skin,
 * CO₂ forms, you wait ten minutes, you rinse. That is the product.
 * Five treatments in the box, and a spatula. Bohr Effect is the
 * manufacturer's name for the oxygen-delivery story. It is not a
 * measured blood-flow study.
 *
 * Live English, Arabic and Russian still sold 15-20 or 20-30 minutes,
 * a peptide mask in the kit, lactic acid as a gel hero, anti-blemish
 * as an acne treatment, and clinic results at home.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Professional carboxy mask / Bohr Effect            artwork
 *   Firming and brightening look                       artwork EN
 *   Skin revitalizing / texture refining / contour     artwork function
 *   Clean dry skin, gel, mask coated side up, 10 min   artwork + SA
 *   Sparkling 20-30 seconds is normal                  artwork
 *   Standard 1× / week, intensive 2× / week            artwork
 *   Gel 20g ×5, Mask 12g ×5, Spatula ×1                artwork
 *   Sodium Bicarbonate 9%, Carbomer 3.94%,
 *     Lactic Acid 0.33% in the mask                    Quali-quanti
 *   Gel pH 2.2 inside 2.0-3.0; mask 8.16 inside 7.7-8.7  COA / SA
 *   Dermatologically tested                            artwork / SA
 *   Do not refrigerate; use at once after opening      artwork
 *   Avoid UV after; keep off eyes, scars, wounds       artwork
 *   Made in Korea by DTS MG                            formula / artwork
 *
 * DELIBERATE OMISSIONS
 *   - 15-20 / 20-30 MINUTES. Artwork and SA are 10.
 *   - PEPTIDE MASK IN THE KIT. Not on the artwork.
 *   - LACTIC ACID AS A GEL HERO. It is in the mask at 0.33%.
 *   - SLIMMING, FAT METABOLIZED, CHEEK CONTOUR AS FAT LOSS.
 *   - ANTI-INFLAMMATION, BLOOD-FLOW IMPROVEMENT, CELLULAR
 *     ACTIVATION, ANTI-AGEING as results. Deck language.
 *   - 7-DAY MIRACLE SCHEDULE. Deck only, no study.
 *   - CLINIC / SALON AT HOME. PROFESSIONAL is a line mark.
 *   - ANTI-BLEMISH AS ACNE TREATMENT.
 *   - WOUND HEALING / REPAIR / CIRCULATION BOOST.
 *   - FRAGRANCE-FREE. No Parfum, but grapefruit extract is in both.
 *   - ALL SKIN TYPES INCLUDING SENSITIVE as a blanket.
 *   - CLINICAL PERCENTAGES. Deck has photos, not numbers.
 *   - PAO. SA says it is not documented.
 *   - LOT CODES. Never print WOA002, WOA017.
 *   - THE CONTRACT MANUFACTURER. DTS MG only.
 */

export type EzCo2Locale = 'en' | 'ar' | 'ru'

export interface EzCo2Copy {
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

/** Registered formula INCI, gel then mask, in the order the signed
 *  formula sheets use. The page does not claim this matches every
 *  language panel on the carton. */
export const FULL_INCI =
  'Gel: Aqua (Water), Carbomer, Portulaca Oleracea Extract, Rosmarinus ' +
  'Officinalis (Rosemary) Leaf Extract, Chamomilla Recutita (Matricaria) ' +
  'Flower Extract, Polygonum Cuspidatum Root Extract, Glycyrrhiza Glabra ' +
  '(Licorice) Root Extract, Scutellaria Baicalensis Root Extract, Centella ' +
  'Asiatica Extract, Camellia Sinensis Leaf Extract, Citrus Paradisi ' +
  '(Grapefruit) Fruit Extract, Butylene Glycol. ' +
  'Mask: Aqua (Water), Sodium Bicarbonate, Lactic Acid, Portulaca Oleracea ' +
  'Extract, Dipropylene Glycol, Disodium EDTA, Rosmarinus Officinalis ' +
  '(Rosemary) Leaf Extract, Chamomilla Recutita (Matricaria) Flower Extract, ' +
  'Polygonum Cuspidatum Root Extract, Glycyrrhiza Glabra (Licorice) Root ' +
  'Extract, Scutellaria Baicalensis Root Extract, Centella Asiatica Extract, ' +
  'Camellia Sinensis Leaf Extract, Citrus Paradisi (Grapefruit) Fruit ' +
  'Extract, Butylene Glycol.'

const EN: EzCo2Copy = {
  eyebrow: 'Carboxy kit · Gel + sheet',
  headline: 'Gel. Mask. Ten minutes.',
  subheadline:
    'An acidic gel and a bicarbonate sheet meet on dry skin. CO₂ forms, you wait ten minutes, you rinse. Five treatments in the box.',
  heroBullets: [
    'On clean, dry skin. Gel first, then the sheet, coated side up',
    'Sodium bicarbonate 9% in the mask is the reaction partner',
    'Ten minutes, then rinse. Once a week, or twice on the intensive programme',
    'Gel 20g ×5, mask 12g ×5, spatula ×1',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '5 treatments', 'Once or twice a week'],
  packSize: '5 treatments',
  usageNote: 'Once a week, or twice intensive',
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
    { value: '10 min', label: 'Then rinse' },
    { value: '9%', label: 'Sodium bicarbonate in the mask' },
    { value: '5×', label: 'Treatments in the kit' },
    { value: '1–2×', label: 'A week' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Meet. Activate. Rinse.',
    intro:
      'Three moves: the gel lays the acidic base, the sheet brings the bicarbonate, and ten minutes later you wash it off.',
    cards: [
      {
        title: 'Meet',
        body: 'A full 20g tube of gel, spread with the spatula. Then the sheet, coated side facing out, pressed close.',
      },
      {
        title: 'Activate',
        body: 'Where gel and sheet touch, fine CO₂ forms. A brief sparkling for 20 to 30 seconds is the normal start, not a fault.',
      },
      {
        title: 'Rinse',
        body: 'Ten minutes, then the sheet comes off and the face is cleansed gently. Mist and cream next. Keep strong sun off the skin afterwards.',
      },
    ],
  },
  engine: {
    eyebrow: 'The kit',
    title: 'The reaction is the product.',
    body:
      'The gel is an acidic carbomer base. The sheet carries sodium bicarbonate at 9%. They are useless apart. Together they make the CO₂. Bohr Effect is the manufacturer\'s name for that oxygen-delivery story. It is not a blood-flow study.',
    points: [
      {
        title: 'Sodium bicarbonate · 9%',
        body: 'The reaction partner in the sheet. This is the figure that belongs on a card. Without it there is no CO₂.',
      },
      {
        title: 'The gel that starts it',
        body: 'Carbomer 3.94% makes the cushion. The gel sits at pH 2.2, inside a 2.0 to 3.0 specification. The sheet sits alkaline. That gap is the chemistry.',
      },
      {
        title: 'Lactic acid · 0.33%',
        body: 'In the mask, not the gel. A skin-conditioning acid at a level that belongs on a card. It is not why the bubbles form.',
      },
      {
        title: 'Botanical calm',
        body: 'Chamomile at 0.3% in the gel, portulaca in both, licorice in both. They sit in the formulas. They are not the engine.',
      },
    ],
    figureAlt: 'GENOSYS EZ CO₂ MASK KIT, gel tubes and mask sachets, five treatments',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Dry skin. Gel. Sheet. Ten minutes.',
    frequency: 'Standard once a week · Intensive twice a week',
    steps: [
      {
        title: 'Dry',
        body: 'Cleanse, then dry the face thoroughly. The gel is for dry skin, not a wet face.',
      },
      {
        title: 'Gel',
        body: 'One 20g tube, spread evenly with the spatula.',
      },
      {
        title: 'Sheet',
        body: 'Open the pouch and lay the mask close to the face, coated side upward.',
      },
      {
        title: 'Wait',
        body: 'Ten minutes. Sparkling for 20 to 30 seconds at the start is normal.',
      },
      {
        title: 'Rinse',
        body: 'Remove the sheet and cleanse gently. Then mist and cream. Keep strong sun off the skin afterwards.',
      },
    ],
    note:
      'Use the opened tube and pouch at once. Do not put the kit in the fridge. Keep it off the eyes, off scars and off broken skin. If bandages bother you, go slowly.',
    videoTitle: 'See the ritual',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'Two formulas, with the figures.',
    intro:
      'The cards below are the parts of the gel and the sheet that do the work. The complete registered INCI for both is under the list.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'Every ingredient in the gel first, then every ingredient in the mask.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Honest answer.',
    forTitle: 'A good fit if',
    forList: [
      'Skin looks dull or tired and you want a weekly carboxy step',
      'You can keep ten minutes free, then rinse',
      'You will use it on dry skin, gel first, sheet second',
      'You want five treatments in one box, not a daily cream',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'Skin is broken, scarred, or already stinging',
      'Bandages or compresses bother you',
      'You want a 20-minute leave-on. The directions are ten',
      'You want slimming or fat-loss. That is not this kit',
      'You want a peptide sheet inside the box. The kit is gel, mask and a spatula',
    ],
    note: 'For external use only. If it reaches the eyes, rinse with cool water. Stop and speak to a doctor if swelling appears.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'What to put it with.',
    intro:
      'A carboxy kit is a weekly step. Cleanse, treat, then mist and cream so the new surface stays comfortable.',
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
        q: 'How long do I leave it on?',
        a: 'Ten minutes, then rinse. Not fifteen, not twenty, not thirty. A brief sparkling for 20 to 30 seconds at the start is normal.',
      },
      {
        q: 'How often?',
        a: 'Once a week as standard. Twice a week on the intensive programme. More often is not a faster result.',
      },
      {
        q: 'Wet skin or dry?',
        a: 'Dry. Cleanse, dry thoroughly, then the gel. On a wet face the sheet cannot sit the same way.',
      },
      {
        q: 'Is there a peptide mask in the kit?',
        a: 'No. The box is five gels, five sheets and one spatula.',
      },
      {
        q: 'Is the lactic acid in the gel?',
        a: 'No. Lactic acid is 0.33% in the mask. The gel is a carbomer base. The bicarbonate in the sheet is the reaction partner.',
      },
      {
        q: 'Can I keep it in the fridge?',
        a: 'No. Cool and dry, not refrigerated. Use each tube and pouch as soon as you open them.',
      },
      {
        q: 'Will it slim my face?',
        a: 'No. This is a carboxy look for brightness, firmness and texture. It is not a fat-loss treatment.',
      },
      {
        q: 'What do I put on after?',
        a: 'Mist, then cream. Keep strong sun off the skin after the treatment.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details.',
    rows: [
      { label: 'Format', value: 'Two-part carboxy kit, gel + sheet' },
      { label: 'Contents', value: 'Gel 20g ×5, mask 12g ×5, spatula ×1' },
      { label: 'When', value: 'Once a week, or twice intensive' },
      { label: 'Application', value: 'Clean dry skin, ten minutes, rinse' },
      { label: 'Gel pH', value: '2.2, inside a 2.0 to 3.0 specification' },
      { label: 'Mask pH', value: '8.16, inside a 7.7 to 8.7 specification' },
      { label: 'After opening', value: 'Use at once. Do not refrigerate' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'Gel. Mask. Ten minutes.',
    body: 'Five treatments. The reaction happens when they meet.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const AR: EzCo2Copy = {
  eyebrow: 'طقم كاربوكسي · جل + ورقة',
  headline: 'جل. قناع. عشر دقائق.',
  subheadline:
    'جل حمضي وورقة بيكربونات يلتقيان على بشرة جافة. يتكوّن CO₂، تنتظرين عشر دقائق، ثم تشطفين. خمس جلسات في العلبة.',
  heroBullets: [
    'على بشرة نظيفة جافة. الجل أولًا، ثم الورقة، الوجه المطلي للأعلى',
    'بيكربونات الصوديوم ٩٪ في القناع هي شريك التفاعل',
    'عشر دقائق ثم اشطفي. مرة في الأسبوع، أو مرتين في البرنامج المكثّف',
    'جل ٢٠ غ ×٥، قناع ١٢ غ ×٥، ملعقة ×١',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', '٥ جلسات', 'مرة أو مرتين في الأسبوع'],
  packSize: '٥ جلسات',
  usageNote: 'مرة في الأسبوع، أو مرتين مكثّف',
  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّل الدخول للتسوق',
  outOfStock: 'نفد المخزون',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني فوق ١٬٠٠٠ درهم · الشحن من دبي',
  stats: [
    { value: '١٠ د', label: 'ثم اشطفي' },
    { value: '٩٪', label: 'بيكربونات الصوديوم في القناع' },
    { value: '٥×', label: 'جلسات في الطقم' },
    { value: '١–٢×', label: 'في الأسبوع' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'يلتقيان. يتفعّل. يُشطف.',
    intro:
      'ثلاث حركات: الجل يضع القاعدة الحمضية، الورقة تأتي بالبيكربونات، وبعد عشر دقائق تغسلين.',
    cards: [
      {
        title: 'يلتقيان',
        body: 'أنبوب جل ٢٠ غ كامل، يُفرَد بالملعقة. ثم الورقة، الوجه المطلي للخارج، تُضغط بإحكام.',
      },
      {
        title: 'يتفعّل',
        body: 'حيث يلمس الجل الورقة يتكوّن CO₂ دقيق. وخز فقاعي ٢٠ إلى ٣٠ ثانية في البداية أمر طبيعي، لا عيب.',
      },
      {
        title: 'يُشطف',
        body: 'عشر دقائق، ثم تُنزع الورقة ويُنظَّف الوجه برفق. بعدها الرذاذ والكريم. أبعدي الشمس القوية بعد الجلسة.',
      },
    ],
  },
  engine: {
    eyebrow: 'الطقم',
    title: 'التفاعل هو المنتج.',
    body:
      'الجل قاعدة كربومر حمضية. الورقة تحمل بيكربونات الصوديوم بنسبة ٩٪. منفصلين لا يعملان. معًا يصنعان CO₂. تأثير بور هو الاسم الذي تُروى به قصة توصيل الأكسجين. ليست دراسة لتدفّق الدم.',
    points: [
      {
        title: 'بيكربونات الصوديوم · ٩٪',
        body: 'شريك التفاعل في الورقة. هذا الرقم يستحق بطاقة. بدونه لا CO₂.',
      },
      {
        title: 'الجل الذي يبدأ',
        body: 'كربومر ٣.٩٤٪ يصنع الوسادة. الجل عند أس هيدروجيني ٢.٢ داخل مواصفة ٢.٠ إلى ٣.٠. الورقة قلوية. هذه الفجوة هي الكيمياء.',
      },
      {
        title: 'حمض اللاكتيك · ٠.٣٣٪',
        body: 'في القناع، لا في الجل. حمض لتهيئة البشرة عند مستوى يستحق بطاقة. ليس سبب الفقاعات.',
      },
      {
        title: 'هدوء نباتي',
        body: 'بابونج ٠.٣٪ في الجل، رجلة في الاثنين، عرق سوس في الاثنين. في التركيبتين. ليست المحرّك.',
      },
    ],
    figureAlt: 'طقم GENOSYS EZ CO₂ MASK KIT، أنابيب الجل وأكياس القناع، خمس جلسات',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'بشرة جافة. جل. ورقة. عشر دقائق.',
    frequency: 'عادي مرة في الأسبوع · مكثّف مرتين',
    steps: [
      {
        title: 'جفّفي',
        body: 'نظّفي، ثم جفّفي الوجه تمامًا. الجل لبشرة جافة، لا لوجه مبلول.',
      },
      {
        title: 'الجل',
        body: 'أنبوب ٢٠ غ واحد، يُفرَد بالتساوي بالملعقة.',
      },
      {
        title: 'الورقة',
        body: 'افتحي الكيس وضعي القناع ملاصقًا للوجه، الوجه المطلي للأعلى.',
      },
      {
        title: 'انتظري',
        body: 'عشر دقائق. الفقاعات ٢٠ إلى ٣٠ ثانية في البداية طبيعية.',
      },
      {
        title: 'اشطفي',
        body: 'انزعي الورقة ونظّفي برفق. ثم الرذاذ والكريم. أبعدي الشمس القوية بعد الجلسة.',
      },
    ],
    note:
      'استخدمي الأنبوب والكيس فور الفتح. لا تضعي الطقم في الثلاجة. أبعديه عن العينين والندوب والبشرة المجروحة. إن كانت الضمادات تزعجك، تمهّلي.',
    videoTitle: 'شاهدي الطقس',
  },
  actives: {
    eyebrow: 'ماذا فيه',
    title: 'تركيبتان، بالأرقام.',
    intro:
      'البطاقات أدناه هي أجزاء الجل والورقة التي تعمل. قائمة INCI المسجّلة للاثنين تحتها.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote: 'كل مكوّن في الجل أولاً، ثم كل مكوّن في القناع.',
  },
  suited: {
    eyebrow: 'هل يناسبك',
    title: 'جواب صادق.',
    forTitle: 'يناسبك إذا',
    forList: [
      'البشرة باهتة أو متعبة وتريدين خطوة كاربوكسي أسبوعية',
      'تستطيعين تخصيص عشر دقائق ثم الشطف',
      'ستضعينه على بشرة جافة، الجل أولًا ثم الورقة',
      'تريدين خمس جلسات في علبة، لا كريمًا يوميًا',
    ],
    notTitle: 'ابحثي عن غيره إذا',
    notList: [
      'البشرة مجروحة أو بندبة أو تلسع أصلًا',
      'تزعجك الضمادات أو الكمادات',
      'تريدين تركه ٢٠ دقيقة. التعليمات عشر',
      'تريدين تخسيسًا أو حرق دهون. هذا ليس هذا الطقم',
      'تريدين قناع ببتيد داخل العلبة. الطقم جل وقناع وملعقة',
    ],
    note: 'للاستخدام الخارجي فقط. إن وصل إلى العينين، اشطفي بماء بارد. توقفي وراجعي طبيباً إن ظهر تورم.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'ماذا تضعين معه.',
    intro:
      'طقم الكاربوكسي خطوة أسبوعية. نظّفي، عالجي، ثم الرذاذ والكريم كي يبقى السطح الجديد مريحًا.',
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
        q: 'كم أتركه؟',
        a: 'عشر دقائق ثم اشطفي. ليست خمس عشرة ولا عشرين ولا ثلاثين. وخز فقاعي ٢٠ إلى ٣٠ ثانية في البداية طبيعي.',
      },
      {
        q: 'كم مرة؟',
        a: 'مرة في الأسبوع عادة. مرتين في البرنامج المكثّف. الإكثار ليس نتيجة أسرع.',
      },
      {
        q: 'بشرة مبلولة أم جافة؟',
        a: 'جافة. نظّفي، جفّفي تمامًا، ثم الجل. على وجه مبلول لا تجلس الورقة بالطريقة نفسها.',
      },
      {
        q: 'هل في الطقم قناع ببتيد؟',
        a: 'لا. العلبة خمسة جل وخمس ورقات وملعقة واحدة.',
      },
      {
        q: 'هل حمض اللاكتيك في الجل؟',
        a: 'لا. حمض اللاكتيك ٠.٣٣٪ في القناع. الجل قاعدة كربومر. بيكربونات الورقة هي شريك التفاعل.',
      },
      {
        q: 'هل أحفظه في الثلاجة؟',
        a: 'لا. بارد وجاف، لا مبرّد. استخدمي كل أنبوب وكيس فور فتحهما.',
      },
      {
        q: 'هل ينحّف الوجه؟',
        a: 'لا. هذا مظهر كاربوكسي للإشراق والشد والملمس. ليس علاج حرق دهون.',
      },
      {
        q: 'ماذا أضع بعده؟',
        a: 'الرذاذ ثم الكريم. أبعدي الشمس القوية بعد الجلسة.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل.',
    rows: [
      { label: 'الشكل', value: 'طقم كاربوكسي من جزءين، جل + ورقة' },
      { label: 'المحتويات', value: 'جل ٢٠ غ ×٥، قناع ١٢ غ ×٥، ملعقة ×١' },
      { label: 'متى', value: 'مرة في الأسبوع، أو مرتين مكثّف' },
      { label: 'التطبيق', value: 'بشرة نظيفة جافة، عشر دقائق، شطف' },
      { label: 'أس هيدروجيني الجل', value: '٢.٢، داخل مواصفة ٢.٠ إلى ٣.٠' },
      { label: 'أس هيدروجيني القناع', value: '٨.١٦، داخل مواصفة ٧.٧ إلى ٨.٧' },
      { label: 'بعد الفتح', value: 'يُستخدم فورًا. لا يُبرَّد' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'المنشأ', value: 'صنع في كوريا لدى DTS MG' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'جل. قناع. عشر دقائق.',
    body: 'خمس جلسات. التفاعل يحدث عندما يلتقيان.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'كل المنتجات',
}

const RU: EzCo2Copy = {
  eyebrow: 'Карбокси-набор · Гель + лист',
  headline: 'Гель. Маска. Десять минут.',
  subheadline:
    'Кислый гель и бикарбонатный лист встречаются на сухой коже. Образуется CO₂, вы ждёте десять минут, смываете. Пять процедур в коробке.',
  heroBullets: [
    'На чистую сухую кожу. Сначала гель, затем лист покрытием вверх',
    'Бикарбонат натрия 9% в маске — партнёр реакции',
    'Десять минут, затем смыть. Раз в неделю или дважды на интенсивной программе',
    'Гель 20 г ×5, маска 12 г ×5, шпатель ×1',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', '5 процедур', 'Раз или два в неделю'],
  packSize: '5 процедур',
  usageNote: 'Раз в неделю или дважды интенсивно',
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
    { value: '10 мин', label: 'Затем смыть' },
    { value: '9%', label: 'Бикарбонат натрия в маске' },
    { value: '5×', label: 'Процедур в наборе' },
    { value: '1–2×', label: 'В неделю' },
  ],
  effects: {
    eyebrow: 'Что делает',
    title: 'Встретить. Активировать. Смыть.',
    intro:
      'Три движения: гель кладёт кислую основу, лист приносит бикарбонат, через десять минут вы смываете.',
    cards: [
      {
        title: 'Встретить',
        body: 'Полный тюбик геля 20 г, распределённый шпателем. Затем лист покрытием наружу, плотно прижатый.',
      },
      {
        title: 'Активировать',
        body: 'Там, где гель касается листа, образуется мелкий CO₂. Короткое покалывание 20–30 секунд в начале — норма, не брак.',
      },
      {
        title: 'Смыть',
        body: 'Десять минут, затем лист снимают и лицо мягко очищают. Дальше мист и крем. После процедуры берегите кожу от сильного солнца.',
      },
    ],
  },
  engine: {
    eyebrow: 'Набор',
    title: 'Реакция и есть продукт.',
    body:
      'Гель — кислая карбомерная основа. В листе бикарбонат натрия 9%. Порознь они не работают. Вместе делают CO₂. Эффект Бора — имя, которым названа история про доставку кислорода. Это не исследование кровотока.',
    points: [
      {
        title: 'Бикарбонат натрия · 9%',
        body: 'Партнёр реакции в листе. Эта цифра стоит карточки. Без неё нет CO₂.',
      },
      {
        title: 'Гель, который запускает',
        body: 'Карбомер 3,94% делает подушку. Гель при pH 2,2, в спецификации 2,0–3,0. Лист щелочной. Этот зазор и есть химия.',
      },
      {
        title: 'Молочная кислота · 0,33%',
        body: 'В маске, не в геле. Кондиционирующая кислота в количестве, которое стоит карточки. Не она даёт пузырьки.',
      },
      {
        title: 'Растительное спокойствие',
        body: 'Ромашка 0,3% в геле, портулак в обоих, солодка в обоих. Они в формулах. Они не двигатель.',
      },
    ],
    figureAlt: 'Набор GENOSYS EZ CO₂ MASK KIT, тюбики геля и саше масок, пять процедур',
  },
  howTo: {
    eyebrow: 'Как использовать',
    title: 'Сухая кожа. Гель. Лист. Десять минут.',
    frequency: 'Обычно раз в неделю · Интенсивно дважды',
    steps: [
      {
        title: 'Высушить',
        body: 'Очистите, затем тщательно высушите лицо. Гель для сухой кожи, не для мокрого лица.',
      },
      {
        title: 'Гель',
        body: 'Один тюбик 20 г, равномерно шпателем.',
      },
      {
        title: 'Лист',
        body: 'Откройте саше и плотно наложите маску, покрытием вверх.',
      },
      {
        title: 'Ждать',
        body: 'Десять минут. Покалывание 20–30 секунд в начале нормально.',
      },
      {
        title: 'Смыть',
        body: 'Снимите лист и мягко очистите. Затем мист и крем. После процедуры берегите кожу от сильного солнца.',
      },
    ],
    note:
      'Открытый тюбик и саше используйте сразу. Не ставьте набор в холодильник. Обходите глаза, шрамы и повреждённую кожу. Если вас беспокоят повязки, начинайте осторожно.',
    videoTitle: 'Как это выглядит',
  },
  actives: {
    eyebrow: 'Что внутри',
    title: 'Две формулы, с цифрами.',
    intro:
      'Карточки ниже — те части геля и листа, которые работают. Полный зарегистрированный INCI обоих под списком.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote: 'Сначала каждый ингредиент геля, затем каждый ингредиент маски.',
  },
  suited: {
    eyebrow: 'Вам подойдёт?',
    title: 'Честный ответ.',
    forTitle: 'Хороший выбор, если',
    forList: [
      'Кожа тусклая или уставшая, и нужен еженедельный карбокси-шаг',
      'Можете выделить десять минут, затем смыть',
      'Нанесёте на сухую кожу: сначала гель, потом лист',
      'Нужны пять процедур в одной коробке, а не ежедневный крем',
    ],
    notTitle: 'Ищите другое, если',
    notList: [
      'Кожа повреждена, со шрамом или уже щиплет',
      'Вас беспокоят повязки или компрессы',
      'Хотите держать 20 минут. В инструкции десять',
      'Хотите похудение или сжигание жира. Это не этот набор',
      'Ждёте пептидную маску в коробке. В наборе — гель, лист и шпатель',
    ],
    note: 'Только для наружного применения. При попадании в глаза промойте прохладной водой. Прекратите использование и обратитесь к врачу при отёке.',
  },
  routine: {
    eyebrow: 'Соберите рутину',
    title: 'С чем сочетать.',
    intro:
      'Карбокси-набор — еженедельный шаг. Очищение, процедура, затем мист и крем, чтобы новая поверхность осталась комфортной.',
    thisProduct: 'Этот продукт',
    viewProduct: 'Смотреть продукт',
    chooseOptions: 'Выбрать варианты',
    fromPrice: 'От',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Частые вопросы.',
    items: [
      {
        q: 'Сколько держать?',
        a: 'Десять минут, затем смыть. Не пятнадцать, не двадцать, не тридцать. Короткое покалывание 20–30 секунд в начале нормально.',
      },
      {
        q: 'Как часто?',
        a: 'Раз в неделю обычно. Дважды на интенсивной программе. Чаще — не быстрее.',
      },
      {
        q: 'На влажную или на сухую?',
        a: 'На сухую. Очистите, тщательно высушите, затем гель. На мокром лице лист не садится так же.',
      },
      {
        q: 'В наборе есть пептидная маска?',
        a: 'Нет. В коробке пять гелей, пять листов и один шпатель.',
      },
      {
        q: 'Молочная кислота в геле?',
        a: 'Нет. Молочная кислота 0,33% в маске. Гель — карбомерная основа. Бикарбонат в листе — партнёр реакции.',
      },
      {
        q: 'Можно в холодильник?',
        a: 'Нет. В прохладе и сухости, не в холодильнике. Каждый тюбик и саше используйте сразу после открытия.',
      },
      {
        q: 'Это сузит лицо?',
        a: 'Нет. Это карбокси-уход для сияния, плотности и текстуры. Не лечение для сжигания жира.',
      },
      {
        q: 'Что наносить после?',
        a: 'Мист, затем крем. После процедуры берегите кожу от сильного солнца.',
      },
    ],
  },
  details: {
    eyebrow: 'Спецификация',
    title: 'Подробности.',
    rows: [
      { label: 'Формат', value: 'Двухкомпонентный карбокси-набор, гель + лист' },
      { label: 'Состав набора', value: 'Гель 20 г ×5, маска 12 г ×5, шпатель ×1' },
      { label: 'Когда', value: 'Раз в неделю или дважды интенсивно' },
      { label: 'Нанесение', value: 'Чистая сухая кожа, десять минут, смыть' },
      { label: 'pH геля', value: '2,2, в спецификации 2,0–3,0' },
      { label: 'pH маски', value: '8,16, в спецификации 7,7–8,7' },
      { label: 'После вскрытия', value: 'Использовать сразу. Не охлаждать' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Гель. Маска. Десять минут.',
    body: 'Пять процедур. Реакция начинается, когда они встречаются.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const COPY: Record<EzCo2Locale, EzCo2Copy> = {
  en: EN,
  ar: { ...AR, ...EZ_CO2_AR_COPY },
  ru: { ...RU, ...EZ_CO2_RU_COPY },
}

export function getEzCo2Copy(locale: string): EzCo2Copy {
  if (locale === 'ar' || locale === 'ru') return COPY[locale]
  return EN
}
