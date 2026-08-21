/**
 * Canonical RU/AR catalogue copy for product 64, HR³ MATRIX HAIR STAMP.
 *
 * Source hierarchy:
 * - HairGen Booster user manual: fitting sequence, three speeds, ten-minute
 *   automatic stop and contraindications.
 * - DTS MG HairGen Booster leaflet (17 Jun 2021): 52 microneedles and a new
 *   solution + applicator set for every treatment.
 * - Current retail pack/artwork: eight stamps per box and the 0.3 mm figure.
 *
 * The 0.3 mm figure is artwork-only: it is absent from both manufacturer
 * documents. Neither document states needle material or sterility, and the
 * leaflet's efficacy/mechanism claims are deliberately not carried here.
 */

export const PRODUCT_64_RU_NAME = 'Насадки Hair Stamp для HairGen Booster'
export const PRODUCT_64_AR_NAME = 'رؤوس Hair Stamp لجهاز HairGen Booster'

export const PRODUCT_64_RU_TRANSLATION = {
  name: PRODUCT_64_RU_NAME,
  description:
    'Восемь одноразовых насадок-штампов для GENOSYS HairGen Booster. На каждой насадке 52 микроиглы. Штамп устанавливается непосредственно на флакон HR³ MATRIX HAIR SOLUTION α, а собранный комплект фиксируется в аппарате. Руководство предусматривает новый комплект из раствора и аппликатора для каждой процедуры; аппарат работает на одной из трёх скоростей и автоматически останавливается через 10 минут. Штамп предназначен только для индивидуального одноразового применения. Периодичность процедур определяет специалист.',
  productDetails: JSON.stringify({
    form: 'Одноразовая насадка-штамп с микроиглами',
    size: '1 коробка · 8 штампов',
    needles: '52 микроиглы на одной насадке',
    compatibility: 'GENOSYS HairGen Booster · флакон HR³ MATRIX HAIR SOLUTION α',
    session: 'Аппарат автоматически останавливается через 10 минут',
    speeds: '3 уровня · 280 / 330 / 400 об/мин',
    use: 'Один новый штамп и один новый флакон Hair Solution на процедуру',
    reuse: 'Только индивидуальное одноразовое применение · не использовать повторно и не передавать другому человеку',
    needleDepth: '0,3 мм указано только на текущем макете продукта; в буклете и руководстве производителя глубина не приведена',
    evidence: 'Данных об эффективности именно штампа или аппарата в подтверждающем исследовании нет',
    origin: 'DTS MG Co., Ltd. · Сделано в Корее',
  }),
  keyFeatures: JSON.stringify([
    {
      title: '52 микроиглы на насадке',
      description: 'Количество прямо указано в официальном буклете HairGen Booster.',
    },
    {
      title: 'Точная совместимость',
      description: 'Штамп подходит к HairGen Booster и устанавливается на флакон HR³ MATRIX HAIR SOLUTION α.',
    },
    {
      title: 'Один комплект на процедуру',
      description: 'Для каждой процедуры руководство предусматривает новый раствор и новый аппликатор.',
    },
    {
      title: 'Восемь насадок в коробке',
      description: 'Удобный запас из восьми индивидуальных одноразовых штампов.',
    },
  ]),
  benefits: JSON.stringify([
    'Фирменная расходная насадка для системы HairGen Booster',
    '52 микроиглы на каждом штампе',
    'Совместимость с флаконом HR³ MATRIX HAIR SOLUTION α без переливания',
    'Новый индивидуальный штамп для каждой процедуры',
    'Одна коробка содержит 8 штампов',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    {
      step: 'Подготовьте флакон',
      instruction: 'Снимите колпачок и металлическую крышку с нового флакона HR³ MATRIX HAIR SOLUTION α.',
    },
    {
      step: 'Установите новый штамп',
      instruction: 'Закрепите новый Hair Stamp на горлышке флакона.',
    },
    {
      step: 'Соберите аппарат',
      instruction: 'Снимите LED-крышку HairGen Booster, установите флакон со штампом в основание и верните крышку на место.',
    },
    {
      step: 'Следуйте проборам',
      instruction: 'Включите аппарат, разделяйте волосы расчёской и ведите штамп вдоль проборов по инструкции устройства.',
    },
    {
      step: 'Завершите процедуру',
      instruction: 'Через 10 минут аппарат остановится автоматически. Извлеките флакон вместе со штампом.',
    },
    {
      step: 'Утилизируйте комплект',
      instruction: 'Не используйте штамп повторно и не передавайте его другому человеку. Следующая процедура начинается с нового раствора и нового аппликатора.',
    },
  ]),
  directions:
    'Перед применением прочитайте руководство HairGen Booster. Не используйте при прогрессирующем акне, экземе или дерматите; при осложнениях диабета или другом серьёзном заболевании; при склонности к келоидам или аллергии на металл; на воспалённых участках или участках с риском инфекции. При сыпи, аллергической реакции или другом нежелательном эффекте немедленно прекратите использование и обратитесь за медицинской помощью. Применяйте только со средствами, рекомендованными для системы. Храните при комнатной температуре вдали от прямого света и влаги, в недоступном для детей месте.',
} as const

