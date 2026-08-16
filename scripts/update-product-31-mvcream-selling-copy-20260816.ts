/**
 * Rewrite MULTI VITA RADIANCE CREAM (product 31) against the Intertek dossier
 * and the DTS MG deck. See components/product/mvcream/mvcreamCopy.ts.
 *
 * What this fixes:
 *   - Astaxanthin sold as an antioxidant powerhouse. It is at 0.001%, ten
 *     parts per million, and it is mostly what makes the cream orange.
 *   - Macadamia oil at 13% was not mentioned at all, though it is the second
 *     ingredient after water and the whole character of the product.
 *   - The niacinamide assay was not mentioned either, though it is the single
 *     strongest fact available: specified 2.00%, found 2.04%.
 *   - Melanin-care clinical quoted without its figures.
 *   - Ceramide implied as a barrier active at 0.001%, five hundred times less
 *     than product 27.
 *   - productNumber was null, so the record resolved through its id.
 */
import { PrismaClient } from '@prisma/client'

const url = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL || ''
const prisma = new PrismaClient({ accelerateUrl: url } as never)

const FULL_INCI =
  'Aqua (Water), Macadamia Ternifolia Seed Oil, Dimethicone, Methylpropanediol, Glycerin, Hydrogenated Polydecene, ' +
  'Niacinamide, 1,2-Hexanediol, Cetearyl Ethylhexanoate, Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, ' +
  'Squalane, Glyceryl Stearate, Polysorbate 60, Betaine, Erythritol, Butylene Glycol, Silica, ' +
  'Dimethicone/Vinyl Dimethicone Crosspolymer, Sorbitan Isostearate, Citrus Aurantium Bergamia (Bergamot) Fruit Oil, ' +
  'Disodium EDTA, Limonene, Ascorbic Acid, Glycyrrhiza Uralensis (Licorice) Root Extract, Caprylic/Capric Triglyceride, ' +
  'Hydrogenated Lecithin, Gluconolactone, Polyglyceryl-10 Oleate, Linalool, Astaxanthin, Ceramide NP, ' +
  'Polyglyceryl-10 Stearate, Panthenol, Sodium Ascorbyl Phosphate, Tocopheryl Acetate, Glyceryl Linolenate, ' +
  'Glyceryl Arachidonate, Retinyl Palmitate, Biotin, Thiamine HCl, Folic Acid, Pyridoxine, Menadione, Cyanocobalamin.'

