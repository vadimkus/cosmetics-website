/**
 * Product 67, GENOSYS DTS Microneedle Stamp: the "Press here." campaign copy.
 *
 * A scalp tool, positioned with HR³ MATRIX HAIR SOLUTION α (product 45). No face use anywhere.
 *
 * Sources: DTS MG "Overview of Microneedling" deck (140 needles per stamp, the stamp "ideal for
 * scalp treatment"), the HR³ MATRIX HAIR SOLUTION α deck and Russian panel (comb-part, 1 to 2 cm
 * between partings, roller or stamp at 0.25 to 0.5 mm for 10 to 15 minutes, half a vial or a
 * whole one by area; the solution is registered as a leave-in), the CE certificate (GENOSYS
 * STAMP), DTS MG ISO 13485 and the Korean free-sale certificate (ST models, licence 14-1318).
 * Sold in the roller's five lengths, 0.25 to 2.0 mm.
 * Left out on purpose: needle thickness, steel grade, gamma indicator and shelf life, which the
 * sources state for the roller only; and any hair-loss or regrowth claim (owner decision for the
 * whole HR³ line, 17 Aug).
 */

export const PRODUCT_67_NAME = 'Microneedle Stamp'
export const PRODUCT_67_RU_NAME = 'Микроигольчатый штамп GENOSYS DTS'
export const PRODUCT_67_AR_NAME = 'ختم الوخز الدقيق GENOSYS DTS'

export const PRODUCT_67_SIZES = ['0.25mm', '0.5mm', '1.0mm', '1.5mm', '2.0mm'] as const
export const PRODUCT_67_PRICE = 230

export const PRODUCT_67_EN = {
  description:
    'The GENOSYS DTS scalp stamp: 140 disk-cut needles in one flat head, pressed straight down along every parting. A roller has to travel through the hair; the stamp only goes down and lifts off, so nothing tangles and nothing pulls. It is made for HR³ MATRIX HAIR SOLUTION α: part the hair every 1 to 2 cm, apply the solution along the parting, then stamp. Every row of needles is cut from a metal disk, with no wire and no glue, so nothing comes loose. Five lengths, 0.25 to 2.0 mm; the HR³ scalp protocol works at 0.25 to 0.5 mm. Sterile, sealed, single use, CE-marked, made in Korea by DTS MG under ISO 13485.',
  productDetails: JSON.stringify({
    type: 'Single-use scalp microneedle stamp, DTS disk needle system',
    availableLengths: '0.25 / 0.5 / 1.0 / 1.5 / 2.0 mm',
    needleCount: '140 per stamp',
    construction: 'Needles cut from metal disks - no wire, no glue',
    application: 'Stamping along the parting: press straight down, lift, move one head-width on',
    treatmentAreas: 'The scalp, parting by parting',
    sterilization: 'Sterile, in a sealed pack',
    safety: 'Single use only',
    certification: 'CE · ISO 13485',
    origin: 'Made in Korea · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Straight down', description: 'Every press goes in at 90° and lifts straight off: no rolling, no drag and no pull on the hair.' },
    { title: 'No tangles', description: 'A roller has to travel through the hair. The stamp only presses down between the strands, parting by parting, and lifts off clean.' },
    { title: '140 disk-cut needles', description: 'Every row of needles is cut from a single metal disk. No wire and no glue, so nothing comes loose mid-session.' },
    { title: 'Made for HR³', description: 'Built into the HR³ MATRIX HAIR SOLUTION α protocol: apply the solution along the parting, then stamp for 10 to 15 minutes.' },
    { title: 'Five lengths', description: '0.25, 0.5, 1.0, 1.5 and 2.0 mm, the same five as the GENOSYS roller. The HR³ scalp protocol works at 0.25 to 0.5 mm.' },
    { title: 'CE · ISO 13485', description: 'Sterile and sealed, CE-marked, made in Korea by DTS MG under ISO 13485 quality management.' },
  ]),
  benefits: JSON.stringify([
    'Presses between the hairs, never drags through them',
    'Straight 90° presses: no tangles, no pull',
    'Opens the way for HR³ MATRIX HAIR SOLUTION α',
    'Works the whole scalp, parting by parting',
    'No wire, no glue: nothing comes loose',
    'Sterile, sealed and single use',
  ]),
  howToUse: JSON.stringify([
    { step: 'Choose the length', instruction: 'For the HR³ scalp protocol, choose 0.25 or 0.5 mm. The practitioner sets the length and the interval between sessions.' },
    { step: 'Part', instruction: 'Open the sterile pack right before the session. Part the hair with a comb, 1 to 2 cm between partings.' },
    { step: 'Apply', instruction: 'Apply HR³ MATRIX HAIR SOLUTION α along the parting: half a vial for a small area, a whole vial for a larger one.' },
    { step: 'Stamp', instruction: 'Set the head flat on the scalp in the parting, press straight down with even pressure, lift and move one head-width along. Work parting by parting for 10 to 15 minutes, and never drag the stamp.' },
    { step: 'Dispose', instruction: 'One stamp, one session: discard it afterwards. Never clean, share or reuse it.' },
  ]),
  directions:
    'For professional use by a trained practitioner. Do not use with metal allergy, a tendency to keloid scarring, psoriasis or severe dermatitis of the scalp, bleeding disorders, uncontrolled diabetes or severe hypertension. Do not use on a damaged, inflamed or infected scalp, and never with spicule products. Needle length, pressure and interval are set individually by the practitioner. Sterile, single use only.',
} as const

