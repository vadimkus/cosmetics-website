/**
 * Bespoke copy for the MULTI VITA RADIANCE SERUM page (product 21).
 *
 * SOURCING RULE FOR THIS FILE
 *
 * Four documents cover every figure on this page:
 *
 *   Multi Vita Radiance Serum/Formula-GENOSYS MULTI VITA RADIANCE SERUM.pdf
 *       The current DTS MG formula, signed by the R&D manager.
 *   Multi Vita Radiance Serum/Pics/Artwork-MULTI VITA RADIANCE SERUM 30ml.pdf
 *       Function (skin brightening), application (apply on the face and
 *       gently pat, morning and evening), 30ml, precautions, and the reason
 *       this page exists: the ingredient list prints the dose of every
 *       vitamin in ppm or ppb. The Korean panel registers it as a whitening
 *       functional cosmetic and names the functional active as niacinamide.
 *       The Turkish panel carries two warnings the English one does not.
 *   Multi Vita Radiance Serum/COA-GENOSYS MULTI VITA RADIANCE SERUM 30ml.pdf
 *       pH 5.94 against 6.1 +/- 0.5, viscosity 1,580 against 1,500 +/- 300.
 *       Do not print the lot code, and do not name the plant.
 *   public/documents/PPT/GENOSYS MULTI VITA RADIANCE SERUM.pdf
 *       The DTS MG deck. Source for MELAZERO by name and composition, for
 *       the two-week melanin trial, for the 21-woman panel, and for the
 *       stinging warning and the refrigeration tip.
 *
 * THE DOSES, EXACTLY AS THE CARTON PRINTS THEM:
 *
 *   Niacinamide                20,000 ppm   = 2%
 *   Panthenol                  10,000 ppm   = 1%
 *   3-O-Ethyl Ascorbic Acid     1,000 ppm   = 0.1%
 *   Tocopherol                    300 ppm   = 0.03%
 *   Sodium Ascorbyl Phosphate      50 ppb
 *   Glutathione                     1 ppb
 *   Biotin                          1 ppb
 *   Folic Acid                      1 ppb
 *   Pyridoxine                      1 ppb
 *   Cyanocobalamin                0.1 ppb
 *   Linoleic Acid                0.01 ppb
 *   Riboflavin                   0.01 ppb
 *   Beta-Carotene                0.01 ppb
 *   Inositol                     0.01 ppb
 *   Thiamine HCl                 0.01 ppb
 *
 * THE REST OF THE FORMULA THAT MATTERS:
 *
 *   Butylene Glycol            12.150%
 *   Glycerin                    5.000%
 *   1,2-Hexanediol              2.027%
 *   Dipropylene Glycol          2.000%
 *   Sorbitol                    1.200%
 *   Methyl Gluceth-10           1.100%
 *   Propanediol                 0.998%
 *   Eriobotrya Japonica Leaf    0.040%   MELAZERO
 *   Mentha Viridis (Spearmint)  0.010%   MELAZERO
 *   Licorice / Centella /
 *     Andrographis / Propolis   0.010% each
 *   Bergamot Fruit Oil          0.0164%
 *   Limonene / Linalool         0.0081% / 0.0055%
 *   Gluconolactone              0.000001%  = 10 ppb
 *
 * THE DISTINCTIVE FACT, which is why this page exists.
 *
 * The carton prints the dose of every vitamin, and the picture it paints is
 * the honest one: four are at working doses and eleven are at parts per
 * billion. Niacinamide at 20,000 ppm is not a supporting act, it is the
 * product, and the Korean registration agrees: this is filed as a whitening
 * functional cosmetic with niacinamide named as the functional active.
 *
 * So the twelve-vitamin count is real as a count and misleading as a
 * hierarchy. The page prints the ladder instead, because a shopper who can
 * see 20,000 ppm next to 0.01 ppb learns more in five seconds than any
 * amount of copy can teach them.
 *
 * MELAZERO IS REAL. The deck names it, states the patent, and gives the
 * composition: loquat leaf extract and spearmint extract in propanediol and
 * 1,2-hexanediol. The two botanicals sit at 0.04% and 0.01% in the formula,
 * which is modest but nowhere near trace. Same rule as Hyaluronan 11 on
 * product 29: name the branded complex, show what is inside it.
 *
 * CLAIMS THE PAGE MAKES, AND WHERE THEY COME FROM
 *   Skin brightening                       artwork function line
 *   Whitening functional cosmetic,
 *     functional active niacinamide        artwork, Korean panel
 *   Apply on the face and gently pat,
 *     morning and evening                  artwork application
 *   Every ppm and ppb figure               artwork ingredient list
 *   MELAZERO, patented, loquat and
 *     spearmint                            DTS MG deck
 *   Surface melanin 6.190 to 4.457,
 *     minus 28.0% at two weeks             DTS MG deck clinical
 *   21 women aged 20 to 59, 100%           DTS MG deck survey
 *   May sting at first, start small        DTS MG deck how-to page
 *   Not for use in pregnancy               artwork, Turkish panel
 *   Colour may darken with air; close
 *     the cap                              artwork, Turkish panel
 *   Sunscreen over it in daylight          artwork and deck
 *   pH 5.94, spec 6.1 +/- 0.5              COA (no lot)
 *   Dermatologically tested                artwork
 *
 * DELIBERATE OMISSIONS - do not add these without a document:
 *   - GLUTATHIONE AS AN ACTIVE. It is at 1 ppb. The deck gives it a page and
 *     the live copy made it a key ingredient. One part per billion.
 *   - GLUCONOLACTONE AS AN EXFOLIANT. It is at 10 ppb. It was a live
 *     ingredient card describing gentle exfoliation. Gallery s1 credits it
 *     with step 4 of the mechanism and is queued for re-export.
 *   - COLLAGEN SYNTHESIS. The deck claims it for two ingredients. No study
 *     on this product supports it.
 *   - ANTI-INFLAMMATORY. The deck names U-active P10 as an anti-inflammatory
 *     herb complex. That is drug-register language for a UAE cosmetic, and
 *     the herbs are at 0.01% and below. Name them, do not claim it.
 *   - ALL SKIN TYPES. It is a vitamin serum that the manufacturer warns may
 *     sting. Say who it suits and who should be careful.
 *   - 4 TO 6 WEEKS. Invented. The study on file measured two weeks.
 *   - MASSAGE. The carton says pat.
 *   - LOT CODES, and never the contract manufacturer. DTS MG only.
 */