const EN = {
  description:
    'A full 2% of niacinamide, and this is the one product in the range whose certificate actually tests for it rather than taking the recipe\'s word: the batch on file came back at 2.04%. Same active and same dose as the Multi Vita serum, carried here in 13% macadamia oil instead of water. The orange colour is the astaxanthin itself, with no pigment added. In the maker\'s two-week trial surface melanin fell 29.7%. Morning and night, with sunscreen over it by day.',
  productDetails: JSON.stringify({
    form: 'Leave-on face cream, tube',
    size: '50g homecare / 230g professional',
    activeTested: 'Niacinamide specified at 2.00%, found at 2.04% in the batch on file',
    technology: 'Niacinamide 2% carried in 13% macadamia oil with 1% squalane',
    keyBenefits: 'Even tone, fed skin, comfort',
    usage: 'Morning and night, with sunscreen by day',
    skinType: 'Normal to dry, with uneven tone',
    application: 'Apply on the face after the serum and work it in',
    colour: 'Orange, from the astaxanthin. No pigment added',
    fragrance: 'Bergamot fruit oil, with limonene and linalool',
    testing: 'Dermatologically tested',
    origin: 'Made in Korea by DTS MG',
  }),
  keyFeatures: JSON.stringify([
    {
      title: 'Niacinamide tested, not just declared',
      description:
        'The certificate runs a laboratory assay on the active. Specified at 2.00%, found at 2.04% in the batch on file.',
    },
    {
      title: 'Macadamia oil 13%',
      description:
        'The second ingredient after water. Its fatty acid profile is unusually close to skin\'s own sebum, and it is why this feels nothing like the serum.',
    },
    {
      title: 'The orange is the astaxanthin',
      description:
        'No pigment has been added. The shade can shift a little with air exposure without the cream changing how it works.',
    },
    {
      title: 'Minus 29.7% at two weeks',
      description:
        'Skin surface melanin fell from 3.443 to 2.419 in the manufacturer\'s trial, measured after two weeks.',
    },
  ]),
  benefits: JSON.stringify([
    'Niacinamide at 2%, found at 2.04% in the batch on file',
    'Carried in 13% macadamia oil with 1% squalane',
    'Surface melanin down 29.7% at two weeks in the maker\'s trial',
    'The orange colour is astaxanthin, with no pigment added',
    'Morning and night, with sunscreen over it by day',
    '50g and 230g. Dermatologically tested. Made in Korea by DTS MG',
  ]),
  ingredients: JSON.stringify([
    {
      name: 'Niacinamide 2%, found at 2.04%',
      description:
        'Neat pharmacopoeia-grade material, not a diluted premix. Korea treats niacinamide as a functional ingredient, so the batch certificate runs an assay on it and prints the result rather than repeating the recipe.',
    },
    {
      name: 'Macadamia Ternifolia Seed Oil 13%',
      description:
        'The second ingredient after water and the character of the whole cream. Its fatty acid profile sits unusually close to the skin\'s own sebum.',
    },
    {
      name: 'Squalane 1% · Betaine 0.5% · Erythritol 0.5%',
      description:
        'Squalane is another lipid skin already makes. The two humectants behind it stop the oil being the only thing holding water in.',
    },
    {
      name: 'Astaxanthin 0.001%',
      description:
        'Ten parts per million, delivered in a liposome premix, and the reason the cream is orange. It is a real presence and a small one, and the figures you may have seen about astaxanthin being thousands of times stronger than vitamin C come from testing the raw material, not this cream.',
    },
    {
      name: 'Licorice 0.01% · Ascorbic Acid 0.01%',
      description:
        'The supporting tone pair, the licorice arriving through a named premix. Honest hundredths of a percent rather than headline actives.',
    },
    {
      name: 'The vitamin tail',
      description:
        'Retinyl palmitate, biotin, thiamine, folic acid, B6, menadione and B12, each at a ten-millionth of a percent or less. They complete the twelve-vitamin count and they are not doing the work.',
    },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: [
    '1. Cleanse and tone first',
    '2. Multi Vita Radiance Serum goes on before this and gets patted in',
    '3. Apply the cream on the face and work it in. Last step at night',
    '4. Sunscreen over it in the morning, every day',
    '5. Close the cap. The orange can shift with air without the cream changing',
  ].join('\n'),
  directions:
    'Dermatologically tested. For normal to dry skin with uneven tone. Contains bergamot fruit oil, with limonene and linalool. For external use only. Keep clear of the eye area. Stop and speak to a doctor if redness, swelling or irritation appears. Store cool and dark with the cap closed.',
}

const AR = {
  description:
    'نياسيناميد ٢٪ كاملة، وهذا هو المنتج الوحيد في المجموعة الذي تفحصه شهادته فعلاً بدل الاكتفاء بالوصفة: الدفعة المسجّلة جاءت عند ٢٫٠٤٪. الفعّال نفسه والجرعة نفسها الموجودة في سيروم Multi Vita، محمولاً هنا في ١٣٪ من زيت المكاداميا بدل الماء. اللون البرتقالي هو الأستازانتين نفسه، دون إضافة أي صبغة. في تجربة المصنّع خلال أسبوعين انخفض ميلانين السطح ٢٩٫٧٪. صباحاً ومساءً، مع واقي الشمس فوقه نهاراً.',
  productDetails: JSON.stringify({
    form: 'كريم وجه يُترك على البشرة، أنبوب',
    size: '٥٠ غ منزلي / ٢٣٠ غ احترافي',
    activeTested: 'نياسيناميد بمواصفة ٢٫٠٠٪، وُجد عند ٢٫٠٤٪ في الدفعة المسجّلة',
    technology: 'نياسيناميد ٢٪ محمول في ١٣٪ زيت مكاداميا مع ١٪ سكوالان',
    keyBenefits: 'لون متجانس، بشرة مغذّاة، راحة',
    usage: 'صباحاً ومساءً، مع واقي الشمس نهاراً',
    skinType: 'عادية إلى جافة، بلون غير متجانس',
    application: 'يوضع على الوجه بعد السيروم ويُفرد',
    colour: 'برتقالي، من الأستازانتين. بلا صبغة مضافة',
    fragrance: 'زيت ثمرة البرغموت، مع ليمونين ولينالول',
    testing: 'مختبر جلدياً',
    origin: 'صنع في كوريا من DTS MG',
  }),
  keyFeatures: JSON.stringify([
    { title: 'نياسيناميد مفحوص لا مُعلن فقط', description: 'الشهادة تُجري فحصاً مخبرياً للفعّال. المواصفة ٢٫٠٠٪، والنتيجة ٢٫٠٤٪ في الدفعة المسجّلة.' },
    { title: 'زيت مكاداميا ١٣٪', description: 'المكوّن الثاني بعد الماء. تركيب أحماضه الدهنية قريب بشكل غير معتاد من زهم البشرة، ولهذا لا يشبه إحساسه السيروم إطلاقاً.' },
    { title: 'البرتقالي هو الأستازانتين', description: 'لم تُضف أي صبغة. وقد تتغيّر الدرجة قليلاً مع الهواء دون أن يتغيّر عمل الكريم.' },
    { title: 'ناقص ٢٩٫٧٪ خلال أسبوعين', description: 'ميلانين سطح البشرة انخفض من ٣٫٤٤٣ إلى ٢٫٤١٩ في تجربة المصنّع، مقاساً بعد أسبوعين.' },
  ]),
  benefits: JSON.stringify([
    'نياسيناميد بنسبة ٢٪، وُجد عند ٢٫٠٤٪ في الدفعة المسجّلة',
    'محمول في ١٣٪ من زيت المكاداميا مع ١٪ سكوالان',
    'ميلانين السطح أقل بـ ٢٩٫٧٪ خلال أسبوعين في تجربة المصنّع',
    'اللون البرتقالي أستازانتين، بلا صبغة مضافة',
    'صباحاً ومساءً، مع واقي الشمس فوقه نهاراً',
    '٥٠ غ و٢٣٠ غ. مختبر جلدياً. صنع في كوريا من DTS MG',
  ]),
  ingredients: JSON.stringify([
    { name: 'نياسيناميد ٢٪، وُجد عند ٢٫٠٤٪', description: 'مادة صافية بدرجة دستورية، لا خليط مخفّف. كوريا تعامل النياسيناميد كمكوّن وظيفي، فشهادة الدفعة تُجري فحصاً له وتطبع النتيجة بدل تكرار الوصفة.' },
    { name: 'زيت المكاداميا ١٣٪', description: 'المكوّن الثاني بعد الماء وشخصية الكريم كله. تركيب أحماضه الدهنية قريب بشكل غير معتاد من زهم البشرة نفسه.' },
    { name: 'سكوالان ١٪ · بيتايين ٠٫٥٪ · إريثريتول ٠٫٥٪', description: 'السكوالان دهن آخر تصنعه البشرة أصلاً. والمرطّبان خلفه يمنعان الزيت من أن يكون الشيء الوحيد الذي يحبس الماء.' },
    { name: 'أستازانتين ٠٫٠٠١٪', description: 'عشرة أجزاء بالمليون، موصلة في خليط ليبوزومي، وسبب برتقالية الكريم. وجود حقيقي وصغير، والأرقام التي قد تكونين رأيتها عن كون الأستازانتين أقوى بآلاف المرات من فيتامين C تأتي من فحص المادة الخام لا هذا الكريم.' },
    { name: 'السوس ٠٫٠١٪ · حمض الأسكوربيك ٠٫٠١٪', description: 'ثنائي اللون المساند، والسوس يصل عبر خليط مُسمّى. أجزاء من مئة صادقة لا فعّالات عناوين.' },
    { name: 'ذيل الفيتامينات', description: 'ريتينيل بالميتات وبيوتين وثيامين وحمض الفوليك وB6 وميناديون وB12، كلٌّ عند جزء من عشرة ملايين من المئة أو أقل. يكملون عدد الاثني عشر ولا يقومون بالعمل.' },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'التنظيف', instruction: 'نظّفي وضعي التونر أولاً' },
    { step: 'السيروم', instruction: 'Multi Vita Radiance Serum يوضع قبل هذا ويُربّت' },
    { step: 'الكريم', instruction: 'ضعي الكريم على الوجه وافرديه. الخطوة الأخيرة ليلاً' },
    { step: 'واقي الشمس', instruction: 'واقي الشمس فوقه صباحاً، كل يوم' },
    { step: 'الغطاء', instruction: 'أغلقي الغطاء. البرتقالي قد يتغيّر مع الهواء دون أن يتغيّر الكريم' },
  ]),
  directions:
    'مختبر جلدياً. للبشرة العادية إلى الجافة بلون غير متجانس. يحتوي زيت ثمرة البرغموت، مع ليمونين ولينالول. للاستخدام الخارجي فقط. أبعديه عن محيط العين. توقّفي واستشيري طبيباً إن ظهر احمرار أو تورم أو تهيّج. احفظيه بارداً ومظلماً والغطاء مغلق.',
}

const RU = {
  description:
    'Полные 2% ниацинамида, и это единственный продукт линейки, чей сертификат действительно проверяет его содержание, а не повторяет рецептуру: партия из досье показала 2,04%. Тот же актив и та же доза, что в сыворотке Multi Vita, только здесь он идёт в 13% масла макадамии, а не в воде. Оранжевый цвет — это сам астаксантин, пигмент не добавлен. В двухнедельном исследовании производителя поверхностный меланин снизился на 29,7%. Утром и вечером, днём сверху SPF.',
  productDetails: JSON.stringify({
    form: 'Несмываемый крем для лица, туба',
    size: '50 г домашний / 230 г профессиональный',
    activeTested: 'Ниацинамид по спецификации 2,00%, найдено 2,04% в партии из досье',
    technology: 'Ниацинамид 2% в носителе из 13% масла макадамии с 1% сквалана',
    keyBenefits: 'Ровный тон, накормленная кожа, комфорт',
    usage: 'Утром и вечером, днём с SPF',
    skinType: 'Нормальная и сухая, с неровным тоном',
    application: 'Нанести на лицо после сыворотки и распределить',
    colour: 'Оранжевый, от астаксантина. Пигмент не добавлен',
    fragrance: 'Масло плодов бергамота, с лимоненом и линалоолом',
    testing: 'Дерматологически протестировано',
    origin: 'Сделано в Корее, DTS MG',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Ниацинамид проверен, а не только заявлен', description: 'Сертификат проводит лабораторный анализ актива. Спецификация 2,00%, найдено 2,04% в партии из досье.' },
    { title: 'Масло макадамии 13%', description: 'Второй ингредиент после воды. Его жирнокислотный профиль необычно близок к собственному себуму кожи, и поэтому крем совсем не похож на сыворотку.' },
    { title: 'Оранжевый — это астаксантин', description: 'Пигмент не добавлен. Оттенок может немного меняться от воздуха, при этом крем работает по-прежнему.' },
    { title: 'Минус 29,7% за две недели', description: 'Поверхностный меланин снизился с 3,443 до 2,419 в исследовании производителя, измерение через две недели.' },
  ]),
  benefits: JSON.stringify([
    'Ниацинамид 2%, найдено 2,04% в партии из досье',
    'В носителе из 13% масла макадамии с 1% сквалана',
    'Поверхностный меланин ниже на 29,7% за две недели у производителя',
    'Оранжевый цвет — астаксантин, пигмент не добавлен',
    'Утром и вечером, днём сверху SPF',
    '50 г и 230 г. Дерматологически протестировано. Сделано в Корее, DTS MG',
  ]),
  ingredients: JSON.stringify([
    { name: 'Ниацинамид 2%, найдено 2,04%', description: 'Чистое сырьё фармакопейного качества, а не разбавленный премикс. Корея считает ниацинамид функциональным ингредиентом, поэтому сертификат партии проводит его анализ и печатает результат, а не повторяет рецепт.' },
    { name: 'Масло макадамии 13%', description: 'Второй ингредиент после воды и характер всего крема. Его жирнокислотный профиль необычно близок к собственному себуму кожи.' },
    { name: 'Сквалан 1% · Бетаин 0,5% · Эритритол 0,5%', description: 'Сквалан — ещё один липид, который кожа делает сама. Два увлажнителя за ним не дают маслу быть единственным, что удерживает воду.' },
    { name: 'Астаксантин 0,001%', description: 'Десять частей на миллион, в липосомном премиксе, и причина оранжевого цвета. Присутствие реальное и небольшое, а цифры о том, что астаксантин в тысячи раз сильнее витамина C, получены на сырье, а не на этом креме.' },
    { name: 'Солодка 0,01% · Аскорбиновая кислота 0,01%', description: 'Вспомогательная пара по тону, солодка приходит через именованный премикс. Честные сотые доли процента, а не заглавные активы.' },
    { name: 'Витаминный хвост', description: 'Ретинилпальмитат, биотин, тиамин, фолиевая кислота, B6, менадион и B12, каждый на уровне одной десятимиллионной процента или ниже. Они дополняют счёт до двенадцати и работу не делают.' },
    { name: 'Full INCI', description: FULL_INCI },
  ]),
  howToUse: JSON.stringify([
    { step: 'Очищение', instruction: 'Сначала очищение и тоник' },
    { step: 'Сыворотка', instruction: 'Multi Vita Radiance Serum идёт до этого и вбивается' },
    { step: 'Крем', instruction: 'Нанесите крем на лицо и распределите. Вечером это последний шаг' },
    { step: 'SPF', instruction: 'Утром сверху солнцезащита, каждый день' },
    { step: 'Крышка', instruction: 'Закрывайте крышку. Оранжевый может измениться от воздуха, крем при этом прежний' },
  ]),
  directions:
    'Дерматологически протестировано. Для нормальной и сухой кожи с неровным тоном. Содержит масло плодов бергамота, с лимоненом и линалоолом. Только для наружного применения. Держите подальше от области вокруг глаз. Прекратите использование и обратитесь к врачу при покраснении, отёке или раздражении. Храните в прохладе и темноте с закрытой крышкой.',
}

async function main() {
  const p = await prisma.product.findFirst({
    where: { OR: [{ productNumber: '31' }, { id: '31' }] },
    select: { id: true },
  })
  if (!p) throw new Error('product 31 not found')

  await prisma.product.update({
    where: { id: p.id },
    data: {
      productNumber: '31',
      description: EN.description,
      descriptionRu: RU.description,
      descriptionAr: AR.description,
      productDetails: EN.productDetails,
      keyFeatures: EN.keyFeatures,
      benefits: EN.benefits,
      ingredients: EN.ingredients,
      howToUse: EN.howToUse,
      directions: EN.directions,
    },
  })

  const a = await prisma.product.findFirst({
    where: { productNumber: '31' },
    select: { productNumber: true, ingredients: true, description: true },
  })
  console.log('productNumber:', a?.productNumber)
  console.log('assay figure present:', a?.description?.includes('2.04%'))
  console.log('macadamia 13% present:', a?.ingredients?.includes('13%'))
  console.log('no 6000x claim:', !a?.ingredients?.includes('6,000'))
  console.log('done')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

export { AR, RU }
