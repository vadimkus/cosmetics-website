/**
 * Creates or updates the trilingual (EN / RU / AR) editorial blog post for
 * EyeCell EYE PEPTIDE GEL PATCH (product 33), built around the Nov 2026
 * GENOSYS Bible 9.14 gallery refresh (s1-v2 .. s6-v2) and the Thermal Cool
 * campaign reel + FLIR visual assets.
 *
 * Claims strictly match components/product/eyepatch/eyepatchCopy.ts and
 * .cursor/rules/selling-tone.mdc:
 * - Calming and moisturizing the eye contour (take-off hydrogel eye mask)
 * - Korean dual-function cosmetic: Niacinamide 2% (brightening) + Adenosine 0.04% (wrinkle care)
 * - Body heat softens the hydrogel; moisture displaces heat so the contour cools
 * - Chondrus crispus hydrogel matrix, Glycerin, Carob Gum, Panthenol, Allantoin
 * - pH 6.85 (within a 5.50-7.50 specification), Dermatologically tested, Made in Korea
 * - 101 g / 60 patches / 30 applications, 20-40 minutes, under eyes and/or brow bones
 * - Wide spoon + inner seal lid included
 * - No "patented", no "transdermal delivery", no "eye-bag relief", no "firming",
 *   no dossier vocabulary, no trace-active hype, no prices.
 *
 * Push & deploy media + this script before running so every image/video URL
 * returns 200 and Tailwind compiles every utility class used in the markup.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/create-eyecell-thermal-cool-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'eyecell-36-6-to-cool-hydrogel-eye-patches'
const IMG = '/images/patch'
const COVER = `${IMG}/s1-v2.jpg`
const VIDEO = '/videos/eyecell-thermal-cool-reel-web.mp4'
const POSTER = `${IMG}/thermal-cool-poster.jpg`

const IG = {
  reel: 'https://www.instagram.com/genosys.uae/reel/DgIBJhUKH9J/',
  proof: 'https://www.instagram.com/genosys.uae/p/DgIBXViEUhv/',
  product: 'https://www.instagram.com/genosys.uae/p/DgIAjMLEVBd/',
}

type Locale = 'en' | 'ru' | 'ar'
const prefix = (locale: Locale) => (locale === 'en' ? '' : `/${locale}`)
const L = (s: string) => `<span dir="ltr">${s}</span>`

const imgCard = (file: string, alt: string, dark = false) =>
  `<img src="${IMG}/${file}" alt="${alt}" width="1200" height="1200" class="w-full h-auto rounded-2xl ${dark ? 'shadow-2xl shadow-black/50 ring-1 ring-white/10' : 'shadow-lg shadow-slate-900/10'}" loading="lazy" />`

const link = (href: string, text: string) =>
  `<a href="${href}" class="text-slate-900 font-semibold underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900">${text}</a>`

const p = (text: string, dark = false) =>
  `<p class="${dark ? 'text-slate-300' : 'text-gray-700'} mt-4 leading-relaxed">${text}</p>`

const hero = (kicker: string, title: string, line: string) => `
  <div class="rounded-3xl border border-slate-200/80 p-8 md:p-12" style="background: linear-gradient(135deg, #F3F6FA 0%, #E5EBF3 100%);">
    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">${kicker}</p>
    <h2 class="text-4xl md:text-6xl leading-[0.98] mt-4 text-[#323132]"><span class="font-light">${title}</span></h2>
    <p class="text-lg text-slate-700 mt-6 max-w-2xl leading-relaxed">${line}</p>
  </div>`

const thermalShowcase = (
  eyebrow: string,
  heading: string,
  bodyHtml: string,
  eyeAlt: string,
  videoTitle: string,
  videoLead: string
) => `
  <div class="rounded-3xl p-6 md:p-10 text-white space-y-10" style="background: linear-gradient(155deg, #050814 0%, #0A1328 55%, #0F2042 100%);">
    <div class="grid items-center gap-6 md:grid-cols-2 md:gap-10">
      <div class="mx-auto w-full max-w-sm">${imgCard('thermal-cool-eye.jpg', eyeAlt, true)}</div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.26em] text-sky-300">${eyebrow}</p>
        <h2 class="text-3xl md:text-4xl font-light leading-tight text-white mt-3">${heading}</h2>
        ${bodyHtml}
      </div>
    </div>
    <div class="border-t border-white/10 pt-8">
      <h3 class="text-2xl md:text-3xl font-light text-white text-center">${videoTitle}</h3>
      <p class="text-slate-300 mt-3 text-center max-w-xl mx-auto leading-relaxed">${videoLead}</p>
      <div class="mt-6 mx-auto max-w-sm">
        <div class="flex justify-center rounded-3xl overflow-hidden shadow-2xl shadow-black/60 bg-black ring-1 ring-white/15">
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
    </div>
  </div>`

const feature = (
  file: string,
  alt: string,
  heading: string,
  body: string,
  tone: 'ice' | 'white' | 'mist',
  reverse = false
) => {
  const bgStyle =
    tone === 'ice'
      ? 'background: linear-gradient(135deg, #F1F5F9 0%, #E6ECF4 100%);'
      : tone === 'mist'
        ? 'background: #F6F8FB;'
        : 'background: #FFFFFF;'
  const borderClass = tone === 'white' ? 'border border-slate-200/80' : ''
  const mediaCol = `<div class="mx-auto w-full max-w-sm ${reverse ? 'md:order-2' : ''}">${imgCard(file, alt)}</div>`
  const textCol = `<div class="${reverse ? 'md:order-1' : ''}"><h2 class="text-3xl font-light leading-tight text-[#323132]">${heading}</h2>${body}</div>`
  return `
  <div class="grid items-center gap-6 rounded-3xl ${borderClass} p-5 md:grid-cols-2 md:gap-10 md:p-8" style="${bgStyle}">
    ${mediaCol}
    ${textCol}
  </div>`
}

const stats = (items: [string, string][]) => `
  <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
    ${items
      .map(
        ([value, label]) => `<div class="rounded-2xl border border-slate-200 bg-[#F4F7FA] p-5 text-center">
      <p class="text-3xl md:text-4xl font-light text-[#323132]" dir="ltr">${value}</p>
      <p class="text-sm text-slate-600 mt-2">${label}</p>
    </div>`
      )
      .join('\n    ')}
  </div>`

const ritualBlock = (
  heading: string,
  lead: string,
  altFan: string,
  altSpoon: string,
  items: [string, string, string][]
) => `
  <div class="rounded-3xl p-6 md:p-10 border border-slate-200/80" style="background: linear-gradient(135deg, #F4F7FB 0%, #EAEFF6 100%);">
    <h2 class="text-3xl font-light text-[#323132]">${heading}</h2>
    <p class="text-gray-700 mt-3 max-w-2xl leading-relaxed">${lead}</p>
    <div class="mt-6 grid gap-5 sm:grid-cols-2">
      ${imgCard('s5-v2.jpg', altFan)}
      ${imgCard('eyecell-spoon-droplet.jpg', altSpoon)}
    </div>
    <ol class="mt-7 grid gap-4 sm:grid-cols-3">
      ${items
        .map(
          ([n, title, body]) => `<li class="rounded-2xl bg-white p-5 shadow-sm border border-slate-200/70">
        <p class="text-4xl font-light text-slate-400" dir="ltr">${n}</p>
        <p class="font-semibold text-[#323132] mt-2">${title}</p>
        <p class="text-sm text-gray-700 mt-2 leading-relaxed">${body}</p>
      </li>`
        )
        .join('\n      ')}
    </ol>
  </div>`

const fit = (yesTitle: string, yes: string[], noTitle: string, no: string[]) => `
  <div class="mt-5 grid gap-4 md:grid-cols-2">
    <div class="rounded-2xl border border-slate-200 bg-[#F4F7FA] p-6">
      <p class="font-semibold text-[#323132]">${yesTitle}</p>
      <ul class="mt-3 space-y-2 text-gray-700">${yes.map((line) => `<li>✓ ${line}</li>`).join('')}</ul>
    </div>
    <div class="rounded-2xl border border-slate-200/70 bg-white p-6">
      <p class="font-semibold text-[#323132]">${noTitle}</p>
      <ul class="mt-3 space-y-2 text-gray-700">${no.map((line) => `<li>→ ${line}</li>`).join('')}</ul>
    </div>
  </div>`

const faq = (items: [string, string][]) => `
  <dl class="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
    ${items
      .map(
        ([q, a]) =>
          `<div class="p-5"><dt class="font-semibold text-[#323132]">${q}</dt><dd class="text-gray-700 mt-2 leading-relaxed">${a}</dd></div>`
      )
      .join('\n    ')}
  </dl>`

const instagram = (title: string, line: string, items: [string, string][]) => `
  <div class="rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
    <h2 class="text-2xl font-light text-[#323132]">${title}</h2>
    <p class="text-gray-700 mt-2">${line}</p>
    <div class="mt-5 flex flex-wrap gap-3">
      ${items
        .map(
          ([href, label]) =>
            `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-block rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-[#323132] hover:bg-slate-100">${label}</a>`
        )
        .join('\n      ')}
    </div>
  </div>`

const closerCta = (
  altCloser: string,
  title: string,
  line: string,
  buttons: [string, string][]
) => `
  <div class="grid items-center gap-8 rounded-3xl border border-slate-200/90 p-6 md:grid-cols-2 md:p-10" style="background: linear-gradient(135deg, #EEF2F7 0%, #E1E8F1 100%);">
    <div class="mx-auto w-full max-w-sm">${imgCard('s6-v2.jpg', altCloser)}</div>
    <div>
      <h2 class="text-3xl md:text-5xl leading-[1.02] text-[#323132]"><span class="font-light">${title}</span></h2>
      <p class="text-slate-700 mt-4 mb-7 leading-relaxed">${line}</p>
      <div class="flex flex-wrap gap-3">
        ${buttons
          .map(
            ([href, label], i) =>
              `<a href="${href}" class="inline-block rounded-full ${
                i === 0
                  ? 'bg-[#323132] text-white hover:bg-slate-800'
                  : 'border border-[#323132] text-[#323132] hover:bg-white'
              } px-6 py-3 text-sm font-semibold">${label}</a>`
          )
          .join('\n        ')}
      </div>
    </div>
  </div>`

const noteFooter = (title: string, body: string) => `
  <div class="text-sm text-gray-500 border-t border-slate-200 pt-5">
    <p class="font-semibold text-gray-600">${title}</p>
    <p class="mt-2 leading-relaxed">${body}</p>
  </div>`

// ─── English ────────────────────────────────────────────────────────────────
const en = (): string => {
  const l = prefix('en')
  return `<div class="max-w-4xl mx-auto space-y-10">
${hero(
  'GENOSYS · EYECELL EYE PEPTIDE GEL PATCH',
  '36.6 °C<br />TO COOL.',
  'Body heat softens the hydrogel. Moisture displaces heat, so the eye contour cools. Inside the new clinical campaign — the physics, the verified actives, and the quiet twenty-minute ritual.'
)}

  <div>
    <p class="text-lg text-gray-700 leading-relaxed">The eye contour is where long screens, dry air-conditioning, late nights, and clinic recovery show up first. Rich creams often sit heavy on thin under-eye skin or migrate into the lashes. A true take-off hydrogel eye mask works differently: it starts with contact physics — cool, water-rich gel meeting 36.6 °C skin — and follows with Korea’s classic brightening and wrinkle-care pairing.</p>
  </div>

${thermalShowcase(
  'THERMAL VIEW · HEAT TO COOL',
  'When 36.6 °C skin meets a water-rich hydrogel.',
  p(
    'Thermal imaging makes visible what you immediately feel on the skin. Skin around the eye sits near body temperature; the translucent hydrogel crescent arrives cool and moisture-dense.',
    true
  ) +
    p(
      'As body heat gently softens the Chondrus crispus hydrogel matrix, the patch moulds flush against the contour. Surface moisture draws away heat so the under-eye area feels noticeably calmer, lighter, and hydrated — without a single drop of heavy oil.',
      true
    ),
  'Thermal view of a cool blue EyeCell hydrogel crescent resting under a warm eye contour',
  'Watch the 31-second film: 36.6 °C to Cool.',
  'From thermal heat to crystal-clear hydrogel contact — watch the full campaign reel for EyeCell EYE PEPTIDE GEL PATCH.'
)}

${feature(
  's2-v2.jpg',
  'Two clear EyeCell hydrogel crescents in crisp studio daylight explaining how body heat softens the gel',
  'Why hydrogel feels nothing like a sheet mask.',
  p(
    'Paper and cotton eye pads dry from the outside in. Leave them on too long and they feel stiff or pull moisture back out of the surface.'
  ) +
    p(
      'EyeCell EYE PEPTIDE GEL PATCH is cast as a solid, crystal-clear hydrogel built from Chondrus crispus (red algae), carob gum, and glycerin. Warmth from your skin softens the crescent into close, even contact so hydration stays sealed against the contour for the full 20–40 minutes.'
    ),
  'ice'
)}

${stats([
  ['2%', 'Niacinamide · brightening'],
  ['0.04%', 'Adenosine · wrinkle care'],
  ['pH 6.85', 'Eye-contour balanced'],
  ['60 / 30', 'Patches · applications'],
])}

${feature(
  's4-v2.jpg',
  'EyeCell Eye Peptide Gel Patch proof card showing 2% Niacinamide, 0.04% Adenosine, and pH 6.85',
  'Inside the hydrogel: real numbers, zero noise.',
  p(
    'Korea licenses this single formula as a dual-function cosmetic for both brightening and wrinkle care, anchored by <strong>Niacinamide 2%</strong> and <strong>Adenosine 0.04%</strong>.'
  ) +
    p(
      'Around that core sit <strong>Panthenol</strong> and <strong>Allantoin</strong> to cushion and soothe delicate skin, alongside supporting Centella asiatica and Acetyl Hexapeptide-8. Balanced at <strong>pH 6.85</strong> (within a 5.50–7.50 specification), dermatologically tested, and Made in Korea.'
    ),
  'white',
  true
)}

${feature(
  's3-v2.jpg',
  'Close-up editorial portrait wearing a clear translucent EyeCell hydrogel patch under the eye',
  'One quiet twenty-minute step.',
  p(
    'Put a pair on after cleansing and toning, then let them stay put while you read, answer messages, or unwind after a flight. The translucent crescent sits light and clear — no white cast, no slipping, no sting.'
  ) +
    p(
      'After 20 to 40 minutes, lift the patches off and lightly pat any remaining clear essence into the skin. No rinse needed — move straight into your daily eye serum and cream.'
    ),
  'mist'
)}

${ritualBlock(
  'Sixty patches. Thirty rituals. Spoon and inner seal inside.',
  'Each 101 g jar holds 60 translucent hydrogel crescents stacked in a clean fan, protected by a snap-down inner seal lid and paired with a wide crescent spoon so you never dip fingers into the jar.',
  'Macro view of sixty layered translucent EyeCell hydrogel patches fanned inside the black jar',
  'Open black EyeCell jar with the wide clear spoon lifting one crystal hydrogel crescent and a glistening droplet',
  [
    [
      '01',
      'Lift clean with the spoon',
      'Start on freshly cleansed, toned skin. Use the wide enclosed spoon to separate two crescents cleanly from the stack.',
    ],
    [
      '02',
      'Place under eyes — or brow bones',
      'Smooth one pair under the eyes. For intensive comfort, add a second pair along the brow bones. Leave on for 20–40 minutes.',
    ],
    [
      '03',
      'Remove, tap, and seal tight',
      'Take the patches off and pat remaining essence gently into the skin. Press the inner seal lid firmly shut so patch #60 stays as fresh as patch #1.',
    ],
  ]
)}

  <div>
    <h2 class="text-3xl font-light text-[#323132]">Is it the right step for you?</h2>
${fit(
  'Made for you if',
  [
    'Your eye contour feels warm, fatigued, or dry from screens, flights, or UAE air-conditioning.',
    'You want a clean take-off mask that calms and moisturizes while delivering Korean brightening (Niacinamide 2%) and wrinkle-care (Adenosine 0.04%) actives.',
    'You want soothing under-eye comfort after professional clinic care, as directed by your specialist.',
    'You want a 30-use jar with an inner seal lid and wide spoon built for hygienic daily or weekly use.',
  ],
  'Look elsewhere if',
  [
    `You want a leave-on daily treatment to wear under makeup — layer ${link(`${l}/products/17`, 'EyeCell EYE CONTOUR SERUM')} and ${link(`${l}/products/24`, 'EyeCell EYE CONTOUR CREAM')} instead (or right after the patch).`,
    'You have known sensitivity to occlusive hydrogel masks, compresses, or bandages.',
    'You expect an overnight leave-on patch — this is a 20–40 minute take-off mask.',
  ]
)}
  </div>

  <div>
    <h2 class="text-3xl font-light text-[#323132]">Good to know.</h2>
${faq([
  [
    'How long should I leave EyeCell patches on?',
    '20 to 40 minutes is the sweet spot. Remove them once the ritual is done and gently pat any remaining essence into the skin — do not sleep in them overnight.',
  ],
  [
    'Can I use them on more than just the under-eye area?',
    'Yes. Place one pair under the eyes, and optionally add a second pair along the brow bones whenever you want more intensive calming comfort.',
  ],
  [
    'Should I store the jar in the fridge?',
    'Cool, dry storage away from direct heat is all that is required. Always press the inner seal lid firmly shut and twist the outer cap tight so the essence stays sealed inside.',
  ],
  [
    'Do I rinse after removing the patches?',
    'No. Gently tap the light remaining essence around the eye contour until absorbed, then seal in hydration with your eye serum and eye cream.',
  ],
  [
    'How does it fit into the full EyeCell routine?',
    `Use it 2–3 times a week (or whenever your eye area needs cooling recovery): cleanse and tone, wear ${link(`${l}/products/33`, 'EyeCell EYE PEPTIDE GEL PATCH')} for 20–40 minutes, then finish with ${link(`${l}/products/17`, 'EyeCell EYE CONTOUR SERUM')} and ${link(`${l}/products/24`, 'EyeCell EYE CONTOUR CREAM')}.`,
  ],
])}
  </div>

${instagram(
  'From the @genosys.uae campaign',
  'This article brings together the new product gallery and the full EyeCell Thermal Cool row live on Instagram.',
  [
    [IG.reel, 'Watch the Reel on Instagram'],
    [IG.proof, 'Proof Carousel: 36.6 °C to Cool'],
    [IG.product, 'Product Carousel: Cool. Calm.'],
  ]
)}

${closerCta(
  'EyeCell Eye Peptide Gel Patch closer card showing the black jar on cool light surface',
  'COOL.<br />CALM.',
  'EyeCell EYE PEPTIDE GEL PATCH · 101 g · 60 patches · 30 applications · Niacinamide 2% · Adenosine 0.04% · pH 6.85 · Dermatologically tested · Made in Korea.',
  [
    [`${l}/products/33`, 'Shop EyeCell Gel Patch'],
    [`${l}/products/17`, 'Eye Contour Serum'],
    [`${l}/products/24`, 'Eye Contour Cream'],
  ]
)}

${noteFooter(
  'Care & guidance',
  'External cosmetic use only. Avoid direct contact with the eyes; rinse with cool water if contact occurs. Stop use if redness, swelling, or irritation appears. Use caution if you are sensitive to compresses or bandages. Keep out of reach of children and store cool and dry.'
)}
</div>`
}

// ─── Russian ────────────────────────────────────────────────────────────────
const ru = (): string => {
  const l = prefix('ru')
  return `<div class="max-w-4xl mx-auto space-y-10">
${hero(
  'GENOSYS · EYECELL EYE PEPTIDE GEL PATCH',
  'ОТ 36,6 °C<br />К ПРОХЛАДЕ.',
  'Тепло кожи мягко размягчает гидрогель, а влага отводит избыточное тепло — и зона вокруг глаз ощущает прохладу. Внутри новой клинической кампании: физика контакта, точные проценты активов и спокойный 20-минутный ритуал.'
)}

  <div>
    <p class="text-lg text-gray-700 leading-relaxed">Тонкая кожа вокруг глаз первой реагирует на долгий день перед экраном, сухой кондиционированный воздух, перелёты и восстановление после процедур. Плотные кремы часто ложатся тяжело или затекают к ресницам. Смываемая или съёмная гидрогелевая маска-патч работает иначе: сначала включается физика контакта — насыщенный влагой гель на тёплой коже 36,6 °C — а затем корейская пара активов для сияния и ухода за мелкими морщинами.</p>
  </div>

${thermalShowcase(
  'ТЕПЛОВИЗИОННЫЙ ВЗГЛЯД · ОТ ТЕПЛА К ПРОХЛАДЕ',
  'Когда кожа 36,6 °C встречает влажный гидрогель.',
  p(
    'Тепловизионный кадр делает видимым то, что вы мгновенно чувствуете на коже. Контур вокруг глаз имеет температуру тела, а прозрачный полумесяц гидрогеля ложится прохладным и насыщенным влагой.',
    true
  ) +
    p(
      'Под воздействием тепла кожи матрица гидрогеля на основе красных водорослей Chondrus crispus становится ещё мягче и плотнее прилегает к контуру. Влага отводит тепло с поверхности — кожа ощущается спокойной, свежей и увлажнённой без тяжёлой масляной плёнки.',
      true
    ),
  'Тепловизионное изображение прохладного синего гидрогелевого патча EyeCell под глазом',
  'Смотрите 31-секундный ролик: от 36,6 °C к прохладе.',
  'От тепла кожи до кристально чистого контакта гидрогеля — полный ролик новой кампании EyeCell EYE PEPTIDE GEL PATCH.'
)}

${feature(
  's2-v2.jpg',
  'Два прозрачных гидрогелевых патча EyeCell в чистом дневном свете',
  'Почему гидрогель не похож на тканевые патчи.',
  p(
    'Бумажные и тканевые патчи быстро подсыхают снаружи — если передержать их, они начинают стягивать кожу.'
  ) +
    p(
      'EyeCell EYE PEPTIDE GEL PATCH — это цельный прозрачный гидрогель на основе Chondrus crispus, камеди рожкового дерева и глицерина. Тепло тела мягко адаптирует патч к изгибу под глазом и удерживает влагу у поверхности кожи на протяжении всех 20–40 минут.'
    ),
  'ice'
)}

${stats([
  ['2%', 'Ниацинамид · сияние'],
  ['0.04%', 'Аденозин · уход за морщинами'],
  ['pH 6.85', 'Комфортный pH для зоны глаз'],
  ['60 / 30', 'Патчей · применений'],
])}

${feature(
  's4-v2.jpg',
  'Карточка формулы EyeCell Eye Peptide Gel Patch: 2% ниацинамид, 0.04% аденозин, pH 6.85',
  'Внутри гидрогеля: точные цифры без лишнего шума.',
  p(
    'В Корее эта формула зарегистрирована сразу по двум функциональным направлениям — осветление и уход против морщин — благодаря рабочим концентрациям <strong>Ниацинамида 2%</strong> и <strong>Аденозина 0,04%</strong>.'
  ) +
    p(
      'Их дополняют <strong>пантенол</strong> и <strong>аллантоин</strong> для мягкого успокаивающего комфорта, а также центелла азиатская и ацетил гексапептид-8. Формула сбалансирована на уровне <strong>pH 6,85</strong> (в пределах 5,50–7,50), дерматологически протестирована и произведена в Корее.'
    ),
  'white',
  true
)}

${feature(
  's3-v2.jpg',
  'Крупный портрет с прозрачным гидрогелевым патчем EyeCell под глазом',
  'Один спокойный шаг на 20 минут.',
  p(
    'Нанесите пару патчей после очищения и тонера — и спокойно читайте, отвечайте на сообщения или отдыхайте после перелёта. Прозрачный полумесяц ощущается невесомым, не оставляет белого налёта и не сползает.'
  ) +
    p(
      'Через 20–40 минут снимите патчи и мягко вбейте остаток прозрачной эссенции подушечками пальцев. Смывать не нужно — сразу переходите к сыворотке и крему для области вокруг глаз.'
    ),
  'mist'
)}

${ritualBlock(
  'Шестьдесят патчей. Тридцать ритуалов. Лопатка и мембрана внутри.',
  'В каждой банке 101 г — 60 прозрачных гидрогелевых полумесяцев, аккуратно уложенных веером, плотная внутренняя защитная мембрана и широкая прозрачная лопатка для гигиеничного извлечения.',
  'Макросъёмка 60 прозрачных гидрогелевых патчей EyeCell внутри чёрной банки',
  'Открытая банка EyeCell и широкая прозрачная лопатка, поднимающая прозрачный патч с каплей эссенции',
  [
    [
      '01',
      'Достаньте лопаткой',
      'Начните с очищенной и тонизированной кожи. Широкой лопаткой из комплекта аккуратно отделите пару патчей, не касаясь эссенции пальцами.',
    ],
    [
      '02',
      'Нанесите на 20–40 минут',
      'Разгладьте патчи под глазами. Для более интенсивного ухода можно добавить вторую пару вдоль надбровных дуг. Оставьте на 20–40 минут.',
    ],
    [
      '03',
      'Снимите и плотно закройте',
      'Снимите патчи, мягко вбейте остаток эссенции и плотно прижмите внутреннюю мембрану, чтобы 60-й патч оставался таким же влажным, как первый.',
    ],
  ]
)}

  <div>
    <h2 class="text-3xl font-light text-[#323132]">Подойдёт ли этот шаг именно вам?</h2>
${fit(
  'Идеально подойдёт, если',
  [
    'Кожа вокруг глаз ощущается усталой, тёплой или сухой от экранов, перелётов и кондиционеров.',
    'Вам нужна чистая съёмная маска, которая успокаивает, увлажняет и даёт проверенные корейские активы: ниацинамид 2% и аденозин 0,04%.',
    'Нужен мягкий охлаждающий комфорт после профессиональных процедур (по рекомендации специалиста).',
    'Цените гигиеничный формат: 30 применений, широкая лопатка и плотная внутренняя крышка-мембрана.',
  ],
  'Посмотрите другой шаг, если',
  [
    `Ищете несмываемый ежедневный уход под макияж — используйте ${link(`${l}/products/17`, 'EyeCell EYE CONTOUR SERUM')} и ${link(`${l}/products/24`, 'EyeCell EYE CONTOUR CREAM')} (или наносите их сразу после патчей).`,
    'Есть индивидуальная чувствительность к окклюзионным гидрогелевым маскам или пластырям.',
    'Нужны патчи на всю ночь — эта маска рассчитана строго на 20–40 минут.',
  ]
)}
  </div>

  <div>
    <h2 class="text-3xl font-light text-[#323132]">Частые вопросы.</h2>
${faq([
  [
    'Сколько минут держать патчи EyeCell?',
    'Оптимальное время — от 20 до 40 минут. После этого снимите патчи и мягко вбейте остаток эссенции. Оставлять их на всю ночь не нужно.',
  ],
  [
    'Можно ли наносить их на область над бровями?',
    'Да. Основную пару размещают под глазами, а при желании вторую пару можно положить вдоль надбровных дуг для интенсивного успокаивающего ухода.',
  ],
  [
    'Нужно ли хранить банку в холодильнике?',
    'Достаточно хранить в прохладном сухом месте вдали от жары. Главное — плотно закрывать внутреннюю мембрану и внешнюю крышку после каждого использования.',
  ],
  [
    'Нужно ли умываться после снятия патчей?',
    'Нет. Лёгкий остаток эссенции мягко вбивается в кожу, после чего можно сразу нанести сыворотку и крем для век.',
  ],
  [
    'Как встроить патчи в полную систему EyeCell?',
    `Используйте 2–3 раза в неделю или по необходимости: очищение и тонер → ${link(`${l}/products/33`, 'EyeCell EYE PEPTIDE GEL PATCH')} на 20–40 минут → ${link(`${l}/products/17`, 'EyeCell EYE CONTOUR SERUM')} → ${link(`${l}/products/24`, 'EyeCell EYE CONTOUR CREAM')}.`,
  ],
])}
  </div>

${instagram(
  'Кампания в @genosys.uae',
  'Эта статья объединяет обновлённую галерею на сайте и новую серию постов EyeCell Thermal Cool в Instagram.',
  [
    [IG.reel, 'Смотреть Reels в Instagram'],
    [IG.proof, 'Карусель Proof: от 36,6 °C к прохладе'],
    [IG.product, 'Карусель Product: Cool. Calm.'],
  ]
)}

${closerCta(
  'Финальный слайд EyeCell Eye Peptide Gel Patch с чёрной банкой в холодном студийном свете',
  'ПРОХЛАДА.<br />СПОКОЙСТВИЕ.',
  'EyeCell EYE PEPTIDE GEL PATCH · 101 г · 60 патчей · 30 применений · Ниацинамид 2% · Аденозин 0,04% · pH 6,85 · Дерматологически протестировано · Сделано в Корее.',
  [
    [`${l}/products/33`, 'Перейти к патчам EyeCell'],
    [`${l}/products/17`, 'Сыворотка для век EyeCell'],
    [`${l}/products/24`, 'Крем для век EyeCell'],
  ]
)}

${noteFooter(
  'Рекомендации и меры предосторожности',
  'Только для наружного косметического применения. Избегайте прямого попадания в глаза; при попадании промойте прохладной водой. Прекратите использование при появлении покраснения или раздражения. Храните в прохладном сухом месте, недоступном для детей.'
)}
</div>`
}

// ─── Arabic (RTL) ───────────────────────────────────────────────────────────
const ar = (): string => {
  const l = prefix('ar')
  return `<div class="max-w-4xl mx-auto space-y-10" dir="rtl">
${hero(
  `GENOSYS · ${L('EYECELL EYE PEPTIDE GEL PATCH')}`,
  `من ${L('36.6 °C')}<br />إلى الانتعاش.`,
  'تليّن حرارة البشرة الهيدروجيل برفق، وتُزيح الرطوبة الحرارة ليهدأ محيط العينين ويشعر بالبرودة. داخل الحملة السريرية الجديدة: فيزياء التلامس، التركيزات الموثّقة، وروتين العشرين دقيقة الهادئ.'
)}

  <div>
    <p class="text-lg text-gray-700 leading-relaxed">محيط العينين هو أوّل ما يعكس ساعات الشاشات الطويلة وهواء التكييف الجاف والسفر وفترات التعافي بعد العناية التجميلية. كثيراً ما تشعر الكريمات الثقيلة بالثقل على هذه البشرة الرقيقة. يعمل قناع الهيدروجيل القابل للإزالة بأسلوب مختلف: يبدأ بفيزياء التلامس — جل غني بالماء يلتقي ببشرة بدرجة ${L('36.6 °C')} — ويتبعه الثنائي الكوري الكلاسيكي للتفتيح والعناية بالخطوط الدقيقة.</p>
  </div>

${thermalShowcase(
  'نظرة حرارية · من الدفء إلى البرودة',
  `عندما تلتقي بشرة ${L('36.6 °C')} بهيدروجيل غني بالرطوبة.`,
  p(
    'يجعل التصوير الحراري مرئياً ما تشعرين به فوراً على البشرة. تكون منطقة محيط العينين قريبة من حرارة الجسم، بينما يلامسها هلال الهيدروجيل الشفاف بارداً وغنياً بالماء.',
    true
  ) +
    p(
      `مع تليين حرارة الجسم لمصفوفة الهيدروجيل المصنوعة من طحلب ${L('Chondrus crispus')}، يلتصق القناع بنعومة وتجانس بمحيط العينين، وتُبعد الرطوبة الحرارة السطحية لتشعر المنطقة بالهدوء والانتعاش والترطيب من دون أي طبقة دهنية ثقيلة.`,
      true
    ),
  'صورة حرارية لهلال هيدروجيل EyeCell الأزرق البارد تحت محيط العين الدافئ',
  `شاهدي الفيلم القصير (${L('31 s')}): من ${L('36.6 °C')} إلى البرودة.`,
  `من دفء البشرة إلى تلامس الهيدروجيل الشفاف — شاهدي فيلم الحملة الكامل لـ ${L('EyeCell EYE PEPTIDE GEL PATCH')}.`
)}

${feature(
  's2-v2.jpg',
  'هلالان شفافان من هيدروجيل EyeCell في ضوء استوديو نقي',
  'لماذا لا يشبه الهيدروجيل الأقنعة الورقية.',
  p(
    'تجف الأقنعة القطنية والورقية من الخارج إلى الداخل، وإذا بقيَت أطول من اللازم قد تبدو مشدودة على البشرة.'
  ) +
    p(
      `أمّا ${L('EyeCell EYE PEPTIDE GEL PATCH')} فيُصاغ كهيدروجيل صلب وشفاف قائم على ${L('Chondrus crispus')} وصمغ الخروب والغليسرين. تُليّن حرارة البشرة القناع ليلامس محيط العين بتجانس ويحبس الرطوبة طوال ${L('20–40')} دقيقة.`
    ),
  'ice'
)}

${stats([
  ['2%', 'نياسيناميد · إشراقة وتفتيح'],
  ['0.04%', 'أدينوزين · عناية بالتجاعيد'],
  ['pH 6.85', 'درجة حموضة متوازنة للعين'],
  ['60 / 30', 'قطعة · استخداماً'],
])}

${feature(
  's4-v2.jpg',
  'بطاقة حقائق EyeCell Eye Peptide Gel Patch: نياسيناميد 2%، أدينوزين 0.04%، pH 6.85',
  'داخل الهيدروجيل: أرقام حقيقية بلا ضجيج.',
  p(
    `ترخّص كوريا هذه الصيغة الواحدة كمستحضر وظيفي مزدوج للتفتيح والعناية بالخطوط الدقيقة، استناداً إلى <strong>نياسيناميد ${L('2%')}</strong> و<strong>أدينوزين ${L('0.04%')}</strong>.`
  ) +
    p(
      `ويحيط بهذا الأساس <strong>البانثينول</strong> و<strong>الألانتوين</strong> لتهدئة وتلطيف البشرة الرقيقة، إلى جانب السنتيلا الآسيوية و${L('Acetyl Hexapeptide-8')}. متوازن عند <strong>${L('pH 6.85')}</strong> (ضمن نطاق ${L('5.50–7.50')})، مختبر جلدياً، وصُنع في كوريا.`
    ),
  'white',
  true
)}

${feature(
  's3-v2.jpg',
  'صورة مقربة لمحيط عين هادئ مع قناع هيدروجيل EyeCell الشفاف',
  'خطوة هادئة واحدة لـ 20 دقيقة.',
  p(
    'ضعي زوجاً من الأقنعة بعد التنظيف والتونر، واتركيهما بثبات أثناء القراءة أو الاسترخاء بعد السفر. يجلس الهلال الشفاف بخفة وصفاء من دون أثر أبيض أو انزلاق.'
  ) +
    p(
      `بعد ${L('20–40')} دقيقة، أزيلي الأقنعة وربّتي برفق على ما تبقّى من الخلاصة حتى تمتصّها البشرة. لا حاجة للشطف — انتقلي مباشرة إلى سيروم وكريم محيط العينين.`
    ),
  'mist'
)}

${ritualBlock(
  'ستون قطعة. ثلاثون استخداماً. ملعقة عريضة وغطاء إحكام داخلي.',
  `تضم كل عبوة (${L('101 g')}) ${L('60')} هلال هيدروجيل شفافاً مرتبة بعناية، يحميها غطاء إحكام داخلي مع ملعقة عريضة مرفقة لاستخراج الأقنعة بنظافة تامة من دون لمس الخلاصة بالأصابع.`,
  'لقطة مقربة لستين قطعة هيدروجيل شفافة مرتبة داخل عبوة EyeCell السوداء',
  'عبوة EyeCell مفتوحة مع الملعقة الشفافة العريضة ترفع هلال هيدروجيل وقطرة خلاصة',
  [
    [
      '01',
      'ارفعي بالملعقة المرفقة',
      'ابدئي على بشرة نظيفة ومهيّأة بالتونر. استخدمي الملعقة العريضة المرفقة لفصل قطعتين بنظافة تامة.',
    ],
    [
      '02',
      'ضعيها لـ 20–40 دقيقة',
      'مرّري الزوج تحت العينين، ويمكنكِ اختيارياً إضافة زوج ثانٍ على عظمة الحاجب لراحة إضافية. اتركيها من 20 إلى 40 دقيقة.',
    ],
    [
      '03',
      'أزيلي، ربّتي، وأحكمي الإغلاق',
      'أزيلي الأقنعة وربّتي برفق على الخلاصة المتبقية، ثم أغلقي الغطاء الداخلي بإحكام لتبقى القطعة الستون برطوبة الأولى نفسها.',
    ],
  ]
)}

  <div>
    <h2 class="text-3xl font-light text-[#323132]">هل هذه الخطوة مناسبة لكِ؟</h2>
${fit(
  'مثالي لكِ إذا',
  [
    'يشعر محيط عينيكِ بالدفء أو الإرهاق أو الجفاف بسبب الشاشات والسفر وهواء التكييف في الإمارات.',
    `تبحثين عن قناع قابل للإزالة يهدّئ ويرطّب مع مكونات كورية موثّقة للتفتيح (نياسيناميد ${L('2%')}) والعناية بالخطوط الدقيقة (أدينوزين ${L('0.04%')}).`,
    'تحتاجين إلى راحة مهدّئة لمحيط العينين بعد جلسات العناية التخصصية وفق إرشاد المختص.',
    'تفضّلين عبوة عملية بـ 30 استخداماً مع غطاء إحكام داخلي وملعقة عريضة.',
  ],
  'اختاري خياراً آخر إذا',
  [
    `تريدين عناية يومية تبقى على البشرة تحت المكياج — استخدمي ${link(`${l}/products/17`, L('EyeCell EYE CONTOUR SERUM'))} و${link(`${l}/products/24`, L('EyeCell EYE CONTOUR CREAM'))} (أو بعد القناع مباشرة).`,
    'لديكِ حساسية معروفة تجاه أقنعة الهيدروجيل أو الضمادات اللاصقة.',
    `تبحثين عن لاصقات للنوم طوال الليل — فهذا القناع مصمّم لمدة ${L('20–40')} دقيقة فقط.`,
  ]
)}
  </div>

  <div>
    <h2 class="text-3xl font-light text-[#323132]">أسئلة سريعة.</h2>
${faq([
  [
    'كم أترك أقنعة EyeCell على البشرة؟',
    `المدة المثالية هي ${L('20–40')} دقيقة. أزيليها بعد انتهاء الوقت وربّتي برفق على الخلاصة المتبقية — ولا يُنصح بالنوم بها طوال الليل.`,
  ],
  [
    'هل يمكن وضعها على منطقة الحاجبين أيضاً؟',
    'نعم. يُوضع زوج تحت العينين، ويمكن اختيارياً إضافة زوج ثانٍ على طول عظمة الحاجب لمزيد من التهدئة.',
  ],
  [
    'هل أحتاج إلى حفظ العبوة في الثلاجة؟',
    'يكفي حفظها في مكان بارد وجاف بعيداً عن الحرارة المباشرة، مع إحكام إغلاق الغطاء الداخلي والغطاء الخارجي بعد كل استخدام.',
  ],
  [
    'هل أشطف الوجه بعد إزالة الأقنعة؟',
    'لا. ربّتي برفق على ما تبقّى من الخلاصة حتى تمتصّها البشرة، ثم أكملي بسيروم وكريم محيط العينين.',
  ],
  [
    'أين مكان القناع في روتين EyeCell الكامل؟',
    `استخدميه مرتين إلى ثلاث مرات أسبوعياً: تنظيف وتونر ← ${link(`${l}/products/33`, L('EyeCell EYE PEPTIDE GEL PATCH'))} لمدة ${L('20–40')} دقيقة ← ${link(`${l}/products/17`, L('EyeCell EYE CONTOUR SERUM'))} ← ${link(`${l}/products/24`, L('EyeCell EYE CONTOUR CREAM'))}.`,
  ],
])}
  </div>

${instagram(
  `من حملة ${L('@genosys.uae')}`,
  'يجمع هذا المقال بين معرض المنتج المحدّث وحملة EyeCell الحرارية الجديدة المنشورة على إنستغرام.',
  [
    [IG.reel, 'شاهدي الريل على إنستغرام'],
    [IG.proof, `كاروسيل الإثبات: ${L('36.6 °C')} إلى البرودة`],
    [IG.product, `كاروسيل المنتج: ${L('COOL. CALM.')}`],
  ]
)}

${closerCta(
  'البطاقة الختامية لقناع EyeCell Eye Peptide Gel Patch مع العبوة السوداء في ضوء استوديو بارد',
  'انتعاش.<br />هدوء.',
  `${L('EyeCell EYE PEPTIDE GEL PATCH')} · ${L('101 g')} · ${L('60')} قطعة · ${L('30')} استخداماً · نياسيناميد ${L('2%')} · أدينوزين ${L('0.04%')} · ${L('pH 6.85')} · مختبر جلدياً · صُنع في كوريا.`,
  [
    [`${l}/products/33`, `تسوّقي ${L('EyeCell Gel Patch')}`],
    [`${l}/products/17`, 'سيروم محيط العين'],
    [`${l}/products/24`, 'كريم محيط العين'],
  ]
)}

${noteFooter(
  'إرشادات الاستخدام',
  'للاستخدام التجميلي الخارجي فقط. تجنّبي ملامسة العينين مباشرة، واشطفي بماء بارد عند التلامس. أوقفي الاستخدام في حال ظهور احمرار أو تهيّج. يُحفظ بعيداً عن متناول الأطفال وفي مكان بارد وجاف.'
)}
</div>`
}

async function live(path: string): Promise<boolean> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`https://genosys.ae${path}`, { method: 'HEAD' })
      return res.ok
    } catch (error) {
      if (attempt === 3) throw error
    }
  }
}

async function main() {
  const skipCheck = process.argv.includes('--skip-live-check')
  const requiredAssets = [
    COVER,
    `${IMG}/s2-v2.jpg`,
    `${IMG}/s3-v2.jpg`,
    `${IMG}/s4-v2.jpg`,
    `${IMG}/s5-v2.jpg`,
    `${IMG}/s6-v2.jpg`,
    `${IMG}/thermal-cool-eye.jpg`,
    `${IMG}/thermal-cool-poster.jpg`,
    `${IMG}/eyecell-spoon-droplet.jpg`,
    VIDEO,
  ]

  if (!skipCheck) {
    const missing: string[] = []
    for (const asset of requiredAssets) {
      if (!(await live(asset))) missing.push(asset)
    }
    if (missing.length) {
      console.error(`Media not live yet (${missing.length}):`, missing.join(', '))
      process.exitCode = 1
      return
    }
    console.log(`All ${requiredAssets.length} media assets verified 200 on genosys.ae`)
  }

  const data = {
    title: '36.6 °C to Cool: Inside EyeCell EYE PEPTIDE GEL PATCH',
    slug: SLUG,
    excerpt:
      'Body heat softens the hydrogel; moisture displaces heat so the eye contour cools. Watch the new Thermal Cool film and see the verified formula, actives, and 20–40 minute ritual behind EyeCell EYE PEPTIDE GEL PATCH.',
    content: en(),
    featuredImage: COVER,
    titleRu: 'От 36,6 °C к прохладе: внутри EyeCell EYE PEPTIDE GEL PATCH',
    excerptRu:
      'Тепло кожи размягчает гидрогель, а влага отводит тепло, даря зоне вокруг глаз прохладу и спокойствие. Смотрите новый ролик и разбор формулы EyeCell EYE PEPTIDE GEL PATCH: ниацинамид 2%, аденозин 0,04%, pH 6,85 и 60 патчей в банке.',
    contentRu: ru(),
    titleAr: 'من 36.6 °C إلى الانتعاش: داخل EyeCell EYE PEPTIDE GEL PATCH',
    excerptAr:
      'تليّن حرارة البشرة الهيدروجيل وتُزيح الرطوبة الحرارة ليهدأ محيط العينين. شاهدي فيلم الحملة الحرارية الجديد واكتشفي تركيبة EyeCell EYE PEPTIDE GEL PATCH بتركيز نياسيناميد 2% وأدينوزين 0.04% و60 قطعة في العبوة.',
    contentAr: ar(),
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'eyecell',
      'eye-patches',
      'hydrogel',
      'cooling-skincare',
      'niacinamide',
      'adenosine',
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
