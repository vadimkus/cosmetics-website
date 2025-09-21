'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import icons to reduce bundle size
const StarIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.StarIcon })), {
  ssr: false
})

const ShoppingCartIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.ShoppingCartIcon })), {
  ssr: false
})

const HeartIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.HeartIcon })), {
  ssr: false
})

const MinusIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.MinusIcon })), {
  ssr: false
})

const PlusIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.PlusIcon })), {
  ssr: false
})

const TruckIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.TruckIcon })), {
  ssr: false
})

const ShieldCheckIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.ShieldCheckIcon })), {
  ssr: false
})

const LockClosedIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.LockClosedIcon })), {
  ssr: false
})

// Icon wrapper component with loading fallback
interface IconWrapperProps {
  children: React.ReactNode
  className?: string
}

function IconWrapper({ children, className = '' }: IconWrapperProps) {
  return (
    <Suspense fallback={<div className={`animate-pulse bg-gray-200 rounded ${className}`} />}>
      {children}
    </Suspense>
  )
}

// Export optimized icon components
export const OptimizedStarIcon = (props: any) => (
  <IconWrapper className="h-5 w-5">
    <StarIcon {...props} />
  </IconWrapper>
)

export const OptimizedShoppingCartIcon = (props: any) => (
  <IconWrapper className="h-5 w-5">
    <ShoppingCartIcon {...props} />
  </IconWrapper>
)

export const OptimizedHeartIcon = (props: any) => (
  <IconWrapper className="h-5 w-5">
    <HeartIcon {...props} />
  </IconWrapper>
)

export const OptimizedMinusIcon = (props: any) => (
  <IconWrapper className="h-5 w-5">
    <MinusIcon {...props} />
  </IconWrapper>
)

export const OptimizedPlusIcon = (props: any) => (
  <IconWrapper className="h-5 w-5">
    <PlusIcon {...props} />
  </IconWrapper>
)

export const OptimizedTruckIcon = (props: any) => (
  <IconWrapper className="h-5 w-5">
    <TruckIcon {...props} />
  </IconWrapper>
)

export const OptimizedShieldCheckIcon = (props: any) => (
  <IconWrapper className="h-5 w-5">
    <ShieldCheckIcon {...props} />
  </IconWrapper>
)

export const OptimizedLockClosedIcon = (props: any) => (
  <IconWrapper className="h-5 w-5">
    <LockClosedIcon {...props} />
  </IconWrapper>
)
