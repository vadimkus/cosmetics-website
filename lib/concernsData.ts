/**
 * Concern-Based SEO Landing Pages Data
 * 
 * Defines all 8 skin concern pages with:
 * - URL slugs and database field mappings
 * - SEO metadata in 3 languages (EN/AR/RU)
 * - Answer-first FAQ content for AI citation (GEO)
 * - Related concerns for cross-linking
 * 
 * Each concern maps to either:
 *   1. targetConcerns field values (from product database)
 *   2. GENOSYS_PRODUCT_CONCERNS curated mappings
 *   3. Category fallbacks (for concerns that align with categories)
 */

export interface FaqItem {
  question: string
  answer: string
}

export interface ConcernSeo {
  title: string
  description: string
  h1: string
  intro: string
  keywords: string[]
}

export interface ConcernPage {
  slug: string
  concernKeys: string[]      // Maps to targetConcerns / GENOSYS_PRODUCT_CONCERNS values
  categoryFallbacks: string[] // Fallback product categories
  relatedConcerns: string[]  // Slugs of related concerns for cross-linking
  seo: {
    en: ConcernSeo
    ar: ConcernSeo
    ru: ConcernSeo
  }
  faq: {
    en: FaqItem[]
    ar: FaqItem[]
    ru: FaqItem[]
  }
}

