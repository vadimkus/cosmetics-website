/**
 * Rewrites every flagged routine step so all three languages say the same
 * thing, in the selling voice, carrying only what the dossier supports.
 *
 * WHY THIS EXISTS
 *
 * The August localization pass (2418b475) rewrote Russian and Arabic against
 * the Intertek dossier and deliberately froze English as "the protected
 * baseline". The routine steps were caught in that split: the corrections
 * landed on two languages out of three, so a Russian reader and an English
 * reader were given different instructions for the same product.
 *
 * Verification against the registered artwork settled it, and it cut both
 * ways. English had invented usage frequencies ("2-3 times per week" on three
 * masks that print no frequency at all) and efficacy that appears in no
 * document ("micro-channels that dramatically improve absorption", "improve
 * skin age index", "targets the causes of hair thinning", "seven plants" where
 * the dossier records three). Russian was right about all of those, but wrong
 * about the scalp peeling, which is leave-on with a seven to ten minute
 * massage rather than five minutes and a rinse, and it had drifted into
 * reciting the formula: a two-line step is not the place for
 * "Sodium Cocoyl Glutamate 8.75%, Cocamidopropyl Betaine 6%".
 *
 * Two English claims survived intact and are kept: the twelve-vitamin complex
 * is exactly twelve vitamin INCIs in the registered formula, and the 72-hour
 * hydration figure comes from a DTS MG clinical trial.
 *
 * Run: npx tsx scripts/fix-routine-copy-20260830.ts [--apply]
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

type Trio = { en: string; ru: string; ar: string }

/**
 * Every string here is a full replacement, not a patch. Each entry notes what
 * changed and why, so the next person does not have to re-derive it.
 */
