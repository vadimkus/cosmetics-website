'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useDesktopExperience } from '@/hooks/useDesktopExperience'

const AtomFieldScene = dynamic(() => import('./AtomFieldScene'), {
  ssr: false,
  loading: () => null,
})

/**
 * Desktop hero visual:
 *   - Static portrait (petri-dish + baked-in translucent molecules)
 *   - 3D atom field overlay drifting around her with cursor parallax
 *   - Side vignette so the floating atoms read against the photo
 */
export default function DesktopHero3DVisual() {
  const experience = useDesktopExperience({ minWidth: 768 })

  return (
    <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-slate-100 shadow-2xl shadow-rose-100/70">
      <Image
        src="/images/desktop-experience/genosys-athlete-face-hero.png"
        alt="GENOSYS — clinical-grade Korean dermacosmetics with photorealistic skincare science"
        fill
        priority
        sizes="(min-width: 768px) 896px, 100vw"
        className="object-cover object-[center_30%]"
      />
      {/* Soft vignette so the floating atoms read against the photo */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-50/25 via-transparent to-rose-50/30" />
      {experience.enabled ? (
        // pointer-events ENABLED on the canvas wrapper so R3F receives mouse
        // input and the atoms drift toward / away from the cursor (parallax).
        // The hero block has no clickable elements behind, so this is safe.
        <div className="absolute inset-0">
          <AtomFieldScene />
        </div>
      ) : null}
    </div>
  )
}