export const PRODUCT_64_AR_TRANSLATION = {
  name: PRODUCT_64_AR_NAME,
  description:
    'علبة تضم ثمانية رؤوس ختم أحادية الاستخدام صُممت خصيصاً لجهاز GENOSYS HairGen Booster. يحمل كل رأس 52 إبرة ميكروية، ويُثبّت مباشرة على قارورة HR³ MATRIX HAIR SOLUTION α قبل تركيب المجموعة في الجهاز. ينص دليل النظام على استخدام مجموعة جديدة من المحلول والأداة في كل جلسة؛ ويعمل الجهاز بإحدى ثلاث سرعات ثم يتوقف تلقائياً بعد 10 دقائق. الرأس مخصص للاستعمال الفردي لمرة واحدة فقط، بينما يحدد المختص وتيرة الجلسات المناسبة.',
  productDetails: JSON.stringify({
    form: 'رأس ختم بإبر ميكروية للاستعمال مرة واحدة',
    size: 'علبة واحدة · 8 رؤوس ختم',
    needles: '52 إبرة ميكروية في كل رأس',
    compatibility: 'جهاز GENOSYS HairGen Booster · قارورة HR³ MATRIX HAIR SOLUTION α',
    session: 'يتوقف الجهاز تلقائياً بعد 10 دقائق',
    speeds: '3 مستويات · 280 / 330 / 400 دورة في الدقيقة',
    use: 'رأس ختم جديد وقارورة جديدة من Hair Solution لكل جلسة',
    reuse: 'للاستعمال الفردي مرة واحدة فقط · لا يعاد استخدامه ولا يشارك مع شخص آخر',
    needleDepth: 'يظهر قياس 0.3 مم في العمل الفني الحالي فقط؛ ولا تذكره نشرة الشركة المصنّعة أو دليل الاستخدام',
    evidence: 'لا تتوفر دراسة داعمة لفعالية رأس الختم أو الجهاز نفسه',
    origin: 'DTS MG Co., Ltd. · صنع في كوريا',
  }),
  keyFeatures: JSON.stringify([
    {
      title: '52 إبرة ميكروية في كل رأس',
      description: 'العدد مذكور صراحة في النشرة الرسمية لجهاز HairGen Booster.',
    },
    {
      title: 'توافق مخصص',
      description: 'صُمم الرأس لجهاز HairGen Booster ويُثبّت على قارورة HR³ MATRIX HAIR SOLUTION α.',
    },
    {
      title: 'مجموعة جديدة لكل جلسة',
      description: 'ينص دليل النظام على تركيب محلول جديد وأداة جديدة في كل جلسة.',
    },
    {
      title: 'ثمانية رؤوس في العلبة',
      description: 'مخزون مرتب من ثمانية رؤوس فردية أحادية الاستخدام.',
    },
  ]),
  benefits: JSON.stringify([
    'رأس استهلاكي أصلي لنظام HairGen Booster',
    '52 إبرة ميكروية في كل رأس',
    'يتوافق مع قارورة HR³ MATRIX HAIR SOLUTION α من دون نقل محتواها إلى وعاء آخر',
    'رأس فردي جديد لكل جلسة',
    'تحتوي العلبة الواحدة على 8 رؤوس ختم',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    {
      step: 'حضّري القارورة',
      instruction: 'انزعي الغطاء والغطاء المعدني عن قارورة جديدة من HR³ MATRIX HAIR SOLUTION α.',
    },
    {
      step: 'ثبّتي رأساً جديداً',
      instruction: 'ثبّتي رأس Hair Stamp جديداً على فوهة القارورة.',
    },
    {
      step: 'ركّبي المجموعة في الجهاز',
      instruction: 'افصلي غطاء LED عن HairGen Booster، وثبّتي القارورة مع الرأس في قاعدة الجهاز، ثم أعيدي الغطاء إلى مكانه.',
    },
    {
      step: 'اتبعي خطوط فرق الشعر',
      instruction: 'شغّلي الجهاز، وافصلي الشعر بالمشط، ومرري الرأس على امتداد خطوط الفرق وفق دليل الجهاز.',
    },
    {
      step: 'أنهي الجلسة',
      instruction: 'يتوقف الجهاز تلقائياً بعد 10 دقائق. أخرجي القارورة مع رأس الختم.',
    },
    {
      step: 'تخلّصي من المجموعة',
      instruction: 'لا تعيدي استخدام الرأس ولا تشاركيه مع شخص آخر. تبدأ الجلسة التالية بمحلول جديد وأداة جديدة.',
    },
  ]),
  directions:
    'اقرئي دليل HairGen Booster قبل الاستخدام. لا يُستخدم في حالات حب الشباب المتطور أو الإكزيما أو التهاب الجلد، أو مضاعفات السكري أو أي مرض خطير آخر، أو القابلية للجدرة أو حساسية المعادن، أو على المناطق الملتهبة أو المعرضة للعدوى. عند ظهور طفح أو تحسس أو أي أثر غير مرغوب، أوقفي الاستخدام فوراً واطلبي المشورة الطبية. لا يُستخدم إلا مع المستحضرات الموصى بها لهذا النظام. يحفظ في درجة حرارة الغرفة بعيداً عن الضوء المباشر والرطوبة وعن متناول الأطفال.',
} as const