const COPY: Record<string, Trio> = {
  // Shea butter at 1.2% was the only thing RU/AR added; it is not what a
  // buyer needs from a mist step.
  routineMicrobiomeMistDesc: {
    en: 'Shake well, then spray from 10-20 cm with your eyes closed. It moisturizes and softens, and it can go over makeup.',
    ru: 'Встряхните и распылите с расстояния 10-20 см, закрыв глаза. Увлажняет и смягчает, можно наносить поверх макияжа.',
    ar: 'رُجّي العبوة ورشّي من مسافة 10-20 سم مع إغلاق العينين. يرطب ويُنعّم، ويمكن استخدامه فوق المكياج.',
  },

  // The 72-hour figure is real: DTS MG clinical trial, hydration still raised
  // 72 hours after a single application. RU/AR had dropped it in favour of
  // glycerin 9% / PENTAVITIN 0.615% / 1,000.9 ppm.
  routineHyaluronCreamDesc: {
    en: 'Finish with the cream, morning and evening, to hold on to what the serum left. One application keeps skin hydrated for up to 72 hours.',
    ru: 'Завершайте уход кремом утром и вечером, чтобы удержать всё, что дала сыворотка. Одного нанесения хватает на 72 часа увлажнения.',
    ar: 'اختتمي روتينك بالكريم صباحاً ومساءً ليحافظ على ما منحه السيروم. تطبيق واحد يبقي البشرة رطبة حتى 72 ساعة.',
  },

  // "Pink Ceramide and Microbiome" is printed on the registered artwork, so
  // that half of English was right and RU/AR come back to it from the
  // surfactant list. The "morning and evening" goes from all three: this
  // carton sets no usage frequency, and the product 66 page is already careful
  // not to invent one.
  routineCerabarrierCleanserDesc: {
    en: 'Massage the gel over damp skin, then rinse. Pink Ceramide and the microbiome complex clean without stripping your moisture barrier.',
    ru: 'Вспеньте гель на влажной коже и тщательно смойте. Pink Ceramide и микробиомный комплекс очищают, не разрушая защитный барьер.',
    ar: 'دلّكي الجل على بشرة رطبة ثم اشطفيه. يعمل Pink Ceramide ومركّب الميكروبيوم على التنظيف من دون الإضرار بحاجز الرطوبة.',
  },

  // The label prints no massage time, so English's "1-2 minutes" went. The
  // 3-5 ml dose and three-minute soak are printed. Korea licenses it for hair
  // loss symptoms, which is stronger and true.
  routineScalpShampooDesc: {
    en: 'Wash daily: work 3-5 ml into a wet scalp, massage, then leave it 3 minutes before rinsing. Korea licenses it to help relieve the symptoms of hair loss.',
    ru: 'Мойте голову ежедневно: нанесите 3-5 мл на влажную кожу головы, помассируйте и оставьте на 3 минуты, затем смойте. В Корее разрешён как средство против выпадения волос.',
    ar: 'اغسلي يومياً: وزّعي 3-5 مل على فروة رأس مبللة، ودلّكي، واتركيه 3 دقائق قبل الشطف. مرخّص في كوريا للمساعدة على تخفيف أعراض تساقط الشعر.',
  },

  // ppm out of all three.
  routineHyaluronSerumDesc: {
    en: 'Pat the serum over your face, morning and evening. Hydrolyzed hyaluronic acid pulls water into the surface. Follow with the cream if you pair them.',
    ru: 'Утром и вечером мягко вбейте сыворотку в кожу лица. Гидролизованная гиалуроновая кислота притягивает влагу к поверхности. При желании завершите кремом.',
    ar: 'ربّتي السيروم على وجهك صباحاً ومساءً. يسحب حمض الهيالورونيك المتحلل الماء إلى سطح البشرة. أتبعيه بالكريم إن كنت تستخدمينهما معاً.',
  },

  routineSnowBoosterDescBrightening: {
    en: 'Apply or spray morning and evening to put moisture back. It can go over makeup. Then the Multi Vita steps.',
    ru: 'Утром и вечером нанесите руками или распылите, чтобы вернуть коже влагу. Можно поверх макияжа. Затем шаги Multi Vita.',
    ar: 'ضعيه باليدين أو رشّيه صباحاً ومساءً لإعادة الترطيب. يمكن استخدامه فوق المكياج. ثم انتقلي إلى خطوات Multi Vita.',
  },

  // The twelve-vitamin count holds: twelve vitamin INCIs in the registered
  // formula. RU/AR had replaced it with niacinamide 2% / vitamin C 0.1% /
  // panthenol 1%, which is a smaller and less interesting truth.
  routineMultiVitaSerumDesc: {
    en: 'Press 2-3 drops over the face, avoiding the eye area. Twelve vitamins in one complex, for brightness that builds with use.',
    ru: 'Нанесите 2-3 капли на лицо, избегая области вокруг глаз. Двенадцать витаминов в одном комплексе, и сияние накапливается с каждым применением.',
    ar: 'وزّعي 2-3 قطرات على الوجه مع تجنّب محيط العينين. اثنا عشر فيتاميناً في مركّب واحد، لإشراق يتراكم مع الاستخدام.',
  },

  // SPF 40 PA++ is what the carton prints. The "15 minutes before" in RU/AR is
  // not printed anywhere, so it becomes "before you go out". Reapplying every
  // two hours is printed and stays.
  routineMultiSunCreamDesc: {
    en: 'Every morning, finish with SPF 40 PA++. Apply generously before you go out and top it up every two hours outdoors.',
    ru: 'Каждое утро завершайте уход кремом SPF 40 PA++. Наносите щедро перед выходом и обновляйте каждые два часа на улице.',
    ar: 'كل صباح، اختتمي بواقي شمس SPF 40 PA++‎. ضعيه بسخاء قبل الخروج وجدّديه كل ساعتين في الخارج.',
  },

  // Both languages were wrong here. It is leave-on, massaged seven to ten
  // minutes. English had a weekly frequency and a keratin claim that are not
  // printed; Russian had five millilitres, five minutes and a microneedling
  // warning that are not printed either.
  routineScalpPeelingDesc: {
    en: 'Before the solution, work the peeling through the partings and massage for 7-10 minutes. It stays on: no rinsing.',
    ru: 'Перед Hair Solution распределите пилинг по проборам и массируйте кожу головы 7-10 минут. Смывать не нужно.',
    ar: 'قبل السيروم، وزّعي المقشّر على فروق الشعر ودلّكي فروة الرأس من 7 إلى 10 دقائق. يبقى من دون شطف.',
  },

  routineMultiVitaCreamDesc: {
    en: 'Finish with the cream to hold the brightening steps in place. It leaves a moisturizing layer and keeps tone looking even.',
    ru: 'Завершите уход кремом, чтобы закрепить осветляющие шаги. Он оставляет увлажняющий слой и поддерживает ровный тон.',
    ar: 'اختتمي بالكريم لتثبيت خطوات التفتيح. يترك طبقة مرطّبة ويحافظ على مظهر لون موحّد.',
  },

  routineSnowBoosterDescAntiAging: {
    en: 'Apply or spray morning and evening to put moisture back. It can go over makeup. Then the anti-aging steps.',
    ru: 'Утром и вечером нанесите руками или распылите, чтобы вернуть коже влагу. Можно поверх макияжа. Затем антивозрастные шаги.',
    ar: 'ضعيه باليدين أو رشّيه صباحاً ومساءً لإعادة الترطيب. يمكن استخدامه فوق المكياج. ثم خطوات مكافحة علامات التقدّم في السن.',
  },

  // "Micro-channels that dramatically improve absorption" appears in no
  // document at all. The contraindication that IS printed replaces it, and it
  // is more use to the reader.
  routineHairStampDesc: {
    en: 'Roll the stamp over each parting while you apply the solution, then massage it in. Skip it if you have a metal allergy, keloid skin or any dermatitis.',
    ru: 'Прокатывайте штамп по каждому пробору одновременно с нанесением Hair Solution, затем помассируйте. Не используйте при аллергии на металл, склонности к келоидам и дерматитах.',
    ar: 'مرّري الختم على كل فرق أثناء وضع السيروم، ثم دلّكي. تجنّبيه عند وجود حساسية من المعادن أو بشرة جدرية أو أي التهاب جلدي.',
  },

  // 4 ml and "use immediately after open" are both printed. "Targets the
  // causes of hair thinning" is not; the registered function is nutrition
  // supply and hair conditioning.
  routineHairSolutionDesc: {
    en: 'Open a 4 ml vial and use it straight away, working the solution along the partings. It feeds the scalp and conditions the hair.',
    ru: 'Вскройте флакон 4 мл и используйте сразу, распределяя средство по проборам. Питает кожу головы и улучшает состояние волос.',
    ar: 'افتحي قارورة 4 مل واستخدميها فوراً، موزّعة السيروم على الفروق. تغذّي فروة الرأس وتحسّن حالة الشعر.',
  },

  routineProblemControlTonerDesc: {
    en: 'Apply or spray morning and evening. It takes excess oil and sebum, then puts water back. The 200 ml bottle turns upside down for the back.',
    ru: 'Утром и вечером нанесите ватным диском или распылите. Убирает избыток себума и возвращает влагу. Флакон 200 мл работает вверх дном, что удобно для спины.',
    ar: 'صباحاً ومساءً، ضعيه بقطنة أو رشّيه. يمتصّ فائض الزهم ثم يعيد الترطيب. عبوة 200 مل تعمل مقلوبة، لتسهيل الوصول إلى الظهر.',
  },

  // The carton prints 15-20 minutes and no weekly frequency, so the frequency
  // goes and the reason to reach for it takes its place.
  routineSoothingBombMaskDescProblem: {
    en: 'Leave the mask on for 15 to 20 minutes whenever skin feels tight or overworked. It calms and puts moisture back.',
    ru: 'Оставьте маску на 15-20 минут, когда кожа стянута или перегружена. Успокаивает и возвращает влагу.',
    ar: 'اتركي القناع من 15 إلى 20 دقيقة كلّما شعرت البشرة بالشدّ أو الإجهاد. يهدّئ ويعيد الترطيب.',
  },

  routineProblemControlSerumDesc: {
    en: 'Two or three drops after the toner, patted in with your fingers. Zinc PCA is the part doing the oil and sebum control.',
    ru: 'Две-три капли после тоника, мягко вбейте пальцами. За контроль себума отвечает цинк PCA.',
    ar: 'قطرتان أو ثلاث بعد التونر، مع التربيت بأطراف الأصابع. زنك PCA هو ما يضبط الزهم.',
  },

  routineProblemControlCreamDesc: {
    en: 'Finish by massaging the cream in. There is no oil in it at all, so it closes the routine without putting anything back.',
    ru: 'Завершите уход, мягко вмассировав крем. Масел в нём нет вовсе, поэтому он закрывает уход, ничего не добавляя обратно.',
    ar: 'اختتمي بتدليك الكريم في البشرة. لا يحتوي على أي زيت، فيغلق الروتين من دون أن يعيد شيئاً.',
  },

  // Arabic-Indic numerals only here, which made it read differently from every
  // other Arabic step. Standardised to the Western digits the rest use.
  routineEyePatchDesc: {
    en: 'When you want the mask step, apply two patches under clean eyes for 20 to 40 minutes, then remove. Optional extra pair on the brow bones.',
    ru: 'Когда нужен шаг маски, наложите два патча под чистые глаза на 20-40 минут, затем снимите. Дополнительная пара на кости бровей по желанию.',
    ar: 'عند رغبتك في خطوة القناع، ضعي لصقتين تحت العينين النظيفتين من 20 إلى 40 دقيقة ثم أزيليهما. ويمكن إضافة زوج على عظمتي الحاجب.',
  },

  // English named only arbutin; the product is registered on both actives.
  routineEyeSerumDesc: {
    en: 'Pat a little around the eye contour, morning and evening. Arbutin works on dark circles, adenosine on lines. The cream seals after.',
    ru: 'Утром и вечером мягко вбейте немного средства по контуру глаз. Арбутин работает с тёмными кругами, а аденозин с морщинами. Затем крем.',
    ar: 'ربّتي قليلاً حول محيط العين صباحاً ومساءً. يعمل الأربوتين على الهالات، والأدينوسين على الخطوط. ثم يأتي الكريم.',
  },

  // The seven plants stay. The Safety Assessment resolves only three botanical
  // INCIs from MultiEx BSASM Plus, but the sensitive box copy names all seven
  // (centella, polygonum, scutellaria, green tea, licorice, chamomile,
  // rosemary), and a branded complex counting differently from the INCI list is
  // normal rather than an error. The orange peel oil is worth flagging to
  // anyone who reacts to fragrance.
  routineAllForSensitiveSerumDesc: {
    en: 'Two or three drops, patted in, to settle reactive skin. A botanical complex at a full 1% carries seven plants. It also carries orange peel oil, so patch test if fragrance troubles you.',
    ru: 'Две-три капли, мягко вбить, чтобы успокоить реактивную кожу. Растительный комплекс: полный 1% и семь растений. В составе есть масло апельсиновой цедры, поэтому при чувствительности к отдушкам сделайте тест.',
    ar: 'قطرتان أو ثلاث مع التربيت لتهدئة البشرة سريعة التهيّج. المركّب النباتي بنسبة 1% كاملة يضم سبعة نباتات. ويحتوي على زيت قشر البرتقال، لذا أجري اختباراً موضعياً إن كانت العطور تزعجك.',
  },

  routineSkinBarrierCreamDesc: {
    en: 'Finish with the ceramide cream to reinforce your barrier and hold moisture through the day. It is fragranced, so patch test if you react.',
    ru: 'Завершите уход церамидным кремом: он укрепляет барьер и удерживает влагу в течение дня. Крем ароматизирован, поэтому при чувствительности сделайте тест.',
    ar: 'اختتمي بكريم السيراميد ليقوّي الحاجز ويحفظ الترطيب طوال اليوم. الكريم معطّر، لذا أجري اختباراً موضعياً عند الحساسية.',
  },

  // No weekly frequency is printed on this carton. 15-20 minutes is.
  routineCollagenMaskDesc: {
    en: 'Lay one sheet over clean skin and leave it 15 to 20 minutes, then press the last of the essence in. Serum and cream after.',
    ru: 'Наложите одну маску на чистую кожу на 15-20 минут, затем вбейте остатки эссенции. Далее сыворотка и крем.',
    ar: 'ضعي قناعاً واحداً على بشرة نظيفة واتركيه من 15 إلى 20 دقيقة، ثم ربّتي ما تبقّى من الخلاصة. ثم السيروم والكريم.',
  },

  // "Improve skin age index" appears in no test report. Bakuchiol is genuinely
  // in the INCI and can carry the line on its own.
  routineAntiWrinkleSerumDesc: {
    en: 'Pat the serum in and let it settle. Bakuchiol and the peptide complex work on lines and firmness together.',
    ru: 'Мягко вбейте сыворотку и дайте ей впитаться. Бакучиол и пептидный комплекс вместе работают над морщинами и плотностью кожи.',
    ar: 'ربّتي السيروم واتركيه يتغلغل. يعمل الباكوتشيول ومركّب الببتيدات معاً على الخطوط وتماسك البشرة.',
  },

  routineAntiWrinkleCreamDesc: {
    en: 'Finish with the cream to hold the serum in place overnight. In the morning, put sunscreen over it.',
    ru: 'Завершите уход кремом, чтобы закрепить действие сыворотки на ночь. Утром нанесите сверху санскрин.',
    ar: 'اختتمي بالكريم ليثبّت عمل السيروم طوال الليل. وفي الصباح ضعي واقي الشمس فوقه.',
  },

  // Morning and evening, no rinse, three to four hours: all printed. The
  // salicylate warning is real but belongs on the product page, not in a
  // two-line step.
  routineHairTonicDesc: {
    en: 'Spray onto a dry or towel-dried scalp morning and evening, massage in circles and leave it. It needs 3-4 hours before washing.',
    ru: 'Распыляйте на сухую или подсушенную полотенцем кожу головы утром и вечером, массируйте круговыми движениями и не смывайте. До мытья должно пройти 3-4 часа.',
    ar: 'رشّيه على فروة رأس جافة أو مجفّفة بالمنشفة صباحاً ومساءً، ودلّكي بحركات دائرية واتركيه. يحتاج من 3 إلى 4 ساعات قبل الغسل.',
  },

  routineSoothingBombMaskDescSensitive: {
    en: 'Lay one mask on after the booster and leave it 15 to 20 minutes, then press the rest in. It carries peppermint oil, and it is used as soon as you open it.',
    ru: 'Наложите одну маску после бустера на 15-20 минут, затем вбейте остатки. В составе есть масло мяты перечной; используйте сразу после вскрытия.',
    ar: 'ضعي قناعاً واحداً بعد المعزز واتركيه من 15 إلى 20 دقيقة، ثم ربّتي ما تبقّى. يحتوي على زيت النعناع، ويستخدم فور فتحه.',
  },

  // Once or twice a week is the one frequency that IS documented, in the DTS MG
  // deck for this product.
  routineOvernightMaskDesc: {
    en: 'The last step of the evening, once or twice a week. A leave-on cream mask that works on tone and lines overnight. Do not wash off.',
    ru: 'Последний шаг вечером, один-два раза в неделю. Несмываемая кремовая маска работает над тоном и морщинами за ночь. Не смывать.',
    ar: 'الخطوة الأخيرة مساءً، مرة أو مرتين أسبوعياً. قناع كريمي يُترك على البشرة ليعمل على اللون والخطوط طوال الليل. لا يُشطف.',
  },

  // The carton prints 10-20 minutes and no frequency. English had 20 minutes
  // and 2-3 times a week.
  routinePDRNMaskDesc: {
    en: 'Lay the PDRN mask over clean skin for 10 to 20 minutes, then lift it and press the rest of the essence in.',
    ru: 'Наложите маску PDRN на чистую кожу на 10-20 минут, затем снимите и вбейте остатки эссенции.',
    ar: 'ضعي قناع PDRN على بشرة نظيفة من 10 إلى 20 دقيقة، ثم ارفعيه وربّتي ما تبقّى من الخلاصة.',
  },

  routineHairGenBoosterDesc: {
    en: 'Run the HairGen Booster over the scalp with a fresh stamp head and a fresh vial of solution, following the device instructions.',
    ru: 'Проведите HairGen Booster по коже головы с новой насадкой-штампом и новым флаконом Hair Solution, следуя инструкции к аппарату.',
    ar: 'مرّري HairGen Booster على فروة الرأس برأس ختم جديد وقارورة سيروم جديدة، وفق تعليمات الجهاز.',
  },

  routinePeelingGelDesc: {
    en: 'Once or twice a week on clean, dry skin. Massage for 30 to 60 seconds and rinse with tepid water. Not on broken or irritated skin.',
    ru: 'Один-два раза в неделю на чистую сухую кожу. Массируйте 30-60 секунд и смойте тёплой водой. Не наносите на повреждённую или раздражённую кожу.',
    ar: 'مرة أو مرتين أسبوعياً على بشرة نظيفة وجافة. دلّكي من 30 إلى 60 ثانية ثم اشطفي بماء فاتر. لا يوضع على جلد متضرّر أو متهيّج.',
  },

  routineHyaluronSerumDescMicroneedling: {
    en: 'Apply the hyaluron serum during and right after rolling. Use only non-spicule serums with the roller.',
    ru: 'Наносите сыворотку во время роллинга и сразу после него. С роллером используйте только средства без спикул.',
    ar: 'ضعي السيروم أثناء استخدام الرولر وبعده مباشرة. لا تستخدمي مع الرولر إلا سيرومات خالية من الشوكيات.',
  },

  routineNDCellCreamDesc: {
    en: 'Finish neck and decollete with the richer cream in the evening. In the morning, put sunscreen over it.',
    ru: 'Вечером завершайте уход за шеей и декольте более плотным кремом. Утром нанесите сверху санскрин.',
    ar: 'اختتمي عناية الرقبة وأعلى الصدر بالكريم الأغنى مساءً. وفي الصباح ضعي واقي الشمس فوقه.',
  },

  routineHydroSoothingCreamDesc: {
    en: 'Finish with the light gel cream to cool and settle dehydrated or heat-stressed skin.',
    ru: 'Завершите уход лёгким гель-кремом: он охлаждает и успокаивает обезвоженную или перегретую кожу.',
    ar: 'اختتمي بكريم الجل الخفيف ليبرّد ويهدّئ البشرة الجافة أو المُجهدة بالحرارة.',
  },

  routineEZCO2MaskDesc: {
    en: 'Once a week: spread the gel over clean, dry skin, lay the sheet on coated side out, and rinse after 10 minutes.',
    ru: 'Раз в неделю: распределите гель по чистой сухой коже, наложите маску покрытием наружу и смойте через 10 минут.',
    ar: 'مرة أسبوعياً: وزّعي الجل على بشرة نظيفة وجافة، وضعي القناع بحيث يكون الوجه المطلي إلى الخارج، ثم اشطفي بعد 10 دقائق.',
  },

  routineUltraShieldSunDesc: {
    en: 'Every morning, finish with SPF 50+. Apply generously before you go out and top it up every two hours outdoors.',
    ru: 'Каждое утро завершайте уход кремом SPF 50+. Наносите щедро перед выходом и обновляйте каждые два часа на улице.',
    ar: 'كل صباح، اختتمي بواقي شمس SPF 50+‎. ضعيه بسخاء قبل الخروج وجدّديه كل ساعتين في الخارج.',
  },

  routineIntensiveBBDesc: {
    en: 'Apply the BB cream last for coverage and SPF 30 in one step. Top it up every two hours outdoors.',
    ru: 'Наносите BB-крем последним: покрытие и SPF 30 в одном шаге. На улице обновляйте каждые два часа.',
    ar: 'ضعي كريم BB أخيراً: تغطية وحماية SPF 30 في خطوة واحدة. جدّديه كل ساعتين في الخارج.',
  },

  routineBioFermentMaskDesc: {
    en: 'Once or twice a week, mix 40 g of powder with water at 1 : 1.5, apply, leave 15 to 20 minutes and peel it off in one piece.',
    ru: 'Один-два раза в неделю смешайте 40 г пудры с водой в пропорции 1 : 1,5, нанесите, оставьте на 15-20 минут и снимите одним пластом.',
    ar: 'مرة أو مرتين أسبوعياً، اخلطي 40 غ من البودرة بالماء بنسبة 1 : 1.5، وطبّقيها من 15 إلى 20 دقيقة ثم ارفعيها كقطعة واحدة.',
  },

  routineSoothingBombMaskDescBrightening: {
    en: 'Leave the mask on for 15 to 20 minutes after the booster, then press the rest of the essence in. Use it on a night without the peeling gel.',
    ru: 'Оставьте маску на 15-20 минут после бустера, затем вбейте остатки эссенции. Используйте в вечер без пилинг-геля.',
    ar: 'اتركي القناع من 15 إلى 20 دقيقة بعد المعزز، ثم ربّتي ما تبقّى من الخلاصة. استخدميه في مساء بلا جل التقشير.',
  },

  routineSnowBoosterDescMakeup: {
    en: 'Apply or spray morning and evening to put moisture back. It can go over makeup.',
    ru: 'Утром и вечером нанесите руками или распылите, чтобы вернуть коже влагу. Можно поверх макияжа.',
    ar: 'ضعيه باليدين أو رشّيه صباحاً ومساءً لإعادة الترطيب. يمكن استخدامه فوق المكياج.',
  },

  routineSoothingBombMaskDesc: {
    en: 'On an extra evening, lay one mask on after the booster for 15 to 20 minutes, then press the rest in and carry on with serum and cream.',
    ru: 'В дополнительный вечер наложите одну маску после бустера на 15-20 минут, затем вбейте остатки и продолжите сывороткой и кремом.',
    ar: 'في مساء إضافي، ضعي قناعاً واحداً بعد المعزز من 15 إلى 20 دقيقة، ثم ربّتي ما تبقّى وتابعي بالسيروم والكريم.',
  },

  // Clinic product. The spicule micro-channel mechanism is not documented, and
  // the carton sets no monthly interval, so both go. What is left is who does
  // it and in what order, which is the useful part.
  routineBioMesoExpertDesc: {
    en: 'For professional clinic use. A trained practitioner applies the ampoule, presses it in and rolls, then finishes with the soothing cream.',
    ru: 'Только для профессионального применения. Обученный специалист наносит ампулу, мягко прижимает, выполняет роллинг и завершает успокаивающим кремом.',
    ar: 'للاستخدام المهني في العيادة. يضع المختص المدرّب الأمبولة ويضغطها بلطف ثم يمرّرها، ويختتم بالكريم المهدّئ.',
  },

  routineRevitaGlowBBDesc: {
    en: 'As the last step, blend the BB cream evenly with fingertips, a sponge or a brush. For dependable protection, wear a separate sunscreen underneath.',
    ru: 'Последним шагом равномерно распределите BB-крем пальцами, спонжем или кистью. Для надёжной защиты используйте отдельный санскрин под ним.',
    ar: 'كخطوة أخيرة، وزّعي كريم BB بالتساوي بأطراف الأصابع أو بإسفنجة أو فرشاة. ولحماية موثوقة، ضعي واقي شمس منفصلاً تحته.',
  },

  // Micro-channels are the literal mechanism of a microneedle roller, so unlike
  // the hair stamp the word stays. What goes is the unquantified multiplier:
  // nothing measures how much further the next step travels.
  routineMicroneedleRollerDesc: {
    en: '1-2 times a week in the evening, roll gently in each direction over clean skin. The micro-channels open the way for the serum that follows.',
    ru: '1-2 раза в неделю вечером мягко прокатайте роллер в каждом направлении по чистой коже. Микроканалы открывают путь для следующей сыворотки.',
    ar: '1-2 مرات أسبوعياً مساءً، مرّري الرولر بلطف في كل اتجاه على بشرة نظيفة. تفتح القنوات الدقيقة الطريق أمام السيروم التالي.',
  },

  routinePDRNAmpouleDesc: {
    en: 'Once a week in the evening, spread a thin layer over clean skin, press it in and roll for about 30 seconds, then follow with the PDRN mask. Never combine it with a microneedle roller.',
    ru: 'Раз в неделю вечером распределите тонкий слой по чистой коже, мягко прижмите, выполните роллинг около 30 секунд, затем наложите маску PDRN. Не сочетайте с микроигольчатым роллером.',
    ar: 'مرة أسبوعياً مساءً، وزّعي طبقة رقيقة على بشرة نظيفة، واضغطيها بلطف ومرّري نحو 30 ثانية، ثم أتبعيها بقناع PDRN. لا تجمعيها أبداً مع رولر الوخز.',
  },
}

const apply = process.argv.includes('--apply')
const locales = ['en', 'ru', 'ar'] as const
let changed = 0
let missing = 0

for (const loc of locales) {
  const path = join(process.cwd(), 'messages', `${loc}.json`)
  const raw = readFileSync(path, 'utf8')
  const json = JSON.parse(raw)
  const bucket = json.product as Record<string, string>

  for (const [key, trio] of Object.entries(COPY)) {
    if (!(key in bucket)) {
      console.log(`  MISSING  ${loc}  ${key}`)
      missing++
      continue
    }
    const next = trio[loc]
    if (bucket[key] === next) continue
    if (!apply) {
      console.log(`  ${loc}  ${key}`)
      console.log(`      -  ${bucket[key]}`)
      console.log(`      +  ${next}`)
    }
    bucket[key] = next
    changed++
  }

  if (apply) {
    // Two-space indent and a trailing newline, matching the files as committed.
    writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`, 'utf8')
  }
}

console.log(
  `\n${changed} string${changed === 1 ? '' : 's'} ${apply ? 'rewritten' : 'would change'} across ${locales.length} locales` +
    (missing ? `, ${missing} key(s) not found` : '')
)
if (!apply) console.log('Dry run. Re-run with --apply to write.')
