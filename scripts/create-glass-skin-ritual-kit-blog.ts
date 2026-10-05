/**
 * Creates or updates the multilingual product 68 campaign article.
 *
 * Product source of truth: components/product/beautybox/copy/glassSkinRitual.ts
 * (every claim here is on that page, which traces each one to a member product:
 * serum 18, cream 29, Revita Glow 63). No price: the page shows it live.
 *
 * Artwork: the 12-slide "Full moon glow." campaign, live as the /products/68
 * gallery. EN uses public/images/glass_skin_campaign/, RU and AR their ru/ and ar/
 * folders. Featured: s1. Video: the 20 s campaign Reel,
 * /videos/glass-skin-reel-web.mp4 (same file as the /products/68 video).
 *
 * Classes live in this file, so push and deploy before running it (Tailwind
 * compiles only classes it has seen in the repo).
 *
 * Run:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/create-glass-skin-ritual-kit-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'glass-skin-ritual-kit-full-moon-glow'
const IMG = '/images/glass_skin_campaign'
const VIDEO = '/videos/glass-skin-reel-web.mp4'
const POSTER = '/images/glass_skin_campaign/reel-poster.jpg'

type Locale = 'en' | 'ru' | 'ar'

const prefix = (locale: Locale) => (locale === 'en' ? '' : `/${locale}`)

const slidePath = (locale: Locale, file: string) =>
  locale === 'en' ? `${IMG}/${file}.jpg` : `${IMG}/${locale}/${file}.jpg`

const slide = (locale: Locale, file: string, alt: string) =>
  `<img src="${slidePath(locale, file)}" alt="${alt}" width="1600" height="1600" class="w-full h-auto rounded-2xl my-5 shadow-lg shadow-[#0E1A3A]/20" loading="lazy" />`

const link = (href: string, text: string) =>
  `<a href="${href}" class="text-[#2B4A8B] font-semibold hover:underline">${text}</a>`

// `.cera-page :where(h1, h2, h3)` sets heading ink after the utilities load, so
// white headings sit on an inner span.
const moonHero = (kicker: string, title: string, line: string) => `
  <div class="rounded-3xl bg-gradient-to-br from-[#0B1430] via-[#13234F] to-[#2B4A8B] p-8 md:p-12 text-white shadow-xl">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[#E3C98F]">${kicker}</p>
    <h2 class="text-4xl md:text-6xl font-extrabold leading-none mt-4"><span class="text-white">${title}</span></h2>
    <p class="text-lg text-[#D7DEEF] mt-5 max-w-2xl">${line}</p>
  </div>`

const stats = (items: [string, string][]) => `
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
    ${items.map(([value, label]) => `<div class="rounded-2xl border border-[#13234F]/15 bg-[#F3F5FB] p-5 text-center">
      <p class="text-4xl font-extrabold text-[#13234F]">${value}</p>
      <p class="text-sm text-gray-600 mt-1">${label}</p>
    </div>`).join('\n    ')}
  </div>`

const steps = (items: [string, string, string, string][]) => `
  <div class="mt-5 grid gap-4 md:grid-cols-3">
    ${items.map(([tag, title, body, href]) => `<a href="${href}" class="block rounded-2xl border-t-4 border-[#C9A35C] bg-[#F3F5FB] p-5 hover:shadow-md">
      <p class="text-xs font-bold uppercase tracking-widest text-[#8A6A2E]">${tag}</p>
      <p class="font-bold text-[#0B1430] mt-2">${title}</p>
      <p class="text-sm text-gray-700 mt-2">${body}</p>
    </a>`).join('\n    ')}
  </div>`

const timeline = (items: [string, string, string][]) => `
  <div class="mt-5 grid gap-4 md:grid-cols-2">
    ${items.map(([time, title, body]) => `<div class="rounded-2xl bg-[#13234F] p-6 text-white">
      <p class="text-xs font-bold uppercase tracking-widest text-[#E3C98F]">${time}</p>
      <p class="font-bold mt-2"><span class="text-white">${title}</span></p>
      <p class="text-sm text-[#D7DEEF] mt-2">${body}</p>
    </div>`).join('\n    ')}
  </div>`

const shades = (items: [string, string, string][]) => `
  <div class="mt-5 grid gap-4 sm:grid-cols-2">
    ${items.map(([name, swatch, body]) => `<div class="rounded-2xl border border-[#13234F]/15 bg-white p-6">
      <div class="flex items-center gap-3">
        <span class="inline-block h-8 w-8 rounded-full border border-black/10" style="background:${swatch}"></span>
        <p class="text-xl font-bold text-[#0B1430]" dir="ltr">${name}</p>
      </div>
      <p class="text-sm text-gray-700 mt-3">${body}</p>
    </div>`).join('\n    ')}
  </div>`

const fit = (yesTitle: string, yes: string[], noTitle: string, no: string[]) => `
  <div class="mt-5 grid gap-4 md:grid-cols-2">
    <div class="rounded-2xl bg-[#F3F5FB] p-6">
      <p class="font-bold text-[#13234F]">${yesTitle}</p>
      <ul class="mt-3 space-y-2 text-gray-700">${yes.map((l) => `<li>✓ ${l}</li>`).join('')}</ul>
    </div>
    <div class="rounded-2xl bg-gray-50 p-6">
      <p class="font-bold text-gray-900">${noTitle}</p>
      <ul class="mt-3 space-y-2 text-gray-700">${no.map((l) => `<li>→ ${l}</li>`).join('')}</ul>
    </div>
  </div>`

const faq = (items: [string, string][]) => `
  <dl class="mt-5 divide-y divide-[#13234F]/10 rounded-2xl border border-[#13234F]/10 bg-white">
    ${items.map(([q, a]) => `<div class="p-5"><dt class="font-bold text-[#0B1430]">${q}</dt><dd class="text-gray-700 mt-2">${a}</dd></div>`).join('\n    ')}
  </dl>`

const videoBlock = (label: string) => `
  <div>
    <h3 class="text-2xl font-bold">${label}</h3>
    <div class="mt-5 mx-auto max-w-sm">
      <div class="flex justify-center rounded-3xl overflow-hidden shadow-xl shadow-[#0E1A3A]/30 bg-black">
        <video
          src="${VIDEO}"
          poster="${POSTER}"
          controls="controls"
          playsinline="playsinline"
          preload="auto"
          class="w-auto max-w-full max-h-[65vh]"
          width="720"
          height="1280"
          style="aspect-ratio: 9 / 16"
        ></video>
      </div>
    </div>
  </div>`

const cta = (title: string, line: string, href: string, button: string) => `
  <div class="rounded-3xl bg-gradient-to-br from-[#0B1430] to-[#13234F] p-8 text-center text-white">
    <h3 class="text-3xl font-extrabold"><span class="text-white">${title}</span></h3>
    <p class="text-[#D7DEEF] mt-3 mb-6">${line}</p>
    <a href="${href}" class="inline-block rounded-full bg-[#E3C98F] px-8 py-3 font-semibold text-[#0B1430]">${button}</a>
  </div>`

const BRIGHT = '#F1DCC4'
const NATURAL = '#D9B48F'

// ─── English ───────────────────────────────────────────────────────────────
const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
${moonHero('GENOSYS Holiday Edition 2026', 'FULL MOON<br />GLOW.', 'Three steps to the Korean glass-skin look, in a holiday box with the Korean moon jar on the lid. Water in, water held, glow on top.')}

  <div>
    <p class="text-lg text-gray-700">Glass skin is not shine. It is water, held where it belongs, under an even, luminous finish. The ${link('/products/68', 'GLASS SKIN RITUAL KIT')} builds it in three steps: a coconut-water hyaluron serum fills skin with water, a hyaluron cream holds it there, and Revita Glow BB cream finishes with SPF 38 and a soft tint, tapped in with its own puff.</p>
    <p class="text-gray-700 mt-3">Here is the whole campaign in twelve slides, and exactly how the ritual works.</p>
  </div>
${stats([
  ['+82%', 'Hydration straight after one use of the cream'],
  ['72h', 'And the hydration was still holding'],
  ['SPF 38', 'PA+++ in the BB cream'],
  ['5', 'Pieces: serum, cream, BB cream, puff, mirror case'],
])}

  <div>
    <h2 class="text-3xl font-bold">It doesn't shine. It glows.</h2>
    ${slide('en', 's2', 'A Korean moon jar on a plinth in soft window light: it does not shine, it glows')}
    <p class="text-gray-700">The Korean moon jar has no gloss. Its white porcelain catches soft light and gives it back from within, and that is exactly the look this kit is made for: skin that looks lit from inside, not oily on top.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Three steps, in order.</h2>
${steps([
  ['Step 1 · Fill', 'Moisture Replenishing Hyaluron Serum 30ml', 'A coconut-water serum with 2,000 ppm of hydrolyzed hyaluronic acid, the light form that sinks in. Pat it in, morning and evening.', '/products/18'],
  ['Step 2 · Seal', 'Moisture Replenishing Hyaluron Cream 50g', 'High-weight hyaluronic acid at 1,000 ppm and 9% glycerin hold the water in. Massage it in over the serum.', '/products/29'],
  ['Step 3 · Glow', 'Revita Glow BB Cream 50g', 'A light, luminous tint with SPF 38 PA+++, 2% niacinamide and adenosine. Blend, then tap it in with the puff.', '/products/63'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Fill.</h2>
    ${slide('en', 's3', 'The hyaluron serum dropper over rippling dark water: fill')}
    <p class="text-gray-700">The serum is where the water goes in. Hydrolyzed hyaluronic acid at 2,000 ppm is the light, low-weight form that sinks into the skin, with PENTAVITIN alongside. Smooth it over clean skin and pat it in with your fingertips.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Seal.</h2>
    ${slide('en', 's4', 'The hyaluron cream tube on white with a dab of cream: seal')}
    <p class="text-gray-700">The cream keeps the water from leaving. Its high-weight hyaluronic acid stays on the surface, and 9% glycerin works behind it. Serum fills, cream seals, and neither is a weaker copy of the other.</p>
  </div>

  <div class="rounded-3xl bg-[#F3F5FB] p-6 md:p-8">
    <h2 class="text-3xl font-bold">+82% after one use.</h2>
    ${slide('en', 's5', 'The phases of the moon over deep navy: plus 82% hydration after one use')}
    <p class="text-gray-700">This one is measured, not promised. The hyaluron cream lifted skin hydration 82% straight after a single application, and hydration was still well above where it started 72 hours later.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Glow.</h2>
    ${slide('en', 's6', 'Revita Glow BB cream with its puff: glow')}
    <p class="text-gray-700">Revita Glow is the finish and the morning sun step in one: a light, luminous tint with SPF 38 PA+++ from four filters, plus niacinamide 2% and adenosine 0.04%. Korea registers it for UV protection, brightening and wrinkle care at once. Dot it on, blend, then tap it in with the puff.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Two moons. Pick yours.</h2>
    ${slide('en', 's7', 'Two Revita Glow tubes under a white moon and a golden moon: #01 Bright and #02 Natural')}
${shades([
  ['#01 Bright', BRIGHT, 'Lighter and more luminous, for fair to light-medium skin.'],
  ['#02 Natural', NATURAL, 'Warmer and a touch deeper, for light-medium to medium skin, with a softer glow.'],
])}
    <p class="text-gray-700 mt-4">Both carry the same SPF 38 PA+++, niacinamide and adenosine. Only the pigment changes, so you choose the shade when you add the kit to your bag.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">The last touch.</h2>
    ${slide('en', 's8', 'The holiday puff case open on silk, its mirror reflecting the moon: the last touch')}
    <p class="text-gray-700">A holiday puff case with a mirror, and the puff made for Revita Glow. Wash the puff regularly and let it dry in the open case.</p>
  </div>
  ${videoBlock('Full moon glow. In 20 seconds')}

  <div>
    <h2 class="text-3xl font-bold">Every morning.</h2>
    ${slide('en', 's10', 'An AM/PM card on linen: serum, cream, BB cream every morning')}
${timeline([
  ['Morning', 'Serum, cream, then BB cream', 'Pat in the serum, seal with the cream, and finish with Revita Glow as your last step and your sun protection. Out all day? Reapply.'],
  ['Evening', 'Cleanse, serum, cream', 'Wash the BB cream away, then serum and cream only. Skin gets the night to drink.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">A moon jar for the new year.</h2>
    ${slide('en', 's9', 'A Korean moon jar beside the GENOSYS holiday box')}
    <p class="text-gray-700">The Korean moon jar, dalhangari, is one of Korea's best-loved porcelain pieces, named for its likeness to the full moon. It stands for abundance, purity and good fortune, which is why it welcomes a new season and a new year. This year, it is on the box.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">A gift that glows.</h2>
    ${slide('en', 's11', 'The holiday box on gold silk, ready to give')}
    <p class="text-gray-700">It arrives in the GENOSYS holiday box, ready to give, with the puff and the mirror case inside. Pick the shade closest to the person you are buying for. Three full sizes, for less than the three bought separately.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Is it for you?</h2>
${fit(
  'A good match if',
  ['Your skin feels tight or looks flat by the afternoon', 'You want a light base with sun protection instead of foundation', 'You are new to Korean skincare and want three steps, not ten', 'You want a gift that gets used every single morning'],
  'Look elsewhere if',
  [`Dark spots are the main target: the ${link('/products/56', 'Skin Brightening Beauty Box')}`, `Breakouts come first: the ${link('/products/55', 'Problem Skin Care Beauty Box')}`, `You want full coverage: the ${link('/products/41', 'Blemish Balm Cushion')}`, 'Fragrance is a problem for you: all three carry a light scent'],
)}
    <p class="text-sm text-gray-600 mt-4">Serum, cream and BB cream are all dermatologically tested. If your skin is reactive, try each on a small area first.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Good to know.</h2>
${faq([
  ['Is the BB cream enough sun protection?', 'It carries SPF 38 PA+++, so on a normal day it is your morning sun step. For long hours outdoors, reapply through the day or add a dedicated sun cream.'],
  ['Do I need all three?', 'Serum and cream each work alone, but together they do what neither can: the serum fills skin with water and the cream holds it there. The BB cream is the finish, so skip it in the evening, never in the morning.'],
  ['Which shade should I choose?', '#01 Bright for fair to light-medium skin, #02 Natural for light-medium to medium skin. Same SPF, same care, different pigment.'],
  ['Can I buy the products separately?', 'Yes: the serum, the cream and Revita Glow each have their own page. The kit is the same three full sizes at a lower total, with the puff, the mirror case and the gift box on top.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Glow into the holidays.</h2>
    ${slide('en', 's12', 'GLASS SKIN RITUAL KIT: the holiday box open with serum, cream, BB cream and puff case')}
  </div>
${cta(
  'Full moon glow.',
  'GLASS SKIN RITUAL KIT · Serum 30ml · Cream 50g · Revita Glow BB 50g · puff and mirror case · #01 Bright or #02 Natural · Made in Korea',
  '/products/68',
  'Shop the kit',
)}
</div>`

// ─── Russian ───────────────────────────────────────────────────────────────
const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
${moonHero('Праздничный выпуск GENOSYS 2026', 'СИЯНИЕ<br />ПОЛНОЙ ЛУНЫ.', 'Три шага к корейскому эффекту стеклянной кожи в праздничной коробке с корейской лунной вазой на крышке. Вода внутрь, вода удержана, сияние сверху.')}

  <div>
    <p class="text-lg text-gray-700">Стеклянная кожа это не блеск. Это вода, удержанная там, где ей место, под ровным сияющим покрытием. ${link('/ru/products/68', 'GLASS SKIN RITUAL KIT')} создаёт её за три шага: гиалуроновая сыворотка на кокосовой воде наполняет кожу водой, гиалуроновый крем удерживает её, а BB-крем Revita Glow завершает уход с SPF 38 и мягким тоном, который вбивается собственным пуфом.</p>
    <p class="text-gray-700 mt-3">Вся кампания в двенадцати слайдах и то, как работает ритуал.</p>
  </div>
${stats([
  ['+82%', 'увлажнения сразу после одного нанесения крема'],
  ['72 ч', 'и увлажнение всё ещё держалось'],
  ['SPF 38', 'PA+++ в BB-креме'],
  ['5', 'предметов: сыворотка, крем, BB-крем, пуф, футляр с зеркалом'],
])}

  <div>
    <h2 class="text-3xl font-bold">Не блестит. Сияет.</h2>
    ${slide('ru', 's2', 'Корейская лунная ваза в мягком свете окна: не блестит, а сияет')}
    <p class="text-gray-700">У корейской лунной вазы нет глянца. Её белый фарфор ловит мягкий свет и отдаёт его изнутри, и именно этот образ создаёт набор: кожа, которая светится изнутри, а не блестит сверху.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Три шага по порядку.</h2>
${steps([
  ['Шаг 1 · Наполнить', 'Сыворотка Moisture Replenishing Hyaluron 30 мл', 'Сыворотка на кокосовой воде с 2 000 ppm гидролизованной гиалуроновой кислоты, лёгкой формы, которая проникает внутрь. Вбивайте утром и вечером.', '/ru/products/18'],
  ['Шаг 2 · Запечатать', 'Крем Moisture Replenishing Hyaluron 50 г', 'Высокомолекулярная гиалуроновая кислота 1 000 ppm и глицерин 9% удерживают воду. Вмассируйте поверх сыворотки.', '/ru/products/29'],
  ['Шаг 3 · Сияние', 'BB-крем Revita Glow 50 г', 'Лёгкий сияющий тон с SPF 38 PA+++, ниацинамидом 2% и аденозином. Распределите и вбейте пуфом.', '/ru/products/63'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Наполнить.</h2>
    ${slide('ru', 's3', 'Пипетка гиалуроновой сыворотки над тёмной водой: наполнить')}
    <p class="text-gray-700">Через сыворотку вода попадает внутрь. Гидролизованная гиалуроновая кислота 2 000 ppm это лёгкая низкомолекулярная форма, которая проникает в кожу, а рядом с ней PENTAVITIN. Распределите по чистой коже и вбейте кончиками пальцев.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Запечатать.</h2>
    ${slide('ru', 's4', 'Туба гиалуронового крема на белом: запечатать')}
    <p class="text-gray-700">Крем не даёт воде уходить. Высокомолекулярная гиалуроновая кислота остаётся на поверхности, а за ней работает глицерин 9%. Сыворотка наполняет, крем запечатывает, и ни один не слабая копия другого.</p>
  </div>

  <div class="rounded-3xl bg-[#F3F5FB] p-6 md:p-8">
    <h2 class="text-3xl font-bold">+82% после одного нанесения.</h2>
    ${slide('ru', 's5', 'Фазы луны на тёмно-синем фоне: плюс 82% увлажнения после одного нанесения')}
    <p class="text-gray-700">Это измерено, а не обещано. Гиалуроновый крем поднял увлажнённость кожи на 82% сразу после одного нанесения, и через 72 часа увлажнение оставалось заметно выше исходного.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Сияние.</h2>
    ${slide('ru', 's6', 'BB-крем Revita Glow с пуфом: сияние')}
    <p class="text-gray-700">Revita Glow это и финиш, и утренняя защита от солнца: лёгкий сияющий тон с SPF 38 PA+++ от четырёх фильтров, ниацинамид 2% и аденозин 0,04%. В Корее он зарегистрирован сразу для защиты от УФ, осветления и ухода за морщинами. Нанесите точками, распределите и вбейте пуфом.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Две луны. Выберите свою.</h2>
    ${slide('ru', 's7', 'Две тубы Revita Glow под белой и золотой луной: #01 Bright и #02 Natural')}
${shades([
  ['#01 Bright', BRIGHT, 'Светлее и сияющее, для светлой и светло-средней кожи.'],
  ['#02 Natural', NATURAL, 'Теплее и чуть глубже, для светло-средней и средней кожи, с более мягким сиянием.'],
])}
    <p class="text-gray-700 mt-4">В обоих одинаковые SPF 38 PA+++, ниацинамид и аденозин. Отличается только пигмент, оттенок выбирается при добавлении набора в корзину.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Последний штрих.</h2>
    ${slide('ru', 's8', 'Праздничный футляр для пуфа с зеркалом на шёлке: последний штрих')}
    <p class="text-gray-700">Праздничный футляр с зеркалом и пуф, созданный для Revita Glow. Регулярно мойте пуф и давайте ему высохнуть в открытом футляре.</p>
  </div>
  ${videoBlock('Сияние полной луны. За 20 секунд')}

  <div>
    <h2 class="text-3xl font-bold">Каждое утро.</h2>
    ${slide('ru', 's10', 'Карточка утро/вечер на льне: сыворотка, крем, BB-крем каждое утро')}
${timeline([
  ['Утро', 'Сыворотка, крем, затем BB-крем', 'Вбейте сыворотку, запечатайте кремом и завершите Revita Glow как последним шагом и защитой от солнца. Весь день на улице? Обновляйте.'],
  ['Вечер', 'Очищение, сыворотка, крем', 'Смойте BB-крем, затем только сыворотка и крем. Ночь коже, чтобы напиться.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Лунная ваза к новому году.</h2>
    ${slide('ru', 's9', 'Корейская лунная ваза рядом с праздничной коробкой GENOSYS')}
    <p class="text-gray-700">Корейская лунная ваза, тальхангари, одна из самых любимых вещей корейского фарфора, названа за сходство с полной луной. Она символизирует изобилие, чистоту и удачу, поэтому с ней встречают новый сезон и новый год. В этом году она на коробке.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Подарок, который сияет.</h2>
    ${slide('ru', 's11', 'Праздничная коробка на золотом шёлке, готова к подарку')}
    <p class="text-gray-700">Набор приходит в праздничной коробке GENOSYS, готовой к подарку, с пуфом и футляром с зеркалом внутри. Выберите оттенок, ближайший к тому, кому дарите. Три полноразмерных средства дешевле, чем по отдельности.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Подходит ли он вам?</h2>
${fit(
  'Подойдёт, если',
  ['К середине дня кожа стягивается или выглядит тусклой', 'Нужна лёгкая основа с защитой от солнца вместо тонального крема', 'Вы только знакомитесь с корейским уходом и хотите три шага, а не десять', 'Ищете подарок, которым будут пользоваться каждое утро'],
  'Выберите другое, если',
  [`Главная задача пигментные пятна: ${link('/ru/products/56', 'Skin Brightening Beauty Box')}`, `В приоритете высыпания: ${link('/ru/products/55', 'Problem Skin Care Beauty Box')}`, `Нужно плотное покрытие: ${link('/ru/products/41', 'кушон Blemish Balm')}`, 'Отдушки для вас проблема: все три средства слегка ароматизированы'],
)}
    <p class="text-sm text-gray-600 mt-4">Сыворотка, крем и BB-крем дерматологически протестированы. Если кожа реактивная, сначала попробуйте каждое средство на небольшом участке.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Полезно знать.</h2>
${faq([
  ['Хватит ли BB-крема для защиты от солнца?', 'В нём SPF 38 PA+++, поэтому в обычный день это ваш утренний шаг защиты. Если долго находитесь на улице, обновляйте его в течение дня или добавьте отдельный солнцезащитный крем.'],
  ['Нужны ли все три средства?', 'Сыворотка и крем работают и по отдельности, но вместе дают то, чего не даёт ни одно: сыворотка наполняет кожу водой, крем её удерживает. BB-крем это финиш, поэтому пропускайте его вечером, но не утром.'],
  ['Какой оттенок выбрать?', '#01 Bright для светлой и светло-средней кожи, #02 Natural для светло-средней и средней. Тот же SPF, тот же уход, другой пигмент.'],
  ['Можно ли купить средства по отдельности?', 'Да: у сыворотки, крема и Revita Glow есть свои страницы. Набор это те же три полноразмерных средства дешевле в сумме, плюс пуф, футляр с зеркалом и подарочная коробка.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Сияйте в праздники.</h2>
    ${slide('ru', 's12', 'GLASS SKIN RITUAL KIT: открытая праздничная коробка с сывороткой, кремом, BB-кремом и футляром')}
  </div>
${cta(
  'Сияние полной луны.',
  'GLASS SKIN RITUAL KIT · Сыворотка 30 мл · Крем 50 г · BB-крем Revita Glow 50 г · пуф и футляр с зеркалом · #01 Bright или #02 Natural · Сделано в Корее',
  '/ru/products/68',
  'Купить набор',
)}
</div>`

// ─── Arabic ────────────────────────────────────────────────────────────────
// SPF 38 PA+++ and +82% sit inside U+2066/U+2069 where they touch Arabic text,
// as on the product page, so the right-to-left paragraph keeps them in place.
const L = (s: string) => `\u2066${s}\u2069`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10">
${moonHero('إصدار أعياد GENOSYS لعام 2026', 'توهّج<br />البدر.', 'ثلاث خطوات إلى إطلالة البشرة الزجاجية الكورية، في علبة أعياد عليها جرّة القمر الكورية. ماء يدخل، ماء يُحبس، وتوهّج فوقه.')}

  <div>
    <p class="text-lg text-gray-700">البشرة الزجاجية ليست لمعاناً. إنها ماء محبوس في مكانه، تحت لمسة متجانسة مشرقة. وتبنيها مجموعة ${link('/ar/products/68', 'GLASS SKIN RITUAL KIT')} في ثلاث خطوات: سيروم الهيالورون بماء جوز الهند يملأ البشرة بالماء، وكريم الهيالورون يحبسه فيها، ثم يختم كريم Revita Glow BB بحماية ${L('SPF 38')} ولمسة لون ناعمة تُربَّت بإسفنجته الخاصة.</p>
    <p class="text-gray-700 mt-3">إليكِ الحملة كاملة في اثنتي عشرة شريحة، وطريقة عمل الروتين بالتفصيل.</p>
  </div>
${stats([
  [L('+82%'), 'ترطيب مباشرة بعد استخدام واحد للكريم'],
  ['72 ساعة', 'وبقي الترطيب ثابتاً'],
  [L('SPF 38'), 'مع PA+++ في كريم BB'],
  ['5', 'قطع: سيروم وكريم وكريم BB وإسفنجة وعلبة بمرآة'],
])}

  <div>
    <h2 class="text-3xl font-bold">لا تلمع. بل تتوهّج.</h2>
    ${slide('ar', 's2', 'جرّة القمر الكورية في ضوء نافذة ناعم: لا تلمع بل تتوهّج')}
    <p class="text-gray-700">جرّة القمر الكورية بلا لمعان. خزفها الأبيض يلتقط الضوء الناعم ويعيده من الداخل، وهذه بالضبط الإطلالة التي صُنعت لها المجموعة: بشرة تبدو مضيئة من الداخل، لا دهنية من الخارج.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ثلاث خطوات بالترتيب.</h2>
${steps([
  ['الخطوة 1 · الملء', 'سيروم Moisture Replenishing Hyaluron بحجم 30 مل', 'سيروم بماء جوز الهند مع 2,000 جزء في المليون من حمض الهيالورونيك المحلل، الشكل الخفيف الذي يتغلغل. ربّتيه صباحاً ومساءً.', '/ar/products/18'],
  ['الخطوة 2 · الحبس', 'كريم Moisture Replenishing Hyaluron بوزن 50 غ', 'هيالورونيك عالي الوزن بتركيز 1,000 جزء في المليون مع غليسرين 9% يحبسان الماء. دلّكيه فوق السيروم.', '/ar/products/29'],
  ['الخطوة 3 · التوهّج', 'كريم Revita Glow BB بوزن 50 غ', `لون خفيف مشرق بحماية ${L('SPF 38 PA+++')} ونياسيناميد 2% وأدينوزين. وزّعيه ثم ربّتيه بالإسفنجة.`, '/ar/products/63'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">الملء.</h2>
    ${slide('ar', 's3', 'قطّارة سيروم الهيالورون فوق ماء داكن متموّج: الملء')}
    <p class="text-gray-700">السيروم هو حيث يدخل الماء. حمض الهيالورونيك المحلل بتركيز 2,000 جزء في المليون هو الشكل الخفيف منخفض الوزن الذي يتغلغل في البشرة، ومعه PENTAVITIN. وزّعيه على بشرة نظيفة وربّتي عليه بأطراف أصابعكِ.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">الحبس.</h2>
    ${slide('ar', 's4', 'أنبوب كريم الهيالورون على خلفية بيضاء: الحبس')}
    <p class="text-gray-700">الكريم يمنع الماء من الخروج. حمض الهيالورونيك عالي الوزن يبقى على السطح، والغليسرين 9% يعمل خلفه. السيروم يملأ والكريم يحبس، ولا أحدهما نسخة أضعف من الآخر.</p>
  </div>

  <div class="rounded-3xl bg-[#F3F5FB] p-6 md:p-8">
    <h2 class="text-3xl font-bold">${L('+82%')} بعد استخدام واحد.</h2>
    ${slide('ar', 's5', 'أطوار القمر على خلفية كحلية: ترطيب أعلى بنسبة 82% بعد استخدام واحد')}
    <p class="text-gray-700">هذه نتيجة مقيسة، لا وعد. رفع كريم الهيالورون ترطيب البشرة ${L('82%')} مباشرة بعد وضعه مرة واحدة، وبقي الترطيب أعلى بكثير من نقطة البداية بعد 72 ساعة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">التوهّج.</h2>
    ${slide('ar', 's6', 'كريم Revita Glow BB مع إسفنجته: التوهّج')}
    <p class="text-gray-700">Revita Glow هو اللمسة الأخيرة وخطوة الحماية الصباحية معاً: لون خفيف مشرق بحماية ${L('SPF 38 PA+++')} من أربعة فلاتر، مع نياسيناميد 2% وأدينوزين 0.04%. وتسجّله كوريا للحماية من الأشعة والتفتيح والعناية بالتجاعيد في آن واحد. ضعي نقاطاً ووزّعيه ثم ربّتيه بالإسفنجة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">قمران. اختاري قمركِ.</h2>
    ${slide('ar', 's7', 'أنبوبا Revita Glow تحت قمر أبيض وقمر ذهبي: #01 Bright و#02 Natural')}
${shades([
  ['#01 Bright', BRIGHT, 'أفتح وأكثر إشراقاً، للبشرة الفاتحة إلى الفاتحة المتوسطة.'],
  ['#02 Natural', NATURAL, 'أدفأ وأعمق قليلاً، للبشرة الفاتحة المتوسطة إلى المتوسطة، بتوهّج أنعم.'],
])}
    <p class="text-gray-700 mt-4">كلاهما يحمل حماية ${L('SPF 38 PA+++')} والنياسيناميد والأدينوزين نفسها، والفرق في الصبغة فقط، وتختارين الدرجة عند إضافة المجموعة إلى السلة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">اللمسة الأخيرة.</h2>
    ${slide('ar', 's8', 'علبة الإسفنجة الاحتفالية بمرآة على الحرير: اللمسة الأخيرة')}
    <p class="text-gray-700">علبة إسفنجة احتفالية بمرآة، والإسفنجة المصممة لـRevita Glow. اغسلي الإسفنجة بانتظام واتركيها تجف في العلبة المفتوحة.</p>
  </div>
  ${videoBlock('توهّج البدر. في 20 ثانية')}

  <div>
    <h2 class="text-3xl font-bold">كل صباح.</h2>
    ${slide('ar', 's10', 'بطاقة صباحاً ومساءً على الكتان: السيروم والكريم وكريم BB كل صباح')}
${timeline([
  ['الصباح', 'السيروم، الكريم، ثم كريم BB', 'ربّتي السيروم، واحبسيه بالكريم، واختمي بـRevita Glow كآخر خطوة وحماية من الشمس. في الخارج طوال اليوم؟ جدّدي وضعه.'],
  ['المساء', 'تنظيف، سيروم، كريم', 'أزيلي كريم BB، ثم السيروم والكريم فقط. الليل للبشرة كي ترتوي.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">جرّة القمر لعام جديد.</h2>
    ${slide('ar', 's9', 'جرّة القمر الكورية بجانب علبة أعياد GENOSYS')}
    <p class="text-gray-700">جرّة القمر الكورية، أو دالهانغاري، من أحب قطع الخزف الكوري، وسُمّيت لشبهها بالبدر. وهي رمز للوفرة والنقاء وحسن الطالع، ولذلك تستقبل بها كوريا الموسم الجديد والعام الجديد. وهذا العام، هي على العلبة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">هدية تتوهّج.</h2>
    ${slide('ar', 's11', 'علبة الأعياد على حرير ذهبي، جاهزة للإهداء')}
    <p class="text-gray-700">تصل في علبة أعياد GENOSYS جاهزة للإهداء، ومعها الإسفنجة وعلبة المرآة في الداخل. اختاري الدرجة الأقرب إلى من تهدينها. ثلاثة أحجام كاملة بسعر أقل من شرائها منفردة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">هل تناسبكِ؟</h2>
${fit(
  'مناسبة لكِ إذا',
  ['تشعرين بشدّ في بشرتكِ أو تبدو باهتة بعد الظهر', 'تريدين أساساً خفيفاً مع حماية من الشمس بدلاً من كريم الأساس', 'أنتِ جديدة على العناية الكورية وتريدين ثلاث خطوات لا عشراً', 'تبحثين عن هدية تُستخدم كل صباح'],
  'ابحثي عن خيار آخر إذا',
  [`كانت البقع الداكنة هدفكِ الأول: ${link('/ar/products/56', 'Skin Brightening Beauty Box')}`, `كانت الحبوب أولويتكِ: ${link('/ar/products/55', 'Problem Skin Care Beauty Box')}`, `أردتِ تغطية كاملة: ${link('/ar/products/41', 'كوشن Blemish Balm')}`, 'كان العطر مشكلة لكِ: المنتجات الثلاثة تحمل رائحة خفيفة'],
)}
    <p class="text-sm text-gray-600 mt-4">السيروم والكريم وكريم BB مختبرة جلدياً. إن كانت بشرتكِ حساسة، جرّبي كل منتج على مساحة صغيرة أولاً.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ما يهم معرفته.</h2>
${faq([
  ['هل يكفي كريم BB كحماية من الشمس؟', `يحمل حماية ${L('SPF 38 PA+++')}، ففي يوم عادي هو خطوة الحماية الصباحية. عند البقاء طويلاً في الخارج، جدّدي وضعه خلال النهار أو أضيفي واقي شمس مخصصاً.`],
  ['هل أحتاج إلى المنتجات الثلاثة؟', 'السيروم والكريم يعمل كل منهما وحده، لكنهما معاً يقدّمان ما لا يقدّمه أحدهما: السيروم يملأ البشرة بالماء والكريم يحبسه. وكريم BB هو اللمسة الأخيرة، فاستغني عنه مساءً لا صباحاً.'],
  ['أي درجة أختار؟', `${L('#01 Bright')} للبشرة الفاتحة إلى الفاتحة المتوسطة، و${L('#02 Natural')} للبشرة الفاتحة المتوسطة إلى المتوسطة. الحماية نفسها والعناية نفسها، والفرق في الصبغة.`],
  ['هل يمكنني شراء المنتجات منفردة؟', 'نعم، للسيروم والكريم وRevita Glow صفحاتها الخاصة. المجموعة هي الأحجام الكاملة الثلاثة نفسها بمجموع أقل، ومعها الإسفنجة وعلبة المرآة وعلبة الهدايا.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">توهّجي في الأعياد.</h2>
    ${slide('ar', 's12', 'GLASS SKIN RITUAL KIT: علبة الأعياد مفتوحة مع السيروم والكريم وكريم BB وعلبة الإسفنجة')}
  </div>
${cta(
  'توهّج البدر.',
  `GLASS SKIN RITUAL KIT · سيروم 30 مل · كريم 50 غ · Revita Glow BB بوزن 50 غ · إسفنجة وعلبة بمرآة · ${L('#01 Bright')} أو ${L('#02 Natural')} · صُنع في كوريا`,
  '/ar/products/68',
  'تسوّقي المجموعة',
)}
</div>`

async function main() {
  const data = {
    title: 'Full Moon Glow: The Glass Skin Ritual in Three Steps',
    slug: SLUG,
    excerpt:
      'A hyaluron serum that fills, a hyaluron cream that holds (+82% hydration after one use, still holding at 72 hours) and Revita Glow BB cream with SPF 38 PA+++ to finish. In the GENOSYS holiday box with the Korean moon jar. The whole campaign in twelve slides.',
    content: contentEn,
    featuredImage: `${IMG}/s1.jpg`,
    titleRu: 'Сияние полной луны: ритуал стеклянной кожи в три шага',
    excerptRu:
      'Гиалуроновая сыворотка наполняет, гиалуроновый крем удерживает (+82% увлажнения после одного нанесения, держится 72 часа), а BB-крем Revita Glow с SPF 38 PA+++ завершает уход. В праздничной коробке GENOSYS с корейской лунной вазой. Вся кампания в двенадцати слайдах.',
    contentRu,
    titleAr: 'توهّج البدر: روتين البشرة الزجاجية في ثلاث خطوات',
    excerptAr:
      `سيروم هيالورون يملأ، وكريم هيالورون يحبس (ترطيب أعلى بنسبة ${L('82%')} بعد استخدام واحد ويبقى 72 ساعة)، وكريم Revita Glow BB بحماية ${L('SPF 38 PA+++')} يختم. في علبة أعياد GENOSYS بجرّة القمر الكورية. الحملة كاملة في اثنتي عشرة شريحة.`,
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'glass-skin',
      'glass-skin-ritual-kit',
      'holiday-gift',
      'hyaluronic-acid',
      'bb-cream',
      'revita-glow',
      'korean-skincare',
      'uae-skincare',
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
