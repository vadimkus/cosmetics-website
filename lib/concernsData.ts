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
      fileSize: '190 KB',
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
              summary: 'استعادة توازن الحموضة وإنشاء قاعدة رطبة. واقي الشمس ينتشر بشكل أفضل على البشرة المرطبة.',
              detail: 'ضعي باليدين أو بقطنة، واضغطي برفق على البشرة. انتقلي للخطوة التالية فوراً — لا حاجة للانتظار.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'السيروم', duration: '30 ثانية',
              summary: 'إضافة طبقة علاجية نشطة. مضادات الأكسدة تعمل بالتآزر مع SPF ضد الأشعة فوق البنفسجية والتلوث.',
              detail: 'ضعي 2-3 قطرات واربتي برفق على البشرة. انتظري 30 ثانية للامتصاص. اختاري حسب حاجتك: سيروم الهيالورون للجفاف، سيروم الحساسية للاحمرار، سيروم الإشراق للبقع الداكنة، سيروم مكافحة التجاعيد للخطوط الدقيقة.',
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
              detail: 'الخيار أ: كريم الشمس فقط (ULTRA SHIELD SPF 50+ أو MULTI SUN SPF 40) — ضعي شريط بطول إصبعين على الوجه والرقبة. الخيار ب: كريم BB/كوشن للتغطية + SPF. الخيار ج: طبقتين — كريم الشمس كقاعدة، انتظري دقيقة، ثم BB فوقه للحماية القصوى مع مظهر مثالي.',
              products: [
                { name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' },
                { name: 'MULTI SUN CREAM SPF 40', url: '/products/40', price: '210 AED' },
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
              summary: 'إعادة توازن الحموضة بعد التنظيف.',
              detail: 'نفس التونر الصباحي — ضعي باليدين أو بقطنة.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'سيروم المساء', duration: '30 ثانية',
              summary: 'علاج مستهدف أثناء إصلاح بشرتك ليلاً.',
              detail: 'استخدمي نفس سيروم الصباح، أو اختاري خياراً أكثر استهدافاً: سيروم الإشراق لتفتيح بقع الشمس، سيروم الهيالورون للترطيب العميق، سيروم مكافحة التجاعيد لمكافحة الشيخوخة الليلية.',
              products: [
                { name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' },
              ],
            },
            {
              step: 4, title: 'كريم الليل', duration: '30 ثانية',
              summary: 'حبس المكونات النشطة وحماية بشرتك المتجددة طوال الليل.',
              detail: 'اختاري حسب نوع بشرتك: كريم حماية الحاجز لجميع الأنواع، كريم الهيالورون للبشرة الجافة، كريم الإشراق للبشرة الباهتة والمصبوغة.',
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
              summary: 'Восстановите pH и создайте увлажнённую базу. Санскрин ложится ровнее на увлажнённую кожу.',
              detail: 'Нанесите руками или ватным диском, мягко вдавливая в кожу. Переходите к следующему шагу сразу — ждать не нужно.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Сыворотка', duration: '30 сек',
              summary: 'Добавьте активный лечебный слой. Антиоксиданты работают в синергии с SPF против УФ и загрязнений.',
              detail: 'Нанесите 2–3 капли и аккуратно вбейте в кожу. Подождите 30 секунд для впитывания. Выбирайте по потребности: Гиалуроновая сыворотка при обезвоживании, Сыворотка для чувствительной кожи при покраснениях, Сыворотка для сияния при пигментации, Антивозрастная сыворотка при мелких морщинах.',
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
              detail: 'Вариант А: Только солнцезащитный крем (ULTRA SHIELD SPF 50+ или MULTI SUN SPF 40) — нанесите полоску длиной в два пальца на лицо и шею. Вариант Б: BB-крем/кушон для покрытия + SPF. Вариант В: Оба слоя — санскрин как база, подождите минуту, затем BB сверху для максимальной защиты с безупречным финишем.',
              products: [
                { name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' },
                { name: 'MULTI SUN CREAM SPF 40', url: '/products/40', price: '210 AED' },
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
              summary: 'Восстановите баланс pH после очищения.',
              detail: 'Тот же тоник, что и утром — нанесите руками или ватным диском.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Вечерняя сыворотка', duration: '30 сек',
              summary: 'Целенаправленный уход, пока кожа восстанавливается ночью.',
              detail: 'Используйте ту же сыворотку, что и утром, или выберите более целенаправленный вариант: Сыворотка для сияния для осветления солнечных пятен, Гиалуроновая сыворотка для глубокого увлажнения, Антивозрастная сыворотка для ночного anti-age ухода.',
              products: [
                { name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' },
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' },
              ],
            },
            {
              step: 4, title: 'Ночной крем', duration: '30 сек',
              summary: 'Запечатайте активные ингредиенты и защитите обновлённую кожу на ночь.',
              detail: 'Выбирайте по типу кожи: Крем для защиты барьера для всех типов, Гиалуроновый крем для сухой/обезвоженной, Крем для сияния для тусклой/пигментированной кожи.',
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
        { question: 'ما الفرق بين كريم الشمس وكوشن BB مع SPF؟', answer: 'كريمات الشمس تركز على الحماية القصوى من الأشعة فوق البنفسجية. كوشن وكريمات BB تضيف تغطية طبيعية لإخفاء العيوب مع توفير حماية SPF. يمكن استخدام كليهما معاً — كريم الشمس كقاعدة والكوشن فوقه للحصول على مظهر مثالي.' },
      ],
      ru: [
        { question: 'Какой уровень SPF рекомендуется для защиты от солнца в ОАЭ?', answer: 'В ОАЭ дерматологи рекомендуют SPF 50+ с широкоспектральной защитой от UVA/UVB для ежедневного использования. Индекс УФ-излучения в Дубае регулярно превышает 11 (экстремальный), что делает высокую защиту необходимой круглый год.' },
        { question: 'В чём разница между солнцезащитным кремом и BB-кушоном с SPF?', answer: 'Солнцезащитные кремы обеспечивают максимальную UV-защиту с восстанавливающими ингредиентами. BB-кушоны и BB-кремы добавляют натуральное покрытие несовершенств и выравнивают тон кожи, одновременно обеспечивая SPF-защиту. Можно использовать оба — крем как базу, а кушон сверху.' },
      ],
    },
  },

  // ─── ACNE TREATMENT ──────────────────────────────────────────
  {
    slug: 'acne-treatment',
    concernKeys: ['acne-blemishes'],
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
      fileSize: '160 KB',
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
        title: 'لماذا يحتاج حب الشباب نهجاً مستهدفاً في الإمارات',
        items: [
          { icon: '🌡️', label: 'الحرارة والرطوبة', detail: 'مناخ الإمارات بدرجات حرارة 40+ ورطوبة عالية يزيد إفراز الدهون — المنظفات العادية لا تكفي' },
          { icon: '🔬', label: 'حمض الساليسيليك + النياسيناميد', detail: 'خط GENOSYS يستخدم BHA لفتح المسام والنياسيناميد لتهدئة الالتهاب في آن واحد' },
          { icon: '🛡️', label: 'تركيبة آمنة للحاجز', detail: 'يعالج حب الشباب دون تجريد حاجز البشرة — بدون جفاف أو دهون مرتدة' },
          { icon: '🧪', label: 'مستوى العيادة في المنزل', detail: 'نفس التركيبات المستخدمة من أطباء الجلدية في عيادات دبي' },
        ],
      },
      ru: {
        title: 'Почему акне требует целенаправленного подхода в ОАЭ',
        items: [
          { icon: '🌡️', label: 'Жара и влажность', detail: 'Климат ОАЭ с температурой 40°C+ и высокой влажностью усиливает выработку кожного сала — обычные средства не справляются' },
          { icon: '🔬', label: 'Салициловая кислота + ниацинамид', detail: 'Линейка GENOSYS использует BHA для очищения пор и ниацинамид для снятия воспаления одновременно' },
          { icon: '🛡️', label: 'Безопасно для барьера', detail: 'Лечит акне без повреждения защитного барьера кожи — без сухости, без обратной жирности' },
          { icon: '🧪', label: 'Клинический уровень дома', detail: 'Те же формулы, которые используют дерматологи в клиниках Дубая' },
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
              step: 2, title: 'تونر مكافحة حب الشباب', duration: '30 ثانية',
              summary: 'موازنة الحموضة وبدء تنظيم الدهون. هذا أساس نظام التحكم في المشاكل.',
              detail: 'بللي قطنة وامسحي منطقة T والذقن والفك — المناطق التي تتركز فيها البثور في مناخ الإمارات. يحتوي التونر على حمض الساليسيليك لإذابة الرواسب المسدودة للمسام والنياسيناميد لتهدئة الاحمرار. يمكن استخدامه ككمادة موضعية: ضعي قطنة مبللة على البثرة لمدة 30 ثانية.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 3, title: 'سيروم التحكم في المشاكل', duration: '30 ثانية',
              summary: 'علاج مستهدف يقلل الالتهاب ويمنع تكون آفات جديدة.',
              detail: 'ضعي 2-3 قطرات على الوجه بالكامل مع التركيز على مناطق البثور النشطة. يخترق السيروم أعمق من التونر لإيصال المكونات المضادة للالتهاب والمنظمة للدهون إلى البصيلة. انتظري 30 ثانية للامتصاص. للبثور الشديدة، ضعي قطرة إضافية مباشرة على كل بثرة.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 4, title: 'مرطب خفيف', duration: '30 ثانية',
              summary: 'حتى البشرة الدهنية المعرضة لحب الشباب تحتاج ترطيب. تخطي المرطب يحفز إنتاج المزيد من الدهون.',
              detail: 'ضعي طبقة رقيقة من كريم التحكم في المشاكل. خالٍ من الزيوت وغير مسبب للكوميدونات — مصمم خصيصاً للبشرة المعرضة لحب الشباب. يحبس المكونات النشطة من السيروم ويتحكم في اللمعان طوال اليوم.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL CREAM', url: '/products/30', price: '290 AED' }],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'الأشعة فوق البنفسجية تغمق آثار حب الشباب وتسبب فرط التصبغ التالي للالتهاب. SPF غير قابل للتفاوض.',
              detail: 'ضعي ULTRA SHIELD SUN CREAM بكمية كافية على الوجه والرقبة. تركيبته الخفيفة لن تسد المسام أو تحفز البثور. هذا مهم بشكل خاص في الإمارات حيث مؤشر UV يتجاوز 11 طوال العام — بدون SPF، كل بثرة تُشفى تترك علامة داكنة.',
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
              step: 3, title: 'تونر مكافحة حب الشباب', duration: '30 ثانية',
              summary: 'التطبيق الثاني يعيد توازن الحموضة بعد التنظيف ويوصل جرعة أخرى من BHA.',
              detail: 'نفس تقنية الصباح — امسحي المناطق المشكلة بقطنة مبللة. التطبيق المسائي فعال بشكل خاص لأن المكونات النشطة تعمل ليلاً بدون تداخل الأشعة فوق البنفسجية.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 4, title: 'سيروم التحكم في المشاكل', duration: '30 ثانية',
              summary: 'علاج ليلي عندما يكون إصلاح البشرة في أقصى نشاطه. المكونات النشطة تعمل بضعف الفعالية أثناء النوم.',
              detail: 'ضعي 3-4 قطرات (أكثر قليلاً من الصباح). يعمل السيروم مع دورة إصلاح البشرة الطبيعية أثناء الليل. للبثور العنيدة، ضعي قطرة إضافية كعلاج موضعي بعد التطبيق الكامل.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 5, title: 'مرطب ليلي', duration: '30 ثانية',
              summary: 'حبس المكونات العلاجية النشطة ودعم تعافي الحاجز أثناء النوم.',
              detail: 'ضعي كريم التحكم في المشاكل. التركيبة الخفيفة لن تسد المسام ليلاً. إذا شعرتِ بجفاف البشرة (شائع مع علاجات حب الشباب)، يمكنك مزج قطرة من سيروم الهيالورون مع الكريم لترطيب إضافي بدون زيوت.',
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
              step: 2, title: 'Тоник против акне', duration: '30 сек',
              summary: 'Баланс pH и начало регуляции себума. Это основа системы Problem Control.',
              detail: 'Смочите ватный диск и проведите по Т-зоне, подбородку и линии челюсти — зонам, где высыпания концентрируются в климате ОАЭ. Тоник содержит салициловую кислоту для растворения закупоривающих поры пробок и ниацинамид для снятия покраснений. Можно использовать как точечный компресс: прижмите смоченный диск к кистозному воспалению на 30 секунд.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 3, title: 'Сыворотка Problem Control', duration: '30 сек',
              summary: 'Целенаправленное лечение, которое снимает воспаление и предотвращает образование новых элементов.',
              detail: 'Нанесите 2–3 капли на всё лицо, концентрируясь на зонах активных высыпаний. Сыворотка проникает глубже тоника, доставляя противовоспалительные и себорегулирующие активы в фолликул. Подождите 30 секунд для впитывания. При сильных высыпаниях нанесите дополнительную каплю непосредственно на каждый элемент.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 4, title: 'Лёгкий увлажняющий крем', duration: '30 сек',
              summary: 'Даже жирная кожа, склонная к акне, нуждается в увлажнении. Пропуск увлажнения провоцирует ещё больше жира.',
              detail: 'Нанесите тонкий слой крема Problem Control. Он безмасляный и некомедогенный — создан специально для проблемной кожи. Запечатывает активы сыворотки и контролирует жирный блеск в течение дня. Избегайте плотных кремов или масел, которые забивают поры.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL CREAM', url: '/products/30', price: '290 AED' }],
            },
            {
              step: 5, title: 'Защита от солнца', duration: '30 сек',
              summary: 'УФ-лучи затемняют следы от акне и вызывают поствоспалительную гиперпигментацию. SPF обязателен.',
              detail: 'Нанесите ULTRA SHIELD SUN CREAM щедро на лицо и шею. Лёгкая нежирная формула не забивает поры и не провоцирует высыпания. Это особенно важно в ОАЭ, где УФ-индекс превышает 11 круглый год — без SPF каждое заживлённое воспаление оставляет тёмное пятно.',
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
              step: 3, title: 'Тоник против акне', duration: '30 сек',
              summary: 'Второе нанесение восстанавливает pH после очищения и доставляет ещё одну дозу BHA.',
              detail: 'Та же техника, что и утром — проведите по проблемным зонам смоченным ватным диском. Вечернее нанесение особенно эффективно, потому что активы работают ночью без вмешательства УФ-лучей.',
              products: [{ name: 'INTENSIVE PROBLEM CONTROL TONER', url: '/products/15', price: '260 AED' }],
            },
            {
              step: 4, title: 'Сыворотка Problem Control', duration: '30 сек',
              summary: 'Ночное лечение, когда восстановление кожи наиболее активно. Активы работают вдвое эффективнее во сне.',
              detail: 'Нанесите 3–4 капли (чуть больше, чем утром). Сыворотка работает с естественным ночным циклом восстановления кожи. Для упорных элементов нанесите дополнительную каплю как точечное средство после нанесения на всё лицо.',
              products: [{ name: 'PROBLEM CONTROL SERUM', url: '/products/20', price: '330 AED' }],
            },
            {
              step: 5, title: 'Ночной увлажняющий крем', duration: '30 сек',
              summary: 'Запечатайте лечебные активы и поддержите восстановление барьера во сне.',
              detail: 'Нанесите крем Problem Control. Лёгкая формула не забьёт поры за ночь. Если кожа ощущается особенно сухой (обычное явление при лечении акне), можно смешать одну каплю гиалуроновой сыворотки с кремом для дополнительного увлажнения без масел.',
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
        title: 'منتجات علاج حب الشباب الإمارات | مكافحة البثور دبي | GENOSYS',
        description: 'حلول احترافية كورية لعلاج حب الشباب في الإمارات. سيرومات وكريمات GENOSYS للتحكم في البثور والبشرة الدهنية. مختبرة طبياً. توصيل مجاني فوق 1000 درهم.',
        h1: 'علاج حب الشباب والبثور',
        heroShort: 'علاج كوري احترافي لحب الشباب — تونر وسيروم وكريم مثبتون سريرياً يتحكمون في البثور دون الإضرار بحاجز البشرة.',
        intro: 'حب الشباب والبثور من أكثر مشاكل البشرة شيوعاً في الإمارات، وتتفاقم بسبب الحرارة والرطوبة والعوامل البيئية. خط GENOSYS للتحكم المكثف في المشاكل يقدم نهجاً مثبتاً سريرياً لإدارة حب الشباب.',
        keywords: ['علاج حب الشباب الإمارات', 'مكافحة البثور دبي', 'سيروم حب الشباب', 'منتجات كورية للبثور'],
      },
      ru: {
        title: 'Средства от акне ОАЭ | Лечение прыщей Дубай | GENOSYS',
        description: 'Профессиональные корейские средства от акне в ОАЭ. Сыворотки и кремы GENOSYS для контроля высыпаний и жирной кожи. Дерматологически протестированы. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Лечение акне и высыпаний',
        heroShort: 'Профессиональное корейское лечение акне — клинически доказанные тоник, сыворотка и крем, которые контролируют высыпания, не повреждая защитный барьер кожи.',
        intro: 'Акне и высыпания — одни из самых распространённых проблем кожи в ОАЭ, усугубляемые жарой, влажностью и экологическими факторами. Линейка GENOSYS Intensive Problem Control предлагает клинически доказанный подход к лечению акне — профессиональные тоники, сыворотки и кремы.',
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
        { question: 'ما هو أفضل علاج كوري لحب الشباب في الإمارات؟', answer: 'خط GENOSYS للتحكم المكثف في المشاكل مصمم خصيصاً للبشرة المعرضة لحب الشباب. سيروم التحكم في المشاكل وكريم التحكم في المشاكل يعملان معاً لتقليل البثور والتحكم في إفراز الدهون. هذه المنتجات مستخدمة من أطباء الجلدية في عيادات دبي.' },
        { question: 'هل الرطوبة في دبي تزيد حب الشباب سوءاً؟', answer: 'نعم، الرطوبة العالية مع الحرارة تزيد إفراز الدهون وتسد المسام وتحفز البثور. منتجات GENOSYS تحتوي على مكونات فعالة لتنظيم الدهون تعمل بفعالية في مناخ الإمارات.' },
        { question: 'كم يستغرق ظهور النتائج مع خط التحكم في المشاكل؟', answer: 'يلاحظ معظم المستخدمين انخفاض الدهون وتقليل البثور الجديدة خلال أسبوع إلى أسبوعين. البثور الموجودة تبدأ بالتسطح والتلاشي خلال 2-4 أسابيع. للتنظيف الكامل، توقع 6-8 أسابيع من الاستخدام المنتظم.' },
        { question: 'هل يجب أن أرطب بشرتي إذا كانت دهنية ومعرضة لحب الشباب؟', answer: 'بالتأكيد. تخطي المرطب يرسل إشارة لبشرتك لإنتاج المزيد من الدهون. كريم التحكم المكثف خالٍ من الزيوت وغير مسبب للكوميدونات ومصمم خصيصاً للبشرة الدهنية والمختلطة.' },
      ],
      ru: [
        { question: 'Какое корейское средство от акне лучше всего подходит для ОАЭ?', answer: 'Линейка GENOSYS Intensive Problem Control специально разработана для кожи, склонной к акне. Сыворотка Problem Control и крем Problem Control работают вместе для уменьшения высыпаний и контроля выработки кожного сала. Эти средства используются дерматологами в клиниках Дубая.' },
        { question: 'Сколько времени нужно, чтобы увидеть результаты?', answer: 'Большинство пользователей замечают снижение жирности и меньше новых высыпаний через 1–2 недели регулярного использования. Существующие воспаления начинают уменьшаться через 2–4 недели. Для полного очищения ожидайте 6–8 недель. Ключ — постоянство: используйте систему Тоник → Сыворотка → Крем утром и вечером.' },
        { question: 'Можно ли использовать средства от акне при чувствительной коже?', answer: 'Да. Линейка Problem Control разработана так, чтобы эффективно бороться с акне, защищая при этом барьер кожи. Концентрации салициловой кислоты и ниацинамида подобраны для лечения без раздражения и сухости. При очень чувствительной коже начните с Тоника и Крема, а через неделю добавьте Сыворотку.' },
        { question: 'Нужно ли увлажнять жирную кожу, склонную к акне?', answer: 'Обязательно. Пропуск увлажнения сигнализирует коже вырабатывать ещё больше сала. Крем Intensive Problem Control — безмасляный, некомедогенный, специально разработан для жирной и комбинированной кожи.' },
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
