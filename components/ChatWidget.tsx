'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { useTranslation } from '@/hooks/useTranslation'
import { MessageCircle, X, Send, Loader2, Bot, User, Minimize2 } from 'lucide-react'

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

// Helper to render text with markdown links as clickable elements
function renderMessageWithLinks(text: string): React.ReactNode {
  // Match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match
  let keyIndex = 0

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    
    // Add the link
    const [, linkText, url] = match
    parts.push(
      <a
        key={keyIndex++}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-red-600 dark:text-red-400 underline hover:text-red-700 dark:hover:text-red-300 font-medium"
      >
        {linkText}
      </a>
    )
    
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  
  return parts.length > 0 ? parts : text
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
  const isRTL = dir === 'rtl'
  
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [inputValue, setInputValue] = useState('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Get user context for personalized greetings (used for welcome message)
  const userContext = getUserContext()
  
  const { messages, status, error, sendMessage, setMessages } = useChat({
    id: 'genosys-chat',
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

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
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, isMinimized])

  // Clear welcome message after first user message
  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false)
    }
  }, [messages])

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
      await sendMessage({ text: message })
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
      title: 'GENOSYS Beauty Advisor 💄',
      welcome: `${timeGreeting}\n\n${contextMsg}\n\nI'm your personal GENOSYS skincare expert. Ask me anything about Korean dermacosmetics, routines, or ingredients! 🇰🇷`,
      placeholder: 'Ask about skincare, ingredients, routines...',
      send: 'Send',
      typing: 'Thinking...',
      error: 'Oops! Something went wrong. Please try again.',
      clear: 'Clear chat',
    },
    ar: {
      title: 'مستشار جمال جينوسيس 💄',
      welcome: `${timeGreeting}\n\n${contextMsg}\n\nأنا خبير العناية بالبشرة الخاص بك في جينوسيس. اسألني أي شيء عن مستحضرات التجميل الكورية! 🇰🇷`,
      placeholder: 'اسأل عن العناية بالبشرة، المكونات...',
      send: 'إرسال',
      typing: 'جاري التفكير...',
      error: 'حدث خطأ! يرجى المحاولة مرة أخرى.',
      clear: 'مسح المحادثة',
    },
    ru: {
      title: 'Консультант GENOSYS 💄',
      welcome: `${timeGreeting}\n\n${contextMsg}\n\nЯ ваш личный эксперт по уходу за кожей GENOSYS. Спрашивайте о корейской косметике! 🇰🇷`,
      placeholder: 'Спросите об уходе, ингредиентах...',
      send: 'Отправить',
      typing: 'Думаю...',
      error: 'Упс! Что-то пошло не так. Попробуйте снова.',
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
    return (
      <button
        onClick={handleOpen}
        className={`
          fixed z-50 p-4 rounded-full shadow-lg
          bg-gradient-to-r from-red-600 to-red-500
          hover:from-red-700 hover:to-red-600
          text-white transition-all duration-300
          hover:scale-110 active:scale-95
          ${isRTL ? 'left-4 md:left-6' : 'right-4 md:right-6'}
          bottom-20 md:bottom-6
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
          ? 'bottom-20 md:bottom-6 w-72 h-14' 
          : 'bottom-20 md:bottom-6 w-[calc(100%-2rem)] md:w-96 h-[500px] max-h-[70vh]'
        }
        ${className}
      `}
      dir={dir}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {/* Welcome message */}
            {showWelcome && messages.length === 0 && (
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <p className="text-sm text-gray-700 dark:text-gray-200">{chatWelcome}</p>
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
                      ? 'bg-gray-200 dark:bg-gray-600' 
                      : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    {message.role === 'user' 
                      ? <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      : <Bot className="w-4 h-4 text-red-600 dark:text-red-400" />
                    }
                  </div>
                  <div className={`flex-1 max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-red-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-tl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">
                      {message.role === 'assistant' ? renderMessageWithLinks(messageText) : messageText}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Loading indicator */}
            {isLoading && (
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
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
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  text-sm text-gray-900 dark:text-gray-100
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
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
                  bg-red-600 hover:bg-red-700
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
                className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
  emoji
}: { 
  children: React.ReactNode
  onClick: () => void
  emoji?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        px-3 py-1.5 rounded-full
        bg-gray-100 dark:bg-gray-600
        text-xs text-gray-600 dark:text-gray-200
        hover:bg-red-100 hover:text-red-600
        dark:hover:bg-red-900 dark:hover:text-red-400
        transition-all duration-200
        hover:scale-105 active:scale-95
        border border-transparent hover:border-red-200
        dark:hover:border-red-700
        flex items-center gap-1
      "
    >
      {emoji && <span>{emoji}</span>}
      {children}
    </button>
  )
}
