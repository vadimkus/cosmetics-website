'use client'

import dynamic from 'next/dynamic'

// Lazy load ChatWidget (~950 lines, uses AI SDK) - client-only, no SSR
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false })

export default function ChatWidgetLazy() {
  return <ChatWidget />
}
