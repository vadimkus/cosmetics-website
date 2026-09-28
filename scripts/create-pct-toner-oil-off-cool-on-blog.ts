/**
 * Creates or updates the multilingual product 15 campaign article.
 *
 * Product source of truth:
 * - Formula / artwork / COA / DTS MG deck: see the sourcing block in
 *   components/product/pcttoner/pctTonerCopy.ts (every claim here is on that page).
 * - Campaign: docs/SESSION_CHANGES_2026-09-28_PCT_TONER_CAMPAIGN.md
 *
 * Artwork: the 12-slide "Oil off. Cool on." campaign, live as the /products/15
 * gallery. EN uses public/images/pct_campaign/, RU and AR their own ru/ and ar/
 * folders. Slide 9 ships as s9b ("BACK DAY."). Featured: s1. Video: /videos/problem.mp4.
 *
 * Not sold here (per pctTonerCopy.ts omissions): copper tripeptide, BHA/salicylic
 * as the engine, SNOW ICE or Anti Sebum P as the oil-control reason, hyaluronate
 * as the hydration engine, acne treatment, fragrance-free, lot codes.
 *
 * Classes live in this file, so push and deploy before running it (Tailwind
 * compiles only classes it has seen in the repo).
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/create-pct-toner-oil-off-cool-on-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'intensive-problem-control-toner-oil-off-cool-on'
const IMG = '/images/pct_campaign'
const VIDEO = '/videos/problem.mp4'
const POSTER = '/images/pct_campaign/main.jpg'
const ULTRA = 'ultra-shield-sun-cream-healthy-boundaries'

type Locale = 'en' | 'ru' | 'ar'

const slidePath = (locale: Locale, file: string) =>
  locale === 'en' ? `${IMG}/${file}.jpg` : `${IMG}/${locale}/${file}.jpg`

const slide = (locale: Locale, file: string, alt: string) =>
  `<img src="${slidePath(locale, file)}" alt="${alt}" width="1600" height="1600" class="w-full h-auto rounded-2xl my-5 shadow-lg shadow-[#1E3A8A]/15" loading="lazy" />`

const link = (href: string, text: string) =>
  `<a href="${href}" class="text-[#2F62D6] font-semibold hover:underline">${text}</a>`

// `.cera-page :where(h1, h2, h3)` sets heading ink after the utilities load, so
// white headings sit on an inner span.
const iceHero = (kicker: string, title: string, line: string) => `
  <div class="rounded-3xl bg-gradient-to-br from-[#10204F] via-[#1E3A8A] to-[#2F62D6] p-8 md:p-12 text-white shadow-xl">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[#C9DCFF]">${kicker}</p>
    <h2 class="text-4xl md:text-6xl font-extrabold leading-none mt-4"><span class="text-white">${title}</span></h2>
    <p class="text-lg text-[#C9DCFF] mt-5 max-w-2xl">${line}</p>
  </div>`

const stats = (items: [string, string][]) => `
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
    ${items.map(([value, label]) => `<div class="rounded-2xl border border-[#1E3A8A]/15 bg-[#F2F7FF] p-5 text-center">
      <p class="text-4xl font-extrabold text-[#1E3A8A]">${value}</p>
      <p class="text-sm text-gray-600 mt-1">${label}</p>
    </div>`).join('\n    ')}
  </div>`

const sebumChart = (title: string, before: string, after: string, note: string) => `
  <div class="mt-5 rounded-2xl bg-[#10204F] p-6 md:p-8 text-white">
    <p class="font-semibold text-[#C9DCFF]">${title}</p>
    <div class="mt-5 space-y-4">
      <div>
        <p class="text-sm text-[#C9DCFF] mb-2">${before}</p>
        <div class="h-5 w-full rounded-full bg-gradient-to-r from-[#F2C94C] to-[#F2994A]"></div>
      </div>
      <div>
        <p class="text-sm text-[#C9DCFF] mb-2">${after}</p>
        <div class="h-5 w-1/2 rounded-full bg-gradient-to-r from-[#C9DCFF] to-[#2F62D6]"></div>
      </div>
    </div>
    <p class="text-xs text-[#C9DCFF]/80 mt-5">${note}</p>
  </div>`

const formula = (rows: [string, string, string][]) => `
    <div class="mt-5 rounded-2xl bg-white p-5 shadow-sm border border-[#1E3A8A]/10">
      ${rows.map(([name, role, amount]) => `<div class="flex items-baseline justify-between gap-4 border-b border-[#1E3A8A]/10 py-3 last:border-0">
        <div><p class="font-semibold text-gray-900">${name}</p><p class="text-sm text-gray-600">${role}</p></div>
        <p class="font-bold text-[#1E3A8A] whitespace-nowrap">${amount}</p>
      </div>`).join('\n      ')}
    </div>`

const timeline = (steps: [string, string, string][]) => `
  <div class="mt-5 grid gap-4 md:grid-cols-4">
    ${steps.map(([time, title, body]) => `<div class="rounded-2xl border-t-4 border-[#2F62D6] bg-[#F2F7FF] p-5">
      <p class="text-xs font-bold uppercase tracking-widest text-[#2F62D6]">${time}</p>
      <p class="font-bold text-[#10204F] mt-2">${title}</p>
      <p class="text-sm text-gray-700 mt-2">${body}</p>
    </div>`).join('\n    ')}
  </div>`

const sizes = (cards: [string, string, string, string][]) => `
  <div class="mt-5 grid gap-4 sm:grid-cols-2">
    ${cards.map(([tag, size, title, body], i) => `<div class="rounded-2xl p-6 ${i === 0 ? 'bg-[#F2F7FF] border border-[#1E3A8A]/15' : 'bg-[#1E3A8A] text-white'}">
      <p class="text-xs font-bold uppercase tracking-widest ${i === 0 ? 'text-[#2F62D6]' : 'text-[#C9DCFF]'}">${tag}</p>
      <p class="text-5xl font-extrabold mt-2 ${i === 0 ? 'text-[#1E3A8A]' : 'text-white'}">${size}</p>
      <p class="font-bold mt-3 ${i === 0 ? 'text-[#10204F]' : 'text-white'}">${title}</p>
      <p class="text-sm mt-2 ${i === 0 ? 'text-gray-700' : 'text-[#C9DCFF]'}">${body}</p>
    </div>`).join('\n    ')}
  </div>`

const fit = (yesTitle: string, yes: string[], noTitle: string, no: string[]) => `
  <div class="mt-5 grid gap-4 md:grid-cols-2">
    <div class="rounded-2xl bg-[#F2F7FF] p-6">
      <p class="font-bold text-[#1E3A8A]">${yesTitle}</p>
      <ul class="mt-3 space-y-2 text-gray-700">${yes.map((l) => `<li>✓ ${l}</li>`).join('')}</ul>
    </div>
    <div class="rounded-2xl bg-gray-50 p-6">
      <p class="font-bold text-gray-900">${noTitle}</p>
      <ul class="mt-3 space-y-2 text-gray-700">${no.map((l) => `<li>→ ${l}</li>`).join('')}</ul>
    </div>
  </div>`

const faq = (items: [string, string][]) => `
  <dl class="mt-5 divide-y divide-[#1E3A8A]/10 rounded-2xl border border-[#1E3A8A]/10 bg-white">
    ${items.map(([q, a]) => `<div class="p-5"><dt class="font-bold text-[#10204F]">${q}</dt><dd class="text-gray-700 mt-2">${a}</dd></div>`).join('\n    ')}
  </dl>`

const videoBlock = (label: string) => `
  <div>
    <h3 class="text-2xl font-bold">${label}</h3>
    <div class="mt-5 mx-auto max-w-sm">
      <div class="flex justify-center rounded-3xl overflow-hidden shadow-xl shadow-[#1E3A8A]/25 bg-black">
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
  <div class="rounded-3xl bg-gradient-to-br from-[#10204F] to-[#1E3A8A] p-8 text-center text-white">
    <h3 class="text-3xl font-extrabold"><span class="text-white">${title}</span></h3>
    <p class="text-[#C9DCFF] mt-3 mb-6">${line}</p>
    <a href="${href}" class="inline-block rounded-full bg-white px-8 py-3 font-semibold text-[#1E3A8A]">${button}</a>
  </div>`

const contentEn = `<div class="max-w-4xl mx-auto space-y-10">
${iceHero('Intensive Problem Control Toner', 'OIL OFF.<br />COOL ON.', 'The toner for skin that shines by noon. It takes excess oil and sebum off, puts quick hydration straight back and lands cold.')}

  <div>
    <p class="text-lg text-gray-700">Gulf heat and humidity put oil on your face before lunch, and scrubbing it off only leaves skin tight. <a href="/products/15" class="text-[#2F62D6] font-semibold hover:underline">INTENSIVE PROBLEM CONTROL TONER</a> does it the other way round: zinc PCA 0.5% helps keep sebum in check, a 13.4% hydrating base keeps skin comfortable, and the SNOW ICE cooling complex takes the heat off the second it touches your skin.</p>
    <p class="text-gray-700 mt-3">Here is the whole campaign in twelve slides, and exactly how to use it.</p>
  </div>
${stats([
  ['0.5%', 'Zinc PCA for oil control'],
  ['13.4%', 'Hydrating base'],
  ['~50%', 'Less sebum after 4 weeks'],
  ['360°', 'The 200 ml sprays at any angle'],
])}

  <div>
    <h2 class="text-3xl font-bold">Shiny by noon?</h2>
    ${slide('en', 's2', 'Blemish-prone skin with a midday shine: shiny by noon?')}
    <p class="text-gray-700">You cleanse in the morning, and by midday your T-zone is back. That is the skin this toner is made for: it shines fast, clogs easily and breaks out now and then. One pass takes excess oil and sebum off, and quick hydration goes straight back in, so your skin feels fresh instead of stripped.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">About half the sebum. Four weeks.</h2>
    ${slide('en', 's3', 'Frosted cobalt glass with condensation: about 50% less sebum')}
    <p class="text-gray-700">This one is measured, not promised. In a four-week study of the finished toner, measured sebum fell by about half.</p>
${sebumChart('Measured sebum, finished toner', 'Before', 'After 4 weeks of use: about half', 'Four-week study of the finished formula, used morning and evening.')}
  </div>

  <div class="rounded-3xl bg-[#F2F7FF] p-6 md:p-8">
    <h2 class="text-3xl font-bold">Zinc PCA 0.5%. The engine.</h2>
    ${slide('en', 's4', 'A single drop on brushed zinc: zinc PCA 0.5%')}
    <p class="text-gray-700">Zinc PCA is the oil-control active for shiny skin, and here it sits at a working 0.5%, a real dose in every pass. Around it, a light hydrating base and three softeners keep the skin comfortable while the oil comes off.</p>
${formula([
  ['Zinc PCA', 'The oil-control active: helps keep sebum in check, pores looking cleaner', '0.5%'],
  ['Butylene glycol', 'Holds water in the skin without a heavy film', '5.4%'],
  ['Glycerin', 'The classic humectant, for comfort after cleansing', '5.0%'],
  ['Dipropylene glycol', 'Completes the 13.4% hydrating base', '3.0%'],
  ['Panthenol, allantoin, trehalose', 'Three softeners that keep skin calm and comfortable', '0.1% each'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Cool on contact.</h2>
    ${slide('en', 's5', 'A woman turning her face into a cold mist: cool on contact')}
    <p class="text-gray-700">The SNOW ICE cooling complex takes the heat off skin the moment the toner lands. It is the part you feel first: a cold, clean shock after a hot drive, a long day or a workout. The oil control is the zinc PCA; the cold is what makes you reach for it again.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Made not to clog.</h2>
    ${slide('en', 's6', 'Fingertips on a clear, matte cheek: made not to clog')}
    <p class="text-gray-700">Non-comedogenic, tested by QACS Ltd., so it has a low likelihood of clogging pores, and dermatologically tested. For skin that breaks out easily, that is the first box a toner has to tick.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Matte, not dry.</h2>
    ${slide('en', 's7', 'A water crown splash on cobalt: matte, not dry')}
    <p class="text-gray-700">Oil-control products have a reputation for leaving skin tight. This one is built on water: butylene glycol, glycerin and dipropylene glycol make up 13.4% of the formula and put moisture back as the oil comes off. Matte, fresh, never stripped.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Tea tree &amp; peppermint.</h2>
    ${slide('en', 's8', 'Tea tree, peppermint and rosemary on crushed ice')}
    <p class="text-gray-700">Tea tree, peppermint and rosemary join Anti Sebum P, a patented complex of four botanicals: elm root, kudzu root, evening primrose flower and longleaf pine leaf. Together they give the toner its fresh, clean finish and a herbal scent, so this is not a fragrance-free toner.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Back day.</h2>
    ${slide('en', 's9b', 'After the gym, a woman sprays the 200 ml toner upside down over her shoulder')}
    <p class="text-gray-700">Oil and breakouts don't stop at the jawline. The 200 ml mist sprays at any angle, even upside down, so after the gym you can reach your shoulders and back, the places no cotton pad gets to.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Soak. Press. 10 min.</h2>
    ${slide('en', 's10', 'Soaked cotton pads on the forehead and cheeks: soak, press, 10 minutes')}
    <p class="text-gray-700">For a longer cool-down, soak cotton pads, lay them on the skin and leave them for 5 to 10 minutes, then carry on with your routine. It is the fastest way to bring hot, shiny skin back down after a long day.</p>
  </div>
  ${videoBlock('Three ways to apply')}

  <div>
    <h2 class="text-3xl font-bold">Your day, in one bottle.</h2>
${timeline([
  ['Morning', 'After cleansing', 'Pad or mist over clean skin, avoiding the eyes. Then serum, cream and sunscreen.'],
  ['After the gym', 'Back day', 'Flip the 200 ml upside down for the neck, shoulders and back.'],
  ['Evening', 'Cleanse, tone, treat', 'A cotton pad swept along the skin, then the rest of your night routine.'],
  ['Hot days', 'Pad mask', 'Soaked pads for 5 to 10 minutes whenever your skin runs hot.'],
])}
    <p class="text-gray-700 mt-5">Follow it with the ${link('/products/20', 'Problem Control Serum')} and ${link('/products/30', 'Intensive Problem Control Cream')} for the full line. In the morning, finish with sunscreen: read why ${link(`/blog/${ULTRA}`, 'ULTRA SHIELD sets healthy boundaries')}.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Home. Clinic.</h2>
    ${slide('en', 's11', 'The 200 ml mist and the 500 ml pump on a block of ice')}
${sizes([
  ['Home', '200 ml', 'The 360° mist', 'Sprays at any angle, even upside down for the back. Made for every day.'],
  ['Clinic', '500 ml', 'The treatment-room pump', 'The same formula in a pump bottle, for pads and treatments. One formula.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Is it for you?</h2>
${fit(
  'Choose it if',
  ['Your skin gets shiny fast', 'Your pores clog easily and you get the occasional breakout', 'You want a light daily toner after cleansing', 'You like a mist for the face, neck or back'],
  'Choose something else if',
  ['You want an acid BHA peel: this is a daily toner, not a peel', 'You want an all-round hydrating toner: try SNOW BOOSTER', 'Your skin is broken or actively irritated: restore its comfort first'],
)}
    <p class="text-sm text-gray-600 mt-4">If your skin is sensitive, try it on a small area first. For external use only; avoid the eyes, and rinse with cool water if it gets in them.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Good to know.</h2>
${faq([
  ['Is it an acid BHA toner?', 'No. It is a daily oil-control toner built around zinc PCA 0.5%, not an exfoliating acid, so it suits morning and evening use.'],
  ['Which size should I choose?', '200 ml is the home size and sprays at any angle, even upside down. 500 ml is the pump bottle for the treatment room. The formula is the same.'],
  ['How is it different from SNOW BOOSTER?', 'This toner is for oil control and blemish-prone skin. SNOW BOOSTER is the all-round hydrating toner for everyday comfort.'],
  ['Does it treat acne?', 'It is a cosmetic toner for oil control and blemish-prone skin. For severe or persistent breakouts, see a dermatologist.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Stay matte. Stay cool.</h2>
    ${slide('en', 's12', 'INTENSIVE PROBLEM CONTROL TONER, 200 ml mist and 500 ml pump, on frosted white with ice')}
  </div>
${cta(
  'Oil off. Cool on.',
  'INTENSIVE PROBLEM CONTROL TONER · Zinc PCA 0.5% · non-comedogenic · dermatologically tested · made in Korea · 200 ml / 500 ml',
  '/products/15',
  'Shop the toner',
)}
</div>`

const contentRu = `<div class="max-w-4xl mx-auto space-y-10">
${iceHero('Intensive Problem Control Toner', 'МИНУС БЛЕСК.<br />ПЛЮС СВЕЖЕСТЬ.', 'Тоник для кожи, которая блестит уже к обеду. Он убирает избыток жира и себума, сразу возвращает увлажнение и дарит мгновенную прохладу.')}

  <div>
    <p class="text-lg text-gray-700">Жара и влажность Залива выводят жирный блеск на лицо ещё до обеда, а жёсткое очищение только стягивает кожу. <a href="/ru/products/15" class="text-[#2F62D6] font-semibold hover:underline">INTENSIVE PROBLEM CONTROL TONER</a> работает иначе: цинк PCA 0,5% помогает держать себум под контролем, увлажняющая база 13,4% сохраняет комфорт, а охлаждающий комплекс SNOW ICE снимает ощущение жара в момент нанесения.</p>
    <p class="text-gray-700 mt-3">Вся кампания в двенадцати слайдах, и как пользоваться тоником правильно.</p>
  </div>
${stats([
  ['0,5%', 'Цинк PCA для контроля жирности'],
  ['13,4%', 'Увлажняющая база'],
  ['≈50%', 'Меньше себума через 4 недели'],
  ['360°', 'Спрей 200 мл под любым углом'],
])}

  <div>
    <h2 class="text-3xl font-bold">Блестит к обеду?</h2>
    ${slide('ru', 's2', 'Кожа, склонная к несовершенствам, с дневным блеском: блестит к обеду?')}
    <p class="text-gray-700">Утром вы умылись, а к полудню Т-зона снова блестит. Именно для такой кожи создан этот тоник: она быстро жирнеет, поры легко забиваются, время от времени появляются высыпания. Одно нанесение убирает избыток жира и себума и сразу возвращает увлажнение, поэтому кожа ощущается свежей, а не стянутой.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Примерно вдвое меньше себума. Четыре недели.</h2>
    ${slide('ru', 's3', 'Запотевшее кобальтовое стекло с каплями: примерно на 50% меньше себума')}
    <p class="text-gray-700">Это измерено, а не обещано. В четырёхнедельном исследовании готового тоника измеренный уровень себума снизился примерно вдвое.</p>
${sebumChart('Измеренный себум, готовый тоник', 'До', 'Через 4 недели применения: примерно вдвое меньше', 'Четырёхнедельное исследование готовой формулы при применении утром и вечером.')}
  </div>

  <div class="rounded-3xl bg-[#F2F7FF] p-6 md:p-8">
    <h2 class="text-3xl font-bold">Цинк PCA 0,5%. Главный актив.</h2>
    ${slide('ru', 's4', 'Капля на шлифованном цинке: цинк PCA 0,5%')}
    <p class="text-gray-700">Цинк PCA — актив для контроля жирности блестящей кожи, и здесь он в рабочей концентрации 0,5%, реальная доза при каждом нанесении. Вокруг него лёгкая увлажняющая база и три смягчающих компонента сохраняют комфорт, пока уходит жир.</p>
${formula([
  ['Цинк PCA', 'Актив для контроля жирности: держит себум под контролем, поры выглядят чище', '0,5%'],
  ['Бутиленгликоль', 'Удерживает влагу без плотной плёнки', '5,4%'],
  ['Глицерин', 'Классический увлажнитель для комфорта после очищения', '5,0%'],
  ['Дипропиленгликоль', 'Дополняет увлажняющую базу до 13,4%', '3,0%'],
  ['Пантенол, аллантоин, трегалоза', 'Три смягчающих компонента для спокойной, комфортной кожи', 'по 0,1%'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Прохлада при касании.</h2>
    ${slide('ru', 's5', 'Девушка подставляет лицо холодному облаку спрея: прохлада при касании')}
    <p class="text-gray-700">Охлаждающий комплекс SNOW ICE снимает ощущение жара в момент нанесения. Это первое, что вы чувствуете: холодная чистая свежесть после жаркой дороги, долгого дня или тренировки. Жирность контролирует цинк PCA, а за прохладой к тонику хочется возвращаться.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Создан, чтобы не забивать поры.</h2>
    ${slide('ru', 's6', 'Кончики пальцев на чистой матовой щеке: создан, чтобы не забивать поры')}
    <p class="text-gray-700">Тоник некомедогенный, проверено QACS Ltd., поэтому вероятность закупорки пор низкая, и дерматологически протестирован. Для кожи, склонной к высыпаниям, это первое, чему должен соответствовать тоник.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Матово, но не сухо.</h2>
    ${slide('ru', 's7', 'Всплеск воды в форме короны на кобальтовом фоне: матово, но не сухо')}
    <p class="text-gray-700">Средства для контроля жирности часто стягивают кожу. Этот тоник построен на воде: бутиленгликоль, глицерин и дипропиленгликоль составляют 13,4% формулы и возвращают влагу, пока уходит жир. Матово, свежо и без стянутости.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Чайное дерево и мята.</h2>
    ${slide('ru', 's8', 'Чайное дерево, мята и розмарин на колотом льду')}
    <p class="text-gray-700">Чайное дерево, мята и розмарин работают вместе с Anti Sebum P, запатентованным комплексом из четырёх растений: корня вяза, корня пуэрарии, цветка энотеры и хвои длиннохвойной сосны. Вместе они дают свежий, чистый финиш и травяной аромат, поэтому это не тоник без запаха.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">День спины.</h2>
    ${slide('ru', 's9b', 'После тренировки девушка распыляет тоник 200 мл вверх дном через плечо')}
    <p class="text-gray-700">Жирность и высыпания не заканчиваются на линии подбородка. Спрей 200 мл работает под любым углом, даже вверх дном, поэтому после спортзала легко достать до плеч и спины, куда не дотянуться ватным диском.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Пропитать. Приложить. 10 минут.</h2>
    ${slide('ru', 's10', 'Пропитанные ватные диски на лбу и щеках: пропитать, приложить, 10 минут')}
    <p class="text-gray-700">Для долгого охлаждения пропитайте ватные диски, разложите их на коже и оставьте на 5-10 минут, затем продолжите уход. Самый быстрый способ вернуть разгорячённую, блестящую кожу в норму после долгого дня.</p>
  </div>
  ${videoBlock('Три способа нанесения')}

  <div>
    <h2 class="text-3xl font-bold">Весь день в одном флаконе.</h2>
${timeline([
  ['Утро', 'После очищения', 'Диском или спреем на чистую кожу, избегая глаз. Затем сыворотка, крем и санскрин.'],
  ['После спортзала', 'День спины', 'Переверните флакон 200 мл для шеи, плеч и спины.'],
  ['Вечер', 'Очищение, тоник, уход', 'Ватный диск по коже, затем остальной вечерний уход.'],
  ['Жаркие дни', 'Маска из дисков', 'Пропитанные диски на 5-10 минут, когда кожа разгорячена.'],
])}
    <p class="text-gray-700 mt-5">Продолжите уход ${link('/ru/products/20', 'сывороткой Problem Control')} и ${link('/ru/products/30', 'кремом Problem Control')}. Утром завершайте санскрином: читайте, почему ${link(`/ru/blog/${ULTRA}`, 'ULTRA SHIELD ставит здоровые границы')}.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Дом. Клиника.</h2>
    ${slide('ru', 's11', 'Спрей 200 мл и помпа 500 мл на ледяном блоке')}
${sizes([
  ['Дом', '200 мл', 'Спрей 360°', 'Распыляется под любым углом, даже вверх дном для спины. Для ежедневного ухода.'],
  ['Клиника', '500 мл', 'Помпа для кабинета', 'Та же формула во флаконе с помпой, для дисков и процедур. Одна формула.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Подходит ли он вам?</h2>
${fit(
  'Выбирайте его, если',
  ['Кожа быстро начинает блестеть', 'Поры легко забиваются и иногда появляются высыпания', 'Нужен лёгкий ежедневный тоник после очищения', 'Нравится спрей для лица, шеи или спины'],
  'Выберите другое, если',
  ['Нужен кислотный BHA-пилинг: это ежедневный тоник, а не пилинг', 'Нужен универсальный увлажняющий тоник: попробуйте SNOW BOOSTER', 'Кожа повреждена или раздражена: сначала верните ей комфорт'],
)}
    <p class="text-sm text-gray-600 mt-4">Если кожа чувствительная, сначала попробуйте на небольшом участке. Только для наружного применения; избегайте глаз, при попадании промойте прохладной водой.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">Что важно знать.</h2>
${faq([
  ['Это кислотный BHA-тоник?', 'Нет. Это ежедневный себорегулирующий тоник на основе цинка PCA 0,5%, а не отшелушивающая кислота, поэтому он подходит для утра и вечера.'],
  ['Какой объём выбрать?', '200 мл для домашнего ухода, распыляется под любым углом, даже вверх дном. 500 мл во флаконе с помпой для процедурного кабинета. Формула та же.'],
  ['Чем он отличается от SNOW BOOSTER?', 'Этот тоник для контроля жирности и кожи, склонной к несовершенствам. SNOW BOOSTER — универсальный увлажняющий тоник для ежедневного комфорта.'],
  ['Лечит ли тоник акне?', 'Это косметический тоник для контроля жирности и ухода за кожей, склонной к несовершенствам. При выраженных или стойких высыпаниях обратитесь к дерматологу.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">Матово. И свежо.</h2>
    ${slide('ru', 's12', 'INTENSIVE PROBLEM CONTROL TONER, спрей 200 мл и помпа 500 мл на заиндевевшем белом фоне со льдом')}
  </div>
${cta(
  'Минус блеск. Плюс свежесть.',
  'INTENSIVE PROBLEM CONTROL TONER · цинк PCA 0,5% · некомедогенный · дерматологически протестирован · сделано в Корее · 200 мл / 500 мл',
  '/ru/products/15',
  'Купить тоник',
)}
</div>`

const contentAr = `<div class="max-w-4xl mx-auto space-y-10" dir="rtl">
${iceHero('Intensive Problem Control Toner', 'وداعاً للمعان.<br />أهلاً بالانتعاش.', 'التونر للبشرة التي تلمع قبل الظهر. يزيل الدهون والزهم الزائدين، ويعيد الترطيب فوراً، ويلامس بشرتكِ ببرودة منعشة.')}

  <div>
    <p class="text-lg text-gray-700">حرارة الخليج ورطوبته تُظهر اللمعان على وجهكِ قبل الغداء، والتنظيف القاسي لا يترك إلا بشرة مشدودة. <a href="/ar/products/15" class="text-[#2F62D6] font-semibold hover:underline">INTENSIVE PROBLEM CONTROL TONER</a> يعمل بطريقة مختلفة: زنك PCA بنسبة 0.5% يساعد على ضبط الزهم، وقاعدة ترطيب بنسبة 13.4% تحافظ على راحة البشرة، ومركّب التبريد SNOW ICE يخفف الإحساس بالحرارة لحظة الملامسة.</p>
    <p class="text-gray-700 mt-3">الحملة كاملة في اثنتي عشرة شريحة، وكيف تستخدمينه بالطريقة الصحيحة.</p>
  </div>
${stats([
  ['0.5%', 'زنك PCA لتنظيم الدهون'],
  ['13.4%', 'قاعدة ترطيب'],
  ['≈50%', 'زهم أقل بعد 4 أسابيع'],
  ['360°', 'رذاذ 200 مل بأي زاوية'],
])}

  <div>
    <h2 class="text-3xl font-bold">تلمعين قبل الظهر؟</h2>
    ${slide('ar', 's2', 'بشرة معرّضة للشوائب يظهر عليها لمعان منتصف النهار: تلمعين قبل الظهر؟')}
    <p class="text-gray-700">تغسلين وجهكِ صباحاً، وعند الظهر تعود المنطقة التائية للمعان. هذه هي البشرة التي صُمم لها هذا التونر: تلمع بسرعة، وتنسد مسامها بسهولة، وتظهر عليها بثور من حين لآخر. مسحة واحدة تزيل الدهون والزهم الزائدين وتعيد الترطيب فوراً، فتشعرين ببشرة منتعشة لا مشدودة.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">زهم أقل بالنصف تقريباً. أربعة أسابيع.</h2>
    ${slide('ar', 's3', 'زجاج كوبالتي مغطى بالضباب وقطرات الماء: زهم أقل بنحو 50%')}
    <p class="text-gray-700">هذه نتيجة مقيسة، لا وعد. في دراسة لمدة أربعة أسابيع على التونر النهائي، انخفض الزهم المقاس إلى النصف تقريباً.</p>
${sebumChart('الزهم المقاس، التونر النهائي', 'قبل', 'بعد 4 أسابيع من الاستخدام: النصف تقريباً', 'دراسة لمدة أربعة أسابيع على التركيبة النهائية، باستخدام صباحي ومسائي.')}
  </div>

  <div class="rounded-3xl bg-[#F2F7FF] p-6 md:p-8">
    <h2 class="text-3xl font-bold">زنك PCA بنسبة 0.5%. المحرّك.</h2>
    ${slide('ar', 's4', 'قطرة واحدة على زنك مصقول: زنك PCA بنسبة 0.5%')}
    <p class="text-gray-700">زنك PCA هو المكوّن الفعّال لتنظيم الدهون في البشرة اللامعة، وهنا يأتي بنسبة فعّالة تبلغ 0.5%، جرعة حقيقية في كل مسحة. ومن حوله قاعدة ترطيب خفيفة وثلاثة مكوّنات مليّنة تحافظ على راحة البشرة بينما تزول الدهون.</p>
${formula([
  ['زنك PCA', 'المكوّن الفعّال لتنظيم الدهون: يضبط الزهم ويُظهر المسام أنظف', '0.5%'],
  ['بيوتيلين غليكول', 'يحفظ الماء في البشرة من دون طبقة ثقيلة', '5.4%'],
  ['غليسرين', 'المرطّب الكلاسيكي لراحة البشرة بعد التنظيف', '5.0%'],
  ['دايبروبيلين غليكول', 'يكمل قاعدة الترطيب إلى 13.4%', '3.0%'],
  ['بانثينول، ألانتوين، تريهالوز', 'ثلاثة مكوّنات مليّنة لبشرة هادئة ومرتاحة', '0.1% لكل منها'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">برودة من أول لمسة.</h2>
    ${slide('ar', 's5', 'امرأة تدير وجهها نحو رذاذ بارد: برودة من أول لمسة')}
    <p class="text-gray-700">يخفف مركّب التبريد SNOW ICE الإحساس بالحرارة لحظة ملامسة التونر للبشرة. إنه أول ما تشعرين به: انتعاش بارد ونظيف بعد قيادة حارة أو يوم طويل أو تمرين. زنك PCA هو من ينظّم الدهون، والبرودة هي ما يجعلكِ تعودين إليه.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">مصمم كي لا يسد المسام.</h2>
    ${slide('ar', 's6', 'أطراف الأصابع على خد صافٍ غير لامع: مصمم كي لا يسد المسام')}
    <p class="text-gray-700">غير مسبب لانسداد المسام، مختبر من QACS Ltd.، أي أن احتمال سد المسام منخفض، ومختبر جلدياً. وللبشرة المعرّضة للبثور، هذا أول شرط يجب أن يحققه أي تونر.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">مطفي، لا جاف.</h2>
    ${slide('ar', 's7', 'رذاذ ماء على شكل تاج فوق خلفية كوبالتية: مطفي لا جاف')}
    <p class="text-gray-700">منتجات تنظيم الدهون معروفة بأنها تترك البشرة مشدودة. أما هذا التونر فأساسه الماء: البيوتيلين غليكول والغليسرين والدايبروبيلين غليكول تشكّل 13.4% من التركيبة وتعيد الرطوبة بينما تزول الدهون. لمعان أقل، انتعاش أكثر، بلا شد.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">شجرة الشاي والنعناع.</h2>
    ${slide('ar', 's8', 'شجرة الشاي والنعناع وإكليل الجبل على ثلج مجروش')}
    <p class="text-gray-700">تنضم شجرة الشاي والنعناع وإكليل الجبل إلى Anti Sebum P، مركّب حاصل على براءة اختراع من أربعة نباتات: جذر الدردار وجذر الكودزو وزهرة الربيع المسائية وأوراق الصنوبر طويل الأوراق. معاً تمنح التونر إحساساً منعشاً ونظيفاً ورائحة عشبية، لذا فهو ليس تونراً خالياً من العطر.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ظهركِ أيضاً.</h2>
    ${slide('ar', 's9b', 'بعد التمرين، امرأة ترش تونر 200 مل مقلوباً فوق كتفها')}
    <p class="text-gray-700">الدهون والبثور لا تتوقف عند خط الفك. رذاذ 200 مل يعمل بأي زاوية، حتى مقلوباً، فبعد النادي الرياضي تصلين إلى كتفيكِ وظهركِ، حيث لا تصل قطعة القطن.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">بلّلي. ضعي. 10 دقائق.</h2>
    ${slide('ar', 's10', 'أقراص قطن مشبعة على الجبهة والخدين: بلّلي، ضعي، 10 دقائق')}
    <p class="text-gray-700">لتبريد أطول، بلّلي أقراص القطن وضعيها على البشرة واتركيها من 5 إلى 10 دقائق، ثم أكملي روتينكِ. أسرع طريقة لتهدئة البشرة الحارة اللامعة بعد يوم طويل.</p>
  </div>
  ${videoBlock('ثلاث طرق للاستخدام')}

  <div>
    <h2 class="text-3xl font-bold">يومكِ كله في عبوة واحدة.</h2>
${timeline([
  ['الصباح', 'بعد التنظيف', 'بقطعة قطن أو رذاذاً على البشرة النظيفة مع تجنب العينين. ثم السيروم والكريم وواقي الشمس.'],
  ['بعد النادي', 'ظهركِ أيضاً', 'اقلبي عبوة 200 مل للرقبة والكتفين والظهر.'],
  ['المساء', 'تنظيف، تونر، عناية', 'قطعة قطن تُمرَّر على البشرة، ثم بقية روتينكِ المسائي.'],
  ['الأيام الحارة', 'قناع الأقراص', 'أقراص مشبعة من 5 إلى 10 دقائق كلما شعرتِ بحرارة البشرة.'],
])}
    <p class="text-gray-700 mt-5">أكملي بـ${link('/ar/products/20', 'سيروم Problem Control')} و${link('/ar/products/30', 'كريم Problem Control')}. وفي الصباح اختمي بواقي الشمس: اقرئي لماذا ${link(`/ar/blog/${ULTRA}`, 'يضع ULTRA SHIELD حدوداً صحية')}.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">المنزل. العيادة.</h2>
    ${slide('ar', 's11', 'رذاذ 200 مل ومضخة 500 مل على كتلة من الثلج')}
${sizes([
  ['المنزل', '200 مل', 'رذاذ 360°', 'يرش بأي زاوية، حتى مقلوباً للظهر. للاستخدام اليومي.'],
  ['العيادة', '500 مل', 'مضخة غرفة العلاج', 'التركيبة نفسها في عبوة بمضخة، للأقراص والجلسات. تركيبة واحدة.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">هل يناسبكِ؟</h2>
${fit(
  'اختاريه إذا',
  ['تلمع بشرتكِ بسرعة', 'تنسد مسامكِ بسهولة وتظهر بثور من حين لآخر', 'تريدين تونراً يومياً خفيفاً بعد التنظيف', 'تحبين الرذاذ للوجه أو الرقبة أو الظهر'],
  'اختاري غيره إذا',
  ['تريدين تقشيراً حمضياً BHA: هذا تونر يومي وليس مقشّراً', 'تريدين تونر ترطيب شاملاً: جرّبي SNOW BOOSTER', 'بشرتكِ متضررة أو متهيجة: أعيدي إليها راحتها أولاً'],
)}
    <p class="text-sm text-gray-600 mt-4">إن كانت بشرتكِ حساسة، جرّبيه أولاً على مساحة صغيرة. للاستخدام الخارجي فقط؛ تجنبي العينين، واشطفيهما بماء بارد عند التلامس.</p>
  </div>

  <div>
    <h2 class="text-3xl font-bold">ما يهم معرفته.</h2>
${faq([
  ['هل هو تونر حمضي BHA؟', 'لا. إنه تونر يومي لتنظيم الدهون أساسه زنك PCA بنسبة 0.5%، وليس حمضاً مقشّراً، لذا يناسب الصباح والمساء.'],
  ['أي حجم أختار؟', '200 مل للاستخدام المنزلي ويرش بأي زاوية، حتى مقلوباً. 500 مل عبوة بمضخة لغرفة العلاج. التركيبة نفسها.'],
  ['ما الفرق بينه وبين SNOW BOOSTER؟', 'هذا التونر لتنظيم الدهون وللبشرة المعرّضة للشوائب. أما SNOW BOOSTER فتونر ترطيب لكل يوم.'],
  ['هل يعالج حب الشباب؟', 'إنه تونر تجميلي لتنظيم الدهون والعناية بالبشرة المعرّضة للشوائب. عند وجود بثور شديدة أو مستمرة، يُنصح بمراجعة طبيب الجلدية.'],
])}
  </div>

  <div>
    <h2 class="text-3xl font-bold">مطفية. ومنتعشة.</h2>
    ${slide('ar', 's12', 'INTENSIVE PROBLEM CONTROL TONER، رذاذ 200 مل ومضخة 500 مل على خلفية بيضاء مع الثلج')}
  </div>
${cta(
  'وداعاً للمعان. أهلاً بالانتعاش.',
  'INTENSIVE PROBLEM CONTROL TONER · زنك PCA بنسبة 0.5% · غير مسبب لانسداد المسام · مختبر جلدياً · صُنع في كوريا · 200 مل / 500 مل',
  '/ar/products/15',
  'تسوّقي التونر',
)}
</div>`

async function main() {
  const data = {
    title: 'Oil Off. Cool On: The Toner for Skin That Shines by Noon',
    slug: SLUG,
    excerpt:
      'Zinc PCA 0.5%, a 13.4% hydrating base and a cooling complex that lands cold. About half the sebum after four weeks, non-comedogenic, and a 200 ml mist that sprays upside down for back day. The whole campaign in twelve slides.',
    content: contentEn,
    featuredImage: `${IMG}/s1.jpg`,
    titleRu: 'Минус блеск. Плюс свежесть: тоник для кожи, которая блестит к обеду',
    excerptRu:
      'Цинк PCA 0,5%, увлажняющая база 13,4% и охлаждающий комплекс с мгновенной прохладой. Примерно вдвое меньше себума через четыре недели, некомедогенный, а спрей 200 мл работает вверх дном для спины. Вся кампания в двенадцати слайдах.',
    contentRu,
    titleAr: 'وداعاً للمعان. أهلاً بالانتعاش: التونر للبشرة التي تلمع قبل الظهر',
    excerptAr:
      'زنك PCA بنسبة 0.5%، وقاعدة ترطيب بنسبة 13.4%، ومركّب تبريد يلامس البشرة ببرودة. زهم أقل بالنصف تقريباً بعد أربعة أسابيع، غير مسبب لانسداد المسام، ورذاذ 200 مل يعمل مقلوباً للظهر. الحملة كاملة في اثنتي عشرة شريحة.',
    contentAr,
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'problem-control-toner',
      'oil-control',
      'blemish-prone-skin',
      'zinc-pca',
      'toner',
      'cooling',
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
