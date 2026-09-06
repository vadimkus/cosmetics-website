export function productTransitionName(productIdentifier: string | null | undefined) {
  const safeIdentifier = String(productIdentifier || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return safeIdentifier
    ? `genosys-product-${safeIdentifier}-image`
    : undefined
}

function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function prefersManualMorph() {
  if (typeof navigator === 'undefined') return false
  const userAgent = navigator.userAgent
  return (
    /Safari/i.test(userAgent) &&
    !/(Chrome|Chromium|CriOS|Edg|OPR|Android)/i.test(userAgent)
  )
}

function markTransition(status: string, transitionName?: string) {
  if (typeof window === 'undefined') return
  const transitionWindow = window as Window & {
    __genosysProductVT?: string
    __genosysProductVTName?: string
    __genosysProductVTMode?: 'native' | 'manual'
  }
  transitionWindow.__genosysProductVT = status
  if (transitionName) transitionWindow.__genosysProductVTName = transitionName
}

function markTransitionMode(mode: 'native' | 'manual') {
  if (typeof window === 'undefined') return
  ;(
    window as Window & {
      __genosysProductVTMode?: 'native' | 'manual'
    }
  ).__genosysProductVTMode = mode
}

function visibleTransitionSource(transitionName: string) {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-product-vt-source]')
  ).find(source => {
    if (source.dataset.productVtSource !== transitionName) return false
    const rect = source.getBoundingClientRect()
    const computed = window.getComputedStyle(source)
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      computed.display !== 'none' &&
      computed.visibility !== 'hidden'
    )
  })
}

function isolateTransitionSource(transitionName: string) {
  const sources = Array.from(
    document.querySelectorAll<HTMLElement>('[data-product-vt-source]')
  )
  const changed: Array<{ element: HTMLElement; previousName: string }> = []
  let selectedVisibleSourceFound = false

  for (const source of sources) {
    const rect = source.getBoundingClientRect()
    const computed = window.getComputedStyle(source)
    const isVisible =
      rect.width > 0 &&
      rect.height > 0 &&
      computed.display !== 'none' &&
      computed.visibility !== 'hidden'
    const isSelected =
      source.dataset.productVtSource === transitionName &&
      isVisible &&
      !selectedVisibleSourceFound

    if (isSelected) {
      selectedVisibleSourceFound = true
      continue
    }

    changed.push({
      element: source,
      previousName: source.style.viewTransitionName,
    })
    source.style.viewTransitionName = 'none'
  }

  return () => {
    for (const { element, previousName } of changed) {
      element.style.viewTransitionName = previousName
    }
  }
}

function navigateWithManualMorph(
  navigate: () => void,
  transitionName: string
) {
  const source = visibleTransitionSource(transitionName)
  const sourceImage = source?.querySelector<HTMLImageElement>('img')

  if (!source || !sourceImage || typeof source.animate !== 'function') {
    markTransition('unsupported', transitionName)
    navigate()
    return
  }

  const sourceRect = source.getBoundingClientRect()
  const sourceRadius = window.getComputedStyle(source).borderRadius
  const previousSourceOpacity = source.style.opacity
  const overlay = document.createElement('div')
  const imageClone = sourceImage.cloneNode(true) as HTMLImageElement

  imageClone.src = sourceImage.currentSrc || sourceImage.src
  imageClone.removeAttribute('srcset')
  imageClone.removeAttribute('sizes')
  imageClone.removeAttribute('loading')
  imageClone.style.width = '100%'
  imageClone.style.height = '100%'
  imageClone.style.objectFit = 'contain'
  imageClone.style.transform = 'none'
  imageClone.style.display = 'block'

  Object.assign(overlay.style, {
    position: 'fixed',
    left: `${sourceRect.left}px`,
    top: `${sourceRect.top}px`,
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    zIndex: '2147483646',
    pointerEvents: 'none',
    overflow: 'hidden',
    background: '#ffffff',
    borderRadius: sourceRadius,
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.14)',
    contain: 'layout paint',
    willChange: 'left, top, width, height, opacity',
    viewTransitionName: 'none',
  })
  overlay.appendChild(imageClone)
  document.body.appendChild(overlay)
  source.style.opacity = '0'

  markTransitionMode('manual')
  markTransition('navigating', transitionName)
  navigate()

  const startedAt = performance.now()
  const waitForTarget = () => {
    const target = document.querySelector<HTMLElement>(
      `[data-product-vt-target="${transitionName}"]`
    )

    if (target) {
      const targetRect = target.getBoundingClientRect()
      const previousTargetOpacity = target.style.opacity
      target.style.opacity = '0'

      const animation = overlay.animate(
        [
          {
            left: `${sourceRect.left}px`,
            top: `${sourceRect.top}px`,
            width: `${sourceRect.width}px`,
            height: `${sourceRect.height}px`,
            opacity: 1,
          },
          {
            left: `${targetRect.left}px`,
            top: `${targetRect.top}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            opacity: 1,
            offset: 0.86,
          },
          {
            left: `${targetRect.left}px`,
            top: `${targetRect.top}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
            opacity: 0,
          },
        ],
        {
          duration: 700,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards',
        }
      )

      void animation.finished
        .catch(() => undefined)
        .finally(() => {
          target.style.opacity = previousTargetOpacity
          source.style.opacity = previousSourceOpacity
          overlay.remove()
          markTransition('committed', transitionName)
        })
      return
    }

    if (performance.now() - startedAt > 2000) {
      source.style.opacity = previousSourceOpacity
      overlay.remove()
      markTransition('commit-timeout', transitionName)
      return
    }

    window.setTimeout(waitForTarget, 16)
  }

  window.setTimeout(waitForTarget, 0)
}

