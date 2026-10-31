/**
 * Creates or updates the multilingual "collagen you drink" myth article,
 * closing on BIO-MESO PDRN Expert Ampoule 60000 (product 60) and Homecare
 * Ampoule 5000 (product 65).
 *
 * Sources:
 * - Myth: Myung & Park, "Effects of Collagen Supplements on Skin Aging",
 *   Am J Med 2025;138(9):1264-1277, doi 10.1016/j.amjmed.2025.04.034
 *   (23 RCTs, 1,474 people). Its funding classification is disputed by the
 *   supplement industry, which the article says.
 * - Products: data/product60LocalizedCopy.ts, data/product65LocalizedCopy.ts
 *   (Intertek quanti formula) and the Instagram brief
 *   Insta_Olga/02_PRODUCTS/60_BIO_MESO_PDRN_60000/NO_NEEDLES_2026-10/02_DOCS/BRIEF_v1.md.
 *   No collagen-production, growth-factor or clinical-percentage claims, no prices.
 *
 * Artwork: clean plates (no type) of the October 2026 Instagram row
 * "NO NEEDLES. JUST HANDS." and the "STRAIGHT TO THE FACE." myth deck, in
 * public/images/collagen_myth_blog/. Video: the live BIO-MESO reel,
 * /videos/biomeso-no-needles-reel-web.mp4.
 *
 * Classes live in this file, so push and deploy before running it (Tailwind
 * compiles only classes it has seen in the repo).
 *
 * Run:
 *   npx tsx --env-file=.env --env-file=.env.local scripts/create-collagen-myth-bio-meso-blog.ts
 */
import { prisma } from '../lib/prisma'

const SLUG = 'collagen-drink-myth-what-reaches-your-face'
const IMG = '/images/collagen_myth_blog'
const VIDEO = '/videos/biomeso-no-needles-reel-web.mp4'
const POSTER = `${IMG}/reel-poster.jpg`

const IG = {
  reel: 'https://www.instagram.com/reel/DfESRTeKvsu/',
  product: 'https://www.instagram.com/p/DfEVV4TDJaI/',
  proof: 'https://www.instagram.com/p/DfFC5d2jPSc/',
}

const STUDY_URL = 'https://doi.org/10.1016/j.amjmed.2025.04.034'

type Locale = 'en' | 'ru' | 'ar'
const prefix = (locale: Locale) => (locale === 'en' ? '' : `/${locale}`)

const img = (file: string, alt: string) =>
  `<img src="${IMG}/${file}.jpg" alt="${alt}" width="1200" height="1600" class="w-full h-auto rounded-2xl shadow-lg shadow-[#5B4A2E]/15" loading="lazy" />`

const link = (href: string, text: string) =>
  `<a href="${href}" class="text-[#8A5A4E] font-semibold underline decoration-[#DEAA9D] underline-offset-4 hover:decoration-[#8A5A4E]">${text}</a>`

