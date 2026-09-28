/**
 * Bespoke copy for Hair-GENTRON (product 48), the LED helmet in the HR³ MATRIX
 * hair range. "Lights on. World off." campaign, 28 Sep 2026.
 *
 * SOURCES: `~/Desktop/Drive/Genosys/Registration/Gentron/` - User's manual (EN / KR / JP),
 * EU Declaration of Conformity (17 Dec 2019), IEC/EN 60335-2-32 test report, and the DTS MG
 * brochures (Genosys_HAIR_GENTRON.pdf, _2.pdf: light colours, 640 / 840 / 420 nm, the
 * massage and heating functions, home and professional use, EU and China design
 * registrations).
 *
 * MUST NEVER BE ADDED, in any language:
 *   - Alopecia, hair-loss treatment, hair growth, anagen / telogen / catagen.
 *   - Mitochondria, blood circulation, nutrients or oxygen to the follicle.
 *   - An LED count or an irradiance, "phototherapy", "medical-grade", "no side effects".
 *   - The Korean patent number or an invention award: no document on file carries them.
 */

import type { HairGenBoosterCopy, Locale } from './hairGenBoosterCopy'

const EN: HairGenBoosterCopy = {
  eyebrow: 'Hair-GENTRON · LED helmet with massage and heat',
  headline: 'Lights on, world off: ten minutes of light, massage and warmth for the scalp.',
  subheadline:
    'Put it on, press one button and sit back. Red, infrared and blue LED light, an air-pressure massage around the head, gentle warmth and your own music run together for ten minutes, then the helmet switches itself off. Hands free, 1.0 kg, and nothing to replace between sessions, at home or in the treatment room.',
  heroBullets: [
    'One press starts a ten-minute session of light, massage, warmth and music',
    'Four light modes: red + infrared, blue, all three together, or off',
    'Air-pressure massage and heat, each on its own button',
    'Runs on four AA batteries or the USB-C adaptor in the box',
  ],
  badges: ['Made in Korea', 'Red · infrared · blue', '10 / 20 / 30 min', '24-month warranty'],

  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',

  stats: [
    { value: '1.0 kg', label: 'on the head, hands free' },
    { value: '10 / 20 / 30', label: 'minutes, then it switches itself off' },
    { value: '4', label: 'light modes on one button' },
    { value: '0', label: 'consumables to replace' },
  ],

  whatItIs: {
    eyebrow: 'The idea',
    title: 'Lights on. World off.',
    body:
      'Most scalp care asks for your hands and your attention. Hair-GENTRON asks for ten minutes in a chair. The helmet sits on your head, the lights come on inside the dome, the band massages with air pressure, warmth builds if you want it, and your music plays. When the time is up, it switches itself off.',
    items: [
      'Red, infrared and blue LED light from a dome over the scalp',
      'Air-pressure massage around the head, with or without heat',
      'Your own music, copied onto the controller over USB-C',
      'A timer that ends the session for you',
    ],
    detail:
      'At home it is ten minutes on the sofa. In a salon or clinic it is a session that runs itself while the therapist’s hands are free.',
    leaflet: 'Wash, dry, put it on, press once. That is the whole routine.',
  },

  build: {
    eyebrow: 'Inside the helmet',
    title: 'Built so a session runs itself',
    intro: 'Six numbers behind every ten-minute session.',
    items: [
      {
        name: 'Light modes',
        dose: '4',
        body: 'Red + infrared, blue, all three together, or off. One button steps through them, and the massage and heat run with the lights on or off.',
      },
      {
        name: 'Session',
        dose: '10 · 20 · 30',
        body: 'Minutes, set on the controller. Hold the power button for a second and the ten-minute program starts: massage, heat, all three lights and music.',
      },
      {
        name: 'Weight',
        dose: '1.0 kg',
        body: 'Light enough to sit on the head, with height and width dials on the helmet for a snug fit. The front sits above the eyes.',
      },
      {
        name: 'Power',
        dose: '5 V · 1.5 A',
        body: 'USB-C adaptor in the box, 100-240 V, or four AA batteries in the controller (not included) for a session away from a socket.',
      },
      {
        name: 'Music',
        dose: 'USB-C',
        body: 'One track is loaded. Copy your own onto the controller from a computer; a short press skips, a two-second hold turns the music off.',
      },
      {
        name: 'Warranty',
        dose: '24 months',
        body: 'Two years from the date of purchase.',
      },
    ],
  },

  running: {
    eyebrow: 'What it costs to own',
    title: 'Buy it once. Nothing to refill.',
    intro:
      'Hair-GENTRON is AED 6,600 once. There is no ampoule, stamp or cartridge between sessions, so every session after the first costs nothing but power.',
    rows: [
      { label: 'Hair-GENTRON', value: 'AED 6,600', note: 'once · no consumable', here: true },
      { label: 'HairGen BOOSTER', value: 'AED 1,800', note: 'then AED 150 a session' },
      { label: 'Mesopecia Kit', value: 'AED 1,100', note: 'roller + peeling + six vials' },
    ],
    body:
      'HairGen BOOSTER and the Mesopecia Kit work an ampoule into the scalp and use a fresh one every time. The helmet gives light, massage and warmth, and uses nothing up.',
  },

  howTo: {
    eyebrow: 'How to use',
    title: 'Ten minutes, start to finish.',
    frequency: 'After washing · 10, 20 or 30 minutes · up to 30 at a time',
    steps: [
      {
        title: 'Wash and dry',
        body: 'Start with a clean scalp, dry enough that the helmet does not sit on wet hair.',
      },
      {
        title: 'Put it on',
        body: 'Set the height and width dials on the helmet so it sits snug, with the front above your eyes.',
      },
      {
        title: 'Press once',
        body: 'Hold On/Time/Off for a second. The ten-minute program starts: air-pressure massage, heat, red + blue + infrared and music. A short press of the same button steps the time to 20 or 30 minutes.',
      },
      {
        title: 'Make it yours',
        body: 'Four light modes on one button; the massage and the heat each have their own. Hold the music button for two seconds to turn music on or off, press it briefly to skip.',
      },
      {
        title: 'Sit back',
        body: 'When the time is up the helmet switches itself off. Hold the power button for two seconds to stop early.',
      },
    ],
    note: 'Straight after a procedure on the scalp, use the helmet only when the specialist who did it says so. If you do not feel heat well, keep the heating off.',
  },

  depth: {
    eyebrow: 'The light',
    title: 'Red, infrared and blue, from one dome.',
    body:
      'The LEDs sit on a white panel inside the top cap, over the scalp. Red and infrared run together, blue runs on its own, and the third mode lights all three at once. Choose a mode with one button and change it mid-session.',
    note: 'Every mode works with the massage and the heat, or without them.',
  },

  spec: {
    eyebrow: 'Details',
    title: 'Product information',
    rows: [
      { label: 'Form', value: 'LED helmet with air-pressure massage and heat · separate controller' },
      { label: 'Model', value: 'HGHY01' },
      { label: 'In the box', value: 'Helmet, stand, controller, USB-C cable and adaptor' },
      { label: 'Light', value: 'Red 640 nm · infrared 840 nm · blue 420 nm' },
      { label: 'Light modes', value: 'Red + infrared · Blue · Red + blue + infrared · Off' },
      { label: 'Session', value: '10 / 20 / 30 minutes · up to 30 minutes at a time · switches itself off' },
      { label: 'Power', value: 'Adaptor 5 V 1.5 A, 100-240 V in · or 4 × AA (not included)' },
      { label: 'Size', value: 'Helmet 230 × 240 × 300 mm · controller 158 × 68 × 42 mm · 1.0 kg' },
      { label: 'Conformity', value: 'CE · EMC 2014/30/EU and LVD 2014/35/EU · IEC/EN 60335-2-32' },
      { label: 'Design', value: 'Registered design in the EU and China' },
      { label: 'Origin', value: 'DTS MG Co., Ltd., Seoul · Made in Korea' },
      { label: 'Warranty', value: '24 months from the date of purchase' },
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
    note: 'Keep it away from children, liquid and heat. Do not use a damaged adaptor, or operate it with wet hands. Up to thirty minutes at a time. If you do not feel heat well, keep the heating off. Stop and see a doctor if anything feels wrong. Store at 5-40 °C, humidity at or below 80%.',
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
        q: 'What does a session feel like?',
        a: 'Gentle pressure from the air massage around the band, warmth if you switch the heat on, a soft glow inside the dome, and your music. The front sits above your eyes, so you can read or scroll.',
      },
      {
        q: 'How often can I use it?',
        a: 'Up to thirty minutes at a time, as a regular part of your scalp-care routine. If you follow a treatment plan for your scalp, agree the rhythm with your specialist.',
      },
      {
        q: 'What if my hair is falling out?',
        a: 'If hair falls out suddenly or in patches, see a doctor first. Hair-GENTRON is scalp care, light, massage and warmth, not a medical treatment.',
      },
      {
        q: 'How is it different from HairGen BOOSTER?',
        a: 'The booster is a handpiece that works an ampoule into the scalp through a fresh stamp every session. Hair-GENTRON is a helmet you sit under: light, air-pressure massage and warmth, with nothing to replace.',
      },
      {
        q: 'How is it different from GENO-LED IR II?',
        a: 'GENO-LED is a professional dome over a couch, for the face and body. Hair-GENTRON is made for the scalp: a 1.0 kg helmet with massage, heat and music built in.',
        needsPrices: false,
      },
      {
        q: 'What does a session cost after I have bought it?',
        a: 'Only power: the adaptor, or four AA batteries away from a socket. There is no ampoule, stamp or cartridge, where HairGen BOOSTER uses AED 150 of consumables every session.',
        needsPrices: true,
      },
      {
        q: 'Can I add my own music?',
        a: 'Yes. One track is loaded. Connect the controller to a computer over the USB-C cable and copy files onto it. A short press skips track; a two-second hold turns the music off.',
      },
    ],
  },

  companionsTitle: 'Complete the HR³ routine',
  backToProducts: 'Products',
}

