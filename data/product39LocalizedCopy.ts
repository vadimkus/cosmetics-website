export const PRODUCT_39_RU_NAME =
  'Солнцезащитный крем ULTRA SHIELD SPF 50+ PA++++'
export const PRODUCT_39_AR_NAME =
  'كريم ULTRA SHIELD للحماية من الشمس SPF 50+ PA++++'

export const PRODUCT_39_RU_DESCRIPTION =
  'Солнцезащитный крем с подтверждённой широкоспектральной защитой: SPF 65,9 измерен in vivo, а UVA-PF составил 23,13 и 24,3. На упаковке указано SPF 50+ PA++++. Шесть УФ-фильтров занимают 17,10% формулы; уход дополняют ниацинамид 2% и аденозин 0,04%. Формула не содержит оксибензон и октиноксат. Водостойкость не заявлена. 50 г.'

export const PRODUCT_39_AR_DESCRIPTION =
  'كريم واقٍ من الشمس بحماية واسعة الطيف موثقة: بلغ عامل الحماية SPF المقاس على البشرة 65.9، وسجل عامل الحماية من UVA نتيجتي 23.13 و24.3. تحمل العبوة تصنيف SPF 50+ PA++++. تشكل ستة مرشحات للأشعة فوق البنفسجية 17.10% من التركيبة، ويكملها النياسيناميد 2% والأدينوزين 0.04%. لا تحتوي التركيبة على الأوكسي بنزون أو الأوكتينوكسات، ولا تدّعي مقاومة الماء. 50 غ.'

const FULL_INCI =
  'Aqua (Water), Butyloctyl Salicylate, Homosalate, Ethylhexyl Salicylate, Terephthalylidene Dicamphor Sulfonic Acid, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Diisopropyl Sebacate, Ethylhexyl Triazone, Dimethicone, Niacinamide, Propanediol, Titanium Dioxide, Tromethamine, Glyceryl Stearate, Hydrogenated Poly(C6-14 Olefin), 1,2-Hexanediol, Caprylic/Capric/Myristic/Stearic Triglyceride, Lithospermum Erythrorhizon Root Extract, Scutellaria Baicalensis Root Extract, Ceramide NP, Hydrolyzed Sodium Hyaluronate, Lactobacillus Ferment Lysate, Ananas Sativus (Pineapple) Fruit Extract, Carica Papaya (Papaya) Fruit Extract, Litchi Chinensis Fruit Extract, Psidium Guajava Fruit Extract, Adenosine, Tocopherol, Glycerin, Jojoba Esters, Glucose, Hydrogenated Lecithin, Ethylhexylglycerin, Xanthan Gum, Methyl Trimethicone, Stearic Acid, Polyhydroxystearic Acid, Arachidyl Glucoside, Aluminum Hydroxide, Potassium Cetyl Phosphate, Polyurethane-15, Vinyl Dimethicone/Methicone Silsesquioxane Crosspolymer, Ammonium Acryloyldimethyltaurate/VP Copolymer, Polyacrylate Crosspolymer-6, Dimethicone/Vinyl Dimethicone Crosspolymer, Arachidyl Alcohol, Cetearyl Alcohol, Behenyl Alcohol, Dimethiconol, t-Butyl Alcohol, Butylene Glycol, Polymethylsilsesquioxane, C9-12 Alkane, C13-14 Alkane, Polyglyceryl-10 Laurate, PEG-100 Stearate, Parfum'