export const PRODUCT_67_RU_DESCRIPTION =
  'Штамп GENOSYS DTS для кожи головы: 140 игл, вырезанных из металлических дисков, в одной плоской головке - строго вниз вдоль каждого пробора. Роллеру приходится катиться сквозь волосы, а штамп только опускается и поднимается, поэтому ничего не путается и не тянет. Он создан для HR³ MATRIX HAIR SOLUTION α: разделите волосы на проборы через 1-2 см, нанесите раствор вдоль пробора и работайте штампом. Каждый ряд игл вырезан из металлического диска, без проволоки и клея, поэтому ничего не выпадет. Пять длин, от 0,25 до 2,0 мм; протокол HR³ для кожи головы - 0,25-0,5 мм. Стерильно, в запечатанной упаковке, однократное применение, CE, производство DTS MG в Корее по ISO 13485.'

export const PRODUCT_67_AR_DESCRIPTION =
  'ختم GENOSYS DTS لفروة الرأس: 140 إبرة مقطوعة من أقراص معدنية في رأس مسطح واحد، تُضغط مباشرة إلى الأسفل على طول كل فرق في الشعر. الرولر يضطر إلى المرور عبر الشعر، أما الختم فينزل ويرتفع فقط، فلا يتشابك شيء ولا يُشدّ شيء. صُمم ليعمل مع HR³ MATRIX HAIR SOLUTION α: افرقي الشعر كل 1 إلى 2 سم، ضعي المحلول على طول الفرق، ثم استخدمي الختم. كل صف من الإبر مقطوع من قرص معدني، بلا أسلاك ولا مواد لاصقة، فلا ينفصل شيء. خمسة أطوال من 0.25 إلى 2.0 مم، وبروتوكول HR³ لفروة الرأس يعمل بطول 0.25 إلى 0.5 مم. معقم ومحكم الإغلاق، للاستخدام مرة واحدة، بعلامة CE، من صنع DTS MG في كوريا وفق ISO 13485.'