const AR: HairGenBoosterCopy = {
  eyebrow: 'Hair-GENTRON · خوذة LED مع تدليك ودفء',
  headline: 'أضيئي النور وأطفئي العالم: عشر دقائق من الضوء والتدليك والدفء لفروة الرأس.',
  subheadline:
    'ضعي الخوذة، واضغطي زراً واحداً، واسترخي. ضوء LED أحمر وتحت الأحمر وأزرق، وتدليك بضغط الهواء حول الرأس، ودفء لطيف، وموسيقاكِ، تعمل معاً عشر دقائق ثم تتوقف الخوذة وحدها. يداكِ حرّتان، ووزنها 1.0 كغ، ولا شيء يُستبدل بين الجلسات، في المنزل أو في غرفة العلاج.',
  heroBullets: [
    'ضغطة واحدة تبدأ جلسة من عشر دقائق: ضوء وتدليك ودفء وموسيقى',
    'أربعة أوضاع للضوء: أحمر + تحت الأحمر، أزرق، الثلاثة معاً، أو إطفاء',
    'تدليك بضغط الهواء ودفء، ولكلٍّ منهما زرّه',
    'تعمل بأربع بطاريات AA أو بمحوّل USB-C المرفق في العلبة',
  ],
  badges: ['صُنع في كوريا', 'أحمر · تحت الأحمر · أزرق', '10 / 20 / 30 دقيقة', 'ضمان 24 شهراً'],

  addToBag: 'أضف إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'أُضيفت إلى السلة',
  inBag: 'في السلة',
  viewBag: 'عرض السلة',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'شحن مجاني فوق 1,000 درهم · يُشحن من دبي',

  stats: [
    { value: '1.0 كغ', label: 'على الرأس، ويداكِ حرّتان' },
    { value: '10 / 20 / 30', label: 'دقيقة، ثم تتوقف وحدها' },
    { value: '4', label: 'أوضاع للضوء على زر واحد' },
    { value: '0', label: 'مستهلكات تحتاج إلى استبدال' },
  ],

  whatItIs: {
    eyebrow: 'الفكرة',
    title: 'أضيئي النور. أطفئي العالم.',
    body:
      'معظم العناية بفروة الرأس تحتاج إلى يديكِ وانتباهكِ. أما Hair-GENTRON فيحتاج إلى عشر دقائق في كرسي مريح. تستقر الخوذة على رأسكِ، ويضيء الضوء داخل القبة، ويدلّك الحزام بضغط الهواء، ويزداد الدفء إن رغبتِ، وتعزف موسيقاكِ. وعند انتهاء الوقت تتوقف وحدها.',
    items: [
      'ضوء LED أحمر وتحت الأحمر وأزرق من قبة فوق فروة الرأس',
      'تدليك بضغط الهواء حول الرأس، مع الدفء أو من دونه',
      'موسيقاكِ الخاصة، منسوخة إلى جهاز التحكم عبر USB-C',
      'مؤقت ينهي الجلسة عنكِ',
    ],
    detail:
      'في المنزل هي عشر دقائق على الأريكة. وفي الصالون أو العيادة هي جلسة تعمل وحدها بينما يدا المختصة حرّتان.',
    leaflet: 'اغسلي، جففي، ضعيها، اضغطي. هذا هو الروتين كله.',
  },

  build: {
    eyebrow: 'داخل الخوذة',
    title: 'صُممت لتعمل الجلسة وحدها',
    intro: 'ستة أرقام وراء كل جلسة من عشر دقائق.',
    items: [
      {
        name: 'أوضاع الإضاءة',
        dose: '4',
        body: 'أحمر + تحت الأحمر، أزرق، الثلاثة معاً، أو إطفاء. زر واحد ينتقل بينها، ويعمل التدليك والدفء مع الأضواء أو من دونها.',
      },
      {
        name: 'الجلسة',
        dose: '10 · 20 · 30',
        body: 'دقيقة، تُضبط من جهاز التحكم. اضغطي زر التشغيل ثانية واحدة فيبدأ برنامج العشر دقائق: تدليك ودفء والأضواء الثلاثة وموسيقى.',
      },
      {
        name: 'الوزن',
        dose: '1.0 كغ',
        body: 'خفيفة بما يكفي لتستقر على الرأس، مع قرصي الارتفاع والعرض على الخوذة لمقاس محكم. وتبقى المقدمة فوق العينين.',
      },
      {
        name: 'الطاقة',
        dose: '5 ف · 1.5 أ',
        body: 'محوّل USB-C مرفق، 100-240 فولت، أو أربع بطاريات AA في جهاز التحكم (غير مرفقة) لجلسة بعيداً عن المقبس.',
      },
      {
        name: 'الموسيقى',
        dose: 'USB-C',
        body: 'مقطوعة واحدة محمّلة. انسخي مقطوعاتكِ إلى جهاز التحكم من الحاسوب؛ ضغطة قصيرة للتالية، وضغطة مطوّلة لثانيتين لإطفاء الموسيقى.',
      },
      {
        name: 'الضمان',
        dose: '24 شهراً',
        body: 'عامان من تاريخ الشراء.',
      },
    ],
  },

  running: {
    eyebrow: 'كلفة الامتلاك',
    title: 'تشترينها مرة واحدة. ولا شيء يُعاد شراؤه.',
    intro:
      'سعر Hair-GENTRON ‏6,600 درهم مرة واحدة. لا أمبولة ولا ختم ولا خرطوشة بين الجلسات، فلا تكلّف كل جلسة بعد الأولى سوى الطاقة.',
    rows: [
      { label: 'Hair-GENTRON', value: '6,600 درهم', note: 'مرة · بلا مستهلك', here: true },
      { label: 'HairGen BOOSTER', value: '1,800 درهم', note: 'ثم 150 درهماً للجلسة' },
      { label: 'Mesopecia Kit', value: '1,100 درهم', note: 'رولر + تقشير + ست قارورات' },
    ],
    body:
      'يُدخل HairGen BOOSTER وMesopecia Kit الأمبولة إلى فروة الرأس ويستخدمان واحدة جديدة في كل مرة. أما الخوذة فتمنح الضوء والتدليك والدفء ولا تستهلك شيئاً.',
  },

  howTo: {
    eyebrow: 'طريقة الاستخدام',
    title: 'عشر دقائق من البداية إلى النهاية.',
    frequency: 'بعد الغسل · 10 أو 20 أو 30 دقيقة · حتى 30 في المرة',
    steps: [
      {
        title: 'اغسلي وجففي',
        body: 'ابدئي بفروة رأس نظيفة وجافة بما يكفي كي لا تستقر الخوذة على شعر مبلول.',
      },
      {
        title: 'ضعيها',
        body: 'اضبطي قرصي الارتفاع والعرض لتستقر الخوذة بإحكام، مع بقاء المقدمة فوق العينين.',
      },
      {
        title: 'اضغطي مرة واحدة',
        body: 'اضغطي On/Time/Off ثانية واحدة. يبدأ برنامج العشر دقائق: تدليك بالهواء ودفء وأحمر + أزرق + تحت الأحمر وموسيقى. ضغطة قصيرة على الزر نفسه تنقل الوقت إلى 20 أو 30 دقيقة.',
      },
      {
        title: 'اجعليها على ذوقكِ',
        body: 'أربعة أوضاع للضوء على زر واحد، ولكل من التدليك والدفء زرّه. اضغطي زر الموسيقى ثانيتين لتشغيلها أو إطفائها، وضغطة قصيرة للمقطوعة التالية.',
      },
      {
        title: 'استرخي',
        body: 'عند انتهاء الوقت تتوقف الخوذة وحدها. اضغطي زر التشغيل ثانيتين للتوقف مبكراً.',
      },
    ],
    note: 'لا تستخدميه مباشرة بعد إجراء إلا بموافقة المختص الذي أجراه. وإن كنتِ لا تشعرين بالحرارة جيداً، فأبقي التسخين مطفأً.',
  },

  depth: {
    eyebrow: 'الضوء',
    title: 'أحمر وتحت الأحمر وأزرق من قبة واحدة.',
    body:
      'تستقر مصابيح LED على لوحة بيضاء داخل الغطاء العلوي، فوق فروة الرأس. يعمل الأحمر وتحت الأحمر معاً، والأزرق وحده، ويضيء الوضع الثالث الثلاثة معاً. اختاري الوضع بزر واحد وغيّريه أثناء الجلسة.',
    note: 'كل وضع يعمل مع التدليك والدفء أو من دونهما.',
  },

  spec: {
    eyebrow: 'التفاصيل',
    title: 'معلومات المنتج',
    rows: [
      { label: 'الشكل', value: 'خوذة LED مع تدليك بضغط الهواء وتسخين · جهاز تحكم منفصل' },
      { label: 'الطراز', value: 'HGHY01' },
      { label: 'في العلبة', value: 'خوذة، حامل، جهاز تحكم، كابل USB-C ومحوّل' },
      { label: 'الضوء', value: 'أحمر 640 نانومتر · تحت الأحمر 840 نانومتر · أزرق 420 نانومتر' },
      { label: 'أوضاع الإضاءة', value: 'أحمر + تحت الأحمر · أزرق · أحمر + أزرق + تحت الأحمر · إطفاء' },
      { label: 'الجلسة', value: '10 / 20 / 30 دقيقة · حتى 30 دقيقة في المرة · إيقاف تلقائي' },
      { label: 'الطاقة', value: 'محوّل 5 ف 1.5 أ، دخل 100-240 ف · أو 4 × AA (غير مرفقة)' },
      { label: 'الحجم', value: 'الخوذة 230 × 240 × 300 مم · التحكّم 158 × 68 × 42 مم · 1.0 كغ' },
      { label: 'المطابقة', value: 'CE · EMC 2014/30/EU وLVD 2014/35/EU · IEC/EN 60335-2-32' },
      { label: 'التصميم', value: 'تصميم مسجّل في الاتحاد الأوروبي والصين' },
      { label: 'المنشأ', value: 'DTS MG Co., Ltd.، سيول · صُنع في كوريا' },
      { label: 'الضمان', value: '24 شهراً من تاريخ الشراء' },
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
    note: 'أبعديها عن الأطفال والسوائل والحرارة. لا تستعملي محوّلاً تالفاً ولا تشغّليها بيد مبتلّة. حتى ثلاثين دقيقة في المرة. إن كنتِ لا تشعرين بالحرارة جيداً فأبقي التسخين مطفأً. أوقفي الجهاز وراجعي طبيباً إن شعرتِ بأي شيء غير طبيعي. التخزين 5-40 °م، رطوبة 80% أو أقل.',
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
        q: 'كيف تبدو الجلسة؟',
        a: 'ضغط لطيف من التدليك بالهواء حول الحزام، ودفء إن شغّلتِ التسخين، وضوء ناعم داخل القبة، وموسيقاكِ. تبقى المقدمة فوق العينين، فيمكنكِ القراءة أو تصفّح هاتفكِ.',
      },
      {
        q: 'كم مرة يمكن استخدامها؟',
        a: 'حتى ثلاثين دقيقة في المرة، كجزء منتظم من العناية بفروة الرأس. وإن كنتِ تتبعين خطة علاجية لفروة الرأس، فاتفقي على الإيقاع مع مختصتكِ.',
      },
      {
        q: 'ماذا لو كان شعري يتساقط؟',
        a: 'إن كان الشعر يتساقط فجأة أو على شكل بقع، فابدئي بزيارة الطبيب. Hair-GENTRON عناية بفروة الرأس: ضوء وتدليك ودفء، وليس علاجاً طبياً.',
      },
      {
        q: 'ما الفرق بينها وبين HairGen BOOSTER؟',
        a: 'BOOSTER جهاز يدوي يُدخل الأمبولة إلى فروة الرأس عبر ختم جديد في كل جلسة. أما Hair-GENTRON فخوذة تسترخين تحتها: ضوء وتدليك بضغط الهواء ودفء، ولا شيء يُستبدل.',
      },
      {
        q: 'ما الفرق بينها وبين GENO-LED IR II؟',
        a: 'GENO-LED قبة احترافية فوق سرير للوجه والجسم. أما Hair-GENTRON فمصممة لفروة الرأس: خوذة بوزن 1.0 كغ فيها التدليك والدفء والموسيقى.',
      },
      {
        q: 'ماذا تكلّف الجلسة بعد الشراء؟',
        a: 'الطاقة فقط: المحوّل، أو أربع بطاريات AA بعيداً عن المقبس. لا أمبولة ولا ختم ولا خرطوشة، بينما يستهلك HairGen BOOSTER مستهلكات بقيمة 150 درهماً في كل جلسة.',
        needsPrices: true,
      },
      {
        q: 'هل يمكن إضافة موسيقاي؟',
        a: 'نعم. مقطوعة واحدة محمّلة. صلي جهاز التحكّم بالحاسوب عبر USB-C وانسخي الملفات إليه. ضغطة قصيرة للمقطوعة التالية، وضغطة مطوّلة لثانيتين لإطفاء الموسيقى.',
      },
    ],
  },

  companionsTitle: 'أكملي روتين HR³',
  backToProducts: 'المنتجات',
}