export const PRODUCT_39_RU_TRANSLATION = {
  name: PRODUCT_39_RU_NAME,
  description: PRODUCT_39_RU_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'Несмываемый солнцезащитный крем для лица, шеи и тела',
    size: '50 г · 1,76 унции',
    grade: 'SPF 50+ PA++++',
    measuredProtection: 'SPF 65,9 in vivo · UVA-PF 23,13 и 24,3',
    filterSystem: 'Шесть УФ-фильтров · 17,10% формулы',
    functionalActives: 'Ниацинамид 2% · аденозин 0,04%',
    application: 'Наносить обильно и равномерно минимум за 15 минут до выхода',
    reapplication: 'Обновлять не реже чем каждые два часа на улице',
    waterResistance: 'Не заявлена; после воды, пота или полотенца нанести заново',
    ph: 'Измеренный pH 7,23 · спецификация 7,20 ± 1,00',
    testing: 'Дерматологически протестировано · оценка безопасности ЕС',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'SPF 65,9, измеренный in vivo',
      description:
        'Защита измерена непосредственно на коже; потребительская маркировка соответствует категории SPF 50+.',
    },
    {
      title: 'UVA-PF 23,13–24,3',
      description:
        'Два результата превышают порог 22,0, равный одной трети измеренного SPF 65,9.',
    },
    {
      title: 'Шесть фильтров · 17,10%',
      description:
        'Пять органических фильтров и диоксид титана создают широкоспектральную защиту от UVA и UVB.',
    },
    {
      title: 'Ниацинамид 2% + аденозин 0,04%',
      description:
        'Функциональная пара для ухода за неровным тоном и видимыми морщинами.',
    },
  ]),
  benefits: JSON.stringify([
    'Подтверждённая защита: SPF 65,9 in vivo и UVA-PF 23,13–24,3',
    'Широкоспектральная система из шести УФ-фильтров общей концентрацией 17,10%',
    'Ниацинамид 2% помогает сделать тон визуально более ровным',
    'Аденозин 0,04% ухаживает за видимыми морщинами',
    'Без оксибензона и октиноксата',
    'Шелковистая кремовая текстура для ежедневного нанесения',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Шесть УФ-фильтров · 17,10%',
      description:
        'Homosalate 4,00%, Ethylhexyl Salicylate 3,50%, Terephthalylidene Dicamphor Sulfonic Acid 3,069%, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine 3,00%, Ethylhexyl Triazone 2,00% и Titanium Dioxide 1,533%.',
    },
    {
      name: 'Ниацинамид · 2,00%',
      description:
        'Функциональный компонент для ухода за неровным тоном и более сияющим видом кожи.',
    },
    {
      name: 'Аденозин · 0,04%',
      description:
        'Функциональный компонент для ухода за видимыми морщинами и гладкостью кожи.',
    },
    {
      name: 'Butyloctyl Salicylate · 5,00%',
      description:
        'Растворитель и фотостабилизатор системы. Поддерживает работу фильтров, но сам не является УФ-фильтром.',
    },
    {
      name: 'Полный состав (INCI)',
      description: FULL_INCI,
    },
  ]),
  howToUse: JSON.stringify([
    {
      step: 'Завершите утренний уход',
      instruction:
        'Наносите после крема и до макияжа как последний этап ухода за кожей.',
    },
    {
      step: 'Нанесите заранее',
      instruction:
        'Равномерно распределите достаточное количество по открытым участкам минимум за 15 минут до выхода.',
    },
    {
      step: 'Обновляйте на улице',
      instruction:
        'Повторяйте нанесение не реже чем каждые два часа, пока находитесь на открытом воздухе.',
    },
    {
      step: 'После воды нанесите заново',
      instruction:
        'Водостойкость не заявлена. После плавания, сильного потоотделения или вытирания полотенцем нанесите средство снова.',
    },
  ]),
  directions:
    'Для наружного применения. Избегайте глаз и слизистых оболочек; при попадании тщательно промойте прохладной водой. Не наносите на повреждённую кожу. При покраснении, отёке или раздражении прекратите использование и обратитесь к врачу. Даже с солнцезащитным средством не оставайтесь на солнце слишком долго. Содержит отдушку 0,5%. Храните в прохладном сухом месте, вдали от прямого солнца и детей.',
} as const

