/**
 * Words and footage for the "How to use it" film on the BIO-MESO PDRN Homecare Ampoule 5000 page (product 65).
 *
 * Three short films, one per step of the weekly evening, shot in CapCut (GPT Image 2.5 keyframes, Dreamina Seedance 2.5
 * motion): spread, press and roll, then the mask. They show the documented method only. Every line below is the
 * method already printed on this page (data/product65LocalizedCopy.ts, the audited RU/AR copy in biomesoCopy.ts):
 * around 3 ml, spread evenly, press with palms or fingers, rolling movements for around 30 seconds, then the Skin
 * Reboot PDRN Mask for 10 to 15 minutes. Nothing about channels, delivery, renewal, peeling or timelines: the 21 Aug
 * 2026 audit removed those claims from this product, and a film is a claim too (its pictures show hands, skin, light
 * and a folded sheet mask, never a needle or a mechanism).
 *
 * Same self-contained per-locale pattern as biomesoCopy.ts. The RU and AR lines reuse the audited wording on the
 * page ("роллинг" in Russian, "بحركة تمرير" in Arabic) so the film and the cards beside it read as one voice.
 */

export type HowFilmLocale = 'en' | 'ar' | 'ru'

export interface HowStepCopy {
  id: 'spread' | 'press' | 'mask'
  /** Short name of the step, shown on its tab. */
  eyebrow: string
  title: string
  body: string
  /** Description of the picture for screen readers. */
  alt: string
}

export interface HowUi {
  /** Spoken name of the whole player. */
  region: string
  stepOf: (n: number, total: number) => string
  play: string
  pause: string
  replay: string
  previous: string
  next: string
  stage: string
  hintKeys: { keys: string[]; text: string }[]
  hintTouch: string
}

export interface HowFilmCopy {
  steps: [HowStepCopy, HowStepCopy, HowStepCopy]
  ui: HowUi
}

/**
 * Posters sit under /images (the only local path next/image accepts) and films under /videos. Both folders are cached
 * for a year, so a re-shot film needs a new file name (-v2), never an overwrite. A poster is the first frame of its film,
 * so the film can start on top of it without a visible jump.
 */
export interface HowMedia {
  poster: string
  video: string
}

export const HOW_FILM_MEDIA: [HowMedia, HowMedia, HowMedia] = [
  { poster: '/images/biomeso_how/how-1-spread-v1.jpg', video: '/videos/biomeso-how/how-1-spread-v1.mp4' },
  { poster: '/images/biomeso_how/how-2-press-v1.jpg', video: '/videos/biomeso-how/how-2-press-v1.mp4' },
  { poster: '/images/biomeso_how/how-3-mask-v1.jpg', video: '/videos/biomeso-how/how-3-mask-v1.mp4' },
]

/**
 * The page lists four steps (cleanse, apply, press and roll, mask). The films show the last three, so film step 0, 1
 * and 2 light up cards 1, 2 and 3 (zero based) while they play.
 */
export const HOW_FILM_CARD_FOR_STEP = [1, 2, 3] as const

const EN: HowFilmCopy = {
  steps: [
    {
      id: 'spread',
      eyebrow: 'Spread',
      title: 'Spread about 3 ml.',
      body: 'On clean skin in the evening, spread the ampoule evenly over the face. Avoid the eye and lip areas.',
      alt: 'A hand spreading a clear film of the ampoule down the cheek in hard window light',
    },
    {
      id: 'press',
      eyebrow: 'Press and roll',
      title: 'Press, then roll for 30 seconds.',
      body: 'Press gently with your palms or fingers, then massage with rolling movements.',
      alt: 'Fingertips pressing and rolling along the jawline, a thin film of gel catching the light',
    },
    {
      id: 'mask',
      eyebrow: 'Mask',
      title: 'Then the mask.',
      body: 'Right after the ampoule, apply the Skin Reboot PDRN Mask for 10 to 15 minutes, then finish with gentle care.',
      alt: 'A folded white sheet mask on a bone plate against a salmon-pink wall in window light',
    },
  ],
  ui: {
    region: 'How to use the ampoule, in three steps',
    stepOf: (n, total) => `Step ${n} of ${total}`,
    play: 'Play',
    pause: 'Pause',
    replay: 'Replay',
    previous: 'Previous step',
    next: 'Next step',
    stage: 'Step film. Press space to pause or play, left and right arrows to change step.',
    hintKeys: [
      { keys: ['←', '→'], text: 'change the step' },
      { keys: ['Space'], text: 'pause or play' },
    ],
    hintTouch: 'Swipe the picture or tap a step',
  },
}

