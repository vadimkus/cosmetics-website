import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fallback utility for when clsx/tailwind-merge are not available
export function cnFallback(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}
