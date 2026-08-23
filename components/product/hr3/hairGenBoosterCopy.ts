import {
  HAIRGEN_BOOSTER_AR,
  HAIRGEN_BOOSTER_RU,
} from './hairGenBoosterLocalizedCopy'

/**
 * Bespoke copy for the HairGen BOOSTER (product 3), the powered device the HR³ MATRIX
 * hair system is built around.
 *
 * SOURCING — the 17 Jun 2021 sales leaflet and the multilingual user manual, both in
 * `~/Desktop/Drive/Genosys/Training Materials/HairGen_Booster/`. There is no Intertek
 * dossier because it is a device rather than a cosmetic: no INCI, no formula, no COA. The
 * equivalent of a formula table here is the specification, and that is what this page is
 * built on. Full audit:
 * docs/SESSION_CHANGES_2026-08-18_PRODUCT_3_HAIRGEN_BOOSTER_AUDIT.md
 *
 * ★ THE LEAFLET IS THE WORST CLAIM DOCUMENT IN THE WHOLE LINE. It is subtitled
 * "Automicroneedling LED Device for Alopecia Treatment" and opens a section headed
 * "Clinical Trials" with before/after photographs captioned "Alopecia areata" (after 3
 * months, after 8 months) and "Androgenic alopecia". **Alopecia areata is an autoimmune
 * disease.** Presenting a cosmetic device as its treatment, with clinical photographs, is
 * a different order of claim from anything else found in this range.
 *
 * It also asserts: "improves hair loss by promoting new vessel formation and blood
 * circulation", "promote angiogenesis and vasodilation", a wound-healing section claiming
 * microneedling stimulates "natural collagen and elastin production" and "angiogenesis,
 * new vessel formation", LED claims of "stimulate anagen re-entry to telogen hair
 * follicles", "prolong duration of anagen phase" and "prevent premature catagen
 * development", and for the ampoule "Inibition of 5α-reductase, the key enzyme causing
 * male hair loss" (sic) with VEGF named first in its key-ingredient list.
 *
 * NONE OF IT IS CARRIED. The page states what the device does mechanically and says
 * plainly that no efficacy study is held. That is the eighth document in this line
 * asserting a prescription-drug mechanism.
 *
 * ★ THE LANGUAGE SPLIT RUNS BACKWARDS HERE. The manual's Korean, German and Chinese
 * panels call it a device for SCALP CARE; the English, French, Turkish and Arabic panels
 * call it an anti-hair-loss treatment. On the hair tonic it was the other way round —
 * Korean carried the claim and English was conservative. The page follows the
 * conservative reading, which is also the framing decision applied to products 43–47.
 *
 * ★ NEEDLE DEPTH BELONGS TO THE CONSUMABLE, NOT THE DEVICE. The handpiece has no depth of
 * its own — it is whatever stamp is fitted. The HR³ MATRIX HAIR STAMP (product 64) is
 * stated as 0.3 mm on the distributor's instruction to match the product artwork, and
 * product 64's page carries the same figure with the same caveat: it appears in neither
 * the DTS MG leaflet, the user manual nor the official labels, and confirmation has been
 * requested in writing. This page must say the same thing 64's page says, or the two
 * contradict each other.
 *
 * Do not borrow the Mesopecia kit's 0.5 mm: that belongs to its roller, a different
 * applicator on a different product.
 *
 * MUST NEVER BE ADDED:
 *   - Alopecia, alopecia areata, androgenic alopecia, or the before/after photographs.
 *   - Angiogenesis, vasodilation, new vessel formation, blood circulation.
 *   - Anagen / telogen / catagen mechanics.
 *   - 5α-reductase, DHT, VEGF as an active.
 *   - Wound healing, collagen and elastin production.
 *   - A needle depth.
 *   - Any efficacy claim for the LEDs.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface HairGenBoosterCopy {
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
    /** The leaflet's own claims, quoted and refused. */
    leaflet: string
  }

  build: {
    eyebrow: string
    title: string
    intro: string
    items: Array<{ name: string; dose: string; body: string }>
  }

  running: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ label: string; value: string; note: string; here?: boolean }>
    body: string
  }

  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }

  depth: {
    eyebrow: string
    title: string
    body: string
    note: string
  }

  spec: {
    eyebrow: string
    title: string
    rows: Array<{ label: string; value: string }>
  }

  safety: {
    eyebrow: string
    title: string
    points: string[]
    note: string
  }

  video: { eyebrow: string; title: string; body: string }

  /** `needsPrices` marks answers quoting dirham figures; hidden from signed-out visitors. */
  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string; needsPrices?: boolean }>
  }

  companionsTitle: string
  backToProducts: string
}

