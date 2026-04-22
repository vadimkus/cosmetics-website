'use client'

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Shared button primitive for GENOSYS.
 *
 * Purpose: establish a single source of truth for brand-red CTAs and
 * secondary/tertiary actions so future palette or interaction changes
 * only need to touch this file + the --brand-red tokens in globals.css.
 *
 * This primitive is opt-in: existing buttons across the app are not
 * being migrated in this commit. New code should prefer <Button> over
 * ad-hoc `bg-red-600`/`bg-primary-600` button classes.
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  loading?: boolean
}

const baseClasses = cn(
  'inline-flex items-center justify-center gap-2',
  'font-semibold whitespace-nowrap select-none',
  'rounded-lg transition-colors duration-150',
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  // touch target minimum (44px) comes from `size` via padding + min-h
)

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm px-3 py-1.5 min-h-[36px]',
  md: 'text-sm md:text-base px-4 py-2.5 min-h-[44px]',
  lg: 'text-base md:text-lg px-5 py-3 min-h-[48px]',
}

// Variants consume the --brand-red token so a palette change in
// globals.css automatically flows through every <Button variant="primary">.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--brand-red)] text-white hover:bg-[var(--brand-red-hover)] active:bg-[var(--brand-red-active)] focus-visible:ring-[color:var(--brand-red-ring)] shadow-sm hover:shadow',
  secondary:
    'bg-gray-900 text-white hover:bg-gray-800 active:bg-black focus-visible:ring-gray-400 shadow-sm',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-300',
  outline:
    'border border-[var(--brand-red)] text-[var(--brand-red)] bg-white hover:bg-[var(--brand-red-soft)] focus-visible:ring-[color:var(--brand-red-ring)]',
  danger:
    'bg-red-700 text-white hover:bg-red-800 active:bg-red-900 focus-visible:ring-red-300',
}

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
    <path
      d="M22 12a10 10 0 0 1-10 10"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    loading = false,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {loading ? <Spinner /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  )
})

export default Button
