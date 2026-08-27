/**
 * Bespoke copy for HR³ MATRIX MESOPECIA KIT (product 47), last of the five-product
 * scalp line and the only one that is not a formulation of its own.
 *
 * WHAT THIS PRODUCT IS: products 46 and 45 in one box with a 0.5 mm roller. The bottle
 * is HR³ MATRIX SCALP PEELING α 100 ml, the vials are HR³ MATRIX HAIR SOLUTION α at
 * 4 ml × 6, and both are sold separately here with their own pages, formulas and
 * certificates. So this page deliberately does NOT restate the chemistry - it covers
 * what the box adds, and sends the reader to 45 and 46 for the rest.
 *
 * SOURCING - the registration artwork,
 * `Registration DOC/Artwork/[GENOSYS]HAIR MATRIX MESOPECIA KIT.pdf`. Concentrations, pH
 * figures and test results are carried across from the audits already done on 45 and
 * 46; nothing was measured on the kit and there is no efficacy study behind it as a set.
 *
 * ★ IT IS A ROLLER, NOT A STAMP. Our record called the applicator a stamp, and the
 * product photograph plainly shows a drum roller on a handle. The carton uses both words
 * and cannot decide either:
 *   - Contents line:  "GENOSYS STAMP(ROLLER)"
 *   - Korean contents: "제노시스 스템프(롤러)" - GENOSYS stamp (roller)
 *   - Precaution:     "Do not use roller(stamp) if you have metal allergy…"
 *   - Step 3:         "roll (stamp) on the scalp directly. While rolling(stamping)…"
 *   - French:         "L'utilisation de roller est interdite…"
 *   - German:         "…sollten Sie den Roller nicht verwenden"
 * The page calls it a roller, because that is what is in the box and what the buyer will
 * hold, and says the carton calls it a stamp so the two match up. The action verb is
 * roll, not press: a page telling someone to press a roller is a page written from a
 * spec sheet instead of from the product.
 *
 * ★ THE 0.5 mm FIGURE IS ON THE RUSSIAN PANEL ONLY - "Дермаштамп 0,5 мм". The English
 * panel gives no needle depth at all. Same recovered-from-a-translated-panel pattern as
 * the shampoo's three-minute dwell (44) and the ampoule's 1-2 cm partings (45). Said on
 * the page, because a depth is the one number that decides whether a device is cosmetic.
 *
 * ★ THE ENGLISH PANEL OF THIS CARTON MAKES THE DRUG CLAIM. Verbatim:
 *   "HR³ MATRIX MESOPECIA KIT is an innovative hair and scalp treatment system invented
 *    to prevent hair loss and promote hair regrowth and restoration by inhibiting the
 *    fundamental causes of hair loss."
 * That is where our record's "prevent hair loss and promote healthy hair regrowth" came
 * from - not from a translation, from the box, in English. The page refuses it out loud
 * rather than staying silent, exactly as product 44's page refuses the carton's dandruff
 * claim, because the customer will be holding the carton that makes it.
 * The Russian panel is worse again: the kit is titled "Набор для борьбы с выпадением
 * волос" (a kit for fighting hair loss), the peeling is "мягкого действия" (gentle) and
 * "дезинфицирующее" (disinfecting), and the ampoule "оказывает эффект ангиогенеза"
 * (has an angiogenesis effect) and "подавляет выпадение волос" (suppresses hair loss).
 * Gentle and disinfecting were both already refused on product 46's page.
 *
 * RECOVERED FROM THE ARABIC PANEL, absent from the English one: dry with a hair dryer
 * for 2-5 minutes after the peeling, and repeat the sequence after 10 minutes if needed.
 *
 * THE ARITHMETIC SECTION is gated behind price visibility in the page, and it is not a
 * saving. Peeling 290 + six vials pro-rata 555 = 845 against a 1,100 kit, so the roller
 * is 255. But 290 + 740 = 1,030 buys both liquids with EIGHT vials for less than the kit
 * costs. Both halves have to stay: the second is why a customer wanting a full course
 * should buy product 45 instead. The 230 anchor is product 1, the standalone 0.25 mm
 * Microneedle Roller, confirmed live in the catalogue - it is quoted as a price
 * comparison and explicitly NOT as a substitute, because it is a shallower face tool.
 * If any of those four list prices move, recalculate in all three languages.
 *
 * MUST NEVER BE ADDED - every one of these was on the kit's own record until 18 Aug,
 * having survived the audits that stripped them from 45 and 46:
 *   - "5α-reductase inhibition to suppress DHT conversion". The mechanism of a
 *     prescription medicine, on a cosmetic.
 *   - "Promotes angiogenesis for new hair growth".
 *   - "Stimulates Hair Growth".
 *   - "Prevent hair loss and promote healthy hair regrowth".
 *   - "5 ml" vials. The contents line says 4 ml × 6.
 * The registered functions are scalp refresher (peeling) and nutrition supply / hair
 * conditioning (solution). Neither is a hair-loss treatment.
 *
 * FRAMING (owner decision, 17 Aug, applies to the whole line): no hair-loss claim, and
 * no mention of the Korean functional designation anywhere.
 */

import { MESOPECIA_KIT_AR, MESOPECIA_KIT_RU } from './mesopeciaKitLocalizedCopy'

export type Locale = 'en' | 'ar' | 'ru'

export interface MesopeciaKitCopy {
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

  whatItIs: {
    eyebrow: string
    title: string
    body: string
    items: string[]
    detail: string
    /** What the box itself claims, quoted and refused. */
    carton: string
  }

  contents: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  arithmetic: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string; note: string; here?: boolean }>
    body: string
  }

  roller: {
    eyebrow: string
    title: string
    body: string
    items: Array<{ name: string; dose: string; note: string }>
    footnote: string
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
    peeling: string
    solution: string
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

  /**
   * `needsPrices` marks answers that quote figures in dirhams. Prices are hidden from
   * signed-out visitors everywhere else on the site, so the page drops those questions
   * rather than let an FAQ answer be the one place the list prices leak.
   */
  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string; needsPrices?: boolean }>
  }

  companionsTitle: string
  backToProducts: string
}

