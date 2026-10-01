/**
 * Product 70, MESOPECIA KIT: GENOSYS's own three-step scalp kit, "The root of it." campaign.
 * Replaces product 47 (the HR³ MATRIX MESOPECIA KIT with a 0.5 mm roller and six vials), which
 * is hidden and redirected here (1 Oct 2026).
 *
 * In the kit, each one the full product sold on its own page:
 *   46 HR³ MATRIX SCALP PEELING α 100 ml      clear
 *   45 HR³ MATRIX HAIR SOLUTION α 4 ml × 8    feed (the professional box)
 *   67 GENOSYS DTS Microneedle Stamp 0.25 mm   press (one sterile, single-use stamp)
 *
 * Facts come from those three pages and their sources, not from the old 47 record: alcohol denat.
 * 33.6% with propylene glycol, menthol 0.9% + menthyl lactate 0.8%, swab on, 5 minutes, no rinse,
 * dry before heat (46); nutrition supply and hair conditioning, copper tripeptide-1 5 ppm, menthol,
 * niacinamide and panthenol, use straight after opening, shake well, avoid in pregnancy and
 * lactation (45); 140 disk-cut needles, straight down, partings 1 to 2 cm apart, half a vial or a
 * whole one by area, 10 to 15 minutes, the HR³ scalp protocol at 0.25 to 0.5 mm, sterile and single
 * use, the stamp contraindications (67).
 * Left out on purpose: any hair-loss, regrowth or growth-factor effect (owner decision for the
 * whole HR³ line, 17 Aug), a session frequency (the practitioner sets it), and DTS MG.
 */

export const PRODUCT_70_NAME = 'MESOPECIA KIT'
export const PRODUCT_70_RU_NAME = 'Набор MESOPECIA KIT для кожи головы'
export const PRODUCT_70_AR_NAME = 'طقم MESOPECIA KIT لفروة الرأس'

export const PRODUCT_70_PRICE = 1100
export const PRODUCT_70_SIZE = '1 kit'

/** The three products in the kit, in the order they are used. */
export const PRODUCT_70_COMPONENTS = ['46', '45', '67'] as const

export const PRODUCT_70_EN = {
  description:
    'The root of it. Beautiful hair starts at the scalp, and the Mesopecia Kit cares for it in three steps, with every product in one box: HR³ MATRIX SCALP PEELING α 100 ml to clear the scalp, eight 4 ml vials of HR³ MATRIX HAIR SOLUTION α to nourish and condition, and a sterile 0.25 mm GENOSYS stamp to work it in, parting by parting. Clear: smooth the peeling over the scalp with a swab, leave it 5 minutes and let it dry. Feed: part the hair every 1 to 2 cm and apply the solution along each parting. Press: set the stamp flat in the parting, press straight down, lift and move on, for 10 to 15 minutes. 140 disk-cut needles go down between the hairs and lift straight off, so nothing rolls through the hair and nothing tangles. One stamp, one session: more stamps are sold separately. Made in Korea.',
  productDetails: JSON.stringify({
    form: 'Three-step scalp care kit',
    contents: 'HR³ MATRIX SCALP PEELING α 100 ml · HR³ MATRIX HAIR SOLUTION α 4 ml × 8 vials · Microneedle Stamp 0.25 mm × 1',
    steps: 'Clear (peeling) · Feed (solution) · Press (stamp)',
    stamp: '140 disk-cut needles, 0.25 mm, sterile and single use',
    session: '10 to 15 minutes of stamping for the whole scalp, parting by parting',
    origin: 'Made in Korea',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Clear', description: 'Scalp Peeling α lifts sebum, flakes and styling build-up, and menthol leaves the scalp cool and fresh.' },
    { title: 'Feed', description: 'Hair Solution α with copper tripeptide-1, niacinamide and panthenol nourishes and conditions, applied along each parting.' },
    { title: 'Press', description: 'The 0.25 mm stamp presses straight down between the hairs and lifts off: no rolling, no tangles.' },
    { title: 'Eight fresh vials', description: 'A full box of single-use 4 ml vials, opened one at a time and used straight away.' },
    { title: 'Full-size products', description: 'The same peeling, solution and stamp sold on their own pages, for less than the three bought separately.' },
    { title: 'Made in Korea', description: 'The HR³ MATRIX liquids and the GENOSYS stamp, made in Korea.' },
  ]),
  benefits: JSON.stringify([
    'Three steps in one box: clear, feed, press',
    'A clean, cool, fresh-feeling scalp',
    'Nourished, conditioned hair',
    'A stamp that works between the hairs: nothing tangles, nothing pulls',
    'Eight single-use vials, always fresh',
    'Less than the three bought separately',
  ]),
  howToUse: JSON.stringify([
    { step: 'Clear', instruction: 'Smooth Scalp Peeling α over the scalp with a cotton swab and massage it in. Leave it 5 minutes, do not rinse, and let the scalp dry completely.' },
    { step: 'Part', instruction: 'Comb the hair into partings 1 to 2 cm apart.' },
    { step: 'Feed', instruction: 'Shake a vial of Hair Solution α, open it and apply it along the parting: half a vial for a small area, a whole vial for a larger one. Use it straight after opening.' },
    { step: 'Press', instruction: 'Open the sterile stamp. Set the head flat in the parting, press straight down, lift and move one head-width along. Work parting by parting for 10 to 15 minutes, and never drag it.' },
    { step: 'Finish', instruction: 'Massage the rest of the solution in gently and leave it on. Discard the stamp: one stamp, one session.' },
  ]),
  directions:
    'For professional use or under a practitioner\u2019s guidance; the practitioner sets the needle length and the interval between sessions. External use only: keep away from the eyes and mucous membranes. Avoid during pregnancy and breastfeeding. Do not use the stamp with a metal allergy, a tendency to keloid scarring, psoriasis or severe dermatitis of the scalp, bleeding disorders, uncontrolled diabetes or severe hypertension, or on a damaged, inflamed or infected scalp. The peeling contains alcohol and is flammable until dry: keep heat and styling tools away until the scalp is dry. Use each vial straight after opening. The stamp is sterile and single use: never clean, share or reuse it.',
} as const

