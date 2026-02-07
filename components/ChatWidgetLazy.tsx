'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

// Lazy load ChatWidget (~950 lines, uses AI SDK) - client-only, no SSR
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false })

// Pages where chatbot should be hidden
const HIDDEN_PAGES = ['/success', '/checkout/success', '/skin-recommendation', '/skin-analysis']

export default function ChatWidgetLazy() {
  const pathname = usePathname()
  
  // Hide chatbot on success pages (cleaner UX, especially on mobile)
  const isHiddenPage = HIDDEN_PAGES.some(p => pathname?.includes(p))
  if (isHiddenPage) return null
  
  return <ChatWidget />
}