import { MVSERUM_AR_COPY, MVSERUM_RU_COPY } from './mvserumLocalizedCopy'

export type MvserumLocale = 'en' | 'ar' | 'ru'

export interface MvserumCopy {
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
  clean: {
    eyebrow: string
    title: string
    intro: string
    items: string[]
    note: string
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

const EN: MvserumCopy = {
  eyebrow: 'Serum · Dull and uneven skin tone',
  headline: 'Twelve vitamins. Four of them at a dose.',
  subheadline:
    'The carton prints the number beside every one, and the ladder is worth reading: niacinamide at 20,000 ppm, panthenol at 10,000, stable vitamin C at 1,000, vitamin E at 300, and then eleven more measured in parts per billion. Korea registers this as a whitening functional cosmetic and names niacinamide as the active. Pat it in, morning and night.',
  heroBullets: [
    'Niacinamide at 20,000 ppm, printed on the carton',
    'The registered whitening active in Korea, named on the box',
    'MELAZERO®, patented, from loquat leaf and spearmint',
    'Surface melanin down 28.0% in two weeks in the maker\'s trial',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', '30ml dropper', 'Morning and night'],
  packSize: '30ml',
  usageNote: 'Morning and night, with sunscreen by day',
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
    { value: '20,000', label: 'ppm niacinamide, the registered active' },
    { value: '−28.0%', label: 'Surface melanin at two weeks, in the maker\'s trial' },
    { value: '1,000', label: 'ppm stable vitamin C, printed on the carton' },
    { value: '30ml', label: 'Dropper bottle, morning and night' },
  ],
  effects: {
    eyebrow: 'What it does',
    title: 'Four ways at one problem.',
    intro:
      'Melanin is made, then handed to the cells above, then shows up as tone. The serum works at more than one point on that chain, which is why the ingredient list looks the way it does.',
    cards: [
      {
        title: 'Slow the making',
        body: 'MELAZERO® and stable vitamin C at 1,000 ppm work on the synthesis end. Licorice root sits alongside them.',
      },
      {
        title: 'Block the handover',
        body: 'Niacinamide at 20,000 ppm. This is the largest active in the bottle and the one Korea registers the whitening claim on.',
      },
      {
        title: 'Keep the skin comfortable',
        body: 'Panthenol at 10,000 ppm, which is the reason a vitamin serum this loaded does not have to leave the face tight.',
      },
    ],
  },
  engine: {
    eyebrow: 'The ladder',
    title: 'Read the doses. They are all on the box.',
    body:
      'Very few brands print how much of each vitamin they used, and there is a reason for that. This carton prints all fifteen. Four are in parts per million and eleven are in parts per billion, and once you can see that laid out, the phrase twelve vitamin complex means something honest rather than something vague.',
    points: [
      {
        title: 'Niacinamide 20,000 ppm',
        body: 'Two percent, and the functional active named on the Korean registration. Everything else on this list is supporting it.',
      },
      {
        title: 'Panthenol 10,000 ppm',
        body: 'One percent of provitamin B5. It is the comfort half and the reason the texture reads as a glow rather than a sting.',
      },
      {
        title: '3-O-Ethyl Ascorbic Acid 1,000 ppm',
        body: 'A tenth of a percent of one of the more stable vitamin C derivatives. A real but modest dose, and the page will not pretend otherwise.',
      },
      {
        title: 'MELAZERO® · loquat 0.04% and spearmint 0.01%',
        body: 'The patented complex, and unusually for a branded name it is not a trace: the two botanicals are at four hundred and one hundred parts per million.',
      },
      {
        title: 'The other eleven vitamins, 1 ppb and below',
        body: 'Glutathione, biotin, folic acid, B6, B12, B1, B2, beta-carotene, inositol, linoleic acid. Real, listed, printed with their doses, and not doing the work. The carton says so before we do.',
      },
    ],
    figureAlt: 'The Multi Vita radiance complex, led by niacinamide at 20,000 ppm',
  },
  clean: {
    eyebrow: 'The proof',
    title: 'What the trial measured.',
    intro:
      'One clinical and one panel, both run by the manufacturer, and both about tone.',
    items: [
      'Skin surface melanin fell from 6.190 to 4.457 after two weeks of use',
      'That is a 28.0% improvement on the measure they took',
      '21 women, aged 20 to 59, in the satisfaction panel',
      '100% said skin tone had become even',
      '100% reported no dryness or inner tightness',
      '100% felt no irritation on the skin',
    ],
    note:
      'Two weeks is what was measured, so two weeks is what the page claims. There is no four-week or six-week figure and no wrinkle, pore or firmness study behind this bottle.',
  },
  howTo: {
    eyebrow: 'How to use',
    title: 'Pat it in. Start small.',
    frequency: 'Morning and night',
    steps: [
      {
        title: 'Cleanse and tone',
        body: 'Start on clean skin with a toner down first.',
      },
      {
        title: 'Two or three drops, patted in',
        body: 'On the face, avoiding the eye area. The carton asks for patting rather than rubbing.',
      },
      {
        title: 'Go slowly at first',
        body: 'The manufacturer is direct about this: it contains active vitamins and you may feel a sting. Use a small amount to begin with and give your skin time to adjust. If the irritation carries on, stop.',
      },
      {
        title: 'Sunscreen over it by day',
        body: 'Non-negotiable with a brightening serum. Working on tone without protecting from UV is working against yourself.',
      },
      {
        title: 'Close the cap, keep it cool',
        body: 'The carton warns the colour can darken with air exposure without the product changing how it works. The manufacturer suggests the fridge.',
      },
    ],
    note:
      'Not for use during pregnancy. That warning is on the carton, on the Turkish panel rather than the English one, and it belongs where you can actually see it.',
    videoTitle: 'See it in the bottle',
  },
  actives: {
    eyebrow: 'What is in it',
    title: 'The list, in full.',
    intro:
      'Fifty-five entries, and the useful thing about this one is that fifteen of them arrive with their dose attached.',
    inciTitle: 'Full ingredient list (INCI)',
    inciNote: 'Every ingredient, in the same order as the box in your hand, ppm and ppb figures included.',
  },
  suited: {
    eyebrow: 'Is it for you',
    title: 'Honest answer.',
    forTitle: 'A good fit if',
    forList: [
      'Your tone is uneven, or dullness is the thing you notice first',
      'You want niacinamide at a real percentage rather than a mention',
      'You are willing to wear sunscreen every day, which this serum requires',
      'You have used vitamin C before and know how your skin handles it',
      'You would rather read a dose than a marketing name',
    ],
    notTitle: 'Look elsewhere if',
    notList: [
      'You are pregnant or breastfeeding. The carton says not to use it',
      'You avoid fragrance. There is bergamot oil in this, with limonene and linalool',
      'Your skin stings easily and you are not prepared to build up slowly',
      'You expected the twelve vitamins to each be doing something. Four of them are',
    ],
    note:
      'For external use only, and keep it clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'What to put it with.',
    intro:
      'A serum is a step. These are the products it sits between, and you can add any of them here.',
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
        q: 'Twelve vitamins sounds like a lot. Is it?',
        a: 'It is twelve vitamins, and the carton prints how much of each. Four of them are in parts per million: niacinamide at 20,000, panthenol at 10,000, stable vitamin C at 1,000 and vitamin E at 300. The other eleven are in parts per billion, some as low as a hundredth of one. The count is honest, the hierarchy matters more, and we would rather you saw the ladder than the number twelve.',
      },
      {
        q: 'Is MELAZERO a real thing or a marketing name?',
        a: 'Both, in the useful sense. It is a patented complex and its composition is on record: loquat leaf extract and spearmint extract in a glycol carrier. Unlike most branded complexes, it is not a trace here. The loquat is at 0.04% and the spearmint at 0.01%, so four hundred and one hundred parts per million respectively.',
      },
      {
        q: 'Will it sting?',
        a: 'It might, and the manufacturer says so rather than hiding it. Use a small amount to start and let your skin get used to it. If the stinging carries on rather than settling, stop using it. That is their instruction and it is a sensible one.',
      },
      {
        q: 'How does it compare to the Multi Vita Radiance Cream?',
        a: 'The serum is the treatment step and the cream is the finish. This is where the niacinamide dose and the MELAZERO sit, so if you are buying one for tone, buy this one.',
      },
      {
        q: 'Do I really need sunscreen with it?',
        a: 'Yes, and it is the single most important thing on this page. A brightening routine without daily SPF is a tap running into a bath with the plug out.',
      },
      {
        q: 'Mine has gone slightly darker. Is it off?',
        a: 'Probably not. The carton says the colour can change on exposure to air while the effect stays the same, which is normal for vitamin formulas. Close the cap properly and keep it somewhere cool. If the smell or texture changes, that is different, so stop.',
      },
      {
        q: 'What is the pH?',
        a: 'The batch on file came back at 5.94, inside a 6.1 plus or minus 0.5 specification.',
      },
    ],
  },
  details: {
    eyebrow: 'Specification',
    title: 'The details.',
    rows: [
      { label: 'Format', value: 'Leave-on face serum, dropper bottle' },
      { label: 'Net volume', value: '30ml / 1.01 fl. oz.' },
      { label: 'Function', value: 'Skin brightening' },
      { label: 'Registered active', value: 'Niacinamide, named on the Korean registration' },
      { label: 'When', value: 'Morning and night, with sunscreen by day' },
      { label: 'Skin types', value: 'Dull or uneven tone. Build up slowly if you sting easily' },
      { label: 'pH', value: '5.94, inside a 6.1 plus or minus 0.5 specification' },
      { label: 'Fragrance', value: 'Bergamot fruit oil, with limonene and linalool' },
      { label: 'Pregnancy', value: 'Not for use during pregnancy, per the carton' },
      { label: 'Storage', value: 'Cool and dark, cap closed. The fridge is fine' },
      { label: 'Testing', value: 'Dermatologically tested' },
      { label: 'Origin', value: 'Made in Korea by DTS MG' },
    ],
    barcodeLabel: 'Barcode',
  },
  closing: {
    title: 'The number that matters is on the box.',
    body: 'Niacinamide at 20,000 ppm, a patented melanin complex that is not a trace, and a two-week measurement to show for it.',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const _AR: MvserumCopy = {
  eyebrow: 'سيروم · للبشرة الباهتة وغير المتجانسة',
  headline: 'اثنا عشر فيتاميناً. أربعة منها بجرعة.',
  subheadline:
    'العلبة تطبع الرقم بجانب كل واحد، والسلّم يستحق القراءة: نياسيناميد عند ٢٠٬٠٠٠ جزء بالمليون، بانثينول عند ١٠٬٠٠٠، فيتامين C مستقر عند ١٬٠٠٠، فيتامين E عند ٣٠٠، ثم أحد عشر آخرون مقاسون بالأجزاء بالمليار. كوريا تسجّله كمستحضر تجميل وظيفي للتفتيح وتسمّي النياسيناميد فعّالاً. ربّتيه صباحاً ومساءً.',
  heroBullets: [
    'نياسيناميد عند ٢٠٬٠٠٠ جزء بالمليون، مطبوعة على العلبة',
    'الفعّال المسجّل للتفتيح في كوريا، مذكور على العلبة',
    'MELAZERO® الحاصل على براءة، من لحاء البشملة والنعناع',
    'ميلانين السطح أقل بـ ٢٨٫٠٪ خلال أسبوعين في تجربة المصنّع',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', 'قطارة ٣٠ مل', 'صباحاً ومساءً'],
  packSize: '٣٠ مل',
  usageNote: 'صباحاً ومساءً، مع واقي الشمس نهاراً',
  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في حقيبتك',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّلي الدخول للتسوق',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'توصيل مجاني فوق ١٬٠٠٠ درهم · يُشحن من دبي',
  stats: [
    { value: '٢٠٬٠٠٠', label: 'جزء بالمليون نياسيناميد، الفعّال المسجّل' },
    { value: '−٢٨٫٠٪', label: 'ميلانين السطح عند أسبوعين، في تجربة المصنّع' },
    { value: '١٬٠٠٠', label: 'جزء بالمليون فيتامين C مستقر، مطبوعة على العلبة' },
    { value: '٣٠ مل', label: 'زجاجة بقطارة، صباحاً ومساءً' },
  ],
  effects: {
    eyebrow: 'ماذا يفعل',
    title: 'أربع طرق لمشكلة واحدة.',
    intro:
      'الميلانين يُصنع، ثم يُسلَّم للخلايا فوقه، ثم يظهر كلون. السيروم يعمل عند أكثر من نقطة في هذه السلسلة، ولهذا تبدو قائمة المكوّنات كما تبدو.',
    cards: [
      {
        title: 'إبطاء التصنيع',
        body: 'MELAZERO® وفيتامين C المستقر عند ١٬٠٠٠ جزء بالمليون يعملان عند طرف التصنيع. جذر السوس يجلس إلى جانبهما.',
      },
      {
        title: 'إيقاف التسليم',
        body: 'نياسيناميد عند ٢٠٬٠٠٠ جزء بالمليون. أكبر فعّال في الزجاجة والذي تسجّل عليه كوريا ادّعاء التفتيح.',
      },
      {
        title: 'إبقاء البشرة مرتاحة',
        body: 'بانثينول عند ١٠٬٠٠٠ جزء بالمليون، وهو السبب في أن سيروم فيتامينات بهذا الحِمل لا يضطر لترك الوجه مشدوداً.',
      },
    ],
  },
  engine: {
    eyebrow: 'السلّم',
    title: 'اقرئي الجرعات. كلها على العلبة.',
    body:
      'قليلة جداً هي العلامات التي تطبع كمية كل فيتامين استخدمته، ولذلك سبب. هذه العلبة تطبع الخمسة عشر كلها. أربعة بالأجزاء بالمليون وأحد عشر بالأجزاء بالمليار، وحين ترين ذلك مرتّباً تصبح عبارة "مركّب اثني عشر فيتاميناً" تعني شيئاً صادقاً بدل شيء غامض.',
    points: [
      {
        title: 'نياسيناميد ٢٠٬٠٠٠ جزء بالمليون',
        body: 'اثنان بالمئة، والفعّال الوظيفي المذكور في التسجيل الكوري. كل ما تبقّى في القائمة يدعمه.',
      },
      {
        title: 'بانثينول ١٠٬٠٠٠ جزء بالمليون',
        body: 'واحد بالمئة من بروفيتامين B5. هو نصف الراحة والسبب في أن القوام يُقرأ كإشراقة لا كلسعة.',
      },
      {
        title: '3-O-Ethyl Ascorbic Acid ١٬٠٠٠ جزء بالمليون',
        body: 'عُشر بالمئة من أحد أكثر مشتقات فيتامين C استقراراً. جرعة حقيقية لكن متواضعة، والصفحة لن تدّعي غير ذلك.',
      },
      {
        title: 'MELAZERO® · بشملة ٠٫٠٤٪ ونعناع ٠٫٠١٪',
        body: 'المركّب الحاصل على براءة، وبخلاف معظم الأسماء التجارية ليس أثرياً هنا: النبتتان عند أربعمئة ومئة جزء بالمليون.',
      },
      {
        title: 'الأحد عشر الباقون، جزء بالمليار فأقل',
        body: 'الجلوتاثيون والبيوتين وحمض الفوليك وB6 وB12 وB1 وB2 وبيتا كاروتين والإينوزيتول وحمض اللينوليك. حقيقية ومذكورة ومطبوعة بجرعاتها، ولا تقوم بالعمل. العلبة تقول ذلك قبلنا.',
      },
    ],
    figureAlt: 'مركّب Multi Vita للإشراق، بقيادة النياسيناميد عند ٢٠٬٠٠٠ جزء بالمليون',
  },
  clean: {
    eyebrow: 'الدليل',
    title: 'ماذا قاست التجربة.',
    intro: 'دراسة سريرية واحدة ولوحة واحدة، كلتاهما من المصنّع، وكلتاهما عن اللون.',
    items: [
      'ميلانين سطح البشرة انخفض من ٦٫١٩٠ إلى ٤٫٤٥٧ بعد أسبوعين من الاستخدام',
      'أي تحسّن بنسبة ٢٨٫٠٪ على المقياس الذي أخذوه',
      '٢١ امرأة، بأعمار من ٢٠ إلى ٥٩، في لوحة الرضا',
      '١٠٠٪ قلن إن لون البشرة أصبح متجانساً',
      '١٠٠٪ أبلغن بعدم جفاف أو شدّ داخلي',
      '١٠٠٪ لم يشعرن بأي تهيّج على البشرة',
    ],
    note:
      'أسبوعان هو ما قيس، فأسبوعان هو ما تدّعيه الصفحة. لا يوجد رقم لأربعة أو ستة أسابيع، ولا دراسة تجاعيد أو مسام أو متانة خلف هذه الزجاجة.',
  },
  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'ربّتيه. وابدئي بقليل.',
    frequency: 'صباحاً ومساءً',
    steps: [
      { title: 'التنظيف والتونر', body: 'ابدئي ببشرة نظيفة وتونر أولاً.' },
      {
        title: 'قطرتان أو ثلاث، بالتربيت',
        body: 'على الوجه، مع تجنّب محيط العين. العلبة تطلب التربيت لا الفرك.',
      },
      {
        title: 'تدرّجي في البداية',
        body: 'المصنّع صريح في هذا: يحتوي فيتامينات نشطة وقد تشعرين بلسعة. استخدمي كمية صغيرة في البداية وامنحي بشرتك وقتاً للتأقلم. وإن استمر التهيّج، توقّفي.',
      },
      {
        title: 'واقي الشمس فوقه نهاراً',
        body: 'غير قابل للتفاوض مع سيروم تفتيح. العمل على اللون دون حماية من الأشعة عمل ضد نفسك.',
      },
      {
        title: 'أغلقي الغطاء واحفظيه بارداً',
        body: 'العلبة تحذّر من أن اللون قد يغمق مع التعرّض للهواء دون أن يتغيّر عمل المنتج. المصنّع يقترح الثلاجة.',
      },
    ],
    note:
      'لا يُستخدم أثناء الحمل. هذا التحذير على العلبة، في اللوحة التركية لا الإنجليزية، ومكانه هنا حيث يمكنك رؤيته فعلاً.',
    videoTitle: 'شاهديه في الزجاجة',
  },
  actives: {
    eyebrow: 'ماذا يحتوي',
    title: 'القائمة كاملة.',
    intro:
      'خمسة وخمسون مدخلاً، والمفيد في هذه القائمة أن خمسة عشر منها تأتي وجرعتها مرفقة.',
    inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
    inciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك، مع أرقام الأجزاء بالمليون والمليار.',
  },
  suited: {
    eyebrow: 'هل هو لك',
    title: 'الجواب الصريح.',
    forTitle: 'مناسب إذا',
    forList: [
      'لون بشرتك غير متجانس، أو البهتان أول ما تلاحظينه',
      'تريدين نياسيناميد بنسبة حقيقية لا مجرّد ذكر',
      'أنت مستعدة لوضع واقي الشمس يومياً، وهو ما يتطلّبه هذا السيروم',
      'استخدمت فيتامين C من قبل وتعرفين كيف تتعامل بشرتك معه',
      'تفضّلين قراءة جرعة على قراءة اسم تسويقي',
    ],
    notTitle: 'ابحثي عن غيره إذا',
    notList: [
      'كنت حاملاً أو مرضعة. العلبة تقول لا تستخدميه',
      'كنت تتجنّبين العطر. فيه زيت البرغموت، مع ليمونين ولينالول',
      'كانت بشرتك تلسع بسهولة ولست مستعدة للتدرّج ببطء',
      'كنت تتوقّعين أن الاثني عشر فيتاميناً كلها تعمل. أربعة منها تعمل',
    ],
    note:
      'للاستخدام الخارجي فقط، وأبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج.',
  },
  routine: {
    eyebrow: 'أكملي الروتين',
    title: 'ماذا تضعين معه.',
    intro: 'السيروم خطوة. هذه المنتجات التي يجلس بينها، ويمكنك إضافة أي منها من هنا.',
    thisProduct: 'هذا المنتج',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختاري الخيارات',
    fromPrice: 'ابتداءً من',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'أسئلة متكرّرة.',
    items: [
      {
        q: 'اثنا عشر فيتاميناً يبدو كثيراً. هل هو كذلك؟',
        a: 'هي اثنا عشر فيتاميناً، والعلبة تطبع كم من كل منها. أربعة بالأجزاء بالمليون: نياسيناميد ٢٠٬٠٠٠، بانثينول ١٠٬٠٠٠، فيتامين C مستقر ١٬٠٠٠، وفيتامين E ٣٠٠. الأحد عشر الباقون بالأجزاء بالمليار، بعضهم عند جزء من مئة من الواحد. العدد صادق، والترتيب أهم، ونفضّل أن تري السلّم بدل الرقم اثني عشر.',
      },
      {
        q: 'هل MELAZERO شيء حقيقي أم اسم تسويقي؟',
        a: 'كلاهما، بالمعنى المفيد. مركّب حاصل على براءة وتركيبه مسجّل: مستخلص لحاء البشملة ومستخلص النعناع في حامل جلايكولي. وبخلاف معظم المركّبات ذات الأسماء التجارية، ليس أثرياً هنا. البشملة عند ٠٫٠٤٪ والنعناع عند ٠٫٠١٪، أي أربعمئة ومئة جزء بالمليون على التوالي.',
      },
      {
        q: 'هل سيلسع؟',
        a: 'قد يلسع، والمصنّع يقول ذلك بدل إخفائه. استخدمي كمية صغيرة في البداية ودعي بشرتك تعتاد. وإن استمرت اللسعة بدل أن تهدأ، توقّفي عن استخدامه. تلك تعليمته وهي معقولة.',
      },
      {
        q: 'كيف يقارن بكريم Multi Vita Radiance؟',
        a: 'السيروم هو خطوة العلاج والكريم هو الختام. هنا تقع جرعة النياسيناميد وMELAZERO، فإن كنت تشترين واحداً للّون، اشتري هذا.',
      },
      {
        q: 'هل أحتاج واقي الشمس معه فعلاً؟',
        a: 'نعم، وهو أهم شيء في هذه الصفحة. روتين تفتيح بلا واقٍ يومي هو صنبور يجري في حوض بلا سدادة.',
      },
      {
        q: 'لون سيرومي غمق قليلاً. هل فسد؟',
        a: 'على الأرجح لا. العلبة تقول إن اللون قد يتغيّر عند التعرّض للهواء بينما يبقى الأثر كما هو، وهذا طبيعي لتركيبات الفيتامينات. أغلقي الغطاء جيداً واحفظيه في مكان بارد. أما إن تغيّرت الرائحة أو القوام فذلك أمر مختلف، فتوقّفي.',
      },
      {
        q: 'ما درجة الحموضة؟',
        a: 'الدفعة المسجّلة جاءت عند ٥٫٩٤، داخل مواصفة ٦٫١ زائد أو ناقص ٠٫٥.',
      },
    ],
  },
  details: {
    eyebrow: 'المواصفات',
    title: 'التفاصيل.',
    rows: [
      { label: 'الشكل', value: 'سيروم وجه يُترك على البشرة، زجاجة بقطارة' },
      { label: 'الحجم', value: '٣٠ مل / ١٫٠١ أونصة سائلة' },
      { label: 'الوظيفة', value: 'تفتيح البشرة' },
      { label: 'الفعّال المسجّل', value: 'نياسيناميد، مذكور في التسجيل الكوري' },
      { label: 'متى', value: 'صباحاً ومساءً، مع واقي الشمس نهاراً' },
      { label: 'أنواع البشرة', value: 'لون باهت أو غير متجانس. تدرّجي ببطء إن كانت بشرتك تلسع' },
      { label: 'درجة الحموضة', value: '٥٫٩٤، داخل مواصفة ٦٫١ زائد أو ناقص ٠٫٥' },
      { label: 'العطر', value: 'زيت ثمرة البرغموت، مع ليمونين ولينالول' },
      { label: 'الحمل', value: 'لا يُستخدم أثناء الحمل، بحسب العلبة' },
      { label: 'التخزين', value: 'بارد ومظلم، والغطاء مغلق. الثلاجة مناسبة' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'المنشأ', value: 'صنع في كوريا من DTS MG' },
    ],
    barcodeLabel: 'الباركود',
  },
  closing: {
    title: 'الرقم الذي يهمّ مطبوع على العلبة.',
    body: 'نياسيناميد عند ٢٠٬٠٠٠ جزء بالمليون، ومركّب ميلانين حاصل على براءة وليس أثرياً، وقياس بعد أسبوعين يشهد على ذلك.',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'كل المنتجات',
}

const _RU: MvserumCopy = {
  eyebrow: 'Сыворотка · Тусклый и неровный тон',
  headline: 'Двенадцать витаминов. Четыре из них в дозе.',
  subheadline:
    'Упаковка печатает число рядом с каждым, и лестницу стоит прочитать: ниацинамид 20 000 ppm, пантенол 10 000, стабильный витамин C 1 000, витамин E 300, а дальше ещё одиннадцать, измеренных в частях на миллиард. Корея регистрирует средство как отбеливающее функциональное и называет активом ниацинамид. Вбивайте утром и вечером.',
  heroBullets: [
    'Ниацинамид 20 000 ppm, напечатано на упаковке',
    'Зарегистрированный в Корее осветляющий актив, назван на коробке',
    'MELAZERO®, запатентован, из листа мушмулы и мяты',
    'Поверхностный меланин ниже на 28,0% за две недели в исследовании производителя',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', 'Пипетка 30 мл', 'Утром и вечером'],
  packSize: '30 мл',
  usageNote: 'Утром и вечером, днём с SPF',
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
    { value: '20 000', label: 'ppm ниацинамида, зарегистрированный актив' },
    { value: '−28,0%', label: 'Поверхностный меланин на второй неделе, у производителя' },
    { value: '1 000', label: 'ppm стабильного витамина C, напечатано на упаковке' },
    { value: '30 мл', label: 'Флакон с пипеткой, утром и вечером' },
  ],
  effects: {
    eyebrow: 'Что она делает',
    title: 'Четыре подхода к одной задаче.',
    intro:
      'Меланин сначала синтезируется, затем передаётся клеткам выше, затем проявляется как тон. Сыворотка работает больше чем в одной точке этой цепочки, поэтому состав выглядит так, как выглядит.',
    cards: [
      {
        title: 'Замедлить синтез',
        body: 'MELAZERO® и стабильный витамин C на 1 000 ppm работают на этапе синтеза. Рядом с ними корень солодки.',
      },
      {
        title: 'Прервать передачу',
        body: 'Ниацинамид 20 000 ppm. Самый крупный актив во флаконе и тот, на котором Корея регистрирует осветляющее заявление.',
      },
      {
        title: 'Сохранить комфорт',
        body: 'Пантенол 10 000 ppm - причина, по которой настолько заряженная витаминами сыворотка не обязана оставлять лицо стянутым.',
      },
    ],
  },
  engine: {
    eyebrow: 'Лестница',
    title: 'Прочитайте дозы. Они все на коробке.',
    body:
      'Очень немногие бренды печатают, сколько каждого витамина они положили, и на это есть причина. Эта упаковка печатает все пятнадцать. Четыре в частях на миллион и одиннадцать в частях на миллиард, и когда это видно списком, фраза «комплекс из двенадцати витаминов» начинает означать нечто честное вместо нечто расплывчатое.',
    points: [
      {
        title: 'Ниацинамид 20 000 ppm',
        body: 'Два процента, и функциональный актив, названный в корейской регистрации. Всё остальное в списке его поддерживает.',
      },
      {
        title: 'Пантенол 10 000 ppm',
        body: 'Один процент провитамина B5. Это половина комфорта и причина, по которой текстура читается как сияние, а не как жжение.',
      },
      {
        title: '3-O-Ethyl Ascorbic Acid 1 000 ppm',
        body: 'Одна десятая процента одного из наиболее стабильных производных витамина C. Реальная, но скромная доза, и страница не станет притворяться иначе.',
      },
      {
        title: 'MELAZERO® · мушмула 0,04% и мята 0,01%',
        body: 'Запатентованный комплекс, и, в отличие от большинства брендированных названий, здесь это не след: два растения на уровне четырёхсот и ста частей на миллион.',
      },
      {
        title: 'Остальные одиннадцать витаминов, 1 ppb и ниже',
        body: 'Глутатион, биотин, фолиевая кислота, B6, B12, B1, B2, бета-каротин, инозитол, линолевая кислота. Реальные, указанные, напечатанные с дозами, и работу делают не они. Упаковка говорит это раньше нас.',
      },
    ],
    figureAlt: 'Комплекс Multi Vita во главе с ниацинамидом 20 000 ppm',
  },
  clean: {
    eyebrow: 'Доказательства',
    title: 'Что именно измерили.',
    intro: 'Одно клиническое и одна панель, обе от производителя, и обе про тон.',
    items: [
      'Поверхностный меланин снизился с 6,190 до 4,457 за две недели использования',
      'Это улучшение на 28,0% по взятой ими метрике',
      '21 женщина в возрасте от 20 до 59 лет в панели удовлетворённости',
      '100% отметили, что тон кожи стал ровным',
      '100% сообщили об отсутствии сухости и внутренней стянутости',
      '100% не почувствовали раздражения кожи',
    ],
    note:
      'Измерены две недели, поэтому две недели страница и заявляет. Ни четырёхнедельной, ни шестинедельной цифры нет, как нет исследования морщин, пор или плотности за этим флаконом.',
  },
  howTo: {
    eyebrow: 'Как применять',
    title: 'Вбивайте. И начните с малого.',
    frequency: 'Утром и вечером',
    steps: [
      { title: 'Очищение и тоник', body: 'Начните на чистой коже, тоник первым.' },
      {
        title: 'Две-три капли, вбить',
        body: 'На лицо, избегая области вокруг глаз. Коробка просит вбивание, а не растирание.',
      },
      {
        title: 'Первое время осторожно',
        body: 'Производитель говорит прямо: средство содержит активные витамины, и возможно ощущение жжения. Начните с малого количества и дайте коже время привыкнуть. Если раздражение продолжается, прекратите.',
      },
      {
        title: 'Днём сверху SPF',
        body: 'С осветляющей сывороткой это не обсуждается. Работать над тоном без защиты от УФ значит работать против себя.',
      },
      {
        title: 'Закрывайте крышку, держите в прохладе',
        body: 'Коробка предупреждает, что цвет может потемнеть от контакта с воздухом, при этом действие остаётся прежним. Производитель советует холодильник.',
      },
    ],
    note:
      'Не применять во время беременности. Это предупреждение есть на упаковке, на турецкой панели, а не на английской, и его место здесь, где его действительно видно.',
    videoTitle: 'Посмотрите на текстуру',
  },
  actives: {
    eyebrow: 'Что внутри',
    title: 'Состав целиком.',
    intro:
      'Пятьдесят пять позиций, и полезно в этом составе то, что пятнадцать из них приходят с указанной дозой.',
    inciTitle: 'Полный список ингредиентов (INCI)',
    inciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках, включая значения в ppm и ppb.',
  },
  suited: {
    eyebrow: 'Подойдёт ли вам',
    title: 'Честный ответ.',
    forTitle: 'Подойдёт, если',
    forList: [
      'Тон неровный, или первое, что вы замечаете, - это тусклость',
      'Нужен ниацинамид в реальном проценте, а не в виде упоминания',
      'Вы готовы наносить SPF каждый день, чего эта сыворотка требует',
      'Вы уже пользовались витамином C и знаете реакцию своей кожи',
      'Вам ближе прочитать дозу, чем маркетинговое название',
    ],
    notTitle: 'Поищите другое, если',
    notList: [
      'Вы беременны или кормите. Коробка говорит не использовать',
      'Вы избегаете отдушки. Здесь масло бергамота, с лимоненом и линалоолом',
      'Кожа легко реагирует жжением, а наращивать постепенно вы не готовы',
      'Вы ждали, что все двенадцать витаминов работают. Работают четыре',
    ],
    note:
      'Только для наружного применения, держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
  },
  routine: {
    eyebrow: 'Дополните уход',
    title: 'С чем это сочетать.',
    intro:
      'Сыворотка - это шаг. Вот продукты, между которыми она стоит, и любой из них можно добавить прямо здесь.',
    thisProduct: 'Этот продукт',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать вариант',
    fromPrice: 'От',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Частые вопросы.',
    items: [
      {
        q: 'Двенадцать витаминов звучит как много. Это так?',
        a: 'Витаминов действительно двенадцать, и упаковка печатает, сколько каждого. Четыре в частях на миллион: ниацинамид 20 000, пантенол 10 000, стабильный витамин C 1 000 и витамин E 300. Остальные одиннадцать в частях на миллиард, некоторые на уровне сотой доли одной. Счёт честный, иерархия важнее, и мы предпочтём, чтобы вы увидели лестницу, а не число двенадцать.',
      },
      {
        q: 'MELAZERO - это реальность или маркетинговое имя?',
        a: 'И то, и другое, в полезном смысле. Это запатентованный комплекс, и его состав задокументирован: экстракт листа мушмулы и экстракт мяты в гликолевом носителе. В отличие от большинства брендированных комплексов, здесь это не след. Мушмула на 0,04%, мята на 0,01%, то есть четыреста и сто частей на миллион.',
      },
      {
        q: 'Будет ли жечь?',
        a: 'Может, и производитель говорит об этом, а не прячет. Начните с малого количества и дайте коже привыкнуть. Если жжение не утихает, а продолжается, прекратите использование. Это их инструкция, и она разумная.',
      },
      {
        q: 'Чем она отличается от крема Multi Vita Radiance?',
        a: 'Сыворотка - это рабочий шаг, крем - завершающий. Именно здесь находятся доза ниацинамида и MELAZERO, так что если берёте одно средство для тона, берите это.',
      },
      {
        q: 'Правда ли нужен SPF?',
        a: 'Да, и это самое важное на этой странице. Осветляющий уход без ежедневного SPF - это кран, льющий в ванну без пробки.',
      },
      {
        q: 'Моя сыворотка немного потемнела. Испортилась?',
        a: 'Скорее всего нет. Коробка говорит, что цвет может измениться от контакта с воздухом, а действие остаётся прежним: для витаминных формул это нормально. Плотно закрывайте крышку и держите в прохладе. Если изменились запах или текстура - это другое дело, тогда прекратите.',
      },
      {
        q: 'Какой pH?',
        a: 'Партия в досье показала 5,94 при спецификации 6,1 плюс-минус 0,5.',
      },
    ],
  },
  details: {
    eyebrow: 'Спецификация',
    title: 'Детали.',
    rows: [
      { label: 'Формат', value: 'Несмываемая сыворотка для лица, флакон с пипеткой' },
      { label: 'Объём', value: '30 мл / 1,01 жидк. унции' },
      { label: 'Функция', value: 'Осветление кожи' },
      { label: 'Зарегистрированный актив', value: 'Ниацинамид, назван в корейской регистрации' },
      { label: 'Когда', value: 'Утром и вечером, днём с SPF' },
      { label: 'Типы кожи', value: 'Тусклый или неровный тон. Наращивайте постепенно, если кожа реагирует' },
      { label: 'pH', value: '5,94 при спецификации 6,1 плюс-минус 0,5' },
      { label: 'Отдушка', value: 'Масло плодов бергамота, с лимоненом и линалоолом' },
      { label: 'Беременность', value: 'Не применять во время беременности, согласно упаковке' },
      { label: 'Хранение', value: 'Прохладно и в темноте, крышка закрыта. Холодильник подойдёт' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Происхождение', value: 'Сделано в Корее, DTS MG' },
    ],
    barcodeLabel: 'Штрихкод',
  },
  closing: {
    title: 'Число, которое имеет значение, напечатано на коробке.',
    body: 'Ниацинамид 20 000 ppm, запатентованный меланиновый комплекс, который не является следом, и двухнедельное измерение в подтверждение.',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const BY_LOCALE: Record<MvserumLocale, MvserumCopy> = {
  en: EN,
  ar: { ..._AR, ...MVSERUM_AR_COPY },
  ru: { ..._RU, ...MVSERUM_RU_COPY },
}

export function getMvserumCopy(locale: string): MvserumCopy {
  return BY_LOCALE[(locale as MvserumLocale) in BY_LOCALE ? (locale as MvserumLocale) : 'en']
}