export const PRODUCT_70_RU_DESCRIPTION =
  'Всё дело в корнях. Красивые волосы начинаются с кожи головы, и Mesopecia Kit ухаживает за ней в три шага, со всеми средствами в одной коробке: HR³ MATRIX SCALP PEELING α 100 мл очищает кожу головы, восемь ампул HR³ MATRIX HAIR SOLUTION α по 4 мл питают и кондиционируют, а стерильный штамп GENOSYS 0,25 мм прорабатывает раствор, пробор за пробором. Очищение: нанесите пилинг ватной палочкой, оставьте на 5 минут и дайте коже высохнуть. Питание: разделите волосы на проборы через 1-2 см и нанесите раствор вдоль каждого пробора. Штамп: поставьте головку ровно в пробор, нажмите строго вниз, поднимите и переходите дальше, 10-15 минут. 140 игл из металлических дисков входят между волосами и поднимаются прямо, поэтому ничего не катится по волосам и ничего не путается. Один штамп - одна процедура, дополнительные штампы продаются отдельно. Сделано в Корее.'

export const PRODUCT_70_AR_DESCRIPTION =
  'السر في الجذور. الشعر الجميل يبدأ من فروة الرأس، وطقم Mesopecia Kit يعتني بها في ثلاث خطوات، وكل المنتجات في علبة واحدة: HR³ MATRIX SCALP PEELING α بحجم 100 مل لتنظيف الفروة، وثماني أمبولات HR³ MATRIX HAIR SOLUTION α سعة 4 مل للتغذية والتكييف، وختم GENOSYS معقم بطول 0.25 مم يعمل بالمحلول فرقاً بعد فرق. التنظيف: وزّعي المقشر بعود قطني، واتركيه 5 دقائق، ثم دعي الفروة تجف. التغذية: افرقي الشعر كل 1 إلى 2 سم وضعي المحلول على طول كل فرق. الضغط: ضعي رأس الختم مستوياً في الفرق، واضغطي مباشرة إلى الأسفل، ثم ارفعيه وتابعي، لمدة 10 إلى 15 دقيقة. 140 إبرة مقطوعة من أقراص معدنية تنزل بين الشعرات وترتفع مباشرة، فلا شيء يتدحرج عبر الشعر ولا شيء يتشابك. ختم واحد لجلسة واحدة، والأختام الإضافية تُباع منفصلة. صُنع في كوريا.'