const EN: HairGenBoosterCopy = {
  eyebrow: 'HairGen BOOSTER · auto-microneedling LED handpiece',
  headline: 'It stamps for you, and the ampoule goes in as the needles work.',
  subheadline:
    'A powered handpiece for the scalp. A single-use stamp carrying 52 microneedles screws onto a sealed 4 ml vial of HR³ MATRIX HAIR SOLUTION α, the vial loads into the device, and the head stamps automatically while the solution feeds through it — so the liquid enters as the needles open the way rather than being rubbed on afterwards. Three speeds, ten minutes, then it stops itself.',
  heroBullets: [
    '52 microneedles on a single-use stamp, replaced every session',
    'Three speeds — 280, 330 and 400 stamps per minute',
    'Ten-minute session, timed by the device, which then switches off',
    'Takes one sealed 4 ml ampoule per treatment; nothing is decanted',
  ],
  badges: ['Made in Korea', '52 needles', '10-minute session', '24-month warranty'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '52', label: 'microneedles per stamp' },
    { value: '280–400', label: 'stamps per minute, three levels' },
    { value: '10 min', label: 'then the device stops itself' },
    { value: '24 mo', label: 'warranty' },
  ],

  whatItIs: {
    eyebrow: 'Read this first',
    title: 'What this device does, and what we are not going to tell you it does.',
    body:
      'Mechanically it is straightforward and it is genuinely useful: it opens micro-channels in the scalp at an even rate and an even pressure, and it delivers a sealed ampoule through those channels while it works. A hand roller does the first half of that and none of the second, and it does it at whatever rate and pressure your wrist happens to apply.',
    items: [
      'The ampoule it delivers is registered for nutrition supply and hair conditioning',
      'It is not registered to treat hair loss, and neither is the solution',
      'No efficacy study for this device is held by us',
      'The needle depth is the fitted stamp\u2019s: 0.3 mm — see below for where that comes from',
    ],
    detail:
      'That is the whole of what we will claim. It is a delivery device with a timer, and the reason to want one is consistency: the same rate, the same pressure, the same ten minutes, every time.',
    leaflet:
      'We are saying that plainly because the manufacturer\u2019s own leaflet does not. It is subtitled "Automicroneedling LED Device for Alopecia Treatment" and it opens with a section headed "Clinical Trials" showing before-and-after photographs captioned alopecia areata and androgenic alopecia. Alopecia areata is an autoimmune disease. It goes on to claim new blood vessel formation, wound healing, collagen production and a set of hair-cycle mechanics, and for the ampoule it claims inhibition of the enzyme that converts testosterone to DHT — which is the mechanism of a prescription medicine. None of that appears on this page or anywhere else on our site. If you are losing hair, the first appointment is with a doctor, and this is something you might use alongside what they advise.',
  },

  build: {
    eyebrow: 'The specification',
    title: 'What is actually in the head',
    intro:
      'On a cosmetic we publish the formula. On a device the specification is the equivalent, so here it is, from the manufacturer\u2019s leaflet and user manual.',
    items: [
      {
        name: 'Microneedles',
        dose: '52',
        body: 'On a single-use stamp that screws onto the ampoule. It is fitted fresh for every session and thrown away afterwards — this is not a cleanable part, and it is the running cost of owning the device.',
      },
      {
        name: 'Stamping rate',
        dose: '280 · 330 · 400',
        body: 'Stamps per minute, across three levels, changed with a short press of the power button. The argument for a powered handpiece over a hand roller is exactly this: a rate you set rather than a rate your hand drifts into.',
      },
      {
        name: 'Session length',
        dose: '10 min',
        body: 'The device counts it and switches off. Treatment length stops being a judgement call, which on a device that punctures skin is worth more than it sounds.',
      },
      {
        name: 'LEDs',
        dose: '14',
        body: 'Blue and red, dispersed through 48 light bumps in the head that contacts the scalp. The manufacturer makes claims for what the light does; we do not carry them, and we would rather tell you the count than imply an effect.',
      },
      {
        name: 'Power',
        dose: '5 V / 2 A',
        body: 'Rechargeable, over a standard 5 V charger rated 1–2 A. Charge it after use rather than before the next session, which is the manual\u2019s own advice and the reason a device sits dead in a drawer.',
      },
      {
        name: 'Warranty',
        dose: '24 months',
        body: 'From purchase, for normal use in line with the published guidelines. Not covered: user damage, unauthorised repair, and modification.',
      },
    ],
  },

  running: {
    eyebrow: 'The running cost',
    title: 'What a session costs after you own the device',
    intro:
      'Every treatment needs a fresh stamp and a fresh ampoule. That is not a detail to find out later, so here it is up front.',
    rows: [
      { label: 'HR³ MATRIX HAIR SOLUTION α — one 4 ml vial', value: '92.50', note: 'AED 740 for eight' },
      { label: 'HR³ MATRIX HAIR STAMP — one stamp', value: '57.50', note: 'AED 460 for eight' },
      { label: 'Per session', value: '150', note: 'consumables only', here: true },
      { label: 'The device itself', value: '1,800', note: 'once' },
    ],
    body:
      'Two things worth knowing. A box of each covers eight sessions, so buying consumables in pairs keeps them in step. And if you want the same idea without the electronics, the HR³ MATRIX Mesopecia Kit is the manual version — a 0.5 mm roller with the peeling and six of the same ampoules, at AED 1,100 all in.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Load the ampoule, part the hair, work along the parting',
    frequency: 'One vial and one stamp per session · ten minutes',
    steps: [
      {
        title: 'Fit a fresh stamp to the ampoule',
        body: 'Take the cap and the metallic lid off a sealed HR³ MATRIX HAIR SOLUTION α vial and screw a new hair stamp onto the opening. The stamp is the part that pierces; the vial is the part that feeds it.',
      },
      {
        title: 'Load it into the device',
        body: 'Twist the LED cover off the handpiece, seat the ampoule-and-stamp assembly in the bottom of the device, then twist the LED part back on until it clicks.',
      },
      {
        title: 'Switch on and set the speed',
        body: 'Hold the power button for about two seconds to start. A short press cycles the stamping speed through levels 1, 2 and 3 — 280, 330 and 400 per minute.',
      },
      {
        title: 'Part the hair and work along it',
        body: 'Take a parting with a comb and move the head along it, letting the device do the stamping rather than pressing. Take the next parting and repeat until you have covered the area you are treating.',
      },
      {
        title: 'Let it stop itself',
        body: 'It shuts off after ten minutes. That is one session — do not restart it for a second run in the same sitting.',
      },
      {
        title: 'Strip it down and charge it',
        body: 'Twist the LED cover off again, remove the spent ampoule with its stamp and throw both away. Then charge the device, so it is ready rather than flat next time.',
      },
    ],
    note:
      'Use the ampoule the moment it is opened — it is preserved with only 30 parts per million of phenoxyethanol and is not built to sit half-used. And use only what the manufacturer recommends with this device: it opens channels in skin, and a formula that is perfectly safe sitting on the surface is a different proposition once there is a route past it.',
  },

  depth: {
    eyebrow: 'The number everyone asks first',
    title: 'The depth belongs to the stamp, not the handpiece',
    body:
      'This device has no needle depth of its own. It is whatever stamp is fitted, and the stamp it takes — the HR³ MATRIX HAIR STAMP — is 0.3 mm, which is a cosmetic depth rather than a clinical one. That matches the manufacturer\u2019s description of the sensation as massaging rather than needling.',
    note:
      'Worth knowing where that figure comes from: it is on the product artwork, and it appears in neither the DTS MG leaflet nor the user manual, both of which are silent on depth. We have asked DTS MG to confirm it in writing. If their answer differs, this page and the stamp\u2019s own page change together. And it is not the 0.5 mm you may have seen on the Mesopecia Kit — that belongs to the roller in that box, a different applicator.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'Type', value: 'Rechargeable auto-microneedling handpiece with LED head' },
      { label: 'Microneedles', value: '52, on a single-use stamp' },
      { label: 'Needle depth', value: '0.3 mm — the fitted stamp\u2019s depth, per the product artwork' },
      { label: 'Speeds', value: 'Three levels — 280, 330 and 400 per minute' },
      { label: 'Session', value: 'Ten minutes, then automatic shut-off' },
      { label: 'LEDs', value: '14, blue and red, through 48 light bumps' },
      { label: 'Used with', value: 'HR³ MATRIX HAIR SOLUTION α — one sealed 4 ml vial per session' },
      { label: 'Consumables', value: 'HR³ MATRIX HAIR STAMP, sold in boxes of eight' },
      { label: 'Power', value: '5.0 V DC / 2.0 A · charger rated 5 V, 1–2 A' },
      { label: 'Warranty', value: '24 months from purchase, normal use' },
      { label: 'Evidence', value: 'No efficacy study for this device is held' },
      { label: 'Origin', value: 'South Korea — DTS MG Co., Ltd.' },
    ],
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Who should not use this',
    points: [
      'Do not use if you have progressive acne, eczema or any dermatitis.',
      'Do not use if you have complications of diabetes or another serious illness.',
      'Do not use if you are keloid-prone or have a metal allergy — the needles are steel.',
      'Do not use over inflamed areas, or areas at risk of infection.',
      'Do not use on broken, wounded, sunburned or freshly shaved scalp.',
      'Stop immediately and seek medical advice if a rash or allergic reaction appears.',
      'Do not use with cosmetics other than those the manufacturer recommends.',
      'A fresh stamp every session. It is single use and it is personal — never share one.',
      'Do not disassemble, modify or repair the device yourself.',
      'Do not handle the device or the charger with wet hands. Keep out of reach of children.',
    ],
    note:
      'Taken from the user manual, which sets its contraindications out across several language panels rather than in one list. If any of them apply to you, ask a doctor before buying rather than after.',
  },

  video: {
    eyebrow: 'In use',
    title: 'The device, working',
    body: 'A short demonstration of loading an ampoule and working along a parting.',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'How deep do the needles go?',
        a: '0.3 mm — but the depth belongs to the stamp rather than the handpiece, so it is really a question about the consumable. That figure is on the product artwork; it appears in neither the DTS MG leaflet nor the user manual, and we have asked DTS MG to confirm it in writing. It is not the 0.5 mm from the Mesopecia Kit, which is the roller in that box. For scale, 0.3 mm is a cosmetic depth, which matches the manufacturer describing the sensation as massaging rather than needling.',
      },
      {
        q: 'What does it cost to run?',
        a: 'A fresh 4 ml ampoule and a fresh stamp every session — AED 92.50 and AED 57.50 at list prices, so AED 150 a treatment on top of the device. Both come in boxes of eight, which is a tidy eight sessions if you buy them in pairs.',
        needsPrices: true,
      },
      {
        q: 'Will it regrow my hair?',
        a: 'We are not going to tell you it will. The ampoule it delivers is registered for nutrition supply and hair conditioning, this device holds no efficacy study that we have seen, and the manufacturer\u2019s own leaflet makes claims — including treating alopecia areata, which is an autoimmune disease — that we do not carry. If you are losing hair, see a doctor. Several causes are treatable with things no device can replace.',
      },
      {
        q: 'How is this different from the Mesopecia Kit?',
        a: 'The kit is the manual version of the same idea: a 0.5 mm roller with the scalp peeling and six ampoules, at AED 1,100 all in. This is the powered version — you buy the handpiece once and the consumables per session. The kit is the better first purchase if you want to try the protocol; this is the better one if you already know you will keep doing it and want the rate and the timing taken out of your hands.',
        needsPrices: true,
      },
      {
        q: 'Does it hurt?',
        a: 'The manufacturer describes it as a massaging sensation rather than a needling one, with no pain during treatment. Take that as written by the manufacturer. What will register more strongly is the scalp peeling, if you use it first — that is a third denatured alcohol with 0.9% menthol going onto skin that has just been degreased.',
      },
      {
        q: 'Can I use my own serum in it?',
        a: 'Only something meant to go into needled skin, and the manual is explicit that you should not use cosmetics other than those the manufacturer recommends. This is a real constraint rather than a way of selling you ampoules: a formula that is perfectly safe on top of the scalp is a different proposition once you have opened a route past the barrier. The ampoule is also physically part of the mechanism here — the stamp screws onto the vial.',
      },
    ],
  },

  companionsTitle: 'What it needs',
  backToProducts: 'Products',
}