const extLink = (href: string, text: string) =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-[#8A5A4E] font-semibold underline decoration-[#DEAA9D] underline-offset-4 hover:decoration-[#8A5A4E]">${text}</a>`

const hero = (kicker: string, title: string, line: string) => `
  <div class="rounded-3xl bg-[#EFE6C4] p-8 md:p-12">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#6F6440]">${kicker}</p>
    <h2 class="text-4xl md:text-6xl leading-[0.95] mt-4 text-[#323132]"><span class="font-light">${title}</span></h2>
    <p class="text-lg text-[#4A4636] mt-6 max-w-2xl">${line}</p>
  </div>`

// Image beside text on desktop, stacked on mobile. `tone` is the card colour.
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

const compare = (cards: [string, string, string[], string, string][]) => `
  <div class="grid gap-5 md:grid-cols-2">
    ${cards.map(([tag, title, lines, href, button]) => `<div class="flex flex-col rounded-3xl border border-[#DEAA9D] bg-[#FCF3F0] p-6 md:p-8">
      <p class="text-xs font-semibold uppercase tracking-[0.25em] text-[#8A5A4E]">${tag}</p>
      <p class="text-2xl font-semibold text-[#323132] mt-3">${title}</p>
      <ul class="mt-4 space-y-2 text-gray-700">${lines.map((l) => `<li>· ${l}</li>`).join('')}</ul>
      <a href="${href}" class="mt-6 inline-block self-start rounded-full bg-[#323132] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4A4636]">${button}</a>
    </div>`).join('\n    ')}
  </div>`

const steps = (items: [string, string, string][]) => `
  <ol class="mt-6 grid gap-4 sm:grid-cols-3">
    ${items.map(([n, title, body]) => `<li class="rounded-2xl bg-white p-5 shadow-sm">
      <p class="text-4xl font-light text-[#DEAA9D]" dir="ltr">${n}</p>
      <p class="font-semibold text-[#323132] mt-2">${title}</p>
      <p class="text-sm text-gray-700 mt-2">${body}</p>
    </li>`).join('\n    ')}
  </ol>`

const videoBlock = (label: string, line: string) => `
  <div class="rounded-3xl bg-[#F8E9E4] p-6 md:p-10">
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

// ─── English ───────────────────────────────────────────────────────────────
const en = (): string => {
  const l = prefix('en')
  return `<div class="max-w-4xl mx-auto space-y-10">
${hero('GENOSYS Explains · Myth vs fact', 'STRAIGHT<br />TO THE FACE.', 'A spoon of collagen in your morning coffee feels like skincare. Here is where it actually goes, what the cleanest trials found, and the shorter way to your face.')}

  <div>
    <p class="text-lg text-gray-700">Collagen is the protein that gives skin its firmness, so drinking more of it sounds like simple arithmetic: more collagen in, more collagen in your face. Powders, shots and gummies are sold on exactly that promise. The body does not do arithmetic, though. It does digestion.</p>
  </div>
${feature('myth-glass', 'A spoon of white collagen powder poured into a glass of water', 'To your body, it is just protein.',
    p('Collagen you swallow meets your stomach like any other protein: chicken, lentils, eggs. Digestion takes it apart into amino acids and small fragments, and that is the form in which it enters the blood. Nothing arrives at your cheek labelled "collagen".') +
    p('Some of those fragments do circulate for a while, which is why the idea is not absurd. But a fragment in the blood is not new collagen in the skin.'),
    'butter')}
${feature('myth-plate', 'Small heaps of white powder arranged in a ring on a plate', 'Then your body decides where it goes.',
    p('Amino acids join a shared pool. Muscles, organs, blood, hair and skin all draw from it, and the body serves them by its own priorities, not in the order you hoped for when you bought the jar.') +
    p('Your face is in that queue. It is not first in line.'),
    'butter')}

  <div class="rounded-3xl bg-[#F6F1DE] p-6 md:p-10">
    <h2 class="text-3xl font-semibold text-[#323132]">What the trials found.</h2>
    ${p(`In 2025 the <em>American Journal of Medicine</em> pooled 23 randomised controlled trials of collagen supplements for skin, with 1,474 people in total (${extLink(STUDY_URL, 'Myung and Park, 2025')}).`)}
    <div class="mt-6">${stats([
      ['23', 'randomised trials'],
      ['1,474', 'people'],
      ['None', 'clear effect in trials without company funding'],
      ['None', 'clear effect in the high-quality trials'],
    ], 'butter')}</div>
    ${p('Pooled together, the trials showed better hydration, elasticity and wrinkles. Split by who paid for them, the picture changed: trials funded by supplement makers found an effect, the others did not. The highest-quality trials found no significant effect either. The authors concluded there is currently no clinical evidence that collagen supplements prevent or treat skin ageing.')}
    ${p('To be fair to the other side: supplement makers have challenged how the paper sorted some trials by funding, so the debate is not closed. What it does mean is that the cleanest evidence does not back the promise on the jar.')}
  </div>
${feature('myth-dish', 'A small dish of white powder on a pale yellow table', 'So, should you stop?',
    p('That is your call. Collagen is a protein, and protein is good food. Just count it as nutrition, not as skincare. If the goal is your face, the shortest way to it is the one you can see: what you put on it.'),
    'plain')}

  <div class="text-center py-2">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#8A5A4E]">Care that goes on the face</p>
    <h2 class="text-4xl md:text-5xl leading-tight text-[#323132] mt-3"><span class="font-light">No needles.<br />Just hands.</span></h2>
  </div>
${feature('sponge', 'A freshwater sponge torn open on a plate beside salmon roe', 'A sponge and a salmon.',
    p('BIO-MESO PDRN starts from two unlikely sources. The first is a freshwater sponge, whose skeleton is made of microscopic, needle-like structures called spicules. The second is salmon: PDRN, the DNA fragment the line is named after, comes from salmon milt.') +
    p('Pressed into skin by hand, the spicules give a light, prickly tingle, a little like needles, with no needles and no device. Both ampoules also carry 2% niacinamide for a more even tone and 0.04% adenosine for visible lines, and Korea registers the formula for both.'),
    'pink')}

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">One idea, two strengths.</h2>
    ${p('The numbers on the boxes, 60000 and 5000, are the strength of the whole BIO-MESO PDRN complex, not a count of spicules and not the PDRN dose. What separates the two is how much sponge each one carries.')}
    <div class="mt-6">${compare([
      ['In clinic', 'Expert Ampoule 60000', ['5.72% sponge spicules', '1,120 ppm PDRN from salmon', '2% niacinamide, 0.04% adenosine', '4 × 3 ml ampoules', 'Applied by a trained specialist'], `${l}/products/60`, 'See the Expert Ampoule'],
      ['At home', 'Homecare Ampoule 5000', ['0.48% sponge spicules, about one twelfth', '1,010 ppm PDRN from salmon', '2% niacinamide, 0.04% adenosine', '50 ml tube', 'Once a week, in the evening'], `${l}/products/65`, 'See the Homecare Ampoule'],
    ])}</div>
  </div>
${feature('clinic-carton', 'The BIO-MESO PDRN Expert Ampoule 60000 carton on a plate, a hand reaching in', 'In clinic: the specialist’s hands.',
    p('The Expert Ampoule is a professional product. A trained specialist spreads it over clean skin, presses it in and rolls it with the palms, dot by dot, for about a minute.') +
    p('Expect a light tingle and some warmth, a bit like mild sunburn, for a day or two, then a soft peel around day three to five. How strong and how long varies from skin to skin. Clinics: write to us for the professional protocol.'),
    'pink')}
${feature('one-twelfth', 'A large sponge on a plate next to a small piece of sponge in a dish: one twelfth', 'At home: the same idea, made gentle.',
    p('The Homecare Ampoule keeps the clinic idea and takes about one twelfth of the spicules, so you can carry it on between visits in your own hands.'),
    'pink')}

  <div class="rounded-3xl bg-[#F8E9E4] p-6 md:p-10">
    <div class="grid items-center gap-8 md:grid-cols-2">
      <div class="mx-auto w-full max-w-sm">${img('your-hands', 'A woman at home pressing her own hand to her cheek, a dish of sponge on the table')}</div>
      <div>
        <h2 class="text-3xl font-semibold text-[#323132]">3 ml. 30 seconds. Your hands.</h2>
        ${p('Once a week, in the evening, on clean skin. Keep it away from your eyes and lips.')}
      </div>
    </div>
${steps([
  ['01', 'Spread', 'About 3 ml of the ampoule over the face.'],
  ['02', 'Press', 'Gently press it in with your palms or fingertips.'],
  ['03', 'Roll', 'Massage with rolling movements for about 30 seconds.'],
])}
    ${p(`Want more? Follow straight away with the ${link(`${l}/products/52`, 'Skin Reboot PDRN Mask')} for 10 to 15 minutes. Next morning, finish with sunscreen. A light tingle, redness or a little peeling can come and go: leave the flakes alone, and skip acids, retinoids, peels and rollers until your skin has settled.`)}
  </div>
${videoBlock('No needles. Just hands. In 30 seconds.', 'The reel from our Instagram: the sponge, the spread, the press, and both ampoules.')}
${feature('homecare', 'The BIO-MESO PDRN Homecare Ampoule 5000 tube beside a dish with a piece of sponge', 'Between visits.',
    p('The Expert Ampoule is the clinic session. The Homecare Ampoule is what keeps the idea going between sessions, once a week, at your own sink. Start only once your skin has fully settled after a clinic treatment.'),
    'plain')}

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">Is it for you?</h2>
${fit(
  'A good match if',
  ['You want more even-looking tone and softer-looking lines', 'Needles put you off, but you like the idea of a professional treatment', 'You want to carry a clinic treatment on at home', 'You are happy with a tingle and a light peel as part of the process'],
  'Not now if',
  ['You have active pustular acne, active rosacea, an infection or open wounds', 'You have just had another face procedure, sunburn or a fresh tan', 'Your skin is very sensitive or you have an autoimmune skin condition', 'You are pregnant or breastfeeding: ask your doctor first'],
)}
  </div>

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">Good to know.</h2>
${faq([
  ['Does the collagen in a drink reach my skin?', 'Not as collagen. Digestion breaks it into amino acids and small fragments, and your body shares them out by its own priorities. In the cleanest trials, collagen supplements showed no clear effect on wrinkles, hydration or elasticity.'],
  ['Are the spicules needles?', 'No. They are microscopic, needle-like structures from a freshwater sponge. There are no needles and no device: the ampoule is pressed in by hand.'],
  ['What do 60000 and 5000 mean?', 'The strength of the whole BIO-MESO PDRN complex in each ampoule. They are not the number of spicules and not the PDRN dose, which is 1,120 ppm and 1,010 ppm.'],
  ['Can I use the Expert Ampoule at home?', 'No. It is a professional product for a trained specialist. The Homecare Ampoule is the version made for home.'],
  ['How often can I use the Homecare Ampoule?', 'Once a week, in the evening, about 3 ml. Sunscreen the next morning.'],
])}
  </div>
${instagram('Seen on our Instagram', 'This article grew out of our latest BIO-MESO row on @genosys.uae.', [
  [IG.reel, 'The reel: No needles. Just hands.'],
  [IG.product, 'Homecare Ampoule 5000'],
  [IG.proof, 'Expert Ampoule 60000'],
])}
${cta('The shortest way<br />to your face.', 'BIO-MESO PDRN · Expert Ampoule 60000 in clinic · Homecare Ampoule 5000 at home · 2% niacinamide · 0.04% adenosine · Made in Korea', [
  [`${l}/products/65`, 'Shop the Homecare Ampoule'],
  [`${l}/products/60`, 'Expert Ampoule for clinics'],
])}
${sources('Sources', `Myung S-K, Park Y. Effects of Collagen Supplements on Skin Aging: A Systematic Review and Meta-Analysis of Randomized Controlled Trials. <em>The American Journal of Medicine</em> 2025;138(9):1264-1277. ${extLink(STUDY_URL, 'doi:10.1016/j.amjmed.2025.04.034')}. Product facts: the BIO-MESO PDRN formulas. This article is general information, not medical advice.`)}
</div>`
}

// ─── Russian ───────────────────────────────────────────────────────────────
const ru = (): string => {
  const l = prefix('ru')
  return `<div class="max-w-4xl mx-auto space-y-10">
${hero('GENOSYS объясняет · Миф и факт', 'ПРЯМО<br />В ЛИЦО.', 'Ложка коллагена в утреннем кофе кажется уходом за кожей. Рассказываем, куда он на самом деле попадает, что показали самые чистые исследования и какой путь к лицу короче.')}

  <div>
    <p class="text-lg text-gray-700">Коллаген это белок, который отвечает за упругость кожи, поэтому пить его кажется простой арифметикой: больше коллагена внутрь, больше коллагена в лице. Порошки, шоты и мармеладки продают именно с этим обещанием. Но организм не считает, он переваривает.</p>
  </div>
${feature('myth-glass', 'Ложка белого порошка коллагена высыпается в стакан воды', 'Для организма это просто белок.',
    p('Коллаген, который вы проглотили, желудок встречает как любой другой белок: курицу, чечевицу, яйца. Пищеварение разбирает его на аминокислоты и небольшие фрагменты, и в таком виде он попадает в кровь. До щеки ничего не доходит с табличкой «коллаген».') +
    p('Часть фрагментов какое-то время циркулирует в крови, поэтому сама идея не абсурдна. Но фрагмент в крови это ещё не новый коллаген в коже.'),
    'butter')}
${feature('myth-plate', 'Маленькие горки белого порошка, разложенные по кругу на тарелке', 'Дальше организм сам решает, куда.',
    p('Аминокислоты попадают в общий запас. Из него берут мышцы, органы, кровь, волосы и кожа, и организм распределяет его по своим приоритетам, а не в том порядке, на который вы рассчитывали, покупая банку.') +
    p('Лицо в этой очереди есть. Но оно не первое.'),
    'butter')}

  <div class="rounded-3xl bg-[#F6F1DE] p-6 md:p-10">
    <h2 class="text-3xl font-semibold text-[#323132]">Что показали исследования.</h2>
    ${p(`В 2025 году журнал <em>American Journal of Medicine</em> объединил 23 рандомизированных контролируемых исследования коллагеновых добавок для кожи, всего 1 474 участника (${extLink(STUDY_URL, 'Myung и Park, 2025')}).`)}
    <div class="mt-6">${stats([
      ['23', 'рандомизированных исследования'],
      ['1\u00A0474', 'участника'],
      ['Нет', 'явного эффекта в исследованиях без финансирования производителей'],
      ['Нет', 'явного эффекта в исследованиях высокого качества'],
    ], 'butter')}</div>
    ${p('Вместе исследования показали улучшение увлажнённости, упругости и морщин. Но если разделить их по тому, кто платил, картина меняется: исследования, оплаченные производителями добавок, эффект нашли, остальные нет. Исследования самого высокого качества значимого эффекта тоже не нашли. Вывод авторов: клинических доказательств того, что коллагеновые добавки предотвращают или лечат старение кожи, сейчас нет.')}
    ${p('Справедливости ради: производители добавок оспаривают, как в работе распределили часть исследований по источнику финансирования, так что спор не закрыт. Но самые чистые данные обещание на банке не подтверждают.')}
  </div>
${feature('myth-dish', 'Маленькая пиала с белым порошком на светло-жёлтом столе', 'Так бросать или нет?',
    p('Решать вам. Коллаген это белок, а белок хорошая еда. Просто считайте его питанием, а не уходом за кожей. Если цель лицо, самый короткий путь к нему тот, который видно: то, что вы на него наносите.'),
    'plain')}

  <div class="text-center py-2">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#8A5A4E]">Уход, который наносят на лицо</p>
    <h2 class="text-4xl md:text-5xl leading-tight text-[#323132] mt-3"><span class="font-light">Без игл.<br />Только руки.</span></h2>
  </div>
${feature('sponge', 'Разорванная пресноводная губка на тарелке рядом с лососёвой икрой', 'Губка и лосось.',
    p('BIO-MESO PDRN начинается с двух неожиданных источников. Первый это пресноводная губка, скелет которой состоит из микроскопических игольчатых структур, спикул. Второй это лосось: PDRN, фрагмент ДНК, давший линии имя, получают из молок лосося.') +
    p('Когда спикулы вводят в кожу руками, они дают лёгкое колкое покалывание, немного похожее на иглы, но без игл и без аппаратов. В обеих ампулах также 2% ниацинамида для более ровного тона и 0,04% аденозина для видимых морщин, и в Корее формула зарегистрирована для обеих функций.'),
    'pink')}

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">Одна идея, две силы.</h2>
    ${p('Числа на коробках, 60000 и 5000, означают концентрацию всего комплекса BIO-MESO PDRN, а не количество спикул и не дозу PDRN. Отличает ампулы то, сколько в них губки.')}
    <div class="mt-6">${compare([
      ['В кабинете', 'Expert Ampoule 60000', ['5,72% спикул губки', '1 120 ppm PDRN из лосося', '2% ниацинамида, 0,04% аденозина', '4 ампулы по 3 мл', 'Наносит обученный специалист'], `${l}/products/60`, 'Об экспертной ампуле'],
      ['Дома', 'Homecare Ampoule 5000', ['0,48% спикул губки, примерно одна двенадцатая', '1 010 ppm PDRN из лосося', '2% ниацинамида, 0,04% аденозина', 'Туба 50 мл', 'Один раз в неделю, вечером'], `${l}/products/65`, 'О домашней ампуле'],
    ])}</div>
  </div>
${feature('clinic-carton', 'Коробка BIO-MESO PDRN Expert Ampoule 60000 на тарелке, к ней тянется рука', 'В кабинете: руки специалиста.',
    p('Expert Ampoule это профессиональное средство. Обученный специалист распределяет его по чистой коже, прижимает и вкатывает ладонями, точка за точкой, около минуты.') +
    p('Ожидайте лёгкое покалывание и тепло, немного похожее на лёгкий солнечный ожог, день-два, а затем мягкое шелушение примерно на третий-пятый день. Сила и длительность у всех разные. Клиники, напишите нам за профессиональным протоколом.'),
    'pink')}
${feature('one-twelfth', 'Большая губка на тарелке рядом с маленьким кусочком губки в пиале: одна двенадцатая', 'Дома: та же идея, только мягче.',
    p('Homecare Ampoule сохраняет идею кабинета и берёт примерно одну двенадцатую спикул, чтобы вы продолжали уход между визитами своими руками.'),
    'pink')}

  <div class="rounded-3xl bg-[#F8E9E4] p-6 md:p-10">
    <div class="grid items-center gap-8 md:grid-cols-2">
      <div class="mx-auto w-full max-w-sm">${img('your-hands', 'Женщина дома прижимает ладонь к щеке, на столе пиала с губкой')}</div>
      <div>
        <h2 class="text-3xl font-semibold text-[#323132]">3 мл. 30 секунд. Ваши руки.</h2>
        ${p('Один раз в неделю, вечером, на чистую кожу. Не наносите вокруг глаз и губ.')}
      </div>
    </div>
${steps([
  ['01', 'Распределить', 'Около 3 мл ампулы по лицу.'],
  ['02', 'Прижать', 'Мягко прижмите средство ладонями или пальцами.'],
  ['03', 'Роллинг', 'Массируйте роллинг-движениями около 30 секунд.'],
])}
    ${p(`Хотите больше? Сразу после ампулы нанесите ${link(`${l}/products/52`, 'Skin Reboot PDRN Mask')} на 10-15 минут. Утром завершите уход солнцезащитным средством. Лёгкое покалывание, покраснение или небольшое шелушение могут появиться и пройти: не сдирайте чешуйки и не используйте кислоты, ретиноиды, пилинги и роллеры, пока кожа не восстановится.`)}
  </div>
${videoBlock('Без игл. Только руки. За 30 секунд.', 'Рилс из нашего Инстаграма: губка, распределение, прижатие и обе ампулы.')}
${feature('homecare', 'Туба BIO-MESO PDRN Homecare Ampoule 5000 рядом с пиалой с кусочком губки', 'Между визитами.',
    p('Expert Ampoule это процедура в кабинете. Homecare Ampoule продолжает идею между процедурами, раз в неделю, у вашей раковины. Начинайте, только когда кожа полностью восстановилась после процедуры в кабинете.'),
    'plain')}

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">Подходит ли вам?</h2>
${fit(
  'Подойдёт, если',
  ['Хочется более ровного тона и менее заметных морщин', 'Иглы пугают, но идея профессиональной процедуры нравится', 'Хотите продолжать процедуру из кабинета дома', 'Готовы к покалыванию и лёгкому шелушению как части процесса'],
  'Не сейчас, если',
  ['Есть гнойничковое акне, активная розацеа, инфекция или открытые раны', 'Недавно была другая процедура на лице, солнечный ожог или свежий загар', 'Кожа очень чувствительная или есть аутоиммунное заболевание кожи', 'Вы беременны или кормите грудью: сначала спросите врача'],
)}
  </div>

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">Полезно знать.</h2>
${faq([
  ['Доходит ли коллаген из напитка до кожи?', 'Не в виде коллагена. Пищеварение разбирает его на аминокислоты и небольшие фрагменты, а организм распределяет их по своим приоритетам. В самых чистых исследованиях коллагеновые добавки не показали явного эффекта на морщины, увлажнённость и упругость.'],
  ['Спикулы это иглы?', 'Нет. Это микроскопические игольчатые структуры пресноводной губки. Нет ни игл, ни аппаратов: ампулу вводят в кожу руками.'],
  ['Что значат 60000 и 5000?', 'Концентрацию всего комплекса BIO-MESO PDRN в каждой ампуле. Это не количество спикул и не доза PDRN, которая составляет 1 120 ppm и 1 010 ppm.'],
  ['Можно ли использовать экспертную ампулу дома?', 'Нет. Это профессиональное средство для обученного специалиста. Для дома создана Homecare Ampoule.'],
  ['Как часто можно использовать домашнюю ампулу?', 'Один раз в неделю, вечером, около 3 мл. Утром солнцезащитное средство.'],
])}
  </div>
${instagram('В нашем Инстаграме', 'Эта статья выросла из последнего ряда BIO-MESO в @genosys.uae.', [
  [IG.reel, 'Рилс: Без игл. Только руки.'],
  [IG.product, 'Homecare Ampoule 5000'],
  [IG.proof, 'Expert Ampoule 60000'],
])}
${cta('Самый короткий путь<br />к вашей коже.', 'BIO-MESO PDRN · Expert Ampoule 60000 в кабинете · Homecare Ampoule 5000 дома · 2% ниацинамида · 0,04% аденозина · Сделано в Корее', [
  [`${l}/products/65`, 'Купить домашнюю ампулу'],
  [`${l}/products/60`, 'Экспертная ампула для клиник'],
])}
${sources('Источники', `Myung S-K, Park Y. Effects of Collagen Supplements on Skin Aging: A Systematic Review and Meta-Analysis of Randomized Controlled Trials. <em>The American Journal of Medicine</em> 2025;138(9):1264-1277. ${extLink(STUDY_URL, 'doi:10.1016/j.amjmed.2025.04.034')}. Данные о продуктах: формулы BIO-MESO PDRN. Статья носит общий информационный характер и не заменяет консультацию врача.`)}
</div>`
}

// ─── Arabic ────────────────────────────────────────────────────────────────
// Latin product names and figures that touch Arabic text sit inside
// U+2066/U+2069 so the right-to-left paragraph keeps them in order.
const L = (s: string) => `\u2066${s}\u2069`

const ar = (): string => {
  const l = prefix('ar')
  return `<div class="max-w-4xl mx-auto space-y-10">
${hero('GENOSYS تشرح · خرافة وحقيقة', 'مباشرةً<br />إلى الوجه.', 'ملعقة كولاجين في قهوة الصباح تبدو كأنها عناية بالبشرة. إليكِ أين يذهب فعلاً، وماذا وجدت أدق الدراسات، وما الطريق الأقصر إلى وجهكِ.')}

  <div>
    <p class="text-lg text-gray-700">الكولاجين هو البروتين الذي يمنح البشرة تماسكها، لذا يبدو شربه حساباً بسيطاً: كولاجين أكثر في الداخل، كولاجين أكثر في الوجه. وتُباع المساحيق والجرعات والحلوى الهلامية على هذا الوعد بالضبط. لكن الجسم لا يحسب، بل يهضم.</p>
  </div>
${feature('myth-glass', 'ملعقة من مسحوق الكولاجين الأبيض تُسكب في كوب ماء', 'بالنسبة لجسمكِ، هو مجرد بروتين.',
    p('الكولاجين الذي تبتلعينه تستقبله المعدة كأي بروتين آخر: الدجاج والعدس والبيض. يفكّكه الهضم إلى أحماض أمينية وأجزاء صغيرة، وبهذا الشكل يدخل الدم. لا شيء يصل إلى خدّكِ وعليه اسم «كولاجين».') +
    p('بعض هذه الأجزاء يدور في الدم لبعض الوقت، ولذلك فالفكرة ليست سخيفة تماماً. لكن جزءاً في الدم ليس كولاجيناً جديداً في البشرة.'),
    'butter')}
${feature('myth-plate', 'أكوام صغيرة من مسحوق أبيض مرتبة في دائرة على طبق', 'ثم يقرر جسمكِ أين يذهب.',
    p('تنضم الأحماض الأمينية إلى مخزون مشترك. تأخذ منه العضلات والأعضاء والدم والشعر والبشرة، ويوزّعه الجسم حسب أولوياته هو، لا بالترتيب الذي تمنّيتِه عند شراء العبوة.') +
    p('وجهكِ في هذا الطابور، لكنه ليس الأول.'),
    'butter')}

  <div class="rounded-3xl bg-[#F6F1DE] p-6 md:p-10">
    <h2 class="text-3xl font-semibold text-[#323132]">ماذا وجدت الدراسات.</h2>
    ${p(`في عام 2025 جمعت مجلة ${L('<em>American Journal of Medicine</em>')} نتائج 23 تجربة عشوائية محكومة على مكمّلات الكولاجين للبشرة، شملت 1,474 شخصاً (${extLink(STUDY_URL, L('Myung & Park, 2025'))}).`)}
    <div class="mt-6">${stats([
      ['23', 'تجربة عشوائية'],
      ['1,474', 'مشاركاً'],
      ['لا', 'تأثير واضح في التجارب غير الممولة من الشركات'],
      ['لا', 'تأثير واضح في التجارب عالية الجودة'],
    ], 'butter')}</div>
    ${p('مجتمعةً، أظهرت التجارب تحسناً في الترطيب والمرونة والتجاعيد. لكن عند تقسيمها حسب الجهة الممولة تغيّرت الصورة: التجارب التي موّلتها شركات المكمّلات وجدت تأثيراً، والأخرى لم تجد. كما لم تجد التجارب الأعلى جودة تأثيراً يُذكر. وخلص الباحثان إلى أنه لا يوجد حالياً دليل سريري على أن مكمّلات الكولاجين تقي من شيخوخة البشرة أو تعالجها.')}
    ${p('وللإنصاف: اعترض مصنّعو المكمّلات على طريقة تصنيف بعض التجارب حسب التمويل، فالنقاش لم يُحسم بعد. لكن أنظف الأدلة لا تؤيد الوعد المكتوب على العبوة.')}
  </div>
${feature('myth-dish', 'وعاء صغير فيه مسحوق أبيض على طاولة صفراء فاتحة', 'إذن، هل تتوقفين؟',
    p('القرار لكِ. الكولاجين بروتين، والبروتين غذاء جيد. فقط اعتبريه تغذية لا عناية بالبشرة. وإن كان الهدف وجهكِ، فأقصر طريق إليه هو الذي ترينه: ما تضعينه عليه.'),
    'plain')}

  <div class="text-center py-2">
    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[#8A5A4E]">عناية تُوضع على الوجه</p>
    <h2 class="text-4xl md:text-5xl leading-tight text-[#323132] mt-3"><span class="font-light">بلا إبر.<br />فقط اليدان.</span></h2>
  </div>
${feature('sponge', 'إسفنجة مياه عذبة ممزقة على طبق بجانب بيض السلمون', 'إسفنجة وسمكة سلمون.',
    p(`تبدأ ${L('BIO-MESO PDRN')} من مصدرين غير متوقعين. الأول إسفنجة مياه عذبة، هيكلها مكوّن من تراكيب مجهرية شبيهة بالإبر تُسمّى الشويكات. والثاني السلمون: فـ${L('PDRN')}، جزء الحمض النووي الذي سُمّيت به المجموعة، مصدره حليب السلمون.`) +
    p('عندما تُضغط الشويكات في البشرة باليدين تعطي وخزاً خفيفاً يشبه الإبر قليلاً، بلا إبر وبلا أجهزة. وتحتوي الأمبولتان أيضاً على نياسيناميد 2% لتوحيد اللون، وأدينوزين 0.04% للخطوط الظاهرة، وتسجّل كوريا التركيبة للوظيفتين.'),
    'pink')}

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">فكرة واحدة، بقوّتين.</h2>
    ${p(`الرقمان على العلبتين، ${L('60000')} و${L('5000')}، هما تركيز مركب ${L('BIO-MESO PDRN')} كاملاً، لا عدد الشويكات ولا جرعة ${L('PDRN')}. ما يفرّق بينهما هو كمية الإسفنج في كل منهما.`)}
    <div class="mt-6">${compare([
      ['في العيادة', L('Expert Ampoule 60000'), ['شويكات إسفنج بنسبة 5.72%', `${L('PDRN')} من السلمون بتركيز 1,120 جزءاً في المليون`, 'نياسيناميد 2% وأدينوزين 0.04%', '4 أمبولات × 3 مل', 'يطبّقها مختص مدرّب'], `${l}/products/60`, 'عن الأمبولة الاحترافية'],
      ['في المنزل', L('Homecare Ampoule 5000'), ['شويكات إسفنج بنسبة 0.48%، أي نحو جزء من اثني عشر', `${L('PDRN')} من السلمون بتركيز 1,010 أجزاء في المليون`, 'نياسيناميد 2% وأدينوزين 0.04%', 'أنبوب 50 مل', 'مرة في الأسبوع، مساءً'], `${l}/products/65`, 'عن الأمبولة المنزلية'],
    ])}</div>
  </div>
${feature('clinic-carton', `علبة ${L('BIO-MESO PDRN Expert Ampoule 60000')} على طبق، ويد تمتد إليها`, 'في العيادة: يدا المختص.',
    p(`${L('Expert Ampoule')} منتج احترافي. يوزّعه المختص المدرّب على بشرة نظيفة، ثم يضغطه ويدحرجه براحتي يديه، نقطة بعد نقطة، لنحو دقيقة.`) +
    p('توقّعي وخزاً خفيفاً ودفئاً يشبه حروق الشمس الخفيفة ليوم أو يومين، ثم تقشّراً ناعماً نحو اليوم الثالث إلى الخامس. وتختلف الشدة والمدة من بشرة لأخرى. العيادات: راسلونا للحصول على البروتوكول الاحترافي.'),
    'pink')}
${feature('one-twelfth', 'إسفنجة كبيرة على طبق بجانب قطعة صغيرة من الإسفنج في وعاء: جزء من اثني عشر', 'في المنزل: الفكرة نفسها، بلطف أكبر.',
    p(`تحتفظ ${L('Homecare Ampoule')} بفكرة العيادة وتحمل نحو جزء من اثني عشر من الشويكات، لتواصلي العناية بين الزيارات بيديكِ.`),
    'pink')}

  <div class="rounded-3xl bg-[#F8E9E4] p-6 md:p-10">
    <div class="grid items-center gap-8 md:grid-cols-2">
      <div class="mx-auto w-full max-w-sm">${img('your-hands', 'امرأة في المنزل تضغط بيدها على خدها، وعلى الطاولة وعاء فيه إسفنجة')}</div>
      <div>
        <h2 class="text-3xl font-semibold text-[#323132]">3 مل. 30 ثانية. يداكِ.</h2>
        ${p('مرة في الأسبوع، مساءً، على بشرة نظيفة. تجنّبي محيط العينين والشفتين.')}
      </div>
    </div>
${steps([
  ['01', 'وزّعي', 'نحو 3 مل من الأمبولة على الوجه.'],
  ['02', 'اضغطي', 'اضغطيها بلطف براحتي يديكِ أو أطراف أصابعكِ.'],
  ['03', 'دحرجي', 'دلّكي بحركات دائرية متدحرجة لنحو 30 ثانية.'],
])}
    ${p(`تريدين المزيد؟ ضعي بعد الأمبولة مباشرة ${link(`${l}/products/52`, L('Skin Reboot PDRN Mask'))} لمدة 10 إلى 15 دقيقة. وفي الصباح التالي اختمي بواقي الشمس. قد يظهر وخز خفيف أو احمرار أو تقشّر بسيط ثم يزول: لا تنزعي القشور، وتجنّبي الأحماض والريتينويدات والتقشير والرولر حتى تهدأ بشرتكِ.`)}
  </div>
${videoBlock('بلا إبر. فقط اليدان. في 30 ثانية.', 'الريل من حسابنا على إنستغرام: الإسفنجة، والتوزيع، والضغط، والأمبولتان.')}
${feature('homecare', `أنبوب ${L('BIO-MESO PDRN Homecare Ampoule 5000')} بجانب وعاء فيه قطعة إسفنج`, 'بين الزيارات.',
    p(`${L('Expert Ampoule')} هي جلسة العيادة، و${L('Homecare Ampoule')} تواصل الفكرة بين الجلسات، مرة في الأسبوع، أمام مغسلتكِ. ابدئي فقط بعد أن تهدأ بشرتكِ تماماً من جلسة العيادة.`),
    'plain')}

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">هل تناسبكِ؟</h2>
${fit(
  'مناسبة لكِ إذا',
  ['تريدين لوناً أكثر توحّداً وخطوطاً أقل ظهوراً', 'تخيفكِ الإبر لكن تعجبكِ فكرة العلاج الاحترافي', 'تريدين مواصلة علاج العيادة في المنزل', 'لا يزعجكِ الوخز والتقشّر الخفيف كجزء من العملية'],
  'ليس الآن إذا',
  ['لديكِ حب شباب صديدي أو وردية نشطة أو عدوى أو جروح مفتوحة', 'خضعتِ مؤخراً لإجراء آخر على الوجه، أو لديكِ حروق شمس أو سُمرة حديثة', 'بشرتكِ شديدة الحساسية أو لديكِ مرض جلدي مناعي', 'أنتِ حامل أو مرضع: استشيري طبيبكِ أولاً'],
)}
  </div>

  <div>
    <h2 class="text-3xl font-semibold text-[#323132]">ما يهم معرفته.</h2>
${faq([
  ['هل يصل الكولاجين من المشروب إلى بشرتي؟', 'ليس على شكل كولاجين. يفكّكه الهضم إلى أحماض أمينية وأجزاء صغيرة، ويوزّعها الجسم حسب أولوياته. وفي أدق التجارب لم تُظهر مكمّلات الكولاجين تأثيراً واضحاً على التجاعيد أو الترطيب أو المرونة.'],
  ['هل الشويكات إبر؟', 'لا. إنها تراكيب مجهرية شبيهة بالإبر من إسفنجة مياه عذبة. لا إبر ولا أجهزة: تُضغط الأمبولة في البشرة باليدين.'],
  [`ماذا يعني ${L('60000')} و${L('5000')}؟`, `تركيز مركب ${L('BIO-MESO PDRN')} كاملاً في كل أمبولة. ليسا عدد الشويكات ولا جرعة ${L('PDRN')}، التي تبلغ 1,120 و1,010 أجزاء في المليون.`],
  ['هل يمكنني استخدام الأمبولة الاحترافية في المنزل؟', `لا. إنها منتج احترافي لمختص مدرّب، أما ${L('Homecare Ampoule')} فهي النسخة المصممة للمنزل.`],
  ['كم مرة أستخدم الأمبولة المنزلية؟', 'مرة في الأسبوع، مساءً، نحو 3 مل. وواقي الشمس في الصباح التالي.'],
])}
  </div>
${instagram('على إنستغرام', `وُلد هذا المقال من أحدث صف ${L('BIO-MESO')} على حساب ${L('@genosys.uae')}.`, [
  [IG.reel, 'الريل: بلا إبر. فقط اليدان.'],
  [IG.product, L('Homecare Ampoule 5000')],
  [IG.proof, L('Expert Ampoule 60000')],
])}
${cta('الطريق الأقصر<br />إلى وجهكِ.', `${L('BIO-MESO PDRN')} · ${L('Expert Ampoule 60000')} في العيادة · ${L('Homecare Ampoule 5000')} في المنزل · نياسيناميد 2% · أدينوزين 0.04% · صُنع في كوريا`, [
  [`${l}/products/65`, 'تسوّقي الأمبولة المنزلية'],
  [`${l}/products/60`, 'الأمبولة الاحترافية للعيادات'],
])}
${sources('المصادر', `<span dir="ltr">Myung S-K, Park Y. Effects of Collagen Supplements on Skin Aging: A Systematic Review and Meta-Analysis of Randomized Controlled Trials. <em>The American Journal of Medicine</em> 2025;138(9):1264-1277. ${extLink(STUDY_URL, 'doi:10.1016/j.amjmed.2025.04.034')}</span>. بيانات المنتجات: تركيبات ${L('BIO-MESO PDRN')}. هذا المقال معلومات عامة وليس نصيحة طبية.`)}
</div>`
}

async function main() {
  const data = {
    title: 'Does the Collagen You Drink Reach Your Face?',
    slug: SLUG,
    excerpt:
      'Collagen powders promise firmer skin from the inside. Digestion takes collagen apart first, and the cleanest trials found no clear effect on wrinkles or hydration. Here is the shorter way to your face: BIO-MESO PDRN, no needles, just hands.',
    content: en(),
    featuredImage: `${IMG}/cover.jpg`,
    titleRu: 'Доходит ли до лица коллаген, который вы пьёте?',
    excerptRu:
      'Коллагеновые порошки обещают упругую кожу изнутри. Но пищеварение сначала разбирает коллаген, а самые чистые исследования не нашли явного эффекта на морщины и увлажнённость. Рассказываем о более коротком пути к лицу: BIO-MESO PDRN, без игл, только руки.',
    contentRu: ru(),
    titleAr: 'هل يصل الكولاجين الذي تشربينه إلى وجهكِ؟',
    excerptAr:
      `تَعِد مساحيق الكولاجين ببشرة مشدودة من الداخل، لكن الهضم يفكّك الكولاجين أولاً، ولم تجد أدق التجارب تأثيراً واضحاً على التجاعيد أو الترطيب. إليكِ الطريق الأقصر إلى وجهكِ: ${L('BIO-MESO PDRN')}، بلا إبر، فقط اليدان.`,
    contentAr: ar(),
    authorName: 'GENOSYS Team',
    published: true,
    publishedAt: new Date(),
    tags: JSON.stringify([
      'collagen',
      'myth-vs-fact',
      'pdrn',
      'bio-meso',
      'spicules',
      'niacinamide',
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
