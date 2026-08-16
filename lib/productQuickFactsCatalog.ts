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
    t('Dual eye + lip remover', 'One biphasic formula for waterproof eye and lip makeup.', 'Снятие макияжа глаз и губ', 'Одна двухфазная формула для стойкого макияжа глаз и губ.', 'مزيل للعين والشفاه', 'تركيبة ثنائية الطور لمكياج العين والشفاه المقاوم للماء.'),
    t('Peptide eye care', 'Palmitoyl Tripeptide-5 and Acetyl Tetrapeptide-5 support firmer-looking eye skin.', 'Пептидный уход за глазами', 'Palmitoyl Tripeptide-5 и Acetyl Tetrapeptide-5 поддерживают более упругий вид зоны глаз.', 'عناية ببتيدية للعين', 'Palmitoyl Tripeptide-5 و Acetyl Tetrapeptide-5 يدعمان مظهراً أكثر تماسكاً حول العين.'),
    t('Vita 10 complex', 'Vitamin blend helps condition skin while makeup is removed.', 'Комплекс Vita 10', 'Витаминный комплекс ухаживает за кожей во время снятия макияжа.', 'مركب Vita 10', 'مزيج فيتامينات يعتني بالبشرة أثناء إزالة المكياج.'),
    t('Botanical oil support', 'Carrot, broccoli and sea buckthorn oils help leave a comfortable finish.', 'Растительные масла', 'Масла моркови, брокколи и облепихи оставляют комфортное ощущение.', 'زيوت نباتية داعمة', 'زيوت الجزر والبروكلي ونبق البحر تترك ملمساً مريحاً.'),
    t('Shake before use', 'Shake to blend phases, then sweep without harsh rubbing.', 'Встряхнуть перед использованием', 'Встряхните, чтобы смешать фазы, затем снимайте без сильного трения.', 'يُرج قبل الاستخدام', 'يُرج لخلط الطورين ثم يُزال المكياج دون فرك قاسٍ.'),
    t('200 ml daily size', 'Practical bottle format for home makeup removal.', 'Объём 200 мл', 'Удобный формат для ежедневного снятия макияжа дома.', 'حجم 200 مل', 'عبوة عملية لإزالة المكياج يومياً في المنزل.'),
  ],
  '12': [
    t('Enzyme + cellulose', 'A rinse-off gommage: cellulose binds dead cells so they clump and rinse away.', 'Энзим + целлюлоза', 'Смываемый гоммаж: целлюлоза связывает мёртвые клетки, и они смываются комочками.', 'إنزيم + سليلوز', 'غوماج يُشطف: السليلوز يمسك الخلايا الميتة فتُشطف كتلًا.'),
    t('Cellulose 3%', 'The peel you feel. Plant cellulose rolls the dead cells off without grit.', 'Целлюлоза 3%', 'Пилинг, который вы чувствуете. Растительная целлюлоза скатывает клетки без крупинок.', 'سليلوز ٣٪', 'التقشير الذي تحسّين به. سليلوز نباتي يدحرج الخلايا الميتة بلا حبيبات.'),
    t('Dry skin, one minute', 'Massage on clean, dry skin for up to one minute, then rinse with tepid water.', 'Сухая кожа, минута', 'Массируйте на чистой сухой коже до минуты, затем смойте тёплой водой.', 'بشرة جافة، دقيقة', 'دلّكي على بشرة نظيفة جافة حتى دقيقة، ثم اشطفي بماء فاتر.'),
    t('Once or twice a week', 'A weekly polish, not a daily leave-on.', 'Раз или два в неделю', 'Еженедельная полировка, не ежедневный leave-on.', 'مرة أو مرتين في الأسبوع', 'تلميع أسبوعي، لا عناية يومية تُترك على البشرة.'),
    t('Face and body', 'The same gel is used on knees, elbows and heels as well as the face.', 'Лицо и тело', 'Тот же гель — на колени, локти и пятки, не только на лицо.', 'الوجه والجسم', 'الجل نفسه للركبتين والمرفقين والكعبين كما للوجه.'),
    t('100g tube', 'Dermatologically tested rinse-off peeling gel.', 'Тюбик 100 г', 'Дерматологически протестированный смываемый пилинг-гель.', 'أنبوب ١٠٠ غ', 'جل تقشير يُشطف، مختبر جلدياً.'),
  ],
  '14': [
    t('Microbiome mist', 'FENSEBIOME™ (Acetyl Heptapeptide-4) helps support a balanced skin microbiome.', 'Мист для микробиома', 'FENSEBIOME™ (Acetyl Heptapeptide-4) поддерживает баланс микробиома кожи.', 'رذاذ الميكروبيوم', 'FENSEBIOME™ (Acetyl Heptapeptide-4) يدعم توازن ميكروبيوم البشرة.'),
    t('HA multi-complex', 'Hyaluronan Multi-Complex helps replenish moisture at multiple depths.', 'Мульти-комплекс ГК', 'Мульти-комплекс ГК увлажняет на нескольких уровнях.', 'مركب هيالورون متعدد', 'مركب هيالورون متعدد يرطّب على مستويات متعددة.'),
    t('Barrier refresh spray', 'Quick mist to soothe dryness and reinforce the moisture barrier on the go.', 'Спрей для барьера', 'Быстрый мист от сухости и для поддержки влагобарьера.', 'رذاذ لدعم الحاجز', 'رذاذ سريع لتهدئة الجفاف وتعزيز حاجز الرطوبة.'),
    t('Dewy makeup prep', 'Spray before makeup when you want a fresher, dewier complexion.', 'Сияние под макияж', 'Распылите перед макияжем для более свежего «dewу» эффекта.', 'تحضير مكياج ندي', 'يُرش قبل المكياج لمنح البشرة إشراقة ندية.'),
    t('Everyday barrier care', 'Useful when skin feels tight, flaky or depleted by AC and heat.', 'Ежедневный уход за барьером', 'Полезно при стянутости, шелушении и сухости от кондиционера и жары.', 'عناية يومية بالحاجز', 'مفيد عند الشد أو التقشر أو الجفاف بسبب التكييف والحرارة.'),
    t('80 ml travel mist', 'Compact bottle for desk, bag and post-flight refresh.', '80 мл', 'Компактный формат для сумки, офиса и путешествий.', 'رذاذ 80 مل', 'عبوة مدمجة للمكتب والحقيبة وتجديد البشرة بعد السفر.'),
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
    t('SPF 50+ / PA++++', 'Highest-tier UVB/UVA grade in the GENOSYS sun range for outdoor heat.', 'SPF 50+ / PA++++', 'Максимальная защита в линейке GENOSYS для активного солнца.', 'SPF 50+ / PA++++', 'أعلى درجة حماية في مجموعة GENOSYS لحرارة الشمس الخارجية.'),
    t('Hybrid UV filters', 'Chemical filters plus Titanium Dioxide for broad-spectrum defense.', 'Гибридные фильтры', 'Химические фильтры плюс диоксид титана для широкого спектра.', 'مرشحات هجينة', 'مرشحات كيميائية مع ثاني أكسيد التيتانيوم لحماية واسعة الطيف.'),
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
    t('>60% moisture essence', 'More than 60% of the formula is moisture essence for a natural healthy glow.', '>60% увлажняющей эссенции', 'Более 60% формулы — увлажняющая эссенция для естественного сияния.', 'أكثر من 60% خلاصة مرطبة', 'أكثر من 60% من التركيبة خلاصة مرطبة لإشراقة طبيعية صحية.'),
    t('9 regenerating peptides', 'Repairing Pep9 Complex helps calm irritated, post-treatment skin.', '9 регенерирующих пептидов', 'Repairing Pep9 Complex помогает успокоить раздражённую постпроцедурную кожу.', '9 ببتيدات مجدِّدة', 'مركب Repairing Pep9 يساعد على تهدئة البشرة المتهيجة بعد العلاجات.'),
    t('Cushion + refill (15 g × 2)', 'Pack includes 1 cushion, 1 refill and puff — refill-only packs are also available.', 'Кушон + рефил (15 г × 2)', 'В наборе 1 кушон, 1 рефил и спонж; есть и отдельный рефил.', 'كوشن + عبوة إعادة 15 غ × 2', 'تشمل العبوة كوشناً وعبوة إعادة وإسفنجة — وتتوفر عبوات إعادة فقط.'),
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
    t('Two mask formats', 'A 50 ml EGF Repair Oxymask and one Sea Algae sheet provide two distinct mask steps.', 'Два формата масок', 'EGF Repair Oxymask 50 мл и одна маска Sea Algae дают два разных формата ухода.', 'نوعان من الأقنعة', 'قناع EGF Repair Oxymask بحجم 50 مل وقناع Sea Algae ورقي يقدمان خطوتين مختلفتين.'),
    t('Barrier-first sequence', 'Cleanser → booster → optional mask → sensitive serum → barrier cream.', 'Барьерная последовательность', 'Очищение → бустер → маска по необходимости → сыворотка → барьерный крем.', 'تسلسل يركز على الحاجز', 'منظف، ثم معزز، فقناع اختياري، ثم سيروم للبشرة الحساسة وكريم الحاجز.'),
    t('Save AED 254', 'AED 1,696 separate value; box price AED 1,442 after the built-in 15% saving.', 'Экономия 254 AED', 'Стоимость по отдельности 1 696 AED; цена набора 1 442 AED со скидкой 15%.', 'وفّر 254 درهماً', 'القيمة المنفصلة 1,696 درهماً؛ سعر المجموعة 1,442 درهماً بعد توفير 15%.'),
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

  '20': [
    t('ACZERO® sebum control', 'Patented ACZERO® helps regulate excess sebum and calm acne-prone inflammation.', 'ACZERO® контроль себума', 'Патентованный ACZERO® регулирует себум и успокаивает воспаление.', 'ACZERO® للتحكم بالدهون', 'مركب ACZERO® الحاصل على براءة يساعد على تنظيم الدهون وتهدئة الالتهاب.'),
    t('PORE LASER™ refining', 'Patented PORE LASER™ complex supports pore appearance and skin renewal.', 'PORE LASER™', 'Патентованный PORE LASER™ помогает порам и обновлению кожи.', 'PORE LASER™', 'مركب PORE LASER™ الحاصل على براءة يدعم مظهر المسام وتجديد البشرة.'),
    t('Redness −16.6%', 'Clinically proven soothing on acne-prone skin with about 16.6% improvement.', 'Краснота −16,6%', 'Клинически успокаивает проблемную кожу — улучшение около 16,6%.', 'احمرار −16.6%', 'تهدئة مثبتة سريرياً لبشرة حب الشباب بتحسّن نحو 16.6%.'),
    t('Non-comedogenic certified', 'Clinically tested and certified as non-comedogenic (QACS Ltd.).', 'Некомедогенный', 'Клинически протестирован и сертифицирован как некомедогенный.', 'غير مسبب للرؤوس السوداء', 'مختبر ومُعتمد سريرياً كغير مسبب لانسداد المسام.'),
    t('Tea tree + Zinc PCA', 'Tea Tree Complex with Zinc PCA and niacinamide for clearer-looking skin.', 'Чайное дерево + Zinc PCA', 'Tea Tree Complex с Zinc PCA и ниацинамидом для более чистого вида.', 'شجرة الشاي و Zinc PCA', 'مركب شجرة الشاي مع Zinc PCA والنياسيناميد لبشرة أوضح.'),
    t('HydroFerment hydration', 'HydroFerment Complex helps keep hydration while controlling oil.', 'HydroFerment увлажнение', 'HydroFerment Complex поддерживает увлажнение при контроле жира.', 'ترطيب HydroFerment', 'مركب HydroFerment يحافظ على الترطيب مع التحكم بالدهون.'),
  ],
  '21': [
    t('Multi Vita 12 Complex', 'Twelve-vitamin complex targets dullness and uneven tone for a brighter finish.', 'Комплекс Multi Vita 12', 'Комплекс из 12 витаминов для тусклого и неровного тона.', 'مركب Multi Vita 12', 'مركب من 12 فيتاميناً يستهدف البهتان وعدم تجانس اللون.'),
    t('MELAZERO® melanin care', 'Patented MELAZERO® melanin-care complex supports clearer-looking skin.', 'MELAZERO®', 'Патентованный MELAZERO® помогает более ясному тону.', 'MELAZERO®', 'مركب MELAZERO® الحاصل على براءة لدعم لون أوضح.'),
    t('−28.0% melanin / 2 weeks', 'Clinical chart: skin-surface melanin 6.190 → 4.457 (−28.0%) after 2 weeks.', 'Меланин −28.0%', 'Клинически индекс меланина поверхности: 6.190 → 4.457 (−28.0%) за 2 недели.', '−28.0% ميلانين / أسبوعان', 'مخطط سريري: ميلانين السطح 6.190 → 4.457 (−28.0%) بعد أسبوعين.'),
    t('Panthenol-rich glow', 'Panthenol-rich formula supports a natural glow and moisture barrier.', 'Сияние с пантенолом', 'Формула с пантенолом даёт естественное сияние и поддержку барьера.', 'إشراقة غنية بالبانثينول', 'تركيبة غنية بالبانثينول تدعم إشراقة طبيعية وحاجز الرطوبة.'),
    t('100% satisfaction panel', '21-woman panel: 100% reported even tone, no tightness and no irritation.', '100% удовлетворённость', 'Панель из 21 женщины: 100% отметили ровный тон, без стянутости и раздражения.', 'رضا 100%', 'لوحة من 21 امرأة: 100% أبلغن عن توحيد اللون بلا شد ولا تهيج.'),
    t('Daily radiance serum', 'Lightweight AM/PM layer under cream or sunscreen.', 'Ежедневная сыворотка сияния', 'Лёгкий слой утром и вечером под крем или SPF.', 'سيروم إشراقة يومي', 'طبقة خفيفة صباحاً ومساءً تحت الكريم أو الواقي.'),
  ],
  '29': [
    t('+82% immediate hydration', 'Clinical hydration value rose 82% immediately after a single use.', '+82% увлажнения сразу', 'Клинически увлажнение выросло на 82% сразу после одного нанесения.', '+82% ترطيب فوري', 'ارتفعت قيمة الترطيب السريرية 82% فوراً بعد استخدام واحد.'),
    t('Long-lasting hydration', 'Multi-level hyaluronic complex with mushroom extracts for sustained moisture.', 'Стойкое увлажнение', 'Многоуровневый гиалуроновый комплекс с грибными экстрактами для длительного увлажнения.', 'ترطيب طويل الأمد', 'مركب هيالورون متعدد المستويات مع مستخلصات الفطر لترطيب مستمر.'),
    t('HA + mushroom complex', 'Hyaluronic acid with Tremella and mushroom extracts for multi-depth moisture.', 'ГК + грибной комплекс', 'Гиалуроновая кислота с Tremella и грибами для многоуровневого увлажнения.', 'هيالورون ومركب فطر', 'حمض الهيالورونيك مع Tremella ومستخلصات الفطر لترطيب متعدد الأعماق.'),
    t('Barrier cream seal', 'Helps form a moisture barrier so hydration lasts longer.', 'Кремовый барьер', 'Формирует влагобарьер, чтобы увлажнение держалось дольше.', 'ختم كريمي للحاجز', 'يساعد على تشكيل حاجز رطوبة ليدوم الترطيب أطول.'),
    t('Cream after serum', 'Ideal final moisture step over hyaluron serum.', 'Финиш после сыворотки', 'Идеальный финальный шаг поверх гиалуроновой сыворотки.', 'كريم بعد السيروم', 'خطوة ترطيب نهائية مثالية فوق سيروم الهيالورون.'),
    t('50 g daily cream', 'Rich but workable texture for morning and night.', '50 г', 'Питательная, но комфортная текстура для утра и вечера.', 'كريم 50 غ', 'قوام غني وعملي للصباح والليل.'),
  ],
  '18': [
    t('HA 2,000 ppm boost', 'Rich in ultra-low-molecular hyaluronic acid at about 2,000 ppm.', 'ГК ≈ 2 000 ppm', 'Богата сверхнизкомолекулярной ГК около 2 000 ppm.', 'هيالورون ~2,000 ppm', 'غني بحمض هيالورونيك منخفض الجزيئات بنحو 2,000 ppm.'),
    t('HA multi-complex', 'Hyaluronan 11 Multi-Complex hydrates multiple depths of skin.', 'Мульти-комплекс ГК', 'Мультикомплекс Hyaluronan 11 увлажняет на нескольких уровнях.', 'مركب هيالورون متعدد', 'مركب Hyaluronan 11 يرطّب على أعماق متعددة.'),
    t('Deep hydration +52%', 'Clinical inner hydration improved about 52% after a single use.', 'Глубокое увлажнение +52%', 'Клинически глубинное увлажнение выросло примерно на 52% после одного применения.', 'ترطيب عميق +52%', 'تحسّن الترطيب الداخلي سريرياً نحو 52% بعد استخدام واحد.'),
    t('Mushroom moisture net', 'Tremella and mushroom complex supports water-binding comfort.', 'Грибная влагосеть', 'Tremella и грибной комплекс усиливают удержание влаги.', 'شبكة رطوبة فطرية', 'Tremella ومركب الفطر يدعمان الاحتفاظ بالرطوبة.'),
    t('Barrier-strengthening serum', 'Helps strengthen the moisture barrier for longer-lasting plumpness.', 'Сыворотка для барьера', 'Укрепляет влагобарьер для более стойкого эффекта.', 'سيروم لتعزيز الحاجز', 'يساعد على تعزيز حاجز الرطوبة لامتلاء يدوم أطول.'),
    t('100% satisfaction panel', 'Panel panel reported 100% satisfaction on efficacy and overall use.', '100% удовлетворённость', 'Панель отметила 100% удовлетворённость эффективностью и использованием.', 'رضا 100%', 'أبلغت لوحة المستخدمين عن رضا 100% بالفعالية والاستخدام.'),
  ],
  '15': [
    t('Sebum −50% / 4 weeks', 'Clinical use for 4 weeks decreased sebum by about 50%.', 'Себум −50% / 4 недели', 'Клинически за 4 недели себум снизился примерно на 50%.', 'الدهون −50% / 4 أسابيع', 'انخفض الزهم سريرياً نحو 50% بعد 4 أسابيع.'),
    t('Anti Sebum P patented', 'Patented botanical complex targets pores and excess oil.', 'Anti Sebum P', 'Патентованный ботанический комплекс для пор и себума.', 'Anti Sebum P', 'مركب نباتي حاصل على براءة يستهدف المسام وزيادة الدهون.'),
    t('Copper peptide balance', 'Copper Tripeptide-1 supports clearer-looking, more balanced skin.', 'Медный пептид', 'Copper Tripeptide-1 поддерживает более чистый и ровный вид.', 'ببتيد النحاس', 'Copper Tripeptide-1 يدعم بشرة أوضح وأكثر توازناً.'),
    t('Non-comedogenic toner', 'Clinically positioned for blemish-prone routines without clogging feel.', 'Некомедогенный тоник', 'Для проблемной кожи без ощущения закупорки пор.', 'تونر غير مسبب للانسداد', 'مخصّص لروتين البشرة المعرّضة للعيوب دون شعور بانسداد.'),
    t('SNOW ICE cooling', 'Cooling complex refreshes after cleansing and oil control.', 'Охлаждающий SNOW ICE', 'Охлаждающий комплекс освежает после очищения.', 'تبريد SNOW ICE', 'مركب التبريد ينعش بعد التنظيف والتحكم بالدهون.'),
    t('360° body spray', '200 ml bottle sprays upside-down for back and hard-to-reach zones.', 'Спрей 360°', 'Флакон 200 мл распыляет вверх дном для спины и труднодоступных зон.', 'رذاذ 360°', 'زجاجة 200 مل ترش بالمقلوب للظهر والمناطق الصعبة.'),
  ],
  '31': [
    t('Multi Vita 12 Complex', 'Twelve-vitamin cream finish for dull, uneven-looking complexions.', 'Комплекс Multi Vita 12', 'Крем с 12 витаминами для тусклого и неровного тона.', 'مركب Multi Vita 12', 'كريم بمركب 12 فيتاميناً للبشرة الباهتة وغير المتجانسة.'),
    t('Melanin-care clinical', 'Clinical melanin-surface care supports a clearer-looking complexion.', 'Уход за меланином', 'Клинический уход за поверхностным меланином для более ясного тона.', 'عناية بالميلانين', 'عناية سريرية بميلانين السطح لدعم لون أوضح.'),
    t('Astaxanthin defense', 'Antioxidant support helps defend against everyday environmental stress.', 'Астаксантин', 'Антиоксидантная поддержка против ежедневного стресса среды.', 'أستازانتين', 'دعم مضاد للأكسدة ضد إجهاد البيئة اليومي.'),
    t('Barrier-reinforcing cream', 'Helps reinforce the protective barrier while locking in radiance serum.', 'Крем для барьера', 'Укрепляет защитный барьер и закрепляет сыворотку сияния.', 'كريم معزز للحاجز', 'يعزز الحاجز الواقي ويثبّت سيروم الإشراقة.'),
    t('High satisfaction panel', 'User panel reported very high satisfaction on tone and comfort.', 'Высокая удовлетворённость', 'Панель отметила очень высокую удовлетворённость тоном и комфортом.', 'رضا مرتفع', 'أبلغت لوحة المستخدمين عن رضا مرتفع باللون والراحة.'),
    t('50 g radiance cream', 'Daily cream seal after Multi Vita Radiance Serum.', '50 г', 'Ежедневный крем поверх сыворотки Multi Vita Radiance.', 'كريم 50 غ', 'ختم كريمي يومي بعد سيروم Multi Vita Radiance.'),
  ],
  '17': [
    t('Arbutin 2%', 'Korean brightening functional. The figure that belongs on a card.', 'Арбутин 2%', 'Корейский осветляющий функциональный актив. Цифра для карточки.', 'أربوتين ٢٪', 'مكوّن التفتيح الوظيفي الكوري. الرقم الذي يستحق بطاقة.'),
    t('Adenosine 0.04%', 'Korean wrinkle-care functional pair in the same serum.', 'Аденозин 0,04%', 'Корейская функциональная пара для морщин в той же сыворотке.', 'أدينوسين ٠٫٠٤٪', 'شريك العناية الوظيفية بالتجاعيد في السيروم نفسه.'),
    t('Deep wrinkles, dark circles, eye puffs', 'Intensive first-layer eye serum. Then the cream seals.', 'Глубокие морщины, круги, припухлость', 'Интенсивная сыворотка первым слоем. Затем крем закрепляет.', 'تجاعيد عميقة وهالات وانتفاخ', 'سيروم عين مكثّف كطبقة أولى. ثم يختم الكريم.'),
    t('Morning and evening', 'Gently pat the contour, then leave on. Cream after when you pair it.', 'Утро и вечер', 'Мягко похлопать контур, затем оставить. Затем крем, если используете пару.', 'صباحاً ومساءً', 'ربّتي المحيط بلطف ثم اتركي. الكريم بعدها عند استخدام الثنائي.'),
    t('Avoid pregnancy / lactation', 'The pack says avoid. No retinyl and no peanut oil, and the warning still stands.', 'Не при беременности', 'Упаковка говорит избегать. Нет ретинола и нет арахиса, и предупреждение всё равно стоит.', 'تجنّبي الحمل والرضاعة', 'العبوة تقول تجنّبي. لا ريتينيل ولا زيت فول سوداني، والتنبيه قائم.'),
    t('10ml leave-on', 'Dermatologically tested intensive eye serum. Made in Korea by DTS MG.', '10 мл leave-on', 'Интенсивная сыворотка, дерматологически протестирована. Сделано в Корее, DTS MG.', '١٠ مل يُترك', 'سيروم عين مكثّف مختبر جلدياً. صنع في كوريا، DTS MG.'),
  ],
  '24': [
    t('Arbutin 2%', 'Korean brightening functional. The figure that belongs on a card.', 'Арбутин 2%', 'Корейский осветляющий функциональный актив. Цифра для карточки.', 'أربوتين ٢٪', 'مكوّن التفتيح الوظيفي الكوري. الرقم الذي يستحق بطاقة.'),
    t('Adenosine 0.04%', 'Korean wrinkle-care functional pair in the same cream.', 'Аденозин 0,04%', 'Корейская функциональная пара для морщин в том же креме.', 'أدينوسين ٠٫٠٤٪', 'شريك العناية الوظيفية بالتجاعيد في الكريم نفسه.'),
    t('Wrinkles, dark circles, puffiness', 'All-in-one daily eye cream. Firmer, brighter, more defined look.', 'Морщины, круги, отёчность', 'Ежедневный крем «всё в одном». Упруже, светлее, выразительнее.', 'تجاعيد وهالات وانتفاخ', 'كريم عين يومي شامل. أمتن وأسطع وأوضح ملامح.'),
    t('Morning and evening', 'Tap and massage the contour, then leave on. Serum first when you pair it.', 'Утро и вечер', 'Похлопать и массировать контур, затем оставить. Сначала сыворотка, если используете пару.', 'صباحاً ومساءً', 'ربّتي ودلّكي المحيط ثم اتركي. السيروم أولاً عند استخدام الثنائي.'),
    t('Avoid pregnancy / lactation', 'The pack says avoid. The cream carries a retinyl palmitate ester and peanut oil.', 'Не при беременности', 'Упаковка говорит избегать. В креме эфир ретинилпальмитата и арахисовое масло.', 'تجنّبي الحمل والرضاعة', 'العبوة تقول تجنّبي. الكريم يحمل إستر ريتينيل بالميتات وزيت الفول السوداني.'),
    t('20g leave-on', 'Dermatologically tested daily eye cream. Made in Korea by DTS MG.', '20 г leave-on', 'Ежедневный крем, дерматологически протестирован. Сделано в Корее, DTS MG.', '٢٠ غ يُترك', 'كريم عين يومي مختبر جلدياً. صنع في كوريا، DTS MG.'),
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
