'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ChevronRight, MousePointer2, Package, Rotate3D, ScanLine } from 'lucide-react'
import type { Product } from '@/types'
import DesktopExperienceGate from './DesktopExperienceGate'
import SkinBarrierChamber from './SkinBarrierChamber'

const ProductLabScene = dynamic(() => import('./ProductLabScene'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-3xl bg-gradient-to-br from-rose-50 via-white to-slate-100" />
  ),
})

interface DesktopProductLabProps {
  product: Product
  className?: string | undefined
}

function getProductImages(product: Product): string[] {
  if (!product.images) return [product.image]

  try {
    const parsed = JSON.parse(product.images) as unknown
    if (Array.isArray(parsed)) {
      return [product.image, ...parsed.filter((item): item is string => typeof item === 'string' && item !== product.image)]
    }
  } catch {
    // Keep the primary product image if malformed data reaches this component.
  }

  return [product.image]
}

function StaticProductFallback({ product }: { product: Product }) {
  const images = getProductImages(product)

  return (
    <div className="hidden lg:block">
      <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-gradient-to-br from-white via-rose-50 to-slate-100 p-8 shadow-xl">
        <div className="absolute right-6 top-6 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-500 backdrop-blur">
          WebGL fallback
        </div>
        <div className="relative mx-auto aspect-square max-w-[520px]">
          <Image
            src={images[0] || product.image}
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

export default function DesktopProductLab({ product, className }: DesktopProductLabProps) {
  const isSkinBarrier = product.productNumber === '27' || /skin barrier/i.test(product.name)
  const images = getProductImages(product)

  if (isSkinBarrier) {
    return <SkinBarrierChamber product={product} className={className} />
  }

  return (
    <DesktopExperienceGate className={className} fallback={<StaticProductFallback product={product} />}>
      <div className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-[#0b0f19] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(248,113,113,0.24),transparent_32%),radial-gradient(circle_at_84%_24%,rgba(255,255,255,0.12),transparent_28%)]" />

        <div className="relative grid min-h-[640px] grid-cols-[1fr_0.72fr]">
          <div className="relative">
            <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/78 backdrop-blur">
              <Rotate3D className="h-4 w-4" />
              Desktop product lab
            </div>
            <ProductLabScene productName={product.name} isSkinBarrier={isSkinBarrier} />
            <div className="absolute bottom-6 left-6 z-10 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-xs text-white/70 backdrop-blur">
              Drag to rotate · scroll to inspect depth
            </div>
          </div>

          <div className="relative flex flex-col justify-between border-l border-white/10 bg-white/[0.06] p-7 text-white backdrop-blur-md">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-rose-100">
                <ScanLine className="h-3.5 w-3.5" />
                Live prototype
              </div>
              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.035em]">
                {isSkinBarrier ? 'Skin Barrier 3D inspection' : 'Interactive product inspection'}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/68">
                This desktop layer is prepared for GLB/USDZ product models and the 36-frame
                turntable sequence. Until assets are uploaded, the scene uses a calibrated
                placeholder shape so we can build the interaction model today.
              </p>
            </div>

            <div className="space-y-3">
              {[
                ['Rotate product', 'Mouse/touchpad interaction already active'],
                ['Asset-ready', 'Swap placeholder with real GLB when prepared'],
                ['Commerce-safe', 'Price, variants and Add to Bag stay in existing DOM'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                      {title === 'Rotate product' ? <MousePointer2 className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{title}</div>
                      <div className="mt-1 text-xs leading-5 text-white/58">{description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-3 flex gap-2">
                {images.slice(0, 3).map((image, index) => (
                  <div key={`${image}-${index}`} className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/15 bg-white/10">
                    <Image src={image} alt={`${product.name} view ${index + 1}`} fill sizes="64px" className="object-contain p-1" />
                  </div>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-100">
                Existing gallery remains mobile fallback
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DesktopExperienceGate>
  )
}

export { StaticProductFallback }
