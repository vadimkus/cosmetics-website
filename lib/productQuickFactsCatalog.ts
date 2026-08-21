/**
 * Manual-sourced Quick Facts for PDP.
 *
 * Sources: GENOSYS product PDFs under public/documents/ppt, Intertek claims
 * already verified in SESSION_CHANGES_*_SLIDES docs, and official clinical
 * numbers from those manuals. Do NOT seed this catalog from on-page
 * keyFeatures / benefits / description copy.
 */

export type QuickFactLocale = 'en' | 'ru' | 'ar'

export type LocalizedQuickFact = {
  title: Record<QuickFactLocale, string>
  text: Record<QuickFactLocale, string>
}

export const BEAUTY_BOX_PRODUCT_IDS = ['55', '56', '57', '58', '59', '62'] as const

export const BEAUTY_BOX_PRODUCT_CUIDS: Record<(typeof BEAUTY_BOX_PRODUCT_IDS)[number], string> = {
  '55': 'cmhowxw4x00008ofct2ivnq2j',
  '56': 'cmhoyg0r400008o7s4va63hsw',
  '57': 'cmhoyw7d500008o9tdprqkkhb',
  '58': 'cmhozfrep00008oxxizeqk8a0',
  '59': 'cmhp0jfrq00008odr033fg0ly',
  '62': 'cml3twwvk0000ua8o9qiqwkie',
}

const t = (
  enTitle: string,
  enText: string,
  ruTitle: string,
  ruText: string,
  arTitle: string,
  arText: string,
): LocalizedQuickFact => ({
  title: { en: enTitle, ru: ruTitle, ar: arTitle },
  text: { en: enText, ru: ruText, ar: arText },
})

