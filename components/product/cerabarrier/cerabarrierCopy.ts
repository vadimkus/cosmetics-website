/**
 * Bespoke copy for the CERABARRIER BIOME GEL CLEANSER page (product 66).
 *
 * Kept as a self-contained per-locale record - the same pattern as
 * components/product/TrustBadges.tsx - so the dedicated layout can ship
 * EN/AR/RU without adding ~90 keys to the shared messages bundles.
 *
 * Every claim here is copied from the product record (Intertek-sourced
 * ingredients, GENOSYS clinical figures, packshot slide copy). Nothing is
 * invented; if a figure is not in the source data it is not on this page.
 */

import { PRODUCT_66_FULL_INCI } from '@/data/product66LocalizedCopy'

export type CeraLocale = 'en' | 'ar' | 'ru'

export interface CeraCopy {
  eyebrow: string
  headline: string
  subheadline: string
  heroBullets: string[]
  badges: string[]
  chooseSize: string
  sizes: {
    homecareLabel: string
    homecareNote: string
    proLabel: string
    proNote: string
  }
  quantity: string
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
  science: {
    eyebrow: string
    title: string
    intro: string
    cards: Array<{ title: string; body: string }>
  }
  complex: {
    eyebrow: string
    title: string
    body: string
    points: Array<{ title: string; body: string }>
  }
  texture: {
    eyebrow: string
    title: string
    steps: Array<{ label: string; body: string }>
  }
  howTo: {
    eyebrow: string
    title: string
    frequency: string
    steps: Array<{ title: string; body: string }>
    note: string
  }
  video: {
    eyebrow: string
    title: string
    body: string
    unsupported: string
  }
  actives: {
    eyebrow: string
    title: string
    intro: string
    fullInci: string
    fullInciNote: string
  }
  proof: {
    eyebrow: string
    title: string
    clinicalLabel: string
    claims: Array<{ value: string; label: string }>
    feelTitle: string
    feels: string[]
    disclaimer: string
  }
  routine: {
    eyebrow: string
    title: string
    intro: string
    stepLabel: string
    thisProduct: string
    viewProduct: string
    chooseOptions: string
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
    brochure: string
  }
  reviewsTitle: string
  backToProducts: string
}

