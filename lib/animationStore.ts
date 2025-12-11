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
      enabled: true, // Default: animations on
      toggleAnimation: () => set((state) => ({ enabled: !state.enabled })),
    }),
    {
      name: 'animation-preference', // localStorage key
    }
  )
)