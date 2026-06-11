'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const ModelInspector = dynamic(() => import('./ModelInspector'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center text-gray-500">
      Loading WebGL inspector…
    </div>
  ),
})

export default function Dev3DTestPage() {
  return (
    <main className="flex h-screen w-screen flex-col bg-[#fdf6f4]">
      <header className="flex items-center justify-between border-b border-rose-100 bg-white/70 px-6 py-3 text-sm text-gray-600 backdrop-blur">
        <div>
          <strong className="text-gray-900">GLB inspector</strong> — drop file at{' '}
          <code className="rounded bg-rose-50 px-2 py-0.5 text-xs text-rose-700">
            public/models/desktop-experience/lady-head-real.glb
          </code>{' '}
          and refresh.
        </div>
        <Link href="/" className="text-rose-600 underline">
          ← back to homepage
        </Link>
      </header>
      <div className="flex-1">
        <ModelInspector />
      </div>
    </main>
  )
}
