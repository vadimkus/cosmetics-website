/**
 * Copy for SKIN CARING BLEMISH BALM CUSHION (product 41), in the three
 * languages the site ships.
 *
 * Every figure here is read from the Intertek dossier, not from the old site
 * copy or the DTS MG deck. See
 * docs/SESSION_CHANGES_2026-08-16_PRODUCT_41_BB_CUSHION_DOSSIER_AUDIT.md.
 *
 * The distinctive fact: Korea licenses this one product for three functions at
 * once — UV protection, whitening and wrinkle improvement. Nothing else in the
 * range carries all three.
 *
 * Deliberately absent, and they must stay absent:
 *   - "more than 60% moisture essence". The named ingredients sum to ~73.6%,
 *     which puts water at roughly a quarter.
 *   - Volufiline as a volumiser. The Anemarrhena extract is at 40 ppb.
 *   - the nine peptides as an engine. They run 640 ppb down to 10 ppb, so the
 *     count can be stated and no claim can hang off it.
 *   - a sixth UV filter. Butyloctyl Salicylate is a solvent on all three
 *     shade sheets.
 */

export type Locale = 'en' | 'ar' | 'ru'

export interface ShadeCopy {
  /** #01, #02, #03 as printed. */
  code: string
  name: string
  tone: string
  undertone: string
  /** Total iron oxide load, for the "only the pigment changes" section. */
  pigment: string
}

export interface FeatureCopy {
  title: string
  body: string
}

export interface BbCushionCopy {
  eyebrow: string
  headline: string
  lead: string

  /** The four figures under the hero. */
  facts: { value: string; label: string }[]

  licenceEyebrow: string
  licenceTitle: string
  licenceLead: string
  licences: FeatureCopy[]

  filtersEyebrow: string
  filtersTitle: string
  filtersLead: string
  filters: { name: string; percent: string; kind: string }[]
  filtersNote: string

  shadesEyebrow: string
  shadesTitle: string
  shadesLead: string
  shades: ShadeCopy[]
  shadesNote: string

  puffEyebrow: string
  puffTitle: string
  puffLead: string
  puffPoints: FeatureCopy[]

  howEyebrow: string
  howTitle: string
  howSteps: FeatureCopy[]

  inciTitle: string
  inciNote: string

  cautionTitle: string
  cautions: string[]
}

