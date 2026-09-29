export const PRODUCT_1_RU_NAME = 'Микроигольчатый роллер GENOSYS DTS'
export const PRODUCT_1_AR_NAME = 'رولر الوخز الدقيق GENOSYS DTS'

export const PRODUCT_1_RU_DESCRIPTION =
  'Микроигольчатый роллер GENOSYS DTS: каждая игла вырезана из металлического диска, толщина 0,2 мм, гамма-стерилизация - для одной точной, комфортной и идеально чистой процедуры. На головке 0,25 мм - 540 игл, на 0,5 и 1,0 мм - 450, на 1,5 и 2,0 мм - 405, тогда как у обычного проволочного роллера их 192. Ни проволоки, ни клея - ни одна игла не выпадет во время прокатывания. До 500 000 микроканалов за десятиминутную процедуру открывают путь ампуле, которую вы наносите. Стерильная упаковка, однократное применение, CE, производство в Корее по ISO 13485.'

export const PRODUCT_1_AR_DESCRIPTION =
  'رولر الوخز الدقيق GENOSYS DTS: كل إبرة مقطوعة من قرص معدني، بسماكة 0.2 مم، ومعقمة بأشعة غاما - لجلسة واحدة دقيقة ومريحة ونظيفة تماماً. يحمل رأس 0.25 مم 540 إبرة، ومقاسا 0.5 و1.0 مم 450 إبرة، ومقاسا 1.5 و2.0 مم 405 إبر، بينما يحمل الرولر السلكي المعتاد 192 إبرة. لا أسلاك ولا مواد لاصقة، فلا تنفصل أي إبرة أثناء التمرير. حتى 500,000 قناة دقيقة في جلسة من عشر دقائق تفتح الطريق للأمبولة المستخدمة. عبوة معقمة محكمة، للاستخدام مرة واحدة، بعلامة CE، وصُنع في كوريا وفق ISO 13485.'

export const PRODUCT_1_RU_TRANSLATION = {
  name: PRODUCT_1_RU_NAME,
  description: PRODUCT_1_RU_DESCRIPTION,
  productDetails: JSON.stringify({
    type: 'Одноразовый микроигольчатый роллер с дисковой системой игл DTS',
    availableLengths: '0,25 / 0,5 / 1,0 / 1,5 / 2,0 мм',
    needleCount: '540 при 0,25 мм · 450 при 0,5 и 1,0 мм · 405 при 1,5 и 2,0 мм',
    needleThickness: '0,2 мм',
    needleMaterial: 'Нержавеющая сталь SUS 304(H)',
    construction: 'Иглы вырезаны из металлических дисков - без проволоки и клея',
    sterilization: 'Гамма-стерилизация; индикатор меняет цвет с жёлтого на красный',
    shelfLife: '3 года',
    safety: 'Только для однократного применения',
    certification: 'CE · ISO 13485',
    origin: 'Сделано в Корее · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Вырезаны из дисков',
      description:
        'Каждый ряд игл вырезан из цельного металлического диска. Ни проволоки, ни клея - барабан остаётся идеальным всю процедуру.',
    },
    {
      title: '540 игл',
      description:
        '540 на головке 0,25 мм, 450 при 0,5 и 1,0 мм, 405 при 1,5 и 2,0 мм. У обычного проволочного роллера - 192.',
    },
    {
      title: 'Тонкие иглы 0,2 мм',
      description:
        'Нержавеющая сталь SUS 304(H), тоньше привычных 0,25-0,3 мм, для более комфортного прокатывания.',
    },
    {
      title: 'С жёлтого на красный',
      description:
        'Каждый роллер проходит гамма-стерилизацию, и индикатор меняет цвет с жёлтого на красный. Упаковка остаётся закрытой до процедуры.',
    },
    {
      title: 'Пять длин',
      description: '0,25, 0,5, 1,0, 1,5 и 2,0 мм: специалист подбирает роллер под зону и задачу.',
    },
    {
      title: 'CE · ISO 13485',
      description: 'Маркировка CE, производство в Корее по стандарту менеджмента качества ISO 13485.',
    },
  ]),
  benefits: JSON.stringify([
    'Равномерные микроканалы по всей зоне - до 500 000 за десятиминутную процедуру',
    'Открывает путь ампуле, которую вы наносите',
    'Более мягкое и комфортное прокатывание благодаря иглам 0,2 мм',
    'Без проволоки и клея: ни одна игла не выпадет во время процедуры',
    'Стерильно и в закрытой упаковке - для одной идеально чистой процедуры',
    'Пять длин для любой зоны и задачи',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    {
      step: 'Выбор длины',
      instruction: 'Специалист подбирает длину игл и интервал между процедурами под зону и задачу.',
    },
    {
      step: 'Подготовка',
      instruction:
        'Очистите кожу и распределите ампулу Power Solution. Вскройте стерильную упаковку непосредственно перед процедурой.',
    },
    {
      step: 'Прокатывание',
      instruction:
        'Медленные ровные проходы с одинаковым давлением: горизонтально, вертикально, затем по диагонали. Без зигзагов и резких движений.',
    },
    {
      step: 'Завершение',
      instruction:
        'Затем маска и Soothing Repair Postcream; днём обязательно солнцезащитное средство.',
    },
    {
      step: 'Утилизация',
      instruction:
        'Один роллер - одна процедура: после неё утилизируйте его. Не очищайте и не используйте повторно.',
    },
  ]),
  directions:
    'Только для профессионального применения обученным специалистом. Не использовать при аллергии на металл, склонности к келоидным рубцам, выраженном атопическом дерматите, розацеа, куперозе, псориазе, нарушениях свёртываемости крови, неконтролируемом диабете или тяжёлой гипертензии. Не применять на повреждённой, воспалённой или инфицированной коже и не сочетать со средствами со спикулами. Длину игл, давление и интервал между процедурами специалист определяет индивидуально. Изделие стерильно и предназначено только для одного применения.',
} as const