export const CONCERN_PAGES: ConcernPage[] = [
  // ─── SUN PROTECTION ──────────────────────────────────────────
  {
    slug: 'sun-protection',
    concernKeys: ['sun-protection'],
    categoryFallbacks: ['sun', 'cushion bb'],
    relatedConcerns: ['pigmentation', 'sensitivity', 'anti-aging'],
    seo: {
      en: {
        title: 'Sun Protection Products UAE | SPF Sunscreen Dubai | GENOSYS',
        description: 'Professional Korean sun protection for UAE climate. GENOSYS SPF sunscreens protect against intense UV exposure in Dubai, Abu Dhabi & all emirates. Dermatologically tested, lightweight formulas. Free shipping over 1000 AED.',
        h1: 'Sun Protection for UAE Climate',
        intro: 'The UAE receives some of the highest UV radiation levels globally, making daily sun protection essential. GENOSYS professional sun creams are formulated with advanced Korean technology to provide broad-spectrum UV defense while keeping skin hydrated in hot, arid conditions. Our lightweight, non-greasy formulas are dermatologically tested and suitable for all skin types — designed specifically for professionals and consumers in Dubai, Abu Dhabi, Sharjah, and across the emirates.',
        keywords: ['sun protection UAE', 'sunscreen Dubai', 'SPF cream UAE', 'Korean sunscreen Dubai', 'UV protection UAE', 'sun cream Abu Dhabi', 'professional sunscreen UAE', 'GENOSYS sun cream'],
      },
      ar: {
        title: 'منتجات الحماية من الشمس الإمارات | واقي شمس دبي | GENOSYS',
        description: 'حماية احترافية من الشمس بتقنية كورية لمناخ الإمارات. واقيات شمس GENOSYS بعامل حماية SPF تحمي من الأشعة فوق البنفسجية في دبي وأبوظبي. توصيل مجاني للطلبات فوق 1000 درهم.',
        h1: 'الحماية من الشمس لمناخ الإمارات',
        intro: 'تتعرض الإمارات لأعلى مستويات الأشعة فوق البنفسجية عالمياً، مما يجعل الحماية اليومية من الشمس ضرورية. كريمات الشمس الاحترافية من GENOSYS مصنوعة بتقنية كورية متقدمة لتوفير حماية واسعة الطيف مع الحفاظ على ترطيب البشرة.',
        keywords: ['واقي شمس الإمارات', 'حماية الشمس دبي', 'كريم SPF الإمارات', 'واقي شمس كوري دبي'],
      },
      ru: {
        title: 'Солнцезащитные средства ОАЭ | SPF крем Дубай | GENOSYS',
        description: 'Профессиональная корейская защита от солнца для климата ОАЭ. Солнцезащитные кремы GENOSYS с SPF защитой от УФ-излучения в Дубае и Абу-Даби. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Защита от солнца для климата ОАЭ',
        intro: 'ОАЭ получают одни из самых высоких уровней УФ-излучения в мире, что делает ежедневную защиту от солнца необходимой. Профессиональные солнцезащитные кремы GENOSYS разработаны с применением передовых корейских технологий для обеспечения широкоспектральной защиты при сохранении увлажнения кожи.',
        keywords: ['солнцезащитный крем ОАЭ', 'защита от солнца Дубай', 'SPF крем ОАЭ', 'корейский санскрин Дубай'],
      },
    },
    faq: {
      en: [
        { question: 'What SPF level is recommended for UAE sun protection?', answer: 'In the UAE, dermatologists recommend SPF 50+ with broad-spectrum UVA/UVB protection for daily use. The UV index in Dubai regularly exceeds 11 (extreme), making high SPF essential year-round — not just in summer. GENOSYS sun creams provide professional-grade SPF protection designed for the intense Middle Eastern climate.' },
        { question: 'Can I use Korean sunscreen in hot UAE weather?', answer: 'Yes, Korean sunscreens are specifically engineered for hot, humid climates. GENOSYS sun creams use lightweight, non-greasy formulas that absorb quickly and stay effective even during perspiration. They are dermatologically tested and suitable for use under makeup or alone in UAE temperatures.' },
      ],
      ar: [
        { question: 'ما مستوى SPF الموصى به للحماية من الشمس في الإمارات؟', answer: 'في الإمارات، يوصي أطباء الجلدية باستخدام واقي شمس SPF 50+ مع حماية واسعة الطيف من الأشعة فوق البنفسجية للاستخدام اليومي. مؤشر الأشعة فوق البنفسجية في دبي يتجاوز بانتظام 11 (شديد)، مما يجعل الحماية العالية ضرورية طوال العام.' },
      ],
      ru: [
        { question: 'Какой уровень SPF рекомендуется для защиты от солнца в ОАЭ?', answer: 'В ОАЭ дерматологи рекомендуют SPF 50+ с широкоспектральной защитой от UVA/UVB для ежедневного использования. Индекс УФ-излучения в Дубае регулярно превышает 11 (экстремальный), что делает высокую защиту необходимой круглый год.' },
      ],
    },
  },

  // ─── ACNE TREATMENT ──────────────────────────────────────────
  {
    slug: 'acne-treatment',
    concernKeys: ['acne-blemishes'],
    categoryFallbacks: [],
    relatedConcerns: ['scars-treatment', 'pigmentation', 'sensitivity'],
    seo: {
      en: {
        title: 'Acne Treatment Products UAE | Blemish Control Dubai | GENOSYS',
        description: 'Professional Korean acne treatment solutions for UAE. GENOSYS problem control serums, creams & toners target breakouts, blemishes & oily skin. Dermatologically tested. Free shipping over 1000 AED.',
        h1: 'Acne & Blemish Treatment',
        intro: 'Acne and blemishes are among the most common skin concerns in the UAE, worsened by heat, humidity, and environmental factors. GENOSYS Intensive Problem Control line offers a clinically proven approach to acne management — professional-grade toners, serums, and creams that target breakouts at the source while protecting the skin barrier. Our Korean dermacosmetics use active ingredients like salicylic acid and niacinamide to control excess sebum, reduce inflammation, and prevent post-acne marks.',
        keywords: ['acne treatment UAE', 'acne skincare Dubai', 'blemish control UAE', 'Korean acne products', 'problem control serum', 'acne cream Dubai', 'professional acne treatment UAE'],
      },
      ar: {
        title: 'منتجات علاج حب الشباب الإمارات | مكافحة البثور دبي | GENOSYS',
        description: 'حلول احترافية كورية لعلاج حب الشباب في الإمارات. سيرومات وكريمات GENOSYS للتحكم في البثور والبشرة الدهنية. مختبرة طبياً. توصيل مجاني فوق 1000 درهم.',
        h1: 'علاج حب الشباب والبثور',
        intro: 'حب الشباب والبثور من أكثر مشاكل البشرة شيوعاً في الإمارات، وتتفاقم بسبب الحرارة والرطوبة والعوامل البيئية. خط GENOSYS للتحكم المكثف في المشاكل يقدم نهجاً مثبتاً سريرياً لإدارة حب الشباب.',
        keywords: ['علاج حب الشباب الإمارات', 'مكافحة البثور دبي', 'سيروم حب الشباب', 'منتجات كورية للبثور'],
      },
      ru: {
        title: 'Средства от акне ОАЭ | Лечение прыщей Дубай | GENOSYS',
        description: 'Профессиональные корейские средства от акне в ОАЭ. Сыворотки и кремы GENOSYS для контроля высыпаний и жирной кожи. Дерматологически протестированы. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Лечение акне и высыпаний',
        intro: 'Акне и высыпания — одни из самых распространённых проблем кожи в ОАЭ, усугубляемые жарой, влажностью и экологическими факторами. Линейка GENOSYS Intensive Problem Control предлагает клинически доказанный подход к лечению акне — профессиональные тоники, сыворотки и кремы.',
        keywords: ['средства от акне ОАЭ', 'лечение прыщей Дубай', 'корейская косметика от акне', 'сыворотка от высыпаний'],
      },
    },
    faq: {
      en: [
        { question: 'What is the best Korean treatment for acne in UAE?', answer: 'GENOSYS Intensive Problem Control line is specifically formulated for acne-prone skin. The Problem Control Serum and Problem Control Cream work together to reduce breakouts, control oil production, and minimize pore appearance. These products are used by professional dermatologists in Dubai clinics and are available for home use through genosys.ae.' },
        { question: 'Does humidity in Dubai make acne worse?', answer: 'Yes, high humidity combined with heat increases sebum production, clogging pores and triggering breakouts. GENOSYS Problem Control products contain oil-regulating active ingredients that work effectively in the UAE climate. The Intensive Problem Control Toner is particularly effective as a daily prep step to balance skin pH.' },
      ],
      ar: [
        { question: 'ما هو أفضل علاج كوري لحب الشباب في الإمارات؟', answer: 'خط GENOSYS للتحكم المكثف في المشاكل مصمم خصيصاً للبشرة المعرضة لحب الشباب. سيروم التحكم في المشاكل وكريم التحكم في المشاكل يعملان معاً لتقليل البثور والتحكم في إفراز الدهون.' },
      ],
      ru: [
        { question: 'Какое корейское средство от акне лучше всего подходит для ОАЭ?', answer: 'Линейка GENOSYS Intensive Problem Control специально разработана для кожи, склонной к акне. Сыворотка Problem Control и крем Problem Control работают вместе для уменьшения высыпаний и контроля выработки кожного сала.' },
      ],
    },
  },

  // ─── PIGMENTATION ──────────────────────────────────────────
  {
    slug: 'pigmentation',
    concernKeys: ['brightening'],
    categoryFallbacks: [],
    relatedConcerns: ['sun-protection', 'anti-aging', 'acne-treatment'],
    seo: {
      en: {
        title: 'Pigmentation Treatment UAE | Dark Spots & Brightening Dubai | GENOSYS',
        description: 'Professional Korean pigmentation treatment for UAE. GENOSYS brightening serums & creams reduce dark spots, hyperpigmentation & uneven skin tone. Dermatologically tested. Free shipping over 1000 AED.',
        h1: 'Pigmentation & Skin Brightening Treatment',
        intro: 'Hyperpigmentation and dark spots are extremely common in the UAE due to intense sun exposure throughout the year. GENOSYS Multi Vita Radiance line combines Korean brightening technology with powerful ingredients like vitamin C, niacinamide, and arbutin to visibly reduce melanin overproduction, even skin tone, and restore natural radiance. Our professional-grade brightening products are safe for all skin tones, including darker Fitzpatrick types common in the Middle East.',
        keywords: ['pigmentation treatment UAE', 'dark spots Dubai', 'skin brightening UAE', 'hyperpigmentation cream', 'Korean brightening serum', 'uneven skin tone Dubai', 'melasma treatment UAE'],
      },
      ar: {
        title: 'علاج التصبغات الإمارات | البقع الداكنة وتفتيح البشرة دبي | GENOSYS',
        description: 'علاج احترافي كوري للتصبغات في الإمارات. سيرومات وكريمات GENOSYS لتفتيح البشرة وتقليل البقع الداكنة. مختبرة طبياً. توصيل مجاني فوق 1000 درهم.',
        h1: 'علاج التصبغات وتفتيح البشرة',
        intro: 'فرط التصبغ والبقع الداكنة شائعة للغاية في الإمارات بسبب التعرض المكثف للشمس طوال العام. خط GENOSYS Multi Vita Radiance يجمع بين تقنية التفتيح الكورية ومكونات فعالة لتقليل إنتاج الميلانين الزائد وتوحيد لون البشرة.',
        keywords: ['علاج التصبغات الإمارات', 'البقع الداكنة دبي', 'تفتيح البشرة الإمارات', 'كريم تفتيح كوري'],
      },
      ru: {
        title: 'Лечение пигментации ОАЭ | Тёмные пятна и осветление Дубай | GENOSYS',
        description: 'Профессиональное корейское лечение пигментации в ОАЭ. Сыворотки и кремы GENOSYS для осветления кожи и уменьшения тёмных пятен. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Лечение пигментации и осветление кожи',
        intro: 'Гиперпигментация и тёмные пятна чрезвычайно распространены в ОАЭ из-за интенсивного солнечного воздействия в течение всего года. Линейка GENOSYS Multi Vita Radiance сочетает корейские технологии осветления с мощными ингредиентами для видимого уменьшения выработки меланина и выравнивания тона кожи.',
        keywords: ['лечение пигментации ОАЭ', 'тёмные пятна Дубай', 'осветление кожи ОАЭ', 'корейская сыворотка осветляющая'],
      },
    },
    faq: {
      en: [
        { question: 'What causes pigmentation in UAE and how to treat it?', answer: 'Pigmentation in the UAE is primarily caused by intense UV exposure (UV index regularly exceeds 11), hormonal changes, and post-inflammatory hyperpigmentation from acne. GENOSYS Multi Vita Radiance Serum and Cream contain vitamin C, niacinamide, and Korean brightening actives that inhibit melanin production and gradually fade existing dark spots. For best results, always combine with SPF 50+ sun protection.' },
        { question: 'Are Korean brightening products safe for dark skin tones?', answer: 'Yes, GENOSYS brightening products are formulated to be safe for all skin tones, including Fitzpatrick types IV-VI common in the Middle East. They work by regulating melanin production rather than bleaching, making them safer and more effective for long-term use. All products are dermatologically tested.' },
      ],
      ar: [
        { question: 'ما أسباب التصبغات في الإمارات وكيفية علاجها؟', answer: 'التصبغات في الإمارات ناتجة بشكل رئيسي عن التعرض المكثف للأشعة فوق البنفسجية والتغيرات الهرمونية. سيروم وكريم GENOSYS Multi Vita Radiance يحتويان على فيتامين سي ونياسيناميد لتقليل إنتاج الميلانين وتفتيح البقع الداكنة تدريجياً.' },
      ],
      ru: [
        { question: 'Что вызывает пигментацию в ОАЭ и как её лечить?', answer: 'Пигментация в ОАЭ в основном вызвана интенсивным УФ-воздействием, гормональными изменениями и поствоспалительной гиперпигментацией. Сыворотка и крем GENOSYS Multi Vita Radiance содержат витамин С и ниацинамид для регулирования выработки меланина и постепенного осветления тёмных пятен.' },
      ],
    },
  },

  // ─── SCARS TREATMENT ──────────────────────────────────────────
  {
    slug: 'scars-treatment',
    concernKeys: ['acne-blemishes', 'anti-aging'],
    categoryFallbacks: ['microneedling', 'device'],
    relatedConcerns: ['acne-treatment', 'pigmentation', 'anti-aging'],
    seo: {
      en: {
        title: 'Scars Treatment UAE | Acne Scars & Microneedling Dubai | GENOSYS',
        description: 'Professional scar treatment solutions in UAE. GENOSYS microneedling devices & repair serums for acne scars, surgical scars & skin texture. Used by Dubai dermatologists. Free shipping over 1000 AED.',
        h1: 'Scar Treatment & Skin Repair',
        intro: 'Scar treatment requires a multi-faceted approach combining professional devices with targeted skincare. GENOSYS offers industry-leading microneedling devices (Needle Pen-K, Microneedle Roller) alongside repair serums and post-treatment creams that accelerate skin regeneration. Our microneedling technology creates controlled micro-channels that trigger the skin\'s natural collagen production, effectively improving the appearance of acne scars, surgical scars, and uneven texture. These same devices and protocols are used by licensed dermatologists across Dubai, Abu Dhabi, and Sharjah.',
        keywords: ['scar treatment UAE', 'acne scars Dubai', 'microneedling scars UAE', 'scar removal Dubai', 'Korean scar treatment', 'microneedling devices UAE', 'post-acne scars treatment'],
      },
      ar: {
        title: 'علاج الندبات الإمارات | ندبات حب الشباب والوخز بالإبر الدقيقة دبي | GENOSYS',
        description: 'حلول احترافية لعلاج الندبات في الإمارات. أجهزة الوخز بالإبر الدقيقة وسيرومات الإصلاح من GENOSYS لندبات حب الشباب وتحسين ملمس البشرة. توصيل مجاني فوق 1000 درهم.',
        h1: 'علاج الندبات وإصلاح البشرة',
        intro: 'يتطلب علاج الندبات نهجاً متعدد الجوانب يجمع بين الأجهزة المهنية والعناية المستهدفة بالبشرة. تقدم GENOSYS أجهزة وخز بالإبر الدقيقة رائدة مع سيرومات إصلاح وكريمات ما بعد العلاج لتسريع تجديد البشرة.',
        keywords: ['علاج الندبات الإمارات', 'ندبات حب الشباب دبي', 'الوخز بالإبر الدقيقة للندبات', 'إزالة الندبات دبي'],
      },
      ru: {
        title: 'Лечение рубцов ОАЭ | Постакне и микронидлинг Дубай | GENOSYS',
        description: 'Профессиональные средства от рубцов в ОАЭ. Устройства для микронидлинга и восстанавливающие сыворотки GENOSYS для лечения рубцов от акне. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Лечение рубцов и восстановление кожи',
        intro: 'Лечение рубцов требует комплексного подхода, сочетающего профессиональные устройства с целенаправленным уходом за кожей. GENOSYS предлагает ведущие устройства для микронидлинга вместе с восстанавливающими сыворотками и кремами для ускорения регенерации кожи.',
        keywords: ['лечение рубцов ОАЭ', 'постакне Дубай', 'микронидлинг рубцы ОАЭ', 'удаление рубцов Дубай'],
      },
    },
    faq: {
      en: [
        { question: 'Can microneedling remove acne scars?', answer: 'Yes, microneedling is one of the most effective treatments for acne scars. GENOSYS microneedling devices create thousands of micro-channels in the skin, triggering natural collagen and elastin production that fills in scar tissue over multiple sessions. Clinical studies show 60-80% improvement in scar appearance after 3-6 sessions. GENOSYS also provides post-treatment serums (Power Solutions) that accelerate healing and maximize results.' },
        { question: 'What GENOSYS products are best for scar treatment at home?', answer: 'For home scar treatment, we recommend the GENOSYS Microneedle Roller combined with the Soothing Repair Postcream and EGF Repair Oxymask Cream. The roller creates micro-channels for better product absorption, while the repair creams contain EGF (Epidermal Growth Factor) that promotes skin cell regeneration. For professional-grade treatment, the Needle Pen-K device is used by licensed practitioners in UAE clinics.' },
      ],
      ar: [
        { question: 'هل يمكن للوخز بالإبر الدقيقة إزالة ندبات حب الشباب؟', answer: 'نعم، الوخز بالإبر الدقيقة من أكثر العلاجات فعالية لندبات حب الشباب. أجهزة GENOSYS تحفز إنتاج الكولاجين الطبيعي لملء الأنسجة الندبية. الدراسات تظهر تحسناً بنسبة 60-80٪ بعد 3-6 جلسات.' },
      ],
      ru: [
        { question: 'Может ли микронидлинг убрать рубцы от акне?', answer: 'Да, микронидлинг — одна из самых эффективных процедур для лечения рубцов от акне. Устройства GENOSYS создают тысячи микроканалов в коже, стимулируя естественную выработку коллагена. Клинические исследования показывают улучшение на 60-80% после 3-6 сеансов.' },
      ],
    },
  },

  // ─── HAIR LOSS ──────────────────────────────────────────
  {
    slug: 'hair-loss',
    concernKeys: ['hair'],
    categoryFallbacks: ['scalp-hair'],
    relatedConcerns: ['sensitivity', 'anti-aging'],
    seo: {
      en: {
        title: 'Hair Loss Treatment UAE | Scalp Care & Hair Growth Dubai | GENOSYS',
        description: 'Professional Korean hair loss treatment solutions in UAE. GENOSYS scalp care products & microneedling devices for hair growth stimulation. Used by Dubai trichologists. Free shipping over 1000 AED.',
        h1: 'Hair Loss Treatment & Scalp Care',
        intro: 'Hair loss is a significant concern in the UAE, affecting both men and women due to stress, vitamin D deficiency from indoor lifestyles, heat exposure, and hard water. GENOSYS offers a professional scalp and hair care range that combines Korean trichology research with clinical-grade ingredients to strengthen hair follicles, stimulate growth, and improve scalp health. Our microneedling devices can also be used on the scalp to enhance product absorption and stimulate dormant follicles — a technique increasingly recommended by Dubai trichologists.',
        keywords: ['hair loss treatment UAE', 'hair growth Dubai', 'scalp care UAE', 'Korean hair loss products', 'hair thinning Dubai', 'trichology UAE', 'microneedling hair growth'],
      },
      ar: {
        title: 'علاج تساقط الشعر الإمارات | العناية بفروة الرأس ونمو الشعر دبي | GENOSYS',
        description: 'حلول احترافية كورية لعلاج تساقط الشعر في الإمارات. منتجات العناية بفروة الرأس وأجهزة التحفيز من GENOSYS. توصيل مجاني فوق 1000 درهم.',
        h1: 'علاج تساقط الشعر والعناية بفروة الرأس',
        intro: 'تساقط الشعر مشكلة شائعة في الإمارات تؤثر على الرجال والنساء بسبب الإجهاد ونقص فيتامين د والتعرض للحرارة والمياه العسرة. تقدم GENOSYS مجموعة احترافية للعناية بفروة الرأس والشعر تجمع بين أبحاث علم الشعر الكورية ومكونات طبية.',
        keywords: ['علاج تساقط الشعر الإمارات', 'نمو الشعر دبي', 'العناية بفروة الرأس', 'منتجات كورية للشعر'],
      },
      ru: {
        title: 'Лечение выпадения волос ОАЭ | Уход за кожей головы Дубай | GENOSYS',
        description: 'Профессиональные корейские средства от выпадения волос в ОАЭ. Продукты GENOSYS для ухода за кожей головы и стимуляции роста волос. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Лечение выпадения волос и уход за кожей головы',
        intro: 'Выпадение волос — серьёзная проблема в ОАЭ, затрагивающая мужчин и женщин из-за стресса, дефицита витамина D, воздействия жары и жёсткой воды. GENOSYS предлагает профессиональную линейку для ухода за кожей головы и волосами, сочетающую корейские исследования в трихологии с клиническими ингредиентами.',
        keywords: ['выпадение волос ОАЭ', 'рост волос Дубай', 'уход за кожей головы ОАЭ', 'корейские средства для волос'],
      },
    },
    faq: {
      en: [
        { question: 'What causes hair loss in UAE and how to treat it?', answer: 'Hair loss in the UAE is commonly caused by extreme heat exposure, vitamin D deficiency (ironically, due to indoor lifestyles avoiding the sun), hard water with high mineral content, stress, and hormonal factors. GENOSYS scalp care products address these issues with Korean formulations that nourish hair follicles, improve scalp circulation, and strengthen existing hair. Microneedling on the scalp is also an effective technique to stimulate dormant follicles.' },
        { question: 'Can microneedling help with hair growth?', answer: 'Yes, scalp microneedling is clinically proven to stimulate hair growth. GENOSYS microneedling devices create micro-channels in the scalp that increase blood flow to hair follicles and enhance absorption of growth-stimulating ingredients. Studies show microneedling combined with topical treatments can increase hair count by up to 20% after 12 weeks of regular use.' },
      ],
      ar: [
        { question: 'ما أسباب تساقط الشعر في الإمارات وكيفية علاجه؟', answer: 'تساقط الشعر في الإمارات ناتج عادة عن التعرض الشديد للحرارة ونقص فيتامين د والمياه العسرة والإجهاد. منتجات GENOSYS للعناية بفروة الرأس تعالج هذه المشاكل بتركيبات كورية تغذي بصيلات الشعر وتحسن الدورة الدموية.' },
      ],
      ru: [
        { question: 'Что вызывает выпадение волос в ОАЭ и как его лечить?', answer: 'Выпадение волос в ОАЭ обычно вызвано воздействием экстремальной жары, дефицитом витамина D, жёсткой водой, стрессом и гормональными факторами. Продукты GENOSYS для кожи головы решают эти проблемы корейскими формулами, питающими волосяные фолликулы и улучшающими кровообращение.' },
      ],
    },
  },

  // ─── ANTI-AGING ──────────────────────────────────────────
  {
    slug: 'anti-aging',
    concernKeys: ['anti-aging'],
    categoryFallbacks: [],
    relatedConcerns: ['hydration', 'pigmentation', 'sun-protection'],
    seo: {
      en: {
        title: 'Anti-Aging Skincare UAE | Wrinkle Treatment Dubai | GENOSYS',
        description: 'Professional Korean anti-aging skincare for UAE. GENOSYS anti-wrinkle serums, creams & EGF treatments with peptides and growth factors. Used by Dubai dermatologists. Free shipping over 1000 AED.',
        h1: 'Anti-Aging & Wrinkle Treatment',
        intro: 'Premature aging is accelerated in the UAE by intense UV radiation, air conditioning, and desert climate. GENOSYS anti-aging line harnesses breakthrough Korean ingredients — EGF (Epidermal Growth Factor), peptide complexes, and advanced retinoid alternatives — to visibly reduce fine lines, deep wrinkles, and loss of firmness. Our ND Cell and Multi Functional Anti-Wrinkle ranges are used by licensed dermatologists in professional settings and are also available for home use, delivering clinical-grade results.',
        keywords: ['anti-aging skincare UAE', 'wrinkle treatment Dubai', 'Korean anti-aging cream', 'EGF skincare UAE', 'peptide serum Dubai', 'anti-wrinkle products UAE', 'GENOSYS anti-aging'],
      },
      ar: {
        title: 'العناية بالبشرة المضادة للشيخوخة الإمارات | علاج التجاعيد دبي | GENOSYS',
        description: 'عناية احترافية كورية مضادة للشيخوخة في الإمارات. سيرومات وكريمات GENOSYS المضادة للتجاعيد مع البيبتيدات وعوامل النمو. توصيل مجاني فوق 1000 درهم.',
        h1: 'مكافحة الشيخوخة وعلاج التجاعيد',
        intro: 'الشيخوخة المبكرة تتسارع في الإمارات بسبب الأشعة فوق البنفسجية المكثفة والتكييف والمناخ الصحراوي. خط GENOSYS المضاد للشيخوخة يستخدم مكونات كورية متطورة لتقليل الخطوط الدقيقة والتجاعيد العميقة بشكل ملحوظ.',
        keywords: ['مكافحة الشيخوخة الإمارات', 'علاج التجاعيد دبي', 'كريم مضاد للتجاعيد كوري', 'سيروم بيبتيد دبي'],
      },
      ru: {
        title: 'Антивозрастной уход ОАЭ | Лечение морщин Дубай | GENOSYS',
        description: 'Профессиональный корейский антивозрастной уход в ОАЭ. Сыворотки и кремы GENOSYS с пептидами и факторами роста. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Антивозрастной уход и лечение морщин',
        intro: 'Преждевременное старение ускоряется в ОАЭ из-за интенсивного УФ-излучения, кондиционирования воздуха и пустынного климата. Антивозрастная линейка GENOSYS использует прорывные корейские ингредиенты — EGF, пептидные комплексы и альтернативы ретиноидам — для видимого уменьшения морщин и потери упругости.',
        keywords: ['антивозрастной уход ОАЭ', 'лечение морщин Дубай', 'корейский крем от морщин', 'пептидная сыворотка Дубай'],
      },
    },
    faq: {
      en: [
        { question: 'What Korean ingredients are best for anti-aging?', answer: 'The most effective Korean anti-aging ingredients include EGF (Epidermal Growth Factor) which stimulates cell renewal, peptide complexes that boost collagen production, adenosine for wrinkle reduction, and snail mucin for deep hydration and repair. GENOSYS products feature clinical concentrations of these ingredients — particularly the ND Cell Anti-Wrinkle Cream and Multi Functional Anti-Wrinkle Serum, which are among the strongest professional formulations available in the UAE.' },
        { question: 'Why does skin age faster in UAE?', answer: 'Skin ages faster in the UAE due to three main factors: extreme UV radiation (UV index 11+ most of the year) which breaks down collagen, constant air conditioning that dehydrates skin, and desert winds with fine particles. Professional-grade sun protection combined with EGF and peptide treatments can significantly slow this process. GENOSYS recommends a daily routine of SPF 50+ sunscreen, antioxidant serum, and anti-wrinkle cream.' },
      ],
      ar: [
        { question: 'ما هي أفضل المكونات الكورية لمكافحة الشيخوخة؟', answer: 'أكثر المكونات الكورية فعالية لمكافحة الشيخوخة تشمل EGF الذي يحفز تجديد الخلايا، ومركبات البيبتيد التي تعزز إنتاج الكولاجين، والأدينوزين لتقليل التجاعيد. منتجات GENOSYS تحتوي على تركيزات طبية من هذه المكونات.' },
      ],
      ru: [
        { question: 'Какие корейские ингредиенты лучше всего для антивозрастного ухода?', answer: 'Наиболее эффективные корейские антивозрастные ингредиенты включают EGF (эпидермальный фактор роста), пептидные комплексы для стимуляции коллагена, аденозин для уменьшения морщин и муцин улитки для глубокого увлажнения. Продукты GENOSYS содержат клинические концентрации этих ингредиентов.' },
      ],
    },
  },

  // ─── HYDRATION ──────────────────────────────────────────
  {
    slug: 'hydration',
    concernKeys: ['hydration'],
    categoryFallbacks: [],
    relatedConcerns: ['sensitivity', 'anti-aging', 'sun-protection'],
    seo: {
      en: {
        title: 'Hydrating Skincare UAE | Moisturizer & Hyaluronic Acid Dubai | GENOSYS',
        description: 'Professional Korean hydrating skincare for UAE dry climate. GENOSYS hyaluronic acid serums, moisture creams & hydrating masks. Combat air conditioning dehydration. Free shipping over 1000 AED.',
        h1: 'Hydrating Skincare for Dry UAE Climate',
        intro: 'The UAE\'s desert climate combined with constant air conditioning creates a dual dehydration challenge that strips skin of moisture throughout the day. GENOSYS Moisture Replenishing line uses multi-weight hyaluronic acid technology — combining low, medium, and high molecular weight HA — to deliver hydration to every layer of the skin. Our Korean formulations go beyond surface-level moisturizing, reinforcing the skin barrier to lock in moisture even in the most arid conditions.',
        keywords: ['hydrating skincare UAE', 'moisturizer Dubai', 'hyaluronic acid UAE', 'dry skin Dubai', 'Korean moisturizer UAE', 'dehydrated skin treatment', 'GENOSYS hydration'],
      },
      ar: {
        title: 'العناية الترطيبية بالبشرة الإمارات | مرطب وحمض الهيالورونيك دبي | GENOSYS',
        description: 'عناية كورية احترافية بالترطيب لمناخ الإمارات الجاف. سيرومات حمض الهيالورونيك وكريمات الترطيب من GENOSYS. توصيل مجاني فوق 1000 درهم.',
        h1: 'عناية ترطيبية للبشرة في مناخ الإمارات الجاف',
        intro: 'المناخ الصحراوي في الإمارات مع التكييف المستمر يخلق تحدي جفاف مزدوج يسلب البشرة رطوبتها. خط GENOSYS لتجديد الرطوبة يستخدم تقنية حمض الهيالورونيك متعدد الأوزان لتوصيل الترطيب لكل طبقات البشرة.',
        keywords: ['ترطيب البشرة الإمارات', 'مرطب دبي', 'حمض الهيالورونيك الإمارات', 'البشرة الجافة دبي'],
      },
      ru: {
        title: 'Увлажняющий уход ОАЭ | Гиалуроновая кислота и увлажнение Дубай | GENOSYS',
        description: 'Профессиональный корейский увлажняющий уход для сухого климата ОАЭ. Сыворотки с гиалуроновой кислотой и увлажняющие кремы GENOSYS. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Увлажняющий уход для сухого климата ОАЭ',
        intro: 'Пустынный климат ОАЭ в сочетании с постоянным кондиционированием создаёт двойную проблему обезвоживания. Линейка GENOSYS Moisture Replenishing использует технологию мультивесовой гиалуроновой кислоты для доставки увлажнения на каждый уровень кожи.',
        keywords: ['увлажнение кожи ОАЭ', 'увлажняющий крем Дубай', 'гиалуроновая кислота ОАЭ', 'сухая кожа Дубай'],
      },
    },
    faq: {
      en: [
        { question: 'Why is skin so dry in UAE despite the humidity?', answer: 'While coastal UAE cities have outdoor humidity, the real dehydration comes from spending 80%+ of time in air-conditioned environments that have humidity below 20%. This constant cycle of hot outdoor air and cold dry indoor air disrupts the skin barrier. GENOSYS Moisture Replenishing Hyaluron Serum uses triple-weight hyaluronic acid to hydrate all skin layers, while the Skin Barrier Protecting Cream seals in moisture to withstand the air conditioning cycle.' },
        { question: 'What is the best Korean moisturizer for Dubai climate?', answer: 'For Dubai\'s unique climate, we recommend a layered approach: GENOSYS Moisture Replenishing Hyaluron Serum (lightweight, penetrating hydration) under GENOSYS Intensive Hydro Soothing Cream (rich barrier protection). This combination provides all-day moisture even in heavily air-conditioned offices. For extra hydration, the Skin Rescue Overnight Cream Mask can be used 2-3 times weekly.' },
      ],
      ar: [
        { question: 'لماذا تجف البشرة في الإمارات رغم الرطوبة؟', answer: 'رغم رطوبة الهواء الخارجي، الجفاف الحقيقي يأتي من قضاء أكثر من 80٪ من الوقت في بيئات مكيفة بنسبة رطوبة أقل من 20٪. سيروم GENOSYS بحمض الهيالورونيك ثلاثي الوزن يرطب جميع طبقات البشرة ويقاوم جفاف التكييف.' },
      ],
      ru: [
        { question: 'Почему кожа так сохнет в ОАЭ несмотря на влажность?', answer: 'Хотя прибрежные города ОАЭ имеют высокую влажность на улице, реальное обезвоживание происходит от проведения 80%+ времени в кондиционированных помещениях с влажностью ниже 20%. Сыворотка GENOSYS с тройной гиалуроновой кислотой увлажняет все слои кожи и противостоит сухости кондиционеров.' },
      ],
    },
  },

  // ─── SENSITIVITY ──────────────────────────────────────────
  {
    slug: 'sensitivity',
    concernKeys: ['sensitivity'],
    categoryFallbacks: [],
    relatedConcerns: ['hydration', 'sun-protection', 'acne-treatment'],
    seo: {
      en: {
        title: 'Sensitive Skin Care UAE | Soothing Skincare Dubai | GENOSYS',
        description: 'Professional Korean sensitive skin care for UAE. GENOSYS soothing serums, barrier creams & calming masks for reactive and irritated skin. Dermatologically tested. Free shipping over 1000 AED.',
        h1: 'Sensitive Skin Care & Soothing Treatment',
        intro: 'Sensitive and reactive skin is increasingly common in the UAE due to extreme temperature shifts (hot outdoors, cold air conditioning), pollution, hard water, and harsh UV exposure. GENOSYS offers a dedicated range of soothing and barrier-repair products designed for even the most reactive skin types. Our All For Sensitive line uses gentle yet effective Korean ingredients — centella asiatica, panthenol, and ceramides — to calm inflammation, reduce redness, and rebuild the skin barrier without irritation.',
        keywords: ['sensitive skin care UAE', 'soothing skincare Dubai', 'reactive skin treatment UAE', 'Korean sensitive skin products', 'calming cream Dubai', 'skin barrier repair UAE'],
      },
      ar: {
        title: 'العناية بالبشرة الحساسة الإمارات | منتجات مهدئة للبشرة دبي | GENOSYS',
        description: 'عناية كورية احترافية بالبشرة الحساسة في الإمارات. سيرومات مهدئة وكريمات حماية الحاجز من GENOSYS. مختبرة طبياً. توصيل مجاني فوق 1000 درهم.',
        h1: 'العناية بالبشرة الحساسة والعلاج المهدئ',
        intro: 'البشرة الحساسة والمتفاعلة أصبحت شائعة بشكل متزايد في الإمارات بسبب التحولات الحرارية الشديدة والتلوث والمياه العسرة. تقدم GENOSYS مجموعة مخصصة من المنتجات المهدئة وإصلاح حاجز البشرة.',
        keywords: ['العناية بالبشرة الحساسة الإمارات', 'منتجات مهدئة دبي', 'علاج البشرة المتفاعلة', 'كريم مهدئ كوري'],
      },
      ru: {
        title: 'Уход за чувствительной кожей ОАЭ | Успокаивающие средства Дубай | GENOSYS',
        description: 'Профессиональный корейский уход за чувствительной кожей в ОАЭ. Успокаивающие сыворотки и барьерные кремы GENOSYS. Дерматологически протестированы. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Уход за чувствительной кожей',
        intro: 'Чувствительная и реактивная кожа всё чаще встречается в ОАЭ из-за резких перепадов температуры, загрязнения, жёсткой воды и агрессивного УФ-излучения. GENOSYS предлагает специальную линейку успокаивающих средств и средств для восстановления кожного барьера.',
        keywords: ['чувствительная кожа ОАЭ', 'успокаивающий уход Дубай', 'реактивная кожа ОАЭ', 'корейский крем для чувствительной кожи'],
      },
    },
    faq: {
      en: [
        { question: 'Why is sensitive skin so common in UAE?', answer: 'Sensitive skin is extremely prevalent in the UAE due to the constant cycle of extreme heat outdoors (40-50°C in summer) and cold air conditioning indoors (18-22°C). This temperature shock weakens the skin barrier over time. Additionally, hard water in many areas of Dubai and Abu Dhabi strips natural oils, and high UV index causes chronic low-grade inflammation. GENOSYS sensitive skin products are specifically formulated to address these UAE-specific triggers.' },
        { question: 'What Korean products are best for sensitive skin?', answer: 'GENOSYS All For Sensitive Serum is the cornerstone product — it contains centella asiatica and panthenol to calm inflammation without irritating active ingredients. Follow with the Soothing Repair Postcream for barrier repair, and the Skin Barrier Protecting Cream for daily protection. The GENOSYS Hydro Cool Modeling Mask provides instant soothing relief for acute sensitivity episodes.' },
      ],
      ar: [
        { question: 'لماذا البشرة الحساسة شائعة جداً في الإمارات؟', answer: 'البشرة الحساسة منتشرة في الإمارات بسبب التحول المستمر بين الحرارة الشديدة والتكييف البارد. هذه الصدمة الحرارية تضعف حاجز البشرة. منتجات GENOSYS للبشرة الحساسة مصممة خصيصاً لمعالجة محفزات البشرة في الإمارات.' },
      ],
      ru: [
        { question: 'Почему чувствительная кожа так распространена в ОАЭ?', answer: 'Чувствительная кожа чрезвычайно распространена в ОАЭ из-за постоянных перепадов температуры между жарой на улице и холодным кондиционером, жёсткой воды и высокого УФ-индекса. Продукты GENOSYS для чувствительной кожи специально разработаны для этих факторов.' },
      ],
    },
  },
]

