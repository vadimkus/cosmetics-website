const product30FullInci =
  'Aqua (Water), Dipropylene Glycol, 1,2-Hexanediol, Trehalose, Zinc PCA, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Sodium Polyacrylate, Xylitol, Allantoin, Betaine, Lactobacillus/Pumpkin Ferment Extract, Panthenol, Beta-Glucan, Betula Platyphylla Japonica Bark Extract, Leuconostoc/Radish Root Ferment Filtrate, Phaseolus Radiatus Extract, Polyglutamic Acid, Rumex Crispus Root Extract, Disodium EDTA, Potassium Hydroxide, Butylene Glycol, Dimethicone, Glycerin, Hydrogenated Lecithin.'

/**
 * Product 30, INTENSIVE PROBLEM CONTROL CREAM: the product record copy, "Everything under control."
 * EN goes to the DB through scripts/update-product-30-campaign.ts; RU/AR are served through
 * data/productLocalizedCopyAudit.ts. Selling voice, same facts as components/product/pccream.
 */

export const PRODUCT_30_EN = {
  description:
    'Everything under control. The moisturiser oily skin actually wants to wear: a fresh, oil-free gel cream with no plant oils, butters or waxes. Zinc PCA 0.05% keeps oil and shine in check, trehalose and xylitol help skin hold on to water, and panthenol, allantoin and beta-glucan keep it calm. Massage it in as the last step, morning and night. 50g homecare and 250g professional. No perfume. Dermatologically tested.',
  productDetails: JSON.stringify({
    form: 'Oil-free gel cream, tube',
    size: '50g homecare / 250g professional',
    function: 'Blemish-prone skin and oil control',
    technology: 'Zinc PCA 0.05% in a light water gel',
    keyBenefits: 'Shine in check, hydration that stays, calm skin',
    usage: 'Morning and night, massaged in as the last step',
    skinType: 'Oily and combination skin, blemish-prone',
    application: 'Smooth over the face and massage gently until it sinks in',
    fragrance: 'None',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Oil-free gel cream', description: 'No plant oils, butters or waxes: water set into a light gel that sinks straight in.' },
    { title: 'Zinc PCA 0.05%', description: 'Keeps oil and shine in check, at the same dose as the Problem Control Serum.' },
    { title: 'Water that stays', description: 'Trehalose and xylitol help oily skin hold on to water, so it never feels tight.' },
    { title: 'Calm and comfortable', description: 'Panthenol, allantoin and beta-glucan keep skin soft, even after toner and serum.' },
  ]),
  benefits: JSON.stringify([
    'Keeps oil and shine in check',
    'Oil-free gel cream: no plant oils, butters or waxes',
    'Zinc PCA 0.05%, the same as the Problem Control Serum',
    'Trehalose and xylitol for hydration that stays',
    'No perfume of any kind',
    'Morning and night as the last step · dermatologically tested',
  ]),
  ingredients: JSON.stringify([
    { name: 'Zinc PCA 0.05%', description: 'The oil-control star: helps keep excess oil and shine in check while skin stays fresh.' },
    { name: 'Trehalose · Xylitol', description: 'Two sugar humectants that help skin hold on to water without any weight.' },
    { name: 'Panthenol · Allantoin · Beta-glucan', description: 'The comfort trio, for skin that stays soft and calm.' },
    { name: 'Ferments and botanicals', description: 'Pumpkin and radish root ferments, mung bean, white birch bark and yellow dock, with polyglutamic acid.' },
    { name: 'Full ingredient list (INCI)', description: product30FullInci },
  ]),
  howToUse:
    '1. Cleanse. Start on clean skin\n2. Toner, then serum. This cream comes after both\n3. Smooth a little over the face and massage gently until it sinks in\n4. At night it is the last step. In the morning, sunscreen goes on top\n5. Keep it away from the eye area',
  directions:
    'Dermatologically tested. For oily and combination skin. For external use only. Keep away from the eye area. Stop and speak to a doctor if redness, swelling or irritation appears. Keep in a cool dry place, out of reach of children. Three years unopened, with the expiry date on the box.',
} as const

