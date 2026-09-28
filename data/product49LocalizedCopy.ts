export const PRODUCT_49_RU_NAME = 'Профессиональный LED-аппарат GENO-LED IR II'
export const PRODUCT_49_AR_NAME = 'جهاز LED المهني GENO-LED IR II'

export const PRODUCT_49_RU_TRANSLATION = {
  name: PRODUCT_49_RU_NAME,
  description:
    'GENO-LED IR II: профессиональный купольный LED-аппарат с 1 710 светодиодами и пятью длинами волн: красный 640 нм, синий 423 нм, зелёный 532 нм, жёлтый 583 нм и инфракрасный 830 нм. Для каждого режима известны плотность мощности и стандартная доза, поэтому сеанс рассчитывается заранее. Любой цвет работает одновременно с инфракрасным, а красный с синим, зелёным или жёлтым чередуются каждые три секунды. Таймер с шагом 5 минут, голосовое сообщение за минуту до конца и автоотключение. 70 Вт номинальной электрической мощности, 520 × 220 × 315 мм, 2,6 кг. Сделано в Корее, для профессионального кабинета.',
  productDetails: JSON.stringify({
    form: 'Профессиональный купольный LED-аппарат',
    leds: '1 710: 380 красных · 380 синих · 380 зелёных · 380 жёлтых · 190 инфракрасных',
    wavelengths: '423 · 532 · 583 · 640 · 830 нм',
    irradiance: 'Красный 42 · синий 46 · зелёный 15 · жёлтый 11 · инфракрасный 15 мВт/см²',
    standardDose: 'Красный 28 · синий 28 · зелёный 9 · жёлтый 7 · инфракрасный 12 Дж/см²',
    publishedDoseRanges: 'Красный 1-186 · синий 1-152 · зелёный 1-52 · жёлтый 1-39 · инфракрасный 1-56 Дж/см²',
    bandwidth: '20 ±5 нм для каждого режима',
    publishedExposureRanges: 'Видимые режимы 5-60 минут · инфракрасный 1-10 минут',
    panelTimer: 'Таймер панели 5-30 минут с шагом 5 минут',
    combinations: 'Любой видимый цвет + ИК одновременно · красный + синий/зелёный/жёлтый попеременно каждые 3 секунды',
    controls: 'Автоотключение · голосовое сообщение за 1 минуту до завершения · английский, корейский и китайский',
    ratedPower: '70 Вт - номинальная электрическая мощность, не оптический выход',
    dimensions: '520 × 220 × 315 мм',
    weight: '2,6 кг',
    origin: 'DTS MG Co., Ltd. · Сделано в Корее',
  }),
  keyFeatures: JSON.stringify([
    {
      title: '1 710 светодиодов',
      description: 'По 380 светодиодов каждого видимого цвета и 190 инфракрасных.',
    },
    {
      title: 'Пять режимов с опубликованной дозиметрией',
      description: 'Для каждой длины волны приведены плотность мощности, стандартная доза, диапазон дозы и ширина полосы.',
    },
    {
      title: 'Два способа сочетать свет',
      description: 'Цвет и ИК работают одновременно; красный с другим цветом чередуются каждые три секунды.',
    },
    {
      title: 'Панель с таймером и автоотключением',
      description: 'Таймер 5-30 минут с шагом 5 минут и голосовое сообщение за минуту до конца.',
    },
  ]),
  benefits: JSON.stringify([
    'Пять точно обозначенных длин волн в одном профессиональном аппарате',
    'Опубликованная дозиметрия по каждому режиму вместо неопределённых уровней интенсивности',
    'Одновременная работа любого видимого цвета с инфракрасным светом',
    'Чередование красного с синим, зелёным или жёлтым каждые три секунды',
    'Панель управления с шагом таймера 5 минут и автоматическим завершением',
    'Компактный корпус 520 × 220 × 315 мм весом 2,6 кг',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    {
      step: 'Подключите адаптер',
      instruction: 'Используйте разъём питания на любой стороне аппарата. После подключения кнопка питания загорается, а аппарат переходит в режим ожидания.',
    },
    {
      step: 'Включите аппарат',
      instruction: 'Коснитесь кнопки Power ON/OFF.',
    },
    {
      step: 'Задайте время',
      instruction: 'Настройте таймер кнопками вверх и вниз: 5-30 минут с шагом 5 минут.',
    },
    {
      step: 'Выберите свет',
      instruction: 'Выберите красный, синий, зелёный или жёлтый. Для одновременной работы добавьте IR.',
    },
    {
      step: 'При необходимости включите чередование',
      instruction: 'После красного выберите синий, зелёный или жёлтый: два цвета будут чередоваться каждые три секунды.',
    },
    {
      step: 'Дождитесь завершения',
      instruction: 'За минуту до конца звучит сообщение, затем аппарат выключается автоматически.',
    },
  ]),
  directions:
    'Для профессионального применения обученным специалистом. Экспозицию задавайте по таблице доз и руководству к вашему аппарату; интервал после инъекций, нитевого лифтинга, микронидлинга или пилинга определяет специалист. Руководство, декларацию соответствия и документ о классификации для серийного номера аппарата запросите у нас до покупки.',
} as const

