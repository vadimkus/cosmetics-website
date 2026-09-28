/**
 * Product 67, GENOSYS DTS Microneedle Stamp: the "Press here." campaign copy.
 *
 * Sources: DTS MG "Overview of Microneedling" deck (140 needles per stamp, stamp ideal for the
 * scalp, stamping technique for longer needles on scars and wrinkles, roller and automated stamp
 * comparably helpful on acne scars), the CE certificate (GENOSYS STAMP inside the scope "sterile
 * micro needle roller for treatment of acne scarring"), DTS MG ISO 13485 and the Korean free-sale
 * certificate (ST models, licence 14-1318). Sold in the roller's five lengths, 0.25 to 2.0 mm.
 * Left out on purpose: needle thickness, steel grade, gamma indicator and shelf life, which the
 * sources state for the roller only.
 */

export const PRODUCT_67_NAME = 'Microneedle Stamp'
export const PRODUCT_67_RU_NAME = 'Микроигольчатый штамп GENOSYS DTS'
export const PRODUCT_67_AR_NAME = 'ختم الوخز الدقيق GENOSYS DTS'

export const PRODUCT_67_SIZES = ['0.25mm', '0.5mm', '1.0mm', '1.5mm', '2.0mm'] as const
export const PRODUCT_67_PRICE = 230

export const PRODUCT_67_EN = {
  description:
    'The GENOSYS DTS microneedle stamp: 140 disk-cut needles in one flat head, pressed straight down exactly where you want them. Where a roller sweeps the whole face, the stamp works the details: acne scars, lines, the smile line, small zones and the scalp. Press, lift, move: every press goes in at 90°, with no drag and no sideways pull on the skin. Every row of needles is cut from a metal disk, with no wire and no glue, so nothing comes loose. Five lengths, 0.25 to 2.0 mm. Sterile, sealed, single use, CE-marked, made in Korea by DTS MG under ISO 13485.',
  productDetails: JSON.stringify({
    type: 'Single-use microneedle stamp, DTS disk needle system',
    availableLengths: '0.25 / 0.5 / 1.0 / 1.5 / 2.0 mm',
    needleCount: '140 per stamp',
    construction: 'Needles cut from metal disks - no wire, no glue',
    application: 'Stamping: press straight down, lift, move one head-width over',
    treatmentAreas: 'Acne scars, lines, the smile line, small zones, the scalp',
    sterilization: 'Sterile, in a sealed pack',
    safety: 'Single use only',
    certification: 'CE · ISO 13485',
    origin: 'Made in Korea · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Straight down', description: 'Every press goes in at 90°. The head lifts off and moves on, so there is no drag and no sideways pull on the skin.' },
    { title: '140 disk-cut needles', description: 'Every row of needles is cut from a single metal disk. No wire and no glue, so nothing comes loose mid-session.' },
    { title: 'Exactly there', description: 'Acne scars, lines, the smile line and the small zones a roller sweeps past: the stamp works exactly where you place it.' },
    { title: 'Five lengths', description: '0.25, 0.5, 1.0, 1.5 and 2.0 mm, the same five as the GENOSYS roller, so the practitioner matches the stamp to the area and the goal.' },
    { title: 'Made for the scalp', description: 'DTS built the stamp with the scalp in mind: it presses between the hairs, where a roller would drag through them.' },
    { title: 'CE · ISO 13485', description: 'Sterile and sealed, CE-marked, made in Korea by DTS MG under ISO 13485 quality management.' },
  ]),
  benefits: JSON.stringify([
    'Goes exactly where you place it: scars, lines and small zones',
    'Straight 90° presses, no drag across the skin',
    'Opens the way for the ampoule you apply',
    'Presses between the hairs on the scalp',
    'No wire, no glue: nothing comes loose',
    'Five lengths for every area and goal',
  ]),
  howToUse: JSON.stringify([
    { step: 'Choose the length', instruction: 'The practitioner picks the needle length and the interval between sessions for the area and the goal.' },
    { step: 'Prepare', instruction: 'Cleanse, then spread a Power Solution ampoule over the skin. Open the sterile pack right before the session.' },
    { step: 'Stamp', instruction: 'Set the head flat on the skin, press straight down with even pressure, lift, and move one head-width over. Work row by row across the area, and never drag the stamp across the skin.' },
    { step: 'Finish', instruction: 'Follow with a treatment mask and the Soothing Repair Postcream; wear sun protection during the day.' },
    { step: 'Dispose', instruction: 'One stamp, one session: discard it afterwards. Never clean, share or reuse it.' },
  ]),
  directions:
    'For professional use by a trained practitioner. Do not use with metal allergy, a tendency to keloid scarring, severe atopic dermatitis, rosacea, couperose, psoriasis, bleeding disorders, uncontrolled diabetes or severe hypertension. Do not use on damaged, inflamed or infected skin or scalp, and never with spicule products. Needle length, pressure and interval are set individually by the practitioner. Sterile, single use only.',
} as const

