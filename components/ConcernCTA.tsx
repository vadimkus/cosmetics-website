'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Sparkles } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { getLocalizedPath } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

interface ConcernCTAProps {
  locale?: Locale
}

const labels = {
  en: {
    title: 'Start Your Routine Today',
    subtitle: 'Tap products in the routine above to add them to your bag',
    viewBag: 'View Bag',
    skinAnalysis: 'AI Skin Analysis',
  },
  ar: {
    title: 'ابدأي روتينك اليوم',
    subtitle: 'اضغطي على المنتجات في الروتين أعلاه لإضافتها إلى حقيبتك',
    viewBag: 'عرض الحقيبة',
    skinAnalysis: 'تحليل البشرة بالذكاء الاصطناعي',
  },
  ru: {
    title: 'Начните уход сегодня',
    subtitle: 'Нажимайте на продукты в рутине выше, чтобы добавить их в корзину',
    viewBag: 'Перейти в корзину',
    skinAnalysis: 'AI-анализ кожи',
  },
}

export default function ConcernCTA({ locale = 'en' }: ConcernCTAProps) {
  const router = useRouter()
  const { items } = useCart()

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  )

  const t = labels[locale] || labels.en

  return (
    <section className="py-8 sm:py-10 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-lg sm:text-xl font-semibold text-[var(--cera-ink)] mb-2">
          {t.title}
        </h2>
        <p className="text-sm text-[var(--cera-muted)] mb-6">
          {t.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push(getLocalizedPath('/cart', locale))}
            disabled={totalItems === 0}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              totalItems > 0
                ? 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-rose-ink)] active:scale-95'
                : 'bg-[var(--cera-cream-deep)] text-[var(--cera-muted)] cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {t.viewBag}{totalItems > 0 ? ` (${totalItems})` : ''}
          </button>
          <button
            type="button"
            onClick={() => router.push(getLocalizedPath('/skin-recommendation', locale))}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border border-[var(--cera-line)] text-[var(--cera-body)] hover:bg-[var(--cera-cream-deep)] hover:border-[var(--cera-blush-deep)] active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {t.skinAnalysis}
          </button>
        </div>
      </div>
    </section>
  )
}