export const PRODUCT_39_AR_TRANSLATION = {
  name: PRODUCT_39_AR_NAME,
  description: PRODUCT_39_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'كريم واقٍ من الشمس يترك على الوجه والرقبة والجسم',
    size: '50 غ · 1.76 أونصة',
    grade: 'SPF 50+ PA++++',
    measuredProtection: 'SPF 65.9 مقاس على البشرة · UVA-PF 23.13 و24.3',
    filterSystem: 'ستة مرشحات للأشعة فوق البنفسجية · 17.10% من التركيبة',
    functionalActives: 'نياسيناميد 2% · أدينوزين 0.04%',
    application: 'يوزع بسخاء وبالتساوي قبل الخروج بـ15 دقيقة على الأقل',
    reapplication: 'يجدد كل ساعتين على الأقل أثناء البقاء في الخارج',
    waterResistance: 'غير مدّعاة؛ يجدد بعد الماء أو التعرق أو التجفيف بالمنشفة',
    ph: 'الأس الهيدروجيني المقاس 7.23 · المواصفة 7.20 ± 1.00',
    testing: 'مختبر جلدياً · خضع لتقييم سلامة أوروبي',
    origin: 'صنع في كوريا لدى DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'SPF 65.9 مقاس على البشرة',
      description:
        'قيس مستوى الحماية مباشرة على البشرة، وتحمل العبوة التصنيف المعتمد SPF 50+.',
    },
    {
      title: 'UVA-PF من 23.13 إلى 24.3',
      description:
        'تتجاوز النتيجتان عتبة 22.0، وهي ثلث عامل الحماية المقاس 65.9.',
    },
    {
      title: 'ستة مرشحات · 17.10%',
      description:
        'خمسة مرشحات عضوية وثاني أكسيد التيتانيوم لحماية واسعة الطيف من UVA وUVB.',
    },
    {
      title: 'نياسيناميد 2% + أدينوزين 0.04%',
      description:
        'ثنائي وظيفي للعناية بمظهر تفاوت اللون والتجاعيد الظاهرة.',
    },
  ]),
  benefits: JSON.stringify([
    'حماية موثقة: SPF 65.9 مقاس على البشرة وUVA-PF بين 23.13 و24.3',
    'نظام واسع الطيف من ستة مرشحات بتركيز إجمالي 17.10%',
    'يساعد النياسيناميد 2% على تحسين مظهر تجانس اللون',
    'يعتني الأدينوزين 0.04% بمظهر التجاعيد',
    'من دون أوكسي بنزون أو أوكتينوكسات',
    'قوام كريمي حريري مناسب للاستخدام اليومي',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'ستة مرشحات للأشعة فوق البنفسجية · 17.10%',
      description:
        'Homosalate 4.00%، Ethylhexyl Salicylate 3.50%، Terephthalylidene Dicamphor Sulfonic Acid 3.069%، Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine 3.00%، Ethylhexyl Triazone 2.00%، وTitanium Dioxide 1.533%.',
    },
    {
      name: 'النياسيناميد · 2.00%',
      description:
        'مكوّن وظيفي للعناية بمظهر تفاوت اللون ومنح البشرة إشراقة أكثر تجانساً.',
    },
    {
      name: 'الأدينوزين · 0.04%',
      description:
        'مكوّن وظيفي للعناية بمظهر التجاعيد ودعم مظهر أكثر نعومة.',
    },
    {
      name: 'Butyloctyl Salicylate · 5.00%',
      description:
        'مذيب ومثبت ضوئي يدعم منظومة المرشحات، لكنه ليس مرشحاً للأشعة فوق البنفسجية.',
    },
    {
      name: 'قائمة المكوّنات الكاملة (INCI)',
      description: FULL_INCI,
    },
  ]),
  howToUse: JSON.stringify([
    {
      step: 'استكمال الروتين الصباحي',
      instruction:
        'يستخدم بعد الكريم وقبل المكياج بوصفه آخر خطوة في العناية بالبشرة.',
    },
    {
      step: 'التطبيق قبل الخروج',
      instruction:
        'توزع كمية كافية بالتساوي على المناطق المكشوفة قبل الخروج بـ15 دقيقة على الأقل.',
    },
    {
      step: 'التجديد في الخارج',
      instruction:
        'يجدد التطبيق كل ساعتين على الأقل طوال فترة البقاء في الهواء الطلق.',
    },
    {
      step: 'التجديد بعد الماء',
      instruction:
        'لا تدّعي التركيبة مقاومة الماء. يجدد التطبيق بعد السباحة أو التعرق الشديد أو التجفيف بالمنشفة.',
    },
  ]),
  directions:
    'للاستعمال الخارجي فقط. يجب تجنب العينين والأغشية المخاطية والشطف جيداً بالماء البارد عند الملامسة. لا يستخدم على بشرة متضررة. عند ظهور احمرار أو تورم أو تهيج، يوقف الاستخدام وتطلب المشورة الطبية. لا ينبغي البقاء طويلاً تحت الشمس حتى مع استخدام الواقي. يحتوي على عطر بنسبة 0.5%. يحفظ في مكان بارد وجاف بعيداً عن الشمس المباشرة ومتناول الأطفال.',
} as const