const EN: MesopeciaKitCopy = {
  eyebrow: 'HR³ MATRIX Mesopecia Kit · Peeling 100 ml · Solution 4 ml × 6 · Roller 0.5 mm',
  headline: 'Two liquids you can already buy, and the half-millimetre roller that turns them into a protocol.',
  subheadline:
    'The bottle in this box is HR³ MATRIX Scalp Peeling α, the vials are HR³ MATRIX Hair Solution α, and both have their own page here with the full formula behind them. What the kit adds is the roller and the order things happen in: clear the scalp, open the way, put the solution in behind it. Korea registers the peeling as a scalp refresher and the solution for nutrition supply and hair conditioning - neither is registered to treat hair loss, whatever the box says, and there is a section below about that.',
  heroBullets: [
    'Scalp Peeling α 100 ml and Hair Solution α 4 ml × 6 - the same two products sold separately here',
    'A 0.5 mm roller, which is the only part of this box you cannot buy on its own',
    'Six vials, against eight in the standalone Hair Solution box: a shorter course',
    'The contraindications for the roller are printed on the carton and set out below',
  ],
  badges: ['Made in Korea', 'Three pieces', '0.5 mm roller', 'Six sessions'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '0.5 mm', label: 'needle depth of the roller' },
    { value: '6 × 4 ml', label: 'vials, against eight in the standalone box' },
    { value: '100 ml', label: 'of the scalp peeling, the full-size bottle' },
    { value: '4 steps', label: 'the protocol printed on the carton' },
  ],

  whatItIs: {
    eyebrow: 'Read this first',
    title: 'This is two products you can already buy, plus a roller.',
    body:
      'The kit has no formula of its own, and the honest way to read this page is that everything chemical about it lives on two other pages. The peeling is product 46 and the solution is product 45, at the same strengths, from the same batches, with the same certificates and the same precautions. What you are deciding here is whether you want the applicator and the shorter course - not whether you want a different product.',
    items: [
      'The peeling is a third denatured alcohol. It degreases the scalp fast, and it is not a gentle exfoliant',
      'The solution\u2019s four growth factors come to 1.2 parts per million between them; the carrier is what does the delivering',
      'Six vials here against eight in the standalone box, so this is the shorter course of the two',
      'Registered as a scalp refresher and a hair conditioner - not as a treatment for hair loss',
    ],
    detail:
      'Worth saying plainly, because our own description of this kit said otherwise until today. It claimed the set inhibited an enzyme to suppress a hormone, promoted the growth of new blood vessels, stimulated hair growth and prevented hair loss. Those are the claims of a prescription medicine. They were taken off the two liquids when each was checked against its paperwork, and the kit had quietly kept every one of them.',
    carton:
      'And we know exactly where they came from, because the box says it too. In English, on the carton you will receive: an "innovative hair and scalp treatment system invented to prevent hair loss and promote hair regrowth and restoration by inhibiting the fundamental causes of hair loss". The Russian panel goes further and calls the whole kit a hair-loss kit. We are not carrying any of it. What Korea actually registered these two liquids for is a scalp refresher and a hair conditioner, and inhibiting the fundamental causes of hair loss is a thing medicines do. If hair loss is what you are dealing with, see a doctor about it - then, if you want, use this alongside whatever they give you.',
  },

  contents: {
    eyebrow: 'What is in the box',
    title: 'Three pieces, and only one of them is exclusive to this kit',
    intro:
      'The two liquids are the products you would buy anyway if you were doing this at home. The roller is the reason the box exists.',
    items: [
      {
        name: 'HR³ MATRIX Scalp Peeling α',
        dose: '100 ml',
        body: 'Denatured alcohol at 33.600% with propylene glycol at 11.994%, which cuts scalp oil and product build-up in seconds so the roller meets clean skin. It also carries 1.7% of cooling agents between menthol and menthyl lactate, the most in anything GENOSYS makes. Rubbed in on a cotton swab and not rinsed off.',
      },
      {
        name: 'HR³ MATRIX Hair Solution α',
        dose: '4 ml × 6',
        body: 'Four growth factors totalling 1.2 parts per million, copper tripeptide-1 at 5 ppm, niacinamide and panthenol at 0.100% each, carried in nearly 10% propylene glycol thickened with carbomer so it stays on the parting instead of running off it. Sold on its own in a box of eight. Open a vial and use it straight away.',
      },
      {
        name: 'GENOSYS roller',
        dose: '0.5 mm',
        body: 'The one piece you cannot buy separately, and the reason the other two stop being things you rub on. The carton calls it a stamp in one line and a roller in the next; what is actually in the box is a drum roller on a handle, and it is rolled along the parting rather than pressed.',
      },
    ],
  },

  arithmetic: {
    eyebrow: 'The arithmetic',
    title: 'What the roller actually costs, worked out from the parts',
    intro:
      'The kit is not a bundle discount, and you should hear that from us rather than work it out at home. Here is the same box priced from what its contents cost on their own.',
    rows: [
      { label: 'Scalp Peeling α, 100 ml - bought on its own', value: '290', note: 'product 46' },
      { label: 'Hair Solution α, six vials at the standalone rate', value: '555', note: '740 for eight, so 92.50 each' },
      { label: 'The two liquids together', value: '845', note: '' },
      { label: 'This kit', value: '1,100', note: 'as sold', here: true },
      { label: 'Which puts the roller at', value: '255', note: '' },
    ],
    body:
      'Two things follow. If you need the applicator, AED 255 is what it costs you here, and this is the only way to get this particular roller - for scale, the 0.25 mm Microneedle Roller we sell on its own is AED 230, though that is a shallower needle meant for the face, so read it as a price comparison rather than a substitute. But if what you actually want is a full course, buy the peeling and the standalone Hair Solution box separately: that is AED 1,030 for eight vials rather than six - less money and more product than the kit, without the roller. Neither answer is wrong. It comes down entirely to whether you already have something to needle with.',
  },

  roller: {
    eyebrow: 'The roller',
    title: 'Half a millimetre, and the people who should not use it',
    body:
      'Needle depth is the whole argument for this box, and it had never appeared anywhere on our site - nor, for that matter, on the English side of the carton, which gives no depth at all. The Russian panel of the same box is where the 0.5 mm comes from. That is a cosmetic depth: enough to open a path through the outer scalp so a water-thin solution goes in rather than sitting on top of it, and short of the depth a clinic works at. The carton also carries an avoid-list that we were not passing on, which matters more than usual on a product whose entire mechanism is puncturing skin.',
    items: [
      { name: 'Needle depth', dose: '0.5 mm', note: 'from the Russian panel; the English one gives none' },
      { name: 'Metal allergy', dose: 'Do not use', note: 'the needles are steel' },
      { name: 'Keloid-prone skin', dose: 'Do not use', note: 'skin that scars badly should not be punctured' },
      { name: 'Dermatitis', dose: 'Do not use', note: 'wait until the scalp has settled' },
    ],
    footnote:
      'One thing the carton does not tell you, so we will: it gives no number of sessions for the roller. Treat it as a personal item, never share it, and stop using it as soon as the needles stop feeling sharp - a blunt needle does not go in cleanly, it drags. And if you have seen this called a stamp, including in our own description of it until today, that is the carton\u2019s doing: its contents line reads "GENOSYS STAMP(ROLLER)" and its instructions say "roll (stamp)". It is a roller.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Clear the scalp, dry it, roll along the parting, massage',
    frequency: 'One vial per session · six sessions in the box',
    steps: [
      {
        title: 'Rub the peeling in',
        body: 'Decant a little Scalp Peeling α, soak a cotton swab properly, and rub it over the treatment area - the carton\u2019s own word is "powerfully", and it means it. It is not rinsed off. Expect it to feel very cold, and expect it to sting anywhere the skin is broken.',
      },
      {
        title: 'Dry the scalp and the hair',
        body: 'The carton says to dry it, and its Arabic panel puts a number on it: two to five minutes with a dryer. Give the alcohol a moment to flash off before you bring heat near it, because a third of that bottle is alcohol and it is flammable while wet. Dry is what the next step needs - on a damp scalp the solution runs off the parting instead of staying where you put it.',
      },
      {
        title: 'Part the hair with a comb, and roll',
        body: 'Take a parting with a comb, roll directly along the scalp, and release the solution from the dropper as you roll. Move a centimetre or two, take the next parting, and repeat until you have covered the area.',
      },
      {
        title: 'Massage gently',
        body: 'A light massage across the treated area to finish. Gently is the operative word: you have just put several hundred small holes in your scalp, and this is not the moment to rub hard.',
      },
    ],
    note:
      'The carton adds that the sequence can be repeated after ten minutes if needed. Use each vial the moment you open it and throw away whatever is left - this formula is preserved with only 30 parts per million of phenoxyethanol and is not built to sit half-used on a shelf. What the carton does not give is an interval between sessions, so we are not going to invent one: space them enough that the scalp is calm again before you start the next.',
  },

  quality: {
    eyebrow: 'Quality',
    title: 'What was measured, on each liquid',
    intro:
      'Both liquids are made in Korea and released to a written specification, and each has its own page here carrying the full set of figures. These are the ones worth seeing next to each other. Nothing was measured on the kit as a set, because there is nothing to measure that is not one of these two.',
    rows: [
      { label: 'Peeling - appearance', value: 'Transparent liquid' },
      { label: 'Peeling - pH', value: '4.31, inside a 4.00-5.00 specification' },
      { label: 'Peeling - stability', value: 'Passes at 50 °C' },
      { label: 'Peeling - purity', value: 'Under 10 cfu/ml for bacteria and for moulds, against 100 permitted for each' },
      { label: 'Solution - appearance', value: 'Opaque liquid' },
      { label: 'Solution - pH', value: '6.65, inside a 6.00-7.00 specification' },
      { label: 'Solution - viscosity', value: '800, at the floor of an 800-1,600 specification' },
      { label: 'Solution - purity', value: 'Under 10 cfu/ml' },
      { label: 'Shelf life', value: 'Three years unopened, both liquids' },
      { label: 'Registered function', value: 'Peeling: scalp refresher. Solution: nutrition supply and hair conditioning' },
    ],
    patch:
      'Both liquids have been patch tested and both came back non-irritant, which is worth knowing given one of them is a third alcohol. The assessor attaches the same caveat to each: the number of volunteers was not statistically significant. There is no efficacy study behind either liquid, and none behind the kit as a set.',
  },

  inci: {
    eyebrow: 'The formulas',
    title: 'Everything in both bottles',
    intro:
      'Two liquids, two lists, both transcribed from the carton in the order they are printed. The concentrations behind them are on the pages for products 46 and 45.',
    peeling: 'Scalp Peeling α - full ingredient list (INCI)',
    solution: 'Hair Solution α - full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the carton in your hand.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Precautions',
    points: [
      'Do not use the roller if you have a metal allergy, keloid-prone skin, or dermatitis.',
      'Do not roll over scalp that is broken, wounded, sunburned, freshly shaved or inflamed.',
      'For external use only, on the scalp.',
      'The peeling contains 33.6% denatured alcohol. It is flammable - let it flash off before a dryer or a styling iron.',
      'Both liquids contain menthol and will feel strongly cold; the peeling carries 0.900% of it.',
      'Keep both well away from the eyes and mucous membranes, and rinse thoroughly with cool water on contact.',
      'Use each vial immediately after opening and discard what is left.',
      'The Hair Solution carton advises avoiding use during pregnancy and breastfeeding. Ask your doctor first.',
      'Stop and see a doctor if redness, swelling or irritation develops.',
      'Keep out of reach of children. The peeling contains a bittering agent, but it is still a third alcohol.',
    ],
    note:
      'Taken from the registered artwork for this kit and from the safety assessments behind the two liquids. Check the box you receive for its own wording.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Contents', value: 'Scalp Peeling α 100 ml · Hair Solution α 4 ml × 6 · GENOSYS roller 0.5 mm' },
      { label: 'Needle depth', value: '0.5 mm' },
      { label: 'Applicator', value: 'Drum roller. The carton also calls it a stamp' },
      { label: 'Sessions', value: 'Six, one vial each' },
      { label: 'Registered function', value: 'Peeling: scalp refresher. Solution: nutrition supply, hair conditioning' },
      { label: 'Peeling - alcohol', value: 'Alcohol denat. 33.600% - flammable' },
      { label: 'Peeling - cooling', value: 'Menthol 0.900% with menthyl lactate 0.800%' },
      { label: 'Peeling - salicylic acid', value: '99 ppm - not a keratolytic dose' },
      { label: 'Solution - growth factors', value: '1.2 ppm in total, across four peptides' },
      { label: 'Solution - copper tripeptide-1', value: '5 ppm' },
      { label: 'Solution - carrier', value: 'Propylene glycol 9.995% with carbomer 0.450%' },
      { label: 'Application', value: 'Peeling on a swab, then roll each parting with the solution. Not rinsed' },
      { label: 'Also sold separately', value: 'The peeling on its own; the solution in a box of eight' },
      { label: 'Shelf life', value: 'Three years unopened' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'Is the kit cheaper than buying the two liquids separately?',
        a: 'No, and we would rather say so. The peeling is AED 290 on its own and the six vials work out at AED 555 against the standalone box, so the liquids come to AED 845 inside a kit that costs AED 1,100 - the roller is the AED 255 difference. Buying the peeling and the full eight-vial box separately is AED 1,030, which is less money for more product, minus the roller. Buy the kit if you need something to needle with; buy the two products if you already do.',
        needsPrices: true,
      },
      {
        q: 'Why six vials and not eight?',
        a: 'Because the kit is packed as a course of six sessions and the standalone box of Hair Solution α holds eight. If a longer run is what you are after, the standalone box is the better buy and the peeling is unchanged either way. This is the single most useful thing to know before choosing between them, and it is not obvious from either box.',
      },
      {
        q: 'The box says it prevents hair loss. Why does this page not?',
        a: 'Because the two liquids inside it are registered as a scalp refresher and a hair conditioner, and that is the claim we can stand behind. The carton\u2019s English blurb describes a system that prevents hair loss and promotes regrowth by inhibiting the fundamental causes of hair loss, and the Russian panel is stronger still. Inhibiting the causes of hair loss is what a medicine does; a cosmetic registered for conditioning does not get to borrow the sentence. Everything else on this page - the doses, the depth, the certificates - is there so you can judge it without needing that claim to be true.',
      },
      {
        q: 'Is it a stamp or a roller?',
        a: 'A roller. The confusion is the carton\u2019s: its contents line reads "GENOSYS STAMP(ROLLER)" and its instructions say to "roll (stamp)" on the scalp. Our own description called it a stamp until today. What arrives is a drum roller on a handle, and you roll it along each parting rather than pressing it down.',
      },
      {
        q: 'Does 0.5 mm hurt?',
        a: 'It is felt rather than painful for most people, and the peeling that comes first will register more strongly - it is a third alcohol with 0.9% menthol going onto skin that has just been degreased. The roller itself is a cosmetic depth. If you are pressing hard enough that it genuinely hurts, you are pressing too hard.',
      },
      {
        q: 'Can I use the roller with something else afterwards?',
        a: 'Only with something meant to go into needled skin. That is a real constraint, not a sales line: a formula that is perfectly safe sitting on top of the scalp is a different proposition once you have opened a route past it. The Hair Solution in this box is formulated for it, which is why it is the one packed alongside the roller.',
      },
      {
        q: 'Do I still need the shampoo or the tonic?',
        a: 'They do a different job. This kit is a session you do occasionally; the Medi Scalp Shampoo α and the Hair Tonic α are what you use in between, and neither of them needs a roller. If you are buying the whole line, the sensible reading is that this is the treatment and those two are the routine around it.',
      },
    ],
  },

  companionsTitle: 'What goes with it',
  backToProducts: 'Products',
}

