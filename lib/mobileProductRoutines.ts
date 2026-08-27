/**
 * Resolves the PDP "Recommended Routine" cards into plain localized strings
 * for the mobile app API (GET /api/mobile/products/[id]).
 *
 * Source of truth stays in lib/productRoutines.ts (same map the website PDP
 * renders), including beauty boxes, Revita Glow 63, and Cerabarrier 66.
 *
 * The app renders whatever this returns - new/changed routines need NO app
 * update (API-driven, same as product images/video).
 */
import { PRODUCT_ROUTINES } from '@/lib/productRoutines'
import { ROUTINE_STEP_PRODUCT_IDS } from '@/lib/routineStepLinks'
import { getRoutineStepImage } from '@/lib/routineStepImages'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

export interface MobileRoutineStep {
  title: string
  description: string
  /** Product id/productNumber the step deep-links to (null = no link) */
  productId: string | null
  /** Step product's main image path (relative, e.g. /images/mist/main.jpeg) */
  image: string | null
}

export interface MobileRoutine {
  heading: string
  steps: MobileRoutineStep[]
}

type ProductMessages = Record<string, string>

const MESSAGES: Record<'en' | 'ar' | 'ru', ProductMessages> = {
  en: (enMessages as { product: ProductMessages }).product,
  ar: (arMessages as { product: ProductMessages }).product,
  ru: (ruMessages as { product: ProductMessages }).product,
}

function pickLocale(locale: string): 'en' | 'ar' | 'ru' {
  const l = String(locale || 'en').toLowerCase()
  if (l.startsWith('ar')) return 'ar'
  if (l.startsWith('ru')) return 'ru'
  return 'en'
}

/**
 * Returns the localized recommended routine for a product, or null when the
 * product has none.
 */
export function getMobileRoutine(productIdOrNumber: string, locale: string): MobileRoutine | null {
  const key = String(productIdOrNumber || '').trim()
  if (!key) return null

  const routine = PRODUCT_ROUTINES[key]
  if (!routine) return null

  const lang = pickLocale(locale)
  const msgs = MESSAGES[lang]
  const fallback = MESSAGES.en

  const tr = (k: string): string => msgs[k] || fallback[k] || ''

  const steps: MobileRoutineStep[] = routine.steps
    .map((s) => ({
      title: tr(s.titleKey),
      description: tr(s.descKey),
      productId: ROUTINE_STEP_PRODUCT_IDS[s.titleKey] || null,
      image: getRoutineStepImage(s.titleKey),
    }))
    .filter((s) => s.title && s.description)

  if (steps.length === 0) return null

  const heading = tr(routine.headingKey)
  if (!heading) return null

  return { heading, steps }
}
