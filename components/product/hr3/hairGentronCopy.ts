/**
 * Bespoke copy for Hair-GENTRON (product 48), the LED helmet in the HR³ MATRIX
 * hair range.
 *
 * SOURCING — we do have documents. An earlier record said otherwise. They sit in
 * `~/Desktop/Drive/Genosys/Registration/Gentron/`:
 *   - User's manual-HAIR GENTRON.pdf (EN / KR / JP)
 *   - Declaration of Conformity-HAIR GENTRON.pdf (17 Dec 2019)
 *   - Low Voltage Directory-HAIR GENTRON.pdf (IEC/EN 60335-2-32 massage appliance)
 *   - Genosys_HAIR_GENTRON.pdf and public/documents/PPT/HAIR GENTRON.pdf (sales brochure)
 *
 * THE PAGE IS BUILT ON THE MANUAL AND THE CERTIFICATES. The brochure is quoted
 * only to be refused.
 *
 * ★ THE BROCHURE IS THE SAME CLAIM FAMILY AS THE HAIRGEN LEAFLET. It says the
 * lights are absorbed by follicle mitochondria, extend the growth phase, and
 * "Stimulate anagen re-entry in telogen hair follicles / prolong duration of
 * anagen phase / Prevent premature catagen development". It also claims
 * improved blood circulation and nutrients to the follicle. None of that is
 * carried. The LVD tests the device as a household massage appliance
 * (IEC 60335-2-32), not as a phototherapy or medical device.
 *
 * ★ WAVELENGTHS ARE BROCHURE-ONLY. The brochure prints 840 nm infrared, 640 nm
 * red, 420 nm blue. The user manual does not print a wavelength, an LED count
 * or an irradiance. Third-party listings disagree with the brochure (620 / 470
 * / 850 nm and a 60-LED count). We quote the brochure figures with that caveat
 * and we do not build a dosimetry table.
 *
 * MUST NEVER BE ADDED:
 *   - Alopecia, hair-loss treatment, hair growth, anagen / telogen / catagen.
 *   - Mitochondria, blood circulation, nutrients to the follicle.
 *   - An LED count or an irradiance we do not hold.
 *   - "Medical-grade", LLLT-as-drug, "no side effects".
 */

import type { HairGenBoosterCopy, Locale } from './hairGenBoosterCopy'