export const product30Ru = {
  description:
    'Всё под контролем. Увлажнение, которое жирная кожа действительно готова носить: свежий гель-крем без растительных масел, баттеров и восков. Цинк PCA 0,05% держит жирность и блеск под контролем, трегалоза и ксилитол помогают коже удерживать воду, а пантенол, аллантоин и бета-глюкан сохраняют её спокойной. Наносите утром и вечером последним шагом и мягко массируйте до впитывания. Тубы 50 г и 250 г. Без отдушки. Дерматологически протестировано.',
  productDetails: JSON.stringify({
    form: 'Гель-крем без масел, туба',
    size: '50 г для домашнего ухода / 250 г для профессионального применения',
    function: 'Уход за кожей, склонной к высыпаниям, и контроль жирности',
    keyActive: 'Цинк PCA 0,05%',
    hydrationSupport: 'Трегалоза и ксилитол',
    texture: 'Лёгкий водный гель без растительных масел, баттеров и восков',
    usage: 'Утром и вечером, последним шагом ухода',
    skinType: 'Жирная и комбинированная кожа, склонная к высыпаниям',
    application: 'Распределить по лицу и мягко массировать до впитывания',
    fragrance: 'Без отдушки',
    testing: 'Дерматологически протестировано',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Гель-крем без масел', description: 'Ни растительных масел, ни баттеров, ни восков: вода в форме лёгкого геля, который сразу впитывается.' },
    { title: 'Цинк PCA · 0,05%', description: 'Держит жирность и блеск под контролем, в той же дозе, что и сыворотка Problem Control.' },
    { title: 'Вода, которая остаётся', description: 'Трегалоза и ксилитол помогают жирной коже удерживать воду, и она не ощущает стянутости.' },
    { title: 'Спокойствие и комфорт', description: 'Пантенол, аллантоин и бета-глюкан сохраняют мягкость кожи даже после тоника и сыворотки.' },
  ]),
  benefits: JSON.stringify([
    'Держит жирность и блеск под контролем',
    'Гель-крем без растительных масел, баттеров и восков',
    'Цинк PCA 0,05%, как в сыворотке Problem Control',
    'Трегалоза и ксилитол для увлажнения, которое остаётся',
    'Без отдушки, эфирных масел и этанола',
    'Утром и вечером последним шагом · дерматологически протестировано',
  ]),
  ingredients: JSON.stringify([
    { name: 'Цинк PCA · 0,05%', description: 'Звезда контроля жирности: помогает держать избыток себума и блеск под контролем, сохраняя свежесть.' },
    { name: 'Трегалоза · Ксилитол', description: 'Два увлажняющих сахара помогают коже удерживать воду без тяжести.' },
    { name: 'Пантенол · Аллантоин · Бета-глюкан', description: 'Тройка комфорта для мягкой и спокойной кожи.' },
    { name: 'Ферменты и растительные экстракты', description: 'Ферменты тыквы и корня редиса, маш, кора белой берёзы и щавель, а также полиглутаминовая кислота.' },
    { name: 'Полный состав (INCI)', description: product30FullInci },
  ]),
  howToUse: JSON.stringify([
    { step: 'Подготовьте кожу', instruction: 'Очистите лицо и нанесите тоник.' },
    { step: 'Нанесите сыворотку', instruction: 'Если используете всю линию, сначала вбейте Problem Control Serum лёгкими похлопываниями.' },
    { step: 'Завершите кремом', instruction: 'Распределите немного крема по лицу и мягко массируйте до впитывания.' },
    { step: 'Утром и вечером', instruction: 'Последний шаг ухода; утром сверху нанесите солнцезащитное средство.' },
  ]),
  directions:
    'Для жирной и комбинированной кожи. Только для наружного применения. Избегайте области вокруг глаз и слизистых. При попадании в глаза тщательно промойте прохладной водой. Не наносите на повреждённую кожу. При покраснении, отёке, зуде или стойком раздражении прекратите использование и обратитесь к врачу. Храните в прохладном сухом месте вдали от прямого солнца и в недоступном для детей месте. Три года в закрытом виде, дата на упаковке.',
} as const