export const PRODUCT_67_RU_DESCRIPTION =
  'Микроигольчатый штамп GENOSYS DTS: 140 игл, вырезанных из металлических дисков, в одной плоской головке - строго вниз и точно туда, куда вы нажимаете. Роллер проходит по всему лицу, а штамп прорабатывает детали: постакне, морщины, носогубную зону, небольшие участки и кожу головы. Нажать, поднять, переставить: каждое нажатие идёт под углом 90°, без протягивания и бокового натяжения кожи. Каждый ряд игл вырезан из металлического диска, без проволоки и клея, поэтому ничего не выпадет. Пять длин, от 0,25 до 2,0 мм. Стерильно, в запечатанной упаковке, однократное применение, CE, производство DTS MG в Корее по ISO 13485.'

export const PRODUCT_67_AR_DESCRIPTION =
  'ختم الوخز الدقيق GENOSYS DTS: 140 إبرة مقطوعة من أقراص معدنية في رأس مسطح واحد، تُضغط مباشرة إلى الأسفل حيث تريد تماماً. الرولر يمر على الوجه كله، أما الختم فيعتني بالتفاصيل: ندبات حب الشباب، والخطوط، وخط الابتسامة، والمناطق الصغيرة، وفروة الرأس. اضغط، ارفع، انتقل: كل ضغطة تدخل بزاوية 90° من دون سحب أو شدّ جانبي للبشرة. كل صف من الإبر مقطوع من قرص معدني، بلا أسلاك ولا مواد لاصقة، فلا ينفصل شيء. خمسة أطوال من 0.25 إلى 2.0 مم. معقم ومحكم الإغلاق، للاستخدام مرة واحدة، بعلامة CE، من صنع DTS MG في كوريا وفق ISO 13485.'

export const PRODUCT_67_RU_TRANSLATION = {
  name: PRODUCT_67_RU_NAME,
  description: PRODUCT_67_RU_DESCRIPTION,
  productDetails: JSON.stringify({
    type: 'Одноразовый микроигольчатый штамп с дисковой системой игл DTS',
    availableLengths: '0,25 / 0,5 / 1,0 / 1,5 / 2,0 мм',
    needleCount: '140 на штамп',
    construction: 'Иглы вырезаны из металлических дисков - без проволоки и клея',
    application: 'Штампование: нажать строго вниз, поднять, переставить на ширину головки',
    treatmentAreas: 'Постакне, морщины, носогубная зона, небольшие участки, кожа головы',
    sterilization: 'Стерильно, в запечатанной упаковке',
    safety: 'Только для однократного применения',
    certification: 'CE · ISO 13485',
    origin: 'Сделано в Корее · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Строго вниз',
      description:
        'Каждое нажатие идёт под углом 90°. Головка поднимается и переходит дальше, без протягивания и бокового натяжения кожи.',
    },
    {
      title: '140 игл из дисков',
      description:
        'Каждый ряд игл вырезан из цельного металлического диска. Ни проволоки, ни клея - ничего не выпадет во время процедуры.',
    },
    {
      title: 'Точно в цель',
      description:
        'Постакне, морщины, носогубная зона и небольшие участки, которые роллер проходит мимоходом: штамп работает ровно там, куда его поставили.',
    },
    {
      title: 'Пять длин',
      description:
        '0,25, 0,5, 1,0, 1,5 и 2,0 мм, те же пять, что у роллера GENOSYS: специалист подбирает штамп под зону и задачу.',
    },
    {
      title: 'Создан для кожи головы',
      description:
        'DTS проектировали штамп с расчётом на кожу головы: он входит между волосами, а роллер протягивал бы их за собой.',
    },
    {
      title: 'CE · ISO 13485',
      description: 'Стерильно и в запечатанной упаковке, маркировка CE, производство DTS MG в Корее по ISO 13485.',
    },
  ]),
  benefits: JSON.stringify([
    'Работает точно там, куда его поставили: рубцы, морщины, небольшие участки',
    'Нажатия строго под 90°, без протягивания по коже',
    'Открывает путь ампуле, которую вы наносите',
    'Входит между волосами на коже головы',
    'Без проволоки и клея: ничего не выпадет',
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
      step: 'Штампование',
      instruction:
        'Поставьте головку плашмя на кожу, нажмите строго вниз с ровным давлением, поднимите и переставьте на ширину головки. Работайте ряд за рядом по всей зоне и никогда не протягивайте штамп по коже.',
    },
    {
      step: 'Завершение',
      instruction: 'Затем маска и Soothing Repair Postcream; днём обязательно солнцезащитное средство.',
    },
    {
      step: 'Утилизация',
      instruction:
        'Один штамп - одна процедура: после неё утилизируйте его. Не очищайте, не передавайте другим и не используйте повторно.',
    },
  ]),
  directions:
    'Только для профессионального применения обученным специалистом. Не использовать при аллергии на металл, склонности к келоидным рубцам, выраженном атопическом дерматите, розацеа, куперозе, псориазе, нарушениях свёртываемости крови, неконтролируемом диабете или тяжёлой гипертензии. Не применять на повреждённой, воспалённой или инфицированной коже и коже головы и не сочетать со средствами со спикулами. Длину игл, давление и интервал между процедурами специалист определяет индивидуально. Изделие стерильно и предназначено только для одного применения.',
} as const

