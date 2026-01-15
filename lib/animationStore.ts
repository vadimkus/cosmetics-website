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
      enabled: true, // Always on - animations are permanently enabled
      toggleAnimation: () => set(() => ({ enabled: true })), // No-op: keep always enabled
    }),
    {
      name: 'animation-preference', // localStorage key
    }
  )
)