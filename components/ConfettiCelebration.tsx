'use client'

import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiCelebrationProps {
  trigger?: boolean
  duration?: number
  colors?: string[]
  particleCount?: number
  spread?: number
  onComplete?: () => void
}

export default function ConfettiCelebration({
  trigger = true,
  duration = 3000,
  colors = ['#dc2626', '#ffffff', '#fbbf24', '#f97316'], // Red, white, gold, orange
  particleCount = 50,
  spread = 70,
  onComplete
}: ConfettiCelebrationProps) {
  const animationEndRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!trigger) return

    const canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '9999'
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true
    })

    const animationEnd = Date.now() + duration
    animationEndRef.current = animationEnd

    // Confetti burst patterns
    const burst = () => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        if (canvasRef.current && document.body.contains(canvasRef.current)) {
          document.body.removeChild(canvasRef.current)
        }
        onComplete?.()
        return
      }

      const particleCountValue = particleCount * (timeLeft / duration)

      // Left side burst
      myConfetti({
        particleCount: particleCountValue,
        angle: 60,
        spread: spread,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 1,
        decay: 0.94,
        startVelocity: 30,
        scalar: 0.8
      })

      // Right side burst
      myConfetti({
        particleCount: particleCountValue,
        angle: 120,
        spread: spread,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        ticks: 200,
        gravity: 1,
        decay: 0.94,
        startVelocity: 30,
        scalar: 0.8
      })

      // Center top burst (special for celebration)
      if (timeLeft > duration - 500) {
        myConfetti({
          particleCount: particleCount * 2,
          angle: 90,
          spread: 120,
          origin: { x: 0.5, y: 0.3 },
          colors: colors,
          ticks: 300,
          gravity: 0.8,
          decay: 0.91,
          startVelocity: 45,
          scalar: 1.2,
          shapes: ['circle', 'square']
        })
      }

      requestAnimationFrame(burst)
    }

    // Start the confetti animation
    burst()

    // Cleanup function
    return () => {
      if (canvasRef.current && document.body.contains(canvasRef.current)) {
        document.body.removeChild(canvasRef.current)
      }
    }
  }, [trigger, duration, colors, particleCount, spread, onComplete])

  return null
}

// Alternative: Simple one-shot confetti export for manual triggering
export function triggerConfetti(options?: {
  colors?: string[]
  particleCount?: number
}) {
  const colors = options?.colors || ['#dc2626', '#ffffff', '#fbbf24', '#f97316']
  const particleCount = options?.particleCount || 100

  // Center explosion
  confetti({
    particleCount,
    spread: 180,
    origin: { y: 0.5 },
    colors,
    ticks: 200,
    gravity: 1,
    decay: 0.94,
    startVelocity: 30,
    scalar: 1
  })

  // Side bursts
  setTimeout(() => {
    confetti({
      particleCount: particleCount / 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    })
    confetti({
      particleCount: particleCount / 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    })
  }, 200)
}