export const PRODUCT_67_RU_TRANSLATION = {
  name: PRODUCT_67_RU_NAME,
  description: PRODUCT_67_RU_DESCRIPTION,
  productDetails: JSON.stringify({
    type: 'Одноразовый микроигольчатый штамп для кожи головы с дисковой системой игл DTS',
    availableLengths: '0,25 / 0,5 / 1,0 / 1,5 / 2,0 мм',
    needleCount: '140 на штамп',
    construction: 'Иглы вырезаны из металлических дисков - без проволоки и клея',
    application: 'Штампование вдоль пробора: нажать строго вниз, поднять, переставить на ширину головки',
    treatmentAreas: 'Кожа головы, пробор за пробором',
    sterilization: 'Стерильно, в запечатанной упаковке',
    safety: 'Только для однократного применения',
    certification: 'CE · ISO 13485',
    origin: 'Сделано в Корее · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Строго вниз',
      description:
        'Каждое нажатие идёт под углом 90° и поднимается строго вверх: без прокатывания, протягивания и натяжения волос.',
    },
    {
      title: 'Без запутывания',
      description:
        'Роллеру приходится катиться сквозь волосы. Штамп только нажимает между прядями, пробор за пробором, и поднимается чисто.',
    },
    {
      title: '140 игл из дисков',
      description:
        'Каждый ряд игл вырезан из цельного металлического диска. Ни проволоки, ни клея - ничего не выпадет во время процедуры.',
    },
    {
      title: 'Создан для HR³',
      description:
        'Часть протокола HR³ MATRIX HAIR SOLUTION α: нанесите раствор вдоль пробора и работайте штампом 10-15 минут.',
    },
    {
      title: 'Пять длин',
      description:
        '0,25, 0,5, 1,0, 1,5 и 2,0 мм, те же пять, что у роллера GENOSYS. Протокол HR³ для кожи головы - 0,25-0,5 мм.',
    },
    {
      title: 'CE · ISO 13485',
      description: 'Стерильно и в запечатанной упаковке, маркировка CE, производство DTS MG в Корее по ISO 13485.',
    },
  ]),
  benefits: JSON.stringify([
    'Нажимает между волосами, а не протягивается сквозь них',
    'Нажатия строго под 90°: не путает и не тянет',
    'Открывает путь HR³ MATRIX HAIR SOLUTION α',
    'Прорабатывает всю кожу головы, пробор за пробором',
    'Без проволоки и клея: ничего не выпадет',
    'Стерильно, запечатано, однократно',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    {
      step: 'Выбор длины',
      instruction:
        'Для протокола HR³ по коже головы выберите 0,25 или 0,5 мм. Длину и интервал между процедурами определяет специалист.',
    },
    {
      step: 'Проборы',
      instruction:
        'Вскройте стерильную упаковку непосредственно перед процедурой. Разделите волосы расчёской на проборы через 1-2 см.',
    },
    {
      step: 'Нанесение',
      instruction:
        'Нанесите HR³ MATRIX HAIR SOLUTION α вдоль пробора: половина флакона на небольшую зону, целый флакон на большую.',
    },
    {
      step: 'Штампование',
      instruction:
        'Поставьте головку плашмя на кожу головы в проборе, нажмите строго вниз с ровным давлением, поднимите и переставьте на ширину головки. Работайте пробор за пробором 10-15 минут и никогда не протягивайте штамп.',
    },
    {
      step: 'Утилизация',
      instruction:
        'Один штамп - одна процедура: после неё утилизируйте его. Не очищайте, не передавайте другим и не используйте повторно.',
    },
  ]),
  directions:
    'Только для профессионального применения обученным специалистом. Не использовать при аллергии на металл, склонности к келоидным рубцам, псориазе или выраженном дерматите кожи головы, нарушениях свёртываемости крови, неконтролируемом диабете или тяжёлой гипертензии. Не применять на повреждённой, воспалённой или инфицированной коже головы и не сочетать со средствами со спикулами. Длину игл, давление и интервал между процедурами специалист определяет индивидуально. Изделие стерильно и предназначено только для одного применения.',
} as const