export const PRODUCT_49_AR_TRANSLATION = {
  name: PRODUCT_49_AR_NAME,
  description:
    'GENO-LED IR II جهاز LED مهني بقبة تضم 1,710 صماماً وخمسة أطوال موجية: الأحمر 640 نانومتر، والأزرق 423، والأخضر 532، والأصفر 583، وتحت الأحمر 830. لكل وضع شدة إشعاع وجرعة معيارية معروفتان، فتُحسب الجلسة مسبقاً. يعمل أي لون مع تحت الأحمر في الوقت نفسه، ويتناوب الأحمر مع الأزرق أو الأخضر أو الأصفر كل ثلاث ثوانٍ. مؤقت بخطوات 5 دقائق، ورسالة صوتية قبل النهاية بدقيقة، وإيقاف تلقائي. قدرة كهربائية مقدرة 70 واط، وأبعاد 520 × 220 × 315 مم، ووزن 2.6 كغ. صُنع في كوريا لغرفة الجلسات المهنية.',
  productDetails: JSON.stringify({
    form: 'جهاز LED مهني بقبة',
    leds: '1,710: ‏380 أحمر · 380 أزرق · 380 أخضر · 380 أصفر · 190 تحت الأحمر',
    wavelengths: '423 · 532 · 583 · 640 · 830 نانومتر',
    irradiance: 'الأحمر 42 · الأزرق 46 · الأخضر 15 · الأصفر 11 · تحت الأحمر 15 ملي واط/سم²',
    standardDose: 'الأحمر 28 · الأزرق 28 · الأخضر 9 · الأصفر 7 · تحت الأحمر 12 جول/سم²',
    publishedDoseRanges: 'الأحمر 1-186 · الأزرق 1-152 · الأخضر 1-52 · الأصفر 1-39 · تحت الأحمر 1-56 جول/سم²',
    bandwidth: '20 ±5 نانومتر لكل وضع',
    publishedExposureRanges: 'الأوضاع المرئية 5-60 دقيقة · تحت الأحمر 1-10 دقائق',
    panelTimer: 'مؤقت اللوحة من 5 إلى 30 دقيقة بخطوات 5 دقائق',
    combinations: 'أي لون مرئي + تحت الأحمر معاً · الأحمر + الأزرق/الأخضر/الأصفر بالتناوب كل 3 ثوانٍ',
    controls: 'إيقاف تلقائي · رسالة صوتية قبل النهاية بدقيقة · الإنجليزية والكورية والصينية',
    ratedPower: '70 واط قدرة كهربائية مقدرة، وليست خرجاً ضوئياً',
    dimensions: '520 × 220 × 315 مم',
    weight: '2.6 كغ',
    origin: 'DTS MG Co., Ltd. · صنع في كوريا',
  }),
  keyFeatures: JSON.stringify([
    {
      title: '1,710 صمام LED',
      description: '380 صماماً لكل لون مرئي و190 صماماً تحت الأحمر.',
    },
    {
      title: 'خمسة أوضاع ببيانات جرعات منشورة',
      description: 'لكل طول موجي شدة إشعاع وجرعة معيارية ومدى جرعة وعرض نطاق محدد.',
    },
    {
      title: 'طريقتان للجمع بين الأضواء',
      description: 'يعمل اللون مع تحت الأحمر في الوقت نفسه، بينما يتناوب الأحمر مع لون آخر كل ثلاث ثوانٍ.',
    },
    {
      title: 'لوحة بمؤقت وإيقاف تلقائي',
      description: 'مؤقت من 5 إلى 30 دقيقة بخطوات 5 دقائق ورسالة صوتية قبل النهاية بدقيقة.',
    },
  ]),
  benefits: JSON.stringify([
    'خمسة أطوال موجية محددة بدقة في جهاز مهني واحد',
    'بيانات جرعات منشورة لكل وضع بدلاً من مستويات شدة مبهمة',
    'تشغيل متزامن لأي لون مرئي مع تحت الأحمر',
    'تناوب الأحمر مع الأزرق أو الأخضر أو الأصفر كل ثلاث ثوانٍ',
    'لوحة تحكم بخطوات 5 دقائق وإنهاء تلقائي',
    'هيكل مدمج 520 × 220 × 315 مم بوزن 2.6 كغ',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    {
      step: 'صلي المحول',
      instruction: 'استخدمي منفذ الطاقة في أي من جانبي الجهاز. بعد التوصيل يضيء زر الطاقة ويدخل الجهاز وضع الاستعداد.',
    },
    {
      step: 'شغلي الجهاز',
      instruction: 'المسي زر Power ON/OFF.',
    },
    {
      step: 'اضبطي الوقت',
      instruction: 'اضبطي المؤقت بزرّي الرفع والخفض: من 5 إلى 30 دقيقة بخطوات 5 دقائق.',
    },
    {
      step: 'اختاري الضوء',
      instruction: 'اختاري الأحمر أو الأزرق أو الأخضر أو الأصفر. أضيفي IR لتشغيله في الوقت نفسه.',
    },
    {
      step: 'فعلي التناوب عند الحاجة',
      instruction: 'بعد الأحمر اختاري الأزرق أو الأخضر أو الأصفر، وسيتناوب اللونان كل ثلاث ثوانٍ.',
    },
    {
      step: 'انتظري اكتمال الوقت',
      instruction: 'تعمل رسالة صوتية قبل النهاية بدقيقة، ثم يتوقف الجهاز تلقائياً.',
    },
  ]),
  directions:
    'للاستخدام المهني من قبل مختص مدرّب. اضبطي مدة التعرض من جدول الجرعات ومن دليل جهازك، ويحدد المختص الفاصل الزمني بعد الحقن أو شد الخيوط أو الوخز الدقيق أو التقشير. اطلبي منا قبل الشراء دليل الاستخدام وإعلان المطابقة ووثيقة التصنيف الخاصة بالرقم التسلسلي للجهاز.',
} as const