const EN: HairGenBoosterCopy = {
  eyebrow: 'Hair-GENTRON · LED helmet · model HGHY01',
  headline: 'It sits on the head. Light, air-pressure massage and optional heat, for ten, twenty or thirty minutes.',
  subheadline:
    'A one-kilogram helmet for the scalp, with a separate controller. Four LED modes, air-pressure massage and heat that you can run together or leave off, and a ten-minute preset that starts all of them plus music. Korea certifies it as a household massage appliance. The manufacturer brochure claims it treats the hair cycle. We do not.',
  heroBullets: [
    'Hands-free — it sits on the head, so a session needs no technique',
    'Four LED modes: red + infrared, blue, off, or all three lights together',
    'Ten, twenty or thirty minutes, then it stops itself. Never more than thirty',
    'Runs on four AA batteries or the USB-C adaptor in the box',
  ],
  badges: ['Made in Korea', '1.0 kg', 'CE · EMC + LVD', '24-month warranty'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '1.0 kg', label: 'helmet, net' },
    { value: '10 / 20 / 30', label: 'minutes, then it stops itself' },
    { value: '4', label: 'LED modes, including off' },
    { value: '24 mo', label: 'warranty' },
  ],

  whatItIs: {
    eyebrow: 'Read this first',
    title: 'A massage helmet with lights. Not a hair-loss treatment.',
    body:
      'It is a helmet you put on after you have washed the scalp. You set a time, you pick a light mode, and you can add air-pressure massage and heat. The session ends itself. That is the whole of the useful fact, and it is enough: a clinic or a home user can run a timed session without standing over someone with a handpiece.',
    items: [
      'Korea and the EU tested it as a household massage appliance — IEC 60335-2-32 — not as a medical or phototherapy device',
      'The user manual calls the session a supplement after a medical or aesthetic procedure, not a treatment of its own',
      'No efficacy study for this device is held by us',
      'It is not registered to treat hair loss',
    ],
    detail:
      'Buy it if you want a timed, hands-free session of light, massage and optional heat. Do not buy it as a substitute for seeing a doctor about hair loss.',
    leaflet:
      'We are saying that plainly because the manufacturer brochure does not. It claims the lights are absorbed by the mitochondria of the hair follicles, that they extend the growth phase, and that they stimulate anagen re-entry, prolong anagen and prevent premature catagen — the same hair-cycle mechanics we refused on the HairGen BOOSTER leaflet. It also claims improved blood flow and more nutrients reaching the follicle. None of that is on this page. If you are losing hair, the first appointment is with a doctor, and this is something you might sit under alongside what they advise.',
  },

  build: {
    eyebrow: 'The specification',
    title: 'What the manual and the certificates actually give us',
    intro:
      'On a cosmetic we publish the formula. On a device the specification is the equivalent. Every figure here is from the user manual or the CE file, not from the sales brochure.',
    items: [
      {
        name: 'Model',
        dose: 'HGHY01',
        body: 'The name on the helmet, the controller and the certificates. DTS MG Co., Ltd., Seoul. Made in Korea.',
      },
      {
        name: 'Size and weight',
        dose: '230 × 240 × 300',
        body: 'Millimetres, helmet. The controller is 158 × 68 × 42 mm. Net weight 1.0 kg, so it sits on the head rather than hanging off a stand over a couch.',
      },
      {
        name: 'Session length',
        dose: '10 · 20 · 30',
        body: 'Minutes, set on the controller. A one-second hold starts a ten-minute preset of massage, heat, all three lights and music. A two-second hold stops it. The manual says do not run it longer than thirty minutes at a time.',
      },
      {
        name: 'LED modes',
        dose: '4',
        body: 'Red + infrared, blue only, lights off, or red + blue + infrared together. You can run the massage and the heat with the lights on or with them off.',
      },
      {
        name: 'Power',
        dose: '5 V / 1.5 A',
        body: 'USB-C adaptor in the box, 100–240 V in. Or four AA batteries in the controller — they are not included. The helmet itself is rated 6 V on batteries. Unplug the adaptor when you are not using it, and take the batteries out if the adaptor is connected.',
      },
      {
        name: 'Warranty',
        dose: '24 months',
        body: 'From purchase, for normal use in line with the manual. Not covered: accidents, liquid, unauthorised repair, modification, and ordinary wear.',
      },
    ],
  },

  running: {
    eyebrow: 'What it costs to own',
    title: 'The helmet has no consumable. The handpiece does.',
    intro:
      'Hair-GENTRON is AED 3,300 once. Nothing is replaced between sessions. HairGen BOOSTER is cheaper to buy and then costs a fresh ampoule and a fresh stamp every time you switch it on.',
    rows: [
      { label: 'Hair-GENTRON', value: 'AED 3,300', note: 'once · no consumable', here: true },
      { label: 'HairGen BOOSTER', value: 'AED 1,800', note: 'then ~AED 167 a session' },
      { label: 'Mesopecia Kit', value: 'AED 1,100', note: 'roller + peeling + six vials' },
    ],
    body:
      'After about nine HairGen sessions the consumables have already covered the gap between the two devices. Buy the helmet if you want a timed session with nothing to throw away. Buy the booster if you want the ampoule delivered through needles. The Mesopecia Kit is the manual version of that second idea.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'One session, from the manual.',
    frequency: 'After a wash · 10, 20 or 30 minutes · never more than 30',
    steps: [
      {
        title: 'Wash the scalp',
        body: 'The manual puts this first. Dry enough that the helmet is not sitting on wet hair.',
      },
      {
        title: 'Do the main step first, if there is one',
        body: 'The manufacturer writes the helmet as a supplement after a medical or aesthetic procedure, not as the procedure. If you are using the Mesopecia Kit or the HairGen BOOSTER, that comes first.',
      },
      {
        title: 'Put it on and size it',
        body: 'The front must not cover the eyes. Height and width dials sit on the left and right of the helmet.',
      },
      {
        title: 'Start the preset, or set your own',
        body: 'Hold On/Time/Off for a second. The ten-minute preset starts: air-pressure massage, heat, red + blue + infrared, and music. A short press of the same button steps the time to 20 or 30 minutes.',
      },
      {
        title: 'Pick the lights, the massage and the heat',
        body: 'Four LED modes on one button. Massage and heat each have their own. Music holds two seconds to toggle, a short press skips track. One preset song is loaded; you can copy your own onto the controller over USB-C.',
      },
      {
        title: 'It stops itself',
        body: 'When the time is up the helmet switches off. Hold the button two seconds to stop early. Do not run it longer than thirty minutes.',
      },
    ],
    note: 'Heat-insensitive users should turn the heating off. Stop and see a doctor if anything feels wrong.',
  },

  depth: {
    eyebrow: 'The numbers we will not invent',
    title: 'Wavelengths are on the brochure. Irradiance is on nothing.',
    body:
      'The sales brochure prints 840 nm infrared, 640 nm red and 420 nm blue. The user manual does not print a wavelength, an LED count or a power density. Product 49, GENO-LED IR II, publishes a full dosimetry table; this helmet does not. Third-party listings also disagree with the brochure — one quotes 850 / 620 / 470 nm and sixty LEDs — which is why we will not build a table from anyone except DTS MG, and DTS MG only printed those three numbers on a sales slide.',
    note: 'If a protocol asks for irradiance or an LED count, we do not have them. Ask DTS MG in writing and both this page and the record change together.',
  },

  spec: {
    eyebrow: 'Details',
    title: 'Product information',
    rows: [
      { label: 'Form', value: 'LED helmet with air-pressure massage and heating · separate controller' },
      { label: 'Model', value: 'HGHY01' },
      { label: 'Contents', value: 'Helmet, stand, controller, USB-C cable and adaptor' },
      { label: 'LED modes', value: 'Red + infrared · Blue · Off · Red + blue + infrared' },
      { label: 'Session', value: '10 / 20 / 30 minutes · maximum 30 minutes at a time' },
      { label: 'Power', value: 'Adaptor 5 V 1.5 A, 100–240 V in · or 4 × AA (not included)' },
      { label: 'Size', value: 'Helmet 230 × 240 × 300 mm · controller 158 × 68 × 42 mm · 1.0 kg' },
      { label: 'Certification', value: 'CE, EMC 2014/30/EU and LVD 2014/35/EU · tested as IEC 60335-2-32 massage appliance' },
      { label: 'Patent', value: 'Korea 10-2151442 · bronze, 2020 Korea Invention Patent Exhibition — an award, not evidence of efficacy' },
      { label: 'Origin', value: 'DTS MG Co., Ltd., Seoul · Made in Korea' },
    ],
  },

  safety: {
    eyebrow: 'Before you switch it on',
    title: 'Who should ask a doctor first.',
    points: [
      'Anyone already under medical treatment',
      'Anyone with an implanted electronic medical device',
      'Heart disease',
      'Disease of the head',
      'Pregnancy',
      'Osteoporosis or a fractured spine',
      'Circulation problems from diabetes or another disease',
      'Body temperature over 38 °C',
    ],
    note: 'Keep it away from children, liquid and heat. Do not use a damaged adaptor, or operate it with wet hands. Do not run it longer than thirty minutes. Heat-insensitive users should turn the heating off. Stop and see a doctor if anything feels wrong. Store at 5–40 °C, humidity at or below 80%.',
  },

  video: {
    eyebrow: 'In use',
    title: 'The helmet on a head, not on a stand.',
    body: 'A short clip of the device as it sits and as the controller is used.',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Good to know',
    items: [
      {
        q: 'Does it treat hair loss?',
        a: 'No, and we would rather say so. The brochure claims hair-cycle mechanics we do not carry. The certificates test it as a massage appliance. If you are losing hair, see a doctor first.',
      },
      {
        q: 'How is this different from HairGen BOOSTER?',
        a: 'The booster is a handpiece that stamps and delivers a sealed ampoule through needles. This is a helmet you sit under: lights, air-pressure massage and optional heat, no needle, no consumable. They do different jobs. The manufacturer brochure pairs this helmet with the Mesopecia Kit, not with the booster.',
      },
      {
        q: 'How is this different from GENO-LED IR II?',
        a: 'GENO-LED is a 1,710-LED canopy over a couch, with a published dosimetry table, and it is a face and body device. This is a 1 kg scalp helmet with four light modes and no published irradiance. Do not treat the two as the same machine.',
        needsPrices: false,
      },
      {
        q: 'What does a session cost after I have bought it?',
        a: 'Electricity, or four AA batteries when you are away from a socket. There is no ampoule and no stamp to replace. That is the commercial difference from HairGen BOOSTER, which needs about AED 167 of consumables every time it is switched on.',
        needsPrices: true,
      },
      {
        q: 'Can I use it every day?',
        a: 'The manual does not set a cadence. It sets a maximum of thirty minutes at a time and writes the helmet as a supplement after another procedure. Follow the protocol you were given, not a number from a website.',
      },
      {
        q: 'Can I add my own music?',
        a: 'Yes. One track is loaded. Connect the controller to a computer over the USB-C cable and copy files onto it. A short press skips track; a two-second hold toggles music off.',
      },
    ],
  },

  companionsTitle: 'What the brochure pairs it with',
  backToProducts: 'Products',
}

