'use client'

import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface ThemeToggleProps {
  /** Variant style */
  variant?: 'buttons' | 'switch' | 'selector'
  /** Show labels */
  showLabels?: boolean
  /** Additional class names */
  className?: string
}

/**
 * ThemeToggle Component
 * 
 * Allows users to switch between light, dark, and system theme modes.
 * 
 * Variants:
 * - 'buttons': Three separate buttons for each theme
 * - 'switch': Simple toggle switch between light/dark
 * - 'selector': Dropdown-style selector with all options
 */
export function ThemeToggle({ 
  variant = 'buttons', 
  showLabels = true,
  className = ''
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme, isClient } = useTheme()
  const { t, dir } = useTranslation()
  
  const isRTL = dir === 'rtl'

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className={`h-[44px] ${className}`}>
        {/* Placeholder to prevent layout shift */}
      </div>
    )
  }

  if (variant === 'switch') {
    return (
      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''} ${className}`}>
        {showLabels && (
          <span className="text-[17px] text-gray-900">
            {t('theme.darkMode') || 'Dark Mode'}
          </span>
        )}
        <button
          onClick={toggleTheme}
          className={`
            relative w-[51px] h-[31px] rounded-full transition-colors duration-200
            ${resolvedTheme === 'dark' ? 'bg-red-600' : 'bg-gray-200'}
          `}
          aria-label={resolvedTheme === 'dark' ? (t('theme.switchToLight') || 'Switch to light mode') : (t('theme.switchToDark') || 'Switch to dark mode')}
        >
          <div className={`
            absolute top-[2px] left-[2px]
            w-[27px] h-[27px] rounded-full bg-white shadow-sm
            transition-transform duration-200 flex items-center justify-center
            ${resolvedTheme === 'dark' ? 'translate-x-[20px]' : 'translate-x-0'}
          `}>
            {resolvedTheme === 'dark' ? (
              <Moon className="w-4 h-4 text-gray-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </div>
        </button>
      </div>
    )
  }

  if (variant === 'selector') {
    return (
      <div className={`${className}`}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          className="w-full px-4 py-3 bg-surface border border-border-primary rounded-system text-text-primary text-[17px] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]"
          aria-label={t('theme.selectTheme') || 'Select theme'}
        >
          <option value="light">{t('theme.light') || 'Light'}</option>
          <option value="dark">{t('theme.dark') || 'Dark'}</option>
          <option value="system">{t('theme.system') || 'System'}</option>
        </select>
      </div>
    )
  }

  // Default: buttons variant
  return (
    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} ${className}`}>
      <button
        onClick={() => setTheme('light')}
        className={`
          flex items-center justify-center gap-2 px-4 py-2.5 rounded-system min-h-[44px] transition-all duration-200
          ${theme === 'light' 
            ? 'bg-primary-600 text-white shadow-primary' 
            : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary border border-border-primary'
          }
        `}
        aria-label={t('theme.light') || 'Light mode'}
        aria-pressed={theme === 'light'}
      >
        <Sun className="w-5 h-5" />
        {showLabels && <span className="text-sm font-medium">{t('theme.light') || 'Light'}</span>}
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`
          flex items-center justify-center gap-2 px-4 py-2.5 rounded-system min-h-[44px] transition-all duration-200
          ${theme === 'dark' 
            ? 'bg-primary-600 text-white shadow-primary' 
            : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary border border-border-primary'
          }
        `}
        aria-label={t('theme.dark') || 'Dark mode'}
        aria-pressed={theme === 'dark'}
      >
        <Moon className="w-5 h-5" />
        {showLabels && <span className="text-sm font-medium">{t('theme.dark') || 'Dark'}</span>}
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`
          flex items-center justify-center gap-2 px-4 py-2.5 rounded-system min-h-[44px] transition-all duration-200
          ${theme === 'system' 
            ? 'bg-primary-600 text-white shadow-primary' 
            : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary border border-border-primary'
          }
        `}
        aria-label={t('theme.system') || 'System preference'}
        aria-pressed={theme === 'system'}
      >
        <Monitor className="w-5 h-5" />
        {showLabels && <span className="text-sm font-medium">{t('theme.system') || 'Auto'}</span>}
      </button>
    </div>
  )
}

/**
 * ThemeToggleItem - For use in profile lists (like PWAProfilePage)
 * Matches the SwitchItem component style
 */
interface ThemeToggleItemProps {
  isLast?: boolean
  isRTL?: boolean
}

export function ThemeToggleItem({ isLast = false, isRTL = false }: ThemeToggleItemProps) {
  const { theme, resolvedTheme, setTheme, isClient } = useTheme()
  const { t } = useTranslation()

  const themeLabels = {
    light: t('theme.light') || 'Light',
    dark: t('theme.dark') || 'Dark',
    system: t('theme.system') || 'System',
  }

  const currentLabel = themeLabels[theme]
  const resolvedLabel = theme === 'system' 
    ? `${themeLabels.system} (${resolvedTheme === 'dark' ? themeLabels.dark : themeLabels.light})`
    : currentLabel

  if (!isClient) {
    return (
      <div className={`flex items-center justify-between py-3 px-4 min-h-[56px] ${!isLast ? 'border-b border-gray-200' : ''}`}>
        <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
            <p className="text-[17px] text-gray-900">{t('theme.appearance') || 'Appearance'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between py-3 px-4 min-h-[56px] ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="w-8 h-8 flex items-center justify-center">
          {resolvedTheme === 'dark' ? (
            <Moon className="w-5 h-5 text-red-600" />
          ) : (
            <Sun className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
          <p className="text-[17px] text-gray-900">{t('theme.appearance') || 'Appearance'}</p>
          <p className="text-[15px] text-gray-500">{resolvedLabel}</p>
        </div>
      </div>
      
      {/* Theme selector buttons */}
      <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={() => setTheme('light')}
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center transition-colors
            ${theme === 'light' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          `}
          aria-label={t('theme.light') || 'Light'}
          aria-pressed={theme === 'light'}
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center transition-colors
            ${theme === 'dark' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          `}
          aria-label={t('theme.dark') || 'Dark'}
          aria-pressed={theme === 'dark'}
        >
          <Moon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('system')}
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center transition-colors
            ${theme === 'system' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          `}
          aria-label={t('theme.system') || 'System'}
          aria-pressed={theme === 'system'}
        >
          <Monitor className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ThemeToggle
