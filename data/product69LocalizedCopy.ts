/**
 * Product 69, GENOSYS Eye Roller 0.25 mm: the "For your eyes only." campaign copy.
 *
 * The same roller that ships in the EyeCell Eye Zone Care Kit (product 50), now sold on its own
 * (MoySklad "Genosys Eye Roller 0,25mm", code 00084, article EBT025, 210 AED).
 *
 * Sources: the product 50 audit (docs/SESSION_CHANGES_2026-08-21_PRODUCT_50_EYE_ZONE_CARE_KIT_
 * LOCALIZATION_AUDIT.md) - one body, 0.25 mm, 60 needles; roll horizontally and vertically over
 * the serum for a few minutes with no numeric pressure; disinfect 5 minutes in chlorhexidine
 * before reuse and keep it personal; not with keloid tendency, stainless-steel allergy or
 * dermatitis, not on damaged, infected or irritated skin. DTS MG roller brochure: Eye Roller,
 * 0.25 mm, made in Korea by DTS MG; 0.25 mm is the shortest length in the range.
 * Left out on purpose: sterility, single use, needle thickness, steel grade, CE and the Korean
 * licence (none of the certificates names the eye roller), needle-count comparisons from the face
 * roller, any frequency, and any channel, penetration, delivery or collagen claim.
 */

export const PRODUCT_69_NAME = 'Eye Roller'
export const PRODUCT_69_RU_NAME = 'Роллер для глаз GENOSYS 0,25 мм'
export const PRODUCT_69_AR_NAME = 'رولر العين GENOSYS بطول 0.25 مم'

export const PRODUCT_69_SIZES = ['0.25mm'] as const
export const PRODUCT_69_PRICE = 210

export const PRODUCT_69_EN = {
  description:
    'For your eyes only. The GENOSYS Eye Roller is one small piece with 60 fine stainless-steel needles at 0.25 mm, the shortest length in the GENOSYS range, shaped for the curve under the eyes and along the brow bone. Roll it lightly over EyeCell Eye Contour Serum, horizontally and then vertically, for a few minutes, with no pressing. It is yours alone: disinfect it for five minutes in chlorhexidine solution before each reuse, and never share it. Made in Korea by DTS MG.',
  productDetails: JSON.stringify({
    type: 'Eye-contour microneedle roller, one-piece body',
    availableLengths: '0.25 mm',
    needleCount: '60',
    needleMaterial: 'Stainless steel',
    construction: 'One piece: handle and drum together',
    application: 'Over the serum: horizontal, then vertical passes, no pressing',
    treatmentAreas: 'Under the eyes and along the brow bone, away from the eye and the lips',
    safety: 'Personal and reusable: disinfect 5 minutes in chlorhexidine solution before each reuse, never share',
    origin: 'Made in Korea · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Made for the eye contour', description: 'A small one-piece roller, sized for the curve under the eyes and along the brow bone.' },
    { title: '0.25 mm', description: 'The shortest needle length in the GENOSYS range.' },
    { title: '60 fine needles', description: 'Stainless steel, on a drum small enough for the eye area.' },
    { title: 'Over the serum', description: 'Made to roll over EyeCell Eye Contour Serum, horizontally and then vertically, for a few minutes.' },
    { title: 'Yours alone', description: 'Reusable and personal: disinfect it for five minutes in chlorhexidine solution before each reuse, and never share it.' },
    { title: 'Made in Korea', description: 'By DTS MG, the makers of the GENOSYS microneedle rollers.' },
  ]),
  benefits: JSON.stringify([
    'Sized for the eye contour',
    '0.25 mm, the shortest GENOSYS length',
    '60 fine stainless-steel needles',
    'Rolls over EyeCell Eye Contour Serum',
    'Reusable and personal',
    'Made in Korea by DTS MG',
  ]),
  howToUse: JSON.stringify([
    { step: 'Cleanse', instruction: 'Cleanse the eye area and pat it dry.' },
    { step: 'Serum', instruction: 'Apply EyeCell Eye Contour Serum under the eyes and along the brow bone.' },
    { step: 'Roll', instruction: 'Roll lightly over the serum, horizontally and then vertically, for a few minutes, away from the eye and the lips. Do not press, and stop if it feels uncomfortable.' },
    { step: 'Finish', instruction: 'Follow with the Eye Peptide Gel Patch for 20 to 40 minutes, then Eye Contour Cream.' },
    { step: 'Care', instruction: 'Before each reuse, disinfect the roller for five minutes in chlorhexidine solution. Keep it for yourself and never share it.' },
  ]),
  directions:
    'Do not use with a tendency to keloid scarring, a stainless-steel allergy or dermatitis. Do not use on damaged, infected or irritated skin. Keep it away from the eyes and the lips. Stop if redness, swelling or irritation appears.',
} as const