const EN: BbCushionCopy = {
  eyebrow: 'Cushion · Three licences',
  headline: 'Coverage, sun and skincare in one press.',
  lead:
    'Korea licenses this one cushion for three things at once: protection from UV, help with tone, and help with wrinkles. ' +
    'Most base makeup is licensed for none of them.',

  facts: [
    { value: 'SPF50+', label: 'PA++++, on five filters' },
    { value: '2%', label: 'Niacinamide, for tone' },
    { value: '0.04%', label: 'Adenosine, for wrinkles' },
    { value: '15 g × 2', label: 'Cushion and refill in the box' },
  ],

  licenceEyebrow: 'What Korea granted',
  licenceTitle: 'Three functions, one compact.',
  licenceLead:
    'The Korean panel registers it as a triple-function cosmetic and names the actives it granted each function on. ' +
    'That is a regulatory status, not a marketing line.',
  licences: [
    {
      title: 'Protection from UV',
      body: 'SPF50+ PA++++, carried by five filters: titanium dioxide and zinc oxide on the mineral side, ethylhexyl methoxycinnamate, ethylhexyl salicylate and octocrylene on the chemical side.',
    },
    {
      title: 'Help with tone',
      body: 'Niacinamide at a full 2%, the standard Korean whitening dose and the same level as the Multi Vita serum and cream.',
    },
    {
      title: 'Help with wrinkles',
      body: 'Adenosine at 0.04%, the dose Korea licenses wrinkle-improvement claims on across the range.',
    },
  ],

  filtersEyebrow: 'The sun protection',
  filtersTitle: 'Five filters, hybrid by design.',
  filtersLead:
    'Two mineral filters sit on the skin and scatter light; three chemical filters absorb it. Running both is why a base this light reaches the top of the scale.',
  filters: [
    { name: 'Titanium Dioxide', percent: '9.00%', kind: 'Mineral' },
    { name: 'Ethylhexyl Methoxycinnamate', percent: '7.00%', kind: 'Chemical' },
    { name: 'Ethylhexyl Salicylate', percent: '4.50%', kind: 'Chemical' },
    { name: 'Octocrylene', percent: '2.00%', kind: 'Chemical' },
    { name: 'Zinc Oxide', percent: '2.00%', kind: 'Mineral' },
  ],
  filtersNote:
    'Butyloctyl salicylate sits at 6% and looks like a sixth filter. It is not one: the formula sheets function it as a solvent that keeps the other five dissolved.',

  shadesEyebrow: 'Three shades',
  shadesTitle: 'Only the colour changes.',
  shadesLead:
    'The sun protection and the skincare are identical in all three. The formulas differ by their iron oxides and nothing else, so no shade protects or treats better than another.',
  shades: [
    { code: '#01', name: 'Ivory', tone: 'Fair skin', undertone: 'Cool undertones', pigment: '0.89% pigment' },
    { code: '#02', name: 'Beige', tone: 'Light to medium', undertone: 'Neutral undertones', pigment: '1.78% pigment' },
    { code: '#03', name: 'Camel', tone: 'Tan to warm', undertone: 'Warm undertones', pigment: '3.06% pigment' },
  ],
  shadesNote: 'Beige carries exactly twice Ivory’s pigment, and Camel about three and a half times.',

  puffEyebrow: 'The puff',
  puffTitle: 'Four layers, not three.',
  puffLead: 'The applicator is engineered, which is unusual enough to be worth saying.',
  puffPoints: [
    {
      title: 'Waterdrop tip',
      body: 'Pointed rather than round, so it reaches the curve beside the nose and the inner corner of the eye without folding.',
    },
    {
      title: 'A fourth waterproof layer',
      body: 'An ordinary cushion puff has three layers and soaks up product. This one adds a waterproof film, so the formula stays in the cushion instead of in the sponge.',
    },
  ],

  howEyebrow: 'How to use',
  howTitle: 'Press, then pat.',
  howSteps: [
    { title: 'Press', body: 'Press the puff lightly onto the cushion. Lightly: it holds more than it looks.' },
    { title: 'Pat', body: 'Pat evenly onto skin rather than sweeping, which is what keeps the coverage even.' },
    { title: 'Build', body: 'Go back over anywhere you want more. Coverage is buildable, so a second pass costs nothing.' },
    { title: 'Refill', body: 'When it runs out, push the used refill up from underneath and click the new one in. The box already contains one.' },
  ],

  inciTitle: 'Full ingredient list (INCI)',
  inciNote: 'Every ingredient, in the same order as the box in your hand.',

  cautionTitle: 'Before you use it',
  cautions: [
    'For external use only. Avoid the eyes and mucous membranes, and rinse with cool water on contact.',
    'Stop and ask a doctor if redness, swelling or irritation appears.',
    'See a specialist if red spots, swelling or itching appear on the applied area after sun exposure.',
    'Avoid broken skin.',
  ],
}

