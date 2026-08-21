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
    t('Humectant base 7.255%', 'Butylene glycol 4.01% plus glycerin 3.245% help hold moisture through the day.', 'Увлажняющая база 7,255%', 'Бутиленгликоль 4,01% и глицерин 3,245% помогают удерживать влагу в течение дня.', 'قاعدة ترطيب 7.255%', 'يساعد بيوتلين غليكول 4.01% والغليسرين 3.245% على الاحتفاظ بالرطوبة خلال اليوم.'),
    t('80 ml', 'pH 5.48, inside 5.00 to 6.00. 12 months after opening.', '80 мл · 12 месяцев', 'pH 5,48 в пределах 5,00–6,00. Используйте в течение 12 месяцев после вскрытия.', '80 مل · 12 شهراً', 'الأس الهيدروجيني 5.48 ضمن نطاق 5.00–6.00. يُستخدم خلال 12 شهراً من الفتح.'),
  ],
  '35': [
    t('Diatomaceous earth 65%', 'Most of the pouch. Fine mineral powder that takes water, sits, and peels off as a sheet.', 'Диатомовая земля 65%', 'Большая часть пакета. Тонкая минеральная пудра берёт воду, лежит и сходит пластом.', 'تراب الدياتوم ٦٥٪', 'معظم الكيس. بودرة معدنية ناعمة تأخذ الماء وتجلس وتُنزع كورقة.'),
    t('Mix 30g at 1 : 0.8', 'Powder to water. Stir one to two minutes, apply, peel after 15-20 minutes.', 'Смесь 30 г 1 : 0,8', 'Пудра к воде. Мешай одну-две минуты, нанеси, сними через 15-20 минут.', 'اخلطي ٣٠ غ بنسبة ١ : ٠٫٨', 'بودرة إلى ماء. حرّكي دقيقة إلى دقيقتين، ضعي، انزعي بعد ١٥-٢٠ دقيقة.'),
    t('Cool until you peel', 'Peppermint extract, peppermint oil and menthol. The cool is the wear.', 'Холод до снятия', 'Экстракт мяты, мятное масло и ментол. Холод - это ношение.', 'يبرّد حتى تنزعينه', 'مستخلص النعناع وزيت النعناع والمنثول. البرودة هي مدة الارتداء.'),
    t('1kg clinic kilo', 'About thirty treatments at 30g. After a professional treatment.', 'Клинический килограмм 1 кг', 'Около тридцати процедур по 30 г. После профессиональной процедуры.', 'كيلو العيادة ١ كغ', 'نحو ثلاثين جلسة بـ ٣٠ غ. بعد علاج مهني.'),
    t('Peel, then toner', 'Do not rub the residue in. Lift in one piece and wipe what is left with toner.', 'Снять, затем тоник', 'Не втирай остаток. Сними пластом и протри тоником.', 'انزعي ثم التونر', 'لا تدلكي البقايا. ارفعي قطعة واحدة وامسحي بالتونر.'),
    t('HA and ceramide at 0.01%', 'Sodium Hyaluronate, Ceramide NP, Allantoin and Centella each sit at 0.01%. In the formula. Not the engine.', 'ГК и церамид по 0,01%', 'Гиалуронат натрия, церамид NP, аллантоин и центелла - каждый по 0,01%. В формуле. Не двигатель.', 'هيالورون وسيراميد عند ٠٫٠١٪', 'هيالورونات الصوديوم وسيراميد NP والألانتوين والقنطورية كلّ منها ٠٫٠١٪. في التركيبة. ليست المحرّك.'),
  ],
  '34': [
    t('Niacinamide 2%', 'The brightening functional. This is the figure that belongs on a card.', 'Ниацинамид 2%', 'Осветляющий функциональный актив. Цифра, которой место на карточке.', 'نياسيناميد ٢٪', 'مكوّن التفتيح الوظيفي. هذا هو الرقم الذي يستحق بطاقة.'),
    t('Adenosine 0.04%', 'The wrinkle-care functional pair. Help the look of lines, not a lift story.', 'Аденозин 0,04%', 'Функциональная пара для морщин. Вид линий, не история про лифтинг.', 'أدينوسين ٠٫٠٤٪', 'شريك العناية الوظيفية بالتجاعيد. مساعدة مظهر الخطوط، لا قصة شد.'),
    t('Leave-on overnight', 'Last step of the evening. Do not wash off. Sleep, then cleanse in the morning.', 'Leave-on на ночь', 'Последний шаг вечера. Не смывать. Спать, утром очистить как обычно.', 'يُترك طوال الليل', 'آخر خطوة مسائية. لا تغسليه. نامي، ثم نظّفي في الصباح.'),
    t('Once or twice a week', 'Special overnight care when the skin wants the richer night.', 'Раз или два в неделю', 'Особый ночной уход, когда коже нужна более плотная ночь.', 'مرة أو مرتين في الأسبوع', 'عناية ليلية خاصة عندما تريد البشرة ليلة أغنى.'),
    t('TEWL -15% · redness -26%', 'After four weeks, transepidermal water loss eased by 15%, and redness by 26%.', 'TEWL -15% · краснота -26%', 'Через четыре недели потеря воды снизилась на 15%, покраснение на 26%.', 'TEWL -١٥٪ · احمرار -٢٦٪', 'بعد أربعة أسابيع خفّ فقدان الماء عبر البشرة ١٥٪، والاحمرار ٢٦٪.'),
    t('Oxygen and GFs at 0%', 'Finished Oxygen is 0%. Every named growth factor prints at 0%. In the formula. Not the engine.', 'Кислород и ФР = 0%', 'Готовый кислород - 0%. Каждый названный фактор роста печатается как 0%. В формуле. Не двигатель.', 'أكسجين وعوامل نمو عند ٠٪', 'الأكسجين الجاهز ٠٪. كل عامل نمو مسمّى يطبع عند ٠٪. في التركيبة. ليس المحرّك.'),
  ],
  '39': [
    t('Measured at SPF 65.9', 'Tested in vivo; the label reads 50+ because that is the highest figure allowed.', 'Измерено на SPF 65,9', 'Измерено in vivo; на этикетке 50+, потому что это максимум, который разрешено заявлять.', 'مقيس عند SPF 65.9', 'مقيس داخل الجسم الحي؛ والملصق يقول 50+ لأنه أعلى رقم مسموح بذكره.'),
    t('Six filters, 17.1%', 'Five organic and one mineral, giving a UVA factor of 23.1-24.3 where 22.0 is required.', 'Шесть фильтров, 17,1%', 'Пять органических и один минеральный: фактор UVA 23,1-24,3 при требуемых 22,0.', 'ستة مرشحات، 17.1%', 'خمسة عضوية وواحد معدني، بعامل UVA بين 23.1 و24.3 حيث المطلوب 22.0.'),
    t('Barrier recovery trio', 'Ceramide NP, hydrolyzed hyaluronic acid and Lactobacillus ferment lysate support sun-stressed skin.', 'Восстановление барьера', 'Церамид NP, гидролизованная ГК и лизат Lactobacillus поддерживают кожу после солнца.', 'ثلاثي إصلاح الحاجز', 'سيراميد NP وحمض هيالورونيك متحلل ولاكتوباسيلوس لدعم البشرة بعد الشمس.'),
    t('Hydrolyzed HA hydration', 'Ultra-low-molecular hyaluronic acid supports a silky, non-greasy finish.', 'Гидролизованная ГК', 'Сверхнизкомолекулярная ГК даёт шёлковое, нежирное покрытие.', 'ترطيب بحمض متحلل', 'حمض هيالورونيك منخفض الجزيئات جداً لملمس حريري غير دهني.'),
    t('Oxybenzone-free', 'Formulated without oxybenzone and octinoxate — the two reef-concern UV filters.', 'Без оксибензона', 'Без оксибензона и октиноксата — двух фильтров, опасных для рифов.', 'بدون أوكسيبنزون', 'خالٍ من الأوكسيبنزون والأوكتينوكسات — المرشحين المثيرين لقلق الشعاب.'),
    t('High-UV outdoor pick', 'Choose Ultra Shield when the UV index is high; Multi Sun is the lighter daily option.', 'Для высокого УФ-индекса', 'Берите Ultra Shield при высоком УФ; Multi Sun — более лёгкий ежедневный вариант.', 'لاختيار الأشعة العالية', 'يُفضَّل Ultra Shield عند ارتفاع مؤشر UV؛ Multi Sun للروتين اليومي الأخف.'),
  ],
  '40': [
    t('SPF 40 / PA++ daily', 'Everyday UVA/UVB shield sized for office and light outdoor use.', 'SPF 40 / PA++ ежедневно', 'Ежедневная защита UVA/UVB для офиса и лёгкого солнца.', 'SPF 40 / PA++ يومياً', 'حماية يومية من UVA/UVB للمكتب والتعرّض الخفيف.'),
    t('Hybrid sun filters', 'Titanium Dioxide plus chemical filters — not a mineral-only sunscreen.', 'Гибридные фильтры', 'Диоксид титана плюс химические фильтры — не только минеральный SPF.', 'مرشحات هجينة', 'ثاني أكسيد التيتانيوم مع مرشحات كيميائية — ليس معدنياً فقط.'),
    t('Pentapeptide comfort', 'Palmitoyl Pentapeptide-4 with Centella and Scutellaria soothes sun-exposed skin.', 'Пентапептидный комфорт', 'Palmitoyl Pentapeptide-4 с Centella и Scutellaria успокаивает кожу после солнца.', 'راحة البنتاببتيد', 'Palmitoyl Pentapeptide-4 مع القنطورية والدرقة يهدئان البشرة بعد الشمس.'),
    t('Glow, non-greasy finish', 'Lightweight texture works as a daily under-makeup sun layer.', 'Сияние без жирности', 'Лёгкая текстура как ежедневный SPF под макияж.', 'إشراقة بلا دهون', 'قوام خفيف يعمل كطبقة شمس يومية تحت المكياج.'),
    t('Reapply in strong sun', 'Reapply about every 2 hours when sweating, swimming or prolonged sun.', 'Обновлять на солнце', 'Обновляйте примерно каждые 2 часа при поте, купании или долгом солнце.', 'أعد التطبيق في الشمس القوية', 'أعد التطبيق كل ساعتين تقريباً عند التعرق أو السباحة أو التعرض الطويل.'),
    t('40 g everyday tube', 'Compact daily sunscreen format for face, neck and body touch-ups.', 'Туба 40 г', 'Компактный ежедневный формат для лица, шеи и тела.', 'أنبوب 40 غ', 'عبوة يومية مدمجة للوجه والرقبة ولمسات الجسم.'),
  ],
  '41': [
    t('SPF 50+ / PA++++', 'Hybrid chemical + mineral filters for high UVB/UVA protection in one cushion.', 'SPF 50+ / PA++++', 'Гибридные химические и минеральные фильтры для высокой защиты UVA/UVB.', 'SPF 50+ / PA++++', 'مرشحات هجينة كيميائية ومعدنية لحماية عالية من UVB/UVA في كوشن واحد.'),
    t('Covers, shields and treats', 'Coverage, sun protection and skincare in one press — Korea licenses all three.', 'Покрывает, защищает, ухаживает', 'Покрытие, защита от солнца и уход за одно нажатие — Корея лицензирует все три.', 'تغطية وحماية وعناية', 'تغطية وحماية من الشمس وعناية بضغطة واحدة — وكوريا ترخّص الثلاث.'),
    t('Niacinamide 2%, adenosine 0.04%', 'The two registered actives, at the standard Korean functional doses.', 'Ниацинамид 2%, аденозин 0,04%', 'Два зарегистрированных актива в стандартных корейских функциональных дозах.', 'نياسيناميد 2% وأدينوزين 0.04%', 'الفعّالان المسجّلان بالجرعتين الكوريتين المعياريتين.'),
    t('Cushion + refill (15 g × 2)', 'A second 15 g refill and the puff are already in the box — twice the wear, one price.', 'Кушон + сменный блок (15 г × 2)', 'Второй блок 15 г и спонж уже в коробке — вдвое дольше за ту же цену.', 'كوشن + عبوة احتياطية 15 غ × 2', 'العبوة الاحتياطية 15 غ والإسفنجة داخل العلبة — ضعف الاستعمال بسعر واحد.'),
    t('Triple fixing polymers', 'Long-wear polymer system helps coverage stay put through the day.', 'Тройные фиксирующие полимеры', 'Полимерная система помогает покрытию держаться в течение дня.', 'بوليمرات تثبيت ثلاثية', 'نظام بوليمرات طويل الثبات يساعد على ثبات التغطية طوال اليوم.'),
    t('3 professional shades', '#01 Ivory, #02 Beige and #03 Camel for tone correction after treatment.', '3 профессиональных оттенка', '#01 Ivory, #02 Beige и #03 Camel для коррекции тона после процедур.', '3 درجات مهنية', '#01 Ivory و #02 Beige و #03 Camel لتصحيح اللون بعد العلاج.'),
  ],
  '51': [
    t('218% hydration lift', 'Skin moisture rose from 17.27 to 48.513 in the DTS MG clinical trial.', 'Увлажнение +218%', 'Влажность кожи выросла с 17,27 до 48,513 в клиническом исследовании DTS MG.', 'ترطيب +218%', 'ارتفعت رطوبة البشرة من 17.27 إلى 48.513 في التجربة السريرية لـ DTS MG.'),
    t('Cools 10–11°C', 'On heated skin the treated side fell about 10 to 11°C in the published cases.', 'Охлаждение 10–11°C', 'На нагретой коже обработанная сторона упала примерно на 10–11°C в опубликованных случаях.', 'تبريد ١٠–١١°م', 'على بشرة مُسخَّنة انخفض الجانب المعالَج نحو ١٠ إلى ١١ درجة في الحالات المنشورة.'),
    t('Mix 1 : 1.5', 'Three scoops of powder (40g) to four and a half scoops of water.', 'Смесь 1 : 1,5', 'Три мерные ложки пудры (40 г) на четыре с половиной ложки воды.', 'خلط ١ : ١.٥', 'ثلاث مغارف من البودرة (٤٠ غ) إلى أربع مغارف ونصف من الماء.'),
    t('Peel after 15–20 min', 'The mask sets in 5–10 minutes. Leave it on, then lift off in one piece.', 'Снять через 15–20 мин', 'Схватывается за 5–10 минут. Держи, затем сними одним пластом.', 'انزعي بعد ١٥–٢٠ د', 'يتماسك في ٥–١٠ دقائق. اتركيه ثم ارفعيه قطعة واحدة.'),
    t('Does not dry out', 'Diatomaceous earth holds moisture for the full wear, unlike a cooling alginate.', 'Не сохнет', 'Диатомовая земля держит влагу всё время ношения, в отличие от охлаждающего альгината.', 'لا يجف', 'تراب الدياتوم يحبس الرطوبة طوال مدة الجلوس، بخلاف ألجين التبريد.'),
    t('300g · ~7 treatments', 'Each mix is 40g. The scoop is in the pack.', '300 г · ~7 процедур', 'Каждая смесь — 40 г. Мерная ложка в упаковке.', '٣٠٠ غ · نحو ٧ جلسات', 'كل خلط ٤٠ غ. المغرفة في العبوة.'),
  ],
  '52': [
    t('Sodium DNA 1,000 ppm', 'Verified PDRN level from salmon DNA in the official formula.', 'Sodium DNA 1 000 ppm', 'Подтверждённый уровень PDRN из ДНК лосося в официальной формуле.', 'Sodium DNA 1,000 ppm', 'مستوى PDRN موثّق من DNA السلمون وفق التركيبة الرسمية.'),
    t('TEWL improved ~35%', 'Clinical TEWL improved about 34.97% after physical stress recovery.', 'TEWL ≈ −35%', 'Клинически TEWL улучшился примерно на 34,97% после стресса кожи.', 'تحسّن TEWL نحو 35%', 'تحسّن TEWL سريرياً بنحو 34.97% بعد الإجهاد الفيزيائي.'),
    t('Barrier recovery ~40–45%', 'Skin-barrier readings improved about 40–45% in the clinical panels.', 'Барьер ≈ +40–45%', 'Показатели барьера выросли примерно на 40–45% в клинических панелях.', 'تعافي الحاجز ~40–45%', 'تحسّنت قراءات الحاجز نحو 40–45% في اللوحات السريرية.'),
    t('Panthenol 1% + Niacinamide 2%', 'Barrier-support actives for comfort, brightening and recovery.', 'Пантенол 1% + ниацинамид 2%', 'Активы для барьера, комфорта и сияния.', 'بانثينول 1% ونياسيناميد 2%', 'مكونات لدعم الحاجز والراحة والإشراقة.'),
    t('Ultra-slim sheet fit', 'Seamless sheet adhesion increases contact for essence delivery.', 'Ультратонкий фит', 'Плотное прилегание увеличивает контакт и доставку эссенции.', 'ملامسة ورقة فائقة الرقة', 'التصاق الورقة يزيد مساحة التماس لتوصيل الخلاصة.'),
    t('30 ready-to-use sheets', 'Pack includes 30 sheets with built-in tweezers for hygienic handling.', '30 готовых масок', '30 листов со встроенным пинцетом для гигиеничного использования.', '30 ورقة جاهزة', 'العبوة تضم 30 ورقة مع ملقط مدمج للاستخدام الصحي.'),
  ],
  '55': [
    t('Blemish-care focus', 'An oil-aware home routine for combination, congested and blemish-prone skin.', 'Фокус на проблемной коже', 'Домашний уход для комбинированной, жирной и склонной к высыпаниям кожи.', 'تركيز على البشرة المعرضة للحبوب', 'روتين منزلي للبشرة المختلطة أو الدهنية أو المعرضة للانسداد والحبوب.'),
    t('7 pieces inside', 'Four full-size daily products plus three Sea Algae sheet masks.', '7 единиц в наборе', 'Четыре полноразмерных средства и три тканевые маски Sea Algae.', '7 قطع داخل المجموعة', 'أربعة منتجات يومية كاملة الحجم وثلاثة أقنعة ورقية Sea Algae.'),
    t('Complete daily core', 'Snow O₂ Cleanser, Problem Control Toner, Serum and Cream cover the core routine.', 'Полная ежедневная база', 'Snow O₂, тоник, сыворотка и крем Problem Control составляют основу ухода.', 'أساس يومي متكامل', 'منظف Snow O₂ وتونر وسيروم وكريم Problem Control تغطي أساس الروتين.'),
    t('Mask-ready sequence', 'Use a Sea Algae mask after toner and before the leave-on serum and cream steps.', 'Маска в правильной последовательности', 'Маску Sea Algae используют после тоника, перед сывороткой и кремом.', 'ترتيب واضح للقناع', 'يُستخدم قناع Sea Algae بعد التونر وقبل السيروم والكريم اللذين يتركان على البشرة.'),
    t('One concern-led set', 'Cleansing, oil balance, targeted leave-on care and recovery masks are packed together.', 'Один набор по задаче', 'Очищение, баланс себума, несмываемый уход и восстанавливающие маски в одном наборе.', 'مجموعة واحدة موجهة للمشكلة', 'التنظيف وتوازن الدهون والعناية التي تترك على البشرة وأقنعة التهدئة في مجموعة واحدة.'),
    t('Save AED 197.70', 'AED 1,318 separate value; box price AED 1,120.30 after the built-in 15% saving.', 'Экономия 197,70 AED', 'Стоимость по отдельности 1 318 AED; цена набора 1 120,30 AED со скидкой 15%.', 'وفّر 197.70 درهم', 'القيمة المنفصلة 1,318 درهماً؛ سعر المجموعة 1,120.30 درهماً بعد توفير 15%.'),
  ],
  '56': [
    t('Tone + texture focus', 'A home routine built for dull, uneven-looking skin and rough surface texture.', 'Тон + текстура', 'Домашний уход для тусклой кожи, неровного тона и шероховатой текстуры.', 'تركيز على اللون والملمس', 'روتين منزلي للبشرة الباهتة وغير المتجانسة ولتحسين ملمس السطح.'),
    t('6 products inside', 'Five full-size skincare products plus one Sea Algae sheet mask.', '6 средств в наборе', 'Пять полноразмерных средств и одна тканевая маска Sea Algae.', '6 منتجات داخل المجموعة', 'خمسة منتجات عناية كاملة الحجم وقناع ورقي واحد Sea Algae.'),
    t('Daily + weekly rhythm', 'Cleanser, toner, serum and cream form the daily core; peel and mask are treatment steps.', 'Ежедневно + еженедельно', 'Очищение, тоник, сыворотка и крем составляют базу; пилинг и маска дополняют её.', 'إيقاع يومي وأسبوعي', 'المنظف والتونر والسيروم والكريم أساس يومي، بينما التقشير والقناع خطوات إضافية.'),
    t('Matched Multi Vita duo', 'Multi Vita Radiance Serum and Cream create a coordinated leave-on pair.', 'Дуэт Multi Vita', 'Сыворотка и крем Multi Vita Radiance работают как согласованная несмываемая пара.', 'ثنائي Multi Vita متناسق', 'سيروم وكريم Multi Vita Radiance يشكلان ثنائياً متناسقاً يترك على البشرة.'),
    t('Renewal step included', 'EPI Peeling Gel adds a dedicated exfoliation step before toner, mask and leave-on care.', 'Шаг обновления включён', 'EPI Peeling Gel добавляет этап эксфолиации перед тоником, маской и основным уходом.', 'خطوة تجديد متضمنة', 'يضيف EPI Peeling Gel خطوة تقشير قبل التونر والقناع والعناية التي تترك على البشرة.'),
    t('Save AED 224.40', 'AED 1,496 separate value; box price AED 1,271.60 after the built-in 15% saving.', 'Экономия 224,40 AED', 'Стоимость по отдельности 1 496 AED; цена набора 1 271,60 AED со скидкой 15%.', 'وفّر 224.40 درهم', 'القيمة المنفصلة 1,496 درهماً؛ سعر المجموعة 1,271.60 درهماً بعد توفير 15%.'),
  ],
  '57': [
    t('Skincare + complexion', 'The only Beauty Box combining daily skincare, complexion coverage and makeup removal.', 'Уход + тон', 'Единственный Beauty Box, объединяющий ежедневный уход, тональное покрытие и демакияж.', 'عناية وتغطية للبشرة', 'مجموعة Beauty Box الوحيدة التي تجمع العناية اليومية والتغطية وإزالة المكياج.'),
    t('5 full-size products', 'Cleanser, toner, BB cushion, biphasic remover and overnight cream mask.', '5 полноразмерных средств', 'Очищение, тоник, BB-кушон, двухфазный ремувер и ночная крем-маска.', '5 منتجات كاملة الحجم', 'منظف وتونر وكوشن BB ومزيل ثنائي الطور وقناع كريمي ليلي.'),
    t('Daytime finish', 'Snow O₂ and Snow Booster prepare skin before the SPF 50+ PA++++ cushion.', 'Дневной финиш', 'Snow O₂ и Snow Booster готовят кожу перед кушоном SPF 50+ PA++++.', 'إنهاء نهاري', 'يهيئ Snow O₂ وSnow Booster البشرة قبل كوشن SPF 50+ PA++++.'),
    t('Evening reset', 'The lip-and-eye remover and overnight mask create a separate PM cleansing and care pair.', 'Вечерний перезапуск', 'Ремувер для глаз и губ и ночная маска образуют отдельную вечернюю пару.', 'إعادة ضبط مسائية', 'مزيل مكياج العين والشفاه والقناع الليلي يشكلان ثنائياً منفصلاً للمساء.'),
    t('Two honest rituals', 'Daytime complexion and nighttime recovery stay separate instead of forming one false sequence.', 'Два честных ритуала', 'Дневной макияж и ночной уход разделены, а не собраны в неверную последовательность.', 'روتينان واضحان', 'تظل تغطية النهار وعناية الليل منفصلتين بدلاً من دمجهما في تسلسل غير صحيح.'),
    t('Save AED 228', 'AED 1,520 separate value; box price AED 1,292 after the built-in 15% saving.', 'Экономия 228 AED', 'Стоимость по отдельности 1 520 AED; цена набора 1 292 AED со скидкой 15%.', 'وفّر 228 درهماً', 'القيمة المنفصلة 1,520 درهماً؛ سعر المجموعة 1,292 درهماً بعد توفير 15%.'),
  ],
  '58': [
    t('Firmness + line care', 'A coordinated home routine for visible fine lines, firmness and elasticity concerns.', 'Упругость + линии', 'Согласованный домашний уход при тонких линиях и снижении упругости.', 'عناية بالتماسك والخطوط', 'روتين منزلي متناسق لمظهر الخطوط الدقيقة ومشاكل التماسك والمرونة.'),
    t('9 pieces inside', 'Four full-size daily products plus five Collagen sheet masks.', '9 единиц в наборе', 'Четыре полноразмерных средства и пять коллагеновых тканевых масок.', '9 قطع داخل المجموعة', 'أربعة منتجات يومية كاملة الحجم وخمسة أقنعة كولاجين ورقية.'),
    t('Matched treatment duo', 'Multi Functional Anti-Wrinkle Serum and Cream form the leave-on treatment pair.', 'Согласованный дуэт', 'Сыворотка и крем Multi Functional Anti-Wrinkle образуют несмываемую пару.', 'ثنائي عناية متناسق', 'سيروم وكريم Multi Functional Anti-Wrinkle يشكلان ثنائياً يترك على البشرة.'),
    t('Five mask sessions', 'Five individual Collagen masks support planned intensive-care nights.', 'Пять сеансов с маской', 'Пять отдельных коллагеновых масок для запланированных вечеров интенсивного ухода.', 'خمس جلسات قناع', 'خمسة أقنعة كولاجين منفردة لليالي العناية المكثفة المخطط لها.'),
    t('Clear routine order', 'Cleanser → booster → optional mask → serum → cream.', 'Понятный порядок', 'Очищение → бустер → маска по необходимости → сыворотка → крем.', 'ترتيب روتين واضح', 'منظف، ثم معزز، فقناع اختياري، ثم سيروم وكريم.'),
    t('Save AED 208.50', 'AED 1,390 separate value; box price AED 1,181.50 after the built-in 15% saving.', 'Экономия 208,50 AED', 'Стоимость по отдельности 1 390 AED; цена набора 1 181,50 AED со скидкой 15%.', 'وفّر 208.50 درهم', 'القيمة المنفصلة 1,390 درهماً؛ سعر المجموعة 1,181.50 درهماً بعد توفير 15%.'),
  ],
  '59': [
    t('Deep hydration focus', 'A layered home routine for dry, dehydrated skin and moisture-barrier comfort.', 'Фокус на увлажнении', 'Многоэтапный домашний уход для сухой, обезвоженной кожи и комфорта барьера.', 'تركيز على الترطيب العميق', 'روتين منزلي متعدد الطبقات للبشرة الجافة والمتعطشة للماء وراحة الحاجز.'),
    t('7 pieces inside', 'Four full-size daily products plus three Sea Algae sheet masks.', '7 единиц в наборе', 'Четыре полноразмерных средства и три тканевые маски Sea Algae.', '7 قطع داخل المجموعة', 'أربعة منتجات يومية كاملة الحجم وثلاثة أقنعة ورقية Sea Algae.'),
    t('Matched Hyaluron duo', 'Moisture Replenishing Hyaluron Serum and Cream layer water-focused care together.', 'Дуэт Hyaluron', 'Сыворотка и крем Moisture Replenishing Hyaluron дают последовательное увлажнение.', 'ثنائي Hyaluron متناسق', 'سيروم وكريم Moisture Replenishing Hyaluron يقدمان عناية ترطيب متدرجة.'),
    t('Five-step layering', 'Cleanser → booster → optional mask → Hyaluron serum → Hyaluron cream.', 'Пять слоёв ухода', 'Очищение → бустер → маска по необходимости → Hyaluron Serum → Hyaluron Cream.', 'خمس خطوات متدرجة', 'منظف، ثم معزز، فقناع اختياري، ثم سيروم وكريم Hyaluron.'),
    t('Three recovery masks', 'Sea Algae sheets add three separate soothing and moisture-focused sessions.', 'Три восстанавливающие маски', 'Три маски Sea Algae добавляют отдельные успокаивающие и увлажняющие сеансы.', 'ثلاثة أقنعة للراحة', 'تضيف أقنعة Sea Algae ثلاث جلسات منفصلة للتهدئة والترطيب.'),
    t('Save AED 197.70', 'AED 1,318 separate value; box price AED 1,120.30 after the built-in 15% saving.', 'Экономия 197,70 AED', 'Стоимость по отдельности 1 318 AED; цена набора 1 120,30 AED со скидкой 15%.', 'وفّر 197.70 درهم', 'القيمة المنفصلة 1,318 درهماً؛ سعر المجموعة 1,120.30 درهماً بعد توفير 15%.'),
  ],
  '62': [
    t('Sensitive-barrier focus', 'A home routine for sensitive, reactive skin that prioritizes comfort and barrier support.', 'Фокус на чувствительном барьере', 'Домашний уход для чувствительной, реактивной кожи с акцентом на комфорт и барьер.', 'تركيز على حاجز البشرة الحساسة', 'روتين منزلي للبشرة الحساسة والمتفاعلة يركز على الراحة ودعم الحاجز.'),
    t('6 products inside', 'Five full-size skincare products plus one Sea Algae sheet mask.', '6 средств в наборе', 'Пять полноразмерных средств и одна тканевая маска Sea Algae.', '6 منتجات داخل المجموعة', 'خمسة منتجات عناية كاملة الحجم وقناع ورقي واحد Sea Algae.'),
    t('Serum + barrier cream', 'All For Sensitive Serum layers under the 100 ml Skin Barrier Protecting Cream.', 'Сыворотка + барьерный крем', 'All For Sensitive Serum наносится под Skin Barrier Protecting Cream объёмом 100 мл.', 'سيروم وكريم للحاجز', 'يوضع All For Sensitive Serum تحت كريم Skin Barrier Protecting Cream بحجم 100 مل.'),
    t('Two mask formats', 'A 100 g Skin Rescue Overnight Cream Mask and one Sea Algae sheet provide two distinct mask steps.', 'Два формата масок', 'Ночная крем-маска Skin Rescue 100 г и одна маска Sea Algae дают два разных формата ухода.', 'نوعان من الأقنعة', 'قناع Skin Rescue الكريمي الليلي بحجم 100 غ وقناع Sea Algae ورقي يقدمان خطوتين مختلفتين.'),
    t('Barrier-first sequence', 'Cleanser → booster → optional mask → sensitive serum → barrier cream.', 'Барьерная последовательность', 'Очищение → бустер → маска по необходимости → сыворотка → барьерный крем.', 'تسلسل يركز على الحاجز', 'منظف، ثم معزز، فقناع اختياري، ثم سيروم للبشرة الحساسة وكريم الحاجز.'),
    /* The parts total rose from 1,696 to 1,746 when the 340 AED overnight cream mask
       replaced the discontinued 290 AED oxymask. The box price was deliberately left
       at 1,442 rather than raised to hold 15%, so the saving is now 304 AED. */
    t('Save AED 304', 'AED 1,746 separate value; box price AED 1,442, a 17% saving.', 'Экономия 304 AED', 'Стоимость по отдельности 1 746 AED; цена набора 1 442 AED, экономия 17%.', 'وفّر 304 دراهم', 'القيمة المنفصلة 1,746 درهماً؛ سعر المجموعة 1,442 درهماً، بتوفير 17%.'),
  ],
  '63': [
    t('SPF 38 / PA+++', 'Daily BB cream with meaningful UVA/UVB protection for UAE routines.', 'SPF 38 / PA+++', 'Ежедневный BB-крем с заметной защитой UVA/UVB.', 'SPF 38 / PA+++', 'كريم BB يومي بحماية ملموسة من UVA/UVB لروتين الإمارات.'),
    t('Vita 10 complex', 'Vitamins A, B-complex, C and E support a clearer glass-skin look.', 'Комплекс Vita 10', 'Витамины A, группы B, C и E поддерживают эффект glass skin.', 'مركب Vita 10', 'فيتامينات A ومجموعة B و C و E تدعم مظهر الزجاج الصافي.'),
    t('Herb 7 complex', 'Camellia, Centella, Tremella, Chamomile and more soothe while evening tone.', 'Комплекс Herb 7', 'Камелия, центелла, tremella, ромашка и другие успокаивают и выравнивают тон.', 'مركب Herb 7', 'الكاميليا والقنطورية والترميلا والبابونج وغيرها تهدئ وتوحّد اللون.'),
    t('Glass-skin film network', 'Transparent gel network helps resist smudge and transfer through the day.', 'Сетка glass-skin', 'Прозрачная гелевая сеть помогает стойкости без смазывавания.', 'شبكة فيلم Glass Skin', 'شبكة جل شفافة تساعد على مقاومة التلطيخ والانتقال طوال اليوم.'),
    t('2 glow shades', '#01 Bright for illuminating fair skin and #02 Natural for refined medium tones.', '2 оттенка сияния', '#01 Bright для светлой кожи и #02 Natural для средних тонов.', 'درجتان للإشراقة', '#01 Bright للإشراقة الفاتحة و #02 Natural للدرجات المتوسطة.'),
    t('Adenosine support', 'Adenosine contributes to a smoother, more rested-looking finish.', 'Поддержка аденозина', 'Аденозин способствует более гладкому и отдохнувшему виду.', 'دعم الأدينوزين', 'الأدينوزين يساهم في ملمس أنعم ومظهر أكثر راحة.'),
  ],
  '66': [
    t('+145.8% post-wash hydration', 'Clinical test: immediate skin hydration improved 145.8% after cleansing.', '+145,8% увлажнения', 'Клинически увлажнение сразу после умывания выросло на 145,8%.', '+145.8% ترطيب بعد الغسل', 'اختبار سريري: تحسّن الترطيب الفوري 145.8% بعد التنظيف.'),
    t('2.4× hydration boost', 'Barrier cleanser delivered a 2.4× increase in measured skin hydration.', 'Увлажнение ×2,4', 'Барьерный очиститель дал рост увлажнения в 2,4 раза.', 'ترطيب ×2.4', 'المنظف المعزز للحاجز رفع الترطيب المقاس 2.4 مرة.'),
    t('Pink ceramide complex', 'Pink ceramide with 5 ceramides helps reinforce the moisture barrier.', 'Розовый церамидный комплекс', 'Розовый церамид и 5 церамидов укрепляют влагобарьер.', 'مركب السراميد الوردي', 'السراميد الوردي مع 5 سيراميدات يعزز حاجز الرطوبة.'),
    t('Microbiome support', 'Bifida and Lactobacillus lysates help maintain a balanced skin microbiome.', 'Поддержка микробиома', 'Лизаты Bifida и Lactobacillus поддерживают баланс микробиома.', 'دعم الميكروبيوم', 'ليسَات Bifida و Lactobacillus تساعد على توازن ميكروبيوم البشرة.'),
    t('Gel-to-foam comfort', 'Smooth-rolling gel becomes foam that cleanses with less friction.', 'Гель-в-пену', 'Гель превращается в пену и очищает с меньшим трением.', 'من جل إلى رغوة', 'جل ناعم يتحول إلى رغوة تنظّف بأقل احتكاك.'),
    t('200 ml / 600 ml sizes', 'Homecare 200 ml and professional 600 ml for daily barrier-first cleansing.', '200 / 600 мл', '200 мл для дома и 600 мл для профессионального использования.', 'أحجام 200 / 600 مل', '200 مل منزلية و600 مل مهنية للتنظيف اليومي المعزز للحاجز.'),
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
    t('Zinc PCA 0.05%', 'Helps regulate excess sebum and reduce shine.', 'Цинк PCA 0,05%', 'Помогает регулировать избыток себума и уменьшать жирный блеск.', 'زنك PCA بتركيز 0.05%', 'يساعد على تنظيم فائض الزهم وتقليل اللمعان.'),
    t('Over 90% water', 'A light texture that absorbs quickly under cream and SPF.', 'Более 90% воды', 'Лёгкая текстура быстро впитывается под крем и SPF.', 'أكثر من 90% ماء', 'قوام خفيف سريع الامتصاص تحت الكريم وواقي الشمس.'),
    t('Trehalose 1% + xylitol 0.5%', 'Lightweight moisture support without an oily finish.', 'Трегалоза 1% + ксилитол 0,5%', 'Поддерживают увлажнение без жирного финиша.', 'تريهالوز 1% + زيليتول 0.5%', 'يدعمان الترطيب من دون لمسة نهائية دهنية.'),
    t('Panthenol 0.2% + allantoin 0.1%', 'Support softness and comfort in daily care.', 'Пантенол 0,2% + аллантоин 0,1%', 'Поддерживают мягкость и комфорт кожи в ежедневном уходе.', 'بانثينول 0.2% + ألانتوين 0.1%', 'يدعمان نعومة البشرة وراحتها في العناية اليومية.'),
    t('No salicylic acid', 'Willow bark is present at 0.001%, but this is not an AHA/BHA serum.', 'Без салициловой кислоты', 'Кора чёрной ивы присутствует на уровне 0,001%, но это не AHA/BHA-сыворотка.', 'من دون حمض الساليسيليك', 'يوجد لحاء الصفصاف بتركيز 0.001%، لكن هذا ليس سيروم AHA/BHA.'),
    t('Fragrance-free formula', 'Contains no perfume or aromatic ingredients.', 'Формула без отдушки', 'Не содержит отдушки и ароматических ингредиентов.', 'تركيبة خالية من العطر', 'لا تحتوي على عطر أو مكونات عطرية.'),
  ],
  '21': [
    t('Niacinamide 2%', '20,000 ppm at the centre of the formula for a more even, radiant-looking tone.', 'Ниацинамид 2%', '20 000 ppm в основе формулы для более ровного и сияющего тона.', 'نياسيناميد 2%', '20,000 جزء في المليون في قلب التركيبة لمظهر أكثر تجانساً وإشراقاً.'),
    t('MELAZERO® 0.05%', 'Patented complex: loquat leaf extract 0.04% plus spearmint extract 0.01%.', 'MELAZERO® 0,05%', 'Запатентованный комплекс: экстракт листа мушмулы 0,04% и мяты колосистой 0,01%.', 'MELAZERO® بتركيز 0.05%', 'مركب حاصل على براءة: مستخلص أوراق الأسكدنيا 0.04% والنعناع السنبلي 0.01%.'),
    t('−28.0% in two weeks', 'Skin-surface melanin index moved from 6.190 to 4.457 after two weeks.', '−28,0% за две недели', 'Показатель поверхностного меланина снизился с 6,190 до 4,457.', '−28.0% خلال أسبوعين', 'انخفض مؤشر الميلانين السطحي من 6.190 إلى 4.457.'),
    t('Panthenol 1% + vitamin C 0.1%', 'Panthenol supports comfort while stable 3-O-Ethyl Ascorbic Acid complements the radiance routine.', 'Пантенол 1% + витамин C 0,1%', 'Пантенол поддерживает комфорт, а стабильный 3-O-Ethyl Ascorbic Acid дополняет уход для сияния.', 'بانثينول 1% + فيتامين C ‏0.1%', 'يدعم البانثينول راحة البشرة، ويكمل 3-O-Ethyl Ascorbic Acid الثابت روتين الإشراق.'),
    t('Measured pH 5.94', 'Inside the specified 5.60–6.60 range.', 'Измеренный pH 5,94', 'В пределах установленного диапазона 5,60–6,60.', 'أس هيدروجيني مقاس 5.94', 'ضمن النطاق المحدد 5.60–6.60.'),
    t('Two or three drops', 'Pat in morning and evening. Start small on sensitive skin and stop if stinging persists.', '2–3 капли', 'Мягко вбивайте утром и вечером. При чувствительной коже начните с малого; если пощипывание не проходит, прекратите применение.', 'قطرتان إلى ثلاث', 'تُربت صباحاً ومساءً. للبشرة الحساسة، يُبدأ بكمية صغيرة ويُوقف الاستخدام إذا استمر الوخز.'),
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
    t('Ceramide NP 0.5%', 'Five thousand ppm, and the Korean panel prints the number on the carton.', 'Ceramide NP 0,5%', 'Пять тысяч ppm, и корейская панель печатает число на упаковке.', 'سيراميد NP ٠٫٥٪', 'خمسة آلاف جزء بالمليون، واللوحة الكورية تطبع الرقم على العلبة.'),
    t('Glycerin 17.49%', 'Nearly a fifth of the tube, from two separate raw materials.', 'Глицерин 17,49%', 'Почти пятая часть тубы, из двух разных сырьевых материалов.', 'جلسرين ١٧٫٤٩٪', 'قرابة خُمس الأنبوب، من مادّتين خامّتين منفصلتين.'),
    t('The richest of the three', '49.9% water, against 72.4% in the Hyaluron Cream and 86.6% in the Problem Control.', 'Самый насыщенный из трёх', '49,9% воды против 72,4% в Hyaluron и 86,6% в Problem Control.', 'أغنى الثلاثة', '٤٩٫٩٪ ماء مقابل ٧٢٫٤٪ في Hyaluron و٨٦٫٦٪ في Problem Control.'),
    t('Shea butter 3%', 'The occlusive half, with a 13% ester blend behind it.', 'Масло ши 3%', 'Окклюзивная половина, с 13% эфирной базы за ней.', 'زبدة شيا ٣٪', 'النصف الحاجب، ومعه ١٣٪ من مزيج الإسترات.'),
    t('Pat, do not rub', 'The carton asks for patting, which is unusual for a cream this rich.', 'Вбивать, не растирать', 'Коробка просит вбивание, что необычно для настолько насыщенного крема.', 'ربّتي، لا تفركي', 'العلبة تطلب التربيت، وهو غير معتاد لكريم بهذا الغنى.'),
    t('Botanicals are a trace', 'MultiEx BSASM Plus is at 0.0001% here, against 1% in the sensitive serum.', 'Растения — след', 'MultiEx BSASM Plus здесь 0,0001% против 1% в сыворотке для чувствительной кожи.', 'النباتات أثرية', 'MultiEx BSASM Plus هنا ٠٫٠٠٠١٪ مقابل ١٪ في سيروم البشرة الحساسة.'),
  ],
  '29': [
    t('+82% immediate hydration', 'Clinical hydration value rose 82% immediately after a single use.', '+82% увлажнения сразу', 'Клинически увлажнение выросло на 82% сразу после одного нанесения.', '+82% ترطيب فوري', 'ارتفعت قيمة الترطيب السريرية 82% فوراً بعد استخدام واحد.'),
    t('72-hour persistence', 'Still significantly above baseline three days after a single application.', 'Держится 72 часа', 'Через трое суток после одного нанесения всё ещё значимо выше исходного.', 'ثبات ٧٢ ساعة', 'ما زال أعلى بدلالة من خط الأساس بعد ثلاثة أيام من تطبيق واحد.'),
    t('1,000.9 ppm, on the box', 'The carton prints the dose of every hyaluronate beside its name.', '1 000,9 ppm на коробке', 'Упаковка печатает дозу каждого гиалуроната рядом с названием.', '١٬٠٠٠٫٩ ppm على العلبة', 'العلبة تطبع جرعة كل هيالورونات بجانب اسمه.'),
    t('The heavy grade', 'High molecular weight hyaluronate films the surface. The serum carries the light one.', 'Тяжёлая градация', 'Высокомолекулярный гиалуронат даёт плёнку. Лёгкую форму несёт сыворотка.', 'الدرجة الثقيلة', 'الهيالورونات عالي الوزن يشكّل طبقة على السطح. السيروم يحمل الخفيف.'),
    t('Glycerin 9%', 'Nearly a tenth of the tube, and more than every named complex combined.', 'Глицерин 9%', 'Почти десятая часть тубы, больше всех именованных комплексов вместе.', 'جلسرين ٩٪', 'قرابة عُشر الأنبوب، وأكثر من كل مركّب مُسمّى مجتمعاً.'),
    t('Not the fridge', 'The manufacturer warns cold storage changes the viscosity and texture.', 'Не в холодильник', 'Производитель предупреждает: холод меняет вязкость и текстуру.', 'ليس الثلاجة', 'المصنّع يحذّر من أن البرودة تغيّر اللزوجة والقوام.'),
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
    t('Zinc PCA 0.5%', 'The sebum-control centre of the formula for oily, blemish-prone skin.', 'Цинк PCA 0,5%', 'Ключевой компонент помогает контролировать избыток себума и жирный блеск.', 'زنك PCA بنسبة 0.5%', 'المكوّن الرئيسي الذي يساعد على تنظيم فائض الزهم واللمعان.'),
    t('Hydration base 13.398%', 'Butylene glycol 5.423%, glycerin 4.975% and dipropylene glycol 3%.', 'Увлажняющая база 13,398%', 'Бутиленгликоль 5,423%, глицерин 4,975% и дипропиленгликоль 3% помогают удерживать влагу без тяжёлой плёнки.', 'قاعدة ترطيب 13.398%', 'يساعد بيوتلين غليكول 5.423% والغليسرين 4.975% ودايبروبيلين غليكول 3% على حفظ الرطوبة من دون طبقة ثقيلة.'),
    t('Sebum ≈ −50%', 'Finished-product testing measured about 50% less sebum after four weeks.', 'Себум ≈ −50%', 'В исследовании готового продукта количество себума снизилось примерно наполовину за четыре недели.', 'الزهم ≈ −50%', 'أظهرت دراسة على المنتج النهائي انخفاض كمية الزهم بنحو النصف خلال أربعة أسابيع.'),
    t('Not an acid peel', 'Salicylic acid is present at a trace 0.001%; this is a daily sebum toner.', 'Не кислотный пилинг', 'Салициловая кислота присутствует в следовой концентрации 0,001%: это ежедневный себорегулирующий тоник.', 'ليس مقشراً حمضياً', 'يوجد حمض الساليسيليك بتركيز أثري 0.001%؛ فهذا تونر يومي لتنظيم الدهون.'),
    t('360° home spray', 'The 200 ml bottle works upside down for the neck and hard-to-reach back.', 'Распыление 360°', 'Флакон 200 мл работает вверх дном, поэтому тоник удобно наносить на шею и спину.', 'رذاذ 360°', 'تعمل عبوة 200 مل عند قلبها، ما يسهل التطبيق على الرقبة والظهر.'),
    t('Two sizes', '200 ml at home, 500 ml for regular clinic use. Same formula.', 'Два объёма', '200 мл для дома и 500 мл для профессионального использования. Формула одна.', 'حجمان', '200 مل للمنزل و500 مل للاستخدام الاحترافي المنتظم، بالتركيبة نفسها.'),
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
    t('No oil in it', 'No plant oil, no butter, no wax, no emulsifier anywhere in the formula.', 'В нём нет масла', 'Ни растительного масла, ни баттера, ни воска, ни эмульгатора нигде в составе.', 'بلا زيت فيه', 'لا زيت نباتي ولا زبدة ولا شمع ولا مستحلب في أي مكان من التركيبة.'),
    t('Zinc PCA 0.05%', 'The same dose as the Problem Control Serum, so the pair is genuinely matched.', 'Цинк PCA 0,05%', 'Та же доза, что в сыворотке Problem Control: пара действительно парная.', 'زنك PCA ٠٫٠٥٪', 'نفس جرعة سيروم Problem Control، فالثنائي متطابق فعلاً.'),
    t('Water, thickened', '86.6% water held in a gel by 1.3% of polymer. No oil phase to emulsify.', 'Загущённая вода', '86,6% воды в геле, удержанной 1,3% полимера. Эмульгировать нечего.', 'ماء مكثّف', '٨٦٫٦٪ ماء في جل يحمله ١٫٣٪ من البوليمر. لا طور زيتي ليُستحلب.'),
    t('Trehalose 1.5% · Xylitol 0.5%', 'Two grams of humectant in every hundred, more than every botanical combined.', 'Трегалоза 1,5% · Ксилитол 0,5%', 'Два грамма увлажнителя на сто, больше всех растительных экстрактов вместе.', 'تريهالوز ١٫٥٪ · زايليتول ٠٫٥٪', 'غرامان من المرطّب في كل مئة، أكثر من كل النباتات مجتمعة.'),
    t('Massage, do not pat', 'The carton asks for massage here. Patting is what the serum wants.', 'Втирать, а не вбивать', 'Коробка просит здесь втирание. Вбивание — это про сыворотку.', 'دلّكي، لا تربّتي', 'العلبة تطلب التدليك هنا. التربيت هو ما يريده السيروم.'),
    t('50g and 250g', 'Home tube and clinic tube. The formula inside is identical.', '50 г и 250 г', 'Домашняя туба и клиническая. Формула внутри одинаковая.', '٥٠ غ و٢٥٠ غ', 'أنبوب المنزل وأنبوب العيادة. التركيبة داخلهما متطابقة.'),
  ],
  '31': [
    t('Niacinamide found at 2.04%', 'The certificate assays the active rather than repeating the recipe. Specified 2.00%.', 'Ниацинамид: найдено 2,04%', 'Сертификат анализирует актив, а не повторяет рецепт. Спецификация 2,00%.', 'نياسيناميد وُجد عند ٢٫٠٤٪', 'الشهادة تفحص الفعّال بدل تكرار الوصفة. المواصفة ٢٫٠٠٪.'),
    t('Macadamia oil 13%', 'The second ingredient after water, and the character of the whole cream.', 'Масло макадамии 13%', 'Второй ингредиент после воды и характер всего крема.', 'زيت مكاداميا ١٣٪', 'المكوّن الثاني بعد الماء وشخصية الكريم كله.'),
    t('−29.7% melanin / 2 weeks', 'Skin surface melanin 3.443 to 2.419 in the maker\'s two-week trial.', 'Меланин −29,7% за 2 недели', 'Поверхностный меланин 3,443 → 2,419 в двухнедельном исследовании производителя.', '−٢٩٫٧٪ ميلانين / أسبوعان', 'ميلانين السطح من ٣٫٤٤٣ إلى ٢٫٤١٩ في تجربة المصنّع لأسبوعين.'),
    t('The orange is astaxanthin', 'No pigment added. The shade can shift with air without the cream changing.', 'Оранжевый — астаксантин', 'Пигмент не добавлен. Оттенок может меняться от воздуха, крем — нет.', 'البرتقالي أستازانتين', 'بلا صبغة مضافة. الدرجة قد تتغيّر مع الهواء دون أن يتغيّر الكريم.'),
    t('95%, not 100%', 'On the tone question the panel came back at 95%. The serum was the one at 100%.', '95%, а не 100%', 'По вопросу о тоне панель дала 95%. Сто процентов было у сыворотки.', '٩٥٪ لا ١٠٠٪', 'في سؤال اللون جاءت اللوحة عند ٩٥٪. المئة بالمئة كانت للسيروم.'),
    t('50g and 230g', 'Home tube and clinic tube. Same formula inside.', '50 г и 230 г', 'Домашняя и клиническая туба. Формула внутри одна.', '٥٠ غ و٢٣٠ غ', 'أنبوب المنزل وأنبوب العيادة. التركيبة نفسها.'),
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
    t('Niacinamide 2%', 'The brightening functional. This is the figure that belongs on a card.', 'Ниацинамид 2%', 'Осветляющий функциональный актив. Цифра, которой место на карточке.', 'نياسيناميد ٢٪', 'مكوّن التفتيح الوظيفي. هذا هو الرقم الذي يستحق بطاقة.'),
    t('Adenosine 0.04%', 'The wrinkle-care functional pair. Help the look of lines, not a lift story.', 'Аденозин 0,04%', 'Функциональная пара для морщин. Вид линий, не история про лифтинг.', 'أدينوسين ٠٫٠٤٪', 'شريك العناية الوظيفية بالتجاعيد. مساعدة مظهر الخطوط، لا قصة شد.'),
    t('Take-off hydrogel', 'Under the eyes and/or brow bones for 20 to 40 minutes, then remove.', 'Снимаемый гидрогель', 'Под глаза и/или на кости бровей на 20-40 минут, затем снять.', 'هيدروجيل يُرفع', 'تحت العينين و/أو عظمتي الحاجب ٢٠ إلى ٤٠ دقيقة، ثم أزيلي.'),
    t('60 patches / 30 uses', '101g jar. Spoon in the lid. Thirty applications, sixty pieces.', '60 патчей / 30 применений', 'Банка 101 г. Ложка в крышке. Тридцать применений, шестьдесят штук.', '٦٠ لصقة / ٣٠ استخداماً', 'جرة ١٠١ غ. ملعقة في الغطاء. ثلاثون استخداماً، ستون قطعة.'),
    t('Cooler as it sits', 'Body heat makes the gel more fluid. Moisture displaces heat, so the contour feels cooler.', 'Прохладнее по мере носки', 'Тепло тела делает гель более текучим. Влага вытесняет тепло, контур ощущается прохладнее.', 'أبرد أثناء الجلسة', 'حرارة الجسم تجعل الجل أكثر سيولة. الرطوبة تزيح الحرارة فيشعر المحيط ببرودة ألطف.'),
    t('Peptide at 46.5 ppb', 'Acetyl Hexapeptide-8 sits at 46.5 ppb. In the formula. Not the engine.', 'Пептид 46,5 ppb', 'Acetyl Hexapeptide-8 сидит на 46,5 ppb. В формуле. Не двигатель.', 'الببتيد ٤٦٫٥ جزء في المليار', 'Acetyl Hexapeptide-8 يجلس عند ٤٦٫٥ جزء في المليار. في التركيبة. ليس المحرّك.'),
  ],
  '43': [
    t('Copper Tripeptide-1', 'Stimulates dermal papilla cells and helps inhibit 5α-reductase pathways.', 'Copper Tripeptide-1', 'Стимулирует клетки дермального сосочка и помогает ингибировать 5α-редуктазу.', 'Copper Tripeptide-1', 'يحرّض خلايا الحليمة الجلدية ويساعد على تثبيط مسارات 5α-reductase.'),
    t('Anagen-support actives', 'Formula supports a healthier scalp environment for the growth phase.', 'Поддержка анагена', 'Поддерживает среду кожи головы для фазы роста.', 'دعم طور النمو', 'التركيبة تدعم بيئة فروة صحية لطور النمو.'),
    t('Leave on 3–4 hours', 'Do not rinse — leave on for at least 3–4 hours for contact time.', 'Оставить 3–4 часа', 'Не смывать — оставить минимум на 3–4 часа.', 'اتركه 3–4 ساعات', 'لا يُشطف — يُترك 3–4 ساعات على الأقل.'),
    t('Menthol cool finish', 'Cooling menthol comfort helps calm heat and scalp irritation feel.', 'Охлаждение ментолом', 'Ментол снижает ощущение жара и раздражения кожи головы.', 'انتعاش بالمنثول', 'المنثول المبرّد يهدئ حرارة وتهيج فروة الرأس.'),
    t('Daily scalp tonic', 'Targeted leave-on tonic for thinning-concern scalp routines.', 'Ежедневный тоник', 'Тоник leave-on для кожи головы при прореживании.', 'تونيك يومي لفروة الرأس', 'تونيك يُترك على الفروة لروتين تساقط الشعر.'),
    t('Pairs with scalp brush', 'Use after Scalp Brush massage to improve tonic contact.', 'С щёткой для кожи головы', 'Используйте после массажа щёткой для лучшего контакта.', 'مع فرشاة الفروة', 'يُستخدم بعد تدليك فرشاة الفروة لتحسين التماس.'),
  ],
  '44': [
    t('Sebum-aware shampoo', 'Helps reduce excess sebum while cleansing the scalp.', 'Шампунь против себума', 'Помогает снижать избыточный себум при очищении кожи головы.', 'شامبو واعٍ بالدهون', 'يساعد على تقليل الدهون الزائدة مع تنظيف فروة الرأس.'),
    t('HP-DCC Complex', 'Complex support for scalp comfort and healthier-looking hair roots.', 'Комплекс HP-DCC', 'Комплекс для комфорта кожи головы и более здоровых корней.', 'مركب HP-DCC', 'مركب لدعم راحة الفروة ومظهر جذور أكثر صحة.'),
    t('Growth-factor support', 'Helps increase expression of hair-growth factors such as VEGF.', 'Факторы роста', 'Способствует экспрессии факторов роста волос, включая VEGF.', 'دعم عوامل النمو', 'يساعد على زيادة تعبير عوامل نمو الشعر مثل VEGF.'),
    t('Cooling menthol rinse', 'Menthol cooling comfort after wash for irritated, oily scalps.', 'Охлаждающий ментол', 'Охлаждающий ментол после мытья для жирной и раздражённой кожи головы.', 'شطف منثول مبرّد', 'انتعاش بالمنثول بعد الغسل لفروة دهنية أو متهيجة.'),
    t('Flake + residue cleanse', 'Helps remove flaking and sebum remnants before tonic or ampoule steps.', 'Очищение от перхоти', 'Помогает убрать шелушение и остатки себума перед тоником или ампулой.', 'تنظيف القشور والبقايا', 'يساعد على إزالة القشور وبقايا الدهون قبل التونيك أو الأمبول.'),
    t('Medi-scalp daily wash', 'Professional medi-scalp shampoo format for regular hair-loss routines.', 'Меди-шампунь', 'Профессиональный medi-scalp шампунь для регулярного анти-loss ухода.', 'غسيل medi-scalp يومي', 'شامبو medi-scalp مهني لروتين تساقط الشعر المنتظم.'),
  ],
  '45': [
    t('Multi growth-factor ampoule', 'VEGF, HGH, EGF and VIP peptides support follicle nutrition delivery.', 'Ампула с факторами роста', 'VEGF, HGH, EGF и VIP поддерживают питание фолликулов.', 'أمبول عوامل نمو', 'ببتيدات VEGF و HGH و EGF و VIP تدعم تغذية البصيلات.'),
    t('Copper Tripeptide-1', 'Copper peptide helps create a healthier scalp environment for growth.', 'Copper Tripeptide-1', 'Медный пептид поддерживает более здоровую среду кожи головы.', 'Copper Tripeptide-1', 'ببتيد النحاس يساعد على بيئة فروة أكثر صحة للنمو.'),
    t('Saw palmetto support', 'Serenoa serrulata extract targets common hair-loss pathway concerns.', 'Со пальметто', 'Экстракт сереноа помогает при типичных факторах выпадения.', 'نخيل المنشار', 'مستخلص Serenoa serrulata يستهدف مسارات تساقط شائعة.'),
    t('Microneedling-ready', 'Formulated for stamp/roller delivery into the scalp.', 'Для микронйдлинга', 'Сформулирован для доставки штампом/роллером в кожу головы.', 'جاهز للميكرونيدلينغ', 'مصمم للتوصيل عبر الختم/الرولر إلى فروة الرأس.'),
    t('Clinic + homecare kits', 'Available in professional and home kits with applicators.', 'Клиника + дом', 'Доступны профессиональные и домашние наборы с аппликаторами.', 'عيادة ومنزل', 'يتوفر في أطقم مهنية ومنزلية مع أدوات التطبيق.'),
    t('4 ml treatment vials', 'Single-dose style vials keep each session fresh and measured.', 'Флаконы 4 мл', 'Флаконы на сессию сохраняют свежесть и дозировку.', 'قوارير 4 مل', 'قوارير لكل جلسة تحافظ على الجرعة والطزاجة.'),
  ],
  '49': [
    t('5 LED wavelengths', '423 / 532 / 583 / 640 / 830 nm modes for multi-concern LED care.', '5 длин волн LED', 'Режимы 423 / 532 / 583 / 640 / 830 нм для разных задач.', '5 أطوال موجات LED', 'أوضاع 423 / 532 / 583 / 640 / 830 نانومتر لعناية متعددة.'),
    t('Near-IR SMD LEDs', 'High-brightness near-infrared SMD LEDs support regeneration protocols.', 'Near-IR SMD LED', 'Яркие near-IR SMD LED поддерживают протоколы регенерации.', 'LEDs قريبة من تحت الأحمر', 'صمامات SMD عالية السطوع تدعم بروتوكولات التجديد.'),
    t('Postcare pairing', 'Often paired with Peptide Gel Mask under red light for recovery.', 'Постпроцедурный уход', 'Часто сочетают с Peptide Gel Mask под красным светом.', 'اقتران بعد العناية', 'غالباً يُقرن مع Peptide Gel Mask تحت الضوء الأحمر.'),
    t('Professional device', 'Clinic LED tool for regeneration, soothing and trouble-care protocols.', 'Профессиональный аппарат', 'Клинический LED для регенерации, успокоения и проблемной кожи.', 'جهاز مهني', 'أداة LED عيادية للتجديد والتهدئة وعلاج المشاكل.'),
    t('Broad 423–830 nm range', 'Covers blue-to-near-IR spectrum in one device workflow.', 'Диапазон 423–830 нм', 'Покрывает спектр от синего до near-IR в одном устройстве.', 'نطاق 423–830 نانومتر', 'يغطي الطيف من الأزرق إلى تحت الأحمر القريب في جهاز واحد.'),
    t('Protocol-driven use', 'Select wavelength by concern instead of one generic light setting.', 'По протоколу', 'Выбор длины волны по задаче, а не один общий режим.', 'استخدام وفق بروتوكول', 'يُختار طول الموجة حسب المشكلة لا وضعاً عاماً واحداً.'),
  ],
  '60': [
    t('60,000 ppm spicules', 'Professional BIO-MESO dose for intensive no-needle microneedling.', 'Спикулы 60 000 ppm', 'Профессиональная доза BIO-MESO для интенсивного микронйдлинга без игл.', 'شويكات 60,000 ppm', 'جرعة BIO-MESO مهنية للميكرونيدلينغ المكثف بلا إبر.'),
    t('3rd-gen cog spicules', 'Phytosome-coated cog spicules deliver PDRN while forming microchannels.', 'Спикулы 3-го поколения', 'Cog-спикулы с фитосомами доставляют PDRN и создают микроканалы.', 'شويكات cog من الجيل 3', 'شويكات مطلية بالفايتوزوم توصل PDRN وتشكّل قنوات دقيقة.'),
    t('PDRN + panthenol', 'BIO-MESO™ PDRN with panthenol and anti-aging complex for barrier repair.', 'PDRN + пантенол', 'BIO-MESO™ PDRN с пантенолом и anti-aging комплексом для барьера.', 'PDRN وبانثينول', 'BIO-MESO™ PDRN مع بانثينول ومركب مضاد للشيخوخة لإصلاح الحاجز.'),
    t('Bio-peeling turnover', 'Spicule peel-off effect boosts turnover, collagen and elastin production.', 'Био-пилинг', 'Эффект peel-off ускоряет обновление и синтез коллагена/эластина.', 'تقشير حيوي', 'تأثير التقشير بالشويكات يعزز التجدد وإنتاج الكولاجين والإيلاستين.'),
    t('Clinic-first intensity', 'High-dose professional step before gentler 5000 homecare maintenance.', 'Сначала клиника', 'Интенсивный клинический шаг перед домашним уходом 5000.', 'شدة العيادة أولاً', 'خطوة مهنية عالية الجرعة قبل العناية المنزلية 5000.'),
    t('No classic needles', 'Liquid / bio microneedling pathway without traditional needle devices.', 'Без классических игл', 'Био-микронйдлинг без классических игл.', 'بلا إبر تقليدية', 'مسار ميكرونيدلينغ حيوي دون أجهزة إبر تقليدية.'),
  ],
  '65': [
    t('Sodium DNA 1,010 ppm', 'Verified PDRN level for ongoing homecare regeneration.', 'Sodium DNA 1 010 ppm', 'Подтверждённый уровень PDRN для домашнего восстановления.', 'Sodium DNA 1,010 ppm', 'مستوى PDRN موثّق للتجديد المنزلي المستمر.'),
    t('5,000 ppm spicules', 'Moderate spicule dose for weekly reinforcement between clinic visits.', 'Спикулы 5 000 ppm', 'Умеренная доза спикул для еженедельной поддержки между визитами.', 'شويكات 5,000 ppm', 'جرعة شويكات معتدلة للتعزيز الأسبوعي بين زيارات العيادة.'),
    t('1.25–1.5M spicules / tube', 'About 25,000–30,000 spicules per ml in the 50 ml tube.', '1,25–1,5 млн спикул / туба', 'Около 25 000–30 000 спикул на мл в тубе 50 мл.', '1.25–1.5 مليون شويكة / أنبوب', 'نحو 25,000–30,000 شويكة لكل مل في أنبوب 50 مل.'),
    t('Weekly evening ritual', 'Use once weekly at night; expect a 6-day renewal timeline.', 'Раз в неделю вечером', 'Используйте раз в неделю вечером; цикл обновления около 6 дней.', 'طقوس مسائي أسبوعي', 'مرة أسبوعياً مساءً؛ جدول تجديد نحو 6 أيام.'),
    t('EGF + 7 peptides', 'EGF and 7-peptide complex support collagen remodeling between visits.', 'EGF + 7 пептидов', 'EGF и комплекс из 7 пептидов поддерживают ремоделирование коллагена.', 'EGF و 7 ببتيدات', 'EGF ومركب 7 ببتيدات يدعمان إعادة تشكيل الكولاجين بين الزيارات.'),
    t('5 ceramides barrier', 'Five ceramides plus phytosphingosine help reinforce the barrier after peel.', '5 церамидов', 'Пять церамидов и фитосфингозин укрепляют барьер после пилинга.', '5 سيراميدات', 'خمسة سيراميدات مع فايتوسفينغوزين تعزز الحاجز بعد التقشير.'),
  ],
  '37': [
    t('Glycerin 20%', 'The humectant. Almost a fifth of the pouch. This is the figure that belongs on a card.', 'Глицерин 20%', 'Увлажнитель. Почти пятая часть пакета. Цифра, которой место на карточке.', 'غليسرين ٢٠٪', 'المرطّب. نحو خُمس الكيس. هذا هو الرقم الذي يستحق بطاقة.'),
    t('20-40 minutes, then off', 'Sit, take the sheet off, massage the leftover in. Not fifteen. Not twenty only.', '20-40 минут, затем снять', 'Посиди, сними лист, вмассируй остаток. Не пятнадцать. Не только двадцать.', '٢٠-٤٠ دقيقة ثم انزعي', 'اجلسي، انزعي الورقة، دلّكي الباقي. ليست خمس عشرة. وليست عشرين فقط.'),
    t('After a procedure', 'Moisturizing, soothing. The registered sentence is after dermatological procedures.', 'После процедуры', 'Увлажнение, успокоение. Зарегистрированная фраза - после дерматологических процедур.', 'بعد إجراء', 'ترطيب وتهدئة. الجملة المسجّلة: بعد الإجراءات الجلدية.'),
    t('The peptide sits at 0.05 ppm', 'Acetyl Hexapeptide-8 is 0.05 ppm finished. The name says peptide. That is not the engine.', 'Пептид на 0,05 ppm', 'Ацетилгексапептид-8 - 0,05 ppm в готовом виде. Название говорит пептид. Это не двигатель.', 'الببتيد عند ٠٫٠٥ ppm', 'أسيتيل هكسا ببتيد-٨ ٠٫٠٥ جزء في المليون جاهزاً. الاسم يقول ببتيد. ليست المحرّك.'),
    t('38g × 5 sheets', 'Mesh included. Use each sheet as soon as you open the pouch. Refrigerate if you want it colder.', '38 г × 5 листов', 'Сетка в комплекте. Каждый лист - сразу после вскрытия. Охлади, если хочешь холоднее.', '٣٨ غ × ٥ ورقات', 'مع الشبكة. استخدمي كل ورقة فور الفتح. برّديه إن أردتِ برداً أقوى.'),
    t('Face sheet, not the eye patch', 'Keep it off the eyes. Niacinamide 2% and Adenosine 0.04% live on product 33.', 'Лист для лица, не патч', 'Держи в стороне от глаз. Ниацинамид 2% и аденозин 0,04% - продукт 33.', 'ورقة وجه لا لصقة عين', 'أبعديها عن العينين. نياسيناميد ٢٪ وأدينوزين ٠٫٠٤٪ على المنتج ٣٣.'),
  ],
  '36': [
    t('Eucalace® sheet tech', 'Ocean-inspired sheet mask designed for intensive soothing contact.', 'Технология Eucalace®', 'Тканевая маска с технологией Eucalace® для интенсивного успокоения.', 'تقنية Eucalace®', 'ماسك ورقي بتقنية Eucalace® لتهدئة مكثفة.'),
    t('Seaweed herb complex', 'Marine botanical complex helps replenish comfort in stressed skin.', 'Комплекс морских трав', 'Морской ботанический комплекс возвращает комфорт стрессированной коже.', 'مركب أعشاب بحرية', 'مركب نباتي بحري يعيد الراحة للبشرة المجهدة.'),
    t('Centella calm support', 'Centella extract supports recovery when skin feels hot or reactive.', 'Успокоение с центеллой', 'Центелла поддерживает восстановление при реактивности.', 'تهدئة بالقنطورية', 'مستخلص القنطورية يدعم التعافي عند الحرارة أو التهيّج.'),
    t('Post-heat rescue mask', 'Ideal after sun, flights, peels or device treatments.', 'Маска после стресса', 'Идеальна после солнца, перелётов, пилингов и аппаратов.', 'ماسك إنقاذ بعد الحر', 'مثالي بعد الشمس أو الطيران أو التقشير أو الأجهزة.'),
    t('Deep moisture sheet', 'Sheet occlusion helps drive soothing essence into dehydrated skin.', 'Глубокое увлажнение', 'Окклюзия ткани помогает доставить успокаивающую эссенцию.', 'ورقة ترطيب عميق', 'انسداد الورقة يساعد على إيصال الخلاصة المهدئة للبشرة الجافة.'),
    t('Single-use intensive', 'Ready-to-use mask for targeted recovery nights.', 'Одноразовая маска', 'Готовая маска для целевых вечеров восстановления.', 'ماسك لمرة واحدة', 'ماسك جاهز لليالي التعافي المركّزة.'),
  ],
  '50': [
    t('Four-piece eye sequence', 'Serum, 0.25mm eye roller, patches 20-40 min, then cream.', 'Последовательность из четырёх частей', 'Сыворотка, роллер 0,25 мм, патчи 20-40 мин, затем крем.', 'تسلسل من أربع قطع', 'السيروم، رولر 0.25 مم، لصقات 20-40 دقيقة، ثم الكريم.'),
    t('Arbutin 2% on two leave-ons', 'Serum and cream share the Korean pair: arbutin 2% + adenosine 0.04%.', 'Арбутин 2% на двух leave-on', 'Сыворотка и крем: арбутин 2% + аденозин 0,04%.', 'أربوتين 2% على مستحضرين', 'السيروم والكريم: أربوتين 2% + أدينوزين 0.04%.'),
    t('Niacinamide 2% on the patches', 'Take-off hydrogel. Niacinamide 2% + adenosine 0.04%. Then remove.', 'Ниацинамид 2% на патчах', 'Гидрогель. Ниацинамид 2% + аденозин 0,04%. Затем снять.', 'نياسيناميد 2% على اللصقات', 'هيدروجيل. نياسيناميد 2% + أدينوزين 0.04%. ثم تُرفع.'),
    t('0.25mm eye roller, kit only', 'One-body, 60 needles. Not the 450-needle face roller.', 'Роллер 0,25 мм только в наборе', 'Цельный, 60 игл. Не лицевой роллер на 450 игл.', 'رولر 0.25 مم في الطقم فقط', 'قطعة واحدة، 60 إبرة. ليس رولر الوجه 450 إبرة.'),
    t('Registered Korean kit', 'Own carton, own barcode. Not a UAE-assembled beauty box.', 'Зарегистрированный корейский набор', 'Своя коробка, свой штрихкод. Не собранный здесь бокс.', 'طقم كوري مسجّل', 'علبة وباركود خاصان. ليس صندوق جمال جُمع هنا.'),
    t('Peanut oil in the cream', 'Skip the kit if peanut is an allergen, or buy serum and patches alone.', 'Арахисовое масло в креме', 'Не берите набор при аллергии на арахис, или сыворотка и патчи отдельно.', 'زيت الفول السوداني في الكريم', 'تجاوزي الطقم إن كان الفول السوداني محسّساً، أو السيروم واللصقات وحدهما.'),
  ],


  '25': [
    t('Post-treatment recovery', 'Specialized cream for calming skin after professional procedures.', 'Восстановление после процедур', 'Специализированный крем для успокоения кожи после профессиональных процедур.', 'تعافٍ بعد العلاجات', 'كريم متخصص لتهدئة البشرة بعد الإجراءات المهنية.'),
    t('Centella repair complex', 'Centella-focused care helps redness and irritation settle faster.', 'Комплекс с центеллой', 'Уход с центеллой помогает быстрее снять красноту и раздражение.', 'مركب إصلاح بالقنطورية', 'عناية بالقنطورية تساعد على تهدئة الاحمرار والتهيّج أسرع.'),
    t('Redness + edema comfort', 'Supports comfort when skin shows erythema or post-care puffiness.', 'Комфорт при красноте', 'Поддерживает комфорт при эритеме и постпроцедурной пастозности.', 'راحة من الاحمرار والتورم', 'يدعم الراحة عند الاحمرار أو الانتفاخ بعد العناية.'),
    t('Peptide support layer', 'Peptide technology helps the skin look calmer during recovery.', 'Пептидная поддержка', 'Пептидная технология помогает более спокойному виду в период восстановления.', 'طبقة دعم ببتيدية', 'تقنية الببتيدات تساعد البشرة على مظهر أهدأ أثناء التعافي.'),
    t('Clinic finish cream', 'Final leave-on step after needling, peels or device treatments.', 'Финишный крем клиники', 'Финальный leave-on шаг после нидлинга, пилингов и аппаратов.', 'كريم إنهاء عيادي', 'خطوة نهائية تُترك بعد الإبر أو التقشير أو الأجهزة.'),
    t('Daily barrier seal', 'Also useful as a soothing day cream when skin feels reactive.', 'Ежедневный барьер', 'Также как успокаивающий дневной крем при реактивной коже.', 'ختم حاجز يومي', 'مفيد أيضاً ككريم مهدئ يومي عندما تكون البشرة متفاعلة.'),
  ],
  '38': [
    t('Gel + sheet, ten minutes', 'Acidic gel and a bicarbonate sheet meet on dry skin. CO₂ forms, you wait ten minutes, you rinse.', 'Гель + лист, десять минут', 'Кислый гель и бикарбонатный лист встречаются на сухой коже. Образуется CO₂, десять минут, смыть.', 'جل + ورقة، عشر دقائق', 'جل حمضي وورقة بيكربونات يلتقيان على بشرة جافة. يتكوّن CO₂، عشر دقائق، ثم تشطفين.'),
    t('Sodium bicarbonate 9%', 'The reaction partner in the mask. Without it there is no CO₂.', 'Гидрокарбонат натрия 9%', 'Партнёр реакции в маске. Без него нет CO₂.', 'بيكربونات الصوديوم ٩٪', 'شريك التفاعل في القناع. بدونها لا يتكوّن CO₂.'),
    t('Five treatments', 'Gel 20g ×5, mask 12g ×5, spatula ×1. No peptide sheet in the box.', 'Пять процедур', 'Гель 20 г ×5, маска 12 г ×5, шпатель ×1. Пептидного листа в коробке нет.', 'خمس جلسات', 'جل ٢٠ غ ×٥، قناع ١٢ غ ×٥، ملعقة ×١. لا ورقة ببتيد في العلبة.'),
    t('Once or twice a week', 'Standard once a week. Twice on the intensive programme.', 'Раз или два в неделю', 'Обычно раз в неделю. Дважды на интенсивной программе.', 'مرة أو مرتين في الأسبوع', 'مرة كمعيار. مرتين في البرنامج المكثّف.'),
    t('Dry skin first', 'Cleanse, dry thoroughly, gel, then the sheet coated side up.', 'Сначала сухая кожа', 'Очистить, тщательно высушить, гель, затем лист покрытой стороной вверх.', 'البشرة الجافة أولًا', 'نظّفي وجفّفي تمامًا، الجل، ثم الورقة الوجه المطلي للأعلى.'),
    t('Weekly home kit', 'A weekly carboxy step, not a daily cream and not a clinic-only protocol.', 'Домашний еженедельный набор', 'Еженедельный карбокси-шаг, не ежедневный крем и не только кабинетная процедура.', 'طقم منزلي أسبوعي', 'خطوة كاربوكسي أسبوعية، لا كريم يومي ولا بروتوكول عيادي فقط.'),
  ],
  '42': [
    t('SPF 30 / PA++ BB', 'Daily blemish balm with SPF 30 PA++ for lighter coverage days.', 'BB SPF 30 / PA++', 'Ежедневный BB с SPF 30 PA++ для более лёгкого покрытия.', 'BB SPF 30 / PA++', 'كريم BB يومي بحماية SPF 30 PA++ لأيام التغطية الأخف.'),
    t('Tone-correcting base', 'Evens the look of imperfections while keeping a skincare-first finish.', 'База под тон', 'Выравнивает несовершенства с уходовым финишем.', 'قاعدة مصححة للون', 'يوحّد مظهر العيوب مع إنهاء عناية أولاً.'),
    t('Everyday office SPF', 'Useful under makeup or alone for commute and indoor-outdoor days.', 'Ежедневный офисный SPF', 'Под макияж или соло для офиса и города.', 'واقي يومي للمكتب', 'مفيد تحت المكياج أو وحده للتنقل والأيام المختلطة.'),
    t('Skincare BB hybrid', 'Coverage plus conditioning actives for a less makeup-heavy look.', 'Уходовый BB', 'Покрытие плюс уходовые активы для менее «макияжного» вида.', 'BB هجين عناية', 'تغطية مع مكوّنات عناية لمظهر أقل مكياجاً.'),
    t('Lighter than cushion SPF', 'Choose when you want BB coverage without the SPF 50+ cushion level.', 'Легче кушона SPF 50+', 'Когда нужно BB-покрытие без уровня защиты кушона SPF 50+.', 'أخف من كوشن SPF 50+', 'اختره عندما تريد تغطية BB دون مستوى كوشن SPF 50+.'),
    t('Daily tube format', 'Practical cream format for quick morning application.', 'Формат тубы', 'Удобный кремовый формат для быстрого утреннего нанесения.', 'صيغة أنبوب يومية', 'صيغة كريم عملية للتطبيق الصباحي السريع.'),
  ],
  '46': [
    t('Scalp peel prep', 'Light scalp peeling cleanses keratin and sebum before tonic or ampoule steps.', 'Пилинг кожи головы', 'Лёгкий пилинг очищает кератин и себум перед тоником или ампулой.', 'تحضير تقشير الفروة', 'تقشير خفيف ينظّف الكيراتين والدهون قبل التونيك أو الأمبول.'),
    t('Copper peptide cleanse', 'Copper Tripeptide-1 supports a healthier-feeling scalp environment.', 'Медный пептид', 'Copper Tripeptide-1 поддерживает более здоровую среду кожи головы.', 'تنظيف ببتيد النحاس', 'Copper Tripeptide-1 يدعم بيئة فروة أكثر صحة.'),
    t('Saw palmetto support', 'Serenoa extract targets common scalp concerns linked to thinning.', 'Со пальметто', 'Экстракт сереноа помогает при типичных факторах прореживания.', 'دعم نخيل المنشار', 'مستخلص Serenoa يستهدف مخاوف الفروة المرتبطة بالتساقط.'),
    t('BHA scalp refine', 'Salicylic acid helps clear residue for better treatment contact.', 'BHA для кожи головы', 'Салициловая кислота помогает очистить остатки для лучшего контакта активов.', 'تنقية BHA للفروة', 'حمض الساليسيليك يساعد على إزالة البقايا لتماس علاجي أفضل.'),
    t('Cooling menthol refresh', 'Menthol cooling comfort after peel prep.', 'Охлаждающий ментол', 'Охлаждающий ментол после пилинг-подготовки.', 'انتعاش بالمنثول', 'راحة تبريد بالمنثول بعد تحضير التقشير.'),
    t('Pre-microneedling step', 'Standard first step before Hair Solution + stamp protocols.', 'Шаг перед микронйдлингом', 'Стандартный первый шаг перед Hair Solution + штамп.', 'خطوة قبل الميكرونيدلينغ', 'الخطوة الأولى القياسية قبل Hair Solution والختم.'),
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
