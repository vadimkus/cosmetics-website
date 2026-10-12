'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { Product } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import { useCart } from '@/components/cart/CartProvider'
import { parseBagItems } from '@/lib/mcp/catalog'
import { loginPathWithReturn } from '@/lib/loginReturn'
import { getLocalizedPath, type Locale } from '@/lib/i18n'

const COPY = {
  en: { adding: 'Adding to your bag…', missing: 'Some items could not be added:', none: 'This link has no products in it.', bag: 'Go to bag', shop: 'Browse products' },
  ru: { adding: 'Добавляем в корзину…', missing: 'Не удалось добавить:', none: 'В этой ссылке нет товаров.', bag: 'Открыть корзину', shop: 'Смотреть товары' },
  ar: { adding: 'جارٍ الإضافة إلى سلتكِ…', missing: 'تعذّرت إضافة بعض المنتجات:', none: 'لا يحتوي هذا الرابط على منتجات.', bag: 'عرض السلة', shop: 'تصفّح المنتجات' },
} as const

function cookieLocale(): Locale {
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=(en|ru|ar)/)
  return (match?.[1] as Locale) || 'en'
}

export default function AddToBagClient() {
  const router = useRouter()
  const params = useSearchParams()
  const { user, isLoading } = useAuth()
  const { addItem, _hasHydrated } = useCart()
  const [locale, setLocale] = useState<Locale>('en')
  const [missing, setMissing] = useState<string[] | null>(null)
  const started = useRef(false)

  const raw = params.get('items')
  const items = useMemo(() => parseBagItems(raw), [raw])
  const copy = COPY[locale] ?? COPY.en

  useEffect(() => {
    setLocale(cookieLocale())
  }, [])

  useEffect(() => {
    if (started.current || isLoading || !_hasHydrated || items.length === 0) return
    const here = `/add-to-bag?items=${encodeURIComponent(raw || '')}`
    const loc = cookieLocale()

    if (!user) {
      started.current = true
      router.replace(loginPathWithReturn(loc, here))
      return
    }

    // A reload of the same link must not add the items twice.
    const doneKey = `add-to-bag:${raw}`
    if (sessionStorage.getItem(doneKey)) {
      started.current = true
      router.replace(getLocalizedPath('/cart', loc))
      return
    }

    started.current = true
    ;(async () => {
      const failed: string[] = []
      for (const item of items) {
        try {
          const res = await fetch(`/api/products/${encodeURIComponent(item.product_id)}`)
          if (!res.ok) throw new Error(String(res.status))
          const product = (await res.json()) as Product
          if (!product?.id || !product.inStock || product.isPriceOnRequest) throw new Error('unavailable')
          addItem(product, item.quantity, item.color || undefined, item.size || undefined)
        } catch {
          failed.push(item.product_id)
        }
      }
      sessionStorage.setItem(doneKey, '1')
      if (failed.length === 0) {
        router.replace(getLocalizedPath('/cart', loc))
      } else {
        setMissing(failed)
      }
    })()
  }, [isLoading, _hasHydrated, user, items, raw, router, addItem])

  const bagHref = getLocalizedPath('/cart', locale)
  const shopHref = getLocalizedPath('/products', locale)

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {items.length === 0 ? (
        <>
          <p className="text-gray-700">{copy.none}</p>
          <Link href={shopHref} className="ed-cta px-6 py-3">{copy.shop}</Link>
        </>
      ) : missing ? (
        <>
          <p className="text-gray-700">{copy.missing} {missing.join(', ')}</p>
          <Link href={bagHref} className="ed-cta px-6 py-3">{copy.bag}</Link>
        </>
      ) : (
        <>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <p className="text-gray-600">{copy.adding}</p>
        </>
      )}
    </main>
  )
}
