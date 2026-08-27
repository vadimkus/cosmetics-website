'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useChat } from '@ai-sdk/react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { useCartStore } from '@/lib/cartStore'
import { useToast } from '@/components/ToastProvider'
import { MessageCircle, X, Send, Loader2, Sparkles, User, Minimize2, ShoppingCart, Check } from 'lucide-react'
import { errorLog } from '@/lib/logger'

interface ChatWidgetProps {
  className?: string
}

// Helper to extract text from UIMessage parts
function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts) return ''
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text || '')
    .join('')
}

// Helper to check if URL is internal (same site) - excludes documents/PDFs
function isInternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin)
    const pathname = urlObj.pathname.toLowerCase()
    
    // Documents and PDFs should open in new tab, not internal navigation
    if (pathname.includes('/documents/') || pathname.endsWith('.pdf')) {
      return false
    }
    
    // Check if it's a genosys.ae link or relative path
    return urlObj.hostname === 'genosys.ae' || 
           urlObj.hostname === 'www.genosys.ae' ||
           urlObj.hostname === window.location.hostname ||
           url.startsWith('/')
  } catch {
    // If URL parsing fails, treat as internal if it starts with /
    return url.startsWith('/') && !url.toLowerCase().includes('/documents/')
  }
}

// Helper to get internal path from URL
function getInternalPath(url: string): string {
  try {
    const urlObj = new URL(url, window.location.origin)
    // Return pathname + search + hash for internal navigation
    return urlObj.pathname + urlObj.search + urlObj.hash
  } catch {
    return url
  }
}

// Component to render a single link (internal or external)
function ChatLink({ 
  url, 
  children, 
  onInternalClick 
}: { 
  url: string
  children: React.ReactNode
  onInternalClick: (path: string) => void
}) {
  const isInternal = isInternalUrl(url)
  
  const handleClick = (e: React.MouseEvent) => {
    if (isInternal) {
      e.preventDefault()
      const path = getInternalPath(url)
      onInternalClick(path)
    }
    // External links will open in new tab naturally
  }
  
  return (
    <a
      href={url}
      onClick={handleClick}
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      className="text-[var(--cera-rose-ink)] dark:text-[var(--cera-rose)] underline hover:text-[var(--cera-ink)] dark:hover:text-[var(--cera-blush)] font-medium cursor-pointer"
    >
      {children}
    </a>
  )
}

// Product Card component for chat - shows image, name, price, size
interface ProductData {
  id: string
  name: string
  price: number
  image: string
  size?: string
}