export const PRODUCT_69_RU_DESCRIPTION =
  'Только для ваших глаз. Роллер GENOSYS для кожи вокруг глаз: цельный корпус и 60 тонких игл из нержавеющей стали длиной 0,25 мм, самой короткой в линейке GENOSYS, по форме контура под глазами и вдоль надбровной дуги. Лёгкими движениями прокатывайте его по сыворотке EyeCell Eye Contour Serum горизонтально, затем вертикально, несколько минут, не надавливая. Он только ваш: перед каждым повторным применением дезинфицируйте его 5 минут в растворе хлоргексидина и никому не передавайте. Сделано в Корее, DTS MG.'

export const PRODUCT_69_AR_DESCRIPTION =
  'لعينيكِ فقط. رولر GENOSYS لمحيط العين: جسم واحد متكامل و60 إبرة دقيقة من الفولاذ المقاوم للصدأ بطول 0.25 مم، وهو أقصر طول في مجموعة GENOSYS، مصمم لانحناءة ما تحت العين وعلى طول عظمة الحاجب. مرّريه بخفة فوق سيروم EyeCell Eye Contour Serum أفقياً ثم عمودياً لبضع دقائق دون ضغط. إنه لكِ وحدكِ: عقّميه 5 دقائق في محلول الكلورهيكسيدين قبل كل استخدام جديد، ولا تشاركيه مع أحد. صُنع في كوريا بواسطة DTS MG.'

export const PRODUCT_69_RU_TRANSLATION = {
  name: PRODUCT_69_RU_NAME,
  description: PRODUCT_69_RU_DESCRIPTION,
  productDetails: JSON.stringify({
    type: 'Роллер для контура глаз, цельный корпус',
    availableLengths: '0,25 мм',
    needleCount: '60',
    needleMaterial: 'Нержавеющая сталь',
    construction: 'Цельный: ручка и барабан вместе',
    application: 'По сыворотке: горизонтально, затем вертикально, без надавливания',
    treatmentAreas: 'Под глазами и вдоль надбровной дуги, в стороне от глаз и губ',
    safety: 'Личный и многоразовый: перед каждым повторным применением 5 минут в растворе хлоргексидина, никому не передавать',
    origin: 'Сделано в Корее · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    { title: 'Для контура глаз', description: 'Небольшой цельный роллер по форме контура под глазами и вдоль надбровной дуги.' },
    { title: '0,25 мм', description: 'Самая короткая длина игл в линейке GENOSYS.' },
    { title: '60 тонких игл', description: 'Нержавеющая сталь на барабане, достаточно маленьком для зоны вокруг глаз.' },
    { title: 'По сыворотке', description: 'Прокатывается по сыворотке EyeCell Eye Contour Serum горизонтально, затем вертикально, несколько минут.' },
    { title: 'Только ваш', description: 'Многоразовый и личный: перед каждым повторным применением дезинфицируйте его 5 минут в растворе хлоргексидина и никому не передавайте.' },
    { title: 'Сделано в Корее', description: 'DTS MG, производитель микроигольчатых роллеров GENOSYS.' },
  ]),
  benefits: JSON.stringify([
    'По форме контура глаз',
    '0,25 мм, самая короткая длина GENOSYS',
    '60 тонких игл из нержавеющей стали',
    'Прокатывается по сыворотке EyeCell',
    'Многоразовый и личный',
    'Сделано в Корее, DTS MG',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'Очищение', instruction: 'Очистите зону вокруг глаз и промокните насухо.' },
    { step: 'Сыворотка', instruction: 'Нанесите EyeCell Eye Contour Serum под глаза и вдоль надбровной дуги.' },
    { step: 'Роллер', instruction: 'Лёгкими движениями прокатывайте по сыворотке горизонтально, затем вертикально, несколько минут, в стороне от глаз и губ. Не надавливайте и остановитесь при дискомфорте.' },
    { step: 'Завершение', instruction: 'Затем Eye Peptide Gel Patch на 20-40 минут и Eye Contour Cream.' },
    { step: 'Уход', instruction: 'Перед каждым повторным применением дезинфицируйте роллер 5 минут в растворе хлоргексидина. Он только ваш: никому его не передавайте.' },
  ]),
  directions:
    'Не применять при склонности к келоидным рубцам, аллергии на нержавеющую сталь или дерматите. Не применять на повреждённой, инфицированной или раздражённой коже. Держите роллер в стороне от глаз и губ. Прекратите применение при покраснении, отёке или раздражении.',
}