/**
 * Navigate while keeping the View Transition update callback open until the
 * Next.js route has committed (or a short safety timeout expires).
 */
export function navigateProductWithTransition(
  href: string,
  navigate: () => void,
  transitionName?: string
) {
  if (typeof document === 'undefined') {
    navigate()
    return
  }

  if (!transitionName || reducedMotion()) {
    markTransition(transitionName ? 'reduced-motion' : 'missing-name', transitionName)
    navigate()
    return
  }

  if (prefersManualMorph()) {
    navigateWithManualMorph(navigate, transitionName)
    return
  }

  const startVT = (
    document as Document & {
      startViewTransition?: (callback: () => void | Promise<void>) => {
        finished: Promise<void>
      }
    }
  ).startViewTransition

  if (typeof startVT !== 'function') {
    navigateWithManualMorph(navigate, transitionName)
    return
  }

  const targetPath = new URL(href, window.location.href).pathname
  let navigationStarted = false
  const restoreSources = isolateTransitionSource(transitionName)

  try {
    markTransitionMode('native')
    markTransition('starting', transitionName)
    const transition = startVT.call(document, () => {
      return new Promise<void>((resolve) => {
        const startedAt = performance.now()
        navigationStarted = true
        markTransition('navigating', transitionName)
        navigate()

        const waitForCommit = () => {
          const target = document.querySelector<HTMLElement>('[data-product-vt-target]')
          const routeCommitted =
            window.location.pathname === targetPath &&
            target?.dataset.productVtTarget === transitionName

          if (routeCommitted) {
            markTransition('committed', transitionName)
            resolve()
            return
          }

          if (performance.now() - startedAt > 1500) {
            markTransition('commit-timeout', transitionName)
            resolve()
            return
          }

          // requestAnimationFrame is paused while a View Transition update
          // callback is pending, so polling with it deadlocks the transition.
          window.setTimeout(waitForCommit, 16)
        }
        window.setTimeout(waitForCommit, 0)
      })
    })

    if (transition?.finished) {
      settleViewTransition(transition as ViewTransitionLike)
      void transition.finished
        .catch(() => {
          markTransition('finished-error', transitionName)
        })
        .finally(restoreSources)
    } else {
      restoreSources()
    }
  } catch {
    restoreSources()
    markTransition('catch-fallback', transitionName)
    if (!navigationStarted) navigate()
  }
}

export function updateProductImageWithTransition(update: () => void) {
  if (
    typeof document === 'undefined' ||
    reducedMotion() ||
    typeof (
      document as Document & { startViewTransition?: unknown }
    ).startViewTransition !== 'function'
  ) {
    update()
    return
  }

  try {
    const transition = (
      document as Document & {
        startViewTransition: (callback: () => void) => ViewTransitionLike | undefined
      }
    ).startViewTransition(update)
    settleViewTransition(transition)
  } catch {
    update()
  }
}

type ViewTransitionLike = {
  ready?: Promise<void>
  finished?: Promise<void>
  updateCallbackDone?: Promise<void>
}

/**
 * A view transition that is skipped (a second tap arrives before the first
 * one finishes, or the tab is hidden) rejects `ready`, `finished` and
 * `updateCallbackDone` with "InvalidStateError: Transition was aborted
 * because of invalid state". Chrome surfaces any of the three left dangling
 * as an unhandled rejection (JAVASCRIPT-NEXTJS-1T). The update has already
 * run by then, so there is nothing to recover: just swallow them.
 */
export function settleViewTransition(transition: ViewTransitionLike | null | undefined): void {
  if (!transition) return
  transition.ready?.catch(() => undefined)
  transition.finished?.catch(() => undefined)
  transition.updateCallbackDone?.catch(() => undefined)
}
