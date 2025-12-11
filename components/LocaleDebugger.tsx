'use client'

import { useState, useEffect } from 'react'
import { Settings, RefreshCw, Loader2 } from 'lucide-react'
import { useClientOnly } from '@/hooks/useClientOnly'

export default function LocaleDebugger() {
  const hasMounted = useClientOnly()
  const [localeInfo, setLocaleInfo] = useState<{
    cookie: string | null
    browserLang: string
    currentPath: string
    detectedLocale: string
  } | null>(null)

  useEffect(() => {
    // Get locale information
    const getCurrentInfo = () => {
      // Get cookie value
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1] || null

      // Get browser language
      const browserLang = navigator.language || navigator.languages?.[0] || 'en'

      // Get current path
      const currentPath = window.location.pathname

      // Detect locale from path
      let detectedLocale = 'en'
      if (currentPath.startsWith('/ar')) detectedLocale = 'ar'
      else if (currentPath.startsWith('/ru')) detectedLocale = 'ru'

      return {
        cookie: cookieValue,
        browserLang,
        currentPath,
        detectedLocale
      }
    }

    setLocaleInfo(getCurrentInfo())
  }, [])

  const clearLocaleCookie = () => {
    // Clear the NEXT_LOCALE cookie
    document.cookie = 'NEXT_LOCALE=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    // Refresh the info
    setLocaleInfo(getCurrentInfo())
    
    // Reload page to see effect
    setTimeout(() => window.location.reload(), 1000)
  }

  const setLocaleCookie = (locale: 'en' | 'ar' | 'ru') => {
    // Set the NEXT_LOCALE cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`
    
    // Refresh the info
    setTimeout(() => {
      const newInfo = getCurrentInfo()
      setLocaleInfo(newInfo)
    }, 100)
  }

  const getCurrentInfo = () => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] || null

    const browserLang = navigator.language || navigator.languages?.[0] || 'en'
    const currentPath = window.location.pathname

    let detectedLocale = 'en'
    if (currentPath.startsWith('/ar')) detectedLocale = 'ar'
    else if (currentPath.startsWith('/ru')) detectedLocale = 'ru'

    return {
      cookie: cookieValue,
      browserLang,
      currentPath,
      detectedLocale
    }
  }

  if (!hasMounted || !localeInfo) {
    return (
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Locale Debug Information</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading locale information...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Locale Debug Information</h3>
      </div>

      <div className="grid gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Path:</span>
          <span className="font-mono">{localeInfo.currentPath}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Detected Locale:</span>
          <span className="font-bold text-primary-600">{localeInfo.detectedLocale}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Locale Cookie:</span>
          <span className={`font-mono ${localeInfo.cookie ? 'text-orange-600' : 'text-gray-400'}`}>
            {localeInfo.cookie || 'Not set'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Browser Language:</span>
          <span className="font-mono">{localeInfo.browserLang}</span>
        </div>
      </div>

      {localeInfo.cookie && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800 mb-2">
            <strong>Note:</strong> You have a locale cookie set to "{localeInfo.cookie}". 
            This causes automatic redirection to the {localeInfo.cookie} version.
          </p>
          <button
            onClick={clearLocaleCookie}
            className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Clear Cookie & Reset
          </button>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Set Locale Preference:</p>
        <div className="flex gap-2">
          <button
            onClick={() => setLocaleCookie('en')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              localeInfo.cookie === 'en' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLocaleCookie('ar')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              localeInfo.cookie === 'ar' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => setLocaleCookie('ru')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              localeInfo.cookie === 'ru' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Русский
          </button>
        </div>
      </div>
    </div>
  )
}