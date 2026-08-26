/**
 * Creates or updates the multilingual product 61 feature article.
 *
 * Product source of truth:
 * - DTS MG deck: public/documents/PPT/GENOSYS HR3 MATRIX SCALP BRUSH.pdf
 * - Live page copy: components/product/scalpbrush/scalpBrushCopy.ts
 *
 * Artwork used (August 2026 set, already live on /products/61):
 * - Featured: /images/brush_o/Main2.jpeg
 * - Section art: s2 (scalp first), s1 (soft silicone), s7 (grip + tips)
 * - Video: /videos/brush.mp4
 *
 * Slides s3–s6 stay off this article. They still print absorption, a
 * Hair Tonic pairing, and a 2–3 minute duration that the deck does not
 * support. They remain in the product gallery only.
 *
 * Public context:
 * - AAD: apply shampoo to the scalp, not the lengths
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/create-hr3-scalp-brush-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'hr3-matrix-scalp-brush-where-shampoo-works'
const IMG = '/images/brush_o'
const VIDEO = '/videos/brush.mp4'
const MAIN = `${IMG}/Main2.jpeg`
const SHAMPOO = '/images/shampoo/Main.jpg'
const TONIC = '/images/hair_tonic/main-v2.jpeg'

const videoBlock = (label: string) => `
  <div>
    <h2 class="text-3xl font-bold">${label}</h2>
    <div class="mt-5 mx-auto max-w-sm">
      <div class="flex justify-center rounded-xl overflow-hidden shadow-lg bg-black">
        <video
          src="${VIDEO}"
          poster="${MAIN}"
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

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Most people wash their hair. Fewer people wash their scalp. The difference is where the shampoo actually lands. Fingertips move foam through the lengths. A brush works it down to the skin, which is the only place a scalp shampoo can do its job.</p>
    <p class="text-gray-700 mt-3"><strong>HR³ MATRIX SCALP BRUSH</strong> is built for the two minutes you already spend in the shower: soft silicone tips, a grip that stays in wet hands, and a richer lather with <a href="/products/44" class="text-primary-600 font-semibold hover:underline">HR³ MATRIX MEDI SCALP SHAMPOO α</a>.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Healthy hair starts with the scalp</h2>
    <img src="${IMG}/s2.jpeg" alt="Healthy hair starts with the scalp. GENOSYS HR³ MATRIX daily scalp care" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">The <a href="https://www.aad.org/public/everyday-care/hair-scalp-care/hair/healthy-hair-tips" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">American Academy of Dermatology</a> is plain about how to wash: apply shampoo to the scalp, not the entire length of the hair. That is how you cleanse built-up product, dead skin and excess oil without drying the strand.</p>
    <p class="text-gray-700 mt-3">That single instruction is the whole argument for this brush. Hair soaks up foam. Skin is where the foam is meant to work. Soft silicone cones reach the scalp the way fingertips rarely do, then massage without scratching.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-teal-50 to-slate-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Four things a brush does that fingertips do not</h2>
    <p class="text-gray-700 mt-3">Fingertips move product around the hair. A brush gets it to the skin. That one difference sits behind every effect below.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">A richer foam</p>
        <p class="text-gray-700 text-sm mt-1">Used with HR³ MATRIX MEDI SCALP SHAMPOO α it helps create a rich lather, so a small amount of shampoo covers the whole scalp instead of soaking into the hair.</p>
      </div>
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">Deeper cleansing</p>
        <p class="text-gray-700 text-sm mt-1">It helps wash away scalp oil, dead skin cells and the residue that styling products and dry shampoo leave behind, without irritation.</p>
      </div>
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">Better blood flow</p>
        <p class="text-gray-700 text-sm mt-1">Massaging while you wash helps increase blood flow to the scalp, which can help prevent hair thinning.</p>
      </div>
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">More volume</p>
        <p class="text-gray-700 text-sm mt-1">Hair that is genuinely clean at the root lifts rather than lies flat, so the deeper cleanse helps increase hair volume.</p>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Soft on scalp. Built for wet hands.</h2>
    <img src="${IMG}/s1.jpeg" alt="Soft silicone tips of the HR³ MATRIX Scalp Brush" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">A scalp brush lives in the one place where grip fails and hot water has already softened the skin. Both parts of this one are shaped around that.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="font-bold text-slate-900">Soft silicone head</p>
        <p class="text-gray-700 text-sm mt-1">Flexible cones for comfortable deep-cleansing and massage, without scratching.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="font-bold text-slate-900">Stable grip</p>
        <p class="text-gray-700 text-sm mt-1">The handle sits in the palm so you massage the scalp instead of chasing a brush around the shower floor.</p>
      </div>
    </div>
    <img src="${IMG}/s7.jpeg" alt="HR³ MATRIX Scalp Brush designed to move with the scalp" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
  </div>

  ${videoBlock('The head, up close')}
  <p class="text-gray-700">Soft silicone cones on a domed head, with the handle sitting in the middle. Watch how far the tips give when they meet a surface: that flex is why this cleans the scalp without scratching it.</p>

  <div>
    <h2 class="text-3xl font-bold">Four steps, inside your normal wash</h2>
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. Wet your hair:</strong> rinse thoroughly with lukewarm water. Hot water is not needed and is harder on the scalp.</li>
      <li><strong>2. Lather the shampoo:</strong> apply HR³ MATRIX MEDI SCALP SHAMPOO α and work it into a sufficient lather. The brush works with foam, not with neat shampoo.</li>
      <li><strong>3. Massage with the brush:</strong> move in small circles across the scalp, section by section. Let the weight of your hand do the work rather than pressing.</li>
      <li><strong>4. Rinse, then treat:</strong> rinse thoroughly. Leave-on steps such as <a href="/products/43" class="text-primary-600 font-semibold hover:underline">HR³ MATRIX HAIR TONIC α</a> go on afterwards, onto a clean scalp, applied with your fingertips.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">Press lightly. More pressure does not clean better, and the point of a soft silicone head is that it does not need any. Do not use it on a broken, irritated or recently treated scalp.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-slate-50 to-teal-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Where the brush sits in HR³ MATRIX</h2>
    <p class="text-gray-700 mt-3">The brush is a wash-time tool, so it belongs with the shampoo rather than with the leave-on treatments. Peel weekly if you use one, wash with the brush, then treat a clean scalp.</p>
    <div class="grid gap-5 sm:grid-cols-2 mt-6">
      <a href="/products/44" class="block rounded-2xl border border-teal-100 bg-white p-4">
        <img src="${SHAMPOO}" alt="HR³ MATRIX MEDI SCALP SHAMPOO α" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">Wash · MEDI SCALP SHAMPOO α</strong>
        <p class="text-sm text-gray-600 mt-1">The shampoo the brush is made to work with. Lather first, then massage.</p>
      </a>
      <a href="/blog/scalp-first-hair-care-hr3-matrix-hair-tonic-alpha" class="block rounded-2xl border border-teal-100 bg-white p-4">
        <img src="${TONIC}" alt="HR³ MATRIX HAIR TONIC α" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">After · HAIR TONIC α</strong>
        <p class="text-sm text-gray-600 mt-1">The leave-on tonic goes on a rinsed scalp, with fingertips, not with the brush.</p>
      </a>
    </div>
    <p class="text-gray-700 mt-5">Use <a href="/products/46" class="text-primary-600 font-semibold hover:underline">HR³ MATRIX SCALP PEELING α</a> as an occasional step, not an automatic daily one. The brush is not a microneedling tool and is not the peel.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">It lives in the shower. Treat it like it does.</h2>
    <ul class="space-y-2 text-gray-700">
      <li>Rinse it under warm water after every use.</li>
      <li>Let it air dry completely before putting it away.</li>
      <li>Store it somewhere dry, not sealed in a wet bag.</li>
      <li>Replace it if the silicone tears or loses its shape.</li>
    </ul>
    <p class="text-sm text-gray-600 mt-4">It is a personal item. Sharing a scalp brush is the same idea as sharing a razor. Works with any shampoo; the rich-foam effect is at its best with MEDI SCALP SHAMPOO α.</p>
  </div>

  <div class="rounded-2xl bg-slate-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">Your shampoo, working where it matters.</h3>
    <p class="text-slate-300 mt-3 mb-6">HR³ MATRIX SCALP BRUSH · 1 brush · soft silicone · use in the shower · made in Korea</p>
    <a href="/products/61" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-950">View HR³ MATRIX SCALP BRUSH</a>
  </div>
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
  <div>
    <p class="text-lg text-gray-700">Большинство людей моют волосы. Кожу головы — уже гораздо реже. Разница в том, куда попадает шампунь. Пальцы разносят пену по длине. Щётка доводит её до кожи — а именно там шампунь для кожи головы и должен работать.</p>
    <p class="text-gray-700 mt-3"><strong>HR³ MATRIX SCALP BRUSH</strong> — ручная щётка с мягкими силиконовыми зубцами и устойчивым центральным хватом. Она используется во время мытья после вспенивания шампуня; <a href="/ru/products/44" class="text-primary-600 font-semibold hover:underline">HR³ MATRIX MEDI SCALP SHAMPOO α</a> можно выбрать как часть этого порядка ухода, без отдельного заявления об эффективности.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Здоровые волосы начинаются с кожи головы</h2>
    <img src="${IMG}/s2.jpeg" alt="Здоровые волосы начинаются с кожи головы — ежедневный уход GENOSYS HR³ MATRIX" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700"><a href="https://www.aad.org/public/everyday-care/hair-scalp-care/hair/healthy-hair-tips" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">Американская академия дерматологии</a> рекомендует наносить шампунь прежде всего на кожу головы, а не растирать по всей длине.</p>
    <p class="text-gray-700 mt-3">Щётка остаётся внутри этого этапа. Мягкие силиконовые зубцы и центральная ручка помогают распределять вспененный шампунь с контролируемым нажимом, после чего всё тщательно смывается.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-teal-50 to-slate-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Четыре вещи, которые щётка делает, а пальцы — нет</h2>
    <p class="text-gray-700 mt-3">Пальцы распределяют средство по волосам. Щётка доводит его до кожи. Одно это различие стоит за каждым эффектом ниже.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">Мягкий силикон</p>
        <p class="text-gray-700 text-sm mt-1">Гибкие конусные зубцы обеспечивают мягкий контакт при лёгком нажиме.</p>
      </div>
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">Документированный способ</p>
        <p class="text-gray-700 text-sm mt-1">Намочите волосы, вспеньте шампунь, мягко используйте щётку и тщательно смойте.</p>
      </div>
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">Контролируемый нажим</p>
        <p class="text-gray-700 text-sm mt-1">Устойчивая центральная ручка помогает управлять движением и нажимом мокрой рукой.</p>
      </div>
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">Несмываемый уход отдельно</p>
        <p class="text-gray-700 text-sm mt-1">Тоники и растворы наносите после мытья кончиками пальцев, не щёткой.</p>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Мягкая к коже. Рассчитана на мокрые руки.</h2>
    <img src="${IMG}/s1.jpeg" alt="Мягкие силиконовые зубцы щётки HR³ MATRIX Scalp Brush" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">Щётка для кожи головы живёт в единственном месте, где всё выскальзывает из рук, а кожа уже размягчена горячей водой. Обе её части рассчитаны именно на это.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="font-bold text-slate-900">Мягкая силиконовая насадка</p>
        <p class="text-gray-700 text-sm mt-1">Гибкие зубцы для мягкого контакта при лёгком контролируемом нажиме.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="font-bold text-slate-900">Устойчивая ручка</p>
        <p class="text-gray-700 text-sm mt-1">Ручка лежит в ладони, поэтому вы массируете кожу головы, а не гоняетесь за щёткой по полу душевой.</p>
      </div>
    </div>
    <img src="${IMG}/s7.jpeg" alt="Щётка HR³ MATRIX Scalp Brush, которая движется вместе с кожей головы" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
  </div>

  ${videoBlock('Насадка вблизи')}
  <p class="text-gray-700">Мягкие силиконовые зубцы расположены вокруг куполообразной насадки, ручка находится по центру. Крупный план показывает гибкость кончиков и управляемую рукой конструкцию.</p>

  <div>
    <h2 class="text-3xl font-bold">Четыре шага внутри обычного мытья</h2>
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. Намочите волосы:</strong> тщательно смочите тёплой водой. Горячая вода не нужна и хуже переносится кожей головы.</li>
      <li><strong>2. Взбейте пену:</strong> нанесите HR³ MATRIX MEDI SCALP SHAMPOO α и взбейте достаточную пену. Щётка работает с пеной, а не с неразбавленным шампунем.</li>
      <li><strong>3. Массируйте щёткой:</strong> ведите круговыми движениями по коже головы, зона за зоной. Пусть работает вес руки, а не нажим.</li>
      <li><strong>4. Смойте, затем ухаживайте:</strong> тщательно смойте. Несмываемые средства, например <a href="/ru/products/43" class="text-primary-600 font-semibold hover:underline">HR³ MATRIX HAIR TONIC α</a>, наносятся после — на чистую кожу головы, кончиками пальцев.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">Нажимайте легко. Сильнее не значит чище, а смысл мягкой силиконовой насадки как раз в том, что нажим не нужен. Не используйте на повреждённой, раздражённой или недавно обработанной коже головы.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-slate-50 to-teal-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">Место щётки в линии HR³ MATRIX</h2>
    <p class="text-gray-700 mt-3">Щётка — инструмент для мытья, поэтому её место рядом с шампунем, а не с несмываемыми средствами. Пилинг раз в неделю, если вы им пользуетесь, затем мытьё со щёткой, затем уход по чистой коже головы.</p>
    <div class="grid gap-5 sm:grid-cols-2 mt-6">
      <a href="/ru/products/44" class="block rounded-2xl border border-teal-100 bg-white p-4">
        <img src="${SHAMPOO}" alt="HR³ MATRIX MEDI SCALP SHAMPOO α" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">Мытьё · MEDI SCALP SHAMPOO α</strong>
        <p class="text-sm text-gray-600 mt-1">Шампунь, с которым щётка и задумана работать. Сначала пена, затем массаж.</p>
      </a>
      <a href="/ru/blog/scalp-first-hair-care-hr3-matrix-hair-tonic-alpha" class="block rounded-2xl border border-teal-100 bg-white p-4">
        <img src="${TONIC}" alt="HR³ MATRIX HAIR TONIC α" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">После · HAIR TONIC α</strong>
        <p class="text-sm text-gray-600 mt-1">Несмываемый тоник наносят на промытую кожу головы кончиками пальцев, не щёткой.</p>
      </a>
    </div>
    <p class="text-gray-700 mt-5"><a href="/ru/products/46" class="text-primary-600 font-semibold hover:underline">HR³ MATRIX SCALP PEELING α</a> оставьте периодическим шагом, а не автоматическим ежедневным. Щётка — не инструмент для микронидлинга и не пилинг.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Она живёт в душе — с ней и надо обращаться соответственно</h2>
    <ul class="space-y-2 text-gray-700">
      <li>Промывайте тёплой водой после каждого использования.</li>
      <li>Дайте полностью высохнуть на воздухе перед хранением.</li>
      <li>Храните в сухом месте, а не в закрытом влажном мешке.</li>
      <li>Замените, если силикон порвался или потерял форму.</li>
    </ul>
    <p class="text-sm text-gray-600 mt-4">Лучше оставить щётку личным аксессуаром. MEDI SCALP SHAMPOO α — предложение внутри одного этапа мытья, а не обещание особого эффекта.</p>
  </div>

  <div class="rounded-2xl bg-slate-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">Ваш шампунь наконец работает там, где нужно.</h3>
    <p class="text-slate-300 mt-3 mb-6">HR³ MATRIX SCALP BRUSH · 1 щётка · мягкий силикон · использование с шампунем · контролируемый нажим</p>
    <a href="/ru/products/61" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-950">Смотреть HR³ MATRIX SCALP BRUSH</a>
  </div>
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10" dir="rtl">
  <div>
    <p class="text-lg text-gray-700">معظم الناس يغسلون الشعر. أما فروة الرأس فنادراً ما تصل إليها الغسلة. الفرق هو المكان الذي يصل إليه الشامبو فعلاً. أطراف الأصابع تحرّك الرغوة على الأطوال. أما الفرشاة فتوصّلها إلى الجلد، وهو المكان الوحيد الذي يُفترض أن يعمل فيه شامبو فروة الرأس.</p>
    <p class="text-gray-700 mt-3"><strong>HR³ MATRIX SCALP BRUSH</strong> فرشاة يدوية بأسنان من السيليكون الناعم ومقبض مركزي ثابت. تستخدم أثناء الغسل بعد تكوين رغوة الشامبو، ويمكن اختيار <a href="/ar/products/44" class="text-primary-600 font-semibold hover:underline">HR³ MATRIX MEDI SCALP SHAMPOO α</a> ضمن هذا الترتيب من دون ادعاء فعالية خاص.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">الشعر الصحي يبدأ من فروة الرأس</h2>
    <img src="${IMG}/s2.jpeg" alt="الشعر الصحي يبدأ من فروة الرأس: العناية اليومية GENOSYS HR³ MATRIX" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">تنصح <a href="https://www.aad.org/public/everyday-care/hair-scalp-care/hair/healthy-hair-tips" target="_blank" rel="noopener noreferrer" class="text-primary-600 underline">الأكاديمية الأمريكية للأمراض الجلدية</a> بوضع الشامبو أساساً على فروة الرأس بدلاً من فركه على كامل طول الشعر.</p>
    <p class="text-gray-700 mt-3">تبقى الفرشاة داخل هذه الخطوة. تساعد أسنان السيليكون الناعمة والمقبض المركزي على توزيع الشامبو بعد تكوين رغوته بضغط متحكم فيه، ثم يشطف جيداً.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-teal-50 to-slate-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">أربعة أمور تفعلها الفرشاة ولا تفعلها أطراف الأصابع</h2>
    <p class="text-gray-700 mt-3">أطراف الأصابع توزّع المنتج على الشعر. أما الفرشاة فتوصله إلى الجلد. هذا الفرق وحده يقف وراء كل نتيجة أدناه.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">سيليكون ناعم</p>
        <p class="text-gray-700 text-sm mt-1">توفر الأسنان المخروطية المرنة تلامساً لطيفاً عند إبقاء الضغط خفيفاً.</p>
      </div>
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">طريقة موثقة</p>
        <p class="text-gray-700 text-sm mt-1">يبلل الشعر وتكوّن رغوة الشامبو، ثم تستخدم الفرشاة بلطف ويشطف الشعر جيداً.</p>
      </div>
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">ضغط متحكم فيه</p>
        <p class="text-gray-700 text-sm mt-1">يساعد المقبض المركزي الثابت على التحكم في الحركة والضغط باليد المبللة.</p>
      </div>
      <div class="rounded-2xl border border-teal-100 bg-white p-5 shadow-sm">
        <p class="font-bold text-teal-900">العناية التي تترك على الفروة منفصلة</p>
        <p class="text-gray-700 text-sm mt-1">يوضع التونيك والمحاليل بعد الغسل بأطراف الأصابع، لا بالفرشاة.</p>
      </div>
    </div>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ناعمة على الفروة. مصمّمة لليد المبللة.</h2>
    <img src="${IMG}/s1.jpeg" alt="أسنان السيليكون الناعمة في فرشاة HR³ MATRIX Scalp Brush" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
    <p class="text-gray-700">فرشاة فروة الرأس تعيش في المكان الوحيد الذي تفلت فيه الأشياء من اليد ويكون الجلد قد لان بالماء الساخن. وجزءا هذه الفرشاة مصمّمان حول ذلك.</p>
    <div class="grid gap-4 sm:grid-cols-2 mt-5">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="font-bold text-slate-900">رأس من السيليكون الناعم</p>
        <p class="text-gray-700 text-sm mt-1">أسنان مرنة لتلامس لطيف عند استخدام ضغط خفيف ومتحكم فيه.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="font-bold text-slate-900">مقبض ثابت</p>
        <p class="text-gray-700 text-sm mt-1">المقبض يستقر في راحة اليد، فتدلّكين فروة الرأس بدل مطاردة فرشاة على أرض الحمّام.</p>
      </div>
    </div>
    <img src="${IMG}/s7.jpeg" alt="فرشاة HR³ MATRIX Scalp Brush مصمّمة لتتحرك مع فروة الرأس" class="w-full h-auto rounded-2xl my-5" loading="lazy" />
  </div>

  ${videoBlock('الرأس عن قرب')}
  <p class="text-gray-700">أسنان سيليكون ناعمة حول رأس مقبب، والمقبض في المنتصف. يوضح المشهد القريب مرونة الأطراف وتصميماً تتحكم فيه اليد.</p>

  <div>
    <h2 class="text-3xl font-bold">أربع خطوات، داخل غسلتك المعتادة</h2>
    <ol class="space-y-3 text-gray-700">
      <li><strong>1. بلّلي شعرك:</strong> اشطفي جيداً بماء فاتر. لا حاجة للماء الساخن، وهو أقسى على فروة الرأس.</li>
      <li><strong>2. كوّني رغوة الشامبو:</strong> ضعي HR³ MATRIX MEDI SCALP SHAMPOO α واعملي على تكوين رغوة كافية. الفرشاة تعمل مع الرغوة، لا مع الشامبو الخالص.</li>
      <li><strong>3. دلّكي بالفرشاة:</strong> حرّكيها بحركات دائرية صغيرة على فروة الرأس، منطقة تلو الأخرى. اتركي وزن يدك يقوم بالعمل بدل الضغط.</li>
      <li><strong>4. اشطفي، ثم عالجي:</strong> اشطفي جيداً. المنتجات التي لا تُشطف مثل <a href="/ar/products/43" class="text-primary-600 font-semibold hover:underline">HR³ MATRIX HAIR TONIC α</a> توضع بعد ذلك، على فروة رأس نظيفة، بأطراف الأصابع.</li>
    </ol>
    <p class="text-sm text-gray-600 mt-4">اضغطي بلطف. الضغط الأقوى لا ينظّف أفضل، وميزة رأس السيليكون الناعم أنه لا يحتاج إليه. لا تستخدميها على فروة رأس مجروحة أو متهيجة أو خضعت لعلاج حديثاً.</p>
  </div>

  <div class="rounded-3xl bg-gradient-to-br from-slate-50 to-teal-50 p-6 md:p-8">
    <h2 class="text-3xl font-bold">موقع الفرشاة في خط HR³ MATRIX</h2>
    <p class="text-gray-700 mt-3">الفرشاة أداة وقت الغسل، لذا مكانها مع الشامبو وليس مع المنتجات التي لا تُشطف. قشّري أسبوعياً إن كنتِ تستخدمين مقشراً، ثم اغسلي بالفرشاة، ثم عالجي فروة رأس نظيفة.</p>
    <div class="grid gap-5 sm:grid-cols-2 mt-6">
      <a href="/ar/products/44" class="block rounded-2xl border border-teal-100 bg-white p-4">
        <img src="${SHAMPOO}" alt="HR³ MATRIX MEDI SCALP SHAMPOO α" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">الغسل · MEDI SCALP SHAMPOO α</strong>
        <p class="text-sm text-gray-600 mt-1">الشامبو الذي صُنعت الفرشاة لتعمل معه. الرغوة أولاً، ثم التدليك.</p>
      </a>
      <a href="/ar/blog/scalp-first-hair-care-hr3-matrix-hair-tonic-alpha" class="block rounded-2xl border border-teal-100 bg-white p-4">
        <img src="${TONIC}" alt="HR³ MATRIX HAIR TONIC α" class="w-full h-auto rounded-xl" loading="lazy" />
        <strong class="mt-3 block">بعدها · HAIR TONIC α</strong>
        <p class="text-sm text-gray-600 mt-1">التونر الذي يُترك على الفروة يوضع على فروة مغسولة، بأطراف الأصابع، لا بالفرشاة.</p>
      </a>
    </div>
    <p class="text-gray-700 mt-5">استخدمي <a href="/ar/products/46" class="text-primary-600 font-semibold hover:underline">HR³ MATRIX SCALP PEELING α</a> كخطوة دورية لا يومية تلقائية. الفرشاة ليست أداة ميكرونيدلينغ وليست المقشّر.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">مكانها الحمّام، فتعاملي معها على هذا الأساس</h2>
    <ul class="space-y-2 text-gray-700">
      <li>اغسليها بماء دافئ بعد كل استخدام.</li>
      <li>اتركيها تجف تماماً في الهواء قبل تخزينها.</li>
      <li>احفظيها في مكان جاف، لا في كيس مغلق ورطب.</li>
      <li>استبدليها إذا تمزق السيليكون أو فقد شكله.</li>
    </ul>
    <p class="text-sm text-gray-600 mt-4">يفضل إبقاؤها أداة شخصية. MEDI SCALP SHAMPOO α اقتراح ضمن خطوة الغسل نفسها، وليس وعداً بتأثير خاص.</p>
  </div>

  <div class="rounded-2xl bg-slate-950 p-8 text-center text-white">
    <h3 class="text-2xl font-bold">شامبوكِ، يعمل حيث يجب أن يعمل.</h3>
    <p class="text-slate-300 mt-3 mb-6">HR³ MATRIX SCALP BRUSH · فرشاة واحدة · سيليكون ناعم · استخدام مع الشامبو · ضغط متحكم فيه</p>
    <a href="/ar/products/61" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-slate-950">عرض HR³ MATRIX SCALP BRUSH</a>
  </div>
</div>`

async function main() {
  const data = {
    title: 'Your Shampoo, Working Where It Matters: HR³ MATRIX SCALP BRUSH',
    slug: SLUG,
    excerpt:
      'A soft silicone brush for the two minutes you already spend washing your hair. It takes the lather to the scalp, lifts oil, dead skin and product buildup, and massages without scratching.',
    content: contentEn,
    featuredImage: MAIN,
    titleRu: 'Ваш шампунь наконец работает там, где нужно: HR³ MATRIX SCALP BRUSH',
    excerptRu:
      'Ручная щётка с мягкими силиконовыми зубцами и устойчивым центральным хватом. Используется на влажных волосах после вспенивания шампуня, с лёгким контролируемым нажимом.',
    contentRu,
    titleAr: 'شامبوكِ يعمل حيث يجب أن يعمل: HR³ MATRIX SCALP BRUSH',
    excerptAr:
      'فرشاة يدوية بأسنان من السيليكون الناعم ومقبض مركزي ثابت، تستخدم على شعر مبلل بعد تكوين رغوة الشامبو بضغط خفيف ومتحكم فيه.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'hr3-matrix',
      'scalp-brush',
      'scalp-care',
      'shampoo',
      'silicone-brush',
      'hair-care',
      'korean-hair-care',
      'medi-scalp-shampoo',
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
