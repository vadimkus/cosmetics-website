/**
 * Bespoke copy for the GENO-LED IR II page (product 49), in the three
 * languages the site ships.
 *
 * Same self-contained per-locale pattern as revitaGlowCopy.ts and
 * bbCushionCopy.ts, so the dedicated layout ships EN/AR/RU without adding ~150
 * keys to the shared bundles.
 *
 * SOURCING RULE FOR THIS FILE — every figure traces to the audit in
 * docs/SESSION_CHANGES_2026-08-17_PRODUCT_49_GENO_LED_SOURCE_AUDIT.md:
 *   - the official brochure, `public/documents/ppt/GENO-LED IR II_2025.pdf`:
 *     1,710 LEDs, 70 W rated, 520 × 220 × 315 mm, 2.6 kg, the five-wavelength
 *     dosimetry on slides 5–7, the combination rules on slide 15, and the ten
 *     clinical cases on slides 19–27.
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
  eyebrow: 'GENO-LED IR II · Professional LED therapy',
  headline: 'Five wavelengths, and the numbers behind each one.',
  subheadline:
    'A dome LED unit for the treatment room: 1,710 diodes across red, blue, green, yellow and infrared, run alone or in pairs over face, body or scalp. Every mode below is published with its irradiance and its dose, so you can plan a session instead of guessing at one.',
  heroBullets: [
    '1,710 LEDs across five wavelengths, 423 to 830 nm',
    'Irradiance and fluence published for every mode',
    'Any colour runs with infrared at the same time',
    'No contact, no downtime, no consumables',
  ],
  badges: ['Made in Korea', '2.6 kg · foldable dome', 'Face, body and scalp', 'Official UAE distributor'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to see price',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Delivered and set up across the UAE · Dispatched from Dubai',
  enquire: 'Talk to us about this device',

  stats: [
    { value: '1,710', label: 'LEDs — 380 of each colour, 190 infrared' },
    { value: '5', label: 'Wavelengths, 423 to 830 nm' },
    { value: '70 W', label: 'Rated power' },
    { value: '2.6 kg', label: 'Foldable dome, moves between rooms' },
  ],

  wavelengths: {
    eyebrow: 'The five modes',
    title: 'Pick the light for the indication',
    intro:
      'Each wavelength has its own job and its own dose. This is why a five-colour unit earns its place over a single red panel: one device covers the acne chair, the post-procedure bed and the scalp clinic.',
    items: [
      {
        nm: '640',
        name: 'Red',
        hex: '#d0453f',
        body: 'The regeneration mode, and the one most used post-procedure. Run for cell renewal, circulation, collagen and elastin, and for comfort after needling or peels.',
        irradiance: '42 mW/cm²',
        dose: '28 J/cm²',
        time: '5–60 min',
      },
      {
        nm: '423',
        name: 'Blue',
        hex: '#3f63c4',
        body: 'The breakout mode. Blue light is used against the bacteria behind acne and to settle oil production, which is why the acne protocols open on it.',
        irradiance: '46 mW/cm²',
        dose: '28 J/cm²',
        time: '5–60 min',
      },
      {
        nm: '532',
        name: 'Green',
        hex: '#3f9a68',
        body: 'The calm-down mode, for reactive and sensitive skin and for a quiet finish to a session.',
        irradiance: '15 mW/cm²',
        dose: '9 J/cm²',
        time: '5–60 min',
      },
      {
        nm: '583',
        name: 'Yellow',
        hex: '#d5a137',
        body: 'The redness mode, used on flushing and erythema where a stronger light would be the wrong answer.',
        irradiance: '11 mW/cm²',
        dose: '7 J/cm²',
        time: '5–60 min',
      },
      {
        nm: '830',
        name: 'Infrared',
        hex: '#8a5a4a',
        body: 'The depth mode. Runs underneath any colour for metabolism, circulation, collagen and elastin, and recovery.',
        irradiance: '15 mW/cm²',
        dose: '12 J/cm²',
        time: '1–10 min',
      },
    ],
    note:
      'Infrared is the one mode on a shorter clock: 1 to 10 minutes against 5 to 60 for the visible colours.',
  },

  dosimetry: {
    eyebrow: 'The specification most listings leave out',
    title: 'Irradiance and dose, per mode',
    intro:
      'Output intensity in milliwatts per square centimetre, standard dose in joules per square centimetre, and the range the unit can reach. Without these two numbers a light device cannot be dosed, only switched on.',
    columns: {
      mode: 'Mode',
      irradiance: 'Irradiance',
      wavelength: 'Wavelength',
      dose: 'Standard dose',
      time: 'Time',
      range: 'Dose range',
    },
    note:
      'Bandwidth is 20 ±5 nm on every mode. Rated power of 70 W is the electrical draw, not optical output — the manufacturer does not publish a total optical figure, so we do not either.',
  },

  combining: {
    eyebrow: 'Running two at once',
    title: 'How the modes combine',
    intro: 'Two different behaviours, and the difference matters when you are writing a protocol.',
    cards: [
      {
        title: 'A colour plus infrared, together',
        body: 'Red, blue, green or yellow runs simultaneously with 830 nm. Both lights are on the skin at the same time for the whole session, which is how most post-procedure protocols are written.',
      },
      {
        title: 'Red plus another colour, alternating',
        body: 'Red with blue, green or yellow swaps between the two every three seconds. It is an alternation, not a pulsed duty cycle, so the total dose of each is roughly half the clock.',
      },
    ],
  },

  build: {
    eyebrow: 'The unit',
    title: 'Built for a room that runs all day',
    intro: 'A dome rather than a flat panel, which is the difference between even light and hot spots.',
    points: [
      {
        title: 'The dome holds the distance',
        body: 'The curve keeps every diode at a usable irradiation distance from the skin and loses less light off the sides than a flat array, so coverage stays even from cheek to jaw.',
      },
      {
        title: '1,710 diodes, not a handful of bright ones',
        body: '380 each of red, blue, green and yellow, plus 190 infrared. Density is what gives you an even field across the whole treatment area instead of a bright centre.',
      },
      {
        title: 'It folds and it moves',
        body: '520 × 220 × 315 mm and 2.6 kg. It goes from the facial bed to the scalp chair without a trolley, and stores flat between clients.',
      },
      {
        title: 'Nothing to reorder',
        body: 'No tips, no cartridges, no gel. Once it is in the room the only running cost is the electricity, which is a real difference from every consumable-based device in the same price bracket.',
      },
    ],
  },

  protocols: {
    eyebrow: 'In the treatment room',
    title: 'Where it sits in a GENOSYS protocol',
    intro:
      'The device is documented inside real protocols rather than on its own. These are the sequences the manufacturer publishes with its case series, all of them built on products we stock.',
    rows: [
      {
        concern: 'Active acne',
        protocol: 'SRS peel, then blue light, finishing on PCS. Later sessions add an ALA mask under blue and red.',
      },
      {
        concern: 'Acne scarring',
        protocol: 'CTS or CVS driven in with Dermafix, then Peptide Gel Mask under red light.',
      },
      {
        concern: 'Post-procedure recovery',
        protocol: 'Red, or red with infrared, straight after needling, injection, thread lifting or a peel.',
      },
      {
        concern: 'Scalp and hair',
        protocol: 'Used as the light step alongside a scalp programme, the role it plays in the published study below.',
      },
    ],
    note:
      'Ten documented cases sit in the brochure, credited to Dr Marija Boscovic, each captioned with the protocol used. They are photographs with protocols attached and no measurements, so treat them as documentation rather than as data.',
    pairTitle: 'What runs with it',
    pairIntro: 'The products named in those protocols, all in stock here.',
  },

  study: {
    eyebrow: 'In the literature',
    title: 'The device in a peer-reviewed protocol',
    body:
      'A team at the University of Rome Tor Vergata used GENO-LED as the low-level light therapy step in a published androgenetic-alopecia study, alongside platelet-rich plasma and follicle stem-cell micrografts. The light was given 15 days after each injection session and then every three weeks to six months.',
    citation:
      'Gentile et al., Platelet-Rich Plasma and Micrografts Enriched with Autologous Human Follicle Mesenchymal Stem Cells Improve Hair Re-Growth in Androgenetic Alopecia. Biomedicines 2019, 7(2), 27.',
    caveat:
      'Worth being exact about what that does and does not show: the light was an adjunct to the injections, not the treatment under measurement. It tells you this device is used in serious clinical work. It does not tell you light alone regrows hair, and the paper does not claim it either.',
    link: 'Read the paper',
  },

  howTo: {
    eyebrow: 'Running a session',
    title: 'Four touches and it is going',
    steps: [
      {
        title: 'Position the dome',
        body: 'Cleanse the area, then bring the dome over the face, body or scalp so the light covers the whole field. Nothing touches the skin at any point.',
      },
      {
        title: 'Set the clock',
        body: 'Time goes up and down in five-minute steps. A voice cue plays a minute before the end and the unit shuts itself off, so the session does not depend on anyone watching it.',
      },
      {
        title: 'Choose the light',
        body: 'One touch for red, blue, green or yellow. Add infrared to run underneath it, or add a second colour to alternate with red every three seconds.',
      },
      {
        title: 'Leave it to finish',
        body: 'Voice guidance runs in English, Korean or Chinese. Language, volume and time are set in standby, so they are configured once and left.',
      },
    ],
  },

  video: {
    title: 'See it running',
    body: 'The dome in position and each of the five modes on the skin.',
    unsupported: 'Your browser does not support the video tag.',
  },

  safety: {
    eyebrow: 'Before you use it',
    title: 'Safety',
    points: [
      'Low-level LED light, not a laser. No heat damage, no photo-ageing and no wound, which is the point of running LED rather than a coherent source.',
      'Nothing contacts the skin, so there is nothing to sterilise between clients and nothing to cross-contaminate.',
      'Eye protection for the client, and do not look into the array. This applies to every clinical light source.',
      'Photosensitising medication, recent photosensitising treatment or a light-aggravated condition all need clearing with the treating doctor before a session.',
      'A professional device for trained operators. Set dose and time from the table above, not by eye.',
    ],
    note: 'Supplied with a CE-certified adapter. Keep the vents clear and run the unit on a stable surface.',
  },

  spec: {
    eyebrow: 'The details',
    title: 'Specification',
    rows: [
      { label: 'LEDs', value: '1,710 — 380 red, 380 blue, 380 green, 380 yellow, 190 infrared' },
      { label: 'Wavelengths', value: '423 · 532 · 583 · 640 · 830 nm, bandwidth 20 ±5 nm' },
      { label: 'Rated power', value: '70 W electrical' },
      { label: 'Dimensions', value: '520 × 220 × 315 mm' },
      { label: 'Weight', value: '2.6 kg' },
      { label: 'Treatment areas', value: 'Face, body and scalp' },
      { label: 'Voice guidance', value: 'English, Korean, Chinese' },
      { label: 'Contact', value: 'None — the dome never touches the skin' },
      { label: 'Origin', value: 'Made in Korea' },
    ],
    brochure: 'Download the full brochure (PDF)',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you buy',
    items: [
      {
        q: 'How is this different from the first GENO-LED?',
        a: 'More light and more coverage. The IR II carries 1,710 diodes against 1,145, draws 70 W against 60, and is a larger dome at 520 mm wide. Its irradiance is higher in every mode — red goes from 36 to 42 mW/cm², blue from 39 to 46 — which is what shortens a session at the same dose.',
      },
      {
        q: 'Which mode do I start with?',
        a: 'Red for recovery and regeneration, and it is the one you will run most. Blue for active breakouts. Yellow for redness, green for reactive skin, infrared underneath any of them for depth. The dose table above gives the standard fluence for each so you are not estimating.',
      },
      {
        q: 'How long is a session?',
        a: 'Five to sixty minutes on the visible colours and one to ten on infrared, set in five-minute steps. Standard dose is reached at 28 J/cm² on red and blue, which is where most protocols sit.',
      },
      {
        q: 'Are there consumables?',
        a: 'None. No tips, cartridges or gels, and nothing touches the skin, so there is nothing to replace or sterilise. Against a device that bills per tip, that is the whole running cost argument.',
      },
      {
        q: 'Can it be used straight after needling or a peel?',
        a: 'That is its most common use. Red, on its own or with infrared, is the standard post-procedure step, and the manufacturer documents it after needling, injection, thread lifting and chemical peels. Follow the timing your own protocol sets.',
      },
      {
        q: 'What comes with it, and how is it delivered?',
        a: 'The dome, the CE-certified adapter and the brochure. We deliver and set up across the UAE from our own stock in Dubai — message us and we will arrange it.',
      },
    ],
  },

  backToProducts: 'Products',
}

const AR: GenoLedCopy = {
  eyebrow: 'GENO-LED IR II · علاج ضوئي احترافي',
  headline: 'خمسة أطوال موجية، وأرقام كل واحد منها.',
  subheadline:
    'وحدة LED على شكل قبة لغرفة العلاج: 1,710 ديودات بين الأحمر والأزرق والأخضر والأصفر وتحت الأحمر، تُشغَّل منفردة أو مزدوجة على الوجه والجسم وفروة الرأس. وكل وضع أدناه منشور بشدّته وجرعته، فتخطّطين الجلسة بدل تقديرها.',
  heroBullets: [
    '1,710 ديودات على خمسة أطوال موجية، من 423 إلى 830 نانومتر',
    'الشدّة والجرعة منشورتان لكل وضع',
    'أي لون يعمل مع تحت الأحمر في الوقت نفسه',
    'بلا ملامسة، وبلا فترة نقاهة، وبلا مستهلكات',
  ],
  badges: ['صُنع في كوريا', '2.6 كغ · قبة قابلة للطي', 'الوجه والجسم وفروة الرأس', 'الموزّع الرسمي في الإمارات'],

  addToBag: 'أضيفي إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيف إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  loginToShop: 'سجّلي الدخول لعرض السعر',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل الضريبة',
  freeDelivery: 'توصيل وتركيب في كل الإمارات · يُشحن من دبي',
  enquire: 'تحدّثي إلينا عن هذا الجهاز',

  stats: [
    { value: '1,710', label: 'ديود — 380 لكل لون و190 تحت الأحمر' },
    { value: '5', label: 'أطوال موجية، من 423 إلى 830 نانومتر' },
    { value: '70 W', label: 'القدرة المقدّرة' },
    { value: '2.6 كغ', label: 'قبة قابلة للطي تنتقل بين الغرف' },
  ],

  wavelengths: {
    eyebrow: 'الأوضاع الخمسة',
    title: 'اختاري الضوء المناسب للحالة',
    intro:
      'لكل طول موجي عمله وجرعته. ولهذا تستحق وحدة بخمسة ألوان مكانها أمام لوحة حمراء واحدة: جهاز واحد يغطي كرسي حب الشباب وسرير ما بعد الإجراء وعيادة فروة الرأس.',
    items: [
      {
        nm: '640',
        name: 'الأحمر',
        hex: '#d0453f',
        body: 'وضع التجديد، والأكثر استخداماً بعد الإجراءات. يُشغَّل لتجدّد الخلايا والدورة الدموية والكولاجين والإيلاستين، وللراحة بعد الوخز أو التقشير.',
        irradiance: '42 mW/cm²',
        dose: '28 J/cm²',
        time: '5–60 دقيقة',
      },
      {
        nm: '423',
        name: 'الأزرق',
        hex: '#3f63c4',
        body: 'وضع البثور. يُستخدم الضوء الأزرق ضدّ البكتيريا المسبّبة لحب الشباب ولضبط إفراز الدهون، ولهذا تبدأ به بروتوكولات حب الشباب.',
        irradiance: '46 mW/cm²',
        dose: '28 J/cm²',
        time: '5–60 دقيقة',
      },
      {
        nm: '532',
        name: 'الأخضر',
        hex: '#3f9a68',
        body: 'وضع التهدئة، للبشرة التفاعلية والحسّاسة ولإنهاء الجلسة بهدوء.',
        irradiance: '15 mW/cm²',
        dose: '9 J/cm²',
        time: '5–60 دقيقة',
      },
      {
        nm: '583',
        name: 'الأصفر',
        hex: '#d5a137',
        body: 'وضع الاحمرار، يُستخدم مع التورّد والحمامى حيث يكون الضوء الأقوى خياراً خاطئاً.',
        irradiance: '11 mW/cm²',
        dose: '7 J/cm²',
        time: '5–60 دقيقة',
      },
      {
        nm: '830',
        name: 'تحت الأحمر',
        hex: '#8a5a4a',
        body: 'وضع العمق. يعمل تحت أي لون من أجل الأيض والدورة الدموية والكولاجين والإيلاستين والتعافي.',
        irradiance: '15 mW/cm²',
        dose: '12 J/cm²',
        time: '1–10 دقائق',
      },
    ],
    note: 'تحت الأحمر وحده على ساعة أقصر: من دقيقة إلى عشر، مقابل 5 إلى 60 للألوان المرئية.',
  },

  dosimetry: {
    eyebrow: 'المواصفة التي تغفلها معظم الإعلانات',
    title: 'الشدّة والجرعة لكل وضع',
    intro:
      'شدّة الخرج بالميلي واط لكل سنتيمتر مربع، والجرعة المعيارية بالجول لكل سنتيمتر مربع، والمدى الذي تصل إليه الوحدة. من دون هذين الرقمين لا يمكن جرعنة جهاز ضوئي، بل تشغيله فقط.',
    columns: {
      mode: 'الوضع',
      irradiance: 'الشدّة',
      wavelength: 'الطول الموجي',
      dose: 'الجرعة المعيارية',
      time: 'المدة',
      range: 'مدى الجرعة',
    },
    note:
      'عرض النطاق 20 ±5 نانومتر في كل الأوضاع. والقدرة المقدّرة 70 واط هي السحب الكهربائي لا الخرج الضوئي — الشركة لا تنشر رقماً ضوئياً إجمالياً، ولا ننشره نحن.',
  },

  combining: {
    eyebrow: 'تشغيل وضعين معاً',
    title: 'كيف تجتمع الأوضاع',
    intro: 'سلوكان مختلفان، والفرق بينهما مهم عند كتابة بروتوكول.',
    cards: [
      {
        title: 'لون مع تحت الأحمر، معاً',
        body: 'الأحمر أو الأزرق أو الأخضر أو الأصفر يعمل في الوقت نفسه مع 830 نانومتر. الضوءان على البشرة طوال الجلسة، وهكذا تُكتب معظم بروتوكولات ما بعد الإجراء.',
      },
      {
        title: 'الأحمر مع لون آخر، بالتناوب',
        body: 'الأحمر مع الأزرق أو الأخضر أو الأصفر يتبادلان كل ثلاث ثوانٍ. هذا تناوب لا نبض بدورة تشغيل، فتكون جرعة كل منهما نحو نصف الوقت.',
      },
    ],
  },

  build: {
    eyebrow: 'الوحدة',
    title: 'مصمّمة لغرفة تعمل طوال اليوم',
    intro: 'قبة لا لوحة مسطّحة، وهذا هو الفرق بين ضوء متجانس وبقع ساخنة.',
    points: [
      {
        title: 'القبة تحفظ المسافة',
        body: 'الانحناء يبقي كل ديود على مسافة إشعاع صالحة من البشرة ويفقد ضوءاً أقل من الجوانب مقارنة بمصفوفة مسطّحة، فتبقى التغطية متجانسة من الوجنة إلى الفكّ.',
      },
      {
        title: '1,710 ديود، لا حفنة ساطعة',
        body: '380 من كل من الأحمر والأزرق والأخضر والأصفر، مع 190 تحت الأحمر. الكثافة هي ما يمنحك حقلاً متساوياً على كامل منطقة العلاج بدل مركز ساطع.',
      },
      {
        title: 'تُطوى وتنتقل',
        body: '520 × 220 × 315 ملم و2.6 كغ. تنتقل من سرير الوجه إلى كرسي فروة الرأس بلا عربة، وتُخزَّن مسطّحة بين العميلات.',
      },
      {
        title: 'لا شيء يُعاد طلبه',
        body: 'لا رؤوس ولا خراطيش ولا جل. وبمجرد وجودها في الغرفة تكون الكهرباء هي التكلفة التشغيلية الوحيدة، وهذا فارق حقيقي عن كل جهاز قائم على المستهلكات في الفئة السعرية نفسها.',
      },
    ],
  },

  protocols: {
    eyebrow: 'في غرفة العلاج',
    title: 'موقعه داخل بروتوكول GENOSYS',
    intro:
      'الجهاز موثّق داخل بروتوكولات حقيقية لا وحده. وهذه التسلسلات التي تنشرها الشركة مع سلسلة حالاتها، وكلها مبنية على منتجات متوفرة لدينا.',
    rows: [
      {
        concern: 'حب الشباب النشط',
        protocol: 'تقشير SRS ثم الضوء الأزرق وينتهي بـ PCS. والجلسات التالية تضيف قناع ALA تحت الأزرق والأحمر.',
      },
      {
        concern: 'ندبات حب الشباب',
        protocol: 'CTS أو CVS مع Dermafix، ثم Peptide Gel Mask تحت الضوء الأحمر.',
      },
      {
        concern: 'التعافي بعد الإجراءات',
        protocol: 'الأحمر، أو الأحمر مع تحت الأحمر، مباشرة بعد الوخز أو الحقن أو شدّ الخيوط أو التقشير.',
      },
      {
        concern: 'فروة الرأس والشعر',
        protocol: 'يُستخدم كخطوة الضوء إلى جانب برنامج فروة الرأس، وهو الدور نفسه في الدراسة المنشورة أدناه.',
      },
    ],
    note:
      'في الكتيّب عشر حالات موثّقة منسوبة إلى الدكتورة ماريا بوسكوفيتش، كل منها بعنوان البروتوكول المستخدم. وهي صور مع بروتوكولات بلا قياسات، فتُعامل كتوثيق لا كبيانات.',
    pairTitle: 'ما يعمل معه',
    pairIntro: 'المنتجات المذكورة في تلك البروتوكولات، وكلها متوفرة هنا.',
  },

  study: {
    eyebrow: 'في الأدبيات العلمية',
    title: 'الجهاز داخل بروتوكول محكّم',
    body:
      'استخدم فريق في جامعة روما تور فيرغاتا جهاز GENO-LED كخطوة العلاج الضوئي منخفض المستوى في دراسة منشورة عن الثعلبة الأندروجينية، إلى جانب البلازما الغنية بالصفائح وطعوم الخلايا الجذعية للبصيلات. وأُعطي الضوء بعد 15 يوماً من كل جلسة حقن ثم كل ثلاثة أسابيع حتى ستة أشهر.',
    citation:
      'Gentile et al., Platelet-Rich Plasma and Micrografts Enriched with Autologous Human Follicle Mesenchymal Stem Cells Improve Hair Re-Growth in Androgenetic Alopecia. Biomedicines 2019, 7(2), 27.',
    caveat:
      'ومن الإنصاف تحديد ما يثبته ذلك وما لا يثبته: كان الضوء مساعداً للحقن لا العلاج قيد القياس. هو يخبرك أن هذا الجهاز يُستخدم في عمل سريري جادّ، ولا يخبرك أن الضوء وحده ينبت الشعر، والورقة نفسها لا تدّعي ذلك.',
    link: 'اقرئي الورقة',
  },

  howTo: {
    eyebrow: 'تشغيل الجلسة',
    title: 'أربع لمسات ويبدأ',
    steps: [
      {
        title: 'ضعي القبة',
        body: 'نظّفي المنطقة ثم قرّبي القبة فوق الوجه أو الجسم أو فروة الرأس ليغطي الضوء الحقل كاملاً. ولا شيء يلامس البشرة في أي لحظة.',
      },
      {
        title: 'اضبطي الوقت',
        body: 'يرتفع الوقت وينخفض بخطوات من خمس دقائق. وتُشغَّل رسالة صوتية قبل دقيقة من النهاية ثم تُطفئ الوحدة نفسها، فلا تعتمد الجلسة على مراقبة أحد.',
      },
      {
        title: 'اختاري الضوء',
        body: 'لمسة واحدة للأحمر أو الأزرق أو الأخضر أو الأصفر. أضيفي تحت الأحمر ليعمل تحته، أو أضيفي لوناً ثانياً يتناوب مع الأحمر كل ثلاث ثوانٍ.',
      },
      {
        title: 'اتركيه ينهي',
        body: 'الإرشاد الصوتي بالإنجليزية أو الكورية أو الصينية. واللغة والصوت والوقت تُضبط في وضع الاستعداد، فتُعدّ مرة وتُترك.',
      },
    ],
  },

  video: {
    title: 'شاهديه يعمل',
    body: 'القبة في موضعها وكل وضع من الأوضاع الخمسة على البشرة.',
    unsupported: 'متصفّحك لا يدعم تشغيل الفيديو.',
  },

  safety: {
    eyebrow: 'قبل الاستخدام',
    title: 'السلامة',
    points: [
      'ضوء LED منخفض المستوى لا ليزر. بلا ضرر حراري ولا شيخوخة ضوئية ولا جرح، وهذا هو سبب استخدام LED بدل مصدر مترابط.',
      'لا شيء يلامس البشرة، فلا شيء يُعقَّم بين العميلات ولا شيء ينقل التلوث.',
      'حماية للعينين للعميلة، ولا تنظري إلى المصفوفة. وهذا ينطبق على كل مصدر ضوئي عيادي.',
      'الأدوية المحسّسة للضوء أو علاج محسّس حديث أو حالة تتفاقم بالضوء، كلها تحتاج موافقة الطبيب المعالج قبل الجلسة.',
      'جهاز مهني لمشغّلين مدرّبين. اضبطي الجرعة والوقت من الجدول أعلاه لا بالتقدير.',
    ],
    note: 'يأتي بمحوّل حاصل على شهادة CE. أبقي فتحات التهوية مكشوفة وشغّلي الوحدة على سطح ثابت.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'المواصفات',
    rows: [
      { label: 'الديودات', value: '1,710 — 380 أحمر و380 أزرق و380 أخضر و380 أصفر و190 تحت أحمر' },
      { label: 'الأطوال الموجية', value: '423 · 532 · 583 · 640 · 830 نانومتر، وعرض نطاق 20 ±5' },
      { label: 'القدرة المقدّرة', value: '70 واط كهربائية' },
      { label: 'الأبعاد', value: '520 × 220 × 315 ملم' },
      { label: 'الوزن', value: '2.6 كغ' },
      { label: 'مناطق العلاج', value: 'الوجه والجسم وفروة الرأس' },
      { label: 'الإرشاد الصوتي', value: 'الإنجليزية والكورية والصينية' },
      { label: 'الملامسة', value: 'لا شيء — القبة لا تلمس البشرة' },
      { label: 'المنشأ', value: 'صُنع في كوريا' },
    ],
    brochure: 'حمّلي الكتيّب الكامل (PDF)',
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'قبل الشراء',
    items: [
      {
        q: 'ما الفرق بينه وبين GENO-LED الأول؟',
        a: 'ضوء أكثر وتغطية أوسع. يحمل IR II عدد 1,710 ديود مقابل 1,145، ويسحب 70 واط مقابل 60، وقبته أكبر بعرض 520 ملم. وشدّته أعلى في كل وضع — الأحمر من 36 إلى 42 ملي واط/سم²، والأزرق من 39 إلى 46 — وهذا ما يقصّر الجلسة عند الجرعة نفسها.',
      },
      {
        q: 'بأي وضع أبدأ؟',
        a: 'الأحمر للتعافي والتجديد، وهو الأكثر تشغيلاً. والأزرق للبثور النشطة. والأصفر للاحمرار، والأخضر للبشرة التفاعلية، وتحت الأحمر تحت أيٍّ منها للعمق. وجدول الجرعات أعلاه يعطي الجرعة المعيارية لكل وضع فلا تقدّرين.',
      },
      {
        q: 'كم تستغرق الجلسة؟',
        a: 'من خمس إلى ستين دقيقة على الألوان المرئية، ومن دقيقة إلى عشر على تحت الأحمر، بخطوات من خمس دقائق. وتُبلَغ الجرعة المعيارية عند 28 جول/سم² على الأحمر والأزرق، وهناك تقع معظم البروتوكولات.',
      },
      {
        q: 'هل هناك مستهلكات؟',
        a: 'لا شيء. لا رؤوس ولا خراطيش ولا جل، ولا شيء يلامس البشرة، فلا شيء يُستبدل أو يُعقَّم. وأمام جهاز يُحاسب على كل رأس، هذه هي حجّة التكلفة التشغيلية كاملة.',
      },
      {
        q: 'هل يُستخدم مباشرة بعد الوخز أو التقشير؟',
        a: 'هذا استخدامه الأكثر شيوعاً. الأحمر، وحده أو مع تحت الأحمر، هو خطوة ما بعد الإجراء المعيارية، والشركة توثّقه بعد الوخز والحقن وشدّ الخيوط والتقشير الكيميائي. التزمي بالتوقيت الذي يحدّده بروتوكولك.',
      },
      {
        q: 'ماذا يتضمّن، وكيف يُسلَّم؟',
        a: 'القبة والمحوّل الحاصل على CE والكتيّب. ونحن نوصّل ونركّب في كل الإمارات من مخزوننا في دبي — راسلينا ونرتّب ذلك.',
      },
    ],
  },

  backToProducts: 'المنتجات',
}

const RU: GenoLedCopy = {
  eyebrow: 'GENO-LED IR II · Профессиональная LED-терапия',
  headline: 'Пять длин волн — и цифры по каждой.',
  subheadline:
    'Купольный LED-аппарат для процедурного кабинета: 1,710 диодов — красный, синий, зелёный, жёлтый и инфракрасный, по отдельности или парами, для лица, тела и кожи головы. Для каждого режима опубликованы плотность мощности и доза, поэтому сеанс можно рассчитать, а не угадать.',
  heroBullets: [
    '1,710 светодиодов на пяти длинах волн, от 423 до 830 нм',
    'Плотность мощности и доза опубликованы для каждого режима',
    'Любой цвет работает одновременно с инфракрасным',
    'Без контакта, без реабилитации, без расходников',
  ],
  badges: ['Сделано в Корее', '2,6 кг · складной купол', 'Лицо, тело и кожа головы', 'Официальный дистрибьютор в ОАЭ'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы увидеть цену',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Доставка и установка по ОАЭ · Отправка из Дубая',
  enquire: 'Обсудить этот аппарат',

  stats: [
    { value: '1 710', label: 'светодиодов — по 380 каждого цвета, 190 ИК' },
    { value: '5', label: 'длин волн, от 423 до 830 нм' },
    { value: '70 Вт', label: 'номинальная мощность' },
    { value: '2,6 кг', label: 'складной купол, переносится между кабинетами' },
  ],

  wavelengths: {
    eyebrow: 'Пять режимов',
    title: 'Свет подбирается под задачу',
    intro:
      'У каждой длины волны своя работа и своя доза. Именно поэтому пятицветный аппарат оправдывает себя против одной красной панели: один прибор закрывает и приём по акне, и постпроцедурный уход, и трихологию.',
    items: [
      {
        nm: '640',
        name: 'Красный',
        hex: '#d0453f',
        body: 'Режим регенерации и самый частый после процедур. Обновление клеток, кровообращение, коллаген и эластин, комфорт после микронидлинга или пилинга.',
        irradiance: '42 мВт/см²',
        dose: '28 Дж/см²',
        time: '5–60 мин',
      },
      {
        nm: '423',
        name: 'Синий',
        hex: '#3f63c4',
        body: 'Режим высыпаний. Синий свет применяют против бактерий, стоящих за акне, и для контроля себума — с него и начинаются протоколы по акне.',
        irradiance: '46 мВт/см²',
        dose: '28 Дж/см²',
        time: '5–60 мин',
      },
      {
        nm: '532',
        name: 'Зелёный',
        hex: '#3f9a68',
        body: 'Режим успокоения — для реактивной и чувствительной кожи и для спокойного завершения сеанса.',
        irradiance: '15 мВт/см²',
        dose: '9 Дж/см²',
        time: '5–60 мин',
      },
      {
        nm: '583',
        name: 'Жёлтый',
        hex: '#d5a137',
        body: 'Режим покраснений — при приливах и эритеме, где более сильный свет был бы неверным решением.',
        irradiance: '11 мВт/см²',
        dose: '7 Дж/см²',
        time: '5–60 мин',
      },
      {
        nm: '830',
        name: 'Инфракрасный',
        hex: '#8a5a4a',
        body: 'Режим глубины. Работает под любым цветом: обмен веществ, кровообращение, коллаген и эластин, восстановление.',
        irradiance: '15 мВт/см²',
        dose: '12 Дж/см²',
        time: '1–10 мин',
      },
    ],
    note: 'Инфракрасный — единственный режим на коротком таймере: 1–10 минут против 5–60 у видимых цветов.',
  },

  dosimetry: {
    eyebrow: 'Характеристика, которую обычно не публикуют',
    title: 'Плотность мощности и доза по режимам',
    intro:
      'Интенсивность излучения в милливаттах на квадратный сантиметр, стандартная доза в джоулях на квадратный сантиметр и диапазон, доступный аппарату. Без этих двух чисел световой прибор нельзя дозировать — только включить.',
    columns: {
      mode: 'Режим',
      irradiance: 'Плотность мощности',
      wavelength: 'Длина волны',
      dose: 'Стандартная доза',
      time: 'Время',
      range: 'Диапазон дозы',
    },
    note:
      'Ширина полосы во всех режимах 20 ±5 нм. Номинальные 70 Вт — это потребляемая электрическая мощность, а не оптический выход: суммарной оптической цифры производитель не публикует, и мы её не приводим.',
  },

  combining: {
    eyebrow: 'Два режима сразу',
    title: 'Как сочетаются режимы',
    intro: 'Два разных поведения, и разница важна при написании протокола.',
    cards: [
      {
        title: 'Цвет вместе с инфракрасным',
        body: 'Красный, синий, зелёный или жёлтый работает одновременно с 830 нм. Оба света на коже весь сеанс — так написано большинство постпроцедурных протоколов.',
      },
      {
        title: 'Красный с другим цветом, попеременно',
        body: 'Красный с синим, зелёным или жёлтым чередуются каждые три секунды. Это чередование, а не импульсный режим, поэтому доза каждого — примерно половина времени.',
      },
    ],
  },

  build: {
    eyebrow: 'Аппарат',
    title: 'Рассчитан на кабинет, который работает весь день',
    intro: 'Купол, а не плоская панель, и в этом разница между ровным светом и горячими пятнами.',
    points: [
      {
        title: 'Купол держит расстояние',
        body: 'Изгиб удерживает каждый диод на рабочей дистанции до кожи и теряет меньше света по краям, чем плоская матрица, поэтому покрытие остаётся ровным от скулы до челюсти.',
      },
      {
        title: '1,710 диодов, а не несколько ярких',
        body: 'По 380 красных, синих, зелёных и жёлтых плюс 190 инфракрасных. Именно плотность даёт равномерное поле по всей зоне вместо яркого центра.',
      },
      {
        title: 'Складывается и переносится',
        body: '520 × 220 × 315 мм и 2,6 кг. Переходит от косметологической кушетки к трихологическому креслу без тележки и хранится плоско между клиентами.',
      },
      {
        title: 'Ничего не нужно докупать',
        body: 'Ни насадок, ни картриджей, ни геля. После установки единственная эксплуатационная статья — электричество, и это реальное отличие от любого расходникового аппарата в той же ценовой категории.',
      },
    ],
  },

  protocols: {
    eyebrow: 'В процедурном кабинете',
    title: 'Место аппарата в протоколе GENOSYS',
    intro:
      'Прибор задокументирован внутри реальных протоколов, а не сам по себе. Это последовательности, которые производитель публикует со своей серией случаев, и все они построены на продуктах, которые у нас есть.',
    rows: [
      {
        concern: 'Активное акне',
        protocol: 'Пилинг SRS, затем синий свет, завершение на PCS. Дальше добавляется маска ALA под синим и красным.',
      },
      {
        concern: 'Постакне-рубцы',
        protocol: 'CTS или CVS с Dermafix, затем Peptide Gel Mask под красным светом.',
      },
      {
        concern: 'Восстановление после процедур',
        protocol: 'Красный или красный с инфракрасным сразу после микронидлинга, инъекций, нитей или пилинга.',
      },
      {
        concern: 'Кожа головы и волосы',
        protocol: 'Световой шаг рядом с программой для кожи головы — та же роль, что и в опубликованном исследовании ниже.',
      },
    ],
    note:
      'В брошюре десять задокументированных случаев, автор — д-р Мария Боскович, каждый подписан использованным протоколом. Это фотографии с протоколами и без измерений, поэтому это документация, а не данные.',
    pairTitle: 'Что работает вместе с ним',
    pairIntro: 'Продукты из этих протоколов — все есть в наличии.',
  },

  study: {
    eyebrow: 'В научной литературе',
    title: 'Аппарат в рецензируемом протоколе',
    body:
      'Команда Университета Рима Тор Вергата использовала GENO-LED как этап низкоинтенсивной световой терапии в опубликованном исследовании андрогенной алопеции — вместе с обогащённой тромбоцитами плазмой и микрографтами фолликулярных стволовых клеток. Свет давали через 15 дней после каждой инъекционной сессии и затем каждые три недели до шести месяцев.',
    citation:
      'Gentile et al., Platelet-Rich Plasma and Micrografts Enriched with Autologous Human Follicle Mesenchymal Stem Cells Improve Hair Re-Growth in Androgenetic Alopecia. Biomedicines 2019, 7(2), 27.',
    caveat:
      'Стоит быть точным в том, что это показывает, а что нет: свет был дополнением к инъекциям, а не измеряемым вмешательством. Это говорит, что аппарат используют в серьёзной клинической работе. Это не говорит, что свет сам по себе возвращает волосы, — и статья этого тоже не утверждает.',
    link: 'Читать статью',
  },

  howTo: {
    eyebrow: 'Сеанс',
    title: 'Четыре касания — и он работает',
    steps: [
      {
        title: 'Поставьте купол',
        body: 'Очистите зону и подведите купол к лицу, телу или коже головы так, чтобы свет покрывал всё поле. Кожи при этом ничто не касается.',
      },
      {
        title: 'Задайте время',
        body: 'Время меняется шагами по пять минут. За минуту до конца звучит голосовая подсказка, и аппарат выключается сам, так что сеанс не зависит от того, следит ли кто-то за ним.',
      },
      {
        title: 'Выберите свет',
        body: 'Одно касание — красный, синий, зелёный или жёлтый. Добавьте инфракрасный, чтобы он шёл снизу, или второй цвет, чтобы чередоваться с красным каждые три секунды.',
      },
      {
        title: 'Дайте ему закончить',
        body: 'Голосовые подсказки на английском, корейском или китайском. Язык, громкость и время настраиваются в режиме ожидания — один раз и навсегда.',
      },
    ],
  },

  video: {
    title: 'Посмотрите в работе',
    body: 'Купол в рабочем положении и каждый из пяти режимов на коже.',
    unsupported: 'Ваш браузер не поддерживает воспроизведение видео.',
  },

  safety: {
    eyebrow: 'Перед применением',
    title: 'Безопасность',
    points: [
      'Низкоинтенсивный LED-свет, а не лазер. Без термического повреждения, фотостарения и раны — ради этого LED и выбирают вместо когерентного источника.',
      'Ничто не касается кожи, поэтому между клиентами нечего стерилизовать и нечем перенести инфекцию.',
      'Защита глаз для клиента, и не смотрите в матрицу. Это правило для любого клинического источника света.',
      'Фотосенсибилизирующие препараты, недавние фотосенсибилизирующие процедуры и состояния, обостряющиеся от света, требуют согласования с лечащим врачом.',
      'Профессиональный аппарат для обученного оператора. Дозу и время берите из таблицы выше, а не на глаз.',
    ],
    note: 'Поставляется с адаптером, имеющим сертификат CE. Не перекрывайте вентиляцию и ставьте аппарат на устойчивую поверхность.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Характеристики',
    rows: [
      { label: 'Светодиоды', value: '1 710 — 380 красных, 380 синих, 380 зелёных, 380 жёлтых, 190 ИК' },
      { label: 'Длины волн', value: '423 · 532 · 583 · 640 · 830 нм, полоса 20 ±5 нм' },
      { label: 'Номинальная мощность', value: '70 Вт электрических' },
      { label: 'Габариты', value: '520 × 220 × 315 мм' },
      { label: 'Вес', value: '2,6 кг' },
      { label: 'Зоны', value: 'Лицо, тело и кожа головы' },
      { label: 'Голосовые подсказки', value: 'Английский, корейский, китайский' },
      { label: 'Контакт с кожей', value: 'Отсутствует — купол не касается кожи' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
    brochure: 'Скачать полную брошюру (PDF)',
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Перед покупкой',
    items: [
      {
        q: 'Чем он отличается от первого GENO-LED?',
        a: 'Больше света и больше покрытия. У IR II 1,710 диодов против 1,145, потребление 70 Вт против 60 и более крупный купол шириной 520 мм. Плотность мощности выше в каждом режиме — красный с 36 до 42 мВт/см², синий с 39 до 46, — и именно это сокращает сеанс при той же дозе.',
      },
      {
        q: 'С какого режима начинать?',
        a: 'С красного — для восстановления и регенерации, он же будет самым частым. Синий для активных высыпаний. Жёлтый для покраснений, зелёный для реактивной кожи, инфракрасный под любым из них для глубины. Таблица доз выше даёт стандартную дозу по каждому режиму, чтобы не прикидывать.',
      },
      {
        q: 'Сколько длится сеанс?',
        a: 'От пяти до шестидесяти минут на видимых цветах и от одной до десяти на инфракрасном, шагами по пять минут. Стандартная доза достигается на 28 Дж/см² у красного и синего — там и находится большинство протоколов.',
      },
      {
        q: 'Есть ли расходники?',
        a: 'Никаких. Ни насадок, ни картриджей, ни гелей, и кожи ничто не касается, поэтому нечего менять и нечего стерилизовать. На фоне аппарата, который тарифицируется за насадку, это и есть весь аргумент по себестоимости.',
      },
      {
        q: 'Можно ли сразу после микронидлинга или пилинга?',
        a: 'Это его самое частое применение. Красный, сам по себе или с инфракрасным, — стандартный постпроцедурный шаг, и производитель документирует его после микронидлинга, инъекций, нитей и химических пилингов. Соблюдайте тайминг вашего протокола.',
      },
      {
        q: 'Что входит в комплект и как доставляют?',
        a: 'Купол, адаптер с сертификатом CE и брошюра. Мы доставляем и устанавливаем по всем ОАЭ со своего склада в Дубае — напишите нам, и мы всё организуем.',
      },
    ],
  },

  backToProducts: 'Продукты',
}

const SAFE_AR: GenoLedCopy = {
  ...AR,
  eyebrow: 'GENO-LED IR II · جهاز LED مهني',
  headline: 'خمسة أطوال موجية ببيانات تقنية منشورة.',
  subheadline:
    'قبة LED مهنية تضم 1,710 صماماً موزعة على الأحمر والأزرق والأخضر والأصفر وتحت الأحمر. تنشر DTS MG شدة الإشعاع والجرعة المعيارية لكل وضع، بينما تشير قدرة 70 واط إلى القدرة الكهربائية المقدرة لا إلى إجمالي الخرج الضوئي.',
  heroBullets: [
    '1,710 صماماً على خمسة أطوال موجية من 423 إلى 830 نانومتر',
    'شدة إشعاع وجرعة معيارية منشورتان لكل وضع',
    'أي لون يعمل مع تحت الأحمر في الوقت نفسه',
    'الأحمر مع لون آخر يتناوبان كل ثلاث ثوانٍ',
  ],
  badges: ['صنع في كوريا', '2.6 كغ', '520 × 220 × 315 مم', 'للاستخدام المهني'],
  stats: [
    { value: '1,710', label: 'صماماً: 380 لكل لون مرئي و190 تحت الأحمر' },
    { value: '5', label: 'أطوال موجية من 423 إلى 830 نانومتر' },
    { value: '70 W', label: 'قدرة كهربائية مقدرة، وليست خرجاً ضوئياً' },
    { value: '2.6 كغ', label: 'وزن الجهاز المنشور' },
  ],
  wavelengths: {
    ...AR.wavelengths,
    title: 'خمس قنوات ضوئية محددة',
    intro:
      'تعرض البطاقات مواصفات كل قناة كما تنشرها مواد DTS MG. وهي مواصفات خرج، وليست وعداً بنتيجة طبية أو تجميلية.',
    items: AR.wavelengths.items.map(item => ({
      ...item,
      body: `قناة ${item.name} بطول موجي ${item.nm} نانومتر، مع شدة إشعاع وجرعة معيارية منشورتين أدناه.`,
    })),
    note: 'تنشر مواد الجرعات 5–60 دقيقة للألوان المرئية و1–10 دقائق لتحت الأحمر؛ أما صفحة التحكم الرسمية فتحدد إعداد اللوحة من 5 إلى 30 دقيقة بخطوات 5 دقائق.',
  },
  dosimetry: {
    ...AR.dosimetry,
    eyebrow: 'بيانات الشركة المنشورة',
    title: 'شدة الإشعاع والجرعة لكل وضع',
    intro:
      'شدة الإشعاع بالملي واط لكل سنتيمتر مربع، والجرعة المعيارية ومدى الجرعة كما تظهر في كتيب DTS MG الرسمي. لا يحل هذا الجدول محل وصفة تعرض فردية أو دليل الاستخدام الحالي.',
  },
  combining: {
    ...AR.combining,
    intro: 'تصف DTS MG سلوكين مختلفين في لوحة التحكم.',
    cards: [
      {
        title: 'لون مع تحت الأحمر في الوقت نفسه',
        body: 'الأحمر أو الأزرق أو الأخضر أو الأصفر يعمل بالتزامن مع قناة 830 نانومتر.',
      },
      {
        title: 'الأحمر مع لون آخر بالتناوب',
        body: 'يتناوب الأحمر مع الأزرق أو الأخضر أو الأصفر كل ثلاث ثوانٍ. تصفه الشركة بأنه تناوب، لا نبضاً.',
      },
    ],
  },
  build: {
    ...AR.build,
    title: 'مواصفات واضحة للمقارنة',
    intro: 'نحتفظ فقط بما تنشره الوثائق الأولية لهذا الطراز، من دون استنتاج أداء القبة أو مسافة تشغيل غير مذكورة.',
    points: [
      {
        title: 'توزيع موثق للصمامات',
        body: '380 صماماً لكل من الأحمر والأزرق والأخضر والأصفر، و190 صماماً تحت الأحمر.',
      },
      {
        title: 'خمسة أطوال موجية',
        body: '423 و532 و583 و640 و830 نانومتر، بعرض نطاق منشور قدره 20 ±5 نانومتر لكل وضع.',
      },
      {
        title: 'حجم ووزن منشوران',
        body: '520 × 220 × 315 مم و2.6 كغ. لا نصف القبة بأنها قابلة للطي لأن المصدر الأولي المتاح لا يثبت ذلك.',
      },
      {
        title: 'قدرة كهربائية محددة',
        body: '70 واط هي القدرة الكهربائية المقدرة. لا تنشر الشركة إجمالي الخرج الضوئي بالواط.',
      },
    ],
  },
  protocols: {
    ...AR.protocols,
    eyebrow: 'ما يوثقه الكتيب',
    title: 'تسلسلات منشورة، لا وصفات عامة',
    intro:
      'تظهر كتيبات الشركة عناوين حالات وتسلسلات محددة. نوردها كسجل لما نُشر، لا كتوصية تلقائية لكل عميلة.',
    rows: [
      { concern: 'تسلسل منشور 1', protocol: 'SRS، ثم الضوء الأزرق، ثم PCS.' },
      { concern: 'تسلسل منشور 2', protocol: 'SRS، ثم قناع ALA مع الأزرق والأحمر، ثم PCC.' },
      { concern: 'تسلسل منشور 3', protocol: 'CTS أو CVS مع Dermafix، ثم Peptide Gel Mask مع الأحمر.' },
      { concern: 'تسلسل منشور 4', protocol: 'AWS مع Dermafix، ثم Peptide Gel Mask مع الأحمر.' },
    ],
    note:
      'لا تحدد هذه العناوين توقيتاً آمناً بعد الحقن أو شد الخيوط أو الوخز الدقيق أو التقشير، ولا تغني عن دليل IR II الحالي وتقييم المختص.',
    pairTitle: 'المنتجات المذكورة في التسلسلات',
    pairIntro: 'روابط مرجعية للمنتجات المسماة في الكتيب، وليست خطة موحدة لكل حالة.',
  },
  study: {
    eyebrow: 'حدود الدليل',
    title: 'الدراسة الأقدم لا تثبت طراز IR II',
    body:
      'ورقة Gentile المنشورة عام 2019 تذكر GENO-LED كخطوة ضوئية مساعدة داخل بروتوكول حقن للشعر. وتوضح DTS MG أن GENO-LED IR II أطلق في 2024، لذلك لا يجوز تحويل ذكر الجهاز الأقدم إلى إثبات لفعالية طراز IR II.',
    citation:
      'Gentile et al., Biomedicines 2019, 7(2), 27. يذكر التعليق GENO-LED، ولا يحدد GENO-LED IR II.',
    caveat:
      'لم يكن الضوء هو التدخل الذي قاست الدراسة أثره منفرداً. لا تثبت الورقة نمو الشعر بالضوء وحده، ولا تصنيف IR II كجهاز طبي، ولا فعالية هذا الطراز.',
    link: 'اقرئي الورقة الأصلية',
  },
  howTo: {
    eyebrow: 'وظائف لوحة التحكم',
    title: 'خطوات التشغيل المنشورة',
    steps: [
      { title: 'صلي المحول', body: 'استخدمي منفذ الطاقة في أي من الجانبين؛ يضيء زر الطاقة ويدخل الجهاز وضع الاستعداد.' },
      { title: 'شغلي الجهاز', body: 'المسي Power ON/OFF، ثم اضبطي الوقت بزرّي الرفع والخفض.' },
      { title: 'اختاري الضوء', body: 'اختاري الأحمر أو الأزرق أو الأخضر أو الأصفر، وأضيفي IR للتشغيل المتزامن.' },
      { title: 'اتركي المؤقت ينهي', body: 'تعمل رسالة صوتية قبل النهاية بدقيقة، ثم يتوقف الجهاز تلقائياً.' },
    ],
  },
  video: { ...AR.video, body: 'عرض بصري لشكل الجهاز ولوحة التحكم. لا يحل محل دليل الاستخدام.' },
  safety: {
    eyebrow: 'قبل التشغيل',
    title: 'يلزم دليل IR II الحالي',
    points: [
      'المواد الموجودة في الأرشيف لا تتضمن دليل استخدام خاصاً بطراز GENO-LED IR II.',
      'شهادة SGS وتقرير EN 60335 المتاحان يعودان إلى GENO LED الأقدم بقدرة 32 واط، لا إلى IR II الذي أطلق في 2024.',
      'لا ننقل موانع الاستعمال أو حماية العين أو تحذيرات الأدوية المحسسة للضوء من جهاز آخر.',
      'لا يحدد الكتيب المتاح فترات بعد الحقن أو شد الخيوط أو الوخز الدقيق أو التقشير.',
      'يجب أن يشغل الجهاز مختص مدرب بعد الحصول على الدليل الحالي وإعلان المطابقة ووثيقة التصنيف الخاصة بالرقم التسلسلي.',
    ],
    note: 'شهادة محول طاقة قديم لا تثبت مطابقة جهاز GENO-LED IR II كاملاً.',
  },
  spec: {
    ...AR.spec,
    rows: [
      { label: 'الصمامات', value: '1,710: ‏380 أحمر و380 أزرق و380 أخضر و380 أصفر و190 تحت الأحمر' },
      { label: 'الأطوال الموجية', value: '423 · 532 · 583 · 640 · 830 نانومتر؛ عرض النطاق 20 ±5 نانومتر' },
      { label: 'القدرة المقدرة', value: '70 واط كهربائية؛ إجمالي الخرج الضوئي غير منشور' },
      { label: 'الأبعاد', value: '520 × 220 × 315 مم' },
      { label: 'الوزن', value: '2.6 كغ' },
      { label: 'المؤقت', value: 'إعداد اللوحة 5–30 دقيقة بخطوات 5 دقائق' },
      { label: 'الإرشاد الصوتي', value: 'الإنجليزية والكورية والصينية' },
      { label: 'التصنيف', value: 'لا تتوفر وثيقة تصنيف خاصة بطراز IR II في الأرشيف الحالي' },
      { label: 'المنشأ', value: 'صنع في كوريا' },
    ],
  },
  faq: {
    ...AR.faq,
    items: [
      {
        q: 'ما الذي تؤكده المواد الرسمية لهذا الطراز؟',
        a: 'عدد الصمامات وتوزيعها، الأطوال الموجية، بيانات الجرعات، طريقة جمع الأوضاع، إعدادات اللوحة، القدرة الكهربائية، الأبعاد والوزن.',
      },
      {
        q: 'هل 70 واط هي القدرة الضوئية؟',
        a: 'لا. إنها القدرة الكهربائية المقدرة. لا تنشر الشركة إجمالي الخرج الضوئي بالواط.',
      },
      {
        q: 'ما الفرق بين مدى التعرض وإعداد المؤقت؟',
        a: 'جدول الجرعات ينشر 5–60 دقيقة للألوان المرئية و1–10 دقائق لتحت الأحمر، بينما صفحة التحكم تحدد لوحة الجهاز من 5 إلى 30 دقيقة بخطوات 5 دقائق. يجب حل هذا الفرق من دليل IR II الحالي.',
      },
      {
        q: 'هل الجهاز مصنف طبياً؟',
        a: 'لا توجد في الأرشيف الحالي وثيقة تصنيف أو إعلان مطابقة خاصان بطراز IR II، لذلك لا نقدمه كجهاز طبي.',
      },
      {
        q: 'أين توجد موانع الاستعمال وقواعد حماية العين؟',
        a: 'يجب أخذها من دليل GENO-LED IR II الحالي المرفق بالرقم التسلسلي. لا ننقل قائمة عامة من جهاز آخر.',
      },
      {
        q: 'ماذا يأتي مع الطلب؟',
        a: 'تواصلي معنا قبل الشراء لتأكيد محتويات العبوة الحالية والحصول على دليل الاستخدام وإعلان المطابقة ووثيقة التصنيف.',
      },
    ],
  },
}

const SAFE_RU: GenoLedCopy = {
  ...RU,
  eyebrow: 'GENO-LED IR II · Профессиональный LED-аппарат',
  headline: 'Пять длин волн с опубликованными техническими данными.',
  subheadline:
    'Профессиональный купольный LED-аппарат с 1 710 светодиодами: красный, синий, зелёный, жёлтый и инфракрасный. DTS MG публикует плотность мощности и стандартную дозу по каждому режиму. Номинальные 70 Вт — это электрическая мощность, а не суммарный оптический выход.',
  heroBullets: [
    '1 710 светодиодов на пяти длинах волн от 423 до 830 нм',
    'Опубликованные плотность мощности и стандартная доза по каждому режиму',
    'Любой цвет работает одновременно с инфракрасным',
    'Красный с другим цветом чередуются каждые три секунды',
  ],
  badges: ['Сделано в Корее', '2,6 кг', '520 × 220 × 315 мм', 'Для профессионального применения'],
  stats: [
    { value: '1 710', label: 'светодиодов: по 380 каждого видимого цвета и 190 ИК' },
    { value: '5', label: 'длин волн от 423 до 830 нм' },
    { value: '70 Вт', label: 'номинальная электрическая мощность, не оптический выход' },
    { value: '2,6 кг', label: 'опубликованный вес аппарата' },
  ],
  wavelengths: {
    ...RU.wavelengths,
    title: 'Пять точно обозначенных световых каналов',
    intro:
      'Карточки показывают характеристики каждого канала из материалов DTS MG. Это параметры выхода, а не обещание медицинского или косметического результата.',
    items: RU.wavelengths.items.map(item => ({
      ...item,
      body: `${item.name} канал ${item.nm} нм с опубликованными плотностью мощности и стандартной дозой.`,
    })),
    note: 'В таблице доз указано 5–60 минут для видимых цветов и 1–10 минут для ИК; официальная страница управления отдельно указывает настройку панели 5–30 минут с шагом 5 минут.',
  },
  dosimetry: {
    ...RU.dosimetry,
    eyebrow: 'Опубликованные данные производителя',
    title: 'Плотность мощности и доза по режимам',
    intro:
      'Плотность мощности в мВт/см², стандартная доза и диапазон доз из официальной брошюры DTS MG. Таблица не заменяет индивидуальный расчёт экспозиции и актуальное руководство.',
  },
  combining: {
    ...RU.combining,
    intro: 'DTS MG описывает два разных сценария работы панели.',
    cards: [
      {
        title: 'Цвет с инфракрасным одновременно',
        body: 'Красный, синий, зелёный или жёлтый работает одновременно с каналом 830 нм.',
      },
      {
        title: 'Красный с другим цветом попеременно',
        body: 'Красный с синим, зелёным или жёлтым чередуются каждые три секунды. Производитель называет это чередованием, а не импульсным режимом.',
      },
    ],
  },
  build: {
    ...RU.build,
    title: 'Характеристики, которые можно сравнить',
    intro: 'Оставляем только первичные данные по этой модели, без выводов о работе купола или неподтверждённой рабочей дистанции.',
    points: [
      {
        title: 'Подтверждённое распределение диодов',
        body: 'По 380 красных, синих, зелёных и жёлтых светодиодов и 190 инфракрасных.',
      },
      {
        title: 'Пять длин волн',
        body: '423, 532, 583, 640 и 830 нм; опубликованная ширина полосы каждого режима 20 ±5 нм.',
      },
      {
        title: 'Опубликованные габариты и вес',
        body: '520 × 220 × 315 мм и 2,6 кг. Мы не называем купол складным: доступный первичный источник этого не подтверждает.',
      },
      {
        title: 'Чётко обозначенная электрическая мощность',
        body: '70 Вт — номинальная электрическая мощность. Суммарный оптический выход в ваттах производитель не публикует.',
      },
    ],
  },
  protocols: {
    ...RU.protocols,
    eyebrow: 'Что зафиксировано в брошюре',
    title: 'Опубликованные последовательности, не универсальные назначения',
    intro:
      'В брошюре производителя есть подписи к отдельным случаям и конкретные последовательности. Мы приводим их как запись источника, а не как автоматическую рекомендацию каждому клиенту.',
    rows: [
      { concern: 'Последовательность 1', protocol: 'SRS, затем синий свет, затем PCS.' },
      { concern: 'Последовательность 2', protocol: 'SRS, затем маска ALA с синим и красным светом, затем PCC.' },
      { concern: 'Последовательность 3', protocol: 'CTS или CVS с Dermafix, затем Peptide Gel Mask с красным светом.' },
      { concern: 'Последовательность 4', protocol: 'AWS с Dermafix, затем Peptide Gel Mask с красным светом.' },
    ],
    note:
      'Эти подписи не устанавливают безопасный интервал после инъекций, нитевого лифтинга, микронидлинга или пилинга и не заменяют актуальное руководство IR II и оценку специалиста.',
    pairTitle: 'Продукты, названные в последовательностях',
    pairIntro: 'Ссылки на продукты из брошюры, а не готовый план для любого случая.',
  },
  study: {
    eyebrow: 'Граница доказательств',
    title: 'Старая публикация не подтверждает модель IR II',
    body:
      'Статья Gentile 2019 года называет GENO-LED дополнительным световым этапом в инъекционном протоколе для волос. По хронологии DTS MG модель GENO-LED IR II вышла в 2024 году, поэтому упоминание более раннего аппарата нельзя превращать в доказательство эффективности IR II.',
    citation:
      'Gentile et al., Biomedicines 2019, 7(2), 27. В подписи указан GENO-LED, но не GENO-LED IR II.',
    caveat:
      'Свет не был самостоятельным измеряемым вмешательством. Статья не доказывает рост волос от одного света, медицинскую классификацию IR II или эффективность именно этой модели.',
    link: 'Читать исходную статью',
  },
  howTo: {
    eyebrow: 'Функции панели',
    title: 'Опубликованная последовательность включения',
    steps: [
      { title: 'Подключите адаптер', body: 'Используйте разъём с любой стороны; кнопка питания загорается, аппарат переходит в режим ожидания.' },
      { title: 'Включите аппарат', body: 'Коснитесь Power ON/OFF и задайте время кнопками вверх и вниз.' },
      { title: 'Выберите свет', body: 'Выберите красный, синий, зелёный или жёлтый и при необходимости добавьте IR для одновременной работы.' },
      { title: 'Дождитесь завершения', body: 'За минуту до конца звучит сообщение, затем аппарат выключается автоматически.' },
    ],
  },
  video: { ...RU.video, body: 'Визуальная демонстрация корпуса и панели. Она не заменяет руководство по эксплуатации.' },
  safety: {
    eyebrow: 'Перед включением',
    title: 'Нужно актуальное руководство IR II',
    points: [
      'В доступном архиве нет руководства пользователя именно для GENO-LED IR II.',
      'Имеющиеся сертификат SGS и отчёт EN 60335 относятся к старому GENO LED на 32 Вт, а не к IR II, выпущенному в 2024 году.',
      'Мы не переносим противопоказания, правила защиты глаз или предупреждения о фотосенсибилизирующих препаратах с другого LED-аппарата.',
      'Доступная брошюра не задаёт интервалы после инъекций, нитевого лифтинга, микронидлинга или пилинга.',
      'Аппарат должен включать обученный специалист после получения руководства, DoC и документа о классификации для конкретного серийного номера.',
    ],
    note: 'Сертификат старого адаптера не подтверждает соответствие аппарата GENO-LED IR II в сборе.',
  },
  spec: {
    ...RU.spec,
    rows: [
      { label: 'Светодиоды', value: '1 710: 380 красных, 380 синих, 380 зелёных, 380 жёлтых, 190 ИК' },
      { label: 'Длины волн', value: '423 · 532 · 583 · 640 · 830 нм; полоса 20 ±5 нм' },
      { label: 'Номинальная мощность', value: '70 Вт электрических; суммарный оптический выход не опубликован' },
      { label: 'Габариты', value: '520 × 220 × 315 мм' },
      { label: 'Вес', value: '2,6 кг' },
      { label: 'Таймер панели', value: '5–30 минут с шагом 5 минут' },
      { label: 'Голосовые подсказки', value: 'Английский, корейский и китайский' },
      { label: 'Классификация', value: 'Документ по классификации IR II в текущем архиве отсутствует' },
      { label: 'Происхождение', value: 'Сделано в Корее' },
    ],
  },
  faq: {
    ...RU.faq,
    items: [
      {
        q: 'Что подтверждают официальные материалы по этой модели?',
        a: 'Число и распределение светодиодов, длины волн, дозиметрию, сочетание режимов, настройки панели, электрическую мощность, габариты и вес.',
      },
      {
        q: '70 Вт — это оптическая мощность?',
        a: 'Нет. Это номинальная электрическая мощность. Суммарный оптический выход в ваттах производитель не публикует.',
      },
      {
        q: 'Почему диапазон экспозиции и таймер отличаются?',
        a: 'Таблица доз указывает 5–60 минут для видимых цветов и 1–10 минут для ИК, а страница управления — 5–30 минут с шагом 5 минут. Это расхождение нужно разрешить по актуальному руководству IR II.',
      },
      {
        q: 'Это медицинское изделие?',
        a: 'В текущем архиве нет документа о классификации и DoC именно для IR II, поэтому мы не заявляем его как медицинское изделие.',
      },
      {
        q: 'Где противопоказания и правила защиты глаз?',
        a: 'Их нужно брать из актуального руководства GENO-LED IR II для конкретного серийного номера. Мы не переносим общий список с другого аппарата.',
      },
      {
        q: 'Что входит в поставку?',
        a: 'До покупки свяжитесь с нами, чтобы подтвердить текущую комплектацию и получить руководство, DoC и документ о классификации.',
      },
    ],
  },
}

export const GENO_LED_COPY: Record<Locale, GenoLedCopy> = { en: EN, ar: SAFE_AR, ru: SAFE_RU }

export function getGenoLedCopy(locale: string | undefined): GenoLedCopy {
  return GENO_LED_COPY[(locale as Locale) ?? 'en'] ?? GENO_LED_COPY.en
}

/** Dose-range column, identical in every locale apart from the decimal mark. */
export const DOSE_RANGES: Record<string, string> = {
  '640': '1–186 J/cm²',
  '423': '1–152 J/cm²',
  '532': '1–52 J/cm²',
  '583': '1–39 J/cm²',
  '830': '1–56 J/cm²',
}

/** The published study, linked from the citation block. */
export const STUDY_URL = 'https://doi.org/10.3390/biomedicines7020027'

/** Products named in the manufacturer's documented protocols. */
export const PROTOCOL_PRODUCT_IDS = ['13', '7', '6', '9', '37'] as const