const AR: BbCushionCopy = {
  eyebrow: 'كوشن · ثلاث رخص',
  headline: 'تغطية وحماية وعناية بضغطة واحدة.',
  lead:
    'ترخّص كوريا هذا الكوشن لثلاث وظائف معاً: الحماية من الأشعة، والمساعدة على توحيد اللون، والمساعدة على تحسين التجاعيد. ' +
    'ومعظم مستحضرات الأساس لا تُرخَّص لأيٍّ منها.',

  facts: [
    { value: 'SPF50+', label: 'PA++++ بخمسة فلاتر' },
    { value: '2%', label: 'نياسيناميد للون البشرة' },
    { value: '0.04%', label: 'أدينوزين للتجاعيد' },
    { value: '15 غ × 2', label: 'كوشن وعبوة احتياطية' },
  ],

  licenceEyebrow: 'ما منحته كوريا',
  licenceTitle: 'ثلاث وظائف في علبة واحدة.',
  licenceLead:
    'اللوحة الكورية تسجّله كمستحضر وظيفي ثلاثي، وتسمّي الفعّالات التي مُنحت كل وظيفة عليها. وهذه صفة تنظيمية لا عبارة تسويقية.',
  licences: [
    {
      title: 'الحماية من الأشعة',
      body: 'SPF50+ PA++++ بخمسة فلاتر: ثاني أكسيد التيتانيوم وأكسيد الزنك معدنياً، وإيثيل هكسيل ميثوكسي سيناميت وإيثيل هكسيل ساليسيلات وأوكتوكريلين كيميائياً.',
    },
    {
      title: 'المساعدة على توحيد اللون',
      body: 'نياسيناميد بنسبة 2% كاملة، وهي الجرعة الكورية المعيارية للتفتيح ونفس مستوى سيروم وكريم مالتي فيتا.',
    },
    {
      title: 'المساعدة على التجاعيد',
      body: 'أدينوزين بنسبة 0.04%، وهي الجرعة التي ترخّص عليها كوريا ادعاءات تحسين التجاعيد في كل المجموعة.',
    },
  ],

  filtersEyebrow: 'الحماية من الشمس',
  filtersTitle: 'خمسة فلاتر، هجينة بالتصميم.',
  filtersLead:
    'فلتران معدنيان يجلسان على البشرة ويشتّتان الضوء، وثلاثة فلاتر كيميائية تمتصّه. والجمع بينهما هو سبب وصول قاعدة بهذه الخفّة إلى أعلى المقياس.',
  filters: [
    { name: 'Titanium Dioxide', percent: '9.00%', kind: 'معدني' },
    { name: 'Ethylhexyl Methoxycinnamate', percent: '7.00%', kind: 'كيميائي' },
    { name: 'Ethylhexyl Salicylate', percent: '4.50%', kind: 'كيميائي' },
    { name: 'Octocrylene', percent: '2.00%', kind: 'كيميائي' },
    { name: 'Zinc Oxide', percent: '2.00%', kind: 'معدني' },
  ],
  filtersNote:
    'بيوتيل أوكتيل ساليسيلات بنسبة 6% يبدو كفلتر سادس، لكنه ليس كذلك: أوراق التركيبة تصنّفه مذيباً يبقي الفلاتر الخمسة ذائبة.',

  shadesEyebrow: 'ثلاث درجات',
  shadesTitle: 'اللون وحده هو ما يتغيّر.',
  shadesLead:
    'الحماية من الشمس والعناية متطابقتان في الدرجات الثلاث. الفرق بين التركيبات هو أكاسيد الحديد فقط، فلا درجة تحمي أو تعالج أفضل من أخرى.',
  shades: [
    { code: '٠١', name: 'Ivory', tone: 'بشرة فاتحة', undertone: 'درجات باردة', pigment: 'صبغة 0.89%' },
    { code: '٠٢', name: 'Beige', tone: 'فاتحة إلى متوسطة', undertone: 'درجات محايدة', pigment: 'صبغة 1.78%' },
    { code: '٠٣', name: 'Camel', tone: 'قمحية إلى دافئة', undertone: 'درجات دافئة', pigment: 'صبغة 3.06%' },
  ],
  shadesNote: 'بيج يحمل ضعف صبغة آيفوري تماماً، وكاميل نحو ثلاثة أضعاف ونصف.',

  puffEyebrow: 'الإسفنجة',
  puffTitle: 'أربع طبقات لا ثلاث.',
  puffLead: 'الإسفنجة نفسها مصمّمة هندسياً، وهذا نادر بما يكفي ليُقال.',
  puffPoints: [
    {
      title: 'طرف على شكل قطرة',
      body: 'مدبّب لا دائري، فيصل إلى الانحناء بجانب الأنف وإلى الزاوية الداخلية للعين من دون أن ينثني.',
    },
    {
      title: 'طبقة رابعة مقاومة للماء',
      body: 'إسفنجة الكوشن العادية ثلاث طبقات وتمتصّ المنتج. هذه تضيف طبقة مقاومة للماء، فتبقى التركيبة في الكوشن لا في الإسفنجة.',
    },
  ],

  howEyebrow: 'طريقة الاستخدام',
  howTitle: 'اضغطي ثم ربّتي.',
  howSteps: [
    { title: 'اضغطي', body: 'اضغطي الإسفنجة برفق على الكوشن. برفق: فهي تحمل أكثر مما تبدو.' },
    { title: 'ربّتي', body: 'ربّتي بالتساوي على البشرة بدل السحب، وهذا ما يبقي التغطية متجانسة.' },
    { title: 'كثّفي', body: 'أعيدي المرور على ما تريدين تغطيته أكثر. التغطية قابلة للبناء، والمرور الثاني لا يكلّف شيئاً.' },
    { title: 'استبدلي', body: 'عند النفاد ادفعي العبوة المستعملة من الأسفل وثبّتي الجديدة حتى تسمعي صوت التثبيت. العلبة تحوي واحدة أصلاً.' },
  ],

  inciTitle: 'قائمة المكوّنات الكاملة (INCI)',
  inciNote: 'كل مكوّن، بالترتيب نفسه الذي على العلبة بين يديك.',

  cautionTitle: 'قبل الاستخدام',
  cautions: [
    'للاستعمال الخارجي فقط. تجنّبي العينين والأغشية المخاطية، واشطفي بالماء البارد عند الملامسة.',
    'أوقفي الاستخدام واستشيري طبيباً عند ظهور احمرار أو تورّم أو تهيّج.',
    'استشيري مختصاً إذا ظهرت بقع حمراء أو تورّم أو حكة على موضع الاستخدام بعد التعرّض للشمس.',
    'تجنّبي المناطق المجروحة.',
  ],
}