const EN: CeraCopy = {
  eyebrow: 'Cleanser · Barrier Care',
  headline: 'Cleanses deeply. Never strips.',
  subheadline:
    'A gel-to-foam cleanser powered by Pink Ceramide and the skin microbiome, supporting a long-lasting moisture barrier for a soft, hydrated finish.',
  heroBullets: [
    'Soft gel transforms into a dense, cushioned foam',
    '+145.8% skin hydration immediately after washing',
    '5 ceramides with a pro- and prebiotic microbiome complex',
    'No tightness, no slippery residue - morning and night',
  ],
  badges: ['Dermatologically tested', 'Made in Korea', 'Official UAE distributor', 'All skin types'],
  chooseSize: 'Choose your size',
  sizes: {
    homecareLabel: 'Homecare',
    homecareNote: 'Around 2-3 months of daily use',
    proLabel: 'Professional',
    proNote: 'Around 200-300 professional treatments',
  },
  quantity: 'Quantity',
  addToBag: 'Add to bag',
  adding: 'Adding…',
  added: 'Added to bag',
  inBag: 'In bag',
  viewBag: 'View bag',
  loginToShop: 'Log in to shop',
  outOfStock: 'Out of stock',
  vatIncluded: 'VAT included',
  freeDelivery: 'Free delivery over AED 1,000 · Dispatched from Dubai',
  stats: [
    { value: '+145.8%', label: 'Immediate hydration after one wash' },
    { value: '2.4×', label: 'Increase in skin hydration' },
    { value: '5', label: 'Barrier ceramides - NP · AS · AP · NS · EOP' },
    { value: '2', label: 'Sizes - homecare and professional' },
  ],
  science: {
    eyebrow: 'The science',
    title: 'Four reasons it feels different',
    intro:
      'It goes beyond cleansing. Cleansing, soothing and hydration happen in the same 60 seconds.',
    cards: [
      {
        title: 'Gel becomes foam',
        body: 'A soft gel turns into a dense, rich foam the moment it meets water. The smooth-rolling lather and abundant bubbles cushion the skin, so cleansing takes almost no friction.',
      },
      {
        title: 'Pink Ceramide barrier',
        body: 'Fireweed extract, lactobacillus ferment lysate and Ceramide NP re-energize skin, while five ceramides plus cholesterol and phytosphingosine reinforce the lipid barrier.',
      },
      {
        title: 'Microbiome technology',
        body: 'Bifida and Lactobacillus ferment lysates work with fructan, chicory root and dandelion root prebiotics to keep the skin’s own flora in balance.',
      },
      {
        title: 'No tight feeling',
        body: 'Powerful enough to lift sebum, impurities and base makeup, yet non-stripping - a refreshing finish with no slippery or greasy residue.',
      },
    ],
  },
  complex: {
    eyebrow: 'Inside the formula',
    title: 'CERABARRIER BIOME™ Complex',
    body: 'A barrier lipid complex and a microbiome complex, engineered to work together so the skin is left healthier than it was before the wash.',
    points: [
      {
        title: '5 Ceramides · NP, AS, AP, NS, EOP',
        body: 'Core barrier lipids that make up around half of the skin barrier - essential for preventing moisture loss.',
      },
      {
        title: 'Cholesterol & Phytosphingosine',
        body: 'Cholesterol stabilizes the barrier’s lipid structure; phytosphingosine is a ceramide precursor that maintains skin homeostasis.',
      },
      {
        title: 'Probiotics & Prebiotics',
        body: 'Bifida and Lactobacillus ferment lysates with fructan, chicory and dandelion root extracts to balance the microbiome.',
      },
      {
        title: 'Shea Butter & Resurrection Plant',
        body: 'Triglycerides and fatty acids hydrate after cleansing; Anastatica hierochuntica adds antioxidant and soothing support.',
      },
    ],
  },
  texture: {
    eyebrow: 'The texture',
    title: 'Gel. Water. Foam.',
    steps: [
      { label: 'Gel', body: 'Clear, soft and slow-moving in the palm.' },
      { label: 'Water', body: 'A splash is all it takes to activate the lather.' },
      { label: 'Foam', body: 'Dense, creamy micro-bubbles that roll over skin.' },
    ],
  },
  howTo: {
    eyebrow: 'The ritual',
    title: 'How to use',
    frequency: 'Use daily, morning and evening',
    steps: [
      { title: 'Dispense', body: 'Dispense an appropriate amount onto damp palms.' },
      { title: 'Lather', body: 'Work the gel into a dense, rich foam with a little water.' },
      { title: 'Massage', body: 'Gently massage over the face - the smooth-rolling foam minimizes friction.' },
      { title: 'Rinse', body: 'Rinse thoroughly with lukewarm water.' },
    ],
    note: 'Skin feels comfortable and hydrated after every wash - no tightness, no slippery or greasy residue. Suitable as the first step of every homecare routine (200 ml) and professional treatment protocol (600 ml).',
  },
  video: {
    eyebrow: 'In motion',
    title: 'Two sizes. One barrier-first cleanse.',
    body: 'The 200 ml homecare bottle and 600 ml professional format, shown together. Same gel-to-foam formula, sized for your bathroom or the treatment room.',
    unsupported: 'Your browser cannot play this video.',
  },
  actives: {
    eyebrow: 'Ingredients',
    title: 'What is doing the work',
    intro: 'Nine actives carry the formula, and the complete INCI list is below.',
    fullInci: 'Full ingredient list (INCI)',
    fullInciNote: 'Every ingredient, in the same order as the box in your hand.',
  },
  proof: {
    eyebrow: 'Proof',
    title: 'Measured, then felt',
    clinicalLabel: 'Clinically proven in a single use',
    claims: [
      { value: '145.8%', label: 'Immediate skin hydration improvement post-wash' },
      { value: '2.4×', label: 'Increase in skin hydration' },
    ],
    feelTitle: 'What you will feel',
    feels: [
      'Sebum, impurities and base makeup gone in one wash',
      'Comfortable, hydrated skin instead of a tight, squeaky finish',
      'No slippery or greasy film left behind',
      'A cushioned, low-friction lather that suits sensitized skin',
    ],
    disclaimer: 'Clinical testing on a single use. Individual results vary.',
  },
  routine: {
    eyebrow: 'Complete the routine',
    title: 'Recommended barrier care routine',
    intro: 'The cleanser is step one. These four products carry the barrier work through the rest of the day.',
    stepLabel: 'Step',
    thisProduct: 'You are here',
    viewProduct: 'View product',
    chooseOptions: 'Choose size',
  },
  faq: {
    eyebrow: 'Questions',
    title: 'Good to know',
    items: [
      {
        q: 'Who is this cleanser for?',
        a: 'All skin types, including sensitive. The non-stripping, low-friction lather also makes it a good choice for post-treatment and sensitized skin, which is why the 600 ml size is used as the pre-treatment cleanse in professional protocols.',
      },
      {
        q: 'Will it dry my skin out?',
        a: 'No. It is formulated to cleanse without stripping: clinical testing measured a 145.8% immediate improvement in skin hydration post-wash and a 2.4× increase in skin hydration. Skin should feel comfortable, not tight.',
      },
      {
        q: 'Does it remove makeup?',
        a: 'It thoroughly removes sebum, impurities and base makeup in one wash. For heavy eye makeup or waterproof formulas, use a dedicated makeup remover first, then cleanse.',
      },
      {
        q: 'Which size should I buy?',
        a: 'The 200 ml is the homecare size and lasts roughly 2-3 months of twice-daily use. The 600 ml is the professional size, intended for clinics - roughly 200-300 treatments.',
      },
      {
        q: 'What are Pink Ceramide and the microbiome complex?',
        a: 'Pink Ceramide Complex is a blend of Epilobium angustifolium (fireweed) extract, lactobacillus ferment lysate and Ceramide NP. The microbiome complex pairs probiotics (Bifida and Lactobacillus ferment lysates) with prebiotics (fructan, chicory root and dandelion root extracts) so beneficial skin flora stay in balance.',
      },
      {
        q: 'How often should I use it?',
        a: 'Daily, morning and evening, as the first step of your routine. It is dermatologically tested and made in Korea.',
      },
    ],
  },
  details: {
    eyebrow: 'Two sizes',
    title: 'Product details',
    rows: [
      { label: 'Form', value: 'Gel-to-foam cleanser' },
      { label: 'Size', value: '200 ml (Homecare) / 600 ml (Professional)' },
      { label: 'Skin type', value: 'All skin types, including sensitive' },
      { label: 'Technology', value: 'CERABARRIER BIOME™ - Barrier Lipid Complex + Microbiome Complex' },
      { label: 'Usage', value: 'Daily, morning and evening' },
      { label: 'Origin', value: 'South Korea' },
    ],
    brochure: 'Download the product brochure (PDF)',
  },
  reviewsTitle: 'Reviews',
  backToProducts: 'All products',
}

