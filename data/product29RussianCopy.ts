const fullInci =
  'Aqua (Water), Glycerin, Caprylic/Capric Triglyceride, Dipropylene Glycol, Propanediol, Isononyl Isononanoate, Dicaprylyl Ether, Sodium Acrylates Copolymer, 1,2-Hexanediol, Sodium Hyaluronate (1,000.9 ppm), Sodium Hyaluronate Crosspolymer (30 ppb), Potassium Hyaluronate (30 ppb), Hydroxypropyltrimonium Hyaluronate (30 ppb), Hydrolyzed Sodium Hyaluronate (30 ppb), Hydrolyzed Hyaluronic Acid (30 ppb), Hyaluronic Acid (30 ppb), Sodium Acetylated Hyaluronate (1 ppb), Saccharide Isomerate, Xylitol, Erythritol, Glyceryl Glucoside, Tremella Fuciformis Polysaccharide, Trametes Versicolor Extract, Sparassis Crispa Extract, Ganoderma Lucidum (Mushroom) Extract, Phellinus Linteus Extract, Tremella Fuciformis (Mushroom) Extract, Saccharomyces Ferment Filtrate, Solanum Melongena (Eggplant) Fruit Extract, Aloe Barbadensis Flower Extract, Ocimum Sanctum Leaf Extract, Curcuma Longa (Turmeric) Root Extract, Corallina Officinalis Extract, Coccinia Indica Fruit Extract, Melia Azadirachta Leaf Extract, Melia Azadirachta Flower Extract, Tocopherol, Lecithin, Anhydroxylitol, Glyceryl Stearate Citrate, Ethylhexylglycerin, Xylitylglucoside, Pelargonium Graveolens Flower Oil, Citric Acid, Pentylene Glycol, Polyglyceryl-3 Distearate, Sodium Phytate, Sodium Citrate, Citronellol, Geraniol.'

export const PRODUCT_29_RU_NAME =
  'Увлажняющий крем MOISTURE REPLENISHING HYALURON CREAM'

export const PRODUCT_29_RU_DESCRIPTION =
  'Крем для сухой и обезвоженной кожи с 9% глицерина, 0,615% PENTAVITIN и 1 000,9 ppm высокомолекулярного гиалуроната натрия. Формула притягивает влагу и помогает удерживать её на поверхности кожи. После одного нанесения уровень увлажнённости повысился на 82%, а эффект оставался статистически значимым спустя 72 часа. Наносите утром и вечером после сыворотки. Доступен в объёмах 50 г и 250 г.'

export const PRODUCT_29_RU_TRANSLATION = {
  description: PRODUCT_29_RU_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'Несмываемый увлажняющий крем в тубе',
    size: '50 г для домашнего ухода / 250 г для профессионального применения',
    function: 'Увлажнение и удержание влаги',
    technology:
      'Комплекс Hyaluronan 11 с 1 000,9 ppm высокомолекулярного гиалуроната натрия',
    keyBenefits: 'Интенсивное увлажнение и защита от потери влаги до 72 часов',
    usage: 'Утром и вечером после сыворотки',
    skinType: 'Сухая и обезвоженная кожа любого типа',
    application: 'Нанести на лицо и мягко распределить массажными движениями',
    fragrance: 'Лёгкий цветочный аромат благодаря маслу герани',
    storage: 'Хранить в прохладном сухом месте, не в холодильнике',
    testing: 'Дерматологически протестировано',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: '1 000,9 ppm гиалуроната натрия',
      description:
        'Высокомолекулярная форма создаёт на поверхности кожи влагоудерживающую плёнку и помогает уменьшить испарение воды.',
    },
    {
      title: '9% глицерина и 0,615% PENTAVITIN',
      description:
        'Два основных увлажняющих компонента притягивают воду и поддерживают комфорт кожи.',
    },
    {
      title: 'Комплекс Hyaluronan 11',
      description:
        'Одиннадцать молекулярных фракций гиалуроновой кислоты представлены восемью наименованиями INCI. Их концентрации указаны прямо на упаковке.',
    },
    {
      title: '+82% увлажнённости после одного применения',
      description:
        'В исследовании производителя уровень увлажнённости повысился сразу после нанесения и оставался статистически значимо выше исходного через 72 часа.',
    },
  ]),
  benefits: JSON.stringify([
    'Повышает уровень увлажнённости кожи сразу после нанесения',
    'Помогает удерживать влагу до 72 часов',
    'Содержит 1 000,9 ppm высокомолекулярного гиалуроната натрия',
    '9% глицерина и 0,615% PENTAVITIN поддерживают водный баланс кожи',
    'Подходит для сухой и обезвоженной кожи',
    'Дерматологически протестировано; объёмы 50 г и 250 г',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Комплекс Hyaluronan 11',
      description:
        'Одиннадцать молекулярных фракций гиалуроновой кислоты представлены восемью наименованиями INCI. Основная концентрация приходится на высокомолекулярный гиалуронат натрия — 1 000,9 ppm.',
    },
    {
      name: 'Гиалуронат натрия — 1 000,9 ppm',
      description:
        'Высокомолекулярная форма остаётся на поверхности кожи и образует влагоудерживающую плёнку, помогая уменьшить потерю воды.',
    },
    {
      name: 'Глицерин — 9%',
      description:
        'Основной увлажняющий компонент формулы. Притягивает воду и помогает поддерживать мягкость и комфорт кожи.',
    },
    {
      name: 'PENTAVITIN — 0,615%',
      description:
        'Сахарид изомерат растительного происхождения, который связывается с поверхностью кожи и поддерживает длительное увлажнение.',
    },
    {
      name: 'Ксилитол и эритритол',
      description:
        'Дополняют увлажняющую систему и поддерживают лёгкое освежающее ощущение крема.',
    },
    {
      name: 'Грибной комплекс',
      description:
        'Тремелла, траметес, спарассис, рейши и феллинус присутствуют в небольших концентрациях как вспомогательные компоненты формулы.',
    },
    { name: 'Full INCI', description: fullInci },
  ]),
  howToUse: JSON.stringify([
    {
      step: 'Очищение',
      instruction: 'Очистите кожу и нанесите тоник.',
    },
    {
      step: 'Сыворотка',
      instruction:
        'При совместном использовании сначала нанесите Moisture Replenishing Hyaluron Serum.',
    },
    {
      step: 'Крем',
      instruction:
        'Нанесите необходимое количество крема на лицо и мягко распределите массажными движениями.',
    },
    {
      step: 'Завершение ухода',
      instruction: 'Вечером используйте как последний этап, утром нанесите сверху SPF.',
    },
    {
      step: 'Хранение',
      instruction:
        'Не храните в холодильнике: низкая температура может изменить вязкость и текстуру крема.',
    },
  ]),
  directions:
    'Дерматологически протестировано. Предназначено для сухой и обезвоженной кожи. Содержит масло цветков герани, а также цитронеллол и гераниол. Только для наружного применения. Избегайте области вокруг глаз. При появлении покраснения, отёка или раздражения прекратите использование и обратитесь к врачу. Храните в прохладном сухом месте, но не в холодильнике. Срок годности в невскрытом виде — три года; точная дата указана на упаковке.',
} as const