const RU: HowFilmCopy = {
  steps: [
    {
      id: 'spread',
      eyebrow: 'Нанесение',
      title: 'Около 3 ml на лицо.',
      body: 'Вечером, на чистой коже, равномерно распределите ампулу по лицу. Избегайте области вокруг глаз и губ.',
      alt: 'Рука распределяет по щеке прозрачную плёнку ампулы в жёстком оконном свете',
    },
    {
      id: 'press',
      eyebrow: 'Прижать и роллинг',
      title: 'Прижмите, затем роллинг 30 секунд.',
      body: 'Мягко прижмите ладонями или пальцами, затем массируйте роллинг-движениями.',
      alt: 'Кончики пальцев прижимаются и перекатываются вдоль линии челюсти, тонкая плёнка геля ловит свет',
    },
    {
      id: 'mask',
      eyebrow: 'Маска',
      title: 'Затем маска.',
      body: 'Сразу после ампулы нанесите Skin Reboot PDRN Mask на 10-15 минут, затем завершите мягкий уход.',
      alt: 'Сложенная белая тканевая маска на костяной тарелке на фоне лососево-розовой стены в оконном свете',
    },
  ],
  ui: {
    region: 'Как применять ампулу, в три шага',
    stepOf: (n, total) => `Шаг ${n} из ${total}`,
    play: 'Играть',
    pause: 'Пауза',
    replay: 'Ещё раз',
    previous: 'Предыдущий шаг',
    next: 'Следующий шаг',
    stage: 'Фильм по шагам. Пробел ставит на паузу, стрелки влево и вправо меняют шаг.',
    hintKeys: [
      { keys: ['←', '→'], text: 'меняют шаг' },
      { keys: ['Пробел'], text: 'пауза и пуск' },
    ],
    hintTouch: 'Листайте картинку пальцем или нажмите на шаг',
  },
}

const AR: HowFilmCopy = {
  steps: [
    {
      id: 'spread',
      eyebrow: 'التوزيع',
      title: 'نحو 3 ml على الوجه.',
      body: 'مساءً وعلى بشرة نظيفة، وزّعي الأمبولة بالتساوي على الوجه، مع تجنب محيط العينين والشفتين.',
      alt: 'يد توزّع طبقة شفافة من الأمبولة على الخد في ضوء نافذة قوي',
    },
    {
      id: 'press',
      eyebrow: 'الضغط والتمرير',
      title: 'اضغطي ثم مرّري لنحو 30 ثانية.',
      body: 'اضغطي بلطف بالراحتين أو الأصابع، ثم دلّكي بحركة تمرير.',
      alt: 'أطراف الأصابع تضغط وتتحرك على امتداد خط الفك، وطبقة رقيقة من الجل تلتقط الضوء',
    },
    {
      id: 'mask',
      eyebrow: 'القناع',
      title: 'ثم القناع.',
      body: 'ضعي Skin Reboot PDRN Mask مباشرة بعد الأمبولة لمدة 10-15 دقيقة، ثم أكملي العناية اللطيفة.',
      alt: 'قناع ورقي أبيض مطوي على طبق عاجي أمام جدار بلون السلمون في ضوء النافذة',
    },
  ],
  ui: {
    region: 'طريقة استخدام الأمبولة في ثلاث خطوات',
    stepOf: (n, total) => `الخطوة ${n} من ${total}`,
    play: 'تشغيل',
    pause: 'إيقاف مؤقت',
    replay: 'إعادة',
    previous: 'الخطوة السابقة',
    next: 'الخطوة التالية',
    stage: 'فيلم الخطوات. مفتاح المسافة للإيقاف المؤقت أو التشغيل، والسهمان لتغيير الخطوة.',
    hintKeys: [
      { keys: ['←', '→'], text: 'لتغيير الخطوة' },
      { keys: ['المسافة'], text: 'للإيقاف المؤقت أو التشغيل' },
    ],
    hintTouch: 'مرّري الصورة بإصبعك أو اضغطي على خطوة',
  },
}

const COPY: Record<HowFilmLocale, HowFilmCopy> = { en: EN, ar: AR, ru: RU }

export function getHowFilmCopy(locale: string): HowFilmCopy {
  return COPY[locale as HowFilmLocale] ?? EN
}