const _AR: CeraCopy = {
  eyebrow: 'منظف · العناية بحاجز البشرة',
  headline: 'ينظّف بعمق دون أن يجرّد البشرة',
  subheadline:
    'منظف جل يتحول إلى رغوة، مدعوم بـ Pink Ceramide وميكروبيوم البشرة، يحافظ على حاجز رطوبة طويل الأمد ويمنح ملمسًا ناعمًا ورطبًا.',
  heroBullets: [
    'جل ناعم يتحول إلى رغوة كثيفة ووثيرة',
    'تحسّن فوري في ترطيب البشرة بنسبة 145.8% بعد الغسل',
    '5 سيراميدات مع مركّب ميكروبيوم من البروبيوتيك والبريبايوتيك',
    'بلا شدّ وبلا بقايا زلقة - صباحًا ومساءً',
  ],
  badges: ['مختبر جلديًا', 'صنع في كوريا', 'الموزّع الرسمي في الإمارات', 'لجميع أنواع البشرة'],
  chooseSize: 'اختر الحجم',
  sizes: {
    homecareLabel: 'للاستخدام المنزلي',
    homecareNote: 'يكفي نحو 2-3 أشهر من الاستخدام اليومي',
    proLabel: 'للاستخدام الاحترافي',
    proNote: 'يكفي نحو 200-300 جلسة احترافية',
  },
  quantity: 'الكمية',
  addToBag: 'أضف إلى السلة',
  adding: 'جارٍ الإضافة…',
  added: 'تمت الإضافة',
  inBag: 'في السلة',
  viewBag: 'عرض السلة',
  loginToShop: 'سجّل الدخول للشراء',
  outOfStock: 'غير متوفر',
  vatIncluded: 'شامل ضريبة القيمة المضافة',
  freeDelivery: 'شحن مجاني للطلبات فوق 1,000 درهم · يُشحن من دبي',
  stats: [
    { value: '+145.8%', label: 'ترطيب فوري بعد غسلة واحدة' },
    { value: '2.4×', label: 'زيادة في ترطيب البشرة' },
    { value: '5', label: 'سيراميدات للحاجز - NP · AS · AP · NS · EOP' },
    { value: '2', label: 'حجمان - منزلي واحترافي' },
  ],
  science: {
    eyebrow: 'العلم وراء المنتج',
    title: 'أربعة أسباب تجعل الإحساس مختلفًا',
    intro: 'أبعد من مجرد تنظيف: تنظيف وتهدئة وترطيب في الوقت نفسه.',
    cards: [
      {
        title: 'من جل إلى رغوة',
        body: 'يتحول الجل الناعم إلى رغوة كثيفة وغنية بمجرد ملامسته للماء. الرغوة الانسيابية والفقاعات الوفيرة تحمي البشرة فيتم التنظيف دون احتكاك تقريبًا.',
      },
      {
        title: 'حاجز Pink Ceramide',
        body: 'مستخلص عشبة الحريق ومحلول تخمّر اللاكتوباسيلس وسيراميد NP يعيدون النشاط للبشرة، بينما تعزز خمسة سيراميدات مع الكوليسترول والفيتوسفينغوزين الحاجز الدهني.',
      },
      {
        title: 'تقنية الميكروبيوم',
        body: 'محاليل تخمّر البيفيدا واللاكتوباسيلس تعمل مع الفروكتان ومستخلصي جذر الهندباء البرية والهندباء للحفاظ على توازن فلورا البشرة الطبيعية.',
      },
      {
        title: 'بلا إحساس بالشدّ',
        body: 'قوي بما يكفي لإزالة الدهون والشوائب ومكياج الأساس، ومع ذلك لا يجرّد البشرة - نهاية منعشة دون بقايا زلقة أو دهنية.',
      },
    ],
  },
  complex: {
    eyebrow: 'داخل التركيبة',
    title: '™CERABARRIER BIOME مركّب',
    body: 'مركّب دهون الحاجز ومركّب الميكروبيوم، مصمّمان للعمل معًا حتى تبقى البشرة أفضل حالًا مما كانت عليه قبل الغسل.',
    points: [
      {
        title: '5 سيراميدات · NP، AS، AP، NS، EOP',
        body: 'دهون أساسية تشكّل نحو نصف حاجز البشرة، وضرورية لمنع فقدان الرطوبة.',
      },
      {
        title: 'الكوليسترول والفيتوسفينغوزين',
        body: 'الكوليسترول يثبّت البنية الدهنية للحاجز، والفيتوسفينغوزين سليفة سيراميد تحافظ على اتزان البشرة.',
      },
      {
        title: 'بروبيوتيك وبريبايوتيك',
        body: 'محاليل تخمّر البيفيدا واللاكتوباسيلس مع الفروكتان ومستخلصات جذر الهندباء لموازنة الميكروبيوم.',
      },
      {
        title: 'زبدة الشيا ونبتة البعثرة',
        body: 'الدهون الثلاثية والأحماض الدهنية ترطّب بعد التنظيف، ونبتة Anastatica hierochuntica تضيف حماية مضادة للأكسدة وتهدئة.',
      },
    ],
  },
  texture: {
    eyebrow: 'القوام',
    title: 'جل. ماء. رغوة.',
    steps: [
      { label: 'جل', body: 'شفاف وناعم وبطيء الحركة على راحة اليد.' },
      { label: 'ماء', body: 'رشّة ماء واحدة تكفي لتنشيط الرغوة.' },
      { label: 'رغوة', body: 'فقاعات دقيقة كثيفة وكريمية تنساب على البشرة.' },
    ],
  },
  howTo: {
    eyebrow: 'الطقوس',
    title: 'طريقة الاستخدام',
    frequency: 'يُستخدم يوميًا، صباحًا ومساءً',
    steps: [
      { title: 'الكمية', body: 'ضع كمية مناسبة على راحتي اليد المبللتين.' },
      { title: 'الرغوة', body: 'حوّل الجل إلى رغوة كثيفة وغنية بقليل من الماء.' },
      { title: 'التدليك', body: 'دلّك الوجه برفق - الرغوة الانسيابية تقلّل الاحتكاك.' },
      { title: 'الشطف', body: 'اشطف جيدًا بماء فاتر.' },
    ],
    note: 'تشعر البشرة بالراحة والترطيب بعد كل غسلة - بلا شدّ وبلا بقايا زلقة أو دهنية. مناسب كخطوة أولى في كل روتين منزلي (200 مل) وفي بروتوكولات العلاج الاحترافية (600 مل).',
  },
  video: {
    eyebrow: 'في الحركة',
    title: 'حجمان. تنظيف واحد يراعي الحاجز.',
    body: 'عبوة العناية المنزلية 200 مل والحجم الاحترافي 600 مل معاً. التركيبة الجلّية نفسها التي تتحول إلى رغوة، بحجم مناسب للمنزل أو غرفة العلاج.',
    unsupported: 'متصفحك لا يدعم تشغيل هذا الفيديو.',
  },
  actives: {
    eyebrow: 'المكونات',
    title: 'ما الذي يقوم بالعمل',
    intro: 'تسعة مكونات فعّالة تحمل التركيبة، وقائمة INCI الكاملة أدناه.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',
  },
  proof: {
    eyebrow: 'الإثبات',
    title: 'مقاس أولًا، ومحسوس بعده',
    clinicalLabel: 'مثبت سريريًا من أول استخدام',
    claims: [
      { value: '145.8%', label: 'تحسّن فوري في ترطيب البشرة بعد الغسل' },
      { value: '2.4×', label: 'زيادة في ترطيب البشرة' },
    ],
    feelTitle: 'ما الذي ستشعر به',
    feels: [
      'إزالة الدهون والشوائب ومكياج الأساس في غسلة واحدة',
      'بشرة مرتاحة ورطبة بدل الإحساس بالشدّ',
      'دون طبقة زلقة أو دهنية متبقية',
      'رغوة وثيرة منخفضة الاحتكاك تناسب البشرة الحساسة',
    ],
    disclaimer: 'اختبار سريري على استخدام واحد. النتائج تختلف من شخص لآخر.',
  },
  routine: {
    eyebrow: 'أكمل الروتين',
    title: 'روتين العناية بحاجز البشرة الموصى به',
    intro: 'المنظف هو الخطوة الأولى. هذه المنتجات الأربعة تكمل العناية بالحاجز طوال اليوم.',
    stepLabel: 'خطوة',
    thisProduct: 'أنت هنا',
    viewProduct: 'عرض المنتج',
    chooseOptions: 'اختر الحجم',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'من الجيد معرفته',
    items: [
      {
        q: 'لمن هذا المنظف؟',
        a: 'لجميع أنواع البشرة، بما فيها الحساسة. الرغوة اللطيفة قليلة الاحتكاك تجعله خيارًا جيدًا للبشرة بعد الجلسات وللبشرة المتحسسة، ولهذا يُستخدم حجم 600 مل كتنظيف تمهيدي في البروتوكولات الاحترافية.',
      },
      {
        q: 'هل يسبب جفاف البشرة؟',
        a: 'لا. صُمم لينظّف دون تجريد: قاست الاختبارات السريرية تحسّنًا فوريًا في الترطيب بنسبة 145.8% بعد الغسل وزيادة 2.4× في ترطيب البشرة. يجب أن تشعر البشرة بالراحة لا بالشدّ.',
      },
      {
        q: 'هل يزيل المكياج؟',
        a: 'يزيل الدهون والشوائب ومكياج الأساس تمامًا في غسلة واحدة. لمكياج العيون الكثيف أو التركيبات المقاومة للماء، استخدم مزيل مكياج مخصص أولًا ثم نظّف.',
      },
      {
        q: 'أي حجم أختار؟',
        a: 'حجم 200 مل للاستخدام المنزلي ويكفي نحو 2-3 أشهر مرتين يوميًا. حجم 600 مل احترافي مخصص للعيادات - نحو 200-300 جلسة.',
      },
      {
        q: 'ما هو Pink Ceramide ومركّب الميكروبيوم؟',
        a: 'مركّب Pink Ceramide مزيج من مستخلص Epilobium angustifolium ومحلول تخمّر اللاكتوباسيلس وسيراميد NP. أما مركّب الميكروبيوم فيجمع البروبيوتيك (محاليل تخمّر البيفيدا واللاكتوباسيلس) مع البريبايوتيك (الفروكتان ومستخلصي جذر الهندباء) للحفاظ على توازن الفلورا المفيدة.',
      },
      {
        q: 'كم مرة أستخدمه؟',
        a: 'يوميًا صباحًا ومساءً كخطوة أولى في الروتين. مختبر جلديًا وصنع في كوريا.',
      },
    ],
  },
  details: {
    eyebrow: 'حجمان',
    title: 'تفاصيل المنتج',
    rows: [
      { label: 'الشكل', value: 'منظف جل يتحول إلى رغوة' },
      { label: 'الحجم', value: '200 مل (منزلي) / 600 مل (احترافي)' },
      { label: 'نوع البشرة', value: 'جميع أنواع البشرة، بما فيها الحساسة' },
      { label: 'التقنية', value: 'CERABARRIER BIOME™ - مركّب دهون الحاجز + مركّب الميكروبيوم' },
      { label: 'الاستخدام', value: 'يوميًا، صباحًا ومساءً' },
      { label: 'بلد المنشأ', value: 'كوريا الجنوبية' },
    ],
    brochure: 'تحميل كتيّب المنتج (PDF)',
  },
  reviewsTitle: 'التقييمات',
  backToProducts: 'كل المنتجات',
}

