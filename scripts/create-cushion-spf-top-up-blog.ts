/**
 * Creates or updates the multilingual "is my SPF cushion my sunscreen" article
 * for the SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++] (product 41).
 *
 * Trend context (checked live, Nov 2026): every major beauty outlet this year
 * runs the same dermatologist line on cushion sunscreens/foundations —
 * NewBeauty, Vogue Arabia, FASHION Magazine, POPBEE, Cosmopolitan, Glamour:
 * a cushion is a reapplication tool, not a replacement for a full morning
 * sunscreen, because people under-apply a few light taps versus the amount
 * used in SPF testing. The honest, product-true angle: our own refill (15 g
 * in the compact + a 15 g spare already in the box) is a direct answer to
 * the under-application problem the press keeps flagging, so the article
 * leans on that instead of overselling the cushion as a full sunscreen.
 *
 * No clinical SPF-testing claim, no comparison numbers against named
 * competitor products — only Korea's own registered spec for this product
 * (5 UV filters, SPF50+ PA++++, niacinamide 2%, adenosine 0.04%, 15 g + 15 g
 * refill, 3 shades) and the real, already-live campaign lines reused as
 * artwork captions. No contract-manufacturer vocabulary, no prices.
 *
 * Artwork: all real, already-live site/Instagram images and the live reel —
 * no new generation. public/images/cushion_campaign/ and
 * public/images/cushion_art/ (the 30 Sep 2026 "ONE PRESS" campaign), and
 * /videos/cushion-reel-web.mp4 (the live reel, posted 30 Sep 2026).
 *
 * Classes live in this file, so push and deploy before running it (Tailwind
 * compiles only classes it has seen in the repo).
 *
 * Run:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/create-cushion-spf-top-up-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'spf-cushion-one-press-three-jobs'
const CAMPAIGN_IMG = '/images/cushion_art'
const COVER = '/images/cushion_campaign/main.jpg'
const VIDEO = '/videos/cushion-reel-web.mp4'
const POSTER = '/images/cushion_campaign/reel-poster.jpg'

const IG = {
  carousel: 'https://www.instagram.com/genosys.uae/p/Dd6R_5YjCJ9/',
  reel: 'https://www.instagram.com/genosys.uae/reel/Dd6T-4dqjI_/',
}

type Locale = 'en' | 'ru' | 'ar'
const prefix = (locale: Locale) => (locale === 'en' ? '' : `/${locale}`)

const img = (file: string, alt: string) =>
  `<img src="${CAMPAIGN_IMG}/${file}.jpg" alt="${alt}" width="1024" height="1024" class="w-full h-auto rounded-2xl shadow-lg shadow-[#5B4A2E]/15" loading="lazy" />`

const link = (href: string, text: string) =>
  `<a href="${href}" class="text-[#8A5A4E] font-semibold underline decoration-[#DEAA9D] underline-offset-4 hover:decoration-[#8A5A4E]">${text}</a>`

const extLink = (href: string, text: string) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-[#8A5A4E] font-semibold underline decoration-[#DEAA9D] underline-offset-4 hover:decoration-[#8A5A4E]">${text}</a>`

const hero = (kicker: string, title: string, line: string) => `
  <div class="rounded-3xl bg-[#F8E9E4] p-8 md:p-12">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#8A5A4E]">${kicker}</p>
    <h2 class="text-4xl md:text-6xl leading-[0.95] mt-4 text-[#323132]"><span class="font-light">${title}</span></h2>
    <p class="text-lg text-[#4A4636] mt-6 max-w-2xl">${line}</p>
  </div>`

const feature = (file: string, alt: string, heading: string, body: string, tone: 'butter' | 'pink' | 'plain') => {
  const bg = tone === 'butter' ? 'bg-[#F6F1DE]' : tone === 'pink' ? 'bg-[#F8E9E4]' : 'bg-white'
  return `
  <div class="grid items-center gap-6 rounded-3xl ${bg} p-5 md:grid-cols-2 md:gap-10 md:p-8">
    <div class="mx-auto w-full max-w-sm">${img(file, alt)}</div>
    <div>
      <h2 class="text-3xl font-semibold leading-tight text-[#323132]">${heading}</h2>
      ${body}
    </div>
  </div>`
}

const p = (text: string) => `<p class="text-gray-700 mt-4">${text}</p>`

const stats = (items: [string, string][], tone: 'butter' | 'pink') => {
  const card = tone === 'butter' ? 'border-[#DDCE9D] bg-[#FBF8EC]' : 'border-[#DEAA9D] bg-[#FCF3F0]'
  return `
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
    ${items.map(([value, label]) => `<div class="rounded-2xl border ${card} p-5 text-center">
      <p class="text-3xl md:text-4xl font-light text-[#323132]" dir="ltr">${value}</p>
      <p class="text-sm text-gray-600 mt-2">${label}</p>
    </div>`).join('\n    ')}
  </div>`
}

const steps = (items: [string, string, string][]) => `
  <ol class="mt-6 grid gap-4 sm:grid-cols-3">
    ${items.map(([n, title, body]) => `<li class="rounded-2xl bg-white p-5 shadow-sm">
      <p class="text-4xl font-light text-[#DEAA9D]" dir="ltr">${n}</p>
      <p class="font-semibold text-[#323132] mt-2">${title}</p>
      <p class="text-sm text-gray-700 mt-2">${body}</p>
    </li>`).join('\n    ')}
  </ol>`

const videoBlock = (label: string, line: string) => `
  <div class="rounded-3xl bg-[#F6F1DE] p-6 md:p-10">
    <h2 class="text-3xl font-semibold text-[#323132] text-center">${label}</h2>
    <p class="text-gray-700 mt-3 text-center max-w-xl mx-auto">${line}</p>
    <div class="mt-6 mx-auto max-w-sm">
      <div class="flex justify-center rounded-3xl overflow-hidden shadow-xl shadow-[#5B4A2E]/25 bg-black">
        <video
          src="${VIDEO}"
          poster="${POSTER}"
          controls="controls"
          playsinline="playsinline"
          preload="metadata"
          class="w-auto max-w-full max-h-[70vh]"
          width="720"
          height="1280"
          style="aspect-ratio: 9 / 16"
        ></video>
      </div>
    </div>
  </div>`

const instagram = (title: string, line: string, items: [string, string][]) => `
  <div class="rounded-3xl border border-[#323132]/10 bg-white p-6 md:p-8">
    <h2 class="text-2xl font-semibold text-[#323132]">${title}</h2>
    <p class="text-gray-700 mt-2">${line}</p>
    <div class="mt-5 flex flex-wrap gap-3">
      ${items.map(([href, label]) => `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-block rounded-full border border-[#323132]/20 px-5 py-2 text-sm font-semibold text-[#323132] hover:bg-[#F8E9E4]">${label}</a>`).join('\n      ')}
    </div>
  </div>`

const fit = (yesTitle: string, yes: string[], noTitle: string, no: string[]) => `
  <div class="mt-5 grid gap-4 md:grid-cols-2">
    <div class="rounded-2xl bg-[#FBF8EC] p-6">
      <p class="font-semibold text-[#323132]">${yesTitle}</p>
      <ul class="mt-3 space-y-2 text-gray-700">${yes.map((l) => `<li>✓ ${l}</li>`).join('')}</ul>
    </div>
    <div class="rounded-2xl bg-gray-50 p-6">
      <p class="font-semibold text-[#323132]">${noTitle}</p>
      <ul class="mt-3 space-y-2 text-gray-700">${no.map((l) => `<li>→ ${l}</li>`).join('')}</ul>
    </div>
  </div>`

const faq = (items: [string, string][]) => `
  <dl class="mt-5 divide-y divide-[#323132]/10 rounded-2xl border border-[#323132]/10 bg-white">
    ${items.map(([q, a]) => `<div class="p-5"><dt class="font-semibold text-[#323132]">${q}</dt><dd class="text-gray-700 mt-2">${a}</dd></div>`).join('\n    ')}
  </dl>`

const cta = (title: string, line: string, buttons: [string, string][]) => `
  <div class="rounded-3xl bg-[#EFE6C4] p-8 md:p-12 text-center">
    <h2 class="text-3xl md:text-5xl leading-tight text-[#323132]"><span class="font-light">${title}</span></h2>
    <p class="text-[#4A4636] mt-4 mb-7 max-w-2xl mx-auto">${line}</p>
    <div class="flex flex-wrap justify-center gap-3">
      ${buttons.map(([href, label], i) => `<a href="${href}" class="inline-block rounded-full ${i === 0 ? 'bg-[#323132] text-white hover:bg-[#4A4636]' : 'border border-[#323132] text-[#323132] hover:bg-white'} px-7 py-3 font-semibold">${label}</a>`).join('\n      ')}
    </div>
  </div>`

const sources = (title: string, body: string) => `
  <div class="text-sm text-gray-500 border-t border-[#323132]/10 pt-5">
    <p class="font-semibold text-gray-600">${title}</p>
    <p class="mt-2">${body}</p>
  </div>`

// ─── English ────────────────────────────────────────────────────────────
const en = (): string => {
  const l = prefix('en')
  return `<div class="max-w-4xl mx-auto space-y-10">
${hero('GENOSYS Explains · What it actually does', 'ONE PRESS.<br />NOT YOUR WHOLE SPF.', 'Every beauty editor is saying the same thing this year: a cushion is for reapplying, not for replacing your morning sunscreen. Here is the honest job of ours, and why the part that matters most is already sitting in the box.')}

  <div>
    <p class="text-lg text-gray-700">A cushion compact looks like one step doing everything: coverage, a dewy finish, and a sun protection factor printed right on the box. It is tempting to stop there. Dermatologists quoted across the beauty press this year keep making the same point, though: the SPF number on a cushion is tested with far more product than a few light taps ever deposit. The format is not weaker. The habit of under-applying it is the problem.</p>
  </div>
${feature('s11', 'An open gold pocket watch beside the text "Back in two hours"', 'A top-up, not a base.',
    p('The advice repeated by NewBeauty, Vogue Arabia and FASHION Magazine this year is consistent: start the day with a proper layer of sunscreen, then use the cushion to keep that protection going through the day, roughly every two hours in strong sun.') +
    p('That is exactly how ours is built to be used. Five UV filters take it to SPF50+ PA++++, Korea licenses the same formula for coverage, sun protection and skincare at once, and the compact mirror means a touch-up never means starting your makeup over.'),
    'pink')}
${feature('s9', 'Two gold keys on a ring beside the text "The spare is in the box"', 'The part that actually matters.',
    p('The real gap experts point to is not the formula, it is the habit: people stretch a near-empty compact to make it last, and a thin layer under-protects no matter what the box promises.') +
    p('Ours answers that directly. 15 g sits in the compact, and a full 15 g refill already ships inside the same box, so running low is never a reason to apply less.'),
    'butter')}

  <div class="rounded-3xl bg-[#F6F1DE] p-6 md:p-10">
    <h2 class="text-3xl font-semibold text-[#323132]">What is actually in the press.</h2>
    ${p('The Skin Caring Blemish Balm Cushion is one formula, registered in Korea for all three jobs at once: coverage, sun protection and skincare.')}
    <div class="mt-6">${stats([
      ['SPF50+', 'PA++++, 5 UV filters'],
      ['2%', 'niacinamide'],
      ['0.04%', 'adenosine'],
      ['15 g × 2', 'compact + refill, same box'],
    ], 'butter')}</div>
    ${p('Three shades share the exact same formula: #01 Ivory, #02 Beige, #03 Camel. If you are between two, Beige is the safe middle.')}
  </div>
${feature('s4b', 'A cushion compact and its puff on a dark background beside the text "One press. Three jobs."', 'Press, pat, build.',
    p('Press the puff lightly onto the cushion, pat it evenly onto skin, then layer again wherever you want more coverage. The waterdrop shape of the puff is made to reach the curve of the nose and the inner corner of the eye, the two spots a flat puff usually misses.'),
    'plain')}
${feature('s5b', 'A smear of beige cushion formula on a pale background beside the text "Stays in place"', 'Built to last through the day.',
    p('Three fixing polymers keep the coverage where you put it, which is what makes the two-hourly top-up worth doing: you are reinforcing a finish that already holds, not rebuilding it from zero.'),
    'plain')}

  <div class="rounded-3xl bg-[#F8E9E4] p-6 md:p-10">
    <div class="grid items-center gap-8 md:grid-cols-2">
      <div class="mx-auto w-full max-w-sm">${img('s10', 'A gold wax-seal stamp pressing into a disc of cushion formula beside the text "Press. Pat. Build."')}</div>
      <div>
        <h2 class="text-3xl font-semibold text-[#323132]">The right order, morning to midday.</h2>
        ${p('A cushion is the top-up, not the base. Start with a real layer of sunscreen before you leave the house.')}
      </div>
    </div>
${steps([
  ['01', 'Base sunscreen', `Apply a proper layer of sunscreen first, such as ${link(`${l}/products/40`, 'Multi Sun Cream SPF40')} or ${link(`${l}/products/39`, 'Ultra Shield SPF50+')}.`],
  ['02', 'Cushion over it', 'Press, pat and build the cushion for coverage and the first layer of top-up protection.'],
  ['03', 'Reapply every 2 hours', 'In strong UAE sun, press the puff again every couple of hours. The mirror in the lid means you never need to start over.'],
])}
  </div>
${videoBlock('One press. Three jobs.', 'The reel from our Instagram: the cushion, the puff, the press.')}
${feature('s13', 'Three swatches of foundation in different shades beside the text "Find your shade"', 'Three shades, one formula.',
    p('#01 Ivory for fair, cool undertones, #02 Beige for light to medium, neutral undertones, #03 Camel for medium to tan, warm undertones. The SPF, niacinamide and adenosine are identical across all three.'),
    'plain')}

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">Is it for you?</h2>
${fit(
  'A good match if',
  ['You want coverage, SPF and skincare in the same step', 'You are already applying a base sunscreen and want an easy way to keep it topped up', 'You like a dewy, natural finish over a heavy, matte one', 'You want a compact that travels and touches up without a mirror or brush'],
  'Pair it with a base sunscreen if',
  ['You are heading to the beach, a pool, or any long stretch outdoors', 'Your main goal is sunburn prevention, not coverage', 'You have melasma or active pigmentation concerns', 'You only ever reach for the cushion and skip a morning sunscreen entirely'],
)}
  </div>

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">Good to know.</h2>
${faq([
  ['Is the cushion enough sun protection on its own?', 'Treat it as a top-up layer, not your only sunscreen. Start the day with a proper layer such as Multi Sun Cream SPF40 or Ultra Shield SPF50+, then use the cushion to keep that protection going and to add coverage.'],
  ['Why does the box come with a spare?', 'A thin, stretched-out layer under-protects no matter how it is labelled. The 15 g refill means there is never a reason to apply less because the compact is running low.'],
  ['How often should I reapply in the UAE sun?', 'Roughly every two hours in strong sun, same as any sunscreen. The compact mirror makes that a touch-up, not a full redo.'],
  ['Do the shades protect differently?', 'No. SPF50+ PA++++, 2% niacinamide and 0.04% adenosine are identical in #01 Ivory, #02 Beige and #03 Camel.'],
  ['Does it work over makeup?', 'Yes, that is exactly the reapplication case it is built for: a light press and pat over your base, no need to remove anything first.'],
])}
  </div>
${instagram('Seen on our Instagram', 'This article grew out of our cushion row on @genosys.uae.', [
  [IG.reel, 'The reel: One press. Three jobs.'],
  [IG.carousel, 'The full carousel'],
])}
${cta('One press.<br />The honest way.', 'SKIN CARING BLEMISH BALM CUSHION · SPF50+ PA++++ · Niacinamide 2% · Adenosine 0.04% · 15 g + 15 g refill in the box · 3 shades · Made in Korea', [
  [`${l}/products/41`, 'Shop the cushion'],
  [`${l}/products/40`, 'See the base sunscreens'],
])}
${sources('Sources', `Dermatologist guidance on cushion sunscreens as a reapplication layer, reported in ${extLink('https://www.newbeauty.com/view/sunscreen-cushions', 'NewBeauty')}, ${extLink('https://www.voguearabia.com/article/cushion-sunscreens-k-beauty', 'Vogue Arabia')} and ${extLink('https://fashionmagazine.com/beauty-grooming/best-spf-launches-2026/', 'FASHION Magazine')}, 2026. Product facts: the registered formula for the Skin Caring Blemish Balm Cushion. This article is general information, not medical advice.`)}
</div>`
}

// ─── Russian ────────────────────────────────────────────────────────────
const ru = (): string => {
  const l = prefix('ru')
  return `<div class="max-w-4xl mx-auto space-y-10">
${hero('GENOSYS объясняет · Что кушон делает на самом деле', 'ОДНО НАЖАТИЕ.<br />НЕ ВЕСЬ ВАШ SPF.', 'В этом году все бьюти-редакторы говорят одно и то же: кушон нужен для обновления защиты, а не для замены утреннего солнцезащитного крема. Рассказываем честно, для чего нужен наш, и почему самое важное уже лежит в коробке.')}

  <div>
    <p class="text-lg text-gray-700">Компакт-кушон выглядит так, будто делает всё сразу: покрытие, сияющий финиш и фактор защиты прямо на упаковке. Хочется остановиться на этом. Но дерматологи, которых цитирует бьюти-пресса в этом году, повторяют одну и ту же мысль: SPF на кушоне тестируют с гораздо большим количеством средства, чем даёт несколько лёгких нажатий. Проблема не в формате, а в привычке наносить слишком мало.</p>
  </div>
${feature('s11', 'Открытые золотые карманные часы рядом с текстом "Back in two hours"', 'Обновление, а не база.',
    p('Совет, который в этом году повторяют NewBeauty, Vogue Arabia и FASHION Magazine, одинаков: начните день с настоящего слоя солнцезащитного крема, а кушоном поддерживайте защиту в течение дня, примерно каждые два часа на сильном солнце.') +
    p('Именно так задумано использование нашего. Пять UV-фильтров дают SPF50+ PA++++, в Корее одна и та же формула зарегистрирована сразу для покрытия, защиты от солнца и ухода, а зеркало в крышке означает, что подправить макияж никогда не значит начинать заново.'),
    'pink')}
${feature('s9', 'Два золотых ключа на кольце рядом с текстом "The spare is in the box"', 'То, что действительно важно.',
    p('Главный разрыв, на который указывают эксперты, не в формуле, а в привычке: люди растягивают почти пустой компакт, чтобы он дольше прослужил, а тонкий слой недозащищает, что бы ни было написано на упаковке.') +
    p('Наш отвечает на это прямо. 15 г лежат в компакте, и полный сменный блок на 15 г уже идёт в той же коробке, так что заканчивающееся средство никогда не повод наносить его меньше.'),
    'butter')}

  <div class="rounded-3xl bg-[#F6F1DE] p-6 md:p-10">
    <h2 class="text-3xl font-semibold text-[#323132]">Что действительно внутри.</h2>
    ${p('Skin Caring Blemish Balm Cushion это одна формула, зарегистрированная в Корее сразу для трёх задач: покрытие, защита от солнца и уход.')}
    <div class="mt-6">${stats([
      ['SPF50+', 'PA++++, 5 UV-фильтров'],
      ['2%', 'ниацинамида'],
      ['0,04%', 'аденозина'],
      ['15 г × 2', 'компакт + сменный блок в одной коробке'],
    ], 'butter')}</div>
    ${p('Три оттенка используют одну и ту же формулу: #01 Ivory, #02 Beige, #03 Camel. Если между двумя оттенками, Beige безопасная середина.')}
  </div>
${feature('s4b', 'Компакт-кушон и его спонж на тёмном фоне рядом с текстом "One press. Three jobs."', 'Нажать, вбить, нарастить.',
    p('Лёгко прижмите спонж к кушону, равномерно вбейте в кожу, а там, где хочется больше покрытия, нанесите ещё слой. Форма спонжа-капли создана, чтобы доставать до крыла носа и внутреннего уголка глаза, туда, куда плоский спонж обычно не доходит.'),
    'plain')}
${feature('s5b', 'Мазок бежевой формулы кушона на светлом фоне рядом с текстом "Stays in place"', 'Держится весь день.',
    p('Три фиксирующих полимера удерживают покрытие там, где вы его нанесли, и именно поэтому обновление раз в два часа имеет смысл: вы укрепляете уже держащийся результат, а не создаёте его с нуля.'),
    'plain')}

  <div class="rounded-3xl bg-[#F8E9E4] p-6 md:p-10">
    <div class="grid items-center gap-8 md:grid-cols-2">
      <div class="mx-auto w-full max-w-sm">${img('s10', 'Золотая печать с воском прижимается к диску формулы кушона рядом с текстом "Press. Pat. Build."')}</div>
      <div>
        <h2 class="text-3xl font-semibold text-[#323132]">Правильный порядок, с утра до дня.</h2>
        ${p('Кушон это обновление, а не база. Перед выходом из дома нанесите настоящий слой солнцезащитного крема.')}
      </div>
    </div>
${steps([
  ['01', 'Базовый SPF', `Сначала нанесите настоящий слой солнцезащитного крема, например ${link(`${l}/products/40`, 'Multi Sun Cream SPF40')} или ${link(`${l}/products/39`, 'Ultra Shield SPF50+')}.`],
  ['02', 'Кушон сверху', 'Прижмите, вбейте и нарастите кушон для покрытия и первого слоя защиты-обновления.'],
  ['03', 'Обновляйте каждые 2 часа', 'На сильном солнце ОАЭ прижимайте спонж снова каждые пару часов. Зеркало в крышке значит, что начинать заново не нужно.'],
])}
  </div>
${videoBlock('Одно нажатие. Три задачи.', 'Рилс из нашего Инстаграма: кушон, спонж, нажатие.')}
${feature('s13', 'Три мазка тонального средства разных оттенков рядом с текстом "Find your shade"', 'Три оттенка, одна формула.',
    p('#01 Ivory для светлой кожи с холодным подтоном, #02 Beige для светлой-средней кожи с нейтральным подтоном, #03 Camel для средней-смуглой кожи с тёплым подтоном. SPF, ниацинамид и аденозин одинаковы во всех трёх.'),
    'plain')}

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">Подходит ли вам?</h2>
${fit(
  'Подойдёт, если',
  ['Хочется покрытие, SPF и уход в одном шаге', 'Вы уже наносите базовый солнцезащитный крем и хотите удобный способ его обновлять', 'Вам нравится сияющий, естественный финиш, а не плотный матовый', 'Нужен компакт, который легко берёт в дорогу и подправляет макияж без зеркала и кисти'],
  'Дополните базовым SPF, если',
  ['Вы едете на пляж, к бассейну или надолго на улицу', 'Главная цель защита от ожога, а не покрытие', 'У вас мелазма или активная гиперпигментация', 'Вы пользуетесь только кушоном и совсем пропускаете утренний солнцезащитный крем'],
)}
  </div>

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">Полезно знать.</h2>
${faq([
  ['Достаточно ли кушона как единственной защиты от солнца?', 'Воспринимайте его как слой обновления, а не единственный солнцезащитный крем. Начните день с настоящего слоя, например Multi Sun Cream SPF40 или Ultra Shield SPF50+, а кушоном поддерживайте защиту и добавляйте покрытие.'],
  ['Почему в коробке есть сменный блок?', 'Тонкий, растянутый слой недозащищает, что бы ни было на этикетке. Сменный блок на 15 г означает, что заканчивающееся средство в компакте никогда не повод наносить меньше.'],
  ['Как часто обновлять на солнце в ОАЭ?', 'Примерно каждые два часа на сильном солнце, как с любым солнцезащитным кремом. Зеркало в компакте превращает это в подправку, а не в полное обновление макияжа.'],
  ['Оттенки защищают по-разному?', 'Нет. SPF50+ PA++++, 2% ниацинамида и 0,04% аденозина одинаковы в #01 Ivory, #02 Beige и #03 Camel.'],
  ['Работает ли он поверх макияжа?', 'Да, это и есть случай обновления, для которого он создан: лёгкое нажатие и вбивание поверх базы, ничего предварительно снимать не нужно.'],
])}
  </div>
${instagram('В нашем Инстаграме', 'Эта статья выросла из ряда про кушон на @genosys.uae.', [
  [IG.reel, 'Рилс: Одно нажатие. Три задачи.'],
  [IG.carousel, 'Полная карусель'],
])}
${cta('Одно нажатие.<br />Честный подход.', 'SKIN CARING BLEMISH BALM CUSHION · SPF50+ PA++++ · Ниацинамид 2% · Аденозин 0,04% · 15 г + сменный блок 15 г в одной коробке · 3 оттенка · Сделано в Корее', [
  [`${l}/products/41`, 'Купить кушон'],
  [`${l}/products/40`, 'Базовые солнцезащитные средства'],
])}
${sources('Источники', `Рекомендации дерматологов о кушон-SPF как слое обновления, по материалам ${extLink('https://www.newbeauty.com/view/sunscreen-cushions', 'NewBeauty')}, ${extLink('https://www.voguearabia.com/article/cushion-sunscreens-k-beauty', 'Vogue Arabia')} и ${extLink('https://fashionmagazine.com/beauty-grooming/best-spf-launches-2026/', 'FASHION Magazine')}, 2026 год. Данные о продукте: зарегистрированная формула Skin Caring Blemish Balm Cushion. Статья носит общий информационный характер и не заменяет консультацию врача.`)}
</div>`
}

// ─── Arabic ─────────────────────────────────────────────────────────────
// Latin product names and figures that touch Arabic text sit inside
// U+2066/U+2069 so the right-to-left paragraph keeps them in order.
const L = (s: string) => `\u2066${s}\u2069`

const ar = (): string => {
  const l = prefix('ar')
  return `<div class="max-w-4xl mx-auto space-y-10">
${hero('GENOSYS تشرح · ما الذي يفعله الكوشن فعلاً', 'ضغطة واحدة.<br />ليست كل حمايتكِ من الشمس.', 'يقول كل خبراء الجمال هذا العام الشيء نفسه: الكوشن لإعادة التطبيق، لا لاستبدال واقي الشمس الصباحي. إليكِ المهمة الحقيقية لكوشننا، ولماذا الجزء الأهم موجود بالفعل داخل العلبة.')}

  <div>
    <p class="text-lg text-gray-700">تبدو علبة الكوشن كخطوة واحدة تفعل كل شيء: تغطية، لمسة نهائية متوهجة، ومعامل حماية من الشمس مطبوع على العلبة. يسهل التوقف عند هذا الحد. لكن أطباء الجلدية الذين تقتبس عنهم الصحافة الجمالية هذا العام يكررون النقطة نفسها: رقم الحماية على الكوشن يُختبر بكمية أكبر بكثير من المنتج مقارنة بما توصّله نقرات خفيفة قليلة. المشكلة ليست في الصيغة، بل في عادة استخدام كمية أقل من اللازم.</p>
  </div>
${feature('s11', 'ساعة جيب ذهبية مفتوحة بجانب نص "Back in two hours"', 'إعادة تطبيق، لا أساس.',
    p('النصيحة التي تكررها NewBeauty وVogue Arabia وFASHION Magazine هذا العام واحدة: ابدئي اليوم بطبقة حقيقية من واقي الشمس، ثم استخدمي الكوشن لإبقاء تلك الحماية طوال اليوم، كل ساعتين تقريباً تحت شمس قوية.') +
    p('وهذا تماماً أسلوب استخدام كوشننا. خمسة مرشحات للأشعة فوق البنفسجية ترفعه إلى SPF50+ PA++++، وكوريا تسجّل الصيغة نفسها للتغطية والحماية من الشمس والعناية في آن واحد، والمرآة داخل الغطاء تعني أن التنسيق لا يعني إعادة المكياج من الصفر أبداً.'),
    'pink')}
${feature('s9', 'مفتاحان ذهبيان على حلقة بجانب نص "The spare is in the box"', 'الجزء الذي يهم فعلاً.',
    p('الفجوة الحقيقية التي يشير إليها الخبراء ليست في الصيغة، بل في العادة: يمدّد الناس علبة شبه فارغة لتدوم أطول، وطبقة رقيقة لا توفّر حماية كافية بغض النظر عن ما تعد به العلبة.') +
    p(`يجيب كوشننا عن ذلك مباشرة. ${L('15 g')} داخل العلبة، وتعبئة كاملة أخرى بـ${L('15 g')} موجودة بالفعل داخل الصندوق نفسه، فنفاد الكمية لا يكون سبباً أبداً لاستخدام كمية أقل.`),
    'butter')}

  <div class="rounded-3xl bg-[#F6F1DE] p-6 md:p-10">
    <h2 class="text-3xl font-semibold text-[#323132]">ما الموجود فعلاً في العلبة.</h2>
    ${p(`${L('Skin Caring Blemish Balm Cushion')} صيغة واحدة، مسجّلة في كوريا للمهمات الثلاث معاً: التغطية والحماية من الشمس والعناية.`)}
    <div class="mt-6">${stats([
      ['SPF50+', 'PA++++، 5 مرشحات للأشعة'],
      ['2%', 'نياسيناميد'],
      ['0.04%', 'أدينوزين'],
      [L('15 g × 2'), 'العلبة + التعبئة، في صندوق واحد'],
    ], 'butter')}</div>
    ${p(`ثلاثة ألوان تشترك في الصيغة نفسها: ${L('#01 Ivory, #02 Beige, #03 Camel')}. إن كنتِ بين درجتين، فـ${L('Beige')} هو الوسط الآمن.`)}
  </div>
${feature('s4b', 'علبة كوشن وقطعة الإسفنج الخاصة بها على خلفية داكنة بجانب نص "One press. Three jobs."', 'اضغطي، ربّتي، أضيفي طبقة.',
    p('اضغطي قطعة الإسفنج بلطف على الكوشن، ربّتي بالتساوي على البشرة، ثم أضيفي طبقة أخرى حيث تريدين تغطية أكبر. شكل قطعة الإسفنج كقطرة الماء مصمم للوصول إلى انحناء الأنف وزاوية العين الداخلية، النقطتان التي تفوّتهما قطعة الإسفنج المسطحة عادة.'),
    'plain')}
${feature('s5b', 'مسحة من صيغة الكوشن البيج على خلفية فاتحة بجانب نص "Stays in place"', 'مصمم ليدوم طوال اليوم.',
    p('تحافظ ثلاثة بوليمرات مثبّتة على التغطية في مكانها، وهذا ما يجعل إعادة التطبيق كل ساعتين مجدية: تُعزّزين لمسة نهائية ثابتة بالفعل، لا تبنينها من الصفر.'),
    'plain')}

  <div class="rounded-3xl bg-[#F8E9E4] p-6 md:p-10">
    <div class="grid items-center gap-8 md:grid-cols-2">
      <div class="mx-auto w-full max-w-sm">${img('s10', 'ختم شمعي ذهبي يُضغط على قرص من صيغة الكوشن بجانب نص "Press. Pat. Build."')}</div>
      <div>
        <h2 class="text-3xl font-semibold text-[#323132]">الترتيب الصحيح، من الصباح إلى الظهيرة.</h2>
        ${p('الكوشن إعادة تطبيق، لا أساس. ضعي طبقة حقيقية من واقي الشمس قبل الخروج من المنزل.')}
      </div>
    </div>
${steps([
  ['01', 'واقي الشمس الأساسي', `ضعي أولاً طبقة حقيقية من واقي الشمس، مثل ${link(`${l}/products/40`, L('Multi Sun Cream SPF40'))} أو ${link(`${l}/products/39`, L('Ultra Shield SPF50+'))}.`],
  ['02', 'الكوشن فوقه', 'اضغطي وربّتي وأضيفي طبقات من الكوشن للتغطية وطبقة الحماية الأولى لإعادة التطبيق.'],
  ['03', 'أعيدي التطبيق كل ساعتين', 'تحت شمس الإمارات القوية، اضغطي قطعة الإسفنج مرة أخرى كل ساعتين تقريباً. المرآة داخل الغطاء تعني أنكِ لن تحتاجي للبدء من جديد أبداً.'],
])}
  </div>
${videoBlock('ضغطة واحدة. ثلاث مهمات.', 'الريل من حسابنا على إنستغرام: الكوشن، الإسفنج، الضغطة.')}
${feature('s13', 'ثلاث مسحات من كريم الأساس بألوان مختلفة بجانب نص "Find your shade"', 'ثلاثة ألوان، صيغة واحدة.',
    p(`${L('#01 Ivory')} للبشرة الفاتحة ذات التحت الباهت البارد، ${L('#02 Beige')} للبشرة الفاتحة إلى المتوسطة ذات التحت المحايد، ${L('#03 Camel')} للبشرة المتوسطة إلى الأسمر ذات التحت الدافئ. الحماية من الشمس والنياسيناميد والأدينوزين متماثلة في الثلاثة.`),
    'plain')}

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">هل يناسبكِ؟</h2>
${fit(
  'مناسب لكِ إذا',
  ['تريدين التغطية والحماية من الشمس والعناية في خطوة واحدة', 'تضعين بالفعل واقي شمس أساسي وتريدين طريقة سهلة لتجديده', 'تفضّلين لمسة نهائية متوهجة طبيعية على مظهر مطفي وثقيل', 'تريدين علبة تسافر معكِ وتعيد ضبط المكياج بلا مرآة أو فرشاة'],
  'استكمليه بواقي شمس أساسي إذا',
  ['متوجّهة إلى الشاطئ أو المسبح أو وقت طويل في الخارج', 'هدفكِ الأساسي الوقاية من حروق الشمس لا التغطية', 'لديكِ كلف أو فرط تصبّغ نشط', 'تعتمدين على الكوشن فقط وتتجاهلين واقي الشمس الصباحي تماماً'],
)}
  </div>

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">ما يهم معرفته.</h2>
${faq([
  ['هل يكفي الكوشن بمفرده كحماية من الشمس؟', `اعتبريه طبقة إعادة تطبيق، لا واقي الشمس الوحيد. ابدئي اليوم بطبقة حقيقية مثل ${L('Multi Sun Cream SPF40')} أو ${L('Ultra Shield SPF50+')}، ثم استخدمي الكوشن لإبقاء تلك الحماية وإضافة التغطية.`],
  ['لماذا تأتي العلبة بتعبئة إضافية؟', `طبقة رقيقة ومُمدّدة لا توفّر حماية كافية بغض النظر عن ما هو مكتوب عليها. تعبئة ${L('15 g')} الإضافية تعني أن نفاد الكمية داخل العلبة لا يكون سبباً أبداً لاستخدام كمية أقل.`],
  ['كم مرة أعيد التطبيق تحت شمس الإمارات؟', 'كل ساعتين تقريباً تحت شمس قوية، كما مع أي واقي شمس. مرآة العلبة تجعل ذلك تنسيقاً سريعاً، لا إعادة مكياج كاملة.'],
  ['هل تحمي الألوان بشكل مختلف؟', `لا. ${L('SPF50+ PA++++')} ونياسيناميد 2% وأدينوزين 0.04% متماثلة في ${L('#01 Ivory')} و${L('#02 Beige')} و${L('#03 Camel')}.`],
  ['هل يعمل فوق المكياج؟', 'نعم، هذه بالضبط حالة إعادة التطبيق التي صُمم لها: ضغطة وتربيت خفيفان فوق الأساس، بلا حاجة لإزالة أي شيء مسبقاً.'],
])}
  </div>
${instagram('على إنستغرام', `وُلد هذا المقال من صف الكوشن على حساب ${L('@genosys.uae')}.`, [
  [IG.reel, 'الريل: ضغطة واحدة. ثلاث مهمات.'],
  [IG.carousel, 'الكاروسيل الكامل'],
])}
${cta('ضغطة واحدة.<br />بالطريقة الصادقة.', `${L('SKIN CARING BLEMISH BALM CUSHION')} · ${L('SPF50+ PA++++')} · نياسيناميد 2% · أدينوزين 0.04% · ${L('15 g')} + تعبئة إضافية ${L('15 g')} في نفس العلبة · 3 ألوان · صُنع في كوريا`, [
  [`${l}/products/41`, 'تسوّقي الكوشن'],
  [`${l}/products/40`, 'واقيات الشمس الأساسية'],
])}
${sources('المصادر', `إرشادات أطباء الجلدية حول كوشن الحماية من الشمس كطبقة إعادة تطبيق، كما نشرتها ${extLink('https://www.newbeauty.com/view/sunscreen-cushions', 'NewBeauty')} و${extLink('https://www.voguearabia.com/article/cushion-sunscreens-k-beauty', 'Vogue Arabia')} و${extLink('https://fashionmagazine.com/beauty-grooming/best-spf-launches-2026/', 'FASHION Magazine')}، 2026. بيانات المنتج: الصيغة المسجّلة لـ${L('Skin Caring Blemish Balm Cushion')}. هذا المقال معلومات عامة وليس نصيحة طبية.`)}
</div>`
}

async function main() {
  const data = {
    title: 'One Press, Three Jobs: What Your SPF Cushion Actually Does',
    slug: SLUG,
    excerpt:
      'Every beauty editor says the same thing this year: a cushion is for touch-ups, not for replacing your morning sunscreen. Here is the honest job of the SKIN CARING BLEMISH BALM CUSHION SPF50+ PA++++, and why the spare lives inside the same box.',
    content: en(),
    featuredImage: COVER,
    titleRu: 'Одно нажатие, три задачи: что кушон с SPF делает на самом деле',
    excerptRu:
      'В этом году все бьюти-редакторы говорят одно: кушон нужен для подправки макияжа, а не замены утреннего солнцезащитного крема. Рассказываем честно о Skin Caring Blemish Balm Cushion SPF50+ PA++++ и почему сменный блок лежит в той же коробке.',
    contentRu: ru(),
    titleAr: 'ضغطة واحدة، ثلاث مهمات: ما الذي يفعله كوشن SPF فعلاً',
    excerptAr:
      'يقول كل خبراء الجمال هذا العام الشيء نفسه: الكوشن لإعادة التطبيق، لا لاستبدال واقي الشمس الصباحي. إليكِ المهمة الصادقة لكوشن SKIN CARING BLEMISH BALM CUSHION SPF50+ PA++++، ولماذا التعبئة الإضافية موجودة داخل العلبة نفسها.',
    contentAr: ar(),
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'cushion',
      'spf',
      'sunscreen-myth',
      'niacinamide',
      'glass-skin',
      'skincare-makeup-hybrid',
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
