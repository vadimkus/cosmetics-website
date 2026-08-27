import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { prisma } from './prisma'
import { withPrismaRetry } from './prismaRetry'

/**
 * Shape returned to FAQClient - matches all three locale pages' `select`.
 * Keep this in sync with FAQClient.tsx's `faqItems` prop typing.
 */
export type FaqItem = {
  id: string
  category: string | null
  questionEn: string
  answerEn: string
  questionAr: string | null
  answerAr: string | null
  questionRu: string | null
  answerRu: string | null
}

const FAQ_SELECT = {
  id: true,
  category: true,
  questionEn: true,
  answerEn: true,
  questionAr: true,
  answerAr: true,
  questionRu: true,
  answerRu: true,
} as const

/**
 * ISR cache: shared across EN/AR/RU FAQ pages. Admin mutations in
 * app/api/admin/faq-items call `revalidateTag('faq', 'max')` for immediate
 * invalidation; otherwise entries age out after 5 minutes.
 */
const getActiveFaqItemsFromDb = unstable_cache(
  async (): Promise<FaqItem[]> => {
    return withPrismaRetry(
      () =>
        prisma.faqItem.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: FAQ_SELECT,
        }),
      { label: 'getActiveFaqItems' }
    )
  },
  ['active-faq-items'],
  { revalidate: 300, tags: ['faq'] }
)

/**
 * Request-scoped wrapper so EN/AR/RU pages that each fetch FAQ items
 * during the same render cycle still share one DB call.
 */
export const getActiveFaqItems = cache(
  async (): Promise<FaqItem[]> => getActiveFaqItemsFromDb()
)