const RU: HairGenBoosterCopy = {
  eyebrow: 'Hair-GENTRON · LED-шлем с массажем и теплом',
  headline: 'Свет включён, мир выключен: десять минут света, массажа и тепла для кожи головы.',
  subheadline:
    'Наденьте шлем, нажмите одну кнопку и откиньтесь назад. Красный, инфракрасный и синий свет LED, массаж воздушным давлением вокруг головы, мягкое тепло и ваша музыка работают вместе десять минут, а затем шлем выключается сам. Руки свободны, 1,0 кг и ничего не нужно менять между сеансами, дома или в кабинете.',
  heroBullets: [
    'Одно нажатие запускает десятиминутный сеанс: свет, массаж, тепло и музыка',
    'Четыре режима света: красный + ИК, синий, все три сразу или выкл.',
    'Массаж воздушным давлением и тепло, у каждого своя кнопка',
    'Работает от четырёх батареек AA или от адаптера USB-C из комплекта',
  ],
  badges: ['Сделано в Корее', 'Красный · ИК · синий', '10 / 20 / 30 мин', 'Гарантия 24 месяца'],

  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено в корзину',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1,000 AED · Отправка из Дубая',

  stats: [
    { value: '1,0 кг', label: 'на голове, руки свободны' },
    { value: '10 / 20 / 30', label: 'минут, затем выключается сам' },
    { value: '4', label: 'режима света на одной кнопке' },
    { value: '0', label: 'расходников для замены' },
  ],

  whatItIs: {
    eyebrow: 'Идея',
    title: 'Свет включён. Мир выключен.',
    body:
      'Большинство средств для кожи головы требуют ваших рук и внимания. Hair-GENTRON просит только десять минут в кресле. Шлем сидит на голове, внутри купола загорается свет, лента делает массаж воздушным давлением, по желанию нарастает тепло, и играет ваша музыка. Когда время выходит, шлем выключается сам.',
    items: [
      'Красный, инфракрасный и синий свет LED из купола над кожей головы',
      'Массаж воздушным давлением вокруг головы, с теплом или без',
      'Ваша музыка, скопированная на пульт по USB-C',
      'Таймер, который сам завершает сеанс',
    ],
    detail:
      'Дома это десять минут на диване. В салоне или клинике это сеанс, который идёт сам, пока руки мастера свободны.',
    leaflet: 'Вымыть, высушить, надеть, нажать. Вот и весь ритуал.',
  },

  build: {
    eyebrow: 'Внутри шлема',
    title: 'Создан, чтобы сеанс шёл сам',
    intro: 'Шесть параметров каждого десятиминутного сеанса.',
    items: [
      {
        name: 'Режимы света',
        dose: '4',
        body: 'Красный + ИК, синий, все три сразу или выкл. Одна кнопка переключает режимы, а массаж и тепло работают со светом и без него.',
      },
      {
        name: 'Сеанс',
        dose: '10 · 20 · 30',
        body: 'Минуты, на пульте. Удержите кнопку питания секунду, и стартует десятиминутная программа: массаж, тепло, все три вида света и музыка.',
      },
      {
        name: 'Вес',
        dose: '1,0 кг',
        body: 'Достаточно лёгкий, чтобы сидеть на голове; диски высоты и ширины на шлеме дают плотную посадку. Передняя часть проходит над глазами.',
      },
      {
        name: 'Питание',
        dose: '5 В · 1,5 А',
        body: 'Адаптер USB-C в комплекте, 100-240 В, или четыре батарейки AA в пульте (не входят в комплект) для сеанса вдали от розетки.',
      },
      {
        name: 'Музыка',
        dose: 'USB-C',
        body: 'Один трек уже записан. Скопируйте свои на пульт с компьютера; короткое нажатие переключает трек, удержание две секунды выключает музыку.',
      },
      {
        name: 'Гарантия',
        dose: '24 месяца',
        body: 'Два года с даты покупки.',
      },
    ],
  },

  running: {
    eyebrow: 'Стоимость владения',
    title: 'Покупаете один раз. Докупать ничего не нужно.',
    intro:
      'Hair-GENTRON стоит AED 6,600 один раз. Между сеансами не нужны ампулы, штампы или картриджи, поэтому каждый следующий сеанс стоит только электричества.',
    rows: [
      { label: 'Hair-GENTRON', value: 'AED 6,600', note: 'один раз · без расходника', here: true },
      { label: 'HairGen BOOSTER', value: 'AED 1,800', note: 'затем AED 150 за сеанс' },
      { label: 'Mesopecia Kit', value: 'AED 1,100', note: 'роллер + пилинг + шесть флаконов' },
    ],
    body:
      'HairGen BOOSTER и Mesopecia Kit вводят ампулу в кожу головы и каждый раз используют новую. Шлем даёт свет, массаж и тепло и ничего не расходует.',
  },

  howTo: {
    eyebrow: 'Как пользоваться',
    title: 'Десять минут от начала до конца.',
    frequency: 'После мытья · 10, 20 или 30 минут · до 30 за раз',
    steps: [
      {
        title: 'Вымойте и высушите',
        body: 'Начните с чистой кожи головы, высушенной так, чтобы шлем не сидел на мокрых волосах.',
      },
      {
        title: 'Наденьте',
        body: 'Настройте диски высоты и ширины, чтобы шлем сидел плотно, а передняя часть проходила над глазами.',
      },
      {
        title: 'Нажмите один раз',
        body: 'Удерживайте On/Time/Off секунду. Стартует десятиминутная программа: воздушный массаж, тепло, красный + синий + ИК и музыка. Короткое нажатие той же кнопки ставит 20 или 30 минут.',
      },
      {
        title: 'Настройте под себя',
        body: 'Четыре режима света на одной кнопке, у массажа и тепла свои кнопки. Удержание кнопки музыки две секунды включает или выключает её, короткое нажатие переключает трек.',
      },
      {
        title: 'Отдыхайте',
        body: 'По окончании времени шлем выключается сам. Удержание кнопки питания две секунды останавливает сеанс раньше.',
      },
    ],
    note: 'Не используйте шлем непосредственно после процедуры без разрешения специалиста, который её проводил. Если вы плохо чувствуете тепло, оставьте нагрев выключенным.',
  },

  depth: {
    eyebrow: 'Свет',
    title: 'Красный, инфракрасный и синий из одного купола.',
    body:
      'Светодиоды расположены на белой панели внутри верхнего купола, над кожей головы. Красный и инфракрасный работают вместе, синий отдельно, а третий режим включает все три сразу. Режим выбирается одной кнопкой и меняется прямо во время сеанса.',
    note: 'Каждый режим работает с массажем и теплом или без них.',
  },

  spec: {
    eyebrow: 'Детали',
    title: 'Информация о продукте',
    rows: [
      { label: 'Форма', value: 'LED-шлем с массажем воздушным давлением и нагревом · отдельный пульт' },
      { label: 'Модель', value: 'HGHY01' },
      { label: 'В комплекте', value: 'Шлем, подставка, пульт, кабель USB-C и адаптер' },
      { label: 'Свет', value: 'Красный 640 нм · инфракрасный 840 нм · синий 420 нм' },
      { label: 'Режимы света', value: 'Красный + ИК · Синий · Красный + синий + ИК · Выкл.' },
      { label: 'Сеанс', value: '10 / 20 / 30 минут · до 30 минут за раз · автоотключение' },
      { label: 'Питание', value: 'Адаптер 5 В 1,5 А, вход 100-240 В · или 4 × AA (не в комплекте)' },
      { label: 'Размер', value: 'Шлем 230 × 240 × 300 мм · пульт 158 × 68 × 42 мм · 1,0 кг' },
      { label: 'Соответствие', value: 'CE · EMC 2014/30/EU и LVD 2014/35/EU · IEC/EN 60335-2-32' },
      { label: 'Дизайн', value: 'Зарегистрированный промышленный образец в ЕС и Китае' },
      { label: 'Происхождение', value: 'DTS MG Co., Ltd., Сеул · Сделано в Корее' },
      { label: 'Гарантия', value: '24 месяца с даты покупки' },
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
    note: 'Держите вдали от детей, жидкости и жары. Не используйте повреждённый адаптер и не работайте мокрыми руками. До тридцати минут за раз. Если вы плохо чувствуете тепло, оставьте нагрев выключенным. Остановитесь и обратитесь к врачу при любом необычном ощущении. Хранение 5-40 °C, влажность не выше 80%.',
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
        q: 'Какие ощущения во время сеанса?',
        a: 'Мягкое давление воздушного массажа вокруг ленты, тепло, если нагрев включён, мягкий свет внутри купола и ваша музыка. Передняя часть проходит над глазами, так что можно читать или листать телефон.',
      },
      {
        q: 'Как часто можно пользоваться?',
        a: 'До тридцати минут за раз, как постоянную часть ухода за кожей головы. Если вы следуете плану лечения кожи головы, согласуйте ритм со специалистом.',
      },
      {
        q: 'Что делать, если волосы выпадают?',
        a: 'Если волосы выпадают внезапно или участками, сначала обратитесь к врачу. Hair-GENTRON - это уход за кожей головы: свет, массаж и тепло, а не медицинское лечение.',
      },
      {
        q: 'Чем он отличается от HairGen BOOSTER?',
        a: 'BOOSTER - ручной аппарат, который вводит ампулу в кожу головы через новый штамп на каждом сеансе. Hair-GENTRON - шлем, под которым вы отдыхаете: свет, массаж воздушным давлением и тепло, и ничего не нужно менять.',
      },
      {
        q: 'Чем он отличается от GENO-LED IR II?',
        a: 'GENO-LED - профессиональный купол над кушеткой для лица и тела. Hair-GENTRON создан для кожи головы: шлем весом 1,0 кг со встроенными массажем, теплом и музыкой.',
      },
      {
        q: 'Сколько стоит сеанс после покупки?',
        a: 'Только электричество: адаптер или четыре батарейки AA вдали от розетки. Нет ампулы, штампа или картриджа, тогда как HairGen BOOSTER расходует AED 150 на каждый сеанс.',
        needsPrices: true,
      },
      {
        q: 'Можно ли добавить свою музыку?',
        a: 'Да. Один трек уже записан. Подключите пульт к компьютеру по USB-C и скопируйте файлы. Короткое нажатие переключает трек, удержание две секунды выключает музыку.',
      },
    ],
  },

  companionsTitle: 'Дополните уход HR³',
  backToProducts: 'Продукты',
}

const BY_LOCALE: Record<Locale, HairGenBoosterCopy> = { en: EN, ar: AR, ru: RU }

export function getHairGentronCopy(locale: string | undefined): HairGenBoosterCopy {
  return BY_LOCALE[(locale as Locale) ?? 'en'] ?? EN
}

/** Brochure combination first, then the other hair device, then the two liquids. */
export const COMPANION_PRODUCT_IDS = ['47', '3', '45', '46'] as const