export const PRODUCT_70_RU_TRANSLATION = {
  name: PRODUCT_70_RU_NAME,
  description: PRODUCT_70_RU_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'Набор для ухода за кожей головы в три шага',
    contents: 'HR³ MATRIX SCALP PEELING α 100 мл · HR³ MATRIX HAIR SOLUTION α 4 мл × 8 ампул · микроигольчатый штамп 0,25 мм × 1',
    steps: 'Очищение (пилинг) · Питание (раствор) · Штамп',
    stamp: '140 игл из металлических дисков, 0,25 мм, стерильный, одноразовый',
    session: '10-15 минут работы штампом на всю кожу головы, пробор за пробором',
    origin: 'Сделано в Корее',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Очищение', description: 'Scalp Peeling α убирает себум, чешуйки и остатки стайлинга, а ментол оставляет кожу головы прохладной и свежей.' },
    { title: 'Питание', description: 'Hair Solution α с медным трипептидом-1, ниацинамидом и пантенолом питает и кондиционирует, вдоль каждого пробора.' },
    { title: 'Штамп', description: 'Штамп 0,25 мм опускается строго вниз между волосами и поднимается: без прокатывания и без спутывания.' },
    { title: 'Восемь свежих ампул', description: 'Полная коробка одноразовых ампул по 4 мл: открываете по одной и сразу используете.' },
    { title: 'Полноразмерные средства', description: 'Те же пилинг, раствор и штамп, что продаются отдельно, дешевле, чем все три по отдельности.' },
    { title: 'Сделано в Корее', description: 'Средства HR³ MATRIX и штамп GENOSYS, произведённые в Корее.' },
  ]),
  benefits: JSON.stringify([
    'Три шага в одной коробке: очищение, питание, штамп',
    'Чистая, прохладная, свежая кожа головы',
    'Напитанные, кондиционированные волосы',
    'Штамп работает между волосами: ничего не путается и не тянет',
    'Восемь одноразовых ампул, всегда свежих',
    'Дешевле, чем все три по отдельности',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'Очищение', instruction: 'Нанесите Scalp Peeling α на кожу головы ватной палочкой и помассируйте. Оставьте на 5 минут, не смывайте и дайте коже полностью высохнуть.' },
    { step: 'Проборы', instruction: 'Разделите волосы расчёской на проборы через 1-2 см.' },
    { step: 'Питание', instruction: 'Встряхните ампулу Hair Solution α, откройте и нанесите вдоль пробора: половину ампулы на небольшой участок, целую на больший. Используйте сразу после вскрытия.' },
    { step: 'Штамп', instruction: 'Откройте стерильный штамп. Поставьте головку ровно в пробор, нажмите строго вниз, поднимите и сместите на ширину головки. Работайте пробор за пробором 10-15 минут и никогда не тяните штамп по коже.' },
    { step: 'Завершение', instruction: 'Мягко вмассируйте остаток раствора и не смывайте. Штамп утилизируйте: один штамп - одна процедура.' },
  ]),
  directions:
    'Для профессионального применения или под контролем специалиста; длину игл и интервал между процедурами определяет специалист. Только для наружного применения: избегайте попадания в глаза и на слизистые. Не применять во время беременности и грудного вскармливания. Не используйте штамп при аллергии на металл, склонности к келоидным рубцам, псориазе или выраженном дерматите кожи головы, нарушениях свёртываемости крови, некомпенсированном диабете или выраженной гипертонии, а также на повреждённой, воспалённой или инфицированной коже головы. Пилинг содержит спирт и огнеопасен до высыхания: не используйте фен и стайлеры, пока кожа головы не высохнет. Используйте каждую ампулу сразу после вскрытия. Штамп стерильный и одноразовый: никогда не очищайте, не передавайте и не используйте его повторно.',
}