const AR: HairGenBoosterCopy = {
  eyebrow: 'Hair-GENTRON · خوذة LED · الطراز HGHY01',
  headline: 'تُوضع على الرأس. ضوء، وتدليك بضغط الهواء، ودفء اختياري، لعشر أو عشرين أو ثلاثين دقيقة.',
  subheadline:
    'خوذة لفروة الرأس بوزن كيلوغرام واحد، مع جهاز تحكّم منفصل. أربعة أوضاع للإضاءة، وتدليك بضغط الهواء ودفء يمكن تشغيلها معاً أو إطفاؤها، وبرنامج جاهز لعشر دقائق يبدأها كلها مع الموسيقى. كوريا تعتمدها كجهاز تدليك منزلي. وكتيّب الشركة يدّعي أنها تعالج دورة الشعر. ونحن لا ندّعي ذلك.',
  heroBullets: [
    'بلا يدين — تُوضع على الرأس، فلا تحتاج الجلسة إلى مهارة',
    'أربعة أوضاع للإضاءة: أحمر + تحت الأحمر، أزرق، إطفاء، أو الأضواء الثلاثة معاً',
    'عشر أو عشرون أو ثلاثون دقيقة ثم تتوقف وحدها. لا أكثر من ثلاثين',
    'تعمل بأربع بطاريات AA أو بمحوّل USB-C الموجود في العلبة',
  ],
  badges: ['صُنع في كوريا', '1.0 كغ', 'CE · EMC + LVD', 'ضمان 24 شهراً'],

  addToBag: 'أضف إلى الحقيبة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيفت إلى الحقيبة',
  inBag: 'في الحقيبة',
  viewBag: 'عرض الحقيبة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'شحن مجاني فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '1.0 كغ', label: 'وزن الخوذة صافياً' },
    { value: '10 / 20 / 30', label: 'دقيقة، ثم تتوقف وحدها' },
    { value: '4', label: 'أوضاع إضاءة، منها الإطفاء' },
    { value: '24 شهراً', label: 'الضمان' },
  ],

  whatItIs: {
    eyebrow: 'اقرأ هذا أولاً',
    title: 'خوذة تدليك فيها أضواء. ليست علاجاً لتساقط الشعر.',
    body:
      'خوذة تُوضع بعد غسل فروة الرأس. تضبطين الوقت، وتختارين وضع الضوء، ويمكنك إضافة تدليك الهواء والدفء. وتنتهي الجلسة وحدها. هذه هي الحقيقة المفيدة كلها، وهي كافية: العيادة أو المنزل يشغّلان جلسة موقوتة من دون أن يقف أحد فوق الرأس بجهاز يدوي.',
    items: [
      'كوريا والاتحاد الأوروبي اختبراها كجهاز تدليك منزلي — IEC 60335-2-32 — لا كجهاز طبّي أو علاج ضوئي',
      'دليل الاستعمال يصف الجلسة كتكملة بعد إجراء طبّي أو تجميلي، لا كعلاج قائم بذاته',
      'لا نملك دراسة فعالية لهذا الجهاز',
      'وهو غير مسجّل لعلاج تساقط الشعر',
    ],
    detail:
      'اشتريها إن أردت جلسة موقوتة بلا يدين من ضوء وتدليك ودفء اختياري. لا تشتريها بديلاً عن زيارة الطبيب في تساقط الشعر.',
    leaflet:
      'نقول هذا بوضوح لأن كتيّب الشركة لا يقوله. يدّعي أن الضوء تمتصّه ميتوكندريا بصيلات الشعر، وأنه يطيل طور النمو، وأنه يعيد الشعر إلى طور الأنوجين ويمنع الكاتاجين المبكر — الآليات نفسها التي رفضناها في نشرة HairGen BOOSTER. ويدّعي أيضاً تحسين جريان الدم وزيادة الغذاء الواصل إلى البصيلة. لا شيء من ذلك في هذه الصفحة. إن كان الشعر يتساقط فأول موعد هو مع الطبيب، وقد تُستعمل هذه الخوذة إلى جانب ما ينصح به.',
  },

  build: {
    eyebrow: 'المواصفات',
    title: 'ما يعطينا إيّاه الدليل وشهادات المطابقة فعلاً',
    intro:
      'في مستحضر تجميلي ننشر التركيبة. وفي جهاز تكون المواصفات هي المقابل. كل رقم هنا من دليل الاستعمال أو ملف CE، لا من كتيّب البيع.',
    items: [
      {
        name: 'الطراز',
        dose: 'HGHY01',
        body: 'الاسم على الخوذة وجهاز التحكّم والشهادات. DTS MG Co., Ltd.، سيول. صُنع في كوريا.',
      },
      {
        name: 'الحجم والوزن',
        dose: '230 × 240 × 300',
        body: 'ملّيمتر، الخوذة. جهاز التحكّم 158 × 68 × 42 مم. الوزن الصافي 1.0 كغ، فتجلس على الرأس بدل أن تتدلّى من حامل فوق سرير.',
      },
      {
        name: 'مدّة الجلسة',
        dose: '10 · 20 · 30',
        body: 'دقائق، تُضبط من جهاز التحكّم. ضغطة ثانية واحدة تبدأ برنامجاً جاهزاً لعشر دقائق: تدليك ودفء والأضواء الثلاثة وموسيقى. ضغطة ثانيتين توقفه. والدليل يقول لا تشغّليها أكثر من ثلاثين دقيقة في المرّة.',
      },
      {
        name: 'أوضاع الإضاءة',
        dose: '4',
        body: 'أحمر + تحت الأحمر، أزرق فقط، إطفاء الأضواء، أو الأحمر والأزرق وتحت الأحمر معاً. ويمكن تشغيل التدليك والدفء مع الأضواء أو من دونها.',
      },
      {
        name: 'التغذية',
        dose: '5 ف / 1.5 أ',
        body: 'محوّل USB-C في العلبة، 100–240 فولت دخولاً. أو أربع بطاريات AA في جهاز التحكّم — وهي غير مرفقة. الخوذة نفسها مُصنَّفة 6 فولت على البطاريات. افصلي المحوّل عند عدم الاستعمال، وأخرجي البطاريات إن كان المحوّل موصولاً.',
      },
      {
        name: 'الضمان',
        dose: '24 شهراً',
        body: 'من الشراء، للاستعمال العادي وفق الدليل. لا يشمل: الحوادث، السوائل، الإصلاح غير المعتمد، التعديل، والتآكل العادي.',
      },
    ],
  },

  running: {
    eyebrow: 'كلفة الامتلاك',
    title: 'الخوذة بلا مستهلك. والجهاز اليدوي له مستهلك.',
    intro:
      'Hair-GENTRON بـ 3,300 درهم مرة واحدة. لا يُستبدل شيء بين الجلسات. وHairGen BOOSTER أرخص شراءً ثم يكلّف أمبولة جديدة وختماً جديداً في كل تشغيل.',
    rows: [
      { label: 'Hair-GENTRON', value: '3,300 درهم', note: 'مرة · بلا مستهلك', here: true },
      { label: 'HairGen BOOSTER', value: '1,800 درهم', note: 'ثم نحو 167 درهماً للجلسة' },
      { label: 'Mesopecia Kit', value: '1,100 درهم', note: 'رولر + تقشير + ست قارورات' },
    ],
    body:
      'بعد نحو تسع جلسات HairGen تكون المستهلكات قد غطّت الفرق بين الجهازين. اشتري الخوذة إن أردت جلسة موقوتة بلا شيء ترمينَه. واشتري الجهاز اليدوي إن أردت أن تدخل الأمبولة عبر الإبر. وMesopecia Kit هو النسخة اليدوية من الفكرة الثانية.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'جلسة واحدة، من الدليل.',
    frequency: 'بعد الغسل · 10 أو 20 أو 30 دقيقة · لا أكثر من 30',
    steps: [
      {
        title: 'اغسلي فروة الرأس',
        body: 'الدليل يضع هذه الخطوة أولاً. جفّفيها بما يكفي كي لا تجلس الخوذة على شعر مبلول.',
      },
      {
        title: 'نفّذي الخطوة الرئيسية أولاً، إن وُجدت',
        body: 'الشركة تكتب الخوذة كتكملة بعد إجراء طبّي أو تجميلي، لا كالإجراء نفسه. إن كنت تستعملين Mesopecia Kit أو HairGen BOOSTER، فذلك يأتي أولاً.',
      },
      {
        title: 'ضعيها وضبّطي المقاس',
        body: 'المقدمة يجب ألا تغطي العينين. أقراص الارتفاع والعرض على يسار الخوذة ويمينها.',
      },
      {
        title: 'ابدئي البرنامج الجاهز، أو اضبطي وقتك',
        body: 'أمسكي On/Time/Off ثانية. يبدأ برنامج العشر دقائق: تدليك الهواء، الدفء، أحمر + أزرق + تحت الأحمر، والموسيقى. ضغطة قصيرة على الزر نفسه تنقل الوقت إلى 20 أو 30 دقيقة.',
      },
      {
        title: 'اختاري الأضواء والتدليك والدفء',
        body: 'أربعة أوضاع إضاءة على زر واحد. ولكل من التدليك والدفء زرّه. الموسيقى تُمسك ثانيتين للتشغيل والإطفاء، وضغطة قصيرة تنتقل للقطعة التالية. أغنية واحدة محمّلة؛ ويمكن نسخ أغانيك إلى جهاز التحكّم عبر USB-C.',
      },
      {
        title: 'تتوقف وحدها',
        body: 'عند انتهاء الوقت تنطفئ الخوذة. أمسكي الزر ثانيتين للتوقف مبكراً. لا تشغّليها أكثر من ثلاثين دقيقة.',
      },
    ],
    note: 'من لا يحسّ بالحرارة جيداً فليطفئ التسخين. أوقفي الجهاز وراجعي طبيباً إن شعرت بأي شيء غير طبيعي.',
  },

  depth: {
    eyebrow: 'أرقام لن نخترعها',
    title: 'أطوال الموجات على الكتيّب. وشدّة الإشعاع على لا شيء.',
    body:
      'كتيّب البيع يطبع 840 نانومتراً تحت الأحمر، و640 أحمر، و420 أزرق. ودليل الاستعمال لا يطبع طول موجة ولا عدد مصابيح ولا كثافة قدرة. والمنتج 49، GENO-LED IR II، ينشر جدول جرعات كاملاً؛ وهذه الخوذة لا تفعل. وقوائم موزّعين آخرين تختلف عن الكتيّب — أحدها يذكر 850 / 620 / 470 وستين مصباحاً — لذلك لن نبنِ جدولاً من أحد غير DTS MG، وDTS MG طبعت هذه الأرقام الثلاثة على شريحة بيع فقط.',
    note: 'إن طلب بروتوكول شدّة إشعاع أو عدد مصابيح، فنحن لا نملكها. اطلبها من DTS MG كتابةً وتتغيّر هذه الصفحة والسجل معاً.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'معلومات المنتج',
    rows: [
      { label: 'الشكل', value: 'خوذة LED بتدليك ضغط الهواء وتسخين · جهاز تحكّم منفصل' },
      { label: 'الطراز', value: 'HGHY01' },
      { label: 'المحتويات', value: 'خوذة، حامل، جهاز تحكّم، كابل USB-C ومحوّل' },
      { label: 'أوضاع الإضاءة', value: 'أحمر + تحت الأحمر · أزرق · إطفاء · أحمر + أزرق + تحت الأحمر' },
      { label: 'الجلسة', value: '10 / 20 / 30 دقيقة · حد أقصى 30 دقيقة في المرّة' },
      { label: 'التغذية', value: 'محوّل 5 ف 1.5 أ، 100–240 ف دخولاً · أو 4 × AA (غير مرفقة)' },
      { label: 'الحجم', value: 'الخوذة 230 × 240 × 300 مم · التحكّم 158 × 68 × 42 مم · 1.0 كغ' },
      { label: 'الاعتماد', value: 'CE، EMC 2014/30/EU وLVD 2014/35/EU · اختُبرت كجهاز تدليك IEC 60335-2-32' },
      { label: 'البراءة', value: 'كوريا 10-2151442 · برونزية معرض الاختراع الكوري 2020 — جائزة، لا دليل فعالية' },
      { label: 'المنشأ', value: 'DTS MG Co., Ltd.، سيول · صُنع في كوريا' },
    ],
  },

  safety: {
    eyebrow: 'قبل التشغيل',
    title: 'من يجب أن يسأل الطبيب أولاً.',
    points: [
      'أي شخص يخضع لعلاج طبّي',
      'أي شخص لديه جهاز طبّي إلكتروني مزروع',
      'مرض القلب',
      'مرض في الرأس',
      'الحمل',
      'هشاشة العظام أو كسر في العمود الفقري',
      'اضطراب الدورة من السكري أو مرض آخر',
      'حرارة الجسم فوق 38 °م',
    ],
    note: 'أبعديها عن الأطفال والسوائل والحرارة. لا تستعملي محوّلاً تالفاً ولا تشغّليها بيد مبتلّة. لا تشغّليها أكثر من ثلاثين دقيقة. من لا يحسّ بالحرارة جيداً فليطفئ التسخين. أوقفي الجهاز وراجعي طبيباً إن شعرت بأي شيء غير طبيعي. التخزين 5–40 °م، رطوبة 80% أو أقل.',
  },

  video: {
    eyebrow: 'أثناء الاستعمال',
    title: 'الخوذة على رأس، لا على حامل.',
    body: 'مقطع قصير للجهاز كما يُلبس وكما يُستخدم جهاز التحكّم.',
  },

  faq: {
    eyebrow: 'أسئلة',
    title: 'معلومات مفيدة',
    items: [
      {
        q: 'هل تعالج تساقط الشعر؟',
        a: 'لا، ونفضّل قول ذلك. الكتيّب يدّعي آليات لدورة الشعر لا نحملها. والشهادات تختبرها كجهاز تدليك. إن كان الشعر يتساقط فراجعي طبيباً أولاً.',
      },
      {
        q: 'ما الفرق بينها وبين HairGen BOOSTER؟',
        a: 'الجهاز اليدوي يختم ويوصل أمبولة مختومة عبر إبر. وهذه خوذة تُجلس تحتها: أضواء وتدليك هواء ودفء اختياري، بلا إبرة وبلا مستهلك. لكل منهما عمل مختلف. وكتيّب الشركة يقرن هذه الخوذة بـ Mesopecia Kit، لا بالجهاز اليدوي.',
      },
      {
        q: 'ما الفرق بينها وبين GENO-LED IR II؟',
        a: 'GENO-LED مظلّة بـ 1,710 مصباحاً فوق سرير، مع جدول جرعات منشور، وهي لجهاز الوجه والجسم. وهذه خوذة فروة بوزن 1 كغ وأربعة أوضاع ضوء بلا شدّة إشعاع منشورة. لا تعاملَيهما كالجهاز نفسه.',
      },
      {
        q: 'ماذا تكلّف الجلسة بعد الشراء؟',
        a: 'الكهرباء، أو أربع بطاريات AA بعيداً عن المقبس. لا أمبولة ولا ختم يُستبدل. وهذا هو الفرق التجاري عن HairGen BOOSTER، الذي يحتاج نحو 167 درهماً من المستهلكات في كل تشغيل.',
        needsPrices: true,
      },
      {
        q: 'هل يمكن استعمالها كل يوم؟',
        a: 'الدليل لا يضع وتيرة. يضع حداً أقصى ثلاثين دقيقة في المرّة، ويكتب الخوذة كتكملة بعد إجراء آخر. اتّبعي البروتوكول الذي وُضع لك، لا رقماً من موقع.',
      },
      {
        q: 'هل يمكن إضافة موسيقى خاصة؟',
        a: 'نعم. قطعة واحدة محمّلة. صلي جهاز التحكّم بحاسوب عبر USB-C وانسخي الملفات إليه. ضغطة قصيرة للقطعة التالية؛ وإمساك ثانيتين لإطفاء الموسيقى.',
      },
    ],
  },

  companionsTitle: 'ما يقرنه بها الكتيّب',
  backToProducts: 'المنتجات',
}

