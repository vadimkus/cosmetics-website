const FULL_INCI =
  'Aqua (Water), Glycerin, Methyl Trimethicone, Butylene Glycol, 1,2-Hexanediol, Niacinamide, Trehalose, Caprylic/Capric Triglyceride, Epilobium Angustifolium Flower/Leaf/Stem Extract, Lactobacillus Ferment Lysate, Ceramide NP, Oxygen, sh-Oligopeptide-1, sh-Polypeptide-1, sh-Polypeptide-16, sh-Polypeptide-4, sh-oligopeptide-2, sh-Polypeptide-11, Melissa Officinalis Extract, Ruscus Aculeatus Root Extract, Arnica Montana Flower Extract, Vitis Vinifera (Grape) Seed Extract, Bromelain, Cucurbita Pepo (Pumpkin) Fruit Extract, Panthenol, Phytosphingosine, Adenosine, Tocopherol, Hydrogenated Lecithin, Lecithin, Centella Asiatica Extract, Opuntia Ficus-Indica Stem Extract, Sasa Quelpaertensis Extract, Psidium Guajava Leaf Extract, Viola Odorata Leaf Extract, Gardenia Florida Fruit Extract, Hydrogenated Rapeseed Oil, Jojoba Esters, Helianthus Annuus (Sunflower) Seed Oil, Anthemis Nobilis Flower Oil, Macadamia Ternifolia Seed Oil, Ethylhexylglycerin, Myristic Acid, Palmitic Acid, Stearic Acid, Litsea Cubeba Fruit Oil, Cymbopogon Martini Oil, Cedrus Atlantica Bark Oil, Citrus Aurantium Amara (Bitter Orange) Flower Oil, Citrus Paradisi (Grapefruit) Peel Oil, Pogostemon Cablin Oil, Tromethamine, Xanthan Gum, Dextrin, Polysorbate 20, Disodium EDTA, Copaifera Officinalis (Balsam Copaiba) Resin, Sorbitan Isostearate, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Ammonium Acryloyldimethyltaurate/Beheneth-25 Methacrylate Crosspolymer, Citral, Geraniol, Limonene, Propanediol.'

export const product34Ru = {
  description:
    'Ночная крем-маска для кожи, которой не хватает комфорта, свежести и ухоженного сияния. Ниацинамид 2% помогает выровнять тон, аденозин 0,04% ухаживает за видимыми морщинами, а глицерин 6% и трегалоза 2% поддерживают увлажнение до утра. Наносите последним шагом один-два раза в неделю и не смывайте.',
  productDetails: JSON.stringify({
    form: 'Несмываемая ночная крем-маска',
    size: '100 г · 3,52 унции',
    purpose: 'Комфорт, увлажнение, более ровный тон и гладкий вид кожи',
    functionalPair: 'Ниацинамид 2% + аденозин 0,04%',
    hydration: 'Глицерин 6% + трегалоза 2%',
    texture: 'Крем с капсулами, которые растворяются при распределении',
    usage: 'Последний шаг вечером, один-два раза в неделю',
    testing: 'Дерматологически протестировано',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Ниацинамид 2%',
      description:
        'Функциональная концентрация для более ровного, свежего и сияющего вида кожи.',
    },
    {
      title: 'Аденозин 0,04%',
      description:
        'Дополняет ночной уход, помогая коже выглядеть более гладкой, а видимым морщинам — менее выраженными.',
    },
    {
      title: 'Увлажнение до утра',
      description:
        'Глицерин 6% и трегалоза 2% помогают удерживать влагу и поддерживают мягкость и комфорт кожи ночью.',
    },
    {
      title: 'Результаты за четыре недели',
      description:
        'В исследовании трансэпидермальная потеря влаги снизилась на 15%, а выраженность покраснения — на 26%.',
    },
  ]),
  benefits: JSON.stringify([
    'Возвращает уставшей коже ощущение комфорта и более свежий вид',
    'Поддерживает увлажнение и помогает уменьшить потерю влаги ночью',
    'Помогает сделать тон визуально более ровным и сияющим',
    'Ухаживает за видимыми морщинами и гладкостью кожи',
    'Несмываемая кремовая текстура завершает вечерний уход',
    'Дерматологически протестировано. Сделано в Корее',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Ниацинамид 2%',
      description:
        'Функциональный осветляющий компонент для более ровного тона и свежего сияния.',
    },
    {
      name: 'Аденозин 0,04%',
      description:
        'Функциональный компонент для ухода за видимыми морщинами и гладкостью кожи.',
    },
    {
      name: 'Глицерин 6% + трегалоза 2%',
      description:
        'Увлажняющая пара, которая помогает притягивать и удерживать влагу, поддерживая мягкость кожи до утра.',
    },
    {
      name: 'Метилтриметикон 6%',
      description:
        'Придаёт крему шелковистое распределение и комфортный завершающий финиш без необходимости смывать средство.',
    },
    {
      name: 'Полный состав (INCI)',
      description: FULL_INCI,
    },
  ]),
  howToUse: JSON.stringify([
    {
      step: 'Подготовьте кожу',
      instruction: 'Завершите очищение, тоник и сыворотку. Маска наносится последним шагом.',
    },
    {
      step: 'Нанесите',
      instruction: 'Распределите достаточное количество по лицу, не затрагивая область вокруг глаз.',
    },
    {
      step: 'Мягко помассируйте',
      instruction: 'Лёгкими движениями распределяйте средство, пока капсулы полностью не растворятся в креме.',
    },
    {
      step: 'Оставьте на ночь',
      instruction: 'Не смывайте. Утром очистите кожу как обычно.',
    },
  ]),
  directions:
    'Используйте один-два раза в неделю. Только для наружного применения. Не наносите на повреждённую кожу и область вокруг глаз. При попадании в глаза тщательно промойте прохладной водой. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении. Храните в прохладном сухом месте, вдали от прямого солнца и детей.',
} as const

