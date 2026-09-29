/**
 * Bespoke copy for the GENO-LED IR II page (product 49), in the three
 * languages the site ships.
 *
 * Same self-contained per-locale pattern as revitaGlowCopy.ts and
 * bbCushionCopy.ts, so the dedicated layout ships EN/AR/RU without adding ~150
 * keys to the shared bundles.
 *
 * SOURCING RULE FOR THIS FILE - every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_49_GENO_LED_SOURCE_AUDIT.md:
 *   - the official brochure, `public/documents/ppt/GENO-LED IR II_2025.pdf`:
 *     1,710 LEDs, 70 W rated, 520 × 220 × 315 mm, 2.6 kg, the five-wavelength
 *     dosimetry on slides 5-7, the combination rules on slide 15, and the ten
 *     clinical cases on slides 19-27.
 *   - Gentile et al., Biomedicines 2019, 7(2), 27, doi:10.3390/biomedicines7020027.
 *
 * THE DOSIMETRY IS THE PAGE. Nothing else in the catalogue quotes irradiance
 * and fluence, and no competing listing in this market publishes them at all.
 * A clinician spending AED 5,500 needs those two numbers; everything else here
 * is supporting material.
 *
 * DELIBERATE OMISSIONS, AND THEY MUST STAY OUT:
 *   - "relief of herpes zoster in early stage" and "prevention of wound
 *     infection". Both are on brochure slide 11. Both are medical claims that
 *     do not belong to a distributor.
 *   - "increase of synthesis rate of DNA in body", slide 13. Unfalsifiable.
 *   - any percentage improvement. There is no efficacy trial in the pack.
 *   - the previous generation's numbers: 1,145 LEDs, 60 W, 57.4 W generating
 *     power. Those are the first-gen GENO-LED, printed beside the IR II column
 *     on slide 4 and in the 2019 leaflet.
 *   - "clinically proven to regrow hair". In the Biomedicines study the light
 *     was an adjunct to PRP and micrograft injections, not the intervention
 *     being measured. Say what the paper says and no more.
 *
 * ALL THREE LOCALES sell the hardware and the controls the brochure and the audit verify
 * (docs/SESSION_CHANGES_2026-08-21_PRODUCT_49_GENO_LED_LOCALIZATION_AUDIT.md): LED count
 * and split, the five wavelengths, the dosimetry, the two ways the modes combine, the
 * panel, the electrical rating, size and weight, and the brochure's comparison with
 * GENO-LED IR (slide 4). They make no effect claim for any wavelength, no therapy or
 * medical status, no certification of IR II, no contact, folding or coverage claim, and
 * no post-procedure timing.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface WavelengthCopy {
  /** As printed: 640, 423, 532, 583, 830. */
  nm: string
  name: string
  /** Swatch colour, approximating the wavelength itself. */
  hex: string
  /** What clinics run it for. */
  body: string
  irradiance: string
  dose: string
  time: string
}

export interface GenoLedCopy {
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
  loginToShop: string
  outOfStock: string
  vatIncluded: string
  freeDelivery: string
  enquire: string

  stats: Array<{ value: string; label: string }>

  wavelengths: {
    eyebrow: string
    title: string
    intro: string
    items: WavelengthCopy[]
    note: string
  }

  dosimetry: {
    eyebrow: string
    title: string
    intro: string
    columns: { mode: string; irradiance: string; wavelength: string; dose: string; time: string; range: string }
    note: string
  }

  combining: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
  }

  build: {
    eyebrow: string
    title: string
    intro: string
    points: Array<{ title: string; body: string }>
  }

  protocols: {
    eyebrow: string
    title: string
    intro: string
    rows: Array<{ concern: string; protocol: string }>
    note: string
    pairTitle: string
    pairIntro: string
  }

  study: {
    eyebrow: string
    title: string
    body: string
    citation: string
    caveat: string
    link: string
  }

  howTo: {
    eyebrow: string
    title: string
    steps: Array<{ title: string; body: string }>
  }

  video: { title: string; body: string; unsupported: string }

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
    brochure: string
  }

  faq: {
    eyebrow: string
    title: string
    items: Array<{ q: string; a: string }>
  }

  backToProducts: string
}

