'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, Beaker, CheckCircle2, Droplets, Layers3, Package, Rotate3D, ShieldCheck, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Product } from '@/types'
import { getProductExperience } from '@/lib/productExperience'
import DesktopExperienceGate from './DesktopExperienceGate'
import type { ChamberChapter } from './SkinBarrierChamberScene'

const SkinBarrierChamberScene = dynamic(() => import('./SkinBarrierChamberScene'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-3xl bg-gradient-to-br from-[#111827] via-[#3f0b17] to-black" />
  ),
})

interface SkinBarrierChamberProps {
  product: Product
  className?: string | undefined
}

const chapters: Array<{
  id: ChamberChapter
  label: string
  title: string
  description: string
  icon: typeof Rotate3D
}> = [
  {
    id: 'inspect',
    label: 'Inspect',
    title: 'Rotate the first chamber product',
    description: 'The chamber is ready for the real Skin Barrier GLB and 36-frame spin. Today it uses calibrated geometry so the interaction model is live.',
    icon: Rotate3D,
  },
  {
    id: 'science',
    label: 'Barrier Science',
    title: 'A visual layer for repair logic',
    description: 'Particles and membrane rings show the product story: hydration support, comfort, and barrier recovery after stress or procedures.',
    icon: Beaker,
  },
  {
    id: 'routine',
    label: 'Routine',
    title: 'Post-procedure comfort path',
    description: 'Cleanse gently, hydrate, seal with Skin Barrier, then protect during the day. This becomes a guided treatment path in the next iterations.',
    icon: Layers3,
  },
  {
    id: 'buy',
    label: 'Buy',
    title: 'Commerce stays proven',
    description: 'The immersive chamber sells the story. Price, variants, stock, favorites, and Add to Bag remain in the existing tested product controls.',
    icon: Package,
  },
]

const proofCards = [
  {
    title: 'Barrier support',
    body: 'Built around comfort, hydration and a calmer skin surface.',
    icon: ShieldCheck,
  },
  {
    title: 'Recovery layer',
    body: 'Positioned for sensitive skin and post-treatment routines.',
    icon: Sparkles,
  },
  {
    title: 'Hydration seal',
    body: 'A daily finishing step when skin feels dry or stressed.',
    icon: Droplets,
  },
]

function SkinBarrierFallback({ product }: { product: Product }) {
  return (
    <div className="hidden lg:block">
      <div className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-slate-100 p-8 shadow-xl">
        <div className="absolute left-6 top-6 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-semibold text-primary-700 backdrop-blur">
          Skin Barrier Chamber fallback
        </div>
        <div className="relative mx-auto aspect-square max-w-[560px]">
          <Image
            src={product.image || '/images/skin_barr/main.jpeg'}
            alt={product.name}
            fill
            sizes="50vw"
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default function SkinBarrierChamber({ product, className }: SkinBarrierChamberProps) {
  const [activeChapter, setActiveChapter] = useState<ChamberChapter>('inspect')
  const experience = getProductExperience(product.id, product.productNumber)
  const active = chapters.find(chapter => chapter.id === activeChapter) ?? chapters[0]!
  const assetStatus = experience?.status === 'ready' ? 'Assets live' : 'Assets pending'
  const assetNote = useMemo(() => {
    if (!experience?.spin360) return '3D/360 shell prepared for product 27.'
    return `${experience.spin360.frameCount} spin frames reserved. Waiting for optimized uploads.`
  }, [experience?.spin360])

  return (
    <DesktopExperienceGate className={className} fallback={<SkinBarrierFallback product={product} />}>
      <section className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-[#080b12] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(248,113,113,0.28),transparent_34%),radial-gradient(circle_at_82%_24%,rgba(56,189,248,0.13),transparent_28%),linear-gradient(135deg,#080b12_0%,#111827_48%,#3f0b17_100%)]" />

        <div className="relative grid min-h-[720px] grid-cols-[1fr_0.74fr]">
          <div className="relative">
            <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-100 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Skin Barrier Chamber
            </div>

            <div className="absolute bottom-6 left-6 z-10 max-w-sm rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-xs text-white/70 backdrop-blur">
              Drag to rotate · switch chapters · real GLB and spin assets will replace the placeholder.
            </div>

            <SkinBarrierChamberScene activeChapter={activeChapter} />
          </div>

          <aside className="relative flex flex-col justify-between border-l border-white/10 bg-white/[0.06] p-7 text-white backdrop-blur-md">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-rose-100">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {assetStatus}
              </div>

              <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em]">
                The first GENOSYS product chamber.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/68">
                Skin Barrier becomes the first dedicated room in the Universe: product inspection,
                barrier science, routine guidance, and commerce connected in one desktop experience.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {chapters.map(chapter => {
                  const Icon = chapter.icon
                  const selected = chapter.id === activeChapter
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      onClick={() => setActiveChapter(chapter.id)}
                      className={`rounded-2xl border p-3 text-left transition ${
                        selected
                          ? 'border-rose-200 bg-white text-gray-950 shadow-xl shadow-black/20'
                          : 'border-white/10 bg-white/[0.06] text-white/70 hover:border-white/30 hover:bg-white/[0.1]'
                      }`}
                    >
                      <Icon className={`mb-3 h-4 w-4 ${selected ? 'text-primary-600' : 'text-rose-100'}`} />
                      <span className="block text-xs font-semibold">{chapter.label}</span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.07] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-100">
                  Active chapter
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.025em]">{active.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{active.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              {proofCards.map(card => {
                const Icon = card.icon
                return (
                  <div key={card.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                        <Icon className="h-4 w-4 text-rose-100" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{card.title}</div>
                        <div className="mt-1 text-xs leading-5 text-white/58">{card.body}</div>
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="rounded-2xl border border-rose-200/20 bg-rose-500/10 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-100">Asset pipeline</div>
                <p className="mt-2 text-xs leading-5 text-white/62">{assetNote}</p>
              </div>

              <Link
                href="#product-commerce"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-950 transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                Continue to product controls
                <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </DesktopExperienceGate>
  )
}