export const product34Ar = {
  description:
    'قناع كريمي ليلي يمنح البشرة المتعبة مزيداً من الراحة والترطيب والإشراق المتوازن. يساعد النياسيناميد بتركيز 2% على تحسين مظهر تجانس اللون، ويعتني الأدينوزين بتركيز 0.04% بمظهر التجاعيد، بينما يدعم الغليسرين 6% والتريهالوز 2% ترطيب البشرة حتى الصباح. يستخدم كخطوة أخيرة مرة أو مرتين أسبوعياً ولا يُشطف.',
  productDetails: JSON.stringify({
    form: 'قناع كريمي ليلي يترك على البشرة',
    size: '100 غ · 3.52 أونصة',
    purpose: 'راحة وترطيب ومظهر أكثر تجانساً ونعومة',
    functionalPair: 'نياسيناميد 2% + أدينوزين 0.04%',
    hydration: 'غليسرين 6% + تريهالوز 2%',
    texture: 'كريم بكبسولات تذوب أثناء التوزيع',
    usage: 'الخطوة الأخيرة مساءً، مرة أو مرتين أسبوعياً',
    testing: 'مختبر جلدياً',
    origin: 'صنع في كوريا لدى DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'نياسيناميد 2%',
      description:
        'تركيز وظيفي يساعد البشرة على الظهور بلون أكثر تجانساً ونضارة وإشراقاً.',
    },
    {
      title: 'أدينوزين 0.04%',
      description:
        'يكمل العناية الليلية بمظهر التجاعيد ويساعد البشرة على الظهور بمظهر أكثر نعومة.',
    },
    {
      title: 'ترطيب يستمر حتى الصباح',
      description:
        'يساعد الغليسرين 6% والتريهالوز 2% على الاحتفاظ بالرطوبة ودعم نعومة البشرة وراحتها طوال الليل.',
    },
    {
      title: 'نتائج خلال أربعة أسابيع',
      description:
        'أظهر التقييم انخفاض فقدان الماء عبر البشرة بنسبة 15% وتحسن مظهر الاحمرار بنسبة 26%.',
    },
  ]),
  benefits: JSON.stringify([
    'يمنح البشرة المتعبة شعوراً بالراحة ومظهراً أكثر نضارة',
    'يدعم الترطيب ويساعد على تقليل فقدان الماء أثناء الليل',
    'يساعد على تحسين مظهر تجانس اللون والإشراق',
    'يعتني بمظهر التجاعيد ونعومة البشرة',
    'قوام كريمي يترك على البشرة ليكمل الروتين المسائي',
    'مختبر جلدياً وصنع في كوريا',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'نياسيناميد 2%',
      description:
        'مكوّن وظيفي للإشراق يساعد على تحسين مظهر تجانس اللون والنضارة.',
    },
    {
      name: 'أدينوزين 0.04%',
      description:
        'مكوّن وظيفي للعناية بمظهر التجاعيد ودعم مظهر أكثر نعومة للبشرة.',
    },
    {
      name: 'غليسرين 6% + تريهالوز 2%',
      description:
        'ثنائي مرطب يساعد على جذب الماء والاحتفاظ به، لتبقى البشرة ناعمة ومريحة حتى الصباح.',
    },
    {
      name: 'ميثيل تريميثيكون 6%',
      description:
        'يمنح الكريم انسيابية حريرية وطبقة نهائية مريحة لا تحتاج إلى الشطف.',
    },
    {
      name: 'القائمة الكاملة للمكوّنات (INCI)',
      description: FULL_INCI,
    },
  ]),
  howToUse: JSON.stringify([
    {
      step: 'تحضير البشرة',
      instruction: 'يستكمل التنظيف والتونر والسيروم أولاً، ثم يوضع القناع كخطوة أخيرة.',
    },
    {
      step: 'التطبيق',
      instruction: 'توزع كمية كافية على الوجه مع تجنب محيط العينين.',
    },
    {
      step: 'التدليك بلطف',
      instruction: 'يوزع المستحضر بحركات لطيفة حتى تذوب الكبسولات تماماً في الكريم.',
    },
    {
      step: 'الترك طوال الليل',
      instruction: 'لا يُشطف، وتنظف البشرة كالمعتاد في الصباح.',
    },
  ]),
  directions:
    'يستخدم مرة أو مرتين أسبوعياً. للاستخدام الخارجي فقط. لا يوضع على بشرة متضررة أو حول العينين. عند ملامسة العينين، يجب الشطف جيداً بالماء البارد. يوقف الاستخدام وتطلب المشورة الطبية عند ظهور احمرار أو تورم أو تهيج. يحفظ في مكان بارد وجاف بعيداً عن الشمس المباشرة ومتناول الأطفال.',
} as const