const EN: GenoLedCopy = {
  eyebrow: 'GENO-LED IR II · Professional LED device',
  headline: 'Five wavelengths, and the numbers behind each one.',
  subheadline:
    'A dome LED unit for the treatment room: 1,710 diodes across red, blue, green, yellow and infrared. Every mode is published with its irradiance and its standard dose, so a session is planned before it starts instead of guessed at.',
  heroBullets: [
    '1,710 LEDs across five wavelengths, 423 to 830 nm',
    'Irradiance and standard dose for every mode',
    'Any colour runs with infrared at the same time',
    'Red alternates with another colour every three seconds',
  ],
  badges: ['Made in Korea', '1,710 LEDs', '2.6 kg', 'Official UAE distributor'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to see price',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Delivered across the UAE · Dispatched from Dubai',
  enquire: 'Talk to us about this device',

  stats: [
    { value: '1,710', label: 'LEDs: 380 of each colour, 190 infrared' },
    { value: '5', label: 'Wavelengths, 423 to 830 nm' },
    { value: '70 W', label: 'Rated electrical power' },
    { value: '2.6 kg', label: 'The whole unit' },
  ],

  wavelengths: {
    eyebrow: 'The five modes',
    title: 'Its own light and its own dose for every job',
    intro:
      'Five channels in one dome instead of a single red panel. Each has its own irradiance, its own standard dose and its own range, and you can read all of it before the session starts.',
    items: [
      {
        nm: '640',
        name: 'Red',
        hex: '#d0453f',
        body: 'The widest dose range on the unit, up to 186 J/cm². It is the light the Peptide Gel Mask runs under in GENOSYS protocols.',
        irradiance: '42 mW/cm²',
        dose: '28 J/cm²',
        time: '5-60 min',
      },
      {
        nm: '423',
        name: 'Blue',
        hex: '#3f63c4',
        body: 'The highest irradiance on the unit, 46 mW/cm². In GENOSYS sequences it follows the SRS peel.',
        irradiance: '46 mW/cm²',
        dose: '28 J/cm²',
        time: '5-60 min',
      },
      {
        nm: '532',
        name: 'Green',
        hex: '#3f9a68',
        body: 'A soft channel: 15 mW/cm² and a standard dose of 9 J/cm². It runs on its own or alternating with red.',
        irradiance: '15 mW/cm²',
        dose: '9 J/cm²',
        time: '5-60 min',
      },
      {
        nm: '583',
        name: 'Yellow',
        hex: '#d5a137',
        body: 'The softest channel on the unit: 11 mW/cm² and 7 J/cm². It also alternates with red every three seconds.',
        irradiance: '11 mW/cm²',
        dose: '7 J/cm²',
        time: '5-60 min',
      },
      {
        nm: '830',
        name: 'Infrared',
        hex: '#8a5a4a',
        body: 'Runs under any colour, at the same time as it, on its own shorter clock.',
        irradiance: '15 mW/cm²',
        dose: '12 J/cm²',
        time: '1-10 min',
      },
    ],
    note:
      'Infrared runs on its own clock: 1 to 10 minutes, against 5 to 60 for the visible colours.',
  },

  dosimetry: {
    eyebrow: 'The specification most listings leave out',
    title: 'Irradiance and dose, per mode',
    intro:
      'Output intensity in milliwatts per square centimetre, standard dose in joules per square centimetre, and the range the unit can reach. With these two numbers a light device is dosed, not just switched on.',
    columns: {
      mode: 'Mode',
      irradiance: 'Irradiance',
      wavelength: 'Wavelength',
      dose: 'Standard dose',
      time: 'Time',
      range: 'Dose range',
    },
    note: 'Bandwidth is 20 ±5 nm on every mode. 70 W is the rated electrical power of the unit.',
  },

  combining: {
    eyebrow: 'Running two at once',
    title: 'How the modes combine',
    intro: 'Two different behaviours, and the difference matters when you are writing a protocol.',
    cards: [
      {
        title: 'A colour plus infrared, together',
        body: 'Red, blue, green or yellow runs simultaneously with 830 nm: both lights stay on for the whole session.',
      },
      {
        title: 'Red plus another colour, alternating',
        body: 'Red with blue, green or yellow swaps between the two every three seconds. It is an alternation, not a pulsed mode, so each colour is on for about half the clock.',
      },
    ],
  },

  build: {
    eyebrow: 'The unit',
    title: 'More light than the generation before',
    intro: 'IR II replaces GENO-LED IR with more LEDs, more power and a bigger dome.',
    points: [
      {
        title: '1,710 LEDs instead of 1,145',
        body: '380 each of red, blue, green and yellow, plus 190 infrared.',
      },
      {
        title: '70 W instead of 60',
        body: 'The rated electrical power of the new generation.',
      },
      {
        title: 'A 520 mm dome instead of 380',
        body: '520 × 220 × 315 mm against 380 × 220 × 280 mm on GENO-LED IR, at 2.6 kg.',
      },
      {
        title: 'Five wavelengths, 20 ±5 nm bandwidth',
        body: '423, 532, 583, 640 and 830 nm in one unit.',
      },
    ],
  },

  protocols: {
    eyebrow: 'In the treatment room',
    title: 'Where it sits in a GENOSYS protocol',
    intro:
      'The GENOSYS brochure shows the device inside finished sequences, and every one of them is built on products from our catalogue.',
    rows: [
      { concern: 'SRS and blue light', protocol: 'SRS peel, then blue light, finishing on PCS.' },
      { concern: 'SRS and an ALA mask', protocol: 'SRS peel, then an ALA mask under blue and red light, finishing on PCC.' },
      { concern: 'CTS or CVS and red light', protocol: 'CTS or CVS with Dermafix, then Peptide Gel Mask under red light.' },
      { concern: 'AWS and red light', protocol: 'AWS with Dermafix, then Peptide Gel Mask under red light.' },
    ],
    note:
      'The brochure carries ten cases from the practice of Dr Marija Boscovic, each captioned with the protocol used. The interval after injections, a thread lift, microneedling or a peel is set by the specialist.',
    pairTitle: 'What runs with it',
    pairIntro: 'The products in those sequences, all in stock.',
  },

  study: {
    eyebrow: 'In the literature',
    title: 'GENO-LED in a peer-reviewed protocol',
    body:
      'A team at the University of Rome Tor Vergata used GENO-LED as the light step in a published androgenetic-alopecia study, alongside platelet-rich plasma and follicle stem-cell micrografts.',
    citation:
      'Gentile et al., Platelet-Rich Plasma and Micrografts Enriched with Autologous Human Follicle Mesenchymal Stem Cells Improve Hair Re-Growth in Androgenetic Alopecia. Biomedicines 2019, 7(2), 27.',
    caveat:
      'In that protocol the light was an adjunct to the injections. The study ran in 2019 on the previous-generation unit: IR II launched in 2024.',
    link: 'Read the paper',
  },

  howTo: {
    eyebrow: 'Running a session',
    title: 'Four touches and it is running',
    steps: [
      {
        title: 'Plug in the adapter',
        body: 'There is a power socket on either side. The power button lights up and the unit goes to standby.',
      },
      {
        title: 'Set the time',
        body: 'Touch Power ON/OFF and set the timer with the up and down keys, in five-minute steps.',
      },
      {
        title: 'Choose the light',
        body: 'One touch for red, blue, green or yellow. Add IR to run with it at the same time, or a second colour to alternate with red.',
      },
      {
        title: 'Let it finish',
        body: 'A voice message plays a minute before the end, then the unit switches itself off. Prompts in English, Korean or Chinese.',
      },
    ],
  },

  video: {
    title: 'See it running',
    body: 'All five lights, a session under the dome and the unit in the room.',
    unsupported: 'Your browser does not support the video tag.',
  },

  safety: {
    eyebrow: 'Before the first session',
    title: 'For the professional treatment room',
    points: [
      'GENO-LED IR II is built for a trained specialist.',
      'Set exposure from the dose table above and from the manual for your unit.',
      'The interval after injections, a thread lift, microneedling or a peel is set by the specialist.',
      'Before you buy, ask us for the manual, the declaration of conformity and the classification document for the serial number of your unit.',
    ],
    note: 'Questions about documents, contents or delivery: message us and we will arrange it.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'LEDs', value: '1,710: 380 red, 380 blue, 380 green, 380 yellow, 190 infrared' },
      { label: 'Wavelengths', value: '423 · 532 · 583 · 640 · 830 nm, bandwidth 20 ±5 nm' },
      { label: 'Rated power', value: '70 W electrical' },
      { label: 'Dimensions', value: '520 × 220 × 315 mm' },
      { label: 'Weight', value: '2.6 kg' },
      { label: 'Panel timer', value: '5-30 minutes in 5-minute steps' },
      { label: 'Mode combinations', value: 'Colour + IR together; red + another colour alternating every 3 seconds' },
      { label: 'Voice guidance', value: 'English, Korean, Chinese' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
    brochure: 'Download the full brochure (PDF)',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'How is IR II different from GENO-LED IR?',
        a: 'More light and a bigger dome: 1,710 LEDs against 1,145, 70 W against 60, and 520 × 220 × 315 mm against 380 × 220 × 280 mm. The same five wavelengths: 423, 532, 583, 640 and 830 nm.',
      },
      {
        q: 'What dose does each mode give?',
        a: 'Standard dose is 28 J/cm² on red and blue, 9 on green, 7 on yellow and 12 on infrared. The full table with irradiance and dose ranges is above.',
      },
      {
        q: 'How long is a session?',
        a: 'The panel timer runs from 5 to 30 minutes in 5-minute steps. The dose table gives 5 to 60 minutes for the visible colours and 1 to 10 for infrared, and the manual for your unit sets the exact exposure for your protocol.',
      },
      {
        q: 'Can two modes run at once?',
        a: 'Yes, in two ways. Any colour runs at the same time as infrared, and red alternates with blue, green or yellow every three seconds.',
      },
      {
        q: 'Is 70 W the optical output?',
        a: 'No, it is the rated electrical power of the unit. For dosing, what matters is the irradiance and dose in the table.',
      },
      {
        q: 'What comes with it, and how is it delivered?',
        a: 'We deliver across the UAE from our own stock in Dubai. Message us before you buy: we will confirm the contents and send the documents for your unit.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: GenoLedCopy = {
  eyebrow: 'GENO-LED IR II · جهاز LED مهني',
  headline: 'خمسة أطوال موجية، وأرقام دقيقة لكل واحد منها.',
  subheadline:
    'جهاز LED بقبة لغرفة الجلسات المهنية: 1,710 صماماً بالأحمر والأزرق والأخضر والأصفر وتحت الأحمر. لكل وضع شدة إشعاع وجرعة معيارية معروفتان، فتُحسب الجلسة مسبقاً بدل تقديرها بالعين.',
  heroBullets: [
    '1,710 صماماً على خمسة أطوال موجية، من 423 إلى 830 نانومتر',
    'شدة إشعاع وجرعة معيارية لكل وضع',
    'أي لون يعمل مع تحت الأحمر في الوقت نفسه',
    'الأحمر مع لون آخر يتناوبان كل ثلاث ثوانٍ',
  ],
  badges: ['صُنع في كوريا', '1,710 صماماً', '2.6 كغ', 'الموزّع الرسمي في الإمارات'],

  addToBag: 'أضيفي إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى السلة',
  inBag: 'في السلة',
  viewBag: 'عرض السلة',
  loginToShop: 'سجّلي الدخول لعرض السعر',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل في كل الإمارات · يُشحن من دبي',
  enquire: 'تحدّثي إلينا عن هذا الجهاز',

  stats: [
    { value: '1,710', label: 'صماماً: 380 لكل لون و190 تحت الأحمر' },
    { value: '5', label: 'أطوال موجية، من 423 إلى 830 نانومتر' },
    { value: '70 W', label: 'قدرة كهربائية مقدرة' },
    { value: '2.6 كغ', label: 'وزن الجهاز' },
  ],

  wavelengths: {
    eyebrow: 'الأوضاع الخمسة',
    title: 'ضوء خاص وجرعة خاصة لكل مهمة',
    intro:
      'خمس قنوات في قبة واحدة بدل لوحة حمراء واحدة. لكل منها شدة إشعاع وجرعة معيارية ومدى خاص، وكلها واضحة قبل أن تبدأ الجلسة.',
    items: [
      {
        nm: '640',
        name: 'الأحمر',
        hex: '#d0453f',
        body: 'أقوى قناة من حيث الجرعة: حتى 186 جول/سم². وتحت الضوء الأحمر يعمل Peptide Gel Mask في بروتوكولات GENOSYS.',
        irradiance: '42 mW/cm²',
        dose: '28 J/cm²',
        time: '5-60 دقيقة',
      },
      {
        nm: '423',
        name: 'الأزرق',
        hex: '#3f63c4',
        body: 'أعلى شدة إشعاع في الجهاز: 46 ملي واط/سم². ويأتي بعد تقشير SRS في تسلسلات GENOSYS.',
        irradiance: '46 mW/cm²',
        dose: '28 J/cm²',
        time: '5-60 دقيقة',
      },
      {
        nm: '532',
        name: 'الأخضر',
        hex: '#3f9a68',
        body: 'قناة لطيفة: 15 ملي واط/سم² وجرعة معيارية 9 جول/سم². يعمل وحده أو بالتناوب مع الأحمر.',
        irradiance: '15 mW/cm²',
        dose: '9 J/cm²',
        time: '5-60 دقيقة',
      },
      {
        nm: '583',
        name: 'الأصفر',
        hex: '#d5a137',
        body: 'ألطف قناة في الجهاز: 11 ملي واط/سم² و7 جول/سم². ويتناوب أيضاً مع الأحمر كل ثلاث ثوانٍ.',
        irradiance: '11 mW/cm²',
        dose: '7 J/cm²',
        time: '5-60 دقيقة',
      },
      {
        nm: '830',
        name: 'تحت الأحمر',
        hex: '#8a5a4a',
        body: 'يعمل تحت أي لون وفي الوقت نفسه معه، وله مؤقت أقصر خاص به.',
        irradiance: '15 mW/cm²',
        dose: '12 J/cm²',
        time: '1-10 دقائق',
      },
    ],
    note: 'تحت الأحمر على مؤقته الخاص: 1-10 دقائق مقابل 5-60 دقيقة للألوان المرئية.',
  },

  dosimetry: {
    eyebrow: 'أرقام لا تنشرها معظم الإعلانات',
    title: 'شدة الإشعاع والجرعة لكل وضع',
    intro:
      'الشدّة بالملي واط لكل سنتيمتر مربع، والجرعة المعيارية بالجول لكل سنتيمتر مربع، والمدى الذي يصل إليه الجهاز. بهذين الرقمين يُجرعَن الجهاز الضوئي ولا يُكتفى بتشغيله.',
    columns: {
      mode: 'الوضع',
      irradiance: 'الشدّة',
      wavelength: 'الطول الموجي',
      dose: 'الجرعة المعيارية',
      time: 'المدة',
      range: 'مدى الجرعة',
    },
    note: 'عرض النطاق 20 ±5 نانومتر في كل الأوضاع، و70 واط قدرة كهربائية مقدرة للجهاز.',
  },

  combining: {
    eyebrow: 'تشغيل وضعين معاً',
    title: 'كيف تجتمع الأوضاع',
    intro: 'سيناريوهان، والفرق بينهما مهم عند كتابة البروتوكول.',
    cards: [
      {
        title: 'لون مع تحت الأحمر، معاً',
        body: 'الأحمر أو الأزرق أو الأخضر أو الأصفر يعمل في الوقت نفسه مع قناة 830 نانومتر، والضوءان مضاءان طوال الجلسة.',
      },
      {
        title: 'الأحمر مع لون آخر، بالتناوب',
        body: 'الأحمر مع الأزرق أو الأخضر أو الأصفر يتناوبان كل ثلاث ثوانٍ. هذا تناوب لا نبض، فيضيء كل لون نحو نصف الوقت.',
      },
    ],
  },

  build: {
    eyebrow: 'الجهاز',
    title: 'ضوء أكثر من الجيل السابق',
    intro: 'حلّ IR II محل GENO-LED IR: صمامات أكثر، وقدرة أعلى، وقبة أكبر.',
    points: [
      {
        title: '1,710 صماماً بدل 1,145',
        body: '380 لكل من الأحمر والأزرق والأخضر والأصفر، و190 تحت الأحمر.',
      },
      {
        title: '70 واط بدل 60',
        body: 'القدرة الكهربائية المقدرة للجيل الجديد.',
      },
      {
        title: 'قبة بعرض 520 مم بدل 380',
        body: '520 × 220 × 315 مم مقابل 380 × 220 × 280 مم في GENO-LED IR، بوزن 2.6 كغ.',
      },
      {
        title: 'خمسة أطوال موجية بعرض نطاق 20 ±5',
        body: '423 و532 و583 و640 و830 نانومتر في جهاز واحد.',
      },
    ],
  },

  protocols: {
    eyebrow: 'في غرفة الجلسات',
    title: 'موقعه داخل بروتوكول GENOSYS',
    intro: 'يظهر الجهاز في كتيّب GENOSYS داخل تسلسلات جاهزة، وكلها مبنية على منتجات من كتالوجنا.',
    rows: [
      { concern: 'SRS مع الضوء الأزرق', protocol: 'تقشير SRS، ثم الضوء الأزرق، والختام بـ PCS.' },
      { concern: 'SRS مع قناع ALA', protocol: 'تقشير SRS، ثم قناع ALA تحت الأزرق والأحمر، والختام بـ PCC.' },
      { concern: 'CTS أو CVS مع الضوء الأحمر', protocol: 'CTS أو CVS مع Dermafix، ثم Peptide Gel Mask تحت الضوء الأحمر.' },
      { concern: 'AWS مع الضوء الأحمر', protocol: 'AWS مع Dermafix، ثم Peptide Gel Mask تحت الضوء الأحمر.' },
    ],
    note:
      'في الكتيّب عشر حالات من عمل الدكتورة ماريا بوسكوفيتش، كل منها بعنوان البروتوكول المستخدم. ويحدد المختص الفاصل الزمني بعد الحقن أو شد الخيوط أو الوخز الدقيق أو التقشير.',
    pairTitle: 'ما يعمل معه',
    pairIntro: 'المنتجات المذكورة في هذه التسلسلات، وكلها متوفرة.',
  },

  study: {
    eyebrow: 'في الأدبيات العلمية',
    title: 'GENO-LED داخل بروتوكول محكّم',
    body:
      'استخدم فريق في جامعة روما تور فيرغاتا جهاز GENO-LED كخطوة ضوئية في دراسة منشورة عن الثعلبة الأندروجينية، إلى جانب البلازما الغنية بالصفائح وطعوم الخلايا الجذعية للبصيلات.',
    citation:
      'Gentile et al., Platelet-Rich Plasma and Micrografts Enriched with Autologous Human Follicle Mesenchymal Stem Cells Improve Hair Re-Growth in Androgenetic Alopecia. Biomedicines 2019, 7(2), 27.',
    caveat:
      'كان الضوء في هذا البروتوكول مكمّلاً للحقن. وأُجريت الدراسة عام 2019 على جهاز من الجيل السابق، إذ أُطلق طراز IR II في 2024.',
    link: 'اقرئي الورقة',
  },

  howTo: {
    eyebrow: 'تشغيل الجلسة',
    title: 'أربع لمسات ويبدأ',
    steps: [
      { title: 'صِلي المحوّل', body: 'منفذ الطاقة موجود على الجانبين. يضيء زر الطاقة ويدخل الجهاز وضع الاستعداد.' },
      { title: 'اضبطي الوقت', body: 'المسي Power ON/OFF واضبطي المؤقت بزرّي الرفع والخفض، بخطوات 5 دقائق.' },
      {
        title: 'اختاري الضوء',
        body: 'لمسة واحدة للأحمر أو الأزرق أو الأخضر أو الأصفر. أضيفي IR ليعمل معه في الوقت نفسه، أو لوناً ثانياً يتناوب مع الأحمر.',
      },
      {
        title: 'اتركيه ينهي',
        body: 'قبل النهاية بدقيقة تُسمع رسالة صوتية، ثم يتوقف الجهاز تلقائياً. الإرشاد الصوتي بالإنجليزية أو الكورية أو الصينية.',
      },
    ],
  },

  video: {
    title: 'شاهديه يعمل',
    body: 'الأضواء الخمسة، وجلسة تحت القبة، والجهاز في الغرفة.',
    unsupported: 'متصفّحك لا يدعم تشغيل الفيديو.',
  },

  safety: {
    eyebrow: 'قبل الجلسة الأولى',
    title: 'لغرفة جلسات مهنية',
    points: [
      'صُمم GENO-LED IR II لمختص مدرّب.',
      'اضبطي مدة التعرض من جدول الجرعات أعلاه ومن دليل جهازك.',
      'يحدد المختص الفاصل الزمني بعد الحقن أو شد الخيوط أو الوخز الدقيق أو التقشير.',
      'اطلبي منا قبل الشراء دليل الاستخدام وإعلان المطابقة ووثيقة التصنيف الخاصة بالرقم التسلسلي لجهازك.',
    ],
    note: 'للأسئلة عن الوثائق والمحتويات والتوصيل، راسلينا ونرتّب كل شيء.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الصمامات', value: '1,710: \u200f380 أحمر و380 أزرق و380 أخضر و380 أصفر و190 تحت الأحمر' },
      { label: 'الأطوال الموجية', value: '423 · 532 · 583 · 640 · 830 نانومتر، وعرض نطاق 20 ±5 نانومتر' },
      { label: 'القدرة المقدرة', value: '70 واط كهربائية' },
      { label: 'الأبعاد', value: '520 × 220 × 315 مم' },
      { label: 'الوزن', value: '2.6 كغ' },
      { label: 'مؤقت اللوحة', value: 'من 5 إلى 30 دقيقة بخطوات 5 دقائق' },
      { label: 'الجمع بين الأوضاع', value: 'لون + تحت الأحمر معاً؛ الأحمر + لون آخر بالتناوب كل 3 ثوانٍ' },
      { label: 'الإرشاد الصوتي', value: 'الإنجليزية والكورية والصينية' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
    brochure: 'حمّلي الكتيّب الكامل (PDF)',
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'ما الفرق بين IR II وGENO-LED IR؟',
        a: 'ضوء أكثر وقبة أكبر: 1,710 صماماً مقابل 1,145، و70 واط مقابل 60، وأبعاد 520 × 220 × 315 مم مقابل 380 × 220 × 280 مم. والأطوال الموجية الخمسة نفسها: 423 و532 و583 و640 و830 نانومتر.',
      },
      {
        q: 'ما جرعة كل وضع؟',
        a: 'الجرعة المعيارية: الأحمر والأزرق 28 جول/سم² لكل منهما، والأخضر 9، والأصفر 7، وتحت الأحمر 12. والجدول الكامل بالشدّة ومدى الجرعة أعلاه.',
      },
      {
        q: 'كم تستغرق الجلسة؟',
        a: 'يُضبط مؤقت اللوحة من 5 إلى 30 دقيقة بخطوات 5 دقائق. ويذكر جدول الجرعات 5-60 دقيقة للألوان المرئية و1-10 دقائق لتحت الأحمر، ويحدد دليل جهازك مدة التعرض الدقيقة لبروتوكولك.',
      },
      {
        q: 'هل يمكن تشغيل وضعين معاً؟',
        a: 'نعم، بطريقتين: أي لون يعمل مع تحت الأحمر في الوقت نفسه، والأحمر مع الأزرق أو الأخضر أو الأصفر يتناوبان كل ثلاث ثوانٍ.',
      },
      {
        q: 'هل 70 واط هي القدرة الضوئية؟',
        a: 'لا، إنها القدرة الكهربائية المقدرة للجهاز. وللجرعنة المهم هو الشدّة والجرعة في الجدول.',
      },
      {
        q: 'ماذا يتضمن الطلب، وكيف يُسلَّم؟',
        a: 'نوصّل الجهاز في كل الإمارات من مخزوننا في دبي. راسلينا قبل الشراء لنؤكد المحتويات ونرسل وثائق جهازك.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: GenoLedCopy = {
  eyebrow: 'GENO-LED IR II · Профессиональный LED-аппарат',
  headline: 'Пять длин волн и точные цифры по каждой.',
  subheadline:
    'Купольный LED-аппарат для процедурного кабинета: 1 710 светодиодов в красном, синем, зелёном, жёлтом и инфракрасном свете. Для каждого режима известны плотность мощности и стандартная доза, поэтому сеанс рассчитывается заранее, а не подбирается на глаз.',
  heroBullets: [
    '1 710 светодиодов на пяти длинах волн, от 423 до 830 нм',
    'Плотность мощности и стандартная доза для каждого режима',
    'Любой цвет работает вместе с инфракрасным',
    'Красный с другим цветом чередуются каждые три секунды',
  ],
  badges: ['Сделано в Корее', '1 710 светодиодов', '2,6 кг', 'Официальный дистрибьютор в ОАЭ'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы увидеть цену',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Доставка по ОАЭ · Отправка из Дубая',
  enquire: 'Обсудить этот аппарат',

  stats: [
    { value: '1 710', label: 'светодиодов: по 380 каждого цвета и 190 ИК' },
    { value: '5', label: 'длин волн, от 423 до 830 нм' },
    { value: '70 Вт', label: 'номинальная электрическая мощность' },
    { value: '2,6 кг', label: 'вес аппарата' },
  ],

  wavelengths: {
    eyebrow: 'Пять режимов',
    title: 'Свой свет и своя доза для каждой задачи',
    intro:
      'Пять каналов в одном куполе вместо одной красной панели. У каждого своя плотность мощности, своя стандартная доза и свой диапазон, и всё это видно ещё до начала сеанса.',
    items: [
      {
        nm: '640',
        name: 'Красный',
        hex: '#d0453f',
        body: 'Самый мощный канал по дозе: до 186 Дж/см². Именно под красным светом в протоколах GENOSYS работает Peptide Gel Mask.',
        irradiance: '42 мВт/см²',
        dose: '28 Дж/см²',
        time: '5-60 мин',
      },
      {
        nm: '423',
        name: 'Синий',
        hex: '#3f63c4',
        body: 'Самая высокая плотность мощности в аппарате: 46 мВт/см². В последовательностях GENOSYS идёт следом за пилингом SRS.',
        irradiance: '46 мВт/см²',
        dose: '28 Дж/см²',
        time: '5-60 мин',
      },
      {
        nm: '532',
        name: 'Зелёный',
        hex: '#3f9a68',
        body: 'Мягкий канал: 15 мВт/см² и стандартная доза 9 Дж/см². Работает сам по себе или попеременно с красным.',
        irradiance: '15 мВт/см²',
        dose: '9 Дж/см²',
        time: '5-60 мин',
      },
      {
        nm: '583',
        name: 'Жёлтый',
        hex: '#d5a137',
        body: 'Самый мягкий канал аппарата: 11 мВт/см² и 7 Дж/см². Тоже чередуется с красным каждые три секунды.',
        irradiance: '11 мВт/см²',
        dose: '7 Дж/см²',
        time: '5-60 мин',
      },
      {
        nm: '830',
        name: 'Инфракрасный',
        hex: '#8a5a4a',
        body: 'Работает под любым цветом, одновременно с ним, и идёт на своём, более коротком таймере.',
        irradiance: '15 мВт/см²',
        dose: '12 Дж/см²',
        time: '1-10 мин',
      },
    ],
    note: 'Инфракрасный идёт на своём таймере: 1-10 минут против 5-60 минут у видимых цветов.',
  },

  dosimetry: {
    eyebrow: 'Цифры, которые обычно не публикуют',
    title: 'Плотность мощности и доза по режимам',
    intro:
      'Интенсивность в милливаттах на квадратный сантиметр, стандартная доза в джоулях на квадратный сантиметр и диапазон, доступный аппарату. С этими двумя числами световой аппарат дозируют, а не просто включают.',
    columns: {
      mode: 'Режим',
      irradiance: 'Плотность мощности',
      wavelength: 'Длина волны',
      dose: 'Стандартная доза',
      time: 'Время',
      range: 'Диапазон дозы',
    },
    note: 'Ширина полосы во всех режимах 20 ±5 нм. 70 Вт - номинальная электрическая мощность аппарата.',
  },

  combining: {
    eyebrow: 'Два режима сразу',
    title: 'Как сочетаются режимы',
    intro: 'Два сценария, и разница важна, когда вы пишете протокол.',
    cards: [
      {
        title: 'Цвет вместе с инфракрасным',
        body: 'Красный, синий, зелёный или жёлтый работает одновременно с каналом 830 нм: оба света включены весь сеанс.',
      },
      {
        title: 'Красный с другим цветом, попеременно',
        body: 'Красный с синим, зелёным или жёлтым чередуются каждые три секунды. Это чередование, а не импульсный режим, поэтому каждый цвет светит примерно половину времени.',
      },
    ],
  },

  build: {
    eyebrow: 'Аппарат',
    title: 'Больше света, чем в прошлом поколении',
    intro: 'IR II сменил GENO-LED IR: больше светодиодов, больше мощности и больший купол.',
    points: [
      {
        title: '1 710 светодиодов вместо 1 145',
        body: 'По 380 красных, синих, зелёных и жёлтых и 190 инфракрасных.',
      },
      {
        title: '70 Вт вместо 60',
        body: 'Номинальная электрическая мощность нового поколения.',
      },
      {
        title: 'Купол 520 мм вместо 380',
        body: '520 × 220 × 315 мм против 380 × 220 × 280 мм у GENO-LED IR, при весе 2,6 кг.',
      },
      {
        title: 'Пять длин волн, полоса 20 ±5 нм',
        body: '423, 532, 583, 640 и 830 нм в одном аппарате.',
      },
    ],
  },

  protocols: {
    eyebrow: 'В процедурном кабинете',
    title: 'Место аппарата в протоколе GENOSYS',
    intro: 'В брошюре GENOSYS аппарат показан внутри готовых последовательностей, и все они собраны на продуктах из нашего каталога.',
    rows: [
      { concern: 'SRS и синий свет', protocol: 'Пилинг SRS, затем синий свет, завершение на PCS.' },
      { concern: 'SRS и маска ALA', protocol: 'Пилинг SRS, затем маска ALA под синим и красным светом, завершение на PCC.' },
      { concern: 'CTS или CVS и красный свет', protocol: 'CTS или CVS с Dermafix, затем Peptide Gel Mask под красным светом.' },
      { concern: 'AWS и красный свет', protocol: 'AWS с Dermafix, затем Peptide Gel Mask под красным светом.' },
    ],
    note:
      'В брошюре десять случаев из практики д-ра Марии Боскович, каждый подписан использованным протоколом. Интервал после инъекций, нитевого лифтинга, микронидлинга или пилинга определяет специалист.',
    pairTitle: 'Что работает вместе с ним',
    pairIntro: 'Продукты из этих последовательностей, все в наличии.',
  },

  study: {
    eyebrow: 'В научной литературе',
    title: 'GENO-LED в рецензируемом протоколе',
    body:
      'Команда Университета Рима Тор Вергата использовала аппарат GENO-LED как световой этап в опубликованном исследовании по андрогенной алопеции, вместе с обогащённой тромбоцитами плазмой и микрографтами фолликулярных стволовых клеток.',
    citation:
      'Gentile et al., Platelet-Rich Plasma and Micrografts Enriched with Autologous Human Follicle Mesenchymal Stem Cells Improve Hair Re-Growth in Androgenetic Alopecia. Biomedicines 2019, 7(2), 27.',
    caveat:
      'Свет в этом протоколе шёл дополнением к инъекциям. Исследование проведено в 2019 году на аппарате предыдущего поколения: модель IR II вышла в 2024 году.',
    link: 'Читать статью',
  },

  howTo: {
    eyebrow: 'Сеанс',
    title: 'Четыре касания, и аппарат работает',
    steps: [
      { title: 'Подключите адаптер', body: 'Разъём питания есть с обеих сторон. Кнопка питания загорается, аппарат переходит в режим ожидания.' },
      { title: 'Задайте время', body: 'Коснитесь Power ON/OFF и выставьте таймер кнопками вверх и вниз, шагом 5 минут.' },
      {
        title: 'Выберите свет',
        body: 'Одно касание: красный, синий, зелёный или жёлтый. Добавьте IR, чтобы он работал одновременно, или второй цвет, чтобы он чередовался с красным.',
      },
      {
        title: 'Дайте ему закончить',
        body: 'За минуту до конца звучит голосовое сообщение, затем аппарат выключается сам. Подсказки на английском, корейском или китайском.',
      },
    ],
  },

  video: {
    title: 'Посмотрите в работе',
    body: 'Все пять режимов света, сеанс под куполом и аппарат в кабинете.',
    unsupported: 'Ваш браузер не поддерживает воспроизведение видео.',
  },

  safety: {
    eyebrow: 'Перед первым сеансом',
    title: 'Для профессионального кабинета',
    points: [
      'GENO-LED IR II рассчитан на обученного специалиста.',
      'Экспозицию задавайте по таблице доз выше и по руководству к вашему аппарату.',
      'Интервал после инъекций, нитевого лифтинга, микронидлинга или пилинга определяет специалист.',
      'Руководство, декларацию соответствия и документ о классификации для серийного номера вашего аппарата запросите у нас до покупки.',
    ],
    note: 'Вопросы по документам, комплектации и доставке: напишите нам, и мы всё организуем.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Светодиоды', value: '1 710: 380 красных, 380 синих, 380 зелёных, 380 жёлтых, 190 ИК' },
      { label: 'Длины волн', value: '423 · 532 · 583 · 640 · 830 нм, полоса 20 ±5 нм' },
      { label: 'Номинальная мощность', value: '70 Вт, электрическая' },
      { label: 'Габариты', value: '520 × 220 × 315 мм' },
      { label: 'Вес', value: '2,6 кг' },
      { label: 'Таймер панели', value: '5-30 минут с шагом 5 минут' },
      { label: 'Сочетания режимов', value: 'Цвет + ИК одновременно; красный + другой цвет попеременно каждые 3 секунды' },
      { label: 'Голосовые подсказки', value: 'Английский, корейский, китайский' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
    brochure: 'Скачать полную брошюру (PDF)',
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Чем IR II отличается от GENO-LED IR?',
        a: 'Больше света и больше купол: 1 710 светодиодов против 1 145, 70 Вт против 60, габариты 520 × 220 × 315 мм против 380 × 220 × 280 мм. Длины волн те же пять: 423, 532, 583, 640 и 830 нм.',
      },
      {
        q: 'Какую дозу даёт каждый режим?',
        a: 'Стандартная доза: красный и синий по 28 Дж/см², зелёный 9, жёлтый 7, инфракрасный 12. Полная таблица с плотностью мощности и диапазоном доз выше.',
      },
      {
        q: 'Сколько длится сеанс?',
        a: 'На панели таймер задаётся от 5 до 30 минут с шагом 5 минут. В таблице доз для видимых цветов указан диапазон 5-60 минут, для инфракрасного 1-10 минут, а точную экспозицию под ваш протокол задаёт руководство к аппарату.',
      },
      {
        q: 'Можно ли включить два режима сразу?',
        a: 'Да, двумя способами. Любой цвет работает одновременно с инфракрасным, а красный с синим, зелёным или жёлтым чередуются каждые три секунды.',
      },
      {
        q: '70 Вт - это оптическая мощность?',
        a: 'Нет, это номинальная электрическая мощность аппарата. Для дозирования важны плотность мощности и доза из таблицы.',
      },
      {
        q: 'Что входит в поставку и как доставляют?',
        a: 'Мы доставляем аппарат по ОАЭ со своего склада в Дубае. Напишите нам до покупки: подтвердим комплектацию и пришлём документы на ваш аппарат.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

export const GENO_LED_COPY: Record<Locale, GenoLedCopy> = { en: EN, ar: AR, ru: RU }

export function getGenoLedCopy(locale: string | undefined): GenoLedCopy {
  return GENO_LED_COPY[(locale as Locale) ?? 'en'] ?? GENO_LED_COPY.en
}

/** Dose-range column, identical in every locale apart from the decimal mark. */
export const DOSE_RANGES: Record<string, string> = {
  '640': '1-186 J/cm²',
  '423': '1-152 J/cm²',
  '532': '1-52 J/cm²',
  '583': '1-39 J/cm²',
  '830': '1-56 J/cm²',
}

/** The published study, linked from the citation block. */
export const STUDY_URL = 'https://doi.org/10.3390/biomedicines7020027'

/** Products named in the manufacturer's documented protocols. */
export const PROTOCOL_PRODUCT_IDS = ['13', '7', '6', '9', '37'] as const
