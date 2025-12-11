'use client'
import { useAnimationStore } from '@/lib/animationStore'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const WaveLinesIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* First static line */}
      <path
        d="M5 2L5 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Second static line */}
      <path
        d="M11 2L11 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface AnimationToggleProps {
  className?: string
  size?: 'sm' | 'lg'
}

export const AnimationToggle = ({ className = '', size = 'sm' }: AnimationToggleProps) => {
  const { enabled, toggleAnimation } = useAnimationStore()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Don't render on server to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className={`
        ${size === 'sm' ? 'p-1.5 min-h-[32px] min-w-[32px]' : 'p-2 min-h-[44px] min-w-[44px]'}
        flex items-center justify-center ml-2 ${className}
      `} />
    )
  }
  
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const padding = size === 'sm' ? 'p-1.5' : 'p-2'
  
  return (
    <motion.button
      onClick={toggleAnimation}
      className={`
        ${padding} transition-colors flex items-center justify-center ml-2
        ${enabled ? 'text-green-600 hover:text-green-700' : 'text-gray-700 hover:text-primary-600'}
        touch-manipulation ${size === 'lg' ? 'min-h-[44px] min-w-[44px]' : ''}
        ${className}
      `}
      aria-label={`Animation ${enabled ? 'enabled' : 'disabled'}. Click to ${enabled ? 'disable' : 'enable'} animations`}
      title={`Animations: ${enabled ? 'ON' : 'OFF'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <WaveLinesIcon 
        className={`${iconSize} transition-colors`}
      />
    </motion.button>
  )
}