/** @deprecated Retained temporarily for comparison; not used by the storefront. */
export const LEGACY_HAIRGEN_BOOSTER_AR: HairGenBoosterCopy = {
  eyebrow: 'هيرجين بوستر · قبضة وخز دقيق آلية مع LED',
  headline: 'يختم عنك، وتدخل الأمبولة مع عمل الإبر.',
  subheadline:
    'قبضة كهربائية لفروة الرأس. يُركَّب ختم للاستعمال مرة واحدة يحمل 52 إبرة ميكروية على قنينة مغلقة سعة 4 مل من HR³ MATRIX HAIR SOLUTION α، وتُحمَّل القنينة في الجهاز، فيختم الرأس تلقائياً بينما يمرّ المحلول من خلاله — فيدخل السائل بينما تفتح الإبر الطريق، بدل أن يُفرك بعده. ثلاث سرعات، عشر دقائق، ثم يتوقّف وحده.',
  heroBullets: [
    '52 إبرة ميكروية على ختم للاستعمال مرة واحدة، يُستبدل كل جلسة',
    'ثلاث سرعات — 280 و330 و400 ختمة في الدقيقة',
    'جلسة عشر دقائق يحسبها الجهاز ثم يطفئ نفسه',
    'يأخذ أمبولة مغلقة واحدة سعة 4 مل لكل جلسة؛ ولا يُسكب شيء',
  ],
  badges: ['صُنع في كوريا', '52 إبرة', 'جلسة 10 دقائق', 'ضمان 24 شهراً'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '52', label: 'إبرة ميكروية لكل ختم' },
    { value: '280–400', label: 'ختمة في الدقيقة، ثلاثة مستويات' },
    { value: '10 min', label: 'ثم يتوقّف الجهاز وحده' },
    { value: '24 mo', label: 'ضمان' },
  ],

  whatItIs: {
    eyebrow: 'اقرئي هذا أولاً',
    title: 'ما يفعله هذا الجهاز، وما لن نقول لك إنه يفعله.',
    body:
      'ميكانيكياً الأمر بسيط ومفيد فعلاً: يفتح قنوات دقيقة في فروة الرأس بمعدّل منتظم وضغط منتظم، ويوصل أمبولة مغلقة عبر تلك القنوات أثناء عمله. أما الرولر اليدوي فيفعل النصف الأول فقط ولا يفعل الثاني، ويفعله بأي معدّل وضغط يصادف أن تطبّقه يدك.',
    items: [
      'الأمبولة التي يوصلها مسجّلة لإمداد التغذية وتكييف الشعر',
      'وهو غير مسجّل لعلاج تساقط الشعر، ولا المحلول كذلك',
      'ولا نملك دراسة فعالية لهذا الجهاز',
      'وعمق الإبرة هو عمق الختم المركّب: 0.3 مم — انظري أدناه من أين جاء',
    ],
    detail:
      'وهذا كل ما سندّعيه. إنه جهاز توصيل بمؤقّت، وسبب الرغبة فيه هو الاتساق: المعدّل نفسه، والضغط نفسه، والعشر دقائق نفسها، في كل مرة.',
    leaflet:
      'ونقول ذلك بوضوح لأن كتيّب الشركة نفسه لا يقوله. فهو يحمل العنوان الفرعي «جهاز LED للوخز الدقيق الآلي لعلاج الثعلبة»، ويفتتح بقسم عنوانه «تجارب سريرية» يعرض صوراً قبل وبعد موسومة بالثعلبة البقعية والثعلبة الأندروجينية. والثعلبة البقعية مرض مناعي ذاتي. ويمضي فيدّعي تكوّن أوعية دموية جديدة، والتئام الجروح، وإنتاج الكولاجين، ومجموعة من آليات دورة الشعر، ويدّعي للأمبولة تثبيط الإنزيم الذي يحوّل التستوستيرون إلى DHT — وتلك آلية دواء بوصفة طبية. ولا شيء من ذلك يظهر على هذه الصفحة ولا في أي مكان آخر على موقعنا. فإن كنت تفقدين شعرك، فالموعد الأول مع طبيب، وهذا شيء قد تستعملينه إلى جانب ما ينصح به.',
  },

  build: {
    eyebrow: 'المواصفات',
    title: 'ما في الرأس فعلاً',
    intro:
      'في مستحضر التجميل ننشر التركيبة. وفي الجهاز المواصفة هي المكافئ، وها هي، من كتيّب الشركة ودليل الاستعمال.',
    items: [
      {
        name: 'الإبر الميكروية',
        dose: '52',
        body: 'على ختم للاستعمال مرة واحدة يُركَّب على الأمبولة. يُوضع جديداً في كل جلسة ويُرمى بعدها — فهذه ليست قطعة تُنظّف، وهي تكلفة تشغيل الجهاز.',
      },
      {
        name: 'معدّل الختم',
        dose: '280 · 330 · 400',
        body: 'ختمة في الدقيقة، عبر ثلاثة مستويات، تُغيَّر بضغطة قصيرة على زر التشغيل. وحجّة القبضة الآلية على الرولر اليدوي هي هذه تحديداً: معدّل تضبطينه أنت لا معدّل تنجرف إليه اليد.',
      },
      {
        name: 'مدة الجلسة',
        dose: '10 min',
        body: 'يحسبها الجهاز ثم يطفئ. فتتوقّف مدة العلاج عن كونها تقديراً، وهذا في جهاز يثقب البشرة يساوي أكثر ممّا يبدو.',
      },
      {
        name: 'مصابيح LED',
        dose: '14',
        body: 'زرقاء وحمراء، موزّعة عبر 48 نتوءاً ضوئياً في الرأس الملامس للفروة. وللشركة ادّعاءات عمّا يفعله الضوء؛ ونحن لا ننقلها، ونفضّل أن نخبرك بالعدد على أن نلمّح إلى أثر.',
      },
      {
        name: 'الطاقة',
        dose: '5 V / 2 A',
        body: 'قابل للشحن، عبر شاحن قياسي 5 فولت بتصنيف 1–2 أمبير. اشحنيه بعد الاستعمال لا قبل الجلسة التالية، وهي نصيحة الدليل نفسه، وسبب بقاء الأجهزة ميتة في الأدراج.',
      },
      {
        name: 'الضمان',
        dose: '24 شهراً',
        body: 'من الشراء، للاستعمال العادي وفق التعليمات المنشورة. ولا يشمل: ضرر المستخدم، والإصلاح غير المرخّص، والتعديل.',
      },
    ],
  },

  running: {
    eyebrow: 'تكلفة التشغيل',
    title: 'كم تكلّف الجلسة بعد أن تملكي الجهاز',
    intro: 'كل جلسة تحتاج ختماً جديداً وأمبولة جديدة. وهذه ليست تفصيلة تُكتشف لاحقاً، فها هي مقدّماً.',
    rows: [
      { label: 'HR³ MATRIX HAIR SOLUTION α — قنينة 4 مل واحدة', value: '92.50', note: '740 درهماً لثماني' },
      { label: 'HR³ MATRIX HAIR STAMP — ختم واحد', value: '75', note: '600 درهم لثماني' },
      { label: 'للجلسة الواحدة', value: '167.50', note: 'مستهلكات فقط', here: true },
      { label: 'الجهاز نفسه', value: '1,800', note: 'مرة واحدة' },
    ],
    body:
      'أمران يستحقان المعرفة. علبة من كل منهما تغطّي ثماني جلسات، فشراء المستهلكات مزدوجة يبقيهما متوافقين. وإن أردت الفكرة نفسها بلا إلكترونيات، فطقم ميزوبيشيا هو النسخة اليدوية — رولر 0.5 مم مع المقشّر وستّ من الأمبولات نفسها، بـ1,100 درهم شاملة.',
  },

  howTo: {
    eyebrow: 'طريقة الاستعمال',
    title: 'حمّلي الأمبولة، افرقي الشعر، واعملي على امتداد الفرق',
    frequency: 'قنينة وختم لكل جلسة · عشر دقائق',
    steps: [
      {
        title: 'ركّبي ختماً جديداً على الأمبولة',
        body: 'انزعي الغطاء والغلاف المعدني عن قنينة HR³ MATRIX HAIR SOLUTION α مغلقة، واربطي ختماً جديداً على الفتحة. فالختم هو ما يخترق، والقنينة هي ما يغذّيه.',
      },
      {
        title: 'حمّليها في الجهاز',
        body: 'أديري غطاء الـLED لفصله عن القبضة، وضعي مجموعة الأمبولة والختم في أسفل الجهاز، ثم أعيدي تركيب جزء الـLED حتى تسمعي طقّة.',
      },
      {
        title: 'شغّليه واضبطي السرعة',
        body: 'اضغطي زر التشغيل نحو ثانيتين للبدء. وضغطة قصيرة تنقّل سرعة الختم بين المستويات 1 و2 و3 — أي 280 و330 و400 في الدقيقة.',
      },
      {
        title: 'افرقي الشعر واعملي على امتداده',
        body: 'خذي فرقاً بالمشط وحرّكي الرأس عليه، ودعي الجهاز يختم بدل أن تضغطي. ثم خذي الفرق التالي وكرّري حتى تغطّي المنطقة التي تعالجينها.',
      },
      {
        title: 'دعيه يتوقّف وحده',
        body: 'يطفئ بعد عشر دقائق. وتلك جلسة واحدة — لا تعيدي تشغيله لجولة ثانية في الجلسة نفسها.',
      },
      {
        title: 'فكّيه واشحنيه',
        body: 'أديري غطاء الـLED مجدداً، وانزعي الأمبولة المستهلكة مع ختمها وارميهما. ثم اشحني الجهاز ليكون جاهزاً لا فارغاً في المرة القادمة.',
      },
    ],
    note:
      'استعملي الأمبولة فور فتحها — فهي محفوظة بثلاثين جزءاً من المليون فقط من الفينوكسي إيثانول ولم تُصمَّم لتبقى نصف مستعملة. ولا تستعملي مع هذا الجهاز إلا ما توصي به الشركة: فهو يفتح قنوات في البشرة، والتركيبة الآمنة تماماً على السطح تصير أمراً آخر متى وُجد طريق يتجاوزه.',
  },

  depth: {
    eyebrow: 'الرقم الذي يسأل عنه الجميع أولاً',
    title: 'العمق يخصّ الختم لا القبضة',
    body:
      'ليس لهذا الجهاز عمق إبرة خاص به. فالعمق هو عمق الختم المركّب، والختم الذي يأخذه — HR³ MATRIX HAIR STAMP — هو 0.3 مم، وهو عمق تجميلي لا سريري. وهذا يوافق وصف الشركة للإحساس بأنه تدليك لا وخز.',
    note:
      'ويستحق أن تعرفي من أين جاء هذا الرقم: إنه على تصميم المنتج، ولا يظهر في كتيّب DTS MG ولا في دليل الاستعمال، وكلاهما صامت عن العمق. وقد طلبنا من DTS MG تأكيده كتابةً. فإن اختلف جوابهم، تتغيّر هذه الصفحة وصفحة الختم معاً. وهو ليس الـ0.5 مم التي ربما رأيتها على طقم ميزوبيشيا — فتلك تخصّ الرولر في تلك العلبة، وهو أداة مختلفة.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'النوع', value: 'قبضة وخز دقيق آلية قابلة للشحن برأس LED' },
      { label: 'الإبر الميكروية', value: '52، على ختم للاستعمال مرة واحدة' },
      { label: 'عمق الإبرة', value: '0.3 مم — عمق الختم المركّب، وفق تصميم المنتج' },
      { label: 'السرعات', value: 'ثلاثة مستويات — 280 و330 و400 في الدقيقة' },
      { label: 'الجلسة', value: 'عشر دقائق، ثم إطفاء تلقائي' },
      { label: 'مصابيح LED', value: '14، زرقاء وحمراء، عبر 48 نتوءاً ضوئياً' },
      { label: 'يُستعمل مع', value: 'HR³ MATRIX HAIR SOLUTION α — قنينة مغلقة 4 مل لكل جلسة' },
      { label: 'المستهلكات', value: 'HR³ MATRIX HAIR STAMP، يُباع في علب من ثماني' },
      { label: 'الطاقة', value: '5.0 فولت تيار مستمر / 2.0 أمبير · شاحن 5 فولت، 1–2 أمبير' },
      { label: 'الضمان', value: '24 شهراً من الشراء، للاستعمال العادي' },
      { label: 'الأدلة', value: 'لا نملك دراسة فعالية لهذا الجهاز' },
      { label: 'المنشأ', value: 'كوريا الجنوبية — DTS MG Co., Ltd.' },
    ],
  },

  safety: {
    eyebrow: 'قبل الاستعمال',
    title: 'من لا ينبغي له استعمال هذا',
    points: [
      'لا تستعمليه إن كان لديك حبّ شباب متطوّر أو إكزيما أو أي التهاب جلدي.',
      'لا تستعمليه إن كانت لديك مضاعفات سكري أو مرض خطير آخر.',
      'لا تستعمليه إن كنت معرّضة للجدرة أو لديك حساسية من المعادن — فالإبر من الفولاذ.',
      'لا تستعمليه فوق مناطق ملتهبة أو معرّضة للعدوى.',
      'لا تستعمليه على فروة مجروحة أو مصابة أو محروقة بالشمس أو محلوقة حديثاً.',
      'أوقفي الاستعمال فوراً واستشيري طبيباً عند ظهور طفح أو تحسّس.',
      'لا تستعمليه مع مستحضرات غير التي توصي بها الشركة.',
      'ختم جديد كل جلسة. فهو للاستعمال مرة واحدة وهو غرض شخصي — لا تشاركيه أبداً.',
      'لا تفكّي الجهاز ولا تعدّليه ولا تصلحيه بنفسك.',
      'لا تلمسي الجهاز أو الشاحن بيدين مبتلّتين. ويُحفظ بعيداً عن متناول الأطفال.',
    ],
    note:
      'مأخوذة من دليل الاستعمال، الذي يوزّع موانعه على عدة لوحات لغوية بدل قائمة واحدة. فإن انطبق عليك أيٌّ منها، فاسألي طبيباً قبل الشراء لا بعده.',
  },

  video: {
    eyebrow: 'أثناء الاستعمال',
    title: 'الجهاز، وهو يعمل',
    body: 'عرض قصير لتحميل الأمبولة والعمل على امتداد الفرق.',
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'كم يبلغ عمق الإبر؟',
        a: '0.3 مم — لكن العمق يخصّ الختم لا القبضة، فهو في الحقيقة سؤال عن المستهلك. وهذا الرقم على تصميم المنتج؛ ولا يظهر في كتيّب DTS MG ولا في دليل الاستعمال، وقد طلبنا من DTS MG تأكيده كتابةً. وهو ليس الـ0.5 مم من طقم ميزوبيشيا، فتلك هي الرولر في تلك العلبة. وللمقارنة، 0.3 مم عمق تجميلي، وهو ما يوافق وصف الشركة للإحساس بأنه تدليك لا وخز.',
      },
      {
        q: 'كم تكلفة التشغيل؟',
        a: 'أمبولة 4 مل جديدة وختم جديد كل جلسة — 92.50 درهماً و75 درهماً بأسعار القائمة، أي نحو 167.50 درهماً للجلسة فوق ثمن الجهاز. وكلاهما يأتي في علب من ثماني، أي ثماني جلسات مرتّبة إن اشتريتهما معاً.',
        needsPrices: true,
      },
      {
        q: 'هل سيعيد إنبات شعري؟',
        a: 'لن نقول لك إنه سيفعل. فالأمبولة التي يوصلها مسجّلة لإمداد التغذية وتكييف الشعر، وهذا الجهاز لا نملك له دراسة فعالية، وكتيّب الشركة نفسه يحمل ادّعاءات — منها علاج الثعلبة البقعية، وهي مرض مناعي ذاتي — لا ننقلها. فإن كنت تفقدين شعرك، راجعي طبيباً. فعدة أسباب تُعالج بأشياء لا يستطيع أي جهاز أن يحلّ محلها.',
      },
      {
        q: 'ما الفرق بينه وبين طقم ميزوبيشيا؟',
        a: 'الطقم هو النسخة اليدوية من الفكرة نفسها: رولر 0.5 مم مع مقشّر الفروة وستّ أمبولات، بـ1,100 درهم شاملة. وهذا هو النسخة الكهربائية — تشترين القبضة مرة والمستهلكات لكل جلسة. والطقم شراء أول أفضل إن أردت تجربة البروتوكول؛ وهذا أفضل إن كنت تعرفين أنك ستواظبين وتريدين إخراج المعدّل والتوقيت من يديك.',
        needsPrices: true,
      },
      {
        q: 'هل يؤلم؟',
        a: 'تصفه الشركة بإحساس تدليك لا وخز، بلا ألم أثناء الاستعمال. خذي ذلك على أنه كلام الشركة. إذا كان بروتوكول الطقم يتضمن Scalp Peeling قبله، فهو منظف كحولي قوي يطبق على فروة سليمة فقط، ثم يترك ليجف من دقيقتين إلى خمس قبل الإبر، ولا يوضع بعدها أبداً.',
      },
      {
        q: 'هل أستطيع استعمال سيرومي الخاص فيه؟',
        a: 'فقط ما هو مُعدّ للدخول في بشرة موخوزة، والدليل صريح في أنه لا ينبغي استعمال مستحضرات غير التي توصي بها الشركة. وهذا قيد حقيقي لا وسيلة لبيع الأمبولات: فالتركيبة الآمنة تماماً فوق الفروة تصير أمراً آخر بعد فتح طريق يتجاوز الحاجز. كما أن الأمبولة جزء من الآلية هنا فعلياً — فالختم يُربط عليها.',
      },
    ],
  },

  companionsTitle: 'ما يحتاجه',
  backToProducts: 'المنتجات',
}