export const PRODUCT_1_AR_TRANSLATION = {
  name: PRODUCT_1_AR_NAME,
  description: PRODUCT_1_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    type: 'رولر وخز دقيق للاستخدام مرة واحدة بنظام الإبر القرصية DTS',
    availableLengths: '0.25 / 0.5 / 1.0 / 1.5 / 2.0 مم',
    needleCount: '540 عند 0.25 مم · 450 عند 0.5 و1.0 مم · 405 عند 1.5 و2.0 مم',
    needleThickness: '0.2 مم',
    needleMaterial: 'فولاذ مقاوم للصدأ SUS 304(H)',
    construction: 'إبر مقطوعة من أقراص معدنية - بلا أسلاك ولا مواد لاصقة',
    sterilization: 'تعقيم بأشعة غاما؛ يتحول المؤشر من الأصفر إلى الأحمر',
    shelfLife: '3 سنوات',
    safety: 'للاستخدام مرة واحدة فقط؛ لا يُعاد استخدامه',
    certification: 'CE · ISO 13485',
    origin: 'صُنع في كوريا · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'مقطوعة من أقراص',
      description:
        'كل صف من الإبر مقطوع من قرص معدني واحد. لا أسلاك ولا مواد لاصقة، فيبقى الرولر مثالياً طوال الجلسة.',
    },
    {
      title: '540 إبرة',
      description:
        '540 إبرة في رأس 0.25 مم، و450 عند 0.5 و1.0 مم، و405 عند 1.5 و2.0 مم. أما الرولر السلكي المعتاد فيحمل 192 إبرة.',
    },
    {
      title: 'إبر دقيقة 0.2 مم',
      description:
        'فولاذ مقاوم للصدأ SUS 304(H)، أدق من الإبر المعتادة بسماكة 0.25-0.3 مم، لتمرير أكثر راحة.',
    },
    {
      title: 'من الأصفر إلى الأحمر',
      description:
        'يُعقّم كل رولر بأشعة غاما، ويتحول المؤشر من الأصفر إلى الأحمر دليلاً على ذلك. تبقى العبوة مغلقة حتى الجلسة.',
    },
    {
      title: 'خمسة أطوال',
      description: '0.25 و0.5 و1.0 و1.5 و2.0 مم، ليختار المختص الرولر المناسب للمنطقة والهدف.',
    },
    {
      title: 'CE · ISO 13485',
      description: 'يحمل علامة CE، ويُصنّع في كوريا وفق نظام إدارة الجودة ISO 13485.',
    },
  ]),
  benefits: JSON.stringify([
    'قنوات دقيقة متساوية على كامل المنطقة - حتى 500,000 قناة في جلسة من عشر دقائق',
    'يفتح الطريق للأمبولة المستخدمة',
    'تمرير أنعم وأكثر راحة بفضل إبر 0.2 مم',
    'بلا أسلاك ولا مواد لاصقة: لا تنفصل أي إبرة أثناء الجلسة',
    'معقم ومحكم الإغلاق لجلسة واحدة نظيفة تماماً',
    'خمسة أطوال لكل منطقة وهدف',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    {
      step: 'اختيار الطول',
      instruction: 'يختار المختص طول الإبر والفاصل بين الجلسات وفق المنطقة والهدف.',
    },
    {
      step: 'التحضير',
      instruction:
        'تُنظف البشرة وتُوزع أمبولة Power Solution عليها، ثم تُفتح العبوة المعقمة مباشرة قبل الجلسة.',
    },
    {
      step: 'التمرير',
      instruction:
        'تمريرات بطيئة ومتساوية بضغط ثابت: أفقياً ثم عمودياً ثم قطرياً، من دون حركات متعرجة أو مفاجئة.',
    },
    {
      step: 'الإنهاء',
      instruction: 'يلي ذلك قناع العلاج ثم Soothing Repair Postcream، مع واقي الشمس خلال النهار.',
    },
    {
      step: 'التخلص من الرولر',
      instruction: 'رولر واحد لجلسة واحدة: يُتخلص منه بعدها، ولا يُنظف ولا يُعاد استخدامه.',
    },
  ]),
  directions:
    'للاستخدام الاحترافي فقط بواسطة مختص مدرّب. لا يُستخدم في حالات الحساسية للمعادن، أو القابلية لتكوّن الجدرة، أو التهاب الجلد التأتبي الشديد، أو الوردية، أو توسع الشعيرات، أو الصدفية، أو اضطرابات تخثر الدم، أو السكري غير المنضبط، أو ارتفاع ضغط الدم الشديد. يُمنع استخدامه على البشرة المجروحة أو الملتهبة أو المصابة بعدوى، ولا يُجمع مع منتجات الشويكات. يحدد المختص طول الإبر والضغط والفاصل بين الجلسات لكل حالة. المنتج معقم ومخصص لاستخدام واحد فقط.',
} as const

