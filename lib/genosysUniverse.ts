import type { Locale } from '@/lib/i18n'

export interface GenosysUniverseZone {
  id: string
  productNumber?: string
  path: string
  accent: string
  glow: string
  scenePosition: [number, number, number]
  title: Record<Locale, string>
  subtitle: Record<Locale, string>
  signal: Record<Locale, string>
}

export const GENOSYS_UNIVERSE_ZONES: GenosysUniverseZone[] = [
  {
    id: 'barrier-chamber',
    productNumber: '27',
    path: '/products/27',
    accent: '#fb7185',
    glow: 'from-rose-500/35 to-red-900/20',
    scenePosition: [-1.85, 0.92, 0],
    title: {
      en: 'Barrier Chamber',
      ar: 'غرفة حاجز البشرة',
      ru: 'Barrier Chamber',
    },
    subtitle: {
      en: 'Skin Barrier, hydration and sensitivity recovery.',
      ar: 'حاجز البشرة والترطيب وتهدئة الحساسية.',
      ru: 'Skin Barrier, увлажнение и восстановление чувствительной кожи.',
    },
    signal: {
      en: 'First full chamber',
      ar: 'أول غرفة كاملة',
      ru: 'Первая полная комната',
    },
  },
  {
    id: 'brightening-orbit',
    path: '/products/concern/pigmentation',
    accent: '#c084fc',
    glow: 'from-violet-500/35 to-purple-950/20',
    scenePosition: [0.05, 1.38, -0.25],
    title: {
      en: 'Brightening Orbit',
      ar: 'مدار التفتيح',
      ru: 'Brightening Orbit',
    },
    subtitle: {
      en: 'Pigmentation, radiance and sun-damage protocols.',
      ar: 'التصبغات والإشراقة وآثار الشمس.',
      ru: 'Пигментация, сияние и восстановление после солнца.',
    },
    signal: {
      en: 'Tone correction',
      ar: 'تصحيح اللون',
      ru: 'Коррекция тона',
    },
  },
  {
    id: 'acne-control-deck',
    path: '/products/concern/acne-treatment',
    accent: '#38bdf8',
    glow: 'from-sky-500/35 to-cyan-950/20',
    scenePosition: [2.02, 0.72, 0.05],
    title: {
      en: 'Acne Control Deck',
      ar: 'منصة التحكم بحب الشباب',
      ru: 'Acne Control Deck',
    },
    subtitle: {
      en: 'Breakouts, oil balance and pore refinement.',
      ar: 'البثور وتوازن الدهون وتنقية المسام.',
      ru: 'Высыпания, баланс себума и поры.',
    },
    signal: {
      en: 'Clear-skin path',
      ar: 'مسار صفاء البشرة',
      ru: 'Путь к чистой коже',
    },
  },
  {
    id: 'age-repair-ring',
    path: '/products/concern/anti-aging',
    accent: '#fbbf24',
    glow: 'from-amber-400/35 to-orange-950/20',
    scenePosition: [1.65, -0.98, -0.18],
    title: {
      en: 'Age Repair Ring',
      ar: 'حلقة ترميم العمر',
      ru: 'Age Repair Ring',
    },
    subtitle: {
      en: 'Firmness, wrinkles and skin-density routines.',
      ar: 'الشد والتجاعيد وكثافة البشرة.',
      ru: 'Упругость, морщины и плотность кожи.',
    },
    signal: {
      en: 'Firmness protocol',
      ar: 'بروتوكول الشد',
      ru: 'Протокол упругости',
    },
  },
  {
    id: 'professional-room',
    path: '/products/category/microneedling',
    accent: '#34d399',
    glow: 'from-emerald-400/35 to-teal-950/20',
    scenePosition: [-0.28, -1.42, 0.1],
    title: {
      en: 'Professional Protocol Room',
      ar: 'غرفة البروتوكولات الاحترافية',
      ru: 'Professional Protocol Room',
    },
    subtitle: {
      en: 'Microneedling, pro solutions and clinic workflows.',
      ar: 'الميكرونيدلينغ والحلول الاحترافية وبروتوكولات العيادات.',
      ru: 'Микронидлинг, pro-решения и клинические протоколы.',
    },
    signal: {
      en: 'Clinic-grade',
      ar: 'مستوى العيادات',
      ru: 'Проф. уровень',
    },
  },
  {
    id: 'sun-shield-field',
    path: '/products/concern/sun-protection',
    accent: '#fb923c',
    glow: 'from-orange-400/35 to-red-950/20',
    scenePosition: [-2.12, -0.7, -0.08],
    title: {
      en: 'Sun Shield Field',
      ar: 'مجال الحماية من الشمس',
      ru: 'Sun Shield Field',
    },
    subtitle: {
      en: 'SPF, UAE climate defense and daily protection.',
      ar: 'حماية SPF ومناخ الإمارات والعناية اليومية.',
      ru: 'SPF, защита в климате ОАЭ и ежедневный уход.',
    },
    signal: {
      en: 'UAE defense',
      ar: 'حماية للإمارات',
      ru: 'Защита для ОАЭ',
    },
  },
]

export function getUniverseZoneById(id: string): GenosysUniverseZone | undefined {
  return GENOSYS_UNIVERSE_ZONES.find(zone => zone.id === id)
}