/** @deprecated Retained temporarily for comparison; not used by the storefront. */
export const LEGACY_HAIRGEN_BOOSTER_RU: HairGenBoosterCopy = {
  eyebrow: 'HairGen BOOSTER · моторизованная насадка для микронидлинга с LED',
  headline: 'Он штампует за вас, и ампула входит по ходу работы игл.',
  subheadline:
    'Моторизованная ручка для кожи головы. Одноразовый штамп с 52 микроиглами накручивается на запечатанную ампулу 4 мл HR³ MATRIX HAIR SOLUTION α, ампула вставляется в прибор, и головка штампует автоматически, пока раствор идёт через неё, — так жидкость входит, пока иглы открывают путь, а не втирается после. Три скорости, десять минут, потом он выключается сам.',
  heroBullets: [
    '52 микроиглы на одноразовом штампе, новый на каждую процедуру',
    'Три скорости — 280, 330 и 400 штампов в минуту',
    'Процедура на десять минут, которую прибор отсчитывает и завершает сам',
    'Берёт одну запечатанную ампулу 4 мл на процедуру; ничего не переливается',
  ],
  badges: ['Сделано в Корее', '52 иглы', 'Процедура 10 минут', 'Гарантия 24 месяца'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1 000 AED · Отправка из Дубая',

  stats: [
    { value: '52', label: 'микроиглы на штампе' },
    { value: '280–400', label: 'штампов в минуту, три уровня' },
    { value: '10 мин', label: 'потом прибор выключается сам' },
    { value: '24 мес', label: 'гарантия' },
  ],

  whatItIs: {
    eyebrow: 'Прочтите сначала это',
    title: 'Что этот прибор делает — и чего мы не станем вам о нём говорить.',
    body:
      'Механически всё просто и по-настоящему полезно: он открывает микроканалы в коже головы с ровным темпом и ровным давлением и по ходу работы подаёт через них запечатанную ампулу. Ручной роллер делает первую половину и не делает второй — и делает её с тем темпом и давлением, какие случайно задаст ваша рука.',
    items: [
      'Ампула, которую он доставляет, зарегистрирована для питания и кондиционирования волос',
      'Он не зарегистрирован для лечения выпадения волос, как и раствор',
      'Исследования эффективности этого прибора у нас нет',
      'Глубина иглы — это глубина установленного штампа: 0,3 мм; ниже о том, откуда цифра',
    ],
    detail:
      'И это всё, что мы заявляем. Это прибор доставки с таймером, и причина хотеть такой — постоянство: тот же темп, то же давление, те же десять минут, каждый раз.',
    leaflet:
      'Мы говорим это прямо, потому что буклет самого производителя этого не делает. Он имеет подзаголовок «Автомикронидлинг LED-устройство для лечения алопеции» и открывается разделом «Клинические испытания» с фотографиями до и после, подписанными как очаговая и андрогенная алопеция. Очаговая алопеция — аутоиммунное заболевание. Далее он заявляет образование новых сосудов, заживление ран, выработку коллагена и набор механик волосяного цикла, а для ампулы — подавление фермента, превращающего тестостерон в DHT, то есть механизм рецептурного препарата. Ничего этого нет ни на этой странице, ни где-либо ещё на нашем сайте. Если волосы выпадают, первый приём — у врача, а это то, чем вы можете пользоваться рядом с тем, что он посоветует.',
  },

  build: {
    eyebrow: 'Спецификация',
    title: 'Что на самом деле в головке',
    intro:
      'Для косметики мы публикуем формулу. Для прибора эквивалент — спецификация, вот она, из буклета и руководства производителя.',
    items: [
      {
        name: 'Микроиглы',
        dose: '52',
        body: 'На одноразовом штампе, который накручивается на ампулу. Ставится новым на каждую процедуру и выбрасывается — это не моющаяся деталь, и это стоимость эксплуатации прибора.',
      },
      {
        name: 'Темп штампования',
        dose: '280 · 330 · 400',
        body: 'Штампов в минуту, три уровня, переключаются коротким нажатием кнопки питания. Аргумент в пользу моторизованной ручки против ручного роллера именно в этом: темп, который задаёте вы, а не тот, в который сползает рука.',
      },
      {
        name: 'Длительность',
        dose: '10 мин',
        body: 'Прибор её отсчитывает и выключается. Длительность процедуры перестаёт быть вопросом на глаз, а на приборе, который прокалывает кожу, это стоит больше, чем кажется.',
      },
      {
        name: 'Светодиоды',
        dose: '14',
        body: 'Синие и красные, распределены по 48 световым выступам в головке, касающейся кожи. У производителя есть заявления о том, что даёт свет; мы их не несём и предпочитаем назвать вам количество, а не намекнуть на эффект.',
      },
      {
        name: 'Питание',
        dose: '5 В / 2 А',
        body: 'Аккумуляторный, от стандартного зарядного 5 В на 1–2 А. Заряжайте после использования, а не перед следующей процедурой: это совет самого руководства и причина, по которой приборы лежат в ящике разряженными.',
      },
      {
        name: 'Гарантия',
        dose: '24 месяца',
        body: 'С покупки, при обычном использовании по опубликованным инструкциям. Не покрывается: повреждение пользователем, неавторизованный ремонт и модификация.',
      },
    ],
  },

  running: {
    eyebrow: 'Стоимость эксплуатации',
    title: 'Во что обходится процедура, когда прибор уже ваш',
    intro:
      'Каждая процедура требует нового штампа и новой ампулы. Это не та деталь, которую узнают потом, поэтому она здесь сразу.',
    rows: [
      { label: 'HR³ MATRIX HAIR SOLUTION α — одна ампула 4 мл', value: '92,50', note: '740 AED за восемь' },
      { label: 'HR³ MATRIX HAIR STAMP — один штамп', value: '75', note: '600 AED за восемь' },
      { label: 'За процедуру', value: '167,50', note: 'только расходники', here: true },
      { label: 'Сам прибор', value: '1 800', note: 'один раз' },
    ],
    body:
      'Два полезных вывода. Упаковка каждого закрывает восемь процедур, так что покупка расходников парами держит их в такт. А если хочется той же идеи без электроники, набор Mesopecia — ручная версия: роллер 0,5 мм с пилингом и шестью такими же ампулами, за 1 100 AED целиком.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Вставить ампулу, разделить волосы, вести по пробору',
    frequency: 'Одна ампула и один штамп на процедуру · десять минут',
    steps: [
      {
        title: 'Наденьте новый штамп на ампулу',
        body: 'Снимите колпачок и металлическую крышку с запечатанной ампулы HR³ MATRIX HAIR SOLUTION α и накрутите новый штамп на горлышко. Штамп — то, что прокалывает; ампула — то, что его питает.',
      },
      {
        title: 'Вставьте её в прибор',
        body: 'Поверните LED-крышку, снимите её с ручки, вставьте сборку «ампула со штампом» в нижнюю часть прибора и верните LED-часть на место до щелчка.',
      },
      {
        title: 'Включите и выберите скорость',
        body: 'Удерживайте кнопку питания около двух секунд. Короткое нажатие переключает скорость между уровнями 1, 2 и 3 — 280, 330 и 400 в минуту.',
      },
      {
        title: 'Сделайте пробор и ведите по нему',
        body: 'Разделите волосы расчёской и ведите головку вдоль пробора, позволяя прибору штамповать, а не прижимая его. Затем следующий пробор — и так по всей обрабатываемой зоне.',
      },
      {
        title: 'Дайте ему выключиться самому',
        body: 'Он отключится через десять минут. Это одна процедура — не запускайте его на второй заход в тот же сеанс.',
      },
      {
        title: 'Разберите и поставьте на зарядку',
        body: 'Снова снимите LED-крышку, извлеките использованную ампулу со штампом и выбросьте обе. Затем зарядите прибор, чтобы в следующий раз он был готов, а не разряжен.',
      },
    ],
    note:
      'Используйте ампулу сразу после вскрытия — она консервируется всего тридцатью частями на миллион феноксиэтанола и не рассчитана стоять наполовину использованной. И используйте с прибором только то, что рекомендует производитель: он открывает каналы в коже, и состав, совершенно безопасный на поверхности, — это уже другой разговор, когда есть путь мимо неё.',
  },

  depth: {
    eyebrow: 'Цифра, о которой спрашивают первой',
    title: 'Глубина принадлежит штампу, а не ручке',
    body:
      'У самого прибора глубины иглы нет. Она равна глубине установленного штампа, а штамп, который он принимает, — HR³ MATRIX HAIR STAMP — это 0,3 мм, то есть косметическая глубина, а не клиническая. Это согласуется с описанием производителя: ощущение массажа, а не укола.',
    note:
      'Стоит знать, откуда эта цифра: она указана на макете продукта и не встречается ни в буклете DTS MG, ни в руководстве пользователя — оба о глубине молчат. Мы попросили DTS MG подтвердить её письменно. Если ответ будет иным, эта страница и страница штампа изменятся вместе. И это не те 0,5 мм, что вы могли видеть у набора Mesopecia: они относятся к роллеру в той коробке, другому аппликатору.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Тип', value: 'Аккумуляторная авто-микронидлинг ручка с LED-головкой' },
      { label: 'Микроиглы', value: '52, на одноразовом штампе' },
      { label: 'Глубина иглы', value: '0,3 мм — глубина установленного штампа, по макету продукта' },
      { label: 'Скорости', value: 'Три уровня — 280, 330 и 400 в минуту' },
      { label: 'Процедура', value: 'Десять минут, затем автоматическое отключение' },
      { label: 'Светодиоды', value: '14, синие и красные, через 48 световых выступов' },
      { label: 'Используется с', value: 'HR³ MATRIX HAIR SOLUTION α — одна ампула 4 мл на процедуру' },
      { label: 'Расходники', value: 'HR³ MATRIX HAIR STAMP, упаковки по восемь' },
      { label: 'Питание', value: '5,0 В пост. тока / 2,0 А · зарядное 5 В, 1–2 А' },
      { label: 'Гарантия', value: '24 месяца с покупки, обычное использование' },
      { label: 'Доказательства', value: 'Исследования эффективности прибора у нас нет' },
      { label: 'Происхождение', value: 'Южная Корея — DTS MG Co., Ltd.' },
    ],
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Кому этим пользоваться не следует',
    points: [
      'Не используйте при прогрессирующем акне, экземе или любом дерматите.',
      'Не используйте при осложнениях диабета или другом серьёзном заболевании.',
      'Не используйте при склонности к келоидам или аллергии на металл — иглы стальные.',
      'Не используйте на воспалённых участках и участках с риском инфекции.',
      'Не используйте на повреждённой, раненой, обожжённой солнцем или свежевыбритой коже головы.',
      'Немедленно прекратите и обратитесь к врачу при сыпи или аллергической реакции.',
      'Не используйте с косметикой, кроме рекомендованной производителем.',
      'Новый штамп на каждую процедуру. Он одноразовый и личный — никогда им не делитесь.',
      'Не разбирайте, не модифицируйте и не ремонтируйте прибор самостоятельно.',
      'Не берите прибор и зарядное мокрыми руками. Хранить вне доступа детей.',
    ],
    note:
      'Взято из руководства пользователя, которое раскладывает противопоказания по нескольким языковым панелям, а не в один список. Если что-то из этого про вас, спросите врача до покупки, а не после.',
  },

  video: {
    eyebrow: 'В работе',
    title: 'Прибор в действии',
    body: 'Короткая демонстрация: как вставляется ампула и как вести прибор по пробору.',
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'На какую глубину входят иглы?',
        a: '0,3 мм — но глубина принадлежит штампу, а не ручке, так что это на самом деле вопрос о расходнике. Цифра указана на макете продукта; ни в буклете DTS MG, ни в руководстве пользователя её нет, и мы попросили DTS MG подтвердить её письменно. Это не 0,5 мм из набора Mesopecia — там роллер. Для масштаба: 0,3 мм — косметическая глубина, что согласуется с описанием производителя: ощущение массажа, а не укола.',
      },
      {
        q: 'Во сколько обходится эксплуатация?',
        a: 'Новая ампула 4 мл и новый штамп на каждую процедуру — 92,50 AED и 75 AED по прайсу, то есть около 167,50 AED за процедуру сверх стоимости прибора. И то и другое продаётся упаковками по восемь, что даёт ровно восемь процедур, если брать их парами.',
        needsPrices: true,
      },
      {
        q: 'Вернёт ли он мне волосы?',
        a: 'Мы не станем утверждать, что вернёт. Ампула, которую он доставляет, зарегистрирована для питания и кондиционирования волос, исследования эффективности прибора мы не видели, а буклет самого производителя содержит заявления — включая лечение очаговой алопеции, аутоиммунного заболевания, — которые мы не несём. Если волосы выпадают, идите к врачу: часть причин лечится тем, что не заменит ни один прибор.',
      },
      {
        q: 'Чем он отличается от набора Mesopecia?',
        a: 'Набор — ручная версия той же идеи: роллер 0,5 мм с пилингом для кожи головы и шестью ампулами, за 1 100 AED целиком. Это — моторизованная версия: ручка покупается один раз, расходники идут на каждую процедуру. Набор лучше как первая покупка, если хочется попробовать протокол; этот прибор лучше, если вы уже знаете, что будете продолжать, и хотите убрать темп и время из-под контроля руки.',
        needsPrices: true,
      },
      {
        q: 'Это больно?',
        a: 'Производитель описывает это как ощущение массажа, а не укола, без боли во время процедуры. Воспринимайте это как слова производителя. Если протокол набора включает Scalp Peeling до прибора, это интенсивное спиртовое очищение наносят только на неповреждённую кожу, затем дают высохнуть 2–5 минут до игл и никогда не наносят после них.',
      },
      {
        q: 'Можно ли залить в него свою сыворотку?',
        a: 'Только то, что предназначено для кожи после игл, и руководство прямо говорит не использовать косметику, кроме рекомендованной производителем. Это реальное ограничение, а не способ продать вам ампулы: состав, безопасный на поверхности кожи головы, — уже другой разговор, когда открыт путь мимо барьера. К тому же ампула здесь физически часть механизма — штамп накручивается на неё.',
      },
    ],
  },

  companionsTitle: 'Что ему нужно',
  backToProducts: 'Продукты',
}

export const HAIRGEN_BOOSTER_COPY: Record<Locale, HairGenBoosterCopy> = {
  en: EN,
  ar: HAIRGEN_BOOSTER_AR,
  ru: HAIRGEN_BOOSTER_RU,
}

export function getHairGenBoosterCopy(locale: string | undefined): HairGenBoosterCopy {
  return HAIRGEN_BOOSTER_COPY[(locale as Locale) ?? 'en'] ?? HAIRGEN_BOOSTER_COPY.en
}

/**
 * The two consumables it cannot run without come first — the page argues that the
 * running cost is the thing to understand before buying. Then the manual alternative,
 * then the prep step.
 */
export const COMPANION_PRODUCT_IDS = ['45', '64', '47', '46'] as const