export const PRODUCT_67_AR_TRANSLATION = {
  name: PRODUCT_67_AR_NAME,
  description: PRODUCT_67_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    type: 'ختم وخز دقيق للاستخدام مرة واحدة بنظام الإبر القرصية DTS',
    availableLengths: '0.25 / 0.5 / 1.0 / 1.5 / 2.0 مم',
    needleCount: '140 إبرة في كل ختم',
    construction: 'إبر مقطوعة من أقراص معدنية - بلا أسلاك ولا مواد لاصقة',
    application: 'الختم: اضغط مباشرة إلى الأسفل، ارفع، انتقل بعرض الرأس',
    treatmentAreas: 'ندبات حب الشباب، الخطوط، خط الابتسامة، المناطق الصغيرة، فروة الرأس',
    sterilization: 'معقم في عبوة محكمة الإغلاق',
    safety: 'للاستخدام مرة واحدة فقط؛ لا يُعاد استخدامه',
    certification: 'CE · ISO 13485',
    origin: 'صُنع في كوريا · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'مباشرة إلى الأسفل',
      description:
        'كل ضغطة تدخل بزاوية 90°. يرتفع الرأس وينتقل إلى الموضع التالي، من دون سحب أو شدّ جانبي للبشرة.',
    },
    {
      title: '140 إبرة قرصية',
      description:
        'كل صف من الإبر مقطوع من قرص معدني واحد. لا أسلاك ولا مواد لاصقة، فلا ينفصل شيء أثناء الجلسة.',
    },
    {
      title: 'في المكان تماماً',
      description:
        'ندبات حب الشباب والخطوط وخط الابتسامة والمناطق الصغيرة التي يمر عليها الرولر سريعاً: يعمل الختم حيث تضعه بالضبط.',
    },
    {
      title: 'خمسة أطوال',
      description:
        '0.25 و0.5 و1.0 و1.5 و2.0 مم، الأطوال الخمسة نفسها في رولر GENOSYS، ليختار المختص الختم المناسب للمنطقة والهدف.',
    },
    {
      title: 'مصمم لفروة الرأس',
      description:
        'صممت DTS الختم مع مراعاة فروة الرأس: يدخل بين الشعر، بينما يجرّه الرولر معه.',
    },
    {
      title: 'CE · ISO 13485',
      description: 'معقم ومحكم الإغلاق، يحمل علامة CE، ومن صنع DTS MG في كوريا وفق ISO 13485.',
    },
  ]),
  benefits: JSON.stringify([
    'يعمل حيث تضعه بالضبط: الندبات والخطوط والمناطق الصغيرة',
    'ضغطات مستقيمة بزاوية 90° من دون سحب على البشرة',
    'يفتح الطريق للأمبولة المستخدمة',
    'يدخل بين الشعر على فروة الرأس',
    'بلا أسلاك ولا مواد لاصقة: لا ينفصل شيء',
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
      step: 'الختم',
      instruction:
        'ضع الرأس مسطحاً على البشرة واضغط مباشرة إلى الأسفل بضغط متساوٍ، ثم ارفعه وانتقل بعرض الرأس. اعمل صفاً بعد صف على المنطقة كلها، ولا تسحب الختم على البشرة أبداً.',
    },
    {
      step: 'الإنهاء',
      instruction: 'يلي ذلك قناع العلاج ثم Soothing Repair Postcream، مع واقي الشمس خلال النهار.',
    },
    {
      step: 'التخلص من الختم',
      instruction: 'ختم واحد لجلسة واحدة: يُتخلص منه بعدها، ولا يُنظف ولا يُشارك ولا يُعاد استخدامه.',
    },
  ]),
  directions:
    'للاستخدام الاحترافي فقط بواسطة مختص مدرّب. لا يُستخدم في حالات الحساسية للمعادن، أو القابلية لتكوّن الجدرة، أو التهاب الجلد التأتبي الشديد، أو الوردية، أو توسع الشعيرات، أو الصدفية، أو اضطرابات تخثر الدم، أو السكري غير المنضبط، أو ارتفاع ضغط الدم الشديد. يُمنع استخدامه على البشرة أو فروة الرأس المجروحة أو الملتهبة أو المصابة بعدوى، ولا يُجمع مع منتجات الشويكات. يحدد المختص طول الإبر والضغط والفاصل بين الجلسات لكل حالة. المنتج معقم ومخصص لاستخدام واحد فقط.',
} as const