function ChatProductCard({ 
  productId, 
  productName,
  productUrl,
  onAddToCart,
  onInternalClick,
  locale
}: { 
  productId: string
  productName: string
  productUrl: string
  onAddToCart: (id: string, name: string) => void
  onInternalClick: () => void
  locale: string
}) {
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [added, setAdded] = useState(false)
  const addedTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clean up timer on unmount
  useEffect(() => () => { if (addedTimerRef.current) clearTimeout(addedTimerRef.current) }, [])
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        } else {
          setError(true)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])
  
  const handleAddToCart = () => {
    if (!added && product) {
      onAddToCart(productId, product.name)
      setAdded(true)
      addedTimerRef.current = setTimeout(() => setAdded(false), 3000)
    }
  }
  
  const handleCardClick = () => {
    onInternalClick()
    window.location.href = productUrl
  }
  
  // Translations
  const cardText = {
    en: { add: 'Add to Bag', added: 'Added!', aed: 'AED' },
    ar: { add: 'أضف للسلة', added: 'تمت الإضافة!', aed: 'درهم' },
    ru: { add: 'В корзину', added: 'Добавлено!', aed: 'AED' },
  }
  const text = cardText[locale as keyof typeof cardText] || cardText.en
  
  // Loading state - compact skeleton
  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 p-2 bg-[var(--cera-cream-deep,#f2eceb)] dark:bg-gray-800 rounded-lg animate-pulse my-1">
        <div className="w-12 h-12 bg-[var(--cera-cream-deep,#f2eceb)] dark:bg-gray-700 rounded-md" />
        <div className="flex flex-col gap-1">
          <div className="w-24 h-3 bg-[var(--cera-cream-deep,#f2eceb)] dark:bg-gray-700 rounded" />
          <div className="w-16 h-2 bg-[var(--cera-cream-deep,#f2eceb)] dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }
  
  // Error state - fallback to simple link
  if (error || !product) {
    return (
      <span className="inline-flex items-center gap-1">
        <a 
          href={productUrl}
          onClick={(e) => { e.preventDefault(); handleCardClick() }}
          className="text-[var(--cera-rose-ink)] hover:text-[var(--cera-ink)] underline"
        >
          {productName}
        </a>
      </span>
    )
  }
  
  // Product card - compact inline design
  return (
    <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 rounded-xl border border-[var(--cera-line,#e9e1de)] dark:border-gray-700 shadow-sm my-1.5 max-w-[280px] hover:shadow-md transition-shadow">
      {/* Product Image */}
      <a 
        href={productUrl}
        onClick={(e) => { e.preventDefault(); handleCardClick() }}
        className="flex-shrink-0"
      >
        <Image
          src={product.image || '/images/genosys-logo-transparent.png'}
          alt={product.name}
          width={56}
          height={56}
          className="w-14 h-14 object-cover rounded-lg border border-[var(--cera-line,#e9e1de)] dark:border-gray-600 hover:scale-105 transition-transform"
        />
      </a>
      
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <a 
          href={productUrl}
          onClick={(e) => { e.preventDefault(); handleCardClick() }}
          className="block"
        >
          <p className="text-xs font-medium text-[var(--cera-ink,#17140f)] dark:text-gray-200 line-clamp-2 hover:text-[var(--cera-rose-ink)] dark:hover:text-[var(--cera-rose)] transition-colors leading-tight">
            {product.name}
          </p>
        </a>
        <div className="flex items-center justify-between mt-1 gap-2">
          <div>
            <p className="text-xs font-bold text-[var(--cera-rose-ink)] dark:text-[var(--cera-rose)]">
              {text.aed} {product.price}
            </p>
            {product.size && (
              <p className="text-[10px] text-[var(--cera-muted,#6a625d)]">{product.size}</p>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium
              transition-all duration-200 whitespace-nowrap
              ${added 
                ? 'bg-green-500 text-white' 
                : 'bg-[var(--cera-cta)] text-white hover:bg-[var(--cera-body)]'
              }
            `}
          >
            {added ? (
              <>
                <Check className="w-3 h-3" />
                {text.added}
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3" />
                {text.add}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper to get user's time context for personalized greetings
function getUserContext() {
  const now = new Date()
  const hour = now.getHours()
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' })
  
  // Determine time of day
  let timeOfDay: string
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning'
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon'
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'evening'
  } else {
    timeOfDay = 'night'
  }
  
  // UAE weekend is Friday-Saturday
  const isWeekend = dayOfWeek === 'Friday' || dayOfWeek === 'Saturday'
  
  return {
    timeOfDay,
    dayOfWeek,
    isWeekend,
    localTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

export default function ChatWidget({ className = '' }: ChatWidgetProps) {
  const { locale, dir } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const addItem = useCartStore((state) => state.addItem)
  const { showToast } = useToast()
  const isRTL = dir === 'rtl'
  
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const focusTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get user context for personalized greetings (used for welcome message)
  const userContext = getUserContext()
  
  // Handle internal link navigation
  const handleInternalLinkClick = useCallback((path: string) => {
    router.push(path)
  }, [router])
  
  // Toast translations
  const toastStrings = {
    en: { addedToBag: 'added to bag! 🛍️', error: 'Could not add product. Please try again.' },
    ar: { addedToBag: 'تمت الإضافة إلى السلة! 🛍️', error: 'تعذرت إضافة المنتج. يرجى المحاولة مرة أخرى.' },
    ru: { addedToBag: 'добавлено в корзину! 🛍️', error: 'Не удалось добавить. Попробуйте снова.' },
  }
  const toastText = toastStrings[locale as keyof typeof toastStrings] || toastStrings.en

  // Handle add to cart from chat
  const handleAddToCart = useCallback(async (productId: string, productName: string) => {
    try {
      // Fetch product data from public API
      const response = await fetch(`/api/products/${productId}`)
      if (response.ok) {
        const product = await response.json()
        addItem(product, 1)
        showToast(`${productName} ${toastText.addedToBag}`, 'success')
      } else {
        showToast(toastText.error, 'error')
      }
    } catch {
      showToast(toastText.error, 'error')
    }
  }, [addItem, showToast, toastText])
  
  // Render text with markdown links and Add to Cart buttons
  // Parses: [Product Name](url){{id:NUMBER}} format (with optional ** markdown bold)
  const renderMessageWithLinks = useCallback((text: string): React.ReactNode => {
    // First, clean up the text - remove {{id:NUMBER}} that appears separately and extract IDs
    // The AI sometimes outputs: **[Product Name](url)**{{id:15}} instead of [Product Name](url){{id:15}}
    
    // Match: [text](url) optionally followed by {{id:number}} (with possible ** around it)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)\*{0,2}\s*\{\{id:(\d+)\}\}/g
    
    // First pass: find all links with product IDs
    const productLinks: Map<string, string> = new Map()
    let productMatch
    while ((productMatch = linkRegex.exec(text)) !== null) {
      const [, , url = '', productId = ''] = productMatch
      if (url && productId && url.includes('/products/')) {
        productLinks.set(url, productId)
      }
    }
    
    // Clean the text - remove standalone {{id:NUMBER}} patterns
    const cleanedText = text.replace(/\*{0,2}\s*\{\{id:\d+\}\}/g, '')
    
    // Combined regex to match both images and links in order
    // Images: ![alt](url)
    // Links: [text](url)
    const combinedRegex = /(!?\[([^\]]*)\]\(([^)]+)\))/g
    
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match
    let keyIndex = 0

    while ((match = combinedRegex.exec(cleanedText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanedText.slice(lastIndex, match.index))
      }
      
      const [fullMatch, , innerText = '', url = ''] = match
      const isImage = fullMatch.startsWith('!')
      
      if (isImage) {
        // Render image with nice styling
        parts.push(
          <div key={keyIndex++} className="my-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary URL from AI markdown, hosts unknown */}
            <img 
              src={url}
              alt={innerText || 'Skincare image'}
              className="max-w-full w-auto max-h-48 rounded-xl shadow-md border border-[var(--cera-line,#e9e1de)] dark:border-gray-700 object-cover"
              loading="lazy"
              onError={(e) => {
                // Hide broken images
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            {innerText && (
              <p className="text-xs text-[var(--cera-muted,#6a625d)] dark:text-gray-400 mt-1 italic">{innerText}</p>
            )}
          </div>
        )
      } else {
        // It's a link
        const productId = productLinks.get(url)
        const isProductLink = !!productId
        
        if (isProductLink) {
          // Product link - render as product card with image
          parts.push(
            <ChatProductCard
              key={keyIndex++}
              productId={productId}
              productName={innerText}
              productUrl={url}
              onAddToCart={handleAddToCart}
              onInternalClick={() => handleInternalLinkClick(url.replace('https://genosys.ae', ''))}
              locale={locale}
            />
          )
        } else {
          // Regular link - render as text link
          parts.push(
            <ChatLink
              key={keyIndex++}
              url={url}
              onInternalClick={handleInternalLinkClick}
            >
              {innerText}
            </ChatLink>
          )
        }
      }
      
      lastIndex = match.index + fullMatch.length
    }
    
    if (lastIndex < cleanedText.length) {
      parts.push(cleanedText.slice(lastIndex))
    }
    
    return parts.length > 0 ? parts : cleanedText
  }, [handleInternalLinkClick, handleAddToCart, locale])
  
  // Generate unique chat session ID (persists across page refreshes within session)
  const [chatSessionId] = useState(() => {
    if (typeof window === 'undefined') return `chat_${Date.now()}`
    const stored = sessionStorage.getItem('genosys_chat_id')
    if (stored) return stored
    const newId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem('genosys_chat_id', newId)
    return newId
  })

  const { messages, status, error, sendMessage, setMessages } = useChat({
    id: 'genosys-chat',
    onError: (error) => {
      errorLog('Chat error:', error)
    },
  })
  
  // Wrapper to send message with locale, context, and chatId for tracking
  const sendMessageWithLocale = useCallback(async (message: { text: string }) => {
    await sendMessage(message, {
      body: {
        locale,
        context: userContext,
        chatId: chatSessionId,
      },
    })
  }, [sendMessage, locale, userContext, chatSessionId])

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      focusTimerRef.current = setTimeout(() => inputRef.current?.focus(), 100)
    }
    return () => { if (focusTimerRef.current) clearTimeout(focusTimerRef.current) }
  }, [isOpen, isMinimized])

  // Clear welcome message after first user message
  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false)
    }
  }, [messages])

  // Detect mobile web
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileWeb(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Hide chatbot on critical pages on mobile web to improve UX
  const hiddenPages = ['/cart', '/bag', '/checkout', '/profile', '/login', '/bundle-builder', '/success', '/forgot-password', '/reset-password']
  const isHiddenPage = hiddenPages.some(page => 
    pathname === page || 
    pathname?.startsWith(`/en${page}`) || 
    pathname?.startsWith(`/ar${page}`) || 
    pathname?.startsWith(`/ru${page}`)
  )
  const isPurchasePage = ['/cart', '/checkout'].some(page =>
    pathname === page ||
    pathname?.startsWith(`/en${page}`) ||
    pathname?.startsWith(`/ar${page}`) ||
    pathname?.startsWith(`/ru${page}`)
  )

  // Product pages have a dense mobile sticky purchase bar. The floating chat
  // button overlaps that primary action, so keep Genie off PDPs on mobile web.
  const isProductPage =
    pathname?.match(/^\/(en|ar|ru)?\/products\/[^/]+/) ||
    pathname?.match(/^\/products\/[^/]+/)
  
  // Cart and checkout are enclosed purchase journeys on every viewport.
  // Mobile web retains the wider critical-page/PDP suppression as well.
  if (isPurchasePage || (isMobileWeb && (isHiddenPage || isProductPage))) {
    return null
  }

  // Desktop product pages carry a sticky purchase bar pinned to the bottom of
  // the viewport, and its own add-to-bag button sits in the bottom-right corner
  // - underneath this widget. At `bottom-6` the bubble lands on top of the one
  // control the page exists to offer. Mobile web solves that by hiding Genie on
  // PDPs entirely; on desktop there is room to simply sit above the bar.
  const desktopBottomClass = isProductPage ? 'md:bottom-28' : 'md:bottom-6'

  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleClearChat = () => {
    setMessages([])
    setShowWelcome(true)
    setInputValue('')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      const message = inputValue.trim()
      setInputValue('')
      await sendMessageWithLocale({ text: message })
    }
  }

  const handleQuickAction = (text: string) => {
    setInputValue(text)
  }

  // Time-based greeting helper with emojis
  const getTimeGreeting = (timeOfDay: string, lang: string): string => {
    const greetings: Record<string, Record<string, string>> = {
      morning: { en: 'Good morning! ☀️', ar: 'صباح الخير! ☀️', ru: 'Доброе утро! ☀️' },
      afternoon: { en: 'Good afternoon! 🌤️', ar: 'مساء الخير! 🌤️', ru: 'Добрый день! 🌤️' },
      evening: { en: 'Good evening! 🌅', ar: 'مساء الخير! 🌅', ru: 'Добрый вечер! 🌅' },
      night: { en: 'Hello! 🌙', ar: 'مرحباً! 🌙', ru: 'Здравствуйте! 🌙' },
    }
    const timeGreet = greetings[timeOfDay]
    const fallback = greetings['afternoon']
    return timeGreet?.[lang] ?? fallback?.[lang] ?? 'Hello! 👋'
  }

  // Weekend/weekday message
  const getContextMessage = (isWeekend: boolean, timeOfDay: string, lang: string) => {
    if (isWeekend) {
      const messages: Record<string, string> = {
        en: 'Happy weekend! Perfect time for some skincare self-care 💆‍♀️✨',
        ar: 'عطلة سعيدة! وقت مثالي للعناية ببشرتك 💆‍♀️✨',
        ru: 'Хороших выходных! Идеальное время для ухода за собой 💆‍♀️✨',
      }
      return messages[lang] || messages.en
    }
    
    // Weekday time-specific messages
    const weekdayMessages: Record<string, Record<string, string>> = {
      morning: {
        en: 'Ready to start your day with glowing skin? 🌟',
        ar: 'مستعد لبدء يومك ببشرة متألقة؟ 🌟',
        ru: 'Готовы начать день с сияющей кожей? 🌟',
      },
      afternoon: {
        en: 'How can I help with your skincare today? 💫',
        ar: 'كيف يمكنني مساعدتك في العناية ببشرتك اليوم؟ 💫',
        ru: 'Чем могу помочь с уходом за кожей сегодня? 💫',
      },
      evening: {
        en: 'Evening is perfect for skincare rituals! 🌙✨',
        ar: 'المساء مثالي لروتين العناية بالبشرة! 🌙✨',
        ru: 'Вечер идеален для ритуала ухода! 🌙✨',
      },
      night: {
        en: 'Night is when your skin regenerates most! 💤✨',
        ar: 'الليل هو وقت تجدد بشرتك! 💤✨',
        ru: 'Ночь - время регенерации кожи! 💤✨',
      },
    }
    const timeMsg = weekdayMessages[timeOfDay]
    const fallbackMsg = weekdayMessages['afternoon']
    return timeMsg?.[lang] ?? fallbackMsg?.[lang] ?? 'How can I help you today? 💫'
  }

  // Hardcoded translations by locale with contextual greetings
  const timeGreeting = getTimeGreeting(userContext.timeOfDay, locale)
  const contextMsg = getContextMessage(userContext.isWeekend, userContext.timeOfDay, locale)
  
  const chatStrings = {
    en: {
      title: 'Genie ✨ Your Beauty Genie',
      welcome: `${timeGreeting}\n\n${contextMsg}\n\nHi lovely! I'm Genie, your GENOSYS Beauty Genie! ✨ Your wish for beautiful skin is my command! Ask me anything about Korean dermacosmetics, routines, or ingredients - I'm here to help! 💫`,
      placeholder: 'Ask Genie about skincare, routines...',
      send: 'Send',
      typing: 'Genie is working magic... ✨',
      error: 'Oops! Even genies have off moments. Please try again! 💫',
      clear: 'Clear chat',
    },
    ar: {
      title: 'جيني ✨ مساعدة الجمال',
      welcome: `${timeGreeting}\n\n${contextMsg}\n\nأهلاً! أنا جيني، مساعدة الجمال من جينوسيس! ✨ أمنيتك بالبشرة الجميلة هي أمري! اسأليني عن مستحضرات التجميل الكورية! 💫`,
      placeholder: 'اسألي جيني عن العناية بالبشرة...',
      send: 'إرسال',
      typing: 'جيني تحضر السحر... ✨',
      error: 'عذراً! حتى الجنيات لديهن لحظات صعبة. حاولي مرة أخرى! 💫',
      clear: 'مسح المحادثة',
    },
    ru: {
      title: 'Джинни ✨ Ваш Бьюти-Джинн',
      welcome: `${timeGreeting}\n\n${contextMsg}\n\nПривет, красотка! Я Джинни, ваш бьюти-джинн от GENOSYS! ✨ Ваше желание красивой кожи - мой приказ! Спрашивайте о корейской косметике! 💫`,
      placeholder: 'Спросите Джинни об уходе...',
      send: 'Отправить',
      typing: 'Джинни творит магию... ✨',
      error: 'Ой! Даже джинны ошибаются. Попробуйте снова! 💫',
      clear: 'Очистить чат',
    },
  }
  
  const strings = chatStrings[locale as keyof typeof chatStrings] || chatStrings.en
  const chatTitle = strings.title
  const chatWelcome = strings.welcome
  const chatPlaceholder = strings.placeholder
  const chatSend = strings.send
  const chatTyping = strings.typing
  const chatError = strings.error
  const chatClear = strings.clear

  // Floating button (when closed)
  if (!isOpen) {
    // Sits one gutter above the mobile web tab bar, whose height is published as
    // --mobile-nav-height in globals.css. Mobile web PDPs return null above, so there is no
    // product-page case here.
    const mobileBottomClass = 'bottom-[calc(var(--mobile-nav-height,58px)+16px)]'

    return (
      <button
        onClick={handleOpen}
        className={`
          fixed z-50 p-4 rounded-full shadow-lg
          bg-[var(--cera-ink)] hover:bg-[var(--cera-body)]
          text-white transition-all duration-300
          hover:scale-110 active:scale-95
          ${isRTL ? 'left-4 md:left-6' : 'right-4 md:right-6'}
          ${mobileBottomClass} ${desktopBottomClass}
          ${className}
        `}
        aria-label={chatTitle}
      >
        <MessageCircle className="w-6 h-6" />
        {/* Notification dot */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      </button>
    )
  }

  // Chat window
  return (
    <div
      className={`
        fixed z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
        flex flex-col overflow-hidden
        transition-all duration-300 ease-out
        ${isRTL ? 'left-4 md:left-6' : 'right-4 md:right-6'}
        ${isMinimized
          ? `bottom-[calc(var(--mobile-nav-height,58px)+16px)] ${desktopBottomClass} w-72 h-14`
          : `bottom-[calc(var(--mobile-nav-height,58px)+16px)] ${desktopBottomClass} w-[calc(100%-2rem)] md:w-96 h-[65vh] md:h-[500px] md:max-h-[70vh]`
        }
        ${className}
      `}
      dir={dir}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--cera-cta)] text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold text-sm">{chatTitle}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleMinimize}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat content (hidden when minimized) */}
      {!isMinimized && (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--cera-cream-deep,#f2eceb)] dark:bg-gray-800">
            {/* Welcome message */}
            {showWelcome && messages.length === 0 && (
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--cera-blush)] dark:bg-gray-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--cera-rose-ink)] dark:text-[var(--cera-rose)]" />
                </div>
                <div className="flex-1 bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <p className="text-sm text-[var(--cera-body,#3c3733)] dark:text-gray-200">{chatWelcome}</p>
                  {/* Quick action buttons - row 1: skin types */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'ما المنتجات التي تنصحين بها للبشرة الجافة؟' :
                        locale === 'ru' ? 'Какие продукты вы рекомендуете для сухой кожи?' :
                        'What products do you recommend for dry skin?'
                      )}
                      emoji="💧"
                    >
                      {locale === 'ar' ? 'بشرة جافة' : locale === 'ru' ? 'Сухая кожа' : 'Dry skin'}
                    </QuickActionButton>
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'ما المنتجات التي تنصحين بها للبشرة الدهنية؟' :
                        locale === 'ru' ? 'Какие продукты вы рекомендуете для жирной кожи?' :
                        'What products do you recommend for oily skin?'
                      )}
                      emoji="🧴"
                    >
                      {locale === 'ar' ? 'بشرة دهنية' : locale === 'ru' ? 'Жирная кожа' : 'Oily skin'}
                    </QuickActionButton>
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'أخبريني عن منتجات مكافحة الشيخوخة' :
                        locale === 'ru' ? 'Расскажите мне об антивозрастных продуктах' :
                        'Tell me about anti-aging products'
                      )}
                      emoji="✨"
                    >
                      {locale === 'ar' ? 'مكافحة الشيخوخة' : locale === 'ru' ? 'Антивозрастные' : 'Anti-aging'}
                    </QuickActionButton>
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'أريد بشرة زجاجية كورية!' :
                        locale === 'ru' ? 'Как добиться корейской стеклянной кожи?' :
                        'How do I get Korean glass skin?'
                      )}
                      emoji="🪞"
                    >
                      {locale === 'ar' ? 'بشرة زجاجية' : locale === 'ru' ? 'Стеклянная кожа' : 'Glass skin'}
                    </QuickActionButton>
                  </div>
                  {/* Quick action buttons - row 2: concerns & info */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'لدي حب الشباب وبشرة حساسة' :
                        locale === 'ru' ? 'У меня акне и чувствительная кожа' :
                        'I have acne and sensitive skin'
                      )}
                      emoji="🌿"
                    >
                      {locale === 'ar' ? 'حساسة/حب الشباب' : locale === 'ru' ? 'Акне' : 'Acne/Sensitive'}
                    </QuickActionButton>
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'ما هو روتين العناية اليومي المثالي؟' :
                        locale === 'ru' ? 'Какой идеальный ежедневный уход?' :
                        'What\'s the perfect daily skincare routine?'
                      )}
                      emoji="📋"
                    >
                      {locale === 'ar' ? 'روتين يومي' : locale === 'ru' ? 'Ежедневный уход' : 'Daily routine'}
                    </QuickActionButton>
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'ما الذي يميز جينوسيس؟' :
                        locale === 'ru' ? 'Что особенного в GENOSYS?' :
                        'What makes GENOSYS special?'
                      )}
                      emoji="🏆"
                    >
                      {locale === 'ar' ? 'لماذا جينوسيس؟' : locale === 'ru' ? 'Почему GENOSYS?' : 'Why GENOSYS?'}
                    </QuickActionButton>
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'أفضل المنتجات للحماية من الشمس' :
                        locale === 'ru' ? 'Лучшая защита от солнца?' :
                        'Best sun protection for UAE weather?'
                      )}
                      emoji="☀️"
                    >
                      {locale === 'ar' ? 'حماية الشمس' : locale === 'ru' ? 'Защита от солнца' : 'Sun protection'}
                    </QuickActionButton>
                  </div>
                  {/* Quick action buttons - row 3: special features */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'كيف أحصل على خصم 20%؟ أخبريني عن بناء الطقم' :
                        locale === 'ru' ? 'Как получить скидку 20%? Расскажите о создании набора' :
                        'How do I get 20% off? Tell me about Build Your Set'
                      )}
                      emoji="🎁"
                      highlight
                    >
                      {locale === 'ar' ? '20% خصم!' : locale === 'ru' ? '20% скидка!' : '20% OFF!'}
                    </QuickActionButton>
                    <QuickActionButton
                      onClick={() => handleQuickAction(
                        locale === 'ar' ? 'لا أعرف نوع بشرتي، هل يمكنك تحليلها؟' :
                        locale === 'ru' ? 'Не знаю свой тип кожи, можете проанализировать?' :
                        'I don\'t know my skin type, can you analyze it with AI?'
                      )}
                      emoji="📸"
                      highlight
                    >
                      {locale === 'ar' ? 'تحليل AI للبشرة' : locale === 'ru' ? 'AI анализ кожи' : 'AI Skin Analysis'}
                    </QuickActionButton>
                  </div>
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((message) => {
              const messageText = getMessageText(message)
              if (!messageText) return null
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? (isRTL ? 'flex-row' : 'flex-row-reverse') : (isRTL ? 'flex-row-reverse' : '')}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-[var(--cera-cream-deep,#f2eceb)] dark:bg-gray-600' 
                      : 'bg-[var(--cera-blush)] dark:bg-gray-700'
                  }`}>
                    {message.role === 'user' 
                      ? <User className="w-4 h-4 text-[var(--cera-body,#3c3733)] dark:text-gray-300" />
                      : <Sparkles className="w-4 h-4 text-[var(--cera-rose-ink)] dark:text-[var(--cera-rose)]" />
                    }
                  </div>
                  <div className={`flex-1 max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-[var(--cera-cta)] text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-700 text-[var(--cera-body,#3c3733)] dark:text-gray-200 rounded-tl-none'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">
                      {message.role === 'assistant' ? renderMessageWithLinks(messageText) : messageText}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--cera-blush)] dark:bg-gray-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--cera-rose-ink)] dark:text-[var(--cera-rose)]" />
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-[var(--cera-muted,#6a625d)] dark:text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {chatTyping}
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg px-4 py-2 text-sm text-center">
                {chatError}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-[var(--cera-line,#e9e1de)] dark:border-gray-700">
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={chatPlaceholder}
                disabled={isLoading}
                className={`
                  flex-1 px-4 py-2.5 rounded-full
                  bg-[var(--cera-cream-deep,#f2eceb)] dark:bg-gray-800
                  border border-[var(--cera-line,#e9e1de)] dark:border-gray-700
                  text-sm text-[var(--cera-ink,#17140f)] dark:text-gray-100
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[var(--cera-ink)] focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isRTL ? 'text-right' : 'text-left'}
                `}
                dir={dir}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="
                  p-2.5 rounded-full
                  bg-[var(--cera-ink)] hover:bg-[var(--cera-body)]
                  text-white
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center
                "
                aria-label={chatSend}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                )}
              </button>
            </form>
            
            {/* Clear chat button */}
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="w-full mt-2 text-xs text-[var(--cera-muted,#6a625d)] hover:text-[var(--cera-body,#3c3733)] dark:hover:text-[var(--cera-blush-deep,#f0cfcd)] transition-colors"
              >
                {chatClear}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// Quick action button component with emoji support
function QuickActionButton({ 
  children, 
  onClick,
  emoji,
  highlight
}: { 
  children: React.ReactNode
  onClick: () => void
  emoji?: string
  highlight?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-full
        text-xs font-medium
        transition-all duration-200
        hover:scale-105 active:scale-95
        flex items-center gap-1
        ${highlight 
          ? 'bg-[var(--cera-cta)] text-white shadow-md hover:bg-[var(--cera-body)] border border-[var(--cera-cta)]'
          : 'bg-[var(--cera-cream-deep,#f2eceb)] dark:bg-gray-600 text-[var(--cera-body,#3c3733)] dark:text-gray-200 hover:bg-[var(--cera-blush)] hover:text-[var(--cera-rose-ink)] dark:hover:bg-gray-700 dark:hover:text-[var(--cera-rose)] border border-transparent hover:border-[var(--cera-blush-deep)] dark:hover:border-gray-600'
        }
      `}
    >
      {emoji && <span>{emoji}</span>}
      {children}
    </button>
  )
}