export const product30Ar = {
  description:
    'كل شيء تحت السيطرة. الترطيب الذي ترغب البشرة الدهنية فعلاً في ارتدائه: كريم جل منعش خالٍ من الزيوت النباتية والزبدات والشموع. زنك PCA بتركيز 0.05% يُبقي الدهون واللمعان تحت السيطرة، والتريهالوز والزيليتول يساعدان البشرة على الاحتفاظ بالماء، والبانثينول والألانتوين وبيتا غلوكان تحافظ على هدوئها. يُستخدم صباحاً ومساءً كخطوة أخيرة مع التدليك بلطف حتى يتغلغل. أنبوبا 50 غ و250 غ. بلا عطر. مختبر جلدياً.',
  productDetails: JSON.stringify({
    form: 'كريم جل خالٍ من الزيوت، أنبوب',
    size: '50 غ للعناية المنزلية / 250 غ للاستخدام المهني',
    function: 'العناية بالبشرة المعرضة للشوائب وتنظيم الدهون',
    keyActive: 'زنك PCA بتركيز 0.05%',
    hydrationSupport: 'تريهالوز وزيليتول',
    texture: 'جل مائي خفيف بلا زيوت نباتية أو زبدات أو شموع',
    usage: 'صباحاً ومساءً كخطوة أخيرة في الروتين',
    skinType: 'البشرة الدهنية والمختلطة المعرضة للشوائب',
    application: 'يوزع على الوجه ويُدلَّك بلطف حتى يتغلغل',
    fragrance: 'بلا عطر',
    testing: 'مختبر جلدياً',
    origin: 'صُنع في كوريا بواسطة DTS MG',
  }),
  keyFeatures: JSON.stringify([
    { title: 'كريم جل خالٍ من الزيوت', description: 'بلا زيوت نباتية ولا زبدات ولا شموع: ماء في قوام جل خفيف يتغلغل فوراً.' },
    { title: 'زنك PCA · 0.05%', description: 'يُبقي الدهون واللمعان تحت السيطرة، بالتركيز نفسه الموجود في سيروم Problem Control.' },
    { title: 'ماء يبقى', description: 'التريهالوز والزيليتول يساعدان البشرة الدهنية على الاحتفاظ بالماء فلا تشعر بالشد.' },
    { title: 'هدوء وراحة', description: 'البانثينول والألانتوين وبيتا غلوكان تحافظ على نعومة البشرة حتى بعد التونر والسيروم.' },
  ]),
  benefits: JSON.stringify([
    'يُبقي الدهون واللمعان تحت السيطرة',
    'كريم جل بلا زيوت نباتية أو زبدات أو شموع',
    'زنك PCA بتركيز 0.05%، كما في سيروم Problem Control',
    'تريهالوز وزيليتول لترطيب يدوم',
    'بلا عطر ولا زيوت عطرية ولا إيثانول',
    'صباحاً ومساءً كخطوة أخيرة · مختبر جلدياً',
  ]),
  ingredients: JSON.stringify([
    { name: 'زنك PCA · 0.05%', description: 'نجم تنظيم الدهون: يساعد على إبقاء فائض الزهم واللمعان تحت السيطرة مع الحفاظ على الانتعاش.' },
    { name: 'تريهالوز · زيليتول', description: 'سكّران مرطبان يساعدان البشرة على الاحتفاظ بالماء من دون ثقل.' },
    { name: 'بانثينول · ألانتوين · بيتا غلوكان', description: 'ثلاثي الراحة لبشرة ناعمة وهادئة.' },
    { name: 'مخمرات ومستخلصات نباتية', description: 'مخمرات اليقطين وجذر الفجل، والماش ولحاء البتولا البيضاء والحمّاض، مع حمض البولي غلوتاميك.' },
    { name: 'قائمة المكوّنات الكاملة (INCI)', description: product30FullInci },
  ]),
  howToUse: JSON.stringify([
    { step: 'تهيئة البشرة', instruction: 'يُنظف الوجه ويوضع التونر.' },
    { step: 'تطبيق السيروم', instruction: 'عند استخدام المجموعة كاملة، يُربت سيروم Problem Control أولاً حتى الامتصاص.' },
    { step: 'استكمال الروتين بالكريم', instruction: 'تُوزع كمية صغيرة على الوجه وتُدلَّك بلطف حتى تتغلغل.' },
    { step: 'صباحاً ومساءً', instruction: 'الخطوة الأخيرة في الروتين، ويوضع واقي الشمس فوقه في الصباح.' },
  ]),
  directions:
    'للبشرة الدهنية والمختلطة. للاستخدام الخارجي فقط. يجب تجنب المنطقة المحيطة بالعينين والأغشية المخاطية، والشطف جيداً بالماء البارد عند الملامسة. لا يُستخدم على بشرة متضررة. عند ظهور احمرار أو تورم أو حكة أو تهيج مستمر، يُوقف الاستخدام وتُطلب المشورة الطبية. يُحفظ في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة وعن متناول الأطفال. ثلاث سنوات قبل الفتح، والتاريخ على العبوة.',
} as const
