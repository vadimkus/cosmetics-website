'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Check, Loader2, LockKeyhole, ShoppingBag, Stethoscope } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import type { Product } from '@/types'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface PublicItem {
  id: string
  productId: string
  size: string | null
  quantity: number
  available: boolean
  product: Product
}

interface PublicScript {
  id: string
  publicToken: string
  clinicName: string | null
  status: string
  expiresAt: string
  version: {
    id: string
    versionNumber: number
    careInstructions: string | null
    items: PublicItem[]
  } | null
}

export default function HomecareRecommendationClient({ token }: { token: string }) {
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)
  const [script, setScript] = useState<PublicScript | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState<Set<string>>(new Set())

  useEffect(() => {
    let active = true
    fetch(`/api/homecare/${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async response => {
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'This recommendation is unavailable.')
        if (active) setScript(result.script)
      })
      .catch(fetchError => {
        if (active) setError(fetchError instanceof Error ? fetchError.message : 'Unable to open recommendation.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [token])

  const availableItems = useMemo(
    () => script?.version?.items.filter(item => item.available) || [],
    [script],
  )

  const addRecommendedItem = (item: PublicItem) => {
    if (!script?.version || !item.available) return
    addItem(item.product, item.quantity, undefined, item.size || undefined, {
      homecare: {
        scriptId: script.id,
        versionId: script.version.id,
        scriptItemId: item.id,
        token: script.publicToken,
        addedAt: new Date().toISOString(),
      },
    })
    setAdded(current => new Set(current).add(item.id))
  }

  const addAll = () => {
    for (const item of availableItems) {
      if (!added.has(item.id)) addRecommendedItem(item)
    }
    router.push('/cart')
  }

  if (loading) {
    return <main className={`cera-page genosys-page cera-page genosys-page min-h-screen bg-[var(--cera-cream-deep)] flex items-center justify-center`}><Loader2 className="w-7 h-7 animate-spin text-[var(--cera-muted)]" /></main>
  }

  if (error || !script) {
    return (
      <main className={`cera-page genosys-page cera-page genosys-page min-h-screen bg-[var(--cera-cream-deep)] flex items-center justify-center p-5`}>
        <div className="max-w-md w-full rounded-2xl bg-white border border-[var(--cera-line)] shadow-sm p-8 text-center">
          <LockKeyhole className="w-10 h-10 text-[var(--cera-blush-deep)] mx-auto mb-4" />
          <h1 className="cera-serif text-xl text-[var(--cera-ink)]">Recommendation unavailable</h1>
          <p className="text-sm text-[var(--cera-muted)] mt-2">{error || 'This private link is invalid.'}</p>
          <button
            onClick={() => router.push('/products')}
            className="mt-6 rounded-xl bg-[var(--cera-cta)] px-5 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--cera-rose-ink)] hover:shadow-lg hover:shadow-red-600/20 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2"
          >
            Browse GENOSYS
          </button>
        </div>
      </main>
    )
  }

  const inactive = script.status !== 'ACTIVE'

  return (
    <main className={`cera-page genosys-page cera-page genosys-page min-h-screen bg-[var(--cera-cream-deep)] pb-28`}>
      <header className="bg-[var(--cera-cta)] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-7 sm:py-9">
          <div className="flex items-center justify-between gap-4 mb-7">
            <Image src="/images/genosys-wordmark-transparent.png" alt="GENOSYS" width={977} height={210} className="h-6 w-auto brightness-0 invert" />
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--cera-muted)]">
              <LockKeyhole className="w-3.5 h-3.5" /> Private link
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--cera-ink)] flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-[var(--cera-muted)]">Recommended by</p>
              <h1 className="cera-serif text-2xl sm:text-3xl ">{script.clinicName || 'Your GENOSYS clinic'}</h1>
              <p className="text-sm text-[var(--cera-muted)] mt-2">Your personalised homecare product selection</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {inactive && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 mb-5 text-sm">
            This recommendation is {script.status.toLowerCase()}. Products can no longer be added from this link.
          </div>
        )}

        {script.version?.careInstructions && (
          <section className="rounded-2xl bg-white border border-[var(--cera-line)] shadow-sm p-5 mb-5">
            <h2 className="cera-serif  text-[var(--cera-ink)] mb-2">How to use your routine</h2>
            <p className="text-sm text-[var(--cera-body)] whitespace-pre-wrap leading-relaxed">{script.version.careInstructions}</p>
          </section>
        )}

        <h2 className="cera-serif  text-[var(--cera-ink)] mb-3">Recommended products</h2>
        <div className="space-y-3">
          {(script.version?.items || []).map(item => {
            const variant = item.size
              ? item.product.variants?.find(value => value.size === item.size)
              : null
            const price = variant?.price ?? item.product.price
            const isAdded = added.has(item.id)
            return (
              <article key={item.id} className={`rounded-2xl bg-white border shadow-sm p-4 flex gap-4 ${item.available ? 'border-[var(--cera-line)]' : 'border-[var(--cera-line)] opacity-60'}`}>
                <Image src={item.product.image || '/images/genosys-logo-transparent.png'} alt={item.product.name} width={96} height={96} className="w-24 h-24 object-cover rounded-xl bg-[var(--cera-cream-deep)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--cera-ink)] leading-snug">{item.product.name}</p>
                  <p className="text-xs text-[var(--cera-muted)] mt-1">
                    {item.size ? `${item.size} · ` : ''}{Number(price).toFixed(2)} AED
                    {item.quantity > 1 ? ` · Qty ${item.quantity}` : ''}
                  </p>
                  <button
                    disabled={!item.available || inactive || isAdded}
                    onClick={() => addRecommendedItem(item)}
                    className={`mt-3 inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold shadow-sm transition-all duration-200 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[var(--cera-cream-deep)] disabled:text-[var(--cera-muted)] disabled:shadow-none ${
                      isAdded
                        ? 'bg-[var(--cera-ok-bg)] text-[var(--cera-ok)]'
                        : 'bg-[var(--cera-cta)] text-white hover:-translate-y-0.5 hover:bg-[var(--cera-rose-ink)] hover:shadow-lg hover:shadow-red-600/20'
                    }`}
                  >
                    {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    {!item.available ? 'Unavailable' : isAdded ? 'Added' : 'Add to cart'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <p className="text-xs text-[var(--cera-muted)] mt-6 leading-relaxed">
          Product availability and prices are confirmed at checkout. This private recommendation link does not contain your medical record.
        </p>
      </div>

      {!inactive && availableItems.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 bg-white/95 backdrop-blur border-t border-[var(--cera-line)] p-4 z-40">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={addAll}
              className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--cera-cta)] py-3.5 font-bold text-white shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--cera-rose-ink)] hover:shadow-xl hover:shadow-red-600/30 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2"
            >
              <ShoppingBag className="w-5 h-5" /> Add routine and view cart
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