const RU: BbCushionCopy = {
  eyebrow: 'Кушон · Три лицензии',
  headline: 'Покрытие, защита и уход за одно нажатие.',
  lead:
    'Корея лицензирует этот кушон сразу для трёх задач: защита от УФ, помощь тону и помощь с морщинами. ' +
    'Большинство тональных средств не лицензировано ни для одной из них.',

  facts: [
    { value: 'SPF50+', label: 'PA++++ на пяти фильтрах' },
    { value: '2%', label: 'Ниацинамид, для тона' },
    { value: '0,04%', label: 'Аденозин, для морщин' },
    { value: '15 г × 2', label: 'Кушон и сменный блок' },
  ],

  licenceEyebrow: 'Что выдала Корея',
  licenceTitle: 'Три функции в одной пудренице.',
  licenceLead:
    'Корейская панель регистрирует его как функциональное средство тройного действия и называет активы, на которые выдана каждая функция. Это регуляторный статус, а не маркетинг.',
  licences: [
    {
      title: 'Защита от УФ',
      body: 'SPF50+ PA++++ на пяти фильтрах: диоксид титана и оксид цинка с минеральной стороны, этилгексилметоксициннамат, этилгексилсалицилат и октокрилен с химической.',
    },
    {
      title: 'Помощь тону',
      body: 'Ниацинамид на полных 2% — стандартная корейская осветляющая доза и тот же уровень, что в сыворотке и креме Multi Vita.',
    },
    {
      title: 'Помощь с морщинами',
      body: 'Аденозин 0,04% — доза, на которой Корея лицензирует заявления о коррекции морщин по всей линейке.',
    },
  ],

  filtersEyebrow: 'Защита от солнца',
  filtersTitle: 'Пять фильтров, гибрид по замыслу.',
  filtersLead:
    'Два минеральных фильтра лежат на коже и рассеивают свет, три химических его поглощают. Именно сочетание позволяет такой лёгкой базе дойти до верха шкалы.',
  filters: [
    { name: 'Titanium Dioxide', percent: '9,00%', kind: 'Минеральный' },
    { name: 'Ethylhexyl Methoxycinnamate', percent: '7,00%', kind: 'Химический' },
    { name: 'Ethylhexyl Salicylate', percent: '4,50%', kind: 'Химический' },
    { name: 'Octocrylene', percent: '2,00%', kind: 'Химический' },
    { name: 'Zinc Oxide', percent: '2,00%', kind: 'Минеральный' },
  ],
  filtersNote:
    'Бутилоктилсалицилат стоит на 6% и выглядит шестым фильтром. Это не так: во всех листах формулы он проходит как растворитель, удерживающий остальные пять в растворе.',

  shadesEyebrow: 'Три оттенка',
  shadesTitle: 'Меняется только цвет.',
  shadesLead:
    'Защита от солнца и уход одинаковы во всех трёх. Формулы отличаются только оксидами железа, поэтому ни один оттенок не защищает и не ухаживает лучше другого.',
  shades: [
    { code: '#01', name: 'Ivory', tone: 'Светлая кожа', undertone: 'Холодный подтон', pigment: 'пигмент 0,89%' },
    { code: '#02', name: 'Beige', tone: 'Светлая и средняя', undertone: 'Нейтральный подтон', pigment: 'пигмент 1,78%' },
    { code: '#03', name: 'Camel', tone: 'Смуглая и тёплая', undertone: 'Тёплый подтон', pigment: 'пигмент 3,06%' },
  ],
  shadesNote: 'В Beige ровно вдвое больше пигмента, чем в Ivory, в Camel — примерно в три с половиной раза.',

  puffEyebrow: 'Спонж',
  puffTitle: 'Четыре слоя, а не три.',
  puffLead: 'Сам аппликатор спроектирован, и это достаточно редко, чтобы сказать об этом.',
  puffPoints: [
    {
      title: 'Кончик-капля',
      body: 'Заострённый, а не круглый, поэтому достаёт до изгиба у носа и внутреннего уголка глаза, не сминаясь.',
    },
    {
      title: 'Четвёртый водонепроницаемый слой',
      body: 'Обычный спонж для кушона имеет три слоя и впитывает средство. Здесь добавлена водонепроницаемая плёнка, и формула остаётся в кушоне, а не в губке.',
    },
  ],

  howEyebrow: 'Как пользоваться',
  howTitle: 'Нажать, потом похлопать.',
  howSteps: [
    { title: 'Нажмите', body: 'Слегка прижмите спонж к подушечке. Слегка: он набирает больше, чем кажется.' },
    { title: 'Похлопайте', body: 'Наносите похлопыванием, а не растиранием — именно это держит покрытие ровным.' },
    { title: 'Добавьте', body: 'Пройдите ещё раз там, где нужно плотнее. Покрытие наращиваемое, второй проход ничего не стоит.' },
    { title: 'Замените', body: 'Когда закончится, вытолкните использованный блок снизу и вставьте новый до щелчка. Один уже лежит в коробке.' },
  ],

  inciTitle: 'Полный список ингредиентов (INCI)',
  inciNote: 'Каждый ингредиент, в том же порядке, что и на коробке у вас в руках.',

  cautionTitle: 'Перед применением',
  cautions: [
    'Только для наружного применения. Избегайте глаз и слизистых, при попадании промойте прохладной водой.',
    'Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении.',
    'Обратитесь к специалисту, если после солнца на обработанном участке появились красные пятна, отёк или зуд.',
    'Не наносите на повреждённую кожу.',
  ],
}

export const BB_CUSHION_COPY: Record<Locale, BbCushionCopy> = { en: EN, ar: AR, ru: RU }
