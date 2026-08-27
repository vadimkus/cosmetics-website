'use client'

import { useLayoutEffect } from 'react'

function supportsNativeViewTimeline() {
  return (
    typeof CSS !== 'undefined' &&
    (CSS.supports('animation-timeline: view()') ||
      CSS.supports('animation-timeline: view(block)'))
  )
}

/**
 * Home section scroll reveals - bidirectional.
 *
 * Prefer CSS view() timelines when supported (scroll up/down both animate).
 * Fallback: IntersectionObserver that resets after either viewport exit.
 */
export default function HomeScrollRevealsV2() {
  useLayoutEffect(() => {
    const root = document.querySelector('[data-home-reveals]')
    if (!root) return

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>('.reveal-on-view')
    )
    if (sections.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      sections.forEach((section) => {
        section.classList.add('reveal-ready', 'is-in-view')
        section.style.opacity = '1'
        section.style.transform = 'none'
        section.style.filter = 'none'
        section.style.animation = 'none'
      })
      return
    }

    // Native CSS view() path - platform-phase-a.v2.css owns the animation.
    if (supportsNativeViewTimeline()) {
      sections.forEach((section) => {
        section.classList.remove('reveal-ready', 'is-in-view')
        section.style.removeProperty('opacity')
        section.style.removeProperty('transform')
        section.style.removeProperty('filter')
        section.style.removeProperty('transition')
      })
      return
    }

    const show = (section: HTMLElement) => {
      section.classList.add('reveal-ready', 'is-in-view')
      section.style.opacity = '1'
      section.style.transform = 'translateY(0) scale(1)'
      section.style.filter = 'none'
    }

    const hide = (section: HTMLElement, animate: boolean) => {
      const rect = section.getBoundingClientRect()
      const exitedAbove = rect.bottom <= 0
      section.classList.add('reveal-ready')
      section.classList.remove('is-in-view')
      section.style.transition = animate
        ? 'opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1), transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), filter 0.65s ease'
        : 'none'
      section.style.opacity = '0'
      section.style.transform = exitedAbove
        ? 'translateY(-48px) scale(0.98)'
        : 'translateY(64px) scale(0.97)'
      section.style.filter = 'blur(2px)'

      if (!animate) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!section.classList.contains('is-in-view')) {
              section.style.transition =
                'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.9s ease'
            }
          })
        })
      }
    }

    sections.forEach((section) => hide(section, false))

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const section = entry.target as HTMLElement
          if (entry.isIntersecting) {
            section.style.transition =
              'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.9s ease'
            show(section)
          } else {
            hide(section, true)
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px' }
    )

    sections.forEach((section) => observer.observe(section))

    requestAnimationFrame(() => {
      const vh = window.innerHeight
      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        if (rect.top < vh * 0.88 && rect.bottom > 40) {
          section.style.transition =
            'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.9s ease'
          show(section)
        }
      }
    })

    return () => {
      observer.disconnect()
      sections.forEach((section) => {
        section.classList.remove('reveal-ready', 'is-in-view')
        section.style.removeProperty('opacity')
        section.style.removeProperty('transform')
        section.style.removeProperty('filter')
        section.style.removeProperty('transition')
      })
    }
  }, [])

  return null
}