export const PRODUCT_49_EN_RECORD = {
  description:
    'Five lights. One dome. GENO-LED IR II is a professional dome LED unit with 1,710 LEDs across five wavelengths: red 640 nm, blue 423 nm, green 532 nm, yellow 583 nm and infrared 830 nm. Every mode is published with its irradiance and standard dose, so a session is planned before it starts: 42 mW/cm² and 28 J/cm² on red, 46 mW/cm² and 28 J/cm² on blue. Any colour runs with infrared at the same time, and red alternates with blue, green or yellow every three seconds. A timer in 5-minute steps, a voice message a minute before the end and automatic shut-off. 70 W rated electrical power, 520 × 220 × 315 mm, 2.6 kg. Made in Korea for the professional treatment room.',
  productDetails: JSON.stringify({
    form: 'Professional dome LED device',
    leds: '1,710: 380 red · 380 blue · 380 green · 380 yellow · 190 infrared',
    wavelengths: '423 · 532 · 583 · 640 · 830 nm',
    irradiance: 'Red 42 · blue 46 · green 15 · yellow 11 · infrared 15 mW/cm²',
    standardDose: 'Red 28 · blue 28 · green 9 · yellow 7 · infrared 12 J/cm²',
    publishedDoseRanges: 'Red 1-186 · blue 1-152 · green 1-52 · yellow 1-39 · infrared 1-56 J/cm²',
    bandwidth: '20 ±5 nm on every mode',
    publishedExposureRanges: 'Visible modes 5-60 minutes · infrared 1-10 minutes',
    panelTimer: 'Panel timer 5-30 minutes in 5-minute steps',
    combinations: 'Any visible colour + IR together · red + blue/green/yellow alternating every 3 seconds',
    controls: 'Automatic shut-off · voice message 1 minute before the end · English, Korean and Chinese',
    ratedPower: '70 W rated electrical power, not optical output',
    dimensions: '520 × 220 × 315 mm',
    weight: '2.6 kg',
    origin: 'DTS MG Co., Ltd. · Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    {
      title: '1,710 LEDs',
      description: '380 LEDs of each visible colour and 190 infrared.',
    },
    {
      title: 'Five modes, every one dosed',
      description: 'Irradiance, standard dose, dose range and bandwidth published for each wavelength.',
    },
    {
      title: 'Two ways to combine light',
      description: 'Colour and IR run together; red with another colour alternates every three seconds.',
    },
    {
      title: 'A panel with timer and auto shut-off',
      description: 'A 5-30 minute timer in 5-minute steps and a voice message a minute before the end.',
    },
  ]),
  benefits: JSON.stringify([
    'Five exactly specified wavelengths in one professional unit',
    'Published dosimetry for every mode instead of vague intensity levels',
    'Any visible colour runs at the same time as infrared',
    'Red alternates with blue, green or yellow every three seconds',
    'A control panel with a 5-minute timer step and automatic finish',
    'A compact 520 × 220 × 315 mm body at 2.6 kg',
  ]),
  howToUse: JSON.stringify([
    {
      step: 'Plug in the adapter',
      instruction: 'Use the power socket on either side of the unit. Once connected, the power button lights up and the unit goes to standby.',
    },
    {
      step: 'Switch it on',
      instruction: 'Touch the Power ON/OFF button.',
    },
    {
      step: 'Set the time',
      instruction: 'Set the timer with the up and down keys: 5-30 minutes in 5-minute steps.',
    },
    {
      step: 'Choose the light',
      instruction: 'Choose red, blue, green or yellow. Add IR to run with it at the same time.',
    },
    {
      step: 'Add alternation if you want it',
      instruction: 'After red, choose blue, green or yellow: the two colours alternate every three seconds.',
    },
    {
      step: 'Let it finish',
      instruction: 'A message plays a minute before the end, then the unit switches itself off.',
    },
  ]),
  directions:
    'For professional use by a trained specialist. Set exposure from the dose table and the manual for your unit; the interval after injections, a thread lift, microneedling or a peel is set by the specialist. Before you buy, ask us for the manual, the declaration of conformity and the classification document for the serial number of your unit.',
} as const