/**
 * Category pages data for SEO landing pages
 */
export interface CategoryPage {
  slug: string
  categoryKey: string        // Maps to product.category field
  seo: {
    en: { title: string; description: string; h1: string }
    ar: { title: string; description: string; h1: string }
    ru: { title: string; description: string; h1: string }
  }
}

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    slug: 'microneedling',
    categoryKey: 'microneedling',
    seo: {
      en: { title: 'Microneedling Devices UAE | Professional Derma Pen Dubai | GENOSYS', description: 'Professional microneedling devices from GENOSYS. Needle Pen-K, Microneedle Rollers & LED devices for clinics and home use in UAE. Free shipping over 1000 AED.', h1: 'Professional Microneedling Devices' },
      ar: { title: 'أجهزة الوخز بالإبر الدقيقة الإمارات | قلم ديرما احترافي دبي | GENOSYS', description: 'أجهزة وخز بالإبر الدقيقة احترافية من GENOSYS. توصيل مجاني فوق 1000 درهم.', h1: 'أجهزة الوخز بالإبر الدقيقة الاحترافية' },
      ru: { title: 'Аппараты для микронидлинга ОАЭ | Дерма-ручка Дубай | GENOSYS', description: 'Профессиональные устройства для микронидлинга GENOSYS. Бесплатная доставка от 1000 дирхамов.', h1: 'Профессиональные аппараты для микронидлинга' },
    },
  },
  {
    slug: 'pro-solution',
    categoryKey: 'pro-solution',
    seo: {
      en: { title: 'PRO Solution Serums UAE | Professional Microneedling Serums Dubai | GENOSYS', description: 'GENOSYS PRO Solution power serums for professional microneedling treatments. HES, CVS, CTS, PCS, SWS & AWS formulas. Used by UAE dermatologists.', h1: 'PRO Solution Power Serums' },
      ar: { title: 'سيرومات PRO Solution الإمارات | سيرومات الوخز الاحترافية دبي | GENOSYS', description: 'سيرومات GENOSYS PRO Solution للعلاجات الاحترافية بالوخز بالإبر الدقيقة.', h1: 'سيرومات PRO Solution القوية' },
      ru: { title: 'PRO Solution сыворотки ОАЭ | Профессиональные сыворотки Дубай | GENOSYS', description: 'Сыворотки GENOSYS PRO Solution для профессиональных процедур микронидлинга.', h1: 'Сыворотки PRO Solution' },
    },
  },
  {
    slug: 'cleanser',
    categoryKey: 'cleanser',
    seo: {
      en: { title: 'Face Cleansers UAE | Korean Cleanser Dubai | GENOSYS', description: 'GENOSYS professional Korean face cleansers for UAE. Gentle yet effective formulas for all skin types. Free shipping over 1000 AED.', h1: 'Face Cleansers' },
      ar: { title: 'غسول الوجه الإمارات | غسول كوري دبي | GENOSYS', description: 'غسول الوجه الاحترافي الكوري من GENOSYS. تركيبات لطيفة وفعالة لجميع أنواع البشرة.', h1: 'غسول الوجه' },
      ru: { title: 'Очищающие средства ОАЭ | Корейский клинзер Дубай | GENOSYS', description: 'Профессиональные корейские очищающие средства GENOSYS. Бесплатная доставка от 1000 дирхамов.', h1: 'Очищающие средства для лица' },
    },
  },
  {
    slug: 'peeling',
    categoryKey: 'peeling',
    seo: {
      en: { title: 'Face Peeling Products UAE | Exfoliating Gel Dubai | GENOSYS', description: 'GENOSYS professional peeling products for UAE. Gentle exfoliating gels and renewal systems for brighter, smoother skin. Free shipping over 1000 AED.', h1: 'Peeling & Exfoliation' },
      ar: { title: 'منتجات تقشير الوجه الإمارات | جل تقشير دبي | GENOSYS', description: 'منتجات التقشير الاحترافية من GENOSYS لبشرة أكثر إشراقاً ونعومة.', h1: 'التقشير والتجديد' },
      ru: { title: 'Пилинг для лица ОАЭ | Отшелушивающий гель Дубай | GENOSYS', description: 'Профессиональные пилинги GENOSYS для более яркой и гладкой кожи.', h1: 'Пилинг и отшелушивание' },
    },
  },
  {
    slug: 'toner-mist',
    categoryKey: 'toner-mist',
    seo: {
      en: { title: 'Face Toners & Mists UAE | Korean Toner Dubai | GENOSYS', description: 'GENOSYS professional toners and facial mists for UAE. Hydrating, balancing and refreshing formulas. Free shipping over 1000 AED.', h1: 'Toners & Facial Mists' },
      ar: { title: 'تونر ورذاذ الوجه الإمارات | تونر كوري دبي | GENOSYS', description: 'تونر ورذاذ الوجه الاحترافي من GENOSYS. تركيبات مرطبة ومتوازنة.', h1: 'التونر ورذاذ الوجه' },
      ru: { title: 'Тоники и мисты ОАЭ | Корейский тонер Дубай | GENOSYS', description: 'Профессиональные тоники и мисты GENOSYS для увлажнения и баланса кожи.', h1: 'Тоники и мисты для лица' },
    },
  },
  {
    slug: 'serum',
    categoryKey: 'serum',
    seo: {
      en: { title: 'Face Serums UAE | Korean Serum Dubai | GENOSYS', description: 'GENOSYS professional Korean face serums for UAE. Anti-aging, brightening, hydrating & problem control formulas. Free shipping over 1000 AED.', h1: 'Professional Face Serums' },
      ar: { title: 'سيروم الوجه الإمارات | سيروم كوري دبي | GENOSYS', description: 'سيرومات الوجه الاحترافية الكورية من GENOSYS. مكافحة الشيخوخة والتفتيح والترطيب.', h1: 'سيرومات الوجه الاحترافية' },
      ru: { title: 'Сыворотки для лица ОАЭ | Корейские серумы Дубай | GENOSYS', description: 'Профессиональные корейские сыворотки GENOSYS. Антивозрастные, осветляющие и увлажняющие.', h1: 'Профессиональные сыворотки для лица' },
    },
  },
  {
    slug: 'cream',
    categoryKey: 'cream',
    seo: {
      en: { title: 'Face Creams UAE | Korean Moisturizer Dubai | GENOSYS', description: 'GENOSYS professional Korean face creams for UAE. Anti-wrinkle, soothing, hydrating & problem control creams. Free shipping over 1000 AED.', h1: 'Professional Face Creams' },
      ar: { title: 'كريم الوجه الإمارات | مرطب كوري دبي | GENOSYS', description: 'كريمات الوجه الاحترافية الكورية من GENOSYS. مضادة للتجاعيد ومهدئة ومرطبة.', h1: 'كريمات الوجه الاحترافية' },
      ru: { title: 'Кремы для лица ОАЭ | Корейский крем Дубай | GENOSYS', description: 'Профессиональные корейские кремы GENOSYS. Антивозрастные, увлажняющие и успокаивающие.', h1: 'Профессиональные кремы для лица' },
    },
  },
  {
    slug: 'mask',
    categoryKey: 'mask',
    seo: {
      en: { title: 'Face Masks UAE | Korean Sheet Mask Dubai | GENOSYS', description: 'GENOSYS professional Korean face masks for UAE. Hydrating, soothing, anti-aging & modeling masks. Free shipping over 1000 AED.', h1: 'Professional Face Masks' },
      ar: { title: 'أقنعة الوجه الإمارات | ماسك كوري دبي | GENOSYS', description: 'أقنعة الوجه الاحترافية الكورية من GENOSYS. أقنعة مرطبة ومهدئة ومضادة للشيخوخة.', h1: 'أقنعة الوجه الاحترافية' },
      ru: { title: 'Маски для лица ОАЭ | Корейские маски Дубай | GENOSYS', description: 'Профессиональные корейские маски GENOSYS для лица. Увлажняющие, успокаивающие и антивозрастные.', h1: 'Профессиональные маски для лица' },
    },
  },
  {
    slug: 'sun',
    categoryKey: 'sun',
    seo: {
      en: { title: 'Sun Protection Cream UAE | SPF Sunscreen Dubai | GENOSYS', description: 'GENOSYS professional SPF sun creams for UAE intense climate. Broad-spectrum UV protection. Free shipping over 1000 AED.', h1: 'Sun Protection Creams' },
      ar: { title: 'كريم الحماية من الشمس الإمارات | واقي شمس SPF دبي | GENOSYS', description: 'كريمات الحماية من الشمس SPF الاحترافية من GENOSYS لمناخ الإمارات.', h1: 'كريمات الحماية من الشمس' },
      ru: { title: 'Солнцезащитный крем ОАЭ | SPF санскрин Дубай | GENOSYS', description: 'Профессиональные солнцезащитные кремы GENOSYS SPF для климата ОАЭ.', h1: 'Солнцезащитные кремы' },
    },
  },
  {
    slug: 'cushion-bb',
    categoryKey: 'cushion-bb',
    seo: {
      en: { title: 'BB Cushion UAE | Korean BB Cream Dubai | GENOSYS', description: 'GENOSYS BB Cushion and Blemish Balm for flawless coverage with skincare benefits. Korean formula. Free shipping over 1000 AED.', h1: 'BB Cushion & Blemish Balm' },
      ar: { title: 'كوشن BB الإمارات | كريم BB كوري دبي | GENOSYS', description: 'كوشن BB وبلسم العيوب من GENOSYS لتغطية مثالية مع فوائد العناية بالبشرة.', h1: 'كوشن BB وبلسم العيوب' },
      ru: { title: 'BB Кушон ОАЭ | Корейский ББ крем Дубай | GENOSYS', description: 'BB Кушон и бальзам GENOSYS для безупречного покрытия с уходовыми свойствами.', h1: 'BB Кушон и бальзам' },
    },
  },
  {
    slug: 'scalp-hair',
    categoryKey: 'scalp-hair',
    seo: {
      en: { title: 'Scalp & Hair Care UAE | Hair Treatment Dubai | GENOSYS', description: 'GENOSYS professional scalp and hair care products for UAE. Combat hair loss and improve scalp health. Free shipping over 1000 AED.', h1: 'Scalp & Hair Care' },
      ar: { title: 'العناية بفروة الرأس والشعر الإمارات | علاج الشعر دبي | GENOSYS', description: 'منتجات العناية بفروة الرأس والشعر الاحترافية من GENOSYS.', h1: 'العناية بفروة الرأس والشعر' },
      ru: { title: 'Уход за кожей головы и волосами ОАЭ | Лечение волос Дубай | GENOSYS', description: 'Профессиональные средства GENOSYS для ухода за кожей головы и волосами.', h1: 'Уход за кожей головы и волосами' },
    },
  },
  {
    slug: 'eye-care',
    categoryKey: 'eye-care',
    seo: {
      en: { title: 'Eye Care Products UAE | Eye Cream & Serum Dubai | GENOSYS', description: 'GENOSYS professional eye care products for UAE. Eye contour serums, creams and gel patches for dark circles and wrinkles. Free shipping over 1000 AED.', h1: 'Professional Eye Care' },
      ar: { title: 'منتجات العناية بالعين الإمارات | كريم العين دبي | GENOSYS', description: 'منتجات العناية بالعين الاحترافية من GENOSYS. سيرومات وكريمات لمحيط العين.', h1: 'العناية الاحترافية بالعين' },
      ru: { title: 'Средства для глаз ОАЭ | Крем для глаз Дубай | GENOSYS', description: 'Профессиональные средства GENOSYS для ухода за кожей вокруг глаз.', h1: 'Профессиональный уход за кожей вокруг глаз' },
    },
  },
  {
    slug: 'device',
    categoryKey: 'device',
    seo: {
      en: { title: 'Skincare Devices UAE | LED & Microneedling Devices Dubai | GENOSYS', description: 'GENOSYS professional skincare devices for UAE. LED therapy, microneedling pens and rollers for clinic and home use. Free shipping over 1000 AED.', h1: 'Professional Skincare Devices' },
      ar: { title: 'أجهزة العناية بالبشرة الإمارات | أجهزة LED والوخز دبي | GENOSYS', description: 'أجهزة العناية بالبشرة الاحترافية من GENOSYS. علاج LED وأقلام الوخز.', h1: 'أجهزة العناية بالبشرة الاحترافية' },
      ru: { title: 'Устройства для ухода за кожей ОАЭ | LED и микронидлинг Дубай | GENOSYS', description: 'Профессиональные устройства GENOSYS для ухода за кожей. LED-терапия и микронидлинг.', h1: 'Профессиональные устройства для ухода за кожей' },
    },
  },
  {
    slug: 'bio-meso',
    categoryKey: 'bio-meso',
    seo: {
      en: { title: 'Bio Meso Products UAE | Mesotherapy Solutions Dubai | GENOSYS', description: 'GENOSYS Bio Meso professional solutions for mesotherapy treatments in UAE. Free shipping over 1000 AED.', h1: 'Bio Meso Solutions' },
      ar: { title: 'منتجات Bio Meso الإمارات | حلول الميزوثيرابي دبي | GENOSYS', description: 'حلول GENOSYS Bio Meso الاحترافية لعلاجات الميزوثيرابي.', h1: 'حلول Bio Meso' },
      ru: { title: 'Bio Meso продукты ОАЭ | Мезотерапия Дубай | GENOSYS', description: 'Профессиональные растворы GENOSYS Bio Meso для мезотерапии.', h1: 'Растворы Bio Meso' },
    },
  },
]

// ─── Helper functions ──────────────────────────────────────────

export function getConcernBySlug(slug: string): ConcernPage | undefined {
  return CONCERN_PAGES.find(c => c.slug === slug)
}

export function getCategoryBySlug(slug: string): CategoryPage | undefined {
  return CATEGORY_PAGES.find(c => c.slug === slug)
}

export function getAllConcernSlugs(): string[] {
  return CONCERN_PAGES.map(c => c.slug)
}

export function getAllCategorySlugs(): string[] {
  return CATEGORY_PAGES.map(c => c.slug)
}
