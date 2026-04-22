'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface HeaderDesktopSearchProps {
  isRTL: boolean
}

/**
 * Desktop-only site-wide search input.
 * Submits to /products?search=QUERY which the products page already
 * reads via useSearchParams — no backend change required.
 *
 * Shortcut: "/" focuses the input (classic search-bar convention).
 */
export default function HeaderDesktopSearch({ isRTL }: HeaderDesktopSearchProps) {
  const router = useRouter()
  const { t, locale } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')

  const submit = useCallback(
    (value: string) => {
      const trimmed = value.trim()
      if (!trimmed) return
      const target = `${getLocalizedPath('/products', locale)}?search=${encodeURIComponent(trimmed)}`
      router.push(target)
    },
    [locale, router]
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      const isTyping =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target?.isContentEditable
      if (isTyping) return
      if (e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        submit(query)
      }}
      className="hidden md:flex items-center"
    >
      <label htmlFor="header-site-search" className="sr-only">
        {t('common.search')}
      </label>
      <div className="relative group">
        <span
          className={`pointer-events-none absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center text-gray-400 group-focus-within:text-primary-600 transition-colors`}
          aria-hidden="true"
        >
          <Search className="h-4 w-4" />
        </span>
        <input
          ref={inputRef}
          id="header-site-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('common.searchPlaceholder')}
          aria-label={t('common.search')}
          autoComplete="off"
          className={`w-44 lg:w-56 xl:w-72 h-9 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 ${isRTL ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'} focus:outline-none focus:border-primary-600 focus:bg-white focus:ring-2 focus:ring-primary-100 transition`}
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label={t('common.clear') || 'Clear'}
            className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-2.5' : 'right-0 pr-2.5'} flex items-center text-gray-400 hover:text-gray-600`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  )
}