const RU: HairGenBoosterCopy = {
  eyebrow: 'Hair-GENTRON · LED-шлем · модель HGHY01',
  headline: 'Надевается на голову. Свет, массаж воздушным давлением и необязательное тепло — десять, двадцать или тридцать минут.',
  subheadline:
    'Шлем для кожи головы весом один килограмм, с отдельным пультом. Четыре режима света, воздушный массаж и нагрев — вместе или по отдельности, и десятиминутная предустановка, которая запускает всё это плюс музыку. В Корее его сертифицируют как бытовой массажный прибор. Брошюра производителя утверждает, что он лечит цикл волоса. Мы этого не утверждаем.',
  heroBullets: [
    'Без рук — сидит на голове, сеанс не требует техники',
    'Четыре режима света: красный + ИК, синий, выкл., или все три сразу',
    'Десять, двадцать или тридцать минут, затем выключается сам. Не больше тридцати',
    'Питание от четырёх батареек AA или от USB-C адаптера в коробке',
  ],
  badges: ['Сделано в Корее', '1,0 кг', 'CE · EMC + LVD', 'Гарантия 24 месяца'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено в корзину',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1,000 AED · Отправка из Дубая',

  stats: [
    { value: '1,0 кг', label: 'шлем, нетто' },
    { value: '10 / 20 / 30', label: 'минут, затем выключается сам' },
    { value: '4', label: 'режима света, включая выкл.' },
    { value: '24 мес', label: 'гарантия' },
  ],

  whatItIs: {
    eyebrow: 'Прочитайте сначала',
    title: 'Массажный шлем со светом. Не лечение выпадения волос.',
    body:
      'Это шлем, который надевают после мытья кожи головы. Ставите время, выбираете режим света, по желанию включаете воздушный массаж и нагрев. Сеанс заканчивается сам. В этом вся полезная суть, и её достаточно: в клинике или дома можно провести сеанс по таймеру, не стоя над человеком с ручным аппаратом.',
    items: [
      'Корея и ЕС испытывали его как бытовой массажный прибор — IEC 60335-2-32 — не как медицинский или фототерапевтический аппарат',
      'Руководство называет сеанс дополнением после медицинской или эстетической процедуры, а не самостоятельной процедурой',
      'Исследования эффективности этого устройства у нас нет',
      'Оно не зарегистрировано для лечения выпадения волос',
    ],
    detail:
      'Покупайте, если нужна сессия по таймеру без рук: свет, массаж и необязательное тепло. Не покупайте вместо визита к врачу по поводу выпадения волос.',
    leaflet:
      'Мы говорим это прямо, потому что брошюра производителя так не делает. Она утверждает, что свет поглощается митохондриями фолликулов, удлиняет фазу роста и стимулирует возврат в анаген, продлевает анаген и предотвращает ранний катаген — те же механики цикла волоса, которые мы отказались нести с буклета HairGen BOOSTER. Она также обещает улучшение кровотока и больше питания к фолликулу. Ничего этого на этой странице нет. Если волосы выпадают, первый приём — к врачу, а под этим шлемом можно сидеть рядом с тем, что он посоветует.',
  },

  build: {
    eyebrow: 'Характеристики',
    title: 'Что реально дают руководство и сертификаты',
    intro:
      'У косметики мы публикуем формулу. У прибора эквивалент — спецификация. Каждая цифра здесь из руководства или CE-файла, не из рекламной брошюры.',
    items: [
      {
        name: 'Модель',
        dose: 'HGHY01',
        body: 'Имя на шлеме, пульте и сертификатах. DTS MG Co., Ltd., Сеул. Сделано в Корее.',
      },
      {
        name: 'Размер и вес',
        dose: '230 × 240 × 300',
        body: 'Миллиметры, шлем. Пульт 158 × 68 × 42 мм. Нетто 1,0 кг — сидит на голове, а не висит над кушеткой.',
      },
      {
        name: 'Длительность',
        dose: '10 · 20 · 30',
        body: 'Минуты, на пульте. Удержание On/Time/Off секунду запускает десятиминутную предустановку: массаж, нагрев, все три света и музыка. Удержание две секунды останавливает. Руководство: не больше тридцати минут за раз.',
      },
      {
        name: 'Режимы света',
        dose: '4',
        body: 'Красный + ИК, только синий, свет выключен, или красный + синий + ИК вместе. Массаж и нагрев работают и при включённом свете, и без него.',
      },
      {
        name: 'Питание',
        dose: '5 В / 1,5 А',
        body: 'USB-C адаптер в коробке, вход 100–240 В. Или четыре батарейки AA в пульте — в комплект не входят. Сам шлем на батарейках рассчитан на 6 В. Вынимайте адаптер, когда не пользуетесь, и вынимайте батарейки, если адаптер подключён.',
      },
      {
        name: 'Гарантия',
        dose: '24 месяца',
        body: 'С покупки, при обычном использовании по руководству. Не покрывается: аварии, жидкость, неавторизованный ремонт, модификация и обычный износ.',
      },
    ],
  },

  running: {
    eyebrow: 'Стоимость владения',
    title: 'У шлема нет расходника. У ручки есть.',
    intro:
      'Hair-GENTRON стоит 3,300 AED один раз. Между сеансами ничего не меняют. HairGen BOOSTER дешевле купить и потом требует новую ампулу и новый штамп при каждом включении.',
    rows: [
      { label: 'Hair-GENTRON', value: 'AED 3,300', note: 'один раз · без расходника', here: true },
      { label: 'HairGen BOOSTER', value: 'AED 1,800', note: 'затем ~AED 167 за сеанс' },
      { label: 'Mesopecia Kit', value: 'AED 1,100', note: 'роллер + пилинг + шесть флаконов' },
    ],
    body:
      'Примерно после девяти сеансов HairGen расходники уже закрывают разницу между двумя приборами. Берите шлем, если нужна сессия по таймеру без того, что выбрасывают. Берите ручку, если нужна ампула через иглы. Mesopecia Kit — ручная версия второй идеи.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Один сеанс, из руководства.',
    frequency: 'После мытья · 10, 20 или 30 минут · не больше 30',
    steps: [
      {
        title: 'Вымойте кожу головы',
        body: 'Руководство ставит это первым. Высушите так, чтобы шлем не сидел на мокрых волосах.',
      },
      {
        title: 'Сначала основной шаг, если он есть',
        body: 'Производитель пишет шлем как дополнение после медицинской или эстетической процедуры, не как саму процедуру. Если используете Mesopecia Kit или HairGen BOOSTER, они идут раньше.',
      },
      {
        title: 'Наденьте и подгоните размер',
        body: 'Передняя часть не должна закрывать глаза. Диски высоты и ширины слева и справа на шлеме.',
      },
      {
        title: 'Запустите предустановку или своё время',
        body: 'Удерживайте On/Time/Off секунду. Стартует десятиминутная программа: воздушный массаж, нагрев, красный + синий + ИК и музыка. Короткое нажатие той же кнопки ставит 20 или 30 минут.',
      },
      {
        title: 'Выберите свет, массаж и нагрев',
        body: 'Четыре режима света на одной кнопке. У массажа и нагрева свои. Музыка: две секунды — вкл/выкл, короткое нажатие — следующий трек. Одна песня уже записана; свои файлы копируют на пульт по USB-C.',
      },
      {
        title: 'Выключается сам',
        body: 'По окончании времени шлем гаснет. Удержание две секунды останавливает раньше. Не держите дольше тридцати минут.',
      },
    ],
    note: 'Тем, кто плохо чувствует тепло, нагрев лучше выключить. Остановитесь и обратитесь к врачу, если что-то ощущается неправильно.',
  },

  depth: {
    eyebrow: 'Цифры, которые мы не выдумаем',
    title: 'Длины волн есть в брошюре. Облучённости нет нигде.',
    body:
      'Рекламная брошюра печатает 840 нм инфракрасный, 640 нм красный и 420 нм синий. Руководство не печатает длину волны, число светодиодов и плотность мощности. У продукта 49, GENO-LED IR II, есть полная таблица дозиметрии; у этого шлема её нет. Сторонние карточки ещё и расходятся с брошюрой — одна пишет 850 / 620 / 470 нм и шестьдесят светодиодов — поэтому таблицы мы не строим ни от кого, кроме DTS MG, а DTS MG напечатала эти три числа только на слайде продаж.',
    note: 'Если протокол просит облучённость или число светодиодов, у нас их нет. Запросите у DTS MG письменно — страница и запись изменятся вместе.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Информация о продукте',
    rows: [
      { label: 'Форма', value: 'LED-шлем с воздушным массажем и нагревом · отдельный пульт' },
      { label: 'Модель', value: 'HGHY01' },
      { label: 'Комплектация', value: 'Шлем, подставка, пульт, кабель USB-C и адаптер' },
      { label: 'Режимы света', value: 'Красный + ИК · Синий · Выкл. · Красный + синий + ИК' },
      { label: 'Сеанс', value: '10 / 20 / 30 минут · максимум 30 минут за раз' },
      { label: 'Питание', value: 'Адаптер 5 В 1,5 А, вход 100–240 В · или 4 × AA (не в комплекте)' },
      { label: 'Размер', value: 'Шлем 230 × 240 × 300 мм · пульт 158 × 68 × 42 мм · 1,0 кг' },
      { label: 'Сертификация', value: 'CE, EMC 2014/30/EU и LVD 2014/35/EU · испытан как массажный прибор IEC 60335-2-32' },
      { label: 'Патент', value: 'Корея 10-2151442 · бронза выставки изобретений Кореи 2020 — награда, не доказательство эффективности' },
      { label: 'Происхождение', value: 'DTS MG Co., Ltd., Сеул · Сделано в Корее' },
    ],
  },

  safety: {
    eyebrow: 'До включения',
    title: 'Кому сначала к врачу.',
    points: [
      'Тем, кто уже проходит медицинское лечение',
      'Тем, у кого имплантирован электронный медицинский прибор',
      'Заболевания сердца',
      'Заболевания головы',
      'Беременность',
      'Остеопороз или перелом позвоночника',
      'Нарушения кровообращения при диабете или другом заболевании',
      'Температура тела выше 38 °C',
    ],
    note: 'Держите вдали от детей, жидкости и жары. Не используйте повреждённый адаптер и не работайте мокрыми руками. Не дольше тридцати минут. Тем, кто плохо чувствует тепло, нагрев лучше выключить. Остановитесь и обратитесь к врачу при любом необычном ощущении. Хранение 5–40 °C, влажность не выше 80%.',
  },

  video: {
    eyebrow: 'В работе',
    title: 'Шлем на голове, а не на стойке.',
    body: 'Короткий ролик: как сидит устройство и как работает пульт.',
  },

  faq: {
    eyebrow: 'Вопросы',
    title: 'Полезно знать',
    items: [
      {
        q: 'Это лечит выпадение волос?',
        a: 'Нет, и лучше сказать прямо. Брошюра утверждает механики цикла волоса, которые мы не несём. Сертификаты испытывают его как массажный прибор. Если волосы выпадают, сначала к врачу.',
      },
      {
        q: 'Чем это отличается от HairGen BOOSTER?',
        a: 'Бустер — ручка, которая штампует и подаёт запечатанную ампулу через иглы. Это шлем, под которым сидят: свет, воздушный массаж и необязательное тепло, без иглы и без расходника. Это разные задачи. Брошюра производителя ставит этот шлем в пару к Mesopecia Kit, не к бустеру.',
      },
      {
        q: 'Чем это отличается от GENO-LED IR II?',
        a: 'GENO-LED — купол на 1,710 светодиодов над кушеткой, с опубликованной таблицей дозиметрии, для лица и тела. Это килограммовый шлем для кожи головы с четырьмя режимами света и без опубликованной облучённости. Это не один и тот же прибор.',
      },
      {
        q: 'Сколько стоит сеанс после покупки?',
        a: 'Электричество или четыре батарейки AA вдали от розетки. Ампулу и штамп менять не нужно. В этом коммерческая разница с HairGen BOOSTER, которому нужно около 167 AED расходников при каждом включении.',
        needsPrices: true,
      },
      {
        q: 'Можно ли каждый день?',
        a: 'Руководство не задаёт частоту. Оно задаёт максимум тридцать минут за раз и пишет шлем как дополнение после другой процедуры. Следуйте протоколу, который вам дали, а не числу с сайта.',
      },
      {
        q: 'Можно ли добавить свою музыку?',
        a: 'Да. Один трек уже записан. Подключите пульт к компьютеру по USB-C и скопируйте файлы. Короткое нажатие — следующий трек; удержание две секунды выключает музыку.',
      },
    ],
  },

  companionsTitle: 'С чем его ставит брошюра',
  backToProducts: 'Продукты',
}

const BY_LOCALE: Record<Locale, HairGenBoosterCopy> = { en: EN, ar: AR, ru: RU }

export function getHairGentronCopy(locale: string | undefined): HairGenBoosterCopy {
  return BY_LOCALE[(locale as Locale) ?? 'en'] ?? EN
}

/** Brochure combination first, then the other hair device, then the two liquids. */
export const COMPANION_PRODUCT_IDS = ['47', '3', '45', '46'] as const
