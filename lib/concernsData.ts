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
          { icon: '☀️', label: 'الأشعة فوق البنفسجية والميلانين', detail: 'مؤشر UV في دبي يتجاوز 11 بانتظام — مما يحفز إفراط إنتاج الميلانين ويسبب البقع الداكنة العنيدة' },
          { icon: '🧪', label: 'فيتامين سي + نياسيناميد + أربوتين', detail: 'خط GENOSYS Multi Vita Radiance يستخدم مركب تفتيح ثلاثي المفعول لتثبيط التيروزيناز وتفتيح التصبغات' },
          { icon: '🤝', label: 'آمن لجميع ألوان البشرة', detail: 'يعمل عن طريق تنظيم الميلانين وليس التبييض — آمن لأنواع فيتزباتريك IV-VI الشائعة في الشرق الأوسط' },
          { icon: '🛡️', label: 'تآزر مع واقي الشمس', detail: 'المكونات المفتحة تعمل بشكل أفضل مع SPF 50+ — تمنع البقع الجديدة أثناء تفتيح الموجودة' },
        ],
      },
      ru: {
        title: 'Почему пигментация требует целенаправленного подхода в ОАЭ',
        items: [
          { icon: '☀️', label: 'УФ и меланин', detail: 'УФ-индекс в Дубае регулярно превышает 11 — это запускает избыточную выработку меланина, вызывая стойкие тёмные пятна' },
          { icon: '🧪', label: 'Витамин С + Ниацинамид + Арбутин', detail: 'Линейка GENOSYS Multi Vita Radiance использует тройной осветляющий комплекс для подавления тирозиназы и осветления пигментации' },
          { icon: '🤝', label: 'Безопасно для всех тонов кожи', detail: 'Регулирует меланин, а не отбеливает — безопасно для фототипов IV–VI, распространённых на Ближнем Востоке' },
          { icon: '🛡️', label: 'Синергия с SPF', detail: 'Осветляющие активы работают лучше всего в сочетании с SPF 50+ — предотвращает новые пятна, осветляя существующие' },
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
        title: 'علاج التصبغات الإمارات | البقع الداكنة وتفتيح البشرة دبي | GENOSYS',
        description: 'علاج احترافي كوري للتصبغات في الإمارات. سيرومات وكريمات GENOSYS لتفتيح البشرة وتقليل البقع الداكنة. مختبرة طبياً. توصيل مجاني فوق 1000 درهم.',
        h1: 'علاج التصبغات وتفتيح البشرة',
        heroShort: 'سيرومات وكريمات تفتيح كورية احترافية — تقلل البقع الداكنة وتوحد لون البشرة وتستعيد الإشراق بفيتامين سي والنياسيناميد والأربوتين.',
        intro: 'فرط التصبغ والبقع الداكنة شائعة للغاية في الإمارات بسبب التعرض المكثف للشمس طوال العام. خط GENOSYS Multi Vita Radiance يجمع بين تقنية التفتيح الكورية ومكونات فعالة لتقليل إنتاج الميلانين الزائد وتوحيد لون البشرة.',
        keywords: ['علاج التصبغات الإمارات', 'البقع الداكنة دبي', 'تفتيح البشرة الإمارات', 'كريم تفتيح كوري'],
      },
      ru: {
        title: 'Лечение пигментации ОАЭ | Тёмные пятна и осветление Дубай | GENOSYS',
        description: 'Профессиональное корейское лечение пигментации в ОАЭ. Сыворотки и кремы GENOSYS для осветления кожи и уменьшения тёмных пятен. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Лечение пигментации и осветление кожи',
        heroShort: 'Профессиональные корейские осветляющие сыворотки и кремы — уменьшают тёмные пятна, выравнивают тон и возвращают сияние с витамином С, ниацинамидом и арбутином.',
        intro: 'Гиперпигментация и тёмные пятна чрезвычайно распространены в ОАЭ из-за интенсивного солнечного воздействия в течение всего года. Линейка GENOSYS Multi Vita Radiance сочетает корейские технологии осветления с мощными ингредиентами для видимого уменьшения выработки меланина и выравнивания тона кожи.',
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
              summary: 'استعادة توازن الحموضة وإنشاء قاعدة رطبة. السيرومات المفتحة تُمتص بشكل أفضل على البشرة المحضّرة.',
              detail: 'رشي الميست أو ضعي التونر باليدين، واضغطي برفق على البشرة. انتقلي للخطوة التالية فوراً.',
              products: [
                { name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' },
                { name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' },
              ],
            },
            {
              step: 3, title: 'سيروم التفتيح', duration: '30 ثانية',
              summary: 'الخطوة الأساسية للتفتيح — فيتامين سي والنياسيناميد والأربوتين يثبطون إنتاج الميلانين.',
              detail: 'ضعي 2-3 قطرات من سيروم Multi Vita Radiance واربتي برفق على البشرة، مع التركيز على مناطق البقع الداكنة. انتظري 30 ثانية للامتصاص.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم التفتيح', duration: '30 ثانية',
              summary: 'حبس المكونات المفتحة وتوفير ترطيب دائم مع معززات إشراق إضافية.',
              detail: 'ضعي كمية بحجم حبة البازلاء من كريم Multi Vita Radiance فوق السيروم. للترطيب الإضافي، ضعي كريم الهيالورون تحته على المناطق الجافة.',
              products: [
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'الخطوة الأهم للتصبغات — التعرض للأشعة فوق البنفسجية يلغي كل تقدم التفتيح.',
              detail: 'ضعي شريط بطول إصبعين من ULTRA SHIELD SPF 50+ على الوجه والرقبة. بدون واقي شمس يومي، ستعود البقع الداكنة بغض النظر عن السيرومات والكريمات المستخدمة.',
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
              summary: 'الليل هو وقت تجدد البشرة — المكونات المفتحة تعمل بجهد أكبر أثناء النوم.',
              detail: 'ضعي 2-3 قطرات من سيروم Multi Vita Radiance مع التركيز على المناطق المصبوغة. التطبيق الليلي يسمح لفيتامين سي والنياسيناميد بالعمل دون تداخل الأشعة فوق البنفسجية.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم الليل', duration: '30 ثانية',
              summary: 'حبس المكونات النشطة ودعم إصلاح حاجز البشرة طوال الليل.',
              detail: 'اختاري حسب نوع بشرتك: كريم حماية الحاجز لجميع الأنواع، كريم الإشراق للبشرة الباهتة والمصبوغة، كريم الهيالورون للبشرة الجافة.',
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
              summary: 'Восстановите pH и создайте увлажнённую базу. Осветляющие сыворотки впитываются ровнее на подготовленной коже.',
              detail: 'Распылите мист или нанесите тоник руками, мягко вдавливая в кожу. Переходите к следующему шагу сразу.',
              products: [
                { name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' },
                { name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' },
              ],
            },
            {
              step: 3, title: 'Осветляющая сыворотка', duration: '30 сек',
              summary: 'Основной осветляющий шаг — витамин С, ниацинамид и арбутин подавляют выработку меланина.',
              detail: 'Нанесите 2–3 капли сыворотки Multi Vita Radiance и аккуратно вбейте в кожу, уделяя внимание зонам с тёмными пятнами. Подождите 30 секунд для впитывания.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'Осветляющий крем', duration: '30 сек',
              summary: 'Зафиксируйте осветляющие активы и обеспечьте длительное увлажнение с дополнительными компонентами для сияния.',
              detail: 'Нанесите количество размером с горошину крема Multi Vita Radiance поверх сыворотки. Для дополнительного увлажнения нанесите гиалуроновый крем под низ на сухие участки.',
              products: [
                { name: 'MULTI VITA RADIANCE CREAM', url: '/products/31', price: '290 AED' },
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'Защита от солнца', duration: '30 сек',
              summary: 'Самый важный шаг при пигментации — УФ-воздействие сводит на нет весь прогресс осветления.',
              detail: 'Нанесите полоску длиной в два пальца ULTRA SHIELD SPF 50+ на лицо и шею. Без ежедневного SPF тёмные пятна вернутся независимо от используемых сывороток и кремов.',
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
              summary: 'Ночь — время регенерации кожи. Осветляющие активы работают интенсивнее во сне.',
              detail: 'Нанесите 2–3 капли сыворотки Multi Vita Radiance, уделяя внимание пигментированным зонам. Ночное нанесение позволяет витамину С и ниацинамиду работать без УФ-интерференции.',
              products: [{ name: 'MULTI VITA RADIANCE SERUM', url: '/products/21', price: '330 AED' }],
            },
            {
              step: 4, title: 'Ночной крем', duration: '30 сек',
              summary: 'Зафиксируйте активные ингредиенты и поддержите восстановление барьера кожи ночью.',
              detail: 'Выбирайте по типу кожи: Barrier Protecting Cream для всех типов (максимальная поддержка барьера), Radiance Cream для тусклой/пигментированной кожи, Hyaluron Cream для сухой/обезвоженной.',
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
        { question: 'ما أسباب التصبغات في الإمارات وكيفية علاجها؟', answer: 'التصبغات في الإمارات ناتجة بشكل رئيسي عن التعرض المكثف للأشعة فوق البنفسجية (مؤشر UV يتجاوز 11 بانتظام)، والتغيرات الهرمونية، وفرط التصبغ التالي للالتهاب من حب الشباب. سيروم وكريم GENOSYS Multi Vita Radiance يحتويان على فيتامين سي ونياسيناميد وأربوتين — مركب تفتيح كوري ثلاثي المفعول يثبط إنتاج الميلانين ويفتح البقع الداكنة تدريجياً. للحصول على أفضل النتائج، استخدميه دائماً مع واقي شمس SPF 50+.' },
        { question: 'هل منتجات التفتيح الكورية آمنة للبشرة الداكنة؟', answer: 'نعم، منتجات GENOSYS للتفتيح مصممة لتكون آمنة لجميع ألوان البشرة، بما في ذلك أنواع فيتزباتريك IV-VI الشائعة في الشرق الأوسط. تعمل عن طريق تنظيم إنتاج الميلانين وليس التبييض، مما يجعلها أكثر أماناً وفعالية للاستخدام طويل الأمد. جميع المنتجات مختبرة طبياً وخالية من الهيدروكينون.' },
        { question: 'كم من الوقت يستغرق ظهور نتائج التفتيح؟', answer: 'معظم المستخدمين يلاحظون تحسناً واضحاً في إشراق البشرة خلال 2-3 أسابيع من الاستخدام المنتظم. تفتيح البقع الداكنة بشكل ملحوظ يستغرق عادة 6-8 أسابيع مع التطبيق مرتين يومياً. الانتظام واستخدام SPF 50+ يومياً هما العاملان الأكبر لنتائج أسرع.' },
        { question: 'ما واقي الشمس المناسب مع روتين التفتيح؟', answer: 'واقي شمس SPF 50+ واسع الطيف ضروري عند علاج التصبغات. التعرض للأشعة فوق البنفسجية هو المحفز الأول لإفراط إنتاج الميلانين. كريم ULTRA SHIELD SPF 50+ مصمم خصيصاً لمكملة خط Multi Vita Radiance — خفيف وغير دهني ومناسب للاستخدام تحت المكياج في حرارة الإمارات.' },
      ],
      ru: [
        { question: 'Что вызывает пигментацию в ОАЭ и как её лечить?', answer: 'Пигментация в ОАЭ в основном вызвана интенсивным УФ-воздействием (индекс регулярно превышает 11), гормональными изменениями и поствоспалительной гиперпигментацией от акне. Сыворотка и крем GENOSYS Multi Vita Radiance содержат витамин С, ниацинамид и арбутин — тройной корейский осветляющий комплекс, который подавляет активность тирозиназы и постепенно осветляет тёмные пятна. Для лучших результатов всегда сочетайте с SPF 50+.' },
        { question: 'Безопасны ли корейские осветляющие средства для тёмной кожи?', answer: 'Да, осветляющие средства GENOSYS безопасны для всех тонов кожи, включая фототипы IV–VI по Фитцпатрику, распространённые на Ближнем Востоке. Они работают за счёт регулирования выработки меланина через ингибирование тирозиназы, а не отбеливания, что делает их безопаснее и эффективнее при длительном использовании. Все средства дерматологически протестированы и не содержат гидрохинон.' },
        { question: 'Через какое время видны результаты осветления?', answer: 'Большинство пользователей замечают видимое улучшение сияния кожи через 2–3 недели регулярного использования. Значительное осветление тёмных пятен обычно занимает 6–8 недель при двукратном ежедневном нанесении сыворотки и крема Multi Vita Radiance. Для более глубокой мелазмы может потребоваться 3–4 месяца. Регулярность и ежедневный SPF 50+ — два главных фактора быстрых результатов.' },
        { question: 'Какой SPF использовать при осветляющем уходе?', answer: 'SPF 50+ широкого спектра обязателен при лечении пигментации. УФ-воздействие — главный триггер избыточной выработки меланина, поэтому даже лучшая осветляющая сыворотка не сработает без ежедневной защиты от солнца. ULTRA SHIELD SUN CREAM SPF 50+ специально разработан для дополнения линейки Multi Vita Radiance — лёгкий, нежирный, подходит для использования под макияж в жару ОАЭ.' },
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
              summary: 'استعادة توازن الحموضة وتحضير البشرة للمكونات الإصلاحية.',
              detail: 'ضعي SNOW BOOSTER باليدين واضغطي برفق على البشرة. هذا ينشئ قاعدة رطبة تساعد EGF وحمض الهيالورونيك على التغلغل بفعالية أكبر في أنسجة الندبات.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'سيروم الهيالورون', duration: '30 ثانية',
              summary: 'الحفاظ على ترطيب أنسجة الندبات — الندبات الجافة تبدو أكثر وضوحاً وتلتئم أبطأ.',
              detail: 'ضعي 2-3 قطرات من سيروم الهيالورون واربتي برفق على الوجه مع التركيز على المناطق المتندبة. حمض الهيالورونيك يجذب الرطوبة إلى الأنسجة ويملأ الندبات الغائرة.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم الإصلاح المهدئ', duration: '30 ثانية',
              summary: 'خطوة EGF الأساسية — عامل نمو البشرة يسرّع تجديد الخلايا في أنسجة الندبات.',
              detail: 'ضعي كمية بحجم حبة البازلاء من كريم الإصلاح المهدئ مع التركيز على المناطق المتندبة. EGF يرسل إشارات للخلايا لتتجدد أسرع، ويستبدل تدريجياً كولاجين الندبة بأنسجة سليمة.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 5, title: 'واقي الشمس', duration: '30 ثانية',
              summary: 'ضروري لمنع تغمّق الندبات — الأشعة فوق البنفسجية تصبّغ الأنسجة المتعافية بشكل دائم.',
              detail: 'ضعي شريطاً بطول إصبعين من ULTRA SHIELD SPF 50+ على الوجه والرقبة. أنسجة الندبات حساسة بشكل خاص لأضرار الأشعة فوق البنفسجية — التعرض بدون حماية يغمّق الندبات بشكل دائم.',
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
              step: 3, title: 'قناع PDRN للإصلاح', duration: '15-20 دقيقة',
              summary: 'إصلاح مكثف بـ PDRN — الحمض النووي من السلمون يحفز إعادة بناء الكولاجين في أنسجة الندبات.',
              detail: 'ضعي SKIN REBOOT PDRN MASK PACK مساءً 2-3 مرات أسبوعياً. يعزز PDRN (الحمض النووي من السلمون) تجديد الأنسجة وتخليق الكولاجين في أنسجة الندبات. أزيلي القناع بعد 15-20 دقيقة ودلكي الخلاصة المتبقية.',
              products: [{ name: 'SKIN REBOOT PDRN MASK PACK', url: '/products/52', price: '400 AED' }],
            },
            {
              step: 4, title: 'كريم الحاجز', duration: '30 ثانية',
              summary: 'حبس المكونات الإصلاحية وحماية حاجز البشرة طوال الليل.',
              detail: 'ضعي كريم حماية حاجز البشرة لقفل المكونات الإصلاحية ومنع فقدان الماء أثناء النوم. حاجز قوي ضروري لالتئام الندبات.',
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
              summary: 'Восстановите pH-баланс и подготовьте кожу к восстанавливающим активам.',
              detail: 'Нанесите SNOW BOOSTER руками, мягко вдавливая в кожу. Создаёт увлажнённую основу, которая помогает EGF и гиалуроновой кислоте проникать глубже в рубцовую ткань.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Гиалуроновая сыворотка', duration: '30 сек',
              summary: 'Увлажнение рубцовой ткани — обезвоженные рубцы выглядят заметнее и заживают медленнее.',
              detail: 'Нанесите 2–3 капли сыворотки с гиалуроновой кислотой и вбейте похлопывающими движениями, уделяя внимание рубцовым участкам. Гиалуроновая кислота притягивает влагу в ткани, заполняя атрофические рубцы.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'Восстанавливающий крем', duration: '30 сек',
              summary: 'Основной шаг с EGF — эпидермальный фактор роста ускоряет регенерацию клеток в рубцовой ткани.',
              detail: 'Нанесите крем Soothing Repair Postcream размером с горошину на рубцовые участки. EGF стимулирует клетки к ускоренному обновлению, постепенно заменяя дезорганизованный коллаген рубца здоровой тканью.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 5, title: 'Солнцезащита', duration: '30 сек',
              summary: 'Критически важно для предотвращения потемнения рубцов — УФ навсегда пигментирует заживающую ткань.',
              detail: 'Нанесите полоску ULTRA SHIELD SPF 50+ длиной в два пальца на лицо и шею. Рубцовая ткань особенно уязвима к УФ-повреждениям — незащищённое пребывание на солнце навсегда затемняет рубцы.',
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
              step: 3, title: 'PDRN-маска', duration: '15–20 мин',
              summary: 'Интенсивное восстановление с PDRN — ДНК лосося стимулирует ремоделирование коллагена в рубцовой ткани.',
              detail: 'Наносите SKIN REBOOT PDRN MASK PACK вечером 2–3 раза в неделю. PDRN (ДНК лосося) стимулирует регенерацию тканей и синтез коллагена в рубцовой ткани. Снимите маску через 15–20 минут и вбейте остатки эссенции.',
              products: [{ name: 'SKIN REBOOT PDRN MASK PACK', url: '/products/52', price: '400 AED' }],
            },
            {
              step: 4, title: 'Барьерный крем', duration: '30 сек',
              summary: 'Запечатайте восстанавливающие активы и защитите барьер кожи на ночь.',
              detail: 'Нанесите SKIN BARRIER PROTECTING CREAM для фиксации восстанавливающих активов и предотвращения трансэпидермальной потери воды. Крепкий барьер необходим для заживления рубцов.',
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
        { question: 'Сколько времени нужно для улучшения рубцов?', answer: 'Результаты зависят от типа и глубины рубца. Поверхностные следы постакне могут начать бледнеть через 4–6 недель регулярного использования EGF. Более глубокие атрофические рубцы показывают заметное улучшение через 8–12 недель при комбинированном уходе: ежедневный EGF-крем, пилинг дважды в неделю и восстанавливающая PDRN-маска вечером. Профессиональный микронидлинг ускоряет результаты — большинство пациентов видят 40–60% улучшение после 3 сеансов.' },
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
        title: 'لماذا يحتاج تساقط الشعر نهجاً مستهدفاً في الإمارات',
        items: [
          { icon: '🌡️', label: 'محفزات تساقط الشعر في الإمارات', detail: 'الحرارة الشديدة والمياه العسرة ومفارقة فيتامين د (نمط حياة داخلي رغم الشمس طوال العام) والإجهاد المزمن — كلها تسرّع ترقق الشعر في الخليج' },
          { icon: '🔬', label: 'تقنية تنشيط البصيلات', detail: 'خط GENOSYS HR3 MATRIX يوصل الببتيدات والبيوتين والكافيين مباشرة إلى البصيلة لإعادة تنشيط مرحلة النمو' },
          { icon: '🌿', label: 'نهج النظام البيئي لفروة الرأس', detail: 'الشعر الصحي يبدأ بفروة رأس صحية — نظامنا يقشر الترسبات ويوازن الدهون ويستعيد الميكروبيوم لوظيفة مثالية للبصيلات' },
          { icon: '🧪', label: 'علاج العيادات في المنزل', detail: 'نفس تركيبات HR3 MATRIX المستخدمة من قبل أطباء الشعر وعيادات الأمراض الجلدية في دبي، متاحة الآن لروتينك المنزلي اليومي' },
        ],
      },
      ru: {
        title: 'Почему выпадение волос требует целенаправленного подхода в ОАЭ',
        items: [
          { icon: '🌡️', label: 'Триггеры выпадения в ОАЭ', detail: 'Экстремальная жара, жёсткая вода с высоким содержанием минералов, парадокс витамина D (домашний образ жизни несмотря на круглогодичное солнце) и хронический стресс — всё это ускоряет истончение волос' },
          { icon: '🔬', label: 'Технология активации фолликулов', detail: 'Линейка GENOSYS HR3 MATRIX доставляет пептиды, биотин и кофеин непосредственно в фолликул для реактивации фазы роста (анагена)' },
          { icon: '🌿', label: 'Экосистемный подход к коже головы', detail: 'Здоровые волосы начинаются со здоровой кожи головы — наша система отшелушивает отложения, балансирует себум и восстанавливает микробиом для оптимальной работы фолликулов' },
          { icon: '🧪', label: 'Клинический уровень дома', detail: 'Те же формулы HR3 MATRIX, которые используют трихологи и дерматологические клиники Дубая, теперь доступны для вашего ежедневного домашнего ухода' },
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
        description: 'عناية كورية احترافية بفروة الرأس في الإمارات. مجموعة GENOSYS HR³ MATRIX — شامبو وتونر وأمبولة ومقشّر — مع التركيز المقيس خلف كل مكوّن نذكره. توصيل مجاني فوق 1000 درهم.',
        h1: 'تساقط الشعر والعناية بفروة الرأس',
        heroShort: 'عناية كورية احترافية بفروة الرأس — شامبو وتونر وأمبولة HR³ MATRIX، مسجّلة لتنظيف فروة الرأس وتغذيتها وتكييف الشعر.',
        intro: 'الخفة والتساقط من الهموم الشائعة في الإمارات، حيث يعمل الإجهاد ونقص فيتامين د والحرارة والمياه العسرة كلها ضد فروة الرأس. تقدّم GENOSYS مجموعة كورية احترافية تنظّف وتبرّد وتكيّف البشرة التي ينمو منها شعرك، وننشر التركيز المقيس خلف كل مكوّن نذكره. وما لا نفعله هو تسميتها علاجاً: فلا أحد من هذه المنتجات مسجّل لعلاج تساقط الشعر، وإن كنت تفقدين شعرك فالخطوة الأولى طبيب، لأن عدة أسباب تُعالج بأشياء لا يستطيع مستحضر التجميل أن يحلّ محلها.',
        keywords: ['تساقط الشعر الإمارات', 'العناية بفروة الرأس', 'منتجات كورية لفروة الرأس', 'خفة الشعر دبي'],
      },
      ru: {
        title: 'Выпадение волос и уход за кожей головы ОАЭ | Корейская линия Дубай | GENOSYS',
        description: 'Профессиональный корейский уход за кожей головы в ОАЭ. Линия GENOSYS HR³ MATRIX — шампунь, тоник, ампула и пилинг — с измеренной концентрацией за каждым названным ингредиентом. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Выпадение волос и уход за кожей головы',
        heroShort: 'Профессиональный корейский уход за кожей головы — шампунь, тоник и ампула HR³ MATRIX, зарегистрированные для очищения и питания кожи головы и кондиционирования волос.',
        intro: 'Истончение и повышенное выпадение — частые поводы для беспокойства в ОАЭ, где против кожи головы работают стресс, дефицит витамина D при домашне-офисном образе жизни, жара и жёсткая вода. GENOSYS предлагает профессиональную корейскую линию, которая очищает, охлаждает и кондиционирует кожу, из которой растут волосы, и мы публикуем измеренную концентрацию за каждым названным ингредиентом. Чего мы не делаем — так это не называем это лечением: ни один из этих продуктов не зарегистрирован для лечения выпадения волос, и если волосы выпадают, первый шаг — врач, потому что часть причин лечится тем, что косметика заменить не может.',
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
              step: 1, title: 'الشامبو', duration: 'دقيقتان',
              summary: 'تنظيف لطيف لفروة الرأس دون تجريد الزيوت الطبيعية.',
              detail: 'بللي الشعر جيداً. ضعي كمية صغيرة من شامبو HR3 Matrix على فروة الرأس (وليس الأطوال) ودلكي بأطراف الأصابع لمدة 60 ثانية. التركيبة الخالية من السلفات تنظف دون الإخلال بحاجز فروة الرأس. اشطفي بماء فاتر.',
              products: [{ name: 'HR3 MATRIX SHAMPOO', url: '/products/44', price: '340 AED' }],
            },
            {
              step: 2, title: 'التونيك', duration: 'دقيقة واحدة',
              summary: 'خطوة تنشيط البصيلات الأساسية — يوصل الببتيدات والكافيين مباشرة لفروة الرأس.',
              detail: 'قسمي الشعر إلى أقسام وضعي تونيك HR3 Matrix مباشرة على فروة الرأس. دلكي برفق لمدة 30 ثانية. لا تشطفي — التونيك يُمتص ويعمل طوال اليوم.',
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
          subtitle: 'تغذية عميقة ليلاً أثناء تجدد البصيلات',
          steps: [
            {
              step: 1, title: 'تدليك فروة الرأس بالمحلول', duration: '3 دقائق',
              summary: 'علاج نمو مكثف — المحلول يوصل مكونات عالية التركيز بينما التدليك يعزز تدفق الدم للبصيلات.',
              detail: 'ضعي محلول HR3 Matrix على فروة الرأس الجافة أو المجففة بالمنشفة. استخدمي فرشاة فروة الرأس للتدليك بحركات دائرية لمدة 2-3 دقائق. ركزي على مناطق الترقق: الصدغين والتاج وخط الشعر.',
              products: [
                { name: 'HR3 MATRIX SOLUTION', url: '/products/45', price: '740 AED' },
                { name: 'SCALP BRUSH', url: '/products/61', price: '50 AED' },
              ],
            },
            {
              step: 2, title: 'التونيك', duration: 'دقيقة واحدة',
              summary: 'التطبيق اليومي الثاني للتونيك — الليل هو الوقت الذي تكون فيه بصيلات الشعر أكثر نشاطاً في التجدد.',
              detail: 'قسمي الشعر وضعي تونيك HR3 Matrix مباشرة على فروة الرأس. اربتي برفق — لا تفركي. التونيك يتراكم فوق المحلول لتوفير تغذية مستدامة طوال الليل.',
              products: [{ name: 'HR3 MATRIX TONIC', url: '/products/43', price: '290 AED' }],
            },
            {
              step: 3, title: 'النوم طوال الليل', duration: 'طوال الليل',
              summary: 'دعي المكونات النشطة تعمل أثناء نومك — لا حاجة للشطف.',
              detail: 'استخدمي غطاء وسادة من الحرير لتقليل الاحتكاك. المحلول والتونيك يُمتصان بالكامل خلال الليل. بصيلات الشعر تدخل مرحلة الإصلاح الأكثر نشاطاً أثناء النوم.',
              products: [],
            },
          ],
        },
        {
          title: 'العلاج الأسبوعي',
          subtitle: 'تقشير عميق — مرة واحدة أسبوعياً قبل الشامبو',
          steps: [
            {
              step: 1, title: 'تقشير فروة الرأس', duration: '5 دقائق',
              summary: 'إزالة تراكم المنتجات وخلايا الجلد الميتة والدهون الزائدة التي تخنق البصيلات.',
              detail: 'ضعي تقشير HR3 Scalp Peeling على فروة الرأس الجافة قبل غسل الشعر بالشامبو. دلكي برفق لمدة دقيقتين واتركيه 3 دقائق. اشطفي جيداً ثم تابعي بشامبو HR3 Matrix. استخدمي مرة واحدة أسبوعياً. المياه العسرة في الإمارات تترك رواسب معدنية تستهدفها هذه الخطوة تحديداً.',
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
              step: 1, title: 'Шампунь', duration: '2 мин',
              summary: 'Бережное очищение кожи головы без лишения натуральных масел.',
              detail: 'Тщательно намочите волосы. Нанесите небольшое количество шампуня HR3 Matrix на кожу головы (не на длину) и массируйте подушечками пальцев 60 секунд. Бессульфатная формула очищает, не нарушая барьер кожи головы. Смойте тёплой водой — горячая вода усугубляет выпадение.',
              products: [{ name: 'HR3 MATRIX SHAMPOO', url: '/products/44', price: '340 AED' }],
            },
            {
              step: 2, title: 'Тоник', duration: '1 мин',
              summary: 'Основной шаг активации фолликулов — доставляет пептиды и кофеин непосредственно к коже головы.',
              detail: 'Разделите волосы на пробор и нанесите тоник HR3 Matrix непосредственно на кожу головы с помощью насадки. Мягко помассируйте 30 секунд. Не смывайте — тоник впитывается и работает в течение всего дня.',
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
          subtitle: 'Глубокое питание на ночь, пока фолликулы восстанавливаются',
          steps: [
            {
              step: 1, title: 'Массаж головы с раствором', duration: '3 мин',
              summary: 'Интенсивная ростовая терапия — раствор доставляет высококонцентрированные активы, а массаж усиливает кровоток к фолликулам.',
              detail: 'Нанесите раствор HR3 Matrix на сухую или подсушенную полотенцем кожу головы. Используйте щётку для кожи головы для массажа круговыми движениями 2–3 минуты — это увеличивает микроциркуляцию до 300%. Сосредоточьтесь на зонах истончения: виски, макушка и линия роста волос.',
              products: [
                { name: 'HR3 MATRIX SOLUTION', url: '/products/45', price: '740 AED' },
                { name: 'SCALP BRUSH', url: '/products/61', price: '50 AED' },
              ],
            },
            {
              step: 2, title: 'Тоник', duration: '1 мин',
              summary: 'Второе ежедневное нанесение тоника — ночью волосяные фолликулы наиболее активны в регенерации.',
              detail: 'Разделите волосы и нанесите тоник HR3 Matrix непосредственно на кожу головы. Аккуратно похлопайте — не растирайте. Тоник наслаивается поверх раствора, обеспечивая устойчивое питание на ночь.',
              products: [{ name: 'HR3 MATRIX TONIC', url: '/products/43', price: '290 AED' }],
            },
            {
              step: 3, title: 'Сон на ночь', duration: 'на ночь',
              summary: 'Позвольте активным компонентам работать, пока вы спите — смывать не нужно.',
              detail: 'Используйте шёлковую наволочку для минимизации трения. Раствор и тоник полностью впитываются за ночь. Волосяные фолликулы входят в наиболее активную фазу восстановления во время сна — активы HR3 синергируют с этим естественным циклом.',
              products: [],
            },
          ],
        },
        {
          title: 'Еженедельный уход',
          subtitle: 'Глубокое отшелушивание — раз в неделю перед шампунем',
          steps: [
            {
              step: 1, title: 'Пилинг кожи головы', duration: '5 мин',
              summary: 'Удаляет накопления продуктов, омертвевшие клетки и избыток себума, которые «душат» фолликулы.',
              detail: 'Нанесите HR3 Scalp Peeling на сухую кожу головы перед мытьём шампунем. Мягко массируйте 2 минуты и оставьте на 3 минуты. Тщательно смойте, затем используйте шампунь HR3 Matrix. Применяйте раз в неделю — чрезмерное отшелушивание может раздражать кожу головы. Жёсткая вода в ОАЭ оставляет минеральные отложения, на которые нацелен этот шаг.',
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
        { question: 'ما أسباب تساقط الشعر في الإمارات وكيفية علاجه؟', answer: 'تساقط الشعر في الإمارات ناتج عادة عن التعرض الشديد للحرارة ونقص فيتامين د والمياه العسرة والإجهاد والعوامل الهرمونية. نظام GENOSYS HR3 MATRIX (شامبو وتونيك ومحلول) يوصل الببتيدات والبيوتين والكافيين مباشرة إلى البصيلة لإعادة تنشيط مرحلة النمو. النتائج الأولى تظهر خلال 4-6 أسابيع من الاستخدام المنتظم.' },
        { question: 'ما الفرق بين شامبو وتونيك ومحلول HR3 Matrix؟', answer: 'كل منتج يستهدف طبقة مختلفة من نظام فروة الرأس. الشامبو (340 درهم) منظف خالٍ من السلفات يزيل الترسبات. التونيك (290 درهم) علاج بدون شطف يُطبق مباشرة على فروة الرأس مرتين يومياً. المحلول (740 درهم) هو المنتج الأكثر تركيزاً — سيروم ليلي مكثف للمناطق الرقيقة. معاً يشكلون نظاماً كاملاً لتنشيط البصيلات.' },
        { question: 'هل تساقط الشعر يصيب النساء أيضاً؟', answer: 'بالتأكيد. تساقط الشعر الأنثوي يصيب حتى 40% من النساء بحلول سن الخمسين، وهو منتشر بشكل خاص في الإمارات بسبب الحرارة والتسريحات المشدودة والتغيرات الهرمونية والمياه العسرة. نظام HR3 MATRIX مصمم للرجال والنساء. النساء عادة يرون نتائج أسرع لأن تساقط الشعر الأنثوي غالباً ما يكون بسبب بيئة فروة الرأس.' },
        { question: 'هل المياه العسرة في الإمارات تسبب تساقط الشعر؟', answer: 'نعم، المياه العسرة في الإمارات تحتوي على مستويات عالية من الكالسيوم والمغنيسيوم والكلور التي تغلف خصلات الشعر وتسد البصيلات. تقشير فروة الرأس HR3 (يُستخدم أسبوعياً) مصمم خصيصاً لإذابة الرواسب المعدنية وتنظيف فتحات البصيلات بعمق. استخدميه مع شامبو HR3 Matrix الخالي من السلفات لتقليل الضرر المعدني.' },
      ],
      ru: [
        { question: 'Что вызывает выпадение волос в ОАЭ и как его лечить?', answer: 'Выпадение волос в ОАЭ обычно вызвано воздействием экстремальной жары, дефицитом витамина D, жёсткой водой, стрессом и гормональными факторами. Система GENOSYS HR3 MATRIX (шампунь, тоник и раствор) доставляет пептиды, биотин и кофеин непосредственно в фолликул для реактивации фазы роста. Первые результаты заметны через 4–6 недель регулярного использования.' },
        { question: 'В чём разница между шампунем, тоником и раствором HR3 Matrix?', answer: 'Каждый продукт нацелен на разный уровень экосистемы кожи головы. Шампунь HR3 Matrix (340 AED) — бессульфатное очищающее средство. Тоник (290 AED) — несмываемый уход, наносится на кожу головы дважды в день, доставляя пептиды и кофеин. Раствор (740 AED) — самый концентрированный продукт, интенсивная ночная сыворотка для точечного нанесения на зоны истончения. Вместе они формируют полную систему активации фолликулов.' },
        { question: 'Помогает ли лечение выпадения волос женщинам?', answer: 'Безусловно. Женская алопеция затрагивает до 40% женщин к 50 годам и особенно распространена в ОАЭ из-за теплового стресса, тугих причёсок, гормональных изменений и жёсткой воды. Система HR3 MATRIX разработана для мужчин и женщин. Женщины обычно видят результаты быстрее, так как женское выпадение часто вызвано факторами среды кожи головы — именно тем, на что нацелена система HR3.' },
        { question: 'Вызывает ли жёсткая вода в ОАЭ выпадение волос?', answer: 'Да, жёсткая вода в ОАЭ содержит высокий уровень кальция, магния и хлора, которые покрывают волосы, блокируют фолликулы и нарушают микробиом кожи головы. Пилинг HR3 Scalp Peeling (еженедельно) специально разработан для растворения минеральных отложений и глубокой очистки фолликулов. В сочетании с бессульфатным шампунем HR3 Matrix минимизирует дальнейший минеральный ущерб.' },
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
        ar: 'روتين صباحي ومسائي كامل لمكافحة الشيخوخة — نظام EGF + الببتيدات، خطوات إعادة بناء الكولاجين، مجموعات المنتجات حسب الفئة العمرية، ونصائح لمناخ الإمارات.',
        ru: 'Полный утренний и вечерний уход для антивозрастной программы — система EGF + пептиды, восстановление коллагена, наборы по возрастным группам и советы для климата ОАЭ.',
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
        title: 'لماذا تحتاج مكافحة الشيخوخة نهجاً احترافياً في الإمارات',
        items: [
          { icon: '☀️', label: 'شيخوخة متسارعة في الإمارات', detail: 'الأشعة فوق البنفسجية الشديدة (مؤشر 11+) والتكييف المستمر ورياح الصحراء تكسر الكولاجين أسرع بنسبة 40% من المناخات المعتدلة' },
          { icon: '🧬', label: 'تقنية EGF والبيبتيدات', detail: 'GENOSYS يستخدم عامل نمو البشرة ومركبات البيبتيد المتعددة لتحفيز الخلايا الليفية على إنتاج كولاجين وإيلاستين جديد بتركيزات طبية' },
          { icon: '🔬', label: 'إعادة بناء الكولاجين', detail: 'خطوط ND Cell و Multi Functional تعيد بناء البنية الجلدية من الداخل — تقلل الخطوط الدقيقة والتجاعيد العميقة خلال 4-8 أسابيع' },
          { icon: '🏥', label: 'درجة طبية في المنزل', detail: 'نفس التركيبات المستخدمة من أطباء الجلدية في عيادات دبي متاحة لروتينك اليومي المنزلي — بدون وصفة طبية' },
        ],
      },
      ru: {
        title: 'Почему антивозрастной уход требует профессионального подхода в ОАЭ',
        items: [
          { icon: '☀️', label: 'Ускоренное старение в ОАЭ', detail: 'Экстремальный УФ (индекс 11+), постоянное кондиционирование и пустынные ветры разрушают коллаген на 40 % быстрее, чем в умеренном климате' },
          { icon: '🧬', label: 'Технология EGF + пептиды', detail: 'GENOSYS использует эпидермальный фактор роста и мультипептидные комплексы для стимуляции фибробластов к выработке нового коллагена и эластина в клинических концентрациях' },
          { icon: '🔬', label: 'Восстановление коллагена', detail: 'Линейки ND Cell и Multi Functional Anti-Wrinkle восстанавливают дермальный матрикс изнутри — уменьшают мелкие и глубокие морщины за 4–8 недель' },
          { icon: '🏥', label: 'Клиническое качество дома', detail: 'Те же формулы, которые используют дерматологи в клиниках Дубая, доступны для вашего ежедневного домашнего ухода — без рецепта' },
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
        title: 'العناية بالبشرة المضادة للشيخوخة الإمارات | علاج التجاعيد دبي | GENOSYS',
        description: 'عناية احترافية كورية مضادة للشيخوخة في الإمارات. سيرومات وكريمات GENOSYS المضادة للتجاعيد مع البيبتيدات وعوامل النمو. توصيل مجاني فوق 1000 درهم.',
        h1: 'مكافحة الشيخوخة وعلاج التجاعيد',
        heroShort: 'سيرومات وكريمات كورية احترافية مضادة للتجاعيد — تقلل الخطوط الدقيقة وتعيد بناء الكولاجين وتستعيد المرونة مع EGF والبيبتيدات وعوامل النمو.',
        intro: 'الشيخوخة المبكرة تتسارع في الإمارات بسبب الأشعة فوق البنفسجية المكثفة والتكييف والمناخ الصحراوي. خط GENOSYS المضاد للشيخوخة يستخدم مكونات كورية متطورة لتقليل الخطوط الدقيقة والتجاعيد العميقة بشكل ملحوظ.',
        keywords: ['مكافحة الشيخوخة الإمارات', 'علاج التجاعيد دبي', 'كريم مضاد للتجاعيد كوري', 'سيروم بيبتيد دبي'],
      },
      ru: {
        title: 'Антивозрастной уход ОАЭ | Лечение морщин Дубай | GENOSYS',
        description: 'Профессиональный корейский антивозрастной уход в ОАЭ. Сыворотки и кремы GENOSYS с пептидами и факторами роста. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Антивозрастной уход и лечение морщин',
        heroShort: 'Профессиональные корейские сыворотки и кремы от морщин — уменьшают мелкие морщины, восстанавливают коллаген и возвращают упругость с EGF, пептидами и факторами роста.',
        intro: 'Преждевременное старение ускоряется в ОАЭ из-за интенсивного УФ-излучения, кондиционирования воздуха и пустынного климата. Антивозрастная линейка GENOSYS использует прорывные корейские ингредиенты — EGF, пептидные комплексы и альтернативы ретиноидам — для видимого уменьшения морщин и потери упругости.',
        keywords: ['антивозрастной уход ОАЭ', 'лечение морщин Дубай', 'корейский крем от морщин', 'пептидная сыворотка Дубай'],
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
              summary: 'إزالة الزيوت الليلية لتمكين المكونات المضادة للشيخوخة من الاختراق بفعالية.',
              detail: 'ضعي منظف SNOW O₂ على وجه جاف، دعي فقاعات الأكسجين تتشكل طبيعياً. اشطفي بماء فاتر وجففي بلطف.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'التونر والترطيب', duration: '30 ثانية',
              summary: 'استعادة الأس الهيدروجيني وإنشاء قاعدة رطبة لامتصاص أفضل للسيروم.',
              detail: 'ضعي SNOW BOOSTER باليدين مع الضغط بلطف على البشرة. انتقلي للخطوة التالية فوراً.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'سيروم مضاد للتجاعيد', duration: '30 ثانية',
              summary: 'الخطوة الأساسية — البيبتيدات و EGF تحفز إنتاج الكولاجين وتجديد الخلايا.',
              detail: 'ضعي 2-3 قطرات من سيروم Multi Functional Anti-Wrinkle وربتي بلطف على البشرة مع التركيز على مناطق الخطوط الدقيقة.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم مضاد للتجاعيد', duration: '30 ثانية',
              summary: 'حبس المكونات الفعالة وتوفير ثبات دائم مع ترطيب غني بالبيبتيدات.',
              detail: 'ضعي كمية بحجم حبة البازلاء من كريم Multi Functional Anti-Wrinkle فوق السيروم. للنتائج المتميزة، استخدمي كريم ND Cell بدلاً منه.',
              products: [
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE CREAM', url: '/products/32', price: '290 AED' },
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'أهم خطوة لمكافحة الشيخوخة — الأشعة فوق البنفسجية السبب الأول لتكسر الكولاجين.',
              detail: 'ضعي شريطاً بطول إصبعين من واقي الشمس ULTRA SHIELD SPF 50+ على الوجه والرقبة.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'إصلاح وإعادة بناء أثناء تجدد البشرة ليلاً',
          steps: [
            {
              step: 1, title: 'التنظيف المزدوج', duration: '2 دقيقة',
              summary: 'إزالة واقي الشمس والمكياج بالكامل — البقايا تمنع اختراق المكونات الفعالة.',
              detail: 'التنظيف الأول: مزيل المكياج لإذابة واقي الشمس والمكياج. التنظيف الثاني: منظف الأكسجين للتنظيف العميق.',
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
              step: 3, title: 'سيروم مضاد للتجاعيد', duration: '30 ثانية',
              summary: 'الليل هو وقت التجدد — البيبتيدات و EGF تعمل بشكل أقوى أثناء النوم.',
              detail: 'ضعي 2-3 قطرات من سيروم Anti-Wrinkle مع التركيز على مناطق التجاعيد.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم ليلي', duration: '30 ثانية',
              summary: 'إصلاح مكثف ليلي — عوامل النمو تسرّع تجديد الخلايا وتخليق الكولاجين.',
              detail: 'ضعي كريم ND Cell كخطوة أخيرة مساءً لاستهداف التجاعيد العميقة وأقصى توصيل لعوامل النمو أثناء النوم.',
              products: [
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'قناع أسبوعي (1-2 مرة أسبوعياً)', duration: '20 دقيقة',
              summary: 'علاج ليلي عميق يغمر البشرة بالترطيب ومكونات الإصلاح.',
              detail: 'ضعي قناع SKIN RESCUE الليلي كخطوة أخيرة. اتركيه طوال الليل بدون شطف.',
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
              summary: 'Удалите ночные выделения, чтобы антивозрастные активы могли проникнуть эффективно.',
              detail: 'Нанесите SNOW O₂ CLEANSER на сухое лицо, дайте кислородным пузырькам образоваться естественно. Смойте тёплой водой и промокните.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Тонизирование', duration: '30 сек',
              summary: 'Восстановите pH и создайте увлажнённую базу для лучшего впитывания сыворотки.',
              detail: 'Нанесите SNOW BOOSTER руками, мягко вдавливая в кожу. Переходите к следующему шагу сразу.',
              products: [{ name: 'SNOW BOOSTER', url: '/products/16', price: '260 AED' }],
            },
            {
              step: 3, title: 'Сыворотка от морщин', duration: '30 сек',
              summary: 'Основной антивозрастной шаг — пептиды и EGF стимулируют выработку коллагена.',
              detail: 'Нанесите 2–3 капли сыворотки Multi Functional Anti-Wrinkle и мягко вбейте в кожу, уделяя внимание морщинам, «гусиным лапкам» и лбу.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'Крем от морщин', duration: '30 сек',
              summary: 'Запечатайте антивозрастные активы и обеспечьте стойкую упругость.',
              detail: 'Нанесите крем Multi Functional Anti-Wrinkle поверх сыворотки. Для премиального результата используйте ND Cell Anti-Wrinkle Cream — с повышенной концентрацией факторов роста.',
              products: [
                { name: 'MULTI FUNCTIONAL ANTI-WRINKLE CREAM', url: '/products/32', price: '290 AED' },
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'Защита от солнца', duration: '30 сек',
              summary: 'Самый важный антивозрастной шаг — УФ является причиной №1 разрушения коллагена.',
              detail: 'Нанесите полоску длиной в 2 пальца ULTRA SHIELD SPF 50+ на лицо и шею.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Восстановление и обновление пока кожа регенерируется ночью',
          steps: [
            {
              step: 1, title: 'Двойное очищение', duration: '2 мин',
              summary: 'Тщательно удалите SPF и макияж — остатки блокируют проникновение антивозрастных активов.',
              detail: 'Первое очищение: средство для снятия макияжа. Второе очищение: кислородный клинзер для глубокой очистки.',
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
              step: 3, title: 'Сыворотка от морщин', duration: '30 сек',
              summary: 'Ночь — пик регенерации, пептиды и EGF работают интенсивнее во сне.',
              detail: 'Нанесите 2–3 капли сыворотки Anti-Wrinkle, уделяя внимание зонам с морщинами. Ночное применение позволяет факторам роста работать без воздействия УФ.',
              products: [{ name: 'MULTI FUNCTIONAL ANTI-WRINKLE SERUM', url: '/products/22', price: '330 AED' }],
            },
            {
              step: 4, title: 'Ночной крем', duration: '30 сек',
              summary: 'Интенсивное ночное восстановление — факторы роста ускоряют обновление клеток и синтез коллагена.',
              detail: 'Нанесите ND Cell Anti-Wrinkle Cream финальным вечерним шагом для воздействия на глубокие морщины и максимальной доставки факторов роста во время сна.',
              products: [
                { name: 'ND Cell ANTI-WRINKLE CREAM', url: '/products/23', price: '370 AED' },
              ],
            },
            {
              step: 5, title: 'Маска (1–2 раза в неделю)', duration: '20 мин',
              summary: 'Глубокий ночной уход, насыщающий кожу увлажнением и восстанавливающими активами.',
              detail: 'Нанесите маску SKIN RESCUE Overnight как последний шаг. Оставьте на ночь без смывания.',
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
        { question: 'ما هي أفضل المكونات الكورية لمكافحة الشيخوخة؟', answer: 'أكثر المكونات الكورية فعالية لمكافحة الشيخوخة تشمل EGF الذي يحفز تجديد الخلايا، ومركبات البيبتيد التي تعزز إنتاج الكولاجين، والأدينوزين لتقليل التجاعيد. منتجات GENOSYS تحتوي على تركيزات طبية من هذه المكونات — خاصة كريم ND Cell المضاد للتجاعيد (370 درهم) وسيروم Multi Functional المضاد للتجاعيد (330 درهم).' },
        { question: 'متى يجب أن أبدأ باستخدام منتجات مكافحة الشيخوخة؟', answer: 'الوقاية أسهل من العلاج. في الإمارات، ينصح أطباء الجلدية ببدء روتين أساسي (سيروم مضاد للأكسدة + واقي شمس) في منتصف العشرينيات. بعد الثلاثين، إضافة سيروم البيبتيد مثل Multi Functional Anti-Wrinkle Serum (330 درهم) مثالي. بعد 35، الروتين الكامل مع EGF يعطي أفضل النتائج.' },
        { question: 'ما الفرق بين كريم ND Cell وكريم Multi Functional المضاد للتجاعيد؟', answer: 'كلاهما كريمات مضادة للشيخوخة بدرجة احترافية لكن بمستويات مختلفة. كريم Multi Functional (290 درهم) هو الاستخدام اليومي — غني بالبيبتيدات وخفيف ومناسب لجميع أنواع البشرة. كريم ND Cell (370 درهم) هو الخيار المتميز — يحتوي تركيز أعلى من عوامل النمو ويستهدف التجاعيد العميقة، مثالي لعمر 35+ أو كعلاج ليلي مكثف.' },
        { question: 'هل يمكنني الجمع بين مكافحة الشيخوخة وعلاجات التفتيح؟', answer: 'بالتأكيد — و GENOSYS ينصح بذلك. التصبغات والتجاعيد غالباً تحدث معاً في الإمارات. يمكنك استخدام سيروم Anti-Wrinkle صباحاً لدعم الكولاجين وسيروم Multi Vita Radiance مساءً للتفتيح. دائماً اختمي بواقي شمس SPF 50+ صباحاً.' },
      ],
      ru: [
        { question: 'Какие корейские ингредиенты лучше всего для антивозрастного ухода?', answer: 'Наиболее эффективные корейские антивозрастные ингредиенты включают EGF (эпидермальный фактор роста) для стимуляции обновления клеток, пептидные комплексы для выработки коллагена, аденозин для уменьшения морщин и муцин улитки для глубокого увлажнения. Продукты GENOSYS содержат клинические концентрации этих ингредиентов — особенно крем ND Cell Anti-Wrinkle (370 дирхамов) и сыворотка Multi Functional Anti-Wrinkle (330 дирхамов).' },
        { question: 'Когда начинать антивозрастной уход?', answer: 'Профилактика проще коррекции. В ОАЭ дерматологи рекомендуют базовый антивозрастной уход (антиоксидантная сыворотка + SPF) с 25 лет. После 30 идеально добавить пептидную сыворотку Multi Functional Anti-Wrinkle (330 дирхамов). После 35 полный уход с EGF и факторами роста — ND Cell Anti-Wrinkle Cream (370 дирхамов) — даёт наилучшие результаты. Однако никогда не поздно начать: видимое улучшение наступает в любом возрасте при регулярном использовании.' },
        { question: 'В чём разница между EGF и ретинолом?', answer: 'Ретинол ускоряет обновление клеток, но часто вызывает раздражение, шелушение и чувствительность к солнцу — серьёзный недостаток в климате ОАЭ. EGF (эпидермальный фактор роста) достигает аналогичных результатов, сигнализируя фибробластам производить новый коллаген и эластин, без раздражения. GENOSYS выбрала формулы на основе EGF именно потому, что они эффективны при высоком УФ и подходят для чувствительной кожи. ND Cell Anti-Wrinkle Cream (370 дирхамов) — выдающийся продукт для ночного обновления.' },
        { question: 'В чём разница между кремом ND Cell и Multi Functional Anti-Wrinkle?', answer: 'Оба — профессиональные антивозрастные кремы, но разного уровня интенсивности. Multi Functional Anti-Wrinkle Cream (290 дирхамов) — ежедневная основа: богат пептидами, лёгкий, подходит для всех типов кожи с 28+. ND Cell Anti-Wrinkle Cream (370 дирхамов) — премиальный вариант с повышенной концентрацией факторов роста, нацелен на глубокие морщины и потерю упругости, идеален для 35+ или как интенсивный ночной крем. Многие клиенты используют Multi Functional днём, а ND Cell — на ночь.' },
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
        ar: 'روتين ترطيب صباحي ومسائي كامل — طبقات حمض الهيالورونيك، إصلاح حاجز الرطوبة، مجموعات منتجات حسب مستوى الجفاف، ونصائح لمناخ الإمارات.',
        ru: 'Полный утренний и вечерний уход для увлажнения — послойное нанесение гиалуроновой кислоты, восстановление барьера, наборы по степени обезвоженности и советы для климата ОАЭ.',
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
        heroShort: 'سيرومات حمض الهيالورونيك ثلاثي الوزن وكريمات حماية الحاجز — تقنية ترطيب كورية مصممة لدورة جفاف الصحراء والتكييف في الإمارات.',
        intro: 'المناخ الصحراوي في الإمارات مع التكييف المستمر يخلق تحدي جفاف مزدوج يسلب البشرة رطوبتها. خط GENOSYS لتجديد الرطوبة يستخدم تقنية حمض الهيالورونيك متعدد الأوزان لتوصيل الترطيب لكل طبقات البشرة.',
        keywords: ['ترطيب البشرة الإمارات', 'مرطب دبي', 'حمض الهيالورونيك الإمارات', 'البشرة الجافة دبي'],
      },
      ru: {
        title: 'Увлажняющий уход ОАЭ | Гиалуроновая кислота и увлажнение Дубай | GENOSYS',
        description: 'Профессиональный корейский увлажняющий уход для сухого климата ОАЭ. Сыворотки с гиалуроновой кислотой и увлажняющие кремы GENOSYS. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Увлажняющий уход для сухого климата ОАЭ',
        heroShort: 'Сыворотки с тройной гиалуроновой кислотой и кремы с барьерной защитой — корейская технология увлажнения для цикла обезвоживания «пустыня + кондиционер» в ОАЭ.',
        intro: 'Пустынный климат ОАЭ в сочетании с постоянным кондиционированием создаёт двойную проблему обезвоживания. Линейка GENOSYS Moisture Replenishing использует технологию мультивесовой гиалуроновой кислоты для доставки увлажнения на каждый уровень кожи.',
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
        title: 'لماذا تحتاج بشرتك في الإمارات ترطيباً عميقاً',
        items: [
          { icon: '🏜️', label: 'تحدي الصحراء والتكييف المزدوج', detail: 'حرارة الصحراء الخارجية تسحب الرطوبة من السطح بينما التكييف الداخلي يخفض الرطوبة تحت 20٪ — بشرتك تحت هجوم جفاف من الجانبين طوال اليوم' },
          { icon: '💧', label: 'حمض الهيالورونيك ثلاثي الوزن', detail: 'GENOSYS يستخدم حمض هيالورونيك منخفض ومتوسط وعالي الوزن الجزيئي في سيروم واحد — المنخفض يخترق العمق، المتوسط ينفخ الطبقات الوسطى، العالي يشكل غشاء حابس للرطوبة على السطح' },
          { icon: '🛡️', label: 'تقنية قفل الحاجز', detail: 'الترطيب لا يعني شيئاً إذا تبخر. كريم حماية حاجز البشرة يحبس كل قطرة بتعزيز الحاجز الدهني ضد فقدان الماء عبر الجلد بسبب التكييف' },
          { icon: '⏱️', label: 'ترطيب طوال اليوم', detail: 'النظام المتعدد الطبقات — رذاذ، سيروم، كريم — يخلق خزان رطوبة يطلق الترطيب بثبات لأكثر من 12 ساعة حتى في تكييف المكتب عند 18 درجة' },
        ],
      },
      ru: {
        title: 'Почему кожа в ОАЭ нуждается в глубоком увлажнении',
        items: [
          { icon: '🏜️', label: 'Двойной вызов: пустыня + кондиционер', detail: 'Жар пустыни вытягивает влагу с поверхности, а кондиционер в помещении снижает влажность ниже 20% — кожа под атакой обезвоживания с обеих сторон весь день' },
          { icon: '💧', label: 'Тройная гиалуроновая кислота', detail: 'GENOSYS использует низко-, средне- и высокомолекулярную ГК в одной сыворотке — низкая проникает вглубь, средняя наполняет средние слои, высокая формирует влагоудерживающую плёнку на поверхности' },
          { icon: '🛡️', label: 'Технология барьерной защиты', detail: 'Увлажнение бессмысленно, если оно испаряется. Крем Skin Barrier Protecting Cream запечатывает каждую каплю, укрепляя липидный барьер против трансэпидермальной потери воды из-за кондиционера' },
          { icon: '⏱️', label: 'Увлажнение на весь день', detail: 'Многослойная система — мист, сыворотка, крем — создаёт резервуар влаги, который стабильно отдаёт увлажнение более 12 часов даже в офисном кондиционере при 18°C' },
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
          subtitle: 'طبقات ترطيب وإغلاقها قبل تشغيل التكييف — 5 دقائق',
          steps: [
            {
              step: 1, title: 'تنظيف لطيف', duration: 'دقيقة واحدة',
              summary: 'إزالة بقايا الليل دون تجريد الرطوبة. البشرة النظيفة تمتص الترطيب بشكل أفضل.',
              detail: 'ضعي SNOW O₂ CLEANSER على الوجه الرطب. تركيبة فقاعات الأكسجين ترفع الشوائب بلطف دون منظفات قاسية تذيب الزيوت الطبيعية. اشطفي بماء فاتر وجففي بالتربيت — لا تفركي أبداً.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'رذاذ مرطب', duration: '15 ثانية',
              summary: 'البشرة الرطبة تمتص المكونات النشطة بضعف الفعالية. هذا يهيئ كل طبقة للسيروم.',
              detail: 'أمسكي MICROBIOME ENERGY INFUSING MIST على بُعد 15 سم من الوجه ورشي 3-4 مرات بحركة دائرية. التركيبة الموازنة للميكروبيوم تخلق وسادة رطوبة وبيئة حمضية خفيفة تساعد حمض الهيالورونيك على ربط المزيد من الماء.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'سيروم حمض الهيالورونيك', duration: '30 ثانية',
              summary: 'محرك الترطيب — حمض هيالورونيك ثلاثي الوزن يسحب ويحتفظ بالماء في كل مستوى من البشرة.',
              detail: 'بينما الرذاذ لا يزال رطباً على الوجه، اضغطي 3-4 قطرات من MOISTURE REPLENISHING HYALURON SERUM بين راحتيك واضغطي على الخدين والجبهة والذقن. التطبيق على البشرة الرطبة ضروري — حمض الهيالورونيك يسحب الرطوبة مما حوله.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم مرطب', duration: '30 ثانية',
              summary: 'إغلاق طبقات السيروم وتوفير ترطيب مستدام من الكريم طوال اليوم.',
              detail: 'ضعي MOISTURE REPLENISHING HYALURON CREAM للترطيب اليومي الخفيف. للبشرة الجافة جداً أو الحساسة، استبدلي بـ INTENSIVE HYDRO SOOTHING CREAM بقوام أغنى ومهدئات إضافية.',
              products: [
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'الأشعة فوق البنفسجية تسرّع فقدان الرطوبة وتكسر حمض الهيالورونيك في البشرة. SPF هو الختم النهائي.',
              detail: 'ضعي ULTRA SHIELD SUN CREAM SPF 50+ بكمية كافية — بطول إصبعين للوجه والرقبة. يجلس فوق طبقات الترطيب كحاجز مادي ضد الجذور الحرة بسبب الأشعة فوق البنفسجية.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'إصلاح عميق واستعادة الرطوبة الليلية',
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
              summary: 'التطبيق الليلي يتيح للحمض الهيالورونيك العمل دون انقطاع لمدة 8 ساعات مع ذروة دورة إصلاح البشرة.',
              detail: 'ضعي 4-5 قطرات من MOISTURE REPLENISHING HYALURON SERUM على البشرة الرطبة. استخدمي كمية أكثر قليلاً من الصباح لأن السيروم لديه الليل بأكمله للعمل. اضغطي على الخدين والجبهة والذقن ولا تنسي الرقبة.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 3, title: 'كريم الحاجز', duration: '30 ثانية',
              summary: 'القفل الليلي — كريم حاجز غني يمنع الرطوبة من التسرب في هواء غرفة النوم الجاف.',
              detail: 'ضعي SKIN BARRIER PROTECTING CREAM بطبقة سخية. هذا أغنى كريم في الروتين وهذا مقصود — ليلاً لا يوجد SPF أو مكياج فوقه، فكريم الحاجز هو الشيء الوحيد بين بشرتك المرطبة والهواء المكيف الجاف في غرفة النوم.',
              products: [{ name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' }],
            },
            {
              step: 4, title: 'قناع ليلي أسبوعي (2-3 مرات أسبوعياً)', duration: 'دقيقة واحدة',
              summary: 'دفعة مركزة من الرطوبة تعمل أثناء النوم — لحالات عدم كفاية الترطيب اليومي.',
              detail: 'في 2-3 ليالٍ أسبوعياً، استبدلي أو أضيفي فوق كريم الحاجز SKIN RESCUE OVERNIGHT CREAM MASK. ضعي طبقة سميكة متساوية واتركيها طوال الليل — لا حاجة للشطف. يُنصح به بشكل خاص خلال أشهر الصيف (يونيو-سبتمبر) وخلال الشتاء عندما تنخفض الرطوبة أكثر.',
              products: [{ name: 'SKIN RESCUE OVERNIGHT CREAM MASK', url: '/products/34', price: '340 AED' }],
            },
          ],
        },
      ],
      ru: [
        {
          title: 'Утренний уход',
          subtitle: 'Слои увлажнения и запечатывание перед кондиционером — 5 минут',
          steps: [
            {
              step: 1, title: 'Бережное очищение', duration: '1 мин',
              summary: 'Удалите ночные остатки, не лишая кожу влаги. Чистая кожа впитывает увлажнение лучше.',
              detail: 'Нанесите SNOW O₂ CLEANSER на влажное лицо. Кислородные пузырьки мягко поднимают загрязнения без агрессивных ПАВ, которые растворяют естественные масла кожи. Ополосните тёплой водой и промокните — никогда не растирайте, это увеличивает трансэпидермальную потерю воды.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Увлажняющий мист', duration: '15 сек',
              summary: 'Влажная кожа впитывает активы в 2 раза лучше. Мист подготавливает каждый слой к сыворотке.',
              detail: 'Держите MICROBIOME ENERGY INFUSING MIST на расстоянии 15 см от лица и распылите 3–4 раза круговым движением. Формула для баланса микробиома создаёт влажную подушку и слабокислую среду, которая помогает гиалуроновой кислоте связывать больше воды. Не промакивайте — дайте мисту остаться на коже.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'Сыворотка с гиалуроновой кислотой', duration: '30 сек',
              summary: 'Двигатель увлажнения — тройная ГК притягивает и удерживает воду на каждом уровне кожи.',
              detail: 'Пока мист ещё влажный на лице, выдавите 3–4 капли MOISTURE REPLENISHING HYALURON SERUM между ладоней и прижмите к щекам, лбу и подбородку. Нанесение на влажную кожу критически важно — ГК притягивает влагу из ближайшего источника, поэтому если кожа сухая, она может вытянуть воду наружу, а не внутрь.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 4, title: 'Увлажняющий крем', duration: '30 сек',
              summary: 'Запечатайте слои сыворотки и обеспечьте устойчивое кремовое увлажнение на весь день.',
              detail: 'Нанесите MOISTURE REPLENISHING HYALURON CREAM для лёгкого ежедневного увлажнения — он продлевает эффект сыворотки за счёт обогащённой церамидами базы. Для очень сухой или чувствительной кожи замените на INTENSIVE HYDRO SOOTHING CREAM с более плотной текстурой и успокаивающими компонентами. В любом случае наносите восходящими движениями, включая шею.',
              products: [
                { name: 'MOISTURE REPLENISHING HYALURON CREAM', url: '/products/29', price: '290 AED' },
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
              ],
            },
            {
              step: 5, title: 'Защита от солнца', duration: '30 сек',
              summary: 'УФ-лучи ускоряют потерю влаги и разрушают гиалуроновую кислоту в коже. SPF — финальная печать.',
              detail: 'Нанесите ULTRA SHIELD SUN CREAM SPF 50+ щедро — два пальца длиной для лица и шеи. Он ложится поверх увлажняющих слоёв как физический барьер против свободных радикалов от УФ, разрушающих ГК и коллаген. Лёгкая формула не утяжеляет поверх слоёв увлажнения.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Глубокое восстановление и ночное восполнение влаги',
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
              summary: 'Ночное нанесение позволяет ГК работать непрерывно 8 часов на пике цикла восстановления кожи.',
              detail: 'Нанесите 4–5 капель MOISTURE REPLENISHING HYALURON SERUM на влажную кожу (сбрызните водой или мистом). Используйте немного больше, чем утром, потому что сыворотка работает всю ночь без конкуренции SPF или макияжа. Прижмите к щекам, лбу, подбородку и не забудьте шею.',
              products: [{ name: 'MOISTURE REPLENISHING HYALURON SERUM', url: '/products/18', price: '330 AED' }],
            },
            {
              step: 3, title: 'Барьерный крем', duration: '30 сек',
              summary: 'Ночной замок — плотный барьерный крем не даёт влаге испаряться в сухой воздух спальни.',
              detail: 'Нанесите SKIN BARRIER PROTECTING CREAM щедрым слоем. Это самый плотный крем в рутине, и это намеренно — ночью нет SPF или макияжа сверху, поэтому барьерный крем — единственное, что стоит между вашей увлажнённой кожей и сухим кондиционированным воздухом спальни. Его липидовосполняющий комплекс восстанавливает кожный барьер во время сна.',
              products: [{ name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' }],
            },
            {
              step: 4, title: 'Ночная маска (2–3 раза в неделю)', duration: '1 мин',
              summary: 'Концентрированный заряд влаги, работающий всю ночь — когда ежедневного увлажнения недостаточно.',
              detail: 'На 2–3 ночи в неделю замените или нанесите поверх барьерного крема SKIN RESCUE OVERNIGHT CREAM MASK. Нанесите толстый ровный слой и оставьте на ночь — смывать не нужно. Маска создаёт окклюзивную плёнку, которая усиливает ночное увлажнение. Особенно рекомендуется в пик лета (июнь–сентябрь), когда кондиционер работает на максимуме, и зимой, когда влажность падает ещё больше.',
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
        { question: 'لماذا تجف البشرة في الإمارات رغم الرطوبة؟', answer: 'رغم رطوبة الهواء الخارجي، الجفاف الحقيقي يأتي من قضاء أكثر من 80٪ من الوقت في بيئات مكيفة بنسبة رطوبة أقل من 20٪. سيروم GENOSYS بحمض الهيالورونيك ثلاثي الوزن يرطب جميع طبقات البشرة ويقاوم جفاف التكييف.' },
        { question: 'كيف يعمل حمض الهيالورونيك لترطيب البشرة؟', answer: 'حمض الهيالورونيك مادة مرطبة يمكنها الاحتفاظ بـ 1000 ضعف وزنها من الماء. GENOSYS يستخدم حمض هيالورونيك ثلاثي الوزن: الوزن المنخفض يخترق عمق الأدمة للترطيب الداخلي الطويل، المتوسط ينفخ الطبقات الوسطى من البشرة، والعالي يجلس على السطح ليشكل غشاء حابس للرطوبة. هذا النهج متعدد الطبقات يضمن وصول الترطيب لكل مستوى.' },
        { question: 'هل البشرة الدهنية تحتاج ترطيب أيضاً؟', answer: 'بالتأكيد — الدهنية والجفاف ليسا نقيضين. في الإمارات كثير من الناس لديهم بشرة دهنية لكنها جافة لأن التكييف يسحب الماء من جميع أنواع البشرة. عندما تجف البشرة تفرط في إنتاج الدهون للتعويض. الحل هو ترطيب مائي وليس تخطي المرطب. استخدمي سيروم الهيالورونيك (مائي وخالٍ من الزيوت) تحت كريم خفيف مثل MOISTURE REPLENISHING HYALURON CREAM.' },
        { question: 'ما أفضل نصائح الترطيب الليلي للبشرة الجافة في الإمارات؟', answer: 'الليل هو وقت ذروة إصلاح البشرة مما يجعله أفضل نافذة للترطيب العميق. بعد التنظيف المزدوج، ضعي سيروم الهيالورونيك على البشرة الرطبة ثم أغلقي بكريم حماية حاجز البشرة — أغنى تركيبة في الخط تمنع فقدان الرطوبة الليلي. أضيفي SKIN RESCUE OVERNIGHT CREAM MASK 2-3 ليالٍ أسبوعياً لدفعة إضافية. حافظي على رطوبة غرفة النوم فوق 40٪ بمرطب هواء إن أمكن.' },
      ],
      ru: [
        { question: 'Почему кожа так сохнет в ОАЭ несмотря на влажность?', answer: 'Хотя прибрежные города ОАЭ имеют высокую влажность на улице, реальное обезвоживание происходит от проведения 80%+ времени в кондиционированных помещениях с влажностью ниже 20%. Сыворотка GENOSYS с тройной гиалуроновой кислотой увлажняет все слои кожи и противостоит сухости кондиционеров.' },
        { question: 'Как гиалуроновая кислота увлажняет кожу?', answer: 'Гиалуроновая кислота (ГК) — это гумектант, способный удерживать до 1000 раз больше своего веса в воде. GENOSYS использует тройную ГК: низкомолекулярная проникает глубоко в дерму для длительного внутреннего увлажнения, среднемолекулярная наполняет средние слои эпидермиса, высокомолекулярная остаётся на поверхности и образует влагоудерживающую плёнку. Многослойный подход обеспечивает увлажнение на каждом уровне.' },
        { question: 'Нужно ли увлажнение жирной коже?', answer: 'Безусловно — жирность и обезвоженность не противоположности. В ОАЭ у многих людей жирная, но обезвоженная кожа, потому что кондиционер вытягивает воду из любого типа кожи. При обезвоживании кожа часто перепроизводит себум для компенсации. Решение — водное увлажнение, а не отказ от крема. Используйте сыворотку с гиалуроновой кислотой (водная, безмасляная) под лёгкий крем MOISTURE REPLENISHING HYALURON CREAM. Жирность снизится, когда кожа будет правильно увлажнена.' },
        { question: 'Лучшие советы по ночному увлажнению для сухой кожи в ОАЭ?', answer: 'Ночью восстановление кожи на пике, что делает это лучшим окном для глубокого увлажнения. После двойного очищения нанесите сыворотку с ГК на влажную кожу, затем запечатайте кремом Skin Barrier Protecting Cream — самой плотной формулой линейки, предотвращающей ночную потерю влаги. Добавьте SKIN RESCUE OVERNIGHT CREAM MASK 2–3 ночи в неделю. Поддерживайте влажность в спальне выше 40% с помощью увлажнителя воздуха, если возможно, и избегайте кондиционера, направленного прямо на лицо.' },
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
        ar: 'روتين صباحي ومسائي كامل للبشرة الحساسة — إصلاح الحاجز، مكونات مهدئة، مجموعات منتجات حسب مستوى الحساسية، ونصائح للحماية في مناخ الإمارات.',
        ru: 'Полный утренний и вечерний уход для чувствительной кожи — восстановление барьера, успокаивающие компоненты, наборы по степени чувствительности и защита в климате ОАЭ.',
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
          { icon: '🌡️', label: 'الصدمة الحرارية', detail: 'الانتقال من 40 درجة مئوية في الخارج إلى 18 درجة مئوية في التكييف عشرات المرات يومياً يجبر الشعيرات الدموية على الانقباض والتمدد — مما يضعف حاجز البشرة تدريجياً' },
          { icon: '🧬', label: 'تقنية إصلاح الحاجز', detail: 'مركب سنتيلا آسياتيكا + سيراميد يعيد بناء المصفوفة الدهنية التي تدمرها التقلبات الحرارية، مانعاً فقدان الرطوبة ودخول المهيجات' },
          { icon: '🦠', label: 'توازن الميكروبيوم', detail: 'المياه العسرة والمنظفات القوية تزيل البكتيريا المفيدة. رذاذنا بالبروبيوتكس وتركيباتنا اللطيفة تستعيد طبقة الميكروبيوم الواقية' },
          { icon: '🧴', label: 'تركيبة خالية من المهيجات', detail: 'بدون عطور، بدون كحول، بدون زيوت عطرية — كل منتج في خط البشرة الحساسة مختبر طبياً للبشرة المتفاعلة' },
        ],
      },
      ru: {
        title: 'Почему чувствительная кожа так распространена в ОАЭ',
        items: [
          { icon: '🌡️', label: 'Температурный шок', detail: 'Переход из 40°C на улице в 18°C кондиционера десятки раз в день заставляет капилляры сжиматься и расширяться — разрушая кожный барьер за считанные недели' },
          { icon: '🧬', label: 'Технология восстановления барьера', detail: 'Комплекс центеллы азиатской + церамиды восстанавливает липидную матрицу, удерживая влагу и не пропуская раздражители' },
          { icon: '🦠', label: 'Баланс микробиома', detail: 'Жёсткая вода и агрессивные очищающие средства уничтожают полезные бактерии. Наш мист с пробиотиками и мягкие формулы восстанавливают защитный микробиом' },
          { icon: '🧴', label: 'Формула без раздражителей', detail: 'Без отдушек, без спирта, без эфирных масел — каждый продукт линейки для чувствительной кожи дерматологически протестирован' },
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
          subtitle: 'تهدئة وحماية وتقوية — 5 خطوات لطيفة',
          steps: [
            {
              step: 1, title: 'التنظيف اللطيف', duration: 'دقيقة واحدة',
              summary: 'إزالة الزيوت الليلية دون تجريد حاجز البشرة.',
              detail: 'ضعي على الوجه الجاف ودعي فقاعات الأكسجين ترفع الشوائب بلطف — بدون فرك. اشطفي بماء فاتر (ليس ساخناً أبداً) وجففي بالتربيت. تنظيف واحد في الصباح كافٍ للبشرة الحساسة.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'رذاذ الميكروبيوم', duration: '15 ثانية',
              summary: 'استعادة البكتيريا المفيدة وتحضير البشرة لامتصاص المكونات النشطة.',
              detail: 'رشي 2-3 مرات من مسافة 20 سم. تركيبة البريبايوتكس والبروبيوتكس تعيد توازن الميكروبيوم. اضغطي برفق بالراحتين — لا تفركي.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'سيروم الحساسية', duration: '30 ثانية',
              summary: 'علاج مهدئ أساسي — سنتيلا + بانثينول يهدئان الالتهاب ويبدآن إصلاح الحاجز.',
              detail: 'ضعي 2-3 قطرات واضغطي برفق بالراحتين. انتظري 30 ثانية للامتصاص الكامل. هذا هو حجر الزاوية في روتين البشرة الحساسة.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 4, title: 'كريم النهار', duration: '30 ثانية',
              summary: 'حبس المكونات النشطة وتوفير ترطيب طوال اليوم.',
              detail: 'اختاري حسب التفضيل: كريم الترطيب المكثف المهدئ لملمس أخف نهاراً، أو كريم حماية الحاجز لأقصى دفاع إذا كانت بشرتك شديدة التفاعل. ضعي بحركات تربيت لطيفة.',
              products: [
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
              ],
            },
            {
              step: 5, title: 'الحماية من الشمس', duration: '30 ثانية',
              summary: 'الأشعة فوق البنفسجية من أهم محفزات البشرة الحساسة — لا تتخطي واقي الشمس أبداً.',
              detail: 'ضعي شريطاً بطول إصبعين على الوجه والرقبة. هذه التركيبة خالية من العطور ومصممة للبشرة المتفاعلة. مؤشر UV في الإمارات يبقى فوق 8 حتى في الشتاء.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'الروتين المسائي',
          subtitle: 'إصلاح وإعادة بناء أثناء الليل — 4 خطوات مهدئة',
          steps: [
            {
              step: 1, title: 'التنظيف اللطيف', duration: 'دقيقة واحدة',
              summary: 'تنظيف واحد فقط لإزالة واقي الشمس والشوائب — بدون تنظيف مزدوج لتقليل الاحتكاك.',
              detail: 'ضعي منظف الأكسجين على الوجه الجاف واتركيه يعمل 30 ثانية. الفقاعات الدقيقة تذيب واقي الشمس والتلوث بدون خطوة تنظيف ثانية. اشطفي بماء فاتر.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'سيروم الحساسية', duration: '30 ثانية',
              summary: 'جرعة ثانية من المكونات المهدئة — الليل هو وقت إصلاح حاجز البشرة الأكثر نشاطاً.',
              detail: 'ضعي 2-3 قطرات واضغطي على البشرة. السنتيلا والبانثينول يعملان بالتآزر مع دورة الإصلاح الليلية لتسريع إعادة بناء الحاجز.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 3, title: 'كريم الإصلاح المهدئ', duration: '30 ثانية',
              summary: 'كريم إصلاح مكثف يهدئ التهيج المتراكم خلال اليوم.',
              detail: 'ضعي طبقة سخية فوق السيروم. كريم الإصلاح المهدئ يوفر جرعة مركزة من مكونات إعادة بناء الحاجز. يعمل طوال الليل لتقليل احمرار وشد الصباح.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 4, title: 'كريم الحاجز', duration: '30 ثانية',
              summary: 'حبس كل شيء بطبقة حماية غنية للتعافي الليلي.',
              detail: 'استخدمي كريم حماية الحاجز للليالي التي تكون فيها البشرة شديدة التفاعل. للليالي الأخف، استبدلي بكريم الترطيب المكثف المهدئ. هذه الطبقة الأخيرة تمنع فقدان الماء عبر البشرة أثناء النوم.',
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
          subtitle: 'Успокоить, защитить и укрепить — 5 бережных шагов',
          steps: [
            {
              step: 1, title: 'Бережное очищение', duration: '1 мин',
              summary: 'Удалите ночные масла, не нарушая барьер.',
              detail: 'Нанесите на сухое лицо и позвольте кислородным пузырькам мягко поднять загрязнения — без трения. Смойте тёплой водой (никогда горячей) и промокните. Одного очищения утром достаточно для чувствительной кожи.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Мист с пробиотиками', duration: '15 сек',
              summary: 'Восстановите полезные бактерии и подготовьте кожу к впитыванию активов.',
              detail: 'Распылите 2–3 нажатия с расстояния 20 см. Формула с пре/пробиотиками восстанавливает микробиом, нарушенный жёсткой водой и кондиционером. Мягко прижмите ладонями — не растирайте.',
              products: [{ name: 'MICROBIOME ENERGY INFUSING MIST', url: '/products/14', price: '160 AED' }],
            },
            {
              step: 3, title: 'Сыворотка для чувствительной кожи', duration: '30 сек',
              summary: 'Основной успокаивающий уход — центелла + пантенол снимают воспаление и запускают восстановление барьера.',
              detail: 'Нанесите 2–3 капли и прижмите ладонями. Подождите 30 секунд для полного впитывания. Это ключевой продукт — он уменьшает покраснения и реактивность с каждым применением.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 4, title: 'Дневной крем', duration: '30 сек',
              summary: 'Запечатайте активы и обеспечьте увлажнение на весь день.',
              detail: 'Выбирайте по предпочтению: Интенсивный увлажняющий крем для более лёгкой дневной текстуры, или Крем для защиты барьера для максимальной защиты, если кожа очень реактивна. Наносите похлопывающими движениями.',
              products: [
                { name: 'INTENSIVE HYDRO SOOTHING CREAM', url: '/products/28', price: '290 AED' },
                { name: 'SKIN BARRIER PROTECTING CREAM', url: '/products/27', price: '450 AED' },
              ],
            },
            {
              step: 5, title: 'Солнцезащита', duration: '30 сек',
              summary: 'УФ — один из главных триггеров чувствительной кожи. Никогда не пропускайте SPF, даже в помещении у окна.',
              detail: 'Нанесите полоску длиной в два пальца на лицо и шею. Формула без отдушек, разработана для реактивной кожи. В ОАЭ УФ-индекс остаётся выше 8 даже зимой — незащищённое воздействие вызывает хроническое микровоспаление.',
              products: [{ name: 'ULTRA SHIELD SUN CREAM SPF 50+', url: '/products/39', price: '250 AED' }],
            },
          ],
        },
        {
          title: 'Вечерний уход',
          subtitle: 'Восстановление и укрепление за ночь — 4 успокаивающих шага',
          steps: [
            {
              step: 1, title: 'Бережное очищение', duration: '1 мин',
              summary: 'Одно очищение для удаления SPF и загрязнений — без двойного очищения, чтобы минимизировать контакт с реактивной кожей.',
              detail: 'Нанесите кислородный очиститель на сухое лицо и дайте поработать 30 секунд. Микропузырьки растворяют санскрин и загрязнения без второго этапа очищения. Смойте тёплой водой.',
              products: [{ name: 'SNOW O₂ CLEANSER', url: '/products/10', price: '330 AED' }],
            },
            {
              step: 2, title: 'Сыворотка для чувствительной кожи', duration: '30 сек',
              summary: 'Вторая доза успокаивающих активов — ночью кожный барьер восстанавливается активнее всего.',
              detail: 'Нанесите 2–3 капли и вдавите в кожу. Центелла и пантенол работают в синергии с ночным циклом восстановления кожи, ускоряя укрепление барьера.',
              products: [{ name: 'ALL FOR SENSITIVE SERUM', url: '/products/19', price: '330 AED' }],
            },
            {
              step: 3, title: 'Успокаивающий посткрем', duration: '30 сек',
              summary: 'Интенсивный восстанавливающий крем, снимающий раздражение, накопленное за день.',
              detail: 'Нанесите щедрый слой поверх сыворотки. Посткрем содержит концентрированную дозу восстанавливающих ингредиентов. Работает всю ночь, уменьшая утреннее покраснение и стянутость.',
              products: [{ name: 'SOOTHING REPAIR POSTCREAM', url: '/products/25', price: '204 AED' }],
            },
            {
              step: 4, title: 'Барьерный крем', duration: '30 сек',
              summary: 'Запечатайте всё богатым защитным слоем для ночного восстановления.',
              detail: 'Используйте Крем для защиты барьера в ночи, когда кожа особенно реактивна или стянута. Для более лёгких ночей замените на Интенсивный увлажняющий крем. Финальный слой создаёт окклюзивную защиту, предотвращая трансэпидермальную потерю воды.',
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
        title: 'العناية بالبشرة الحساسة الإمارات | منتجات مهدئة للبشرة دبي | GENOSYS',
        description: 'عناية كورية احترافية بالبشرة الحساسة في الإمارات. سيرومات مهدئة وكريمات حماية الحاجز من GENOSYS. مختبرة طبياً. توصيل مجاني فوق 1000 درهم.',
        h1: 'العناية بالبشرة الحساسة والعلاج المهدئ',
        heroShort: 'سيرومات مهدئة وكريمات حماية حاجز البشرة كورية احترافية — مصممة للصدمة الحرارية في الإمارات والمياه العسرة والتعرض للأشعة فوق البنفسجية طوال العام.',
        intro: 'البشرة الحساسة والمتفاعلة أصبحت شائعة بشكل متزايد في الإمارات بسبب التحولات الحرارية الشديدة والتلوث والمياه العسرة. تقدم GENOSYS مجموعة مخصصة من المنتجات المهدئة وإصلاح حاجز البشرة.',
        keywords: ['العناية بالبشرة الحساسة الإمارات', 'منتجات مهدئة دبي', 'علاج البشرة المتفاعلة', 'كريم مهدئ كوري'],
      },
      ru: {
        title: 'Уход за чувствительной кожей ОАЭ | Успокаивающие средства Дубай | GENOSYS',
        description: 'Профессиональный корейский уход за чувствительной кожей в ОАЭ. Успокаивающие сыворотки и барьерные кремы GENOSYS. Дерматологически протестированы. Бесплатная доставка от 1000 дирхамов.',
        h1: 'Уход за чувствительной кожей',
        heroShort: 'Профессиональные корейские успокаивающие сыворотки, барьерные кремы и бережный уход — для температурного шока ОАЭ, жёсткой воды и круглогодичного УФ-излучения.',
        intro: 'Чувствительная и реактивная кожа всё чаще встречается в ОАЭ из-за резких перепадов температуры, загрязнения, жёсткой воды и агрессивного УФ-излучения. GENOSYS предлагает специальную линейку успокаивающих средств и средств для восстановления кожного барьера.',
        keywords: ['чувствительная кожа ОАЭ', 'успокаивающий уход Дубай', 'реактивная кожа ОАЭ', 'корейский крем для чувствительной кожи'],
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
        { question: 'لماذا البشرة الحساسة شائعة جداً في الإمارات؟', answer: 'البشرة الحساسة منتشرة في الإمارات بسبب التحول المستمر بين الحرارة الشديدة في الخارج (40-50 درجة مئوية صيفاً) والتكييف البارد في الداخل (18-22 درجة مئوية). هذه الصدمة الحرارية تضعف حاجز البشرة مع الوقت. بالإضافة إلى ذلك، المياه العسرة في دبي وأبوظبي تزيل الزيوت الطبيعية، ومؤشر UV المرتفع يسبب التهاباً مزمناً منخفض الحدة. منتجات GENOSYS للبشرة الحساسة مصممة خصيصاً لمعالجة هذه المحفزات الخاصة بالإمارات.' },
        { question: 'هل يمكنني تقشير بشرتي الحساسة؟', answer: 'نعم، لكن بحذر. تجنبي المقشرات الفيزيائية والتقشيرات الكيميائية القوية — فهي تضر حاجز البشرة المتضرر أصلاً. بدلاً من ذلك، استخدمي مقشراً إنزيمياً لطيفاً مرة واحدة في الأسبوع فقط عندما تكون بشرتك في مرحلة هدوء. في أيام التقشير، تخطي المنتجات النشطة الأخرى وركزي على إصلاح الحاجز بكريم الإصلاح المهدئ وكريم حماية الحاجز.' },
        { question: 'كيف أبني تحمل بشرتي الحساسة وأقويها؟', answer: 'بناء التحمل يتطلب إصلاح حاجز مستمر وليس علاجاً عدوانياً. ابدئي بروتين بسيط: منظف لطيف + سيروم الحساسية + كريم الحاجز لمدة 2-4 أسابيع. بمجرد تراجع نوبات الاحمرار، أدخلي منتجاً جديداً واحداً في كل مرة بفارق 7 أيام. نظام GENOSYS لإصلاح الحاجز مصمم لهذا بالتحديد: كل أسبوع، مركب السيراميد والسنتيلا يعيد بناء طبقة أخرى من قوة الحاجز.' },
        { question: 'هل المياه العسرة في دبي تزيد حساسية البشرة؟', answer: 'نعم، المياه العسرة محفز مهم وغالباً يُتجاهل. مياه الصنبور في دبي تحتوي على نسبة عالية من المعادن (الكالسيوم والمغنيسيوم) التي تعطل الغلاف الحمضي للبشرة وترفع درجة الحموضة وتزيل طبقة الدهون الواقية. لمكافحة ذلك: استخدمي منظف SNOW O₂ (يعمل بأقل اتصال بالماء)، ثم فوراً رذاذ الميكروبيوم لاستعادة التوازن، وضعي دائماً كريم الحاجز لحبس الرطوبة.' },
      ],
      ru: [
        { question: 'Почему чувствительная кожа так распространена в ОАЭ?', answer: 'Чувствительная кожа чрезвычайно распространена в ОАЭ из-за постоянного цикла: экстремальная жара на улице (40-50°C летом) и холодный кондиционер в помещении (18-22°C). Этот температурный шок со временем разрушает кожный барьер. Кроме того, жёсткая вода в Дубае и Абу-Даби смывает натуральные масла, а высокий УФ-индекс вызывает хроническое слабое воспаление. Продукты GENOSYS для чувствительной кожи специально разработаны для этих факторов ОАЭ.' },
        { question: 'Можно ли делать пилинг при чувствительной коже?', answer: 'Да, но с осторожностью. Избегайте физических скрабов и агрессивных химических пилингов — они повреждают и без того ослабленный барьер. Вместо этого используйте очень мягкий энзимный эксфолиант не чаще раза в неделю, и только когда кожа в спокойной фазе (без активного покраснения или жжения). В дни пилинга откажитесь от других активов и сосредоточьтесь на восстановлении барьера с помощью Посткрема и Крема для защиты барьера.' },
        { question: 'Как укрепить чувствительную кожу и повысить её устойчивость?', answer: 'Повышение устойчивости требует последовательного восстановления барьера, а не агрессивного лечения. Начните с минимального ухода: мягкий очиститель + сыворотка для чувствительной кожи + барьерный крем на 2–4 недели. Когда эпизоды покраснения станут реже, постепенно вводите по одному новому продукту с интервалом в 7 дней. Система GENOSYS — Сыворотка для чувствительной кожи плюс Крем для защиты барьера — разработана именно для этого: каждую неделю комплекс церамидов и центеллы восстанавливает очередной слой барьерной защиты. Большинство клиентов замечают снижение реактивности через 6–8 недель.' },
        { question: 'Жёсткая вода в Дубае усугубляет чувствительную кожу?', answer: 'Да, жёсткая вода — значительный и часто недооценённый триггер. Водопроводная вода в Дубае содержит много минералов (кальций и магний), которые нарушают кислотную мантию кожи, повышают pH и разрушают защитный липидный слой. Для противодействия: используйте мягкий очиститель SNOW O₂ (он работает при минимальном контакте с водой), затем сразу нанесите мист с пробиотиками для восстановления pH и микробиома, и всегда наносите барьерный крем для удержания влаги после очищения.' },
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
      ar: { title: 'كوشن BB الإمارات | كريم BB كوري دبي | GENOSYS', description: 'كوشن BB وبلسم العيوب من GENOSYS لتغطية مثالية مع فوائد العناية بالبشرة.', h1: 'كوشن BB وبلسم العيوب' },
      ru: { title: 'BB Кушон ОАЭ | Корейский ББ крем Дубай | GENOSYS', description: 'BB Кушон и бальзам GENOSYS для безупречного покрытия с уходовыми свойствами.', h1: 'BB Кушон и бальзам' },
    },
  },
  {
    slug: 'scalp-hair',
    categoryKey: 'Scalp/Hair',
    seo: {
      en: { title: 'Scalp & Hair Care UAE | Hair Treatment Dubai | GENOSYS', description: 'GENOSYS professional scalp and hair care products for UAE. Combat hair loss and improve scalp health. Free shipping over 1000 AED.', h1: 'Scalp & Hair Care' },
      ar: { title: 'العناية بفروة الرأس والشعر الإمارات | علاج الشعر دبي | GENOSYS', description: 'منتجات العناية بفروة الرأس والشعر الاحترافية من GENOSYS.', h1: 'العناية بفروة الرأس والشعر' },
      ru: { title: 'Уход за кожей головы и волосами ОАЭ | Лечение волос Дубай | GENOSYS', description: 'Профессиональные средства GENOSYS для ухода за кожей головы и волосами.', h1: 'Уход за кожей головы и волосами' },
    },
  },
  {
    slug: 'eye-care',
    categoryKey: 'Eye care',
    seo: {
      en: { title: 'Eye Care Products UAE | Eye Cream & Serum Dubai | GENOSYS', description: 'GENOSYS professional eye care products for UAE. Eye contour serums, creams and gel patches for dark circles and wrinkles. Free shipping over 1000 AED.', h1: 'Professional Eye Care' },
      ar: { title: 'منتجات العناية بالعين الإمارات | كريم العين دبي | GENOSYS', description: 'منتجات العناية بالعين الاحترافية من GENOSYS. سيرومات وكريمات لمحيط العين.', h1: 'العناية الاحترافية بالعين' },
      ru: { title: 'Средства для глаз ОАЭ | Крем для глаз Дубай | GENOSYS', description: 'Профессиональные средства GENOSYS для ухода за кожей вокруг глаз.', h1: 'Профессиональный уход за кожей вокруг глаз' },
    },
  },
  {
    slug: 'device',
    categoryKey: 'Device',
    seo: {
      en: { title: 'Skincare Devices UAE | LED & Microneedling Devices Dubai | GENOSYS', description: 'GENOSYS professional skincare devices for UAE. LED therapy, microneedling pens and rollers for clinic and home use. Free shipping over 1000 AED.', h1: 'Professional Skincare Devices' },
      ar: { title: 'أجهزة العناية بالبشرة الإمارات | أجهزة LED والوخز دبي | GENOSYS', description: 'أجهزة العناية بالبشرة الاحترافية من GENOSYS. علاج LED وأقلام الوخز.', h1: 'أجهزة العناية بالبشرة الاحترافية' },
      ru: { title: 'Устройства для ухода за кожей ОАЭ | LED и микронидлинг Дубай | GENOSYS', description: 'Профессиональные устройства GENOSYS для ухода за кожей. LED-терапия и микронидлинг.', h1: 'Профессиональные устройства для ухода за кожей' },
    },
  },
  {
    slug: 'bio-meso',
    categoryKey: 'Bio Meso',
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