export const PRODUCT_69_AR_TRANSLATION = {
  name: PRODUCT_69_AR_NAME,
  description: PRODUCT_69_AR_DESCRIPTION,
  productDetails: JSON.stringify({
    type: 'رولر لمحيط العين، جسم واحد متكامل',
    availableLengths: '0.25 مم',
    needleCount: '60',
    needleMaterial: 'فولاذ مقاوم للصدأ',
    construction: 'قطعة واحدة: المقبض والأسطوانة معاً',
    application: 'فوق السيروم: أفقياً ثم عمودياً، دون ضغط',
    treatmentAreas: 'تحت العينين وعلى طول عظمة الحاجب، بعيداً عن العين والشفتين',
    safety: 'شخصي وقابل لإعادة الاستخدام: 5 دقائق في محلول الكلورهيكسيدين قبل كل استخدام جديد، ولا يُشارك',
    origin: 'صُنع في كوريا · DTS MG Co., Ltd.',
  }),
  keyFeatures: JSON.stringify([
    { title: 'لمحيط العين', description: 'رولر صغير من قطعة واحدة، مصمم لانحناءة ما تحت العين وعلى طول عظمة الحاجب.' },
    { title: '0.25 مم', description: 'أقصر طول للإبر في مجموعة GENOSYS.' },
    { title: '60 إبرة دقيقة', description: 'من الفولاذ المقاوم للصدأ، على أسطوانة صغيرة بما يكفي لمنطقة العين.' },
    { title: 'فوق السيروم', description: 'يُمرَّر فوق سيروم EyeCell Eye Contour Serum أفقياً ثم عمودياً لبضع دقائق.' },
    { title: 'لكِ وحدكِ', description: 'قابل لإعادة الاستخدام وشخصي: عقّميه 5 دقائق في محلول الكلورهيكسيدين قبل كل استخدام جديد، ولا تشاركيه مع أحد.' },
    { title: 'صُنع في كوريا', description: 'بواسطة DTS MG، صانعة رولرات الوخز الدقيق GENOSYS.' },
  ]),
  benefits: JSON.stringify([
    'مصمم لمحيط العين',
    '0.25 مم، أقصر طول في GENOSYS',
    '60 إبرة دقيقة من الفولاذ المقاوم للصدأ',
    'يُمرَّر فوق سيروم EyeCell',
    'قابل لإعادة الاستخدام وشخصي',
    'صُنع في كوريا بواسطة DTS MG',
  ]),
  ingredients: null,
  howToUse: JSON.stringify([
    { step: 'التنظيف', instruction: 'نظفي منطقة العين وجففيها بالتربيت.' },
    { step: 'السيروم', instruction: 'ضعي EyeCell Eye Contour Serum تحت العينين وعلى طول عظمة الحاجب.' },
    { step: 'الرولر', instruction: 'مرّري الرولر بخفة فوق السيروم أفقياً ثم عمودياً لبضع دقائق، بعيداً عن العين والشفتين. لا تضغطي، وتوقفي إذا شعرتِ بعدم الارتياح.' },
    { step: 'الختام', instruction: 'ثم لصقات Eye Peptide Gel Patch لمدة 20 إلى 40 دقيقة، ثم Eye Contour Cream.' },
    { step: 'العناية', instruction: 'قبل كل استخدام جديد، عقّمي الرولر 5 دقائق في محلول الكلورهيكسيدين. إنه لكِ وحدكِ، فلا تشاركيه مع أحد.' },
  ]),
  directions:
    'لا يُستخدم مع الميل إلى الندبات الجدرية أو حساسية الفولاذ المقاوم للصدأ أو التهاب الجلد. لا يُستخدم على بشرة متضررة أو ملتهبة أو متهيجة. أبقيه بعيداً عن العين والشفتين. توقفي عن الاستخدام عند ظهور احمرار أو تورم أو تهيج.',
}
