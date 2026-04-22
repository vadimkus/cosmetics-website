'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

// Lazy load ChatWidget (~950 lines, uses AI SDK) - client-only, no SSR
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false })

// Pages where chatbot should be hidden.
// `pathname?.includes(p)` match, so a single entry covers locale-prefixed
// variants (e.g. `/profile` covers `/ar/profile`, `/ru/profile/edit`, etc.).
//
// Categories:
//   - Transactional success screens (don't distract)
//   - AI-heavy flows (skin analysis already has its own AI chat)
//   - Profile area (all sub-pages)
//   - Legal / info pages (chat obstructs the long-form content it can't help with)
const HIDDEN_PAGES = [
  '/success',
  '/checkout/success',
  '/skin-recommendation',
  '/skin-analysis',
  '/profile',
  '/privacy-policy',
  '/terms',
  '/faq',
  '/about',
  '/contact',
]

export default function ChatWidgetLazy() {
  const pathname = usePathname()
  
  // Hide chatbot on success pages (cleaner UX, especially on mobile)
  const isHiddenPage = HIDDEN_PAGES.some(p => pathname?.includes(p))
  if (isHiddenPage) return null
  
  return <ChatWidget />
}