const _RU: CeraCopy = {
  eyebrow: 'Очищение · Барьерный уход',
  headline: 'Очищает глубоко. Не сушит.',
  subheadline:
    'Гель-в-пену на основе Pink Ceramide и микробиома кожи: поддерживает стойкий барьер влаги и оставляет кожу мягкой и увлажнённой.',
  heroBullets: [
    'Мягкий гель превращается в плотную кремовую пену',
    '+145.8% увлажнения кожи сразу после умывания',
    '5 керамидов и комплекс из про- и пребиотиков',
    'Без стянутости и скользкой плёнки - утром и вечером',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', 'Официальный дистрибьютор в ОАЭ', 'Для всех типов кожи'],
  chooseSize: 'Выберите объём',
  sizes: {
    homecareLabel: 'Домашний уход',
    homecareNote: 'Примерно на 2-3 месяца ежедневного использования',
    proLabel: 'Профессиональный',
    proNote: 'Примерно на 200-300 профессиональных процедур',
  },
  quantity: 'Количество',
  addToBag: 'В корзину',
  adding: 'Добавляем…',
  added: 'Добавлено',
  inBag: 'В корзине',
  viewBag: 'Открыть корзину',
  loginToShop: 'Войдите, чтобы купить',
  outOfStock: 'Нет в наличии',
  vatIncluded: 'НДС включён',
  freeDelivery: 'Бесплатная доставка от 1,000 AED · Отправка из Дубая',
  stats: [
    { value: '+145.8%', label: 'Мгновенное увлажнение после одного умывания' },
    { value: '2.4×', label: 'Рост увлажнённости кожи' },
    { value: '5', label: 'Барьерных керамидов - NP · AS · AP · NS · EOP' },
    { value: '2', label: 'Объёма - домашний и профессиональный' },
  ],
  science: {
    eyebrow: 'Наука',
    title: 'Четыре причины, почему ощущается иначе',
    intro: 'Больше, чем очищение: очищение, успокоение и увлажнение за одну минуту.',
    cards: [
      {
        title: 'Гель становится пеной',
        body: 'Мягкий гель превращается в плотную густую пену, как только касается воды. Скользящая пена и обилие пузырьков создают подушку, и очищение проходит почти без трения.',
      },
      {
        title: 'Барьер Pink Ceramide',
        body: 'Экстракт иван-чая, лизат фермента лактобактерий и керамид NP возвращают коже энергию, а пять керамидов с холестеролом и фитосфингозином укрепляют липидный барьер.',
      },
      {
        title: 'Микробиомная технология',
        body: 'Лизаты ферментов бифидо- и лактобактерий работают вместе с фруктаном и экстрактами корня цикория и одуванчика, сохраняя баланс собственной флоры кожи.',
      },
      {
        title: 'Без чувства стянутости',
        body: 'Достаточно эффективен, чтобы удалить себум, загрязнения и тональную основу, но не разрушает барьер - свежий финиш без скользкой или жирной плёнки.',
      },
    ],
  },
  complex: {
    eyebrow: 'Внутри формулы',
    title: 'Комплекс CERABARRIER BIOME™',
    body: 'Липидный барьерный комплекс и микробиомный комплекс, созданные работать вместе: после умывания кожа в лучшем состоянии, чем была до него.',
    points: [
      {
        title: '5 керамидов · NP, AS, AP, NS, EOP',
        body: 'Ключевые липиды, составляющие около половины барьера кожи и необходимые для удержания влаги.',
      },
      {
        title: 'Холестерол и фитосфингозин',
        body: 'Холестерол стабилизирует липидную структуру барьера; фитосфингозин - предшественник керамидов, поддерживающий гомеостаз кожи.',
      },
      {
        title: 'Пробиотики и пребиотики',
        body: 'Лизаты ферментов бифидо- и лактобактерий с фруктаном и экстрактами корня цикория и одуванчика балансируют микробиом.',
      },
      {
        title: 'Масло ши и растение-воскресение',
        body: 'Триглицериды и жирные кислоты увлажняют после очищения; Anastatica hierochuntica добавляет антиоксидантную и успокаивающую поддержку.',
      },
    ],
  },
  texture: {
    eyebrow: 'Текстура',
    title: 'Гель. Вода. Пена.',
    steps: [
      { label: 'Гель', body: 'Прозрачный, мягкий, медленно растекается на ладони.' },
      { label: 'Вода', body: 'Достаточно немного воды, чтобы запустить пену.' },
      { label: 'Пена', body: 'Плотные кремовые микропузырьки, скользящие по коже.' },
    ],
  },
  howTo: {
    eyebrow: 'Ритуал',
    title: 'Как использовать',
    frequency: 'Ежедневно, утром и вечером',
    steps: [
      { title: 'Нанесите', body: 'Выдавите необходимое количество на влажные ладони.' },
      { title: 'Вспеньте', body: 'Взбейте гель в плотную густую пену с небольшим количеством воды.' },
      { title: 'Помассируйте', body: 'Мягко помассируйте лицо - скользящая пена снижает трение.' },
      { title: 'Смойте', body: 'Тщательно смойте тёплой водой.' },
    ],
    note: 'После каждого умывания кожа ощущается комфортной и увлажнённой - без стянутости, без скользкой или жирной плёнки. Подходит как первый шаг домашнего ухода (200 мл) и профессионального протокола (600 мл).',
  },
  video: {
    eyebrow: 'В движении',
    title: 'Два объёма. Одно бережное очищение.',
    body: 'Домашний флакон 200 мл и профессиональный формат 600 мл вместе. Одна и та же гель-пена, в объёме для ванной комнаты или процедурного кабинета.',
    unsupported: 'Ваш браузер не может воспроизвести это видео.',
  },
  actives: {
    eyebrow: 'Состав',
    title: 'Что работает в формуле',
    intro: 'Девять активных компонентов держат формулу, а полный список INCI приведён ниже.',
    fullInci: 'Полный список ингредиентов (INCI)',
    fullInciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',
  },
  proof: {
    eyebrow: 'Доказательства',
    title: 'Сначала измерено, потом почувствовано',
    clinicalLabel: 'Клинически подтверждено за одно применение',
    claims: [
      { value: '145.8%', label: 'Мгновенный рост увлажнённости кожи после умывания' },
      { value: '2.4×', label: 'Рост увлажнённости кожи' },
    ],
    feelTitle: 'Что вы почувствуете',
    feels: [
      'Себум, загрязнения и тональная основа уходят за одно умывание',
      'Комфортная увлажнённая кожа вместо ощущения стянутости',
      'Никакой скользкой или жирной плёнки',
      'Мягкая пена с низким трением - подходит чувствительной коже',
    ],
    disclaimer: 'Клинический тест на однократном применении. Результаты индивидуальны.',
  },
  routine: {
    eyebrow: 'Завершите уход',
    title: 'Рекомендованный барьерный уход',
    intro: 'Очищение - первый шаг. Эти четыре продукта продолжают работу с барьером в течение дня.',
    stepLabel: 'Шаг',
    thisProduct: 'Вы здесь',
    viewProduct: 'Открыть продукт',
    chooseOptions: 'Выбрать объём',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Полезно знать',
    items: [
      {
        q: 'Кому подойдёт это средство?',
        a: 'Всем типам кожи, включая чувствительную. Мягкая пена с низким трением делает его подходящим для кожи после процедур и сенсибилизированной кожи - поэтому объём 600 мл используется как предпроцедурное очищение в профессиональных протоколах.',
      },
      {
        q: 'Не пересушит ли кожу?',
        a: 'Нет. Формула очищает, не разрушая барьер: клинические тесты показали мгновенное улучшение увлажнённости на 145.8% после умывания и рост увлажнённости в 2.4 раза. Кожа должна ощущаться комфортной, а не стянутой.',
      },
      {
        q: 'Смывает ли макияж?',
        a: 'За одно умывание полностью удаляет себум, загрязнения и тональную основу. Для плотного макияжа глаз и водостойких текстур сначала используйте специальное средство для снятия макияжа.',
      },
      {
        q: 'Какой объём выбрать?',
        a: '200 мл - домашний формат, хватает примерно на 2-3 месяца при использовании дважды в день. 600 мл - профессиональный формат для клиник, примерно на 200-300 процедур.',
      },
      {
        q: 'Что такое Pink Ceramide и микробиомный комплекс?',
        a: 'Pink Ceramide Complex - сочетание экстракта Epilobium angustifolium (иван-чай), лизата фермента лактобактерий и керамида NP. Микробиомный комплекс объединяет пробиотики (лизаты ферментов бифидо- и лактобактерий) с пребиотиками (фруктан, экстракты корня цикория и одуванчика), чтобы полезная флора кожи оставалась в балансе.',
      },
      {
        q: 'Как часто использовать?',
        a: 'Ежедневно, утром и вечером, первым шагом ухода. Средство дерматологически протестировано и произведено в Корее.',
      },
    ],
  },
  details: {
    eyebrow: 'Два объёма',
    title: 'Характеристики',
    rows: [
      { label: 'Формат', value: 'Гель-в-пену для умывания' },
      { label: 'Объём', value: '200 мл (домашний) / 600 мл (профессиональный)' },
      { label: 'Тип кожи', value: 'Все типы кожи, включая чувствительную' },
      { label: 'Технология', value: 'CERABARRIER BIOME™ - липидный барьерный + микробиомный комплекс' },
      { label: 'Применение', value: 'Ежедневно, утром и вечером' },
      { label: 'Производство', value: 'Южная Корея' },
    ],
    brochure: 'Скачать буклет продукта (PDF)',
  },
  reviewsTitle: 'Отзывы',
  backToProducts: 'Все продукты',
}

const RU_AUDITED: CeraCopy = {
  ..._RU,
  eyebrow: 'Очищение · Гель-в-пену',
  headline: 'Чистая кожа без лишних обещаний.',
  subheadline:
    'Прозрачный гель с тремя очищающими компонентами превращается в пену и тщательно смывается тёплой водой. Глицерин 5%, бутиленгликоль 3% и бетаин 0,5% дополняют смываемую формулу.',
  heroBullets: [
    'Sodium Cocoyl Glutamate 8,75% · Cocamidopropyl Betaine 6% · Decyl Glucoside 1,65%',
    'Измеренный pH 6,37',
    '5 керамидов и два лизата ферментов в следовых концентрациях',
    'Содержит отдушку 0,5%',
  ],
  badges: ['Дерматологически протестировано', 'Сделано в Корее', 'Официальный дистрибьютор в ОАЭ'],
  sizes: {
    homecareLabel: 'Домашний формат',
    homecareNote: 'Базовый объём 200 ml',
    proLabel: 'Профессиональный формат',
    proNote: 'Большой объём 600 ml',
  },
  stats: [
    { value: '16,4%', label: 'Суммарно три очищающих компонента' },
    { value: '5%', label: 'Глицерин в смываемой формуле' },
    { value: '6,37', label: 'Измеренный pH' },
    { value: '2', label: 'Объёма - 200 ml и 600 ml' },
  ],
  science: {
    eyebrow: 'Формула',
    title: 'На чём построено очищение',
    intro: 'Главную работу выполняет система из трёх ПАВ. Остальные компоненты дополняют смываемую гелевую основу.',
    cards: [
      {
        title: 'Гель становится пеной',
        body: 'Добавьте воду и хорошо вспеньте средство перед мягким массажем кожи.',
      },
      {
        title: 'Три очищающих компонента',
        body: 'Sodium Cocoyl Glutamate 8,75%, Cocamidopropyl Betaine 6% и Decyl Glucoside 1,65% составляют очищающую систему.',
      },
      {
        title: 'Увлажняющая база',
        body: 'Глицерин 5,0000076%, бутиленгликоль 3,000041% и бетаин 0,5% входят в формулу, которая полностью смывается.',
      },
      {
        title: 'Отдушка указана открыто',
        body: 'Parfum составляет 0,5%, поэтому средство не относится к продуктам без отдушки.',
      },
    ],
  },
  complex: {
    eyebrow: 'Комплексы в составе',
    title: 'Pink Ceramide и CERABARRIER BIOME™',
    body: 'Названия комплексов взяты из официальной презентации DTS MG. Количественная формула подтверждает отдельные INCI-компоненты, но не отдельную рабочую дозу комплекса.',
    points: [
      {
        title: 'Pink Ceramide Complex',
        body: 'В презентации DTS MG это Epilobium angustifolium, Lactobacillus Ferment Lysate и Ceramide NP. Safety Assessment с процентом готового премикса в архиве отсутствует.',
      },
      {
        title: '5 керамидов · NP, AS, AP, NS, EOP',
        body: 'Все пять присутствуют в количественной формуле в следовых концентрациях. Им не приписывается самостоятельное укрепление или восстановление барьера.',
      },
      {
        title: 'Лизаты и компоненты, названные пребиотиками',
        body: 'В формуле есть Lactobacillus и Bifida Ferment Lysates, фруктан, цикорий и одуванчик. Рост полезных бактерий или баланс микробиома готового продукта не доказан.',
      },
      {
        title: 'Дополнительные липиды и экстракты',
        body: 'Холестерол, фитосфингозин, масло ши и Anastatica hierochuntica присутствуют в следовых концентрациях без отдельного результата для готового средства.',
      },
    ],
  },
  texture: {
    ..._RU.texture,
    steps: [
      { label: 'Гель', body: 'Прозрачная текучая текстура.' },
      { label: 'Вода', body: 'Добавьте воду, чтобы вспенить средство.' },
      { label: 'Пена', body: 'Мягко распределите пену по коже и тщательно смойте.' },
    ],
  },
  howTo: {
    eyebrow: 'Применение',
    title: 'Как использовать',
    frequency: 'Частота на упаковке не установлена',
    steps: [
      { title: 'Вспеньте', body: 'Вспеньте достаточное количество средства с водой.' },
      { title: 'Очистите', body: 'Мягко помассируйте кожу пеной.' },
      { title: 'Смойте', body: 'Тщательно смойте тёплой водой.' },
    ],
    note: 'Только для наружного применения. Избегайте глаз и слизистых. При покраснении, отёке или раздражении прекратите использование и обратитесь к врачу.',
  },
  video: {
    ..._RU.video,
    title: 'Два объёма. Одна формула.',
    body: 'Домашний флакон 200 ml и профессиональный формат 600 ml. Та же смываемая гель-пена, в объёме для дома или кабинета.',
  },
  actives: {
    eyebrow: 'Состав',
    title: 'Что находится в формуле',
    intro: 'Точные проценты показывают, что основу продукта создают ПАВ и увлажняющие растворители, а керамиды, ферменты и растительные компоненты присутствуют на следовом уровне.',
    fullInci: 'Полный состав (INCI)',
    fullInciNote: `Состав в том же порядке, что на упаковке. В него входит 1,2-Hexanediol: ${PRODUCT_66_FULL_INCI}`,
  },
  proof: {
    eyebrow: 'Клиническое заявление',
    title: 'Один результат, а не два',
    clinicalLabel: 'Данные только из презентации DTS MG; исходный отчёт не найден',
    claims: [
      { value: '25,59 → 56,19', label: 'Показанные в презентации значения до и сразу после умывания' },
    ],
    feelTitle: 'Что подтверждено документами',
    feels: [
      'Функция продукта - очищение лица',
      'Гель необходимо вспенить, мягко помассировать по коже и смыть тёплой водой',
      'pH 6,37 и дерматологическое тестирование подтверждены отдельными документами',
      'Формула содержит Parfum 0,5%',
    ],
    disclaimer:
      'Заголовок презентации указывает +145,8% и 2,4× как два описания одного результата. Значения 25,59 → 56,19 дают 2,20× / +119,6%, поэтому заголовок не воспроизводится. Методика, размер выборки и исходный отчёт отсутствуют.',
  },
  routine: {
    ..._RU.routine,
    title: 'Последовательность ухода',
    intro: 'Сначала смываемое очищение, затем выбранные несмываемые средства. Рекомендации не означают, что очищающий гель лечит или восстанавливает барьер.',
  },
  faq: {
    eyebrow: 'Вопросы',
    title: 'Полезно знать',
    items: [
      {
        q: 'Для какого типа кожи предназначен гель?',
        a: 'Упаковка не ограничивает и не перечисляет типы кожи. Формула содержит отдушку 0,5%; при реактивной коже сначала проверьте средство на небольшом участке.',
      },
      {
        q: 'Что означает Pink Ceramide Complex?',
        a: 'Презентация DTS MG связывает это название с Epilobium angustifolium, Lactobacillus Ferment Lysate и Ceramide NP. Все три есть в формуле в следовых концентрациях; Safety Assessment с дозой премикса отсутствует.',
      },
      {
        q: 'Подтверждены ли +145,8% и 2,4×?',
        a: 'Это два описания одного немедленного результата в презентации DTS MG, а не два исследования. Показанные значения 25,59 и 56,19 дают 2,20× / +119,6%; исходный отчёт и методика не предоставлены, поэтому сайт не выдаёт заголовок за воспроизводимый результат.',
      },
      {
        q: 'Удаляет ли средство макияж?',
        a: 'Документы подтверждают функцию очищающего средства для лица, но отдельного теста снятия базового, стойкого или водостойкого макияжа нет. При необходимости используйте специальное средство для демакияжа.',
      },
      {
        q: 'Какой объём выбрать?',
        a: '200 ml - базовый домашний формат. 600 ml - профессиональный объём с той же формулой.',
      },
      {
        q: 'Как часто использовать?',
        a: 'Упаковка говорит о ежедневном очищении, но не устанавливает универсальное применение дважды в день. Подберите частоту по состоянию кожи.',
      },
    ],
  },
  details: {
    eyebrow: 'Два объёма',
    title: 'Характеристики',
    rows: [
      { label: 'Формат', value: 'Гель для умывания, образующий пену' },
      { label: 'Базовый объём', value: '200 ml' },
      { label: 'Варианты', value: '200 ml домашний / 600 ml профессиональный' },
      { label: 'ПАВ', value: '8,75% + 6% + 1,65%' },
      { label: 'pH', value: '6,37' },
      { label: 'Отдушка', value: 'Parfum 0,5%' },
      { label: 'Тестирование', value: 'Дерматологически протестировано' },
      { label: 'Производство', value: 'Южная Корея' },
    ],
    brochure: 'Открыть презентацию продукта (PDF)',
  },
}

const AR_AUDITED: CeraCopy = {
  ..._AR,
  eyebrow: 'تنظيف · جل يتحول إلى رغوة',
  headline: 'تنظيف واضح بلا وعود زائدة.',
  subheadline:
    'جل شفاف بثلاث مواد منظفة يتحول إلى رغوة ويُشطف جيداً بالماء الفاتر. ويكمل التركيبة التي تُشطف الجلسرين 5% والبيوتيلين غلايكول 3% والبيتايين 0.5%.',
  heroBullets: [
    'Sodium Cocoyl Glutamate ‏8.75% · Cocamidopropyl Betaine ‏6% · Decyl Glucoside ‏1.65%',
    'أس هيدروجيني مقاس 6.37',
    'خمسة سيراميدات ومحللا تخمر بتراكيز ضئيلة',
    'يحتوي على عطر بنسبة 0.5%',
  ],
  badges: ['مختبر جلدياً', 'صنع في كوريا', 'الموزع الرسمي في الإمارات'],
  sizes: {
    homecareLabel: 'الحجم المنزلي',
    homecareNote: 'الحجم الأساسي 200 ml',
    proLabel: 'الحجم الاحترافي',
    proNote: 'الحجم الكبير 600 ml',
  },
  stats: [
    { value: '16.4%', label: 'مجموع المواد المنظفة الثلاث' },
    { value: '5%', label: 'جلسرين في تركيبة تُشطف' },
    { value: '6.37', label: 'الأس الهيدروجيني المقاس' },
    { value: '2', label: 'حجمان: 200 ml و600 ml' },
  ],
  science: {
    eyebrow: 'التركيبة',
    title: 'على ماذا يعتمد التنظيف',
    intro: 'يؤدي نظام المواد المنظفة الثلاث العمل الأساسي، وتكمل بقية المكونات قاعدة الجل التي تُشطف.',
    cards: [
      { title: 'من جل إلى رغوة', body: 'أضيفي الماء ورغّي الجل جيداً قبل تدليك البشرة بلطف.' },
      { title: 'ثلاث مواد منظفة', body: 'Sodium Cocoyl Glutamate ‏8.75% وCocamidopropyl Betaine ‏6% وDecyl Glucoside ‏1.65% هي قاعدة التنظيف.' },
      { title: 'قاعدة مرطبة', body: 'جلسرين 5.0000076% وبيوتيلين غلايكول 3.000041% وبيتايين 0.5% ضمن تركيبة تُشطف بالكامل.' },
      { title: 'العطر مذكور بوضوح', body: 'تحتوي التركيبة على Parfum بنسبة 0.5%، ولذلك فهي ليست خالية من العطر.' },
    ],
  },
  complex: {
    eyebrow: 'المركبات في التركيبة',
    title: 'Pink Ceramide وCERABARRIER BIOME™',
    body: 'تأتي أسماء المركبات من عرض DTS MG الرسمي. تؤكد التركيبة الكمية مكونات INCI المنفردة، لكنها لا تحدد جرعة فعالة مستقلة للمركب.',
    points: [
      { title: 'Pink Ceramide Complex', body: 'يعرفه عرض DTS MG بأنه Epilobium angustifolium وLactobacillus Ferment Lysate وCeramide NP. لا يتوفر Safety Assessment يحدد نسبة الخليط الأولي.' },
      { title: '5 سيراميدات · NP وAS وAP وNS وEOP', body: 'توجد الأنواع الخمسة في التركيبة بتراكيز ضئيلة، ولا ننسب إليها تقوية أو إصلاحاً مستقلاً للحاجز.' },
      { title: 'محللات ومكونات تسمى بريبايوتيك', body: 'توجد محللات Lactobacillus وBifida والفروكتان والهندباء البرية والهندباء. لم يثبت نمو البكتيريا النافعة أو توازن الميكروبيوم في المنتج النهائي.' },
      { title: 'دهون ومستخلصات إضافية', body: 'يوجد الكوليسترول والفيتوسفينغوزين وزبدة الشيا وAnastatica hierochuntica بتراكيز ضئيلة من دون نتيجة مستقلة للمنتج النهائي.' },
    ],
  },
  texture: {
    ..._AR.texture,
    steps: [
      { label: 'جل', body: 'قوام شفاف وسائل.' },
      { label: 'ماء', body: 'أضيفي الماء لتكوين الرغوة.' },
      { label: 'رغوة', body: 'وزعي الرغوة بلطف ثم اشطفيها جيداً.' },
    ],
  },
  howTo: {
    eyebrow: 'الاستخدام',
    title: 'طريقة الاستخدام',
    frequency: 'لا تحدد العبوة تكراراً ثابتاً',
    steps: [
      { title: 'كوّني الرغوة', body: 'رغّي كمية كافية من الجل مع الماء.' },
      { title: 'نظفي', body: 'دلّكي الرغوة بلطف على البشرة.' },
      { title: 'اشطفي', body: 'اشطفي جيداً بالماء الفاتر.' },
    ],
    note: 'للاستعمال الخارجي فقط. تجنبي العينين والأغشية المخاطية. عند ظهور احمرار أو تورم أو تهيج، أوقفي الاستخدام واستشيري الطبيب.',
  },
  video: {
    ..._AR.video,
    title: 'حجمان. تركيبة واحدة.',
    body: 'عبوة 200 ml المنزلية وحجم 600 ml الاحترافي. الجل نفسه الذي يُرغى ويُشطف، بحجم للمنزل أو لغرفة العلاج.',
  },
  actives: {
    eyebrow: 'المكونات',
    title: 'ما الموجود في التركيبة',
    intro: 'توضح النسب الدقيقة أن المواد المنظفة والمذيبات المرطبة تشكل أساس المنتج، بينما توجد السيراميدات ومكونات التخمر والنباتات بمستوى ضئيل.',
    fullInci: 'قائمة المكوّنات الكاملة (INCI)',
    fullInciNote: `القائمة بالترتيب نفسه المطبوع على العبوة، وتشمل 1,2-Hexanediol: ${PRODUCT_66_FULL_INCI}`,
  },
  proof: {
    eyebrow: 'الادعاء السريري',
    title: 'نتيجة واحدة وليست نتيجتين',
    clinicalLabel: 'البيانات من عرض DTS MG فقط؛ لم يعثر على التقرير الأصلي',
    claims: [
      { value: '25.59 ← 56.19', label: 'القيم الظاهرة قبل الغسل وبعده مباشرة في العرض' },
    ],
    feelTitle: 'ما تؤكده المستندات',
    feels: [
      'وظيفة المنتج هي تنظيف الوجه',
      'يرغى الجل ويدلك بلطف ثم يشطف بالماء الفاتر',
      'الأس الهيدروجيني 6.37 والاختبار الجلدي موثقان',
      'تحتوي التركيبة على Parfum بنسبة 0.5%',
    ],
    disclaimer:
      'يعرض العنوان 145.8% و2.4× كوصفين لنتيجة واحدة. القيم 25.59 ← 56.19 تساوي 2.20× / زيادة 119.6%، لذلك لا يمكن إعادة حساب العنوان. المنهج وحجم العينة والتقرير الأصلي غير متاحة.',
  },
  routine: {
    ..._AR.routine,
    title: 'تسلسل العناية',
    intro: 'يأتي التنظيف الذي يُشطف أولاً، ثم المنتجات التي تترك على البشرة. لا يعني الاقتراح أن الغسول يعالج حاجز البشرة أو يصلحه.',
  },
  faq: {
    eyebrow: 'أسئلة',
    title: 'من الجيد معرفته',
    items: [
      { q: 'لأي نوع من البشرة؟', a: 'لا تحدد العبوة أنواعاً بعينها ولا تدعي ملاءمته للجميع. تحتوي التركيبة على عطر 0.5%؛ اختبريه على مساحة صغيرة إذا كانت البشرة شديدة التفاعل.' },
      { q: 'ما هو Pink Ceramide Complex؟', a: 'يربط عرض DTS MG الاسم بـEpilobium angustifolium وLactobacillus Ferment Lysate وCeramide NP. توجد المكونات الثلاثة بتراكيز ضئيلة، ولا يتوفر Safety Assessment يحدد جرعة الخليط الأولي.' },
      { q: 'هل ثبتت نسبتا 145.8% و2.4×؟', a: 'هما وصفان لنتيجة فورية واحدة في عرض DTS MG وليستا دراستين. القيم الظاهرة 25.59 و56.19 تساوي 2.20× / زيادة 119.6%؛ لم يتوفر التقرير الأصلي أو المنهج، لذلك لا يعرض الموقع العنوان كفعالية قابلة لإعادة الحساب.' },
      { q: 'هل يزيل المكياج؟', a: 'تؤكد المستندات أنه منظف للوجه، لكن لا يتوفر اختبار منفصل لإزالة المكياج الأساسي أو الثابت أو المقاوم للماء. استخدمي مزيلاً مخصصاً عند الحاجة.' },
      { q: 'أي حجم أختار؟', a: '200 ml هو الحجم المنزلي الأساسي، و600 ml حجم احترافي بالتركيبة نفسها.' },
      { q: 'كم مرة يستخدم؟', a: 'تصف العبوة المنتج بأنه منظف يومي، لكنها لا تفرض استعمالاً عاماً مرتين يومياً. اختاري التكرار وفق حالة البشرة.' },
    ],
  },
  details: {
    eyebrow: 'حجمان',
    title: 'تفاصيل المنتج',
    rows: [
      { label: 'القوام', value: 'جل تنظيف يتحول إلى رغوة' },
      { label: 'الحجم الأساسي', value: '200 ml' },
      { label: 'الخيارات', value: '200 ml منزلي / 600 ml احترافي' },
      { label: 'المواد المنظفة', value: '8.75% + 6% + 1.65%' },
      { label: 'الأس الهيدروجيني', value: '6.37' },
      { label: 'العطر', value: 'Parfum 0.5%' },
      { label: 'الاختبار', value: 'مختبر جلدياً' },
      { label: 'المنشأ', value: 'كوريا الجنوبية' },
    ],
    brochure: 'فتح عرض المنتج (PDF)',
  },
}

const COPY: Record<CeraLocale, CeraCopy> = { en: EN, ar: AR_AUDITED, ru: RU_AUDITED }

export function getCeraCopy(locale: string): CeraCopy {
  return COPY[locale as CeraLocale] ?? EN
}

/**
 * Routine steps shown in "Complete the routine". Product ids, image paths and
 * step descriptions all resolve from the existing shared routine data
 * (lib/productRoutines, lib/routineStepLinks, lib/routineStepImages) so this
 * page never drifts from the rest of the catalog.
 */
export const CERA_ROUTINE_STEP_KEYS = [
  'routineCerabarrierCleanserTitle',
  'routineMicrobiomeMistTitle',
  'routineAllForSensitiveSerumTitle',
  'routineSkinBarrierCreamTitle',
  'routineMultiSunCreamTitle',
] as const
