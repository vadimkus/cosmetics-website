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
  heroShort?: string      // Short 1-2 sentence hero tagline (shown above fold)
  keywords: string[]
}

export interface HighlightItem {
  icon: string   // Emoji or text icon
  label: string
  detail: string
}

export interface WhySection {
  title: string
  items: HighlightItem[]
}

export interface ProtocolPdf {
  url: string
  title: { en: string; ar: string; ru: string }
  description: { en: string; ar: string; ru: string }
  fileSize: string
}

export interface RoutineStep {
  step: number
  title: string
  duration: string
  summary: string
  detail: string
  products: { name: string; url: string; price: string }[]
}

export interface RoutineSection {
  title: string
  subtitle: string
  steps: RoutineStep[]
}

export interface ConcernPage {
  slug: string
  icon?: string              // Emoji icon for card display
  concernKeys: string[]      // Maps to targetConcerns / GENOSYS_PRODUCT_CONCERNS values
  categoryFallbacks: string[] // Fallback product categories
  relatedConcerns: string[]  // Slugs of related concerns for cross-linking
  protocolPdf?: ProtocolPdf  // Optional downloadable protocol PDF
  why?: { en: WhySection; ar: WhySection; ru: WhySection }
  routine?: { en: RoutineSection[]; ar: RoutineSection[]; ru: RoutineSection[] }
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
    icon: '☀️',
    concernKeys: ['sun-protection'],
    categoryFallbacks: ['sun', 'cushion bb'],
    relatedConcerns: ['pigmentation', 'sensitivity', 'anti-aging'],
    protocolPdf: {
      url: '/documents/PPT/Protocol_sun.pdf',
      title: {
        en: 'Daily Sun Protection Routine',
        ar: 'روتين الحماية اليومية من الشمس',
        ru: 'Ежедневный уход: защита от солнца',
      },
      description: {
        en: 'Step-by-step morning & evening skincare routine designed for UAE climate — with product recommendations, reapplication schedule, and tips from our specialists.',
        ar: 'روتين العناية بالبشرة خطوة بخطوة صباحي ومسائي مصمم لمناخ الإمارات — مع توصيات المنتجات وجدول إعادة التطبيق ونصائح المتخصصين.',
        ru: 'Пошаговый утренний и вечерний уход за кожей для климата ОАЭ — с рекомендациями продуктов, графиком повторного нанесения и советами специалистов.',
      },
      fileSize: '257 KB',
    },
    routine: {
      en: [
        {
          title: 'Morning Routine',
          subtitle: 'Daily sun defence — takes just 5 minutes',
          steps: [
            {
              step: 1, title: 'Cleanse', duration: '1 min',
              summary: 'Remove overnight oils so sunscreen adheres properly.',
              detail: 'Apply to a dry face, let the oxygen bubbles form naturally — they lift impurities from pores without rubbing. Rinse with lukewarm water and pat dry.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Tone & Hydrate', duration: '30 sec',
              summary: 'Restore pH and create a hydrated base. Sunscreen spreads more evenly on hydrated skin.',
              detail: 'Apply with hands or cotton pad, gently pressing into skin. Move to the next step immediately — no wait needed.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Serum', duration: '30 sec',
              summary: 'Add an active treatment layer. Antioxidants work synergistically with SPF against UV and pollution.',
              detail: 'Apply 2–3 drops and pat gently into the skin. Wait 30 seconds for absorption. Choose based on your concern: Hyaluron Serum for dehydration, Sensitive Serum for redness, Radiance Serum for dark spots, Anti-Wrinkle Serum for fine lines.',
              products: [
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
                { name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' },
                { name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' },
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' },
              ],
            },
            {
              step: 4, title: 'Sun Protection', duration: '30 sec',
              summary: 'The most critical step. Apply generously — most people under-apply sunscreen by 50%.',
              detail: 'Option A: Sun cream only (ULTRA SHIELD SPF 50+ or MULTI SUN SPF 40) — apply a 2-finger length strip to face and neck. Option B: BB cream/cushion for coverage + SPF. Option C: Layer both — sun cream base, wait 1 minute, then BB on top for maximum protection with a flawless finish.',
              products: [
                { name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' },
                { name: 'MULTI SUN CREAM SPF 40', url: '/products/40', price: '210 AED' },
                { name: 'REVITA GLOW BB CREAM SPF 38', url: '/products/63', price: '250 AED' },
                { name: 'SKIN CARING BB CUSHION SPF 50+', url: '/products/41', price: '300 AED' },
              ],
            },
            {
              step: 5, title: 'Refresh During the Day', duration: 'as needed',
              summary: 'Mist over sunscreen and makeup to rehydrate. UAE heat strips moisture rapidly.',
              detail: 'Spray 2–3 times from 20 cm distance. Can be used over makeup throughout the day. Contains pre/probiotics to support the skin microbiome.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
          ],
        },
        {
          title: 'Evening Routine',
          subtitle: 'Repair UV micro-damage and prepare for tomorrow',
          steps: [
            {
              step: 1, title: 'Double Cleanse', duration: '2 min',
              summary: 'Remove sunscreen thoroughly — SPF residue left on skin clogs pores.',
              detail: 'First cleanse: Makeup remover to dissolve SPF on eye/lip area. Second cleanse: Oxygen cleanser to deep-clean residual SPF and impurities.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Tone', duration: '30 sec',
              summary: 'Rebalance pH after cleansing.',
              detail: 'Same toner as morning — apply with hands or cotton pad.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Evening Serum', duration: '30 sec',
              summary: 'Targeted treatment while your skin repairs overnight.',
              detail: 'Use the same serum as morning, or choose a more targeted option: Radiance Serum to fade sun spots, Hyaluron Serum for deep hydration, Anti-Wrinkle Serum for overnight anti-aging.',
              products: [
                { name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' },
              ],
            },
            {
              step: 4, title: 'Night Cream', duration: '30 sec',
              summary: 'Seal in active ingredients and protect your renewed skin overnight.',
              detail: 'Choose by skin type: Barrier Protecting Cream for all types, Hyaluron Cream for dry/dehydrated, Radiance Cream for dull/pigmented skin.',
              products: [
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
              ],
            },
          ],
        },
      ],
      ar: [
        {
          title: 'الروتين الصباحي',
          subtitle: 'حماية يومية من الشمس — 5 دقائق فقط',
          steps: [
            {
              step: 1, title: 'التنظيف', duration: 'دقيقة واحدة',
              summary: 'إزالة الزيوت الليلية حتى يلتصق واقي الشمس بشكل صحيح.',
              detail: 'ضعي على الوجه الجاف، دعي فقاعات الأكسجين تتشكل طبيعياً — ترفع الشوائب من المسام بدون فرك. اشطفي بماء فاتر وجففي بالتربيت.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'التونر والترطيب', duration: '30 ثانية',
              summary: 'إعادة الرطوبة والراحة إلى البشرة بعد التنظيف وتهيئتها للخطوات التالية.',
              detail: 'ضعي SNOW BOOSTER باليدين أو كرذاذ واضغطي برفق. انتقلي إلى الخطوة التالية بعد امتصاصه.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'السيروم', duration: '30 ثانية',
              summary: 'إضافة طبقة خفيفة تختارينها بحسب احتياج بشرتك.',
              detail: 'ضعي 2-3 قطرات واربتي بلطف حتى الامتصاص. اختاري سيروم الهيالورون للبشرة الجافة أو المفتقرة إلى الماء؛ فهو يجمع حمض الهيالورونيك المتحلل 2,000 جزء في المليون مع PENTAVITIN بنسبة 0.615%.',
              products: [
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
                { name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' },
                { name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' },
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' },
              ],
            },
            {
              step: 4, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'الخطوة الأهم. ضعي بكمية كافية — معظم الناس يضعون كمية أقل بنسبة 50% من المطلوب.',
              detail: 'الخيار الأول: واقي الشمس وحده، مثل ULTRA SHIELD SPF 50+ أو MULTI SUN SPF 40. الخيار الثاني: كريم BB أو الكوشن للتغطية مع SPF. ويمكن وضع واقي الشمس أولاً، وتركه ليستقر، ثم إضافة BB. يوضع قبل الخروج بـ15 دقيقة على الأقل، ويجدد كل ساعتين على الأقل في الخارج وبعد السباحة أو التعرق أو التجفيف بالمنشفة.',
              products: [
                { name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' },
                { name: 'كريم MULTI SUN الواقي من الشمس SPF 40 PA++', url: '/products/40', price: '210 AED' },
                { name: 'REVITA GLOW BB CREAM SPF 38', url: '/products/63', price: '250 AED' },
                { name: 'SKIN CARING BB CUSHION SPF 50+', url: '/products/41', price: '300 AED' },
              ],
            },
            {
              step: 5, title: 'الانتعاش خلال اليوم', duration: 'حسب الحاجة',
              summary: 'رذاذ فوق واقي الشمس والمكياج لإعادة الترطيب. حرارة الإمارات تسحب الرطوبة بسرعة.',
              detail: 'رشي 2-3 مرات من مسافة 20 سم. يمكن استخدامه فوق المكياج طوال اليوم. يحتوي على البريبايوتكس والبروبيوتكس لدعم ميكروبيوم البشرة.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'إصلاح الأضرار الدقيقة من الأشعة فوق البنفسجية والاستعداد للغد',
          steps: [
            {
              step: 1, title: 'التنظيف المزدوج', duration: 'دقيقتان',
              summary: 'إزالة واقي الشمس بالكامل — بقايا SPF على البشرة تسد المسام.',
              detail: 'التنظيف الأول: مزيل المكياج لإذابة SPF من منطقة العين والشفاه. التنظيف الثاني: منظف الأكسجين لتنظيف عميق لبقايا SPF والشوائب.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'التونر', duration: '30 ثانية',
              summary: 'ترطيب خفيف يعيد الراحة إلى البشرة بعد التنظيف.',
              detail: 'استخدمي SNOW BOOSTER نفسه باليدين أو كرذاذ، ثم اضغطي برفق.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'سيروم المساء', duration: '30 ثانية',
              summary: 'اختاري سيروماً يناسب احتياج بشرتك المسائي.',
              detail: 'يمكن استخدام سيروم الصباح نفسه. عند الإحساس بالجفاف أو الشد، يُربت سيروم الهيالورون بلطف ثم يُتبع بالكريم.',
              products: [
                { name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' },
              ],
            },
            {
              step: 4, title: 'كريم الليل', duration: '30 ثانية',
              summary: 'اختتام الروتين بطبقة كريمية تحافظ على الرطوبة طوال الليل.',
              detail: 'يُختار الكريم حسب احتياج البشرة: SKIN BARRIER PROTECTING للبشرة الحساسة والجافة، وHyaluron للبشرة التي ينقصها الماء، وRadiance للبشرة الباهتة أو غير المتجانسة.',
              products: [
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
              ],
            },
          ],
        },
      ],
      ru: [
        {
          title: 'Утренний уход',
          subtitle: 'Ежедневная защита от солнца — всего 5 минут',
          steps: [
            {
              step: 1, title: 'Очищение', duration: '1 мин',
              summary: 'Удалите ночные масла, чтобы солнцезащитный крем лучше держался.',
              detail: 'Нанесите на сухое лицо, дайте кислородным пузырькам образоваться естественно — они поднимают загрязнения из пор без трения. Смойте тёплой водой и промокните полотенцем.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Тоник и увлажнение', duration: '30 сек',
              summary: 'Верните коже влагу и комфорт после очищения и подготовьте её к следующим этапам.',
              detail: 'Нанесите SNOW BOOSTER руками или распылите, затем мягко прижмите ладонями. Продолжите уход после впитывания.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Сыворотка', duration: '30 сек',
              summary: 'Добавьте лёгкую сыворотку, подобранную под потребности кожи.',
              detail: 'Нанесите 2–3 капли и мягко вбейте до впитывания. Для сухой или обезвоженной кожи выбирайте гиалуроновую сыворотку с гидролизованной гиалуроновой кислотой 2 000 ppm и PENTAVITIN 0,615%.',
              products: [
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
                { name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' },
                { name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' },
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' },
              ],
            },
            {
              step: 4, title: 'Защита от солнца', duration: '30 сек',
              summary: 'Самый важный шаг. Наносите щедро — большинство людей наносят на 50% меньше нужного.',
              detail: 'Вариант А: солнцезащитный крем ULTRA SHIELD SPF 50+ или MULTI SUN SPF 40 PA++. Вариант Б: BB-крем или кушон для покрытия с SPF. Можно сначала нанести санскрин, дать ему впитаться, а затем добавить BB. Наносите защиту минимум за 15 минут до выхода, обновляйте не реже чем каждые два часа на улице и после плавания, сильного потоотделения или полотенца.',
              products: [
                { name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' },
                { name: 'Солнцезащитный крем MULTI SUN SPF 40 PA++', url: '/products/40', price: '210 AED' },
                { name: 'REVITA GLOW BB CREAM SPF 38', url: '/products/63', price: '250 AED' },
                { name: 'SKIN CARING BB CUSHION SPF 50+', url: '/products/41', price: '300 AED' },
              ],
            },
            {
              step: 5, title: 'Освежение в течение дня', duration: 'по мере необходимости',
              summary: 'Распылите поверх санскрина и макияжа для увлажнения. Жара ОАЭ быстро лишает кожу влаги.',
              detail: 'Распылите 2–3 раза с расстояния 20 см. Можно использовать поверх макияжа в течение дня. Содержит пре/пробиотики для поддержки микробиома кожи.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Восстановление после УФ-повреждений и подготовка к завтрашнему дню',
          steps: [
            {
              step: 1, title: 'Двойное очищение', duration: '2 мин',
              summary: 'Тщательно удалите санскрин — остатки SPF на коже забивают поры.',
              detail: 'Первое очищение: средство для снятия макияжа для растворения SPF в зоне глаз и губ. Второе очищение: кислородный очиститель для глубокой очистки от остатков SPF и загрязнений.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Тоник', duration: '30 сек',
              summary: 'Лёгкое увлажнение возвращает коже комфорт после очищения.',
              detail: 'Используйте тот же SNOW BOOSTER руками или в формате спрея, затем мягко прижмите ладонями.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Вечерняя сыворотка', duration: '30 сек',
              summary: 'Выберите сыворотку под вечерние потребности кожи.',
              detail: 'Можно повторить утреннюю сыворотку. При сухости или стянутости мягко вбейте гиалуроновую сыворотку, затем нанесите крем.',
              products: [
                { name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' },
              ],
            },
            {
              step: 4, title: 'Ночной крем', duration: '30 сек',
              summary: 'Завершите уход кремом, который поможет сохранить влагу в течение ночи.',
              detail: 'Выбирайте по потребностям кожи: SKIN BARRIER PROTECTING для чувствительной и сухой, Hyaluron для обезвоженной, Radiance для тусклой кожи и неровного тона.',
              products: [
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
              ],
            },
          ],
        },
      ],
    },
    why: {
      en: {
        title: 'Why Sun Protection Is Essential in the UAE',
        items: [
          { icon: '☀️', label: 'UV Index 11+', detail: 'Dubai\'s UV regularly exceeds "extreme" levels year-round — not just in summer' },
          { icon: '🛡️', label: 'Broad Spectrum', detail: 'UVA causes aging, UVB causes burns. Our SPF products block both.' },
          { icon: '💧', label: 'Lightweight Formulas', detail: 'Non-greasy textures that stay comfortable in 40°C+ heat and humidity' },
          { icon: '🧪', label: 'Korean Technology', detail: 'Dermatologically tested formulas with active repair ingredients, not just UV filters' },
        ],
      },
      ar: {
        title: 'لماذا الحماية من الشمس ضرورية في الإمارات',
        items: [
          { icon: '☀️', label: 'مؤشر UV 11+', detail: 'الأشعة فوق البنفسجية في دبي تتجاوز المستويات "الشديدة" طوال العام' },
          { icon: '🛡️', label: 'حماية واسعة الطيف', detail: 'الأشعة فوق البنفسجية أ تسبب الشيخوخة، وب تسبب الحروق. منتجاتنا تحمي من كليهما.' },
          { icon: '💧', label: 'تركيبات خفيفة', detail: 'تركيبات غير دهنية مريحة في درجات حرارة 40 درجة مئوية وأكثر' },
          { icon: '🧪', label: 'تقنية كورية', detail: 'تركيبات مختبرة طبياً مع مكونات إصلاح نشطة وليس فقط فلاتر الأشعة فوق البنفسجية' },
        ],
      },
      ru: {
        title: 'Почему защита от солнца необходима в ОАЭ',
        items: [
          { icon: '☀️', label: 'УФ-индекс 11+', detail: 'УФ-излучение в Дубае регулярно превышает «экстремальный» уровень круглый год' },
          { icon: '🛡️', label: 'Широкий спектр', detail: 'UVA вызывает старение, UVB — ожоги. Наши SPF-средства блокируют оба типа.' },
          { icon: '💧', label: 'Лёгкие текстуры', detail: 'Нежирные формулы, комфортные при 40°C+ и высокой влажности' },
          { icon: '🧪', label: 'Корейские технологии', detail: 'Дерматологически протестированные формулы с активными восстанавливающими ингредиентами' },
        ],
      },
    },
    seo: {
      en: {
        title: 'Sun Protection Products UAE | SPF Sunscreen Dubai | GENOSYS',
        description: 'Professional Korean sun protection for UAE climate. GENOSYS SPF sunscreens protect against intense UV exposure in Dubai, Abu Dhabi & all emirates. Dermatologically tested, lightweight formulas. Free shipping over 1000 AED.',
        h1: 'Sun Protection for UAE Climate',
        heroShort: 'Professional-grade Korean sunscreens and BB cushions with SPF — lightweight, non-greasy formulas designed for the intense UAE sun.',
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
        { question: 'What is the difference between sun cream and BB cushion with SPF?', answer: 'Sun creams (like ULTRA SHIELD SPF 50+) focus purely on maximum UV protection with skin-repairing ingredients. BB cushions and BB creams add natural coverage to conceal blemishes and even out skin tone while also providing SPF protection. Many people layer both — sun cream as a base, BB cushion on top for a flawless finish with double protection.' },
        { question: 'How often should I reapply sunscreen in Dubai?', answer: 'Indoors with air conditioning: every 4–5 hours. Outdoors with shade: every 2–3 hours. Direct sun exposure (beach, pool, sports): every 90 minutes. Always reapply immediately after swimming, heavy sweating, or towelling your face. The GENOSYS BB Cushion compact is ideal for on-the-go touch-ups.' },
      ],
      ar: [
        { question: 'ما مستوى SPF الموصى به للحماية من الشمس في الإمارات؟', answer: 'في الإمارات، يوصي أطباء الجلدية باستخدام واقي شمس SPF 50+ مع حماية واسعة الطيف من الأشعة فوق البنفسجية للاستخدام اليومي. مؤشر الأشعة فوق البنفسجية في دبي يتجاوز بانتظام 11 (شديد)، مما يجعل الحماية العالية ضرورية طوال العام.' },
        { question: 'ما الفرق بين كريم الشمس وكوشن BB مع SPF؟', answer: 'يوضع كريم مثل ULTRA SHIELD SPF 50+ بوصفه طبقة واقي الشمس الأساسية. أما كوشن وكريمات BB فتضيف تغطية وتحمل تصنيف SPF خاصاً بها، لكنها تحتاج أيضاً إلى توزيع كمية كافية ومتساوية للوصول إلى مستوى الحماية المكتوب.' },
      ],
      ru: [
        { question: 'Какой уровень SPF рекомендуется для защиты от солнца в ОАЭ?', answer: 'В ОАЭ дерматологи рекомендуют SPF 50+ с широкоспектральной защитой от UVA/UVB для ежедневного использования. Индекс УФ-излучения в Дубае регулярно превышает 11 (экстремальный), что делает высокую защиту необходимой круглый год.' },
        { question: 'В чём разница между солнцезащитным кремом и BB-кушоном с SPF?', answer: 'Крем ULTRA SHIELD SPF 50+ наносят как отдельный слой солнцезащиты. BB-кушон или BB-крем добавляет покрытие и имеет собственную маркировку SPF, но для заявленного уровня защиты его тоже нужно распределять в достаточном количестве и равномерно.' },
      ],
    },
  },

  // ─── ACNE TREATMENT ──────────────────────────────────────────
  {
    slug: 'acne-treatment',
    icon: '💆',
    concernKeys: ['page-acne'],
    categoryFallbacks: [],
    relatedConcerns: ['scars-treatment', 'pigmentation', 'sensitivity'],
    protocolPdf: {
      url: '/documents/PPT/Protocol_acne.pdf',
      title: {
        en: 'Acne & Blemish Home Care Protocol',
        ar: 'بروتوكول العناية المنزلية لحب الشباب والبثور',
        ru: 'Протокол домашнего ухода при акне',
      },
      description: {
        en: 'Complete morning & evening routine for acne-prone skin — Problem Control system, exfoliation schedule, product sets by severity, and UAE-specific tips.',
        ar: 'روتين صباحي ومسائي كامل للبشرة المعرضة لحب الشباب — نظام التحكم في المشاكل، جدول التقشير، مجموعات المنتجات حسب الشدة، ونصائح خاصة بالإمارات.',
        ru: 'Полный утренний и вечерний уход для кожи, склонной к акне — система Problem Control, график пилинга, наборы по степени тяжести и советы для климата ОАЭ.',
      },
      fileSize: '282 KB',
    },
    why: {
      en: {
        title: 'Why Acne Needs a Targeted Approach in the UAE',
        items: [
          { icon: '🌡️', label: 'Heat & Humidity', detail: 'UAE\'s 40°C+ climate and high humidity supercharge sebum production — generic cleansers can\'t keep up' },
          { icon: '🔬', label: 'Salicylic Acid + Niacinamide', detail: 'GENOSYS Problem Control line uses BHA to unclog pores and niacinamide to calm inflammation simultaneously' },
          { icon: '🛡️', label: 'Barrier-Safe Formula', detail: 'Treats acne without stripping the skin barrier — no dryness, no rebound oiliness' },
          { icon: '🧪', label: 'Clinic-Grade at Home', detail: 'The same formulas used by dermatologists in Dubai clinics, now available for your daily routine' },
        ],
      },
      ar: {
        title: 'لماذا تحتاج البشرة المعرضة للبثور إلى روتين متوازن في الإمارات',
        items: [
          { icon: '🌡️', label: 'الحرارة والرطوبة', detail: 'قد يزيد مناخ الإمارات الحار والرطب من اللمعان وفائض الزهم، لذا تناسبه القوامات الخفيفة سريعة الامتصاص' },
          { icon: '🔬', label: 'مكونات واضحة', detail: 'يحتوي التونر على BHA، بينما يستخدم السيروم والكريم زنك PCA للمساعدة على تنظيم فائض الزهم' },
          { icon: '🛡️', label: 'راحة البشرة', detail: 'تدعم مكونات مثل التريهالوز والزيليتول والبانثينول والألانتوين الترطيب والراحة ضمن الروتين' },
          { icon: '🧪', label: 'روتين متكامل', detail: 'تنظيف ثم تونر وسيروم وكريم بقوامات مصممة للاستخدام اليومي صباحاً ومساءً' },
        ],
      },
      ru: {
        title: 'Почему склонной к высыпаниям коже нужен сбалансированный уход в ОАЭ',
        items: [
          { icon: '🌡️', label: 'Жара и влажность', detail: 'Жаркий и влажный климат ОАЭ может усиливать блеск и избыток себума, поэтому особенно удобны лёгкие быстро впитывающиеся текстуры' },
          { icon: '🔬', label: 'Понятные активы', detail: 'В тонике есть BHA, а в сыворотке и креме — цинк PCA для ухода за избытком себума' },
          { icon: '🛡️', label: 'Комфорт кожи', detail: 'Трегалоза, ксилитол, пантенол и аллантоин поддерживают увлажнение и комфорт в рамках ежедневного ухода' },
          { icon: '🧪', label: 'Полный ритуал', detail: 'Очищение, затем тоник, сыворотка и крем с текстурами для утреннего и вечернего применения' },
        ],
      },
    },
    routine: {
      en: [
        {
          title: 'Morning Routine',
          subtitle: 'Control oil & prevent new breakouts — takes 5 minutes',
          steps: [
            {
              step: 1, title: 'Gentle Cleanse', duration: '1 min',
              summary: 'Remove overnight oil without stripping the skin barrier. A damaged barrier makes acne worse.',
              detail: 'Apply SNOW O₂ CLEANSER to dry face. Let the oxygen bubbles lift impurities from pores naturally — no rubbing needed. This avoids spreading bacteria from active breakouts. Rinse with lukewarm water (never hot) and pat dry with a clean towel.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Acne Control Toner', duration: '30 sec',
              summary: 'Balance pH and begin sebum regulation. This is the foundation of the Problem Control system.',
              detail: 'Soak a cotton pad and sweep across the T-zone, chin, and jawline — areas where breakouts concentrate in the UAE climate. The toner contains salicylic acid to dissolve pore-clogging debris and niacinamide to calm redness. Can also be used as a spot compress: hold a soaked pad on a cystic spot for 30 seconds.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 3, title: 'Problem Control Serum', duration: '30 sec',
              summary: 'Targeted treatment that reduces inflammation and prevents new lesions from forming.',
              detail: 'Apply 2–3 drops to the entire face, concentrating on active breakout zones. The serum penetrates deeper than the toner, delivering anti-inflammatory and sebum-regulating actives into the follicle. Wait 30 seconds for absorption before the next step. For severe breakouts, apply an extra drop directly onto each lesion.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 4, title: 'Lightweight Moisturiser', duration: '30 sec',
              summary: 'Even oily, acne-prone skin needs hydration. Skipping moisturiser triggers more oil production.',
              detail: 'Apply a thin layer of Problem Control Cream. It\'s oil-free and non-comedogenic — formulated specifically for acne-prone skin. It seals in the serum actives while controlling shine throughout the day. Avoid heavy creams or oils that clog pores.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL CREAM', url: '/products/30', price: '290 AED' }],
            },
            {
              step: 5, title: 'Sun Protection', duration: '30 sec',
              summary: 'UV exposure darkens acne marks and causes post-inflammatory hyperpigmentation (PIH). SPF is non-negotiable.',
              detail: 'Apply ULTRA SHIELD SUN CREAM generously to face and neck. Its lightweight, non-greasy formula won\'t clog pores or trigger breakouts. This is especially critical in the UAE where UV index exceeds 11 year-round — without SPF, every cleared blemish leaves a dark mark.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Evening Routine',
          subtitle: 'Deep cleanse, treat & repair overnight',
          steps: [
            {
              step: 1, title: 'Double Cleanse', duration: '2 min',
              summary: 'Remove SPF, sweat, and environmental debris. Leftover sunscreen mixed with sebum is a breakout trigger.',
              detail: 'First cleanse: Use makeup remover on eye and lip area to dissolve SPF and makeup. Second cleanse: SNOW O₂ CLEANSER on the entire face to remove residual sunscreen, sweat, and pollution particles trapped in pores during the day.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Exfoliate (2–3× per week)', duration: '2 min',
              summary: 'Remove dead skin cells that trap sebum and bacteria inside pores. Essential for preventing new breakouts.',
              detail: 'Apply EPI TURNOVER PEELING GEL to dry skin. Massage in circular motions for 1–2 minutes — you\'ll see dead skin cells ball up. This gentle chemical + physical exfoliation unclogs pores without micro-tears. Skip this step on nights when your skin feels irritated or if you have open lesions. Use 2–3 times per week maximum.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'Acne Control Toner', duration: '30 sec',
              summary: 'Second application resets skin pH after cleansing and delivers another dose of BHA.',
              detail: 'Same technique as morning — sweep across problem areas with a soaked cotton pad. The evening application is particularly effective because the actives work overnight without UV interference.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 4, title: 'Problem Control Serum', duration: '30 sec',
              summary: 'Overnight treatment when skin repair is most active. Actives work 2× harder during sleep.',
              detail: 'Apply 3–4 drops (slightly more than morning). The serum works with your skin\'s natural overnight repair cycle. For stubborn spots, apply an extra drop as a spot treatment after the full-face application.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 5, title: 'Night Moisturiser', duration: '30 sec',
              summary: 'Lock in treatment actives and support barrier recovery while you sleep.',
              detail: 'Apply Problem Control Cream. The lightweight formula won\'t clog pores overnight. If your skin feels particularly dry (common with acne treatments), you can mix one drop of Hyaluron Serum into the cream for extra hydration without adding oil.',
              products: [
                { name: 'INTENSIVE PROBLEM CONTROL CREAM', url: '/products/30', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
              ],
            },
          ],
        },
      ],
      ar: [
        {
          title: 'الروتين الصباحي',
          subtitle: 'التحكم في الدهون ومنع البثور الجديدة — 5 دقائق',
          steps: [
            {
              step: 1, title: 'تنظيف لطيف', duration: 'دقيقة واحدة',
              summary: 'إزالة الزيوت الليلية دون تجريد حاجز البشرة. الحاجز التالف يزيد حب الشباب سوءاً.',
              detail: 'ضعي SNOW O₂ CLEANSER على الوجه الجاف. دعي فقاعات الأكسجين ترفع الشوائب من المسام طبيعياً — بدون فرك. هذا يتجنب نشر البكتيريا من البثور النشطة. اشطفي بماء فاتر (ليس ساخناً أبداً) وجففي بمنشفة نظيفة.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'تونر لتنظيم الدهون', duration: '30 ثانية',
              summary: 'يساعد زنك PCA بنسبة 0.5% على تنظيم فائض الزهم، بينما تحافظ قاعدة الترطيب على راحة البشرة.',
              detail: 'تُبلل قطعة قطن ويُمسح الوجه بلطف، أو يُرش التونر بالتساوي. يوجد حمض الساليسيليك بتركيز أثري 0.001% فقط، لذا فهذه خطوة يومية لتنظيم الدهون وليست تقشير BHA أو مستحضراً دوائياً.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 3, title: 'سيروم Intensive Problem Control', duration: '30 ثانية',
              summary: 'طبقة خفيفة بزنك PCA بتركيز 0.05% للمساعدة على تنظيم فائض الزهم.',
              detail: 'تُوزع قطرتان إلى ثلاث على الوجه بعد التونر، ثم يُربت بأطراف الأصابع حتى الامتصاص. يدعم التريهالوز 1% والزيليتول 0.5% والبانثينول 0.2% والألانتوين 0.1% الترطيب والراحة من دون ملمس دهني.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 4, title: 'مرطب خفيف', duration: '30 ثانية',
              summary: 'حتى البشرة الدهنية تحتاج إلى الترطيب؛ والاختيار الصحيح هو قوام خفيف لا يثقلها.',
              detail: 'تُوزع طبقة رقيقة من كريم Intensive Problem Control. يساعد زنك PCA بتركيز 0.05% على تنظيم اللمعان، بينما يدعم التريهالوز 1.5% والزيليتول 0.5% الترطيب. تخلو القاعدة الهلامية من الزيوت النباتية والزبدات والشموع.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL CREAM', url: '/products/30', price: '290 AED' }],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'الأشعة فوق البنفسجية تغمق آثار حب الشباب وتسبب فرط التصبغ التالي للالتهاب. SPF غير قابل للتفاوض.',
              detail: 'يوزع ULTRA SHIELD SUN CREAM بسخاء وبالتساوي على البشرة المكشوفة قبل الخروج بـ15 دقيقة على الأقل. يجدد كل ساعتين على الأقل في الخارج وبعد السباحة أو التعرق أو التجفيف بالمنشفة.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'تنظيف عميق وعلاج وإصلاح ليلي',
          steps: [
            {
              step: 1, title: 'التنظيف المزدوج', duration: 'دقيقتان',
              summary: 'إزالة SPF والعرق والملوثات البيئية. واقي الشمس المتبقي مع الدهون يحفز البثور.',
              detail: 'التنظيف الأول: مزيل المكياج لمنطقة العين والشفاه لإذابة SPF والمكياج. التنظيف الثاني: SNOW O₂ CLEANSER على الوجه بالكامل لإزالة بقايا واقي الشمس والعرق وجسيمات التلوث المحتبسة في المسام.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'التقشير (2-3 مرات أسبوعياً)', duration: 'دقيقتان',
              summary: 'إزالة خلايا الجلد الميتة التي تحبس الدهون والبكتيريا داخل المسام. ضروري لمنع البثور الجديدة.',
              detail: 'ضعي EPI TURNOVER PEELING GEL على البشرة الجافة. دلكي بحركات دائرية لمدة 1-2 دقيقة — سترين خلايا الجلد الميتة تتكور. تقشير كيميائي وفيزيائي لطيف ينظف المسام بدون تمزقات دقيقة. تجاوزي هذه الخطوة في الليالي التي تشعرين فيها بتهيج البشرة. بحد أقصى 3 مرات أسبوعياً.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'تونر لتنظيم الدهون', duration: '30 ثانية',
              summary: 'تطبيق مسائي خفيف يساعد على تنظيم فائض الزهم وإعادة الترطيب بعد التنظيف.',
              detail: 'يُستخدم بالطريقة نفسها صباحاً: بقطعة قطن من دون فرك أو كرذاذ متجانس، ثم يُترك حتى يمتص قبل السيروم والكريم.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 4, title: 'سيروم Intensive Problem Control', duration: '30 ثانية',
              summary: 'الخطوة الخفيفة نفسها مساءً للمساعدة على الحفاظ على توازن الزهم.',
              detail: 'تُستخدم قطرتان إلى ثلاث بعد التونر، تماماً كما في الصباح، مع تجنب المنطقة المحيطة بالعينين. يُربت السيروم بلطف ثم يوضع الكريم فوقه.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 5, title: 'مرطب ليلي', duration: '30 ثانية',
              summary: 'تُختتم العناية بطبقة هلامية خفيفة تدعم الترطيب من دون قوام غني.',
              detail: 'يُدلك كريم Problem Control بلطف كخطوة أخيرة. وإذا شعرت البشرة بالجفاف أو الشد، تُربت قطرة أو قطرتان من سيروم الهيالورون أولاً، ثم يوضع الكريم فوقه.',
              products: [
                { name: 'INTENSIVE PROBLEM CONTROL CREAM', url: '/products/30', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
              ],
            },
          ],
        },
      ],
      ru: [
        {
          title: 'Утренний уход',
          subtitle: 'Контроль жирности и предотвращение новых высыпаний — 5 минут',
          steps: [
            {
              step: 1, title: 'Бережное очищение', duration: '1 мин',
              summary: 'Удалите ночной жир, не повреждая защитный барьер. Повреждённый барьер усиливает акне.',
              detail: 'Нанесите SNOW O₂ CLEANSER на сухое лицо. Дайте кислородным пузырькам поднять загрязнения из пор естественным образом — без трения. Это предотвращает распространение бактерий от активных воспалений. Смойте тёплой водой (никогда горячей) и промокните чистым полотенцем.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Себорегулирующий тоник', duration: '30 сек',
              summary: 'Цинк PCA 0,5% помогает контролировать избыток себума, а увлажняющая база поддерживает комфорт кожи.',
              detail: 'Пропитайте ватный диск и мягко протрите лицо либо равномерно распылите тоник. Салициловая кислота присутствует лишь в следовой концентрации 0,001%, поэтому это ежедневный себорегулирующий этап, а не BHA-пилинг или лекарственное средство.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 3, title: 'Сыворотка Intensive Problem Control', duration: '30 сек',
              summary: 'Лёгкий слой с цинком PCA 0,05% помогает контролировать избыток себума.',
              detail: 'Нанесите 2–3 капли на лицо после тоника и мягко вбейте до впитывания. Трегалоза 1%, ксилитол 0,5%, пантенол 0,2% и аллантоин 0,1% поддерживают увлажнение и комфорт без жирного финиша.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 4, title: 'Лёгкий увлажняющий крем', duration: '30 сек',
              summary: 'Жирной коже тоже нужно увлажнение, но без тяжёлой насыщенной основы.',
              detail: 'Нанесите тонкий слой Intensive Problem Control Cream. Цинк PCA 0,05% помогает контролировать жирный блеск, а трегалоза 1,5% и ксилитол 0,5% поддерживают увлажнение. В лёгкой гелевой основе нет растительных масел, баттеров и восков.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL CREAM', url: '/products/30', price: '290 AED' }],
            },
            {
              step: 5, title: 'Защита от солнца', duration: '30 сек',
              summary: 'УФ-лучи затемняют следы от акне и вызывают поствоспалительную гиперпигментацию. SPF обязателен.',
              detail: 'Равномерно и щедро нанесите ULTRA SHIELD SUN CREAM на открытые участки минимум за 15 минут до выхода. Обновляйте не реже чем каждые два часа на улице, а также после плавания, пота или полотенца.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Глубокое очищение, лечение и ночное восстановление',
          steps: [
            {
              step: 1, title: 'Двойное очищение', duration: '2 мин',
              summary: 'Удалите SPF, пот и загрязнения. Остатки санскрина с себумом — триггер высыпаний.',
              detail: 'Первое очищение: средство для снятия макияжа для зоны глаз и губ, чтобы растворить SPF и макияж. Второе очищение: SNOW O₂ CLEANSER на всё лицо для удаления остатков санскрина, пота и частиц загрязнений, застрявших в порах за день.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Пилинг (2–3 раза в неделю)', duration: '2 мин',
              summary: 'Удалите мёртвые клетки кожи, которые удерживают себум и бактерии в порах. Необходимо для профилактики.',
              detail: 'Нанесите EPI TURNOVER PEELING GEL на сухую кожу. Массируйте круговыми движениями 1–2 минуты — вы увидите, как мёртвые клетки скатываются. Мягкий химический + физический пилинг очищает поры без микроповреждений. Пропустите этот шаг, если кожа раздражена или есть открытые воспаления. Максимум 3 раза в неделю.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'Себорегулирующий тоник', duration: '30 сек',
              summary: 'Лёгкий вечерний этап помогает контролировать избыток себума и возвращает коже влагу после очищения.',
              detail: 'Используйте так же, как утром: мягко протрите кожу ватным диском без трения или равномерно распылите, затем дайте впитаться перед сывороткой и кремом.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 4, title: 'Сыворотка Intensive Problem Control', duration: '30 сек',
              summary: 'Тот же лёгкий вечерний этап для поддержания баланса себума.',
              detail: 'Используйте 2–3 капли после тоника, как и утром, избегая области вокруг глаз. Мягко вбейте сыворотку, затем нанесите крем.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 5, title: 'Ночной увлажняющий крем', duration: '30 сек',
              summary: 'Завершите уход лёгким гелевым слоем, поддерживающим увлажнение без плотной основы.',
              detail: 'Мягко распределите крем Problem Control массажными движениями. Если кожа ощущает сухость или стянутость, сначала вбейте одну-две капли гиалуроновой сыворотки, затем нанесите крем.',
              products: [
                { name: 'INTENSIVE PROBLEM CONTROL CREAM', url: '/products/30', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
              ],
            },
          ],
        },
      ],
    },
    seo: {
      en: {
        title: 'Acne Treatment Products UAE | Blemish Control Dubai | GENOSYS',
        description: 'Professional Korean acne treatment solutions for UAE. GENOSYS problem control serums, creams & toners target breakouts, blemishes & oily skin. Dermatologically tested. Free shipping over 1000 AED.',
        h1: 'Acne & Blemish Treatment',
        heroShort: 'Professional-grade Korean acne treatment — clinically proven toner, serum & cream that control breakouts without damaging your skin barrier.',
        intro: 'Acne and blemishes are among the most common skin concerns in the UAE, worsened by heat, humidity, and environmental factors. GENOSYS Intensive Problem Control line offers a clinically proven approach to acne management — professional-grade toners, serums, and creams that target breakouts at the source while protecting the skin barrier. Our Korean dermacosmetics use active ingredients like salicylic acid and niacinamide to control excess sebum, reduce inflammation, and prevent post-acne marks.',
        keywords: ['acne treatment UAE', 'acne skincare Dubai', 'blemish control UAE', 'Korean acne products', 'problem control serum', 'acne cream Dubai', 'professional acne treatment UAE'],
      },
      ar: {
        title: 'العناية بالبشرة المعرّضة للشوائب في الإمارات | GENOSYS',
        description: 'روتين كوري تجميلي للبشرة الدهنية أو المختلطة أو المعرّضة للشوائب في الإمارات، بقوامات خفيفة وترتيب صباحي ومسائي واضح.',
        h1: 'العناية بالبشرة الدهنية والمُعرّضة للشوائب',
        heroShort: 'روتين كوري متوازن للبشرة الدهنية والمختلطة — تنظيف وتونر وسيروم وكريم لتنظيم اللمعان ودعم الراحة.',
        intro: 'قد يزيد مناخ الإمارات الحار والرطب من اللمعان وفائض الزهم. يجمع روتين GENOSYS Intensive Problem Control بين خطوات خفيفة للعناية بالبشرة الدهنية والمختلطة والمعرضة للبثور من دون تحويلها إلى روتين قاسٍ أو مجفف.',
        keywords: ['علاج حب الشباب الإمارات', 'مكافحة البثور دبي', 'سيروم حب الشباب', 'منتجات كورية للبثور'],
      },
      ru: {
        title: 'Уход за жирной и склонной к несовершенствам кожей в ОАЭ | GENOSYS',
        description: 'Корейский косметический уход для жирной, комбинированной и склонной к несовершенствам кожи в ОАЭ: лёгкие текстуры и понятный утренний и вечерний порядок.',
        h1: 'Уход за жирной и склонной к несовершенствам кожей',
        heroShort: 'Сбалансированный корейский уход для жирной и комбинированной кожи: очищение, тоник, сыворотка и крем для контроля блеска и комфорта.',
        intro: 'Жара и влажность ОАЭ могут усиливать блеск и избыток себума. Линия GENOSYS Intensive Problem Control объединяет лёгкие этапы ухода за жирной, комбинированной и склонной к высыпаниям кожей, не превращая ритуал в агрессивное пересушивание.',
        keywords: ['средства от акне ОАЭ', 'лечение прыщей Дубай', 'корейская косметика от акне', 'сыворотка от высыпаний'],
      },
    },
    faq: {
      en: [
        { question: 'What is the best Korean treatment for acne in UAE?', answer: 'GENOSYS Intensive Problem Control line is specifically formulated for acne-prone skin. The Problem Control Serum and Problem Control Cream work together to reduce breakouts, control oil production, and minimize pore appearance. These products are used by professional dermatologists in Dubai clinics and are available for home use through genosys.ae.' },
        { question: 'Does humidity in Dubai make acne worse?', answer: 'Yes, high humidity combined with heat increases sebum production, clogging pores and triggering breakouts. GENOSYS Problem Control products contain oil-regulating active ingredients that work effectively in the UAE climate. The Intensive Problem Control Toner is particularly effective as a daily prep step to balance skin pH and deliver salicylic acid to congested pores.' },
        { question: 'How long does it take to see results with the Problem Control line?', answer: 'Most users notice reduced oiliness and fewer new breakouts within 1–2 weeks of consistent use. Existing blemishes begin to flatten and fade within 2–4 weeks. For full clearing and post-acne mark reduction, expect 6–8 weeks. The key is consistency: use the Toner → Serum → Cream system both morning and evening without skipping steps.' },
        { question: 'Can I use acne products if I have sensitive skin?', answer: 'Yes. The GENOSYS Problem Control line is formulated to be effective against acne while protecting the skin barrier. The concentrations of salicylic acid and niacinamide are calibrated to treat without causing irritation, peeling, or dryness. If you have very sensitive skin, start with the Toner and Cream first, then introduce the Serum after one week once your skin has adjusted.' },
        { question: 'Should I still moisturise if I have oily, acne-prone skin?', answer: 'Absolutely. Skipping moisturiser sends a signal to your skin to produce even more oil, making breakouts worse. The Intensive Problem Control Cream is oil-free, non-comedogenic, and specifically designed for oily/combination skin. It hydrates without clogging pores and helps maintain the skin barrier that acne treatments can compromise.' },
        { question: 'What is the difference between Problem Control Toner, Serum, and Cream?', answer: 'The Toner (260 AED) is a pH-balancing first step that delivers salicylic acid across the entire face to dissolve pore-clogging debris. The Serum (330 AED) is a concentrated treatment that penetrates deeper into the follicle to reduce inflammation and prevent new lesions. The Cream (290 AED) is a lightweight, oil-free moisturiser that seals in the actives and controls shine. All three work as a system — each step amplifies the next.' },
      ],
      ar: [
        { question: 'لمن يناسب روتين Intensive Problem Control؟', answer: 'يناسب البشرة الدهنية والمختلطة والمعرضة للبثور واللمعان. يساعد السيروم بزنك PCA بتركيز 0.05% على تنظيم فائض الزهم، بينما تدعم مكونات الترطيب راحة البشرة.' },
        { question: 'هل الرطوبة في دبي تزيد اللمعان؟', answer: 'قد تجعل الحرارة والرطوبة اللمعان وفائض الزهم أكثر وضوحاً. لذلك تركز هذه المجموعة على قوامات خفيفة سريعة الامتصاص تناسب الاستخدام اليومي في الإمارات.' },
        { question: 'هل يحتوي السيروم على حمض الساليسيليك؟', answer: 'لا. يحتوي على مستخلص لحاء الصفصاف الأسود بتركيز أثري 0.001%، لكنه لا يحتوي على حمض الساليسيليك أو أحماض AHA/BHA.' },
        { question: 'هل تحتاج البشرة الدهنية إلى كريم؟', answer: 'نعم، فقد تكون البشرة الدهنية ناقصة الترطيب أيضاً. يمنح Intensive Problem Control Cream ترطيباً خفيفاً بالتريهالوز 1.5% والزيليتول 0.5%، مع زنك PCA بتركيز 0.05% للعناية باللمعان. يوضع بعد السيروم، ثم يُختتم الروتين الصباحي بواقي الشمس.' },
      ],
      ru: [
        { question: 'Кому подходит уход Intensive Problem Control?', answer: 'Жирной, комбинированной и склонной к несовершенствам коже. Цинк PCA 0,05% в сыворотке помогает ухаживать за избытком себума, а увлажняющие компоненты поддерживают комфорт. Это косметический уход, а не лечение акне.' },
        { question: 'Почему в Дубае кожа сильнее блестит?', answer: 'Жара и влажность могут делать блеск и избыток себума заметнее. Поэтому в линии используются лёгкие, быстро впитывающиеся текстуры, удобные для ежедневного ухода в ОАЭ.' },
        { question: 'Есть ли в сыворотке салициловая кислота?', answer: 'Нет. Экстракт коры чёрной ивы присутствует в следовой концентрации 0,001%, но салициловой кислоты и других AHA/BHA-кислот в формуле нет.' },
        { question: 'Нужен ли жирной коже крем?', answer: 'Да, жирная кожа тоже может быть обезвоженной. Intensive Problem Control Cream даёт лёгкое увлажнение благодаря трегалозе 1,5% и ксилитолу 0,5%, а цинк PCA 0,05% помогает контролировать блеск. Нанесите его после сыворотки, а утром завершите уход SPF.' },
      ],
    },
  },

  // ─── PIGMENTATION ──────────────────────────────────────────
  {
    slug: 'pigmentation',
    icon: '✨',
    concernKeys: ['page-pigmentation'],
    categoryFallbacks: [],
    relatedConcerns: ['sun-protection', 'anti-aging', 'acne-treatment'],
    protocolPdf: {
      url: '/documents/PPT/Protocol_Pigmentation.pdf',
      title: {
        en: 'Pigmentation & Brightening Home Care Protocol',
        ar: 'بروتوكول العناية المنزلية بالتصبغات وتفتيح البشرة',
        ru: 'Протокол домашнего ухода при пигментации и осветлении',
      },
      description: {
        en: 'Complete morning & evening routine for pigmentation — Radiance brightening system, tyrosinase inhibition steps, product sets by pigmentation type, and UAE sun-exposure tips.',
        ar: 'روتين صباحي ومسائي كامل للتصبغات — نظام Radiance للتفتيح، خطوات تثبيط التيروزيناز، مجموعات منتجات حسب نوع التصبغ، ونصائح للتعرض للشمس في الإمارات.',
        ru: 'Полный утренний и вечерний уход при пигментации — система Radiance, подавление тирозиназы, наборы по типу пигментации и советы по защите от солнца в ОАЭ.',
      },
      fileSize: '270 KB',
    },
    why: {
      en: {
        title: 'Why Pigmentation Needs a Targeted Approach in the UAE',
        items: [
          { icon: '☀️', label: 'UV & Melanin', detail: 'Dubai\'s UV index regularly exceeds 11 — triggering melanin overproduction that causes stubborn dark spots and uneven tone' },
          { icon: '🧪', label: 'Vitamin C + Niacinamide + Arbutin', detail: 'GENOSYS Multi Vita Radiance line uses a triple-action brightening complex to inhibit tyrosinase and fade existing pigmentation' },
          { icon: '🤝', label: 'Safe for All Skin Tones', detail: 'Works by regulating melanin, not bleaching — safe for Fitzpatrick types IV–VI common in the Middle East' },
          { icon: '🛡️', label: 'SPF Synergy', detail: 'Brightening actives work best when paired with SPF 50+ — prevents new spots while fading existing ones' },
        ],
      },
      ar: {
        title: 'لماذا تحتاج التصبغات نهجاً مستهدفاً في الإمارات',
        items: [
          { icon: '☀️', label: 'الشمس وتفاوت اللون', detail: 'التعرض اليومي للأشعة فوق البنفسجية يجعل البقع الداكنة وتفاوت اللون أكثر وضوحاً، لذلك تبدأ أي خطة إشراق بحماية منتظمة من الشمس.' },
          { icon: '🧪', label: 'نياسيناميد 2% + فيتامين C ثابت', detail: 'يجمع سيروم Multi Vita Radiance النياسيناميد 2% ومشتق فيتامين C الثابت 0.1% والبانثينول 1% للعناية بمظهر اللون غير المتجانس.' },
          { icon: '📊', label: 'نتيجة قابلة للقياس', detail: 'انخفض مؤشر الميلانين السطحي من 6.190 إلى 4.457 خلال أسبوعين، أي بنسبة 28.0%.' },
          { icon: '🛡️', label: 'واقي الشمس يحافظ على النتيجة', detail: 'يُختتم الروتين الصباحي بواقي شمس واسع الطيف للمساعدة على الحد من زيادة تباين البقع الداكنة.' },
        ],
      },
      ru: {
        title: 'Почему пигментация требует целенаправленного подхода в ОАЭ',
        items: [
          { icon: '☀️', label: 'Солнце и неровный тон', detail: 'Ежедневное УФ-воздействие делает тёмные пятна и неровный тон заметнее, поэтому любой уход для сияния начинается с регулярной защиты от солнца.' },
          { icon: '🧪', label: 'Ниацинамид 2% + стабильный витамин C', detail: 'Сыворотка Multi Vita Radiance сочетает ниацинамид 2%, стабильное производное витамина C 0,1% и пантенол 1% для ухода за неровным тоном.' },
          { icon: '📊', label: 'Измеримый результат', detail: 'Показатель поверхностного меланина снизился с 6,190 до 4,457 за две недели, то есть на 28,0%.' },
          { icon: '🛡️', label: 'SPF сохраняет результат', detail: 'Утренний уход завершают солнцезащитным средством широкого спектра, чтобы не усиливать контраст тёмных пятен.' },
        ],
      },
    },
    seo: {
      en: {
        title: 'Pigmentation Treatment UAE | Dark Spots & Brightening Dubai | GENOSYS',
        description: 'Professional Korean pigmentation treatment for UAE. GENOSYS brightening serums & creams reduce dark spots, hyperpigmentation & uneven skin tone. Dermatologically tested. Free shipping over 1000 AED.',
        h1: 'Pigmentation & Skin Brightening Treatment',
        heroShort: 'Professional Korean brightening serums & creams — fade dark spots, even skin tone and restore radiance with vitamin C, niacinamide & arbutin.',
        intro: 'Hyperpigmentation and dark spots are extremely common in the UAE due to intense sun exposure throughout the year. GENOSYS Multi Vita Radiance line combines Korean brightening technology with powerful ingredients like vitamin C, niacinamide, and arbutin to visibly reduce melanin overproduction, even skin tone, and restore natural radiance. Our professional-grade brightening products are safe for all skin tones, including darker Fitzpatrick types common in the Middle East.',
        keywords: ['pigmentation treatment UAE', 'dark spots Dubai', 'skin brightening UAE', 'hyperpigmentation cream', 'Korean brightening serum', 'uneven skin tone Dubai', 'melasma treatment UAE'],
      },
      ar: {
        title: 'العناية بالتصبغات والإشراق في الإمارات | GENOSYS دبي',
        description: 'عناية كورية احترافية بمظهر البقع الداكنة وعدم تجانس اللون في الإمارات، مع سيروم وكريم GENOSYS وواقي الشمس اليومي.',
        h1: 'العناية بالتصبغات وإشراق البشرة',
        heroShort: 'روتين كوري احترافي يساعد على تقليل مظهر البقع الداكنة وتوحيد اللون واستعادة الإشراق بالنياسيناميد وفيتامين C الثابت.',
        intro: 'قد يجعل التعرض القوي للشمس طوال العام في الإمارات البقع الداكنة وعدم تجانس اللون أكثر وضوحاً. يجمع خط GENOSYS Multi Vita Radiance بين النياسيناميد 2% ومشتق فيتامين C الثابت ضمن روتين صباحي ومسائي يكتمل بواقي الشمس. وتجمع SKIN BRIGHTENING BEAUTY BOX الروتين اليومي مع جل تقشير وقناع يستخدمان في مساءين منفصلين.',
        keywords: ['علاج التصبغات الإمارات', 'البقع الداكنة دبي', 'تفتيح البشرة الإمارات', 'كريم تفتيح كوري'],
      },
      ru: {
        title: 'Уход при пигментации в ОАЭ | Тёмные пятна и сияние кожи | GENOSYS',
        description: 'Профессиональный корейский уход за тёмными пятнами и неровным тоном в ОАЭ: сыворотка и крем GENOSYS плюс ежедневная защита от солнца.',
        h1: 'Уход при пигментации и для сияния кожи',
        heroShort: 'Профессиональный корейский уход помогает сделать тёмные пятна менее заметными, выровнять тон и вернуть сияние с ниацинамидом и стабильным витамином C.',
        intro: 'Интенсивное солнце в ОАЭ круглый год может делать тёмные пятна и неровный тон заметнее. Линия GENOSYS Multi Vita Radiance сочетает ниацинамид 2% и стабильное производное витамина C в утреннем и вечернем уходе, который дополняют защитой от солнца. SKIN BRIGHTENING BEAUTY BOX добавляет к ежедневной базе пилинг-гель и маску для разных вечеров.',
        keywords: ['лечение пигментации ОАЭ', 'тёмные пятна Дубай', 'осветление кожи ОАЭ', 'корейская сыворотка осветляющая'],
      },
    },
    routine: {
      en: [
        {
          title: 'Morning Routine',
          subtitle: 'Brighten & protect — takes just 5 minutes',
          steps: [
            {
              step: 1, title: 'Cleanse', duration: '1 min',
              summary: 'Remove overnight oils so brightening actives can penetrate effectively.',
              detail: 'Apply to a dry face, let the oxygen bubbles form naturally — they lift impurities and dullness from pores without rubbing. Rinse with lukewarm water and pat dry.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Tone & Hydrate', duration: '30 sec',
              summary: 'Restore pH and create a hydrated base. Brightening serums absorb more evenly on prepped skin.',
              detail: 'Spray mist or apply toner with hands, gently pressing into skin. Move to the next step immediately — no wait needed.',
              products: [
                { name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' },
                { name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' },
              ],
            },
            {
              step: 3, title: 'Brightening Serum', duration: '30 sec',
              summary: 'Core brightening step — vitamin C, niacinamide and arbutin inhibit melanin production.',
              detail: 'Apply 2–3 drops of Multi Vita Radiance Serum and pat gently into the skin, focusing on areas with dark spots or uneven tone. Wait 30 seconds for absorption.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'Brightening Cream', duration: '30 sec',
              summary: 'Seal in brightening actives and provide lasting moisture with additional radiance boosters.',
              detail: 'Apply a pea-sized amount of Multi Vita Radiance Cream over the serum. For extra hydration, layer Hyaluron Cream underneath on dry patches.',
              products: [
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'Sun Protection', duration: '30 sec',
              summary: 'The most critical step for pigmentation — UV exposure undoes all brightening progress.',
              detail: 'Apply a 2-finger length strip of ULTRA SHIELD SPF 50+ to face and neck. Without daily SPF, dark spots will return regardless of serums and creams used.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Evening Routine',
          subtitle: 'Repair and brighten overnight while skin regenerates',
          steps: [
            {
              step: 1, title: 'Double Cleanse', duration: '2 min',
              summary: 'Remove SPF and makeup thoroughly — residue blocks brightening actives from penetrating.',
              detail: 'First cleanse: Makeup remover to dissolve SPF and makeup from eye/lip area. Second cleanse: Oxygen cleanser to deep-clean residual sunscreen and impurities.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Exfoliate (2–3× per week)', duration: '1 min',
              summary: 'Remove dead skin cells that trap melanin — reveals brighter skin underneath.',
              detail: 'Apply peeling gel to dry skin and massage gently in circular motions for 30 seconds. Dead cells roll off visibly. Rinse thoroughly. Use 2–3 times per week, not daily.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'Brightening Serum', duration: '30 sec',
              summary: 'Night is when skin regenerates — brightening actives work harder while you sleep.',
              detail: 'Apply 2–3 drops of Multi Vita Radiance Serum, focusing on pigmented areas. Night-time application allows vitamin C and niacinamide to work without UV interference.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'Night Cream', duration: '30 sec',
              summary: 'Seal in active ingredients and support skin barrier repair overnight.',
              detail: 'Choose by skin type: Barrier Protecting Cream for all types (strongest barrier support), Radiance Cream for dull/pigmented skin, Hyaluron Cream for dry/dehydrated skin.',
              products: [
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
              ],
            },
          ],
        },
      ],
      ar: [
        {
          title: 'الروتين الصباحي',
          subtitle: 'تفتيح وحماية — 5 دقائق فقط',
          steps: [
            {
              step: 1, title: 'التنظيف', duration: 'دقيقة واحدة',
              summary: 'إزالة الزيوت الليلية حتى تتغلغل المكونات المفتحة بفعالية.',
              detail: 'ضعي على الوجه الجاف، دعي فقاعات الأكسجين تتشكل طبيعياً — ترفع الشوائب والبهتان من المسام بدون فرك. اشطفي بماء فاتر وجففي بالتربيت.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'التونر والترطيب', duration: '30 ثانية',
              summary: 'ترطيب البشرة بعد التنظيف وتهيئتها لخطوات العناية التالية.',
              detail: 'رشي SNOW BOOSTER أو الميست، أو وزعي التونر باليدين، ثم اضغطي برفق حتى يمتص.',
              products: [
                { name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' },
                { name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' },
              ],
            },
            {
              step: 3, title: 'سيروم التفتيح', duration: '30 ثانية',
              summary: 'الخطوة الأساسية للإشراق مع النياسيناميد 2% وفيتامين C الثابت 0.1% وMELAZERO®.',
              detail: 'تُربت قطرتان إلى ثلاث من سيروم Multi Vita Radiance على الوجه مع تجنب محيط العينين. للبشرة الحساسة، يُبدأ بكمية صغيرة ويُزاد الاستخدام تدريجياً.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم الإشراق المغذي', duration: '30 ثانية',
              summary: 'نياسيناميد 2% مع زيت المكاداميا 13% لتوحيد مظهر اللون وراحة البشرة العادية والجافة.',
              detail: 'وزعي كمية صغيرة من كريم Multi Vita Radiance فوق السيروم بحركات لطيفة. استخدميه كخطوة ختامية مساءً، وطبقي واقي الشمس فوقه صباحاً.',
              products: [
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'الخطوة الأهم للتصبغات — التعرض للأشعة فوق البنفسجية يلغي كل تقدم التفتيح.',
              detail: 'يوزع ULTRA SHIELD SPF 50+ بسخاء وبالتساوي قبل الخروج بـ15 دقيقة على الأقل، ويجدد كل ساعتين على الأقل في الخارج وبعد الماء أو التعرق.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'إصلاح وتفتيح ليلاً أثناء تجدد البشرة',
          steps: [
            {
              step: 1, title: 'التنظيف المزدوج', duration: 'دقيقتان',
              summary: 'إزالة واقي الشمس والمكياج بالكامل — البقايا تمنع المكونات المفتحة من التغلغل.',
              detail: 'التنظيف الأول: مزيل المكياج لإذابة SPF والمكياج. التنظيف الثاني: منظف الأكسجين لتنظيف عميق لبقايا واقي الشمس والشوائب.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'التقشير (2-3 مرات أسبوعياً)', duration: 'دقيقة واحدة',
              summary: 'إزالة خلايا الجلد الميتة التي تحبس الميلانين — يكشف عن بشرة أكثر إشراقاً.',
              detail: 'ضعي جل التقشير على البشرة الجافة ودلكي برفق بحركات دائرية لمدة 30 ثانية. الخلايا الميتة تتقشر بشكل واضح. اشطفي جيداً. استخدمي 2-3 مرات أسبوعياً وليس يومياً.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'سيروم التفتيح', duration: '30 ثانية',
              summary: 'عناية مسائية مركزة لعدم تجانس اللون ومظهر البقع الداكنة.',
              detail: 'تُربت قطرتان إلى ثلاث من سيروم Multi Vita Radiance بعد التونر، ثم يوضع الكريم. إذا استمر الوخز أو ظهر تهيج، يجب إيقاف الاستخدام.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم الليل', duration: '30 ثانية',
              summary: 'اختتام الروتين المسائي بطبقة كريمية تحافظ على الرطوبة.',
              detail: 'يُختار الكريم حسب احتياج البشرة: SKIN BARRIER PROTECTING للبشرة الحساسة والجافة، وRadiance للبشرة الباهتة أو غير المتجانسة، وHyaluron للبشرة التي ينقصها الماء.',
              products: [
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
              ],
            },
          ],
        },
      ],
      ru: [
        {
          title: 'Утренний уход',
          subtitle: 'Осветление и защита — всего 5 минут',
          steps: [
            {
              step: 1, title: 'Очищение', duration: '1 мин',
              summary: 'Удалите ночные масла, чтобы осветляющие активы могли эффективно проникнуть.',
              detail: 'Нанесите на сухое лицо, дайте кислородным пузырькам образоваться естественно — они поднимают загрязнения и тусклость из пор без трения. Смойте тёплой водой и промокните полотенцем.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Тоник и увлажнение', duration: '30 сек',
              summary: 'Увлажните кожу после очищения и подготовьте её к следующим этапам ухода.',
              detail: 'Распылите SNOW BOOSTER или мист либо нанесите тоник руками, затем мягко прижмите до впитывания.',
              products: [
                { name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' },
                { name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' },
              ],
            },
            {
              step: 3, title: 'Осветляющая сыворотка', duration: '30 сек',
              summary: 'Главный шаг для сияния с ниацинамидом 2%, стабильным витамином C 0,1% и MELAZERO®.',
              detail: 'Мягко вбейте 2–3 капли сыворотки Multi Vita Radiance, избегая области вокруг глаз. При чувствительной коже начните с небольшого количества и наращивайте применение постепенно.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'Питательный крем для сияния', duration: '30 сек',
              summary: 'Ниацинамид 2% и масло макадамии 13% помогают выровнять тон и вернуть комфорт нормальной и сухой коже.',
              detail: 'Распределите небольшое количество Multi Vita Radiance Cream поверх сыворотки. Вечером используйте как завершающий этап, утром нанесите сверху SPF.',
              products: [
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'Защита от солнца', duration: '30 сек',
              summary: 'Самый важный шаг при пигментации — УФ-воздействие сводит на нет весь прогресс осветления.',
              detail: 'Равномерно и щедро нанесите ULTRA SHIELD SPF 50+ минимум за 15 минут до выхода. Обновляйте не реже чем каждые два часа на улице, а также после воды или пота.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Восстановление и осветление ночью, пока кожа регенерирует',
          steps: [
            {
              step: 1, title: 'Двойное очищение', duration: '2 мин',
              summary: 'Тщательно удалите SPF и макияж — остатки блокируют проникновение осветляющих активов.',
              detail: 'Первое очищение: средство для снятия макияжа для растворения SPF с зон глаз и губ. Второе очищение: кислородный гель для глубокой очистки от остатков санскрина и загрязнений.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Пилинг (2–3 раза в неделю)', duration: '1 мин',
              summary: 'Удалите мёртвые клетки кожи, которые задерживают меланин — открывает более светлую кожу.',
              detail: 'Нанесите пилинг-гель на сухую кожу и массируйте мягкими круговыми движениями 30 секунд. Мёртвые клетки скатываются визуально. Тщательно смойте. Используйте 2–3 раза в неделю, не ежедневно.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'Осветляющая сыворотка', duration: '30 сек',
              summary: 'Целенаправленный вечерний уход за неровным тоном и заметными тёмными пятнами.',
              detail: 'После тоника мягко вбейте 2–3 капли сыворотки Multi Vita Radiance, затем нанесите крем. Если пощипывание не проходит или появляется раздражение, прекратите применение.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'Ночной крем', duration: '30 сек',
              summary: 'Завершите вечерний уход кремом, который поможет сохранить влагу.',
              detail: 'Выбирайте по потребностям кожи: SKIN BARRIER PROTECTING для чувствительной и сухой, Radiance для тусклой кожи и неровного тона, Hyaluron для обезвоженной.',
              products: [
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
              ],
            },
          ],
        },
      ],
    },
    faq: {
      en: [
        { question: 'What causes pigmentation in the UAE and how to treat it?', answer: 'Pigmentation in the UAE is primarily caused by intense UV exposure (UV index regularly exceeds 11), hormonal changes (especially during pregnancy or with contraceptives), and post-inflammatory hyperpigmentation from acne. GENOSYS Multi Vita Radiance Serum and Cream contain vitamin C, niacinamide, and arbutin — a triple-action Korean brightening complex that inhibits tyrosinase enzyme activity and gradually fades existing dark spots. For best results, always combine with SPF 50+ sun protection to prevent new melanin production.' },
        { question: 'Are Korean brightening products safe for dark skin tones?', answer: 'Yes, GENOSYS brightening products are formulated to be safe for all skin tones, including Fitzpatrick types IV–VI common in the Middle East, South Asia, and Africa. They work by regulating melanin production through tyrosinase inhibition rather than bleaching or stripping, making them safer and more effective for long-term use. All products are dermatologically tested and free from hydroquinone.' },
        { question: 'How long does it take to see results from brightening products?', answer: 'Most users notice a visible improvement in skin radiance within 2–3 weeks of consistent use. Significant fading of dark spots typically takes 6–8 weeks with twice-daily application of Multi Vita Radiance Serum + Cream. Deeper melasma or long-standing pigmentation may take 3–4 months. Consistency and daily SPF 50+ are the two biggest factors for faster results.' },
        { question: 'Can I combine brightening products with retinol?', answer: 'Yes, but introduce them separately. Use vitamin C / niacinamide-based brightening products (Multi Vita Radiance Serum) in the morning under SPF, and retinol in the evening. Do not layer vitamin C and retinol in the same routine as they work best at different pH levels. If you experience sensitivity, alternate evenings — brightening serum one night, retinol the next.' },
        { question: 'What SPF should I use with a brightening routine?', answer: 'SPF 50+ broad-spectrum is non-negotiable when treating pigmentation. UV exposure is the #1 trigger for melanin overproduction, so even the best brightening serum will not work without daily sun protection. ULTRA SHIELD SUN CREAM SPF 50+ is specifically designed to complement the Multi Vita Radiance line — lightweight, non-greasy, and suitable for use under makeup in UAE heat.' },
        { question: 'What is the difference between the brightening serum and cream?', answer: 'Multi Vita Radiance Serum (330 AED) delivers concentrated brightening actives — vitamin C, niacinamide, arbutin — in a lightweight, fast-absorbing formula that penetrates deep into the skin. Multi Vita Radiance Cream (290 AED) provides the same brightening complex in a richer, moisturising base that seals in actives and provides lasting hydration. For best results, use both: serum first for treatment, cream on top to lock in and nourish.' },
      ],
      ar: [
        { question: 'لماذا تبدو البقع الداكنة أوضح في الإمارات؟', answer: 'قد يزيد التعرض القوي والمتكرر للشمس من وضوح تفاوت اللون. يُستخدم سيروم Multi Vita Radiance صباحاً ومساءً للعناية بمظهر البقع، مع واقي شمس واسع الطيف كل صباح.' },
        { question: 'ما المكونات الأساسية في سيروم Multi Vita Radiance؟', answer: 'يحتوي السيروم على النياسيناميد 2%، وفيتامين C الثابت 0.1%، وMELAZERO® من مستخلص الأسكدنيا 0.04% والنعناع السنبلي 0.01%، مع البانثينول 1% لدعم راحة البشرة.' },
        { question: 'متى قيس تحسن مظهر اللون؟', answer: 'بعد أسبوعين، انخفض مؤشر الميلانين السطحي من 6.190 إلى 4.457، أي بنسبة 28.0%. قد تختلف النتيجة الفردية بحسب حالة البشرة والالتزام بواقي الشمس.' },
        { question: 'ما واقي الشمس المناسب مع روتين الإشراق؟', answer: 'يُنصح بواقي شمس واسع الطيف بدرجة SPF 50+ كل صباح. ULTRA SHIELD SUN CREAM SPF 50+ خفيف وملائم للاستخدام تحت المكياج في أجواء الإمارات.' },
      ],
      ru: [
        { question: 'Почему тёмные пятна в ОАЭ могут выглядеть заметнее?', answer: 'Интенсивное и регулярное солнце может усиливать контраст неровного тона. Сыворотку Multi Vita Radiance используют утром и вечером для ухода за видимыми пятнами, а каждое утро наносят солнцезащитное средство широкого спектра.' },
        { question: 'Какие ключевые компоненты в сыворотке Multi Vita Radiance?', answer: 'Формула содержит ниацинамид 2%, стабильный витамин C 0,1%, MELAZERO® из мушмулы 0,04% и мяты колосистой 0,01%, а также пантенол 1% для поддержки комфорта кожи.' },
        { question: 'Когда измерили изменение тона?', answer: 'Через две недели показатель поверхностного меланина снизился с 6,190 до 4,457, то есть на 28,0%. Индивидуальный результат зависит от состояния кожи и регулярной защиты от солнца.' },
        { question: 'Какой SPF использовать в уходе для сияния?', answer: 'Каждое утро нужен солнцезащитный крем широкого спектра SPF 50+. ULTRA SHIELD SUN CREAM SPF 50+ имеет лёгкую текстуру и подходит для нанесения под макияж в климате ОАЭ.' },
      ],
    },
  },

  // ─── SCARS TREATMENT ──────────────────────────────────────────
  {
    slug: 'scars-treatment',
    icon: '🧬',
    concernKeys: ['scar-repair'],
    categoryFallbacks: [],
    relatedConcerns: ['acne-treatment', 'pigmentation', 'anti-aging'],
    protocolPdf: {
      url: '/documents/PPT/Protocol_scar.pdf',
      title: {
        en: 'Scar Treatment & Skin Repair Home Care Protocol',
        ar: 'بروتوكول العناية المنزلية بعلاج الندبات وإصلاح البشرة',
        ru: 'Протокол домашнего ухода при рубцах и восстановлении кожи',
      },
      description: {
        en: 'Complete morning & evening routine for scar treatment — EGF regeneration, micro-exfoliation schedule, product sets by scar type, and post-procedure care tips.',
        ar: 'روتين صباحي ومسائي كامل لعلاج الندبات — تجديد EGF، جدول التقشير الدقيق، مجموعات منتجات حسب نوع الندبة، ونصائح العناية بعد الإجراءات.',
        ru: 'Полный утренний и вечерний уход при рубцах — EGF-регенерация, график микроэксфолиации, наборы по типу рубца и уход после процедур.',
      },
      fileSize: '263 KB',
    },
    why: {
      en: {
        title: 'Why Scars Need a Specialised Repair Strategy',
        items: [
          { icon: '🧬', label: 'Collagen Remodelling', detail: 'Scars are collagen disruptions — flat, raised or pitted, they all result from abnormal wound healing. Effective treatment must trigger controlled collagen remodelling to rebuild smooth, even texture' },
          { icon: '🔬', label: 'EGF Technology', detail: 'Epidermal Growth Factor (EGF) accelerates skin cell turnover and repair. GENOSYS Soothing Repair Postcream delivers concentrated EGF directly to scar tissue for faster regeneration' },
          { icon: '🪡', label: 'Microneedling Synergy', detail: 'GENOSYS professional microneedling devices create thousands of micro-channels that trigger the body\'s wound-healing cascade — when paired with EGF repair serums, results multiply significantly' },
          { icon: '☀️', label: 'UV Protection Critical', detail: 'Sun exposure darkens scars permanently by stimulating excess melanin in damaged tissue. Daily SPF 50+ is non-negotiable during any scar treatment protocol' },
        ],
      },
      ar: {
        title: 'لماذا تحتاج الندبات استراتيجية إصلاح متخصصة',
        items: [
          { icon: '🧬', label: 'إعادة بناء الكولاجين', detail: 'الندبات هي اضطرابات في الكولاجين — مسطحة أو بارزة أو غائرة، كلها ناتجة عن التئام غير طبيعي للجروح. العلاج الفعال يجب أن يحفز إعادة بناء الكولاجين بشكل متحكم' },
          { icon: '🔬', label: 'تقنية عامل نمو البشرة', detail: 'عامل نمو البشرة (EGF) يسرّع تجديد خلايا الجلد وإصلاحها. كريم GENOSYS للإصلاح المهدئ وقناع EGF يوصلان تركيزات عالية من EGF مباشرة إلى أنسجة الندبات' },
          { icon: '🪡', label: 'تآزر الوخز بالإبر الدقيقة', detail: 'أجهزة GENOSYS للوخز بالإبر الدقيقة تُنشئ آلاف القنوات الدقيقة التي تحفز آلية التئام الجروح الطبيعية — عند دمجها مع سيرومات EGF تتضاعف النتائج بشكل ملحوظ' },
          { icon: '☀️', label: 'الحماية من الشمس ضرورية', detail: 'التعرض للشمس يغمّق الندبات بشكل دائم عن طريق تحفيز الميلانين الزائد في الأنسجة المتضررة. واقي الشمس SPF 50+ يومياً أمر لا يقبل التفاوض أثناء أي بروتوكول لعلاج الندبات' },
        ],
      },
      ru: {
        title: 'Почему рубцы требуют специализированной стратегии восстановления',
        items: [
          { icon: '🧬', label: 'Ремоделирование коллагена', detail: 'Рубцы — это нарушения коллагена: плоские, выпуклые или атрофические — все они результат аномального заживления ран. Эффективное лечение должно запускать контролируемое ремоделирование коллагена для восстановления гладкой текстуры' },
          { icon: '🔬', label: 'Технология EGF', detail: 'Эпидермальный фактор роста (EGF) ускоряет обновление и восстановление клеток кожи. Крем GENOSYS Soothing Repair Postcream доставляет концентрированный EGF непосредственно в рубцовую ткань' },
          { icon: '🪡', label: 'Синергия с микронидлингом', detail: 'Профессиональные роллеры GENOSYS для микронидлинга создают тысячи микроканалов, запускающих каскад заживления — в сочетании с восстанавливающими сыворотками EGF результаты значительно усиливаются' },
          { icon: '☀️', label: 'УФ-защита критична', detail: 'Солнце навсегда затемняет рубцы, стимулируя избыточный меланин в повреждённых тканях. Ежедневный SPF 50+ обязателен при любом протоколе ухода при рубцах' },
        ],
      },
    },
    seo: {
      en: {
        title: 'Scars Treatment UAE | Acne Scars & Microneedling Dubai | GENOSYS',
        description: 'Professional scar treatment solutions in UAE. GENOSYS microneedling devices & repair serums for acne scars, surgical scars & skin texture. Used by Dubai dermatologists. Free shipping over 1000 AED.',
        h1: 'Scar Treatment & Skin Repair',
        heroShort: 'Professional EGF repair creams & microneedling serums — rebuild collagen, smooth scar tissue and restore even skin texture with epidermal growth factor technology.',
        intro: 'Scar treatment requires a multi-faceted approach combining professional devices with targeted skincare. GENOSYS offers industry-leading microneedling devices (Needle Pen-K, Microneedle Roller) alongside repair serums and post-treatment creams that accelerate skin regeneration. Our microneedling technology creates controlled micro-channels that trigger the skin\'s natural collagen production, effectively improving the appearance of acne scars, surgical scars, and uneven texture. These same devices and protocols are used by licensed dermatologists across Dubai, Abu Dhabi, and Sharjah.',
        keywords: ['scar treatment UAE', 'acne scars Dubai', 'microneedling scars UAE', 'scar removal Dubai', 'Korean scar treatment', 'microneedling devices UAE', 'post-acne scars treatment'],
      },
      ar: {
        title: 'علاج الندبات الإمارات | ندبات حب الشباب والوخز بالإبر الدقيقة دبي | GENOSYS',
        description: 'حلول احترافية لعلاج الندبات في الإمارات. رولرات الميكرونيدلينغ وسيرومات الإصلاح من GENOSYS لندبات حب الشباب وتحسين ملمس البشرة. توصيل مجاني فوق 1000 درهم.',
        h1: 'علاج الندبات وإصلاح البشرة',
        heroShort: 'كريمات إصلاح EGF احترافية وسيرومات الوخز بالإبر الدقيقة — إعادة بناء الكولاجين وتنعيم أنسجة الندبات واستعادة ملمس البشرة المتساوي بتقنية عامل نمو البشرة.',
        intro: 'يتطلب علاج الندبات نهجاً متعدد الجوانب يجمع بين أدوات الميكرونيدلينغ الاحترافية والعناية المستهدفة بالبشرة. تقدم GENOSYS رولرات ميكرونيدلينغ مع سيرومات إصلاح وكريمات ما بعد العلاج لتسريع تجديد البشرة.',
        keywords: ['علاج الندبات الإمارات', 'ندبات حب الشباب دبي', 'الوخز بالإبر الدقيقة للندبات', 'إزالة الندبات دبي'],
      },
      ru: {
        title: 'Уход при рубцах ОАЭ | Постакне и микронидлинг Дубай | GENOSYS',
        description: 'Профессиональный уход при рубцах в ОАЭ. Роллеры для микронидлинга и восстанавливающие сыворотки GENOSYS для постакне и неровной текстуры кожи. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Уход при рубцах и восстановление кожи',
        heroShort: 'Профессиональные восстанавливающие кремы с EGF и сыворотки для микронидлинга — восстановление коллагена, разглаживание рубцовой ткани и выравнивание текстуры кожи с технологией эпидермального фактора роста.',
        intro: 'Уход при рубцах требует комплексного подхода, сочетающего профессиональные роллеры и целенаправленный уход. GENOSYS предлагает профессиональные роллеры для микронидлинга вместе с восстанавливающими сыворотками и кремами для ускорения регенерации кожи.',
        keywords: ['лечение рубцов ОАЭ', 'постакне Дубай', 'микронидлинг рубцы ОАЭ', 'удаление рубцов Дубай'],
      },
    },
    routine: {
      en: [
        {
          title: 'Morning Routine',
          subtitle: 'Repair, hydrate & protect — 5 steps to shield healing skin',
          steps: [
            {
              step: 1, title: 'Gentle Cleanse', duration: '1 min',
              summary: 'Remove overnight oils without irritating scar tissue.',
              detail: 'Apply SNOW O₂ CLEANSER to a dry face, let the oxygen bubbles form naturally — they lift impurities gently without rubbing or aggravating sensitive scar areas. Rinse with lukewarm water and pat dry.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Tone', duration: '30 sec',
              summary: 'Restore pH balance and prep skin for repair actives.',
              detail: 'Apply SNOW BOOSTER with hands, pressing gently into skin. This creates a hydrated base that helps EGF and hyaluronic acid penetrate more effectively into scar tissue.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Hyaluron Serum', duration: '30 sec',
              summary: 'Keep scar tissue hydrated — dehydrated scars appear more pronounced and heal slower.',
              detail: 'Apply 2–3 drops of Hyaluron Serum and pat gently over the entire face with emphasis on scarred areas. Hyaluronic acid draws moisture into the tissue, plumping indented scars and creating an optimal environment for repair.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'Soothing Postcream', duration: '30 sec',
              summary: 'Core EGF repair step — epidermal growth factor accelerates cell regeneration in scar tissue.',
              detail: 'Apply a pea-sized amount of Soothing Repair Postcream, focusing on scarred areas. EGF signals skin cells to regenerate faster, gradually replacing disorganised scar collagen with healthy tissue. Use daily for cumulative results.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 5, title: 'Sun Protection', duration: '30 sec',
              summary: 'Critical to prevent scar darkening — UV permanently pigments healing tissue.',
              detail: 'Apply a 2-finger length strip of ULTRA SHIELD SPF 50+ to face and neck. Scar tissue is especially vulnerable to UV damage — unprotected sun exposure causes scars to darken permanently, undoing all repair progress.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Evening Routine',
          subtitle: 'Deep repair overnight while skin regenerates',
          steps: [
            {
              step: 1, title: 'Double Cleanse', duration: '2 min',
              summary: 'Remove SPF and impurities thoroughly — residue blocks repair actives from penetrating scar tissue.',
              detail: 'First cleanse: SKIN DEFENDER removes SPF and makeup from eye/lip area. Second cleanse: SNOW O₂ CLEANSER deep-cleans residual sunscreen and environmental buildup without stripping the skin barrier.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Exfoliate (2–3× per week)', duration: '1 min',
              summary: 'Remove dead cells that trap discoloured scar tissue — reveals smoother skin underneath.',
              detail: 'Apply EPI TURNOVER Peeling Gel to dry skin and massage gently in circular motions for 30 seconds. Dead cells roll off visibly. Rinse thoroughly. Use 2–3 times per week — not daily, as over-exfoliation can irritate healing scars.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'PDRN Repair Mask', duration: '15–20 min',
              summary: 'Intensive PDRN repair — salmon DNA stimulates collagen remodelling in scar tissue.',
              detail: 'Apply SKIN REBOOT PDRN MASK PACK 2–3 times per week in the evening. PDRN (salmon DNA) promotes tissue regeneration and collagen synthesis in scar tissue, while the spicule texture boosts absorption. Remove after 15–20 minutes and pat in the remaining essence.',
              products: [{ name: 'SKIN REBOOT PDRN MASK PACK', url: '/products/52', price: '400 AED' }],
            },
            {
              step: 4, title: 'Barrier Cream', duration: '30 sec',
              summary: 'Seal in repair actives and protect the skin barrier overnight.',
              detail: 'Apply SKIN BARRIER PROTECTING CREAM to lock in the repair actives and prevent transepidermal water loss while you sleep. A strong barrier is essential for scar healing — compromised barriers slow collagen production.',
              products: [{ name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' }],
            },
          ],
        },
      ],
      ar: [
        {
          title: 'الروتين الصباحي',
          subtitle: 'إصلاح وترطيب وحماية — 5 خطوات لحماية البشرة أثناء التعافي',
          steps: [
            {
              step: 1, title: 'التنظيف اللطيف', duration: 'دقيقة واحدة',
              summary: 'إزالة الزيوت الليلية دون تهييج أنسجة الندبات.',
              detail: 'ضعي SNOW O₂ CLEANSER على الوجه الجاف، دعي فقاعات الأكسجين تتشكل طبيعياً — ترفع الشوائب برفق دون فرك المناطق الحساسة. اشطفي بماء فاتر وجففي بالتربيت.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'التونر', duration: '30 ثانية',
              summary: 'إعادة الرطوبة والراحة إلى البشرة بعد التنظيف.',
              detail: 'ضعي SNOW BOOSTER باليدين واضغطي برفق حتى يمتص، ثم انتقلي إلى السيروم.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'سيروم الهيالورون', duration: '30 ثانية',
              summary: 'ترطيب خفيف يساعد البشرة على الظهور بمظهر أكثر نعومة وراحة.',
              detail: 'ضعي 2-3 قطرات على الوجه وربّتي بلطف من دون فرك المناطق الحساسة. يجمع السيروم حمض الهيالورونيك المتحلل 2,000 جزء في المليون مع PENTAVITIN بنسبة 0.615% لدعم الترطيب، من دون ادعاء ملء الندبات.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم مهدئ', duration: '30 ثانية',
              summary: 'ترطيب مريح يساعد على تخفيف إحساس الشد في البشرة السليمة.',
              detail: 'ضعي كمية صغيرة من Soothing Repair Postcream على البشرة السليمة فقط وربّتي بلطف. قاعدة الترطيب 18.39% مع ثلاثة مكوّنات مهدئة بتركيز 0.2% لكل منها تدعم الراحة، من دون ادعاء تغيير نسيج الندبة.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 5, title: 'واقي الشمس', duration: '30 ثانية',
              summary: 'ضروري لمنع تغمّق الندبات — الأشعة فوق البنفسجية تصبّغ الأنسجة المتعافية بشكل دائم.',
              detail: 'يوزع ULTRA SHIELD SPF 50+ بسخاء وبالتساوي قبل الخروج بـ15 دقيقة على الأقل، ويجدد كل ساعتين على الأقل في الخارج وبعد الماء أو التعرق.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'إصلاح عميق أثناء الليل بينما تتجدد البشرة',
          steps: [
            {
              step: 1, title: 'التنظيف المزدوج', duration: 'دقيقتان',
              summary: 'إزالة واقي الشمس والشوائب بالكامل — البقايا تمنع المكونات الإصلاحية من التغلغل.',
              detail: 'التنظيف الأول: SKIN DEFENDER لإزالة واقي الشمس والمكياج. التنظيف الثاني: SNOW O₂ CLEANSER لتنظيف عميق للبقايا دون تجريد حاجز البشرة.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'التقشير (2-3 مرات أسبوعياً)', duration: 'دقيقة واحدة',
              summary: 'إزالة الخلايا الميتة التي تحبس أنسجة الندبات المتغيرة اللون — يكشف عن بشرة أنعم.',
              detail: 'ضعي جل التقشير على البشرة الجافة ودلكي بحركات دائرية لمدة 30 ثانية. الخلايا الميتة تتساقط بشكل مرئي. اشطفي جيداً. استخدمي 2-3 مرات أسبوعياً — ليس يومياً لتجنب تهييج الندبات.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'كريم الحاجز', duration: '30 ثانية',
              summary: 'الحفاظ على الرطوبة بطبقة كريمية غنية طوال الليل.',
              detail: 'يُطبق SKIN BARRIER PROTECTING CREAM كخطوة أخيرة. يساعد سيراميد NP بتركيز ٠٫٥٪ والغليسرين ١٧٫٤٩٪ على دعم حاجز البشرة وتقليل فقدان الرطوبة.',
              products: [{ name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' }],
            },
          ],
        },
      ],
      ru: [
        {
          title: 'Утренний уход',
          subtitle: 'Восстановление, увлажнение и защита — 5 шагов для заживающей кожи',
          steps: [
            {
              step: 1, title: 'Бережное очищение', duration: '1 мин',
              summary: 'Удалите ночные выделения, не раздражая рубцовую ткань.',
              detail: 'Нанесите SNOW O₂ CLEANSER на сухое лицо, дайте кислородным пузырькам сформироваться — они мягко поднимают загрязнения без трения чувствительных зон. Смойте тёплой водой и промокните.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Тонизирование', duration: '30 сек',
              summary: 'Верните коже влагу и комфорт после очищения.',
              detail: 'Нанесите SNOW BOOSTER руками, мягко прижмите до впитывания и переходите к сыворотке.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Гиалуроновая сыворотка', duration: '30 сек',
              summary: 'Лёгкое увлажнение помогает коже выглядеть более гладкой и чувствовать себя комфортнее.',
              detail: 'Нанесите 2–3 капли на лицо и мягко вбейте, не растирая чувствительные участки. Гидролизованная гиалуроновая кислота 2 000 ppm и PENTAVITIN 0,615% поддерживают увлажнение, не обещая заполнить рубцы.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'Успокаивающий крем', duration: '30 сек',
              summary: 'Комфортное увлажнение помогает уменьшить чувство стянутости целой кожи.',
              detail: 'Нанесите небольшое количество Soothing Repair Postcream только на целую кожу и мягко вбейте. Увлажняющая база 18,39% и три успокаивающих компонента по 0,2% поддерживают комфорт, не обещая изменить структуру рубца.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 5, title: 'Солнцезащита', duration: '30 сек',
              summary: 'Критически важно для предотвращения потемнения рубцов — УФ навсегда пигментирует заживающую ткань.',
              detail: 'Равномерно и щедро нанесите ULTRA SHIELD SPF 50+ минимум за 15 минут до выхода. Обновляйте не реже чем каждые два часа на улице, а также после воды или пота.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Глубокое восстановление за ночь, пока кожа регенерирует',
          steps: [
            {
              step: 1, title: 'Двойное очищение', duration: '2 мин',
              summary: 'Тщательно удалите SPF и загрязнения — остатки блокируют проникновение восстанавливающих активов.',
              detail: 'Первый этап: SKIN DEFENDER удаляет SPF и макияж. Второй этап: SNOW O₂ CLEANSER глубоко очищает от остатков санскрина и загрязнений, не нарушая барьер кожи.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Пилинг (2–3 раза в неделю)', duration: '1 мин',
              summary: 'Удалите мёртвые клетки, удерживающие обесцвеченную рубцовую ткань — открывает более гладкую кожу.',
              detail: 'Нанесите пилинг-гель на сухую кожу и массируйте круговыми движениями 30 секунд. Мёртвые клетки скатываются. Тщательно смойте. Используйте 2–3 раза в неделю — не ежедневно, чтобы не раздражать рубцы.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'Барьерный крем', duration: '30 сек',
              summary: 'Сохраните влагу под насыщенным кремовым слоем в течение ночи.',
              detail: 'Нанесите SKIN BARRIER PROTECTING CREAM завершающим шагом. Церамид NP 0,5% и глицерин 17,49% помогают поддерживать защитный барьер и уменьшать потерю влаги.',
              products: [{ name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' }],
            },
          ],
        },
      ],
    },
    faq: {
      en: [
        { question: 'Can microneedling remove acne scars?', answer: 'Yes, microneedling is one of the most effective treatments for acne scars. GENOSYS microneedling devices create thousands of micro-channels in the skin, triggering natural collagen and elastin production that fills in scar tissue over multiple sessions. Clinical studies show 60-80% improvement in scar appearance after 3-6 sessions. GENOSYS also provides post-treatment serums (Power Solutions) that accelerate healing and maximize results.' },
        { question: 'What GENOSYS products are best for scar treatment at home?', answer: 'For home scar treatment, we recommend the GENOSYS Microneedle Roller combined with the Soothing Repair Postcream (204 AED) and SKIN REBOOT PDRN MASK PACK (400 AED). The roller creates micro-channels for better product absorption, while the Postcream contains EGF (Epidermal Growth Factor) and the PDRN mask delivers salmon DNA that promotes skin cell regeneration. Pair with Hyaluron Serum (330 AED) for hydration and ULTRA SHIELD SPF 50+ (250 AED) to prevent scar darkening.' },
        { question: 'How long does it take to see improvement in scars?', answer: 'Results depend on scar type and severity. Surface-level post-acne marks may start fading within 4–6 weeks of consistent EGF use. Deeper atrophic (pitted) scars typically show noticeable improvement after 8–12 weeks with a combined routine of daily EGF Postcream, twice-weekly exfoliation, and a PDRN repair mask in the evening. Professional microneedling can accelerate results — most patients see 40–60% improvement after 3 sessions spaced 4 weeks apart.' },
        { question: 'Can I treat old scars that are several years old?', answer: 'Yes, even mature scars respond to treatment — though they require more patience. Old scars have settled collagen structures, but EGF (Epidermal Growth Factor) can still stimulate new cell turnover and gradual remodelling. The Soothing Repair Postcream and SKIN REBOOT PDRN MASK PACK work over time to soften rigid scar tissue and improve texture. Microneedling is especially effective for old scars because it forces the skin to restart the wound-healing cascade. Expect 3–6 months of consistent use for visible improvement on scars older than 2 years.' },
        { question: 'How does sun exposure affect scar treatment?', answer: 'Sun exposure is the single biggest threat to scar recovery. UV radiation stimulates melanocytes in scar tissue to overproduce melanin, causing scars to darken permanently — a process called post-inflammatory hyperpigmentation. This is especially problematic in the UAE where UV index regularly exceeds 11. Always apply ULTRA SHIELD SPF 50+ (250 AED) every morning and reapply every 2 hours when outdoors. Even on cloudy days, up to 80% of UV rays penetrate — skipping SPF can undo months of repair progress.' },
      ],
      ar: [
        { question: 'هل يمكن للوخز بالإبر الدقيقة إزالة ندبات حب الشباب؟', answer: 'نعم، الوخز بالإبر الدقيقة من أكثر العلاجات فعالية لندبات حب الشباب. أجهزة GENOSYS تنشئ آلاف القنوات الدقيقة في الجلد، مما يحفز إنتاج الكولاجين والإيلاستين الطبيعي لملء أنسجة الندبات. الدراسات السريرية تُظهر تحسناً بنسبة 60-80٪ بعد 3-6 جلسات. كما توفر GENOSYS سيرومات ما بعد العلاج لتسريع الشفاء.' },
        { question: 'كم يستغرق ظهور تحسن في الندبات؟', answer: 'تعتمد النتائج على نوع الندبة وشدتها. علامات ما بعد حب الشباب السطحية قد تبدأ بالتلاشي خلال 4-6 أسابيع من استخدام EGF المنتظم. الندبات الغائرة الأعمق تُظهر تحسناً ملحوظاً بعد 8-12 أسبوعاً مع روتين يومي من كريم الإصلاح المهدئ والتقشير مرتين أسبوعياً وقناع EGF الليلي.' },
        { question: 'كيف يؤثر التعرض للشمس على علاج الندبات؟', answer: 'التعرض للشمس هو أكبر تهديد لتعافي الندبات. الأشعة فوق البنفسجية تحفز الخلايا الصبغية في أنسجة الندبات على إنتاج الميلانين بإفراط، مما يغمّق الندبات بشكل دائم. هذا مشكلة خاصة في الإمارات حيث مؤشر UV يتجاوز 11 بانتظام. استخدمي ULTRA SHIELD SPF 50+ كل صباح وأعيدي التطبيق كل ساعتين عند الخروج.' },
      ],
      ru: [
        { question: 'Может ли микронидлинг убрать рубцы от акне?', answer: 'Да, микронидлинг — одна из самых эффективных процедур для лечения рубцов от акне. Устройства GENOSYS создают тысячи микроканалов в коже, стимулируя естественную выработку коллагена и эластина для заполнения рубцовой ткани. Клинические исследования показывают улучшение на 60-80% после 3-6 сеансов. GENOSYS также предоставляет сыворотки для ускорения заживления.' },
        { question: 'Сколько времени нужно для улучшения рубцов?', answer: 'Срок зависит от типа, глубины и возраста рубца, поэтому оценку и план лучше получить у дерматолога. SKIN REBOOT PDRN MASK PACK может быть только дополнительным увлажняющим уходом для целой кожи: клинических данных об изменении рубцовой ткани у неё нет.' },
        { question: 'Как солнце влияет на лечение рубцов?', answer: 'Солнце — главная угроза восстановлению рубцов. УФ-излучение стимулирует меланоциты в рубцовой ткани к избыточной выработке меланина, навсегда затемняя рубцы. Это особенно проблематично в ОАЭ, где УФ-индекс регулярно превышает 11. Наносите ULTRA SHIELD SPF 50+ (250 дирхамов) каждое утро и обновляйте каждые 2 часа на открытом воздухе.' },
      ],
    },
  },

  // ─── HAIR LOSS ──────────────────────────────────────────
  {
    slug: 'hair-loss',
    icon: '💇',
    concernKeys: ['hair', 'hair-loss'],
    categoryFallbacks: [],
    relatedConcerns: ['sensitivity', 'anti-aging'],
    protocolPdf: {
      url: '/documents/PPT/Protocol_Hair_Loss.pdf',
      // Revised 18 Aug 2026. The previous wording promised "growth-boosting steps" and
      // "product sets by hair loss stage", which the products are not registered to do
      // and which the rewritten PDF no longer claims. Source: scripts/protocols/.
      title: {
        en: 'Scalp & Hair Home Protocol',
        ar: 'بروتوكول العناية المنزلية بفروة الرأس والشعر',
        ru: 'Протокол домашнего ухода за кожей головы и волосами',
      },
      description: {
        en: 'The HR³ MATRIX routine with the measured concentration behind every named ingredient, how each product is actually used, the salicylate avoid-list, and an honest account of what a scalp routine can and cannot do.',
        ar: 'روتين HR³ MATRIX مع التركيز المقيس خلف كل مكوّن مذكور، وكيف يُستعمل كل منتج فعلاً، وقائمة موانع الساليسيلات، وقول صريح لما يستطيعه روتين فروة الرأس وما لا يستطيعه.',
        ru: 'Схема HR³ MATRIX с измеренной концентрацией за каждым названным ингредиентом, как на самом деле применяется каждый продукт, список противопоказаний по салицилатам и честный разбор того, что уход за кожей головы может и чего не может.',
      },
      fileSize: '307 KB',
    },
    why: {
      en: {
        title: 'Why Hair Loss Needs a Targeted Approach in the UAE',
        items: [
          { icon: '🌡️', label: 'UAE Hair Loss Triggers', detail: 'Extreme heat, hard water with high mineral content, the vitamin D paradox (indoor lifestyles despite year-round sun), and chronic stress — all accelerate hair thinning in the Gulf' },
          { icon: '🔬', label: 'Follicle Activation Technology', detail: 'GENOSYS HR3 MATRIX line delivers peptides, biotin and caffeine directly into the follicle to reactivate the anagen (growth) phase' },
          { icon: '🌿', label: 'Scalp Ecosystem Approach', detail: 'Healthy hair starts with a healthy scalp — our system exfoliates build-up, balances sebum and restores the microbiome for optimal follicle function' },
          { icon: '🧪', label: 'Clinic-Grade at Home', detail: 'The same HR3 MATRIX formulas used by trichologists and dermatology clinics in Dubai, now available for your daily home routine' },
        ],
      },
      ar: {
        title: 'العناية بفروة الرأس عند القلق من خفة الشعر',
        items: [
          { icon: '🩺', label: 'ابدئي بالتشخيص', detail: 'لتساقط الشعر أسباب متعددة، وبعضها يحتاج إلى تشخيص وعلاج طبي لا يستطيع مستحضر تجميلي أن يحل محله.' },
          { icon: '💧', label: 'عناية تجميلية واضحة', detail: 'تقدم مجموعة HR³ MATRIX تنظيفاً وتغذية لفروة الرأس وتكييفاً للشعر من دون الادعاء بعلاج التساقط أو تحفيز النمو.' },
          { icon: '❄️', label: 'تونيك منعش يترك على الفروة', detail: 'يحتوي Hair Tonic α على منثول 0.3% وحمض الساليسيليك 0.25% وبانثينول 0.2%، ويستخدم صباحاً ومساءً.' },
          { icon: '⚠️', label: 'موانع استخدام مهمة', detail: 'يجب مراجعة موانع الساليسيلات قبل استعمال التونيك، خصوصاً الحمل والسكري واضطرابات الدورة الدموية والقصور الكلوي.' },
        ],
      },
      ru: {
        title: 'Уход за кожей головы при беспокойстве об истончении волос',
        items: [
          { icon: '🩺', label: 'Начните с диагностики', detail: 'У выпадения волос много причин, и некоторые требуют медицинской диагностики и лечения, которое косметика заменить не может.' },
          { icon: '💧', label: 'Чёткая косметическая задача', detail: 'Линия HR³ MATRIX очищает и питает кожу головы и кондиционирует волосы, не обещая лечить выпадение или стимулировать рост.' },
          { icon: '❄️', label: 'Несмываемый освежающий тоник', detail: 'Hair Tonic α содержит ментол 0,3%, салициловую кислоту 0,25% и пантенол 0,2%; его применяют утром и вечером.' },
          { icon: '⚠️', label: 'Важные ограничения', detail: 'Перед применением тоника проверьте противопоказания по салицилатам, особенно беременность, диабет, нарушения кровообращения и почечную недостаточность.' },
        ],
      },
    },
    seo: {
      // Revised 18 Aug 2026. The previous copy called the range a hair-loss treatment,
      // said it "reactivates follicles and reduces hair loss from the first month", and
      // claimed it was "recommended by Dubai trichologists". None of the HR³ MATRIX
      // products is registered to treat hair loss, no efficacy study exists behind any
      // of them, and no trichologist endorsement is on file. The page still targets the
      // concern — someone searching for it should find us — without claiming to treat it.
      en: {
        title: 'Hair Loss & Scalp Care UAE | Korean Scalp Range Dubai | GENOSYS',
        description: 'Professional Korean scalp care in the UAE. The GENOSYS HR³ MATRIX range — shampoo, tonic, ampoule and scalp peeling — with the measured concentration behind every ingredient we name. Free shipping over 1000 AED.',
        h1: 'Hair Loss & Scalp Care',
        heroShort: 'Professional Korean scalp care — the HR³ MATRIX shampoo, tonic and ampoule, registered for scalp cleansing, scalp nourishing and hair conditioning.',
        intro: 'Thinning and shedding are common concerns in the UAE, where stress, vitamin D deficiency from indoor lifestyles, heat and hard water all work against the scalp. GENOSYS offers a professional Korean scalp range that cleanses, cools and conditions the skin your hair grows out of, and we publish the measured concentration behind every ingredient we name. What we do not do is call it a treatment: none of these products is registered to treat hair loss, and if you are losing hair the first step is a doctor, because several causes are treatable with things a cosmetic cannot replace.',
        keywords: ['hair loss UAE', 'scalp care UAE', 'Korean scalp products', 'hair thinning Dubai', 'scalp shampoo Dubai', 'HR3 MATRIX'],
      },
      ar: {
        title: 'تساقط الشعر والعناية بفروة الرأس الإمارات | مجموعة كورية لفروة الرأس دبي | GENOSYS',
        description: 'عناية كورية احترافية بفروة الرأس في الإمارات، مع مستحضرات HR³ MATRIX وفرشاة السيليكون لخطوة الشامبو وخوذة المساج Hair-GENTRON. بلا ادعاء لعلاج التساقط.',
        h1: 'تساقط الشعر والعناية بفروة الرأس',
        heroShort: 'مستحضرات للعناية التجميلية بفروة الرأس وخوذة مساج موقوتة، ضمن حدود واضحة ومن دون وعود لعلاج التساقط.',
        intro: 'عندما تثير خفة الشعر أو تساقطه القلق، يمنح روتين HR³ MATRIX عناية تجميلية واضحة: الشامبو للتنظيف، وفرشاة السيليكون اختيارية أثناء تكوين رغوته، والتونيك لتغذية الفروة وتكييف الشعر، وHair Solution في ثماني قوارير أحادية الاستخدام سعة 4 مل للتغذية والتكييف. تستخدم الفرشاة في خطوة الغسل فقط؛ وتوضع المستحضرات التي تترك على الفروة بعد ذلك بأطراف الأصابع. ولجلسة HairGen Booster، يثبت رأس Hair Stamp جديد يحمل 52 إبرة ميكروية على قارورة جديدة من Hair Solution؛ ويتوقف الجهاز تلقائياً بعد 10 دقائق. الرأس فردي وأحادي الاستخدام، والعلبة تضم ثمانية رؤوس. يظهر قياس 0.3 مم في العمل الفني فقط ولا تذكره نشرة الشركة أو دليل الجهاز. ويجمع Mesopecia Kit مقشراً سعة 100 مل وست قوارير من المحلول مع رولر أحادي الاستخدام بعمق 0.5 مم. أما Hair-GENTRON فهو خوذة مساج غير طبية بأربعة أوضاع LED ومساج بضغط الهواء ودفء اختياري ومؤقت 10 أو 20 أو 30 دقيقة؛ لا تتوفر بيانات سريرية خاصة بفعاليتها. لا يعالج أي من هذه الخيارات تساقط الشعر أو يحفز نموه. ولأن أسباب التساقط متعددة، تبقى الخطوة الأولى عند استمراره هي التشخيص الطبي.',
        keywords: ['تساقط الشعر الإمارات', 'العناية بفروة الرأس', 'منتجات كورية لفروة الرأس', 'خفة الشعر دبي'],
      },
      ru: {
        title: 'Выпадение волос и уход за кожей головы ОАЭ | Корейская линия Дубай | GENOSYS',
        description: 'Профессиональный корейский уход за кожей головы в ОАЭ: средства HR³ MATRIX, силиконовая щётка для этапа шампуня и массажный шлем Hair-GENTRON. Без заявления о лечении выпадения.',
        h1: 'Выпадение волос и уход за кожей головы',
        heroShort: 'Косметические средства для кожи головы и массажный шлем с таймером, в ясных границах и без обещаний лечить выпадение.',
        intro: 'Когда истончение или выпадение волос вызывает беспокойство, линия HR³ MATRIX решает понятные косметические задачи: шампунь очищает, силиконовая щётка по желанию используется на этапе вспененного шампуня, тоник питает кожу головы и кондиционирует волосы, а Hair Solution в восьми одноразовых флаконах по 4 мл обеспечивает питание и кондиционирование. Щётка остаётся только в этапе мытья; несмываемые средства после него наносят пальцами. Для процедуры HairGen Booster новый Hair Stamp с 52 микроиглами устанавливают на новый флакон Hair Solution; через 10 минут аппарат останавливается автоматически. Штамп индивидуальный и одноразовый, в коробке восемь штук. Глубина 0,3 мм указана только на текущем макете и отсутствует в буклете и руководстве производителя. Mesopecia Kit объединяет пилинг 100 мл, шесть флаконов раствора и одноразовый роллер 0,5 мм. Hair-GENTRON — отдельный немедицинский массажный шлем с четырьмя режимами LED, воздушным массажем, регулируемым нагревом и таймером на 10, 20 или 30 минут; клинических данных эффективности именно устройства нет. Ни один из этих вариантов не лечит выпадение и не стимулирует рост. Если выпадение продолжается, первым шагом должна быть медицинская диагностика.',
        keywords: ['выпадение волос ОАЭ', 'уход за кожей головы ОАЭ', 'корейские средства для кожи головы', 'истончение волос Дубай'],
      },
    },
    routine: {
      en: [
        {
          title: 'Morning Routine',
          subtitle: 'Cleanse, nourish & protect — takes just 5 minutes',
          steps: [
            {
              step: 1, title: 'Shampoo', duration: '2 min',
              summary: 'Gently cleanse the scalp without stripping natural oils — removes overnight sebum and product residue.',
              detail: 'Wet hair thoroughly. Apply a small amount of HR3 Matrix Shampoo to the scalp (not lengths) and massage with fingertips for 60 seconds. The sulfate-free formula cleanses without disrupting the scalp barrier. Rinse with lukewarm water — hot water worsens hair loss.',
              products: [{ name: 'HR3 MATRIX SHAMPOO', url: '/products/44', price: '340 AED' }],
            },
            {
              step: 2, title: 'Tonic', duration: '1 min',
              summary: 'Core follicle activation step — delivers peptides and caffeine directly to the scalp.',
              detail: 'Part hair into sections and apply HR3 Matrix Tonic directly to the scalp using the nozzle. Massage gently for 30 seconds. Do not rinse — the tonic absorbs and works throughout the day.',
              products: [{ name: 'HR3 MATRIX TONIC', url: '/products/43', price: '290 AED' }],
            },
            {
              step: 3, title: 'Protect & Style', duration: '2 min',
              summary: 'Style as usual — avoid tight hairstyles and excessive heat tools that stress fragile hair.',
              detail: 'Allow hair to air-dry when possible. If using heat tools, keep temperature below 180°C. Avoid tight ponytails and braids that cause traction alopecia — especially common in the UAE.',
              products: [],
            },
          ],
        },
        {
          title: 'Evening Routine',
          subtitle: 'Deep nourish overnight while follicles regenerate',
          steps: [
            {
              step: 1, title: 'Scalp Massage with Solution', duration: '3 min',
              summary: 'Intensive growth treatment — the solution delivers high-concentration actives while massage boosts blood flow to follicles.',
              detail: 'Apply HR3 Matrix Solution to dry or towel-dried scalp using the dropper. Use the Scalp Brush to massage in circular motions for 2–3 minutes — this increases microcirculation by up to 300%. Focus on thinning areas: temples, crown, and hairline.',
              products: [
                { name: 'HR3 MATRIX SOLUTION', url: '/products/45', price: '740 AED' },
                { name: 'SCALP BRUSH', url: '/products/61', price: '50 AED' },
              ],
            },
            {
              step: 2, title: 'Tonic', duration: '1 min',
              summary: 'Second daily application of the tonic — night-time is when hair follicles are most active in regeneration.',
              detail: 'Part hair into sections and apply HR3 Matrix Tonic directly to the scalp. Pat gently — do not rub. The tonic layers over the solution to provide sustained nourishment overnight.',
              products: [{ name: 'HR3 MATRIX TONIC', url: '/products/43', price: '290 AED' }],
            },
            {
              step: 3, title: 'Sleep Overnight', duration: 'overnight',
              summary: 'Let the actives work while you sleep — no rinsing required.',
              detail: 'Use a silk or satin pillowcase to minimize friction. The solution and tonic absorb fully overnight. Hair follicles enter their most active repair phase during sleep — the HR3 actives synergize with this natural cycle.',
              products: [],
            },
          ],
        },
        {
          title: 'Weekly Treatment',
          subtitle: 'Deep exfoliation — once per week before shampoo',
          steps: [
            {
              step: 1, title: 'Scalp Peeling', duration: '5 min',
              summary: 'Remove product build-up, dead skin cells and excess sebum that suffocate follicles — the foundation of a healthy scalp.',
              detail: 'Apply HR3 Scalp Peeling to dry scalp before shampooing. Massage gently for 2 minutes and leave on for 3 minutes. Rinse thoroughly, then proceed with HR3 Matrix Shampoo. Use once per week — over-exfoliation can irritate the scalp. Hard water in the UAE leaves mineral deposits that this step specifically targets.',
              products: [{ name: 'HR3 SCALP PEELING', url: '/products/46', price: '290 AED' }],
            },
          ],
        },
      ],
      ar: [
        {
          title: 'الروتين الصباحي',
          subtitle: 'تنظيف وتغذية وحماية — 5 دقائق فقط',
          steps: [
            {
              step: 1, title: 'الشامبو', duration: 'نحو 3 دقائق',
              summary: 'تنظيف دقيق لفروة الرأس والشعر مع انتعاش واضح.',
              detail: 'بللي الشعر جيداً. كوّني رغوة من 3–5 مل من شامبو HR3 Matrix على فروة الرأس. يمكن تمرير فرشاة السيليكون بلطف بضغط متحكم فيه في هذه الخطوة فقط، ثم تترك الرغوة نحو ثلاث دقائق وتشطف جيداً. لا تستخدمي الفرشاة لتطبيق التونيك أو أي مستحضر يترك على الفروة. لا يحتوي الشامبو على SLS أو SLES؛ والمنظف الرئيسي سلفونات وليس سلفات.',
              products: [
                { name: 'HR3 MATRIX SHAMPOO', url: '/products/44', price: '340 AED' },
                { name: 'HR3 MATRIX SCALP BRUSH', url: '/products/61', price: '50 AED' },
              ],
            },
            {
              step: 2, title: 'التونيك', duration: 'دقيقة واحدة',
              summary: 'تونيك خفيف لتغذية فروة الرأس وتكييف الشعر مع إحساس منعش.',
              detail: 'قسمي الشعر ورشي HR3 Matrix Hair Tonic α مباشرة على فروة الرأس. دلكي بحركات دائرية واتركيه 3–4 ساعات على الأقل من دون شطف. يحتوي على 9.5% من الكحول المحوّل؛ راجعي موانع الساليسيلات قبل الاستخدام.',
              products: [{ name: 'HR3 MATRIX TONIC', url: '/products/43', price: '290 AED' }],
            },
            {
              step: 3, title: 'الحماية والتصفيف', duration: 'دقيقتان',
              summary: 'صففي كالمعتاد — تجنبي التسريحات المشدودة وأدوات الحرارة المفرطة.',
              detail: 'اتركي الشعر يجف طبيعياً قدر الإمكان. عند استخدام أدوات الحرارة حافظي على درجة حرارة أقل من 180 درجة مئوية. تجنبي الذيل المشدود والضفائر التي تسبب تساقط الشعر الشدّي.',
              products: [],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'عناية تجميلية تترك على فروة الرأس وفق تعليمات كل منتج',
          steps: [
            {
              step: 1, title: 'جلسة Hair Solution مع HairGen', duration: 'يتوقف الجهاز بعد 10 دقائق',
              summary: 'قارورة جديدة سعة 4 مل ورأس Hair Stamp جديد لكل جلسة وفق تعليمات الجهاز.',
              detail: 'انزعي غطاء القارورة وغطاءها المعدني، وثبتي رأس Hair Stamp جديداً، ثم ركبي المجموعة في HairGen Booster. افصلي الشعر بالمشط واتبعي دليل الجهاز؛ إذ يتوقف تلقائياً بعد 10 دقائق. لا يعاد استخدام الرأس ولا يشارك مع شخص آخر، ويتخلص من أي محلول متبقٍ في القارورة المفتوحة. لا تحدد وثائق الجهاز وتيرة للجلسات، وقياس 0.3 مم الظاهر في العمل الفني غير مؤكد في النشرة أو الدليل.',
              products: [
                { name: 'HR3 MATRIX SOLUTION', url: '/products/45', price: '740 AED' },
                { name: 'HAIR STAMP', url: '/products/64', price: '600 AED' },
              ],
            },
            {
              step: 2, title: 'التونيك', duration: 'دقيقة واحدة',
              summary: 'التطبيق اليومي الثاني للعناية بفروة الرأس وتكييف الشعر.',
              detail: 'رشي التونيك مباشرة على فروة الرأس ودلكيه بحركات دائرية. اتركيه 3–4 ساعات على الأقل أو طوال الليل، من دون ادعاء علاج التساقط أو تحفيز النمو.',
              products: [{ name: 'HR3 MATRIX TONIC', url: '/products/43', price: '290 AED' }],
            },
            {
              step: 3, title: 'النوم طوال الليل', duration: 'طوال الليل',
              summary: 'اتركي المنتج المختار على فروة الرأس وفق تعليماته، من دون وعود علاجية.',
              detail: 'لا يلزم شطف التونيك أو Hair Solution. لا تستخدمي الأمبولة يومياً ولا تحفظي أي كمية متبقية منها لوقت لاحق.',
              products: [],
            },
          ],
        },
        {
          title: 'العلاج الأسبوعي',
          subtitle: 'تقشير عميق — مرة واحدة أسبوعياً قبل الشامبو',
          steps: [
            {
              step: 1, title: 'تنظيف يترك على فروة الرأس', duration: '5 دقائق',
              summary: 'تنظيف تجميلي مركز للدهون والقشور السطحية وبقايا التصفيف، مع إحساس تبريد قوي.',
              detail: 'اسكبي نحو 5 مل، وشبعي عوداً قطنياً، ثم مرريه على الفروق ودلكي فروة الرأس السليمة. اتركيه 5 دقائق ولا تشطفيه. اتبعيه بـ Hair Solution فقط إذا كان ضمن روتينك المختار. لا تحدد الوثائق وتيرة استخدام، لذا اتبعي إرشادات المنتج أو المختص. ليس مطهراً أو علاجاً للتساقط، ولا يوضع بعد الميكرونيدلينغ.',
              products: [{ name: 'HR3 SCALP PEELING', url: '/products/46', price: '290 AED' }],
            },
          ],
        },
      ],
      ru: [
        {
          title: 'Утренний уход',
          subtitle: 'Очищение, питание и защита — всего 5 минут',
          steps: [
            {
              step: 1, title: 'Шампунь', duration: 'около 3 мин',
              summary: 'Тщательное очищение кожи головы и волос с выраженной свежестью.',
              detail: 'Тщательно намочите волосы. Вспеньте 3–5 мл шампуня HR3 Matrix на коже головы. На этом этапе можно мягко провести силиконовой щёткой с контролируемым нажимом, затем оставить пену примерно на три минуты и тщательно смыть. Не используйте щётку для тоника или другого несмываемого средства. В составе шампуня нет SLS и SLES; основной ПАВ — сульфонат, а не сульфат.',
              products: [
                { name: 'HR3 MATRIX SHAMPOO', url: '/products/44', price: '340 AED' },
                { name: 'HR3 MATRIX SCALP BRUSH', url: '/products/61', price: '50 AED' },
              ],
            },
            {
              step: 2, title: 'Тоник', duration: '1 мин',
              summary: 'Лёгкий уход для питания кожи головы, кондиционирования волос и ощущения свежести.',
              detail: 'Разделите волосы на проборы и распылите HR3 Matrix Hair Tonic α непосредственно на кожу головы. Распределите круговыми движениями и не смывайте минимум 3–4 часа. Формула содержит 9,5% денатурированного спирта; перед применением проверьте противопоказания по салицилатам.',
              products: [{ name: 'HR3 MATRIX TONIC', url: '/products/43', price: '290 AED' }],
            },
            {
              step: 3, title: 'Защита и укладка', duration: '2 мин',
              summary: 'Укладывайте как обычно — избегайте тугих причёсок и чрезмерного использования термоинструментов.',
              detail: 'По возможности сушите волосы естественным путём. При использовании термоинструментов держите температуру ниже 180°C. Избегайте тугих хвостов и кос, вызывающих тракционную алопецию — особенно распространённую в ОАЭ.',
              products: [],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Несмываемый косметический уход по отдельной инструкции каждого средства',
          steps: [
            {
              step: 1, title: 'Процедура Hair Solution с HairGen', duration: 'аппарат останавливается через 10 минут',
              summary: 'Новый флакон 4 мл и новый Hair Stamp для каждой процедуры по инструкции аппарата.',
              detail: 'Снимите колпачок и металлическую крышку флакона, установите новый Hair Stamp и поместите комплект в HairGen Booster. Разделяйте волосы расчёской и следуйте руководству: через 10 минут аппарат остановится автоматически. Штамп нельзя использовать повторно или передавать другому человеку; остаток открытого раствора утилизируют. Документы аппарата не устанавливают частоту процедур, а глубина 0,3 мм с текущего макета не подтверждена в буклете или руководстве.',
              products: [
                { name: 'HR3 MATRIX SOLUTION', url: '/products/45', price: '740 AED' },
                { name: 'HAIR STAMP', url: '/products/64', price: '600 AED' },
              ],
            },
            {
              step: 2, title: 'Тоник', duration: '1 мин',
              summary: 'Второе ежедневное нанесение для ухода за кожей головы и кондиционирования волос.',
              detail: 'Распылите тоник непосредственно на кожу головы и распределите круговыми движениями. Оставьте минимум на 3–4 часа или на ночь, без обещаний лечения выпадения или стимуляции роста.',
              products: [{ name: 'HR3 MATRIX TONIC', url: '/products/43', price: '290 AED' }],
            },
            {
              step: 3, title: 'Сон на ночь', duration: 'на ночь',
              summary: 'Оставьте выбранное средство на коже головы по его инструкции, без лечебных обещаний.',
              detail: 'Тоник и Hair Solution не требуют смывания. Не используйте ампулу ежедневно и не сохраняйте остаток для следующей процедуры.',
              products: [],
            },
          ],
        },
        {
          title: 'Еженедельный уход',
          subtitle: 'Глубокое отшелушивание — раз в неделю перед шампунем',
          steps: [
            {
              step: 1, title: 'Несмываемое очищение кожи головы', duration: '5 мин',
              summary: 'Концентрированное косметическое очищение себума, поверхностных чешуек и остатков стайлинга с ярким охлаждающим ощущением.',
              detail: 'Отлейте около 5 мл, пропитайте ватную палочку, обработайте проборы и помассируйте неповреждённую кожу головы. Оставьте на 5 минут и не смывайте. Затем используйте Hair Solution, только если он входит в выбранную схему. В документах частота не установлена, поэтому следуйте инструкции продукта или специалиста. Это не антисептик и не лечение выпадения; не наносите после микронидлинга.',
              products: [{ name: 'HR3 SCALP PEELING', url: '/products/46', price: '290 AED' }],
            },
          ],
        },
      ],
    },
    faq: {
      en: [
        { question: 'What causes hair loss in UAE and how to treat it?', answer: 'Hair loss in the UAE is commonly caused by extreme heat exposure, vitamin D deficiency (ironically, due to indoor lifestyles avoiding the sun), hard water with high mineral content, stress, and hormonal factors. GENOSYS scalp care products address these issues with Korean formulations that nourish hair follicles, improve scalp circulation, and strengthen existing hair. The HR3 MATRIX system (shampoo, tonic and solution) delivers peptides, biotin and caffeine directly into the follicle to reactivate the growth phase.' },
        { question: 'Can microneedling help with hair growth?', answer: 'Yes, scalp microneedling is clinically proven to stimulate hair growth. Micro-channels in the scalp increase blood flow to hair follicles and enhance absorption of growth-stimulating ingredients like those in the HR3 MATRIX Solution. Studies show microneedling combined with topical treatments can increase hair count by up to 20% after 12 weeks of regular use. For at-home scalp stimulation, the GENOSYS Scalp Brush provides similar micro-circulation benefits when used daily with the HR3 system.' },
        { question: 'How long does it take to see results from hair loss treatment?', answer: 'Most people notice reduced hair fall within 4–6 weeks of consistent use of the HR3 MATRIX system (shampoo + tonic daily, solution nightly). Visible new growth typically appears at 8–12 weeks, with significant improvement by 4–6 months. The hair growth cycle is naturally slow — follicles need time to shift from the resting (telogen) phase back to the active growth (anagen) phase. Consistency is key: skipping days resets the stimulation cycle.' },
        { question: 'What is the difference between HR3 Matrix Shampoo, Tonic and Solution?', answer: 'Each product targets a different layer of the scalp ecosystem. The HR3 Matrix Shampoo (340 AED) is a sulfate-free cleanser that removes build-up without stripping natural oils — use it daily. The HR3 Matrix Tonic (290 AED) is a leave-in treatment applied directly to the scalp twice daily, delivering peptides and caffeine that stimulate follicle activity. The HR3 Matrix Solution (740 AED) is the most concentrated product — an intensive night serum with the highest active-ingredient payload, designed for targeted application on thinning areas. Together, they form a complete follicle activation system.' },
        { question: 'Does hair loss treatment work for women too?', answer: 'Absolutely. Female pattern hair loss (FPHL) affects up to 40% of women by age 50, and is especially prevalent in the UAE due to heat stress, tight hairstyles, hormonal changes, and hard water. The GENOSYS HR3 MATRIX system is formulated for both men and women. Women typically see results faster because female hair loss is often driven by scalp environment factors (inflammation, build-up, poor circulation) rather than genetics alone — exactly what the HR3 system targets.' },
        { question: 'Does hard water in UAE cause hair loss and what can I do?', answer: 'Yes, the UAE\'s hard water contains high levels of calcium, magnesium and chlorine that coat hair strands, block follicles and disrupt the scalp microbiome. Over time this leads to dryness, breakage and accelerated thinning. The HR3 Scalp Peeling (used weekly) is specifically designed to dissolve mineral deposits and deep-clean follicle openings. Pairing it with the HR3 Matrix Shampoo (sulfate-free, pH-balanced) minimizes further mineral damage. For best results, consider a shower filter to reduce hardness at the source.' },
      ],
      ar: [
        { question: 'ما أسباب تساقط الشعر في الإمارات وكيفية علاجه؟', answer: 'للتساقط أسباب متعددة، منها الوراثة والهرمونات ونقص الحديد أو فيتامين د وبعض الحالات الطبية والضغط النفسي. تبدأ الخطوة الصحيحة بالتشخيص. تقدم مجموعة HR3 MATRIX عناية تجميلية لتنظيف فروة الرأس وتغذيتها وتكييف الشعر، ولا تحل محل علاج طبي.' },
        { question: 'ما الفرق بين شامبو وتونيك ومحلول HR3 Matrix؟', answer: 'الشامبو (340 درهماً) يُشطف ووظيفته تنظيف فروة الرأس والشعر؛ يحتوي على كافيين 1.000% ومنثول 1.120%. التونيك (290 درهماً) يترك لتغذية فروة الرأس وتكييف الشعر. Hair Solution (740 درهماً) عبارة عن ثماني أمبولات سعة 4 مل للتغذية والتكييف مرة أو مرتين أسبوعياً، وتستخدم فور الفتح. لا تُقدّم هذه المنتجات كعلاج لتساقط الشعر.' },
        { question: 'هل تساقط الشعر يصيب النساء أيضاً؟', answer: 'نعم، وقد تكون له أسباب وراثية أو هرمونية أو غذائية أو طبية مختلفة. عند التساقط الملحوظ أو المستمر يبدأ الأمر بتقييم طبي؛ وتبقى مجموعة HR3 MATRIX عناية تجميلية لفروة الرأس والشعر.' },
        { question: 'هل المياه العسرة في الإمارات تسبب تساقط الشعر؟', answer: 'قد تترك المياه العسرة ترسبات على الشعر وتؤثر في ملمسه، لكنها ليست تشخيصاً لسبب التساقط. يساعد شامبو HR3 Matrix على تنظيف فروة الرأس والشعر. والأدق أنه لا يحتوي على SLS أو SLES، لا أن يوصف عموماً بأنه خالٍ من السلفات.' },
        { question: 'ما هو Hair-GENTRON؟', answer: 'خوذة مساج غير طبية للطراز HGHY01 تجمع أربعة أوضاع LED مع المساج بضغط الهواء والدفء الاختياري ومؤقت 10 أو 20 أو 30 دقيقة. صُنفت سلامتها وفق IEC/EN 60335-2-32 كجهاز مساج منزلي، ولا تتوفر بيانات سريرية خاصة بفعاليتها. لا تستخدم مباشرة بعد إجراء طبي أو تجميلي من دون موافقة المختص.' },
        { question: 'ما هو Hair Stamp الخاص بجهاز HairGen Booster؟', answer: 'رأس فردي أحادي الاستخدام يحمل 52 إبرة ميكروية، ويثبت على قارورة HR³ MATRIX HAIR SOLUTION α قبل تركيبها في الجهاز. تحتوي العلبة على ثمانية رؤوس، ويستخدم رأس جديد وقارورة جديدة في كل جلسة. لا تتوفر دراسة فعالية خاصة بالرأس، ولا تؤكد النشرة أو الدليل عمق 0.3 مم الظاهر في العمل الفني.' },
      ],
      ru: [
        { question: 'Что вызывает выпадение волос в ОАЭ и как его лечить?', answer: 'У выпадения много причин: наследственность, гормональные изменения, дефицит железа или витамина D, заболевания и стресс. Правильный первый шаг — диагностика. Линия HR3 MATRIX обеспечивает косметическое очищение и питание кожи головы и кондиционирование волос, но не заменяет медицинское лечение.' },
        { question: 'В чём разница между шампунем, тоником и раствором HR3 Matrix?', answer: 'Шампунь (340 AED) смывается и зарегистрирован для очищения кожи головы и волос; в нём кофеин 1,000% и ментол 1,120%. Тоник (290 AED) оставляют для питания кожи головы и кондиционирования волос. Hair Solution (740 AED) — восемь ампул по 4 мл для питания и кондиционирования один или два раза в неделю; вскрытую ампулу используют сразу. Эти продукты не заявлены как лечение выпадения.' },
        { question: 'Бывает ли выпадение волос у женщин?', answer: 'Да, и причины могут быть наследственными, гормональными, пищевыми или медицинскими. При заметном или продолжающемся выпадении первым шагом должна быть оценка врача; HR3 MATRIX остаётся косметическим уходом за кожей головы и волосами.' },
        { question: 'Вызывает ли жёсткая вода в ОАЭ выпадение волос?', answer: 'Жёсткая вода может оставлять минеральный налёт на волосах и менять их ощущение, но это не диагноз причины выпадения. Шампунь HR3 Matrix помогает очищать кожу головы и волосы. Точно говорить, что в нём нет SLS и SLES, а не называть всю формулу бессульфатной.' },
        { question: 'Что такое Hair-GENTRON?', answer: 'Немедицинский массажный шлем модели HGHY01 с четырьмя режимами LED, воздушным массажем, регулируемым нагревом и таймером на 10, 20 или 30 минут. Его безопасность проверена по IEC/EN 60335-2-32 как бытового массажного прибора; клинических данных эффективности именно устройства нет. Не используйте сразу после медицинской или эстетической процедуры без разрешения специалиста.' },
        { question: 'Что такое Hair Stamp для HairGen Booster?', answer: 'Индивидуальная одноразовая насадка с 52 микроиглами, которая устанавливается на флакон HR³ MATRIX HAIR SOLUTION α перед загрузкой в аппарат. В коробке восемь штампов; для каждой процедуры используют новый штамп и новый флакон. Исследования эффективности именно насадки нет, а глубина 0,3 мм с текущего макета не подтверждена буклетом или руководством.' },
      ],
    },
  },

  // ─── ANTI-AGING ──────────────────────────────────────────
  {
    slug: 'anti-aging',
    icon: '⏳',
    concernKeys: ['page-anti-aging'],
    categoryFallbacks: [],
    relatedConcerns: ['hydration', 'pigmentation', 'sun-protection'],
    protocolPdf: {
      url: '/documents/PPT/Protocol_Anti-Aging.pdf',
      title: {
        en: 'Anti-Aging & Wrinkle Home Care Protocol',
        ar: 'بروتوكول العناية المنزلية لمكافحة الشيخوخة والتجاعيد',
        ru: 'Протокол домашнего антивозрастного ухода',
      },
      description: {
        en: 'Complete morning & evening routine for anti-aging — EGF + peptide system, collagen-rebuilding steps, product sets by age group, and UAE climate tips.',
        ar: 'روتين صباحي ومسائي متكامل للعناية بمظهر الخطوط، مع ترتيب المنتجات ونصائح للترطيب والحماية في مناخ الإمارات.',
        ru: 'Полный утренний и вечерний уход за линиями: порядок нанесения, увлажнение и защита с учётом климата ОАЭ.',
      },
      fileSize: '261 KB',
    },
    why: {
      en: {
        title: 'Why Anti-Aging Needs a Professional Approach in the UAE',
        items: [
          { icon: '☀️', label: 'UAE Accelerated Aging', detail: 'Extreme UV (index 11+), constant air conditioning, and desert winds break down collagen up to 40 % faster than in temperate climates — making early intervention essential' },
          { icon: '🧬', label: 'EGF + Peptide Technology', detail: 'GENOSYS harnesses Epidermal Growth Factor and multi-peptide complexes to signal fibroblasts to produce new collagen and elastin at clinical concentrations' },
          { icon: '🔬', label: 'Collagen Rebuilding', detail: 'ND Cell and Multi Functional Anti-Wrinkle ranges rebuild the dermal matrix from within — reducing fine lines, deep wrinkles, and loss of firmness over 4–8 weeks' },
          { icon: '🏥', label: 'Clinical-Grade at Home', detail: 'The same formulations used by licensed dermatologists in Dubai clinics are available for your daily home routine — no prescription needed' },
        ],
      },
      ar: {
        title: 'عناية ذكية بمظهر الخطوط في مناخ الإمارات',
        items: [
          { icon: '☀️', label: 'حماية يومية من الشمس', detail: 'تساعد الحماية المنتظمة من الأشعة فوق البنفسجية على الوقاية من ظهور الخطوط والتصبغ المبكر في مناخ الإمارات.' },
          { icon: '💧', label: 'الترطيب أولاً', detail: 'يساعد الترطيب الجيد البشرة على الظهور بمظهر أكثر امتلاءً ونعومة، ويخفف مظهر الخطوط الناتجة عن الجفاف.' },
          { icon: '✨', label: 'مكونات واضحة', detail: 'يوفر النياسيناميد والأدينوزين والباكوتشيول عناية متكاملة بمظهر اللون والملمس والخطوط الدقيقة.' },
          { icon: '🧴', label: 'طبقات مريحة', detail: 'يوضع السيروم أولاً ثم الكريم، ويُختتم الروتين الصباحي بواقي الشمس.' },
        ],
      },
      ru: {
        title: 'Продуманный уход за линиями в климате ОАЭ',
        items: [
          { icon: '☀️', label: 'Ежедневная защита от солнца', detail: 'Регулярная защита от УФ помогает предупреждать раннее появление линий и пигментации в климате ОАЭ.' },
          { icon: '💧', label: 'Сначала увлажнение', detail: 'Хорошо увлажнённая кожа выглядит более наполненной и гладкой, а линии обезвоженности становятся визуально мягче.' },
          { icon: '✨', label: 'Понятные активы', detail: 'Ниацинамид, аденозин и бакучиол создают комплексный уход за тоном, текстурой и мелкими морщинами.' },
          { icon: '🧴', label: 'Комфортные слои', detail: 'Сначала нанесите сыворотку, затем крем, а утром завершите уход солнцезащитным средством.' },
        ],
      },
    },
    seo: {
      en: {
        title: 'Anti-Aging Skincare UAE | Wrinkle Treatment Dubai | GENOSYS',
        description: 'Professional Korean anti-aging skincare for UAE. GENOSYS anti-wrinkle serums, creams & EGF treatments with peptides and growth factors. Used by Dubai dermatologists. Free shipping over 1000 AED.',
        h1: 'Anti-Aging & Wrinkle Treatment',
        heroShort: 'Professional Korean anti-wrinkle serums & creams — reduce fine lines, rebuild collagen and restore firmness with EGF, peptides & growth factors.',
        intro: 'Premature aging is accelerated in the UAE by intense UV radiation, air conditioning, and desert climate. GENOSYS anti-aging line harnesses breakthrough Korean ingredients — EGF (Epidermal Growth Factor), peptide complexes, and advanced retinoid alternatives — to visibly reduce fine lines, deep wrinkles, and loss of firmness. Our ND Cell and Multi Functional Anti-Wrinkle ranges are used by licensed dermatologists in professional settings and are also available for home use, delivering clinical-grade results.',
        keywords: ['anti-aging skincare UAE', 'wrinkle treatment Dubai', 'Korean anti-aging cream', 'EGF skincare UAE', 'peptide serum Dubai', 'anti-wrinkle products UAE', 'GENOSYS anti-aging'],
      },
      ar: {
        title: 'العناية بمظهر الخطوط والتجاعيد في الإمارات | GENOSYS',
        description: 'عناية كورية بمظهر الخطوط وتفاوت اللون في الإمارات، مع ترتيب صباحي ومسائي واضح وحماية يومية من الشمس.',
        h1: 'العناية بمظهر الخطوط والتجاعيد',
        heroShort: 'سيرومات وكريمات كورية للعناية بمظهر التجاعيد وتفاوت اللون ضمن روتين يومي واضح.',
        intro: 'يتطلب مناخ الإمارات توازناً بين الترطيب اليومي والحماية من الشمس والعناية المنتظمة بالملمس. تجمع ANTI-AGING BEAUTY BOX تسع قطع: أربعة منتجات كاملة الحجم وخمسة أقنعة، بترتيب تنظيف ثم معزز ثم سيروم ثم كريم، مع واقي الشمس صباحاً.',
        keywords: ['العناية بعلامات التقدم في السن الإمارات', 'العناية بالتجاعيد دبي', 'كريم كوري للعناية بالتجاعيد', 'سيروم ببتيدات دبي'],
      },
      ru: {
        title: 'Уход за линиями и морщинами в ОАЭ | GENOSYS',
        description: 'Корейский уход за морщинами и неровным тоном в ОАЭ: понятный утренний и вечерний порядок с ежедневной защитой от солнца.',
        h1: 'Уход за линиями и морщинами',
        heroShort: 'Корейские сыворотки и кремы для ухода за морщинами и неровным тоном в понятном ежедневном порядке.',
        intro: 'В климате ОАЭ особенно важен баланс ежедневного увлажнения и защиты от солнца. В ANTI-AGING BEAUTY BOX девять единиц: четыре полноразмерных средства и пять масок. Ежедневный порядок: очищение, бустер, сыворотка и крем; утром сверху наносят SPF.',
        keywords: ['антивозрастной уход ОАЭ', 'уход за морщинами Дубай', 'корейский крем против морщин', 'пептидная сыворотка Дубай'],
      },
    },
    routine: {
      en: [
        {
          title: 'Morning Routine',
          subtitle: 'Protect & prevent — takes just 5 minutes',
          steps: [
            {
              step: 1, title: 'Cleanse', duration: '1 min',
              summary: 'Remove overnight oils so anti-aging actives can penetrate effectively.',
              detail: 'Apply SNOW O₂ CLEANSER to a dry face, let the oxygen bubbles form naturally — they lift impurities from pores without rubbing. Rinse with lukewarm water and pat dry.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Tone & Hydrate', duration: '30 sec',
              summary: 'Restore pH and create a hydrated base so serums absorb more evenly.',
              detail: 'Apply SNOW BOOSTER with hands, gently pressing into skin. Move to the next step immediately — no wait needed.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Anti-Wrinkle Serum', duration: '30 sec',
              summary: 'Core anti-aging step — peptides and EGF stimulate collagen production and cell renewal.',
              detail: 'Apply 2–3 drops of Multi Functional Anti-Wrinkle Serum and pat gently into the skin, focusing on areas with fine lines, crow\'s feet, and forehead. Wait 30 seconds for absorption.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'Anti-Wrinkle Cream', duration: '30 sec',
              summary: 'Seal in anti-aging actives and provide lasting firmness with peptide-rich moisture.',
              detail: 'Apply a pea-sized amount of Multi Functional Anti-Wrinkle Cream over the serum. For premium results, use ND Cell Anti-Wrinkle Cream instead — it contains a higher concentration of growth factors.',
              products: [
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE CREAM', url: '/products/32', price: '290 AED' },
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'Sun Protection', duration: '30 sec',
              summary: 'The most critical anti-aging step — UV is the #1 cause of wrinkles and collagen breakdown.',
              detail: 'Apply a 2-finger length strip of ULTRA SHIELD SPF 50+ to face and neck. Without daily SPF, collagen breaks down faster than any serum can rebuild it.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Evening Routine',
          subtitle: 'Repair and rebuild while skin regenerates overnight',
          steps: [
            {
              step: 1, title: 'Double Cleanse', duration: '2 min',
              summary: 'Remove SPF and makeup thoroughly — residue blocks anti-aging actives from penetrating.',
              detail: 'First cleanse: Makeup remover to dissolve SPF and makeup from eye/lip area. Second cleanse: Oxygen cleanser to deep-clean residual sunscreen and impurities.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Exfoliate (2–3× per week)', duration: '1 min',
              summary: 'Remove dead skin cells that block serum absorption — reveals smoother, younger-looking skin.',
              detail: 'Apply peeling gel to dry skin and massage gently in circular motions for 30 seconds. Dead cells roll off visibly. Rinse thoroughly. Use 2–3 times per week, not daily.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'Anti-Wrinkle Serum', duration: '30 sec',
              summary: 'Night is peak regeneration time — peptides and EGF work harder while you sleep.',
              detail: 'Apply 2–3 drops of Multi Functional Anti-Wrinkle Serum, focusing on wrinkle-prone areas. Night-time application allows growth factors to work without UV interference.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'Night Cream', duration: '30 sec',
              summary: 'Intensive overnight repair — growth factors accelerate cell turnover and collagen synthesis.',
              detail: 'Apply ND Cell Anti-Wrinkle Cream as your final evening step for deep wrinkle targeting and maximum growth factor delivery while you sleep.',
              products: [
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'Weekly Mask (1–2× per week)', duration: '20 min',
              summary: 'Deep overnight treatment that floods skin with hydration and repair actives.',
              detail: 'Apply SKIN RESCUE Overnight Cream Mask as the last step 1–2 times per week. Leave on overnight — no rinsing needed. Provides intensive hydration and barrier repair while you sleep.',
              products: [{ name: 'SKIN RESCUE OVERNIGHT CREAM MASK', url: '/products/34', price: '340 AED' }],
            },
          ],
        },
      ],
      ar: [
        {
          title: 'الروتين الصباحي',
          subtitle: 'حماية ووقاية — 5 دقائق فقط',
          steps: [
            {
              step: 1, title: 'التنظيف', duration: '1 دقيقة',
              summary: 'تنظيف البشرة من آثار الروتين الليلي قبل الخطوات التالية.',
              detail: 'ضعي منظف SNOW O₂ على وجه جاف مع تجنب العينين. انتظري تكوّن الرغوة، ثم دلّكي بلطف واشطفي بماء فاتر.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'التونر والترطيب', duration: '30 ثانية',
              summary: 'ترطيب البشرة وتلطيفها بعد التنظيف قبل السيروم.',
              detail: 'ضعي SNOW BOOSTER باليدين أو كرذاذ واضغطي بلطف حتى يمتص.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'سيروم العناية بالتجاعيد', duration: '30 ثانية',
              summary: 'ترطيب مكثف مع عناية بتجانس اللون ونعومة مظهر الخطوط الدقيقة.',
              detail: 'ربتي بضع قطرات من سيروم Multi Functional Anti-Wrinkle على الوجه. يعمل الغليسرين 25.45% مع النياسيناميد 2% والأدينوزين 0.04% والباكوتشيول 0.1%.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم الوجه ثم عناية الرقبة', duration: '30 ثانية',
              summary: 'أكملي ترطيب الوجه، ثم امنحي الرقبة وأعلى الصدر قواماً أكثر غنى.',
              detail: 'وزعي Multi Functional Anti-Wrinkle Cream على الوجه لحبس الرطوبة، ثم مرري ND Cell على الرقبة وأعلى الصدر بحركات صاعدة. يمنح السكوالان 5% والأدينوزين 0.04% هذه المنطقة عناية غنية ومريحة.',
              products: [
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE CREAM', url: '/products/32', price: '290 AED' },
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'أهم خطوة لمكافحة الشيخوخة — الأشعة فوق البنفسجية السبب الأول لتكسر الكولاجين.',
              detail: 'يوزع ULTRA SHIELD SPF 50+ بسخاء وبالتساوي قبل الخروج بـ15 دقيقة على الأقل، ويجدد كل ساعتين على الأقل في الخارج.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'ترتيب مسائي واضح للعناية اليومية',
          steps: [
            {
              step: 1, title: 'التنظيف المزدوج', duration: '2 دقيقة',
              summary: 'إزالة واقي الشمس والمكياج قبل خطوات العناية المسائية.',
              detail: 'استخدمي مزيل المكياج أولاً عند الحاجة، ثم ضعي SNOW O₂ على وجه جاف، انتظري الرغوة، دلّكي بلطف واشطفي.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'التقشير (2-3 مرات أسبوعياً)', duration: '1 دقيقة',
              summary: 'إزالة خلايا الجلد الميتة التي تمنع امتصاص السيروم.',
              detail: 'ضعي جل التقشير على بشرة جافة ودلكي بحركات دائرية لطيفة. اشطفي جيداً. استخدمي 2-3 مرات أسبوعياً.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'سيروم العناية بالتجاعيد', duration: '30 ثانية',
              summary: 'طبقة مسائية مرطبة تدعم نعومة البشرة ومظهرها الممتلئ.',
              detail: 'ربتي بضع قطرات من سيروم Anti-Wrinkle على الوجه، ثم اتبعيه بالكريم لتثبيت الترطيب.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم الرقبة وأعلى الصدر', duration: '30 ثانية',
              summary: 'خطوة غنية تساعد البشرة الرقيقة على الاحتفاظ بالرطوبة واستعادة ملمسها الناعم.',
              detail: 'وزعي ND Cell من عظمتي الترقوة إلى خط الفك بحركات صاعدة. يشكل السكوالان 5% والسيليكونات طبقة مريحة تحد من فقدان الرطوبة.',
              products: [
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'قناع ليلي (مرة أو مرتين أسبوعياً)', duration: 'دقيقة واحدة',
              summary: 'خطوة كريمية تترك طوال الليل لدعم الترطيب وتجانس اللون ومظهر البشرة المرتاح.',
              detail: 'يوضع قناع SKIN RESCUE كخطوة أخيرة مساءً ويدلك بلطف حتى تذوب الكبسولات، ثم يترك طوال الليل من دون شطف.',
              products: [{ name: 'SKIN RESCUE OVERNIGHT CREAM MASK', url: '/products/34', price: '340 AED' }],
            },
          ],
        },
      ],
      ru: [
        {
          title: 'Утренний уход',
          subtitle: 'Защита и профилактика — всего 5 минут',
          steps: [
            {
              step: 1, title: 'Очищение', duration: '1 мин',
              summary: 'Очистите кожу от следов ночного ухода перед следующими этапами.',
              detail: 'Нанесите SNOW O₂ CLEANSER на сухое лицо, избегая глаз. Дождитесь пены, мягко помассируйте и смойте тёплой водой.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Тонизирование', duration: '30 сек',
              summary: 'Увлажните и смягчите кожу после очищения перед сывороткой.',
              detail: 'Нанесите SNOW BOOSTER руками или распылите и мягко прижмите до впитывания.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Сыворотка против морщин', duration: '30 сек',
              summary: 'Интенсивное увлажнение с уходом за ровным тоном и гладкостью мелких линий.',
              detail: 'Мягко вбейте несколько капель Multi Functional Anti-Wrinkle Serum по лицу. Глицерин 25,45% работает вместе с ниацинамидом 2%, аденозином 0,04% и бакучиолом 0,1%.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'Крем для лица, затем для шеи', duration: '30 сек',
              summary: 'Завершите увлажнение лица и добавьте более насыщенный уход для шеи и декольте.',
              detail: 'Распределите Multi Functional Anti-Wrinkle Cream по лицу, затем нанесите ND Cell на шею и декольте восходящими движениями. В ND Cell сквалан 5% сочетается с аденозином 0,04%.',
              products: [
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE CREAM', url: '/products/32', price: '290 AED' },
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'Защита от солнца', duration: '30 сек',
              summary: 'Самый важный антивозрастной шаг — УФ является причиной №1 разрушения коллагена.',
              detail: 'Равномерно и щедро нанесите ULTRA SHIELD SPF 50+ минимум за 15 минут до выхода и обновляйте не реже чем каждые два часа на улице.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Понятный порядок ежедневного вечернего ухода',
          steps: [
            {
              step: 1, title: 'Двойное очищение', duration: '2 мин',
              summary: 'Удалите SPF и макияж перед вечерним уходом.',
              detail: 'При необходимости сначала используйте средство для снятия макияжа, затем нанесите SNOW O₂ на сухое лицо, дождитесь пены, мягко помассируйте и смойте.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Эксфолиация (2–3 раза в неделю)', duration: '1 мин',
              summary: 'Удалите мёртвые клетки, блокирующие впитывание сыворотки.',
              detail: 'Нанесите пилинг-гель на сухую кожу и массируйте круговыми движениями 30 секунд. Тщательно смойте. Используйте 2–3 раза в неделю.',
              products: [{ name: 'EPI TURNOVER BOOSTING PEELING GEL', url: '/products/12', price: '250 AED' }],
            },
            {
              step: 3, title: 'Сыворотка против морщин', duration: '30 сек',
              summary: 'Вечерний увлажняющий слой поддерживает мягкость и наполненный вид кожи.',
              detail: 'Мягко вбейте несколько капель Anti-Wrinkle Serum по лицу, затем нанесите крем, чтобы закрепить увлажнение.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'Крем для шеи и декольте', duration: '30 сек',
              summary: 'Насыщенный финальный слой помогает тонкой коже удерживать влагу и сохранять мягкость.',
              detail: 'Распределите ND Cell от ключиц к линии челюсти движениями снизу вверх. Сквалан 5% и силиконы создают комфортный слой, уменьшающий потерю влаги.',
              products: [
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'Ночная маска (1–2 раза в неделю)', duration: '1 мин',
              summary: 'Несмываемый кремовый уход для увлажнения, более ровного тона и отдохнувшего вида кожи.',
              detail: 'Нанесите SKIN RESCUE последним шагом вечером и мягко распределите до растворения капсул. Оставьте на ночь, не смывайте.',
              products: [{ name: 'SKIN RESCUE OVERNIGHT CREAM MASK', url: '/products/34', price: '340 AED' }],
            },
          ],
        },
      ],
    },
    faq: {
      en: [
        { question: 'What Korean ingredients are best for anti-aging?', answer: 'The most effective Korean anti-aging ingredients include EGF (Epidermal Growth Factor) which stimulates cell renewal, peptide complexes that boost collagen production, adenosine for wrinkle reduction, and snail mucin for deep hydration and repair. GENOSYS products feature clinical concentrations of these ingredients — particularly the ND Cell Anti-Wrinkle Cream (370 AED) and Multi Functional Anti-Wrinkle Serum (330 AED), which are among the strongest professional formulations available in the UAE.' },
        { question: 'Why does skin age faster in UAE?', answer: 'Skin ages faster in the UAE due to three main factors: extreme UV radiation (UV index 11+ most of the year) which breaks down collagen, constant air conditioning that dehydrates skin, and desert winds with fine particles. Professional-grade sun protection combined with EGF and peptide treatments can significantly slow this process. GENOSYS recommends a daily routine of SPF 50+ sunscreen, antioxidant serum, and anti-wrinkle cream.' },
        { question: 'When should I start using anti-aging products?', answer: 'Prevention is easier than correction. In the UAE, dermatologists recommend starting a basic anti-aging routine (antioxidant serum + SPF) in your mid-20s. By 30, adding a peptide serum like the Multi Functional Anti-Wrinkle Serum (330 AED) is ideal. After 35, a full routine with EGF and growth factors — such as the ND Cell Anti-Wrinkle Cream (370 AED) — delivers the best results. However, it is never too late: visible improvement occurs at any age with consistent use.' },
        { question: 'What is the difference between EGF and retinol for anti-aging?', answer: 'Retinol increases cell turnover but often causes irritation, peeling, and sun sensitivity — a significant drawback in the UAE climate. EGF (Epidermal Growth Factor) achieves similar collagen-boosting results by signalling fibroblasts to produce new collagen and elastin, without the irritation. GENOSYS chose EGF-based formulations specifically because they are effective in high-UV environments and suitable for sensitive skin. The ND Cell Anti-Wrinkle Cream (370 AED) is a standout product for overnight renewal.' },
        { question: 'Can I combine anti-aging products with brightening treatments?', answer: 'Absolutely — and GENOSYS recommends it. Pigmentation and wrinkles often occur together, especially in the UAE. You can use the Multi Functional Anti-Wrinkle Serum (330 AED) in the morning for collagen support and the Multi Vita Radiance Serum in the evening for brightening, or layer them both. The Hyaluron Serum (330 AED) pairs well with both lines to boost hydration. Always finish with SPF 50+ in the morning.' },
        { question: 'What is the difference between ND Cell Anti-Wrinkle Cream and Multi Functional Anti-Wrinkle Cream?', answer: 'Both are professional-grade anti-aging creams but at different intensity levels. The Multi Functional Anti-Wrinkle Cream (290 AED) is the everyday workhorse — peptide-rich, lightweight, and suitable for all skin types from your late 20s onward. The ND Cell Anti-Wrinkle Cream (370 AED) is the premium option — it contains a higher concentration of growth factors and EGF, targets deeper wrinkles and significant loss of firmness, and is ideal for ages 35+ or for use as an intensive night cream. Many clients use the Multi Functional daily and the ND Cell at night or on alternating days.' },
      ],
      ar: [
        { question: 'ما هي أفضل المكونات الكورية للعناية بمظهر التجاعيد؟', answer: 'الأدينوزين والنياسيناميد والمرطبات ومضادات الأكسدة مكونات عملية للروتين اليومي. يحتوي ND Cell على الأدينوزين 0.04% مع السكوالان 5% وفيتامين E بتركيز 1% للعناية الغنية بالرقبة وأعلى الصدر، بينما يوفر Multi Functional Anti-Wrinkle Serum ترطيباً مائياً أخف للوجه.' },
        { question: 'متى أبدأ روتين العناية بعلامات التقدم في السن؟', answer: 'لا يرتبط الروتين بعمر ثابت؛ يبدأ عند ملاحظة الجفاف أو الخطوط الدقيقة أو فقدان النعومة. الأساس هو واقي الشمس اليومي مع ترطيب يناسب البشرة، ثم تُضاف منتجات موجهة بحسب المنطقة والاحتياج.' },
        { question: 'ما الفرق بين كريم ND Cell وكريم Multi Functional للعناية بالتجاعيد؟', answer: 'Multi Functional Anti-Wrinkle Cream كريم للوجه يجمع غليسرين 8% مع قاعدة مطرية تقارب 13% ونياسيناميد 2% لتجانس مظهر اللون. أما ND Cell فمخصص للرقبة وأعلى الصدر بقوام أغنى يرتكز على السكوالان 5%. يُستخدم كل منهما في المنطقة التي صُمم لها.' },
        { question: 'هل يمكنني تنسيق العناية بالتجاعيد مع العناية بتفاوت اللون؟', answer: 'نعم. سيروم وكريم Multi Functional مسجلان في كوريا للعناية بمظهر التجاعيد وتفاوت اللون، ويحتوي كل منهما على نياسيناميد 2% وأدينوزين 0.04%. اختمي روتين الصباح دائماً بواقي شمس مناسب.' },
      ],
      ru: [
        { question: 'Какие корейские ингредиенты подходят для ухода за морщинами?', answer: 'Для ежедневного ухода практичны аденозин, ниацинамид, увлажняющие и антиоксидантные компоненты. ND Cell сочетает аденозин 0,04%, сквалан 5% и витамин E 1% в насыщенном уходе за шеей и декольте, а Multi Functional Anti-Wrinkle Serum даёт лицу более лёгкое водное увлажнение.' },
        { question: 'Когда начинать уход за возрастными изменениями?', answer: 'Ориентируйтесь не на цифру в паспорте, а на потребности кожи: сухость, тонкие линии и потерю гладкости. Основа в любом возрасте — ежедневный SPF и подходящее увлажнение; направленные средства добавляют по зоне и задаче.' },
        { question: 'В чём разница между EGF и ретиноидами?', answer: 'Это разные классы компонентов, и один нельзя считать прямой заменой другого. ND Cell не является ретиноидным курсом: ретинилпальмитат присутствует в низкой концентрации 0,0111%, а основную работу в текстуре выполняют сквалан, витамин E и аденозин.' },
        { question: 'В чём разница между кремами ND Cell и Multi Functional Anti-Wrinkle?', answer: 'Multi Functional Anti-Wrinkle Cream — крем для лица с глицерином 8%, смягчающей фазой около 13% и ниацинамидом 2% для ухода за неровным тоном. ND Cell создан для шеи и декольте: его более насыщенная текстура опирается на сквалан 5%. Каждое средство лучше использовать в своей зоне.' },
      ],
    },
  },

  // ─── HYDRATION ──────────────────────────────────────────
  {
    slug: 'hydration',
    icon: '💧',
    concernKeys: ['page-hydration'],
    categoryFallbacks: [],
    relatedConcerns: ['sensitivity', 'anti-aging', 'sun-protection'],
    protocolPdf: {
      url: '/documents/PPT/Protocol_Hydration_Treatment.pdf',
      title: {
        en: 'Hydration & Moisture Barrier Home Care Protocol',
        ar: 'بروتوكول العناية المنزلية بالترطيب وحاجز الرطوبة',
        ru: 'Протокол домашнего ухода: увлажнение и восстановление барьера',
      },
      description: {
        en: 'Complete morning & evening hydration routine — hyaluronic acid layering, moisture barrier repair, product sets by dehydration level, and UAE climate tips.',
        ar: 'روتين صباحي ومسائي للبشرة المفتقرة إلى الماء — سيروم بحمض الهيالورونيك المتحلل 2,000 جزء في المليون، وكريم مناسب، وواقي شمس صباحاً.',
        ru: 'Утренний и вечерний уход для обезвоженной кожи: сыворотка с гидролизованной гиалуроновой кислотой 2 000 ppm, подходящий крем и SPF утром.',
      },
      fileSize: '264 KB',
    },
    seo: {
      en: {
        title: 'Hydrating Skincare UAE | Moisturizer & Hyaluronic Acid Dubai | GENOSYS',
        description: 'Professional Korean hydrating skincare for UAE dry climate. GENOSYS hyaluronic acid serums, moisture creams & hydrating masks. Combat air conditioning dehydration. Free shipping over 1000 AED.',
        h1: 'Hydrating Skincare for Dry UAE Climate',
        heroShort: 'Triple-weight hyaluronic acid serums & barrier-lock creams — Korean hydration technology engineered for the UAE\'s desert-meets-AC dehydration cycle.',
        intro: 'The UAE\'s desert climate combined with constant air conditioning creates a dual dehydration challenge that strips skin of moisture throughout the day. GENOSYS Moisture Replenishing line uses multi-weight hyaluronic acid technology — combining low, medium, and high molecular weight HA — to deliver hydration to every layer of the skin. Our Korean formulations go beyond surface-level moisturizing, reinforcing the skin barrier to lock in moisture even in the most arid conditions.',
        keywords: ['hydrating skincare UAE', 'moisturizer Dubai', 'hyaluronic acid UAE', 'dry skin Dubai', 'Korean moisturizer UAE', 'dehydrated skin treatment', 'GENOSYS hydration'],
      },
      ar: {
        title: 'العناية الترطيبية بالبشرة الإمارات | مرطب وحمض الهيالورونيك دبي | GENOSYS',
        description: 'عناية كورية احترافية بالترطيب لمناخ الإمارات الجاف. سيرومات حمض الهيالورونيك وكريمات الترطيب من GENOSYS. توصيل مجاني فوق 1000 درهم.',
        h1: 'عناية ترطيبية للبشرة في مناخ الإمارات الجاف',
        heroShort: 'سيروم خفيف بحمض الهيالورونيك المتحلل 2,000 جزء في المليون وكريمات مريحة للبشرة المعرضة لجفاف الحرارة والتكييف في الإمارات.',
        intro: 'قد تشعر البشرة بفقدان الماء بسبب التنقل المستمر بين حرارة الخارج والهواء المكيف. تجمع عناية GENOSYS بين سيروم مائي خفيف وكريم مناسب للمساعدة على تعويض الرطوبة والحفاظ على الراحة.',
        keywords: ['ترطيب البشرة الإمارات', 'مرطب دبي', 'حمض الهيالورونيك الإمارات', 'البشرة الجافة دبي'],
      },
      ru: {
        title: 'Увлажняющий уход ОАЭ | Гиалуроновая кислота и увлажнение Дубай | GENOSYS',
        description: 'Профессиональный корейский увлажняющий уход для сухого климата ОАЭ. Сыворотки с гиалуроновой кислотой и увлажняющие кремы GENOSYS. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Увлажняющий уход для сухого климата ОАЭ',
        heroShort: 'Лёгкая сыворотка с гидролизованной гиалуроновой кислотой 2 000 ppm и комфортные кремы для кожи, пересушенной жарой и кондиционерами ОАЭ.',
        intro: 'Постоянные переходы из жары в кондиционированные помещения могут усиливать потерю влаги. Уход GENOSYS сочетает лёгкую водную сыворотку и подходящий крем, чтобы восполнить влагу и сохранить комфорт кожи.',
        keywords: ['увлажнение кожи ОАЭ', 'увлажняющий крем Дубай', 'гиалуроновая кислота ОАЭ', 'сухая кожа Дубай'],
      },
    },
    why: {
      en: {
        title: 'Why UAE Skin Craves Deep Hydration',
        items: [
          { icon: '🏜️', label: 'Desert + AC Dual Challenge', detail: 'Outdoor desert heat pulls moisture from the surface while indoor air conditioning drops humidity below 20% — your skin is under dehydration attack from both sides, all day long' },
          { icon: '💧', label: 'Triple-Weight Hyaluronic Acid', detail: 'GENOSYS uses low, medium, and high molecular weight HA in a single serum — low weight penetrates deep, medium plumps the middle layers, high weight forms a moisture-locking film on the surface' },
          { icon: '🛡️', label: 'Barrier Lock Technology', detail: 'Hydration means nothing if it evaporates. Skin Barrier Protecting Cream seals in every drop by reinforcing the lipid barrier against AC-driven transepidermal water loss' },
          { icon: '⏱️', label: 'All-Day Moisture', detail: 'The layered system — mist, serum, cream — creates a moisture reservoir that releases hydration steadily for 12+ hours, even in 18°C office air conditioning' },
        ],
      },
      ar: {
        title: 'لماذا تحتاج البشرة في الإمارات إلى روتين ترطيب',
        items: [
          { icon: '🏜️', label: 'الحرارة والهواء المكيف', detail: 'قد تشعر البشرة بجفاف أو شد أكبر عند التنقل المتكرر بين حرارة الخارج والهواء المكيف.' },
          { icon: '💧', label: 'سيروم بتركيزات معلنة', detail: 'يحتوي السيروم على حمض الهيالورونيك المتحلل 2,000 جزء في المليون وPENTAVITIN بنسبة 0.615% ضمن قاعدة مرطبة 16.02%.' },
          { icon: '🧴', label: 'كريم بتركيبة مختلفة', detail: 'يحتوي كريم Hyaluron على الغليسرين 9% وPENTAVITIN بنسبة 0.615% وهيالورونات الصوديوم عالية الوزن الجزيئي 1,000.9 جزء في المليون.' },
          { icon: '⏱️', label: 'ترتيب واضح', detail: 'يستخدم المعزز ثم السيروم ثم الكريم صباحاً ومساءً، ويختتم الصباح بواقي الشمس.' },
        ],
      },
      ru: {
        title: 'Почему коже в ОАЭ нужен увлажняющий уход',
        items: [
          { icon: '🏜️', label: 'Жара и кондиционированный воздух', detail: 'При постоянных переходах из жары в кондиционированные помещения кожа может сильнее ощущать сухость и стянутость.' },
          { icon: '💧', label: 'Сыворотка с заявленными концентрациями', detail: 'В сыворотке гидролизованная гиалуроновая кислота 2 000 ppm и PENTAVITIN 0,615% в увлажняющей основе 16,02%.' },
          { icon: '🧴', label: 'Крем с другой формулой', detail: 'В Hyaluron Cream глицерин 9%, PENTAVITIN 0,615% и высокомолекулярный гиалуронат натрия 1 000,9 ppm.' },
          { icon: '⏱️', label: 'Понятный порядок', detail: 'Бустер, сыворотка и крем используются утром и вечером; утром уход завершает SPF.' },
        ],
      },
    },
    routine: {
      en: [
        {
          title: 'Morning Routine',
          subtitle: 'Layer hydration & seal it in before the AC hits — takes 5 minutes',
          steps: [
            {
              step: 1, title: 'Gentle Cleanse', duration: '1 min',
              summary: 'Remove overnight residue without stripping moisture. A clean canvas absorbs hydration better.',
              detail: 'Apply SNOW O₂ CLEANSER to damp face. The oxygen-bubble formula lifts impurities gently without harsh surfactants that dissolve your skin\'s natural oils. Rinse with lukewarm water and pat dry — never rub, rubbing increases transepidermal water loss.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Hydrating Mist', duration: '15 sec',
              summary: 'Damp skin absorbs actives 2× better. This primes every layer for the serum that follows.',
              detail: 'Hold MICROBIOME ENERGY INFUSING MIST 15 cm from the face and spray 3–4 times in a circular motion. The microbiome-balancing formula creates a moisture cushion and slightly acidic environment that helps hyaluronic acid bind more water. Do not pat dry — let the mist sit on the skin.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'Hyaluronic Acid Serum', duration: '30 sec',
              summary: 'The hydration engine — triple-weight HA draws and holds water at every skin level.',
              detail: 'While the mist is still damp on the face, press 3–4 drops of MOISTURE REPLENISHING HYALURON SERUM between your palms and press onto cheeks, forehead, and chin. Applying on damp skin is critical — HA pulls moisture from whatever is nearby, so if your skin is dry, it can pull water out instead of in. The low-weight HA penetrates to the dermis, the medium-weight plumps the epidermis, and the high-weight forms a surface film that slows evaporation.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'Hydrating Cream', duration: '30 sec',
              summary: 'Seal the serum layers and provide sustained cream-based hydration throughout the day.',
              detail: 'Apply MOISTURE REPLENISHING HYALURON CREAM for lightweight everyday hydration — it extends the serum\'s effects with a ceramide-enriched base. For very dry or sensitive skin, swap to INTENSIVE HYDRO SOOTHING CREAM, which has a richer texture and added calming agents. Either way, use upward strokes and include the neck.',
              products: [
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'Sun Protection', duration: '30 sec',
              summary: 'UV damage accelerates moisture loss and breaks down hyaluronic acid in the skin. SPF is the final seal.',
              detail: 'Apply ULTRA SHIELD SUN CREAM SPF 50+ generously — two finger-lengths for face and neck. This sits on top of your moisture layers as a physical barrier against UV-driven free radicals that degrade HA and collagen. Its lightweight formula won\'t feel heavy over the hydration layers underneath.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Evening Routine',
          subtitle: 'Deep repair & overnight moisture recovery',
          steps: [
            {
              step: 1, title: 'Double Cleanse', duration: '2 min',
              summary: 'Remove SPF and daily grime completely. Leftover sunscreen blocks overnight absorption.',
              detail: 'First pass: SKIN DEFENDER LIP & EYE MAKEUP REMOVER on eyes and lips to dissolve waterproof SPF and makeup. Second pass: SNOW O₂ CLEANSER over the entire face to remove remaining sunscreen, sweat, and pollution particles. Double cleansing ensures a perfectly clean base for overnight repair — any residue creates a film that blocks the serum from penetrating.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Hyaluronic Acid Serum', duration: '30 sec',
              summary: 'Night-time application lets HA work uninterrupted for 8 hours while the skin\'s repair cycle peaks.',
              detail: 'Apply 4–5 drops of MOISTURE REPLENISHING HYALURON SERUM to damp skin (splash water or mist first). Use slightly more than morning because the serum has all night to work without SPF or makeup competition. Press into cheeks, forehead, chin, and don\'t forget the neck — it dehydrates just as fast.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 3, title: 'Barrier Cream', duration: '30 sec',
              summary: 'The overnight lock — a rich barrier cream prevents moisture from escaping into dry bedroom air.',
              detail: 'Apply SKIN BARRIER PROTECTING CREAM in a generous layer. This is the richest cream in the routine and it\'s intentional — overnight, there\'s no SPF or makeup on top, so the barrier cream is the only thing between your hydrated skin and the dry air-conditioned bedroom. Its lipid-replenishing complex rebuilds the skin barrier while you sleep.',
              products: [{ name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' }],
            },
            {
              step: 4, title: 'Weekly Overnight Mask (2–3× per week)', duration: '1 min',
              summary: 'A surge of concentrated moisture that works while you sleep — for when daily hydration isn\'t enough.',
              detail: 'On 2–3 nights per week, replace or layer on top of the barrier cream with SKIN RESCUE OVERNIGHT CREAM MASK. Apply a thick, even layer and leave on overnight — no rinsing needed. The mask creates an occlusive seal that supercharges overnight hydration. Especially recommended during peak summer months (June–September) when AC runs at maximum and during winter when humidity drops further.',
              products: [{ name: 'SKIN RESCUE OVERNIGHT CREAM MASK', url: '/products/34', price: '340 AED' }],
            },
          ],
        },
      ],
      ar: [
        {
          title: 'الروتين الصباحي',
          subtitle: 'روتين صباحي مرتب قبل بدء اليوم — 5 دقائق',
          steps: [
            {
              step: 1, title: 'تنظيف لطيف', duration: 'دقيقة واحدة',
              summary: 'إزالة بقايا الليل دون تجريد الرطوبة. البشرة النظيفة تمتص الترطيب بشكل أفضل.',
              detail: 'يوزع SNOW O₂ CLEANSER على وجه جاف مع تجنب منطقة العينين، ثم يدلك بحركات دائرية ويشطف بالماء الفاتر.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'رذاذ مرطب', duration: '15 ثانية',
              summary: 'رذاذ خفيف يسبق السيروم.',
              detail: 'يرش MICROBIOME ENERGY INFUSING MIST بالتساوي بعد التنظيف، ثم يتبع بالسيروم وفق تعليمات كل منتج.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'سيروم حمض الهيالورونيك', duration: '30 ثانية',
              summary: 'سيروم خفيف يعوض الرطوبة ويدعم احتفاظ البشرة بها.',
              detail: 'وزعي كمية كافية من MOISTURE REPLENISHING HYALURON SERUM على الوجه بعد التونر وربّتي بلطف. يجمع حمض الهيالورونيك المتحلل 2,000 جزء في المليون مع PENTAVITIN بنسبة 0.615%.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم مرطب', duration: '30 ثانية',
              summary: 'خطوة كريمية بعد السيروم.',
              detail: 'يوضع MOISTURE REPLENISHING HYALURON CREAM بعد السيروم؛ تجمع تركيبته بين 9% من الغليسرين و0.615% من PENTAVITIN و1,000.9 جزء في المليون من هيالورونات الصوديوم عالية الوزن الجزيئي. وإذا كنت تفضلين جل كريم أخف من دون عطر، فاختاري INTENSIVE HYDRO SOOTHING CREAM بقاعدة مرطبة 21.7%.',
              products: [
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'واقي الشمس هو الخطوة الأخيرة في روتين الصباح.',
              detail: 'يوضع ULTRA SHIELD SUN CREAM SPF 50+ كآخر خطوة في العناية، بكمية كافية وتوزيع متساوٍ قبل الخروج بـ15 دقيقة على الأقل، ثم يجدد كل ساعتين على الأقل في الخارج.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'عناية مسائية مرتبة بعد إزالة واقي الشمس والمكياج',
          steps: [
            {
              step: 1, title: 'التنظيف المزدوج', duration: 'دقيقتان',
              summary: 'إزالة SPF والأوساخ اليومية بالكامل. واقي الشمس المتبقي يمنع الامتصاص الليلي.',
              detail: 'المرة الأولى: SKIN DEFENDER LIP & EYE MAKEUP REMOVER لإذابة SPF والمكياج المقاوم للماء. المرة الثانية: SNOW O₂ CLEANSER على الوجه بالكامل لإزالة بقايا واقي الشمس والعرق وجسيمات التلوث.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'سيروم حمض الهيالورونيك', duration: '30 ثانية',
              summary: 'طبقة ترطيب خفيفة قبل كريم المساء.',
              detail: 'وزعي السيروم على الوجه بعد التونر وربّتي بأطراف الأصابع حتى يمتص. اتبعيه بكريم مناسب لاحتياج البشرة.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 3, title: 'كريم الحاجز', duration: '30 ثانية',
              summary: 'كريم ليلي غني بملمس مناسب للبشرة الجافة.',
              detail: 'يُوزع SKIN BARRIER PROTECTING CREAM كخطوة أخيرة. يمكن إضافة كمية صغيرة فوق المناطق الأكثر جفافاً، مع التربيت اللطيف بأطراف الأصابع.',
              products: [{ name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' }],
            },
            {
              step: 4, title: 'قناع ليلي (مرة أو مرتين أسبوعياً)', duration: 'دقيقة واحدة',
              summary: 'عناية كريمية تترك طوال الليل عندما تحتاج البشرة إلى ترطيب إضافي وملمس أكثر نعومة.',
              detail: 'مرة أو مرتين أسبوعياً، يستخدم SKIN RESCUE بدلاً من الكريم الليلي كخطوة أخيرة. توزع كمية مناسبة، وتدلك الكبسولات حتى تذوب، ثم يترك القناع طوال الليل من دون شطف.',
              products: [{ name: 'SKIN RESCUE OVERNIGHT CREAM MASK', url: '/products/34', price: '340 AED' }],
            },
          ],
        },
      ],
      ru: [
        {
          title: 'Утренний уход',
          subtitle: 'Последовательный утренний уход — 5 минут',
          steps: [
            {
              step: 1, title: 'Бережное очищение', duration: '1 мин',
              summary: 'Удалите ночные остатки, не лишая кожу влаги. Чистая кожа впитывает увлажнение лучше.',
              detail: 'Нанесите SNOW O₂ CLEANSER на сухое лицо, избегая области глаз, мягко помассируйте круговыми движениями и смойте тёплой водой.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Увлажняющий мист', duration: '15 сек',
              summary: 'Лёгкий мист перед сывороткой.',
              detail: 'Равномерно распылите MICROBIOME ENERGY INFUSING MIST после очищения, затем используйте сыворотку по инструкции к продукту.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'Сыворотка с гиалуроновой кислотой', duration: '30 сек',
              summary: 'Лёгкая сыворотка с измеренным результатом после одного нанесения.',
              detail: 'После тоника распределите достаточное количество MOISTURE REPLENISHING HYALURON SERUM по лицу и мягко вбейте. В формуле гидролизованная гиалуроновая кислота 2 000 ppm и PENTAVITIN 0,615%.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'Увлажняющий крем', duration: '30 сек',
              summary: 'Кремовый этап после сыворотки.',
              detail: 'После сыворотки нанесите MOISTURE REPLENISHING HYALURON CREAM: в формуле глицерин 9%, PENTAVITIN 0,615% и высокомолекулярный гиалуронат натрия 1 000,9 ppm. Если нужен более лёгкий гель-крем без отдушки, выберите INTENSIVE HYDRO SOOTHING CREAM с увлажняющей базой 21,7%.',
              products: [
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'Защита от солнца', duration: '30 сек',
              summary: 'SPF завершает утренний уход.',
              detail: 'Нанесите ULTRA SHIELD SUN CREAM SPF 50+ последним этапом ухода, равномерно и в достаточном количестве, минимум за 15 минут до выхода. Обновляйте не реже чем каждые два часа на улице.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Последовательный вечерний уход после удаления SPF и макияжа',
          steps: [
            {
              step: 1, title: 'Двойное очищение', duration: '2 мин',
              summary: 'Полностью удалите SPF и дневные загрязнения. Остатки санскрина блокируют ночное впитывание.',
              detail: 'Первый этап: SKIN DEFENDER LIP & EYE MAKEUP REMOVER для глаз и губ, чтобы растворить водостойкий SPF и макияж. Второй этап: SNOW O₂ CLEANSER на всё лицо для удаления остатков санскрина, пота и частиц загрязнений.',
              products: [
                { name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', url: '/products/11', price: '290 AED' },
                { name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' },
              ],
            },
            {
              step: 2, title: 'Сыворотка с гиалуроновой кислотой', duration: '30 сек',
              summary: 'Лёгкий увлажняющий слой перед вечерним кремом.',
              detail: 'Распределите сыворотку по лицу после тоника и мягко вбейте кончиками пальцев до впитывания. Затем нанесите крем по потребности кожи.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 3, title: 'Барьерный крем', duration: '30 сек',
              summary: 'Насыщенный ночной крем для сухой кожи.',
              detail: 'Нанесите SKIN BARRIER PROTECTING CREAM завершающим шагом. На самые сухие участки можно добавить ещё немного и мягко прижать крем подушечками пальцев.',
              products: [{ name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' }],
            },
            {
              step: 4, title: 'Ночная маска (1–2 раза в неделю)', duration: '1 мин',
              summary: 'Несмываемый кремовый уход для вечеров, когда коже особенно нужны влага, мягкость и комфорт.',
              detail: 'Один-два раза в неделю используйте SKIN RESCUE вместо ночного крема последним шагом. Нанесите комфортный слой, мягко распределите до растворения капсул и оставьте на ночь, не смывая.',
              products: [{ name: 'SKIN RESCUE OVERNIGHT CREAM MASK', url: '/products/34', price: '340 AED' }],
            },
          ],
        },
      ],
    },
    faq: {
      en: [
        { question: 'Why is skin so dry in UAE despite the humidity?', answer: 'While coastal UAE cities have outdoor humidity, the real dehydration comes from spending 80%+ of time in air-conditioned environments that have humidity below 20%. This constant cycle of hot outdoor air and cold dry indoor air disrupts the skin barrier. GENOSYS Moisture Replenishing Hyaluron Serum uses triple-weight hyaluronic acid to hydrate all skin layers, while the Skin Barrier Protecting Cream seals in moisture to withstand the air conditioning cycle.' },
        { question: 'What is the best Korean moisturizer for Dubai climate?', answer: 'For Dubai\'s unique climate, we recommend a layered approach: GENOSYS Moisture Replenishing Hyaluron Serum (lightweight, penetrating hydration) under GENOSYS Intensive Hydro Soothing Cream (rich barrier protection). This combination provides all-day moisture even in heavily air-conditioned offices. For extra hydration, the Skin Rescue Overnight Cream Mask can be used 2-3 times weekly.' },
        { question: 'How does hyaluronic acid work for skin hydration?', answer: 'Hyaluronic acid (HA) is a humectant that can hold up to 1,000 times its weight in water. It naturally occurs in your skin but depletes with age and UV exposure. GENOSYS uses triple-weight HA: low molecular weight (penetrates deep into the dermis for long-lasting internal hydration), medium molecular weight (plumps the mid-layers of the epidermis), and high molecular weight (sits on the surface to form a moisture-locking film). This multi-layer approach ensures hydration reaches every level rather than just sitting on top.' },
        { question: 'How should I layer hydration products for maximum effect?', answer: 'Layer from thinnest to thickest consistency: start with Microbiome Energy Infusing Mist on clean skin to create a damp base, then apply Moisture Replenishing Hyaluron Serum while the mist is still wet (HA needs water to work), follow with Hyaluron Cream or Intensive Hydro Soothing Cream to seal everything in, and finish with SPF in the morning or Skin Barrier Protecting Cream at night. Each layer locks in the previous one — skipping steps means moisture escapes.' },
        { question: 'Does oily skin still need hydration products?', answer: 'Absolutely — oily and dehydrated are not opposites. In the UAE, many people have oily yet dehydrated skin because air conditioning strips water from all skin types. When dehydrated, skin often overproduces oil to compensate, creating a greasy-but-tight feeling. The fix is water-based hydration, not skipping moisturizer. Use the Hyaluron Serum (water-based, oil-free) under a lightweight cream like Moisture Replenishing Hyaluron Cream. You\'ll actually notice less oiliness once the skin is properly hydrated.' },
        { question: 'What are the best overnight hydration tips for dry skin in UAE?', answer: 'Nighttime is when skin repair peaks, making it the best window for deep hydration. After double cleansing, apply Hyaluron Serum on damp skin (splash water first), then seal with Skin Barrier Protecting Cream — the richest formula in the line that prevents overnight moisture loss. Add Skin Rescue Overnight Cream Mask 2–3 nights per week for an extra surge. Keep bedroom humidity above 40% with a humidifier if possible, and avoid sleeping with AC pointed directly at your face. This combination can reverse even severely dehydrated skin within 2–3 weeks.' },
      ],
      ar: [
        { question: 'لماذا تشعر البشرة بالجفاف مع التكييف؟', answer: 'قد تشعر البشرة بمزيد من الجفاف أو الشد مع الهواء المكيف، لذلك يمكن ترتيب الروتين من سيروم مائي ثم كريم مناسب.' },
        { question: 'ما الذي يميز سيروم الهيالورون؟', answer: 'يحتوي على حمض الهيالورونيك المتحلل 2,000 جزء في المليون وPENTAVITIN بنسبة 0.615% ضمن قاعدة ترطيب خفيفة. بعد استخدام واحد ارتفع قياس الترطيب الداخلي من 50.81 إلى 52.238.' },
        { question: 'هل يناسب البشرة الدهنية المفتقرة إلى الماء؟', answer: 'نعم، نقص الماء قد يظهر على البشرة الدهنية أيضاً. استخدمي طبقة خفيفة من السيروم ثم اختاري الكريم المناسب لمدى حاجة بشرتك.' },
        { question: 'كيف أستخدمه مساءً؟', answer: 'بعد التنظيف والتونر، وزعي السيروم على الوجه وربّتي حتى يمتص، ثم أتبعيه بكريم. يمكن إضافة قناع ليلي مرتين أو ثلاثاً أسبوعياً عند الحاجة.' },
      ],
      ru: [
        { question: 'Почему в кондиционированном помещении кожа кажется суше?', answer: 'В кондиционированном помещении кожа может сильнее ощущать сухость и стянутость. Уход можно выстроить из лёгкой водной сыворотки и подходящего крема.' },
        { question: 'Чем отличается гиалуроновая сыворотка?', answer: 'В ней гидролизованная гиалуроновая кислота 2 000 ppm и PENTAVITIN 0,615% в лёгкой увлажняющей базе. После одного применения показатель внутреннего увлажнения вырос с 50,81 до 52,238.' },
        { question: 'Подходит ли она жирной обезвоженной коже?', answer: 'Да, временная нехватка воды бывает и у жирной кожи. Нанесите тонкий слой сыворотки, затем подберите крем по текущей потребности кожи.' },
        { question: 'Как использовать сыворотку вечером?', answer: 'После очищения и тоника распределите сыворотку по лицу и мягко вбейте до впитывания, затем нанесите крем. Два-три раза в неделю при необходимости можно добавить ночную маску.' },
      ],
    },
  },

  // ─── SENSITIVITY ──────────────────────────────────────────
  {
    slug: 'sensitivity',
    icon: '🌿',
    concernKeys: ['page-sensitivity'],
    categoryFallbacks: [],
    relatedConcerns: ['hydration', 'sun-protection', 'acne-treatment'],
    protocolPdf: {
      url: '/documents/PPT/Protocol_Sensitive.pdf',
      title: {
        en: 'Sensitive Skin Home Care Protocol',
        ar: 'بروتوكول العناية المنزلية بالبشرة الحساسة',
        ru: 'Протокол домашнего ухода для чувствительной кожи',
      },
      description: {
        en: 'Complete morning & evening routine for sensitive skin — barrier repair, calming actives, product sets by sensitivity level, and UAE climate protection tips.',
        ar: 'دليل لترتيب روتين صباحي ومسائي تدريجي، واختبار التحمل، وقراءة العطور والزيوت العطرية، وإضافة واقي الشمس في مناخ الإمارات.',
        ru: 'Руководство по поэтапному утреннему и вечернему уходу, проверке переносимости, ароматическим компонентам и солнцезащите в климате ОАЭ.',
      },
      fileSize: '267 KB',
    },
    why: {
      en: {
        title: 'Why Sensitive Skin Is So Common in the UAE',
        items: [
          { icon: '🌡️', label: 'Temperature Shock', detail: 'Walking from 40°C outside into 18°C air conditioning dozens of times a day forces capillaries to contract and expand — breaking down the skin barrier over weeks' },
          { icon: '🧬', label: 'Barrier Repair Technology', detail: 'Centella asiatica + ceramide complex rebuilds the lipid matrix that temperature cycling destroys, sealing moisture in and irritants out' },
          { icon: '🦠', label: 'Microbiome Balance', detail: 'Hard water and harsh cleansers strip beneficial bacteria. Our probiotic mist and gentle formulas restore the protective microbiome layer' },
          { icon: '🧴', label: 'Zero-Irritation Formula', detail: 'No fragrance, no alcohol, no essential oils — every product in the sensitive line is dermatologically tested for reactive skin' },
        ],
      },
      ar: {
        title: 'لماذا البشرة الحساسة شائعة جداً في الإمارات',
        items: [
          { icon: '🌡️', label: 'تغير البيئة', detail: 'قد يغير الانتقال المتكرر بين الحر والتكييف إحساس البشرة واحتياجها إلى قوام أخف أو أغنى.' },
          { icon: '🧬', label: 'اختيار التركيبة', detail: 'يقدم السيروم MultiEx BSASM® Plus بنسبة 1%، بينما يحتوي كريم Skin Barrier Protecting على سيراميد NP بتركيز 5,000 جزء في المليون وغليسرين 17.49%.' },
          { icon: '☀️', label: 'الحماية نهاراً', detail: 'يختتم الروتين الصباحي بواقي شمس مناسب، مع مراجعة تركيبته إذا كانت العطور من محفزات البشرة المعروفة.' },
          { icon: '🧴', label: 'الإفصاح عن العطر', detail: 'لا تعد المجموعة كلها خالية من العطر: توجد Parfum أو زيوت عطرية أو مكونات عطرية في عدة منتجات، لذلك يوصى باختبار الرقعة والإدخال التدريجي.' },
        ],
      },
      ru: {
        title: 'Почему чувствительная кожа так распространена в ОАЭ',
        items: [
          { icon: '🌡️', label: 'Смена условий', detail: 'Частые переходы между жарой и кондиционированным воздухом могут менять ощущения кожи и потребность в более лёгкой или насыщенной текстуре.' },
          { icon: '🧬', label: 'Выбор формулы', detail: 'В сыворотке MultiEx BSASM® Plus 1%, а в креме Skin Barrier Protecting — церамид NP 5 000 ppm и глицерин 17,49%.' },
          { icon: '☀️', label: 'Дневная защита', detail: 'Утренний уход завершайте подходящим солнцезащитным средством и проверяйте его состав, если ароматизаторы вызывают у вас реакцию.' },
          { icon: '🧴', label: 'Ароматические компоненты', detail: 'Не вся линия свободна от отдушек: в нескольких продуктах есть Parfum, эфирные масла или ароматические растительные компоненты. Нужны проба и постепенное введение.' },
        ],
      },
    },
    routine: {
      en: [
        {
          title: 'Morning Routine',
          subtitle: 'Calm, protect and strengthen — 5 gentle steps',
          steps: [
            {
              step: 1, title: 'Gentle Cleanse', duration: '1 min',
              summary: 'Remove overnight oils without stripping the barrier.',
              detail: 'Apply to a dry face and let the oxygen bubbles lift impurities gently — no rubbing needed. Rinse with lukewarm water (never hot) and pat dry. One single cleanse in the morning is enough for sensitive skin.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Microbiome Mist', duration: '15 sec',
              summary: 'Restore beneficial bacteria and prep the skin to absorb actives.',
              detail: 'Spray 2–3 pumps from 20 cm distance. The pre/probiotic formula rebalances the microbiome disrupted by hard water and AC. Press gently with palms — do not rub.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'Sensitive Serum', duration: '30 sec',
              summary: 'Core calming treatment — centella + panthenol soothe inflammation and start barrier repair.',
              detail: 'Apply 2–3 drops and press gently into the skin with flat palms. Wait 30 seconds for full absorption. This is the cornerstone of the sensitive routine — it calms redness and reduces reactivity with every application.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 4, title: 'Day Cream', duration: '30 sec',
              summary: 'Lock in actives and provide all-day hydration without heaviness.',
              detail: 'Choose by preference: Intensive Hydro Soothing Cream for a lighter daytime feel, or Skin Barrier Protecting Cream for maximum barrier defence if your skin is very reactive. Apply in gentle patting motions — never drag across sensitive skin.',
              products: [
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
              ],
            },
            {
              step: 5, title: 'Sun Protection', duration: '30 sec',
              summary: 'UV is a top trigger for sensitive skin — never skip SPF, even indoors near windows.',
              detail: 'Apply a 2-finger length strip to face and neck. This formula is fragrance-free and designed for reactive skin. In the UAE, UV index stays above 8 even in winter — unprotected exposure causes chronic micro-inflammation that keeps sensitivity active.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Evening Routine',
          subtitle: 'Repair and rebuild overnight — 4 soothing steps',
          steps: [
            {
              step: 1, title: 'Gentle Cleanse', duration: '1 min',
              summary: 'One single cleanse to remove SPF and impurities — no double cleanse to minimize contact on reactive skin.',
              detail: 'Apply the oxygen cleanser to a dry face and let it work for 30 seconds. The micro-bubbles dissolve sunscreen and pollution without a second cleansing step, reducing friction and irritation. Rinse with lukewarm water.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Sensitive Serum', duration: '30 sec',
              summary: 'Second dose of calming actives — night-time is when your skin barrier repairs most actively.',
              detail: 'Apply 2–3 drops and press into the skin. The centella and panthenol work synergistically with your skin\'s overnight repair cycle to accelerate barrier rebuilding.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 3, title: 'Soothing Postcream', duration: '30 sec',
              summary: 'Intensive repair cream that calms irritation accumulated during the day.',
              detail: 'Apply a generous layer over the serum. The Soothing Repair Postcream provides a concentrated dose of barrier-rebuilding ingredients. It works overnight to reduce morning redness and tightness.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 4, title: 'Barrier Cream', duration: '30 sec',
              summary: 'Seal everything in with a rich protective layer for overnight recovery.',
              detail: 'Use the Skin Barrier Protecting Cream for nights when skin feels very reactive or tight. For lighter nights, substitute with Intensive Hydro Soothing Cream. This final layer creates an occlusive seal that prevents trans-epidermal water loss while you sleep.',
              products: [
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
              ],
            },
          ],
        },
      ],
      ar: [
        {
          title: 'الروتين الصباحي',
          subtitle: 'روتين متدرج من 5 خطوات مع اختبار التحمل',
          steps: [
            {
              step: 1, title: 'التنظيف اللطيف', duration: 'دقيقة واحدة',
              summary: 'تنظيف صباحي يشطف بالماء الفاتر.',
              detail: 'يوضع SNOW O₂ على وجه جاف مع تجنب العينين، وتترك الرغوة لتتكون، ثم يدلك بلطف بحركات دائرية ويشطف. يحتوي على Parfum والليمونين وSLES؛ اختبري التحمل أولاً.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'رذاذ الميكروبيوم', duration: '15 ثانية',
              summary: 'رذاذ خفيف قبل السيروم.',
              detail: 'رشي 2–3 مرات من مسافة نحو 20 سم وربتي بلطف. أدخليه منفرداً حتى يمكن تقييم التحمل.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'سيروم البشرة الحساسة', duration: '30 ثانية',
              summary: 'MultiEx BSASM® Plus بتركيز 1% مع بيتين 0.5% وألانتوين 0.1% للراحة والترطيب الخفيف.',
              detail: 'وزعي قطرتين إلى ثلاث وربتي بأطراف الأصابع حتى الامتصاص من دون فرك البشرة المتفاعلة.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم النهار', duration: '30 ثانية',
              summary: 'اختيار قوام الكريم وفق حاجة البشرة.',
              detail: 'يُختار القوام حسب الحاجة: Intensive Hydro Soothing لإحساس أخف نهاراً، أو SKIN BARRIER PROTECTING للبشرة الحساسة والجافة التي تحتاج إلى طبقة أغنى. يُطبق بالتربيت اللطيف.',
              products: [
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
              ],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'اختتام الروتين الصباحي بواقي شمس مناسب.',
              detail: 'يوزع بسخاء وبالتساوي قبل الخروج بـ15 دقيقة على الأقل. تحتوي التركيبة على عطر بنسبة 0.5%، لذلك قد تفضل البشرة شديدة التفاعل أو الحساسة للعطور واقياً خالياً من العطر.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'أربع خطوات مسائية واضحة',
          steps: [
            {
              step: 1, title: 'التنظيف اللطيف', duration: 'دقيقة واحدة',
              summary: 'تنظيف يشطف بالماء الفاتر.',
              detail: 'يوضع المنظف على وجه جاف مع تجنب العينين، وتترك الرغوة لتتكون، ثم يدلك بلطف ويشطف. لا تفترضي أنه يزيل كل مكياج أو واقي شمس بمفرده.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'سيروم الحساسية', duration: '30 ثانية',
              summary: 'طبقة خفيفة من الترطيب والراحة قبل الكريم المسائي.',
              detail: 'وزعي قطرتين إلى ثلاث على بشرة نظيفة وربتي بلطف حتى الامتصاص، ثم أكملي الروتين بالكريم.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 3, title: 'كريم مهدئ', duration: '30 ثانية',
              summary: 'طبقة مريحة تساعد على ترطيب البشرة وتخفيف الإحساس بالشد مساءً.',
              detail: 'ضعي طبقة مريحة فوق السيروم على بشرة سليمة. يجمع الكريم قاعدة ترطيب 18.39% مع دايبوتاسيوم غليسيرايزينات ومستخلص السكوتيلاريا والألانتوين بتركيز 0.2% لكل منها.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 4, title: 'كريم الحاجز', duration: '30 ثانية',
              summary: 'اختتام الروتين المسائي بقوام الكريم المختار.',
              detail: 'يستخدم SKIN BARRIER PROTECTING لقوام أغنى أو Intensive Hydro Soothing لقوام أخف. يحتوي Skin Barrier Protecting على Parfum واللينالول والكومارين.',
              products: [
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
              ],
            },
          ],
        },
      ],
      ru: [
        {
          title: 'Утренний уход',
          subtitle: 'Поэтапный уход из 5 шагов с проверкой переносимости',
          steps: [
            {
              step: 1, title: 'Бережное очищение', duration: '1 мин',
              summary: 'Утреннее очищение с последующим смыванием.',
              detail: 'Нанесите SNOW O₂ на сухое лицо, избегая глаз. Дождитесь образования пены, мягко помассируйте круговыми движениями и смойте тёплой водой. В составе есть Parfum, лимонен и SLES; сначала проверьте переносимость.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Мист с пробиотиками', duration: '15 сек',
              summary: 'Лёгкий мист перед сывороткой.',
              detail: 'Распылите 2–3 нажатия примерно с 20 см и мягко прижмите ладонями. Вводите его отдельно, чтобы оценить переносимость.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'Сыворотка для чувствительной кожи', duration: '30 сек',
              summary: 'MultiEx BSASM® Plus 1%, бетаин 0,5% и аллантоин 0,1% для лёгкого увлажнения и комфорта.',
              detail: 'Нанесите 2–3 капли и мягко вбейте кончиками пальцев до впитывания, не растирая реактивную кожу.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 4, title: 'Дневной крем', duration: '30 сек',
              summary: 'Выберите текстуру крема по текущей потребности кожи.',
              detail: 'Выбирайте текстуру по потребностям кожи: Intensive Hydro Soothing для более лёгкого дневного ощущения или SKIN BARRIER PROTECTING для чувствительной и сухой кожи, которой нужен насыщенный слой. Наносите мягкими прижимающими движениями.',
              products: [
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
              ],
            },
            {
              step: 5, title: 'Солнцезащита', duration: '30 сек',
              summary: 'Завершите утренний уход подходящим солнцезащитным средством.',
              detail: 'Равномерно и щедро нанесите минимум за 15 минут до выхода. Формула содержит отдушку 0,5%, поэтому при высокой реактивности или чувствительности к ароматизаторам лучше выбрать средство без отдушки.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Четыре понятных вечерних шага',
          steps: [
            {
              step: 1, title: 'Бережное очищение', duration: '1 мин',
              summary: 'Очищение с последующим смыванием тёплой водой.',
              detail: 'Нанесите средство на сухое лицо, избегая глаз. Дождитесь пены, мягко помассируйте и смойте. Не предполагайте, что оно самостоятельно удалит любой макияж или санскрин.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Сыворотка для чувствительной кожи', duration: '30 сек',
              summary: 'Лёгкий слой увлажнения и комфорта перед вечерним кремом.',
              detail: 'Нанесите 2–3 капли на чистую кожу, мягко вбейте до впитывания и завершите уход кремом.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 3, title: 'Успокаивающий посткрем', duration: '30 сек',
              summary: 'Комфортный слой помогает увлажнить кожу и уменьшить вечернее чувство стянутости.',
              detail: 'Нанесите комфортный слой поверх сыворотки на целую кожу. Крем сочетает увлажняющую базу 18,39% с дикалия глицирризинатом, экстрактом шлемника и аллантоином — по 0,2% каждого.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 4, title: 'Барьерный крем', duration: '30 сек',
              summary: 'Завершите вечерний уход выбранным кремом.',
              detail: 'Выберите SKIN BARRIER PROTECTING для более насыщенной текстуры или Intensive Hydro Soothing для более лёгкой. Skin Barrier Protecting содержит Parfum, линалоол и кумарин.',
              products: [
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
              ],
            },
          ],
        },
      ],
    },
    seo: {
      en: {
        title: 'Sensitive Skin Care UAE | Soothing Skincare Dubai | GENOSYS',
        description: 'Professional Korean sensitive skin care for UAE. GENOSYS soothing serums, barrier creams & calming masks for reactive and irritated skin. Dermatologically tested. Free shipping over 1000 AED.',
        h1: 'Sensitive Skin Care & Soothing Treatment',
        heroShort: 'Professional Korean soothing serums, barrier creams & calming care — formulated for UAE temperature shock, hard water and year-round UV exposure.',
        intro: 'Sensitive and reactive skin is increasingly common in the UAE due to extreme temperature shifts (hot outdoors, cold air conditioning), pollution, hard water, and harsh UV exposure. GENOSYS offers a dedicated range of soothing and barrier-repair products designed for even the most reactive skin types. Our All For Sensitive line uses gentle yet effective Korean ingredients — centella asiatica, panthenol, and ceramides — to calm inflammation, reduce redness, and rebuild the skin barrier without irritation.',
        keywords: ['sensitive skin care UAE', 'soothing skincare Dubai', 'reactive skin treatment UAE', 'Korean sensitive skin products', 'calming cream Dubai', 'skin barrier repair UAE'],
      },
      ar: {
        title: 'روتين البشرة الحساسة في الإمارات | GENOSYS دبي',
        description: 'دليل لاختيار روتين GENOSYS متدرج، وقراءة العطور والزيوت العطرية، واختبار التحمل وإضافة واقي الشمس.',
        h1: 'روتين متدرج للبشرة الحساسة',
        heroShort: 'قارني التركيبات والقوام والمكونات العطرية، وأدخلي كل منتج منفرداً بدلاً من افتراض ملاءمة الخط بأكمله.',
        intro: 'احتياجات البشرة الحساسة فردية. تعرض هذه الصفحة ترتيب الاستخدام وحقائق التركيبة والتحذيرات العملية، بما في ذلك وجود Parfum أو الزيوت العطرية في بعض الخيارات. اختبري رقعة وأوقفي المنتج الذي يسبب حرقاناً أو احمراراً أو تورماً مستمراً.',
        keywords: ['روتين البشرة الحساسة الإمارات', 'اختبار رقعة البشرة دبي', 'GENOSYS للبشرة الحساسة', 'مكونات عطرية في العناية'],
      },
      ru: {
        title: 'Уход за чувствительной кожей в ОАЭ | GENOSYS Дубай',
        description: 'Руководство по поэтапному уходу GENOSYS, ароматическим компонентам, проверке переносимости и дневной солнцезащите.',
        h1: 'Поэтапный уход за чувствительной кожей',
        heroShort: 'Сравнивайте формулы, текстуры и ароматические компоненты и вводите каждое средство отдельно, не предполагая универсальную переносимость всей линии.',
        intro: 'Потребности чувствительной кожи индивидуальны. Здесь собраны порядок применения, точные факты о формулах и практические предосторожности, включая Parfum и эфирные масла в отдельных средствах. Сделайте пробу и прекратите применение продукта при стойком жжении, покраснении, отёке или раздражении.',
        keywords: ['уход за чувствительной кожей ОАЭ', 'проба на чувствительность Дубай', 'GENOSYS чувствительная кожа', 'ароматические компоненты в косметике'],
      },
    },
    faq: {
      en: [
        { question: 'Why is sensitive skin so common in UAE?', answer: 'Sensitive skin is extremely prevalent in the UAE due to the constant cycle of extreme heat outdoors (40-50°C in summer) and cold air conditioning indoors (18-22°C). This temperature shock weakens the skin barrier over time. Additionally, hard water in many areas of Dubai and Abu Dhabi strips natural oils, and high UV index causes chronic low-grade inflammation. GENOSYS sensitive skin products are specifically formulated to address these UAE-specific triggers.' },
        { question: 'What Korean products are best for sensitive skin?', answer: 'GENOSYS All For Sensitive Serum is the cornerstone product — it contains centella asiatica and panthenol to calm inflammation without irritating active ingredients. Follow with the Soothing Repair Postcream for barrier repair, and the Skin Barrier Protecting Cream for daily protection. The GENOSYS Hydro Cool Modeling Mask provides instant soothing relief for acute sensitivity episodes.' },
        { question: 'Can I exfoliate if I have sensitive skin?', answer: 'Yes, but with caution. Avoid physical scrubs and harsh chemical peels — these damage an already compromised barrier. Instead, use a very gentle enzyme exfoliant no more than once a week, and only when your skin is in a calm phase (no active redness or stinging). On exfoliation days, skip other actives and focus on barrier repair with the Soothing Repair Postcream and Skin Barrier Protecting Cream. Always follow with SPF the next morning.' },
        { question: 'Why does my skin turn red after sun exposure in the UAE?', answer: 'Post-sun redness in sensitive skin is caused by UV-triggered inflammation and histamine release in weakened skin barriers. The UAE\'s extreme UV index (often 11+) penetrates compromised barriers faster than healthy skin. To manage this: always wear SPF 50+ (ULTRA SHIELD Sun Cream), reapply every 2 hours outdoors, and apply the All For Sensitive Serum immediately after sun exposure to calm the inflammatory cascade. The Microbiome Energy Infusing Mist can provide instant cooling relief.' },
        { question: 'How do I build tolerance and strengthen my sensitive skin over time?', answer: 'Building tolerance requires consistent barrier repair, not aggressive treatment. Start with a minimal routine: gentle cleanser, sensitive serum, and barrier cream for 2–4 weeks. Once redness episodes decrease, gradually introduce one new product at a time with a 7-day gap between additions. The GENOSYS barrier repair system — Sensitive Serum plus Skin Barrier Protecting Cream — is designed for exactly this: each week, the ceramide and centella complex rebuilds another layer of barrier strength. Most clients see a measurable reduction in reactivity within 6–8 weeks.' },
        { question: 'Does hard water in Dubai make sensitive skin worse?', answer: 'Yes, hard water is a significant and often overlooked trigger. Dubai\'s tap water has high mineral content (calcium and magnesium) that disrupts the skin\'s acid mantle, raises pH, and strips the protective lipid layer. This leaves skin more vulnerable to irritants and allergens. To counteract this: use a gentle, pH-balanced cleanser like the SNOW O₂ Cleanser (it works without excessive water contact), follow immediately with the Microbiome Energy Infusing Mist to restore pH and microbiome balance, and always apply a barrier cream to lock in hydration after cleansing.' },
      ],
      ar: [
        { question: 'كيف أبدأ روتيناً جديداً للبشرة الحساسة؟', answer: 'اختبري كل منتج على رقعة صغيرة وأدخلي منتجاً واحداً في كل مرة. أوقفي المنتج عند استمرار الحرقان أو الاحمرار أو التورم أو التهيج.' },
        { question: 'هل منتجات هذه الصفحة كلها خالية من العطر؟', answer: 'لا. تحتوي بعض المنتجات على Parfum أو زيوت عطرية أو مكونات نباتية عطرية. راجعي صفحة كل منتج وقائمة INCI قبل الشراء.' },
        { question: 'ما الترتيب الأساسي صباحاً؟', answer: 'منظف ثم معزز أو تونر ثم سيروم وكريم، ويختتم الروتين بواقي شمس مناسب. لا يلزم استخدام كل خيار معروض في الصفحة معاً.' },
        { question: 'هل تناسب المجموعة العناية بعد الإجراءات؟', answer: 'لا تفترضي ذلك. اتبعي تعليمات المختص الذي أجرى الإجراء، خصوصاً إذا كانت البشرة متضررة أو ملتهبة.' },
      ],
      ru: [
        { question: 'Как начать новый уход при чувствительности?', answer: 'Проверяйте каждый продукт на небольшом участке и вводите средства по одному. Отмените продукт при стойком жжении, покраснении, отёке или раздражении.' },
        { question: 'Все продукты на странице без отдушек?', answer: 'Нет. В отдельных формулах есть Parfum, эфирные масла или ароматические растительные компоненты. Перед покупкой проверьте страницу продукта и его INCI.' },
        { question: 'Каков базовый утренний порядок?', answer: 'Очищение, затем бустер или тоник, сыворотка и крем; завершите подходящим солнцезащитным средством. Не нужно одновременно использовать все варианты со страницы.' },
        { question: 'Подходит ли набор после процедур?', answer: 'Не предполагайте этого. Следуйте рекомендациям специалиста, который провёл процедуру, особенно если кожа повреждена или воспалена.' },
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
    categoryKey: 'Microneedling',
    seo: {
      en: { title: 'Microneedling Devices UAE | Professional Derma Pen Dubai | GENOSYS', description: 'Professional microneedling devices from GENOSYS. Needle Pen-K, Microneedle Rollers & LED devices for clinics and home use in UAE. Free shipping over 1000 AED.', h1: 'Professional Microneedling Devices' },
      ar: { title: 'رولرات الميكرونيدلينغ الإمارات | ميكرونيدلينغ احترافي دبي | GENOSYS', description: 'رولرات ميكرونيدلينغ احترافية من GENOSYS. توصيل مجاني فوق 1000 درهم.', h1: 'رولرات الميكرونيدلينغ الاحترافية' },
      ru: { title: 'Роллеры для микронидлинга ОАЭ | GENOSYS', description: 'Профессиональные роллеры для микронидлинга GENOSYS. Бесплатная доставка от 1000 дирхамов.', h1: 'Профессиональные роллеры для микронидлинга' },
    },
  },
  {
    slug: 'pro-solution',
    categoryKey: 'PRO Solution',
    seo: {
      en: { title: 'PRO Solution Serums UAE | Professional Microneedling Serums Dubai | GENOSYS', description: 'GENOSYS PRO Solution power serums for professional microneedling treatments. HES, CVS, CTS, PCS, SWS & AWS formulas. Used by UAE dermatologists.', h1: 'PRO Solution Power Serums' },
      ar: { title: 'سيرومات PRO Solution الإمارات | سيرومات الوخز الاحترافية دبي | GENOSYS', description: 'سيرومات GENOSYS PRO Solution للعلاجات الاحترافية بالوخز بالإبر الدقيقة.', h1: 'سيرومات PRO Solution القوية' },
      ru: { title: 'PRO Solution сыворотки ОАЭ | Профессиональные сыворотки Дубай | GENOSYS', description: 'Сыворотки GENOSYS PRO Solution для профессиональных процедур микронидлинга.', h1: 'Сыворотки PRO Solution' },
    },
  },
  {
    slug: 'cleanser',
    categoryKey: 'Cleanser',
    seo: {
      en: { title: 'Face Cleansers UAE | Korean Cleanser Dubai | GENOSYS', description: 'GENOSYS professional Korean face cleansers for UAE. Gentle yet effective formulas for all skin types. Free shipping over 1000 AED.', h1: 'Face Cleansers' },
      ar: { title: 'غسول الوجه الإمارات | غسول كوري دبي | GENOSYS', description: 'غسول الوجه الاحترافي الكوري من GENOSYS. تركيبات لطيفة وفعالة لجميع أنواع البشرة.', h1: 'غسول الوجه' },
      ru: { title: 'Очищающие средства ОАЭ | Корейский клинзер Дубай | GENOSYS', description: 'Профессиональные корейские очищающие средства GENOSYS. Бесплатная доставка от 1000 дирхамов.', h1: 'Очищающие средства для лица' },
    },
  },
  {
    slug: 'peeling',
    categoryKey: 'Peeling',
    seo: {
      en: { title: 'Face Peeling Products UAE | Exfoliating Gel Dubai | GENOSYS', description: 'GENOSYS professional peeling products for UAE. Gentle exfoliating gels and renewal systems for brighter, smoother skin. Free shipping over 1000 AED.', h1: 'Peeling & Exfoliation' },
      ar: { title: 'منتجات تقشير الوجه الإمارات | جل تقشير دبي | GENOSYS', description: 'منتجات التقشير الاحترافية من GENOSYS لبشرة أكثر إشراقاً ونعومة.', h1: 'التقشير والتجديد' },
      ru: { title: 'Пилинг для лица ОАЭ | Отшелушивающий гель Дубай | GENOSYS', description: 'Профессиональные пилинги GENOSYS для более яркой и гладкой кожи.', h1: 'Пилинг и отшелушивание' },
    },
  },
  {
    slug: 'toner-mist',
    categoryKey: 'Toner/Mist',
    seo: {
      en: { title: 'Face Toners & Mists UAE | Korean Toner Dubai | GENOSYS', description: 'GENOSYS professional toners and facial mists for UAE. Hydrating, balancing and refreshing formulas. Free shipping over 1000 AED.', h1: 'Toners & Facial Mists' },
      ar: { title: 'تونر ورذاذ الوجه الإمارات | تونر كوري دبي | GENOSYS', description: 'تونر ورذاذ الوجه الاحترافي من GENOSYS. تركيبات مرطبة ومتوازنة.', h1: 'التونر ورذاذ الوجه' },
      ru: { title: 'Тоники и мисты ОАЭ | Корейский тонер Дубай | GENOSYS', description: 'Профессиональные тоники и мисты GENOSYS для увлажнения и баланса кожи.', h1: 'Тоники и мисты для лица' },
    },
  },
  {
    slug: 'serum',
    categoryKey: 'Serum',
    seo: {
      en: { title: 'Face Serums UAE | Korean Serum Dubai | GENOSYS', description: 'GENOSYS professional Korean face serums for UAE. Anti-aging, brightening, hydrating & problem control formulas. Free shipping over 1000 AED.', h1: 'Professional Face Serums' },
      ar: { title: 'سيروم الوجه الإمارات | سيروم كوري دبي | GENOSYS', description: 'سيرومات الوجه الاحترافية الكورية من GENOSYS. مكافحة الشيخوخة والتفتيح والترطيب.', h1: 'سيرومات الوجه الاحترافية' },
      ru: { title: 'Сыворотки для лица ОАЭ | Корейские серумы Дубай | GENOSYS', description: 'Профессиональные корейские сыворотки GENOSYS. Антивозрастные, осветляющие и увлажняющие.', h1: 'Профессиональные сыворотки для лица' },
    },
  },
  {
    slug: 'cream',
    categoryKey: 'Cream',
    seo: {
      en: { title: 'Face Creams UAE | Korean Moisturizer Dubai | GENOSYS', description: 'GENOSYS professional Korean face creams for UAE. Anti-wrinkle, soothing, hydrating & problem control creams. Free shipping over 1000 AED.', h1: 'Professional Face Creams' },
      ar: { title: 'كريم الوجه الإمارات | مرطب كوري دبي | GENOSYS', description: 'كريمات الوجه الاحترافية الكورية من GENOSYS. مضادة للتجاعيد ومهدئة ومرطبة.', h1: 'كريمات الوجه الاحترافية' },
      ru: { title: 'Кремы для лица ОАЭ | Корейский крем Дубай | GENOSYS', description: 'Профессиональные корейские кремы GENOSYS. Антивозрастные, увлажняющие и успокаивающие.', h1: 'Профессиональные кремы для лица' },
    },
  },
  {
    slug: 'mask',
    categoryKey: 'Mask',
    seo: {
      en: { title: 'Face Masks UAE | Korean Sheet Mask Dubai | GENOSYS', description: 'GENOSYS professional Korean face masks for UAE. Hydrating, soothing, anti-aging & modeling masks. Free shipping over 1000 AED.', h1: 'Professional Face Masks' },
      ar: { title: 'أقنعة الوجه الإمارات | ماسك كوري دبي | GENOSYS', description: 'أقنعة الوجه الاحترافية الكورية من GENOSYS. أقنعة مرطبة ومهدئة ومضادة للشيخوخة.', h1: 'أقنعة الوجه الاحترافية' },
      ru: { title: 'Маски для лица ОАЭ | Корейские маски Дубай | GENOSYS', description: 'Профессиональные корейские маски GENOSYS для лица. Увлажняющие, успокаивающие и антивозрастные.', h1: 'Профессиональные маски для лица' },
    },
  },
  {
    slug: 'sun',
    categoryKey: 'Sun',
    seo: {
      en: { title: 'Sun Protection Cream UAE | SPF Sunscreen Dubai | GENOSYS', description: 'GENOSYS professional SPF sun creams for UAE intense climate. Broad-spectrum UV protection. Free shipping over 1000 AED.', h1: 'Sun Protection Creams' },
      ar: { title: 'كريم الحماية من الشمس الإمارات | واقي شمس SPF دبي | GENOSYS', description: 'كريمات الحماية من الشمس SPF الاحترافية من GENOSYS لمناخ الإمارات.', h1: 'كريمات الحماية من الشمس' },
      ru: { title: 'Солнцезащитный крем ОАЭ | SPF санскрин Дубай | GENOSYS', description: 'Профессиональные солнцезащитные кремы GENOSYS SPF для климата ОАЭ.', h1: 'Солнцезащитные кремы' },
    },
  },
  {
    slug: 'cushion-bb',
    categoryKey: 'Cushion BB',
    seo: {
      en: { title: 'BB Cushion UAE | Korean BB Cream Dubai | GENOSYS', description: 'GENOSYS BB Cushion and Blemish Balm for flawless coverage with skincare benefits. Korean formula. Free shipping over 1000 AED.', h1: 'BB Cushion & Blemish Balm' },
      ar: { title: 'كوشن وكريم BB في الإمارات | GENOSYS دبي', description: 'خيارات GENOSYS الملونة: كوشن SPF 50+ PA++++ بخمسة مرشحات وثلاث درجات مع عبوة إعادة تعبئة، وكريم INTENSIVE BLEMISH BALM بدرجة واحدة.', h1: 'كوشن وكريم BB ملون' },
      ru: { title: 'Кушон и BB-крем в ОАЭ | GENOSYS Дубай', description: 'Тонирующие средства GENOSYS: кушон SPF 50+ PA++++ на пяти УФ-фильтрах в трёх оттенках с рефиллом и INTENSIVE BLEMISH BALM в одном оттенке.', h1: 'Кушоны и тонирующий BB-крем' },
    },
  },
  {
    slug: 'scalp-hair',
    categoryKey: 'Scalp/Hair',
    seo: {
      en: { title: 'Scalp & Hair Care UAE | Hair Treatment Dubai | GENOSYS', description: 'GENOSYS professional scalp and hair care products for UAE. Combat hair loss and improve scalp health. Free shipping over 1000 AED.', h1: 'Scalp & Hair Care' },
      ar: { title: 'العناية بفروة الرأس والشعر في الإمارات | GENOSYS', description: 'منتجات GENOSYS الكورية الاحترافية لتنظيف فروة الرأس والعناية بالشعر في الإمارات.', h1: 'العناية بفروة الرأس والشعر' },
      ru: { title: 'Уход за кожей головы и волосами в ОАЭ | GENOSYS', description: 'Профессиональные корейские средства GENOSYS для очищения кожи головы и ухода за волосами в ОАЭ.', h1: 'Уход за кожей головы и волосами' },
    },
  },
  {
    slug: 'eye-care',
    categoryKey: 'Eye care',
    seo: {
      en: { title: 'Eye Care Products UAE | Eye Cream & Serum Dubai | GENOSYS', description: 'GENOSYS professional eye care products for UAE. Eye contour serums, creams and gel patches for dark circles and wrinkles. Free shipping over 1000 AED.', h1: 'Professional Eye Care' },
      ar: { title: 'منتجات العناية بالعين الإمارات | كريم العين دبي | GENOSYS', description: 'عناية GENOSYS المتكاملة لمحيط العين في الإمارات: سيروم وكريم ولصقات هيدروجيل وطقم EyeCell من أربع خطوات.', h1: 'العناية الاحترافية بمحيط العين' },
      ru: { title: 'Средства для кожи вокруг глаз в ОАЭ | GENOSYS', description: 'Комплексный уход GENOSYS за контуром глаз: сыворотка, крем, гидрогелевые патчи и четырёхэтапный набор EyeCell.', h1: 'Профессиональный уход за контуром глаз' },
    },
  },
  {
    slug: 'device',
    categoryKey: 'Device',
    seo: {
      en: { title: 'Skincare Devices UAE | LED & Microneedling Devices Dubai | GENOSYS', description: 'GENOSYS professional skincare devices for UAE. LED therapy, microneedling pens and rollers for clinic and home use. Free shipping over 1000 AED.', h1: 'Professional Skincare Devices' },
      ar: { title: 'أجهزة العناية بالبشرة الإمارات | أجهزة LED والوخز دبي | GENOSYS', description: 'أجهزة GENOSYS المهنية للعناية بالبشرة، مع مواصفات تقنية واضحة وإرشادات استخدام يقودها المختص.', h1: 'أجهزة العناية بالبشرة الاحترافية' },
      ru: { title: 'Устройства для ухода за кожей ОАЭ | LED и микронидлинг Дубай | GENOSYS', description: 'Профессиональные аппараты GENOSYS для ухода за кожей с точными характеристиками и применением под контролем специалиста.', h1: 'Профессиональные устройства для ухода за кожей' },
    },
  },
  {
    slug: 'bio-meso',
    categoryKey: 'Bio Meso',
    seo: {
      en: { title: 'Bio Meso Products UAE | Mesotherapy Solutions Dubai | GENOSYS', description: 'GENOSYS Bio Meso professional solutions for mesotherapy treatments in UAE. Free shipping over 1000 AED.', h1: 'Bio Meso Solutions' },
      ar: { title: 'مستحضرات Bio Meso بالسبكيولات في الإمارات | GENOSYS', description: 'مستحضرات GENOSYS Bio Meso التجميلية بالسبكيولات للاستخدام الاحترافي والمنزلي في الإمارات.', h1: 'مستحضرات Bio Meso بالسبكيولات' },
      ru: { title: 'Спикульная косметика Bio Meso в ОАЭ | GENOSYS', description: 'Профессиональная и домашняя спикульная косметика GENOSYS Bio Meso в ОАЭ.', h1: 'Спикульная косметика Bio Meso' },
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