export const PRODUCT_70_AR_TRANSLATION = {
  name: PRODUCT_70_AR_NAME,
  description: PRODUCT_70_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    form: 'طقم للعناية بفروة الرأس في ثلاث خطوات',
    contents: 'HR³ MATRIX SCALP PEELING α بحجم 100 مل · HR³ MATRIX HAIR SOLUTION α سعة 4 مل × 8 أمبولات · ختم الوخز الدقيق 0.25 مم × 1',
    steps: 'التنظيف (المقشر) · التغذية (المحلول) · الضغط (الختم)',
    stamp: '140 إبرة مقطوعة من أقراص معدنية، 0.25 مم، معقم وللاستخدام مرة واحدة',
    session: '10 إلى 15 دقيقة بالختم لكامل فروة الرأس، فرقاً بعد فرق',
    origin: 'صُنع في كوريا',
  }),
  keyFeatures: JSON.stringify([
    { title: 'التنظيف', description: 'يزيل Scalp Peeling α الدهون والقشور وبقايا مستحضرات التصفيف، ويترك المنثول الفروة باردة ومنتعشة.' },
    { title: 'التغذية', description: 'Hair Solution α مع ثلاثي ببتيد النحاس-1 والنياسيناميد والبانثينول يغذي ويكيّف، على طول كل فرق.' },
    { title: 'الضغط', description: 'ينزل ختم 0.25 مم مباشرة بين الشعرات ثم يرتفع: بلا تدحرج وبلا تشابك.' },
    { title: 'ثماني أمبولات جديدة', description: 'علبة كاملة من أمبولات 4 مل للاستخدام مرة واحدة، تفتحين واحدة وتستخدمينها فوراً.' },
    { title: 'منتجات بالحجم الكامل', description: 'المقشر والمحلول والختم نفسها التي تُباع منفصلة، بسعر أقل من شراء الثلاثة منفصلة.' },
    { title: 'صُنع في كوريا', description: 'سوائل HR³ MATRIX وختم GENOSYS، مصنوعة في كوريا.' },
  ]),
  benefits: JSON.stringify([
    'ثلاث خطوات في علبة واحدة: تنظيف، تغذية، ضغط',
    'فروة رأس نظيفة وباردة ومنتعشة',
    'شعر مغذّى ومكيّف',
    'ختم يعمل بين الشعرات: لا تشابك ولا شدّ',
    'ثماني أمبولات للاستخدام مرة واحدة، جديدة دائماً',
    'بسعر أقل من شراء الثلاثة منفصلة',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'التنظيف', instruction: 'وزّعي Scalp Peeling α على فروة الرأس بعود قطني ودلّكيه. اتركيه 5 دقائق من دون شطف، ثم دعي الفروة تجف تماماً.' },
    { step: 'الفروق', instruction: 'افرقي الشعر بالمشط فروقاً تفصل بينها 1 إلى 2 سم.' },
    { step: 'التغذية', instruction: 'رجّي أمبولة Hair Solution α وافتحيها وضعيها على طول الفرق: نصف أمبولة لمساحة صغيرة، وأمبولة كاملة لمساحة أكبر. استخدميها فور فتحها.' },
    { step: 'الضغط', instruction: 'افتحي الختم المعقم. ضعي الرأس مستوياً في الفرق، واضغطي مباشرة إلى الأسفل، ثم ارفعيه وحرّكيه بعرض الرأس. اعملي فرقاً بعد فرق لمدة 10 إلى 15 دقيقة، ولا تسحبيه على الفروة أبداً.' },
    { step: 'الختام', instruction: 'دلّكي ما تبقى من المحلول بلطف واتركيه من دون شطف. تخلّصي من الختم: ختم واحد لجلسة واحدة.' },
  ]),
  directions:
    'للاستخدام المهني أو بإشراف مختص؛ يحدد المختص طول الإبر والفاصل بين الجلسات. للاستخدام الخارجي فقط: تجنبي ملامسة العينين والأغشية المخاطية. تجنبي الاستخدام أثناء الحمل والرضاعة. لا تستخدمي الختم مع حساسية المعادن أو الميل إلى الندبات الجدرية أو الصدفية أو التهاب جلد فروة الرأس الشديد أو اضطرابات تخثر الدم أو السكري غير المنضبط أو ارتفاع ضغط الدم الشديد، ولا على فروة متضررة أو ملتهبة أو مصابة بعدوى. يحتوي المقشر على الكحول وهو قابل للاشتعال حتى يجف: أبعدي أدوات الحرارة والتصفيف حتى تجف الفروة. استخدمي كل أمبولة فور فتحها. الختم معقم وللاستخدام مرة واحدة: لا تنظفيه ولا تشاركيه ولا تعيدي استخدامه أبداً.',
}
