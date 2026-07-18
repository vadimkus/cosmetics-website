'use client'

import { useEffect, useRef } from 'react'

/**
 * Renders sanitized blog HTML and gives embedded videos the exact PDP behavior:
 * play button first, native controls after click, then collapse after ending.
 */
export default function BlogContentHtml({
  html,
  className,
}: {
  html: string
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const cleanups: Array<() => void> = []

    root.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
      const player = video.parentElement
      const host = player?.parentElement
      if (!player || !host) return

      video.classList.add('w-auto', 'max-w-full', 'max-h-[65vh]')
      video.preload = 'auto'
      // At short viewport heights max-h shrinks portrait video width. Keep the
      // player wrapper fitted to that width so its black background never
      // becomes visible as sidebars.
      player.style.width = 'fit-content'
      player.style.maxWidth = '100%'
      player.style.marginInline = 'auto'

      const applyAspect = () => {
        if (video.videoWidth && video.videoHeight) {
          video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`
        }
      }

      const button = document.createElement('button')
      button.type = 'button'
      button.setAttribute('aria-label', 'Watch product video')
      button.className =
        'group mx-auto flex flex-col items-center gap-2 py-2 focus:outline-none'
      button.innerHTML = `
        <span class="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-700 shadow-md transition-all group-hover:bg-gray-300 group-hover:scale-105 group-active:scale-95">
          <svg aria-hidden="true" viewBox="0 0 24 24" class="h-7 w-7 ml-0.5 fill-current">
            <path d="M8 5v14l11-7z"></path>
          </svg>
        </span>
        <span class="text-xs font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
          Watch product video
        </span>
      `

      player.hidden = true
      host.insertBefore(button, player)

      const openPlayer = () => {
        button.hidden = true
        player.hidden = false
        void video.play()
      }
      const closePlayer = () => {
        video.pause()
        player.hidden = true
        button.hidden = false
      }

      button.addEventListener('click', openPlayer)
      video.addEventListener('loadedmetadata', applyAspect)
      video.addEventListener('ended', closePlayer)
      if (video.readyState >= 1) applyAspect()

      cleanups.push(() => {
        button.removeEventListener('click', openPlayer)
        video.removeEventListener('loadedmetadata', applyAspect)
        video.removeEventListener('ended', closePlayer)
        button.remove()
        player.style.removeProperty('width')
        player.style.removeProperty('max-width')
        player.style.removeProperty('margin-inline')
        player.hidden = false
      })
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [html])

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
