'use client'

import Image from 'next/image'
import { RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Product360SpinProps {
  frames: string[]
  alt: string
  className?: string
  imageClassName?: string
  initialFrame?: number
  priority?: boolean
  preloadRadius?: number
}

const getWrappedFrameIndex = (index: number, total: number): number => {
  if (total <= 0) return 0
  return ((index % total) + total) % total
}

export default function Product360Spin({
  frames,
  alt,
  className,
  imageClassName,
  initialFrame = 0,
  priority = false,
  preloadRadius = 3,
}: Product360SpinProps) {
  const safeFrames = useMemo(() => frames.filter(Boolean), [frames])
  const totalFrames = safeFrames.length
  const [frameIndex, setFrameIndex] = useState(() => getWrappedFrameIndex(initialFrame, totalFrames))
  const dragState = useRef({
    active: false,
    lastX: 0,
    remainder: 0,
  })

  useEffect(() => {
    setFrameIndex(getWrappedFrameIndex(initialFrame, totalFrames))
  }, [initialFrame, totalFrames])

  useEffect(() => {
    if (typeof window === 'undefined' || totalFrames === 0) return

    const framesToPreload: string[] = []
    for (let offset = -preloadRadius; offset <= preloadRadius; offset += 1) {
      const nextIndex = getWrappedFrameIndex(frameIndex + offset, totalFrames)
      const nextFrame = safeFrames[nextIndex]
      if (nextFrame) framesToPreload.push(nextFrame)
    }

    framesToPreload.forEach((frame) => {
      const preloadedImage = new window.Image()
      preloadedImage.src = frame
    })
  }, [frameIndex, preloadRadius, safeFrames, totalFrames])

  const stepFrame = useCallback((delta: number) => {
    setFrameIndex((current) => getWrappedFrameIndex(current + delta, totalFrames))
  }, [totalFrames])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (totalFrames <= 1) return
    dragState.current = {
      active: true,
      lastX: event.clientX,
      remainder: 0,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active || totalFrames <= 1) return

    const pixelsPerFrame = 10
    const deltaX = event.clientX - dragState.current.lastX
    const totalDelta = dragState.current.remainder + deltaX
    const frameDelta = Math.trunc(totalDelta / pixelsPerFrame)

    if (frameDelta !== 0) {
      stepFrame(-frameDelta)
      dragState.current.remainder = totalDelta - frameDelta * pixelsPerFrame
      dragState.current.lastX = event.clientX
    }
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current.active = false
    dragState.current.remainder = 0
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      stepFrame(-1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      stepFrame(1)
    }
  }

  if (totalFrames === 0) {
    return (
      <div className={cn('aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-sm text-gray-500', className)}>
        360 view assets pending
      </div>
    )
  }

  const selectedFrame = safeFrames[frameIndex] || safeFrames[0] || ''

  return (
    <div className={cn('space-y-3', className)}>
      <div
        role="img"
        aria-label={`${alt}. Drag horizontally or use arrow keys to rotate.`}
        tabIndex={0}
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm outline-none ring-primary-500 transition focus-visible:ring-2"
        style={{ touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <Image
          src={selectedFrame}
          alt={`${alt} - frame ${frameIndex + 1} of ${totalFrames}`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 560px"
          className={cn('select-none object-contain p-6 md:p-8', imageClassName)}
          draggable={false}
        />

        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur">
          360 view
        </div>

        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white shadow-sm backdrop-blur">
          Drag to rotate
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
        <span>
          Frame {frameIndex + 1} / {totalFrames}
        </span>
        <button
          type="button"
          onClick={() => setFrameIndex(getWrappedFrameIndex(initialFrame, totalFrames))}
          className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
    </div>
  )
}
