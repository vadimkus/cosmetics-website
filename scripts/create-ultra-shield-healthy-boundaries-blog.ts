/**
 * Creates or updates the multilingual product 39 campaign article.
 *
 * Product source of truth:
 * - Formula + safety assessment: Intertek/UAE - GENOSYS ULTRA SHIELD SUN CREAM (RENEWED)/
 * - Audit: docs/SESSION_CHANGES_2026-08-17_PRODUCT_39_ULTRA_SHIELD_SOURCE_AUDIT.md
 * - Live page copy: components/product/ultrashield/ultraShieldCopy.ts
 *
 * Artwork: the 12-slide "Healthy Boundaries" campaign, already live as the
 * /products/39 gallery (public/images/ultra_campaign/s1–s12.jpg).
 * - Featured: s1 (hero). Body: s2–s12 in campaign order.
 * - Video: /videos/ultra.mp4 (application and texture, no water scenes).
 *
 * RU/AR timing wording matches the audited page copy ("минимум за 15 минут",
 * "قبل الخروج بـ15 دقيقة على الأقل"); EN keeps the page's 15–30 minutes.
 * No reef-safe, water-resistance or trace-botanical claims.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/create-ultra-shield-healthy-boundaries-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'ultra-shield-sun-cream-healthy-boundaries'
const IMG = '/images/ultra_campaign'
const VIDEO = '/videos/ultra.mp4'
const POSTER = '/images/ultra/main-v3.jpeg'
const SUMMER = 'uae-summer-skincare-survival-guide-2026'

const slide = (n: number, alt: string) =>
  `<img src="${IMG}/s${n}.jpg" alt="${alt}" width="1600" height="1600" class="w-full h-auto rounded-2xl my-5" loading="lazy" />`

const videoBlock = (label: string) => `
  <div>
    <h3 class="text-2xl font-bold">${label}</h3>
    <div class="mt-5 mx-auto max-w-sm">
      <div class="flex justify-center rounded-xl overflow-hidden shadow-lg bg-black">
        <video
          src="${VIDEO}"
          poster="${POSTER}"
          controls="controls"
          playsinline="playsinline"
          preload="auto"
          class="w-auto max-w-full max-h-[65vh]"
          width="720"
          height="1280"
        ></video>
      </div>
    </div>
  </div>`

const stats = (items: [string, string][]) => `
  <div class="grid gap-4 sm:grid-cols-3">
    ${items.map(([value, label]) => `<div class="rounded-2xl border border-[#702C8E]/15 bg-white p-5 text-center shadow-sm">
      <p class="text-4xl font-bold text-[#702C8E]">${value}</p>
      <p class="text-sm text-gray-600 mt-1">${label}</p>
    </div>`).join('\n    ')}
  </div>`

const filters = (rows: [string, string, string][]) => `
    <div class="mt-5 rounded-2xl bg-white p-5 shadow-sm">
      ${rows.map(([name, role, amount]) => `<div class="flex items-baseline justify-between gap-4 border-b border-violet-100 py-3 last:border-0">
        <div><p class="font-semibold text-gray-900">${name}</p><p class="text-sm text-gray-600">${role}</p></div>
        <p class="font-bold text-[#702C8E] whitespace-nowrap">${amount}</p>
      </div>`).join('\n      ')}
    </div>`

// `.cera-page :where(h1, h2, h3)` sets heading ink after the utilities load, so
// the title colour has to sit on an inner span rather than on the h3.
const cta = (title: string, line: string, href: string, button: string) => `
  <div class="rounded-2xl bg-[#702C8E] p-8 text-center text-white">
    <h3 class="text-2xl font-bold"><span class="text-white">${title}</span></h3>
    <p class="text-violet-100 mt-3 mb-6">${line}</p>
    <a href="${href}" class="inline-block rounded-full bg-[#FFC42E] px-8 py-3 font-semibold text-[#3A1150]">${button}</a>
  </div>`

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">The sun doesn't do boundaries. In the UAE the UV index sits at extreme for a good part of the year, and it reaches you on the school run, through the car window and on days that don't even feel hot. <a href="/products/39" class="text-primary-600 font-semibold hover:underline">ULTRA SHIELD SUN CREAM</a> is the boundary: SPF 50+ and PA++++, measured on skin, in a silky cream you will actually wear at 45 °C.</p>
    <p class="text-gray-700 mt-3">Here is the whole case in twelve slides, and exactly how to wear it.</p>
  </div>
${stats([
  ['65.9', 'Measured SPF, on skin'],
  ['24.3', 'UVA factor, where 22.0 is required'],
  ['17.1%', 'Of the tube is UV filter'],
])}

  <div>
    <h2 class="text-3xl font-bold">Tested at 65.9. Sold as 50+.</h2>
    ${slide(2, 'A white balloon floating under a violet ceiling: SPF 65.9, too good for the label')}
    <p class="text-gray-700">Measured on skin in the lab, the SPF came back at 65.9 ± 4.74. The box says 50+ because 50+ is the highest number a sunscreen label is allowed to print in Europe, however well it performs. The measured figure is 65.9; the label is telling the truth in the only way it is allowed to.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The ageing ray doesn't knock</h2>
    ${slide(3, 'Sunlight through a car window onto a forearm: UVA comes through glass')}
    <p class="text-gray-700">UVB is the one that burns. UVA is quieter: it reaches deeper, drives the lines and dark spots that show up years later, and passes straight through window glass, so the drive to work counts too. PA++++ is the highest UVA grade there is, and here it is backed by numbers: a UVA protection factor of 23.13 and 24.3 in two tests. European rules ask for at least a third of the SPF, which for 65.9 is 22.0. Both results clear it.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-violet-50 to-amber-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Six filters. One job.</h2>
    ${slide(4, 'Six glass discs dimming a beam of yellow light: 17.1%, six filters, one job')}
    <p class="text-gray-700">17.1% of the tube is UV filter, split across six so that between them they cover UVB and the full length of UVA. Five are organic, one is mineral.</p>
${filters([
  ['Homosalate', 'UVB, and it keeps the others in solution', '4.00%'],
  ['Ethylhexyl Salicylate', 'UVB, and a photostabiliser for the rest', '3.50%'],
  ['Terephthalylidene Dicamphor Sulfonic Acid', 'Short UVA, the reason this scores as it does', '3.07%'],
  ['Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine', 'Broad spectrum, UVB through long UVA', '3.00%'],
  ['Ethylhexyl Triazone', 'UVB, the most efficient filter per gram there is', '2.00%'],
  ['Titanium Dioxide', 'Mineral, reflects UVB and short UVA', '1.53%'],
])}
    <p class="text-gray-700 mt-5">If you look up the filters, you will find a question mark over homosalate. Europe settled on 7.34% as the safe maximum in a face cream and wrote it into law. This formula uses 4.00%, a little over half of that.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">No ghost on your face</h2>
    ${slide(5, 'A ghost sheet sitting in a violet director’s chair: the ghost didn’t get the part')}
    <p class="text-gray-700">Mineral filters are what leave the white cast. Here titanium dioxide, at 1.53% of the formula, is the only one; the rest of the filter system is organic and colourless. So it sits far closer to a Korean chemical sunscreen than a mineral one, with no white cast to speak of.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">45 °C outside. Silk on your skin.</h2>
    ${slide(6, 'A swirl of white sunscreen on violet satin: silk on your skin')}
    <p class="text-gray-700">A sunscreen only works if you put enough of it on, and nobody puts enough of a heavy one on. This one is smooth and silky, never heavy, and goes on as the last step of skincare before make-up. Watch how it spreads.</p>
  </div>
  ${videoBlock('The texture')}

  <div>
    <h2 class="text-3xl font-bold">Overqualified</h2>
    ${slide(7, 'Three violet award rosettes on yellow: overqualified, 2% niacinamide, 0.04% adenosine')}
    <p class="text-gray-700">Korea licenses this cream as a triple-function cosmetic: UV protection, brightening and wrinkle improvement. Each job has a working dose behind it: the six filters, niacinamide at a full 2%, and adenosine at 0.04%, the standard Korean functional dose for wrinkle improvement. Niacinamide is exactly the ingredient you want to be wearing on high-UV days.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Some filters didn't make the list</h2>
    ${slide(8, 'Brass stanchions and a yellow velvet rope before an empty violet floor: no oxybenzone, no octinoxate')}
    <p class="text-gray-700">No oxybenzone. No octinoxate. The two filters people most often screen out are not in the tube, and the full ingredient list is on the <a href="/products/39" class="text-primary-600 font-semibold hover:underline">product page</a>.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Two fingers. Not a dot.</h2>
    ${slide(9, 'A line of sunscreen along two fingers: two fingers, not a dot')}
    <p class="text-gray-700">This is where most sunscreens fail. A line of cream along your index and middle finger covers face and neck, and it is roughly the amount the SPF was tested at. Most people apply far less, and get far less protection. Fifty grams is a size you can afford to use at the right thickness.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">We're not clingy. The sun is.</h2>
    ${slide(10, 'An hourglass of yellow sand on violet: reapply every two hours')}
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. Last step of skincare:</strong> after your moisturiser and before anything with colour in it.</li>
      <li><strong>2. Two fingers:</strong> a line along your index and middle finger for face and neck.</li>
      <li><strong>3. 15 to 30 minutes before you go out:</strong> the film needs time to set.</li>
      <li><strong>4. Again every two hours in daylight:</strong> and straight after swimming, sweating or towelling.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">There is no water-resistance claim on this tube, so treat water as a reset and take it to the beach with you. It contains fragrance at 0.5%: if you are choosing a sunscreen for reactive skin specifically, that is the line in the ingredient list to weigh up.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">UV index 11+. We came prepared.</h2>
    ${slide(11, 'ULTRA SHIELD SUN CREAM on the crest of a UAE desert dune at midday')}
    <p class="text-gray-700">Beach, drive, midday. Gulf sun is its own sport: the UV index stays at extreme for a good part of the year, UVA comes in through glass, and the heat makes heavy creams impossible to wear. This grade and this texture are built for exactly that. For the rest of your summer routine, read the <a href="/blog/${SUMMER}" class="text-primary-600 font-semibold hover:underline">UAE Summer Skincare Survival Guide</a>.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Healthy boundaries.</h2>
    ${slide(12, 'ULTRA SHIELD SUN CREAM SPF 50+ PA++++, 50 g, dermatologically tested, made in Korea')}
  </div>
${cta(
  'Set your boundaries with the sun.',
  'ULTRA SHIELD SUN CREAM · SPF 50+ · PA++++ · 50 g · dermatologically tested · made in Korea',
  '/products/39',
  'View ULTRA SHIELD SUN CREAM',
)}
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Солнце не знает границ. В ОАЭ УФ-индекс держится на экстремальном уровне значительную часть года и достаёт вас по дороге в школу, через окно машины и в дни, которые даже не кажутся жаркими. <a href="/ru/products/39" class="text-primary-600 font-semibold hover:underline">ULTRA SHIELD SUN CREAM</a> ставит границу: SPF 50+ и PA++++, измеренные на коже, в шелковистой текстуре, которую реально носить и при 45 °C.</p>
    <p class="text-gray-700 mt-3">Вся история в двенадцати слайдах, и как носить его правильно.</p>
  </div>
${stats([
  ['65,9', 'Измеренный SPF, на коже'],
  ['24,3', 'Фактор UVA при требуемых 22,0'],
  ['17,1%', 'Тюбика составляют УФ-фильтры'],
])}

  <div>
    <h2 class="text-3xl font-bold">Измерен на 65,9. Продаётся как 50+.</h2>
    ${slide(2, 'Белый шар под фиолетовым потолком: SPF 65,9, выше этикетки')}
    <p class="text-gray-700">В лаборатории, на коже, SPF составил 65,9 ± 4,74. На коробке написано 50+, потому что 50+ — максимальная цифра, которую в Европе разрешено указывать на санскрине, как бы хорошо он ни работал. Измеренное значение — 65,9; этикетка говорит правду единственным доступным ей способом.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Луч старения не стучится</h2>
    ${slide(3, 'Солнечный луч через окно машины на руке: UVA проходит через стекло')}
    <p class="text-gray-700">UVB — тот, что обжигает. UVA действует тише: проникает глубже, отвечает за морщины и пигментные пятна, которые проявляются спустя годы, и проходит сквозь оконное стекло, поэтому дорога на работу тоже считается. PA++++ — высшая степень защиты от UVA, и здесь она подтверждена цифрами: фактор защиты UVA 23,13 и 24,3 в двух тестах. Европейские правила требуют не меньше трети SPF, то есть 22,0 для 65,9. Оба результата выше.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-violet-50 to-amber-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Шесть фильтров. Одна задача.</h2>
    ${slide(4, 'Шесть стеклянных дисков гасят жёлтый луч: 17,1%, шесть фильтров, одна задача')}
    <p class="text-gray-700">17,1% тюбика — УФ-фильтры, распределённые на шесть, чтобы вместе закрыть UVB и весь диапазон UVA. Пять органических, один минеральный.</p>
${filters([
  ['Homosalate', 'UVB, и держит остальные в растворе', '4,00%'],
  ['Ethylhexyl Salicylate', 'UVB и фотостабилизатор для остальных', '3,50%'],
  ['Terephthalylidene Dicamphor Sulfonic Acid', 'Короткий UVA, причина такого результата', '3,07%'],
  ['Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine', 'Широкий спектр, от UVB до длинного UVA', '3,00%'],
  ['Ethylhexyl Triazone', 'UVB, самый эффективный фильтр на грамм', '2,00%'],
  ['Titanium Dioxide', 'Минеральный, отражает UVB и короткий UVA', '1,53%'],
])}
    <p class="text-gray-700 mt-5">Если вы станете изучать фильтры, то встретите вопросы о гомосалате. Европа определила 7,34% как безопасный максимум для крема для лица и закрепила это в законе. В этой формуле 4,00%, чуть больше половины допустимого.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Никаких призраков на лице</h2>
    ${slide(5, 'Простыня-призрак в фиолетовом режиссёрском кресле: призрак не получил роль')}
    <p class="text-gray-700">Белёсый след оставляют минеральные фильтры. Здесь единственный такой — диоксид титана, 1,53% формулы; остальная система фильтров органическая и бесцветная. Поэтому крем гораздо ближе к корейскому химическому санскрину, чем к минеральному, и белёсости практически нет.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">+45 °C снаружи. Шёлк на коже.</h2>
    ${slide(6, 'Завиток белого крема на фиолетовом атласе: шёлк на коже')}
    <p class="text-gray-700">Санскрин работает, только если нанести его достаточно, а тяжёлого крема достаточно не наносит никто. Этот гладкий и шелковистый, никогда не тяжёлый, и ложится последним шагом ухода перед макияжем. Посмотрите, как он распределяется.</p>
  </div>
  ${videoBlock('Текстура')}

  <div>
    <h2 class="text-3xl font-bold">Сверхквалифицирован</h2>
    ${slide(7, 'Три фиолетовые наградные розетки на жёлтом: ниацинамид 2%, аденозин 0,04%')}
    <p class="text-gray-700">В Корее этот крем зарегистрирован как косметика тройного действия: защита от УФ, осветление и уменьшение морщин. За каждой функцией стоит рабочая дозировка: шесть фильтров, ниацинамид в полных 2% и аденозин 0,04%, стандартная корейская функциональная доза для ухода за морщинами. Ниацинамид — правильный ингредиент для дней с высоким УФ.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Некоторые фильтры не попали в список</h2>
    ${slide(8, 'Латунные стойки и жёлтый бархатный канат перед пустым фиолетовым полом: без оксибензона и октиноксата')}
    <p class="text-gray-700">Без оксибензона. Без октиноксата. Двух фильтров, которые люди чаще всего исключают, в тюбике нет, а полный состав есть на <a href="/ru/products/39" class="text-primary-600 font-semibold hover:underline">странице продукта</a>.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Два пальца. Не точка.</h2>
    ${slide(9, 'Полоска санскрина вдоль двух пальцев: два пальца, а не точка')}
    <p class="text-gray-700">Именно здесь большинство санскринов подводит. Наносите щедро: ориентир для лица и шеи — полоска крема вдоль указательного и среднего пальцев. Большинство наносит гораздо меньше и получает гораздо меньше защиты. Пятьдесят граммов — объём, который позволяет наносить нужным слоем.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Мы не липнем. Липнет солнце.</h2>
    ${slide(10, 'Песочные часы с жёлтым песком на фиолетовом: обновляйте защиту')}
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. Последний шаг ухода:</strong> после крема и до всего, в чём есть цвет.</li>
      <li><strong>2. Два пальца:</strong> полоска вдоль указательного и среднего пальцев для лица и шеи.</li>
      <li><strong>3. Минимум за 15 минут до выхода:</strong> защитному слою нужно время, чтобы осесть.</li>
      <li><strong>4. Не реже чем каждые два часа на улице:</strong> и сразу после плавания, пота или полотенца.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">Водостойкость не заявлена, поэтому после воды наносите заново и берите тюбик с собой на пляж. В составе есть отдушка, 0,5%: если вы выбираете санскрин именно для реактивной кожи, эту строку состава стоит взвесить.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">УФ-индекс 11+. Мы подготовились.</h2>
    ${slide(11, 'ULTRA SHIELD SUN CREAM на гребне дюны в пустыне ОАЭ в полдень')}
    <p class="text-gray-700">Пляж, дорога, полдень. Солнце Залива — отдельный вид спорта: УФ-индекс держится на экстремальном уровне значительную часть года, UVA проходит через стекло, а в жару тяжёлый крем носить невозможно. Эта степень защиты и эта текстура созданы именно для таких условий. Остальной летний уход — в нашем <a href="/ru/blog/${SUMMER}" class="text-primary-600 font-semibold hover:underline">гиде по летнему уходу в ОАЭ</a>.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Здоровые границы.</h2>
    ${slide(12, 'ULTRA SHIELD SUN CREAM SPF 50+ PA++++, 50 г, дерматологически протестирован, сделано в Корее')}
  </div>
${cta(
  'Установите границы с солнцем.',
  'ULTRA SHIELD SUN CREAM · SPF 50+ · PA++++ · 50 г · дерматологически протестирован · сделано в Корее',
  '/ru/products/39',
  'Смотреть ULTRA SHIELD SUN CREAM',
)}
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10" dir="rtl">
  <div>
    <p class="text-lg text-gray-700">الشمس لا تعرف الحدود. في الإمارات يبقى مؤشر الأشعة فوق البنفسجية عند المستوى الشديد جزءاً كبيراً من السنة، ويصلكِ في طريق المدرسة ومن خلال نافذة السيارة وفي أيام لا تبدو حارة أصلاً. <a href="/ar/products/39" class="text-primary-600 font-semibold hover:underline">ULTRA SHIELD SUN CREAM</a> هو الحد: SPF 50+ وPA++++ مقيسان على البشرة، بملمس حريري يمكنكِ استخدامه فعلاً في 45 °C.</p>
    <p class="text-gray-700 mt-3">القصة كاملة في اثنتي عشرة شريحة، وكيف تستخدمينه بالطريقة الصحيحة.</p>
  </div>
${stats([
  ['65.9', 'SPF المقيس على البشرة'],
  ['24.3', 'عامل UVA حيث المطلوب 22.0'],
  ['17.1%', 'من الأنبوب مرشحات UV'],
])}

  <div>
    <h2 class="text-3xl font-bold">اختُبر عند 65.9. يُباع كـ50+.</h2>
    ${slide(2, 'بالون أبيض تحت سقف بنفسجي: SPF 65.9 أعلى من الملصق')}
    <p class="text-gray-700">في المختبر، وعلى البشرة، جاءت نتيجة SPF عند 65.9 ± 4.74. تقول العلبة 50+ لأن 50+ هو أعلى رقم يُسمح لملصق واقي شمس بذكره في أوروبا، مهما كان الأداء. الرقم المقيس 65.9، والملصق يقول الحقيقة بالطريقة الوحيدة المسموح له بها.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">شعاع الشيخوخة لا يطرق الباب</h2>
    ${slide(3, 'شعاع شمس عبر نافذة سيارة على الذراع: أشعة UVA تعبر الزجاج')}
    <p class="text-gray-700">الأشعة UVB هي التي تحرق. أما UVA فأهدأ: تصل أعمق، وتقف وراء الخطوط والبقع الداكنة التي تظهر بعد سنوات، وتعبر زجاج النوافذ، لذلك يُحسب طريقكِ إلى العمل أيضاً. PA++++ هي أعلى درجة حماية من UVA، وهنا تدعمها الأرقام: عامل حماية من UVA بلغ 23.13 و24.3 في اختبارين. تشترط القواعد الأوروبية ثلث قيمة SPF على الأقل، أي 22.0 لقيمة 65.9، وقد تجاوزت النتيجتان هذه العتبة.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-violet-50 to-amber-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">ستة مرشحات. مهمة واحدة.</h2>
    ${slide(4, 'ستة أقراص زجاجية تخفف شعاعاً أصفر: 17.1%، ستة مرشحات، مهمة واحدة')}
    <p class="text-gray-700">17.1% من الأنبوب مرشحات UV موزعة على ستة، لتغطي معاً UVB والمدى الكامل لـUVA. خمسة عضوية وواحد معدني.</p>
${filters([
  ['Homosalate', 'UVB، ويُبقي البقية ذائبة', '4.00%'],
  ['Ethylhexyl Salicylate', 'UVB، ومثبّت ضوئي للبقية', '3.50%'],
  ['Terephthalylidene Dicamphor Sulfonic Acid', 'UVA القصير، وسبب هذه النتيجة', '3.07%'],
  ['Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine', 'طيف واسع، من UVB إلى UVA الطويل', '3.00%'],
  ['Ethylhexyl Triazone', 'UVB، أكفأ مرشّح لكل غرام على الإطلاق', '2.00%'],
  ['Titanium Dioxide', 'معدني، يعكس UVB وUVA القصير', '1.53%'],
])}
    <p class="text-gray-700 mt-5">إن بحثتِ عن المرشحات فستجدين علامة استفهام حول الهوموساليت. حددت أوروبا 7.34% حداً آمناً أقصى في كريم الوجه وكتبته في القانون. وتستخدم هذه التركيبة 4.00%، أي ما يزيد قليلاً على نصف الحد المسموح.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">لا أشباح على وجهكِ</h2>
    ${slide(5, 'شبح من قماش أبيض على كرسي مخرج بنفسجي: الشبح لم يحصل على الدور')}
    <p class="text-gray-700">المرشحات المعدنية هي التي تترك الأثر الأبيض. هنا ثاني أكسيد التيتانيوم بنسبة 1.53% من التركيبة هو المرشح المعدني الوحيد، وبقية منظومة المرشحات عضوية وعديمة اللون. لذلك هو أقرب بكثير إلى واقٍ كيميائي كوري منه إلى واقٍ معدني، ولا أثر أبيض يُذكر.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">45 °C في الخارج. حرير على بشرتكِ.</h2>
    ${slide(6, 'دوامة من كريم أبيض على ساتان بنفسجي: حرير على بشرتكِ')}
    <p class="text-gray-700">واقي الشمس لا يعمل إلا إذا وضعتِ منه كمية كافية، ولا أحد يضع كمية كافية من كريم ثقيل. هذا الكريم ناعم وحريري، غير ثقيل أبداً، ويأتي كآخر خطوة في العناية قبل المكياج. شاهدي كيف ينتشر.</p>
  </div>
  ${videoBlock('الملمس')}

  <div>
    <h2 class="text-3xl font-bold">مؤهل أكثر من اللازم</h2>
    ${slide(7, 'ثلاث شارات جوائز بنفسجية على الأصفر: نياسيناميد 2% وأدينوزين 0.04%')}
    <p class="text-gray-700">في كوريا يُرخَّص هذا الكريم كمستحضر تجميل ثلاثي الوظائف: الحماية من الأشعة فوق البنفسجية، والتفتيح، وتحسين التجاعيد. ووراء كل وظيفة جرعة فعالة: المرشحات الستة، والنياسيناميد بنسبة 2% كاملة، والأدينوزين بنسبة 0.04%، وهي الجرعة الوظيفية الكورية المعتمدة لتحسين التجاعيد. والنياسيناميد هو المكوّن المناسب تماماً لأيام الأشعة العالية.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">بعض المرشحات لم تدخل القائمة</h2>
    ${slide(8, 'حوامل نحاسية وحبل مخملي أصفر أمام أرضية بنفسجية فارغة: بلا أوكسيبنزون وبلا أوكتينوكسات')}
    <p class="text-gray-700">بلا أوكسيبنزون. بلا أوكتينوكسات. المرشحان اللذان يستبعدهما الناس أكثر من غيرهما ليسا في الأنبوب، وقائمة المكونات الكاملة موجودة في <a href="/ar/products/39" class="text-primary-600 font-semibold hover:underline">صفحة المنتج</a>.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">إصبعان. لا نقطة.</h2>
    ${slide(9, 'خط من واقي الشمس على طول إصبعين: إصبعان لا نقطة')}
    <p class="text-gray-700">هنا تفشل معظم واقيات الشمس. ضعيه بسخاء: المرجع للوجه والرقبة خط من الكريم على طول السبابة والوسطى. معظم الناس يضعون أقل من ذلك بكثير، فيحصلون على حماية أقل بكثير. وخمسون غراماً حجم يسمح لكِ باستخدامه بالسماكة الصحيحة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">نحن لا نلتصق. الشمس هي التي تلتصق.</h2>
    ${slide(10, 'ساعة رملية برمل أصفر على خلفية بنفسجية: جدّدي الحماية')}
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. آخر خطوة في العناية:</strong> بعد المرطب وقبل أي منتج ملوّن.</li>
      <li><strong>2. إصبعان:</strong> خط على طول السبابة والوسطى للوجه والرقبة.</li>
      <li><strong>3. قبل الخروج بـ15 دقيقة على الأقل:</strong> يحتاج الغشاء الواقي إلى وقت ليستقر.</li>
      <li><strong>4. كل ساعتين على الأقل في الخارج:</strong> وفوراً بعد السباحة أو التعرّق أو التجفيف بالمنشفة.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">هذا الأنبوب لا يدّعي مقاومة الماء، لذا اعتبري الماء إشارة لإعادة الوضع، وخذيه معكِ إلى الشاطئ. يحتوي على عطر بنسبة 0.5%: إن كنتِ تختارين واقياً لبشرة تفاعلية تحديداً، فهذا السطر الذي يستحق الموازنة في قائمة المكونات.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">مؤشر الأشعة 11+. جئنا مستعدين.</h2>
    ${slide(11, 'ULTRA SHIELD SUN CREAM على قمة كثيب في صحراء الإمارات وقت الظهيرة')}
    <p class="text-gray-700">الشاطئ، القيادة، الظهيرة. شمس الخليج رياضة مختلفة: يبقى مؤشر الأشعة فوق البنفسجية عند المستوى الشديد جزءاً كبيراً من السنة، وتعبر UVA الزجاج، وتجعل الحرارة الكريمات الثقيلة غير قابلة للاستخدام. هذه الدرجة وهذا الملمس صُمّما لهذه الظروف تحديداً. ولبقية روتينكِ الصيفي، اقرئي <a href="/ar/blog/${SUMMER}" class="text-primary-600 font-semibold hover:underline">دليل النجاة للعناية بالبشرة في صيف الإمارات</a>.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">حدود صحية.</h2>
    ${slide(12, 'ULTRA SHIELD SUN CREAM SPF 50+ PA++++، 50 غ، مختبر جلدياً، صُنع في كوريا')}
  </div>
${cta(
  'ضعي حدودكِ مع الشمس.',
  'ULTRA SHIELD SUN CREAM · SPF 50+ · PA++++ · 50 غ · مختبر جلدياً · صُنع في كوريا',
  '/ar/products/39',
  'عرض ULTRA SHIELD SUN CREAM',
)}
</div>`

async function main() {
  const data = {
    title: 'Healthy Boundaries: ULTRA SHIELD SUN CREAM, Tested at SPF 65.9',
    slug: SLUG,
    excerpt:
      'Measured on skin at SPF 65.9, with UVA cover above the European threshold, six filters and no white cast to speak of. The sunscreen built for Gulf sun, in twelve slides, and how to wear it properly.',
    content: contentEn,
    featuredImage: `${IMG}/s1.jpg`,
    titleRu: 'Здоровые границы: ULTRA SHIELD SUN CREAM с измеренным SPF 65,9',
    excerptRu:
      'SPF 65,9, измеренный на коже, защита от UVA выше европейского порога, шесть фильтров и практически без белёсости. Санскрин для солнца Залива в двенадцати слайдах, и как носить его правильно.',
    contentRu,
    titleAr: 'حدود صحية: ULTRA SHIELD SUN CREAM بـSPF مقيس 65.9',
    excerptAr:
      'SPF مقيس على البشرة عند 65.9، وحماية من UVA فوق العتبة الأوروبية، وستة مرشحات من دون أثر أبيض يُذكر. واقي الشمس المصمم لشمس الخليج في اثنتي عشرة شريحة، وكيف تستخدمينه بالطريقة الصحيحة.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'ultra-shield',
      'sunscreen',
      'spf-50',
      'uva',
      'uae-summer',
      'niacinamide',
      'korean-skincare',
      'sun-protection',
    ]),
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: SLUG } })
  if (existing) {
    const { publishedAt: _ignored, ...updateData } = data
    const updated = await prisma.blogPost.update({ where: { slug: SLUG }, data: updateData })
    console.log('Updated existing blog post:', updated.slug, updated.id)
  } else {
    const created = await prisma.blogPost.create({ data })
    console.log('Created blog post:', created.slug, created.id)
  }

  console.log('EN: https://genosys.ae/blog/' + SLUG)
  console.log('RU: https://genosys.ae/ru/blog/' + SLUG)
  console.log('AR: https://genosys.ae/ar/blog/' + SLUG)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