export const PRODUCT_64_EN_DB_COPY = {
  description:
    'A box of eight single-use microneedle stamp heads made specifically for the GENOSYS HairGen Booster. Each head carries 52 microneedles and fits directly onto an HR³ MATRIX HAIR SOLUTION α vial before the set is loaded into the device. The system instructions call for a new solution and applicator set for every session; the Booster runs at one of three speeds and stops automatically after 10 minutes. Each stamp is for one person and one use only. Session frequency should be set by a professional.',
  productDetails: JSON.stringify({
    form: 'Single-use microneedle stamp head',
    size: '1 box · 8 stamps',
    needles: '52 microneedles per stamp',
    compatibility: 'GENOSYS HairGen Booster · HR³ MATRIX HAIR SOLUTION α vial',
    session: 'The device stops automatically after 10 minutes',
    speeds: '3 levels · 280 / 330 / 400 RPM',
    use: 'One new stamp and one new Hair Solution vial per session',
    reuse: 'Personal single use only · do not reuse or share',
    needleDepth: '0.3 mm appears only in the current product artwork; it is not stated in the manufacturer leaflet or user manual',
    evidence: 'No supporting efficacy study is held for the stamp or device itself',
    origin: 'DTS MG Co., Ltd. · Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    { title: '52 microneedles per head', description: 'The exact count stated in the official HairGen Booster leaflet.' },
    { title: 'Purpose-built fit', description: 'Made for the HairGen Booster and the HR³ MATRIX HAIR SOLUTION α vial.' },
    { title: 'A new set every session', description: 'The system instructions call for a new solution and applicator for each session.' },
    { title: 'Eight stamps per box', description: 'Eight individually used consumable heads in one box.' },
  ]),
  benefits: JSON.stringify([
    'The original consumable head for the HairGen Booster system',
    '52 microneedles on each stamp',
    'Fits the HR³ MATRIX HAIR SOLUTION α vial without decanting',
    'A new personal-use stamp for every session',
    '8 stamps in one box',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'Prepare the vial', instruction: 'Remove the cap and metal lid from a new HR³ MATRIX HAIR SOLUTION α vial.' },
    { step: 'Fit a new stamp', instruction: 'Attach a new Hair Stamp to the opening of the vial.' },
    { step: 'Load the device', instruction: 'Remove the HairGen Booster LED cover, fit the vial and stamp into the base, then reinstall the cover.' },
    { step: 'Follow the partings', instruction: 'Turn on the device, part the hair with a comb and work along each parting as shown in the device manual.' },
    { step: 'Finish the session', instruction: 'The device stops automatically after 10 minutes. Remove the vial with the stamp.' },
    { step: 'Discard the set', instruction: 'Do not reuse or share the stamp. Start the next session with a new solution and a new applicator.' },
  ]),
  directions:
    'Read the HairGen Booster manual before use. Do not use in cases of progressive acne, eczema or dermatitis; diabetic complications or another serious disease; keloid tendency or metal allergy; or on inflamed areas or areas at risk of infection. Stop immediately and seek medical advice if a rash, allergic reaction or another undesirable effect appears. Use only with products recommended for the system. Store at room temperature away from direct light, humidity and children.',
} as const