export const LEGACY_MESOPECIA_KIT_AR: MesopeciaKitCopy = {
  eyebrow: 'طقم ميزوبيشيا إتش آر³ ماتريكس · مقشّر 100 مل · محلول 4 مل × 6 · رولر 0.5 مم',
  headline: 'ثلاث خطوات متكاملة للعناية بفروة الرأس في طقم واحد.',
  subheadline:
    'يجمع الطقم مقشّر HR³ MATRIX Scalp Peeling α بحجم 100 مل، وست أمبولات Hair Solution α سعة 4 مل، ورولر بعمق 0.5 مم في بروتوكول مرتب للعناية بفروة الرأس. وظيفة المحلول المسجلة هي إمداد الشعر بالتغذية وتكييفه، ولا يقدم الطقم كعلاج لتساقط الشعر أو لتحفيز نموه.',
  heroBullets: [
    'مقشّر فروة الرأس α بحجم 100 مل و Hair Solution α بحجم 4 مل × 6 - المنتجان نفساهما يُباعان منفردين هنا',
    'رولر بعمق 0.5 مم، وهو الجزء الوحيد في هذا الصندوق الذي لا يُباع وحده',
    'ست أمبولات، مقابل ثماني في علبة Hair Solution المنفردة: دورة أقصر',
    'موانع استعمال الرولر مطبوعة على العلبة ومذكورة بالكامل أدناه',
  ],
  badges: ['صُنع في كوريا', 'ثلاث قطع', 'رولر 0.5 مم', 'ست جلسات'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '0.5 mm', label: 'عمق إبر الرولر' },
    { value: '6 × 4 ml', label: 'أمبولات، مقابل ثماني في العلبة المنفردة' },
    { value: '100 ml', label: 'من مقشّر الفروة، العبوة كاملة الحجم' },
    { value: '4', label: 'خطوات البروتوكول المطبوعة على العلبة' },
  ],

  whatItIs: {
    eyebrow: 'اقرئي هذا أولاً',
    title: 'ثلاثة مكونات لبروتوكول واضح.',
    body:
      'يجمع الطقم المنتجين 46 و45 مع رولر جينوسيس. تحتفظ كل تركيبة بوظيفتها وتعليماتها واحتياطاتها، بينما يحدد الطقم ترتيب الاستخدام وعدد الجلسات.',
    items: [
      'ثلث المقشّر كحول مُمَوَّه. يزيل دهن الفروة بسرعة، وهو ليس مقشّراً لطيفاً',
      'الببتيدات المؤتلفة الأربعة في المحلول تبلغ مجتمعة 1.2 جزء في المليون، من دون نسبة تأثير على نمو الشعر إليها',
      'ست أمبولات هنا مقابل ثماني في العلبة المنفردة، فهذه الدورة الأقصر بينهما',
      'مسجّل كمنعش لفروة الرأس ومكيّف للشعر - لا كعلاج لتساقط الشعر',
    ],
    detail:
      'وظيفة السائلين تجميلية: تنظيف وإنعاش فروة الرأس، ثم إمداد الشعر بالتغذية وتكييفه. لا ننسب إلى الطقم تثبيط DHT أو تكوين أوعية دموية أو منع التساقط أو إعادة النمو.',
    carton:
      'عند وجود تساقط ملحوظ أو مستمر، يبدأ الأمر بتشخيص طبي. ويمكن استخدام هذا الطقم كعناية تجميلية بفروة الرأس والشعر وفق تعليماته، لا بديلاً عن العلاج.',
  },

  contents: {
    eyebrow: 'ما في الصندوق',
    title: 'ثلاث قطع، واحدة منها فقط حصرية لهذا الطقم',
    intro:
      'يجمع الصندوق المقشّر والمحلول والرولر في عبوة واحدة لست جلسات مرتبة.',
    items: [
      {
        name: 'HR³ MATRIX Scalp Peeling α',
        dose: '100 ml',
        body: 'يساعد الكحول المغير 33.600% والبروبيلين غليكول 11.994% على إزالة دهون الفروة والقشور السطحية وبقايا المنتجات. ويحمل أيضاً 1.7% من عوامل التبريد مجتمعة بين المنثول ومنثيل لاكتات. تضعه تعليمات الطقم كتنظيف تجميلي يترك على الفروة قبل الرولر، مع خطوة تجفيف منفصلة بينهما.',
      },
      {
        name: 'HR³ MATRIX Hair Solution α',
        dose: '4 ml × 6',
        body: 'أربعة عوامل نمو مجموعها 1.2 جزء من المليون، وكوبر ترايببتايد-1 عند 5 أجزاء من المليون، ونياسيناميد وبانثينول بنسبة 0.100% لكلٍّ منهما، محمولة في قرابة 10% بروبيلين جليكول مكثّفة بالكاربومر لتبقى على الفرق بدل أن تنزلق عنه. ويُباع وحده في علبة من ثماني أمبولات. افتحي الأمبولة واستعمليها فوراً.',
      },
      {
        name: 'رولر جينوسيس',
        dose: '0.5 mm',
        body: 'القطعة الوحيدة التي لا تُباع منفردة، وسبب توقّف القطعتين الأخريين عن كونهما شيئاً يُدلك فحسب. تسمّيه العلبة ختماً في سطر ورولر في السطر التالي؛ وما في الصندوق فعلاً أسطوانة دوّارة على مقبض، وتُمرَّر على الفرق لا تُضغط.',
      },
    ],
  },

  arithmetic: {
    eyebrow: 'الحساب',
    title: 'تفصيل محتويات الطقم وقيمتها',
    intro:
      'يوضح هذا التفصيل قيمة كل جزء ليسهل الاختيار بين الطقم والمنتجات المنفردة.',
    rows: [
      { label: 'مقشّر الفروة α، 100 مل - مشترى وحده', value: '290', note: 'المنتج 46' },
      { label: 'Hair Solution α، ست أمبولات بسعر العلبة المنفردة', value: '555', note: '740 لثماني، أي 92.50 للواحدة' },
      { label: 'السائلان معاً', value: '845', note: '' },
      { label: 'هذا الطقم', value: '1,100', note: 'كما يُباع', here: true },
      { label: 'وهو ما يضع الرولر عند', value: '255', note: '' },
    ],
    body:
      'اختاري الطقم إذا كنت تحتاجين الرولر المرفق ودورة من ست جلسات. وإذا كانت لديك أداة مناسبة وتفضلين ثماني أمبولات، تتوفر عبوة Hair Solution المنفردة. الخيار يعتمد على الأداة وعدد الجلسات المطلوب.',
  },

  roller: {
    eyebrow: 'الرولر',
    title: 'نصف مليمتر، ومن لا ينبغي له استعماله',
    body:
      'عمق الإبرة هو كل الحجّة لهذا الصندوق، ولم يكن قد ظهر في أي مكان على موقعنا - ولا، في الواقع، على الجانب الإنجليزي من العلبة، الذي لا يذكر عمقاً إطلاقاً. واللوحة الروسية للعلبة نفسها هي مصدر الـ0.5 مم. وهو عمق تجميلي: يكفي لفتح مسار عبر الطبقة الخارجية من الفروة حتى يدخل محلول مائي القوام بدل أن يجلس فوقها، ويقلّ عن العمق الذي تعمل عنده العيادة. كما تحمل العلبة قائمة موانع لم نكن ننقلها، وهي تهمّ أكثر من المعتاد في منتج آليّته كلها ثقب البشرة.',
    items: [
      { name: 'عمق الإبرة', dose: '0.5 mm', note: 'من اللوحة الروسية؛ والإنجليزية لا تذكر عمقاً' },
      { name: 'حساسية المعادن', dose: 'لا تستعمليه', note: 'الإبر من الفولاذ' },
      { name: 'البشرة المعرّضة للجدرة', dose: 'لا تستعمليه', note: 'البشرة التي تندب بسوء لا ينبغي ثقبها' },
      { name: 'التهاب الجلد', dose: 'لا تستعمليه', note: 'انتظري حتى تهدأ الفروة' },
    ],
    footnote:
      'وأمر لا تخبرك به العلبة، فسنقوله نحن: لا تذكر عدداً للجلسات التي يحتملها الرولر. تعاملي معه كغرض شخصي، لا تشاركيه أبداً، وتوقّفي عن استعماله فور أن تفقد الإبر إحساس الحدّة - فالإبرة الكليلة لا تدخل بنظافة، بل تسحب. وإن كنت قد رأيته موصوفاً بالختم، بما في ذلك في وصفنا نحن حتى اليوم، فذلك صنيع العلبة: سطر المحتويات فيها يقرأ «GENOSYS STAMP(ROLLER)» وتعليماتها تقول «roll (stamp)». إنه رولر.',
  },

  howTo: {
    eyebrow: 'طريقة الاستعمال',
    title: 'نظّفي الفروة، جفّفيها، مرّري الرولر على الفرق، ثم دلّكي',
    frequency: 'أمبولة لكل جلسة · ست جلسات في الصندوق',
    steps: [
      {
        title: 'افركي المقشّر',
        body: 'اسكبي قليلاً من Scalp Peeling α، وبلّلي عوداً قطنياً جيداً، وافركيه على المنطقة - وكلمة العلبة نفسها هي «بقوة». لا يُشطف ويمنح إحساساً شديد البرودة. يوضع فقط بينما فروة الرأس سليمة؛ ولا يوضع أبداً بعد تمرير الرولر أو على جلد سبق وخزه.',
      },
      {
        title: 'جفّفي الفروة والشعر',
        body: 'تقول العلبة أن تجفّفيهما، وتضع لوحتها العربية رقماً لذلك: من دقيقتين إلى خمس بالمجفّف. امنحي الكحول لحظة ليتبخّر قبل تقريب الحرارة، فثلث تلك العبوة كحول وهو قابل للاشتعال وهو رطب. والجفاف هو ما تحتاجه الخطوة التالية - فعلى فروة رطبة ينزلق المحلول عن الفرق بدل أن يبقى حيث وضعته.',
      },
      {
        title: 'افرقي الشعر بمشط، ثم مرّري الرولر',
        body: 'خذي فرقاً بالمشط، ومرّري الرولر مباشرة على فروة الرأس على امتداده، وأطلقي المحلول من القطّارة أثناء التمرير. ثم انتقلي سنتيمتراً أو اثنين، وخذي الفرق التالي، وكرّري حتى تغطّي المنطقة.',
      },
      {
        title: 'دلّكي بلطف',
        body: 'تدليك خفيف على المنطقة المعالَجة في النهاية. وكلمة «بلطف» هي المقصودة: فقد أحدثت للتوّ مئات الثقوب الصغيرة في فروة رأسك، وهذه ليست لحظة الفرك القوي.',
      },
    ],
    note:
      'وتضيف العلبة أنه يمكن تكرار التسلسل بعد عشر دقائق عند الحاجة. استعملي كل أمبولة فور فتحها وتخلّصي ممّا يتبقّى - فهذه التركيبة محفوظة بثلاثين جزءاً من المليون فقط من الفينوكسي إيثانول، ولم تُصمَّم لتبقى نصف مستعملة على الرفّ. أما ما لا تعطيه العلبة فهو الفاصل بين الجلسات، ولن نخترعه: باعدي بينها بما يكفي لتهدأ الفروة قبل الجلسة التالية.',
  },

  quality: {
    eyebrow: 'الجودة',
    title: 'ما قيس، على كل سائل',
    intro:
      'كلا السائلين مصنوع في كوريا وصادر وفق مواصفة مكتوبة، ولكلٍّ منهما صفحته هنا بكامل الأرقام. وهذه هي الأرقام التي تستحق أن تُرى جنباً إلى جنب. ولم يُقَس شيء على الطقم كمجموعة، لأنه لا يوجد فيه ما يُقاس ولا ينتمي إلى أحد هذين.',
    rows: [
      { label: 'المقشّر - المظهر', value: 'سائل شفاف' },
      { label: 'المقشّر - الحموضة', value: '4.31، داخل مواصفة 4.00-5.00' },
      { label: 'المقشّر - الثبات', value: 'يجتاز عند 50 °م' },
      { label: 'المقشّر - النقاء', value: 'أقل من 10 وحدة/مل للبكتيريا وللعفن، مقابل 100 مسموح لكلٍّ منهما' },
      { label: 'المحلول - المظهر', value: 'سائل معتم' },
      { label: 'المحلول - الحموضة', value: '6.65، داخل مواصفة 6.00-7.00' },
      { label: 'المحلول - اللزوجة', value: '800، عند الحدّ الأدنى لمواصفة 800-1,600' },
      { label: 'المحلول - النقاء', value: 'أقل من 10 وحدة/مل' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات غير مفتوح، للسائلين معاً' },
      { label: 'الوظيفة المسجّلة', value: 'المقشّر: منعش لفروة الرأس. المحلول: إمداد التغذية وتكييف الشعر' },
    ],
    patch:
      'خضع السائلان لاختبار اللصقة وعاد كلاهما غير مهيّج، وهو ما يستحق المعرفة نظراً لأن أحدهما ثلثه كحول. ويضيف المُقيّم التحفّظ نفسه إلى كلٍّ منهما: عدد المتطوّعين لم يكن ذا دلالة إحصائية. ولا توجد دراسة فعالية خلف أي من السائلين، ولا خلف الطقم كمجموعة.',
  },

  inci: {
    eyebrow: 'التركيبتان',
    title: 'كل ما في العبوتين',
    intro:
      'سائلان، قائمتان، كلتاهما منقولة عن العلبة بالترتيب المطبوع عليها. والتراكيز خلفهما موجودة على صفحتَي المنتجين 46 و45.',
    peeling: 'مقشّر الفروة α - قائمة المكوّنات الكاملة (INCI)',
    solution: 'Hair Solution α - قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الموجود على العلبة التي بين يديك.',
  },

  safety: {
    eyebrow: 'قبل الاستعمال',
    title: 'احتياطات',
    points: [
      'لا تستعملي الرولر إن كانت لديك حساسية من المعادن، أو بشرة معرّضة للجدرة، أو التهاب جلدي.',
      'لا تمرّري الرولر على فروة مجروحة أو مصابة أو محروقة بالشمس أو محلوقة حديثاً أو ملتهبة.',
      'للاستعمال الخارجي فقط، على فروة الرأس.',
      'يحتوي المقشّر على 33.6% كحول مُمَوَّه. وهو قابل للاشتعال - اتركيه يتبخّر قبل المجفّف أو مكواة الشعر.',
      'يحتوي السائلان على المنثول وسيُحدثان إحساساً بارداً قوياً؛ ويحمل المقشّر 0.900% منه.',
      'أبقيهما بعيداً عن العينين والأغشية المخاطية، واشطفي جيداً بماء بارد عند الملامسة.',
      'استعملي كل أمبولة فور فتحها وتخلّصي ممّا يتبقّى.',
      'تنصح علبة Hair Solution بتجنّب الاستعمال أثناء الحمل والرضاعة. استشيري طبيبك أولاً.',
      'أوقفي الاستعمال وراجعي طبيباً إذا ظهر احمرار أو تورّم أو تهيّج.',
      'يُحفظ بعيداً عن متناول الأطفال. يحتوي المقشّر على عامل مُمرّر، لكنه يبقى ثلثه كحولاً.',
    ],
    note:
      'مأخوذة من التصميم المسجّل لهذا الطقم ومن تقييمات السلامة خلف السائلين. تحقّقي من صياغة العلبة التي تصلك.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'المحتويات', value: 'مقشّر الفروة α 100 مل · Hair Solution α 4 مل × 6 · رولر جينوسيس 0.5 مم' },
      { label: 'عمق الإبرة', value: '0.5 مم' },
      { label: 'أداة الوضع', value: 'رولر أسطواني. والعلبة تسمّيه ختماً أيضاً' },
      { label: 'الجلسات', value: 'ست، أمبولة لكل جلسة' },
      { label: 'الوظيفة المسجّلة', value: 'المقشّر: منعش لفروة الرأس. المحلول: إمداد التغذية وتكييف الشعر' },
      { label: 'المقشّر - الكحول', value: 'كحول مُمَوَّه 33.600% - قابل للاشتعال' },
      { label: 'المقشّر - التبريد', value: 'منثول 0.900% مع منثيل لاكتات 0.800%' },
      { label: 'المقشّر - حمض الساليسيليك', value: '99 جزءاً من المليون - ليست جرعة تقشير' },
      { label: 'المحلول - عوامل النمو', value: '1.2 جزء من المليون إجمالاً، عبر أربعة ببتيدات' },
      { label: 'المحلول - كوبر ترايببتايد-1', value: '5 أجزاء من المليون' },
      { label: 'المحلول - الحامل', value: 'بروبيلين جليكول 9.995% مع كاربومر 0.450%' },
      { label: 'الاستعمال', value: 'المقشّر بعود قطني، ثم تمرير الرولر على كل فرق مع المحلول. لا يُشطف' },
      { label: 'يُباعان منفردين أيضاً', value: 'المقشّر وحده؛ والمحلول في علبة من ثماني أمبولات' },
      { label: 'مدة الصلاحية', value: 'ثلاث سنوات غير مفتوح' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'هل الطقم أرخص من شراء السائلين منفصلين؟',
        a: 'لا، ونفضّل قول ذلك. فالمقشّر 290 درهماً وحده، والأمبولات الست تساوي 555 درهماً مقابل العلبة المنفردة، فيصير السائلان 845 درهماً داخل طقم سعره 1,100 - والرولر هو فارق الـ255 درهماً. أما شراء المقشّر وعلبة الأمبولات الثماني منفصلين فهو 1,030 درهماً، أي مال أقل لمنتج أكثر، ناقص الرولر. اشتري الطقم إن كنت تحتاجين ما تستعملينه للوخز؛ واشتري المنتجين إن كان لديك ذلك أصلاً.',
        needsPrices: true,
      },
      {
        q: 'لماذا ست أمبولات لا ثماني؟',
        a: 'لأن الطقم معبّأ كدورة من ست جلسات، بينما تضمّ علبة Hair Solution α المنفردة ثماني. فإن كان ما تريدينه مدى أطول، فالعلبة المنفردة هي الشراء الأفضل، والمقشّر لا يتغيّر في الحالتين. وهذه أنفع معلومة قبل الاختيار بينهما، وهي غير واضحة من أي من العلبتين.',
      },
      {
        q: 'العلبة تقول إنه يمنع تساقط الشعر. فلماذا لا تقول هذه الصفحة ذلك؟',
        a: 'لأن السائلين داخلها مسجّلان كمنعش لفروة الرأس ومكيّف للشعر، وذلك هو الادّعاء الذي نستطيع الوقوف خلفه. أما نصّ العلبة الإنجليزي فيصف نظاماً يمنع التساقط ويعزّز إعادة النمو عبر تثبيط الأسباب الجذرية للتساقط، واللوحة الروسية أقوى منه. وتثبيط أسباب التساقط شيء يفعله الدواء؛ ومستحضر تجميل مسجّل للتكييف لا يستعير تلك الجملة. وكل ما عدا ذلك على هذه الصفحة - الجرعات والعمق والشهادات - موجود لتحكمي بنفسك من دون أن تحتاجي إلى صحّة ذلك الادّعاء.',
      },
      {
        q: 'أهو ختم أم رولر؟',
        a: 'رولر. والالتباس صنيع العلبة: سطر المحتويات فيها يقرأ «GENOSYS STAMP(ROLLER)» وتعليماتها تقول «roll (stamp)» على الفروة. ووصفنا نحن كان يسمّيه ختماً حتى اليوم. وما يصلك أسطوانة دوّارة على مقبض، تمرّرينها على كل فرق بدل أن تضغطيها.',
      },
      {
        q: 'هل يؤلم عمق 0.5 مم؟',
        a: 'يُحسّ به أكثر ممّا يؤلم عند معظم الناس، والمقشّر الذي يسبقه سيُسجَّل أقوى - فهو ثلثه كحول مع 0.9% منثول على بشرة أُزيل دهنها للتوّ. أما الرولر نفسه فعمق تجميلي. وإن كنت تضغطين بما يكفي ليؤلم فعلاً، فأنت تضغطين أكثر من اللازم.',
      },
      {
        q: 'هل أستطيع استعمال الرولر مع شيء آخر بعده؟',
        a: 'فقط مع ما هو مُعدّ للدخول في بشرة موخوزة. وهذا قيد حقيقي لا عبارة بيع: فالتركيبة الآمنة تماماً وهي جالسة فوق الفروة تصير أمراً آخر بعد أن تفتحي طريقاً يتجاوزها. والمحلول في هذا الصندوق مُركّب لذلك، ولهذا هو المعبّأ إلى جانب الرولر.',
      },
      {
        q: 'هل ما زلت أحتاج الشامبو أو التونر؟',
        a: 'لهما دور مختلف. فهذا الطقم جلسة منفصلة تُجرى من حين إلى آخر؛ أما شامبو MEDI α وHair Tonic α فهما خطوتا العناية بين الجلسات. لا يستخدم التونيك مع الرولر: يرش على فروة الرأس ويدلك بالأصابع ويترك 3-4 ساعات على الأقل.',
      },
    ],
  },

  companionsTitle: 'ما يعمل معه',
  backToProducts: 'المنتجات',
}