/** English, as written to the product record by scripts/update-product-1-campaign-gallery.ts. */
export const PRODUCT_1_EN = {
  description:
    'The GENOSYS DTS microneedle roller: every needle cut from a metal disk, 0.2 mm fine and gamma-sterilised, for one precise, comfortable, perfectly clean session. The 0.25 mm head carries 540 needles, 0.5 and 1.0 mm carry 450, 1.5 and 2.0 mm carry 405 - where a typical wire roller carries 192. No wire and no glue, so no needle comes loose mid-pass. Up to 500,000 micro-channels in a ten-minute session open the way for the ampoule you apply. Sealed, single use, CE-marked, made in Korea under ISO 13485.',
  productDetails: JSON.stringify({
    type: 'Single-use microneedle roller, DTS disk needle system',
    availableLengths: '0.25 / 0.5 / 1.0 / 1.5 / 2.0 mm',
    needleCount: '540 at 0.25 mm · 450 at 0.5 and 1.0 mm · 405 at 1.5 and 2.0 mm',
    needleThickness: '0.2 mm',
    needleMaterial: 'SUS 304(H) stainless steel',
    construction: 'Needles cut from metal disks - no wire, no glue',
    sterilization: 'Gamma-sterilised; the indicator turns from yellow to red',
    shelfLife: '3 years',
    safety: 'Single use only',
    certification: 'CE · ISO 13485',
    origin: 'Made in Korea · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Cut from disks', description: 'Every row of needles is cut from a single metal disk. No wire and no glue, so the drum stays perfect for the whole session.' },
    { title: '540 needles', description: '540 on the 0.25 mm head, 450 at 0.5 and 1.0 mm, 405 at 1.5 and 2.0 mm. A typical wire roller carries 192.' },
    { title: '0.2 mm fine', description: 'SUS 304(H) stainless steel, finer than the usual 0.25-0.3 mm needle, for a more comfortable pass.' },
    { title: 'Yellow to red', description: 'Every roller is gamma-sterilised, and the indicator turns from yellow to red to prove it. Sealed until the session.' },
    { title: 'Five lengths', description: '0.25, 0.5, 1.0, 1.5 and 2.0 mm, so the practitioner matches the roller to the area and the goal.' },
    { title: 'CE · ISO 13485', description: 'CE-marked and made in Korea under ISO 13485 quality management.' },
  ]),
  benefits: JSON.stringify([
    'Even micro-channels across the whole area - up to 500,000 in a ten-minute session',
    'Opens the way for the ampoule you apply',
    'A smoother, more comfortable pass with 0.2 mm needles',
    'No wire, no glue: no needle comes loose mid-pass',
    'Sterile and sealed for one perfectly clean session',
    'Five lengths for every area and goal',
  ]),
  howToUse: JSON.stringify([
    { step: 'Choose the length', instruction: 'The practitioner picks the needle length and the interval between sessions for the area and the goal.' },
    { step: 'Prepare', instruction: 'Cleanse, then spread a Power Solution ampoule over the skin. Open the sterile pack right before the session.' },
    { step: 'Roll', instruction: 'Slow, even passes with steady pressure: horizontal, vertical, then diagonal. No zig-zags, no sudden moves.' },
    { step: 'Finish', instruction: 'Follow with a treatment mask and the Soothing Repair Postcream; wear sun protection during the day.' },
    { step: 'Dispose', instruction: 'One roller, one session: discard it afterwards. Never clean or reuse it.' },
  ]),
  directions:
    'For professional use by a trained practitioner. Do not use with metal allergy, a tendency to keloid scarring, severe atopic dermatitis, rosacea, couperose, psoriasis, bleeding disorders, uncontrolled diabetes or severe hypertension. Do not use on damaged, inflamed or infected skin, and never with spicule products. Needle length, pressure and interval are set individually by the practitioner. Sterile, single use only.',
} as const