/** Catalog keyed by productNumber or legacy product id. */
export const PRODUCT_QUICK_FACTS_CATALOG: Record<string, LocalizedQuickFact[]> = {
  '10': [
    t('Dry-face wash', 'Apply on a dry face, away from the eyes. Water is the rinse, not the start.', 'Умывание на сухом лице', 'Наносят на сухое лицо, в стороне от глаз. Вода - смыв, не начало.', 'غسول على وجه جاف', 'يُوضع على وجه جاف، بعيداً عن العينين. الماء هو الشطف، لا البداية.'),
    t('Oxygen bubbles', 'Naturally generated oxygen bubbles lift make-up dirt and skin impurities.', 'Кислородные пузырьки', 'Естественно образующиеся кислородные пузырьки поднимают макияж и загрязнения.', 'فقاعات أكسجين', 'فقاعات أكسجين تتولّد طبيعياً ترفع أوساخ المكياج وشوائب البشرة.'),
    t('Ether 8%', 'Methyl Perfluoroisobutyl Ether is why the bubbles form on dry skin.', 'Эфир 8%', 'Methyl Perfluoroisobutyl Ether - причина пузырьков на сухой коже.', 'إيثر 8%', 'Methyl Perfluoroisobutyl Ether هو سبب الفقاعات على البشرة الجافة.'),
    t('Four carton steps', 'Apply, wait for the bubbles, circular massage, rinse with tepid water.', 'Четыре шага с коробки', 'Нанести, дождаться пузырьков, круговой массаж, смыть тёплой водой.', 'أربع خطوات من العلبة', 'ضعي، انتظري الفقاعات، دلّكي دوائر، اشطفي بماء فاتر.'),
    t('Two sizes', '180 ml at home, 500 ml on the clinic shelf. Same formula.', 'Два объёма', '180 мл дома, 500 мл на полке клиники. Одна формула.', 'حجمان', '180 مل في المنزل، 500 مل على رف العيادة. التركيبة نفسها.'),
    t('Dermatologically tested', 'A daily rinse-off wash. Not fragrance-free and not sulfate-free.', 'Дерматологически протестировано', 'Ежедневное смываемое умывание. Не без отдушки и не без сульфатов.', 'مختبر جلدياً', 'غسول يومي يُشطف. ليس خالياً من العطر ولا من الكبريتات.'),
  ],
  '11': [
    t('Shake, hold, wipe', 'Biphasic lip and eye makeup remover. Shake, cotton pad, a few seconds, wipe.', 'Встряхнуть, подержать, снять', 'Двухфазный демакияж губ и глаз: встряхните, пропитайте диск, подержите несколько секунд и аккуратно снимите макияж.', 'رُجّي، انتظري، امسحي', 'إزالة مكياج ثنائية الطور للشفاه والعينين: تُرج العبوة، وتُبلل قطعة قطن، ثم توضع لبضع ثوانٍ ويُمسح المكياج بلطف.'),
    t('Oil layer 49.8%', 'Cetyl ethylhexanoate 27.8%, disiloxane 13%, isohexadecane 9%. That is the remover.', 'Масляная фаза 49,8%', 'Цетилэтилгексаноат 27,8%, дисилоксан 13% и изогексадекан 9% растворяют декоративную косметику без интенсивного трения.', 'طور زيتي 49.8%', 'يذيب سيتيل إيثيل هكسانوات 27.8% والديسيلوكسان 13% والإيزوهكساديكان 9% المكياج من دون فرك قوي.'),
    t('Fresh, not greasy', 'Disiloxane flashes off. The carton calls it a fresh, non-greasy wipe.', 'Свежий, нежирный финиш', 'Лёгкие компоненты масляной фазы снимаются ватным диском, не оставляя ощущения тяжёлой плёнки.', 'لمسة منعشة وغير دهنية', 'تُزال مكونات الطور الزيتي الخفيفة بقطعة القطن من دون ترك إحساس بطبقة ثقيلة.'),
    t('Lip and eye only', 'Not a face wash. Cleanse after with Snow O₂ or Cerabarrier.', 'Для губ и области вокруг глаз', 'Первый шаг вечернего очищения. Затем умойте лицо с SNOW O₂ или CERABARRIER.', 'للشفاه والمنطقة المحيطة بالعينين', 'الخطوة الأولى في التنظيف المسائي، يليها غسل الوجه باستخدام SNOW O₂ أو CERABARRIER.'),
    t('Peptides at trace', 'Palmitoyl Tripeptide-5 0.65 ppb. Acetyl Tetrapeptide-5 0.5 ppb. Not the engine.', 'Пептиды в следовых количествах', 'Palmitoyl Tripeptide-5 0,65 ppb и Acetyl Tetrapeptide-5 0,5 ppb. Основную работу выполняет масляная фаза.', 'ببتيدان بتركيزين أثريين', 'Palmitoyl Tripeptide-5 بتركيز 0.65 جزء في البليون وAcetyl Tetrapeptide-5 بتركيز 0.5 جزء. ويؤدي الطور الزيتي الوظيفة الأساسية.'),
    t('200 ml, 12 months', 'Dermatologically tested. Use within 12 months of opening.', '200 мл · 12 месяцев', 'Дерматологически протестировано. Используйте в течение 12 месяцев после вскрытия.', '200 مل · 12 شهراً', 'مختبر جلدياً. يُستخدم خلال 12 شهراً من الفتح.'),
  ],
  '12': [
    t('Enzyme + cellulose', 'A rinse-off gommage: cellulose binds dead cells so they clump and rinse away.', 'Энзимы + целлюлоза', 'Мягкий смываемый гоммаж без жёстких абразивов: целлюлоза собирает ороговевшие клетки в катышки.', 'إنزيمات + سليلوز', 'غوماج لطيف يُشطف من دون حبيبات خشنة؛ يجمع السليلوز الخلايا المتقرنة في كتل ناعمة.'),
    t('Cellulose 3%', 'The peel you feel. Plant cellulose rolls the dead cells off without grit.', 'Целлюлоза 3%', 'Растительная целлюлоза обеспечивает мягкое скатывание без жёстких скрабирующих частиц.', 'سليلوز 3%', 'يوفر السليلوز النباتي تدحرجاً ناعماً من دون حبيبات كاشطة خشنة.'),
    t('Dry skin, one minute', 'Massage on clean, dry skin for up to one minute, then rinse with tepid water.', 'Сухая кожа · 30–60 секунд', 'Нанесите на чистую сухую кожу, мягко помассируйте 30–60 секунд и смойте тёплой водой.', 'بشرة جافة · 30–60 ثانية', 'يُوزع على بشرة نظيفة وجافة، ويُدلّك بلطف لمدة 30–60 ثانية، ثم يُشطف بالماء الفاتر.'),
    t('Once or twice a week', 'A weekly polish, not a daily leave-on.', '1–2 раза в неделю', 'Короткий ритуал для более гладкой и свежей кожи, а не ежедневный несмываемый уход.', 'مرة إلى مرتين أسبوعياً', 'خطوة قصيرة لملمس أكثر نعومة وانتعاشاً، وليست مستحضراً يومياً يُترك على البشرة.'),
    t('Face and body', 'The same gel is used on knees, elbows and heels as well as the face.', 'Для лица и тела', 'Используйте на лице или шероховатых участках тела: локтях, коленях и пятках.', 'للوجه والجسم', 'يُستخدم على الوجه أو المناطق الخشنة في الجسم، مثل المرفقين والركبتين والكعبين.'),
    t('100g tube', 'Dermatologically tested rinse-off peeling gel.', 'Тюбик 100 г', 'Смываемый пилинг-гоммаж, дерматологически протестирован.', 'أنبوب 100 غ', 'جل تقشير غوماج يُشطف، مختبر جلدياً.'),
  ],
  '13': [
    t('Apply, sit, cold rinse', 'Professional AHA peel. Apply evenly, keep off lips and eyes, sit 15-20 minutes, rinse with cold water.', 'Нанести, выдержать, смыть', 'Профессиональный AHA-пилинг: равномерное нанесение, 15–20 минут экспозиции и тщательное смывание холодной водой.', 'يُوزع، يُترك، يُشطف', 'تقشير AHA احترافي: توزيع متجانس، ومدة تطبيق 15–20 دقيقة، ثم شطف جيد بالماء البارد.'),
    t('Glycolic 15%', 'With lactic 13.5% and mandelic 2%. That is 30.5% acids in a 2 ml vial.', 'Гликолевая кислота 15%', 'Вместе с молочной кислотой 13,5% и миндальной 2% образует комплекс общей концентрацией 30,5%.', 'حمض الجليكوليك 15%', 'مع حمض اللاكتيك 13.5% وحمض الماندليك 2% يشكل مزيجاً إجمالياً بتركيز 30.5%.'),
    t('Soft peeling', 'The carton function. High-AHA. The Korean carton says speak to a professional.', 'Профессиональное обновление', 'Интенсивный кислотный пилинг помогает выровнять текстуру, освежить тон и вернуть коже сияние.', 'تجديد احترافي', 'يساعد التقشير الحمضي المكثف على تنعيم الملمس وتجديد مظهر البشرة وإشراقتها.'),
    t('Not Epi', 'Epi is the home cellulose roll. This is the clinic AHA. Do not use both in one visit.', 'Не домашний гоммаж', 'SRS — профессиональный кислотный пилинг. Для мягкого еженедельного домашнего отшелушивания предназначен EPI.', 'ليس غوماجاً منزلياً', 'SRS تقشير حمضي احترافي، أما EPI فهو الخيار اللطيف للتقشير المنزلي الأسبوعي.'),
    t('Peptide at 0.1 ppb', 'sh-Polypeptide-7 is on the INCI. It is not the peel.', 'Пептид · 0,1 ppb', 'sh-Polypeptide-7 присутствует в следовой концентрации; основное действие обеспечивают три AHA-кислоты.', 'الببتيد · 0.1 جزء في البليون', 'يوجد sh-Polypeptide-7 بتركيز أثري، بينما تعتمد عملية التقشير على أحماض AHA الثلاثة.'),
    t('2 ml × 10', 'One vial, one face. Dermatologically tested. pH 3.02.', '2 мл × 10', 'Одноразовые профессиональные флаконы. Дерматологически протестировано. pH 3,02.', '2 مل × 10', 'قوارير احترافية أحادية الاستخدام. مختبر جلدياً. درجة الحموضة 3.02.'),
  ],
  '14': [
    t('Shake, then spray', 'Opaque emulsion. Shake well, spray at 10-20 cm with eyes closed, through the day.', 'Встряхнуть и распылить', 'Хорошо встряхните флакон, закройте глаза и распылите мист с расстояния 10–20 см.', 'رُجّ ثم رش', 'تُرج العبوة جيداً، وتُغلق العينان، ثم يُرش المستحضر من مسافة 10–20 سم.'),
    t('Shea 1.2%', 'The largest named oil after the solvents. That is why the mist is opaque and why you shake.', 'Масло ши 1,2%', 'Главный смягчающий компонент эмульсии помогает удерживать влагу и поддерживать мягкость кожи.', 'زبدة الشيا 1.2%', 'المكوّن الملطف الرئيسي في المستحلب يساعد على الاحتفاظ بالرطوبة ودعم نعومة البشرة.'),
    t('Moisturizing, nourishing', 'The carton function. Not a water toner. Not Snow Booster.', 'Увлажнение и питание', 'Лёгкая эмульсия возвращает коже комфорт, мягкость и свежее ухоженное сияние.', 'ترطيب وتغذية', 'مستحلب خفيف يمنح البشرة راحة ونعومة وإشراقة منعشة.'),
    t('Over makeup', 'The carton says it can be sprayed over make-up. Before makeup it is the glow pass.', 'До и поверх макияжа', 'Перед макияжем добавляет сияние, а поверх него помогает освежить внешний вид без растирания.', 'قبل المكياج وفوقه', 'يمنح إشراقة قبل المكياج، ويساعد على تجديد المظهر فوقه من دون فرك.'),
    t('Peptide at 0.000001%', 'Acetyl Heptapeptide-4 is on the INCI. It is not the mist.', 'Увлажняющая база 7,255%', 'Бутиленгликоль 4,01% и глицерин 3,245% помогают удерживать влагу в течение дня.', 'قاعدة ترطيب 7.255%', 'يساعد بيوتلين غليكول 4.01% والغليسرين 3.245% على الاحتفاظ بالرطوبة خلال اليوم.'),
    t('80 ml', 'pH 5.48, inside 5.00 to 6.00. 12 months after opening.', '80 мл · 12 месяцев', 'pH 5,48 в пределах 5,00–6,00. Используйте в течение 12 месяцев после вскрытия.', '80 مل · 12 شهراً', 'الأس الهيدروجيني 5.48 ضمن نطاق 5.00–6.00. يُستخدم خلال 12 شهراً من الفتح.'),
  ],
  '35': [
    t('Diatomaceous earth 65%', 'Most of the pouch. Fine mineral powder that takes water, sits, and peels off as a sheet.', 'Диатомовая земля 65%', 'Минеральная основа пудры помогает сформировать плотный равномерный слой маски.', 'تراب الدياتوم 65%', 'القاعدة المعدنية للمسحوق تساعد على تكوين طبقة متماسكة ومتساوية.'),
    t('Mix 30g at 1 : 0.8', 'Powder to water. Stir one to two minutes, apply, peel after 15-20 minutes.', '30 г · пропорция 1 : 0,8', 'Перемешивайте с водой 1–2 минуты, нанесите и снимите через 15–20 минут.', '30 غ · نسبة 1 : 0.8', 'يُخلط بالماء لمدة دقيقة إلى دقيقتين، ثم يُطبق ويُرفع بعد 15–20 دقيقة.'),
    t('Cool until you peel', 'Peppermint extract, peppermint oil and menthol. The cool is the wear.', 'Освежающая прохлада', 'Экстракт и масло мяты вместе с ментолом охлаждают кожу во время процедуры.', 'انتعاش مبرّد', 'يمنح مستخلص النعناع وزيته مع المنثول إحساساً بالبرودة أثناء الجلسة.'),
    t('1kg clinic kilo', 'About thirty treatments at 30g. After a professional treatment.', 'Профессиональный формат 1 кг', 'Примерно 30 процедур при расходе 30 г на одно применение.', 'حجم احترافي 1 كغ', 'يكفي لنحو 30 جلسة باستخدام 30 غ في كل مرة.'),
    t('Peel, then toner', 'Do not rub the residue in. Lift in one piece and wipe what is left with toner.', 'Снять, затем тоник', 'Снимите маску единым пластом, а небольшие остатки удалите тоником.', 'يُرفع ثم يُستخدم التونر', 'يُرفع القناع كقطعة واحدة، وتُمسح البقايا القليلة بالتونر.'),
    t('HA and ceramide at 0.01%', 'Sodium Hyaluronate, Ceramide NP, Allantoin and Centella each sit at 0.01%. In the formula. Not the engine.', 'Дополняющие компоненты по 0,01%', 'Гиалуронат натрия, Ceramide NP, аллантоин и центелла дополняют основную формулу.', 'مكونات داعمة بتركيز 0.01%', 'تكمل هيالورونات الصوديوم وCeramide NP والألانتوين والسنتيلا التركيبة الأساسية.'),
  ],
  '37': [
    t('Glycerin 20%', 'The humectant. Almost a fifth of the pouch. This is the figure that belongs on a card.', 'Глицерин 19,921%', 'Основной увлажняющий компонент, составляющий почти пятую часть эссенции.', 'غليسرين 19.921%', 'المكوّن المرطب الرئيسي، ويشكل ما يقارب خُمس الخلاصة.'),
    t('20-40 minutes, then off', 'Sit, take the sheet off, massage the leftover in. Not fifteen. Not twenty only.', 'Эластичный гидрогель', 'Камедь рожкового дерева 2,2% и экстракт хондруса 0,8% создают плотно прилегающую гелевую основу.', 'هيدروجيل مرن', 'يشكل صمغ الخروب 2.2% ومستخلص Chondrus بنسبة 0.8% قاعدة جل تلتصق بالبشرة براحة.'),
    t('After a procedure', 'Moisturizing, soothing. The registered sentence is after dermatological procedures.', '20–40 минут', 'Плотно приложите, снимите через 20–40 минут и мягко распределите оставшуюся эссенцию.', '20–40 دقيقة', 'يوضع بإحكام، ثم يُرفع بعد 20–40 دقيقة وتُدلّك الخلاصة المتبقية بلطف.'),
    t('The peptide sits at 0.05 ppm', 'Acetyl Hexapeptide-8 is 0.05 ppm finished. The name says peptide. That is not the engine.', 'После процедуры', 'Увлажняющий и успокаивающий уход после дерматологических процедур.', 'بعد الإجراء', 'عناية مرطبة ومهدئة بعد الإجراءات الجلدية.'),
    t('38g × 5 sheets', 'Mesh included. Use each sheet as soon as you open the pouch. Refrigerate if you want it colder.', 'Пептид · 0,05 ppm', 'Ацетилгексапептид-8 присутствует в готовой формуле в концентрации 0,0000054%.', 'الببتيد · 0.05 جزء في المليون', 'يوجد أسيتيل هكسا ببتيد-8 بتركيز 0.0000054% في التركيبة النهائية.'),
    t('Face sheet, not the eye patch', 'Keep it off the eyes. Niacinamide 2% and Adenosine 0.04% live on product 33.', '38 г × 5 масок', 'Пять индивидуальных масок по 38 г каждая с учётом поддерживающей сетки.', '38 غ × 5 أقنعة', 'خمسة أقنعة فردية بوزن 38 غ لكل قناع شاملاً الشبكة الداعمة.'),
  ],
  '34': [
    t('Niacinamide 2%', 'The brightening functional. This is the figure that belongs on a card.', 'Ниацинамид 2%', 'Помогает сделать тон визуально более ровным и вернуть коже свежее сияние.', 'نياسيناميد 2%', 'يساعد على تحسين مظهر تجانس اللون ومنح البشرة إشراقة أكثر نضارة.'),
    t('Adenosine 0.04%', 'The wrinkle-care functional pair. Help the look of lines, not a lift story.', 'Аденозин 0,04%', 'Ухаживает за видимыми морщинами и поддерживает более гладкий вид кожи.', 'أدينوزين 0.04%', 'يعتني بمظهر التجاعيد ويدعم مظهراً أكثر نعومة للبشرة.'),
    t('Leave-on overnight', 'Last step of the evening. Do not wash off. Sleep, then cleanse in the morning.', 'Глицерин 6% · трегалоза 2%', 'Увлажняющая пара помогает удерживать влагу и поддерживает комфорт кожи до утра.', 'غليسرين 6% · تريهالوز 2%', 'ثنائي مرطب يساعد على الاحتفاظ بالرطوبة ودعم راحة البشرة حتى الصباح.'),
    t('Once or twice a week', 'Special overnight care when the skin wants the richer night.', 'Оставить на ночь', 'Последний шаг вечером один-два раза в неделю. Не смывать.', 'يترك طوال الليل', 'الخطوة الأخيرة مساءً مرة أو مرتين أسبوعياً. لا يُشطف.'),
    t('TEWL -15% · redness -26%', 'After four weeks, transepidermal water loss eased by 15%, and redness by 26%.', 'Потеря влаги −15% · покраснение −26%', 'Результаты измерены после четырёх недель применения.', 'فقدان الماء −15% · الاحمرار −26%', 'نتائج مقاسة بعد أربعة أسابيع من الاستخدام.'),
    t('Oxygen and GFs at 0%', 'Finished Oxygen is 0%. Every named growth factor prints at 0%. In the formula. Not the engine.', 'Крем-маска 100 г', 'Полноразмерная несмываемая маска с капсулами, которые растворяются в креме.', 'قناع كريمي 100 غ', 'قناع كامل الحجم يترك على البشرة، بكبسولات تذوب داخل الكريم.'),
  ],
  '39': [
    t('Measured at SPF 65.9', 'Tested in vivo; the label reads 50+ because that is the highest figure allowed.', 'SPF 65,9, измеренный in vivo', 'На упаковке указано SPF 50+ PA++++; UVA-PF составил 23,13 и 24,3.', 'SPF 65.9 مقاس على البشرة', 'تحمل العبوة تصنيف SPF 50+ PA++++، وسجل UVA-PF نتيجتي 23.13 و24.3.'),
    t('Six filters, 17.1%', 'Five organic and one mineral, giving a UVA factor of 23.1-24.3 where 22.0 is required.', 'Шесть УФ-фильтров · 17,10%', 'Homosalate 4,00%, Octisalate 3,50%, Mexoryl SX 3,069%, Tinosorb S 3,00%, Uvinul T150 2,00% и Titanium Dioxide 1,533%.', 'ستة مرشحات للأشعة · 17.10%', 'Homosalate 4.00%، Octisalate 3.50%، Mexoryl SX 3.069%، Tinosorb S 3.00%، Uvinul T150 2.00%، وTitanium Dioxide 1.533%.'),
    t('Barrier recovery trio', 'Ceramide NP, hydrolyzed hyaluronic acid and Lactobacillus ferment lysate support sun-stressed skin.', 'Ниацинамид 2%', 'Помогает сделать тон визуально более ровным.', 'نياسيناميد 2%', 'يساعد على تحسين مظهر تجانس اللون.'),
    t('Hydrolyzed HA hydration', 'Ultra-low-molecular hyaluronic acid supports a silky, non-greasy finish.', 'Аденозин 0,04%', 'Ухаживает за видимыми морщинами.', 'أدينوزين 0.04%', 'يعتني بمظهر التجاعيد.'),
    t('Oxybenzone-free', 'Formulated without oxybenzone and octinoxate — the two reef-concern UV filters.', 'Без оксибензона и октиноксата', 'Точное описание состава без нерегулируемых экологических формулировок.', 'من دون أوكسي بنزون أو أوكتينوكسات', 'وصف دقيق للتركيبة من دون ادعاءات بيئية غير منظمة.'),
    t('High-UV outdoor pick', 'Choose Ultra Shield when the UV index is high; Multi Sun is the lighter daily option.', 'Водостойкость не заявлена', 'Обновляйте не реже чем каждые два часа на улице и после воды, пота или полотенца.', 'لا يدّعي مقاومة الماء', 'يجدد كل ساعتين على الأقل في الخارج وبعد السباحة أو التعرق أو التجفيف بالمنشفة.'),
  ],
  '40': [
    t('SPF 40 / PA++ daily', 'Everyday UVA/UVB shield sized for office and light outdoor use.', 'SPF 40 PA++ на каждый день', 'Лёгкий городской санскрин с умеренной защитой от UVA.', 'SPF 40 PA++ للاستخدام اليومي', 'واقي خفيف للمدينة والمكتب بحماية متوسطة من UVA.'),
    t('Hybrid sun filters', 'Titanium Dioxide plus chemical filters — not a mineral-only sunscreen.', 'Четыре фильтра · 18,50%', 'Октиноксат 7,50%, октилсалицилат 5,00%, диоксид титана 3,00% и амилоксат 3,00%.', 'أربعة مرشحات · 18.50%', 'أوكتينوكسات 7.50%، وأوكتيل ساليسيلات 5.00%، وثاني أكسيد التيتانيوم 3.00%، وأميلوكسات 3.00%.'),
    t('Pentapeptide comfort', 'Palmitoyl Pentapeptide-4 with Centella and Scutellaria soothes sun-exposed skin.', 'Каждый фильтр измерен', 'Получены значения 7,21%, 4,96%, 2,75% и 2,98%; все четыре соответствуют спецификации.', 'قياس كل مرشح', 'سجلت القياسات 7.21% و4.96% و2.75% و2.98%، وجميعها ضمن المواصفة.'),
    t('Glow, non-greasy finish', 'Lightweight texture works as a daily under-makeup sun layer.', 'Лёгкий слой под макияж', 'Комфортная кремовая текстура для последнего утреннего шага перед макияжем.', 'خفيف تحت المكياج', 'قوام كريمي مريح لآخر خطوة صباحية قبل المكياج.'),
    t('Reapply in strong sun', 'Reapply about every 2 hours when sweating, swimming or prolonged sun.', 'Водостойкость не заявлена', 'Обновляйте не реже чем каждые два часа на улице и после воды, пота или полотенца.', 'لا يدعي مقاومة الماء', 'يجدد كل ساعتين على الأقل في الخارج وبعد السباحة أو التعرق أو التجفيف بالمنشفة.'),
    t('40 g everyday tube', 'Compact daily sunscreen format for face, neck and body touch-ups.', '40 г · pH 6,71', 'Измерен в пределах спецификации 5,00–7,00. Дерматологически протестировано.', '40 غ · pH 6.71', 'مقاس ضمن المواصفة 5.00–7.00. مختبر جلدياً.'),
  ],
  '41': [
    t('SPF 50+ / PA++++', 'Hybrid chemical + mineral filters for high UVB/UVA protection in one cushion.', 'SPF 50+ PA++++', 'Пять УФ-фильтров в компактном тонирующем кушоне.', 'SPF 50+ PA++++', 'خمسة مرشحات للأشعة فوق البنفسجية في كوشن ملون مدمج.'),
    t('Covers, shields and treats', 'Coverage, sun protection and skincare in one press — Korea licenses all three.', 'Пять фильтров · 24,50208%', 'Диоксид титана 9,00208%, октиноксат 7%, октилсалицилат 4,5%, октокрилен 2% и оксид цинка 2%.', 'خمسة مرشحات · 24.50208%', 'ثاني أكسيد التيتانيوم 9.00208%، وأوكتينوكسات 7%، وأوكتيل ساليسيلات 4.5%، وأوكتوكريلين 2%، وأكسيد الزنك 2%.'),
    t('Niacinamide 2%, adenosine 0.04%', 'The two registered actives, at the standard Korean functional doses.', 'Ниацинамид 2% · аденозин 0,04%', 'Функциональные компоненты для более ровного тона и ухода за морщинами.', 'نياسيناميد 2% · أدينوزين 0.04%', 'المكونان الوظيفيان للعناية بمظهر اللون والتجاعيد.'),
    t('Cushion + refill (15 g × 2)', 'A second 15 g refill and the puff are already in the box — twice the wear, one price.', 'Кушон 15 г + сменный блок 15 г', 'Сменный блок и спонж Waterdrop входят в комплект.', 'كوشن 15 غ + عبوة إعادة تعبئة 15 غ', 'تتضمن العلبة عبوة إعادة التعبئة وإسفنجة Waterdrop.'),
    t('Triple fixing polymers', 'Long-wear polymer system helps coverage stay put through the day.', 'Три оттенка', '#01 Ivory, #02 Beige и #03 Camel имеют одинаковые пять фильтров и функциональные компоненты.', 'ثلاث درجات', 'تشترك #01 Ivory و#02 Beige و#03 Camel في المرشحات الخمسة والمكونات الوظيفية.'),
    t('3 professional shades', '#01 Ivory, #02 Beige and #03 Camel for tone correction after treatment.', 'Водостойкость не заявлена', 'Водонепроницаемый слой относится к спонжу, а не к средству. После воды, пота или полотенца нанесите снова.', 'لا يدّعي مقاومة الماء', 'الطبقة المقاومة للماء تخص الإسفنجة لا المنتج. يجدد بعد الماء أو التعرق أو التجفيف بالمنشفة.'),
  ],
  '51': [
    t('218% hydration lift', 'Skin moisture rose from 17.27 to 48.513 in the DTS MG clinical trial.', '40 г на процедуру', 'На одну полную процедуру нужны три мерные ложки пудры.', '40 غ لكل جلسة', 'تستخدم ثلاث مغارف من البودرة لكل جلسة كاملة.'),
    t('Cools 10–11°C', 'On heated skin the treated side fell about 10 to 11°C in the published cases.', 'Четыре компонента основы', 'Диатомовая земля 41,79%, глюкоза 35%, альгин 15% и сульфат кальция 6%.', 'قاعدة نمذجة من أربعة مكونات', 'تراب الدياتوم 41.79% والغلوكوز 35% والألجين 15% وكبريتات الكالسيوم 6%.'),
    t('Mix 1 : 1.5', 'Three scoops of powder (40g) to four and a half scoops of water.', 'Смесь 1 : 1,5', 'Три мерные ложки пудры (40 г) на четыре с половиной ложки воды.', 'خلط ١ : ١.٥', 'ثلاث مغارف من البودرة (٤٠ غ) إلى أربع مغارف ونصف من الماء.'),
    t('Peel after 15–20 min', 'The mask sets in 5–10 minutes. Leave it on, then lift off in one piece.', 'Снять через 15–20 минут', 'Маска схватывается за 5–10 минут; затем выдержите полное время и снимите одним пластом.', 'يرفع بعد ١٥–٢٠ دقيقة', 'يتماسك القناع خلال ٥–١٠ دقائق؛ اتركيه حتى اكتمال المدة ثم ارفعيه كقطعة واحدة.'),
    t('Does not dry out', 'Diatomaceous earth holds moisture for the full wear, unlike a cooling alginate.', 'Дерматологически протестировано', 'Маркировка указана на зарегистрированном макете упаковки.', 'مختبر جلدياً', 'تظهر العبارة على التصميم المسجل للعبوة.'),
    t('300g · ~7 treatments', 'Each mix is 40g. The scoop is in the pack.', '300 г · ~7 процедур', 'Каждая смесь — 40 г. Мерная ложка в упаковке.', '٣٠٠ غ · نحو ٧ جلسات', 'كل خلط ٤٠ غ. المغرفة في العبوة.'),
  ],
  '55': [
    t('Blemish-care focus', 'An oil-aware home routine for combination, congested and blemish-prone skin.', 'Уход для жирной кожи', 'Косметический домашний уход для жирной, комбинированной и склонной к несовершенствам кожи.', 'روتين للبشرة الدهنية', 'روتين تجميلي منزلي للبشرة الدهنية أو المختلطة أو المعرّضة للشوائب.'),
    t('7 pieces inside', 'Four full-size daily products plus three Sea Algae sheet masks.', '7 единиц в наборе', 'Четыре полноразмерных средства и три тканевые маски по 25 г.', '7 قطع داخل المجموعة', 'أربعة منتجات يومية كاملة الحجم وثلاثة أقنعة ورقية بوزن 25 غ لكل منها.'),
    t('Complete daily core', 'Snow O₂ Cleanser, Problem Control Toner, Serum and Cream cover the core routine.', 'Точная ежедневная база', 'SNOW O₂ 180 мл, тоник 200 мл, сыворотка 30 мл и крем 50 г.', 'أساس يومي بأحجام دقيقة', 'SNOW O₂ ‏180 مل، وتونر 200 مل، وسيروم 30 مل، وكريم 50 غ.'),
    t('Mask-ready sequence', 'Use a Sea Algae mask after toner and before the leave-on serum and cream steps.', 'Маска в правильной последовательности', 'Маску Sea Algae используют после тоника, перед сывороткой и кремом.', 'ترتيب واضح للقناع', 'يُستخدم قناع Sea Algae بعد التونر وقبل السيروم والكريم اللذين يتركان على البشرة.'),
    t('One concern-led set', 'Cleansing, oil balance, targeted leave-on care and recovery masks are packed together.', 'Актуальный расчёт выгоды', 'Экономия рассчитывается по текущим ценам компонентов, а не прописывается в тексте.', 'مقارنة سعرية مباشرة', 'يحسب التوفير وفق أسعار المكونات الحالية ولا يثبت في النص.'),
    t('Save AED 197.70', 'AED 1,318 separate value; box price AED 1,120.30 after the built-in 15% saving.', 'Учитывайте чувствительность', 'Очиститель и крем ароматизированы; в тонике есть салициловая кислота и масло чайного дерева, в маске — масло мяты.', 'انتبهي للمكونات المحسسة', 'المنظف والكريم معطران؛ ويحتوي التونر على حمض الساليسيليك وزيت شجرة الشاي، والقناع على زيت النعناع.'),
  ],
  '56': [
    t('Tone + texture focus', 'A home routine built for dull, uneven-looking skin and rough surface texture.', 'Уход при неровном тоне', 'Шесть средств для косметического ухода за тусклой кожей и неровным тоном.', 'روتين لمظهر اللون غير المتجانس', 'ستة منتجات للعناية التجميلية بمظهر البهتان وعدم تجانس اللون.'),
    t('6 products inside', 'Five full-size skincare products plus one Sea Algae sheet mask.', 'Ровно шесть единиц', 'Очищение 180 мл, бустер 200 мл, сыворотка 30 мл, крем 50 г, пилинг-гель 100 г и одна маска 25 г.', 'ست قطع محددة', 'منظف 180 مل، ومعزز 200 مل، وسيروم 30 مل، وكريم 50 غ، وجل تقشير 100 غ، وقناع واحد 25 غ.'),
    t('Daily + weekly rhythm', 'Cleanser, toner, serum and cream form the daily core; peel and mask are treatment steps.', 'Ниацинамид 2% дважды', 'И сыворотка, и крем Multi Vita содержат ниацинамид 2%.', 'نياسيناميد 2% في خطوتين', 'يحتوي كل من سيروم وكريم Multi Vita على نياسيناميد بنسبة 2%.'),
    t('Matched Multi Vita duo', 'Multi Vita Radiance Serum and Cream create a coordinated leave-on pair.', 'Понятная база утром и вечером', 'Очищение, бустер, сыворотка и крем составляют ежедневную последовательность; утром завершайте уход SPF.', 'أساس صباحي ومسائي واضح', 'المنظف والمعزز والسيروم والكريم هي الخطوات اليومية، ويختتم الصباح بواقي الشمس.'),
    t('Renewal step included', 'EPI Peeling Gel adds a dedicated exfoliation step before toner, mask and leave-on care.', 'Чередуйте еженедельные шаги', 'Пилинг-гель используйте 1–2 раза в неделю, а маску 15–20 минут в другой вечер.', 'خطوتان أسبوعيتان منفصلتان', 'يستخدم جل التقشير مرة إلى مرتين أسبوعياً، والقناع 15–20 دقيقة في مساء آخر.'),
    t('Save AED 224.40', 'AED 1,496 separate value; box price AED 1,271.60 after the built-in 15% saving.', 'Актуальный расчёт выгоды', 'Экономия рассчитывается по текущим ценам компонентов, а не прописывается в тексте.', 'مقارنة سعرية مباشرة', 'يحسب التوفير وفق أسعار المكونات الحالية ولا يثبت في النص.'),
  ],
  '57': [
    t('Skincare + complexion', 'The only Beauty Box combining daily skincare, complexion coverage and makeup removal.', 'Пять продуктов, шесть единиц', 'Кушон 15 г и отдельный рефилл 15 г делают физическое число единиц равным шести.', 'خمسة منتجات وست قطع', 'يجعل الكوشن 15 غ وعبوة إعادة التعبئة المنفصلة 15 غ عدد القطع الفعلية ستاً.'),
    t('5 full-size products', 'Cleanser, toner, BB cushion, biphasic remover and overnight cream mask.', 'Выберите один из трёх оттенков', '#01 Ivory, #02 Beige или #03 Camel выбирается до добавления набора в корзину.', 'اختاري إحدى ثلاث درجات', 'تختار #01 Ivory أو #02 Beige أو #03 Camel قبل إضافة المجموعة إلى السلة.'),
    t('Daytime finish', 'Snow O₂ and Snow Booster prepare skin before the SPF 50+ PA++++ cushion.', 'Пять УФ-фильтров', 'SPF 50+ PA++++, ниацинамид 2% и аденозин 0,04% во всех оттенках.', 'خمسة مرشحات للأشعة', 'SPF 50+ PA++++ مع نياسيناميد 2% وأدينوزين 0.04% في كل درجة.'),
    t('Evening reset', 'The lip-and-eye remover and overnight mask create a separate PM cleansing and care pair.', 'Понятный порядок утром и вечером', 'Кушон завершает утро; ремувер начинает вечер только при наличии макияжа.', 'ترتيب صباحي ومسائي واضح', 'يختتم الكوشن الصباح، ويبدأ المزيل المساء فقط عند استخدام المكياج.'),
    t('Two honest rituals', 'Daytime complexion and nighttime recovery stay separate instead of forming one false sequence.', 'Ночная маска по расписанию', 'Несмываемую крем-маску используют последним шагом один-два раза в неделю.', 'قناع ليلي أسبوعي', 'يستخدم القناع الكريمي الذي يترك على البشرة كخطوة أخيرة مرة أو مرتين أسبوعياً.'),
    t('Save AED 228', 'AED 1,520 separate value; box price AED 1,292 after the built-in 15% saving.', 'Актуальный расчёт выгоды', 'Экономия рассчитывается по текущим ценам компонентов, а не прописывается в тексте.', 'مقارنة سعرية مباشرة', 'يحسب التوفير وفق أسعار المكونات الحالية ولا يثبت في النص.'),
  ],
  '58': [
    t('Firmness + line care', 'A coordinated home routine for visible fine lines, firmness and elasticity concerns.', 'Морщины + неровный тон', 'Последовательный уход за морщинами и неровным тоном.', 'العناية بالتجاعيد وتفاوت اللون', 'روتين متدرج للعناية بمظهر التجاعيد وتفاوت اللون.'),
    t('9 pieces inside', 'Four full-size daily products plus five Collagen sheet masks.', '9 единиц в наборе', 'Четыре полноразмерных средства и пять коллагеновых тканевых масок.', '9 قطع داخل المجموعة', 'أربعة منتجات يومية كاملة الحجم وخمسة أقنعة كولاجين ورقية.'),
    t('Matched treatment duo', 'Multi Functional Anti-Wrinkle Serum and Cream form the leave-on treatment pair.', 'Два зарегистрированных шага', 'Сыворотка и крем содержат ниацинамид 2% и аденозин 0,04%.', 'خطوتان مسجلتان', 'يحتوي السيروم والكريم على نياسيناميد 2% وأدينوزين 0.04%.'),
    t('Five mask sessions', 'Five individual Collagen masks support planned intensive-care nights.', 'Пять отдельных масок', 'Каждая маска 23 г используется 15–20 минут; недельная частота не указана.', 'خمسة أقنعة منفردة', 'يوضع كل قناع بوزن 23 غ لمدة 15–20 دقيقة؛ ولا تحدد العبوة وتيرة أسبوعية.'),
    t('Clear routine order', 'Cleanser → booster → optional mask → serum → cream.', 'Понятный ежедневный порядок', 'Очищение → бустер → сыворотка → крем; утром завершайте уход SPF.', 'ترتيب يومي واضح', 'منظف، ثم معزز، ثم سيروم وكريم؛ ويختتم الصباح بواقي الشمس.'),
    t('Save AED 208.50', 'AED 1,390 separate value; box price AED 1,181.50 after the built-in 15% saving.', 'Актуальный расчёт цены', 'Страница рассчитывает стоимость компонентов и выгоду по текущим ценам.', 'مقارنة سعر مباشرة', 'تحسب الصفحة قيمة المكونات والتوفير وفق الأسعار الحالية.'),
  ],
  '59': [
    t('Deep hydration focus', 'A layered home routine for dry, dehydrated skin and moisture-barrier comfort.', 'Увлажняющий уход', 'Понятная утренняя и вечерняя последовательность для сухой и обезвоженной кожи.', 'روتين ترطيب واضح', 'تسلسل صباحي ومسائي واضح للبشرة الجافة والمتعطشة للماء.'),
    t('7 pieces inside', 'Four full-size daily products plus three Sea Algae sheet masks.', '7 единиц в наборе', 'Четыре полноразмерных средства и три тканевые маски Sea Algae.', '7 قطع داخل المجموعة', 'أربعة منتجات يومية كاملة الحجم وثلاثة أقنعة ورقية Sea Algae.'),
    t('Matched Hyaluron duo', 'Moisture Replenishing Hyaluron Serum and Cream layer water-focused care together.', 'Дуэт Hyaluron с точными концентрациями', 'В сыворотке 2 000 ppm гидролизованной гиалуроновой кислоты; в креме 1 000,9 ppm высокомолекулярного гиалуроната натрия.', 'ثنائي Hyaluron بتركيزين دقيقين', 'يحتوي السيروم على حمض الهيالورونيك المتحلل 2,000 جزء في المليون، والكريم على هيالورونات الصوديوم عالية الوزن الجزيئي 1,000.9 جزء في المليون.'),
    t('Five-step layering', 'Cleanser → booster → optional mask → Hyaluron serum → Hyaluron cream.', 'Понятный ежедневный порядок', 'Очищение → бустер → сыворотка → крем; утром завершайте уход SPF.', 'ترتيب يومي واضح', 'منظف، ثم معزز، ثم سيروم وكريم؛ ويختتم الصباح بواقي الشمس.'),
    t('Three recovery masks', 'Sea Algae sheets add three separate soothing and moisture-focused sessions.', 'Три отдельные маски', 'Каждую маску используют 15–20 минут сразу после вскрытия; недельная частота не указана.', 'ثلاثة أقنعة منفردة', 'يستخدم كل قناع لمدة 15–20 دقيقة فور فتحه، ولا تحدد العبوة وتيرة أسبوعية.'),
    t('Save AED 197.70', 'AED 1,318 separate value; box price AED 1,120.30 after the built-in 15% saving.', 'Актуальный расчёт цены', 'Страница рассчитывает стоимость компонентов и выгоду по текущим ценам.', 'مقارنة سعر مباشرة', 'تحسب الصفحة قيمة المكونات والتوفير وفق الأسعار الحالية.'),
  ],
  '62': [
    t('Sensitive-barrier focus', 'A home routine for sensitive, reactive skin that prioritizes comfort and barrier support.', '6 продуктов в наборе', 'Очищение 180 мл, бустер 200 мл, сыворотка 30 мл, крем 100 г, ночная маска 100 г и одна тканевая маска 25 г.', '6 منتجات داخل المجموعة', 'منظف 180 مل ومعزز 200 مل وسيروم 30 مل وكريم 100 غ وقناع ليلي 100 غ وقناع ورقي واحد 25 غ.'),
    t('6 products inside', 'Five full-size skincare products plus one Sea Algae sheet mask.', 'Факты о сыворотке', 'MultiEx BSASM® Plus 1%, бетаин 0,5% и аллантоин 0,1%; содержит масло апельсиновой цедры и лимонен.', 'حقائق السيروم', 'MultiEx BSASM® Plus ‏1% وبيتايين 0.5% وألانتوين 0.1%؛ ويحتوي على زيت قشر البرتقال والليمونين.'),
    t('Serum + barrier cream', 'All For Sensitive Serum layers under the 100 ml Skin Barrier Protecting Cream.', 'Факты о креме', 'Церамид NP 5 000 ppm и глицерин 17,49%; содержит Parfum, линалоол и кумарин.', 'حقائق الكريم', 'سيراميد NP ‏5,000 جزء في المليون وغليسرين 17.49%؛ ويحتوي على Parfum واللينالول والكومارين.'),
    t('Two mask formats', 'A 100 g Skin Rescue Overnight Cream Mask and one Sea Algae sheet provide two distinct mask steps.', 'Режим масок', 'Ночная маска 1–2 раза в неделю; тканевая — на 15–20 минут без заданной недельной частоты.', 'توقيت القناعين', 'القناع الليلي مرة أو مرتين أسبوعياً؛ والقناع الورقي 15–20 دقيقة من دون وتيرة أسبوعية محددة.'),
    t('Barrier-first sequence', 'Cleanser → booster → optional mask → sensitive serum → barrier cream.', 'Только исследование ночной маски', 'Через четыре недели: TEWL −15% и выраженность покраснения −26%. Эти результаты не относятся ко всему набору.', 'دراسة القناع الليلي وحده', 'بعد أربعة أسابيع: TEWL ‏−15% وتحسن مظهر الاحمرار 26%. لا تنطبق النتيجتان على المجموعة.'),
    /* The parts total rose from 1,696 to 1,746 when the 340 AED overnight cream mask
       replaced the discontinued 290 AED oxymask. The box price was deliberately left
       at 1,442 rather than raised to hold 15%, so the saving is now 304 AED. */
    t('Save AED 304', 'AED 1,746 separate value; box price AED 1,442, a 17% saving.', 'Экономия 304 AED', 'Стоимость по отдельности 1 746 AED; цена набора 1 442 AED.', 'وفّر 304 دراهم', 'القيمة المنفصلة 1,746 درهماً؛ سعر المجموعة 1,442 درهماً.'),
  ],
  '63': [
    t('SPF 38 / PA+++', 'Daily BB cream with meaningful UVA/UVB protection for UAE routines.', 'SPF 38 / PA+++', 'SPF относится прежде всего к UVB; PA+++ — высокий уровень UVA-защиты, PFA 8–<16.', 'SPF 38 / PA+++', 'يتعلق SPF أساساً بـUVB؛ وتعني PA+++ حماية UVA مرتفعة، أي PFA من 8 إلى أقل من 16.'),
    t('Vita 10 complex', 'Vitamins A, B-complex, C and E support a clearer glass-skin look.', '4 УФ-фильтра', 'В Bright суммарно 21,5895%, в Natural 20,6389% из-за разной доли диоксида титана.', '4 مرشحات للأشعة', 'مجموع Bright هو 21.5895% وNatural هو 20.6389% لاختلاف ثاني أكسيد التيتانيوم.'),
    t('Herb 7 complex', 'Camellia, Centella, Tremella, Chamomile and more soothe while evening tone.', 'Два функциональных актива', 'Ниацинамид 2,000010% и аденозин 0,040000% присутствуют в обоих оттенках.', 'مادتان وظيفيتان', 'النياسيناميد 2.000010% والأدينوزين 0.040000% موجودان في الدرجتين.'),
    t('Glass-skin film network', 'Transparent gel network helps resist smudge and transfer through the day.', '2 реальных оттенка', '#01 Bright светлее; #02 Natural глубже и теплее. Пигменты и слюда тоже различаются.', 'درجتان فعليتان', '#01 Bright أفتح؛ و#02 Natural أعمق وأدفأ. كما تختلف الصبغات والميكا.'),
    t('2 glow shades', '#01 Bright for illuminating fair skin and #02 Natural for refined medium tones.', 'Граница следовых комплексов', '10 типов витаминов и 8 экстрактов присутствуют, но следовым дозам не приписаны отдельные эффекты.', 'حدود المركّبات النزرة', 'توجد عشرة أنواع من الفيتامينات وثمانية مستخلصات؛ ولا تنسب فوائد مستقلة للنسب النزرة.'),
    t('Adenosine support', 'Adenosine contributes to a smoother, more rested-looking finish.', 'Не водостойкий', 'Для надёжной защиты всего лица наносите под BB-крем достаточно отдельного санскрина.', 'غير مقاوم للماء', 'لحماية موثوقة لكامل الوجه، ضعي تحته كمية كافية من واق شمس مخصص.'),
  ],
  '66': [
    t('+145.8% post-wash hydration', 'Clinical test: immediate skin hydration improved 145.8% after cleansing.', 'Три ПАВ', 'Sodium Cocoyl Glutamate 8,75%, Cocamidopropyl Betaine 6%, Decyl Glucoside 1,65%.', 'ثلاث مواد منظفة', 'Sodium Cocoyl Glutamate ‏8.75% وCocamidopropyl Betaine ‏6% وDecyl Glucoside ‏1.65%.'),
    t('2.4× hydration boost', 'Barrier cleanser delivered a 2.4× increase in measured skin hydration.', 'Увлажняющая база', 'Глицерин 5%, бутиленгликоль 3% и бетаин 0,5% в смываемом геле.', 'قاعدة مرطبة', 'جلسرين 5% وبيوتيلين غلايكول 3% وبيتايين 0.5% في جل يُشطف.'),
    t('Pink ceramide complex', 'Pink ceramide with 5 ceramides helps reinforce the moisture barrier.', '5 керамидов в следовых количествах', 'NP, AS, AP, NS и EOP присутствуют, но их следовым концентрациям не приписывается отдельный выраженный эффект.', 'خمسة سيراميدات بتراكيز ضئيلة', 'توجد NP وAS وAP وNS وEOP، ولا ينسب إلى تراكيزها الضئيلة تأثير قوي مستقل.'),
    t('Microbiome support', 'Bifida and Lactobacillus lysates help maintain a balanced skin microbiome.', 'Заявление презентации не воспроизводится', 'Один результат DTS MG назван +145,8% / 2,4×, но график 25,59 → 56,19 даёт 2,20× / +119,6%; отчёта нет.', 'ادعاء العرض غير قابل لإعادة الحساب', 'يسمي عرض DTS MG النتيجة 145.8% / 2.4×، لكن 25.59 ← 56.19 تساوي 2.20× / 119.6%؛ والتقرير غير متوفر.'),
    t('Gel-to-foam comfort', 'Smooth-rolling gel becomes foam that cleanses with less friction.', 'pH 6,37 · отдушка 0,5%', 'Дерматологически протестировано. Формула содержит Parfum и не является продуктом без отдушки.', 'pH ‏6.37 · عطر 0.5%', 'مختبر جلدياً. تحتوي التركيبة على Parfum وليست خالية من العطر.'),
    t('200 ml / 600 ml sizes', 'Homecare 200 ml and professional 600 ml for daily barrier-first cleansing.', '200 / 600 ml', '200 ml для дома и 600 ml для профессионального использования; формула одна.', '200 / 600 ml', '200 ml منزلي و600 ml احترافي بالتركيبة نفسها.'),
  ],

  '19': [
    t('MultiEx BSASM® Plus 1%', 'Seven-botanical complex for the serum’s soothing, comfort-first formula.', 'MultiEx BSASM® Plus 1%', 'Комплекс из семи растительных экстрактов для мягкого успокаивающего ухода.', 'MultiEx BSASM® Plus بتركيز 1%', 'مركب من سبعة مستخلصات نباتية لعناية مهدئة تركز على راحة البشرة.'),
    t('Betaine 0.5%', 'Supports moisture retention and helps ease the feeling of tightness.', 'Бетаин 0,5%', 'Помогает удерживать влагу и уменьшать ощущение стянутости.', 'بيتين 0.5%', 'يدعم احتفاظ البشرة بالرطوبة ويساعد على تخفيف الإحساس بالشد.'),
    t('Allantoin 0.1%', 'A daily comfort ingredient for sensitive and reactive skin.', 'Аллантоин 0,1%', 'Поддерживает мягкость и комфорт чувствительной и реактивной кожи.', 'ألانتوين 0.1%', 'يدعم نعومة البشرة الحساسة والمتفاعلة وراحتها اليومية.'),
    t('Sodium hyaluronate 0.01%', 'Light hydration support that layers easily under cream and SPF.', 'Гиалуронат натрия 0,01%', 'Лёгкое увлажнение, которое удобно наслаивать под крем и SPF.', 'هيالورونات الصوديوم 0.01%', 'دعم خفيف للترطيب ينسجم بسهولة تحت الكريم وواقي الشمس.'),
    t('Measured pH 5.77', 'Inside the specified 5.20–6.20 range.', 'Измеренный pH 5,77', 'В пределах установленного диапазона 5,20–6,20.', 'أس هيدروجيني مقاس 5.77', 'ضمن النطاق المحدد 5.20–6.20.'),
    t('Not fragrance-free', 'Contains orange peel oil and limonene; no artificial fragrance is added.', 'Не без отдушки', 'Содержит масло апельсиновой цедры и лимонен; искусственная отдушка не добавлена.', 'ليس خالياً من العطر', 'يحتوي على زيت قشر البرتقال والليمونين، من دون إضافة عطر اصطناعي.'),
  ],
  '20': [
    t('Zinc PCA 0.05%, neat', 'Goes in undiluted, so the figure on the card is the figure on your skin.', 'Цинк PCA 0,05%', 'Помогает регулировать избыток себума и уменьшать жирный блеск.', 'زنك PCA بتركيز 0.05%', 'يساعد على تنظيم فائض الزهم وتقليل اللمعان.'),
    t('Oil and sebum control', 'The registered function of the serum: anti-blemishes, oil and sebum control.', 'Более 90% воды', 'Лёгкая текстура быстро впитывается под крем и SPF.', 'أكثر من 90% ماء', 'قوام خفيف سريع الامتصاص تحت الكريم وواقي الشمس.'),
    t('Over 90% water', 'No oil and no silicone, so it absorbs and leaves nothing sitting on the surface.', 'Трегалоза 1% + ксилитол 0,5%', 'Поддерживают увлажнение без жирного финиша.', 'تريهالوز 1% + زيليتول 0.5%', 'يدعمان الترطيب من دون لمسة نهائية دهنية.'),
    t('Comfort at readable doses', 'Panthenol 0.2%, allantoin 0.1%, trehalose 1% and xylitol 0.5%.', 'Пантенол 0,2% + аллантоин 0,1%', 'Поддерживают мягкость и комфорт кожи в ежедневном уходе.', 'بانثينول 0.2% + ألانتوين 0.1%', 'يدعمان نعومة البشرة وراحتها في العناية اليومية.'),
    t('No acid in it', 'No salicylic acid and no AHA. Black willow bark sits at 0.001%.', 'Без салициловой кислоты', 'Кора чёрной ивы присутствует на уровне 0,001%, но это не AHA/BHA-сыворотка.', 'من دون حمض الساليسيليك', 'يوجد لحاء الصفصاف بتركيز 0.001%، لكن هذا ليس سيروم AHA/BHA.'),
    t('No perfume at all', 'Not just no artificial fragrance: there is no perfume ingredient in the formula.', 'Формула без отдушки', 'Не содержит отдушки и ароматических ингредиентов.', 'تركيبة خالية من العطر', 'لا تحتوي على عطر أو مكونات عطرية.'),
  ],
  '21': [
    t('Multi Vita 12 Complex', 'Twelve-vitamin complex targets dullness and uneven tone for a brighter finish.', 'Ниацинамид 2%', '20 000 ppm в основе формулы для более ровного и сияющего тона.', 'نياسيناميد 2%', '20,000 جزء في المليون في قلب التركيبة لمظهر أكثر تجانساً وإشراقاً.'),
    t('MELAZERO® melanin care', 'Patented MELAZERO® melanin-care complex supports clearer-looking skin.', 'MELAZERO® 0,05%', 'Запатентованный комплекс: экстракт листа мушмулы 0,04% и мяты колосистой 0,01%.', 'MELAZERO® بتركيز 0.05%', 'مركب حاصل على براءة: مستخلص أوراق الأسكدنيا 0.04% والنعناع السنبلي 0.01%.'),
    t('−28.0% melanin / 2 weeks', 'Clinical chart: skin-surface melanin 6.190 → 4.457 (−28.0%) after 2 weeks.', '−28,0% за две недели', 'Показатель поверхностного меланина снизился с 6,190 до 4,457.', '−28.0% خلال أسبوعين', 'انخفض مؤشر الميلانين السطحي من 6.190 إلى 4.457.'),
    t('Niacinamide 20,000 ppm', 'Two percent, printed on the carton, and the registered whitening active in Korea.', 'Пантенол 1% + витамин C 0,1%', 'Пантенол поддерживает комфорт, а стабильный 3-O-Ethyl Ascorbic Acid дополняет уход для сияния.', 'بانثينول 1% + فيتامين C ‏0.1%', 'يدعم البانثينول راحة البشرة، ويكمل 3-O-Ethyl Ascorbic Acid الثابت روتين الإشراق.'),
    t('100% satisfaction panel', '21-woman panel: 100% reported even tone, no tightness and no irritation.', 'Измеренный pH 5,94', 'В пределах установленного диапазона 5,60–6,60.', 'أس هيدروجيني مقاس 5.94', 'ضمن النطاق المحدد 5.60–6.60.'),
    t('It may sting at first', 'The maker says so: start with a small amount and build up. Stop if it continues.', '2–3 капли', 'Мягко вбивайте утром и вечером. При чувствительной коже начните с малого; если пощипывание не проходит, прекратите применение.', 'قطرتان إلى ثلاث', 'تُربت صباحاً ومساءً. للبشرة الحساسة، يُبدأ بكمية صغيرة ويُوقف الاستخدام إذا استمر الوخز.'),
  ],
  '22': [
    t('Glycerin 25.45%', 'A quarter of the formula helps skin retain moisture and look smoother and fuller.', 'Глицерин 25,45%', 'Четверть формулы помогает коже удерживать влагу и выглядеть более гладкой и наполненной.', 'غليسرين 25.45%', 'ربع التركيبة يساعد البشرة على الاحتفاظ بالرطوبة والظهور بمظهر أكثر نعومة وامتلاءً.'),
    t('Niacinamide 2%', 'Supports a more even-looking tone, barrier comfort and natural radiance.', 'Ниацинамид 2%', 'Поддерживает более ровный тон, комфорт барьера и естественное сияние.', 'نياسيناميد 2%', 'يدعم تجانس مظهر اللون وراحة الحاجز والإشراقة الطبيعية.'),
    t('Adenosine 0.04%', 'The functional ingredient behind the Korean wrinkle-care registration.', 'Аденозин 0,04%', 'Функциональный компонент, на котором основана корейская регистрация ухода против морщин.', 'أدينوزين 0.04%', 'المكوّن الوظيفي الذي يستند إليه التسجيل الكوري للعناية بالتجاعيد.'),
    t('Bakuchiol 0.1%', 'A photostable botanical retinol alternative for morning and evening care.', 'Бакучиол 0,1%', 'Фотостабильная растительная альтернатива ретинолу для утреннего и вечернего ухода.', 'باكوتشيول 0.1%', 'بديل نباتي ثابت ضوئياً للريتينول للعناية صباحاً ومساءً.'),
    t('Six peptides · ~1.4 ppm', 'A supporting trace complex; hydration, niacinamide and adenosine lead the formula.', 'Шесть пептидов · около 1,4 ppm', 'Поддерживающий комплекс в следовой концентрации; основу формулы создают увлажнение, ниацинамид и аденозин.', 'ستة ببتيدات · نحو 1.4 جزء في المليون', 'مركب داعم بتركيز أثري؛ يتصدر الترطيب والنياسيناميد والأدينوزين عمل التركيبة.'),
    t('pH 6.78 · 30.17 ml', 'Measured inside the specified pH range and above the declared 30 ml fill.', 'pH 6,78 · 30,17 мл', 'Измеренный pH находится в заданном диапазоне, а фактическое наполнение превышает заявленные 30 мл.', 'pH ‏6.78 · 30.17 مل', 'قيمة مقاسة ضمن نطاق الحموضة المحدد، مع تعبئة تتجاوز الحجم المعلن 30 مل.'),
  ],
  '27': [
    t('Ceramide NP 0.5%', 'Five thousand ppm, and the Korean panel prints the number on the carton.', 'Церамид NP 0,5%', '5 000 ppm для поддержки защитного барьера и удержания влаги.', 'سيراميد NP ٠٫٥٪', '٥٬٠٠٠ جزء في المليون لدعم حاجز البشرة والاحتفاظ بالرطوبة.'),
    t('Glycerin 17.49%', 'Nearly a fifth of the tube, from two separate raw materials.', 'Глицерин 17,49%', 'Высокая концентрация увлажнителя помогает коже дольше сохранять мягкость.', 'غليسرين ١٧٫٤٩٪', 'تركيز مرتفع من المرطب يساعد البشرة على الحفاظ على نعومتها لمدة أطول.'),
    t('The richest of the three', '49.9% water, against 72.4% in the Hyaluron Cream and 86.6% in the Problem Control.', 'Самый насыщенный из трёх', 'Комфортная кремовая текстура для чувствительной и сухой кожи.', 'أغنى الكريمات الثلاثة', 'قوام كريمي مريح للبشرة الحساسة والجافة.'),
    t('Shea butter 3%', 'The occlusive half, with a 13% ester blend behind it.', 'Масло ши 3%', 'Смягчает сухие участки и дополняет насыщенную липидную основу.', 'زبدة الشيا ٣٪', 'تلطف المناطق الجافة وتكمل القاعدة الدهنية الغنية.'),
    t('Pat, do not rub', 'The carton asks for patting, which is unusual for a cream this rich.', 'Мягко прижмите', 'Распределите крем и мягко прижмите подушечками пальцев без активного растирания.', 'التربيت بلطف', 'يُوزع الكريم ثم يُربت بأطراف الأصابع من دون فرك زائد.'),
    t('Botanicals are a trace', 'MultiEx BSASM Plus is at 0.0001% here, against 1% in the sensitive serum.', 'Растительный комплекс · 1 ppm', 'MultiEx BSASM Plus дополняет формулу в следовой поддерживающей концентрации.', 'المركب النباتي · جزء واحد في المليون', 'يكمل MultiEx BSASM Plus التركيبة بتركيز أثري داعم.'),
  ],
  '28': [
    t('21.7% humectant base', 'Butylene glycol 10.555%, glycerin 6.175% and betaine 5% form the water-binding core.', 'Увлажняющая база 21,7%', 'Бутиленгликоль 10,555%, глицерин 6,175% и бетаин 5% образуют водосвязывающую основу формулы.', 'قاعدة مرطبة بنسبة 21.7%', 'يشكل بيوتلين غليكول 10.555% والغليسرين 6.175% والبيتين 5% أساس التركيبة الجاذب للماء.'),
    t('About −1 °C in 20 minutes', 'Measured skin temperature fell by about one degree twenty minutes after application.', 'Около −1 °C за 20 минут', 'Через 20 минут после нанесения температура кожи снизилась примерно на один градус.', 'نحو −1 °م خلال 20 دقيقة', 'انخفضت حرارة البشرة المقاسة بنحو درجة مئوية واحدة بعد عشرين دقيقة من التطبيق.'),
    t('+12% hydration', 'Measured after four weeks of regular use.', '+12% увлажнённости', 'Результат измерен после четырёх недель регулярного применения.', '+12% ترطيب', 'نتيجة مقاسة بعد أربعة أسابيع من الاستخدام المنتظم.'),
    t('Snail filtrate 10 ppm', 'Present at 0.001%, so the cream is not vegan; it is not the hydration engine.', 'Фильтрат улитки · 10 ppm', 'Присутствует в концентрации 0,001%, поэтому крем не является веганским; основу увлажнения создают три увлажнителя.', 'مرشّح إفراز الحلزون · 10 أجزاء بالمليون', 'موجود بتركيز 0.001%، لذلك الكريم غير نباتي؛ أما أساس الترطيب فهو المكونات المرطبة الثلاثة.'),
    t('Fragrance-free gel-cream', 'Transparent, light and quick to absorb, with no perfume, parabens or phenoxyethanol.', 'Гель-крем без отдушки', 'Прозрачная лёгкая текстура быстро впитывается; без парфюмерной композиции, парабенов и феноксиэтанола.', 'كريم جل من دون عطر', 'قوام شفاف وخفيف وسريع الامتصاص، من دون عطر أو بارابين أو فينوكسي إيثانول.'),
    t('50 g / 250 g · 6M', 'Homecare and professional sizes; use within six months of opening.', '50 г / 250 г · 6M', 'Домашний и профессиональный форматы; используйте в течение шести месяцев после вскрытия.', '50 غ / 250 غ · 6M', 'حجمان للاستخدام المنزلي والمهني؛ يُستخدم خلال ستة أشهر من الفتح.'),
  ],
  '29': [
    t('+82% immediate hydration', 'Clinical hydration value rose 82% immediately after a single use.', '+82% увлажнения сразу', 'Клинически увлажнение выросло на 82% сразу после одного нанесения.', '+82% ترطيب فوري', 'ارتفعت قيمة الترطيب السريرية 82% فوراً بعد استخدام واحد.'),
    t('72-hour persistence', 'Still significantly above baseline three days after a single application.', 'Держится 72 часа', 'Через трое суток после одного нанесения всё ещё значимо выше исходного.', 'ثبات ٧٢ ساعة', 'ما زال أعلى بدلالة من خط الأساس بعد ثلاثة أيام من تطبيق واحد.'),
    t('1,000.9 ppm, on the box', 'The carton prints the dose of every hyaluronate beside its name.', '1 000,9 ppm на коробке', 'Упаковка печатает дозу каждого гиалуроната рядом с названием.', '١٬٠٠٠٫٩ ppm على العلبة', 'العلبة تطبع جرعة كل هيالورونات بجانب اسمه.'),
    t('The heavy grade', 'High molecular weight hyaluronate films the surface. The serum carries the light one.', 'Высокомолекулярная форма', 'Создаёт на поверхности тонкий влагоудерживающий слой; в сыворотке используется более лёгкая гидролизованная форма.', 'فئة عالية الوزن الجزيئي', 'تكوّن طبقة خفيفة تحفظ الرطوبة على السطح، بينما يحتوي السيروم على الشكل المتحلل الأخف.'),
    t('Glycerin 9%', 'Nearly a tenth of the tube, and more than every named complex combined.', 'Глицерин 9%', 'Почти десятая часть тубы, больше всех именованных комплексов вместе.', 'جلسرين ٩٪', 'قرابة عُشر الأنبوب، وأكثر من كل مركّب مُسمّى مجتمعاً.'),
    t('Not the fridge', 'The manufacturer warns cold storage changes the viscosity and texture.', 'Не хранить в холодильнике', 'Холод может изменить вязкость и текстуру крема; храните его в прохладном сухом месте.', 'لا يحفظ في الثلاجة', 'قد تغيّر البرودة لزوجة الكريم وقوامه؛ يحفظ في مكان بارد وجاف.'),
  ],
  '18': [
    t('Hydrolyzed HA 2,000 ppm', 'The named dose. This is the moisturizing serum, not the cream.', 'Гиалуроновая кислота 2 000 ppm', 'Гидролизованная форма помогает быстро восполнить влагу и вернуть коже более гладкий вид.', 'حمض الهيالورونيك 2,000 جزء في المليون', 'يساعد الشكل المتحلل على تعويض الرطوبة سريعاً ومنح البشرة مظهراً أكثر نعومة.'),
    t('Apply and pat AM/PM', 'On the face, fingers, morning and evening. The carton stops here.', 'Утром и вечером', 'Наносите после тоника и мягко вбивайте кончиками пальцев. При необходимости завершите уход кремом.', 'صباحاً ومساءً', 'يُطبق بعد التونر ويُربت بلطف بأطراف الأصابع، ثم يُتبع بالكريم عند الحاجة.'),
    t('Hyaluronan 11 complex', 'Brand name. Eight hyaluronate INCIs. One of them is the 2,000 ppm.', 'Комплекс Hyaluronan 11', 'Фирменный комплекс представлен восемью гиалуроновыми ингредиентами, включая гидролизованную форму 2 000 ppm.', 'مركب Hyaluronan 11', 'يضم المركب التجاري ثمانية مكونات هيالورونية، منها الشكل المتحلل 2,000 جزء في المليون.'),
    t('PENTAVITIN 0.615%', 'Saccharide isomerate at a real dose. The deck calls it a moisture magnet.', 'PENTAVITIN 0,615%', 'Сахарид изомерат помогает коже дольше удерживать влагу и сохранять комфорт.', 'PENTAVITIN 0.615%', 'يساعد سكاريد أيزوميرات البشرة على الاحتفاظ بالرطوبة والحفاظ على راحتها لمدة أطول.'),
    t('Coconut water 0.80%', 'The carton calls it a coconut-water serum. Aqua is still the water. Not 78%.', 'Кокосовая вода 0,79595%', 'Дополняет водную основу сыворотки и её лёгкую освежающую текстуру.', 'ماء جوز الهند 0.79595%', 'يكمل القاعدة المائية للسيروم ويسهم في قوامه الخفيف والمنعش.'),
    t('Immediate, not +52%', 'Inner hydration moved after one use. The leftover 52% was a misread of 52.238.', 'Измеримый результат после одного применения', 'В исследовании внутреннее увлажнение выросло с 50,81 до 52,238 сразу после использования.', 'نتيجة مقاسة بعد استخدام واحد', 'ارتفع قياس الترطيب الداخلي من 50.81 إلى 52.238 مباشرة بعد الاستخدام.'),
  ],
  '15': [
    t('Zinc PCA 0.5%', 'The named active at a real dose. This is the oil-control toner, not a water toner.', 'Цинк PCA 0,5%', 'Ключевой компонент помогает контролировать избыток себума и жирный блеск.', 'زنك PCA بنسبة 0.5%', 'المكوّن الرئيسي الذي يساعد على تنظيم فائض الزهم واللمعان.'),
    t('Apply or spray AM/PM', 'After cleansing, enough to cover the face. Morning and evening.', 'Увлажняющая база 13,398%', 'Бутиленгликоль 5,423%, глицерин 4,975% и дипропиленгликоль 3% помогают удерживать влагу без тяжёлой плёнки.', 'قاعدة ترطيب 13.398%', 'يساعد بيوتلين غليكول 5.423% والغليسرين 4.975% ودايبروبيلين غليكول 3% على حفظ الرطوبة من دون طبقة ثقيلة.'),
    t('Oil control, then water', 'Takes excess oil and sebum, then puts water back. Carton function is oil control.', 'Себум ≈ −50%', 'В исследовании готового продукта количество себума снизилось примерно наполовину за четыре недели.', 'الزهم ≈ −50%', 'أظهرت دراسة على المنتج النهائي انخفاض كمية الزهم بنحو النصف خلال أربعة أسابيع.'),
    t('200 ml 360°', 'The home bottle sprays upside down for the back and the neck.', 'Не кислотный пилинг', 'Салициловая кислота присутствует в следовой концентрации 0,001%: это ежедневный себорегулирующий тоник.', 'ليس مقشراً حمضياً', 'يوجد حمض الساليسيليك بتركيز أثري 0.001%؛ فهذا تونر يومي لتنظيم الدهون.'),
    t('Sebum about 50% / 4 weeks', 'DTS MG deck figure. About half the sebum after four weeks.', 'Распыление 360°', 'Флакон 200 мл работает вверх дном, поэтому тоник удобно наносить на шею и спину.', 'رذاذ 360°', 'تعمل عبوة 200 مل عند قلبها، ما يسهل التطبيق على الرقبة والظهر.'),
    t('Non-comedogenic, QACS', 'DTS MG deck. Tested by QACS Ltd. Dermatologically tested on the carton.', 'Два объёма', '200 мл для дома и 500 мл для профессионального использования. Формула одна.', 'حجمان', '200 مل للمنزل و500 مل للاستخدام الاحترافي المنتظم، بالتركيبة نفسها.'),
  ],
  '16': [
    t('Betaine 3%', 'The named active at a real dose. This is the daily moisture toner, not a peel.', 'Бетаин 3%', 'Помогает коже удерживать воду и сохранять мягкость после очищения.', 'بيتين 3%', 'يساعد البشرة على الاحتفاظ بالماء والحفاظ على نعومتها بعد التنظيف.'),
    t('Apply or spray AM/PM', 'Enough to give moisture, morning and evening. The carton stops here.', 'Утром и вечером', 'Наносите руками или распыляйте на чистую кожу; смывать средство не нужно.', 'صباحاً ومساءً', 'يُطبق باليدين أو كرذاذ على بشرة نظيفة، ولا يحتاج إلى الشطف.'),
    t('Even on makeup', 'The carton says it can go over make-up. Before makeup it is the moisture pass.', 'Поверх макияжа', 'Мелкое распыление освежает кожу в течение дня без растирания.', 'فوق المكياج', 'ينعش الرذاذ الناعم البشرة خلال اليوم من دون فرك.'),
    t('Daily toner, all skin types', 'The line printed on the carton. Moisturizes and soothes, then refines after the cleanse.', 'Для всех типов кожи', 'Лёгкий ежедневный тоник возвращает влагу и комфорт после умывания.', 'لجميع أنواع البشرة', 'تونر يومي خفيف يعيد الرطوبة والراحة بعد التنظيف.'),
    t('Phytolex is a premix', '0.5% premix. Finished botanicals sit at 0.00765%. Not the engine.', 'Phytolex SC · 0,5%', 'Ботанический премикс; три входящих экстракта вместе составляют 0,00765% готовой формулы.', 'Phytolex SC · 0.5%', 'خليط نباتي أولي؛ وتبلغ المستخلصات الثلاثة داخله مجتمعة 0.00765% من التركيبة النهائية.'),
    t('200 ml / 1000 ml', 'Home spray or clinic pump. Same formula. Dermatologically tested.', '200 мл / 1000 мл', 'Домашний и профессиональный форматы с одной дерматологически протестированной формулой.', '200 مل / 1000 مل', 'حجمان منزلي واحترافي بالتركيبة نفسها المختبرة جلدياً.'),
  ],
  '30': [
    t('No oil in it', 'No plant oil, no butter, no wax, no emulsifier anywhere in the formula.', 'Без традиционной масляной фазы', 'Никаких растительных масел, баттеров и восков; лёгкую кремовую текстуру создают два полимера.', 'بلا طور زيتي تقليدي', 'لا زيوت نباتية ولا زبدات ولا شموع؛ ويصنع بوليمران القوام الكريمي الخفيف.'),
    t('Zinc PCA 0.05%', 'The same dose as the Problem Control Serum, so the pair is genuinely matched.', 'Цинк PCA · 0,05%', 'Та же концентрация, что в сыворотке Problem Control, для последовательного ухода за жирным блеском.', 'زنك PCA · 0.05%', 'التركيز نفسه الموجود في سيروم Problem Control، لعناية متناسقة باللمعان.'),
    t('Water, thickened', '86.6% water held in a gel by 1.3% of polymer. No oil phase to emulsify.', 'Водная гелевая основа', '86,595% воды удерживаются в лёгком геле двумя полимерами общей концентрации 1,3%.', 'قاعدة هلامية مائية', 'يتماسك 86.595% من الماء في جل خفيف بفضل بوليمرين بتركيز إجمالي 1.3%.'),
    t('Trehalose 1.5% · Xylitol 0.5%', 'Two grams of humectant in every hundred, more than every botanical combined.', 'Трегалоза 1,5% · ксилитол 0,5%', 'Два увлажняющих сахара помогают удерживать воду и сохранять комфорт без насыщенной основы.', 'تريهالوز 1.5% · زيليتول 0.5%', 'سكران مرطبان يساعدان البشرة على الاحتفاظ بالماء من دون قاعدة غنية.'),
    t('Massage, do not pat', 'The carton asks for massage here. Patting is what the serum wants.', 'Мягко массировать', 'Распределите небольшое количество по лицу массажными движениями утром и вечером.', 'يُدلك بلطف', 'تُوزع كمية صغيرة على الوجه بحركات تدليك لطيفة صباحاً ومساءً.'),
    t('50g and 250g', 'Home tube and clinic tube. The formula inside is identical.', '50 г и 250 г', 'Домашний и профессиональный форматы с одной и той же формулой.', '50 غ و250 غ', 'حجمان منزلي ومهني بالتركيبة نفسها.'),
  ],
  '31': [
    t('Niacinamide found at 2.04%', 'The certificate assays the active rather than repeating the recipe. Specified 2.00%.', 'Ниацинамид · измерено 2,04%', 'Готовый крем подтверждает заявленную рабочую концентрацию 2%.', 'نياسيناميد · المحتوى المقاس 2.04%', 'يؤكد قياس الكريم النهائي وجود المكوّن بالتركيز الفعال المحدد 2%.'),
    t('Macadamia oil 13%', 'The second ingredient after water, and the character of the whole cream.', 'Масло макадамии · 13%', 'Второй ингредиент после воды создаёт насыщенную смягчающую текстуру.', 'زيت المكاداميا · 13%', 'المكوّن الثاني بعد الماء يمنح الكريم قوامه الغني والملطف.'),
    t('−29.7% melanin / 2 weeks', 'Skin surface melanin 3.443 to 2.419 in the maker\'s two-week trial.', '−29,742% за две недели', 'Показатель поверхностного меланина снизился с 3,443 до 2,419.', '−29.742% خلال أسبوعين', 'انخفض مؤشر الميلانين السطحي من 3.443 إلى 2.419.'),
    t('The orange is astaxanthin', 'No pigment added. The shade can shift with air without the cream changing.', 'Оранжевый оттенок от астаксантина', 'Искусственный краситель не добавлен; от воздуха оттенок может немного измениться.', 'لون برتقالي من الأستازانتين', 'من دون صبغة صناعية؛ وقد يتغير اللون قليلاً عند التعرض للهواء.'),
    t('95%, not 100%', 'On the tone question the panel came back at 95%. The serum was the one at 100%.', '95% отметили более ровный тон', 'Результат опроса 21 участницы в возрасте от 20 до 59 лет.', '95% لاحظن لوناً أكثر تجانساً', 'نتيجة استبيان شمل 21 مشاركة بين 20 و59 عاماً.'),
    t('50g and 230g', 'Home tube and clinic tube. Same formula inside.', '50 г и 230 г', 'Домашний и профессиональный форматы с одной формулой.', '50 غ و230 غ', 'حجمان منزلي ومهني بالتركيبة نفسها.'),
  ],
  '32': [
    t('Glycerin 8% · emollients ≈13%', 'Humectant hydration with a substantial softening phase to help keep moisture in.', 'Глицерин 8% · эмоленты ≈13%', 'Увлажняющая и смягчающая фазы работают вместе, чтобы кожа дольше сохраняла влагу и мягкость.', 'غليسرين 8% · مطريات ≈13%', 'يجمع بين الترطيب وقاعدة مطرية تساعد البشرة على الاحتفاظ بالرطوبة والنعومة مدة أطول.'),
    t('Niacinamide 2% · adenosine 0.04%', 'Korean functional pair for brighter-looking tone and wrinkle care.', 'Ниацинамид 2% · аденозин 0,04%', 'Функциональная пара для более ровного тона и ухода за морщинами.', 'نياسيناميد 2% · أدينوزين 0.04%', 'ثنائي وظيفي لتجانس مظهر اللون والعناية بالتجاعيد.'),
    t('Mango seed butter 0.8%', 'A meaningful part of the cream base, not the whole moisturising story.', 'Масло семян манго 0,8%', 'Полноценная часть питательной основы, которая смягчает кожу и поддерживает комфорт.', 'زبدة بذور المانجو 0.8%', 'جزء فعلي من القاعدة المغذية لتلطيف البشرة ودعم راحتها.'),
    t('Bakuchiol 0.1% · peptide-free', 'Daily supporting active in a formula that does not rely on a peptide complex.', 'Бакучиол 0,1% · без пептидов', 'Мягко дополняет ежедневный уход; формула не опирается на пептидный комплекс.', 'باكوتشيول 0.1% · من دون ببتيدات', 'يكمل العناية اليومية بلطف، من دون الاعتماد على مركب ببتيدي.'),
    t('50g and 250g', 'Home and professional tubes with the same formula.', '50 г и 250 г', 'Домашний и профессиональный форматы с одной и той же формулой.', '50 غ و250 غ', 'حجمان منزلي ومهني بالتركيبة نفسها.'),
  ],
  '17': [
    t('Arbutin 2%', 'Korean brightening functional. The figure that belongs on a card.', 'Арбутин 2%', 'Помогает сделать тёмные круги и неровный тон под глазами менее заметными.', 'أربوتين ٢٪', 'يساعد على تقليل مظهر الهالات وتفاوت اللون تحت العين.'),
    t('Adenosine 0.04%', 'Korean wrinkle-care functional pair in the same serum.', 'Аденозин 0,04%', 'Ухаживает за морщинами и помогает контуру глаз выглядеть более гладким.', 'أدينوسين ٠٫٠٤٪', 'يعتني بمظهر التجاعيد ويساعد محيط العين على الظهور بمظهر أكثر نعومة.'),
    t('Deep wrinkles, dark circles, eye puffs', 'Intensive first-layer eye serum. Then the cream seals.', 'Три признака усталости', 'Уход за глубокими морщинами, тёмными кругами и склонностью к припухлости.', 'ثلاث علامات للإرهاق', 'عناية بمظهر التجاعيد العميقة والهالات والميل إلى الانتفاخ.'),
    t('Morning and evening', 'Gently pat the contour, then leave on. Cream after when you pair it.', 'Утро и вечер', 'Мягко вбить вокруг глаз и оставить на коже. При желании нанести сверху крем.', 'صباحاً ومساءً', 'يُربّت بلطف حول العين ويُترك على البشرة، ثم يُتبع بالكريم عند الرغبة.'),
    t('Avoid pregnancy / lactation', 'The pack says avoid. No retinyl and no peanut oil, and the warning still stands.', 'Не использовать при беременности и кормлении', 'На этот период выберите другое средство для контура глаз.', 'لا يُستخدم أثناء الحمل أو الرضاعة', 'يُختار منتج آخر لمحيط العين خلال هذه الفترة.'),
    t('10ml leave-on', 'Dermatologically tested intensive eye serum. Made in Korea by DTS MG.', 'Несмываемая сыворотка 10 мл', 'Дерматологически протестировано. Сделано в Корее.', 'سيروم يُترك على البشرة · ١٠ مل', 'مختبر جلدياً وصُنع في كوريا.'),
  ],
  '24': [
    t('Arbutin 2%', 'Korean brightening functional. The figure that belongs on a card.', 'Арбутин 2%', 'Главный осветляющий актив для более ровного и свежего вида кожи под глазами.', 'أربوتين ٢٪', 'المكوّن الأساسي للإشراق ولمظهر أكثر تجانساً وحيوية تحت العين.'),
    t('Adenosine 0.04%', 'Korean wrinkle-care functional pair in the same cream.', 'Аденозин 0,04%', 'Функциональный актив для ухода за морщинами и более гладкого вида контура глаз.', 'أدينوزين ٠٫٠٤٪', 'مكوّن وظيفي للعناية بالتجاعيد ومظهر أكثر نعومة لمحيط العين.'),
    t('Wrinkles, dark circles, puffiness', 'All-in-one daily eye cream. Firmer, brighter, more defined look.', 'Морщины, тёмные круги, припухлость', 'Ежедневный крем помогает контуру глаз выглядеть более гладким, светлым и отдохнувшим.', 'تجاعيد وهالات وانتفاخ', 'كريم يومي يساعد محيط العين على الظهور بمظهر أكثر نعومة وإشراقاً وحيوية.'),
    t('Morning and evening', 'Tap and massage the contour, then leave on. Serum first when you pair it.', 'Утро и вечер', 'Мягко распределить по контуру глаз и оставить на коже. При совместном применении сначала нанести сыворотку.', 'صباحاً ومساءً', 'توزع كمية صغيرة بلطف وتُترك على البشرة. عند استخدام السيروم، يُطبق أولاً.'),
    t('Avoid pregnancy / lactation', 'The pack says avoid. The cream carries a retinyl palmitate ester and peanut oil.', 'Не использовать при беременности и кормлении', 'На этот период выберите другое средство. Крем содержит арахисовое масло.', 'لا يُستخدم أثناء الحمل أو الرضاعة', 'يُختار منتج آخر خلال هذه الفترة. يحتوي الكريم على زيت الفول السوداني.'),
    t('20g leave-on', 'Dermatologically tested daily eye cream. Made in Korea by DTS MG.', 'Несмываемый крем 20 г', 'Ежедневный крем, дерматологически протестирован. Сделано в Корее.', 'كريم يُترك على البشرة · ٢٠ غ', 'كريم يومي مختبر جلدياً وصنع في كوريا.'),
  ],
  '33': [
    t('Niacinamide 2%', 'The brightening functional. This is the figure that belongs on a card.', 'Ниацинамид 2%', 'Помогает сделать тон под глазами визуально более ровным и свежим.', 'نياسيناميد ٢٪', 'يساعد على تحسين مظهر تجانس اللون والنضارة تحت العين.'),
    t('Adenosine 0.04%', 'The wrinkle-care functional pair. Help the look of lines, not a lift story.', 'Аденозин 0,04%', 'Ухаживает за видимыми морщинами и поддерживает более гладкий вид кожи.', 'أدينوزين ٠٫٠٤٪', 'يعتني بمظهر التجاعيد ويدعم مظهراً أكثر نعومة لمحيط العين.'),
    t('Take-off hydrogel', 'Under the eyes and/or brow bones for 20 to 40 minutes, then remove.', 'Снимаемые гидрогелевые патчи', 'Под глаза и/или под брови на 20–40 минут, затем снять.', 'لصقات هيدروجيل قابلة للإزالة', 'توضع تحت العينين و/أو أسفل الحاجبين لمدة ٢٠–٤٠ دقيقة ثم تزال.'),
    t('60 patches / 30 uses', '101g jar. Spoon in the lid. Thirty applications, sixty pieces.', '60 патчей / 30 применений', 'Банка 101 г и удобная ложечка: тридцать полноценных применений.', '٦٠ لصقة / ٣٠ استخداماً', 'عبوة ١٠١ غ مع ملعقة عملية، تكفي ثلاثين استخداماً كاملاً.'),
    t('Cooler as it sits', 'Body heat makes the gel more fluid. Moisture displaces heat, so the contour feels cooler.', 'Приятная прохлада', 'Гидрогель становится мягче от тепла кожи и дарит деликатной зоне освежающее ощущение.', 'انتعاش لطيف', 'يزداد الهيدروجيل مرونة مع حرارة البشرة ويمنح المنطقة إحساساً منعشاً ومريحاً.'),
    t('Peptide at 46.5 ppb', 'Acetyl Hexapeptide-8 sits at 46.5 ppb. In the formula. Not the engine.', 'Ацетилгексапептид-8 · 46,5 ppb', 'Пептид присутствует в очень малой концентрации; основные функциональные активы — ниацинамид и аденозин.', 'أسيتيل هكساببتيد-8 · ٤٦٫٥ جزءاً في المليار', 'يوجد بتركيز بالغ الانخفاض، بينما يعتمد الأداء الوظيفي الأساسي على النياسيناميد والأدينوزين.'),
  ],
  '43': [
    t('Copper Tripeptide-1', 'Stimulates dermal papilla cells and helps inhibit 5α-reductase pathways.', 'Питание кожи головы', 'Зарегистрирован для питания кожи головы и кондиционирования волос.', 'تغذية فروة الرأس', 'مسجل لتغذية فروة الرأس وتكييف الشعر.'),
    t('Anagen-support actives', 'Formula supports a healthier scalp environment for the growth phase.', 'Три охлаждающих компонента', 'Ментол 0,3%, ментиллактат 0,04% и Methyl Diisopropyl Propionamide 0,04%.', 'ثلاثة مكونات مبردة', 'منثول 0.3% ومنثيل لاكتات 0.04% وMethyl Diisopropyl Propionamide 0.04%.'),
    t('Leave on 3–4 hours', 'Do not rinse — leave on for at least 3–4 hours for contact time.', 'Салициловая кислота 0,25%', 'Поддерживает ощущение чистоты; перед применением проверьте противопоказания по салицилатам.', 'حمض الساليسيليك 0.25%', 'يدعم شعور النظافة؛ يجب مراجعة موانع الساليسيلات قبل الاستخدام.'),
    t('Menthol cool finish', 'Cooling menthol comfort helps calm heat and scalp irritation feel.', 'Пантенол 0,2%', 'Вместе с аллантоином 0,1% для кондиционирующего ухода.', 'بانثينول 0.2%', 'مع ألانتوين 0.1% للعناية الملطفة.'),
    t('Daily scalp tonic', 'Targeted leave-on tonic for thinning-concern scalp routines.', 'Денатурированный спирт 9,5%', 'Быстро высыхающая основа может не подойти чувствительной или раздражённой коже головы.', 'كحول محوّل 9.5%', 'قاعدة سريعة الجفاف قد لا تناسب فروة الرأس الحساسة أو المتهيجة.'),
    t('Pairs with scalp brush', 'Use after Scalp Brush massage to improve tonic contact.', 'Утро + вечер · 3–4 часа', 'Распределите круговыми движениями и не смывайте минимум 3–4 часа. Используйте в течение трёх месяцев после вскрытия.', 'صباحاً ومساءً · 3–4 ساعات', 'يدلك بحركات دائرية ويترك 3–4 ساعات على الأقل. يستخدم خلال ثلاثة أشهر من الفتح.'),
  ],
  '44': [
    t('Sebum-aware shampoo', 'Helps reduce excess sebum while cleansing the scalp.', 'Очищение кожи головы и волос', 'Зарегистрированная функция за пределами Кореи.', 'تنظيف فروة الرأس والشعر', 'الوظيفة المسجلة خارج كوريا.'),
    t('HP-DCC Complex', 'Complex support for scalp comfort and healthier-looking hair roots.', 'Кофеин 1,000%', 'Один полный процент в смываемой формуле.', 'كافيين 1.000%', 'واحد بالمئة كامل في تركيبة تُشطف.'),
    t('Growth-factor support', 'Helps increase expression of hair-growth factors such as VEGF.', 'Ментол 1,120%', 'С ментиллактатом 0,080% для выраженной охлаждающей свежести.', 'منثول 1.120%', 'مع منثيل لاكتات 0.080% لانتعاش مبرد واضح.'),
    t('Cooling menthol rinse', 'Menthol cooling comfort after wash for irritated, oily scalps.', 'Без SLS и SLES', 'Основной ПАВ — Sodium C14-16 Olefin Sulfonate, сульфонат, а не сульфат.', 'من دون SLS أو SLES', 'المنظف الرئيسي Sodium C14-16 Olefin Sulfonate، وهو سلفونات لا سلفات.'),
    t('Flake + residue cleanse', 'Helps remove flaking and sebum remnants before tonic or ampoule steps.', 'pH 5,6', 'Измерен в пределах спецификации 4,50–6,50.', 'رقم هيدروجيني 5.6', 'مقاس ضمن المواصفة 4.50–6.50.'),
    t('Medi-scalp daily wash', 'Professional medi-scalp shampoo format for regular hair-loss routines.', '3–5 мл · около 3 минут', 'Вспеньте на влажной коже головы, ненадолго оставьте и тщательно смойте.', '3–5 مل · نحو 3 دقائق', 'تكوّن الرغوة على فروة مبللة وتترك قليلاً ثم تشطف جيداً.'),
  ],
  '45': [
    t('Multi growth-factor ampoule', 'VEGF, HGH, EGF and VIP peptides support follicle nutrition delivery.', 'Несмываемый кондиционирующий раствор', 'Зарегистрирован для питания и кондиционирования волос, без заявления о лечении выпадения.', 'محلول تكييف يترك دون شطف', 'مسجل لإمداد الشعر بالتغذية وتكييفه، من دون ادعاء لعلاج التساقط.'),
    t('Copper Tripeptide-1', 'Copper peptide helps create a healthier scalp environment for growth.', '4 мл × 8 одноразовых ампул', 'Откройте перед процедурой, используйте сразу и утилизируйте остаток.', '4 مل × 8 أمبولات أحادية الاستخدام', 'تفتح قبل الجلسة وتستخدم فوراً ثم يتم التخلص من المتبقي.'),
    t('Saw palmetto support', 'Serenoa serrulata extract targets common hair-loss pathway concerns.', 'Кондиционирующий уход', 'Ментол 0,200%, ниацинамид и пантенол по 0,100%.', 'عناية ملطفة', 'منثول 0.200% مع نياسيناميد وبانثينول 0.100% لكل منهما.'),
    t('Microneedling-ready', 'Formulated for stamp/roller delivery into the scalp.', 'Точные концентрации пептидов', 'Copper Tripeptide-1 5 ppm; четыре рекомбинантных пептида суммарно 1,2 ppm.', 'تراكيز ببتيدات دقيقة', 'Copper Tripeptide-1 بتركيز 5 أجزاء في المليون؛ وأربعة ببتيدات مؤتلفة بمجموع 1.2.'),
    t('Clinic + homecare kits', 'Available in professional and home kits with applicators.', 'Профессиональный и домашний протоколы', 'Профессиональная глубина 0,25–0,5 мм или домашняя техника с аппликатором.', 'بروتوكول مهني ومنزلي', 'عمق مهني 0.25–0.5 مم أو تقنية أداة التطبيق المنزلية الموثقة.'),
    t('4 ml treatment vials', 'Single-dose style vials keep each session fresh and measured.', 'Измеренный pH 6,65', 'В пределах спецификации pH 6,00–7,00.', 'رقم هيدروجيني مقاس 6.65', 'ضمن المواصفة المكتوبة 6.00–7.00.'),
  ],
  '49': [
    t('5 LED wavelengths', '423 / 532 / 583 / 640 / 830 nm modes for multi-concern LED care.', '1 710 светодиодов', '380 красных, 380 синих, 380 зелёных, 380 жёлтых и 190 инфракрасных.', '1,710 صمام LED', '380 أحمر و380 أزرق و380 أخضر و380 أصفر و190 تحت الأحمر.'),
    t('Near-IR SMD LEDs', 'High-brightness near-infrared SMD LEDs support regeneration protocols.', '5 опубликованных длин волн', '423 / 532 / 583 / 640 / 830 нм; полоса каждого режима 20 ±5 нм.', '5 أطوال موجية منشورة', '423 / 532 / 583 / 640 / 830 نانومتر؛ عرض النطاق 20 ±5 لكل وضع.'),
    t('Postcare pairing', 'Often paired with Peptide Gel Mask under red light for recovery.', 'Дозиметрия по режимам', 'Для каждой длины волны опубликованы плотность мощности и стандартная доза.', 'بيانات جرعات لكل وضع', 'شدة إشعاع وجرعة معيارية منشورتان لكل طول موجي.'),
    t('Professional device', 'Clinic LED tool for regeneration, soothing and trouble-care protocols.', 'Два сценария сочетания', 'Цвет + ИК одновременно; красный + другой цвет чередуются каждые 3 секунды.', 'طريقتان للجمع', 'لون + تحت الأحمر معاً؛ والأحمر + لون آخر بالتناوب كل 3 ثوانٍ.'),
    t('Broad 423–830 nm range', 'Covers blue-to-near-IR spectrum in one device workflow.', '70 Вт электрической мощности', 'Суммарный оптический выход в ваттах производитель не публикует.', '70 واط قدرة كهربائية مقدرة', 'لا تنشر الشركة إجمالي الخرج الضوئي بالواط.'),
    t('Protocol-driven use', 'Select wavelength by concern instead of one generic light setting.', '520 × 220 × 315 мм · 2,6 кг', 'Опубликованные габариты и вес IR II.', '520 × 220 × 315 مم · 2.6 كغ', 'الأبعاد والوزن المنشوران لطراز IR II.'),
  ],
  '60': [
    t('60,000 ppm spicules', 'Professional BIO-MESO dose for intensive no-needle microneedling.', 'Комплекс 60 000 ppm', 'Число относится ко всему комплексу BIO-MESO™ PDRN, а не к одному PDRN или количеству спикул.', 'مركب بتركيز 60,000 ppm', 'يشير الرقم إلى مركب BIO-MESO™ PDRN كاملاً، وليس إلى PDRN وحده أو عدد الشويكات.'),
    t('3rd-gen cog spicules', 'Phytosome-coated cog spicules deliver PDRN while forming microchannels.', 'Hydrolyzed Sponge 5,72022%', 'Материал из пресноводной губки, второй компонент после воды в количественной формуле.', 'Hydrolyzed Sponge بنسبة 5.72022%', 'مادة من إسفنج المياه العذبة، وهي ثاني مكوّن بعد الماء في التركيبة الكمية.'),
    t('PDRN + panthenol', 'BIO-MESO™ PDRN with panthenol and anti-aging complex for barrier repair.', 'Sodium DNA 1 120 ppm', 'PDRN из молок лосося; 0,112% в формуле.', 'Sodium DNA بتركيز 1,120 ppm', 'PDRN من حليب السلمون؛ بنسبة 0.112% في التركيبة.'),
    t('Bio-peeling turnover', 'Spicule peel-off effect boosts turnover, collagen and elastin production.', 'Ниацинамид 2% + аденозин 0,04%', 'Функциональная пара для осветления и ухода за видимыми морщинами.', 'نياسيناميد 2% + أدينوزين 0.04%', 'الثنائي الوظيفي للتفتيح والعناية بمظهر التجاعيد.'),
    t('Clinic-first intensity', 'High-dose professional step before gentler 5000 homecare maintenance.', 'Пантенол 1%', '10 000 ppm в зарегистрированной количественной формуле.', 'بانثينول 1%', '10,000 جزء في المليون في التركيبة الكمية المسجلة.'),
    t('No classic needles', 'Liquid / bio microneedling pathway without traditional needle devices.', 'Исследование на 20 женщинах', 'Одно применение; измерения морщин, упругости и увлажнённости до четвёртой недели.', 'دراسة على 20 امرأة', 'استخدام واحد؛ قياسات للتجاعيد والمرونة والترطيب حتى الأسبوع الرابع.'),
  ],
  '65': [
    t('Sodium DNA 1,010 ppm', 'Verified PDRN level for ongoing homecare regeneration.', 'Полный комплекс 5 000 ppm', 'Число относится ко всему комплексу BIO-MESO™ PDRN, а не к одному Sodium DNA или количеству спикул.', 'المركب الكامل 5,000 ppm', 'يشير الرقم إلى مركب BIO-MESO™ PDRN كاملاً، وليس إلى Sodium DNA وحده أو عدد الشويكات.'),
    t('5,000 ppm spicules', 'Moderate spicule dose for weekly reinforcement between clinic visits.', 'Hydrolyzed Sponge 0,476685%', 'Точная доля в зарегистрированной количественной формуле.', 'Hydrolyzed Sponge بنسبة 0.476685%', 'النسبة الدقيقة في التركيبة الكمية المسجلة.'),
    t('1.25–1.5M spicules / tube', 'About 25,000–30,000 spicules per ml in the 50 ml tube.', 'Sodium DNA 1 010 ppm', 'Компонент из молок лосося; 0,101% в формуле.', 'Sodium DNA بتركيز 1,010 ppm', 'من حليب السلمون؛ بنسبة 0.101% في التركيبة.'),
    t('Weekly evening ritual', 'Use once weekly at night; expect a 6-day renewal timeline.', 'Ниацинамид 2% + аденозин 0,04%', 'Функциональная пара для осветляющего ухода и ухода за видимыми морщинами.', 'نياسيناميد 2% + أدينوزين 0.04%', 'الثنائي الوظيفي للتفتيح والعناية بمظهر التجاعيد.'),
    t('EGF + 7 peptides', 'EGF and 7-peptide complex support collagen remodeling between visits.', 'Пантенол 1%', '10 000 ppm в зарегистрированной количественной формуле.', 'بانثينول 1%', '10,000 جزء في المليون في التركيبة الكمية المسجلة.'),
    t('5 ceramides barrier', 'Five ceramides plus phytosphingosine help reinforce the barrier after peel.', '9 пептидов + 5 церамидов', 'Присутствуют в следовых концентрациях; отдельный результат для них исследованием этой ампулы не установлен.', '9 ببتيدات + 5 سيراميدات', 'موجودة بتراكيز ضئيلة؛ ولا توجد دراسة فعالية خاصة بالأمبولة تثبت لها نتيجة مستقلة.'),
  ],
  '36': [
    t('Eucalace® sheet tech', 'Ocean-inspired sheet mask designed for intensive soothing contact.', 'Эвкалиптовое полотно Eucalace®', 'Тонкое воздухопроницаемое полотно плотно прилегает и равномерно передаёт эссенцию.', 'ورقة أوكالبتوس Eucalace®', 'نسيج رقيق ونافذ للهواء يلتصق جيداً ويوزع الخلاصة بالتساوي.'),
    t('Seaweed herb complex', 'Marine botanical complex helps replenish comfort in stressed skin.', 'Увлажняющая база 15,535%', 'Метилпропандиол 10%, глицерин 5,035% и бетаин 0,5%.', 'قاعدة ترطيب 15.535%', 'ميثيل بروبانديول 10% وغليسرين 5.035% وبيتايين 0.5%.'),
    t('Centella calm support', 'Centella extract supports recovery when skin feels hot or reactive.', 'Аллантоин + пантенол по 0,1%', 'Успокаивающая пара поддерживает комфорт кожи в течение 15–20 минут.', 'ألانتوين + بانثينول 0.1%', 'ثنائي مهدئ يدعم راحة البشرة طوال 15–20 دقيقة.'),
    t('Post-heat rescue mask', 'Ideal after sun, flights, peels or device treatments.', 'Без искусственного пигмента', 'Зелёный оттенок эссенции создаёт экстракт плодов гардении.', 'من دون صبغة صناعية', 'يمنح مستخلص ثمرة الغاردينيا الخلاصة لونها الأخضر.'),
    t('Deep moisture sheet', 'Sheet occlusion helps drive soothing essence into dehydrated skin.', 'Водоросли по 10 ppm', 'Jania Rubens и Undaria Pinnatifida присутствуют по 10 ppm, как указано на упаковке.', 'طحالب بتركيز 10 ppm', 'يوجد Jania Rubens وUndaria Pinnatifida بتركيز 10 ppm كما هو موضح على العبوة.'),
    t('Single-use intensive', 'Ready-to-use mask for targeted recovery nights.', 'Одна маска 25 г', 'Использовать сразу после вскрытия, оставить на 15–20 минут и утилизировать.', 'قناع واحد 25 غ', 'يُستخدم فور الفتح، ويُترك 15–20 دقيقة ثم يُتخلص منه.'),
  ],
  '50': [
    t('Four-piece eye sequence', 'Serum, 0.25mm eye roller, patches 20-40 min, then cream.', 'Полный ритуал из четырёх этапов', 'Очищение, сыворотка с роллером 0,25 мм, патчи на 20–40 минут, затем крем.', 'طقوس متكاملة من أربع خطوات', 'تنظيف، سيروم مع رولر 0.25 مم، لصقات لمدة 20–40 دقيقة، ثم الكريم.'),
    t('Arbutin 2% on two leave-ons', 'Serum and cream share the Korean pair: arbutin 2% + adenosine 0.04%.', 'Арбутин 2% + аденозин 0,04%', 'Функциональная пара в сыворотке и креме для более ровного тона и ухода за морщинами.', 'أربوتين 2% + أدينوزين 0.04%', 'ثنائي وظيفي في السيروم والكريم للعناية بمظهر اللون والتجاعيد.'),
    t('Niacinamide 2% on the patches', 'Take-off hydrogel. Niacinamide 2% + adenosine 0.04%. Then remove.', 'Ниацинамид 2% + аденозин 0,04%', 'Функциональная пара в увлажняющих гидрогелевых патчах.', 'نياسيناميد 2% + أدينوزين 0.04%', 'ثنائي وظيفي في لصقات الهيدروجيل المرطبة.'),
    t('0.25mm eye roller, kit only', 'One-body, 60 needles. Not the 450-needle face roller.', 'Эксклюзивный роллер 0,25 мм', 'Цельный роллер на 60 игл, доступный только в этом наборе.', 'رولر عين حصري بعمق 0.25 مم', 'تصميم من قطعة واحدة يضم 60 إبرة، ولا يتوفر إلا في هذا الطقم.'),
    t('Registered Korean kit', 'Own carton, own barcode. Not a UAE-assembled beauty box.', 'Повторное использование после дезинфекции', 'Перед повторным применением выдержать 5 минут в растворе хлоргексидина; только для личного использования.', 'قابل لإعادة الاستخدام بعد التعقيم', 'يعقم 5 دقائق في محلول الكلورهيكسيدين قبل إعادة الاستخدام؛ للاستعمال الشخصي فقط.'),
    t('Peanut oil in the cream', 'Skip the kit if peanut is an allergen, or buy serum and patches alone.', 'Арахисовое масло в креме', 'Не используйте набор при аллергии на арахис.', 'زيت الفول السوداني في الكريم', 'لا يُستخدم الطقم عند وجود حساسية من الفول السوداني.'),
  ],


  '25': [
    t('Post-treatment recovery', 'Specialized cream for calming skin after professional procedures.', 'Комфорт после процедур', 'Несмываемый крем для целой кожи после профессиональных процедур.', 'راحة بعد الإجراءات', 'كريم يُترك على البشرة السليمة بعد الإجراءات الاحترافية.'),
    t('Centella repair complex', 'Centella-focused care helps redness and irritation settle faster.', 'Увлажняющая база 18,39%', 'Бутиленгликоль 12% и глицерин 6,39% поддерживают влагу и комфорт.', 'قاعدة ترطيب 18.39%', 'بيوتيلين غلايكول 12% وغليسرين 6.39% لدعم الترطيب والراحة.'),
    t('Redness + edema comfort', 'Supports comfort when skin shows erythema or post-care puffiness.', 'Три успокаивающих компонента', 'Производное солодки, экстракт шлемника и аллантоин — по 0,2% каждого.', 'ثلاثة مكوّنات مهدئة', 'مشتق عرق السوس ومستخلص السكوتيلاريا والألانتوين بتركيز 0.2% لكل منها.'),
    t('Peptide support layer', 'Peptide technology helps the skin look calmer during recovery.', 'Деликатный этап без активов', 'Без ретиноидов, кислот, арбутина, аденозина и UV-фильтров.', 'خطوة لطيفة بلا مكوّنات قوية', 'من دون ريتينويدات أو أحماض أو أربوتين أو أدينوزين أو فلاتر UV.'),
    t('Clinic finish cream', 'Final leave-on step after needling, peels or device treatments.', 'Срок определяет специалист', 'Начинайте только после подтверждения специалиста, что кожа целая.', 'موعد يحدده المختص', 'يبدأ الاستخدام فقط بعد تأكيد المختص أن سطح البشرة سليم.'),
    t('Daily barrier seal', 'Also useful as a soothing day cream when skin feels reactive.', 'Повторяйте по потребности', 'Используйте утром и вечером и повторяйте при сухости или стянутости.', 'يُعاد عند الحاجة', 'يُستخدم صباحاً ومساءً ويُعاد عند عودة الجفاف أو الشد.'),
  ],
  '38': [
    t('Gel + sheet, ten minutes', 'Acidic gel and a bicarbonate sheet meet on dry skin. CO₂ forms, you wait ten minutes, you rinse.', 'Гель + маска, 10 минут', 'Кислый гель и маска с гидрокарбонатом натрия соединяются на сухой коже. Через 10 минут маску снимают, а гель тщательно смывают.', 'جل + قناع، 10 دقائق', 'يلتقي الجل الحمضي بالقناع المحتوي على بيكربونات الصوديوم على البشرة الجافة. بعد 10 دقائق يرفع القناع ويشطف الجل جيداً.'),
    t('Sodium bicarbonate 9%', 'The reaction partner in the mask. Without it there is no CO₂.', 'Гидрокарбонат натрия 9%', 'Содержится в пропитке маски и участвует в реакции с кислым гелем с образованием CO₂.', 'بيكربونات الصوديوم 9%', 'توجد في خلاصة القناع وتشارك في التفاعل مع الجل الحمضي لتكوين CO₂.'),
    t('Five treatments', 'Gel 20g ×5, mask 12g ×5, spatula ×1. No peptide sheet in the box.', 'Пять процедур', 'В коробке пять тюбиков геля по 20 г, пять масок по 12 г и один шпатель.', 'خمس جلسات', 'تحتوي العلبة على خمسة أنابيب جل بوزن 20 غ، وخمسة أقنعة بوزن 12 غ، وملعقة تطبيق.'),
    t('Once or twice a week', 'Standard once a week. Twice on the intensive programme.', 'Один или два раза в неделю', 'Стандартная программа — раз в неделю; интенсивная — дважды в неделю.', 'مرة أو مرتان أسبوعياً', 'البرنامج المعتاد مرة أسبوعياً، والبرنامج المكثف مرتان أسبوعياً.'),
    t('Dry skin first', 'Cleanse, dry thoroughly, gel, then the sheet coated side up.', 'Нанесение на сухую кожу', 'Очистите и полностью высушите кожу, распределите гель, затем наложите маску стороной с покрытием наружу.', 'يطبق على بشرة جافة', 'تنظف البشرة وتجفف تماماً، ثم يوزع الجل ويوضع القناع بحيث يكون الجانب المطلي إلى الخارج.'),
    t('Weekly home kit', 'A weekly carboxy step, not a daily cream and not a clinic-only protocol.', 'Измеренный pH геля 2,2', 'Кислый гель находится в пределах заявленной спецификации pH 2,0–3,0.', 'الأس الهيدروجيني المقاس 2.2', 'يقع الجل الحمضي ضمن مواصفة الأس الهيدروجيني الموثقة 2.0–3.0.'),
  ],
  '42': [
    t('SPF 30 / PA++ BB', 'Daily blemish balm with SPF 30 PA++ for lighter coverage days.', 'SPF 30 / PA++', 'Три УФ-фильтра составляют 19,70% формулы.', 'SPF 30 / PA++', 'تشكل ثلاثة مرشحات 19.70% من التركيبة.'),
    t('Tone-correcting base', 'Evens the look of imperfections while keeping a skincare-first finish.', 'Арбутин 2%', 'В готовом креме измерено 1,81%; учитывайте специальное предупреждение для арбутина.', 'أربوتين 2%', 'بلغ المحتوى المقاس 1.81% في الكريم النهائي، مع تحذير الأربوتين الخاص.'),
    t('Everyday office SPF', 'Useful under makeup or alone for commute and indoor-outdoor days.', 'Аденозин 0,04%', 'Функциональный компонент для ухода за морщинами; измерено 0,04%.', 'أدينوزين 0.04%', 'المكون الوظيفي للعناية بمظهر التجاعيد؛ بلغ المحتوى المقاس 0.04%.'),
    t('Skincare BB hybrid', 'Coverage plus conditioning actives for a less makeup-heavy look.', 'Один оттенок', 'Единая система оттенка на основе оксидов железа и диоксида титана.', 'درجة واحدة', 'نظام لون واحد يعتمد على أكاسيد الحديد وثاني أكسيد التيتانيوم.'),
    t('Lighter than cushion SPF', 'Choose when you want BB coverage without the SPF 50+ cushion level.', 'Пять исключений', 'Без парабенов, искусственной отдушки, минерального масла, этанола и феноксиэтанола.', 'خمس مواد مستبعدة', 'من دون بارابين أو عطر صناعي أو زيت معدني أو إيثانول أو فينوكسي إيثانول.'),
    t('Daily tube format', 'Practical cream format for quick morning application.', 'Не водостойкий и не веганский', 'Водостойкость не заявлена; содержит пчелиный воск 2%.', 'غير مقاوم للماء أو نباتي', 'لا يدّعي مقاومة الماء، ويحتوي على شمع العسل 2%.'),
  ],
  '46': [
    t('Scalp peel prep', 'Light scalp peeling cleanses keratin and sebum before tonic or ampoule steps.', 'Очищение за пять минут', 'Нанесите ватной палочкой, помассируйте, оставьте на пять минут и не смывайте.', 'تنظيف خلال خمس دقائق', 'يوزع بعود قطني، وتدلك الفروة، ويترك خمس دقائق من دون شطف.'),
    t('Copper peptide cleanse', 'Copper Tripeptide-1 supports a healthier-feeling scalp environment.', 'Спиртовая основа 33,6%', 'Концентрированное несмываемое очищение себума, поверхностных чешуек и остатков стайлинга.', 'قاعدة كحولية 33.6%', 'تنظيف مركز يترك على الفروة لإزالة الدهون والقشور السطحية وبقايا التصفيف.'),
    t('Saw palmetto support', 'Serenoa extract targets common scalp concerns linked to thinning.', 'Охлаждающая пара 1,7%', 'Ментол 0,9% и ментиллактат 0,8% дают самую высокую суммарную концентрацию охлаждающих компонентов в линии HR³.', 'ثنائي تبريد 1.7%', 'منثول 0.9% مع منثيل لاكتات 0.8%، وهو أعلى مجموع لعوامل التبريد في مجموعة HR³.'),
    t('BHA scalp refine', 'Salicylic acid helps clear residue for better treatment contact.', 'Салициловая кислота: 99 ppm', 'Присутствует в концентрации 0,0099%, поэтому средство не позиционируется как BHA-пилинг рабочей силы.', 'حمض الساليسيليك: 99 جزءاً بالمليون', 'موجود بتركيز 0.0099%، لذلك لا يقدم كمقشر BHA بتركيز فعال.'),
    t('Cooling menthol refresh', 'Menthol cooling comfort after peel prep.', 'pH 4,31', 'Измерен в пределах спецификации готового продукта 4,00–5,00.', 'رقم هيدروجيني 4.31', 'مقاس ضمن مواصفة المنتج النهائي من 4.00 إلى 5.00.'),
    t('Pre-microneedling step', 'Standard first step before Hair Solution + stamp protocols.', 'Только неповреждённая кожа', 'Не антисептик. Не наносить после микронидлинга или на уже проколотую кожу.', 'على فروة سليمة فقط', 'ليس مطهراً، ولا يوضع بعد الميكرونيدلينغ أو على جلد سبق وخزه.'),
  ],
  '61': [
    t('One manual brush', 'A single brush with no replacement heads.', 'Одна ручная щётка', 'Один аксессуар без сменных насадок.', 'فرشاة يدوية واحدة', 'أداة واحدة من دون رؤوس بديلة.'),
    t('Soft silicone', 'Flexible tapered tips for gentle, controlled contact.', 'Мягкий силикон', 'Гибкие конусные зубцы для мягкого контролируемого контакта.', 'سيليكون ناعم', 'أسنان مخروطية مرنة لتلامس لطيف ومتحكم فيه.'),
    t('Stable central grip', 'Designed to stay controlled in a wet hand.', 'Устойчивый центральный хват', 'Помогает удерживать щётку мокрой рукой и дозировать нажим.', 'مقبض مركزي ثابت', 'يساعد على تثبيت الفرشاة باليد المبللة والتحكم في الضغط.'),
    t('Wet-shampoo step', 'Wet hair, lather shampoo, use the brush gently, then rinse.', 'Этап мытья', 'Намочите волосы, вспеньте шампунь, мягко используйте щётку и смойте.', 'خطوة الشامبو', 'يبلل الشعر وتكوّن رغوة الشامبو ثم تستخدم الفرشاة بلطف ويشطف الشعر.'),
    t('Leave-on care stays separate', 'Apply tonics and solutions afterwards with fingertips, not the brush.', 'Несмываемый уход отдельно', 'Тоники и растворы наносите после мытья пальцами, не щёткой.', 'العناية التي تترك على الفروة منفصلة', 'توضع المستحضرات بعد الغسل بأطراف الأصابع، لا بالفرشاة.'),
  ],
  '47': [
    t('Three-piece scalp kit', 'Scalp Peeling α 100 ml, Hair Solution α 4 ml × 6 and one GENOSYS roller.', 'Три компонента', 'Scalp Peeling α 100 мл, Hair Solution α 4 мл × 6 и один роллер GENOSYS.', 'طقم من ثلاثة مكونات', 'Scalp Peeling α بحجم 100 مل، وHair Solution α سعة 4 مل × 6، ورولر GENOSYS واحد.'),
    t('0.5 mm roller depth', 'The GENOSYS roller included in the kit works at a 0.5 mm depth.', 'Глубина роллера 0,5 мм', 'Роллер GENOSYS в наборе работает на глубине 0,5 мм.', 'عمق الرولر 0.5 مم', 'يعمل رولر GENOSYS المرفق في الطقم بعمق 0.5 مم.'),
    t('Peeling always comes first', 'Apply on intact scalp, leave for five minutes without rinsing, then dry fully before rolling.', 'Пилинг всегда первым', 'Нанесите на неповреждённую кожу, оставьте на пять минут без смывания и полностью высушите перед роллером.', 'المقشر أولاً دائماً', 'يوضع على فروة سليمة، ويترك خمس دقائق من دون شطف، ثم تجفف الفروة تماماً قبل الرولر.'),
    t('Fresh vial, immediate use', 'Open Hair Solution immediately before use and discard any remainder.', 'Свежая ампула без хранения', 'Откройте Hair Solution перед применением, используйте сразу и утилизируйте остаток.', 'أمبولة جديدة تستخدم فوراً', 'يفتح Hair Solution مباشرة قبل الاستخدام ويُتخلص من المتبقي.'),
    t('Single-use roller', 'Open a new roller, do not share it, and discard it after one use.', 'Одноразовый роллер', 'Откройте новый роллер, не делитесь им и утилизируйте после одного применения.', 'رولر أحادي الاستخدام', 'يفتح رولر جديد، ولا يشارك، ثم يتخلص منه بعد استخدام واحد.'),
  ],
  '48': [
    t('Four LED modes', 'Red plus infrared, blue, lights off, or all three lights together.', 'Четыре режима LED', 'Красный с инфракрасным, синий, свет выключен или все три вида света одновременно.', 'أربعة أوضاع LED', 'أحمر مع تحت الأحمر، أو أزرق، أو الإضاءة متوقفة، أو الأضواء الثلاثة معاً.'),
    t('Air-pressure massage + heat', 'Control massage and heat independently, together or separately.', 'Воздушный массаж + нагрев', 'Массаж воздушным давлением и нагрев включаются независимо, вместе или по отдельности.', 'مساج بضغط الهواء + تسخين', 'يمكن التحكم في المساج والتسخين بصورة مستقلة، معاً أو كل وظيفة على حدة.'),
    t('10 / 20 / 30-minute timer', 'Automatic shut-off at the end. Never use for more than 30 minutes at one time.', 'Таймер 10 / 20 / 30 минут', 'Автоматическое отключение по окончании. Не использовать дольше 30 минут за один раз.', 'مؤقت 10 / 20 / 30 دقيقة', 'إيقاف تلقائي عند انتهاء الوقت. لا يستخدم لأكثر من 30 دقيقة في المرة الواحدة.'),
    t('1.0 kg · adjustable fit', 'Helmet 230 × 240 × 300 mm with separate height and width controls.', '1,0 кг · регулируемая посадка', 'Шлем 230 × 240 × 300 мм с отдельной регулировкой высоты и ширины.', '1.0 كغ · مقاس قابل للتعديل', 'خوذة 230 × 240 × 300 مم مع تحكم منفصل في الارتفاع والعرض.'),
    t('Adaptor or 4 × AA', 'The 5 V 1.5 A adaptor is included. Four AA batteries are optional and not included.', 'Адаптер или 4 × AA', 'Адаптер 5 В 1,5 А входит в комплект. Четыре батарейки AA приобретаются отдельно.', 'محوّل أو 4 × AA', 'المحوّل 5 فولت 1.5 أمبير مرفق. أربع بطاريات AA اختيارية وغير مرفقة.'),
    t('EU conformity · massage appliance', 'EMC 2014/30/EU and LVD 2014/35/EU; tested to IEC/EN 60335-2-32 as a portable Class III household massage appliance.', 'Соответствие ЕС · массажный прибор', 'EMC 2014/30/EU и LVD 2014/35/EU; испытан по IEC/EN 60335-2-32 как портативный бытовой массажный прибор класса III.', 'مطابقة للاتحاد الأوروبي · جهاز مساج', 'EMC 2014/30/EU وLVD 2014/35/EU؛ مختبر وفق IEC/EN 60335-2-32 كجهاز مساج منزلي محمول من الفئة الثالثة.'),
  ],
  '52': [
    t('Sodium DNA 1,000 ppm', 'Verified PDRN level from salmon DNA in the official formula.', 'Тридцать масок в банке', '350 г / 30 ультратонких лиоцелловых масок со встроенным пинцетом.', 'عبوة من ثلاثين قناعاً', '350 غ / 30 قناعاً من الليوسيل فائق الرقة مع ملقط مدمج.'),
    t('TEWL improved ~35%', 'Clinical TEWL improved about 34.97% after physical stress recovery.', 'Ниацинамид 2% + аденозин 0,04%', 'Функциональная пара для осветляющего ухода и улучшения вида морщин.', 'نياسيناميد 2% + أدينوزين 0.04%', 'الثنائي الوظيفي للعناية بالإشراق ومظهر التجاعيد.'),
    t('Barrier recovery ~40–45%', 'Skin-barrier readings improved about 40–45% in the clinical panels.', 'Sodium DNA 1 000 ppm', 'PDRN 0,1%; официальная презентация указывает происхождение из молок лосося.', 'Sodium DNA بتركيز 1,000 جزء في المليون', 'PDRN بنسبة 0.1%، ويذكر العرض الرسمي أن مصدره حليب السلمون.'),
    t('Panthenol 1% + Niacinamide 2%', 'Barrier-support actives for comfort, brightening and recovery.', 'Пантенол 1% + аллантоин 0,1%', 'Два кондиционирующих кожу компонента в количественной формуле.', 'بانثينول 1% + ألانتوين 0.1%', 'مكوّنان ملطفان للبشرة ضمن التركيبة الكمية.'),
    t('Ultra-slim sheet fit', 'Seamless sheet adhesion increases contact for essence delivery.', 'TEWL после одного применения', 'После физического раздражения средний TEWL обработанного участка снизился с 13,445 до 8,735 (примерно на 35%); 20 женщин 20–60 лет.', 'TEWL بعد استخدام واحد', 'بعد التهييج الفيزيائي انخفض متوسط TEWL في الموضع المعالج من 13.445 إلى 8.735 (نحو 35%)؛ 20 امرأة بأعمار 20–60 عاماً.'),
    t('30 ready-to-use sheets', 'Pack includes 30 sheets with built-in tweezers for hygienic handling.', '10–20 минут', 'Достаньте пинцетом, наложите на чистую кожу и плотно закройте мембрану и крышку. Недельная частота на упаковке не установлена.', '10–20 دقيقة', 'يُسحب بالملقط ويوضع على بشرة نظيفة، ثم يُغلق الغشاء الداخلي والغطاء بإحكام. لا تحدد العبوة وتيرة أسبوعية.'),
  ],
  '53': [
    t('One 23g sheet', 'One individually sealed non-woven sheet for one use.', 'Одна маска · 23 г', 'Одна одноразовая маска из нетканого материала в индивидуальном саше.', 'قناع واحد · 23 غ', 'قناع واحد أحادي الاستخدام من نسيج غير منسوج داخل كيس فردي.'),
    t('Humectant base 18.062%', 'Glycerin 10.052% plus butylene glycol 8.010%.', 'Увлажняющая основа 18,062%', 'Глицерин 10,052% плюс бутиленгликоль 8,010%.', 'قاعدة مرطبة 18.062%', 'غليسرين 10.052% مع بيوتيلين غلايكول 8.010%.'),
    t('Supporting trio', 'Betaine 0.8%, sodium hyaluronate 0.5% and allantoin 0.2%.', 'Дополняющее трио', 'Бетаин 0,8%, гиалуронат натрия 0,5% и аллантоин 0,2%.', 'ثلاثي داعم', 'بيتايين 0.8% وهيالورونات الصوديوم 0.5% وألانتوين 0.2%.'),
    t('15–20 minutes', 'Use immediately after opening, then discard. The pack sets no weekly frequency.', '15–20 минут', 'Используйте сразу после вскрытия и утилизируйте. Недельная частота на упаковке не указана.', '15–20 دقيقة', 'يستخدم مباشرة بعد الفتح ثم يتخلص منه. لا تحدد العبوة وتيرة أسبوعية.'),
    t('Fragrance and alcohol', 'Contains Parfum (Fragrance) 0.01%, Alcohol 0.1% and soybean extract.', 'Отдушка и спирт', 'Содержит Parfum (Fragrance) 0,01%, Alcohol 0,1% и экстракт сои.', 'العطر والكحول', 'يحتوي على Parfum (Fragrance) ‏0.01% وAlcohol ‏0.1% ومستخلص الصويا.'),
  ],
  '54': [
    t('Seasonal gift box', 'A discontinued holiday edition kept public for reference; currently out of stock.', 'Сезонная подарочная коробка', 'Снятый с продажи праздничный выпуск сохранён в каталоге для справки; сейчас отсутствует в наличии.', 'علبة هدايا موسمية', 'إصدار موسمي متوقف يبقى في الكتالوج كمرجع، وهو غير متوفر حالياً.'),
    t('Three full sizes', 'Snow O₂ Cleanser 180 ml, Multi Vita Radiance Serum 30 ml and Multi Vita Radiance Cream 50 g.', 'Три полных объёма', 'Snow O₂ Cleanser 180 мл, Multi Vita Radiance Serum 30 мл и Multi Vita Radiance Cream 50 г.', 'ثلاثة أحجام كاملة', 'غسول Snow O₂ بحجم 180 مل، وسيروم Multi Vita Radiance بحجم 30 مل، وكريم Multi Vita Radiance بوزن 50 غ.'),
    t('Cleanser → serum → cream', 'Use the three skincare products in this order; the GENOSYS mirror is an accessory.', 'Очищение → сыворотка → крем', 'Используйте три средства в этом порядке; зеркало GENOSYS является аксессуаром.', 'الغسول ← السيروم ← الكريم', 'تُستخدم المنتجات الثلاثة بهذا الترتيب، أما مرآة GENOSYS فهي ملحق.'),
    t('Three tested products', 'The cleanser, serum and cream are each dermatologically tested. The mirror is not part of that statement.', 'Три протестированных средства', 'Очищающее средство, сыворотка и крем по отдельности дерматологически протестированы. Это утверждение не относится к зеркалу.', 'ثلاثة منتجات مختبرة', 'الغسول والسيروم والكريم مختبرة جلدياً كل على حدة، ولا تشمل هذه العبارة المرآة.'),
    t('Tone-care pair', 'Both leave-on steps use niacinamide 2%; the serum is light, while the cream carries 13% macadamia oil and 1% squalane.', 'Пара для ровного тона', 'Оба несмываемых средства содержат ниацинамид 2%; сыворотка лёгкая, а крем дополнен маслом макадамии 13% и скваланом 1%.', 'ثنائي للعناية بمظهر اللون', 'تحتوي خطوتا العناية اللتان تتركان على البشرة على نياسيناميد 2%؛ السيروم خفيف، والكريم غني بزيت المكاداميا 13% والسكوالان 1%.'),
  ],
  '64': [
    t('52 microneedles', 'The exact count stated for each Hair Stamp in the official HairGen Booster leaflet.', '52 микроиглы', 'Точное количество на каждой насадке Hair Stamp из официального буклета HairGen Booster.', '52 إبرة ميكروية', 'العدد الدقيق لكل رأس Hair Stamp كما تذكره النشرة الرسمية لجهاز HairGen Booster.'),
    t('Eight stamps per box', 'One box contains eight individually used stamp heads.', '8 штампов в коробке', 'В одной коробке восемь насадок для индивидуального одноразового применения.', '8 رؤوس في العلبة', 'تحتوي العلبة على ثمانية رؤوس للاستخدام الفردي مرة واحدة.'),
    t('Purpose-built fit', 'Attaches to an HR³ MATRIX HAIR SOLUTION α vial and fits the GENOSYS HairGen Booster.', 'Точная совместимость', 'Устанавливается на флакон HR³ MATRIX HAIR SOLUTION α и подходит к GENOSYS HairGen Booster.', 'توافق مخصص', 'يثبت على قارورة HR³ MATRIX HAIR SOLUTION α ويتوافق مع جهاز GENOSYS HairGen Booster.'),
    t('A new set each session', 'The leaflet calls for a new solution and applicator set for every session. Do not reuse or share the stamp.', 'Новый комплект на процедуру', 'Буклет предписывает новый раствор и новый аппликатор на каждую процедуру. Штамп нельзя использовать повторно или передавать другому человеку.', 'مجموعة جديدة لكل جلسة', 'تنص النشرة على محلول جديد وأداة جديدة لكل جلسة. لا يعاد استخدام الرأس ولا يشارك مع شخص آخر.'),
    t('Ten-minute device cycle', 'The HairGen Booster stops automatically after ten minutes.', '10-минутный цикл аппарата', 'HairGen Booster автоматически останавливается через 10 минут.', 'دورة جهاز مدتها 10 دقائق', 'يتوقف HairGen Booster تلقائياً بعد 10 دقائق.'),
  ],

}

export function getCatalogQuickFacts(
  productKey: string | number | null | undefined,
  locale: QuickFactLocale,
): Array<{ title: string; text: string }> {
  const key = String(productKey || '')
  const facts = PRODUCT_QUICK_FACTS_CATALOG[key]
  if (!facts?.length) return []
  return facts.map(fact => ({
    title: fact.title[locale] || fact.title.en,
    text: fact.text[locale] || fact.text.en,
  }))
}

export function hasCatalogQuickFacts(productKey: string | number | null | undefined) {
  return getCatalogQuickFacts(productKey, 'en').length > 0
}

export function getQuickFactLocale(locale: string): QuickFactLocale {
  const value = String(locale || 'en').toLowerCase()
  if (value.startsWith('ar')) return 'ar'
  if (value.startsWith('ru')) return 'ru'
  return 'en'
}