export const PRODUCT_67_AR_TRANSLATION = {
  name: PRODUCT_67_AR_NAME,
  description: PRODUCT_67_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    type: 'ختم وخز دقيق لفروة الرأس للاستخدام مرة واحدة بنظام الإبر القرصية DTS',
    availableLengths: '0.25 / 0.5 / 1.0 / 1.5 / 2.0 مم',
    needleCount: '140 إبرة في كل ختم',
    construction: 'إبر مقطوعة من أقراص معدنية - بلا أسلاك ولا مواد لاصقة',
    application: 'الختم على طول الفرق: اضغط مباشرة إلى الأسفل، ارفع، انتقل بعرض الرأس',
    treatmentAreas: 'فروة الرأس، فرقاً بعد فرق',
    sterilization: 'معقم في عبوة محكمة الإغلاق',
    safety: 'للاستخدام مرة واحدة فقط؛ لا يُعاد استخدامه',
    certification: 'CE · ISO 13485',
    origin: 'صُنع في كوريا · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'مباشرة إلى الأسفل',
      description:
        'كل ضغطة تدخل بزاوية 90° وترتفع مباشرة: لا دحرجة ولا سحب ولا شدّ للشعر.',
    },
    {
      title: 'بلا تشابك',
      description:
        'الرولر يضطر إلى المرور عبر الشعر. أما الختم فيضغط فقط بين الخصلات، فرقاً بعد فرق، ويرتفع بنظافة.',
    },
    {
      title: '140 إبرة قرصية',
      description:
        'كل صف من الإبر مقطوع من قرص معدني واحد. لا أسلاك ولا مواد لاصقة، فلا ينفصل شيء أثناء الجلسة.',
    },
    {
      title: 'مصمم لـ HR³',
      description:
        'جزء من بروتوكول HR³ MATRIX HAIR SOLUTION α: يوضع المحلول على طول الفرق، ثم يُستخدم الختم لمدة 10 إلى 15 دقيقة.',
    },
    {
      title: 'خمسة أطوال',
      description:
        '0.25 و0.5 و1.0 و1.5 و2.0 مم، الأطوال الخمسة نفسها في رولر GENOSYS. وبروتوكول HR³ لفروة الرأس يعمل بطول 0.25 إلى 0.5 مم.',
    },
    {
      title: 'CE · ISO 13485',
      description: 'معقم ومحكم الإغلاق، يحمل علامة CE، ومن صنع DTS MG في كوريا وفق ISO 13485.',
    },
  ]),
  benefits: JSON.stringify([
    'يضغط بين الشعر ولا يُسحب عبره',
    'ضغطات مستقيمة بزاوية 90°: بلا تشابك ولا شدّ',
    'يفتح الطريق لـ HR³ MATRIX HAIR SOLUTION α',
    'يعالج فروة الرأس كلها، فرقاً بعد فرق',
    'بلا أسلاك ولا مواد لاصقة: لا ينفصل شيء',
    'معقم ومحكم الإغلاق ولاستخدام واحد',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    {
      step: 'اختيار الطول',
      instruction:
        'لبروتوكول HR³ على فروة الرأس اختر 0.25 أو 0.5 مم. يحدد المختص الطول والفاصل بين الجلسات.',
    },
    {
      step: 'فرق الشعر',
      instruction:
        'تُفتح العبوة المعقمة مباشرة قبل الجلسة. يُفرق الشعر بالمشط، بمسافة 1 إلى 2 سم بين كل فرق وآخر.',
    },
    {
      step: 'وضع المحلول',
      instruction:
        'يوضع HR³ MATRIX HAIR SOLUTION α على طول الفرق: نصف قارورة لمنطقة صغيرة، وقارورة كاملة لمنطقة أكبر.',
    },
    {
      step: 'الختم',
      instruction:
        'ضع الرأس مسطحاً على فروة الرأس داخل الفرق واضغط مباشرة إلى الأسفل بضغط متساوٍ، ثم ارفعه وانتقل بعرض الرأس. اعمل فرقاً بعد فرق لمدة 10 إلى 15 دقيقة، ولا تسحب الختم أبداً.',
    },
    {
      step: 'التخلص من الختم',
      instruction: 'ختم واحد لجلسة واحدة: يُتخلص منه بعدها، ولا يُنظف ولا يُشارك ولا يُعاد استخدامه.',
    },
  ]),
  directions:
    'للاستخدام الاحترافي فقط بواسطة مختص مدرّب. لا يُستخدم في حالات الحساسية للمعادن، أو القابلية لتكوّن الجدرة، أو الصدفية أو التهاب جلد فروة الرأس الشديد، أو اضطرابات تخثر الدم، أو السكري غير المنضبط، أو ارتفاع ضغط الدم الشديد. يُمنع استخدامه على فروة رأس مجروحة أو ملتهبة أو مصابة بعدوى، ولا يُجمع مع منتجات الشويكات. يحدد المختص طول الإبر والضغط والفاصل بين الجلسات لكل حالة. المنتج معقم ومخصص لاستخدام واحد فقط.',
} as const