export const LEGACY_MESOPECIA_KIT_RU: MesopeciaKitCopy = {
  eyebrow: 'HR³ MATRIX набор Mesopecia · Пилинг 100 мл · Раствор 4 мл × 6 · Роллер 0,5 мм',
  headline: 'Три этапа ухода за кожей головы в одном наборе.',
  subheadline:
    'Набор объединяет HR³ MATRIX Scalp Peeling α 100 мл, шесть ампул Hair Solution α по 4 мл и роллер 0,5 мм в последовательный протокол ухода за кожей головы. Зарегистрированная функция раствора - питание и кондиционирование волос; набор не позиционируется как лечение выпадения или средство стимуляции роста.',
  heroBullets: [
    'Пилинг α 100 мл и Hair Solution α 4 мл × 6 - те же два продукта, которые продаются здесь отдельно',
    'Роллер 0,5 мм - единственная часть этой коробки, которую нельзя купить саму по себе',
    'Шесть ампул против восьми в отдельной упаковке Hair Solution: курс короче',
    'Противопоказания к роллеру напечатаны на коробке и полностью изложены ниже',
  ],
  badges: ['Сделано в Корее', 'Три предмета', 'Роллер 0,5 мм', 'Шесть процедур'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '0,5 мм', label: 'глубина игл роллера' },
    { value: '6 × 4 мл', label: 'ампул против восьми в отдельной упаковке' },
    { value: '100 мл', label: 'пилинга - полноразмерный флакон' },
    { value: '4', label: 'шага протокола, напечатанные на коробке' },
  ],

  whatItIs: {
    eyebrow: 'Прочтите сначала это',
    title: 'Три компонента понятного протокола.',
    body:
      'Набор объединяет продукты 46 и 45 с роллером GENOSYS. Каждая формула сохраняет свою функцию, инструкцию и меры предосторожности, а набор задаёт порядок применения и число процедур.',
    items: [
      'Треть пилинга - денатурированный спирт. Он быстро обезжиривает кожу головы и не является мягким отшелушивающим средством',
      'Четыре рекомбинантных пептида в растворе дают вместе 1,2 ppm, без заявления об их влиянии на рост волос',
      'Здесь шесть ампул против восьми в отдельной упаковке, так что это более короткий курс из двух',
      'Зарегистрировано как средство для освежения кожи головы и кондиционирования волос - не как лечение выпадения',
    ],
    detail:
      'Функции двух жидкостей косметические: очищение и освежение кожи головы, затем питание и кондиционирование волос. Мы не приписываем набору подавление DHT, образование сосудов, предотвращение выпадения или отрастание волос.',
    carton:
      'При заметном или продолжающемся выпадении первым шагом должна быть медицинская диагностика. Набор можно использовать как косметический уход за кожей головы и волосами по инструкции, а не вместо лечения.',
  },

  contents: {
    eyebrow: 'Что в коробке',
    title: 'Три предмета, и только один из них есть исключительно здесь',
    intro:
      'В коробке собраны пилинг, раствор и роллер для последовательного курса из шести процедур.',
    items: [
      {
        name: 'HR³ MATRIX Scalp Peeling α',
        dose: '100 мл',
        body: 'Денатурированный спирт 33,600% с пропиленгликолем 11,994% помогает убрать себум, поверхностные чешуйки и остатки средств. В формуле также 1,7% охлаждающих компонентов между ментолом и ментиллактатом. Инструкция набора ставит это несмываемое косметическое очищение перед роллером и отделяет их этапом сушки.',
      },
      {
        name: 'HR³ MATRIX Hair Solution α',
        dose: '4 мл × 6',
        body: 'Четыре фактора роста суммарно 1,2 части на миллион, медный трипептид-1 5 ppm, ниацинамид и пантенол по 0,100%, в носителе из почти 10% пропиленгликоля, загущённом карбомером, чтобы средство оставалось на проборе, а не стекало с него. Отдельно продаётся в упаковке по восемь. Вскрыли ампулу - используйте сразу.',
      },
      {
        name: 'Роллер GENOSYS',
        dose: '0,5 мм',
        body: 'Единственная часть, которую нельзя купить отдельно, и причина, по которой две другие перестают быть просто средствами для нанесения. Коробка называет его штампом в одной строке и роллером в следующей; в самой коробке лежит барабанный роллер на ручке, и его прокатывают по пробору, а не прижимают.',
      },
    ],
  },

  arithmetic: {
    eyebrow: 'Арифметика',
    title: 'Состав и стоимость компонентов набора',
    intro:
      'Разбивка показывает стоимость каждого компонента и помогает выбрать между набором и отдельными продуктами.',
    rows: [
      { label: 'Пилинг α, 100 мл - куплен отдельно', value: '290', note: 'продукт 46' },
      { label: 'Hair Solution α, шесть ампул по цене отдельной упаковки', value: '555', note: '740 за восемь, то есть 92,50 за ампулу' },
      { label: 'Две жидкости вместе', value: '845', note: '' },
      { label: 'Этот набор', value: '1 100', note: 'как продаётся', here: true },
      { label: 'Что ставит роллер в', value: '255', note: '' },
    ],
    body:
      'Выбирайте набор, если вам нужен входящий в него роллер и курс из шести процедур. Если подходящий инструмент уже есть и нужны восемь ампул, Hair Solution доступен отдельной упаковкой. Выбор зависит от инструмента и желаемого числа процедур.',
  },

  roller: {
    eyebrow: 'Роллер',
    title: 'Полмиллиметра и те, кому им пользоваться не следует',
    body:
      'Глубина иглы - это весь аргумент в пользу этой коробки, и её нигде не было на нашем сайте - как, впрочем, и на английской стороне упаковки, которая глубины не указывает вовсе. Цифра 0,5 мм взята с русской панели той же коробки. Это косметическая глубина: достаточно, чтобы открыть путь через наружный слой кожи головы и раствор консистенции воды вошёл, а не лежал сверху, и меньше той глубины, на которой работает клиника. На коробке есть и список противопоказаний, который мы не передавали, а он важнее обычного на продукте, весь механизм которого - прокол кожи.',
    items: [
      { name: 'Глубина иглы', dose: '0,5 мм', note: 'с русской панели; английская глубины не даёт' },
      { name: 'Аллергия на металл', dose: 'Не использовать', note: 'иглы стальные' },
      { name: 'Склонность к келоидам', dose: 'Не использовать', note: 'кожу, которая плохо рубцуется, прокалывать не стоит' },
      { name: 'Дерматит', dose: 'Не использовать', note: 'дождитесь, пока кожа головы успокоится' },
    ],
    footnote:
      'Кое-чего коробка не говорит, поэтому скажем мы: в ней не указано, на сколько процедур рассчитан роллер. Относитесь к нему как к личной вещи, никогда его не передавайте и прекратите пользоваться, как только иглы перестанут ощущаться острыми: тупая игла не входит чисто, она тянет. А если вы встречали его под названием «штамп», в том числе в нашем собственном описании до сегодняшнего дня, - это заслуга коробки: в строке состава у неё «GENOSYS STAMP(ROLLER)», а в инструкции «roll (stamp)». Это роллер.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Очистить кожу головы, высушить, прокатать по пробору, помассировать',
    frequency: 'Одна ампула на процедуру · шесть процедур в коробке',
    steps: [
      {
        title: 'Втереть пилинг',
        body: 'Отлейте немного Scalp Peeling α, как следует пропитайте ватную палочку и втирайте её в обрабатываемую зону - слово самой коробки здесь «энергично». Не смывается и ощущается интенсивно холодным. Наносите только пока кожа головы неповреждённая; никогда не наносите раствор после роллера или на уже проколотую кожу.',
      },
      {
        title: 'Высушить кожу головы и волосы',
        body: 'Коробка велит высушить, а её арабская панель даёт и цифру: две-пять минут феном. Дайте спирту минуту улетучиться, прежде чем подносить тепло, - треть того флакона спирт, и во влажном виде он горюч. Следующему шагу нужна сухость: на влажной коже раствор стекает с пробора вместо того, чтобы остаться там, куда вы его нанесли.',
      },
      {
        title: 'Разделить волосы расчёской и прокатать',
        body: 'Сделайте пробор расчёской, прокатите роллер прямо по коже головы вдоль него и по ходу выпускайте раствор из капельницы. Сместитесь на сантиметр-другой, сделайте следующий пробор и повторяйте, пока не пройдёте всю зону.',
      },
      {
        title: 'Мягко помассировать',
        body: 'Лёгкий массаж обработанной зоны в конце. «Мягко» здесь ключевое слово: вы только что оставили в коже головы несколько сотен маленьких отверстий, и это не момент тереть с силой.',
      },
    ],
    note:
      'Коробка добавляет, что при необходимости последовательность можно повторить через десять минут. Используйте каждую ампулу сразу после вскрытия, остаток выбрасывайте: эта формула консервируется всего тридцатью частями на миллион феноксиэтанола и не рассчитана стоять наполовину использованной. Чего коробка не даёт - это интервала между процедурами, и мы не станем его выдумывать: разносите их настолько, чтобы кожа головы успела успокоиться до следующей.',
  },

  quality: {
    eyebrow: 'Качество',
    title: 'Что измерено по каждой жидкости',
    intro:
      'Обе жидкости сделаны в Корее и выпущены по письменной спецификации, и у каждой здесь своя страница со всеми цифрами. Это те, которые стоит увидеть рядом. По набору как комплекту не измерялось ничего, потому что в нём нечего измерять, кроме этих двух.',
    rows: [
      { label: 'Пилинг - внешний вид', value: 'Прозрачная жидкость' },
      { label: 'Пилинг - pH', value: '4,31, в пределах спецификации 4,00-5,00' },
      { label: 'Пилинг - стабильность', value: 'Проходит при 50 °C' },
      { label: 'Пилинг - чистота', value: 'Менее 10 КОЕ/мл по бактериям и по плесеням при допустимых 100 для каждого' },
      { label: 'Раствор - внешний вид', value: 'Непрозрачная жидкость' },
      { label: 'Раствор - pH', value: '6,65, в пределах спецификации 6,00-7,00' },
      { label: 'Раствор - вязкость', value: '800, по нижней границе спецификации 800-1 600' },
      { label: 'Раствор - чистота', value: 'Менее 10 КОЕ/мл' },
      { label: 'Срок годности', value: 'Три года невскрытыми, обе жидкости' },
      { label: 'Зарегистрированная функция', value: 'Пилинг: освежение кожи головы. Раствор: питание и кондиционирование волос' },
    ],
    patch:
      'Обе жидкости прошли патч-тест, и обе вернулись как не раздражающие, что стоит знать, учитывая, что одна из них на треть спирт. Оценщик добавляет к каждой одну и ту же оговорку: число добровольцев не было статистически значимым. Исследования эффективности нет ни по одной из жидкостей и ни по набору как комплекту.',
  },

  inci: {
    eyebrow: 'Составы',
    title: 'Всё, что в обоих флаконах',
    intro:
      'Две жидкости, два списка, оба переписаны с коробки в том порядке, в каком они напечатаны. Концентрации за ними - на страницах продуктов 46 и 45.',
    peeling: 'Пилинг α - полный список ингредиентов (INCI)',
    solution: 'Hair Solution α - полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Меры предосторожности',
    points: [
      'Не используйте роллер при аллергии на металл, склонности к келоидным рубцам или дерматите.',
      'Не прокатывайте по повреждённой, раненой, обожжённой солнцем, свежевыбритой или воспалённой коже головы.',
      'Только для наружного применения, на кожу головы.',
      'Пилинг содержит 33,6% денатурированного спирта. Он горюч - дайте ему улетучиться до фена или утюжка.',
      'Обе жидкости содержат ментол и дадут сильное ощущение холода; в пилинге его 0,900%.',
      'Держите обе подальше от глаз и слизистых, при попадании тщательно промойте прохладной водой.',
      'Используйте каждую ампулу сразу после вскрытия, остаток выбрасывайте.',
      'Коробка Hair Solution рекомендует воздержаться от применения при беременности и грудном вскармливании. Сначала спросите врача.',
      'Прекратите применение и обратитесь к врачу при покраснении, отёке или раздражении.',
      'Хранить вне доступа детей. В пилинге есть горькая добавка, но он по-прежнему на треть спирт.',
    ],
    note:
      'Составлено по зарегистрированному макету этого набора и по оценкам безопасности двух жидкостей. Проверьте формулировки на упаковке, которую получите.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Состав набора', value: 'Пилинг α 100 мл · Hair Solution α 4 мл × 6 · Роллер GENOSYS 0,5 мм' },
      { label: 'Глубина иглы', value: '0,5 мм' },
      { label: 'Аппликатор', value: 'Барабанный роллер. Коробка называет его и штампом' },
      { label: 'Процедуры', value: 'Шесть, по одной ампуле на каждую' },
      { label: 'Зарегистрированная функция', value: 'Пилинг: освежение кожи головы. Раствор: питание, кондиционирование волос' },
      { label: 'Пилинг - спирт', value: 'Alcohol denat. 33,600% - горюч' },
      { label: 'Пилинг - охлаждение', value: 'Ментол 0,900% с ментил лактатом 0,800%' },
      { label: 'Пилинг - салициловая кислота', value: '99 ppm - не кератолитическая доза' },
      { label: 'Раствор - факторы роста', value: '1,2 ppm суммарно, четыре пептида' },
      { label: 'Раствор - медный трипептид-1', value: '5 ppm' },
      { label: 'Раствор - носитель', value: 'Пропиленгликоль 9,995% с карбомером 0,450%' },
      { label: 'Нанесение', value: 'Пилинг палочкой, затем прокатывание каждого пробора с раствором. Не смывается' },
      { label: 'Продаются и отдельно', value: 'Пилинг сам по себе; раствор - в упаковке по восемь' },
      { label: 'Срок годности', value: 'Три года невскрытыми' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Набор дешевле, чем купить две жидкости отдельно?',
        a: 'Нет, и мы предпочитаем сказать это прямо. Пилинг сам по себе - 290 AED, шесть ампул по цене отдельной упаковки - 555 AED, так что жидкости дают 845 AED внутри набора за 1 100: роллер и есть эта разница в 255 AED. А купить пилинг и полную упаковку из восьми ампул отдельно - это 1 030 AED, то есть меньше денег за больший объём, но без роллера. Берите набор, если вам нужно чем работать с иглами; берите два продукта, если уже есть.',
        needsPrices: true,
      },
      {
        q: 'Почему шесть ампул, а не восемь?',
        a: 'Потому что набор укомплектован как курс из шести процедур, а отдельная упаковка Hair Solution α содержит восемь. Если нужен более длинный курс, отдельная упаковка выгоднее, а пилинг в обоих случаях один и тот же. Это самое полезное, что стоит знать перед выбором между ними, и ни по одной из коробок это не очевидно.',
      },
      {
        q: 'На коробке написано, что это предотвращает выпадение волос. Почему на странице этого нет?',
        a: 'Потому что две жидкости внутри зарегистрированы как средство для освежения кожи головы и кондиционер для волос, и это то заявление, за которым мы можем стоять. Английский текст коробки описывает систему, которая предотвращает выпадение и способствует повторному росту, подавляя фундаментальные причины выпадения, а русская панель ещё сильнее. Подавление причин выпадения - это то, что делает лекарство; косметика, зарегистрированная для кондиционирования, эту фразу не одалживает. Всё остальное на этой странице - дозы, глубина, сертификаты - здесь для того, чтобы вы могли судить сами, не нуждаясь в том, чтобы это заявление было правдой.',
      },
      {
        q: 'Это штамп или роллер?',
        a: 'Роллер. Путаница - заслуга коробки: в строке состава у неё «GENOSYS STAMP(ROLLER)», а инструкция велит «roll (stamp)» по коже головы. Наше собственное описание называло его штампом до сегодняшнего дня. Приходит барабанный роллер на ручке, и его прокатывают по каждому пробору, а не прижимают.',
      },
      {
        q: 'Больно ли на 0,5 мм?',
        a: 'Для большинства это скорее ощутимо, чем больно, и предшествующий пилинг отзовётся сильнее - он на треть спирт с 0,9% ментола и попадает на только что обезжиренную кожу. Сам роллер - косметическая глубина. Если вы давите настолько, что действительно больно, вы давите слишком сильно.',
      },
      {
        q: 'Можно ли после роллера нанести что-то своё?',
        a: 'Только то, что предназначено для кожи после игл. Это реальное ограничение, а не рекламная фраза: формула, совершенно безопасная на поверхности кожи головы, - это уже другой разговор, когда вы открыли путь мимо неё. Раствор в этой коробке для этого и составлен, поэтому именно он лежит рядом с роллером.',
      },
      {
        q: 'Нужны ли мне ещё шампунь или тоник?',
        a: 'У них другая роль. Этот набор - отдельная периодическая процедура, а шампунь MEDI α и Hair Tonic α - уход между сеансами. Тоник не используют с роллером: его распыляют на кожу головы, распределяют пальцами и оставляют минимум на 3-4 часа.',
      },
    ],
  },

  companionsTitle: 'Что рядом с ним',
  backToProducts: 'Продукты',
}

export const MESOPECIA_KIT_COPY: Record<Locale, MesopeciaKitCopy> = {
  en: EN,
  ar: MESOPECIA_KIT_AR,
  ru: MESOPECIA_KIT_RU,
}

export function getMesopeciaKitCopy(locale: string | undefined): MesopeciaKitCopy {
  return MESOPECIA_KIT_COPY[(locale as Locale) ?? 'en'] ?? MESOPECIA_KIT_COPY.en
}

/**
 * The two liquids inside the box first, because this page argues that buying them
 * separately is the better choice for anyone wanting a full course. Then the daily
 * pair the treatment sits inside.
 */
export const COMPANION_PRODUCT_IDS = ['45', '46', '43', '44'] as const
