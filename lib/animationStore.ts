'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AnimationState {
  enabled: boolean
  toggleAnimation: () => void
}

export const useAnimationStore = create<AnimationState>()(
  persist(
    (set) => ({
      enabled: false, // Default: animations off
      toggleAnimation: () => set(() => ({ enabled: false })), // Keep always disabled
    }),
    {
      name: 'animation-preference', // localStorage key
    }
  )
)